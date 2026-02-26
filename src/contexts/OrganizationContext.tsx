import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/core";

import { useAuth } from "./AuthContext";
import type { UserOrganization } from "./AuthContext";

async function fetchAllOrganizations(): Promise<UserOrganization[]> {
  const { data } = await api.get<{ id: number; name: string; slug: string }[]>("/organizations");
  return data.map((o) => ({ id: o.id, name: o.name, slug: o.slug, role: "superuser" }));
}

interface OrganizationContextValue {
  currentOrg: UserOrganization | null;
  organizations: UserOrganization[];
  switchOrganization: (orgId: number | null) => void;
  isOrgAdmin: boolean;
  isAllOrgs: boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const memberOrgs = user?.organizations ?? [];

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(() => {
    const stored = localStorage.getItem("organization_id");
    return stored ? Number(stored) : null;
  });

  const isSuperuser = user?.is_superuser === true;

  // Superusers fetch ALL organizations from the API
  const { data: allOrgs } = useQuery({
    queryKey: ["all-organizations"],
    queryFn: fetchAllOrganizations,
    enabled: isSuperuser && !!user,
    staleTime: 60_000,
  });

  // For superusers: use fetched list; for normal users: use member orgs from auth
  const organizations: UserOrganization[] = isSuperuser ? (allOrgs ?? memberOrgs) : memberOrgs;

  const currentOrg = useMemo(() => {
    // Superuser selected "Todas" (null)
    if (isSuperuser && selectedOrgId === null) return null;

    if (organizations.length === 0) return null;

    // If stored org is still valid for this user, use it
    if (selectedOrgId) {
      const found = organizations.find((o) => o.id === selectedOrgId);
      if (found) return found;
    }

    // Auto-select first org
    return organizations[0] ?? null;
  }, [organizations, selectedOrgId, isSuperuser]);

  const isAllOrgs = isSuperuser && currentOrg === null;

  // Sync to localStorage when currentOrg changes
  useEffect(() => {
    if (currentOrg) {
      localStorage.setItem("organization_id", String(currentOrg.id));
    } else if (isAllOrgs) {
      localStorage.removeItem("organization_id");
    }
  }, [currentOrg, isAllOrgs]);

  const switchOrganization = useCallback(
    (orgId: number | null) => {
      setSelectedOrgId(orgId);
      if (orgId !== null) {
        localStorage.setItem("organization_id", String(orgId));
      } else {
        localStorage.removeItem("organization_id");
      }
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const isOrgAdmin = currentOrg?.role === "admin";

  return (
    <OrganizationContext.Provider
      value={{ currentOrg, organizations, switchOrganization, isOrgAdmin, isAllOrgs }}
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
