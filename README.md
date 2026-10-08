# AI Builder

CLI local-first para analizar proyectos, revisar algunos riesgos de seguridad, generar documentación y crear un starter web. El modo local trabaja con reglas y plantillas incluidas; no es un modelo de IA ni envía archivos. Opcionalmente, el usuario puede solicitar generación con Google Gemini para un proyecto nuevo.

> AI Builder no sustituye una auditoría, no instala dependencias, no ejecuta código generado y no publica proyectos.

## Requisitos

- Node.js 22.13 o superior para ejecutar la CLI y las herramientas de desarrollo. Los starters Next.js generados requieren Node.js 20.9 o superior.
- Para los proyectos Next.js generados: Node.js 20.9 o superior, de acuerdo con la [documentación de Next.js](https://nextjs.org/docs/app/getting-started/installation).
- Gemini solo es necesario para `--provider gemini` y requiere una clave propia y acceso de red.

## Instalación desde el repositorio

```sh
npm ci
npm run build
npm test
npm link
```

También se puede ejecutar sin enlace global con `npm run dev -- --help`.

## Comandos

```sh
ai-builder --help
ai-builder analyze ./mi-proyecto
ai-builder validate ./mi-proyecto
ai-builder docs ./mi-proyecto
ai-builder complete auth
ai-builder complete dashboard
ai-builder generate "Landing accesible para una cafetería" --name cafeteria
```

`analyze` y `validate` son comprobaciones heurísticas, no análisis semánticos ni pruebas de penetración. `validate` retorna código de salida distinto de cero cuando detecta fallos. `docs` crea README y archivos en `docs/` **solo cuando aún no existen**, nunca los sobrescribe.

### Generar un starter

El generador local no requiere una clave ni acceso a la red:

```sh
ai-builder generate "Panel de métricas para un equipo pequeño" --name panel-metricas --out ./panel-metricas
cd panel-metricas
npm install
npm run dev
```

Genera una base Next.js App Router responsive, con TypeScript y archivos de configuración. No instala las dependencias al crearla. La carpeta de salida debe no existir; no se sobrescribe contenido existente.

### Generación opcional con Gemini

La solicitud a Gemini solo ocurre si se elige explícitamente el proveedor. Configura la clave fuera del repositorio y luego ejecuta:

```sh
export GEMINI_API_KEY="tu-clave"
ai-builder generate "Una landing de producto con FAQ" --name producto --provider gemini
```

Se envían a Google Gemini el nombre y la descripción de este proyecto nuevo, no archivos locales. Consulta los términos, privacidad, cuota y precios del proveedor antes de utilizarlo. La respuesta se valida para limitar rutas, tamaño y archivos protegidos; aun así, **revisa el código generado antes de ejecutarlo**. No hay instalación, ejecución de código ni despliegue automáticos. Se puede cambiar el modelo con `AI_BUILDER_GEMINI_MODEL`.

Documentación oficial: [Gemini generateContent](https://ai.google.dev/api/generate-content) y [seguridad de claves](https://ai.google.dev/gemini-api/docs/api-key).

### Plantillas de funciones

`complete` muestra una plantilla para `auth`, `dashboard`, `api`, `crud`, `tests`, `docs` o `deploy`. Las plantillas se imprimen en la terminal; el comando no inserta código en proyectos.

## Administrador local

```sh
ai-builder admin --status
ai-builder admin --enable
ai-builder admin --validate
ai-builder admin --register-device
ai-builder admin --list-devices
ai-builder admin --security-check
```

La contraseña se pide de forma oculta en una terminal interactiva. También se puede suministrar mediante `AI_BUILDER_ADMIN_SECRET`; evita pasarla como argumento, porque puede quedar en el historial o visible en la lista de procesos. Se exige una contraseña de al menos 12 caracteres; el verificador usa PBKDF2 con sal aleatoria. Los permisos de archivos se restringen y verifican en sistemas POSIX; en Windows, revisa manualmente las ACL de `~/.ai-builder/`.

El registro de dispositivos solo almacena metadatos locales. **No existe un panel web, sincronización remota ni comprobación de identidad física del dispositivo.**

## Seguridad y límites

- El escáner es estático, local y heurístico; puede producir falsos positivos o no detectar secretos/vulnerabilidades.
- No descarga avisos de dependencias ni valida su estado frente a bases externas.
- Nunca guardes claves de API en el repositorio. Mantén Gemini desactivado salvo que elijas `--provider gemini`.
- El código generado por IA debe tratarse como no confiable hasta ser revisado.
- Ver [SECURITY.md](SECURITY.md) para el modelo de amenazas y las limitaciones.

## Desarrollo y pruebas

```sh
npm run build
npm run lint
npm run typecheck
npm test
npm pack --dry-run
```

La CI ejecuta build, pruebas y empaquetado en versiones compatibles de Node.js.
