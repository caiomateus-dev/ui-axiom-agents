export interface AttachmentResponse {
  b64: string;
  url?: string;
  contentType: string;
  filename?: string;
}

export interface ChatMessageResponse {
  role: string;
  content: string;
  created_at: string;
}

export interface ChatResponse {
  message: string;
  session_id: string;
  agent_id: number;
  agent_name: string;
  tokens_used: number;
  needs_human_handoff?: boolean;
  handoff_reason?: string;
  images?: AttachmentResponse[];
  documents?: AttachmentResponse[];
  audios?: AttachmentResponse[];
}

export interface ChatSessionResponse {
  id: number;
  session_id: string;
  external_ref: string | null;
  agent_name: string;
  messages: ChatMessageResponse[];
  created_at: string;
  updated_at: string;
}
