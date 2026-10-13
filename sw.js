const CACHE_NAME = "breakout-pwa-v34";
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

// 🏷️ 版號回報(0831 VT1 批次):頁尾徽章問「實際執行中的版本」,答案=本 SW 的快取名。
self.addEventListener('message', function (e) {
  if (e && e.data === 'GET_VERSION' && e.source) e.source.postMessage({ type: 'SW_VERSION', v: CACHE_NAME });
});
