import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createAllProvidersWrapper } from "@/test/test-utils";

import { useLoginPage } from "./use-login-page";

describe("useLoginPage", () => {
  it("starts with empty fields", () => {
    const { result } = renderHook(() => useLoginPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.errors).toEqual({});
    expect(result.current.apiError).toBe("");
  });

  it("validates required email", async () => {
    const { result } = renderHook(() => useLoginPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.errors.email).toBeDefined();
  });

  it("validates email format", async () => {
    const { result } = renderHook(() => useLoginPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    act(() => {
      result.current.setEmail("not-an-email");
      result.current.setPassword("password");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.errors.email).toBeDefined();
  });

  it("validates required password", async () => {
    const { result } = renderHook(() => useLoginPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    act(() => {
      result.current.setEmail("test@test.com");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.errors.password).toBeDefined();
  });

  it("calls login on valid submission", async () => {
    const { result } = renderHook(() => useLoginPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    act(() => {
      result.current.setEmail("test@test.com");
      result.current.setPassword("password");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.apiError).toBe("");
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("shows api error on invalid credentials", async () => {
    const { result } = renderHook(() => useLoginPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    act(() => {
      result.current.setEmail("wrong@test.com");
      result.current.setPassword("wrong");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.apiError).toBe("Credenciais inválidas. Tente novamente.");
  });
});
