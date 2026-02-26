import { test as base } from "@playwright/test";
import type { Page } from "@playwright/test";

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.setItem("access_token", "mock-access-token");
      localStorage.setItem("refresh_token", "mock-refresh-token");
    });
    await use(page);
  },
});

export { expect } from "@playwright/test";

// Prefix for API routes - avoids intercepting Vite module requests
const API = "**/localhost:8080";

export async function mockApiRoutes(page: Page) {
  await page.route(`${API}/auth/me`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        email: "test@test.com",
        name: "Test User",
        is_staff: false,
        is_superuser: true,
        organizations: [
          { id: 1, name: "Default Org", slug: "default", role: "admin" },
          { id: 2, name: "Second Org", slug: "second", role: "member" },
        ],
      }),
    }),
  );

  await page.route(`${API}/auth/login`, async (route) => {
    const body = route.request().postDataJSON();
    if (body?.email === "test@test.com" && body?.password === "password") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ access: "mock-access-token", refresh: "mock-refresh-token" }),
      });
    }
    return route.fulfill({ status: 401, body: "Unauthorized" });
  });

  await page.route(`${API}/auth/refresh`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ access: "mock-access-token", refresh: "mock-refresh-token" }),
    }),
  );

  await page.route(`${API}/auth/forgot-password`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Se o email estiver cadastrado, você receberá um link para redefinir sua senha.",
      }),
    }),
  );

  await page.route(`${API}/auth/reset-password`, async (route) => {
    const body = route.request().postDataJSON();
    if (body?.token === "valid-test-token") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Senha redefinida com sucesso." }),
      });
    }
    return route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ message: "Token inválido" }),
    });
  });

  // NOTE: Playwright matches routes in REVERSE registration order (last registered = highest priority).
  // Register general routes first, then more specific ones after.

  await page.route(`${API}/agents/*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        name: "Agent GPT-4",
        display_name: "Agent GPT-4",
        description: "Main agent",
        is_active: true,
        metadata: {},
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      }),
    }),
  );

  await page.route(`${API}/agents`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Agent GPT-4",
            display_name: "Agent GPT-4",
            description: "Main agent",
            is_active: true,
            metadata: {},
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
          {
            id: 2,
            name: "Agent GPT-3.5",
            display_name: "Agent GPT-3.5",
            description: "Secondary agent",
            is_active: false,
            metadata: {},
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z",
          },
        ]),
      });
    }
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 3,
        name: "New Agent",
        display_name: "New Agent",
        description: "",
        is_active: true,
        metadata: {},
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/agents/chat/reset`, (route) => route.fulfill({ status: 200 }));

  await page.route(`${API}/agents/chat`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Hello! I am an AI assistant.",
        session_id: "session-123",
        agent_id: 1,
        agent_name: "Agent GPT-4",
        tokens_used: 42,
      }),
    }),
  );

  await page.route(`${API}/applications`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "App Production",
            description: "Production application",
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ]),
      });
    }
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 2,
        name: "New App",
        description: "Test",
        is_active: true,
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/applications/*`, (route) => {
    if (route.request().method() === "DELETE") {
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        name: "Updated App",
        description: "Updated",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/api-keys`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            application_id: 1,
            application_name: "App Production",
            name: "Key Production",
            key: "sk-abc1234567890xyz",
            is_active: true,
            expires_at: null,
            last_used_at: null,
            usage_count: 42,
            metadata: {},
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ]),
      });
    }
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 2,
        application_id: 1,
        application_name: "App Production",
        name: "New Key",
        key: "sk-new1234567890xyz",
        is_active: true,
        expires_at: null,
        last_used_at: null,
        usage_count: 0,
        metadata: {},
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/api-keys/*`, (route) => {
    if (route.request().method() === "DELETE") {
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        application_id: 1,
        application_name: "App Production",
        name: "Updated Key",
        key: "sk-abc1234567890xyz",
        is_active: true,
        expires_at: null,
        last_used_at: null,
        usage_count: 42,
        metadata: {},
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  // Organizations: register general routes first, specific ones last (reverse priority)
  await page.route(`${API}/organizations/*`, (route) => {
    if (route.request().method() === "PUT") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "atualizado" }),
      });
    }
    if (route.request().method() === "DELETE") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "removido" }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        name: "Default Org",
        slug: "default",
        is_active: true,
        metadata: {},
        members_count: 2,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/organizations/*/members/*`, (route) => {
    if (route.request().method() === "DELETE") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "removido" }),
      });
    }
    return route.fulfill({ status: 200 });
  });

  await page.route(`${API}/organizations/*/members/invite`, (route) => {
    const body = route.request().postDataJSON();
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 2,
        organization_id: 1,
        user_id: 2,
        user_name: body?.name ?? "Invited",
        user_email: body?.email ?? "invite@test.com",
        role: body?.role ?? "member",
        is_active: true,
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/organizations/*/members`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          organization_id: 1,
          user_id: 1,
          user_name: "Test User",
          user_email: "test@test.com",
          role: "admin",
          is_active: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ]),
    }),
  );

  await page.route(`${API}/organizations`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Default Org",
            slug: "default",
            is_active: true,
            metadata: {},
            members_count: 2,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
          {
            id: 2,
            name: "Second Org",
            slug: "second",
            is_active: true,
            metadata: {},
            members_count: 1,
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z",
          },
        ]),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 3,
        name: "New Org",
        slug: "new-org",
        is_active: true,
        metadata: {},
        members_count: 0,
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  // Prompts
  await page.route(`${API}/prompts/*`, (route) => {
    if (route.request().method() === "DELETE") {
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        agent_id: 1,
        agent_name: "Agent GPT-4",
        version: 1,
        is_active: true,
        prompt: "You are a helpful assistant.",
        description: "Main prompt",
        created_by: "admin",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/prompts`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            agent_id: 1,
            agent_name: "Agent GPT-4",
            version: 1,
            is_active: true,
            prompt: "You are a helpful assistant.",
            description: "Main prompt",
            created_by: "admin",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ]),
      });
    }
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 2,
        agent_id: 1,
        agent_name: "Agent GPT-4",
        version: 2,
        is_active: true,
        prompt: "New prompt",
        description: "New description",
        created_by: "admin",
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  // Tools
  await page.route(`${API}/tools/sync`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Sincronizado" }),
    }),
  );

  await page.route(`${API}/tools/*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        name: "Updated Tool",
        description: "Updated desc",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    }),
  );

  await page.route(`${API}/tools`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          name: "Web Search",
          description: "Search the web for information",
          is_active: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          name: "Calculator",
          description: "Perform calculations",
          is_active: false,
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
        },
      ]),
    }),
  );

  // Vector Stores
  await page.route(`${API}/vector-stores/*`, (route) => {
    if (route.request().method() === "DELETE") {
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        agent_id: 1,
        agent_name: "Agent GPT-4",
        version: 1,
        is_active: true,
        metadata: {},
        description: "Updated desc",
        created_by: "admin",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/vector-stores`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            agent_id: 1,
            agent_name: "Agent GPT-4",
            version: 1,
            is_active: true,
            metadata: {},
            description: "Knowledge base",
            created_by: "admin",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ]),
      });
    }
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 2,
        agent_id: 1,
        agent_name: "Agent GPT-4",
        version: 1,
        is_active: true,
        metadata: {},
        description: "New vector store",
        created_by: "admin",
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  // Webhooks
  await page.route(`${API}/webhooks/*`, (route) => {
    if (route.request().method() === "DELETE") {
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        application_id: 1,
        agent_id: 1,
        agent_name: "Agent GPT-4",
        url: "https://example.com/webhook",
        auth_type: "Bearer",
        is_active: true,
        metadata: {},
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/webhooks/application/*`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            application_id: 1,
            agent_id: 1,
            agent_name: "Agent GPT-4",
            url: "https://example.com/webhook",
            auth_type: "Bearer",
            is_active: true,
            metadata: {},
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ]),
      });
    }
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 2,
        application_id: 1,
        agent_id: 1,
        agent_name: "Agent GPT-4",
        url: "https://new.example.com/hook",
        auth_type: "Bearer",
        is_active: true,
        metadata: {},
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  // MCP Servers: register general wildcard first, then specific routes after (reverse priority)
  await page.route(`${API}/mcp-servers/*`, (route) => {
    if (route.request().method() === "DELETE") {
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        connection_type_id: 1,
        connection_type_name: "stdio",
        name: "Updated Server",
        config: {},
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/mcp-servers/connection-types`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: 1, name: "stdio", description: "Standard I/O" },
        { id: 2, name: "sse", description: "Server-Sent Events" },
      ]),
    }),
  );

  await page.route(`${API}/mcp-servers`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            connection_type_id: 1,
            connection_type_name: "stdio",
            name: "File System Server",
            config: { command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem"] },
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ]),
      });
    }
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 2,
        connection_type_id: 1,
        connection_type_name: "stdio",
        name: "New Server",
        config: {},
        is_active: true,
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  // Users
  await page.route(`${API}/users/*/block`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "bloqueado" }),
    }),
  );

  await page.route(`${API}/users/*/unblock`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "desbloqueado" }),
    }),
  );

  await page.route(`${API}/users/*`, (route) => {
    if (route.request().method() === "DELETE") {
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        name: "Updated User",
        email: "updated@test.com",
        is_active: true,
        is_staff: false,
        is_superuser: false,
        last_login: "2024-01-01T00:00:00Z",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  await page.route(`${API}/users?*`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [
          {
            id: 1,
            name: "Admin User",
            email: "admin@test.com",
            is_active: true,
            is_staff: true,
            is_superuser: true,
            last_login: "2024-01-10T00:00:00Z",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
          {
            id: 2,
            name: "Regular User",
            email: "user@test.com",
            is_active: true,
            is_staff: false,
            is_superuser: false,
            last_login: "2024-01-05T00:00:00Z",
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z",
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
        total_pages: 1,
      }),
    });
  });

  await page.route(`${API}/users`, (route) => {
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 3,
        name: "New User",
        email: "new@test.com",
        is_active: true,
        is_staff: false,
        is_superuser: false,
        last_login: null,
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      }),
    });
  });

  // Audits
  await page.route(`${API}/audits/stats`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        total_events: 150,
        total_tokens: 45000,
        by_agent: [
          {
            agent_name: "Agent GPT-4",
            total_tokens: 30000,
            prompt_tokens: 15000,
            completion_tokens: 15000,
            event_count: 100,
          },
          {
            agent_name: "Agent GPT-3.5",
            total_tokens: 15000,
            prompt_tokens: 8000,
            completion_tokens: 7000,
            event_count: 50,
          },
        ],
        by_event_type: [
          { event_type: "chat", event_count: 120 },
          { event_type: "tool", event_count: 30 },
        ],
      }),
    }),
  );

  await page.route(`${API}/audits`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [
          {
            id: 1,
            session_id: 1,
            agent_name: "Agent GPT-4",
            event_type: "chat",
            tool_name: null,
            tool_input: {},
            tool_output: null,
            user_message: "Hello",
            agent_response: "Hi there!",
            tokens_used: 100,
            prompt_tokens: 50,
            completion_tokens: 50,
            model_used: "gpt-4",
            metadata: {},
            created_at: "2024-01-10T10:00:00Z",
          },
          {
            id: 2,
            session_id: 1,
            agent_name: "Agent GPT-4",
            event_type: "tool",
            tool_name: "Web Search",
            tool_input: { query: "test" },
            tool_output: "Results found",
            user_message: null,
            agent_response: null,
            tokens_used: 200,
            prompt_tokens: 120,
            completion_tokens: 80,
            model_used: "gpt-4",
            metadata: {},
            created_at: "2024-01-10T10:01:00Z",
          },
        ],
        total: 2,
        page: 1,
        limit: 20,
        total_pages: 1,
      }),
    }),
  );
}
