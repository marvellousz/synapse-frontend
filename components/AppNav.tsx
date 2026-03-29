"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Brain, Settings, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/memories", label: "Memories" },
  { href: "/folders", label: "Folders" },
  { href: "/graph", label: "Graph" },
  { href: "/search", label: "Search" },
  { href: "/chat", label: "Chat" },
] as const;

export default function AppNav() {
  const pathname = usePathname();
  const { state, logout } = useAuth();
  const isAuth = state.status === "authenticated";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const initials = useMemo(() => {
    if (!isAuth) return "U";
    const source = state.user.name?.trim() || state.user.email;
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
  }, [isAuth, state]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 border-2 border-black flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-2xl uppercase tracking-tighter">Synapse</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            {navLinks.slice(0, isAuth ? 6 : 1).map(({ href, label }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 font-bold uppercase text-xs tracking-widest transition-all ${isActive
                    ? "bg-indigo-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_black] -translate-x-0.5 -translate-y-0.5"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="h-6 w-0.5 bg-black/10 mx-2 hidden md:block" />

          {isAuth ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="h-11 pl-1 pr-2 rounded-full border-2 border-black bg-white shadow-[3px_3px_0px_0px_black] flex items-center gap-2 hover:-translate-y-px transition-transform"
                aria-expanded={menuOpen}
                aria-label="open profile menu"
              >
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white border-2 border-black text-xs font-black flex items-center justify-center">
                  {initials}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border-2 border-black shadow-[6px_6px_0px_0px_black] p-2 z-50">
                  <div className="px-3 py-3 border-2 border-emerald-500 bg-emerald-50 mb-2">
                    <p className="text-[10px] uppercase tracking-widest font-black text-emerald-700">signed in as</p>
                    <p className="text-xs font-black break-all text-gray-800 mt-1">{state.user.email}</p>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="w-full px-3 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                    settings
                  </Link>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full mt-1 px-3 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-700 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" />
                    log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="font-black uppercase text-xs hover:underline">
                Log in
              </Link>
              <Link href="/signup" className="brut-button py-2 px-5 text-xs bg-emerald-500">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
