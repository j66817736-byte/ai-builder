export const featureTemplates = {
  auth: {
    description: "Esqueleto de autenticación: valida credenciales en el servidor y delega contraseñas a una librería especializada.",
    template: `// Ejemplo independiente del framework; conectar con tu proveedor de identidad.\n// No almacenes contraseñas en texto claro ni inventes una implementación criptográfica propia.\nexport interface AuthUser { id: string; email: string }\nexport interface AuthProvider {\n  verifyCredentials(email: string, password: string): Promise<AuthUser | null>;\n}\nexport async function signIn(provider: AuthProvider, email: string, password: string) {\n  if (!email.trim() || password.length < 1) throw new Error("Credenciales incompletas");\n  const user = await provider.verifyCredentials(email.trim().toLowerCase(), password);\n  if (!user) throw new Error("Credenciales inválidas");\n  return { user };\n}\n`,
  },
  dashboard: {
    description: "Componente React pequeño para mostrar métricas; sustituye los datos de ejemplo por una fuente autorizada.",
    template: `type Metric = { label: string; value: string | number; change?: string };\nexport function Dashboard({ metrics }: { metrics: Metric[] }) {\n  return <main aria-labelledby="dashboard-title">\n    <h1 id="dashboard-title">Resumen</h1>\n    <section aria-label="Indicadores" className="metric-grid">\n      {metrics.map((metric) => <article key={metric.label}>\n        <h2>{metric.label}</h2><p>{metric.value}</p>\n        {metric.change && <small>{metric.change}</small>}\n      </article>)}\n    </section>\n  </main>;\n}\n`,
  },
  api: {
    description: "Ruta de ejemplo para Node.js con validación de entrada y respuestas JSON; adapta el runtime a tu framework.",
    template: `import type { IncomingMessage, ServerResponse } from "node:http";\nexport function healthRoute(_req: IncomingMessage, res: ServerResponse) {\n  res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });\n  res.end(JSON.stringify({ ok: true, timestamp: new Date().toISOString() }));\n}\n`,
  },
  crud: {
    description: "Operaciones CRUD en memoria para demostrar validación y separación de capas; reemplaza el almacenamiento de ejemplo.",
    template: `export type RecordItem = { id: string; name: string };\nexport function createRecord(name: string): RecordItem {\n  const trimmed = name.trim();\n  if (!trimmed || trimmed.length > 120) throw new Error("Nombre inválido");\n  return { id: crypto.randomUUID(), name: trimmed };\n}\n// Guarda los registros en un repositorio persistente con autorización por usuario.\n`,
  },
  tests: {
    description: "Prueba unitaria con Vitest para una función pura.",
    template: `import { describe, expect, it } from "vitest";\nimport { createRecord } from "./records";\ndescribe("createRecord", () => {\n  it("trimmea el nombre y asigna un id", () => {\n    const result = createRecord("  Ejemplo  ");\n    expect(result.name).toBe("Ejemplo");\n    expect(result.id).toBeTruthy();\n  });\n  it("rechaza un nombre vacío", () => {\n    expect(() => createRecord("  ")).toThrow("Nombre inválido");\n  });\n});\n`,
  },
  docs: {
    description: "Esqueleto de README con requisitos, instalación, comandos y advertencias de configuración.",
    template: `# Nombre del proyecto\n\n## Requisitos\n- Node.js en la versión documentada por package.json.\n\n## Instalación\n\`\`\`sh\nnpm install\n\`\`\`\n\n## Desarrollo\n\`\`\`sh\nnpm run dev\n\`\`\`\n\n## Configuración\nDocumenta aquí variables de entorno sin incluir sus valores secretos.\n`,
  },
  deploy: {
    description: "Checklist manual para un despliegue; no publica ni configura recursos automáticamente.",
    template: `# Lista de comprobación de despliegue\n- [ ] Ejecutar las pruebas y el build localmente.\n- [ ] Revisar secretos, dependencias, permisos y datos de prueba.\n- [ ] Configurar secretos en el gestor del proveedor, no en el repositorio.\n- [ ] Configurar HTTPS, registros y estrategia de rollback.\n- [ ] Confirmar dominio, región, coste y política de privacidad antes de publicar.\n`,
  },
} as const;

export type FeatureName = keyof typeof featureTemplates;
