import chalk from "chalk";
import { getAdminStatus, validateAdminSecret, setAdminSecret, generateAdminToken } from "../admin/security.js";
import { getAdminPanelState, syncPrivateAdminToDevice } from "./panel.js";

export async function adminStatusCommand() {
  const status = await getAdminStatus();

  console.log(chalk.cyan.bold("\n🔐 Panel de Administración Privado\n"));
  console.log(`  Estado: ${status.enabled ? "Habilitado" : "Deshabilitado"}`);
  console.log(`  Modo privado: ${status.privateMode ? "Sí" : "No"}`);
  console.log(`  Última sincronización: ${status.lastSync ?? "Nunca"}`);
  console.log(`  Dispositivo principal: ${status.deviceName ?? "No registrado"}`);

  if (status.trustedDevices?.length) {
    console.log(chalk.green("\nDispositivos confiables:"));
    status.trustedDevices.forEach((device) => {
      console.log(`  - ${device.name} (${device.os})`);
    });
  }
}

export async function adminEnableCommand(secret: string, deviceName: string) {
  const tokenHash = await setAdminSecret(secret, deviceName);
  console.log(chalk.green("Acceso de administrador habilitado."));
  console.log(chalk.gray(`Hash de sesión: ${tokenHash.slice(0, 12)}...`));
}

export async function adminValidateCommand(secret: string) {
  const valid = await validateAdminSecret(secret);
  console.log(valid ? chalk.green("Acceso de administrador válido") : chalk.red("Acceso inválido o no configurado"));
}

export async function adminSyncCommand(deviceName: string) {
  const payload = await syncPrivateAdminToDevice(deviceName);
  console.log(chalk.green("Sincronización privada completada"));
  console.log(JSON.stringify(payload, null, 2));
}

export async function adminPanelCommand() {
  const state = await getAdminPanelState();

  console.log(chalk.magenta.bold("\n=== Administrador Privado ===\n"));
  console.log(`Enabled: ${state.enabled ? "Sí" : "No"}`);
  console.log(`Private mode: ${state.privateMode ? "Sí" : "No"}`);
  console.log(`Last sync: ${state.lastSync ?? "Nunca"}`);
  console.log(`Current device: ${state.deviceName ?? "No disponible"}`);

  console.log(chalk.gray("\nDispositivos registrados:"));
  if (state.devices.length === 0) {
    console.log("  - Ninguno");
  } else {
    state.devices.forEach((device) => {
      console.log(`  - ${device.name} / ${device.os} / ${device.timestamp}`);
    });
  }
}
