import { useEffect, useRef, useState } from "react";

import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Selecionar...",
  label,
  description,
  error,
  disabled,
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option: SelectOption) {
    onChange(option.value);
    setOpen(false);
  }

  const borderClass = error
    ? "border-error-border"
    : open
      ? "border-brand-500 ring-2 ring-brand-500"
      : "border-border-strong hover:border-border-subtle";

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={`flex items-center w-full rounded-lg border bg-bg-card px-3 py-2 text-sm transition-colors focus:outline-none ${borderClass} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span
            className={`flex-1 text-left truncate ${selected ? "text-text-main" : "text-text-muted"}`}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={`ml-2 w-4 h-4 text-text-muted shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 rounded-lg border border-border-subtle bg-bg-card shadow-lg overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-colors hover:bg-bg-surface ${
                  option.value === value ? "text-brand-500 font-medium" : "text-text-main"
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-error-text mt-1">{error}</p>
      ) : description ? (
        <p className="text-xs text-text-muted mt-1">{description}</p>
      ) : null}
    </div>
  );
}
