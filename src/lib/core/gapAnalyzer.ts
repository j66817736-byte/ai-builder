import type { ProjectSummary } from "./projectScanner.js";

export type GapAnalysis = {
  missing: string[];
  strengths: string[];
  suggestions: string[];
};

export function analyzeGaps(summary: ProjectSummary): GapAnalysis {
  const missing: string[] = [];
  const strengths: string[] = [];
  const suggestions: string[] = [];

  if (!summary.hasPackageJson) {
    missing.push("package.json");
  }

  if (!summary.hasTsConfig && summary.framework === "Next.js") {
    missing.push("tsconfig.json");
  }

  if (summary.framework === "Next.js" && !summary.hasTailwind) {
    suggestions.push("Añadir Tailwind CSS para mejorar la UI y la velocidad de trabajo.");
  }

  if (summary.framework === "React" && !summary.hasTailwind) {
    suggestions.push("Instalar Tailwind para un diseño más moderno.");
  }

  if (summary.framework === "Express") {
    strengths.push("Tiene estructura backend.");
    suggestions.push("Revisa autenticación, validación y tests.");
  }

  if (summary.framework === "Next.js") {
    strengths.push("Tiene potencial de frontend moderno.");
    suggestions.push("Considera dashboard, auth, y estructura modular.");
  }

  return {
    missing,
    strengths,
    suggestions,
  };
}
