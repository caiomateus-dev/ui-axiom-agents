import { Navigate, Outlet } from "react-router";

import { Spinner } from "@/components";
import { useAuth, useSidebar } from "@/contexts";

import { Sidebar } from "./Sidebar";

export function AuthLayout() {
  const { isAuthenticated, accessToken } = useAuth();
  const { collapsed } = useSidebar();

  const loading = !!accessToken && !isAuthenticated;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-canvas">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-bg-canvas">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 p-6 min-h-screen bg-bg-canvas ${
          collapsed ? "md:ml-16" : "md:ml-60"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
