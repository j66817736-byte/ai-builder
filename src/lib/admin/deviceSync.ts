import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const ADMIN_DIR = path.join(os.homedir(), ".ai-builder");
const DEVICES_DIR = path.join(ADMIN_DIR, "devices");

export type DeviceInfo = { id: string; name: string; os: string; timestamp: string; trusted: boolean };

export async function registerDevice(deviceName: string): Promise<DeviceInfo> {
  const name = deviceName.trim();
  if (!name || name.length > 100) throw new Error("Indica un nombre de dispositivo válido (1–100 caracteres).");
  await fs.ensureDir(ADMIN_DIR, { mode: 0o700 });
  await fs.chmod(ADMIN_DIR, 0o700);
  await fs.ensureDir(DEVICES_DIR, { mode: 0o700 });
  await fs.chmod(DEVICES_DIR, 0o700);
  const info: DeviceInfo = { id: crypto.randomUUID(), name, os: process.platform, timestamp: new Date().toISOString(), trusted: true };
  await fs.writeJson(path.join(DEVICES_DIR, `${info.id}.json`), info, { spaces: 2, mode: 0o600, flag: "wx" });
  return info;
}

export async function listTrustedDevices(): Promise<DeviceInfo[]> {
  try {
    await fs.ensureDir(DEVICES_DIR, { mode: 0o700 });
    const files = await fs.readdir(DEVICES_DIR);
    const devices: DeviceInfo[] = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const value = await fs.readJson(path.join(DEVICES_DIR, file));
        if (value?.trusted === true && typeof value?.id === "string" && typeof value?.name === "string" && typeof value?.timestamp === "string") devices.push(value as DeviceInfo);
      } catch { /* Ignora registros corruptos sin detener el listado. */ }
    }
    return devices.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch { return []; }
}

export function getCurrentDeviceInfo(): DeviceInfo {
  const host = `${os.hostname()}\0${process.platform}\0${os.homedir()}`;
  return { id: crypto.createHash("sha256").update(host).digest("hex").slice(0, 24), name: os.hostname(), os: process.platform, timestamp: new Date().toISOString(), trusted: true };
}
