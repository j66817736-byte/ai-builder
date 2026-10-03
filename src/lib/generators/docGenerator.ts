import chalk from "chalk";
import type { ProjectInfo } from "../types/project.js";
import { featureTemplates } from "../templates/featureTemplates.js";

export async function generateAutoDocumentation(projectInfo: ProjectInfo): Promise<string> {
  const readme = `# ${projectInfo.framework || "Mi Proyecto"}

## 📋 Descripción

Proyecto desarrollado con ${projectInfo.framework || "una estructura personalizada"}.

## 🛠️ Stack Tecnológico

- **Framework**: ${projectInfo.framework || "No detectado"}
- **Lenguaje**: ${projectInfo.language || "JavaScript"}
- **Tipo de Proyecto**: ${projectInfo.type}
- **Tailwind CSS**: ${projectInfo.hasTailwind ? "✅ Sí" : "❌ No"}
- **TypeScript**: ${projectInfo.hasTsConfig ? "✅ Sí" : "❌ No"}
- **Testing**: ${projectInfo.hasTests ? "✅ Configurado" : "❌ No configurado"}
- **Autenticación**: ${projectInfo.hasAuth ? "✅ Implementada" : "❌ No implementada"}

## 📁 Estructura del Proyecto

\`\`\`
${projectInfo.directories.map((dir) => `${dir}/`).join("\n")}
\`\`\`

## 🚀 Instalación

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
\`\`\`

## 📝 Scripts Disponibles

- \`npm run dev\` - Inicia el servidor de desarrollo
- \`npm run build\` - Compila el proyecto para producción
- \`npm run start\` - Inicia el servidor de producción
- \`npm run lint\` - Ejecuta el linter para revisar el código

## 🔧 Configuración

### Variables de Entorno

Crea un archivo \`.env.local\` con las siguientes variables:

\`\`\`env
# Ejemplo de variables de entorno
DATABASE_URL=tu_url_aqui
API_KEY=tu_clave_aqui
NODE_ENV=development
\`\`\`

## ✅ Estado del Proyecto

${projectInfo.hasPackageJson ? "✅" : "❌"} package.json  
${projectInfo.hasTsConfig ? "✅" : "❌"} TypeScript configurado  
${projectInfo.hasAuth ? "✅" : "❌"} Autenticación  
${projectInfo.hasDashboard ? "✅" : "❌"} Dashboard  
${projectInfo.hasTests ? "✅" : "❌"} Tests  
${projectInfo.hasDocs ? "✅" : "❌"} Documentación  
${projectInfo.hasGitIgnore ? "✅" : "❌"} .gitignore  

## 🎯 Próximos Pasos

${projectInfo.hasAuth ? "" : "1. Implementar autenticación segura\n"}${projectInfo.hasTests ? "" : "2. Configurar tests automatizados\n"}${projectInfo.hasDashboard && projectInfo.type !== "express" ? "" : "3. Crear dashboard para visualizar datos\n"}${projectInfo.hasTailwind ? "" : "4. Integrar Tailwind CSS\n"}

## 📚 Recursos Útiles

- [Documentación oficial](https://example.com)
- [Guía de inicio rápido](./docs/quick-start.md)
- [Arquitectura del proyecto](./docs/architecture.md)

## 🔒 Seguridad

- Nunca commits secretos o variables de entorno
- Usa \`.env.local\` para desarrollo
- Revisa \`.gitignore\` antes de hacer push
- Ejecuta \`ai-builder validate\` antes de desplegar

## 📄 Licencia

MIT

---

**Documentación generada automáticamente por AI Builder**
`;

  return readme;
}

export async function generateArchitectureDoc(projectInfo: ProjectInfo): Promise<string> {
  const arch = `# Arquitectura del Proyecto

## Visión General

Este documento describe la arquitectura y estructura del proyecto ${projectInfo.framework || "Mi Proyecto"}.

## Stack Utilizado

- **Framework**: ${projectInfo.framework || "Personalizado"}
- **Lenguaje**: ${projectInfo.language || "JavaScript"}
- **Tipo**: ${projectInfo.type}

## Estructura de Carpetas

\`\`\`
.
${projectInfo.directories.map((dir) => `├── ${dir}/`).join("\n")}
└── package.json
\`\`\`

## Componentes Principales

${projectInfo.directories
  .map(
    (dir) => `### ${dir}/

Contiene la lógica y componentes relacionados con ${dir}.
`
  )
  .join("\n")}

## Flujo de Datos

1. El usuario interactúa con la interfaz
2. Los datos se envían al servidor/backend
3. El servidor procesa la solicitud
4. La respuesta se devuelve al cliente
5. La interfaz se actualiza

## Patrones de Diseño

- **Modular**: Separación clara de responsabilidades
- **Escalable**: Fácil de agregar nuevas funcionalidades
- **Mantenible**: Código limpio y documentado

## Consideraciones de Seguridad

- Validación de entradas en cliente y servidor
- Protección contra CSRF y XSS
- Variables de entorno para secretos
- Autenticación y autorización implementadas

## Dependencias Principales

Ver \`package.json\` para la lista completa de dependencias.

---

**Documento generado automáticamente por AI Builder**
`;

  return arch;
}

export async function generateSecurityChecklist(projectInfo: ProjectInfo): Promise<string> {
  const security = `# Checklist de Seguridad

## 🔐 Protección de Secretos

- [ ] Crear archivo \`.env.local\` con variables sensibles
- [ ] Agregar \`.env.local\` a \`.gitignore\`
- [ ] No commitear contraseñas o API keys
- [ ] Usar variables de entorno para configuración
- [ ] Revisar \`.gitignore\` antes de hacer push

## 🛡️ Validación y Sanitización

- [ ] Validar entradas del usuario en cliente
- [ ] Validar entradas del usuario en servidor
- [ ] Sanitizar datos antes de mostrar
- [ ] Escapar caracteres especiales
- [ ] Usar prepared statements para bases de datos

## 🔑 Autenticación

${projectInfo.hasAuth ? "- [x] Autenticación implementada" : "- [ ] Implementar autenticación segura"}
- [ ] Usar contraseñas hasheadas (bcrypt, argon2)
- [ ] Implementar 2FA si es necesario
- [ ] Usar sesiones seguras
- [ ] Expulsar sesiones después de inactividad

## 🚀 Despliegue

- [ ] Usar HTTPS en producción
- [ ] Configurar CORS correctamente
- [ ] Usar headers de seguridad (CSP, X-Frame-Options)
- [ ] Mantener dependencias actualizadas
- [ ] Ejecutar scans de vulnerabilidades

## 🧪 Testing

${projectInfo.hasTests ? "- [x] Tests configurados" : "- [ ] Configurar tests automatizados"}
- [ ] Escribir tests de seguridad
- [ ] Probar validación de entradas
- [ ] Probar manejo de errores
- [ ] Coverage mínimo del 80%

## 📋 Auditoría

- [ ] Ejecutar \`ai-builder validate\` regularmente
- [ ] Revisar logs de acceso
- [ ] Monitorear cambios en dependencias
- [ ] Hacer auditorías de seguridad periódicas

---

**Generado automáticamente por AI Builder - Actualiza regularmente**
`;

  return security;
}

export async function generateTodoList(projectInfo: ProjectInfo): Promise<string> {
  const todos: string[] = [];

  if (!projectInfo.hasAuth) todos.push("Implementar autenticación de usuarios");
  if (!projectInfo.hasTests) todos.push("Configurar tests automatizados");
  if (!projectInfo.hasDocs) todos.push("Crear documentación completa");
  if (projectInfo.type !== "express" && !projectInfo.hasDashboard)
    todos.push("Crear dashboard para visualizar datos");
  if (!projectInfo.hasTailwind && projectInfo.type !== "express")
    todos.push("Integrar Tailwind CSS");
  if (!projectInfo.hasTsConfig && projectInfo.type !== "custom")
    todos.push("Configurar TypeScript");
  if (!projectInfo.hasGitIgnore) todos.push("Crear archivo .gitignore");

  const todo = `# TODO - Pendientes del Proyecto

## Prioritario

${todos.slice(0, 3).map((t, i) => `- [ ] ${t}`).join("\n") || "- [x] Todo listo"}

## Importante

${todos.slice(3).map((t) => `- [ ] ${t}`).join("\n") || "- [x] Sin pendientes importantes"}

## Opcionales

- [ ] Mejorar performance
- [ ] Agregar animaciones
- [ ] Optimizar imágenes
- [ ] Implementar PWA
- [ ] Agregar internacionalización

---

**Generado automáticamente por AI Builder**
`;

  return todo;
}

export async function generateChangeLog(): Promise<string> {
  const changelog = `# Changelog

## [1.0.0] - ${new Date().toISOString().split("T")[0]}

### Agregado
- ✨ Versión inicial del proyecto
- 🔐 Seguridad base implementada
- 📚 Documentación inicial

### Cambios
- 🎨 Interfaz principal
- 🏗️ Estructura del proyecto

### Corregido
- 🐛 Errores iniciales

---

## Formato

- **[Agregado]**: Nueva funcionalidad
- **[Cambios]**: Cambios en funcionalidad existente
- **[Corregido]**: Bugs corregidos
- **[Eliminado]**: Funcionalidad removida
- **[Seguridad]**: Fixes de seguridad

---

**Mantenga este archivo actualizado con cada release**
`;

  return changelog;
}
