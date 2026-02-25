import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthProvider, SidebarProvider, ThemeProvider, ToastProvider } from "@/contexts";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();
  return (
    <MemoryRouter>
      <ThemeProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options }),
  };
}

export function createAllProvidersWrapper() {
  return AllProviders;
}

export function createQueryWrapper() {
  const queryClient = createTestQueryClient();
  return function QueryWrapper({ children }: WrapperProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

export { customRender as render };
export { userEvent };
