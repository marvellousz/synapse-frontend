"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/memories", label: "Memories" },
  { href: "/search", label: "Search" },
  { href: "/chat", label: "Chat" },
] as const;

export default function AppNav() {
  const pathname = usePathname();
  const { state, logout } = useAuth();
  const isAuth = state.status === "authenticated";

  return (
    <nav
      className="sticky top-0 z-50 rounded-b-2xl mx-4 mt-2 mb-0 shadow-lg"
      style={{
        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.15)",
        borderTop: "none",
        boxShadow: "0 8px 32px rgba(15, 23, 42, 0.6), 0 1px 0 rgba(148, 163, 184, 0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-3 group rounded-xl px-2 py-1.5 -ml-2 transition-colors hover:bg-white/5 cursor-pointer"
        >
          <img
            src="/synapse.jpg"
            alt="Synapse"
            className="h-9 w-auto rounded-lg ring-1 ring-white/10 transition-transform group-hover:scale-105"
          />
          <span
            className="font-semibold text-xl tracking-tight"
            style={{ color: "#F8FAFC" }}
          >
            Synapse
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.slice(0, isAuth ? 4 : 1).map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  !isActive ? "hover:bg-white/5" : ""
                }`}
                style={{
                  color: isActive ? "#93C5FD" : "#94A3B8",
                  backgroundColor: isActive ? "rgba(59, 130, 246, 0.12)" : "transparent",
                }}
              >
                {isActive && (
                  <span
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: "#3B82F6" }}
                    aria-hidden
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            );
          })}

          {isAuth ? (
            <>
              <div
                className="w-px h-6 mx-2"
                style={{ backgroundColor: "rgba(148, 163, 184, 0.25)" }}
              />
              <div className="flex items-center gap-2 pl-1">
                <span
                  className="text-sm max-w-[140px] truncate px-3 py-1.5 rounded-lg"
                  style={{ color: "#94A3B8", backgroundColor: "rgba(148, 163, 184, 0.08)" }}
                  title={state.user.email}
                >
                  {state.user.email}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 cursor-pointer"
                  style={{
                    color: "#94A3B8",
                    backgroundColor: "rgba(148, 163, 184, 0.08)",
                  }}
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className="w-px h-6 mx-1"
                style={{ backgroundColor: "rgba(148, 163, 184, 0.25)" }}
              />
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 cursor-pointer"
                style={{ color: "#CBD5E1" }}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
