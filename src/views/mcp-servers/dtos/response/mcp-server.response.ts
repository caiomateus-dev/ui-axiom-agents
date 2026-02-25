export interface McpServerResponse {
  id: number;
  connection_type_id: number;
  connection_type_name: string;
  name: string;
  config: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConnectionTypeResponse {
  id: number;
  name: string;
  description: string;
}
