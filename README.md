# 日本株ドリル | NIHONKABU DRILL

東証上場銘柄の知識を試すクイズアプリ

## デプロイ手順（Vercel）

### 方法A: GitHubから自動デプロイ（推奨）

1. このフォルダを新しいGitHubリポジトリにpush
   ```bash
   cd nihonkabu-drill-deploy
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nihonkabu-drill.git
   git push -u origin main
   ```

2. [vercel.com](https://vercel.com) にアクセスしてGitHubアカウントでログイン

3. 「Add New → Project」でリポジトリを選択

4. 設定はそのまま（Viteを自動検出します）で「Deploy」をクリック

5. デプロイ完了後、発行されたURLをスマホで開く

### 方法B: Vercel CLIで直接デプロイ

```bash
# Vercel CLIをインストール
npm i -g vercel

# プロジェクトディレクトリに移動
cd nihonkabu-drill-deploy

# 依存関係をインストール
npm install

# デプロイ
vercel

# 本番デプロイ
vercel --prod
```

## ローカルで確認

```bash
npm install
npm run dev
```

http://localhost:5173 でアクセスできます。

## 技術スタック

- React 18
- Vite 5
- html2canvas（結果画像生成）
- Web Share API（スマホ共有）
