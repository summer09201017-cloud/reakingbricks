// render3d.js —— 打磚塊「立體渲染(3D)」模式的畫面層(2026-09-25)。
//
// ★ 設計原則:這支檔案**完全不知道遊戲規則**,只認 game.js 每幀餵給它的一份純資料快照
//   (板子/球/磚塊/道具的座標、尺寸、顏色)。物理、關卡、寶物、Boss、分享碼、存讀檔全部留在
//   game.js 裡一個字都沒動——3D 模式只是換了一顆鏡頭去看同一份 2D 座標,不是另開一個引擎。
//   子彈／護盾條／浮動分數／狀態列這些不需要精準對位的次要提示,仍然畫在原本的 2D canvas
//   上、疊在這層 3D 場景前面(見 game.js 的 render3dFrame())——**危險線與寶物道具則不是**:
//   2026-09-26 兩輪使用者實機回報都指向同一個真因,見下面 danger line 與 powerup 段落的說明。
//   ⚠ 教訓(寫給以後要加新疊層元素的人):3D 場景裡任何**玩家需要拿去跟板子/球比對位置**的
//   東西(危險線要判斷還有多少緩衝、寶物要對準板子接住),哪怕它本身邏輯上是平面的,
//   只要要跟 3D 物件對齊,就得進 3D 場景本身、吃同一套透視投影——2D 疊層永遠是「固定螢幕
//   百分比」的平面映射,跟透視投影不是同一套數學,兩邊看同一個 canvasY 會落在不同螢幕位置。
//   純粹「好看但不用對位」的東西(分數飄字、狀態列文字)才適合留在 2D 疊層。
//
// ★ 用 ES module 是刻意的,不是隨手:要在 game.js(classic script,file:// 也要能直接雙擊打開)
//   裡安全地用 Three.js,又不想讓所有玩家(包含只玩 2D 的人)都多下載一份 Three.js,
//   所以 game.js 只在玩家真的打開 3D 開關那一刻才用動態 `import("./render3d.js")` 載入本檔,
//   本檔再 import 已下載進本 repo 的 vendor/three.module.js(沒有走 CDN、沒有 npm、沒有建置步驟,
//   純粹多一個靜態檔案)。載入失敗(most常見:用 file:// 雙擊打開,ES module 會被瀏覽器擋)
//   由呼叫端(game.js 的 ensureRender3dLoaded)接住,靜默退回 2D,不會讓遊戲整個掛掉。
//
// ★ 座標系:2D 畫布 x 往右、y 往下,原點在左上角(跟 game.js 完全一樣的座標,一個像素都沒換算)。
//   3D 世界把原點搬到球場正中央:world X = canvasX − width/2、world Z = canvasY − height/2、
//   world Y 是「離地高度」(磚塊/板子的視覺厚度、球心的高度)。鏡頭固定一個俯角,
//   從板子那一側(高 canvasY ⇒ 高 world Z)的上方看向磚牆那一側(低 canvasY ⇒ 低 world Z),
//   這樣板子在近景變大、磚牆在遠景變小,是"立體"的觀感的來源——物理座標完全沒變,變的只是怎麼看它。
import * as THREE from "./vendor/three.module.js";

const BRICK_DEPTH = 20; // 磚塊視覺厚度:比它的 2D 高度略厚一點,看起來才像實心方塊而不是一片薄板
const PADDLE_DEPTH = 16;
const BALL_SEGMENTS = 18;
const WALL_HEIGHT = 26;
const WALL_THICKNESS = 14;
const CAMERA_FOV_DEG = 46;
const CAMERA_TILT_DEG = 47; // 從水平面往上抬的角度;試過 55°(直向球場太瘦長,鏡頭被迫拉遠,幾乎變俯視)
                             // 47° 在橫向仍有清楚的斜角景深,直向也比較看得出「這是立體的」

let renderer = null;
let scene = null;
let camera = null;
let floorMesh = null;
let leftWall = null;
let rightWall = null;
let topWall = null;
let paddleMesh = null;
let dangerLineMesh = null;
const ballMeshes = [];
const brickEntries = new Map(); // 用磚塊物件本身當 key(同一顆磚在存活期間物件參照不變)
const powerupEntries = new Map(); // 同上,key 是道具物件本身
const powerupTextureCache = new Map(); // key = "顏色|字樣",同一種道具全場共用一張貼圖
const POWERUP_HEIGHT = 16; // 離地高度,跟球心(半徑約 8~13)、磚塊厚度(20)同一個量級,不會浮太高

let lastWidth = 0;
let lastHeight = 0;

function makeStandardMaterial(hex, extra) {
  return new THREE.MeshStandardMaterial(Object.assign({ color: hex, roughness: 0.55, metalness: 0.06 }, extra));
}

function init(canvasEl) {
  if (renderer) {
    return; // 已經 init 過(例如 3D 開關關掉又打開):場景保留,直接繼續用
  }

  // preserveDrawingBuffer:true —— 沒有它,WebGL 允許在畫完那一幀後立刻清掉繪圖緩衝區,
  // 畫面本身(合成器看到的)完全正常,但任何事後用 drawImage/toDataURL 讀這塊 canvas 的驗收
  // 腳本會讀到一片空白,誤判成「3D 什麼都沒畫出來」。這顆場景很小(幾十個方塊),多這個成本可忽略。
  renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, powerPreference: "low-power", preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(CAMERA_FOV_DEG, 1, 10, 6000);

  scene.add(new THREE.AmbientLight(0xffffff, 0.72));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
  keyLight.position.set(180, 480, 320);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xbcd8ff, 0.3);
  fillLight.position.set(-220, 260, -180);
  scene.add(fillLight);

  floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), makeStandardMaterial(0x102a4b, { roughness: 0.92 }));
  floorMesh.rotation.x = -Math.PI / 2;
  scene.add(floorMesh);

  const wallMaterial = makeStandardMaterial(0x0a1b34, { roughness: 0.85 });
  leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), wallMaterial);
  rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), wallMaterial.clone());
  topWall = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), wallMaterial.clone());
  scene.add(leftWall, rightWall, topWall);

  paddleMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), makeStandardMaterial(0xffb84d, { roughness: 0.4, metalness: 0.12 }));
  scene.add(paddleMesh);

  // 🚨 危險線(2026-09-26):原本這條線是畫在 2D 疊層上的平面座標,跟板子/磚塊這些
  // 走透視投影的 3D 物件用的是兩套完全不同的映射——同一個 canvasY,在 2D 疊層上永遠對應
  // 固定的螢幕百分比,在 3D 鏡頭裡卻會因為透視而落到完全不同的螢幕位置。使用者實機回報
  // 「立體模式下,線跑到板子下面去了」,量出來就是這個:板子(透視,近景)反而投影到線
  // (平面,不受透視影響)的上面。修法是把這條線也做成真正的 3D 物件,跟板子吃同一顆鏡頭、
  // 同一套透視,兩者的相對位置在任何鏡頭角度下都會是對的——不是再猜一個位移量去湊。
  dangerLineMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff9aa8, transparent: true, opacity: 0.6 }),
  );
  dangerLineMesh.visible = false;
  scene.add(dangerLineMesh);

  // 🔬 驗收用的唯讀視窗(canvas-playwright-verify 那套的老問題:3D 場景在畫面裡對不對,
  // 從外面只看得到一張圖,只能靠截圖比對猜——這裡直接把量得到的數字吐出來)。
  // 只給讀取用的數字,不給改場景;真的壞掉就會在這幾個數字上看到不合理的值。
  window.__render3dDebug = () => ({
    ballCount: ballMeshes.length,
    brickCount: brickEntries.size,
    cameraPos: camera.position.toArray().map((n) => Math.round(n)),
    paddlePos: paddleMesh.position.toArray().map((n) => Math.round(n)),
    paddleScale: paddleMesh.scale.toArray().map((n) => Math.round(n)),
    firstBallPos: ballMeshes[0] ? ballMeshes[0].position.toArray().map((n) => Math.round(n)) : null,
    dangerLineVisible: dangerLineMesh.visible,
    dangerLinePos: dangerLineMesh.position.toArray().map((n) => Math.round(n)),
    powerupCount: powerupEntries.size,
    firstPowerupPos: (() => {
      const first = powerupEntries.values().next().value;
      return first ? first.position.toArray().map((n) => Math.round(n)) : null;
    })(),
  });
}

// 尺寸(轉向、拉視窗)改了才重算,平常每幀呼叫也不會白做工。
function resize(width, height) {
  if (!renderer || width <= 0 || height <= 0) {
    return;
  }
  if (width === lastWidth && height === lastHeight) {
    return;
  }
  lastWidth = width;
  lastHeight = height;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;

  // 讓整片球場(用對角線一半當半徑,寧可多留白也絕不裁到球場)剛好塞進視野:
  // 鏡頭角度固定,距離依當下尺寸重算,直向/橫向、任何長寬比都不會切到磚塊或板子。
  const halfDiagonal = 0.5 * Math.hypot(width, height);
  const fovRad = (camera.fov * Math.PI) / 180;
  const distance = (halfDiagonal / Math.sin(fovRad / 2)) * 1.08;
  const tiltRad = (CAMERA_TILT_DEG * Math.PI) / 180;
  camera.position.set(0, distance * Math.sin(tiltRad), distance * Math.cos(tiltRad));
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  floorMesh.scale.set(width * 1.06, height * 1.06, 1);

  leftWall.scale.set(WALL_THICKNESS, WALL_HEIGHT, height + WALL_THICKNESS * 2);
  leftWall.position.set(-width / 2 - WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0);
  rightWall.scale.set(WALL_THICKNESS, WALL_HEIGHT, height + WALL_THICKNESS * 2);
  rightWall.position.set(width / 2 + WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0);
  // 只圍左右和上方三面——下方是板子活動與球出界的地方,圍起來反而擋視線
  topWall.scale.set(width + WALL_THICKNESS * 2, WALL_HEIGHT, WALL_THICKNESS);
  topWall.position.set(0, WALL_HEIGHT / 2, -height / 2 - WALL_THICKNESS / 2);
}

function syncBalls(balls, offsetX, offsetZ) {
  while (ballMeshes.length < balls.length) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, BALL_SEGMENTS, BALL_SEGMENTS * 0.75),
      makeStandardMaterial(0xffffff, { roughness: 0.25, metalness: 0.15 }),
    );
    scene.add(mesh);
    ballMeshes.push(mesh);
  }
  while (ballMeshes.length > balls.length) {
    const mesh = ballMeshes.pop();
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
  for (let i = 0; i < balls.length; i += 1) {
    const ball = balls[i];
    const mesh = ballMeshes[i];
    mesh.scale.setScalar(Math.max(1, ball.radius));
    mesh.position.set(ball.x - offsetX, Math.max(1, ball.radius), ball.y - offsetZ);
    mesh.material.color.set(ball.color);
    mesh.material.emissive.set(ball.glow || ball.color);
    mesh.material.emissiveIntensity = 0.5;
  }
}

function syncBricks(bricks, offsetX, offsetZ) {
  const alive = new Set();
  for (let i = 0; i < bricks.length; i += 1) {
    const snap = bricks[i];
    alive.add(snap.ref);
    let entry = brickEntries.get(snap.ref);
    if (!entry) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), makeStandardMaterial(0xffffff));
      scene.add(mesh);
      entry = { mesh, color: null };
      brickEntries.set(snap.ref, entry);
    }
    entry.mesh.scale.set(Math.max(1, snap.width - 3), BRICK_DEPTH, Math.max(1, snap.height - 3));
    entry.mesh.position.set(
      snap.x + snap.width / 2 - offsetX,
      BRICK_DEPTH / 2,
      snap.y + snap.height / 2 - offsetZ,
    );
    if (entry.color !== snap.color) {
      entry.color = snap.color;
      entry.mesh.material.color.set(snap.color);
    }
  }
  // 打掉的磚(或整關換掉的磚)要把 mesh 一起丟掉,不然場上會留著看不見的死物件慢慢漏記憶體。
  for (const [ref, entry] of brickEntries) {
    if (!alive.has(ref)) {
      scene.remove(entry.mesh);
      entry.mesh.geometry.dispose();
      entry.mesh.material.dispose();
      brickEntries.delete(ref);
    }
  }
}

// 🎁 寶物道具(2026-09-26):使用者實機回報「吃不到寶物」——真因跟危險線同一顆坑:
//   道具原本畫在 2D 疊層(平面座標),板子是透視投影的 3D 物件,兩者對不齊,玩家對著
//   螢幕上看到的道具去接,板子(3D)的實際位置卻不在那裡。碰撞判定本身完全沒壞
//   (updatePowerups() 比對的是 powerup.x/y 跟 paddle.x/y/width/height,2D/3D 共用同一份,
//   從頭到尾沒被 3D 模式動過)——玩家看得到、卻對不準,才是「吃不到」的真正原因。
//   修法跟危險線一樣:道具也進 3D 場景,吃同一顆鏡頭。用 THREE.Sprite(永遠面向鏡頭的
//   內建billboard)而不是一般 Mesh,不用像危險線/磚塊那樣自己算貼合鏡頭角度的旋轉。
//   貼圖用 Canvas 現畫一次、以「顏色+字樣」為 key 快取,同一種道具(GUN/WIDE/…)全場共用
//   同一張圖,不會每顆道具都重畫一次。
function getPowerupTexture(color, label) {
  const key = color + "|" + label;
  let tex = powerupTextureCache.get(key);
  if (tex) {
    return tex;
  }
  const size = 128;
  const off = document.createElement("canvas");
  off.width = size;
  off.height = size;
  const c2d = off.getContext("2d");
  const r = 26;
  const inset = 6;
  c2d.beginPath();
  c2d.moveTo(inset + r, inset);
  c2d.arcTo(size - inset, inset, size - inset, size - inset, r);
  c2d.arcTo(size - inset, size - inset, inset, size - inset, r);
  c2d.arcTo(inset, size - inset, inset, inset, r);
  c2d.arcTo(inset, inset, size - inset, inset, r);
  c2d.closePath();
  c2d.fillStyle = color;
  c2d.fill();
  c2d.strokeStyle = "#ffffffcc";
  c2d.lineWidth = 5;
  c2d.stroke();
  c2d.fillStyle = "#07203a";
  c2d.font = "bold 30px Trebuchet MS";
  c2d.textAlign = "center";
  c2d.textBaseline = "middle";
  c2d.fillText(label, size / 2, size / 2 + 2);
  tex = new THREE.CanvasTexture(off);
  powerupTextureCache.set(key, tex);
  return tex;
}

function syncPowerups(powerups, offsetX, offsetZ) {
  const alive = new Set();
  for (let i = 0; i < powerups.length; i += 1) {
    const snap = powerups[i];
    alive.add(snap.ref);
    let sprite = powerupEntries.get(snap.ref);
    if (!sprite) {
      const material = new THREE.SpriteMaterial({ map: getPowerupTexture(snap.color, snap.label), transparent: true });
      sprite = new THREE.Sprite(material);
      scene.add(sprite);
      powerupEntries.set(snap.ref, sprite);
    }
    const displaySize = snap.size * 1.35; // 比 2D 原尺寸略放大,3D 場景景深一拉遠就容易看不清
    sprite.scale.set(displaySize, displaySize, 1);
    sprite.position.set(snap.x - offsetX, POWERUP_HEIGHT, snap.y - offsetZ);
  }
  for (const [ref, sprite] of powerupEntries) {
    if (!alive.has(ref)) {
      scene.remove(sprite);
      sprite.material.dispose(); // 只丟這顆自己的 material,貼圖是快取共用的,不能跟著丟
      powerupEntries.delete(ref);
    }
  }
}

// payload 是 game.js 每幀組好的純資料快照,見該檔 render3dFrame()。
function syncScene(payload) {
  if (!renderer) {
    return;
  }
  resize(payload.width, payload.height);

  scene.background = new THREE.Color(payload.voidColor || "#050b16");
  floorMesh.material.color.set(payload.floorColor);

  const offsetX = payload.width / 2;
  const offsetZ = payload.height / 2;

  const p = payload.paddle;
  paddleMesh.scale.set(Math.max(1, p.width), PADDLE_DEPTH, Math.max(1, p.height));
  paddleMesh.position.set(p.x + p.width / 2 - offsetX, PADDLE_DEPTH / 2, p.y + p.height / 2 - offsetZ);
  paddleMesh.material.color.set(p.color);

  const dl = payload.dangerLine;
  dangerLineMesh.visible = !!(dl && dl.active);
  if (dl && dl.active) {
    const LINE_THICKNESS = 4; // 沿球場深度方向(Z)的厚度,矮矮貼在地板上一條,不是一片牆
    const LINE_HEIGHT = 3;    // 離地高度,矮到不會擋視線,但夠讓它跟地板分出層次
    dangerLineMesh.scale.set(payload.width - 28, LINE_HEIGHT, LINE_THICKNESS);
    dangerLineMesh.position.set(0, LINE_HEIGHT / 2, dl.y - offsetZ);
    dangerLineMesh.material.color.set(dl.color);
    dangerLineMesh.material.opacity = dl.opacity;
  }

  syncBalls(payload.balls, offsetX, offsetZ);
  syncBricks(payload.bricks, offsetX, offsetZ);
  syncPowerups(payload.powerups || [], offsetX, offsetZ);
}

function renderFrame() {
  if (!renderer) {
    return;
  }
  renderer.render(scene, camera);
}

// 目前沒有需要主動釋放資源的情境(切回 2D 只是不再呼叫 renderFrame,場景留著方便隨時切回來)。
// 保留這個空函式是為了介面完整,以後如果要整頁關掉/換遊戲才用得到。
function dispose() {}

export const Render3D = { init, resize, syncScene, renderFrame, dispose };
