import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/test/mocks/server";
import { createQueryWrapper } from "@/test/test-utils";

import { useApiKeys, useCreateApiKey, useDeleteApiKey, useUpdateApiKey } from "./use-api-keys";

const API_URL = "http://localhost:3000";

describe("useApiKeys", () => {
  it("fetches api keys list", async () => {
    const { result } = renderHook(() => useApiKeys(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].name).toBe("Key 1");
  });
});

describe("useCreateApiKey", () => {
  it("creates a new api key", async () => {
    const { result } = renderHook(() => useCreateApiKey(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      application_id: 1,
      name: "New Key",
      is_active: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useUpdateApiKey", () => {
  it("updates an api key", async () => {
    const { result } = renderHook(() => useUpdateApiKey(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      id: 1,
      data: { name: "Updated Key" },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useDeleteApiKey", () => {
  it("deletes an api key", async () => {
    const { result } = renderHook(() => useDeleteApiKey(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("handles deletion error", async () => {
    server.use(
      http.delete(`${API_URL}/api-keys/:id`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useDeleteApiKey(), {
      wrapper: createQueryWrapper(),
    });

    await expect(result.current.mutateAsync(1)).rejects.toThrow();
  });
});
