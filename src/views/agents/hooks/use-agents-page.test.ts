import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/test/test-utils";

import { useAgentsPage } from "./use-agents-page";

// We need the full provider stack for this hook (navigation, toast, queries)
function useTestHook() {
  let hookResult: ReturnType<typeof useAgentsPage> | undefined;
  function TestComponent() {
    hookResult = useAgentsPage();
    return null;
  }
  return { TestComponent, getResult: () => hookResult! };
}

describe("useAgentsPage", () => {
  it("loads agents data", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    await waitFor(() => {
      expect(getResult().isLoading).toBe(false);
    });

    expect(getResult().agents).toHaveLength(2);
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

  it("exposes form register and errors", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    await waitFor(() => expect(getResult().isLoading).toBe(false));

    expect(getResult().register).toBeDefined();
    expect(getResult().errors).toBeDefined();
  });
});
