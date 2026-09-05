// Firestore データアクセス層（品目・入出庫履歴）

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Item, ItemInput, StockMovement, MovementType } from "./types";
import { applyMovement } from "./stock";

const ITEMS = "items";
const MOVEMENTS = "movements";

/** 品目を全件取得（名前順） */
export async function fetchItems(): Promise<Item[]> {
  const snap = await getDocs(collection(db, ITEMS));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Item, "id">) }))
    .sort((a, b) => a.name.localeCompare(b.name, "ja"));
}

/** 品目を新規作成 */
export async function createItem(input: ItemInput): Promise<string> {
  const ref = await addDoc(collection(db, ITEMS), {
    ...input,
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

/** 品目のマスタ情報を更新（在庫数は入出庫経由でのみ変更する想定） */
export async function updateItem(
  id: string,
  patch: Partial<Omit<Item, "id" | "quantity" | "updatedAt">>,
): Promise<void> {
  await updateDoc(doc(db, ITEMS, id), { ...patch, updatedAt: Timestamp.now() });
}

/** 品目を削除 */
export async function deleteItem(id: string): Promise<void> {
  await deleteDoc(doc(db, ITEMS, id));
}

/**
 * 入出庫・棚卸を適用する。品目の quantity 更新と履歴追加をトランザクションで原子的に行う。
 * 在庫割れ等は applyMovement が投げる（呼び出し側でハンドリング）。
 */
export async function applyStockMovement(params: {
  itemId: string;
  type: MovementType;
  amount: number;
  reason: string;
  userId: string;
  userName: string;
}): Promise<void> {
  const itemRef = doc(db, ITEMS, params.itemId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(itemRef);
    if (!snap.exists()) throw new Error("ITEM_NOT_FOUND");
    const current = (snap.data() as Item).quantity;
    const { quantity, delta } = applyMovement(current, params.type, params.amount);

    tx.update(itemRef, { quantity, updatedAt: Timestamp.now() });
    const movRef = doc(collection(db, MOVEMENTS));
    tx.set(movRef, {
      itemId: params.itemId,
      type: params.type,
      delta,
      resultingQuantity: quantity,
      reason: params.reason,
      userId: params.userId,
      userName: params.userName,
      createdAt: Timestamp.now(),
    });
  });
}

/** 指定品目の入出庫履歴を新しい順に取得 */
export async function fetchMovements(
  itemId: string,
  max = 50,
): Promise<StockMovement[]> {
  const q = query(
    collection(db, MOVEMENTS),
    where("itemId", "==", itemId),
    orderBy("createdAt", "desc"),
    limit(max),
  );
  const snap = await getDocs(q);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      itemId: data.itemId,
      type: data.type,
      delta: data.delta,
      resultingQuantity: data.resultingQuantity,
      reason: data.reason,
      userId: data.userId,
      userName: data.userName,
      createdAt: (data.createdAt as Timestamp)?.toMillis() ?? 0,
    };
  });
}

/** 単一品目取得（履歴画面用） */
export async function fetchItem(id: string): Promise<Item | null> {
  const snap = await getDoc(doc(db, ITEMS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Item, "id">) };
}
