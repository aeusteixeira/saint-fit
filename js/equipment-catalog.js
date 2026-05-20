// Equipment catalog — real photos from the Saint Simon Torre 02 gym.
// `image` is the path used by both Equipment screen (05) and Exercise cards (03).

export const IMG = {
  cableCrossover:    './assets/equipment/cable-crossover.png',
  legMachine:        './assets/equipment/leg-machine.png',
  bench:             './assets/equipment/bench.png',
  dumbbells:         './assets/equipment/dumbbells.png',
  vibrationPlatform: './assets/equipment/vibration-platform.png',
  resistanceBands:   './assets/equipment/resistance-bands.png',
  treadmill:         './assets/equipment/treadmill.jpg',
  bike:              './assets/equipment/bike.jpg',
  mat:               './assets/equipment/colchonete.webp',
  abductor:          './assets/equipment/cadeira-abdutora.png',
};

export const EQUIPMENT = [
  {
    id: 'cable-crossover',
    name: 'Estação Multifuncional',
    brand: 'Spirit',
    image: IMG.cableCrossover,
    muscleGroups: ['peito', 'costas'],
    exerciseCount: 10,
    filter: ['todos', 'peito', 'costas'],
  },
  {
    id: 'leg-machine',
    name: 'Cadeira Flex./Extensora',
    brand: 'Kikos',
    image: IMG.legMachine,
    muscleGroups: ['pernas'],
    exerciseCount: 4,
    filter: ['todos', 'pernas'],
  },
  {
    id: 'bench',
    name: 'Banco Articulado',
    brand: 'MegaGym',
    image: IMG.bench,
    muscleGroups: ['peito', 'ombros'],
    exerciseCount: 8,
    filter: ['todos', 'peito'],
  },
  {
    id: 'dumbbells',
    name: 'Halteres',
    brand: '2–20 kg',
    image: IMG.dumbbells,
    muscleGroups: ['braços', 'peito', 'costas'],
    exerciseCount: 12,
    filter: ['todos', 'peito', 'costas', 'braços'],
  },
  {
    id: 'treadmill',
    name: 'Esteira',
    brand: 'Cardio',
    image: IMG.treadmill,
    muscleGroups: ['cardio'],
    exerciseCount: 3,
    filter: ['todos', 'cardio'],
  },
  {
    id: 'bike',
    name: 'Bicicleta Ergométrica',
    brand: 'Cardio',
    image: IMG.bike,
    muscleGroups: ['cardio', 'pernas'],
    exerciseCount: 3,
    filter: ['todos', 'cardio'],
  },
  {
    id: 'vibration-platform',
    name: 'Plataforma Vibratória',
    brand: 'Gens',
    image: IMG.vibrationPlatform,
    muscleGroups: ['funcional'],
    exerciseCount: 5,
    filter: ['todos', 'funcional'],
  },
  {
    id: 'resistance-bands',
    name: 'Faixas Elásticas',
    brand: 'Kit',
    image: IMG.resistanceBands,
    muscleGroups: ['funcional', 'braços'],
    exerciseCount: 8,
    filter: ['todos', 'funcional', 'braços'],
  },
  {
    id: 'mat',
    name: 'Colchonete',
    brand: 'Yoga / Fitness',
    image: IMG.mat,
    muscleGroups: ['core', 'funcional'],
    exerciseCount: 6,
    filter: ['todos', 'funcional'],
  },
  {
    id: 'abductor',
    name: 'Cadeira Abdutora',
    brand: 'Kikos',
    image: IMG.abductor,
    muscleGroups: ['pernas', 'posterior'],
    exerciseCount: 1,
    filter: ['todos', 'pernas'],
  },
];

export const FILTERS = [
  { key: 'todos',     label: 'Todos' },
  { key: 'peito',     label: 'Peito' },
  { key: 'costas',    label: 'Costas' },
  { key: 'pernas',    label: 'Pernas' },
  { key: 'braços',    label: 'Braços' },
  { key: 'cardio',    label: 'Cardio' },
  { key: 'funcional', label: 'Funcional' },
];

const MUSCLE_COLOR = {
  peito: '#7B2FBE',
  costas: '#3A86FF',
  pernas: '#2ECC71',
  ombros: '#7B2FBE',
  braços: '#F0A500',
  cardio: '#FF6B35',
  funcional: '#FFD93D',
};

export function muscleColor(name) {
  return MUSCLE_COLOR[name] || '#888';
}
