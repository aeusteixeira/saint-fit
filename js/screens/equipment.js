// Screen 05 — Equipamentos
import { icon } from '../icons.js';
import { EQUIPMENT, FILTERS, muscleColor } from '../equipment-catalog.js';

let activeFilter = 'todos';

function filterPill(f) {
  const active = f.key === activeFilter;
  return `<button type="button" class="filter-pill${active ? ' is-active' : ''}" data-filter="${f.key}">${f.label}</button>`;
}

function muscleTag(m) {
  const c = muscleColor(m);
  return `<span class="muscle-tag" style="--mc:${c};">${m}</span>`;
}

function equipCard(eq) {
  return `<div class="equip-card">
    <div class="equip-card__image">
      <img src="${eq.image}" alt="${eq.name}" loading="lazy"/>
      <span class="equip-card__brand">${eq.brand}</span>
    </div>
    <div class="equip-card__body">
      <div class="equip-card__name">${eq.name}</div>
      <div class="equip-card__count">${eq.exerciseCount} exercícios</div>
      <div class="equip-card__tags">
        ${eq.muscleGroups.slice(0, 2).map(muscleTag).join('')}
      </div>
    </div>
  </div>`;
}

export function renderEquipment(root) {
  function fullRender() {
    const filtered = activeFilter === 'todos'
      ? EQUIPMENT
      : EQUIPMENT.filter(eq => eq.filter.includes(activeFilter));

    root.innerHTML = `<div class="screen">
      <div style="margin-top: 16px;">
        <span class="display" style="font-size:42px; letter-spacing:2px; display:block;">EQUIPAMENTOS</span>
        <div class="muted" style="font-size:13px; margin-top:4px;">${EQUIPMENT.length} máquinas · disponíveis 24h</div>
      </div>

      <div class="filter-row" style="margin-top: 18px;">
        ${FILTERS.map(filterPill).join('')}
      </div>

      <div class="equip-grid" style="margin-top: 18px;">
        ${filtered.length === 0
          ? `<div class="card" style="grid-column: span 2; text-align:center; color:var(--sf-text-muted); font-size:13px;">Nenhum equipamento nessa categoria.</div>`
          : filtered.map(equipCard).join('')}
      </div>
    </div>`;

    root.querySelectorAll('[data-filter]').forEach(el => {
      el.addEventListener('click', () => {
        activeFilter = el.dataset.filter;
        fullRender();
      });
    });
  }

  fullRender();

  return () => { activeFilter = 'todos'; };
}
