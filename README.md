keio-sop-coach
================

慶應の派遣交換留学（学部生）志望動機書（日本語、約800字）を、選考観点①〜⑥と「過去→現在→未来」構成の両面からローカルで分析・可視化する PWA Web アプリです。外部 API 不使用、ブラウザ内で動作します。

技術スタック
- Next.js 14（App Router）+ TypeScript
- Tailwind CSS + shadcn風 UI（最小実装）+ lucide-react
- 状態管理: Zustand
- 形態素解析: kuromoji（辞書は postinstall で /public/kuromoji/dict にコピー）
- ビルド/実行: Node.js 20
- テスト: Vitest + Testing Library + Playwright（最小E2E）
- PWA: manifest.webmanifest + シンプル Service Worker（オフラインキャッシュ）

セットアップ
1. Node 20 を用意
2. 依存インストール

   pnpm install  # または npm install / yarn

   postinstall で node_modules/kuromoji/dict を public/kuromoji/dict にコピーします。

3. 開発サーバー起動

   pnpm dev

4. ビルド/実行（サーバーモード）

   pnpm build && pnpm start

5. 静的サイトとしてエクスポート（URL配信しやすい）

   pnpm build:static   # Next.js 14 では output: export により build だけで out/ が生成されます
   pnpm serve:out      # http://localhost:8080 で配信（LAN内から IP:8080 でもOK）

6. テスト

   pnpm test        # ユニット
   pnpm test:e2e    # E2E（別ターミナルで pnpm dev を起動してから）

使い方
- 上部で「テーゼ（主張）1文」を入力（必須）。
- 左側エディタで「過去」「現在」「未来」をそれぞれ入力。文字数/配分バーで 760〜840 字に近づける。
- 右側に①〜⑥ヒートマップ、根拠スパン一覧、整合性/固有名詞テーブルを表示。根拠をクリックするとエディタ内が選択ハイライトされます。
- 下部から .txt と .pdf エクスポート。ドラフトは LocalStorage に保存可能。

実装メモ（MVP）
- 文体チェック: 敬体/常体の混在、60字超の長文検知、語の反復率、漢字率を表示。
- ヒューリスティクス: 各観点のキーワード出現頻度から 0〜4 スコア。根拠スパンは本文内の該当箇所を抽出。
- 整合性チェック: 目的/計画/志望先/帰国後の4要素の有無、年度や語学スコアの重複・矛盾を簡易検出。固有名詞/数値は正規表現ベースで抽出。
- 代筆は行わず、入力文の分析・可視化のみを提供します。

フォルダ構成（主要）
- app/ ページ/レイアウト（App Router）
- components/ UI と機能コンポーネント
- domain/types.ts データモデル
- lib/ 解析ロジック・ユーティリティ
- store/ Zustand ストア
- public/ PWA とアイコン、kuromoji 辞書（postinstallでコピー）
- scripts/ ビルド時スクリプト

公開（URL で開けるようにする）
- ローカル/LAN で配信: 上記の `pnpm serve:out` を使うと、同一ネットワークの別端末から `http://<あなたのIP>:8080` でアクセス可能。
- Vercel で公開: リポジトリを連携し、Framework=Next.js、Build Command=`pnpm build:static`、Output Dir=`out` を指定。
- Netlify/Cloudflare Pages/S3+CloudFront 等でも、ビルド後の `out/` を静的ホスティングにアップロードすれば公開可能。

制約と注意
- kuromoji の辞書（数MB）を public/kuromoji/dict に配置できない場合、形態素解析に失敗し反復率が 0 になります。pnpm install 実行で自動コピーされます。
- PDF 生成は簡易レイアウト（html2canvas + jsPDF）です。長文は複数ページに自動分割されないため、A4 1ページに収まるように調整してください（MVP）。
- PWA のキャッシュは簡易実装です。開発中はキャッシュを削除/更新するため、一度 SW を Unregister することを推奨します。
