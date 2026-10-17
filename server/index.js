const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const World = require('../public/world.js');

const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'users.json');
const COLORS = ['red', 'blue', 'green', 'purple'];
const ABILITIES = ['dash', 'dj', 'wj', 'wings', 'eye'];
const ABIL_BOSS = { dash: 'garg', dj: 'bishop', wj: 'clock', wings: 'aurora', eye: 'vesper' }; // habilidad -> jefe que la da
const BOSS_IDS = ['garg', 'bishop', 'clock', 'conde', 'aurora', 'vesper'];
const RIVAL = { aurora: 'vesper', vesper: 'aurora' }; // solo se puede derrotar a uno de los dos
const MAX_PLAYERS = 4;
const MAX_ACCOUNTS = Number(process.env.MAX_ACCOUNTS) || 2000;
const world = World.build(); // se usa para validar eventos (por ejemplo, que un muro roto sea de verdad una grieta)

// ---------- Cuentas (JSON, contraseñas con scrypt) ----------
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
let users = {};
if (fs.existsSync(DATA_FILE)) {
  try { users = readJson(DATA_FILE); } catch (err) {
    // nunca arrancar "vacío" encima de datos que no se pueden leer: se prueba la copia y, si tampoco sirve, se aborta
    console.error('No se puede leer ' + DATA_FILE + ': ' + err.message);
    try { users = readJson(DATA_FILE + '.bak'); console.error('Se ha cargado la copia de seguridad (.bak).'); } catch {
      console.error('Tampoco hay copia válida. Arreglad o mover el fichero antes de arrancar (no se sobrescribe nada).'); process.exit(1);
    }
  }
}
function normalizeStats(u) {
  const s = u.stats || {};
  u.stats = { games: s.games || 0, wins: s.wins || 0, bosses: s.bosses || 0, bestTime: s.bestTime || null };
  return u.stats;
}
Object.values(users).forEach(normalizeStats);
// migración: la partida única antigua pasa a la ranura del vampiro carmesí
Object.values(users).forEach(u => { if (u.save && !u.saves) u.saves = { red: u.save }; delete u.save; });
const ELEMS = ['fire', 'ice', 'bolt', 'poison', 'shadow', 'eclipse', 'wither'];
const ITEM_IDS = ['pot', 'pot2', 'spd', 'str', 'lamp', 'amu', 'ward', 'rage', 'tonic', 'fruit', 'bomb'];
const clampInt = (v, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(+v) ? Math.floor(+v) : lo));
const strList = (a, max, len = 24) => (Array.isArray(a) ? a.filter(x => typeof x === 'string' && x.length <= len).slice(0, max) : []);
function sanitizeMe(m) {
  m = m && typeof m === 'object' ? m : {};
  const inv = {}; ITEM_IDS.forEach(k => { inv[k] = clampInt(m.inv && m.inv[k], 0, 9); });
  return { souls: clampInt(m.souls, 0, 99999), inv, wlv: clampInt(m.wlv, 1, 5), maxHp: clampInt(m.maxHp, 5, 40), cry: strList(m.cry, 40), forge: strList(m.forge, 20),
    abil: { dash: !!(m.abil && m.abil.dash), dj: !!(m.abil && m.abil.dj), wj: !!(m.abil && m.abil.wj), wings: !!(m.abil && m.abil.wings), eye: !!(m.abil && m.abil.eye) }, elite: strList(m.elite, 20, 40), pages: strList(m.pages, 20), seen: strList(m.seen, 20), kills: (() => { const o = {}; for (const k of ['sk', 'kn', 'bat', 'gh', 'saw', 'sentinel', 'garg', 'bishop', 'clock', 'conde', 'aurora', 'vesper']) o[k] = clampInt(m.kills && m.kills[k], 0, 99999); return o; })(),
    travel: !!m.travel, el: ELEMS.includes(m.el) ? m.el : '',
    gems: clampInt(m.gems, 0, 999), gemGot: strList(m.gemGot, 60), bg: strList(m.bg, 12), perm: { dmg: clampInt(m.perm && m.perm.dmg, 0, 3), souls: clampInt(m.perm && m.perm.souls, 0, 2) },
    altar: typeof m.altar === 'string' ? m.altar.slice(0, 24) : '', lit: strList(m.lit, 30), visited: strList(m.visited, 80) };
}
// datos personales que se entregan a un jugador: las habilidades solo valen si su jefe ya cayó en el mundo de la sala
function meFor(r, me) {
  if (!me) return null;
  const out = JSON.parse(JSON.stringify(me)); out.abil = out.abil || {};
  for (const a of ABILITIES) if (out.abil[a] && !r.progress.bosses.includes(ABIL_BOSS[a])) out.abil[a] = false;
  return out;
}
const slotInfo = s => (s ? { at: s.at, bosses: (s.world && s.world.bosses ? s.world.bosses.length : 0) } : null);
const savesInfo = u => { const o = {}; for (const c of ['red', 'blue', 'green', 'purple']) if (u && u.saves && u.saves[c]) o[c] = slotInfo(u.saves[c]); return o; };
let lastBak = 0;
function saveUsers() {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    if (fs.existsSync(DATA_FILE) && Date.now() - lastBak > 5 * 60 * 1000) { fs.copyFileSync(DATA_FILE, DATA_FILE + '.bak'); lastBak = Date.now(); } // copia de seguridad cada 5 min
    const tmp = DATA_FILE + '.tmp', text = JSON.stringify(users, null, 2);
    fs.writeFileSync(tmp, text);
    try { fs.renameSync(tmp, DATA_FILE); } catch { fs.writeFileSync(DATA_FILE, text); } // en Windows el renombrado puede fallar (antivirus, OneDrive)
  } catch (err) { console.error('No se pudo guardar users.json: ' + err.message); }
}
const scryptAsync = (password, salt) => new Promise((res, rej) => crypto.scrypt(password, salt, 64, (e, k) => (e ? rej(e) : res(k.toString('hex'))))); // asíncrono: no bloquea el servidor
function validName(n) { return typeof n === 'string' && /^[A-Za-z0-9_]{3,16}$/.test(n); }

// ---------- Límites de intentos de acceso ----------
const failures = new Map(); // clave (ip o usuario) -> { n, until }
function blocked(key) { const f = failures.get(key); return !!(f && f.until > Date.now()); }
function fail(key, limit = 5) {
  const f = failures.get(key) || { n: 0, until: 0 };
  if (f.until && f.until <= Date.now()) { f.n = 0; f.until = 0; }
  f.n++; if (f.n >= limit) f.until = Date.now() + 60 * 1000;
  failures.set(key, f);
}
setInterval(() => { const now = Date.now(); for (const [k, f] of failures) if (f.until < now && f.n < 5) failures.delete(k); }, 5 * 60 * 1000).unref();

// ---------- Servidor web ----------
const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', 1);
app.use((req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'no-referrer'); next(); });
app.use('/vendor/phaser.min.js', express.static(path.join(__dirname, '..', 'node_modules', 'phaser', 'dist', 'phaser.min.js')));
app.use('/vendor/socket.io.min.js', express.static(path.join(__dirname, '..', 'node_modules', 'socket.io', 'client-dist', 'socket.io.min.js')));
app.use(express.static(path.join(__dirname, '..', 'public'), { etag: false, maxAge: 0 }));
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 64 * 1024 }); // ningún mensaje legítimo se acerca a 64 KB

// ---------- Salas ----------
const rooms = new Map();
const userSockets = new Map(); // usuario -> socket activo (solo una sesión por usuario)
function newCode() {
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let c;
  do { c = Array.from({ length: 4 }, () => L[crypto.randomInt(L.length)]).join(''); } while (rooms.has(c));
  return c;
}
const freshProgress = () => ({ abilities: { dash: false, dj: false, wj: false, wings: false, eye: false }, bosses: [], broken: [], torches: {} });
function roomInfo(r) {
  return { code: r.code, host: r.host, started: r.started, players: Object.values(r.players).map(p => ({ id: p.id, name: p.name, animal: p.animal })) };
}
function freeColor(r) {
  const used = new Set(Object.values(r.players).map(p => p.animal));
  return COLORS.find(a => !used.has(a)) || COLORS[0];
}
function leave(socket) {
  const r = rooms.get(socket.roomCode);
  if (!r) return;
  delete r.players[socket.id];
  socket.leave(r.code);
  socket.roomCode = null;
  if (!Object.keys(r.players).length) { rooms.delete(r.code); return; }
  if (r.host === socket.id) r.host = Object.keys(r.players)[0];
  io.to(r.code).emit('room', roomInfo(r));
}
function victory(r) {
  if (r.won) return; // el Conde solo cierra el primer acto: la partida continúa
  r.won = true;
  const time = Math.round((Date.now() - r.startedAt) / 1000);
  for (const p of Object.values(r.players)) {
    const u = users[p.name]; if (!u) continue;
    u.stats.games++; u.stats.wins++; u.stats.bosses += r.progress.bosses.length;
    if (!u.stats.bestTime || time < u.stats.bestTime) u.stats.bestTime = time;
  }
  saveUsers();
  io.to(r.code).emit('victory', { time, bosses: r.progress.bosses.length, players: Object.values(r.players).map(p => p.name) });
  for (const p of Object.values(r.players)) {
    const s = io.sockets.sockets.get(p.id);
    if (s && users[p.name]) s.emit('stats', users[p.name].stats);
  }
}

// máximo de mensajes por segundo y evento (los jugadores normales están muy por debajo)
const LIMITS = { state: 40, snap: 30, hit: 40, torch: 15, broke: 20, save: 3, rest: 3, loot: 40, default: 20 };
const finite = (v, lo, hi) => Number.isFinite(+v) && +v >= lo && +v <= hi;

io.on('connection', socket => {
  socket.user = null;
  socket.roomCode = null;
  socket.rl = { t: 0, counts: {}, total: 0 };
  const ip = (socket.handshake && socket.handshake.address) || '?';
  const myRoom = () => rooms.get(socket.roomCode);
  // todos los eventos pasan por aquí: límite de frecuencia, devolución de llamada siempre válida y errores contenidos
  const on = (ev, fn, nArgs = 1) => socket.on(ev, (...args) => {
    try {
      const now = Date.now(), rl = socket.rl;
      if (now - rl.t > 1000) { rl.t = now; rl.counts = {}; rl.total = 0; }
      rl.counts[ev] = (rl.counts[ev] || 0) + 1; rl.total++;
      if (rl.total > 400) { socket.disconnect(true); return; } // inundación
      if (rl.counts[ev] > (LIMITS[ev] || LIMITS.default)) return;
      const last = args[args.length - 1];
      const cb = typeof last === 'function' ? last : () => {};
      const payload = Array.from({ length: nArgs }, (_, i) => (typeof args[i] === 'function' ? undefined : args[i]));
      const out = fn(...payload, cb);
      if (out && typeof out.catch === 'function') out.catch(err => console.error('[' + ev + '] ' + (err && err.message)));
    } catch (err) { console.error('[' + ev + '] ' + (err && err.message)); }
  });
  const attach = username => { // una sola sesión por usuario: la anterior se cierra
    const old = userSockets.get(username);
    if (old && old !== socket) { old.emit('kicked'); leave(old); old.disconnect(true); }
    userSockets.set(username, socket); socket.user = username;
  };

  on('register', async (data, cb) => {
    const { username, password } = data && typeof data === 'object' ? data : {};
    if (blocked('reg:' + ip)) return cb({ ok: false, error: 'Demasiados registros desde esta conexión. Espera un minuto.' });
    if (!validName(username)) return cb({ ok: false, error: 'Usuario: 3-16 letras, números o _' });
    if (typeof password !== 'string' || password.length < 6 || password.length > 100) return cb({ ok: false, error: 'La contraseña debe tener entre 6 y 100 caracteres' });
    if (Object.hasOwn(users, username)) return cb({ ok: false, error: 'Ese usuario ya existe' });
    if (Object.keys(users).length >= MAX_ACCOUNTS) return cb({ ok: false, error: 'El servidor no admite más cuentas' });
    fail('reg:' + ip, 10); // cada registro cuenta: frena la creación masiva de cuentas (10 por minuto)
    const salt = crypto.randomBytes(16).toString('hex'), hash = await scryptAsync(password, salt);
    if (Object.hasOwn(users, username)) return cb({ ok: false, error: 'Ese usuario ya existe' });
    users[username] = { salt, hash, created: new Date().toISOString(), stats: { games: 0, wins: 0, bosses: 0, bestTime: null } };
    saveUsers();
    attach(username);
    cb({ ok: true, username, stats: users[username].stats, saves: {} });
  });

  on('login', async (data, cb) => {
    const { username, password } = data && typeof data === 'object' ? data : {};
    const ukey = 'u:' + String(username).slice(0, 16);
    if (blocked('ip:' + ip) || blocked(ukey)) return cb({ ok: false, error: 'Demasiados intentos. Espera un minuto.' });
    const u = typeof username === 'string' && Object.hasOwn(users, username) ? users[username] : null;
    if (!u || typeof password !== 'string' || password.length > 100) { fail('ip:' + ip); fail(ukey); return cb({ ok: false, error: 'Usuario o contraseña incorrectos' }); }
    const a = Buffer.from(await scryptAsync(password, u.salt), 'hex');
    const b = Buffer.from(u.hash, 'hex');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) { fail('ip:' + ip); fail(ukey); return cb({ ok: false, error: 'Usuario o contraseña incorrectos' }); }
    attach(username);
    cb({ ok: true, username, stats: normalizeStats(u), saves: savesInfo(u) });
  }, 1);

  on('createRoom', cb => {
    if (!socket.user) return cb({ ok: false, error: 'Inicia sesión' });
    leave(socket);
    const code = newCode();
    const r = { code, host: socket.id, started: false, finished: false, players: {}, progress: freshProgress(), startedAt: 0 };
    rooms.set(code, r);
    r.players[socket.id] = { id: socket.id, name: socket.user, animal: freeColor(r) };
    socket.join(code); socket.roomCode = code;
    cb({ ok: true, room: roomInfo(r) });
  }, 0);

  on('joinRoom', (code, cb) => {
    if (!socket.user) return cb({ ok: false, error: 'Inicia sesión' });
    const r = rooms.get(String(typeof code === 'string' ? code : '').toUpperCase().slice(0, 4));
    if (!r) return cb({ ok: false, error: 'Sala no encontrada' });
    if (Object.keys(r.players).length >= MAX_PLAYERS) return cb({ ok: false, error: 'Sala llena (máx. 4)' });
    if (Object.values(r.players).some(p => p.name === socket.user)) return cb({ ok: false, error: 'Ya estás en esa sala' });
    leave(socket);
    r.players[socket.id] = { id: socket.id, name: socket.user, animal: freeColor(r) };
    socket.join(r.code); socket.roomCode = r.code;
    io.to(r.code).emit('room', roomInfo(r));
    cb({ ok: true, room: roomInfo(r) });
    if (r.started && !r.finished) {
      const sl = r.cont && users[socket.user] && users[socket.user].saves && users[socket.user].saves[r.players[socket.id].animal];
      socket.emit('started', { room: roomInfo(r), progress: r.progress, late: true, me: sl ? meFor(r, sl.me) : null });
    }
  });

  on('setAnimal', color => {
    const r = myRoom();
    if (!r || r.started || !COLORS.includes(color)) return;
    if (Object.values(r.players).some(p => p.id !== socket.id && p.animal === color)) return;
    r.players[socket.id].animal = color;
    io.to(r.code).emit('room', roomInfo(r));
  });

  on('start', opt => {
    const r = myRoom();
    if (!r || r.host !== socket.id || r.started) return;
    r.started = true; r.finished = false; r.won = false; r.startedAt = Date.now();
    const hu = users[socket.user], hc = r.players[socket.id].animal;
    const hslot = hu && hu.saves && hu.saves[hc];
    r.cont = !!(opt && opt.cont && hslot && hslot.world);
    r.progress = r.cont ? JSON.parse(JSON.stringify(hslot.world)) : freshProgress();
    r.progress.torches = r.progress.torches || {}; r.progress.broken = Array.isArray(r.progress.broken) ? r.progress.broken : [];
    r.progress.bosses = Array.isArray(r.progress.bosses) ? r.progress.bosses.filter(b => BOSS_IDS.includes(b)) : [];
    for (const p of Object.values(r.players)) {
      const s = io.sockets.sockets.get(p.id), u = users[p.name], slot = u && u.saves && u.saves[p.animal];
      if (s) s.emit('started', { room: roomInfo(r), progress: r.progress, me: r.cont && slot ? meFor(r, slot.me) : null });
    }
  });
  // Guardar la partida: solo al descansar en una hoguera
  on('save', payload => {
    const r = myRoom(); const u = users[socket.user]; const pl = r && r.players[socket.id];
    if (!r || !r.started || !u || !pl) return;
    u.saves = u.saves || {};
    const prev = u.saves[pl.animal];
    if (prev && !r.cont && !socket.savedOnce) { u.prev = u.prev || {}; u.prev[pl.animal] = prev; } // al empezar de nuevo se conserva la partida anterior como copia
    socket.savedOnce = true;
    u.saves[pl.animal] = { me: sanitizeMe(payload), world: JSON.parse(JSON.stringify(r.progress)), at: new Date().toISOString() };
    saveUsers();
    socket.emit('saved', { color: pl.animal, info: slotInfo(u.saves[pl.animal]) });
  });
  on('deleteSave', (color, cb) => {
    const u = users[socket.user];
    if (u && u.saves && COLORS.includes(color)) { delete u.saves[color]; saveUsers(); }
    cb({ ok: true });
  });
  // Al descansar en una hoguera reaparecen los monstruos (los simula el anfitrión)
  on('rest', () => { const r = myRoom(); if (r && r.started && r.host !== socket.id) io.to(r.host).emit('rest'); }, 0);

  // Posición del jugador -> resto
  on('state', s => {
    const r = myRoom();
    if (!r || !r.started || !s || typeof s !== 'object') return;
    if (!finite(s.x, -100, 40000) || !finite(s.y, -100, 40000)) return;
    socket.to(r.code).volatile.emit('state', { id: socket.id, x: +s.x, y: +s.y, f: s.f ? 1 : 0, hp: finite(s.hp, -1, 100) ? +s.hp : 0, mx: finite(s.mx, 0, 100) ? +s.mx : 5, a: s.a ? 1 : 0, d: s.d ? 1 : 0, c: s.c ? 1 : 0, dead: s.dead ? 1 : 0 });
  });
  // El anfitrión simula enemigos y envía instantáneas
  on('snap', s => {
    const r = myRoom();
    if (!r || !r.started || r.host !== socket.id || !s || typeof s !== 'object') return;
    if (!Array.isArray(s.e) || !Array.isArray(s.p) || s.e.length > 400 || s.p.length > 400) return;
    socket.to(r.code).volatile.emit('snap', s);
  });
  // Golpe de un jugador a un enemigo -> anfitrión
  on('hit', data => {
    const { id, dmg, dir, el } = data && typeof data === 'object' ? data : {};
    const r = myRoom();
    if (!r || !r.started || typeof id !== 'string' || id.length > 24) return;
    if (r.host === socket.id) return;
    io.to(r.host).emit('hit', { id, dmg: Math.min(8, Math.max(1, +dmg || 1)), dir: dir < 0 ? -1 : 1, from: socket.id, el: ELEMS.includes(el) ? el : undefined });
  });
  on('ability', a => {
    const r = myRoom();
    if (!r || !r.started || !ABILITIES.includes(a)) return;
    // la habilidad solo se puede coger si su jefe ya cayó
    if (!r.progress.bosses.includes(ABIL_BOSS[a]) || r.progress.abilities[a]) return;
    r.progress.abilities[a] = true;
    io.to(r.code).emit('progress', r.progress);
  });
  on('bossDead', id => {
    const r = myRoom();
    if (!r || !r.started || r.host !== socket.id || !BOSS_IDS.includes(id) || r.progress.bosses.includes(id) || (RIVAL[id] && r.progress.bosses.includes(RIVAL[id]))) return;
    r.progress.bosses.push(id);
    io.to(r.code).emit('progress', r.progress);
    if (id === 'conde') victory(r);
  });
  on('broke', data => {
    const { gx, gy } = data && typeof data === 'object' ? data : {};
    const r = myRoom();
    if (!r || !r.started || !Number.isInteger(gx) || !Number.isInteger(gy)) return;
    const row = world.fg[gy], v = row ? row[gx] : undefined;
    if (v === undefined || v < 0 || v % 8 !== World.K.CRACK) return; // solo se pueden romper las grietas del mapa
    const k = gx + ',' + gy;
    if (r.progress.broken.includes(k) || r.progress.broken.length > 500) return;
    r.progress.broken.push(k);
    socket.to(r.code).emit('broke', { gx, gy });
  });

  // El anfitrión reparte almas al jugador que mató al enemigo
  on('loot', data => {
    const { to, amt, item, eid, bonus, kt } = data && typeof data === 'object' ? data : {};
    const r = myRoom();
    if (!r || r.host !== socket.id || typeof to !== 'string' || !r.players[to] || !Number.isInteger(amt) || amt < 0 || amt > 2000) return;
    io.to(to).emit('loot', { amt, item: ITEM_IDS.includes(item) ? item : null, eid: typeof eid === 'string' ? eid.slice(0, 40) : null, bonus: clampInt(bonus, 0, 500), kt: typeof kt === 'string' ? kt.slice(0, 12) : null });
  });
  // Encender / apagar antorchas (estado compartido)
  on('torch', data => {
    const { id, on: onFlag } = data && typeof data === 'object' ? data : {};
    const r = myRoom();
    if (!r || !r.started || !Number.isInteger(id) || id < 0 || id > 2000) return;
    r.progress.torches[id] = !!onFlag;
    socket.to(r.code).emit('torch', { id, on: !!onFlag });
  });

  on('leaveRoom', () => leave(socket), 0);
  socket.on('disconnect', () => { try { leave(socket); if (socket.user && userSockets.get(socket.user) === socket) userSockets.delete(socket.user); } catch (err) { console.error('[disconnect] ' + err.message); } });
});

process.on('uncaughtException', err => console.error('Error no controlado: ' + (err && err.stack || err)));
process.on('unhandledRejection', err => console.error('Promesa rechazada: ' + (err && err.stack || err)));

server.listen(PORT, '0.0.0.0', () => {
  const nets = require('os').networkInterfaces();
  const ips = Object.values(nets).flat().filter(n => n.family === 'IPv4' && !n.internal).map(n => n.address);
  console.log(`Four Fangs of Dawn en http://localhost:${PORT}`);
  ips.forEach(ip => console.log(`  En la red local: http://${ip}:${PORT}`));
});
