// Saint Fit — service worker (offline shell).
//
// Estratégia:
//   - HTML/JS/CSS  → network-first. Sempre busca o novo; cai pro cache só offline.
//                    Garante que deploys novos aparecem no próximo reload sem
//                    precisar bumpar manualmente a versão do cache a cada push.
//   - Imagens/fontes → cache-first. Não mudam, vale priorizar velocidade.
//
// Quando precisar invalidar tudo (ex: mudou estrutura do manifest), bump CACHE.
const CACHE = 'saintfit-shell-v5';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
  // Imagens de equipamentos
  './assets/equipment/cable-crossover.png',
  './assets/equipment/leg-machine.png',
  './assets/equipment/bench.png',
  './assets/equipment/dumbbells.png',
  './assets/equipment/vibration-platform.png',
  './assets/equipment/resistance-bands.png',
  './assets/equipment/treadmill.jpg',
  './assets/equipment/bike.jpg',
  './assets/equipment/colchonete.webp',
  // CSS
  './styles/tokens.css',
  './styles/base.css',
  './styles/components.css',
  './styles/screens.css',
  // JS
  './js/app.js',
  './js/router.js',
  './js/state.js',
  './js/components.js',
  './js/icons.js',
  './js/modals.js',
  './js/plan-generator.js',
  './js/progress-engine.js',
  './js/equipment-catalog.js',
  './js/exercise-videos.js',
  './js/pwa-install.js',
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

// Network-first: tenta rede, atualiza cache, cai pro cache se falhar.
function networkFirst(req) {
  return fetch(req)
    .then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    })
    .catch(() =>
      caches.match(req).then((hit) => hit || caches.match('./index.html'))
    );
}

// Cache-first: serve do cache se tiver; senão busca e cacheia.
function cacheFirst(req) {
  return caches.match(req).then((hit) =>
    hit || fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => hit)
  );
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Same-origin: HTML/JS/CSS via network-first; imagens via cache-first.
  if (url.origin === self.location.origin) {
    const isCode = /\.(?:js|css|html|webmanifest)$/.test(url.pathname) || url.pathname === '/' || url.pathname.endsWith('/');
    event.respondWith(isCode ? networkFirst(req) : cacheFirst(req));
    return;
  }

  // Google Fonts — cache-first (raramente mudam).
  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(req));
  }
});
