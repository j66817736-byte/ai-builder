export type ProjectKind = "nextjs" | "react" | "express" | "vue" | "node" | "custom";

export interface ProjectInfo {
  path: string;
  name: string;
  description: string | null;
  framework: string | null;
  language: "TypeScript" | "JavaScript" | "Desconocido";
  type: ProjectKind;
  hasPackageJson: boolean;
  hasNextConfig: boolean;
  hasTsConfig: boolean;
  hasTailwind: boolean;
  hasTests: boolean;
  hasAuth: boolean;
  hasDashboard: boolean;
  hasDocs: boolean;
  hasGitIgnore: boolean;
  rootFiles: string[];
  directories: string[];
  dependencies: string[];
  scripts: Record<string, string>;
  warnings: string[];
}

export type CheckStatus = "pass" | "warn" | "fail";

export interface ValidationCheck {
  name: string;
  status: CheckStatus;
  message?: string;
}

export interface ValidationResult {
  ok: boolean;
  checks: ValidationCheck[];
  /** Secret findings contain filenames and categories only, never matched values. */
  secrets: string[];
  recommendations: string[];
}
