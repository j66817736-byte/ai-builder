#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(currentDir, "../dist/cli/index.js");
const args = process.argv.length > 2 ? process.argv.slice(2) : ["--help"];
const result = spawnSync(process.execPath, [cliPath, ...args], { stdio: "inherit" });
if (result.error) {
  console.error(`No se pudo iniciar AI Builder: ${result.error.message}`);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
