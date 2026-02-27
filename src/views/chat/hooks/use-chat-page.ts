import { useEffect, useMemo, useRef, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import type { AutocompleteOption } from "@/components";

import { listAgents } from "@/views/agents/api/list-agents";

import { getChatHistory } from "../api/get-history";
import { resetChatSession } from "../api/reset-session";
import { sendMessage } from "../api/send-message";
import type { MessageAttachment } from "../components/ChatBubble";
import type { ChatInputPayload } from "../components/ChatInput";
import type { AttachmentResponse } from "../dtos/response/chat.response";

export interface Message {
  role: "user" | "assistant";
  content: string;
  created_at: string;
  attachments?: MessageAttachment[];
  responseImages?: AttachmentResponse[];
  responseAudios?: AttachmentResponse[];
  responseDocuments?: AttachmentResponse[];
}

interface UseChatPageOptions {
  /** Pre-select an agent and lock the selector */
  fixedAgentId?: number;
}

export function useChatPage(options?: UseChatPageOptions) {
  const [agentId, setAgentId] = useState<number | null>(options?.fixedAgentId ?? null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents = useQuery({ queryKey: ["agents"], queryFn: listAgents });

  const agentOptions: AutocompleteOption[] = useMemo(
    () => (agents.data ?? []).map((a) => ({ value: a.id, label: a.name })),
    [agents.data],
  );

  const sendMutation = useMutation({
    mutationFn: (payload: ChatInputPayload) =>
      sendMessage({
        agentId: agentId!,
        text: payload.text,
        sessionId,
        image: payload.image,
        audio: payload.audio,
        file: payload.file,
      }),
    onSuccess: (data, payload) => {
      setSessionId(data.session_id);

      // Build preview attachments to update the user message bubble
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

      setMessages((prev) => {
        const updated = [...prev];
        if (attachments.length > 0) {
          const lastUserIdx = updated.map((m) => m.role).lastIndexOf("user");
          if (lastUserIdx >= 0) {
            updated[lastUserIdx] = { ...updated[lastUserIdx], attachments };
          }
        }
        return [
          ...updated,
          {
            role: "assistant",
            content: data.message,
            created_at: new Date().toISOString(),
            responseImages: data.images,
            responseAudios: data.audios,
            responseDocuments: data.documents,
          },
        ];
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => {
      if (!sessionId || !agentId) return Promise.resolve();
      return resetChatSession(sessionId, agentId);
    },
    onSuccess: () => {
      setSessionId(undefined);
      setMessages([]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(payload: ChatInputPayload) {
    if (!agentId) return;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: payload.text,
        created_at: new Date().toISOString(),
      },
    ]);
    sendMutation.mutate(payload);
  }

  function handleReset() {
    resetMutation.mutate();
  }

  function handleAgentIdInput(value: string) {
    const num = Number(value);
    setAgentId(num > 0 ? num : null);
  }

  async function loadHistory(sid: string) {
    try {
      const data = await getChatHistory(sid);
      setSessionId(sid);
      setMessages(
        data.messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
          created_at: m.created_at,
        })),
      );
    } catch {
      // history not found — start fresh
    }
  }

  return {
    agentId,
    setAgentId,
    handleAgentIdInput,
    agentOptions,
    isAgentsLoading: agents.isLoading,
    sessionId,
    messages,
    messagesEndRef,
    handleSend,
    handleReset,
    loadHistory,
    isSending: sendMutation.isPending,
    isSendError: sendMutation.isError,
    isResetting: resetMutation.isPending,
    isFixed: !!options?.fixedAgentId,
  };
}
