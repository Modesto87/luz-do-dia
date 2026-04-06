const APP_CACHE_PREFIX = 'luz-do-dia';
const STATIC_CACHE_NAME = `${APP_CACHE_PREFIX}-static-v3`;
const CORE_ASSETS = ['./', './index.html', './manifest.json', './favicon.ico', './logo192.png', './logo512.png'];
const STATIC_DESTINATIONS = new Set(['style', 'script', 'image', 'font', 'manifest']);

function isAppCache(name) {
  return typeof name === 'string' && name.startsWith(APP_CACHE_PREFIX);
}

function isStaticAssetRequest(request, requestUrl) {
  return requestUrl.origin === self.location.origin && STATIC_DESTINATIONS.has(request.destination);
}

async function cacheStaticResponse(request, response) {
  if (!response || !response.ok) {
    return;
  }

  const cache = await caches.open(STATIC_CACHE_NAME);
  await cache.put(request, response.clone());
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((name) => isAppCache(name) && name !== STATIC_CACHE_NAME).map((name) => caches.delete(name)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (isStaticAssetRequest(event.request, requestUrl)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cached = await cache.match(event.request);
        if (cached) {
          return cached;
        }

        try {
          const response = await fetch(event.request);
          await cacheStaticResponse(event.request, response);
          return response;
        } catch (error) {
          return Response.error();
        }
      })()
    );
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE_NAME);
        try {
          return await fetch(event.request);
        } catch (error) {
          return (await cache.match('./index.html')) || (await cache.match('./'));
        }
      })()
    );
    return;
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url;
  if (!targetUrl) {
    return;
  }

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return undefined;
    })()
  );
});
