import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/test/mocks/server";
import { createQueryWrapper } from "@/test/test-utils";

import { useAgent, useAgents, useCreateAgent } from "./use-agents";

const API_URL = "http://localhost:3000";

describe("useAgents", () => {
  it("fetches the list of agents", async () => {
    const { result } = renderHook(() => useAgents(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![0].name).toBe("Agent 1");
  });
});

describe("useAgent", () => {
  it("fetches a single agent by id", async () => {
    const { result } = renderHook(() => useAgent(1), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data!.name).toBe("Agent 1");
    expect(result.current.data!.id).toBe(1);
  });

  it("does not fetch when id is 0", () => {
    const { result } = renderHook(() => useAgent(0), {
      wrapper: createQueryWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCreateAgent", () => {
  it("creates a new agent", async () => {
    const { result } = renderHook(() => useCreateAgent(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      data: { name: "New Agent", description: "Test" },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("handles creation error", async () => {
    server.use(
      http.post(`${API_URL}/agents`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useCreateAgent(), {
      wrapper: createQueryWrapper(),
    });

    await expect(result.current.mutateAsync({ data: { name: "Fail" } })).rejects.toThrow();
  });
});
