// Persistence layer — single-user, single-device.
// Backed by localStorage. No mock seed: data only exists after onboarding.

const KEYS = {
  profile:  'saintfit:profile',
  plan:     'saintfit:plan',
  progress: 'saintfit:progress',
  session:  'saintfit:session',
};

function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('[saintfit] localStorage write falhou', { key, err });
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('saintfit:storage-error', {
        detail: { key, message: err?.message || String(err) },
      }));
    }
    return false;
  }
}

const DAY_MAP = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// ─────────────────────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────────────────────
export function getProfile() { return read(KEYS.profile); }
export function setProfile(profile) { write(KEYS.profile, profile); }
export function hasProfile() { return !!read(KEYS.profile); }

// ─────────────────────────────────────────────────────────────
// Plan
// ─────────────────────────────────────────────────────────────
export function getPlan() { return read(KEYS.plan); }
export function setPlan(plan) { write(KEYS.plan, plan); }

export function getTodayWorkout() {
  const plan = getPlan();
  if (!plan) return null;
  const today = DAY_MAP[new Date().getDay()];
  return plan.workouts.find(w => w.days.includes(today)) || plan.workouts[0];
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function isTodayCompleted() {
  const p = read(KEYS.progress);
  return !!p?.lastTrainedDate && p.lastTrainedDate === todayKey();
}

export function getTodaySessionRecord() {
  const p = read(KEYS.progress);
  if (!p?.sessions?.length) return null;
  const tk = todayKey();
  return p.sessions.find(s => typeof s.date === 'string' && s.date.slice(0, 10) === tk) || null;
}

// ─────────────────────────────────────────────────────────────
// Progress (XP, level, streak, badges, sessions history, XP events)
// ─────────────────────────────────────────────────────────────
const EMPTY_PROGRESS = {
  totalXp: 0,
  currentLevel: 1,
  streak: 0,
  longestStreak: 0,
  unlockedBadges: [],
  sessions: [],
  xpEvents: [],
  lastTrainedDate: null, // ISO date (yyyy-mm-dd, local)
  streakDays: new Array(14).fill(0),
};

function emptyProgress() {
  return {
    ...EMPTY_PROGRESS,
    unlockedBadges: [],
    sessions: [],
    xpEvents: [],
    streakDays: new Array(14).fill(0),
  };
}

export function getProgress() {
  return read(KEYS.progress, null) || emptyProgress();
}
export function setProgress(p) { write(KEYS.progress, p); }
export function resetProgress() { write(KEYS.progress, emptyProgress()); }

// ─────────────────────────────────────────────────────────────
// Active session (workout in progress)
// ─────────────────────────────────────────────────────────────
export function getSession(workoutId) {
  const all = read(KEYS.session, {});
  return all[workoutId] || null;
}
export function setSession(workoutId, session) {
  const all = read(KEYS.session, {});
  all[workoutId] = session;
  write(KEYS.session, all);
}
export function clearSession(workoutId) {
  const all = read(KEYS.session, {});
  delete all[workoutId];
  write(KEYS.session, all);
}
export function startSession(workout) {
  const existing = getSession(workout.id);
  if (existing && existing.completed.length === workout.exercises.length) {
    // Migra sessions antigas que não têm setsDone — defensivo.
    existing.completed.forEach(c => {
      if (typeof c.setsDone !== 'number') c.setsDone = c.done ? Infinity : 0;
    });
    return existing;
  }
  const session = {
    workoutId: workout.id,
    date: new Date().toISOString(),
    completed: workout.exercises.map(ex => ({
      exerciseId: ex.id,
      weight: null,
      done: false,
      setsDone: 0,
    })),
  };
  setSession(workout.id, session);
  return session;
}

// ─────────────────────────────────────────────────────────────
// Reset everything (used by Profile → "Limpar histórico")
// ─────────────────────────────────────────────────────────────
export function wipeAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
