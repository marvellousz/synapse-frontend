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
    <div ref={ref} className="relative w-full" id={id}>
      {label && (
        <label
          htmlFor={id}
          className="block font-black uppercase text-[10px] mb-2 tracking-widest text-gray-500"
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
        className="w-full px-4 py-3 bg-white border-2 border-black text-left flex items-center justify-between gap-2 shadow-[4px_4px_0px_0px_black] active:shadow-[0px_0px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              {selected.icon}
              <span className="font-bold text-sm uppercase">{selected.label}</span>
            </>
          ) : (
            <span className="font-bold text-sm uppercase text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-4 w-full bg-white border-4 border-black py-2 shadow-[8px_8px_0px_0px_black] animate-in slide-in-from-top-2 duration-150"
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
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm font-bold uppercase ${isSelected
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-50"
                  }`}
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
