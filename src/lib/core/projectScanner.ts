import fs from "fs-extra";
import path from "node:path";

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
    framework: null, language: null, hasPackageJson: false, hasNextConfig: false,
    hasTsConfig: false, hasTailwind: false, rootFiles: [], directories: [], warnings: [],
  };
  const absolutePath = path.resolve(projectPath);
  if (!(await fs.pathExists(absolutePath))) {
    summary.warnings.push("La ruta del proyecto no existe.");
    return summary;
  }
  const stat = await fs.stat(absolutePath);
  if (!stat.isDirectory()) {
    summary.warnings.push("La ruta indicada no es una carpeta.");
    return summary;
  }
  let entries: string[];
  try { entries = await fs.readdir(absolutePath); }
  catch { summary.warnings.push("No se pudo leer la carpeta; comprueba los permisos."); return summary; }

  summary.rootFiles = entries;
  for (const entry of entries) {
    try { if ((await fs.stat(path.join(absolutePath, entry))).isDirectory()) summary.directories.push(entry); }
    catch { /* Mantiene el escáner tolerante a archivos que cambian durante el análisis. */ }
  }
  summary.hasPackageJson = entries.includes("package.json");
  summary.hasNextConfig = ["next.config.js", "next.config.mjs", "next.config.ts"].some((name) => entries.includes(name));
  summary.hasTsConfig = entries.includes("tsconfig.json");
  summary.hasTailwind = ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.mjs"].some((name) => entries.includes(name));

  if (summary.hasPackageJson) {
    try {
      const pkg = await fs.readJson(path.join(absolutePath, "package.json"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.next) summary.framework = "Next.js";
      else if (deps.react) summary.framework = "React";
      else if (deps.vue) summary.framework = "Vue";
      else if (deps.express) summary.framework = "Express";
      summary.language = summary.hasTsConfig ? "TypeScript" : pkg.type === "module" ? "JavaScript (ESM)" : "JavaScript";
    } catch { summary.warnings.push("package.json no contiene JSON válido."); }
  }
  if (!summary.framework) summary.warnings.push("No se detectó un framework conocido; el proyecto puede ser personalizado.");
  return summary;
}
