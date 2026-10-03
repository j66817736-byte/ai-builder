# Contribuyendo a AI Builder

## 🎯 Bienvenida

Gracias por interés en contribuir a AI Builder.

## 📋 Antes de Empezar

1. Revisa los issues existentes
2. Lee la documentación
3. Entiende la filosofía del proyecto:
   - Local-first
   - Privacidad máxima
   - Simplicidad
   - Utilidad real

## 🐛 Reportar Bugs

1. Verifica que no esté ya reportado
2. Describe exactamente qué pasó
3. Incluye SO y versión de Node
4. Pasos para reproducir
5. Resultado esperado vs actual

## 💡 Sugerir Features

1. Crea un issue con título claro
2. Describe el problema que resuelve
3. Explica cómo lo usarías
4. Espera feedback antes de implementar

## 📝 Código

### Setup
```bash
git clone https://github.com/j66817736-byte/ai-builder
cd ai-builder
npm install
npm run dev
```

### Estructura
```
src/
  cli/          - Interfaz de línea de comandos
  lib/
    admin/      - Panel administrativo
    core/       - Análisis principal
    security/   - Seguridad y validación
    generators/ - Generación de código
    templates/  - Plantillas
    types/      - TypeScript types
    utils/      - Utilidades
```

### Estilo de Código

- TypeScript (tipado fuerte)
- ESLint + Prettier
- Comentarios en español
- Funciones pequeñas y claras
- Manejo de errores robusto

```bash
npm run format  # Formatear código
npm run lint    # Validar
```

### Tests

```bash
npm run test           # Ejecutar tests
npm run test:watch     # Modo watch
npm run test:coverage  # Con cobertura
```

### Commits

Formato recomendado:
```
[tipo] Descripción breve

Descripción detallada si es necesario.

Tipos: feat, fix, docs, style, refactor, test, chore
```

Ejemplos:
```
[feat] Agregar detección de Svelte
[fix] Corregir validación de .env
[docs] Actualizar guía de seguridad
```

## 🔐 Seguridad

Al contribuir:
- Mantén privacidad como prioridad
- No agregues dependencias innecesarias
- No expongas datos sensibles
- Valida inputs de usuario
- Usa prácticas seguras de criptografía

## 📖 Documentación

Al agregar features:
1. Actualiza README.md
2. Actualiza USAGE_GUIDE.md
3. Agrega tests
4. Incluye ejemplos
5. Documenta cambios

## ✅ Checklist para PRs

- [ ] Código compilable y sin errores
- [ ] Tests pasando
- [ ] Documentación actualizada
- [ ] Sin dependencias innecesarias
- [ ] Mantiene privacidad
- [ ] Compatible multi-plataforma
- [ ] Mensaje de commit claro

## 🚫 Lo Que NO Hacer

- ❌ Agregar telemetría
- ❌ Conectar a servidores externos
- ❌ Recopilar datos de usuarios
- ❌ Exponer información sensible
- ❌ Cambiar licencia
- ❌ Compatibilidad hacia atrás
- ❌ Features sin pruebas

## 🎓 Proceso de Review

1. Crea un fork
2. Rama nueva: `git checkout -b feature/tu-idea`
3. Commits claros
4. Push a tu fork
5. Pull Request con descripción
6. Espera review
7. Realiza cambios si es necesario
8. Merge cuando esté listo

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Docs](https://nodejs.org/en/docs/)
- [Chalk Docs](https://github.com/chalk/chalk)
- [Vitest Docs](https://vitest.dev/)

## 💬 Preguntas?

- Abre una discussion en GitHub
- Revisa issues existentes
- Lee la documentación

## 📄 Licencia

Al contribuir aceptas que tu código sea publicado bajo MIT.

---

**Gracias por contribuir a AI Builder** 🎉

Tu aporte ayuda a hacer este proyecto mejor para toda la comunidad.
