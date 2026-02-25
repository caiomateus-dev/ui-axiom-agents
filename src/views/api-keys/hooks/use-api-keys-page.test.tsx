import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createAllProvidersWrapper } from "@/test/test-utils";

import { useApiKeysPage } from "./use-api-keys-page";

describe("useApiKeysPage", () => {
  it("loads api keys data", async () => {
    const { result } = renderHook(() => useApiKeysPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.apiKeys).toHaveLength(1);
  });

  it("manages create modal state", async () => {
    const { result } = renderHook(() => useApiKeysPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    expect(result.current.isCreateOpen).toBe(false);

    act(() => result.current.handleOpenCreate());
    expect(result.current.isCreateOpen).toBe(true);

    act(() => result.current.handleCloseCreate());
    expect(result.current.isCreateOpen).toBe(false);
  });

  it("manages edit modal state", async () => {
    const { result } = renderHook(() => useApiKeysPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const apiKey = result.current.apiKeys![0];
    act(() => result.current.handleOpenEdit(apiKey));
    expect(result.current.editingKey).toEqual(apiKey);

    act(() => result.current.handleCloseEdit());
    expect(result.current.editingKey).toBeNull();
  });

  it("manages delete confirmation state", async () => {
    const { result } = renderHook(() => useApiKeysPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const apiKey = result.current.apiKeys![0];
    act(() => result.current.setDeletingKey(apiKey));
    expect(result.current.deletingKey).toEqual(apiKey);
  });

  it("exposes form registration and errors", async () => {
    const { result } = renderHook(() => useApiKeysPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    expect(result.current.registerCreate).toBeDefined();
    expect(result.current.createErrors).toBeDefined();
    expect(result.current.registerEdit).toBeDefined();
    expect(result.current.editErrors).toBeDefined();
  });
});
