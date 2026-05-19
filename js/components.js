// Reusable render helpers (return HTML strings).
import { icon } from './icons.js';

export const NAV_ITEMS = [
  { id: 'home',     route: '#/',         icon: 'home',     label: 'Início' },
  { id: 'workout',  route: '#/workout',  icon: 'dumbbell', label: 'Treino' },
  { id: 'plans',    route: '#/plans',    icon: 'list',     label: 'Planos' },
  { id: 'equip',    route: '#/equip',    icon: 'grid',     label: 'Equip.' },
  { id: 'progress', route: '#/progress', icon: 'trophy',   label: 'Evolução' },
  { id: 'profile',  route: '#/profile',  icon: 'user',     label: 'Perfil' },
];

export function bottomNav(activeId) {
  return NAV_ITEMS.map(it => {
    const isActive = it.id === activeId;
    return `<a href="${it.route}" class="bottom-nav__item${isActive ? ' is-active' : ''}" data-nav="${it.id}">
      ${icon(it.icon, { size: 20, color: isActive ? 'var(--sf-primary)' : 'var(--sf-text-muted)' })}
      <span>${it.label}</span>
    </a>`;
  }).join('');
}

// Greeting based on local hour.
export function greetingFor(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// "Segunda · 18 mai"
const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS_ABBR = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export function formatDateLong(date = new Date()) {
  return `${WEEKDAYS[date.getDay()]} · ${date.getDate()} ${MONTHS_ABBR[date.getMonth()]}`;
}
