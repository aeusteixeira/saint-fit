// Entry point — registers routes, decides initial destination.
// Importa pwa-install primeiro pra garantir que o listener de beforeinstallprompt
// está registrado antes do navegador disparar o evento.
import './pwa-install.js';
import { hasProfile } from './state.js';
import { registerRoute, start } from './router.js';
import { renderHome } from './screens/home.js';
import { renderWorkout } from './screens/workout.js';
import { renderProgress } from './screens/progress.js';
import { renderOnboarding } from './screens/onboarding.js';
import { renderPlans } from './screens/plans.js';
import { renderEquipment } from './screens/equipment.js';
import { renderProfile } from './screens/profile.js';
import { showToast } from './modals.js';

// Surface storage failures (cota cheia, modo privado, etc.) — caso contrário
// o app continuaria parecendo que salvou.
document.addEventListener('saintfit:storage-error', () => {
  showToast('Não foi possível salvar. Verifique o espaço do dispositivo.', { variant: 'error', durationMs: 4200 });
});

registerRoute('#/onboarding', renderOnboarding, { navId: null, hideNav: true });
registerRoute('#/',           renderHome,       { navId: 'home' });
registerRoute('#/workout',    renderWorkout,    { navId: 'workout' });
registerRoute('#/plans',      renderPlans,      { navId: 'plans' });
registerRoute('#/equip',      renderEquipment,  { navId: 'equip' });
registerRoute('#/progress',   renderProgress,   { navId: 'progress' });
registerRoute('#/profile',    renderProfile,    { navId: 'profile' });

// First-run: route to onboarding if there's no profile.
const initialRoute = hasProfile() ? '#/' : '#/onboarding';

start({
  view: document.getElementById('view'),
  nav: document.getElementById('bottom-nav'),
  fallback: initialRoute,
  guard: (path) => {
    // If user tries to navigate elsewhere without profile, force onboarding.
    if (!hasProfile() && path !== '#/onboarding') return '#/onboarding';
    return null;
  },
});

// Register service worker (PWA shell).
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
