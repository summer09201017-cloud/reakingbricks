// 分享碼編解碼自我檢查（零相依，node test/sharecode.mjs）。
//
// 為什麼要有這支：分享碼是「別人手上那串字」—— 編碼規則一改，所有已經傳出去的碼
// 就全部失效或還原成別張圖，而這件事不會有任何錯誤訊息，只會有人說「怎麼跟你畫的不一樣」。
// 這支把格式釘死：固定樣本的碼字串逐字比對 + 隨機往返 + 單字錯誤攔截率。
//
// ⚠ 下面 FIXTURES 的 code 值是「格式契約」。改編碼規則就會讓這支變紅 —— 那是提醒，
//    不是叫你改期望值：真的要改格式，請連同開頭字母一起換（例如 B -> C），
//    讓舊碼直接被拒絕，而不是悄悄還原成另一張圖。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "game.js"), "utf8");

// 直接從 game.js 取出編解碼那一段（不複製一份，複製的那份遲早過時）
const from = src.indexOf("const EDITOR_COLS");
const to = src.indexOf("function createBlankEditorRows");
if (from < 0 || to <= 0) {
  console.error("[FAIL] 在 game.js 找不到分享碼編解碼區段");
  process.exit(1);
}

const api = new Function(
  "const PATTERN_COLS = 10;\n"
  + src.slice(from, to)
  + "\nreturn { encodeLevelCode, decodeLevelCode, EDITOR_COLS, EDITOR_MIN_ROWS, EDITOR_MAX_ROWS, EDITOR_GLYPHS };",
)();
const { encodeLevelCode, decodeLevelCode, EDITOR_COLS, EDITOR_MIN_ROWS, EDITOR_MAX_ROWS, EDITOR_GLYPHS } = api;

let fail = 0;
const check = (ok, msg, extra) => {
  console.log((ok ? "  [ok]   " : "  [FAIL] ") + msg + (extra ? "  " + extra : ""));
  if (!ok) {
    fail += 1;
  }
};

const FIXTURES = [
  {
    name: "愛心",
    rows: [".##....##.", "##########", "##########", ".########.", "..######..", "...####...", "....##...."],
    code: "B715015666666666616665066600165000600q",
  },
  {
    name: "堡壘",
    rows: ["SS######SS", "S........S", "#..BBBB..#", "#..BBBB..#", "S........S", "SS######SS"],
    code: "B6C666CA000253IF153IF1A0002C666CR",
  },
];

for (const item of FIXTURES) {
  check(encodeLevelCode(item.rows) === item.code, item.name + "：編出來的碼沒有變", encodeLevelCode(item.rows));
  check(JSON.stringify(decodeLevelCode(item.code)) === JSON.stringify(item.rows), item.name + "：舊碼還原得回原圖");
}

let roundTrips = 0;
let longest = 0;
for (let n = 0; n < 2000; n += 1) {
  const rowCount = EDITOR_MIN_ROWS + Math.floor(Math.random() * (EDITOR_MAX_ROWS - EDITOR_MIN_ROWS + 1));
  const rows = [];
  for (let r = 0; r < rowCount; r += 1) {
    let line = "";
    for (let c = 0; c < EDITOR_COLS; c += 1) {
      line += EDITOR_GLYPHS[Math.floor(Math.random() * EDITOR_GLYPHS.length)];
    }
    rows.push(line);
  }
  if (rows.join("").split("").filter((ch) => ch !== ".").length < 6) {
    continue;
  }
  const code = encodeLevelCode(rows);
  longest = Math.max(longest, code.length);
  if (JSON.stringify(decodeLevelCode(code)) === JSON.stringify(rows)) {
    roundTrips += 1;
  }
}
check(roundTrips > 1500, "隨機圖案往返全數一致", roundTrips + " 次");
check(longest <= 45, "最長的碼仍在 45 字以內（貼得進聊天室）", longest + " 字");

const base = FIXTURES[0].code;
let caught = 0;
let tried = 0;
for (let i = 1; i < base.length; i += 1) {
  for (const ch of "0123456789ABCXYZabcxyz-_") {
    if (base[i] === ch) {
      continue;
    }
    tried += 1;
    if (decodeLevelCode(base.slice(0, i) + ch + base.slice(i + 1)) === null) {
      caught += 1;
    }
  }
}
check(caught / tried > 0.95, "打錯一個字會被擋下來", (caught / tried * 100).toFixed(1) + "%");

const junk = [null, undefined, 123, "", "   ", "B", "hello", base.slice(0, -1), base + "Z", "{}"];
check(junk.every((item) => {
  try {
    return decodeLevelCode(item) === null;
  } catch {
    return false;
  }
}), "各種爛輸入一律回 null，不丟例外");

console.log(fail ? "\n==> " + fail + " 項不合格" : "\n==> 全部通過");
process.exit(fail ? 1 : 0);
