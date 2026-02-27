import { Loader2, RotateCcw, Zap } from "lucide-react";

import { Autocomplete, Button, Spinner } from "@/components";

import { ChatBubble, ChatInput } from "./components";
import { useChatBufferPage } from "./hooks";

const selectCls =
  "h-9 rounded-lg border border-border-strong bg-bg-surface px-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-40";

export function ChatBuffer() {
  const {
    applicationId,
    setApplicationId,
    applications,
    apiKeyId,
    setApiKeyId,
    apiKeys,
    selectedApiKey,
    agentId,
    setAgentId,
    agentOptions,
    isAgentsLoading,
    sessionId,
    messages,
    messagesEndRef,
    handleSend,
    handleReset,
    isSending,
    isPolling,
    sendError,
  } = useChatBufferPage();

  const canSend = !!agentId && !!selectedApiKey && !isSending;

  return (
    <div className="h-[calc(100vh-(--spacing(12)))] flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-border-subtle bg-bg-card">
        {/* Application */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">Aplicação</label>
          <select
            value={applicationId ?? ""}
            onChange={(e) => setApplicationId(Number(e.target.value) || null)}
            className={selectCls}
          >
            <option value="" disabled>
              Selecione...
            </option>
            {applications?.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </select>
        </div>

        {/* API Key */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">API Key</label>
          <select
            value={apiKeyId ?? ""}
            onChange={(e) => setApiKeyId(Number(e.target.value) || null)}
            disabled={!applicationId || !apiKeys?.length}
            className={selectCls}
          >
            {!apiKeys?.length ? (
              <option value="">Nenhuma key</option>
            ) : (
              apiKeys.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Agent */}
        <div className="flex flex-col gap-1 w-56">
          <label className="text-xs text-text-muted">Agente</label>
          <Autocomplete
            id="buffer_agent_id"
            options={agentOptions}
            value={agentId}
            onChange={setAgentId}
            placeholder="Buscar agente..."
            isLoading={isAgentsLoading}
          />
        </div>

        {/* Session info + reset */}
        <div className="ml-auto flex items-center gap-3">
          {isPolling && (
            <span className="flex items-center gap-1.5 text-xs text-brand-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Aguardando resposta...
            </span>
          )}
          {sessionId && !isPolling && (
            <span className="text-xs text-text-muted truncate max-w-[200px]">
              Sessão: {sessionId}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={messages.length === 0}>
            <RotateCcw className="w-4 h-4" />
            Nova Sessão
          </Button>
        </div>
      </div>

      {/* Config warning */}
      {!selectedApiKey && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg border border-warning-border bg-warning-bg px-3 py-2 text-xs text-warning-text">
          <Zap className="w-4 h-4 shrink-0" />
          Selecione uma aplicação com API Key ativa para testar a integração.
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && !isSending && !isPolling && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-text-muted text-center max-w-sm">
              {!agentId || !selectedApiKey
                ? "Configure a aplicação, API Key e o agente para começar."
                : "Envie uma mensagem para simular o fluxo real de integração."}
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

        {/* Polling / waiting indicator after user message */}
        {isPolling && (
          <div className="flex justify-start">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 text-text-muted">
              <Spinner size="sm" />
              <span className="text-xs">Processando mensagem...</span>
            </div>
          </div>
        )}

        {sendError && (
          <div className="rounded-lg border border-error-border bg-error-bg p-3 text-error-text text-xs">
            {sendError}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={!canSend} />
    </div>
  );
}
