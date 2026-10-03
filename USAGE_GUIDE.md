# AI Builder - Manual de Uso

## Instalación

### En Linux/macOS
```bash
chmod +x install.sh
./install.sh
```

### En Windows
```cmd
install.bat
```

### Manual (cualquier SO)
```bash
npm install
npm run build
npm link  # Para acceso global
```

## Uso Básico

### 1. Analizar un proyecto
```bash
ai-builder analyze ./mi-proyecto
```

Esto te mostrará:
- Framework detectado
- Stack tecnológico
- Características presentes
- Qué falta implementar
- Plan de acción

### 2. Validar seguridad
```bash
ai-builder validate ./mi-proyecto
```

Revisa:
- Presencia de .env y .gitignore
- Secretos potencialmente expuestos
- Estructura del proyecto
- Recomendaciones de seguridad

### 3. Generar documentación
```bash
ai-builder docs ./mi-proyecto
```

Genera automáticamente:
- README.md
- docs/ARCHITECTURE.md
- docs/SECURITY_CHECKLIST.md
- docs/TODO.md
- CHANGELOG.md

### 4. Completar features
```bash
ai-builder complete auth
ai-builder complete dashboard
ai-builder complete api
```

Opciones: `auth`, `dashboard`, `api`, `crud`, `tests`, `docs`, `deploy`

## Administración Privada

### Primera vez: Configurar admin
```bash
ai-builder admin --enable "tu-contraseña-fuerte" "Mi-Dispositivo"
```

⚠️ Requisitos:
- Contraseña: mínimo 12 caracteres
- Guarda la contraseña en un lugar seguro
- No es recuperable si la olvidas

### Ver estado
```bash
ai-builder admin --status
```

### Registrar nuevo dispositivo
```bash
ai-builder admin --register-device "tu-contraseña" "Laptop"
```

### Listar dispositivos confiables
```bash
ai-builder admin --list-devices "tu-contraseña"
```

### Revisar seguridad
```bash
ai-builder admin --security-check "tu-contraseña"
```

## Flujo de Trabajo Recomendado

### Proyecto nuevo
```bash
# 1. Analizar situación actual
ai-builder analyze .

# 2. Generar documentación base
ai-builder docs .

# 3. Validar seguridad
ai-builder validate .

# 4. Completar features necesarios
ai-builder complete auth
ai-builder complete api
```

### Antes de hacer push
```bash
# 1. Validar seguridad
ai-builder validate .

# 2. Revisar documentación
cat README.md
cat docs/SECURITY_CHECKLIST.md

# 3. Confirmar que .gitignore está bien
cat .gitignore | grep -E "\.env"
```

### Multi-dispositivo
```bash
# En dispositivo 1: Ver archivos privados
ls ~/.ai-builder-admin

# En dispositivo 2: Copiar configuración
cp -r ~/.ai-builder-admin ~/backup/

# Sincronizar (manual)
cp -r ~/backup/.ai-builder-admin ~/.ai-builder-admin
```

## Archivos Generados

### Por `ai-builder docs`
- **README.md** - Descripción del proyecto
- **docs/ARCHITECTURE.md** - Estructura interna
- **docs/SECURITY_CHECKLIST.md** - Pasos de seguridad
- **docs/TODO.md** - Pendientes identificados
- **CHANGELOG.md** - Historial de cambios

### Por `ai-builder admin`
- **~/.ai-builder-admin/state.json** - Estado del admin
- **~/.ai-builder-admin/devices/** - Dispositivos registrados
- **~/.ai-builder-admin/.audit** - Log de auditoría

## Tips y Trucos

### Automatizar validación pre-push
```bash
# En .git/hooks/pre-push
#!/bin/bash
ai-builder validate . || exit 1
```

### Generar reportes regularmente
```bash
# Script en cron/scheduled task
ai-builder analyze ./proyecto > reports/$(date +%Y%m%d).txt
```

### Verificar desde CI/CD
```bash
# En GitHub Actions / GitLab CI
ai-builder validate .
ai-builder analyze .
```

### Restaurar configuración admin
```bash
# Respalda regularmente
cp -r ~/.ai-builder-admin ~/backups/admin-$(date +%Y%m%d)
```

## Solución de Problemas

### "ai-builder not found"
```bash
npm link
# o
npx ai-builder --help
```

### "Node.js version not supported"
```bash
node -v  # Debe ser >=18.0.0
npm install -g node@latest
```

### "Permission denied" en Linux/macOS
```bash
chmod +x install.sh quickstart.sh
```

### Admin no funciona
```bash
# Verifica que la contraseña es correcta
ai-builder admin --validate "tu-contraseña"

# Revisa permisos
ls -la ~/.ai-builder-admin

# Ejecuta revisión de seguridad
ai-builder admin --security-check "tu-contraseña"
```

## Comandos Completos

### Públicos (cualquiera puede usar)
```
ai-builder analyze <ruta>        - Analizar proyecto
ai-builder validate <ruta>       - Validar seguridad
ai-builder complete <feature>    - Generar plantilla
ai-builder docs <ruta>           - Generar documentación
ai-builder --help                - Ver ayuda
```

### Administrativos (requieren contraseña)
```
ai-builder admin --status                           - Ver estado
ai-builder admin --enable <secret> <device>         - Habilitar
ai-builder admin --validate <secret>                - Validar
ai-builder admin --register-device <secret> <name>  - Registrar dispositivo
ai-builder admin --list-devices <secret>            - Listar dispositivos
ai-builder admin --security-check <secret>          - Revisar seguridad
```

## Seguridad

⚠️ Recuerda siempre:
- Nunca compartir contraseña de admin
- Usar .gitignore para archivos sensibles
- Ejecutar validación antes de hacer push
- Revisar logs de auditoría regularmente
- Mantener dispositivos confiables actualizado

---

**¿Preguntas?** Revisa el archivo FINAL_DOCUMENTATION.md para más detalles.
