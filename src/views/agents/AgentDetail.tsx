import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { ArrowLeft, MessageCircle, RotateCcw, Settings } from "lucide-react";

import { Badge, Button, Spinner } from "@/components";


import { ChatBubble, ChatInput } from "@/views/chat/components";
import { useChatPage } from "@/views/chat/hooks";

import { formatDateTime } from "@/utils";

import { useAgent } from "./hooks/use-agents";

type Tab = "detalhes" | "testar";

export function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("detalhes");
  const { data: agent, isLoading, isError } = useAgent(Number(id));

  const {
    sessionId,
    messages,
    messagesEndRef,
    handleSend,
    handleReset,
    isSending,
    isSendError,
    isResetting,
  } = useChatPage({ fixedAgentId: Number(id) });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !agent) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-error-border bg-error-bg p-4 text-error-text text-sm">
          Erro ao carregar detalhes do agent.
        </div>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/agents")}>
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-(--spacing(12)))]">
      {/* Header */}
      <div className="px-6 pt-6 pb-0 shrink-0">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/agents")}>
          <ArrowLeft className="w-4 h-4" />
          Voltar para Agents
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-text-main">{agent.name}</h1>
          <Badge variant={agent.is_active ? "success" : "error"}>
            {agent.is_active ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border-subtle">
          <button
            onClick={() => setTab("detalhes")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "detalhes"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-text-muted hover:text-text-main"
            }`}
          >
            <Settings className="w-4 h-4" />
            Detalhes
          </button>
          <button
            onClick={() => setTab("testar")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "testar"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-text-muted hover:text-text-main"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Testar
          </button>
        </div>
      </div>

      {/* Tab: Detalhes */}
      {tab === "detalhes" && (
        <div className="p-6 overflow-y-auto">
          <div className="rounded-lg border border-border-subtle bg-bg-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-1">Descrição</h3>
                <p className="text-sm text-text-main">{agent.description || "Sem descrição"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-muted mb-1">Criado em</h3>
                <p className="text-sm text-text-main">{formatDateTime(agent.created_at)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-muted mb-1">Atualizado em</h3>
                <p className="text-sm text-text-main">{formatDateTime(agent.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Testar */}
      {tab === "testar" && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Session bar */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border-subtle bg-bg-surface shrink-0">
            <span className="text-xs text-text-muted flex-1 truncate">
              {sessionId ? `Sessão: ${sessionId}` : "Nova conversa"}
            </span>
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.length === 0 && !isSending && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-text-muted">
                  Envie uma mensagem para testar o agente{" "}
                  <strong className="text-text-main">{agent.name}</strong>.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <ChatBubble
                key={idx}
                role={msg.role}
                content={msg.content}
                timestamp={msg.created_at}
                attachments={msg.attachments}
                responseImages={msg.responseImages}
                responseAudios={msg.responseAudios}
                responseDocuments={msg.responseDocuments}
              />
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

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isSending} />
        </div>
      )}
    </div>
  );
}
