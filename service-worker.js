const CACHE_NAME = 'tanalista-v3';

const urlsToCache = [
  '/',
  '/index.html',
  '/lista.html',
  '/guia.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/favicon-32.png',
  '/icon-192.png',
  '/icon-512.png',
  '/logo-horizontal.png',

  // Ícones Lucide locais
  '/lib/lucide/plus.svg',
  '/lib/lucide/trash.svg',
  '/lib/lucide/minus.svg',
  '/lib/lucide/mic.svg',
  '/lib/lucide/mic-off.svg',
  '/lib/lucide/arrow-left.svg',
  '/lib/lucide/shopping-cart.svg',
  '/lib/lucide/check.svg',
  '/lib/lucide/camera.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // ativa imediatamente o novo SW
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // remove caches antigos
          }
        })
      );
    })
  );
  self.clients.claim(); // força o controle imediato das páginas abertas
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // serve do cache
      }
      return fetch(event.request).catch(() => {
        // fallback para navegação offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
