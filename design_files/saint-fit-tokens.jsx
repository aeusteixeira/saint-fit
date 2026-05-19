// Saint Fit — shared design tokens, icons, and common components.

const SF = {
  bg: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceAlt: '#141414',
  primary: '#7B2FBE',
  primaryDim: '#4A1B73',
  primarySoft: 'rgba(123,47,190,0.16)',
  secondary: '#2ECC71',
  secondaryDim: '#1F8A4D',
  secondarySoft: 'rgba(46,204,113,0.14)',
  accent: '#F0A500',
  accentSoft: 'rgba(240,165,0,0.14)',
  text: '#F5F5F5',
  textMuted: '#888888',
  textDim: '#5A5A5A',
  border: '#2A2A2A',
  borderStrong: '#3A3A3A',
  danger: '#E63946',
  blue: '#3A86FF',
  orange: '#FF6B35',
  display: '"Bebas Neue", "Oswald", Impact, sans-serif',
  body: '"DM Sans", "Inter", system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────────
// Lucide-style outline icons. stroke=1.75, sized via prop.
// ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.75, fill = 'none', style }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill, stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  switch (name) {
    case 'home': return (<svg {...props}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z"/></svg>);
    case 'dumbbell': return (<svg {...props}><path d="M6.5 6.5l11 11M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M7 17l3-3M14 10l3-3M5 11l-2 2 4 4 2-2M19 13l2-2-4-4-2 2"/></svg>);
    case 'list': return (<svg {...props}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>);
    case 'grid': return (<svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>);
    case 'trophy': return (<svg {...props}><path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4M6 22h12M10 22V18M14 22v-4M6 2h12v7a6 6 0 0 1-12 0V2z"/></svg>);
    case 'user': return (<svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>);
    case 'calendar': return (<svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>);
    case 'clock': return (<svg {...props}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>);
    case 'check': return (<svg {...props}><polyline points="5 12 10 17 19 7"/></svg>);
    case 'chevron-right': return (<svg {...props}><polyline points="9 6 15 12 9 18"/></svg>);
    case 'chevron-left': return (<svg {...props}><polyline points="15 6 9 12 15 18"/></svg>);
    case 'arrow-right': return (<svg {...props}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></svg>);
    case 'lock': return (<svg {...props}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
    case 'flame': return (<svg {...props}><path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-3 3-3 5 0-2-1-4-3-6-1 3-4 5-4 9 0 4 3 6 6 6z"/></svg>);
    case 'alert': return (<svg {...props}><path d="M12 3L2 21h20L12 3z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="17.5" r="0.6" fill={color} stroke="none"/></svg>);
    case 'edit': return (<svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>);
    case 'refresh': return (<svg {...props}><polyline points="21 4 21 10 15 10"/><polyline points="3 20 3 14 9 14"/><path d="M20 10a8 8 0 0 0-15-2M4 14a8 8 0 0 0 15 2"/></svg>);
    case 'trash': return (<svg {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>);
    case 'plus': return (<svg {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
    case 'sparkle': return (<svg {...props}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3zM19 17l.7 2L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17zM5 3l.7 2L8 6l-2.3.7L5 9l-.7-2.3L2 6l2.3-.7L5 3z"/></svg>);
    case 'play': return (<svg {...props} fill={color}><polygon points="6 4 20 12 6 20 6 4"/></svg>);
    case 'crown': return (<svg {...props}><path d="M3 19h18M3 19l1-10 5 4 3-7 3 7 5-4 1 10"/></svg>);
    case 'shield': return (<svg {...props}><path d="M12 2L4 5v7c0 5 4 9 8 10 4-1 8-5 8-10V5l-8-3z"/></svg>);
    case 'sword': return (<svg {...props}><path d="M14.5 17.5L4 6V2h4l11.5 10.5M13 19l6-6M16 16l4 4M19 21l2-2M15 5l3-3"/></svg>);
    case 'sprout': return (<svg {...props}><path d="M7 20h10M12 20v-8M12 12a5 5 0 0 0-5-5H4v3a5 5 0 0 0 5 5h3M12 12a5 5 0 0 1 5-5h3v3a5 5 0 0 1-5 5h-3"/></svg>);
    case 'bolt': return (<svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
    case 'trident': return (<svg {...props}><path d="M12 2v20M5 4v4a7 7 0 0 0 14 0V4M5 4l-2 2M19 4l2 2M9 22h6"/></svg>);
    case 'medal': return (<svg {...props}><circle cx="12" cy="15" r="6"/><path d="M8 9L6 2h12l-2 7"/></svg>);
    case 'scale': return (<svg {...props}><path d="M12 3v18M5 7l-3 7h6L5 7zM19 7l-3 7h6l-3-7zM4 21h16"/></svg>);
    case 'ghost': return (<svg {...props}><path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-2 2 2 3-2 3 2 2-2 3 2V10a8 8 0 0 0-8-8z"/></svg>);
    case 'house': return (<svg {...props}><path d="M3 11l9-8 9 8M5 9.5V21h14V9.5"/><rect x="9" y="13" width="6" height="8"/></svg>);
    case 'more': return (<svg {...props}><circle cx="12" cy="12" r="1.4" fill={color}/><circle cx="5" cy="12" r="1.4" fill={color}/><circle cx="19" cy="12" r="1.4" fill={color}/></svg>);
    case 'bell': return (<svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/></svg>);
    case 'wave': return (<svg {...props}><path d="M7 11V5a2 2 0 0 1 4 0v6M11 5V3a2 2 0 0 1 4 0v8M15 6a2 2 0 1 1 4 0v8a7 7 0 0 1-14 0v-3a2 2 0 1 1 4 0"/></svg>);
    default: return null;
  }
};

// ─────────────────────────────────────────────────────────────
// Common atoms
// ─────────────────────────────────────────────────────────────
const Pill = ({ children, color = SF.primary, bg, textColor = '#fff', style }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 999,
    background: bg || color,
    color: textColor,
    fontFamily: SF.body, fontWeight: 600, fontSize: 11, letterSpacing: 0.3,
    textTransform: 'uppercase',
    ...style,
  }}>{children}</span>
);

const Tag = ({ children, color = SF.textMuted, bg = 'rgba(255,255,255,0.05)', style }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 8px', borderRadius: 6,
    background: bg, color,
    fontFamily: SF.body, fontWeight: 500, fontSize: 10.5, letterSpacing: 0.2,
    border: `1px solid ${SF.border}`,
    ...style,
  }}>{children}</span>
);

const Card = ({ children, style, padding = 16, accent }) => (
  <div style={{
    background: SF.surface, borderRadius: 16,
    border: `1px solid ${SF.border}`,
    padding,
    position: 'relative',
    ...(accent && { borderLeft: `3px solid ${accent}` }),
    ...style,
  }}>{children}</div>
);

const DisplayText = ({ children, size = 36, color = SF.text, style }) => (
  <span style={{
    fontFamily: SF.display,
    fontSize: size,
    lineHeight: 0.95,
    letterSpacing: 1.5,
    fontWeight: 400,
    color,
    ...style,
  }}>{children}</span>
);

// ─────────────────────────────────────────────────────────────
// Status bar (replaces the kit's). Compact dark variant.
// ─────────────────────────────────────────────────────────────
const SFStatusBar = ({ time = '9:41' }) => (
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 54, zIndex: 30,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 32px 0', pointerEvents: 'none',
    fontFamily: '-apple-system, system-ui',
    color: '#fff',
  }}>
    <span style={{ fontSize: 15, fontWeight: 600 }}>{time}</span>
    <span style={{ width: 126 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="0.5" fill="#fff"/><rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="#fff"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="#fff"/><rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="#fff"/></svg>
      <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 3C9.5 3 11.3 3.7 12.7 5L13.7 4C12 2.3 9.8 1.2 7.5 1.2S3 2.3 1.3 4l1 1C3.7 3.7 5.5 3 7.5 3z" fill="#fff"/><circle cx="7.5" cy="9" r="1.3" fill="#fff"/></svg>
      <svg width="25" height="11" viewBox="0 0 25 11"><rect x="0.5" y="0.5" width="21" height="10" rx="3" stroke="#fff" strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="14" height="7" rx="1.5" fill="#fff"/><path d="M23 3.5v4c0.7-0.3 1.2-1 1.2-2s-0.5-1.7-1.2-2z" fill="#fff" fillOpacity="0.5"/></svg>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Bottom Nav
// ─────────────────────────────────────────────────────────────
const BottomNav = ({ active = 'home' }) => {
  const items = [
    { id: 'home', icon: 'home', label: 'Início' },
    { id: 'workout', icon: 'dumbbell', label: 'Treino' },
    { id: 'plans', icon: 'list', label: 'Planos' },
    { id: 'equip', icon: 'grid', label: 'Equip.' },
    { id: 'progress', icon: 'trophy', label: 'Evolução' },
    { id: 'profile', icon: 'user', label: 'Perfil' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 78, background: 'rgba(15,15,15,0.96)',
      backdropFilter: 'blur(14px)',
      borderTop: `1px solid ${SF.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
      paddingTop: 10, paddingBottom: 18,
      zIndex: 20,
    }}>
      {items.map(it => {
        const isActive = it.id === active;
        return (
          <div key={it.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: isActive ? SF.primary : SF.textMuted,
          }}>
            <Icon name={it.icon} size={20} color={isActive ? SF.primary : SF.textMuted} strokeWidth={isActive ? 2 : 1.6}/>
            <span style={{
              fontFamily: SF.body, fontSize: 9.5,
              fontWeight: isActive ? 600 : 500,
              letterSpacing: 0.2,
            }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Phone shell — dark, with SF status bar + dynamic island + home bar.
// ─────────────────────────────────────────────────────────────
const SFPhone = ({ children, scroll = false }) => (
  <div style={{
    width: 390, height: 844,
    borderRadius: 48, overflow: 'hidden', position: 'relative',
    background: SF.bg,
    boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
    fontFamily: SF.body,
    color: SF.text,
    WebkitFontSmoothing: 'antialiased',
  }}>
    {/* Dynamic island */}
    <div style={{
      position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
      width: 120, height: 35, borderRadius: 24, background: '#000', zIndex: 50,
    }} />
    <SFStatusBar />
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      overflow: scroll ? 'auto' : 'hidden',
    }}>
      {children}
    </div>
    {/* Home indicator */}
    <div style={{
      position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
      width: 134, height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.45)',
      zIndex: 70, pointerEvents: 'none',
    }} />
  </div>
);

Object.assign(window, { SF, Icon, Pill, Tag, Card, DisplayText, SFPhone, BottomNav, SFStatusBar });
