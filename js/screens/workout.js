// Screen 03 — Treino do Dia
import { icon } from '../icons.js';
import { getTodayWorkout, getSession, setSession, startSession, getPlan, getProgress, isTodayCompleted, getTodaySessionRecord } from '../state.js';
import { completeWorkout } from '../progress-engine.js';
import { showQueue, showVideo } from '../modals.js';
import { getVideoFor } from '../exercise-videos.js';

function workoutFromHash() {
  // Permite `#/workout?id=A|B|C` pra abrir treino específico (vindo de #/plans).
  const hash = window.location.hash || '';
  const qIdx = hash.indexOf('?');
  if (qIdx < 0) return null;
  const params = new URLSearchParams(hash.slice(qIdx + 1));
  const id = params.get('id');
  if (!id) return null;
  const plan = getPlan();
  return plan?.workouts?.find(w => w.id === id) || null;
}

function exerciseCard(ex, state, num) {
  const done = !!state.done;
  const reps = ex.reps === 'max' ? `${ex.sets} × max` : `${ex.sets} × ${ex.reps}`;
  const padded = String(num).padStart(2, '0');
  const videoUrl = getVideoFor(ex.name);
  return `<div class="exercise${done ? ' is-done' : ''}" data-ex="${ex.id}">
    <button class="exercise__check" data-action="toggle" aria-label="Concluir exercício">
      ${icon('check', { size: 14, color: '#000', strokeWidth: 3 })}
    </button>
    <div class="exercise__body">
      <div class="exercise__title-row">
        <span class="exercise__name">${ex.name}</span>
        ${ex.adapted ? `<span class="exercise__adapted">${icon('alert', { size: 11, color: 'var(--sf-accent)' })} Adaptado</span>` : ''}
        <span class="exercise__num-inline">${padded}</span>
      </div>
      <div class="exercise__equip">${ex.equipment}</div>
      <div class="exercise__controls">
        <span class="exercise__reps">${reps}</span>
        <label class="exercise__weight" data-action="focus-weight">
          <span class="exercise__weight-label">Peso</span>
          <input
            type="number"
            inputmode="decimal"
            min="0"
            max="500"
            step="0.5"
            class="exercise__weight-input"
            data-action="weight-change"
            placeholder="—"
            value="${state.weight ?? ''}"
            aria-label="Peso em kg"
          />
          <span class="exercise__weight-empty" style="display:none;">— kg</span>
        </label>
      </div>
    </div>
    <div class="exercise__aside">
      <button type="button" class="exercise__video" data-action="play-video" data-video="${videoUrl}" data-name="${ex.name}" aria-label="Ver vídeo do exercício" title="Ver vídeo">
        ${icon('play', { size: 12, color: '#fff' })}
      </button>
      ${ex.image
        ? `<div class="exercise__thumb"><img src="${ex.image}" alt="${ex.equipment}" loading="lazy"/></div>`
        : `<span class="exercise__num">${padded}</span>`}
    </div>
  </div>`;
}

function progressCard(done, total) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return `<div class="progress-card">
    <div class="progress-card__body">
      <div class="progress-card__label">${done} de ${total} concluídos</div>
      <div class="progress-card__bar"><span style="width:${pct}%"></span></div>
    </div>
    <span class="progress-card__pct">${pct}%</span>
  </div>`;
}

export function renderWorkout(root) {
  // Prioridade: workout via ?id=X (vindo de #/plans). Fallback: workout do dia.
  const requestedWorkout = workoutFromHash();
  const todayWorkout = getTodayWorkout();
  const workout = requestedWorkout || todayWorkout;
  if (!workout) {
    root.innerHTML = `<div class="screen"><p class="muted">Nenhum treino disponível.</p></div>`;
    return;
  }
  // Read-only se hoje já foi treinado. Aplica para qualquer treino aberto —
  // não dá pra farmar XP treinando outra letra no mesmo dia.
  const readOnly = isTodayCompleted();
  const todaySession = readOnly ? getTodaySessionRecord() : null;
  // Só marca os exercícios como "feitos" se ESTE treino é o que foi concluído hoje.
  // Se o usuário abre Treino C mas fez Treino A hoje, mostra exercícios não-feitos.
  const isThisDoneToday = readOnly && todaySession?.workoutId === workout.id;

  let session;
  if (readOnly) {
    session = {
      workoutId: workout.id,
      date: new Date().toISOString(),
      completed: workout.exercises.map(ex => ({ exerciseId: ex.id, weight: null, done: isThisDoneToday })),
    };
  } else {
    session = getSession(workout.id) || startSession(workout);
    if (session.completed.length !== workout.exercises.length) {
      session = startSession(workout);
    }
  }

  function statusOf(exId) {
    return session.completed.find(c => c.exerciseId === exId) || { done: false, weight: null };
  }

  function fullRender() {
    const doneCount = session.completed.filter(c => c.done).length;
    const total = workout.exercises.length;
    const coverImage = workout.exercises.find(e => e.image)?.image;
    root.innerHTML = `
      <div class="workout-topbar">
        <button class="icon-btn" data-action="back" aria-label="Voltar">
          ${icon('chevron-left', { size: 18, color: 'var(--sf-text)' })}
        </button>
        <div class="workout-topbar__body">
          <span class="workout-topbar__title">TREINO ${workout.id}</span>
          <div class="workout-topbar__sub">${workout.focus} · ${total} exercícios</div>
        </div>
      </div>

      <div class="screen screen--workout" style="padding-top: 14px; padding-bottom: 120px;">
        ${coverImage ? `
          <div class="workout-cover">
            <div class="workout-cover__glow"></div>
            <img class="workout-cover__image" src="${coverImage}" alt="" aria-hidden="true" loading="lazy"/>
            <div class="workout-cover__inner">
              <span class="workout-cover__focus">${workout.focus}</span>
              <div class="workout-cover__meta">
                <span class="workout-cover__meta-item">${icon('clock', { size: 13, color: 'rgba(255,255,255,0.7)' })} ${workout.durationMin} min</span>
                <span class="workout-cover__meta-item">${icon('dumbbell', { size: 13, color: 'rgba(255,255,255,0.7)' })} ${workout.intensity}</span>
              </div>
            </div>
          </div>
        ` : ''}
        ${progressCard(doneCount, total)}
        <div class="exercises" style="margin-top: 18px;">
          ${workout.exercises.map((ex, i) => exerciseCard(ex, statusOf(ex.id), i + 1)).join('')}
        </div>
      </div>

      <div class="sticky-cta">
        ${readOnly
          ? (isThisDoneToday
              ? `<button class="btn btn--success btn--lg" disabled>
                   ${icon('check', { size: 17, color: '#fff', strokeWidth: 2.5 })}
                   Já concluído hoje${todaySession?.xpEarned ? ` · +${todaySession.xpEarned} XP` : ''}
                 </button>`
              : `<button class="btn btn--ghost btn--lg" disabled>
                   ${icon('check', { size: 17, color: 'var(--sf-text-muted)', strokeWidth: 2.5 })}
                   Você já treinou hoje — apenas visualização
                 </button>`)
          : `<button class="btn btn--success btn--lg" data-action="finish" ${doneCount === 0 ? 'disabled' : ''}>
               ${icon('check', { size: 17, color: '#fff', strokeWidth: 2.5 })}
               Concluir treino
             </button>`}
      </div>`;

    bindRowEvents();
  }

  function bindRowEvents() {
    // Sempre liga botão de voltar e botões de vídeo (vídeo funciona em read-only).
    root.querySelector('[data-action="back"]').addEventListener('click', () => {
      window.location.hash = '#/';
    });
    root.querySelectorAll('[data-action="play-video"]').forEach(btn => {
      btn.addEventListener('click', () => {
        showVideo({ title: btn.dataset.name, url: btn.dataset.video });
      });
    });

    // Em modo somente-leitura: trava toggles, inputs de peso e o botão de concluir.
    if (readOnly) {
      root.querySelectorAll('[data-action="toggle"]').forEach(b => b.setAttribute('disabled', ''));
      root.querySelectorAll('[data-action="weight-change"]').forEach(i => i.setAttribute('disabled', ''));
      return;
    }

    // Toggle done
    root.querySelectorAll('.exercise').forEach(row => {
      const exId = row.dataset.ex;

      row.querySelector('[data-action="toggle"]').addEventListener('click', () => {
        const entry = session.completed.find(c => c.exerciseId === exId);
        entry.done = !entry.done;
        setSession(workout.id, session);
        row.classList.toggle('is-done', entry.done);
        updateProgressBar();
        updateFinishButton();
      });

      const input = row.querySelector('[data-action="weight-change"]');
      input.addEventListener('change', () => {
        const entry = session.completed.find(c => c.exerciseId === exId);
        const v = input.value.trim();
        entry.weight = v === '' ? null : Math.max(0, Math.min(500, parseFloat(v)));
        if (Number.isNaN(entry.weight)) entry.weight = null;
        setSession(workout.id, session);
      });
    });

    root.querySelector('[data-action="finish"]').addEventListener('click', async () => {
      const result = completeWorkout({ workout, session, plan: getPlan() });

      // Build modal queue: level-up first, then each new badge.
      const queue = [];
      if (result.leveledUp) {
        queue.push({
          type: 'levelup',
          newLevel: result.newLevel,
          totalXp: getProgress().totalXp,
        });
      }
      for (const badge of result.newBadges || []) {
        queue.push({ type: 'badge', badge, xpEarned: result.xpEarned });
      }

      if (queue.length === 0) {
        showCompletionToast(result);
        setTimeout(() => { window.location.hash = '#/'; }, 800);
        return;
      }

      // Disable button so taps during the celebration don't double-fire.
      root.querySelector('[data-action="finish"]').disabled = true;
      await showQueue(queue);
      window.location.hash = '#/';
    });
  }

  function updateProgressBar() {
    const doneCount = session.completed.filter(c => c.done).length;
    const total = workout.exercises.length;
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    root.querySelector('.progress-card__label').textContent = `${doneCount} de ${total} concluídos`;
    root.querySelector('.progress-card__bar > span').style.width = `${pct}%`;
    root.querySelector('.progress-card__pct').textContent = `${pct}%`;
  }
  function updateFinishButton() {
    const doneCount = session.completed.filter(c => c.done).length;
    const btn = root.querySelector('[data-action="finish"]');
    if (!btn) return;
    btn.disabled = doneCount === 0;
  }

  fullRender();
}

function showCompletionToast(result) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  const lines = [];
  lines.push(`<div class="toast__title">+${result.xpEarned} XP</div>`);
  if (result.leveledUp) lines.push(`<div class="toast__line">Subiu para Nível ${result.newLevel}!</div>`);
  if (result.newBadges?.length) {
    lines.push(`<div class="toast__line">Conquista: ${result.newBadges.map(b => b.label).join(', ')}</div>`);
  }
  t.innerHTML = lines.join('');
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('is-visible'), 10);
  setTimeout(() => t.remove(), 2400);
}
