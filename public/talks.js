/* Four Fangs of Dawn: charlas entre vampiros (multijugador) y pensamientos (en solitario). Textos de docs/PERSONAJES.md */
// Colores: red = Cor, blue = Zaf, green = Malak, purple = Matis, lua = Lua, vigilia, cadalso.
// En los eventos L01..L07 (Lua) el color 'A' es un hueco: cualquiera de los presentes (ver comentarios).
// Eventos de grupo (A15, A23, A26, B21, X03): sin pair, porque hablan los cuatro (o los que esten).

const TALK_TRIGGERS = [
  // ---------- A: primera vez que se entra en un area (Zona 1) ----------
  { id: 'A01', type: 'area', area: 'vest' },
  { id: 'A02', type: 'area', area: 'archivo' },
  { id: 'A03', type: 'area', area: 'naveS' },
  { id: 'A04', type: 'area', area: 'calab' },
  { id: 'A05', type: 'area', area: 'galeria' },
  { id: 'A06', type: 'area', area: 'pasR' },
  { id: 'A07', type: 'area', area: 'escalaR' },
  { id: 'A08', type: 'area', area: 'alba1' },
  { id: 'A09', type: 'area', area: 'cumbre' },
  { id: 'A10', type: 'area', area: 'arch1' },
  { id: 'A11', type: 'area', area: 'cat1' },
  { id: 'A12', type: 'area', area: 'asc' },   // en PERSONAJES se llama "Calabozos Profundos"; en world.js el area 'asc' es el Pozo del Ascensor
  { id: 'A13', type: 'area', area: 'caida' },
  { id: 'A14', type: 'area', area: 'pas5' },
  { id: 'A15', type: 'area', area: 'gran' },
  // ---------- A: Zona 2 ----------
  { id: 'A16', type: 'area', area: 'asc2' },
  { id: 'A17', type: 'area', area: 'pat1' },
  { id: 'A18', type: 'area', area: 'desp' },   // exige a Malak
  { id: 'A19', type: 'area', area: 'milla' },  // exige a Zaf
  { id: 'A20', type: 'area', area: 'carc' },   // exige a Zaf; Lua habla desde la celda
  { id: 'A21', type: 'area', area: 'y3' },     // exige a Cor
  { id: 'A22', type: 'area', area: 'cap' },
  { id: 'A23', type: 'area', area: 'dep1' },   // la puerta ya se ha abierto con la llave
  { id: 'A24', type: 'area', area: 'dep2' },
  { id: 'A25', type: 'area', area: 'dep4' },
  { id: 'A26', type: 'area', area: 'tronos' },
  // ---------- B: lograr un objetivo ----------
  { id: 'B01', type: 'boss', boss: 'garg' },
  { id: 'B02', type: 'boss', boss: 'bishop' },
  { id: 'B03', type: 'boss', boss: 'reina' },
  { id: 'B04', type: 'boss', boss: 'clock' },
  { id: 'B05', type: 'boss', boss: 'archon' },
  { id: 'B06', type: 'boss', boss: 'conde' },
  { id: 'B07', type: 'boss', boss: 'aurora', alt: 'vesper' }, // salta cuando cae Aurora O Vesper (el que caiga primero)
  { id: 'B08', type: 'boss', boss: 'alcaide' },
  { id: 'B09', type: 'boss', boss: 'madre' },
  { id: 'B10', type: 'hammer' },                              // el Martillo Latente se entrega al Herrero (giveHammer / smithTalk)
  { id: 'B11', type: 'forge', n: 1 },                         // primera mejora de arma (Gran Biblioteca, area 'gbib')
  { id: 'B12', type: 'forge', n: 2 },                         // mejora de dano del final de la Zona 1 (forja del area 'pas1', Antesala del Abismo)
  { id: 'B13', type: 'crystal', n: 1 },                       // primer cristal de vida recogido (no hay otro tipo de disparador en la lista del encargo)
  { id: 'B14', type: 'ring' },                                // el Anillo del Rey se entrega a Isolda
  { id: 'B15', type: 'boss', boss: 'capitan' },
  { id: 'B16', type: 'boss', boss: 'farero' },
  { id: 'B17', type: 'boss', boss: 'subastadora' },
  { id: 'B18', type: 'boss', boss: 'chambelan' },
  { id: 'B19', type: 'forge', n: 3 },                         // forja de la Antesala de los Regentes (area 'dep4'; PERSONAJES dice nivel 4; en world.js es la 3a forja)
  { id: 'B20', type: 'boss', boss: 'cadalso', inBoss: true }, // sale durante la transicion al combate 2
  { id: 'B21', type: 'boss', boss: 'vigilia' },
  // ---------- C: primera vez que se ve un enemigo ----------
  { id: 'C01', type: 'enemy', enemy: 'sk' },
  { id: 'C02', type: 'enemy', enemy: 'kn' },
  { id: 'C03', type: 'enemy', enemy: 'bat' },
  { id: 'C04', type: 'enemy', enemy: 'gh' },
  { id: 'C05', type: 'enemy', enemy: 'saw' },
  { id: 'C06', type: 'enemy', enemy: 'sentinel' },
  { id: 'C07', type: 'enemy', enemy: 'kn', eliteName: 'Capitán de Armaduras', area: 'corr' }, // el elite del Corredor de Armaduras (world.js area 'corr'), no el caballero normal
  { id: 'C08', type: 'enemy', enemy: 'slug' },
  { id: 'C09', type: 'enemy', enemy: 'vine' },
  { id: 'C10', type: 'enemy', enemy: 'pris' },
  { id: 'C11', type: 'enemy', enemy: 'magma' },
  { id: 'C12', type: 'enemy', enemy: 'moth' },
  // Zona 2: estos ids de enemigo NO existen todavia en EN (game.js); son los nombres propuestos en PERSONAJES.md
  { id: 'C13', type: 'enemy', enemy: 'cort' },
  { id: 'C14', type: 'enemy', enemy: 'rosa' },
  { id: 'C15', type: 'enemy', enemy: 'guard' },
  { id: 'C16', type: 'enemy', enemy: 'arq' },
  { id: 'C17', type: 'enemy', enemy: 'farol' },
  { id: 'C18', type: 'enemy', enemy: 'ahogado' },
  { id: 'C19', type: 'enemy', enemy: 'frasco' },
  { id: 'C20', type: 'enemy', enemy: 'cobrador' },
  // ---------- D: lugares inalcanzables por ahora (x, y en tiles locales del area; coordenadas orientativas de ZONA2.md 7.2) ----------
  { id: 'D01', type: 'spot', area: 'salon', x: 13, y: 16, r: 200, need: { abil: 'dash' } },
  { id: 'D02', type: 'spot', area: 'mazm', x: 36, y: 10, r: 200, need: { abil: 'dj' } },
  { id: 'D03', type: 'spot', area: 'caden', x: 49, y: 16, r: 200, need: { gate: 'bishop' } },
  { id: 'D04', type: 'spot', area: 'archivo', x: 24, y: 16, r: 200, need: { wall: true } },
  { id: 'D05', type: 'spot', area: 'obs', x: 23, y: 34, r: 200, need: { gate: 'clock' } },
  { id: 'D06', type: 'spot', area: 'pasR', x: 23, y: 16, r: 200, need: { gate: 'sellos' } }, // 'sellos' = los dos sellos (tinta y hueso); no es un id de jefe
  { id: 'D07', type: 'spot', area: 'grieta', x: 3, y: 16, r: 200, need: { gate: 'alba' } },   // 'alba' = cae Aurora o Vesper
  { id: 'D08', type: 'spot', area: 'cripta', x: 24, y: 16, r: 200, need: { abil: 'wings' } },
  { id: 'D09', type: 'spot', area: 'albaB', x: 49, y: 16, r: 200, need: { gate: 'alba' } },
  { id: 'D10', type: 'spot', area: 'gran', x: 19, y: 16, r: 200, need: { gate: 'madre' } },
  { id: 'D11', type: 'spot', area: 'pat6', x: 22, y: 16, r: 200, need: { gate: 'capitan' } },
  { id: 'D12', type: 'spot', area: 'y3', x: 40, y: 16, r: 200, need: { gate: 'capitan' } },
  { id: 'D13', type: 'spot', area: 'cellar', x: 74, y: 15, r: 200, need: { wall: true } },
  { id: 'D14', type: 'spot', area: 'y2', x: 40, y: 12, r: 200, need: { abil: 'wings' } },
  { id: 'D15', type: 'spot', area: 'dep2', x: 46, y: 16, r: 200, need: { wall: true } },
  // ---------- Lua (solo desde que esta en el grupo) ----------
  { id: 'L01', type: 'extra', when: 'lua' }, // primera hoguera tras el rescate
  { id: 'L02', type: 'extra', when: 'lua' }, // primer enemigo muerto por el latigo de Lua
  { id: 'L03', type: 'extra', when: 'lua' }, // primera vez que Cor da una orden a Lua (Cor presente)
  { id: 'L04', type: 'extra', when: 'lua' }, // primera sala oscura tras el rescate (Zaf presente)
  { id: 'L05', type: 'extra', when: 'lua' }, // primer cadaver tras el rescate (Matis presente)
  { id: 'L06', type: 'extra', when: 'lua' }, // primera tienda tras el rescate (Malak presente)
  { id: 'L07', type: 'extra', when: 'lua' }, // Lua antes del primer jefe tras el rescate (se queda a la puerta)
  { id: 'L08', type: 'extra', when: 'lua' }, // Zaf y Lua a solas junto a la hoguera de la Capilla (area 'cap'; Zaf presente)
  // ---------- Extras ----------
  { id: 'X01', type: 'extra', when: 'bonfire' }, // primera hoguera donde descansan juntos (Cor y Malak presentes)
  { id: 'X02', type: 'extra', when: 'death' },   // primera muerte de un jugador con compania cerca (Zaf y Matis)
  { id: 'X03', type: 'extra', when: 'group' },   // primera vez que estan los cuatro juntos; el pensamiento solo sale al empezar a jugar en solitario
];

const TALKS = {
  // ======================= A: Zona 1 =======================
  A01: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['red', 'Este es el castillo del Conde. Voy delante.'],
      ['green', 'Claro. Yo voy detrás, que es donde se cobra.'],
      ['red', 'No todo es dinero.'],
      ['green', 'Todo es dinero. Lo que pasa es que a unos se les nota menos.'],
    ],
    solo: { red: 'Casa. Qué mal huele tu casa.', blue: 'El castillo está a oscuras. A mí eso me tranquiliza. Qué raro.', green: 'Un castillo lleno de almas. Mi sueño de feria.', purple: 'Tantos muertos sin que nadie lo diga. Empecemos.' },
  },
  A02: {
    pair: ['blue', 'purple'], needs: [],
    lines: [
      ['blue', 'Hay susurros entre las estanterías.'],
      ['purple', 'Libros que piden sangre. Los conozco: son como los vivos, pero más pesados.'],
      ['blue', '¿Los leemos?'],
      ['purple', 'Luego.'],
    ],
    solo: { red: 'Libros. Mi maestro decía que se aprende más callando.', blue: 'Aquí hasta el silencio susurra.', green: 'Cada página, una cuenta pendiente.', purple: 'Los libros también merecen su entierro.' },
  },
  A03: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['green', 'Una capilla. Aquí se pagaba con rezos, ¿no?'],
      ['purple', 'Aquí se pagaba con todo lo que no cabía fuera.'],
      ['green', 'Entonces tengo tarifa. Esto va a la cuenta.'],
    ],
    solo: { red: 'Aquí no se obedece a nadie. Se reza.', blue: 'Una vela. Me bastaría para un faro.', green: 'Aquí se paga con fe. Moneda mala.', purple: 'Una capilla. Siempre hay alguien a quien despedir.' },
  },
  A04: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['purple', 'Aquí abajo hay gente que no pidió nada.'],
      ['red', 'Gente que servía a mi castillo, quizá.'],
      ['purple', 'Con permiso, entonces.'],
      ['red', '¿Con permiso de quién?'],
    ],
    solo: { red: 'Aquí también servía la guardia.', blue: 'Oigo goteras. Cuentan días que no pasan.', green: 'Quien dejó aquí a la gente no tenía bolsillos.', purple: 'Con permiso. Paso despacio.' },
  },
  A05: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['blue', 'El tiempo suena distinto aquí. Más apretado.'],
      ['red', 'Adelante. No hay tiempo para estudiarlo.'],
      ['blue', 'Con calma. Precisamente por eso.'],
    ],
    solo: { red: 'Un reloj que no marca horas. Marca órdenes.', blue: 'El tiempo es una sierra con ruedas.', green: 'El tiempo es dinero. Este lo tiró.', purple: 'Aquí el tiempo no cura. Aplasta.' },
  },
  A06: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['red', 'Esa puerta cerraba el castillo. Me la conozco.'],
      ['green', 'Lo que cierra una puerta se paga cuando se abre.'],
      ['red', 'Es una orden: tú detrás.'],
      ['green', 'A la cuenta.'],
    ],
    solo: { red: 'Esa puerta cerrada, otra vez.', blue: 'Por aquí llegaban las órdenes del Conde.', green: 'Palacio. Lo que cuesta uno así.', purple: 'Un trono es una tumba con más público.' },
  },
  A07: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Un rey en una escalera. Mal sitio para reinar.'],
      ['purple', 'Esta escalera huele a rosas. Conozco ese olor.'],
      ['red', 'Hablemos con él.'],
    ],
    solo: { red: 'Un rey sin corona. Lo saludo como se debe.', blue: 'Todos esperan algo en este castillo.', green: 'Un rey con anillo. ¿Quién paga la escalera?', purple: 'Esto huele a ella. A la Reina.' },
  },
  A08: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['blue', 'No se oye ni un enemigo. Eso es raro.'],
      ['green', '¿Cuánto vale una calma así?'],
      ['blue', 'Lo que dure.'],
      ['green', 'Entonces, a aprovecharla.'],
    ],
    solo: { red: 'Calma. No me fío.', blue: 'Aquí se oye el cielo. Casi.', green: 'Un sitio sin enemigos. Sospechoso. Nadie regala calma.', purple: 'Aquí no hay muertos. Qué extraño es el silencio de la vida.' },
  },
  A09: {
    pair: ['blue', 'purple'], needs: [],
    lines: [
      ['blue', 'Aquí arriba hay viento de verdad.'],
      ['purple', 'Y una sola luz.'],
      ['blue', 'Antes eran dos.'],
      ['purple', 'Lo sé. Se nota en cómo se mueve la sombra.'],
    ],
    solo: { red: 'Desde aquí se ve el castillo entero. Qué pequeño.', blue: 'Una sola luz. Anoto el sitio.', green: 'Cielo gratis. Mi precio favorito.', purple: 'El viento aquí también carga nombres.' },
  },
  A10: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['blue', 'Más libros. Y más callados.'],
      ['red', '«Prohibido», dice la puerta.'],
      ['blue', 'Entonces, con calma.'],
      ['red', 'Adelante.'],
    ],
    solo: { red: 'Prohibido. Me acostumbré a obedecer eso.', blue: 'Aquí el silencio lo ha ordenado alguien.', green: 'Lo prohibido siempre vale más.', purple: 'Libros que callan. Son los peores.' },
  },
  A11: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'La corte de la Reina de Huesos. Con permiso.'],
      ['green', 'Mucho hueso. Poco precio.'],
      ['purple', 'Aquí cada hueso tuvo nombre.'],
      ['green', '...Vale. Sin cuentas.'],
    ],
    solo: { red: 'Más guardia caída.', blue: 'Aquí abajo suena distinto.', green: 'Huesos. No pagan, pero tampoco se quejan.', purple: 'Bajo el castillo, otro castillo de muertos.' },
  },
  A12: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'El musgo ha subido por todo. Hasta por el cable.'],
      ['green', 'Esto sí es un negocio: nadie va a reclamar nada.'],
      ['purple', 'Nadie, salvo ellos. Con permiso.'],
    ],
    solo: { red: 'Aquí abajo ni una bandera. Ni una sola orden.', blue: 'El musgo se come hasta la luz.', green: 'Moho, humedad y deudas. Mi oficina.', purple: 'El musgo abraza primero. Después, el resto.' },
  },
  A13: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['blue', 'Brasas por todos lados. Se ve hasta el fondo.'],
      ['green', '¿Y ese ruido de yunque?'],
      ['blue', 'Alguien trabaja ahí abajo. Nadie lo apaga nunca.'],
    ],
    solo: { red: 'Fuego sin guardia. Qué raro.', blue: 'El resplandor se ve desde arriba. ¿Quién lo mira?', green: 'Una forja. Aquí se paga en chispas.', purple: 'El fuego también da compañía.' },
  },
  A14: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['red', 'El camino de salida. Se acerca el final de esto.'],
      ['blue', 'Cada paso suena a ceniza.'],
      ['red', 'Adelante.'],
      ['blue', 'Con calma.'],
    ],
    solo: { red: 'Si hay salida, que sea hacia delante.', blue: 'Huele a brasa y a despedida.', green: 'Más abajo se cobra.', purple: 'Cada salida es otra entrada.' },
  },
  A15: { // grupo
    needs: [],
    lines: [
      ['red', 'La Gran Hoguera. Se oye arder desde lejos.'],
      ['green', 'Más grande que cualquier taberna.'],
      ['purple', 'Una hoguera así se hizo para despedir a alguien.'],
      ['blue', 'Calor y ceniza. Me quedo un rato.'],
    ],
    solo: { red: 'Hasta aquí, el castillo del Conde.', blue: 'Calor y ceniza. Anoto el sitio.', green: 'Más grande que cualquier taberna.', purple: 'Una hoguera así se hizo para despedir.' },
  },

  // ======================= A: Zona 2 =======================
  A16: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['red', 'El ascensor se mueve solo.'],
      ['green', 'Y baja más de lo que me gusta.'],
      ['red', 'Es una orden: sube.'],
      ['green', 'A la cuenta.'],
    ],
    solo: { red: 'Más abajo. Siempre más abajo.', blue: 'El techo se aleja. Qué silencio.', green: 'Ascensor, bajada, deuda. Todo cuadra.', purple: 'Voy al encuentro de quien me crió.' },
  },
  A17: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['red', 'Un patíbulo. Y una soga con dos lazos vacíos.'],
      ['blue', 'Alguien salvó a quien iba a colgar... o no llegó a hacerlo.'],
      ['red', 'Esto no huele a justicia.'],
      ['blue', 'Con calma. Primero miramos.'],
    ],
    lua: [['lua', 'Los lazos están vacíos. Eso nunca presagia nada bueno.']],
    solo: { red: 'Un patíbulo. Mi maestro decía que de aquí se salía siempre con alguien menos.', blue: 'Dos lazos vacíos. Alguien se salvó... o se fue.', green: 'Un patíbulo. Aquí se cobraba con la vida.', purple: 'Una horca sin ahorcados. Peor que con ellos.' },
    soloLua: 'Los lazos están vacíos. Eso nunca presagia nada bueno.',
  },
  A18: { // PERSONAJES.md marca CM, pero hablan Malak y Matis: pair segun las lineas. Exige a Malak.
    pair: ['green', 'purple'], needs: ['green'],
    lines: [
      ['green', 'Frascos. Cientos de frascos. Con nombres.'],
      ['purple', '¿Reconoces alguno?'],
      ['green', 'Todos. Son los de mi valle. Ciento cuarenta nombres.'],
    ],
    solo: { red: 'Estanterías de frascos hasta el techo. Esto es una despensa de algo.', blue: 'Cada frasco tiene una luz distinta.', green: 'Mi valle. Ahí está mi valle. Uno por uno.', purple: 'Frascos con nombre. Alguien llevó las cuentas con cariño.' },
  },
  A19: { // exige a Zaf. 'Compania' = Malak (pareja ZM)
    pair: ['blue', 'green'], needs: ['blue'],
    lines: [
      ['blue', 'Celdas con rejas verdes de óxido. Y una voz.'],
      ['green', '¿La conoces?'],
      ['blue', 'No puede ser. Esa voz se perdió en el mar.'],
    ],
    solo: { red: 'Celdas por todas partes. Esto es una cárcel.', blue: 'Esa voz... no puede ser. Se perdió en el mar.', green: 'Presos. Cada uno vale una cuenta.', purple: 'Una cárcel con la puerta abierta por dentro. Mala señal.' },
  },
  A20: { // exige a Zaf; Lua habla desde la celda
    pair: ['blue', 'green'], needs: ['blue'],
    lines: [
      ['lua', 'Qué tarde llegas. Estaba empezando a olvidar tu cara.'],
      ['blue', 'Lúa... Te di por ahogada.'],
      ['lua', 'Y yo creía que ya no volvías. Ven a abrir esto.'],
      ['blue', 'Voy a sacarte. No te vuelvo a perder.'],
    ],
    solo: { red: 'Una celda al fondo. Alguien espera.', blue: 'Lúa. Estás viva.', green: 'Una celda, una reja y un reencuentro. Esto no se paga.', purple: 'Que se abra esa celda cuanto antes.' },
  },
  A21: { // exige a Cor
    pair: ['red', 'purple'], needs: ['red'],
    lines: [
      ['red', 'Esas escaleras llevan a la capilla de mi cuartel.'],
      ['purple', '¿Y quién las guarda?'],
      ['red', 'Quien me enseñó a guardarlas.'],
    ],
    solo: { red: 'Mi maestro está aquí. Lo noto en cómo se sostiene el aire.', blue: 'Una sala grande con alguien dentro.', green: 'Escaleras guardadas. Siempre hay peaje.', purple: 'Se oye un himno cansado.' },
  },
  A22: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['purple', 'Aquí está. La Reina.'],
      ['red', '¿La conoces?'],
      ['purple', 'Me acogió de bebé. Y yo me quedé atrás.'],
    ],
    lua: [['lua', 'Hay gente viva aquí arriba. Empezaba a olvidar cómo se ve.']],
    solo: { red: 'Una capilla con hoguera y gente viva. Qué raro.', blue: 'Por fin, un techo con luz.', green: 'Una reina, un herrero y un mercader. Con algo de suerte, pagan bien.', purple: 'Ahí está quien me crió. Un paso por delante, como siempre.' },
    soloLua: 'Hay gente viva aquí arriba. Empezaba a olvidar cómo se ve.',
  },
  A23: { // grupo; la puerta de los Funcionarios ya se ha abierto con la llave
    needs: [],
    lines: [
      ['red', 'La puerta de los funcionarios. Abierta con la llave de mi maestro.'],
      ['purple', 'Aquí se firmaban los papeles. Todos.'],
      ['green', 'Todo se firma. Y todo se cobra.'],
      ['blue', 'Con calma. Aquí hay más cerrado que abierto.'],
    ],
    solo: { red: 'Lo que mi maestro guardó sin saber. Ahora lo sabremos.', blue: 'Papeles por todas partes. Cada uno, una decisión.', green: 'Un despacho. Mi sitio natural.', purple: 'Esta es la oficina donde se firmó mi caída.' },
  },
  A24: {
    pair: ['blue', 'purple'], needs: [],
    lines: [
      ['blue', 'Retratos tapados con telas negras. Todos.'],
      ['purple', 'Quien tapa los rostros esconde quién manda.'],
      ['blue', 'Luego miramos debajo.'],
      ['purple', 'Luego.'],
    ],
    lua: [['lua', '¿Quién tapa los retratos? Alguien con mucho que esconder.']],
    solo: { red: 'Retratos tapados. Alguien no quiere ser reconocido.', blue: 'Telas negras sobre cada rostro. Apunto el sitio.', green: 'Un pasillo tapado. Seguro que cobran por mirar.', purple: 'Tapar un rostro es no querer dar la cara.' },
    soloLua: '¿Quién tapa los retratos? Alguien con mucho que esconder.',
  },
  A25: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['red', 'Esto huele a final de tramo.'],
      ['green', 'Y a trampa. Hay hoguera, tienda y forja. Nadie regala tanto.'],
      ['red', 'Es una orden: nos preparamos.'],
      ['green', 'A la cuenta.'],
    ],
    lua: [['lua', 'Si esto es el último tramo, hace falta un buen latigazo.']],
    solo: { red: 'Preparar la guardia. Esto es el último tramo.', blue: 'Se oye un canto. Muy lejos... y muy cerca.', green: 'Todo lo que necesito, sin pedirlo. Mala señal.', purple: 'Una antesala. Antes de alguien importante.' },
    soloLua: 'Si esto es el último tramo, hace falta un buen latigazo.',
  },
  A26: { // grupo
    needs: [],
    lines: [
      ['blue', 'Es el canto. El mismo que oí en el mar.'],
      ['purple', 'Dos tronos. Un atril y un cadalso.'],
      ['red', 'Detrás de mí.'],
      ['green', 'Esto va a ser caro.'],
    ],
    solo: { red: 'Dos tronos. Me toca ir delante.', blue: 'El canto de aquella noche. Por fin sé de dónde venía.', green: 'Un atril y un cadalso. Qué mal gusto para una sala.', purple: 'Un cadalso. Conozco el sitio donde se despide a la gente.' },
  },

  // ======================= B: objetivos =======================
  B01: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['red', 'Primer jefe. Y ya sabemos cruzar abismos con {dash}.'],
      ['blue', 'Pero lloraba piedra. No debió llorar así.'],
      ['red', 'Adelante.'],
      ['blue', 'Con calma.'],
    ],
    solo: { red: 'Primer jefe caído. Que no se me suba a la cabeza.', blue: 'Cruzar abismos. Qué sensación más antigua.', green: 'Una habilidad nueva. Gratis. Sospechoso.', purple: 'Descansa. No te lo he quitado: te lo devuelvo.' },
  },
  B02: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'Rezaba al revés y le respondían con su propia voz.'],
      ['green', 'Y a mí me da el segundo salto. Un trato casi justo.'],
      ['purple', 'Con permiso, Obispo.'],
    ],
    solo: { red: 'Un salto extra. Más para mí que para él.', blue: 'Rezó hasta que le contestaron. Mal asunto.', green: 'Segundo salto. La próxima vez, antes de que me pidan nada.', purple: 'Dejó de rezar. Ya era hora.' },
  },
  B03: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'La Reina de Huesos. Tampoco bajó nadie a verla.'],
      ['green', 'Un sello de hueso. ¿Cuánto pagarán por esto?'],
      ['purple', 'Nada. Descansa, Reina.'],
    ],
    solo: { red: 'Una reina que nadie visitó.', blue: 'Los huesos sí dicen la verdad.', green: 'Un sello de hueso. A saber cuánto valdrá.', purple: 'Con permiso, Reina. Ya no estás de guardia.' },
  },
  B04: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['blue', 'Sin luz, no tenía armadura.'],
      ['green', '¿Y el salto de pared? ¿Cuánto cuesta uno?'],
      ['blue', 'Lo que cueste subir sin él.'],
    ],
    solo: { red: 'Se apagó la luz y cayó. Hay lecciones simples.', blue: 'Sin luz no tenía armadura.', green: 'Saltar por las paredes. Qué comodidad.', purple: 'El reloj paró. Por fin alguien descansa.' },
  },
  B05: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['red', 'Dos sellos rotos. La puerta del trono se abre.'],
      ['blue', 'Entre sus libros no había maldad. Había cansancio.'],
      ['red', 'Adelante.'],
      ['blue', 'Con calma.'],
    ],
    solo: { red: 'Dos sellos. Se acabó la espera.', blue: 'Sus libros dejaron de susurrar.', green: 'Qué pocas almas para tanto libro.', purple: 'Tinta y hueso. Nada se pierde del todo.' },
  },
  B06: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Se acabó el portero.'],
      ['purple', 'Lo dijo en su carta: quería que alguien lo detuviera.'],
      ['red', 'Y alguien lo hizo. No sé qué siento.'],
    ],
    solo: { red: 'Se acabó el portero.', blue: 'Quizá, al fin, alguien lo detuvo. Aquí estoy.', green: 'Doscientas almas. Más de lo que esperaba.', purple: 'Descansa, Conde. Aunque nadie lo merezca.' },
  },
  B07: { // cae Aurora o Vesper (el otro lo recoge y huye)
    pair: ['blue', 'purple'], needs: [],
    lines: [
      ['blue', 'Se lo ha llevado en brazos. No tenía fuerza ni para odiarnos.'],
      ['purple', 'Eso no es buena ni mala señal. Es una señal.'],
      ['blue', 'Luego lo pienso.'],
      ['purple', 'Luego.'],
    ],
    solo: { red: 'Dos hermanos. Yo también tuve a quien rendirme.', blue: 'Dos luces. Solo vi apagarse una.', green: 'Si fueran clientes, les vendería el mismo seguro.', purple: 'Uno guarda al otro. Eso lo entiendo.' },
  },
  B08: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['red', 'Guardaba las llaves y una orden vieja. Lo entiendo.'],
      ['green', 'Y yo me llevo el Pisotón. Esto va a la cuenta.'],
      ['red', 'Es una orden: respeto.'],
      ['green', 'A la cuenta.'],
    ],
    solo: { red: 'Obedecía una orden vieja. Como yo.', blue: 'No era enemigo. Era relevo.', green: 'Un pisotón. Qué barato salió.', purple: 'Duerme, Alcaide. Ya has esperado bastante.' },
  },
  B09: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['blue', 'Se acabó el musgo del corazón. La puerta oeste se abre.'],
      ['green', '¿Qué ves al otro lado?'],
      ['blue', 'Salida. Y mucha ceniza.'],
    ],
    solo: { red: 'Se terminó el musgo.', blue: 'Un corazón sin latido. Por fin.', green: 'Trescientas almas. Con eso hago caja.', purple: 'Que el musgo la cubra con cariño.' },
  },
  B10: { // Martillo Latente entregado al Herrero
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'El martillo late como un corazón. Y el Herrero también.'],
      ['green', 'Y se muda. Un cliente fijo menos.'],
      ['purple', 'Un taller nuevo más.'],
    ],
    solo: { red: 'Por fin, un taller como Dios manda.', blue: 'Hasta el martillo late.', green: 'Mejores poderes, mejores precios.', purple: 'Que el fuego también descanse a ratos.' },
  },
  B11: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['green', 'Mi arma dispara mejor. ¿Cuánto costó?'],
      ['blue', 'Nada. Quizá todo.'],
      ['green', 'Eso no es una respuesta.'],
      ['blue', 'Es la única que tengo.'],
    ],
    solo: { red: 'Más alcance. La guardia lo agradece.', blue: 'Mejor puntería. Con calma.', green: 'Más largo, más rápido, más cobro.', purple: 'Que pese menos lo que tenga que segar.' },
  },
  B12: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['red', 'Más filo. Era hora.'],
      ['blue', 'Hoy pesa distinto el arma.'],
      ['red', 'Pesa lo que debe.'],
      ['blue', 'Eso también lo apunto.'],
    ],
    solo: { red: 'Más filo. Por fin.', blue: 'El arma pesa distinto. Me gusta.', green: 'Más daño, más almas por golpe.', purple: 'Un poco más de filo. Un poco menos de dudas.' },
  },
  B13: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['green', 'Un corazón de sobra. Gratis.'],
      ['red', 'Nada es gratis en este castillo.'],
      ['green', 'Pues este lo parece.'],
    ],
    solo: { red: 'Un corazón más. Lo gasto con cabeza.', blue: 'Se oye distinto latir.', green: 'Corazón gratis. Y yo, sin bolsillo para llevármelo.', purple: 'Un corazón más para quien lo necesite.' },
  },
  B14: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Aquí está el anillo, Reina.'],
      ['purple', 'Dice que su escalera aún huele a sus rosas.'],
      ['red', '...No sé si decirle algo más.'],
      ['purple', 'Eso ya es mucho.'],
    ],
    lua: [['lua', 'Un anillo y un mensaje. En mi casa eso era una boda.']],
    solo: { red: 'Misión cumplida. Eso se siente bien.', blue: 'Un anillo y un mensaje. Basta.', green: 'Nunca entregué algo sin cobrar. Esto, quizá sí.', purple: 'Le dije que su corte no fue olvidada.' },
    soloLua: 'Un anillo y un mensaje. En mi casa eso era una boda.',
  },
  B15: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Descanso.'],
      ['purple', 'Con permiso, Capitán.'],
      ['red', 'Me mandó lejos esa noche. Lo hizo por mí.'],
      ['red', 'Y nos deja una llave para lo que él nunca pudo abrir.'],
    ],
    solo: { red: 'Descanso, maestro. Me salvó sin decirlo. Y nos deja una llave.', blue: 'Una llave con cuatro puntas. Alguien la sellaba desde abajo.', green: 'Una llave. Las llaves siempre valen más que lo que abren.', purple: 'Con permiso, Capitán. Seguiremos su puerta.' },
  },
  B16: { // Zaf + quien esté; Lua se une al grupo
    pair: ['blue'], needs: ['blue'],
    lines: [
      ['blue', 'Quien nos crió. Guardando tu celda con una lámpara negra.'],
      ['lua', 'Lo hizo por mí. Me lo dijo antes de caer.'],
      ['blue', 'No fue por mi culpa. Fue un cebo.'],
      ['lua', 'Nunca fue tuya. Vámonos.'],
    ],
    solo: { red: 'Una luz blanca donde había una negra. Algo se cierra.', blue: 'No fue por mi culpa. Fue un cebo. Y Lúa está viva.', green: 'Una familia entera pagó por esto. Lo conozco.', purple: 'Que quien os crió descanse.' },
  },
  B17: {
    pair: ['red', 'green'], needs: ['green'],
    lines: [
      ['green', 'Ciento cuarenta nombres. Uno por uno.'],
      ['red', '¿Los dejas ir?'],
      ['green', 'Los devuelvo. Era lo único que me quedaba por cobrar.'],
    ],
    lua: [['lua', 'Ciento cuarenta. Y tú te sabes todos los nombres. Eso es hacer cuentas bien.']],
    solo: { red: 'Un valle entero embotellado. Y ahora, libre.', blue: 'Ciento cuarenta luces que se van. Ninguna se apaga.', green: 'Se acabó la cuenta. Nunca más cobro por esto.', purple: 'Que cada frasco encuentre su camino.' },
    soloLua: 'Ciento cuarenta. Y tú te sabes todos los nombres. Eso es hacer cuentas bien.',
  },
  B18: {
    pair: ['green', 'purple'], needs: ['purple'],
    lines: [
      ['purple', 'Doy un nombre a cada persona del registro. Una por una.'],
      ['green', '¿Puedo ayudar?'],
      ['purple', 'Sí. Sin precio.'],
    ],
    solo: { red: 'Un traidor. Hay quien merece la espada.', blue: 'Ahora entiendo el cerco.', green: 'Se vendió barato.', purple: 'Ya tienen nombre. Falta el mío.' },
  },
  B19: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['red', 'Un filo más.'],
      ['blue', 'Y más largo.'],
      ['red', 'Lo necesitaremos.'],
    ],
    solo: { red: 'Más filo. Falta lo que viene.', blue: 'El arma responde mejor.', green: 'Más daño. Mi cuenta mejora.', purple: 'Un poco más de filo para lo que falta.' },
  },
  B20: { // PERSONAJES.md marca CM, pero hablan Cor y Matis (y Cadalso y Vigilia): pair segun las lineas
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['cadalso', 'Perdón.'],
      ['vigilia', 'Calla, tonto. Calla y deja que lo termine.'],
      ['red', 'Habló. Por fin una palabra.'],
      ['purple', 'Y no era para nosotros.'],
    ],
    solo: { red: 'Una sola palabra en siglos. Y fue una disculpa.', blue: 'Perdón. Lo dijo a quien canta, no a mí.', green: 'Tantos años sin hablar para decir eso.', purple: 'Quien pide perdón ya está medio perdonado.' },
  },
  B21: { // grupo; fin de la Parte 2
    needs: [],
    lines: [
      ['vigilia', 'Cuatro colmillos, maduros ya. Gracias por traerlos hasta abajo.'],
      ['blue', '¿Traerlos a quién?'],
      ['vigilia', 'A la Primera Sed. Vuestra sangre nunca fue del Conde. Es suya.'],
      ['purple', 'La marca de la palma. Es la misma en las cuatro manos.'],
      ['red', '...Bajamos.'],
    ],
    lua: [['lua', 'Eh, yo no tengo esa marca. Pero voy con vosotros igual.']],
    solo: { red: 'La sangre no era del Conde. Alguien nos espera abajo.', blue: 'Una Primera Sed. Una marca en la palma. Todo encaja y no encaja.', green: 'Entonces la deuda venía de más abajo. Voy a cobrarla.', purple: 'Mi marca en la palma. La de otras tres manos también.' },
    soloLua: 'Eh, yo no tengo esa marca. Pero voy con vosotros igual.',
  },

  // ======================= C: enemigos =======================
  C01: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['red', 'Soldados caídos. Débiles, pero muchos.'],
      ['green', 'Tres almas cada uno. Esto sí es negocio.'],
      ['red', 'Son personas.'],
      ['green', 'Fueron.'],
    ],
    solo: { red: 'Soldados caídos. Los conozco.', blue: 'Débiles. Muchos.', green: 'Tres almas cada uno. Haré cuentas.', purple: 'Con permiso. Será breve.' },
  },
  C02: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Armaduras vacías que aún obedecen. Las conozco.'],
      ['purple', 'Cuando brillen en azul, no se las puede golpear.'],
      ['red', 'Gracias. Esperaré.'],
    ],
    solo: { red: 'Armaduras vacías. Qué desperdicio.', blue: 'Cuando brillan en azul, no hay golpe que valga.', green: 'Hierro caro. Lástima que no se pueda vender.', purple: 'Una armadura sin dueño es una tumba andante.' },
  },
  C03: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['blue', 'Duermen en las bóvedas. Les molesta la luz.'],
      ['green', 'Enciende una antorcha con {act}.'],
      ['blue', 'Enciéndela tú. Yo veo bien.'],
    ],
    solo: { red: 'Bichos. Una antorcha y listo.', blue: 'La luz los espanta. Anotado.', green: 'Ahora no. Con la luz, ni un chillido.', purple: 'Los murciélagos nunca pidieron estar aquí.' },
  },
  C04: {
    pair: ['blue', 'purple'], needs: [],
    lines: [
      ['blue', 'Atraviesan muros. No ven a quien está bajo la luz.'],
      ['purple', 'Almas penitentes. Con permiso.'],
      ['blue', 'Luego les hablas. Primero la luz.'],
    ],
    solo: { red: 'Si no los miras, no te ven.', blue: 'Mira a la luz, no a sus ojos.', green: 'Fantasmas. Pagan mal.', purple: 'Almas penitentes. Algún día las enterraré.' },
  },
  C05: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['blue', 'Va y viene sin parar. Hay que aprender su compás.'],
      ['red', 'Adelante, entonces: marcha al ritmo.'],
      ['blue', 'Con calma. Primero cuento.'],
    ],
    solo: { red: 'Maquinaria. Hay que respetarla.', blue: 'Va y viene. Cuento los pasos.', green: 'No se mata. Se esquiva. Gratis.', purple: 'Una sierra con prisa. Yo no la tengo.' },
  },
  C06: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Armadura sin alma. Ningún arma le hace daño.'],
      ['purple', 'Entonces no se pelea. Se rodea.'],
      ['red', 'Es una orden. Y una excusa.'],
    ],
    solo: { red: 'Armadura sin alma. No se pelea.', blue: 'Invulnerable. Me lo apunto.', green: 'Imposible de cobrar. Pasemos de largo.', purple: 'Una guardia que no sabe que murió.' },
  },
  C07: { // elite Capitan de Armaduras (Corredor de Armaduras)
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['red', 'Ese yelmo... Es el del teniente de mi maestro.'],
      ['blue', '¿Y qué hace aquí?'],
      ['red', 'Heredó el título del Capitán. Y sigue vigilando.'],
    ],
    solo: { red: 'Ese yelmo... He visto ese yelmo.', blue: 'Un élite con nombre. Cuidado.', green: 'Sesenta almas y una Piel de piedra. Merece la pena.', purple: 'Un capitán. Recuerdo lo que es serlo.' },
  },
  C08: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'Dejan baba que frena.'],
      ['green', '¿Se vende la baba?'],
      ['purple', 'Se pisa. Y se paga.'],
    ],
    solo: { red: 'Baba que frena. No la piso.', blue: 'Se ve el rastro desde lejos.', green: 'Un negocio que se arrastra.', purple: 'Hasta el musgo tiene sus caminos.' },
  },
  C09: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['blue', 'Cuando se pone roja, va a disparar.'],
      ['green', '¿Cuánto vale esquivarla?'],
      ['blue', 'Una vida.'],
    ],
    solo: { red: 'Cuando se pone roja, a esquivar.', blue: 'Escupe espinas. Mejor desde lejos.', green: 'Qué bicho más mal educado.', purple: 'Una raíz con mal humor.' },
  },
  C10: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'Un preso que el musgo no dejó morir.'],
      ['green', 'Cae al suelo y se levanta con media vida. Qué trato más raro.'],
      ['purple', 'Con permiso. Y con fuego.'],
    ],
    solo: { red: 'Un preso que el musgo no soltó.', blue: 'Se levanta con la mitad de vida.', green: 'Dos veces para cobrar. Perfecto.', purple: 'El Reo 16 durmió sin miedo. Este no.' },
  },
  C11: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['green', 'Brasas por donde pasa. A distancia.'],
      ['red', 'Es una orden: nadie pisa las brasas.'],
      ['green', 'Para eso tengo flechas.'],
    ],
    solo: { red: 'Dejan brasas. No las piso.', blue: 'Veo el rastro desde lejos.', green: 'Brasas. No se pisan. Ni se cobran.', purple: 'El fuego también tiene sus babosas.' },
  },
  C12: {
    pair: ['blue', 'purple'], needs: [],
    lines: [
      ['blue', 'Sueltan esporas que persiguen despacio.'],
      ['purple', 'Y arden con el fuego.'],
      ['blue', 'Luego las quemamos.'],
      ['purple', 'Luego.'],
    ],
    solo: { red: 'Esporas. Mejor con fuego.', blue: 'Las esporas siguen despacio. Las cuento.', green: 'Esporas. Ni se venden ni se compran.', purple: 'Una polilla que huele a tierra mojada.' },
  },
  C13: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'Bailan a una música que no suena.'],
      ['green', '¿Se les paga la entrada?'],
      ['purple', 'Se les cierra los ojos.'],
    ],
    solo: { red: 'Bailan sin música. Qué inquietante.', blue: 'Una sombra que baila. Cuento los pasos.', green: 'Nobles sin sueldo.', purple: 'Conozco ese baile. Lo tocaban en la corte.' },
  },
  C14: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['blue', 'Escupe pétalos en abanico.'],
      ['green', 'Bonito, pero pincha.'],
      ['blue', 'Desde lejos.'],
    ],
    solo: { red: 'Pétalos que cortan. Esquivar.', blue: 'Escupe pétalos en abanico. Los veo venir.', green: 'Una flor que cobra.', purple: 'Una rosa con espinas. Como la Reina.' },
  },
  C15: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Mi guardia. En formación.'],
      ['purple', 'Se mueven por filas.'],
      ['red', 'Lo sé. Yo marché con ellas.'],
    ],
    solo: { red: 'La guardia en formación. Cuánto tiempo.', blue: 'Se mueven por filas. Hay un patrón.', green: 'Hierro caro y sin dueño.', purple: 'Una guardia obediente. Qué pena.' },
  },
  C16: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['blue', 'Arqueros en las almenas.'],
      ['red', 'A cubierto, entonces.'],
      ['blue', 'Con calma. Cuento los disparos.'],
    ],
    solo: { red: 'Arqueros en lo alto. A cubierto.', blue: 'Cuento los disparos. Hay pausas.', green: 'Competencia. Y con mejor puntería.', purple: 'Siguen vigilando muertos.' },
  },
  C17: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['blue', 'Una luz que persigue. Estalla al tocarte.'],
      ['green', '¿Y luego?'],
      ['blue', 'Luego no ves.'],
    ],
    solo: { red: 'Luces que explotan. Las evito.', blue: 'Un farolillo. Si estalla, pierdo mi visión.', green: 'Linterna con mal genio.', purple: 'Luces perdidas buscando a alguien.' },
  },
  C18: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'Salen del agua. Dejan agua negra.'],
      ['green', 'Pisarla frena.'],
      ['purple', 'Con permiso. Y con cuidado.'],
    ],
    solo: { red: 'Salen del agua. Cuidado con el charco.', blue: 'Pesados y lentos. Dejan charcos.', green: 'Gente mojada que no paga.', purple: 'Se ahogaron esperando la luz.' },
  },
  C19: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['green', 'Un frasco que vuela. Con un alma dentro.'],
      ['red', 'Si lo rompes, estalla.'],
      ['green', 'Lo sé. Es mi oficio.'],
    ],
    solo: { red: 'Frascos que vuelan. Qué mal asunto.', blue: 'Un frasco con luz dentro. Brilla distinto.', green: 'Un alma embotellada. Esto sí lo reconozco.', purple: 'Almas que no quieren estar ahí.' },
  },
  C20: {
    pair: ['red', 'green'], needs: [],
    lines: [
      ['green', 'Un cobrador. Viene a por mí.'],
      ['red', 'Roba almas.'],
      ['green', 'Me lo conozco. Se cobra primero y se pregunta luego.'],
    ],
    solo: { red: 'Un cobrador. Roba almas. Lo detengo.', blue: 'Persigue al más rico. Cuidado.', green: 'Cobrador. Mi vida, resumida.', purple: 'Quien cobra así suele deber más que nadie.' },
  },

  // ======================= D: lugares inalcanzables =======================
  D01: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['blue', 'Esa subida está lejos de cualquier salto nuestro.'],
      ['red', 'Habrá otra forma.'],
      ['blue', 'Sí. Cuando la Gárgola nos dé el Impulso. La apunto.'],
    ],
    solo: { red: 'Aquí falta algo. Volveré.', blue: 'Un salto más largo del que doy.', green: 'Fuera de mi alcance, por ahora.', purple: 'Mi gancho no llega. Volveré con algo mejor.' },
  },
  D02: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['green', 'Un cristal. Más alto de lo que se salta.'],
      ['blue', 'Hace falta un segundo aire.'],
      ['green', 'Lo apunto. Vuelvo con él.'],
    ],
    solo: { red: 'Un cristal fuera de alcance. Lo apunto.', blue: 'Hace falta un segundo aire.', green: 'Brillante, valioso, alto. Odio los tres.', purple: 'Más alto que mi salto. Esperaré.' },
  },
  D03: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Una reja cerrada. Los Calabozos están detrás.'],
      ['purple', 'Se abrirá. Todo se abre cuando cae quien reza.'],
      ['red', 'Volveremos.'],
    ],
    solo: { red: 'Reja cerrada. Se abrirá.', blue: 'Algo la abre. Luego.', green: 'Cerrado hoy, abierto mañana, pagado siempre.', purple: 'Detrás hay gente. Volveré.' },
  },
  D04: { // Malak no puede romper muros
    pair: ['red', 'green'], needs: [],
    lines: [
      ['green', 'Un muro agrietado. Rompedlo, que yo no puedo.'],
      ['red', 'Con gusto.'],
      ['green', 'Y lo que haya detrás, a medias.'],
    ],
    solo: { red: 'Detrás hay algo. Siempre hay algo detrás de lo que se esconde.', blue: 'Una grieta con sombra detrás. Se ve mejor que de día.', green: 'Una grieta. Y yo sin bomba que me abra el camino.', purple: 'A veces las paredes lloran antes que la gente.' },
  },
  D05: {
    pair: ['blue', 'purple'], needs: [],
    lines: [
      ['blue', 'Una puerta sin cerradura. Solo con el Reloj parado.'],
      ['purple', 'Luego.'],
      ['blue', 'Luego.'],
    ],
    solo: { red: 'Puerta cerrada. Otra orden pendiente.', blue: 'Sin cerradura. Hace falta otra cosa.', green: 'Algo valioso detrás. Seguro.', purple: 'Lo prohibido siempre acaba abierto.' },
  },
  D06: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['red', 'Dos sellos. Tinta y hueso.'],
      ['blue', 'Ahora no se abre. Alguien los guarda.'],
      ['red', 'Entonces, a por ellos. Adelante.'],
      ['blue', 'Con calma.'],
    ],
    solo: { red: 'Dos sellos. Me los apunto.', blue: 'Tinta y hueso. Bien guardada.', green: 'Una puerta cara de abrir.', purple: 'Aún no me toca.' },
  },
  D07: {
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'Una grieta cerrada. Algo respira detrás.'],
      ['green', '¿Algo con valor?'],
      ['purple', 'Lo veremos cuando se abra.'],
    ],
    solo: { red: 'Algo respira ahí detrás.', blue: 'Una grieta cerrada. Apunto el sitio.', green: 'Tengo ganas de saber qué hay.', purple: 'No es hora. Volveré.' },
  },
  D08: {
    pair: ['blue', 'green'], needs: [],
    lines: [
      ['blue', 'Esos pinchos son más largos que cualquier salto.'],
      ['green', '¿Y por debajo?'],
      ['blue', 'Hay un hueco. Habrá que ir por el aire.'],
    ],
    solo: { red: 'Pinchos. No hay forma de cruzar. Aún.', blue: 'Un hueco al final. Se ve, no se llega.', green: 'Un hueco con vistas. No hay forma de bajar con esto.', purple: 'Por el aire, quizá. Algún día.' },
  },
  D09: {
    pair: ['blue', 'purple'], needs: [],
    lines: [
      ['blue', 'La puerta del este sigue cerrada.'],
      ['purple', 'Se abrirá. Dicen que cuando uno de los dos cae.'],
      ['blue', 'Entonces, esperamos.'],
    ],
    solo: { red: 'La puerta al cielo. Cerrada.', blue: 'Una puerta que da al cielo. Apunto el sitio.', green: 'Cielo cerrado. Qué manía de cobrar.', purple: 'El cielo tiene su portero.' },
  },
  D10: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['blue', 'Hay una tapa de hierro en el suelo.'],
      ['red', 'Y un hueco debajo.'],
      ['blue', 'Algo lo sostiene. O lo guarda.'],
    ],
    solo: { red: 'Una tapa en el suelo. Hay algo debajo.', blue: 'Una tapa de hierro. Algo respira debajo.', green: 'Una tapa. Y yo con ganas de abrirla.', purple: 'Algo me llama desde abajo.' },
  },
  D11: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Una puerta con tres cerraduras y ninguna llave.'],
      ['purple', 'La llave la tiene alguien más.'],
      ['red', 'Mi maestro. Lo sé.'],
    ],
    solo: { red: 'Puerta cerrada con llave. La llave la tiene quien menos esperaba.', blue: 'Una puerta con cerradura de tres dientes. Apunto el sitio.', green: 'Cerrada con llave. Lo bueno siempre está cerrado.', purple: 'Aquí se guardaban los secretos.' },
  },
  D12: {
    pair: ['red', 'purple'], needs: [],
    lines: [
      ['red', 'Las escaleras a la capilla están selladas.'],
      ['purple', 'Se abrirán al caer quien las guarda.'],
      ['red', 'Es una orden. Y una cortesía.'],
    ],
    solo: { red: 'Escaleras selladas. Primero, mi maestro.', blue: 'Arriba hay luz de hoguera. Se ve por la rendija.', green: 'Escalera cerrada. Peaje de por medio.', purple: 'Arriba hay vida. Se oye.' },
  },
  D13: { // Malak no puede romper muros
    pair: ['red', 'green'], needs: [],
    lines: [
      ['green', 'Un muro agrietado, justo a la derecha de los pozos. Rompedlo, que yo no puedo.'],
      ['red', 'Con gusto.'],
      ['green', 'Y lo que haya detrás, a medias.'],
    ],
    solo: { red: 'Un muro agrietado. Detrás hay algo.', blue: 'Se oye algo grande al otro lado.', green: 'Una grieta. Y yo sin bomba. Maldita suerte.', purple: 'A veces las paredes lloran antes que la gente.' },
  },
  D14: {
    pair: ['red', 'blue'], needs: [],
    lines: [
      ['blue', 'Un saliente allí arriba. Con algo brillando.'],
      ['red', 'No hay forma de subir.'],
      ['blue', 'Hay una: planeando.'],
    ],
    solo: { red: 'Un saliente inalcanzable. Lo apunto.', blue: 'Algo brilla en lo alto. Solo se llega planeando.', green: 'Brilla y no llego. Mi maldición.', purple: 'Algo me llama desde arriba. Con las Alas, quizá.' },
  },
  D15: { // Malak no puede romper muros
    pair: ['green', 'purple'], needs: [],
    lines: [
      ['purple', 'Una grieta que llora en el muro.'],
      ['green', 'Yo no puedo romperlo.'],
      ['purple', 'Yo sí. Pero con cuidado.'],
    ],
    solo: { red: 'Un muro agrietado. Detrás hay algo.', blue: 'Sangre en el muro. Hay una sala detrás.', green: 'Una grieta. Necesito una bomba.', purple: 'Este muro guarda a alguien.' },
  },

  // ======================= L: Lua (solo desde que esta en el grupo; sin pensamientos en solitario) =======================
  // En L01, L02 y L07 'A' es cualquiera de los presentes (el motor elige quien responde).
  L01: { // primera hoguera tras el rescate
    needs: [],
    lines: [
      ['lua', '¿Esto es una hoguera de verdad? Hacía años que no tocaba una.'],
      ['A', 'Descansa un poco.'],
      ['lua', 'Prefiero mirar cómo arde.'],
    ],
  },
  L02: { // primer enemigo muerto por el latigo
    needs: [],
    lines: [
      ['lua', '¿Habéis visto eso? ¡Yo no tengo arco, tengo paciencia!'],
      ['A', 'Bien hecho.'],
      ['lua', 'Lo sé. Pero me gusta que lo digas.'],
    ],
  },
  L03: { // la primera vez que Cor da una orden a Lua (Cor presente; PERSONAJES: CM o CZ o CT)
    pair: ['red'], needs: ['red'],
    lines: [
      ['red', 'Lúa, detrás de mí.'],
      ['lua', '¿Quién manda aquí?'],
      ['red', 'Yo.'],
      ['lua', 'Qué mala suerte la tuya.'],
    ],
  },
  L04: { // primera sala oscura tras el rescate (Zaf)
    pair: ['blue'], needs: ['blue'],
    lines: [
      ['lua', 'No veo nada.'],
      ['blue', 'Yo sí. Agárrate a mi paso.'],
      ['lua', 'Como en el faro. Tú delante, yo detrás.'],
      ['blue', 'Nunca he dejado de ir delante.'],
    ],
  },
  L05: { // primer cadaver tras el rescate (Matis; PERSONAJES: MT, pero solo hablan Lua y Matis)
    pair: ['purple'], needs: ['purple'],
    lines: [
      ['lua', 'Estás hablando con un muerto.'],
      ['purple', 'Se llama cortesía.'],
      ['lua', 'Qué cosa tan rara y tan bonita.'],
    ],
  },
  L06: { // primera tienda tras el rescate (Malak; cualquier tienda)
    pair: ['green'], needs: ['green'],
    lines: [
      ['lua', '¿Cuánto cuesta una poción?'],
      ['green', 'Treinta. No vas a comprar nada.'],
      ['lua', 'Tú tampoco, y estás mirando.'],
      ['green', 'Es distinto. Estoy valorando.'],
    ],
  },
  L07: { // antes del primer jefe tras el rescate (se queda a la puerta)
    needs: [],
    lines: [
      ['lua', 'Yo os espero aquí. Con el látigo guardado.'],
      ['A', 'Es lo mejor.'],
      ['lua', 'Por una vez, no discutiré.'],
    ],
  },
  L08: { // primera vez que hablan a solas tras el rescate, junto a la hoguera de la Capilla (Zaf)
    pair: ['blue'], needs: ['blue'],
    lines: [
      ['blue', 'Quiero decirte algo. Sobre aquella noche.'],
      ['lua', 'Lo sé. Quien nos crió me lo contó antes de caer.'],
      ['blue', '¿Qué te contó?'],
      ['lua', 'Que lo hizo por mí. Y que tú no tuviste la culpa.'],
    ],
  },

  // ======================= X: extras =======================
  X01: { // primera hoguera donde descansan juntos
    pair: ['red', 'green'], needs: [],
    lines: [
      ['green', '¿Qué se siente al curarte con cada golpe?'],
      ['red', 'Que alguien paga la cuenta. No me gusta.'],
      ['green', 'A mí me gustaría que alguien pagara la mía.'],
    ],
    solo: { red: 'Descanso. Esa palabra la tenía olvidada.', blue: 'Una llama pequeña. Me hubiera valido de faro.', green: 'Una hoguera, una sopa, y esto sería casi una taberna.', purple: 'Una hoguera por los que no la tuvieron.' },
  },
  X02: { // primera muerte de un jugador con compania cerca (Zaf y Matis)
    pair: ['blue', 'purple'], needs: [],
    lines: [['purple', 'Respira. Vuelvo.']],           // si cae Zaf
    alt: [['blue', 'Aguanta. Aún no he visto lo que ibas a decir.']], // si cae Matis
    solo: { red: '¿Ya? Me levanto. Pero me levanto.', blue: 'Me apagué. Encenderé de nuevo.', green: 'Eso me va a costar caro. Y no tengo con qué.', purple: 'Me toca estar de este lado un momento. Vuelvo enseguida.' },
  },
  X03: { // grupo: los cuatro juntos; el pensamiento sale al empezar a jugar en solitario
    needs: [],
    lines: [
      ['red', 'Pues ya estamos.'],
      ['green', '¿Quién dijo que viniéramos juntos?'],
      ['blue', 'La sangre. Nos llamó a todos.'],
      ['purple', 'Entonces, juntos. Sin prisa.'],
    ],
    solo: { red: 'Cuatro personas, dijo el Conde. ¿Dónde estarán las otras?', blue: 'Siento a otras tres. Lejos. Me hace compañía.', green: 'Tres más como yo. Espero que se les dé mejor el negocio.', purple: 'Hay otros. Los noto como pasos detrás de mí.' },
  },
};

// Variantes genericas (PERSONAJES 5.1): 'A' y 'B' son los dos presentes elegidos (se usan sus nombres).
// lua: comentarios genericos de Lua (PERSONAJES 5.2) cuando el evento no tiene uno propio.
const TALK_GENERIC = {
  area: [{ lines: [['A', 'Territorio nuevo.'], ['B', 'Pues a conocerlo.']] }],
  boss: [{ lines: [['A', 'Una cosa menos.'], ['B', 'Y las que quedan.']] }],
  enemy: [{ lines: [['A', 'Eso no lo había visto.'], ['B', 'Mejor tenerlo a distancia.']] }],
  spot: [{ lines: [['A', 'Aquí falta algo.'], ['B', 'Lo apunto y volvemos.']] }],
  lua: {
    area: [['lua', '¿Esto es un camino o una trampa? Siempre me confundo.']],
    boss: [['lua', '¡Eso ha sido bonito! Hacedlo otra vez.']],
    enemy: [['lua', 'Ese me lo quedo yo. Mi látigo tiene hambre.']],
    spot: [['lua', 'Si no se llega, se llega. Apuntadlo.']],
  },
};

if (typeof module !== 'undefined') module.exports = { TALK_TRIGGERS, TALKS, TALK_GENERIC };
