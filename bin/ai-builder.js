#!/usr/bin/env node

import chalk from "chalk";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "../dist/cli/index.js");

const args = process.argv.slice(2);

// Mostrar bienvenida en primera ejecución o si no hay argumentos
if (!args.length) {
  const welcomePath = path.join(__dirname, "../dist/cli/welcome.js");
  spawnSync("node", [welcomePath], { stdio: "inherit" });
  console.log(chalk.cyan("\n" + "=".repeat(50)));
  console.log(chalk.cyan("Usa: ai-builder --help para ver todos los comandos"));
  console.log(chalk.cyan("=".repeat(50)) + "\n");
  process.exit(0);
}

// Ejecutar CLI principal
spawnSync("node", [distPath, ...args], { stdio: "inherit" });
