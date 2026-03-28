"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Brain } from "lucide-react";

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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 border-2 border-black flex items-center justify-center rotate-[-3deg] group-hover:rotate-0 transition-transform">
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
                    ? "bg-indigo-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_black] -translate-x-[2px] -translate-y-[2px]"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="h-6 w-[2px] bg-black/10 mx-2 hidden md:block" />

          {isAuth ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block font-bold text-[10px] uppercase tracking-tighter bg-emerald-100 border-2 border-emerald-500 px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#10B981]">
                {state.user.email}
              </span>
              <button
                onClick={() => logout()}
                className="brut-button py-1.5 px-4 text-xs flex items-center gap-2 bg-rose-500 hover:bg-rose-600"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Log out</span>
              </button>
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
