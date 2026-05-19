// Saint Fit — Screens 1-3: Onboarding, Home, Treino do Dia

// ─────────────────────────────────────────────────────────────
// SCREEN 1 — Onboarding
// ─────────────────────────────────────────────────────────────
const Screen1_Onboarding = () => {
  const PillBtn = ({ active, children, w }) => (
    <div style={{
      flex: w ? undefined : 1, width: w,
      height: 42, borderRadius: 999,
      border: `1px solid ${active ? SF.primary : SF.border}`,
      background: active ? SF.primarySoft : 'transparent',
      color: active ? SF.text : SF.textMuted,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: SF.body, fontSize: 13, fontWeight: 600,
    }}>{children}</div>
  );
  const Label = ({ children }) => (
    <div style={{ fontFamily: SF.body, fontSize: 11, fontWeight: 600, color: SF.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{children}</div>
  );
  const ObjCard = ({ icon, label, active }) => (
    <div style={{
      flex: 1, height: 78,
      borderRadius: 14, padding: 12,
      background: active ? SF.primarySoft : SF.surface,
      border: `1px solid ${active ? SF.primary : SF.border}`,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontFamily: SF.body, fontSize: 13, fontWeight: 600, color: active ? SF.text : SF.text }}>{label}</span>
    </div>
  );
  const DayBtn = ({ d, active }) => (
    <div style={{
      width: 36, height: 36, borderRadius: 999,
      border: `1px solid ${active ? SF.primary : SF.border}`,
      background: active ? SF.primary : 'transparent',
      color: active ? '#fff' : SF.textMuted,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: SF.body, fontSize: 12, fontWeight: 700,
    }}>{d}</div>
  );
  const Check = ({ label, checked }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 20, height: 20, borderRadius: 5,
        border: `1.5px solid ${checked ? SF.secondary : SF.borderStrong}`,
        background: checked ? SF.secondary : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {checked && <Icon name="check" size={13} color="#000" strokeWidth={3}/>}
      </div>
      <span style={{ fontFamily: SF.body, fontSize: 14, color: SF.text }}>{label}</span>
    </div>
  );

  return (
    <SFPhone>
      <div style={{ padding: '64px 24px 110px', height: '100%', overflow: 'auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginTop: 16, marginBottom: 28 }}>
          <DisplayText size={44} color={SF.primary} style={{ letterSpacing: 3 }}>SAINT FIT</DisplayText>
          <div style={{ fontFamily: SF.body, fontSize: 12, color: SF.textMuted, marginTop: 6, letterSpacing: 0.5 }}>
            Academia · Saint Simon Torre 02
          </div>
        </div>

        <div style={{ fontFamily: SF.body, fontSize: 13, color: SF.textMuted, marginBottom: 22, lineHeight: 1.5 }}>
          Vamos montar seu treino. Leva menos de 1 minuto.
        </div>

        {/* Name */}
        <Label>Como você se chama</Label>
        <div style={{
          height: 48, borderRadius: 12, background: SF.surface,
          border: `1px solid ${SF.border}`, padding: '0 16px',
          display: 'flex', alignItems: 'center', marginBottom: 20,
          fontFamily: SF.body, fontSize: 15, color: SF.text,
        }}>
          Matheus Silva<span style={{ marginLeft: 1, width: 1.5, height: 18, background: SF.primary }}/>
        </div>

        {/* Sex */}
        <Label>Sexo</Label>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <PillBtn active>Masculino</PillBtn>
          <PillBtn>Feminino</PillBtn>
        </div>

        {/* Weight */}
        <Label>Peso atual</Label>
        <div style={{
          height: 48, borderRadius: 12, background: SF.surface,
          border: `1px solid ${SF.border}`, padding: '0 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
          fontFamily: SF.body, fontSize: 15,
        }}>
          <span>85</span>
          <span style={{ color: SF.textMuted, fontSize: 13 }}>kg</span>
        </div>

        {/* Objetivo */}
        <Label>Objetivo principal</Label>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <ObjCard icon="🔥" label="Emagrecer"/>
          <ObjCard icon="💪" label="Ganhar massa" active/>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <ObjCard icon="⚖️" label="Os dois"/>
          <ObjCard icon="🧘" label="Condicion."/>
        </div>

        {/* Limitações */}
        <Label>Limitações físicas</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <Check label="Joelho" checked/>
          <Check label="Coluna" checked/>
          <Check label="Ombro"/>
          <Check label="Nenhuma"/>
        </div>

        {/* Experiência */}
        <Label>Experiência</Label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <PillBtn>Iniciante</PillBtn>
          <PillBtn active>Voltando</PillBtn>
          <PillBtn>Intermed.</PillBtn>
        </div>

        {/* Dias */}
        <Label>Dias na semana</Label>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <DayBtn d="S" active/>
          <DayBtn d="T" active/>
          <DayBtn d="Q"/>
          <DayBtn d="Q" active/>
          <DayBtn d="S" active/>
          <DayBtn d="S"/>
          <DayBtn d="D"/>
        </div>

        {/* Tempo */}
        <Label>Tempo por treino</Label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          <PillBtn>30min</PillBtn>
          <PillBtn>45min</PillBtn>
          <PillBtn active>1h</PillBtn>
          <PillBtn>+1h</PillBtn>
        </div>
      </div>

      {/* CTA fixo */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 28px',
        background: 'linear-gradient(to top, #0F0F0F 60%, rgba(15,15,15,0))',
        zIndex: 10,
      }}>
        <div style={{
          height: 54, borderRadius: 14, background: SF.secondaryDim,
          border: `1px solid ${SF.secondary}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          color: '#fff', fontFamily: SF.body, fontWeight: 700, fontSize: 15, letterSpacing: 0.3,
        }}>
          <Icon name="sparkle" size={18} color="#fff" fill="#fff" strokeWidth={0}/>
          Gerar meu treino
          <Icon name="arrow-right" size={16} color="#fff"/>
        </div>
      </div>
    </SFPhone>
  );
};

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — Home (Dashboard)
// ─────────────────────────────────────────────────────────────
const Screen2_Home = () => {
  const Day = ({ d, state }) => {
    const styles = {
      done: { bg: SF.secondary, color: '#000', border: SF.secondary },
      today: { bg: SF.primary, color: '#fff', border: SF.primary },
      upcoming: { bg: 'transparent', color: SF.textMuted, border: SF.border },
      rest: { bg: 'transparent', color: SF.textDim, border: SF.border, dash: true },
    }[state];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: SF.body, fontSize: 10, color: SF.textMuted, letterSpacing: 0.5 }}>{d}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 999,
          background: styles.bg,
          border: `1.5px ${styles.dash ? 'dashed' : 'solid'} ${styles.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {state === 'done' && <Icon name="check" size={14} color="#000" strokeWidth={3}/>}
          {state === 'today' && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}
        </div>
      </div>
    );
  };

  const Recent = ({ name, focus, date }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 12,
      background: SF.surface, border: `1px solid ${SF.border}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: SF.secondarySoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="check" size={16} color={SF.secondary} strokeWidth={2.5}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SF.body, fontWeight: 600, fontSize: 14, color: SF.text }}>{name}</div>
        <div style={{ fontFamily: SF.body, fontSize: 11.5, color: SF.textMuted, marginTop: 2 }}>{focus}</div>
      </div>
      <span style={{ fontFamily: SF.body, fontSize: 11, color: SF.textDim }}>{date}</span>
    </div>
  );

  return (
    <SFPhone>
      <div style={{ padding: '64px 20px 100px', height: '100%', overflow: 'auto' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 12, marginBottom: 22 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: SF.body, fontSize: 19, fontWeight: 700, color: SF.text }}>
              Bom dia, Matheus <Icon name="wave" size={20} color={SF.accent}/>
            </div>
            <div style={{ fontFamily: SF.body, fontSize: 12, color: SF.textMuted, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="calendar" size={12} color={SF.textMuted}/> Segunda · 18 mai
            </div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 999,
            background: SF.surface, border: `1px solid ${SF.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Icon name="bell" size={17} color={SF.text}/>
            <div style={{ position: 'absolute', top: 9, right: 11, width: 7, height: 7, borderRadius: 4, background: SF.accent, border: '1.5px solid ' + SF.surface }}/>
          </div>
        </div>

        {/* Hero card */}
        <div style={{
          position: 'relative', borderRadius: 20, padding: 22,
          background: `linear-gradient(135deg, ${SF.primaryDim} 0%, ${SF.surface} 100%)`,
          border: `1px solid ${SF.primary}`,
          overflow: 'hidden',
          marginBottom: 24,
        }}>
          {/* glow */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 999, background: 'rgba(123,47,190,0.4)', filter: 'blur(40px)' }}/>
          <div style={{ position: 'relative' }}>
            <Pill bg="rgba(255,255,255,0.12)" textColor="#fff">Hoje</Pill>
            <div style={{ marginTop: 14, marginBottom: 2 }}>
              <DisplayText size={56} style={{ letterSpacing: 2 }}>TREINO A</DisplayText>
            </div>
            <div style={{ fontFamily: SF.body, fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>
              Peito + Tríceps · 6 exercícios
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: SF.body, fontSize: 12.5, color: 'rgba(255,255,255,0.85)' }}>
                <Icon name="clock" size={13} color="rgba(255,255,255,0.7)"/> 55 min
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: SF.body, fontSize: 12.5, color: 'rgba(255,255,255,0.85)' }}>
                <Icon name="dumbbell" size={13} color="rgba(255,255,255,0.7)"/> Médio
              </div>
            </div>
            <div style={{
              height: 48, borderRadius: 12,
              background: '#fff', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: SF.body, fontWeight: 700, fontSize: 14,
            }}>
              <Icon name="play" size={13} color="#000" fill="#000"/>
              Iniciar treino
            </div>
          </div>
        </div>

        {/* Semana */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <DisplayText size={20} style={{ letterSpacing: 1.5 }}>SEMANA ATUAL</DisplayText>
          <span style={{ fontFamily: SF.body, fontSize: 11.5, color: SF.secondary, fontWeight: 600 }}>3 de 5</span>
        </div>
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Day d="SEG" state="done"/>
            <Day d="TER" state="done"/>
            <Day d="QUA" state="rest"/>
            <Day d="QUI" state="today"/>
            <Day d="SEX" state="upcoming"/>
            <Day d="SÁB" state="rest"/>
            <Day d="DOM" state="rest"/>
          </div>
        </Card>

        {/* Histórico */}
        <DisplayText size={20} style={{ letterSpacing: 1.5, marginBottom: 12, display: 'block' }}>ÚLTIMOS TREINOS</DisplayText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Recent name="Treino B" focus="Costas + Bíceps" date="Sex"/>
          <Recent name="Treino A" focus="Peito + Tríceps" date="Qui"/>
          <Recent name="Treino C" focus="Pernas" date="Ter"/>
        </div>
      </div>
      <BottomNav active="home"/>
    </SFPhone>
  );
};

// ─────────────────────────────────────────────────────────────
// SCREEN 3 — Treino do Dia
// ─────────────────────────────────────────────────────────────
const Screen3_Workout = () => {
  const Exercise = ({ name, equip, reps, weight, done, adapted, num }) => (
    <div style={{
      borderRadius: 14, padding: 14,
      background: done ? SF.surfaceAlt : SF.surface,
      border: `1px solid ${SF.border}`,
      opacity: done ? 0.65 : 1,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 999,
        border: `1.5px solid ${done ? SF.secondary : SF.borderStrong}`,
        background: done ? SF.secondary : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
      }}>
        {done && <Icon name="check" size={14} color="#000" strokeWidth={3}/>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: SF.body, fontWeight: 700, fontSize: 14.5, color: SF.text,
            textDecoration: done ? 'line-through' : 'none',
            textDecorationColor: SF.textDim,
          }}>{name}</span>
          {adapted && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: SF.accent, fontSize: 10.5, fontWeight: 600 }}>
              <Icon name="alert" size={11} color={SF.accent}/> Adaptado
            </span>
          )}
        </div>
        <div style={{ fontFamily: SF.body, fontSize: 11.5, color: SF.textMuted, marginBottom: 10 }}>
          {equip}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            padding: '4px 10px', borderRadius: 6,
            background: SF.primarySoft, color: SF.primary,
            border: `1px solid ${SF.primary}`,
            fontFamily: SF.body, fontWeight: 700, fontSize: 11, letterSpacing: 0.3,
          }}>{reps}</span>
          <div style={{
            flex: 1, height: 28, borderRadius: 8,
            background: SF.bg, border: `1px solid ${SF.border}`,
            padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: SF.body, fontSize: 12,
          }}>
            <span style={{ color: SF.textMuted, fontSize: 10.5 }}>Peso</span>
            <span style={{ color: weight ? SF.text : SF.textDim, fontWeight: 600 }}>{weight || '— kg'}</span>
          </div>
        </div>
      </div>
      <span style={{ fontFamily: SF.display, fontSize: 18, color: done ? SF.textDim : SF.textMuted, letterSpacing: 1 }}>{num}</span>
    </div>
  );

  return (
    <SFPhone>
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0, zIndex: 10,
        padding: '4px 20px 14px',
        background: SF.bg,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999,
          background: SF.surface, border: `1px solid ${SF.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevron-left" size={18} color={SF.text}/>
        </div>
        <div style={{ flex: 1 }}>
          <DisplayText size={26} style={{ letterSpacing: 2, lineHeight: 1 }}>TREINO A</DisplayText>
          <div style={{ fontFamily: SF.body, fontSize: 11.5, color: SF.textMuted, marginTop: 2 }}>
            Peito + Tríceps · 6 exercícios
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 999,
          background: SF.surface, border: `1px solid ${SF.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="more" size={18} color={SF.text}/>
        </div>
      </div>

      <div style={{ padding: '128px 20px 160px', height: '100%', overflow: 'auto' }}>
        {/* Progresso */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 12,
          background: SF.primarySoft, border: `1px solid ${SF.primary}`,
          marginBottom: 18,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SF.body, fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
              2 de 6 concluídos
            </div>
            <div style={{ height: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '33%', height: '100%', background: SF.primary }}/>
            </div>
          </div>
          <span style={{ fontFamily: SF.display, fontSize: 26, color: '#fff', letterSpacing: 1 }}>33%</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Exercise num="01" name="Supino Reto com Halteres" equip="Banco MegaGym + Halteres 14kg" reps="3 × 12" weight="14 kg" done/>
          <Exercise num="02" name="Crucifixo Inclinado" equip="Banco inclinado + Halteres" reps="3 × 10" weight="10 kg" done/>
          <Exercise num="03" name="Supino Inclinado Smith" equip="Smith Kikos GX4i" reps="4 × 10" weight=""/>
          <Exercise num="04" name="Tríceps na Polia" equip="Polia alta · corda" reps="3 × 12" weight=""/>
          <Exercise num="05" name="Tríceps Francês" equip="Halter · banco" reps="3 × 12" weight="" adapted/>
          <Exercise num="06" name="Flexão de Braço" equip="Peso corporal" reps="3 × max" weight=""/>
        </div>
      </div>

      {/* Conclude button */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 24px',
        background: 'linear-gradient(to top, #0F0F0F 60%, rgba(15,15,15,0))',
        zIndex: 15,
      }}>
        <div style={{
          height: 50, borderRadius: 14, background: SF.secondaryDim,
          border: `1px solid ${SF.secondary}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          color: '#fff', fontFamily: SF.body, fontWeight: 700, fontSize: 14.5, letterSpacing: 0.3,
        }}>
          <Icon name="check" size={17} color="#fff" strokeWidth={2.5}/>
          Concluir treino
        </div>
      </div>
    </SFPhone>
  );
};

Object.assign(window, { Screen1_Onboarding, Screen2_Home, Screen3_Workout });
