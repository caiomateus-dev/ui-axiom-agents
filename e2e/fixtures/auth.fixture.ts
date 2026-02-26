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

  // NOTE: Playwright matches routes in REVERSE registration order (last registered = highest priority).
  // Register general routes first, then more specific ones after.

  await page.route(`${API}/agents/*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        name: "Agent GPT-4",
        description: "Main agent",
        model: "gpt-4",
        is_active: true,
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
            description: "Main agent",
            model: "gpt-4",
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
          {
            id: 2,
            name: "Agent GPT-3.5",
            description: "Secondary agent",
            model: "gpt-3.5",
            is_active: false,
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
        description: "",
        model: "gpt-4",
        is_active: true,
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
}
