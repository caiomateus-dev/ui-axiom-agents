import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/contexts";

interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={collapsed ? "Tema" : undefined}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-text-muted hover:text-text-main hover:bg-brand-50 w-full cursor-pointer ${
        collapsed ? "justify-center" : ""
      }`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 shrink-0" />
      ) : (
        <Moon className="w-5 h-5 shrink-0" />
      )}
      {!collapsed && <span>Tema</span>}
    </button>
  );
}
