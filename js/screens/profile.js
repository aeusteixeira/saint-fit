// Screen 06 — Perfil
import { icon } from '../icons.js';
import { getProfile, getProgress, wipeAll, setPlan } from '../state.js';
import { LEVELS } from '../progress-engine.js';
import { generatePlan } from '../plan-generator.js';
import { showAbout } from '../modals.js';
import { isStandalone, isIos, canPromptInstall, promptInstall, onInstallStateChange } from '../pwa-install.js';

const GOAL_LABEL = { lose: 'Emagrecer', gain: 'Ganhar massa', condition: 'Condicionamento' };
const LEVEL_LABEL = { beginner: 'Iniciante', returning: 'Voltando', intermediate: 'Intermediário' };
const LIMIT_LABEL = { knee: 'Joelho', spine: 'Coluna', shoulder: 'Ombro' };
const DAY_LABEL = { mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui', fri: 'Sex', sat: 'Sáb', sun: 'Dom' };

function dataRow(label, value) {
  return `<div class="profile-row">
    <span class="profile-row__label">${label}</span>
    <span class="profile-row__value">${value}</span>
  </div>`;
}

function installCard() {
  if (isStandalone()) {
    return `<div class="install-banner install-banner--installed">
      <div class="install-banner__icon" style="background: rgba(46,204,113,0.18);">
        ${icon('check', { size: 18, color: 'var(--sf-secondary)', strokeWidth: 2.5 })}
      </div>
      <div class="install-banner__body">
        <div class="install-banner__title">App instalado</div>
        <div class="install-banner__sub">Você já está usando o Saint Fit no modo aplicativo.</div>
      </div>
    </div>`;
  }
  if (canPromptInstall()) {
    return `<div class="install-banner install-banner--prompt">
      <div class="install-banner__icon">${icon('sparkle', { size: 18, color: 'var(--sf-primary)', fill: 'var(--sf-primary)' })}</div>
      <div class="install-banner__body">
        <div class="install-banner__title">Instale o Saint Fit</div>
        <div class="install-banner__sub">Acesso offline, abertura rápida direto da tela inicial.</div>
      </div>
      <button class="install-banner__btn" data-action="install">Instalar</button>
    </div>`;
  }
  if (isIos()) {
    return `<div class="install-banner install-banner--ios">
      <div class="install-banner__icon">📱</div>
      <div class="install-banner__body">
        <div class="install-banner__title">Adicione à tela de início</div>
        <div class="install-banner__sub">Toque em <strong>Compartilhar</strong> e depois <strong>Adicionar à Tela de Início</strong>.</div>
      </div>
    </div>`;
  }
  return '';
}

export function renderProfile(root) {
  const profile = getProfile();
  const progress = getProgress();
  if (!profile) return;

  const lv = LEVELS.find(l => l.num === progress.currentLevel) || LEVELS[0];
  const initial = (profile.shortName || profile.name).charAt(0).toUpperCase();
  const days = profile.days.map(d => DAY_LABEL[d]).join(' · ') || '—';
  const limitations = (profile.limitations && profile.limitations.length)
    ? profile.limitations.map(l => LIMIT_LABEL[l]).join(', ')
    : 'Nenhuma';

  root.innerHTML = `<div class="screen">
    <div style="margin-top: 16px;">
      <span class="display" style="font-size:42px; letter-spacing:2px;">MEU PERFIL</span>
    </div>

    <div class="card card--p-18 identity-card" style="margin-top: 20px;">
      <div class="identity-card__row">
        <div class="identity-avatar">${initial}</div>
        <div class="identity-card__body">
          <div class="identity-card__name">${profile.name}</div>
          <div class="identity-card__sub">${profile.apartment || 'Saint Simon'}</div>
          <div style="margin-top: 8px;">
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${(Array.isArray(profile.goal) ? profile.goal : [profile.goal]).filter(Boolean).map(g => `
                <span class="pill" style="background: var(--sf-primary-soft); color: var(--sf-primary); text-transform:uppercase;">
                  ${GOAL_LABEL[g] || g}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-snapshot" style="margin-top: 14px;">
      <div class="card card--p-18">
        <div class="section-label">Nível</div>
        <div class="profile-stat" style="margin-top:8px;">
          ${icon(lv.icon, { size: 18, color: lv.color })}
          <span class="display" style="font-size:18px; letter-spacing:1.5px;">${lv.name.toUpperCase()}</span>
        </div>
        <div class="muted" style="font-size:11.5px; margin-top:2px;">${progress.totalXp.toLocaleString('pt-BR')} XP</div>
      </div>
      <div class="card card--p-18">
        <div class="section-label">Streak</div>
        <div class="profile-stat" style="margin-top:8px;">
          ${icon('flame', { size: 18, color: 'var(--sf-accent)', fill: 'var(--sf-accent)', strokeWidth: 1.5 })}
          <span class="display" style="font-size:18px; letter-spacing:1px;">${progress.streak} DIAS</span>
        </div>
        <div class="muted" style="font-size:11.5px; margin-top:2px;">recorde: ${progress.longestStreak}d</div>
      </div>
    </div>

    <div class="card card--p-0" style="margin-top: 14px;">
      ${dataRow('Peso',              `${profile.weight} kg`)}
      ${dataRow('Nível',             LEVEL_LABEL[profile.level] || profile.level)}
      ${dataRow('Dias de treino',    days)}
      ${dataRow('Tempo por treino',  `${profile.duration} min`)}
      ${dataRow('Limitações',        limitations)}
    </div>

    <div class="install-card-slot" style="margin-top: 18px;">${installCard()}</div>

    <div class="profile-actions" style="margin-top: 14px;">
      <button class="btn btn--outline-primary btn--md" data-action="edit">
        ${icon('edit', { size: 15, color: 'var(--sf-primary)' })}
        Editar perfil
      </button>
      <button class="btn btn--outline-success btn--md" data-action="regenerate">
        ${icon('refresh', { size: 15, color: 'var(--sf-secondary)' })}
        Regenerar treino
      </button>
      <button class="btn btn--outline-muted btn--md" data-action="wipe">
        ${icon('trash', { size: 15, color: 'var(--sf-text-muted)' })}
        Limpar histórico
      </button>
      <button class="btn btn--outline-muted btn--md" data-action="about">
        ${icon('alert', { size: 15, color: 'var(--sf-text-muted)' })}
        Sobre o app
      </button>
    </div>
  </div>`;

  root.querySelector('[data-action="edit"]').addEventListener('click', () => {
    window.location.hash = '#/onboarding';
  });
  root.querySelector('[data-action="regenerate"]').addEventListener('click', () => {
    // Detecta sessão em andamento (qualquer treino com setsDone > 0 e não concluído).
    let activeSessions = [];
    try {
      const all = JSON.parse(localStorage.getItem('saintfit:session') || '{}');
      activeSessions = Object.entries(all).filter(([, s]) =>
        s?.completed?.some(c => (c.setsDone || 0) > 0 && !c.done)
      ).map(([id]) => id);
    } catch {}

    if (activeSessions.length > 0) {
      const msg = `Você tem treino em andamento (${activeSessions.join(', ')}). Regenerar o plano vai apagar o que você fez até agora nessa sessão. Continuar mesmo assim?`;
      if (!confirm(msg)) return;
    } else {
      if (!confirm('Regenerar seu plano com base no perfil atual? Seu histórico de treinos concluídos será preservado.')) return;
    }
    // Limpa sessões em andamento — exercícios podem ter mudado no novo plano.
    try { localStorage.removeItem('saintfit:session'); } catch {}
    setPlan(generatePlan(profile));
    renderProfile(root);
  });
  root.querySelector('[data-action="wipe"]').addEventListener('click', () => {
    if (!confirm('Apagar TODOS os dados (perfil, plano, progresso, histórico)? Esta ação não pode ser desfeita.')) return;
    wipeAll();
    window.location.hash = '#/onboarding';
  });
  root.querySelector('[data-action="about"]').addEventListener('click', () => {
    showAbout();
  });

  function bindInstallBtn() {
    const btn = root.querySelector('[data-action="install"]');
    btn?.addEventListener('click', async () => {
      btn.disabled = true;
      try { await promptInstall(); } finally { btn.disabled = false; }
    });
  }
  bindInstallBtn();

  // Re-renderiza só o card de instalação quando o estado muda (após instalar).
  const unsubscribe = onInstallStateChange(() => {
    const slot = root.querySelector('.install-card-slot');
    if (!slot) return;
    slot.innerHTML = installCard();
    bindInstallBtn();
  });

  return () => unsubscribe();
}
