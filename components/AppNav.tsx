"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export default function AppNav() {
  const { state, logout } = useAuth();
  const isAuth = state.status === "authenticated";

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        borderColor: "rgba(148, 163, 184, 0.1)",
        backgroundColor: "rgba(15, 23, 42, 0.8)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img src="/synapse.jpg" alt="Synapse" className="h-8 w-auto" />
          <span className="font-semibold text-lg" style={{ color: "#FFFFFF" }}>
            Synapse
          </span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link
            href="/"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "#CBD5E1" }}
          >
            Home
          </Link>
          {isAuth ? (
            <>
              <Link
                href="/memories"
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#CBD5E1" }}
              >
                Memories
              </Link>
              <Link
                href="/search"
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#CBD5E1" }}
              >
                Search
              </Link>
              <Link
                href="/chat"
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#CBD5E1" }}
              >
                Chat
              </Link>
              <div
                className="flex items-center gap-3 pl-5 border-l"
                style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}
              >
                <span
                  className="text-sm max-w-[160px] truncate"
                  style={{ color: "#94A3B8" }}
                  title={state.user.email}
                >
                  {state.user.email}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm transition-colors hover:bg-white/5"
                  style={{ color: "#94A3B8" }}
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#CBD5E1" }}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-90"
                style={{ background: "#3B82F6", color: "#FFFFFF" }}
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
