import { useState } from "react";

import { formatDate } from "@/utils";

import { ConversationMessages } from "./ConversationMessages";
import type { ContactResponse } from "./dtos/response/channel.response";
import { useConversations } from "./hooks";

interface ConversationListProps {
  channelId: number;
}

export function ConversationList({ channelId }: ConversationListProps) {
  const [selectedContact, setSelectedContact] = useState<ContactResponse | null>(null);
  const { data: contacts, isLoading, isError } = useConversations(channelId);

  if (selectedContact) {
    return (
      <ConversationMessages
        channelId={channelId}
        contact={selectedContact}
        onBack={() => setSelectedContact(null)}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-main mb-4">Conversas</h2>

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isError && <p className="text-sm text-error-text py-4">Erro ao carregar conversas.</p>}

      {contacts && contacts.length === 0 && (
        <p className="text-sm text-text-muted py-4 text-center">
          Nenhuma conversa encontrada ainda.
        </p>
      )}

      {contacts && contacts.length > 0 && (
        <div className="flex flex-col divide-y divide-border-subtle border border-border-subtle rounded-lg overflow-hidden">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors text-left"
              onClick={() => setSelectedContact(contact)}
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-500 flex items-center justify-center text-sm font-medium shrink-0">
                {(contact.display_name || contact.external_ref).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main truncate">
                  {contact.display_name || contact.external_ref}
                </p>
                <p className="text-xs text-text-muted truncate">{contact.external_ref}</p>
              </div>
              {contact.last_message_at && (
                <p className="text-xs text-text-muted shrink-0">
                  {formatDate(contact.last_message_at)}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
