/* Four Fangs of Dawn: definición del mundo (usada por el juego y por el validador).
   El mundo es una malla de celdas de 26x18 tiles, pero las ÁREAS pueden ocupar varias celdas
   (anchas, altas), llevar pasillos rellenos de roca y conectarse con puertas de distinto tamaño. */
(function (root) {
  'use strict';
  const T = 32, CW = 26, CH = 18, COLS = 22, ROWS = 10;
  const PHYS = {
    gravity: 900, speed: 165, jump: -470, djump: -420,
    dashSpeed: 560, dashTime: 0.25, dashCd: 0.5,
    wjY: -430, wjX: 190, wjLock: 0.18, slide: 110, maxFall: 700,
    bodyW: 30, bodyH: 39,
  };
  const ZONES = ['Vestíbulo', 'Biblioteca', 'Capilla', 'Calabozos', 'Torre del Reloj', 'Sala Real', '', 'Torres del Alba', 'Cueva del Abismo', 'Calabozos Profundos'];
  const ABILITIES = { dash: 'Impulso (dash)', dj: 'Doble salto', wj: 'Salto de pared', wings: 'Alas del Alba', eye: 'Ojo de la Noche', pound: 'Pisotón de Raíces' };
  const K = { SOLID: 0, FLOOR: 1, ONEWAY: 2, BG: 3, CRACK: 4, SPIKES: 5, PILLAR: 6, WINDOW: 7 };
  const ROCK = 6; // zona 6 = roca natural entre salas
  const kind = idx => (idx < 0 ? -1 : idx % 8);
  const isSolidKind = k => k === K.SOLID || k === K.FLOOR || k === K.CRACK;
  const BOSSES = {
    garg: { name: 'Gárgola de Piedra', hp: 12, drop: 'dash' },
    bishop: { name: 'Obispo Caído', hp: 22, drop: 'dj' },
    clock: { name: 'Guardián del Reloj', hp: 32, drop: 'wj' },
    // guardianes de los dos sellos que cierran la Sala del Trono (hay que vencer a ambos para llegar al Conde)
    archon: { name: 'Archimago Silente', hp: 64, drop: null },
    reina: { name: 'Reina de Huesos', hp: 28, drop: null },
    conde: { name: 'El Conde', hp: 42, drop: null },
    // los dos rivales del Alba: al caer uno, el otro lo rescata y huye (solo se puede elegir a uno)
    aurora: { name: 'Aurora, Dama del Alba', hp: 36, drop: 'wings', rival: 'vesper', reward: 'Alas del Alba: mantén saltar en el aire para planear' },
    // Calabozos Profundos: el Alcaide guarda el Pisotón de Raíces y la Madre Moho cierra la zona
    alcaide: { name: 'Alcaide Verdín', hp: 32, drop: 'pound', reward: 'Pisotón de Raíces: en el aire, mantén abajo para caer en picado y romper los suelos de raíces' },
    madre: { name: 'La Madre Moho', hp: 44, drop: null },
    vesper: { name: 'Vesper, Señor del Ocaso', hp: 36, drop: 'eye', rival: 'aurora', reward: 'Ojo de la Noche: ves los secretos tras los muros agrietados y tu luz crece' },
  };

  // ---------- Definición de áreas ----------
  // area(id, nombre, zona, celdaX, celdaY, anchoCeldas, altoCeldas, ops)
  // ops (coords locales al área): ['P',x,y,w] plataforma | ['B',x,y,w,h] bloque | ['K',x,y,w,h] rompible | ['S',x,y,w] pinchos
  //   ['forge',x,y] mejora de arma | ['npc',tipo,x,y] personaje |
  //   ['pit',x0,x1] foso | ['E',tipo,x,y] enemigo | ['cry',x,y] cristal | ['altar',x,y] | ['boss',id,x,y]
  //   ['climb',hx,hw,tipo,hayAgujero] subida en zigzag hacia un agujero en el techo (norm | dj | dash)
  const AREAS = [];
  // diff: escalado de dificultad del área. Por defecto igual que z (el aspecto), salvo estas salas de la entrada que tienen la paleta de los Calabozos
  const DIFF = { bodega: 0, cripta: 0, tunel: 0, osario: 0, pozo: 0, arch1: 4, arch2: 4, arch3: 4, scrip: 4 }; // el Archivo Prohibido se visita más tarde: dificultad de zona 4
  const area = (id, name, z, c, r, w, h, ops) => AREAS.push({ id, name, z, diff: DIFF[id] !== undefined ? DIFF[id] : z, c, r, w, h, ops: ops || [] });

  // --- Ala de entrada (camino principal hacia la Gárgola) ---
  area('vest', 'Vestíbulo', 0, 2, 6, 1, 1, [['npc', 'merchant', 13, 16], ['tri', 'tl', 5], ['tri', 'tr', 5], ['altar', 6, 16], ['E', 'sk', 18, 16], ['E', 'sk', 21, 16]]);
  area('salon', 'Gran Salón', 0, 3, 6, 2, 1, [['tri', 'tl', 6], ['tri', 'tr', 6], ['climb', 11, 4, 'dash', true], ['B', 18, 15, 2, 2], ['B', 33, 15, 3, 2], ['B', 44, 14, 2, 3],
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
  area('bodega', 'Bodega', 3, 1, 6, 1, 1, [['tri', 'tr', 5], ['B', 5, 15, 3, 2], ['B', 19, 14, 3, 3], ['E', 'sk', 9, 16], ['E', 'sk', 22, 16], ['E', 'bat', 15, 9]]);
  area('cripta', 'Cripta Olvidada', 3, 0, 6, 1, 1, [['tri', 'tl', 6], ['pit', 7, 22], ['P', 3, 14, 4], ['cry', 4, 13], ['E', 'gh', 20, 9], ['E', 'gh', 4, 8]]);
  area('osario', 'Osario', 3, 8, 6, 2, 1, [['tri', 'tl', 7], ['tri', 'tr', 5], ['P', 30, 14, 4], ['P', 35, 11, 4], ['B', 40, 6, 8, 1], ['cry', 43, 5], ['E', 'gh', 15, 10], ['E', 'gh', 32, 6], ['E', 'sk', 10, 16], ['E', 'sk', 25, 16]]);
  area('escal', 'Escalera de los Retratos', 0, 3, 4, 1, 2, [['tri', 'tl', 6], ['tri', 'tr', 6], ['climb', 11, 4, 'norm', true], ['E', 'bat', 6, 10], ['E', 'bat', 20, 20], ['E', 'gh', 8, 28], ['E', 'sk', 20, 34]]);
  area('hidden', 'Sala Oculta', 0, 2, 5, 1, 1, [['tri', 'tl', 5], ['tri', 'tr', 5], ['cry', 13, 16]]);
  // --- Ala de la Biblioteca (rama larga y opcional) ---
  area('archivo', 'Archivo', 1, 3, 3, 1, 1, [['npc', 'archivist', 17, 16], ['altar', 7, 16], ['tri', 'tr', 6], ['E', 'sk', 7, 16], ['E', 'sk', 21, 16], ['E', 'bat', 18, 8]]);
  area('lect', 'Sala de Lectura', 1, 2, 3, 1, 1, [['page', 12, 16], ['tri', 'tl', 5], ['B', 8, 14, 2, 3], ['B', 17, 15, 3, 2], ['P', 4, 11, 4], ['P', 20, 11, 4], ['E', 'sk', 6, 16], ['E', 'kn', 22, 16], ['E', 'bat', 12, 8]]);
  area('gbib', 'Gran Biblioteca', 1, 0, 3, 2, 1, [['forge', 42, 11], ['tri', 'tl', 8], ['tri', 'tr', 8], ['climb', 11, 4, 'norm', true], ['B', 20, 14, 2, 3], ['B', 30, 15, 3, 2], ['P', 24, 11, 5], ['P', 40, 12, 5],
    ['E', 'kn', 17, 16, { elite: true, name: 'Bibliotecario Maldito', reward: { souls: 50, item: 'bomb' } }], ['E', 'kn', 36, 16], ['E', 'gh', 26, 7], ['E', 'gh', 44, 8], ['E', 'bat', 10, 6]]);
  area('obs', 'Observatorio', 1, 0, 1, 1, 2, [['tri', 'tl', 7], ['tri', 'tr', 7], ['climb', 11, 4, 'dash', false], ['cry', 13, 2], ['E', 'gh', 6, 24], ['E', 'gh', 20, 14], ['E', 'bat', 12, 30]]);
  // --- Pozo y calabozos (camino principal tras la Gárgola) ---
  area('pozo', 'Pozo de las Almas', 3, 7, 4, 1, 2, [['tri', 'tl', 5], ['tri', 'tr', 5], ['climb', 11, 4, 'dj', true], ['E', 'bat', 8, 28], ['E', 'gh', 18, 20], ['E', 'gh', 8, 10], ['E', 'sk', 20, 34]]);
  area('calab', 'Calabozo Norte', 3, 7, 3, 1, 1, [['npc', 'prisoner', 18, 16], ['altar', 7, 16], ['tri', 'tr', 4], ['E', 'gh', 10, 9], ['E', 'kn', 23, 16], ['E', 'sk', 6, 16]]);
  area('mazm', 'Mazmorra de Hierro', 3, 8, 3, 2, 1, [['tri', 'tl', 6], ['P', 30, 14, 4], ['P', 34, 11, 4], ['B', 40, 6, 8, 1], ['cry', 43, 5], ['E', 'gh', 18, 9], ['E', 'kn', 14, 16], ['E', 'sk', 27, 16]]);
  area('caden', 'Pasaje de Cadenas', 3, 5, 3, 2, 1, [['page', 45, 16], ['B', 1, 1, 36, 11], ['B', 41, 1, 10, 11], ['E', 'kn', 10, 16, { elite: true, name: 'Carcelero', reward: { souls: 70, item: 'pot2' } }], ['E', 'sk', 20, 16], ['E', 'sk', 30, 16], ['E', 'kn', 41, 16]]);
  // --- Capilla (camino principal hacia el Obispo) ---
  area('naveS', 'Capilla: Nave Sur', 2, 4, 3, 1, 1, [['npc', 'monk', 18, 16], ['npc', 'merchant', 22, 16], ['tri', 'tl', 7], ['tri', 'tr', 7], ['climb', 11, 4, 'norm', true], ['bigfire', 5, 16, 'mini'], ['E', 'kn', 8, 16], ['E', 'gh', 18, 6], ['E', 'kn', 14, 16]]);
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
  area('pasR', 'Pasillo Real', 5, 7, 0, 1, 1, [['page', 20, 16], ['tri', 'tl', 5], ['B', 11, 3, 4, 14], ['B', 7, 3, 1, 10], ['altar', 22, 16], ['E', 'gh', 3, 9]]);
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
  area('albaA', 'Cámara de Aurora', 7, 13, 0, 2, 1, [['tri', 'tl', 6], ['tri', 'tr', 6], ['boss', 'aurora', 26, 10]]);
  area('albaB', 'Cámara de Vesper', 7, 11, 1, 2, 1, [['tri', 'tl', 5], ['tri', 'tr', 5], ['climb', 24, 4, 'norm', true], ['boss', 'vesper', 40, 16]]);

  // --- Siguiente fase: tras vencer a uno de los rivales se abre la puerta de la cámara de Vesper hacia el cielo ---
  area('cielo1', 'Antecámara del Cielo', 7, 13, 1, 2, 1, [['page', 25, 16], ['altar', 8, 16], ['tri', 'tl', 4], ['tri', 'tr', 4],
    // puzle de tiempo: cada escalón aparece un segundo después del anterior y desaparece enseguida
    ['TP', 28, 14, 3, 4, 2.4, 0], ['TP', 33, 11, 3, 4, 2.4, 1], ['TP', 38, 8, 3, 4, 2.4, 2], ['P', 43, 5, 7], ['cry', 46, 4]]);
  area('torreC', 'Escalera al Cielo', 7, 15, 0, 1, 2, [['P', 3, 32, 5], ['P', 10, 29, 5], ['P', 17, 26, 5], ['P', 9, 23, 5], ['P', 3, 20, 5], ['P', 10, 17, 5], ['P', 17, 17, 8],
    ['E', 'kn', 14, 34], ['E', 'bat', 12, 10], ['E', 'gh', 18, 22], ['E', 'gh', 6, 14], ['E', 'bat', 20, 28], ['E', 'saw', 13, 24, { ax: 'h', r: 90, w: 1.3 }]]);
  area('cumbre', 'Cumbre del Alba', 7, 16, 0, 2, 1, [['npc', 'watcher', 20, 16], ['npc', 'rivalA', 12, 16], ['npc', 'rivalV', 12, 16], ['page', 26, 16], ['altar', 6, 16], ['tri', 'tl', 5], ['tri', 'tr', 5],
    // escalera al saliente izquierdo y balcón lejano (solo se alcanza planeando con las Alas del Alba)
    ['P', 3, 13, 4], ['P', 1, 10, 3], ['P', 3, 7, 4], ['P', 22, 10, 3], ['cry', 23, 9],
    // alcoba secreta tras un muro agrietado (el Ojo de la Noche la revela): dos cristales de vida
    ['P', 41, 13, 4], ['P', 46, 10, 4], ['P', 41, 7, 4],
    ['B', 45, 1, 6, 2], ['B', 45, 3, 1, 2], ['K', 45, 5, 1, 2], ['B', 50, 3, 1, 4], ['B', 45, 7, 6, 1], ['cry', 47, 6],
    ['K', 30, 17, 3, 1, 'conde']]); // suelo agrietado: bajo él, el Santuario de las Sombras (se abre solo al caer el Conde; también se rompe a golpes o con ↓ + saltar)
  area('jardin', 'Jardín Colgante', 7, 18, 0, 2, 1, [['pit', 7, 17], ['P', 10, 13, 3], ['B', 30, 4, 3, 11], ['B', 36, 4, 3, 13], ['P', 42, 13, 3], ['P', 46, 9, 3],
    ['E', 'gh', 22, 9], ['E', 'bat', 14, 6], ['E', 'bat', 41, 7], ['E', 'kn', 25, 16], ['E', 'sentinel', 44, 16]]);
  // Segunda mazmorra de plataformas: suelo de pinchos, huecos para el impulso y sierras
  area('mazC', 'Mazmorra de Nubes', 7, 20, 0, 2, 1, [['pit', 2, 49], ['P', 3, 13, 4], ['P', 10, 11, 3], ['P', 17, 9, 3], ['P', 26, 9, 3], ['P', 36, 11, 3], ['P', 43, 13, 3], ['P', 47, 10, 3],
    ['E', 'saw', 14, 10, { ax: 'v', r: 55, w: 1.5 }], ['E', 'saw', 30, 8, { ax: 'h', r: 80, w: 1.3 }], ['E', 'bat', 22, 5], ['E', 'bat', 40, 6], ['E', 'gh', 33, 8],
    ['TP', 14, 8, 3, 3.6, 2.2, 0], ['TP', 18, 5, 3, 3.6, 2.2, 0.9], ['P', 22, 3, 6], ['cry', 24, 2]]);

  // --- El Abismo: tras planear sobre los pinchos de la Cripta Olvidada, una caída libre lleva a la Forja de los Elementos y a la Gran Hoguera ---
  area('caida', 'Caída Libre', 8, 0, 7, 1, 2, [['E', 'saw', 9, 9, { ax: 'h', r: 60, w: 1.3 }], ['E', 'saw', 16, 18, { ax: 'h', r: 70, w: 1.6 }], ['E', 'saw', 10, 27, { ax: 'h', r: 60, w: 1.1 }],
    ['E', 'bat', 5, 6], ['E', 'bat', 20, 14], ['E', 'bat', 12, 23]]);
  area('fragua', 'Forja de los Elementos', 8, 1, 8, 2, 1, [['tri', 'tl', 5], ['tri', 'tr', 5], ['npc', 'smith', 26, 16], ['page', 10, 16]]);
  area('gran', 'La Gran Hoguera', 8, 3, 8, 1, 1, [['bigfire', 13, 16], ['tri', 'tl', 4], ['tri', 'tr', 4]]);

  // Gemas: la segunda moneda. Se encuentran por el mapa (zonas opcionales y secretos) y las sueltan los jefes y los élites.
  // [sala, x, y] en coordenadas locales; cada gema reposa sobre una plataforma o el suelo
  const GEMS = [['hidden', 8, 16], ['salon', 30, 11], ['foso', 13, 12], ['lect', 6, 10], ['gbib', 26, 10], ['osario', 36, 10], ['mazm', 36, 10], ['galeria', 8, 8], ['mir', 7, 13],
    ['arch1', 22, 9], ['cat1', 14, 11], ['cielo1', 30, 16], ['cielo1', 48, 4], ['mazC', 26, 2], ['santuario', 20, 16], ['cumbre', 48, 6], ['jardin', 11, 12], ['mazC', 28, 8], ['fragua', 6, 16],
    ['cist', 25, 22], ['rez', 46, 4], ['tun', 47, 13], ['tun', 25, 12]];

  area('santuario', 'Santuario de las Sombras', 7, 16, 1, 2, 1, [['npc', 'smith2', 26, 16], ['cry', 36, 16], ['K', 30, 0, 3, 1, 'conde'], ['tri', 'tl', 4], ['tri', 'tr', 4]]);

  // ===== Zona 9: Calabozos Profundos (se baja en ascensor desde el Santuario de las Sombras) =====
  area('asc', 'Pozo del Ascensor', 9, 16, 2, 1, 1, [['lift', 11, 4], ['altar', 4, 16], ['npc', 'jardinero', 20, 16]]);
  area('rai', 'Galería de Raíces', 9, 17, 2, 2, 1, [['page', 47, 16], ['B', 12, 1, 2, 6], ['B', 33, 1, 2, 5], ['pit', 20, 30], ['P', 21, 14, 3], ['P', 25, 13, 3], ['P', 29, 14, 3],
    ['E', 'slug', 8, 16], ['E', 'slug', 16, 16], ['E', 'vine', 23, 1], ['E', 'vine', 28, 1], ['E', 'bat', 26, 8], ['E', 'gh', 36, 10], ['E', 'pris', 46, 16]]);
  area('cist', 'Cisterna de Musgo', 9, 17, 3, 2, 2, [['climb', 40, 4, 'norm', true], ['P', 24, 23, 4],
    ['E', 'bat', 28, 10], ['E', 'bat', 20, 24], ['E', 'gh', 14, 14], ['E', 'gh', 46, 12], ['E', 'slug', 20, 34], ['E', 'slug', 30, 34], ['E', 'shroom', 40, 34]]);
  area('cel', 'Celdas Cubiertas', 9, 15, 4, 2, 1, [['page', 47, 16], ['B', 14, 1, 2, 11], ['B', 26, 1, 2, 11], ['B', 38, 1, 2, 11],
    ['B', 1, 1, 6, 8], ['B', 6, 9, 1, 4], ['K', 6, 13, 1, 4], ['cry', 3, 16],
    ['E', 'pris', 10, 16], ['E', 'slug', 20, 16], ['E', 'gh', 32, 8], ['E', 'shroom', 42, 16], ['E', 'bat', 44, 6],
    ['E', 'kn', 32, 16, { elite: true, name: 'Verdugo Cubierto de Musgo', reward: { souls: 90, item: 'ward' } }]]);
  area('rez', 'Refectorio Podrido', 9, 17, 5, 2, 1, [['climb', 8, 4, 'norm', true], ['page', 13, 16], ['B', 20, 15, 3, 2], ['B', 25, 15, 2, 2],
    ['TP', 28, 14, 3, 4, 2.4, 0], ['TP', 33, 11, 3, 4, 2.4, 1], ['TP', 38, 8, 3, 4, 2.4, 2], ['P', 43, 5, 7],
    ['E', 'slug', 18, 16], ['E', 'pris', 33, 16], ['E', 'shroom', 44, 16], ['E', 'vine', 22, 1], ['E', 'gh', 26, 8], ['E', 'gh', 40, 4], ['E', 'bat', 46, 10]]);
  area('tun', 'Pasaje de Zarzas', 9, 19, 5, 2, 1, [['pit', 4, 38], ['pit', 45, 50],
    ['P', 6, 14, 3], ['P', 12, 13, 3], ['P', 18, 12, 3], ['P', 24, 13, 3], ['P', 30, 12, 3], ['P', 36, 13, 3], ['P', 46, 14, 4],
    ['E', 'saw', 15, 9, { ax: 'v', r: 55, w: 1.4 }], ['E', 'saw', 27, 9, { ax: 'v', r: 60, w: 1.6 }], ['E', 'saw', 33, 10, { ax: 'h', r: 60, w: 1.2 }],
    ['E', 'bat', 22, 5], ['E', 'bat', 40, 6], ['E', 'gh', 8, 8]]);
  area('ant', 'Antesala del Alcaide', 9, 20, 6, 1, 1, [['climb', 14, 4, 'norm', true], ['altar', 6, 16], ['page', 20, 16], ['tri', 'tl', 4], ['tri', 'tr', 4]]);
  area('alcai', 'Sala del Alcaide', 9, 18, 6, 2, 1, [['tri', 'tl', 5], ['tri', 'tr', 5], ['P', 8, 12, 5], ['P', 39, 12, 5], ['P', 22, 9, 7], ['boss', 'alcaide', 30, 16]]);
  area('madre', 'Corazón del Musgo', 9, 18, 7, 2, 1, [['tri', 'tl', 5], ['tri', 'tr', 5], ['P', 10, 13, 6], ['P', 36, 13, 6], ['P', 23, 9, 6], ['boss', 'madre', 26, 16]]);
  // --- Camino de salida de la Madre Moho: pasillos con plataformas hacia La Gran Hoguera (se abre al caer la Madre; el último tramo es una caída: no hay vuelta por ahí) ---
  area('pas5', 'Raíces de Salida', 9, 16, 7, 2, 1, [['P', 10, 13, 5], ['P', 22, 10, 5], ['P', 34, 13, 5], ['E', 'slug', 8, 16], ['E', 'shroom', 20, 16], ['E', 'moth', 26, 6], ['E', 'vine', 30, 1], ['E', 'pris', 40, 16], ['E', 'moth', 44, 8]]);
  area('pas4', 'Galería de Zarzas', 9, 13, 7, 3, 1, [['pit', 8, 70], ['P', 10, 14, 3], ['P', 16, 13, 3], ['P', 22, 12, 3], ['P', 28, 13, 3], ['P', 34, 14, 3], ['P', 40, 13, 3], ['P', 46, 12, 3], ['P', 52, 13, 3], ['P', 58, 14, 3], ['P', 64, 13, 3], ['E', 'saw', 19, 9, { ax: 'v', r: 55, w: 1.4 }], ['E', 'saw', 37, 9, { ax: 'v', r: 60, w: 1.6 }], ['E', 'saw', 55, 9, { ax: 'h', r: 60, w: 1.2 }], ['E', 'moth', 25, 6], ['E', 'moth', 47, 5], ['E', 'vine', 31, 1], ['E', 'vine', 61, 1], ['E', 'shroom', 74, 16]]);
  area('pas3', 'Veta de Ceniza', 8, 10, 7, 3, 1, [['B', 0, 9, 62, 1], ['B', 70, 9, 8, 1], ['R', 40, 9, 4, 1], ['R', 10, 9, 4, 1], ['B', 60, 10, 2, 7], ['P', 63, 14, 4], ['P', 66, 12, 4], ['B', 54, 3, 2, 4], ['B', 47, 6, 2, 3], ['B', 30, 3, 2, 4], ['B', 20, 6, 2, 3], ['B', 46, 13, 2, 4], ['B', 30, 12, 2, 5], ['B', 18, 14, 2, 3], ['B', 6, 14, 2, 3], ['E', 'magma', 58, 8], ['E', 'magma', 50, 8], ['E', 'magma', 36, 8], ['E', 'magma', 14, 8], ['E', 'pris', 24, 8], ['E', 'moth', 52, 4], ['E', 'moth', 26, 4], ['E', 'magma', 52, 16], ['E', 'magma', 38, 16], ['E', 'magma', 24, 16], ['E', 'pris', 12, 16], ['E', 'moth', 40, 12], ['E', 'shroom', 3, 16]]); // laberinto de dos pisos: hay que romper con el Pisotón las losas del suelo intermedio para bajar y seguir
  area('pas2', 'Sala de Brasas', 8, 7, 7, 3, 1, [['pit', 10, 22], ['pit', 50, 62], ['P', 11, 14, 3], ['P', 16, 13, 3], ['P', 21, 14, 3], ['P', 51, 14, 3], ['P', 56, 13, 3], ['P', 61, 14, 3], ['B', 34, 14, 4, 3], ['E', 'saw', 16, 9, { ax: 'v', r: 50, w: 1.5 }], ['E', 'saw', 56, 9, { ax: 'v', r: 50, w: 1.7 }], ['E', 'magma', 28, 16], ['E', 'magma', 42, 16], ['E', 'magma', 70, 16], ['E', 'moth', 36, 6], ['E', 'moth', 66, 6], ['E', 'shroom', 4, 16]]);
  area('pas1', 'Antesala del Abismo', 8, 3, 7, 4, 1, [['pit', 20, 82], ['P', 22, 14, 3], ['P', 28, 13, 3], ['P', 34, 12, 3], ['P', 40, 11, 3], ['P', 46, 12, 3], ['P', 52, 13, 3], ['P', 58, 12, 3], ['P', 64, 13, 3], ['P', 70, 14, 3], ['P', 76, 13, 3], ['E', 'saw', 31, 8, { ax: 'v', r: 55, w: 1.5 }], ['E', 'saw', 61, 8, { ax: 'v', r: 55, w: 1.6 }], ['E', 'moth', 43, 5], ['E', 'moth', 70, 6], ['E', 'magma', 90, 16], ['E', 'magma', 98, 16], ['E', 'kn', 16, 16, { elite: true, name: 'Vigía de las Cenizas', reward: { souls: 120, item: 'ward' } }]]);

  // --- Acto II antes del Conde: dos segmentos con jefe; sus sellos abren la Sala del Trono ---
  // Segmento A: el Archivo Prohibido (sobre el Observatorio)
  area('arch1', 'Salón de los Atriles', 1, 1, 2, 2, 1, [['page', 4, 16], ['tri', 'tl', 6], ['tri', 'tr', 6], ['P', 10, 13, 5], ['P', 20, 10, 5], ['P', 30, 13, 5], ['B', 16, 15, 3, 2], ['B', 38, 14, 3, 3],
    ['E', 'sk', 8, 16], ['E', 'kn', 24, 16], ['E', 'gh', 34, 9], ['E', 'bat', 44, 6], ['E', 'sk', 46, 16]]);
  area('arch2', 'Pasaje de Tinta', 1, 3, 2, 1, 1, [['altar', 6, 16], ['climb', 11, 4, 'norm', true]]);
  area('arch3', 'Escalera de Pergaminos', 1, 3, 0, 1, 2, [['P', 3, 32, 5], ['P', 10, 29, 5], ['P', 17, 26, 5], ['P', 9, 23, 5], ['P', 3, 20, 5], ['P', 1, 17, 6],
    ['E', 'bat', 12, 10], ['E', 'gh', 18, 22], ['E', 'gh', 6, 14], ['E', 'bat', 20, 28], ['E', 'saw', 13, 24, { ax: 'h', r: 80, w: 1.3 }]]);
  area('scrip', 'Scriptorium', 1, 1, 0, 2, 1, [['tri', 'tl', 6], ['tri', 'tr', 6], ['boss', 'archon', 26, 10]]);
  // Segmento B: las Catacumbas Reales (bajo la Mazmorra de Hierro)
  area('cat1', 'Galería de Huesos', 3, 8, 4, 2, 1, [['page', 6, 16], ['climb', 20, 4, 'norm', true], ['tri', 'tl', 5], ['tri', 'tr', 5], ['B', 28, 14, 3, 3], ['P', 12, 12, 5], ['P', 44, 12, 4],
    ['E', 'kn', 14, 16], ['E', 'sk', 26, 16], ['E', 'gh', 34, 8], ['E', 'sk', 46, 16], ['E', 'bat', 40, 6]]);
  area('cat2', 'Cripta de la Reina', 3, 8, 5, 2, 1, [['tri', 'tl', 5], ['tri', 'tr', 5], ['climb', 38, 4, 'norm', true], ['boss', 'reina', 20, 16]]);

  const LINKS = [];
  // E(oeste, este, tamañoPuerta, opts): puerta horizontal pegada al suelo
  const E = (a, b, size = 3, o = {}) => LINKS.push({ t: 'E', a, b, size, ...o });
  // S(arriba, abajo, x, tamaño): hueco vertical; x es local al área de arriba
  const S = (a, b, x = 11, size = 4, o = {}) => LINKS.push({ t: 'S', a, b, x, size, ...o });
  E('cripta', 'bodega'); E('bodega', 'vest'); E('vest', 'salon'); E('salon', 'corr'); E('corr', 'foso');
  E('foso', 'cubil', 5); E('cubil', 'osario', 1); E('corr', 'tunel'); E('tunel', 'pozo'); // puerta de 1 tile: hay que agacharse
  E('hidden', 'escal', 3, { crack: true });
  E('gbib', 'lect', 4); E('lect', 'archivo'); E('archivo', 'naveS', 3, { crack: true });
  E('naveS', 'caden'); E('caden', 'calab', 3, { gate: 'bishop' }); E('calab', 'mazm'); // reja: se abre al caer el Obispo (así los Calabozos y la Reina quedan tras el Doble salto)
  E('abs', 'mir', 4); E('galeria', 'torre'); E('clkC', 'pasR', 6); E('pasR', 'throne', 5, { gate: 'sellos' }); // la puerta del trono se abre con los dos sellos
  S('archivo', 'escal'); S('escal', 'salon'); S('obs', 'gbib'); S('pozo', 'cubil'); S('calab', 'pozo');
  E('escalaR', 'fosoC', 3, { gate: 'conde' }); E('fosoC', 'alba1', 3, { gate: 'conde' }); S('pasR', 'escalaR', 16, 4);
  E('alba1', 'albaH', 3); E('albaH', 'albaA', 4); S('albaH', 'albaB', 24, 4);
  E('albaB', 'cielo1', 3, { gate: 'alba' }); E('cielo1', 'torreC', 3); E('torreC', 'cumbre', 3); E('cumbre', 'jardin', 3); E('jardin', 'mazC', 3); S('cripta', 'caida', 1, 6); E('caida', 'fragua', 3); E('fragua', 'gran', 3); // 'alba' = cae Aurora o Vesper
  E('obs', 'arch1', 3, { gate: 'clock' }); E('arch1', 'arch2'); S('arch3', 'arch2', 11, 4); E('scrip', 'arch3', 3); // Archivo Prohibido
  S('mazm', 'cat1', 20, 4); S('cat1', 'cat2', 38, 4); // Catacumbas Reales
  S('santuario', 'asc', 11, 4); E('asc', 'rai'); S('rai', 'cist', 40, 4); E('cel', 'cist'); S('cist', 'rez', 8, 4); E('rez', 'tun'); S('tun', 'ant', 40, 4); E('alcai', 'ant');
  S('alcai', 'madre', 22, 4, { roots: true }); // suelo de raíces: solo el Pisotón lo rompe
  E('pas1', 'pas2'); E('pas2', 'pas3'); E('pas3', 'pas4'); E('pas4', 'pas5'); E('pas5', 'madre', 3, { gate: 'madre' }); // el camino de salida se abre al caer la Madre Moho
  S('pas1', 'gran', 8, 4); // al final del camino se cae a La Gran Hoguera: de ahí no se puede volver subiendo
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
    const world = { T, COLS, ROWS, CW, CH, Wt, Ht, fg, bg, areaAt, areas: {}, areaList: AREAS, spawns: [], crystals: [], altars: [], forges: [], npcs: [], pages: [], bosses: [], torches: [], links: LINKS, ZONES, PHYS, BOSSES, gates: [], sforges: [], gems: [], timed: [], lifts: [], roots: new Set() };
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
          if (!l.roots) A.seal.push({ gx, gy: gyA }); B.seal.push({ gx, gy: gyB }); // la tapa de raíces ya es sólida: no se sella
          if (l.roots) { fg[gyA][gx] = A.z * 8 + K.CRACK; world.roots.add(gyA * Wt + gx); } // tapa de raíces sobre el hueco
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
          // ['TP', x, y, ancho, periodo, segundos visible, desfase]: plataforma que aparece y desaparece (para el validador siempre está)
          case 'TP': { const n = (cnt.tp = (cnt.tp || 0) + 1); world.timed.push({ id: 'tp_' + a.id + '_' + n, area: a.id, gx: a.x0 + op[1], gy: a.y0 + op[2], w: op[3], period: op[4], on: op[5], phase: op[6] || 0, idx: a.z * 8 + K.ONEWAY }); for (let x = op[1]; x < op[1] + op[3]; x++) if (free(a, x, op[2])) setF(a, x, op[2], K.ONEWAY); break; }
          case 'B': for (let y = op[2]; y < op[2] + op[4]; y++) for (let x = op[1]; x < op[1] + op[3]; x++) setF(a, x, y, K.SOLID); break;
          case 'K': for (let y = op[2]; y < op[2] + op[4]; y++) for (let x = op[1]; x < op[1] + op[3]; x++) setF(a, x, y, K.CRACK);
            if (op[5]) { // quinto parámetro: jefe que, al caer, abre la grieta solo
              let g = world.gates.find(q => q.boss === op[5] && q.crack); if (!g) world.gates.push(g = { boss: op[5], crack: true, tiles: [] });
              for (let y = op[2]; y < op[2] + op[4]; y++) for (let x = op[1]; x < op[1] + op[3]; x++) g.tiles.push({ gx: a.x0 + x, gy: a.y0 + y });
            } break;
          case 'R': for (let y = op[2]; y < op[2] + op[4]; y++) for (let x = op[1]; x < op[1] + op[3]; x++) { setF(a, x, y, K.CRACK); world.roots.add((a.y0 + y) * Wt + (a.x0 + x)); } break; // ['R', x, y, ancho, alto]: losa que solo rompe el Pisotón
          case 'S': for (let x = op[1]; x < op[1] + op[3]; x++) setF(a, x, op[2], K.SPIKES); break;
          case 'tri': { const n = op[2]; for (let i = 0; i < n; i++) { const wd = n - i; for (let k = 0; k < wd; k++) setF(a, op[1] === 'tl' ? 1 + k : a.rw - 2 - k, 1 + i, K.SOLID); } break; }
          case 'forge': world.forges.push({ id: sid('f'), area: a.id, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T }); break;
          case 'npc': world.npcs.push({ id: sid('n'), area: a.id, type: op[1], x: (a.x0 + op[2] + 0.5) * T, y: (a.y0 + op[3] + 1) * T }); break;
          case 'torch': world.torches.push({ id: world.torches.length, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T, z: a.z, area: a.id, lit: true, r: 150 }); break;
          case 'pit': for (let x = op[1]; x <= op[2]; x++) setF(a, x, a.rh - 1, K.SPIKES); break;
          case 'E': if (a.safe) break; world.spawns.push({ id: 'e' + (uid++), area: a.id, type: op[1], x: (a.x0 + op[2] + 0.5) * T, y: (a.y0 + op[3] + 1) * T, opts: op[4] || null, zone: a.diff }); break;
          case 'page': world.pages.push({ id: sid('p'), area: a.id, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T }); break;
          case 'cry': world.crystals.push({ id: sid('c'), area: a.id, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T }); break;
          case 'sforge': world.sforges.push({ id: sid('sf'), area: a.id, kind: 'forge', x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T }); break;
          case 'sshrine': world.sforges.push({ id: sid('sf'), area: a.id, kind: 'shrine', x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 0.5) * T }); break;
          case 'bigfire': world.altars.push({ id: sid('a'), area: a.id, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 1) * T, big: true, mini: op[3] === 'mini' }); // mini: sigue siendo la hoguera de viaje rápido pero se dibuja y alumbra como una normal break;
          case 'altar': world.altars.push({ id: sid('a'), area: a.id, x: (a.x0 + op[1] + 0.5) * T, y: (a.y0 + op[2] + 1) * T }); break;
          case 'lift': world.lifts.push({ id: 'l_' + a.id, area: a.id, x: (a.x0 + op[1]) * T, w: op[2] * T, yTop: (a.y0 - 1) * T, yBot: (a.y0 + a.rh - 1) * T }); break; // ['lift', x, ancho]: ascensor entre el suelo de la sala de arriba y el de esta
          case 'boss': world.bosses.push({ id: op[1], area: a.id, x: (a.x0 + op[2] + 0.5) * T, y: (a.y0 + op[3] + 1) * T, ...BOSSES[op[1]] }); a.boss = op[1]; break;
        }
      }
      // antorchas
      if (!a.ops.some(o => o[0] === 'torch')) for (let x = 5; x < a.rw - 4; x += 13) for (let k = 0; k < a.h; k++) for (const dy of [13, 12, 14, 11]) { const yy = k * 18 + dy; if (yy < a.rh - 1 && yy > 1 && free(a, x, yy)) { world.torches.push({ id: world.torches.length, x: (a.x0 + x + 0.5) * T, y: (a.y0 + yy + 0.5) * T, z: a.z, area: a.id, lit: a.z !== 3, r: 215 }); break; } }
    }
    const gcnt = {};
    for (const [aid, gx, gy] of GEMS) { const a = world.areas[aid]; if (!a) throw new Error('Gema en área inexistente ' + aid); gcnt[aid] = (gcnt[aid] || 0) + 1; world.gems.push({ id: 'g_' + aid + '_' + gcnt[aid], area: aid, x: (a.x0 + gx + 0.5) * T, y: (a.y0 + gy + 0.5) * T }); }
    world.spawnPoint = world.altars.find(a => a.area === 'vest');
    world.areaOf = (gx, gy) => { const i = (areaAt[gy] || [])[gx]; return i >= 0 && i !== undefined ? AREAS[i] : null; };
    return world;
  }

  // ¿está abierta una puerta por jefe? ('sellos': Archimago y Reina, o el Conde; 'alba': cae Aurora o Vesper)
  const gateOpen = (boss, pb) => boss === 'alba' ? (pb.includes('aurora') || pb.includes('vesper')) : boss === 'sellos' ? (pb.includes('conde') || (pb.includes('archon') && pb.includes('reina'))) : pb.includes(boss);
  // Orden previsto de la progresión: jefes que se pueden alcanzar en cada etapa y habilidad que ganas al caer. 'rival' = Aurora o Vesper (solo uno).
  const PROGRESSION = [
    { bosses: ['garg'], gives: 'dash' },
    { bosses: ['bishop'], gives: 'dj' },
    { bosses: ['reina', 'clock'], gives: 'wj' },
    { bosses: ['archon'] },
    { bosses: ['conde'] },
    { bosses: ['rival'], gives: 'wings|eye' },
    { bosses: ['alcaide'], gives: 'pound' },
    { bosses: ['madre'] },
  ];
  const api = { build, T, COLS, ROWS, CW, CH, PHYS, K, ROCK, kind, isSolidKind, ZONES, ABILITIES, BOSSES, gateOpen, PROGRESSION };
  root.World = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
