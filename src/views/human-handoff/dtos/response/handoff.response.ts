export interface HandoffSessionItem {
  session_id: string;
  agent_id: number;
  agent_name: string;
  external_ref: string | null;
  handoff_reason: string | null;
  updated_at: string;
  created_at: string;
}

export interface ListHandoffResponse {
  sessions: HandoffSessionItem[];
  total: number;
}

export interface ReleaseHandoffResponse {
  message: string;
  session_id: string;
  external_ref: string | null;
  agent_id: number;
  agent_name: string;
  needs_human_handoff: boolean;
}
