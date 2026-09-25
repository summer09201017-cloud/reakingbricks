# CLAUDE.md

## 專案概覽

這是一個純靜態的打磚塊 Canvas 遊戲，可直接部署到 GitHub Pages、Netlify 或其他靜態網站服務。專案不需要建置流程，也沒有 npm 套件依賴。

主要功能包含：

- 桌機與手機觸控操作
- PWA 安裝與新版更新提示
- 最高分、每日最高分、成就與偏好設定，使用 `localStorage` 儲存
- 直向與橫向兩套版面（手機直握單手可玩，設定可鎖回固定橫向）
- 板子長度五段可選（極短～超長），難度與板長各自獨立，遊戲中可即時調整
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
- Boss 會往下砸落石（有紅色預告線）；標準與挑戰難度的磚塊會定時下移
- 卡關輔助、打擊感（震屏／頓幀，尊重 prefers-reduced-motion）
- 本機排行榜 Top 10、續玩存檔、關卡編輯器與分享碼
- 立體渲染（3D）：設定裡一個開關，把磚牆／板子／球換成立體方塊來畫，玩法與存檔完全不受影響

## 現況（2026-09-25）

**v2.6.0 / sw v25**（立體渲染 3D 模式；上一版 v2.5.0 / sw v24 是 09-17 的板子長度五段可選）。

- ✅ 已完成的改動與待做清單看 `roadmap.md`
- ✅ 接手要看的「怎麼跑、有什麼地雷、下一步」看 `讀我-HANDOFF.txt`
- 📋 **等使用者拍板、不要自行開工**：耶利哥城牆主題關卡包（會改變本站定位，理由寫在 roadmap）
- ⚠ 這個 repo 的正本現在在 `Downloads/hfpc-git/reakingbricks`（**純 ASCII 路徑**），
  不再是 `Desktop/codex打磚塊`。下面部署段那顆「非 ASCII cwd 會讓 wrangler 硬崩」的雷
  在這個路徑下踩不到了，但**「切到一個純 ASCII 空目錄再部署」的規矩仍然要照做** ——
  它擋的是另一顆：cwd 就是 assets 夾時，wrangler 會把含 Cloudflare 帳號 id 的
  `.wrangler/cache/wrangler-account.json` 寫進去並當成靜態資產公開。

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
  ★ `render()` 依 `preferences.render3d` 分兩條路：2D 完整照舊；3D 只留「不是實體方塊」的
  疊層（危險線／道具／子彈／護盾條／磚塊字／浮動分數／狀態列），實體部分交給 `render3d.js`。
- `render3d.js`：立體渲染（3D）模式的畫面層。**ES module**，只在玩家打開 3D 開關那一刻才用
  動態 `import()` 載入（2D 玩家不用多下載 Three.js；`game.js` 本身維持 classic script，
  `file://` 雙擊仍能開）。完全不碰遊戲規則，只認每幀一份純資料快照（座標／尺寸／顏色）。
- `vendor/three.module.js`：Three.js 的 ES module build，下載進 repo 的靜態檔案（沒有走 CDN、
  沒有 npm、沒有建置步驟）。改版要重新下載同一個 pin 住的版本，不要手改內容。
- `sw.js`：Service Worker 快取與更新流程；`ASSETS` 含 `render3d.js`／`vendor/three.module.js`，
  已安裝過的使用者離線時也能用 3D 模式。
- `manifest.webmanifest`：PWA 名稱、顏色與圖示設定。
- `netlify.toml`：Netlify 靜態部署與快取標頭。
- `icons/`：PWA 圖示。
- `test/patterns.mjs`：關卡圖案自我檢查（零相依）。
- `test/sharecode.mjs`：分享碼格式契約檢查（零相依）。
- `test/sharecard.mjs`：每日挑戰分享圖卡自我檢查（零相依，用假 ctx 驗「畫面上印了什麼字」）。
- `test/verify-browser.mjs`：真瀏覽器驗收（`playwright-core` + 系統 Edge／Chrome，可打本機或線上）。
  含直向可玩性與「玩到一半轉手機」的迴歸（磚塊／球／板子有沒有跑到畫面外、下壓進度有沒有被偷走）。
- `test/verify-browser-3d.mjs`：立體渲染模式的真瀏覽器驗收（另開一支，不跟上面那支混在一起）。
  含切換／resize／偏好持久化，以及**刻意模擬 render3d.js 載入失敗**要靜默退回 2D 的迴歸——
  ⚠ 模擬失敗時 context 要開 `serviceWorkers: "block"`，不要用 `page.route()` 攔 `sw.js` 的請求：
  Service Worker 一旦裝上，會用自己的 fetch 事件處理常式把已預先快取的 `render3d.js` 端出來，
  那條路徑不經過 `page.route()`，會讓「模擬載入失敗」的測試看起來像沒攔到（已踩過一次）。
- `roadmap.md`：待做清單與「刻意不做」的理由。
- `讀我-HANDOFF.txt`：給另一台機接手用的交接文件。

## 立體渲染（3D）模式的設計決定（2026-09-25）

使用者原話：「打磚塊，能做 3D 版嗎？」「（2D／3D）都是另開一支嗎？」「舊網站能 2D 與 2.5D 切換嗎？」
——最後拍板：**同一支 repo 裡加一個可切換的開關**，不是另開新站，理由與取捨都寫在這裡：

- **物理層完全不碰**：球／板子／磚塊的座標、碰撞、寶物、Boss、關卡編輯器、分享碼、存讀檔、
  排行榜——一行都沒動。3D 只是「換一顆鏡頭去看同一份 2D 座標」，不是另一個引擎，
  所以現有五千多行邏輯與既有測試（patterns／sharecode／sharecard／verify-browser）全部原封不動繼續有效。
- **兩塊 canvas 疊在一起**：`#gameCanvas3d`（新的 WebGL 畫布）在下面畫地板／磚塊／板子／球本體；
  `#gameCanvas`（原本的 2D 畫布）疊在上面，打開 3D 時背景變透明，只留危險線／道具／子彈／
  護盾條／磚塊耐打度數字／浮動分數／狀態列這些「不是實體方塊」的疊層。省下重做這些次要系統的成本，
  也讓兩個畫面共用同一組視覺語言。
- **Three.js 動態載入，不是靜態 `<script>` 標籤**：`game.js` 是 classic script（CLAUDE.md 說的
  「直接雙擊 index.html 就能玩」需要它不是 module，ES module 在 `file://` 下會被瀏覽器的 CORS
  擋掉）。所以 Three.js 與 `render3d.js` 都用動態 `import()`，只在玩家真的打開 3D 開關那一刻才載入：
  只玩 2D 的人不必多下載一份 Three.js，`file://` 使用者打開開關會載入失敗但**靜默退回 2D**
  （`ensureRender3dLoaded()` 的 `.catch()` 接住，把偏好值也一起改回 `false`，不會卡在半殘狀態）。
- **鏡頭角度是「固定俯角＋依尺寸重算距離」，不是每種長寬比各調一次**：用球場對角線的一半當半徑，
  算出「這個半徑在目前 FOV 下要多遠才完整塞進畫面」，寧可多留白也絕不裁到磚塊或板子。
  代價：直向手機（球場又瘦又長）因此被迫拉得比較遠，看起來偏向俯視；橫向（球場較扁）立體感明顯很多。
  這是刻意的取捨，不是 bug——之後想改善直向，思路是「依長寬比動態調整俯角」，目前先不做。
- **`preserveDrawingBuffer: true`**：WebGL 預設畫完那一幀就可以清掉緩衝區，畫面本身完全正常，
  但任何事後用 `drawImage`／`toDataURL` 讀這塊 canvas 的驗收腳本會讀到一片空白，
  誤判成「3D 什麼都沒畫出來」（這輪真的中過一次）。這顆場景很小，多這個成本可忽略。

## 本機執行

直接開啟 `index.html` 可以玩，但 PWA 安裝與 Service Worker 需要 HTTP/HTTPS 環境；
**立體渲染（3D）模式也需要**（`render3d.js` 是 ES module，`file://` 下 Chrome 的 CORS
會擋掉它，打開開關會自動退回 2D，不影響其他功能）。建議測試時使用：

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
node test/sharecode.mjs
node test/sharecard.mjs
```

改過 UI、按鈕或圖卡，再跑一次真瀏覽器驗收 —— 它會**實際點下去**，抓得到「按了沒反應」
這種語法檢查、單元測試甚至截圖都全綠也看不到的病（0915 dragtetris 實錘：一個半透明的
角落徽章蓋住按鈕右下角，目視完全看不出來）：

```powershell
python -m http.server 8931          # 另一個視窗
node test/verify-browser.mjs
node test/verify-browser-3d.mjs                                               # 改過立體渲染再跑這支
$env:BASE="https://bricksbreaking.pages.dev"; node test/verify-browser.mjs   # 打線上
$env:BASE="https://bricksbreaking.pages.dev"; node test/verify-browser-3d.mjs
$env:SHOT="1"; node test/verify-browser.mjs                                   # 順便存截圖
```

⚠ 第一次造訪時 `sw.js` 會 `clients.claim()`，頁面會自己 reload 一次；驗收腳本在每次導覽後
都要先安定（腳本裡的 `settle()`），否則 `page.evaluate` 會拿到「Execution context was
destroyed」，看起來像網站壞了，其實是正常的更新流程。

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
# ★ 必須「先切到一個純 ASCII 的『空』目錄」再跑，不可以在本 repo 目錄裡直接部署。
#   ─ 純 ASCII：擋掉下面那顆記憶體毀損崩潰
#   ─ 空目錄（不是 assets 夾本身）：擋掉另一顆 —— cwd 就是 assets 夾時，wrangler 會把
#     自己的 .wrangler/cache/wrangler-account.json（含 Cloudflare 帳號 id）寫進去，
#     並當成靜態資產一起公開（股票管家 0730 實測線上回 200）。
#   觸發條件是 **cwd 路徑含非 ASCII 字元**（本 repo 是 codex打磚塊，正好踩中），
#   跟「是不是 git repo」「commit message 長什麼樣」都無關（0915 兩輪對照實驗實測）。
#   `pages deploy` 與 Workers 的 `wrangler deploy` 兩種模式都中，連 --dry-run 也崩；
#   `--assets` 指向純 ASCII 目錄救不了（決定的是 cwd）。唯讀指令不受影響。
#   崩起來完全沒有訊息：只印橫幅，bash 給 exit 127、PowerShell 給 -1073740791
#   = 0xC0000409 STATUS_STACK_BUFFER_OVERRUN（原生層硬崩，try/catch 接不到），
#   而 WRANGLER_LOG=debug 顯示前面的 CF API 全回 200 ⇒ 非常難判讀。
#   ⚠ 「中文路徑但非 git」那組會「部署成功卻回崩潰碼」⇒ 別只看退出碼判成敗，
#     要看 `wrangler pages deployment list` 或線上指紋。
# ★ 部署目錄只放要上線的檔，不要整包根目錄（避免 .git / .wrangler 外洩）。
#   2026-09-25 加：render3d.js 與 vendor/（立體渲染模式）也要跟著複製，
#   漏了這兩個 CF Pages 那份打開 3D 開關會 404，Netlify 那份因為 publish 是整個根目錄不會漏。
$dist = Join-Path $env:TEMP "bricks-dist"   # 0916 修：原本寫成 "$env:TEMP\bricks-dist"，反斜線在某次補丁裡被吃掉，變成一個展不開的變數名
if (Test-Path $dist) { Remove-Item -Recurse -Force $dist }   # 上一次的殘留不要跟著上線
New-Item -ItemType Directory -Force $dist | Out-Null
Copy-Item index.html,game.js,render3d.js,styles.css,sw.js,manifest.webmanifest $dist
Copy-Item -Recurse -Force icons $dist
Copy-Item -Recurse -Force vendor $dist
# ⚠ 0916 二修:**wrangler 那一行的目錄要寫展開後的絕對路徑,不可以用變數**。
#   hook `zero-pii-guard` 讀的是「原始指令字串」,shell 還沒展開 ⇒ 它看到字面 "$dist",
#   掃不到目錄就 fail-closed 直接拒絕放行(訊息:「掃不到部署目錄,拒絕放行」)。
#   前面備料用變數沒問題,只有部署那一行要寫死。
Push-Location "C:\Users\<你的帳號>\AppData\Local\Temp"
npx wrangler pages deploy "C:\Users\<你的帳號>\AppData\Local\Temp\bricks-dist" --project-name bricksbreaking --branch main
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
- 自訂關卡在 `state.customRows`（ASCII 圖案）。分享碼格式由 `encodeLevelCode()` /
  `decodeLevelCode()` 決定：`B` + 列數 + 每兩格打包成一字 + 檢查碼，最長 43 字。
  **改格式就是改分享碼**，別人手上的舊碼會失效；真要改請換開頭字母以示區別。
  自訂關卡刻意不進排行榜、不寫最高分、不存續玩檔（規則不同，混在一起比沒有意義）；
  回設定頁時 `exitCustomLevel()` 一定要把它清掉，否則下一局還是同一張圖。
- 內建圖案與自訂關卡共用 `buildBricksFromRows()` 與 `getBrickLayout()`，
  版面幾何只有一份，兩邊才不會慢慢走鐘。
- 🖼 分享圖卡的 `drawShareCard()` 是**純繪圖函式**：只吃 ctx 與一包資料，不讀任何全域狀態，
  所以 `test/sharecard.mjs` 才能用一個假 ctx 驗它。**不要在裡面讀 `state` / `records`** ——
  一讀，那支測試就得搬半個遊戲進來，遲早會被放掉。資料一律從 `getDailyCardData()` 來，
  圖卡與分享文字共用同一份，兩邊才不會慢慢走鐘（同 `buildBricksFromRows()` 的理由）。
- 🖼 **誠實鐵則**：卡片上的日期、題號、分數必須是同一局的。舊版分享文字印的是
  `records.bestDailyScore`（歷來每日最高）卻配**今天**的日期 —— 昨天打的分數會被寫成
  今天的成績。現在成績存 `records.dailyToday`，`key` 不是今天就視同沒挑戰過，
  卡片改印「今天還沒挑戰」與一排「—」，**不可以印 0 分假裝玩過**
  （`test/sharecard.mjs` 有守這三條）。
- 每日挑戰使用日期、難度與固定字串產生 seed，同一天同難度會有一致的隨機序列。
  題號＝`hashString("日期:難度:breakout")` 的後六位，和 seed 用的是**同一條字串** ⇒
  「題號一樣＝盤面一樣」，老師報一個號全班就開同一局。改那條字串＝換掉所有人的題號。
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
  Boss 落石 `BOSS_*`、磚塊下壓 `getBrickRowPitch()` / `DESCEND_*` 與各難度的 `descendSec`。
- 📱 **直向與橫向是「同一份程式、兩組版面常數」**（`PORTRAIT_*`，0916）。規則：
  **短邊永遠是 560**，長邊由視窗長寬比推出來。為什麼非這樣不可：畫布是被 CSS
  拉滿整個視窗的（`width/height:100%`），邏輯長寬比一旦和真實視窗差太多，
  整個畫面就會被非等比拉扯壓扁 —— 這也正是舊版必須擋住直向的原因。
  - **要跟著縮的**：板寬（意義是「佔場地寬的幾分之幾」）、球／寶物／子彈／落石的
    速度（場地變高、飛行距離變長）、下壓間隔（直向可壓的格數多一倍）。
    入口一律是 `getPaddleBaseWidth()` / `getSpeedScale()` / `getDescendInterval()`，
    不要再在別處寫第二份換算。
  - **不用縮的**：球半徑、寶物大小這類絕對 px —— 兩個方向的邏輯px→CSSpx 比例本來就接近，
    在真手機上看起來一樣大。
  - ⚠ 板寬的 `clamp(…, 100, 260)` 已經換成 `getPaddleMinWidth()` / `getPaddleMaxWidth()`。
    直接寫回數字 = 直向的板子會被夾成半個螢幕寬。
- 🎚 **板子長度**（`PADDLE_SIZES`，0917）是乘在難度板寬上的倍率，和難度分開存
  （`preferences.paddleSize`）。板寬的唯一算式是
  `難度板寬 × 長度倍率 × getPaddleScale()` ＝ `getPaddleBaseWidth()`。
  - ⚠ **上下限必須跟著倍率走**：下限若寫死 100，標準難度選「極短」（136×0.7=95.2）
    會被悄悄夾回去 —— 選單有反應、板子沒變短，而語法檢查與單元測試全綠。
    上限則要再留一步 `PADDLE_EXPAND_STEP`，否則休閒×超長（164×1.6=262>260）
    會讓加寬寶物與卡關輔助變成「吃了沒反應」的道具。兩條都有
    `test/patterns.mjs` 守著（它把這幾支函式從 `game.js` 原地挖出來跑）。
  - 遊戲中改板長走的是 `updatePaddleSizePreference()` → `rescaleWorld()`，
    與「玩到一半轉手機」同一條路：用新舊 base 的比值去縮，
    `state.assistWidthBonus` 一起等比例帶過去，不會把玩家吃到的加寬算錯。
  - 排行榜（`topScores[].paddle`）與每日成績（`records.dailyToday.paddle`）都記下
    **當時**的板長。★ 舊紀錄沒有這個欄位時，圖卡上**不要**用做卡當下的設定去標，
    那是另一種說謊的數字（同 `records.dailyToday` 那條誠實鐵則）。
- 📱 **改了版面就要能「搬場面」**：`resizeCanvasForScreen()` 換完尺寸一定要呼叫
  `rescaleWorld()`，它會 `relayoutBricks()`（照 row/col 重排，不是等比例縮 ——
  磚塊是格狀的，縮過去會和新版面的邊距對不齊）並把球／板／寶物／落石搬到新座標系。
  下壓的位移靠 `state.descendRows` 帶過去，**不要改成從 y 反推**：反推會在
  換算誤差裡慢慢漂，而且轉一次手機就等於送玩家一個免費重置。
- 📱 續玩存檔（`RUN_SAVE_VERSION` 4 起）帶了 `cw` / `ch` / `pt` / `pb`＝**存的時候是什麼版面**。
  還原時 `restoreRun()` 把它放進 `pendingRestoreLayout`，由下一次 `resizeCanvasForScreen()`
  換算座標。所以 `restoreRun()` 裡的板寬**故意不夾上下限**（那時的數字還是舊版面的單位）。
- 新增「會留在場上的東西」（落石那類）時，記得在**掉命／過關／重開整局三處都清乾淨**，
  否則會變成帶進下一關的隱形傷害。同理，新的計時器三處都要歸零。
- 會扣命的環境傷害（磚塊壓境那類）一定要附「推回去」的補償，
  否則復活後仍在致命位置，會變成復活即死、一次吃光所有命。
