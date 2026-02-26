import { act, renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/test/mocks/server";
import { createQueryWrapper } from "@/test/test-utils";

import { useChatPage } from "./use-chat-page";

const API_URL = "http://localhost:3000";

describe("useChatPage", () => {
  it("starts with empty state", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.agentId).toBeNull();
    expect(result.current.messages).toEqual([]);
    expect(result.current.sessionId).toBeUndefined();
  });

  it("changes agent id", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.setAgentId(5));
    expect(result.current.agentId).toBe(5);
  });

  it("clears agent id", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.setAgentId(5));
    act(() => result.current.setAgentId(null));
    expect(result.current.agentId).toBeNull();
  });

  it("does not send when agentId is null", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handleSend("hello"));
    expect(result.current.messages).toEqual([]);
  });

  it("sends a message and receives response", async () => {
    server.use(
      http.post(`${API_URL}/agents/chat`, () => {
        return HttpResponse.json({
          message: "Hello! I am an AI assistant.",
          session_id: "session-123",
          agent_id: 1,
          agent_name: "Agent 1",
          tokens_used: 42,
        });
      }),
    );

    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.setAgentId(1));
    act(() => result.current.handleSend("Hello"));

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe("user");

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    expect(result.current.messages[1].role).toBe("assistant");
    expect(result.current.messages[1].content).toBe("Hello! I am an AI assistant.");
    expect(result.current.sessionId).toBe("session-123");
  });

  it("resets chat session", async () => {
    server.use(
      http.post(`${API_URL}/agents/chat`, () => {
        return HttpResponse.json({
          message: "Hello!",
          session_id: "session-123",
          agent_id: 1,
          agent_name: "Agent 1",
          tokens_used: 10,
        });
      }),
      http.post(`${API_URL}/agents/chat/reset`, () => {
        return new HttpResponse(null, { status: 200 });
      }),
    );

    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.setAgentId(1));
    act(() => result.current.handleSend("Hello"));

    await waitFor(() => {
      expect(result.current.sessionId).toBe("session-123");
    });

    act(() => result.current.handleReset());

    await waitFor(() => {
      expect(result.current.messages).toEqual([]);
      expect(result.current.sessionId).toBeUndefined();
    });
  });

  it("sets agent id from text input", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handleAgentIdInput("7"));
    expect(result.current.agentId).toBe(7);
  });

  it("clears agent id when input is empty or invalid", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handleAgentIdInput("5"));
    expect(result.current.agentId).toBe(5);

    act(() => result.current.handleAgentIdInput(""));
    expect(result.current.agentId).toBeNull();

    act(() => result.current.handleAgentIdInput("3"));
    act(() => result.current.handleAgentIdInput("0"));
    expect(result.current.agentId).toBeNull();
  });

  it("provides agent options from API", async () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.agentOptions.length).toBeGreaterThan(0);
    });

    expect(result.current.agentOptions[0]).toHaveProperty("value");
    expect(result.current.agentOptions[0]).toHaveProperty("label");
  });
});
