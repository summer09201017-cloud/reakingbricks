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
- 每一關使用不同的手繪圖案佈局，每四關穿插 Boss 關

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
node test/patterns.mjs
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

### ⚠ 這個站有「兩份」線上副本，兩份都要推（0915 使用者拍板）

| 網址 | 平台 | 誰在用 | 怎麼上線 |
| --- | --- | --- | --- |
| `https://bricksbreaking.netlify.app` | Netlify | `sites.json`、艦隊掃描 | `git push` 自動部署 |
| `https://bricksbreaking.pages.dev` | Cloudflare Pages | **作品集 `hfpc-portfolio` 的卡片** | 手動 `wrangler pages deploy` |

0915 發現：作品集的卡片一直連 `pages.dev`，而這個 repo 只推 Netlify，
所以 CF 那份停在 v11（還帶著 0914 才修掉的「裝成 App 開啟 ERR_FAILED」地雷）
整整落後兩個 commit。**只推 Netlify 等於改給沒人看的那一份。**

Netlify 設定已在 `netlify.toml`（Build command 留空、Publish directory 用 `.`）。
Cloudflare Pages 那份要手動推：

```powershell
# ★ 必須「先切到非 git 目錄」再跑，不可以在本 repo 目錄裡直接部署。
#   wrangler 4.114 會去讀本 repo 的 git 資訊，遇到含 emoji 的多行 commit message
#   會在「開始上傳檔案」那一刻無聲崩潰（bash exit 127 / PowerShell exit 9，
#   只印橫幅、沒有任何錯誤訊息，而且前面的 CF API 都回 200，非常難判讀）。
# ★ 部署目錄只放要上線的 8 個檔，不要整包根目錄（避免 .git / .wrangler 外洩）。
$dist = "$env:TEMPricks-dist"
New-Item -ItemType Directory -Force $dist | Out-Null
Copy-Item index.html,game.js,styles.css,sw.js,manifest.webmanifest $dist
Copy-Item -Recurse -Force icons $dist
Push-Location $env:TEMP
npx wrangler pages deploy $dist --project-name bricksbreaking --branch main
Pop-Location
```

驗線上（`?b=` 破 CDN 快取；`/index.html` 會 308 轉到 `/`，用 `curl -L`）：

```powershell
curl.exe -s "https://bricksbreaking.pages.dev/sw.js?b=1"     | Select-String CACHE_NAME
curl.exe -s "https://bricksbreaking.netlify.app/sw.js?b=1"   | Select-String CACHE_NAME
```

## 維護提醒

- `game.js` 已是大型單檔。若繼續新增功能，建議優先拆成 `state.js`、`render.js`、`audio.js`、`storage.js`、`pwa.js` 等模組。
- `localStorage` 紀錄只存在目前瀏覽器與裝置。若要跨裝置排行榜，需要另接後端或 Netlify Functions。
- 寶物掉落次數由 `POWERUP_LIMIT_PER_TYPE` 控制。
- 目前版本號由 `APP_VERSION` 控制，更新內容由 `CHANGELOG` 控制。
  `CHANGELOG` 是 `{ date, items }` 陣列，**最新一批放最前面**；發佈日期 `APP_DATE`
  由 `CHANGELOG[0].date` 推導，不要另外寫死一份日期（會忘了同步改）。
  日期請填「改動真正進 git 的日期」，需要回溯可用 `git log -S "<某條更新文字>" -- game.js`。
- 主題設定由 `THEMES` 控制，Canvas 內磚塊使用高光與陰影模擬 3D 厚度。
- 關卡佈局由 `LEVEL_PATTERNS` 控制（ASCII 圖案，`#` 磚、`.` 空、`S/B/M` 指定特殊磚）。
  改動圖案後務必跑 `node test/patterns.mjs`：整張空的圖案會讓 `checkLevelCleared()`
  一開場就過關，變成無限跳關，而語法檢查抓不到。
- 磚塊顏色由 `getBrickColor()` 決定：耐打度用「主題色調暗」表示，不再寫死紅色，
  否則高關卡所有磚塊同色，四個主題與關卡圖案都會看不出差別。
- 每日挑戰使用日期、難度與固定字串產生 seed，同一天同難度會有一致的隨機序列。
  續玩存檔會把 `seededRandom.getState()` 一起存，還原時 `setState()` 回去，
  否則續玩之後的關卡序列會跟別人不一樣，就不再是「全世界今天同一局」。
- 續玩存檔在 `STORAGE_KEYS.run`，schema 版本是 `RUN_SAVE_VERSION`。
  **改過 brick / ball / powerup 任何欄位就要把版本 +1**：舊存檔還原出來會是壞場面，
  寧可丟掉重來。存檔在掉命／過關／離開遊戲頁／`pagehide` 四處觸發，
  在遊戲結束與按「開始遊玩」時清除。
  ⚠ 因此 `random()` **只能在遊戲邏輯裡呼叫，絕不可在 `render()` 裡用** ——
  畫面多震一幀就會偷走一個亂數，讓同一天同一關的磚塊配置跟著幀數變（0915 實錘）。
  純視覺的隨機（震屏抖動那類）一律用 `Math.random()`。
- 難度手感的旋鈕：卡關輔助 `ASSIST_*`、打擊感 `SHAKE_*` / `HITSTOP_MAX`、
  Boss 落石 `BOSS_*`、磚塊下壓 `BRICK_ROW_PITCH` / `DESCEND_*` 與各難度的 `descendSec`。
- 新增「會留在場上的東西」（落石那類）時，記得在**掉命／過關／重開整局三處都清乾淨**，
  否則會變成帶進下一關的隱形傷害。同理，新的計時器三處都要歸零。
- 會扣命的環境傷害（磚塊壓境那類）一定要附「推回去」的補償，
  否則復活後仍在致命位置，會變成復活即死、一次吃光所有命。
