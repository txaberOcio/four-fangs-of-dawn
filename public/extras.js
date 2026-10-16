/* Extras del juego: armas y mejoras, pasivas, agacharse, almas, objetos, tienda, NPC y controles táctiles.
   Se carga después de game.js y añade/sustituye métodos de CastleScene. */

// ---------- Datos ----------
const IS_TOUCH = (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) || (navigator.maxTouchPoints || 0) > 0;
if (IS_TOUCH) document.body.classList.add('touchdev');

const WEAPONS = {
  red: { name: 'Espada', kind: 'melee', fx: 'slash', fxScale: 2, tint: 0xff5a78, off: 30, h: 46, act: 0.16,
    lv: [{ dmg: 1, w: 62, cd: 0.32 }, { dmg: 1, w: 72, cd: 0.30 }, { dmg: 2, w: 72, cd: 0.30 }, { dmg: 2, w: 84, cd: 0.26 }, { dmg: 3, w: 90, cd: 0.26 }] },
  blue: { name: 'Lanza', kind: 'melee', fx: 'spear', fxScale: 2.2, tint: 0x9fd4ff, off: 56, h: 26, act: 0.14,
    lv: [{ dmg: 1, w: 104, cd: 0.44 }, { dmg: 1, w: 120, cd: 0.40 }, { dmg: 2, w: 120, cd: 0.40 }, { dmg: 2, w: 140, cd: 0.36 }, { dmg: 3, w: 150, cd: 0.34 }] },
  green: { name: 'Arco', kind: 'ranged', fx: 'arrow', tint: 0xb8ff9a,
    lv: [{ dmg: 1, cd: 0.45, n: 1, range: 360 }, { dmg: 1, cd: 0.40, n: 1, range: 440 }, { dmg: 1, cd: 0.40, n: 2, range: 440 }, { dmg: 2, cd: 0.36, n: 2, range: 520 }, { dmg: 2, cd: 0.30, n: 3, range: 560 }] },
  purple: { name: 'Guadaña', kind: 'melee', fx: 'slash', fxScale: 3.2, tint: 0xc07aff, off: 26, h: 74, act: 0.22,
    lv: [{ dmg: 2, w: 92, cd: 0.62 }, { dmg: 2, w: 102, cd: 0.56 }, { dmg: 3, w: 102, cd: 0.56 }, { dmg: 3, w: 114, cd: 0.50 }, { dmg: 4, w: 124, cd: 0.50 }] },
};
const PASSIVES = {
  red: { name: 'Sed de sangre', life: 0.40 },
  blue: { name: 'Visión nocturna', aura: 1.8, projPlus: 1 },          // desventaja: +1 daño de proyectiles
  green: { name: 'Cazadora de almas', souls: 1.5, dmgTaken: 1.5 },    // desventaja: +50% daño recibido y sin romper muros
  purple: { name: 'Piel de sombra', hp: 2, speed: 0.82 },             // desventaja: más lento
};
// need = jefes derrotados necesarios para que el mercader lo venda
const ITEMS = [
  { id: 'pot', need: 0, tier: 0, name: 'Poción de sangre', price: 30, desc: 'Cura 3 corazones.' },
  { id: 'spd', need: 0, tier: 1, name: 'Elixir de velocidad', price: 40, desc: '+35% de velocidad durante 20 s.' },
  { id: 'lamp', need: 0, tier: 1, name: 'Aceite de linterna', price: 35, desc: 'Tu luz crece durante 60 s.' },
  { id: 'bomb', need: 0, tier: 0, name: 'Bomba de mano', price: 25, desc: 'Explota a los 1,3 s: rompe muros agrietados y daña enemigos.' },
  { id: 'pot2', need: 1, tier: 1, name: 'Poción mayor', price: 75, desc: 'Cura toda la vida.' },
  { id: 'str', need: 1, tier: 2, name: 'Elixir de fuerza', price: 60, desc: '+1 de daño durante 25 s.' },
  { id: 'ward', need: 1, tier: 2, name: 'Piel de piedra', price: 55, desc: 'Bloquea los próximos 2 golpes.' },
  { id: 'amu', need: 2, tier: 2, name: 'Amuleto de resurrección', price: 120, desc: 'Si mueres, revives (se gasta solo).' },
  { id: 'rage', need: 2, tier: 2, name: 'Elixir de furia', price: 70, desc: 'Atacas un 40% más rápido durante 20 s.' },
  { id: 'tonic', need: 2, tier: 2, name: 'Tónico de almas', price: 80, desc: 'Doble de almas durante 60 s.' },
  { id: 'fruit', need: 3, tier: 2, name: 'Fruto de sangre', price: 200, desc: '+1 corazón máximo para siempre.' },
];
// nivel de cada mercader según su sala
const SHOP_TIER = { vest: 0, naveS: 1, mir: 2 };
// ---------- Bestiario y diarios ----------
const BESTIARY = {
  sk: { name: 'Esqueleto', text: 'Soldados de la guardia caídos. Patrullan y, si te ven cerca, te persiguen. Son débiles pero muchos.', tip: 'Un par de golpes bastan.' },
  kn: { name: 'Caballero maldito', text: 'Armaduras vacías que aún obedecen al Conde. Lentos y pesados, golpean fuerte.', tip: 'Golpea y retrocede; no te quedes pegado.' },
  bat: { name: 'Murciélago', text: 'Duermen en las bóvedas hasta que alguien se acerca. Temen la luz de las antorchas.', tip: 'Enciende antorchas (E) para mantenerlos a raya.' },
  gh: { name: 'Fantasma', text: 'Almas penitentes que atraviesan los muros. No ven a quien está bajo la luz.', tip: 'Quédate junto a una antorcha o una hoguera.' },
  saw: { name: 'Sierra de raíl', text: 'Maquinaria de la Galería y de la Torre. Va y viene por su raíl y nada la detiene.', tip: 'Invulnerable: aprende su ritmo, salta o usa el impulso.' },
  sentinel: { name: 'Centinela', text: 'Armadura sin alma que patrulla sin descanso. Ningún arma le hace daño.', tip: 'Invulnerable: esquívalo, no lo persigas.' },
  garg: { name: 'Gárgola de Piedra', text: 'Guardiana del primer umbral. Llora piedra y salta sobre quien se atreve a entrar. Su corazón guarda el Impulso.', tip: 'Salta sus ondas y golpéala tras su embestida.' },
  bishop: { name: 'Obispo Caído', text: 'Rezaba por el castillo hasta que la sangre le respondió. Se teletransporta y lanza oraciones en abanico. Guarda el Doble salto.', tip: 'Flota a baja altura: ataca mientras se materializa.' },
  clock: { name: 'Guardián del Reloj', text: 'Engranaje viviente que se protege con la luz. Guarda el Salto de pared.', tip: 'Apaga sus antorchas con E y atácalo a oscuras.' },
  conde: { name: 'El Conde', text: 'Señor del castillo. Rompe el suelo de su trono para enterrar a sus cazadores en el foso, y alza pilares de sangre.', tip: 'Vigila las marcas rojas del suelo: son pilares que se alzarán.' },
};
const PAGES = {
  corr: { title: 'Diario del Capitán', text: 'Cuando el Conde cerró las puertas ordené sellar el pasillo bajo la galería. Mis hombres se quedaron de pie, vacíos, esperando una orden que nunca llegó. Yo sigo vigilando.' },
  lect: { title: 'Notas del Archivista', text: 'Los libros pidieron sangre y se la dimos. Ahora susurran. Escribí todo lo que dicen hasta que mis ojos se quedaron entre las páginas.' },
  caden: { title: 'Carta del Carcelero', text: 'Las cadenas ya no sujetan a nadie: el Conde soltó a los presos y nos encadenó a nosotros. Las sierras no se detienen jamás; aprende su compás o no pases.' },
  naveP: { title: 'Plegaria del Obispo', text: 'Padre nuestro que estás en los cielos... responde al revés. Subo al Ábside cada noche para escucharle. Anoche contestó con mi propia voz.' },
  galeria: { title: 'Cuaderno del Relojero', text: 'Los engranajes no descansan. Las sierras recorren su raíl y los centinelas mis pasillos. Construí el reloj para detener el tiempo; él me detuvo a mí.' },
  pasR: { title: 'Última carta del Conde', text: 'Cuatro cazadores vendrán, con mi misma sangre y mi misma sed. Abriré el suelo bajo mi trono y los enterraré con mis hijos. Quizá, al fin, alguien me detenga.' },
};
const SOULS = { sk: 3, kn: 8, bat: 1, gh: 4, garg: 60, bishop: 80, clock: 100, conde: 200 };
const NPC_DEFS = {
  merchant: { name: 'Mercader', tex: 'npc_merchant', shop: true, lines: [['Almas, almas... Las prefiero a las monedas. Mira lo que tengo.']] },
  archivist: { name: 'Archivista Loco', tex: 'npc_archivist', lines: [
    ['¡Shhh! ¡Los libros susurran! Dicen tu nombre... ¿o era el mío?',
      'Las paredes agrietadas... ¡golpéalas, golpéalas! Detrás siempre hay algo que brilla.',
      'Bajo la Escalera de los Retratos hay una sala que no existe. Búscala a la izquierda, abajo del todo.',
      'Y hay un túnel tan bajo que solo lo cruza quien se arrodilla. ¡Abajo, abajo, pulsa abajo!',
      'Ah, y el Guardián del Reloj: la luz lo protege como una armadura. ¡Apaga sus antorchas con E y atácalo a oscuras!'],
    ['¿Me has visto los ojos? Los dejé entre los libros.',
      'Las antorchas... ¡enciéndelas con E! Los fantasmas no ven en la luz. ¡Y los murciélagos la odian!'],
    ['El Conde cuenta las páginas de noche. Yo cuento las suyas. ¡Cuarenta y dos! ¡No, cuarenta y tres!',
      'Cuidado con los espejos. No tienen reflejo y aun así te miran.'] ] },
  prisoner: { name: 'Prisionero Enloquecido', tex: 'npc_prisoner', lines: [
    ['¡¡Llevo cien años mirando la misma pared!! ¿Tú también la oyes? Dice... dice cosas.',
      'La Gárgola ya no ríe, ahora llora piedra. Si la vences te dará el Impulso: pulsa C y cruzarás abismos.',
      'En la Mazmorra de Hierro hay un cristal más alto de lo que se salta. Hace falta un segundo aire.',
      'Aquí las antorchas están apagadas... ¡enciéndelas con E! La oscuridad tiene dientes.'],
    ['Ellos dicen que estoy loco. ¡Yo digo que estoy aquí! ¿Dónde? Aquí. Eso creo.',
      '¿Tienes almas de sobra? El mercader vende pociones... a mí me vendió una sonrisa.'],
    ['Me quitaron la cama, luego el suelo, luego el techo. Solo queda el ruido.',
      'Si ves un fantasma, no lo mires a los ojos. Mira la luz.'] ] },
  monk: { name: 'Monje Trastornado', tex: 'npc_monk', lines: [
    ['¡Hermano, hermano! El Obispo reza al revés... ¡y su dios responde al derecho!',
      'Arriba, en el Ábside, espera. La Nave tiene un hueco enorme: el primer escalón está lejos. Necesitas el Impulso: C en el aire.',
      'Cuando él caiga te dará alas dobles. Con ellas cruzarás el Mirador.',
      '¿Oyes campanas? Yo también. No hay campanas.'],
    ['Mi hermana era la Gárgola... o la Gárgola era mi hermana. Piedra y carne se parecen tanto de noche.',
      'Este altar te cura y te guarda. Úsalo, hijo mío, antes de que el cielo se caiga.'],
    ['Reza conmigo: ¡Aaaaa-men! ¡Aaaaa-men! ¡¡Aaaaa-menos vida!!'] ] },
};

// ---------- Controles táctiles ----------
const touch = { left: false, right: false, down: false, jump: false };
const touchPulse = {};
const touchJust = k => { const v = touchPulse[k]; touchPulse[k] = false; return !!v; };
let touchRoot = null, touchOn = false;
function setupTouch(on) {
  if (!IS_TOUCH) return;
  touchOn = on;
  const k = Math.min(1, Math.max(0.62, window.innerHeight / 480)); // escala para pantallas bajas
  if (!touchRoot || touchRoot.dataset.k !== String(k)) {
    if (touchRoot) touchRoot.remove();
    touchRoot = document.createElement('div'); touchRoot.id = 'touch'; touchRoot.dataset.k = String(k);
    ['contextmenu', 'selectstart', 'dragstart', 'gesturestart'].forEach(ev => touchRoot.addEventListener(ev, e2 => e2.preventDefault()));
    ['touchstart', 'touchmove'].forEach(ev => touchRoot.addEventListener(ev, e2 => e2.preventDefault(), { passive: false }));
    const px = v => Math.round(v * k) + 'px';

    // ---- cruceta de arrastre: ▲ salta, ▼ agacha, ◀ ▶ mueven; se puede deslizar el dedo y combinar diagonales
    const W = 250, pad = document.createElement('div'); pad.className = 'dpad';
    pad.style.cssText = 'left:' + px(14) + ';bottom:' + px(14) + ';width:' + px(W) + ';height:' + px(W) + ';';
    const arrows = {};
    [['up', '▲', 'left:50%;top:2%;transform:translateX(-50%);'], ['down', '▼', 'left:50%;bottom:2%;transform:translateX(-50%);'],
      ['left', '◀', 'left:2%;top:50%;transform:translateY(-50%);'], ['right', '▶', 'right:2%;top:50%;transform:translateY(-50%);']].forEach(([n, ch, css]) => {
      const el = document.createElement('div'); el.className = 'da'; el.textContent = ch; el.style.cssText = css + 'font-size:' + Math.round(44 * k) + 'px;'; pad.appendChild(el); arrows[n] = el;
    });
    const setDir = (l, r, u, d) => {
      if (u && !touch.jump) touchPulse.jump = true; // pulsación nueva de salto
      touch.left = l; touch.right = r; touch.jump = u; touch.down = d;
      arrows.left.classList.toggle('on', l); arrows.right.classList.toggle('on', r); arrows.up.classList.toggle('on', u); arrows.down.classList.toggle('on', d);
    };
    const upd = e => {
      const rc = pad.getBoundingClientRect(), dx = e.clientX - (rc.left + rc.width / 2), dy = e.clientY - (rc.top + rc.height / 2), dz = rc.width * 0.13;
      setDir(dx < -dz, dx > dz, dy < -dz * 1.15, dy > dz * 1.15);
    };
    let padPid = null; // dedo que controla la cruceta
    pad.addEventListener('pointerdown', e => { e.preventDefault(); padPid = e.pointerId; try { pad.setPointerCapture(e.pointerId); } catch (_) { /* ok */ } pad.classList.add('on'); upd(e); });
    pad.addEventListener('pointermove', e => { if (padPid === e.pointerId) { e.preventDefault(); upd(e); } });
    const rel = e => { e.preventDefault(); if (padPid !== null && padPid !== e.pointerId) return; padPid = null; pad.classList.remove('on'); setDir(false, false, false, false); };
    pad.addEventListener('pointerup', rel); pad.addEventListener('pointercancel', rel); pad.addEventListener('lostpointercapture', rel);
    touchRoot.appendChild(pad);

    // ---- botones de acción (grandes)
    const defs = [
      ['attack', '⚔', { r: 18, b: 22 }, 104], ['dash', '»', { r: 138, b: 34 }, 82],
      ['interact', 'E', { r: 28, b: 140 }, 76], ['item', '🧪', { r: 124, b: 126 }, 70], ['cycle', '⟳', { r: 228, b: 46 }, 62],
      ['map', '🗺', { r: 14, t: 118 }, 58], ['book', '📖', { r: 14, t: 186 }, 50],
    ];
    defs.forEach(([key, label, pos, size]) => {
      const b = document.createElement('button'); b.className = 'tb'; b.innerHTML = '<span class="tl">' + label + '</span>'; b.draggable = false;
      b.style.cssText = Object.entries(pos).map(([p, v]) => ({ l: 'left', r: 'right', t: 'top', b: 'bottom' }[p]) + ':' + px(v)).join(';') + ';width:' + px(size) + ';height:' + px(size) + ';font-size:' + Math.round(30 * k) + 'px;';
      const press = e => { e.preventDefault(); touch[key] = true; touchPulse[key] = true; try { b.setPointerCapture(e.pointerId); } catch (_) { /* ok */ } b.classList.add('on'); };
      const release = e => { e.preventDefault(); touch[key] = false; b.classList.remove('on'); };
      b.addEventListener('pointerdown', press); b.addEventListener('pointerup', release); b.addEventListener('pointercancel', release); b.addEventListener('lostpointercapture', release);
      touchRoot.appendChild(b);
    });
    const fsb = document.createElement('button'); fsb.className = 'tb'; fsb.textContent = '⛶'; fsb.style.cssText = 'left:calc(50% - 22px);top:4px;width:44px;height:44px;font-size:20px;';
    fsb.onclick = () => { const d = document.documentElement; (d.requestFullscreen || d.webkitRequestFullscreen || function () { }).call(d); };
    touchRoot.appendChild(fsb);
    document.body.appendChild(touchRoot);
  }
  touchRoot.style.display = on ? 'block' : 'none';
  document.body.classList.toggle('ingame', !!on);
}
window.addEventListener('resize', () => { if (touchOn) setupTouch(true); });

// ---------- Mando (PlayStation / estándar) ----------
// ✕ saltar · ◻ atacar · ○ impulso (o L2/R2) · △ interactuar · L1 cambiar objeto · R1 usar objeto · Options/Share mapa · cruceta o stick: mover/agacharse
const pad = { left: false, right: false, down: false, jump: false };
const padPrev = {};
function pollPad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let gp = null; for (const g of pads) if (g && g.connected) { gp = g; break; }
  if (!gp) { pad.left = pad.right = pad.down = pad.jump = false; for (const k in padPrev) padPrev[k] = false; return { edge: {} }; }
  const b = i => !!(gp.buttons[i] && gp.buttons[i].pressed), ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
  const cur = { left: b(14) || ax < -0.45, right: b(15) || ax > 0.45, down: b(13) || ay > 0.6, up: b(12) || ay < -0.6, jump: b(0), attack: b(2),
    dash: b(1) || b(6) || b(7), interact: b(3), item: b(5), cycle: b(4), map: b(8) || b(9), back: b(1), book: b(10) || b(11) };
  const edge = {}; for (const k in cur) edge[k] = cur[k] && !padPrev[k];
  Object.assign(padPrev, cur);
  pad.left = cur.left; pad.right = cur.right; pad.down = cur.down; pad.jump = cur.jump;
  return { cur, edge };
}
window.addEventListener('gamepadconnected', e => {
  const sc = typeof game !== 'undefined' && game && game.scene && game.scene.scenes[0];
  if (sc && sc.toast) sc.toast('Mando conectado: ✕ saltar · ◻ atacar · ○ impulso · △ interactuar · L1/R1 objetos', 6000);
});

// ---------- Métodos de la escena ----------
const _hurt = CastleScene.prototype.hurt, _die = CastleScene.prototype.die, _respawn = CastleScene.prototype.respawn, _kill = CastleScene.prototype.killEnt, _pick = CastleScene.prototype.pickups;
Object.assign(CastleScene.prototype, {
  // ---- inicio
  initExtras() {
    const w = this.W;
    this.wpn = WEAPONS[this.color] || WEAPONS.red; this.pas = PASSIVES[this.color] || {}; this.wlv = 1;
    this.maxHp = 5 + (this.pas.hp || 0); this.hp = this.maxHp;
    this.souls = 0; this.inv = {}; ITEMS.forEach(i => { this.inv[i.id] = 0; }); this.ward = 0; this.selItem = 0; this.buffs = { spd: 0, str: 0, lamp: 0, rage: 0, tonic: 0 };
    this.crouching = false; this.arrows = []; this.forgeGot = new Set(); this.shopOpen = false; this.dlg = null; this.shopSel = 0;
    this.kills = {}; this.seen = new Set(); this.eliteGot = new Set(); this.pagesGot = new Set(); this.bookOpen = false; this.bookSel = 0; this.expT = 0;
    this.pageObjs = w.pages.map(pg => {
      const spr = this.add.image(pg.x, pg.y, 'page').setScale(2.4).setDepth(2);
      const glow = this.add.image(pg.x, pg.y, 'glow').setScale(0.9).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.45).setDepth(1).setVisible(!LITE);
      this.tweens.add({ targets: [spr, glow], y: pg.y - 5, yoyo: true, repeat: -1, duration: 1100, ease: 'Sine.inOut' });
      return { ...pg, spr, glow };
    });
    this.forgeObjs = w.forges.map(f => {
      const spr = this.add.image(f.x, f.y, 'forge').setScale(2.6).setDepth(2);
      const glow = this.add.image(f.x, f.y, 'glow').setScale(1.1).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.55).setDepth(1).setVisible(!LITE);
      this.tweens.add({ targets: [spr, glow], y: f.y - 6, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.inOut' });
      return { ...f, spr, glow };
    });
    const nameStyle = { fontSize: '11px', fontFamily: 'Courier New', color: '#ffe9a0', stroke: '#000', strokeThickness: 3 };
    this.npcObjs = w.npcs.map(n => {
      const def = NPC_DEFS[n.type];
      const spr = this.add.image(n.x, n.y - 21, def.tex).setScale(3).setDepth(4);
      const name = this.add.text(n.x, n.y - 56, def.name, nameStyle).setOrigin(0.5).setDepth(27);
      return { ...n, def, spr, name, visits: 0 };
    });
    this.buildExtraHud(); this.buildShopUi(); this.buildDialogueUi(); this.buildBookUi();
    this.lastBonfire = this.altars.find(a => a.area === 'vest') || this.altars[0];
    this.canAuto = !!saveMe || !saves[this.color]; // evita pisar una partida guardada de este vampiro en una partida nueva
    if (saveMe) this.loadPersonal(saveMe);
    saveMe = null;
    const onRest = () => { if (this.isHost) this.restReset(); };
    socket.on('rest', onRest); this.events.once('shutdown', () => socket.off('rest', onRest));
    const onLoot = ({ amt, item, eid, bonus, kt }) => { if (amt) this.addSouls(amt, true); if (kt) this.registerKill(kt); if (eid) this.eliteReward(eid, { item, souls: bonus }); };
    socket.on('loot', onLoot); this.events.once('shutdown', () => socket.off('loot', onLoot));
    this.input.addPointer(2);
    this.time.delayedCall(14000, () => this.toast('Hogueras: pulsa E junto a una para descansar, guardar la partida y hacer reaparecer a los monstruos.', 7000));
  },
  // Recupera los datos personales de la partida guardada
  loadPersonal(m) {
    if (m.abil) { ['dash', 'dj', 'wj'].forEach(k => { this.abil[k] = !!m.abil[k]; }); this.syncRelics(); this.applyProgress(this.progress, true); }
    this.souls = m.souls | 0; ITEMS.forEach(i => { this.inv[i.id] = (m.inv && m.inv[i.id]) | 0; });
    this.wlv = Math.min(5, Math.max(1, m.wlv | 0)); this.maxHp = Math.max(this.maxHp, m.maxHp | 0); this.hp = this.maxHp;
    const visited = new Set(m.visited || []);
    (m.visited || []).forEach(id => { const ar = this.W.areas[id]; if (ar) this.markVisited(ar); });
    (m.elite || []).forEach(id => this.eliteGot.add(id)); (m.seen || []).forEach(id => this.seen.add(id)); this.kills = Object.assign({}, m.kills || {});
    (m.pages || []).forEach(id => { this.pagesGot.add(id); const pg = this.pageObjs.find(x => x.id === id); if (pg) { pg.spr.destroy(); pg.glow.destroy(); } });
    // objetos recogidos: si algún id antiguo ya no existe, se marcan como recogidos los primeros de las zonas visitadas
    const restore = (ids, list, apply) => {
      let lost = 0;
      (ids || []).forEach(id => { const o = list.find(x => x.id === id); if (o) apply(o); else lost++; });
      list.filter(o => visited.has(o.area) && !this.cryGot.has(o.id) && !this.forgeGot.has(o.id)).slice(0, lost).forEach(apply);
    };
    restore(m.cry, this.crystals, c => { this.cryGot.add(c.id); c.spr.destroy(); });
    restore(m.forge, this.forgeObjs, f => { this.forgeGot.add(f.id); f.spr.destroy(); f.glow.destroy(); });
    // hogueras encendidas y última hoguera (con alternativa si el id guardado ya no existe)
    let litAny = false;
    (m.lit || []).forEach(id => { const o = this.altars.find(x => x.id === id); if (o) { o.lit = true; this.bonfireLit.add(id); litAny = true; } });
    if (!litAny) this.altars.filter(o => visited.has(o.area)).forEach(o => { o.lit = true; this.bonfireLit.add(o.id); });
    let a = this.altars.find(x => x.id === m.altar);
    if (!a) { const cand = this.altars.filter(o => visited.has(o.area)); a = cand[cand.length - 1] || null; }
    if (a) { this.lastAltar = { x: a.x, y: a.y }; this.lastBonfire = a; this.player.setPosition(a.x, a.y - 21); this.lastGround = { x: a.x, y: a.y - 21 }; }
    this.rebuildLights();
    this.time.delayedCall(800, () => this.toast('Partida cargada desde tu última hoguera', 4000));
  },
  auraMul() { return (this.pas.aura || 1) * (this.buffs.lamp > 0 ? 1.7 : 1); },
  wstats() { return this.wpn.lv[Math.min(this.wlv, 5) - 1]; },
  dmgBonus() { return this.buffs.str > 0 ? 1 : 0; },

  // ---- HUD
  buildExtraHud() {
    const f = (s, c = '#fff') => ({ fontSize: s, fontFamily: 'Courier New', color: c, stroke: '#000', strokeThickness: 4 });
    this.hudSouls = this.add.text(10, 52, '', f('13px', '#d9b3ff')).setScrollFactor(0).setDepth(30);
    this.itemBg = this.add.rectangle(10, 76, 40, 40, 0x000000, 0.55).setOrigin(0).setScrollFactor(0).setDepth(30).setStrokeStyle(2, 0x6a5acd);
    this.itemIcon = this.add.image(30, 96, 'it_pot').setScale(2).setScrollFactor(0).setDepth(31);
    this.itemTxt = this.add.text(56, 80, '', f('12px', '#fff')).setScrollFactor(0).setDepth(30);
    this.buffTxt = this.add.text(56, 98, '', f('11px', '#9fffb0')).setScrollFactor(0).setDepth(30);
    this.expTxt = this.add.text(SW - 214, 114, '', f('12px', '#9fffb0')).setScrollFactor(0).setDepth(30);
    this.bigStats = this.add.text(SW / 2, 492, '', f('14px', '#ffd98a')).setOrigin(0.5).setScrollFactor(0).setDepth(41).setAlign('center').setVisible(false);
    this.eliteTag = this.add.text(0, 0, '', { fontSize: '12px', fontFamily: 'Courier New', color: '#ffd070', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5).setDepth(27).setVisible(false);
    this.muteTxt = this.add.text(SW - 236, 14, '♪', f('22px', '#ffd98a')).setOrigin(0.5).setScrollFactor(0).setDepth(30).setInteractive().setAlpha(Music.isMuted() ? 0.3 : 1);
    this.muteTxt.on('pointerdown', () => this.muteTxt.setAlpha(Music.toggleMute() ? 0.3 : 1));
  },
  updateExtraHud() {
    // bestiario: se registra lo que ves de cerca; nombre del élite más cercano
    let el = null, ed = 1e9; const p0 = this.player;
    this.ents.forEach(e => { const d = Math.hypot(e.spr.x - p0.x, e.spr.y - p0.y); if (d < 260) this.noteSeen(e.type); if (e.elite && d < 340 && d < ed) { ed = d; el = e; } });
    if (el) this.eliteTag.setVisible(true).setText('★ ' + (el.name || 'Élite')).setPosition(el.spr.x, el.spr.y - 52); else this.eliteTag.setVisible(false);
    this.expT -= 0.016;
    if (this.expT <= 0) {
      this.expT = 0.5; const x = this.exploration();
      this.expTxt.setText('Exploración ' + x.pct + '%');
      this.bigStats.setText('Exploración ' + x.pct + '%   ·   Salas ' + x.vis + '/' + x.rooms + '   Cristales y forjas ' + x.gotItems + '/' + x.items + '   Hogueras ' + x.litB + '/' + x.bon + '\nJefes ' + x.dead + '/' + x.bos + '   Diarios ' + x.pages + '/' + x.nPages + '   Élites ' + x.elites + '/' + x.nElites);
    }
    this.ents.forEach(e => { if (e.type === 'clock' && e.aggro && !this.clockHint) { this.clockHint = true; this.toast('El Guardián es inmune a la luz: apaga las antorchas de la sala con E. ¡Él irá a encenderlas!', 8000); } });
    const it = ITEMS[this.selItem], n = this.inv[it.id];
    this.itemIcon.setTexture('it_' + it.id).setAlpha(n > 0 ? 1 : 0.3);
    this.itemTxt.setText(`${it.name} x${n}` + (IS_TOUCH ? '' : '   [Q usar · R cambiar]'));
    const b = this.buffs, parts = [];
    if (b.spd > 0) parts.push('VEL ' + Math.ceil(b.spd) + 's'); if (b.str > 0) parts.push('FUE ' + Math.ceil(b.str) + 's'); if (b.lamp > 0) parts.push('LUZ ' + Math.ceil(b.lamp) + 's'); if (b.rage > 0) parts.push('FUR ' + Math.ceil(b.rage) + 's'); if (b.tonic > 0) parts.push('ALM ' + Math.ceil(b.tonic) + 's'); if (this.ward > 0) parts.push('PIEL x' + this.ward);
    this.buffTxt.setText(parts.join('  '));
    this.hudSouls.setText(`◆ ${this.souls}    ${this.wpn.name} Nv.${this.wlv}    ${this.pas.name || ''}`);
  },
  floatText(x, y, text, color = '#d9b3ff') {
    const t = this.add.text(x, y, text, { fontSize: '14px', fontFamily: 'Courier New', color, stroke: '#000', strokeThickness: 4 }).setOrigin(0.5).setDepth(28);
    this.tweens.add({ targets: t, y: y - 36, alpha: 0, duration: 900, onComplete: () => t.destroy() });
  },

  // ---- agacharse
  setCrouch(on) {
    if (this.crouching === on) return; this.crouching = on; const b = this.player.body;
    if (on) { b.setSize(10, 8, false); b.setOffset(1, 5.5); this.player.setTexture('hero_' + this.color + '_crouch'); }
    else { b.setSize(10, 13, false); b.setOffset(1, 0.5); this.player.setTexture('hero_' + this.color); }
    this.curTex = null;
  },
  canStand() {
    const p = this.player;
    for (const dx of [-11, 0, 11]) { const t = this.fg.getTileAtWorldXY(p.x + dx, p.y - 16); if (t && t.index >= 0 && [K.SOLID, K.FLOOR, K.CRACK].includes(t.index % 8)) return false; }
    return true;
  },

  // ---- entrada
  readInput(K_) {
    const jd = k => Phaser.Input.Keyboard.JustDown(k);
    const J = {}; ['UP', 'DOWN', 'W', 'S', 'E', 'ENTER', 'ESC', 'SPACE', 'X', 'J', 'Z', 'C', 'K', 'SHIFT', 'Q', 'R', 'TAB', 'M', 'N', 'B'].forEach(n => { J[n] = jd(K_[n]); });
    const g = pollPad().edge || {};
    if (g.up) J.UP = true; if (g.down) J.DOWN = true; if (g.jump) J.ENTER = true; if (g.back) J.ESC = true;
    return { J, held: (...ks) => ks.some(k => k.isDown),
      jumpPress: !!(J.UP && !g.up || J.W || J.SPACE || J.Z || touchJust('jump') || g.jump), attackPress: !!(J.X || J.J || touchJust('attack') || g.attack),
      dashPress: !!(J.C || J.K || J.SHIFT || touchJust('dash') || g.dash), ePress: !!(J.E || touchJust('interact') || g.interact),
      usePress: !!(J.Q || touchJust('item') || g.item), cyclePress: !!(J.R || J.TAB || touchJust('cycle') || g.cycle), mapPress: !!(J.M || touchJust('map') || g.map), bookPress: !!(J.B || touchJust('book') || g.book) };
  },

  // ---- movimiento y acciones del jugador (cada frame)
  playerStep(dt, time, inp) {
    const K_ = this.keys, p = this.player, b = p.body, held = inp.held;
    if (inp.bookPress && !this.shopOpen && !this.dlg) this.toggleBook();
    const ui = this.shopOpen || !!this.dlg || this.bookOpen;
    if (this.bookOpen) this.bookKeys(inp.J);
    for (const k in this.buffs) this.buffs[k] = Math.max(0, this.buffs[k] - dt);
    if (inp.J.N) this.muteTxt.setAlpha(Music.toggleMute() ? 0.3 : 1);
    if (this.shopOpen) this.shopKeys(inp.J);
    else if (this.dlg && (inp.ePress || inp.J.ENTER || inp.J.SPACE || inp.attackPress)) this.dlgAdvance();
    if (this.dead) { this.deadT -= dt; if (this.deadT <= 0) this.respawn(); return; }
    this.invuln = Math.max(0, this.invuln - dt); this.atkCd -= dt; this.dashCd -= dt; this.stun -= dt;
    p.setAlpha(this.invuln > 0 && ((time >> 6) & 1) && this.dashT <= 0 ? 0.35 : (this.dashT > 0 ? 0.5 : 1));
    const onFloor = b.blocked.down || b.touching.down;
    if (onFloor) { this.coyote = 0.1; this.jumpsUsed = 0; this.dashAvail = true; if (!this.nearSpikes()) { this.lastGround.x = p.x; this.lastGround.y = p.y; } } else this.coyote -= dt;
    const left = !ui && (held(K_.LEFT, K_.A) || touch.left || pad.left), right = !ui && (held(K_.RIGHT, K_.D) || touch.right || pad.right);
    const crouchHeld = !ui && (held(K_.DOWN, K_.S) || touch.down || pad.down);
    const dir = (right ? 1 : 0) - (left ? 1 : 0);
    if (dir) this.facing = dir;
    p.setFlipX(this.facing < 0);
    const wantCrouch = crouchHeld && onFloor && this.dashT <= 0 && this.stun <= 0;
    if (wantCrouch && !this.crouching) this.setCrouch(true); else if (!wantCrouch && this.crouching && this.canStand()) this.setCrouch(false);
    const wall = b.blocked.left ? -1 : b.blocked.right ? 1 : 0;
    const speed = P.speed * (this.pas.speed || 1) * (this.buffs.spd > 0 ? 1.35 : 1) * (this.crouching ? 0.5 : 1);
    if (!this.crouching) { // caminar / saltar: fotogramas de piernas
      const moving = onFloor && dir !== 0 && this.dashT <= 0 && this.stun <= 0;
      const key = 'hero_' + this.color + (moving ? (((time / 120) | 0) % 2 ? '_w1' : '_w2') : (!onFloor ? '_w2' : ''));
      if (this.curTex !== key) { this.curTex = key; p.setTexture(key); }
    }

    if (this.dashT > 0) { this.dashT -= dt; b.setVelocity(this.dashDir * P.dashSpeed, 0); b.setAllowGravity(false); if (this.dashT <= 0) { b.setAllowGravity(true); b.setVelocityX(this.dashDir * P.speed); } }
    else if (this.stun > 0 || this.wjLock > 0) { this.wjLock -= dt; }
    else b.setVelocityX(dir * speed);

    // salto, caída por plataformas
    this.dropT -= dt;
    let dropped = false;
    if (!ui && inp.jumpPress && crouchHeld && onFloor && this.stun <= 0) {
      const under = this.fg.getTileAtWorldXY(p.x, p.y + 23);
      if (under && under.index >= 0 && under.index % 8 === K.ONEWAY) { this.dropT = 0.4; b.setVelocityY(140); this.coyote = 0; this.jumpBuf = 0; dropped = true; if (this.crouching && this.canStand()) this.setCrouch(false); }
    }
    if (!ui && inp.jumpPress && !dropped) this.jumpBuf = 0.1; else if (!dropped) this.jumpBuf -= dt;
    if (this.jumpBuf > 0 && this.stun <= 0 && this.dashT <= 0 && !ui) {
      if (this.coyote > 0) { b.setVelocityY(P.jump); this.jumpsUsed = 1; this.coyote = 0; this.jumpBuf = 0; SFX.jump(); }
      else if (this.abil.wj && wall && !onFloor) { b.setVelocity(-wall * P.wjX, P.wjY); this.wjLock = P.wjLock; this.facing = -wall; this.jumpsUsed = 1; this.jumpBuf = 0; SFX.jump(); }
      else if (this.abil.dj && this.jumpsUsed < 2) { b.setVelocityY(P.djump); this.jumpsUsed = 2; this.jumpBuf = 0; this.poof(p.x, p.y + 16, 4); SFX.jump(); }
    }
    if (!held(K_.UP, K_.W, K_.SPACE, K_.Z) && !touch.jump && !pad.jump && b.velocity.y < -200 && this.dashT <= 0 && this.stun <= 0) b.setVelocityY(b.velocity.y * 0.55);
    if (this.abil.wj && wall && !onFloor && b.velocity.y > P.slide && dir === wall) b.setVelocityY(P.slide);

    // impulso (dash)
    if (!ui && this.abil.dash && inp.dashPress && this.dashCd <= 0 && this.dashAvail && this.stun <= 0 && (!this.crouching || this.canStand())) {
      if (this.crouching) this.setCrouch(false);
      this.dashT = P.dashTime; this.dashCd = P.dashCd; this.dashDir = dir || this.facing; if (!onFloor) this.dashAvail = false;
      this.invuln = Math.max(this.invuln, P.dashTime + 0.1); SFX.dash(); this.poof(p.x, p.y, 3, 0x9fd4ff);
    }
    // ataque y objetos
    if (!ui && inp.attackPress && this.atkCd <= 0 && this.dashT <= 0 && this.stun <= 0) this.startAttack();
    if (this.atkT > 0) { this.atkT -= dt; this.doAttack(); }
    if (!ui && inp.usePress) this.useItem();
    if (!ui && inp.cyclePress) this.cycleItem();
    this.updateArrows(dt);

    // peligros y recogidas
    if (this.spikesTouch()) { this.hurt(1, p.x); if (!this.dead) { p.setPosition(this.lastGround.x, this.lastGround.y); b.setVelocity(0, 0); this.invuln = 1.2; } }
    if (p.y > (this.W.Ht - 1) * T) { p.setPosition(this.lastGround.x, this.lastGround.y); b.setVelocity(0, 0); }
    this.contact(); this.pickups();
    this.interact(inp.ePress && !ui);
    // cerrar tienda/diálogo si te alejas
    const cn = this.curNpc;
    if ((this.shopOpen || this.dlg) && cn && (Math.abs(cn.x - p.x) > 150 || Math.abs(cn.y - p.y) > 150)) this.closeUi();
  },

  // ---- armas
  startAttack() {
    const w = this.wstats(), p = this.player;
    this.atkCd = w.cd * (this.buffs.rage > 0 ? 0.6 : 1); SFX.swing();
    if (this.wpn.kind === 'ranged') { this.atkT = 0.1; this.fireArrows(w); } else { this.atkT = this.wpn.act; this.swingHit.clear(); }
    this.slashFx(p.x, p.y + (this.crouching ? 7 : 0), this.facing, this.color);
  },
  slashFx(x, y, dir, color) {
    const W_ = WEAPONS[color] || WEAPONS.red;
    if (W_.kind === 'ranged') {
      const s = this.add.image(x + dir * 22, y - 4, 'arrow').setScale(2).setFlipX(dir < 0).setDepth(9).setTint(W_.tint);
      this.tweens.add({ targets: s, x: x + dir * 70, alpha: 0, duration: 220, onComplete: () => s.destroy() }); return;
    }
    const s = this.add.image(x + dir * W_.off, y - 2, W_.fx).setScale(W_.fxScale).setFlipX(dir < 0).setDepth(9).setAlpha(0.9).setTint(W_.tint);
    this.tweens.add({ targets: s, alpha: 0, scaleX: W_.fxScale * 1.2, duration: 190, onComplete: () => s.destroy() });
  },
  fireArrows(w) {
    const p = this.player, f = this.facing, dmg = w.dmg + this.dmgBonus();
    for (let i = 0; i < w.n; i++) {
      const vy = (i - (w.n - 1) / 2) * 46, vx = f * 430;
      const spr = this.add.image(p.x + f * 22, p.y - 4 + (this.crouching ? 7 : 0), 'arrow').setScale(2).setDepth(9).setTint(0xb8ff9a).setRotation(Math.atan2(vy, vx));
      this.arrows.push({ spr, vx, vy, life: w.range / 430, dmg });
    }
  },
  updateArrows(dt) {
    this.arrows = this.arrows.filter(a => {
      a.life -= dt; a.spr.x += a.vx * dt; a.spr.y += a.vy * dt;
      let dead = a.life <= 0;
      if (!dead) {
        const t = this.fg.getTileAtWorldXY(a.spr.x, a.spr.y);
        if (t && t.index >= 0) {
          const k = t.index % 8;
          if (k === K.CRACK) { this.poof(a.spr.x, a.spr.y, 2, 0xaaaaaa); dead = true; } // las flechas no rompen muros
          else if (k === K.SOLID || k === K.FLOOR) dead = true;
        }
      }
      if (!dead) for (const e of this.ents.values()) {
        if (e.dead) continue;
        const [ex, ey, ew, eh] = this.entBox(e);
        if (rectsOverlap(a.spr.x, a.spr.y, 16, 10, ex, ey, ew, eh)) { this.hitEnemy(e, Math.sign(a.vx) || 1, a.dmg); dead = true; break; }
      }
      if (dead) a.spr.destroy();
      return !dead;
    });
  },
  hitEnemy(e, f, dmg) {
    const p = this.player, [ex, ey] = this.entBox(e);
    if (e.cfg.inv) { if (!e.invMsg || Date.now() - e.invMsg > 900) { e.invMsg = Date.now(); this.floatText(ex, ey - 36, '¡Invulnerable!', '#9fd4ff'); } this.poof(ex, ey, 2, 0x9fd4ff); SFX.hurt(); return; }
    if (e.type === 'clock' && e.shield) { if (!e.shieldMsg || Date.now() - e.shieldMsg > 1200) { e.shieldMsg = Date.now(); this.floatText(ex, ey - 40, '¡La luz lo protege!', '#8fc8ff'); } SFX.hurt(); return; }
    SFX.hit();
    const chance = this.pas.life || 0.25;
    if (!this.dead && this.hp < this.maxHp && Math.random() < chance) { this.hp = Math.min(this.maxHp, this.hp + (e.boss ? 0.25 : 0.5)); this.poof(p.x, p.y - 10, 3, 0xff3b5c); }
    if (this.isHost) this.damageEnt(e, dmg, f, socket.id); else socket.emit('hit', { id: e.id, dmg, dir: f });
    e.flash = 0.1; e.spr.setTintFill(0xffffff); this.poof(ex, ey, 3, 0xffe9a0);
  },
  doAttack() {
    if (this.wpn.kind === 'ranged') return;
    const p = this.player, f = this.facing, w = this.wstats(), wp = this.wpn;
    const cy = p.y - 2 + (this.crouching ? 7 : 0), bx = p.x + f * wp.off, bw = w.w, bh = wp.h;
    this.ents.forEach(e => {
      if (e.dead || this.swingHit.has(e.id)) return;
      const [ex, ey, ew, eh] = this.entBox(e);
      if (rectsOverlap(bx, cy, bw, bh, ex, ey, ew, eh)) { this.swingHit.add(e.id); this.hitEnemy(e, f, w.dmg + this.dmgBonus()); }
    });
    for (let wy = cy - bh / 2; wy <= cy + bh / 2; wy += 16) for (let wx = bx - bw / 2; wx <= bx + bw / 2; wx += 16) {
      const t = this.fg.getTileAtWorldXY(wx, wy);
      if (t && t.index >= 0 && t.index % 8 === K.CRACK) { this.fg.removeTileAt(t.x, t.y); socket.emit('broke', { gx: t.x, gy: t.y }); this.poof((t.x + 0.5) * T, (t.y + 0.5) * T, 6, 0xaaaaaa); SFX.hit(); }
    }
  },
  damageEnt(e, dmg, dir, by) {
    if (e.dead) return;
    if (e.boss && !e.aggro) return;
    if (e.phase === 'intro') return;
    if (e.cfg.inv) return; // invulnerables
    if (e.type === 'clock' && this.lightLevel(e.spr.x, e.spr.y) > 0.18) return; // la luz lo protege
    e.hp -= dmg; e.flash = 0.12; e.spr.setTintFill(0xffffff);
    if (!e.boss && e.cfg.kind === 'walk') { e.stun = 0.18; e.spr.body.setVelocityX(dir * 170); }
    if (e.hp <= 0) this.killEnt(e, by);
  },
  killEnt(e, by) {
    let base = (SOULS[e.type] || 0) * (e.elite ? 5 : 1); base = Math.round(base * (1 + 0.2 * (e.zone !== undefined ? e.zone : 0)));
    const x = e.spr.x, y = e.spr.y, summoned = e.summoned, type = e.type, elite = e.elite, name = e.name, reward = e.reward;
    _kill.call(this, e);
    if (summoned) return;
    const to = by || socket.id;
    if (to === socket.id) { if (base) this.addSouls(base, true, x, y); this.registerKill(type); if (elite && reward) this.eliteReward(name, reward); }
    else socket.emit('loot', { to, amt: base, kt: type, eid: elite && reward ? name : undefined, item: elite && reward ? reward.item : undefined, bonus: elite && reward ? reward.souls : undefined });
  },
  registerKill(type) { this.kills[type] = (this.kills[type] || 0) + 1; this.noteSeen(type); },
  noteSeen(type) {
    if (this.seen.has(type)) return; this.seen.add(type);
    if (BESTIARY[type]) this.toast('Bestiario: nuevo registro — ' + BESTIARY[type].name + '  (B para abrirlo)', 4500);
  },
  eliteReward(eid, reward) {
    if (this.eliteGot.has(eid)) return;
    this.eliteGot.add(eid);
    if (reward.item && this.inv[reward.item] !== undefined) this.inv[reward.item] = Math.min(9, this.inv[reward.item] + 1);
    if (reward.souls) this.addSouls(reward.souls, false);
    const it = ITEMS.find(i => i.id === reward.item);
    this.toast('¡Has derrotado a ' + eid + '! Recompensa: ' + (it ? it.name + ' + ' : '') + (reward.souls || 0) + ' almas', 5500);
    SFX.pick(); this.autoSave();
  },
  addSouls(n, kill, x, y) {
    const amt = Math.round(n * (this.pas.souls || 1) * (this.buffs.tonic > 0 ? 2 : 1)); this.souls += amt;
    this.floatText(x !== undefined ? x : this.player.x, (y !== undefined ? y : this.player.y) - 20, '+' + amt + ' ◆');
  },

  // ---- vida, muerte
  contact() {
    const p = this.player, pw = 26, ph = this.crouching ? 22 : 36, cy = p.y + (this.crouching ? 7 : 0);
    this.ents.forEach(e => {
      if (e.dead || (e.boss && !e.aggro)) return;
      const [ex, ey, ew, eh] = this.entBox(e);
      if (rectsOverlap(p.x, cy, pw, ph, ex, ey, ew, eh)) this.hurt(e.cfg.dmg + (e.dmgBonus || 0), ex);
    });
    this.projs.forEach((pr, id) => {
      if (this.hurtProjs.has(id)) return;
      const c = PR[pr.type]; if (!c.dmg) return;
      if (rectsOverlap(p.x, cy, pw, ph, pr.spr.x, pr.spr.y, c.hb[0], c.hb[1]) && this.invuln <= 0 && this.dashT <= 0) { this.hurtProjs.add(id); this.hurt(c.dmg + (this.pas.projPlus || 0), pr.spr.x); }
    });
    if (this.hurtProjs.size > 200) this.hurtProjs.clear();
  },
  hurt(dmg, fromX) {
    if (this.invuln > 0 || this.dead || this.dashT > 0) return;
    if (this.ward > 0) { this.ward--; this.invuln = 0.8; SFX.hit(); this.poof(this.player.x, this.player.y, 5, 0xc9ced8); this.floatText(this.player.x, this.player.y - 30, 'bloqueado', '#c9ced8'); return; }
    _hurt.call(this, this.pas.dmgTaken ? Math.ceil(dmg * this.pas.dmgTaken) : dmg, fromX);
  },
  die() {
    if (this.inv.amu > 0) {
      this.inv.amu--; this.hp = Math.max(2, Math.ceil(this.maxHp / 2)); this.invuln = 2.5; SFX.pick();
      this.toast('¡El Amuleto te devuelve a la vida!', 3500); this.poof(this.player.x, this.player.y, 14, 0xffd23b); return;
    }
    this.closeUi(); this.setCrouch(false); _die.call(this);
  },
  respawn() { this.setCrouch(false); _respawn.call(this); },
  pickups() {
    _pick.call(this);
    const p = this.player;
    this.pageObjs.forEach(pg => {
      if (this.pagesGot.has(pg.id)) return;
      if (Math.abs(p.x - pg.x) < 30 && Math.abs(p.y - pg.y) < 40) {
        this.pagesGot.add(pg.id); pg.spr.destroy(); pg.glow.destroy(); SFX.pick();
        this.toast('Nuevo diario: ' + (PAGES[pg.area] ? PAGES[pg.area].title : 'página') + '  (B para leerlo)', 5000); this.autoSave();
      }
    });
    this.forgeObjs.forEach(f => {
      if (this.forgeGot.has(f.id)) return;
      if (Math.abs(p.x - f.x) < 30 && Math.abs(p.y - f.y) < 40) {
        this.forgeGot.add(f.id); f.spr.destroy(); f.glow.destroy(); SFX.pick(); this.poof(f.x, f.y, 10, 0xffd98a);
        if (this.wlv < 5) { this.wlv++; this.toast(`¡${this.wpn.name} mejorada! Nivel ${this.wlv}`, 4500); } else this.toast('Tu arma ya está al máximo.');
        this.autoSave();
      }
    });
  },

  // ---- objetos consumibles
  useItem() {
    const it = ITEMS[this.selItem];
    if (this.inv[it.id] <= 0) { this.toast('No tienes ' + it.name.toLowerCase()); return; }
    if (it.id === 'amu') { this.toast('El amuleto se usa solo cuando mueres.'); return; }
    this.inv[it.id]--; SFX.pick();
    if (it.id === 'pot') this.hp = Math.min(this.maxHp, this.hp + 3);
    else if (it.id === 'pot2') this.hp = this.maxHp;
    else if (it.id === 'spd') this.buffs.spd = 20;
    else if (it.id === 'str') this.buffs.str = 25;
    else if (it.id === 'lamp') this.buffs.lamp = 60;
    else if (it.id === 'ward') this.ward = Math.min(6, this.ward + 2);
    else if (it.id === 'rage') this.buffs.rage = 20;
    else if (it.id === 'tonic') this.buffs.tonic = 60;
    else if (it.id === 'fruit') { this.maxHp++; this.hp = this.maxHp; }
    else if (it.id === 'bomb') this.placeBomb();
    this.poof(this.player.x, this.player.y, 6, 0xff7a9a); this.toast(it.name + ': ' + it.desc);
  },
  placeBomb() {
    const p = this.player, x = p.x + this.facing * 14, y = p.y + 12;
    const spr = this.add.image(x, y, 'bomb').setScale(2.6).setDepth(8);
    this.tweens.add({ targets: spr, alpha: { from: 1, to: 0.35 }, yoyo: true, repeat: 5, duration: 110 });
    this.time.delayedCall(1300, () => { spr.destroy(); if (this.player) this.explodeAt(x, y, 110, 3); });
  },
  explodeAt(x, y, r, dmg) {
    this.poof(x, y, 18, 0xffb347); this.cameras.main.shake(260, 0.012); SFX.boss();
    for (let wy = y - r; wy <= y + r; wy += 16) for (let wx = x - r; wx <= x + r; wx += 16) {
      if (Math.hypot(wx - x, wy - y) > r) continue;
      const t = this.fg.getTileAtWorldXY(wx, wy);
      if (t && t.index >= 0 && t.index % 8 === K.CRACK) { this.fg.removeTileAt(t.x, t.y); socket.emit('broke', { gx: t.x, gy: t.y }); this.poof((t.x + 0.5) * T, (t.y + 0.5) * T, 6, 0xaaaaaa); }
    }
    this.ents.forEach(e => {
      if (e.dead || e.cfg.inv) return;
      const [ex, ey] = this.entBox(e);
      if (Math.hypot(ex - x, ey - y) < r + 30) { const d = Math.sign(ex - x) || 1; if (this.isHost) this.damageEnt(e, dmg, d, socket.id); else socket.emit('hit', { id: e.id, dmg, dir: d }); }
    });
    if (!this.dead && Math.hypot(this.player.x - x, this.player.y - y) < 55) this.hurt(1, x); // la explosión también te alcanza si estás pegado
  },
  cycleItem() {
    for (let i = 1; i <= ITEMS.length; i++) { const n = (this.selItem + i) % ITEMS.length; if (this.inv[ITEMS[n].id] > 0) { this.selItem = n; return; } }
    this.selItem = (this.selItem + 1) % ITEMS.length;
  },

  // ---- interacción: NPC primero, antorchas después
  interact(ePress) {
    const p = this.player; let best = null, bd = 1e9;
    for (const n of this.npcObjs) { const dx = Math.abs(n.x - p.x), dy = Math.abs((n.y - 30) - p.y); if (dx < 70 && dy < 80 && dx < bd) { bd = dx; best = n; } }
    if (best) {
      this.promptTxt.setVisible(!(this.shopOpen || this.dlg)).setPosition(best.x, best.y - 74).setText(best.def.shop ? 'E: comerciar' : 'E: hablar');
      if (ePress) { this.curNpc = best; best.def.shop ? this.openShop(best) : this.openDialogue(best); }
      return;
    }
    // hoguera (solo al interactuar: descansar, guardar y reaparecer monstruos)
    let bf = null, bfd = 1e9;
    for (const a of this.altars) { const dx = Math.abs(a.x - p.x), dy = Math.abs((a.y - 20) - p.y); if (dx < 64 && dy < 90 && dx < bfd) { bfd = dx; bf = a; } }
    if (bf) {
      this.promptTxt.setVisible(true).setPosition(bf.x, bf.y - 82).setText(bf.lit ? 'E: descansar (guarda la partida)' : 'E: encender la hoguera');
      if (ePress) this.restAt(bf);
      return;
    }
    this.interactTorch(ePress);
  },
  restAt(a) {
    a.lit = true; this.bonfireLit.add(a.id); this.lastAltar = { x: a.x, y: a.y }; this.lastBonfire = a; this.canAuto = true; this.hp = this.maxHp; this.rebuildLights();
    SFX.altar(); this.poof(a.x, a.y - 30, 10, 0xffb347);
    if (this.isHost) this.restReset(); else socket.emit('rest');
    this.savePersonal(a);
    this.toast('Hoguera: vida restaurada, partida guardada y los monstruos han reaparecido', 4500);
  },
  // Guarda al conseguir una mejora permanente (habilidad de jefe, cristal de vida, mejora de arma)
  autoSave() {
    if (!this.canAuto || !this.lastBonfire) return;
    this.savePersonal(this.lastBonfire);
    this.floatText(this.player.x, this.player.y - 56, 'mejora guardada', '#9fffb0');
  },
  restReset() { // el anfitrión hace reaparecer a todos los enemigos normales
    this.killed.clear();
    [...this.ents.entries()].forEach(([id, e]) => { if (e.sim && !e.boss) { this.poof(e.spr.x, e.spr.y, 3); e.spr.destroy(); this.ents.delete(id); } });
    this.activeT = 0;
  },
  savePersonal(a) {
    socket.emit('save', { souls: this.souls, inv: this.inv, wlv: this.wlv, maxHp: this.maxHp, cry: [...this.cryGot], forge: [...this.forgeGot],
      altar: a.id, lit: [...this.bonfireLit], visited: [...this.visited], abil: this.abil, elite: [...this.eliteGot], pages: [...this.pagesGot], seen: [...this.seen], kills: this.kills });
  },

  // ---- diálogo
  buildDialogueUi() {
    const f = (s, c = '#fff') => ({ fontSize: s, fontFamily: 'Courier New', color: c, wordWrap: { width: 720 } });
    this.dlgObjs = [];
    const add = o => { o.setScrollFactor(0).setDepth(60); this.dlgObjs.push(o); return o; };
    this.dlgBg = add(this.add.rectangle(SW / 2, SH - 92, 780, 132, 0x140c22, 0.95).setStrokeStyle(3, 0xffb347)).setInteractive();
    this.dlgName = add(this.add.text(SW / 2 - 372, SH - 148, '', f('15px', '#ffd98a')));
    this.dlgText = add(this.add.text(SW / 2 - 372, SH - 124, '', f('15px')));
    this.dlgHint = add(this.add.text(SW / 2 + 372, SH - 40, IS_TOUCH ? 'toca para continuar ▶' : 'E / Enter: continuar ▶', f('11px', '#a99bd1')).setOrigin(1, 0.5));
    this.dlgBg.on('pointerdown', () => this.dlgAdvance());
    this.dlgObjs.forEach(o => o.setVisible(false));
  },
  openDialogue(n) {
    n.visits++;
    const pages = n.def.lines, page = n.visits === 1 ? pages[0] : pages[1 + Math.floor(Math.random() * (pages.length - 1))];
    this.dlg = { npc: n, page, i: 0 }; this.dlgObjs.forEach(o => o.setVisible(true)); this.promptTxt.setVisible(false);
    this.dlgName.setText(n.def.name); this.dlgText.setText(page[0]); SFX.altar();
  },
  dlgAdvance() {
    if (!this.dlg) return;
    this.dlg.i++;
    if (this.dlg.i >= this.dlg.page.length) { this.closeUi(); return; }
    this.dlgText.setText(this.dlg.page[this.dlg.i]); SFX.hit();
  },

  // ---- tienda (más mercancía según los jefes derrotados)
  shopTier() { return this.curNpc ? (SHOP_TIER[this.curNpc.area] ?? 0) : 0; },
  shopItems() { const tier = this.shopTier(); return ITEMS.filter(it => it.tier <= tier && this.progress.bosses.length >= it.need); },
  buildShopUi() {
    const f = (s, c = '#fff') => ({ fontSize: s, fontFamily: 'Courier New', color: c });
    const cx = SW / 2, cy = SH / 2;
    this.shopObjs = [];
    const add = o => { o.setScrollFactor(0).setDepth(60); this.shopObjs.push(o); return o; };
    add(this.add.rectangle(cx, cy, 600, 506, 0x140c22, 0.97).setStrokeStyle(4, 0xffb347));
    this.shopTitle = add(this.add.text(cx, cy - 230, '', f('18px', '#ffd98a')).setOrigin(0.5));
    this.shopRows = ITEMS.map(it => {
      const row = add(this.add.rectangle(cx, cy, 560, 32, 0x2a1d4d, 1)).setInteractive();
      const icon = add(this.add.image(cx - 262, cy, 'it_' + it.id).setScale(1.8));
      const nameT = add(this.add.text(cx - 238, cy, it.name, f('14px')).setOrigin(0, 0.5));
      const ownT = add(this.add.text(cx + 110, cy, '', f('12px', '#9fffb0')).setOrigin(1, 0.5));
      const priceT = add(this.add.text(cx + 272, cy, it.price + ' ◆', f('14px', '#d9b3ff')).setOrigin(1, 0.5));
      row.on('pointerdown', () => { const k = this.shopItems().indexOf(it); if (k >= 0) { this.shopSel = k; this.buyItem(k); } });
      return { it, row, icon, nameT, ownT, priceT };
    });
    this.shopDesc = add(this.add.text(cx, cy + 190, '', f('13px', '#a99bd1')).setOrigin(0.5));
    this.shopMore = add(this.add.text(cx, cy + 212, '', f('12px', '#ffd98a')).setOrigin(0.5));
    add(this.add.text(cx, cy + 236, IS_TOUCH ? 'toca un objeto para comprarlo' : '↑↓ elegir · Enter/E comprar · Esc salir', f('12px', '#a99bd1')).setOrigin(0.5));
    const close = add(this.add.text(cx + 280, cy - 238, '✕', f('22px', '#ff8a8a')).setOrigin(0.5)).setInteractive();
    close.on('pointerdown', () => this.closeUi());
    this.shopObjs.forEach(o => o.setVisible(false));
  },
  openShop() {
    this.shopOpen = true; this.shopSel = 0; this.shopObjs.forEach(o => o.setVisible(true)); this.promptTxt.setVisible(false); this.refreshShop(); SFX.altar();
  },
  refreshShop() {
    const list = this.shopItems(), cy = SH / 2;
    if (this.shopSel >= list.length) this.shopSel = 0;
    this.shopTitle.setText('MERCADER        almas: ' + this.souls + ' ◆');
    this.shopRows.forEach(r => {
      const idx = list.indexOf(r.it), vis = idx >= 0 && this.shopOpen;
      [r.row, r.icon, r.nameT, r.ownT, r.priceT].forEach(o => o.setVisible(vis));
      if (!vis) return;
      const y = cy - 190 + idx * 35;
      [r.row, r.icon, r.nameT, r.ownT, r.priceT].forEach(o => o.setY(y));
      r.row.setFillStyle(idx === this.shopSel ? 0x5a3a9a : 0x2a1d4d, 1);
      r.ownT.setText('tienes ' + this.inv[r.it.id]); r.priceT.setColor(this.souls >= r.it.price ? '#d9b3ff' : '#ff7a7a');
    });
    this.shopDesc.setText(list[this.shopSel].desc);
    const tier = this.shopTier(), nb = this.progress.bosses.length;
    const byBoss = ITEMS.filter(it => it.tier <= tier && it.need > nb), byTier = ITEMS.filter(it => it.tier > tier);
    const falta = byBoss.length ? Math.min(...byBoss.map(i => i.need)) - nb : 0;
    this.shopMore.setText(byBoss.length ? 'Tengo más mercancía para quien derrote a ' + falta + ' jefe' + (falta > 1 ? 's' : '') + ' más...' : (byTier.length ? 'Mis colegas más adelante venden cosas mejores...' : 'Esto es todo lo que tengo.'));
  },
  shopKeys(J) {
    const n = this.shopItems().length;
    if (J.UP || J.W) { this.shopSel = (this.shopSel + n - 1) % n; this.refreshShop(); SFX.hit(); }
    if (J.DOWN || J.S) { this.shopSel = (this.shopSel + 1) % n; this.refreshShop(); SFX.hit(); }
    if (J.ENTER || J.E || J.SPACE || J.X || J.J) this.buyItem(this.shopSel);
    if (J.ESC) this.closeUi();
  },
  buyItem(k) {
    const it = this.shopItems()[k]; if (!it) return;
    this.shopSel = k;
    if (this.souls < it.price) { this.toast('No tienes suficientes almas'); SFX.hurt(); this.refreshShop(); return; }
    if (this.inv[it.id] >= 9) { this.toast('No puedes llevar más'); this.refreshShop(); return; }
    this.souls -= it.price; this.inv[it.id]++; SFX.pick(); this.refreshShop();
    if (this.inv[ITEMS[this.selItem].id] === 0) this.selItem = ITEMS.indexOf(it);
  },
  // ---- bestiario y diarios (tecla B)
  bookEntries() {
    const out = [];
    Object.keys(BESTIARY).forEach(t => out.push({ kind: 'b', id: t, known: this.seen.has(t) }));
    Object.keys(PAGES).forEach(a => { const pg = this.W.pages.find(x => x.area === a); out.push({ kind: 'p', id: a, known: !!(pg && this.pagesGot.has(pg.id)) }); });
    return out;
  },
  buildBookUi() {
    const f = (s, c = '#fff', w) => ({ fontSize: s, fontFamily: 'Courier New', color: c, wordWrap: w ? { width: w } : undefined });
    const cx = SW / 2, cy = SH / 2; this.bookObjs = [];
    const add = o => { o.setScrollFactor(0).setDepth(60); this.bookObjs.push(o); return o; };
    add(this.add.rectangle(cx, cy, 760, 470, 0x140c22, 0.97).setStrokeStyle(4, 0xffb347));
    add(this.add.text(cx, cy - 214, 'BESTIARIO Y DIARIOS', f('17px', '#ffd98a')).setOrigin(0.5));
    this.bookRows = Array.from({ length: 16 }, (_, i) => {
      const y = cy - 186 + i * 25;
      const row = add(this.add.rectangle(cx - 268, y, 220, 23, 0x2a1d4d, 1)).setInteractive();
      const txt = add(this.add.text(cx - 372, y, '', f('12px')).setOrigin(0, 0.5));
      row.on('pointerdown', () => { this.bookSel = i; this.refreshBook(); });
      return { row, txt };
    });
    this.bookTitle = add(this.add.text(cx - 130, cy - 186, '', f('16px', '#ffd98a', 480)));
    this.bookText = add(this.add.text(cx - 130, cy - 154, '', f('14px', '#fff', 480)));
    this.bookTip = add(this.add.text(cx - 130, cy + 70, '', f('13px', '#9fffb0', 480)));
    add(this.add.text(cx, cy + 222, IS_TOUCH ? 'toca un registro · 📖 para cerrar' : '↑↓ elegir · B o Esc para cerrar', f('12px', '#a99bd1')).setOrigin(0.5));
    const close = add(this.add.text(cx + 370, cy - 224, '✕', f('22px', '#ff8a8a')).setOrigin(0.5)).setInteractive(); close.on('pointerdown', () => this.closeBook());
    this.bookObjs.forEach(o => o.setVisible(false));
  },
  toggleBook() { this.bookOpen ? this.closeBook() : this.openBook(); },
  openBook() { this.bookOpen = true; this.bookSel = 0; this.bookObjs.forEach(o => o.setVisible(true)); this.refreshBook(); SFX.altar(); },
  closeBook() { this.bookOpen = false; this.bookObjs.forEach(o => o.setVisible(false)); },
  bookKeys(J) {
    const n = this.bookEntries().length;
    if (J.UP || J.W) { this.bookSel = (this.bookSel + n - 1) % n; this.refreshBook(); SFX.hit(); }
    if (J.DOWN || J.S) { this.bookSel = (this.bookSel + 1) % n; this.refreshBook(); SFX.hit(); }
    if (J.ESC) this.closeBook();
  },
  refreshBook() {
    const list = this.bookEntries();
    this.bookRows.forEach((r, i) => {
      const en = list[i]; r.row.setVisible(!!en && this.bookOpen); r.txt.setVisible(!!en && this.bookOpen); if (!en) return;
      const name = en.kind === 'b' ? BESTIARY[en.id].name : PAGES[en.id].title;
      r.txt.setText((en.kind === 'b' ? '☠ ' : '✉ ') + (en.known ? name : '???')).setColor(en.known ? '#ffffff' : '#7a6f9a');
      r.row.setFillStyle(i === this.bookSel ? 0x5a3a9a : 0x2a1d4d, 1);
    });
    const en = list[this.bookSel];
    if (!en) return;
    if (!en.known) { this.bookTitle.setText('???'); this.bookText.setText(en.kind === 'b' ? 'Aún no has encontrado a esta criatura.' : 'Aún no has encontrado este diario.'); this.bookTip.setText(''); return; }
    if (en.kind === 'b') { const b = BESTIARY[en.id]; this.bookTitle.setText(b.name + '   (derrotados: ' + (this.kills[en.id] || 0) + ')'); this.bookText.setText(b.text); this.bookTip.setText('Consejo: ' + b.tip); }
    else { const p = PAGES[en.id]; this.bookTitle.setText(p.title); this.bookText.setText('"' + p.text + '"'); this.bookTip.setText(''); }
  },
  // ---- porcentaje de exploración
  exploration() {
    const w = this.W, rooms = w.areaList.filter(a => !a.special), vis = rooms.filter(a => this.visited.has(a.id)).length;
    const items = w.crystals.length + w.forges.length, gotItems = this.cryGot.size + this.forgeGot.size;
    const bon = w.altars.length, litB = this.altars.filter(a => a.lit).length, bos = w.bosses.length, dead = this.progress.bosses.length;
    const extra = w.pages.length + this.W.spawns.filter(s => s.opts && s.opts.elite).length, gotExtra = this.pagesGot.size + this.eliteGot.size;
    const pct = Math.round(35 * vis / rooms.length + 25 * gotItems / items + 10 * litB / bon + 20 * dead / bos + 10 * gotExtra / extra);
    return { pct, vis, rooms: rooms.length, gotItems, items, litB, bon, dead, bos, pages: this.pagesGot.size, nPages: w.pages.length, elites: this.eliteGot.size, nElites: this.W.spawns.filter(s => s.opts && s.opts.elite).length };
  },
  closeUi() {
    this.shopOpen = false; this.dlg = null; this.curNpc = null;
    if (this.shopObjs) this.shopObjs.forEach(o => o.setVisible(false));
    if (this.dlgObjs) this.dlgObjs.forEach(o => o.setVisible(false));
  },
});
