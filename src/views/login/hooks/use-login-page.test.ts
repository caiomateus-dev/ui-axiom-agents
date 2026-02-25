import { act, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/test/test-utils";

import { useLoginPage } from "./use-login-page";

function useTestHook() {
  let hookResult: ReturnType<typeof useLoginPage> | undefined;
  function TestComponent() {
    hookResult = useLoginPage();
    return null;
  }
  return { TestComponent, getResult: () => hookResult! };
}

describe("useLoginPage", () => {
  it("starts with empty fields", () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);
    expect(getResult().email).toBe("");
    expect(getResult().password).toBe("");
    expect(getResult().errors).toEqual({});
    expect(getResult().apiError).toBe("");
  });

  it("validates required email", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await getResult().handleSubmit(fakeEvent);
    });

    expect(getResult().errors.email).toBeDefined();
  });

  it("validates email format", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    act(() => {
      getResult().setEmail("not-an-email");
      getResult().setPassword("password");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await getResult().handleSubmit(fakeEvent);
    });

    expect(getResult().errors.email).toBeDefined();
  });

  it("validates required password", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    act(() => {
      getResult().setEmail("test@test.com");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await getResult().handleSubmit(fakeEvent);
    });

    expect(getResult().errors.password).toBeDefined();
  });

  it("calls login on valid submission", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    act(() => {
      getResult().setEmail("test@test.com");
      getResult().setPassword("password");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await getResult().handleSubmit(fakeEvent);
    });

    await waitFor(() => {
      expect(getResult().loading).toBe(false);
    });

    expect(getResult().apiError).toBe("");
    expect(getResult().isAuthenticated).toBe(true);
  });

  it("shows api error on invalid credentials", async () => {
    const { TestComponent, getResult } = useTestHook();
    render(<TestComponent />);

    act(() => {
      getResult().setEmail("wrong@test.com");
      getResult().setPassword("wrong");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await getResult().handleSubmit(fakeEvent);
    });

    await waitFor(() => {
      expect(getResult().loading).toBe(false);
    });

    expect(getResult().apiError).toBe("Credenciais inválidas. Tente novamente.");
  });
});
