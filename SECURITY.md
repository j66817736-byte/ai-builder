# Guía de Seguridad - AI Builder

## 🔐 Implementación de Seguridad

### Almacenamiento Privado
- Directorio: `~/.ai-builder-admin`
- Permisos: `0o700` (solo propietario)
- Archivos: `0o600` (lectura/escritura solo propietario)
- Sin sincronización automática
- Sin acceso de otros usuarios

### Credenciales
- Hash: PBKDF2 (100,000 iteraciones)
- Salt: 16 bytes aleatorios por credencial
- Verificación: Hash-basada, nunca plaintext
- Validación: Contraseña mínima 12 caracteres

### Dispositivos Confiables
- Fingerprint: SHA256 de (nombre + OS + hostname)
- Registro: Almacenado en `~/.ai-builder-admin/devices/`
- Validación: Verificación de fingerprint
- Última actividad: Registrada en cada acceso

### Auditoría
- Log privado: `~/.ai-builder-admin/.audit`
- Registro: Timestamp + acción + metadata
- Acceso: Solo administrador
- Retención: Indefinida (manual cleanup)

### Detección de Secretos
- Patrones detectados:
  - API Keys (sk-*, AKIA*)
  - Tokens (Bearer, GitHub PAT)
  - Credenciales (.env)
  - Contraseñas en variables
- Acción: Alerta + recomendación
- Ocultado: En salida de usuario

### Separación de Capas
- **Pública**: Comandos para usuarios
- **Privada**: Panel admin con auth
- **Local**: Sin servidores externos
- **Aislada**: Sin comunicación entre capas

## ✅ Checklist de Seguridad

- [x] Almacenamiento privado con permisos restrictivos
- [x] Hashing seguro de credenciales
- [x] Salt aleatorio
- [x] Validación de dispositivos
- [x] Log de auditoría
- [x] Detección de secretos
- [x] Ocultado de información sensible
- [x] Sin sincronización automática
- [x] Local-first verificado
- [x] Multi-plataforma compatible

## 🛡️ Prácticas Recomendadas

1. **Contraseña fuerte**
   - 12+ caracteres
   - Mezcla de mayúsculas, minúsculas, números, símbolos
   - No reutilizar
   - Guardar en lugar seguro

2. **Dispositivos**
   - Registrar solo equipos personales
   - Revisar lista regularmente
   - Eliminar dispositivos no usados
   - Validar fingerprints

3. **Auditoría**
   - Revisar logs regularmente
   - Verificar accesos inusuales
   - Monitorear cambios
   - Mantener backups

4. **Mantenimiento**
   - Actualizar regularmente
   - Ejecutar security checks
   - Validar antes de push
   - Revisar .gitignore

## 🚨 Si Olvidas la Contraseña

Desgraciadamente no es recuperable. Soluciones:

1. Eliminar `~/.ai-builder-admin`
2. Reconfigurar admin desde cero
3. Perder dispositivos registrados
4. Perder log de auditoría

**Backup recomendado:**
```bash
cp -r ~/.ai-builder-admin ~/backups/admin-backup
```

## 🔍 Validación de Seguridad

```bash
# Verificar permisos
ls -la ~/.ai-builder-admin

# Revisar dispositivos registrados
ai-builder admin --list-devices "contraseña"

# Ejecutar revisión de seguridad
ai-builder admin --security-check "contraseña"

# Ver últimas acciones
cat ~/.ai-builder-admin/.audit
```

## 📋 Variables Ocultas

AI Builder detecta y oculta automáticamente:
- API_KEY
- SECRET
- PASSWORD
- TOKEN
- CREDENTIALS
- AWS_SECRET
- DB_PASSWORD
- JWT_SECRET
- Y más...

## 🌐 Local-First Verificado

✅ Sin conexión a internet requerida
✅ Sin conexión a servidores externos
✅ Sin recopilación de datos
✅ Sin telemetría
✅ Sin sincronización automática
✅ Sin análisis de uso
✅ Totalmente offline

## 📞 Reportar Vulnerabilidades

Si encuentras un problema de seguridad:
1. NO lo publiques en issues
2. Reporta privadamente a: j66817736@gmail.com
3. Incluye descripción del problema
4. Incluye pasos para reproducir
5. Espera respuesta antes de divulgar

---

**Última actualización:** Octubre 2026
**Versión:** 1.0.0
