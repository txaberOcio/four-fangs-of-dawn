/* Informe del recorrido de la Zona 1: en qué etapa (tras qué jefe) se abre cada sala, camino principal hasta cada jefe,
   desvíos opcionales y dificultad de cada tramo. Todo sale del propio mapa y del validador, así que se mantiene al día solo.
   Uso: npm run recorrido   -> ejecuta el validador con Aurora y con Vesper (entre 3 y 9 minutos, según la carga del equipo) y escribe docs/RECORRIDO-ZONA1.md
        node scripts/recorrido.js --dumps <carpeta>   -> reutiliza etapas_aurora.json y etapas_vesper.json ya generados */
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.join(__dirname, '..');
const World = require('../public/world.js');
const w = World.build(), T = World.T;

// ---------- datos que viven en el cliente (vida de enemigos y escala por zona)
const gameSrc = fs.readFileSync(path.join(ROOT, 'public/game.js'), 'utf8');
const ZONE_SCALE = JSON.parse(gameSrc.match(/const ZONE_SCALE = (\[[^\]]+\])/)[1]);
const EN = {};
for (const m of gameSrc.matchAll(/^ {2}(\w+): \{ tex: '[^']*', sc: [\d.]+, body: \[[^\]]*\], hp: (\d+), dmg: (\d+)(.*)$/gm)) EN[m[1]] = { hp: +m[2], dmg: +m[3], inv: /inv: true/.test(m[4]) };
const extrasSrc = fs.readFileSync(path.join(ROOT, 'public/extras.js'), 'utf8');
const GEMS_BOSS = Function('return ' + extrasSrc.match(/const GEMS_BOSS = (\{[^}]+\})/)[1])();
const SELLS_FANG = /\[\s*'fang'/.test(extrasSrc.match(/const SHOP_STOCK = \{[\s\S]*?\n\};/)[0]); // ¿alguna tienda vende el Colmillo de acero?
const SWORD = [1, 1, 2, 2, 3]; // daño de la espada (Carmesí) por nivel de arma, de referencia
const NAMES = { sk: 'esqueleto', kn: 'caballero', bat: 'murciélago', gh: 'fantasma', slug: 'babosa', shroom: 'hongo', vine: 'liana', pris: 'prisionero', saw: 'sierra', sentinel: 'centinela', moth: 'polilla', magma: 'babosa de magma' };
const NPC = { merchant: 'mercader', archivist: 'archivero', prisoner: 'prisionero (PNJ)', monk: 'monje', oracle: 'Oráculo', watcher: 'Vigía', rivalA: 'Aurora (PNJ)', rivalV: 'Vesper (PNJ)', smith: 'Herrero', smith2: 'Herrero (santuario)', jardinero: 'Jardinero' };
const ABIL = World.ABILITIES;

// ---------- etapas calculadas por el validador (una pasada con cada elección del Alba)
function dumps() {
  const i = process.argv.indexOf('--dumps');
  const dir = i > 0 ? process.argv[i + 1] : fs.mkdtempSync(path.join(os.tmpdir(), 'recorrido-'));
  const out = {};
  for (const pick of ['aurora', 'vesper']) {
    const f = path.join(dir, 'etapas_' + pick + '.json');
    if (i < 0) { console.error('validando con ' + pick + '...'); execFileSync(process.execPath, [path.join(__dirname, 'validate.js')], { env: { ...process.env, PICK: pick, DUMP: f }, stdio: 'ignore' }); }
    out[pick] = JSON.parse(fs.readFileSync(f, 'utf8'));
  }
  return out;
}
const D = dumps();
const rooms = w.areaList.filter(a => !a.special).map(a => a.id);
const nm = id => w.areas[id] ? w.areas[id].name : id;
const bossRoom = id => (w.bosses.find(b => b.id === id) || {}).area;

// ---------- grafo de salas por etapa (puertas por jefe, losas de raíces con el Pisotón)
// además de los enlaces declarados (puertas y huecos), dos salas se tocan si hay un hueco o una grieta en su frontera (p. ej. el suelo agrietado de la Cumbre)
const EXTRA = []; {
  const seen = new Set(w.links.map(l => [l.a, l.b].sort().join('|')));
  const kindAt = (gx, gy) => { const v = (w.fg[gy] || [])[gx]; return v === undefined || v < 0 ? -1 : v % 8; };
  const pass = k => k < 0 || k === World.K.CRACK;
  for (let gy = 0; gy < w.Ht - 1; gy++) for (let gx = 0; gx < w.Wt - 1; gx++) {
    const A = w.areaOf(gx, gy); if (!A) continue;
    for (const [nx, ny] of [[gx + 1, gy], [gx, gy + 1]]) {
      const B = w.areaOf(nx, ny); if (!B || B.id === A.id || !pass(kindAt(gx, gy)) || !pass(kindAt(nx, ny))) continue;
      const key = [A.id, B.id].sort().join('|'); if (seen.has(key)) continue; seen.add(key);
      const roots = w.roots.has(gy * w.Wt + gx) || w.roots.has(ny * w.Wt + nx);
      EXTRA.push({ t: 'X', a: A.id, b: B.id, roots });
    }
  }
}
function graphAt(d, s) {
  const fs0 = d.firstStage, defeated = [].concat(...d.reached.slice(0, s)), abil = d.abilAt[s] || d.abilAt[d.abilAt.length - 1];
  const open = r => (r in fs0 && fs0[r] <= s) || !!(w.areas[r] && w.areas[r].special); // las salas especiales (el foso del Conde) son de paso
  const adj = {}; w.areaList.forEach(a => { adj[a.id] = []; });
  for (const l of w.links.concat(EXTRA)) {
    if (!open(l.a) || !open(l.b)) continue;
    if (l.gate && !World.gateOpen(l.gate, defeated)) continue;
    if (l.roots && !abil.includes('pound')) continue;
    adj[l.a].push(l.b); adj[l.b].push(l.a);
  }
  return adj;
}
function shortest(adj, sources, target) {
  const prev = {}, q = []; sources.forEach(sr => { prev[sr] = null; q.push(sr); });
  while (q.length) { const r = q.shift(); if (r === target) break; for (const n of adj[r] || []) if (!(n in prev)) { prev[n] = r; q.push(n); } }
  if (!(target in prev)) return null;
  const p = []; for (let r = target; r !== null; r = prev[r]) p.unshift(r); return p;
}

// ---------- recorrido de cada variante: de jefe en jefe, y al final hasta La Gran Hoguera
const NST = World.PROGRESSION.length + 1;
function route(pick) {
  const d = D[pick], stages = [];
  for (let s = 0; s < NST; s++) {
    const adj = graphAt(d, s);
    const sources = s === 0 ? ['vest'] : (d.reached[s - 1] || []).map(bossRoom).filter(Boolean);
    const targets = s < World.PROGRESSION.length ? (d.reached[s] || []).map(bossRoom) : ['gran'];
    const paths = targets.map(t => ({ target: t, path: shortest(adj, sources, t) }));
    stages.push({ s, sources, targets, paths, abil: d.abilAt[s] || [], bosses: d.reached[s] || [] });
  }
  return stages;
}
const R = { aurora: route('aurora'), vesper: route('vesper') };

// ---------- clasificación de cada sala: camino (en qué etapa), más adelante, o desvío
const onPath = {}; // sala -> etapas en las que se pisa (cualquier variante)
for (const pick of ['aurora', 'vesper']) R[pick].forEach(st => st.paths.forEach(p => (p.path || []).forEach(r => { (onPath[r] = onPath[r] || new Set()).add(st.s); })));
const firstOf = r => Math.min(D.aurora.firstStage[r] ?? 99, D.vesper.firstStage[r] ?? 99);

// ---------- contenido de cada sala
const inRoom = (list, r) => list.filter(o => o.area === r);
function roomInfo(r) {
  const a = w.areas[r], sc = ZONE_SCALE[a.diff] || 1;
  const sp = inRoom(w.spawns, r);
  const foes = sp.filter(s => EN[s.type] && !EN[s.type].inv), saws = sp.filter(s => EN[s.type] && EN[s.type].inv);
  const hp = foes.reduce((t, s) => t + Math.ceil(EN[s.type].hp * sc) * (s.opts && s.opts.elite ? 3 : 1), 0);
  const types = {}; foes.forEach(s => { types[s.type] = (types[s.type] || 0) + 1; });
  const elites = foes.filter(s => s.opts && s.opts.elite).map(s => s.opts.name);
  const pits = a.ops.filter(o => o[0] === 'pit').length + a.ops.filter(o => o[0] === 'S').length;
  const items = [];
  inRoom(w.crystals, r).forEach(() => items.push('cristal de vida'));
  inRoom(w.gems, r).forEach(() => items.push('gema'));
  inRoom(w.forges, r).forEach(() => items.push('mejora de arma'));
  inRoom(w.pages, r).forEach(() => items.push('diario'));
  inRoom(w.altars, r).forEach(o => items.push(o.big ? 'GRAN HOGUERA' : 'hoguera'));
  inRoom(w.npcs, r).forEach(o => items.push(NPC[o.type] || o.type));
  (w.sforges || []).filter(o => o.area === r).forEach(o => items.push(o.kind === 'shrine' ? 'altar de sombras' : 'forja de elementos'));
  elites.forEach(n => items.push('élite: ' + n));
  const boss = w.bosses.find(b => b.area === r);
  return { r, name: a.name, region: World.ZONES[a.z] || 'roca', z: a.z, diff: a.diff, sc, n: foes.length, hp, types, saws: saws.length, pits, items, boss: boss ? boss.id : null, dmgBonus: a.diff >= 4 };
}
const INFO = {}; w.areaList.forEach(a => { INFO[a.id] = roomInfo(a.id); });
const typesTxt = t => Object.entries(t).map(([k, v]) => v + ' ' + (NAMES[k] || k)).join(', ') || '—';

// ---------- poder del jugador al empezar cada etapa (lo que se puede tener como mucho)
function power(pick, s) {
  const d = D[pick], got = k => (d.firstStage[k] ?? 99) <= s;
  const cry = w.crystals.filter(c => got('cry:' + c.id)).length;
  const forges = w.forges.filter(f => (d.firstStage[f.area] ?? 99) <= s).length;
  const gemsMap = w.gems.filter(g => got('gem:' + g.id)).length;
  const bossGems = [].concat(...d.reached.slice(0, s)).reduce((t, b) => t + (GEMS_BOSS[b] || 0), 0);
  const eliteGems = w.spawns.filter(sp => sp.opts && sp.opts.elite && (d.firstStage[sp.area] ?? 99) <= s).length;
  const lvl = Math.min(5, 1 + forges), gems = gemsMap + bossGems + eliteGems;
  // Colmillo de acero (+1 de daño, cuesta 4, 6 y 8 gemas): solo si alguna tienda lo vende
  const fang = !SELLS_FANG ? 0 : gems >= 18 ? 3 : gems >= 10 ? 2 : gems >= 4 ? 1 : 0;
  // Fruto de sangre (+1 corazón, 5 y 7 gemas, hasta 2): en la Casa del Mercader, que se abre desde la Sala de los Rivales
  const fruit = (d.firstStage.albaH ?? 99) > s ? 0 : gems >= 12 ? 2 : gems >= 5 ? 1 : 0;
  return { hearts: 5 + cry, fruit, lvl, dmg: SWORD[lvl - 1], fang, gems };
}

// ---------- informe en Markdown
const L = [];
const P = (...x) => L.push(x.join(''));
P('# Recorrido de la Zona 1 (informe automático)');
P('');
P('> Generado con `npm run recorrido` a partir del mapa (`public/world.js`) y del validador. No editar a mano: vuelve a generarlo tras cambiar el mapa. El análisis y las decisiones de diseño están en [ZONA1.md](ZONA1.md).');
P('');
P('Etapa = lo que se puede hacer con los jefes derrotados hasta ese momento. «Camino» = salas que se pisan en la ruta más corta (en salas) hasta el jefe siguiente; el cálculo no distingue el sentido de las caídas, así que es orientativo.');
P('');
for (let s = 0; s < NST; s++) {
  const A = R.aurora[s], V = R.vesper[s];
  const goal = s < World.PROGRESSION.length ? World.PROGRESSION[s].bosses.map(b => b === 'rival' ? 'Aurora o Vesper' : (World.BOSSES[b] || {}).name || b).join(' y ') : 'La Gran Hoguera (fin de la Zona 1)';
  const prev = s === 0 ? 'inicio (Vestíbulo)' : World.PROGRESSION[s - 1].bosses.map(b => b === 'rival' ? 'Aurora o Vesper' : (World.BOSSES[b] || {}).name || b).join(' y ');
  P('## Etapa ', s, ': ', goal);
  P('');
  const ab = A.abil.map(k => ABIL[k] || k), abV = V.abil.map(k => ABIL[k] || k);
  P('- **Viene de:** ', prev, ' · **Habilidades:** ', ab.join(', ') || 'ninguna', abV.join(',') !== ab.join(',') ? ' (con Vesper: ' + (abV.join(', ') || 'ninguna') + ')' : '');
  const pa = power('aurora', s);
  P('- **Como mucho, el jugador tiene:** ', pa.hearts + pa.fruit, ' corazones (5 de base + cristales', pa.fruit ? ' + ' + pa.fruit + ' Fruto(s) de sangre' : '', '), arma nivel ', pa.lvl, ' (espada: ', pa.dmg, ' de daño por golpe), ', pa.gems, ' gemas en total', pa.fang ? ' (le dan para ' + pa.fang + ' Colmillo(s) de acero: hasta ' + (pa.dmg + pa.fang) + ' de daño por golpe)' : '');
  const pathsTxt = (st, tag) => st.paths.map(p => '  - ' + tag + 'hasta **' + nm(p.target) + '**: ' + (p.path ? p.path.map(r => nm(r) + (firstOf(r) === s ? ' ✦' : '')).join(' → ') + ' (' + p.path.length + ' salas)' : 'SIN CAMINO en el grafo de salas')).join('\n');
  P('- **Camino principal** (✦ = sala nueva en esta etapa):');
  if (JSON.stringify(A.paths.map(p => p.path)) === JSON.stringify(V.paths.map(p => p.path))) P(pathsTxt(A, '')); else { P(pathsTxt(A, 'con Aurora, ')); P(pathsTxt(V, 'con Vesper, ')); }
  // salas que se abren aquí
  const opened = rooms.filter(r => firstOf(r) === s);
  const detours = opened.filter(r => !onPath[r]);
  const later = opened.filter(r => onPath[r] && ![...onPath[r]].some(x => x <= s));
  P('- **Salas que se abren:** ', opened.length, ' · de ellas desvíos opcionales: ', detours.length, later.length ? ' · se usan más adelante: ' + later.map(nm).join(', ') : '');
  if (detours.length) { P('- **Desvíos:**'); detours.forEach(r => P('  - ', nm(r), ' (', INFO[r].region, ')', INFO[r].items.length ? ': ' + INFO[r].items.join(', ') : '')); }
  // dificultad del tramo
  const pathRooms = [...new Set([].concat(...A.paths.map(p => p.path || []), ...V.paths.map(p => p.path || [])))];
  P('');
  P('| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |');
  P('|---|---|---|---|---|---|---|');
  pathRooms.forEach(r => { const i = INFO[r]; P('| ', i.name, firstOf(r) === s ? ' ✦' : '', ' | ', i.region, ' | ', i.diff, ' (×', i.sc, ')', i.dmgBonus ? ' +1 daño' : '', ' | ', typesTxt(i.types), ' | ', i.hp, ' | ', [i.pits ? i.pits + ' pinchos' : '', i.saws ? i.saws + ' sierras' : ''].filter(Boolean).join(', ') || '—', ' | ', [i.boss ? 'JEFE: ' + (World.BOSSES[i.boss] || {}).name : '', ...i.items].filter(Boolean).join(', ') || '—', ' |'); });
  const tot = pathRooms.reduce((t, r) => t + INFO[r].hp, 0), nEn = pathRooms.reduce((t, r) => t + INFO[r].n, 0);
  P('');
  P('Total del camino: ', pathRooms.length, ' salas, ', nEn, ' enemigos, ', tot, ' de vida de enemigos.');
  (A.bosses.length ? A.bosses : []).concat(V.bosses.filter(b => !A.bosses.includes(b))).forEach(b => { const hp = (EN[b] || {}).hp; if (hp) P('Jefe **', (World.BOSSES[b] || {}).name, '**: ', hp, ' de vida (1 jugador) → ', pa.fang ? 'entre ' + Math.ceil(hp / (pa.dmg + pa.fang)) + ' y ' + Math.ceil(hp / pa.dmg) + ' golpes de espada (con y sin Colmillos)' : Math.ceil(hp / pa.dmg) + ' golpes de espada', '; suelta ', GEMS_BOSS[b] || 0, ' gemas', World.BOSSES[b] && World.BOSSES[b].drop ? ' y ' + (ABIL[World.BOSSES[b].drop] || World.BOSSES[b].drop) : '', '.'); });
  P('');
}
// salas que nunca están en ningún camino
P('## Todas las salas por etapa');
P('');
P('| Sala | Región | Se abre en etapa | Camino en etapa(s) | Tipo |');
P('|---|---|---|---|---|');
rooms.slice().sort((x, y) => firstOf(x) - firstOf(y)).forEach(r => { const st = onPath[r] ? [...onPath[r]].sort((a, b) => a - b).join(', ') : '—'; const fA = D.aurora.firstStage[r], fV = D.vesper.firstStage[r]; P('| ', nm(r), ' | ', INFO[r].region, ' | ', fA === fV ? fA : 'Aurora ' + (fA ?? '—') + ' / Vesper ' + (fV ?? '—'), ' | ', st, ' | ', onPath[r] ? 'camino' : 'desvío', ' |'); });
const outFile = path.join(ROOT, 'docs', 'RECORRIDO-ZONA1.md');
fs.writeFileSync(outFile, L.join('\n') + '\n');
console.log('escrito ' + path.relative(ROOT, outFile));
