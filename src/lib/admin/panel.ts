import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { getCurrentDeviceInfo, listTrustedDevices } from "./deviceSync.js";

export async function getAdminPanelState() {
  const adminDir = path.join(os.homedir(), ".ai-builder");
  const adminFile = path.join(adminDir, "admin.json");
  if (!(await fs.pathExists(adminFile))) {
    return { enabled: false, privateMode: true, deviceName: null as string | null, lastSync: null as string | null, devices: [] };
  }
  const config = await fs.readJson(adminFile);
  return {
    enabled: Boolean(config.enabled), privateMode: Boolean(config.privateMode),
    deviceName: config.deviceName ?? null, lastSync: config.lastSync ?? null,
    devices: await listTrustedDevices(),
  };
}

/** Produce solo una vista de metadatos locales; no copia credenciales ni sincroniza dispositivos. */
export async function exportPrivateAdminBundle(): Promise<string> {
  const state = await getAdminPanelState();
  return JSON.stringify({ exportedAt: new Date().toISOString(), device: getCurrentDeviceInfo(), enabled: state.enabled, privateMode: state.privateMode, trustedDeviceCount: state.devices.length }, null, 2);
}
