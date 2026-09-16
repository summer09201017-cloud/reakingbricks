// 關卡圖案自我檢查(零相依,node test/patterns.mjs)。
// 為什麼要有這支:圖案是 ASCII 手打的,打錯一格不會有語法錯誤 ——
// 整張空的圖案會讓 checkLevelCleared() 一開場就過關 → 無限跳關;
// 某一列少一格則整張圖歪掉,而畫面看起來「只是有點怪」,很難察覺。
//
// ⚠ 這支「不」守圖形長得對不對(實測:把十字清掉一列仍然全綠,因為剩下的磚依舊可解)。
//    它守的是「不可解 / 幾何出界 / 圖例打錯」這類會壞掉的事。圖形對不對要看畫面,
//    用 Playwright 逐關截圖目視驗收(慣例見 skill canvas-playwright-verify)。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "game.js"), "utf8");

// 從 game.js 原地取出圖案定義(不複製一份,複製的那份遲早過時)
const from = src.indexOf("const PATTERN_COLS");
const to = src.indexOf("\n", src.indexOf("const PATTERN_SPECIALS")) + 1;
if (from < 0 || to <= 0) {
  console.error("[FAIL] 在 game.js 找不到 PATTERN_COLS / PATTERN_SPECIALS 定義");
  process.exit(1);
}
const { PATTERN_COLS, LEVEL_PATTERNS, PATTERN_SPECIALS } = new Function(
  `${src.slice(from, to)}; return { PATTERN_COLS, LEVEL_PATTERNS, PATTERN_SPECIALS };`,
)();

const BOSS_INTERVAL = 4;
const TOP = 70;
const ROW_PITCH = 24 + 8;
const PADDLE_TOP = 560 - 28 - 22;
const MIN_BRICKS = 14;
const MAX_ROWS = 8;

let fail = 0;
const check = (ok, msg) => { console.log((ok ? "  [ok]   " : "  [FAIL] ") + msg); if (!ok) fail += 1; };
const legend = new Set(["#", ".", ...Object.keys(PATTERN_SPECIALS)]);

console.log(`圖案數 ${LEVEL_PATTERNS.length}`);
for (const p of LEVEL_PATTERNS) {
  const bad = [];
  let n = 0;
  p.rows.forEach((row, i) => {
    if (row.length !== PATTERN_COLS) bad.push(`第 ${i} 列寬度 ${row.length} != ${PATTERN_COLS}`);
    for (const ch of row) {
      if (!legend.has(ch)) bad.push(`未知圖例 '${ch}'`);
      if (ch !== ".") n += 1;
    }
  });
  if (n === 0) bad.push("整張空 → 一開場就過關,會無限跳關");
  if (n < MIN_BRICKS) bad.push(`只有 ${n} 顆磚,太短`);
  if (p.rows.length > MAX_ROWS) bad.push(`${p.rows.length} 列,可能壓到底板`);
  check(bad.length === 0, `${p.name}(${p.rows.length} 列 / ${n} 磚)${bad.length ? " → " + bad.join("；") : ""}`);
}

// 圖案輪替不可跳過任何一張(BOSS 關若佔走編號就會有圖案永遠見不到)
const getPattern = (level) =>
  LEVEL_PATTERNS[Math.max(0, level - 1 - Math.floor(level / BOSS_INTERVAL)) % LEVEL_PATTERNS.length];
const seen = new Set();
for (let level = 1; level <= LEVEL_PATTERNS.length * BOSS_INTERVAL * 2; level += 1) {
  if (level > 1 && level % BOSS_INTERVAL === 0) continue;
  seen.add(getPattern(level).name);
}
check(seen.size === LEVEL_PATTERNS.length, `每張圖案都輪得到(${seen.size}/${LEVEL_PATTERNS.length})`);

// 最深的圖案不能長到底板附近
const lowest = TOP + Math.max(...LEVEL_PATTERNS.map((p) => p.rows.length)) * ROW_PITCH;
check(lowest < PADDLE_TOP - 80, `最低磚底 y=${lowest},底板頂 y=${PADDLE_TOP}`);

// ── 📱 直向版面的幾何(0916)────────────────────────────────────────────────
// 上面那三個常數是手抄橫向的值。直向的版面是算出來的(隨畫布高變),抄不了 ——
// 所以直接把 game.js 裡那幾支版面函式**原地挖出來執行**,避免測試裡養出第二份會走鐘的公式。
function sliceFunction(name) {
  const at = src.indexOf(`function ${name}(`);
  if (at < 0) throw new Error(`找不到 ${name}()`);
  let depth = 0;
  for (let i = src.indexOf("{", at); i < src.length; i += 1) {
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}") {
      depth -= 1;
      if (depth === 0) return src.slice(at, i + 1);
    }
  }
  throw new Error(`${name}() 的大括號不成對`);
}

const PADDLE_HEIGHT = Number(/const PADDLE_HEIGHT = (\d+)/.exec(src)[1]);
const PORTRAIT_BASE_WIDTH = Number(/const PORTRAIT_BASE_WIDTH = (\d+)/.exec(src)[1]);
const PORTRAIT_MIN_ASPECT = Number(/const PORTRAIT_MIN_ASPECT = ([\d.]+)/.exec(src)[1]);
const PORTRAIT_MAX_ASPECT = Number(/const PORTRAIT_MAX_ASPECT = ([\d.]+)/.exec(src)[1]);

const layoutApi = new Function(
  "canvas", "isPortraitLayout", "clamp", "PATTERN_COLS", "PADDLE_BOTTOM_GAP",
  [
    sliceFunction("getBrickLayout"),
    sliceFunction("getBrickRowPitch"),
    sliceFunction("getPaddleBottomGap"),
    "return { getBrickLayout, getBrickRowPitch, getPaddleBottomGap };",
  ].join("\n"),
);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// 兩端都要驗:iPad 直向(最方)與長身手機(最長),中間的比例不會更糟
const CASES = [
  { name: "橫向 1428x560", w: 1428, h: 560, portrait: false },
  { name: "橫向 812x560", w: 812, h: 560, portrait: false },
  { name: `直向 ${PORTRAIT_BASE_WIDTH}x${Math.round(PORTRAIT_BASE_WIDTH * PORTRAIT_MIN_ASPECT)}(平板)`,
    w: PORTRAIT_BASE_WIDTH, h: Math.round(PORTRAIT_BASE_WIDTH * PORTRAIT_MIN_ASPECT), portrait: true },
  { name: `直向 ${PORTRAIT_BASE_WIDTH}x${Math.round(PORTRAIT_BASE_WIDTH * PORTRAIT_MAX_ASPECT)}(長身手機)`,
    w: PORTRAIT_BASE_WIDTH, h: Math.round(PORTRAIT_BASE_WIDTH * PORTRAIT_MAX_ASPECT), portrait: true },
];

for (const c of CASES) {
  const canvas = { width: c.w, height: c.h };
  const api = layoutApi(canvas, () => c.portrait, clamp, PATTERN_COLS, 28);
  const L = api.getBrickLayout();
  const pitch = api.getBrickRowPitch();
  const paddleTop = c.h - api.getPaddleBottomGap() - PADDLE_HEIGHT;
  const deepest = L.top + MAX_ROWS * pitch;   // 自訂關卡最多 MAX_ROWS 列,比內建圖案更深
  const right = L.side + PATTERN_COLS * L.brickWidth + (PATTERN_COLS - 1) * L.gap;
  const bad = [];

  if (deepest >= paddleTop - 60) bad.push(`最深磚底 ${Math.round(deepest)} 太靠近底板 ${Math.round(paddleTop)}`);
  if (right > c.w + 0.5) bad.push(`磚牆右緣 ${Math.round(right)} 超出畫布 ${c.w}`);
  if (L.brickWidth <= L.brickHeight) bad.push(`磚 ${Math.round(L.brickWidth)}x${L.brickHeight} 變成直立的了`);
  if (L.top < 40) bad.push(`磚牆頂 ${L.top} 會被進度條蓋住`);
  // 板子底下要留得出拇指區(直向單手握時手指會擋住板子本身)
  if (c.portrait && c.h - paddleTop - PADDLE_HEIGHT < c.h * 0.06) bad.push("底下沒留出拇指區");

  check(bad.length === 0,
    `${c.name}:磚 ${Math.round(L.brickWidth)}x${L.brickHeight}、列距 ${pitch}、頂 ${L.top}、底板 ${Math.round(paddleTop)}`
    + (bad.length ? " → " + bad.join("；") : ""));
}

console.log(fail ? `\n==> ${fail} 項不合格` : "\n==> 全部通過");
process.exit(fail ? 1 : 0);
