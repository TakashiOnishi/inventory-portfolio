"use client";

import { useState } from "react";
import type { Item, MovementType } from "@/lib/types";

interface Props {
  item: Item;
  onClose: () => void;
  onSubmit: (type: MovementType, amount: number, reason: string) => Promise<void>;
}

const TYPE_OPTIONS: { value: MovementType; label: string; hint: string }[] = [
  { value: "in", label: "入庫", hint: "追加する数量" },
  { value: "out", label: "出庫", hint: "減らす数量" },
  { value: "adjust", label: "棚卸調整", hint: "補正後の在庫数" },
];

/** 入出庫・棚卸モーダル */
export function MovementModal({ item, onClose, onSubmit }: Props) {
  const [type, setType] = useState<MovementType>("in");
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const hint = TYPE_OPTIONS.find((o) => o.value === type)!.hint;

  const handleSubmit = async () => {
    setError(null);
    setSaving(true);
    try {
      await onSubmit(type, Number(amount), reason.trim());
    } catch (e) {
      const msg =
        e instanceof Error && e.message === "INSUFFICIENT_STOCK"
          ? "在庫数を超える出庫はできません"
          : "保存に失敗しました";
      setError(msg);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <h2 className="mb-1 text-base font-semibold">在庫を更新</h2>
        <p className="mb-4 text-sm text-slate-500">
          {item.name}（現在 {item.quantity}{item.unit}）
        </p>

        <div className="mb-4 flex gap-2">
          {TYPE_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setType(o.value)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                type === o.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-300"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-sm font-medium">{hint}</label>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm font-medium">理由・メモ</label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="例: 発注入荷 / 部署払い出し / 棚卸差異"
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "保存中…" : "適用"}
          </button>
        </div>
      </div>
    </div>
  );
}
