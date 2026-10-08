import type { ProjectInfo } from "../../types/project.js";

export interface FeatureAnalysis {
  missing: string[];
  recommendations: string[];
  plan: string[];
  strengths: string[];
}

export function analyzeFeatures(info: ProjectInfo): FeatureAnalysis {
  const missing: string[] = [];
  const recommendations: string[] = [];
  const strengths: string[] = [];

  if (info.hasPackageJson) strengths.push("package.json detectado");
  else missing.push("Manifiesto package.json");
  if (info.hasGitIgnore) strengths.push(".gitignore presente");
  else missing.push(".gitignore para excluir artefactos y archivos sensibles");
  if (info.hasTests) strengths.push("Infraestructura de pruebas detectada");
  else missing.push("Pruebas automatizadas");
  if (info.hasDocs) strengths.push("Documentación inicial detectada");
  else missing.push("Documentación de proyecto");

  if (info.type === "nextjs" || info.type === "react" || info.type === "vue") {
    if (!info.hasTsConfig && info.language !== "TypeScript") missing.push("Configuración TypeScript (opcional)");
    if (!info.hasTailwind) recommendations.push("Considera un sistema de estilos consistente; Tailwind es opcional.");
    if (!info.hasAuth) recommendations.push("Añade autenticación solo si el producto necesita cuentas o recursos privados.");
    if (!info.hasDashboard) recommendations.push("Añade un dashboard solo si el flujo de producto lo requiere.");
  }
  if (info.type === "express" || info.type === "node") {
    if (!info.hasTests) recommendations.push("Prueba validación de entradas, errores y rutas críticas.");
    if (!info.scripts.start && !info.scripts.dev) recommendations.push("Añade scripts de ejecución documentados en package.json.");
  }
  if (info.warnings.length) recommendations.push(...info.warnings);

  const plan = missing.length
    ? missing.map((item, index) => `${index + 1}. Revisar e implementar: ${item}`)
    : ["1. Mantener las pruebas y dependencias actualizadas", "2. Revisar los controles de seguridad antes de publicar"];

  return { missing, recommendations, plan, strengths };
}
