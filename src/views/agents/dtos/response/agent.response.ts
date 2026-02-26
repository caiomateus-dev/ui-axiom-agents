export interface AgentResponse {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  is_active: boolean;
  organization_id: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
