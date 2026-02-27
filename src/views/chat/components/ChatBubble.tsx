import { FileText, Mic } from "lucide-react";

import type { AttachmentResponse } from "../dtos/response/chat.response";

export interface MessageAttachment {
  type: "image" | "audio" | "file";
  /** For outgoing messages: object URL from File/Blob */
  previewUrl?: string;
  contentType?: string;
  filename?: string;
}

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachments?: MessageAttachment[];
  responseImages?: AttachmentResponse[];
  responseAudios?: AttachmentResponse[];
  responseDocuments?: AttachmentResponse[];
}

export function ChatBubble({
  role,
  content,
  timestamp,
  attachments,
  responseImages,
  responseAudios,
  responseDocuments,
}: ChatBubbleProps) {
  const isUser = role === "user";

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const hasOutgoing = attachments && attachments.length > 0;
  const hasIncoming =
    (responseImages && responseImages.length > 0) ||
    (responseAudios && responseAudios.length > 0) ||
    (responseDocuments && responseDocuments.length > 0);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] ${
          isUser
            ? "bg-brand-500 text-white rounded-2xl rounded-br-sm ml-auto"
            : "bg-bg-surface text-text-main border border-border-subtle rounded-2xl rounded-bl-sm mr-auto"
        }`}
      >
        {/* Outgoing attachments preview (user sent) */}
        {hasOutgoing && (
          <div className="px-4 pt-3 flex flex-col gap-2">
            {attachments!.map((att, i) => {
              if (att.type === "image" && att.previewUrl) {
                return (
                  <img
                    key={i}
                    src={att.previewUrl}
                    alt="imagem"
                    className="rounded-lg max-h-48 object-cover"
                  />
                );
              }
              if (att.type === "audio" && att.previewUrl) {
                return (
                  <audio key={i} controls src={att.previewUrl} className="w-full max-w-xs h-8" />
                );
              }
              if (att.type === "file") {
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${isUser ? "bg-white/20" : "bg-bg-surface border border-border-subtle"}`}
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">{att.filename ?? "arquivo"}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Message text */}
        {content && <div className="text-sm px-4 py-2.5 whitespace-pre-wrap">{content}</div>}

        {/* Incoming attachments from assistant response */}
        {hasIncoming && (
          <div className="px-4 pb-3 flex flex-col gap-2">
            {responseImages?.map((img, i) => (
              <img
                key={i}
                src={img.url ?? `data:${img.contentType};base64,${img.b64}`}
                alt={img.filename ?? "imagem"}
                className="rounded-lg max-h-64 object-cover"
              />
            ))}
            {responseAudios?.map((aud, i) => (
              <div key={i} className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-text-muted shrink-0" />
                <audio
                  controls
                  src={aud.url ?? `data:${aud.contentType};base64,${aud.b64}`}
                  className="w-full max-w-xs h-8"
                />
              </div>
            ))}
            {responseDocuments?.map((doc, i) => (
              <a
                key={i}
                href={doc.url ?? `data:${doc.contentType};base64,${doc.b64}`}
                download={doc.filename ?? "documento"}
                className="flex items-center gap-2 text-xs text-brand-400 hover:underline"
              >
                <FileText className="w-4 h-4 shrink-0" />
                {doc.filename ?? "documento"}
              </a>
            ))}
          </div>
        )}

        <div className={`text-xs mt-1 px-4 pb-2 ${isUser ? "text-white/70" : "text-text-muted"}`}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}
