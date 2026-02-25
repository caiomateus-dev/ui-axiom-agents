export interface ApiKeyResponse {
  id: number;
  application_id: number;
  application_name: string;
  name: string;
  key: string;
  is_active: boolean;
  expires_at: string | null;
  last_used_at: string | null;
  usage_count: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
