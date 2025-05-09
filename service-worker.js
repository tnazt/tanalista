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

  // Ícones locais (Lucide)
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
      // Se achou no cache, retorna
      if (response) {
        return response;
      }

      // Se não achou, tenta buscar online
      return fetch(event.request).catch(() => {
        // Se a busca falhar (ex: offline) e for navegação de página, retorna index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
