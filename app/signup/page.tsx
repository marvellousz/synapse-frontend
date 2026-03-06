"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Brain } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { state, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(email, password, name || null);
      router.push("/memories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (state.status === "authenticated") {
      router.replace("/memories");
    }
  }, [state.status, router]);

  if (state.status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen grid-bg py-16 px-6">
      <div className="max-w-md mx-auto">
        <div className="mb-12 flex flex-col items-center">
          <Link href="/" className="mb-8 p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_black] rotate-[3deg] hover:rotate-0 transition-transform inline-block">
            <Brain className="w-8 h-8 text-emerald-600" />
          </Link>
          <h1 className="heading-brut text-4xl mb-2 text-center">Join Synapse.</h1>
          <p className="font-bold text-gray-500 uppercase text-xs tracking-widest text-center">Start building your second brain</p>
        </div>

        <div className="brut-card p-8 bg-white relative">

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-100 border-2 border-rose-500 text-rose-700 font-bold text-sm shadow-[4px_4px_0px_0px_#F43F5E]">
                {error}
              </div>
            )}

            <div>
              <label className="block font-black uppercase text-xs mb-2 tracking-widest text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="brut-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-black uppercase text-xs mb-2 tracking-widest text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="brut-input"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block font-black uppercase text-xs mb-2 tracking-widest text-gray-600">
                Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="brut-input"
                placeholder="Your name"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="brut-button w-full justify-center text-xl py-4 mt-4"
            >
              {loading ? "CREATING..." : "START BUILDING"}
            </button>

            <div className="text-center pt-4">
              <p className="font-bold text-sm text-gray-500">
                ALREADY HAVE AN ACCOUNT?{" "}
                <Link href="/login" className="text-indigo-600 underline decoration-2 underline-offset-4 hover:bg-indigo-50">
                  LOG IN
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="font-black uppercase text-sm flex items-center justify-center gap-2 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
