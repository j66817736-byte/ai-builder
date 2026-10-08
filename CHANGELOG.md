# Changelog

## Unreleased

- Restaurados los módulos ausentes de análisis, salud, generación de plantillas y formato de terminal.
- Añadido un starter local de Next.js 16.4 con generación segura en carpeta nueva.
- Añadida generación opcional explícita con Gemini; por defecto no hay llamadas a IA externa.
- Endurecido el almacenamiento administrativo con PBKDF2 salado y permisos locales restrictivos.
- Corregidos los comandos de la CLI, sus códigos de salida y el comportamiento de documentación para que no sobrescriba archivos.
- Añadidas pruebas automatizadas y CI para compilación, pruebas y empaquetado.
- Sustituidas las afirmaciones de “producción lista” y seguridad garantizada por límites verificables.

## Nota de versión

El repositorio declara el paquete `1.0.0`; este changelog no implica que se haya publicado una versión en npm o que el producto haya superado auditoría comercial independiente.
