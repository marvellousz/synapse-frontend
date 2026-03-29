"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";

import { forgotPassword } from "@/lib/api";
import ToastMessage from "@/components/ToastMessage";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error && !message) return;
    const id = window.setTimeout(() => {
      setError(null);
      setMessage(null);
    }, 3500);
    return () => window.clearTimeout(id);
  }, [error, message]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "could not process request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid-bg py-16 px-6">
      <ToastMessage message={error} variant="error" onClose={() => setError(null)} />
      <ToastMessage message={message} variant="success" onClose={() => setMessage(null)} />
      <div className="max-w-md mx-auto">
        <div className="mb-12 flex flex-col items-center">
          <Link href="/" className="mb-8 p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_black] rotate-[-4deg] hover:rotate-0 transition-transform inline-block">
            <Brain className="w-8 h-8 text-indigo-600" />
          </Link>
          <h1 className="heading-brut text-4xl mb-2 text-center">Reset Password.</h1>
          <p className="font-bold text-gray-500 uppercase text-xs tracking-widest text-center">we will send a reset link to your email</p>
        </div>

        <div className="brut-card p-8 bg-white relative">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              disabled={loading}
              className="brut-button w-full justify-center text-xl py-4 mt-4"
            >
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>

            <div className="text-center pt-2">
              <p className="font-bold text-sm text-gray-500">
                BACK TO{" "}
                <Link href="/login" className="text-indigo-600 underline decoration-2 underline-offset-4 hover:bg-indigo-50">
                  LOGIN
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
