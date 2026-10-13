/* Falamigo — Service Worker básico (offline-first para o site institucional) */
var CACHE = 'falamigo-v1';
var PRECACHE = [
  '/',
  '/index.html',
  '/baixar.html',
  '/privacidade.html',
  '/contato.html',
  '/css/style.css',
  '/js/main.js',
  '/manifest.webmanifest'
];
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(PRECACHE); })
  );
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    })
  );
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (cache) { cache.put(e.request, copy); });
        return resp;
      }).catch(function () { return cached; });
    })
  );
});
