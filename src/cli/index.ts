#!/usr/bin/env node

import chalk from "chalk";
import { analyzeProject } from "../lib/core/projectAnalyzer.js";
import { analyzeFeatures } from "../lib/core/featureAnalyzer.js";
import { performSecurityValidation } from "../lib/security/securityAudit.js";
import { generateFeature, getFeatureDescription } from "../lib/generators/featureGenerator.js";
import {
  generateAutoDocumentation,
  generateArchitectureDoc,
  generateSecurityChecklist,
  generateTodoList,
  generateChangeLog,
} from "../lib/generators/docGenerator.js";
import { getPrivacyWarning, getSecurityAdvice } from "../lib/security/privacy.js";
import { printHeader, printSuccess, printWarning, printError, printInfo, printTip } from "../lib/utils/formatters.js";
import { getPerformanceMetrics, getHealthStatus } from "../lib/core/projectHealth.js";
import { runTypeChecks, validateProjectStructure, validateFrameworkSetup } from "../lib/validators/structureValidator.js";
import fs from "fs-extra";
import path from "path";

async function analyzeCommand(targetPath: string) {
  console.log(chalk.cyan(getPrivacyWarning()));
  printHeader("🔍 Análisis del Proyecto");

  const projectInfo = await analyzeProject(targetPath);
  const features = analyzeFeatures(projectInfo);
  const { score, details } = getPerformanceMetrics(projectInfo);
  const health = getHealthStatus(score);

  // Resumen del proyecto
  console.log(chalk.green.bold("📊 Resumen del Proyecto:"));
  console.log(`  🔧 Framework: ${projectInfo.framework || "No detectado"}`);
  console.log(`  💻 Lenguaje: ${projectInfo.language || "No detectado"}`);
  console.log(`  📦 Stack: ${projectInfo.type}`);
  console.log(`  💪 Salud: ${health.emoji} ${health.status} (${score}/100)\n`);

  // Características detectadas
  console.log(chalk.green.bold("✨ Características Detectadas:"));
  details.forEach((detail) => console.log(`  ${detail}`));

  // Qué falta
  console.log("\n" + chalk.yellow.bold("⚠️ Qué Puede Mejorarse:"));
  if (features.missing.length === 0) {
    printSuccess("Ninguna funcionalidad crítica falta.");
  } else {
    features.missing.forEach((feature) => console.log(`  • ${feature}`));
  }

  // Recomendaciones
  console.log("\n" + chalk.magenta.bold("💡 Recomendaciones:"));
  features.recommendations.forEach((rec) => console.log(`  → ${rec}`));

  // Plan de acción
  console.log("\n" + chalk.blue.bold("📋 Plan de Acción:"));
  features.plan.forEach((step) => console.log(`  ${step}`));

  console.log(chalk.gray("\n" + getSecurityAdvice()));
  console.log(chalk.cyan("\n" + "═".repeat(70)));
}

async function validateCommand(targetPath: string) {
  console.log(chalk.cyan(getPrivacyWarning()));
  printHeader("✓ Validación del Proyecto");

  const projectInfo = await analyzeProject(targetPath);
  const validation = await performSecurityValidation(targetPath, projectInfo);
  const typeChecks = runTypeChecks(projectInfo);
  const structureChecks = validateProjectStructure(projectInfo);
  const frameworkChecks = validateFrameworkSetup(projectInfo);

  console.log(chalk.green.bold("Estado del Proyecto:"));
  validation.checks.forEach((check) => {
    const icon = check.status === "pass" ? "✅" : check.status === "warn" ? "⚠️" : "❌";
    console.log(`  ${icon} ${check.name}`);
  });

  if (validation.secrets.length > 0) {
    console.log(chalk.red.bold("\n🚨 Alertas de Seguridad:"));
    validation.secrets.forEach((secret) => console.log(`  🔴 ${secret}`));
  }

  if (typeChecks.errors.length > 0) {
    console.log(chalk.yellow.bold("\n⚠️ Validación de Tipos:"));
    typeChecks.errors.forEach((error) => console.log(`  • ${error}`));
  }

  if (frameworkChecks.issues.length > 0) {
    console.log(chalk.yellow.bold("\n📦 Problemas de Framework:"));
    frameworkChecks.issues.forEach((issue) => console.log(`  • ${issue}`));
  }

  if (validation.recommendations.length > 0) {
    console.log(chalk.blue.bold("\n💡 Sugerencias:"));
    validation.recommendations.forEach((rec) => console.log(`  → ${rec}`));
  }

  const allOk = validation.ok && typeChecks.passed && frameworkChecks.valid;
  console.log("\n" + (allOk ? chalk.green.bold("✅ Validación exitosa") : chalk.red.bold("❌ Hay problemas que revisar")));
}

async function completeCommand(feature: string, targetPath: string) {
  console.log(chalk.cyan(getPrivacyWarning()));
  printHeader(`📝 Generando Plantilla: ${feature.toUpperCase()}`);

  try {
    const template = await generateFeature(feature as any);
    const description = getFeatureDescription(feature as any);

    console.log(chalk.green.bold(feature.toUpperCase()));
    console.log(chalk.gray(`${description}\n`));
    console.log(chalk.cyan.bold("Código sugerido:"));
    console.log(chalk.white("\n" + template + "\n"));
    printTip("Copia este código en tu proyecto y adapta según tus necesidades.");
  } catch (error) {
    printError(`No se puede generar plantilla para ${feature}`);
  }
}

async function docsCommand(targetPath: string) {
  console.log(chalk.cyan(getPrivacyWarning()));
  printHeader("📚 Generando Documentación");

  const projectInfo = await analyzeProject(targetPath);

  try {
    const readme = await generateAutoDocumentation(projectInfo);
    const architecture = await generateArchitectureDoc(projectInfo);
    const security = await generateSecurityChecklist(projectInfo);
    const todo = await generateTodoList(projectInfo);
    const changelog = await generateChangeLog();

    // Crear carpeta docs si no existe
    const docsDir = path.join(targetPath, "docs");
    await fs.ensureDir(docsDir);

    // Guardar archivos
    await fs.writeFile(path.join(targetPath, "README.md"), readme);
    await fs.writeFile(path.join(docsDir, "ARCHITECTURE.md"), architecture);
    await fs.writeFile(path.join(docsDir, "SECURITY_CHECKLIST.md"), security);
    await fs.writeFile(path.join(docsDir, "TODO.md"), todo);
    await fs.writeFile(path.join(targetPath, "CHANGELOG.md"), changelog);

    printSuccess("README.md creado");
    printSuccess("docs/ARCHITECTURE.md creado");
    printSuccess("docs/SECURITY_CHECKLIST.md creado");
    printSuccess("docs/TODO.md creado");
    printSuccess("CHANGELOG.md creado");

    console.log(chalk.blue("\n📂 Archivos guardados en tu proyecto"));
    printTip("Revisa los archivos generados y personaliza según tus necesidades");
  } catch (error) {
    printError(`Error al generar documentación: ${error}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h") {
    console.log(chalk.cyan.bold("\n🤖 AI Builder v1.0.0\n"));
    console.log(chalk.white("Tu asistente local para analizar y completar proyectos\n"));
    console.log(chalk.white("Uso:"));
    console.log(chalk.green("  ai-builder analyze ./mi-proyecto"));
    console.log(chalk.green("  ai-builder validate ./mi-proyecto"));
    console.log(chalk.green("  ai-builder complete auth"));
    console.log(chalk.green("  ai-builder docs ./mi-proyecto"));
    console.log(chalk.gray("\nComandos:"));
    console.log(chalk.gray("  analyze  - Analiza tu proyecto y sugiere mejoras"));
    console.log(chalk.gray("  validate - Valida seguridad y estructura"));
    console.log(chalk.gray("  complete - Genera plantillas de funcionalidades"));
    console.log(chalk.gray("  docs     - Crea documentación automática"));
    console.log(chalk.gray("\nFuncionalidades disponibles:"));
    console.log(chalk.gray("  auth dashboard api crud tests docs deploy"));
    console.log();
    return;
  }

  const targetPath = args[1] ?? process.cwd();

  switch (command) {
    case "analyze":
      await analyzeCommand(targetPath);
      break;
    case "validate":
      await validateCommand(targetPath);
      break;
    case "complete":
      await completeCommand(args[1] ?? "auth", targetPath);
      break;
    case "docs":
      await docsCommand(targetPath);
      break;
    default:
      printError("Comando no reconocido.");
      console.log(chalk.gray("Usa: ai-builder --help"));
  }
}

main().catch((error) => {
  console.error(chalk.red("❌ Error:"), error.message);
  process.exit(1);
});
