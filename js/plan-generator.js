// Plan generator — builds an ABC plan from the onboarding profile.
//
// Limitations (joelho/coluna/ombro) trigger either:
//   - replacement: swap exercise for a safer one (marked `adapted: true`)
//   - flag-only:   keep exercise but mark it `adapted: true` so the user knows to be careful
import { IMG } from './equipment-catalog.js';

// Catalog: 3 workouts (A=Peito+Tríceps, B=Costas+Bíceps, C=Pernas).
// Each exercise may declare:
//   conflictsWith: limitations that force a swap → exercise replaced by `replaceWith`.
//   adaptedFor:    limitations that just flag the exercise as "be careful here".
const CATALOG = {
  A: {
    focus: 'Peito + Tríceps',
    intensity: 'Médio',
    accentColor: '#7B2FBE',
    base: [
      { name: 'Supino Reto com Halteres', equipment: 'Banco MegaGym + Halteres',  image: IMG.bench,           sets: 3, reps: 12, muscleGroup: ['peito'], adaptedFor: ['shoulder'] },
      { name: 'Crucifixo Inclinado',       equipment: 'Banco inclinado + Halteres', image: IMG.dumbbells,       sets: 3, reps: 10, muscleGroup: ['peito'] },
      { name: 'Crossover na Polia',        equipment: 'Estação Spirit',            image: IMG.cableCrossover,  sets: 4, reps: 10, muscleGroup: ['peito'],
        adaptedFor: ['shoulder'] },
      { name: 'Tríceps na Polia',          equipment: 'Estação Spirit · corda',    image: IMG.cableCrossover,  sets: 3, reps: 12, muscleGroup: ['triceps'] },
      { name: 'Tríceps Francês',           equipment: 'Halter · banco',            image: IMG.dumbbells,       sets: 3, reps: 12, muscleGroup: ['triceps'], adaptedFor: ['shoulder'] },
      { name: 'Flexão de Braço',           equipment: 'Colchonete',                image: IMG.mat,             sets: 3, reps: 'max', muscleGroup: ['peito'] },
      { name: 'Abdominal Supra',           equipment: 'Colchonete',                image: IMG.mat,             sets: 3, reps: 20, muscleGroup: ['core'], finisher: true },
    ],
  },
  B: {
    focus: 'Costas + Bíceps',
    intensity: 'Médio',
    accentColor: '#2ECC71',
    base: [
      { name: 'Puxada Frontal',     equipment: 'Estação Spirit · barra',   image: IMG.cableCrossover, sets: 4, reps: 10, muscleGroup: ['costas'] },
      { name: 'Remada Curvada',     equipment: 'Halteres',                  image: IMG.dumbbells,      sets: 3, reps: 12, muscleGroup: ['costas'],
        conflictsWith: ['spine'], replaceWith: { name: 'Remada na Polia Baixa', equipment: 'Estação Spirit · triângulo', image: IMG.cableCrossover, sets: 3, reps: 12, muscleGroup: ['costas'] } },
      { name: 'Remada Baixa',       equipment: 'Estação Spirit · triângulo', image: IMG.cableCrossover, sets: 3, reps: 12, muscleGroup: ['costas'] },
      { name: 'Rosca Direta',       equipment: 'Halteres',                  image: IMG.dumbbells,      sets: 3, reps: 12, muscleGroup: ['biceps'] },
      { name: 'Rosca Martelo',      equipment: 'Halteres',                  image: IMG.dumbbells,      sets: 3, reps: 12, muscleGroup: ['biceps'] },
      { name: 'Encolhimento',       equipment: 'Halteres',                  image: IMG.dumbbells,      sets: 3, reps: 15, muscleGroup: ['trapezio'], adaptedFor: ['spine'] },
      { name: 'Prancha',            equipment: 'Colchonete',                image: IMG.mat,            sets: 3, reps: 'max', muscleGroup: ['core'], finisher: true },
    ],
  },
  C: {
    focus: 'Pernas',
    intensity: 'Pesado',
    accentColor: '#F0A500',
    base: [
      { name: 'Agachamento Livre', equipment: 'Halteres',           image: IMG.dumbbells,         sets: 4, reps: 10, muscleGroup: ['pernas'],
        conflictsWith: ['knee', 'spine'], replaceWith: { name: 'Plataforma Vibratória', equipment: 'Plataforma Gens', image: IMG.vibrationPlatform, sets: 3, reps: 'max', muscleGroup: ['pernas'] } },
      { name: 'Cadeira Extensora', equipment: 'Cadeira Kikos',      image: IMG.legMachine,        sets: 4, reps: 12, muscleGroup: ['quadriceps'], adaptedFor: ['knee'] },
      { name: 'Cadeira Flexora',   equipment: 'Cadeira Kikos',      image: IMG.legMachine,        sets: 3, reps: 12, muscleGroup: ['posterior'] },
      { name: 'Stiff',             equipment: 'Halteres',           image: IMG.dumbbells,         sets: 3, reps: 12, muscleGroup: ['posterior'],
        conflictsWith: ['spine'], replaceWith: { name: 'Mesa Flexora', equipment: 'Cadeira Kikos', image: IMG.legMachine, sets: 3, reps: 12, muscleGroup: ['posterior'] } },
      { name: 'Cadeira Abdutora', equipment: 'Cadeira Kikos · abdutores', image: IMG.abductor,       sets: 3, reps: 15, muscleGroup: ['pernas', 'posterior'], adaptedFor: ['knee'] },
      { name: 'Caminhada Inclinada', equipment: 'Esteira',          image: IMG.treadmill,         sets: 1, reps: 'max', muscleGroup: ['cardio'] },
      { name: 'Bike Intervalado',   equipment: 'Bicicleta Ergom.',  image: IMG.bike,              sets: 1, reps: 'max', muscleGroup: ['cardio'] },
      { name: 'Ponte de Glúteo',    equipment: 'Colchonete',        image: IMG.mat,               sets: 3, reps: 15, muscleGroup: ['posterior', 'core'], adaptedFor: ['spine'], finisher: true },
    ],
  },
};

// How many sets to add/remove per exercise based on user experience level.
const EXP_SET_DELTA = { beginner: -1, returning: 0, intermediate: 1 };

// Volume target per session based on duration.
// Used to trim exercises if the user picked a short window.
const DURATION_EXERCISE_COUNT = {
  30: 4,
  45: 5,
  60: 6,
  90: 7,
};

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const WORKOUT_IDS = ['A', 'B', 'C'];

function uid(workoutId, idx) {
  return `${workoutId.toLowerCase()}${idx + 1}`;
}

function resolveExercise(workoutId, baseEx, idx, limitations, expDelta) {
  let ex = baseEx;
  let adapted = false;

  if (baseEx.conflictsWith && baseEx.conflictsWith.some(l => limitations.includes(l))) {
    ex = baseEx.replaceWith;
    adapted = true;
  } else if (baseEx.adaptedFor && baseEx.adaptedFor.some(l => limitations.includes(l))) {
    adapted = true;
  }

  const sets = Math.max(1, (ex.sets || 3) + expDelta);
  return {
    id: uid(workoutId, idx),
    name: ex.name,
    equipment: ex.equipment,
    image: ex.image,
    sets,
    reps: ex.reps,
    muscleGroup: ex.muscleGroup || [],
    adapted,
  };
}

// Distribute selected weekdays across A, B, C in round-robin order.
// Example: days=['mon','tue','thu','fri'] → A=mon, B=tue, C=thu, A=fri.
function distributeDays(selectedDays) {
  const sorted = [...selectedDays].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
  const assigned = { A: [], B: [], C: [] };
  sorted.forEach((day, i) => {
    const wid = WORKOUT_IDS[i % 3];
    assigned[wid].push(day);
  });
  return assigned;
}

export function generatePlan(profile) {
  const limitations = profile.limitations || [];
  const expDelta = EXP_SET_DELTA[profile.level] ?? 0;
  const targetCount = DURATION_EXERCISE_COUNT[profile.duration] ?? 6;
  const assignedDays = distributeDays(profile.days || []);

  const workouts = WORKOUT_IDS.map(id => {
    const spec = CATALOG[id];
    // Reserva 1 vaga para um finisher (core/abs) sempre que houver pelo menos 5 exercícios.
    // 30min mantém o foco 100% no grupo muscular principal; a partir de 45min entra o core.
    const regulars = spec.base.filter(b => !b.finisher);
    const finishers = spec.base.filter(b => b.finisher);
    const finisherSlots = (finishers.length > 0 && targetCount >= 5) ? 1 : 0;
    const regularSlots = Math.max(0, targetCount - finisherSlots);
    const chosen = [
      ...regulars.slice(0, regularSlots),
      ...finishers.slice(0, finisherSlots),
    ];
    const exercises = chosen.map((b, idx) => resolveExercise(id, b, idx, limitations, expDelta));

    return {
      id,
      focus: spec.focus,
      intensity: spec.intensity,
      accentColor: spec.accentColor,
      durationMin: profile.duration,
      days: assignedDays[id],
      exercises,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    workouts,
  };
}
