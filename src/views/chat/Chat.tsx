import { RotateCcw } from "lucide-react";

import { Button, Input, Spinner } from "@/components";

import { ChatBubble, ChatInput } from "./components";
import { useChatPage } from "./hooks";

export function Chat() {
  const {
    agentId,
    handleAgentIdChange,
    sessionId,
    messages,
    messagesEndRef,
    handleSend,
    handleReset,
    isSending,
    isSendError,
    isResetting,
  } = useChatPage();

  return (
    <div className="h-[calc(100vh-(--spacing(12)))] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-border-subtle bg-bg-card">
        <div className="w-40">
          <Input
            id="agent_id"
            type="number"
            placeholder="Agent ID"
            value={agentId || ""}
            onChange={(e) => handleAgentIdChange(e.target.value)}
          />
        </div>
        {sessionId && <span className="text-xs text-text-muted truncate">Sessão: {sessionId}</span>}
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!sessionId}
            loading={isResetting}
          >
            <RotateCcw className="w-4 h-4" />
            Nova Sessão
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && !isSending && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-text-muted">
              {agentId > 0
                ? "Envie uma mensagem para começar a conversa."
                : "Informe o Agent ID para começar."}
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatBubble key={idx} role={msg.role} content={msg.content} timestamp={msg.created_at} />
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-bg-card border border-border-subtle rounded-2xl rounded-bl-sm px-4 py-3">
              <Spinner size="sm" />
            </div>
          </div>
        )}

        {isSendError && (
          <div className="rounded-lg border border-error-border bg-error-bg p-3 text-error-text text-xs">
            Erro ao enviar mensagem. Tente novamente.
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSend} disabled={!agentId || isSending} />
    </div>
  );
}
