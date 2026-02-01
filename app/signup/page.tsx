"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PixelBlast from "@/components/PixelBlast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 -z-10"
        style={{ width: "100vw", height: "100vh", backgroundColor: "#0F172A" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 opacity-40">
          <PixelBlast
            variant="square"
            pixelSize={4}
            color="#3B82F6"
            patternScale={2}
            patternDensity={1}
            enableRipples
            rippleSpeed={0.35}
            rippleThickness={0.12}
            rippleIntensityScale={1.2}
            liquid={false}
            speed={0.45}
            edgeFade={0.35}
            transparent={true}
          />
        </div>
      </div>
      <div className="max-w-md mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white"
          style={{ color: "#94A3B8" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <h1 className="instrument-serif text-3xl font-bold mb-2" style={{ color: "#F8FAFC" }}>
          Sign up
        </h1>
        <p className="text-slate-400 mb-8">Create your Synapse account</p>
        <form
          onSubmit={handleSubmit}
          className="glass-surface rounded-2xl p-6 border space-y-4"
          style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}
        >
          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{ background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5" }}
            >
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2 rounded-lg border bg-white/5 text-white placeholder:text-slate-500"
              style={{ borderColor: "rgba(148, 163, 184, 0.3)" }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
              className="w-full px-4 py-2 rounded-lg border bg-white/5 text-white placeholder:text-slate-500"
              style={{ borderColor: "rgba(148, 163, 184, 0.3)" }}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>
              Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full px-4 py-2 rounded-lg border bg-white/5 text-white placeholder:text-slate-500"
              style={{ borderColor: "rgba(148, 163, 184, 0.3)" }}
              placeholder="Your name"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#3B82F6", color: "#FFFFFF" }}
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
          <p className="text-center text-sm" style={{ color: "#94A3B8" }}>
            Already have an account?{" "}
            <Link href="/login" className="underline" style={{ color: "#3B82F6" }}>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
