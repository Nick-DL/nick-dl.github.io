const cacheName = "what";
const cacheFiles = ["/", "/index.html", "/manifest.json"];

/**
 * 安装 Service Worker
 */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheFiles);
    }),
  );
});


/**
 * 激活 Service Worker
 */
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (cacheName !== key) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => {
        console.log("cache deleted");
      })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches
      .open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      }),
  );
});

