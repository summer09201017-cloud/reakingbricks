# 打磚塊

這是一個可在桌機與手機瀏覽器執行的打磚塊遊戲。專案是純靜態 `HTML + CSS + JavaScript`，不需要安裝套件或建置流程，已支援 PWA 安裝並可直接部署到 Netlify。

GitHub repo：

```text
https://github.com/summer09201017-cloud/reakingbricks.git
```

## 功能

- 支援桌機鍵盤、滑鼠，以及手機觸控操作
- 手機會先進入設定頁，開始後切換成全螢幕遊戲頁
- **直向、橫向都能玩**：直向可單手拇指操作，橫向畫面較寬；玩到一半轉手機會自動換版面，球與磚塊不會跑掉
- 設定頁的「畫面方向」可選「自動」（預設）或「固定橫向」；選固定橫向時，直向仍會提示旋轉
- **板子長度可自選**：極短／短／標準／長／超長五段，接不到球就調長（越長越容易），想更難就調短。難度與板長是兩個獨立設定，遊戲中也能隨時改，場上的板子會當場變長變短
- 非預設的板長會標在遊戲標題、排行榜與每日挑戰圖卡上（同一個分數在「超長板」與「極短板」下不是同一件事）
- 遊戲頁使用精簡 HUD 與暫停選單，可繼續、重開或回設定
- 音樂與音效可分別調整音量，最高可調到 150%
- 最高分、每日最高分、成就與設定會儲存在瀏覽器 `localStorage`
- 本機排行榜 Top 10，記錄分數、關卡、難度、模式與日期；結算會顯示名次或還差幾分進榜
- 續玩存檔：離開遊戲或關掉分頁時自動保存整個場面（磚塊、球、寶物、道具時間），回到設定頁可按「繼續上一局」接著玩；存檔保留三天，遊戲結束或開新局時自動清除
- 支援經典模式與每日挑戰模式
- 遊戲畫面有 ⛶ 手動全螢幕鈕（只在瀏覽器真的支援 Fullscreen API 時顯示）
- 關卡編輯器：用 10 欄 × 3～8 列的格子自己畫一關（一般磚／鋼鐵磚／爆破磚／移動磚），產生一串分享碼傳給別人，對方貼上就能玩同一張關卡；自訂關卡是一關定勝負，分數不列入排行榜與最高分（每張圖難度差異太大）
- 每一關使用不同的手繪圖案佈局：城牆、金字塔、拱門、十字、沙漏、棋盤、堡壘、愛心、雙塔、箭頭，每四關穿插一次 Boss 關
- 關卡倒數會顯示本關的圖案名稱
- 支援休閒、標準、挑戰三種難度
- 標準與挑戰難度的磚塊會定時整面下移，碰到畫面下方的紅色危險線會扣一命；休閒難度不下移
- 支援經典立體、霓虹、糖果、石磚四種主題
- 有音樂、音效、震動開關與暫停選單
- 有版本號與更新內容面板，會顯示本版發佈日期，更新內容依日期分批列出
- 有快速重開倒數
- 有 Combo 連擊加分，擊碎磚塊與連擊會震動畫面並短暫頓格
- 卡關輔助：同一關失誤兩次後自動加寬板子，過關後收回，可在設定中關閉
- 尊重系統的「減少動態」(prefers-reduced-motion) 設定，開啟時不震動畫面
- 寶物包含雷射、板子變長、球變大、分裂球、球速變慢、增加生命、護盾、磁鐵板、穿透球、分數加倍、吸寶物、炸彈球、慢動作與雙板
- 雷射會自動連發，分裂球新增 `x3` 與 `x4`
- 護盾會在底部擋下一次失誤，磁鐵板可黏球重新瞄準，吸寶物會把掉落寶物拉向板子
- 穿透球可打穿磚塊，炸彈球下一次撞磚會範圍爆破，慢動作會放慢場上物件
- 支援背景音樂曲目切換，包含快樂頌、卡農律動與放鬆節拍
- 遊戲畫面會顯示道具圖示與剩餘持續時間條
- 每日挑戰可以做成分享圖卡：一張 1080×1440 的 PNG，帶日期、題號、分數、評級、最高關、用掉球數、最大 Combo、破壞磚塊，以及那一關的磚塊圖案縮圖；可以直接分享、下載成 PNG，或只複製文字
- 每種寶物整場最多掉落 2 次
- 特殊磚塊包含爆破磚、鋼鐵磚、移動磚、分裂磚、加速磚、反彈磚與 Boss 大型磚
- Boss 會往下砸落石，落下前會先出現紅色預告線，護盾可以擋下一次
- 結算與暫停畫面會顯示評級、稱號、分數、最高分、最高關卡、破壞磚塊、寶物數、最大 Combo 與射擊命中率
- 遊戲畫面上方會顯示關卡進度與剩餘磚塊
- 支援 PWA 安裝到手機主畫面
- Service Worker 會提示新版更新
- 匿名使用計數涵蓋開啟、完賽與真實停留三層，零個資、離線自動略過

## 操作方式

桌機：

- 移動：`A` / `D` 或 `←` / `→`
- 發射 / 暫停：`Space` / `Enter`
- 滑鼠移動到畫布上會跟隨控制板子，點擊畫布可開始或繼續
- 雷射：拿到 `GUN` 後會自動連發，`J` / `F` / 滑鼠點擊也可手動補射
- 暫停：`P` / `Esc`
- 快速重開倒數：`R`

手機：

- 在設定頁選擇模式、難度與主題後按「開始遊玩」
- 直握或橫握都可以：直向單手好按，橫向畫面寬、磚牆較扁
- 直向時板子上方會留一塊拇指區，手指不會擋住板子
- 在畫布任意位置左右拖曳可相對移動板子，手指不用精準壓在板子上
- 使用右上方按鈕暫停、射擊、打開設定（板子長度／音效／音量）或回首頁
- 拿到 `GUN` 寶物後雷射會自動發射，也可點擊射擊按鈕補射

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
├── test/patterns.mjs       # 關卡圖案自我檢查(零相依)
├── test/sharecode.mjs      # 分享碼格式契約檢查(零相依)
├── test/sharecard.mjs      # 每日挑戰分享圖卡自我檢查(零相依,假 ctx)
├── test/verify-browser.mjs # 真瀏覽器驗收(playwright-core + 系統 Edge/Chrome)
├── roadmap.md              # 待做清單與刻意不做的理由
├── 讀我-HANDOFF.txt        # 換機接手用的交接文件
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
node test/patterns.mjs
node test/sharecode.mjs
node test/sharecard.mjs
```

真瀏覽器驗收（改過 UI／圖卡之後跑，需要 `playwright-core` 與系統 Edge／Chrome）：

```powershell
python -m http.server 8931          # 另一個視窗
node test/verify-browser.mjs
$env:BASE="https://bricksbreaking.pages.dev"; node test/verify-browser.mjs   # 打線上
$env:SHOT="1"; node test/verify-browser.mjs                                   # 順便存截圖
```

`test/patterns.mjs` 會直接從 `game.js` 讀出關卡圖案，檢查每列寬度、圖例是否合法、
有沒有「整張空」的圖案（會導致一開場就過關、無限跳關），以及圖案會不會長到底板附近。
它不檢查圖形長得對不對——那要開瀏覽器逐關看畫面。

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
- 分享圖卡上的日期、題號與分數必須是同一局的：成績存在 `records.dailyToday`，`key` 不是今天就視同沒挑戰過。不可以改回用歷來最高分 `bestDailyScore` 去配今天的日期。
- `localStorage` 紀錄只存在同一個瀏覽器與裝置，清除網站資料後會消失。
- `game.js` 已經偏大，下一階段若繼續擴充，建議拆分成多個模組。
- 若要加入線上排行榜，可以考慮 Netlify Functions 加上外部資料庫。

## 現況(2026-09-14)

- 🩹 拔掉「index.html 進 SW 快取 / start_url」地雷(3D-Chess 幻影版同日實錘「裝成 App 打開 ERR_FAILED」:Pages/Workers 把 /index.html 308 到 /,快取存到轉址過的回應,導覽拿到就被瀏覽器拒絕):manifest start_url ./index.html → ./(id 明寫舊值保住 App 身分)、SW 名單拔 index.html、離線退路改 ./、addAll → 逐一 add+catch、CACHE 版號 +1。用 skills repo static-pwa-ship/patches/patch-sw-index.mjs 打的;規矩見該 skill 鐵則。已裝的 App 第一次開若失敗,用瀏覽器開一次首頁或移除重裝。
