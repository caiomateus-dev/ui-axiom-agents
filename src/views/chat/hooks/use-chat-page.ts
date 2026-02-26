import { useEffect, useMemo, useRef, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import type { AutocompleteOption } from "@/components";

import { listAgents } from "@/views/agents/api/list-agents";

import { resetChatSession } from "../api/reset-session";
import { sendMessage } from "../api/send-message";

interface Message {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function useChatPage() {
  const [agentId, setAgentId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents = useQuery({ queryKey: ["agents"], queryFn: listAgents });

  const agentOptions: AutocompleteOption[] = useMemo(
    () => (agents.data ?? []).map((a) => ({ value: a.id, label: a.name })),
    [agents.data],
  );

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendMessage(agentId!, text, sessionId),
    onSuccess: (data) => {
      setSessionId(data.session_id);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          created_at: new Date().toISOString(),
        },
      ]);
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

  function handleSend(text: string) {
    if (!agentId) return;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
        created_at: new Date().toISOString(),
      },
    ]);
    sendMutation.mutate(text);
  }

  function handleReset() {
    resetMutation.mutate();
  }

  function handleAgentIdInput(value: string) {
    const num = Number(value);
    setAgentId(num > 0 ? num : null);
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
    isSending: sendMutation.isPending,
    isSendError: sendMutation.isError,
    isResetting: resetMutation.isPending,
  };
}
