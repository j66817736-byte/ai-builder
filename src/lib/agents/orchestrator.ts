import type { Agent, AgentContext, AgentResult } from "./types.js";

export class AgentOrchestrator {
  private agents: Agent[] = [];

  register(agent: Agent) {
    this.agents.push(agent);
  }

  async run(ctx: AgentContext): Promise<AgentResult> {
    const sharedContext: AgentContext = {
      ...ctx,
      context: {
        ...(ctx.context ?? {}),
      },
    };

    for (const agent of this.agents) {
      const result = await agent.run(sharedContext);

      if (!result.ok) {
        return {
          ok: false,
          status: "error",
          errors: result.errors ?? [`El agente ${agent.name} falló.`],
          summary: `Fallo en ${agent.name}`,
        };
      }

      sharedContext.context = {
        ...(sharedContext.context ?? {}),
        [agent.name]: result.data,
      };
    }

    return {
      ok: true,
      status: "success",
      data: sharedContext.context,
      summary: "Flujo completado con éxito.",
    };
  }
}
