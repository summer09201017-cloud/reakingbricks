const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const startBtn = document.getElementById("startBtn");
const toggleBtn = document.getElementById("toggleBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const fireBtn = document.getElementById("fireBtn");
const installBtn = document.getElementById("installBtn");
const installHint = document.getElementById("installHint");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const BALL_RADIUS = 8;
const BIG_BALL_RADIUS = 13;
const MAX_BALLS = 6;

const state = {
  running: false,
  gameOver: false,
  score: 0,
  lives: 3,
  level: 1,
  gunTimer: 0,
  shotCooldown: 0,
  bigBallTimer: 0,
};

const keys = {
  left: false,
  right: false,
};

const paddle = {
  width: 136,
  height: 14,
  x: 0,
  y: canvas.height - 42,
  speed: 8,
  dx: 0,
};

let balls = [];
let bricks = [];
let powerups = [];
let bullets = [];
let floatingTexts = [];

const POWERUP_DROP_RATE = 0.3;
const POWERUP_LIMIT_PER_TYPE = 2;
const POWERUP_TYPES = [
  { type: "laser", label: "GUN", color: "#ff93db" },
  { type: "expand", label: "WIDE", color: "#98f5b4" },
  { type: "bigball", label: "BIG", color: "#ffcf70" },
  { type: "multiball", label: "x2", color: "#ffe680" },
  { type: "slow", label: "SLOW", color: "#8ed8ff" },
];
let powerupSpawnCounts = createPowerupCounter();

const stars = Array.from({ length: 20 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * (canvas.height * 0.52),
  r: 0.8 + Math.random() * 2.2,
  alpha: 0.15 + Math.random() * 0.35,
}));

let audioCtx = null;
let musicGain = null;
let sfxGain = null;
let musicTimerId = null;
let nextMusicTime = 0;
let musicStepIndex = 0;
let deferredInstallPrompt = null;

const MUSIC_STEP = 0.22;
const MUSIC_PATTERN = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function ensureAudioReady() {
  if (audioCtx) {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  audioCtx = new AudioContextClass();

  musicGain = audioCtx.createGain();
  musicGain.gain.value = 0.06;
  musicGain.connect(audioCtx.destination);

  sfxGain = audioCtx.createGain();
  sfxGain.gain.value = 0.22;
  sfxGain.connect(audioCtx.destination);

  nextMusicTime = audioCtx.currentTime + 0.05;
  musicStepIndex = 0;
}

function startMusic() {
  ensureAudioReady();
  if (!audioCtx || !musicGain || musicTimerId !== null) {
    return;
  }

  const schedule = () => {
    if (!audioCtx || !state.running) {
      stopMusic();
      return;
    }

    const lookAhead = 0.7;
    while (nextMusicTime < audioCtx.currentTime + lookAhead) {
      const frequency = MUSIC_PATTERN[musicStepIndex % MUSIC_PATTERN.length];

      const oscillator = audioCtx.createOscillator();
      const envelope = audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, nextMusicTime);

      envelope.gain.setValueAtTime(0.0001, nextMusicTime);
      envelope.gain.linearRampToValueAtTime(0.055, nextMusicTime + 0.018);
      envelope.gain.exponentialRampToValueAtTime(0.0001, nextMusicTime + MUSIC_STEP * 0.95);

      oscillator.connect(envelope);
      envelope.connect(musicGain);

      oscillator.start(nextMusicTime);
      oscillator.stop(nextMusicTime + MUSIC_STEP);

      nextMusicTime += MUSIC_STEP;
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
  if (!audioCtx || !sfxGain) {
    return;
  }

  const now = audioCtx.currentTime;
  const oscillator = audioCtx.createOscillator();
  const envelope = audioCtx.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.07);

  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(0.09, now + 0.004);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  oscillator.connect(envelope);
  envelope.connect(sfxGain);

  oscillator.start(now);
  oscillator.stop(now + 0.09);
}

function unlockAudioFromGesture() {
  ensureAudioReady();
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (state.running) {
    startMusic();
  }
}

function updateHud() {
  scoreEl.textContent = String(state.score);
  livesEl.textContent = String(state.lives);
  levelEl.textContent = String(state.level);
}

function setOverlay(title, text, visible = true) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlay.classList.toggle("hidden", !visible);
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

function updateInstallButton() {
  const canPromptInstall = Boolean(deferredInstallPrompt);
  const showOnMobile = isTouchDevice() && !isStandalone();
  installBtn.hidden = isStandalone() || (!showOnMobile && !canPromptInstall);
}

function syncButton() {
  if (state.gameOver) {
    startBtn.textContent = "重新開始";
    toggleBtn.textContent = "重新開始";
    return;
  }

  const label = state.running ? "暫停" : "開始遊戲";
  startBtn.textContent = label;
  toggleBtn.textContent = label;
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

function clearTemporaryPowerups() {
  state.gunTimer = 0;
  state.shotCooldown = 0;
  state.bigBallTimer = 0;
  setBallRadius(BALL_RADIUS);
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

function createBricks(level) {
  const rows = 6;
  const cols = 10;
  const top = 70;
  const side = 36;
  const gap = 8;
  const brickHeight = 24;
  const brickWidth = (canvas.width - side * 2 - gap * (cols - 1)) / cols;
  const hp = Math.min(3, 1 + Math.floor((level - 1) / 2));
  const palette = ["#55c1ff", "#63e6be", "#ffe66d", "#ffaf54", "#ff7f7f"];

  bricks = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      bricks.push({
        x: side + col * (brickWidth + gap),
        y: top + row * (brickHeight + gap),
        width: brickWidth,
        height: brickHeight,
        hp,
        color: palette[(row + col) % palette.length],
        alive: true,
      });
    }
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
  const baseSpeed = 4.8 + (state.level - 1) * 0.35;
  const horizontal = (Math.random() * 0.8 + 0.55) * (Math.random() < 0.5 ? -1 : 1);
  ball.vx = baseSpeed * horizontal;
  ball.vy = -Math.sqrt(Math.max(4, baseSpeed * baseSpeed - ball.vx * ball.vx));
  ball.stuck = false;
}

function resetPositions() {
  paddle.x = (canvas.width - paddle.width) * 0.5;
  paddle.dx = 0;
  resetBallsOnPaddle();
}

function restartGame() {
  state.running = false;
  state.gameOver = false;
  state.score = 0;
  state.lives = 3;
  state.level = 1;
  clearTemporaryPowerups();
  stopMusic();

  paddle.width = 136;
  powerups = [];
  bullets = [];
  floatingTexts = [];
  powerupSpawnCounts = createPowerupCounter();

  createBricks(state.level);
  resetPositions();
  updateHud();
  setOverlay("打磚塊", "按空白鍵、開始遊戲或手機按鈕發射球。");
  syncButton();
}

function startOrResume() {
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
  setOverlay("", "", false);
  syncButton();
}

function pauseGame() {
  state.running = false;
  stopMusic();
  setOverlay("已暫停", "按空白鍵、開始遊戲或手機按鈕繼續。");
  syncButton();
}

function loseLife() {
  state.lives -= 1;
  clearTemporaryPowerups();
  powerups = [];
  bullets = [];
  updateHud();

  if (state.lives <= 0) {
    state.running = false;
    stopMusic();
    state.gameOver = true;
    setOverlay("遊戲結束", `最終分數：${state.score}。按重新開始再玩一次。`);
    syncButton();
    return;
  }

  state.running = false;
  stopMusic();
  resetBallsOnPaddle();
  setOverlay("失去一命", `剩餘生命：${state.lives}。按空白鍵或開始遊戲繼續。`);
  syncButton();
}

function nextLevel() {
  state.running = false;
  stopMusic();
  state.level += 1;
  state.score += 50;
  clearTemporaryPowerups();
  powerups = [];
  bullets = [];
  updateHud();

  createBricks(state.level);
  resetPositions();
  setOverlay(`第 ${state.level} 關`, "太好了，按空白鍵或開始遊戲進入下一關。");
  syncButton();
}

function movePaddleTo(clientX) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const x = (clientX - rect.left) * scaleX;
  paddle.x = clamp(x - paddle.width * 0.5, 0, canvas.width - paddle.width);

  for (let i = 0; i < balls.length; i += 1) {
    if (balls[i].stuck) {
      balls[i].x = paddle.x + paddle.width * 0.5;
      balls[i].y = paddle.y - balls[i].radius - 1;
    }
  }
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

  for (let i = 0; i < balls.length; i += 1) {
    if (balls[i].stuck) {
      balls[i].x = paddle.x + paddle.width * 0.5;
      balls[i].y = paddle.y - balls[i].radius - 1;
    }
  }
}

function spawnPowerup(brick) {
  if (Math.random() > POWERUP_DROP_RATE) {
    return;
  }

  const availablePowerups = POWERUP_TYPES.filter(
    (powerup) => (powerupSpawnCounts[powerup.type] ?? 0) < POWERUP_LIMIT_PER_TYPE,
  );

  if (availablePowerups.length === 0) {
    return;
  }

  const pick = availablePowerups[Math.floor(Math.random() * availablePowerups.length)];
  powerupSpawnCounts[pick.type] = (powerupSpawnCounts[pick.type] ?? 0) + 1;
  powerups.push({
    x: brick.x + brick.width * 0.5,
    y: brick.y + brick.height * 0.5,
    vy: 2.35,
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

function createSplitBallsFrom(source) {
  if (balls.length >= MAX_BALLS) {
    return 0;
  }

  let baseVx = source.vx;
  let baseVy = source.vy;

  if (Math.abs(baseVx) < 0.05 && Math.abs(baseVy) < 0.05) {
    const speed = 5.3;
    baseVx = speed * 0.62 * (Math.random() < 0.5 ? -1 : 1);
    baseVy = -Math.sqrt(speed * speed - baseVx * baseVx);
  }

  const angles = [-0.52, 0.52];
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

    let vy = rotated.vy;
    if (vy > -0.9) {
      vy = -Math.abs(vy) - 0.9;
    }

    balls.push(createBall(source.x, source.y, false, rotated.vx, vy));
    created += 1;
  }

  return created;
}

function applyPowerup(powerup) {
  if (powerup.type === "expand") {
    paddle.width = clamp(paddle.width + 34, 100, 250);
    paddle.x = clamp(paddle.x, 0, canvas.width - paddle.width);
    spawnFloatingText("板子變長", powerup.x, paddle.y - 12, "#98f5b4");
  } else if (powerup.type === "bigball") {
    state.bigBallTimer = Math.max(state.bigBallTimer, 16);
    setBallRadius(BIG_BALL_RADIUS);
    spawnFloatingText("巨球啟動", powerup.x, paddle.y - 12, "#ffcf70");
  } else if (powerup.type === "slow") {
    for (let i = 0; i < balls.length; i += 1) {
      if (!balls[i].stuck) {
        slowBall(balls[i], 0.78, 3.4);
      }
    }
    spawnFloatingText("球速變慢", powerup.x, paddle.y - 12, "#8ed8ff");
  } else if (powerup.type === "multiball") {
    const source = balls.find((item) => !item.stuck) || balls[0];
    if (source) {
      if (source.stuck) {
        launchBall(source);
      }

      const created = createSplitBallsFrom(source);
      if (created > 0) {
        spawnFloatingText(`多 ${created} 顆球`, powerup.x, paddle.y - 12, "#ffe680");
      } else {
        spawnFloatingText("球數已滿", powerup.x, paddle.y - 12, "#ffe680");
      }
    }
  } else if (powerup.type === "laser") {
    state.gunTimer = Math.max(state.gunTimer, 14);
    state.shotCooldown = 0;
    spawnFloatingText("雷射啟動", powerup.x, paddle.y - 12, "#ff9ce0");
  }

  updateHud();
}

function updatePowerups(step) {
  for (let i = powerups.length - 1; i >= 0; i -= 1) {
    const powerup = powerups[i];
    powerup.y += powerup.vy * step;

    const half = powerup.size * 0.5;
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

  return ball.y - ball.radius > canvas.height;
}

function handlePaddleCollision(ball) {
  if (ball.vy <= 0) {
    return;
  }

  const hitsY = ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height;
  const hitsX = ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width;

  if (!hitsX || !hitsY) {
    return;
  }

  ball.y = paddle.y - ball.radius - 0.1;

  const hitPosition = (ball.x - (paddle.x + paddle.width * 0.5)) / (paddle.width * 0.5);
  const speed = Math.min(9.5, Math.hypot(ball.vx, ball.vy) * 1.02);
  const angle = hitPosition * (Math.PI / 3);

  ball.vx = speed * Math.sin(angle);
  ball.vy = -Math.abs(speed * Math.cos(angle));
}

function onBrickDamaged(brick) {
  playBrickHitSound();
  brick.hp -= 1;
  state.score += brick.hp <= 0 ? 10 : 4;

  if (brick.hp <= 0) {
    brick.alive = false;
    spawnPowerup(brick);
  }

  updateHud();

  if (bricks.every((item) => !item.alive)) {
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

    if (hitHorizontal && !hitVertical) {
      ball.vx *= -1;
    } else {
      ball.vy *= -1;
    }

    onBrickDamaged(brick);

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
  bullets.push({ x: paddle.x + 14, y, w: 4, h: 13, vy: -11.2 });
  bullets.push({ x: paddle.x + paddle.width - 14, y, w: 4, h: 13, vy: -11.2 });
  state.shotCooldown = 0.2;
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

    onBrickDamaged(brick);
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
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0f345f");
  gradient.addColorStop(0.55, "#102a4b");
  gradient.addColorStop(1, "#0a1b34");
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

function drawBricks() {
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive) {
      continue;
    }

    drawRoundedRect(brick.x, brick.y, brick.width, brick.height, 6);

    if (brick.hp >= 3) {
      ctx.fillStyle = "#f94144";
    } else if (brick.hp === 2) {
      ctx.fillStyle = "#f8961e";
    } else {
      ctx.fillStyle = brick.color;
    }

    ctx.fill();
    ctx.strokeStyle = "#ffffff66";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (brick.hp > 1) {
      ctx.fillStyle = "#0e1f33";
      ctx.font = "bold 14px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(brick.hp), brick.x + brick.width * 0.5, brick.y + brick.height * 0.55);
    }
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

function drawPaddle() {
  drawRoundedRect(paddle.x, paddle.y, paddle.width, paddle.height, 7);
  const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
  gradient.addColorStop(0, "#fff7b0");
  gradient.addColorStop(1, "#ffb84d");
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
}

function drawBalls() {
  for (let i = 0; i < balls.length; i += 1) {
    const ball = balls[i];
    const gradient = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 2, ball.x, ball.y, ball.radius + 2);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.55, "#8be9ff");
    gradient.addColorStop(1, "#2ea8ff");

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.shadowColor = state.bigBallTimer > 0 ? "#ffd166" : "#62d4ff";
    ctx.shadowBlur = state.bigBallTimer > 0 ? 15 : 12;
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

  if (activeEffects.length > 0) {
    ctx.textAlign = "right";
    ctx.fillText(activeEffects.join("  "), canvas.width - 14, canvas.height - 14);
  }
}

function render() {
  drawBackground();
  drawBricks();
  drawPowerups();
  drawBullets();
  drawPaddle();
  drawBalls();
  drawFloatingTexts();
  drawStatus();
}

let lastTs = 0;
function gameLoop(ts) {
  const delta = Math.min(32, ts - lastTs || 16.67);
  const step = delta / 16.67;
  const deltaSec = delta / 1000;
  lastTs = ts;

  updatePaddle(step);

  if (state.running) {
    updateBalls(step);
    if (state.running) {
      updatePowerups(step);
      updateBullets(step);
      updateTimers(deltaSec);
    }
  }

  updateFloatingTexts(step);
  render();
  requestAnimationFrame(gameLoop);
}

function togglePlayState() {
  unlockAudioFromGesture();
  setInstallHint("");
  if (state.running) {
    pauseGame();
  } else {
    startOrResume();
  }
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

window.addEventListener("keydown", (event) => {
  unlockAudioFromGesture();
  const key = event.key.toLowerCase();

  if (key === "arrowleft" || key === "a") {
    keys.left = true;
  }

  if (key === "arrowright" || key === "d") {
    keys.right = true;
  }

  if (key === " " || key === "spacebar") {
    event.preventDefault();
    togglePlayState();
  }

  if (key === "j" || key === "f") {
    event.preventDefault();
    fireBullets();
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
    pauseGame();
  }
  keys.left = false;
  keys.right = false;
});

canvas.addEventListener("mousemove", (event) => {
  movePaddleTo(event.clientX);
});

canvas.addEventListener("mousedown", (event) => {
  unlockAudioFromGesture();
  movePaddleTo(event.clientX);
  fireBullets();
});

canvas.addEventListener("touchstart", (event) => {
  event.preventDefault();
  if (event.touches[0]) {
    unlockAudioFromGesture();
    movePaddleTo(event.touches[0].clientX);
    fireBullets();
  }
}, { passive: false });

canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  if (event.touches[0]) {
    movePaddleTo(event.touches[0].clientX);
  }
}, { passive: false });

startBtn.addEventListener("click", togglePlayState);
toggleBtn.addEventListener("click", togglePlayState);

fireBtn.addEventListener("click", () => {
  unlockAudioFromGesture();
  fireBullets();
});

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
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      setInstallHint("若要使用安裝功能，請用本機伺服器或 HTTPS 開啟遊戲。");
    });
  });
}

restartGame();
updateInstallButton();
requestAnimationFrame(gameLoop);
