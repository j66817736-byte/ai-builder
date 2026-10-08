import crypto from "node:crypto";
import fs from "fs-extra";
import path from "node:path";

export interface GeneratedFile { path: string; content: string }

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function createLocalStarterFiles(name: string, description: string): GeneratedFile[] {
  const safeName = name.toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(safeName)) throw new Error("El nombre debe ser un slug npm: minúsculas, números y guiones.");
  const title = name.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  const safeTitle = JSON.stringify(title);
  const safeDescription = JSON.stringify(description.trim().slice(0, 500) || "Una base rápida, accesible y lista para personalizar.");
  const packageJson = {
    name: safeName,
    version: "0.1.0",
    private: true,
    scripts: { dev: "next dev", build: "next build", start: "next start", typecheck: "tsc --noEmit" },
    engines: { node: ">=20.9.0" },
    dependencies: { next: "^16.4.0", react: "^19.2.0", "react-dom": "^19.2.0" },
    devDependencies: { "@types/node": "^22.0.0", "@types/react": "^19.2.0", "@types/react-dom": "^19.2.0", typescript: "^5.7.0" },
  };
  return [
    { path: "package.json", content: `${JSON.stringify(packageJson, null, 2)}\n` },
    { path: "tsconfig.json", content: `${JSON.stringify({ compilerOptions: { target: "ES2022", lib: ["dom", "dom.iterable", "esnext"], allowJs: false, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "preserve", incremental: true, plugins: [{ name: "next" }], paths: { "@/*": ["./*"] } }, include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], exclude: ["node_modules"] }, null, 2)}\n` },
    { path: "next.config.ts", content: `import type { NextConfig } from "next";\nconst nextConfig: NextConfig = {};\nexport default nextConfig;\n` },
    { path: "next-env.d.ts", content: `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// Archivo generado por Next.js.\n` },
    { path: "app/layout.tsx", content: `import type { Metadata } from "next";\nimport "./globals.css";\n\nexport const metadata: Metadata = { title: ${safeTitle}, description: ${safeDescription} };\n\nexport default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {\n  return <html lang="es"><body>{children}</body></html>;\n}\n` },
    { path: "app/page.tsx", content: `export default function Home() {\n  return (\n    <main className="shell">\n      <nav className="nav"><a className="brand" href="#inicio">${escapeHtml(title)}</a><a href="#empezar">Empezar</a></nav>\n      <section id="inicio" className="hero">\n        <p className="eyebrow">Tu próximo proyecto empieza aquí</p>\n        <h1>${escapeHtml(title)}</h1>\n        <p className="intro">{${safeDescription}}</p>\n        <a id="empezar" className="button" href="https://nextjs.org/docs" rel="noreferrer">Explorar documentación</a>\n      </section>\n      <section className="cards" aria-label="Principios del proyecto">\n        <article><span>01</span><h2>Construye</h2><p>Empieza con una estructura clara y componentes reutilizables.</p></article>\n        <article><span>02</span><h2>Personaliza</h2><p>Adapta el contenido, los colores y la experiencia a tu producto.</p></article>\n        <article><span>03</span><h2>Verifica</h2><p>Prueba la aplicación y revisa su seguridad antes de publicarla.</p></article>\n      </section>\n      <footer>Generado con AI Builder · Revisa el código antes de desplegarlo.</footer>\n    </main>\n  );\n}\n` },
    { path: "app/globals.css", content: `:root { color-scheme: light; --ink: #14241f; --muted: #5c6b65; --accent: #176b52; --paper: #f6f8f5; }\n* { box-sizing: border-box; }\nhtml { scroll-behavior: smooth; }\nbody { margin: 0; background: var(--paper); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }\na { color: inherit; }\n.shell { max-width: 1120px; margin: auto; padding: 24px; }\n.nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; }\n.brand { font-weight: 800; text-decoration: none; }\n.hero { padding: clamp(72px, 14vw, 150px) 0 92px; max-width: 800px; }\n.eyebrow, .cards span { color: var(--accent); font-size: .78rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }\nh1 { max-width: 800px; margin: 14px 0; font-size: clamp(3rem, 9vw, 6.5rem); line-height: .98; letter-spacing: -.065em; }\n.intro { max-width: 600px; color: var(--muted); font-size: 1.2rem; line-height: 1.7; }\n.button { display: inline-block; margin-top: 18px; border-radius: 999px; background: var(--accent); color: #fff; padding: 14px 22px; text-decoration: none; font-weight: 700; }\n.button:focus-visible, a:focus-visible { outline: 3px solid #efa943; outline-offset: 4px; }\n.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }\n.cards article { border: 1px solid #dce5df; border-radius: 20px; padding: 24px; background: white; }\n.cards h2 { margin: 22px 0 8px; }\n.cards p, footer { color: var(--muted); line-height: 1.6; }\nfooter { padding: 52px 0 24px; font-size: .9rem; }\n@media (max-width: 680px) { .shell { padding: 18px; } .cards { grid-template-columns: 1fr; } .hero { padding: 72px 0; } }\n@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }\n` },
    { path: ".gitignore", content: `node_modules/\n.next/\ndist/\ncoverage/\n.env\n.env.*\n!.env.example\n*.log\n.DS_Store\n` },
    { path: "README.md", content: `# ${title}\n\n${description || "Proyecto web creado con AI Builder."}\n\n## Requisitos\nNode.js 20.9 o superior.\n\n## Inicio\n\`\`\`sh\nnpm install\nnpm run dev\n\`\`\`\n\nAbre http://localhost:3000. Revisa y personaliza el código antes de publicar.\n` },
    { path: "AI-BUILDER-NOTES.md", content: "# Notas de generación\n\nEste starter se creó localmente desde una plantilla. No se ejecutaron comandos de instalación ni despliegue. Inspecciona el código y ejecuta `npm install` manualmente cuando estés listo.\n" },
  ];
}

export async function writeGeneratedProject(outPath: string, files: GeneratedFile[]): Promise<string[]> {
  const destination = path.resolve(outPath);
  if (await fs.pathExists(destination)) throw new Error(`La carpeta de salida ya existe; no se sobrescribió nada: ${destination}`);
  const parent = path.dirname(destination);
  await fs.ensureDir(parent);
  const lockPath = path.join(parent, `.${path.basename(destination)}.ai-builder.lock`);
  let lock;
  try { lock = await fs.open(lockPath, "wx", 0o600); }
  catch { throw new Error("No se pudo obtener el bloqueo de escritura; puede haber otra generación en curso."); }
  const staging = path.join(parent, `.${path.basename(destination)}.tmp-${crypto.randomUUID()}`);
  try {
    if (await fs.pathExists(destination)) throw new Error(`La carpeta de salida ya existe; no se sobrescribió nada: ${destination}`);
    const seen = new Set<string>();
    for (const file of files) {
      const normalized = file.path.replaceAll("\\", "/");
      const segments = normalized.split("/");
      if (!normalized || path.posix.isAbsolute(normalized) || segments.some((segment) => !segment || segment === "." || segment === ".." || (segment.startsWith(".") && normalized !== ".gitignore")) || seen.has(normalized)) {
        throw new Error(`Ruta de archivo no permitida: ${normalized}`);
      }
      seen.add(normalized);
      if (Buffer.byteLength(file.content, "utf8") > 100_000) throw new Error(`Archivo excede el límite de tamaño: ${normalized}`);
    }
    await fs.mkdir(staging, { mode: 0o755 });
    for (const file of files) {
      const target = path.join(staging, file.path.split("/").join(path.sep));
      await fs.ensureDir(path.dirname(target));
      await fs.writeFile(target, file.content, { encoding: "utf8", flag: "wx", mode: 0o644 });
    }
    await fs.rename(staging, destination);
    return files.map(({ path: filePath }) => filePath);
  } finally {
    if (await fs.pathExists(staging)) await fs.remove(staging);
    await fs.close(lock);
    await fs.remove(lockPath);
  }
}
