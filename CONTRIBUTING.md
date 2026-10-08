# Contribuir a AI Builder

Gracias por contribuir. AI Builder pretende funcionar localmente por defecto, transmitir datos a terceros solo mediante una opción explícita y no ejecutar código generado automáticamente.

## Preparación

```sh
git clone https://github.com/j66817736-byte/ai-builder.git
cd ai-builder
npm ci
```

## Desarrollo y verificación

```sh
npm run dev -- --help
npm run build
npm run lint
npm test
npm pack --dry-run
```

La CI aplica los mismos controles en Linux y Windows, con Node.js 22 y 24. No es necesario configurar claves para las pruebas; los tests de Gemini usan respuestas sintéticas.

## Principios para cambios

Mantén las entradas validadas, los errores sin datos secretos, el modo local como predeterminado y las escrituras no destructivas. Si un cambio transmite datos, ejecútalo únicamente tras una elección explícita del usuario y documenta exactamente qué dato sale y a qué proveedor. No ejecutes automáticamente código generado ni scripts del modelo.

Cada cambio funcional debe incluir pruebas y actualizar README.md, USAGE_GUIDE.md, SECURITY.md y CHANGELOG.md cuando aplique. No añadas credenciales reales, datos personales ni binarios al repositorio.

## Pull requests

Describe el problema, los cambios, las pruebas ejecutadas y cualquier limitación restante. Antes de solicitar revisión, comprueba que build, lint, tests y `npm pack --dry-run` pasen.
