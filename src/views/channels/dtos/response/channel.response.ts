export interface ChannelResponse {
  id: number;
  organization_id: number;
  application_id: number;
  name: string;
  provider: "whatsapp_waha" | "whatsapp_cloud";
  status: "active" | "inactive" | "pending_qr" | "error";
  phone_number: string | null;
  config: Record<string, unknown>;
  whitelist: string[];
  created_at: string;
  updated_at: string;
}

export interface RuleResponse {
  id: number;
  channel_id: number;
  agent_id: number;
  order_index: number;
  rule_type: "default" | "schedule" | "keyword";
  condition: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactResponse {
  id: number;
  channel_id: number;
  external_ref: string;
  display_name: string | null;
  agent_session_id: string | null;
  last_message_at: string | null;
}

export interface MessageResponse {
  id: number;
  direction: "inbound" | "outbound";
  content_type: "text" | "image" | "audio" | "document" | "video";
  content: string | null;
  media_url: string | null;
  created_at: string;
}

export interface QRResponse {
  qr: string;
  status: string;
}
