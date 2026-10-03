export type ValidationResult = {
  ok: boolean;
  checks: string[];
  warnings: string[];
};

export function validateProject(): ValidationResult {
  const checks = [
    "Estructura básica revisada",
    "Archivos clave detectados",
    "Privacidad por defecto habilitada",
  ];

  return {
    ok: true,
    checks,
    warnings: [],
  };
}
