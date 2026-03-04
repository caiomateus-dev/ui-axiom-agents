import { ArrowLeft } from "lucide-react";

import { Button } from "@/components";

import { formatDate } from "@/utils";

import type { ContactResponse } from "./dtos/response/channel.response";
import { useMessages } from "./hooks";

const DIRECTION_LABELS = {
  inbound: "Recebida",
  outbound: "Enviada",
};

interface ConversationMessagesProps {
  channelId: number;
  contact: ContactResponse;
  onBack: () => void;
}

export function ConversationMessages({ channelId, contact, onBack }: ConversationMessagesProps) {
  const { data: messages, isLoading, isError } = useMessages(channelId, contact.id);

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-text-main">
            {contact.display_name || contact.external_ref}
          </h2>
          <p className="text-xs text-text-muted">{contact.external_ref}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && <p className="text-sm text-error-text py-4">Erro ao carregar mensagens.</p>}

        {messages && messages.length === 0 && (
          <p className="text-sm text-text-muted py-4 text-center">Nenhuma mensagem encontrada.</p>
        )}

        {messages && messages.length > 0 && (
          <div className="flex flex-col gap-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    msg.direction === "outbound"
                      ? "bg-brand-500 text-white"
                      : "bg-bg-card border border-border-subtle text-text-main"
                  }`}
                >
                  {msg.content && <p>{msg.content}</p>}
                  {msg.media_url && (
                    <p className="text-xs opacity-70 mt-1">
                      [{DIRECTION_LABELS[msg.direction]}] {msg.content_type}
                    </p>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      msg.direction === "outbound" ? "text-white/70" : "text-text-muted"
                    }`}
                  >
                    {formatDate(msg.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
