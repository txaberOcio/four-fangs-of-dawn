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
  { base: '#5a463a', dark: '#35271f', light: '#8a6a52', mortar: '#1e1410', bg: '#1a100c', bgd: '#110a08', glow: '#ff7a2a' }, // El Abismo: cueva de roca y lava
  { base: '#3c5246', dark: '#26362e', light: '#587a64', mortar: '#111c16', bg: '#0f1a15', bgd: '#0a120f', glow: '#6dffd0', moss: '#3f7a3a', mossD: '#2a5428', mossL: '#8fd35a', root: '#5a4128', rootL: '#8a6a3a', fung: '#6dffd0', fung2: '#b48aff' }, // Calabozos Profundos: piedra verdosa, musgo, hongos
  // Zona 2
  { base: '#7a5f4a', dark: '#4a382b', light: '#a8896a', mortar: '#2a1d14', bg: '#241810', bgd: '#1a110b', glow: '#ffcf8a' }, // 10 Refugio de Isolda
  { base: '#5a3f66', dark: '#3a2646', light: '#8a66a0', mortar: '#1e1226', bg: '#1c1124', bgd: '#140b1a', glow: '#d9a0ff' }, // 11 Jardín de las Rosas Negras
  { base: '#6e5a56', dark: '#46383a', light: '#98807a', mortar: '#241a1a', bg: '#221a1a', bgd: '#181212', glow: '#ff8a6a' }, // 12 Cuartel Hueco
  { base: '#34506a', dark: '#1f3348', light: '#5a82a6', mortar: '#0e1a26', bg: '#0c1620', bgd: '#08101a', glow: '#8ad8ff' }, // 13 Faro Ciego
  { base: '#4a6a58', dark: '#2c4436', light: '#7ea08a', mortar: '#14221a', bg: '#12201a', bgd: '#0c1612', glow: '#b8ffc8' }, // 14 Mercado Hueco
  { base: '#5a2a3a', dark: '#341822', light: '#8a4a5e', mortar: '#1c0c14', bg: '#1a0c12', bgd: '#12080d', glow: '#ff5a7a' }, // 15 Los Tronos
  // Zona 3
  { base: '#6b5a48', dark: '#3e3226', light: '#9a8468', mortar: '#231a12', bg: '#1d1712', bgd: '#14100c', glow: '#ffb347' }, // 16 La Calle de las Horas: adobe y piedra tosca cálida
];

const HERO_COLORS = { red: '#d93a3a', blue: '#3a6ad9', green: '#3aa84a', purple: '#9a4ad9' };
const HERO_NAMES = { red: 'Cor', blue: 'Zaf', green: 'Malak', purple: 'Matis' }; // solo el nombre, sin el color
const HERO_REALNAMES = { red: 'Cor', blue: 'Zaf', green: 'Malak', purple: 'Matis' };

// una línea de historia de cada vampiro, para la pantalla de elegir personaje (docs/PERSONAJES.md)
const HERO_LORE = {
  red: 'Cor se formó con el Capitán, el maestro que cerró las puertas del castillo. Vuelve para dar la orden que nunca llegó.',
  blue: 'Zaf vigilaba la costa cuando el cielo dejó de encenderse. Está aquí para rescatar a su hermana Lúa y saber quién apagó las luces.',
  green: 'Malak firmó una deuda para salvar a su valle, y todas sus almas acabaron en frascos. Está aquí para liberarlas.',
  purple: 'Matis fue escolta de la Reina Isolda antes del cerco. Está aquí para dar descanso a los muertos de la corte.',
};
const HERO_INFO = {
  red: { weapon: 'Espada', passive: 'Sed de sangre', desc: 'Espada equilibrada. Pasiva: 40% de curarse al golpear (Zaf y Matis, 25%; Malak no se cura).' },
  blue: { weapon: 'Lanza', passive: 'Visión nocturna', desc: 'Lanza de gran alcance. Pasiva: ve mucho más lejos en la oscuridad. Desventajas: recibe más daño de los ataques a distancia y se mueve un poco más lento.' },
  green: { weapon: 'Arco', passive: 'Caza de almas', desc: 'Dispara flechas a distancia. Pasiva: +50% de almas al matar. Sus flechas no empujan a los enemigos ni curan. Desventaja: recibe +50% de daño y no rompe muros (necesita Bombas de la tienda).' },
  purple: { weapon: 'Guadaña', passive: 'Piel de sombra', desc: 'Guadaña lenta y muy dañina. Pasiva: +2 corazones de vida máxima. Desventaja: se mueve más lento (compensa con un gancho automático: si el salto se queda corto, se engancha al borde y sube).' },
};
// Los cuatro vampiros: mismo cuerpo, distinta cabeza y arma (G acero, B madera, Y dorado, N azul, P placa). Cor: pelo de punta y espada a la espalda;
// Zaf: armadura plateada, pelo largo plateado y lanza de madera con detalles azules; Malak: delgada, con capucha verde oscuro y arco; Matis: armadura negra, pelo negro con flequillo sobre un ojo y una guadaña grande.
const HERO_BASE_ROWS = ['...HHHHHH...', '..HHHHHHHH..', '..HSSSSSSH..', '..SRSSSSRS..', '...SFSSFS...', '.CCCSSSSCCC.', 'CCCCAAAACCCC', 'CCCAAWWAACCC', 'CC.AAAAAA.CC', '...AAAAAA...', '...AA..AA...', '...AA..AA...', '...DD..DD...', '..DDD..DDD..']; // el cuerpo sin arma, para tapar los pixeles de arma
const HERO_MAPS = {
  red: ['..H.HHHH.H.G', '..HHHHHHHH.G', '..HSSSSSSH.G', '..SRSSSSRS.G', '...SFSSFS..G', '.CCCSSSSCCCY', 'CCCCAAAACCCB',
    'CCCAAWWAACCC', 'CC.AAAAAA.CC', '...AAAAAA...', '...AA..AA...', '...AA..AA...', '...DD..DD...', '..DDD..DDD..'],
  blue: ['G..HHHHHH...', 'G.HHHHHHHH..', 'N.HSSSSSSH..', 'BHSRSSSSRSH.', 'BHHSFSSFSHH.', 'BHHPSSSSPHH.', 'BCHHAAAAHHCC',
    'BCHHAWWAHHCC', 'BC.HAAAAH.CC', 'B..HAAAAH...', 'B..AA..AA...', 'B..AA..AA...', 'B..DD..DD...', 'N.DDD..DDD..'],
  green: ['...CCCCCC...', '..CCCCCCCC..', '..CSSSSSSCB.', '..CRSSSSRC.B', '...SSCCSS..B', '..CCCSSCCC.B', '..CCAAAACC.B',
    '..CCAWWACC.B', '..CCAAAACC.B', '..CCCCCCCC.B', '....AAAA..B.', '....AAAA....', '....DD.DD...', '...DDD.DDD..'],
  purple: ['...HHHHHGGGG', '..HHHHHHHHGG', '..HHHHSSSH.B', '..SHSSSSRS.B', '...SFSSFS..B', '.CCCSSSSCCCB', 'CCCCAAAACCCB',
    'CCCAAWWAACCB', 'CC.AAAAAA.CB', '...AAAAAA..B', '...AA..AA..B', '...AA..AA..B', '...DD..DD..B', '..DDD..DDD.B'],
};
// Para jugar, los vampiros van sin sus armas (solo Malak conserva el arco). Se quita cada pixel de arma dejando lo que había debajo en el dibujo base.
const HERO_GAME_MAPS = {};
for (const k in HERO_MAPS) HERO_GAME_MAPS[k] = k === 'green' ? HERO_MAPS[k] : HERO_MAPS[k].map((row, y) => row.split('').map((ch, x) => ('GBYN'.includes(ch) ? (HERO_BASE_ROWS[y][x]) : ch)).join(''));
const HERO_SCALE = { red: [3, 3], blue: [3, 3.3], green: [2.7, 3], purple: [3.4, 3] }; // [ancho, alto] con que se dibuja cada vampiro
const HERO_LOOK = { red: { H: '#16101c', S: '#e8e0f4', R: '#ff2b3b' }, blue: { H: '#f4f4fc', S: '#c4b8d6', R: '#2a6db0', C: '#3a6ad9', A: '#566178', P: '#98a3bb' }, green: { H: '#16101c', S: '#e0e8dc', R: '#ffd23b', C: '#163f22' }, purple: { H: '#1a1226', S: '#cfc6e6', R: '#d9a0ff', C: '#2b2833', A: '#16141c', W: '#9a4ad9' } };
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
  aurora: [
    '....HHHHHHHH....', '.....SSSSSS.....', '.....SDSSDS.....', '.....SSSSSS.....', 'WW..GGRRRRGG..WW', 'WWW.GRRRRRRG.WWW', 'WWWWRRGRRGRRWWWW', 'WWWWRRRRRRRRWWWW', '.WWWRRRGGRRRWWW.', '.WWW.RRRRRR.WWW.', '..WW.RRRRRR.WW..', '..W..RRRRRR..W..', '.....RRRRRR.....', '....RRRRRRRR....', '...RRRRRRRRRR...', '...GGGGGGGGGG...'],
  vesper: [
    '.....KKKKKK.....', '....KKCCCCKK....', '...KKCCCCCCKK...', '...KKCSSSSCKK...', '...KKCSBSBCKK...', '...KKKSSSSKKK...', '..KKKKKSSKKKKK..', '.KKCCKKKKKKCCKK.', 'KKCCCKKMMKKCCCKK', 'KKCCCKMKKKKCCCKK', 'KKCCCKMKKKKCCCKK', 'KKCCCKKMMKKCCCKK', '.KKCCCKKKKCCCKK.', '.KKKCCCKKCCCKKK.', '..KKKCCCCCCKKK..', '...KKK....KKK...'],
  archon: [
    '.......MM.......', '......MMMM......', '.....MMMMMM.....', '....MMMMMMMM....', '.....SSSSSS.....', '.....SDSSDS.....', '.....SSSSSS.....', '....MMMMMMMM....', '...TTTMMMMTTT...', '..TTTTTMMTTTTT..', '..TTWWWWWTTTTT..', '..TTWYYYWTTTTT..', '..TTWWWWWTTTTT..', '...TTTTTTTTTT...', '...TTTTTTTTTT...', '..LLLLLLLLLLLL..'],
  reina: [
    '...Y..Y..Y..Y...', '...YYYYYYYYYY...', '....WWWWWWWW....', '....WRRWWRRW....', '....WWWDDWWW....', '.....WWWWWW.....', '..GGGWWWWWWGGG..', '.GGWWGWWWWGWWGG.', '.GWWGGWWWWGGWWG.', '..WW.GWWWWG.WW..', '..WW.GGWWGG.WW..', '..GW..GWWG..WG..', '...W..WWWW..W...', '.....WWWWWW.....', '....WWW..WWW....', '....WWW..WWW....'],
  limo: [ // babosa de lodo con ojos en tallos y motas luminosas
    '................', '................', '.........E..E...', '.........G..G...', '.....GGGGGGGG...', '...GGLLLGGGGGG..', '..GGLLGGGGGGGGG.', '.GGLGGGGFGGGGGG.',
    '.GGGGGGGGGGFGGG.', 'GGGGFGGGGGGGGGGG', 'GGGGGGGGGGGGFGGG', 'GGGFGGGGGGGGGGGG', 'GGGGGGGGGGFGGGGG', '.GGDDGGGGGGDDGG.', '..DDDDDDDDDDDD..', '.L..L......L..L.'],
  preso: [ // prisionero cubierto de hongos, con grilletes
    '.....FF...FFF...', '....FFFF.FFFFF..', '.....WW...WW....', '.....SSSSSS.....', '....SSSSSSSS....', '....SRSSSSRS....', '....SSSDDSSS....', '..FF.SSSSSS.FF..',
    '.FFFMMCCCCMMFFF.', '..MMMCCCCCCMMM..', '.SSMCCCCCCCCMSS.', '.SS.CCMMCCCC.SS.', '.II.CCCCCCCC.II.', '....CCC..CCC....', '....MMM..MMM....', '...DDDD..DDDD...'],
  raiz: [ // criatura de raíces y lianas con un ojo y un capullo luminoso
    '..V...R..R...V..', '.VR..RRRRRR..RV.', '.RR.RRLRRLRR.RR.', '..RRRRERRERRRR..', '...RRRRRRRRRR...', '..VRRRRFFRRRRV..', '.RRRRRVRRVRRRRR.', 'RR.RRRRRRRRRR.RR',
    'R...RRVRRRRR...R', '....RRRRRRRR....', '...RRRRVRRRR....', '...RRRR.RRRR....', '..RRRR...RRRR...', '..RRR.....RRR...', '.RRR.......RRR..', 'RRR.........RRR.'],
  esporas: [ // polilla de esporas con sacos brillantes colgando
    '................', 'W..............W', 'WW....B..B....WW', 'WWW....BB....WWW', 'WwWW..BBBB..WWwW', 'WwwWBBEBBEBBWwwW', '.WwwWBBBBBBWwwW.', '..WWWWBBBBWWWW..',
    '....FWWBBWWF....', '....FF.BB.FF....', '....FF.BB.FF....', '.....F.BB.F.....', '........BB......', '................', '................', '................'],
  magma: [ // babosa de magma: roca fundida con brasas
    '................', '................', '................', '.........E..E...', '.........M..M...', '.....MMMMMMMM...', '...MMLLLMMMMMM..', '..MMLLMMMMMMMMM.',
    '.MMLMMMMKMMMMMM.', '.MMMMMMMMMMKMMM.', 'MMMMKMMMMMMMMMMM', 'MMMMMMMMMMKMMMMM', 'MMMKMMMMMMMMMMMM', '.MMDDMMMMMMDDMM.', '..DDDDDDDDDDDD..', '.L..L......L..L.'],
  hongo: [ // hongo esporífero arraigado
    '................', '................', '....CCCCCCCC....', '..CCWCCCCCCWCC..', '.CCCCCCCCWCCCCC.', 'CCWCCCCCCCCCWCCC', 'CCCCCCWCCCCCCCCC', 'DDDDDDDDDDDDDDDD',
    '....FFFFFFFF....', '.....FFEEFF.....', '.....FFFFFF.....', '.....FFFFFF.....', '.....FFFFFF.....', '....FFFFFFFF....', '...FFFFFFFFFF...', '..DDDDDDDDDDDD..'],
  carcelero: [ // JEFE: carcelero colosal con capucha, armadura oxidada, musgo, cadenas y llave al cinto
    '....M.HHHH.M....', '...MMHHHHHHMM...', '....HHHHHHHH....', '....HRHHHHRH....', '....HHHHHHHH....', '..MMKKKSSKKKMM..', '.MLMKKKKKKKKMLM.', 'MKKKKKKYYKKKKKKM',
    'MKKMKKKYYKKKMKKM', 'SSKKMKKKKKKMKKSS', 'SSKKKKIIIIKKKKSS', 'SS.KKKKIIKKKK.SS', 'FF.KKKK..KKKK.FF', '...MKKK..KKKM...', '..MMKKK..KKKMM..', '..DDDDD..DDDDD..'],
  driade: [ // JEFE: figura de raíces con cuernas de ramas, flores y cabello de lianas
    '.P..B......B..P.', '.BB.BB.VV.BB.BB.', '..BBBBVVVVBBBB..', '...BB.VllV.BB...', '....VVSSSSVV....', '....VSESSESV....', '...VVVSSSSVVV...', '..VlVVBSSBVVlV..',
    '.VlVBBBBBBBBVlV.', 'BBVBBBLBBLBBBVBB', 'B.BBBBBBBBBBBB.B', 'B..BBLBBBBLBB..B', '...BBBBBBBBBB...', '..BBLBBBBBBLBB..', '.BBB.BBBBBB.BBB.', 'BBB..BB..BB..BBB'],
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
  scroll: ['.DDDDDDDD.', 'DCCCCCCCCD', 'DCLLLLLLCD', 'DCCCCCCCCD', 'DCLLLLLLCD', 'DCCCCCCCCD', 'DCLLLLLLCD', 'DCCCCCCCCD', '.DDDDDDDD.'], // pergamino de las mejoras del mapa
  bottle: ['....DD....', '....DD....', '...DDDD...', '....CC....', '...CCCC...', '..CCLLCC..', '.CCCLLCCC.', '.CCCCCCCC.', '.CCCCCCCC.', '.CCCCCCCC.', '..CCCCCC..', '...DDDD...'],
  amulet: ['...DDDD...', '..D....D..', '..D....D..', '...DDDD...', '....DD....', '...GGGG...', '..GGWWGG..', '..GWRRWG..', '..GWRRWG..', '..GGWWGG..', '...GGGG...', '....GG....'],
  hammer: ['..HHHHH...', '.HHHHHHH..', '.HHHHHHH..', '..HHHHH.S.', '......SS..', '.....SS...', '....SS....', '...SS.....', '..SS......', '.SS.......'],
  soul: ['..PP..', '.PPPP.', 'PPWWPP', 'PPWWPP', '.PPPP.', '..PP..'],
  fireA: [ // hoguera: llama con núcleo blanco, chispas arriba y brasas entre los troncos
    '..Y...R.....Y.', '.....RRR......', '....RROORR....', '...RROOYORR...', '...ROOYWYOR...', '..RROYWWYORR..', '..ROYYWWYYOR..', '...OYYWWYYO...',
    '..LLLLEELLLL..', '.LLDLLLLLLDLL.', 'LLLLLLLLLLLLLL', '.DDDDDDDDDDDD.'],
  fireB: [
    '.Y.....R...Y..', '......RRR.....', '.....ROORR....', '....RROYORR...', '...ROOYWYOR...', '...ROYWWYOR...', '..RROYWWYORR..', '...OYYWWYYO...',
    '..LLLLEELLLL..', '.LLDLLLLLLDLL.', 'LLLLLLLLLLLLLL', '.DDDDDDDDDDDD.'],
  fireOff: [
    '..............', '..............', '..............', '..............', '..............', '..............', '..............', '....E..E......',
    '..LLLLLLLLLL..', '.LLDLLLLLLDLL.', 'LLLLLLLLLLLLLL', '.DDDDDDDDDDDD.'],
  heart: ['.WR.RR.', 'WRRRRRR', 'RRRRRRD', '.RRRRD.', '..RDD..', '...D...'], // corazón en tres tonos: brillo arriba a la izquierda y sombra abajo a la derecha
  // ---- Jefes de la Zona 2 con dibujo propio (16x16, mismo tamaño que los que sustituyen)
  capitan: [ // Capitán de Hierro: gran yelmo con visera, hombreras de pinchos, tabardo con el sello y manchas de óxido
    '.......TT.......', '.....KKKKKK.....', '....KHHHHHHK....', '....KHEEEEHK....', '....KHHDDHHK....', '.KKKKHHHHHHKKKK.', 'KAAaKKKKKKKKaAAK', 'KAaRAATTTTAAAaAK',
    'KAAAAATGGTAAAAAK', '.KAAAATTTTAAAAK.', '..KKAAGGGGAAKK..', '...KAATTTTAAK...', '...KAATTTTAAK...', '...KAAK..KAAK...', '...KRAK..KAAK...', '..KKAAK..KAAKK..'],
  farero: [ // Último Farero: capucha de encerado, barba blanca, ojos de luz y el farol de su faro en un asta
    '.....HHHHHH.....', '....HHHHHHHH..RR', '...HHHHHHHHHH.R.', '...HHKKKKKKHH.R.', '...HHKEKKEKHH.R.', '...HHKBBBBKH.LLL', '..HHCBBBBBBCHLYL', '..HCCBBBBBBCCLLL',
    '.CCcCCBBBBCCcCCR', '.CCcCCCBBCCCcCCR', '..CCcCCCCCCcCC.R', '..CCcCCCCCCcCC.R', '..CCCCCCCCCCCC.R', '..CCCCCCCCCCCC.R', '..DDDD....DDDD.R', '.DDDDD....DDDDDR'],
  subastadora: [ // La Subastadora: peluca empolvada, gorguera dorada, mazo de subasta y frascos de almas en la falda
    '.....WWWWWW.....', '...WWWWWWWWWW...', '..WWWWWWWWWWWW..', '..WWWSSSSSSWWW..', '..WWSSESSESSWW..', '..WWSSSMMSSSWW..', '...WWSSSSSSWW.YY', '...YYYYYYYYYY.R.',
    '....GGGGGGGGSR..', '...GGGYGGYGGG...', '..GGGGGGGGGGGG..', '.GGYGGGGGGGGYGG.', '.GGGJJGGGGJJGGG.', 'GGGGJjGGGGJjGGGG', 'GYYYYYYYYYYYYYYG', '.DDDDDDDDDDDDDD.'],
  chambelan: [ // Chambelán Sin Rostro: cara lisa y pálida, gorguera blanca, cadena de oficio y llaves; flota sin pies
    '.....KKKKKK.....', '....KKKKKKKK....', '....KFFFFFFK....', '....FFFFFFFf....', '....FFFFFFFf....', '....FFFFFFFf....', '.....FFFFFf.....', '...GGGWWWWGGG...',
    '..KKGGWWWWGGKK..', '.KKKKGGGGGGKKKK.', '.KKPKKKGGKKKPKK.', 'KKKPKKKKGGKKPKKK', 'KKKPYKKKKKKKPKKK', '.KKPYKKKKKKKPKK.', '..KKPKKKKKKPKK..', '...KKK.KK.KKK...'],
  cadalso: [ // Cadalso, el Verdugo Mudo: capucha con la boca cosida, torso desnudo cruzado de cadenas y hacha enorme
    '.....KKKKKK..XX.', '....KKKKKKKK.XXX', '...KKKKKKKKKKXXX', '...KKKEKKEKKK.XR', '...KKKKKKKKKK..R', '...KKKTTTTKKK..R', '.KKKKKKKKKKKKK.R', 'KSSSSSSSSSSSSSKR',
    'KSSKIISssSIIKSKR', 'KSSKSIIssIISKSKR', 'KSSKSSIIIISSKSKR', '.KKAAAAAAAAAAKKR', '..KAAAAAAAAAAK.R', '..KAAAAAAAAAAK.R', '...KKK....KKK..R', '..KKKK....KKKK.R'],
  anhelia: [ // Anhelia, la Primera Sed: figura enorme de vestido de raíces de sangre seca, sin ojos y con la boca abierta con cuatro huecos sangrantes
    '.....RRRRRR.....', '...RRRRRRRRRR...', '..RRSSSSSSSSRR..', '..RSSSSSSSSSSR..', '..RSSSSSSSSSSR..', '..RSSSMMMMSSSR..', '..RSMBMBMBMBSR..', '..RSSMMMMMMSSR..',
    '...RSSSSSSSSR...', '..RRRSSSSSSRRR..', '.RRRRRRRRRRRRRR.', 'RRrRRRRRRRRRRrRR', 'RRrRRRrRRrRRRrRR', 'RrRRRRRrRRRRRRrR', 'RRRRrRRRRRRrRRRR', 'RRrRRRRRRRRRRrRR'],
  vigilia: [ // Vigilia, la Cantora: pelo de algas, boca cosida con hilo de plata y vestido de olas con espuma; flota
    '....HHHHHHHH....', '...HHHHHHHHHH...', '..HHHSSSSSSHHH..', '..HHSSSSSSSSHH..', '..HHSSESSESSHH..', '..HHSSSSSSSSHH..', '..HHSSTtTtSSHH..', '..HHHSSSSSSHHH..',
    '..HHHHSSSSHHHH..', '.HHGGGGGGGGGGHH.', 'HHGGgGGGGGGgGGHH', 'HGGGGGWGGWGGGGGH', '.GGgGGGGGGGGgGG.', '..GGGGgGGgGGGG..', '...WGGGGGGGGW...', '....WW.WW.WW....'],
};
// Variantes de los PNJ: parten de npcMad (12x14) y cambian solo algunas filas para que cada uno tenga su silueta (barba, capucha, corona, velo...)
const npcVar = rows => MAPS.npcMad.map((r, i) => rows[i] || r);
MAPS.npcArch = npcVar({ 6: '..HSMMMMSH..', 7: '..THHHHHHT..', 8: '.TTTHHHHTTT.' }); // archivista: barba larga sobre la túnica
MAPS.npcMonk = npcVar({ 0: '...HHHHHH...', 1: '..HHHHHHHH..', 2: '.HHHSSSSHHH.', 8: '.TTTDDDDTTT.' }); // monje: capucha cerrada y cuerda al cinto
MAPS.npcSmith = npcVar({ 0: '............', 1: '..HHHHHHHH..', 6: '..HHMMMMHH..', 8: '.TTTDDDDTTT.', 9: 'TTT.DDDD.TTT', 10: '.T..DDDD..T.' }); // herrero: pelo corto, barba y delantal de cuero
MAPS.npcOracle = npcVar({ 2: '.HHSSYYSSHH.', 5: '.HSWWWWWWSH.', 6: '..SSWWWWSS..' }); // oráculo: joya en la frente y velo
MAPS.npcWatcher = npcVar({ 0: '...HHHHHH...', 1: '.HHHHHHHHHH.', 2: '.HHHHHHHHHH.' }); // vigía: gorro calado hasta las cejas
MAPS.npcLua = npcVar({ 0: '.H.HHHHHH.HH', 5: '.HSSSSSSSSHH', 6: '..SSMMMMSSH.', 7: '..TTTTTTTTH.' }); // Lúa: coleta
MAPS.npcIsolda = npcVar({ 0: '.Y.Y.YY.Y.Y.', 1: 'HHHHHHHHHHHH', 5: 'HHSSSSSSSSHH', 6: 'HHSSMMMMSSHH', 7: 'H.TTTTTTTT.H', 8: 'HTTTTTTTTTTH' }); // Isolda: corona y melena larga
MAPS.npcKing = npcVar({ 0: '.Y.Y.YY.Y.Y.', 6: '..HHMMMMHH..', 7: '..THHHHHHT..', 8: '.TTHHHHHHTT.' }); // Rey: corona y barba dorada
MAPS.npcPrisoner = npcVar({ 10: '.I..TTTT..I.' }); // preso: grilletes en las muñecas
MAPS.npcMoss = npcVar({ 1: 'HVHHHHHHVHHH', 7: '..VTTTTTTV..', 8: '.TTTVTTTTVT.' }); // preso del musgo: musgo en el pelo y los hombros
const MAP_PAL = {
  sk: { W: '#e8e4d4', D: '#15101c' },
  bat1: { B: '#5b3a78', R: '#ff3b3b', D: '#15101c' }, bat2: { B: '#5b3a78', R: '#ff3b3b', D: '#15101c' },
  kn: { A: '#8e97ab', G: '#5b6477', R: '#ff3b3b', D: '#2a2f3d' },
  gh: { G: '#bfe3ff', D: '#1d2a44' },
  garg: { W: '#6c7488', G: '#9aa2b6', R: '#ff3b3b', D: '#3a4052' },
  bishop: { M: '#e8e8f4', Y: '#ffd23b', S: '#d9c2a8', D: '#15101c', P: '#6a2f8e' },
  clock: { B: '#b8863a', G: '#ffd98a', R: '#ff3b3b', D: '#5a3f14' },
  conde: { K: '#1a1020', S: '#e8dcdc', R: '#ff2b2b', C: '#a01a2e' },
  limo: { G: '#4f8a3a', L: '#9ad65a', D: '#2a4a24', F: '#6dffd0', E: '#fff27a' },
  preso: { F: '#6dffd0', W: '#e8e4d4', S: '#8aa38a', R: '#ff3b3b', D: '#15101c', M: '#3f7a3a', C: '#4a4036', I: '#8a8a96' },
  raiz: { R: '#6a4a2a', L: '#8a6a3a', V: '#3f7a3a', E: '#ff3b3b', F: '#6dffd0' },
  esporas: { B: '#2a3a30', W: '#4a6a5a', w: '#8ab89a', E: '#ff3b3b', F: '#6dffd0' },
  magma: { M: '#ff7a2a', L: '#ffd06a', K: '#e0501a', D: '#7a2a0e', E: '#ffffff' },
  hongo: { C: '#b48aff', W: '#e8d8ff', D: '#3a2a50', F: '#d8d4b8', E: '#ff3b3b' },
  carcelero: { H: '#1a2a22', K: '#4a5a52', M: '#3f7a3a', L: '#8fd35a', R: '#ff3b3b', S: '#8aa38a', Y: '#ffd23b', I: '#8a8a96', F: '#6dffd0', D: '#1a1f1c' },
  driade: { B: '#5a4128', L: '#8a6a3a', V: '#3f7a3a', l: '#8fd35a', S: '#9ab89a', E: '#6dffd0', P: '#d86ac8' },
  archon: { M: '#cfe8ff', Y: '#ffd23b', S: '#d9c2a8', D: '#15101c', T: '#2a5a8a', L: '#7ad8ff', W: '#ffffff' },
  reina: { W: '#e8e4d4', G: '#cfc6a8', R: '#ff3b3b', D: '#5a5240', Y: '#ffd23b' },
  aurora: { H: '#ffe3a0', W: '#fff2d8', S: '#ffe3d0', R: '#ff8aa8', D: '#3a1a2a', G: '#ffb36a' },
  vesper: { K: '#0c0a2a', C: '#2a3a9a', S: '#cfd8ff', B: '#6ad0ff', M: '#e8f0ff' },
  capitan: { K: '#262a38', A: '#667088', a: '#9aa4ba', H: '#7a8498', T: '#8a1a2a', G: '#d8b040', E: '#ffb347', D: '#12101a', R: '#8a4a2a' },
  farero: { H: '#16303c', K: '#0a1218', C: '#2a5266', c: '#4a8296', B: '#e8ecf4', E: '#ffe066', L: '#8a6a3a', Y: '#ffd23b', R: '#6a5a40', D: '#0e1a22' },
  subastadora: { W: '#d8d0e8', S: '#e8d4c4', E: '#ffd23b', M: '#b02a4a', Y: '#d8b040', G: '#2a6a4a', R: '#6a4a2a', J: '#6dffd0', j: '#e0fff4', D: '#0e1a14' },
  chambelan: { K: '#1a1424', F: '#e4dcd0', f: '#b8aea4', G: '#d8b040', W: '#f0ecf4', P: '#6a3a8a', Y: '#ffd23b' },
  cadalso: { K: '#1c1418', S: '#a8887a', s: '#6a4a44', E: '#ff5a3a', T: '#d8d0b8', I: '#9a9aa8', A: '#5a3a28', X: '#c9ced8', R: '#5a3a28' },
  anhelia: { R: '#6a1e28', r: '#3a0e14', S: '#e0cfc8', M: '#140808', B: '#d8283a' },
  vigilia: { H: '#1a4a5a', S: '#dcd8f0', E: '#ffffff', T: '#e8f0ff', t: '#9aa8d0', G: '#2a6a8a', g: '#6ac0d8', W: '#e8f8ff' },
  altar: { Y: '#ffd23b', O: '#ff7a1c', W: '#b8bdc9', D: '#6a6f7e' },
  crystal: { C: '#ff5b7a', W: '#ffd0da', D: '#a01a3c' },
  relic: { Y: '#ffd23b', W: '#fffbd0' },
  heart: { R: '#ff3b5c', W: '#ffb0c0', D: '#b01c3c' },
  fireA: { R: '#ff4a1c', O: '#ff9a1c', Y: '#ffe066', W: '#fff6c8', E: '#ff7a2a', L: '#6a4a2a', D: '#3a2a1a' }, fireB: { R: '#ff4a1c', O: '#ff9a1c', Y: '#ffe066', W: '#fff6c8', E: '#ff7a2a', L: '#6a4a2a', D: '#3a2a1a' },
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
// Sombreado automático de enemigos, jefes y PNJ (los vampiros jugables NO lo usan): borde en sombra abajo/derecha (contorno del mismo tono, más oscuro),
// borde iluminado arriba/izquierda y, por dentro, un toque claro bajo cada cambio de color por arriba y uno oscuro por abajo. Tres tonos por zona sin tocar los mapas.
// Las letras de SHADE_SKIP (ojos, luces, llamas) se dejan tal cual para que sigan brillando.
const SHADE_SKIP = { sk: 'D', bat1: 'RD', bat2: 'RD', kn: 'R', gh: 'D', garg: 'R', bishop: 'D', clock: 'R', conde: 'R', limo: 'FE', preso: 'FRD', raiz: 'EF', esporas: 'EF', magma: 'E', hongo: 'E', carcelero: 'RYF', driade: 'E', archon: '', reina: 'R', aurora: '', vesper: '',
  fireA: 'RYOWE', fireB: 'RYOWE', fireOff: 'E', bottle: 'L', scroll: 'L', amulet: 'WR', hammer: '', crystal: 'W', relic: 'W', altar: 'YO', // objetos: también con contorno y volumen
  npcM: 'E', npcMad: 'WD', npcArch: 'WD', npcMonk: 'WD', npcSmith: 'WD', npcOracle: 'WD', npcWatcher: 'WD', npcLua: 'WD', npcIsolda: 'WD', npcKing: 'WD', npcPrisoner: 'WD', npcMoss: 'WD', capitan: 'E', farero: 'EY', subastadora: 'EJjM', chambelan: '', cadalso: 'E', vigilia: 'E' };
const SHADE_OUT = { gh: '#1d3a6a', magma: '#5a1a08', limo: '#0a2a10', aurora: '#6a2a4a' }; // color del contorno cuando no conviene el casi negro
function drawMapShaded(ctx, map, pal, px, ox, oy, skip, out) {
  const at = (x, y) => { const c = map[y] && map[y][x]; return c && c !== '.' ? c : null; };
  for (let y = 0; y < map.length; y++) for (let x = 0; x < map[y].length; x++) {
    const c = at(x, y); if (!c) continue;
    let col = pal[c] || '#ffffff';
    if (!skip.includes(c)) {
      const up = at(x, y - 1), dn = at(x, y + 1), lf = at(x - 1, y), rt = at(x + 1, y);
      if (!dn || !rt) col = artMix(col, out || '#06040c', 0.5);
      else if (!up || !lf) col = artMix(col, '#fff4e0', 0.24);
      else if (up !== c && !skip.includes(up)) col = artMix(col, '#fff4e0', 0.12);
      else if (dn !== c && !skip.includes(dn)) col = artMix(col, '#06040c', 0.2);
    }
    ctx.fillStyle = col; ctx.fillRect(ox + x * px, oy + y * px, px, px);
  }
}
function heroPal(color, key) { return Object.assign({ H: '#16101c', S: '#e8e0f4', R: '#ff2b3b', F: '#ffffff', C: color, A: '#2a2540', D: '#120c18', W: '#c9c4e0', G: '#c9ced8', B: '#8a5a2a', Y: '#ffd23b', N: '#3a6ad9', P: '#98a3bb' }, HERO_LOOK[key] || {}); }

// Dibuja un héroe en un canvas DOM (para el lobby)
function drawHeroCanvas(canvas, color) {
  canvas.width = 12; canvas.height = 14;
  drawMapCtx(canvas.getContext('2d'), HERO_MAPS[color] || MAPS.hero, heroPal(HERO_COLORS[color], color), 1, 0, 0);
}

function rndSeeded(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

// ---------- color: mezclas para sacar los tonos intermedios de cada zona (luz cálida arriba, sombra fría abajo)
function artMix(a, b, t) { // a y b son '#rrggbb'; t de 0 (a) a 1 (b)
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = s => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return '#' + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1);
}
const ART_TONES = {};
function artTones(z) { // tonos derivados de la paleta de la zona (se calculan una vez)
  if (ART_TONES[z]) return ART_TONES[z];
  const p = ZONE_PAL[z], m = artMix;
  return (ART_TONES[z] = {
    b1: m(p.base, p.light, 0.22), b2: m(p.base, p.dark, 0.32), // ladrillo claro y oscuro
    hi: m(m(p.light, p.glow, 0.2), '#ffffff', 0.1), // borde iluminado: luz cálida
    sh: m(p.dark, '#0a0820', 0.4), // sombra: fría y azulada
    bgl: m(p.bg, p.base, 0.12), bgs: m(p.bg, p.bgd, 0.55), // fondo: un poco más claro y más oscuro
  });
}
// Estilo propio de cada zona (ver drawTile): wall = muro (panel madera, plate remachado, long sillares largos), floor = suelo, fx = adorno de pared
const ZONE_STYLE = {
  0: { floor: 'checker', fx: 'veins' }, // Vestíbulo: mármol noble
  1: { wall: 'panel', floor: 'parquet' }, // Biblioteca: paneles de madera y parqué
  2: { wall: 'long', floor: 'wet', fx: 'glint' }, // Capilla: sillares largos y fríos
  3: { floor: 'wet', fx: 'moss' }, // Calabozos: humedad y musgo
  4: { wall: 'plate', floor: 'grate' }, // Reloj: placas de latón remachadas y rejilla
  5: { floor: 'checker', fx: 'gold' }, // Sala Real: damero y tachuelas doradas
  7: { wall: 'long', floor: 'checker', fx: 'gold' }, // Torres del Alba: mármol rosado
  10: { floor: 'parquet', fx: 'plaster' }, // Refugio: enlucido y tablas
  11: { floor: 'grass', fx: 'ivy' }, // Jardín: hiedra y hierba
  12: { floor: 'slab', fx: 'rust' }, // Cuartel: óxido y arañazos
  13: { wall: 'long', floor: 'wet', fx: 'salt' }, // Faro: costra de sal y humedad
  14: { floor: 'cobble', fx: 'plaster' }, // Mercado: adoquines y enlucido
  15: { wall: 'long', floor: 'checker', fx: 'gold' }, // Los Tronos: oscuro con oro
  16: { wall: 'long', floor: 'cobble' }, // La Calle de las Horas: sillares toscos y adoquines
};
const ART_GLASS = { 2: ['#5a86d8', '#9a5ab8', '#d8b050'], 5: ['#c83a3a', '#d8b050'], 7: ['#f0a0c0', '#f8d890'], 11: ['#9a5ab8', '#5a3a8a'], 13: ['#8ad8ff', '#d8f0ff'], 15: ['#c83a5a', '#d8b050'] }; // vidrieras

function drawTile(ctx, z, k, ox) {
  const p = ZONE_PAL[z], S = 2, t = artTones(z), st = ZONE_STYLE[z] || {}; // 16x16 lógico -> 32x32
  const r = (x, y, w, h, c) => { // rectángulo recortado al tile (nada se sale a la casilla vecina)
    if (x < 0) { w += x; x = 0; } if (y < 0) { h += y; y = 0; } if (x + w > 16) w = 16 - x; if (y + h > 16) h = 16 - y;
    if (w <= 0 || h <= 0) return; ctx.fillStyle = c; ctx.fillRect(ox + x * S, y * S, w * S, h * S);
  };
  const px = (x, y, c) => r(x, y, 1, 1, c);
  const rnd = rndSeeded(z * 31 + (k === 4 ? 0 : k) * 7 + 5); // el muro agrietado usa la misma semilla que el muro: solo se distingue por la grieta
  const ri = n => Math.floor(rnd() * n);
  const rw = (x, y, w, h, c) => { r(x, y, w, h, c); if (x + w > 16) r(x - 16, y, w, h, c); if (y + h > 16) r(x, y - 16, w, h, c); if (x + w > 16 && y + h > 16) r(x - 16, y - 16, w, h, c); }; // rectángulo que da la vuelta: el tile encaja sin cortes
  // mampostería: mortero de fondo y ladrillos con borde iluminado arriba/izquierda y sombra abajo/derecha
  const masonry = (tones, line, o = {}) => {
    const a = 5 + ri(5), b = 2 + ri(2), j0 = o.long ? [0] : o.plate ? [0, 8] : [0, a], j1 = o.long ? [8] : o.plate ? [4, 12] : [b, b + 8];
    r(0, 0, 16, 16, line);
    const brick = (xa, xb, y, lE, rE, tone) => {
      const w = xb - xa + 1; r(xa, y, w, 7, tone);
      if (o.hi) { r(xa, y, w, 1, o.hi); r(xa, y + 6, w, 1, o.lo); if (lE) r(xa, y + 1, 1, 5, artMix(tone, o.hi, 0.5)); if (rE) r(xb, y + 1, 1, 5, artMix(tone, o.lo, 0.5)); }
      for (let i = 0, n = ri(3); i < n; i++) px(xa + ri(w), y + 1 + ri(5), rnd() < 0.5 ? (o.lo || line) : (o.hi || tone)); // motas de desgaste
      if (o.plate) { px(xa + 1, y + 2, o.hi); px(xb - 1, y + 2, o.hi); px(xa + 1, y + 3, o.lo); px(xb - 1, y + 3, o.lo); } // remaches
    };
    const row = (js, y) => js.forEach((j, i) => {
      const tone = tones[ri(tones.length)];
      if (i + 1 < js.length) brick(j + 1, js[i + 1] - 1, y, true, true, tone);
      else { brick(j + 1, 15, y, true, js[0] === 0, tone); if (js[0] > 0) brick(0, js[0] - 1, y, false, true, tone); } // el ladrillo que cruza el borde se parte en dos con el mismo tono
    });
    row(j0, 1); row(j1, 9);
  };
  const wallTones = [p.base, p.base, t.b1, t.b2], wallO = { hi: artMix(p.base, p.light, 0.65), lo: artMix(p.base, p.dark, 0.7) };
  const bricks = (base, line, hi) => { // compatibilidad con el código de las zonas especiales
    if (base === p.bg) masonry([p.bg, p.bg, t.bgl, t.bgs], line, { hi: artMix(p.bg, p.base, 0.1), lo: t.bgs });
    else masonry(wallTones, line, wallO);
  };
  const bgBricks = () => masonry([p.bg, p.bg, t.bgl, t.bgs], p.bgd, { hi: artMix(p.bg, p.base, 0.1), lo: t.bgs });
  const spikes = () => { // pinchos de acero con la cara izquierda iluminada y la derecha en sombra
    for (let s = 0; s < 3; s++) { const cx = s * 5 + 2; for (let h = 0; h < 11; h++) { const half = Math.floor((11 - h) / 4), y = 15 - h;
      if (h > 8) { r(cx, y, 1, 1, '#ffffff'); continue; }
      r(cx - half, y, half * 2 + 1, 1, '#aeb4c4'); if (half) { r(cx - half, y, 1, 1, '#eef2fa'); r(cx + half, y, 1, 1, '#6a7084'); } else px(cx, y, '#dfe4ee'); } }
    r(0, 14, 16, 2, '#5a5f70'); r(0, 14, 16, 1, '#9aa0b2'); px(1, 15, '#2a2d36'); px(8, 15, '#2a2d36'); px(14, 15, '#2a2d36');
  };
  const crack = () => { // grieta apenas visible: hay que fijarse (un hilo corto, solo algo más oscuro que el ladrillo)
    const c = artMix(p.base, p.mortar, 0.75);
    [[7, 5], [7, 6], [8, 7], [8, 8], [9, 9]].forEach(([x, y]) => px(x, y, c));
    px(6, 11, c); px(7, 4, artMix(p.base, p.mortar, 0.45));
  };
  const FX = {
    veins() { for (let i = 0; i < 2; i++) { let x = ri(10), y = ri(12); for (let n = 0; n < 4; n++) { px(x + n, y + (n >> 1), artMix(p.base, p.light, 0.35)); } } },
    glint() { for (let i = 0; i < 4; i++) px(ri(16), 1 + ri(14), artMix(p.base, p.glow, 0.3)); },
    moss() { for (let i = 0; i < 5; i++) { const x = ri(15) + 1, y = ri(2) * 8; r(x, y, 1 + ri(3), 1, '#3f6a3a'); if (rnd() < 0.6) r(x, y + 1, 1, 1 + ri(4), '#2f5230'); } px(ri(16), ri(16), '#9dffb0'); },
    gold() { px(4, 4, '#e0b848'); px(3, 4, '#8a6a20'); px(12, 12, '#e0b848'); px(11, 12, '#8a6a20'); },
    plaster() { const x = ri(8), y = ri(8), c = artMix(p.base, '#e8dcc0', 0.38); r(x, y, 6, 4, c); r(x + 1, y + 4, 4, 1, c); r(x - 1, y + 1, 1, 2, c); px(x + 2, y + 1, artMix(c, p.base, 0.5)); r(x + 3, y + 3, 2, 1, artMix(c, p.dark, 0.3)); },
    ivy() { for (let i = 0; i < 3; i++) { const x = 1 + ri(14), y = ri(2) * 8 + 1, n = 3 + ri(5); r(x, y, 1, n, '#2e5a34'); for (let j = 1; j < n; j += 2) px(x + (j & 2 ? 1 : -1), y + j, '#5a9a4a'); } px(1 + ri(14), 2 + ri(12), '#7a1a3a'); },
    rust() { for (let i = 0; i < 2; i++) { const x = 1 + ri(14), y = ri(2) * 8 + 1; r(x, y, 1, 3 + ri(4), '#6a3a22'); px(x, y + 1, '#b0642c'); } px(ri(16), ri(16), '#b0642c'); },
    salt() { for (let i = 0; i < 6; i++) px(ri(16), ri(2) * 8 + 1 + ri(2), '#dfeaf2'); r(ri(12), 12 + ri(3), 3, 1, artMix(p.base, '#dfeaf2', 0.5)); },
  };
  const wall = () => { // muros (k 0) y muros agrietados (k 4)
    if (st.wall === 'panel') { // paneles de madera: tablas verticales con veta y nudos
      r(0, 0, 16, 16, t.sh);
      for (let i = 0; i < 4; i++) { const x = i * 4, c = [p.base, t.b1, p.base, t.b2][(i + ri(2)) & 3]; r(x, 0, 4, 16, c); r(x, 0, 1, 16, artMix(c, p.light, 0.5)); r(x + 3, 0, 1, 16, artMix(c, p.dark, 0.7)); for (let g = 0; g < 4; g++) px(x + 1 + ri(2), ri(16), artMix(c, p.dark, 0.5)); }
      r(0, 7, 16, 1, artMix(p.base, p.dark, 0.5)); r(0, 8, 16, 1, artMix(p.base, p.light, 0.35)); // moldura a media altura
      px(1 + ri(2) * 8, 3 + ri(3), p.dark); return;
    }
    masonry(wallTones, p.mortar, Object.assign({ long: st.wall === 'long', plate: st.wall === 'plate' }, wallO));
    if (FX[st.fx]) FX[st.fx]();
  };
  const floorTop = () => { // suelo: cara superior iluminada con luz cálida, labio de sombra fría debajo
    const fl = st.floor || 'slab', a = 3 + ri(8);
    if (fl === 'checker') { r(0, 0, 8, 3, p.light); r(8, 0, 8, 3, artMix(p.light, p.base, 0.45)); r(0, 0, 8, 1, t.hi); r(8, 0, 8, 1, artMix(t.hi, p.base, 0.3)); r(0, 3, 16, 1, p.dark); r(8, 0, 1, 4, artMix(p.base, p.dark, 0.5)); }
    else if (fl === 'parquet') { const w = artMix(p.light, '#c08a48', 0.45); r(0, 0, 16, 4, artMix(p.base, '#8a5a30', 0.5)); r(0, 0, 16, 1, artMix(w, '#ffffff', 0.15)); r(0, 1, 16, 2, w); for (let x = 0; x < 16; x += 5) { r(x, 1, 1, 3, artMix(p.base, p.dark, 0.6)); } for (let i = 0; i < 4; i++) px(ri(16), 1 + ri(2), artMix(w, p.dark, 0.35)); r(0, 3, 16, 1, artMix(p.dark, '#2a1608', 0.4)); }
    else if (fl === 'grate') { r(0, 0, 16, 4, artMix(p.light, p.base, 0.3)); r(0, 0, 16, 1, t.hi); for (let x = 1; x < 16; x += 4) r(x, 1, 2, 2, p.mortar); r(0, 3, 16, 1, p.dark); }
    else if (fl === 'grass') { r(0, 0, 16, 3, '#2e4a34'); r(0, 3, 16, 1, p.dark); for (let x = 0; x < 16; x++) { const h = 1 + ri(3); r(x, 0, 1, h, rnd() < 0.3 ? '#8ab86a' : '#4a7a46'); if (rnd() < 0.15) px(x, 0, '#c09ae8'); } r(0, 3, 16, 1, p.dark); }
    else if (fl === 'cobble') { r(0, 0, 16, 4, p.mortar); [0, 6, 11].forEach((x0, i) => { const w = i === 0 ? 5 : i === 1 ? 4 : 5, c = i === 1 ? p.light : artMix(p.light, p.base, 0.3); r(x0 + 1, 0, w, 3, c); r(x0 + 1, 0, w, 1, t.hi); r(x0 + 1, 2, w, 1, artMix(c, p.dark, 0.35)); px(x0 + 1, 0, p.mortar); px(x0 + w, 0, p.mortar); }); r(0, 3, 16, 1, p.dark); }
    else { r(0, 0, 16, 1, t.hi); r(0, 1, 16, 2, p.light); px(a, 1, artMix(p.light, p.dark, 0.35)); px(a, 2, artMix(p.light, p.dark, 0.35)); px((a + 8) % 16, 1, artMix(p.light, p.dark, 0.3)); r(0, 3, 16, 1, p.dark); if (fl === 'wet') { px(2 + ri(4), 1, '#ffffff'); px(9 + ri(5), 1, artMix(p.light, '#ffffff', 0.6)); r(5 + ri(5), 2, 2, 1, artMix(p.light, '#ffffff', 0.35)); } }
    r(0, 4, 16, 1, artMix(p.dark, p.mortar, 0.55)); // labio de sombra bajo el suelo
    for (let i = 0; i < 3; i++) px(ri(16), 5 + ri(5), artMix(p.base, p.dark, 0.5)); // desgaste en el cuerpo
  };
  const shadowDither = (c) => { for (let x = 0; x < 16; x += 2) px(x, 6, c); for (let x = 1; x < 16; x += 4) px(x, 7, c); }; // sombra con dithering bajo las plataformas
  const platform = () => {
    r(0, 0, 16, 6, p.base); r(0, 0, 16, 1, t.hi); r(0, 1, 16, 1, p.light); r(0, 3, 16, 1, artMix(p.base, p.dark, 0.35)); r(0, 4, 16, 1, p.dark); r(0, 5, 16, 1, t.sh);
    px(1, 2, t.hi); px(14, 2, t.hi); px(1, 3, p.dark); px(14, 3, p.dark); [4, 8, 11].forEach(x => px(x, 2, artMix(p.base, p.dark, 0.5)));
    shadowDither(artMix(p.mortar, '#000000', 0.5));
  };
  const pillar = () => { // columna de fondo: luz a la izquierda, sombra a la derecha, capitel y desgaste
    bgBricks();
    r(4, 0, 8, 16, p.dark); r(4, 0, 1, 16, t.b1); r(5, 0, 1, 16, p.light); r(6, 0, 3, 16, p.base); r(9, 0, 2, 16, artMix(p.base, p.dark, 0.5)); r(11, 0, 1, 16, t.sh);
    r(3, 0, 10, 1, p.light); r(3, 1, 10, 1, p.base); r(3, 2, 10, 1, t.sh); r(4, 3, 8, 1, artMix(p.dark, p.mortar, 0.5));
    for (let i = 0; i < 4; i++) px(5 + ri(6), 4 + ri(12), artMix(p.base, p.dark, 0.6));
  };
  const windowTile = () => { // ventana: marco de piedra, cuatro vidrios y travesaños
    bgBricks();
    const cols = ART_GLASS[z] || [artMix(p.glow, '#000000', 0.5), artMix(p.glow, '#000000', 0.62)];
    r(3, 0, 10, 16, p.mortar); r(3, 0, 1, 16, artMix(p.base, p.light, 0.4)); r(12, 0, 1, 16, p.dark);
    [[4, 1, 3, 6], [9, 1, 3, 6], [4, 8, 3, 8], [9, 8, 3, 8]].forEach(([x, y, w, h], i) => { const c = artMix(cols[(i + (ART_GLASS[z] ? 0 : (i & 1))) % cols.length], '#000000', ART_GLASS[z] ? 0.42 : 0); r(x, y, w, h, c); r(x, y, w, 1, artMix(c, '#ffffff', 0.35)); px(x, y + 1, artMix(c, '#ffffff', 0.25)); r(x + w - 1, y + h - 1, 1, 1, artMix(c, '#000000', 0.4)); });
    r(7, 1, 2, 15, p.dark); r(7, 1, 1, 15, artMix(p.base, p.light, 0.3)); r(4, 7, 8, 1, p.dark);
  };
  if (z === 6 && (k === 0 || k === 1)) { // roca natural: bloques con luz arriba y sombra abajo que dan la vuelta al tile
    r(0, 0, 16, 16, p.base);
    for (let i = 0; i < 12; i++) { const x = ri(16), y = ri(16), w = 2 + ri(4), h = 2 + ri(3), lit = rnd() < 0.5; rw(x, y, w, h, lit ? artMix(p.base, p.light, 0.5) : p.dark); rw(x, y, w, 1, lit ? artMix(p.light, p.glow, 0.25) : p.base); rw(x, y + h - 1, w, 1, lit ? p.base : p.mortar); }
    for (let i = 0; i < 8; i++) px(ri(16), ri(16), p.mortar);
    if (k === 1) { r(0, 0, 16, 1, artMix(p.light, p.glow, 0.25)); r(0, 1, 16, 1, artMix(p.base, p.light, 0.5)); }
    return;
  }
  if (z === 8 && k !== 5) { // cueva: roca irregular con luz de lava
    const lava = '#ff7a2a', warm = artMix(p.light, lava, 0.35);
    const rock = (base, d, l, hiC) => { r(0, 0, 16, 16, base); for (let i = 0; i < 10; i++) { const x = ri(16), y = ri(16), w = 2 + ri(4), h = 2 + ri(3), lit = rnd() < 0.5; rw(x, y, w, h, lit ? l : d); rw(x, y, w, 1, lit ? hiC : base); rw(x, y + h - 1, w, 1, lit ? base : p.mortar); } for (let i = 0; i < 5; i++) px(ri(16), ri(16), p.mortar); };
    if (k === 0) rock(p.base, p.dark, p.light, warm);
    else if (k === 1) { rock(p.base, p.dark, p.light, warm); r(0, 0, 16, 2, p.light); r(0, 0, 16, 1, warm); r(0, 2, 16, 1, p.dark); r(0, 3, 16, 1, p.mortar); for (let i = 0; i < 3; i++) px(ri(16), 0, lava); px(ri(16), 1, '#ffd06a'); }
    else if (k === 2) { r(0, 0, 16, 6, p.base); r(0, 0, 16, 1, warm); r(0, 1, 16, 1, p.light); r(0, 4, 16, 1, p.dark); r(0, 5, 16, 1, p.mortar); [3, 8, 12].forEach(x => px(x, 2, p.dark)); px(10, 3, lava); shadowDither(artMix(p.mortar, '#7a2a0e', 0.4)); }
    else if (k === 3) rock(p.bg, p.bgd, '#241610', artMix(p.bg, lava, 0.12));
    else if (k === 4) { rock(p.base, p.dark, p.light, warm); [[7, 4], [7, 5], [8, 6], [8, 7], [9, 8]].forEach(([x, y]) => { px(x, y, p.mortar); px(x + 1, y, artMix(p.base, lava, 0.4)); }); }
    else if (k === 6) { rock(p.bg, p.bgd, '#241610', artMix(p.bg, lava, 0.12)); r(4, 0, 8, 16, p.dark); r(4, 0, 1, 16, p.base); r(5, 0, 2, 16, p.light); r(7, 0, 2, 16, p.base); r(9, 0, 1, 16, p.dark); r(11, 0, 1, 16, p.mortar); r(3, 0, 10, 1, p.light); r(3, 1, 10, 1, p.base); r(3, 2, 10, 1, p.mortar); }
    else { rock(p.bg, p.bgd, '#241610', artMix(p.bg, lava, 0.12)); r(6, 0, 4, 16, '#7a2a0e'); r(7, 0, 2, 16, lava); r(8, 0, 1, 16, '#ffd06a'); r(6, 5, 1, 4, '#c0501a'); r(9, 9, 1, 4, '#c0501a'); r(5, 0, 1, 16, 'rgba(255,122,42,0.2)'); r(10, 0, 1, 16, 'rgba(255,122,42,0.2)'); } // veta de lava
    return;
  }
  if (z === 9) { // calabozos profundos: piedra húmeda con musgo cayendo por las juntas, manchas verdes y hongos
    const bgk = k === 3 || k === 6 || k === 7;
    const drip = (x, y, len) => { r(x, y, 1, len, p.moss); r(x, y + len, 1, 1, p.mossL); }; // hilo de musgo que cuelga
    const blot = (n, c) => { for (let i = 0; i < n; i++) r(Math.floor(rnd() * 13), Math.floor(rnd() * 14), 2 + Math.floor(rnd() * 3), 1 + Math.floor(rnd() * 2), c); }; // manchas
    const cap = (x, y, c) => { r(x - 1, y, 3, 1, c); r(x, y - 1, 1, 1, c); r(x, y + 1, 1, 2, '#cfe8d0'); }; // hongo: sombrero de 3 px + pie
    if (k !== 5) bricks(bgk ? p.bg : p.base, bgk ? p.bgd : p.mortar, bgk ? p.bg : p.light);
    if (k === 0) {
      blot(5, p.moss); blot(3, p.mossD);
      for (let x = 0; x < 16; x += 2) { if (rnd() < 0.6) r(x, 0, 2, 1, p.moss); if (rnd() < 0.6) r(x, 8, 2, 1, p.moss); } // musgo en las juntas
      for (let i = 0; i < 4; i++) drip(1 + Math.floor(rnd() * 14), rnd() < 0.5 ? 1 : 9, 2 + Math.floor(rnd() * 4)); // cae por las juntas
      for (let i = 0; i < 2; i++) r(Math.floor(rnd() * 15), 2 + Math.floor(rnd() * 12), 1, 1, p.fung); // motas luminosas
    } else if (k === 1) { // suelo: alfombra de musgo con hongos incrustados
      r(0, 0, 16, 4, p.moss); r(0, 4, 16, 1, p.mossD);
      for (let x = 0; x < 16; x++) if (rnd() < 0.5) r(x, 0, 1, 1, p.mossL);
      for (let i = 0; i < 4; i++) drip(1 + Math.floor(rnd() * 14), 5, 1 + Math.floor(rnd() * 4));
      cap(3, 1, p.fung); cap(11, 2, rnd() < 0.5 ? p.fung : p.fung2);
    } else if (k === 2) { // plataforma cubierta de musgo con lianas colgando
      r(0, 0, 16, 5, p.base); r(0, 4, 16, 1, p.dark); r(0, 5, 16, 1, p.mortar); r(0, 0, 16, 2, p.moss); r(0, 2, 16, 1, p.mossD);
      [2, 6, 9, 13].forEach(x => drip(x, 6, 2 + Math.floor(rnd() * 5))); cap(12, 1, p.fung);
    } else if (k === 3) { // fondo: manchas oscuras y alguna mota brillante
      blot(4, '#142a1e'); for (let i = 0; i < 3; i++) r(Math.floor(rnd() * 15), Math.floor(rnd() * 15), 1, 1, 'rgba(109,255,208,0.35)');
    } else if (k === 4) { // grieta apenas visible
      blot(3, p.moss); r(7, 6, 1, 2, p.mortar); r(8, 8, 1, 2, p.mortar);
    } else if (k === 5) { // pinchos de raíz seca
      for (let t2 = 0; t2 < 3; t2++) { const cx = t2 * 5 + 2; for (let h = 0; h < 11; h++) { const half = Math.floor((11 - h) / 4); r(cx - half, 15 - h, half * 2 + 1, 1, h > 8 ? '#d8b070' : p.rootL); if (half) px(cx + half, 15 - h, p.root); } }
      r(0, 14, 16, 2, p.moss);
    } else if (k === 6) { // pilar de fondo con raíces trepando
      r(4, 0, 8, 16, p.dark); r(5, 0, 2, 16, p.base); r(6, 0, 1, 16, p.light); r(11, 0, 1, 16, p.mortar); r(3, 0, 10, 2, p.base);
      for (let y = 0; y < 16; y++) { r(7 + Math.round(Math.sin(y * 0.7) * 2), y, 1, 1, p.root); r(10 - Math.round(Math.sin(y * 0.5 + 1) * 1.5), y, 1, 1, p.rootL); }
      r(4, 10, 4, 2, p.moss); r(8, 4, 3, 2, p.mossD); drip(5, 12, 3);
    } else { // k === 7: reja con luz de hongos al fondo
      r(3, 0, 10, 16, p.mortar); r(4, 1, 8, 15, '#0a1c15'); r(4, 1, 8, 15, 'rgba(109,255,208,0.16)'); r(6, 1, 1, 15, p.dark); r(9, 1, 1, 15, p.dark); r(4, 7, 8, 1, p.mortar);
      cap(6, 11, p.fung); cap(10, 13, p.fung2); r(3, 0, 10, 2, p.moss);
    }
    return;
  }
  switch (k) {
    case 0: wall(); break;
    case 1: wall(); floorTop(); break;
    case 2: platform(); break;
    case 3: bgBricks(); if (z === 5 || z === 15) { for (let y = 0; y < 16; y += 4) for (let x = (y & 4 ? 0 : 2); x < 16; x += 4) px(x, y, artMix(p.bg, p.glow, 0.13)); } else if (z === 3 || z === 11) { px(ri(16), ri(16), artMix(p.bg, p.glow, 0.2)); r(ri(14), ri(2) * 8, 2, 1, artMix(p.bg, '#3f7a3a', 0.35)); } break;
    case 4: wall(); crack(); break; // grieta apenas visible: hay que fijarse
    case 5: spikes(); break;
    case 6: pillar(); break;
    case 7: windowTile(); break;
  }
}

function buildArt(scene) {
  const tx = scene.textures;
  if (tx.exists('tiles')) return;
  // Tileset: 6 zonas x 8 tipos
  // Atlas de 64 tiles por fila con 2 px de separación entre tiles (así no pasa de 4096 px aunque haya más zonas) y los bordes de cada tile repetidos en esa separación, para que al escalar no se cuele el tile vecino
  const nT = ZONE_PAL.length * 8, AC = 64, AS = 2, rowsT = Math.ceil(nT / AC), cvs = tx.createCanvas('tiles', AC * (32 + AS) - AS, rowsT * (32 + AS) - AS), tctx = cvs.getContext('2d');
  for (let n = 0; n < nT; n++) { const ox = (n % AC) * (32 + AS), oy = ((n / AC) | 0) * (32 + AS); tctx.save(); tctx.translate(0, oy); drawTile(tctx, (n / 8) | 0, n % 8, ox); tctx.restore(); }
  for (let n = 0; n < nT; n++) {
    const ox = (n % AC) * (32 + AS), oy = ((n / AC) | 0) * (32 + AS), hasR = (n % AC) < AC - 1 && n + 1 < nT, hasD = n + AC < nT;
    tctx.drawImage(cvs.canvas, ox + 31, oy, 1, 32, ox + 32, oy, 1, 32); if (hasR) tctx.drawImage(cvs.canvas, ox + 34, oy, 1, 32, ox + 33, oy, 1, 32); // separación a la derecha: mitad de este tile, mitad del siguiente
    tctx.drawImage(cvs.canvas, ox, oy + 31, 32, 1, ox, oy + 32, 32, 1); if (hasD) tctx.drawImage(cvs.canvas, ox, oy + 34 * 1 + 0, 32, 1, ox, oy + 33, 32, 1); // y hacia abajo
  }
  const tiles = cvs;
  tiles.refresh();

  const makeMap = (key, mapName, pal, px) => {
    const m = MAPS[mapName]; const c = tx.createCanvas(key, m[0].length * px, m.length * px);
    if (SHADE_SKIP[mapName] !== undefined) drawMapShaded(c.getContext('2d'), m, pal, px, 0, 0, SHADE_SKIP[mapName], SHADE_OUT[mapName]); else drawMapCtx(c.getContext('2d'), m, pal, px, 0, 0);
    c.refresh();
  };
  for (const col in HERO_COLORS) { MAPS['hero_' + col] = HERO_GAME_MAPS[col]; makeMap('hero_' + col, 'hero_' + col, heroPal(HERO_COLORS[col], col), 1); }
  ['sk', 'bat1', 'bat2', 'kn', 'gh', 'garg', 'bishop', 'clock', 'conde', 'altar', 'crystal', 'relic', 'heart'].forEach(n => makeMap(n, n, MAP_PAL[n], 1));

  // vampiros agachados (aplastados contra el suelo)
  for (const col in HERO_COLORS) {
    const src = tx.get('hero_' + col).getSourceImage(); const c = tx.createCanvas('hero_' + col + '_crouch', 12, 14); const g = c.getContext('2d');
    g.imageSmoothingEnabled = false; g.drawImage(src, 0, 0, 12, 14, 0, 5, 12, 9); c.refresh();
  }
  // fotogramas de caminar (piernas abiertas / juntas)
  const legsA = ['...AA...AA..', '..AA.....AA.', '..DD.....DD.', '.DDD....DDD.'], legsB = ['....AAAA....', '....AAAA....', '....DDDD....', '...DDDDDD...'];
  for (const col in HERO_COLORS) [['w1', legsA], ['w2', legsB]].forEach(([n, legs]) => {
    if (col === 'green') legs = ['..CCCCCCCC..'].concat(legs.slice(1)); // Malak: la túnica baja un píxel más al andar, para que no se vea hueco entre las piernas
    const hm = HERO_GAME_MAPS[col], low = legs.map((row, i) => row.split('').map((ch, x) => ('BGYN'.includes(hm[10 + i][x]) ? hm[10 + i][x] : ch)).join('')); // el arma sigue a la vista al andar
    const c = tx.createCanvas('hero_' + col + '_' + n, 12, 14); drawMapCtx(c.getContext('2d'), hm.slice(0, 10).concat(low), heroPal(HERO_COLORS[col], col), 1, 0, 0); c.refresh();
  });
  makeMap('npc_merchant', 'npcM', MAP_PAL.npcM, 1);
  makeMap('sentinel', 'kn', { A: '#3a4a6a', G: '#2a3550', R: '#6ad0ff', D: '#1a2238' }, 1);
  makeMap('bonfire1', 'fireA', MAP_PAL.fireA, 1); makeMap('bonfire2', 'fireB', MAP_PAL.fireB, 1); makeMap('bonfire_off', 'fireOff', MAP_PAL.fireOff, 1);
  const madPal = (hair, robe) => ({ H: hair, S: '#e8d0b0', W: '#ffffff', D: '#15101c', M: '#7a1a1a', T: robe, Y: '#ffd23b', I: '#8a8a96', V: '#5a9a4a' });
  makeMap('npc_archivist', 'npcArch', madPal('#d8d4ee', '#6a4a8a'), 1);
  makeMap('npc_prisoner', 'npcPrisoner', madPal('#3a2a1a', '#8a8a96'), 1);
  makeMap('npc_monk', 'npcMonk', madPal('#7a5a3a', '#7a5a3a'), 1);
  makeMap('npc_oracle', 'npcOracle', madPal('#ffe6b0', '#c9a0ff'), 1);
  makeMap('npc_smith', 'npcSmith', madPal('#2a1a10', '#8a4a1a'), 1);
  makeMap('npc_watcher', 'npcWatcher', madPal('#b8d8ff', '#5a7aa8'), 1);
  makeMap('npc_lua', 'npcLua', madPal('#7aa8ff', '#3a6ad9'), 1); // Lúa, la hermana de Zaf: pelo claro y ropa azul
  makeMap('npc_isolda', 'npcIsolda', madPal('#2a1a2a', '#3a6a8a'), 1); // la Reina Isolda: pelo oscuro y manto azul
  makeMap('npc_king', 'npcKing', madPal('#ffd23b', '#8a1a2a'), 1); // el Rey Destronado: corona dorada y manto carmesí
  ['limo', 'preso', 'raiz', 'esporas', 'hongo', 'carcelero', 'driade', 'magma'].forEach(n => makeMap(n, n, MAP_PAL[n], 1));
  makeMap('npc_prisionero_musgo', 'npcMoss', madPal('#3f7a3a', '#3a4a36'), 1);
  ['archon', 'reina', 'aurora', 'vesper'].forEach(n => makeMap(n, n, MAP_PAL[n], 1)); // dibujos propios de los jefes nuevos
  ['capitan', 'farero', 'subastadora', 'chambelan', 'cadalso', 'vigilia', 'anhelia'].forEach(n => makeMap(n, n, MAP_PAL[n], 1)); // jefes de la Zona 2 (16x16, como los que sustituyen): la textura se llama igual que el jefe
  // fotograma de reposo: el torso baja un píxel (respiración)
  for (const col in HERO_COLORS) {
    const src = tx.get('hero_' + col).getSourceImage(); const c = tx.createCanvas('hero_' + col + '_i', 12, 14); const g = c.getContext('2d');
    g.imageSmoothingEnabled = false; g.drawImage(src, 0, 8, 12, 6, 0, 8, 12, 6); g.drawImage(src, 0, 0, 12, 8, 0, 1, 12, 8); c.refresh();
  }
  [['fang', '#e8e8f0', '#ffffff'], ['talis', '#7ad8ff', '#e0f7ff'], ['pot', '#ff3b5c', '#ffd0da'], ['pot2', '#b43bff', '#ecd0ff'], ['spd', '#3bd9ff', '#d0f6ff'], ['str', '#ff9a3b', '#ffe2c0'], ['lamp', '#ffe066', '#fffbe0'], ['ward', '#c9ced8', '#ffffff'], ['rage', '#d4ff3b', '#f6ffd0'], ['tonic', '#3bff9a', '#d0ffe6'], ['fruit', '#ff3bd9', '#ffd0f4']].forEach(([k, c, l]) => makeMap('it_' + k, 'bottle', { D: '#8a6a4a', C: c, L: l }, 1));
  // mejoras del mapa (se compran a los mercaderes): un pergamino de cada color
  [['map_fire', '#ffb347', '#fff0c0'], ['map_boss', '#e8e8f0', '#ffffff'], ['map_npc', '#9be37a', '#e4ffd8'], ['map_cry', '#ff7aa0', '#ffe0ea'], ['map_gem', '#5fd8ff', '#e0f8ff'], ['map_forge', '#ffd23b', '#fff6c0'], ['map_lift', '#ff6a6a', '#ffd8d8']].forEach(([k, c, l]) => makeMap('it_' + k, 'scroll', { D: '#8a6a4a', C: c, L: l }, 1));
  makeMap('it_amu', 'amulet', MAP_PAL.amulet, 1);
  makeMap('forge', 'hammer', MAP_PAL.hammer, 1);
  makeMap('soul', 'soul', MAP_PAL.soul, 1);
  const mk = (key, w, h, fn) => { const c = tx.createCanvas(key, w, h); fn(c.getContext('2d')); c.refresh(); };
  // gema: talla de brillante con luz arriba a la izquierda y cara en sombra abajo a la derecha
  mk('gem', 8, 8, g => { const f = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); }; f('#0e5a80', 2, 0, 4, 8); f('#0e5a80', 0, 2, 8, 4); f('#1b8fb8', 2, 1, 4, 6); f('#1b8fb8', 1, 2, 6, 4); f('#7ae8ff', 2, 1, 3, 3); f('#3ab8e0', 4, 4, 2, 2); f('#ffffff', 2, 1, 1, 1); f('#cff6ff', 3, 2, 1, 1); f('#0a3a58', 5, 6, 1, 1); });
  mk('orb', 8, 8, g => { const f = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); }; f('#a0102a', 2, 0, 4, 8); f('#a0102a', 0, 2, 8, 4); f('#ff2b4a', 2, 1, 4, 6); f('#ff2b4a', 1, 2, 6, 4); f('#ff7a90', 2, 2, 3, 3); f('#ffd0d8', 3, 2, 2, 1); f('#ffffff', 3, 2, 1, 1); f('#c0143a', 5, 5, 1, 1); });
  mk('shock', 16, 8, g => { const f = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); }; f('#c0501a', 0, 4, 16, 4); f('#c0501a', 3, 2, 10, 2); f('#c0501a', 6, 0, 4, 2); f('#ffb347', 1, 5, 14, 3); f('#ffb347', 4, 3, 8, 2); f('#ffb347', 7, 1, 2, 2); f('#fff3c0', 4, 6, 8, 2); f('#fff3c0', 6, 4, 4, 2); f('#ffffff', 7, 5, 2, 1); });
  mk('gear', 12, 12, g => { // engranaje con dientes, aro luminoso a la izquierda y arriba, y eje oscuro
    g.translate(6, 6); g.fillStyle = '#8a6a28'; for (let i = 0; i < 8; i++) { g.save(); g.rotate(i * Math.PI / 4); g.fillRect(-1.5, -6, 3, 3); g.restore(); }
    g.beginPath(); g.arc(0, 0, 4.6, 0, Math.PI * 2); g.fill(); g.fillStyle = '#c29a4a'; g.beginPath(); g.arc(-0.4, -0.4, 4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffe08a'; g.fillRect(-4, -3, 1, 2); g.fillRect(-3, -4, 2, 1); g.fillStyle = '#5a4318'; g.beginPath(); g.arc(0, 0, 2, 0, Math.PI * 2); g.fill(); g.fillStyle = '#2a1e08'; g.fillRect(-1, -1, 2, 2);
  });
  mk('slash', 22, 22, g => { // media luna afilada: núcleo blanco, borde azulado y puntas finas
    const dot = (c, a, rr) => { g.fillStyle = c; g.fillRect(Math.round(11 + Math.cos(a) * rr), Math.round(11 + Math.sin(a) * rr), 2, 2); };
    for (let a = -1.25; a <= 1.25; a += 0.03) { const th = 0.5 + 3.6 * Math.cos(a / 1.25 * Math.PI / 2); for (let rr = 10 - th; rr <= 10.2; rr += 0.5) dot(rr > 9.2 ? '#8ab8ff' : rr > 8 ? '#ffffff' : '#cfe6ff', a, rr); }
    g.fillStyle = '#ffffff'; for (let a = -0.9; a <= 0.9; a += 0.05) g.fillRect(Math.round(11 + Math.cos(a) * 9.3), Math.round(11 + Math.sin(a) * 9.3), 1, 1);
  });
  mk('flame1', 6, 9, g => { const f = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); }; f('#c0300a', 1, 3, 4, 6); f('#c0300a', 2, 1, 2, 3); f('#ff6a1c', 1, 4, 4, 4); f('#ff6a1c', 2, 2, 2, 2); f('#ffb02a', 2, 5, 2, 3); f('#fff2a0', 2, 6, 2, 2); f('#6a4a2a', 1, 8, 4, 1); });
  mk('flame2', 6, 9, g => { const f = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); }; f('#c0300a', 1, 4, 4, 5); f('#c0300a', 3, 0, 2, 4); f('#ff6a1c', 1, 5, 4, 3); f('#ff6a1c', 3, 1, 1, 3); f('#ffb02a', 2, 5, 2, 3); f('#fff2a0', 2, 6, 2, 2); f('#6a4a2a', 1, 8, 4, 1); });
  mk('spear', 34, 8, g => { const f = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); }; f('#8a5a2a', 0, 3, 26, 2); f('#c08a4a', 0, 3, 26, 1); f('#5a3a18', 0, 4, 26, 1); f('#c9ced8', 22, 2, 4, 4); f('#8a90a2', 22, 5, 4, 1); f('#ffffff', 26, 1, 6, 6); f('#aeb4c4', 26, 5, 6, 2); f('#ffffff', 32, 3, 2, 2); f('#dfe4ee', 28, 1, 3, 1); });
  mk('arrow', 16, 5, g => { const f = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); }; f('#a07a52', 0, 2, 12, 1); f('#6a4a2a', 3, 2, 8, 1); f('#e8e8f4', 12, 1, 3, 3); f('#9aa0b2', 12, 3, 3, 1); f('#ffffff', 15, 2, 1, 1); f('#ff6a8a', 0, 1, 3, 3); f('#c03a5a', 0, 3, 3, 1); f('#ffd0da', 1, 1, 2, 1); });
  mk('ring', 20, 6, g => { g.fillStyle = 'rgba(255,60,60,0.28)'; g.beginPath(); g.ellipse(10, 3, 9, 2.4, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#ff3b3b'; g.lineWidth = 1; g.stroke(); g.strokeStyle = 'rgba(255,200,180,0.8)'; g.beginPath(); g.ellipse(10, 3, 6, 1.3, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); });
  mk('pillar', 12, 50, g => { const gr = g.createLinearGradient(0, 0, 0, 50); gr.addColorStop(0, 'rgba(255,220,210,0.95)'); gr.addColorStop(0.35, '#ff3b3b'); gr.addColorStop(1, '#6a0a14'); g.fillStyle = gr; g.fillRect(2, 0, 8, 50); g.fillStyle = 'rgba(120,0,10,0.5)'; g.fillRect(8, 0, 2, 50); g.fillStyle = 'rgba(255,255,255,0.55)'; g.fillRect(4, 0, 2, 50); g.fillStyle = 'rgba(255,230,200,0.5)'; g.fillRect(5, 0, 1, 50); });
  mk('saw', 14, 14, g => { // sierra circular: dientes, disco con borde brillante y eje con tornillo
    g.translate(7, 7); g.fillStyle = '#9aa0b2';
    for (let i = 0; i < 8; i++) { g.save(); g.rotate(i * Math.PI / 4); g.fillRect(-1, -7, 2, 3); g.restore(); }
    g.beginPath(); g.arc(0, 0, 5, 0, Math.PI * 2); g.fill(); g.fillStyle = '#d8dce8'; g.beginPath(); g.arc(-0.5, -0.5, 4.2, 0, Math.PI * 2); g.fill(); g.fillStyle = '#aeb4c4'; g.beginPath(); g.arc(0.5, 0.8, 3, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#4a4f60'; g.beginPath(); g.arc(0, 0, 2.2, 0, Math.PI * 2); g.fill(); g.fillStyle = '#8a8fa0'; g.fillRect(-0.5, -1.5, 1, 3); g.fillStyle = '#ff5a5a'; g.fillRect(-0.5, -4.5, 1, 2); g.fillStyle = '#ffffff'; g.fillRect(-3, -3, 1, 1);
  });
  mk('bomb', 10, 10, g => { g.fillStyle = '#0c0c14'; g.beginPath(); g.arc(5, 6, 4.2, 0, Math.PI * 2); g.fill(); g.fillStyle = '#26262e'; g.beginPath(); g.arc(4.6, 5.6, 3.4, 0, Math.PI * 2); g.fill(); g.fillStyle = '#6a6a7a'; g.fillRect(3, 4, 2, 2); g.fillStyle = '#a0a0b0'; g.fillRect(3, 4, 1, 1); g.fillStyle = '#8a6a3a'; g.fillRect(5, 1, 1, 2); g.fillStyle = '#ffb347'; g.fillRect(5, 0, 2, 1); g.fillStyle = '#ffe066'; g.fillRect(6, 0, 1, 1); });
  mk('it_bomb', 12, 12, g => { g.fillStyle = '#0c0c14'; g.beginPath(); g.arc(6, 7, 5.2, 0, Math.PI * 2); g.fill(); g.fillStyle = '#26262e'; g.beginPath(); g.arc(5.6, 6.6, 4.3, 0, Math.PI * 2); g.fill(); g.fillStyle = '#6a6a7a'; g.fillRect(3, 4, 2, 2); g.fillStyle = '#b0b0c0'; g.fillRect(3, 4, 1, 1); g.fillStyle = '#8a6a3a'; g.fillRect(6, 1, 1, 3); g.fillStyle = '#ffb347'; g.fillRect(6, 0, 3, 1); g.fillStyle = '#ff5a5a'; g.fillRect(8, 0, 1, 1); g.fillStyle = '#ffe066'; g.fillRect(7, 0, 1, 1); });
  mk('page', 10, 12, g => { g.fillStyle = '#b89a62'; g.fillRect(1, 0, 8, 12); g.fillStyle = '#e8d8b0'; g.fillRect(1, 1, 7, 10); g.fillStyle = '#f6ecc8'; g.fillRect(1, 1, 7, 1); g.fillStyle = '#8a6a3a'; g.fillRect(8, 1, 1, 10); g.fillStyle = '#6a4a2a'; [2, 4, 6, 8].forEach(y => g.fillRect(2, y, 5, 1)); g.fillStyle = '#c03a3a'; g.fillRect(6, 8, 2, 3); g.fillStyle = '#ff7a7a'; g.fillRect(6, 8, 1, 1); });
  mk('puff', 8, 8, g => { g.fillStyle = '#ffffff'; g.fillRect(2, 0, 4, 8); g.fillRect(0, 2, 8, 4); });
  mk('light', 128, 128, g => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  mk('sconce', 6, 5, g => { g.fillStyle = '#6a4a2a'; g.fillRect(1, 0, 4, 2); g.fillRect(2, 2, 2, 3); g.fillStyle = '#3a2a1a'; g.fillRect(1, 1, 4, 1); });
  mk('glow', 64, 64, g => { const gr = g.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(255,200,120,0.55)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
}
