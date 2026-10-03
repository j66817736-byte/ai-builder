# Guía de Testing - AI Builder

## Tests Unitarios

### Estructura Esperada

```bash
__tests__/
├── core/
│   ├── projectScanner.test.ts
│   ├── projectAnalyzer.test.ts
│   └── validator.test.ts
├── security/
│   ├── privacy.test.ts
│   └── securityAudit.test.ts
└── generators/
    └── featureGenerator.test.ts
```

## Ejecutar Tests

```bash
# Instalar dependencias de testing
npm install --save-dev vitest @vitest/ui

# Ejecutar todos los tests
npm run test

# Ejecutar con cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

## Tests de Seguridad

### Validación de Secretos

```typescript
import { performSecurityValidation } from "../lib/security/securityAudit";

it("debe detectar API keys", async () => {
  const result = await performSecurityValidation(projectPath, projectInfo);
  expect(result.secrets.length).toBeGreaterThan(0);
});
```

### Privacidad

```typescript
import { sanitizeForOutput } from "../lib/security/privacy";

it("debe ocultar secretos en salida", () => {
  const input = "api_key=sk-123456";
  const output = sanitizeForOutput(input);
  expect(output).toContain("[REDACTED]");
  expect(output).not.toContain("sk-123456");
});
```

## Tests de Análisis de Proyectos

### Detección de Framework

```typescript
import { analyzeProject } from "../lib/core/projectAnalyzer";

it("debe detectar Next.js", async () => {
  const info = await analyzeProject("./test-projects/nextjs");
  expect(info.framework).toBe("Next.js");
});
```

## Tests de Validación

```typescript
import { runTypeChecks } from "../lib/validators/structureValidator";

it("debe pasar validación de tipos", () => {
  const result = runTypeChecks(projectInfo);
  expect(result.passed).toBe(true);
});
```

## Cobertura Mínima

- **Líneas**: 80%
- **Funciones**: 80%
- **Ramas**: 75%
- **Sentencias**: 80%

## Checklist de Testing

- [ ] Tests unitarios para cada módulo
- [ ] Tests de seguridad para validación de secretos
- [ ] Tests de privacidad
- [ ] Tests de análisis de proyectos
- [ ] Tests de generación de código
- [ ] Tests de validación de estructura
- [ ] Cobertura mínima del 80%
- [ ] Sin warnings en logs de tests

## CI/CD

Los tests se ejecutan automáticamente en:
- Pre-commit hooks
- Pull requests
- Antes de hacer push a main

---

**Documento de testing generado por AI Builder**
