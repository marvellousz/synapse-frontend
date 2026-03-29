"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, User, ArrowLeft, Loader2, KeyRound, Trash2 } from "lucide-react";

import AppNav from "@/components/AppNav";
import { useAuth } from "@/contexts/AuthContext";
import { changePassword, deleteAccount } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";
import ToastMessage from "@/components/ToastMessage";

export default function SettingsPage() {
  const router = useRouter();
  const { state, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!toastError && !toastSuccess) return;
    const id = window.setTimeout(() => {
      setToastError(null);
      setToastSuccess(null);
    }, 3500);
    return () => window.clearTimeout(id);
  }, [toastError, toastSuccess]);

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [state.status, router]);

  if (state.status === "loading") {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="brut-card p-8 bg-white flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <span className="font-black uppercase tracking-widest text-xs">Loading Settings...</span>
        </div>
      </div>
    );
  }

  if (state.status === "unauthenticated") {
    return null;
  }

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setToastError(null);
    setToastSuccess(null);

    if (newPassword.length < 6) {
      setToastError("new password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setToastError("new passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToastSuccess(res.message);
    } catch (err) {
      setToastError(err instanceof Error ? err.message : "could not change password");
    } finally {
      setChangingPassword(false);
    }
  }

  async function onDeleteAccount() {
    setDeletingAccount(true);
    try {
      const res = await deleteAccount(deletePassword);
      logout();
      router.replace("/signup");
      setToastSuccess(res.message);
    } catch (err) {
      setToastError(err instanceof Error ? err.message : "could not delete account");
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div className="min-h-screen grid-bg relative">
      <ToastMessage message={toastError} variant="error" onClose={() => setToastError(null)} />
      <ToastMessage message={toastSuccess} variant="success" onClose={() => setToastSuccess(null)} />
      <AppNav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="heading-brut text-4xl">Settings.</h1>
          <p className="font-bold uppercase text-xs tracking-widest text-gray-500 mt-1">manage your account basics</p>
        </div>

        <section className="brut-card bg-white p-8 space-y-6">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 mt-0.5 text-indigo-600" />
            <div className="w-full">
              <p className="font-black uppercase tracking-widest text-xs text-gray-500">name</p>
              <input
                type="text"
                value={state.user.name ?? ""}
                readOnly
                className="mt-1 w-full max-w-md border-2 border-black bg-gray-50 px-3 py-2 font-bold text-sm"
                placeholder="no name set"
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 mt-0.5 text-indigo-600" />
            <div>
              <p className="font-black uppercase tracking-widest text-xs text-gray-500">email</p>
              <p className="font-black text-lg break-all">{state.user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-black uppercase tracking-widest text-xs text-gray-500">verification status</p>
              <p className={`font-black text-sm uppercase tracking-widest mt-1 inline-flex items-center gap-2 ${state.user.emailVerified ? "text-emerald-700" : "text-amber-700"}`}>
                <CheckCircle2 className="w-4 h-4" />
                {state.user.emailVerified ? "verified" : "not verified"}
              </p>
            </div>
          </div>

          <form onSubmit={onChangePassword} className="pt-6 border-t-2 border-black/10 space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <p className="font-black uppercase tracking-widest text-xs text-gray-500">change password</p>
            </div>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border-2 border-black px-3 py-2 font-bold text-sm"
              placeholder="current password"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border-2 border-black px-3 py-2 font-bold text-sm"
              placeholder="new password"
              minLength={6}
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-2 border-black px-3 py-2 font-bold text-sm"
              placeholder="confirm new password"
              minLength={6}
              required
            />
            <button
              type="submit"
              disabled={changingPassword}
              className="brut-button text-xs px-6 py-2"
            >
              {changingPassword ? "updating..." : "change password"}
            </button>
          </form>

          <div className="pt-6 border-t-2 border-black/10 space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <p className="font-black uppercase tracking-widest text-xs text-rose-700">delete account</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              this is permanent. all your memories, chats, spaces, and uploads records will be removed.
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full border-2 border-black px-3 py-2 font-bold text-sm"
              placeholder="enter your password to confirm"
              required
            />
            <button
              type="button"
              onClick={() => {
                if (!deletePassword) {
                  setToastError("enter your password to delete account");
                  return;
                }
                setShowDeleteConfirm(true);
              }}
              className="brut-button text-xs px-6 py-2 bg-rose-500 hover:bg-rose-600"
            >
              delete account
            </button>
          </div>
        </section>

        <div className="mt-10">
          <Link href="/memories" className="font-black uppercase text-sm flex items-center gap-2 hover:underline">
            <ArrowLeft className="w-4 h-4" /> back to memories
          </Link>
        </div>

        <ConfirmDialog
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={onDeleteAccount}
          loading={deletingAccount}
          loadingLabel="deleting..."
          title="Delete Account"
          message="This action cannot be undone. Your account and data will be permanently deleted."
          confirmLabel="Yes, delete"
          cancelLabel="Cancel"
          variant="danger"
        />
      </main>
    </div>
  );
}
