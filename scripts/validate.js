/* Validador de alcanzabilidad: simula la física del jugador sobre el mapa y comprueba que
   el castillo se puede completar en orden (dash -> doble salto -> salto de pared -> Conde). */
const World = require('../public/world.js');
const w = World.build();
w.gates.forEach(g => g.tiles.forEach(t => { w.fg[t.gy][t.gx] = -1; })); // las puertas del Conde se asumen abiertas
const { T, PHYS: P, K, kind } = World;
const HW = P.bodyW / 2, HH = P.bodyH / 2, DT = 1 / 60;

function tileKind(gx, gy) {
  if (gx < 0 || gx >= w.Wt || gy < 0) return K.SOLID;
  if (gy >= w.Ht) return K.SOLID;
  const k = kind(w.fg[gy][gx]);
  return k;
}
const solidK = k => k === K.SOLID || k === K.FLOOR; // las grietas se asumen rompibles
const rectHits = (x, y, pred) => {
  const x0 = Math.floor((x - HW) / T), x1 = Math.floor((x + HW - 0.001) / T);
  const y0 = Math.floor((y - HH) / T), y1 = Math.floor((y + HH - 0.001) / T);
  for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) if (pred(tileKind(gx, gy), gx, gy)) return true;
  return false;
};
const hitsSolid = (x, y) => rectHits(x, y, solidK);
const HHC = 12; // medio alto del cuerpo agachado
const crouchFits = (x, y) => { const cy = y + (HH - HHC); const x0 = Math.floor((x - HW) / T), x1 = Math.floor((x + HW - 0.001) / T), y0 = Math.floor((cy - HHC) / T), y1 = Math.floor((cy + HHC - 0.001) / T);
  for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) if (solidK(tileKind(gx, gy))) return false; return true; };
const hitsSpikes = (x, y) => rectHits(x, y, k => k === K.SPIKES);

function groundBelow(x, y) { // ¿hay suelo justo bajo los pies?
  const feet = y + HH + 0.5;
  const gy = Math.floor(feet / T);
  const x0 = Math.floor((x - HW + 1) / T), x1 = Math.floor((x + HW - 1) / T);
  for (let gx = x0; gx <= x1; gx++) {
    const k = tileKind(gx, gy);
    if (solidK(k)) return true;
    if (k === K.ONEWAY && Math.abs(feet - gy * T) <= 1.5) return true;
  }
  return false;
}

// Simula un plan. Devuelve {x,y} de aterrizaje o null si muere/no aterriza.
function simulate(x, y, plan, abil) {
  let vx = 0, vy = 0, onG = true, jumpsUsed = 0, dashT = 0, dashUsed = false, wjLock = 0, dir = plan.dir, wallTouch = 0;
  let dashDir = 0, t = 0;
  const maxF = plan.walkoff ? 240 : 260;
  const flipAt = plan.flipAt, jumpedAt = plan.walkoff ? -1 : 0;
  let airFrames = 0, jumpHeldUntil = plan.hold;
  for (let f = 0; f < maxF; f++) {
    t = f * DT;
    // eventos
    if (!plan.walkoff && f === jumpedAt) { vy = P.jump; onG = false; jumpsUsed = 1; }
    if (plan.walkoff && f === 0) { /* solo camina */ }
    if (flipAt && f === Math.round(flipAt * 60)) dir = plan.flipTo;
    if (abil.dj && plan.dj !== undefined && f === Math.round(plan.dj * 60) && !onG && jumpsUsed < 2 && dashT <= 0) { vy = P.djump; jumpsUsed = 2; }
    if (abil.dash && plan.dash !== undefined && f === Math.round(plan.dash * 60) && !dashUsed && dashT <= 0) { dashT = P.dashTime; dashUsed = true; dashDir = plan.dashDir || (dir || 1); }
    // salto corto: si se suelta, corta velocidad
    if (!plan.walkoff && jumpHeldUntil !== undefined && f === Math.round(jumpHeldUntil * 60) && vy < -150) vy *= 0.4;
    // planeo (Alas del Alba): cayendo y manteniendo saltar, caída lenta y algo más de velocidad
    const glide = !!(abil.wings && plan.glide && !onG && vy > 55 && t < (plan.glideEnd || 99));
    // horizontales
    if (dashT > 0) { vx = dashDir * P.dashSpeed; vy = 0; dashT -= DT; }
    else if (wjLock > 0) { wjLock -= DT; }
    else vx = dir * P.speed * (glide ? 1.25 : 1);
    // salto de pared automático
    if (abil.wj && !onG && wallTouch !== 0 && vy > -60 && dashT <= 0 && plan.wall) {
      vy = P.wjY; vx = -wallTouch * P.wjX; wjLock = P.wjLock; dir = -wallTouch; jumpsUsed = Math.min(jumpsUsed, 1); wallTouch = 0;
    }
    if (dashT <= 0) {
      vy += P.gravity * DT; if (vy > P.maxFall) vy = P.maxFall;
      if (glide) vy = Math.min(vy, 60);
      if (abil.wj && wallTouch !== 0 && vy > P.slide) vy = P.slide;
    }
    // mover X
    wallTouch = 0;
    let nx = x + vx * DT;
    if (hitsSolid(nx, y)) {
      // pegar a la pared
      const step = Math.sign(vx) || 1;
      let tx = x; for (let i = 0; i < 8 && !hitsSolid(tx + step * 0.5, y); i++) tx += step * 0.5;
      nx = tx; if (vx !== 0) wallTouch = step;
      if (dashT > 0) dashT = 0;
      vx = 0;
    } else if (dir !== 0 && !onG) {
      // contacto con pared adyacente (para wall jump) cuando se pulsa hacia ella
      if (hitsSolid(nx + dir * 1.5, y)) wallTouch = dir;
    }
    x = nx;
    // mover Y
    const ny = y + vy * DT;
    if (vy >= 0) {
      const prevFeet = y + HH, newFeet = ny + HH;
      let landed = false, landY = ny;
      const gy0 = Math.floor(prevFeet / T), gy1 = Math.floor(newFeet / T);
      const x0 = Math.floor((x - HW + 1) / T), x1 = Math.floor((x + HW - 1) / T);
      for (let gy = gy0; gy <= gy1 && !landed; gy++) for (let gx = x0; gx <= x1; gx++) {
        const k = tileKind(gx, gy);
        if (solidK(k) || (k === K.ONEWAY && prevFeet <= gy * T + 1)) {
          if (newFeet >= gy * T) { landed = true; landY = gy * T - HH; break; }
        }
      }
      if (landed) { y = landY; vy = 0; if (f > 3 || plan.walkoff) { if (hitsSpikes(x, y)) return null; return { x, y }; } onG = true; jumpsUsed = 0; dashUsed = false; }
      else { y = ny; onG = false; }
    } else {
      if (hitsSolid(x, ny)) { vy = 0; } else y = ny;
      onG = false;
    }
    if (hitsSpikes(x, y)) return null;
    if (y > w.Ht * T) return null;
  }
  return null;
}

function standOk(x, y) { return !hitsSolid(x, y) && groundBelow(x, y); }

function plansFor(abil) {
  const plans = [];
  const flips = [{ }, { flipAt: 0.4, flipTo: 0 }, { flipAt: 0.7, flipTo: 0 }, { flipAt: 0.5, flipTo: 'inv' }];
  for (const dir of [-1, 0, 1]) for (const hold of [undefined, 0.12]) for (const fl of flips) {
    const base = { dir, hold, wall: true, ...fl };
    if (base.flipTo === 'inv') { if (dir === 0) continue; base.flipTo = -dir; }
    plans.push(base);
    if (abil.dj) for (const dj of [0.25, 0.45, 0.7, 0.95]) plans.push({ ...base, dj });
    if (abil.dash) for (const dash of [0.0, 0.2, 0.4, 0.6]) for (const dd of dir === 0 ? [-1, 1] : [dir]) plans.push({ ...base, dash, dashDir: dd });
    if (abil.dj && abil.dash) for (const dj of [0.35, 0.6]) for (const dash of [0.1, 0.3, 0.6]) for (const dd of dir === 0 ? [-1, 1] : [dir]) plans.push({ ...base, dj, dash, dashDir: dd });
  }
  if (abil.wings) { const n = plans.length; for (let i = 0; i < n; i++) for (const ge of [1.4, 99]) plans.push({ ...plans[i], glide: true, glideEnd: ge }); } // con planeo (se mantiene saltar)
  return plans;
}

function bfs(abil, start, restrict) {
  const plans = plansFor(abil);
  const key = (tx, ty) => ty * w.Wt + tx;
  const seen = new Map();
  const q = [];
  const add = (x, y) => {
    if (restrict) { const ar = w.areaOf(Math.floor(x / T), Math.floor(y / T)); if (!ar || !restrict.includes(ar.id)) return; }
    const tx = Math.floor(x / T), ty = Math.floor(y / T);
    const k = key(tx, ty);
    if (seen.has(k)) return;
    const nx = (tx + 0.5) * T;
    seen.set(k, { x, y, tx, ty });
    q.push({ x, y, tx, ty });
  };
  add(start.x, start.y - HH);
  while (q.length) {
    const n = q.shift();
    // caminar
    for (const d of [-1, 1]) {
      const nx = (n.tx + d + 0.5) * T;
      if (!hitsSolid(nx, n.y) && !hitsSpikes(nx, n.y)) {
        if (groundBelow(nx, n.y)) add(nx, n.y);
        else { const r = simulate(nx, n.y, { dir: d, walkoff: true }, abil); if (r) add(r.x, r.y); }
      } else if (!hitsSpikes(nx, n.y) && groundBelow(nx, n.y) && crouchFits(nx, n.y)) add(nx, n.y); // reptar agachado
    }
    if (hitsSolid(n.x, n.y)) continue; // nodo de túnel: solo se avanza agachado
    // caer a través de plataformas (abajo + saltar)
    { const feetGy = Math.floor((n.y + HH + 1) / T); const k0 = tileKind(Math.floor(n.x / T), feetGy);
      if (k0 === K.ONEWAY) for (const d of [-1, 0, 1]) { const r = simulate(n.x, n.y + 6, { dir: d, walkoff: true }, abil); if (r) add(r.x, r.y); } }
    // saltos solo desde posiciones "muestreadas" (cada 2 tiles) y bordes
    const edgeL = !groundBelow(n.x - T * 0.6, n.y), edgeR = !groundBelow(n.x + T * 0.6, n.y);
    if (!(n.tx % 2 === 0 || edgeL || edgeR)) continue;
    const starts = [n.x]; if (edgeR && groundBelow(n.x + 12, n.y)) starts.push(n.x + 12); if (edgeL && groundBelow(n.x - 12, n.y)) starts.push(n.x - 12);
    for (const sx of starts) for (const p of plans) {
      const r = simulate(sx, n.y, p, abil);
      if (r && standOk(r.x, r.y)) add(r.x, r.y);
    }
  }
  return [...seen.values()];
}

if (process.argv[2] === 'room') { // node validate.js room <idArea> <dash> <dj> <wj>
  const a = { dash: process.argv[4] === '1', dj: process.argv[5] === '1', wj: process.argv[6] === '1' };
  const ar = w.areas[process.argv[3]];
  const nodes = bfs(a, w.spawnPoint).filter(n => w.areaOf(Math.floor(n.x / T), Math.floor(n.y / T)) === ar);
  const rows = {}; nodes.forEach(n => { const ly = Math.floor((n.y + HH) / T) - 1 - ar.y0, lx = Math.floor(n.x / T) - ar.x0; (rows[ly] = rows[ly] || []).push(lx); });
  Object.keys(rows).sort((p, q) => p - q).forEach(k => console.log('fila', k, ':', [...new Set(rows[k])].sort((p, q) => p - q).join(' ')));
  process.exit();
}
if (process.argv[2] === 'from') { // node validate.js from <areaOrigen> <x local> <areaDestino> <dash> <dj> <wj>
  const a = { dash: process.argv[6] === '1', dj: process.argv[7] === '1', wj: process.argv[8] === '1' };
  const o = w.areas[process.argv[3]], d = w.areas[process.argv[5]];
  const nodes = bfs(a, { x: (o.x0 + +process.argv[4] + 0.5) * T, y: (o.y0 + o.rh - 1) * T }, [o.id, d.id]); // solo se pueden usar estas dos salas
  const inD = nodes.filter(n => w.areaOf(Math.floor(n.x / T), Math.floor(n.y / T)) === d);
  console.log('desde', o.id, 'hasta', d.id, 'abil', JSON.stringify(a), '=>', inD.length ? 'ALCANZABLE (' + inD.length + ' posiciones)' : 'no alcanzable'); process.exit();
}
if (process.argv[2] === 'dbg') { // depuración: node validate.js dbg <gx> <gy> <dash> <dj> <wj>
  const [gx, gy] = [+process.argv[3], +process.argv[4]];
  const a = { dash: process.argv[5] === '1', dj: process.argv[6] === '1', wj: process.argv[7] === '1' };
  const res = new Map();
  for (const off of [10, 16, 22]) for (const p of plansFor(a)) {
    const r = simulate(gx * T + off, gy * T - HH, p, a);
    if (r && standOk(r.x, r.y)) { const k = Math.floor(r.x / T) + ',' + Math.floor((r.y + HH) / T - 1); if (!res.has(k)) res.set(k, JSON.stringify(p)); }
  }
  console.log([...res.entries()].map(e => e[0] + ' <- ' + e[1]).join('\n')); process.exit();
}
// ---- Fases de progreso ----
const abil = { dash: false, dj: false, wj: false };
const start = w.spawnPoint;
const roomOf = n => { const a = w.areaOf(Math.floor(n.x / T), Math.floor(n.y / T)); return a ? a.id : 'roca'; };
const firstStage = {};
const stages = [];
let stage = 0, changed = true;
let finalNodes = [];
while (changed) {
  const t0 = Date.now();
  const nodes = bfs(abil, start);
  const rooms = new Set(nodes.map(roomOf));
  rooms.forEach(r => { if (!(r in firstStage)) firstStage[r] = stage; });
  w.crystals.forEach(c => { if (!('cry:' + c.id in firstStage) && nodes.some(n => Math.abs(n.x - c.x) < 70 && Math.abs(n.y - c.y) < 70)) firstStage['cry:' + c.id] = stage; });
  w.gems.forEach(c => { if (!('gem:' + c.id in firstStage) && nodes.some(n => Math.abs(n.x - c.x) < 70 && Math.abs(n.y - c.y) < 70)) firstStage['gem:' + c.id] = stage; });
  w.altars.forEach(c => { if (!('alt:' + c.id in firstStage) && nodes.some(n => Math.abs(n.x - c.x) < 70 && Math.abs(n.y - c.y) < 70)) firstStage['alt:' + c.id] = stage; });
  changed = false;
  for (const b of w.bosses) if (rooms.has(b.area) && b.drop && !abil[b.drop]) { abil[b.drop] = true; changed = true; }
  console.log(`Fase ${stage}: ${nodes.length} posiciones, ${rooms.size} salas alcanzables (${((Date.now() - t0) / 1000).toFixed(1)}s) habilidades=${Object.keys(abil).filter(k => abil[k]).join(',') || '-'}`);
  finalNodes = nodes; stage++;
}
const allRooms = Object.keys(w.areas).filter(r => !w.areas[r].special);
const missing = allRooms.filter(r => !(r in firstStage));
const names = { 0: 'sin habilidades', 1: 'tras Impulso', 2: 'tras Doble salto', 3: 'tras Salto de pared' };
console.log('\nSalas por fase en la que se alcanzan:');
for (let s = 0; s < stage; s++) {
  const list = allRooms.filter(r => firstStage[r] === s).map(r => w.areas[r].name + ' (' + r + ')');
  console.log(`  [${names[s] || s}] ${list.length}: ${list.join(', ')}`);
}
console.log('\nCristales:', w.crystals.map(c => `${c.area}→fase ${firstStage['cry:' + c.id] ?? 'INALCANZABLE'}`).join(' | '));
console.log('Altares:', w.altars.map(c => `${c.area}→fase ${firstStage['alt:' + c.id] ?? 'INALCANZABLE'}`).join(' | '));
console.log('\nSalas INALCANZABLES:', missing.length ? missing.map(r => w.areas[r].name + ' (' + r + ')').join(', ') : 'ninguna');
const unreachC = w.crystals.filter(c => !('cry:' + c.id in firstStage)).concat(w.gems.filter(c => !('gem:' + c.id in firstStage)));
console.log('Gemas:', w.gems.map(c => `${c.area}→fase ${firstStage['gem:' + c.id] ?? 'INALCANZABLE'}`).join(' | '));
process.exitCode = missing.length || unreachC.length ? 1 : 0;

// ---- Rutas: ¿se puede acabar el juego con solo una de las dos recompensas del Alba? (node scripts/validate.js rutas) ----
if (process.argv[2] === 'rutas') {
  const base = { dash: true, dj: true, wj: true };
  const must = ['throne', 'scrip', 'cat2', 'cumbre']; // jefes obligatorios y salas clave (la Cueva del Abismo y la Forja exigen planear: es opcional)
  let bad = false;
  for (const [name, extra] of [['SOLO Aurora (alas, sin el Ojo)', { wings: true }], ['SOLO Vesper (Ojo, sin alas)', { eye: true }]]) {
    const ab = { ...base, ...extra }, nodes = bfs(ab, start), rooms = new Set(nodes.map(roomOf));
    const lost = allRooms.filter(r => !rooms.has(r)), lostMust = must.filter(r => !rooms.has(r));
    const items = w.crystals.concat(w.gems).filter(c => !nodes.some(n => Math.abs(n.x - c.x) < 70 && Math.abs(n.y - c.y) < 70));
    console.log(`\nRuta ${name}: ${rooms.size} salas; sin alcanzar: ${lost.length ? lost.join(', ') : 'ninguna'}; cristales/gemas fuera de alcance: ${items.length}${items.length ? ' (' + items.map(c => c.area).join(', ') + ')' : ''}`);
    if (lostMust.length) { bad = true; console.log('  ERROR: salas obligatorias inalcanzables en esta ruta: ' + lostMust.join(', ')); }
  }
  process.exit(bad ? 1 : 0);
}
