import type { ProjectInfo } from "../types/project.js";

export function runTypeChecks(info: ProjectInfo): { passed: boolean; errors: string[] } {
  const errors: string[] = [];

  // Verificar coherencia de tipos
  if (!info.framework && info.type === "custom") {
    errors.push("No se pudo detectar framework automáticamente");
  }

  if (info.type === "nextjs" && !info.hasPackageJson) {
    errors.push("Proyecto Next.js sin package.json");
  }

  if (info.hasTsConfig && !info.hasPackageJson) {
    errors.push("TypeScript configurado pero sin package.json");
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

export function validateProjectStructure(info: ProjectInfo): { valid: boolean; suggestions: string[] } {
  const suggestions: string[] = [];

  if (info.directories.length === 0) {
    suggestions.push("Proyecto sin estructura de carpetas detectada");
  }

  if (info.rootFiles.length > 20) {
    suggestions.push("Demasiados archivos en la raíz - considera organizarlos");
  }

  if (!info.directories.includes("src") && !info.directories.includes("app")) {
    suggestions.push("Considera crear carpeta src/ o app/ para organizar el código");
  }

  if (!info.directories.includes("tests") && !info.directories.includes("__tests__")) {
    suggestions.push("No hay carpeta de tests - considera crearla");
  }

  return {
    valid: suggestions.length === 0,
    suggestions,
  };
}

export function validateFrameworkSetup(info: ProjectInfo): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (info.type === "nextjs" && !info.hasTsConfig) {
    issues.push("Next.js proyecto sin tsconfig.json");
  }

  if (info.type === "nextjs" && !info.hasTailwind) {
    issues.push("Considera agregar Tailwind CSS para mejor experiencia de desarrollo");
  }

  if (info.type === "react" && !info.hasPackageJson) {
    issues.push("Proyecto React sin package.json");
  }

  if (info.type === "express" && !info.hasPackageJson) {
    issues.push("Proyecto Express sin package.json - no podrá funcionar");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
