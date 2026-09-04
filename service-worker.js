const CACHE = 'ponchumoy-3d-ipad-v2';
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
const THREE_URL = 'https://unpkg.com/three@0.160.0/build/three.module.js';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(LOCAL_ASSETS);
    try {
      const response = await fetch(THREE_URL, {mode: 'cors'});
      if (response.ok) await cache.put(THREE_URL, response.clone());
    } catch (_) {
      // La primera carga de Three.js necesita conexión si todavía no está en caché.
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Para navegación usamos red primero: las nuevas versiones del juego llegan
  // al iPad sin quedar atrapadas por una copia antigua de index.html.
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE);
          cache.put('./index.html', response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response && (response.ok || response.type === 'opaque')) {
      const cache = await caches.open(CACHE);
      cache.put(event.request, response.clone()).catch(() => {});
    }
    return response;
  })());
});
