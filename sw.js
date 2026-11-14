const CACHE_NAME = "breakout-pwa-v36";
// 畫面上的版號(= game.js 的 APP_VERSION = 更新紀錄第一筆)。SW 讀不到 game.js,只好帶一份;
// test/version.mjs 守「這裡 === game.js 的 APP_VERSION」,忘了同步改會當場紅。
// ⚠ CACHE_NAME 的格式維持 breakout-pwa-v<數字> 不要改:艦隊巡檢工具讀的是它(同支測試也守格式)。
const APP_VERSION = "2.6.10";
const ASSETS = [
  "./",
  "./styles.css",
  "./game.js",
  "./render3d.js",
  "./vendor/three.module.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.all(ASSETS.map((u) => cache.add(u).catch(() => null)))),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  // 跨站請求(例如 hfpc-feedback 的 widget.js／/api/feedback)一律直接走網路、不進快取：
  // 這支 SW 原本對所有 GET 都 cache-first，第一次抓到的「讚數 0」會被永久存起來，
  // 之後重整永遠顯示 0（Worker 的 Cache-Control: no-store 對 SW 的 cache.put 無效）。
  // 同源的本站資產（index.html／game.js／render3d.js…）不受影響，仍走下面的 cache-first。
  if (new URL(event.request.url).origin !== self.location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || event.request.url.startsWith("chrome-extension://")) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return networkResponse;
      });
    }),
  );
});

// 🏷️ 版號回報(0831 VT1 批次;1113 改回報 APP_VERSION):頁尾那一列問「實際執行中的版本」,
// 答案跟畫面同一套號碼(2.6.9 這種),頁面比對不一樣才提示重新整理。快取名另附在 cache 欄位備查。
self.addEventListener('message', function (e) {
  if (e && e.data === 'GET_VERSION' && e.source) e.source.postMessage({ type: 'SW_VERSION', v: APP_VERSION, cache: CACHE_NAME });
});
