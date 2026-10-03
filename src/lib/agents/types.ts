export type AgentContext = {
  request: string;
  projectName: string;
  stack: string;
  context?: Record<string, any>;
};

export type AgentResult = {
  ok: boolean;
  status: "success" | "warning" | "error";
  data?: any;
  errors?: string[];
  summary: string;
};

export type Agent = {
  name: string;
  run: (ctx: AgentContext) => Promise<AgentResult>;
};
