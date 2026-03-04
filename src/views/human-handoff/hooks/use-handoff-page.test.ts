import { act, renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/test/mocks/server";
import { createQueryWrapper } from "@/test/test-utils";

import { useHandoffPage } from "./use-handoff-page";

const API_URL = "http://localhost:3000";

const mockSessions = [
  {
    session_id: "sess-001",
    agent_id: 1,
    agent_name: "Agent 1",
    external_ref: "5511999990001",
    handoff_reason: "Cliente pediu atendente",
    updated_at: "2024-01-01T10:00:00Z",
    created_at: "2024-01-01T09:00:00Z",
  },
  {
    session_id: "sess-002",
    agent_id: 1,
    agent_name: "Agent 1",
    external_ref: null,
    handoff_reason: null,
    updated_at: "2024-01-01T11:00:00Z",
    created_at: "2024-01-01T10:30:00Z",
  },
];

describe("useHandoffPage", () => {
  it("starts with empty state", () => {
    server.use(
      http.get(`${API_URL}/admin/chat/handoff/list`, () => {
        return HttpResponse.json({ sessions: [], total: 0 });
      }),
    );

    const { result } = renderHook(() => useHandoffPage(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.sessions).toEqual([]);
    expect(result.current.releasingSession).toBeNull();
  });

  it("loads sessions on mount", async () => {
    server.use(
      http.get(`${API_URL}/admin/chat/handoff/list`, () => {
        return HttpResponse.json({ sessions: mockSessions, total: 2 });
      }),
    );

    const { result } = renderHook(() => useHandoffPage(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.sessions).toHaveLength(2);
    });

    expect(result.current.total).toBe(2);
    expect(result.current.isLoading).toBe(false);
  });

  it("manages release modal state", () => {
    server.use(
      http.get(`${API_URL}/admin/chat/handoff/list`, () => {
        return HttpResponse.json({ sessions: [], total: 0 });
      }),
    );

    const { result } = renderHook(() => useHandoffPage(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.releasingSession).toBeNull();

    act(() => result.current.handleOpenRelease(mockSessions[0]));
    expect(result.current.releasingSession).toEqual(mockSessions[0]);

    act(() => result.current.handleCloseRelease());
    expect(result.current.releasingSession).toBeNull();
  });

  it("releases handoff session and closes modal", async () => {
    server.use(
      http.get(`${API_URL}/admin/chat/handoff/list`, () => {
        return HttpResponse.json({ sessions: mockSessions, total: 2 });
      }),
      http.post(`${API_URL}/admin/chat/handoff/release`, () => {
        return HttpResponse.json({
          message: "Atendimento humano liberado com sucesso.",
          session_id: "sess-001",
          external_ref: "5511999990001",
          agent_id: 1,
          agent_name: "Agent 1",
          needs_human_handoff: false,
        });
      }),
    );

    const { result } = renderHook(() => useHandoffPage(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.sessions).toHaveLength(2));

    act(() => result.current.handleOpenRelease(mockSessions[0]));
    expect(result.current.releasingSession).not.toBeNull();

    await act(async () => {
      await result.current.handleConfirmRelease();
    });

    expect(result.current.releasingSession).toBeNull();
  });

  it("does not release when no session selected", async () => {
    server.use(
      http.get(`${API_URL}/admin/chat/handoff/list`, () => {
        return HttpResponse.json({ sessions: [], total: 0 });
      }),
    );

    const { result } = renderHook(() => useHandoffPage(), {
      wrapper: createQueryWrapper(),
    });

    await act(async () => {
      await result.current.handleConfirmRelease();
    });

    expect(result.current.releasingSession).toBeNull();
  });
});
