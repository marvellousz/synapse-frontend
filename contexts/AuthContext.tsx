"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMe, login as apiLogin, signup as apiSignup } from "@/lib/api";
import { setAuthToken } from "@/lib/auth-token";
import type { User } from "@/lib/types";

type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: User };

type AuthContextValue = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string | null) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  const loadUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("synapse_token") : null;
    if (!token) {
      setState({ status: "unauthenticated" });
      return;
    }
    setAuthToken(token);
    try {
      const user = await getMe();
      setState({ status: "authenticated", user });
    } catch {
      setAuthToken(null);
      setState({ status: "unauthenticated" });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { access_token } = await apiLogin(email, password);
      setAuthToken(access_token);
      const user = await getMe();
      setState({ status: "authenticated", user });
    },
    []
  );

  const signup = useCallback(
    async (email: string, password: string, name?: string | null) => {
      await apiSignup({ email, password, name });
      const { access_token } = await apiLogin(email, password);
      setAuthToken(access_token);
      const user = await getMe();
      setState({ status: "authenticated", user });
    },
    []
  );

  const logout = useCallback(() => {
    setAuthToken(null);
    setState({ status: "unauthenticated" });
  }, []);

  const value: AuthContextValue = { state, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
