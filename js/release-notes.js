// Sistema de release notes — avisa o usuário sobre mudanças relevantes uma vez.
// Cada nota tem um ID único. Dispensar (qualquer ação) marca como vista no
// localStorage e não aparece de novo.
//
// Pra adicionar uma nova nota no futuro: só anexar no array RELEASE_NOTES
// com um ID novo. A próxima não-vista aparece na entrada do app.

const STORAGE_KEY = 'saintfit:seen-notes';

export const RELEASE_NOTES = [
  {
    id: 'cadeira-abdutora-2026-05',
    icon: '🦵',
    title: 'Novo equipamento adicionado',
    body: 'A <strong>Cadeira Abdutora</strong> entrou no catálogo, e com ela um exercício novo de glúteo médio no <strong>Treino C</strong> (pernas). Pra aparecer no seu plano, é só regenerar o treino aqui no botão abaixo.',
    reassurance: 'Seu histórico — XP, streak, conquistas e treinos concluídos — fica intacto. Só o plano em si é reconstruído com base no seu perfil atual.',
    primaryCta: 'Regenerar treino agora',
    primaryAction: 'regenerate-plan',
    secondaryCta: 'Fazer depois',
  },
];

function readSeen() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function writeSeen(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
}

export function getNextUnseenNote() {
  const seen = new Set(readSeen());
  return RELEASE_NOTES.find(n => !seen.has(n.id)) || null;
}

export function markNoteSeen(id) {
  const seen = readSeen();
  if (!seen.includes(id)) {
    seen.push(id);
    writeSeen(seen);
  }
}
