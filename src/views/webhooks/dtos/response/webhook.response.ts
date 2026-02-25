export interface WebhookResponse {
  id: number;
  application_id: number;
  agent_id: number;
  agent_name: string;
  url: string;
  auth_type: string | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
