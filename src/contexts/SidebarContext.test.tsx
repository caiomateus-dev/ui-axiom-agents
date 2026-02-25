import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { SidebarProvider, useSidebar } from "./SidebarContext";

function wrapper({ children }: { children: ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}

describe("SidebarContext", () => {
  it("starts not collapsed by default", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });
    expect(result.current.collapsed).toBe(false);
  });

  it("toggles collapsed state", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });
    act(() => result.current.toggleSidebar());
    expect(result.current.collapsed).toBe(true);
    act(() => result.current.toggleSidebar());
    expect(result.current.collapsed).toBe(false);
  });

  it("persists collapsed state to localStorage", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });
    act(() => result.current.toggleSidebar());
    expect(localStorage.setItem).toHaveBeenCalledWith("sidebar_collapsed", "true");
  });

  it("reads initial collapsed from localStorage", () => {
    localStorage.setItem("sidebar_collapsed", "true");
    const { result } = renderHook(() => useSidebar(), { wrapper });
    expect(result.current.collapsed).toBe(true);
  });

  it("starts with mobileOpen false", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });
    expect(result.current.mobileOpen).toBe(false);
  });

  it("opens and closes mobile sidebar", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });
    act(() => result.current.openMobile());
    expect(result.current.mobileOpen).toBe(true);
    act(() => result.current.closeMobile());
    expect(result.current.mobileOpen).toBe(false);
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useSidebar());
    }).toThrow("useSidebar must be used within a SidebarProvider");
  });
});
