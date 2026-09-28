# 歴史タイピング v2.5.1 — GitHub Pages公開用

このフォルダーは、そのまま一般的な静的Webホスティングへ配置できる完成済みデータです。ゲーム内容・画像・BGM・判定・召喚・カードバトル・保存処理はv2.5.1のままです。ゲーム本体からchatgpt.siteへの接続はありません。

## ファイル構成
- `index.html`：ゲームの入口
- `game.英数字.css`：画面デザイン
- `js/`：ゲームのJavaScript（実行順序を維持）
- `assets/`：人物・背景・敵の画像60点
- `manifest.json`：元HTMLのハッシュと配布ファイルの照合情報

CSS・JavaScript・画像には内容に応じた名前を付けています。更新後に古い画像や処理がキャッシュから混ざることを防ぎます。入口の `index.html` は変わりません。ビルド・インストール・APIキー・データベースは不要です。

## GitHub Pagesで無料公開する手順（先生のブラウザだけで操作可能）
1. GitHubへログインし、新しい **Public** リポジトリを作ります。例：`history-typing`。GitHub FreeのPagesは公開リポジトリで利用できます。ゲームのソース・画像も公開されます。
2. ダウンロードしたZIPを展開します。GitHubの **Add file → Upload files**（空のリポジトリでは「uploading an existing file」）から、展開した中身をアップロードし、**Commit changes** で保存します。ZIPそのものや外側のフォルダーをアップロードせず、リポジトリ直下に `index.html`、CSS、`js`、`assets` が並ぶようにしてください。フォルダーの階層は保持します。
3. リポジトリの **Settings → Pages** を開きます。
4. **Build and deployment → Source** を **Deploy from a branch** にします。
5. **Branch: main / フォルダー: /(root)** を選んで **Save**。
6. 公開処理が終わったら同じPages画面の **Visit site** を開きます。その実際のURLを児童に配布します。

URLの形式は `https://アカウント名.github.io/history-typing/` です。これは形式の説明であり、まだ発行されたURLではありません。アカウント名やリポジトリ名を変えず、この場所へ上書きすれば更新後も同じURLを使えます。独自ドメインの購入は不要です。

先生だけがGitHubアカウントを使って配置します。児童のアカウント作成やアプリのインストールは不要です。ページを開いてクリックすると音が有効になります。Chrome/Edge系・物理キーボードでの利用を想定しています。

## 学校で使う前に
別ドメインでも、学校のフィルタ設定次第ではブロックされることがあります。公開後は実際の児童端末でURLを確認し、必要なら学校・教育委員会の管理担当者に学習用URLの許可を依頼してください。ブロックされないことを保証するパッケージではありません。

学校・教育委員会が用意した静的Webサーバーにも同じファイル一式を配置できます。ルートだけでなく `/history-typing/` のようなサブフォルダー配置に対応しています。

## カード・ポイント・記録の引き継ぎ
保存は同じ端末・同じブラウザ・同じドメインのlocalStorageを使います。旧chatgpt.siteの記録は新ドメインへ自動では移りません。

1. 旧版を開ける端末・ブラウザで、**カード図鑑 → 記録をバックアップ**。JSONを保存します。
2. 新しいURLで、**カード図鑑 → 記録を読み込む**。保存したJSONを選び、**引き継ぐ**を押します。
3. カード枚数・ポイント・自己ベストを確認します。

カード枚数・自己ベストは現在とバックアップの良い方が残ります。ポイントと召喚・対戦記録はバックアップ時点の内容になるため、最新のバックアップを使用してください。通常のページ更新で記録を消す処理はありません。別端末への自動同期はありません。

児童のバックアップJSONを公開リポジトリへアップロードする必要はありません。初めて使う児童は新しい記録で始められます。

## 更新とQRコード
- 同じリポジトリの同じ公開場所へ、新版の `index.html`、CSS、`js`、`assets` を配置して公開します。まず新しい参照先ファイルも一緒にアップロードしてください。
- 今回のゲームを別名のリポジトリへ毎回作り直さなければ、URLを保てます。
- 公開後の実際のURLでQRコードを作ります。同じURLのままなら更新時のQR作り直しは不要です。
- 以前のchatgpt.site用QRコードは旧URLを指すため、新URL用のQRコードへ交換が必要です。
- 再読み込みして画面上部のバージョンを確認します。

## オフライン配布版
別途提供している `history-typing-v2.5.1.html` は、その1ファイルを開くだけで遊べるオフライン版として残しています。今回のWeb公開用ZIPとは別物です。画像内蔵のHTMLは約27MBなので、GitHubのブラウザアップロードにはこちらの分割済み公開用一式を使ってください。

## 出典・サービス仕様（2026-09-28確認）
- GitHub Pagesの概要・無料プラン：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- 公開元ブランチとフォルダー：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- ファイルアップロード：https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- localStorageの保存範囲：https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
