// Screen 04 — Meus Treinos / Planos
import { icon } from '../icons.js';
import { getPlan, getProfile, getProgress, setPlan } from '../state.js';
import { generatePlan } from '../plan-generator.js';

const DAY_LABELS = { mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui', fri: 'Sex', sat: 'Sáb', sun: 'Dom' };

function weekStats(profile, plan, progress) {
  const today = new Date();
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const trainedThisWeek = progress.sessions.filter(s => {
    const d = new Date(s.date);
    return d >= monday && d <= today;
  }).length;

  const planned = plan.workouts.reduce((sum, w) => sum + w.days.length, 0);
  return {
    thisWeek: `${trainedThisWeek}/${planned}`,
    streak: `${progress.streak}d`,
    total: progress.sessions.length,
  };
}

function statCard({ label, value }) {
  return `<div class="card" style="padding:12px; text-align:center;">
    <div class="section-label" style="margin-bottom:6px;">${label}</div>
    <span class="display" style="font-size:22px; letter-spacing:1px;">${value}</span>
  </div>`;
}

function planCard(workout) {
  const days = workout.days.length > 0
    ? workout.days.map(d => DAY_LABELS[d]).join(' · ')
    : 'sem dias atribuídos';
  const accent = workout.accentColor;
  return `<a class="plan-card" href="#/workout?id=${workout.id}" data-workout="${workout.id}" style="--plan-accent:${accent};">
    <div class="plan-card__accent"></div>
    <div class="plan-card__letter">${workout.id}</div>
    <div class="plan-card__body">
      <div class="plan-card__head">
        <span class="display" style="font-size:22px; letter-spacing:1.5px;">TREINO ${workout.id}</span>
        <span class="plan-card__days">${days}</span>
      </div>
      <div class="plan-card__focus">${workout.focus}</div>
      <div class="plan-card__count">${workout.exercises.length} exercícios</div>
    </div>
    <span class="plan-card__chev">${icon('chevron-right', { size: 18, color: 'var(--sf-text-muted)' })}</span>
  </a>`;
}

export function renderPlans(root) {
  const profile = getProfile();
  const plan = getPlan();
  const progress = getProgress();
  if (!plan) return;

  const stats = weekStats(profile, plan, progress);
  const totalDaysPerWeek = plan.workouts.reduce((s, w) => s + w.days.length, 0);

  root.innerHTML = `<div class="screen">
    <div style="margin-top: 16px;">
      <span class="display" style="font-size:42px; letter-spacing:2px; display:block;">MEUS TREINOS</span>
      <div class="muted" style="font-size:13px; margin-top:4px;">Plano ABC · ${totalDaysPerWeek} dias por semana</div>
    </div>

    <div class="stats-row" style="margin-top: 20px;">
      ${statCard({ label: 'Esta semana', value: stats.thisWeek })}
      ${statCard({ label: 'Streak',       value: stats.streak })}
      ${statCard({ label: 'Total',        value: stats.total })}
    </div>

    <div class="plan-list" style="margin-top: 22px;">
      ${plan.workouts.map(planCard).join('')}
    </div>

    <button class="btn btn--dashed" data-action="regenerate" style="margin-top: 18px;">
      ${icon('refresh', { size: 16, color: 'var(--sf-text-muted)' })}
      Regenerar plano
    </button>
  </div>`;

  root.querySelector('[data-action="regenerate"]').addEventListener('click', () => {
    if (!confirm('Regenerar seu plano de treino? Isso vai substituir os treinos atuais (seu histórico será preservado).')) return;
    const newPlan = generatePlan(profile);
    setPlan(newPlan);
    renderPlans(root);
  });
}
