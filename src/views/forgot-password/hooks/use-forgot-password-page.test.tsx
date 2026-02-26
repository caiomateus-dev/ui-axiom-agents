import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createAllProvidersWrapper } from "@/test/test-utils";

import { useForgotPasswordPage } from "./use-forgot-password-page";

describe("useForgotPasswordPage", () => {
  it("starts with empty fields", () => {
    const { result } = renderHook(() => useForgotPasswordPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    expect(result.current.email).toBe("");
    expect(result.current.errors).toEqual({});
    expect(result.current.apiError).toBe("");
    expect(result.current.success).toBe(false);
  });

  it("validates required email", async () => {
    const { result } = renderHook(() => useForgotPasswordPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.errors.email).toBeDefined();
  });

  it("validates email format", async () => {
    const { result } = renderHook(() => useForgotPasswordPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    act(() => {
      result.current.setEmail("not-an-email");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.errors.email).toBeDefined();
  });

  it("submits successfully with valid email", async () => {
    const { result } = renderHook(() => useForgotPasswordPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    act(() => {
      result.current.setEmail("test@test.com");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.success).toBe(true);
  });
});
