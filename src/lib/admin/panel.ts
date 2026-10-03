import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { getCurrentDeviceInfo, listTrustedDevices } from "./deviceSync.js";

export async function getAdminPanelState() {
  const adminDir = path.join(os.homedir(), ".ai-builder");
  const adminFile = path.join(adminDir, "admin.json");

  if (!(await fs.pathExists(adminFile))) {
    return {
      enabled: false,
      privateMode: true,
      deviceName: null,
      lastSync: null,
      devices: [],
    };
  }

  const config = await fs.readJson(adminFile);
  const devices = await listTrustedDevices();

  return {
    enabled: Boolean(config.enabled),
    privateMode: Boolean(config.privateMode),
    deviceName: config.deviceName ?? null,
    lastSync: config.lastSync ?? null,
    devices,
  };
}

export async function exportPrivateAdminBundle() {
  const deviceInfo = getCurrentDeviceInfo();
  const bundle = {
    exportedAt: new Date().toISOString(),
    device: deviceInfo,
    status: "private-admin-bundle",
    note: "Archivos sensibles permanecen en dispositivos autorizados. No se publican en repositorios.",
  };

  return JSON.stringify(bundle, null, 2);
}

export async function syncPrivateAdminToDevice(deviceName: string) {
  const device = getCurrentDeviceInfo();
  const bundle = await exportPrivateAdminBundle();

  return {
    deviceName,
    currentDevice: device,
    bundle,
    syncedAt: new Date().toISOString(),
    mode: "secure-private-sync",
  };
}
