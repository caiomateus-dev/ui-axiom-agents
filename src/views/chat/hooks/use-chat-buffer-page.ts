import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { listAgents } from "@/views/agents/api/list-agents";
import { useApiKeys } from "@/views/api-keys/hooks/use-api-keys";
import { useApplications } from "@/views/applications/hooks/use-applications";

import { sendMessageBuffer } from "../api/send-message-buffer";
import type { MessageAttachment } from "../components/ChatBubble";
import type { ChatInputPayload } from "../components/ChatInput";
import type { AttachmentResponse } from "../dtos/response/chat.response";

export interface BufferMessage {
  role: "user" | "assistant";
  content: string;
  created_at: string;
  attachments?: MessageAttachment[];
  responseImages?: AttachmentResponse[];
  responseAudios?: AttachmentResponse[];
  responseDocuments?: AttachmentResponse[];
}

const POLL_INTERVAL = 2000; // ms
const POLL_TIMEOUT = 120_000; // 2 min max wait

export function useChatBufferPage() {
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [agentId, setAgentId] = useState<number | null>(null);
  const [apiKeyId, setApiKeyId] = useState<number | null>(null);
  const apiKeyRef = useRef<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<BufferMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadlineRef = useRef<number>(0);
  const lastAssistantCountRef = useRef(0);

  const { data: applications } = useApplications();
  const { data: apiKeys } = useApiKeys(applicationId ?? undefined);

  const agentsQuery = useQuery({
    queryKey: ["agents"],
    queryFn: listAgents,
  });

  const agentOptions = useMemo(
    () => (agentsQuery.data ?? []).map((a) => ({ value: a.id, label: a.name })),
    [agentsQuery.data],
  );

  // Derive selected API key value - if none selected, use first available
  const selectedApiKey = useMemo(() => {
    const id = apiKeyId ?? apiKeys?.[0]?.id;
    return apiKeys?.find((k) => k.id === id)?.key ?? null;
  }, [apiKeys, apiKeyId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    apiKeyRef.current = selectedApiKey;
  }, [selectedApiKey]);

  function stopPolling() {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    setIsPolling(false);
  }

  const pollHistory = useCallback(async (sid: string) => {
    if (Date.now() > pollDeadlineRef.current) {
      stopPolling();
      return;
    }
    try {
      const baseURL =
        (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";
      const resp = await axios.get(`${baseURL}/agents/chat/history`, {
        params: { session_id: sid },
        headers: { "X-API-Key": apiKeyRef.current ?? "" },
      });
      const data = resp.data as {
        messages: { role: string; content: string; created_at: string }[];
      };
      const assistantMsgs = data.messages.filter((m) => m.role === "assistant");
      // We got a new assistant message since we started polling
      if (assistantMsgs.length > lastAssistantCountRef.current) {
        lastAssistantCountRef.current = assistantMsgs.length;
        setMessages(
          data.messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
            created_at: m.created_at,
          })),
        );
        setIsSending(false);
        stopPolling();
      }
    } catch {
      // keep polling on transient errors
    }
  }, []);

  function startPolling(sid: string) {
    stopPolling();
    setIsPolling(true);
    pollDeadlineRef.current = Date.now() + POLL_TIMEOUT;
    pollTimerRef.current = setInterval(() => pollHistory(sid), POLL_INTERVAL);
  }

  async function handleSend(payload: ChatInputPayload) {
    if (!agentId || !selectedApiKey) return;
    setSendError(null);

    const attachments: MessageAttachment[] = [];
    if (payload.image) {
      attachments.push({
        type: "image",
        previewUrl: URL.createObjectURL(payload.image),
        contentType: payload.image.type,
        filename: payload.image.name,
      });
    }
    if (payload.audio) {
      attachments.push({
        type: "audio",
        previewUrl: URL.createObjectURL(payload.audio),
        contentType: payload.audio.type,
      });
    }
    if (payload.file) {
      attachments.push({
        type: "file",
        contentType: payload.file.type,
        filename: payload.file.name,
      });
    }

    const userMsg: BufferMessage = {
      role: "user",
      content: payload.text,
      created_at: new Date().toISOString(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);
    // Snapshot assistant count BEFORE sending — polling para quando o count aumentar
    lastAssistantCountRef.current = messages.filter((m) => m.role === "assistant").length;

    try {
      const data = await sendMessageBuffer({
        agentId,
        apiKey: selectedApiKey,
        text: payload.text,
        sessionId,
        image: payload.image,
        audio: payload.audio,
        file: payload.file,
      });

      setSessionId(data.session_id);
      startPolling(data.session_id);
    } catch (err) {
      console.error("[ChatBuffer] sendMessageBuffer error:", err);
      let msg = err instanceof Error ? err.message : String(err);
      // Extract backend error message from axios response
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as {
          response?: { data?: { message?: string; error?: string }; status?: number };
        };
        const backendMsg = axiosErr.response?.data?.message ?? axiosErr.response?.data?.error;
        if (backendMsg) msg = backendMsg;
        console.error(
          "[ChatBuffer] backend response:",
          axiosErr.response?.status,
          axiosErr.response?.data,
        );
      }
      setIsSending(false);
      setSendError(`Erro: ${msg}`);
    }
  }

  function handleReset() {
    stopPolling();
    setSessionId(undefined);
    setMessages([]);
    setSendError(null);
    lastAssistantCountRef.current = 0;
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, []);

  return {
    // Application / key selection
    applicationId,
    setApplicationId,
    applications,
    apiKeyId,
    setApiKeyId,
    apiKeys,
    selectedApiKey,
    // Agent selection
    agentId,
    setAgentId,
    agentOptions,
    isAgentsLoading: agentsQuery.isLoading,
    // Chat state
    sessionId,
    messages,
    messagesEndRef,
    handleSend,
    handleReset,
    isSending,
    isPolling,
    sendError,
  };
}
