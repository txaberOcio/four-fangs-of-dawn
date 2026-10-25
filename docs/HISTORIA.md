# Four Fangs of Dawn: biblia de la historia

*Versión 2, 25/10/2026.*
- **Versión 1:** recogía solo lo que el juego ya cuenta.
- **Versión 2:** pasa a canon las decisiones aprobadas por Txaber el 25/10/2026, actualiza las secciones afectadas y añade la sección 9, «Textos propuestos para el juego».

**De dónde sale todo:** carpeta principal del proyecto (`C:\Users\TxaberO\Documents\Four Fangs of Dawn`, rama `main`):
- `public/extras.js`: `PAGES`, `NPC_DEFS`, `BESTIARY`, `kingTalk`, `smithTalk`, `giveHammer`, `eliteReward`, `sealBreakScene`.
- `public/world.js`: `BOSSES`, `ZONES`, `ABILITIES`, nombres de sala y élites.
- `public/art.js`: `HERO_NAMES`, `HERO_INFO`.
- `public/game.js`: escena `victory`, `albaScene`, avisos de `openGates`, avisos de las cámaras de Aurora y Vesper, `grantAbility`.
- `docs/ZONA1.md` (estado del mapa a 24/10/2026).

**Marcas:**
- **[Juego]**: canon, ya está en el juego. Lleva entre paréntesis su fuente.
- **[Decidido 25/10/2026]**: canon aprobado por Txaber, aunque todavía no esté en el juego.
- **[Narrador]**: lo decidió el Narrador. Es canon provisional y Txaber puede cambiarlo.
- **[Propuesta]**: inventado para rellenar. **No es canon** hasta que Txaber lo apruebe.
- **[Fuera del juego]**: solo aparece en el README u otros documentos.

---

## 1. Premisa

**[Juego]**
- El jugador elige uno de cuatro **vampiros**: Vampiro carmesí, Vampiro azul, Vampira esmeralda y Vampira violeta (`HERO_NAMES`; «Elige tu vampiro», `index.html`). Cada uno tiene su arma y su pasiva (`HERO_INFO`).
- El Conde los esperaba: «Cuatro cazadores vendrán, con mi misma sangre y mi misma sed» (`PAGES.pasR`).
- El Rey los llama «cazador» (`kingTalk`). El Conde quiere «enterrar a sus cazadores en el foso» (`BESTIARY.conde`).
- El ascensor «solo baja a quien lleva cuentas pendientes con el Alba» (`PAGES.rai`).

**[Decidido 25/10/2026] Los cuatro son los Hijos del Alba (decisión 1-A).**
- Aurora y Vesper, los hermanos del Alba, los convirtieron en vampiros. Son sus **colmillos**: los *Four Fangs of Dawn*, los cuatro colmillos del Alba. Esto explica el título.
- Los hermanos los abandonaron. Ahora vuelven al castillo a cobrarse esa deuda.
- Por eso tienen la «misma sangre» que el Conde y «cuentas pendientes con el Alba».

**[Propuesta]** Detalles para rellenar (pendientes de aprobar):
- **Cazadores.** Cuando los hermanos estaban unidos, los cuatro cazaban para ellos. De ahí que el Conde y el Rey los llamen «cazadores».
- **El destierro.** Cuando los hermanos se enfrentaron, ninguno quiso que el otro se quedara con los colmillos. Por eso les **quitaron sus poderes y sus nombres** y los echaron del castillo.
  - Esto explica que los protagonistas no tengan nombre.
  - Sus nombres pueden recuperarse en zonas futuras.
- **Las reliquias.** Las «reliquias» que dejan los jefes (Impulso, Doble salto, Salto de pared, Pisotón) son **los poderes de los cuatro**. Los hermanos se los quitaron y los repartieron entre sus guardianes. Las Alas del Alba y el Ojo de la Noche, en cambio, son poder de los propios hermanos.
- **El Conde.** Recibió la sangre de los hermanos, igual que los cuatro: de ahí «mi misma sangre». Esto se deduce de la decisión 1-A, pero no está escrito en el juego.
- **Por qué ahora.** Con los hermanos peleados, el castillo se debilita y sus puertas ceden. Esta parte es la menos atada; se puede cambiar.

**[Fuera del juego]** El README los llama «cazadores vampiro» y «vampire hunters». Hay que corregirlo: ver la sección 9, apartado C.

---

## 2. El mundo

### El castillo
**[Juego]**
- Era el castillo de un rey. «Soy el rey de este castillo. O lo era, hasta que el Conde abrió las puertas a los hermanos del Alba» (`kingTalk`).
- Hubo un «cerco» y la reina Isolda huyó antes (`kingTalk`).
- El Conde «cerró las puertas»; los hombres del Capitán se quedaron vacíos esperando órdenes (`PAGES.corr`, `BESTIARY.kn`).
- El Conde soltó a los presos y encadenó a los carceleros (`PAGES.caden`).
- La sangre lo ha corrompido todo: los libros «pidieron sangre» (`PAGES.lect`) y el Obispo rezaba «hasta que la sangre le respondió» (`BESTIARY.bishop`).
- Escala de tiempo: «siglos» (`kingTalk`, `smithTalk`), «cien años» (`NPC_DEFS.prisoner`).
- Bajo el castillo crece un **musgo** vivo que habla (`PAGES.cel`, `PAGES.ant`, `BESTIARY.madre`).

**[Propuesta]**
- **Abrir y cerrar.** El Conde abrió las puertas a los hermanos y luego las cerró a todos los demás. Así cuadran el Rey y el Capitán (texto T2).
- **Dos cárceles.** Los Calabozos de arriba eran la cárcel del Conde. Los Calabozos Profundos son la cárcel del Alba: allí van quienes tienen «cuentas pendientes con el Alba», y la guarda el Alcaide (texto T18).
- **El musgo** nació de la sangre que los hermanos derramaron la primera vez que se pelearon. Por eso habla «con la voz de los dos» (`PAGES.ant`; texto T20).

### Los hermanos del Alba: Aurora y Vesper
**[Juego]**
- Son hermanos rivales y comparten un emblema: «media luna y medio sol» (`NPC_DEFS.oracle`).
- Aurora es el sol; Vesper, la noche (`BESTIARY.aurora`, `BESTIARY.vesper`, `PAGES.cielo1`).
- Son los señores del Conde (`BESTIARY.conde`, `PAGES.pasR`).
- Encargaron los dos sellos del Trono (`PAGES.arch1`) y dejaron una orden al Alcaide (`PAGES.ant`).
- Estuvieron unidos y se separaron: «El alba y el ocaso no se pueden separar. Eso fue lo que olvidamos» (`NPC_DEFS.rivalV`; también `NPC_DEFS.rivalA` y `PAGES.cumbre`).

**[Decidido 25/10/2026]** Son quienes convirtieron y abandonaron a los cuatro (1-A).

**[Decidido 25/10/2026]** Tras la elección, el hermano que sobrevive **se queda en la Cumbre del Alba** cuidando al caído, que sigue vivo pero no despierta (2-A). En zonas futuras se irán a «otras torres» (`NPC_DEFS.oracle`).

### El Conde y los sellos
**[Juego]**
- «Siervo de los hermanos del Alba y portero de su castillo» (`BESTIARY.conde`).
- Era soldado: el Alcaide fue su compañero de armas (`BESTIARY.alcaide`).
- Su carta termina con «Quizá, al fin, alguien me detenga» (`PAGES.pasR`).
- Dos sellos cierran la Sala del Trono: uno de tinta, que guarda el Archimago, y otro de hueso, que guarda la Reina de Huesos (`NPC_DEFS.archivist`, `PAGES.arch1`, `PAGES.cat1`).

**[Decidido 25/10/2026]** Los hermanos sellaron el Trono **para encerrar al Conde** (5-A). Es su portero y también su prisionero: no puede salir de la Sala Real.

**[Narrador, Txaber puede cambiarlo]** Al ser derrotado, **el Conde muere** (pregunta 3, opción B). *Por qué B y no C:* su carta ya pide que alguien lo detenga, y morir lo libera sin tener que añadir un NPC nuevo al código; con C habría que poner al Conde en algún sitio después del foso.

**[Propuesta]** Al morir se deshace en ceniza, y su despedida empuja a los cuatro hacia sus señores (texto T9).

### El orden del poder
1. **Aurora y Vesper**, en las Torres del Alba.
2. **El Conde**: siervo y portero, encerrado en su trono por los dos sellos [Decidido 25/10/2026].
3. **Guardianes de los sellos**: Archimago Silente (tinta) y Reina de Huesos (hueso).
4. **Guardianes de las reliquias**: Gárgola, Obispo, Guardián del Reloj, Alcaide Verdín. Que guarden los poderes robados a los cuatro es [Propuesta].
5. **Tropa**: armaduras vacías, guardia caída, almas penitentes.
6. **Fuera de la cadena**: el Rey Destronado, el Herrero exiliado y la Madre Moho (el musgo).

---

## 3. Personajes

Para cada uno: qué quiere, qué sabe y qué le pasa al final.

### Protagonistas: los cuatro colmillos
- **[Juego]** Vampiro carmesí (Espada, *Sed de sangre*), Vampiro azul (Lanza, *Visión nocturna*), Vampira esmeralda (Arco, *Cazadora de almas*), Vampira violeta (Guadaña, *Piel de sombra*) (`HERO_INFO`).
- **[Decidido 25/10/2026]** Son los Hijos del Alba: Aurora y Vesper los convirtieron y los abandonaron.
  - **Qué quieren:** cobrar la deuda.
  - **Qué saben:** quién los hizo.
  - **Al final de la Zona 1:** han vencido a uno de los hermanos y han recuperado parte de lo suyo.
- **[Propuesta]** Les quitaron los poderes y el nombre. Los nombres siguen sin decidir; se recomienda no ponerlos todavía.

### Jefes (orden de `docs/ZONA1.md`)
- **Gárgola de Piedra.** «Guardiana del primer umbral. Llora piedra» (`BESTIARY.garg`). El Monje cree que era su hermana (`NPC_DEFS.monk`). Da el Impulso.
- **Obispo Caído.** «Rezaba por el castillo hasta que la sangre le respondió» (`BESTIARY.bishop`; `PAGES.naveP`). Da el Doble salto.
- **Guardián del Reloj.** «Engranaje viviente que se protege con la luz» (`BESTIARY.clock`). Da el Salto de pared. **[Propuesta]** Es la creación del Relojero, que es el élite Relojero Oxidado (texto T8).
- **Reina de Huesos.** **[Juego]** Guarda el sello de hueso, encerrada bajo la Mazmorra. «El Conde nunca bajó a verme» (`PAGES.cat1`). **[Decidido 25/10/2026]** **No es la Reina Isolda** (4-A). Es la **esposa del Conde**. **[Propuesta]**
  - La llaman «reina» porque reina sobre los muertos de la cripta. El Prisionero ya dice «donde reina la Reina de Huesos» (`NPC_DEFS.prisoner`).
  - Guarda el sello que encierra a su propio esposo. El Conde «nunca bajó a verla» porque no podía salir.
  - Textos T5 y T6.
- **Archimago Silente.** Guarda el sello de tinta por encargo de los hermanos (`PAGES.arch1`). **[Decidido 25/10/2026]** Ese sello sirve para encerrar al Conde (texto T4).
- **El Conde.**
  - **Qué quiere:** **[Juego]** enterrar a los cuatro en el foso (`PAGES.pasR`), aunque en el fondo desea que alguien lo detenga.
  - **Qué sabe:** que los cuatro vendrían.
  - **Al final:** **[Narrador]** muere tras la pelea del foso. **[Propuesta]** Se deshace en ceniza y manda a los cuatro hacia sus señores (texto T9).
- **Aurora, Dama del Alba** y **Vesper, Señor del Ocaso.** **[Juego]** Solo se vence a uno; el otro lo rescata (`NPC_DEFS.oracle`, `albaScene`). Dan las Alas del Alba o el Ojo de la Noche (`world.js BOSSES`). **[Decidido 25/10/2026]**
  - El superviviente se queda en la Cumbre cuidando al caído (2-A).
  - Fueron ellos quienes hicieron y abandonaron a los cuatro (1-A).
  - **Qué quieren:** no lo dice el juego. Por las frases de la Cumbre, parece que querrían volver a estar juntos.
- **Alcaide Verdín.** **[Juego]** Compañero de armas del Conde. Guarda las llaves con la orden de no abrir «hasta que los hermanos vuelvan juntos» (`PAGES.ant`, `BESTIARY.alcaide`). Da el Pisotón de Raíces. **[Propuesta]** Es el carcelero de la cárcel del Alba y quien manda en el ascensor (texto T18).
- **La Madre Moho.** **[Juego]** «El corazón del musgo» (`BESTIARY.madre`). **[Propuesta]** Nació de la sangre de los hermanos (texto T20).

### Élites con nombre
- **[Juego]** Capitán de Armaduras, Bibliotecario Maldito, Carcelero, Espectro Penitente, Relojero Oxidado, Verdugo Cubierto de Musgo (lleva el Martillo Latente) y Vigía de las Cenizas (`world.js`).
- **[Propuesta]** Cambiar el nombre «Vigía de las Cenizas» para que no se confunda con el Vigía del Cielo (texto T21).

### NPC
- **[Juego]** Sin cambios respecto a la versión 1:
  - Mercader.
  - Archivista Loco.
  - Prisionero Enloquecido.
  - Monje Trastornado.
  - Oráculo del Alba.
  - Rey Destronado: quiere que el anillo llegue a Isolda (`kingTalk`).
  - Vigía del Cielo.
  - Herrero de la Cueva: forjó la espada del Conde y las dagas de los hermanos; con el Martillo se muda al Santuario (`PAGES.fragua`, `smithTalk`).
  - Jardinero Ciego.
  - Reina Isolda: no sale en pantalla; está «más allá de La Gran Hoguera» (`kingTalk`).

---

## 4. Zonas

La Zona 1 es todo el mapa actual (`docs/ZONA1.md`). Las regiones, en orden de recorrido:

1. **Vestíbulo.** Entrada y guardia. El Capitán selló el pasillo (`PAGES.corr`).
2. **Calabozos de entrada.** Desvíos sin textos.
3. **Capilla.** El Obispo y su dios con su propia voz (`PAGES.naveP`).
4. **Biblioteca.** Los libros bebieron sangre (`PAGES.lect`).
5. **Calabozos y Catacumbas Reales.** Era la cárcel del Conde (**[Propuesta]**). Bajo ella está encerrada la esposa del Conde, la Reina de Huesos (**[Decidido 25/10/2026]**).
6. **Torre del Reloj.** El reloj «para detener el tiempo» (`PAGES.galeria`).
7. **Archivo Prohibido.** Aquí está el sello de tinta (`PAGES.arch1`).
8. **Sala Real.** La prisión del Conde: los sellos lo encierran aquí (**[Decidido 25/10/2026]**). En el foso muere (**[Narrador]**).
9. **Torres del Alba.** El hogar de los hermanos. Tras la elección, el superviviente se queda en la Cumbre (**[Decidido 25/10/2026]**).
10. **Calabozos Profundos.** La cárcel del Alba, tomada por el musgo (**[Propuesta]**; `PAGES.rai`, `PAGES.ant`).
11. **Cueva del Abismo.** La forja del Herrero y **La Gran Hoguera**, final de la Zona 1. **[Propuesta]** Al llegar se muestra un texto de cierre (texto T23).

**Zona 2 y siguientes:** por diseñar. **[Juego]** Allí está la Reina Isolda (`kingTalk`), y a los hermanos se les volverá a ver «en otras torres» (`NPC_DEFS.oracle`).

---

## 5. Misiones secundarias

- **El Anillo del Rey.** **[Juego]** Se recibe en la Escalera Real y hay que llevarlo a la Reina Isolda, más allá de La Gran Hoguera (Zona 2) (`kingTalk`). **[Decidido 25/10/2026]** Isolda no es la Reina de Huesos, así que la misión sigue tal cual. **[Propuesta]** Al llegar a La Gran Hoguera con el anillo, un recordatorio (texto T23).
- **El Martillo Latente.** **[Juego]** El Verdugo Cubierto de Musgo (Celdas Cubiertas) lo suelta. Hay que llevárselo al Herrero, que entonces se muda al Santuario de las Sombras y ofrece todos los poderes (`smithTalk`, `eliteReward`).

---

## 6. Línea temporal

### Antes del juego
1. **[Juego]** Un rey gobierna el castillo con la Reina Isolda (`kingTalk`).
2. **[Juego]** El Herrero forja la espada del Conde y las dagas de los hermanos (`PAGES.fragua`).
3. **[Juego]** Aurora y Vesper, de niños, escriben juntos (`NPC_DEFS.rivalA`).
4. **[Decidido 25/10/2026]** Los hermanos convierten a los cuatro en sus colmillos. **[Propuesta]** También dan su sangre al Conde, y los cuatro cazan para ellos.
5. **[Juego]** Hay un cerco. Isolda huye antes (`kingTalk`).
6. **[Juego]** El Conde abre las puertas a los hermanos y el Rey pierde el trono (`kingTalk`). **[Propuesta]** Después las cierra a todos los demás (`PAGES.corr`, texto T2).
7. **[Juego]** El Conde suelta a los presos y encadena a los carceleros (`PAGES.caden`).
8. **[Juego]** Los hermanos se separan: «Eso fue lo que olvidamos» (`NPC_DEFS.rivalV`). **[Propuesta]**
   - En su primera pelea derraman sangre y nace el musgo.
   - No queriendo que el otro se quede con los colmillos, quitan a los cuatro sus poderes y sus nombres y los destierran.
   - Reparten esos poderes entre sus guardianes: son las reliquias.
9. **[Decidido 25/10/2026]** Los hermanos sellan la Sala del Trono para encerrar al Conde. El sello de tinta va al Archimago y el de hueso a la Reina de Huesos, esposa del Conde, encerrada bajo la Mazmorra (`PAGES.arch1`, `PAGES.cat1`).
10. **[Juego]** Dejan al Alcaide las llaves de los Calabozos Profundos: no abrir hasta que vuelvan juntos. Nunca vuelven juntos (`PAGES.ant`).
11. **[Juego]** El castillo enloquece: los libros, el Obispo, el Relojero, el musgo.
12. **[Juego]** El Herrero pierde su Martillo y acaba en manos del Verdugo (`smithTalk`).
13. **[Juego]** Pasan siglos. El Conde escribe su última carta: vendrán cuatro cazadores de su sangre (`PAGES.pasR`).

### Durante el juego
| Etapa | Qué pasa |
|---|---|
| — | **[Propuesta]** Escena de inicio: los cuatro colmillos vuelven al castillo (texto T1). |
| 0–3 | **[Juego]** Gárgola (Impulso), Obispo (Doble salto), Reina de Huesos y Guardián del Reloj (sello de hueso y Salto de pared) y Archimago (sello de tinta). **[Propuesta]** Cada reliquia es un poder robado que vuelve a su dueño. |
| 4 | **[Juego]** El suelo del trono se rompe y todos caen al foso. **[Narrador]** El Conde, libre de los sellos y vencido, muere. **[Propuesta]** Se deshace en ceniza y los manda arriba (texto T9). |
| 5 | **[Juego]** Escalera Real: el Rey y el anillo. Oráculo y elección. Cae Aurora o Vesper y el otro lo rescata. **[Decidido 25/10/2026]** Se lo lleva a la Cumbre. |
| 6 | **[Juego]** Cumbre: el superviviente cuida al caído. Santuario, Calabozos Profundos y Alcaide (Pisotón). Desvío del Martillo. |
| 7 | **[Juego]** Cae la Madre Moho. |
| 8 | **[Juego]** Caída a La Gran Hoguera. **[Propuesta]** Texto de fin de la Zona 1 (texto T23). |

---

## 7. Canon y cosas por decidir

### Decisiones aprobadas por Txaber (25/10/2026)
| Nº | Decisión |
|---|---|
| 1-A | Los cuatro son **Hijos del Alba**: Aurora y Vesper los convirtieron (sus «colmillos») y los abandonaron. Vuelven a cobrarse la deuda. |
| 2-A | Tras la elección, Aurora o Vesper **se queda en la Cumbre** cuidando al caído. En zonas futuras se irán a «otras torres». |
| 4-A | La **Reina de Huesos no es la Reina Isolda**. Es la esposa del Conde. |
| 5-A | Los hermanos **sellaron el Trono para encerrar al Conde**. |

### Decidida por el Narrador (Txaber puede cambiarla)
| Nº | Decisión | Por qué |
|---|---|---|
| 3-B | **El Conde muere** al caer en el foso. | Su carta ya pide que lo detengan, y no obliga a añadir un NPC nuevo al código. |

### Propuestas pendientes de aprobar
1. Los cuatro cazaban para los hermanos; por eso los llaman «cazadores».
2. Los hermanos quitaron a los cuatro **sus poderes y sus nombres** y los desterraron.
3. Las **reliquias** de los jefes son esos poderes robados.
4. El Conde recibió la sangre de los hermanos.
5. El Conde abrió las puertas a los hermanos y las cerró a los demás (T2).
6. Hay dos cárceles: la del Conde (Calabozos) y la del Alba (Calabozos Profundos, del Alcaide) (T18).
7. El musgo nació de la sangre de la primera pelea de los hermanos (T20).
8. El Relojero es el élite Relojero Oxidado y el Guardián del Reloj es su creación (T8).
9. La Reina de Huesos se llama así porque reina sobre los muertos (T6).
10. Renombrar al élite «Vigía de las Cenizas» (T21) y la sala «Galería de Zarzas» (T22).
11. Escena de inicio (T1) y texto de fin de la Zona 1 (T23).

### Sigue por decidir
- Los nombres de los cuatro. Se recomienda no ponerlos todavía.
- Qué fue el «cerco» y quién lo hizo.
- Por qué se pelearon Aurora y Vesper.
- Si el Mercader es uno solo o varios.
- Quién escribió la *Carta sin firmar* (`PAGES.cielo1`). Por el «Hermano» parece de Aurora.

---

## 8. Huecos y contradicciones

Cada punto dice cómo queda: **arreglado con texto** (Tn = número de texto de la sección 9), **arreglado por decisión** o **abierto**.

### Contradicciones entre textos del juego
1. **¿Huyen lejos o se quedan en la Cumbre?** El Oráculo y `albaScene` dicen que huye lejos, pero el superviviente aparece en la Cumbre. → **Arreglado por decisión 2-A y con texto:** T10, T12, T13, T14, T15.
2. **El Santuario no es premio de Vesper.** El Oráculo y el aviso de la cámara lo prometen, pero el Santuario se abre al caer el Conde y es para todos. → **Arreglado con texto:** T11, T16.
3. **¿De quién es el castillo?** «Mi castillo» (Rey) frente a «su castillo» (`BESTIARY.conde`). → **Arreglado con texto:** T3.
4. **«Nunca volvieron» y «solo veo una»**, cuando los dos hermanos están en el castillo. → **Arreglado con texto:** T19 («Nunca volvieron *juntos*») y T17 (el Vigía escribe después de la elección).
5. **El Conde abrió o cerró las puertas.** → **Arreglado con texto:** T2.
6. **Orden del Herrero en el ascensor**, antes de que el Herrero viva allí. → **Arreglado con texto:** T18 (la orden pasa a ser del Alcaide).
7. **¿Muere el Conde?** → **Arreglado por decisión 3-B (Narrador) y con texto:** T9.

### Nombres que se pueden confundir
- **Dos reinas.** → **Arreglado por decisión 4-A y con texto:** T5, T6 (la Reina de Huesos es la esposa del Conde).
- **Dos vigías.** → **Propuesta de texto:** T21 (cambio de nombre del élite).
- **Tres relojeros.** → **Arreglado con texto:** T8.
- **Dos cárceles.** → **Arreglado con texto:** T18 (la de abajo es la del Alba).
- **Galería de Zarzas y Pasaje de Zarzas.** → **Propuesta de texto:** T22 (cambio de nombre de la sala).

### Huecos grandes
- **No hay premisa contada en el juego.** → **Texto nuevo:** T1 (escena de inicio).
- **Los protagonistas no tienen nombre.** → **Abierto.** Con la propuesta del destierro, no tener nombre pasa a formar parte de la historia.
- **No hay final de la Zona 1.** → **Texto nuevo:** T23.
- **El título** no se explica. → **Arreglado por 1-A y con texto:** T1.
- **El musgo.** → **Propuesta de texto:** T20.
- **Por qué los hermanos sellaron el trono.** → **Arreglado por 5-A y con texto:** T4, T5, T7.
- **Qué son las reliquias.** → **Propuesta**, sin texto propio todavía. T1 lo insinúa («os quitaron vuestros poderes»).
- **Regiones y élites sin texto** (Calabozos de entrada, Jardín Colgante, Mazmorra de Nubes, Bibliotecario Maldito, Espectro Penitente). → **Abierto.** Ideal para diarios nuevos más adelante.

### Fuera del juego (README)
→ Cambios propuestos en la sección 9, apartado C.

---

## 9. Textos propuestos para el juego

**Estado (25/10/2026):** T1 a T19, T23 y R1 a R6 están **metidos en el juego** (aprobados por Txaber). T20, T21 y T22 siguen siendo propuestas opcionales. Los textos actuales están copiados tal cual de la carpeta principal (`C:\Users\TxaberO\Documents\Four Fangs of Dawn`).

**Límites:**
- Las frases de diálogo, los avisos y los textos de escena tienen como mucho 160 letras por frase. Están contadas y todas cumplen.
- Los diarios y los textos del bestiario son un párrafo corto.
- Ninguno usa teclas, así que no hace falta `{act}`, `{dash}` ni `{down}`.

### A. Arreglos de textos que ya existen

**T2. `PAGES.corr` (Diario del Capitán)** · contradicción 5
- Actual: «Cuando el Conde cerró las puertas ordené sellar el pasillo bajo la galería. Mis hombres se quedaron de pie, vacíos, esperando una orden que nunca llegó. Yo sigo vigilando.»
- Nuevo: «Cuando el Conde abrió las puertas a los hermanos del Alba y las cerró a todos los demás, ordené sellar el pasillo bajo la galería. Mis hombres se quedaron de pie, vacíos, esperando una orden que nunca llegó. Yo sigo vigilando.»

**T3. `BESTIARY.conde.text`** · contradicción 3 y decisión 5-A
- Actual: «Siervo de los hermanos del Alba y portero de su castillo. Rompe el suelo de su trono para enterrar a sus cazadores en el foso, y alza pilares de sangre.»
- Nuevo: «Siervo de los hermanos del Alba, que lo encerraron en el trono del castillo que él les entregó. Rompe el suelo para enterrar a sus cazadores en el foso y alza pilares de sangre.»

**T4. `PAGES.arch1` (Nota del Archimago)** · decisión 5-A
- Actual: «Los hermanos del Alba me pidieron guardar un sello de tinta. Lo escondí tras mil páginas y me quedé a vigilarlo. Los libros ya no responden; solo susurran mi nombre.»
- Nuevo: «Los hermanos del Alba me pidieron guardar un sello de tinta: mientras exista, el Conde no saldrá de su trono. Lo escondí tras mil páginas y me quedé a vigilarlo. Los libros ya no responden; solo susurran mi nombre.»

**T5. `PAGES.cat1` (Lamento de la Reina)** · decisiones 4-A y 5-A
- Actual: «Mi sello es de hueso porque los huesos no mienten. Me encerraron bajo la Mazmorra para guardarlo, y los muertos me hacen compañía. El Conde nunca bajó a verme.»
- Nuevo: «Mi sello es de hueso porque los huesos no mienten. Los hermanos me encerraron bajo la Mazmorra para que mi esposo no saliera de su trono. Los muertos me hacen compañía. El Conde nunca bajó a verme.»

**T6. `BESTIARY.reina.text`** · decisión 4-A (el consejo, `tip`, no cambia)
- Actual: «Guardiana del sello de hueso. Salta con todo su peso, embiste y llama a los esqueletos de la cripta.»
- Nuevo: «Esposa del Conde y guardiana del sello de hueso que lo encierra. La llaman reina porque reina sobre los muertos. Salta, embiste y llama a los esqueletos de la cripta.»

**T7. `NPC_DEFS.archivist.lines[0][4]`** · decisión 5-A (159 letras)
- Actual: «Dicen que dos sellos cierran la Sala del Trono: uno de tinta, sobre el Observatorio, y otro de hueso, bajo la Mazmorra de Hierro. ¡Sin ambos, el Conde no abre!»
- Nuevo: «Dicen que dos sellos cierran la Sala del Trono: uno de tinta, sobre el Observatorio, y otro de hueso, bajo la Mazmorra de Hierro. ¡El Conde vive encerrado ahí!»

**T8. `PAGES.galeria` (Cuaderno del Relojero)** · confusión de los tres relojeros
- Actual: «Los engranajes no descansan. Las sierras recorren su raíl y los centinelas mis pasillos. Construí el reloj para detener el tiempo; él me detuvo a mí.»
- Nuevo: «Los engranajes no descansan. Las sierras recorren su raíl y los centinelas mis pasillos. Construí el reloj para detener el tiempo; él me detuvo a mí. Mi Guardián vigila la Cámara; yo me oxido en la torre.»
- Comprobado en `world.js`: el Guardián está en la Cámara del Reloj (`clkC`) y el Relojero Oxidado, en la Torre del Reloj (`torre`).

**T9. Escena de victoria sobre el Conde, `public/game.js`, `on('victory', ...)`** · contradicción 7 y decisión 3-B
- Actual (cadena del código): `'¡EL CONDE HA CAÍDO!\n\n«Necios... esto no ha terminado.\nMis señores, Aurora y Vesper,\nme esperan más arriba, en las torres del alba.\nSeguidme... si os atrevéis.»\n\nTiempo: '`
- Nuevo: `'¡EL CONDE HA CAÍDO!\n\n«Por fin... los sellos están rotos, y yo con ellos.\nAurora y Vesper os esperan más arriba,\nen las torres del alba.\nSubid, colmillos... y cobrad lo que os deben.»\n\nEl Conde se deshace en ceniza.\n\nTiempo: '`
- El resto de la línea (el cálculo del tiempo) no cambia.

**T10. `NPC_DEFS.oracle.lines[0][2]`** · contradicción 1 y decisión 2-A (125 letras)
- Actual: «Solo podréis derrotar a UNO. Cuando uno caiga, el otro acudirá, lo recogerá y huirá para siempre.»
- Nuevo: «Solo podréis derrotar a UNO. Cuando uno caiga, el otro acudirá, lo recogerá y se lo llevará a la Cumbre. No volverá a luchar.»

**T11. `NPC_DEFS.oracle.lines[0][4]`** · contradicción 2 (149 letras; la actual tiene más de 160)
- Actual: «Si BAJAS por el hueco del centro del suelo, te enfrentarás a VESPER. Su premio: el OJO DE LA NOCHE. Verás los secretos tras los muros agrietados, tu luz crecerá y se te abrirá un santuario secreto de poderes de sombra.»
- Nuevo: «Si BAJAS por el hueco del centro del suelo, te enfrentarás a VESPER. Su premio: el OJO DE LA NOCHE. Verás tras los muros agrietados y tu luz crecerá.»

**T12. `NPC_DEFS.oracle.lines[2][0]`** · contradicción 1 y decisión 2-A (128 letras)
- Actual: «El rival que sobrevivió se ha llevado a su hermano lejos. Algún día volveréis a verlos... en otras torres.»
- Nuevo: «El rival que sobrevivió se ha llevado a su hermano a la Cumbre y allí lo cuida. Algún día volveréis a verlos... en otras torres.»

**T13. Texto de `albaScene`, `public/game.js`** · contradicción 1 y decisión 2-A
- Actual (trozo del código): `(killed === 'aurora' ? 'la recoge y huye con ella!' : 'lo recoge y huye con él!')`
- Nuevo: `(killed === 'aurora' ? 'la recoge y se la lleva a la Cumbre!' : 'lo recoge y se lo lleva a la Cumbre!')`
- Ejemplo en pantalla: «Aurora, Dama del Alba ha caído... / ¡Vesper, Señor del Ocaso acude, / la recoge y se la lleva a la Cumbre! / Ya no podrás enfrentarte a Vesper.»
- La animación sigue igual: el que rescata sube con el caído hacia arriba, así que encaja.

**T14. `BESTIARY.aurora.text`** · decisión 2-A
- Actual: «Hermana de Vesper y señora del Conde, vuela entre rayos de luz. Si cae, su hermano la rescata y huye. Premio: Alas del Alba.»
- Nuevo: «Hermana de Vesper y señora del Conde, vuela entre rayos de luz. Si cae, su hermano la rescata y se la lleva a la Cumbre. Premio: Alas del Alba.»

**T15. `BESTIARY.vesper.text`** · decisión 2-A
- Actual: «Hermano de Aurora y señor del Conde, un cazador de sombras que embiste, se teletransporta y alza pilares. Si cae, su hermana lo rescata y huye. Premio: Ojo de la Noche.»
- Nuevo: «Hermano de Aurora y señor del Conde, un cazador de sombras que embiste, se teletransporta y alza pilares. Si cae, su hermana lo rescata y se lo lleva a la Cumbre. Premio: Ojo de la Noche.»

**T16. Aviso (toast) al entrar en la Cámara de Vesper, `public/game.js`** (el que comprueba `ar.id === 'albaA' || ar.id === 'albaB'`) · contradicción 2 (141 letras)
- Actual: «Cámara de Vesper: si lo vences, Aurora se lo llevará y no podrás enfrentarte a ella. Premio: Ojo de la Noche y el Santuario de las Sombras.»
- Nuevo: «Cámara de Vesper: si lo vences, Aurora se lo llevará y no podrás enfrentarte a ella. Premio: Ojo de la Noche (ves tras los muros agrietados).»

**T17. `PAGES.cumbre` (Diario del Vigía)** · contradicción 4
- Actual: «Llevo años mirando el horizonte desde aquí. Antes eran dos luces, una al amanecer y otra al ocaso. Ahora solo veo una, y me parece más triste que la oscuridad.»
- Nuevo: «Llevo años mirando el horizonte desde aquí. Antes eran dos luces, una al amanecer y otra al ocaso, y se cruzaban cada día. Hace años que no se cruzan. Hoy solo veo una, y me parece más triste que la oscuridad.»

**T18. `PAGES.rai` (Nota del Montacargas)** · contradicción 6 y las dos cárceles
- Actual: «Orden del Herrero: el ascensor solo baja a quien lleva cuentas pendientes con el Alba. Arriba el aire sabe a ceniza; aquí abajo, a tierra mojada. El musgo ya ha subido por el cable.»
- Nuevo: «Orden del Alcaide: el ascensor solo baja a quien lleva cuentas pendientes con el Alba. Arriba el aire sabe a ceniza; aquí abajo, a tierra mojada. El musgo ya ha subido por el cable.»

**T19. `PAGES.ant` (Última orden del Alcaide)** · contradicción 4
- Actual: «Me dejaron las llaves con una sola orden: no abrir hasta que los hermanos vuelvan juntos. Nunca volvieron. Ahora el musgo me habla con la voz de los dos y ya no sé a cuál obedezco. Quien me venza no es mi enemigo: es mi relevo.»
- Nuevo: «Me dejaron las llaves con una sola orden: no abrir hasta que los hermanos vuelvan juntos. Nunca volvieron juntos. Ahora el musgo me habla con la voz de los dos y ya no sé a cuál obedezco. Quien me venza no es mi enemigo: es mi relevo.»

**T20. `BESTIARY.madre.text`** · hueco del musgo (**opcional**: depende de aprobar la propuesta 7)
- Actual: «El corazón del musgo. No se mueve, pero su armadura de raíces solo cede ante un pisotón desde el aire.»
- Nuevo: «El corazón del musgo, nacido de la sangre que los hermanos del Alba derramaron al pelearse. No se mueve, pero su armadura de raíces solo cede ante un pisotón desde el aire.»

**T21. Nombre del élite de la Antesala del Abismo, `public/world.js`, sala `pas1`, `name: 'Vigía de las Cenizas'`** · confusión de los dos vigías (**opcional**)
- Actual: «Vigía de las Cenizas»
- Nuevo: «Fogonero de las Cenizas»
- **Aviso para quien programe:** las partidas guardan los élites vencidos por su nombre (`eliteGot`). Si se cambia el nombre, en partidas antiguas ese élite contaría como nuevo y volvería a dar su recompensa una vez.

**T22. Nombre de sala, `public/world.js`, `area('pas4', 'Galería de Zarzas', ...)`** · confusión con «Pasaje de Zarzas» (**opcional**)
- Actual: «Galería de Zarzas»
- Nuevo: «Galería de Polillas» (en esa sala hay dos polillas de esporas y ningún nombre parecido).

### B. Textos nuevos (no existen todavía en el código)

**T1. Escena de inicio** · **en el juego** (reescrita el 25/10/2026: el texto actual está en STORY_INTRO, public/extras.js)
- **Dónde iría:** al empezar una partida nueva (sin partida guardada), antes de los avisos de controles. Se mostraría en `centerTxt` (`public/game.js`), una frase tras otra.
- **Texto (4 frases):**
  1. «Hace siglos, Aurora y Vesper, los hermanos del Alba, os dieron su sangre. Fuisteis sus cuatro colmillos: cazabais para ellos.» (125)
  2. «Cuando los hermanos se enfrentaron, os quitaron vuestros poderes y vuestros nombres, y os echaron del castillo.» (111)
  3. «Esta noche las puertas ceden. Dentro esperan el Conde, sus guardianes... y los que os hicieron.» (95)
  4. «Recuperad lo que es vuestro. Cobrad lo que os deben.» (52)
- La frase 1 es la decisión 1-A. La frase 2 depende de las propuestas 1 y 2. Si no se aprueban, la frase 2 se puede cambiar por: «Os abandonaron. Ahora volvéis.»

**T23. Al llegar a La Gran Hoguera (fin de la Zona 1)** · **nuevo: no existe todavía en el código**
- **Dónde iría:** la primera vez que el jugador entra en la sala `gran` (`world.js`, «La Gran Hoguera»). Se mostraría en `centerTxt` (`public/game.js`).
- **Texto:**
  1. «La Gran Hoguera arde sin leña. Más allá, el camino baja hacia tierras que el castillo ya no gobierna.» (101)
  2. «Habéis recuperado parte de lo que os quitaron. El resto está más lejos.» (71)
  3. *Solo si se lleva el anillo* (`quests.anillo === 1`): «Si llevas el Anillo del Rey: la Reina Isolda está en algún lugar de ese camino.» (79)
  4. «FIN DE LA ZONA 1»

### C. Cambios propuestos para README.md (texto actual → nuevo)

**R1. Línea 15** (lema en inglés):
- Actual: «*Four vampire hunters, one cursed castle, one blood-red moon. A co-op metroidvania that runs in any browser.*»
- Nuevo: «*Four vampires, one cursed castle, a debt written in blood. A co-op metroidvania that runs in any browser.*»
- Motivo: «vampire hunters» significa «cazadores de vampiros», y la luna roja no sale en el juego.

**R2. Línea 25** (solo cambia el principio; el resto de la línea sigue igual):
- Actual: «Cuatro cazadores vampiro irrumpen en el castillo del Conde. Exploras un mapa conectado de más de 25 zonas, derrotas a cuatro jefes que te entregan nuevas habilidades y vuelves sobre tus pasos…»
- Nuevo: «Cuatro vampiros, los colmillos que los hermanos del Alba crearon y abandonaron, vuelven al castillo a cobrar lo que se les debe. Exploras un mapa conectado de más de 25 zonas, derrotas a jefes que te entregan nuevas habilidades y vuelves sobre tus pasos…»
- Motivo: decisión 1-A, y ya no son cuatro jefes sino diez.

**R3. Línea 48** (Torres del Alba), dos trozos:
- «al caer, el Conde huye y derriba los muros del foso» → «al caer, el Conde se deshace en ceniza y los muros del foso se derrumban»
- «porque al caer el otro lo rescata y huye» → «porque al caer el otro lo rescata y se lo lleva a la Cumbre»

**R4. Línea 49** (Cueva del Abismo), tres trozos:
- «**La Cueva del Abismo (secreto de las Alas del Alba):** al final de los pinchos largos de la Cripta Olvidada hay un hueco que da paso a una caída libre por una cueva de lava.» → «**La Cueva del Abismo (tras vencer a Aurora o a Vesper):** se baja por la Grieta Sellada, bajo la Bodega, o, con las Alas, planeando sobre los pinchos largos de la Cripta Olvidada hasta un hueco que da paso a una caída libre por una cueva de lava.»
- «(aún por decidir dónde se consigue)» → «(lo suelta el Verdugo Cubierto de Musgo, en las Celdas Cubiertas)»
- Comprobado en `world.js`: hay un hueco Bodega → Grieta Sellada, y la puerta Grieta → Caída Libre se abre al caer Aurora o Vesper.

**R5. Línea 56:**
- «la Gran Hoguera de la Capilla lo desbloquea» → «la hoguera grande de la Capilla (Nave Sur) lo desbloquea»
- Motivo: en el juego, «La Gran Hoguera» es la sala final de la Cueva del Abismo.

**R6. README.en.md, línea 5** (la versión inglesa tiene el mismo problema que R2):
- «Four vampire hunters break into the Count's castle.» → «Four vampires, the fangs the Dawn siblings made and abandoned, return to the castle to collect what they are owed.»
- No he encontrado en `README.en.md` las mismas frases de R3 a R5, pero conviene revisarlo a mano.

---

## Preguntas para Txaber

**Respondidas el 25/10/2026:** 1-A, 2-A, 4-A y 5-A (aprobadas). La 3 la decidió el Narrador: **B, el Conde muere**. Puedes cambiarla. Las cinco quedan recogidas en la sección 7.

**Pendientes (para la próxima versión):**
1. ¿Apruebas la propuesta del **destierro**: los hermanos quitaron a los cuatro sus poderes y sus nombres, y las reliquias son esos poderes? La escena de inicio (T1) la usa.
   - **A.** Sí, tal cual.
   - **B.** Solo los poderes; los nombres los conservan.
   - **C.** No; simplemente los abandonaron.
   - **Recomiendo A:** explica a la vez las reliquias y que los protagonistas no tengan nombre.
2. ¿Apruebas que el **musgo** nació de la sangre de los hermanos (T20)?
   - **A.** Sí.
   - **B.** No, el musgo es más antiguo que el castillo.
   - **C.** Dejarlo en misterio por ahora.
   - **Recomiendo A,** porque explica que el Alcaide oiga «la voz de los dos».
