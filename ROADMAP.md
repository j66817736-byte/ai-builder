# Roadmap de AI Builder

## Estado implementado en esta rama

- [x] CLI de análisis, validación, documentación y plantillas.
- [x] Starter Next.js local, con escritura que rechaza rutas de salida existentes.
- [x] Generación opcional mediante Google Gemini bajo selección explícita.
- [x] Verificación de rutas y límites de tamaño antes de escribir salida de Gemini.
- [x] Administración local con verificador PBKDF2 y permisos restrictivos.
- [x] Pruebas automatizadas, build y workflow de CI.

## Límites funcionales actuales

- La detección del proyecto y el análisis de seguridad son heurísticos.
- El modo local genera un starter fijo adaptable, no interpreta instrucciones mediante un modelo.
- El generador Gemini está limitado a proyectos nuevos; no edita proyectos existentes.
- No hay instalación automática de paquetes, ejecución de código, despliegue, panel web, sincronización remota, multiusuario ni identidad de hardware.

## Antes de una publicación comercial

- Ejecutar la CI en GitHub y revisar resultados de dependencias/avisos de seguridad.
- Probar instalación del paquete desde un tarball limpio en Linux, macOS y Windows.
- Revisar manualmente generación Gemini con claves propias y validar cuotas, términos, tratamiento/retención de datos y gestión de costes.
- Hacer revisión de seguridad independiente, pruebas de accesibilidad y compatibilidad de los proyectos generados.
- Decidir canal de soporte, política de privacidad, licencia/atribuciones, matriz de soporte y proceso de divulgación.
- No afirmar que el software tiene “seguridad máxima” ni “privacidad garantizada”; describir de forma precisa los límites documentados.

## Mejoras futuras

- Más starters elegibles y esquemas de configuración de generación.
- Pruebas de integración de paquetes publicados y de instalación en Windows.
- Auditoría de dependencias reproducible y SBOM.
- Mejorar el análisis de proyectos y proporcionar niveles de confianza.
- Firmar releases y publicar avisos de seguridad versionados.
