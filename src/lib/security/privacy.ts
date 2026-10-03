export function sanitizeForOutput(value: string): string {
  const secretPatterns = [
    /(?:api[_-]?key|token|secret|password|passwd)=([^\s]+)/gi,
    /Authorization:\s*Bearer\s+[^\s]+/gi,
    /sk-[A-Za-z0-9]+/gi,
  ];

  let sanitized = value;

  for (const pattern of secretPatterns) {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  }

  return sanitized;
}

export function isLocalOnlyMode(): boolean {
  return process.env.AI_BUILDER_MODE !== "cloud";
}

export function getPrivacyWarning(): string {
  return "Modo seguro: el análisis se realiza localmente por defecto. No se suben datos a servidores sin tu permiso.";
}
