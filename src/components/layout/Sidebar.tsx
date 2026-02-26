import { NavLink } from "react-router";

import {
  AppWindow,
  Bot,
  Building2,
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

import { useAuth, useOrganization, useSidebar, useTheme } from "@/contexts";

import { ThemeToggle } from "@/components";
import { OrgSwitcher } from "@/components/OrgSwitcher";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

export function Sidebar() {
  const { collapsed, mobileOpen, toggleSidebar, openMobile, closeMobile } = useSidebar();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { organizations, isOrgAdmin } = useOrganization();

  const isSuperuser = user?.is_superuser === true;

  const sections: NavSection[] = [
    {
      items: [{ to: "/", icon: LayoutDashboard, label: "Painel" }],
    },
    {
      label: "Organização",
      items: [
        { to: "/agents", icon: Bot, label: "Agentes" },
        { to: "/applications", icon: AppWindow, label: "Aplicações" },
        { to: "/mcp-servers", icon: Server, label: "Servidores MCP" },
      ],
    },
    {
      label: "Configuração",
      items: [
        { to: "/prompts", icon: MessageSquare, label: "Prompts" },
        { to: "/vector-stores", icon: Database, label: "Base de Conhecimento" },
        { to: "/webhooks", icon: Webhook, label: "Webhooks" },
        { to: "/tools", icon: Wrench, label: "Ferramentas" },
      ],
    },
    {
      label: "Comunicação",
      items: [{ to: "/chat", icon: MessageCircle, label: "Chat" }],
    },
    ...(isOrgAdmin || isSuperuser
      ? [
          {
            label: "Gestão",
            items: [{ to: "/api-keys", icon: Key, label: "API Keys" }],
          },
        ]
      : []),
    ...(isSuperuser
      ? [
          {
            label: "Admin",
            items: [
              { to: "/audit-logs", icon: ScrollText, label: "Auditoria" },
              { to: "/users", icon: Users, label: "Usuários" },
              { to: "/organizations", icon: Building2, label: "Organizações" },
            ],
          },
        ]
      : []),
  ];

  const renderNavItem = (item: NavItem) => (
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
  );

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
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
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

      {/* Org Switcher */}
      {organizations.length > 0 && (
        <div className="px-2 pb-2">
          <OrgSwitcher collapsed={collapsed} />
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        {sections.map((section, idx) => (
          <div key={section.label ?? idx}>
            {section.label && !collapsed && (
              <div className="px-3 pt-4 pb-1 text-xs font-medium text-text-muted uppercase tracking-wider">
                {section.label}
              </div>
            )}
            {section.label && collapsed && idx > 0 && (
              <div className="border-t border-border-subtle my-2 mx-2" />
            )}
            {section.items.map(renderNavItem)}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border-subtle px-3 py-3 space-y-1">
        <ThemeToggle collapsed={collapsed} />
        <button
          onClick={logout}
          title={collapsed ? "Sair" : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-text-muted hover:text-text-main hover:bg-brand-50 w-full cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
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
