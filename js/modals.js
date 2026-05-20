// Modal system — overlay + confetti, used by Level Up (08) and Badge (09).
// Modals are queued: showQueue([...modals]) shows them one after another.
import { icon } from './icons.js';
import { LEVELS, BADGES } from './progress-engine.js';

const HOST_ID = 'modal-host';

function ensureHost() {
  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    document.body.appendChild(host);
  }
  return host;
}

function confettiHtml() {
  // Deterministic confetti positions — 32 pieces.
  const colors = ['#7B2FBE', '#2ECC71', '#F0A500', '#FFFFFF', '#FF6B35'];
  let s = 1;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const pieces = [];
  for (let i = 0; i < 36; i++) {
    const x = r() * 100;
    const yStart = -10 - r() * 20;
    const rot = r() * 360;
    const w = 4 + r() * 4;
    const h = 8 + r() * 8;
    const color = colors[Math.floor(r() * colors.length)];
    const shape = r() > 0.5 ? 'rect' : 'circle';
    const delay = r() * 600;
    const dur = 1400 + r() * 1200;
    pieces.push(`<div class="confetti-piece" style="
      left:${x}%;
      top:${yStart}%;
      width:${w}px;
      height:${shape === 'rect' ? h : w}px;
      background:${color};
      border-radius:${shape === 'circle' ? '999px' : '1px'};
      animation: confetti-fall ${dur}ms ${delay}ms cubic-bezier(0.25, 0.5, 0.5, 1) forwards;
      --rot:${rot}deg;
    "></div>`);
  }
  return `<div class="confetti">${pieces.join('')}</div>`;
}

function close(node, cb) {
  node.classList.remove('is-visible');
  setTimeout(() => {
    node.remove();
    cb && cb();
  }, 240);
}

// ─────────────────────────────────────────────────────────────
// Level Up (Screen 08)
// ─────────────────────────────────────────────────────────────
function renderLevelUpModal({ newLevel, totalXp }) {
  const lv = LEVELS.find(l => l.num === newLevel) || LEVELS[0];
  const motivational = motivationalFor(newLevel);

  return `<div class="modal modal--levelup">
    <div class="modal__backdrop"></div>
    ${confettiHtml()}
    <div class="modal__card" style="--accent: var(--sf-primary);">
      <div class="modal__radial"></div>
      <div class="modal__content">
        <div class="modal__badge-pill">
          ${icon('sparkle', { size: 11, color: '#fff', fill: '#fff' })}
          NOVO NÍVEL DESBLOQUEADO
        </div>
        <div class="modal__orb">
          ${icon(lv.icon, { size: 60, color: '#fff', strokeWidth: 1.6 })}
          <div class="modal__orb-ring modal__orb-ring--inner"></div>
          <div class="modal__orb-ring modal__orb-ring--outer"></div>
        </div>
        <div class="modal__title">${lv.name.toUpperCase()}</div>
        <div class="modal__subtitle">Nível ${lv.num} alcançado</div>

        <div class="modal__xp-chip">
          ${icon('sparkle', { size: 13, color: 'var(--sf-accent)', fill: 'var(--sf-accent)' })}
          <span>${totalXp.toLocaleString('pt-BR')} XP acumulados</span>
        </div>

        <div class="modal__divider"></div>

        <div class="modal__quote">"${motivational}"</div>

        <button class="btn btn--primary btn--lg" data-action="dismiss">
          Continuar
          ${icon('arrow-right', { size: 16, color: '#fff' })}
        </button>
      </div>
    </div>
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// Badge (Screen 09)
// ─────────────────────────────────────────────────────────────
function renderBadgeModal({ badge, xpEarned, nextHint }) {
  const date = formatDateBr(new Date());
  const orbColor = badge.color || '#FF6B35';
  return `<div class="modal modal--badge">
    <div class="modal__backdrop"></div>
    ${confettiHtml()}
    <div class="modal__card" style="--accent: var(--sf-secondary); --orb-color: ${orbColor};">
      <div class="modal__radial modal__radial--orange"></div>
      <div class="modal__content">
        <div class="modal__badge-pill modal__badge-pill--green">
          CONQUISTA DESBLOQUEADA
        </div>

        <div class="badge-artwork">
          <div class="badge-artwork__ring badge-artwork__ring--outer"></div>
          <div class="badge-artwork__ring badge-artwork__ring--inner"></div>
          <div class="badge-artwork__orb">
            ${icon(badge.icon, { size: 56, color: '#fff', fill: '#fff', strokeWidth: 0 })}
          </div>
          <span class="badge-artwork__sparkle" style="top:4px; right:14px; width:5px; height:5px;"></span>
          <span class="badge-artwork__sparkle" style="bottom:12px; left:6px; width:3px; height:3px;"></span>
          <span class="badge-artwork__sparkle" style="top:38px; left:-2px; width:3px; height:3px;"></span>
        </div>

        <div class="modal__title" style="font-size:48px;">${badge.label.toUpperCase()}</div>
        <div class="modal__subtitle modal__subtitle--muted">${badge.description || ''}</div>

        <div class="modal__stats">
          <div class="modal__stat">
            <div class="section-label">XP ganho</div>
            <div class="display" style="font-size:22px; color: var(--sf-secondary);">+${xpEarned || 0}</div>
          </div>
          <div class="modal__stat modal__stat--wide">
            <div class="section-label">Desbloqueada em</div>
            <div style="font-size:13.5px; font-weight:700;">${date}</div>
          </div>
        </div>

        <div class="modal__divider"></div>

        ${nextHint ? `<div class="modal__hint">${nextHint}</div>` : ''}

        <button class="btn btn--success btn--lg" data-action="dismiss">
          Incrível!
          ${icon('arrow-right', { size: 16, color: '#fff' })}
        </button>
      </div>
    </div>
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// Public: show one modal, return a Promise that resolves when dismissed.
// ─────────────────────────────────────────────────────────────
export function showLevelUp(data) {
  return showModalHtml(renderLevelUpModal(data));
}

export function showBadge(data) {
  // Enrich data with description + next hint
  const description = BADGE_DESCRIPTIONS[data.badge.slug] || '';
  const nextHint = nextBadgeHint(data.badge.slug);
  return showModalHtml(renderBadgeModal({ ...data, badge: { ...data.badge, description }, nextHint }));
}

// ─────────────────────────────────────────────────────────────
// Generic ephemeral toast. Variant 'error' uses an alert tint.
// ─────────────────────────────────────────────────────────────
export function showToast(message, opts = {}) {
  const { variant = 'info', durationMs = 3200 } = opts;
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = `toast${variant === 'error' ? ' toast--error' : ''}`;
  t.setAttribute('role', variant === 'error' ? 'alert' : 'status');
  t.innerHTML = `<div class="toast__line" style="margin-top:0;">${message}</div>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('is-visible'));
  setTimeout(() => { t.classList.remove('is-visible'); setTimeout(() => t.remove(), 220); }, durationMs);
}

// Queue version
export async function showQueue(modals) {
  for (const m of modals) {
    if (m.type === 'levelup') await showLevelUp(m);
    else if (m.type === 'badge') await showBadge(m);
  }
}

// ─────────────────────────────────────────────────────────────
// Video modal — embeds a YouTube tutorial inside an iframe.
// Falls back to opening the URL in a new tab if it can't be embedded
// (e.g. when the URL is a YouTube search results page).
// ─────────────────────────────────────────────────────────────
function youtubeEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (!/youtube\.com$/.test(u.hostname) && u.hostname !== 'youtu.be') return null;
    let id = null;
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
    else if (u.pathname === '/watch') id = u.searchParams.get('v');
    else if (u.pathname.startsWith('/embed/')) id = u.pathname.slice(7);
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// About modal — informação sobre o app + aviso de acompanhamento profissional.
// ─────────────────────────────────────────────────────────────
export function showAbout() {
  return new Promise((resolve) => {
    const host = ensureHost();
    const html = `<div class="modal modal--about">
      <div class="modal__backdrop"></div>
      <div class="modal__about-card">
        <div class="modal__about-header">
          <span class="modal__about-title">Sobre o Saint Fit</span>
          <button class="modal__video-close" data-action="dismiss" aria-label="Fechar">
            ${icon('x', { size: 18, color: '#fff', strokeWidth: 2 })}
          </button>
        </div>
        <div class="modal__about-body">
          <div class="modal__about-section">
            <div class="modal__about-section-title">${icon('dumbbell', { size: 14, color: 'var(--sf-primary)' })} Por que existe</div>
            <p>Este app nasceu da realidade da academia do prédio: poucos equipamentos e espaço limitado. A ideia é organizar e dar variedade ao seu treino aproveitando ao máximo o que está disponível ali — sem precisar inventar a cada dia.</p>
          </div>

          <div class="modal__about-section">
            <div class="modal__about-section-title">${icon('list', { size: 14, color: 'var(--sf-primary)' })} O que ele faz</div>
            <p>Monta um plano ABC com base no seu objetivo, tempo disponível e limitações físicas. Acompanha XP, streak, conquistas e mostra vídeos de execução pra cada exercício.</p>
          </div>

          <div class="modal__about-section modal__about-section--warning">
            <div class="modal__about-section-title">${icon('alert', { size: 14, color: 'var(--sf-accent)' })} Aviso importante</div>
            <p>Este app é uma ferramenta de organização — <strong>não substitui orientação profissional</strong>. Pra resultados de verdade e principalmente pra evitar lesão, procure um educador físico ou personal trainer. O acompanhamento profissional faz toda a diferença, ainda mais se você tem alguma limitação (joelho, coluna, ombro).</p>
            <p>Sempre escute seu corpo. Dor não é "fazer feio" — é sinal pra parar.</p>
          </div>
        </div>
      </div>
    </div>`;
    host.insertAdjacentHTML('beforeend', html);
    const node = host.lastElementChild;
    requestAnimationFrame(() => node.classList.add('is-visible'));

    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    const dismiss = () => {
      document.removeEventListener('keydown', onKey);
      close(node, resolve);
    };
    document.addEventListener('keydown', onKey);
    node.querySelector('[data-action="dismiss"]').addEventListener('click', dismiss);
    node.querySelector('.modal__backdrop').addEventListener('click', dismiss);
  });
}

// ─────────────────────────────────────────────────────────────
// Workout summary modal — tela de resumo no fim do treino.
// ─────────────────────────────────────────────────────────────
function formatDuration(sec) {
  if (!sec || sec < 0) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}min`;
  if (m > 0) return `${m}min ${String(s).padStart(2, '0')}s`;
  return `${s}s`;
}

export function showWorkoutSummary({ workout, session, result, durationSec }) {
  return new Promise((resolve) => {
    const totalSets = workout.exercises.reduce((s, e) => s + e.sets, 0);
    const setsDone = session.completed.reduce((s, c) => s + (c.setsDone || 0), 0);
    const skipped = session.completed.filter(c => c.skipped).length;
    const exDone = session.completed.filter((c, i) => c.setsDone >= workout.exercises[i].sets).length;
    // Volume = soma(peso × reps × séries) por exercício
    const volume = session.completed.reduce((acc, c, i) => {
      const ex = workout.exercises[i];
      if (!c.weight || c.skipped) return acc;
      const reps = typeof ex.reps === 'number' ? ex.reps : 0;
      return acc + (c.weight * reps * c.setsDone);
    }, 0);

    const host = ensureHost();
    const html = `<div class="modal modal--summary">
      <div class="modal__backdrop"></div>
      ${confettiHtml()}
      <div class="modal__summary-card">
        <div class="modal__summary-header">
          <div class="modal__summary-badge">
            ${icon('check', { size: 12, color: '#000', strokeWidth: 3 })}
            TREINO CONCLUÍDO
          </div>
          <div class="modal__summary-title">TREINO ${workout.id}</div>
          <div class="modal__summary-sub">${workout.focus}</div>
        </div>

        <div class="modal__summary-xp">
          <span class="modal__summary-xp-num">+${result.xpEarned}</span>
          <span class="modal__summary-xp-label">XP ganhos</span>
        </div>

        <div class="modal__summary-grid">
          <div class="modal__summary-stat">
            <div class="modal__summary-stat-icon">${icon('clock', { size: 16, color: 'var(--sf-text-muted)' })}</div>
            <div class="modal__summary-stat-val">${formatDuration(durationSec)}</div>
            <div class="modal__summary-stat-label">Tempo</div>
          </div>
          <div class="modal__summary-stat">
            <div class="modal__summary-stat-icon">${icon('dumbbell', { size: 16, color: 'var(--sf-text-muted)' })}</div>
            <div class="modal__summary-stat-val">${volume > 0 ? `${volume.toLocaleString('pt-BR')} kg` : '—'}</div>
            <div class="modal__summary-stat-label">Volume</div>
          </div>
          <div class="modal__summary-stat">
            <div class="modal__summary-stat-icon">${icon('check', { size: 16, color: 'var(--sf-text-muted)', strokeWidth: 2.5 })}</div>
            <div class="modal__summary-stat-val">${setsDone}/${totalSets}</div>
            <div class="modal__summary-stat-label">Séries</div>
          </div>
          <div class="modal__summary-stat">
            <div class="modal__summary-stat-icon">${icon('list', { size: 16, color: 'var(--sf-text-muted)' })}</div>
            <div class="modal__summary-stat-val">${exDone}${skipped > 0 ? ` · ${skipped} ${icon('alert', { size: 11, color: 'var(--sf-accent)' })}` : ''}</div>
            <div class="modal__summary-stat-label">${skipped > 0 ? 'Feitos · pulados' : 'Exercícios'}</div>
          </div>
        </div>

        ${result.fullyCompleted ? `
          <div class="modal__summary-bonus">
            ${icon('sparkle', { size: 14, color: 'var(--sf-accent)', fill: 'var(--sf-accent)' })}
            Treino 100% concluído — bônus de XP aplicado
          </div>` : ''}

        <button class="btn btn--primary btn--lg" data-action="dismiss">
          Continuar
          ${icon('arrow-right', { size: 16, color: '#fff' })}
        </button>
      </div>
    </div>`;
    host.insertAdjacentHTML('beforeend', html);
    const node = host.lastElementChild;
    requestAnimationFrame(() => node.classList.add('is-visible'));

    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    const dismiss = () => {
      document.removeEventListener('keydown', onKey);
      close(node, resolve);
    };
    document.addEventListener('keydown', onKey);
    node.querySelector('[data-action="dismiss"]').addEventListener('click', dismiss);
    node.querySelector('.modal__backdrop').addEventListener('click', dismiss);
  });
}

// ─────────────────────────────────────────────────────────────
// Release note modal — anúncio one-shot ao abrir o app.
// Resolve com a action escolhida (primaryAction string ou null se dispensou).
// ─────────────────────────────────────────────────────────────
export function showReleaseNote(note) {
  return new Promise((resolve) => {
    const host = ensureHost();
    const html = `<div class="modal modal--release">
      <div class="modal__backdrop"></div>
      <div class="modal__release-card">
        <div class="modal__release-icon">${note.icon || '✨'}</div>
        <div class="modal__release-tag">Novidade</div>
        <h2 class="modal__release-title">${note.title}</h2>
        <p class="modal__release-body">${note.body}</p>
        ${note.reassurance ? `
          <div class="modal__release-reassurance">
            ${icon('check', { size: 14, color: 'var(--sf-secondary)', strokeWidth: 2.5 })}
            <span>${note.reassurance}</span>
          </div>` : ''}
        <div class="modal__release-actions">
          <button class="btn btn--primary btn--lg" data-action="primary">
            ${note.primaryCta || 'Continuar'}
            ${icon('arrow-right', { size: 16, color: '#fff' })}
          </button>
          ${note.secondaryCta ? `
            <button class="btn-link" data-action="dismiss">${note.secondaryCta}</button>
          ` : ''}
        </div>
      </div>
    </div>`;
    host.insertAdjacentHTML('beforeend', html);
    const node = host.lastElementChild;
    requestAnimationFrame(() => node.classList.add('is-visible'));

    const finish = (action) => {
      document.removeEventListener('keydown', onKey);
      close(node, () => resolve(action));
    };
    const onKey = (e) => { if (e.key === 'Escape') finish(null); };
    document.addEventListener('keydown', onKey);

    node.querySelector('[data-action="primary"]').addEventListener('click', () => finish(note.primaryAction || 'primary'));
    node.querySelector('[data-action="dismiss"]')?.addEventListener('click', () => finish(null));
    node.querySelector('.modal__backdrop').addEventListener('click', () => finish(null));
  });
}

export function showVideo({ title, url }) {
  const embed = youtubeEmbedUrl(url);
  if (!embed) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const host = ensureHost();
    const html = `<div class="modal modal--video">
      <div class="modal__backdrop"></div>
      <div class="modal__video-card">
        <div class="modal__video-header">
          <span class="modal__video-title">${title || 'Vídeo do exercício'}</span>
          <button class="modal__video-close" data-action="dismiss" aria-label="Fechar">
            ${icon('x', { size: 18, color: '#fff', strokeWidth: 2 })}
          </button>
        </div>
        <div class="modal__video-frame">
          <iframe
            src="${embed}"
            title="${title || 'Vídeo do exercício'}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </div>`;
    host.insertAdjacentHTML('beforeend', html);
    const node = host.lastElementChild;
    requestAnimationFrame(() => node.classList.add('is-visible'));

    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    const dismiss = () => {
      document.removeEventListener('keydown', onKey);
      close(node, resolve);
    };
    document.addEventListener('keydown', onKey);
    node.querySelector('[data-action="dismiss"]').addEventListener('click', dismiss);
    node.querySelector('.modal__backdrop').addEventListener('click', dismiss);
  });
}

function showModalHtml(html) {
  return new Promise((resolve) => {
    const host = ensureHost();
    host.insertAdjacentHTML('beforeend', html);
    const node = host.lastElementChild;
    // Trigger transition next frame.
    requestAnimationFrame(() => node.classList.add('is-visible'));

    const dismiss = () => close(node, resolve);
    node.querySelector('[data-action="dismiss"]').addEventListener('click', dismiss);
    node.querySelector('.modal__backdrop').addEventListener('click', dismiss);
  });
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function motivationalFor(level) {
  return {
    2: 'Você passou da primeira barreira — a inércia. Daqui pra frente, é constância.',
    3: 'Três níveis. O treino virou parte do seu dia.',
    4: 'Atleta de verdade. Continue puxando a barra.',
    5: 'Você treinou quando não estava com vontade. Isso é o que separa os que chegam dos que desistem.',
    6: 'Elite. Poucos chegam aqui. Mantenha o ritmo.',
    7: 'Mestre. O treino agora é meditação.',
    8: 'Lendário. Você é a inspiração da academia.',
  }[level] || 'Cada nível é uma decisão repetida. Continue.';
}

const BADGE_DESCRIPTIONS = {
  estreante:       'Seu primeiro treino concluído.',
  resistente:      '5 treinos no histórico. Tá pegando ritmo.',
  em_chamas:       '7 dias consecutivos de treino.',
  primeira_semana: 'Semana inteira de treinos completados.',
  subiu_nivel:     'Você subiu de nível pela primeira vez.',
  morador_ativo:   '30 treinos na academia do condomínio.',
  relampago:       'Treino concluído em menos de 30 minutos.',
};

function nextBadgeHint(currentSlug) {
  const order = [
    { slug: 'estreante',       next: 'Resistente',      tip: 'Faça mais {n} treinos para desbloquear' },
    { slug: 'resistente',      next: 'Morador Ativo',   tip: 'Continue treinando para desbloquear' },
    { slug: 'em_chamas',       next: 'Imparável',       tip: 'Continue treinando por mais {n} dias para desbloquear' },
  ];
  const found = order.find(o => o.slug === currentSlug);
  if (!found) return '';
  return found.tip.replace('{n}', '8') + ` <span style="color: var(--sf-text); font-weight: 600;">${found.next}</span>.`;
}

function formatDateBr(d) {
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
