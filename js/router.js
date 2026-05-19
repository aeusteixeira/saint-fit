// Hash-based router. Maps `#/<route>` to a render function.

import { bottomNav, NAV_ITEMS } from './components.js';

const routes = new Map();
let viewEl = null;
let navEl = null;
let currentCleanup = null;
let guardFn = null;

export function registerRoute(path, render, opts = {}) {
  routes.set(path, { render, navId: opts.navId ?? null, hideNav: !!opts.hideNav });
}

export function start({ view, nav, fallback = '#/', guard = null }) {
  viewEl = view;
  navEl = nav;
  guardFn = guard;
  window.addEventListener('hashchange', dispatch);
  if (!window.location.hash || !routes.has(window.location.hash)) {
    window.location.hash = fallback;
  } else {
    dispatch();
  }
}

function dispatch() {
  const rawHash = window.location.hash || '#/';
  // Separa rota base da query string — `#/workout?id=C` → path: `#/workout`.
  const qIdx = rawHash.indexOf('?');
  const path = qIdx >= 0 ? rawHash.slice(0, qIdx) : rawHash;

  if (guardFn) {
    const redirect = guardFn(path);
    if (redirect && redirect !== path) {
      window.location.hash = redirect;
      return; // hashchange will re-fire dispatch
    }
  }

  const route = routes.get(path) || routes.get('#/');
  if (!route) return;

  if (typeof currentCleanup === 'function') {
    try { currentCleanup(); } catch {}
    currentCleanup = null;
  }

  viewEl.innerHTML = '';
  try {
    const result = route.render(viewEl);
    if (typeof result === 'function') currentCleanup = result;
  } catch (err) {
    console.error('[saintfit] render falhou', { path, err });
    viewEl.innerHTML = `<div class="screen screen--centered">
      <div style="font-family: var(--sf-display); font-size: 32px; letter-spacing: 1.5px; margin-bottom: 8px;">OPS…</div>
      <p style="color: var(--sf-text-muted); font-size: 13.5px; margin-bottom: 22px; max-width: 280px; margin-left:auto; margin-right:auto;">
        Não foi possível carregar essa tela. Pode ser um dado corrompido — volte ao início e tente de novo.
      </p>
      <a class="btn btn--primary" href="#/">Voltar ao início</a>
    </div>`;
  }

  if (route.hideNav) {
    navEl.innerHTML = '';
    navEl.style.display = 'none';
  } else {
    navEl.style.display = '';
    navEl.innerHTML = bottomNav(route.navId);
  }

  viewEl.scrollTop = 0;
  window.scrollTo({ top: 0 });
}

export function navigate(hash) {
  if (window.location.hash === hash) {
    dispatch();
  } else {
    window.location.hash = hash;
  }
}

export function routeForNav(id) {
  const item = NAV_ITEMS.find(n => n.id === id);
  return item ? item.route : '#/';
}
