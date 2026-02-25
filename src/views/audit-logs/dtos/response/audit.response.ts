export interface AuditResponse {
  id: number;
  session_id: number;
  agent_name: string;
  event_type: string;
  tool_name: string | null;
  tool_input: Record<string, unknown>;
  tool_output: string | null;
  user_message: string | null;
  agent_response: string | null;
  tokens_used: number;
  prompt_tokens: number;
  completion_tokens: number;
  model_used: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AuditListResponse {
  items: AuditResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AgentTokenStats {
  agent_name: string;
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  event_count: number;
}

export interface EventTypeStats {
  event_type: string;
  event_count: number;
}

export interface AuditStatsResponse {
  total_events: number;
  total_tokens: number;
  by_agent: AgentTokenStats[];
  by_event_type: EventTypeStats[];
}
