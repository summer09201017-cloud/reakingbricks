// 難度/生命平衡自我檢查(零相依,node test/balance.mjs)。
// 為什麼要有這支:2026-09-26 使用者反映「常死掉」，把生命數與 LIFE 寶物的挑選機率都調高了
// (見 game.js 的 DIFFICULTIES.*.lives / POWERUP_LIMIT_OVERRIDES / POWERUP_WEIGHT_OVERRIDES /
// pickPowerupType())。這些是純數字調整，沒有畫面可以肉眼驗，最容易在下次難度調整時
// 不小心被改回去而沒人發現——用測試釘住「至少要這麼多」，而不是釘住某個絕對數字，
// 之後想再往上調沒問題，往下掉回舊的不夠用數字才會紅。
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

// 從 game.js 原地取出一個 `const NAME = ...;` 宣告(不複製一份,複製的那份遲早過時)。
// 用「配對括號」找結尾，不用「找下一個 \n」——後者遇到跨行的物件/陣列字面值會在還沒
// 讀到收尾括號前就被剪斷，變成語法錯誤(這支測試第一版就踩過這個坑)。
function extractConst(name) {
  const declStart = src.indexOf(`const ${name}`);
  if (declStart < 0) {
    console.error(`[FAIL] 在 game.js 找不到 const ${name}`);
    process.exit(1);
  }
  const eq = src.indexOf("=", declStart);
  let i = eq + 1;
  while (/\s/.test(src[i])) i += 1;
  const openChar = src[i];
  const closeChar = openChar === "{" ? "}" : openChar === "[" ? "]" : null;
  let end;
  if (!closeChar) {
    end = src.indexOf(";", i); // 純數字/字串宣告，例如 const MAX_LIVES = 6;
  } else {
    let depth = 0;
    let j = i;
    for (; j < src.length; j += 1) {
      if (src[j] === openChar) depth += 1;
      else if (src[j] === closeChar) {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    end = src.indexOf(";", j);
  }
  return src.slice(declStart, end + 1);
}

function extractFunction(name) {
  const declStart = src.indexOf(`function ${name}`);
  if (declStart < 0) {
    console.error(`[FAIL] 在 game.js 找不到 function ${name}`);
    process.exit(1);
  }
  const bodyStart = src.indexOf("{", declStart);
  let depth = 0;
  let j = bodyStart;
  for (; j < src.length; j += 1) {
    if (src[j] === "{") depth += 1;
    else if (src[j] === "}") {
      depth -= 1;
      if (depth === 0) break;
    }
  }
  return src.slice(declStart, j + 1);
}

const constsSrc = [
  extractConst("MAX_LIVES"),
  extractConst("POWERUP_LIMIT_PER_TYPE"),
  extractConst("POWERUP_LIMIT_OVERRIDES"),
  extractConst("POWERUP_WEIGHT_OVERRIDES"),
  extractConst("POWERUP_TYPES"),
  extractConst("DIFFICULTIES"),
].join("\n");

// pickPowerupType() 裡面呼叫的 random() 是 game.js 另一支函式(讀 state.mode 決定要不要走
// 每日挑戰的固定種子),這支測試只在意「挑選機率有沒有偏，跟每日挑戰的種子邏輯無關」,
// 給一個最陽春的 Math.random() 版本就夠了。跟上面的常數宣告放進同一個 Function 作用域,
// 不然 pickPowerupType 裡讀不到 POWERUP_WEIGHT_OVERRIDES。
const pickPowerupTypeSrc = extractFunction("pickPowerupType");
const { MAX_LIVES, POWERUP_LIMIT_PER_TYPE, POWERUP_LIMIT_OVERRIDES, POWERUP_WEIGHT_OVERRIDES, POWERUP_TYPES, DIFFICULTIES, pickPowerupType } =
  new Function(
    "random",
    `${constsSrc}
     ${pickPowerupTypeSrc}
     return { MAX_LIVES, POWERUP_LIMIT_PER_TYPE, POWERUP_LIMIT_OVERRIDES, POWERUP_WEIGHT_OVERRIDES, POWERUP_TYPES, DIFFICULTIES, pickPowerupType };`,
  )(Math.random);

// ── ① 生命數:三檔都要比舊版(易4/中3/難2)多、順序不能亂、不能超過 MAX_LIVES ─────────
check(DIFFICULTIES.easy.lives >= 5, "休閒難度生命數 ≥5(舊版是 4，使用者反映常死掉後調高)", String(DIFFICULTIES.easy.lives));
check(DIFFICULTIES.normal.lives >= 4, "標準難度生命數 ≥4(舊版是 3)", String(DIFFICULTIES.normal.lives));
check(DIFFICULTIES.hard.lives >= 3, "挑戰難度生命數 ≥3(舊版是 2)", String(DIFFICULTIES.hard.lives));
check(
  DIFFICULTIES.easy.lives > DIFFICULTIES.normal.lives && DIFFICULTIES.normal.lives > DIFFICULTIES.hard.lives,
  "難度越高生命數越少(順序不能因為調高而亂掉)",
  `${DIFFICULTIES.easy.lives} > ${DIFFICULTIES.normal.lives} > ${DIFFICULTIES.hard.lives}`,
);
for (const key of Object.keys(DIFFICULTIES)) {
  check(DIFFICULTIES[key].lives <= MAX_LIVES, `${key} 難度生命數沒有超過 MAX_LIVES(${MAX_LIVES})`, String(DIFFICULTIES[key].lives));
}

// ── ② LIFE 寶物:單場上限要比其他寶物寬鬆,被抽到的機率也要明顯比均勻分佈高 ────────
check(
  (POWERUP_LIMIT_OVERRIDES.life ?? POWERUP_LIMIT_PER_TYPE) > POWERUP_LIMIT_PER_TYPE,
  "LIFE 寶物單場上限比其他 15 種寬鬆(舊版跟其他寶物一樣只有 2 顆，太容易補命補到滿)",
  `life=${POWERUP_LIMIT_OVERRIDES.life ?? POWERUP_LIMIT_PER_TYPE} vs 其他=${POWERUP_LIMIT_PER_TYPE}`,
);

const trials = 20000;
const counts = {};
for (let i = 0; i < trials; i += 1) {
  const pick = pickPowerupType(POWERUP_TYPES);
  counts[pick.type] = (counts[pick.type] ?? 0) + 1;
}
const lifeShare = (counts.life ?? 0) / trials;
const uniformShare = 1 / POWERUP_TYPES.length;
check(
  lifeShare > uniformShare * 1.5,
  "LIFE 被抽到的機率明顯比均勻分佈高(至少 1.5 倍，不是擺著沒作用的權重表)",
  `life=${(lifeShare * 100).toFixed(1)}% vs 均勻=${(uniformShare * 100).toFixed(1)}%`,
);

console.log(fail === 0 ? "\n==> 全部通過" : `\n==> ${fail} 項失敗`);
process.exit(fail === 0 ? 0 : 1);
