// Saint Fit — Screens 4-6: Planos, Equipamentos, Perfil

// ─────────────────────────────────────────────────────────────
// SCREEN 4 — Meus Treinos (Planos)
// ─────────────────────────────────────────────────────────────
const Screen4_Plans = () => {
  const PlanCard = ({ letter, focus, days, exercises, accent, image }) => (
    <div style={{
      position: 'relative', borderRadius: 18, overflow: 'hidden',
      background: SF.surface, border: `1px solid ${SF.border}`,
    }}>
      {/* accent stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: accent }}/>
      <div style={{ padding: '18px 18px 18px 22px', display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 14,
          background: `${accent}1F`,
          border: `1px solid ${accent}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative',
        }}>
          <DisplayText size={36} color={accent} style={{ letterSpacing: 0 }}>{letter}</DisplayText>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <DisplayText size={22} style={{ letterSpacing: 1.5 }}>TREINO {letter}</DisplayText>
            <Tag color={accent} bg={`${accent}1A`} style={{ border: `1px solid ${accent}55` }}>{days}</Tag>
          </div>
          <div style={{ fontFamily: SF.body, fontSize: 13, color: SF.text, marginBottom: 6 }}>{focus}</div>
          <div style={{ fontFamily: SF.body, fontSize: 11.5, color: SF.textMuted, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="dumbbell" size={11} color={SF.textMuted}/>
            {exercises} exercícios
          </div>
        </div>
        <Icon name="chevron-right" size={18} color={SF.textMuted}/>
      </div>
    </div>
  );

  return (
    <SFPhone>
      <div style={{ padding: '64px 20px 100px', height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, marginBottom: 6 }}>
          <DisplayText size={42} style={{ letterSpacing: 2 }}>MEUS TREINOS</DisplayText>
        </div>
        <div style={{ fontFamily: SF.body, fontSize: 13, color: SF.textMuted, marginBottom: 24 }}>
          Plano ABC · 4 dias por semana
        </div>

        {/* Resumo */}
        <div style={{
          display: 'flex', gap: 10, marginBottom: 24,
        }}>
          {[
            { label: 'Esta semana', value: '3/5' },
            { label: 'Streak', value: '12d' },
            { label: 'Total', value: '47' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, padding: '12px 14px', borderRadius: 12,
              background: SF.surface, border: `1px solid ${SF.border}`,
            }}>
              <div style={{ fontFamily: SF.body, fontSize: 10.5, color: SF.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
              <DisplayText size={22} style={{ letterSpacing: 1 }}>{s.value}</DisplayText>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PlanCard letter="A" focus="Peito + Tríceps" days="Seg · Qui" exercises={6} accent={SF.primary}/>
          <PlanCard letter="B" focus="Costas + Bíceps" days="Ter · Sex" exercises={7} accent={SF.secondary}/>
          <PlanCard letter="C" focus="Pernas + Ombros" days="Sáb" exercises={8} accent={SF.accent}/>
        </div>

        {/* Regenerate */}
        <div style={{
          marginTop: 18, height: 48, borderRadius: 12,
          background: 'transparent', border: `1px dashed ${SF.borderStrong}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: SF.textMuted, fontFamily: SF.body, fontWeight: 600, fontSize: 13,
        }}>
          <Icon name="refresh" size={14} color={SF.textMuted}/>
          Regenerar plano
        </div>
      </div>
      <BottomNav active="plans"/>
    </SFPhone>
  );
};

// ─────────────────────────────────────────────────────────────
// SCREEN 5 — Equipamentos
// ─────────────────────────────────────────────────────────────
const Screen5_Equipment = () => {
  const EquipCard = ({ name, brand, count, tags, kind }) => (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      background: SF.surface, border: `1px solid ${SF.border}`,
    }}>
      {/* image placeholder */}
      <div style={{
        height: 92, background: `linear-gradient(135deg, #1C1C1C 0%, #0F0F0F 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: `1px solid ${SF.border}`, position: 'relative',
      }}>
        <Icon name={kind || 'dumbbell'} size={42} color="#3A3A3A" strokeWidth={1.4}/>
        <div style={{ position: 'absolute', top: 8, right: 8, padding: '2px 7px', borderRadius: 5, background: 'rgba(0,0,0,0.5)', fontFamily: SF.body, fontSize: 9, color: SF.textMuted, letterSpacing: 0.5 }}>
          {brand}
        </div>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontFamily: SF.body, fontWeight: 700, fontSize: 12.5, color: SF.text, marginBottom: 3, lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontFamily: SF.body, fontSize: 10.5, color: SF.textMuted, marginBottom: 8 }}>
          {count} exercícios
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {tags.map((t, i) => (
            <span key={i} style={{
              fontFamily: SF.body, fontSize: 9, fontWeight: 600, color: t.color,
              padding: '2px 6px', borderRadius: 4, background: `${t.color}1A`,
              border: `1px solid ${t.color}44`, letterSpacing: 0.2,
            }}>{t.label}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const P = SF.primary, S = SF.secondary, A = SF.accent;
  const equip = [
    { name: 'Kikos GX4i', brand: 'KIKOS', count: 8, kind: 'dumbbell', tags: [{ label: 'Peito', color: P }, { label: 'Costas', color: S }, { label: 'Tríceps', color: A }] },
    { name: 'Banco MegaGym', brand: 'MEGAGYM', count: 6, kind: 'grid', tags: [{ label: 'Peito', color: P }, { label: 'Ombro', color: A }] },
    { name: 'Polia Dupla', brand: 'TRG', count: 12, kind: 'sparkle', tags: [{ label: 'Costas', color: S }, { label: 'Bíceps', color: P }] },
    { name: 'Halteres 2–24kg', brand: 'PAR', count: 18, kind: 'dumbbell', tags: [{ label: 'Tudo', color: A }] },
    { name: 'Esteira Pro', brand: 'MOVEMENT', count: 3, kind: 'bolt', tags: [{ label: 'Cardio', color: S }] },
    { name: 'Smith Machine', brand: 'KIKOS', count: 9, kind: 'shield', tags: [{ label: 'Pernas', color: P }, { label: 'Costas', color: S }] },
  ];

  return (
    <SFPhone>
      <div style={{ padding: '64px 20px 100px', height: '100%', overflow: 'auto' }}>
        <div style={{ marginTop: 16, marginBottom: 6 }}>
          <DisplayText size={42} style={{ letterSpacing: 2 }}>EQUIPAMENTOS</DisplayText>
        </div>
        <div style={{ fontFamily: SF.body, fontSize: 13, color: SF.textMuted, marginBottom: 20 }}>
          6 máquinas · disponíveis 24h
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, overflowX: 'auto', paddingBottom: 2 }}>
          {['Todos', 'Peito', 'Costas', 'Pernas', 'Cardio'].map((t, i) => (
            <span key={t} style={{
              padding: '6px 12px', borderRadius: 999,
              background: i === 0 ? SF.primary : SF.surface,
              border: `1px solid ${i === 0 ? SF.primary : SF.border}`,
              color: i === 0 ? '#fff' : SF.textMuted,
              fontFamily: SF.body, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            }}>{t}</span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {equip.map(e => <EquipCard key={e.name} {...e}/>)}
        </div>
      </div>
      <BottomNav active="equip"/>
    </SFPhone>
  );
};

// ─────────────────────────────────────────────────────────────
// SCREEN 6 — Perfil
// ─────────────────────────────────────────────────────────────
const Screen6_Profile = () => {
  const Row = ({ label, value, last }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0', borderBottom: last ? 'none' : `1px solid ${SF.border}`,
    }}>
      <span style={{ fontFamily: SF.body, fontSize: 13, color: SF.textMuted }}>{label}</span>
      <span style={{ fontFamily: SF.body, fontSize: 13.5, fontWeight: 600, color: SF.text, textAlign: 'right' }}>{value}</span>
    </div>
  );
  const ActionBtn = ({ icon, label, color }) => (
    <div style={{
      height: 46, borderRadius: 12,
      background: 'transparent', border: `1px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      color, fontFamily: SF.body, fontWeight: 600, fontSize: 13.5,
    }}>
      <Icon name={icon} size={15} color={color}/>
      {label}
    </div>
  );

  return (
    <SFPhone>
      <div style={{ padding: '64px 20px 100px', height: '100%', overflow: 'auto' }}>
        <div style={{ marginTop: 16, marginBottom: 22 }}>
          <DisplayText size={42} style={{ letterSpacing: 2 }}>MEU PERFIL</DisplayText>
        </div>

        {/* Identity card */}
        <Card style={{ padding: 18, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 62, height: 62, borderRadius: 999,
              background: `linear-gradient(135deg, ${SF.primary}, ${SF.primaryDim})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: SF.display, fontSize: 28, color: '#fff', letterSpacing: 1,
              border: `2px solid ${SF.primary}`,
            }}>M</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SF.body, fontWeight: 700, fontSize: 17, color: SF.text }}>Matheus Silva</div>
              <div style={{ fontFamily: SF.body, fontSize: 11.5, color: SF.textMuted, marginTop: 3 }}>
                Apto 142 · Torre 02
              </div>
              <div style={{ marginTop: 8 }}>
                <Pill bg={SF.primarySoft} textColor={SF.primary} color={SF.primary}>💪 Ganhar massa</Pill>
              </div>
            </div>
          </div>
        </Card>

        {/* Level snapshot */}
        <div style={{
          display: 'flex', gap: 10, marginBottom: 18,
        }}>
          <Card padding={14} style={{ flex: 1 }}>
            <div style={{ fontFamily: SF.body, fontSize: 10, color: SF.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>Nível</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="sword" size={20} color={SF.primary}/>
              <div>
                <div style={{ fontFamily: SF.display, fontSize: 18, color: SF.text, letterSpacing: 1, lineHeight: 1 }}>GUERREIRO</div>
                <div style={{ fontFamily: SF.body, fontSize: 11, color: SF.textMuted, marginTop: 2 }}>Lv 5</div>
              </div>
            </div>
          </Card>
          <Card padding={14} style={{ flex: 1 }}>
            <div style={{ fontFamily: SF.body, fontSize: 10, color: SF.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>Streak</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="flame" size={20} color={SF.accent} fill={SF.accent}/>
              <div>
                <div style={{ fontFamily: SF.display, fontSize: 18, color: SF.text, letterSpacing: 1, lineHeight: 1 }}>12 DIAS</div>
                <div style={{ fontFamily: SF.body, fontSize: 11, color: SF.textMuted, marginTop: 2 }}>recorde: 18</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Data */}
        <div style={{ fontFamily: SF.body, fontSize: 11, color: SF.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
          Dados do treino
        </div>
        <Card padding={0} style={{ padding: '0 16px', marginBottom: 18 }}>
          <Row label="Peso atual" value="85 kg"/>
          <Row label="Nível" value="Voltando após pausa"/>
          <Row label="Dias de treino" value="Seg · Ter · Qui · Sex"/>
          <Row label="Tempo por treino" value="1h"/>
          <Row label="Limitações" value="Joelho · Coluna" last/>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ActionBtn icon="edit" label="Editar perfil" color={SF.primary}/>
          <ActionBtn icon="refresh" label="Regenerar treino" color={SF.secondary}/>
          <ActionBtn icon="trash" label="Limpar histórico" color={SF.textMuted}/>
        </div>
      </div>
      <BottomNav active="profile"/>
    </SFPhone>
  );
};

Object.assign(window, { Screen4_Plans, Screen5_Equipment, Screen6_Profile });
