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

console.log(fail ? `\n==> ${fail} 項不合格` : "\n==> 全部通過");
process.exit(fail ? 1 : 0);
