import { createBrowserRouter } from "react-router";

import { AuthLayout } from "@/components";

import { AgentDetail, Agents } from "@/views/agents";
import { ApiKeys } from "@/views/api-keys";
import { Applications } from "@/views/applications";
import { AuditLogs } from "@/views/audit-logs";
import { Chat, ChatBuffer } from "@/views/chat";
import { Dashboard } from "@/views/dashboard";
import { ForgotPassword } from "@/views/forgot-password";
import { Login } from "@/views/login";
import { McpServers } from "@/views/mcp-servers";
import { OrganizationMembers, Organizations } from "@/views/organizations";
import { Prompts } from "@/views/prompts";
import { ResetPassword } from "@/views/reset-password";
import { Tools } from "@/views/tools";
import { Users } from "@/views/users";
import { VectorStores } from "@/views/vector-stores";
import { Webhooks } from "@/views/webhooks";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/esqueci-senha",
    element: <ForgotPassword />,
  },
  {
    path: "/redefinir-senha",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "agents", element: <Agents /> },
      { path: "agents/:id", element: <AgentDetail /> },
      { path: "applications", element: <Applications /> },
      { path: "api-keys", element: <ApiKeys /> },
      { path: "tools", element: <Tools /> },
      { path: "prompts", element: <Prompts /> },
      { path: "vector-stores", element: <VectorStores /> },
      { path: "webhooks", element: <Webhooks /> },
      { path: "mcp-servers", element: <McpServers /> },
      { path: "chat", element: <Chat /> },
      { path: "chat-buffer", element: <ChatBuffer /> },
      { path: "audit-logs", element: <AuditLogs /> },
      { path: "users", element: <Users /> },
      { path: "organizations", element: <Organizations /> },
      { path: "organizations/:id/members", element: <OrganizationMembers /> },
    ],
  },
]);
