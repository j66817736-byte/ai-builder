import type { ProjectInfo } from "../../types/project.js";

function listOrNone(values: string[], fallback = "- No detectado"): string {
  return values.length ? values.map((value) => `- ${value}`).join("\n") : fallback;
}

export async function generateAutoDocumentation(info: ProjectInfo): Promise<string> {
  const scripts = Object.entries(info.scripts).map(([name, command]) => `- npm run ${name}: ${command}`);
  return `# ${info.name}\n\n${info.description ?? "Documentación inicial generada por AI Builder; revisa y personaliza cada sección."}\n\n## Stack detectado\n\n- Framework: ${info.framework ?? "Personalizado/no detectado"}\n- Lenguaje: ${info.language}\n- Tipo: ${info.type}\n\n## Estructura\n\n${listOrNone(info.directories.map((name) => `${name}/`))}\n\n## Requisitos e instalación\n\nRevisa package.json para conocer los requisitos del proyecto. Si utiliza npm, ejecuta npm install.\n\n## Scripts\n\n${listOrNone(scripts)}\n\n## Configuración\n\nDocumenta las variables de entorno necesarias en un archivo de ejemplo sin valores secretos. Mantén los secretos fuera del control de versiones.\n\n## Calidad y seguridad\n\nAI Builder realiza comprobaciones estáticas heurísticas; no sustituye revisión manual, pruebas funcionales ni auditoría de seguridad.\n`;
}

export async function generateArchitectureDoc(info: ProjectInfo): Promise<string> {
  return `# Arquitectura de ${info.name}\n\n## Resumen\n\n- Framework detectado: ${info.framework ?? "No detectado"}\n- Tipo: ${info.type}\n- Lenguaje: ${info.language}\n\n## Carpetas en la raíz\n\n${listOrNone(info.directories.map((directory) => `${directory}/`))}\n\n## Dependencias directas\n\n${listOrNone(info.dependencies.slice(0, 50))}\n\n## Scripts disponibles\n\n${listOrNone(Object.entries(info.scripts).map(([name, command]) => `${name}: ${command}`))}\n\nEsta descripción se genera mediante inspección local de nombres y metadatos; no realiza análisis semántico del código.\n`;
}

export async function generateSecurityChecklist(info: ProjectInfo): Promise<string> {
  return `# Lista de comprobación de seguridad\n\nEstado detectado al generar este documento:\n\n- [${info.hasGitIgnore ? "x" : " "}] .gitignore presente\n- [${info.hasTests ? "x" : " "}] Pruebas automatizadas detectadas\n- [ ] Confirmar que los archivos .env privados estén excluidos de Git\n- [ ] Revisar permisos y autorización en rutas privadas\n- [ ] Escanear dependencias con una herramienta de confianza\n- [ ] Revisar manejo, retención y borrado de datos\n- [ ] Ejecutar pruebas antes de desplegar\n\nAI Builder no es un escáner profesional ni valida dependencias contra una base remota.\n`;
}

export async function generateTodoList(info: ProjectInfo): Promise<string> {
  const todos: string[] = [];
  if (!info.hasGitIgnore) todos.push("Crear .gitignore y excluir secretos y artefactos de build");
  if (!info.hasTests) todos.push("Añadir pruebas automatizadas");
  if (!info.hasDocs) todos.push("Revisar y completar documentación");
  if (info.warnings.length) todos.push(...info.warnings);
  return `# Pendientes de ${info.name}\n\n${todos.length ? todos.map((item) => `- [ ] ${item}`).join("\n") : "- [x] No se detectaron pendientes básicos."}\n\nEsta lista es orientativa y se basa en comprobaciones heurísticas locales.\n`;
}

export async function generateChangeLog(): Promise<string> {
  const date = new Date().toISOString().slice(0, 10);
  return `# Changelog\n\n## [Unreleased] - ${date}\n\n- Documentación base generada por AI Builder.\n\nMantén este archivo manualmente para registrar cambios reales; el generador no inventa un historial de versiones.\n`;
}
