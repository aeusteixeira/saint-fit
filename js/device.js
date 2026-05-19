// Wake Lock + vibração — APIs de dispositivo.
// Wake Lock: mantém a tela acordada durante o treino. Sem isso, o celular bloqueia
// entre séries e o usuário precisa desbloquear pra ver o timer. Suporte: Chrome
// Android/desktop, Safari iOS 16.4+. Sem suporte: degrade silencioso.
// Vibração: navigator.vibrate(ms) ou padrão array. iOS Safari nunca suporta —
// só Android Chrome. Sem suporte: no-op.

let wakeLockSentinel = null;
let wakeLockReleasedListener = null;

export async function acquireWakeLock() {
  if (!('wakeLock' in navigator)) return false;
  try {
    if (wakeLockSentinel) return true; // já temos
    wakeLockSentinel = await navigator.wakeLock.request('screen');
    // Se o usuário trocar de aba, o lock é liberado pelo browser. Re-adquire ao voltar.
    document.addEventListener('visibilitychange', onVisibilityChange);
    return true;
  } catch (err) {
    console.warn('[saintfit] wake lock falhou', err);
    return false;
  }
}

export async function releaseWakeLock() {
  document.removeEventListener('visibilitychange', onVisibilityChange);
  if (!wakeLockSentinel) return;
  try {
    await wakeLockSentinel.release();
  } catch {}
  wakeLockSentinel = null;
}

async function onVisibilityChange() {
  if (document.visibilityState === 'visible' && !wakeLockSentinel) {
    try {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
    } catch {}
  }
}

// ── Vibração
export function vibrate(pattern) {
  if (!('vibrate' in navigator)) return false;
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}

// Padrões pré-definidos pra feedbacks consistentes
export const HAPTIC = {
  tap:        20,           // toque simples
  setDone:    [30, 40, 60], // 3 buzzes curtos: ✓ feito
  restEnd:    [200, 80, 200], // 2 buzzes longos: HORA DE VOLTAR
  warning:    [80, 40, 80],
};
