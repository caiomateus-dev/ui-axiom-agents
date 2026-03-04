import { useRef, useState } from "react";

import { X } from "lucide-react";

interface TagInputProps {
  label?: string;
  description?: string;
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  validate?: (tag: string) => string | null; // returns error message or null
}

export function TagInput({
  label,
  description,
  placeholder = "Digite e pressione Enter",
  value,
  onChange,
  error,
  validate,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  function add(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) {
      setInputError("Já adicionado");
      return;
    }
    if (validate) {
      const err = validate(tag);
      if (err) {
        setInputError(err);
        return;
      }
    }
    onChange([...value, tag]);
    setInput("");
    setInputError(null);
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      remove(value[value.length - 1]);
    } else {
      setInputError(null);
    }
  }

  function handleBlur() {
    if (input.trim()) add(input);
  }

  const displayError = error ?? inputError;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-main mb-1">{label}</label>}
      <div
        className={`min-h-[42px] w-full rounded-lg border bg-bg-card px-3 py-2 flex flex-wrap gap-1.5 cursor-text transition-colors focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 ${displayError ? "border-error-border focus-within:ring-error-text" : "border-border-strong"}`}
        onClick={() => ref.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-500 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(tag);
              }}
              className="hover:text-brand-600 transition-colors"
              aria-label={`Remover ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={ref}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[140px] bg-transparent text-sm text-text-main placeholder:text-text-muted outline-none"
        />
      </div>
      {displayError ? (
        <p className="text-xs text-error-text mt-1">{displayError}</p>
      ) : description ? (
        <p className="text-xs text-text-muted mt-1">{description}</p>
      ) : null}
    </div>
  );
}
