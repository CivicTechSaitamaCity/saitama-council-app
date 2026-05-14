# Saitama Council App

## 概要
埼玉県議会の活動を市民にわかりやすく伝えるためのアプリケーションです。このアプリは、議員情報、会派情報、議題、解決策、トピック検索などを提供し、市民が議会活動をより深く理解し、参加できるよう支援します。

## 主な機能
- **議員リスト**: 埼玉県議会の議員情報を一覧表示。
- **議員プロフィール**: 各議員の詳細情報を表示。
- **会派リスト**: 議会内の会派情報を表示。
- **議題リスト**: 現在議論されている議題を表示。
- **解決策リスト**: 提案された解決策を表示。
- **トピック検索**: 特定のトピックに関連する情報を検索。

## 技術スタック
- **フロントエンド**: React + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS

## ディレクトリ構成
```
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
vite.config.ts
public/
src/
  main.tsx
  style.css
  components/
    CouncilorList.tsx
    CouncilorProfile.tsx
    FactionList.tsx
    IssueList.tsx
    SolutionList.tsx
    TopicSearch.tsx
    ui/
      badge.tsx
      button.tsx
      card.tsx
      input.tsx
      separator.tsx
  lib/
    data.ts
  types/
    index.ts
```

## 開発方法
1. リポジトリをクローンします。
   ```bash
   git clone <リポジトリURL>
   ```
2. 必要な依存関係をインストールします。
   ```bash
   npm install
   ```
3. 開発サーバーを起動します。
   ```bash
   npm run dev
   ```
4. ブラウザで `http://localhost:3000` を開き、アプリを確認します。

## 貢献方法
1. Issue を確認し、取り組みたいタスクを選択してください。
2. 新しいブランチを作成します。
   ```bash
   git checkout -b <ブランチ名>
   ```
3. コードを変更し、コミットします。
   ```bash
   git commit -m "変更内容を記述"
   ```
4. プルリクエストを作成します。

## ライセンス
このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています。