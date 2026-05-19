// Saint Fit — service worker (offline shell).
const CACHE = 'saintfit-shell-v4';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
  './assets/equipment/cable-crossover.png',
  './assets/equipment/leg-machine.png',
  './assets/equipment/bench.png',
  './assets/equipment/dumbbells.png',
  './assets/equipment/vibration-platform.png',
  './assets/equipment/resistance-bands.png',
  './assets/equipment/treadmill.jpg',
  './assets/equipment/bike.jpg',
  './styles/tokens.css',
  './styles/base.css',
  './styles/components.css',
  './styles/screens.css',
  './js/app.js',
  './js/router.js',
  './js/state.js',
  './js/components.js',
  './js/icons.js',
  './js/modals.js',
  './js/plan-generator.js',
  './js/progress-engine.js',
  './js/equipment-catalog.js',
  './js/screens/home.js',
  './js/screens/workout.js',
  './js/screens/progress.js',
  './js/screens/onboarding.js',
  './js/screens/plans.js',
  './js/screens/equipment.js',
  './js/screens/profile.js',
  './js/screens/placeholder.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        if (res.ok) caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match('./index.html')))
    );
    return;
  }

  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        if (res.ok) caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req)))
    );
  }
});
