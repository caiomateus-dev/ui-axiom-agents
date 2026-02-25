import { act, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/test/test-utils";

import { useApiKeysPage } from "./use-api-keys-page";

function useTestHook() {
  let hookResult: ReturnType<typeof useApiKeysPage> | undefined;
  function TestComponent() {
    hookResult = useApiKeysPage();
    return null;
  }
  return { TestComponent, getResult: () => hookResult! };
}

describe("useApiKeysPage", () => {
  it("loads api keys data", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    await waitFor(() => {
      expect(getResult().isLoading).toBe(false);
    });

    expect(getResult().apiKeys).toHaveLength(1);
  });

  it("manages create modal state", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    expect(getResult().isCreateOpen).toBe(false);

    act(() => getResult().handleOpenCreate());
    expect(getResult().isCreateOpen).toBe(true);

    act(() => getResult().handleCloseCreate());
    expect(getResult().isCreateOpen).toBe(false);
  });

  it("manages edit modal state", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    await waitFor(() => expect(getResult().isLoading).toBe(false));

    const apiKey = getResult().apiKeys![0];
    act(() => getResult().handleOpenEdit(apiKey));
    expect(getResult().editingKey).toEqual(apiKey);

    act(() => getResult().handleCloseEdit());
    expect(getResult().editingKey).toBeNull();
  });

  it("manages delete confirmation state", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    await waitFor(() => expect(getResult().isLoading).toBe(false));

    const apiKey = getResult().apiKeys![0];
    act(() => getResult().setDeletingKey(apiKey));
    expect(getResult().deletingKey).toEqual(apiKey);
  });

  it("exposes form registration and errors", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    expect(getResult().registerCreate).toBeDefined();
    expect(getResult().createErrors).toBeDefined();
    expect(getResult().registerEdit).toBeDefined();
    expect(getResult().editErrors).toBeDefined();
  });
});
