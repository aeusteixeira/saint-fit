// Form cues + sugestões de substituição por exercício.
// Cues curtos (1 frase) que aparecem no card do modo guiado pra reforçar técnica.
// Substituições: ao invés de uma matriz complexa, derivamos pelo nome do grupo muscular.

const FORM_CUES = {
  'Supino Reto com Halteres':     'Mantenha as escápulas retraídas e cotovelos a ~75° do tronco.',
  'Crucifixo Inclinado':          'Cotovelos levemente flexionados — não dobra mais ao descer.',
  'Crossover na Polia':           'Tronco levemente inclinado pra frente, contraia o peito no encontro.',
  'Tríceps na Polia':             'Cotovelos colados ao tronco — só o antebraço se move.',
  'Tríceps Francês':              'Cotovelos fixos apontando pra cima, não abra eles.',
  'Flexão de Braço':              'Core firme, corpo em linha reta. Não deixe o quadril cair.',
  'Puxada Frontal':               'Puxe com as costas, não com os braços. Junte as escápulas.',
  'Remada Curvada':               'Tronco inclinado, coluna neutra. Puxe até o abdômen.',
  'Remada na Polia Baixa':        'Peito aberto, ombros pra trás. Puxe até o umbigo.',
  'Remada Baixa':                 'Mesmo conceito: aperte as escápulas no fim do movimento.',
  'Rosca Direta':                 'Cotovelos colados ao corpo, não balance o tronco.',
  'Rosca Martelo':                'Punhos neutros (polegares pra cima) ao longo do movimento.',
  'Encolhimento':                 'Subir reto pra cima — não rola os ombros.',
  'Abdominal Supra':              'Lombar colada no chão. Suba contraindo, sem puxar a nuca.',
  'Agachamento Livre':            'Joelhos acompanham a ponta do pé. Peito ereto, lombar neutra.',
  'Cadeira Extensora':            'Não trave o joelho no topo — contraia, segura 1s.',
  'Cadeira Flexora':              'Movimento controlado na descida. Quadril colado no banco.',
  'Cadeira Abdutora':             'Tronco encostado no banco, movimento só dos quadris abrindo. Aperte o glúteo no fim.',
  'Stiff':                        'Lombar neutra, joelhos levemente flexionados, quadril pra trás.',
  'Mesa Flexora':                 'Quadril colado no banco. Não levante o tronco ao subir o peso.',
  'Plataforma Vibratória':        'Joelhos levemente flexionados. Mantenha o core engajado.',
  'Caminhada Inclinada':          'Não se segure nas alças — deixa o esforço acontecer.',
  'Bike Intervalado':             'Postura ereta no sprint, respiração ritmada.',
  'Prancha':                      'Corpo em linha reta. Não deixa o quadril cair nem subir.',
  'Ponte de Glúteo':              'Aperte o glúteo no topo, não force a lombar.',
};

export function getFormCue(exerciseName) {
  return FORM_CUES[exerciseName] || null;
}

// Substitutos pra um exercício — outros do mesmo grupo muscular, no plano atual,
// excluindo o próprio. Limitado por relevância (mesmo grupo principal).
export function getSubstitutes(exerciseName, plan) {
  if (!plan?.workouts) return [];
  const allExercises = plan.workouts.flatMap(w => w.exercises);
  const self = allExercises.find(e => e.name === exerciseName);
  if (!self?.muscleGroup?.length) return [];

  const selfGroups = new Set(self.muscleGroup);
  const candidates = allExercises.filter(e => {
    if (e.name === exerciseName) return false;
    return e.muscleGroup?.some(g => selfGroups.has(g));
  });

  // Dedupe por nome (mesmo exercício pode aparecer em treinos adaptados)
  const seen = new Set();
  return candidates.filter(e => {
    if (seen.has(e.name)) return false;
    seen.add(e.name);
    return true;
  }).slice(0, 6); // máx 6 sugestões pra não virar lista infinita
}
