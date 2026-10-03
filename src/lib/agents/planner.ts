export type PlannerOutput = {
  goal: string;
  plan: string[];
};

export function plannerFromProject(projectName: string): PlannerOutput {
  return {
    goal: `Continuar y completar el proyecto "${projectName}"`,
    plan: [
      "Analizar la estructura actual",
      "Detectar qué falta",
      "Proponer mejoras",
      "Generar cambios útiles",
      "Validar la base",
    ],
  };
}
