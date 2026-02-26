import { useEffect, useRef, useState } from "react";

import { Building2, Check, ChevronsUpDown } from "lucide-react";

import { useOrganization } from "@/contexts";

interface OrgSwitcherProps {
  collapsed?: boolean;
}

export function OrgSwitcher({ collapsed }: OrgSwitcherProps) {
  const { currentOrg, organizations, switchOrganization } = useOrganization();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const handleSelect = (orgId: number) => {
    switchOrganization(orgId);
    setOpen(false);
  };

  if (collapsed) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          title={currentOrg?.name ?? "Organização"}
          className="flex items-center justify-center w-full px-3 py-2 rounded-lg text-sm transition-colors text-text-muted hover:text-text-main hover:bg-brand-50 cursor-pointer"
        >
          <Building2 className="w-5 h-5 shrink-0" />
        </button>

        {open && (
          <div className="absolute left-full top-0 ml-2 z-50 w-56 rounded-lg border border-border-subtle bg-bg-card shadow-lg py-1">
            <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
              Organizações
            </div>
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelect(org.id)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-main hover:bg-brand-50 transition-colors cursor-pointer"
              >
                <span className="flex-1 text-left truncate">{org.name}</span>
                {org.id === currentOrg?.id && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
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
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors border border-border-subtle bg-bg-card hover:bg-brand-50 cursor-pointer"
      >
        <Building2 className="w-4 h-4 text-text-muted shrink-0" />
        <span className="flex-1 text-left truncate text-text-main text-sm">
          {currentOrg?.name ?? "Selecionar org"}
        </span>
        <ChevronsUpDown className="w-4 h-4 text-text-muted shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border border-border-subtle bg-bg-card shadow-lg py-1">
          <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
            Organizações
          </div>
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSelect(org.id)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-main hover:bg-brand-50 transition-colors cursor-pointer"
            >
              <span className="flex-1 text-left truncate">{org.name}</span>
              {org.id === currentOrg?.id && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
