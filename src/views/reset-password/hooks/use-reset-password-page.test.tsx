import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createAllProvidersWrapper } from "@/test/test-utils";

import { useResetPasswordPage } from "./use-reset-password-page";

describe("useResetPasswordPage", () => {
  it("starts with empty fields", () => {
    const { result } = renderHook(() => useResetPasswordPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    expect(result.current.newPassword).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.errors).toEqual({});
    expect(result.current.apiError).toBe("");
    expect(result.current.success).toBe(false);
  });

  it("validates required password", async () => {
    const { result } = renderHook(() => useResetPasswordPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.errors.new_password).toBeDefined();
  });

  it("validates minimum password length", async () => {
    const { result } = renderHook(() => useResetPasswordPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    act(() => {
      result.current.setNewPassword("123");
      result.current.setConfirmPassword("123");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.errors.new_password).toBeDefined();
  });

  it("validates password mismatch", async () => {
    const { result } = renderHook(() => useResetPasswordPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    act(() => {
      result.current.setNewPassword("password123");
      result.current.setConfirmPassword("different123");
    });

    await act(async () => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.errors.confirm_password).toBeDefined();
  });

  it("has no token when not in URL", () => {
    const { result } = renderHook(() => useResetPasswordPage(), {
      wrapper: createAllProvidersWrapper(),
    });

    expect(result.current.token).toBe("");
  });
});
