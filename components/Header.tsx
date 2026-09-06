"use client";

import { useAuth } from "@/lib/auth-context";

export function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="flex items-center justify-between border-b border-border-default bg-surface px-6 py-3">
      <h1 className="text-lg font-semibold">📦 Inventory Manager</h1>
      {user && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-text-muted">{user.displayName ?? user.email}</span>
          <button
            onClick={() => logout()}
            className="rounded-md border border-border-default px-3 py-1 hover:bg-surface-muted"
          >
            ログアウト
          </button>
        </div>
      )}
    </header>
  );
}
