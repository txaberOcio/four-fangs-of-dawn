/* Arte pixel generado por código: tiles por zona, héroes, enemigos, jefes y objetos */
const ZONE_PAL = [
  { base: '#5a5f6e', dark: '#3a3e4a', light: '#7b8194', mortar: '#2a2d36', bg: '#1e2029', bgd: '#171922', glow: '#ffb347' },
  { base: '#7a5a3a', dark: '#4f3822', light: '#a07a52', mortar: '#2e1f12', bg: '#2a1c12', bgd: '#1f140d', glow: '#ffd27a' },
  { base: '#5a5f99', dark: '#373a66', light: '#8087c4', mortar: '#20213d', bg: '#1a1b33', bgd: '#131426', glow: '#8ad0ff' },
  { base: '#4f6b57', dark: '#2f4436', light: '#78967f', mortar: '#1b2a20', bg: '#16221a', bgd: '#101a14', glow: '#9dffb0' },
  { base: '#8a6a2e', dark: '#5a4318', light: '#c29a4a', mortar: '#2f2209', bg: '#2a210f', bgd: '#201909', glow: '#ffe08a' },
  { base: '#7a2f3a', dark: '#4d1a23', light: '#a8505e', mortar: '#28090f', bg: '#2a0f16', bgd: '#1f0a10', glow: '#ff7a7a' },
  { base: '#2f2b3a', dark: '#211e2b', light: '#4a4458', mortar: '#15121c', bg: '#100d17', bgd: '#0c0a12', glow: '#8870a0' }, // roca
  { base: '#a8708a', dark: '#6a3f58', light: '#e0a8b8', mortar: '#3a1e2c', bg: '#2c1626', bgd: '#201019', glow: '#ffd6a0' }, // Torres del Alba
  { base: '#3a5a6a', dark: '#223644', light: '#5f8ea0', mortar: '#10202a', bg: '#0f1c26', bgd: '#0a141b', glow: '#7ad8ff' }, // El Abismo
];

const HERO_COLORS = { red: '#d93a3a', blue: '#3a6ad9', green: '#3aa84a', purple: '#9a4ad9' };
const HERO_NAMES = { red: 'Vampiro carmesí', blue: 'Vampiro azul', green: 'Vampiro esmeralda', purple: 'Vampiro violeta' };

const HERO_INFO = {
  red: { weapon: 'Espada', passive: 'Sed de sangre', desc: 'Espada equilibrada. Pasiva: 40% de curarse al golpear (los demás, 25%).' },
  blue: { weapon: 'Lanza', passive: 'Visión nocturna', desc: 'Lanza de gran alcance. Pasiva: ve mucho más lejos en la oscuridad. Desventaja: recibe más daño de los ataques a distancia.' },
  green: { weapon: 'Arco', passive: 'Cazadora de almas', desc: 'Dispara flechas a distancia. Pasiva: +50% de almas al matar. Desventaja: recibe +50% de daño y no rompe muros (necesita Bombas de la tienda).' },
  purple: { weapon: 'Guadaña', passive: 'Piel de sombra', desc: 'Guadaña lenta y muy dañina. Pasiva: +2 corazones de vida máxima. Desventaja: se mueve más lento (compensa con un gancho automático: si el salto se queda corto, se engancha al borde y sube).' },
};
const MAPS = {
  hero: [
    '...HHHHHH...', '..HHHHHHHH..', '..HSSSSSSH..', '..SRSSSSRS..', '...SFSSFS...', '.CCCSSSSCCC.', 'CCCCAAAACCCC',
    'CCCAAWWAACCC', 'CC.AAAAAA.CC', '...AAAAAA...', '...AA..AA...', '...AA..AA...', '...DD..DD...', '..DDD..DDD..'],
  sk: [
    '...WWWWWW...', '..WWWWWWWW..', '..WDDWWDDW..', '..WDDWWDDW..', '...WWWWWW...', '....WWWW....', '..WWWWWWWW..',
    '...W.WW.W...', '..WWWWWWWW..', '...W.WW.W...', '....WWWW....', '....W..W....', '...WW..WW...', '...WW..WW...'],
  bat1: ['.B........B.', 'BBB......BBB', 'BBBB.BB.BBBB', '.BBBBBBBBBB.', '..BBBRRBBB..', '...BBBBBB...', '....B..B....', '............'],
  bat2: ['............', '....B..B....', '..BBBBBBBB..', '.BBBBRRBBBB.', 'BBBBBBBBBBBB', 'BB.BBBBBB.BB', 'B...B..B...B', '............'],
  kn: [
    '....AAAAAA....', '...AAAAAAAA...', '...AARRRRAA...', '...AAAAAAAA...', '..AAAAAAAAAA..', '.AAGAAAAAAGAA.', '.AAGAAAAAAGAA.', 'AAAGAAAAAAGAAA',
    '.AAGGGAAGGGAA.', '..AAAAAAAAAA..', '..AAAAAAAAAA..', '...AAA..AAA...', '...AAA..AAA...', '...AAA..AAA...', '..DDDD..DDDD..', '..DDDD..DDDD..'],
  gh: [
    '...GGGGGG...', '..GGGGGGGG..', '.GGGGGGGGGG.', '.GGDDGGDDGG.', '.GGDDGGDDGG.', '.GGGGGGGGGG.', '.GGGGDDGGGG.',
    '.GGGGDDGGGG.', '.GGGGGGGGGG.', '.GGGGGGGGGG.', '.GGGGGGGGGG.', '.GG.GGGG.GG.', '.G...GG...G.', '............'],
  garg: [
    'W..............W', 'WW....GGGG....WW', 'WWW..GGGGGG..WWW', 'WWWWGGRGGRGGWWWW', 'WWWWGGGGGGGGWWWW', '.WWWGGGDDGGGWWW.', '..WWGGGGGGGGWW..',
    '...WGGGGGGGGW...', '....GGGGGGGG....', '....GGGGGGGG....', '...GGGGGGGGGG...', '...GGG....GGG...', '...GGG....GGG...', '..GGGG....GGGG..', '..GGG......GGG..', '.DDDD......DDDD.'],
  bishop: [
    '......MMMM......', '.....MMYYMM.....', '......MMMM......', '.....SSSSSS.....', '.....SDSSDS.....', '.....SSSSSS.....', '...PPPPPPPPPP...',
    '..PPPYPPPPYPPP..', '.PPPPPPPPPPPPPP.', '.PPPPPPYYPPPPPP.', '.PPPPPPYYPPPPPP.', '..PPPPPPPPPPPP..', '..PPPPPPPPPPPP..', '...PPPPPPPPPP...',
    '...PPPPPPPPPP...', '....PPPPPPPP....'],
  clock: [
    '....BBBBBBBB....', '...BBBBBBBBBB...', '...BBRRBBRRBB...', '...BBBBBBBBBB...', '.BBBBBBGGBBBBBB.', 'BBBBBBGGGGBBBBBB', 'BBBBBBGGGGBBBBBB',
    'BBBBBBBGGBBBBBBB', '.BBBBBBBBBBBBBB.', '..BBBBBBBBBBBB..', '..BBBB....BBBB..', '..BBBB....BBBB..', '..BBBB....BBBB..', '..BBBB....BBBB..',
    '.DDDDD....DDDDD.', '.DDDDD....DDDDD.'],
  conde: [
    '.....KKKKKK.....', '....KKKKKKKK....', '....KSSSSSSK....', '....KSRSSRSK....', '....KSSSSSSK....', '...KKKSSSSKKK...', '..KKKKKKKKKKKK..',
    '.KKKCCKKKKCCKKK.', '.KKCCCKKKKCCCKK.', 'KKKCCCCKKCCCCKKK', 'KKKCCCCKKCCCCKKK', 'KKCCCCCKKCCCCCKK', 'KKCCCCCKKCCCCCKK', 'KKCCCCCKKCCCCCKK',
    '.KKCCCCKKCCCCKK.', '..KKK......KKK..'],
  altar: [
    '......YY......', '.....YYYY.....', '.....YOOY.....', '......YY......', '.....WWWW.....', '.....WWWW.....', '....WWWWWW....', '....WWWWWW....',
    '...WWWWWWWW...', '...WWDDDDWW...', '..WWWWWWWWWW..', '..WWWWWWWWWW..', '.WWWWWWWWWWWW.', '.DDDDDDDDDDDD.'],
  crystal: ['....CC....', '...CCCC...', '..CCWCCC..', '.CCWCCCCC.', '.CCWCCCCC.', '.CCCCCCDC.', '.CCCCCCDC.', '..CCCCDC..', '..CCCCDC..', '...CCDC...', '....DC....', '.....D....'],
  relic: ['...YYYY...', '..YYWWYY..', '.YYWYYYYY.', 'YYWYYYYYYY', 'YYYYYYYYYY', 'YYYYYYYYYY', '.YYYYYYYY.', '..YYYYYY..', '...YYYY...'],
  npcM: [
    '...HHHHHH...', '..HHHHHHHH..', '..HHFFFFHH..', '..HHFEFEHH..', '..HHFFFFHH..', '...HHMMHH...', '..HHHHHHHH..',
    '.HHHGGGGHHH.', '.HHHGGGGHHH.', '.HHHHHHHHHH.', '..HHHHHHHH..', '..HHH..HHH..', '..DDD..DDD..', '.DDDD..DDDD.'],
  npcMad: [
    '.H.HHHHHH.H.', 'HHHHHHHHHHHH', '.HHSSSSSSHH.', '.HSWWSSWWSH.', '.HSWDSSDWSH.', '.HSSSSSSSSH.', '..SSMMMMSS..',
    '..TTTTTTTT..', '.TTTTTTTTTT.', 'TTT.TTTT.TTT', '.T..TTTT..T.', '....TT.TT...', '....TT.TT...', '...DDD.DDD..'],
  bottle: ['....DD....', '....DD....', '...DDDD...', '....CC....', '...CCCC...', '..CCLLCC..', '.CCCLLCCC.', '.CCCCCCCC.', '.CCCCCCCC.', '.CCCCCCCC.', '..CCCCCC..', '...DDDD...'],
  amulet: ['...DDDD...', '..D....D..', '..D....D..', '...DDDD...', '....DD....', '...GGGG...', '..GGWWGG..', '..GWRRWG..', '..GWRRWG..', '..GGWWGG..', '...GGGG...', '....GG....'],
  hammer: ['..HHHHH...', '.HHHHHHH..', '.HHHHHHH..', '..HHHHH.S.', '......SS..', '.....SS...', '....SS....', '...SS.....', '..SS......', '.SS.......'],
  soul: ['..PP..', '.PPPP.', 'PPWWPP', 'PPWWPP', '.PPPP.', '..PP..'],
  fireA: [
    '......R.......', '.....RRR......', '....RROORR....', '...RROOYORR...', '...ROOYYOOR...', '..RROYYYYORR..', '..ROYYYYYYOR..', '...OYYYYYYO...',
    '..LLLLLLLLLL..', '.LLDLLLLLLDLL.', 'LLLLLLLLLLLLLL', '.DDDDDDDDDDDD.'],
  fireB: [
    '.......R......', '......RRR.....', '.....ROORR....', '....RROYORR...', '...ROOYYOOR...', '...ROYYYYOR...', '..RROYYYYORR..', '...OYYYYYYO...',
    '..LLLLLLLLLL..', '.LLDLLLLLLDLL.', 'LLLLLLLLLLLLLL', '.DDDDDDDDDDDD.'],
  fireOff: [
    '..............', '..............', '..............', '..............', '..............', '..............', '..............', '....E..E......',
    '..LLLLLLLLLL..', '.LLDLLLLLLDLL.', 'LLLLLLLLLLLLLL', '.DDDDDDDDDDDD.'],
  heart: ['.RR.RR.', 'RRRRRRR', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...'],
};
const MAP_PAL = {
  sk: { W: '#e8e4d4', D: '#15101c' },
  bat1: { B: '#5b3a78', R: '#ff3b3b', D: '#15101c' }, bat2: { B: '#5b3a78', R: '#ff3b3b', D: '#15101c' },
  kn: { A: '#8e97ab', G: '#5b6477', R: '#ff3b3b', D: '#2a2f3d' },
  gh: { G: '#bfe3ff', D: '#1d2a44' },
  garg: { W: '#6c7488', G: '#9aa2b6', R: '#ff3b3b', D: '#3a4052' },
  bishop: { M: '#e8e8f4', Y: '#ffd23b', S: '#d9c2a8', D: '#15101c', P: '#6a2f8e' },
  clock: { B: '#b8863a', G: '#ffd98a', R: '#ff3b3b', D: '#5a3f14' },
  conde: { K: '#1a1020', S: '#e8dcdc', R: '#ff2b2b', C: '#a01a2e' },
  aurora: { M: '#fff2d8', Y: '#ffb36a', S: '#ffe3d0', D: '#3a1a2a', P: '#ff8aa8' },
  vesper: { K: '#0c0a2a', S: '#cfd8ff', R: '#6ad0ff', C: '#2a3a9a' },
  altar: { Y: '#ffd23b', O: '#ff7a1c', W: '#b8bdc9', D: '#6a6f7e' },
  crystal: { C: '#ff5b7a', W: '#ffd0da', D: '#a01a3c' },
  relic: { Y: '#ffd23b', W: '#fffbd0' },
  heart: { R: '#ff3b5c' },
  fireA: { R: '#ff4a1c', O: '#ff9a1c', Y: '#ffe066', L: '#6a4a2a', D: '#3a2a1a' }, fireB: { R: '#ff4a1c', O: '#ff9a1c', Y: '#ffe066', L: '#6a4a2a', D: '#3a2a1a' },
  fireOff: { E: '#b04a1a', L: '#4a3a2a', D: '#2a1e14' },
  npcM: { H: '#5a3a7a', F: '#1e1226', E: '#ffd23b', M: '#d9c2a8', G: '#ffd23b', D: '#2a1a10' },
  bottle: { D: '#8a6a4a', C: '#ff3b5c', L: '#ffd0da' },
  amulet: { D: '#ffd23b', G: '#6a3aa8', W: '#e8d4ff', R: '#ff3b5c' },
  hammer: { H: '#c9ced8', S: '#8a5a2a' },
  soul: { P: '#b46bff', W: '#f0dcff' },
};

function drawMapCtx(ctx, map, pal, px, ox, oy) {
  for (let y = 0; y < map.length; y++) for (let x = 0; x < map[y].length; x++) {
    const c = map[y][x]; if (c === '.') continue;
    ctx.fillStyle = pal[c] || '#fff'; ctx.fillRect(ox + x * px, oy + y * px, px, px);
  }
}
function heroPal(color) { return { H: '#16101c', S: '#e8e0f4', R: '#ff2b3b', F: '#ffffff', C: color, A: '#2a2540', D: '#120c18', W: '#c9c4e0' }; }

// Dibuja un héroe en un canvas DOM (para el lobby)
function drawHeroCanvas(canvas, color) {
  canvas.width = 12; canvas.height = 14;
  drawMapCtx(canvas.getContext('2d'), MAPS.hero, heroPal(HERO_COLORS[color]), 1, 0, 0);
}

function rndSeeded(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

function drawTile(ctx, z, k, ox) {
  const p = ZONE_PAL[z], S = 2; // 16x16 lógico -> 32x32
  const r = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(ox + x * S, y * S, w * S, h * S); };
  const rnd = rndSeeded(z * 31 + k * 7 + 5);
  const bricks = (base, line, hi) => {
    r(0, 0, 16, 16, base);
    r(0, 0, 16, 1, line); r(0, 8, 16, 1, line); r(0, 1, 1, 7, line); r(8, 9, 1, 7, line);
    r(1, 1, 7, 1, hi); r(9, 9, 7, 1, hi); r(1, 9, 7, 1, hi);
    for (let i = 0; i < 6; i++) r(Math.floor(rnd() * 15) + 1, Math.floor(rnd() * 14) + 1, 1, 1, line);
  };
  if (z === 6 && (k === 0 || k === 1)) { // roca natural
    r(0, 0, 16, 16, p.base);
    for (let i = 0; i < 14; i++) r(Math.floor(rnd() * 14), Math.floor(rnd() * 14), 2 + Math.floor(rnd() * 3), 2 + Math.floor(rnd() * 3), rnd() < 0.5 ? p.dark : p.light);
    for (let i = 0; i < 8; i++) r(Math.floor(rnd() * 15), Math.floor(rnd() * 15), 1, 1, p.mortar);
    return;
  }
  switch (k) {
    case 0: bricks(p.base, p.mortar, p.light); break;
    case 1: bricks(p.base, p.mortar, p.light); r(0, 0, 16, 3, p.light); r(0, 3, 16, 1, p.dark); for (let i = 0; i < 4; i++) r(Math.floor(rnd() * 14), 3, 2, 2, p.dark); break;
    case 2: r(0, 0, 16, 5, p.base); r(0, 0, 16, 1, p.light); r(0, 4, 16, 1, p.dark); r(0, 5, 16, 1, p.mortar); [2, 7, 12].forEach(x => r(x, 2, 1, 1, p.mortar)); break;
    case 3: bricks(p.bg, p.bgd, p.bg); break;
    case 4: bricks(p.base, p.mortar, p.light); r(7, 6, 1, 2, p.mortar); r(8, 8, 1, 2, p.mortar); break; // grieta apenas visible: hay que fijarse
    case 5: // pinchos
      for (let t = 0; t < 3; t++) { const cx = t * 5 + 2; for (let h = 0; h < 11; h++) { const half = Math.floor((11 - h) / 4); r(cx - half, 15 - h, half * 2 + 1, 1, h > 8 ? '#ffffff' : '#c9ced8'); } }
      r(0, 14, 16, 2, '#6a6f7e'); break;
    case 6: bricks(p.bg, p.bgd, p.bg); r(4, 0, 8, 16, p.dark); r(5, 0, 2, 16, p.base); r(6, 0, 1, 16, p.light); r(11, 0, 1, 16, p.mortar); r(3, 0, 10, 2, p.base); break;
    case 7: bricks(p.bg, p.bgd, p.bg); r(3, 0, 10, 16, p.mortar); r(4, 1, 8, 15, p.glow); r(4, 1, 8, 15, 'rgba(0,0,0,0.55)'); r(7, 1, 2, 15, p.mortar); r(4, 7, 8, 1, p.mortar); r(5, 3, 2, 3, p.glow); break;
  }
}

function buildArt(scene) {
  const tx = scene.textures;
  if (tx.exists('tiles')) return;
  // Tileset: 6 zonas x 8 tipos
  const tiles = tx.createCanvas('tiles', 72 * 32, 32); const tctx = tiles.getContext('2d');
  for (let z = 0; z < 9; z++) for (let k = 0; k < 8; k++) drawTile(tctx, z, k, (z * 8 + k) * 32);
  tiles.refresh();

  const makeMap = (key, mapName, pal, px) => {
    const m = MAPS[mapName]; const c = tx.createCanvas(key, m[0].length * px, m.length * px);
    drawMapCtx(c.getContext('2d'), m, pal, px, 0, 0); c.refresh();
  };
  for (const col in HERO_COLORS) makeMap('hero_' + col, 'hero', heroPal(HERO_COLORS[col]), 1);
  ['sk', 'bat1', 'bat2', 'kn', 'gh', 'garg', 'bishop', 'clock', 'conde', 'altar', 'crystal', 'relic', 'heart'].forEach(n => makeMap(n, n, MAP_PAL[n], 1));

  // vampiros agachados (aplastados contra el suelo)
  for (const col in HERO_COLORS) {
    const src = tx.get('hero_' + col).getSourceImage(); const c = tx.createCanvas('hero_' + col + '_crouch', 12, 14); const g = c.getContext('2d');
    g.imageSmoothingEnabled = false; g.drawImage(src, 0, 0, 12, 14, 0, 5, 12, 9); c.refresh();
  }
  // fotogramas de caminar (piernas abiertas / juntas)
  const legsA = ['...AA...AA..', '..AA.....AA.', '..DD.....DD.', '.DDD....DDD.'], legsB = ['....AAAA....', '....AAAA....', '....DDDD....', '...DDDDDD...'];
  for (const col in HERO_COLORS) [['w1', legsA], ['w2', legsB]].forEach(([n, legs]) => {
    const c = tx.createCanvas('hero_' + col + '_' + n, 12, 14); drawMapCtx(c.getContext('2d'), MAPS.hero.slice(0, 10).concat(legs), heroPal(HERO_COLORS[col]), 1, 0, 0); c.refresh();
  });
  makeMap('npc_merchant', 'npcM', MAP_PAL.npcM, 1);
  makeMap('sentinel', 'kn', { A: '#3a4a6a', G: '#2a3550', R: '#6ad0ff', D: '#1a2238' }, 1);
  makeMap('bonfire1', 'fireA', MAP_PAL.fireA, 1); makeMap('bonfire2', 'fireB', MAP_PAL.fireB, 1); makeMap('bonfire_off', 'fireOff', MAP_PAL.fireOff, 1);
  const madPal = (hair, robe) => ({ H: hair, S: '#e8d0b0', W: '#ffffff', D: '#15101c', M: '#7a1a1a', T: robe });
  makeMap('npc_archivist', 'npcMad', madPal('#d8d4ee', '#6a4a8a'), 1);
  makeMap('npc_prisoner', 'npcMad', madPal('#3a2a1a', '#8a8a96'), 1);
  makeMap('npc_monk', 'npcMad', madPal('#7a5a3a', '#7a5a3a'), 1);
  makeMap('npc_oracle', 'npcMad', madPal('#ffe6b0', '#c9a0ff'), 1);
  makeMap('npc_watcher', 'npcMad', madPal('#b8d8ff', '#5a7aa8'), 1);
  makeMap('aurora', 'bishop', MAP_PAL.aurora, 1); makeMap('vesper', 'conde', MAP_PAL.vesper, 1);
  [['pot', '#ff3b5c', '#ffd0da'], ['pot2', '#b43bff', '#ecd0ff'], ['spd', '#3bd9ff', '#d0f6ff'], ['str', '#ff9a3b', '#ffe2c0'], ['lamp', '#ffe066', '#fffbe0'], ['ward', '#c9ced8', '#ffffff'], ['rage', '#d4ff3b', '#f6ffd0'], ['tonic', '#3bff9a', '#d0ffe6'], ['fruit', '#ff3bd9', '#ffd0f4']].forEach(([k, c, l]) => makeMap('it_' + k, 'bottle', { D: '#8a6a4a', C: c, L: l }, 1));
  makeMap('it_amu', 'amulet', MAP_PAL.amulet, 1);
  makeMap('forge', 'hammer', MAP_PAL.hammer, 1);
  makeMap('soul', 'soul', MAP_PAL.soul, 1);
  const mk = (key, w, h, fn) => { const c = tx.createCanvas(key, w, h); fn(c.getContext('2d')); c.refresh(); };
  mk('orb', 8, 8, g => { g.fillStyle = '#ff2b4a'; g.fillRect(2, 0, 4, 8); g.fillRect(0, 2, 8, 4); g.fillStyle = '#ffd0d8'; g.fillRect(3, 2, 2, 2); });
  mk('shock', 16, 8, g => { g.fillStyle = '#ffb347'; g.fillRect(0, 4, 16, 4); g.fillRect(3, 2, 10, 2); g.fillRect(6, 0, 4, 2); g.fillStyle = '#fff3c0'; g.fillRect(6, 4, 4, 2); });
  mk('gear', 12, 12, g => { g.fillStyle = '#c29a4a'; g.fillRect(2, 0, 8, 12); g.fillRect(0, 2, 12, 8); g.fillStyle = '#5a4318'; g.fillRect(4, 4, 4, 4); g.fillStyle = '#ffe08a'; g.fillRect(3, 1, 2, 1); });
  mk('slash', 22, 22, g => { g.fillStyle = '#ffffff'; for (let a = -1.2; a <= 1.2; a += 0.04) { for (let rr = 7; rr <= 10; rr++) g.fillRect(Math.round(11 + Math.cos(a) * rr), Math.round(11 + Math.sin(a) * rr), 2, 2); } g.fillStyle = '#9fd4ff'; for (let a = -1.0; a <= 1.0; a += 0.05) g.fillRect(Math.round(11 + Math.cos(a) * 9), Math.round(11 + Math.sin(a) * 9), 1, 1); });
  mk('flame1', 6, 9, g => { g.fillStyle = '#ff7a1c'; g.fillRect(1, 3, 4, 6); g.fillRect(2, 1, 2, 3); g.fillStyle = '#ffd23b'; g.fillRect(2, 4, 2, 4); g.fillStyle = '#6a4a2a'; g.fillRect(1, 8, 4, 1); });
  mk('flame2', 6, 9, g => { g.fillStyle = '#ff7a1c'; g.fillRect(1, 4, 4, 5); g.fillRect(3, 0, 2, 4); g.fillStyle = '#ffd23b'; g.fillRect(2, 5, 2, 3); g.fillStyle = '#6a4a2a'; g.fillRect(1, 8, 4, 1); });
  mk('spear', 34, 8, g => { g.fillStyle = '#c9ced8'; g.fillRect(0, 3, 26, 2); g.fillStyle = '#ffffff'; g.fillRect(26, 1, 6, 6); g.fillRect(32, 3, 2, 2); });
  mk('arrow', 16, 5, g => { g.fillStyle = '#a07a52'; g.fillRect(0, 2, 12, 1); g.fillStyle = '#e8e8f4'; g.fillRect(12, 1, 3, 3); g.fillRect(15, 2, 1, 1); g.fillStyle = '#ff6a8a'; g.fillRect(0, 1, 3, 3); });
  mk('ring', 20, 6, g => { g.strokeStyle = '#ff3b3b'; g.lineWidth = 1; g.fillStyle = 'rgba(255,60,60,0.35)'; g.beginPath(); g.ellipse(10, 3, 9, 2.4, 0, 0, Math.PI * 2); g.fill(); g.stroke(); });
  mk('pillar', 12, 50, g => { const gr = g.createLinearGradient(0, 0, 0, 50); gr.addColorStop(0, 'rgba(255,200,200,0.95)'); gr.addColorStop(0.35, '#ff3b3b'); gr.addColorStop(1, '#7a0a14'); g.fillStyle = gr; g.fillRect(2, 0, 8, 50); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(4, 0, 2, 50); });
  mk('saw', 14, 14, g => { // sierra circular
    g.translate(7, 7); g.fillStyle = '#c9ced8';
    for (let i = 0; i < 8; i++) { g.save(); g.rotate(i * Math.PI / 4); g.fillRect(-1, -7, 2, 3); g.restore(); }
    g.beginPath(); g.arc(0, 0, 5, 0, Math.PI * 2); g.fill(); g.fillStyle = '#6a6f7e'; g.beginPath(); g.arc(0, 0, 2.2, 0, Math.PI * 2); g.fill(); g.fillStyle = '#ff5a5a'; g.fillRect(-0.5, -4, 1, 2);
  });
  mk('bomb', 10, 10, g => { g.fillStyle = '#1a1a22'; g.beginPath(); g.arc(5, 6, 4, 0, Math.PI * 2); g.fill(); g.fillStyle = '#5a5a6a'; g.fillRect(3, 4, 2, 2); g.fillStyle = '#c9a26a'; g.fillRect(5, 0, 1, 3); g.fillStyle = '#ffb347'; g.fillRect(5, 0, 2, 1); });
  mk('it_bomb', 12, 12, g => { g.fillStyle = '#1a1a22'; g.beginPath(); g.arc(6, 7, 5, 0, Math.PI * 2); g.fill(); g.fillStyle = '#6a6a7a'; g.fillRect(3, 4, 2, 2); g.fillStyle = '#c9a26a'; g.fillRect(6, 0, 1, 3); g.fillStyle = '#ffb347'; g.fillRect(6, 0, 3, 1); g.fillStyle = '#ff5a5a'; g.fillRect(8, 0, 1, 1); });
  mk('page', 10, 12, g => { g.fillStyle = '#e8d8b0'; g.fillRect(1, 0, 8, 12); g.fillStyle = '#b89a62'; g.fillRect(1, 0, 8, 1); g.fillRect(1, 11, 8, 1); g.fillStyle = '#6a4a2a'; [2, 4, 6, 8].forEach(y => g.fillRect(2, y, 6, 1)); g.fillStyle = '#c03a3a'; g.fillRect(7, 8, 2, 3); });
  mk('puff', 8, 8, g => { g.fillStyle = '#ffffff'; g.fillRect(2, 0, 4, 8); g.fillRect(0, 2, 8, 4); });
  mk('light', 128, 128, g => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  mk('sconce', 6, 5, g => { g.fillStyle = '#6a4a2a'; g.fillRect(1, 0, 4, 2); g.fillRect(2, 2, 2, 3); g.fillStyle = '#3a2a1a'; g.fillRect(1, 1, 4, 1); });
  mk('glow', 64, 64, g => { const gr = g.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(255,200,120,0.55)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
}
