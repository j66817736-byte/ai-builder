import crypto from "node:crypto";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";

const ADMIN_DIR = path.join(os.homedir(), ".ai-builder");
const ADMIN_FILE = path.join(ADMIN_DIR, "admin.json");
const PBKDF2_ITERATIONS = 310_000;
const PBKDF2_BYTES = 64;

interface AdminState {
  enabled: boolean;
  deviceName: string | null;
  privateMode: boolean;
  lastSync: string | null;
  trustedDevices: Array<{ name: string; os: string }>;
  secretHash?: string;
  /** Backward-compatibility only; upgraded after a successful legacy validation. */
  tokenHash?: string;
}

async function writeSecureState(state: AdminState): Promise<void> {
  await fs.ensureDir(ADMIN_DIR, { mode: 0o700 });
  await fs.chmod(ADMIN_DIR, 0o700);
  const temporary = `${ADMIN_FILE}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.writeJson(temporary, state, { spaces: 2, mode: 0o600, flag: "wx" });
    await fs.chmod(temporary, 0o600);
    await fs.rename(temporary, ADMIN_FILE);
    await fs.chmod(ADMIN_FILE, 0o600);
  } finally {
    if (await fs.pathExists(temporary)) await fs.remove(temporary);
  }
}

export async function ensureAdminState(): Promise<void> {
  await fs.ensureDir(ADMIN_DIR, { mode: 0o700 });
  await fs.chmod(ADMIN_DIR, 0o700);
  if (!(await fs.pathExists(ADMIN_FILE))) {
    await writeSecureState({ enabled: false, deviceName: null, privateMode: true, lastSync: null, trustedDevices: [] });
  } else {
    await fs.chmod(ADMIN_FILE, 0o600);
  }
}

export async function hashSecret(value: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(value, salt, PBKDF2_ITERATIONS, PBKDF2_BYTES, "sha512", (error, key) => error ? reject(error) : resolve(key));
  });
  return `pbkdf2$sha512$${PBKDF2_ITERATIONS}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

async function verifyPbkdf2(secret: string, encoded: string): Promise<boolean> {
  const match = /^pbkdf2\$sha512\$(\d{5,7})\$([a-f0-9]{32})\$([a-f0-9]{128})$/i.exec(encoded);
  if (!match) return false;
  const iterations = Number(match[1]);
  if (iterations < 50_000 || iterations > 1_000_000) return false;
  const salt = Buffer.from(match[2], "hex");
  const expected = Buffer.from(match[3], "hex");
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(secret, salt, iterations, expected.length, "sha512", (error, key) => error ? reject(error) : resolve(key));
  });
  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
}

export function generateAdminToken(): string { return crypto.randomBytes(32).toString("hex"); }

export async function setAdminSecret(secret: string, deviceName: string): Promise<string> {
  if (secret.length < 12) throw new Error("La contraseña de administrador debe tener al menos 12 caracteres.");
  if (!deviceName.trim() || deviceName.length > 100) throw new Error("Indica un nombre de dispositivo válido (1–100 caracteres).");
  await ensureAdminState();
  const config = await fs.readJson(ADMIN_FILE) as AdminState;
  const secretHash = await hashSecret(secret);
  await writeSecureState({ ...config, enabled: true, privateMode: true, deviceName: deviceName.trim(), lastSync: new Date().toISOString(), secretHash, tokenHash: undefined });
  return secretHash;
}

export async function validateAdminSecret(secret: string): Promise<boolean> {
  if (!secret) return false;
  try {
    await ensureAdminState();
    const config = await fs.readJson(ADMIN_FILE) as AdminState;
    if (typeof config.secretHash === "string" && await verifyPbkdf2(secret, config.secretHash)) return true;
    // Upgrade legacy unsalted SHA-256 state on successful login; do not retain the old verifier.
    if (typeof config.tokenHash === "string" && /^[a-f0-9]{64}$/i.test(config.tokenHash)) {
      const legacy = Buffer.from(crypto.createHash("sha256").update(secret).digest("hex"), "hex");
      const expected = Buffer.from(config.tokenHash, "hex");
      if (legacy.length === expected.length && crypto.timingSafeEqual(legacy, expected)) {
        const { tokenHash: _legacyHash, ...rest } = config;
        await writeSecureState({ ...rest, secretHash: await hashSecret(secret) });
        return true;
      }
    }
    return false;
  } catch { return false; }
}

export async function getAdminStatus(): Promise<Pick<AdminState, "enabled" | "privateMode" | "lastSync" | "deviceName" | "trustedDevices">> {
  await ensureAdminState();
  const config = await fs.readJson(ADMIN_FILE) as AdminState;
  return {
    enabled: Boolean(config.enabled), privateMode: Boolean(config.privateMode),
    lastSync: config.lastSync ?? null, deviceName: config.deviceName ?? null,
    trustedDevices: Array.isArray(config.trustedDevices) ? config.trustedDevices : [],
  };
}

export async function getAdminSecurityCheck(): Promise<{ ok: boolean; issues: string[] }> {
  if (process.platform === "win32") {
    return { ok: false, issues: ["La herramienta no puede verificar ACL de Windows; comprueba manualmente los permisos de %USERPROFILE%\\.ai-builder."] };
  }
  const issues: string[] = [];
  try {
    const dirStat = await fs.stat(ADMIN_DIR);
    const fileStat = await fs.stat(ADMIN_FILE);
    if ((dirStat.mode & 0o077) !== 0) issues.push("El directorio privado permite acceso a grupo u otros usuarios.");
    if ((fileStat.mode & 0o077) !== 0) issues.push("El archivo admin.json permite acceso a grupo u otros usuarios.");
    if (!fileStat.isFile()) issues.push("La ruta del estado administrativo no es un archivo regular.");
  } catch { issues.push("No se pudo comprobar el almacenamiento administrativo local."); }
  return { ok: issues.length === 0, issues };
}

export function getPrivateAdminPath(): string { return ADMIN_FILE; }
