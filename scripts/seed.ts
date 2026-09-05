// 汎用の在庫品目を Firestore に投入する seed スクリプト。
// firebase-admin を使うため、GOOGLE_APPLICATION_CREDENTIALS にサービスアカウント鍵を指定して実行する。
//   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json npm run seed

import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath) {
  console.error("GOOGLE_APPLICATION_CREDENTIALS が未設定です");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// 架空・汎用のサンプル品目（特定企業の資産ではない）
const items = [
  { name: "USB-C ケーブル 1m", sku: "CBL-USBC-1M", category: "ケーブル", quantity: 24, minQuantity: 10, unit: "本", location: "倉庫A-1" },
  { name: "ワイヤレスマウス", sku: "ACC-MOUSE-01", category: "周辺機器", quantity: 6, minQuantity: 8, unit: "個", location: "倉庫A-2" },
  { name: "USBハブ 4ポート", sku: "ACC-HUB-4P", category: "周辺機器", quantity: 15, minQuantity: 5, unit: "個", location: "倉庫A-2" },
  { name: "HDMIケーブル 2m", sku: "CBL-HDMI-2M", category: "ケーブル", quantity: 3, minQuantity: 6, unit: "本", location: "倉庫A-1" },
  { name: "ノートPCスタンド", sku: "ACC-STAND-01", category: "什器", quantity: 12, minQuantity: 4, unit: "個", location: "倉庫B-1" },
  { name: "電源タップ 6口", sku: "PWR-TAP-6", category: "電源", quantity: 9, minQuantity: 5, unit: "個", location: "倉庫B-2" },
];

async function main() {
  const col = db.collection("items");
  for (const it of items) {
    await col.add({ ...it, updatedAt: Timestamp.now() });
    console.log(`added: ${it.name}`);
  }
  console.log(`\n${items.length} items seeded.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
