import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createQueryWrapper } from "@/test/test-utils";

import { useChatPage } from "./use-chat-page";

describe("useChatPage", () => {
  it("starts with empty state", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.agentId).toBe(0);
    expect(result.current.messages).toEqual([]);
    expect(result.current.sessionId).toBeUndefined();
  });

  it("changes agent id", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handleAgentIdChange("5"));
    expect(result.current.agentId).toBe(5);
  });

  it("handles non-numeric agent id input", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handleAgentIdChange("abc"));
    expect(result.current.agentId).toBe(0);
  });

  it("does not send when agentId is 0", () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handleSend("hello"));
    // No user message should be added when agentId is 0
    expect(result.current.messages).toEqual([]);
  });

  it("sends a message and receives response", async () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handleAgentIdChange("1"));
    act(() => result.current.handleSend("Hello"));

    // User message is added immediately
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe("user");
    expect(result.current.messages[0].content).toBe("Hello");

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    expect(result.current.messages[1].role).toBe("assistant");
    expect(result.current.messages[1].content).toBe("Hello! I am an AI assistant.");
    expect(result.current.sessionId).toBe("session-123");
  });

  it("resets chat session", async () => {
    const { result } = renderHook(() => useChatPage(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handleAgentIdChange("1"));
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
});
