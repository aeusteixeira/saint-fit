// Progress engine — XP, levels, streak, badges. Pure functions on a progress state.
import { getProgress, setProgress, clearSession } from './state.js';

// Level table — cumulative XP threshold required to REACH this level.
// L1 starts at 0 XP. L2 requires 500 total XP. Etc.
export const LEVELS = [
  { num: 1, name: 'Estreante',  color: '#888888', icon: 'sprout',  threshold: 0,    next: 500   },
  { num: 2, name: 'Resistente', color: '#2D6A4F', icon: 'bolt',    threshold: 500,  next: 1000  },
  { num: 3, name: 'Dedicado',   color: '#2ECC71', icon: 'flame',   threshold: 1000, next: 2000  },
  { num: 4, name: 'Atleta',     color: '#3A86FF', icon: 'shield',  threshold: 2000, next: 3500  },
  { num: 5, name: 'Guerreiro',  color: '#7B2FBE', icon: 'sword',   threshold: 3500, next: 4500  },
  { num: 6, name: 'Elite',      color: '#F0A500', icon: 'trophy',  threshold: 4500, next: 6500  },
  { num: 7, name: 'Mestre',     color: '#FF6B35', icon: 'crown',   threshold: 6500, next: 9000  },
  { num: 8, name: 'Lendário',   color: '#E63946', icon: 'trident', threshold: 9000, next: null  },
];

export function levelInfo(totalXp, currentLevel) {
  const current = LEVELS.find(l => l.num === currentLevel) || LEVELS[0];
  const next = LEVELS.find(l => l.num === currentLevel + 1);
  const ceil = current.next;
  if (!ceil) {
    return { current, next: null, ceil: null, pct: 100, remaining: 0 };
  }
  const pct = Math.max(0, Math.min(100, Math.round((totalXp / ceil) * 100)));
  return { current, next, ceil, pct, remaining: Math.max(0, ceil - totalXp) };
}

function levelFromXp(totalXp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].threshold) return LEVELS[i].num;
  }
  return 1;
}

// Badge definitions. Each has a `trigger(progress, ctx)` predicate.
export const BADGES = [
  { slug: 'estreante',       label: 'Estreante',       color: '#7CBF8F', icon: 'sprout',
    trigger: (p) => p.sessions.length >= 1 },
  { slug: 'resistente',      label: 'Resistente',      color: '#2ECC71', icon: 'bolt',
    trigger: (p) => p.sessions.length >= 5 },
  { slug: 'em_chamas',       label: 'Em Chamas',       color: '#FF6B35', icon: 'flame',
    trigger: (p) => p.streak >= 7 },
  { slug: 'primeira_semana', label: 'Primeira Semana', color: '#3A86FF', icon: 'calendar',
    trigger: (p, ctx) => ctx?.weekCompleted === true },
  { slug: 'subiu_nivel',     label: 'Subiu de Nível',  color: '#7B2FBE', icon: 'medal',
    trigger: (p, ctx) => ctx?.leveledUp === true },
  { slug: 'morador_ativo',   label: 'Morador Ativo',   color: '#F0A500', icon: 'house',
    trigger: (p) => p.sessions.length >= 30 },
  { slug: 'relampago',       label: 'Relâmpago',       color: '#FFD93D', icon: 'bolt',
    trigger: (p, ctx) => (ctx?.durationSec ?? Infinity) < 30 * 60 },
  { slug: 'sem_desculpas',   label: 'Sem Desculpas',   color: '#888',    icon: 'ghost',
    trigger: () => false }, // requires holiday detection — skipped
  { slug: 'elite',           label: 'Elite',           color: '#888',    icon: 'trophy',
    trigger: (p) => p.currentLevel >= 6 },
  { slug: 'mestre',          label: 'Mestre',          color: '#888',    icon: 'crown',
    trigger: (p) => p.currentLevel >= 7 },
  { slug: 'lendario',        label: 'Lendário',        color: '#888',    icon: 'trident',
    trigger: (p) => p.currentLevel >= 8 },
  { slug: 'meia_tonelada',   label: 'Meia Tonelada',   color: '#888',    icon: 'scale',
    trigger: (p, ctx) => (ctx?.totalWeightThisSession ?? 0) >= 500 },
];

// XP rules
const XP = {
  workoutDone:        100,
  fullCompletion:      50,  // bonus when all exercises checked
  streakSeven:        200,  // bonus when streak hits 7 (one-shot per crossing)
  weekCompleted:      150,  // bonus when all planned days for the week are done
};

function toLocalDateKey(d) {
  // yyyy-mm-dd in local time
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function daysBetween(aIso, bIso) {
  // Parse as pure calendar dates via Date.UTC so DST/fuso não introduz drift.
  // Os keys são yyyy-mm-dd da zona do usuário, mas a aritmética é em ms UTC.
  const [ay, am, ad] = aIso.split('-').map(Number);
  const [by, bm, bd] = bIso.split('-').map(Number);
  const a = Date.UTC(ay, am - 1, ad);
  const b = Date.UTC(by, bm - 1, bd);
  return Math.round((b - a) / 86400000);
}

function updateStreakDays(streakDays, todayDoneTodayIdx) {
  // Shift array left so position 13 (right edge) is "today" and 0 is "13 days ago".
  // We assume this is called at most once per day. Simple approach:
  //   shift by 1 (drop oldest), push today as `2` (= today) — but only after we've
  //   committed any "1" for what was today previously.
  const out = [...streakDays];
  // Make previously-"today" become "done" if any
  for (let i = 0; i < out.length; i++) if (out[i] === 2) out[i] = 1;
  // Mark today
  out.shift();
  out.push(2);
  return out;
}

// ─────────────────────────────────────────────────────────────
// Completion handler.
// Returns the deltas useful for UI (xpEarned, leveledUp, newBadges).
// ─────────────────────────────────────────────────────────────
export function completeWorkout({ workout, session, plan }) {
  const progress = { ...getProgress() };
  const now = new Date();
  const todayKey = toLocalDateKey(now);
  const previousLevel = progress.currentLevel;

  // Guard: já concluiu hoje. Não premia de novo (sem isso o usuário consegue
  // farmar XP/badges refazendo o mesmo treino várias vezes no mesmo dia).
  if (progress.lastTrainedDate === todayKey) {
    clearSession(workout.id);
    return {
      xpEarned: 0,
      leveledUp: false,
      previousLevel,
      newLevel: progress.currentLevel,
      newBadges: [],
      fullyCompleted: session.completed.every(c => c.done),
      alreadyCompletedToday: true,
    };
  }

  const completedCount = session.completed.filter(c => c.done).length;
  const total = workout.exercises.length;
  const fullyCompleted = completedCount === total && total > 0;

  // XP
  let xpEarned = XP.workoutDone;
  const events = [{ icon: 'check', color: '#2ECC71', label: 'Treino concluído', xp: XP.workoutDone, date: 'Hoje' }];
  if (fullyCompleted) {
    xpEarned += XP.fullCompletion;
    events.push({ icon: 'dumbbell', color: '#7B2FBE', label: 'Todos os exercícios', xp: XP.fullCompletion, date: 'Hoje' });
  }

  // Streak math
  const prev = progress.lastTrainedDate;
  let newStreak = progress.streak;
  if (!prev) {
    newStreak = 1;
  } else if (prev === todayKey) {
    // same day, don't bump
  } else {
    const gap = daysBetween(prev, todayKey);
    newStreak = gap === 1 ? progress.streak + 1 : 1;
  }
  const crossedSeven = progress.streak < 7 && newStreak >= 7;
  if (crossedSeven) {
    xpEarned += XP.streakSeven;
    events.push({ icon: 'flame', color: '#F0A500', label: 'Streak 7 dias', xp: XP.streakSeven, date: 'Hoje' });
  }

  // Week completion: check if all planned days in current week have a training session.
  const trainedSet = new Set(progress.sessions.map(s => s.date.slice(0, 10)));
  trainedSet.add(todayKey);
  const plannedDaysThisWeek = collectPlannedDaysThisWeek(plan, now);
  const weekCompleted = plannedDaysThisWeek.length > 0 &&
    plannedDaysThisWeek.every(d => trainedSet.has(d));
  if (weekCompleted) {
    xpEarned += XP.weekCompleted;
    events.push({ icon: 'calendar', color: '#3A86FF', label: 'Semana completa', xp: XP.weekCompleted, date: 'Hoje' });
  }

  // Apply to progress
  progress.totalXp += xpEarned;
  progress.currentLevel = levelFromXp(progress.totalXp);
  progress.streak = newStreak;
  progress.longestStreak = Math.max(progress.longestStreak || 0, newStreak);
  progress.lastTrainedDate = todayKey;

  // streakDays: only shift if it's a new day (different from prev)
  if (prev !== todayKey) {
    progress.streakDays = updateStreakDays(progress.streakDays || new Array(14).fill(0), 13);
  }

  // Session record
  const totalWeight = session.completed.reduce((acc, c) => {
    if (!c.done || !c.weight) return acc;
    const ex = workout.exercises.find(e => e.id === c.exerciseId);
    const sets = ex?.sets || 0;
    const reps = typeof ex?.reps === 'number' ? ex.reps : 1;
    return acc + (c.weight * sets * reps);
  }, 0);

  progress.sessions = [
    {
      workoutId: workout.id,
      focus: workout.focus,
      date: now.toISOString(),
      xpEarned,
      fullyCompleted,
    },
    ...progress.sessions,
  ];

  // XP events log (cap at 20)
  progress.xpEvents = [...events.reverse(), ...(progress.xpEvents || [])].slice(0, 20);

  // Badges
  const leveledUp = progress.currentLevel > previousLevel;
  const ctx = { weekCompleted, leveledUp, totalWeightThisSession: totalWeight };
  const newlyUnlocked = [];
  for (const b of BADGES) {
    if (progress.unlockedBadges.includes(b.slug)) continue;
    if (b.trigger(progress, ctx)) {
      progress.unlockedBadges.push(b.slug);
      newlyUnlocked.push(b);
    }
  }

  setProgress(progress);
  clearSession(workout.id);

  return {
    xpEarned,
    leveledUp,
    previousLevel,
    newLevel: progress.currentLevel,
    newBadges: newlyUnlocked,
    fullyCompleted,
  };
}

function collectPlannedDaysThisWeek(plan, now) {
  if (!plan) return [];
  const today = new Date(now);
  // Monday of this week
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (d > today) break; // only count past + today
    const key = dayMap[d.getDay()];
    const isPlanned = plan.workouts.some(w => w.days.includes(key));
    if (isPlanned) out.push(toLocalDateKey(d));
  }
  return out;
}
