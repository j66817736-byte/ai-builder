# Guía de uso de AI Builder

## Instalación desde el repositorio

Se requiere Node.js 22.13 o superior para la CLI y las herramientas de desarrollo.

```sh
npm ci
npm run build
npm test
npm link
```

## Análisis, validación y documentación

```sh
ai-builder analyze ./mi-proyecto
ai-builder validate ./mi-proyecto
ai-builder docs ./mi-proyecto
```

El análisis de stack es heurístico. La validación revisa metadatos, archivos de configuración y patrones de secretos conocidos, sin enviar el proyecto a un servidor. No equivale a SAST profesional ni a una prueba de penetración. El comando `docs` crea README.md y archivos de documentación solo si no existen; no sobrescribe documentos del usuario.

## Plantillas

```sh
ai-builder complete auth
ai-builder complete dashboard
ai-builder complete api
ai-builder complete crud
ai-builder complete tests
ai-builder complete docs
ai-builder complete deploy
```

Las plantillas se imprimen en la terminal y requieren adaptación manual.

## Crear un starter web local

```sh
ai-builder generate "Landing accesible para una cafetería" --name cafeteria --out ./cafeteria
cd cafeteria
npm install
npm run dev
```

El starter local es una plantilla de Next.js App Router; crearla no requiere red ni IA. La carpeta destino debe ser nueva. El programa no instala dependencias, ejecuta el código ni despliega el proyecto. Los starters actuales requieren Node.js 20.9 o superior.

### Usar Gemini de forma explícita

```sh
export GEMINI_API_KEY="tu-clave"
ai-builder generate "Landing para una cafetería" --name cafeteria --provider gemini
```

Esta opción transmite a Gemini el nombre y la descripción del proyecto nuevo. No lee ni envía archivos locales. La clave se obtiene del entorno y no se guarda. Comprueba antes los términos, privacidad, cuota y precios de Google; la salida del modelo puede ser incorrecta o insegura y debe revisarse.

## Administración local

```sh
ai-builder admin --status
ai-builder admin --panel
ai-builder admin --enable
ai-builder admin --validate
ai-builder admin --register-device
ai-builder admin --list-devices
ai-builder admin --security-check
```

Para comandos que requieren autenticación, introduce la contraseña en el prompt oculto o define `AI_BUILDER_ADMIN_SECRET` en el entorno. No es recomendable incluir la clave directamente en los argumentos de la shell. La contraseña debe tener 12 caracteres como mínimo. El estado se guarda localmente en `~/.ai-builder/`; el verificador de contraseña usa PBKDF2 y permisos restrictivos.

El listado/registro es local. `--sync` no está implementado, no hay UI web, administración multiusuario ni sincronización entre máquinas.

## Pruebas y build

```sh
npm run build
npm run lint
npm test
npm pack --dry-run
```

## Consejos

- Revisa el resultado antes de usarlo o desplegarlo.
- Mantén archivos `.env` y claves fuera de Git.
- No compartas `~/.ai-builder/admin.json`.
- Para temas de seguridad consulta [SECURITY.md](SECURITY.md).
