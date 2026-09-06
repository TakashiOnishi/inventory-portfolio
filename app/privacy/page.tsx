import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | Inventory Manager",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-6 text-sm leading-relaxed">
      <h1 className="mb-6 text-xl font-semibold">プライバシーポリシー</h1>

      <p className="mb-6 text-text-muted">
        本ページは、在庫管理アプリ「Inventory Manager」（以下「本サービス」）における
        個人情報の取り扱いについて説明するものです。本サービスは個人が制作したポートフォリオ用の
        デモアプリであり、実在の企業・団体が運営するものではありません。
      </p>

      <Section title="1. 運営者・お問い合わせ先">
        <p>
          本サービスは大西貴士（個人）が制作・運営しています。本ポリシーに関するお問い合わせ、
          データの削除依頼等は下記メールアドレスまでご連絡ください。
        </p>
        <p className="mt-2 font-medium">dvlsgaogvdb@gmail.com</p>
      </Section>

      <Section title="2. 取得する情報">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Googleアカウントによるログイン時に、Firebase Authentication経由で
            氏名・メールアドレス・プロフィール画像URLを取得します
          </li>
          <li>
            本サービス内で入力された情報（品目の名称・SKU・在庫数・入出庫理由等）
          </li>
        </ul>
      </Section>

      <Section title="3. 利用目的">
        <p>
          取得した情報は、本サービスの機能（品目管理・入出庫記録の提供）を提供する目的にのみ
          使用します。広告配信、マーケティング、第三者への販売・提供は一切行いません。
        </p>
      </Section>

      <Section title="4. 共有デモである旨の重要な注意事項">
        <p>
          本サービスはポートフォリオ用の公開デモであり、通常の業務システムとは異なり
          <strong className="font-semibold">
            ログインした利用者ごとにデータが分離されていません
          </strong>
          。「小規模チームで共有する台帳」という設計のため、ログインした利用者は
          <strong className="font-semibold">
            誰でも全品目の編集・削除、入出庫記録の閲覧
          </strong>
          が可能です。入出庫履歴にはご自身の氏名が記録され、他の利用者にも表示されます。
          機密情報や実名を伏せたい情報は入力しないようお願いします。
        </p>
      </Section>

      <Section title="5. 委託先（データの処理を委託しているサービス）">
        <ul className="list-disc space-y-1 pl-5">
          <li>Google LLC（Firebase Authentication／Cloud Firestore・データの保存基盤）</li>
          <li>Vercel Inc.（アプリケーションのホスティング）</li>
        </ul>
        <p className="mt-2">
          いずれも本サービスの機能提供に必要な範囲でのみ利用しており、上記以外の第三者への
          提供は行いません。
        </p>
      </Section>

      <Section title="6. 保存期間・データの削除">
        <p>
          本サービスはデモ用途のため、予告なくすべてのデータをリセットする場合があります。
          ご自身のデータの削除をご希望の場合は、上記お問い合わせ先までご連絡ください。
        </p>
      </Section>

      <Section title="7. EU（GDPR）在住のユーザーの方へ">
        <p>
          本サービスはEU域内からもアクセス可能です。EU一般データ保護規則（GDPR）が定める
          データ主体の権利（アクセス・訂正・削除・処理制限等）に関するご請求は、上記お問い合わせ先で
          承ります。
        </p>
      </Section>

      <Section title="8. Cookie・ローカルストレージについて">
        <p>
          Firebase Authenticationがログイン状態を維持するため、ブラウザにトークン情報を保存します。
          広告目的のトラッキングは行っていません。
        </p>
      </Section>

      <Section title="9. 改定について">
        <p>本ポリシーは予告なく改定する場合があります。最終更新日: 2026年9月7日</p>
      </Section>

      <p className="mt-8 text-xs text-text-subtle">
        本ページは個人開発者による誠実な情報開示を目的としたものであり、弁護士によるレビューを
        受けた法的文書ではありません。
      </p>

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
