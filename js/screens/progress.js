// Screen 07 — Gamificação / Minha Evolução
import { icon } from '../icons.js';
import { getProgress } from '../state.js';
import { LEVELS, BADGES, levelInfo } from '../progress-engine.js';

// Visual color override for badges that should look gray when locked.
const BADGE_DISPLAY_COLORS = {
  estreante: '#7CBF8F',
  resistente: '#2ECC71',
  em_chamas: '#FF6B35',
  primeira_semana: '#3A86FF',
  subiu_nivel: '#7B2FBE',
  morador_ativo: '#F0A500',
  relampago: '#FFD93D',
  sem_desculpas: '#888',
  elite: '#888',
  mestre: '#888',
  lendario: '#888',
  meia_tonelada: '#888',
};

function streakQuote(n) {
  if (n <= 0) return 'Cada começo conta. Comece hoje.';
  if (n === 1) return 'Primeiro dia. O resto é repetir.';
  if (n < 5)   return `${capitalize(numWord(n))} dias. Tá pegando ritmo.`;
  if (n < 10)  return `${capitalize(numWord(n))} dias. Já virou rotina.`;
  if (n < 20)  return `${capitalize(numWord(n))} dias. O hábito já é seu.`;
  return `${capitalize(numWord(n))} dias. Disciplina vira identidade.`;
}

function numWord(n) {
  const w = ['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove','vinte'];
  return w[n] || String(n);
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function formatXp(n) {
  return n.toLocaleString('pt-BR');
}

function levelHero(p) {
  const info = levelInfo(p.totalXp, p.currentLevel);
  const lv = info.current;
  return `<div class="level-hero">
    <div class="level-hero__glow"></div>
    <div class="level-hero__inner">
      <div class="level-hero__label">Nível Atual</div>
      <div class="level-hero__orb">
        ${icon(lv.icon, { size: 42, color: '#fff', strokeWidth: 1.6 })}
      </div>
      <div class="level-hero__title">${lv.name.toUpperCase()}</div>
      <div class="level-hero__sub">Nível ${lv.num} · ${formatXp(p.totalXp)} XP</div>

      <div class="xp-bar">
        <div class="xp-bar__row">
          <span class="muted">${formatXp(p.totalXp)} / ${info.ceil ? formatXp(info.ceil) : '∞'} XP</span>
          ${info.next ? `<span class="xp-bar__next">próximo: ${info.next.name.toUpperCase()}</span>` : `<span class="xp-bar__next">MÁXIMO</span>`}
        </div>
        <div class="xp-bar__track">
          <div class="xp-bar__fill" style="width:${info.pct}%"></div>
        </div>
        ${info.remaining > 0
          ? `<div class="xp-bar__remaining">faltam ${formatXp(info.remaining)} XP</div>`
          : ''}
      </div>
    </div>
  </div>`;
}

function streakCard(p) {
  const cells = (p.streakDays || []).map(s => {
    const cls = s === 1 ? 'is-done' : s === 2 ? 'is-today' : '';
    return `<div class="streak-cell ${cls}"></div>`;
  }).join('');
  return `<div class="card card--p-18 streak-card">
    <div class="streak-card__glow"></div>
    <div class="streak-card__inner">
      <div class="streak-card__count">
        <span class="display">${p.streak}</span>
        ${icon('flame', { size: 26, color: 'var(--sf-accent)', fill: 'var(--sf-accent)', strokeWidth: 1.5 })}
      </div>
      <div class="streak-card__label">dias seguidos</div>
      <div class="streak-card__quote">"${streakQuote(p.streak)}"</div>
      <div class="streak-calendar">${cells}</div>
      <div class="streak-card__legend">
        <span>14 dias atrás</span><span>hoje</span>
      </div>
    </div>
  </div>`;
}

function badgeCard(b, unlocked) {
  const isLocked = !unlocked;
  const c = isLocked ? '#888' : (BADGE_DISPLAY_COLORS[b.slug] || b.color);
  return `<div class="badge${isLocked ? ' is-locked' : ''}">
    <div class="badge__orb" style="${isLocked ? '' : `background:${c}22; border-color:${c}88; box-shadow: 0 0 18px ${c}33;`}">
      ${icon(isLocked ? 'lock' : b.icon, { size: 24, color: isLocked ? '#3A3A3A' : c, strokeWidth: isLocked ? 1.6 : 1.8 })}
    </div>
    <span class="badge__label">${b.label}</span>
  </div>`;
}

function achievementsCard(unlockedSet) {
  return `<div class="row row--between row--baseline" style="margin-bottom: 12px;">
    <span class="display" style="font-size:22px; letter-spacing:1.5px;">CONQUISTAS</span>
    <span style="font-size:12px; font-weight:600; color:var(--sf-text-muted);">
      <span style="color:var(--sf-secondary);">${unlockedSet.size}</span> / 20
    </span>
  </div>
  <div class="card">
    <div class="achievements-grid">
      ${BADGES.map(b => badgeCard(b, unlockedSet.has(b.slug))).join('')}
    </div>
  </div>`;
}

function xpHistory(events) {
  if (!events.length) return '';
  return `<span class="display" style="font-size:22px; letter-spacing:1.5px; display:block; margin: 24px 0 12px;">HISTÓRICO DE XP</span>
  <div class="card card--p-0 xp-history">
    ${events.map(h => `<div class="xp-event">
      <div class="xp-event__avatar" style="background:${h.color}1A; border:1px solid ${h.color}55;">
        ${icon(h.icon, { size: 15, color: h.color })}
      </div>
      <div class="xp-event__body">
        <div class="xp-event__label">${h.label}</div>
        <div class="xp-event__date">${h.date}</div>
      </div>
      <span class="xp-event__value">+${h.xp}</span>
    </div>`).join('')}
  </div>`;
}

export function renderProgress(root) {
  const p = getProgress();
  const unlocked = new Set(p.unlockedBadges || []);
  root.innerHTML = `<div class="screen">
    <div style="margin-top: 16px; margin-bottom: 22px;">
      <span class="display" style="font-size:42px; letter-spacing:2px;">MINHA EVOLUÇÃO</span>
    </div>
    ${levelHero(p)}
    <div style="height:16px;"></div>
    ${streakCard(p)}
    <div style="height:16px;"></div>
    ${achievementsCard(unlocked)}
    ${xpHistory(p.xpEvents || [])}
  </div>`;
}
