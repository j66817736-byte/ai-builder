# AI Builder

AI Builder es una herramienta local-first para ayudar a analizar, completar y mejorar proyectos reales sin romper la privacidad.

## Objetivo

- Analizar proyectos existentes sin asumir una estructura rígida
- Detectar framework, lenguaje y estructura
- Identificar qué falta
- Proponer mejoras útiles
- Validar la base del proyecto
- Mantener la privacidad por defecto

## Uso

```bash
npm install
npm run dev -- analyze ./mi-proyecto
```

o instalar globalmente:

```bash
npm install -g .
ai-builder analyze ./mi-proyecto
```

## Comandos

- `ai-builder analyze ./ruta`
- `ai-builder validate`
- `ai-builder complete auth`
- `ai-builder docs`

## Seguridad

- Este CLI funciona localmente por defecto
- No sube tus proyectos a servidores sin permiso
- Los datos sensibles deben evitarse en logs y salidas

## Stack

- TypeScript
- Node.js
- CLI multiplataforma
