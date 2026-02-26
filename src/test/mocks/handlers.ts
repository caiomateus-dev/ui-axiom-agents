import { http, HttpResponse } from "msw";

const API_URL = "http://localhost:3000";

export const handlers = [
  // Auth
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === "test@test.com" && body.password === "password") {
      return HttpResponse.json({ access: "mock-access-token", refresh: "mock-refresh-token" });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (auth?.includes("mock-access-token")) {
      return HttpResponse.json({
        id: 1,
        email: "test@test.com",
        name: "Test User",
        is_staff: false,
        is_superuser: true,
        organizations: [
          { id: 1, name: "Default Org", slug: "default", role: "admin" },
          { id: 2, name: "Second Org", slug: "second", role: "member" },
        ],
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  http.post(`${API_URL}/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refresh: string };
    if (body.refresh === "mock-refresh-token") {
      return HttpResponse.json({ access: "new-access-token", refresh: "new-refresh-token" });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  http.post(`${API_URL}/auth/forgot-password`, () => {
    return HttpResponse.json({
      message: "Se o email estiver cadastrado, você receberá um link para redefinir sua senha.",
    });
  }),

  http.post(`${API_URL}/auth/reset-password`, async ({ request }) => {
    const body = (await request.json()) as { token: string };
    if (body.token === "valid-test-token") {
      return HttpResponse.json({ message: "Senha redefinida com sucesso." });
    }
    return new HttpResponse(JSON.stringify({ message: "Token inválido" }), { status: 400 });
  }),

  // Agents
  http.get(`${API_URL}/agents`, () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Agent 1",
        display_name: "Agent 1",
        description: "Test agent",
        is_active: true,
        metadata: {},
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Agent 2",
        display_name: "Agent 2",
        description: "Another agent",
        is_active: false,
        metadata: {},
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      },
    ]);
  }),

  http.get(`${API_URL}/agents/:id`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      name: "Agent 1",
      display_name: "Agent 1",
      description: "Test agent",
      is_active: true,
      metadata: {},
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    });
  }),

  http.post(`${API_URL}/agents`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: 3,
      ...body,
      is_active: true,
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    });
  }),

  // API Keys
  http.get(`${API_URL}/api-keys`, () => {
    return HttpResponse.json([
      {
        id: 1,
        application_id: 1,
        application_name: "App 1",
        name: "Key 1",
        key: "sk-abc1234567890xyz",
        is_active: true,
        expires_at: null,
        last_used_at: null,
        usage_count: 0,
        metadata: {},
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ]);
  }),

  http.post(`${API_URL}/api-keys`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: 2,
      ...body,
      key: "sk-new1234567890xyz",
      expires_at: null,
      last_used_at: null,
      usage_count: 0,
      metadata: {},
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    });
  }),

  http.put(`${API_URL}/api-keys/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: Number(params.id),
      application_id: 1,
      application_name: "App 1",
      ...body,
      key: "sk-abc1234567890xyz",
      is_active: true,
      expires_at: null,
      last_used_at: null,
      usage_count: 0,
      metadata: {},
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    });
  }),

  http.delete(`${API_URL}/api-keys/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Applications
  http.get(`${API_URL}/applications`, () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "App 1",
        description: "Test application",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ]);
  }),

  http.post(`${API_URL}/applications`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: 2,
      ...body,
      is_active: true,
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    });
  }),

  http.put(`${API_URL}/applications/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: Number(params.id),
      ...body,
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    });
  }),

  http.delete(`${API_URL}/applications/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Organizations
  http.get(`${API_URL}/organizations`, () => {
    return HttpResponse.json([
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
    ]);
  }),

  http.post(`${API_URL}/organizations`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: 3,
      ...body,
      is_active: true,
      metadata: {},
      members_count: 0,
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    });
  }),

  http.put(`${API_URL}/organizations/:id`, () => {
    return HttpResponse.json({ message: "atualizado" });
  }),

  http.delete(`${API_URL}/organizations/:id`, () => {
    return HttpResponse.json({ message: "removido" });
  }),

  http.get(`${API_URL}/organizations/:id/members`, () => {
    return HttpResponse.json([
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
    ]);
  }),

  http.post(`${API_URL}/organizations/:id/members/invite`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: 2,
      organization_id: 1,
      user_id: 2,
      user_name: body.name,
      user_email: body.email,
      role: body.role,
      is_active: true,
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z",
    });
  }),

  http.delete(`${API_URL}/organizations/:id/members/:userId`, () => {
    return HttpResponse.json({ message: "removido" });
  }),

  // Chat
  http.post(`${API_URL}/agents/chat`, () => {
    return HttpResponse.json({
      message: "Hello! I am an AI assistant.",
      session_id: "session-123",
      agent_id: 1,
      agent_name: "Agent 1",
      tokens_used: 42,
    });
  }),

  http.post(`${API_URL}/agents/chat/reset`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
