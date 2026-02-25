import { useEffect, useRef, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { resetChatSession } from "../api/reset-session";
import { sendMessage } from "../api/send-message";

interface Message {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function useChatPage() {
  const [agentId, setAgentId] = useState(0);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendMessage(agentId, text, sessionId),
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
      if (!sessionId) return Promise.resolve();
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

  function handleAgentIdChange(value: string) {
    setAgentId(Number(value) || 0);
  }

  return {
    agentId,
    handleAgentIdChange,
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
