import type { ProjectInfo } from "../../types/project.js";

export interface HealthStatus {
  emoji: string;
  status: "Saludable" | "Aceptable" | "Necesita atención";
}

export function getPerformanceMetrics(info: ProjectInfo): { score: number; details: string[] } {
  let score = 40;
  const details: string[] = [];
  const award = (condition: boolean, points: number, label: string) => {
    if (condition) {
      score += points;
      details.push(`✅ ${label}`);
    } else {
      details.push(`⚪ ${label}: no detectado`);
    }
  };

  award(info.hasPackageJson, 10, "Manifiesto de dependencias");
  award(info.hasGitIgnore, 10, "Exclusiones de Git");
  award(info.hasTests, 15, "Pruebas automatizadas");
  award(info.hasDocs, 10, "Documentación");
  award(info.hasTsConfig, 5, "Configuración TypeScript");
  award(info.directories.length > 0, 5, "Estructura en carpetas");
  award(info.scripts.build !== undefined, 5, "Script de build");
  score -= Math.min(info.warnings.length * 3, 15);
  return { score: Math.max(0, Math.min(100, score)), details };
}

export function getHealthStatus(score: number): HealthStatus {
  if (score >= 80) return { emoji: "🟢", status: "Saludable" };
  if (score >= 55) return { emoji: "🟡", status: "Aceptable" };
  return { emoji: "🔴", status: "Necesita atención" };
}
