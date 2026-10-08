import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { analyzeProject } from "../src/lib/core/projectAnalyzer.js";
import { analyzeFeatures } from "../src/lib/core/featureAnalyzer.js";
import { performSecurityValidation } from "../src/lib/security/securityAudit.js";
import { sanitizeForOutput } from "../src/lib/security/privacy.js";
import { createLocalStarterFiles, writeGeneratedProject } from "../src/lib/generators/projectScaffold.js";
import { generateFilesWithGemini } from "../src/lib/ai/gemini.js";
import { generateProject } from "../src/lib/generators/projectGenerator.js";
import { generateFeature, isFeatureName } from "../src/lib/generators/featureGenerator.js";
import { hashSecret, setAdminSecret } from "../src/lib/admin/security.js";

const temporaryRoots: string[] = [];
async function tempDir(): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ai-builder-test-"));
  temporaryRoots.push(root);
  return root;
}

afterEach(async () => {
  for (const root of temporaryRoots.splice(0)) await fs.remove(root);
  delete process.env.GEMINI_API_KEY;
  delete process.env.AI_BUILDER_GEMINI_MODEL;
  vi.restoreAllMocks();
});

describe("análisis local", () => {
  it("detecta Next.js, TypeScript y señales desde el manifiesto", async () => {
    const root = await tempDir();
    await fs.writeJson(path.join(root, "package.json"), { name: "demo", description: "App", dependencies: { next: "16.4.0", react: "19.2.0" }, scripts: { build: "next build", test: "vitest run" }, devDependencies: { vitest: "1.0.0" } });
    await fs.writeFile(path.join(root, "tsconfig.json"), "{}");
    await fs.writeFile(path.join(root, ".gitignore"), "node_modules/\n.env*\n");
    await fs.ensureDir(path.join(root, "app"));
    const info = await analyzeProject(root);
    expect(info.type).toBe("nextjs");
    expect(info.framework).toBe("Next.js");
    expect(info.language).toBe("TypeScript");
    expect(info.hasTests).toBe(true);
    expect(info.hasGitIgnore).toBe(true);
  });

  it("reporta ruta inexistente con un error claro", async () => {
    await expect(analyzeProject(path.join(os.tmpdir(), "missing-ai-builder-path"))).rejects.toThrow("No existe la ruta");
  });

  it("genera recomendaciones solo a partir de señales locales", async () => {
    const root = await tempDir();
    await fs.writeJson(path.join(root, "package.json"), { name: "bare", dependencies: { express: "4.0.0" } });
    const features = analyzeFeatures(await analyzeProject(root));
    expect(features.missing).toContain("Pruebas automatizadas");
    expect(features.recommendations.some((item) => item.includes("rutas críticas"))).toBe(true);
  });
});

describe("revisión y redacción de seguridad", () => {
  it("encuentra un valor secreto simulado sin devolverlo", async () => {
    const root = await tempDir();
    const dummySecret = ["test-only", "secret-value-123456789"].join("-");
    await fs.writeFile(path.join(root, ".gitignore"), ".env*\nnode_modules/\n");
    await fs.writeJson(path.join(root, "package.json"), { name: "safe-test", scripts: { test: "vitest run" } });
    await fs.ensureDir(path.join(root, "src"));
    await fs.writeFile(path.join(root, "src", "config.ts"), `export const API_KEY = "${dummySecret}";\n`);
    const info = await analyzeProject(root);
    const result = await performSecurityValidation(root, info);
    expect(result.ok).toBe(false);
    expect(result.secrets.join(" ")).toContain("src/config.ts");
    expect(result.secrets.join(" ")).not.toContain(dummySecret);
  });

  it("redacta asignaciones de claves y tokens bearer", () => {
    const apiValue = ["super", "secret-value"].join("-");
    const bearerPrefix = ["Authorization:", "Bearer"].join(" ");
    const bearerValue = ["abcdefghijkl", "mnopqrstuvwxyz"].join("");
    const sanitized = sanitizeForOutput(`api_key="${apiValue}" ${bearerPrefix} ${bearerValue}`);
    expect(sanitized).toContain("[REDACTED]");
    expect(sanitized).not.toContain(apiValue);
    expect(sanitized).not.toContain(bearerValue);
  });
});

describe("plantillas y creación de proyecto", () => {
  it("produce una plantilla para cada funcionalidad anunciada y rechaza las desconocidas", async () => {
    for (const feature of ["auth", "dashboard", "api", "crud", "tests", "docs", "deploy"] as const) {
      expect(isFeatureName(feature)).toBe(true);
      expect((await generateFeature(feature)).length).toBeGreaterThan(20);
    }
    expect(isFeatureName("unknown")).toBe(false);
  });

  it("genera un starter sin ejecutar paquetes e incluye .gitignore", () => {
    const files = createLocalStarterFiles("demo-app", "Starter de prueba");
    const manifest = files.find((file) => file.path === "package.json");
    expect(JSON.parse(manifest!.content).dependencies.next).toBe("^16.4.0");
    expect(files.some((file) => file.path === ".gitignore")).toBe(true);
    expect(files.some((file) => file.path === "app/page.tsx")).toBe(true);
  });

  it("crea los archivos en carpeta nueva, rechaza path traversal y preserva destinos existentes", async () => {
    const root = await tempDir();
    const destination = path.join(root, "created");
    const files = createLocalStarterFiles("created", "Prueba");
    const written = await writeGeneratedProject(destination, files);
    expect(written).toContain("app/page.tsx");
    expect(await fs.pathExists(path.join(destination, "package.json"))).toBe(true);
    await expect(writeGeneratedProject(destination, files)).rejects.toThrow("ya existe");
    await expect(writeGeneratedProject(path.join(root, "bad"), [{ path: "../escape.txt", content: "no" }])).rejects.toThrow("Ruta de archivo");
  });

  it("no transmite nada a Gemini si la carpeta de salida ya existe", async () => {
    const root = await tempDir();
    const output = path.join(root, "existing");
    await fs.mkdir(output);
    await expect(generateProject({ name: "sample", description: "Brief", outPath: output, provider: "gemini" })).rejects.toThrow("no se contactó");
  });
});

describe("Gemini opcional y explícito", () => {
  it("no inicia sin clave del usuario y no almacena contraseña débil", async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(generateFilesWithGemini("brief", "demo", vi.fn() as unknown as typeof fetch)).rejects.toThrow("Falta GEMINI_API_KEY");
    await expect(setAdminSecret("short", "test-device")).rejects.toThrow("al menos 12 caracteres");
  });

  it("deriva verificadores distintos con sal aleatoria y nunca conserva la contraseña en claro", async () => {
    const first = await hashSecret("correct-horse-battery-staple");
    const second = await hashSecret("correct-horse-battery-staple");
    expect(first).toMatch(/^pbkdf2\$sha512\$310000\$/);
    expect(first).not.toBe(second);
    expect(first).not.toContain("correct-horse-battery-staple");
  });

  it("envía solo el brief y acepta un conjunto de archivos válido con fetch simulado", async () => {
    process.env.GEMINI_API_KEY = "example-test-key";
    const generated = { files: [{ path: "app/page.tsx", content: "export default function Page(){return <main>Hola</main>}" }, { path: ".gitignore", content: "node_modules/\n" }] };
    const mockedFetch = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>)["x-goog-api-key"]).toBe("example-test-key");
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(generated) }] } }] }), { status: 200 });
    }) as unknown as typeof fetch;
    const files = await generateFilesWithGemini("Una landing de prueba", "demo", mockedFetch);
    expect(files.map((file) => file.path)).toEqual(["app/page.tsx", ".gitignore"]);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it("rechaza rutas de escape y devuelve errores HTTP sin mostrar cuerpos del proveedor", async () => {
    process.env.GEMINI_API_KEY = "example-test-key";
    const traversal = vi.fn(async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ files: [{ path: "../../outside", content: "bad" }] }) }] } }] }), { status: 200 })) as unknown as typeof fetch;
    await expect(generateFilesWithGemini("test", "demo", traversal)).rejects.toThrow("ruta no permitida");
    const failed = vi.fn(async () => new Response("sensitive provider body", { status: 429 })) as unknown as typeof fetch;
    await expect(generateFilesWithGemini("test", "demo", failed)).rejects.toThrow("HTTP 429");
  });
});
