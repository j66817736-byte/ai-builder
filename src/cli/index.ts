#!/usr/bin/env node

import chalk from "chalk";
import { scanProject } from "../lib/core/projectScanner.js";
import { analyzeGaps } from "../lib/core/gapAnalyzer.js";
import { validateProject } from "../lib/core/validator.js";
import { plannerFromProject } from "../lib/agents/planner.js";
import { getPrivacyWarning } from "../lib/security/privacy.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(chalk.cyan.bold("AI Builder"));
    console.log("");
    console.log(chalk.white("Uso:"));
    console.log(chalk.green("  ai-builder analyze ./mi-proyecto"));
    console.log(chalk.green("  ai-builder validate"));
    console.log(chalk.green("  ai-builder complete auth"));
    console.log(chalk.green("  ai-builder docs"));
    return;
  }

  const command = args[0];
  const targetPath = args[1] ?? process.cwd();

  if (command === "analyze") {
    console.log(chalk.yellow(getPrivacyWarning()));
    console.log(chalk.cyan(`\nAnalizando proyecto en: ${targetPath}\n`));

    const summary = await scanProject(targetPath);
    const gaps = analyzeGaps(summary);
    const planner = plannerFromProject("mi-proyecto");

    console.log(chalk.green("Resumen del proyecto:"));
    console.log(`- Framework: ${summary.framework ?? "No detectado"}`);
    console.log(`- Lenguaje: ${summary.language ?? "No detectado"}`);
    console.log(`- package.json: ${summary.hasPackageJson ? "Sí" : "No"}`);
    console.log(`- tsconfig: ${summary.hasTsConfig ? "Sí" : "No"}`);
    console.log(`- Tailwind: ${summary.hasTailwind ? "Sí" : "No"}`);

    console.log("");
    console.log(chalk.blue("Fortalezas:"));
    if (gaps.strengths.length === 0) console.log("  - Ninguna detectada");
    else gaps.strengths.forEach((item) => console.log(`  - ${item}`));

    console.log("");
    console.log(chalk.yellow("Qué falta o puede mejorarse:"));
    if (gaps.missing.length === 0) console.log("  - Nada crítico detectado");
    else gaps.missing.forEach((item) => console.log(`  - ${item}`));

    console.log("");
    console.log(chalk.magenta("Sugerencias:"));
    gaps.suggestions.forEach((item) => console.log(`  - ${item}`));

    console.log("");
    console.log(chalk.green("Plan del agente:"));
    console.log(`  - Objetivo: ${planner.goal}`);
    planner.plan.forEach((step) => console.log(`  - ${step}`));

    const validation = validateProject();
    console.log("");
    console.log(chalk.green("Validación base:"));
    validation.checks.forEach((check) => console.log(`  - ${check}`));

    return;
  }

  if (command === "validate") {
    const validation = validateProject();
    console.log(chalk.green("Validación del proyecto"));
    validation.checks.forEach((check) => console.log(`  - ${check}`));
    return;
  }

  if (command === "complete") {
    const feature = args[1] ?? "general";
    console.log(chalk.green(`Generando ayuda para completar la funcionalidad: ${feature}`));
    console.log(chalk.gray("Esta parte del MVP puede extenderse con un generador específico."));
    return;
  }

  if (command === "docs") {
    console.log(chalk.green("Generando documentación mínima del proyecto..."));
    console.log(chalk.gray("La documentación automática puede añadirse en la siguiente fase."));
    return;
  }

  console.log(chalk.red("Comando no reconocido."));
  console.log(chalk.gray("Usa: ai-builder --help"));
}

main().catch((error) => {
  console.error(chalk.red("Error:"), error);
  process.exit(1);
});
