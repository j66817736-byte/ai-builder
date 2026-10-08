import fs from "fs-extra";
import path from "node:path";
import type { ProjectInfo, ProjectKind } from "../../types/project.js";
import { scanProject } from "./projectScanner.js";

const FRAMEWORKS: Array<{ kind: ProjectKind; label: string; packages: string[] }> = [
  { kind: "nextjs", label: "Next.js", packages: ["next"] },
  { kind: "react", label: "React", packages: ["react"] },
  { kind: "vue", label: "Vue", packages: ["vue"] },
  { kind: "express", label: "Express", packages: ["express"] },
];

function hasAny(values: string[], candidates: string[]): boolean {
  return candidates.some((candidate) => values.includes(candidate));
}

export async function analyzeProject(targetPath: string): Promise<ProjectInfo> {
  const projectPath = path.resolve(targetPath);
  const summary = await scanProject(projectPath);
  if (!(await fs.pathExists(projectPath))) {
    throw new Error(`No existe la ruta del proyecto: ${projectPath}`);
  }
  const stat = await fs.stat(projectPath);
  if (!stat.isDirectory()) throw new Error(`La ruta no es una carpeta: ${projectPath}`);

  const manifestPath = path.join(projectPath, "package.json");
  let manifest: Record<string, unknown> = {};
  if (await fs.pathExists(manifestPath)) {
    try {
      manifest = await fs.readJson(manifestPath);
    } catch {
      throw new Error("package.json existe pero no contiene JSON válido.");
    }
  }

  const dependenciesMap = {
    ...((manifest.dependencies as Record<string, string> | undefined) ?? {}),
    ...((manifest.devDependencies as Record<string, string> | undefined) ?? {}),
  };
  const dependencies = Object.keys(dependenciesMap).sort();
  const detectedFramework = FRAMEWORKS.find((item) => hasAny(dependencies, item.packages));
  const rootFiles = summary.rootFiles;
  const directories = summary.directories;
  const scripts = (manifest.scripts as Record<string, string> | undefined) ?? {};
  const testsDir = hasAny(directories, ["test", "tests", "__tests__"]);
  const hasTests = testsDir || ["test", "tests", "vitest", "jest"].some((key) => key in scripts) ||
    hasAny(dependencies, ["vitest", "jest", "mocha", "@playwright/test"]);
  const hasAuth = hasAny(dependencies, ["next-auth", "@auth/core", "passport", "passport-local", "@clerk/nextjs", "better-auth"]) ||
    hasAny(directories, ["auth", "authentication"]);
  const hasDashboard = hasAny(directories, ["dashboard", "admin", "admin-dashboard"]);
  const hasDocs = hasAny(directories, ["docs", "documentation"]) || hasAny(rootFiles, ["README.md", "readme.md"]);
  const language = summary.hasTsConfig || rootFiles.some((file) => /\.(ts|tsx|mts|cts)$/.test(file))
    ? "TypeScript" : (rootFiles.some((file) => /\.(js|jsx|mjs|cjs)$/.test(file)) || summary.hasPackageJson ? "JavaScript" : "Desconocido");
  const packageName = typeof manifest.name === "string" ? manifest.name : path.basename(projectPath);
  const name = packageName || path.basename(projectPath);

  return {
    path: projectPath,
    name,
    description: typeof manifest.description === "string" ? manifest.description : null,
    framework: detectedFramework?.label ?? null,
    language,
    type: detectedFramework?.kind ?? (summary.hasPackageJson ? "node" : "custom"),
    hasPackageJson: summary.hasPackageJson,
    hasNextConfig: summary.hasNextConfig,
    hasTsConfig: summary.hasTsConfig,
    hasTailwind: summary.hasTailwind || hasAny(dependencies, ["tailwindcss"]),
    hasTests,
    hasAuth,
    hasDashboard,
    hasDocs,
    hasGitIgnore: rootFiles.includes(".gitignore"),
    rootFiles,
    directories,
    dependencies,
    scripts,
    warnings: summary.warnings,
  };
}
