import { useEffect, useRef, useState } from "react";

import { Building2, Check, ChevronsUpDown, Globe } from "lucide-react";

import { useAuth, useOrganization } from "@/contexts";

interface OrgSwitcherProps {
  collapsed?: boolean;
}

export function OrgSwitcher({ collapsed }: OrgSwitcherProps) {
  const { user } = useAuth();
  const { currentOrg, organizations, switchOrganization, isAllOrgs } = useOrganization();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isSuperuser = user?.is_superuser === true;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (organizations.length === 0) return null;

  const handleSelect = (orgId: number | null) => {
    switchOrganization(orgId);
    setOpen(false);
  };

  const displayName = isAllOrgs ? "Todas as organizações" : (currentOrg?.name ?? "Selecionar org");

  const allOrgsOption = isSuperuser ? (
    <button
      onClick={() => handleSelect(null)}
      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-main hover:bg-brand-50 transition-colors cursor-pointer"
    >
      <Globe className="w-4 h-4 text-text-muted shrink-0" />
      <span className="flex-1 text-left truncate">Todas as organizações</span>
      {isAllOrgs && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
    </button>
  ) : null;

  if (collapsed) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          title={displayName}
          className={`flex items-center justify-center w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
            isAllOrgs
              ? "text-brand-500 bg-brand-50"
              : "text-text-muted hover:text-text-main hover:bg-brand-50"
          }`}
        >
          {isAllOrgs ? (
            <Globe className="w-5 h-5 shrink-0" />
          ) : (
            <Building2 className="w-5 h-5 shrink-0" />
          )}
        </button>

        {open && (
          <div className="absolute left-full top-0 ml-2 z-50 w-56 rounded-lg border border-border-subtle bg-bg-card shadow-lg py-1">
            <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
              Organizações
            </div>
            {allOrgsOption}
            {isSuperuser && allOrgsOption && <div className="border-t border-border-subtle my-1" />}
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelect(org.id)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-main hover:bg-brand-50 transition-colors cursor-pointer"
              >
                <span className="flex-1 text-left truncate">{org.name}</span>
                {org.id === currentOrg?.id && !isAllOrgs && (
                  <Check className="w-4 h-4 text-brand-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors border cursor-pointer ${
          isAllOrgs
            ? "border-brand-300 bg-brand-50 hover:bg-brand-100"
            : "border-border-subtle bg-bg-card hover:bg-brand-50"
        }`}
      >
        {isAllOrgs ? (
          <Globe className="w-4 h-4 text-brand-500 shrink-0" />
        ) : (
          <Building2 className="w-4 h-4 text-text-muted shrink-0" />
        )}
        <span className="flex-1 text-left truncate text-text-main text-sm">{displayName}</span>
        <ChevronsUpDown className="w-4 h-4 text-text-muted shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border border-border-subtle bg-bg-card shadow-lg py-1">
          <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
            Organizações
          </div>
          {allOrgsOption}
          {isSuperuser && allOrgsOption && <div className="border-t border-border-subtle my-1" />}
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSelect(org.id)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-main hover:bg-brand-50 transition-colors cursor-pointer"
            >
              <span className="flex-1 text-left truncate">{org.name}</span>
              {org.id === currentOrg?.id && !isAllOrgs && (
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
