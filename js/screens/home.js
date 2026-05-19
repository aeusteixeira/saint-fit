// Screen 02 — Home / Dashboard
import { icon } from '../icons.js';
import { getProfile, getTodayWorkout, getProgress, getPlan, isTodayCompleted, getTodaySessionRecord } from '../state.js';
import { greetingFor, formatDateLong } from '../components.js';

const WEEK_DAYS = [
  { key: 'mon', label: 'SEG' },
  { key: 'tue', label: 'TER' },
  { key: 'wed', label: 'QUA' },
  { key: 'thu', label: 'QUI' },
  { key: 'fri', label: 'SEX' },
  { key: 'sat', label: 'SÁB' },
  { key: 'sun', label: 'DOM' },
];

const DAY_MAP = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABELS_SHORT = { mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui', fri: 'Sex', sat: 'Sáb', sun: 'Dom' };

function dayStates(plan, sessions, todayKey) {
  // sessions: array of session-like { workoutId, date }
  // We mark days completed if there's a session whose ISO date matches the current week's day.
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Monday

  const trainedKeys = new Set();
  for (const s of sessions) {
    const d = new Date(s.date);
    if (d >= weekStart && d <= today) {
      trainedKeys.add(DAY_MAP[d.getDay()]);
    }
  }

  return WEEK_DAYS.map(d => {
    if (d.key === todayKey) {
      return { ...d, state: trainedKeys.has(d.key) ? 'done' : 'today' };
    }
    const isPlanned = plan.workouts.some(w => w.days.includes(d.key));
    if (trainedKeys.has(d.key)) return { ...d, state: 'done' };
    if (!isPlanned) return { ...d, state: 'rest' };
    // Planned but not yet trained: upcoming if after today, otherwise rest (missed).
    const idxToday = WEEK_DAYS.findIndex(x => x.key === todayKey);
    const idxThis = WEEK_DAYS.findIndex(x => x.key === d.key);
    return { ...d, state: idxThis > idxToday ? 'upcoming' : 'rest' };
  });
}

function dayCircle({ label, state }) {
  return `<div class="day day--${state}">
    <span class="day__label">${label}</span>
    <div class="day__circle">${state === 'done' ? icon('check', { size: 14, color: '#000', strokeWidth: 3 }) : ''}</div>
  </div>`;
}

function heroCard(workout, { done = false, todaySession = null } = {}) {
  const heroImage = workout.exercises.find(e => e.image)?.image;
  const pill = done
    ? `<span class="pill pill--done">${icon('check', { size: 11, color: '#000', strokeWidth: 3 })} Concluído hoje</span>`
    : `<span class="pill pill--ghost">Hoje</span>`;
  const cta = done
    ? `<button class="btn btn--ghost" data-action="view-workout">
         ${icon('list', { size: 13, color: 'var(--sf-text)' })}
         Ver treino
       </button>`
    : `<button class="btn btn--light" data-action="start-workout">
         ${icon('play', { size: 13, color: '#000' })}
         Iniciar treino
       </button>`;
  const meta = done && todaySession
    ? `<div class="hero__meta">
         <span class="hero__meta-item">${icon('sparkle', { size: 13, color: 'var(--sf-accent)', fill: 'var(--sf-accent)' })} +${todaySession.xpEarned || 0} XP</span>
         <span class="hero__meta-item">${icon('check', { size: 13, color: 'rgba(255,255,255,0.7)', strokeWidth: 3 })} ${todaySession.fullyCompleted ? 'Treino completo' : 'Treino parcial'}</span>
       </div>`
    : `<div class="hero__meta">
         <span class="hero__meta-item">${icon('clock', { size: 13, color: 'rgba(255,255,255,0.7)' })} ${workout.durationMin} min</span>
         <span class="hero__meta-item">${icon('dumbbell', { size: 13, color: 'rgba(255,255,255,0.7)' })} ${workout.intensity}</span>
       </div>`;
  return `<div class="hero${done ? ' hero--done' : ''}">
    <div class="hero__glow"></div>
    ${heroImage ? `<img class="hero__image" src="${heroImage}" alt="" aria-hidden="true" loading="lazy"/>` : ''}
    <div class="hero__inner">
      ${pill}
      <span class="hero__title">TREINO ${workout.id}</span>
      <div class="hero__sub">${workout.focus} · ${workout.exercises.length} exercícios</div>
      ${meta}
      ${cta}
    </div>
  </div>`;
}

function recentItem(s) {
  return `<div class="history-item">
    <div class="history-item__avatar">${icon('check', { size: 16, color: 'var(--sf-secondary)', strokeWidth: 2.5 })}</div>
    <div class="history-item__body">
      <div class="history-item__name">Treino ${s.workoutId}</div>
      <div class="history-item__focus">${s.focus}</div>
    </div>
    <span class="history-item__date">${DAY_LABELS_SHORT[DAY_MAP[new Date(s.date).getDay()]]}</span>
  </div>`;
}

export function renderHome(root) {
  const profile = getProfile();
  const plan = getPlan();
  const workout = getTodayWorkout();
  const progress = getProgress();
  const today = new Date();
  const todayKey = DAY_MAP[today.getDay()];
  const days = dayStates(plan, progress.sessions, todayKey);
  const trainedThisWeek = days.filter(d => d.state === 'done').length;
  const plannedThisWeek = days.filter(d => d.state === 'done' || d.state === 'upcoming' || d.state === 'today').length;

  root.innerHTML = `<div class="screen">
    <div class="greeting">
      <div>
        <div class="greeting__name">
          ${greetingFor(today)}, ${profile.shortName || profile.name.split(' ')[0]}
          ${icon('wave', { size: 20, color: 'var(--sf-accent)' })}
        </div>
        <div class="greeting__date">
          ${icon('calendar', { size: 12, color: 'var(--sf-text-muted)' })} ${formatDateLong(today)}
        </div>
      </div>
    </div>

    ${heroCard(workout, { done: isTodayCompleted(), todaySession: getTodaySessionRecord() })}

    <div class="row row--between row--baseline" style="margin: 24px 0 14px;">
      <span class="display" style="font-size:20px; letter-spacing:1.5px;">SEMANA ATUAL</span>
      <span style="font-size:11.5px; color:var(--sf-secondary); font-weight:600;">${trainedThisWeek} de ${plannedThisWeek}</span>
    </div>
    <div class="card">
      <div class="week-grid">
        ${days.map(dayCircle).join('')}
      </div>
    </div>

    <span class="display" style="font-size:20px; letter-spacing:1.5px; display:block; margin: 24px 0 12px;">ÚLTIMOS TREINOS</span>
    <div class="history-list">
      ${progress.sessions.length === 0
        ? `<div class="card" style="text-align:center; color:var(--sf-text-muted); font-size:13px;">
            Nenhum treino concluído ainda. Bora começar pelo hero acima?
          </div>`
        : progress.sessions.slice(0, 3).map(recentItem).join('')}
    </div>
  </div>`;

  // Events
  const startBtn = root.querySelector('[data-action="start-workout"]');
  startBtn?.addEventListener('click', () => {
    window.location.hash = '#/workout';
  });
  const viewBtn = root.querySelector('[data-action="view-workout"]');
  viewBtn?.addEventListener('click', () => {
    window.location.hash = '#/workout';
  });
}

