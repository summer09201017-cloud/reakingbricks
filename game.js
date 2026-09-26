const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const appRoot = document.getElementById("appRoot");
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const gameHud = document.querySelector(".game-hud");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const modeLabel = document.getElementById("modeLabel");
const startBtn = document.getElementById("startBtn");
const resumeRunBtn = document.getElementById("resumeRunBtn");
const toggleBtn = document.getElementById("toggleBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const fireBtn = document.getElementById("fireBtn");
const backToSetupBtn = document.getElementById("backToSetupBtn");
const backToSetupOverlayBtn = document.getElementById("backToSetupOverlayBtn");
const installBtn = document.getElementById("installBtn");
const updateBtn = document.getElementById("updateBtn");
const settingsBtn = document.getElementById("settingsBtn");
const versionBtn = document.getElementById("versionBtn");
const editorBtn = document.getElementById("editorBtn");
const editorPanel = document.getElementById("editorPanel");
const editorBrushes = document.getElementById("editorBrushes");
const editorGrid = document.getElementById("editorGrid");
const editorStatus = document.getElementById("editorStatus");
const editorRowMinus = document.getElementById("editorRowMinus");
const editorRowPlus = document.getElementById("editorRowPlus");
const editorClear = document.getElementById("editorClear");
const editorFill = document.getElementById("editorFill");
const editorCode = document.getElementById("editorCode");
const editorCopy = document.getElementById("editorCopy");
const editorLoad = document.getElementById("editorLoad");
const editorPlay = document.getElementById("editorPlay");
const editorClose = document.getElementById("editorClose");
const shareCardPanel = document.getElementById("shareCardPanel");
const shareCardCanvas = document.getElementById("shareCardCanvas");
const shareCardStatus = document.getElementById("shareCardStatus");
const shareCardShareBtn = document.getElementById("shareCardShareBtn");
const shareCardDownloadBtn = document.getElementById("shareCardDownloadBtn");
const shareCardCopyBtn = document.getElementById("shareCardCopyBtn");
const shareCardCloseBtn = document.getElementById("shareCardCloseBtn");
const shareRunBtn = document.getElementById("shareRunBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const difficultySelect = document.getElementById("difficultySelect");
const modeSelect = document.getElementById("modeSelect");
const themeSelect = document.getElementById("themeSelect");
const screenModeSelect = document.getElementById("screenModeSelect");
const paddleSizeSelect = document.getElementById("paddleSizeSelect");
const paddleSizeSelectInGame = document.getElementById("paddleSizeSelectInGame");
const songSelect = document.getElementById("songSelect");
const songSelectInGame = document.getElementById("songSelectInGame");
const musicToggle = document.getElementById("musicToggle");
const sfxToggle = document.getElementById("sfxToggle");
const hapticsToggle = document.getElementById("hapticsToggle");
const assistToggle = document.getElementById("assistToggle");
const render3dToggle = document.getElementById("render3dToggle");
const setupRender3dToggle = document.getElementById("setupRender3dToggle");
const gameCanvas3d = document.getElementById("gameCanvas3d");
const musicVolume = document.getElementById("musicVolume");
const sfxVolume = document.getElementById("sfxVolume");
const musicVolumeValue = document.getElementById("musicVolumeValue");
const sfxVolumeValue = document.getElementById("sfxVolumeValue");
const setupMusicToggle = document.getElementById("setupMusicToggle");
const setupSfxToggle = document.getElementById("setupSfxToggle");
const setupHapticsToggle = document.getElementById("setupHapticsToggle");
const setupAssistToggle = document.getElementById("setupAssistToggle");
const setupMusicVolume = document.getElementById("setupMusicVolume");
const setupSfxVolume = document.getElementById("setupSfxVolume");
const setupMusicVolumeValue = document.getElementById("setupMusicVolumeValue");
const setupSfxVolumeValue = document.getElementById("setupSfxVolumeValue");
const setupBestScoreEl = document.getElementById("setupBestScore");
const setupBestLevelEl = document.getElementById("setupBestLevel");
const setupGamesPlayedEl = document.getElementById("setupGamesPlayed");
const shareDailyBtn = document.getElementById("shareDailyBtn");
const runStatsEl = document.getElementById("runStats");
const topScoreList = document.getElementById("topScoreList");
const achievementList = document.getElementById("achievementList");
const levelProgressEl = document.getElementById("levelProgress");
const remainingBricksEl = document.getElementById("remainingBricks");
const effectHud = document.getElementById("effectHud");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const overlayStats = document.getElementById("overlayStats");
const overlayActions = document.getElementById("overlayActions");
const settingsMenu = document.getElementById("settingsMenu");
const versionPanel = document.getElementById("versionPanel");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");
const quickRestartBtn = document.getElementById("quickRestartBtn");
const installHint = document.getElementById("installHint");
const rotatePrompt = document.getElementById("rotatePrompt");

const APP_VERSION = "2.6.2";
// 更新內容。date = 該批改動真正進 git 的日期（0915 用 `git log -S` 逐條回溯出來的，不是估的）。
// ★ 新增一批時把新的 { date, items } 放在最前面；APP_DATE 會自動跟著走，不必另外維護一份日期。
const CHANGELOG = [
  { date: "2026-09-26", items: [
    "修正立體渲染（3D）模式下吃不到寶物的問題：寶物道具改成跟板子一樣的立體物件，不管鏡頭怎麼擺都會對準板子",
    "修正立體渲染（3D）模式下危險線跑到板子下面的問題：危險線改成跟板子一樣的立體物件，不管鏡頭怎麼擺都不會再跑位",
    "手機直向時板子與危險線改貼齊螢幕底邊（跟橫向一樣，不再另外留拇指區）",
  ] },
  { date: "2026-09-25", items: [
    "新增「立體渲染（3D）」設定：把磚牆、板子、球換成立體方塊來畫，玩法、紀錄、分享碼完全不變，隨時可以切回原本畫面",
    "立體渲染需要透過網路伺服器開啟（不能直接雙擊 index.html），舊裝置若不支援會自動退回 2D",
  ] },
  { date: "2026-09-17", items: [
    "設定新增「板子長度」:極短／短／標準／長／超長五段。覺得手機直向的板子太短就調長一點(越長越好接),想要更難就調短",
    "板長在遊戲中也能改:場上那塊板子當場變長變短,不必退出重來,吃到的加寬寶物也會一起換算",
    "非預設的板長會標在遊戲標題、排行榜與每日挑戰圖卡上,分數不會被誤會成同一個條件下打出來的",
  ] },
  { date: "2026-09-16", items: [
    "手機直向也能玩了：磚牆、板子、球速與拇指區都依直向重新排過，不再強制要求轉橫向",
    "設定新增「畫面方向」：自動（直向橫向都能玩）或固定橫向，想維持原本的橫向玩法可以選後者",
    "玩到一半轉手機不會壞：磚塊、球、寶物與下壓進度會整場搬到新版面，續玩存檔跨方向也接得回來",
    "首頁在橫向手機上把「開始遊玩」固定在畫面底部，不必盲捲兩個畫面才找得到",
    "音量拉桿、核取方塊與下拉選單的可按範圍補到 44px",
    "每日挑戰可以做成分享圖卡：把日期、題號、分數、走到第幾關與那一關的磚塊圖案畫成一張 PNG，存檔或直接分享",
    "圖卡與分享文字改印「今天」的成績，不再拿歷來每日最高分去配今天的日期",
    "每日挑戰結算多一顆「成績圖卡」按鈕，打完就能直接做卡",
    "遊戲畫面多一顆 ⛶ 手動全螢幕鈕：自動轉橫向被瀏覽器擋掉時，還有第二次機會",
    "安裝成 APP 時鎖定橫向；遊戲中的按鈕加大到 44px，手機上比較不會點錯",
  ] },
  { date: "2026-09-15", items: [
    "新增關卡編輯器：自己畫一張關卡，產生分享碼傳給別人，對方貼上就能玩",
    "新增續玩存檔：離開時自動保存整個場面，回來可按「繼續上一局」接著玩",
    "標準與挑戰難度的磚塊會定時下移，碰到紅色危險線會扣一命；休閒難度不下移",
    "Boss 會反擊：往下砸落石，落下前會有紅色預告線，護盾可以擋一次",
    "新增本機排行榜 Top 10，結算會顯示名次或「再多幾分能進榜」",
    "新增卡關輔助：同一關失誤兩次後自動加寬板子，過關後收回，可在設定關閉",
    "強化打擊感：擊碎磚塊、連擊、爆破與失誤會震動畫面並短暫頓格",
    "尊重系統的「減少動態」設定，開啟時完全不震動畫面",
    "每一關改成手繪圖案佈局：城牆、金字塔、拱門、十字、沙漏、棋盤、堡壘、愛心、雙塔、箭頭",
    "關卡倒數會顯示本關圖案名稱",
    "磚塊耐打度改用主題色深淺表示，高關卡不再整片同色",
    "補上完賽匿名計數，讓遊玩統計不再只有開啟次數",
    "版本資訊補上更新日期，更新內容改為依日期分批顯示",
  ] },
  { date: "2026-09-14", items: [
    "修正安裝成主畫面 App 後開啟失敗的問題",
  ] },
  { date: "2026-08-31", items: [
    "畫面右下角會顯示目前實際執行中的版本號",
  ] },
  { date: "2026-08-15", items: [
    "加入零個資的匿名遊玩計數，離線時自動略過，不影響遊戲",
  ] },
  { date: "2026-05-12", items: [
    "新增護盾、磁鐵板、穿透球、分數加倍、吸寶物、炸彈球、慢動作與雙板寶物",
    "新增 LIFE 生命寶物，吃到可增加生命",
    "新增自動雷射、x3/x4 分裂球、道具持續時間條與每日挑戰分享",
    "新增快樂頌等背景音樂曲目切換",
    "新增分裂磚、加速磚、反彈磚與 Boss 大型磚",
    "新增音樂與音效音量滑桿，並讓聲音預設再放大 50%",
    "修正遊戲頁音效按鈕，現在會直接打開聲音設定面板",
    "修正 PC 遊戲畫面置中與寬螢幕裁切問題",
    "提升音樂與碰撞音效音量，並改善音訊解鎖流程",
    "加厚底板並加入手機相對拖曳、PC 點畫布與 Enter 開始",
    "新增設定頁、橫向全螢幕遊戲頁與手機旋轉提示",
    "新增關卡開始倒數與精簡遊戲 HUD",
  ] },
  { date: "2026-05-11", items: [
    "新增主題切換與立體磚塊視覺",
    "新增 Combo 連擊加分",
    "新增快速重開倒數",
    "升級結算畫面與關卡進度提示",
  ] },
];
// 本版發佈日期＝最新一批的日期。刻意用推導的，避免「改了 CHANGELOG 忘了改日期」。
const APP_DATE = CHANGELOG[0].date;
const BALL_RADIUS = 8;
const BIG_BALL_RADIUS = 13;
const BASE_CANVAS_HEIGHT = 560;
// ── 📱 直向版面(0916)──────────────────────────────────────────────────────
// 打磚塊本來就是直式街機:Breakout / Arkanoid 的原生機台是直立螢幕,手機直握、
// 單手拇指就能玩,比橫向更接近原型。但「把橫向的數值原封不動塞進直向」一定壞,
// 因為這個遊戲有三件事是絕對 px:
//   ① 畫布被 CSS 拉滿整個視窗 ⇒ 邏輯畫布的長寬比必須貼近真實視窗,否則整面被壓扁
//   ② 直向的落球距離約是橫向的 2.7 倍 ⇒ 同樣球速會慢到讓人「等球」
//   ③ 板寬是絕對 px ⇒ 在窄畫布上會佔掉四分之一個螢幕,難度整個垮掉
// ★ 為什麼球/寶物/子彈的「大小」不用縮:短邊固定 560 ⇒ 兩個方向的
//   邏輯px→CSSpx 比例接近(直向 390/560=0.70、橫向 844/1428=0.59),
//   絕對 px 的東西在真手機上本來就差不多大。要縮的是「跟場地比例有關」的量:
//   板寬(佔場地多少比例)與球速(場地變高、飛行距離變長)。
const PORTRAIT_BASE_WIDTH = 560;          // 直向邏輯畫布寬(固定);高度由視窗長寬比推
const PORTRAIT_MIN_ASPECT = 1.25;         // 高/寬。iPad 直向 ≈1.33、iPhone ≈2.0
const PORTRAIT_MAX_ASPECT = 2.1;
const PORTRAIT_PADDLE_REF_WIDTH = 1100;   // 橫向板寬(164/136/116)是對著這個畫布寬調出來的
const PORTRAIT_SPEED_SCALE = 1.5;         // ★ 直向手感的主旋鈕:落球距離變 2.7 倍,球速不跟著加就變成等球
const PORTRAIT_PADDLE_SPEED = 6;          // 鍵盤移動速度(直向畫布只有 560 寬,8 太粗)
const PORTRAIT_DESCEND_SCALE = 0.6;       // 直向可下壓的格數多一倍 ⇒ 間隔要縮短,壓力才跟橫向相當
const PADDLE_MIN_WIDTH = 100;             // ← 原本寫死在四處的 clamp(…, 100, 260)
const PADDLE_MAX_WIDTH = 260;
const PADDLE_EXPAND_STEP = 34;            // expand 寶物一次加多少(橫向基準)
// 🎚 板子長度(0917 使用者要求:「直向的檔板有點太短,想長一點就容易一點,更短一點就難一點」)。
//    倍率乘在「難度給的板寬」上 ⇒ 難度與長度是兩支獨立的旋鈕(挑戰難度也可以配超長板)。
//    ★ 為什麼是倍率不是 px:板寬在直向還要再乘一次場地比例(getPaddleScale),
//      寫死 px 的話同一個選項在直向與橫向的意義會不一樣。
const PADDLE_SIZES = {
  xs: { label: "極短", note: "最難", mul: 0.7 },
  s: { label: "短", note: "較難", mul: 0.85 },
  m: { label: "標準", note: "預設", mul: 1 },
  l: { label: "長", note: "較容易", mul: 1.25 },
  xl: { label: "超長", note: "最容易", mul: 1.6 },
};
const DEFAULT_PADDLE_SIZE = "m";
const POWERUP_FALL_SPEED = 2.35;
const BULLET_SPEED = 11.2;
const PADDLE_HEIGHT = 22;
const PADDLE_BOTTOM_GAP = 28;
const TOUCH_DRAG_SENSITIVITY = 1.18;
const BASE_MUSIC_GAIN = 0.21;
const BASE_SFX_GAIN = 0.75;
const MAX_BALLS = 10;
const MAX_LIVES = 6;
const POWERUP_LIMIT_PER_TYPE = 2;
const GUN_DURATION = 14;
const BIG_BALL_DURATION = 16;
const MAGNET_DURATION = 16;
const PIERCE_DURATION = 13;
const SCORE_MULTIPLIER_DURATION = 15;
const POWERUP_MAGNET_DURATION = 16;
const TIME_SLOW_DURATION = 11;
const SHADOW_PADDLE_DURATION = 16;
const SCORE_MULTIPLIER = 2;
const SHIELD_MAX_CHARGES = 3;
const BOMB_BALL_MAX_CHARGES = 3;
const AUTO_FIRE_INTERVAL = 0.32;
const BOSS_INTERVAL = 4;
// 🛟 手殘救援(0915):同一關連續失誤就自動加寬板子,給孩子用。
//    ★ 觸發設 2 而不是 3:標準難度只有 3 條命,第 3 次失誤就是 Game Over,
//      設 3 等於永遠來不及出手;設 2 在休閒/標準/挑戰三種難度都還救得到。
const ASSIST_DEATHS_TRIGGER = 2;
const ASSIST_PADDLE_BONUS = 30;
const ASSIST_MAX_STACKS = 3;
// 💥 打擊感(0915):震屏 + 頓幀。打磚塊的命脈是「打到東西的手感」,原本偏軟。
//    ★ 一律尊重 prefers-reduced-motion:這個系統設定就是給前庭敏感/暈動症的人用的,
//      震屏正是最會誘發不適的那一類效果。開了就完全不震(值歸零,不是減弱)。
// 👹 BOSS 反擊(0915):BOSS 原本只是一塊很厚的磚,打起來是「磨血」不是「戰鬥」。
//    改成會往下砸落石。★ 照 beast-boss-kit 鐵則:一定要有紅色預告線(telegraph),
//    判定=畫面 —— 無預警從天而降的秒殺對孩子只是「莫名其妙死掉」,不是難度。
// ⬇ 磚塊下壓(0915):每隔一段時間整面往下移一格,製造時間壓力。
//    ★ 依難度分級,休閒完全關閉 —— 這是給孩子玩的難度,不該有倒數壓力。
//    ★ BOSS 關不下壓:BOSS 已經在砸落石,再加下壓等於兩套壓力疊在一起。
//    ★ 壓到危險線不是直接 Game Over,而是扣一命並把磚塊推回去 —— 否則復活後
//      磚塊還在線上,會變成「復活即死」的無限迴圈,一次把所有命吃光。
// 列距(磚高 + 間隙)不再是常數:直向的磚塊比較高,兩個方向各有一份 ⇒ 看 getBrickRowPitch()。
const DESCEND_PUSHBACK_ROWS = 3;     // 撞線扣命後把磚塊推回幾格
const DESCEND_WARN_SEC = 2;          // 下壓前幾秒開始閃警告
const BOSS_TELEGRAPH_SEC = 0.85;   // 預告線亮多久才真的砸下來
const BOSS_ROCK_SPEED = 3.4;       // 落石速度(px / 16.67ms)
const BOSS_ROCK_RADIUS = 9;
const BOSS_ATTACK_BASE = 4.2;      // 兩次攻擊間隔(秒),難度與關卡會縮短
const BOSS_ATTACK_MIN = 1.9;
const SHAKE_DECAY = 7.5;          // 每秒衰減倍率
const SHAKE_MAX = 9;              // 位移上限(px),再大就從「有力」變成「看不清」
const HITSTOP_MAX = 0.085;        // 頓幀上限(秒)
const reduceMotionQuery = typeof window.matchMedia === "function"
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : null;
let prefersReducedMotion = reduceMotionQuery ? reduceMotionQuery.matches : false;
if (reduceMotionQuery) {
  const onReduceMotionChange = (event) => {
    prefersReducedMotion = event.matches;
    if (prefersReducedMotion) {
      state.shake = 0;
      state.hitStop = 0;
    }
  };
  // Safari 14 以前只有 addListener,沒有 addEventListener
  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", onReduceMotionChange);
  } else if (typeof reduceMotionQuery.addListener === "function") {
    reduceMotionQuery.addListener(onReduceMotionChange);
  }
}

// 加一次震動與頓幀。strength 是「這一下有多重」(0~1 之間的相對值)。
function addImpact(strength, stopSec = 0) {
  if (prefersReducedMotion) {
    return;
  }
  state.shake = Math.min(SHAKE_MAX, state.shake + strength);
  if (stopSec > 0) {
    state.hitStop = Math.min(HITSTOP_MAX, state.hitStop + stopSec);
  }
}
const STORAGE_KEYS = {
  preferences: "breakout.preferences.v2",
  records: "breakout.records.v2",
  run: "breakout.run.v1",
};

// 💾 續玩存檔(0915)。★ schema 版本:場上物件的形狀一改,舊存檔還原出來就是壞的,
//    寧可丟掉重來,也不要讓玩家接到一個半壞的局面。改過 brick/ball/powerup 欄位就要 +1。
const RUN_SAVE_VERSION = 4;   // 4:存檔帶上「存的時候是什麼版面」(直向支援),舊存檔的座標沒有方向資訊
const RUN_SAVE_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;   // 超過三天的存檔不留,接回來只會一頭霧水

const DIFFICULTIES = {
  easy: {
    descendSec: 0,  // 休閒不下壓
    label: "休閒",
    lives: 4,
    paddleWidth: 164,
    ballSpeed: 4.25,
    dropRate: 0.4,
    hpBonus: 0,
    specialRate: 0.08,
  },
  normal: {
    descendSec: 26,
    label: "標準",
    lives: 3,
    paddleWidth: 136,
    ballSpeed: 4.8,
    dropRate: 0.3,
    hpBonus: 0,
    specialRate: 0.14,
  },
  hard: {
    descendSec: 17,
    label: "挑戰",
    lives: 2,
    paddleWidth: 116,
    ballSpeed: 5.35,
    dropRate: 0.24,
    hpBonus: 1,
    specialRate: 0.2,
  },
};

const MODES = {
  classic: "經典模式",
  daily: "每日挑戰",
};

const THEMES = {
  classic: {
    label: "經典立體",
    background: ["#0f345f", "#102a4b", "#0a1b34"],
    paddle: ["#fff7b0", "#ffb84d"],
    ball: ["#ffffff", "#8be9ff", "#2ea8ff"],
    palette: ["#55c1ff", "#63e6be", "#ffe66d", "#ffaf54", "#ff7f7f"],
  },
  neon: {
    label: "霓虹",
    background: ["#151b44", "#24114f", "#09091f"],
    paddle: ["#9dffe5", "#ff65d8"],
    ball: ["#ffffff", "#68fff0", "#ff4fd8"],
    palette: ["#00e5ff", "#00ffc8", "#ffe66d", "#ff4fd8", "#a071ff"],
  },
  candy: {
    label: "糖果",
    background: ["#6f9fff", "#72d6ff", "#ffbfd9"],
    paddle: ["#ffffff", "#ff8ab3"],
    ball: ["#ffffff", "#fff0a8", "#ff8ab3"],
    palette: ["#ff8ab3", "#92f2d0", "#fff08a", "#9ed8ff", "#d7a7ff"],
  },
  stone: {
    label: "石磚",
    background: ["#52606d", "#334e68", "#102a43"],
    paddle: ["#d9e2ec", "#829ab1"],
    ball: ["#ffffff", "#bcccdc", "#486581"],
    palette: ["#bcccdc", "#9fb3c8", "#d9e2ec", "#829ab1", "#f0b429"],
  },
};

// 🧱 關卡圖案(B1,0915):原本每一關都是 6×10 滿版矩形,只有 HP 在變 ——
//    玩家第 3 關就看完了全部畫面。改成一組手設計的圖案依關卡輪替。
//    圖例:# 一般磚 / . 空 / S 鋼鐵 / B 爆破 / M 移動。每列固定 PATTERN_COLS 格。
//    ★ 強制特殊磚只在第 2 關起生效(沿用 pickSpecialBrick 的「第 1 關不出特殊磚」規則)。
//    ★ 圖案由關卡編號決定 ⇒ 每日挑戰同一天同一關仍然完全一致。
const PATTERN_COLS = 10;
const LEVEL_PATTERNS = [
  { name: "城牆", rows: [
    "##########",
    "##########",
    "##########",
    "#.##..##.#",
    ".##.##.##.",
  ] },
  { name: "金字塔", rows: [
    "....##....",
    "...####...",
    "..######..",
    ".########.",
    "##########",
  ] },
  { name: "拱門", rows: [
    "..######..",
    ".########.",
    "##########",
    "###....###",
    "##......##",
    "##......##",
  ] },
  { name: "十字", rows: [
    "....##....",
    "....##....",
    "....##....",
    "##########",
    "##########",
    "....##....",
    "....##....",
  ] },
  { name: "沙漏", rows: [
    "##########",
    ".#......#.",
    "..#....#..",
    "...####...",
    "..#....#..",
    ".#......#.",
    "##########",
  ] },
  { name: "棋盤", rows: [
    "#.#.#.#.#.",
    ".#.#.#.#.#",
    "#.#.#.#.#.",
    ".#.#.#.#.#",
    "#.#.#.#.#.",
    ".#.#.#.#.#",
  ] },
  { name: "堡壘", rows: [
    "SS######SS",
    "S........S",
    "#..BBBB..#",
    "#..BBBB..#",
    "S........S",
    "SS######SS",
  ] },
  { name: "愛心", rows: [
    ".##....##.",
    "##########",
    "##########",
    ".########.",
    "..######..",
    "...####...",
    "....##....",
  ] },
  { name: "雙塔", rows: [
    "##......##",
    "##......##",
    "##......##",
    "##########",
    "##.MMMM.##",
    "##########",
  ] },
  { name: "箭頭", rows: [
    "....##....",
    "...####...",
    "..######..",
    ".###..###.",
    "###....###",
    "..#....#..",
    "..#....#..",
  ] },
];
const PATTERN_SPECIALS = { S: "steel", B: "bomb", M: "moving" };

// ── 🧩 自訂關卡：分享碼編解碼（0915）────────────────────────────────────────
// 目標：一串「短到能貼進訊息、看得出是這個遊戲的碼、打錯一個字會被擋下來」的字串。
//
// 格式：B <列數> <格子> <檢查碼>
//   - 開頭固定 "B"：讓人一眼看出這是打磚塊的碼，也擋掉隨手貼錯的東西。
//   - 列數 1 碼：ALPHABET[列數]。
//   - 格子：每格 5 種狀態（. # S B M），兩格打包成一個字（5×5=25 < 64），
//     所以 10 欄 × 8 列 = 80 格只要 40 個字，整串約 43 字，貼得進任何聊天室。
//   - 檢查碼 1 碼：打錯一個字幾乎一定被擋下來，不會還原出一張莫名其妙的圖。
const EDITOR_COLS = PATTERN_COLS;          // 跟內建圖案同寬，換算與渲染才共用得了
const EDITOR_MIN_ROWS = 3;
const EDITOR_MAX_ROWS = 8;                 // 再多就會長到底板附近
const EDITOR_MIN_BRICKS = 6;               // 太少的關卡一秒就破，沒有意義
const SHARE_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const SHARE_PREFIX = "B";
const EDITOR_GLYPHS = [".", "#", "S", "B", "M"];   // 索引即狀態值
const EDITOR_GLYPH_LABELS = {
  ".": "空白",
  "#": "一般磚",
  S: "鋼鐵磚",
  B: "爆破磚",
  M: "移動磚",
};

function encodeLevelCode(rows) {
  const flat = [];
  for (let r = 0; r < rows.length; r += 1) {
    for (let c = 0; c < EDITOR_COLS; c += 1) {
      const glyph = rows[r][c] || ".";
      const index = EDITOR_GLYPHS.indexOf(glyph);
      flat.push(index < 0 ? 0 : index);
    }
  }

  let body = "";
  for (let i = 0; i < flat.length; i += 2) {
    const a = flat[i];
    const b = i + 1 < flat.length ? flat[i + 1] : 0;
    body += SHARE_ALPHABET[a * 5 + b];
  }

  const head = SHARE_PREFIX + SHARE_ALPHABET[rows.length];
  return head + body + SHARE_ALPHABET[shareChecksum(head + body)];
}

function shareChecksum(text) {
  let sum = 7;
  for (let i = 0; i < text.length; i += 1) {
    sum = (sum * 31 + text.charCodeAt(i)) % 64;
  }
  return sum;
}

// 解碼。任何一關過不了就回 null —— 寧可說「這個碼看起來怪怪的」，
// 也不要還原出一張半壞的圖讓人以為是自己畫錯。
function decodeLevelCode(code) {
  if (typeof code !== "string") {
    return null;
  }
  const clean = code.trim().replace(/\s+/g, "");
  if (clean.length < 4 || clean[0] !== SHARE_PREFIX) {
    return null;
  }

  const body = clean.slice(0, -1);
  const checkChar = clean[clean.length - 1];
  if (SHARE_ALPHABET.indexOf(checkChar) !== shareChecksum(body)) {
    return null;   // 少打／多打／打錯一個字都會落在這裡
  }

  const rowCount = SHARE_ALPHABET.indexOf(body[1]);
  if (rowCount < EDITOR_MIN_ROWS || rowCount > EDITOR_MAX_ROWS) {
    return null;
  }

  const cells = [];
  for (let i = 2; i < body.length; i += 1) {
    const value = SHARE_ALPHABET.indexOf(body[i]);
    if (value < 0 || value > 24) {
      return null;
    }
    cells.push(Math.floor(value / 5), value % 5);
  }

  const needed = rowCount * EDITOR_COLS;
  if (cells.length < needed) {
    return null;
  }

  const rows = [];
  for (let r = 0; r < rowCount; r += 1) {
    let line = "";
    for (let c = 0; c < EDITOR_COLS; c += 1) {
      line += EDITOR_GLYPHS[cells[r * EDITOR_COLS + c]] || ".";
    }
    rows.push(line);
  }

  const bricks = rows.join("").split("").filter((ch) => ch !== ".").length;
  if (bricks < EDITOR_MIN_BRICKS) {
    return null;   // 空圖或幾乎空的圖：還原了也是一開場就過關
  }
  return rows;
}

function createBlankEditorRows(rowCount = 5) {
  return Array.from({ length: clamp(rowCount, EDITOR_MIN_ROWS, EDITOR_MAX_ROWS) },
    () => ".".repeat(EDITOR_COLS));
}

function countEditorBricks(rows) {
  return rows.join("").split("").filter((ch) => ch !== ".").length;
}

const POWERUP_TYPES = [
  { type: "laser", label: "GUN", color: "#ff93db" },
  { type: "expand", label: "WIDE", color: "#98f5b4" },
  { type: "bigball", label: "BIG", color: "#ffcf70" },
  { type: "multiball", label: "x2", color: "#ffe680" },
  { type: "multiball3", label: "x3", color: "#ffd166" },
  { type: "multiball4", label: "x4", color: "#f6bd60" },
  { type: "slow", label: "SLOW", color: "#8ed8ff" },
  { type: "life", label: "LIFE", color: "#7ae582" },
  { type: "shield", label: "SAFE", color: "#67e8f9" },
  { type: "magnet", label: "MAG", color: "#c084fc" },
  { type: "pierce", label: "PEN", color: "#bef264" },
  { type: "score2x", label: "2X", color: "#facc15" },
  { type: "attract", label: "PULL", color: "#38bdf8" },
  { type: "bombball", label: "BOOM", color: "#fb7185" },
  { type: "timeslow", label: "TIME", color: "#93c5fd" },
  { type: "shadow", label: "DUO", color: "#a7f3d0" },
];

const ACHIEVEMENTS = [
  { id: "first_powerup", title: "初次收集", description: "吃到第一個寶物" },
  { id: "score_500", title: "五百分", description: "單局分數達到 500" },
  { id: "level_3", title: "闖關者", description: "抵達第 3 關" },
  { id: "no_miss_level", title: "穩如節拍", description: "無失誤通過一關" },
  { id: "collector", title: "收藏家", description: "單局吃到 5 個寶物" },
  { id: "daily_player", title: "每日報到", description: "遊玩每日挑戰" },
  { id: "laser_ace", title: "雷射手感", description: "單局雷射命中 10 次" },
  { id: "hard_mode", title: "硬派玩家", description: "挑戰難度抵達第 2 關" },
];

const stars = Array.from({ length: 20 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * (canvas.height * 0.52),
  r: 0.8 + Math.random() * 2.2,
  alpha: 0.15 + Math.random() * 0.35,
}));

const defaultPreferences = {
  music: true,
  sfx: true,
  haptics: true,
  assist: true,
  render3d: false, // 🧊 立體渲染(2026-09-25):純視覺開關,物理/存檔/分享碼完全不受影響
  musicVolume: 100,
  sfxVolume: 100,
  song: "arcade",
  difficulty: "normal",
  mode: "classic",
  theme: "classic",
  // 📱 auto = 手機怎麼拿就怎麼玩(直向也能玩);landscape = 舊行為,直向時要求轉橫
  screenMode: "auto",
  // 🎚 板子長度(見 PADDLE_SIZES)。和難度分開存:改難度不會把長度洗掉。
  paddleSize: DEFAULT_PADDLE_SIZE,
};

const TOP_SCORES_MAX = 10;

const defaultRecords = {
  topScores: [],
  bestScore: 0,
  bestLevel: 1,
  bestDailyScore: 0,
  // 🖼 只留「今天」那一筆每日成績（0916）：分享圖卡要印日期，就不能拿歷來最高分去配今天的日期。
  //    key 不是今天就視同沒挑戰過（跨日自動作廢），舊存檔沒有這個欄位也不會炸。
  dailyToday: null,
  gamesPlayed: 0,
  achievements: [],
};

const preferences = loadStoredObject(STORAGE_KEYS.preferences, defaultPreferences);
const records = loadStoredObject(STORAGE_KEYS.records, defaultRecords);
let unlockedAchievements = new Set(records.achievements || []);

const state = {
  running: false,
  gameOver: false,
  score: 0,
  lives: 3,
  level: 1,
  gunTimer: 0,
  shotCooldown: 0,
  bigBallTimer: 0,
  magnetTimer: 0,
  pierceTimer: 0,
  scoreMultiplierTimer: 0,
  powerupMagnetTimer: 0,
  timeSlowTimer: 0,
  shadowPaddleTimer: 0,
  shieldCharges: 0,
  bombBallCharges: 0,
  combo: 0,
  comboTimer: 0,
  restartCountdown: 0,
  levelName: "",
  assistStacks: 0,
  assistWidthBonus: 0,
  customRows: null,   // 自訂關卡的 ASCII 圖案；null = 玩內建關卡
  shake: 0,
  hitStop: 0,
  bossAttackTimer: 0,
  descendTimer: 0,
  descendShown: false,
  // ⬇ 已經下壓了幾格。轉手機/改視窗要重排磚塊時,靠它把下壓的位移原樣帶過去,
  //   否則轉一下手機就把壓力歸零(等於多一個免費的「重置鍵」)。
  descendRows: 0,
  mode: preferences.mode in MODES ? preferences.mode : "classic",
  difficulty: preferences.difficulty in DIFFICULTIES ? preferences.difficulty : "normal",
  theme: preferences.theme in THEMES ? preferences.theme : "classic",
};

const keys = {
  left: false,
  right: false,
};

const paddle = {
  width: 136,
  height: PADDLE_HEIGHT,
  x: 0,
  y: canvas.height - PADDLE_BOTTOM_GAP - PADDLE_HEIGHT,
  speed: 8,
  dx: 0,
};

const touchControl = {
  active: false,
  startX: 0,
  startPaddleX: 0,
  moved: false,
};

let balls = [];
let bricks = [];
let powerups = [];
let bullets = [];
let floatingTexts = [];
let bossRocks = [];      // { x, y, vy, telegraph } —— telegraph > 0 時只畫預告線、還不會動
let powerupSpawnCounts = createPowerupCounter();
let sessionStats = createSessionStats();
let seededRandom = Math.random;
let dailyKey = getTodayKey();
let shareCardData = null;   // 🖼 目前畫在分享圖卡上的那一包資料（下載／分享／複製文字共用同一份）

let audioCtx = null;
let musicGain = null;
let sfxGain = null;
let musicTimerId = null;
let nextMusicTime = 0;
let musicStepIndex = 0;
let deferredInstallPrompt = null;
let waitingServiceWorker = null;
let refreshingForUpdate = false;
let isGameScreenActive = false;
let pendingStartAfterLandscape = false;
let pendingNewGameAfterLandscape = false;
let pendingResumeAfterLandscape = false;   // 續玩:轉橫向後直接倒數,不可以走 restartGame(那會把場面清掉)
let levelCountdownTimerId = null;

const SONGS = {
  arcade: {
    label: "街機跳躍",
    step: 0.22,
    pattern: [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46],
  },
  joy: {
    label: "快樂頌",
    step: 0.28,
    pattern: [329.63, 329.63, 349.23, 392, 392, 349.23, 329.63, 293.66, 261.63, 261.63, 293.66, 329.63, 329.63, 293.66, 293.66],
  },
  canon: {
    label: "卡農律動",
    step: 0.24,
    pattern: [392, 493.88, 587.33, 739.99, 659.25, 587.33, 659.25, 493.88],
  },
  chill: {
    label: "放鬆節拍",
    step: 0.32,
    pattern: [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23],
  },
};

function loadStoredObject(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return { ...fallback };
    }
    return { ...fallback, ...JSON.parse(stored) };
  } catch {
    return { ...fallback };
  }
}

function saveStoredObject(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can be unavailable in private browsing; the game still runs.
  }
}

function savePreferences() {
  saveStoredObject(STORAGE_KEYS.preferences, preferences);
}

function saveRecords() {
  records.achievements = Array.from(unlockedAchievements);
  saveStoredObject(STORAGE_KEYS.records, records);
}

// 🏆 本機 Top 10(0915)。只在「一局真正結束」時入榜 —— 中途退回設定頁不算,
//    跟 -done 完賽打點同一個語意,否則榜上會塞滿沒打完的半局。
function normalizeTopScores() {
  const list = Array.isArray(records.topScores) ? records.topScores : [];
  const cleaned = list
    .filter((row) => row && Number.isFinite(Number(row.score)))
    .map((row) => ({
      score: Math.max(0, Math.floor(Number(row.score))),
      level: Math.max(1, Math.floor(Number(row.level) || 1)),
      mode: row.mode in MODES ? row.mode : "classic",
      difficulty: row.difficulty in DIFFICULTIES ? row.difficulty : "normal",
      // 舊紀錄沒有板長欄位(v2.5.0 以前根本沒這個選項)⇒ 當成標準,而不是「不知道」
      paddle: row.paddle in PADDLE_SIZES ? row.paddle : DEFAULT_PADDLE_SIZE,
      // 舊資料沒有日期就是沒有,不要編一個今天的日期上去
      date: typeof row.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(row.date) ? row.date : null,
    }))
    .sort((a, b) => b.score - a.score || b.level - a.level)
    .slice(0, TOP_SCORES_MAX);
  records.topScores = cleaned;
  return cleaned;
}

// 舊玩家只有 bestScore、沒有榜。把它補成第一筆,日期留 null（不偽造）。
function migrateTopScores() {
  normalizeTopScores();
  if (records.topScores.length === 0 && records.bestScore > 0) {
    records.topScores = [{
      score: records.bestScore,
      level: Math.max(1, records.bestLevel || 1),
      mode: "classic",
      difficulty: "normal",
      date: null,
    }];
    saveRecords();
  }
}

// 這個分數排第幾(1 起算);進不了榜回 0。
function getTopScoreRank(score) {
  const list = normalizeTopScores();
  const better = list.filter((row) => row.score > score).length;
  if (better >= TOP_SCORES_MAX) {
    return 0;
  }
  return better + 1;
}

// 還差幾分才進得了榜;已經進得去回 0。
function getPointsToEnterTop(score) {
  const list = normalizeTopScores();
  if (list.length < TOP_SCORES_MAX) {
    return 0;
  }
  const lowest = list[list.length - 1].score;
  return score > lowest ? 0 : lowest - score + 1;
}

// 一局結束時登錄。回傳名次(0 = 沒進榜)。
function recordRunScore() {
  // 自訂關卡不進排行榜:每張圖難度天差地遠,混在一起比分數沒有意義。
  if (state.customRows) {
    return 0;
  }
  if (state.score <= 0) {
    return 0;
  }
  normalizeTopScores();
  records.topScores.push({
    score: state.score,
    level: sessionStats.highestLevel,
    mode: state.mode,
    difficulty: state.difficulty,
    // 板長也記:同一張榜上「超長板的 3000 分」和「極短板的 3000 分」不是同一件事
    paddle: getPaddleSizeKey(),
    date: getTodayKey(),
  });
  normalizeTopScores();
  saveRecords();
  renderTopScores();
  const rank = records.topScores.findIndex((row) =>
    row.score === state.score && row.date === getTodayKey() && row.level === sessionStats.highestLevel);
  return rank >= 0 ? rank + 1 : 0;
}

function renderTopScores() {
  if (!topScoreList) {
    return;
  }
  const list = normalizeTopScores();
  if (list.length === 0) {
    topScoreList.innerHTML = `<p class="top-empty">還沒有紀錄，打完一局就會出現在這裡。</p>`;
    return;
  }
  topScoreList.innerHTML = list.map((row, i) => {
    const paddleNote = row.paddle && row.paddle !== DEFAULT_PADDLE_SIZE
      ? ` · 板${PADDLE_SIZES[row.paddle].label}`
      : "";
    return `
    <p class="top-row${i === 0 ? " top-row-first" : ""}">
      <span class="top-rank">${i + 1}</span>
      <strong class="top-score">${row.score}</strong>
      <span class="top-meta">第 ${row.level} 關 · ${DIFFICULTIES[row.difficulty].label} · ${MODES[row.mode]}${paddleNote}</span>
      <span class="top-date">${row.date || "—"}</span>
    </p>
  `;
  }).join("");
}

// ── 💾 續玩存檔 ────────────────────────────────────────────────────────────
// 存的是「整個場面」而不是「關卡編號」：磚塊打到一半、寶物掉到一半、球在飛，
// 回來時要接得上原本那一刻，不然等於只是記住進度而已。

function hasStartedRun() {
  return !state.gameOver && (state.score > 0 || state.level > 1 || countAliveBricks() < bricks.length);
}

function serializeRun() {
  const stats = sessionStats;
  return {
    v: RUN_SAVE_VERSION,
    savedAt: Date.now(),
    dailyKey,
    // seededRandom 抽到哪裡也要存，否則每日挑戰續玩後的序列會跟別人不一樣
    rngState: typeof seededRandom.getState === "function" ? seededRandom.getState() : null,
    mode: state.mode,
    difficulty: state.difficulty,
    theme: state.theme,
    score: state.score,
    lives: state.lives,
    level: state.level,
    levelName: state.levelName,
    combo: state.combo,
    comboTimer: state.comboTimer,
    shieldCharges: state.shieldCharges,
    bombBallCharges: state.bombBallCharges,
    assistStacks: state.assistStacks,
    assistWidthBonus: state.assistWidthBonus,
    descendShown: state.descendShown,
    descendRows: state.descendRows,
    // 📱 存檔當時的版面。換方向(或換一台螢幕比例不同的裝置)續玩時,
    //    要靠這三個數字把座標搬過來,否則球會在畫面外、磚塊會橫著溢出。
    cw: canvas.width,
    ch: canvas.height,
    pt: isPortraitLayout(),
    pb: getPaddleBaseWidth(),
    timers: {
      gun: state.gunTimer,
      bigBall: state.bigBallTimer,
      magnet: state.magnetTimer,
      pierce: state.pierceTimer,
      scoreMultiplier: state.scoreMultiplierTimer,
      powerupMagnet: state.powerupMagnetTimer,
      timeSlow: state.timeSlowTimer,
      shadowPaddle: state.shadowPaddleTimer,
    },
    paddle: { x: paddle.x, width: paddle.width },
    // 只存活著的磚：死掉的磚還原後也是死的，存了只是讓存檔變大
    bricks: bricks.filter((brick) => brick.alive).map((brick) => ({
      x: brick.x, bx: brick.baseX, y: brick.y, r: brick.row, c: brick.col,
      w: brick.width, h: brick.height, hp: brick.hp, mhp: brick.maxHp,
      sp: brick.special, mp: brick.movePhase, mr: brick.moveRange,
    })),
    totalBricks: stats.totalBricks,
    balls: balls.map((ball) => ({ x: ball.x, y: ball.y, vx: ball.vx, vy: ball.vy, s: ball.stuck })),
    powerups: powerups.map((item) => ({ x: item.x, y: item.y, t: item.type })),
    powerupSpawnCounts,
    stats,
  };
}

function saveRun() {
  try {
    if (!isGameScreenActive || state.gameOver || !hasStartedRun()) {
      return;
    }
    if (state.customRows) {
      return;   // 自訂關卡只有一關,存了也沒什麼好接的;而且存檔沒帶圖案
    }
    saveStoredObject(STORAGE_KEYS.run, serializeRun());
  } catch {
    // 存檔壞掉絕不可以影響遊戲本身
  }
}

function clearSavedRun() {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.run);
  } catch {
    // 無痕模式拿不到 localStorage，忽略
  }
  updateResumeButton();
}

// 讀出「還能用」的存檔；版本不符、過期、或跨日的每日挑戰一律當作沒有。
function loadSavedRun() {
  let saved = null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.run);
    if (!raw) {
      return null;
    }
    saved = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!saved || saved.v !== RUN_SAVE_VERSION) {
    return null;
  }
  if (!Number.isFinite(saved.savedAt) || Date.now() - saved.savedAt > RUN_SAVE_MAX_AGE_MS) {
    return null;
  }
  if (!Array.isArray(saved.bricks) || !Array.isArray(saved.balls) || saved.bricks.length === 0) {
    return null;   // 沒有磚 = 還原出來就是「一開場就過關」
  }
  if (!(saved.difficulty in DIFFICULTIES) || !(saved.mode in MODES)) {
    return null;
  }
  // 每日挑戰跨日就作廢：今天的題目已經換了，接回昨天的局面沒有意義
  if (saved.mode === "daily" && saved.dailyKey !== getTodayKey()) {
    return null;
  }
  return saved;
}

function restoreRun(saved) {
  cancelLevelCountdown();
  cancelRestartCountdown();

  state.mode = saved.mode;
  state.difficulty = saved.difficulty;
  state.theme = saved.theme in THEMES ? saved.theme : state.theme;
  preferences.mode = state.mode;
  preferences.difficulty = state.difficulty;
  preferences.theme = state.theme;
  savePreferences();

  // 先把亂數來源建好再還原位置，順序反了就白做
  resetRandomSource();
  dailyKey = typeof saved.dailyKey === "string" ? saved.dailyKey : getTodayKey();
  if (saved.rngState !== null && typeof seededRandom.setState === "function") {
    seededRandom.setState(saved.rngState);
  }

  state.running = false;
  state.gameOver = false;
  state.score = Math.max(0, Math.floor(saved.score) || 0);
  state.lives = clamp(Math.floor(saved.lives) || 1, 1, MAX_LIVES);
  state.level = Math.max(1, Math.floor(saved.level) || 1);
  state.levelName = typeof saved.levelName === "string" ? saved.levelName : "";
  state.combo = Math.max(0, Math.floor(saved.combo) || 0);
  state.comboTimer = Math.max(0, Number(saved.comboTimer) || 0);
  state.shieldCharges = clamp(Math.floor(saved.shieldCharges) || 0, 0, SHIELD_MAX_CHARGES);
  state.bombBallCharges = clamp(Math.floor(saved.bombBallCharges) || 0, 0, BOMB_BALL_MAX_CHARGES);
  state.assistStacks = clamp(Math.floor(saved.assistStacks) || 0, 0, ASSIST_MAX_STACKS);
  state.assistWidthBonus = Math.max(0, Number(saved.assistWidthBonus) || 0);
  state.descendShown = !!saved.descendShown;
  state.descendRows = Math.round(Number(saved.descendRows) || 0);
  state.restartCountdown = 0;
  state.shake = 0;
  state.hitStop = 0;
  state.bossAttackTimer = 0;
  state.descendTimer = 0;

  const timers = saved.timers || {};
  state.gunTimer = Math.max(0, Number(timers.gun) || 0);
  state.bigBallTimer = Math.max(0, Number(timers.bigBall) || 0);
  state.magnetTimer = Math.max(0, Number(timers.magnet) || 0);
  state.pierceTimer = Math.max(0, Number(timers.pierce) || 0);
  state.scoreMultiplierTimer = Math.max(0, Number(timers.scoreMultiplier) || 0);
  state.powerupMagnetTimer = Math.max(0, Number(timers.powerupMagnet) || 0);
  state.timeSlowTimer = Math.max(0, Number(timers.timeSlow) || 0);
  state.shadowPaddleTimer = Math.max(0, Number(timers.shadowPaddle) || 0);
  state.shotCooldown = 0;

  const savedStats = saved.stats && typeof saved.stats === "object" ? saved.stats : {};
  sessionStats = { ...createSessionStats(), ...savedStats };
  sessionStats.powerupCounts = { ...createPowerupCounter(), ...(savedStats.powerupCounts || {}) };
  sessionStats.totalBricks = Math.max(0, Math.floor(saved.totalBricks) || 0);
  powerupSpawnCounts = { ...createPowerupCounter(), ...(saved.powerupSpawnCounts || {}) };

  const palette = getThemeConfig().palette;
  bricks = saved.bricks.map((row) => {
    const r = Math.max(0, Math.floor(row.r) || 0);
    const c = Math.max(0, Math.floor(row.c) || 0);
    const hp = Math.max(1, Math.floor(row.hp) || 1);
    return {
      x: Number(row.x) || 0,
      baseX: Number(row.bx) || Number(row.x) || 0,
      y: Number(row.y) || 0,
      row: r,
      col: c,
      width: Math.max(1, Number(row.w) || 1),
      height: Math.max(1, Number(row.h) || 1),
      hp,
      maxHp: Math.max(hp, Math.floor(row.mhp) || hp),
      // 主題可能在存檔之後被改過，顏色重算才不會和目前主題打架
      color: palette[(r + c) % palette.length],
      alive: true,
      special: typeof row.sp === "string" ? row.sp : null,
      movePhase: Number(row.mp) || 0,
      moveRange: Number(row.mr) || 0,
    };
  });
  if (sessionStats.totalBricks < bricks.length) {
    sessionStats.totalBricks = bricks.length;
  }

  // ⚠ 這裡先原封不動吃下存檔的數值(它是「存檔當時那個版面」的單位),
  //   等 resizeCanvasForScreen() 帶著 pendingRestoreLayout 換算過去再夾上下限。
  paddle.width = Math.max(1, Number(saved.paddle && saved.paddle.width) || getPaddleBaseWidth());
  positionPaddleY();
  paddle.x = Math.max(0, Number(saved.paddle && saved.paddle.x) || 0);

  setBallRadius(state.bigBallTimer > 0 ? BIG_BALL_RADIUS : BALL_RADIUS);
  balls = saved.balls.slice(0, MAX_BALLS).map((ball) => ({
    x: Number(ball.x) || 0,
    y: Number(ball.y) || 0,
    radius: getBallRadius(),
    vx: Number(ball.vx) || 0,
    vy: Number(ball.vy) || 0,
    stuck: !!ball.s,
  }));
  if (balls.length === 0) {
    resetBallsOnPaddle();
  }

  powerups = (Array.isArray(saved.powerups) ? saved.powerups : [])
    .map((row) => {
      const meta = POWERUP_TYPES.find((item) => item.type === row.t);
      if (!meta) {
        return null;   // 寶物種類改過名字的舊存檔：丟掉那一顆，不要還原成壞道具
      }
      return {
        x: Number(row.x) || 0,
        y: Number(row.y) || 0,
        vy: getPowerupFallSpeed(),
        size: 20,
        type: meta.type,
        label: meta.label,
        color: meta.color,
      };
    })
    .filter(Boolean);

  bullets = [];
  bossRocks = [];
  floatingTexts = [];

  // 📱 把「存檔當時的版面」交給下一次 resizeCanvasForScreen(),由它換算座標。
  //    存檔可能來自另一個方向、另一台螢幕比例不同的裝置。
  pendingRestoreLayout = {
    width: Number(saved.cw) || canvas.width,
    height: Number(saved.ch) || canvas.height,
    speedScale: saved.pt ? PORTRAIT_SPEED_SCALE : 1,
    paddleBase: Number(saved.pb) || getPaddleBaseWidth(),
  };

  applyTheme();
  syncSettingsControls();
  updateHud();
  return true;
}

function updateResumeButton() {
  if (!resumeRunBtn) {
    return;
  }
  const saved = loadSavedRun();
  resumeRunBtn.hidden = !saved;
  if (saved) {
    resumeRunBtn.textContent = `繼續上一局（第 ${saved.level} 關 · ${saved.score} 分）`;
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// 亂數產生器。★ 額外掛上 getState/setState:續玩存檔要把「抽到第幾個」一起存,
//    否則每日挑戰續玩後的後續關卡序列會跟別人不一樣,就不再是「全世界同一局」。
function mulberry32(seed) {
  let value = seed >>> 0;
  const next = () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.getState = () => value >>> 0;
  next.setState = (restored) => { value = Number(restored) >>> 0; };
  return next;
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function resetRandomSource() {
  dailyKey = getTodayKey();
  seededRandom = mulberry32(hashString(`${dailyKey}:${state.difficulty}:breakout`));
}

function random() {
  return state.mode === "daily" ? seededRandom() : Math.random();
}

function rotateVector(vx, vy, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    vx: vx * cos - vy * sin,
    vy: vx * sin + vy * cos,
  };
}

function createPowerupCounter() {
  return Object.fromEntries(POWERUP_TYPES.map((powerup) => [powerup.type, 0]));
}

function createSessionStats() {
  return {
    bricksHit: 0,
    bricksDestroyed: 0,
    shotsFired: 0,
    bulletsHit: 0,
    powerupsCaught: 0,
    powerupsSpawned: 0,
    maxCombo: 0,
    totalComboBonus: 0,
    totalBricks: 0,
    livesLost: 0,
    levelsCleared: 0,
    highestLevel: 1,
    levelLivesLost: 0,
    assistUsed: false,
    powerupCounts: createPowerupCounter(),
  };
}

function getDifficultyConfig() {
  return DIFFICULTIES[state.difficulty] || DIFFICULTIES.normal;
}

function getThemeConfig() {
  return THEMES[state.theme] || THEMES.classic;
}

function getSongConfig() {
  return SONGS[preferences.song] || SONGS.arcade;
}

function applyTheme() {
  document.body.dataset.theme = state.theme;
}

// 🧊 立體渲染(2026-09-25):render3d.js 是 ES module,用動態 import 才載入 ——
//   ①只玩 2D 的人不用多下載一份 Three.js ②game.js 本身留著 classic script,
//   CLAUDE.md 說的「直接雙擊 index.html 就能玩」不會被 module 的 file:// CORS 限制打壞
//   (真的踩到那個限制時,下面的 .catch 會靜默把設定改回 2D,不會讓遊戲整個掛掉)。
// ⚠ 只在函式裡呼叫、絕不在檔案頂層呼叫 —— 動態載入是非同步的,gameLoop 真的要用到它
//   一定已經是好幾個影格之後,不會有「THREE 還沒準備好」這種時序雷。
let render3dApi = null;
let render3dLoadPromise = null;
let render3dFailed = false;

function ensureRender3dLoaded() {
  if (render3dApi || render3dFailed) {
    return Promise.resolve(render3dApi);
  }
  if (!render3dLoadPromise) {
    render3dLoadPromise = import("./render3d.js")
      .then((mod) => {
        render3dApi = mod.Render3D;
        render3dApi.init(gameCanvas3d);
        return render3dApi;
      })
      .catch((error) => {
        console.warn("3D 模式載入失敗，已自動退回 2D。", error);
        render3dFailed = true;
        if (preferences.render3d) {
          preferences.render3d = false;
          savePreferences();
          syncSettingsControls();
        }
        return null;
      });
  }
  return render3dLoadPromise;
}

function applyRenderMode() {
  document.body.classList.toggle("mode-3d", !!preferences.render3d);
  if (preferences.render3d) {
    ensureRender3dLoaded();
  }
}

function countAliveBricks() {
  return bricks.reduce((count, brick) => count + (brick.alive ? 1 : 0), 0);
}

function updateLevelProgress() {
  const total = sessionStats.totalBricks || bricks.length || 1;
  const remaining = countAliveBricks();
  const cleared = clamp((total - remaining) / total, 0, 1);
  levelProgressEl.style.width = `${Math.round(cleared * 100)}%`;
  remainingBricksEl.textContent = `剩餘 ${remaining}`;
}

function getScoreGapText() {
  const gap = Math.max(0, records.bestScore - state.score);
  if (gap === 0) {
    return "刷新或追平";
  }
  return `差 ${gap}`;
}

function getRunGrade() {
  return getGradeFor(state.score, sessionStats.highestLevel, sessionStats.maxCombo);
}

// 評級只有一份規則：結算面板與分享圖卡都走這裡，兩邊才不會給出不同的等第。
function getGradeFor(score, level, combo) {
  if (score >= 1800 || level >= 6 || combo >= 24) {
    return ["S", "傳奇反彈"];
  }
  if (score >= 1100 || level >= 4 || combo >= 16) {
    return ["A", "節奏高手"];
  }
  if (score >= 650 || level >= 3 || combo >= 10) {
    return ["B", "穩定破壞者"];
  }
  if (score >= 300 || level >= 2 || combo >= 5) {
    return ["C", "手感暖機"];
  }
  return ["D", "再來一局"];
}

function renderVersionPanel() {
  versionPanel.innerHTML = `
    <h3>版本 ${APP_VERSION}<span class="version-date">${APP_DATE} 更新</span></h3>
    ${CHANGELOG.map((release) => `
      <p class="version-release">${release.date}</p>
      <ul>${release.items.map((item) => `<li>${item}</li>`).join("")}</ul>
    `).join("")}
  `;
}

function getBallRadius() {
  return state.bigBallTimer > 0 ? BIG_BALL_RADIUS : BALL_RADIUS;
}

function createBall(x, y, stuck = true, vx = 0, vy = 0) {
  return {
    x,
    y,
    radius: getBallRadius(),
    vx,
    vy,
    stuck,
  };
}

function vibrate(pattern) {
  if (preferences.haptics && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function normalizeVolume(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 100;
  }
  return clamp(Math.round(number), 0, 150);
}

function getMusicGainValue() {
  return BASE_MUSIC_GAIN * (normalizeVolume(preferences.musicVolume) / 100);
}

function getSfxGainValue() {
  return BASE_SFX_GAIN * (normalizeVolume(preferences.sfxVolume) / 100);
}

function applyAudioLevels() {
  if (!audioCtx) {
    return;
  }

  const now = audioCtx.currentTime;
  if (musicGain) {
    musicGain.gain.setTargetAtTime(getMusicGainValue(), now, 0.03);
  }
  if (sfxGain) {
    sfxGain.gain.setTargetAtTime(getSfxGainValue(), now, 0.02);
  }
}

function ensureAudioReady() {
  if (audioCtx) {
    applyAudioLevels();
    return audioCtx;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  audioCtx = new AudioContextClass();

  musicGain = audioCtx.createGain();
  musicGain.gain.value = getMusicGainValue();
  musicGain.connect(audioCtx.destination);

  sfxGain = audioCtx.createGain();
  sfxGain.gain.value = getSfxGainValue();
  sfxGain.connect(audioCtx.destination);

  nextMusicTime = audioCtx.currentTime + 0.05;
  musicStepIndex = 0;
  return audioCtx;
}

function resumeAudioFromGesture() {
  const context = ensureAudioReady();
  if (!context || context.state !== "suspended") {
    return Promise.resolve();
  }

  return context.resume().catch(() => {});
}

function startMusic() {
  if (!preferences.music) {
    return;
  }

  const context = ensureAudioReady();
  if (!context || !musicGain || musicTimerId !== null) {
    return;
  }

  if (context.state === "suspended") {
    context.resume().then(() => {
      if (state.running) {
        startMusic();
      }
    }).catch(() => {});
    return;
  }

  const schedule = () => {
    if (!audioCtx || !state.running || !preferences.music) {
      stopMusic();
      return;
    }

    const lookAhead = 0.7;
    const song = getSongConfig();
    while (nextMusicTime < audioCtx.currentTime + lookAhead) {
      const frequency = song.pattern[musicStepIndex % song.pattern.length];
      const oscillator = audioCtx.createOscillator();
      const envelope = audioCtx.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, nextMusicTime);

      envelope.gain.setValueAtTime(0.0001, nextMusicTime);
      envelope.gain.linearRampToValueAtTime(0.12, nextMusicTime + 0.018);
      envelope.gain.exponentialRampToValueAtTime(0.0001, nextMusicTime + song.step * 0.95);

      oscillator.connect(envelope);
      envelope.connect(musicGain);

      oscillator.start(nextMusicTime);
      oscillator.stop(nextMusicTime + song.step);

      nextMusicTime += song.step;
      musicStepIndex += 1;
    }
  };

  schedule();
  musicTimerId = window.setInterval(schedule, 110);
}

function stopMusic() {
  if (musicTimerId !== null) {
    window.clearInterval(musicTimerId);
    musicTimerId = null;
  }

  if (audioCtx) {
    nextMusicTime = audioCtx.currentTime + 0.05;
  }
}

function playBrickHitSound() {
  if (!preferences.sfx) {
    return;
  }

  const context = ensureAudioReady();
  if (!context || context.state !== "running" || !sfxGain) {
    return;
  }

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.07);

  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(0.18, now + 0.004);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  oscillator.connect(envelope);
  envelope.connect(sfxGain);

  oscillator.start(now);
  oscillator.stop(now + 0.09);
}

function unlockAudioFromGesture() {
  resumeAudioFromGesture().then(() => {
    if (state.running) {
      startMusic();
    }
  });
}

function addScore(points) {
  const awardedPoints = points > 0 && state.scoreMultiplierTimer > 0
    ? Math.ceil(points * SCORE_MULTIPLIER)
    : points;
  state.score += awardedPoints;
  if (state.customRows) {
    // 自訂關卡的分數不寫進最高分紀錄,理由同排行榜
    evaluateAchievements();
    updateHud();
    return;
  }
  if (state.score > records.bestScore) {
    records.bestScore = state.score;
    saveRecords();
  }
  if (state.mode === "daily" && state.score > records.bestDailyScore) {
    records.bestDailyScore = state.score;
    saveRecords();
  }
  evaluateAchievements();
  updateHud();
}

function updateHud() {
  scoreEl.textContent = String(state.score);
  bestScoreEl.textContent = String(records.bestScore);
  livesEl.textContent = String(state.lives);
  levelEl.textContent = String(state.level);
  setupBestScoreEl.textContent = String(records.bestScore);
  setupBestLevelEl.textContent = String(Math.max(records.bestLevel, sessionStats.highestLevel));
  setupGamesPlayedEl.textContent = String(records.gamesPlayed);
  updateLevelProgress();
  renderRunStats();
  // ★ 不在這裡 renderTopScores():updateHud() 每次加分都會跑,
  //   在裡面重建 10 列 innerHTML 會在 Combo 連打時造成卡頓。
  //   排行榜只在「初始化」與「一局結束登錄」時重畫就夠了。
  renderModeLabel();
  renderEffectHud();
}

function getPowerupMeta(type) {
  return POWERUP_TYPES.find((item) => item.type === type) || { label: type, color: "#ffffff" };
}

function renderEffectHud() {
  const effects = [];
  if (state.shieldCharges > 0) {
    const meta = getPowerupMeta("shield");
    effects.push({
      label: meta.label,
      name: "底部保險牆",
      color: meta.color,
      ratio: 1,
      time: state.shieldCharges,
      value: `x${state.shieldCharges}`,
    });
  }
  if (state.bombBallCharges > 0) {
    const meta = getPowerupMeta("bombball");
    effects.push({
      label: meta.label,
      name: "炸彈球",
      color: meta.color,
      ratio: 1,
      time: state.bombBallCharges,
      value: `x${state.bombBallCharges}`,
    });
  }
  if (state.gunTimer > 0) {
    const meta = getPowerupMeta("laser");
    effects.push({
      label: meta.label,
      name: "自動雷射",
      color: meta.color,
      ratio: state.gunTimer / GUN_DURATION,
      time: state.gunTimer,
    });
  }
  if (state.bigBallTimer > 0) {
    const meta = getPowerupMeta("bigball");
    effects.push({
      label: meta.label,
      name: "巨球",
      color: meta.color,
      ratio: state.bigBallTimer / BIG_BALL_DURATION,
      time: state.bigBallTimer,
    });
  }
  if (state.magnetTimer > 0) {
    const meta = getPowerupMeta("magnet");
    effects.push({
      label: meta.label,
      name: "磁鐵板",
      color: meta.color,
      ratio: state.magnetTimer / MAGNET_DURATION,
      time: state.magnetTimer,
    });
  }
  if (state.pierceTimer > 0) {
    const meta = getPowerupMeta("pierce");
    effects.push({
      label: meta.label,
      name: "穿透球",
      color: meta.color,
      ratio: state.pierceTimer / PIERCE_DURATION,
      time: state.pierceTimer,
    });
  }
  if (state.scoreMultiplierTimer > 0) {
    const meta = getPowerupMeta("score2x");
    effects.push({
      label: meta.label,
      name: "分數加倍",
      color: meta.color,
      ratio: state.scoreMultiplierTimer / SCORE_MULTIPLIER_DURATION,
      time: state.scoreMultiplierTimer,
    });
  }
  if (state.powerupMagnetTimer > 0) {
    const meta = getPowerupMeta("attract");
    effects.push({
      label: meta.label,
      name: "吸寶物",
      color: meta.color,
      ratio: state.powerupMagnetTimer / POWERUP_MAGNET_DURATION,
      time: state.powerupMagnetTimer,
    });
  }
  if (state.timeSlowTimer > 0) {
    const meta = getPowerupMeta("timeslow");
    effects.push({
      label: meta.label,
      name: "慢動作",
      color: meta.color,
      ratio: state.timeSlowTimer / TIME_SLOW_DURATION,
      time: state.timeSlowTimer,
    });
  }
  if (state.shadowPaddleTimer > 0) {
    const meta = getPowerupMeta("shadow");
    effects.push({
      label: meta.label,
      name: "雙板",
      color: meta.color,
      ratio: state.shadowPaddleTimer / SHADOW_PADDLE_DURATION,
      time: state.shadowPaddleTimer,
    });
  }
  if (state.comboTimer > 0 && state.combo >= 3) {
    effects.push({
      label: `x${state.combo}`,
      name: "Combo",
      color: "#ffe680",
      ratio: state.comboTimer / 2.6,
      time: state.comboTimer,
    });
  }

  const formatEffectValue = (effect) => effect.value || `${effect.time.toFixed(1)}s`;
  effectHud.innerHTML = effects.map((effect) => `
    <div class="effect-chip">
      <i style="background:${effect.color}">${effect.label}</i>
      <span>${effect.name}</span>
      <b>${formatEffectValue(effect)}</b>
      <div class="effect-bar"><div class="effect-fill" style="width:${Math.round(clamp(effect.ratio, 0, 1) * 100)}%; background:${effect.color}"></div></div>
    </div>
  `).join("");
}

function renderModeLabel() {
  const difficulty = getDifficultyConfig().label;
  // 板長不是預設就寫出來:同一個分數在「超長板」與「極短板」下不是同一件事,
  // HUD 不講,截圖分享出去的數字就會誤導人。
  const paddleNote = getPaddleSizeKey() === DEFAULT_PADDLE_SIZE
    ? ""
    : ` / 板${PADDLE_SIZES[getPaddleSizeKey()].label}`;
  modeLabel.textContent = state.mode === "daily"
    ? `${MODES.daily} ${dailyKey} / ${difficulty}${paddleNote}`
    : `${MODES.classic} / ${difficulty}${paddleNote}`;
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  return `${Math.round(value * 100)}%`;
}

function getAccuracyText() {
  if (sessionStats.shotsFired === 0) {
    return "未開火";
  }
  return formatPercent(sessionStats.bulletsHit / sessionStats.shotsFired);
}

function getOverlayStatItems() {
  const [grade, title] = getRunGrade();
  return [
    ["評級", `${grade} / ${title}`],
    ["分數", state.score],
    ["最高分", records.bestScore],
    ["距離最高", getScoreGapText()],
    ["最高關卡", sessionStats.highestLevel],
    ["破壞磚塊", sessionStats.bricksDestroyed],
    ["寶物", sessionStats.powerupsCaught],
    ["最大 Combo", sessionStats.maxCombo],
    ["Combo 加分", sessionStats.totalComboBonus],
    ["射擊命中", getAccuracyText()],
    ...(sessionStats.assistUsed ? [["輔助", "本局用過"]] : []),
  ];
}

function renderRunStats() {
  runStatsEl.innerHTML = [
    ["最高分", records.bestScore],
    ["每日最高", records.bestDailyScore],
    ["最高關", Math.max(records.bestLevel, sessionStats.highestLevel)],
    ["本局寶物", sessionStats.powerupsCaught],
    ["最大 Combo", sessionStats.maxCombo],
    ["Combo 加分", sessionStats.totalComboBonus],
    ["射擊命中", getAccuracyText()],
  ].map(([label, value]) => `<p><span>${label}</span><strong>${value}</strong></p>`).join("");
}

function renderAchievements() {
  achievementList.innerHTML = ACHIEVEMENTS.map((achievement) => {
    const unlocked = unlockedAchievements.has(achievement.id);
    return `
      <div class="achievement ${unlocked ? "" : "locked"}">
        <span><strong>${achievement.title}</strong><br>${achievement.description}</span>
        <span>${unlocked ? "完成" : "未解鎖"}</span>
      </div>
    `;
  }).join("");
}

function unlockAchievement(id) {
  if (unlockedAchievements.has(id)) {
    return;
  }

  const achievement = ACHIEVEMENTS.find((item) => item.id === id);
  if (!achievement) {
    return;
  }

  unlockedAchievements.add(id);
  saveRecords();
  renderAchievements();
  spawnFloatingText(`成就：${achievement.title}`, canvas.width * 0.5, canvas.height * 0.78, "#ffe680");
  vibrate([30, 40, 30]);
}

function evaluateAchievements() {
  if (sessionStats.powerupsCaught >= 1) {
    unlockAchievement("first_powerup");
  }
  if (state.score >= 500) {
    unlockAchievement("score_500");
  }
  if (sessionStats.highestLevel >= 3) {
    unlockAchievement("level_3");
  }
  if (sessionStats.powerupsCaught >= 5) {
    unlockAchievement("collector");
  }
  if (state.mode === "daily") {
    unlockAchievement("daily_player");
  }
  if (sessionStats.bulletsHit >= 10) {
    unlockAchievement("laser_ace");
  }
  if (state.difficulty === "hard" && sessionStats.highestLevel >= 2) {
    unlockAchievement("hard_mode");
  }
}

function setOverlay(title, text, options = {}) {
  const {
    visible = true,
    showActions = false,
    showSettings = false,
    showVersion = false,
    showShare = false,
    stats = null,
  } = options;

  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlay.classList.remove("countdown");
  overlay.classList.toggle("hidden", !visible);
  overlayActions.hidden = !showActions;
  // 🖼 成績圖卡只在「每日挑戰結算」出現：一般關卡沒有日期與題號，給了也沒有分享價值。
  shareRunBtn.hidden = !(showActions && showShare);
  settingsMenu.hidden = !showSettings;
  versionPanel.hidden = !showVersion;
  if (showVersion) {
    renderVersionPanel();
  }

  if (stats) {
    overlayStats.innerHTML = stats.map(([label, value]) => `<p>${label}<br><strong>${value}</strong></p>`).join("");
    overlayStats.hidden = false;
  } else {
    overlayStats.innerHTML = "";
    overlayStats.hidden = true;
  }
}

function setInstallHint(message = "") {
  installHint.textContent = message;
  installHint.hidden = !message;
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isTouchDevice() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function isLandscapeViewport() {
  return window.innerWidth >= window.innerHeight;
}

// ── 📱 版面模式 ───────────────────────────────────────────────────────────
let layoutMode = "landscape";        // "landscape" | "portrait",由 resizeCanvasForScreen() 決定
let pendingRestoreLayout = null;     // 從存檔還原時,存檔當時的版面(用來把座標搬過來)

function isPortraitLayout() {
  return layoutMode === "portrait";
}

// 玩家可以鎖回舊的「固定橫向」;預設是自動。
function prefersForcedLandscape() {
  return preferences.screenMode === "landscape";
}

function shouldUsePortraitLayout() {
  return !prefersForcedLandscape() && window.innerHeight > window.innerWidth;
}

// 速度類(球、寶物、子彈、落石)的統一縮放:直向場地高很多,絕對 px/frame 要跟著放大
function getSpeedScale() {
  return isPortraitLayout() ? PORTRAIT_SPEED_SCALE : 1;
}

// 板子相關的縮放:板寬的意義是「佔場地寬的幾分之幾」,不是實際幾公釐,
// 所以直向要按畫布寬等比例縮,否則 136px 會佔掉 560 寬畫布的四分之一。
function getPaddleScale() {
  return isPortraitLayout() ? canvas.width / PORTRAIT_PADDLE_REF_WIDTH : 1;
}

function getPaddleSizeKey() {
  return preferences.paddleSize in PADDLE_SIZES ? preferences.paddleSize : DEFAULT_PADDLE_SIZE;
}

function getPaddleSizeMultiplier() {
  return PADDLE_SIZES[getPaddleSizeKey()].mul;
}

// 這一局「板子本來該有多寬」= 難度給的寬 × 玩家選的長度 × 場地比例。
function getPaddleBaseWidth() {
  return getDifficultyConfig().paddleWidth * getPaddleSizeMultiplier() * getPaddleScale();
}

// ⚠ 上下限要跟著玩家選的長度走,不能是寫死的 100/260:
//   選了「極短」卻被下限夾回 100(標準難度是 136×0.7=95.2),設定就等於沒作用 ——
//   而且畫面上看不出任何異常,是那種「語法檢查與測試全綠、玩家卻覺得選項壞掉」的病。
//   這兩支守的是 expand 寶物與卡關輔助的加寬範圍,不是用來否決玩家的選擇。
function getPaddleMinWidth() {
  return Math.min(PADDLE_MIN_WIDTH, getDifficultyConfig().paddleWidth * getPaddleSizeMultiplier()) * getPaddleScale();
}

function getPaddleMaxWidth() {
  // ⚠ 上限還要再留一步 expand 的成長空間:休閒×超長 是 164×1.6=262.4,已經超過 260 ⇒
  //   加寬寶物與卡關輔助會雙雙變成「吃了沒反應」的道具(test/patterns.mjs 當場抓到)。
  const chosen = getDifficultyConfig().paddleWidth * getPaddleSizeMultiplier();
  return Math.max(PADDLE_MAX_WIDTH, chosen + PADDLE_EXPAND_STEP) * getPaddleScale();
}

function getAssistPaddleBonus() {
  return ASSIST_PADDLE_BONUS * getPaddleScale();
}

function getPaddleExpandStep() {
  return PADDLE_EXPAND_STEP * getPaddleScale();
}

function getPaddleSpeed() {
  return isPortraitLayout() ? PORTRAIT_PADDLE_SPEED : 8;
}

// 板子離底邊多遠。
// 🎚 2026-09-26 第二輪(使用者:「線與擋板移到底」)——原本直向留一塊「拇指區」
//   (板子貼著螢幕最底邊的話,單手直握時手指會擋住板子本身),先退讓到 6.5% 使用者仍覺得
//   太遠,明確要求貼到底。使用者已經知道並接受「手指可能擋住板子」這個取捨(上一輪就講過),
//   這次直接照辦:直向也改用跟橫向一樣的**固定像素**(PADDLE_BOTTOM_GAP,不再是百分比),
//   只留幾 px 讓板子看得出邊框、不會真的畫到 canvas 最後一列像素。
//   test/patterns.mjs 原本那條「拇指區至少留 6%」的安全網已經跟著拿掉(見該檔同一段註解)。
//   危險線(getDangerLineY = paddle.y - 26)是照著 paddle.y 算的,板子往下移,
//   線會自動跟著往下移,2D 與立體渲染(3D)共用同一個 paddle.y,兩邊一起生效。
function getPaddleBottomGap() {
  return PADDLE_BOTTOM_GAP;
}

function getPowerupFallSpeed() {
  return POWERUP_FALL_SPEED * getSpeedScale();
}

// 下壓間隔:直向從磚牆到危險線的格數大約是橫向的兩倍,
// 用同一個秒數等於直向幾乎不會被壓到 ⇒ 縮短間隔讓兩邊的壓力相當。
function getDescendInterval() {
  const base = getDifficultyConfig().descendSec;
  return isPortraitLayout() ? base * PORTRAIT_DESCEND_SCALE : base;
}

// 這一關的磚塊是不是 BOSS 版面(重排時要用另一組幾何)。
// 用關卡編號推而不是看場上還有沒有 BOSS —— BOSS 被打掉後護衛磚還在。
function isBossLevelLayout() {
  return !state.customRows && state.level > 1 && state.level % BOSS_INTERVAL === 0;
}

function captureLayoutSnapshot() {
  return {
    width: canvas.width,
    height: canvas.height,
    speedScale: getSpeedScale(),
    paddleBase: getPaddleBaseWidth(),
  };
}

function resetStarField() {
  for (let i = 0; i < stars.length; i += 1) {
    stars[i].x = Math.random() * canvas.width;
    stars[i].y = Math.random() * (canvas.height * 0.52);
  }
}

// 邏輯畫布的尺寸。★ 畫布是被 CSS 拉滿整個視窗的(width/height:100%),
// 所以「邏輯長寬比」必須貼近「真實視窗長寬比」,差太多整個畫面就被壓扁。
// 兩個方向的共同規則:**短邊固定 560**,長邊由視窗比例推(夾在合理範圍內)。
function resizeCanvasForScreen() {
  if (!isGameScreenActive) {
    return;
  }

  const prev = pendingRestoreLayout || captureLayoutSnapshot();
  pendingRestoreLayout = null;

  const hudHeight = gameHud ? gameHud.getBoundingClientRect().height : 0;
  const availableHeight = Math.max(320, window.innerHeight - hudHeight);
  const portrait = shouldUsePortraitLayout();

  let nextWidth;
  let nextHeight;
  if (portrait) {
    const aspect = clamp(availableHeight / window.innerWidth, PORTRAIT_MIN_ASPECT, PORTRAIT_MAX_ASPECT);
    nextWidth = PORTRAIT_BASE_WIDTH;
    nextHeight = Math.round(PORTRAIT_BASE_WIDTH * aspect);
  } else {
    const aspect = clamp(window.innerWidth / availableHeight, 1.45, 2.55);
    nextWidth = Math.round(BASE_CANVAS_HEIGHT * aspect);
    nextHeight = BASE_CANVAS_HEIGHT;
  }

  const nextMode = portrait ? "portrait" : "landscape";
  // 手機網址列收合會讓 innerHeight 抖幾 px:2px 以內不重排,免得球每幀被搬一次
  const settled = layoutMode === nextMode
    && Math.abs(canvas.width - nextWidth) <= 2
    && Math.abs(canvas.height - nextHeight) <= 2;
  if (settled) {
    return;
  }

  layoutMode = nextMode;
  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
    resetStarField();
  }
  positionPaddleY();
  rescaleWorld(prev);
}

// 版面(方向或尺寸)變了,就把磚塊照 row/col 重排。
// ★ 用 row/col 重算而不是按比例縮:磚塊是格狀的,等比例縮過去會和新版面的
//   邊距/間隙對不齊,幾關之後整面慢慢走鐘。下壓的位移用 state.descendRows 帶過去。
function relayoutBricks() {
  if (bricks.length === 0) {
    return;
  }

  const boss = isBossLevelLayout();
  const layout = getBrickLayout();
  const pitch = getBrickRowPitch();
  const drop = state.descendRows * pitch;
  const bl = boss ? getBossLayout() : null;

  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (boss && brick.special === "boss") {
      brick.width = bl.bossWidth;
      brick.height = bl.bossHeight;
      brick.baseX = bl.bossX;
      brick.x = bl.bossX;
      brick.y = bl.top + drop;
    } else if (boss) {
      const guardRow = Math.max(0, brick.row - 1);
      brick.width = bl.guardWidth;
      brick.height = bl.guardHeight;
      brick.baseX = bl.guardLeft + brick.col * (bl.guardWidth + bl.gap);
      brick.x = brick.baseX;
      brick.y = bl.guardTop + guardRow * (bl.guardHeight + bl.gap) + drop;
    } else {
      brick.width = layout.brickWidth;
      brick.height = layout.brickHeight;
      brick.baseX = layout.side + brick.col * (layout.brickWidth + layout.gap);
      brick.x = brick.baseX;
      brick.y = layout.top + brick.row * pitch + drop;
    }
  }
}

// 轉手機、拉視窗、或從「另一個方向存的存檔」還原時,把整個場面搬到新座標系。
// 不搬的話:球留在畫面外、板子超出右緣、磚塊橫著溢出 —— 轉一下手機整局報銷。
function rescaleWorld(prev) {
  if (!prev || !prev.width || !prev.height) {
    return;
  }

  const sx = canvas.width / prev.width;
  const sy = canvas.height / prev.height;
  const speedRatio = getSpeedScale() / (prev.speedScale || 1);
  const paddleRatio = getPaddleBaseWidth() / (prev.paddleBase || getPaddleBaseWidth());
  if (sx === 1 && sy === 1 && speedRatio === 1 && paddleRatio === 1) {
    return;
  }

  relayoutBricks();

  paddle.width = clamp(paddle.width * paddleRatio, getPaddleMinWidth(), getPaddleMaxWidth());
  state.assistWidthBonus *= paddleRatio;
  paddle.speed = getPaddleSpeed();
  positionPaddleY();
  paddle.x = clamp(paddle.x * sx, 0, canvas.width - paddle.width);

  for (let i = 0; i < balls.length; i += 1) {
    const ball = balls[i];
    ball.x = clamp(ball.x * sx, ball.radius, canvas.width - ball.radius);
    ball.y = clamp(ball.y * sy, ball.radius, canvas.height - ball.radius);
    ball.vx *= speedRatio;
    ball.vy *= speedRatio;
  }
  syncStuckBallsWithPaddle();

  for (let i = 0; i < powerups.length; i += 1) {
    powerups[i].x = clamp(powerups[i].x * sx, 0, canvas.width);
    powerups[i].y *= sy;
    powerups[i].vy = getPowerupFallSpeed();
  }

  for (let i = 0; i < bossRocks.length; i += 1) {
    bossRocks[i].x = clamp(bossRocks[i].x * sx, 0, canvas.width);
    bossRocks[i].y *= sy;
    bossRocks[i].vy = BOSS_ROCK_SPEED * getSpeedScale() + state.level * 0.05;
  }

  // 子彈只活幾幀,換版面時清掉比搬過去省事,而且沒有人看得出來
  bullets = [];
}

// 只有玩家自己選了「固定橫向」時才擋直向。預設(auto)直向是可以玩的版面,
// 擋下去等於把一個支援得好好的模式關掉。
function shouldShowRotatePrompt() {
  return isGameScreenActive && prefersForcedLandscape() && isTouchDevice() && !isLandscapeViewport();
}

function updateOrientationPrompt() {
  const showPrompt = shouldShowRotatePrompt();
  rotatePrompt.hidden = !showPrompt;

  if (showPrompt) {
    if (state.running || levelCountdownTimerId !== null) {
      pendingStartAfterLandscape = true;
    }
    state.running = false;
    stopMusic();
    syncButton();
  } else if (pendingResumeAfterLandscape) {
    pendingResumeAfterLandscape = false;
    resizeCanvasForScreen();
    syncStuckBallsWithPaddle();
    beginLevelCountdown("接續上一局");
  } else if (pendingNewGameAfterLandscape) {
    pendingNewGameAfterLandscape = false;
    resizeCanvasForScreen();
    restartGame({ showStartOverlay: false });
    beginLevelCountdown(getLevelTitle());
  } else if (pendingStartAfterLandscape) {
    pendingStartAfterLandscape = false;
    resizeCanvasForScreen();
    beginLevelCountdown(getLevelTitle());
  }
}

// ⛶ 手動全螢幕(0916 手機體檢紅燈)。
//
// 原本只有「按開始遊玩時自動 requestFullscreen」這一條路 —— 而 iOS Safari 與
// LINE / FB 之類的 App 內建瀏覽器常常靜默擋掉它(下面兩個 catch 就是在吞那件事),
// 擋掉之後玩家**沒有第二次機會**,只能卡在小視窗裡玩。
//
// ★ 只在瀏覽器真的支援時才顯示這顆鈕:iPhone 上的 Safari 根本沒有 Fullscreen API,
//   放一顆按了不會有反應的鈕比沒有更糟(dragtetris 也是同一條規矩)。
function updateFullscreenButton() {
  if (!fullscreenBtn) {
    return;
  }
  const supported = document.fullscreenEnabled === true
    && typeof document.documentElement.requestFullscreen === "function";
  fullscreenBtn.hidden = !supported;
  if (!supported) {
    return;
  }
  const on = document.fullscreenElement != null;
  fullscreenBtn.textContent = on ? "⛶ 離開" : "⛶";
  fullscreenBtn.title = on ? "離開全螢幕" : "全螢幕";
  fullscreenBtn.setAttribute("aria-pressed", on ? "true" : "false");
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await requestGameFullscreen();
  } catch {
    // 使用者手勢之外呼叫、或被瀏覽器政策擋掉:靜默,不要弄壞遊戲。
  }
  updateFullscreenButton();
}

async function requestGameFullscreen() {
  const root = document.documentElement;

  try {
    if (!document.fullscreenElement && root.requestFullscreen) {
      await root.requestFullscreen({ navigationUI: "hide" });
    }
  } catch {
    // Some mobile browsers only allow fullscreen from installed PWA mode.
  }

  // ★ 只有玩家選了「固定橫向」才鎖方向。auto 模式鎖下去等於強迫轉向,
  //   直向明明玩得動 —— 而且鎖了之後玩家自己轉回直向也會被扳回來。
  if (!prefersForcedLandscape()) {
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch {
      // Orientation unlock is best effort.
    }
    return;
  }

  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock("landscape");
    }
  } catch {
    // iOS Safari and some in-app browsers do not allow orientation locking.
  }
}

function showGameScreen() {
  isGameScreenActive = true;
  setupScreen.hidden = true;
  gameScreen.hidden = false;
  document.body.classList.add("is-game-active");
  appRoot.classList.add("is-playing");
  updateOrientationPrompt();
}

async function showSetupScreen() {
  cancelLevelCountdown();
  cancelRestartCountdown();
  saveRun();   // 回設定頁前先存,回來才接得上
  exitCustomLevel();   // 不清掉的話,下一次按「開始遊玩」還是玩同一張自訂圖
  pendingStartAfterLandscape = false;
  pendingNewGameAfterLandscape = false;
  pendingResumeAfterLandscape = false;
  pendingRestoreLayout = null;
  isGameScreenActive = false;
  state.running = false;
  stopMusic();
  keys.left = false;
  keys.right = false;
  rotatePrompt.hidden = true;
  setupScreen.hidden = false;
  gameScreen.hidden = true;
  document.body.classList.remove("is-game-active");
  appRoot.classList.remove("is-playing");
  setOverlay("", "", { visible: false });
  syncButton();
  updateHud();

  try {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  } catch {
    // Orientation unlock is best effort.
  }

  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
  } catch {
    // Leaving fullscreen can be denied outside a direct gesture.
  }
}

async function startGameFromSetup() {
  unlockAudioFromGesture();
  setInstallHint("");
  clearSavedRun();   // 按「開始遊玩」就是要開新局,舊存檔當場作廢免得之後誤接
  showGameScreen();
  await requestGameFullscreen();
  pendingNewGameAfterLandscape = true;
  updateOrientationPrompt();
}

async function resumeSavedRun() {
  const saved = loadSavedRun();
  if (!saved) {
    updateResumeButton();
    setInstallHint("找不到可以接續的存檔，請按「開始遊玩」開新的一局。");
    return;
  }

  unlockAudioFromGesture();
  setInstallHint("");
  restoreRun(saved);
  showGameScreen();
  await requestGameFullscreen();
  pendingResumeAfterLandscape = true;
  updateOrientationPrompt();
}

// ── 🧩 關卡編輯器 UI ───────────────────────────────────────────────────────
let editorRows = createBlankEditorRows(5);
let editorBrush = "#";

// 每一種磚在編輯器格子上的顏色，跟遊戲裡 getBrickColor() 的特殊磚色一致，
// 畫的時候看到什麼，玩的時候就是什麼。
const EDITOR_BRUSH_COLORS = {
  ".": "transparent",
  "#": "#55c1ff",
  S: "#aab7c7",
  B: "#ff7f7f",
  M: "#b39cff",
};

function setEditorCell(row, col, glyph) {
  const line = editorRows[row];
  editorRows[row] = line.slice(0, col) + glyph + line.slice(col + 1);
}

function renderEditorBrushes() {
  editorBrushes.innerHTML = EDITOR_GLYPHS.map((glyph) => `
    <button type="button" class="editor-brush${glyph === editorBrush ? " is-active" : ""}"
      data-glyph="${glyph}" aria-pressed="${glyph === editorBrush}">
      <span class="editor-swatch" style="background:${EDITOR_BRUSH_COLORS[glyph]}">${glyph === "." ? "" : glyph}</span>
      ${EDITOR_GLYPH_LABELS[glyph]}
    </button>
  `).join("");
}

function renderEditorGrid() {
  editorGrid.style.setProperty("--editor-cols", String(EDITOR_COLS));
  editorGrid.innerHTML = editorRows.map((line, row) =>
    Array.from({ length: EDITOR_COLS }, (unused, col) => {
      const glyph = line[col] || ".";
      return `<button type="button" class="editor-cell${glyph === "." ? " is-empty" : ""}"
        data-row="${row}" data-col="${col}"
        style="background:${EDITOR_BRUSH_COLORS[glyph]}"
        aria-label="第 ${row + 1} 列第 ${col + 1} 格：${EDITOR_GLYPH_LABELS[glyph]}"
      >${glyph === "." ? "" : glyph}</button>`;
    }).join(""),
  ).join("");
}

// 只更新一格。★ 不要整張重繪:80 格全部換掉會讓鍵盤使用者每點一次就失去焦點,
//    而且每次點擊都重建 innerHTML 也沒必要。
function paintEditorCell(cell, glyph) {
  cell.style.background = EDITOR_BRUSH_COLORS[glyph];
  cell.textContent = glyph === "." ? "" : glyph;
  cell.classList.toggle("is-empty", glyph === ".");
  cell.setAttribute(
    "aria-label",
    `第 ${Number(cell.dataset.row) + 1} 列第 ${Number(cell.dataset.col) + 1} 格：${EDITOR_GLYPH_LABELS[glyph]}`,
  );
}

function renderEditorStatus() {
  const count = countEditorBricks(editorRows);
  const tooFew = count < EDITOR_MIN_BRICKS;
  editorStatus.textContent = tooFew
    ? `目前 ${count} 顆磚，至少要 ${EDITOR_MIN_BRICKS} 顆才能玩（太少的關一秒就破）。`
    : `目前 ${editorRows.length} 列 / ${count} 顆磚，可以試玩了。`;
  editorStatus.classList.toggle("is-warn", tooFew);
  editorPlay.disabled = tooFew;
  editorCopy.disabled = tooFew;
  editorCode.value = tooFew ? "" : encodeLevelCode(editorRows);
}

function renderEditor() {
  renderEditorBrushes();
  renderEditorGrid();
  renderEditorStatus();
}

function openEditor() {
  editorPanel.hidden = false;
  renderEditor();
  editorPanel.scrollIntoView({ block: "start", behavior: "smooth" });
}

function closeEditor() {
  editorPanel.hidden = true;
}

function setEditorRowCount(next) {
  const target = clamp(next, EDITOR_MIN_ROWS, EDITOR_MAX_ROWS);
  while (editorRows.length > target) {
    editorRows.pop();
  }
  while (editorRows.length < target) {
    editorRows.push(".".repeat(EDITOR_COLS));
  }
  renderEditor();
}

function loadEditorCode(code) {
  const rows = decodeLevelCode(code);
  if (!rows) {
    editorStatus.textContent = "這串分享碼看起來不對，請確認有沒有少複製到字。";
    editorStatus.classList.add("is-warn");
    return false;
  }
  editorRows = rows;
  renderEditor();
  editorStatus.textContent = `已載入 ${rows.length} 列 / ${countEditorBricks(rows)} 顆磚的關卡。`;
  editorStatus.classList.remove("is-warn");
  return true;
}

async function playCustomLevel() {
  if (countEditorBricks(editorRows) < EDITOR_MIN_BRICKS) {
    return;
  }
  state.customRows = editorRows.slice();
  closeEditor();
  clearSavedRun();
  unlockAudioFromGesture();
  setInstallHint("");
  showGameScreen();
  await requestGameFullscreen();
  pendingNewGameAfterLandscape = true;
  updateOrientationPrompt();
}

// 離開自訂關卡回到一般玩法。回設定頁時一定要呼叫，否則下一局還是那張自訂圖。
function exitCustomLevel() {
  state.customRows = null;
}

function updateInstallButton() {
  const canPromptInstall = Boolean(deferredInstallPrompt);
  const showOnMobile = isTouchDevice() && !isStandalone();
  installBtn.hidden = isStandalone() || (!showOnMobile && !canPromptInstall);
}

function showUpdatePrompt(worker) {
  waitingServiceWorker = worker;
  updateBtn.hidden = false;
  setInstallHint("有新版遊戲可以更新，按「更新遊戲」即可套用。");
}

function syncButton() {
  if (state.gameOver) {
    startBtn.textContent = "重新開始";
    toggleBtn.textContent = "重新開始";
    return;
  }

  startBtn.textContent = "開始遊玩";
  toggleBtn.textContent = state.running ? "暫停" : "繼續";
}

function syncSettingsControls() {
  preferences.musicVolume = normalizeVolume(preferences.musicVolume);
  preferences.sfxVolume = normalizeVolume(preferences.sfxVolume);
  musicToggle.checked = preferences.music;
  sfxToggle.checked = preferences.sfx;
  hapticsToggle.checked = preferences.haptics;
  setupMusicToggle.checked = preferences.music;
  setupSfxToggle.checked = preferences.sfx;
  setupHapticsToggle.checked = preferences.haptics;
  assistToggle.checked = preferences.assist;
  setupAssistToggle.checked = preferences.assist;
  render3dToggle.checked = preferences.render3d;
  setupRender3dToggle.checked = preferences.render3d;
  musicVolume.value = String(preferences.musicVolume);
  sfxVolume.value = String(preferences.sfxVolume);
  setupMusicVolume.value = String(preferences.musicVolume);
  setupSfxVolume.value = String(preferences.sfxVolume);
  musicVolumeValue.textContent = `${preferences.musicVolume}%`;
  sfxVolumeValue.textContent = `${preferences.sfxVolume}%`;
  setupMusicVolumeValue.textContent = `${preferences.musicVolume}%`;
  setupSfxVolumeValue.textContent = `${preferences.sfxVolume}%`;
  difficultySelect.value = state.difficulty;
  modeSelect.value = state.mode;
  themeSelect.value = state.theme;
  if (screenModeSelect) {
    screenModeSelect.value = prefersForcedLandscape() ? "landscape" : "auto";
  }
  if (paddleSizeSelect) {
    paddleSizeSelect.value = getPaddleSizeKey();
  }
  if (paddleSizeSelectInGame) {
    paddleSizeSelectInGame.value = getPaddleSizeKey();
  }
  songSelect.value = preferences.song in SONGS ? preferences.song : "arcade";
  songSelectInGame.value = preferences.song in SONGS ? preferences.song : "arcade";
  applyTheme();
  applyAudioLevels();
  applyRenderMode();
}

let restartCountdownTimerId = null;

function cancelLevelCountdown() {
  if (levelCountdownTimerId !== null) {
    window.clearInterval(levelCountdownTimerId);
    levelCountdownTimerId = null;
  }
  pendingStartAfterLandscape = false;
  overlay.classList.remove("countdown");
}

function beginLevelCountdown(title = getLevelTitle()) {
  if (shouldShowRotatePrompt()) {
    pendingStartAfterLandscape = true;
    updateOrientationPrompt();
    setOverlay("", "", { visible: false });
    return;
  }

  cancelLevelCountdown();
  cancelRestartCountdown();
  state.running = false;
  stopMusic();
  syncButton();

  let count = 3;
  setOverlay(title, String(count), {
    showActions: false,
    showSettings: false,
    stats: null,
  });
  overlay.classList.add("countdown");

  levelCountdownTimerId = window.setInterval(() => {
    if (shouldShowRotatePrompt()) {
      cancelLevelCountdown();
      pendingStartAfterLandscape = true;
      updateOrientationPrompt();
      setOverlay("", "", { visible: false });
      return;
    }

    count -= 1;
    if (count > 0) {
      overlayText.textContent = String(count);
      return;
    }

    cancelLevelCountdown();
    startOrResume();
  }, 1000);
}

function cancelRestartCountdown() {
  if (restartCountdownTimerId !== null) {
    window.clearInterval(restartCountdownTimerId);
    restartCountdownTimerId = null;
  }
  state.restartCountdown = 0;
  quickRestartBtn.textContent = "3 秒重開";
}

function startRestartCountdown() {
  cancelLevelCountdown();
  cancelRestartCountdown();
  state.running = false;
  stopMusic();
  state.restartCountdown = 3;
  quickRestartBtn.textContent = "取消倒數";
  setOverlay("準備重開", "3 秒後自動開始新局。", {
    showActions: true,
    showSettings: false,
    stats: getOverlayStatItems(),
  });

  restartCountdownTimerId = window.setInterval(() => {
    state.restartCountdown -= 1;
    overlayText.textContent = `${state.restartCountdown} 秒後自動開始新局。`;
    if (state.restartCountdown <= 0) {
      cancelRestartCountdown();
      restartGameAndCountdown("重新開始");
    }
  }, 1000);
}

function setBallRadius(radius) {
  for (let i = 0; i < balls.length; i += 1) {
    const ball = balls[i];
    ball.radius = radius;
    ball.x = clamp(ball.x, radius, canvas.width - radius);

    if (ball.stuck) {
      ball.x = paddle.x + paddle.width * 0.5;
      ball.y = paddle.y - radius - 1;
    } else {
      ball.y = clamp(ball.y, radius, canvas.height + radius);
    }
  }
}

function positionPaddleY() {
  paddle.y = canvas.height - getPaddleBottomGap() - paddle.height;
}

function clearTemporaryPowerups() {
  state.gunTimer = 0;
  state.shotCooldown = 0;
  state.bigBallTimer = 0;
  state.magnetTimer = 0;
  state.pierceTimer = 0;
  state.scoreMultiplierTimer = 0;
  state.powerupMagnetTimer = 0;
  state.timeSlowTimer = 0;
  state.shadowPaddleTimer = 0;
  setBallRadius(BALL_RADIUS);
}

function resetPowerupCharges() {
  state.shieldCharges = 0;
  state.bombBallCharges = 0;
}

function getShadowPaddleRect() {
  // ⚠ 上下限要乘場地比例:直向畫布只有 560 寬,寫死的 72 會讓「影子板」比本體還寬
  //   (直向標準板寬才 69,選極短更只有 48)—— 玩家會看到一塊比自己還大的鏡像板。
  const width = clamp(paddle.width * 0.68, 72 * getPaddleScale(), 150 * getPaddleScale());
  return {
    x: clamp(canvas.width - paddle.x - width, 0, canvas.width - width),
    y: paddle.y,
    width,
    height: paddle.height,
    shadow: true,
  };
}

function getPaddleHitRects() {
  const rects = [paddle];
  if (state.shadowPaddleTimer > 0) {
    rects.push(getShadowPaddleRect());
  }
  return rects;
}

function releaseStuckBalls() {
  let released = 0;
  for (let i = 0; i < balls.length; i += 1) {
    if (balls[i].stuck) {
      launchBall(balls[i]);
      released += 1;
    }
  }

  if (released > 0) {
    spawnFloatingText("發射", paddle.x + paddle.width * 0.5, paddle.y - 18, "#c084fc");
    startMusic();
    return true;
  }
  return false;
}

function drawRoundedRect(x, y, w, h, r) {
  const radius = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function pickSpecialBrick(level) {
  const config = getDifficultyConfig();
  const chance = Math.min(0.42, config.specialRate + (level - 1) * 0.018);
  if (level < 2 || random() > chance) {
    return null;
  }

  const roll = random();
  if (roll < 0.2) {
    return "bomb";
  }
  if (roll < 0.38) {
    return "steel";
  }
  if (roll < 0.56) {
    return "moving";
  }
  if (roll < 0.72) {
    return "split";
  }
  if (roll < 0.86) {
    return "speed";
  }
  return "bounce";
}

function getLevelPattern(level) {
  // 跳過 BOSS 關再取圖案 ⇒ 圖案不會因為 BOSS 佔掉編號而被整個跳過。
  const bossesBefore = Math.floor(level / BOSS_INTERVAL);
  const ordinal = Math.max(0, level - 1 - bossesBefore);
  return LEVEL_PATTERNS[ordinal % LEVEL_PATTERNS.length];
}

function getLevelTitle() {
  if (state.customRows) {
    return "自訂關卡";
  }
  return state.levelName ? `第 ${state.level} 關 · ${state.levelName}` : `第 ${state.level} 關`;
}

// 磚塊的版面幾何。自訂關卡與內建圖案共用同一組數字，兩邊才不會慢慢走鐘。
function getBrickLayout() {
  const cols = PATTERN_COLS;
  const gap = 8;

  if (isPortraitLayout()) {
    // 直向:畫布窄很多 ⇒ 邊距收窄,磚塊才不會細成一條;畫布高很多 ⇒ 列距拉高,
    // 磚牆才不會縮在頂端一小條。但磚高不超過磚寬的 0.8 倍 —— 打磚塊的磚是橫的。
    const side = 16;
    const brickWidth = (canvas.width - side * 2 - gap * (cols - 1)) / cols;
    const brickHeight = clamp(Math.round(canvas.height * 0.038), 24, Math.round(brickWidth * 0.85));
    return {
      cols,
      side,
      gap,
      // 磚牆擺在偏上但不貼頂:直向只有 5~7 列,貼著頂端會變成「上面一小條、下面一大片空」。
      // 往下挪到 14% 之後,上方留給進度條、下方的落球區也不會誇張到像沒畫完。
      top: Math.round(canvas.height * 0.14),
      brickHeight,
      brickWidth,
    };
  }

  const side = 36;
  return {
    cols,
    side,
    gap,
    top: 70,
    brickHeight: 24,
    brickWidth: (canvas.width - side * 2 - gap * (cols - 1)) / cols,
  };
}

// 一列佔多高(磚高 + 間隙)。下壓、危險線與重排都吃這一個數字,
// 兩個方向才不會各自有一份會慢慢走鐘的列距。
function getBrickRowPitch() {
  const layout = getBrickLayout();
  return layout.brickHeight + layout.gap;
}

// BOSS 關的版面幾何。和 getBrickLayout() 同樣的理由:createBossBricks() 與
// relayoutBricks() 共用同一份,轉手機重排時 BOSS 才不會跑掉。
function getBossLayout(level = state.level) {
  const gap = 8;
  const guardCols = 8;
  const portrait = isPortraitLayout();
  const guardLeft = portrait ? 20 : 72;
  const bossHeight = portrait ? 46 : 54;
  const top = portrait ? Math.round(canvas.height * 0.085) : 78;
  const bossWidth = Math.min(canvas.width - (portrait ? 100 : 120), 430 + level * 18);
  const guardHeight = 22;
  return {
    gap,
    guardCols,
    guardLeft,
    top,
    bossHeight,
    bossWidth,
    bossX: (canvas.width - bossWidth) * 0.5,
    guardWidth: (canvas.width - guardLeft * 2 - gap * (guardCols - 1)) / guardCols,
    guardHeight,
    guardTop: top + bossHeight + 28,
  };
}

// 從 ASCII 圖案產生磚塊。內建圖案與自訂關卡都走這裡，只差在要不要抽隨機特殊磚。
function buildBricksFromRows(rows, options = {}) {
  const { hp = 1, allowForcedSpecials = true, randomSpecialLevel = 0 } = options;
  const layout = getBrickLayout();
  const palette = getThemeConfig().palette;
  const out = [];

  for (let row = 0; row < rows.length; row += 1) {
    const line = rows[row] || "";
    for (let col = 0; col < layout.cols; col += 1) {
      const cell = line[col] || ".";
      if (cell === ".") {
        continue;
      }

      // 圖例指定的特殊磚優先；'#' 才回頭抽隨機特殊磚（維持原本的難度曲線）。
      const forced = allowForcedSpecials ? PATTERN_SPECIALS[cell] : null;
      const special = forced
        || (cell === "#" && randomSpecialLevel > 0 ? pickSpecialBrick(randomSpecialLevel) : null);
      const baseX = layout.side + col * (layout.brickWidth + layout.gap);
      const baseY = layout.top + row * (layout.brickHeight + layout.gap);
      const specialHp = special === "steel" ? hp + 1 : hp;

      out.push({
        x: baseX,
        baseX,
        y: baseY,
        row,
        col,
        width: layout.brickWidth,
        height: layout.brickHeight,
        hp: specialHp,
        maxHp: specialHp,
        color: palette[(row + col) % palette.length],
        alive: true,
        special,
        movePhase: random() * Math.PI * 2,
        moveRange: special === "moving" ? 14 + random() * 12 : 0,
      });
    }
  }
  return out;
}

function createBricks(level) {
  state.descendRows = 0;   // 新的一關重新排版,下壓的累計要跟著歸零
  // 自訂關卡：整局就是玩家畫的那一張，不接內建圖案、也不出 BOSS。
  if (state.customRows) {
    state.levelName = "自訂關卡";
    bricks = buildBricksFromRows(state.customRows, {
      hp: Math.min(3, 1 + getDifficultyConfig().hpBonus),
      allowForcedSpecials: true,
      randomSpecialLevel: 0,   // 自訂關卡完全照畫的來，不另外亂加特殊磚
    });
    if (bricks.length === 0) {
      state.customRows = null;   // 理論上進不來（存進去前驗過），保險絲而已
    } else {
      return;
    }
  }

  if (level > 1 && level % BOSS_INTERVAL === 0) {
    state.levelName = "BOSS";
    createBossBricks(level);
    return;
  }

  const pattern = getLevelPattern(level);
  const hp = Math.min(4, 1 + Math.floor((level - 1) / 2) + getDifficultyConfig().hpBonus);

  state.levelName = pattern.name;
  bricks = buildBricksFromRows(pattern.rows, {
    hp,
    allowForcedSpecials: level >= 2,
    randomSpecialLevel: level,
  });

  // 🛟 保險絲：圖案寫壞（整張空）會變成「一開場就過關」的無限迴圈 ⇒ 退回滿版矩形。
  if (bricks.length === 0) {
    state.levelName = "";
    bricks = buildBricksFromRows(
      Array.from({ length: 6 }, () => "#".repeat(PATTERN_COLS)),
      { hp, allowForcedSpecials: false, randomSpecialLevel: 0 },
    );
  }
}

function createBossBricks(level) {
  const palette = getThemeConfig().palette;
  const bl = getBossLayout(level);
  const { bossWidth, bossHeight, bossX, top, guardCols, gap, guardWidth, guardHeight } = bl;
  const bossHp = 10 + level * 2 + getDifficultyConfig().hpBonus * 3;

  bricks = [{
    x: bossX,
    baseX: bossX,
    y: top,
    row: 0,
    col: 0,
    width: bossWidth,
    height: bossHeight,
    hp: bossHp,
    maxHp: bossHp,
    color: "#f87171",
    alive: true,
    special: "boss",
    movePhase: random() * Math.PI * 2,
    moveRange: 30,
  }];

  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < guardCols; col += 1) {
      const special = ["split", "speed", "bounce", "steel"][Math.floor(random() * 4)];
      const baseX = bl.guardLeft + col * (guardWidth + gap);
      const baseY = bl.guardTop + row * (guardHeight + gap);
      const hp = Math.min(4, 1 + Math.floor(level / 3) + getDifficultyConfig().hpBonus);
      bricks.push({
        x: baseX,
        baseX,
        y: baseY,
        row: row + 1,
        col,
        width: guardWidth,
        height: guardHeight,
        hp,
        maxHp: hp,
        color: palette[(row + col) % palette.length],
        alive: true,
        special,
        movePhase: random() * Math.PI * 2,
        moveRange: 0,
      });
    }
  }
}

function refreshBrickTheme() {
  const palette = getThemeConfig().palette;
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    brick.color = palette[(brick.row + brick.col) % palette.length];
  }
}

function resetBallsOnPaddle() {
  balls = [
    createBall(
      paddle.x + paddle.width * 0.5,
      paddle.y - getBallRadius() - 1,
      true,
      0,
      0,
    ),
  ];
}

function launchBall(ball) {
  const scale = getSpeedScale();
  const baseSpeed = (getDifficultyConfig().ballSpeed + (state.level - 1) * 0.35) * scale;
  const horizontal = (random() * 0.8 + 0.55) * (random() < 0.5 ? -1 : 1);
  ball.vx = baseSpeed * horizontal;
  // 下限是「速度的平方」,所以縮放要平方一次
  ball.vy = -Math.sqrt(Math.max(4 * scale * scale, baseSpeed * baseSpeed - ball.vx * ball.vx));
  ball.stuck = false;
}

function resetPositions() {
  positionPaddleY();
  paddle.x = (canvas.width - paddle.width) * 0.5;
  paddle.dx = 0;
  resetBallsOnPaddle();
}

function restartGame(options = {}) {
  const { countGame = true, showStartOverlay = true } = options;
  cancelLevelCountdown();
  cancelRestartCountdown();
  state.running = false;
  state.gameOver = false;
  state.score = 0;
  state.lives = getDifficultyConfig().lives;
  state.level = 1;
  state.combo = 0;
  state.comboTimer = 0;
  state.assistStacks = 0;
  state.assistWidthBonus = 0;
  state.descendRows = 0;
  sessionStats = createSessionStats();
  sessionStats.highestLevel = 1;
  powerupSpawnCounts = createPowerupCounter();
  clearTemporaryPowerups();
  resetPowerupCharges();
  stopMusic();
  resetRandomSource();

  paddle.width = getPaddleBaseWidth();
  paddle.speed = getPaddleSpeed();
  powerups = [];
  bossRocks = [];
  state.bossAttackTimer = 0;
  state.descendTimer = 0;
  state.descendShown = false;
  bullets = [];
  floatingTexts = [];

  if (countGame) {
    records.gamesPlayed += 1;
    saveRecords();
  }

  createBricks(state.level);
  sessionStats.totalBricks = bricks.length;
  resetPositions();
  updateHud();
  syncSettingsControls();
  evaluateAchievements();
  if (showStartOverlay) {
    setOverlay("打磚塊", "按空白鍵、開始遊戲或手機按鈕發射球。", {
      showActions: true,
      showSettings: true,
      stats: getOverlayStatItems(),
    });
  }
  syncButton();
}

function restartGameAndCountdown(title = "重新開始") {
  resizeCanvasForScreen();
  restartGame({ showStartOverlay: false });
  beginLevelCountdown(title);
}

function startOrResume() {
  if (!isGameScreenActive) {
    startGameFromSetup();
    return;
  }

  if (shouldShowRotatePrompt()) {
    pendingStartAfterLandscape = true;
    updateOrientationPrompt();
    return;
  }

  cancelLevelCountdown();

  if (state.gameOver) {
    restartGame();
  }

  if (balls.length === 0) {
    resetBallsOnPaddle();
  }

  const stuckBall = balls.find((item) => item.stuck);
  if (stuckBall) {
    launchBall(stuckBall);
  }

  state.running = true;
  startMusic();
  setOverlay("", "", { visible: false });
  syncButton();
}

function pauseGame(showSettings = true) {
  cancelLevelCountdown();
  state.running = false;
  stopMusic();
  setOverlay("已暫停", "可以調整設定、重新開始，或繼續這一局。", {
    showActions: true,
    showSettings,
    stats: getOverlayStatItems(),
  });
  syncButton();
}

// 同一關失誤達門檻就出手:加寬板子。回傳是否真的出手(用來決定提示文字)。
function applyAssistIfStruggling() {
  if (!preferences.assist) {
    return false;
  }
  if (sessionStats.levelLivesLost < ASSIST_DEATHS_TRIGGER) {
    return false;
  }
  if (state.assistStacks >= ASSIST_MAX_STACKS) {
    return false;
  }
  // 上限沿用 expand 寶物的 260,避免板子寬到整個畫面
  const widened = clamp(paddle.width + getAssistPaddleBonus(), getPaddleMinWidth(), getPaddleMaxWidth());
  if (widened === paddle.width) {
    return false;
  }
  // 記「實際加了多少」而不是 ASSIST_PADDLE_BONUS —— 撞到 260 上限時兩者不同,
  // 用常數扣回去會把玩家自己吃到的 expand 寶物一起扣掉。
  state.assistWidthBonus += widened - paddle.width;
  paddle.width = widened;
  paddle.x = clamp(paddle.x, 0, canvas.width - paddle.width);
  state.assistStacks += 1;
  sessionStats.assistUsed = true;
  spawnFloatingText("已開啟輔助：板子加寬", canvas.width * 0.5, paddle.y - 34, "#7ae582");
  return true;
}

function loseLife() {
  state.lives -= 1;
  sessionStats.livesLost += 1;
  sessionStats.levelLivesLost += 1;
  state.combo = 0;
  state.comboTimer = 0;
  clearTemporaryPowerups();
  powerups = [];
  bullets = [];
  bossRocks = [];   // 殘留落石會變成「看不見的傷害」,掉命時一定要清
  state.descendTimer = 0;   // 復活後重新計時,不要一回來就被壓
  updateHud();
  addImpact(7, 0.08);
  vibrate([80, 40, 80]);

  if (state.lives <= 0) {
    state.running = false;
    stopMusic();
    state.gameOver = true;
    const rank = recordRunScore();
    const gapToTop = getPointsToEnterTop(state.score);
    const rankText = rank === 1
      ? "🏆 新紀錄！這局排到第 1 名。"
      : rank > 0
        ? `進榜了！這局排第 ${rank} 名。`
        : gapToTop > 0
          ? `再多 ${gapToTop} 分就能擠進 Top 10。`
          : "";
    recordDailyToday();   // 存「今天」這一筆，分享圖卡才印得出誠實的日期＋成績
    setOverlay("遊戲結束", `最終分數：${state.score}。最高分：${records.bestScore}。${rankText}`, {
      showActions: true,
      showSettings: true,
      showShare: state.mode === "daily" && !state.customRows,
      stats: getOverlayStatItems(),
    });
    syncButton();
    saveRecords();
    // 📡 完賽打點:一局分出結果的唯一時刻(無盡關卡制,生命歸零=這局結束)。
    //    放在 saveRecords() 之後,統計壞掉也絕不影響存檔。
    if (typeof window !== "undefined" && window.psDone) {
      window.psDone();
    }
    clearSavedRun();   // 這局已經結束,存檔留著只會讓人接到一個死局
    return;
  }

  state.running = false;
  stopMusic();
  const assisted = applyAssistIfStruggling();
  resetBallsOnPaddle();
  saveRun();
  setOverlay("失去一命", assisted
    ? `這關卡關了，已自動把板子加寬幫你一把。剩餘生命：${state.lives}。`
    : `剩餘生命：${state.lives}。按空白鍵或開始遊戲繼續。`, {
    showActions: true,
    showSettings: false,
    stats: getOverlayStatItems(),
  });
  syncButton();
}

function nextLevel() {
  state.running = false;
  stopMusic();

  // 自訂關卡是「一關定勝負」:打完就結算,不接內建關卡(接了就不是玩家畫的那一關了)。
  if (state.customRows) {
    state.gameOver = true;
    sessionStats.levelsCleared += 1;
    addScore(100);
    setOverlay("自訂關卡完成！", `得分 ${state.score}。把分享碼傳給朋友，看誰分數高。`, {
      showActions: true,
      showSettings: true,
      stats: getOverlayStatItems(),
    });
    syncButton();
    clearSavedRun();
    if (typeof window !== "undefined" && window.psDone) {
      window.psDone();
    }
    return;
  }


  if (sessionStats.levelLivesLost === 0) {
    unlockAchievement("no_miss_level");
  }

  sessionStats.levelsCleared += 1;
  sessionStats.levelLivesLost = 0;
  // 輔助只針對「卡住的那一關」：過關就把加寬收回，否則整局會愈玩愈簡單、分數也失去意義。
  // 只扣自己加的那一段，玩家吃到的 expand 寶物原封不動保留。
  paddle.width = clamp(paddle.width - state.assistWidthBonus, getPaddleMinWidth(), getPaddleMaxWidth());
  paddle.x = clamp(paddle.x, 0, canvas.width - paddle.width);
  state.assistWidthBonus = 0;
  state.assistStacks = 0;
  state.combo = 0;
  state.comboTimer = 0;
  state.level += 1;
  sessionStats.highestLevel = Math.max(sessionStats.highestLevel, state.level);
  records.bestLevel = Math.max(records.bestLevel, sessionStats.highestLevel);
  saveRecords();
  addScore(50);
  clearTemporaryPowerups();
  powerups = [];
  bullets = [];
  bossRocks = [];
  state.bossAttackTimer = 0;
  state.descendTimer = 0;   // 新關重新計時,不要一進場就下壓

  createBricks(state.level);
  sessionStats.totalBricks = bricks.length;
  resetPositions();
  updateHud();
  beginLevelCountdown(getLevelTitle());
  syncButton();
  saveRun();   // 過關是最自然的檢查點
}

function syncStuckBallsWithPaddle() {
  for (let i = 0; i < balls.length; i += 1) {
    if (balls[i].stuck) {
      balls[i].x = paddle.x + paddle.width * 0.5;
      balls[i].y = paddle.y - balls[i].radius - 1;
    }
  }
}

function getCanvasScaleX() {
  const rect = canvas.getBoundingClientRect();
  return canvas.width / rect.width;
}

function movePaddleTo(clientX) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = getCanvasScaleX();
  const x = (clientX - rect.left) * scaleX;
  paddle.x = clamp(x - paddle.width * 0.5, 0, canvas.width - paddle.width);
  syncStuckBallsWithPaddle();
}

function movePaddleByTouchDelta(clientX) {
  const delta = (clientX - touchControl.startX) * getCanvasScaleX() * TOUCH_DRAG_SENSITIVITY;
  paddle.x = clamp(touchControl.startPaddleX + delta, 0, canvas.width - paddle.width);
  syncStuckBallsWithPaddle();
}

function startFromCanvasIfIdle() {
  if (!isGameScreenActive || state.running || shouldShowRotatePrompt() || levelCountdownTimerId !== null) {
    return false;
  }

  if (state.gameOver) {
    restartGameAndCountdown("重新開始");
  } else {
    beginLevelCountdown("準備開始");
  }
  return true;
}

function updatePaddle(step) {
  if (keys.left && !keys.right) {
    paddle.dx = -paddle.speed;
  } else if (keys.right && !keys.left) {
    paddle.dx = paddle.speed;
  } else {
    paddle.dx = 0;
  }

  if (paddle.dx !== 0) {
    paddle.x += paddle.dx * step;
    paddle.x = clamp(paddle.x, 0, canvas.width - paddle.width);
  }

  syncStuckBallsWithPaddle();
}

// 危險線:磚塊碰到這條就扣一命。畫在板子上方一點,讓玩家看得到自己還有多少空間。
function getDangerLineY() {
  return paddle.y - 26;
}

// 這一關會不會下壓(休閒關閉、BOSS 關不壓)
function isDescendActive() {
  return getDifficultyConfig().descendSec > 0 && !getAliveBoss();
}

// 整面往下移 rows 格(負數 = 往上推回去)
function shiftBricks(rows) {
  const dy = rows * getBrickRowPitch();
  for (let i = 0; i < bricks.length; i += 1) {
    bricks[i].y += dy;
  }
  // 記「累計壓了幾格」而不是只改 y:轉手機要重排時,才知道要往下補多少
  state.descendRows += rows;
}

// 最低的那顆活磚的底緣
function getLowestBrickBottom() {
  let lowest = -Infinity;
  for (let i = 0; i < bricks.length; i += 1) {
    if (bricks[i].alive) {
      lowest = Math.max(lowest, bricks[i].y + bricks[i].height);
    }
  }
  return lowest;
}

function updateBrickDescent(deltaSec) {
  if (!isDescendActive()) {
    state.descendTimer = 0;
    return;
  }

  const interval = getDescendInterval();
  if (state.descendTimer <= 0) {
    state.descendTimer = interval;
    return;
  }

  state.descendTimer -= deltaSec;
  if (state.descendTimer > 0) {
    return;
  }

  state.descendTimer = interval;
  shiftBricks(1);
  addImpact(2.4, 0.03);

  // 第一次下壓時說明一次,之後不再囉嗦
  if (!state.descendShown) {
    state.descendShown = true;
    spawnFloatingText("磚塊會定時下移，別讓它們碰到紅線", canvas.width * 0.5, canvas.height * 0.42, "#ffaf54");
  }

  if (getLowestBrickBottom() >= getDangerLineY()) {
    // 撞線:扣一命,並把磚塊推回去。不推回去的話復活後還是壓在線上 => 復活即死迴圈。
    shiftBricks(-DESCEND_PUSHBACK_ROWS);
    spawnFloatingText("磚塊壓境！", canvas.width * 0.5, getDangerLineY() - 20, "#fb7185");
    loseLife();
  }
}

// 危險線本身:沒有下壓的難度不畫(畫了只會讓人以為有陷阱)
function drawDangerLine() {
  if (!isDescendActive()) {
    return;
  }

  const y = getDangerLineY();
  const lowest = getLowestBrickBottom();
  const gapRows = lowest > -Infinity ? (y - lowest) / getBrickRowPitch() : 99;
  const soon = state.descendTimer > 0 && state.descendTimer <= DESCEND_WARN_SEC;
  // 剩一格以內、或即將下壓時閃爍加粗,讓危險「看得見」而不只是數字
  const urgent = gapRows <= 1.2 || soon;

  ctx.save();
  ctx.globalAlpha = urgent ? 0.45 + 0.35 * Math.abs(Math.sin(Date.now() / 110)) : 0.28;
  ctx.strokeStyle = urgent ? "#ff4d4d" : "#ff9aa8";
  ctx.lineWidth = urgent ? 3 : 2;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(14, y);
  ctx.lineTo(canvas.width - 14, y);
  ctx.stroke();
  ctx.restore();
}

function updateBricks(step) {
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive || (brick.special !== "moving" && brick.special !== "boss")) {
      continue;
    }

    brick.movePhase += (brick.special === "boss" ? 0.01 : 0.018) * step * (1 + state.level * 0.04);
    brick.x = clamp(
      brick.baseX + Math.sin(brick.movePhase) * brick.moveRange,
      8,
      canvas.width - brick.width - 8,
    );
  }
}

function spawnPowerup(brick) {
  if (random() > getDifficultyConfig().dropRate) {
    return;
  }

  const availablePowerups = POWERUP_TYPES.filter(
    (powerup) => (powerupSpawnCounts[powerup.type] ?? 0) < POWERUP_LIMIT_PER_TYPE,
  );

  if (availablePowerups.length === 0) {
    return;
  }

  const pick = availablePowerups[Math.floor(random() * availablePowerups.length)];
  powerupSpawnCounts[pick.type] = (powerupSpawnCounts[pick.type] ?? 0) + 1;
  sessionStats.powerupsSpawned += 1;
  powerups.push({
    x: brick.x + brick.width * 0.5,
    y: brick.y + brick.height * 0.5,
    vy: getPowerupFallSpeed(),
    size: 20,
    type: pick.type,
    label: pick.label,
    color: pick.color,
  });
}

function spawnFloatingText(text, x, y, color = "#ffffff") {
  floatingTexts.push({
    text,
    x,
    y,
    life: 1,
    color,
  });
}

function slowBall(ball, factor, minSpeed) {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed < 0.001) {
    return;
  }

  const target = Math.max(minSpeed, speed * factor);
  const scale = target / speed;
  ball.vx *= scale;
  ball.vy *= scale;
}

function speedBall(ball, factor, maxSpeed = 11.2) {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed < 0.001) {
    return;
  }

  const target = Math.min(maxSpeed, speed * factor);
  const scale = target / speed;
  ball.vx *= scale;
  ball.vy *= scale;
}

function speedActiveBalls(factor = 1.16) {
  for (let i = 0; i < balls.length; i += 1) {
    if (!balls[i].stuck) {
      speedBall(balls[i], factor);
    }
  }
}

function spawnSplitBallsFromBrick(brick, count = 2) {
  if (balls.length >= MAX_BALLS) {
    return 0;
  }

  const speed = Math.max(4.2, getDifficultyConfig().ballSpeed + state.level * 0.12) * getSpeedScale();
  let created = 0;
  const spread = 1.1;
  for (let i = 0; i < count; i += 1) {
    if (balls.length >= MAX_BALLS) {
      break;
    }
    const angle = -Math.PI * 0.5 - spread * 0.5 + (spread * (i + 0.5)) / count;
    balls.push(createBall(
      brick.x + brick.width * 0.5,
      brick.y + brick.height + BALL_RADIUS + 1,
      false,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
    ));
    created += 1;
  }
  return created;
}

function createSplitBallsFrom(source, requestedCount = 2) {
  if (balls.length >= MAX_BALLS) {
    return 0;
  }

  let baseVx = source.vx;
  let baseVy = source.vy;

  if (Math.abs(baseVx) < 0.05 && Math.abs(baseVy) < 0.05) {
    const speed = 5.3;
    baseVx = speed * 0.62 * (random() < 0.5 ? -1 : 1);
    baseVy = -Math.sqrt(speed * speed - baseVx * baseVx);
  }

  const spread = Math.min(1.25, 0.36 * Math.max(2, requestedCount));
  const angles = Array.from({ length: requestedCount }, (_, index) => {
    if (requestedCount === 1) {
      return 0.45;
    }
    return -spread * 0.5 + (spread * index) / (requestedCount - 1);
  });
  let created = 0;

  for (let i = 0; i < angles.length; i += 1) {
    if (balls.length >= MAX_BALLS) {
      break;
    }

    const rotated = rotateVector(baseVx, baseVy, angles[i]);
    const speed = Math.hypot(rotated.vx, rotated.vy);
    if (speed < 0.001) {
      continue;
    }

    const minUp = 0.9 * getSpeedScale();
    let vy = rotated.vy;
    if (vy > -minUp) {
      vy = -Math.abs(vy) - minUp;
    }

    balls.push(createBall(source.x, source.y, false, rotated.vx, vy));
    created += 1;
  }

  return created;
}

function applyPowerup(powerup) {
  sessionStats.powerupsCaught += 1;
  sessionStats.powerupCounts[powerup.type] = (sessionStats.powerupCounts[powerup.type] ?? 0) + 1;
  vibrate(25);

  if (powerup.type === "expand") {
    paddle.width = clamp(paddle.width + getPaddleExpandStep(), getPaddleMinWidth(), getPaddleMaxWidth());
    paddle.x = clamp(paddle.x, 0, canvas.width - paddle.width);
    spawnFloatingText("板子變長", powerup.x, paddle.y - 12, "#98f5b4");
  } else if (powerup.type === "bigball") {
    state.bigBallTimer = Math.max(state.bigBallTimer, BIG_BALL_DURATION);
    setBallRadius(BIG_BALL_RADIUS);
    spawnFloatingText("巨球啟動", powerup.x, paddle.y - 12, "#ffcf70");
  } else if (powerup.type === "slow") {
    for (let i = 0; i < balls.length; i += 1) {
      if (!balls[i].stuck) {
        slowBall(balls[i], 0.78, 3.4);
      }
    }
    spawnFloatingText("球速變慢", powerup.x, paddle.y - 12, "#8ed8ff");
  } else if (powerup.type === "multiball" || powerup.type === "multiball3" || powerup.type === "multiball4") {
    const source = balls.find((item) => !item.stuck) || balls[0];
    if (source) {
      if (source.stuck) {
        launchBall(source);
      }

      const splitCount = powerup.type === "multiball4" ? 4 : powerup.type === "multiball3" ? 3 : 2;
      const created = createSplitBallsFrom(source, splitCount);
      if (created > 0) {
        spawnFloatingText(`多 ${created} 顆球`, powerup.x, paddle.y - 12, "#ffe680");
      } else {
        spawnFloatingText("球數已滿", powerup.x, paddle.y - 12, "#ffe680");
      }
    }
  } else if (powerup.type === "laser") {
    state.gunTimer = Math.max(state.gunTimer, GUN_DURATION);
    state.shotCooldown = 0;
    spawnFloatingText("雷射啟動", powerup.x, paddle.y - 12, "#ff9ce0");
  } else if (powerup.type === "life") {
    if (state.lives < MAX_LIVES) {
      state.lives += 1;
      spawnFloatingText("生命 +1", powerup.x, paddle.y - 12, "#7ae582");
      vibrate([35, 40, 35]);
    } else {
      addScore(80);
      spawnFloatingText("生命已滿 +80", powerup.x, paddle.y - 12, "#7ae582");
    }
  } else if (powerup.type === "shield") {
    state.shieldCharges = Math.min(SHIELD_MAX_CHARGES, state.shieldCharges + 1);
    spawnFloatingText(`護盾 x${state.shieldCharges}`, powerup.x, paddle.y - 12, "#67e8f9");
    vibrate([30, 35, 30]);
  } else if (powerup.type === "magnet") {
    state.magnetTimer = Math.max(state.magnetTimer, MAGNET_DURATION);
    spawnFloatingText("磁鐵板啟動", powerup.x, paddle.y - 12, "#c084fc");
  } else if (powerup.type === "pierce") {
    state.pierceTimer = Math.max(state.pierceTimer, PIERCE_DURATION);
    spawnFloatingText("穿透球啟動", powerup.x, paddle.y - 12, "#bef264");
  } else if (powerup.type === "score2x") {
    state.scoreMultiplierTimer = Math.max(state.scoreMultiplierTimer, SCORE_MULTIPLIER_DURATION);
    spawnFloatingText(`分數 x${SCORE_MULTIPLIER}`, powerup.x, paddle.y - 12, "#facc15");
  } else if (powerup.type === "attract") {
    state.powerupMagnetTimer = Math.max(state.powerupMagnetTimer, POWERUP_MAGNET_DURATION);
    spawnFloatingText("吸寶物啟動", powerup.x, paddle.y - 12, "#38bdf8");
  } else if (powerup.type === "bombball") {
    state.bombBallCharges = Math.min(BOMB_BALL_MAX_CHARGES, state.bombBallCharges + 1);
    spawnFloatingText(`炸彈球 x${state.bombBallCharges}`, powerup.x, paddle.y - 12, "#fb7185");
    vibrate([35, 25, 35]);
  } else if (powerup.type === "timeslow") {
    state.timeSlowTimer = Math.max(state.timeSlowTimer, TIME_SLOW_DURATION);
    spawnFloatingText("慢動作", powerup.x, paddle.y - 12, "#93c5fd");
  } else if (powerup.type === "shadow") {
    state.shadowPaddleTimer = Math.max(state.shadowPaddleTimer, SHADOW_PADDLE_DURATION);
    spawnFloatingText("雙板啟動", powerup.x, paddle.y - 12, "#a7f3d0");
  }

  evaluateAchievements();
  updateHud();
}

function updatePowerups(step) {
  for (let i = powerups.length - 1; i >= 0; i -= 1) {
    const powerup = powerups[i];
    const half = powerup.size * 0.5;
    if (state.powerupMagnetTimer > 0) {
      const targetX = paddle.x + paddle.width * 0.5;
      const pull = clamp((targetX - powerup.x) * 0.065, -4.4, 4.4);
      powerup.x = clamp(powerup.x + pull * step, half, canvas.width - half);
    }
    powerup.y += powerup.vy * step;

    const hitsY = powerup.y + half >= paddle.y && powerup.y - half <= paddle.y + paddle.height;
    const hitsX = powerup.x + half >= paddle.x && powerup.x - half <= paddle.x + paddle.width;

    if (hitsX && hitsY) {
      applyPowerup(powerup);
      powerups.splice(i, 1);
      continue;
    }

    if (powerup.y - half > canvas.height) {
      powerups.splice(i, 1);
    }
  }
}

function updateFloatingTexts(step) {
  for (let i = floatingTexts.length - 1; i >= 0; i -= 1) {
    const item = floatingTexts[i];
    item.y -= 0.8 * step;
    item.life -= 0.022 * step;

    if (item.life <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
}

function handleWallCollision(ball) {
  if (ball.x - ball.radius <= 0 && ball.vx < 0) {
    ball.x = ball.radius;
    ball.vx *= -1;
  }

  if (ball.x + ball.radius >= canvas.width && ball.vx > 0) {
    ball.x = canvas.width - ball.radius;
    ball.vx *= -1;
  }

  if (ball.y - ball.radius <= 0 && ball.vy < 0) {
    ball.y = ball.radius;
    ball.vy *= -1;
  }

  if (ball.y - ball.radius > canvas.height) {
    if (state.shieldCharges > 0) {
      state.shieldCharges -= 1;
      ball.y = canvas.height - ball.radius - 8;
      ball.vy = -Math.max(5.2 * getSpeedScale(), Math.abs(ball.vy) * 0.92);
      ball.vx += (random() - 0.5) * 1.2;
      spawnFloatingText(`護盾擋下 x${state.shieldCharges}`, canvas.width * 0.5, canvas.height - 42, "#67e8f9");
      playBrickHitSound();
      vibrate([45, 35, 45]);
      updateHud();
      return false;
    }
    return true;
  }

  return false;
}

function handlePaddleCollision(ball) {
  if (ball.vy <= 0) {
    return;
  }

  const hitRect = getPaddleHitRects().find((rect) => {
    const hitsY = ball.y + ball.radius >= rect.y && ball.y - ball.radius <= rect.y + rect.height;
    const hitsX = ball.x + ball.radius >= rect.x && ball.x - ball.radius <= rect.x + rect.width;
    return hitsX && hitsY;
  });

  if (!hitRect) {
    return;
  }

  ball.y = hitRect.y - ball.radius - 0.1;

  if (state.magnetTimer > 0) {
    ball.stuck = true;
    ball.vx = 0;
    ball.vy = 0;
    syncStuckBallsWithPaddle();
    spawnFloatingText("瞄準再發射", paddle.x + paddle.width * 0.5, paddle.y - 18, "#c084fc");
    return;
  }

  const hitPosition = (ball.x - (hitRect.x + hitRect.width * 0.5)) / (hitRect.width * 0.5);
  const speed = Math.min(9.8 * getSpeedScale(), Math.hypot(ball.vx, ball.vy) * 1.02);
  const angle = hitPosition * (Math.PI / 3);

  ball.vx = speed * Math.sin(angle);
  ball.vy = -Math.abs(speed * Math.cos(angle));
}

function destroyBrick(brick, options = {}) {
  if (!brick.alive) {
    return;
  }

  brick.alive = false;
  sessionStats.bricksDestroyed += 1;
  // 連鎖爆破一次會打掉一整片,每顆都震會變成無法辨識的抖動 ⇒ 爆破來的只給極小值
  addImpact(options.fromExplosion ? 0.35 : 1.1, options.fromExplosion ? 0 : 0.012);
  if (!options.fromExplosion) {
    spawnPowerup(brick);
  }
  if (brick.special === "bomb" && !options.fromExplosion) {
    explodeBrick(brick);
  }
  if (brick.special === "split" && !options.fromExplosion) {
    const created = spawnSplitBallsFromBrick(brick, 2);
    if (created > 0) {
      spawnFloatingText(`分裂 +${created}`, brick.x + brick.width * 0.5, brick.y, "#c2f970");
    }
  }
  if (brick.special === "speed" && !options.fromExplosion) {
    speedActiveBalls(1.18);
    spawnFloatingText("加速", brick.x + brick.width * 0.5, brick.y, "#ffb86b");
  }
  if (brick.special === "boss") {
    addImpact(6, 0.075);
    addScore(150);
    spawnFloatingText("BOSS CLEAR +150", brick.x + brick.width * 0.5, brick.y, "#ffe680");
    vibrate([45, 40, 45]);
  }
}

function registerCombo(options = {}) {
  if (options.fromExplosion) {
    return 0;
  }

  state.combo += 1;
  state.comboTimer = 2.6;
  sessionStats.maxCombo = Math.max(sessionStats.maxCombo, state.combo);

  const bonus = state.combo >= 3 ? Math.min(40, Math.floor(state.combo / 3) * 3) : 0;
  if (bonus > 0) {
    addImpact(Math.min(3.2, 0.9 + state.combo * 0.12), Math.min(0.05, state.combo * 0.003));
    sessionStats.totalComboBonus += bonus;
    spawnFloatingText(`Combo x${state.combo} +${bonus}`, canvas.width * 0.5, canvas.height - 78, "#ffe680");
  }

  return bonus;
}

function damageBrick(brick, options = {}) {
  if (!brick.alive) {
    return;
  }

  if (!options.fromExplosion) {
    playBrickHitSound();
    vibrate(8);
    sessionStats.bricksHit += 1;
  }

  brick.hp -= 1;
  const comboBonus = registerCombo(options);
  if (brick.hp <= 0) {
    addScore((options.fromExplosion ? 6 : 10) + comboBonus);
    destroyBrick(brick, options);
  } else {
    addScore((options.fromExplosion ? 2 : 4) + comboBonus);
  }
}

function explodeBrick(source) {
  addImpact(4.5, 0.05);
  spawnFloatingText("爆破", source.x + source.width * 0.5, source.y, "#ffb4a8");
  vibrate([25, 25, 25]);
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive || brick === source) {
      continue;
    }

    const isNeighbor = Math.abs(brick.row - source.row) <= 1 && Math.abs(brick.col - source.col) <= 1;
    if (isNeighbor) {
      damageBrick(brick, { fromExplosion: true });
    }
  }
}

function checkLevelCleared() {
  if (state.running && bricks.every((item) => !item.alive)) {
    nextLevel();
  }
}

function handleBrickCollision(ball) {
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive) {
      continue;
    }

    const closestX = clamp(ball.x, brick.x, brick.x + brick.width);
    const closestY = clamp(ball.y, brick.y, brick.y + brick.height);
    const dx = ball.x - closestX;
    const dy = ball.y - closestY;

    if (dx * dx + dy * dy > ball.radius * ball.radius) {
      continue;
    }

    const prevX = ball.x - ball.vx;
    const prevY = ball.y - ball.vy;
    const hitVertical = prevY + ball.radius <= brick.y || prevY - ball.radius >= brick.y + brick.height;
    const hitHorizontal = prevX + ball.radius <= brick.x || prevX - ball.radius >= brick.x + brick.width;

    const isPiercing = state.pierceTimer > 0;
    if (!isPiercing) {
      if (hitHorizontal && !hitVertical) {
        ball.vx *= -1;
      } else {
        ball.vy *= -1;
      }
    }

    damageBrick(brick);
    if (state.bombBallCharges > 0) {
      state.bombBallCharges -= 1;
      explodeBrick(brick);
      spawnFloatingText("炸彈球", brick.x + brick.width * 0.5, brick.y, "#fb7185");
      vibrate([35, 25, 35]);
      updateHud();
    }
    if (brick.special === "bounce") {
      const rotated = rotateVector(ball.vx, ball.vy, random() < 0.5 ? -0.55 : 0.55);
      ball.vx = rotated.vx;
      ball.vy = rotated.vy;
      spawnFloatingText("反彈", brick.x + brick.width * 0.5, brick.y, "#7dd3fc");
    }
    if (brick.special === "speed") {
      speedBall(ball, 1.12);
    }
    if (brick.special === "boss") {
      speedBall(ball, 1.03);
    }
    checkLevelCleared();

    if (isPiercing) {
      ball.x += ball.vx * 1.4;
      ball.y += ball.vy * 1.4;
      return;
    }

    const speed = Math.hypot(ball.vx, ball.vy);
    const targetSpeed = Math.min(9.8, speed * 1.003);
    if (targetSpeed !== speed) {
      const scale = targetSpeed / speed;
      ball.vx *= scale;
      ball.vy *= scale;
    }

    return;
  }
}

function fireBullets() {
  if (!state.running || state.gunTimer <= 0 || state.shotCooldown > 0) {
    return;
  }

  const y = paddle.y - 6;
  const bulletVy = -BULLET_SPEED * getSpeedScale();
  bullets.push({ x: paddle.x + 14, y, w: 4, h: 13, vy: bulletVy });
  bullets.push({ x: paddle.x + paddle.width - 14, y, w: 4, h: 13, vy: bulletVy });
  sessionStats.shotsFired += 2;
  state.shotCooldown = AUTO_FIRE_INTERVAL;
  updateHud();
}

function handleBulletCollision(bullet) {
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive) {
      continue;
    }

    const hitsX = bullet.x >= brick.x && bullet.x <= brick.x + brick.width;
    const hitsY = bullet.y >= brick.y && bullet.y <= brick.y + brick.height;

    if (!hitsX || !hitsY) {
      continue;
    }

    sessionStats.bulletsHit += 1;
    damageBrick(brick);
    checkLevelCleared();
    evaluateAchievements();
    return true;
  }

  return false;
}

function updateBalls(step) {
  for (let i = balls.length - 1; i >= 0; i -= 1) {
    const ball = balls[i];

    if (ball.stuck) {
      continue;
    }

    ball.x += ball.vx * step;
    ball.y += ball.vy * step;

    if (handleWallCollision(ball)) {
      balls.splice(i, 1);
      continue;
    }

    handlePaddleCollision(ball);
    handleBrickCollision(ball);

    if (!state.running) {
      return;
    }
  }

  if (state.running && balls.length === 0) {
    loseLife();
  }
}

// 場上還活著的 BOSS(沒有就是普通關)
function getAliveBoss() {
  return bricks.find((brick) => brick.special === "boss" && brick.alive) || null;
}

// BOSS 攻擊間隔:關卡愈深、難度愈硬,砸得愈勤
function getBossAttackInterval() {
  const byLevel = BOSS_ATTACK_BASE - state.level * 0.1;
  const byDifficulty = getDifficultyConfig().hpBonus * 0.5;
  return Math.max(BOSS_ATTACK_MIN, byLevel - byDifficulty);
}

// 預告一顆落石:先只放預告線,BOSS_TELEGRAPH_SEC 後才真的落下。
// 瞄準板子目前位置(但不追蹤),玩家有時間走開 —— 這是「可閃」而不是「必中」。
function spawnBossRock(boss) {
  const targetX = clamp(
    paddle.x + paddle.width * 0.5 + (random() - 0.5) * 120,
    BOSS_ROCK_RADIUS + 4,
    canvas.width - BOSS_ROCK_RADIUS - 4,
  );
  bossRocks.push({
    x: targetX,
    y: boss.y + boss.height * 0.5,
    vy: BOSS_ROCK_SPEED * getSpeedScale() + state.level * 0.05,
    telegraph: BOSS_TELEGRAPH_SEC,
  });
}

function updateBossAttack(deltaSec) {
  const boss = getAliveBoss();
  if (!boss) {
    // BOSS 關結束就把殘留落石清掉,不要帶進下一關
    if (bossRocks.length > 0) {
      bossRocks = [];
    }
    state.bossAttackTimer = 0;
    return;
  }

  state.bossAttackTimer -= deltaSec;
  if (state.bossAttackTimer <= 0) {
    state.bossAttackTimer = getBossAttackInterval();
    spawnBossRock(boss);
  }
}

function updateBossRocks(step, deltaSec) {
  for (let i = bossRocks.length - 1; i >= 0; i -= 1) {
    const rock = bossRocks[i];

    if (rock.telegraph > 0) {
      rock.telegraph = Math.max(0, rock.telegraph - deltaSec);
      continue;   // 預告期間不移動,只有畫面上的紅線在閃
    }

    rock.y += rock.vy * step;

    if (rock.y - BOSS_ROCK_RADIUS > canvas.height) {
      bossRocks.splice(i, 1);
      continue;
    }

    // 打到板子(含雙板寶物的分身)就扣一命;護盾會先擋掉
    const rects = getPaddleHitRects();
    const hit = rects.some((rect) =>
      rock.x + BOSS_ROCK_RADIUS > rect.x
      && rock.x - BOSS_ROCK_RADIUS < rect.x + rect.width
      && rock.y + BOSS_ROCK_RADIUS > rect.y
      && rock.y - BOSS_ROCK_RADIUS < rect.y + rect.height);

    if (!hit) {
      continue;
    }

    bossRocks.splice(i, 1);
    if (state.shieldCharges > 0) {
      state.shieldCharges -= 1;
      addImpact(3, 0.03);
      spawnFloatingText("護盾擋下落石", rock.x, rock.y - 14, "#67e8f9");
      updateHud();
      continue;
    }

    addImpact(6, 0.06);
    spawnFloatingText("被落石打中！", rock.x, rock.y - 14, "#fb7185");
    loseLife();
    return;   // loseLife 會重置場面,不要再跑剩下的落石
  }
}

function drawBossRocks() {
  for (let i = 0; i < bossRocks.length; i += 1) {
    const rock = bossRocks[i];

    if (rock.telegraph > 0) {
      // 紅色預告線:從 BOSS 一路畫到底,閃爍提示「這一條等一下會有東西掉下來」
      const blink = 0.35 + 0.35 * Math.abs(Math.sin(rock.telegraph * 14));
      ctx.save();
      ctx.globalAlpha = blink;
      ctx.strokeStyle = "#ff4d4d";
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(rock.x, rock.y);
      ctx.lineTo(rock.x, canvas.height);
      ctx.stroke();
      ctx.restore();
      continue;
    }

    ctx.beginPath();
    ctx.arc(rock.x, rock.y, BOSS_ROCK_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#fb7185";
    ctx.shadowColor = "#ff9aa8";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#7f1d1d";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function updateBullets(step) {
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const bullet = bullets[i];
    bullet.y += bullet.vy * step;

    if (bullet.y + bullet.h < 0) {
      bullets.splice(i, 1);
      continue;
    }

    if (handleBulletCollision(bullet)) {
      bullets.splice(i, 1);
      if (!state.running) {
        return;
      }
    }
  }
}

function updateTimers(deltaSec) {
  if (state.shotCooldown > 0) {
    state.shotCooldown = Math.max(0, state.shotCooldown - deltaSec);
  }

  if (state.running && state.gunTimer > 0 && state.shotCooldown === 0) {
    fireBullets();
  }

  if (state.comboTimer > 0) {
    state.comboTimer = Math.max(0, state.comboTimer - deltaSec);
    if (state.comboTimer === 0) {
      state.combo = 0;
      updateHud();
    }
  }

  if (state.gunTimer > 0) {
    const before = state.gunTimer;
    state.gunTimer = Math.max(0, state.gunTimer - deltaSec);
    if (before > 0 && state.gunTimer === 0) {
      spawnFloatingText("雷射結束", paddle.x + paddle.width * 0.5, paddle.y - 16, "#ffb1e4");
    }
  }

  if (state.bigBallTimer > 0) {
    const before = state.bigBallTimer;
    state.bigBallTimer = Math.max(0, state.bigBallTimer - deltaSec);
    if (before > 0 && state.bigBallTimer === 0) {
      setBallRadius(BALL_RADIUS);
      spawnFloatingText("巨球結束", paddle.x + paddle.width * 0.5, paddle.y - 16, "#ffd488");
    }
  }

  if (state.magnetTimer > 0) {
    const before = state.magnetTimer;
    state.magnetTimer = Math.max(0, state.magnetTimer - deltaSec);
    if (before > 0 && state.magnetTimer === 0) {
      releaseStuckBalls();
      spawnFloatingText("磁鐵結束", paddle.x + paddle.width * 0.5, paddle.y - 16, "#c084fc");
    }
  }

  if (state.pierceTimer > 0) {
    const before = state.pierceTimer;
    state.pierceTimer = Math.max(0, state.pierceTimer - deltaSec);
    if (before > 0 && state.pierceTimer === 0) {
      spawnFloatingText("穿透結束", paddle.x + paddle.width * 0.5, paddle.y - 16, "#bef264");
    }
  }

  if (state.scoreMultiplierTimer > 0) {
    const before = state.scoreMultiplierTimer;
    state.scoreMultiplierTimer = Math.max(0, state.scoreMultiplierTimer - deltaSec);
    if (before > 0 && state.scoreMultiplierTimer === 0) {
      spawnFloatingText("加倍結束", paddle.x + paddle.width * 0.5, paddle.y - 16, "#facc15");
    }
  }

  if (state.powerupMagnetTimer > 0) {
    const before = state.powerupMagnetTimer;
    state.powerupMagnetTimer = Math.max(0, state.powerupMagnetTimer - deltaSec);
    if (before > 0 && state.powerupMagnetTimer === 0) {
      spawnFloatingText("吸寶物結束", paddle.x + paddle.width * 0.5, paddle.y - 16, "#38bdf8");
    }
  }

  if (state.timeSlowTimer > 0) {
    const before = state.timeSlowTimer;
    state.timeSlowTimer = Math.max(0, state.timeSlowTimer - deltaSec);
    if (before > 0 && state.timeSlowTimer === 0) {
      spawnFloatingText("慢動作結束", paddle.x + paddle.width * 0.5, paddle.y - 16, "#93c5fd");
    }
  }

  if (state.shadowPaddleTimer > 0) {
    const before = state.shadowPaddleTimer;
    state.shadowPaddleTimer = Math.max(0, state.shadowPaddleTimer - deltaSec);
    if (before > 0 && state.shadowPaddleTimer === 0) {
      spawnFloatingText("雙板結束", paddle.x + paddle.width * 0.5, paddle.y - 16, "#a7f3d0");
    }
  }
}

function drawBackground() {
  const theme = getThemeConfig();
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, theme.background[0]);
  gradient.addColorStop(0.55, theme.background[1]);
  gradient.addColorStop(1, theme.background[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < stars.length; i += 1) {
    const star = stars[i];
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function getBrickColor(brick) {
  if (brick.special === "boss") {
    return "#f87171";
  }
  if (brick.special === "steel") {
    return "#aab7c7";
  }
  if (brick.special === "bomb") {
    return "#ff7f7f";
  }
  if (brick.special === "moving") {
    return "#b39cff";
  }
  if (brick.special === "split") {
    return "#c2f970";
  }
  if (brick.special === "speed") {
    return "#ffb86b";
  }
  if (brick.special === "bounce") {
    return "#7dd3fc";
  }
  // 🎨 0915:原本 hp>=3 一律回傳寫死的紅 #f94144 ——
  //    hp 從第 5 關起就固定 3~4 ⇒ 每顆普通磚都同一色,四個主題等於失效,關卡圖案也看不出層次。
  //    改成「保留主題色、只調暗」:耐打度仍看得出來,而磚上本來就印著 hp 數字(不只靠顏色,對色盲也友善)。
  if (brick.hp >= 4) {
    return shadeColor(brick.color, -0.34);
  }
  if (brick.hp === 3) {
    return shadeColor(brick.color, -0.22);
  }
  if (brick.hp === 2) {
    return shadeColor(brick.color, -0.11);
  }
  return brick.color;
}

// 把 #rrggbb 依 amount(-1~1)調暗/調亮。非 6 碼色碼原樣退回,絕不吐出 NaN 色。
function shadeColor(hex, amount) {
  if (typeof hex !== "string" || !/^#[0-9a-f]{6}$/i.test(hex)) {
    return hex;
  }
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => clamp(Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount), 0, 255);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function getBrickLabel(brick) {
  if (brick.special === "boss") {
    return `BOSS ${brick.hp}`;
  }
  if (brick.special === "steel") {
    return "S";
  }
  if (brick.special === "bomb") {
    return "!";
  }
  if (brick.special === "moving") {
    return "↔";
  }
  if (brick.special === "split") {
    return "÷";
  }
  if (brick.special === "speed") {
    return "F";
  }
  if (brick.special === "bounce") {
    return "↕";
  }
  if (brick.hp > 1) {
    return String(brick.hp);
  }
  return "";
}

function drawBricks() {
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive) {
      continue;
    }

    const baseColor = getBrickColor(brick);
    drawRoundedRect(brick.x + 4, brick.y + 5, brick.width, brick.height, 6);
    ctx.fillStyle = "#00152d55";
    ctx.fill();

    drawRoundedRect(brick.x, brick.y, brick.width, brick.height, 6);
    const brickGradient = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.height);
    brickGradient.addColorStop(0, "#ffffffaa");
    brickGradient.addColorStop(0.18, baseColor);
    brickGradient.addColorStop(1, baseColor);
    ctx.fillStyle = brickGradient;
    ctx.fill();
    ctx.fillStyle = "#00000022";
    ctx.fillRect(brick.x + 4, brick.y + brick.height - 5, brick.width - 8, 4);
    ctx.strokeStyle = "#ffffff66";
    ctx.lineWidth = 1;
    ctx.stroke();

    const label = getBrickLabel(brick);
    if (label) {
      ctx.fillStyle = "#0e1f33";
      ctx.font = brick.special === "boss" ? "bold 20px Trebuchet MS" : "bold 14px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, brick.x + brick.width * 0.5, brick.y + brick.height * 0.55);
    }
  }
}

// 🧊 立體渲染用:磚塊本體交給 3D 場景畫,但耐打度數字／特殊磚字母還是要看得到 ——
//   從 drawBricks() 拆出「只畫字」這一半，2D 疊層(render3dFrame)才會呼叫它。
//   ⚠ 顏色刻意跟 drawBricks() 裡那份不同:2D 模式的字是「深色字疊在淺色磚上」，
//     3D 模式的字浮空疊在 WebGL 畫面上、背後可能是任何顏色，所以改成「淺色字 + 深色描邊」，
//     不管背後是哪個主題、哪種磚色都看得清楚。
function drawBrickLabels() {
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive) {
      continue;
    }
    const label = getBrickLabel(brick);
    if (!label) {
      continue;
    }
    ctx.font = brick.special === "boss" ? "bold 20px Trebuchet MS" : "bold 14px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#00152dcc";
    ctx.strokeText(label, brick.x + brick.width * 0.5, brick.y + brick.height * 0.55);
    ctx.fillStyle = "#eaf6ffee";
    ctx.fillText(label, brick.x + brick.width * 0.5, brick.y + brick.height * 0.55);
  }
}

function drawPowerups() {
  for (let i = 0; i < powerups.length; i += 1) {
    const powerup = powerups[i];
    const half = powerup.size * 0.5;

    drawRoundedRect(powerup.x - half, powerup.y - half, powerup.size, powerup.size, 6);
    ctx.fillStyle = powerup.color;
    ctx.fill();
    ctx.strokeStyle = "#ffffffcc";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#07203a";
    ctx.font = "bold 9px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(powerup.label, powerup.x, powerup.y + 0.5);
  }
}

function drawBullets() {
  for (let i = 0; i < bullets.length; i += 1) {
    const bullet = bullets[i];
    drawRoundedRect(bullet.x - bullet.w * 0.5, bullet.y - bullet.h * 0.5, bullet.w, bullet.h, 2);
    ctx.fillStyle = "#ff6bcb";
    ctx.shadowColor = "#ff9ee0";
    ctx.shadowBlur = 9;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawShieldWall() {
  if (state.shieldCharges <= 0) {
    return;
  }

  const y = canvas.height - 8;
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.shadowColor = "#67e8f9";
  ctx.shadowBlur = 16;
  drawRoundedRect(18, y - 5, canvas.width - 36, 8, 4);
  ctx.fillStyle = "#67e8f9";
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#06283f";
  ctx.font = "bold 11px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`SAFE x${state.shieldCharges}`, canvas.width * 0.5, y - 1);
  ctx.restore();
}

function drawPaddle() {
  if (state.shadowPaddleTimer > 0) {
    const shadow = getShadowPaddleRect();
    ctx.save();
    ctx.globalAlpha = 0.68;
    drawRoundedRect(shadow.x, shadow.y, shadow.width, shadow.height, 7);
    const shadowGradient = ctx.createLinearGradient(shadow.x, shadow.y, shadow.x, shadow.y + shadow.height);
    shadowGradient.addColorStop(0, "#e6fff5");
    shadowGradient.addColorStop(1, "#5eead4");
    ctx.fillStyle = shadowGradient;
    ctx.fill();
    ctx.strokeStyle = "#064e3b";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  drawRoundedRect(paddle.x, paddle.y, paddle.width, paddle.height, 7);
  const theme = getThemeConfig();
  const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
  gradient.addColorStop(0, theme.paddle[0]);
  gradient.addColorStop(1, theme.paddle[1]);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = "#503b12";
  ctx.lineWidth = 1;
  ctx.stroke();

  if (state.gunTimer > 0) {
    ctx.fillStyle = "#ffc1e8";
    drawRoundedRect(paddle.x + 7, paddle.y - 8, 7, 8, 2);
    ctx.fill();
    drawRoundedRect(paddle.x + paddle.width - 14, paddle.y - 8, 7, 8, 2);
    ctx.fill();
  }

  if (state.magnetTimer > 0) {
    ctx.fillStyle = "#c084fc";
    drawRoundedRect(paddle.x + paddle.width * 0.5 - 18, paddle.y - 7, 36, 5, 3);
    ctx.fill();
  }
}

function drawBalls() {
  for (let i = 0; i < balls.length; i += 1) {
    const ball = balls[i];
    const theme = getThemeConfig();
    const gradient = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 2, ball.x, ball.y, ball.radius + 2);
    gradient.addColorStop(0, theme.ball[0]);
    gradient.addColorStop(0.55, theme.ball[1]);
    gradient.addColorStop(1, theme.ball[2]);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    const glowColor = state.pierceTimer > 0
      ? "#bef264"
      : state.bombBallCharges > 0
        ? "#fb7185"
        : state.bigBallTimer > 0
          ? "#ffd166"
          : "#62d4ff";
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = state.pierceTimer > 0 || state.bombBallCharges > 0 || state.bigBallTimer > 0 ? 16 : 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawFloatingTexts() {
  for (let i = 0; i < floatingTexts.length; i += 1) {
    const item = floatingTexts[i];
    ctx.globalAlpha = Math.max(0, item.life);
    ctx.fillStyle = item.color;
    ctx.font = "bold 16px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.text, item.x, item.y);
  }
  ctx.globalAlpha = 1;
}

function drawStatus() {
  ctx.fillStyle = "#e6f2ffcc";
  ctx.font = "bold 13px Trebuchet MS";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(`球數：${balls.length}`, 14, canvas.height - 14);

  const activeEffects = [];
  if (state.gunTimer > 0) {
    activeEffects.push(`雷射：${state.gunTimer.toFixed(1)} 秒`);
  }
  if (state.bigBallTimer > 0) {
    activeEffects.push(`巨球：${state.bigBallTimer.toFixed(1)} 秒`);
  }
  if (state.shieldCharges > 0) {
    activeEffects.push(`護盾 x${state.shieldCharges}`);
  }
  if (state.bombBallCharges > 0) {
    activeEffects.push(`炸彈 x${state.bombBallCharges}`);
  }
  if (state.magnetTimer > 0) {
    activeEffects.push(`磁鐵：${state.magnetTimer.toFixed(1)} 秒`);
  }
  if (state.pierceTimer > 0) {
    activeEffects.push(`穿透：${state.pierceTimer.toFixed(1)} 秒`);
  }
  if (state.scoreMultiplierTimer > 0) {
    activeEffects.push(`分數 x${SCORE_MULTIPLIER}`);
  }
  if (state.powerupMagnetTimer > 0) {
    activeEffects.push(`吸寶物：${state.powerupMagnetTimer.toFixed(1)} 秒`);
  }
  if (state.timeSlowTimer > 0) {
    activeEffects.push(`慢動作：${state.timeSlowTimer.toFixed(1)} 秒`);
  }
  if (state.shadowPaddleTimer > 0) {
    activeEffects.push(`雙板：${state.shadowPaddleTimer.toFixed(1)} 秒`);
  }
  if (state.mode === "daily") {
    activeEffects.push("每日");
  }
  if (state.combo >= 3) {
    activeEffects.push(`Combo x${state.combo}`);
  }

  if (activeEffects.length > 0) {
    ctx.textAlign = "right";
    ctx.fillText(activeEffects.join("  "), canvas.width - 14, canvas.height - 14);
  }
}

// 🧊 立體渲染的每幀進入點:2D canvas 只留「不是實體方塊」的疊層(危險線／道具／子彈／
//   護盾條／磚塊字／浮動分數／狀態列),球場地板、磚塊、板子、球本體全部交給 render3d.js
//   畫在底下那層透明的 WebGL canvas(styles.css 的 body.mode-3d 讓兩塊 canvas 疊在一起)。
//   ⚠ 震屏目前只晃 2D 疊層、沒有晃 3D 鏡頭——3D 場景本身不動,是刻意先簡化的範圍,
//     要加鏡頭震動之後再補,不影響現有判定與存檔。
function render3dFrame(shaking, amp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (shaking) {
    ctx.save();
    ctx.translate((Math.random() - 0.5) * amp, (Math.random() - 0.5) * amp * 0.75);
  }
  // ⚠ 危險線刻意不在這裡呼叫 drawDangerLine():那支畫的是「平面座標」的線,跟板子/磚塊
  // 這些走透視投影的 3D 物件不是同一套映射——同一個 canvasY,2D 疊層上永遠對應固定的
  // 螢幕百分比,3D 鏡頭裡卻會因為透視落到不同位置(使用者實機回報「線跑到板子下面去了」,
  // 量出來就是板子(近景,透視放大)反而畫到線(平面,不受透視影響)的上面)。
  // 危險線改成 3D 場景自己的物件,見下面 syncScene() 的 dangerLine 那段與 render3d.js。
  // ⚠ drawPowerups() 同理刻意不呼叫:使用者實機回報「吃不到寶物」,真因就是道具原本
  // 也在這層平面疊層上,跟透視投影的板子對不齊——碰撞判定本身沒壞,是畫面上對不準。
  // 道具改成 3D 場景自己的 Sprite(見下面 payload 的 powerups 與 render3d.js)。
  drawBrickLabels();
  drawBullets();
  drawShieldWall();
  drawBossRocks();
  drawFloatingTexts();
  if (shaking) {
    ctx.restore();
  }
  drawStatus();

  if (!render3dApi) {
    return; // 還在非同步載入中(或載入失敗),這幾影格先只看得到 2D 疊層,等載完自動接上
  }

  const theme = getThemeConfig();
  const glowColor = state.pierceTimer > 0
    ? "#bef264"
    : state.bombBallCharges > 0
      ? "#fb7185"
      : state.bigBallTimer > 0
        ? "#ffd166"
        : "#62d4ff";

  const brickSnapshots = [];
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive) {
      continue;
    }
    brickSnapshots.push({
      ref: brick,
      x: brick.x,
      y: brick.y,
      width: brick.width,
      height: brick.height,
      color: getBrickColor(brick),
    });
  }

  const ballSnapshots = balls.map((ball) => ({
    x: ball.x,
    y: ball.y,
    radius: ball.radius,
    color: theme.ball[1],
    glow: glowColor,
  }));

  // 危險線的視覺(顏色/透明度/是否顯示)——邏輯逐字對應 drawDangerLine() 的 2D 版本,
  // 只是輸出改成「一組畫面數字」給 render3d.js 去擺 3D 物件，不是直接畫在 ctx 上。
  // ⚠ 兩邊各自維護一份是刻意的:drawDangerLine() 服務 2D 的 ctx 疊層(dashed line 那套
  // canvas API 沒有對應的 3D 概念),兩份算式短、又各自貼著各自的畫面 API，抽共用函式
  // 反而要多包一層「回傳值 vs 直接畫」的介面，划不來。改危險線規則時,兩處都要改。
  let dangerLine = { active: false };
  if (isDescendActive()) {
    const dangerY = getDangerLineY();
    const lowest = getLowestBrickBottom();
    const gapRows = lowest > -Infinity ? (dangerY - lowest) / getBrickRowPitch() : 99;
    const soon = state.descendTimer > 0 && state.descendTimer <= DESCEND_WARN_SEC;
    const urgent = gapRows <= 1.2 || soon;
    dangerLine = {
      active: true,
      y: dangerY,
      color: urgent ? "#ff4d4d" : "#ff9aa8",
      opacity: urgent ? 0.45 + 0.35 * Math.abs(Math.sin(Date.now() / 110)) : 0.28,
    };
  }

  const powerupSnapshots = powerups.map((powerup) => ({
    ref: powerup,
    x: powerup.x,
    y: powerup.y,
    size: powerup.size,
    color: powerup.color,
    label: powerup.label,
  }));

  render3dApi.syncScene({
    width: canvas.width,
    height: canvas.height,
    floorColor: theme.background[1],
    voidColor: theme.background[2],
    paddle: { x: paddle.x, y: paddle.y, width: paddle.width, height: paddle.height, color: theme.paddle[0] },
    balls: ballSnapshots,
    bricks: brickSnapshots,
    powerups: powerupSnapshots,
    dangerLine,
  });
  render3dApi.renderFrame();
}

function render() {
  // 震屏:位移整個畫面。刻意不動 HUD(那是 DOM),只有 canvas 會晃。
  const shaking = state.shake > 0.05;
  // ★ 這裡必須用 Math.random() 不是 random():random() 是每日挑戰的 seeded RNG,
  //   在 render 裡抽會讓「畫面震了幾幀」影響到磚塊配置,同一天同一關就不再一致。
  const amp = shaking ? Math.min(SHAKE_MAX, state.shake) : 0;

  if (preferences.render3d) {
    render3dFrame(shaking, amp);
    return;
  }

  if (shaking) {
    ctx.save();
    ctx.translate((Math.random() - 0.5) * amp, (Math.random() - 0.5) * amp * 0.75);
  }

  drawBackground();
  drawDangerLine();
  drawBricks();
  drawPowerups();
  drawBullets();
  drawShieldWall();
  drawPaddle();
  drawBalls();
  drawBossRocks();
  drawFloatingTexts();
  if (shaking) {
    ctx.restore();
  }
  // 狀態字最後畫、且在震屏之外:讀數值的東西晃起來只會看不清楚
  drawStatus();
}

let lastTs = 0;
function gameLoop(ts) {
  const delta = Math.min(32, ts - lastTs || 16.67);
  const step = delta / 16.67;
  const deltaSec = delta / 1000;
  lastTs = ts;

  updatePaddle(step);

  // 頓幀(hit-stop):打到重物時凍結「世界」幾十毫秒,畫面照樣重繪。
  // ★ 只擋世界更新、不擋 requestAnimationFrame —— 真的停掉迴圈會讓輸入也卡住。
  if (state.hitStop > 0) {
    state.hitStop = Math.max(0, state.hitStop - deltaSec);
  }
  // 震屏衰減:用 deltaSec 而非 step,低幀率裝置才不會晃得比較久
  if (state.shake > 0) {
    state.shake = Math.max(0, state.shake - state.shake * SHAKE_DECAY * deltaSec - 0.02);
  }

  if (state.running && state.hitStop <= 0) {
    const worldStep = step * (state.timeSlowTimer > 0 ? 0.62 : 1);
    updateBricks(worldStep);
    updateBalls(worldStep);
    if (state.running) {
      updatePowerups(worldStep);
      updateBullets(worldStep);
      updateBossAttack(deltaSec);
      updateBossRocks(worldStep, deltaSec);
      updateBrickDescent(deltaSec);
      updateTimers(deltaSec);
    }
  }

  updateFloatingTexts(step);
  renderEffectHud();
  render();
  requestAnimationFrame(gameLoop);
}

function togglePlayState() {
  unlockAudioFromGesture();
  setInstallHint("");
  if (!isGameScreenActive) {
    startGameFromSetup();
  } else if (state.running && releaseStuckBalls()) {
    syncButton();
  } else if (state.running) {
    pauseGame(true);
  } else if (state.gameOver) {
    restartGameAndCountdown("重新開始");
  } else {
    beginLevelCountdown("準備開始");
  }
}

function openSettingsMenu() {
  unlockAudioFromGesture();
  if (state.running) {
    state.running = false;
    stopMusic();
  }

  setOverlay("遊戲設定", "調整板子長度、音樂、音效、音量與震動，設定會自動保存。", {
    showActions: true,
    showSettings: true,
    stats: null,
  });
  syncButton();
}

function openVersionPanel() {
  if (!isGameScreenActive) {
    setInstallHint(`目前版本 ${APP_VERSION}（${APP_DATE} 更新）：${CHANGELOG[0].items.join("、")}`);
    return;
  }

  if (state.running) {
    pauseGame(false);
  }

  setOverlay("更新內容", `目前版本 ${APP_VERSION}，${APP_DATE} 更新`, {
    showActions: true,
    showSettings: false,
    showVersion: true,
    stats: getOverlayStatItems(),
  });
}

// ── 🖼 每日挑戰分享圖卡（0916）────────────────────────────────────────────────
// 為什麼要圖卡：純文字貼進 LINE 只是一行字，沒人會點。圖卡把「今天第幾關、幾分、
// 用掉幾顆球」連同那一關的磚塊圖案一起畫出來，配上既有的「同一天同難度全世界同一局」
// 種子，就是 Wordle 式回訪的標準解（skill：daily-puzzle-kit / share-card）。
//
// ★ 零相依：純 canvas + toDataURL，不裝庫、可離線、不打後端，維持本站的純靜態架構。
// ★ drawShareCard() 只吃 ctx 與一包資料（不讀任何全域狀態）⇒ test/sharecard.mjs
//   用一個假的 ctx 就能驗「有沒有印到分數／有沒有漏 undefined」，不需要瀏覽器。
// ★ 誠實鐵則：卡片上的日期、題號、分數必須是同一局的。
//   舊版分享文字印的是 `records.bestDailyScore`（歷來每日最高）卻配**今天**的日期，
//   昨天打的 1800 分會被寫成今天的成績 —— 那是說謊。改成 `records.dailyToday`，
//   跨日自動作廢（key 不是今天就當作沒挑戰過）。

const SHARE_CARD_W = 1080;
const SHARE_CARD_H = 1440;

// 題號＝種子的後六位。和 seededRandom 的種子用同一條字串，所以「題號一樣＝盤面一樣」，
// 老師報一個號、全班同一天同難度開出來就是同一局。
function getDailyPuzzleNumber(key = dailyKey, difficulty = state.difficulty) {
  return String(hashString(`${key}:${difficulty}:breakout`) % 1000000).padStart(6, "0");
}

// 這局結束時把「今天的成績」存起來（只在每日挑戰、非自訂關卡）。
// 只留今天那一筆：留歷史等於寫了從來不讀的資料，而跨日的成績配今天的日期就是說謊。
function recordDailyToday() {
  if (state.mode !== "daily" || state.customRows) {
    return;
  }
  const todayKey = getTodayKey();
  const current = records.dailyToday && records.dailyToday.key === todayKey ? records.dailyToday : null;
  if (current && current.score > state.score) {
    return;
  }
  records.dailyToday = {
    key: todayKey,
    difficulty: state.difficulty,
    paddle: getPaddleSizeKey(),
    score: state.score,
    level: Math.max(1, sessionStats.highestLevel),
    ballsUsed: sessionStats.livesLost,
    maxCombo: sessionStats.maxCombo,
    bricks: sessionStats.bricksDestroyed,
  };
  saveRecords();
}

// 圖卡與分享文字共用同一份資料來源，兩邊才不會慢慢走鐘（同 buildBricksFromRows 的理由）。
function getDailyCardSource() {
  const todayKey = getTodayKey();
  const stored = records.dailyToday && records.dailyToday.key === todayKey ? records.dailyToday : null;
  const live = state.mode === "daily" && !state.customRows
    ? {
      key: todayKey,
      difficulty: state.difficulty,
      paddle: getPaddleSizeKey(),
      score: state.score,
      level: Math.max(1, sessionStats.highestLevel),
      ballsUsed: sessionStats.livesLost,
      maxCombo: sessionStats.maxCombo,
      bricks: sessionStats.bricksDestroyed,
    }
    : null;
  if (live && (!stored || live.score >= stored.score)) {
    return { ...live, played: true };
  }
  if (stored) {
    return { ...stored, played: true };
  }
  // 今天還沒挑戰過：卡片照樣做得出來，但要誠實寫「還沒挑戰」，不可以印 0 分假裝玩過。
  return {
    key: todayKey,
    difficulty: state.difficulty,
    score: 0,
    level: 1,
    ballsUsed: 0,
    maxCombo: 0,
    bricks: 0,
    played: false,
  };
}

function getDailyCardData() {
  const source = getDailyCardSource();
  const difficultyConfig = DIFFICULTIES[source.difficulty] || getDifficultyConfig();
  const pattern = getLevelPattern(Math.max(1, source.level));
  const theme = getThemeConfig();
  const [grade, gradeTitle] = getGradeFor(source.score, source.level, source.maxCombo);
  return {
    dateKey: source.key,
    puzzleNo: getDailyPuzzleNumber(source.key, source.difficulty),
    // 板長只在「這筆成績本身記了板長」時才標:舊紀錄沒有這個欄位,
    // 拿做卡當下的設定去標昨天打的分數,就是另一種說謊的數字。
    difficultyLabel: source.paddle && source.paddle !== DEFAULT_PADDLE_SIZE
      ? `${difficultyConfig.label}・板${PADDLE_SIZES[source.paddle].label}`
      : difficultyConfig.label,
    played: source.played,
    score: source.score,
    level: source.level,
    ballsUsed: source.ballsUsed,
    maxCombo: source.maxCombo,
    bricks: source.bricks,
    grade,
    gradeTitle,
    patternName: pattern.name,
    patternRows: pattern.rows,
    palette: theme.palette,
    background: theme.background,
    url: `${window.location.origin}${window.location.pathname}`,
  };
}

function fillRoundRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function cardText(ctx, text, x, y, font, color, align = "center") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(String(text), x, y);
}

// 純繪圖：不讀任何全域狀態，吃什麼畫什麼 ⇒ 可以用假 ctx 單測。
function drawShareCard(ctx, data, size = { w: SHARE_CARD_W, h: SHARE_CARD_H }) {
  const W = size.w;
  const H = size.h;
  const font = "'Noto Sans TC', 'Microsoft JhengHei', system-ui, sans-serif";
  const palette = data.palette && data.palette.length
    ? data.palette
    : ["#55c1ff", "#63e6be", "#ffe66d", "#ffaf54", "#ff7f7f"];
  const bg = data.background && data.background.length ? data.background : ["#0f345f", "#102a4b", "#0a1b34"];

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, bg[0]);
  sky.addColorStop(0.55, bg[1] || bg[0]);
  sky.addColorStop(1, bg[2] || bg[1] || bg[0]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // 上下各一條磚列，讓人一眼認出是打磚塊
  for (let i = 0; i < 10; i += 1) {
    ctx.fillStyle = palette[i % palette.length];
    ctx.fillRect((W / 10) * i + 8, 0, W / 10 - 16, 20);
    ctx.fillRect((W / 10) * i + 8, H - 20, W / 10 - 16, 20);
  }

  cardText(ctx, "打磚塊・每日挑戰", W / 2, 130, `700 62px ${font}`, "#ffffff");
  cardText(
    ctx,
    `${data.dateKey}　${data.difficultyLabel}　題號 ${data.puzzleNo}`,
    W / 2,
    192,
    `400 36px ${font}`,
    "rgba(255,255,255,0.82)",
  );

  // 分數區
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  fillRoundRect(ctx, 80, 236, W - 160, 300, 32);
  if (data.played) {
    cardText(ctx, "今日分數", W / 2, 306, `500 38px ${font}`, "rgba(255,255,255,0.75)");
    cardText(ctx, data.score, W / 2, 452, `700 148px ${font}`, "#ffe66d");
    cardText(ctx, `${data.grade}　${data.gradeTitle}`, W / 2, 510, `600 40px ${font}`, "#8be9ff");
  } else {
    cardText(ctx, "今天還沒挑戰", W / 2, 360, `700 72px ${font}`, "#ffe66d");
    cardText(ctx, "點開就是今天這一局，全世界同一盤", W / 2, 440, `400 36px ${font}`, "rgba(255,255,255,0.82)");
    cardText(ctx, `題號 ${data.puzzleNo}`, W / 2, 500, `600 40px ${font}`, "#8be9ff");
  }

  // 四格數字
  const stats = [
    ["最高關", data.level],
    ["用掉球數", data.ballsUsed],
    ["最大 Combo", data.maxCombo],
    ["破壞磚塊", data.bricks],
  ];
  const cellW = (W - 160) / stats.length;
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  fillRoundRect(ctx, 80, 566, W - 160, 172, 28);
  stats.forEach(([label, value], index) => {
    const cx = 80 + cellW * index + cellW / 2;
    // 沒挑戰過就畫破折號 —— 印一排 0 會讓人以為「玩了但一分也沒拿到」
    cardText(ctx, data.played ? value : "—", cx, 660, `700 62px ${font}`, data.played ? "#ffffff" : "rgba(255,255,255,0.45)");
    cardText(ctx, label, cx, 708, `400 30px ${font}`, "rgba(255,255,255,0.7)");
  });

  // 關卡圖案縮圖 —— 這是本作版本的「Wordle 方格」：看得出今天走到哪一張圖
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  fillRoundRect(ctx, 80, 768, W - 160, 470, 28);
  cardText(
    ctx,
    data.played ? `第 ${data.level} 關・${data.patternName}` : `今天第 1 關・${data.patternName}`,
    W / 2,
    828,
    `600 44px ${font}`,
    "#ffffff",
  );

  const rows = Array.isArray(data.patternRows) ? data.patternRows : [];
  const cols = rows.length ? rows[0].length : 0;
  if (rows.length && cols) {
    const gridW = W - 260;
    const cell = Math.min(gridW / cols, 330 / rows.length);
    const gridX = (W - cell * cols) / 2;
    const gridY = 866 + (330 - cell * rows.length) / 2;
    const gap = Math.max(3, cell * 0.08);
    rows.forEach((row, r) => {
      for (let c = 0; c < cols; c += 1) {
        const ch = row[c] || ".";
        const x = gridX + c * cell;
        const y = gridY + r * cell;
        if (ch === ".") {
          ctx.fillStyle = "rgba(255,255,255,0.06)";
        } else if (ch === "S") {
          ctx.fillStyle = "#c3ccd8";
        } else if (ch === "B") {
          ctx.fillStyle = "#ff8a4c";
        } else if (ch === "M") {
          ctx.fillStyle = "#c39bff";
        } else {
          ctx.fillStyle = palette[r % palette.length];
        }
        ctx.fillRect(x + gap / 2, y + gap / 2, cell - gap, cell - gap);
      }
    });
  }

  cardText(ctx, "同一天、同一難度，全世界同一局", W / 2, 1300, `500 36px ${font}`, "rgba(255,255,255,0.85)");
  cardText(ctx, data.url, W / 2, 1356, `400 30px ${font}`, "rgba(255,255,255,0.6)");
}

function shareCardFileName(dateKey) {
  const safe = String(dateKey || "").replace(/[^0-9A-Za-z-]/g, "") || "today";
  return `breakout-daily-${safe}.png`;
}

function getDailyShareText(data = getDailyCardData()) {
  const lines = [
    `打磚塊每日挑戰 ${data.dateKey}（題號 ${data.puzzleNo}）`,
    `難度：${data.difficultyLabel}`,
  ];
  if (data.played) {
    lines.push(
      `分數：${data.score}（${data.grade} ${data.gradeTitle}）`,
      `最高關：${data.level}・${data.patternName}`,
      `用掉球數：${data.ballsUsed}　最大 Combo：${data.maxCombo}`,
    );
  } else {
    lines.push("今天還沒挑戰，一起來打今天這一局。");
  }
  lines.push(`來挑戰：${data.url}`);
  return lines.join("\n");
}

function renderShareCard() {
  shareCardData = getDailyCardData();
  shareCardCanvas.width = SHARE_CARD_W;
  shareCardCanvas.height = SHARE_CARD_H;
  const ctx = shareCardCanvas.getContext("2d");
  if (!ctx) {
    return;
  }
  drawShareCard(ctx, shareCardData, { w: SHARE_CARD_W, h: SHARE_CARD_H });
}

function setShareCardStatus(message = "") {
  shareCardStatus.textContent = message;
  shareCardStatus.hidden = !message;
}

function openShareCard() {
  closeEditor();
  renderShareCard();
  shareCardPanel.hidden = false;
  setShareCardStatus(shareCardData && shareCardData.played
    ? "存成圖片或直接分享，朋友點開就是今天同一局。"
    : "今天還沒挑戰過，這張是邀請卡；打完一局再回來就會帶上成績。");
  shareCardPanel.scrollIntoView({ block: "start", behavior: "smooth" });
}

function closeShareCard() {
  shareCardPanel.hidden = true;
}

function shareCardToBlob() {
  return new Promise((resolve) => {
    try {
      if (shareCardCanvas.toBlob) {
        shareCardCanvas.toBlob((blob) => resolve(blob), "image/png");
        return;
      }
    } catch {
      // 某些瀏覽器（或被權限擋住時）toBlob 會直接丟例外，退回 dataURL 那條路
    }
    resolve(null);
  });
}

function downloadShareCard() {
  try {
    const link = document.createElement("a");
    link.href = shareCardCanvas.toDataURL("image/png");
    link.download = shareCardFileName(shareCardData && shareCardData.dateKey);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setShareCardStatus("圖卡已存成 PNG，可以傳給朋友或印出來。");
  } catch {
    setShareCardStatus("這個瀏覽器不給下載圖片，請長按上面的圖卡選「儲存圖片」。");
  }
}

async function shareDailyCard() {
  const text = getDailyShareText(shareCardData || getDailyCardData());
  try {
    const blob = await shareCardToBlob();
    if (blob && navigator.share && navigator.canShare) {
      const file = new File([blob], shareCardFileName(shareCardData && shareCardData.dateKey), { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "打磚塊每日挑戰", text });
        setShareCardStatus("圖卡已送出。");
        return;
      }
    }
    if (navigator.share) {
      await navigator.share({ title: "打磚塊每日挑戰", text });
      setShareCardStatus("成績已送出（這個瀏覽器不支援直接分享圖片，圖卡請用「下載 PNG」）。");
      return;
    }
  } catch {
    // 使用者按取消也會走到這裡：不要當成錯誤，安靜退回下載那條路
    setShareCardStatus("沒有送出，可以改用「下載 PNG」。");
    return;
  }
  downloadShareCard();
}

async function copyDailyShareText() {
  const text = getDailyShareText(shareCardData || getDailyCardData());
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      setShareCardStatus("文字成績已複製，可以貼到 LINE、Discord 或社群。");
      return;
    }
  } catch {
    // 沒有剪貼簿權限就把文字直接顯示出來讓人自己選取
  }
  setShareCardStatus(text.replace(/\n/g, " / "));
}

async function shareDailyChallenge() {
  openShareCard();
}

function bindHoldButton(button, onPress, onRelease) {
  if (!button) {
    return;
  }

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    unlockAudioFromGesture();
    onPress();
  });

  const release = (event) => {
    event.preventDefault();
    onRelease();
  };

  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("pointercancel", release);
}

function updatePreference(key, value) {
  preferences[key] = value;
  savePreferences();
  syncSettingsControls();
  if (key === "music" && !value) {
    stopMusic();
  }
  if (key === "music" && value && state.running) {
    startMusic();
  }
}

function updateVolumePreference(key, value) {
  preferences[key] = normalizeVolume(value);
  savePreferences();
  syncSettingsControls();
}

function updateSongPreference(value) {
  preferences.song = value in SONGS ? value : "arcade";
  savePreferences();
  stopMusic();
  musicStepIndex = 0;
  if (state.running) {
    startMusic();
  }
  syncSettingsControls();
}

function restartForModeChange() {
  preferences.mode = state.mode;
  preferences.difficulty = state.difficulty;
  savePreferences();
  restartGame({ countGame: false, showStartOverlay: isGameScreenActive });
}

window.addEventListener("keydown", (event) => {
  unlockAudioFromGesture();
  const key = event.key.toLowerCase();

  if (key === "arrowleft" || key === "a") {
    event.preventDefault();
    keys.left = true;
  }

  if (key === "arrowright" || key === "d") {
    event.preventDefault();
    keys.right = true;
  }

  if (key === " " || key === "spacebar" || key === "enter") {
    event.preventDefault();
    togglePlayState();
  }

  if (key === "j" || key === "f") {
    event.preventDefault();
    fireBullets();
  }

  if (key === "escape" || key === "p") {
    event.preventDefault();
    if (isGameScreenActive && state.running) {
      pauseGame(true);
    }
  }

  if (key === "r") {
    event.preventDefault();
    if (isGameScreenActive) {
      startRestartCountdown();
    }
  }
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();

  if (key === "arrowleft" || key === "a") {
    keys.left = false;
  }

  if (key === "arrowright" || key === "d") {
    keys.right = false;
  }
});

window.addEventListener("blur", () => {
  if (state.running) {
    pauseGame(false);
  }
  keys.left = false;
  keys.right = false;
});

// 轉手機、拉視窗、網址列收合都會走到這裡:先重排版面,再決定要不要顯示轉向提示。
// ★ 舊版只更新提示、不重排畫布 —— 因為那時直向根本不能玩,轉了也沒東西要搬。
function handleViewportChange() {
  resizeCanvasForScreen();
  updateOrientationPrompt();
}

window.addEventListener("resize", handleViewportChange);
window.addEventListener("orientationchange", () => {
  window.setTimeout(handleViewportChange, 180);
});

canvas.addEventListener("mousemove", (event) => {
  movePaddleTo(event.clientX);
});

canvas.addEventListener("mousedown", (event) => {
  unlockAudioFromGesture();
  movePaddleTo(event.clientX);
  if (startFromCanvasIfIdle()) {
    return;
  }
  if (state.running && releaseStuckBalls()) {
    return;
  }
  fireBullets();
});

canvas.addEventListener("touchstart", (event) => {
  event.preventDefault();
  if (event.touches[0]) {
    unlockAudioFromGesture();
    touchControl.active = true;
    touchControl.startX = event.touches[0].clientX;
    touchControl.startPaddleX = paddle.x;
    touchControl.moved = false;
    if (startFromCanvasIfIdle()) {
      return;
    }
    if (state.running && releaseStuckBalls()) {
      return;
    }
    fireBullets();
  }
}, { passive: false });

canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  if (event.touches[0] && touchControl.active) {
    if (Math.abs(event.touches[0].clientX - touchControl.startX) > 4) {
      touchControl.moved = true;
    }
    movePaddleByTouchDelta(event.touches[0].clientX);
  }
}, { passive: false });

canvas.addEventListener("touchend", () => {
  touchControl.active = false;
}, { passive: true });

canvas.addEventListener("touchcancel", () => {
  touchControl.active = false;
}, { passive: true });

startBtn.addEventListener("click", togglePlayState);
toggleBtn.addEventListener("click", togglePlayState);
resumeBtn.addEventListener("click", () => beginLevelCountdown("準備繼續"));
restartBtn.addEventListener("click", () => restartGameAndCountdown("重新開始"));
quickRestartBtn.addEventListener("click", () => {
  if (state.restartCountdown > 0) {
    cancelRestartCountdown();
    pauseGame(false);
    return;
  }
  startRestartCountdown();
});
settingsBtn.addEventListener("click", openSettingsMenu);
versionBtn.addEventListener("click", openVersionPanel);
shareDailyBtn.addEventListener("click", shareDailyChallenge);
// ── 🧩 關卡編輯器事件 ──────────────────────────────────────────────────────
editorBtn.addEventListener("click", () => {
  if (editorPanel.hidden) {
    openEditor();
  } else {
    closeEditor();
  }
});
editorClose.addEventListener("click", closeEditor);

editorBrushes.addEventListener("click", (event) => {
  const button = event.target.closest(".editor-brush");
  if (!button) {
    return;
  }
  editorBrush = button.dataset.glyph;
  renderEditorBrushes();
});

// 用事件委派：格子有 80 個，逐一掛 listener 在每次重繪時都要重掛，容易漏。
editorGrid.addEventListener("click", (event) => {
  const cell = event.target.closest(".editor-cell");
  if (!cell) {
    return;
  }
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  // 點到已經是這種磚的格子就擦掉 —— 不必先切到「空白」筆刷才能修改。
  const current = editorRows[row][col];
  const next = current === editorBrush ? "." : editorBrush;
  setEditorCell(row, col, next);
  paintEditorCell(cell, next);   // 就地更新這一格,不重建整張格子
  renderEditorStatus();
});

editorRowMinus.addEventListener("click", () => setEditorRowCount(editorRows.length - 1));
editorRowPlus.addEventListener("click", () => setEditorRowCount(editorRows.length + 1));
editorClear.addEventListener("click", () => {
  editorRows = createBlankEditorRows(editorRows.length);
  renderEditor();
});
editorFill.addEventListener("click", () => {
  editorRows = editorRows.map(() => editorBrush === "." ? ".".repeat(EDITOR_COLS) : editorBrush.repeat(EDITOR_COLS));
  renderEditor();
});

editorLoad.addEventListener("click", () => loadEditorCode(editorCode.value));
editorCode.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loadEditorCode(editorCode.value);
  }
});

editorCopy.addEventListener("click", async () => {
  const code = editorCode.value;
  if (!code) {
    return;
  }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(code);
      editorStatus.textContent = "分享碼已複製，貼給朋友就能玩你畫的關。";
      editorStatus.classList.remove("is-warn");
      return;
    }
  } catch {
    // 有些瀏覽器不給剪貼簿權限，退回「請手動複製」而不是靜靜失敗
  }
  editorCode.focus();
  editorCode.select();
  editorStatus.textContent = "這個瀏覽器不給自動複製，分享碼已選取，請手動複製。";
  editorStatus.classList.remove("is-warn");
});

editorPlay.addEventListener("click", playCustomLevel);

resumeRunBtn.addEventListener("click", resumeSavedRun);

// 離開分頁就存。★ 手機主要靠 pagehide/visibilitychange —— 使用者不會乖乖按「回設定」,
//    而是直接切 App 或鎖屏,那時 beforeunload 在 iOS 上根本不保證會觸發。
addEventListener("pagehide", saveRun);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    saveRun();
  }
});

backToSetupBtn.addEventListener("click", showSetupScreen);
backToSetupOverlayBtn.addEventListener("click", showSetupScreen);

// ⛶ 手動全螢幕:自動那條被擋掉時的第二次機會(0916)
if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", () => { toggleFullscreen(); });
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  updateFullscreenButton();
}

// 🖼 結算畫面的「成績圖卡」：遊戲畫面是橫向全螢幕，圖卡住在設定頁 ⇒ 先回設定頁再開卡片。
shareRunBtn.addEventListener("click", async () => {
  await showSetupScreen();
  openShareCard();
});

shareCardShareBtn.addEventListener("click", () => { shareDailyCard(); });
shareCardDownloadBtn.addEventListener("click", downloadShareCard);
shareCardCopyBtn.addEventListener("click", () => { copyDailyShareText(); });
shareCardCloseBtn.addEventListener("click", closeShareCard);

fireBtn.addEventListener("click", () => {
  unlockAudioFromGesture();
  fireBullets();
});

musicToggle.addEventListener("change", () => updatePreference("music", musicToggle.checked));
sfxToggle.addEventListener("change", () => updatePreference("sfx", sfxToggle.checked));
hapticsToggle.addEventListener("change", () => updatePreference("haptics", hapticsToggle.checked));
setupMusicToggle.addEventListener("change", () => updatePreference("music", setupMusicToggle.checked));
setupSfxToggle.addEventListener("change", () => updatePreference("sfx", setupSfxToggle.checked));
setupHapticsToggle.addEventListener("change", () => updatePreference("haptics", setupHapticsToggle.checked));
assistToggle.addEventListener("change", () => updatePreference("assist", assistToggle.checked));
setupAssistToggle.addEventListener("change", () => updatePreference("assist", setupAssistToggle.checked));
render3dToggle.addEventListener("change", () => updatePreference("render3d", render3dToggle.checked));
setupRender3dToggle.addEventListener("change", () => updatePreference("render3d", setupRender3dToggle.checked));
musicVolume.addEventListener("input", () => updateVolumePreference("musicVolume", musicVolume.value));
sfxVolume.addEventListener("input", () => updateVolumePreference("sfxVolume", sfxVolume.value));
setupMusicVolume.addEventListener("input", () => updateVolumePreference("musicVolume", setupMusicVolume.value));
setupSfxVolume.addEventListener("input", () => updateVolumePreference("sfxVolume", setupSfxVolume.value));

difficultySelect.addEventListener("change", () => {
  state.difficulty = difficultySelect.value;
  restartForModeChange();
});

modeSelect.addEventListener("change", () => {
  state.mode = modeSelect.value;
  restartForModeChange();
});

themeSelect.addEventListener("change", () => {
  state.theme = themeSelect.value;
  preferences.theme = state.theme;
  savePreferences();
  applyTheme();
  refreshBrickTheme();
  updateHud();
});

if (screenModeSelect) {
  screenModeSelect.addEventListener("change", () => {
    preferences.screenMode = screenModeSelect.value === "landscape" ? "landscape" : "auto";
    savePreferences();
    syncSettingsControls();
    // 在遊戲中改的話,當場換版面(不用退出重進)
    handleViewportChange();
  });
}

// 🎚 板子長度。★ 場上那塊板子當場跟著變長/變短,走的是和「玩到一半轉手機」同一條路:
//   rescaleWorld() 用新舊 base 的比值去縮 ⇒ 玩家吃到的 expand 寶物與卡關輔助的加寬
//   (state.assistWidthBonus)會一起等比例帶過去,不會被算錯或被吃掉。
function updatePaddleSizePreference(value) {
  const next = value in PADDLE_SIZES ? value : DEFAULT_PADDLE_SIZE;
  if (next === getPaddleSizeKey()) {
    return;
  }
  const prev = isGameScreenActive ? captureLayoutSnapshot() : null;
  preferences.paddleSize = next;
  savePreferences();
  syncSettingsControls();
  if (prev) {
    rescaleWorld(prev);
  }
  renderModeLabel();
}

if (paddleSizeSelect) {
  paddleSizeSelect.addEventListener("change", () => updatePaddleSizePreference(paddleSizeSelect.value));
}
if (paddleSizeSelectInGame) {
  paddleSizeSelectInGame.addEventListener("change", () => updatePaddleSizePreference(paddleSizeSelectInGame.value));
}

songSelect.addEventListener("change", () => {
  updateSongPreference(songSelect.value);
});

songSelectInGame.addEventListener("change", () => updateSongPreference(songSelectInGame.value));

bindHoldButton(leftBtn, () => {
  keys.left = true;
}, () => {
  keys.left = false;
});

bindHoldButton(rightBtn, () => {
  keys.right = true;
}, () => {
  keys.right = false;
});

installBtn.addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    setInstallHint("");
    updateInstallButton();
    return;
  }

  if (isIOS()) {
    setInstallHint("iPhone / iPad 請用 Safari 的分享選單，選「加入主畫面」。");
  } else {
    setInstallHint("若按下後沒有跳出安裝視窗，請改用 HTTPS 或 localhost 開啟，並用 Chrome / Edge 再試一次。");
  }
});

updateBtn.addEventListener("click", () => {
  if (waitingServiceWorker) {
    waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  updateInstallButton();
  setInstallHint("這台裝置支援安裝，按「安裝 APP」即可加入主畫面。");
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  updateInstallButton();
  setInstallHint("已安裝完成，之後可以直接像 App 一樣開啟。");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshingForUpdate) {
      return;
    }
    refreshingForUpdate = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((registration) => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        showUpdatePrompt(registration.waiting);
      }

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) {
          return;
        }

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            showUpdatePrompt(newWorker);
          }
        });
      });
    }).catch(() => {
      setInstallHint("若要使用安裝功能，請用本機伺服器或 HTTPS 開啟遊戲。");
    });
  });
}

migrateTopScores();
restartGame({ countGame: false, showStartOverlay: false });
renderAchievements();
renderTopScores();
renderEditor();
updateResumeButton();
updateInstallButton();
requestAnimationFrame(gameLoop);
