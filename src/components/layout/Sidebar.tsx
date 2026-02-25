import {
  AppWindow,
  Bot,
  ChevronLeft,
  ChevronRight,
  Database,
  Key,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  ScrollText,
  Server,
  Users,
  Webhook,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

import { ThemeToggle } from "@/components";
import { useAuth, useSidebar, useTheme } from "@/contexts";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/agents", icon: Bot, label: "Agents" },
  { to: "/applications", icon: AppWindow, label: "Applications" },
  { to: "/api-keys", icon: Key, label: "API Keys" },
  { to: "/tools", icon: Wrench, label: "Tools" },
  { to: "/prompts", icon: MessageSquare, label: "Prompts" },
  { to: "/vector-stores", icon: Database, label: "Vector Stores" },
  { to: "/webhooks", icon: Webhook, label: "Webhooks" },
  { to: "/mcp-servers", icon: Server, label: "MCP Servers" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/audit-logs", icon: ScrollText, label: "Audit Logs" },
  { to: "/users", icon: Users, label: "Usuários" },
];

export function Sidebar() {
  const { collapsed, mobileOpen, toggleSidebar, openMobile, closeMobile } = useSidebar();
  const { logout } = useAuth();
  const { theme } = useTheme();

  const sidebarContent = (
    <aside
      className={`relative flex flex-col h-full bg-bg-sidebar border-r border-border-subtle transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Collapse/Expand toggle - circular button on the right edge */}
      <button
        onClick={toggleSidebar}
        title={collapsed ? "Expandir" : "Recolher"}
        className="absolute -right-3 top-7 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-bg-card text-text-muted hover:text-text-main hover:bg-brand-50 transition-colors cursor-pointer shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Logo */}
      <div className={`flex items-center py-4 ${collapsed ? "justify-center px-2" : "px-4"}`}>
        {collapsed ? (
          <img src="/logos/logo-short.png" alt="Axiom" className="w-10 h-10 object-contain" />
        ) : (
          <img
            src={theme === "dark" ? "/logos/logo-brand-dark.png" : "/logos/logo-brand-light.png"}
            alt="Axiom Agents"
            className="h-10 object-contain"
          />
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            title={collapsed ? item.label : undefined}
            onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-brand-50 text-brand-500 font-medium"
                  : "text-text-muted hover:text-text-main hover:bg-brand-50"
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border-subtle px-3 py-3 space-y-1">
        <ThemeToggle collapsed={collapsed} />
        <button
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-text-muted hover:text-text-main hover:bg-brand-50 w-full cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={openMobile}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-bg-card border border-border-subtle text-text-muted hover:text-text-main transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-30">{sidebarContent}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobile} />
          <div className="fixed inset-y-0 left-0 z-50">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
