import type { Agent, AgentContext, AgentResult } from "./types.js";

const plannerAgent: Agent = {
  name: "PlannerAgent",
  async run(ctx: AgentContext): Promise<AgentResult> {
    return {
      ok: true,
      status: "success",
      data: {
        objective: "Definir la idea del proyecto y el alcance",
        request: ctx.request,
        projectName: ctx.projectName,
        stack: ctx.stack,
      },
      summary: "Se definió el objetivo del proyecto.",
    };
  },
};

const architectureAgent: Agent = {
  name: "ArchitectureAgent",
  async run(_ctx: AgentContext): Promise<AgentResult> {
    return {
      ok: true,
      status: "success",
      data: {
        framework: "Next.js + TypeScript",
        styling: "Tailwind CSS",
        folders: ["app", "components", "lib", "services"],
        pattern: "modular architecture",
      },
      summary: "Se eligió la arquitectura base.",
    };
  },
};

const uiAgent: Agent = {
  name: "UIAgent",
  async run(_ctx: AgentContext): Promise<AgentResult> {
    return {
      ok: true,
      status: "success",
      data: {
        pages: ["Landing", "Dashboard", "Form"],
        style: "clean, modern, responsive",
      },
      summary: "Se definieron las pantallas principales.",
    };
  },
};

const qaAgent: Agent = {
  name: "QAAgent",
  async run(_ctx: AgentContext): Promise<AgentResult> {
    return {
      ok: true,
      status: "success",
      data: {
        validations: ["TypeScript", "Lint", "Build", "Tests"],
        status: "ready",
      },
      summary: "Se validó la base de calidad.",
    };
  },
};

const docsAgent: Agent = {
  name: "DocsAgent",
  async run(_ctx: AgentContext): Promise<AgentResult> {
    return {
      ok: true,
      status: "success",
      data: {
        readme: "README.md created",
        envExample: ".env.example created",
      },
      summary: "Se preparó la documentación base.",
    };
  },
};

export const defaultAgents = [
  plannerAgent,
  architectureAgent,
  uiAgent,
  qaAgent,
  docsAgent,
];
