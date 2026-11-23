/* Paisajes ilustrados por estación (SVG propio) con un deportista animado.
   window.Scene.seasonOf(fecha) · window.Scene.html(estación) → marcado listo para insertar */
(() => {
'use strict';
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

const NAMES = { winter: 'Invierno', spring: 'Primavera', summer: 'Verano', autumn: 'Otoño' };
const LINES = {
  winter: 'Calienta bien antes de salir al frío',
  spring: 'La mejor época para rodar y correr',
  summer: 'Hidrátate y busca la sombra',
  autumn: 'Aire fresco, hojas y buen ritmo',
};
function seasonOf(d = new Date()) {
  const m = d.getMonth();                      // hemisferio norte, estaciones meteorológicas
  return m === 11 || m < 2 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'autumn';
}

/* ---------- piezas ---------- */
const poly = (pts, w, extra = '') => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const head = (x, y, r = 5.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor"/>`;

function mountains(base, seed, color, snow, hMin, hMax, n = 5) {
  const r = rng(seed), W = 440 / n; let d = `M-40 ${base + 60} `, caps = '';
  for (let i = 0; i <= n; i++) {
    const ax = -20 + i * W + (r() - .5) * W * .5, h = hMin + r() * (hMax - hMin), vx = ax - W * .5 + (r() - .5) * 14;
    d += `L${vx.toFixed(1)} ${(base - r() * 8).toFixed(1)} L${ax.toFixed(1)} ${(base - h).toFixed(1)} `;
    if (snow) { const s = h * .3, w = W * .2;
      caps += `<path d="M${ax} ${base - h} L${ax - w} ${base - h + s} L${ax - w * .35} ${base - h + s * .72} L${ax + w * .1} ${base - h + s * 1.05} L${ax + w * .5} ${base - h + s * .74} L${ax + w} ${base - h + s} Z" fill="${snow}"/>`; }
  }
  return `<path d="${d}L460 ${base + 60}Z" fill="${color}"/>${caps}`;
}
function hills(base, amp, seed, color, step = 55) {
  const r = rng(seed); let pts = [];
  for (let x = -40; x <= 460; x += step) pts.push([x, base - r() * amp]);
  let d = `M-40 ${base + 120} L${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; d += ` Q${x0 + (x1 - x0) * .25} ${y0} ${(x0 + x1) / 2} ${(y0 + y1) / 2} T${x1} ${y1}`; }
  return `<path d="${d} L460 ${base + 120}Z" fill="${color}"/>`;
}
const pine = (x, y, s, c, snow) => {
  let t = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-1.6" y="-6" width="3.2" height="9" fill="#3a2a1d"/>`;
  for (let i = 0; i < 4; i++) { const a = -62 + i * 14, b = -34 + i * 15, w = 9 + i * 4.5;
    t += `<path d="M0 ${a} L${-w} ${b} L${w} ${b}Z" fill="${c}"/>`;
    if (snow) t += `<path d="M0 ${a} L${-w * .62} ${a + (b - a) * .62} Q0 ${a + (b - a) * .5} ${w * .62} ${a + (b - a) * .62}Z" fill="${snow}"/>`; }
  return t + '</g>';
};
const round = (x, y, s, trunk, cols, r0 = 16) => {
  const r = rng(Math.round(x * 7 + y)); let t = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-2.5 4 L-1.5 -34 L1.5 -34 L2.5 4Z" fill="${trunk}"/>`;
  for (let i = 0; i < 7; i++) t += `<circle cx="${(r() - .5) * 30}" cy="${-40 - r() * 20}" r="${r0 * (.6 + r() * .5)}" fill="${cols[i % cols.length]}"/>`;
  return t + '</g>';
};
const palm = (x, y, s) => {
  let t = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 4 Q-8 -40 4 -86" fill="none" stroke="#4a3426" stroke-width="5.5" stroke-linecap="round"/>`;
  [-75, -40, -5, 30, 65, 105, 150].forEach((a, i) => { t += `<g transform="translate(4 -86) rotate(${a})"><path class="frond f${i % 3}" d="M0 0 Q26 -26 58 6 Q28 -10 0 0Z" fill="${i % 2 ? '#1f6b49' : '#2a8059'}"/></g>`; });
  return t + '<circle cx="2" cy="-82" r="3.2" fill="#3b2a1c"/><circle cx="8" cy="-80" r="3.2" fill="#3b2a1c"/></g>';
};
const cloud = (x, y, s, o, cls) => `<g class="cloud ${cls}" opacity="${o}"><g transform="translate(${x} ${y}) scale(${s})" fill="#fff"><ellipse cx="0" cy="0" rx="34" ry="11"/><ellipse cx="-16" cy="-8" rx="18" ry="12"/><ellipse cx="10" cy="-12" rx="22" ry="15"/><ellipse cx="28" cy="-3" rx="16" ry="9"/></g></g>`;
const shadow = (x, y, w) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="3.2" fill="#000" opacity=".22"/>`;

/* ---------- deportistas ---------- */
const frames = (a, b, dur = .7) => `<g class="fr" style="animation-duration:${dur}s">${a}</g><g class="fr alt" style="animation-duration:${dur}s">${b}</g>`;
function runner() {
  const A = poly([[0, 0], [5, -32]], 9) + head(8, -41) + poly([[4, -29], [15, -22], [21, -31]], 5.5) + poly([[4, -29], [-6, -24], [-13, -15]], 5.5)
    + poly([[0, 0], [15, 10], [13, 32]], 7) + poly([[0, 0], [-9, 16], [-25, 24]], 7);
  const B = poly([[0, 0], [4, -33]], 9) + head(7, -42) + poly([[3, -30], [12, -24], [14, -33]], 5.5) + poly([[3, -30], [-3, -22], [2, -14]], 5.5)
    + poly([[0, 0], [4, 15], [1, 33]], 7) + poly([[0, 0], [-4, 14], [-18, 16]], 7);
  return { svg: frames(A, B, .62), foot: 33, w: 26 };
}
function skier() {
  const A = poly([[0, 0], [9, -30]], 9) + head(12, -38) + poly([[8, -27], [18, -20], [24, -14]], 5) + poly([[24, -14], [36, 36]], 2.2)
    + poly([[8, -27], [-1, -20], [-8, -12]], 5) + poly([[-8, -12], [-24, 36]], 2.2)
    + poly([[0, 0], [12, 15], [10, 33]], 7) + poly([[0, 0], [-8, 16], [-14, 33]], 7)
    + poly([[4, 35], [46, 35]], 3) + poly([[-34, 35], [-2, 35]], 3);
  const B = poly([[0, 0], [8, -31]], 9) + head(11, -39) + poly([[7, -28], [-2, -22], [-9, -14]], 5) + poly([[-9, -14], [-20, 36]], 2.2)
    + poly([[7, -28], [-4, -18], [-4, -10]], 5) + poly([[-4, -10], [-10, 36]], 2.2)
    + poly([[0, 0], [7, 16], [5, 33]], 7) + poly([[0, 0], [1, 16], [-2, 33]], 7)
    + poly([[-18, 35], [22, 35]], 3) + poly([[-12, 36], [28, 36]], 3);
  return { svg: frames(A, B, .9), foot: 35, w: 34 };
}
function cyclist() {
  const wheel = x => `<g transform="translate(${x} 26)"><g class="spin"><circle r="13" fill="none" stroke="currentColor" stroke-width="2.4"/>${poly([[-13, 0], [13, 0]], 1.2)}${poly([[0, -13], [0, 13]], 1.2)}${poly([[-9, -9], [9, 9]], 1.2)}${poly([[9, -9], [-9, 9]], 1.2)}</g></g>`;
  const frame = poly([[-22, 26], [-2, 26], [-7, 6], [-22, 26]], 2.6) + poly([[-7, 6], [17, 4], [22, 26]], 2.6) + poly([[-2, 26], [17, 4]], 2.6) + poly([[-9, 4], [-4, 4]], 3.4) + poly([[16, 3], [20, 0]], 2.8);
  const rider = poly([[-6, 2], [11, -15]], 9) + head(15, -22) + poly([[9, -12], [18, -5], [20, 0]], 5);
  const A = poly([[-6, 2], [7, 9], [3, 24]], 6.5) + poly([[-6, 2], [4, 14], [-3, 28]], 6.5);
  const B = poly([[-6, 2], [6, 14], [2, 28]], 6.5) + poly([[-6, 2], [8, 8], [4, 22]], 6.5);
  return { svg: wheel(-22) + wheel(22) + frame + rider + frames(A, B, .5), foot: 40, w: 40 };
}
function pushups() {
  const up = poly([[-36, 38], [12, 9]], 8) + head(20, 4.5) + poly([[12, 9], [12, 38]], 5.5);
  const dn = poly([[-36, 38], [12, 27]], 8) + head(20, 22.5) + poly([[12, 27], [2, 34], [13, 38]], 5.5);
  return { svg: frames(up, dn, 1.7), foot: 40, w: 44 };
}
function person(kind, x, groundY, s, color) {
  const p = { runner, skier, cyclist, pushups }[kind]();
  return `${shadow(x, groundY + 1, p.w * s)}<g style="color:${color}" transform="translate(${x} ${groundY - p.foot * s}) scale(${s})">${p.svg}</g>`;
}

/* ---------- escenas (viewBox 400 × 800) ---------- */
const grad = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const glow = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".95"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;

function winter() {
  const r = rng(5); let snowTufts = '';
  for (let i = 0; i < 16; i++) snowTufts += `<ellipse cx="${r() * 400}" cy="${312 + r() * 70}" rx="${14 + r() * 26}" ry="${2 + r() * 2.5}" fill="#fff" opacity=".7"/>`;
  return `<defs>${grad('sky', [[0, '#1d2f55'], [.38, '#5f7fb4'], [.7, '#e9b9c6'], [1, '#fde7d6']])}${grad('gnd', [[0, '#f7fbff'], [1, '#c4d4e8']])}${glow('sg', '#ffe9c7')}</defs>
  <rect width="400" height="800" fill="url(#sky)"/>
  <circle cx="312" cy="214" r="70" fill="url(#sg)"/><circle cx="312" cy="214" r="21" fill="#fff4de"/>
  ${cloud(90, 90, .9, .35, 'c1')}${cloud(300, 130, .7, .28, 'c2')}
  ${mountains(262, 3, '#8aa3c6', '#f2f7ff', 48, 92, 4)}${mountains(272, 9, '#6682a9', '#ffffff', 36, 66, 5)}
  ${hills(278, 16, 12, '#e8f0fa')}
  <rect y="290" width="400" height="520" fill="url(#gnd)"/>
  <path d="M-20 338 Q120 318 230 331 T430 322 L430 346 Q300 338 210 350 T-20 356Z" fill="#dfe9f5"/>
  ${snowTufts}
  ${[40, 72, 100].map((x, i) => pine(x, 300 + i * 4, .5 + i * .1, '#1b3a44', '#fff')).join('')}
  ${[348, 372, 392].map((x, i) => pine(x, 296 + i * 5, .52 + i * .12, '#183641', '#fff')).join('')}
  ${pine(8, 360, 1.15, '#142f39', '#fff')}${pine(396, 372, 1.3, '#142f39', '#fff')}
  ${person('skier', 276, 352, 1.12, '#142030')}`;
}
function spring() {
  const r = rng(21); let flowers = '';
  const cols = ['#fff', '#fde047', '#f9a8d4', '#c4b5fd'];
  for (let i = 0; i < 46; i++) flowers += `<circle cx="${r() * 400}" cy="${326 + r() * 80}" r="${1.2 + r() * 1.8}" fill="${cols[i % 4]}"/>`;
  return `<defs>${grad('sky', [[0, '#4aa3e6'], [.55, '#9dd5f5'], [1, '#e6f6ee']])}${grad('gnd', [[0, '#6cc35c'], [1, '#3d9a4c']])}${glow('sg', '#fff7c2')}</defs>
  <rect width="400" height="800" fill="url(#sky)"/>
  <circle cx="330" cy="92" r="64" fill="url(#sg)"/><circle cx="330" cy="92" r="24" fill="#fffbe0"/>
  ${cloud(80, 80, 1, .9, 'c1')}${cloud(250, 150, .8, .8, 'c2')}${cloud(380, 60, .6, .7, 'c3')}
  ${hills(250, 26, 31, '#9ed38e', 70)}${hills(268, 22, 7, '#7fc470', 60)}${hills(288, 16, 18, '#5cb25b', 50)}
  <rect y="300" width="400" height="520" fill="url(#gnd)"/>
  <path d="M-20 336 Q110 316 230 330 T430 322 L430 344 Q290 336 200 350 T-20 354Z" fill="#dccfa8"/>
  ${flowers}
  ${round(120, 296, .45, '#6b4a34', ['#f4a7c6', '#f9c5da', '#ee8fb5'], 15)}${round(330, 292, .4, '#6b4a34', ['#f9c5da', '#f4a7c6'], 15)}
  ${round(52, 340, 1.1, '#5d3f2c', ['#f4a7c6', '#f9c5da', '#ee8fb5', '#fbd5e4'], 16)}
  ${person('cyclist', 276, 352, 1.15, '#1d2a2e')}`;
}
function summer() {
  const r = rng(9); let waves = '', sparks = '';
  for (let i = 0; i < 7; i++) waves += `<path d="M${-60 + i * 4} ${252 + i * 7} q12 -4 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" fill="none" stroke="#fff" stroke-opacity="${.18 + i * .04}" stroke-width="1.4"/>`;
  for (let i = 0; i < 12; i++) sparks += `<ellipse class="sparkle" style="animation-delay:${(r() * 3).toFixed(1)}s" cx="${240 + r() * 120}" cy="${240 + r() * 40}" rx="${2 + r() * 5}" ry=".9" fill="#fff"/>`;
  return `<defs>${grad('sky', [[0, '#2b86d8'], [.5, '#7fcdf3'], [1, '#ffe7b0']])}${grad('sea', [[0, '#3cc2d6'], [1, '#0d7aa6']])}${grad('sand', [[0, '#f5dcA8'], [1, '#e2b975']])}${glow('sg', '#fff1a6')}</defs>
  <rect width="400" height="800" fill="url(#sky)"/>
  <circle cx="312" cy="150" r="96" fill="url(#sg)"/><circle cx="312" cy="150" r="32" fill="#fffbd0"/>
  ${cloud(70, 100, 1, .85, 'c1')}${cloud(220, 60, .7, .75, 'c2')}
  <path d="M0 232 Q60 222 120 232 T190 232 L190 240 L0 240Z" fill="#5a9b8a" opacity=".55"/>
  <rect y="238" width="400" height="70" fill="url(#sea)"/>
  <g class="sail"><path d="M118 236 L118 214 L132 234Z" fill="#fff"/><path d="M116 236 L136 236 L132 240 L120 240Z" fill="#c2410c"/></g>
  <g class="waves">${waves}</g>${sparks}
  <path class="foam" d="M-40 303 q20 -7 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 L460 312 L-40 312Z" fill="#fff" opacity=".85"/>
  <path d="M-20 306 Q120 296 220 304 T430 302 L430 810 L-20 810Z" fill="url(#sand)"/>
  <path d="M-20 316 Q120 308 220 316 T430 312" fill="none" stroke="#c9a15f" stroke-opacity=".35" stroke-width="1.5"/>
  ${palm(44, 336, 1.15)}${palm(378, 330, .9)}
  <g class="gull g1"><path d="M60 70 q6 -7 12 0 q6 -7 12 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></g>
  <g class="gull g2"><path d="M150 40 q5 -6 10 0 q5 -6 10 0" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></g>
  <rect x="150" y="336" width="42" height="9" rx="2" fill="#f4506f" transform="rotate(-6 170 340)"/><rect x="158" y="336" width="6" height="9" fill="#fff" opacity=".8" transform="rotate(-6 170 340)"/>
  ${person('pushups', 306, 352, 1.15, '#1b2733')}`;
}
function autumn() {
  const r = rng(77); let ref = '', leaves = '';
  for (let i = 0; i < 9; i++) ref += `<rect x="${80 + r() * 240}" y="${262 + i * 4.5}" width="${20 + r() * 60}" height="1.4" fill="#ffe2b8" opacity=".35"/>`;
  for (let i = 0; i < 34; i++) leaves += `<ellipse cx="${r() * 400}" cy="${318 + r() * 70}" rx="${2 + r() * 2.5}" ry="1.2" fill="${['#e0662b', '#f0a43a', '#b8411f', '#d98a2d'][i % 4]}"/>`;
  return `<defs>${grad('sky', [[0, '#7a5a97'], [.3, '#e8836b'], [.62, '#f8b56a'], [1, '#fde3b8']])}${grad('lake', [[0, '#f7b46c'], [1, '#6a4a52']])}${grad('gnd', [[0, '#8a4a2c'], [1, '#4f2c1f']])}${glow('sg', '#ffd58a')}</defs>
  <rect width="400" height="800" fill="url(#sky)"/>
  <circle cx="262" cy="226" r="90" fill="url(#sg)"/><circle cx="262" cy="226" r="28" fill="#ffe7b0"/>
  ${cloud(80, 110, .9, .35, 'c1')}${cloud(330, 150, .7, .3, 'c2')}
  ${mountains(252, 14, '#a86b6b', null, 28, 56, 5)}${hills(256, 14, 4, '#8f4f46')}
  <rect y="256" width="400" height="48" fill="url(#lake)"/>${ref}
  ${[20, 56, 130, 190, 300, 350].map((x, i) => round(x, 256, .26 + (i % 3) * .05, '#4b2a1a', ['#c4521f', '#e0802b', '#e9b04a'], 12)).join('')}
  <path d="M-20 300 Q110 290 220 298 T430 296 L430 810 L-20 810Z" fill="url(#gnd)"/>
  <path d="M-20 334 Q120 316 240 330 T430 322 L430 350 Q300 340 220 354 T-20 358Z" fill="#c68a58"/>
  ${leaves}
  ${round(34, 350, 1.2, '#3e2214', ['#b8411f', '#e0662b', '#f0a43a', '#c4521f'], 17)}${round(382, 340, .95, '#3e2214', ['#e0662b', '#f0a43a', '#b8411f'], 17)}
  ${round(96, 300, .5, '#3e2214', ['#e0802b', '#c4521f'], 15)}
  ${person('runner', 276, 352, 1.25, '#2a1710')}`;
}

const BUILD = { winter, spring, summer, autumn };
const R = rng(3);
const PARTS = { winter: ['snow', 34], spring: ['petal', 18], autumn: ['leaf', 20] };
function particles(season) {
  const p = PARTS[season]; if (!p) return '';
  const cols = ['#e0662b', '#f0a43a', '#b8411f', '#d98a2d'];
  let h = `<div class="parts ${p[0]}" aria-hidden="true">`;
  for (let i = 0; i < p[1]; i++) {
    const s = p[0] === 'snow' ? 2 + R() * 4 : 7 + R() * 6;
    h += `<i style="--l:${(R() * 100).toFixed(1)}%;--s:${s.toFixed(1)}px;--d:${(8 + R() * 10).toFixed(1)}s;--dl:${(-R() * 18).toFixed(1)}s;--x:${((R() - .3) * 90).toFixed(0)}px;--lc:${cols[i % 4]}"></i>`;
  }
  return h + '</div>';
}
window.Scene = {
  seasonOf, NAMES, LINES, particles,
  html: season => `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">${BUILD[season]()}</svg>${particles(season)}`,
};
})();
