import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "./AuthContext";
import type { UserOrganization } from "./AuthContext";

interface OrganizationContextValue {
  currentOrg: UserOrganization | null;
  organizations: UserOrganization[];
  switchOrganization: (orgId: number) => void;
  isOrgAdmin: boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const organizations = user?.organizations ?? [];

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(() => {
    const stored = localStorage.getItem("organization_id");
    return stored ? Number(stored) : null;
  });

  const currentOrg = useMemo(() => {
    if (organizations.length === 0) return null;

    // If stored org is still valid for this user, use it
    if (selectedOrgId) {
      const found = organizations.find((o) => o.id === selectedOrgId);
      if (found) return found;
    }

    // Auto-select first org
    return organizations[0] ?? null;
  }, [organizations, selectedOrgId]);

  // Sync to localStorage when currentOrg changes
  useEffect(() => {
    if (currentOrg) {
      localStorage.setItem("organization_id", String(currentOrg.id));
    }
  }, [currentOrg]);

  const switchOrganization = useCallback(
    (orgId: number) => {
      setSelectedOrgId(orgId);
      localStorage.setItem("organization_id", String(orgId));
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const isOrgAdmin = currentOrg?.role === "admin";

  return (
    <OrganizationContext.Provider
      value={{ currentOrg, organizations, switchOrganization, isOrgAdmin }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextValue {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
}
