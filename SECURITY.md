# Seguridad de AI Builder

## Alcance

AI Builder es una herramienta de desarrollo local. Su análisis de proyectos es heurístico y basado en patrones; no se garantiza que detecte todas las credenciales, vulnerabilidades, dependencias comprometidas o configuraciones peligrosas. No reemplaza a un equipo de seguridad, auditoría profesional, SAST, escáner de dependencias ni pentest.

## Datos y red

- `analyze`, `validate`, `docs`, `complete` y `generate` con proveedor `local` procesan datos en el equipo y no realizan solicitudes de red.
- `generate --provider gemini` transmite a Google Gemini el nombre y la descripción que el usuario proporciona. No recorre ni envía archivos del proyecto. La transmisión es explícita y depende de una clave del usuario en `GEMINI_API_KEY`.
- La instalación de dependencias de npm y cualquier despliegue son acciones manuales del usuario, ajenas a los comandos de generación.
- No hay telemetría implementada, pero esta declaración se limita al código actual del paquete y debe volver a revisarse ante nuevos cambios.

## Estado administrativo

- La contraseña debe tener al menos 12 caracteres.
- El archivo `~/.ai-builder/admin.json` contiene un verificador PBKDF2 salado, no la contraseña en claro; los permisos se restringen a la cuenta local.
- No escribas la contraseña como argumento de línea de comandos si puedes evitarlo: puede aparecer en el historial o lista de procesos. Usa el prompt oculto o `AI_BUILDER_ADMIN_SECRET`.
- El registro de dispositivos solo guarda etiquetas y metadatos. No prueba identidad del hardware, no sincroniza datos y no constituye control de acceso remoto.

## Archivos generados

- El generador no sobrescribe una carpeta de destino existente.
- La salida de Gemini se limita a rutas relativas, tamaño, número de archivos y nombres protegidos; estas comprobaciones no pueden hacer que código arbitrario del modelo sea seguro.
- AI Builder nunca ejecuta el código generado ni instala paquetes automáticamente. Revisa los archivos y sus dependencias antes de ejecutar.

## Reporte de vulnerabilidades

No incluyas contraseñas, claves, datos personales ni exploits funcionales en un reporte. Utiliza el mecanismo privado de reporte de seguridad que esté habilitado en el repositorio. Si no hay un canal privado configurado, solicita un contacto de seguridad al mantenedor antes de divulgar públicamente detalles explotables.
