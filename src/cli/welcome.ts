#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = await fs.readJson(path.join(__dirname, "../package.json"));

function showWelcome() {
  console.clear();
  console.log(chalk.cyan.bold("\n"));
  console.log("  ╔═════════════��═════════════════════════╗");
  console.log("  ║    🤖 AI BUILDER v" + packageJson.version + "              ║");
  console.log("  ║  Local-First Project Assistant        ║");
  console.log("  ║  Con Panel Administrativo Privado      ║");
  console.log("  ╚═══════════════════════════════════════╝\n");

  console.log(chalk.white("✨ Características principales:\n"));
  console.log(chalk.green("  ✓ Análisis inteligente de proyectos"));
  console.log(chalk.green("  ✓ Validación de seguridad"));
  console.log(chalk.green("  ✓ Documentación automática"));
  console.log(chalk.green("  ✓ Generación de plantillas de código"));
  console.log(chalk.green("  ✓ Panel administrativo privado"));
  console.log(chalk.green("  ✓ Múltiples dispositivos confiables"));
  console.log(chalk.green("  ✓ Privacidad local-first\n"));

  console.log(chalk.white.bold("🚀 Primeros pasos:\n"));
  console.log(chalk.cyan("  1. Analizar tu proyecto:"));
  console.log(chalk.gray("     $ ai-builder analyze ./mi-proyecto\n"));
  console.log(chalk.cyan("  2. Configurar administración:"));
  console.log(chalk.gray("     $ ai-builder admin --enable 'contraseña-fuerte' 'Mi-PC'\n"));
  console.log(chalk.cyan("  3. Generar documentación:"));
  console.log(chalk.gray("     $ ai-builder docs ./mi-proyecto\n"));

  console.log(chalk.white.bold("📚 Documentación:\n"));
  console.log(chalk.blue("  • README.md - Inicio rápido"));
  console.log(chalk.blue("  • USAGE_GUIDE.md - Guía completa"));
  console.log(chalk.blue("  • FINAL_DOCUMENTATION.md - Detalles técnicos"));
  console.log(chalk.blue("  • SECURITY.md - Información de seguridad\n"));

  console.log(chalk.white.bold("💡 Ayuda:\n"));
  console.log(chalk.gray("  $ ai-builder --help\n"));
}

const args = process.argv.slice(2);

if (!args.length || args[0] === "--welcome") {
  showWelcome();
  process.exit(0);
}
