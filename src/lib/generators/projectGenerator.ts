import fs from "fs-extra";
import path from "node:path";
import { generateFilesWithGemini } from "../ai/gemini.js";
import { createLocalStarterFiles, writeGeneratedProject } from "./projectScaffold.js";

export type GenerationProvider = "local" | "gemini";

export interface GenerateProjectOptions {
  name: string;
  description: string;
  outPath: string;
  provider?: GenerationProvider;
}

export async function generateProject(options: GenerateProjectOptions): Promise<{ outputPath: string; files: string[]; provider: GenerationProvider }> {
  const provider = options.provider ?? "local";
  if (provider !== "local" && provider !== "gemini") throw new Error(`Proveedor desconocido: ${String(provider)}`);
  if (!options.description.trim()) throw new Error("Incluye una descripción del proyecto.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(options.name)) throw new Error("El nombre debe ser un slug npm seguro: minúsculas, números y guiones.");
  if (options.description.trim().length > 4000) throw new Error("La descripción no puede superar 4.000 caracteres.");
  const outputPath = path.resolve(options.outPath);
  if (await fs.pathExists(outputPath)) throw new Error(`La carpeta de salida ya existe; no se contactó al proveedor ni se sobrescribió nada: ${outputPath}`);
  const files = provider === "local"
    ? createLocalStarterFiles(options.name, options.description.trim())
    : await generateFilesWithGemini(options.description.trim(), options.name);
  const writtenFiles = await writeGeneratedProject(outputPath, files);
  return { outputPath, files: writtenFiles, provider };
}
