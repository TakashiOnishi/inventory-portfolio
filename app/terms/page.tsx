import Link from "next/link";

export const metadata = {
  title: "利用規約 | Inventory Manager",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-6 text-sm leading-relaxed">
      <h1 className="mb-6 text-xl font-semibold">利用規約</h1>

      <p className="mb-6 text-text-muted">
        本規約は、在庫管理アプリ「Inventory Manager」（以下「本サービス」）の利用条件を
        定めるものです。本サービスは個人が制作したポートフォリオ用のデモアプリです。
      </p>

      <Section title="1. 本サービスの性質">
        <p>
          本サービスは実際の業務での利用を想定した製品ではなく、技術デモンストレーションを
          目的として公開しています。実在の在庫・資産の管理には使用しないでください。
        </p>
      </Section>

      <Section title="2. 禁止事項">
        <ul className="list-disc space-y-1 pl-5">
          <li>本サービスのサーバー・データベースに過度な負荷をかける行為</li>
          <li>他の利用者のデータを不必要に改変・削除する行為</li>
          <li>他の利用者になりすます行為、誹謗中傷等不適切な内容の入力</li>
          <li>本サービスの脆弱性を悪用する行為</li>
          <li>法令に違反する行為</li>
        </ul>
      </Section>

      <Section title="3. データの取り扱い">
        <p>
          詳細は
          <Link href="/privacy" className="text-brand underline">
            プライバシーポリシー
          </Link>
          をご確認ください。本サービスは全ログイン利用者が品目データを共有・編集できる設計であり、
          予告なくデータをリセットする場合があります。
        </p>
      </Section>

      <Section title="4. 免責事項">
        <p>
          本サービスは現状有姿で提供され、動作の完全性・継続性についていかなる保証も行いません。
          本サービスの利用により生じた損害について、運営者は責任を負いません。
        </p>
      </Section>

      <Section title="5. サービスの変更・停止">
        <p>
          運営者は、予告なく本サービスの内容変更・提供停止を行うことがあります。
        </p>
      </Section>

      <Section title="6. 準拠法">
        <p>本規約は日本法に準拠します。最終更新日: 2026年9月7日</p>
      </Section>

      <Link href="/" className="mt-8 inline-block text-brand underline">
        ← トップに戻る
      </Link>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 font-semibold">{title}</h2>
      <div className="text-text-muted">{children}</div>
    </section>
  );
}
