interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === "user";

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] ${
          isUser
            ? "bg-brand-500 text-white rounded-2xl rounded-br-sm ml-auto"
            : "bg-bg-card border border-border-subtle rounded-2xl rounded-bl-sm mr-auto"
        }`}
      >
        <div className="text-sm px-4 py-2.5 whitespace-pre-wrap">{content}</div>
        <div
          className={`text-xs mt-1 px-4 pb-2 ${
            isUser ? "text-white/70" : "text-text-muted"
          }`}
        >
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}
