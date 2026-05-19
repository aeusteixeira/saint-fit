// Screen 01 — Onboarding
import { icon } from '../icons.js';
import { setProfile, setPlan, resetProgress, getProfile } from '../state.js';
import { generatePlan } from '../plan-generator.js';
import { isStandalone, isIos, canPromptInstall, promptInstall, onInstallStateChange } from '../pwa-install.js';

const OBJECTIVES = [
  { key: 'lose',      icon: '🔥', label: 'Emagrecer' },
  { key: 'gain',      icon: '💪', label: 'Ganhar massa' },
  { key: 'condition', icon: '🧘', label: 'Condicionamento' },
];

const LIMITATIONS = [
  { key: 'knee',     label: 'Joelho' },
  { key: 'spine',    label: 'Coluna' },
  { key: 'shoulder', label: 'Ombro' },
  { key: 'none',     label: 'Nenhuma' },
];

const EXPERIENCE = [
  { key: 'beginner',     label: 'Iniciante' },
  { key: 'returning',    label: 'Voltando' },
  { key: 'intermediate', label: 'Intermed.' },
];

const DAYS = [
  { key: 'mon', label: 'S' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'Q' },
  { key: 'thu', label: 'Q' },
  { key: 'fri', label: 'S' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'D' },
];

const DURATIONS = [
  { key: 30, label: '30min' },
  { key: 45, label: '45min' },
  { key: 60, label: '1h'    },
  { key: 90, label: '+1h'   },
];

function defaultState() {
  return {
    name: '',
    sex: null,         // 'M' | 'F'
    weight: '',        // string while typing
    goal: [],          // array de keys (lose/gain/condition) — multi-select
    limitations: [],
    level: null,       // 'beginner' | 'returning' | 'intermediate'
    days: [],
    duration: null,
  };
}

function stateFromProfile(p) {
  if (!p) return null;
  return {
    name: p.name || '',
    sex: p.sex || null,
    weight: p.weight ? String(p.weight) : '',
    goal: Array.isArray(p.goal) ? [...p.goal] : [],
    limitations: Array.isArray(p.limitations) ? [...p.limitations] : [],
    level: p.level || null,
    days: Array.isArray(p.days) ? [...p.days] : [],
    duration: p.duration || null,
  };
}

function isValid(s) {
  const weight = parseFloat(s.weight);
  return (
    s.name.trim().length > 0 &&
    s.sex !== null &&
    !isNaN(weight) && weight > 0 &&
    s.goal.length > 0 &&
    s.level !== null &&
    s.days.length > 0 &&
    s.duration !== null
  );
}

export function renderOnboarding(root) {
  const isEdit = !!getProfile();
  const state = stateFromProfile(getProfile()) || defaultState();

  function pill({ active, label, key, group, full = true }) {
    return `<button type="button" class="onb-pill${active ? ' is-active' : ''}" data-group="${group}" data-key="${key}" style="${full ? 'flex:1;' : ''}">
      ${label}
    </button>`;
  }

  function objCard({ active, item }) {
    return `<button type="button" class="obj-card${active ? ' is-active' : ''}" data-group="goal" data-key="${item.key}">
      <span class="obj-card__icon">${item.icon}</span>
      <span class="obj-card__label">${item.label}</span>
    </button>`;
  }

  function dayBtn(d, active) {
    return `<button type="button" class="day-btn${active ? ' is-active' : ''}" data-group="days" data-key="${d.key}">${d.label}</button>`;
  }

  function checkbox({ key, label, checked }) {
    return `<label class="check-row">
      <span class="check-box${checked ? ' is-checked' : ''}">${checked ? icon('check', { size: 13, color: '#000', strokeWidth: 3 }) : ''}</span>
      <span class="check-row__label">${label}</span>
      <input type="checkbox" data-group="limitations" data-key="${key}" ${checked ? 'checked' : ''} hidden/>
    </label>`;
  }

  function installBanner() {
    if (isStandalone()) return '';
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
          <div class="install-banner__sub">Toque em <strong>Compartilhar</strong> e depois <strong>Adicionar à Tela de Início</strong> pra usar offline.</div>
        </div>
      </div>`;
    }
    return '';
  }

  function template() {
    return `<div class="screen onboarding">
      <div class="onb-header">
        <div class="display onb-brand">SAINT FIT</div>
        <div class="onb-sub">Academia · Saint Simon</div>
      </div>

      <div class="install-banner-slot">${installBanner()}</div>

      <p class="onb-intro">${isEdit ? 'Ajuste seus dados — o plano será regenerado a partir deles.' : 'Vamos montar seu treino. Leva menos de 1 minuto.'}</p>

      <div class="onb-field">
        <div class="section-label">Como você se chama</div>
        <input class="onb-input" type="text" data-field="name" placeholder="Seu nome" autocomplete="name" value="${escapeAttr(state.name)}"/>
      </div>

      <div class="onb-field">
        <div class="section-label">Sexo</div>
        <div class="onb-row">
          ${pill({ active: state.sex === 'M', label: 'Masculino', key: 'M', group: 'sex' })}
          ${pill({ active: state.sex === 'F', label: 'Feminino',  key: 'F', group: 'sex' })}
        </div>
      </div>

      <div class="onb-field">
        <div class="section-label">Peso atual</div>
        <div class="onb-input onb-input--row">
          <input class="onb-input__num" type="number" inputmode="decimal" min="20" max="300" step="0.1" data-field="weight" placeholder="85" value="${state.weight}"/>
          <span class="muted">kg</span>
        </div>
      </div>

      <div class="onb-field">
        <div class="section-label">Objetivo principal</div>
        <div class="obj-grid">
          ${OBJECTIVES.map(o => objCard({ active: state.goal.includes(o.key), item: o })).join('')}
        </div>
      </div>

      <div class="onb-field">
        <div class="section-label">Limitações físicas</div>
        <div class="check-grid">
          ${LIMITATIONS.map(l => checkbox({ key: l.key, label: l.label, checked: state.limitations.includes(l.key) })).join('')}
        </div>
      </div>

      <div class="onb-field">
        <div class="section-label">Experiência</div>
        <div class="onb-row">
          ${EXPERIENCE.map(e => pill({ active: state.level === e.key, label: e.label, key: e.key, group: 'level' })).join('')}
        </div>
      </div>

      <div class="onb-field">
        <div class="section-label">Dias na semana</div>
        <div class="day-row">
          ${DAYS.map(d => dayBtn(d, state.days.includes(d.key))).join('')}
        </div>
      </div>

      <div class="onb-field">
        <div class="section-label">Tempo por treino</div>
        <div class="onb-row">
          ${DURATIONS.map(t => pill({ active: state.duration === t.key, label: t.label, key: String(t.key), group: 'duration' })).join('')}
        </div>
      </div>

      <div style="height: 90px;"></div>
    </div>

    <div class="sticky-cta sticky-cta--no-nav">
      <button class="btn btn--success btn--lg" data-action="submit" disabled>
        ${icon('sparkle', { size: 18, color: '#fff' })}
        <span class="cta-label">${isEdit ? 'Salvar e regenerar' : 'Gerar meu treino'}</span>
        ${icon('arrow-right', { size: 16, color: '#fff' })}
      </button>
    </div>`;
  }

  function renderAll() {
    root.innerHTML = template();
    bindEvents();
    refreshCta();
  }

  function refreshCta() {
    const btn = root.querySelector('[data-action="submit"]');
    if (!btn) return;
    btn.disabled = !isValid(state);
  }

  // Partial re-render for selection groups, keeping focus/text in inputs.
  function refreshGroup(group) {
    const fields = root.querySelectorAll(`[data-group="${group}"]`);
    fields.forEach(el => {
      const key = el.dataset.key;
      const active = isActive(group, key);
      el.classList.toggle('is-active', active);

      // checkbox special case
      if (group === 'limitations') {
        const box = el.previousElementSibling?.querySelector?.('.check-box');
      }
    });

    // Checkboxes use a different DOM structure — re-render just that block.
    if (group === 'limitations') {
      const checkGrid = root.querySelector('.check-grid');
      if (checkGrid) {
        checkGrid.innerHTML = LIMITATIONS.map(l =>
          checkbox({ key: l.key, label: l.label, checked: state.limitations.includes(l.key) })
        ).join('');
        bindLimitationEvents();
      }
    }
    refreshCta();
  }

  function isActive(group, key) {
    switch (group) {
      case 'sex':         return state.sex === key;
      case 'goal':        return state.goal.includes(key);
      case 'level':       return state.level === key;
      case 'duration':    return state.duration === parseInt(key, 10);
      case 'days':        return state.days.includes(key);
      case 'limitations': return state.limitations.includes(key);
      default: return false;
    }
  }

  function bindEvents() {
    // Text + number inputs
    const nameInput = root.querySelector('[data-field="name"]');
    nameInput.addEventListener('input', e => {
      state.name = e.target.value;
      refreshCta();
    });

    const weightInput = root.querySelector('[data-field="weight"]');
    weightInput.addEventListener('input', e => {
      state.weight = e.target.value;
      refreshCta();
    });

    // Pills, obj cards, day buttons
    root.querySelectorAll('[data-group]').forEach(el => {
      const group = el.dataset.group;
      if (group === 'limitations') return; // handled separately
      el.addEventListener('click', () => {
        const key = el.dataset.key;
        if (group === 'sex')         state.sex = key;
        else if (group === 'goal') {
          if (state.goal.includes(key)) state.goal = state.goal.filter(g => g !== key);
          else                          state.goal = [...state.goal, key];
        }
        else if (group === 'level')  state.level = key;
        else if (group === 'duration') state.duration = parseInt(key, 10);
        else if (group === 'days') {
          if (state.days.includes(key)) state.days = state.days.filter(d => d !== key);
          else                          state.days = [...state.days, key];
        }
        refreshGroup(group);
      });
    });

    bindLimitationEvents();

    // Install banner button
    const installBtn = root.querySelector('[data-action="install"]');
    installBtn?.addEventListener('click', async () => {
      installBtn.disabled = true;
      try {
        await promptInstall();
      } finally {
        // Estado muda via onInstallStateChange → banner se atualiza sozinho.
        installBtn.disabled = false;
      }
    });

    // Submit
    root.querySelector('[data-action="submit"]').addEventListener('click', () => {
      if (!isValid(state)) return;
      handleSubmit();
    });
  }

  function bindLimitationEvents() {
    root.querySelectorAll('.check-row').forEach(label => {
      const checkbox = label.querySelector('input[data-group="limitations"]');
      if (!checkbox) return;
      label.addEventListener('click', (e) => {
        e.preventDefault();
        const key = checkbox.dataset.key;
        if (key === 'none') {
          state.limitations = state.limitations.includes('none') ? [] : ['none'];
        } else {
          state.limitations = state.limitations.filter(l => l !== 'none');
          if (state.limitations.includes(key)) {
            state.limitations = state.limitations.filter(l => l !== key);
          } else {
            state.limitations = [...state.limitations, key];
          }
        }
        refreshGroup('limitations');
      });
    });
  }

  function handleSubmit() {
    const btn = root.querySelector('[data-action="submit"]');
    btn.disabled = true;
    btn.classList.add('is-loading');
    btn.querySelector('.cta-label').textContent = 'Montando seu treino…';

    setTimeout(() => {
      const profile = {
        name: state.name.trim(),
        shortName: state.name.trim().split(' ')[0],
        sex: state.sex,
        weight: parseFloat(state.weight),
        goal: state.goal,
        limitations: state.limitations.filter(l => l !== 'none'),
        level: state.level,
        days: state.days,
        duration: state.duration,
        createdAt: new Date().toISOString(),
      };
      const plan = generatePlan(profile);
      setProfile(profile);
      setPlan(plan);
      // Only reset progress on first onboarding — edits preserve XP/streak/badges.
      if (!isEdit) resetProgress();
      window.location.hash = '#/';
    }, 700);
  }

  renderAll();

  // Atualiza só o banner quando o estado de instalação muda — não re-renderiza
  // o form todo (preserva inputs/foco).
  const unsubscribe = onInstallStateChange(() => {
    const slot = root.querySelector('.install-banner-slot');
    if (!slot) return;
    slot.innerHTML = installBanner();
    const btn = slot.querySelector('[data-action="install"]');
    btn?.addEventListener('click', async () => {
      btn.disabled = true;
      try { await promptInstall(); } finally { btn.disabled = false; }
    });
  });

  // Cleanup chamado pelo router quando sair da rota.
  return () => unsubscribe();
}

function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
