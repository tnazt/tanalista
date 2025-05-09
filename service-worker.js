const CACHE_NAME = 'tanalista-v2';

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

  // Ícones locais do Lucide
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
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
