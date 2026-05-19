// Detecção de instalação PWA + captura do prompt de instalação.
// Tem que rodar cedo no boot (importado em app.js) pra pegar o
// beforeinstallprompt — o navegador dispara só uma vez na carga.

let deferredPrompt = null;
const listeners = new Set();

window.addEventListener('beforeinstallprompt', (e) => {
  // Impede o mini-infobar padrão; guardamos pra disparar via botão custom.
  e.preventDefault();
  deferredPrompt = e;
  emit();
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  emit();
});

function emit() {
  listeners.forEach(fn => { try { fn(); } catch {} });
}

export function isStandalone() {
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  // iOS Safari legacy
  if (window.navigator.standalone === true) return true;
  return false;
}

export function isIos() {
  const ua = window.navigator.userAgent || '';
  return /iPhone|iPad|iPod/i.test(ua) && !window.MSStream;
}

export function isAndroid() {
  return /Android/i.test(window.navigator.userAgent || '');
}

export function canPromptInstall() {
  return !!deferredPrompt;
}

export async function promptInstall() {
  if (!deferredPrompt) return { outcome: 'unavailable' };
  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;
  if (result.outcome === 'accepted') {
    deferredPrompt = null;
    emit();
  }
  return result;
}

export function onInstallStateChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
