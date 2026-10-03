import fs from "fs-extra";
import path from "path";

export type ProjectSummary = {
  framework: string | null;
  language: string | null;
  hasPackageJson: boolean;
  hasNextConfig: boolean;
  hasTsConfig: boolean;
  hasTailwind: boolean;
  rootFiles: string[];
  directories: string[];
  warnings: string[];
};

export async function scanProject(projectPath: string): Promise<ProjectSummary> {
  const summary: ProjectSummary = {
    framework: null,
    language: null,
    hasPackageJson: false,
    hasNextConfig: false,
    hasTsConfig: false,
    hasTailwind: false,
    rootFiles: [],
    directories: [],
    warnings: [],
  };

  if (!(await fs.pathExists(projectPath))) {
    summary.warnings.push("La ruta del proyecto no existe.");
    return summary;
  }

  const entries = await fs.readdir(projectPath);

  summary.rootFiles = entries;
  summary.directories = entries.filter((entry) => {
    const full = path.join(projectPath, entry);
    return fs.existsSync(full) && fs.statSync(full).isDirectory();
  });

  if (entries.includes("package.json")) {
    summary.hasPackageJson = true;
  }

  if (entries.includes("next.config.js") || entries.includes("next.config.mjs")) {
    summary.hasNextConfig = true;
  }

  if (entries.includes("tsconfig.json")) {
    summary.hasTsConfig = true;
  }

  if (entries.includes("tailwind.config.js") || entries.includes("tailwind.config.ts")) {
    summary.hasTailwind = true;
  }

  const pkgPath = path.join(projectPath, "package.json");

  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);

    if (pkg.dependencies?.next || pkg.devDependencies?.next) {
      summary.framework = "Next.js";
    } else if (pkg.dependencies?.react || pkg.devDependencies?.react) {
      summary.framework = "React";
    } else if (pkg.dependencies?.express || pkg.devDependencies?.express) {
      summary.framework = "Express";
    }

    summary.language = pkg.type === "module" ? "TypeScript/JavaScript" : "JavaScript";
  }

  if (!summary.framework) {
    summary.warnings.push("No se detectó un framework común. Puede ser un proyecto personalizado.");
  }

  return summary;
}
