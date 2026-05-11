# 打磚塊

這是一個可在桌機與手機瀏覽器執行的打磚塊遊戲，支援 PWA 安裝。

## 功能

- 最高分、每日最高分與成就會儲存在瀏覽器 `localStorage`
- 支援經典模式、每日挑戰、休閒 / 標準 / 挑戰難度
- 有音樂、音效、震動開關與暫停選單
- 寶物包含雷射、板子變長、球變大、分裂球、球速變慢，每種整場最多掉落 2 次
- 特殊磚塊包含爆破磚、鋼鐵磚、移動磚
- PWA 可安裝到手機主畫面，並會提示新版更新

## 本機執行

直接開啟 `index.html` 可以遊玩。

如果要測試 PWA 安裝功能，請改用本機伺服器，例如：

```powershell
python -m http.server 8080
```

然後開啟 `http://localhost:8080`。

## 推上 GitHub

如果這個資料夾還沒有 Git 倉庫，可以在專案根目錄執行：

```powershell
git init -b main
git add .
git commit -m "Prepare breakout for GitHub and Netlify"
git remote add origin <你的 GitHub repo URL>
git push -u origin main
```

## 連接 Netlify

1. 到 Netlify 建立新站點並選擇你的 GitHub repo
2. `Build command` 留空
3. `Publish directory` 設為 `.`
4. 部署完成後即可用 Netlify 網址測試手機安裝功能

本專案已包含 `netlify.toml`，Netlify 會直接用根目錄作為靜態網站輸出。
