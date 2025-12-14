git add .
git commit -m "ここに作業内容を書く"
git push

2. GitHubに保存するとき（3ステップ）
作業が終わったら、必ずこの「3段階」で保存します。

Step 1: 荷造り（変更したファイルを箱に入れる）
Bash

git add .
※ 最後の . (ドット) を忘れずに！「全部」という意味です。

Step 2: 確定（箱にラベルを貼る）
Bash

git commit -m "ここに作業内容を書く"
例： git commit -m "ひき算ページを追加"

Step 3: 発送（GitHubに送る）
Bash

git push
※ エラーが出なければ保存完了です。