import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

import { api } from "@/core";

export interface UserOrganization {
  id: number;
  name: string;
  slug: string;
  role: string;
}

interface User {
  id: number;
  email: string;
  name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  organizations: UserOrganization[];
}

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function restoreSession(): Promise<{ user: User; token: string } | null> {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const { data } = await api.get<User>("/auth/me");
    return { user: data, token };
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
}

function getInitialState() {
  const token = localStorage.getItem("access_token");
  return { user: null as User | null, token };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ user, token: accessToken }, setState] = useState(getInitialState);
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = !!user && !!accessToken;

  if (!initialized) {
    if (accessToken) {
      restoreSession().then((result) => {
        if (result) {
          setState({ user: result.user, token: result.token });
        } else {
          setState({ user: null, token: null });
        }
        setInitialized(true);
      });
    } else {
      setInitialized(true);
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("access_token", data.access);
    if (data.refresh) {
      localStorage.setItem("refresh_token", data.refresh);
    }
    const { data: userData } = await api.get<User>("/auth/me");
    setState({ user: userData, token: data.access });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("organization_id");
    setState({ user: null, token: null });
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
