export interface ToolResponse {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentToolResponse {
  id: number;
  agent_id: number;
  tool_id: number;
  tool: ToolResponse;
  created_at: string;
}
