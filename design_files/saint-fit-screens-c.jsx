// Saint Fit — Screens 7-9: Gamificação, Level Up, Badge

// Level table reference (mirrors the spec)
const LEVELS = [
  { num: 1, name: 'Estreante',  color: '#888888', icon: 'sprout'   },
  { num: 2, name: 'Resistente', color: '#2D6A4F', icon: 'bolt'     },
  { num: 3, name: 'Dedicado',   color: '#2ECC71', icon: 'flame'    },
  { num: 4, name: 'Atleta',     color: '#3A86FF', icon: 'shield'   },
  { num: 5, name: 'Guerreiro',  color: '#7B2FBE', icon: 'sword'    },
  { num: 6, name: 'Elite',      color: '#F0A500', icon: 'trophy'   },
  { num: 7, name: 'Mestre',     color: '#FF6B35', icon: 'crown'    },
  { num: 8, name: 'Lendário',   color: '#E63946', icon: 'trident'  },
];

// Achievement badge — circle with icon, optional locked state
const Badge = ({ icon, label, color = '#888', locked, size = 56 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: locked ? '#141414' : `${color}22`,
      border: `1.5px solid ${locked ? '#222' : color + '88'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      boxShadow: locked ? 'none' : `0 0 18px ${color}33`,
    }}>
      <Icon name={locked ? 'lock' : icon} size={Math.round(size * 0.42)} color={locked ? '#3A3A3A' : color} strokeWidth={locked ? 1.6 : 1.8} fill={locked ? 'none' : 'none'}/>
    </div>
    <span style={{
      fontFamily: SF.body, fontSize: 9.5, fontWeight: 600,
      color: locked ? SF.textDim : SF.textMuted,
      textAlign: 'center', lineHeight: 1.2, maxWidth: 64,
    }}>{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// SCREEN 7 — Gamificação (Minha Evolução)
// ─────────────────────────────────────────────────────────────
const Screen7_Progress = () => {
  // 14-day streak mini-calendar
  const streakDays = [1,1,0,1,1,1,1, 1,1,1,1,1,1,2]; // 0 empty, 1 done, 2 today

  const xpHist = [
    { icon: 'check',  color: SF.secondary, label: 'Treino concluído',     xp: 100, date: 'Hoje' },
    { icon: 'flame',  color: SF.accent,    label: 'Streak 7 dias',        xp: 200, date: 'Dom' },
    { icon: 'dumbbell', color: SF.primary, label: 'Todos os exercícios',  xp:  50, date: 'Dom' },
    { icon: 'calendar', color: SF.blue,    label: 'Semana completa',      xp: 150, date: 'Dom' },
  ];

  return (
    <SFPhone>
      <div style={{ padding: '64px 20px 100px', height: '100%', overflow: 'auto' }}>
        <div style={{ marginTop: 16, marginBottom: 22 }}>
          <DisplayText size={42} style={{ letterSpacing: 2 }}>MINHA EVOLUÇÃO</DisplayText>
        </div>

        {/* HERO — current level */}
        <div style={{
          position: 'relative', borderRadius: 22, padding: '22px 20px 20px',
          background: `radial-gradient(120% 100% at 50% 0%, ${SF.primary}38 0%, ${SF.surface} 60%)`,
          border: `1px solid ${SF.primary}88`,
          overflow: 'hidden', marginBottom: 16,
        }}>
          {/* corner glow */}
          <div style={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: 999, background: SF.primary, filter: 'blur(60px)', opacity: 0.35 }}/>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: SF.body, fontSize: 10.5, fontWeight: 600, color: SF.primary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
              Nível Atual
            </div>
            <div style={{
              width: 84, height: 84, borderRadius: 999,
              background: `${SF.primary}22`,
              border: `2px solid ${SF.primary}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 36px ${SF.primary}88, inset 0 0 24px ${SF.primary}44`,
              marginBottom: 12,
            }}>
              <Icon name="sword" size={42} color="#fff" strokeWidth={1.6}/>
            </div>
            <DisplayText size={44} style={{ letterSpacing: 3, marginBottom: 2 }}>GUERREIRO</DisplayText>
            <div style={{ fontFamily: SF.body, fontSize: 12, color: SF.textMuted, letterSpacing: 0.5, marginBottom: 18 }}>
              Nível 5 · 4.200 XP
            </div>

            {/* XP bar */}
            <div style={{ width: '100%' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6,
                fontFamily: SF.body, fontSize: 11,
              }}>
                <span style={{ color: SF.textMuted }}>4.200 / 4.500 XP</span>
                <span style={{ color: SF.accent, fontWeight: 700 }}>próximo: ELITE</span>
              </div>
              <div style={{ height: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, overflow: 'hidden', border: `1px solid ${SF.border}` }}>
                <div style={{
                  width: '93%', height: '100%',
                  background: `linear-gradient(to right, ${SF.primary}, ${SF.secondary})`,
                  boxShadow: `0 0 10px ${SF.primary}`,
                }}/>
              </div>
              <div style={{ marginTop: 6, fontFamily: SF.body, fontSize: 10.5, color: SF.textDim, textAlign: 'right' }}>
                faltam 300 XP
              </div>
            </div>
          </div>
        </div>

        {/* Streak card */}
        <Card padding={18} style={{ marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: 999, background: SF.accent, filter: 'blur(50px)', opacity: 0.18 }}/>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                <DisplayText size={56} color={SF.accent} style={{ letterSpacing: 1, lineHeight: 1 }}>12</DisplayText>
                <Icon name="flame" size={26} color={SF.accent} fill={SF.accent} strokeWidth={1.5}/>
              </div>
              <div style={{ fontFamily: SF.body, fontSize: 12, color: SF.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                dias seguidos
              </div>
              <div style={{ fontFamily: SF.body, fontStyle: 'italic', fontSize: 12.5, color: SF.text, marginTop: 12, lineHeight: 1.45, opacity: 0.85 }}>
                "Doze dias. O hábito já é seu."
              </div>
            </div>
          </div>
          {/* 14-day mini calendar */}
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 4 }}>
            {streakDays.map((s, i) => (
              <div key={i} style={{
                flex: 1, height: 22, borderRadius: 5,
                background: s === 1 ? SF.secondary : s === 2 ? SF.primary : '#1F1F1F',
                border: s === 2 ? `1.5px solid ${SF.primary}` : `1px solid ${s === 1 ? SF.secondary : SF.border}`,
                boxShadow: s === 2 ? `0 0 8px ${SF.primary}aa` : 'none',
              }}/>
            ))}
          </div>
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontFamily: SF.body, fontSize: 9, color: SF.textDim }}>
            <span>14 dias atrás</span><span>hoje</span>
          </div>
        </Card>

        {/* Achievements */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <DisplayText size={22} style={{ letterSpacing: 1.5 }}>CONQUISTAS</DisplayText>
          <span style={{ fontFamily: SF.body, fontSize: 12, fontWeight: 600, color: SF.textMuted }}>
            <span style={{ color: SF.secondary }}>7</span> / 20
          </span>
        </div>
        <Card padding={16} style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <Badge icon="sprout"   label="Estreante"      color="#7CBF8F"/>
            <Badge icon="bolt"     label="Resistente"     color={SF.secondary}/>
            <Badge icon="flame"    label="Em Chamas"      color={SF.orange}/>
            <Badge icon="calendar" label="Primeira Semana" color={SF.blue}/>
            <Badge icon="medal"    label="Subiu de Nível" color={SF.primary}/>
            <Badge icon="house"    label="Morador Ativo"  color={SF.accent}/>
            <Badge icon="bolt"     label="Relâmpago"      color="#FFD93D"/>
            <Badge icon="ghost"    label="Sem Desculpas"  locked/>
            <Badge icon="trophy"   label="Elite"          locked/>
            <Badge icon="crown"    label="Mestre"         locked/>
            <Badge icon="trident"  label="Lendário"       locked/>
            <Badge icon="scale"    label="Meia Tonelada"  locked/>
          </div>
        </Card>

        {/* XP history */}
        <DisplayText size={22} style={{ letterSpacing: 1.5, marginBottom: 12, display: 'block' }}>HISTÓRICO DE XP</DisplayText>
        <Card padding={0} style={{ padding: '4px 14px' }}>
          {xpHist.map((h, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: i < xpHist.length - 1 ? `1px solid ${SF.border}` : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999,
                background: `${h.color}1A`, border: `1px solid ${h.color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={h.icon} size={15} color={h.color}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: SF.body, fontSize: 13, fontWeight: 600, color: SF.text }}>{h.label}</div>
                <div style={{ fontFamily: SF.body, fontSize: 10.5, color: SF.textMuted, marginTop: 1 }}>{h.date}</div>
              </div>
              <span style={{ fontFamily: SF.display, fontSize: 18, color: SF.secondary, letterSpacing: 0.5 }}>+{h.xp}</span>
            </div>
          ))}
        </Card>
      </div>
      <BottomNav active="progress"/>
    </SFPhone>
  );
};

// ─────────────────────────────────────────────────────────────
// SCREEN 8 — Level Up celebration modal
// ─────────────────────────────────────────────────────────────
const Confetti = () => {
  // Deterministic confetti positions so the design stays static.
  const pieces = [];
  const colors = [SF.primary, SF.secondary, SF.accent, '#fff', SF.orange];
  // pseudo-random
  let s = 1;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < 32; i++) {
    pieces.push({
      x: r() * 100, y: r() * 100,
      rot: r() * 360,
      w: 4 + r() * 4, h: 8 + r() * 8,
      color: colors[Math.floor(r() * colors.length)],
      shape: r() > 0.5 ? 'rect' : 'circle',
    });
  }
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.w, height: p.shape === 'rect' ? p.h : p.w,
          background: p.color,
          borderRadius: p.shape === 'circle' ? 999 : 1,
          transform: `rotate(${p.rot}deg)`,
          opacity: 0.85,
        }}/>
      ))}
    </div>
  );
};

const Screen8_LevelUp = () => {
  return (
    <SFPhone>
      {/* Dimmed underlying screen (faint gamification preview) */}
      <div style={{
        position: 'absolute', inset: 0, background: SF.bg,
        opacity: 0.4,
      }}>
        <div style={{ padding: '80px 24px', filter: 'blur(2px)' }}>
          <DisplayText size={40} style={{ letterSpacing: 2, opacity: 0.4 }}>MINHA EVOLUÇÃO</DisplayText>
        </div>
      </div>
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
      }}>
        <Confetti/>
        {/* Card */}
        <div style={{
          position: 'relative', width: '100%', borderRadius: 24,
          background: `linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)`,
          border: `1.5px solid ${SF.primary}`,
          boxShadow: `0 0 60px ${SF.primary}99, 0 30px 60px rgba(0,0,0,0.6)`,
          padding: '24px 22px 22px',
          textAlign: 'center',
          overflow: 'hidden',
        }}>
          {/* radial glow */}
          <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: 999, background: SF.primary, filter: 'blur(80px)', opacity: 0.4 }}/>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-block', marginBottom: 18 }}>
              <Pill bg={SF.primary} textColor="#fff" style={{ fontSize: 10, letterSpacing: 1.5, padding: '5px 12px' }}>
                ⚡ Novo Nível Desbloqueado
              </Pill>
            </div>

            {/* Big icon */}
            <div style={{
              width: 120, height: 120, borderRadius: 999,
              margin: '0 auto 18px',
              background: `radial-gradient(circle, ${SF.primary}66 0%, ${SF.primary}11 70%)`,
              border: `2.5px solid ${SF.primary}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 50px ${SF.primary}, inset 0 0 30px ${SF.primary}66`,
              position: 'relative',
            }}>
              <Icon name="sword" size={60} color="#fff" strokeWidth={1.6}/>
              {/* rotating ring accents */}
              <div style={{ position: 'absolute', inset: -6, borderRadius: 999, border: `1px solid ${SF.primary}55` }}/>
              <div style={{ position: 'absolute', inset: -14, borderRadius: 999, border: `1px solid ${SF.primary}22` }}/>
            </div>

            <DisplayText size={56} style={{ letterSpacing: 3.5, lineHeight: 1 }}>GUERREIRO</DisplayText>
            <div style={{ fontFamily: SF.body, fontSize: 13, fontWeight: 600, color: SF.primary, marginTop: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
              Nível 5 alcançado
            </div>

            {/* XP total chip */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: SF.surface, border: `1px solid ${SF.border}`, marginTop: 14 }}>
              <Icon name="sparkle" size={13} color={SF.accent} fill={SF.accent} strokeWidth={0}/>
              <span style={{ fontFamily: SF.body, fontSize: 12.5, fontWeight: 700, color: SF.text }}>
                4.500 XP acumulados
              </span>
            </div>

            {/* divider */}
            <div style={{ margin: '20px auto 16px', height: 1, width: '60%', background: `linear-gradient(to right, transparent, ${SF.border}, transparent)` }}/>

            {/* Motivational */}
            <div style={{
              fontFamily: SF.body, fontSize: 13.5, color: 'rgba(255,255,255,0.85)',
              fontStyle: 'italic', lineHeight: 1.55, padding: '0 8px', textWrap: 'pretty',
            }}>
              "Você treinou quando não estava com vontade. Isso é o que separa os que chegam dos que desistem."
            </div>

            {/* CTA */}
            <div style={{
              marginTop: 22, height: 52, borderRadius: 14,
              background: SF.primary,
              boxShadow: `0 8px 24px ${SF.primary}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: '#fff', fontFamily: SF.body, fontWeight: 700, fontSize: 14.5, letterSpacing: 0.3,
            }}>
              Continuar
              <Icon name="arrow-right" size={16} color="#fff"/>
            </div>
          </div>
        </div>
      </div>
    </SFPhone>
  );
};

// ─────────────────────────────────────────────────────────────
// SCREEN 9 — Badge Unlock modal
// ─────────────────────────────────────────────────────────────
const Screen9_Badge = () => {
  return (
    <SFPhone>
      {/* Dimmed underlying */}
      <div style={{ position: 'absolute', inset: 0, background: SF.bg, opacity: 0.4 }}>
        <div style={{ padding: '80px 24px', filter: 'blur(2px)' }}>
          <DisplayText size={40} style={{ letterSpacing: 2, opacity: 0.4 }}>MINHA EVOLUÇÃO</DisplayText>
        </div>
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
      }}>
        {/* Faint sparkles around */}
        <Confetti/>
        <div style={{
          position: 'relative', width: '100%', borderRadius: 24,
          background: `linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)`,
          border: `1.5px solid ${SF.secondary}`,
          boxShadow: `0 0 60px ${SF.secondary}77, 0 30px 60px rgba(0,0,0,0.6)`,
          padding: '24px 22px 22px',
          textAlign: 'center', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 240, height: 240, borderRadius: 999, background: SF.orange, filter: 'blur(80px)', opacity: 0.35 }}/>

          <div style={{ position: 'relative' }}>
            <Pill bg={SF.secondary} textColor="#000" style={{ fontSize: 10, letterSpacing: 1.5, padding: '5px 12px' }}>
              Conquista Desbloqueada
            </Pill>

            {/* Badge artwork */}
            <div style={{ position: 'relative', width: 130, height: 130, margin: '24px auto 18px' }}>
              {/* outer ring */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `1.5px dashed ${SF.orange}77` }}/>
              <div style={{ position: 'absolute', inset: 10, borderRadius: 999, border: `1px solid ${SF.orange}55` }}/>
              {/* inner orb */}
              <div style={{
                position: 'absolute', inset: 18, borderRadius: 999,
                background: `radial-gradient(circle at 30% 25%, #FFB85B 0%, ${SF.orange} 55%, #B23A1A 100%)`,
                boxShadow: `0 0 40px ${SF.orange}aa, inset -8px -10px 20px rgba(0,0,0,0.4), inset 6px 6px 20px rgba(255,255,255,0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="flame" size={56} color="#fff" fill="#fff" strokeWidth={0} style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}/>
              </div>
              {/* sparkle dots */}
              <div style={{ position: 'absolute', top: 4, right: 14, width: 4, height: 4, borderRadius: 999, background: '#fff', boxShadow: '0 0 6px #fff' }}/>
              <div style={{ position: 'absolute', bottom: 12, left: 6, width: 3, height: 3, borderRadius: 999, background: '#fff', boxShadow: '0 0 6px #fff' }}/>
              <div style={{ position: 'absolute', top: 38, left: -2, width: 3, height: 3, borderRadius: 999, background: '#fff', boxShadow: '0 0 5px #fff' }}/>
            </div>

            <DisplayText size={48} style={{ letterSpacing: 3, lineHeight: 1 }}>EM CHAMAS</DisplayText>
            <div style={{ fontFamily: SF.body, fontSize: 13, color: SF.textMuted, marginTop: 8, lineHeight: 1.5 }}>
              7 dias consecutivos de treino
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <div style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: SF.surface, border: `1px solid ${SF.border}` }}>
                <div style={{ fontFamily: SF.body, fontSize: 9.5, color: SF.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 3 }}>XP ganho</div>
                <div style={{ fontFamily: SF.display, fontSize: 22, color: SF.secondary, letterSpacing: 0.5 }}>+80</div>
              </div>
              <div style={{ flex: 1.4, padding: '10px 8px', borderRadius: 12, background: SF.surface, border: `1px solid ${SF.border}` }}>
                <div style={{ fontFamily: SF.body, fontSize: 9.5, color: SF.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 3 }}>Desbloqueada em</div>
                <div style={{ fontFamily: SF.body, fontSize: 13.5, fontWeight: 700, color: SF.text }}>18 mai 2026</div>
              </div>
            </div>

            <div style={{ margin: '18px auto 14px', height: 1, width: '60%', background: `linear-gradient(to right, transparent, ${SF.border}, transparent)` }}/>

            <div style={{ fontFamily: SF.body, fontSize: 12.5, color: SF.textMuted, lineHeight: 1.5, padding: '0 4px' }}>
              Continue treinando por mais 8 dias para desbloquear <span style={{ color: SF.text, fontWeight: 600 }}>Imparável</span>.
            </div>

            {/* CTA */}
            <div style={{
              marginTop: 18, height: 52, borderRadius: 14,
              background: SF.secondaryDim,
              border: `1px solid ${SF.secondary}`,
              boxShadow: `0 8px 24px ${SF.secondary}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: '#fff', fontFamily: SF.body, fontWeight: 700, fontSize: 14.5, letterSpacing: 0.3,
            }}>
              Incrível!
              <Icon name="arrow-right" size={16} color="#fff"/>
            </div>
          </div>
        </div>
      </div>
    </SFPhone>
  );
};

Object.assign(window, { Screen7_Progress, Screen8_LevelUp, Screen9_Badge, LEVELS, Badge });
