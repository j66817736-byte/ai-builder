const SECRET_PATTERNS: RegExp[] = [
  /((?:api[_-]?key|access[_-]?token|auth[_-]?token|token|secret|password|passwd)\s*[=:]\s*)(['"]?)([^\s'";,]+)\2/gi,
  /(Authorization:\s*Bearer\s+)[^\s]+/gi,
  /\b(?:sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16})\b/g,
];

export function sanitizeForOutput(value: string): string {
  return SECRET_PATTERNS.reduce((text, pattern) => text.replace(pattern, (_match, prefix?: string) => prefix ? `${prefix}[REDACTED]` : "[REDACTED]"), value);
}

export function isLocalOnlyMode(): boolean {
  return process.env.AI_BUILDER_MODE !== "cloud";
}

export function getPrivacyWarning(): string {
  return "Modo local: el análisis no envía archivos ni datos a servicios externos. Solo la generación remota solicitada explícitamente transmite el nombre y la descripción al proveedor elegido.";
}

export function getSecurityAdvice(): string {
  return "Consejo de seguridad: nunca publiques claves o archivos .env; esta herramienta usa comprobaciones heurísticas y no sustituye una auditoría profesional.";
}
