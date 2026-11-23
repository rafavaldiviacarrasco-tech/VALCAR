/* Service worker · Intervalo — funcionamiento 100 % offline */
const VERSION = 'v19';
const CACHE = 'intervalo-' + VERSION;
const ASSETS = [
  './', './index.html', './styles.css', './app.js', './scene.js', './photos.js', './manifest.webmanifest',
  './photos/winter-1.webp', './photos/winter-2.webp', './photos/winter-3.webp', './photos/winter-4.webp', './photos/winter-5.webp', './photos/winter-6.webp', './photos/spring-1.webp', './photos/spring-2.webp', './photos/spring-3.webp', './photos/spring-4.webp', './photos/spring-5.webp', './photos/summer-1.webp', './photos/summer-2.webp', './photos/summer-3.webp', './photos/summer-4.webp', './photos/summer-5.webp', './photos/summer-6.webp', './photos/autumn-1.webp', './photos/autumn-2.webp', './photos/autumn-3.webp', './photos/autumn-4.webp', './photos/autumn-5.webp', './photos/autumn-6.webp', './photos/autumn-7.webp',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('intervalo-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // Navegación: siempre devuelve la app desde caché si no hay red
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then(hit => hit || fetch(req)).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Resto: caché primero, y se refresca en segundo plano
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
