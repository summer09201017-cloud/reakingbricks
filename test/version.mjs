// 版本號 ↔ 版本資訊 自我檢查(零相依,node test/version.mjs)。
//
// 為什麼要有這支:2026-09-27 v2.6.5 只把 APP_VERSION 從 2.6.4 改成 2.6.5、sw.js 也 bump 了,
// 但 CHANGELOG 一行都沒加。畫面「版本資訊」的日期是 CHANGELOG[0].date 推的,線上就印著
// 「2026-09-26 更新」和舊的五條——五支零相依測試全綠、真瀏覽器全綠、部署驗收全綠,使用者拍截圖才抓到。
// 全域 hook version-changelog-guard(#53)在 commit/push 那一刻會問;這支是 repo 自己的那一道,
// 換一台沒裝 hook 的機器、或有人直接改檔,也會紅。
//
// 守的都是機器驗得出來的事(文案寫得好不好只有人能判斷):
//   ① CHANGELOG 每一批都有 v(x.y.z)/ date(YYYY-MM-DD)/ items(至少一條、都是句子)
//   ② ★ CHANGELOG[0].v === APP_VERSION —— 改了版本號忘了寫版本資訊 ⇒ 這條紅
//   ③ 批次由新到舊:date 不遞增;v 不遞增,而且 2026-09-15 之後的批次 v 要嚴格遞減
//      (0915 起才有「每次上線都 bump APP_VERSION」的規矩;之前 0814~0914 幾批都在 1.5.0 底下出貨,
//       那是歷史,允許相同,但**新加的批次**不可以再跟上一批同號)
//   ④ items 裡沒有 Markdown 星號(它們是丟進 innerHTML 的,星號會原樣印在畫面上)
//   ⑤ APP_DATE 仍是從 CHANGELOG[0].date 推的、renderVersionPanel 有把 v 印出來(防有人改回寫死/拿掉)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "game.js"), "utf8");

let fail = 0;
const check = (ok, msg, extra) => {
  console.log((ok ? "  [ok]   " : "  [FAIL] ") + msg + (extra ? "  " + extra : ""));
  if (!ok) fail += 1;
};

// 從 game.js 原地取出 APP_VERSION 與 CHANGELOG(不複製一份,複製的那份遲早過時)。
const verMatch = /^const APP_VERSION = "([^"]+)";/m.exec(src);
const APP_VERSION = verMatch ? verMatch[1] : null;
check(!!APP_VERSION, "找得到 const APP_VERSION", APP_VERSION);

// CHANGELOG = [ … ]:數方括號深度,字串與註解裡的 [ ] 不算(條目文字裡可能有括號)。
function extractArray(name) {
  const m = new RegExp(`^const ${name} = \\[`, "m").exec(src);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  let depth = 0;
  for (let i = start; i < src.length; i += 1) {
    const c = src[i];
    const c2 = src[i + 1];
    if (c === "/" && c2 === "/") { i = src.indexOf("\n", i); if (i < 0) break; continue; }
    if (c === "/" && c2 === "*") { i = src.indexOf("*/", i + 2) + 1; continue; }
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < src.length && src[j] !== c) { if (src[j] === "\\") j += 1; j += 1; }
      i = j;
      continue;
    }
    if (c === "[") depth += 1;
    else if (c === "]") { depth -= 1; if (depth === 0) return src.slice(start, i + 1); }
  }
  return null;
}
const changelogText = extractArray("CHANGELOG");
check(!!changelogText, "找得到 const CHANGELOG = [ … ]");
let CHANGELOG = [];
try {
  CHANGELOG = new Function(`return ${changelogText};`)();
} catch (err) {
  check(false, "CHANGELOG 是純資料字面值(沒有引用別的變數)", String(err.message));
}
check(Array.isArray(CHANGELOG) && CHANGELOG.length > 0, "CHANGELOG 至少一批", `${CHANGELOG.length} 批`);

const SEMVER = /^\d+\.\d+\.\d+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const cmpVer = (a, b) => {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i += 1) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
};
const STRICT_SINCE = "2026-09-15"; // 從這天起每批 v 都要比上一批大

check(SEMVER.test(APP_VERSION || ""), "APP_VERSION 是 x.y.z", APP_VERSION);

// ① 每批的形狀
CHANGELOG.forEach((batch, idx) => {
  const tag = `第 ${idx + 1} 批(${batch && batch.date})`;
  check(batch && SEMVER.test(batch.v || ""), `${tag} 有 v: x.y.z`, batch && batch.v);
  check(batch && DATE.test(batch.date || ""), `${tag} 有 date: YYYY-MM-DD`);
  const items = (batch && batch.items) || [];
  check(Array.isArray(items) && items.length > 0, `${tag} items 至少一條`, `${items.length} 條`);
  items.forEach((item, j) => {
    check(typeof item === "string" && item.trim().length >= 8, `${tag} 第 ${j + 1} 條是一句話`, JSON.stringify(item).slice(0, 40));
    // ④ 星號:innerHTML 不吃 Markdown,寫 **粗體** 使用者看到的就是四個星號
    check(typeof item === "string" && !item.includes("**"), `${tag} 第 ${j + 1} 條沒有 Markdown 星號`);
  });
});

// ② ★ 版本號要對得上最新那一批
const top = CHANGELOG[0] || {};
check(top.v === APP_VERSION,
  `★ CHANGELOG[0].v === APP_VERSION(改了版本號忘了寫版本資訊 ⇒ 這條紅)`,
  `CHANGELOG[0].v=${top.v} APP_VERSION=${APP_VERSION}`);

// ③ 由新到舊
for (let i = 1; i < CHANGELOG.length; i += 1) {
  const a = CHANGELOG[i - 1];
  const b = CHANGELOG[i];
  if (!a || !b || !DATE.test(a.date || "") || !DATE.test(b.date || "")) continue;
  check(a.date >= b.date, `日期由新到舊:${a.date} ≥ ${b.date}`);
  if (!SEMVER.test(a.v || "") || !SEMVER.test(b.v || "")) continue;
  const d = cmpVer(a.v, b.v);
  if (a.date >= STRICT_SINCE) {
    check(d > 0, `版本由新到舊(${STRICT_SINCE} 起嚴格遞減):${a.date} v${a.v} > ${b.date} v${b.v}`,
      d === 0 ? "同號 = 加了一批卻沒 bump APP_VERSION,或 v 抄了上一批" : undefined);
  } else {
    check(d >= 0, `版本由新到舊(歷史批次允許同號):${a.date} v${a.v} ≥ ${b.date} v${b.v}`);
  }
}

// ⑤ 推導與畫面沒被改回去
check(/^const APP_DATE = CHANGELOG\[0\]\.date;/m.test(src), "APP_DATE 仍是從 CHANGELOG[0].date 推的(不要寫死一份日期)");
check(/release\.v\b/.test(src), "renderVersionPanel 有把每一批的 v 印在畫面上");

console.log(fail ? `\n[FAIL] version:${fail} 項失敗` : "\n[ok] version:全部通過");
if (fail) process.exit(1);
