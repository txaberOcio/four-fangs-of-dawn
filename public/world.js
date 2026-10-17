/* Castillo de los Vampiros: definición del mundo (usada por el juego y por el validador).
   El mundo es una malla de celdas de 26x18 tiles, pero las ÁREAS pueden ocupar varias celdas
   (anchas, altas), llevar pasillos rellenos de roca y conectarse con puertas de distinto tamaño. */
(function (root) {
  'use strict';
  const T = 32, CW = 26, CH = 18, COLS = 15, ROWS = 7;
  const PHYS = {
    gravity: 900, speed: 165, jump: -470, djump: -420,
    dashSpeed: 560, dashTime: 0.25, dashCd: 0.5,
    wjY: -430, wjX: 190, wjLock: 0.18, slide: 110, maxFall: 700,
    bodyW: 30, bodyH: 39,
  };
  const ZONES = ['Vestíbulo', 'Biblioteca', 'Capilla', 'Calabozos', 'Torre del Reloj', 'Sala Real', '', 'Torres del Alba'];
  const ABILITIES = { dash: 'Impulso (dash)', dj: 'Doble salto', wj: 'Salto de pared', wings: 'Alas del Alba', eye: 'Ojo de la Noche' };
  const K = { SOLID: 0, FLOOR: 1, ONEWAY: 2, BG: 3, CRACK: 4, SPIKES: 5, PILLAR: 6, WINDOW: 7 };
  const ROCK = 6; // zona 6 = roca natural entre salas
  const kind = idx => (idx < 0 ? -1 : idx % 8);
  const isSolidKind = k => k === K.SOLID || k === K.FLOOR || k === K.CRACK;
  const BOSSES = {
    garg: { name: 'Gárgola de Piedra', hp: 12, drop: 'dash' },
    bishop: { name: 'Obispo Caído', hp: 15, drop: 'dj' },
    clock: { name: 'Guardián del Reloj', hp: 18, drop: 'wj' },
    conde: { name: 'El Conde', hp: 42, drop: null },
    // los dos rivales del Alba: al caer uno, el otro lo rescata y huye (solo se puede elegir a uno)
    aurora: { name: 'Aurora, Dama del Alba', hp: 20, drop: 'wings', rival: 'vesper', reward: 'Alas del Alba: mantén saltar en el aire para planear' },
    vesper: { name: 'Vesper, Señor del Ocaso', hp: 24, drop: 'eye', rival: 'aurora', reward: 'Ojo de la Noche: ves los secretos tras los muros agrietados y tu luz crece' },
  };

  // ---------- Definición de áreas ----------
  // area(id, nombre, zona, celdaX, celdaY, anchoCeldas, altoCeldas, ops)
  // ops (coords locales al área): ['P',x,y,w] plataforma | ['B',x,y,w,h] bloque | ['K',x,y,w,h] rompible | ['S',x,y,w] pinchos
  //   ['forge',x,y] mejora de arma | ['npc',tipo,x,y] personaje |
  //   ['pit',x0,x1] foso | ['E',tipo,x,y] enemigo | ['cry',x,y] cristal | ['altar',x,y] | ['boss',id,x,y]
  //   ['climb',hx,hw,tipo,hayAgujero] subida en zigzag hacia un agujero en el techo (norm | dj | dash)
  const AREAS = [];
  const area = (id, name, z, c, r, w, h, ops) => AREAS.push({ id, name, z, c, r, w, h, ops: ops || [] });

  // --- Ala de entrada (camino principal hacia la Gárgola) ---
  area('vest', 'Vestíbulo', 0, 2, 6, 1, 1, [['npc', 'merchant', 13, 16], ['tri', 'tl', 5], ['tri', 'tr', 5], ['altar', 6, 16], ['E', 'sk', 18, 16], ['E', 'sk', 21, 16]]);
  area('salon', 'Gran Salón', 0, 3, 6, 2, 1, [['tri', 'tl', 6], ['tri', 'tr', 6], ['climb', 11, 4, 'norm', true], ['B', 18, 15, 2, 2], ['B', 33, 15, 3, 2], ['B', 44, 14, 2, 3],
    ['P', 28, 12, 5], ['P', 40, 10, 5], ['E', 'sk', 7, 16], ['E', 'sk', 23, 16], ['E', 'sk', 38, 16], ['E', 'kn', 47, 16], ['E', 'bat', 30, 6], ['E', 'bat', 42, 5]]);
  area('corr', 'Corredor de Armaduras', 0, 5, 5, 1, 2, [['page', 23, 16], 
    // Sección alta ("Galería de Armaduras"): se llega por arriba, desde el Pozo; un hueco permite dejarse caer al pasillo (atajo al inicio)
    ['B', 1, 17, 10, 13], ['B', 15, 17, 10, 13], ['tri', 'tl', 5], ['tri', 'tr', 5],
    ['E', 'kn', 7, 16, { elite: true, name: 'Capitán de Armaduras', reward: { souls: 60, item: 'ward' } }], ['E', 'kn', 20, 16], ['E', 'bat', 12, 6],
    // Sección baja: el pasillo que ya conoces. El pozo de arriba solo se puede escalar con el Salto de pared
    ['B', 12, 33, 1, 2], ['E', 'kn', 8, 34], ['E', 'kn', 17, 34], ['E', 'sk', 22, 34]]);
  area('foso', 'Foso de Espinas', 0, 6, 6, 1, 1, [['tri', 'tl', 4], ['tri', 'tr', 4], ['pit', 6, 19], ['P', 7, 14, 3], ['P', 12, 13, 3], ['P', 17, 14, 3], ['E', 'bat', 8, 8], ['E', 'bat', 13, 7], ['E', 'bat', 18, 8]]);
  area('cubil', 'Cubil de la Gárgola', 0, 7, 6, 1, 1, [['climb', 11, 4, 'norm', true], ['boss', 'garg', 13, 16]]);
  // --- Ramas del ala de entrada ---
  area('tunel', 'Túnel de Calaveras', 3, 6, 5, 1, 1, [['tri', 'tl', 4], ['tri', 'tr', 4], ['pit', 8, 16], ['E', 'bat', 12, 8], ['E', 'bat', 18, 6], ['E', 'gh', 4, 9]]);
  area('bodega', 'Bodega', 3, 1, 6, 1, 1, [['forge', 20, 12], ['tri', 'tr', 5], ['B', 5, 15, 3, 2], ['B', 19, 14, 3, 3], ['E', 'sk', 9, 16], ['E', 'sk', 22, 16], ['E', 'bat', 15, 9]]);
  area('cripta', 'Cripta Olvidada', 3, 0, 6, 1, 1, [['tri', 'tl', 6], ['pit', 7, 15], ['cry', 2, 16], ['E', 'gh', 20, 9], ['E', 'gh', 4, 8]]);
  area('osario', 'Osario', 3, 8, 6, 2, 1, [['tri', 'tl', 7], ['tri', 'tr', 5], ['P', 30, 14, 4], ['P', 35, 11, 4], ['B', 40, 6, 8, 1], ['cry', 43, 5], ['E', 'gh', 15, 10], ['E', 'gh', 32, 6], ['E', 'sk', 10, 16], ['E', 'sk', 25, 16]]);
  area('escal', 'Escalera de los Retratos', 0, 3, 4, 1, 2, [['tri', 'tl', 6], ['tri', 'tr', 6], ['climb', 11, 4, 'norm', true], ['E', 'bat', 6, 10], ['E', 'bat', 20, 20], ['E', 'gh', 8, 28], ['E', 'sk', 20, 34]]);
  area('hidden', 'Sala Oculta', 0, 2, 5, 1, 1, [['tri', 'tl', 5], ['tri', 'tr', 5], ['cry', 13, 16]]);
  // --- Ala de la Biblioteca (rama larga y opcional) ---
  area('archivo', 'Archivo', 1, 3, 3, 1, 1, [['npc', 'archivist', 17, 16], ['tri', 'tr', 6], ['E', 'sk', 7, 16], ['E', 'sk', 21, 16], ['E', 'bat', 18, 8]]);
  area('lect', 'Sala de Lectura', 1, 2, 3, 1, 1, [['page', 12, 16], ['forge', 21, 10], ['tri', 'tl', 5], ['B', 8, 14, 2, 3], ['B', 17, 15, 3, 2], ['P', 4, 11, 4], ['P', 20, 11, 4], ['E', 'sk', 6, 16], ['E', 'kn', 22, 16], ['E', 'bat', 12, 8]]);
  area('gbib', 'Gran Biblioteca', 1, 0, 3, 2, 1, [['forge', 42, 11], ['tri', 'tl', 8], ['tri', 'tr', 8], ['climb', 11, 4, 'norm', true], ['B', 20, 14, 2, 3], ['B', 30, 15, 3, 2], ['P', 24, 11, 5], ['P', 40, 12, 5],
    ['E', 'kn', 17, 16, { elite: true, name: 'Bibliotecario Maldito', reward: { souls: 50, item: 'bomb' } }], ['E', 'kn', 36, 16], ['E', 'gh', 26, 7], ['E', 'gh', 44, 8], ['E', 'bat', 10, 6]]);
  area('obs', 'Observatorio', 1, 0, 1, 1, 2, [['tri', 'tl', 7], ['tri', 'tr', 7], ['climb', 11, 4, 'dash', false], ['cry', 13, 2], ['E', 'gh', 6, 24], ['E', 'gh', 20, 14], ['E', 'bat', 12, 30]]);
  // --- Pozo y calabozos (camino principal tras la Gárgola) ---
  area('pozo', 'Pozo de las Almas', 3, 7, 4, 1, 2, [['tri', 'tl', 5], ['tri', 'tr', 5], ['climb', 11, 4, 'norm', true], ['E', 'bat', 8, 28], ['E', 'gh', 18, 20], ['E', 'gh', 8, 10], ['E', 'sk', 20, 34]]);
  area('calab', 'Calabozo Norte', 3, 7, 3, 1, 1, [['npc', 'prisoner', 18, 16], ['tri', 'tr', 4], ['E', 'gh', 10, 9], ['E', 'kn', 23, 16], ['E', 'sk', 6, 16]]);
  area('mazm', 'Mazmorra de Hierro', 3, 8, 3, 2, 1, [['tri', 'tl', 6], ['P', 30, 14, 4], ['P', 34, 11, 4], ['B', 40, 6, 8, 1], ['cry', 43, 5], ['E', 'gh', 18, 9], ['E', 'kn', 14, 16], ['E', 'sk', 27, 16]]);
  area('caden', 'Pasaje de Cadenas', 3, 5, 3, 2, 1, [['page', 45, 16], ['B', 1, 1, 36, 11], ['B', 41, 1, 10, 11], ['E', 'kn', 10, 16, { elite: true, name: 'Carcelero', reward: { souls: 70, item: 'pot2' } }], ['E', 'sk', 20, 16], ['E', 'sk', 30, 16], ['E', 'kn', 41, 16]]);
  // --- Capilla (camino principal hacia el Obispo) ---
  area('naveS', 'Capilla: Nave Sur', 2, 4, 3, 1, 1, [['npc', 'monk', 18, 16], ['npc', 'merchant', 22, 16], ['tri', 'tl', 7], ['tri', 'tr', 7], ['climb', 11, 4, 'norm', true], ['altar', 5, 16], ['E', 'kn', 8, 16], ['E', 'gh', 18, 6], ['E', 'kn', 14, 16]]);
  area('naveP', 'Capilla: Nave Principal', 2, 4, 1, 1, 2, [['page', 5, 34], ['tri', 'tl', 9], ['tri', 'tr', 9], ['climb', 11, 4, 'dash', true], ['E', 'gh', 8, 14], ['E', 'gh', 18, 24, { elite: true, name: 'Espectro Penitente', reward: { souls: 80, item: 'spd' } }], ['E', 'bat', 10, 28], ['E', 'kn', 20, 34]]);
  area('abs', 'Ábside', 2, 4, 0, 1, 1, [['tri', 'tl', 7], ['tri', 'tr', 7], ['boss', 'bishop', 13, 12]]);
  area('mir', 'Mirador', 2, 5, 0, 1, 1, [['npc', 'merchant', 23, 16], ['tri', 'tr', 6], ['B', 11, 9, 4, 8], ['P', 6, 14, 4], ['altar', 21, 16], ['E', 'gh', 20, 10], ['E', 'sk', 4, 16]]);
  // --- Torre del Reloj y final ---
  area('galeria', 'Galería de Engranajes', 4, 5, 1, 1, 2, [['page', 23, 34], ['tri', 'tl', 5], ['tri', 'tr', 5],
    ['P', 14, 5, 8], ['P', 6, 9, 5], ['P', 14, 12, 4], ['P', 21, 15, 4], ['P', 12, 18, 5], ['P', 4, 21, 5], ['P', 12, 24, 4], ['P', 19, 27, 4], ['P', 11, 30, 5], ['pit', 1, 16],
    ['E', 'sk', 17, 4], ['E', 'sentinel', 14, 17], ['E', 'sentinel', 20, 34], ['E', 'bat', 9, 7], ['E', 'bat', 20, 16], ['E', 'bat', 10, 28],
    ['E', 'saw', 11, 7, { ax: 'h', r: 90, w: 1.4 }], ['E', 'saw', 19, 13, { ax: 'v', r: 55, w: 1.8 }], ['E', 'saw', 9, 20, { ax: 'h', r: 110, w: 1.2 }], ['E', 'saw', 15, 26, { ax: 'v', r: 65, w: 1.6 }]]);
  area('torre', 'Torre del Reloj', 4, 6, 1, 1, 2, [['forge', 4, 34], ['tri', 'tl', 6], ['tri', 'tr', 6], ['climb', 11, 4, 'dj', true], ['cry', 22, 34], ['E', 'kn', 8, 34, { elite: true, name: 'Relojero Oxidado', reward: { souls: 100, item: 'rage' } }], ['E', 'gh', 20, 24], ['E', 'gh', 8, 10], ['E', 'bat', 14, 28], ['E', 'saw', 13, 21, { ax: 'h', r: 90, w: 1.2 }], ['E', 'saw', 13, 13, { ax: 'h', r: 80, w: 1.5 }]]);
  area('clkC', 'Cámara del Reloj', 4, 6, 0, 1, 1, [['torch', 4, 12], ['torch', 9, 12], ['torch', 14, 12], ['torch', 19, 12], ['torch', 23, 12], ['tri', 'tl', 5], ['tri', 'tr', 5], ['boss', 'clock', 19, 16]]);
  area('pasR', 'Pasillo Real', 5, 7, 0, 1, 1, [['page', 20, 16], ['tri', 'tl', 5], ['B', 11, 3, 4, 14], ['B', 7, 3, 1, 10], ['cry', 13, 2], ['altar', 22, 16], ['E', 'gh', 3, 9]]);
  // Arena inferior del Conde: no tiene puertas; se llega al romperse el suelo del trono. 'special' = fuera de la comprobación de alcance
  area('fosoC', 'Foso del Conde', 5, 8, 1, 2, 1, [['special'], ['B', 5, 15, 5, 2], ['B', 7, 14, 2, 1], ['B', 14, 16, 3, 1], ['B', 15, 15, 1, 1], ['B', 22, 15, 4, 2], ['B', 23, 14, 2, 1],
    ['B', 31, 16, 3, 1], ['B', 36, 15, 5, 2], ['B', 38, 14, 2, 1], ['B', 45, 15, 4, 2], ['P', 10, 11, 4], ['P', 19, 12, 5], ['P', 29, 10, 5], ['P', 40, 11, 4]]);
  area('throne', 'Sala del Trono', 5, 8, 0, 2, 1, [['tri', 'tl', 10], ['tri', 'tr', 10], ['boss', 'conde', 26, 14]]);

  // ---------- Conexiones ----------
  // --- Torres del Alba (tras el Conde): su huida abre el foso por ambos lados ---
  area('escalaR', 'Escalera Real', 5, 7, 1, 1, 2, [['climb', 16, 4, 'norm', true], ['E', 'gh', 6, 30], ['E', 'bat', 14, 20], ['E', 'gh', 20, 12]]);
  area('alba1', 'Torre del Alba', 7, 10, 0, 1, 2, [['P', 3, 32, 5], ['P', 10, 29, 5], ['P', 17, 26, 5], ['P', 9, 23, 5], ['P', 3, 20, 5], ['P', 10, 17, 5], ['P', 17, 17, 8],
    ['E', 'kn', 14, 34], ['E', 'bat', 12, 10], ['E', 'gh', 18, 22], ['E', 'gh', 6, 14], ['E', 'bat', 20, 28]]);
  area('albaH', 'Sala de los Rivales', 7, 11, 0, 2, 1, [['npc', 'oracle', 14, 16], ['altar', 4, 16], ['tri', 'tl', 4], ['tri', 'tr', 4]]);
  area('albaA', 'Cámara de Aurora (premio: Alas del Alba)', 7, 13, 0, 2, 1, [['tri', 'tl', 6], ['tri', 'tr', 6], ['boss', 'aurora', 26, 10]]);
  area('albaB', 'Cámara de Vesper (premio: Ojo de la Noche)', 7, 11, 1, 2, 1, [['tri', 'tl', 5], ['tri', 'tr', 5], ['climb', 24, 4, 'norm', true], ['boss', 'vesper', 40, 16]]);

  const LINKS = [];
  // E(oeste, este, tamañoPuerta, opts): puerta horizontal pegada al suelo
  const E = (a, b, size = 3, o = {}) => LINKS.push({ t: 'E', a, b, size, ...o });
  // S(arriba, abajo, x, tamaño): hueco vertical; x es local al área de arriba
  const S = (a, b, x = 11, size = 4, o = {}) => LINKS.push({ t: 'S', a, b, x, size, ...o });
  E('cripta', 'bodega'); E('bodega', 'vest'); E('vest', 'salon'); E('salon', 'corr'); E('corr', 'foso');
  E('foso', 'cubil', 5); E('cubil', 'osario', 1); E('corr', 'tunel'); E('tunel', 'pozo'); // puerta de 1 tile: hay que agacharse
  E('hidden', 'escal', 3, { crack: true });
  E('gbib', 'lect', 4); E('lect', 'archivo'); E('archivo', 'naveS', 3, { crack: true });
  E('naveS', 'caden'); E('caden', 'calab'); E('calab', 'mazm');
  E('abs', 'mir', 4); E('galeria', 'torre'); E('clkC', 'pasR', 6); E('pasR', 'throne', 5);
  S('archivo', 'escal'); S('escal', 'salon'); S('obs', 'gbib'); S('pozo', 'cubil'); S('calab', 'pozo');
  E('escalaR', 'fosoC', 3, { gate: 'conde' }); E('fosoC', 'alba1', 3, { gate: 'conde' }); S('pasR', 'escalaR', 16, 4);
  E('alba1', 'albaH', 3); E('albaH', 'albaA', 4); S('albaH', 'albaB', 24, 4);
  S('naveP', 'naveS'); S('abs', 'naveP'); S('clkC', 'torre'); S('mir', 'galeria', 16, 4); S('torre', 'caden');

  function climbOps(rw, rh, hx, hw, type) {
    const ops = [], hc = Math.floor(hx + hw / 2);
    const ys = []; for (let y = rh - 4; y >= 5; y -= 3) ys.push(y);
    ys.forEach((y, idx) => {
      const i = idx + 1;
      if (type === 'dj' && i === 2) return;
      let x;
      if (type === 'dash' && i === 1) x = hc + 5; else if (type === 'dash' && i === 2) x = hc - 9; else if (type === 'dash' && i === 3) x = hc - 2;
      else x = (i % 2 === 1) ? hc + 1 : hc - 6;
      ops.push(['P', Math.max(2, x), y, 5]);
    });
    ops.push(['P', hx - 1, 2, hw + 2]);
    return ops;
  }

  function build() {
    const Wt = COLS * CW, Ht = ROWS * CH + 2;
    const mk = () => Array.from({ length: Ht }, () => new Array(Wt).fill(-1));
    const fg = mk(), bg = mk(), areaAt = Array.from({ length: Ht }, () => new Array(Wt).fill(-1));
    for (let y = 0; y < Ht; y++) for (let x = 0; x < Wt; x++) fg[y][x] = ROCK * 8 + K.SOLID;
    const world = { T, COLS, ROWS, CW, CH, Wt, Ht, fg, bg, areaAt, areas: {}, areaList: AREAS, spawns: [], crystals: [], altars: [], forges: [], npcs: [], pages: [], bosses: [], torches: [], links: LINKS, ZONES, PHYS, BOSSES, gates: [] };
    let uid = 1;
    // 1) interior de cada área
    for (const a of AREAS) {
      a.x0 = a.c * CW; a.y0 = a.r * CH; a.rw = a.w * CW; a.rh = a.h * CH; a.seal = []; a.exits = {};
      world.areas[a.id] = a;
      const z = a.z * 8;
      for (let y = 0; y < a.rh; y++) for (let x = 0; x < a.rw; x++) {
        const gx = a.x0 + x, gy = a.y0 + y;
        areaAt[gy][gx] = AREAS.indexOf(a);
        bg[gy][gx] = z + K.BG;
        const border = x === 0 || y === 0 || x === a.rw - 1 || y === a.rh - 1;
        fg[gy][gx] = border ? z + (y === a.rh - 1 ? K.FLOOR : K.SOLID) : -1;
      }
      // decoración de fondo
      for (let y = 1; y < a.rh - 1; y++) for (let x = 7; x < a.rw - 1; x += 11) bg[a.y0 + y][a.x0 + x] = z + K.PILLAR;
      for (let x = 4; x < a.rw - 2; x += 11) for (let k = 0; k < 2; k++) for (let yy = 4; yy < a.rh; yy += 18) bg[a.y0 + yy + k][a.x0 + x] = z + K.WINDOW;
    }
    const setF = (a, x, y, k) => { if (x < 0 || y < 0 || x >= a.rw || y >= a.rh) return; fg[a.y0 + y][a.x0 + x] = k < 0 ? -1 : a.z * 8 + k; };
    const free = (a, x, y) => fg[a.y0 + y][a.x0 + x] === -1;
    // 2) conexiones
    for (const l of LINKS) {
      const A = world.areas[l.a], B = world.areas[l.b];
      if (!A || !B) throw new Error('Enlace a área inexistente ' + l.a + ' ' + l.b);
      if (l.t === 'E') {
        if (A.x0 + A.rw !== B.x0) throw new Error('E no adyacente ' + l.a + '→' + l.b);
        const bottom = Math.min(A.y0 + A.rh, B.y0 + B.rh), lift = l.lift || 0;
        for (let i = 0; i < l.size; i++) {
          const gy = bottom - 2 - lift - i;
          if (gy < A.y0 + 1 || gy < B.y0 + 1) throw new Error('Puerta fuera de rango ' + l.a + '→' + l.b);
          const gxA = A.x0 + A.rw - 1, gxB = B.x0;
          if (l.gate) { // puerta cerrada hasta que cae el jefe indicado
            fg[gy][gxA] = A.z * 8 + K.SOLID; fg[gy][gxB] = B.z * 8 + K.SOLID;
            let g = world.gates.find(q => q.boss === l.gate); if (!g) world.gates.push(g = { boss: l.gate, tiles: [] });
            g.tiles.push({ gx: gxA, gy }, { gx: gxB, gy }); continue;
          }
          fg[gy][gxA] = l.crack ? A.z * 8 + K.CRACK : -1; fg[gy][gxB] = l.crack ? B.z * 8 + K.CRACK : -1;
          if (!l.crack) { A.seal.push({ gx: gxA, gy }); B.seal.push({ gx: gxB, gy }); }
        }
      } else {
        if (A.y0 + A.rh !== B.y0) throw new Error('S no adyacente ' + l.a + '→' + l.b);
        for (let i = 0; i < l.size; i++) {
          const gx = A.x0 + l.x + i, gyA = A.y0 + A.rh - 1, gyB = B.y0;
          if (gx < B.x0 + 1 || gx >= B.x0 + B.rw - 1) throw new Error('Hueco fuera de rango ' + l.a + '→' + l.b);
          fg[gyA][gx] = -1; fg[gyB][gx] = -1;
          A.seal.push({ gx, gy: gyA }); B.seal.push({ gx, gy: gyB });
        }
      }
    }
    // 3) contenido
    for (const a of AREAS) {
      const cnt = {}, sid = k => k + '_' + a.id + '_' + (cnt[k] = (cnt[k] || 0) + 1); // ids estables para guardar partida
      a.safe = a.ops.some(op => op[0] === 'npc' || op[0] === 'altar'); // zona segura: sin enemigos
      a.special = a.ops.some(op => op[0] === 'special');
      const ops = [];
      for (const op of a.ops) { if (op[0] === 'climb') climbOps(a.rw, a.rh, op[1], op[2], op[3]).forEach(o => ops.push(o)); else ops.push(op); }
      for (const op of ops) {
        switch (op[0]) {
          case 'P': for (let x = op[1]; x < op[1] + op[3]; x++) if (free(a, x, op[2])) setF(a, x, op[2], K.ONEWAY); break;
          case 'B': for (let y = op[2]; y < op[2] + op[4]; y++) for (let x = op[1]; x < op[1] + op[3]; x++) setF(a, x, y, K.SOLID); break;
          case 'K': for (let y = op[2]; y < op[2] + op[4]; y++) for (let x = op[1]; x < op[1] + op[3]; x++) setF(a, x, y, K.CRACK); break;
          case 'S': for (let x = op[1]; x < op[1] + op[3]; x++) setF(a, x, op[2], K.SPIKES); break;
          case 'tri': { const n = op[2]; for (let i = 0; i < n; i++) { const wd = n - i; for (let k = 0; k < wd; k++) setF(a, op[1] === 'tl' ? 1 + k : a.rw - 2 - k, 1 + i, K.SOLID); } break; }
          case 'forge': world.forges.push({ id: sid('f'), area: a.id, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T }); break;
          case 'npc': world.npcs.push({ id: sid('n'), area: a.id, type: op[1], x: (a.x0 + op[2] + 0.5) * T, y: (a.y0 + op[3] + 1) * T }); break;
          case 'torch': world.torches.push({ id: world.torches.length, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T, z: a.z, area: a.id, lit: true, r: 150 }); break;
          case 'pit': for (let x = op[1]; x <= op[2]; x++) setF(a, x, a.rh - 1, K.SPIKES); break;
          case 'E': if (a.safe) break; world.spawns.push({ id: 'e' + (uid++), area: a.id, type: op[1], x: (a.x0 + op[2] + 0.5) * T, y: (a.y0 + op[3] + 1) * T, opts: op[4] || null, zone: a.z }); break;
          case 'page': world.pages.push({ id: sid('p'), area: a.id, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T }); break;
          case 'cry': world.crystals.push({ id: sid('c'), area: a.id, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T }); break;
          case 'altar': world.altars.push({ id: sid('a'), area: a.id, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 1) * T }); break;
          case 'boss': world.bosses.push({ id: op[1], area: a.id, x: (a.x0 + op[2] + 0.5) * T, y: (a.y0 + op[3] + 1) * T, ...BOSSES[op[1]] }); a.boss = op[1]; break;
        }
      }
      // antorchas
      if (!a.ops.some(o => o[0] === 'torch')) for (let x = 5; x < a.rw - 4; x += 13) for (let k = 0; k < a.h; k++) for (const dy of [13, 12, 14, 11]) { const yy = k * 18 + dy; if (yy < a.rh - 1 && yy > 1 && free(a, x, yy)) { world.torches.push({ id: world.torches.length, x: (a.x0 + x + 0.5) * T, y: (a.y0 + yy + 0.5) * T, z: a.z, area: a.id, lit: a.z !== 3, r: 215 }); break; } }
    }
    world.spawnPoint = world.altars.find(a => a.area === 'vest');
    world.areaOf = (gx, gy) => { const i = (areaAt[gy] || [])[gx]; return i >= 0 && i !== undefined ? AREAS[i] : null; };
    return world;
  }

  const api = { build, T, COLS, ROWS, CW, CH, PHYS, K, ROCK, kind, isSolidKind, ZONES, ABILITIES, BOSSES };
  root.World = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
