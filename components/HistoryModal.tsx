"use client";

import { useEffect, useState } from "react";
import type { Item, StockMovement } from "@/lib/types";
import { fetchMovements } from "@/lib/inventory";

interface Props {
  item: Item;
  onClose: () => void;
}

const TYPE_LABEL: Record<StockMovement["type"], string> = {
  in: "入庫",
  out: "出庫",
  adjust: "調整",
};

/** 品目ごとの入出庫履歴モーダル */
export function HistoryModal({ item, onClose }: Props) {
  const [rows, setRows] = useState<StockMovement[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetchMovements(item.id);
        if (!cancelled) setRows(r);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [item.id]);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-backdrop p-4">
      <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-lg bg-surface p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">履歴: {item.name}</h2>
          <button onClick={onClose} className="text-sm text-text-muted hover:underline">
            閉じる
          </button>
        </div>

        <div className="overflow-y-auto">
          {error && <p className="text-sm text-danger">履歴の取得に失敗しました</p>}
          {!error && rows === null && <p className="text-sm text-text-muted">読み込み中…</p>}
          {rows && rows.length === 0 && (
            <p className="text-sm text-text-muted">履歴はまだありません</p>
          )}
          {rows && rows.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted">
                  <th className="py-1">日時</th>
                  <th>種別</th>
                  <th className="text-right">増減</th>
                  <th className="text-right">在庫</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id} className="border-t border-border-subtle">
                    <td className="py-1">
                      {new Date(m.createdAt).toLocaleString("ja-JP", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{TYPE_LABEL[m.type]}</td>
                    <td
                      className={`text-right ${
                        m.delta >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {m.delta >= 0 ? `+${m.delta}` : m.delta}
                    </td>
                    <td className="text-right">{m.resultingQuantity}</td>
                    <td className="text-text-muted">{m.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
