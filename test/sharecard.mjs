// 每日挑戰分享圖卡自我檢查（零相依，node test/sharecard.mjs）。
//
// 為什麼要有這支：圖卡是「會被貼到 LINE 的東西」—— 上面漏一個 undefined、NaN，
// 或是把「今天還沒挑戰」畫成「0 分」，都不會有任何錯誤訊息，只會被看到。
// 而它是純 canvas，語法檢查與既有測試都碰不到裡面畫了什麼字。
//
// 做法同 sharecode.mjs：直接從 game.js 取那一段來跑（不複製一份，複製的那份遲早過時），
// 餵一個假的 2D context 把所有 fillText / fillRect 錄下來，再對「畫面上的字」下斷言。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "game.js"), "utf8");

const from = src.indexOf("const SHARE_CARD_W = 1080;");
const to = src.indexOf("function renderShareCard()");
if (from < 0 || to <= 0) {
  console.error("[FAIL] 在 game.js 找不到分享圖卡區段");
  process.exit(1);
}

const api = new Function(
  src.slice(from, to)
  + "\nreturn { drawShareCard, shareCardFileName, getDailyShareText, SHARE_CARD_W, SHARE_CARD_H };",
)();
const { drawShareCard, shareCardFileName, getDailyShareText, SHARE_CARD_W, SHARE_CARD_H } = api;

let fail = 0;
const check = (ok, msg, extra) => {
  console.log((ok ? "  [ok]   " : "  [FAIL] ") + msg + (extra ? "  " + extra : ""));
  if (!ok) {
    fail += 1;
  }
};

// 假的 2D context：只負責把「被畫了什麼」記下來。
function makeFakeCtx() {
  const texts = [];
  const rects = [];
  const gradients = [];
  const ctx = {
    canvas: { width: SHARE_CARD_W, height: SHARE_CARD_H },
    fillStyle: "",
    strokeStyle: "",
    font: "",
    textAlign: "",
    textBaseline: "",
    lineWidth: 1,
    globalAlpha: 1,
    save() {},
    restore() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    quadraticCurveTo() {},
    arc() {},
    stroke() {},
    fill() {},
    translate() {},
    rotate() {},
    measureText(text) { return { width: String(text).length * 10 }; },
    createLinearGradient() {
      const stops = [];
      gradients.push(stops);
      return { addColorStop: (offset, color) => stops.push([offset, color]) };
    },
    fillRect(x, y, w, h) { rects.push({ x, y, w, h, fill: ctx.fillStyle }); },
    fillText(text, x, y) { texts.push({ text: String(text), x, y, font: ctx.font, fill: ctx.fillStyle }); },
  };
  return { ctx, texts, rects, gradients };
}

const PLAYED = {
  dateKey: "2026-09-16",
  puzzleNo: "481902",
  difficultyLabel: "普通",
  played: true,
  score: 1420,
  level: 5,
  ballsUsed: 2,
  maxCombo: 18,
  bricks: 96,
  grade: "A",
  gradeTitle: "節奏高手",
  patternName: "沙漏",
  patternRows: ["##########", ".#......#.", "..#....#..", "...####...", "..#....#..", ".#......#.", "##########"],
  palette: ["#55c1ff", "#63e6be", "#ffe66d", "#ffaf54", "#ff7f7f"],
  background: ["#0f345f", "#102a4b", "#0a1b34"],
  url: "https://bricksbreaking.pages.dev/",
};

const NOT_PLAYED = {
  ...PLAYED,
  played: false,
  score: 0,
  level: 1,
  ballsUsed: 0,
  maxCombo: 0,
  bricks: 0,
  grade: "D",
  gradeTitle: "再來一局",
  patternName: "城牆",
  patternRows: ["##########", "##########", "##########", "#.##..##.#", ".##.##.##."],
};

// ── 有成績的那張 ────────────────────────────────────────────────────────────
{
  const { ctx, texts, rects, gradients } = makeFakeCtx();
  drawShareCard(ctx, PLAYED, { w: SHARE_CARD_W, h: SHARE_CARD_H });
  const all = texts.map((t) => t.text).join("\n");

  check(all.includes("2026-09-16"), "圖卡印得出日期");
  check(all.includes("481902"), "圖卡印得出題號（老師報號、全班同一局）");
  check(all.includes("普通"), "圖卡印得出難度");
  check(texts.some((t) => t.text === "1420"), "圖卡印得出分數");
  check(all.includes("A") && all.includes("節奏高手"), "圖卡印得出評級");
  check(all.includes("沙漏") && all.includes("第 5 關"), "圖卡印得出關卡名與關數");
  check(texts.some((t) => t.text === "2"), "圖卡印得出用掉球數");
  check(texts.some((t) => t.text === "18"), "圖卡印得出最大 Combo");
  check(texts.some((t) => t.text === "96"), "圖卡印得出破壞磚塊數");
  check(all.includes("https://bricksbreaking.pages.dev/"), "圖卡印得出網址（別人才點得回來）");

  const dirty = ["undefined", "NaN", "[object Object]", "Invalid Date", "null"];
  const found = dirty.filter((word) => all.includes(word));
  check(found.length === 0, "圖卡上沒有 undefined / NaN 之類漏出來的字", found.join(","));

  check(
    texts.every((t) => t.font && t.font.includes("px") && t.fill),
    "每一段文字都設過字體與顏色（沒有沿用上一段的殘留樣式）",
  );

  const cells = PLAYED.patternRows.length * PLAYED.patternRows[0].length;
  check(rects.length >= cells, "關卡圖案縮圖每一格都有畫", `${rects.length} 塊 ≥ ${cells} 格`);
  check(gradients.length >= 1 && gradients[0].length >= 2, "背景漸層有設色停點");

  const inside = texts.every((t) => t.x >= 0 && t.x <= SHARE_CARD_W && t.y >= 0 && t.y <= SHARE_CARD_H);
  check(inside, "所有文字都落在卡片範圍內（不會被裁掉）");
  const rectsInside = rects.every((r) => r.x >= -1 && r.y >= -1 && r.x + r.w <= SHARE_CARD_W + 1 && r.y + r.h <= SHARE_CARD_H + 1);
  check(rectsInside, "所有色塊都落在卡片範圍內");
}

// ── 今天還沒挑戰的那張（誠實鐵則）─────────────────────────────────────────────
{
  const { ctx, texts } = makeFakeCtx();
  drawShareCard(ctx, NOT_PLAYED, { w: SHARE_CARD_W, h: SHARE_CARD_H });
  const all = texts.map((t) => t.text).join("\n");

  check(all.includes("今天還沒挑戰"), "沒玩過就明講「今天還沒挑戰」");
  check(!all.includes("今日分數"), "沒玩過就不印「今日分數」標題");
  check(!texts.some((t) => t.text === "0"), "沒玩過就不印 0 分假裝玩過");
  check(all.includes("481902"), "邀請卡仍然帶題號（點進來就是今天這一局）");
}

// ── 壞資料不可以讓整張卡炸掉 ─────────────────────────────────────────────────
{
  const broken = { ...PLAYED, patternRows: undefined, palette: undefined, background: undefined };
  const { ctx, texts } = makeFakeCtx();
  let threw = null;
  try {
    drawShareCard(ctx, broken, { w: SHARE_CARD_W, h: SHARE_CARD_H });
  } catch (error) {
    threw = error;
  }
  check(!threw, "缺圖案／缺色盤也畫得出卡片，不丟例外", threw ? String(threw.message) : "");
  check(texts.map((t) => t.text).join("").includes("1420"), "壞資料時分數照樣印得出來");
}

// ── 檔名 ────────────────────────────────────────────────────────────────────
{
  check(shareCardFileName("2026-09-16") === "breakout-daily-2026-09-16.png", "檔名帶日期且是純 ASCII");
  check(shareCardFileName("") === "breakout-daily-today.png", "沒有日期時仍給得出檔名");
  check(!/[\\/:*?"<>|]/.test(shareCardFileName("../../etc/passwd")), "檔名不含路徑或非法字元", shareCardFileName("../../etc/passwd"));
  check(shareCardFileName(undefined).endsWith(".png"), "檔名一定是 .png");
}

// ── 分享文字要跟圖卡說同一件事 ───────────────────────────────────────────────
{
  const played = getDailyShareText(PLAYED);
  check(played.includes("2026-09-16") && played.includes("481902"), "分享文字帶日期與題號");
  check(played.includes("1420"), "分享文字帶分數");
  check(played.includes("沙漏"), "分享文字帶關卡名");
  check(played.includes(PLAYED.url), "分享文字帶網址");
  check(!/undefined|NaN/.test(played), "分享文字沒有 undefined / NaN");

  const idle = getDailyShareText(NOT_PLAYED);
  check(idle.includes("今天還沒挑戰"), "沒玩過的分享文字不吹牛");
  check(!idle.includes("分數：0"), "沒玩過的分享文字不印 0 分");
}

console.log(fail === 0 ? "\n==> 全部通過" : `\n==> ${fail} 項失敗`);
process.exit(fail === 0 ? 0 : 1);
