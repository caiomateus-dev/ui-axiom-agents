export interface ToolResponse {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentToolResponse {
  tool: ToolResponse;
  order_index: number;
  is_active: boolean;
}
