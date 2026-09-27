// 手機不自動進全螢幕(零相依,node test/fullscreen.mjs)。
// 為什麼要有這支:2026-09-27 使用者拍板「手機版作品拿掉全螢幕提示」——那兩行字是 Android Chrome
// 在網頁呼叫 requestFullscreen() 時自己疊上去的系統 UI,網頁改不了它,唯一的槓桿是「觸控裝置上
// 開始遊玩/接續/自訂關卡三條自動路不要去呼叫」。這件事沒有畫面可以驗(桌機看不到那個提示,
// 無頭瀏覽器根本不會真的進全螢幕),最容易在下一次整理 requestGameFullscreen() 時被順手改回去,
// 所以用測試釘住三件事:①三條自動路都帶 { auto: true } ②⛶ 手動不帶 ③觸控+自動 ⇒ 不呼叫
// requestFullscreen;觸控+手動、桌機+自動 ⇒ 照呼叫。
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

// 原地取出一個 function 宣告(從 `function NAME` 或 `async function NAME` 到配對的收尾大括號)。
function extractFunction(name) {
  // 用 String.raw:這裡的 \s 是要進正規式的,不是字串跳脫(第一版寫成一般樣板字串,\s 被吃成 s)
  const m = src.match(new RegExp(String.raw`(?:async\s+)?function\s+` + name + String.raw`\s*\(`));
  if (!m) {
    console.error(`[FAIL] 在 game.js 找不到 function ${name}`);
    process.exit(1);
  }
  const start = m.index;
  // 先跳過參數列再找函式本體的 `{`:requestGameFullscreen({ auto = false } = {}) 的參數裡就有大括號,
  // 直接找第一個 `{` 會在參數列裡就「配對完成」,切出半截函式(第一版踩過)。
  const paren = src.indexOf("(", start);
  let pd = 0;
  let k = paren;
  for (; k < src.length; k += 1) {
    if (src[k] === "(") pd += 1;
    else if (src[k] === ")") {
      pd -= 1;
      if (pd === 0) break;
    }
  }
  const open = src.indexOf("{", k);
  let depth = 0;
  for (let j = open; j < src.length; j += 1) {
    if (src[j] === "{") depth += 1;
    else if (src[j] === "}") {
      depth -= 1;
      if (depth === 0) return src.slice(start, j + 1);
    }
  }
  throw new Error(`function ${name} 沒有收尾`);
}

console.log("① 三條自動路都帶 { auto: true },⛶ 手動不帶");
for (const name of ["startGameFromSetup", "resumeSavedRun", "playCustomLevel"]) {
  const body = extractFunction(name);
  check(/requestGameFullscreen\(\{\s*auto:\s*true\s*\}\)/.test(body), `${name}() 呼叫 requestGameFullscreen({ auto: true })`);
}
{
  const body = extractFunction("toggleFullscreen");
  check(/requestGameFullscreen\(\)/.test(body) && !/auto:\s*true/.test(body), "toggleFullscreen()(⛶ 手動)呼叫 requestGameFullscreen() 不帶 auto");
}

console.log("② 觸控+自動不呼叫 requestFullscreen;觸控+手動、桌機+自動照呼叫");
const fnSrc = extractFunction("shouldAutoFullscreen") + "\n" + extractFunction("requestGameFullscreen");

async function run({ touch, auto }) {
  let calls = 0;
  const document = {
    fullscreenElement: null,
    documentElement: { requestFullscreen: async () => { calls += 1; } },
  };
  const screen = { orientation: { lock: async () => {}, unlock: () => {} } };
  const fn = new Function("document", "screen", "isTouchDevice", "prefersForcedLandscape",
    fnSrc + "\nreturn requestGameFullscreen;");
  const requestGameFullscreen = fn(document, screen, () => touch, () => false);
  await requestGameFullscreen(auto ? { auto: true } : undefined);
  return calls;
}

check((await run({ touch: true, auto: true })) === 0, "觸控裝置 + 自動(開始遊玩)⇒ 不呼叫 requestFullscreen(Android Chrome 的兩行提示不會出現)");
check((await run({ touch: true, auto: false })) === 1, "觸控裝置 + ⛶ 手動 ⇒ 照呼叫(玩家自己要的)");
check((await run({ touch: false, auto: true })) === 1, "桌機 + 自動 ⇒ 照呼叫(桌機沒有那個提示,行為不變)");
check((await run({ touch: false, auto: false })) === 1, "桌機 + ⛶ 手動 ⇒ 照呼叫");

console.log(fail ? `\n${fail} 項失敗` : "\n全部通過");
process.exit(fail ? 1 : 0);
