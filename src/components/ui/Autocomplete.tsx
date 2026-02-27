import { useEffect, useRef, useState } from "react";

import { ChevronDown, X } from "lucide-react";

export interface AutocompleteOption {
  value: number;
  label: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
  id?: string;
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Selecionar...",
  label,
  error,
  isLoading,
  disabled,
  id,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option: AutocompleteOption) {
    onChange(option.value);
    setOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setSearch("");
  }

  function handleOpen() {
    if (disabled) return;
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  const borderClass = error
    ? "border-error-border focus-within:ring-error-text"
    : "border-border-strong focus-within:ring-brand-500";

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          onClick={handleOpen}
          className={`flex items-center w-full h-9 rounded-lg border bg-bg-surface px-3 text-sm transition-colors cursor-pointer focus-within:outline-none focus-within:ring-2 ${borderClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {open ? (
            <input
              ref={inputRef}
              id={id}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={selected ? selected.label : placeholder}
              className="flex-1 bg-transparent outline-none text-text-main placeholder:text-text-muted"
              autoComplete="off"
            />
          ) : (
            <span className={`flex-1 truncate ${selected ? "text-text-main" : "text-text-muted"}`}>
              {selected ? selected.label : placeholder}
            </span>
          )}

          <div className="flex items-center gap-1 ml-2 shrink-0">
            {selected && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-text-muted hover:text-text-main transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown
              className={`w-4 h-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {open && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 rounded-lg border border-border-subtle bg-bg-card shadow-lg max-h-48 overflow-auto">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-text-muted">Carregando...</div>
            ) : filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-text-muted">Nenhum resultado</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors cursor-pointer hover:bg-brand-50 ${
                    option.value === value
                      ? "bg-brand-50 text-brand-600 font-medium"
                      : "text-text-main"
                  }`}
                >
                  <span className="text-text-muted text-xs w-8 shrink-0">#{option.value}</span>
                  <span className="truncate">{option.label}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-error-text mt-1">{error}</p>}
    </div>
  );
}
