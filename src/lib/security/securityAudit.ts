import fs from "fs-extra";
import path from "path";
import type { ProjectInfo } from "../types/project.js";
import type { ValidationResult } from "../types/project.js";

const SECRET_PATTERNS = [
  { pattern: /(?:api[_-]?key|token|secret|password|passwd)\s*[=:]\s*['"]?([^'"\s]+)['"]?/gi, name: "API Key/Token" },
  { pattern: /Authorization:\s*Bearer\s+([^\s]+)/gi, name: "Bearer Token" },
  { pattern: /sk-[A-Za-z0-9]{20,}/gi, name: "OpenAI Key" },
  { pattern: /AKIA[0-9A-Z]{16}/gi, name: "AWS Key" },
  { pattern: /github_pat_[A-Za-z0-9_]{36,}/gi, name: "GitHub PAT" },
  { pattern: /ghp_[A-Za-z0-9_]{36,}/gi, name: "GitHub Personal Token" },
];

export async function deepSecurityAudit(
  projectPath: string,
  info: ProjectInfo
): Promise<{ vulnerabilities: string[]; warnings: string[] }> {
  const vulnerabilities: string[] = [];
  const warnings: string[] = [];

  try {
    // Revisar .env archivos
    const envFiles = [".env", ".env.local", ".env.production", ".env.development"];

    for (const envFile of envFiles) {
      const envPath = path.join(projectPath, envFile);
      if (await fs.pathExists(envPath)) {
        try {
          const content = await fs.readFile(envPath, "utf-8");
          let found = false;

          for (const { pattern, name } of SECRET_PATTERNS) {
            if (pattern.test(content)) {
              found = true;
              vulnerabilities.push(`⚠️ Posible ${name} en ${envFile}`);
            }
          }

          if (!found && envFile !== ".env" && envFile !== ".env.local") {
            warnings.push(`ℹ️ Archivo ${envFile} en repositorio - considera usar .gitignore`);
          }
        } catch (e) {
          // Ignorar errores de lectura
        }
      }
    }

    // Revisar .gitignore
    const gitignorePath = path.join(projectPath, ".gitignore");
    if (await fs.pathExists(gitignorePath)) {
      const gitignore = await fs.readFile(gitignorePath, "utf-8");
      if (!gitignore.includes(".env.local")) {
        warnings.push("⚠️ .gitignore no excluye .env.local");
      }
      if (!gitignore.includes("node_modules")) {
        warnings.push("⚠️ .gitignore no excluye node_modules");
      }
    } else {
      vulnerabilities.push("❌ No existe .gitignore - puede exponer información sensible");
    }

    // Revisar package.json por vulnerabilidades conocidas
    const pkgPath = path.join(projectPath, "package.json");
    if (await fs.pathExists(pkgPath)) {
      try {
        const pkg = await fs.readJson(pkgPath);
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

        // Advertir sobre versiones antiguas
        const outdatedPackages = ["express@<4.17", "react@<18", "next@<13"];

        for (const dep of Object.keys(allDeps)) {
          if (dep.includes("lodash") && !dep.includes("-es")) {
            warnings.push(`ℹ️ Considera usar lodash-es para reducir bundle`);
          }
        }
      } catch (e) {
        // Ignorar
      }
    }
  } catch (error) {
    // Ignorar errores generales
  }

  return { vulnerabilities, warnings };
}

export async function performSecurityValidation(
  projectPath: string,
  info: ProjectInfo
): Promise<ValidationResult> {
  const result: ValidationResult = {
    ok: true,
    checks: [],
    secrets: [],
    recommendations: [],
  };

  const audit = await deepSecurityAudit(projectPath, info);

  // Verificaciones básicas
  if (info.hasPackageJson) {
    result.checks.push({ name: "package.json existe", status: "pass" });
  } else {
    result.checks.push({ name: "package.json", status: "fail" });
    result.ok = false;
  }

  if (info.hasTsConfig) {
    result.checks.push({ name: "TypeScript configurado", status: "pass" });
  } else if (info.type === "nextjs") {
    result.checks.push({ name: "TypeScript", status: "warn" });
    result.recommendations.push("Configura TypeScript para mejor seguridad de tipos");
  }

  if (info.hasGitIgnore) {
    result.checks.push({ name: ".gitignore presente", status: "pass" });
  } else {
    result.checks.push({ name: ".gitignore", status: "fail" });
    result.ok = false;
    result.recommendations.push("Crea .gitignore para evitar subir archivos sensibles");
  }

  // Agregar vulnerabilidades encontradas
  if (audit.vulnerabilities.length > 0) {
    result.ok = false;
    result.secrets = audit.vulnerabilities;
    result.checks.push({ name: "Secretos detectados", status: "fail" });
  }

  // Agregar advertencias
  result.recommendations.push(...audit.warnings);

  // Recomendaciones finales
  if (result.recommendations.length === 0) {
    result.recommendations.push("✅ Configuración de seguridad básica lista");
  }

  return result;
}
