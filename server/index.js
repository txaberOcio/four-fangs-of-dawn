const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');
const COLORS = ['red', 'blue', 'green', 'purple'];
const ABILITIES = ['dash', 'dj', 'wj'];
const BOSS_IDS = ['garg', 'bishop', 'clock', 'conde'];
const MAX_PLAYERS = 4;

// ---------- Cuentas (JSON, contraseñas con scrypt) ----------
let users = {};
try { users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { users = {}; }
function normalizeStats(u) {
  const s = u.stats || {};
  u.stats = { games: s.games || 0, wins: s.wins || 0, bosses: s.bosses || 0, bestTime: s.bestTime || null };
  return u.stats;
}
Object.values(users).forEach(normalizeStats);
// migración: la partida única antigua pasa a la ranura del vampiro carmesí
Object.values(users).forEach(u => { if (u.save && !u.saves) u.saves = { red: u.save }; delete u.save; });
const ITEM_IDS = ['pot', 'pot2', 'spd', 'str', 'lamp', 'amu', 'ward', 'rage', 'tonic', 'fruit', 'bomb'];
const clampInt = (v, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(+v) ? Math.floor(+v) : lo));
const strList = (a, max, len = 24) => (Array.isArray(a) ? a.filter(x => typeof x === 'string' && x.length <= len).slice(0, max) : []);
function sanitizeMe(m = {}) {
  const inv = {}; ITEM_IDS.forEach(k => { inv[k] = clampInt(m.inv && m.inv[k], 0, 9); });
  return { souls: clampInt(m.souls, 0, 99999), inv, wlv: clampInt(m.wlv, 1, 5), maxHp: clampInt(m.maxHp, 5, 20), cry: strList(m.cry, 20), forge: strList(m.forge, 20),
    abil: { dash: !!(m.abil && m.abil.dash), dj: !!(m.abil && m.abil.dj), wj: !!(m.abil && m.abil.wj) }, elite: strList(m.elite, 20, 40), pages: strList(m.pages, 20), seen: strList(m.seen, 20), kills: (() => { const o = {}; for (const k of ['sk', 'kn', 'bat', 'gh', 'saw', 'sentinel', 'garg', 'bishop', 'clock', 'conde']) o[k] = clampInt(m.kills && m.kills[k], 0, 99999); return o; })(),
    altar: typeof m.altar === 'string' ? m.altar.slice(0, 24) : '', lit: strList(m.lit, 20), visited: strList(m.visited, 60) };
}
const slotInfo = s => (s ? { at: s.at, bosses: (s.world && s.world.bosses ? s.world.bosses.length : 0) } : null);
const savesInfo = u => { const o = {}; for (const c of ['red', 'blue', 'green', 'purple']) if (u && u.saves && u.saves[c]) o[c] = slotInfo(u.saves[c]); return o; };
function saveUsers() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(users, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}
function hashPassword(password, salt) { return crypto.scryptSync(password, salt, 64).toString('hex'); }
function validName(n) { return typeof n === 'string' && /^[A-Za-z0-9_]{3,16}$/.test(n); }

// ---------- Servidor web ----------
const app = express();
app.use('/vendor/phaser.min.js', express.static(path.join(__dirname, '..', 'node_modules', 'phaser', 'dist', 'phaser.min.js')));
app.use('/vendor/socket.io.min.js', express.static(path.join(__dirname, '..', 'node_modules', 'socket.io', 'client-dist', 'socket.io.min.js')));
app.use(express.static(path.join(__dirname, '..', 'public'), { etag: false, maxAge: 0 }));
const server = http.createServer(app);
const io = new Server(server);

// ---------- Salas ----------
const rooms = new Map();
function newCode() {
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let c;
  do { c = Array.from({ length: 4 }, () => L[crypto.randomInt(L.length)]).join(''); } while (rooms.has(c));
  return c;
}
const freshProgress = () => ({ abilities: { dash: false, dj: false, wj: false }, bosses: [], broken: [], torches: {} });
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

io.on('connection', socket => {
  socket.user = null;
  socket.roomCode = null;
  const myRoom = () => rooms.get(socket.roomCode);

  socket.on('register', ({ username, password } = {}, cb) => {
    if (!validName(username)) return cb({ ok: false, error: 'Usuario: 3-16 letras, números o _' });
    if (typeof password !== 'string' || password.length < 6) return cb({ ok: false, error: 'La contraseña debe tener al menos 6 caracteres' });
    if (Object.hasOwn(users, username)) return cb({ ok: false, error: 'Ese usuario ya existe' });
    const salt = crypto.randomBytes(16).toString('hex');
    users[username] = { salt, hash: hashPassword(password, salt), created: new Date().toISOString(), stats: { games: 0, wins: 0, bosses: 0, bestTime: null } };
    saveUsers();
    socket.user = username;
    cb({ ok: true, username, stats: users[username].stats, saves: {} });
  });

  socket.on('login', ({ username, password } = {}, cb) => {
    const u = typeof username === 'string' && Object.hasOwn(users, username) ? users[username] : null;
    if (!u || typeof password !== 'string') return cb({ ok: false, error: 'Usuario o contraseña incorrectos' });
    const a = Buffer.from(hashPassword(password, u.salt), 'hex');
    const b = Buffer.from(u.hash, 'hex');
    if (!crypto.timingSafeEqual(a, b)) return cb({ ok: false, error: 'Usuario o contraseña incorrectos' });
    socket.user = username;
    cb({ ok: true, username, stats: normalizeStats(u), saves: savesInfo(u) });
  });

  socket.on('createRoom', cb => {
    if (!socket.user) return cb({ ok: false, error: 'Inicia sesión' });
    leave(socket);
    const code = newCode();
    const r = { code, host: socket.id, started: false, finished: false, players: {}, progress: freshProgress(), startedAt: 0 };
    rooms.set(code, r);
    r.players[socket.id] = { id: socket.id, name: socket.user, animal: freeColor(r) };
    socket.join(code); socket.roomCode = code;
    cb({ ok: true, room: roomInfo(r) });
  });

  socket.on('joinRoom', (code, cb) => {
    if (!socket.user) return cb({ ok: false, error: 'Inicia sesión' });
    const r = rooms.get(String(code || '').toUpperCase());
    if (!r) return cb({ ok: false, error: 'Sala no encontrada' });
    if (Object.keys(r.players).length >= MAX_PLAYERS) return cb({ ok: false, error: 'Sala llena (máx. 4)' });
    if (Object.values(r.players).some(p => p.name === socket.user)) return cb({ ok: false, error: 'Ya estás en esa sala' });
    leave(socket);
    r.players[socket.id] = { id: socket.id, name: socket.user, animal: freeColor(r) };
    socket.join(r.code); socket.roomCode = r.code;
    io.to(r.code).emit('room', roomInfo(r));
    cb({ ok: true, room: roomInfo(r) });
    if (r.started && !r.finished) socket.emit('started', { room: roomInfo(r), progress: r.progress, late: true, me: (() => { const sl = r.cont && users[socket.user] && users[socket.user].saves && users[socket.user].saves[r.players[socket.id].animal]; return sl ? sl.me || null : null; })() });
  });

  socket.on('setAnimal', color => {
    const r = myRoom();
    if (!r || r.started || !COLORS.includes(color)) return;
    if (Object.values(r.players).some(p => p.id !== socket.id && p.animal === color)) return;
    r.players[socket.id].animal = color;
    io.to(r.code).emit('room', roomInfo(r));
  });

  socket.on('start', opt => {
    const r = myRoom();
    if (!r || r.host !== socket.id || r.started) return;
    r.started = true; r.finished = false; r.won = false; r.startedAt = Date.now();
    const hu = users[socket.user], hc = r.players[socket.id].animal;
    const hslot = hu && hu.saves && hu.saves[hc];
    r.cont = !!(opt && opt.cont && hslot && hslot.world);
    r.progress = r.cont ? JSON.parse(JSON.stringify(hslot.world)) : freshProgress();
    r.progress.torches = r.progress.torches || {}; r.progress.broken = r.progress.broken || [];
    for (const p of Object.values(r.players)) {
      const s = io.sockets.sockets.get(p.id), u = users[p.name], slot = u && u.saves && u.saves[p.animal];
      if (s) s.emit('started', { room: roomInfo(r), progress: r.progress, me: r.cont && slot ? slot.me || null : null });
    }
  });
  // Guardar la partida: solo al descansar en una hoguera
  socket.on('save', payload => {
    const r = myRoom(); const u = users[socket.user]; const pl = r && r.players[socket.id];
    if (!r || !r.started || !u || !pl) return;
    u.saves = u.saves || {};
    u.saves[pl.animal] = { me: sanitizeMe(payload), world: JSON.parse(JSON.stringify(r.progress)), at: new Date().toISOString() };
    saveUsers();
    socket.emit('saved', { color: pl.animal, info: slotInfo(u.saves[pl.animal]) });
  });
  socket.on('deleteSave', (color, cb) => {
    const u = users[socket.user];
    if (u && u.saves && COLORS.includes(color)) { delete u.saves[color]; saveUsers(); }
    if (typeof cb === 'function') cb({ ok: true });
  });
  // Al descansar en una hoguera reaparecen los monstruos (los simula el anfitrión)
  socket.on('rest', () => { const r = myRoom(); if (r && r.started && r.host !== socket.id) io.to(r.host).emit('rest'); });

  // Posición del jugador -> resto
  socket.on('state', s => {
    const r = myRoom();
    if (!r || !r.started || !s) return;
    socket.to(r.code).volatile.emit('state', { id: socket.id, x: +s.x, y: +s.y, f: s.f ? 1 : 0, hp: +s.hp, mx: +s.mx, a: s.a ? 1 : 0, d: s.d ? 1 : 0, c: s.c ? 1 : 0, dead: s.dead ? 1 : 0 });
  });
  // El anfitrión simula enemigos y envía instantáneas
  socket.on('snap', s => {
    const r = myRoom();
    if (!r || !r.started || r.host !== socket.id) return;
    socket.to(r.code).volatile.emit('snap', s);
  });
  // Golpe de un jugador a un enemigo -> anfitrión
  socket.on('hit', ({ id, dmg, dir } = {}) => {
    const r = myRoom();
    if (!r || !r.started || typeof id !== 'string') return;
    if (r.host === socket.id) return;
    io.to(r.host).emit('hit', { id, dmg: Math.min(8, Math.max(1, +dmg || 1)), dir: dir < 0 ? -1 : 1, from: socket.id });
  });
  socket.on('ability', a => {
    const r = myRoom();
    if (!r || !r.started || !ABILITIES.includes(a)) return;
    // la habilidad solo se puede coger si su jefe ya cayó
    const need = { dash: 'garg', dj: 'bishop', wj: 'clock' }[a];
    if (!r.progress.bosses.includes(need) || r.progress.abilities[a]) return;
    r.progress.abilities[a] = true;
    io.to(r.code).emit('progress', r.progress);
  });
  socket.on('bossDead', id => {
    const r = myRoom();
    if (!r || !r.started || r.host !== socket.id || !BOSS_IDS.includes(id) || r.progress.bosses.includes(id)) return;
    r.progress.bosses.push(id);
    io.to(r.code).emit('progress', r.progress);
    if (id === 'conde') victory(r);
  });
  socket.on('broke', ({ gx, gy } = {}) => {
    const r = myRoom();
    if (!r || !r.started || !Number.isInteger(gx) || !Number.isInteger(gy)) return;
    const k = gx + ',' + gy;
    if (r.progress.broken.includes(k) || r.progress.broken.length > 500) return;
    r.progress.broken.push(k);
    socket.to(r.code).emit('broke', { gx, gy });
  });

  // El anfitrión reparte almas al jugador que mató al enemigo
  socket.on('loot', ({ to, amt, item, eid, bonus, kt } = {}) => {
    const r = myRoom();
    if (!r || r.host !== socket.id || typeof to !== 'string' || !r.players[to] || !Number.isInteger(amt) || amt < 0 || amt > 2000) return;
    io.to(to).emit('loot', { amt, item: ITEM_IDS.includes(item) ? item : null, eid: typeof eid === 'string' ? eid.slice(0, 40) : null, bonus: clampInt(bonus, 0, 500), kt: typeof kt === 'string' ? kt.slice(0, 12) : null });
  });
  // Encender / apagar antorchas (estado compartido)
  socket.on('torch', ({ id, on } = {}) => {
    const r = myRoom();
    if (!r || !r.started || !Number.isInteger(id) || id < 0 || id > 2000) return;
    r.progress.torches[id] = !!on;
    socket.to(r.code).emit('torch', { id, on: !!on });
  });

  socket.on('leaveRoom', () => leave(socket));
  socket.on('disconnect', () => leave(socket));
});

server.listen(PORT, '0.0.0.0', () => {
  const nets = require('os').networkInterfaces();
  const ips = Object.values(nets).flat().filter(n => n.family === 'IPv4' && !n.internal).map(n => n.address);
  console.log(`Castillo en http://localhost:${PORT}`);
  ips.forEach(ip => console.log(`  En la red local: http://${ip}:${PORT}`));
});
