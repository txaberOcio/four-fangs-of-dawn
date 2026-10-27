# Los cuatro colmillos: personajes, relaciones, Zona 2 y diálogos

*Propuesta revisada el 27/10/2026 con todas las decisiones de Txaber, incluido su mapa de la Zona 2. Nada de esto es canon hasta el visto bueno final. No se ha tocado el código. La guía técnica para quien programe está en [ZONA2.md](ZONA2.md).*

Cómo leer este documento:

- **[CANON]**: ya está en el juego (comprobado en el código o en `docs/ZONA1.md`).
- **[PROPUESTA]**: invento mío, pendiente de aprobar.
- **[DECIDIDO]**: lo ha decidido Txaber.
- **Parte 1 = Zona 1** (el castillo, mapa actual), **Parte 2 = Zona 2** (debajo de La Gran Hoguera), **Parte 3 = Zona 3** (por diseñar). Uso los dos nombres según el contexto.
- Los textos van en frases de una o dos líneas (160 letras como máximo) y con `{act}`, `{dash}` y `{down}` donde hace falta la tecla.
- **Regla de redacción:** ningún texto marca el género de los cuatro vampiros ni de Lúa (nada de «listo», «cansada», «sola», «hijo», «hermano»...). Se usan nombres, «quien» y construcciones neutras. Los textos que ya existen en el juego y marcan género están en la sección 10.2.

---

## 0. Lo que el juego ya cuenta [CANON]

Comprobado en `public/art.js`, `public/extras.js`, `public/world.js`, `public/game.js`, `README.md` y los diarios:

| Color | Nombre actual en el código | Arma | Pasiva | Desventaja |
|---|---|---|---|---|
| Rojo | Vampiro carmesí | Espada (equilibrada) | Sed de sangre: se cura al golpear (40 %) | Ninguna |
| Azul | Vampiro azul | Lanza (largo alcance) | Visión nocturna | Más daño de proyectiles; algo más lento |
| Verde | Vampira esmeralda | Arco | Cazadora de almas: +50 % de almas | +50 % de daño recibido; flechas que no empujan ni curan; no rompe muros (necesita Bombas) |
| Morado | Vampira violeta | Guadaña (lenta y muy dañina) | Piel de sombra: +2 corazones | Más lento; gancho automático al borde si el salto se queda corto |

Más cosas que ya existen y que esta propuesta respeta:

- **No hay nombre propio ni pasado** en el código. Los nombres de abajo son propuesta.
- **«Cuatro cazadores vendrán, con mi misma sangre y mi misma sed»** (`PAGES.pasR`, Última carta del Conde) y «Quizá, al fin, alguien me detenga».
- **De 1 a 4 jugadores** (`MAX_PLAYERS = 4` en `server/index.js:17`, «Sala llena (máx. 4)»; el README dice «hasta tres amigos más»). Cada vampiro tiene **su propia partida guardada**.
- **La Zona 1 es todo el mapa actual**, hasta La Gran Hoguera, a la que se llega **cayendo** desde la Antesala del Abismo (también desde la Forja de los Elementos). El Rey Destronado dice que la Reina Isolda está «más allá de La Gran Hoguera» (la Zona 2).
- **Aurora y Vesper, comprobado en el código:**
  - Son **jefes de la Parte 1**, etapa 5 de `docs/ZONA1.md`. Aurora está en `albaA` y Vesper en `albaB`, en las Torres del Alba (`world.js:100-101`). Tienen 34 de vida cada uno (`world.js:28, 32`).
  - **Solo se puede vencer a uno:** al caer, el otro «acude, lo recoge y huye» (`albaScene`, `game.js:429`). El que sobrevive aparece como PNJ en la Cumbre del Alba (`rivalA`, `rivalV`).
  - Aurora ataca con abanico, picado, rayos y barrido; Vesper con embestida, emboscada, pilares y salto (`game.js:994-995`). Premios: Alas del Alba y Ojo de la Noche.
  - Lo que el juego dice de ellos: «hermanos rivales», «Dama del Alba» y «Señor del Ocaso», **señores del Conde** (`BESTIARY`; carta del Conde: «mis señores del alba»), comparten emblema («media luna y medio sol»), «el alba y el ocaso no se pueden separar. Eso fue lo que olvidamos», el Alcaide guarda las llaves «hasta que los hermanos vuelvan juntos», y el Oráculo: «algún día volveréis a verlos... en otras torres».
- Otras pistas que aprovecho: Diario del Capitán (`PAGES.corr`), Diario del Vigía («antes eran dos luces»), Carta sin firmar, Registro de Reos, el Mercader («Almas, almas...»), el Rey Destronado («la escalera aún huele a sus rosas»; el Conde «abrió las puertas a los hermanos del Alba»), el Herrero y el élite **Capitán de Armaduras**.

---

## 1. Premisa común [PROPUESTA]

**Resumen en una línea:** las cuatro personas son **descendientes de la Primera Sed**, el origen de toda la sangre vampírica del juego. Nacieron en épocas distintas, las dejaron de bebés en cuatro puertas distintas y crecieron queriendo a quien las crió. Una tragedia preparada les quitó todo y un siervo del Conde les dio de beber la sangre que las despertó. Ahora la Primera Sed las llama a todas a la vez, porque están maduras.

### 1.1 La historia, de atrás hacia delante

1. **Al principio** había una sola cosa: **Anhelia, la Primera Sed** (sección 2.7). Fue el Alba entera: una voz que levantaba el sol cada mañana. El precio de aquel canto era beberse un poco de noche cada día, hasta que la sed no tuvo fondo.
2. **Para sobrevivir se partió.** Su **canto** se dividió en dos voces, el alba y el ocaso, que hoy son **Aurora y Vesper**, los hermanos del Alba (por eso «no se pueden separar»). Su **mordisco** se dividió en cuatro colmillos, que son **las cuatro personas protagonistas**.
3. **Los cuatro colmillos se esconden para madurar.** Cada uno nace en una época distinta, marcado con un colmillo dibujado en la palma, y aparece de bebé ante una puerta: un cuartel, un faro, una casa de cazadores y un palacio. Cada uno es criado por quien lo encuentra y se encariña con esa gente.
4. **La maduración es el dolor.** Para que el colmillo madure hay que perderlo todo. Los **Regentes de la Hondura** (sección 2.6), que mandan por debajo de los hermanos del Alba y encima del Conde, preparan cada pérdida: una orden de cerrar las puertas, un naufragio, un trato de almas, el cerco de un palacio.
5. **El Conde** (sección 2.9), el primer mortal al que Anhelia mordió, la sirve de portero del castillo. Cuando un colmillo está al borde de la muerte, sus siervos lo encuentran y le dan de beber **la sangre del Conde, que en realidad es la de ella**. Así despierta.
6. **Ahora** los cuatro colmillos están maduros. El canto de Vigilia, amplificado por las lámparas de la Hondura, los llamó la misma noche al castillo. Llegan creyendo que vienen a ajustar cuentas con el Conde. Vienen, sin saberlo, a la mesa de Anhelia.

### 1.2 Cómo encaja con la carta del Conde [PROPUESTA]

La carta dice: «Cuatro cazadores vendrán, con **mi misma sangre y mi misma sed**.» Se reinterpreta, sin cambiar una palabra: el Conde bebió de Anhelia, igual que los cuatro, así que comparten **la misma sangre** (la de ella) y **la misma sed**. No son sus hijos: el Conde es un siervo, no su familia. «Quizá, al fin, alguien me detenga» pasa a leerse como «quizá alguien rompa esta cadena de cebos». El Conde sospecha lo que son los cuatro y no puede decirlo.

### 1.3 Con 1 a 4 jugadores [PROPUESTA]

El juego admite de 1 a 4 jugadores. La historia no cambia: **siempre son cuatro colmillos**. Los que no están en la partida «siguen en camino» (los pensamientos X03 lo recogen). La Zona 2 se puede completar con cualquier número de jugadores: cada tramo del mapa tiene sus escenas para su vampiro, pero **nadie queda bloqueado** si ese vampiro no está.

### 1.4 Los «cuatro colmillos» y las pasivas [DECIDIDO + reencuadre PROPUESTA]

Siguen siendo los propios vampiros, sin reliquias. **Cada uno lleva un colmillo de Anhelia con un poder** (que ya está en el juego como pasiva):

| Vampiro | Colmillo | Pasiva actual [CANON] |
|---|---|---|
| Cor | de la **sangre** | Sed de sangre |
| Zaf | de la **noche** | Visión nocturna |
| Malak | de las **almas** | Cazadora de almas |
| Matis | de la **sombra** | Piel de sombra |

Las mejoras de estadística de la Zona 2 (4.7) son **su colmillo despertando**, y cada una está ligada a un hito de la historia de su dueño. Es lo que Anhelia quiere: que despierten del todo.

**Por qué cooperan:** el castillo está hecho para quien va sin compañía y cada colmillo suple a los otros: muros que rompen tres y no Malak, oscuridad que ve Zaf, saltos que alcanza Matis con el gancho.

---

## 2. Los personajes [PROPUESTA]

Sin apodos. Los nombres (Cor, Zaf, Malak, Matis) valen para cualquier género. **Reparto confirmado: Cor = Carmesí, Zaf = Azul, Malak = Esmeralda, Matis = Violeta.**

### 2.1 Cor (Carmesí) · colmillo de la sangre

- **Arma y carácter:** espada equilibrada; se cura con sangre ajena. Va delante y da órdenes sin que se las pidan. Educación de cuartel, orgullo contenido, humor seco que aparece cuando hay miedo.
- **De dónde viene:** apareció de bebé, con una marca en la palma, en la puerta del cuartel de la guardia del castillo, y se crió allí a cargo del Capitán, su **maestro**. La noche en que el Conde cerró las puertas, Cor estaba fuera de permiso y volvió a una muralla muda. Murió ante las puertas intentando entrar. Un siervo del Conde le dio de beber.
- **Qué lo motiva:** la culpa de no haber estado. Quiere dar «la orden que nunca llegó» para que la guardia descanse. Dice que quiere venganza; en realidad quiere permiso para dejar de vigilar.
- **Qué descubrirá:** que el Capitán lo mandó lejos **a propósito**, y que la orden de cerrar las puertas llevaba un tercer sello que no era del Alba (4.5).
- **Su hito en la Zona 2:** vencer al **Capitán de Hierro**, que da la llave de los Funcionarios. Mejora: Sed de sangre.
- **Qué teme:** que su maestro no lo reconozca, o que lo reconozca y pregunte dónde estaba.

### 2.2 Zaf (Azul) · colmillo de la noche [HISTORIA REESCRITA]

- **Arma y carácter:** lanza larga, paso tranquilo, ve en la oscuridad. Observa antes de actuar, hace preguntas incómodas y prefiere llegar tarde a llegar mal. Humor amable y lento.
- **De dónde viene:** apareció de bebé, con una marca en la palma, en el faro de una costa. Lo crió **quien guardaba el faro** junto a su propia cría, **Lúa**, menor que Zaf: crecieron como familia. Zaf se hizo vigía como quien lo crió: mirar el horizonte cada noche y encender la lámpara.
- **La noche del temporal:** las «dos luces» del cielo (alba y ocaso) se apagaron, la lámpara del faro **no quiso encenderse** y la flota se perdió. **Lúa había salido en un bote a guiar a los barcos de vuelta** y no regresó. Zaf se tiró al mar a buscarla y se ahogó. Un siervo del Conde lo sacó del agua y le dio de beber.
- **Lo que Zaf cree:** que **Lúa murió ahogada por su culpa** (la lámpara no se encendió) y que alguien apagó las luces.
- **Lo que es verdad:** la lámpara no se encendía porque **un canto la ahogaba** (el de Vigilia, amplificado por una lámpara negra). Aquella noche fue un **cebo**. A Lúa **no la ahogaron**: la recogieron los Cobradores de la Hondura y la guardaron como **garantía**. Y quien lo permitió fue **quien criaba a Zaf**: encendió la lámpara negra a cambio de la vida de Lúa, y desde entonces es **el Último Farero**, carcelero de la Milla Verde, que custodia la celda de su propia cría.
- **Qué lo motiva:** saber quién apagó las luces. Cuando encuentra a Lúa, quiere **no volver a perderla**.
- **Qué teme:** que la respuesta sea que fue por su culpa. Y, después, tener que enfrentarse a quien lo crió.
- **Su hito en la Zona 2:** vencer al Último Farero y **liberar a Lúa** (4.4). Mejora: Visión nocturna.

### 2.3 Malak (Esmeralda) · colmillo de las almas [MOTIVACIÓN NUEVA]

- **Arma y carácter:** arco; flechas que no empujan. Frágil (+50 % de daño recibido), rápido de lengua, con las cuentas al día: almas, deudas, favores. Detrás de las bromas hay prisa y una lista de nombres.
- **De dónde viene:** apareció de bebé, con una marca en la palma, ante una casa de cazadores de un **valle de bosques cerrados**, y se crió con esa gente. Cuando las fiebres llegaron al valle, **un agente del Mercado** ofreció salvar a toda la población: «guardaría sus almas hasta que pasara la plaga». Hacía falta una persona que firmara como **garante**. Firmó Malak. La gente del valle murió, sus almas se guardaron en frascos y Malak murió poco después. Un siervo del Conde le dio de beber.
- **Lo que Malak cree:** que debe **ciento cuarenta almas**: las de todo su valle. Las guarda un mercado que las devolverá cuando la deuda se pague. **Malak se sabe todos los nombres de memoria** y cobra almas sin parar para recomprarlos. Por eso su pasión por las almas es una **promesa**, no codicia. Es lo que hay detrás de «Cuentaalmas».
- **Lo que es verdad:** la deuda es **falsa y manipulada**: el recibo lleva un sello de cuatro puntas. Las almas del valle no están guardadas para devolverlas: **alimentan las lámparas de la Hondura**. El «agente del Mercado» es el **Mercader** de la Zona 1, que lleva siglos cobrando.
- **Qué la motiva:** devolver el valle. Quiere **abrir la Gran Conserva** y dejar ir a cada nombre.
- **Qué teme:** que las almas ya se hayan gastado y que su deuda no sirviera de nada.
- **Su hito en la Zona 2:** vencer a **La Subastadora** en la Conservera Mayor (el secreto de la Despensa) y liberar el valle (4.3). Mejora: Cazadora de almas. Al ser una sala secreta que exige romper un muro, es **un reto en equipo** (Malak no rompe muros: necesita Bombas o ayuda).
- **En el juego:** gana más almas. No rompe muros.

### 2.4 Matis (Violeta) · colmillo de la sombra

- **Arma y carácter:** guadaña lenta, +2 corazones, gancho automático al borde. Serenidad, paciencia, no se le escapa nada. Habla poco y lo que dice se queda. Humor negro suave, sobre todo con los muertos, a los que trata como vecindario.
- **De dónde viene:** apareció de bebé, con una marca en la palma, ante la puerta del jardín de la corte del Rey. **La Reina Isolda lo acogió** y creció a su sombra: su oficio, ir un paso por detrás de la Reina, en silencio, hasta ser su escolta personal. La noche en que se abrieron las puertas, Isolda huyó y Matis se quedó para cubrirle la retirada. Murió defendiendo un pasillo y un siervo del Conde le dio de beber. Al salir, la corte entera estaba enterrada sin nombre.
- **Qué lo motiva:** dar nombre y descanso a los muertos de la corte y encontrar a Isolda. Lo mueve el duelo más que la rabia.
- **Qué descubrirá:** que el «cerco» fue una traición desde dentro, ordenada desde abajo (4.6).
- **Su hito en la Zona 2:** reencontrar a Isolda en la Capilla y vencer al **Chambelán Sin Rostro** en las Dependencias de los Funcionarios. Mejora: Piel de sombra (velocidad).
- **Qué teme:** haber huido en realidad, y que Isolda lo sepa.

### 2.5 Lúa, compañía permanente desde la Milla Verde [DECIDIDO + reglas PROPUESTA]

- **Quién es:** **la cría de quien guardaba el faro**, de la misma casa que Zaf, menor en edad. Se crió entre redes, olas y lámparas. Curiosa, mordaz, valiente sin darle importancia, con un humor que desarma. Pasó años en una celda sin perder las ganas de contestar. **No** lleva la marca de colmillo: es humana por crianza, no descendiente de la Primera Sed.
- **Qué sabe:** que la recogieron los Cobradores tras el naufragio. Al principio cree que Zaf la dio por muerta y no la buscó; luego entiende que no lo supo. Sabe que quien las crió «encendió una luz negra para que yo viviera».
- **Cómo lucha:** con un **látigo de cuero y hueso**. Dice que no tiene arco, que tiene paciencia.
- **Qué le pasa al final:** acompaña al grupo hasta el final del juego. Su final concreto queda por decidir (sección 10.3).
- **Reglas de juego:** en [ZONA2.md](ZONA2.md), sección 8. Resumen: sigue al grupo, no puede morir, mata con el látigo a enemigos débiles cercanos (no élites, no jefes, no invulnerables) y espera fuera de las salas de jefe.
- **Hueco para sus comentarios:** cada charla tiene un campo opcional `lua`. Aparece solo si Lúa ya está con el grupo. Todo evento nuevo para las zonas 3 en adelante debe llevarlo.

### 2.6 Los Regentes de la Hondura: Vigilia y Cadalso (jefes finales de la Parte 2) [PROPUESTA]

Quienes mandan **por debajo de los hermanos del Alba y por encima del Conde**, en nombre de Anhelia. Los hermanos del Alba creen que los Regentes hablan con la voz del alba. No saben para quién cantan. Son los autores de todas las «tragedias de maduración» de la Zona 2.

**Su relación.** Eran **cantora y verdugo de una corte muy anterior al Rey**. A Vigilia la condenaron a la horca por una canción que hizo llorar a un tirano; Cadalso, el verdugo, se negó a ahorcarla. Anhelia los encontró en el cadalso: les ofreció una segunda vida si la servían. **Cadalso aceptó para salvar a Vigilia y pagó con su lengua**, que Anhelia guarda en un relicario. Desde entonces **Vigilia canta y Cadalso cobra**. Ella le tiene resentimiento por haberla salvado a ese precio y, a la vez, lo quiere. Él la protege sin decir nada. Se necesitan. **El Patíbulo Exterior**, la primera parte de la Zona 2, es el viejo cadalso donde Anhelia los encontró.

**Por qué sirven y temen a Anhelia.** Ella guarda la lengua de Cadalso y la **última nota** de Vigilia. Les prometió devolver ambas cuando los cuatro colmillos maduren. Ambos saben que **Anhelia devora a quienes le fallan** y que, cuando termine con los colmillos, ya no los necesitará.

#### Vigilia, la Cantora de la Hondura

- **Aspecto:** alta y fina como un cirio apagado, con un vestido de luto cuyos volantes se parecen a una partitura. Lleva la **boca cerrada con puntadas de plata** que se rompen cuando canta, y un collar de tubos de órgano que silban al respirar. Su cabello son cuerdas de arpa. Flota en un atril.
- **Origen:** cantora condenada, ahora la **voz** de la Primera Sed: su canto es el que llamó a los cuatro colmillos y el que ahogó las dos luces la noche del naufragio de Zaf.
- **Personalidad:** refinada, cruel con amabilidad, irónica; habla en **pareados breves**. Debajo está cansada de cantar lo que no quiere.
- **Motivación:** cumplir su parte para que Anhelia libere a Cadalso. Cree que entregar los cuatro colmillos maduros es el único precio.
- **Frases (para el combate y las escenas):**
  - «Cuatro notas, cuatro colmillos: afinadlos, que ya es de noche.»
  - «Cada pérdida fue un compás; os hacía falta aprender la canción.»
  - «¿Llegáis cansados? Yo llevo siglos cantando de pie.»
  - «Perdonad la letra: la música no es mía.»
  - Al caer: «Cuatro colmillos, maduros ya. Gracias por traerlos hasta abajo.»
- **Patrón de combate (combate 2):** en [ZONA2.md](ZONA2.md), sección 5.1.

#### Cadalso, el Verdugo Mudo

- **Aspecto:** gigante envuelto en cadenas, con un capuz de cuero de una sola ranura. Un hacha de verdugo de dos hojas. Donde debería estar la boca hay un hueco cosido. En el cinto cuelga un **candado sin llave** y un relicario vacío, el sitio donde guardaba su lengua.
- **Origen:** verdugo de la misma corte que Vigilia. Se negó a ejecutarla y aceptó servir a Anhelia a cambio de su vida.
- **Personalidad:** leal, paciente, de pocos gestos. No habla: gruñe, golpea y escribe una sola palabra a veces en el suelo con la punta del hacha.
- **Motivación:** proteger a Vigilia. Cada golpe a los colmillos le pesa, pero cumple.
- **Frases:** casi no tiene. Solo un **«Cobro.»** que Vigilia traduce al empezar y, al caer, su primera palabra en siglos: **«Perdón.»**
- **Patrón de combate (combate 1):** en [ZONA2.md](ZONA2.md), sección 5.1.

#### Arena: el Salón de los Dos Tronos

Un salón largo con **dos tronos**: a la izquierda, el **Trono-Atril**, una tribuna alta con tubos de órgano donde canta Vigilia; a la derecha, el **Trono-Cadalso**, un patíbulo con una trampilla. Entre ambos, un suelo de losas negras con tres trampillas. Detalle técnico: ZONA2.md, 4.4 y 5.1.

### 2.7 Anhelia, la Primera Sed (jefa final de la Parte 3) [PROPUESTA]

- **Aspecto:** una figura enorme envuelta en un vestido de raíces de sangre seca. **No tiene ojos.** Su boca no se cierra y en ella hay **cuatro huecos sangrantes** donde estuvieron sus colmillos (hoy están en los cuatro protagonistas). Su sombra tiene forma de **copa**. Su voz suena como un amanecer que se rompe.
- **Origen:** fue el **Alba entera**. Una voz que cada mañana levantaba el sol en un mundo sin sol. Cada día pagaba bebiendo un poco de noche. La sed no tuvo fondo. Para no morir de ella **se partió**: su canto en dos voces (**Aurora, el alba, y Vesper, el ocaso**) y su mordisco en **cuatro colmillos** (los cuatro protagonistas). Lo que quedó de ella, sin voz y sin colmillos, bajó a la Hondura.
- **Qué quiere de verdad:** parece querer **reunirse**: recoger sus cuatro colmillos maduros y sus dos voces para volver a ser el Alba entera, y acabar con la sed bebiéndolos. Por debajo, **quiere ser detenida**: lleva siglos esperando que uno de sus colmillos sea lo bastante fuerte como para tomarle la sed. Quiere las dos cosas y no puede decidirse. Por eso crió cuatro, no uno.
- **Poder:** la **sangre madre**. Todo el que lleva su sangre (el Conde, los Regentes, los cuatro) siente su llamada. Con la **Primera Nota** puede obligar a obedecer a quien la lleve. Los colmillos resisten porque su sangre está partida. En la lucha final (por diseñar), cada colmillo se enfrentará a **su propio poder torcido**: ella cura bebiendo, ve en la oscuridad sin ojos, roba almas y hace sombra de la sombra.
- **Por qué domina a los Regentes:** porque guarda la lengua de Cadalso y la última nota de Vigilia, y porque quien le falla acaba bebido.
- **Conexión con el Conde:** fue el primer mortal al que mordió y lo dejó de **portero** del castillo con su sangre. Por eso él escribe «mi misma sangre y mi misma sed».
- **Conexión con los hermanos del Alba:** son **su canto partido**. Gobiernan la superficie creyendo que sirven al alba. Por eso «no se pueden separar», y por eso el Alcaide guarda las llaves «hasta que los hermanos vuelvan juntos»: la orden la dio ella.
- **Conexión con la Parte 1:** casi todo lo que hay en el castillo es una pieza del cebo. Las armaduras, el cerco, las lámparas, las almas... fueron hechas para criar colmillos.
- **Voz (frases):** «Venid, mis cuatro. Os he esperado tantos siglos que ya no sé si quería abrazaros o beberos.» · «Todo lo que perdisteis, lo perdisteis para llegar maduros.» · «No me odiéis: tampoco yo elegí tener sed.» · «Alguno de vosotros tendrá que quitármela. Elegid bien.»
- **Qué se revela cuándo:** sección 4.9.

### 2.8 Aurora y Vesper: papel menor coherente con la Parte 1 [PROPUESTA]

Siguen siendo **los jefes de la Parte 1 y los señores del Conde**: nada de lo que el código dice de ellos cambia.

- **Quiénes son:** el canto partido de Anhelia (alba y ocaso). Solo vencemos a uno; el otro huye con él. Tiene sentido: son dos mitades de una canción que nunca vuelven a juntarse sin ella.
- **Qué saben:** que sirven a los Regentes «que hablan con la voz del alba». No saben de Anhelia ni de los colmillos.
- **En la Zona 2 solo aparecen como eco:** (1) el Diario del Vigía y la Carta sin firmar (Parte 1, sin cambios); (2) Zaf y Lúa descubren que **sus dos luces fallaron aquella noche porque un canto las ahogó**: ellos son víctimas del cebo; (3) la orden de la guardia lleva su sello **junto a otro de cuatro puntas** que no es suyo; (4) el Chambelán cuenta que las puertas se abrieron «a ellos y a su señor, el Conde» sin saber para quién trabajaban.
- **En la Parte 3 (por diseñar):** el hermano que sobrevivió puede reaparecer «en otras torres» (el Oráculo). Su destino depende de Anhelia.

### 2.9 El Conde [CANON + reencuadre PROPUESTA]

Sigue siendo el **portero** (siervo de los hermanos del Alba, jefe de la etapa 4). Con la nueva lectura es **el primer mortal que mordió Anhelia**, un cebo con corona: dejó de ser alguien y se convirtió en puerta. Sospecha que los cuatro son «de los suyos» y deja la carta. Su derrota abre el camino a las Torres del Alba y no resuelve nada.

---

## 3. Cómo se llevan [PROPUESTA]

### 3.1 Resumen

- **Cor** quiere ordenar al grupo. **Malak** no recibe órdenes. **Zaf** pregunta antes de obedecer. **Matis** hace lo que cree justo.
- El grupo va a **ritmos distintos**: Cor al frente, Zaf y Matis a su paso, Malak cubriendo desde lejos.
- **Lo que une al grupo:** nadie lleva sangre por gusto. Todo el grupo pagó un precio. Y, aunque aún no lo sepan, **llevan la misma marca en la palma**.
- **Broma general:** los muros. Malak no los rompe; el resto sí. «Esto va a la cuenta» es su frase.

### 3.2 Las seis parejas

| Pareja | Cómo se llevan | Afinidad | Roce | Broma fija |
|---|---|---|---|---|
| **Cor + Malak** | Chocan, pero se respetan. | Ambos tienen prisa: Cor por su maestro, Malak por su valle. | Cor «roba» sangre sin pensar; Malak no se cura nunca y cobra almas. | Cor dice «es una orden» y Malak contesta «a la cuenta». |
| **Cor + Zaf** | Respeto y distancia: quien manda y quien mira. | Ambos cargan con una noche que no pudieron evitar. | Zaf cuestiona los planes; Cor cree que Zaf nunca se moja. | Cor dice «adelante» y Zaf responde «con calma». |
| **Cor + Matis** | Las dos guardias. Se entienden sin hablar. | Ambos protegían algo y fallaron. | Cor quiere acabar rápido; Matis quiere enterrar bien. | Matis dice «con permiso» a los enemigos caídos; Cor responde «¿con permiso de quién?». |
| **Zaf + Malak** | Cobertura: Malak dispara, Zaf marca el camino. | Ven lejos los dos. | Malak tiene prisa; Zaf va despacio. | Zaf describe lo que ve y Malak pregunta cuánto vale. |
| **Zaf + Matis** | Silencio cómodo, cero prisa. | Escuchan más que hablan. | Casi ninguno. | Cuando Cor apura, miran a la vez y dicen «luego». |
| **Malak + Matis** | La amistad del grupo. Matis cuida a Malak (frágil); Malak saca de quicio a Matis. | Ambos perdieron a toda una gente: un valle y una corte. | A Matis le molesta que Malak ponga precio a los muertos. | Malak les pone precio; Matis les pone nombre. |

### 3.3 Lúa con el resto del grupo

- **Con Zaf:** la pareja más fuerte del grupo. Se hablan como quienes se criaron juntos: bromas del faro, reproches y cariño. Lúa le pregunta por todo lo que ve y Zaf, por primera vez, no se queda sin respuestas. Lúa le recuerda que «nunca fue tuya» la culpa.
- **Con Malak:** Lúa cuestiona las cuentas de Malak. Malak, que lleva ciento cuarenta nombres en la cabeza, entiende mejor que nadie lo que es esperar en una celda.
- **Con Cor:** Cor intenta darle órdenes; Lúa las discute con más gracia que Malak.
- **Con Matis:** Matis cuida a Lúa; Lúa le hace reír con la muerte.
- **Broma fija de Lúa:** «Yo no tengo arco, tengo paciencia.»

### 3.4 Vigilia y Cadalso con el grupo

Vigilia se dirige al grupo con ironía educada. Cadalso no habla. Cuando uno de los cuatro cae, Cadalso se detiene un instante, apenas. Es el único detalle de duda que se le ve.

---

## 4. La Zona 2 (Parte 2) [PROPUESTA; mapa de Txaber DECIDIDO]

### 4.1 El mapa de Txaber y el reparto de historias [DECIDIDO + reparto PROPUESTA]

Se llega por un **ascensor vertical** desde La Gran Hoguera. De ahí, **todo va hacia la derecha**, con pozos hacia abajo. Hay cinco tramos, por colores. Las cuatro sendas de seis salas y las tapas de orden fijo **desaparecen**: ahora cada historia personal es un tramo del mapa. El Refugio de Isolda como sala aparte también desaparece (Isolda está en la Capilla).

| Tramo (color) | Nombre en el juego | Historia | Quién y qué |
|---|---|---|---|
| **Verde** | **Patíbulo Exterior** | El origen de los Regentes y la puerta con llave | Hoguera junto al ascensor. Ambientación. Acaba en la **puerta de los Funcionarios**, cerrada con llave |
| **Gris azulado** | **La Despensa** y la **Conservera Mayor** (secreto) | **Malak**: el valle en frascos | Hoguera. Dos pozos a una bodega. Secreto: la Conservera Mayor, con **La Subastadora** (mini-jefa) |
| **Azul claro** | **La Milla Verde** y las **Cárceles** | **Zaf y Lúa**: la hermandad en una celda | Casa del Mercader (ida y vuelta), pozo y celdas. Mini-jefe: el **Último Farero** (quien crió a Zaf y a Lúa). Se libera a Lúa |
| **Amarillo** | **Capilla del Cuartel** | **Cor**: el maestro y la llave. También **Matis e Isolda** | Pasillo largo, escalera a la Capilla, jefe: el **Capitán de Hierro** (da la llave). Arriba: Isolda, cura, mercader, herrero, hoguera |
| **Rojo** | **Dependencias de los Funcionarios** | **Matis**: la traición del cerco | Tras la puerta con llave. Sala alta y tres salas apiladas. Mini-jefe: el **Chambelán Sin Rostro**. Al final, los Regentes |

**Recorrido y orden:** Patíbulo → pozo a la Despensa (y desvío a la Milla Verde) → bodega → pasillo largo → Capilla (**primer jefe: el Capitán, que da la llave**) → de vuelta a la puerta del Patíbulo (con el viaje rápido) → Dependencias (Chambelán) → Regentes. **El Capitán es el primer jefe obligatorio.** La Milla Verde (Lúa) y la Conservera Mayor (valle de Malak) son **desvíos opcionales muy señalados**.

**Qué enseña la Parte 2 en conjunto:** cada tramo revela que **la pérdida de su vampiro fue preparada** («cebo») y deja un fragmento de un **sello de cuatro puntas** que no es el del Alba. Al final se juntan.

### 4.2 Patíbulo Exterior (verde) [PROPUESTA]

Un camino largo de patios, jaulas y horcas bajo una cúpula de roca, con cuervos y soga. Las salas se encadenan hacia la derecha: la **primera, junto al ascensor, tiene hoguera**.

| | |
|---|---|
| **Qué es** | El **viejo cadalso** donde, siglos antes, Anhelia encontró a la cantora y al verdugo (los Regentes). En el techo cuelga una soga con **dos lazos vacíos**. |
| **Ambiente** | Verde grisáceo, madera podrida, cuervos, jaulas con huesos, linternas de aceite. Música de viento y cuerdas. |
| **Qué cuenta** | Una nota en la tercera sala: «Dos lazos, dos nombres: cantora y verdugo. Ninguno llegó a colgar. Quien los descolgó no firmó.» Es la primera pista de los Regentes. |
| **Enemigos** | Cortesanos de Sombra, Arqueros Huecos y Guardias de Hierro (los ajusticiados y su guardia). |
| **Salidas** | Una **a la derecha**: la **puerta de los Funcionarios**, cerrada con llave. Otra **hacia abajo por un pozo**: lleva a la Despensa. |

### 4.3 La Despensa y la Conservera Mayor (gris azulado) · historia de Malak [PROPUESTA]

| | |
|---|---|
| **Concepto** | Una despensa enorme de estanterías con **frascos de almas**, etiquetados con letra cuidada. Una sala alta de entrada, una gran sala con **hoguera**, **dos pozos** a una bodega, y, a la derecha de esos pozos, un **secreto**. |
| **Ambiente** | Gris azulado, estanterías hasta el techo, frascos que brillan distinto, goteo. Música de feria rota (la del Mercado). |
| **Qué cuenta** | En una de las etiquetas: «Frasco 1: valle de los bosques cerrados. 140 almas en garantía.» Es **el valle de Malak**. La Despensa está llena de gente de otros lugares: **cada alma cobrada por los vampiros acaba en un frasco**. |
| **Revelación** | Las almas **no se guardan para devolverlas: alimentan las lámparas de la Hondura**. La deuda de Malak **era falsa**. El agente que cerró el trato es el **Mercader** del Vestíbulo. El recibo lleva el sello de cuatro puntas. |
| **Secreto: la Conservera Mayor** | A la derecha de los pozos, detrás de un **muro agrietado**, está el **frasco grande** del valle. **Malak no puede romper muros**: necesita Bombas (la tienda del Mercader las vende) o ayuda de otro jugador. La guarda **La Subastadora**, mini-jefa que vende lo que no es suyo. |
| **Hito** | Al vencerla, Malak **rompe la Gran Conserva** y deja ir a ciento cuarenta nombres, uno por uno. Es su mejora: Cazadora de almas. Malak encuentra un **fragmento del sello de cuatro puntas**. |

### 4.4 La Milla Verde y las Cárceles (azul claro) · historia de Zaf y Lúa [PROPUESTA]

| | |
|---|---|
| **Concepto** | A la izquierda de la Despensa, una **Casa del Mercader** (ida y vuelta), un **pozo vertical** y, a su derecha, **La Milla Verde**: un largo corredor de celdas con rejas cubiertas de óxido verde, y debajo, las **Cárceles**. |
| **Ambiente** | Azul claro, humedad, agua que gotea, un **canto lejano** (el de Vigilia). |
| **Qué cuenta** | El Mercader, sin querer, murmura: «Una voz que no deja de contestar. Lleva años contestando.» En las celdas hay un «Registro de garantías»: «Garantía 7: una menor, a cambio de una deuda que se paga sola.» |
| **Mini-jefe** | **El Último Farero**, carcelero de la Milla, a medio camino entre persona y cristal. Es **quien criaba a Zaf y a Lúa** en el faro. |
| **Revelación (Zaf)** | La noche del temporal el Farero encendió la lámpara **en negro**, por orden de «quien manda abajo», **a cambio de la vida de Lúa**. Un canto ahogó las dos luces del cielo y la lámpara de Zaf no pudo encenderse: **no fue por culpa de Zaf, fue un cebo**. Lúa vive, retenida como garantía, y su carcelero es quien las crió. |
| **Escena** | Zaf abre la celda del fondo. **Lúa sale y se une al grupo para el resto del juego.** El Farero cae diciendo: «Lo hice por ella. No fue por ti.» Zaf enciende por primera vez la lámpara del Farero, en blanco. Encuentra un **fragmento del sello de cuatro puntas**. |
| **Hito** | Liberar a Lúa. Mejora: Visión nocturna. |

### 4.5 Capilla del Cuartel (amarillo) · historia de Cor, y reencuentro de Matis e Isolda [PROPUESTA]

| | |
|---|---|
| **Concepto** | Un **pasillo largo hacia la derecha** de candelabros y ex-votos de la guardia, una **sala grande con la escalera** a la Capilla y, arriba a la derecha, la **Capilla** con hoguera, un cura, un mercader, un herrero y **la Reina Isolda**. |
| **Ambiente** | Amarillo pálido de cera, banderas descoloridas, órgano cansado. |
| **Primer jefe** | **El Capitán de Hierro**, maestro de Cor y autor del Diario del Capitán. Vigila la escalera de la Capilla y **guarda la llave** de una puerta que le ordenaron no abrir. |
| **Qué revela** | La orden de cerrar las puertas llevaba **dos sellos**: el de los hermanos del Alba y **otro de cuatro puntas que el Capitán no reconoció**. Decía «no abrir hasta que ambos regresen juntos» y traía un **permiso para la persona más joven de la guardia: que esa noche estuviera lejos**. El Capitán lo firmó sin saber por qué. **Cor no estaba fuera por casualidad: lo mandó lejos su maestro, por quien más quería.** |
| **La llave** | Al caer el Capitán suelta la **Llave de los Funcionarios**. Abre la puerta del final del Patíbulo (detalles en ZONA2.md, sección 4.7). |
| **Escena** | Cor da la orden que faltaba: «Descanso». El Capitán, por fin, se desploma. Cor encuentra un **fragmento del sello de cuatro puntas**. |
| **La Capilla (arriba)** | **Isolda, aliada**: cierra la misión del Anillo del Rey y reconoce a Matis. Un **cura** cuenta lo que sabe de la llave. Mercader y herrero. Hoguera. |
| **Hito** | Vencer al Capitán. Mejora: Sed de sangre. |

> **[DECIDIDO por mí, a validar] Los tres «capitanes» del juego:**
> - **Diario del Capitán** (`PAGES.corr`, Corredor de Armaduras): lo escribió el **Capitán de Hierro**, maestro de Cor, antes de retirarse a la Capilla del Cuartel. «Yo sigo vigilando» es literal.
> - **Élite «Capitán de Armaduras»** (Corredor de Armaduras): es **su teniente**, que heredó el título «de las armaduras». Comprobado en `world.js` (`area 'corr'`) y `ELITE_AB`: el élite carga; no tiene diario.
> - **Jefe «Capitán de Hierro»** (Capilla del Cuartel): el Capitán de verdad.
>
> No hay que cambiar nada de la Zona 1. Cor, al ver el yelmo del teniente, reconoce el escudo de su maestro (evento C07).

### 4.6 Dependencias de los Funcionarios (rojo) · historia de Matis [PROPUESTA]

| | |
|---|---|
| **Concepto** | Tras la puerta con llave, las **oficinas donde se redactaban las órdenes del castillo**: una **antecámara alta**, y **tres salas apiladas** (una galería de retratos tapados, el despacho del Chambelán y una antesala) que bajan hasta el **Salón de los Dos Tronos**. |
| **Ambiente** | Rojo vino, papeles, tinta seca, escribanías, retratos con telas negras. Música de corte. |
| **Qué cuenta** | Libros de registro de condenados y visitas; una **Partitura sin firma** («Cuatro notas, una por colmillo: sangre, noche, almas, sombra...»). |
| **Mini-jefe** | **El Chambelán Sin Rostro**, jefe de la casa real, que abrió las puertas a cambio de no morir. |
| **Revelación (Matis)** | El «cerco» no fue una invasión: fue **una traición desde dentro, ordenada desde abajo**. El Chambelán abrió las puertas por orden de «quienes cantan debajo» (los Regentes), a cambio de no morir. Los hermanos del Alba y el Conde cruzaron esa puerta sin saber para quién. **El cerco existió para dejar a Matis sin hogar.** |
| **Escena** | Matis da un nombre a cada persona del registro. Solo queda sin grabar un nombre: el suyo. Matis encuentra un **fragmento del sello de cuatro puntas**: ya están los cuatro. |
| **Hito** | Vencer al Chambelán. Mejora: velocidad (Piel de sombra). |

### 4.7 Mejora de cada hito [DECIDIDO: «que se note»; valores PROPUESTA]

**Cómo se expresan las estadísticas en el código (comprobado):** las pasivas son **factores numéricos** en `PASSIVES` (`public/extras.js`). Un factor de 1,5 significa +50 %. El daño y los corazones son enteros y no se tocan.

**Unidad:** la mejora se **suma al factor** (por ejemplo, 0,82 + 0,06 = 0,88). Lo recibe el vampiro dueño cuando cae el jefe de su hito (se calcula a partir de `progress.bosses`; ver ZONA2.md, sección 6). **En la historia es su colmillo despertando.**

| Hito | Jefe | Quién | Estadística | Valor actual | Mejora | Valor nuevo | Por qué se nota |
|---|---|---|---|---|---|---|---|
| Dependencias | Chambelán Sin Rostro | Matis | Velocidad (`pas.speed`) | 0,82 (= 135 px/s con `speed: 165`) | **+0,06** | **0,88** (= 145 px/s) | +10 px/s, un 7 % más veloz: unos 2,6 casillas más cada 10 s. Sigue más lento que Zaf (0,94) y Cor (1). |
| Capilla | Capitán de Hierro | Cor | Sed de sangre (`pas.life`) | 0,40 | **+0,10** | **0,50** | Cada golpe a un enemigo corriente cura con un 50 % en vez del 40 %: un cuarto más de curación. En jefes el tope del código (`Math.min(lifeP, 0.25)`) no cambia: si se quiere que se note también ahí, hay que subirlo. |
| Milla Verde | Último Farero | Zaf | Visión nocturna (`pas.aura`) | 1,8 | **+0,20** | **2,0** | El radio de luz crece de 1,8 a 2,0 veces el base, un 11 % más. Combina con el Ojo de la Noche (×1,4) y con el Aceite de linterna (×1,7). |
| Conservera Mayor | La Subastadora | Malak | Cazadora de almas (`pas.souls`) | 1,5 | **+0,20** | **1,70** | Un esqueleto sigue dando 5 almas, pero un prisionero pasa de 15 a 17, una babosa de magma de 14 a 15 y la Madre Moho de 450 a 510. Equivale a unos dos tercios de un Talismán de almas. |

*Nota sobre redondeo:* el código redondea las almas (`Math.round(n * pas.souls * ...)`), por eso con valores como 1,505 el cambio se perdía. Con +0,20 el efecto ya se ve en casi todos los enemigos.

**Nota importante:** la Milla Verde y la Conservera Mayor son **desvíos opcionales**, así que las mejoras de Zaf y Malak lo son también. Si se prefiere que sean obligatorias, hay que cambiar el mapa (pregunta en ZONA2.md).

**¿Choca con la regla de una sola mejora de daño por zona?** No. Ninguna toca el daño del arma ni el nivel de arma (`dmg`, `perm.dmg`, `wlv`). La mejora de daño de la Zona 2 va aparte, en la forja de la Antesala de los Regentes (ZONA2.md, sección 5.6).

### 4.8 El final de la Parte 2: los Regentes [PROPUESTA]

Tras el Chambelán, la última sala de las Dependencias es la **Antesala de los Regentes** (hoguera, forja, tienda). Debajo, **el Salón de los Dos Tronos**, donde se luchan **dos combates seguidos, en la misma arena y sin descanso entre ellos**:

1. **Combate 1: Cadalso, el Verdugo Mudo.** Vigilia canta desde el Trono-Atril, invulnerable, y marca el compás de la pelea. Cadalso, a golpes de hacha y cadena, intenta acabar con ellos «porque le toca».
2. **Combate 2: Vigilia, la Cantora de la Hondura.** Cuando Cadalso cae de rodillas y dice «Perdón», Vigilia baja del atril, ya sin protección, y lucha sola, con el canto como arma, hasta su última nota.

**Vida y dificultad:** Cadalso 104 (52 golpes con 2 de daño) y Vigilia 116 (58). Los dos juntos son más largos que cualquier jefe anterior; es el final de la parte. Detalles y tiempos en ZONA2.md, 5.1.

### 4.9 Revelación graduada: qué se sabe al acabar la Parte 2 y qué se reserva [PROPUESTA]

| | Se sabe al acabar la Parte 2 | Se reserva para la Parte 3 |
|---|---|---|
| **La sangre** | **La sangre de los cuatro no es del Conde: es de «la Primera Sed»**, que los espera abajo. Los cuatro tienen **la misma marca en la palma** y los fragmentos del sello encajan en un **símbolo de cuatro puntas** (cuatro colmillos). | Que la Primera Sed es **su progenitora**, que los dejó de bebés en cuatro puertas, y que se llama **Anhelia**. |
| **Las tragedias** | **Todas fueron preparadas** (la orden de la guardia, el naufragio, el trato de almas, el cerco) para que cada colmillo «madurara». | Que ella los criaba para **devorarlos**, y también por qué quiere ser detenida. |
| **El Conde** | Que fue **un portero con su misma sangre**, no su origen. | Que fue **el primer mortal al que mordió** y que su carta tenía sentido doble. |
| **Los Regentes** | Quiénes son, su relación y su miedo a la Primera Sed. | Que Cadalso y Vigilia están atados por **la lengua y la última nota** (se les mostraría la lengua en el relicario). |
| **Los hermanos del Alba** | Que son eco: **sus luces fallaron por el canto** y «no saben para quién cantan». | Que son **su canto partido** (alba y ocaso). |
| **Los poderes** | Que sus **pasivas** son colmillos que despiertan (mejoras de los hitos). | Que cada colmillo es **una parte de la Primera Sed**, y que cuanto más despiertan, más madura su banquete. |

**Gancho de cierre (escena tras la caída de Vigilia):**

- Vigilia: «Cuatro colmillos, maduros ya. Gracias por traerlos hasta abajo.»
- Matis: «La marca de la palma. Es la misma en las cuatro manos.»
- Vigilia: «Vuestra sangre nunca fue del Conde. Es de la Primera Sed. Bajad: ella os espera.»
- Cadalso (por fin, su palabra): «Perdón.» Los dos se deshacen en notas.
- Rótulo central: «Abajo, algo despierta... y sabe vuestro nombre.»

*(Lo que no se dice: «madre», «hijos», «Anhelia». El juego deja que quien juega lo sospeche.)*

---

## 5. Cómo funcionan las charlas y los pensamientos [PROPUESTA]

**Cuatro tipos de disparador [DECIDIDO]:**

- **A. Primera vez que se entra en una zona (área) concreta.**
- **B. Lograr un objetivo** (jefe, habilidad, misión, mejora).
- **C. Ver por primera vez un enemigo concreto.**
- **D. Ver un lugar inalcanzable por ahora** (puerta sellada, saliente alto, muro agrietado...) para recordarlo y volver con la habilidad.
- **Extras opcionales:** hoguera, muerte, grupo de cuatro (al final).

**Reglas comunes:**

- Cada evento salta **una sola vez por partida guardada**.
- **Multijugador (dos o más vampiros):** se muestra una charla de 2 a 5 líneas entre la pareja pensada para ese evento. Si esa pareja no está, se usa la variante genérica de abajo con dos presentes. Si falta un vampiro imprescindible (por ejemplo, el dueño de un tramo), la charla **no se gasta** y se reintenta la próxima vez que se cumpla el disparador.
- **En solitario:** el vampiro «piensa en voz alta» una frase (una por evento).
- **Con Lúa en el grupo:** se añade su comentario al final si el evento lo tiene (`Lúa:`), y si no, una frase suya genérica de 5.2.
- **Dónde funcionan:** en **todas** las zonas, incluida la Zona 1 (eventos A01 a A15, B01 a B14, C01 a C12, D01 a D10) y la Zona 2 (A16 a A26, B15 a B21, C13 a C20, D11 a D15).
- El formato de datos, el guardado, cómo se dibuja y el reparto multijugador/solitario están en [ZONA2.md](ZONA2.md), sección 7.
- En los eventos de los jefes finales de la Parte 2 (B20 y B21) hablan también **Vigilia** y **Cadalso** como personajes del guion.

Nombres: **Cor** (rojo), **Zaf** (azul), **Malak** (verde), **Matis** (morado). Parejas: **CM** = Cor+Malak, **CZ** = Cor+Zaf, **CT** = Cor+Matis, **ZM** = Zaf+Malak, **ZT** = Zaf+Matis, **MT** = Malak+Matis.

### 5.1 Variantes genéricas (si no están los de la pareja)

«X» e «Y» son dos presentes cualesquiera, y se usan sus nombres.

- **A (zona nueva):** X: «Territorio nuevo.» / Y: «Pues a conocerlo.»
- **B (objetivo):** X: «Una cosa menos.» / Y: «Y las que quedan.»
- **C (enemigo nuevo):** X: «Eso no lo había visto.» / Y: «Mejor tenerlo a distancia.»
- **D (inalcanzable):** X: «Aquí falta algo.» / Y: «Lo apunto y volvemos.»

### 5.2 Comentarios genéricos de Lúa (si el evento no tiene uno propio)

- **A:** «¿Esto es un camino o una trampa? Siempre me confundo.»
- **B:** «¡Eso ha sido bonito! Hacedlo otra vez.»
- **C:** «Ese me lo quedo yo. Mi látigo tiene hambre.»
- **D:** «Si no se llega, se llega. Apuntadlo.»

---

## 6. Eventos de la Zona 1 (y su multi/solo)

Cada evento tiene: **charla multijugador**, **pensamientos en solitario** (Cor · Zaf · Malak · Matis) y, si aplica, **Lúa**.

### 6.1 Tipo A: primera vez que se entra en una zona

**A01 · Vestíbulo (área `vest`) · CM**
- Cor: Este es el castillo del Conde. Voy delante.
- Malak: Claro. Yo voy detrás, que es donde se cobra.
- Cor: No todo es dinero.
- Malak: Todo es dinero. Lo que pasa es que a unos se les nota menos.
- Solo: Cor «Casa. Qué mal huele tu casa.» · Zaf «El castillo está a oscuras. A mí eso me tranquiliza. Qué raro.» · Malak «Un castillo lleno de almas. Mi sueño de feria.» · Matis «Tantos muertos sin que nadie lo diga. Empecemos.»

**A02 · Biblioteca (área `archivo`) · ZT**
- Zaf: Hay susurros entre las estanterías.
- Matis: Libros que piden sangre. Los conozco: son como los vivos, pero más pesados.
- Zaf: ¿Los leemos?
- Matis: Luego.
- Solo: Cor «Libros. Mi maestro decía que se aprende más callando.» · Zaf «Aquí hasta el silencio susurra.» · Malak «Cada página, una cuenta pendiente.» · Matis «Los libros también merecen su entierro.»

**A03 · Capilla (área `naveS`) · MT**
- Malak: Una capilla. Aquí se pagaba con rezos, ¿no?
- Matis: Aquí se pagaba con todo lo que no cabía fuera.
- Malak: Entonces tengo tarifa. Esto va a la cuenta.
- Solo: Cor «Aquí no se obedece a nadie. Se reza.» · Zaf «Una vela. Me bastaría para un faro.» · Malak «Aquí se paga con fe. Moneda mala.» · Matis «Una capilla. Siempre hay alguien a quien despedir.»

**A04 · Calabozos (área `calab`) · CT**
- Matis: Aquí abajo hay gente que no pidió nada.
- Cor: Gente que servía a mi castillo, quizá.
- Matis: Con permiso, entonces.
- Cor: ¿Con permiso de quién?
- Solo: Cor «Aquí también servía la guardia.» · Zaf «Oigo goteras. Cuentan días que no pasan.» · Malak «Quien dejó aquí a la gente no tenía bolsillos.» · Matis «Con permiso. Paso despacio.»

**A05 · Torre del Reloj (área `galeria`) · CZ**
- Zaf: El tiempo suena distinto aquí. Más apretado.
- Cor: Adelante. No hay tiempo para estudiarlo.
- Zaf: Con calma. Precisamente por eso.
- Solo: Cor «Un reloj que no marca horas. Marca órdenes.» · Zaf «El tiempo es una sierra con ruedas.» · Malak «El tiempo es dinero. Este lo tiró.» · Matis «Aquí el tiempo no cura. Aplasta.»

**A06 · Sala Real (área `pasR`) · CM**
- Cor: Esa puerta cerraba el castillo. Me la conozco.
- Malak: Lo que cierra una puerta se paga cuando se abre.
- Cor: Es una orden: tú detrás.
- Malak: A la cuenta.
- Solo: Cor «Esa puerta cerrada, otra vez.» · Zaf «Por aquí llegaban las órdenes del Conde.» · Malak «Palacio. Lo que cuesta uno así.» · Matis «Un trono es una tumba con más público.»

**A07 · Escalera Real, el Rey Destronado (área `escalaR`) · CT**
- Cor: Un rey en una escalera. Mal sitio para reinar.
- Matis: Esta escalera huele a rosas. Conozco ese olor.
- Cor: Hablemos con él.
- Solo: Cor «Un rey sin corona. Lo saludo como se debe.» · Zaf «Todos esperan algo en este castillo.» · Malak «Un rey con anillo. ¿Quién paga la escalera?» · Matis «Esto huele a ella. A la Reina.»

**A08 · Torres del Alba (área `alba1`, tramo tranquilo) · ZM**
- Zaf: No se oye ni un enemigo. Eso es raro.
- Malak: ¿Cuánto vale una calma así?
- Zaf: Lo que dure.
- Malak: Entonces, a aprovecharla.
- Solo: Cor «Calma. No me fío.» · Zaf «Aquí se oye el cielo. Casi.» · Malak «Un sitio sin enemigos. Sospechoso. Nadie regala calma.» · Matis «Aquí no hay muertos. Qué extraño es el silencio de la vida.»

**A09 · Cumbre del Alba (área `cumbre`) · ZT**
- Zaf: Aquí arriba hay viento de verdad.
- Matis: Y una sola luz.
- Zaf: Antes eran dos.
- Matis: Lo sé. Se nota en cómo se mueve la sombra.
- Solo: Cor «Desde aquí se ve el castillo entero. Qué pequeño.» · Zaf «Una sola luz. Anoto el sitio.» · Malak «Cielo gratis. Mi precio favorito.» · Matis «El viento aquí también carga nombres.»

**A10 · Archivo Prohibido (área `arch1`) · CZ**
- Zaf: Más libros. Y más callados.
- Cor: «Prohibido», dice la puerta.
- Zaf: Entonces, con calma.
- Cor: Adelante.
- Solo: Cor «Prohibido. Me acostumbré a obedecer eso.» · Zaf «Aquí el silencio lo ha ordenado alguien.» · Malak «Lo prohibido siempre vale más.» · Matis «Libros que callan. Son los peores.»

**A11 · Catacumbas Reales (área `cat1`) · MT**
- Matis: La corte de la Reina de Huesos. Con permiso.
- Malak: Mucho hueso. Poco precio.
- Matis: Aquí cada hueso tuvo nombre.
- Malak: ...Vale. Sin cuentas.
- Solo: Cor «Más guardia caída.» · Zaf «Aquí abajo suena distinto.» · Malak «Huesos. No pagan, pero tampoco se quejan.» · Matis «Bajo el castillo, otro castillo de muertos.»

**A12 · Calabozos Profundos (área `asc`) · MT**
- Matis: El musgo ha subido por todo. Hasta por el cable.
- Malak: Esto sí es un negocio: nadie va a reclamar nada.
- Matis: Nadie, salvo ellos. Con permiso.
- Solo: Cor «Aquí abajo ni una bandera. Ni una sola orden.» · Zaf «El musgo se come hasta la luz.» · Malak «Moho, humedad y deudas. Mi oficina.» · Matis «El musgo abraza primero. Después, el resto.»

**A13 · Cueva del Abismo (área `caida`) · ZM**
- Zaf: Brasas por todos lados. Se ve hasta el fondo.
- Malak: ¿Y ese ruido de yunque?
- Zaf: Alguien trabaja ahí abajo. Nadie lo apaga nunca.
- Solo: Cor «Fuego sin guardia. Qué raro.» · Zaf «El resplandor se ve desde arriba. ¿Quién lo mira?» · Malak «Una forja. Aquí se paga en chispas.» · Matis «El fuego también da compañía.»

**A14 · Camino de salida (área `pas5`) · CZ**
- Cor: El camino de salida. Se acerca el final de esto.
- Zaf: Cada paso suena a ceniza.
- Cor: Adelante.
- Zaf: Con calma.
- Solo: Cor «Si hay salida, que sea hacia delante.» · Zaf «Huele a brasa y a despedida.» · Malak «Más abajo se cobra.» · Matis «Cada salida es otra entrada.»

**A15 · La Gran Hoguera (área `gran`) · grupo**
- Cor: La Gran Hoguera. Se oye arder desde lejos.
- Malak: Más grande que cualquier taberna.
- Matis: Una hoguera así se hizo para despedir a alguien.
- Zaf: Calor y ceniza. Me quedo un rato.
- Solo: Cor «Hasta aquí, el castillo del Conde.» · Zaf «Calor y ceniza. Anoto el sitio.» · Malak «Más grande que cualquier taberna.» · Matis «Una hoguera así se hizo para despedir.»

### 6.2 Tipo B: lograr un objetivo

**B01 · Vencer a la Gárgola (Impulso) · CZ**
- Cor: Primer jefe. Y ya sabemos cruzar abismos con {dash}.
- Zaf: Pero lloraba piedra. No debió llorar así.
- Cor: Adelante.
- Zaf: Con calma.
- Solo: Cor «Primer jefe caído. Que no se me suba a la cabeza.» · Zaf «Cruzar abismos. Qué sensación más antigua.» · Malak «Una habilidad nueva. Gratis. Sospechoso.» · Matis «Descansa. No te lo he quitado: te lo devuelvo.»

**B02 · Vencer al Obispo (Doble salto) · MT**
- Matis: Rezaba al revés y le respondían con su propia voz.
- Malak: Y a mí me da el segundo salto. Un trato casi justo.
- Matis: Con permiso, Obispo.
- Solo: Cor «Un salto extra. Más para mí que para él.» · Zaf «Rezó hasta que le contestaron. Mal asunto.» · Malak «Segundo salto. La próxima vez, antes de que me pidan nada.» · Matis «Dejó de rezar. Ya era hora.»

**B03 · Vencer a la Reina de Huesos (sello de hueso) · MT**
- Matis: La Reina de Huesos. Tampoco bajó nadie a verla.
- Malak: Un sello de hueso. ¿Cuánto pagarán por esto?
- Matis: Nada. Descansa, Reina.
- Solo: Cor «Una reina que nadie visitó.» · Zaf «Los huesos sí dicen la verdad.» · Malak «Un sello de hueso. A saber cuánto valdrá.» · Matis «Con permiso, Reina. Ya no estás de guardia.»

**B04 · Vencer al Guardián del Reloj (Salto de pared) · ZM**
- Zaf: Sin luz, no tenía armadura.
- Malak: ¿Y el salto de pared? ¿Cuánto cuesta uno?
- Zaf: Lo que cueste subir sin él.
- Solo: Cor «Se apagó la luz y cayó. Hay lecciones simples.» · Zaf «Sin luz no tenía armadura.» · Malak «Saltar por las paredes. Qué comodidad.» · Matis «El reloj paró. Por fin alguien descansa.»

**B05 · Vencer al Archimago (sello de tinta) · CZ**
- Cor: Dos sellos rotos. La puerta del trono se abre.
- Zaf: Entre sus libros no había maldad. Había cansancio.
- Cor: Adelante.
- Zaf: Con calma.
- Solo: Cor «Dos sellos. Se acabó la espera.» · Zaf «Sus libros dejaron de susurrar.» · Malak «Qué pocas almas para tanto libro.» · Matis «Tinta y hueso. Nada se pierde del todo.»

**B06 · Cae el Conde · CT**
- Cor: Se acabó el portero.
- Matis: Lo dijo en su carta: quería que alguien lo detuviera.
- Cor: Y alguien lo hizo. No sé qué siento.
- Solo: Cor «Se acabó el portero.» · Zaf «Quizá, al fin, alguien lo detuvo. Aquí estoy.» · Malak «Doscientas almas. Más de lo que esperaba.» · Matis «Descansa, Conde. Aunque nadie lo merezca.»

**B07 · Cae Aurora o Vesper (el otro lo recoge y huye) · ZT**
- Zaf: Se lo ha llevado en brazos. No tenía fuerza ni para odiarnos.
- Matis: Eso no es buena ni mala señal. Es una señal.
- Zaf: Luego lo pienso.
- Matis: Luego.
- Solo: Cor «Dos hermanos. Yo también tuve a quien rendirme.» · Zaf «Dos luces. Solo vi apagarse una.» · Malak «Si fueran clientes, les vendería el mismo seguro.» · Matis «Uno guarda al otro. Eso lo entiendo.»

**B08 · Vencer al Alcaide Verdín (Pisotón) · CM**
- Cor: Guardaba las llaves y una orden vieja. Lo entiendo.
- Malak: Y yo me llevo el Pisotón. Esto va a la cuenta.
- Cor: Es una orden: respeto.
- Malak: A la cuenta.
- Solo: Cor «Obedecía una orden vieja. Como yo.» · Zaf «No era enemigo. Era relevo.» · Malak «Un pisotón. Qué barato salió.» · Matis «Duerme, Alcaide. Ya has esperado bastante.»

**B09 · Vencer a la Madre Moho · ZM**
- Zaf: Se acabó el musgo del corazón. La puerta oeste se abre.
- Malak: ¿Qué ves al otro lado?
- Zaf: Salida. Y mucha ceniza.
- Solo: Cor «Se terminó el musgo.» · Zaf «Un corazón sin latido. Por fin.» · Malak «Trescientas almas. Con eso hago caja.» · Matis «Que el musgo la cubra con cariño.»

**B10 · Entregar el Martillo Latente al Herrero · MT**
- Matis: El martillo late como un corazón. Y el Herrero también.
- Malak: Y se muda. Un cliente fijo menos.
- Matis: Un taller nuevo más.
- Solo: Cor «Por fin, un taller como Dios manda.» · Zaf «Hasta el martillo late.» · Malak «Mejores poderes, mejores precios.» · Matis «Que el fuego también descanse a ratos.»

**B11 · Primera mejora de arma (Gran Biblioteca) · ZM**
- Malak: Mi arma dispara mejor. ¿Cuánto costó?
- Zaf: Nada. Quizá todo.
- Malak: Eso no es una respuesta.
- Zaf: Es la única que tengo.
- Solo: Cor «Más alcance. La guardia lo agradece.» · Zaf «Mejor puntería. Con calma.» · Malak «Más largo, más rápido, más cobro.» · Matis «Que pese menos lo que tenga que segar.»

**B12 · Mejora de daño del final de la Zona 1 (Antesala del Abismo) · CZ**
- Cor: Más filo. Era hora.
- Zaf: Hoy pesa distinto el arma.
- Cor: Pesa lo que debe.
- Zaf: Eso también lo apunto.
- Solo: Cor «Más filo. Por fin.» · Zaf «El arma pesa distinto. Me gusta.» · Malak «Más daño, más almas por golpe.» · Matis «Un poco más de filo. Un poco menos de dudas.»

**B13 · Primer cristal de vida · CM**
- Malak: Un corazón de sobra. Gratis.
- Cor: Nada es gratis en este castillo.
- Malak: Pues este lo parece.
- Solo: Cor «Un corazón más. Lo gasto con cabeza.» · Zaf «Se oye distinto latir.» · Malak «Corazón gratis. Y yo, sin bolsillo para llevármelo.» · Matis «Un corazón más para quien lo necesite.»

**B14 · Entregar el Anillo del Rey a Isolda (Capilla del Cuartel) · CT**
- Cor: Aquí está el anillo, Reina.
- Matis: Dice que su escalera aún huele a sus rosas.
- Cor: ...No sé si decirle algo más.
- Matis: Eso ya es mucho.
- Solo: Cor «Misión cumplida. Eso se siente bien.» · Zaf «Un anillo y un mensaje. Basta.» · Malak «Nunca entregué algo sin cobrar. Esto, quizá sí.» · Matis «Le dije que su corte no fue olvidada.»
- Lúa: «Un anillo y un mensaje. En mi casa eso era una boda.»

### 6.3 Tipo C: ver por primera vez un enemigo concreto

**C01 · Esqueleto (`sk`) · CM**
- Cor: Soldados caídos. Débiles, pero muchos.
- Malak: Tres almas cada uno. Esto sí es negocio.
- Cor: Son personas.
- Malak: Fueron.
- Solo: Cor «Soldados caídos. Los conozco.» · Zaf «Débiles. Muchos.» · Malak «Tres almas cada uno. Haré cuentas.» · Matis «Con permiso. Será breve.»

**C02 · Caballero maldito (`kn`) · CT**
- Cor: Armaduras vacías que aún obedecen. Las conozco.
- Matis: Cuando brillen en azul, no se las puede golpear.
- Cor: Gracias. Esperaré.
- Solo: Cor «Armaduras vacías. Qué desperdicio.» · Zaf «Cuando brillan en azul, no hay golpe que valga.» · Malak «Hierro caro. Lástima que no se pueda vender.» · Matis «Una armadura sin dueño es una tumba andante.»

**C03 · Murciélago (`bat`) · ZM**
- Zaf: Duermen en las bóvedas. Les molesta la luz.
- Malak: Enciende una antorcha con {act}.
- Zaf: Enciéndela tú. Yo veo bien.
- Solo: Cor «Bichos. Una antorcha y listo.» · Zaf «La luz los espanta. Anotado.» · Malak «Ahora no. Con la luz, ni un chillido.» · Matis «Los murciélagos nunca pidieron estar aquí.»

**C04 · Fantasma (`gh`) · ZT**
- Zaf: Atraviesan muros. No ven a quien está bajo la luz.
- Matis: Almas penitentes. Con permiso.
- Zaf: Luego les hablas. Primero la luz.
- Solo: Cor «Si no los miras, no te ven.» · Zaf «Mira a la luz, no a sus ojos.» · Malak «Fantasmas. Pagan mal.» · Matis «Almas penitentes. Algún día las enterraré.»

**C05 · Sierra de raíl (`saw`) · CZ**
- Zaf: Va y viene sin parar. Hay que aprender su compás.
- Cor: Adelante, entonces: marcha al ritmo.
- Zaf: Con calma. Primero cuento.
- Solo: Cor «Maquinaria. Hay que respetarla.» · Zaf «Va y viene. Cuento los pasos.» · Malak «No se mata. Se esquiva. Gratis.» · Matis «Una sierra con prisa. Yo no la tengo.»

**C06 · Centinela (`sentinel`, invulnerable) · CT**
- Cor: Armadura sin alma. Ningún arma le hace daño.
- Matis: Entonces no se pelea. Se rodea.
- Cor: Es una orden. Y una excusa.
- Solo: Cor «Armadura sin alma. No se pelea.» · Zaf «Invulnerable. Me lo apunto.» · Malak «Imposible de cobrar. Pasemos de largo.» · Matis «Una guardia que no sabe que murió.»

**C07 · Capitán de Armaduras (élite del Corredor) · CZ**
- Cor: Ese yelmo... Es el del teniente de mi maestro.
- Zaf: ¿Y qué hace aquí?
- Cor: Heredó el título del Capitán. Y sigue vigilando.
- Solo: Cor «Ese yelmo... He visto ese yelmo.» · Zaf «Un élite con nombre. Cuidado.» · Malak «Sesenta almas y una Piel de piedra. Merece la pena.» · Matis «Un capitán. Recuerdo lo que es serlo.»

**C08 · Babosa de musgo (`slug`) · MT**
- Matis: Dejan baba que frena.
- Malak: ¿Se vende la baba?
- Matis: Se pisa. Y se paga.
- Solo: Cor «Baba que frena. No la piso.» · Zaf «Se ve el rastro desde lejos.» · Malak «Un negocio que se arrastra.» · Matis «Hasta el musgo tiene sus caminos.»

**C09 · Liana estranguladora (`vine`) · ZM**
- Zaf: Cuando se pone roja, va a disparar.
- Malak: ¿Cuánto vale esquivarla?
- Zaf: Una vida.
- Solo: Cor «Cuando se pone roja, a esquivar.» · Zaf «Escupe espinas. Mejor desde lejos.» · Malak «Qué bicho más mal educado.» · Matis «Una raíz con mal humor.»

**C10 · Prisionero mohoso (`pris`) · MT**
- Matis: Un preso que el musgo no dejó morir.
- Malak: Cae al suelo y se levanta con media vida. Qué trato más raro.
- Matis: Con permiso. Y con fuego.
- Solo: Cor «Un preso que el musgo no soltó.» · Zaf «Se levanta con la mitad de vida.» · Malak «Dos veces para cobrar. Perfecto.» · Matis «El Reo 16 durmió sin miedo. Este no.»

**C11 · Babosa de magma (`magma`) · CM**
- Malak: Brasas por donde pasa. A distancia.
- Cor: Es una orden: nadie pisa las brasas.
- Malak: Para eso tengo flechas.
- Solo: Cor «Dejan brasas. No las piso.» · Zaf «Veo el rastro desde lejos.» · Malak «Brasas. No se pisan. Ni se cobran.» · Matis «El fuego también tiene sus babosas.»

**C12 · Polilla de esporas (`moth`) · ZT**
- Zaf: Sueltan esporas que persiguen despacio.
- Matis: Y arden con el fuego.
- Zaf: Luego las quemamos.
- Matis: Luego.
- Solo: Cor «Esporas. Mejor con fuego.» · Zaf «Las esporas siguen despacio. Las cuento.» · Malak «Esporas. Ni se venden ni se compran.» · Matis «Una polilla que huele a tierra mojada.»

### 6.4 Tipo D: ver un lugar inalcanzable por ahora

**D01 · La subida del Gran Salón (exige Impulso; área `salon`) · CZ**
- Zaf: Esa subida está lejos de cualquier salto nuestro.
- Cor: Habrá otra forma.
- Zaf: Sí. Cuando la Gárgola nos dé el Impulso. La apunto.
- Solo: Cor «Aquí falta algo. Volveré.» · Zaf «Un salto más largo del que doy.» · Malak «Fuera de mi alcance, por ahora.» · Matis «Mi gancho no llega. Volveré con algo mejor.»

**D02 · El cristal alto de la Mazmorra de Hierro (exige Doble salto; área `mazm`) · ZM**
- Malak: Un cristal. Más alto de lo que se salta.
- Zaf: Hace falta un segundo aire.
- Malak: Lo apunto. Vuelvo con él.
- Solo: Cor «Un cristal fuera de alcance. Lo apunto.» · Zaf «Hace falta un segundo aire.» · Malak «Brillante, valioso, alto. Odio los tres.» · Matis «Más alto que mi salto. Esperaré.»

**D03 · La reja de las Cadenas (se abre al caer el Obispo; área `caden`) · CT**
- Cor: Una reja cerrada. Los Calabozos están detrás.
- Matis: Se abrirá. Todo se abre cuando cae quien reza.
- Cor: Volveremos.
- Solo: Cor «Reja cerrada. Se abrirá.» · Zaf «Algo la abre. Luego.» · Malak «Cerrado hoy, abierto mañana, pagado siempre.» · Matis «Detrás hay gente. Volveré.»

**D04 · Un muro agrietado (por ejemplo, el del Archivo, `archivo`) · CM** (si está Malak, ella no puede romperlo)
- Malak: Un muro agrietado. Rompedlo, que yo no puedo.
- Cor: Con gusto.
- Malak: Y lo que haya detrás, a medias.
- Solo: Cor «Detrás hay algo. Siempre hay algo detrás de lo que se esconde.» · Zaf «Una grieta con sombra detrás. Se ve mejor que de día.» · Malak «Una grieta. Y yo sin bomba que me abra el camino.» · Matis «A veces las paredes lloran antes que la gente.»

**D05 · La puerta del Archivo Prohibido (se abre al caer el Guardián del Reloj; área `obs`) · ZT**
- Zaf: Una puerta sin cerradura. Solo con el Reloj parado.
- Matis: Luego.
- Zaf: Luego.
- Solo: Cor «Puerta cerrada. Otra orden pendiente.» · Zaf «Sin cerradura. Hace falta otra cosa.» · Malak «Algo valioso detrás. Seguro.» · Matis «Lo prohibido siempre acaba abierto.»

**D06 · La puerta de la Sala del Trono (dos sellos; área `pasR`) · CZ**
- Cor: Dos sellos. Tinta y hueso.
- Zaf: Ahora no se abre. Alguien los guarda.
- Cor: Entonces, a por ellos. Adelante.
- Zaf: Con calma.
- Solo: Cor «Dos sellos. Me los apunto.» · Zaf «Tinta y hueso. Bien guardada.» · Malak «Una puerta cara de abrir.» · Matis «Aún no me toca.»

**D07 · La Grieta Sellada (se abre al caer Aurora o Vesper; área `grieta`) · MT**
- Matis: Una grieta cerrada. Algo respira detrás.
- Malak: ¿Algo con valor?
- Matis: Lo veremos cuando se abra.
- Solo: Cor «Algo respira ahí detrás.» · Zaf «Una grieta cerrada. Apunto el sitio.» · Malak «Tengo ganas de saber qué hay.» · Matis «No es hora. Volveré.»

**D08 · Los pinchos largos de la Cripta Olvidada (exigen planear con las Alas; área `cripta`) · ZM**
- Zaf: Esos pinchos son más largos que cualquier salto.
- Malak: ¿Y por debajo?
- Zaf: Hay un hueco. Habrá que ir por el aire.
- Solo: Cor «Pinchos. No hay forma de cruzar. Aún.» · Zaf «Un hueco al final. Se ve, no se llega.» · Malak «Un hueco con vistas. No hay forma de bajar con esto.» · Matis «Por el aire, quizá. Algún día.»

**D09 · La puerta al cielo (se abre al caer Aurora o Vesper; área `albaB`) · ZT**
- Zaf: La puerta del este sigue cerrada.
- Matis: Se abrirá. Dicen que cuando uno de los dos cae.
- Zaf: Entonces, esperamos.
- Solo: Cor «La puerta al cielo. Cerrada.» · Zaf «Una puerta que da al cielo. Apunto el sitio.» · Malak «Cielo cerrado. Qué manía de cobrar.» · Matis «El cielo tiene su portero.»

**D10 · La tapa de hierro de La Gran Hoguera (se abre al caer la Madre Moho; área `gran`) · CZ**
- Zaf: Hay una tapa de hierro en el suelo.
- Cor: Y un hueco debajo.
- Zaf: Algo lo sostiene. O lo guarda.
- Solo: Cor «Una tapa en el suelo. Hay algo debajo.» · Zaf «Una tapa de hierro. Algo respira debajo.» · Malak «Una tapa. Y yo con ganas de abrirla.» · Matis «Algo me llama desde abajo.»

---

## 7. Eventos de la Zona 2

### 7.1 Tipo A: primera vez que se entra

**A16 · Pozo del Segundo Ascensor (área `asc2`) · CM**
- Cor: El ascensor se mueve solo.
- Malak: Y baja más de lo que me gusta.
- Cor: Es una orden: sube.
- Malak: A la cuenta.
- Solo: Cor «Más abajo. Siempre más abajo.» · Zaf «El techo se aleja. Qué silencio.» · Malak «Ascensor, bajada, deuda. Todo cuadra.» · Matis «Voy al encuentro de quien me crió.»

**A17 · Patíbulo Exterior, primera sala (área `pat1`) · CZ**
- Cor: Un patíbulo. Y una soga con dos lazos vacíos.
- Zaf: Alguien salvó a quien iba a colgar... o no llegó a hacerlo.
- Cor: Esto no huele a justicia.
- Zaf: Con calma. Primero miramos.
- Solo: Cor «Un patíbulo. Mi maestro decía que de aquí se salía siempre con alguien menos.» · Zaf «Dos lazos vacíos. Alguien se salvó... o se fue.» · Malak «Un patíbulo. Aquí se cobraba con la vida.» · Matis «Una horca sin ahorcados. Peor que con ellos.»
- Lúa: «Los lazos están vacíos. Eso nunca presagia nada bueno.»

**A18 · La Despensa (área `desp`) · CM** (exige a Malak; si no está, se reintenta)
- Malak: Frascos. Cientos de frascos. Con nombres.
- Matis: ¿Reconoces alguno?
- Malak: Todos. Son los de mi valle. Ciento cuarenta nombres.
- Solo: Cor «Estanterías de frascos hasta el techo. Esto es una despensa de algo.» · Zaf «Cada frasco tiene una luz distinta.» · Malak «Mi valle. Ahí está mi valle. Uno por uno.» · Matis «Frascos con nombre. Alguien llevó las cuentas con cariño.»

**A19 · La Milla Verde (área `milla`) · ZM** (exige a Zaf)
- Zaf: Celdas con rejas verdes de óxido. Y una voz.
- Compañía: ¿La conoces?
- Zaf: No puede ser. Esa voz se perdió en el mar.
- Solo: Cor «Celdas por todas partes. Esto es una cárcel.» · Zaf «Esa voz... no puede ser. Se perdió en el mar.» · Malak «Presos. Cada uno vale una cuenta.» · Matis «Una cárcel con la puerta abierta por dentro. Mala señal.»

**A20 · Las Cárceles, celda del fondo (área `carc`) · ZM** (exige a Zaf; Lúa habla desde la celda)
- Lúa: Qué tarde llegas. Estaba empezando a olvidar tu cara.
- Zaf: Lúa... Te di por ahogada.
- Lúa: Y yo creía que ya no volvías. Ven a abrir esto.
- Zaf: Voy a sacarte. No te vuelvo a perder.
- Solo: Cor «Una celda al fondo. Alguien espera.» · Zaf «Lúa. Estás viva.» · Malak «Una celda, una reja y un reencuentro. Esto no se paga.» · Matis «Que se abra esa celda cuanto antes.»

**A21 · Escalera de la Capilla (área `y3`) · CT** (exige a Cor)
- Cor: Esas escaleras llevan a la capilla de mi cuartel.
- Matis: ¿Y quién las guarda?
- Cor: Quien me enseñó a guardarlas.
- Solo: Cor «Mi maestro está aquí. Lo noto en cómo se sostiene el aire.» · Zaf «Una sala grande con alguien dentro.» · Malak «Escaleras guardadas. Siempre hay peaje.» · Matis «Se oye un himno cansado.»

**A22 · Capilla del Cuartel, con Isolda (área `cap`) · CT**
- Matis: Aquí está. La Reina.
- Cor: ¿La conoces?
- Matis: Me acogió de bebé. Y yo me quedé atrás.
- Solo: Cor «Una capilla con hoguera y gente viva. Qué raro.» · Zaf «Por fin, un techo con luz.» · Malak «Una reina, un herrero y un mercader. Con algo de suerte, pagan bien.» · Matis «Ahí está quien me crió. Un paso por delante, como siempre.»
- Lúa: «Hay gente viva aquí arriba. Empezaba a olvidar cómo se ve.»

**A23 · Antecámara de los Funcionarios (área `dep1`; la puerta se ha abierto con la llave) · grupo**
- Cor: La puerta de los funcionarios. Abierta con la llave de mi maestro.
- Matis: Aquí se firmaban los papeles. Todos.
- Malak: Todo se firma. Y todo se cobra.
- Zaf: Con calma. Aquí hay más cerrado que abierto.
- Solo: Cor «Lo que mi maestro guardó sin saber. Ahora lo sabremos.» · Zaf «Papeles por todas partes. Cada uno, una decisión.» · Malak «Un despacho. Mi sitio natural.» · Matis «Esta es la oficina donde se firmó mi caída.»

**A24 · Galería de los Retratos Cubiertos (área `dep2`) · ZT**
- Zaf: Retratos tapados con telas negras. Todos.
- Matis: Quien tapa los rostros esconde quién manda.
- Zaf: Luego miramos debajo.
- Matis: Luego.
- Solo: Cor «Retratos tapados. Alguien no quiere ser reconocido.» · Zaf «Telas negras sobre cada rostro. Apunto el sitio.» · Malak «Un pasillo tapado. Seguro que cobran por mirar.» · Matis «Tapar un rostro es no querer dar la cara.»
- Lúa: «¿Quién tapa los retratos? Alguien con mucho que esconder.»

**A25 · Antesala de los Regentes (área `dep4`) · CM**
- Cor: Esto huele a final de tramo.
- Malak: Y a trampa. Hay hoguera, tienda y forja. Nadie regala tanto.
- Cor: Es una orden: nos preparamos.
- Malak: A la cuenta.
- Solo: Cor «Preparar la guardia. Esto es el último tramo.» · Zaf «Se oye un canto. Muy lejos... y muy cerca.» · Malak «Todo lo que necesito, sin pedirlo. Mala señal.» · Matis «Una antesala. Antes de alguien importante.»
- Lúa: «Si esto es el último tramo, hace falta un buen latigazo.»

**A26 · Salón de los Dos Tronos (área `tronos`) · grupo**
- Zaf: Es el canto. El mismo que oí en el mar.
- Matis: Dos tronos. Un atril y un cadalso.
- Cor: Detrás de mí.
- Malak: Esto va a ser caro.
- Solo: Cor «Dos tronos. Me toca ir delante.» · Zaf «El canto de aquella noche. Por fin sé de dónde venía.» · Malak «Un atril y un cadalso. Qué mal gusto para una sala.» · Matis «Un cadalso. Conozco el sitio donde se despide a la gente.»

### 7.2 Tipo B: lograr un objetivo

**B15 · Vencer al Capitán de Hierro y recibir la llave (Capilla del Cuartel) · CT**
- Cor: Descanso.
- Matis: Con permiso, Capitán.
- Cor: Me mandó lejos esa noche. Lo hizo por mí.
- Cor: Y nos deja una llave para lo que él nunca pudo abrir.
- Solo: Cor «Descanso, maestro. Me salvó sin decirlo. Y nos deja una llave.» · Zaf «Una llave con cuatro puntas. Alguien la sellaba desde abajo.» · Malak «Una llave. Las llaves siempre valen más que lo que abren.» · Matis «Con permiso, Capitán. Seguiremos su puerta.»

**B16 · Vencer al Último Farero y liberar a Lúa (Cárceles) · Zaf + quien esté** (Lúa se une al grupo)
- Zaf: Quien nos crió. Guardando tu celda con una lámpara negra.
- Lúa: Lo hizo por mí. Me lo dijo antes de caer.
- Zaf: No fue por mi culpa. Fue un cebo.
- Lúa: Nunca fue tuya. Vámonos.
- Solo: Cor «Una luz blanca donde había una negra. Algo se cierra.» · Zaf «No fue por mi culpa. Fue un cebo. Y Lúa está viva.» · Malak «Una familia entera pagó por esto. Lo conozco.» · Matis «Que quien os crió descanse.»

**B17 · Vencer a La Subastadora y liberar el valle (Conservera Mayor) · CM**
- Malak: Ciento cuarenta nombres. Uno por uno.
- Cor: ¿Los dejas ir?
- Malak: Los devuelvo. Era lo único que me quedaba por cobrar.
- Solo: Cor «Un valle entero embotellado. Y ahora, libre.» · Zaf «Ciento cuarenta luces que se van. Ninguna se apaga.» · Malak «Se acabó la cuenta. Nunca más cobro por esto.» · Matis «Que cada frasco encuentre su camino.»
- Lúa: «Ciento cuarenta. Y tú te sabes todos los nombres. Eso es hacer cuentas bien.»

**B18 · Vencer al Chambelán Sin Rostro (Despacho; Dependencias) · MT**
- Matis: Doy un nombre a cada persona del registro. Una por una.
- Malak: ¿Puedo ayudar?
- Matis: Sí. Sin precio.
- Solo: Cor «Un traidor. Hay quien merece la espada.» · Zaf «Ahora entiendo el cerco.» · Malak «Se vendió barato.» · Matis «Ya tienen nombre. Falta el mío.»

**B19 · Forja de la Antesala de los Regentes (mejora de arma, nivel 4) · CZ**
- Cor: Un filo más.
- Zaf: Y más largo.
- Cor: Lo necesitaremos.
- Solo: Cor «Más filo. Falta lo que viene.» · Zaf «El arma responde mejor.» · Malak «Más daño. Mi cuenta mejora.» · Matis «Un poco más de filo para lo que falta.»

**B20 · Cae Cadalso (primer combate de los Regentes) · CM**
- Cadalso: Perdón.
- Vigilia: Calla, tonto. Calla y deja que lo termine.
- Cor: Habló. Por fin una palabra.
- Matis: Y no era para nosotros.
- Solo: Cor «Una sola palabra en siglos. Y fue una disculpa.» · Zaf «Perdón. Lo dijo a quien canta, no a mí.» · Malak «Tantos años sin hablar para decir eso.» · Matis «Quien pide perdón ya está medio perdonado.»

**B21 · Cae Vigilia (fin de la Parte 2) · grupo**
- Vigilia: Cuatro colmillos, maduros ya. Gracias por traerlos hasta abajo.
- Zaf: ¿Traerlos a quién?
- Vigilia: A la Primera Sed. Vuestra sangre nunca fue del Conde. Es suya.
- Matis: La marca de la palma. Es la misma en las cuatro manos.
- Cor: ...Bajamos.
- Solo: Cor «La sangre no era del Conde. Alguien nos espera abajo.» · Zaf «Una Primera Sed. Una marca en la palma. Todo encaja y no encaja.» · Malak «Entonces la deuda venía de más abajo. Voy a cobrarla.» · Matis «Mi marca en la palma. La de otras tres manos también.»
- Lúa: «Eh, yo no tengo esa marca. Pero voy con vosotros igual.»

### 7.3 Tipo C: ver por primera vez un enemigo concreto

**C13 · Cortesano de Sombra (`cort`) · MT**
- Matis: Bailan a una música que no suena.
- Malak: ¿Se les paga la entrada?
- Matis: Se les cierra los ojos.
- Solo: Cor «Bailan sin música. Qué inquietante.» · Zaf «Una sombra que baila. Cuento los pasos.» · Malak «Nobles sin sueldo.» · Matis «Conozco ese baile. Lo tocaban en la corte.»

**C14 · Rosa Negra (`rosa`) · ZM**
- Zaf: Escupe pétalos en abanico.
- Malak: Bonito, pero pincha.
- Zaf: Desde lejos.
- Solo: Cor «Pétalos que cortan. Esquivar.» · Zaf «Escupe pétalos en abanico. Los veo venir.» · Malak «Una flor que cobra.» · Matis «Una rosa con espinas. Como la Reina.»

**C15 · Guardia de Hierro (`guard`) · CT**
- Cor: Mi guardia. En formación.
- Matis: Se mueven por filas.
- Cor: Lo sé. Yo marché con ellas.
- Solo: Cor «La guardia en formación. Cuánto tiempo.» · Zaf «Se mueven por filas. Hay un patrón.» · Malak «Hierro caro y sin dueño.» · Matis «Una guardia obediente. Qué pena.»

**C16 · Arquero Hueco (`arq`) · CZ**
- Zaf: Arqueros en las almenas.
- Cor: A cubierto, entonces.
- Zaf: Con calma. Cuento los disparos.
- Solo: Cor «Arqueros en lo alto. A cubierto.» · Zaf «Cuento los disparos. Hay pausas.» · Malak «Competencia. Y con mejor puntería.» · Matis «Siguen vigilando muertos.»

**C17 · Farolillo Errante (`farol`) · ZM**
- Zaf: Una luz que persigue. Estalla al tocarte.
- Malak: ¿Y luego?
- Zaf: Luego no ves.
- Solo: Cor «Luces que explotan. Las evito.» · Zaf «Un farolillo. Si estalla, pierdo mi visión.» · Malak «Linterna con mal genio.» · Matis «Luces perdidas buscando a alguien.»

**C18 · Ahogado (`ahogado`) · MT**
- Matis: Salen del agua. Dejan agua negra.
- Malak: Pisarla frena.
- Matis: Con permiso. Y con cuidado.
- Solo: Cor «Salen del agua. Cuidado con el charco.» · Zaf «Pesados y lentos. Dejan charcos.» · Malak «Gente mojada que no paga.» · Matis «Se ahogaron esperando la luz.»

**C19 · Frasco Inquieto (`frasco`) · CM**
- Malak: Un frasco que vuela. Con un alma dentro.
- Cor: Si lo rompes, estalla.
- Malak: Lo sé. Es mi oficio.
- Solo: Cor «Frascos que vuelan. Qué mal asunto.» · Zaf «Un frasco con luz dentro. Brilla distinto.» · Malak «Un alma embotellada. Esto sí lo reconozco.» · Matis «Almas que no quieren estar ahí.»

**C20 · Cobrador de Deudas (`cobrador`) · CM**
- Malak: Un cobrador. Viene a por mí.
- Cor: Roba almas.
- Malak: Me lo conozco. Se cobra primero y se pregunta luego.
- Solo: Cor «Un cobrador. Roba almas. Lo detengo.» · Zaf «Persigue al más rico. Cuidado.» · Malak «Cobrador. Mi vida, resumida.» · Matis «Quien cobra así suele deber más que nadie.»

### 7.4 Tipo D: lugares inalcanzables en la Zona 2

**D11 · La puerta con llave de los Funcionarios (área `pat6`; se abre al caer el Capitán) · CT**
- Cor: Una puerta con tres cerraduras y ninguna llave.
- Matis: La llave la tiene alguien más.
- Cor: Mi maestro. Lo sé.
- Solo: Cor «Puerta cerrada con llave. La llave la tiene quien menos esperaba.» · Zaf «Una puerta con cerradura de tres dientes. Apunto el sitio.» · Malak «Cerrada con llave. Lo bueno siempre está cerrado.» · Matis «Aquí se guardaban los secretos.»

**D12 · Las escaleras a la Capilla (selladas hasta que caiga el Capitán; área `y3`) · CT**
- Cor: Las escaleras a la capilla están selladas.
- Matis: Se abrirán al caer quien las guarda.
- Cor: Es una orden. Y una cortesía.
- Solo: Cor «Escaleras selladas. Primero, mi maestro.» · Zaf «Arriba hay luz de hoguera. Se ve por la rendija.» · Malak «Escalera cerrada. Peaje de por medio.» · Matis «Arriba hay vida. Se oye.»

**D13 · Muro agrietado de la bodega, junto a los pozos (área `cellar`) · CM** (si está Malak, ella no puede romperlo)
- Malak: Un muro agrietado, justo a la derecha de los pozos. Rompedlo, que yo no puedo.
- Cor: Con gusto.
- Malak: Y lo que haya detrás, a medias.
- Solo: Cor «Un muro agrietado. Detrás hay algo.» · Zaf «Se oye algo grande al otro lado.» · Malak «Una grieta. Y yo sin bomba. Maldita suerte.» · Matis «A veces las paredes lloran antes que la gente.»

**D14 · Saliente solo alcanzable planeando (Galería de los Ex-votos; área `y2`) · CZ**
- Zaf: Un saliente allí arriba. Con algo brillando.
- Cor: No hay forma de subir.
- Zaf: Hay una: planeando.
- Solo: Cor «Un saliente inalcanzable. Lo apunto.» · Zaf «Algo brilla en lo alto. Solo se llega planeando.» · Malak «Brilla y no llego. Mi maldición.» · Matis «Algo me llama desde arriba. Con las Alas, quizá.»

**D15 · Muro agrietado en la Galería de los Retratos (área `dep2`) · MT** (Malak no puede romperlo)
- Matis: Una grieta que llora en el muro.
- Malak: Yo no puedo romperlo.
- Matis: Yo sí. Pero con cuidado.
- Solo: Cor «Un muro agrietado. Detrás hay algo.» · Zaf «Sangre en el muro. Hay una sala detrás.» · Malak «Una grieta. Necesito una bomba.» · Matis «Este muro guarda a alguien.»

---

## 8. Lúa en las charlas: eventos propios (solo desde que está en el grupo) [PROPUESTA]

Cada uno salta **una sola vez**.

**L01 · Primera hoguera tras el rescate · cualquiera (Lúa + quien esté)**
- Lúa: ¿Esto es una hoguera de verdad? Hacía años que no tocaba una.
- Compañía: Descansa un poco.
- Lúa: Prefiero mirar cómo arde.

**L02 · Primer enemigo muerto por el látigo · cualquiera**
- Lúa: ¿Habéis visto eso? ¡Yo no tengo arco, tengo paciencia!
- Compañía: Bien hecho.
- Lúa: Lo sé. Pero me gusta que lo digas.

**L03 · Lúa y Cor (primera vez que Cor da una orden a Lúa) · CM o CZ o CT**
- Cor: Lúa, detrás de mí.
- Lúa: ¿Quién manda aquí?
- Cor: Yo.
- Lúa: Qué mala suerte la tuya.

**L04 · Lúa y Zaf (primera sala oscura tras el rescate) · Zaf**
- Lúa: No veo nada.
- Zaf: Yo sí. Agárrate a mi paso.
- Lúa: Como en el faro. Tú delante, yo detrás.
- Zaf: Nunca he dejado de ir delante.

**L05 · Lúa y Matis (primer cadáver tras el rescate) · MT**
- Lúa: Estás hablando con un muerto.
- Matis: Se llama cortesía.
- Lúa: Qué cosa tan rara y tan bonita.

**L06 · Lúa y Malak (primera tienda tras el rescate) · cualquier tienda**
- Lúa: ¿Cuánto cuesta una poción?
- Malak: Treinta. No vas a comprar nada.
- Lúa: Tú tampoco, y estás mirando.
- Malak: Es distinto. Estoy valorando.

**L07 · Lúa antes del primer jefe tras el rescate (se queda a la puerta) · cualquiera**
- Lúa: Yo os espero aquí. Con el látigo guardado.
- Compañía: Es lo mejor.
- Lúa: Por una vez, no discutiré.

**L08 · Lúa y Zaf (primera vez que hablan a solas tras el rescate, junto a la hoguera de la Capilla) · Zaf**
- Zaf: Quiero decirte algo. Sobre aquella noche.
- Lúa: Lo sé. Quien nos crió me lo contó antes de caer.
- Zaf: ¿Qué te contó?
- Lúa: Que lo hizo por mí. Y que tú no tuviste la culpa.

**Regla para zonas futuras:** cada evento nuevo debe llevar el campo `lua` con un comentario de Lúa o usar el genérico de 5.2.

---

## 9. Extras opcionales (hoguera, muerte, grupo de cuatro)

**X01 · Primera hoguera donde descansan juntos · CM**
- Malak: ¿Qué se siente al curarte con cada golpe?
- Cor: Que alguien paga la cuenta. No me gusta.
- Malak: A mí me gustaría que alguien pagara la mía.
- Solo: Cor «Descanso. Esa palabra la tenía olvidada.» · Zaf «Una llama pequeña. Me hubiera valido de faro.» · Malak «Una hoguera, una sopa, y esto sería casi una taberna.» · Matis «Una hoguera por los que no la tuvieron.»

**X02 · Primera muerte de un jugador con compañía cerca · ZT**
- (cae Zaf) Matis: Respira. Vuelvo.
- (cae Matis) Zaf: Aguanta. Aún no he visto lo que ibas a decir.
- Solo: Cor «¿Ya? Me levanto. Pero me levanto.» · Zaf «Me apagué. Encenderé de nuevo.» · Malak «Eso me va a costar caro. Y no tengo con qué.» · Matis «Me toca estar de este lado un momento. Vuelvo enseguida.»

**X03 · Primera vez que están los cuatro juntos · grupo**
- Cor: Pues ya estamos.
- Malak: ¿Quién dijo que viniéramos juntos?
- Zaf: La sangre. Nos llamó a todos.
- Matis: Entonces, juntos. Sin prisa.
- Solo (al empezar a jugar en solitario): Cor «Cuatro personas, dijo el Conde. ¿Dónde estarán las otras?» · Zaf «Siento a otras tres. Lejos. Me hace compañía.» · Malak «Tres más como yo. Espero que se les dé mejor el negocio.» · Matis «Hay otros. Los noto como pasos detrás de mí.»

---

## 10. Dudas y decisiones

### 10.1 Resueltas

- **Lúa:** es de la casa de Zaf (la cría de quien guardaba el faro), no de Malak. Se libera en las Cárceles de la Milla Verde y se une al grupo [DECIDIDO].
- **Malak:** su historia gira ahora en torno a **su valle** (140 almas en frascos), no a Lúa.
- **Mapa de la Zona 2:** el de Txaber. Desaparecen las cuatro tapas, las cuatro sendas de 6 salas y el Refugio de Isolda [DECIDIDO]. Isolda está en la Capilla.
- **La llave:** la da el primer jefe, el Capitán de Hierro [DECIDIDO].
- **Jefe final de la Parte 2:** los Regentes, Cadalso y Vigilia [DECIDIDO].
- **Capitán del diario / Capitán de Armaduras / Capitán de Hierro:** unificados en 4.5.
- **Colmillos:** son los vampiros, y cada uno lleva una parte de Anhelia (1.4).
- **Parentesco:** descendientes de Anhelia; el Conde es un siervo con la misma sangre (1).
- **Aurora y Vesper:** papel menor, sin contradecir el código (2.8).
- **«Cazadores» de la carta del Conde:** sigue valiendo (1.2).
- **Jugadores:** el código admite hasta **4** (`MAX_PLAYERS = 4`).

### 10.2 Textos del juego que marcan género (hay que corregirlos para usar Cor, Zaf, Malak y Matis)

Comprobado con búsqueda en `public/`, `README.md` y `server/`:

| Dónde | Texto | Propuesta |
|---|---|---|
| `public/art.js:16` (`HERO_NAMES`) | «Vampiro carmesí», «Vampiro azul», «Vampira esmeralda», «Vampira violeta» | «Cor Carmesí», «Zaf Azul», «Malak Esmeralda», «Matis Violeta». |
| `public/art.js:18-23` (`HERO_INFO`) | «no la curan» (verde); redacción de las demás | Reescribir sin género («no curan»). |
| `public/art.js:21` y `public/extras.js:21` (`PASSIVES.green.name`) | «Cazadora de almas» | «Caza de almas». |
| `public/extras.js:114` (`PAGES.pasR`) | «Cuatro cazadores vendrán...» | Canon. Alternativa neutra: «Cuatro vendrán, con mi misma sangre y mi misma sed...». **Decide Txaber.** Con la nueva premisa, la frase sigue valiendo. |
| `public/extras.js:1582, 1587` (`kingTalk`) | «¿Un cazador?», «No pierdas el anillo, cazador» | «¿Alguien aquí?», «No pierdas el anillo.» |
| `public/extras.js:104` (`BESTIARY.conde`) | «sus cazadores» | «a quienes lo desafían». |
| `public/game.js:383` (escena del Conde) | «Necios... Seguidme... si os atrevéis» | «Insensatos...» o «Esto no ha terminado. Seguidme... si os atrevéis». |
| `public/game.js:71, 75` | usan `HERO_NAMES` (se corrigen con la primera fila) | — |
| `README.md:25, 36-45` | «Cuatro cazadores vampiro», «Vampiro», «Cazadora de almas» | Reescribir con los nombres neutros. |

**Textos nuevos de esta decisión:** los de Vigilia, Cadalso y Anhelia se dirigen al grupo con «colmillos», «vuestra sangre», «los cuatro». Vigilia, Cadalso, Anhelia y Lúa **sí** pueden tener género propio en el guion, pero he evitado marcarlo cuando hablan de los protagonistas.

### 10.3 Abiertas (ver también ZONA2.md, sección 13)

1. **Lúa:** qué le pasa al final del juego (se queda, se va, se sacrifica).
2. **Nombres de los personajes nuevos:** Vigilia, Cadalso y Anhelia son propuesta.
3. **Género de Anhelia:** la he descrito como figura femenina por la imagen de «voz que levanta el sol». Si prefieres otra cosa, cambia solo el lenguaje descriptivo.
4. **Gradación de la revelación (4.9):** ¿te vale que al acabar la Parte 2 se sepa «la sangre es de la Primera Sed» y se reserve «es vuestra madre y se llama Anhelia»?
5. **La marca de colmillo en la palma:** idea nueva que cambia los pasados (cuatro expósitos). ¿Te gusta?
6. **Conde:** primer mortal mordido por Anhelia (mi propuesta) o hermano mayor de los cuatro.
7. **Aurora y Vesper como «canto partido de Anhelia»:** ¿te gusta el origen?
8. **La Milla Verde y la Conservera Mayor son opcionales** (la primera da a Lúa y a Zaf su mejora; la segunda, la de Malak). ¿Se dejan opcionales o se hacen obligatorias?
9. **Quien crió a Zaf y a Lúa es el Último Farero (mini-jefe).** Es una escena dura: ¿te gusta que Zaf luche contra quien lo crió?
10. **La historia nueva de Malak** (el valle de 140 almas, el Mercader como agente): ¿te gusta o preferías otra?
11. **Dos combates seguidos contra los Regentes (110 golpes en total con 2 de daño):** ¿demasiado largo? Alternativa: 96 y 104.
12. **Tamaño de la mejora de cada hito** (4.7), mejora de arma de la Zona 2, tope de curación de Cor contra jefes, recompensa del Anillo del Rey: en ZONA2.md, sección 13.
13. **`docs/HISTORIA.md` no existe** todavía.
14. **README dice «cuatro jefes»** y el mapa tiene diez (con la Zona 2, dieciséis).
15. **Aurora y Vesper:** «huirá para siempre» frente a «algún día volveréis a verlos». La Zona 2 los cita solo como eco.

---

## 11. Resumen de decisiones aplicadas

1. Parentesco: los cuatro son **descendientes de la Primera Sed** (Anhelia); el Conde es un siervo con su sangre.
2. Los «cuatro colmillos» son los vampiros; cada uno lleva un colmillo de Anhelia (sangre, noche, almas, sombra).
3. El Capitán de Cor es su **maestro**; unificado con el diario y el élite (4.5).
4. **Mapa de la Zona 2 de Txaber:** Patíbulo Exterior, Despensa, Milla Verde, Capilla del Cuartel y Dependencias de los Funcionarios, con ascensor desde La Gran Hoguera.
5. **El primer jefe es el Capitán de Hierro** y da la llave de los Funcionarios.
6. **Lúa es de la casa de Zaf**; se libera en las Cárceles de la Milla Verde.
7. **Malak:** historia nueva, el valle en frascos.
8. Isolda aliada, en la Capilla del Cuartel.
9. Nombres neutros: Cor=Carmesí, Zaf=Azul, Malak=Esmeralda, Matis=Violeta.
10. Charlas y pensamientos por 4 disparadores (A, B, C, D), en toda la Zona 1 y la Zona 2.
11. **Aurora y Vesper:** jefes de la Parte 1, papel menor (eco) en la Parte 2.
12. **Jefes finales de la Parte 2:** Cadalso y Vigilia (Regentes). **Jefa final de la Parte 3:** Anhelia, la Primera Sed.
13. Mejoras de estadística ligadas a un hito de cada vampiro (4.7).
