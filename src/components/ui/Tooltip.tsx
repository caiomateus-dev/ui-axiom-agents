import { useState } from "react";
import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const positionClass =
    position === "top"
      ? "bottom-full left-1/2 -translate-x-1/2 mb-1.5"
      : "top-full left-1/2 -translate-x-1/2 mt-1.5";

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute ${positionClass} z-50 whitespace-nowrap rounded-md bg-bg-elevated border border-border-subtle px-2 py-1 text-xs text-text-main shadow-lg pointer-events-none`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
