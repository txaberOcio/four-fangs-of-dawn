/* Castillo de los Cazadores - cliente (Phaser 3 + Socket.IO) */
const socket = io();
const $ = id => document.getElementById(id);
const SW = 832, SH = 576;
// Modo ligero: menos efectos y oscuridad a media resolución. Se activa solo en televisores, o con ?lite=1, o desde la casilla del menú.
const TV_UA = /SMART-TV|SmartTV|Tizen|Web0S|webOS|NetCast|HbbTV|BRAVIA|AppleTV|Roku|Viera|Opera TV|CrKey|AFTM|AFTT/i.test(navigator.userAgent);
function liteMode() {
  const q = new URLSearchParams(location.search).get('lite');
  if (q === '1') return true; if (q === '0') return false;
  try { const v = localStorage.getItem('lite'); if (v !== null) return v === '1'; } catch (e) { /* sin almacenamiento */ }
  return TV_UA;
}
let LITE = liteMode();
const { T, COLS, ROWS, CW, CH, PHYS: P, K } = World;

// ---------- Sonido (WebAudio mínimo) ----------
let actx;
function audioCtx() {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { /* sin audio */ }
  return actx;
}
['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { audioCtx(); if (typeof Music !== 'undefined') Music.play(); }, { passive: true }));
function beep(freq, dur, type = 'square', vol = 0.035, slide = 0) {
  if (OPT.sfx <= 0 || (typeof Music !== 'undefined' && Music.isMuted && Music.isMuted())) return; // el silencio también apaga los efectos
  try {
    audioCtx();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(Math.max(0.0002, vol * OPT.sfx), t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur);
  } catch (e) { /* sin audio */ }
}
const SFX = {
  swing: () => beep(320, 0.09, 'sawtooth', 0.03, -180), hit: () => beep(140, 0.12, 'square', 0.05, -70),
  hurt: () => beep(110, 0.3, 'sawtooth', 0.06, -60), jump: () => beep(300, 0.1, 'square', 0.025, 220),
  dash: () => beep(180, 0.15, 'sawtooth', 0.03, 300), pick: () => { beep(520, 0.1, 'triangle', 0.05); setTimeout(() => beep(780, 0.15, 'triangle', 0.05), 90); },
  step: () => beep(95 + Math.random() * 25, 0.045, 'triangle', 0.012, -30), land: () => beep(85, 0.1, 'square', 0.04, -40),
  die: () => { beep(200, 0.18, 'sawtooth', 0.04, -140); setTimeout(() => beep(90, 0.2, 'square', 0.03, -50), 80); },
  warp: () => { beep(240, 0.35, 'sine', 0.05, 520); setTimeout(() => beep(900, 0.25, 'triangle', 0.035, -500), 120); },
  rest: () => { [330, 415, 495].forEach((f, i) => setTimeout(() => beep(f, 0.5, 'sine', 0.035), i * 110)); },
  elem: () => { beep(600, 0.12, 'square', 0.03, 400); setTimeout(() => beep(1000, 0.2, 'triangle', 0.035, -300), 90); },
  boss: () => beep(70, 0.5, 'sawtooth', 0.07, -20), altar: () => { beep(440, 0.12, 'sine', 0.05); setTimeout(() => beep(660, 0.2, 'sine', 0.05), 100); },
};

// ---------- UI y red ----------
let me = null, room = null, game = null, progress = null, selColor = null, saves = {}, saveMe = null;
const COLOR_LIST = ['red', 'blue', 'green', 'purple'];
function show(screen) { ['auth', 'menu', 'lobby'].forEach(s => $('s-' + s).classList.toggle('hidden', s !== screen)); $('ui').classList.remove('hidden'); }
function setStats(s) { $('stG').textContent = s.games || 0; $('stW').textContent = s.wins || 0; $('stC').textContent = s.bosses || 0; $('stT').textContent = s.bestTime ?? '-'; }
function authDone(res) {
  if (!res.ok) { $('eAuth').textContent = res.error; return; }
  me = res.username; $('who').textContent = me; setStats(res.stats); saves = res.saves || {}; show('menu');
}
$('bLogin').onclick = () => socket.emit('login', { username: $('u').value.trim(), password: $('p').value }, authDone);
$('bReg').onclick = () => socket.emit('register', { username: $('u').value.trim(), password: $('p').value }, authDone);
$('p').addEventListener('keydown', e => { if (e.key === 'Enter') $('bLogin').click(); });
$('bCreate').onclick = () => socket.emit('createRoom', r => r.ok ? enterRoom(r.room) : $('eMenu').textContent = r.error);
$('bJoin').onclick = () => socket.emit('joinRoom', $('code').value.trim().toUpperCase(), r => r.ok ? enterRoom(r.room) : $('eMenu').textContent = r.error);
$('bLeave').onclick = () => { socket.emit('leaveRoom'); room = null; show('menu'); };
$('bStart').onclick = () => socket.emit('start', { cont: !!(selColor && saves[selColor]) && $('cont').checked });
$('lite').checked = LITE;
$('lite').onchange = () => { LITE = $('lite').checked; try { localStorage.setItem('lite', LITE ? '1' : '0'); } catch (e) { /* ok */ } };
socket.on('stats', setStats);

// Partida guardada del vampiro elegido (cada vampiro tiene la suya)
function updateContRow() {
  const info = selColor && saves[selColor], isHost = room && room.host === socket.id;
  $('contRow').classList.toggle('hidden', !info);
  if (info) {
    $('contTxt').textContent = (isHost ? 'Continuar partida' : 'Partida guardada') + ' de ' + HERO_NAMES[selColor] + ' (' + new Date(info.at).toLocaleString('es-ES') + ' · ' + info.bosses + ' jefe(s))';
    $('cont').style.display = isHost ? '' : 'none';
  }
}
$('bDelSave').onclick = () => { if (selColor && confirm('¿Borrar la partida guardada de ' + HERO_NAMES[selColor] + '?')) socket.emit('deleteSave', selColor, () => { delete saves[selColor]; updateContRow(); }); };
socket.on('saved', ({ color, info }) => { saves[color] = info; });
function enterRoom(r) { room = r; if (!r.started) { renderLobby(); show('lobby'); } }
function renderLobby() {
  if (!room) return;
  $('rcode').textContent = room.code;
  const list = $('plist'); list.innerHTML = '';
  room.players.forEach(p => {
    const d = document.createElement('div'); d.className = 'pl';
    const c = document.createElement('canvas'); drawHeroCanvas(c, p.animal); d.appendChild(c);
    d.append(`${p.name}${p.id === room.host ? ' ★' : ''}${p.name === me ? ' (tú)' : ''}`);
    list.appendChild(d);
  });
  const mine = room.players.find(p => p.name === me); selColor = mine && mine.animal;
  const box = $('animals'); box.innerHTML = '';
  COLOR_LIST.forEach(a => {
    const taken = room.players.some(p => p.animal === a && p.name !== me);
    const b = document.createElement('button'); b.className = a === selColor ? 'sel' : ''; b.disabled = taken; b.title = HERO_NAMES[a];
    const c = document.createElement('canvas'); c.style.cssText = 'width:36px;height:42px;image-rendering:pixelated'; drawHeroCanvas(c, a);
    b.appendChild(c); b.onclick = () => socket.emit('setAnimal', a); box.appendChild(b);
  });
  $('abil').textContent = selColor ? HERO_NAMES[selColor] + '\n' + HERO_INFO[selColor].weapon + ' · ' + HERO_INFO[selColor].passive + '\n' + HERO_INFO[selColor].desc : '';
  $('bStart').classList.toggle('hidden', room.host !== socket.id);
  updateContRow();
}
socket.on('room', r => { room = r; if (!game) { renderLobby(); show('lobby'); } });
socket.on('started', payload => { room = payload.room; progress = payload.progress; saveMe = payload.me || null; startGame(); });

function startGame() {
  $('ui').classList.add('hidden');
  setupTouch(true);
  if (game) game.destroy(true);
  game = new Phaser.Game({
    type: Phaser.AUTO, parent: 'game', width: SW, height: SH, backgroundColor: '#0a0710',
    pixelArt: true, disableVisibilityChange: true, fps: LITE ? { target: 30, forceSetTimeOut: true } : { forceSetTimeOut: true }, render: { antialias: false, powerPreference: LITE ? 'low-power' : 'high-performance' },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: 'arcade', arcade: { gravity: { y: P.gravity }, debug: false } },
    scene: [CastleScene],
  });
}
// salir de la partida al menú (para elegir otro personaje)
function leaveToMenu() { socket.emit('leaveRoom'); room = null; if (game) { game.destroy(true); game = null; } setupTouch(false); show('menu'); }
function endGame() { if (game) { game.destroy(true); game = null; } setupTouch(false); renderLobby(); show('lobby'); }

// ---------- Configuración de entidades ----------
const EN = {
  sk: { tex: 'sk', sc: 3, body: [10, 13], hp: 2, dmg: 1, spd: 55, hb: [26, 36], kind: 'walk' },
  kn: { tex: 'kn', sc: 3, body: [12, 15], hp: 5, dmg: 2, spd: 38, hb: [34, 44], kind: 'walk' },
  bat: { tex: 'bat1', sc: 3, body: [10, 6], hp: 1, dmg: 1, spd: 90, hb: [28, 18], kind: 'bat' },
  gh: { tex: 'gh', sc: 3, body: [8, 10], hp: 3, dmg: 1, spd: 45, hb: [24, 32], kind: 'ghost' },
  garg: { tex: 'garg', sc: 4, body: [12, 14], hp: 12, dmg: 2, hb: [50, 56], kind: 'boss' },
  bishop: { tex: 'bishop', sc: 4, body: [10, 14], hp: 15, dmg: 1, hb: [40, 56], kind: 'boss', fly: true },
  clock: { tex: 'clock', sc: 4, body: [12, 15], hp: 18, dmg: 2, hb: [52, 60], kind: 'boss' },
  conde: { tex: 'conde', sc: 4, body: [10, 15], hp: 42, dmg: 2, hb: [48, 60], kind: 'boss', fly: true },
  archon: { tex: 'archon', sc: 4, body: [10, 14], hp: 26, dmg: 2, hb: [40, 56], kind: 'boss', fly: true },
  reina: { tex: 'reina', sc: 4, body: [12, 14], hp: 30, dmg: 2, hb: [50, 56], kind: 'boss' },
  aurora: { tex: 'aurora', sc: 4, body: [10, 14], hp: 24, dmg: 2, hb: [40, 56], kind: 'boss', fly: true },
  vesper: { tex: 'vesper', sc: 4, body: [10, 15], hp: 24, dmg: 2, hb: [48, 60], kind: 'boss' },
  // Calabozos Profundos
  slug: { tex: 'limo', sc: 3, body: [14, 10], hp: 3, dmg: 1, spd: 28, hb: [40, 26], kind: 'walk', slime: true },
  shroom: { tex: 'hongo', sc: 3, body: [14, 14], hp: 4, dmg: 1, spd: 0, hb: [40, 40], kind: 'turret' },
  vine: { tex: 'raiz', sc: 3, body: [12, 14], hp: 5, dmg: 1, spd: 0, hb: [40, 44], kind: 'ceil', fly: true },
  pris: { tex: 'preso', sc: 3, body: [12, 15], hp: 6, dmg: 2, spd: 42, hb: [34, 44], kind: 'walk', rez: true, throws: true },
  alcaide: { tex: 'carcelero', sc: 4, body: [12, 15], hp: 32, dmg: 2, hb: [54, 62], kind: 'boss' },
  madre: { tex: 'driade', sc: 5, body: [14, 15], hp: 44, dmg: 2, hb: [64, 74], kind: 'boss' },
  // enemigos invulnerables: solo se esquivan
  saw: { tex: 'saw', sc: 3, body: [12, 12], hp: 9999, dmg: 2, hb: [34, 34], kind: 'saw', inv: true },
  sentinel: { tex: 'sentinel', sc: 3, body: [12, 15], hp: 9999, dmg: 2, spd: 70, hb: [34, 44], kind: 'walk', inv: true, patrol: true },
};
// habilidades de los enemigos con nombre: alcance, aviso previo (tele), duración (act), espera (cd)
const ELITE_AB = {
  'Capitán de Armaduras': { kind: 'charge', range: 280, tele: 0.6, act: 0.55, cd: 3.5, spd: 340 },
  'Bibliotecario Maldito': { kind: 'orbs', range: 380, tele: 0.45, act: 0.1, cd: 3.2 },
  'Carcelero': { kind: 'quake', range: 300, tele: 0.7, act: 0.1, cd: 4.2 },
  'Espectro Penitente': { kind: 'blink', range: 420, tele: 0.5, act: 0.1, cd: 4.5 },
  'Verdugo Cubierto de Musgo': { kind: 'quake', range: 300, tele: 0.7, act: 0.1, cd: 3.8 },
  'Relojero Oxidado': { kind: 'haste', range: 260, tele: 0.5, act: 2.6, cd: 5, trail: true } // deja un rastro de veneno de 3 s y, un ciclo sí y otro no, lanza una nube que dura 5 s
};
const POISON = ['toxin', 'cloud', 'spore']; // veneno y esporas (Alcaide, Madre Moho, hongos): inflamables
const PR = {
  orb: { tex: 'orb', sc: 2, hb: [14, 14], dmg: 1 },
  shock: { tex: 'shock', sc: 2, hb: [30, 14], dmg: 1 },
  gear: { tex: 'gear', sc: 2.5, hb: [26, 26], dmg: 1 },
  mark: { tex: 'ring', sc: 3, hb: [0, 0], dmg: 0 },
  pillar: { tex: 'pillar', sc: 3, hb: [28, 150], dmg: 2 },
  toxin: { tex: 'puff', sc: 3, hb: [30, 14], dmg: 0.5, tint: 0x66ff44, alpha: 0.7, linger: true }, // charco de veneno (Relojero Oxidado)
  slime: { tex: 'puff', sc: 3, hb: [30, 10], dmg: 0, slow: true, tint: 0x9a8a3a, alpha: 0.6, linger: true }, // baba: ralentiza
  spore: { tex: 'puff', sc: 4, hb: [34, 34], dmg: 0.5, tint: 0xc08aff, alpha: 0.6, linger: true }, // espora que persigue despacio
  lash: { tex: 'shock', sc: 5, hb: [150, 16], dmg: 2, tint: 0x6fbf4a }, // latigazo
  vine: { tex: 'pillar', sc: 3, hb: [22, 170], dmg: 2, tint: 0x3f8f3a }, // liana que cae
  rootwave: { tex: 'shock', sc: 2, hb: [34, 26], dmg: 2, tint: 0x3f8f3a }, // ola de raíces por el suelo
  inferno: { tex: 'puff', sc: 8, hb: [130, 130], dmg: 0.5, tint: 0xff7a2a, alpha: 0.6, linger: true }, // veneno inflamable que arde: explosión de fuego
  shroomb: { tex: 'hongo', sc: 1.3, hb: [18, 18], dmg: 1 }, // seta lanzada por el prisionero: cae en parábola y estalla
  boom: { tex: 'puff', sc: 5, hb: [74, 74], dmg: 0.25, tint: 0xb48aff, alpha: 0.55, linger: true }, // explosión de esporas de la seta
  cloud: { tex: 'puff', sc: 7, hb: [48, 48], dmg: 0.5, tint: 0x66ff44, alpha: 0.5, linger: true }, // nube de veneno: se queda en el aire
};
const ZONE_SCALE = [1, 1.25, 1.5, 1.35, 1.7, 2, 1, 2.4, 2.8, 3]; // vida de los enemigos corrientes según la zona
const rectsOverlap = (ax, ay, aw, ah, bx, by, bw, bh) => Math.abs(ax - bx) * 2 < aw + bw && Math.abs(ay - by) * 2 < ah + bh;
const cellKey = (x, y) => Math.floor(x / (CW * T)) + ',' + Math.floor(y / (CH * T));

class CastleScene extends Phaser.Scene {
  // ===================================================== creación
  create() {
    const w = this.W = World.build();
    buildArt(this);
    this.progress = progress || { abilities: {}, bosses: [], broken: [] };
    this.abil = { dash: false, dj: false, wj: false }; // las habilidades son de cada vampiro
    (this.progress.broken || []).forEach(k => { const [gx, gy] = String(k).split(',').map(Number); if (w.fg[gy] && w.fg[gy][gx] !== undefined) w.fg[gy][gx] = -1; });

    // mapa de tiles (fondo + primer plano)
    const bgMap = this.make.tilemap({ data: w.bg.map(r => r.slice()), tileWidth: T, tileHeight: T });
    this.bgLayer = bgMap.createLayer(0, bgMap.addTilesetImage('tiles', 'tiles', T, T, 0, 0), 0, 0).setDepth(-10);
    this.map = this.make.tilemap({ data: w.fg.map(r => r.slice()), tileWidth: T, tileHeight: T });
    this.fg = this.map.createLayer(0, this.map.addTilesetImage('tiles', 'tiles', T, T, 0, 0), 0, 0).setDepth(-5);
    const solids = []; for (let z = 0; z < 10; z++) solids.push(z * 8 + K.SOLID, z * 8 + K.FLOOR, z * 8 + K.CRACK);
    this.fg.setCollision(solids);
    this.fg.forEachTile(t => { if (t.index >= 0 && t.index % 8 === K.ONEWAY) t.setCollision(false, false, true, false); });
    this.map.calculateFacesWithin(0, 0, w.Wt, w.Ht);
    this.physics.world.setBounds(0, 0, w.Wt * T, w.Ht * T);
    this.cameras.main.setBounds(0, 0, w.Wt * T, (w.Ht - 2) * T + 8);

    // antorchas: se pueden encender y apagar (tecla E); el estado es compartido
    this.torchOn = Object.assign({}, this.progress.torches || {});
    this.torchObjs = w.torches.map(t => {
      const lit = this.torchOn[t.id] !== undefined ? !!this.torchOn[t.id] : t.lit;
      return { ...t, lit,
        sconce: this.add.image(t.x, t.y + 8, 'sconce').setScale(3).setDepth(-3),
        flame: this.add.image(t.x, t.y, 'flame1').setScale(3).setDepth(-3).setVisible(lit),
        glow: this.add.image(t.x, t.y, 'glow').setScale(1.3).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.4).setDepth(-4).setVisible(lit && !LITE) };
    });
    this.time.addEvent({ delay: 160, loop: true, callback: () => { this.fl = !this.fl; this.torchObjs.forEach(o => { if (o.lit) o.flame.setTexture(this.fl ? 'flame2' : 'flame1'); }); this.altars.forEach(a => a.spr.setTexture(a.lit ? (this.fl ? 'bonfire2' : 'bonfire1') : 'bonfire_off')); } });

    // altares, cristales, reliquias
    this.altars = w.altars.map(a => ({ ...a, lit: a.area === 'vest', spr: this.add.image(a.x, a.y - (a.big && !a.mini ? 36 : 18), 'bonfire_off').setScale(a.big && !a.mini ? 6 : 3).setDepth(-2) }));
    this.bonfireLit = new Set(this.altars.filter(a => a.lit).map(a => a.id));
    this.cryGot = new Set();
    this.crystals = w.crystals.map(c => ({ ...c, spr: this.add.image(c.x, c.y, 'crystal').setScale(2.6).setDepth(2) }));
    this.crystals.forEach(c => this.tweens.add({ targets: c.spr, y: c.y - 6, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.inOut' }));
    this.relics = {};

    // jugador
    const mine = room.players.find(p => p.id === socket.id);
    this.color = mine ? mine.animal : 'red';
    const sp = w.spawnPoint;
    this.lastAltar = { x: sp.x + (room.players.indexOf(mine) - 1) * 24, y: sp.y };
    this.player = this.physics.add.sprite(this.lastAltar.x, this.lastAltar.y - 21, 'hero_' + this.color).setScale(3).setDepth(8);
    this.player.setSize(10, 13);
    this.player.body.setMaxVelocityY(P.maxFall);
    this.dropT = 0;
    this.physics.add.collider(this.player, this.fg, null, (pl, tile) => !(this.dropT > 0 && tile.index >= 0 && tile.index % 8 === K.ONEWAY), this);
    this.tag = this.add.text(0, 0, me, { fontSize: '12px', fontFamily: 'Courier New', color: '#fff', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5).setDepth(9);
    this.maxHp = 5; this.hp = 5; this.invuln = 0; this.dead = false; this.deadT = 0; this.stun = 0;
    this.coyote = 0; this.jumpBuf = 0; this.jumpsUsed = 0; this.dashT = 0; this.dashCd = 0; this.dashDir = 1; this.dashAvail = true; this.wjLock = 0;
    this.facing = 1; this.atkT = 0; this.atkCd = 0; this.swingHit = new Set(); this.lastGround = { x: this.player.x, y: this.player.y };
    this.curAltar = null;

    this.keys = this.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,W,A,D,S,E,SPACE,X,J,C,K,SHIFT,M,Z,ENTER,ESC,Q,R,TAB,N,B');
    this.input.keyboard.addCapture('UP,DOWN,LEFT,RIGHT,SPACE,TAB');
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.cameras.main.roundPixels = true;

    // entidades (enemigos/jefes/proyectiles) y jugadores remotos
    this.ents = new Map(); this.projs = new Map(); this.remotes = {}; this.killed = new Set(); this.cellIdle = {};
    this.enemyGroup = this.physics.add.group(); this.physics.add.collider(this.enemyGroup, this.fg);
    this.nid = 1; this.simT = 0; this.activeT = 0; this.snapT = 0; this.curSeal = null; this.sealKey = null; this.floorState = 0; this.floorBroken = false;
    this.isHost = room.host === socket.id;
    this.visited = new Set(); this.myArea = null; this.mmT = 0; this.showMap = false; this.hurtProjs = new Set();
    this.mapCanvas = this.textures.createCanvas('mapcv', w.Wt, w.Ht); this.mapCtx = this.mapCanvas.getContext('2d');

    this.initLight();
    this.buildHud();
    this.bindNet();
    this.applyProgress(this.progress, true);
    this.initExtras();
    this.toast(IS_TOUCH ? 'Botones táctiles: mover, saltar, atacar, impulso, objeto, E' : 'Flechas/AD mover · ↑/W/Espacio saltar · ↓+saltar bajar · X/J atacar · M mapa', 6000);
    this.time.delayedCall(15000, () => this.toast('Pulsa H en cualquier momento para ver los controles', 5000));
    this.time.delayedCall(6500, () => this.toast('{act}: encender/apagar antorchas. Los fantasmas no te ven en la luz; los murciélagos le temen.', 7000));
  }

  // ===================================================== HUD
  buildHud() {
    const f = (s, c = '#fff') => ({ fontSize: fsz(s), fontFamily: 'Courier New', color: c, stroke: '#000', strokeThickness: 4 });
    this.hearts = [];
    this.abilTxt = this.add.text(10, 34, '', f('12px', '#9fd4ff')).setScrollFactor(0).setDepth(30);
    this.bannerTxt = this.add.text(SW / 2, 70, '', f('22px', '#ffd98a')).setOrigin(0.5).setScrollFactor(0).setDepth(30).setAlpha(0);
    this.toastTxt = this.add.text(SW / 2, SH - 40, '', f('16px')).setOrigin(0.5).setScrollFactor(0).setDepth(30).setAlpha(0);
    this.bossBar = this.add.graphics().setScrollFactor(0).setDepth(30);
    this.bossName = this.add.text(SW / 2, SH - 70, '', f('14px', '#ff9a9a')).setOrigin(0.5).setScrollFactor(0).setDepth(30);
    // minimapa con la forma real del castillo (lienzo 1 píxel = 1 tile)
    this.mmBg = this.add.rectangle(SW - 220, 6, 214, 106, 0x000000, 0.55).setOrigin(0).setScrollFactor(0).setDepth(29);
    this.mmImg = this.add.image(0, 0, 'mapcv').setOrigin(0).setScale(3).setScrollFactor(0).setDepth(30);
    this.mmDots = this.add.graphics().setScrollFactor(0).setDepth(31);
    this.bigBg = this.add.rectangle(0, 0, SW, SH, 0x000000, 0.86).setOrigin(0).setScrollFactor(0).setDepth(39).setVisible(false);
    this.bigS = Math.min(3, Math.floor((SW - 52) / this.W.Wt * 10) / 10);
    this.bigImg = this.add.image(26, 90, 'mapcv').setOrigin(0).setScale(this.bigS).setScrollFactor(0).setDepth(40).setVisible(false);
    this.bigDots = this.add.graphics().setScrollFactor(0).setDepth(41);
    this.bigTitle = this.add.text(SW / 2, 40, 'MAPA DEL CASTILLO  (M para cerrar)', f('18px', '#ffd98a')).setOrigin(0.5).setScrollFactor(0).setDepth(41).setVisible(false);
    this.objTxt = this.add.text(SW / 2, 18, '', f('13px', '#9fffb0')).setOrigin(0.5).setScrollFactor(0).setDepth(30);
    this.promptTxt = this.add.text(0, 0, '', f('12px', '#ffe9a0')).setOrigin(0.5).setDepth(27).setVisible(false);
    this.eyeG = this.add.graphics().setDepth(26);
    this.centerTxt = this.add.text(SW / 2, SH / 2 - 40, '', f('28px', '#ffd98a')).setOrigin(0.5).setScrollFactor(0).setDepth(50).setAlign('center');
  }
  drawHearts() {
    while (this.hearts.length < this.maxHp) {
      const x = 16 + this.hearts.length * 20;
      this.hearts.push({ back: this.add.image(x, 18, 'heart').setScale(2.4).setTint(0x2a2030).setScrollFactor(0).setDepth(30), front: this.add.image(x, 18, 'heart').setScale(2.4).setScrollFactor(0).setDepth(31).setOrigin(0.5) });
    }
    this.hearts.forEach((h, i) => {
      const fill = Phaser.Math.Clamp(this.hp - i, 0, 1);
      h.front.setVisible(fill > 0); h.front.setCrop(0, 0, 7 * fill, 6);
    });
  }
  toast(t, ms = 2500) {
    this.toastTxt.setText(t).setAlpha(1);
    this.tweens.killTweensOf(this.toastTxt);
    this.tweens.add({ targets: this.toastTxt, alpha: 0, delay: ms, duration: 600 });
  }
  banner(t) {
    this.bannerTxt.setText(t).setAlpha(1); this.tweens.killTweensOf(this.bannerTxt);
    this.tweens.add({ targets: this.bannerTxt, alpha: 0, delay: 1800, duration: 700 });
  }
  poof(x, y, n = 6, tint = 0xffffff) {
    if (LITE) n = Math.max(1, Math.ceil(n / 3));
    for (let i = 0; i < n; i++) {
      const s = this.add.image(x, y, 'puff').setScale(2).setTint(tint).setDepth(20);
      this.tweens.add({ targets: s, x: x + Phaser.Math.Between(-30, 30), y: y + Phaser.Math.Between(-30, 20), alpha: 0, scale: 0.5, duration: 400, onComplete: () => s.destroy() });
    }
  }

  // Pinta un área en el lienzo del minimapa (solo se ve lo explorado)
  markVisited(a) {
    if (this.visited.has(a.id)) return;
    this.visited.add(a.id);
    this.paintMapArea(a); this.mapCanvas.refresh();
  }
  // los muros agrietados y las salas secretas cerradas se dibujan como pared normal
  paintMapArea(a) {
    const g = this.mapCtx, light = ZONE_PAL[a.z].light, D = this.fg.layer.data;
    for (let y = 0; y < a.rh; y++) for (let x = 0; x < a.rw; x++) {
      const gx = a.x0 + x, gy = a.y0 + y, v = D[gy][gx] ? D[gy][gx].index : -1, k = v < 0 ? -1 : v % 8;
      const hid = k === -1 && this.hiddenAt((gx + 0.5) * T, (gy + 0.5) * T);
      g.fillStyle = hid ? light : k === -1 ? '#1b1530' : k === K.ONEWAY ? '#ffffff' : k === K.SPIKES ? '#ff4a4a' : light;
      g.fillRect(gx, gy, 1, 1);
    }
  }
  updateMaps() {
    const p = this.player, tx = p.x / T, ty = p.y / T;
    if (this.showMap) {
      const g = this.bigDots; g.clear();
      const W = this.W, mx = x => 26 + x * this.bigS, my = y => 90 + y * this.bigS;
      W.altars.forEach(a => { if (this.visited.has(a.area)) g.fillStyle(0xffd23b, 1).fillRect(mx(a.x / T) - 2, my(a.y / T) - 3, 4, 4); });
      if (this.objective && ((this.time.now >> 8) & 1)) g.fillStyle(0x6bff8a, 1).fillRect(mx(this.objective.x / T) - 4, my(this.objective.y / T) - 4, 8, 8);
      W.bosses.forEach(b => { if (this.visited.has(b.area) && !this.bossGone(b)) g.fillStyle(0xff3b3b, 1).fillRect(mx(b.x / T) - 3, my(b.y / T) - 6, 6, 6); });
      W.crystals.forEach(c => { if (this.visited.has(c.area) && !this.cryGot.has(c.id) && !this.hiddenAt(c.x, c.y)) g.fillStyle(0xff7aa0, 1).fillRect(mx(c.x / T) - 1, my(c.y / T) - 1, 3, 3); });
      Object.values(this.remotes).forEach(r => g.fillStyle(parseInt(HERO_COLORS[r.color].slice(1), 16), 1).fillRect(mx(r.spr.x / T) - 2, my(r.spr.y / T) - 2, 5, 5));
      if ((this.time.now >> 8) & 1) g.fillStyle(0xffffff, 1).fillRect(mx(tx) - 2, my(ty) - 2, 5, 5);
      return;
    }
    // ventana de 100x50 tiles alrededor del jugador
    const cx0 = Phaser.Math.Clamp(Math.floor(tx - 35), 0, this.W.Wt - 70), cy0 = Phaser.Math.Clamp(Math.floor(ty - 17), 0, this.W.Ht - 34);
    this.mmImg.setCrop(cx0, cy0, 70, 34).setPosition(SW - 216 - cx0 * 3, 8 - cy0 * 3);
    const g = this.mmDots; g.clear();
    const mx = x => SW - 216 + (x - cx0) * 3, my = y => 8 + (y - cy0) * 3;
    const inWin = (x, y) => x >= cx0 && x < cx0 + 70 && y >= cy0 && y < cy0 + 34;
    this.W.altars.forEach(a => { if (this.visited.has(a.area) && inWin(a.x / T, a.y / T)) g.fillStyle(0xffd23b, 1).fillRect(mx(a.x / T) - 1, my(a.y / T) - 2, 3, 3); });
    if (this.objective && inWin(this.objective.x / T, this.objective.y / T) && ((this.time.now >> 8) & 1)) g.fillStyle(0x6bff8a, 1).fillRect(mx(this.objective.x / T) - 2, my(this.objective.y / T) - 2, 5, 5);
    this.W.bosses.forEach(b => { if (this.visited.has(b.area) && !this.bossGone(b) && inWin(b.x / T, b.y / T)) g.fillStyle(0xff3b3b, 1).fillRect(mx(b.x / T) - 2, my(b.y / T) - 3, 4, 4); });
    Object.values(this.remotes).forEach(r => { const x = r.spr.x / T, y = r.spr.y / T; if (inWin(x, y)) g.fillStyle(parseInt(HERO_COLORS[r.color].slice(1), 16), 1).fillRect(mx(x) - 1, my(y) - 1, 3, 3); });
    if ((this.time.now >> 8) & 1) g.fillStyle(0xffffff, 1).fillRect(mx(tx) - 1, my(ty) - 1, 3, 3);
  }

  // ===================================================== red
  bindNet() {
    this.h = {};
    const on = (ev, fn) => { this.h[ev] = fn; socket.on(ev, fn); };
    on('state', s => {
      let r = this.remotes[s.id];
      if (!r) {
        const pl = room.players.find(p => p.id === s.id); if (!pl) return;
        r = this.remotes[s.id] = { color: pl.animal, name: pl.name, spr: this.add.sprite(s.x, s.y, 'hero_' + pl.animal).setScale(3).setDepth(7),
          tag: this.add.text(0, 0, pl.name, { fontSize: '12px', fontFamily: 'Courier New', color: '#bde', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5).setDepth(9), tx: s.x, ty: s.y };
      }
      r.moving = Math.abs(s.x - r.tx) > 0.5; r.moveT = r.moving ? 0.2 : (r.moveT || 0);
      r.tx = s.x; r.ty = s.y; r.spr.setFlipX(!!s.f); r.dead = !!s.dead; r.hp = s.hp; r.crouch = !!s.c;
      r.spr.setAlpha(s.dead ? 0.2 : (s.d ? 0.5 : 1)); 
      if (s.a && !r.a) this.slashFx(r.spr.x, r.spr.y, s.f ? -1 : 1, r.color);
      r.a = !!s.a;
      { const ar = this.W.areaOf(Math.floor(s.x / T), Math.floor(s.y / T)); if (ar) this.markVisited(ar); }
    });
    on('snap', s => this.onSnap(s));
    on('torch', ({ id, on: v }) => this.setTorch(id, v));
    on('ignite', ({ id }) => { if (!this.isHost) return; const p = this.projs.get(id); if (p && POISON.includes(p.type)) this.igniteProj(p); });
    on('hit', h => { if (!this.isHost) return; const e = this.ents.get(h.id); if (e && e.sim) this.damageEnt(e, h.dmg, h.dir, h.from, h.el); });
    on('progress', p => this.applyProgress(p, false));
    on('broke', ({ gx, gy }) => { this.fg.removeTileAt(gx, gy); this.wallBroken(gx, gy); this.poof((gx + 0.5) * T, (gy + 0.5) * T, 4, 0xaaaaaa); });
    on('victory', v => { // el Conde cae, pero el castillo continúa: se despide y desaparece
      this.centerTxt.setText('¡EL CONDE HA CAÍDO!\n\n«Necios... esto no ha terminado.\nMis señores, Aurora y Vesper,\nme esperan más arriba, en las torres del alba.\nSeguidme... si os atrevéis.»\n\nTiempo: ' + Math.floor(v.time / 60) + 'm ' + (v.time % 60) + 's');
      SFX.pick(); this.won = true; this.cameras.main.shake(500, 0.008);
      this.time.delayedCall(8000, () => { this.centerTxt.setText(''); });
    });
    on('room', r => {
      room = r;
      Object.keys(this.remotes).forEach(id => { if (!r.players.some(p => p.id === id)) { this.remotes[id].spr.destroy(); this.remotes[id].tag.destroy(); delete this.remotes[id]; } });
      if (!r.started) { endGame(); return; }
      const nowHost = r.host === socket.id;
      if (nowHost && !this.isHost) { // migración de anfitrión: la simulación empieza de cero
        this.isHost = true;
        this.ents.forEach(e => e.spr.destroy()); this.ents.clear(); this.projs.forEach(p => p.spr.destroy()); this.projs.clear(); this.killed.clear();
        this.sealKey = null; this.applySeal(null); // sin jefe activo no debe quedar ninguna puerta sellada
        this.toast('Eres el anfitrión: los enemigos se reinician');
      }
    });
    const unlisten = () => Object.entries(this.h).forEach(([ev, fn]) => socket.off(ev, fn));
    this.events.once('shutdown', unlisten); this.events.once('destroy', unlisten);
  }

  applyProgress(p, silent) {
    this.progress = p;
    if (false) for (const a in p.abilities) if (p.abilities[a]) { this.toast('¡' + World.ABILITIES[a] + '! ' + ({ dash: 'Usa {dash} para el impulso (también en el aire).', dj: 'Pulsa saltar otra vez en el aire.', wj: 'Salta pegado a una pared para impulsarte.' })[a], 6000); SFX.pick(); }
    this.syncRelics(); this.openGates(!silent);
    this.scenes = this.scenes || new Set();
    (p.bosses || []).forEach(id => { if (World.BOSSES[id] && World.BOSSES[id].rival && !this.scenes.has(id)) { this.scenes.add(id); if (!silent) this.albaScene(id); } });
    this.abilTxt.setText(['dash', 'dj', 'wj'].concat(['wings', 'eye', 'pound'].filter(a => this.abil[a])).map(a => (this.abil[a] ? '■ ' : '□ ') + World.ABILITIES[a]).join('   '));
  }
  bossGone(b) { const r = World.BOSSES[b.id] && World.BOSSES[b.id].rival; return this.progress.bosses.includes(b.id) || !!(r && this.progress.bosses.includes(r)); }
  gateOk(gt) { const pb = this.progress.bosses; return gt.boss === 'alba' ? (pb.includes('aurora') || pb.includes('vesper')) : gt.boss === 'sellos' ? (pb.includes('conde') || (pb.includes('archon') && pb.includes('reina'))) : pb.includes(gt.boss); }
  openGates(show) { // los muros que cierran el foso caen cuando el Conde huye
    if (this.payBossGems) this.payBossGems(!show);
    (this.W.gates || []).forEach(gt => {
      const ok = this.gateOk(gt);
      if (gt.open || !ok) return;
      gt.open = true; gt.tiles.forEach(t => { this.fg.removeTileAt(t.gx, t.gy); if (show) this.poof((t.gx + 0.5) * T, (t.gy + 0.5) * T, 3, 0xaaaaaa); });
      this.wallBroken();
      if (show) { this.cameras.main.shake(900, 0.012); SFX.boss(); this.toast(gt.boss === 'alba' ? '¡Se abre el camino hacia el cielo! La puerta este de la cámara de Vesper ya está libre.' : (gt.boss === 'sellos' ? '¡Los dos sellos están rotos! La puerta de la Sala del Trono se abre.' : '¡Los muros del foso se derrumban! Se abren dos caminos...'), 7000); }
    });
  }
  albaScene(killed) { // al caer uno de los rivales, el otro acude, se lo lleva y huye
    const B = World.BOSSES, other = B[killed].rival, kb = this.W.bosses.find(b => b.id === killed), ob = this.W.bosses.find(b => b.id === other);
    const re = this.ents.get(other); if (re) { re.spr.destroy(); this.ents.delete(other); }
    this.centerTxt.setText(B[killed].name + ' ha caído...\n\n¡' + B[other].name + ' acude,\n' + (killed === 'aurora' ? 'la recoge y huye con ella!' : 'lo recoge y huye con él!') + '\nYa no podrás enfrentarte a ' + B[other].name.split(',')[0] + '.');
    if (kb && ob) {
      const x = kb.x, y = kb.y - 40;
      const spr = this.add.image(x + 340, y - 260, EN[other].tex).setScale(4).setDepth(30).setAlpha(0);
      const body = this.add.image(x, y, EN[killed].tex).setScale(4).setDepth(29).setTint(0x888888).setAlpha(0.8);
      this.tweens.add({ targets: spr, x, y: y - 10, alpha: 1, duration: 900, ease: 'Sine.out', onComplete: () => {
        this.poof(x, y, 10, 0xffe0a0);
        this.tweens.add({ targets: [spr, body], y: y - 700, x: x + 200, alpha: 0, duration: 1600, delay: 500, ease: 'Sine.in', onComplete: () => { spr.destroy(); body.destroy(); } });
      } });
    }
    this.time.delayedCall(8000, () => { if (this.centerTxt.text.indexOf('ha caído') >= 0) this.centerTxt.setText(''); });
  }
  grantAbility(a) {
    this.abil[a] = true; SFX.pick();
    this.toast('¡' + World.ABILITIES[a] + '! ' + ({ dash: 'Usa {dash} para el impulso (también en el aire).', dj: 'Pulsa saltar otra vez en el aire.', wj: 'Salta pegado a una pared para impulsarte.', wings: 'Mantén saltar en el aire para planear.', eye: 'Ves los secretos tras los muros agrietados y tu luz crece.', pound: 'En el aire, mantén abajo para caer en picado: rompe los suelos de raíces y aturde a los enemigos.' })[a], 6000);
    this.wallBroken();
    this.syncRelics(); this.applyProgress(this.progress, true); this.autoSave();
  }
  syncRelics() {
    this.W.bosses.forEach(b => {
      if (!b.drop) return;
      const should = this.progress.bosses.includes(b.id) && !this.abil[b.drop];
      if (should && !this.relics[b.id]) {
        const ar = this.W.areas[b.area];
        const x = b.x, y = (ar.y0 + ar.rh - 1) * T - 24;
        const spr = this.add.image(x, y, 'relic').setScale(3).setDepth(3);
        const glow = this.add.image(x, y, 'glow').setScale(2).setBlendMode(Phaser.BlendModes.ADD).setDepth(2).setVisible(!LITE);
        this.tweens.add({ targets: [spr, glow], y: y - 8, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.inOut' });
        this.relics[b.id] = { spr, glow, ability: b.drop, x, y };
        this.toast('Una reliquia ha aparecido en ' + this.W.areas[b.area].name);
      } else if (!should && this.relics[b.id]) { this.relics[b.id].spr.destroy(); this.relics[b.id].glow.destroy(); delete this.relics[b.id]; }
    });
  }

  // ===================================================== luz y oscuridad
  initLight() {
    const q = this.darkQ = LITE ? 2 : 1; // en modo ligero la oscuridad se dibuja a la mitad de resolución
    this.dark = this.add.renderTexture(0, 0, Math.ceil(SW / q), Math.ceil(SH / q)).setOrigin(0).setScale(q).setScrollFactor(0).setDepth(25);
    this.lightImg = this.add.image(0, 0, 'light').setVisible(false);
    this.litList = []; this.rebuildLights(); this.objT = 0;
  }
  rebuildLights() {
    this.litList = this.torchObjs.filter(o => o.lit).map(o => ({ x: o.x, y: o.y, r: o.r || 215 }));
    this.altars.filter(a => a.lit).forEach(a => this.litList.push({ x: a.x, y: a.y - 40, r: a.big && !a.mini ? 330 : 160 }));
  }
  lightLevel(x, y) {
    let best = 0;
    for (const L of this.litList) {
      const dx = x - L.x, dy = y - L.y; if (dx > L.r || dx < -L.r || dy > L.r || dy < -L.r) continue;
      const d = Math.hypot(dx, dy); if (d < L.r) best = Math.max(best, 1 - d / L.r);
    }
    return best;
  }
  inLight(x, y) { return this.lightLevel(x, y) > 0.22; }
  nearestLight(x, y) {
    let best = null, bd = 1e9;
    for (const L of this.litList) { const d = Math.hypot(x - L.x, y - L.y); if (d < L.r && d < bd) { bd = d; best = L; } }
    return best;
  }
  nearestDark(x, y, maxD) {
    let best = null, bd = maxD;
    for (const t of this.targets()) { if (this.inLight(t.x, t.y)) continue; const d = Math.hypot(t.x - x, t.y - y); if (d < bd) { bd = d; best = t; } }
    return best;
  }
  setTorch(id, on) {
    const o = this.torchObjs[id]; if (!o || o.lit === !!on) return;
    o.lit = !!on; o.flame.setVisible(o.lit); o.glow.setVisible(o.lit && !LITE); this.torchOn[id] = o.lit; this.rebuildLights();
    this.poof(o.x, o.y, 4, o.lit ? 0xffb347 : 0x666666);
  }
  interactTorch(pressedE) {
    const p = this.player; let best = null, bd = 1e9;
    if (!this.dead) for (const o of this.torchObjs) { const dx = Math.abs(o.x - p.x), dy = Math.abs(o.y - p.y); if (dx < 70 && dy < 135) { const d = dx + dy; if (d < bd) { bd = d; best = o; } } }
    if (best) { this.promptTxt.setVisible(true).setPosition(best.x, best.y - 26).setText(best.lit ? '{act}: apagar' : '{act}: encender'); } else this.promptTxt.setVisible(false);
    if (best && pressedE) { const on = !best.lit; this.setTorch(best.id, on); socket.emit('torch', { id: best.id, on }); SFX.altar(); }
  }
  drawDark(time) {
    const p = this.player, w = this.W;
    const sx0 = Phaser.Math.Clamp(p.x - SW / 2, 0, w.Wt * T - SW), sy0 = Phaser.Math.Clamp(p.y - SH / 2, 0, (w.Ht - 2) * T + 8 - SH);
    const rt = this.dark, img = this.lightImg, q = this.darkQ;
    rt.clear(); rt.fill(0x04020a, 0.9);
    const lamp = (x, y, r, a = 1) => { const X = x - sx0, Y = y - sy0; if (X < -r || X > SW + r || Y < -r || Y > SH + r) return; img.setScale(r / 64 / q).setAlpha(a); rt.erase(img, X / q, Y / q); };
    this.torchObjs.forEach(o => { if (o.lit && !this.hiddenAt(o.x, o.y)) lamp(o.x, o.y, (o.r || 215) * (1 + 0.03 * Math.sin(time * 0.009 + o.id)), 1); });
    this.altars.forEach(a => { if (a.lit) lamp(a.x, a.y - 40, a.big && !a.mini ? 330 : 160, 0.9); });
    lamp(p.x, p.y, 120 * this.auraMul(), 0.95);
    this.npcObjs.forEach(n => { if (!n.off) lamp(n.x, n.y - 20, n.def.shop ? 110 : 80, 0.85); });
    this.forgeObjs.forEach(f => { if (!this.forgeGot.has(f.id) && !this.hiddenAt(f.x, f.y)) lamp(f.x, f.y, 70, 0.8); });
    (this.sforgeObjs || []).forEach(f => lamp(f.x, f.y, 120, 0.9));
    if (this.timedStep) this.timedStep(time);
    (this.caveLamps || []).forEach(L => lamp(L.x, L.y, L.r, 0.85)); this.caveEmbers(time); this.mossSpores(time); this.liftStep(0.016);
    (this.gemObjs || []).forEach(o => { if (!this.gemGot.has(o.id) && !this.hiddenAt(o.x, o.y)) lamp(o.x, o.y, 45, 0.8); });
    Object.values(this.remotes).forEach(r => lamp(r.spr.x, r.spr.y, 90, 0.8));
    this.crystals.forEach(c => { if (!this.cryGot.has(c.id) && !this.hiddenAt(c.x, c.y)) lamp(c.x, c.y, 60, 0.8); });
    Object.values(this.relics).forEach(r => lamp(r.x, r.y, 110, 1));
    this.ents.forEach(e => { if (e.boss && e.aggro) lamp(e.spr.x, e.spr.y, 150, 0.85); });
    this.projs.forEach(pr => lamp(pr.spr.x, pr.spr.y, 55, 0.9));
    this.drawBond(time);
    // ojos rojos de los enemigos que están en la oscuridad
    const g = this.eyeG; g.clear(); g.fillStyle(0xff2a2a, 0.9);
    this.ents.forEach(e => {
      if (e.boss && e.aggro) return;
      const x = e.spr.x, y = e.spr.y; if (x < sx0 - 40 || x > sx0 + SW + 40 || y < sy0 - 40 || y > sy0 + SH + 40) return;
      if (this.lightLevel(x, y) > 0.22) return;
      const fx = e.spr.flipX ? -1 : 1; g.fillRect(x - 7 + fx, y - 9, 4, 4); g.fillRect(x + 3 + fx, y - 9, 4, 4);
    });
  }
  // objetivo actual: flecha y distancia
  updateObjective(dt) {
    this.objT -= dt; if (this.objT > 0) return; this.objT = 0.3; this.hiddenSweep();
    const order = ['garg', 'bishop', 'clock', 'archon', 'reina', 'conde'], w = this.W;
    let tgt = null, label = '';
    const relic = Object.values(this.relics)[0], pb = this.progress.bosses, chosen = pb.includes('aurora') || pb.includes('vesper');
    if (relic) { tgt = { x: relic.x, y: relic.y }; label = 'Recoge la reliquia'; }
    else if (pb.includes('conde') && !chosen) { const o = w.npcs.find(n => n.type === 'oracle'); if (o) { tgt = { x: o.x, y: o.y }; label = 'Habla con el Oráculo del Alba'; } }
    else if (pb.includes('conde')) { tgt = null; }
    else { const id = order.find(b => !this.progress.bosses.includes(b)); const b = w.bosses.find(x => x.id === id); if (b) { tgt = { x: b.x, y: b.y }; label = 'Derrota a ' + b.name; } }
    this.objective = tgt;
    if (!tgt) { this.objTxt.setText(''); return; }
    const dx = tgt.x - this.player.x, dy = tgt.y - this.player.y;
    const arrows = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'];
    const idx = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
    this.objTxt.setText(label + '  ' + arrows[idx] + '  ' + Math.round(Math.hypot(dx, dy) / T) + ' m');
  }

  // ===================================================== sellado de salas de jefe
  moveBossToFoso(e) { // el Conde pasa a pelear en el foso con escombros
    e.arena = this.fosoArena(); e.home = { x: e.arena.ox + e.arena.ow / 2, y: e.arena.hover }; e.spr.setPosition(e.home.x, e.home.y); e.spr.body.setVelocity(0, 0);
  }
  fosoArena() {
    const ar = this.W.areas.fosoC, floor = (ar.y0 + ar.rh) * T - T;
    return { x0: ar.x0 * T + T, x1: (ar.x0 + ar.rw) * T - T, y0: ar.y0 * T + T, floor, ox: ar.x0 * T, oy: ar.y0 * T, ow: ar.rw * T, oh: ar.rh * T, hover: floor - 104 };
  }
  applyFloorState(f) {
    if (f >= 1 && this.floorState < 1) { this.floorState = 1; this.cameras.main.shake(2000, 0.01); this.toast('¡El suelo del trono se resquebraja!', 3500); SFX.boss(); }
    if (f >= 2 && !this.floorBroken) { this.floorState = 2; this.breakThroneFloor(); }
  }
  breakThroneFloor() { // el suelo se derrumba: todos caen al foso con escombros
    const th = this.W.areas.throne, fo = this.W.areas.fosoC;
    for (let gx = th.x0 + 2; gx <= th.x0 + th.rw - 3; gx++) {
      this.fg.removeTileAt(gx, th.y0 + th.rh - 1); this.fg.removeTileAt(gx, fo.y0);
      if (gx % 3 === 0) this.poof((gx + 0.5) * T, (th.y0 + th.rh) * T, 4, 0x9a8a8a);
    }
    this.floorBroken = true; this.floorState = 2; this.cameras.main.shake(700, 0.02); SFX.boss(); this.toast('¡El suelo se derrumba! Caéis al foso del Conde...', 4000);
  }
  applySeal(key) {
    if (this.curSeal === key) return;
    if (this.curSeal) this.W.areas[this.curSeal].seal.forEach(t => this.fg.removeTileAt(t.gx, t.gy));
    this.curSeal = key;
    if (key) { const rm = this.W.areas[key]; rm.seal.forEach(t => this.fg.putTileAt(rm.z * 8 + K.SOLID, t.gx, t.gy)); SFX.boss(); }
  }

  // ===================================================== entidades
  createEnt(id, type, x, y, sim, extra = {}) {
    const cfg = EN[type];
    let spr;
    if (sim) {
      spr = this.physics.add.sprite(x, y, cfg.tex).setScale(cfg.sc).setDepth(6);
      spr.setSize(cfg.body[0], cfg.body[1]);
      if (cfg.kind !== 'ghost' && cfg.kind !== 'saw') this.enemyGroup.add(spr);
      spr.body.setAllowGravity(!(cfg.kind === 'bat' || cfg.kind === 'ghost' || cfg.kind === 'saw' || cfg.fly));
      spr.body.setMaxVelocityY(700);
    } else spr = this.add.sprite(x, y, cfg.tex).setScale(cfg.sc).setDepth(6);
    const e = { id, type, cfg, spr, hp: cfg.hp, max: cfg.hp, sim, boss: cfg.kind === 'boss', dead: false, dir: Math.random() < 0.5 ? -1 : 1, flash: 0, stun: 0, tx: x, ty: y, aggro: false, tele: false, ...extra };
    if (extra.zone !== undefined && !e.boss && !cfg.inv) { e.hp = e.max = Math.ceil(cfg.hp * (ZONE_SCALE[extra.zone] || 1)); e.dmgBonus = extra.zone >= 4 ? 1 : 0; }
    if (extra.opts && extra.opts.elite) this.makeElite(e, extra.opts);
    this.ents.set(id, e);
    return e;
  }
  makeElite(e, opts = {}) { // élite: más grande, dorado, con más vida y premio fijo la primera vez
    e.elite = true; e.name = opts.name || e.name; e.reward = opts.reward || null;
    if (e.sim) { e.hp = e.max = e.hp * 3; e.dmgBonus = (e.dmgBonus || 0) + 1; }
    e.spr.setScale(e.cfg.sc * 1.25).setTint(0xffd070);
  }
  clearFlash(e) { if (e.elite) e.spr.setTint(0xffd070); else e.spr.clearTint(); }
  entBox(e) { const k = e.elite ? 1.25 : 1; return [e.spr.x, e.spr.y, e.cfg.hb[0] * k, e.cfg.hb[1] * k]; }

  targets() { // jugadores vivos (para IA del anfitrión)
    const t = [];
    if (!this.dead) t.push({ id: socket.id, x: this.player.x, y: this.player.y });
    Object.entries(this.remotes).forEach(([id, r]) => { if (!r.dead && r.spr) t.push({ id, x: r.spr.x, y: r.spr.y }); });
    return t;
  }
  nearest(x, y, maxD = 1e9) {
    let best = null, bd = maxD;
    for (const t of this.targets()) { const d = Math.hypot(t.x - x, t.y - y); if (d < bd) { bd = d; best = t; } }
    return best;
  }
  solidAt(wx, wy) { const t = this.fg.getTileAtWorldXY(wx, wy); return !!t && t.index >= 0 && (t.index % 8 === K.SOLID || t.index % 8 === K.FLOOR || t.index % 8 === K.CRACK || t.index % 8 === K.ONEWAY); }

  // ---- venenos inflamables (solo el anfitrión los simula): al tocar fuego arden y dañan a todos alrededor
  nearFire(p) { // antorcha o hoguera encendida pegada al veneno
    const c = PR[p.type], rx = c.hb[0] / 2 + 24, ry = c.hb[1] / 2 + 24, x = p.spr.x, y = p.spr.y;
    return this.torchObjs.some(o => o.lit && Math.abs(o.x - x) < rx && Math.abs(o.y - y) < ry) || this.altars.some(a => a.lit && Math.abs(a.x - x) < rx && Math.abs(a.y - 20 - y) < ry + 20);
  }
  igniteProj(p) {
    const x = p.spr.x, y = p.spr.y;
    p.spr.destroy(); this.projs.delete(p.id);
    this.spawnProj('inferno', x, y, 0, 0, 0.6);
    this.fireBurst(x, y); SFX.boss(); this.cameras.main.shake(120, 0.004);
    this.ents.forEach(e => { // daño a todos los enemigos cercanos (quedan ardiendo)
      if (e.dead || e.cfg.inv || e.boss) return; // los jefes son inmunes: las esporas son suyas y no deben quemarlos
      if (Math.hypot(e.spr.x - x, e.spr.y - y) < 120) this.damageEnt(e, 2, Math.sign(e.spr.x - x) || 1, undefined, 'fire');
    });
    [...this.projs.values()].forEach(o => { if (POISON.includes(o.type) && Math.hypot(o.spr.x - x, o.spr.y - y) < 130) this.igniteProj(o); }); // reacción en cadena
  }
  fireBurst(x, y) { // solo visual
    const n = LITE ? 6 : 22;
    for (let i = 0; i < n; i++) {
      const an = Math.random() * Math.PI * 2, d = Phaser.Math.Between(30, 110);
      const s = this.add.image(x, y, 'puff').setScale(Phaser.Math.FloatBetween(0.8, 1.6)).setTint([0xff4a1a, 0xff9a2a, 0xffd23b][i % 3]).setBlendMode(Phaser.BlendModes.ADD).setDepth(21);
      this.tweens.add({ targets: s, x: x + Math.cos(an) * d, y: y + Math.sin(an) * d - 20, alpha: 0, scale: 0.3, duration: Phaser.Math.Between(350, 800), ease: 'Quad.out', onComplete: () => s.destroy() });
    }
  }

  spawnProj(type, x, y, vx, vy, life = 3, grav = 0) {
    const c = PR[type], id = 'p' + (this.nid++);
    const spr = this.add.sprite(x, y, c.tex).setScale(c.sc * (OPT.cb ? 1.3 : 1)).setDepth(7).setTint(c.tint || 0xffffff).setAlpha(c.alpha || 1);
    if (OPT.cb) { const tw = this.tweens.add({ targets: spr, alpha: { from: 1, to: 0.45 }, duration: 160, yoyo: true, repeat: -1 }); spr.once('destroy', () => tw.remove()); } // ayuda visual: lo peligroso parpadea
    const pr = { id, type, spr, vx, vy, life, grav, tx: x, ty: y }; this.projs.set(id, pr); return pr;
  }

  damageEnt(e, dmg, dir) {
    if (e.dead) return;
    if (e.boss && !e.aggro) return;
    e.hp -= dmg; e.flash = 0.12; e.spr.setTintFill(0xffffff);
    if (!e.boss && !e.elite && e.cfg.kind === 'walk') { e.stun = 0.18; e.spr.body.setVelocityX(dir * 170); }
    if (e.hp <= 0) this.killEnt(e);
  }
  killEnt(e) {
    e.dead = true;
    this.poof(e.spr.x, e.spr.y, e.boss ? 18 : 7, e.boss ? 0xff6666 : 0xffffff);
    e.spr.destroy(); this.ents.delete(e.id); this.killed.add(e.id);
    if (e.boss) {
      socket.emit('bossDead', e.type);
      if (!(World.BOSSES[e.type] && World.BOSSES[e.type].rival)) this.progress.bosses.push(e.type); // los rivales Aurora/Vesper esperan al servidor (solo puede caer uno)
      this.projs.forEach(p => p.spr.destroy()); this.projs.clear();
      this.ents.forEach(x => { if (x.summoned) { x.spr.destroy(); this.ents.delete(x.id); } });
      this.sealKey = null; this.applySeal(null); this.syncRelics();
      this.cameras.main.shake(400, 0.01);
    }
  }

  // ===================================================== simulación del anfitrión
  simUpdate(dt) {
    this.simT += dt;
    // activación de salas
    this.activeT -= dt;
    if (this.activeT <= 0) {
      this.activeT = 0.4;
      const active = new Set();
      this.targets().forEach(t => {
        const c = Math.floor(t.x / (CW * T)), r = Math.floor(t.y / (CH * T));
        for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) active.add((c + dc) + ',' + (r + dr));
      });
      this.activeCells = active;
      active.forEach(k => { this.cellIdle[k] = 0; });
      this.W.spawns.forEach(s => {
        if (!active.has(cellKey(s.x, s.y - 1)) || this.ents.has(s.id) || this.killed.has(s.id)) return;
        const cfg = EN[s.type];
        const y = cfg.kind === 'saw' ? s.y - 16 : (cfg.kind === 'bat' || cfg.kind === 'ghost' ? s.y - 40 : s.y - (cfg.body[1] * cfg.sc) / 2 - 1);
        this.createEnt(s.id, s.type, s.x, y, true, { room: cellKey(s.x, s.y - 1), home: { x: s.x, y }, opts: s.opts, zone: s.zone });
      });
      this.W.bosses.forEach(b => {
        if (this.bossGone(b) || this.ents.has(b.id) || !active.has(cellKey(b.x, b.y - 1))) return;
        const cfg = EN[b.id];
        const arB = this.W.areas[b.area], floorB = (arB.y0 + arB.rh - 1) * T;
        const y = cfg.fly ? floorB - 66 : b.y - (cfg.body[1] * cfg.sc) / 2 - 1;
        const e = this.createEnt(b.id, b.id, b.x, y, true, { room: b.area, home: { x: b.x, y }, name: b.name, prize: b.reward, cd: 1.5, act: null, t: 0, emptyT: 0, summonCd: 8 });
        const ar = this.W.areas[b.area];
        e.arena = { x0: ar.x0 * T + T, x1: (ar.x0 + ar.rw) * T - T, y0: ar.y0 * T + T, floor: (ar.y0 + ar.rh) * T - T, ox: ar.x0 * T, oy: ar.y0 * T, ow: ar.rw * T, oh: ar.rh * T, hover: (ar.y0 + ar.rh) * T - T - 66 };
        if (b.id === 'conde' && this.floorBroken) { e.arena = this.fosoArena(); e.home = { x: e.arena.ox + e.arena.ow / 2, y: e.arena.hover }; e.spr.setPosition(e.home.x, e.home.y); }
      });
      // despawn por inactividad
      this.ents.forEach(e => {
        if (!e.sim || e.boss || e.summoned) return;
        if (!active.has(e.room)) { e.idle = (e.idle || 0) + 0.4; if (e.idle > 8) { e.spr.destroy(); this.ents.delete(e.id); } } else e.idle = 0;
      });
      Object.keys(this.cellIdle).forEach(k => { if (!active.has(k)) { this.cellIdle[k] += 0.4; if (this.cellIdle[k] > 10) { this.W.spawns.forEach(s => { if (cellKey(s.x, s.y - 1) === k) this.killed.delete(s.id); }); delete this.cellIdle[k]; } } });
    }
    // IA
    [...this.ents.values()].forEach(e => { if (e.sim && !e.dead && !e.boss) { const sa = this.W.areaOf(Math.floor(e.spr.x / T), Math.floor(e.spr.y / T)); if (sa && sa.safe) { this.poof(e.spr.x, e.spr.y, 4); e.spr.destroy(); this.ents.delete(e.id); return; } }
      if (e.sim && !e.dead) { if (e.flash > 0) { e.flash -= dt; if (e.flash <= 0) this.clearFlash(e); } this.statusTick(e, dt); if (e.boss) this.bossAI(e, dt); else this.aiUpdate(e, dt); } });
    // proyectiles
    [...this.projs.values()].forEach(p => {
      if (!this.projs.has(p.id)) return; // otra explosión ya se lo llevó
      if (POISON.includes(p.type) && this.nearFire(p)) { this.igniteProj(p); return; }
      p.life -= dt; p.vy += p.grav * dt; p.spr.x += p.vx * dt; p.spr.y += p.vy * dt;
      if (p.brake !== undefined) { p.brake -= dt; if (p.brake <= 0) { p.vx = 0; p.vy = 0; p.brake = undefined; } } // la nube frena y se queda flotando
      if (p.homing && p.brake === undefined) { const t = this.nearest(p.spr.x, p.spr.y, 700); if (t) { const an = Math.atan2(t.y - p.spr.y, t.x - p.spr.x); p.vx = Math.cos(an) * p.homing; p.vy = Math.sin(an) * p.homing; } } // espora teledirigida
      p.spr.setFlipX(p.vx < 0);
      if (p.ground && (!this.solidAt(p.spr.x, p.spr.y + 12) || this.solidAt(p.spr.x + Math.sign(p.vx) * 14, p.spr.y))) p.life = 0; // la onda muere en el borde de la plataforma o en un muro
      if (p.type === 'shroomb') p.spr.angle += 540 * dt; // la seta lanzada gira en el aire
      if (p.life <= 0 || (!['shock', 'lash', 'vine'].includes(p.type) && this.solidAt(p.spr.x, p.spr.y))) {
        if (p.type === 'shroomb') { this.spawnProj('boom', p.spr.x, p.spr.y, 0, 0, 0.3); this.shroomBurst(p.spr.x, p.spr.y); SFX.hit(); } // la seta estalla al caer
        p.spr.destroy(); this.projs.delete(p.id);
      }
    });
    // instantánea
    this.snapT -= dt;
    if (this.snapT <= 0) {
      this.snapT = 0.08;
      const e = [], p = [];
      this.ents.forEach(en => e.push([en.id, en.type, Math.round(en.spr.x), Math.round(en.spr.y), en.hp, en.max, en.spr.flipX ? 1 : 0, (en.aggro ? 1 : 0) | (en.tele ? 2 : 0) | (en.shield ? 4 : 0) | (en.elite ? 8 : 0) | (en.melt ? 16 : 0), en.name || '']));
      this.projs.forEach(pr => p.push([pr.id, pr.type, Math.round(pr.spr.x), Math.round(pr.spr.y)]));
      socket.volatile.emit('snap', { e, p, s: this.sealKey, f: this.floorState });
    }
  }

  // habilidad propia de cada enemigo con nombre (nunca retroceden al ser golpeados)
  eliteAbility(e, dt, tg) {
    const ab = ELITE_AB[e.name]; if (!ab) return false;
    const b = e.spr.body, x = e.spr.x, d = tg ? Math.hypot(tg.x - e.spr.x, tg.y - e.spr.y) : 1e9;
    e.abCd = (e.abCd === undefined ? 2 : e.abCd) - dt;
    if (ab.trail) { e.trailT = (e.trailT || 0) - dt; if (e.trailT <= 0 && (b.blocked.down || b.touching.down) && Math.abs(b.velocity.x) > 8) { e.trailT = 0.3; this.spawnProj('toxin', e.spr.x, b.bottom - 6, 0, 0, 3); } } // rastro de veneno al andar
    if (e.abPh === 'tele') {
      e.abT -= dt; e.tele = true; b.setVelocityX(0); if (e.cfg.kind === 'ghost') b.setVelocityY(0);
      if (e.abT <= 0) { e.tele = false; e.abPh = 'act'; e.abT = ab.act || 0.05; if (tg) this.eliteFire(e, ab, tg); }
      return true;
    }
    if (e.abPh === 'act') {
      e.abT -= dt;
      if (ab.kind === 'charge') {
        const ahead = this.solidAt(x + e.cdir * 22, e.spr.y + (e.cfg.body[1] * e.cfg.sc) / 2 + 6);
        if (b.blocked.left || b.blocked.right || !ahead) e.abT = 0; else { b.setVelocityX(e.cdir * ab.spd); e.spr.setFlipX(e.cdir < 0); }
      }
      if (e.abT <= 0) { e.abPh = null; e.abCd = ab.cd; }
      return ab.kind === 'charge';
    }
    if (e.abCd <= 0 && tg && d < ab.range) { e.abPh = 'tele'; e.abT = ab.tele; e.cdir = Math.sign(tg.x - e.spr.x) || 1; e.spr.setFlipX(e.cdir < 0); }
    return false;
  }
  eliteFire(e, ab, tg) {
    const x = e.spr.x, y = e.spr.y, an = Math.atan2(tg.y - y, tg.x - x);
    if (ab.kind === 'haste') {
      e.abN = (e.abN || 0) + 1; e.cloudTurn = e.abN % 2 === 0; // un ciclo furia, el siguiente nube de veneno
      if (e.cloudTurn) { const dist = Math.hypot(tg.x - x, tg.y - (y - 16)), sp = 230, pr = this.spawnProj('cloud', x, y - 16, Math.cos(an) * sp, Math.sin(an) * sp, dist / sp + 5); pr.brake = Math.min(1.3, dist / sp); }
    } else if (ab.kind === 'orbs') { for (const o of [-0.3, 0, 0.3]) this.spawnProj('orb', x, y - 6, Math.cos(an + o) * 190, Math.sin(an + o) * 190, 3); }
    else if (ab.kind === 'quake') { this.cameras.main.shake(180, 0.006); 
      const feet = y + (e.cfg.body[1] * e.cfg.sc) / 2;
      for (const s of [-1, 1]) { // las ondas viajan pegadas al suelo que pisa el enemigo (también en plataformas)
        const sx = x + s * 24; let top = null;
        for (let yy = feet - 6; yy < feet + 40; yy += 4) if (this.solidAt(sx, yy)) { top = Math.floor(yy / T) * T; break; }
        if (top === null) continue;
        const pr = this.spawnProj('shock', sx, top - 8, s * 230, 0, 1.3); pr.ground = true;
      }
    }
    else if (ab.kind === 'blink') {
      e.abN = (e.abN || 0) + 1;
      const lit = this.torchObjs.filter(o => o.lit && Math.hypot(o.x - x, o.y - y) < 380).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0];
      if (lit && e.abN % 2 === 1) { // soplido: apaga la antorcha más cercana a distancia
        for (let i = 0; i < 6; i++) this.poof(x + (lit.x - x) * i / 6, y + (lit.y - y) * i / 6, 1, 0xbbaaff);
        this.setTorch(lit.id, false); socket.emit('torch', { id: lit.id, on: false }); return;
      }
      const nx = tg.x + (Math.random() < 0.5 ? -1 : 1) * 90, ny = tg.y - 10;
      if (!this.solidAt(nx, ny)) { this.poof(x, y, 5, 0xbbaaff); e.spr.setPosition(nx, ny); this.poof(nx, ny, 5, 0xbbaaff); }
      this.spawnProj('orb', e.spr.x, e.spr.y, Math.cos(Math.atan2(tg.y - e.spr.y, tg.x - e.spr.x)) * 200, Math.sin(Math.atan2(tg.y - e.spr.y, tg.x - e.spr.x)) * 200, 3);
    }
  }

  aiUpdate(e, dt) {
    const slow = e.slowT > 0 ? 0.5 : 1; // hielo: la mitad de velocidad
    const b = e.spr.body, cfg = e.cfg, tg = this.nearest(e.spr.x, e.spr.y, 420);
    if (cfg.kind === 'saw') { // sierra: va y viene por su raíl, no se puede matar
      const o = e.opts || { ax: 'h', r: 100, w: 1.4 };
      if (e.ox === undefined) { e.ox = e.spr.x; e.oy = e.spr.y; e.ph = (e.ox * 0.013) % 6.28; }
      const t = this.simT * o.w + e.ph, nx = e.ox + (o.ax === 'h' ? Math.sin(t) * o.r : 0), ny = e.oy + (o.ax === 'v' ? Math.sin(t) * o.r : 0);
      b.setVelocity((nx - e.spr.x) * 9, (ny - e.spr.y) * 9); return;
    }
    if (e.down > 0) { e.down -= dt; b.setVelocityX(0); if (e.down <= 0) { e.down = 0; e.shield = false; e.spr.setAngle(0); this.poof(e.spr.x, e.spr.y, 6, 0x8fd35a); } return; } // el prisionero caído se levanta
    if (e.elite && this.eliteAbility(e, dt, tg)) return;
    if (cfg.kind === 'turret') { // hongo: se hincha y suelta esporas que persiguen
      b.setVelocityX(0); e.cd = (e.cd === undefined ? 2 : e.cd) - dt * slow;
      if (!e.ph && e.cd <= 0 && tg && Math.hypot(tg.x - e.spr.x, tg.y - e.spr.y) < 300) { e.ph = 'tele'; e.abT = 0.8; }
      if (e.ph === 'tele') { e.tele = true; e.abT -= dt; if (e.abT <= 0) { e.tele = false; e.ph = null; e.cd = 3.5; for (const an of [-100, -90, -80]) { const r = an * Math.PI / 180, pr = this.spawnProj('spore', e.spr.x, e.spr.y - 20, Math.cos(r) * 90, Math.sin(r) * 90, 4.5); pr.brake = 0.5; pr.homing = 38; } } }
      return;
    }
    if (cfg.kind === 'ceil') { // liana: cuelga del techo y cae sobre quien pasa debajo
      b.setVelocity(0, 0); const dx = tg ? Math.abs(tg.x - e.spr.x) : 999, below = tg && tg.y > e.spr.y && tg.y < e.spr.y + 260;
      if (!e.ph) { e.cd = (e.cd === undefined ? 1.5 : e.cd) - dt; e.armT = dx < 90 && below ? (e.armT || 0) + dt : 0; if (e.armT > 0.4 && e.cd <= 0) { e.ph = 'tele'; e.abT = 0.5; e.armT = 0; } }
      else if (e.ph === 'tele') { e.tele = true; e.abT -= dt; if (e.abT <= 0) { e.tele = false; e.ph = 'act'; e.abT = 0.35; this.spawnProj('vine', e.spr.x, e.spr.y + 95, 0, 0, 0.35); } }
      else { e.abT -= dt; if (e.abT <= 0) { e.ph = null; e.cd = 1.5; } }
      return;
    }
    if (cfg.slime) { e.slimeT = (e.slimeT || 0) - dt; if (e.slimeT <= 0 && (b.blocked.down || b.touching.down)) { e.slimeT = 1.0; this.spawnProj('slime', e.spr.x, b.bottom - 5, 0, 0, 3); } }
    if (cfg.kind === 'walk') {
      if (e.stun > 0) { e.stun -= dt; return; }
      if (cfg.throws) { // prisionero: se para, arranca una seta del sombrero y la lanza en parábola
        e.thCd = (e.thCd === undefined ? 1 : e.thCd) - dt * slow;
        if (e.thPh === 'tele') {
          e.tele = true; b.setVelocityX(0); e.thT -= dt;
          if (e.thT <= 0) {
            e.tele = false; e.thPh = null; e.thCd = 3.2;
            if (tg) { const g = 900, sx = e.spr.x, sy = e.spr.y - 30, dx = tg.x - sx, t = Phaser.Math.Clamp(Math.abs(dx) / 260, 0.45, 1.1); this.spawnProj('shroomb', sx, sy, dx / t, (tg.y - sy - 0.5 * g * t * t) / t, t + 1.5, g); }
          }
          return;
        }
        if (e.thCd <= 0 && tg && (b.blocked.down || b.touching.down)) {
          const dx = tg.x - e.spr.x;
          if (Math.abs(dx) < 340 && Math.abs(tg.y - e.spr.y) < 140) { e.thPh = 'tele'; e.thT = 0.55; e.spr.setFlipX(dx < 0); b.setVelocityX(0); return; }
        }
      }
      let dir = e.dir, mul = (e.abPh === 'act' && (ELITE_AB[e.name] || {}).kind === 'haste' && !e.cloudTurn) ? 1.8 : 1;
      const x = e.spr.x, feet = e.spr.y + (cfg.body[1] * cfg.sc) / 2 + 6;
      if (!cfg.patrol && tg && Math.abs(tg.y - e.spr.y) < 80 && Math.abs(tg.x - x) < 240) { dir = Math.sign(tg.x - x) || dir; mul = 1.7; }
      const ahead = this.solidAt(x + dir * 22, feet);
      if (b.blocked.left || b.blocked.right || !ahead) { if (mul > 1) { b.setVelocityX(0); e.spr.setFlipX(dir < 0); return; } dir = -dir; }
      e.dir = dir; b.setVelocityX(dir * cfg.spd * slow * mul); e.spr.setFlipX(dir < 0);
    } else if (cfg.kind === 'bat') {
      e.spr.setTexture(((this.simT * 8) | 0) % 2 ? 'bat1' : 'bat2');
      // los murciélagos huyen de la luz y no pueden entrar en ella
      { const L = this.lightLevel(e.spr.x, e.spr.y);
        if (L > 0.12) { const src = this.nearestLight(e.spr.x, e.spr.y); if (src) { const an = Math.atan2(e.spr.y - src.y, e.spr.x - src.x); b.setVelocity(Math.cos(an) * 150, Math.sin(an) * 150); e.awake = true; return; } } }
      if (!e.awake) { if (tg && Math.hypot(tg.x - e.spr.x, tg.y - e.spr.y) < 260) e.awake = true; else { b.setVelocity(0, Math.sin(this.simT * 3 + e.spr.x) * 8); return; } }
      if (!tg) { b.setVelocity(0, 0); return; }
      const dx = tg.x - e.spr.x, dy = tg.y - e.spr.y;
      let vx = Phaser.Math.Clamp(dx, -1, 1) * cfg.spd * slow, vy = Phaser.Math.Clamp(dy * 1.2, -90, 90) + Math.sin(this.simT * 6 + e.spr.x) * 45;
      if (this.lightLevel(e.spr.x + vx * 0.4, e.spr.y + vy * 0.4) > 0.12) { vx = -vx * 0.3; vy = Math.sin(this.simT * 4 + e.spr.x) * 30; }
      b.setVelocity(vx, vy);
      e.spr.setFlipX(dx < 0);
    } else if (cfg.kind === 'ghost') {
      e.spr.setAlpha(0.65 + Math.sin(this.simT * 3 + e.spr.x) * 0.25);
      // los fantasmas no ven a quien está bajo la luz
      const tgd = this.nearestDark(e.spr.x, e.spr.y, 400);
      if (!tgd) { b.setVelocity(0, Math.sin(this.simT * 2 + e.spr.x) * 14); return; }
      const ang = Math.atan2(tgd.y - e.spr.y, tgd.x - e.spr.x);
      b.setVelocity(Math.cos(ang) * cfg.spd * slow, Math.sin(ang) * cfg.spd * slow); e.spr.setFlipX(tgd.x < e.spr.x);
    }
  }

  surfaceBelow(x, y, maxY) { // y de la superficie (plataforma o suelo) que hay justo bajo un punto
    for (let yy = y; yy < maxY; yy += 4) if (this.solidAt(x, yy)) return Math.floor(yy / T) * T;
    return maxY;
  }

  bossAI(e, dt) {
    const b = e.spr.body, a = e.arena, cfg = e.cfg;
    // protección: si el jefe sale de su sala (p. ej. cae por un hueco), vuelve a su sitio
    if (e.spr.y > a.oy + a.oh + 30 || e.spr.y < a.oy - 30 || e.spr.x < a.ox - 30 || e.spr.x > a.ox + a.ow + 30) { e.spr.setPosition(e.home.x, e.home.y); b.setVelocity(0, 0); e.act = null; }
    const inArena = t => t.x > a.ox + T && t.x < a.ox + a.ow - T && t.y > a.oy && t.y < a.oy + a.oh;
    const inner = t => t.x > a.ox + 3 * T && t.x < a.ox + a.ow - 3 * T && t.y > a.oy + 2 * T && t.y < a.oy + a.oh - T;
    const tgs = this.targets().filter(inArena);
    if (!e.aggro) {
      if (!tgs.some(inner)) return;
      e.aggro = true; e.emptyT = 0; e.max = e.hp = Math.max(4, Math.round(cfg.hp * (0.7 + 0.3 * tgs.length))); e.cd = 1.2; e.act = null;
      this.sealKey = e.room; this.applySeal(e.room);
      if (e.type === 'conde' && !this.floorBroken) { e.phase = 'intro'; e.introT = 0; this.floorState = 1; this.applyFloorState(1); }
      else if (e.type === 'conde' && e.arena.oy !== this.fosoArena().oy) this.moveBossToFoso(e);
      return;
    }
    if (e.phase === 'intro') { // el suelo se resquebraja, se rompe y todos caen al foso (no depende de quién esté en la sala)
      e.introT += dt; b.setVelocity(0, (a.hover - 50 - e.spr.y) * 2.5); e.tele = e.introT < 1.8; e.emptyT = 0;
      if (e.introT > 1.8 && !this.floorBroken) { this.floorState = 2; this.breakThroneFloor(); }
      if (e.introT > 2.8) { this.moveBossToFoso(e); e.phase = null; e.tele = false; e.cd = 1.8; e.act = null; }
      return;
    }
    if (!tgs.length) { e.emptyT += dt; if (e.emptyT > 4) { // reinicio del jefe
      e.aggro = false; e.hp = e.max = cfg.hp; e.act = null; e.tele = false; e.marked = e.erupted = e.moved = e.fired = e.diving = false; e.chan = 0; e.phase = null; e.armor = undefined; e.stunT = 0; e.melt = false; e.special = 0; e.spr.setAlpha(1); e.shield = false; e.second = false; if (!this.floorBroken) this.floorState = 0; e.spr.setPosition(e.home.x, e.home.y); b.setVelocity(0, 0); e.spr.setAlpha(1);
      this.projs.forEach(p => p.spr.destroy()); this.projs.clear();
      this.ents.forEach(x => { if (x.summoned) { x.spr.destroy(); this.ents.delete(x.id); } });
      this.sealKey = null; this.applySeal(null); } return; }
    e.emptyT = 0;
    e.relightT = Math.max(0, (e.relightT || 0) - dt); e.fanCd = Math.max(0, (e.fanCd || 0) - dt);
    if (e.type === 'clock') e.shield = this.lightLevel(e.spr.x, e.spr.y) > 0.18; // inmune a la luz
    const tg = tgs.reduce((m, t) => (Math.hypot(t.x - e.spr.x, t.y - e.spr.y) < Math.hypot(m.x - e.spr.x, m.y - e.spr.y) ? t : m), tgs[0]);
    const x = e.spr.x, y = e.spr.y, rage = e.hp < e.max * 0.5, dirT = Math.sign(tg.x - x) || 1;
    e.spr.setFlipX(tg.x < x);
    if (e.type === 'madre') { // armadura de raíces: solo el Pisotón la rompe (o 15 golpes normales)
      if (e.armor === undefined) { e.armor = tgs.length >= 3 ? 2 : 1; e.windowT = 0; }
      if (e.armor <= 0) { e.windowT -= dt; if (e.windowT <= 0) { e.armor = tgs.length >= 3 ? 2 : 1; this.poof(e.spr.x, e.spr.y, 12, 0x8fd35a); } }
      e.shield = e.armor > 0;
      if (e.stunT > 0) { e.stunT -= dt; e.tele = false; b.setVelocity(0, 0); return; }
    }
    const floorY = a.floor;
    const shock = (n = 1) => { // las ondas salen de la superficie que pisa el jefe (suelo o plataforma)
      const sy = this.surfaceBelow(x, y, floorY), onPlat = sy < floorY - 4;
      const mk = (vx, life) => { const pr = this.spawnProj('shock', x, sy - 10, vx, 0, life); if (onPlat) pr.ground = true; };
      mk(230, 1.4); mk(-230, 1.4); if (rage && n > 1) { mk(340, 1.2); mk(-340, 1.2); } this.cameras.main.shake(180, 0.006); };
    const fan = (cnt) => { const base = Math.atan2(tg.y - y, tg.x - x); for (let i = -cnt; i <= cnt; i++) { const an = base + i * 0.24; this.spawnProj('orb', x, y, Math.cos(an) * 200, Math.sin(an) * 200, 4); } };
    const gear = () => this.spawnProj('gear', Phaser.Math.Between(a.x0 + 20, a.x1 - 20), a.y0 + 12, 0, 240, 3.5, 0);
    const ring = (n, sp, off) => { for (let i = 0; i < n; i++) { const an = off + i * Math.PI * 2 / n, pr = this.spawnProj('spore', x, y - 10, Math.cos(an) * sp, Math.sin(an) * sp, 4); pr.brake = 1.0; } };
    const sporeFan = (n) => { const base = Math.atan2(tg.y - y, tg.x - x) - 0.25; for (let i = 0; i < n; i++) { const an = base + (i - (n - 1) / 2) * 0.3, pr = this.spawnProj('spore', x, y - 30, Math.cos(an) * 260, Math.sin(an) * 260, 4.5); pr.brake = 0.75; pr.homing = 38; } }; // salen hacia el jugador y se paran lejos del jefe: así no arden junto a él
    const summon = (n) => { for (let i = 0; i < n; i++) { const id = 's' + (this.nid++); const bx = Phaser.Math.Between(a.x0 + 60, a.x1 - 60), by = a.y0 + 120; this.createEnt(id, e.type === 'reina' ? 'sk' : e.type === 'alcaide' ? 'shroom' : e.type === 'madre' ? (i < 2 ? 'shroom' : 'slug') : 'bat', bx, by, true, { room: e.room, summoned: true, awake: true }); } };

    if (!e.act) {
      e.cd -= dt;
      if (cfg.fly) { // flotar
        b.setVelocity(Math.sin(this.simT * 1.3) * 40, (a.hover + Math.sin(this.simT * 2.1) * 14 - y) * 2.5); // flota a baja altura: siempre se le puede golpear
        e.spr.setAlpha(1);
      } else if (e.type === 'madre' && Math.abs(tg.x - x) > 160) b.setVelocityX(dirT * 60); // con la armadura rota avanza despacio hacia el jugador
      else b.setVelocityX(0);
      if (e.cd <= 0) {
        const pick = arr => arr[Math.floor(Math.random() * arr.length)];
        e.t = 0; e.air = false; e.dirT = dirT; e.n = 0; e.marked = e.erupted = e.moved = e.fired = e.diving = false; e.chan = 0;
        if (e.type === 'garg') e.act = pick(['leap', 'charge', 'leap']);
        if (e.type === 'archon') { const o = ['fan', 'tele', 'rays', 'fan'].filter(x => x !== e.last); if (e.hp < e.max * 0.6 && e.summonCd <= 0) e.act = 'summon'; else e.act = pick(o); e.last = e.act; }
        if (e.type === 'reina') { const o = ['leap', 'charge', 'pillars', 'leap'].filter(x => x !== e.last); if (e.hp < e.max * 0.7 && e.summonCd <= 0) e.act = 'summon'; else e.act = pick(o); e.last = e.act; }
        if (e.type === 'aurora') { const o = ['fan', 'dive', 'rays', 'sweep'].filter(x => x !== e.last); e.act = pick(o); e.last = e.act; }
        if (e.type === 'vesper') { const o = ['charge', 'ambush', 'pillars', 'leap'].filter(x => x !== e.last); e.act = pick(o); e.last = e.act; }
        if (e.type === 'alcaide') { const rg = e.hp < e.max * 0.5; if (rg && e.summonCd <= 0 && [...this.ents.values()].filter(x => x.summoned).length < 2) e.act = 'brood'; else { const o = ['whip', 'spores', 'burrow'].filter(x => x !== e.last); e.act = pick(o); } e.last = e.act; }
        if (e.type === 'madre') { const near = Math.hypot(tg.x - x, tg.y - y) < 150; if ((e.hp < e.max * 0.25 ? 2 : rage ? 1 : 0) > (e.special || 0)) { e.special = e.hp < e.max * 0.25 ? 2 : 1; e.act = 'cataclysm'; } else if (near && Math.random() < 0.6) e.act = 'slap'; else if (rage && e.summonCd <= 0 && [...this.ents.values()].filter(q => q.summoned).length < 3) e.act = 'brood'; else { const o = ['bloom', 'rootwave'].filter(q => q !== e.last); e.act = pick(o); } e.last = e.act; }
        if (e.type === 'clock') e.act = (e.relightT <= 0 && this.torchObjs.some(o => o.area === 'clkC' && !o.lit)) ? 'relight' : pick(['charge', 'slam', 'rain']);
        if (e.type === 'bishop') { e.summonCd -= 0; e.act = e.hp < e.max * 0.6 && e.summonCd <= 0 ? 'summon' : pick(['fan', 'tele', 'fan']); }
        if (e.type === 'conde') {
          const opts = ['ambush', 'pillars', 'dive', 'sweep', 'rain']; if (e.fanCd <= 0) opts.push('tele');
          const pool = opts.filter(o => o !== e.last);
          e.act = e.hp < e.max * 0.75 && e.summonCd <= 0 ? 'summon' : pick(pool); e.last = e.act;
        }
      }
      e.summonCd -= dt;
      return;
    }
    e.t += dt;
    const done = (cd) => { if (e.type === 'madre' && e.armor > 0) { e.act = 'melt'; e.t = 0; e.tele = false; e.dest = undefined; } else { e.act = null; e.cd = cd * (rage ? 0.65 : 1); e.tele = false; } }; // la Madre Moho siempre se diluye y cambia de sitio tras atacar
    switch (e.act) {
      case 'leap':
        if (e.t < 0.5) { b.setVelocityX(0); e.tele = true; }
        else if (!e.air) { e.tele = false; b.setVelocity(e.dirT * Math.min(280, Math.abs(tg.x - x) * 0.9 + 90), -660); e.air = true; e.t = 0.5; }
        else if (e.t > 0.85 && b.blocked.down) { shock(2); done(1.0); }
        break;
      case 'charge': {
        const spd = e.type === 'clock' ? 400 : 360;
        if (e.t < 0.75) { b.setVelocityX(0); e.tele = true; e.dirT = dirT; }
        else if (e.t < 1.9) { e.tele = false; b.setVelocityX(e.dirT * spd); if (b.blocked.left || b.blocked.right) { e.t = 1.9; this.cameras.main.shake(150, 0.006); } }
        else if (e.t < 2.7) b.setVelocityX(0);
        else done(0.9);
        break;
      }
      case 'slam':
        if (e.t < 0.6) { b.setVelocityX(0); e.tele = true; }
        else if (!e.air) { e.tele = false; b.setVelocity(dirT * 140, -740); e.air = true; e.t = 0.6; }
        else if (e.t > 0.9 && b.blocked.down) { shock(2); for (let i = 0; i < (rage ? 6 : 4); i++) gear(); done(1.1); }
        break;
      case 'rain':
        if (e.t < 0.7) { b.setVelocityX(0); e.tele = true; } else { e.tele = false; if (e.t > 0.7 + e.n * 0.3 && e.n < (rage ? 9 : 6)) { gear(); e.n++; } if (e.n >= (rage ? 9 : 6)) done(1.2); }
        break;
      case 'fan':
        b.setVelocity(0, 0);
        if (e.t < 0.6) e.tele = true; else if (!e.fired) { e.tele = false; fan(rage ? 4 : 2); e.fired = true; } else if (e.t > 1.0) { e.fired = false; if (rage && e.n++ < 1) e.t = 0.55; else done(0.8); }
        break;
      case 'tele': // desaparece, reaparece y dispara
        if (e.t < 0.45) { e.spr.setAlpha(Math.max(0.1, 1 - e.t * 2.2)); b.setVelocity(0, 0); }
        else if (!e.moved) {
          const aw = a.ow / T, spots = e.type === 'bishop' ? [[5, 9], [aw / 2, 7], [aw - 5, 9]] : [[4, 10], [aw / 2, 6], [aw - 4, 10]];
          const s = spots.filter(p => Math.abs(a.ox + p[0] * T - tg.x) > 150)[Math.floor(Math.random() * 2)] || spots[1];
          e.spr.setPosition(a.ox + (s[0] + 0.5) * T, a.hover); e.moved = true;
        } else if (e.t < 0.9) e.spr.setAlpha(Math.min(1, (e.t - 0.45) * 2.5));
        else if (!e.fired) { e.spr.setAlpha(1); fan(e.type === 'conde' ? (rage ? 2 : 1) : (rage ? 3 : 2)); if (e.type === 'conde') e.fanCd = 14; e.fired = true; }
        else if (e.t > 1.4) { e.moved = false; e.fired = false; done(0.7); }
        break;
      case 'ambush': // se teletransporta junto a ti y corta
        if (e.t < 0.45) { b.setVelocity(0, 0); e.spr.setAlpha(Math.max(0.1, 1 - e.t * 2.4)); }
        else if (!e.moved) {
          const sx = Phaser.Math.Clamp(tg.x + (Math.random() < 0.5 ? -1 : 1) * 70, a.x0 + 40, a.x1 - 40);
          e.spr.setPosition(sx, Phaser.Math.Clamp(tg.y - 10, a.y0 + 80, a.floor - 70)); e.dirT = Math.sign(tg.x - sx) || 1; e.spr.setFlipX(e.dirT < 0); e.moved = true;
        } else if (e.t < 0.95) { e.spr.setAlpha(Math.min(1, (e.t - 0.45) * 3)); e.tele = true; b.setVelocity(0, 0); }
        else if (!e.fired) { e.tele = false; e.spr.setAlpha(1); this.spawnProj('shock', e.spr.x, e.spr.y + 8, e.dirT * 400, 0, 0.4); this.spawnProj('shock', e.spr.x, e.spr.y - 24, e.dirT * 400, 0, 0.4); e.fired = true; }
        else if (e.t > 1.5) { e.moved = false; e.fired = false; done(0.8); }
        break;
      case 'pillars': { // pilares de sangre: marcas en el suelo y erupción
        if (e.t < 0.5) { b.setVelocity(0, 0); e.tele = true; }
        else if (!e.marked) {
          e.tele = false; e.marked = true; e.pxs = tgs.map(t => { const px = Phaser.Math.Clamp(t.x, a.x0 + 30, a.x1 - 30); return [px, this.surfaceBelow(px, t.y, a.floor)]; }); // el pilar sale bajo cada jugador: en su plataforma, no en el suelo
          for (let i = 0; i < (rage ? 5 : 3); i++) e.pxs.push([Phaser.Math.Between(a.x0 + 60, a.x1 - 60), a.floor]);
          e.pxs.forEach(([px, sy]) => this.spawnProj('mark', px, sy - 6, 0, 0, 0.9));
        } else if (!e.erupted && e.t > 1.4) { e.erupted = true; e.pxs.forEach(([px, sy]) => this.spawnProj('pillar', px, sy - 72, 0, 0, 0.5)); this.cameras.main.shake(160, 0.006); }
        else if (e.t > 2.3) { e.marked = false; e.erupted = false; done(1.0); }
        break; }
      case 'dive': // sube al techo y cae en picado
        if (e.t < 0.55) { e.tele = true; b.setVelocity(0, (a.y0 + 70 - y) * 4); }
        else if (!e.diving) { e.tele = false; e.diving = true; e.tx = tg.x; }
        else { b.setVelocity((e.tx - x) * 3, 760); if (y >= a.floor - 50 || b.blocked.down || e.t > 2.4) { shock(2); this.cameras.main.shake(220, 0.01); e.diving = false; done(0.9); } }
        break;
      case 'sweep': // el Conde embiste en horizontal volando
        if (e.t < 0.7) { b.setVelocity(0, 0); e.tele = true; e.dirT = dirT; e.sy = Phaser.Math.Clamp(tg.y, a.y0 + 80, floorY - 40); }
        else if (e.t < 1.9) { e.tele = false; b.setVelocity(e.dirT * 430, (e.sy - y) * 4); if (x < a.x0 + 20 || x > a.x1 - 20) e.t = 1.9; }
        else if (e.t < 2.4) b.setVelocity(0, 0); else done(0.7);
        break;
      case 'relight': { // va a encender una antorcha apagada: mientras tanto está a oscuras
        const tt = this.torchObjs.filter(o => o.area === 'clkC' && !o.lit).sort((p1, q1) => Math.abs(p1.x - x) - Math.abs(q1.x - x))[0];
        if (!tt || e.t > 8) { done(0.4); break; }
        const dxT = tt.x - x;
        if (Math.abs(dxT) > 28) { b.setVelocityX(Math.sign(dxT) * (rage ? 190 : 150)); e.spr.setFlipX(dxT < 0); e.tele = false; e.chan = 0; }
        else {
          b.setVelocityX(0); e.tele = true; e.chan = (e.chan || 0) + dt;
          if (e.chan >= (rage ? 0.7 : 1.1)) { this.setTorch(tt.id, true); socket.emit('torch', { id: tt.id, on: true }); e.relightT = rage ? 2 : 3.2; e.chan = 0; done(0.5); }
        }
        break; }
      case 'rays': // lluvia de rayos de luz desde el techo
        b.setVelocity(0, 0);
        if (e.t < 0.7) e.tele = true;
        else { e.tele = false; const tot = rage ? 14 : 9; if (e.t > 0.7 + e.n * 0.22 && e.n < tot) { const rx = e.n % 3 === 0 ? Phaser.Math.Clamp(tg.x, a.x0 + 20, a.x1 - 20) : Phaser.Math.Between(a.x0 + 20, a.x1 - 20); this.spawnProj('orb', rx, a.y0 + 14, 0, 240, 3.5); e.n++; } if (e.n >= tot && e.t > 0.7 + tot * 0.22 + 0.8) done(1.1); }
        break;
      case 'whip': // Alcaide: latigazo
        b.setVelocityX(0);
        if (e.t < 0.8) e.tele = true;
        else if (!e.fired) { e.tele = false; this.spawnProj('lash', x + e.dirT * 85, y + 18, 0, 0, 0.3); e.fired = true; e.second = false; this.cameras.main.shake(120, 0.005); }
        else if (rage && !e.second && e.t > 1.25) { e.second = true; this.spawnProj('lash', x - e.dirT * 85, y + 18, 0, 0, 0.3); }
        else if (e.t > 1.9) { e.second = false; done(0.9); }
        break;
      case 'spores': // Alcaide: nube de moho
        b.setVelocityX(0);
        if (e.t < 0.6) e.tele = true; else if (!e.fired) { e.tele = false; sporeFan(rage ? 5 : 3); e.fired = true; } else if (e.t > 1.6) done(1.0);
        break;
      case 'burrow': // Alcaide: se hunde, viaja bajo el suelo y brotan pilares
        if (e.t < 0.5) { e.tele = true; e.shield = true; b.setVelocityX(0); e.spr.setAlpha(Math.max(0.25, 1 - e.t * 1.6)); }
        else if (e.t < 1.3) { e.tele = false; e.spr.setAlpha(0.25); b.setVelocityX(Math.abs(tg.x - x) > 24 ? Math.sign(tg.x - x) * 260 : 0); }
        else if (!e.marked) { b.setVelocityX(0); e.marked = true; e.tele = true; const xs = rage ? [-180, -90, 0, 90, 180] : [-90, 0, 90]; e.pxs = xs.map(d => { const px = Phaser.Math.Clamp(x + d, a.x0 + 30, a.x1 - 30); return [px, this.surfaceBelow(px, y - 20, floorY)]; }); e.pxs.forEach(([px, sy]) => this.spawnProj('mark', px, sy - 6, 0, 0, 0.9)); }
        else if (!e.erupted && e.t > 2.2) { e.erupted = true; e.tele = false; e.pxs.forEach(([px, sy]) => this.spawnProj('pillar', px, sy - 72, 0, 0, 0.5)); this.cameras.main.shake(160, 0.006); e.spr.setAlpha(1); e.shield = false; }
        else if (e.t > (rage ? 3.2 : 3.6)) { e.marked = false; e.erupted = false; e.shield = false; e.spr.setAlpha(1); done(0.8); }
        break;
      case 'melt': // Madre Moho: se diluye tras cada ataque, se arrastra cerca del jugador, se regenera y vuelve a atacar
        if (e.t < 0.7) { e.melt = true; e.tele = false; b.setVelocityX(0); e.spr.setAlpha(Math.max(0.2, 1 - e.t * 1.2)); if (!e.meltFx) { e.meltFx = true; this.poof(x, y + 20, 10, 0x6fbf4a); } }
        else if (e.t < 1.9) {
          if (e.dest === undefined) e.dest = Phaser.Math.Clamp(tg.x + (Math.random() < 0.5 ? -1 : 1) * Phaser.Math.Between(110, 170), a.x0 + 60, a.x1 - 60);
          e.spr.setAlpha(0.25); const dx = e.dest - x; b.setVelocityX(Math.abs(dx) > 12 ? Math.sign(dx) * 300 : 0);
          if (Math.random() < 0.4) this.poof(x, y + 28, 1, 0x3f7a3a);
        } else if (!e.regen) { e.regen = true; b.setVelocityX(0); e.tele = true; this.poof(x, y, 16, 0x8fd35a); }
        else if (e.t < 2.6) e.spr.setAlpha(0.25 + (e.t - 1.9) / 0.7 * 0.75);
        else { e.melt = false; e.tele = false; e.dest = undefined; e.regen = false; e.meltFx = false; e.spr.setAlpha(1); e.act = null; e.cd = rage ? 0.25 : 0.4; }
        break;
      case 'cataclysm': // Madre Moho al 50 %: lluvia de esporas por toda la sala
        b.setVelocityX(0);
        if (!e.fired) { e.fired = true; e.armor = tgs.length >= 3 ? 2 : 1; this.cameras.main.shake(300, 0.01); this.poof(x, y, 18, 0x8fd35a); }
        if (e.t < 1.4) e.tele = true;
        else {
          e.tele = false;
          const tot = e.special === 2 ? 22 : 16; // la segunda lluvia (al 25 %) es más densa
          if (e.n < tot && e.t > 1.4 + e.n * 0.2) { const pr = this.spawnProj('spore', Phaser.Math.Between(a.x0 + 40, a.x1 - 40), a.y0 + 16, 0, 150, 5); pr.brake = 1.5; pr.homing = 34; e.n++; }
          else if (e.n >= tot && e.t > 1.4 + tot * 0.2 + 0.8) { ring(12, 120, 0); done(1.4); }
        }
        break;
      case 'brood': // brote de hongos
        b.setVelocity(0, 0); e.tele = e.t < 0.8;
        if (e.t > 0.8) { summon(e.type === 'madre' ? 3 : 2); e.summonCd = 16; done(1.2); }
        break;
      case 'bloom': // Madre: anillos de esporas
        b.setVelocity(0, 0);
        if (e.t < 1.0) e.tele = true;
        else if (!e.fired) { e.tele = false; ring(8, 90, 0); e.fired = true; e.n = 0; }
        else if (e.n === 0 && e.t > 2.1) { ring(8, 130, Math.PI / 8); e.n = 1; }
        else if (e.n === 1 && e.hp < e.max * 0.25 && e.t > 2.8) { ring(8, 110, Math.PI / 16); e.n = 2; }
        else if (e.t > 3.2) { e.fired = false; done(1.2); }
        break;
      case 'rootwave': { // Madre: olas de raíces por el suelo
        b.setVelocity(0, 0);
        if (e.t < 0.7) { e.tele = true; if (e.t < 0.1) this.cameras.main.shake(300, 0.004); }
        else { e.tele = false; const sy = this.surfaceBelow(x, y, floorY), sp = rage ? 280 : 220;
          const wave = () => { for (const s2 of [-1, 1]) { const pr = this.spawnProj('rootwave', x + s2 * 50, sy - 14, s2 * sp, 0, 3); pr.ground = true; } };
          if (!e.fired) { wave(); e.fired = true; } else if (rage && !e.second && e.t > 1.5) { wave(); e.second = true; } else if (e.t > 2.4) { e.fired = false; e.second = false; done(1.3); } }
        break; }
      case 'slap': // Madre: zarpazo a los que se pegan a ella
        b.setVelocity(0, 0);
        if (e.t < 0.5) e.tele = true; else if (!e.fired) { e.tele = false; for (const s2 of [-1, 1]) this.spawnProj('lash', x + s2 * 100, y + 30, 0, 0, 0.25); e.fired = true; this.cameras.main.shake(140, 0.005); } else if (e.t > 1.1) { e.fired = false; done(0.9); }
        break;
      case 'summon':
        b.setVelocity(0, 0); e.tele = e.t < 0.6;
        if (e.t > 0.6) { summon(e.type === 'conde' ? 3 : 2); e.summonCd = 14; done(1.2); }
        break;
    }
  }

  // ===================================================== instantáneas (clientes)
  onSnap(s) {
    if (this.isHost) return;
    const seen = new Set();
    s.e.forEach(([id, type, x, y, hp, max, flip, flags, name]) => {
      seen.add(id);
      let e = this.ents.get(id);
      if (!e) { e = this.createEnt(id, type, x, y, false); }
      e.tx = x; e.ty = y; e.spr.setFlipX(!!flip);
      if (hp < e.hp) { e.flash = 0.12; e.spr.setTintFill(0xffffff); }
      e.hp = hp; e.max = max; e.aggro = !!(flags & 1); e.tele = !!(flags & 2); e.shield = !!(flags & 4); e.melt = !!(flags & 16); if (e.type === 'madre') e.spr.setAlpha(e.melt ? 0.3 : 1); if (e.cfg.rez) e.spr.setAngle(e.shield ? 90 : 0);
      if ((flags & 8) && !e.elite) this.makeElite(e, { name }); if (name) e.name = name;
    });
    this.ents.forEach((e, id) => { if (!seen.has(id)) { this.poof(e.spr.x, e.spr.y, e.boss ? 18 : 6); e.spr.destroy(); this.ents.delete(id); } });
    const ps = new Set();
    s.p.forEach(([id, type, x, y]) => {
      ps.add(id);
      let p = this.projs.get(id);
      if (!p) { const c = PR[type]; p = { id, type, spr: this.add.sprite(x, y, c.tex).setScale(c.sc).setDepth(7).setTint(c.tint || 0xffffff).setAlpha(c.alpha || 1), tx: x, ty: y }; this.projs.set(id, p); if (type === 'inferno') { this.fireBurst(x, y); SFX.boss(); } }
      p.tx = x; p.ty = y;
    });
    this.projs.forEach((p, id) => { if (!ps.has(id)) { if (p.type === 'shroomb') { this.shroomBurst(p.spr.x, p.spr.y); SFX.hit(); } p.spr.destroy(); this.projs.delete(id); } });
    this.sealKey = s.s; this.applySeal(s.s); this.applyFloorState(s.f || 0);
  }

  // ===================================================== jugador
  slashFx(x, y, dir) {
    const s = this.add.image(x + dir * 34, y - 2, 'slash').setScale(2).setFlipX(dir < 0).setDepth(9).setAlpha(0.9).setTint(0xff5a78);
    this.tweens.add({ targets: s, alpha: 0, scale: 2.6, duration: 160, onComplete: () => s.destroy() });
  }
  hurt(dmg, fromX) {
    if (this.invuln > 0 || this.dead || this.dashT > 0) return;
    this.hp -= dmg; this.invuln = 1.2; this.stun = 0.25; SFX.hurt();
    const b = this.player.body; b.setVelocity((this.player.x < fromX ? -1 : 1) * 240, -260);
    this.cameras.main.shake(140, 0.008);
    if (this.hp <= 0) this.die();
  }
  die() {
    this.dead = true; this.deadT = 2.8; this.hp = 0; this.player.setAlpha(0.2); this.player.body.setVelocity(0, 0); this.player.body.setAllowGravity(false);
    this.poof(this.player.x, this.player.y, 12, 0xff4444); this.centerTxt.setText('Has caído...');
  }
  respawn() {
    this.dead = false; this.hp = this.maxHp; this.invuln = 2; this.player.setAlpha(1).setPosition(this.lastAltar.x, this.lastAltar.y - 21);
    this.player.body.setAllowGravity(true); this.player.body.setVelocity(0, 0); this.centerTxt.setText(''); this.lastGround = { x: this.player.x, y: this.player.y };
  }

  update(time, delta) {
    if (!this.player) return;
    const dt = Math.min(delta / 1000, 0.05), K_ = this.keys, p = this.player, b = p.body;
    const inp = this.readInput(K_);

    // ---- jugador
    this.playerStep(dt, time, inp);
    this.tag.setPosition(p.x, p.y - 34);

    // ---- zona actual y mapa
    const ar = this.W.areaOf(Math.floor(p.x / T), Math.floor(p.y / T));
    if (ar && ar.id !== this.myArea) { this.myArea = ar.id; this.markVisited(ar); this.banner(`${World.ZONES[ar.z]} — ${ar.name}`); Music.setZone(ar.z);
      const pbr = this.progress.bosses; // aviso antes de elegir rival (decisión irreversible)
      if ((ar.id === 'albaA' || ar.id === 'albaB') && !pbr.includes('aurora') && !pbr.includes('vesper')) this.toast(ar.id === 'albaA' ? 'Cámara de Aurora: si la vences, Vesper se la llevará y no podrás enfrentarte a él. Premio: Alas del Alba (planear).' : 'Cámara de Vesper: si lo vences, Aurora se lo llevará y no podrás enfrentarte a ella. Premio: Ojo de la Noche y el Santuario de las Sombras.', 9000); }
    this.mmT -= dt;
    if (this.mmT <= 0 || this.showMap) { this.mmT = 0.2; this.updateMaps(); }
    if (inp.mapPress) {
      this.showMap = !this.showMap;
      [this.bigBg, this.bigImg, this.bigTitle, this.bigStats].forEach(o => o.setVisible(this.showMap));
      [this.mmBg, this.mmImg, this.mmDots].forEach(o => o.setVisible(!this.showMap));
      this.bigDots.clear(); this.updateMaps();
    }
    this.drawHearts();
    this.updateExtraHud();
    this.drawDark(time);
    this.updateObjective(dt);

    // ---- red: enviar estado
    this.sendT = (this.sendT || 0) - dt;
    if (this.sendT <= 0) { this.sendT = 0.05; socket.volatile.emit('state', { x: Math.round(p.x), y: Math.round(p.y), f: this.facing < 0, hp: this.hp, mx: this.maxHp, a: this.atkT > 0, d: this.dashT > 0, c: this.crouching, dead: this.dead }); }

    // ---- remotos (interpolación)
    Object.values(this.remotes).forEach(r => {
      r.spr.x += (r.tx - r.spr.x) * 0.35; r.spr.y += (r.ty - r.spr.y) * 0.35; r.tag.setPosition(r.spr.x, r.spr.y - 34);
      r.moveT = Math.max(0, (r.moveT || 0) - dt);
      const key = 'hero_' + r.color + (r.crouch ? '_crouch' : (r.moveT > 0 ? (((time / 120) | 0) % 2 ? '_w1' : '_w2') : ''));
      if (r.curTex !== key) { r.curTex = key; r.spr.setTexture(key); }
    });

    // ---- entidades
    if (this.isHost) this.simUpdate(dt);
    else {
      this.ents.forEach(e => { e.spr.x += (e.tx - e.spr.x) * 0.4; e.spr.y += (e.ty - e.spr.y) * 0.4; if (e.flash > 0) { e.flash -= dt; if (e.flash <= 0) this.clearFlash(e); } if (e.type === 'bat') e.spr.setTexture(((time / 125) | 0) % 2 ? 'bat1' : 'bat2'); if (e.type === 'gh') e.spr.setAlpha(0.65 + Math.sin(time / 330 + e.spr.x) * 0.25); });
      this.projs.forEach(pr => { pr.spr.x += (pr.tx - pr.spr.x) * 0.5; pr.spr.y += (pr.ty - pr.spr.y) * 0.5; });
    }
    this.ents.forEach(e => { if (e.type === 'saw') e.spr.angle += 520 * dt; });
    let boss = null;
    this.ents.forEach(e => { if (e.boss && e.aggro) boss = e; if (e.boss) { if (e.tele) e.spr.setTint(0xff7777); else if (e.shield) e.spr.setTint(0x8fc8ff); else if (e.flash <= 0) e.spr.clearTint(); } });
    this.bossBar.clear(); Music.setBossKind(boss ? (['aurora', 'archon', 'clock'].includes(boss.type) ? 1 : ['vesper', 'reina', 'conde'].includes(boss.type) ? 2 : 0) : 0); Music.setBoss(!!boss);
    if (boss) {
      this.bossBar.fillStyle(0x000000, 0.7).fillRect(SW / 2 - 202, SH - 56, 404, 14).fillStyle(boss.type === 'madre' && boss.melt ? 0x6a6a7a : boss.type === 'madre' && boss.shield ? 0x4a8fd0 : 0xcc2233, 1).fillRect(SW / 2 - 200, SH - 54, 400 * Math.max(0, boss.hp / boss.max), 10);
      if (boss.type === 'madre' && (boss.shield || boss.melt)) this.bossBar.lineStyle(2, 0x8fc8ff, 1).strokeRect(SW / 2 - 203, SH - 57, 406, 16); // marco azul: armadura de raíces
      this.bossName.setText((boss.name || '') + (boss.prize ? '  ·  premio: ' + boss.prize.split(':')[0] : '') + (boss.type === 'madre' ? (boss.melt ? '  ·  DILUIDA: intocable' : boss.shield ? '  ·  ARMADURA: rómpela con el Pisotón (en el aire, mantén ↓)' : '  ·  ¡SIN ARMADURA! ¡atácala!') : ''));
    } else this.bossName.setText('');
    // cerrar el cliente si la sala termina tras la victoria
    if (this.won && !this.wonT) this.wonT = time;
  }

  nearSpikes() { return this.spikeScan(14); }
  spikesTouch() { return this.spikeScan(-2); }
  spikeScan(pad) {
    const p = this.player, hw = 15 + pad, hh = 19 + pad;
    for (let wy = p.y - hh; wy <= p.y + hh; wy += 14) for (let wx = p.x - hw; wx <= p.x + hw; wx += 15) {
      const t = this.fg.getTileAtWorldXY(wx, wy);
      if (t && t.index >= 0 && t.index % 8 === K.SPIKES) return true;
    }
    return false;
  }
  doAttack() {
    const p = this.player, f = this.facing, bx = p.x + f * 30, by = p.y - 2, bw = 62, bh = 46;
    this.ents.forEach(e => {
      if (e.dead || this.swingHit.has(e.id)) return;
      if (e.boss && !e.aggro && !this.isHost) { /* la lucha empieza al entrar */ }
      const [ex, ey, ew, eh] = this.entBox(e);
      if (rectsOverlap(bx, by, bw, bh, ex, ey, ew, eh)) {
        this.swingHit.add(e.id); SFX.hit();
        if (!this.dead && this.hp < this.maxHp && Math.random() < 0.25) { this.hp = Math.min(this.maxHp, this.hp + (e.boss ? 0.25 : 0.5)); this.poof(p.x, p.y - 10, 3, 0xff3b5c); }
        if (this.isHost) this.damageEnt(e, 1, f); else socket.emit('hit', { id: e.id, dmg: 1, dir: f });
        e.flash = 0.1; e.spr.setTintFill(0xffffff);
        this.poof(ex, ey, 3, 0xffe9a0);
      }
    });
    // paredes rompibles
    for (let wy = by - bh / 2; wy <= by + bh / 2; wy += 16) for (let wx = bx - bw / 2; wx <= bx + bw / 2; wx += 16) {
      const t = this.fg.getTileAtWorldXY(wx, wy);
      if (t && t.index >= 0 && t.index % 8 === K.CRACK) { this.fg.removeTileAt(t.x, t.y); this.wallBroken(t.x, t.y); socket.emit('broke', { gx: t.x, gy: t.y }); this.poof((t.x + 0.5) * T, (t.y + 0.5) * T, 6, 0xaaaaaa); SFX.hit(); }
    }
  }
  contact() {
    const p = this.player, pw = 26, ph = 36;
    this.ents.forEach(e => {
      if (e.dead || (e.boss && !e.aggro)) return;
      const [ex, ey, ew, eh] = this.entBox(e);
      if (rectsOverlap(p.x, p.y, pw, ph, ex, ey, ew, eh)) this.hurt(e.cfg.dmg, ex);
    });
    this.projs.forEach((pr, id) => {
      if (this.hurtProjs.has(id)) return;
      const c = PR[pr.type];
      if (rectsOverlap(p.x, p.y, pw, ph, pr.spr.x, pr.spr.y, c.hb[0], c.hb[1]) && this.invuln <= 0 && this.dashT <= 0) { if (!c.linger) this.hurtProjs.add(id); this.hurt(c.dmg, pr.spr.x); }
    });
    if (this.hurtProjs.size > 200) this.hurtProjs.clear();
  }
  pickups() {
    const p = this.player;
    this.altars.forEach(a => {
      if (false) {
        if (this.curAltar !== a.id) { this.curAltar = a.id; this.lastAltar = { x: a.x, y: a.y }; this.hp = this.maxHp; this.toast('Altar activado: vida restaurada'); SFX.altar(); this.poof(a.x, a.y - 30, 8, 0xffd23b); }
      } else if (this.curAltar === a.id) this.curAltar = null;
    });
    this.crystals.forEach(c => {
      if (this.cryGot.has(c.id)) return;
      if (Math.abs(p.x - c.x) < 28 && Math.abs(p.y - c.y) < 36) { this.cryGot.add(c.id); c.spr.setVisible(false); this.maxHp++; this.hp = this.maxHp; this.toast('¡Cristal de vida! +1 corazón máximo'); SFX.pick(); this.autoSave(); }
    });
    Object.values(this.relics).forEach(r => {
      if (Math.abs(p.x - r.x) < 34 && Math.abs(p.y - r.y) < 44 && !r.taken) { r.taken = true; this.grantAbility(r.ability); }
    });
  }
}

show('auth');
