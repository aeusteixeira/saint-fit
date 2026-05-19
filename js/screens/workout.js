// Screen 03 — Treino do Dia
// Dois modos:
//   - guided (default): wizard, 1 exercício por vez, contador de séries, rest timer
//   - list: lista de todos exercícios com checkboxes (modo original)
// Toggle via ?view=list na URL.
import { icon } from '../icons.js';
import { getTodayWorkout, getSession, setSession, startSession, getPlan, getProgress, isTodayCompleted, getTodaySessionRecord } from '../state.js';
import { completeWorkout } from '../progress-engine.js';
import { showQueue, showVideo } from '../modals.js';
import { getVideoFor } from '../exercise-videos.js';

// ─────────────────────────────────────────────────────────────
// Helpers de URL
// ─────────────────────────────────────────────────────────────
function parseHashParams() {
  const hash = window.location.hash || '';
  const qIdx = hash.indexOf('?');
  if (qIdx < 0) return new URLSearchParams();
  return new URLSearchParams(hash.slice(qIdx + 1));
}

function workoutFromHash() {
  const id = parseHashParams().get('id');
  if (!id) return null;
  const plan = getPlan();
  return plan?.workouts?.find(w => w.id === id) || null;
}

function viewFromHash() {
  return parseHashParams().get('view') || 'guided';
}

function workoutBaseHash(workoutId) {
  return workoutId ? `#/workout?id=${workoutId}` : '#/workout';
}

// ─────────────────────────────────────────────────────────────
// Regras de descanso entre séries (segundos)
// ─────────────────────────────────────────────────────────────
function restDurationFor(ex) {
  if (ex.sets <= 1 || ex.reps === 'max' && ex.sets === 1) return 0;
  if (ex.muscleGroup?.includes('core') || ex.muscleGroup?.includes('cardio')) return 45;
  if (ex.sets >= 4 && typeof ex.reps === 'number' && ex.reps <= 12) return 90;
  return 60;
}

function formatRepsLine(ex) {
  return ex.reps === 'max' ? `${ex.sets} × max` : `${ex.sets} × ${ex.reps}`;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────
export function renderWorkout(root) {
  const requestedWorkout = workoutFromHash();
  const todayWorkout = getTodayWorkout();
  const workout = requestedWorkout || todayWorkout;
  if (!workout) {
    root.innerHTML = `<div class="screen"><p class="muted">Nenhum treino disponível.</p></div>`;
    return;
  }

  const readOnly = isTodayCompleted();
  const todaySession = readOnly ? getTodaySessionRecord() : null;
  const isThisDoneToday = readOnly && todaySession?.workoutId === workout.id;

  let session;
  if (readOnly) {
    session = {
      workoutId: workout.id,
      date: new Date().toISOString(),
      completed: workout.exercises.map(ex => ({
        exerciseId: ex.id,
        weight: null,
        done: isThisDoneToday,
        setsDone: isThisDoneToday ? ex.sets : 0,
      })),
    };
  } else {
    session = getSession(workout.id) || startSession(workout);
    if (session.completed.length !== workout.exercises.length) {
      session = startSession(workout);
    }
  }

  const ctx = { workout, session, readOnly, isThisDoneToday, todaySession };
  const view = viewFromHash();
  // Read-only sempre cai no modo lista (mais útil pra revisar o que foi feito).
  if (view === 'list' || readOnly) return renderListMode(root, ctx);
  return renderGuidedMode(root, ctx);
}

// ─────────────────────────────────────────────────────────────
// Modo GUIADO (default)
// ─────────────────────────────────────────────────────────────
function renderGuidedMode(root, ctx) {
  const { workout, session } = ctx;

  // UI state local (não persiste — descanso é em-sessão)
  const ui = {
    isResting: false,
    restEndsAt: 0,
    restIntervalId: null,
    restJustFinished: false,
  };

  function currentIndex() {
    const idx = session.completed.findIndex(c => c.setsDone < workout.exercises.find(e => e.id === c.exerciseId).sets);
    return idx < 0 ? workout.exercises.length - 1 : idx;
  }

  function isAllDone() {
    return session.completed.every(c => c.setsDone >= workout.exercises.find(e => e.id === c.exerciseId).sets);
  }

  function exerciseAt(idx) {
    return workout.exercises[idx];
  }

  function entryFor(exId) {
    return session.completed.find(c => c.exerciseId === exId);
  }

  function persist() {
    setSession(workout.id, session);
  }

  function startRest(durationSec) {
    if (durationSec <= 0) return;
    ui.isResting = true;
    ui.restEndsAt = Date.now() + durationSec * 1000;
    if (ui.restIntervalId) clearInterval(ui.restIntervalId);
    ui.restIntervalId = setInterval(tickRest, 250);
    fullRender();
  }

  function tickRest() {
    const left = Math.max(0, Math.ceil((ui.restEndsAt - Date.now()) / 1000));
    if (left <= 0) {
      stopRest();
      return;
    }
    const el = document.querySelector('.rest__time');
    if (el) el.textContent = formatTime(left);
  }

  function stopRest() {
    if (ui.restIntervalId) clearInterval(ui.restIntervalId);
    ui.restIntervalId = null;
    ui.isResting = false;
    ui.restJustFinished = true;
    try { beep(); } catch {}
    fullRender();
  }

  function addRestSeconds(sec) {
    ui.restEndsAt += sec * 1000;
    const left = Math.max(0, Math.ceil((ui.restEndsAt - Date.now()) / 1000));
    const el = document.querySelector('.rest__time');
    if (el) el.textContent = formatTime(left);
  }

  // Bip curto via WebAudio API quando descanso termina
  function beep() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const audio = new Ctx();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.0001;
    osc.connect(gain).connect(audio.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.15, audio.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.4);
    osc.stop(audio.currentTime + 0.42);
  }

  function completeSet(ex, entry) {
    entry.setsDone = Math.min(ex.sets, entry.setsDone + 1);
    if (entry.setsDone >= ex.sets) {
      entry.done = true;
    }
    persist();

    // Próximo exercício ou descanso entre séries
    const allSetsOfExDone = entry.setsDone >= ex.sets;
    if (allSetsOfExDone) {
      // Sem descanso aqui — usuário clica "Próximo exercício" no botão atualizado
      ui.restJustFinished = false;
      fullRender();
    } else {
      startRest(restDurationFor(ex));
    }
  }

  function goNextExercise() {
    ui.restJustFinished = false;
    fullRender();
  }

  async function finishWorkout() {
    const result = completeWorkout({ workout, session, plan: getPlan() });
    const queue = [];
    if (result.leveledUp) {
      queue.push({ type: 'levelup', newLevel: result.newLevel, totalXp: getProgress().totalXp });
    }
    for (const badge of result.newBadges || []) {
      queue.push({ type: 'badge', badge, xpEarned: result.xpEarned });
    }
    if (queue.length === 0) {
      showCompletionToast(result);
      setTimeout(() => { window.location.hash = '#/'; }, 800);
      return;
    }
    await showQueue(queue);
    window.location.hash = '#/';
  }

  function fullRender() {
    const total = workout.exercises.length;
    const idx = currentIndex();
    const ex = exerciseAt(idx);
    const entry = entryFor(ex.id);
    const allDone = isAllDone();
    const nextEx = idx + 1 < total ? workout.exercises[idx + 1] : null;
    const exerciseSetsDone = entry.setsDone;
    const exerciseTotalSets = ex.sets;
    const exerciseFullyDone = exerciseSetsDone >= exerciseTotalSets;
    const videoUrl = getVideoFor(ex.name);
    const restSecLeft = ui.isResting ? Math.max(0, Math.ceil((ui.restEndsAt - Date.now()) / 1000)) : 0;
    const totalSets = workout.exercises.reduce((s, e) => s + e.sets, 0);
    const setsDoneTotal = session.completed.reduce((s, c) => s + c.setsDone, 0);
    const overallPct = totalSets > 0 ? Math.round((setsDoneTotal / totalSets) * 100) : 0;

    root.innerHTML = `
      <div class="workout-topbar workout-topbar--guided">
        <button class="icon-btn" data-action="back" aria-label="Voltar">
          ${icon('chevron-left', { size: 18, color: 'var(--sf-text)' })}
        </button>
        <div class="workout-topbar__body">
          <span class="workout-topbar__title">TREINO ${workout.id}</span>
          <div class="workout-topbar__sub">Exercício ${Math.min(idx + 1, total)} de ${total} · ${overallPct}%</div>
        </div>
        <a class="icon-btn" href="${workoutBaseHash(workout.id)}&view=list" aria-label="Ver lista" title="Ver lista">
          ${icon('list', { size: 18, color: 'var(--sf-text)' })}
        </a>
      </div>

      <div class="workout-progress-bar"><span style="width:${overallPct}%"></span></div>

      <div class="screen screen--guided">
        ${allDone ? renderAllDoneState(workout, setsDoneTotal) : renderCurrentExerciseCard({
          ex, entry, idx, total, nextEx, exerciseFullyDone, videoUrl,
        })}
      </div>

      <div class="sticky-cta">
        ${allDone
          ? `<button class="btn btn--success btn--lg" data-action="finish-workout">
               ${icon('check', { size: 17, color: '#fff', strokeWidth: 2.5 })}
               Concluir treino
             </button>`
          : exerciseFullyDone
            ? (idx + 1 < total
                ? `<button class="btn btn--primary btn--lg" data-action="next-exercise">
                     Próximo exercício
                     ${icon('arrow-right', { size: 16, color: '#fff' })}
                   </button>`
                : `<button class="btn btn--success btn--lg" data-action="finish-workout">
                     ${icon('check', { size: 17, color: '#fff', strokeWidth: 2.5 })}
                     Concluir treino
                   </button>`)
            : `<button class="btn btn--success btn--lg" data-action="complete-set">
                 ${icon('check', { size: 17, color: '#fff', strokeWidth: 2.5 })}
                 Concluí ${exerciseSetsDone + 1 === exerciseTotalSets ? 'a última série' : `série ${exerciseSetsDone + 1}`}
               </button>`}
      </div>

      ${ui.isResting ? renderRestOverlay(restSecLeft, ex, entry, idx, total) : ''}
    `;

    bindEvents();
  }

  function bindEvents() {
    root.querySelector('[data-action="back"]')?.addEventListener('click', () => {
      window.location.hash = '#/';
    });

    root.querySelector('[data-action="play-video"]')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      showVideo({ title: btn.dataset.name, url: btn.dataset.video });
    });

    const weightInput = root.querySelector('[data-action="weight-change"]');
    weightInput?.addEventListener('change', () => {
      const exId = weightInput.dataset.ex;
      const entry = entryFor(exId);
      const v = weightInput.value.trim();
      entry.weight = v === '' ? null : Math.max(0, Math.min(500, parseFloat(v)));
      if (Number.isNaN(entry.weight)) entry.weight = null;
      persist();
    });

    root.querySelector('[data-action="complete-set"]')?.addEventListener('click', () => {
      const idx = currentIndex();
      const ex = exerciseAt(idx);
      const entry = entryFor(ex.id);
      completeSet(ex, entry);
    });

    root.querySelector('[data-action="next-exercise"]')?.addEventListener('click', goNextExercise);

    root.querySelector('[data-action="finish-workout"]')?.addEventListener('click', finishWorkout);

    // Rest overlay buttons
    root.querySelector('[data-action="skip-rest"]')?.addEventListener('click', stopRest);
    root.querySelector('[data-action="add-rest"]')?.addEventListener('click', () => addRestSeconds(15));
  }

  fullRender();

  // Cleanup chamado pelo router quando sair da rota
  return () => {
    if (ui.restIntervalId) clearInterval(ui.restIntervalId);
  };
}

function renderCurrentExerciseCard({ ex, entry, idx, total, nextEx, exerciseFullyDone, videoUrl }) {
  const setsDone = entry.setsDone;
  const totalSets = ex.sets;
  const dots = Array.from({ length: totalSets }, (_, i) => {
    const state = i < setsDone ? 'done' : (i === setsDone ? 'current' : 'pending');
    return `<span class="set-dot set-dot--${state}">${state === 'done' ? icon('check', { size: 11, color: '#000', strokeWidth: 3 }) : (i + 1)}</span>`;
  }).join('');

  const repsLabel = ex.reps === 'max' ? 'máx. repetições' : `${ex.reps} repetições`;

  return `
    <div class="guided-card">
      <div class="guided-card__head">
        <span class="guided-card__num">${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
        ${ex.adapted ? `<span class="guided-card__adapted">${icon('alert', { size: 12, color: 'var(--sf-accent)' })} Adaptado</span>` : ''}
      </div>
      <h1 class="guided-card__name">${ex.name}</h1>
      <div class="guided-card__equip">${ex.equipment}</div>

      ${ex.image ? `
        <div class="guided-card__media">
          <img src="${ex.image}" alt="${ex.equipment}" loading="lazy"/>
          <button type="button" class="guided-card__video" data-action="play-video" data-video="${videoUrl}" data-name="${ex.name}" aria-label="Ver vídeo">
            ${icon('play', { size: 16, color: '#fff' })}
            <span>Ver vídeo de execução</span>
          </button>
        </div>` : ''}

      <div class="guided-card__sets">
        <div class="guided-card__sets-label">
          <span>${exerciseFullyDone ? 'Exercício concluído' : `Série ${setsDone + 1} de ${totalSets}`}</span>
          <span class="guided-card__reps">${repsLabel}</span>
        </div>
        <div class="set-dots">${dots}</div>
      </div>

      <div class="guided-card__weight">
        <label class="guided-card__weight-label">Peso usado</label>
        <div class="guided-card__weight-input">
          <input
            type="number"
            inputmode="decimal"
            min="0"
            max="500"
            step="0.5"
            data-action="weight-change"
            data-ex="${ex.id}"
            placeholder="—"
            value="${entry.weight ?? ''}"
            aria-label="Peso em kg"
          />
          <span>kg</span>
        </div>
      </div>

      ${nextEx ? `
        <div class="guided-card__next">
          <span class="guided-card__next-label">Próximo</span>
          <span class="guided-card__next-name">${nextEx.name}</span>
        </div>` : ''}
    </div>
  `;
}

function renderRestOverlay(secLeft, ex, entry, idx, total) {
  const nextSet = entry.setsDone + 1;
  const isLastSet = nextSet > ex.sets;
  const sublabel = isLastSet
    ? `próximo exercício`
    : `próxima série · ${nextSet} de ${ex.sets}`;
  return `
    <div class="rest">
      <div class="rest__inner">
        <div class="rest__label">DESCANSO</div>
        <div class="rest__time">${formatTime(secLeft)}</div>
        <div class="rest__sub">${sublabel}</div>
        <div class="rest__actions">
          <button class="btn btn--ghost" data-action="add-rest">
            ${icon('plus', { size: 14, color: 'var(--sf-text)' })}
            +15s
          </button>
          <button class="btn btn--primary" data-action="skip-rest">
            Pular descanso
            ${icon('arrow-right', { size: 14, color: '#fff' })}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderAllDoneState(workout, totalSetsCompleted) {
  return `
    <div class="guided-done">
      <div class="guided-done__icon">${icon('check', { size: 48, color: '#fff', strokeWidth: 2.5 })}</div>
      <div class="display" style="font-size: 38px; letter-spacing: 1.5px;">TREINO COMPLETO</div>
      <p class="muted" style="margin-top: 8px;">Você terminou todas as séries de ${workout.exercises.length} exercícios — ${totalSetsCompleted} séries no total.</p>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// Modo LISTA (original)
// ─────────────────────────────────────────────────────────────
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

function renderListMode(root, ctx) {
  const { workout, session, readOnly, isThisDoneToday, todaySession } = ctx;

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
        ${readOnly ? '' : `
          <a class="icon-btn" href="${workoutBaseHash(workout.id)}" aria-label="Modo guiado" title="Modo guiado">
            ${icon('play', { size: 16, color: 'var(--sf-text)' })}
          </a>`}
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
    root.querySelector('[data-action="back"]').addEventListener('click', () => {
      window.location.hash = '#/';
    });
    root.querySelectorAll('[data-action="play-video"]').forEach(btn => {
      btn.addEventListener('click', () => {
        showVideo({ title: btn.dataset.name, url: btn.dataset.video });
      });
    });

    if (readOnly) {
      root.querySelectorAll('[data-action="toggle"]').forEach(b => b.setAttribute('disabled', ''));
      root.querySelectorAll('[data-action="weight-change"]').forEach(i => i.setAttribute('disabled', ''));
      return;
    }

    root.querySelectorAll('.exercise').forEach(row => {
      const exId = row.dataset.ex;

      row.querySelector('[data-action="toggle"]').addEventListener('click', () => {
        const entry = session.completed.find(c => c.exerciseId === exId);
        entry.done = !entry.done;
        // Sincroniza setsDone para coerência entre os 2 modos
        const ex = workout.exercises.find(e => e.id === exId);
        entry.setsDone = entry.done ? ex.sets : 0;
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
      const queue = [];
      if (result.leveledUp) {
        queue.push({ type: 'levelup', newLevel: result.newLevel, totalXp: getProgress().totalXp });
      }
      for (const badge of result.newBadges || []) {
        queue.push({ type: 'badge', badge, xpEarned: result.xpEarned });
      }
      if (queue.length === 0) {
        showCompletionToast(result);
        setTimeout(() => { window.location.hash = '#/'; }, 800);
        return;
      }
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
