# 打磚塊

這是一個可在桌機與手機瀏覽器執行的打磚塊遊戲。專案是純靜態 `HTML + CSS + JavaScript`，不需要安裝套件或建置流程，已支援 PWA 安裝並可直接部署到 Netlify。

GitHub repo：

```text
https://github.com/summer09201017-cloud/reakingbricks.git
```

## 功能

- 支援桌機鍵盤、滑鼠，以及手機觸控操作
- 最高分、每日最高分、成就與設定會儲存在瀏覽器 `localStorage`
- 支援經典模式與每日挑戰模式
- 支援休閒、標準、挑戰三種難度
- 有音樂、音效、震動開關與暫停選單
- 寶物包含雷射、板子變長、球變大、分裂球、球速變慢
- 每種寶物整場最多掉落 2 次
- 特殊磚塊包含爆破磚、鋼鐵磚、移動磚
- 結算與暫停畫面會顯示分數、最高分、最高關卡、破壞磚塊、寶物數與射擊命中率
- 支援 PWA 安裝到手機主畫面
- Service Worker 會提示新版更新

## 操作方式

桌機：

- 移動：`A` / `D` 或 `←` / `→`
- 發射 / 暫停：`Space`
- 雷射開火：`J` / `F` / 滑鼠點擊
- 暫停：`P` / `Esc`

手機：

- 拖曳畫布可移動板子
- 使用下方左移、右移、開始 / 暫停、發射按鈕
- 拿到 `GUN` 寶物後可點擊畫布或按發射鍵開火

## 檔案結構

```text
.
├── index.html              # 頁面結構、HUD、設定列、遊戲畫布與資訊面板
├── styles.css              # 響應式 UI 與遊戲外層樣式
├── game.js                 # 遊戲邏輯、繪製、成就、紀錄、PWA 更新提示
├── sw.js                   # Service Worker 快取與更新流程
├── manifest.webmanifest    # PWA 設定
├── netlify.toml            # Netlify 部署與快取標頭
├── icons/                  # PWA 圖示
├── CLAUDE.md               # AI 協作者維護指南
└── README.md
```

## 本機執行

直接開啟 `index.html` 可以遊玩。

如果要測試 PWA 安裝功能、Service Worker 或更新提示，請改用本機伺服器：

```powershell
python -m http.server 8080
```

然後開啟：

```text
http://localhost:8080
```

## 驗證

修改 JavaScript 後建議執行：

```powershell
node --check game.js
node --check sw.js
```

檢查 PWA manifest：

```powershell
Get-Content manifest.webmanifest -Raw | ConvertFrom-Json | Select-Object -ExpandProperty name
```

檢查 Git 狀態：

```powershell
git status --short --branch
```

## 推上 GitHub

目前已設定的遠端倉庫：

```text
https://github.com/summer09201017-cloud/reakingbricks.git
```

提交並推送：

```powershell
git add .
git commit -m "Update documentation"
git push
```

## 連接 Netlify

1. 到 Netlify 建立新站點並選擇這個 GitHub repo
2. `Build command` 留空
3. `Publish directory` 設為 `.`
4. 部署完成後即可用 Netlify 網址測試手機安裝功能

本專案已包含 `netlify.toml`，Netlify 會直接用根目錄作為靜態網站輸出。

## 維護提醒

- 如果修改 `index.html`、`styles.css`、`game.js`、`manifest.webmanifest` 或圖示，建議同步更新 `sw.js` 的 `CACHE_NAME`，避免玩家卡在舊快取。
- `localStorage` 紀錄只存在同一個瀏覽器與裝置，清除網站資料後會消失。
- `game.js` 已經偏大，下一階段若繼續擴充，建議拆分成多個模組。
- 若要加入線上排行榜，可以考慮 Netlify Functions 加上外部資料庫。
