// Tutorial videos for each exercise (Brazilian Portuguese).
// Keyed by the exercise name as it appears in plan-generator.js.
// Looked up at render time so existing stored plans get videos without regeneration.
export const EXERCISE_VIDEOS = {
  // Workout A — Peito + Tríceps
  'Supino Reto com Halteres': 'https://www.youtube.com/watch?v=tDxKGeY-hjQ',
  'Crucifixo Inclinado':      'https://www.youtube.com/watch?v=pfyYN8QwM54',
  'Crossover na Polia':       'https://www.youtube.com/watch?v=Dv5M7NyeJms',
  'Tríceps na Polia':         'https://www.youtube.com/watch?v=7le1JRUUagM',
  'Tríceps Francês':          'https://www.youtube.com/watch?v=gB-QMYMlHLs',
  'Flexão de Braço':          'https://www.youtube.com/watch?v=H23VZ7IZwG4',
  'Abdominal Supra':          'https://www.youtube.com/watch?v=hZVIstfFsIc',

  // Workout B — Costas + Bíceps
  'Puxada Frontal':           'https://www.youtube.com/watch?v=25XTUWnt_R4',
  'Remada Curvada':           'https://www.youtube.com/watch?v=aEk2KG_DmOk',
  'Remada na Polia Baixa':    'https://www.youtube.com/watch?v=2YebbYuuBJQ',
  'Remada Baixa':             'https://www.youtube.com/watch?v=HZPqEGzrLRg',
  'Rosca Direta':             'https://www.youtube.com/watch?v=p2S4e8xRCkI',
  'Rosca Martelo':            'https://www.youtube.com/watch?v=BjqLAjsIs_Y',
  'Encolhimento':             'https://www.youtube.com/watch?v=rYyBAjehdx0',
  'Prancha':                  'https://www.youtube.com/watch?v=9dn5Fb3cSoE',

  // Workout C — Pernas
  'Agachamento Livre':        'https://www.youtube.com/watch?v=taK1dUUT2_I',
  'Plataforma Vibratória':    'https://www.youtube.com/watch?v=N4n6HlB1KxA',
  'Cadeira Extensora':        'https://www.youtube.com/watch?v=_MMk7gbuSDA',
  'Cadeira Flexora':          'https://www.youtube.com/watch?v=AFG0wxXmTH4',
  'Stiff':                    'https://www.youtube.com/watch?v=601YoPL6y6E',
  'Mesa Flexora':             'https://www.youtube.com/watch?v=sWSm1pWb3lw',
  'Caminhada Inclinada':      'https://www.youtube.com/watch?v=msGx6m-Q6Ro',
  'Bike Intervalado':         'https://www.youtube.com/watch?v=dCAU_vsgI1g',
  'Ponte de Glúteo':          'https://www.youtube.com/watch?v=1nEL_H0lnNc',
};

export function getVideoFor(exerciseName) {
  if (EXERCISE_VIDEOS[exerciseName]) return EXERCISE_VIDEOS[exerciseName];
  const query = encodeURIComponent(`${exerciseName} execução correta`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
