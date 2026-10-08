import fs from "fs-extra";
import path from "node:path";
import type { ProjectInfo, ValidationResult } from "../../types/project.js";

const SKIP_DIRS = new Set([".git", "node_modules", "dist", "build", ".next", "coverage", ".turbo", "vendor"]);
const TEXT_EXTENSIONS = new Set([".env", ".json", ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts", ".py", ".go", ".java", ".cs", ".php", ".rb", ".sh", ".yml", ".yaml", ".toml", ".ini", ".properties", ".md", ".txt"]);
const MAX_FILES = 2500;
const MAX_FILE_BYTES = 1024 * 1024;
const SECRET_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\b(?:sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9_]{36,}|github_pat_[A-Za-z0-9_]{36,}|AKIA[0-9A-Z]{16})\b/g, label: "clave de servicio reconocible" },
  { pattern: /(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd|secret)\s*[=:]\s*["']?([A-Za-z0-9_./+=-]{12,})["']?/gi, label: "credencial asignada en texto" },
  { pattern: /Authorization\s*:\s*Bearer\s+([A-Za-z0-9._~+/-]{16,})/gi, label: "token Bearer" },
];
const PLACEHOLDER = /^(?:your[_ -]?|replace[_ -]?|example|sample|changeme|change[_ -]?me|placeholder|<|\$\{|\*{3,})/i;
const ENV_REFERENCE = /^(?:process\.env\.|import\.meta\.env\.|Deno\.env\.|env\[|secrets?\[|getenv\()/i;

function relativeLabel(root: string, file: string): string {
  return path.relative(root, file).split(path.sep).join("/");
}

function isIgnoredEnvFile(gitignore: string, name: string): boolean {
  const rules = gitignore.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
  return rules.some((rule) => {
    const normalized = rule.replace(/^\//, "").replace(/\/$/, "");
    if (normalized === ".env*" || normalized === "*.env" || normalized === "*.env.*") return true;
    if (normalized === name) return true;
    return normalized === ".env" && name === ".env";
  });
}

async function collectTextFiles(root: string): Promise<string[]> {
  const found: string[] = [];
  async function walk(dir: string, depth: number): Promise<void> {
    if (depth > 8 || found.length >= MAX_FILES) return;
    let entries;
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      if (found.length >= MAX_FILES) break;
      if (entry.isSymbolicLink()) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) await walk(full, depth + 1);
      } else if (entry.isFile()) {
        const isEnv = /^\.env(?:\..+)?$/.test(entry.name) && entry.name !== ".env.example";
        if (isEnv || TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) found.push(full);
      }
    }
  }
  await walk(root, 0);
  return found;
}

export async function deepSecurityAudit(projectPath: string, _info: ProjectInfo): Promise<{ vulnerabilities: string[]; warnings: string[] }> {
  const root = path.resolve(projectPath);
  const vulnerabilities = new Set<string>();
  const warnings: string[] = [];
  const gitignorePath = path.join(root, ".gitignore");
  const gitignoreExists = await fs.pathExists(gitignorePath);
  const gitignore = gitignoreExists ? await fs.readFile(gitignorePath, "utf8") : "";
  if (!gitignoreExists) vulnerabilities.add("No se encontró .gitignore; revisa que archivos privados no entren al control de versiones.");
  else if (!isIgnoredEnvFile(gitignore, ".env") || !isIgnoredEnvFile(gitignore, ".env.local")) {
    warnings.push("Comprueba que .gitignore excluya .env y .env.local.");
  }

  let scanned = 0;
  for (const file of await collectTextFiles(root)) {
    let stat;
    try { stat = await fs.stat(file); } catch { continue; }
    if (stat.size > MAX_FILE_BYTES) continue;
    let content: string;
    try { content = await fs.readFile(file, "utf8"); } catch { continue; }
    scanned += 1;
    const relative = relativeLabel(root, file);
    if (/^\.env(?:\.(?:local|production|development))?$/.test(path.basename(file)) && !isIgnoredEnvFile(gitignore, path.basename(file))) {
      vulnerabilities.add(`Archivo de entorno potencialmente publicable: ${relative}.`);
    }
    for (const { pattern, label } of SECRET_PATTERNS) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(content)) !== null) {
        const candidate = match[1] ?? match[0];
        if (PLACEHOLDER.test(candidate) || ENV_REFERENCE.test(candidate) || /^(?:true|false|null|undefined|none|redacted)$/i.test(candidate)) continue;
        vulnerabilities.add(`Posible ${label} en ${relative}; el valor se ha omitido.`);
        if (!pattern.global) break;
      }
    }
  }
  if (scanned >= MAX_FILES) warnings.push(`Auditoría limitada a ${MAX_FILES} archivos de texto por seguridad y rendimiento.`);

  const pkgPath = path.join(root, "package.json");
  if (await fs.pathExists(pkgPath)) {
    try {
      const pkg = await fs.readJson(pkgPath);
      if (!pkg.name) warnings.push("package.json no define el nombre del paquete.");
      if (!pkg.scripts?.test) warnings.push("No se detectó un script de pruebas en package.json.");
    } catch {
      vulnerabilities.add("package.json no contiene JSON válido.");
    }
  }
  return { vulnerabilities: [...vulnerabilities], warnings };
}

export async function performSecurityValidation(projectPath: string, info: ProjectInfo): Promise<ValidationResult> {
  const result: ValidationResult = { ok: true, checks: [], secrets: [], recommendations: [] };
  const audit = await deepSecurityAudit(projectPath, info);
  const add = (name: string, status: "pass" | "warn" | "fail", message?: string) => {
    result.checks.push({ name, status, ...(message ? { message } : {}) });
    if (status === "fail") result.ok = false;
  };

  add("package.json", info.hasPackageJson ? "pass" : "warn", info.hasPackageJson ? undefined : "No es un proyecto Node.js o no hay manifiesto en la raíz.");
  add(".gitignore", info.hasGitIgnore ? "pass" : "warn", info.hasGitIgnore ? undefined : "Añádelo y excluye archivos locales y secretos.");
  if (info.type === "nextjs" && !info.hasTsConfig) result.recommendations.push("Considera TypeScript para mejorar la verificación estática.");
  if (audit.vulnerabilities.length) {
    result.secrets = audit.vulnerabilities;
    add("Secretos y archivos sensibles", "fail", `${audit.vulnerabilities.length} hallazgo(s); no se muestran valores secretos.`);
  } else add("Secretos detectables", "pass", "No se encontraron patrones conocidos en el conjunto de archivos revisado.");
  result.recommendations.push(...audit.warnings);
  if (!result.recommendations.length) result.recommendations.push("Sin recomendaciones adicionales para las comprobaciones básicas.");
  return result;
}
