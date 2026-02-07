"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps<T extends string = string> {
  value: T | "";
  options: DropdownOption<T>[];
  onChange: (value: T | "") => void;
  placeholder?: string;
  label?: string;
  id?: string;
  "aria-label"?: string;
}

export default function Dropdown<T extends string = string>({
  value,
  options,
  onChange,
  placeholder = "Select…",
  label,
  id,
  "aria-label": ariaLabel,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative" id={id}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#94A3B8" }}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel ?? label ?? placeholder}
        className="w-full px-4 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-slate-500"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          borderColor: open ? "rgba(59, 130, 246, 0.5)" : "rgba(148, 163, 184, 0.3)",
          color: "#F8FAFC",
        }}
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              {selected.icon}
              <span>{selected.label}</span>
            </>
          ) : (
            <span style={{ color: "#64748B" }}>{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform duration-200"
          style={{
            color: "#94A3B8",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-2 w-full min-w-[200px] rounded-xl border py-1.5 max-h-60 overflow-auto"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.98)",
            borderColor: "rgba(148, 163, 184, 0.25)",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
          }}
        >
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(opt.value);
                    setOpen(false);
                  }
                }}
                className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer transition-colors duration-150 text-sm rounded-lg mx-1"
                style={{
                  color: "#F8FAFC",
                  backgroundColor: isSelected
                    ? "rgba(59, 130, 246, 0.25)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "rgba(148, 163, 184, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected
                    ? "rgba(59, 130, 246, 0.25)"
                    : "transparent";
                }}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
