import type { GeneratedFile } from "../generators/projectScaffold.js";

const DEFAULT_MODEL = "gemini-3.8-flash";
const MAX_FILES = 25;
const MAX_TOTAL_BYTES = 750_000;

function parseResponseText(payload: unknown): string {
  if (!payload || typeof payload !== "object") throw new Error("Respuesta vacía del proveedor de IA.");
  const candidates = (payload as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }).candidates;
  const text = candidates?.flatMap((candidate) => candidate.content?.parts ?? []).map((part) => part.text ?? "").join("").trim();
  if (!text) throw new Error("El proveedor no devolvió contenido de texto utilizable.");
  return text;
}

function validateGeneratedFiles(parsed: unknown): GeneratedFile[] {
  if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as { files?: unknown }).files)) {
    throw new Error("La respuesta de IA no contiene la estructura JSON { files: [...] } esperada.");
  }
  const files = (parsed as { files: unknown[] }).files;
  if (!files.length || files.length > MAX_FILES) throw new Error(`La respuesta debe contener entre 1 y ${MAX_FILES} archivos.`);
  let total = 0;
  const seen = new Set<string>();
  return files.map((raw) => {
    if (!raw || typeof raw !== "object") throw new Error("Entrada de archivo inválida en la respuesta de IA.");
    const item = raw as { path?: unknown; content?: unknown };
    if (typeof item.path !== "string" || typeof item.content !== "string") throw new Error("Cada archivo necesita path y content de texto.");
    const filePath = item.path.replaceAll("\\", "/");
    const segments = filePath.split("/");
    if (!filePath || filePath.length > 180 || segments.some((part) => !part || part === "." || part === ".." || (part.startsWith(".") && filePath !== ".gitignore")) || /[\0<>:"|?*]/.test(filePath) || /^[A-Za-z]:/.test(filePath)) {
      throw new Error(`La IA propuso una ruta no permitida: ${filePath}`);
    }
    if (/^(?:\.env|.*\/\.env)(?:\.|$)/i.test(filePath) || /(^|\/)(?:node_modules|\.git|\.next|dist)(\/|$)/i.test(filePath)) {
      throw new Error(`La IA propuso un archivo protegido: ${filePath}`);
    }
    const bytes = Buffer.byteLength(item.content, "utf8");
    if (bytes > 100_000) throw new Error(`El archivo generado excede 100 KB: ${filePath}`);
    total += bytes;
    if (total > MAX_TOTAL_BYTES) throw new Error("La respuesta de IA excede el límite total de 750 KB.");
    if (seen.has(filePath)) throw new Error(`Ruta duplicada en respuesta de IA: ${filePath}`);
    seen.add(filePath);
    return { path: filePath, content: item.content };
  });
}

export async function generateFilesWithGemini(description: string, projectName: string, requestFetch: typeof fetch = fetch): Promise<GeneratedFile[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Falta GEMINI_API_KEY. Configúrala en tu entorno; AI Builder no guarda ni solicita la clave.");
  const model = process.env.AI_BUILDER_GEMINI_MODEL || DEFAULT_MODEL;
  if (!/^[A-Za-z0-9._-]{1,80}$/.test(model)) throw new Error("AI_BUILDER_GEMINI_MODEL contiene caracteres no permitidos.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: "Eres un generador de proyectos web. Responde ÚNICAMENTE con JSON válido y sin markdown, exactamente con forma {\"files\":[{\"path\":\"ruta/relativa\",\"content\":\"contenido completo\"}]}. Genera un starter Next.js App Router con TypeScript, accesible y responsive. No incluyas secretos, llamadas de red en tiempo de ejecución, scripts de instalación, binarios ni archivos .env. Usa solo rutas relativas dentro del proyecto y entrega como máximo 25 archivos." }] },
    contents: [{ role: "user", parts: [{ text: `Crea el proyecto ${projectName} para esta descripción. Solo la descripción siguiente se envía al proveedor: ${description.slice(0, 4000)}` }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.25, maxOutputTokens: 16000 },
  };
  let response: Response;
  try {
    response = await requestFetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90_000),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.name : "Error de red";
    throw new Error(`No fue posible conectar con Gemini (${reason}). Revisa la conexión y vuelve a intentarlo.`, { cause: error });
  }
  if (!response.ok) throw new Error(`Gemini respondió HTTP ${response.status}; revisa el modelo, la clave y la cuota. No se muestra el cuerpo de error para evitar filtrar datos.`);
  const payload: unknown = await response.json();
  const text = parseResponseText(payload);
  let parsed: unknown;
  try { parsed = JSON.parse(text); }
  catch { throw new Error("Gemini no devolvió JSON válido; no se escribió ningún archivo."); }
  return validateGeneratedFiles(parsed);
}
