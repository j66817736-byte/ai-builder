import chalk from "chalk";
import { getAdminSecurityCheck, getAdminStatus, setAdminSecret, validateAdminSecret } from "./security.js";
import { getAdminPanelState } from "./panel.js";
import { listTrustedDevices, registerDevice } from "./deviceSync.js";

export async function adminStatusCommand(): Promise<void> {
  const status = await getAdminStatus();
  console.log(chalk.cyan.bold("\n🔐 Administrador local de AI Builder\n"));
  console.log(`  Estado: ${status.enabled ? "Habilitado" : "Deshabilitado"}`);
  console.log(`  Modo privado: ${status.privateMode ? "Sí" : "No"}`);
  console.log(`  Última actualización: ${status.lastSync ?? "Nunca"}`);
  console.log(`  Dispositivo principal: ${status.deviceName ?? "No registrado"}`);
  console.log(`  Dispositivos confiables: ${status.trustedDevices.length}`);
}

export async function adminEnableCommand(secret: string, deviceName: string): Promise<void> {
  await setAdminSecret(secret, deviceName);
  console.log(chalk.green("Acceso administrativo habilitado con almacenamiento local privado."));
  console.log(chalk.gray("La contraseña no se muestra ni se almacena en texto claro."));
}

export async function adminValidateCommand(secret: string): Promise<boolean> {
  const valid = await validateAdminSecret(secret);
  console.log(valid ? chalk.green("Acceso administrativo válido") : chalk.red("Acceso inválido o no configurado"));
  return valid;
}

export async function adminRegisterDeviceCommand(secret: string, name: string): Promise<boolean> {
  if (!(await validateAdminSecret(secret))) { console.error(chalk.red("Acceso inválido o no configurado; no se registró el dispositivo.")); return false; }
  const device = await registerDevice(name);
  console.log(chalk.green(`Dispositivo confiable registrado: ${device.name} (${device.os}).`));
  return true;
}

export async function adminListDevicesCommand(secret: string): Promise<boolean> {
  if (!(await validateAdminSecret(secret))) { console.error(chalk.red("Acceso inválido o no configurado; no se listaron dispositivos.")); return false; }
  const devices = await listTrustedDevices();
  console.log(chalk.cyan.bold("\nDispositivos confiables registrados localmente\n"));
  if (!devices.length) console.log("  Ninguno");
  else devices.forEach((device) => console.log(`  - ${device.name} (${device.os}) · ${device.timestamp}`));
  return true;
}

export async function adminSecurityCheckCommand(secret: string): Promise<boolean> {
  if (!(await validateAdminSecret(secret))) { console.error(chalk.red("Acceso inválido o no configurado.")); return false; }
  const result = await getAdminSecurityCheck();
  console.log(chalk.cyan.bold("\nRevisión del almacenamiento administrativo local\n"));
  if (result.ok) console.log(chalk.green("✅ Permisos privados de directorio y archivo"));
  else result.issues.forEach((issue) => console.log(chalk.red(`❌ ${issue}`)));
  console.log(chalk.gray("Esta comprobación no es una auditoría del sistema operativo ni verifica sincronización remota."));
  return result.ok;
}

export async function adminPanelCommand(): Promise<void> {
  const state = await getAdminPanelState();
  console.log(chalk.magenta.bold("\n=== Estado local de AI Builder ===\n"));
  console.log(`Administrador: ${state.enabled ? "Habilitado" : "Deshabilitado"}`);
  console.log(`Modo privado: ${state.privateMode ? "Sí" : "No"}`);
  console.log(`Última actualización: ${state.lastSync ?? "Nunca"}`);
  console.log(`Dispositivo principal: ${state.deviceName ?? "No disponible"}`);
  console.log(`Dispositivos registrados: ${state.devices.length}`);
  console.log(chalk.gray("No hay interfaz web ni sincronización multidispositivo implementada."));
}
