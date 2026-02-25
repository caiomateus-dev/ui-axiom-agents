import type { ReactNode } from "react";

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ToastProvider, useToast, useToastState } from "./ToastContext";

function wrapper({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

describe("ToastContext", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with no toasts", () => {
    const { result } = renderHook(() => useToastState(), { wrapper });
    expect(result.current.toasts).toEqual([]);
  });

  it("adds a toast", () => {
    const { result } = renderHook(() => useToastState(), { wrapper });
    act(() => result.current.addToast("success", "Created!"));
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("success");
    expect(result.current.toasts[0].message).toBe("Created!");
  });

  it("removes a toast", () => {
    const { result } = renderHook(() => useToastState(), { wrapper });
    act(() => result.current.addToast("info", "Hello"));
    const id = result.current.toasts[0].id;
    act(() => result.current.removeToast(id));
    expect(result.current.toasts).toHaveLength(0);
  });

  it("auto-dismisses toast after duration", () => {
    const { result } = renderHook(() => useToastState(), { wrapper });
    act(() => result.current.addToast("info", "Temp"));
    expect(result.current.toasts).toHaveLength(1);
    act(() => vi.advanceTimersByTime(4000));
    expect(result.current.toasts).toHaveLength(0);
  });

  it("supports custom duration", () => {
    const { result } = renderHook(() => useToastState(), { wrapper });
    act(() => result.current.addToast("info", "Fast", 1000));
    expect(result.current.toasts).toHaveLength(1);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.toasts).toHaveLength(0);
  });

  describe("useToast convenience methods", () => {
    it("success() adds success toast", () => {
      const { result } = renderHook(() => ({ toast: useToast(), state: useToastState() }), {
        wrapper,
      });
      act(() => result.current.toast.success("OK"));
      expect(result.current.state.toasts[0].type).toBe("success");
    });

    it("error() adds error toast", () => {
      const { result } = renderHook(() => ({ toast: useToast(), state: useToastState() }), {
        wrapper,
      });
      act(() => result.current.toast.error("Fail"));
      expect(result.current.state.toasts[0].type).toBe("error");
    });

    it("info() adds info toast", () => {
      const { result } = renderHook(() => ({ toast: useToast(), state: useToastState() }), {
        wrapper,
      });
      act(() => result.current.toast.info("Note"));
      expect(result.current.state.toasts[0].type).toBe("info");
    });

    it("warning() adds warning toast", () => {
      const { result } = renderHook(() => ({ toast: useToast(), state: useToastState() }), {
        wrapper,
      });
      act(() => result.current.toast.warning("Watch out"));
      expect(result.current.state.toasts[0].type).toBe("warning");
    });
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useToastState());
    }).toThrow("useToastState must be used within ToastProvider");
  });
});
