// ドメイン型定義（汎用の在庫管理）

/** 在庫品目 */
export interface Item {
  id: string;
  name: string;
  /** 管理コード（SKU） */
  sku: string;
  category: string;
  /** 現在在庫数 */
  quantity: number;
  /** 発注点（この数量以下で低在庫アラート） */
  minQuantity: number;
  /** 単位（個・箱 等） */
  unit: string;
  location: string;
  updatedAt: number;
}

/** 入出庫の種別 */
export type MovementType = "in" | "out" | "adjust";

/** 在庫の増減履歴 */
export interface StockMovement {
  id: string;
  itemId: string;
  type: MovementType;
  /** 変化量（in:正 / out:負 / adjust:差分） */
  delta: number;
  /** 適用後の在庫数（監査用スナップショット） */
  resultingQuantity: number;
  reason: string;
  userId: string;
  userName: string;
  createdAt: number;
}

export type ItemInput = Omit<Item, "id" | "updatedAt">;
