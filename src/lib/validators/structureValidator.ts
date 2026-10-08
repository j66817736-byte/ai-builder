import type { ProjectInfo } from "../../types/project.js";

export function runTypeChecks(info: ProjectInfo): { passed: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!info.name.trim()) errors.push("No se pudo determinar el nombre del proyecto");
  if (info.type === "nextjs" && !info.hasPackageJson) errors.push("Proyecto Next.js sin package.json");
  if (info.hasTsConfig && !info.hasPackageJson) errors.push("TypeScript configurado pero sin package.json");
  return { passed: errors.length === 0, errors };
}

export function validateProjectStructure(info: ProjectInfo): { valid: boolean; suggestions: string[] } {
  const suggestions: string[] = [];
  if (!info.directories.includes("src") && !info.directories.includes("app")) suggestions.push("Considera organizar el código en src/ o app/.");
  if (!info.hasTests) suggestions.push("No se detectaron pruebas automatizadas.");
  if (info.rootFiles.length > 20) suggestions.push("Hay muchos archivos en la raíz; considera organizarlos.");
  return { valid: true, suggestions };
}

export function validateFrameworkSetup(info: ProjectInfo): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (info.type === "nextjs" && !info.hasPackageJson) issues.push("Next.js requiere package.json.");
  if (info.type === "express" && !info.hasPackageJson) issues.push("Express requiere package.json.");
  return { valid: issues.length === 0, issues };
}
