import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/test/mocks/server";
import { createQueryWrapper } from "@/test/test-utils";

import {
  useApplications,
  useCreateApplication,
  useDeleteApplication,
  useUpdateApplication,
} from "./use-applications";

const API_URL = "http://localhost:3000";

describe("useApplications", () => {
  it("fetches applications list", async () => {
    const { result } = renderHook(() => useApplications(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].name).toBe("App 1");
  });
});

describe("useCreateApplication", () => {
  it("creates a new application", async () => {
    const { result } = renderHook(() => useCreateApplication(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({ data: { name: "New App", description: "Test" } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useUpdateApplication", () => {
  it("updates an application", async () => {
    const { result } = renderHook(() => useUpdateApplication(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      id: 1,
      data: { name: "Updated App" },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useDeleteApplication", () => {
  it("deletes an application", async () => {
    const { result } = renderHook(() => useDeleteApplication(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("handles deletion error", async () => {
    server.use(
      http.delete(`${API_URL}/applications/:id`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useDeleteApplication(), {
      wrapper: createQueryWrapper(),
    });

    await expect(result.current.mutateAsync(1)).rejects.toThrow();
  });
});
