# Pruebas de AI Builder

## Requisitos

Node.js 22.13 o superior. Instala las dependencias con `npm ci`.

## Comprobaciones

```sh
npm run build
npm run lint
npm test
npm pack --dry-run
```

## Cobertura funcional

El conjunto automatizado verifica análisis de metadatos, recomendaciones, detección y redacción de patrones secretos, plantillas, creación segura del starter local, rechazo de rutas peligrosas y llamadas Gemini simuladas mediante un `fetch` de prueba. Las pruebas no llaman a servicios remotos ni requieren claves.

La salida del modelo se prueba con respuestas sintéticas; esto no valida calidad del modelo ni condiciones del servicio remoto. El escáner de secretos es heurístico y no es una auditoría de seguridad.

## Integración continua

`.github/workflows/ci.yml` ejecuta instalación limpia, compilación, pruebas, lint, auditoría npm y verificación de empaquetado en la matriz de sistemas operativos y versiones de Node.js configurada.
