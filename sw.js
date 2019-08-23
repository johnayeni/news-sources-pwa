const cacheName = 'news-sources-v1';

const staticAssets = ['./', './app.js', './styles.css', './fallback.json'];

self.addEventListener('install', async () => {
  const cache = await caches.open(cacheName);
  cache.addAll(staticAssets);
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
};

const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (err) {
    const cacheResponse = await caches.match('./fallback.json');
    return cacheResponse;
  }
};
