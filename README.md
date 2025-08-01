# BIBLIOMIX
a card game BIBLIOMIX playing AI

https://curionlab.github.io/BIBLIOMIX/

以下のいずれかの方法で、**ローカルWebサーバー**を立てて、そのURL（例: http://localhost:8000/）でアクセスしてください。

#### 例: Python（3.x）で簡易サーバー
1. ターミナル/PowerShellでBIBLIOMIXフォルダに移動
2. 下記コマンドを実行
   ```
   python -m http.server 8000
   ```
3. ブラウザで `http://localhost:8000/` を開く

#### 例: Node.js（http-serverパッケージ）
1. `npm install -g http-server`
2. BIBLIOMIXフォルダで
   ```
   http-server -p 8000
   ```
3. ブラウザで `http://localhost:8000/` を開く
