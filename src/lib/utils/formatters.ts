import chalk from "chalk";

export function printHeader(title: string): void {
  console.log(`\n${chalk.cyan.bold(title)}\n${chalk.gray("─".repeat(Math.min(Math.max(title.length, 12), 72)))}`);
}

export function printSuccess(message: string): void { console.log(chalk.green(`✅ ${message}`)); }
export function printWarning(message: string): void { console.warn(chalk.yellow(`⚠️ ${message}`)); }
export function printError(message: string): void { console.error(chalk.red(`❌ ${message}`)); }
export function printInfo(message: string): void { console.log(chalk.blue(`ℹ️ ${message}`)); }
export function printTip(message: string): void { console.log(chalk.gray(`Consejo: ${message}`)); }
