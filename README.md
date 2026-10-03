# AI Builder

## Modo Administrador Privado

AI Builder incluye un panel administrativo local con acceso separado y privado.

### Comandos de administrador

```bash
ai-builder admin --status
ai-builder admin --panel
ai-builder admin --enable <secret> <device-name>
ai-builder admin --validate <secret>
ai-builder admin --sync <device-name>
```

### Reglas de seguridad

- El administrador no aparece en la interfaz de usuarios normales.
- Los secretos se manejan localmente.
- La configuración privada se guarda en `~/.ai-builder`.
- Los dispositivos registrados se mantienen en el almacenamiento local del equipo.
- El modo privado está habilitado por defecto.

### Recomendaciones

- Usa contraseñas largas y únicas.
- Mantén el panel privado en un dispositivo personal.
- No lo compartas ni lo publiques en repositorios.
- Usa `.gitignore` para proteger archivos de entorno.

## Multi-dispositivo

La administración privada puede sincronizarse con dispositivos confiables de forma local, sin exponer datos en la nube.

## Compatibilidad

- Windows
- macOS
- Linux
- Dispositivos móviles compatibles con el entorno local
