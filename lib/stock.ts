// 在庫増減の適用と低在庫判定（純関数・UI/DBに非依存）

import type { MovementType } from "./types";

/**
 * 入出庫・棚卸調整を現在庫に適用して、適用後の数量を返す。
 * - in:    quantity + |amount|
 * - out:   quantity - |amount|（在庫割れは不可 → エラー）
 * - adjust: quantity を amount（絶対値の目標値）に補正し、差分を delta とする用途
 *
 * out/in では amount は「動かす量（非負）」、adjust では amount は「補正後の目標在庫数」。
 * 戻り値は { quantity: 適用後在庫, delta: 履歴に残す増減量 }。
 */
export function applyMovement(
  current: number,
  type: MovementType,
  amount: number,
): { quantity: number; delta: number } {
  if (!Number.isFinite(amount)) {
    throw new Error("INVALID_AMOUNT");
  }
  switch (type) {
    case "in": {
      const a = Math.abs(amount);
      return { quantity: current + a, delta: a };
    }
    case "out": {
      const a = Math.abs(amount);
      if (a > current) throw new Error("INSUFFICIENT_STOCK");
      return { quantity: current - a, delta: -a };
    }
    case "adjust": {
      if (amount < 0) throw new Error("INVALID_AMOUNT");
      return { quantity: amount, delta: amount - current };
    }
  }
}

/** 発注点以下かどうか（低在庫アラート判定） */
export function isLowStock(quantity: number, minQuantity: number): boolean {
  return quantity <= minQuantity;
}
