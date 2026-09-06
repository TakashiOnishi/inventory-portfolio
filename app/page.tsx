"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/Header";
import { ItemFormModal } from "@/components/ItemFormModal";
import { MovementModal } from "@/components/MovementModal";
import { HistoryModal } from "@/components/HistoryModal";
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  applyStockMovement,
} from "@/lib/inventory";
import { isLowStock } from "@/lib/stock";
import type { Item } from "@/lib/types";

type Modal =
  | { kind: "create" }
  | { kind: "edit"; item: Item }
  | { kind: "move"; item: Item }
  | { kind: "history"; item: Item }
  | null;

export default function Home() {
  const { user, loading, signIn } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [onlyLow, setOnlyLow] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchItems();
        if (cancelled) return;
        setItems(list);
        setDataError(null);
      } catch {
        if (cancelled) return;
        setDataError("データの取得に失敗しました。Firebase設定を確認してください。");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const reload = useCallback(async () => {
    try {
      setItems(await fetchItems());
      setDataError(null);
    } catch {
      setDataError("データの取得に失敗しました。Firebase設定を確認してください。");
    }
  }, []);

  if (loading) return <div className="p-8 text-text-muted">読み込み中…</div>;

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">📦 Inventory Manager</h1>
          <p className="mt-2 text-text-muted">在庫管理アプリ</p>
        </div>
        <button
          onClick={() => signIn()}
          className="rounded-md bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-hover"
        >
          Googleでログイン
        </button>
        <p className="max-w-sm text-center text-xs text-text-subtle">
          ※ポートフォリオ用の公開デモです。データは全ログインユーザーで共有され、予告なくリセットされる場合があります。
        </p>
      </main>
    );
  }

  const lowCount = items.filter((i) => isLowStock(i.quantity, i.minQuantity)).length;
  const shown = onlyLow
    ? items.filter((i) => isLowStock(i.quantity, i.minQuantity))
    : items;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModal({ kind: "create" })}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
            >
              ＋ 品目を追加
            </button>
            {lowCount > 0 && (
              <button
                onClick={() => setOnlyLow((v) => !v)}
                className={`rounded-md border px-3 py-2 text-sm ${
                  onlyLow
                    ? "border-warning-soft-border bg-warning-soft text-warning"
                    : "border-border-default"
                }`}
              >
                ⚠️ 低在庫 {lowCount} 件{onlyLow ? "（解除）" : "のみ表示"}
              </button>
            )}
          </div>
          <span className="text-sm text-text-muted">全 {items.length} 品目</span>
        </div>

        {dataError && (
          <p className="mb-4 rounded-md bg-danger-soft p-3 text-sm text-danger">{dataError}</p>
        )}

        {items.length === 0 && !dataError ? (
          <p className="text-text-muted">
            品目がありません。<code>npm run seed</code> か「品目を追加」で登録してください。
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border-default bg-surface">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-surface-muted text-left text-text-muted">
                <tr>
                  <th className="p-3">品名 / SKU</th>
                  <th className="p-3">カテゴリ</th>
                  <th className="p-3">保管場所</th>
                  <th className="p-3 text-right">在庫</th>
                  <th className="p-3 text-right">発注点</th>
                  <th className="p-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((item) => {
                  const low = isLowStock(item.quantity, item.minQuantity);
                  return (
                    <tr key={item.id} className="border-t border-border-subtle">
                      <td className="p-3">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-text-subtle">{item.sku}</div>
                      </td>
                      <td className="p-3 text-text-muted">{item.category || "—"}</td>
                      <td className="p-3 text-text-muted">{item.location || "—"}</td>
                      <td className="p-3 text-right">
                        <span className={low ? "font-semibold text-warning" : ""}>
                          {item.quantity}
                          {item.unit}
                        </span>
                        {low && <span className="ml-1" title="低在庫">⚠️</span>}
                      </td>
                      <td className="p-3 text-right text-text-muted">{item.minQuantity}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            onClick={() => setModal({ kind: "move", item })}
                            className="rounded border border-border-default px-2 py-1 hover:bg-surface-muted"
                          >
                            入出庫
                          </button>
                          <button
                            onClick={() => setModal({ kind: "history", item })}
                            className="rounded border border-border-default px-2 py-1 hover:bg-surface-muted"
                          >
                            履歴
                          </button>
                          <button
                            onClick={() => setModal({ kind: "edit", item })}
                            className="rounded border border-border-default px-2 py-1 hover:bg-surface-muted"
                          >
                            編集
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`「${item.name}」を削除しますか？`)) {
                                await deleteItem(item.id);
                                await reload();
                              }
                            }}
                            className="rounded border border-border-default px-2 py-1 text-danger hover:bg-danger-soft"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modal?.kind === "create" && (
        <ItemFormModal
          onClose={() => setModal(null)}
          onSubmit={async (input) => {
            await createItem(input);
            setModal(null);
            await reload();
          }}
        />
      )}
      {modal?.kind === "edit" && (
        <ItemFormModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSubmit={async (input) => {
            const { name, sku, category, unit, location, minQuantity } = input;
            await updateItem(modal.item.id, {
              name,
              sku,
              category,
              unit,
              location,
              minQuantity,
            });
            setModal(null);
            await reload();
          }}
        />
      )}
      {modal?.kind === "move" && (
        <MovementModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSubmit={async (type, amount, reason) => {
            await applyStockMovement({
              itemId: modal.item.id,
              type,
              amount,
              reason,
              userId: user.uid,
              userName: user.displayName ?? user.email ?? "unknown",
            });
            setModal(null);
            await reload();
          }}
        />
      )}
      {modal?.kind === "history" && (
        <HistoryModal item={modal.item} onClose={() => setModal(null)} />
      )}
    </>
  );
}
