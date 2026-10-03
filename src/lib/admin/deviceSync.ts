import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const DEVICES_DIR = path.join(os.homedir(), ".ai-builder", "devices");

export type DeviceInfo = {
  id: string;
  name: string;
  os: string;
  timestamp: string;
  trusted: boolean;
};

export async function registerDevice(deviceName: string): Promise<DeviceInfo> {
  await fs.ensureDir(DEVICES_DIR);

  const info: DeviceInfo = {
    id: crypto.randomUUID(),
    name: deviceName,
    os: process.platform,
    timestamp: new Date().toISOString(),
    trusted: true,
  };

  const filePath = path.join(DEVICES_DIR, `${info.id}.json`);
  await fs.writeJson(filePath, info, { spaces: 2 });

  return info;
}

export async function listTrustedDevices(): Promise<DeviceInfo[]> {
  try {
    await fs.ensureDir(DEVICES_DIR);
    const files = await fs.readdir(DEVICES_DIR);

    const devices: DeviceInfo[] = [];
    for (const file of files) {
      if (file.endsWith(".json")) {
        try {
          const content = await fs.readJson(path.join(DEVICES_DIR, file));
          devices.push(content as DeviceInfo);
        } catch {
          // ignore malformed file
        }
      }
    }

    return devices.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch {
    return [];
  }
}

export function getCurrentDeviceInfo(): DeviceInfo {
  return {
    id: crypto.randomUUID(),
    name: os.hostname(),
    os: process.platform,
    timestamp: new Date().toISOString(),
    trusted: true,
  };
}
