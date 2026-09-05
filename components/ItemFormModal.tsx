"use client";

import { useState } from "react";
import type { Item, ItemInput } from "@/lib/types";

interface Props {
  /** 既存品目を渡すと編集モード、未指定なら新規作成 */
  item?: Item;
  onClose: () => void;
  onSubmit: (input: ItemInput) => Promise<void>;
}

/** 品目の新規作成／マスタ編集モーダル（在庫数は入出庫で変更する） */
export function ItemFormModal({ item, onClose, onSubmit }: Props) {
  const [name, setName] = useState(item?.name ?? "");
  const [sku, setSku] = useState(item?.sku ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [unit, setUnit] = useState(item?.unit ?? "個");
  const [location, setLocation] = useState(item?.location ?? "");
  const [quantity, setQuantity] = useState(item?.quantity ?? 0);
  const [minQuantity, setMinQuantity] = useState(item?.minQuantity ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = !!item;

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim() || !sku.trim()) {
      setError("品名とSKUは必須です");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        sku: sku.trim(),
        category: category.trim(),
        unit: unit.trim() || "個",
        location: location.trim(),
        quantity: Number(quantity),
        minQuantity: Number(minQuantity),
      });
    } catch {
      setError("保存に失敗しました");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-base font-semibold">
          {isEdit ? "品目を編集" : "品目を追加"}
        </h2>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="品名 *" value={name} onChange={setName} />
          <Field label="SKU *" value={sku} onChange={setSku} />
          <Field label="カテゴリ" value={category} onChange={setCategory} />
          <Field label="保管場所" value={location} onChange={setLocation} />
          <Field label="単位" value={unit} onChange={setUnit} />
          <div />
          {!isEdit && (
            <NumField label="初期在庫" value={quantity} onChange={setQuantity} />
          )}
          <NumField label="発注点" value={minQuantity} onChange={setMinQuantity} />
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
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
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2"
      />
    </label>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-slate-300 px-3 py-2"
      />
    </label>
  );
}
