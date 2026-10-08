#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "node:path";
import { analyzeFeatures } from "../lib/core/featureAnalyzer.js";
import { analyzeProject } from "../lib/core/projectAnalyzer.js";
import { getHealthStatus, getPerformanceMetrics } from "../lib/core/projectHealth.js";
import { generateChangeLog, generateArchitectureDoc, generateAutoDocumentation, generateSecurityChecklist, generateTodoList } from "../lib/generators/docGenerator.js";
import { generateFeature, getFeatureDescription, isFeatureName } from "../lib/generators/featureGenerator.js";
import { generateProject } from "../lib/generators/projectGenerator.js";
import { performSecurityValidation } from "../lib/security/securityAudit.js";
import { getPrivacyWarning, getSecurityAdvice, sanitizeForOutput } from "../lib/security/privacy.js";
import { printError, printHeader, printInfo, printSuccess, printTip, printWarning } from "../lib/utils/formatters.js";
import { adminEnableCommand, adminListDevicesCommand, adminPanelCommand, adminRegisterDeviceCommand, adminSecurityCheckCommand, adminStatusCommand, adminValidateCommand } from "../lib/admin/adminCommands.js";
import { validateFrameworkSetup, runTypeChecks } from "../lib/validators/structureValidator.js";

async function analyzeCommand(targetPath: string): Promise<void> {
  console.log(chalk.cyan(getPrivacyWarning()));
  printHeader("Análisis local del proyecto");
  const info = await analyzeProject(targetPath);
  const features = analyzeFeatures(info);
  const { score, details } = getPerformanceMetrics(info);
  const health = getHealthStatus(score);
  console.log(`  Proyecto: ${info.name}`);
  console.log(`  Framework: ${info.framework ?? "No detectado"}`);
  console.log(`  Lenguaje: ${info.language}`);
  console.log(`  Tipo: ${info.type}`);
  console.log(`  Indicador heurístico: ${health.emoji} ${health.status} (${score}/100)`);
  console.log("\nSeñales detectadas:");
  details.forEach((detail) => console.log(`  ${detail}`));
  console.log("\nPendientes sugeridos:");
  if (!features.missing.length) printSuccess("No se detectaron pendientes básicos.");
  else features.missing.forEach((item) => console.log(`  • ${item}`));
  console.log("\nRecomendaciones:");
  if (!features.recommendations.length) printInfo("No hay recomendaciones heurísticas adicionales.");
  else features.recommendations.forEach((item) => console.log(`  → ${item}`));
  console.log("\nPlan sugerido:");
  features.plan.forEach((step) => console.log(`  ${step}`));
  console.log(chalk.gray(`\n${getSecurityAdvice()}`));
}

async function validateCommand(targetPath: string): Promise<void> {
  console.log(chalk.cyan(getPrivacyWarning()));
  printHeader("Validación local");
  const info = await analyzeProject(targetPath);
  const security = await performSecurityValidation(targetPath, info);
  const types = runTypeChecks(info);
  const framework = validateFrameworkSetup(info);
  security.checks.forEach((check) => {
    const icon = check.status === "pass" ? "✅" : check.status === "warn" ? "⚠️" : "❌";
    console.log(`  ${icon} ${check.name}${check.message ? ` — ${check.message}` : ""}`);
  });
  if (security.secrets.length) {
    console.log(chalk.red.bold("\nHallazgos (sin mostrar valores):"));
    security.secrets.forEach((item) => console.log(`  • ${item}`));
  }
  if (types.errors.length) types.errors.forEach((error) => printError(error));
  if (framework.issues.length) framework.issues.forEach((issue) => printWarning(issue));
  security.recommendations.forEach((item) => printInfo(item));
  const ok = security.ok && types.passed && framework.valid;
  console.log(ok ? chalk.green.bold("\n✅ Validación básica completada") : chalk.red.bold("\n❌ Hay comprobaciones que requieren atención"));
  if (!ok) process.exitCode = 1;
  printTip("Esta herramienta usa heurísticas estáticas; no sustituye una auditoría profesional.");
}

async function completeCommand(feature: string): Promise<void> {
  if (!isFeatureName(feature)) throw new Error(`Plantilla no disponible. Opciones: auth, dashboard, api, crud, tests, docs, deploy.`);
  printHeader(`Plantilla: ${feature}`);
  console.log(chalk.gray(`${getFeatureDescription(feature)}\n`));
  console.log(await generateFeature(feature));
  printTip("El contenido es un punto de partida; revísalo y adáptalo antes de usarlo.");
}

async function docsCommand(targetPath: string): Promise<void> {
  console.log(chalk.cyan(getPrivacyWarning()));
  printHeader("Generación segura de documentación");
  const info = await analyzeProject(targetPath);
  const docsDir = path.join(info.path, "docs");
  await fs.ensureDir(docsDir);
  const files: Array<[string, string]> = [
    [path.join(info.path, "README.md"), await generateAutoDocumentation(info)],
    [path.join(docsDir, "ARCHITECTURE.md"), await generateArchitectureDoc(info)],
    [path.join(docsDir, "SECURITY_CHECKLIST.md"), await generateSecurityChecklist(info)],
    [path.join(docsDir, "TODO.md"), await generateTodoList(info)],
    [path.join(info.path, "CHANGELOG.md"), await generateChangeLog()],
  ];
  let created = 0;
  for (const [file, content] of files) {
    try { await fs.writeFile(file, content, { encoding: "utf8", flag: "wx", mode: 0o644 }); printSuccess(`Creado ${path.relative(info.path, file)}`); created += 1; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") printWarning(`Se conservó el archivo existente: ${path.relative(info.path, file)}`);
      else throw error;
    }
  }
  printInfo(`${created} archivo(s) creados; no se sobrescribió ningún archivo existente.`);
}

function deriveProjectName(description: string): string {
  const slug = description.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36).replace(/-$/g, "");
  return slug || "mi-proyecto";
}

async function generateCommand(args: string[]): Promise<void> {
  const positional: string[] = [];
  let name: string | undefined;
  let out: string | undefined;
  let provider: "local" | "gemini" = "local";
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--name" || arg === "--out" || arg === "--provider") {
      const value = args[i + 1];
      if (!value || value.startsWith("--")) throw new Error(`Falta el valor de ${arg}.`);
      i += 1;
      if (arg === "--name") name = value;
      else if (arg === "--out") out = value;
      else if (value === "local" || value === "gemini") provider = value;
      else throw new Error("--provider acepta local o gemini.");
    } else if (arg.startsWith("--")) throw new Error(`Opción desconocida: ${arg}`);
    else positional.push(arg);
  }
  const description = positional.join(" ").trim();
  if (!description) throw new Error("Describe el proyecto entre comillas. Ejemplo: ai-builder generate \"Landing para una cafetería\"");
  if (description.length > 4000) throw new Error("La descripción no puede superar 4.000 caracteres.");
  const projectName = name ?? deriveProjectName(description);
  const outputPath = out ?? path.resolve(process.cwd(), projectName);
  printHeader("Generación de proyecto");
  if (provider === "gemini") {
    printWarning("Modo Gemini activado: se enviará únicamente la descripción del proyecto a Google Gemini; no se leen ni transmiten archivos locales.");
    printWarning("La generación remota puede consumir cuota/coste de la cuenta asociada a tu clave. AI Builder no instalará paquetes ni ejecutará el código generado.");
  } else printInfo("Modo local: usa una plantilla incluida; no se llama a modelos ni se envían datos.");
  const result = await generateProject({ name: projectName, description, outPath: outputPath, provider });
  printSuccess(`Proyecto creado en ${result.outputPath}`);
  console.log("Archivos:");
  result.files.forEach((file) => console.log(`  • ${file}`));
  console.log("\nSiguiente paso: revisa el código generado antes de ejecutarlo.");
  printInfo(`Instala las dependencias manualmente desde el proyecto y ejecuta: cd ${JSON.stringify(result.outputPath)} && npm install && npm run dev`);
}

async function promptSecret(): Promise<string> {
  const fromEnvironment = process.env.AI_BUILDER_ADMIN_SECRET;
  if (fromEnvironment) return fromEnvironment;
  if (!process.stdin.isTTY) throw new Error("Falta la contraseña. Define AI_BUILDER_ADMIN_SECRET o ejecuta el comando en una terminal interactiva.");
  const answer = await inquirer.prompt<{ secret: string }>([{ type: "password", name: "secret", message: "Contraseña administrativa:", mask: "*", validate: (value: string) => value.length > 0 || "La contraseña no puede estar vacía." }]);
  return answer.secret;
}

async function adminCommand(args: string[]): Promise<void> {
  const subcommand = args[0] ?? "--status";
  if (subcommand === "--status") return adminStatusCommand();
  if (subcommand === "--panel") return adminPanelCommand();
  if (subcommand === "--sync") throw new Error("No existe sincronización multidispositivo en esta versión; no se envió ningún dato.");
  if (!["--enable", "--validate", "--register-device", "--list-devices", "--security-check"].includes(subcommand)) {
    throw new Error("Comando admin no reconocido. Usa --status, --panel, --enable, --validate, --register-device, --list-devices o --security-check.");
  }
  const secret = args[1] && !args[1].startsWith("--") ? args[1] : await promptSecret();
  const deviceName = subcommand === "--enable" || subcommand === "--register-device"
    ? (args[1] && args[1].startsWith("--") ? args[2] : args[2]) ?? (process.stdin.isTTY ? (await inquirer.prompt<{ device: string }>([{ type: "input", name: "device", message: "Nombre del dispositivo:", validate: (value: string) => value.trim().length > 0 || "Indica un nombre." }])).device : "")
    : "";
  if ((subcommand === "--enable" || subcommand === "--register-device") && !deviceName) throw new Error("Indica el nombre del dispositivo; no se realizó ningún cambio.");
  if (subcommand === "--enable") {
    if (args[1] && !args[1].startsWith("--")) printWarning("La contraseña escrita como argumento puede quedar en el historial o la lista de procesos; prefiere el prompt o AI_BUILDER_ADMIN_SECRET.");
    if (secret.length < 12) throw new Error("La contraseña debe tener al menos 12 caracteres.");
    return adminEnableCommand(secret, deviceName);
  }
  if (subcommand === "--validate") {
    if (!(await adminValidateCommand(secret))) process.exitCode = 1;
    return;
  }
  if (subcommand === "--register-device") {
    if (!(await adminRegisterDeviceCommand(secret, deviceName))) process.exitCode = 1;
    return;
  }
  if (subcommand === "--list-devices") {
    if (!(await adminListDevicesCommand(secret))) process.exitCode = 1;
    return;
  }
  if (!(await adminSecurityCheckCommand(secret))) process.exitCode = 1;
}

function printHelp(): void {
  console.log(chalk.cyan.bold("\nAI Builder — CLI local-first\n"));
  console.log("Comandos:");
  console.log("  ai-builder analyze <ruta>                         Analizar metadatos y señales locales");
  console.log("  ai-builder validate <ruta>                        Revisiones heurísticas de seguridad y estructura");
  console.log("  ai-builder docs <ruta>                            Crear documentación sin sobrescribir archivos");
  console.log("  ai-builder complete <auth|dashboard|api|crud|tests|docs|deploy>");
  console.log("  ai-builder generate \"descripción\" [--name slug] [--out ruta] [--provider local|gemini]");
  console.log("  ai-builder admin --status | --panel | --enable | --validate | --register-device | --list-devices | --security-check");
  console.log("\nPor defecto, generate es local y no llama a una IA. --provider gemini transmite solo la descripción a Google Gemini.");
  console.log("La CLI nunca instala dependencias, ejecuta código generado ni publica proyectos por su cuenta.\n");
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  if (!command || command === "--help" || command === "-h") { printHelp(); return; }
  if (command === "admin") return adminCommand(args.slice(1));
  if (command === "generate") return generateCommand(args.slice(1));
  const targetPath = args[1] ?? process.cwd();
  if (command === "analyze") return analyzeCommand(targetPath);
  if (command === "validate") return validateCommand(targetPath);
  if (command === "docs") return docsCommand(targetPath);
  if (command === "complete") return completeCommand(args[1] ?? "");
  throw new Error(`Comando no reconocido: ${command}. Usa ai-builder --help.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  printError(sanitizeForOutput(message));
  process.exitCode = 1;
});
