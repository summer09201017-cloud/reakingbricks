// render3d.js —— 打磚塊「立體渲染(3D)」模式的畫面層(2026-09-25)。
//
// ★ 設計原則:這支檔案**完全不知道遊戲規則**,只認 game.js 每幀餵給它的一份純資料快照
//   (板子/球/磚塊的座標、尺寸、顏色)。物理、關卡、寶物、Boss、分享碼、存讀檔全部留在
//   game.js 裡一個字都沒動——3D 模式只是換了一顆鏡頭去看同一份 2D 座標,不是另開一個引擎。
//   危險線／道具／子彈／護盾條／浮動分數／狀態列這些「不是實體方塊」的東西,
//   仍然畫在原本的 2D canvas 上、疊在這層 3D 場景前面(見 game.js 的 render3dFrame())。
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
const ballMeshes = [];
const brickEntries = new Map(); // 用磚塊物件本身當 key(同一顆磚在存活期間物件參照不變)

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

  syncBalls(payload.balls, offsetX, offsetZ);
  syncBricks(payload.bricks, offsetX, offsetZ);
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
