# CLAUDE.md

## 專案概覽

這是一個純靜態的打磚塊 Canvas 遊戲，可直接部署到 GitHub Pages、Netlify 或其他靜態網站服務。專案不需要建置流程，也沒有 npm 套件依賴。

主要功能包含：

- 桌機與手機觸控操作
- PWA 安裝與新版更新提示
- 最高分、每日最高分、成就與偏好設定，使用 `localStorage` 儲存
- 經典模式與每日挑戰模式
- 休閒、標準、挑戰三種難度
- 經典立體、霓虹、糖果、石磚四種主題
- 暫停選單、音樂/音效/震動開關
- 版本號與更新內容面板
- 快速重開倒數
- Combo 連擊加分
- 關卡進度與剩餘磚塊提示
- 寶物系統，每種寶物整場最多掉落 2 次
- 特殊磚塊：爆破磚、鋼鐵磚、移動磚

## 回應與協作規則

- 所有回應請使用繁體中文。
- 修改程式前先檢查目前 Git 狀態，避免覆蓋使用者尚未提交的變更。
- 優先保持純靜態架構，不要引入 npm、框架或後端，除非使用者明確要求。
- 新功能應同時考慮桌機與手機操作。
- 若修改會影響 PWA 快取，請同步更新 `sw.js` 的 `CACHE_NAME`。
- 若新增玩家可見功能，請同步更新 `README.md` 的功能清單。

## 重要檔案

- `index.html`：頁面結構、HUD、設定列、遊戲畫布、手機按鈕、資訊面板。
- `styles.css`：響應式版面、遊戲外層 UI、面板與按鈕樣式。
- `game.js`：所有遊戲狀態、繪製、物理、寶物、成就、統計、PWA 更新提示。
- `sw.js`：Service Worker 快取與更新流程。
- `manifest.webmanifest`：PWA 名稱、顏色與圖示設定。
- `netlify.toml`：Netlify 靜態部署與快取標頭。
- `icons/`：PWA 圖示。

## 本機執行

直接開啟 `index.html` 可以玩，但 PWA 安裝與 Service Worker 需要 HTTP/HTTPS 環境。建議測試時使用：

```powershell
python -m http.server 8080
```

然後開啟：

```text
http://localhost:8080
```

## 驗證方式

修改 JavaScript 後至少執行：

```powershell
node --check game.js
node --check sw.js
```

若修改 `manifest.webmanifest`，可執行：

```powershell
Get-Content manifest.webmanifest -Raw | ConvertFrom-Json | Select-Object -ExpandProperty name
```

若要確認靜態檔案能被本機伺服器提供，可用 `python -m http.server` 後檢查 `index.html`、`game.js`、`sw.js`。

## 部署

目前 GitHub remote：

```text
https://github.com/summer09201017-cloud/reakingbricks.git
```

Netlify 設定已在 `netlify.toml`。部署時：

- Build command 留空
- Publish directory 使用 `.`

## 維護提醒

- `game.js` 已是大型單檔。若繼續新增功能，建議優先拆成 `state.js`、`render.js`、`audio.js`、`storage.js`、`pwa.js` 等模組。
- `localStorage` 紀錄只存在目前瀏覽器與裝置。若要跨裝置排行榜，需要另接後端或 Netlify Functions。
- 寶物掉落次數由 `POWERUP_LIMIT_PER_TYPE` 控制。
- 目前版本號由 `APP_VERSION` 控制，更新內容由 `CHANGELOG` 控制。
- 主題設定由 `THEMES` 控制，Canvas 內磚塊使用高光與陰影模擬 3D 厚度。
- 每日挑戰使用日期、難度與固定字串產生 seed，同一天同難度會有一致的隨機序列。
