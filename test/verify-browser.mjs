// 真瀏覽器驗收（node test/verify-browser.mjs）。
//
// 為什麼要有這支：0915 那輪的 Playwright 腳本只活在暫存資料夾，換一台機就沒了
// （roadmap #4）。而圖卡這種東西，語法檢查、單元測試、甚至截圖都可能全綠，
// 卻在真瀏覽器裡「按下去沒反應」——例如被一個透明的角落元素偷走點擊（0915 dragtetris 實錘）。
//
// 用法：
//   python -m http.server 8931          # 另一個視窗（或任何靜態伺服器）
//   node test/verify-browser.mjs
//   BASE=https://bricksbreaking.pages.dev node test/verify-browser.mjs   # 打線上
//   SHOT=1 node test/verify-browser.mjs                                  # 順便存截圖
//
// 需要 playwright-core（本機已有）與系統 Edge／Chrome，不佔 Playwright MCP 的瀏覽器。
import { chromium } from "playwright-core";
import { existsSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:8931";
const SHOT_DIR = process.env.SHOT_DIR || "shots";
const CHANNELS = ["msedge", "chrome"];

let fail = 0;
const check = (ok, msg, extra) => {
  console.log((ok ? "  [ok]   " : "  [FAIL] ") + msg + (extra ? "  " + extra : ""));
  if (!ok) {
    fail += 1;
  }
};

async function launch() {
  let lastError = null;
  for (const channel of CHANNELS) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch (error) {
      lastError = error;
    }
  }
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    throw lastError || error;
  }
}

const browser = await launch();
// iPhone 直向：本系列的老師與孩子主要就是用手機開
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
// ⚠ 逾時要分開給：線上第一發冷請求常常超過預設值，混在一起會把「網路慢」讀成「網站壞了」
page.setDefaultTimeout(8000);
page.setDefaultNavigationTimeout(45000);

const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));

// ⚠ 第一次造訪時 sw.js 會 clients.claim() ⇒ controllerchange ⇒ 頁面自己 reload 一次。
//    evaluate 撞上那一下就會拿到 "Execution context was destroyed"（看起來像網站壞了，其實是正常更新流程）。
//    ⇒ 每次導覽後都先讓它安定下來。
async function settle() {
  await page.waitForLoadState("load");
  await page.waitForTimeout(1200);
  await page.waitForSelector("#shareDailyBtn");
}

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await settle();

// 先塞一筆「今天的每日成績」，卡片才驗得到有成績的那一張
const todayKey = await page.evaluate(() => {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const raw = window.localStorage.getItem("breakout.records.v2");
  const records = raw ? JSON.parse(raw) : {};
  records.dailyToday = { key, difficulty: "normal", score: 1420, level: 5, ballsUsed: 2, maxCombo: 18, bricks: 96 };
  window.localStorage.setItem("breakout.records.v2", JSON.stringify(records));
  return key;
});
await page.reload({ waitUntil: "domcontentloaded" });
await settle();

check(errors.length === 0, "開頁沒有 JS 例外", errors.join(" / "));

// ── 圖卡面板打得開 ──────────────────────────────────────────────────────────
check(await page.locator("#shareCardPanel").isHidden(), "一開始圖卡面板是收起來的");
await page.locator("#shareDailyBtn").click();
await page.waitForSelector("#shareCardPanel:not([hidden])");
check(await page.locator("#shareCardPanel").isVisible(), "按「每日挑戰圖卡」會打開面板");

// ── 卡片真的畫了東西（不是一張空白 canvas）────────────────────────────────────
const canvasInfo = await page.evaluate(() => {
  const canvas = document.getElementById("shareCardCanvas");
  const ctx = canvas.getContext("2d");
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const seen = new Set();
  let opaque = 0;
  for (let i = 0; i < data.length; i += 4 * 97) {
    if (data[i + 3] > 0) {
      opaque += 1;
    }
    seen.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
  }
  return { w: canvas.width, h: canvas.height, colors: seen.size, opaque };
});
check(canvasInfo.w === 1080 && canvasInfo.h === 1440, "卡片解析度是 1080×1440", `${canvasInfo.w}×${canvasInfo.h}`);
check(canvasInfo.opaque > 0, "卡片不是全透明");
check(canvasInfo.colors > 20, "卡片畫了不只一種顏色（不是空白底）", `${canvasInfo.colors} 色`);

// ── 三顆鈕都按得到、都夠大、而且沒有被別的元素蓋住 ─────────────────────────────
for (const id of ["shareCardShareBtn", "shareCardDownloadBtn", "shareCardCopyBtn", "shareCardCloseBtn"]) {
  const probe = await page.evaluate((buttonId) => {
    const el = document.getElementById(buttonId);
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    const at = (x, y) => {
      const hit = document.elementFromPoint(x, y);
      return hit === el || el.contains(hit);
    };
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      centerOwned: at(r.left + r.width / 2, r.top + r.height / 2),
      // 角落 fixed 元素（版號徽章那種）最常偷走的就是右下角
      cornerOwned: at(r.right - 3, r.bottom - 3),
    };
  }, id);
  check(probe.h >= 44, `${id} 觸控高度 ≥44px`, `${probe.w}×${probe.h}`);
  check(probe.centerOwned, `${id} 中心點按得到（沒有被蓋住）`);
  check(probe.cornerOwned, `${id} 右下角按得到（沒有被角落徽章偷走）`);
}

// ── 複製文字要跟卡片說同一件事 ───────────────────────────────────────────────
await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
await page.locator("#shareCardCopyBtn").click();
await page.waitForTimeout(300);
const status = await page.locator("#shareCardStatus").textContent();
check(Boolean(status && status.trim()), "按「複製文字」有給回饋", String(status).slice(0, 40));

const shareText = await page.evaluate(() => getDailyShareText());
check(shareText.includes(todayKey), "分享文字帶今天的日期", shareText.split("\n")[0]);
check(shareText.includes("1420"), "分享文字帶今天的成績（不是歷來最高）");
check(!/undefined|NaN/.test(shareText), "分享文字沒有 undefined / NaN");

// ── 直向提示與整頁不可以橫向溢出 ─────────────────────────────────────────────
const overflow = await page.evaluate(() => {
  const el = document.scrollingElement || document.documentElement;
  return { scrollW: el.scrollWidth, clientW: el.clientWidth };
});
check(overflow.scrollW <= overflow.clientW + 1, "手機直向沒有橫向捲動溢出", `${overflow.scrollW} vs ${overflow.clientW}`);

// ⚠ 圖卡截圖要在「面板還開著」的時候拍 —— 下面就會進遊戲畫面，那時 canvas 已經藏起來，
//   再去截圖只會拿到 "element is not visible" 的逾時（0916 自己踩過一次）。
if (process.env.SHOT) {
  if (!existsSync(SHOT_DIR)) {
    mkdirSync(SHOT_DIR, { recursive: true });
  }
  await page.locator("#shareCardCanvas").screenshot({ path: `${SHOT_DIR}/share-card.png` });
  await page.screenshot({ path: `${SHOT_DIR}/setup-portrait.png`, fullPage: false });
}

// ── 0916 手機體檢紅燈的迴歸項 ─────────────────────────────────────────────
await page.locator('#shareCardCloseBtn').click();
await page.waitForTimeout(200);

const manifest = await page.evaluate(async () => {
  const res = await fetch('manifest.webmanifest');
  return res.ok ? JSON.parse((await res.text()).replace(/^﻿/, '')) : null;
});
// 0916:直向也能玩之後就不可以再鎖 landscape —— 鎖了,裝成 App 的人連轉都轉不了。
check(manifest?.orientation === 'any', 'manifest 不鎖方向(直向橫向都能玩)', String(manifest?.orientation));

// 進遊戲畫面（0916 起直向是可以玩的版面，不再跳「請轉為橫向」）
await page.locator('#startBtn').click();
await page.waitForTimeout(700);

const fsBtn = await page.evaluate(() => {
  const el = document.getElementById('fullscreenBtn');
  if (!el) return { exists: false, hidden: true, w: 0, h: 0 };
  const r = el.getBoundingClientRect();
  return { exists: true, hidden: el.hidden, w: Math.round(r.width), h: Math.round(r.height) };
});
check(fsBtn.exists, '⛶ 手動全螢幕鈕在（自動那條被擋掉時的第二次機會）');
check(fsBtn.exists && !fsBtn.hidden, '支援全螢幕的瀏覽器上看得到 ⛶ 鈕', JSON.stringify(fsBtn));
check(fsBtn.h >= 44, '⛶ 鈕觸控高度 ≥44px', `${fsBtn.w}x${fsBtn.h}`);

const smallHud = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll('.game-actions button').forEach((b) => {
    if (b.hidden) return;
    const r = b.getBoundingClientRect();
    if (r.height < 44) bad.push(`${b.textContent.trim()}=${Math.round(r.height)}`);
  });
  return bad;
});
check(smallHud.length === 0, '遊戲中 HUD 的鈕都 ≥44px（0916 體檢是 34~40px）', smallHud.join('/'));

// ── 📱 直向真的玩得動(0916)────────────────────────────────────────────────
// ★ 這一段取代舊的「直向時出現請轉為橫向蓋版」。只驗「有沒有蓋版」驗不到玩不玩得動:
//   蓋版拿掉之後才發現 HUD 在 390px 寬底下會橫向溢出,而舊的驗收全程是綠的。
const portraitPlay = await page.evaluate(() => {
  const c = document.getElementById('gameCanvas');
  const r = c.getBoundingClientRect();
  const hud = document.querySelector('.game-hud');
  return {
    promptHidden: document.getElementById('rotatePrompt').hidden,
    cw: c.width,
    ch: c.height,
    logicalAspect: c.height / c.width,
    cssAspect: r.height / r.width,
    hudOverflow: hud.scrollWidth - hud.clientWidth,
    bricks: bricks.length,
    minX: Math.min(...bricks.map((b) => b.x)),
    maxX: Math.max(...bricks.map((b) => b.x + b.width)),
    maxY: Math.max(...bricks.map((b) => b.y + b.height)),
    paddleTop: paddle.y,
    paddleW: paddle.width,
  };
});
check(portraitPlay.promptHidden === true, '直向預設不再要求轉橫向');
check(portraitPlay.ch > portraitPlay.cw, '直向時邏輯畫布是直的', `${portraitPlay.cw}x${portraitPlay.ch}`);
// 畫布是被 CSS 拉滿視窗的 ⇒ 邏輯長寬比和實際長寬比差太多就是「整面被壓扁」
check(
  Math.abs(portraitPlay.logicalAspect - portraitPlay.cssAspect) / portraitPlay.cssAspect < 0.08,
  '直向畫面沒有被壓扁（邏輯長寬比貼近實際）',
  `${portraitPlay.logicalAspect.toFixed(2)} vs ${portraitPlay.cssAspect.toFixed(2)}`
);
check(portraitPlay.hudOverflow <= 1, '直向 HUD 沒有橫向溢出', String(portraitPlay.hudOverflow));
check(portraitPlay.bricks > 0, '直向開得出磚塊', String(portraitPlay.bricks));
check(
  portraitPlay.minX >= -0.5 && portraitPlay.maxX <= portraitPlay.cw + 0.5,
  '直向磚牆沒有溢出畫布左右',
  `${Math.round(portraitPlay.minX)}~${Math.round(portraitPlay.maxX)} / ${portraitPlay.cw}`
);
check(
  portraitPlay.maxY < portraitPlay.paddleTop - 60,
  '直向磚牆沒有壓到底板',
  `${Math.round(portraitPlay.maxY)} vs ${Math.round(portraitPlay.paddleTop)}`
);
// 直向畫布只有 560 寬,板子若還用橫向的絕對 px 會佔掉四分之一個螢幕 = 難度垮掉
check(
  portraitPlay.paddleW < portraitPlay.cw * 0.2,
  '直向板寬有按比例縮（不到畫布寬的 1/5）',
  `${Math.round(portraitPlay.paddleW)} / ${portraitPlay.cw}`
);

// ── 🔄 玩到一半轉手機(0916)────────────────────────────────────────────────
// ★ 這是直向支援最容易壞、又最不會被發現的一段:座標全是絕對 px,換了版面卻沒搬,
//   球會留在畫面外、磚塊橫著溢出、板子卡在右邊界 —— 而語法檢查與單元測試全綠。
await page.mouse.click(195, 500);        // 發球
await page.waitForTimeout(1200);
await page.evaluate(() => shiftBricks(2));   // 先壓兩格,順便驗下壓進度會不會被轉向偷走

const outOfBounds = () => page.evaluate(() => ({
  mode: layoutMode,
  cw: canvas.width,
  ch: canvas.height,
  bricksOut: bricks.filter((b) => b.alive
    && (b.x < -1 || b.x + b.width > canvas.width + 1 || b.y + b.height > paddle.y)).length,
  ballsOut: balls.filter((b) => b.x < -1 || b.x > canvas.width + 1 || b.y > canvas.height + 1).length,
  paddleOut: paddle.x < -1 || paddle.x + paddle.width > canvas.width + 1,
  paddleW: Math.round(paddle.width),
  descendRows: state.descendRows,
  alive: bricks.filter((b) => b.alive).length,
}));

const beforeTurn = await outOfBounds();
await page.setViewportSize({ width: 844, height: 390 });
await page.waitForTimeout(700);
const afterTurn = await outOfBounds();

check(afterTurn.mode === 'landscape', '轉成橫向後版面跟著換', afterTurn.mode);
check(
  afterTurn.bricksOut === 0 && afterTurn.ballsOut === 0 && !afterTurn.paddleOut,
  '轉向後磚塊/球/板子都還在畫面內',
  JSON.stringify(afterTurn)
);
check(
  afterTurn.paddleW > beforeTurn.paddleW,
  '轉向後板寬換成該方向的尺度',
  `${beforeTurn.paddleW} → ${afterTurn.paddleW}`
);
check(
  afterTurn.descendRows === beforeTurn.descendRows,
  '轉向不會偷偷把磚塊下壓的進度歸零（等於送一個免費重置）',
  `${beforeTurn.descendRows} → ${afterTurn.descendRows}`
);
check(afterTurn.alive > 0, '轉向後磚塊沒有整批消失', String(afterTurn.alive));

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(700);
const backAgain = await outOfBounds();
check(backAgain.mode === 'portrait' && backAgain.bricksOut === 0 && backAgain.ballsOut === 0,
  '轉回直向也一樣乾淨', JSON.stringify(backAgain));

// 跨方向續玩:直向存的檔,在橫向要接得回來(存檔存的是絕對座標)
// ⚠ hasStartedRun() 要求「真的開始玩了」才寫存檔 ⇒ 先確實打掉一顆磚,不要靠球自己撞到
await page.evaluate(() => {
  destroyBrick(bricks.find((b) => b.alive));
  saveRun();
});
const savedLayout = await page.evaluate(() => {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.run));
  return { cw: raw.cw, ch: raw.ch, pt: raw.pt, dr: raw.descendRows, v: raw.v };
});
check(
  Number.isFinite(savedLayout.cw) && Number.isFinite(savedLayout.ch) && typeof savedLayout.pt === 'boolean',
  '續玩存檔有帶「存的時候是什麼版面」',
  JSON.stringify(savedLayout)
);

// 舊行為(固定橫向)仍然留著:選了就該跳蓋版
await page.evaluate(() => {
  preferences.screenMode = 'landscape';
  savePreferences();
  handleViewportChange();
});
await page.waitForTimeout(150);
const rotateVisible = await page.evaluate(() => !document.getElementById('rotatePrompt').hidden);
check(rotateVisible === true, '選「固定橫向」時直向仍會跳「請轉為橫向」蓋版');
await page.evaluate(() => {
  preferences.screenMode = 'auto';
  savePreferences();
  handleViewportChange();
});
await page.waitForTimeout(150);

if (process.env.SHOT) {
  await page.screenshot({ path: `${SHOT_DIR}/game-portrait.png`, fullPage: false });
  console.log(`  截圖存到 ${SHOT_DIR}/`);
}

check(errors.length === 0, "全程沒有 JS 例外（直向）", errors.join(" / "));

// ── 橫向 844×390 ──────────────────────────────────────────────
// ★ 為什麼要補這一段:上面整支只跑 390×844 直向,而 0916 健檢的兩顆紅燈**都在橫向**
//   ——「遊戲中五顆鈕 34px」與「首頁可見範圍內一顆可點元素都沒有」。
//   直向那份當時是全綠的 ⇒ 只跑直向的驗收對這兩件永遠是綠的。
const land = await browser.newContext({
  viewport: { width: 844, height: 390 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const lp = await land.newPage();
lp.setDefaultTimeout(8000);
lp.setDefaultNavigationTimeout(45000);
const landErrors = [];
lp.on("pageerror", (error) => landErrors.push(String(error)));
await lp.goto(BASE, { waitUntil: "domcontentloaded" });
await lp.waitForTimeout(1200);

const startState = await lp.evaluate(() => {
  const sb = document.getElementById("startBtn");
  if (!sb) return null;
  const r = sb.getBoundingClientRect();
  // ⚠ 只看 inView 不夠:被別的東西蓋住時它照樣「在可見範圍內」
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return {
    inView: r.top < innerHeight && r.bottom > 0,
    h: Math.round(r.height),
    reachable: hit === sb || sb.contains(hit),
  };
});
check(
  Boolean(startState && startState.inView && startState.reachable),
  '橫向首頁:「開始遊玩」在可見範圍內且真的點得到（0916 體檢:可見範圍內一顆可點元素都沒有）',
  JSON.stringify(startState)
);
check(Boolean(startState && startState.h >= 44), "橫向首頁:開始鈕 ≥44px", String(startState && startState.h));

const smallLand = await lp.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll("button, select, .setup-toggles label")) {
    if (el.hidden) continue;
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.height < 44) bad.push(`${(el.textContent || "").trim().slice(0, 8)}=${Math.round(r.height)}`);
  }
  return bad;
});
check(smallLand.length === 0, "橫向首頁:按鈕/下拉/開關的觸控目標都 ≥44px", smallLand.join("/"));

await lp.locator("#startBtn").click({ timeout: 8000 }).catch(() => {});
await lp.waitForTimeout(1500);
const smallLandHud = await lp.evaluate(() => {
  const bad = [];
  document.querySelectorAll(".game-actions button").forEach((b) => {
    if (b.hidden) return;
    const r = b.getBoundingClientRect();
    if (r.height > 0 && r.height < 44) bad.push(`${b.textContent.trim()}=${Math.round(r.height)}`);
  });
  return bad;
});
check(
  smallLandHud.length === 0,
  "橫向遊戲中:HUD 五顆鈕都 ≥44px（0916 體檢是 34px,而「射擊」是要反覆按的）",
  smallLandHud.join("/")
);

if (process.env.SHOT) {
  await lp.screenshot({ path: `${SHOT_DIR}/game-landscape.png`, fullPage: false });
}
check(landErrors.length === 0, "全程沒有 JS 例外（橫向）", landErrors.join(" / "));

await browser.close();
console.log(fail === 0 ? "\n==> 全部通過" : `\n==> ${fail} 項失敗`);
process.exit(fail === 0 ? 0 : 1);
