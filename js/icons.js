// Lucide-style outline icons. Returns SVG string.
const PATHS = {
  home: '<path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z"/>',
  dumbbell: '<path d="M6.5 6.5l11 11M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M7 17l3-3M14 10l3-3M5 11l-2 2 4 4 2-2M19 13l2-2-4-4-2 2"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  trophy: '<path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4M6 22h12M10 22V18M14 22v-4M6 2h12v7a6 6 0 0 1-12 0V2z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
  check: '<polyline points="5 12 10 17 19 7"/>',
  'chevron-right': '<polyline points="9 6 15 12 9 18"/>',
  'chevron-left': '<polyline points="15 6 9 12 15 18"/>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
  'arrow-right': '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-3 3-3 5 0-2-1-4-3-6-1 3-4 5-4 9 0 4 3 6 6 6z"/>',
  alert: '<path d="M12 3L2 21h20L12 3z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="17.5" r="0.6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  refresh: '<polyline points="21 4 21 10 15 10"/><polyline points="3 20 3 14 9 14"/><path d="M20 10a8 8 0 0 0-15-2M4 14a8 8 0 0 0 15 2"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  x: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  sparkle: '<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3zM19 17l.7 2L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17zM5 3l.7 2L8 6l-2.3.7L5 9l-.7-2.3L2 6l2.3-.7L5 3z"/>',
  play: '<polygon points="6 4 20 12 6 20 6 4"/>',
  crown: '<path d="M3 19h18M3 19l1-10 5 4 3-7 3 7 5-4 1 10"/>',
  shield: '<path d="M12 2L4 5v7c0 5 4 9 8 10 4-1 8-5 8-10V5l-8-3z"/>',
  sword: '<path d="M14.5 17.5L4 6V2h4l11.5 10.5M13 19l6-6M16 16l4 4M19 21l2-2M15 5l3-3"/>',
  sprout: '<path d="M7 20h10M12 20v-8M12 12a5 5 0 0 0-5-5H4v3a5 5 0 0 0 5 5h3M12 12a5 5 0 0 1 5-5h3v3a5 5 0 0 1-5 5h-3"/>',
  bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  trident: '<path d="M12 2v20M5 4v4a7 7 0 0 0 14 0V4M5 4l-2 2M19 4l2 2M9 22h6"/>',
  medal: '<circle cx="12" cy="15" r="6"/><path d="M8 9L6 2h12l-2 7"/>',
  scale: '<path d="M12 3v18M5 7l-3 7h6L5 7zM19 7l-3 7h6l-3-7zM4 21h16"/>',
  ghost: '<path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-2 2 2 3-2 3 2 2-2 3 2V10a8 8 0 0 0-8-8z"/>',
  house: '<path d="M3 11l9-8 9 8M5 9.5V21h14V9.5"/><rect x="9" y="13" width="6" height="8"/>',
  more: '<circle cx="12" cy="12" r="1.4"/><circle cx="5" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/>',
  wave: '<path d="M7 11V5a2 2 0 0 1 4 0v6M11 5V3a2 2 0 0 1 4 0v8M15 6a2 2 0 1 1 4 0v8a7 7 0 0 1-14 0v-3a2 2 0 1 1 4 0"/>',
};

// Icons that should be filled (e.g. play, flame inside flame card, dots in 'more')
const FILLED_ICONS = new Set(['play']);
const DOTTED_ICONS = new Set(['more']);

export function icon(name, opts = {}) {
  const {
    size = 20,
    color = 'currentColor',
    strokeWidth = 1.75,
    fill = 'none',
    className = '',
  } = opts;

  const path = PATHS[name];
  if (!path) return '';

  // For special "filled" icons (play), use color as fill.
  const useFill = FILLED_ICONS.has(name) ? color : (DOTTED_ICONS.has(name) ? color : fill);
  // For 'more' the circles render as paths — they need fill to look right.
  const dotMode = DOTTED_ICONS.has(name);

  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${useFill}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${className ? ` class="${className}"` : ''}>${dotMode ? path.replace(/<circle/g, `<circle fill="${color}" stroke="none"`) : path}</svg>`;
}
