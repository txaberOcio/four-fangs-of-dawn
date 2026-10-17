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
    lv: [{ dmg: 1, cd: 0.45, n: 1, range: 360 }, { dmg: 1, cd: 0.42, n: 1, range: 440 }, { dmg: 1, cd: 0.42, n: 2, range: 440 }, { dmg: 2, cd: 0.40, n: 2, range: 520 }, { dmg: 2, cd: 0.36, n: 2, range: 560 }] },
  purple: { name: 'Guadaña', kind: 'melee', fx: 'slash', fxScale: 3.2, tint: 0xc07aff, off: 26, h: 74, act: 0.22,
    lv: [{ dmg: 2, w: 92, cd: 0.62 }, { dmg: 2, w: 102, cd: 0.56 }, { dmg: 3, w: 102, cd: 0.56 }, { dmg: 3, w: 114, cd: 0.50 }, { dmg: 4, w: 124, cd: 0.50 }] },
};
const PASSIVES = {
  red: { name: 'Sed de sangre', life: 0.40 },
  blue: { name: 'Visión nocturna', aura: 1.8, projPlus: 1, speed: 0.94 }, // desventajas: +1 daño de proyectiles y algo más lento
  green: { name: 'Cazadora de almas', souls: 1.5, dmgTaken: 1.5 },    // desventaja: +50% daño recibido y sin romper muros
  purple: { name: 'Piel de sombra', hp: 2, speed: 0.82 },             // desventaja: más lento
};
// catálogo de objetos; qué vende cada mercader y cuándo se define en SHOP_STOCK
const ITEMS = [
  { id: 'pot', name: 'Poción de sangre', price: 30, desc: 'Cura 3 corazones.' },
  { id: 'spd', name: 'Elixir de velocidad', price: 40, desc: '+35% de velocidad durante 20 s.' },
  { id: 'lamp', name: 'Aceite de linterna', price: 35, desc: 'Tu luz crece durante 60 s.' },
  { id: 'bomb', name: 'Bomba de mano', price: 25, desc: 'Explota a los 1,3 s: rompe muros agrietados y daña enemigos.' },
  { id: 'pot2', name: 'Poción mayor', price: 75, desc: 'Cura toda la vida.' },
  { id: 'str', name: 'Elixir de fuerza', price: 60, desc: '+1 de daño durante 25 s.' },
  { id: 'ward', name: 'Piel de piedra', price: 55, desc: 'Bloquea los próximos 2 golpes.' },
  { id: 'amu', name: 'Amuleto de resurrección', price: 0, gems: 3, desc: 'Si mueres, revives (se gasta solo).' },
  { id: 'rage', name: 'Elixir de furia', price: 70, desc: 'Atacas un 40% más rápido durante 20 s.' },
  { id: 'tonic', name: 'Tónico de almas', price: 80, desc: 'Doble de almas durante 60 s.' },
  { id: 'fruit', name: 'Fruto de sangre', price: 0, gems: 4, desc: '+1 corazón máximo para siempre.' },
  { id: 'fang', name: 'Colmillo de acero', price: 0, gems: 4, perm: 'dmg', max: 3, desc: '+1 de daño para siempre (hasta 3 veces; cada una cuesta más).' },
  { id: 'talis', name: 'Talismán de almas', price: 0, gems: 3, perm: 'souls', max: 2, desc: '+20% de almas de los enemigos para siempre (hasta 2 veces).' },
];
// Dos monedas: las almas (◆) se ganan matando enemigos y compran objetos corrientes; las gemas (✦) se encuentran por el mapa y compran mejoras permanentes y objetos importantes.
const GEMS_BOSS = { garg: 2, bishop: 3, clock: 4, archon: 4, reina: 4, conde: 5, aurora: 6, vesper: 6, alcaide: 5, madre: 7 }; // gemas que suelta cada jefe la primera vez
// Mercancía de cada mercader (clave = sala), en el orden en que se muestra.
// [objeto, jefes derrotados necesarios, vampiro que lo tiene desde el principio (opcional)]
// Para añadir un mercader o ampliar el stock basta con tocar esta tabla.
const SHOP_STOCK = {
  vest: [['pot', 0], ['bomb', 1, 'green'], ['lamp', 2], ['spd', 3], ['talis', 2]],
  naveS: [['pot', 0], ['bomb', 0], ['lamp', 0], ['spd', 1], ['pot2', 1], ['ward', 2], ['str', 3], ['amu', 0], ['fang', 1]],
  mir: [['pot', 0], ['bomb', 0], ['spd', 0], ['pot2', 0], ['ward', 1], ['str', 1], ['rage', 2], ['tonic', 3], ['amu', 0], ['fang', 0], ['talis', 1], ['fruit', 1]]
};
const SHOP_ORDER = ['vest', 'naveS', 'mir'];
// poderes elementales de la Forja de los Elementos: cambian el color del ataque y añaden un efecto
const ELEMENTS = {
  fire: { name: 'Fuego', tint: 0xff7a2a, desc: 'quema al enemigo: daño extra durante 3 s', long: 'El filo arde. Cada golpe prende al enemigo: sufre 1 de daño cada 0,75 s durante 3 s (el fuego no se acumula, se renueva). Muy útil contra enemigos con mucha vida.' },
  ice: { name: 'Hielo', tint: 0x7ad8ff, desc: 'ralentiza a los enemigos a la mitad durante 3 s', long: 'El filo se escarcha. El enemigo golpeado se mueve a la mitad de velocidad durante 3 s, así que es más fácil esquivarlo y huir. Los jefes no se ralentizan.' },
  bolt: { name: 'Rayo', tint: 0xfff06a, desc: 'salta a otro enemigo cercano con parte del daño', long: 'El filo chisporrotea. Cada golpe salta al enemigo más cercano (hasta unos 6 casillas) con el 60% del daño. Muy bueno contra grupos.' },
  poison: { name: 'Veneno', tint: 0x7aff6a, desc: 'envenena: daño continuo durante 6 s', long: 'El filo gotea veneno. El enemigo sufre 1 de daño por segundo durante 6 s: tarda más que el fuego, pero hace más daño total si no te acosan.' },
  shadow: { name: 'Sombra', tint: 0xb06aff, desc: 'tus golpes te curan a veces (50% de curar medio corazón)', long: 'El filo bebe la noche. Cada golpe tiene un 50% de curarte medio corazón. Ideal para aguantar combates largos.' },
  eclipse: { name: 'Eclipse', tint: 0xf4f0ff, desc: '25% de probabilidad de golpe crítico: daño doble', long: 'El filo se eclipsa. Cada golpe tiene un 25% de ser crítico y hacer el doble de daño. Mejor con armas rápidas.' },
  wither: { name: 'Marchitar', tint: 0x8a5a9a, desc: 'marca al enemigo: recibe un 30% más de daño durante 4 s', long: 'El filo marchita. El enemigo golpeado queda marcado 4 s y recibe un 30% más de daño de TODOS los jugadores: perfecto para jugar en equipo.' }
};
const ELEMENT_ORDER = ['', 'fire', 'ice', 'bolt', 'poison']; // Forja de los Elementos (Aurora)
const SHRINE_ORDER = ['', 'shadow', 'eclipse', 'wither']; // poderes de sombra
const ALL_ORDER = ['', 'fire', 'ice', 'bolt', 'poison', 'shadow', 'eclipse', 'wither']; // el herrero en su santuario ofrece todos
// Textos con teclas según el dispositivo: {act}, {dash}, {down} se sustituyen por la tecla, el botón del mando o el botón táctil
function inputMode() {
  if (IS_TOUCH) return 'touch';
  try { if (navigator.getGamepads && [...navigator.getGamepads()].some(g => g && g.connected)) return 'pad'; } catch (err) { /* sin mando */ }
  return 'key';
}
const HINT_KEYS = { act: { key: 'E', pad: '△', touch: 'E' }, dash: { key: 'C', pad: '○', touch: '»' }, down: { key: '↓', pad: 'la cruceta ↓', touch: '▼ de la cruceta' } };
function hintText(s) { const m = inputMode(); return String(s).replace(/\{(act|dash|down)\}/g, (_, k) => HINT_KEYS[k][m]); }
// ---------- Bestiario y diarios ----------
const BESTIARY = {
  sk: { name: 'Esqueleto', text: 'Soldados de la guardia caídos. Patrullan y, si te ven cerca, te persiguen. Son débiles pero muchos.', tip: 'Un par de golpes bastan.' },
  kn: { name: 'Caballero maldito', text: 'Armaduras vacías que aún obedecen al Conde. Lentos y pesados, golpean fuerte.', tip: 'Golpea y retrocede; no te quedes pegado.' },
  bat: { name: 'Murciélago', text: 'Duermen en las bóvedas hasta que alguien se acerca. Temen la luz de las antorchas.', tip: 'Enciende antorchas ({act}) para mantenerlos a raya.' },
  slug: { name: 'Babosa de Musgo', text: 'Se arrastra por las celdas dejando un rastro de baba que frena a quien lo pisa.', tip: 'No pises la baba cuando haya más enemigos cerca.' },
  shroom: { name: 'Hongo Esporífero', text: 'Arraigado al suelo. Se hincha y suelta esporas que te persiguen despacio.', tip: 'Usa el impulso a través de las esporas o mátalo antes de que termine de hincharse.' },
  vine: { name: 'Liana Estranguladora', text: 'Cuelga del techo y cae sobre quien pasa justo debajo.', tip: 'Cruza corriendo en cuanto empiece a temblar.' },
  pris: { name: 'Prisionero Mohoso', text: 'Un preso que el musgo no dejó morir. Cae al suelo la primera vez y se levanta con la mitad de vida.', tip: 'Quémalo, o remátalo con el Pisotón mientras está en el suelo.' },
  alcaide: { name: 'Alcaide Verdín', text: 'Antiguo compañero de armas del Conde. Guarda las llaves y obedece una orden que ya nadie recuerda. Guarda el Pisotón de Raíces.', tip: 'Cuando se hunde en el suelo es invulnerable: sal de las marcas y golpéalo cuando salga.' },
  madre: { name: 'La Madre Moho', text: 'El corazón del musgo. No se mueve, pero su armadura de raíces solo cede ante un pisotón desde el aire.', tip: 'Cae sobre ella con el Pisotón para romper su armadura y golpéala mientras está aturdida.' },
  gh: { name: 'Fantasma', text: 'Almas penitentes que atraviesan los muros. No ven a quien está bajo la luz.', tip: 'Quédate junto a una antorcha o una hoguera.' },
  saw: { name: 'Sierra de raíl', text: 'Maquinaria del castillo y de sus torres. Va y viene por su raíl y nada la detiene.', tip: 'Invulnerable: aprende su ritmo, salta o usa el impulso.' },
  sentinel: { name: 'Centinela', text: 'Armadura sin alma que patrulla sin descanso. Ningún arma le hace daño.', tip: 'Invulnerable: esquívalo, no lo persigas.' },
  garg: { name: 'Gárgola de Piedra', text: 'Guardiana del primer umbral. Llora piedra y salta sobre quien se atreve a entrar. Su corazón guarda el Impulso.', tip: 'Salta sus ondas y golpéala tras su embestida.' },
  bishop: { name: 'Obispo Caído', text: 'Rezaba por el castillo hasta que la sangre le respondió. Se teletransporta y lanza oraciones en abanico. Guarda el Doble salto.', tip: 'Flota a baja altura: ataca mientras se materializa.' },
  clock: { name: 'Guardián del Reloj', text: 'Engranaje viviente que se protege con la luz. Guarda el Salto de pared.', tip: 'Apaga sus antorchas con {act} y atácalo a oscuras.' },
  aurora: { name: 'Aurora, Dama del Alba', text: 'Hermana de Vesper y señora del Conde, vuela entre rayos de luz. Si cae, su hermano la rescata y huye. Premio: Alas del Alba.', tip: 'Esquiva la lluvia de rayos y sus picados; golpéala cuando baje.' },
  vesper: { name: 'Vesper, Señor del Ocaso', text: 'Hermano de Aurora y señor del Conde, un cazador de sombras que embiste, se teletransporta y alza pilares. Si cae, su hermana lo rescata y huye. Premio: Ojo de la Noche.', tip: 'Vigila las marcas del suelo y salta sus embestidas.' },
  archon: { name: 'Archimago Silente', text: 'Guardián del sello de tinta. Entre sus libros flotan tormentas de luz y fantasmas que acuden a su llamada.', tip: 'Esquiva sus abanicos de orbes y la lluvia de rayos; cuando invoque ayuda, golpéalo sin parar.' },
  reina: { name: 'Reina de Huesos', text: 'Guardiana del sello de hueso. Salta con todo su peso, embiste y llama a los esqueletos de la cripta. Guarda el Martillo Latente del herrero.', tip: 'Vigila los pilares marcados en el suelo y no te quedes bajo sus saltos.' },
  conde: { name: 'El Conde', text: 'Siervo de los hermanos del Alba y portero de su castillo. Rompe el suelo de su trono para enterrar a sus cazadores en el foso, y alza pilares de sangre.', tip: 'Vigila las marcas rojas del suelo: son pilares que se alzarán.' },
};
const PAGES = {
  arch1: { title: 'Nota del Archimago', text: 'Los hermanos del Alba me pidieron guardar un sello de tinta. Lo escondí tras mil páginas y me quedé a vigilarlo. Los libros ya no responden; solo susurran mi nombre.' },
  cat1: { title: 'Lamento de la Reina', text: 'Mi sello es de hueso porque los huesos no mienten. Me encerraron bajo la Mazmorra para guardarlo, y los muertos me hacen compañía. El Conde nunca bajó a verme.' },
  corr: { title: 'Diario del Capitán', text: 'Cuando el Conde cerró las puertas ordené sellar el pasillo bajo la galería. Mis hombres se quedaron de pie, vacíos, esperando una orden que nunca llegó. Yo sigo vigilando.' },
  lect: { title: 'Notas del Archivista', text: 'Los libros pidieron sangre y se la dimos. Ahora susurran. Escribí todo lo que dicen hasta que mis ojos se quedaron entre las páginas.' },
  caden: { title: 'Carta del Carcelero', text: 'Las cadenas ya no sujetan a nadie: el Conde soltó a los presos y nos encadenó a nosotros. Si subes a la Torre del Reloj, aprende el compás de las sierras: no se detienen jamás.' },
  naveP: { title: 'Plegaria del Obispo', text: 'Padre nuestro que estás en los cielos... responde al revés. Subo al Ábside cada noche para escucharle. Anoche contestó con mi propia voz.' },
  galeria: { title: 'Cuaderno del Relojero', text: 'Los engranajes no descansan. Las sierras recorren su raíl y los centinelas mis pasillos. Construí el reloj para detener el tiempo; él me detuvo a mí.' },
  pasR: { title: 'Última carta del Conde', text: 'Cuatro cazadores vendrán, con mi misma sangre y mi misma sed. Abriré el suelo bajo mi trono y los enterraré con mis siervos. Si fallo, mis señores del alba, Aurora y Vesper, no me lo perdonarán. Quizá, al fin, alguien me detenga.' },
};
PAGES.cielo1 = { title: 'Carta sin firmar', text: 'Hermano: si lees esto es que uno de los dos ha caído. Ni el sol ni la luna aguantan solos mucho tiempo. Te esperaré en la Cumbre, donde el viento aún huele a nosotros.' };
PAGES.cumbre = { title: 'Diario del Vigía', text: 'Llevo años mirando el horizonte desde aquí. Antes eran dos luces, una al amanecer y otra al ocaso. Ahora solo veo una, y me parece más triste que la oscuridad.' };
PAGES.fragua = { title: 'Notas del Herrero', text: 'Forjé la espada del Conde y las dagas de los hermanos del Alba. Cada elemento que domino me recuerda que yo solo ardo en esta cueva, lejos de todos. Si alguien me trae mi martillo, volveré a ver la luz.' };
PAGES.rai = { title: 'Nota del Montacargas', text: 'Orden del Herrero: el ascensor solo baja a quien lleva cuentas pendientes con el Alba. Arriba el aire sabe a ceniza; aquí abajo, a tierra mojada. El musgo ya ha subido por el cable.' };
PAGES.cel = { title: 'Registro de Reos', text: 'Reo 14: pidió ver el sol. Reo 15: pidió ver la luna. Reo 16: no pidió nada y fue el único que durmió sin miedo. El musgo lo abrazó primero.' };
PAGES.rez = { title: 'Menú del último banquete', text: 'Sopa de raíces, pan de piedra y vino sin cosecha. Los carceleros comían de pie; los presos, de rodillas. Ya nadie se acuerda de quién era cada cual.' };
PAGES.ant = { title: 'Última orden del Alcaide', text: 'Me dejaron las llaves con una sola orden: no abrir hasta que los hermanos vuelvan juntos. Nunca volvieron. Ahora el musgo me habla con la voz de los dos y ya no sé a cuál obedezco. Quien me venza no es mi enemigo: es mi relevo.' };
const SOULS = { sk: 3, kn: 8, bat: 1, gh: 4, garg: 60, bishop: 80, clock: 100, conde: 200, aurora: 160, vesper: 160, alcaide: 140, madre: 300, slug: 5, shroom: 6, vine: 8, pris: 10 };
const NPC_DEFS = {
  merchant: { name: 'Mercader', tex: 'npc_merchant', shop: true, lines: [['Almas, almas... Las prefiero a las monedas. Mira lo que tengo.']] },
  archivist: { name: 'Archivista Loco', tex: 'npc_archivist', lines: [
    ['¡Shhh! ¡Los libros susurran! Dicen tu nombre... ¿o era el mío?',
      'Las paredes agrietadas... ¡golpéalas, golpéalas! Detrás siempre hay algo que brilla.',
      'Bajo la Escalera de los Retratos hay una sala que no existe. Búscala a la izquierda, abajo del todo.',
      'Y hay un túnel tan bajo que solo lo cruza quien se arrodilla. ¡Abajo, abajo, usa {down}!',
      'Dicen que dos sellos cierran la Sala del Trono: uno de tinta, sobre el Observatorio, y otro de hueso, bajo la Mazmorra de Hierro. ¡Sin ambos, el Conde no abre!',
      'Ah, y el Guardián del Reloj: la luz lo protege como una armadura. ¡Apaga sus antorchas con {act} y atácalo a oscuras!'],
    ['¿Me has visto los ojos? Los dejé entre los libros.',
      'Las antorchas... ¡enciéndelas con {act}! Los fantasmas no ven en la luz. ¡Y los murciélagos la odian!'],
    ['El Conde cuenta las páginas de noche. Yo cuento las suyas. ¡Cuarenta y dos! ¡No, cuarenta y tres!',
      'Cuidado con los espejos. No tienen reflejo y aun así te miran.'] ] },
  prisoner: { name: 'Prisionero Enloquecido', tex: 'npc_prisoner', lines: [
    ['¡¡Llevo cien años mirando la misma pared!! ¿Tú también la oyes? Dice... dice cosas.',
      'La Gárgola ya no ríe, ahora llora piedra. Si la vences te dará el Impulso: usa {dash} y cruzarás abismos.',
      'En la Mazmorra de Hierro hay un cristal más alto de lo que se salta. Hace falta un segundo aire. Y hay un hueco en el suelo que baja a las Catacumbas... donde reina la Reina de Huesos.',
      'Aquí las antorchas están apagadas... ¡enciéndelas con {act}! La oscuridad tiene dientes.'],
    ['Ellos dicen que estoy loco. ¡Yo digo que estoy aquí! ¿Dónde? Aquí. Eso creo.',
      '¿Tienes almas de sobra? El mercader vende pociones... a mí me vendió una sonrisa.'],
    ['Me quitaron la cama, luego el suelo, luego el techo. Solo queda el ruido.',
      'Si ves un fantasma, no lo mires a los ojos. Mira la luz.'] ] },
  oracle: { name: 'Oráculo del Alba', tex: 'npc_oracle', pick: (sc, pages, visits) => ((sc.progress.bosses.includes('aurora') || sc.progress.bosses.includes('vesper')) ? pages[2] : (visits === 1 ? pages[0] : pages[1])), lines: [
    ['Has llegado más alto que nadie... El Conde solo era el portero de los hermanos del Alba.',
      'Aquí viven dos hermanos rivales: AURORA, Dama del Alba, y VESPER, Señor del Ocaso. Los dos comparten el mismo emblema: media luna y medio sol.',
      'Solo podréis derrotar a UNO. Cuando uno caiga, el otro acudirá, lo recogerá y huirá para siempre.',
      'Si SIGUES RECTO por la puerta del este de esta sala, te enfrentarás a AURORA. Su premio: las ALAS DEL ALBA. Mantén saltar en el aire y planearás para cruzar grandes abismos.',
      'Si BAJAS por el hueco del centro del suelo, te enfrentarás a VESPER. Su premio: el OJO DE LA NOCHE. Verás los secretos tras los muros agrietados, tu luz crecerá y se te abrirá un santuario secreto de poderes de sombra.',
      'Hay carteles en el suelo y en la pared que lo recuerdan. Elegid bien: la decisión no se puede deshacer. Aquí hay una hoguera por si queréis guardar antes.',
      'Cuando uno de los dos caiga, se abrirá la puerta este de la cámara de Vesper: el camino hacia el cielo.'],
    ['Dos hermanos, un solo emblema, una sola elección.',
      'RECTO por la puerta del este: AURORA, con las ALAS DEL ALBA (planear al mantener saltar).',
      'BAJANDO por el hueco del suelo: VESPER, con el OJO DE LA NOCHE (ves los secretos tras los muros agrietados y tu luz crece).',
      'Derrotar a uno hace que el otro se lo lleve. Luego el camino al cielo queda abierto.'],
    ['El rival que sobrevivió se ha llevado a su hermano lejos. Algún día volveréis a verlos... en otras torres.',
      'El camino al cielo está abierto: baja a la cámara de Vesper y cruza su puerta este.'] ] },
  rivalA: { name: 'Aurora, Dama del Alba', tex: 'aurora', show: sc => sc.progress.bosses.includes('vesper') && !sc.progress.bosses.includes('aurora'), lines: [
    ['Me has quitado a mi hermano... y aun así sigo aquí. Lo cuido, lo oigo respirar. No vengo a luchar.',
      'Cuando quieras, sube a la Cumbre de verdad. Yo no volveré a pisar la Antecámara.'],
    ['Cada amanecer le leo lo que escribimos de niños. No responde, pero a veces sonríe.'] ] },
  rivalV: { name: 'Vesper, Señor del Ocaso', tex: 'vesper', show: sc => sc.progress.bosses.includes('aurora') && !sc.progress.bosses.includes('vesper'), lines: [
    ['Tu espada ha tocado a mi hermana. No te lo perdonaré, pero hoy no tengo fuerzas para odiarte.',
      'El alba y el ocaso no se pueden separar. Eso fue lo que olvidamos.'],
    ['Me quedo junto a ella hasta que despierte. Déjanos tranquilos.'] ] },
  jardinero: { name: 'Jardinero Ciego', tex: 'npc_prisionero_musgo', lines: [
    ['Chss... no pises el musgo con prisa. Aquí abajo crece todo menos la esperanza.',
      'El ascensor sube y baja solo. Paciencia: es lo único que el musgo respeta.',
      'En las Celdas Cubiertas hay una celda cuyos barrotes sangran. Dale un buen golpe a la pared.',
      'El Alcaide Verdín aún guarda las llaves. No es malo: es leal, que a veces es peor. Y bajo su sala hay un suelo de raíces que solo cede a un buen pisotón.'],
    ['¿Oyes las gotas? Cuentan los días que no pasan.'] ] },
  watcher: { name: 'Vigía del Cielo', tex: 'npc_watcher', lines: [
    ['Habéis subido hasta la Cumbre del Alba. Aquí no hay jefes: es un lugar para explorar con todo lo que habéis aprendido.',
      'Dicen que quien venció a Vesper ve un tesoro tras un muro agrietado, al fondo de esta sala (dos cristales de vida), y que el suelo agrietado de aquí abajo guarda el Santuario de las Sombras.',
      'Y que quien venció a Aurora puede planear hasta el balcón lejano, sobre el vacío, donde brilla otro cristal.',
      'Al este hay un jardín colgante: hace falta impulso, doble salto y salto de pared. Descansad en la hoguera cuando queráis.'],
    ['El viento aquí huele a ceniza y a amanecer. Pronto habrá más que ver.'] ] },
  // El herrero empieza en la Cueva del Abismo. Si le llevas el Martillo Latente (lo guarda la Reina de Huesos) se muda a su santuario secreto bajo la Cumbre del Alba.
  smith: { name: 'Herrero de la Cueva', tex: 'npc_smith', menu: 'imbue', show: sc => sc.hammerState < 2, talk: (sc, n) => sc.smithTalk(n), lines: [['Aquí abajo el fuego no se apaga nunca. Dime qué poder quieres en tu arma.']] },
  smith2: { name: 'Herrero de la Cueva', tex: 'npc_smith', menu: 'all', show: sc => sc.hammerState >= 2, lines: [['Mi nuevo taller. Con el Martillo Latente puedo forjar cualquier poder: fuego, hielo, rayo, veneno... y las sombras.']] },
  monk: { name: 'Monje Trastornado', tex: 'npc_monk', lines: [
    ['¡Hermano, hermano! El Obispo reza al revés... ¡y su dios le responde con su propia voz!',
      'Arriba, en el Ábside, espera. La Nave Principal tiene un hueco enorme: el primer escalón está lejos. Necesitas el Impulso: {dash} en el aire.',
      'Cuando él caiga te dará un segundo salto. Con él cruzarás el Mirador.',
      '¿Oyes campanas? Yo también. No hay campanas.'],
    ['Mi hermana era la Gárgola... o la Gárgola era mi hermana. Piedra y carne se parecen tanto de noche.',
      'Esta hoguera te cura y te guarda. Úsalo, hijo mío, antes de que el cielo se caiga.'],
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
    this.element = ''; this.travel = false; this.travelOpen = false; this.imbueOpen = false; this.hammerState = 0; this.smithMet = false; // hammerState: 0 sin martillo, 1 lo llevas, 2 entregado
    this.buildAlbaDecor(); this.buildHelp();
    if (/[?&]dev=1/.test(location.search)) this.setupDev();
    const w = this.W;
    this.wpn = WEAPONS[this.color] || WEAPONS.red; this.pas = PASSIVES[this.color] || {}; this.wlv = 1;
    this.maxHp = 5 + (this.pas.hp || 0); this.hp = this.maxHp;
    this.gems = 0; this.perm = { dmg: 0, souls: 0 }; this.gemGot = new Set(); this.bossGemsPaid = new Set(this.progress ? this.progress.bosses : []);
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
    this.gemObjs = (w.gems || []).map(gm => { // gemas: la segunda moneda
      const spr = this.add.image(gm.x, gm.y, 'gem').setScale(3).setDepth(2);
      const glow = this.add.image(gm.x, gm.y, 'glow').setScale(0.7).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.5).setTint(0x7ae8ff).setDepth(1).setVisible(!LITE);
      this.tweens.add({ targets: [spr, glow], y: gm.y - 4, yoyo: true, repeat: -1, duration: 950 + (gm.x % 300), ease: 'Sine.inOut' });
      return { ...gm, spr, glow };
    });
    this.timed = (w.timed || []).map(t => ({ ...t, shown: true })); this.timedG = this.add.graphics().setDepth(5); // plataformas que aparecen y desaparecen
    this.sforgeObjs = (w.sforges || []).map(f => { // forja especial: poder elemental para el arma
      const sh = f.kind === 'shrine';
      const spr = this.add.image(f.x, f.y, sh ? 'altar' : 'forge').setScale(sh ? 3 : 3.6).setDepth(2).setTint(sh ? 0xb06aff : 0xff9a3b);
      const glow = this.add.image(f.x, f.y, 'glow').setScale(2.2).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.65).setDepth(1).setVisible(!LITE).setTint(sh ? 0xb06aff : 0xffffff);
      this.tweens.add({ targets: [spr, glow], y: f.y - 6, yoyo: true, repeat: -1, duration: 1100, ease: 'Sine.inOut' });
      return { ...f, spr, glow };
    });
    const nameStyle = { fontSize: '11px', fontFamily: 'Courier New', color: '#ffe9a0', stroke: '#000', strokeThickness: 3 };
    this.npcObjs = w.npcs.map(n => {
      const def = NPC_DEFS[n.type];
      const spr = this.add.image(n.x, n.y - 21, def.tex).setScale(3).setDepth(4);
      const name = this.add.text(n.x, n.y - 56, def.name, nameStyle).setOrigin(0.5).setDepth(27);
      return { ...n, def, spr, name, visits: 0 };
    });
    this.buildExtraHud(); this.buildShopUi(); this.buildDialogueUi(); this.buildBookUi(); this.buildTravelUi(); this.buildImbueUi(); this.buildCaveDecor(); this.buildMossDecor();
    this.npcObjs.filter(n => n.type === 'smith' || n.type === 'smith2').forEach(n => this.smithWorks(n)); this.syncNpcs();
    [this.promptTxt, this.dlgText, this.toastTxt].forEach(o => { if (o && !o._hint) { const st = o.setText.bind(o); o.setText = t => st(hintText(t)); o._hint = true; } });
    this.lastBonfire = this.altars.find(a => a.area === 'vest') || this.altars[0];
    this.canAuto = !!saveMe || !saves[this.color]; // evita pisar una partida guardada de este vampiro en una partida nueva
    if (saveMe) this.loadPersonal(saveMe);
    saveMe = null;
    this.snap = this.captureState(); // punto de control inicial: al empezar o al cargar la partida
    const onRest = () => { if (this.isHost) this.restReset(); };
    socket.on('rest', onRest); { const off = () => socket.off('rest', onRest); this.events.once('shutdown', off); this.events.once('destroy', off); }
    const onLoot = ({ amt, item, eid, bonus, kt }) => { if (amt) this.addSouls(amt, true); if (kt) this.registerKill(kt); if (eid) this.eliteReward(eid, { item, souls: bonus }); };
    socket.on('loot', onLoot); { const off = () => socket.off('loot', onLoot); this.events.once('shutdown', off); this.events.once('destroy', off); }
    this.input.addPointer(2);
    this.time.delayedCall(14000, () => this.toast('Hogueras: pulsa E junto a una para descansar, guardar la partida y hacer reaparecer a los monstruos.', 7000));
  },
  // Recupera los datos personales de la partida guardada
  loadPersonal(m) {
    this.travel = !!m.travel; this.element = ELEMENTS[m.el] ? m.el : '';
    this.gems = m.gems | 0; this.perm = { dmg: (m.perm && m.perm.dmg) | 0, souls: (m.perm && m.perm.souls) | 0 };
    (m.gemGot || []).forEach(id => { const o = this.gemObjs.find(x => x.id === id); if (o) { this.gemGot.add(id); o.spr.destroy(); o.glow.destroy(); } });
    this.bossGemsPaid = new Set(m.bg || this.progress.bosses || []);
    this.hammerState = m.hammer | 0; this.smithMet = !!m.met; if (this.progress.bosses.includes('reina') && this.hammerState === 0) this.hammerState = 1; this.syncNpcs();
    if (m.abil) { ['dash', 'dj', 'wj', 'wings', 'eye', 'pound'].forEach(k => { this.abil[k] = !!m.abil[k]; }); this.syncRelics(); this.applyProgress(this.progress, true); }
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
  auraMul() { return (this.pas.aura || 1) * (this.buffs.lamp > 0 ? 1.7 : 1) * (this.abil.eye ? 1.4 : 1); },
  wstats() { return this.wpn.lv[Math.min(this.wlv, 5) - 1]; },
  dmgBonus() { return (this.buffs.str > 0 ? 1 : 0) + this.perm.dmg; },
  addGems(n, x, y) { this.gems += n; SFX.pick(); this.floatText(x !== undefined ? x : this.player.x, (y !== undefined ? y : this.player.y) - 24, '+' + n + ' ✦', '#7ae8ff'); },
  payBossGems(silent) { // cada jefe suelta gemas la primera vez que cae
    if (!this.bossGemsPaid) return; let got = 0;
    (this.progress.bosses || []).forEach(id => { if (this.bossGemsPaid.has(id)) return; this.bossGemsPaid.add(id); if (!silent && GEMS_BOSS[id]) got += GEMS_BOSS[id];
      if (id === 'reina' && this.hammerState === 0) { this.hammerState = 1; if (!silent) this.time.delayedCall(2500, () => this.toast('La Reina de Huesos guardaba el Martillo Latente. Llévaselo al Herrero de la Cueva, en la Cueva del Abismo.', 8000)); }
    });
    if (got) { this.addGems(got); this.toast('Recompensa del jefe: ' + got + ' gemas ✦', 5000); this.autoSave(); }
  },
  itemCost(it) { return it.perm ? it.gems + 2 * this.perm[it.perm === 'dmg' ? 'dmg' : 'souls'] : (it.gems || 0); },

  // ---- HUD
  buildExtraHud() {
    const f = (s, c = '#fff') => ({ fontSize: fsz(s), fontFamily: 'Courier New', color: c, stroke: '#000', strokeThickness: 4 });
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
    this.ents.forEach(e => { if (e.type === 'clock' && e.aggro && !this.clockHint) { this.clockHint = true; this.toast('El Guardián es inmune a la luz: apaga las antorchas de la sala con {act}. ¡Él irá a encenderlas!', 8000); } });
    const it = ITEMS[this.selItem], n = this.inv[it.id];
    this.itemIcon.setTexture('it_' + it.id).setAlpha(n > 0 ? 1 : 0.3);
    this.itemTxt.setText(`${it.name} x${n}` + (IS_TOUCH ? '' : '   [Q usar · R cambiar]'));
    const b = this.buffs, parts = [];
    if (b.spd > 0) parts.push('VEL ' + Math.ceil(b.spd) + 's'); if (b.str > 0) parts.push('FUE ' + Math.ceil(b.str) + 's'); if (b.lamp > 0) parts.push('LUZ ' + Math.ceil(b.lamp) + 's'); if (b.rage > 0) parts.push('FUR ' + Math.ceil(b.rage) + 's'); if (b.tonic > 0) parts.push('ALM ' + Math.ceil(b.tonic) + 's'); if (this.ward > 0) parts.push('PIEL x' + this.ward);
    this.buffTxt.setText(parts.join('  '));
    this.hudSouls.setText(`◆ ${this.souls}  ✦ ${this.gems}${this.hammerState === 1 ? '  [Martillo Latente]' : ''}    ${this.wpn.name} Nv.${this.wlv}${this.element ? ' [' + ELEMENTS[this.element].name + ']' : ''}    ${this.pas.name || ''}`);
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
    const ui = this.shopOpen || !!this.dlg || this.bookOpen || this.travelOpen || this.imbueOpen;
    if (this.bookOpen) this.bookKeys(inp.J);
    if (this.imbueOpen) this.imbueKeys(inp.J);
    if (this.travelOpen) this.travelKeys(inp.J);
    for (const k in this.buffs) this.buffs[k] = Math.max(0, this.buffs[k] - dt);
    if (this.slowT > 0) this.slowT -= dt;
    if (inp.J.N) this.muteTxt.setAlpha(Music.toggleMute() ? 0.3 : 1);
    if (this.shopOpen) this.shopKeys(inp.J);
    else if (this.dlg && (inp.ePress || inp.J.ENTER || inp.J.SPACE || inp.attackPress)) this.dlgAdvance();
    if (this.dead) { this.deadT -= dt; if (this.deadT <= 0) this.respawn(); return; }
    this.invuln = Math.max(0, this.invuln - dt); this.atkCd -= dt; this.dashCd -= dt; this.stun -= dt;
    p.setAlpha(this.invuln > 0 && ((time >> 6) & 1) && this.dashT <= 0 ? 0.35 : (this.dashT > 0 ? 0.5 : 1));
    const onFloor = b.blocked.down || b.touching.down;
    if (onFloor && !this.wasFloor && (this.lastVy || 0) > 260) SFX.land();
    if (onFloor && !ui && Math.abs(b.velocity.x) > 40 && (this.stepT = (this.stepT || 0) - dt) <= 0) { this.stepT = 0.3; SFX.step(); }
    this.wasFloor = onFloor; this.lastVy = b.velocity.y;
    if (onFloor) { this.coyote = 0.1; this.jumpsUsed = 0; this.dashAvail = true; if (!this.nearSpikes()) { this.lastGround.x = p.x; this.lastGround.y = p.y; } } else this.coyote -= dt;
    const left = !ui && (held(K_.LEFT, K_.A) || touch.left || pad.left), right = !ui && (held(K_.RIGHT, K_.D) || touch.right || pad.right);
    const crouchHeld = !ui && (held(K_.DOWN, K_.S) || touch.down || pad.down);
    const dir = (right ? 1 : 0) - (left ? 1 : 0);
    if (dir) this.facing = dir;
    p.setFlipX(this.facing < 0);
    const wantCrouch = crouchHeld && onFloor && this.dashT <= 0 && this.stun <= 0;
    if (wantCrouch && !this.crouching) this.setCrouch(true); else if (!wantCrouch && this.crouching && this.canStand()) this.setCrouch(false);
    const wall = b.blocked.left ? -1 : b.blocked.right ? 1 : 0;
    const speed = P.speed * (this.slowT > 0 ? 0.5 : 1) * (this.pas.speed || 1) * (this.buffs.spd > 0 ? 1.35 : 1) * (this.crouching ? 0.5 : 1);
    if (!this.crouching) { // caminar / saltar: fotogramas de piernas
      const moving = onFloor && dir !== 0 && this.dashT <= 0 && this.stun <= 0;
      const key = 'hero_' + this.color + (moving ? (((time / 120) | 0) % 2 ? '_w1' : '_w2') : (!onFloor ? '_w2' : (((time / 550) | 0) % 2 ? '_i' : '')));
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
    // Pisotón de Raíces: en el aire, manteniendo abajo se cae en picado; al aterrizar una onda daña y rompe los suelos de raíces
    this.poundCd = (this.poundCd || 0) - dt; this.airT = onFloor ? 0 : (this.airT || 0) + dt;
    if (this.abil.pound && !ui && !onFloor && !this.pounding && this.poundCd <= 0 && this.airT > 0.15 && this.stun <= 0 && this.dashT <= 0 && !this.hook && crouchHeld) { this.pounding = true; b.setMaxVelocityY(800); b.setVelocity(b.velocity.x * 0.3, 780); SFX.dash(); }
    if (this.pounding) {
      if (onFloor || this.dead) this.poundLand();
      else { b.setVelocityY(780); if (Math.random() < 0.5) this.poof(p.x, p.y - 12, 1, 0x8fd35a); }
    }
    // Alas del Alba: manteniendo saltar en el aire se planea
    if (this.abil.wings && !ui && !onFloor && b.velocity.y > 60 && this.dashT <= 0 && !this.hook && this.stun <= 0 && (held(K_.UP, K_.W, K_.SPACE, K_.Z) || touch.jump || pad.jump)) {
      b.setVelocityY(60); if (this.wjLock <= 0) b.setVelocityX(dir * speed * 1.25);
      if (Math.random() < 0.15) this.poof(p.x - this.facing * 10, p.y - 4, 1, 0xffd6a0);
    }

    this.hookStep(dt, onFloor, dir, ui);

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
    if ((this.shopOpen || this.dlg || this.imbueOpen) && cn && (Math.abs(cn.x - p.x) > 150 || Math.abs(cn.y - p.y) > 150)) this.closeUi();
  },

  // ---- salas secretas: lo que hay tras un muro agrietado no se ve (ni se dibuja ni brilla) hasta romperlo
  recalcHidden() {
    const W_ = this.W.Wt, H_ = this.W.Ht, D = this.fg.layer.data, hid = new Uint8Array(W_ * H_), reach = new Uint8Array(W_ * H_);
    const ix = t => (t ? t.index : -1), isWall = (x, y) => { const i = ix(D[y][x]); return i >= 0 && [K.SOLID, K.FLOOR, K.CRACK].includes(i % 8); };
    const isCrack = (x, y) => { const i = ix(D[y][x]); return i >= 0 && i % 8 === K.CRACK; };
    const fill = (sx, sy, mark, cap, list = []) => { // inundación por casillas libres; devuelve la lista o null si pasa del tope
      const st = [[sx, sy]]; mark[sy * W_ + sx] = 1;
      while (st.length) {
        const [x, y] = st.pop(); list.push(y * W_ + x); if (cap && list.length > cap) return null;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W_ || ny >= H_ || mark[ny * W_ + nx] || isWall(nx, ny)) continue;
          mark[ny * W_ + nx] = 1; st.push([nx, ny]);
        }
      }
      return list;
    };
    const tmp = this._hidTmp || (this._hidTmp = new Uint8Array(W_ * H_));
    const seeds = [...this.W.altars, ...this.W.bosses, ...this.W.npcs.filter(n => n.type !== 'smith2'), { x: this.player.x, y: this.player.y }];
    seeds.forEach(s => { const x = Math.floor(s.x / T), y = Math.floor(s.y / T); if (x >= 0 && y >= 0 && x < W_ && y < H_ && !reach[y * W_ + x] && !isWall(x, y)) fill(x, y, reach, 0); });
    for (let y = 0; y < H_; y++) for (let x = 0; x < W_; x++) {
      if (!isCrack(x, y)) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W_ || ny >= H_ || reach[ny * W_ + nx] || hid[ny * W_ + nx] || isWall(nx, ny)) continue;
        const touched = [], list = fill(nx, ny, tmp, 1500, touched);
        if (list) list.forEach(i => { hid[i] = 1; });
        touched.forEach(i => { tmp[i] = 0; }); // se limpia solo lo tocado: el búfer se reutiliza
      }
    }
    this.hid = hid; this.coverDirty = true; return hid;
  },
  hiddenAt(wx, wy) {
    if (this.abil && this.abil.eye) return false; // el Ojo de la Noche ve tras los muros agrietados
    if (!this.hid) this.recalcHidden();
    const x = Math.floor(wx / T), y = Math.floor(wy / T);
    return x >= 0 && y >= 0 && x < this.W.Wt && y < this.W.Ht && this.hid[y * this.W.Wt + x] === 1;
  },
  wallBroken(gx, gy) { // con coordenadas solo se repintan las salas junto al muro roto
    this.hid = null; const ids = new Set();
    if (gx !== undefined) { for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]) { const a = this.W.areaOf(gx + dx, gy + dy); if (a) ids.add(a.id); } }
    else if (this.visited) this.visited.forEach(id => ids.add(id));
    ids.forEach(id => { if (this.visited && this.visited.has(id)) { const a = this.W.areas[id]; if (a) this.paintMapArea(a); } });
    if (this.mapCanvas) this.mapCanvas.refresh();
  },
  // ---- atajo de desarrollador (solo con ?dev=1 en la dirección): F2 abre el mapa de teletransporte
  setupDev() {
    const W = this.W, box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:0;z-index:99;background:#0a0612ee;color:#fff;font:13px Courier New,monospace;padding:10px;display:none;overflow:auto';
    box.innerHTML = '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px"><b>MODO DESARROLLO</b>' +
      '<button id="devGod">Invulnerable: NO</button><button id="devAbil">Dar todas las habilidades</button><button id="devGems">+20 gemas</button><button id="devHp">Curar</button><button id="devBoss">Matar jefes (hasta el Conde)</button><button id="devClose">Cerrar (F2)</button>' +
      '<span id="devInfo" style="color:#ffd98a">Haz clic en el mapa para teletransportarte</span></div><canvas id="devMap" style="image-rendering:pixelated;cursor:crosshair;border:2px solid #ffb347"></canvas>';
    document.body.appendChild(box);
    box.querySelectorAll('button').forEach(b => { b.style.cssText = 'width:auto;margin:0;padding:4px 10px;font:12px Courier New,monospace;cursor:pointer'; });
    box.addEventListener('keydown', ev => ev.stopPropagation()); box.addEventListener('keyup', ev => ev.stopPropagation());
    const cv = box.querySelector('#devMap'), info = box.querySelector('#devInfo'), scale = () => Math.max(1, Math.min(4, (window.innerWidth - 40) / W.Wt));
    const draw = () => { // mapa completo con el estado actual de los muros
      const D = this.fg.layer.data; cv.width = W.Wt; cv.height = W.Ht; const g = cv.getContext('2d');
      for (let y = 0; y < W.Ht; y++) for (let x = 0; x < W.Wt; x++) {
        const t = D[y][x], k = t && t.index >= 0 ? t.index % 8 : -1, a = W.areaOf(x, y), pal = a ? ZONE_PAL[a.z] : null;
        g.fillStyle = k === -1 ? (a ? '#241a3a' : '#0a0612') : k === K.ONEWAY ? '#ffffff' : k === K.SPIKES ? '#ff4a4a' : k === K.CRACK ? '#ffcf6a' : (pal ? pal.light : '#444');
        g.fillRect(x, y, 1, 1);
      }
      const s = scale(); cv.style.width = (W.Wt * s) + 'px'; cv.style.height = (W.Ht * s) + 'px';
    };
    const at = ev => { const r = cv.getBoundingClientRect(), s = r.width / W.Wt; return [Math.floor((ev.clientX - r.left) / s), Math.floor((ev.clientY - r.top) / s)]; };
    cv.onmousemove = ev => { const [x, y] = at(ev), a = W.areaOf(x, y); info.textContent = a ? a.name + ' (' + a.id + ')' : 'roca'; };
    cv.onclick = ev => { const [x, y] = at(ev); this.devTeleportTo(x, y); toggle(); };
    box.querySelector('#devGod').onclick = ev => { this.devGod = !this.devGod; ev.target.textContent = 'Invulnerable: ' + (this.devGod ? 'SÍ' : 'NO'); ev.target.style.background = this.devGod ? '#7aff9a' : ''; this.toast(this.devGod ? 'Invulnerable activado' : 'Invulnerable desactivado'); };
    box.querySelector('#devAbil').onclick = () => { ['dash', 'dj', 'wj', 'wings', 'eye', 'pound'].forEach(a => { this.abil[a] = true; }); this.syncRelics(); this.applyProgress(this.progress, true); this.wallBroken(); this.toast('Todas las habilidades concedidas, también Alas del Alba y Ojo de la Noche (modo desarrollo)', 4500); };
    box.querySelector('#devGems').onclick = () => { this.gems += 20; this.toast('+20 gemas (modo desarrollo)'); };
    box.querySelector('#devHp').onclick = () => { this.hp = this.maxHp; this.invuln = 2; };
    box.querySelector('#devBoss').onclick = () => { ['garg', 'bishop', 'clock', 'archon', 'reina', 'conde'].forEach(b => { if (!this.progress.bosses.includes(b)) { this.progress.bosses.push(b); socket.emit('bossDead', b); } }); this.applyProgress(this.progress, true); draw(); };
    const orig = this.hurt; this.hurt = (d, x) => { if (this.devGod) return; return orig.call(this, d, x); };
    const toggle = () => { const open = box.style.display === 'none'; box.style.display = open ? 'block' : 'none'; if (open) draw(); else if (document.activeElement) document.activeElement.blur(); };
    box.querySelector('#devClose').onclick = toggle;
    const onKey = ev => { if (ev.key === 'F2') { ev.preventDefault(); toggle(); } };
    window.addEventListener('keydown', onKey);
    const bye = () => { window.removeEventListener('keydown', onKey); box.remove(); };
    this.events.once('shutdown', bye); this.events.once('destroy', bye);
    this.toast('Modo desarrollo: F2 abre el mapa de teletransporte', 5000);
  },
  devSpot(a, gx, gy) { // casilla donde se puede estar de pie en el área, la más cercana al punto pedido
    const D = this.fg.layer.data, solid = (x, y) => { const t = D[y] && D[y][x]; return !!t && t.index >= 0 && [K.SOLID, K.FLOOR, K.CRACK].includes(t.index % 8); };
    let best = null, bd = 1e9;
    for (let y = a.y0 + 2; y < a.y0 + a.rh - 1; y++) for (let x = a.x0 + 1; x < a.x0 + a.rw - 1; x++) {
      if (solid(x, y) || solid(x, y - 1) || !(solid(x, y + 1) || (D[y + 1] && D[y + 1][x] && D[y + 1][x].index >= 0 && D[y + 1][x].index % 8 === K.ONEWAY))) continue;
      const d = Math.hypot(x - gx, (y - gy) * 1.2); if (d < bd) { bd = d; best = [x, y]; }
    }
    return best;
  },
  devTeleportTo(gx, gy) {
    const a = this.W.areaOf(gx, gy); if (!a) { this.toast('Eso es roca: elige una sala'); return; }
    const spot = this.devSpot(a, gx, gy) || [a.x0 + Math.floor(a.rw / 2), a.y0 + a.rh - 2];
    const p = this.player; p.setPosition((spot[0] + 0.5) * T, (spot[1] + 1) * T - 24); p.body.setVelocity(0, 0); this.lastGround = { x: p.x, y: p.y }; this.invuln = 2;
    this.toast('Teletransportado a ' + a.name);
  },
  devTeleport(id) { const a = this.W.areas[id]; if (a) this.devTeleportTo(a.x0 + Math.floor(a.rw / 2), a.y0 + a.rh - 2); },

  // ---- ayuda: controles según el dispositivo (tecla H)
  buildHelp() {
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:0;z-index:98;background:#0a0612f2;color:#fff;font:15px Courier New,monospace;padding:20px;display:none;overflow:auto;white-space:pre-wrap;line-height:1.5';
    document.body.appendChild(box);
    const text = () => { const m = inputMode(); return m === 'touch' ? 'CONTROLES (táctil)\n\n· Cruceta (izquierda): arrastra para moverte; ▲ salta (mantén en el aire para planear) y ▼ te agacha.\n· » Impulso · ⚔ Atacar · E Interactuar · 🧪 Usar objeto · ⟳ Cambiar objeto\n· 🗺 Mapa · 📖 Bestiario y diarios · ♪ Silenciar\n\nToca esta pantalla para cerrar.' : m === 'pad' ? 'CONTROLES (mando)\n\n· Mover: cruceta o stick · Saltar: ✕ (mantén en el aire para planear) · Agacharse: cruceta ↓\n· Atacar: ◻ · Impulso: ○ · Interactuar: △ · Usar objeto: R1 · Cambiar objeto: L1\n· Mapa: Options · Bestiario: R3\n\nPulsa H o toca la pantalla para cerrar.' : 'CONTROLES (teclado)\n\n· Mover: flechas o A/D · Saltar: ↑/W/Espacio (mantén en el aire para planear con las Alas del Alba)\n· Agacharse: ↓ (con saltar, bajas de una plataforma) · Atacar: X/J · Impulso: C/K/Shift\n· Interactuar (hogueras, antorchas, personajes, forjas): E · Usar objeto: Q · Cambiar objeto: R\n· Mapa: M · Bestiario y diarios: B · Silenciar: N · Ayuda: H\n\nPulsa H o Esc para cerrar.'; };
    const toggle = () => { const open = box.style.display === 'none'; if (open) box.textContent = text(); box.style.display = open ? 'block' : 'none'; };
    box.onclick = () => { box.style.display = 'none'; };
    const onKey = ev => { if (ev.target && /input|textarea/i.test(ev.target.tagName)) return; if (ev.key === 'h' || ev.key === 'H' || (ev.key === 'Escape' && box.style.display !== 'none')) toggle(); };
    window.addEventListener('keydown', onKey);
    const bye = () => { window.removeEventListener('keydown', onKey); box.remove(); };
    this.events.once('shutdown', bye); this.events.once('destroy', bye);
  },
  // ---- los rivales del Alba: emblema compartido (luna y sol), carteles y chispas que los unen
  buildAlbaDecor() {
    const W = this.W, h = W.areas.albaH, A = W.areas.albaA, B = W.areas.albaB; if (!h || !A || !B) return;
    const g = this.add.graphics().setDepth(-6);
    const emblem = (x, y, r) => { // mitad luna azul, mitad sol dorado
      g.fillStyle(0x8aa8ff, 0.55).beginPath().arc(x, y, r, Math.PI / 2, Math.PI * 1.5).closePath().fillPath();
      g.fillStyle(0xffd27a, 0.55).beginPath().arc(x, y, r, -Math.PI / 2, Math.PI / 2).closePath().fillPath();
      g.fillStyle(0x140c22, 1).fillCircle(x - r * 0.28, y - r * 0.1, r * 0.62); // la luna es creciente
      g.fillStyle(0x8aa8ff, 0.55).beginPath().arc(x, y, r, Math.PI / 2, Math.PI * 1.5).closePath().fillPath();
      g.fillStyle(0x140c22, 1).fillCircle(x - r * 0.62, y - r * 0.12, r * 0.74);
      g.lineStyle(3, 0xffe9b0, 0.8).strokeCircle(x, y, r);
      for (let i = -3; i <= 3; i++) { const an = i * 0.38; g.lineStyle(3, 0xffd27a, 0.7).lineBetween(x + Math.cos(an) * (r + 6), y + Math.sin(an) * (r + 6), x + Math.cos(an) * (r + 20), y + Math.sin(an) * (r + 20)); }
    };
    emblem((h.x0 + 26) * T, (h.y0 + 5) * T, 46); emblem((A.x0 + 26) * T, (A.y0 + 6) * T, 64); emblem((B.x0 + 26) * T, (B.y0 + 6) * T, 64);
    const pr = W.areas.pasR; // contador de sellos junto a la puerta del trono
    this.sealLabel = this.add.text((pr.x0 + 22.5) * T, (pr.y0 + 12) * T, '', { fontSize: '14px', fontFamily: 'Courier New', color: '#ffd27a', stroke: '#000', strokeThickness: 4, align: 'center' }).setOrigin(0.5).setDepth(-3);
    const lab = (x, y, txt, col) => this.add.text(x, y, txt, { fontSize: '15px', fontFamily: 'Courier New', color: col, stroke: '#000', strokeThickness: 4, align: 'center' }).setOrigin(0.5).setDepth(-3);
    lab((h.x0 + 46) * T, (h.y0 + 11) * T, 'AURORA  ►\nsiguiendo recto\nAlas del Alba', '#ffd27a');
    lab((h.x0 + 26) * T, (h.y0 + 12.4) * T, 'VESPER\n▼ bajando por aquí ▼\nOjo de la Noche', '#9fb8ff');
  },
  drawBond(time) { // cada rival lleva chispas del color de su hermano
    const g = this.bondG || (this.bondG = this.add.graphics().setDepth(12)); g.clear();
    [['aurora', 0x8aa8ff], ['vesper', 0xffd27a]].forEach(([t, col]) => {
      const en = this.ents.get(t); if (!en || en.dead) return;
      for (let i = 0; i < 4; i++) { const an = time * 0.004 + i * Math.PI / 2, r = 46 + Math.sin(time * 0.006 + i) * 6; g.fillStyle(col, 0.95).fillRect(en.spr.x + Math.cos(an) * r - 3, en.spr.y + Math.sin(an) * r * 0.8 - 3, 6, 6); }
    });
  },
  crackGlow() { // con el Ojo de la Noche los muros agrietados cercanos brillan
    if (!this.abil.eye) { if (this.eyeCr) this.eyeCr.clear(); return; }
    const g = this.eyeCr || (this.eyeCr = this.add.graphics().setDepth(4)), D = this.fg.layer.data, p = this.player;
    g.clear().lineStyle(2, 0xffd27a, 0.9);
    const x0 = Math.floor(p.x / T) - 24, y0 = Math.floor(p.y / T) - 15;
    for (let gy = Math.max(0, y0); gy < y0 + 30 && gy < this.W.Ht; gy++) for (let gx = Math.max(0, x0); gx < x0 + 48 && gx < this.W.Wt; gx++) { const t = D[gy][gx]; if (t && t.index >= 0 && t.index % 8 === K.CRACK) g.strokeRect(gx * T + 2, gy * T + 2, T - 4, T - 4); }
  },
  redrawHidCover() { // roca opaca sobre las salas secretas cerradas (sin Ojo de la Noche)
    const g = this.hidCover || (this.hidCover = this.add.graphics().setDepth(24));
    this.coverEye = !!this.abil.eye; this.coverDirty = false; g.clear();
    if (this.abil.eye) return;
    if (!this.hid) this.recalcHidden();
    const Wt = this.W.Wt, Ht = this.W.Ht, hid = this.hid; g.fillStyle(0x2f2b3a, 1);
    for (let y = 0; y < Ht; y++) { let x = 0; while (x < Wt) { if (hid[y * Wt + x] !== 1) { x++; continue; } let x2 = x; while (x2 < Wt && hid[y * Wt + x2] === 1) x2++; g.fillRect(x * T, y * T, (x2 - x) * T, T); x = x2; } }
    this.coverDirty = false;
  },
  hiddenSweep() {
    this.syncNpcs();
    if (this.coverDirty || this.coverEye !== !!this.abil.eye || !this.hidCover) this.redrawHidCover();
    if (this.sealLabel) { const pb = this.progress.bosses, n = (pb.includes('archon') ? 1 : 0) + (pb.includes('reina') ? 1 : 0), open = pb.includes('conde') || n === 2; this.sealLabel.setText(open ? 'La puerta del trono\nestá abierta' : 'Sellos del trono: ' + n + '/2\n(Archimago y Reina de Huesos)'); }
    this.crackGlow(); // oculta lo que está dentro de una sala secreta aún cerrada
    this.crystals.forEach(c => { if (!this.cryGot.has(c.id)) c.spr.setVisible(!this.hiddenAt(c.x, c.y)); });
    this.pageObjs.forEach(pg => { if (!this.pagesGot.has(pg.id)) { const h = this.hiddenAt(pg.x, pg.y); pg.spr.setVisible(!h); pg.glow.setVisible(!h && !LITE); } });
    this.gemObjs.forEach(gm => { if (!this.gemGot.has(gm.id)) { const h = this.hiddenAt(gm.x, gm.y); gm.spr.setVisible(!h); gm.glow.setVisible(!h && !LITE); } });
    this.forgeObjs.forEach(f => { if (!this.forgeGot.has(f.id)) { const h = this.hiddenAt(f.x, f.y); f.spr.setVisible(!h); f.glow.setVisible(!h && !LITE); } });
    this.torchObjs.forEach(o => { const h = this.hiddenAt(o.x, o.y); o.flame.setVisible(o.lit && !h); o.glow.setVisible(o.lit && !h && !LITE); });
  },

  // ---- gancho (vampiro morado): si el salto se queda corto, se engancha al borde y le arrastra
  hookSolid(wx, wy) { const t = this.fg.getTileAtWorldXY(wx, wy); return !!t && t.index >= 0 && [K.SOLID, K.FLOOR, K.CRACK].includes(t.index % 8); },
  hookFind(dir) {
    const b = this.player.body, cx = b.center.x, feet = b.bottom, gx0 = Math.floor(cx / T);
    for (let i = 1; i <= 2; i++) {
      const gx = gx0 + dir * i;
      for (let gy = Math.floor((feet - 1.25 * T) / T); gy <= Math.floor((feet - 4) / T); gy++) {
        const t = this.fg.getTileAt(gx, gy), tu = this.fg.getTileAt(gx, gy - 1), tu2 = this.fg.getTileAt(gx, gy - 2);
        const st = !!t && t.index >= 0 && [K.SOLID, K.FLOOR, K.CRACK, K.ONEWAY].includes(t.index % 8);
        const free = q => !q || q.index < 0 || ![K.SOLID, K.FLOOR, K.CRACK].includes(q.index % 8);
        if (!st || !free(tu) || !free(tu2)) continue;
        const gap = dir > 0 ? gx * T - b.right : b.left - (gx + 1) * T; if (gap > T || gap < -12) continue; // alcance: 1 casilla
        const tx = (gx + 0.5) * T, ty = gy * T - (b.height / 2) - 1;
        let clear = true; // camino libre: primero hacia arriba y luego hacia el borde
        const py = b.center.y;
        for (let s = 0; s <= 1 && clear; s += 0.125) if (this.hookSolid(cx, py + (ty - py) * s) || this.hookSolid(cx + (tx - cx) * s, ty)) clear = false;
        if (clear) return { tx, ty: ty + (this.player.y - py) };
      }
    }
    return null;
  },
  hookStep(dt, onFloor, dir, ui) {
    if (this.color !== 'purple') return;
    const p = this.player, b = p.body;
    this.hookCd = (this.hookCd || 0) - dt;
    if (onFloor) this.hookUsed = false;
    const h = this.hook;
    if (h) { // arrastre hacia el borde
      h.t += dt;
      const up = p.y > h.ty + 6; // fase 1: subir al nivel del borde; fase 2: avanzar sobre él
      const dx = up ? 0 : h.tx - p.x, dy = up ? h.ty - p.y : 0, d = Math.hypot(dx, dy);
      if ((!up && Math.abs(h.tx - p.x) < 10) || h.t > 0.7 || this.stun > 0 || this.dead) {
        this.hook = null; b.setAllowGravity(true); b.setVelocity(Math.sign(h.tx - p.x) * 60, 0); this.hookCd = 0.5; h.g.destroy(); return;
      }
      b.setAllowGravity(false); b.setVelocity(d ? dx / d * 520 : 0, d ? dy / d * 520 : 0);
      h.g.clear().lineStyle(2, 0xd9b3ff, 1).lineBetween(p.x, p.y - 4, h.hx, h.hy);
      return;
    }
    if (onFloor || ui || this.hookUsed || this.hookCd > 0 || this.dashT > 0 || this.stun > 0 || this.wjLock > 0) return;
    if (this.jumpsUsed < 1 || !dir || dir !== this.facing || b.velocity.y < 30) return; // solo tras saltar (no al caerse de un borde)
    const tg = this.hookFind(dir);
    if (!tg) return;
    this.hook = { tx: tg.tx, ty: tg.ty, hx: tg.tx, hy: tg.ty + b.height / 2 + 1, t: 0, g: this.add.graphics().setDepth(9) };
    this.hookUsed = true; this.dashAvail = true; SFX.dash(); this.poof(tg.tx, tg.ty + 14, 3, 0xd9b3ff);
  },

  // ---- armas
  startAttack() {
    const w = this.wstats(), p = this.player;
    this.atkCd = w.cd * (this.buffs.rage > 0 ? 0.6 : 1); SFX.swing();
    if (this.wpn.kind === 'ranged') { this.atkT = 0.1; this.fireArrows(w); } else { this.atkT = this.wpn.act; this.swingHit.clear(); }
    this.slashFx(p.x, p.y + (this.crouching ? 7 : 0), this.facing, this.color);
  },
  slashFx(x, y, dir, color) {
    const W_ = WEAPONS[color] || WEAPONS.red, tint = (color === this.color && this.element) ? ELEMENTS[this.element].tint : W_.tint;
    if (W_.kind === 'ranged') {
      const s = this.add.image(x + dir * 22, y - 4, 'arrow').setScale(2).setFlipX(dir < 0).setDepth(9).setTint(tint);
      this.tweens.add({ targets: s, x: x + dir * 70, alpha: 0, duration: 220, onComplete: () => s.destroy() }); return;
    }
    const s = this.add.image(x + dir * W_.off, y - 2, W_.fx).setScale(W_.fxScale).setFlipX(dir < 0).setDepth(9).setAlpha(0.9).setTint(tint);
    this.tweens.add({ targets: s, alpha: 0, scaleX: W_.fxScale * 1.2, duration: 190, onComplete: () => s.destroy() });
  },
  fireArrows(w) {
    const p = this.player, f = this.facing, dmg = w.dmg + this.dmgBonus();
    for (let i = 0; i < w.n; i++) {
      const vy = (i - (w.n - 1) / 2) * 46, vx = f * 430;
      const spr = this.add.image(p.x + f * 22, p.y - 4 + (this.crouching ? 7 : 0), 'arrow').setScale(2).setDepth(9).setTint(this.element ? ELEMENTS[this.element].tint : 0xb8ff9a).setRotation(Math.atan2(vy, vx));
      this.arrows.push({ spr, vx, vy, life: w.range / 430, dmg, el: this.element });
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
        if (rectsOverlap(a.spr.x, a.spr.y, 16, 10, ex, ey, ew, eh)) { this.hitEnemy(e, Math.sign(a.vx) || 1, a.dmg, a.el); dead = true; break; }
      }
      if (dead) a.spr.destroy();
      return !dead;
    });
  },
  poundLand() { // onda del Pisotón: daño en 88 px, aturde a los que caminan y rompe el suelo de raíces bajo los pies
    this.pounding = false; this.poundCd = 0.5; const p = this.player, b = p.body; b.setMaxVelocityY(P.maxFall); this.invuln = Math.max(this.invuln, 0.2);
    this.cameras.main.shake(160, 0.008); SFX.boss(); this.poof(p.x, p.y + 20, 10, 0x8fd35a);
    const fy = b.bottom, dmg = 2 + this.dmgBonus();
    this.ents.forEach(en => {
      if (en.dead || (en.boss && !en.aggro) || en.cfg.inv) return;
      const [ex, ey, ew, eh] = this.entBox(en);
      if (Math.abs(ex - p.x) < 88 + ew / 2 && Math.abs((ey + eh / 2) - fy) < 48) { this.hitEnemy(en, Math.sign(ex - p.x) || 1, dmg, 'pound'); if (!en.boss && en.cfg.kind === 'walk') en.stun = 0.8; }
    });
    for (let dx = -T; dx <= T; dx += T) for (const oy of [6, 20, 34]) {
      const t = this.fg.getTileAtWorldXY(p.x + dx, fy + oy);
      if (t && t.index >= 0 && t.index % 8 === K.CRACK && this.W.roots.has(t.y * this.W.Wt + t.x)) { this.fg.removeTileAt(t.x, t.y); this.wallBroken(t.x, t.y); socket.emit('broke', { gx: t.x, gy: t.y }); this.poof((t.x + 0.5) * T, (t.y + 0.5) * T, 8, 0x8fd35a); }
    }
  },
  hitEnemy(e, f, dmg, el) {
    const p = this.player, [ex, ey] = this.entBox(e);
    if (e.cfg.inv) { if (!e.invMsg || Date.now() - e.invMsg > 900) { e.invMsg = Date.now(); this.floatText(ex, ey - 36, '¡Invulnerable!', '#9fd4ff'); } this.poof(ex, ey, 2, 0x9fd4ff); SFX.hurt(); return; }
    if (e.type === 'clock' && e.shield) { if (!e.shieldMsg || Date.now() - e.shieldMsg > 1200) { e.shieldMsg = Date.now(); this.floatText(ex, ey - 40, '¡La luz lo protege!', '#8fc8ff'); } SFX.hurt(); return; }
    if (el === 'eclipse' && Math.random() < 0.25) { dmg *= 2; this.floatText(ex, ey - 40, '¡Eclipse!', '#f4f0ff'); }
    if (el === 'shadow' && !this.dead && this.hp < this.maxHp && Math.random() < 0.5) { this.hp = Math.min(this.maxHp, this.hp + 0.5); this.poof(p.x, p.y - 10, 3, 0xb06aff); }
    SFX.hit();
    const chance = e.boss ? Math.min(this.pas.life || 0.25, 0.25) : (this.pas.life || 0.25);
    if (!this.dead && this.hp < this.maxHp && Math.random() < chance) { this.hp = Math.min(this.maxHp, this.hp + (e.boss ? 0.25 : 0.5)); this.poof(p.x, p.y - 10, 3, 0xff3b5c); }
    if (this.isHost) this.damageEnt(e, dmg, f, socket.id, el); else socket.emit('hit', { id: e.id, dmg, dir: f, el });
    e.flash = 0.1; e.spr.setTintFill(0xffffff); this.poof(ex, ey, 3, 0xffe9a0);
  },
  doAttack() {
    if (this.wpn.kind === 'ranged') return;
    const p = this.player, f = this.facing, w = this.wstats(), wp = this.wpn;
    const cy = p.y - 2 + (this.crouching ? 7 : 0), bx = p.x + f * wp.off, bw = w.w, bh = wp.h;
    this.ents.forEach(e => {
      if (e.dead || this.swingHit.has(e.id)) return;
      const [ex, ey, ew, eh] = this.entBox(e);
      if (rectsOverlap(bx, cy, bw, bh, ex, ey, ew, eh)) { this.swingHit.add(e.id); this.hitEnemy(e, f, w.dmg + this.dmgBonus(), this.element); }
    });
    for (let wy = cy - bh / 2; wy <= cy + bh / 2; wy += 16) for (let wx = bx - bw / 2; wx <= bx + bw / 2; wx += 16) {
      const t = this.fg.getTileAtWorldXY(wx, wy);
      if (t && t.index >= 0 && t.index % 8 === K.CRACK && !this.W.roots.has(t.y * this.W.Wt + t.x)) { this.fg.removeTileAt(t.x, t.y); this.wallBroken(t.x, t.y); socket.emit('broke', { gx: t.x, gy: t.y }); this.poof((t.x + 0.5) * T, (t.y + 0.5) * T, 6, 0xaaaaaa); SFX.hit(); }
    }
  },
  damageEnt(e, dmg, dir, by, el, quiet) {
    if (e.dead) return;
    if (e.boss && !e.aggro) return;
    if (e.phase === 'intro') return;
    if (e.cfg.inv) return; // invulnerables
    if (e.down > 0) { if (el === 'pound') { e.down = 0; e.rez = true; e.hp = 0; this.killEnt(e, by); } return; } // el prisionero caído solo muere aplastado
    if (e.type === 'alcaide' && e.shield) return; // hundido bajo el suelo
    if (e.type === 'madre' && e.armor > 0) { // armadura de raíces
      if (el === 'pound' || (e.hitsAcc = (e.hitsAcc || 0) + 1) >= 15) { e.hitsAcc = 0; e.armor--; e.flash = 0.2; this.poof(e.spr.x, e.spr.y - 20, 10, 0x8fd35a); this.cameras.main.shake(200, 0.008); this.floatText(e.spr.x, e.spr.y - 70, e.armor > 0 ? '¡Armadura dañada!' : '¡Armadura rota!', '#8fd35a'); if (e.armor <= 0) { e.windowT = e.hp < e.max * 0.25 ? 5 : (e.hp < e.max * 0.5 ? 6 : 7); e.stunT = 1; e.act = null; e.tele = false; } }
      return;
    }
    if (e.markT > 0) dmg = Math.ceil(dmg * 1.3); // marcado por Marchitar
    if (e.type === 'clock' && this.lightLevel(e.spr.x, e.spr.y) > 0.18) return; // la luz lo protege
    e.hp -= dmg; if (!quiet) { e.flash = 0.12; e.spr.setTintFill(0xffffff); }
    if (!quiet && !e.boss && !e.elite && e.cfg.kind === 'walk') { e.stun = 0.18; e.spr.body.setVelocityX(dir * 170); }
    if (e.hp <= 0 && e.cfg.rez && !e.rez && !(e.dotT > 0) && el !== 'pound') { e.rez = true; e.down = 2.5; e.hp = Math.ceil(e.max / 2); e.shield = true; e.spr.setAngle(90); e.spr.body.setVelocityX(0); this.poof(e.spr.x, e.spr.y, 8, 0x8fd35a); return; } // primera muerte: cae y se levanta
    if (e.hp > 0 && el && !quiet) this.applyElement(e, el, dmg, dir, by);
    if (e.hp <= 0) this.killEnt(e, by);
  },
  applyElement(e, el, dmg, dir, by) { // solo lo ejecuta el anfitrión
    if (el === 'fire') { e.dotT = 3; e.dotTick = 0.75; e.dotCol = 0xff7a2a; e.dotBy = by; }
    else if (el === 'poison') { e.dotT = 6; e.dotTick = 1; e.dotCol = 0x7aff6a; e.dotBy = by; }
    else if (el === 'wither') { e.markT = 4; if (!e.boss) e.spr.setTint(0x8a5a9a); }
    else if (el === 'ice') { if (!e.boss) { e.slowT = 3; e.spr.setTint(0x9ad0ff); } }
    else if (el === 'bolt') {
      let best = null, bd = 190; this.ents.forEach(o => { if (o === e || o.dead || o.cfg.inv || (o.boss && !o.aggro)) return; const d = Math.hypot(o.spr.x - e.spr.x, o.spr.y - e.spr.y); if (d < bd) { bd = d; best = o; } });
      if (best) { const g = this.add.graphics().setDepth(12); g.lineStyle(3, 0xfff06a, 1).lineBetween(e.spr.x, e.spr.y, best.spr.x, best.spr.y); this.time.delayedCall(140, () => g.destroy()); this.poof(best.spr.x, best.spr.y, 3, 0xfff06a); this.damageEnt(best, Math.max(1, Math.ceil(dmg * 0.6)), dir, by); }
    }
  },
  statusTick(e, dt) { // daño continuo y ralentización (lo ejecuta el anfitrión)
    if (e.markT > 0) { e.markT -= dt; if (e.markT <= 0 && !e.elite && !(e.slowT > 0)) e.spr.clearTint(); }
    if (e.slowT > 0) { e.slowT -= dt; if (e.slowT <= 0 && !e.elite) e.spr.clearTint(); }
    if (e.dotT > 0) { e.dotT -= dt; e.dotAcc = (e.dotAcc || 0) + dt; if (e.dotAcc >= e.dotTick) { e.dotAcc -= e.dotTick; this.poof(e.spr.x, e.spr.y - 10, 2, e.dotCol); this.damageEnt(e, 1, 0, e.dotBy, undefined, true); } }
  },
  killEnt(e, by) {
    if (!e.boss) SFX.die();
    let base = (SOULS[e.type] || 0) * (e.elite ? 5 : 1); base = Math.round(base * (1 + 0.2 * Math.min(7, e.zone !== undefined ? e.zone : 0)));
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
    this.addGems(1);
    const it = ITEMS.find(i => i.id === reward.item);
    this.toast('¡Has derrotado a ' + eid + '! Recompensa: ' + (it ? it.name + ' + ' : '') + (reward.souls || 0) + ' almas', 5500);
    SFX.pick(); this.autoSave();
  },
  addSouls(n, kill, x, y) {
    const amt = Math.round(n * (this.pas.souls || 1) * (this.buffs.tonic > 0 ? 2 : 1) * (1 + 0.2 * this.perm.souls)); this.souls += amt;
    this.floatText(x !== undefined ? x : this.player.x, (y !== undefined ? y : this.player.y) - 20, '+' + amt + ' ◆');
  },

  // ---- vida, muerte
  contact() {
    const p = this.player, pw = 26, ph = this.crouching ? 22 : 36, cy = p.y + (this.crouching ? 7 : 0);
    this.ents.forEach(e => {
      if (e.dead || (e.boss && !e.aggro) || (e.cfg.rez && e.shield)) return;
      const [ex, ey, ew, eh] = this.entBox(e);
      if (rectsOverlap(p.x, cy, pw, ph, ex, ey, ew, eh)) this.hurt(e.cfg.dmg + (e.dmgBonus || 0), ex);
    });
    this.projs.forEach((pr, id) => {
      if (this.hurtProjs.has(id)) return;
      const c = PR[pr.type]; if (c.slow) { if (rectsOverlap(p.x, cy, pw, ph, pr.spr.x, pr.spr.y, c.hb[0], c.hb[1])) this.slowT = 0.6; return; }
      if (!c.dmg) return;
      if (rectsOverlap(p.x, cy, pw, ph, pr.spr.x, pr.spr.y, c.hb[0], c.hb[1]) && this.invuln <= 0 && this.dashT <= 0) { if (!c.linger) this.hurtProjs.add(id); this.hurt(c.dmg + (this.pas.projPlus || 0), pr.spr.x); }
    });
    if (this.hurtProjs.size > 200) this.hurtProjs.clear();
  },
  hurt(dmg, fromX) {
    if (this.invuln > 0 || this.dead || this.dashT > 0) return;
    if (this.ward > 0) { this.ward--; this.invuln = 0.8; SFX.hit(); this.poof(this.player.x, this.player.y, 5, 0xc9ced8); this.floatText(this.player.x, this.player.y - 30, 'bloqueado', '#c9ced8'); return; }
    if (this.pas.dmgTaken) { this.dmgAcc = (this.dmgAcc || 0) + dmg * (this.pas.dmgTaken - 1); const extra = Math.floor(this.dmgAcc); this.dmgAcc -= extra; dmg += extra; } // +50% de media: el medio corazón se acumula, no se redondea hacia arriba en cada golpe
    _hurt.call(this, dmg, fromX);
  },
  die() {
    if (this.inv.amu > 0) {
      this.inv.amu--; this.hp = Math.max(2, Math.ceil(this.maxHp / 2)); this.invuln = 2.5; SFX.pick();
      this.toast('¡El Amuleto te devuelve a la vida!', 3500); this.poof(this.player.x, this.player.y, 14, 0xffd23b); return;
    }
    this.closeUi(); this.setCrouch(false); _die.call(this);
  },
  respawn() { this.revertToCheckpoint(); this.setCrouch(false); _respawn.call(this); },
  pickups() {
    _pick.call(this);
    const p = this.player;
    this.pageObjs.forEach(pg => {
      if (this.pagesGot.has(pg.id)) return;
      if (Math.abs(p.x - pg.x) < 30 && Math.abs(p.y - pg.y) < 40) {
        this.pagesGot.add(pg.id); pg.spr.setVisible(false); pg.glow.setVisible(false); SFX.pick();
        this.toast('Nuevo diario: ' + (PAGES[pg.area] ? PAGES[pg.area].title : 'página') + '  (B para leerlo)', 5000); this.autoSave();
      }
    });
    this.gemObjs.forEach(gm => {
      if (this.gemGot.has(gm.id) || this.hiddenAt(gm.x, gm.y)) return;
      if (Math.abs(p.x - gm.x) < 28 && Math.abs(p.y - gm.y) < 38) { this.gemGot.add(gm.id); gm.spr.setVisible(false); gm.glow.setVisible(false); this.addGems(1, gm.x, gm.y); this.autoSave(); }
    });
    this.forgeObjs.forEach(f => {
      if (this.forgeGot.has(f.id)) return;
      if (Math.abs(p.x - f.x) < 30 && Math.abs(p.y - f.y) < 40) {
        this.forgeGot.add(f.id); f.spr.setVisible(false); f.glow.setVisible(false); SFX.pick(); this.poof(f.x, f.y, 10, 0xffd98a);
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
      if (t && t.index >= 0 && t.index % 8 === K.CRACK && !this.W.roots.has(t.y * this.W.Wt + t.x)) { this.fg.removeTileAt(t.x, t.y); this.wallBroken(t.x, t.y); socket.emit('broke', { gx: t.x, gy: t.y }); this.poof((t.x + 0.5) * T, (t.y + 0.5) * T, 6, 0xaaaaaa); }
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
    for (const n of this.npcObjs) { if (n.off) continue; const dx = Math.abs(n.x - p.x), dy = Math.abs((n.y - 30) - p.y); if (dx < 70 && dy < 80 && dx < bd) { bd = dx; best = n; } }
    if (best) {
      this.promptTxt.setVisible(!(this.shopOpen || this.dlg || this.imbueOpen)).setPosition(best.x, best.y - 74).setText(best.def.shop ? '{act}: comerciar' : (best.def.menu ? '{act}: imbuir el arma' : '{act}: hablar'));
      if (ePress) { this.curNpc = best; if (best.def.talk && best.def.talk(this, best)) return; if (best.def.shop) this.openShop(best); else if (best.def.menu) this.openImbue(best.def.menu === 'all' ? 'all' : 'forge', best); else this.openDialogue(best); }
      return;
    }
    // forja de los elementos
    let sf = null, sfd = 1e9;
    for (const f of this.sforgeObjs || []) { const dx = Math.abs(f.x - p.x), dy = Math.abs(f.y - p.y); if (dx < 80 && dy < 90 && dx < sfd) { sfd = dx; sf = f; } }
    if (sf) {
      this.promptTxt.setVisible(!this.imbueOpen).setPosition(sf.x, sf.y - 70).setText('{act}: ' + (sf.kind === 'shrine' ? 'ofrenda a las sombras' : 'forja de los elementos'));
      if (ePress) { this.curNpc = sf; this.openImbue(sf.kind, sf); }
      return;
    }
    // hoguera (solo al interactuar: descansar, guardar y reaparecer monstruos)
    let bf = null, bfd = 1e9;
    for (const a of this.altars) { const dx = Math.abs(a.x - p.x), dy = Math.abs((a.y - 20) - p.y); if (dx < 64 && dy < 90 && dx < bfd) { bfd = dx; bf = a; } }
    if (bf) {
      this.promptTxt.setVisible(true).setPosition(bf.x, bf.y - 82).setText(bf.lit ? '{act}: descansar (guarda la partida)' + (this.travel ? ' y viajar' : '') : (bf.big ? '{act}: encender la GRAN HOGUERA (viaje rápido)' : '{act}: encender la hoguera'));
      if (ePress) this.restAt(bf);
      return;
    }
    this.interactTorch(ePress);
  },
  restAt(a) {
    a.lit = true; this.bonfireLit.add(a.id); this.lastAltar = { x: a.x, y: a.y }; this.lastBonfire = a; this.canAuto = true; this.hp = this.maxHp; this.rebuildLights();
    SFX.rest(); this.poof(a.x, a.y - 30, 10, 0xffb347);
    if (this.isHost) this.restReset(); else socket.emit('rest');
    const first = a.big && !this.travel; if (first) this.travel = true;
    this.savePersonal(a);
    this.toast(first ? '¡Viaje rápido desbloqueado! Descansa en cualquier hoguera encendida y elige a cuál viajar.' : 'Hoguera: vida restaurada, partida guardada y los monstruos han reaparecido', first ? 7000 : 4500);
    if (this.travel) this.openTravel();
  },
  // El juego solo se guarda al descansar en una hoguera (ya no hay guardado automático al conseguir mejoras)
  autoSave() {},
  restReset() { // el anfitrión hace reaparecer a todos los enemigos normales
    this.killed.clear();
    [...this.ents.entries()].forEach(([id, e]) => { if (e.sim && !e.boss) { this.poof(e.spr.x, e.spr.y, 3); e.spr.destroy(); this.ents.delete(id); } });
    this.activeT = 0;
  },
  savePersonal(a) {
    this.snap = this.captureState(); // nuevo punto de control: lo guardado al descansar en la hoguera
    socket.emit('save', { souls: this.souls, inv: this.inv, wlv: this.wlv, maxHp: this.maxHp, cry: [...this.cryGot], forge: [...this.forgeGot],
      altar: a.id, lit: [...this.bonfireLit], visited: [...this.visited], abil: this.abil, elite: [...this.eliteGot], pages: [...this.pagesGot], seen: [...this.seen], kills: this.kills, travel: this.travel, el: this.element, gems: this.gems, gemGot: [...this.gemGot], perm: this.perm, bg: [...this.bossGemsPaid], hammer: this.hammerState, met: this.smithMet });
  },

  // ---- punto de control: lo conseguido desde el último descanso en una hoguera se pierde al morir
  captureState() {
    return { souls: this.souls, inv: Object.assign({}, this.inv), wlv: this.wlv, maxHp: this.maxHp, abil: Object.assign({}, this.abil), cry: [...this.cryGot], forge: [...this.forgeGot], gem: [...this.gemGot], gems: this.gems,
      perm: Object.assign({}, this.perm), element: this.element, travel: this.travel, hammer: this.hammerState, met: this.smithMet, elite: [...this.eliteGot], pages: [...this.pagesGot], bg: [...this.bossGemsPaid],
      world: JSON.parse(JSON.stringify({ bosses: this.progress.bosses || [], broken: this.progress.broken || [], torches: this.progress.torches || {} })) };
  },
  revertToCheckpoint() {
    const s = this.snap; if (!s) return;
    const before = JSON.stringify([this.abil, this.cryGot.size, this.forgeGot.size, this.gemGot.size, this.wlv, this.maxHp, this.element, this.perm, this.pagesGot.size, this.eliteGot.size, this.hammerState]);
    // los objetos recogidos después del punto de control vuelven a su sitio
    const back = (set, keep, list, show) => { [...set].forEach(id => { if (!keep.includes(id)) { set.delete(id); const o = list.find(x => x.id === id); if (o) show(o); } }); };
    back(this.cryGot, s.cry, this.crystals, c => c.spr.setVisible(true));
    back(this.forgeGot, s.forge, this.forgeObjs, f => { f.spr.setVisible(true); f.glow.setVisible(!LITE); });
    back(this.gemGot, s.gem, this.gemObjs, gm => { gm.spr.setVisible(true); gm.glow.setVisible(!LITE); });
    back(this.pagesGot, s.pages, this.pageObjs, pg => { pg.spr.setVisible(true); pg.glow.setVisible(!LITE); });
    this.eliteGot = new Set(s.elite);
    // las gemas que soltó un jefe ya derrotado no se pierden (el jefe no vuelve): solo vuelven a su sitio las recogidas por el mapa
    const solo = this.isHost && !Object.keys(this.remotes).length; // en solitario el mundo entero vuelve al punto de control
    let bossGems = 0; if (!solo) this.bossGemsPaid.forEach(id => { if (!s.bg.includes(id) && GEMS_BOSS[id]) bossGems += GEMS_BOSS[id]; });
    if (solo) this.bossGemsPaid = new Set(s.bg);
    this.souls = s.souls; this.inv = Object.assign({}, s.inv); this.wlv = s.wlv; this.maxHp = s.maxHp; this.gems = s.gems + bossGems; this.perm = Object.assign({}, s.perm); this.element = s.element; this.travel = s.travel; this.smithMet = s.met;
    Object.keys(this.abil).forEach(k => { this.abil[k] = !!s.abil[k]; });
    this.hammerState = s.hammer; if (!solo && this.progress.bosses.includes('reina') && this.hammerState === 0) this.hammerState = 1;
    if (solo) this.revertWorld(s.world);
    this.syncRelics(); this.applyProgress(this.progress, true); this.syncNpcs(); this.wallBroken();
    const after = JSON.stringify([this.abil, this.cryGot.size, this.forgeGot.size, this.gemGot.size, this.wlv, this.maxHp, this.element, this.perm, this.pagesGot.size, this.eliteGot.size, this.hammerState]);
    const worldChanged = solo && JSON.stringify(s.world) !== JSON.stringify({ bosses: this.progress.bosses, broken: this.progress.broken, torches: this.progress.torches });
    if (before !== after || worldChanged) this.time.delayedCall(600, () => this.toast('Has vuelto a tu último punto de control: lo hecho desde entonces se pierde' + (solo ? ' (los jefes han vuelto a aparecer).' : '. Las reliquias de los jefes siguen en sus salas.') + '', 7000));
  },
  revertWorld(sw) { // el mundo vuelve a como estaba al guardar (solo en partidas de un jugador)
    const cur = this.progress, keepAbil = Object.assign({}, cur.abilities);
    (cur.broken || []).forEach(k => { if (!sw.broken.includes(k)) { const [gx, gy] = String(k).split(',').map(Number), a = this.W.areaOf(gx, gy); if (a) this.fg.putTileAt(a.z * 8 + K.CRACK, gx, gy); } }); // los muros rotos vuelven
    this.progress = { abilities: keepAbil, bosses: [...sw.bosses], broken: [...sw.broken], torches: Object.assign({}, sw.torches) };
    socket.emit('revertWorld', { bosses: this.progress.bosses, broken: this.progress.broken, torches: this.progress.torches });
    (this.W.gates || []).forEach(gt => { if (gt.open && !this.gateOk(gt)) { gt.open = false; gt.tiles.forEach(t => { const a = this.W.areaOf(t.gx, t.gy); if (a) this.fg.putTileAt(a.z * 8 + K.SOLID, t.gx, t.gy); }); } }); // las puertas se vuelven a cerrar
    this.torchObjs.forEach(o => { const want = this.progress.torches[o.id] !== undefined ? !!this.progress.torches[o.id] : !!(this.W.torches[o.id] && this.W.torches[o.id].lit); this.setTorch(o.id, want); });
    if (this.floorBroken && !this.progress.bosses.includes('conde')) { // el suelo del trono se reconstruye
      const th = this.W.areas.throne, fo = this.W.areas.fosoC;
      for (let gx = th.x0 + 2; gx <= th.x0 + th.rw - 3; gx++) for (const gy of [th.y0 + th.rh - 1, fo.y0]) { const v = this.W.fg[gy][gx]; if (v >= 0) this.fg.putTileAt(v, gx, gy); }
      this.floorBroken = false; this.floorState = 0;
    }
    this.sealKey = null; this.applySeal(null); this.curSeal = null;
    this.ents.forEach((en, id) => { if (en.sim && en.boss) { en.spr.destroy(); this.ents.delete(id); } }); // los jefes reaparecen
    this.projs.forEach(p => p.spr.destroy()); this.projs.clear();
    this.restReset(); this.wallBroken();
  },
  // ---- diálogo
  buildDialogueUi() {
    const f = (s, c = '#fff') => ({ fontSize: fsz(s), fontFamily: 'Courier New', color: c, wordWrap: { width: 720 } });
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
    const pages = n.def.lines, page = n.def.pick ? n.def.pick(this, pages, n.visits) : (n.visits === 1 ? pages[0] : pages[1 + Math.floor(Math.random() * (pages.length - 1))]);
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
  shopStock() { return (this.curNpc && SHOP_STOCK[this.curNpc.area]) || SHOP_STOCK.vest; },
  shopItems() {
    const nb = this.progress.bosses.length;
    return this.shopStock().filter(([, need, color]) => nb >= need || color === this.color).map(([id]) => ITEMS.find(it => it.id === id));
  },
  buildShopUi() {
    const f = (s, c = '#fff') => ({ fontSize: fsz(s), fontFamily: 'Courier New', color: c });
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
    this.shopTitle.setText('MERCADER      almas: ' + this.souls + ' ◆     gemas: ' + this.gems + ' ✦');
    this.shopRows.forEach(r => {
      const idx = list.indexOf(r.it), vis = idx >= 0 && this.shopOpen;
      [r.row, r.icon, r.nameT, r.ownT, r.priceT].forEach(o => o.setVisible(vis));
      if (!vis) return;
      const y = cy - 195 + idx * 31;
      [r.row, r.icon, r.nameT, r.ownT, r.priceT].forEach(o => o.setY(y));
      r.row.setFillStyle(idx === this.shopSel ? 0x5a3a9a : 0x2a1d4d, 1);
      const it = r.it, gem = !!it.gems, cost = gem ? this.itemCost(it) : it.price, maxed = it.perm && this.perm[it.perm] >= it.max;
      r.ownT.setText(it.perm ? 'nivel ' + this.perm[it.perm] + '/' + it.max : 'tienes ' + this.inv[it.id]);
      r.priceT.setText(maxed ? 'máximo' : cost + (gem ? ' ✦' : ' ◆')).setColor(maxed ? '#9fffb0' : ((gem ? this.gems : this.souls) >= cost ? (gem ? '#7ae8ff' : '#d9b3ff') : '#ff7a7a'));
    });
    this.shopDesc.setText(list[this.shopSel].desc);
    const nb = this.progress.bosses.length;
    const pend = this.shopStock().filter(([, need, color]) => nb < need && color !== this.color).map(s => s[1]);
    const falta = pend.length ? Math.min(...pend) - nb : 0;
    const last = !this.curNpc || SHOP_ORDER.indexOf(this.curNpc.area) >= SHOP_ORDER.length - 1;
    this.shopMore.setText(pend.length ? 'Tendré más mercancía cuando derrotes a ' + falta + ' jefe' + (falta > 1 ? 's' : '') + ' más...' : (last ? 'Esto es todo lo que tengo.' : 'Mis colegas más adelante venden cosas mejores...'));
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
    const gem = !!it.gems, cost = gem ? this.itemCost(it) : it.price;
    if (it.perm && this.perm[it.perm] >= it.max) { this.toast('Ya tienes el máximo de este objeto'); this.refreshShop(); return; }
    if ((gem ? this.gems : this.souls) < cost) { this.toast(gem ? 'No tienes suficientes gemas ✦ (se encuentran por el mapa y las sueltan los jefes)' : 'No tienes suficientes almas'); SFX.hurt(); this.refreshShop(); return; }
    if (!it.perm && this.inv[it.id] >= 9) { this.toast('No puedes llevar más'); this.refreshShop(); return; }
    if (gem) this.gems -= cost; else this.souls -= cost;
    if (it.perm) { this.perm[it.perm]++; this.toast(it.name + ': ' + it.desc, 5000); this.autoSave(); } else { this.inv[it.id]++; if (this.inv[ITEMS[this.selItem].id] === 0) this.selItem = ITEMS.indexOf(it); }
    SFX.pick(); this.refreshShop();
  },
  // ---- bestiario y diarios (tecla B)
  bookEntries() {
    const out = [];
    Object.keys(BESTIARY).forEach(t => out.push({ kind: 'b', id: t, known: this.seen.has(t) }));
    Object.keys(PAGES).forEach(a => { const pg = this.W.pages.find(x => x.area === a); out.push({ kind: 'p', id: a, known: !!(pg && this.pagesGot.has(pg.id)) }); });
    return out;
  },
  buildBookUi() {
    const f = (s, c = '#fff', w) => ({ fontSize: fsz(s), fontFamily: 'Courier New', color: c, wordWrap: w ? { width: w } : undefined });
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
    const items = w.crystals.length + w.forges.length + w.gems.length, gotItems = this.cryGot.size + this.forgeGot.size + this.gemGot.size;
    const bon = w.altars.length, litB = this.altars.filter(a => a.lit).length, bos = w.bosses.length, dead = this.progress.bosses.length;
    const extra = w.pages.length + this.W.spawns.filter(s => s.opts && s.opts.elite).length, gotExtra = this.pagesGot.size + this.eliteGot.size;
    const pct = Math.round(35 * vis / rooms.length + 25 * gotItems / items + 10 * litB / bon + 20 * dead / bos + 10 * gotExtra / extra);
    return { pct, vis, rooms: rooms.length, gotItems, items, litB, bon, dead, bos, pages: this.pagesGot.size, nPages: w.pages.length, elites: this.eliteGot.size, nElites: this.W.spawns.filter(s => s.opts && s.opts.elite).length };
  },
  nextElement(f) { // la forja y el santuario ofrecen elementos distintos; si llevas uno del otro, se pasa a su primero
    const order = f.kind === 'shrine' ? SHRINE_ORDER : ELEMENT_ORDER, i = order.indexOf(this.element);
    return i < 0 ? order[1] : order[(i + 1) % order.length];
  },
  // ---- menú de imbuir el arma: cada elección con su explicación (a futuro pedirá materiales)
  buildImbueUi() {
    const f = (s, c = '#fff', w) => ({ fontSize: fsz(s), fontFamily: 'Courier New', color: c, wordWrap: w ? { width: w } : undefined });
    const cx = SW / 2, cy = SH / 2; this.imbueObjs = []; this.imbueRows = []; this.imbueList = []; this.imbueSel = 0;
    const add = o => { o.setScrollFactor(0).setDepth(63); this.imbueObjs.push(o); return o; };
    add(this.add.rectangle(cx, cy, 700, 470, 0x140c22, 0.97).setStrokeStyle(4, 0xff9a3b));
    this.imbueTitle = add(this.add.text(cx, cy - 212, '', f('17px', '#ffb36a')).setOrigin(0.5));
    for (let i = 0; i < 8; i++) {
      const y = cy - 178 + i * 36, row = add(this.add.rectangle(cx - 180, y, 300, 34, 0x2a1d4d, 1)).setInteractive();
      const sw = add(this.add.rectangle(cx - 312, y, 18, 18, 0xffffff, 1)), txt = add(this.add.text(cx - 296, y, '', f('15px')).setOrigin(0, 0.5));
      row.on('pointerdown', () => { if (this.imbueList[i]) { if (this.imbueSel === i) this.imbueGo(); else { this.imbueSel = i; this.refreshImbue(); } } });
      this.imbueRows.push({ row, sw, txt });
    }
    this.imbueDescName = add(this.add.text(cx + 10, cy - 168, '', f('17px', '#ffd98a')));
    this.imbueDescText = add(this.add.text(cx + 10, cy - 138, '', f('14px', '#e8e0ff', 320)));
    this.imbueNeed = add(this.add.text(cx + 10, cy + 70, '', f('13px', '#a99bd1', 320)));
    add(this.add.text(cx, cy + 212, IS_TOUCH ? 'toca para elegir · toca otra vez para imbuir' : '↑↓ elegir · Enter/E imbuir · Esc cerrar', f('12px', '#a99bd1')).setOrigin(0.5));
    const close = add(this.add.text(cx + 330, cy - 212, '✕', f('22px', '#ff8a8a')).setOrigin(0.5)).setInteractive(); close.on('pointerdown', () => this.closeImbue());
    this.imbueObjs.forEach(o => o.setVisible(false));
  },
  openImbue(kind, from) {
    const order = kind === 'all' ? ALL_ORDER : (kind === 'shrine' ? SHRINE_ORDER : ELEMENT_ORDER);
    this.imbueKind = kind; this.imbueList = order.map(id => ({ id }));
    this.imbueSel = Math.max(0, order.indexOf(this.element));
    this.imbueTitle.setText(kind === 'all' ? 'HERRERO EN SU SANTUARIO — ¿qué poder quieres en tu arma?' : (kind === 'shrine' ? 'SANTUARIO DE LAS SOMBRAS — ofrenda a la noche' : 'HERRERO DE LA CUEVA — ¿qué poder quieres en tu arma?'));
    this.imbueOpen = true; this.imbueObjs.forEach(o => o.setVisible(true)); this.promptTxt.setVisible(false); this.refreshImbue();
  },
  refreshImbue() {
    this.imbueRows.forEach((r, i) => {
      const it = this.imbueList[i], vis = !!it && this.imbueOpen; r.row.setVisible(vis); r.sw.setVisible(vis); r.txt.setVisible(vis); if (!vis) return;
      const el = it.id ? ELEMENTS[it.id] : null;
      r.sw.setFillStyle(el ? el.tint : 0x555555, 1); r.txt.setText((el ? el.name : 'Sin elemento') + (this.element === it.id ? '   ✔ actual' : '')); r.row.setFillStyle(i === this.imbueSel ? 0x7a4a1a : 0x2a1d4d, 1);
    });
    const sel = this.imbueList[this.imbueSel], el = sel && sel.id ? ELEMENTS[sel.id] : null;
    this.imbueDescName.setText(el ? el.name : 'Sin elemento').setColor(el ? '#' + el.tint.toString(16).padStart(6, '0') : '#cccccc');
    this.imbueDescText.setText(el ? el.long : 'El arma vuelve a su filo normal: sin efectos extra, con el color de tu vampiro.');
    this.imbueNeed.setText('Material necesario: ninguno (por ahora).\nMás adelante pedirá objetos para cada transformación.');
  },
  imbueKeys(J) {
    const n = this.imbueList.length;
    if (J.UP || J.W) { this.imbueSel = (this.imbueSel + n - 1) % n; this.refreshImbue(); SFX.hit(); }
    if (J.DOWN || J.S) { this.imbueSel = (this.imbueSel + 1) % n; this.refreshImbue(); SFX.hit(); }
    if (J.ENTER || J.E || J.SPACE) this.imbueGo();
    if (J.ESC) this.closeImbue();
  },
  closeImbue() { this.imbueOpen = false; if (this.imbueObjs) this.imbueObjs.forEach(o => o.setVisible(false)); },
  imbueGo() {
    const sel = this.imbueList[this.imbueSel]; if (!sel) return; const from = this.curNpc || this.player;
    this.element = sel.id; this.closeImbue(); const col = sel.id ? ELEMENTS[sel.id].tint : 0xffffff;
    SFX.elem(); this.poof(from.x || this.player.x, (from.y || this.player.y) - 20, 12, col); this.cameras.main.flash(160, (col >> 16) & 255, (col >> 8) & 255, col & 255);
    this.toast(sel.id ? 'Arma imbuida de ' + ELEMENTS[sel.id].name + ': ' + ELEMENTS[sel.id].desc : 'Arma sin elemento', 5000); this.autoSave();
  },
  timedStep(time) { // plataformas temporales: aparecen y desaparecen con parpadeo de aviso (cada jugador las ve en su propio ritmo)
    if (!this.timed || !this.timed.length) return;
    const t = time / 1000, g = this.timedG; g.clear();
    for (const p of this.timed) {
      const ph = (((t + p.phase) % p.period) + p.period) % p.period, shown = ph < p.on, warn = shown && ph > p.on - 0.8;
      if (shown !== p.shown) {
        p.shown = shown;
        for (let i = 0; i < p.w; i++) {
          if (shown) { const tl = this.fg.putTileAt(p.idx, p.gx + i, p.gy); if (tl) { tl.setCollision(false, false, true, false); this.map.calculateFacesAt(p.gx + i, p.gy); } }
          else { this.fg.removeTileAt(p.gx + i, p.gy); this.map.calculateFacesAt(p.gx + i, p.gy); }
        }
        if (!LITE) this.poof((p.gx + p.w / 2) * T, (p.gy + 0.5) * T, 2, 0xffd6f0);
      }
      const x = p.gx * T, y = p.gy * T, wd = p.w * T;
      if (shown) { if (warn && ((time >> 7) & 1)) g.fillStyle(0xffffff, 0.6).fillRect(x, y, wd, 8); else g.fillStyle(0xffb3d9, 0.35).fillRect(x, y, wd, 4); }
      else g.lineStyle(2, 0xffb3d9, 0.3).strokeRect(x + 1, y + 1, wd - 2, 6);
    }
  },
  showLines(n, lines) { // diálogo corto con un NPC
    this.dlg = { npc: n, page: lines, i: 0 }; this.dlgObjs.forEach(o => o.setVisible(true)); this.promptTxt.setVisible(false);
    this.dlgName.setText(n.def.name); this.dlgText.setText(lines[0]); SFX.altar();
  },
  smithTalk(n) { // el herrero de la cueva: primera charla, entrega del Martillo Latente o menú de imbuir
    if (this.hammerState === 1) {
      this.hammerState = 2; this.syncNpcs(); this.smithMet = true; SFX.pick();
      this.showLines(n, ['¡El Martillo Latente! Todavía late... lo siento caliente en las manos.', 'Con él puedo forjar el poder de las sombras, pero necesito un lugar oculto: me mudo al Santuario de las Sombras, bajo el suelo agrietado de la Cumbre del Alba.', 'Ven a verme allí: te imbuiré con cualquier poder que quieras.']);
      this.toast('El herrero se muda a su santuario secreto, bajo el suelo agrietado de la Cumbre del Alba', 7000); return true;
    }
    if (!this.smithMet) { this.smithMet = true; this.showLines(n, ['Soy el herrero de la Cueva. Aquí abajo el fuego no se apaga nunca, y con él puedo imbuir tu arma.', 'Pero mi Martillo Latente se perdió hace siglos. Dicen que la Reina de Huesos lo guarda en las Catacumbas, bajo la Mazmorra de Hierro.', 'Tráemelo y podré forjar poderes de sombra... aunque tendría que mudarme a un santuario oculto, bajo la Cumbre del Alba.']); return true; }
    return false;
  },
  syncNpcs() { // muestra u oculta a los NPC según la historia (el herrero se muda al santuario)
    (this.npcObjs || []).forEach(n => {
      if (!n.def.show) return; const v = n.def.show(this) && !this.hiddenAt(n.x, n.y - 24); n.off = !n.def.show(this);
      n.spr.setVisible(v); n.name.setVisible(v); if (n.hammer) n.hammer.setVisible(v);
    });
  },
  // herrero trabajando: martillo que golpea el yunque con chispas
  smithWorks(n) {
    const h = this.add.image(n.x + 24, n.y - 36, 'forge').setScale(1.5).setDepth(5).setOrigin(0.85, 0.9).setRotation(-0.9);
    n.hammer = h;
    this.tweens.add({ targets: h, rotation: 0.35, duration: 360, yoyo: true, repeat: -1, ease: 'Sine.in', hold: 220,
      onYoyo: () => { const d = Math.hypot(this.player.x - n.x, this.player.y - n.y); if (d < 420) { beep(180, 0.05, 'square', 0.02, -60); } this.poof(n.x + 44, n.y - 16, 3, 0xffb347); } });
  },
  // ---- atmósfera de cueva: estalactitas, vetas de lava, cascada de lava de la forja
  buildCaveDecor() {
    const W = this.W; this.caveLamps = [];
    const g = this.add.graphics().setDepth(-6);
    W.areaList.filter(a => a.z === 8).forEach(a => {
      const rnd = rndSeeded(a.x0 * 7 + a.y0 * 13 + 3), top = (a.y0 + 1) * T, floor = (a.y0 + a.rh - 1) * T;
      for (let x = 2; x < a.rw - 2; x += 1 + Math.floor(rnd() * 3)) { // estalactitas
        const h = 14 + rnd() * 44, wd = 9 + rnd() * 14, cx = (a.x0 + x + 0.5) * T;
        g.fillStyle(0x35271f, 1).fillTriangle(cx - wd, top, cx + wd, top, cx, top + h); g.fillStyle(0x5a463a, 1).fillTriangle(cx - wd, top, cx - wd * 0.2, top, cx - wd * 0.5, top + h * 0.6);
      }
      for (let x = 3; x < a.rw - 3; x += 3 + Math.floor(rnd() * 5)) { // estalagmitas
        const h = 10 + rnd() * 24, wd = 8 + rnd() * 10, cx = (a.x0 + x + 0.5) * T;
        g.fillStyle(0x2a1f1a, 1).fillTriangle(cx - wd, floor, cx + wd, floor, cx, floor - h);
      }
      if (a.rh > 20) for (let y = 4; y < a.rh - 3; y += 5) for (const wx of [1.6, a.rw - 2.6]) { // vetas de lava en las paredes de la caída
        const px = (a.x0 + wx) * T, py = (a.y0 + y + rnd() * 2) * T, gl = this.add.image(px, py, 'glow').setScale(1.6).setBlendMode(Phaser.BlendModes.ADD).setTint(0xff7a2a).setAlpha(0.5).setDepth(-4).setVisible(!LITE);
        this.tweens.add({ targets: gl, alpha: 0.25, yoyo: true, repeat: -1, duration: 900 + rnd() * 900 }); this.caveLamps.push({ x: px, y: py, r: 95 });
      }
    });
    const fr = W.areas.fragua; // cascada de lava tras la forja
    if (fr) {
      const lx = (fr.x0 + 35) * T, ly0 = (fr.y0 + 1) * T, lyb = (fr.y0 + fr.rh - 1) * T;
      const lava = this.add.graphics().setDepth(-7); lava.fillStyle(0xff6a1a, 0.9).fillRect(lx, ly0, T * 1.6, lyb - ly0); lava.fillStyle(0xffc04a, 0.7).fillRect(lx + 10, ly0, 12, lyb - ly0); lava.fillStyle(0xff3a0a, 0.8).fillRect(lx + T * 1.6 - 8, ly0, 8, lyb - ly0);
      this.tweens.add({ targets: lava, alpha: 0.78, yoyo: true, repeat: -1, duration: 700 });
      for (let i = 0; i < 8; i++) { const dr = this.add.rectangle(lx + 6 + (i % 4) * 11, ly0 + i * 30, 7, 16, 0xffe08a, 0.9).setDepth(-6); this.tweens.add({ targets: dr, y: lyb - 8, duration: 1300 + i * 90, repeat: -1, delay: i * 160, ease: 'Quad.in' }); }
      const pool = this.add.image(lx + T * 0.8, lyb - 10, 'glow').setScale(5).setBlendMode(Phaser.BlendModes.ADD).setTint(0xff7a2a).setAlpha(0.6).setDepth(-5).setVisible(!LITE);
      this.tweens.add({ targets: pool, alpha: 0.4, yoyo: true, repeat: -1, duration: 600 }); this.caveLamps.push({ x: lx + T * 0.8, y: lyb - 40, r: 230 }, { x: lx + T * 0.8, y: ly0 + 200, r: 150 });
    }
  },
  // ---- atmósfera de los Calabozos Profundos (zona 9): cortinas de musgo, raíces, hongos luminosos (farolas) y goteras
  buildMossDecor() {
    const W = this.W; this.caveLamps = this.caveLamps || []; this.mossDrips = [];
    const g = this.add.graphics().setDepth(-6);
    W.areaList.filter(a => a.z === 9).forEach(a => {
      const rnd = rndSeeded(a.x0 * 11 + a.y0 * 17 + 9), top = (a.y0 + 1) * T, floor = (a.y0 + a.rh - 1) * T;
      for (let x = 1; x < a.rw - 1; x += 1 + Math.floor(rnd() * 2)) { // musgo y raíces colgando del techo
        const cx = (a.x0 + x + rnd()) * T, len = 16 + rnd() * 70;
        g.fillStyle(0x2a5428, 1).fillRect(cx - 3, top, 6, len); g.fillStyle(0x3f7a3a, 1).fillRect(cx - 3, top, 2, len * 0.8); g.fillStyle(0x8fd35a, 1).fillRect(cx - 2, top + len, 4, 4);
        if (rnd() < 0.35) { const rl = 40 + rnd() * 90; g.lineStyle(3, 0x5a4128, 1); g.beginPath(); g.moveTo(cx + 8, top); for (let i = 1; i <= 5; i++) g.lineTo(cx + 8 + Math.sin(i * 1.3 + x) * 8, top + rl * i / 5); g.strokePath(); }
        if (rnd() < 0.18) this.mossDrips.push({ x: cx, y: top + len + 4, floor, next: 0 }); // de aquí gotea
      }
      for (let x = 3; x < a.rw - 3; x += 4 + Math.floor(rnd() * 6)) { // hongos luminosos del suelo = farolas
        const cx = (a.x0 + x + 0.5) * T, h = 8 + rnd() * 16, w = 8 + rnd() * 9, col = rnd() < 0.75 ? 0x6dffd0 : 0xb48aff;
        g.fillStyle(0xbfd8c0, 1).fillRect(cx - 2, floor - h, 4, h);
        g.fillStyle(col, 1).beginPath().arc(cx, floor - h, w, Math.PI, 0).closePath().fillPath(); // sombrero (media elipse)
        g.fillStyle(0xffffff, 0.55).fillRect(cx - w * 0.4, floor - h - w * 0.55, 3, 3);
        const gl = this.add.image(cx, floor - h, 'glow').setScale(1.2 + w / 12).setBlendMode(Phaser.BlendModes.ADD).setTint(col).setAlpha(0.55).setDepth(-4).setVisible(!LITE);
        this.tweens.add({ targets: gl, alpha: 0.3, yoyo: true, repeat: -1, duration: 1400 + rnd() * 1600 });
        this.caveLamps.push({ x: cx, y: floor - h, r: 65 + w * 4 }); // lo recoge drawDark -> lamp()
      }
    });
    if (this.mossDrips.length) this.time.addEvent({ delay: 700, loop: true, callback: () => { // goteras: solo las cercanas al jugador
      if (LITE || !this.player) return; const p = this.player, now = this.time.now;
      for (const d of this.mossDrips) {
        if (Math.abs(d.x - p.x) > 640 || Math.abs(d.y - p.y) > 420 || d.next > now) continue;
        d.next = now + 1800 + Math.random() * 3200;
        const dr = this.add.rectangle(d.x, d.y, 3, 7, 0x9dffd8, 0.9).setDepth(-3), near = Math.abs(d.x - p.x) < 420;
        this.tweens.add({ targets: dr, y: d.floor - 4, duration: Math.max(250, (d.floor - d.y) * 1.6), ease: 'Quad.in', onComplete: () => {
          const rp = this.add.image(d.x, d.floor - 3, 'puff').setScale(0.3, 0.12).setTint(0x9dffd8).setAlpha(0.8).setDepth(-3);
          this.tweens.add({ targets: rp, scaleX: 1.1, alpha: 0, duration: 500, onComplete: () => rp.destroy() });
          if (near) beep(1300 + Math.random() * 500, 0.05, 'sine', 0.012, -500);
          dr.destroy();
        } });
      }
    } });
    // carteles de ambientación
    const lab = (id, dx, dy, txt, col) => { const a = W.areas[id]; if (!a) return; this.add.text((a.x0 + dx) * T, (a.y0 + dy) * T, txt, { fontSize: fsz('15px'), fontFamily: 'Courier New', color: col, stroke: '#000', strokeThickness: 4, align: 'center' }).setOrigin(0.5).setDepth(-3); };
    lab('asc', 8, 12, 'CALABOZOS PROFUNDOS\nNo pises donde brilla el musgo.\nAlgo bebe lo que gotea.', '#8fe0b0');
    lab('cel', 9, 12, 'CELDA 47\n"Me encerraron por cantar al alba.\nYa me crece el bosque en los huesos."', '#c9b88a');
    lab('ant', 13, 12, 'ORDEN DE LA GUARDIA\nSi oyes llaves, no corras:\nel Alcaide nunca ha perdido un preso.', '#ff9a8a');
    lab('madre', 26, 8, 'LA MADRE MOHO\nLo que cae al pozo, florece.\nNo la despiertes con luz.', '#d8a0f0');
  },
  mossSpores(time) { // esporas que flotan despacio en el aire de los calabozos profundos
    if (LITE || !this.player || time - (this.sporeT || 0) < 190) return;
    const a = this.W.areaOf(Math.floor(this.player.x / T), Math.floor(this.player.y / T)); if (!a || a.z !== 9) return;
    this.sporeT = time; const x = this.player.x + Phaser.Math.Between(-340, 340), y = this.player.y + Phaser.Math.Between(-200, 200);
    const s = this.add.image(x, y, 'puff').setScale(Phaser.Math.FloatBetween(0.22, 0.45)).setTint(Math.random() < 0.7 ? 0x8dffc8 : 0xd8ff8a).setBlendMode(Phaser.BlendModes.ADD).setDepth(11).setAlpha(0);
    this.tweens.add({ targets: s, alpha: 0.75, yoyo: true, duration: 1500 });
    this.tweens.add({ targets: s, y: y - Phaser.Math.Between(40, 110), duration: 3000, ease: 'Sine.inOut' });
    this.tweens.add({ targets: s, x: x + Phaser.Math.Between(-45, 45), duration: 3000, ease: 'Sine.inOut', onComplete: () => s.destroy() });
  },
  // ---- ascensor: baja y sube solo (3 s parado arriba, 4 s bajando, 3 s parado abajo, 4 s subiendo)
  liftY(l, t) {
    const c = t % 14, e = k => k * k * (3 - 2 * k), d = l.yBot - l.yTop;
    if (c < 3) return l.yTop; if (c < 7) return l.yTop + d * e((c - 3) / 4); if (c < 10) return l.yBot; return l.yBot - d * e((c - 10) / 4);
  },
  liftStep(dt) {
    if (!this.W.lifts || !this.W.lifts.length || !this.player) return;
    if (!this.liftObjs) {
      this.liftObjs = this.W.lifts.map(l => {
        const r = this.add.rectangle(l.x + l.w / 2, l.yTop + 8, l.w, 16, 0x5a4128).setDepth(3).setStrokeStyle(2, 0x2a5428);
        this.physics.add.existing(r, true); const b = r.body; b.checkCollision.down = false; b.checkCollision.left = false; b.checkCollision.right = false; // cuerpo estático: se recoloca cada frame
        this.physics.add.collider(this.player, r);
        const g = this.add.graphics().setDepth(2); // cadenas hacia el techo
        return { ...l, r, g };
      });
    }
    const t = Date.now() / 1000;
    this.liftObjs.forEach(L => {
      const oldTop = L.r.y - 8, pb = this.player.body, riding = pb.bottom >= oldTop - 6 && pb.bottom <= oldTop + 10 && pb.velocity.y >= -20 && pb.right > L.x && pb.left < L.x + L.w;
      L.r.y = this.liftY(L, t) + 8; L.r.body.updateFromGameObject();
      if (riding) { const sh = (L.r.y - 8) - oldTop; if (sh) this.player.y += sh; } // el jugador sube y baja con la plataforma
      L.g.clear().fillStyle(0x6b6b5a, 1); [L.x + 10, L.x + L.w - 10].forEach(cx => L.g.fillRect(cx - 2, L.yTop - 200, 4, L.r.y - 8 - (L.yTop - 200)));
    });
  },
  caveEmbers(time) { // brasas que suben en el aire de la cueva
    if (LITE || !this.player || time - (this.emberT || 0) < 260) return;
    const a = this.W.areaOf(Math.floor(this.player.x / T), Math.floor(this.player.y / T)); if (!a || a.z !== 8) return;
    this.emberT = time; const x = this.player.x + Phaser.Math.Between(-320, 320), y = this.player.y + Phaser.Math.Between(-60, 240);
    const s = this.add.image(x, y, 'puff').setScale(0.5).setTint(0xff8a3a).setBlendMode(Phaser.BlendModes.ADD).setDepth(11).setAlpha(0.8);
    this.tweens.add({ targets: s, y: y - 160, x: x + Phaser.Math.Between(-30, 30), alpha: 0, duration: 1800, onComplete: () => s.destroy() });
  },
  cycleElement(f) { // forja de los elementos: cada pulsación cambia el poder del arma
    const nxt = this.nextElement(f); this.element = nxt;
    const col = nxt ? ELEMENTS[nxt].tint : 0xffffff; SFX.pick(); this.poof(f.x, f.y, 10, col); this.cameras.main.flash(160, (col >> 16) & 255, (col >> 8) & 255, col & 255);
    this.toast(nxt ? 'Arma imbuida de ' + ELEMENTS[nxt].name + ': ' + ELEMENTS[nxt].desc : 'Arma sin elemento', 5000); this.autoSave();
  },
  buildTravelUi() {
    const f = (s, c = '#fff') => ({ fontSize: fsz(s), fontFamily: 'Courier New', color: c });
    const cx = SW / 2, cy = SH / 2; this.travelObjs = []; this.travelRows = []; this.travelList = []; this.travelSel = 0;
    const add = o => { o.setScrollFactor(0).setDepth(62); this.travelObjs.push(o); return o; };
    add(this.add.rectangle(cx, cy, 560, 440, 0x140c22, 0.97).setStrokeStyle(4, 0xffb347));
    add(this.add.text(cx, cy - 200, 'VIAJE RÁPIDO — elige una hoguera', f('18px', '#ffd98a')).setOrigin(0.5));
    for (let i = 0; i < 12; i++) {
      const row = add(this.add.rectangle(cx, cy - 160 + i * 28, 520, 24, 0x2a1d4d, 1)).setInteractive(); const txt = add(this.add.text(cx - 240, cy - 160 + i * 28, '', f('14px')).setOrigin(0, 0.5));
      row.on('pointerdown', () => { if (this.travelList[i]) { this.travelSel = i; this.travelGo(); } }); this.travelRows.push({ row, txt });
    }
    add(this.add.text(cx, cy + 205, IS_TOUCH ? 'toca una hoguera para viajar' : '↑↓ elegir · Enter/E viajar · Esc cerrar', f('12px', '#a99bd1')).setOrigin(0.5));
    const close = add(this.add.text(cx + 262, cy - 205, '✕', f('22px', '#ff8a8a')).setOrigin(0.5)).setInteractive(); close.on('pointerdown', () => this.closeTravel());
    this.travelObjs.forEach(o => o.setVisible(false));
  },
  openTravel() {
    this.travelList = this.altars.filter(a => a.lit).slice(0, 12).map(a => ({ a, name: this.W.areas[a.area].name }));
    this.travelSel = Math.max(0, this.travelList.findIndex(t => t.a === this.lastBonfire));
    this.travelOpen = true; this.travelObjs.forEach(o => o.setVisible(true)); this.promptTxt.setVisible(false); this.refreshTravel();
  },
  refreshTravel() {
    this.travelRows.forEach((r, i) => {
      const t = this.travelList[i]; r.row.setVisible(!!t && this.travelOpen); r.txt.setVisible(!!t && this.travelOpen); if (!t) return;
      r.txt.setText((t.a.big ? '★ ' : '  ') + t.name + (t.a === this.lastBonfire ? '   (estás aquí)' : '')); r.row.setFillStyle(i === this.travelSel ? 0x5a3a9a : 0x2a1d4d, 1);
    });
  },
  travelKeys(J) {
    const n = this.travelList.length; if (!n) { this.closeTravel(); return; }
    if (J.UP || J.W) { this.travelSel = (this.travelSel + n - 1) % n; this.refreshTravel(); SFX.hit(); }
    if (J.DOWN || J.S) { this.travelSel = (this.travelSel + 1) % n; this.refreshTravel(); SFX.hit(); }
    if (J.ENTER || J.E || J.SPACE) this.travelGo();
    if (J.ESC) this.closeTravel();
  },
  closeTravel() { this.travelOpen = false; this.travelObjs.forEach(o => o.setVisible(false)); },
  travelGo() {
    const t = this.travelList[this.travelSel]; if (!t) return; this.closeTravel();
    if (t.a === this.lastBonfire) return;
    const p = this.player; this.poof(p.x, p.y, 10, 0xffb347); p.setPosition(t.a.x, t.a.y - 21); p.body.setVelocity(0, 0); this.lastGround = { x: p.x, y: p.y }; this.invuln = 1.5;
    this.cameras.main.flash(250, 255, 200, 120); SFX.warp(); this.poof(p.x, p.y, 10, 0xffb347); this.toast('Has viajado a ' + t.name);
  },
  closeUi() {
    if (this.travelOpen) this.closeTravel();
    if (this.imbueOpen) this.closeImbue();
    this.shopOpen = false; this.dlg = null; this.curNpc = null;
    if (this.shopObjs) this.shopObjs.forEach(o => o.setVisible(false));
    if (this.dlgObjs) this.dlgObjs.forEach(o => o.setVisible(false));
  },
});

// ---------- panel de opciones (HTML, funciona en menú y en partida) ----------
(() => {
  const $o = id => document.getElementById(id), panel = $o('opts'); if (!panel) return;
  const sync = () => { $o('oMusic').value = Math.round(OPT.music * 100); $o('oSfx').value = Math.round(OPT.sfx * 100); $o('vMusic').textContent = Math.round(OPT.music * 100) + '%'; $o('vSfx').textContent = Math.round(OPT.sfx * 100) + '%'; $o('oText').value = String(OPT.text); $o('oCb').checked = OPT.cb; };
  const toggle = on => { const open = on === undefined ? panel.classList.contains('hidden') : on; panel.classList.toggle('hidden', !open); if (open) sync(); };
  $o('optBtn').onclick = () => toggle(true); $o('oClose').onclick = () => toggle(false);
  $o('oMusic').oninput = e => { OPT.music = e.target.value / 100; Music.refreshVol(); sync(); saveOpts(); };
  $o('oSfx').oninput = e => { OPT.sfx = e.target.value / 100; sync(); saveOpts(); };
  $o('oSfx').onchange = () => { if (typeof beep === 'function') beep(520, 0.1, 'triangle', 0.05); };
  $o('oText').onchange = e => { OPT.text = +e.target.value; saveOpts(); };
  $o('oCb').onchange = e => { OPT.cb = e.target.checked; saveOpts(); };
  document.addEventListener('keydown', ev => {
    if (ev.target && /^(INPUT|SELECT|TEXTAREA)$/.test(ev.target.tagName) && ev.target.type !== 'range' && ev.target.type !== 'checkbox') return;
    if (ev.code === 'KeyO' && !ev.repeat) toggle(); else if (ev.code === 'Escape' && !panel.classList.contains('hidden')) toggle(false);
  });
})();
