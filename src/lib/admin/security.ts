import crypto from "node:crypto";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";

const ADMIN_DIR = path.join(os.homedir(), ".ai-builder");
const ADMIN_FILE = path.join(ADMIN_DIR, "admin.json");

export async function ensureAdminState() {
  await fs.ensureDir(ADMIN_DIR);

  if (!(await fs.pathExists(ADMIN_FILE))) {
    await fs.writeJson(
      ADMIN_FILE,
      {
        enabled: false,
        deviceName: null,
        privateMode: true,
        lastSync: null,
        trustedDevices: [],
      },
      { spaces: 2 }
    );
  }
}

export function hashSecret(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function generateAdminToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export async function setAdminSecret(secret: string, deviceName: string): Promise<string> {
  await ensureAdminState();
  const tokenHash = hashSecret(secret);

  const config = await fs.readJson(ADMIN_FILE);
  config.enabled = true;
  config.privateMode = true;
  config.deviceName = deviceName;
  config.lastSync = new Date().toISOString();
  config.tokenHash = tokenHash;

  await fs.writeJson(ADMIN_FILE, config, { spaces: 2 });
  return tokenHash;
}

export async function validateAdminSecret(secret: string): Promise<boolean> {
  try {
    await ensureAdminState();
    const config = await fs.readJson(ADMIN_FILE);
    return config.tokenHash === hashSecret(secret);
  } catch {
    return false;
  }
}

export async function getAdminStatus() {
  await ensureAdminState();
  const config = await fs.readJson(ADMIN_FILE);

  return {
    enabled: Boolean(config.enabled),
    privateMode: Boolean(config.privateMode),
    lastSync: config.lastSync ?? null,
    deviceName: config.deviceName ?? null,
    trustedDevices: config.trustedDevices ?? [],
  };
}

export function getPrivateAdminPath(): string {
  return ADMIN_FILE;
}
