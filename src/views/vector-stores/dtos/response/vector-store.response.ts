export interface VectorStoreResponse {
  id: number;
  agent_id: number;
  agent_name: string;
  version: number;
  is_active: boolean;
  metadata: Record<string, unknown>;
  description: string;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}
