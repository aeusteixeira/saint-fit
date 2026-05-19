// Placeholder for screens not yet implemented (01, 04, 05, 06, 08, 09).
import { icon } from '../icons.js';

export function renderPlaceholder(opts) {
  return (root) => {
    root.innerHTML = `<div class="placeholder">
      <div class="placeholder__icon">${icon(opts.icon || 'sparkle', { size: 24, color: 'var(--sf-primary)' })}</div>
      <div class="placeholder__title">${opts.title}</div>
      <div class="placeholder__text">${opts.text || 'Esta tela ainda não foi implementada nesta versão.'}</div>
    </div>`;
  };
}
