// 真瀏覽器驗收：立體渲染（3D）模式（node test/verify-browser-3d.mjs）。
//
// 為什麼另開一支檔案、不塞進 verify-browser.mjs：3D 模式是一整條獨立的載入/切換路徑
// （動態 import、WebGL、preserveDrawingBuffer），跟原本那支測的「2D 版面/圖卡/觸控目標」
// 是兩件事；分開放，改壞哪一邊都不會把兩份診斷混在一起看。
//
// 用法：
//   python -m http.server 8931
//   node test/verify-browser-3d.mjs
//   BASE=https://bricksbreaking.pages.dev node test/verify-browser-3d.mjs   # 打線上
//
// 需要 playwright-core（本機已有）與系統 Edge／Chrome。
import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://127.0.0.1:8931";
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

async function newErrorTrackedPage(browser, opts = {}) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    ...opts,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.setDefaultNavigationTimeout(45000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  return { context, page, errors };
}

async function settle(page) {
  await page.waitForLoadState("load");
  await page.waitForSelector("#setupRender3dToggle");
}

const browser = await launch();

// ── ① 從設定頁打開立體渲染 → 進遊戲 → 場景真的同步到球場資料 ──────────────────────
//    ⚠ 這裡跟下面②都用 context 選項 serviceWorkers:"block"——這支測試在意的是
//      3D 渲染本身，不是 PWA/離線行為(那是 verify-browser.mjs 的工作)。
//      2026-09-25 實測踩過一次：對著剛部署完的 netlify.app(SW 是第一次真的裝上去)，
//      sw.js clients.claim() 觸發的 window.location.reload() 會在 settle() 放行後
//      幾百毫秒才發生，剛好卡在「勾選開關/按開始/點畫布」這段互動的正中間——整段操作
//      被一次 reload 攔腰打斷，畫面被換回最初的設定頁，症狀完全不像「reload 打斷了」，
//      反而很像轉橫向後版面跑掉、或設定沒生效，查了很久才抓到真因。**固定多睡幾秒**
//      能降低撞見的機率但躲不掉(reload 的時間點取決於下載/安裝 SW 與其預先快取清單
//      要花多久，本來就跟網路狀況一起飄)——乾脆整支測試都不裝 SW，從根上拿掉這個變因。
{
  const { context, page, errors } = await newErrorTrackedPage(browser, { serviceWorkers: "block" });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await settle(page);

  check(!(await page.locator("body").evaluate((b) => b.classList.contains("mode-3d"))), "預設是 2D（沒有 mode-3d）");

  await page.check("#setupRender3dToggle");
  await page.click("#startBtn");
  // 動態 import 三 Three.js 需要一點時間；另外這類遊戲多半要點一下畫布才真的開始倒數。
  await page.waitForTimeout(1500);
  await page.locator("#gameCanvas").click({ position: { x: 40, y: 300 } }).catch(() => {});
  await page.waitForTimeout(300);
  // ⚠ 這支測試接下來要做一長串斷言(讀 3D 場景、比對顏色、轉橫向…)，沒人在幫球接板子，
  //   球真的會在幾秒內掉出畫面把這一局結束、畫面跳回設定頁——那不是 bug，是正常的遊戲結果，
  //   卻會讓下面找 #settingsBtn 的那一步「找不到看得到的按鈕」而假紅(在較慢的主機上更容易中)。
  //   凍結 state.running 只是停掉世界更新，render() 仍然每幀照跑，3D 場景照樣看得到。
  await page.evaluate(() => { state.running = false; });
  await page.waitForTimeout(500);

  const layout = await page.evaluate(() => {
    const c3 = document.getElementById("gameCanvas3d");
    return {
      hasClass: document.body.classList.contains("mode-3d"),
      c3Display: getComputedStyle(c3).display,
      c2BgNone: getComputedStyle(document.getElementById("gameCanvas")).backgroundImage === "none",
    };
  });
  check(layout.hasClass, "打開立體渲染後 body 多了 mode-3d");
  check(layout.c3Display === "block", "3D 畫布(#gameCanvas3d)變成看得到");
  check(layout.c2BgNone, "2D 畫布(#gameCanvas)背景變透明（讓 3D 畫布透出來）");

  const debug = await page.evaluate(() => (window.__render3dDebug ? window.__render3dDebug() : null));
  const aliveBricks = await page.evaluate(() => bricks.filter((b) => b.alive).length);
  const ballCount = await page.evaluate(() => balls.length);
  check(!!debug, "3D 場景暴露了驗收用的讀取窗口(window.__render3dDebug)");
  check(!!debug && debug.brickCount === aliveBricks, "3D 場景的磚塊 mesh 數量 == 遊戲裡存活的磚塊數", debug ? `${debug.brickCount} vs ${aliveBricks}` : "");
  check(!!debug && debug.ballCount === ballCount, "3D 場景的球 mesh 數量 == 遊戲裡的球數", debug ? `${debug.ballCount} vs ${ballCount}` : "");

  // 🚨 2026-09-26 使用者實機回報:立體模式下危險線跑到板子下面去了。真因是危險線曾經
  // 只畫在 2D 疊層上(平面座標,固定螢幕百分比),板子是透視投影的 3D 物件——同一個
  // canvasY 在兩套投影下對不上,板子(近景)反而畫到「線」上面。改法是把危險線也做成
  // 3D 場景自己的物件(render3d.js 的 dangerLineMesh),跟板子吃同一顆鏡頭。這裡直接比
  // 兩個 3D mesh 的 Z 座標(對應 2D 的 canvasY),不量螢幕像素——鏡頭角度以後再怎麼調,
  // 只要 Z 座標的相對順序對,畫面上的相對順序就一定對,比截圖比對更不會因為調鏡頭而假紅。
  const normalDifficultyHasDescend = await page.evaluate(() => isDescendActive());
  check(normalDifficultyHasDescend, "預設難度(標準)這一關本來就會顯示危險線(前提要成立，下面兩項才有意義)");
  check(!!debug && debug.dangerLineVisible === true, "3D 場景裡的危險線物件是顯示的");
  check(
    !!debug && debug.dangerLinePos[2] < debug.paddlePos[2],
    "危險線在 3D 場景裡的 Z 座標小於板子(對應「線在板子上方」，順序不能因為鏡頭透視而顛倒)",
    debug ? `line z=${debug.dangerLinePos[2]} vs paddle z=${debug.paddlePos[2]}` : "",
  );

  // 🚨 2026-09-26 第三輪:使用者截圖回報「線與擋板有到最底嗎」——量出來邏輯座標(paddle.y)
  // 早就在畫布最下緣附近，但鏡頭取景是拿「整個球場對角線」去對稱塞進視野算出來的固定角度，
  // 直向手機球場又窄又長，鏡頭被左右(不能裁到磚牆)那頭撐得比縱深需要的還遠，多出來的視角
  // 配額因為對稱硬要分掉，整段留在畫面下方——板子邏輯座標沒錯，錯在鏡頭把它投影到螢幕上
  // 沒有真的貼到底。paddleScreenFrac 是「板子投影到螢幕後，離最下緣還有多遠」的比例
  // (0=貼底、1=頂到最上緣)，比截圖比對更精準,也比只看世界座標更誠實——這條測試在
  // 改用不對稱視錐(off-axis frustum)之前真的會抓到(退版重跑量到 ≈0.27，離貼底還差一大截)。
  check(
    typeof debug?.paddleScreenFrac === "number" && debug.paddleScreenFrac > 0.85,
    "板子投影到螢幕後,真的落在畫面最下面一小段(不是邏輯座標在底、畫面卻還有一大截空白)",
    typeof debug?.paddleScreenFrac === "number" ? `paddleScreenFrac=${debug.paddleScreenFrac.toFixed(3)}` : `paddleScreenFrac=${debug?.paddleScreenFrac}`,
  );

  // 🎁 2026-09-26 使用者實機回報:立體模式下吃不到寶物。真因跟危險線同一顆坑——道具
  // 原本也畫在 2D 疊層(平面座標),跟透視投影的板子對不齊,玩家對著畫面上的道具去接,
  // 板子的實際位置(3D)卻不在那裡。碰撞判定(updatePowerups())本身完全沒壞,是畫面對不準。
  // 改法是把道具也做成 3D 場景的 Sprite(render3d.js),跟板子吃同一套透視。
  // 這裡直接塞一顆道具在板子正上方一小段距離,讓它自然落下,驗證「真的會被接住」——
  // 不是只驗 3D 物件存在,是驗證端到端的遊戲結果(道具消失 + 效果生效),
  // 對齊壞掉的話,球會落在錯的位置,這個斷言就抓得到(碰撞看的是遊戲座標,不是螢幕像素,
  // 但如果玩家因為畫面對不準而移動板子到錯的位置,這裡故意直接塞在正上方繞過那一步,
  // 專門驗證「對齊修好之後,道具本身確實會進 3D 場景、碰撞路徑也還是通的」)。
  const powerupTest = await page.evaluate(async () => {
    const p = paddle;
    const marker = {};
    powerups.length = 0;
    powerups.push({ x: p.x + p.width / 2, y: p.y - 60, vy: 3, size: 20, type: "laser", label: "GUN", color: "#ff93db", __testMarker: marker });
    const beforeGunTimer = state.gunTimer;
    await new Promise((r) => requestAnimationFrame(r)); // 至少讓 render3dFrame() 跑過一次才會同步進 3D 場景
    const midDebug = window.__render3dDebug ? window.__render3dDebug() : null;
    // 上面已經把 state.running 凍住(球不落出畫面);這裡要讓它真的落到板子上才驗得出
    // 「接得到」，跑完立刻凍回去，不影響這支測試接下來的其他斷言。
    state.running = true;
    await new Promise((r) => setTimeout(r, 1200));
    state.running = false;
    // ⚠ 不能斷言「陣列變空」:這 1.2 秒球是真的在跑,途中打破磚塊可能又隨機掉出
    // 別顆道具,那不是 bug。用一開始塞進去的 marker 物件精準認出「我塞的那顆」還在不在。
    return {
      powerupCountIn3d: midDebug ? midDebug.powerupCount : null,
      myPowerupStillThere: powerups.some((x) => x.__testMarker === marker),
      gunTimerBefore: beforeGunTimer,
      gunTimerAfter: state.gunTimer,
    };
  });
  check(powerupTest.powerupCountIn3d === 1, "塞一顆道具進去，3D 場景裡真的多了一個 Sprite", `count=${powerupTest.powerupCountIn3d}`);
  check(!powerupTest.myPowerupStillThere, "塞的那顆道具落到板子上後從遊戲陣列裡消失（真的被接住，不是卡住或穿過去）");
  check(powerupTest.gunTimerAfter > powerupTest.gunTimerBefore, "接住的效果真的生效了（雷射計時器從 0 變成有值，不是只消失沒發生作用）", `${powerupTest.gunTimerBefore} → ${powerupTest.gunTimerAfter}`);

  // preserveDrawingBuffer 修好之後，這塊畫布真的讀得到不只一種顏色（不是一片死黑）。
  const pixelColors = await page.evaluate(() => {
    const c3 = document.getElementById("gameCanvas3d");
    const off = document.createElement("canvas");
    off.width = c3.width;
    off.height = c3.height;
    const octx = off.getContext("2d");
    octx.drawImage(c3, 0, 0);
    const { data } = octx.getImageData(0, 0, off.width, off.height);
    const seen = new Set();
    for (let i = 0; i < data.length; i += 4 * 97) {
      seen.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
    }
    return seen.size;
  });
  check(pixelColors > 10, "3D 畫布讀得到的顏色不只一種（真的畫了球場，不是空白）", String(pixelColors));

  // ── 轉橫向：resize 邏輯要跟著換,不能整個掛掉 ──
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(1200);
  const afterRotate = await page.evaluate(() => (window.__render3dDebug ? window.__render3dDebug() : null));
  check(!!afterRotate, "轉橫向後 3D 場景還在(沒有整個掛掉)");
  // ⚠ window.__render3dDebug() 讀的是 Three.js 場景本身，就算畫面已經跳回設定頁，
  //   它也可能還吐得出「看起來正常」的舊資料(場景物件沒有被清掉)——上面那項單獨測不出
  //   「其實已經離開遊戲畫面」，一定要另外直接查 gameScreen.hidden 才算數。
  check(await page.evaluate(() => !gameScreen.hidden), "轉橫向後仍在遊戲畫面(不是被切回設定頁)");

  // ── 遊戲中的設定選單也能關掉 3D,切回 2D 要立刻生效 ──
  await page.click("#settingsBtn");
  await page.waitForSelector("#settingsMenu:not([hidden])");
  await page.uncheck("#render3dToggle");
  await page.waitForTimeout(400);
  const backTo2d = await page.evaluate(() => ({
    hasClass: document.body.classList.contains("mode-3d"),
    c2BgIsGradient: getComputedStyle(document.getElementById("gameCanvas")).backgroundImage !== "none",
  }));
  check(!backTo2d.hasClass, "遊戲中把立體渲染關掉，body 的 mode-3d 立刻拿掉");
  check(backTo2d.c2BgIsGradient, "關掉後 2D 畫布背景恢復（不再透明）");

  check(errors.length === 0, "全程沒有 JS 例外", errors.join(" / "));
  await context.close();
}

// ── ② 設定值要記得住(跟其他偏好一樣走 localStorage,不是只活在這次執行期) ──────────
{
  const { context, page } = await newErrorTrackedPage(browser, { serviceWorkers: "block" });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.check("#setupRender3dToggle");
  await page.waitForTimeout(200);
  await page.reload({ waitUntil: "domcontentloaded" });
  await settle(page);
  const checked = await page.locator("#setupRender3dToggle").isChecked();
  check(checked, "重新整理後，立體渲染設定仍記得是打開的");
  await context.close();
}

// ── ③ 載入失敗要靜默退回 2D,不能讓整個遊戲掛掉 ──────────────────────────────────
//    模擬情境:render3d.js 拿不到(舊裝置的快取問題、或本 CLAUDE.md 說的 file:// 限制)。
//    ⚠ 這裡用 context 選項 serviceWorkers:"block",不是攔截 sw.js 的請求 ——
//      render3d.js 也在 sw.js 的預先快取清單裡,一旦裝上 SW,它會用「自己的
//      fetch 事件處理常式」把 render3d.js 直接從快取端出來,那條路徑不會經過
//      Playwright 的 page.route() 攔截。攔 sw.js 的請求本身(例如回 404)**攔不住
//      這件事**(實測 navigator.serviceWorker.controller 還是有值),
//      只有從 context 層直接關掉 Service Worker 才乾淨——這支測試本來就不是在測
//      PWA 離線行為,把這個變因整個拿掉,結果才不會看情況(卡不卡快取)而漂移。
{
  const { context, page, errors } = await newErrorTrackedPage(browser, { serviceWorkers: "block" });
  await page.route("**/render3d.js", (route) => route.abort());
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.check("#setupRender3dToggle");
  await page.click("#startBtn");
  await page.waitForTimeout(2000);

  const state = await page.evaluate(() => ({
    hasClass: document.body.classList.contains("mode-3d"),
    checkboxNowUnchecked: !document.getElementById("setupRender3dToggle").checked,
    prefRender3d: JSON.parse(localStorage.getItem("breakout.preferences.v2") || "{}").render3d,
  }));
  check(!state.hasClass, "render3d.js 載入失敗時，不會卡在 mode-3d 半殘狀態");
  check(state.checkboxNowUnchecked === true, "載入失敗後，設定畫面誠實顯示已經退回 2D（不是繼續勾著沒作用）");
  check(state.prefRender3d === false, "載入失敗後，存檔也一併改回 2D（下次開站不會又試一次卡住）");

  const aliveBricks = await page.evaluate(() => bricks.filter((b) => b.alive).length);
  check(aliveBricks > 0, "退回 2D 後遊戲本身正常（磚塊還在，不是整頁死掉）", String(aliveBricks));
  check(errors.length === 0, "載入失敗的整段過程沒有未接住的例外（有接住才算，不是沒發生）", errors.join(" / "));
  await context.close();
}

await browser.close();

console.log(`\n${fail === 0 ? "==> 全部通過" : `==> ${fail} 項失敗`}`);
process.exit(fail === 0 ? 0 : 1);
