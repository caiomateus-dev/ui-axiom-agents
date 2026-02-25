import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createAllProvidersWrapper } from "@/test/test-utils";

import { useAgentsPage } from "./use-agents-page";

describe("useAgentsPage", () => {
  it("loads agents data", async () => {
    const { result } = renderHook(() => useAgentsPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.agents).toHaveLength(2);
  });

  it("manages create modal state", async () => {
    const { result } = renderHook(() => useAgentsPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    expect(result.current.isCreateOpen).toBe(false);

    act(() => result.current.handleOpenCreate());
    expect(result.current.isCreateOpen).toBe(true);

    act(() => result.current.handleCloseCreate());
    expect(result.current.isCreateOpen).toBe(false);
  });

  it("exposes form register and errors", async () => {
    const { result } = renderHook(() => useAgentsPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.register).toBeDefined();
    expect(result.current.errors).toBeDefined();
  });
});
