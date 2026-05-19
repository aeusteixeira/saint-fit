# Handoff: Saint Fit — PWA Academia

> Pacote de handoff para implementação do PWA **Saint Fit**, app de academia do condomínio Saint Simon Torre 02 (São Paulo), a partir dos mockups de design.

---

## Overview

Saint Fit é um **PWA (instalável, offline-first, single-user por dispositivo)** que substitui planilhas de treino na academia compartilhada do condomínio. O app:

- Coleta perfil + objetivos no primeiro uso (onboarding).
- Gera e mostra um plano ABC de treinos.
- Permite executar o treino do dia marcando exercícios concluídos e registrando peso.
- Acompanha histórico, streak e progresso via sistema de níveis + conquistas (gamificação é o coração emocional do produto).
- Funciona instalado na home screen do iOS/Android, sem servidor obrigatório (storage local).

## About the Design Files

Os arquivos em `design_files/` são **referências de design criadas em HTML/React (Babel inline)** — protótipos que mostram aparência, layout e comportamento pretendidos. **Não é production code.** A tarefa é **recriar essas telas no stack escolhido para o PWA**, usando os padrões e bibliotecas estabelecidos.

Como o projeto não tem um codebase existente, o desenvolvedor deve **escolher o stack** (recomendações abaixo) e implementar a partir do zero usando os mockups como fonte da verdade visual.

### Stack recomendado (livre escolha do dev)

- **Framework:** React + Vite (build leve, ótimo HMR, PWA via `vite-plugin-pwa`)
- **Styling:** CSS Modules ou Tailwind — paleta documentada nos tokens abaixo
- **State:** Zustand ou Context API (single-user, escopo pequeno — não precisa de Redux)
- **Storage:** IndexedDB via `idb` ou localStorage para perfil + histórico
- **PWA:** Workbox (offline cache de shell + assets), Web App Manifest, install prompt customizado
- **Tipografia:** Google Fonts (Bebas Neue + DM Sans) ou self-host

## Fidelity

**High-fidelity (hifi).** Mockups com cores, tipografia, espaçamento e estados finais. O dev deve recriar pixel-perfect, respeitando:

- Paleta exata (hex codes nos design tokens abaixo).
- Tipografia exata (Bebas Neue para títulos, DM Sans para corpo).
- Border-radius, shadows, glows conforme especificado.
- Hierarquia visual: telas de gamificação (07, 08, 09) têm maior peso visual — são onde o usuário sente progresso.

## Screens / Views

O app tem **7 telas principais** + **2 modais**. A bottom nav tem 6 itens (Início · Treino · Planos · Equip · Evolução · Perfil).

### 01 · Onboarding (`Screen1_Onboarding`)
**Purpose:** Primeira execução — coletar dados pra gerar o plano de treino.

**Layout:** Single column scroll, container 24px padding lateral. CTA fixo no rodapé com gradient fade.

**Componentes:**
- **Header centralizado** — Logo "SAINT FIT" em Bebas Neue 44px, roxo `#7B2FBE`, letter-spacing 3. Subtítulo "Academia · Saint Simon Torre 02" em DM Sans 12px, cinza `#888`.
- **Label de seção** — DM Sans 11px / 600 / uppercase / letter-spacing 1, cor `#888`.
- **Text input** — 48px de altura, radius 12, bg `#1A1A1A`, border `#2A2A2A`, padding lateral 16px, fonte DM Sans 15px.
- **Pill buttons (Masc/Fem, Iniciante/Voltando/Intermed., 30min/45min/1h/+1h)** — flex row gap 10, cada pill 42px altura / radius 999 / border 1px. Ativo: bg `rgba(123,47,190,0.16)`, border `#7B2FBE`. Inativo: border `#2A2A2A`, texto `#888`.
- **Objective cards (grid 2x2)** — 78px altura, radius 14, padding 12, emoji top-left + label bottom. Ativo herda mesmo tratamento das pills.
- **Day buttons (S T Q Q S S D)** — circulares 36×36, border 1.5. Ativo: bg `#7B2FBE`, texto branco. Inativo: border `#2A2A2A`, texto `#888`.
- **Checkboxes (limitações)** — quadrado 20×20 radius 5, border 1.5. Marcado: bg `#2ECC71`, check preto.
- **CTA "Gerar meu treino"** — 54px altura, radius 14, bg `#1F8A4D` (verde escuro), border `#2ECC71`, fonte DM Sans 15 / 700. Ícone sparkle à esquerda, arrow-right à direita.

**Interactions:**
- Pills, days, checkboxes têm seleção persistida em estado local.
- Form validation: nome obrigatório, peso > 0, ao menos 1 objetivo, ao menos 1 dia, tempo selecionado. CTA fica disabled (opacity 0.4) até passar validação.
- Ao tocar CTA: gera plano (lógica abaixo), persiste perfil em storage, redireciona pra `02 · Home`.

---

### 02 · Home / Dashboard (`Screen2_Home`)
**Purpose:** Landing após onboarding. Mostra o treino do dia + progresso semanal + histórico.

**Layout:** Scroll vertical, padding 20px. Bottom nav fixa.

**Componentes:**
- **Greeting row** — "Bom dia, Matheus 👋" DM Sans 19 / 700. Data abaixo com ícone calendar 12px. Saudação muda por horário (Bom dia / Boa tarde / Boa noite). À direita: badge de notificação circular 40×40 com dot accent.
- **Hero card (treino do dia)** — radius 20, padding 22. Background gradient `linear-gradient(135deg, #4A1B73 0%, #1A1A1A 100%)`, border 1px `#7B2FBE`. Glow blob top-right (140px, blur 40, opacity 0.4). Conteúdo:
  - Pill "Hoje" branca translúcida.
  - "TREINO A" em Bebas Neue 56px, letter-spacing 2.
  - Subtitle "Peito + Tríceps · 6 exercícios" 14px.
  - Meta: clock + 55 min · dumbbell + Médio.
  - Botão "Iniciar treino" — bg branco, texto preto, 48px, radius 12, com ícone play.
- **Progresso semanal card** — radius 16, padding 16, bg `#1A1A1A`. Row de 7 day-circles (SEG–DOM):
  - Done: bg `#2ECC71`, check preto.
  - Today: bg `#7B2FBE`, dot branco interno.
  - Upcoming: border sólida cinza, vazio.
  - Rest day: border tracejada cinza.
- **Histórico recente** — título "ÚLTIMOS TREINOS" Bebas 20. Lista de 3 items:
  - Avatar circular 36×36 com check verde no background `rgba(46,204,113,0.14)`.
  - Nome do treino (DM Sans 14/600) + foco (11.5px cinza).
  - Data ("Sex", "Qui", "Ter") à direita em cinza claro.

---

### 03 · Treino do Dia (`Screen3_Workout`)
**Purpose:** Execução. Listar exercícios, marcar conclusão, registrar peso usado.

**Layout:**
- Top bar fixa com back button + título + more button.
- Card de progresso (% feito).
- Lista vertical de exercícios.
- CTA "Concluir treino" fixo no rodapé.

**Componentes:**
- **Top bar** — pos absolute top 54px, padding 4 20 14. Back button 36×36 circular. Title Bebas 26 + subtitle 11.5px.
- **Progress card** — bg `rgba(123,47,190,0.16)`, border roxo. "X de 6 concluídos" + barra horizontal 4px + "33%" Bebas 26 à direita.
- **Exercise card** — radius 14, bg `#1A1A1A`, border `#2A2A2A`, padding 14. Estrutura horizontal:
  - **Checkbox** circular 24×24 (esquerda). Done: bg verde + check preto.
  - **Corpo** — nome do exercício (DM Sans 14.5/700, riscado se done), equipamento (11.5px cinza), e linha de 2 elementos:
    - **Pill reps** "3 × 12" — bg `rgba(123,47,190,0.16)`, border roxo, texto roxo 11/700.
    - **Peso input** — bg `#0F0F0F`, border `#2A2A2A`, label "Peso" cinza + valor branco "14 kg" ou "— kg".
  - **Número** "01", "02" etc. à direita em Bebas 18 cinza.
  - **Tag "Adaptado"** em laranja `#F0A500` com ícone alert, mostrada quando há limitação física conflitante.
  - Done state: opacity 0.65, bg `#141414`.
- **CTA "Concluir treino"** — 50px verde, com fade-out gradient acima.

**Interactions:**
- Tocar checkbox alterna concluído. Atualiza % e contador.
- Tap no peso abre input numérico nativo (`<input type="number">`).
- CTA só fica ativo quando todos os exercícios estão checked (ou permite "concluir parcial" como tweak).
- Ao concluir: persiste sessão no histórico (data + exercícios + pesos), atualiza streak, possivelmente dispara level-up ou badge modal (telas 08/09).

---

### 04 · Meus Treinos / Planos (`Screen4_Plans`)
**Purpose:** Vista dos 3 treinos do plano ABC.

**Layout:** Scroll, padding 20.

**Componentes:**
- Título Bebas 42 "MEUS TREINOS" + subtítulo "Plano ABC · 4 dias por semana".
- **Stats row** — 3 cards: Esta semana (3/5), Streak (12d), Total (47). 12px padding, radius 12, label uppercase + valor Bebas 22.
- **Plan cards** — radius 18, accent stripe vertical 4px na cor do treino. Conteúdo:
  - Quadrado 64×64 com letra "A"/"B"/"C" gigante (Bebas 36) na cor do treino.
  - Header: "TREINO A" Bebas 22 + tag dos dias ("Seg · Qui") na cor de accent.
  - Foco (13px) e "6 exercícios" (11.5px cinza).
  - Chevron right.
  - Cores: A = roxo `#7B2FBE`, B = verde `#2ECC71`, C = dourado `#F0A500`.
- **"Regenerar plano"** — botão dashed full-width, cinza.

---

### 05 · Equipamentos (`Screen5_Equipment`)
**Purpose:** Catálogo dos equipamentos da academia com filtros por grupo muscular.

**Layout:** Padding 20, grid 2 colunas com gap 10.

**Componentes:**
- Título "EQUIPAMENTOS" + subtítulo "6 máquinas · disponíveis 24h".
- **Filter pills** — row horizontal scroll: Todos · Peito · Costas · Pernas · Cardio. Ativo: bg roxo + texto branco. Inativo: bg `#1A1A1A` border `#2A2A2A`.
- **Equipment card** — radius 14, bg `#1A1A1A`:
  - **Image area** 92px altura, gradient `linear-gradient(135deg, #1C1C1C, #0F0F0F)`, ícone Lucide centralizado em `#3A3A3A`. Brand tag pequena top-right.
  - **Body** padding 10/12: nome (DM Sans 12.5/700) + "8 exercícios" cinza + tags de grupo muscular como mini-pills coloridos.

**Note:** as imagens placeholder devem ser substituídas por fotos reais dos equipamentos da academia.

---

### 06 · Perfil (`Screen6_Profile`)
**Purpose:** Dados pessoais, snapshot de nível/streak, ações de gerenciamento.

**Layout:** Scroll padding 20.

**Componentes:**
- Título "MEU PERFIL" Bebas 42.
- **Identity card** — radius 16, padding 18. Avatar circular 62×62 com gradient roxo `linear-gradient(135deg, #7B2FBE, #4A1B73)` mostrando inicial do nome (Bebas 28). Nome (17/700) + "Apto 142 · Torre 02" cinza + pill de objetivo.
- **Level + Streak snapshot** — 2 cards lado a lado, cada um com label uppercase 10px + ícone (sword/flame) + nome do nível Bebas 18 + sublabel.
- **Lista de dados** — Card sem padding interno, cada row com label cinza à esquerda e valor branco à direita, separados por border `#2A2A2A`. Items: Peso · Nível · Dias de treino · Tempo por treino · Limitações.
- **Action buttons** — 3 outline buttons full-width 46px:
  - "Editar perfil" — border + texto roxo.
  - "Regenerar treino" — border + texto verde.
  - "Limpar histórico" — border + texto cinza.

---

### 07 · Gamificação / Minha Evolução (`Screen7_Progress`)
**Purpose:** Coração do app — onde o usuário sente progresso.

**Layout:** Scroll padding 20. **MAIOR carga visual de todas as telas.**

**Componentes:**

- **Hero do nível atual** — radius 22, padding 22. Background `radial-gradient(120% 100% at 50% 0%, rgba(123,47,190,0.22) 0%, #1A1A1A 60%)`, border roxo. Glow blob 200×200 top center.
  - Label "NÍVEL ATUAL" 10.5px roxo letter-spacing 2.
  - **Orb central** 84×84 circular, bg `rgba(123,47,190,0.13)`, border 2px roxo, ícone sword 42px branco. **Box-shadow: `0 0 36px rgba(123,47,190,0.53), inset 0 0 24px rgba(123,47,190,0.27)`** — esse glow é crítico.
  - "GUERREIRO" Bebas 44 letter-spacing 3.
  - "Nível 5 · 4.200 XP" 12px cinza.
  - **XP bar** — full width, 8px altura, radius 4. Preenchimento 93% `linear-gradient(to right, #7B2FBE, #2ECC71)` com box-shadow `0 0 10px #7B2FBE`.
  - Labels acima da barra: "4.200 / 4.500 XP" (cinza) · "próximo: ELITE" (dourado).
  - Abaixo, direita: "faltam 300 XP" pequeno.

- **Streak card** — radius 16, padding 18, com glow accent dourado top-right.
  - Número grande "12" em Bebas 56 dourado + ícone flame 26px dourado preenchido.
  - Label "DIAS SEGUIDOS" uppercase 12px cinza.
  - **Frase motivacional em itálico:** "Doze dias. O hábito já é seu." (gerar dinamicamente por streak count).
  - **Mini calendar 14 dias** — row de 14 retângulos 22px altura radius 5. Estados: feito (verde sólido), vazio (cinza), hoje (roxo com glow).

- **Conquistas** — título "CONQUISTAS" Bebas 22 + contador "7 / 20" (7 em verde, 20 em cinza).
  - Card padding 16, grid 4 colunas gap 12.
  - **Badge component**: círculo 56×56 com ícone + label DM Sans 9.5/600 abaixo.
    - Desbloqueada: bg `${color}22`, border `${color}88`, glow `0 0 18px ${color}33`.
    - Bloqueada: bg `#141414`, border `#222`, ícone lock cinza escuro.
  - Conjunto inicial:
    | Slug | Nome | Cor | Ícone | Trigger |
    |---|---|---|---|---|
    | estreante | Estreante | #7CBF8F | sprout | 1º treino |
    | resistente | Resistente | #2ECC71 | bolt | 5 treinos |
    | em_chamas | Em Chamas | #FF6B35 | flame | streak 7 dias |
    | primeira_semana | Primeira Semana | #3A86FF | calendar | semana completa |
    | subiu_nivel | Subiu de Nível | #7B2FBE | medal | qualquer level-up |
    | morador_ativo | Morador Ativo | #F0A500 | house | 30 treinos no condomínio |
    | relampago | Relâmpago | #FFD93D | bolt | treino < 30min |
    | sem_desculpas | Sem Desculpas | — | ghost | locked (treinar em feriado) |
    | elite | Elite | — | trophy | locked (chegar Nível 6) |
    | mestre | Mestre | — | crown | locked (Nível 7) |
    | lendario | Lendário | — | trident | locked (Nível 8) |
    | meia_tonelada | Meia Tonelada | — | scale | locked (somar 500kg num treino) |

- **Histórico de XP** — título Bebas 22. Card padding 4/14. Lista de eventos:
  - Avatar 32×32 circular com ícone na cor temática.
  - Label (13/600) + data abaixo (10.5px cinza).
  - "+100" em Bebas 18 verde à direita.

---

### 08 · Level Up (modal) (`Screen8_LevelUp`)
**Purpose:** Celebração ao subir de nível. Aparece como overlay sobre tela 07.

**Layout:** Overlay full-screen, card centralizado horizontalmente, 24px de padding lateral.

**Componentes:**
- **Backdrop** — `rgba(0,0,0,0.7)` com `backdrop-filter: blur(8px)`.
- **Confetti** — 32 partículas absolute-positioned (mix de retângulos 4×8–8×16 e círculos), cores [#7B2FBE, #2ECC71, #F0A500, #fff, #FF6B35], rotações aleatórias mas **determinísticas** (seed fixa pra screenshot consistente — em produção pode ser CSS animation).
- **Card central**:
  - Radius 24, bg gradient `linear-gradient(180deg, #1A1A1A, #0F0F0F)`, border 1.5px roxo.
  - **Box-shadow crítica:** `0 0 60px rgba(123,47,190,0.6), 0 30px 60px rgba(0,0,0,0.6)`.
  - Glow blob 300×300 top center.
  - Pill "⚡ NOVO NÍVEL DESBLOQUEADO" roxo.
  - **Orb gigante** 120×120 — `radial-gradient(circle, rgba(123,47,190,0.4) 0%, rgba(123,47,190,0.07) 70%)`, border 2.5px roxo, ícone sword 60px branco. Box-shadow `0 0 50px #7B2FBE, inset 0 0 30px rgba(123,47,190,0.4)`. **Dois anéis concêntricos** ao redor (inset -6 e -14, border roxo translúcido).
  - **"GUERREIRO"** Bebas 56 letter-spacing 3.5.
  - "Nível 5 alcançado" 13/600 roxo uppercase.
  - **Chip XP total** — pill "4.500 XP acumulados" com ícone sparkle dourado.
  - Divisor com gradient horizontal cinza.
  - **Frase motivacional centralizada:** "Você treinou quando não estava com vontade. Isso é o que separa os que chegam dos que desistem." (DM Sans 13.5 italic, line-height 1.55).
  - **CTA "Continuar"** — 52px, bg roxo sólido, box-shadow `0 8px 24px rgba(123,47,190,0.4)`.

**Animation suggestion:** entrada do card com scale `0.85 → 1` + opacity `0 → 1` (300ms cubic-bezier(0.18, 0.89, 0.32, 1.28)). Confetti caindo + rotacionando (CSS keyframes 1.5s). Ring outer pulsando 2s loop.

**Trigger:** após salvar sessão de treino, se `novoXp + xpAtual ≥ próximoLimite`, mostrar modal antes de retornar à Home.

---

### 09 · Badge Desbloqueada (modal) (`Screen9_Badge`)
**Purpose:** Celebração de conquista específica.

**Layout:** Mesmo padrão visual da tela 08, mas com **paleta secundária verde + accent laranja** (diferenciar de level-up).

**Componentes:**
- Backdrop + confetti (mesma receita).
- Card border verde `#2ECC71`, box-shadow `0 0 60px rgba(46,204,113,0.47)`.
- Pill "CONQUISTA DESBLOQUEADA" verde com texto preto.
- **Badge artwork central** 130×130:
  - Anel externo dashed `1.5px dashed rgba(255,107,53,0.47)`.
  - Anel intermediário sólido `1px rgba(255,107,53,0.33)`.
  - **Orb interno** com gradient esférico `radial-gradient(circle at 30% 25%, #FFB85B 0%, #FF6B35 55%, #B23A1A 100%)`. Box-shadow `0 0 40px rgba(255,107,53,0.67), inset -8px -10px 20px rgba(0,0,0,0.4), inset 6px 6px 20px rgba(255,255,255,0.2)` — efeito de esfera 3D.
  - Ícone flame 56px branco preenchido, drop-shadow.
  - **3 pontos sparkle** branco brilhante ao redor (posições fixas).
- "EM CHAMAS" Bebas 48 letter-spacing 3.
- "7 dias consecutivos de treino" descrição 13px cinza.
- **Stats row 2 cards:**
  - "XP GANHO": +80 em Bebas 22 verde.
  - "DESBLOQUEADA EM": 18 mai 2026 (DM Sans 13.5/700).
- Hint de próxima conquista: "Continue treinando por mais 8 dias para desbloquear **Imparável**." (12.5px com nome da próxima badge em branco bold).
- CTA "Incrível!" verde escuro `#1F8A4D` com border verde.

**Trigger:** após salvar sessão, checar todas as conquistas pending. Se múltiplas, enfileirar modais (uma após a outra) ou empilhar (preferência: enfileirar).

---

## Interactions & Behavior

### Navigation flow
```
Onboarding (1ª vez) ──┐
                      ▼
                  Home (02) ◄──── Bottom nav (Início)
                      │
   ┌──────────────────┼──────────────────┬─────────────────┐
   ▼                  ▼                  ▼                 ▼
Treino do dia    Planos (04)      Equipamentos (05)   Perfil (06)
   (03)              │
   │            Ver detalhes
   ▼            (tela secundária, mesmo layout que 03 mas read-only)
Concluir treino
   │
   ▼
[Check level up?] ──► Modal 08
       │              │
       ▼              ▼
[Check badges?] ──► Modal(s) 09
       │              │
       ▼              ▼
Volta pra Home (02)

Bottom nav (Evolução) ──► Gamificação (07)
```

### Persistência
- **Primeira visita** → mostrar Onboarding (01). Trigger: `localStorage.getItem('saintfit:profile') === null`.
- **Visitas seguintes** → ir direto pra Home (02).
- Sair do app no meio de um treino → restaurar exatamente no mesmo ponto (estado do checkbox + pesos persistidos por exercício).

### Animations / Transitions
- Page transitions: slide horizontal entre tabs da bottom nav (200ms ease-out).
- Checkbox check: scale `0 → 1` no ícone + bg color transition 150ms.
- Hero card hover (PWA pode não ter hover em mobile, mas no desktop instalado sim): glow blob intensifica.
- Modais 08/09: entrada conforme acima.

### Form validation
- Onboarding: validação em onChange + estado disabled do CTA.
- Peso no treino: aceitar 0–500 kg, decimal (0.5 step).

### Loading / Error states
- Geração de plano: 600ms de loading shimmer no botão CTA + mensagem "Montando seu treino…".
- Sem conexão: app funciona normalmente (offline-first); sync de telemetria opcional pode mostrar banner discreto no topo "modo offline" se houver retry pendente.

---

## State Management

### Modelo de dados (sugestão)

```ts
type Profile = {
  name: string;
  sex: 'M' | 'F';
  weight: number;            // kg
  goal: 'lose' | 'gain' | 'both' | 'condition';
  limitations: ('knee' | 'spine' | 'shoulder')[];
  level: 'beginner' | 'returning' | 'intermediate';
  days: ('mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun')[];
  duration: 30 | 45 | 60 | 90;  // minutos
  createdAt: string;
};

type Exercise = {
  id: string;
  name: string;
  equipment: string;       // ex: "Banco MegaGym + Halteres"
  sets: number;
  reps: number | 'max';
  muscleGroup: string[];
  adapted?: boolean;       // quando há limitação física conflitante
};

type Plan = {
  workouts: {
    id: 'A' | 'B' | 'C';
    focus: string;
    days: string[];        // dias da semana
    exercises: Exercise[];
    accentColor: string;
  }[];
  generatedAt: string;
};

type Session = {
  workoutId: 'A' | 'B' | 'C';
  date: string;            // ISO
  completed: { exerciseId: string; weight?: number; done: boolean }[];
  xpEarned: number;
  durationSec: number;
};

type Progress = {
  totalXp: number;
  currentLevel: number;    // 1–8
  streak: number;
  longestStreak: number;
  unlockedBadges: string[];
  sessions: Session[];     // append-only history
};
```

### Stores sugeridas (Zustand)
- `useProfileStore` — perfil + plano gerado.
- `useSessionStore` — sessão atual (treino em andamento).
- `useProgressStore` — XP, nível, streak, badges, histórico.

Todos com middleware de **persistência em localStorage** (ou IndexedDB se o histórico crescer).

### Lógica de gamificação
- **XP por evento** (configurável):
  - Treino concluído: +100
  - Todos os exercícios marcados: +50 bônus
  - Streak 7 dias: +200
  - Semana completa (todos os dias previstos): +150
- **Tabela de níveis** — exigência crescente. Sugestão de curva:
  ```
  L1 → L2: 500
  L2 → L3: 1.000
  L3 → L4: 2.000
  L4 → L5: 3.500
  L5 → L6: 4.500 (mock atual)
  L6 → L7: 6.500
  L7 → L8: 9.000
  L8 → ∞: continua acumulando, exibe "MESTRE LENDÁRIO"
  ```
- **Streak**: incrementa em dia treinado. Reset em dia previsto não treinado (não em descanso!).

---

## Design Tokens

### Cores
```css
--sf-bg:           #0F0F0F;  /* background principal */
--sf-surface:      #1A1A1A;  /* cards */
--sf-surface-alt:  #141414;  /* card desativado */
--sf-primary:      #7B2FBE;  /* roxo vibrante */
--sf-primary-dim:  #4A1B73;  /* roxo escuro */
--sf-primary-soft: rgba(123,47,190,0.16);
--sf-secondary:    #2ECC71;  /* verde vivo */
--sf-secondary-dim:#1F8A4D;
--sf-secondary-soft:rgba(46,204,113,0.14);
--sf-accent:       #F0A500;  /* dourado */
--sf-accent-soft:  rgba(240,165,0,0.14);
--sf-text:         #F5F5F5;
--sf-text-muted:   #888888;
--sf-text-dim:     #5A5A5A;
--sf-border:       #2A2A2A;
--sf-border-strong:#3A3A3A;
--sf-danger:       #E63946;
--sf-blue:         #3A86FF;
--sf-orange:       #FF6B35;
```

### Níveis (cores e ícones)
| Nível | Nome | Cor | Ícone |
|---|---|---|---|
| 1 | Estreante | #888888 | sprout 🌱 |
| 2 | Resistente | #2D6A4F | bolt ⚡ |
| 3 | Dedicado | #2ECC71 | flame 🔥 |
| 4 | Atleta | #3A86FF | shield 💪 |
| 5 | Guerreiro | #7B2FBE | sword ⚔️ |
| 6 | Elite | #F0A500 | trophy 🏆 |
| 7 | Mestre | #FF6B35 | crown 👑 |
| 8 | Lendário | #E63946 | trident 🔱 |

### Tipografia
- **Display:** Bebas Neue — 400. Use em títulos de tela, números de destaque, nomes de níveis. Letter-spacing varia 1–3.5.
- **Body:** DM Sans — 400 / 500 / 600 / 700. Letter-spacing default 0.

### Escala de tamanhos (Bebas)
- Hero: 56px (TREINO A, GUERREIRO, EM CHAMAS)
- Title screen: 42px (MEUS TREINOS, MEU PERFIL)
- Card title: 22–26px (CONQUISTAS, TREINO A header)
- Stat: 18–22px (12 DIAS, +100 XP)

### Escala de tamanhos (DM Sans)
- Hero subtitle: 14–15px
- Body: 13–14px
- Label/caption: 11–12px
- Tag/badge: 9.5–11px

### Spacing
Usar múltiplos de 4: **4 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28**.

### Border radius
- Cards: **16** (padrão) ou 18 (cards primários)
- Buttons / pills: **12** (retangulares), **999** (pills)
- Small chips/tags: **6–8**
- Modal cards: **22–24**
- Avatares e day-circles: **999**

### Shadows / Glows
- Card padrão: `0 1px 3px rgba(0,0,0,0.4)` ou nenhuma (border substitui).
- Hero card: glow blob 140×140 blur 40 atrás do card.
- Orb de nível: `0 0 36px <color>88, inset 0 0 24px <color>44`.
- Modal 08: `0 0 60px <primary>99, 0 30px 60px rgba(0,0,0,0.6)`.

### Iconografia
**Lucide outline** (stroke 1.75). Ícones usados:
- home, dumbbell, list, grid, trophy, user
- calendar, clock, check, chevron-left, chevron-right, arrow-right
- lock, flame, alert-triangle, edit, refresh, trash, plus
- sparkle, play, crown, shield, sword, sprout, bolt, trident, medal, scale, ghost, house, bell

Pacote sugerido: `lucide-react` (npm install lucide-react). Substituir os SVGs custom do mockup.

---

## PWA Specifics

### Web App Manifest (`manifest.webmanifest`)
```json
{
  "name": "Saint Fit",
  "short_name": "Saint Fit",
  "description": "Academia Saint Simon Torre 02",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F0F0F",
  "theme_color": "#7B2FBE",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Service Worker
- Cache-first para shell (HTML, CSS, JS, fontes).
- Cache as Google Fonts CSS + arquivos woff2.
- Sem dados servidor — todo o app é client-only — então não precisa de network-first fallback.

### Install prompt
- Adicionar UI customizada em Perfil ("Instalar app") quando `beforeinstallprompt` for capturado.

### iOS install
- Apple não dispara `beforeinstallprompt`. Mostrar tutorial uma vez ("Compartilhar > Adicionar à Tela de Início") via banner discreto na Home.

### Safe areas
- Usar `env(safe-area-inset-top/bottom)` na bottom nav e no topo do app.

---

## Assets

### Pendentes (precisam ser fornecidos)
- **Ícones do PWA** — 192px, 512px, 512px maskable. Sugestão: usar a letra "S" estilizada em Bebas Neue roxo sobre fundo preto. Splash screens iOS opcionais.
- **Fotos dos equipamentos** — substituir os placeholders cinza na tela 05. 6 fotos, idealmente formato 1:1 ou 4:3, fundo escuro/neutro pra combinar com a UI.
- **Avatar do usuário** — opcional; mock atual usa inicial em gradient roxo.

### Já incluídos no design
- Google Fonts: Bebas Neue + DM Sans (carregados via `<link>`).
- Ícones Lucide-style — todos inline SVG, podem ser substituídos por `lucide-react`.

---

## Files

Arquivos de referência em `design_files/`:

| Arquivo | O que contém |
|---|---|
| `Saint Fit.html` | Entry point. Carrega React + Babel inline, organiza as 9 telas num canvas. |
| `saint-fit-tokens.jsx` | **PRINCIPAL** — paleta SF, componente Icon (SVG inline), Pill, Tag, Card, DisplayText, SFPhone (frame iOS), BottomNav, SFStatusBar. |
| `saint-fit-screens-a.jsx` | Telas 1–3 (Onboarding, Home, Treino). |
| `saint-fit-screens-b.jsx` | Telas 4–6 (Planos, Equipamentos, Perfil). |
| `saint-fit-screens-c.jsx` | Telas 7–9 (Gamificação, Level Up, Badge) + `LEVELS` array + `Badge` component. |
| `design-canvas.jsx` | Wrapper canvas com pan/zoom. Não precisa ser portado — é só a vitrine. |
| `ios-frame.jsx` | Frame iOS de referência (não usado diretamente; o `SFPhone` em tokens cumpre o papel). |

Para ver o design renderizado: abra `Saint Fit.html` em qualquer browser moderno.

---

## Implementation checklist (sugestão)

- [ ] Setup Vite + React + TS + vite-plugin-pwa
- [ ] Importar fontes (Bebas Neue + DM Sans)
- [ ] Criar `tokens.css` com as variáveis CSS acima
- [ ] Componentes base: `<Card>`, `<Pill>`, `<Tag>`, `<Icon>`, `<DisplayText>`, `<BottomNav>`
- [ ] Layout shell: status-bar safe-area + bottom nav fixa + scroll content
- [ ] Rotas (React Router): `/onboarding`, `/`, `/workout/today`, `/plans`, `/equipment`, `/profile`, `/progress`
- [ ] Telas 01–06 (visual)
- [ ] Tela 07 (gamificação — investir tempo no glow do orb e mini-calendar do streak)
- [ ] Modais 08–09 com confetti + animation
- [ ] State management (Zustand stores)
- [ ] Plan generator (lógica simples baseada em objetivo + limitações + dias)
- [ ] XP + level + streak + badge engine
- [ ] PWA: manifest + service worker + install prompt
- [ ] Testes em iPhone real (Safari) + Android (Chrome)

---

## Observações finais

- **Idioma:** todo o app é em **português brasileiro**. Manter copy exatamente como nos mockups (especialmente as frases motivacionais das telas 07 e 08 — fazem parte da identidade).
- **Tom:** sério, premium, energético. Não é app fitness genérico — é o app *da academia do meu condomínio*. Copy direta, sem gamificação infantilizada.
- **Telas 7, 8, 9 são onde o produto ganha alma.** Investir tempo nas micro-animações e nos glows. Se sobrar budget, fazer as outras com 80% e essas com 110%.
- **Single-user, single-device, sem backend obrigatório.** Mas deixar pronto pra um futuro sync (estrutura de dados serializável).
