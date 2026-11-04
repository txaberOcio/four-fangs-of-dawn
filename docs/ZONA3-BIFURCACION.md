# La Encrucijada de las Tres Vías (Zona 3)

*Propuesta del Narrador, 04/11/2026. Todo es [PROPUESTA] salvo lo marcado [DECIDIDO] (diseño del usuario) o [CANON] (ya escrito). Nada pasa a canon sin aprobación de Txaber. No se ha tocado `world.js` ni `art.js`.*

**Comprobado:** `ZONA3-HISTORIA.md` (Primalba, ciclo del Alba, oficios, Tornera), `public/talks.js` y `public/charlas.js`. **No comprobado:** que los seis élites existan ya en `world.js` o en `ELITE_AB` de `game.js` (en este árbol no aparecen; los nombres son los que me pasaste).

---

## 0. La idea en una página

En la **Plaza del Pregón** [DECIDIDO] el camino se bifurca en tres hasta **La Última Esquina**, donde confluyen antes de la Tornera Mayor. Las tres vías son **tres maneras de leer la misma pregunta**: *¿qué hace Primalba con quien no paga el ciclo?*

| Vía | Respuesta de la ciudad | Quién la cuenta |
|---|---|---|
| **La Calle** | **Lo usa.** Los que no pagan trabajan para el ciclo (guardia, corte, pescadores) y se les llama «vecinos». | Las jefas y los jefes: Plañidera y Nasa. |
| **Los Tejados** | **Lo olvida.** Los que no pagan se quedan «arriba», fuera de la cuenta, vigilando una calle que ya no los mira. | Vigías, serenos, palomas, gárgolas. |
| **Las Cloacas** | **Lo tira.** Los que no pagan se «desechan»: bajan al canal, se ahogan, se archivan. | Faroleros, ratas, alguaciles del agua. |

Lo que une las tres: **el ciclo es una cuenta y alguien siempre queda fuera**. Esto encaja con la Cuenta del Día de `ZONA3-HISTORIA.md` 3.3 («cada vuelta uno no vuelve»): en la calle se *ve* quién falta; arriba se ve *a quién no se cuenta*; abajo se ve *dónde acaban*. Las cunas vacías de La Última Esquina (tramo 8) son el punto donde las tres historias se cruzan.

**Regla de tono:** los textos sobre Cor, Zaf, Malak y Matis no marcan género. Frases cortas, humor negro, sin cifras inventadas.

---

## 1. Los tres caminos

### 1.1 LA CALLE · «la ciudad viva» (la de siempre)

- **Tesis:** la ciudad funciona porque cada oficio sostiene una fase. Aquí está **la cadena**: se ve quién paga y a quién se cobra.
- **Sensación:** gente, guardias, ruido de fondo, el cielo falso cambiando de hora. Peligro **visible**.
- **Mapa:** Puente de las Dos Voces → Palacio de la Corte Primera → Muelle del Faro Seco. Jefes: **Plañidera Mayor** y **Nasa** (`ZONA3-HISTORIA.md` 4.3 y 4.4).
- **Quién vive:** el hermano superviviente (Puente), el Ujier, la Barquera Sorda, los vecinos-ecos del ciclo.
- **Objeto-lugar memorable:** **el Faro Seco**, que solo Zaf puede encender.

### 1.2 LOS TEJADOS · «los olvidados de arriba» [DECIDIDO + PROPUESTA]

- **Tesis:** arriba viven **los que la ciudad dejó de contar**. Vigilan sin relevo, cantan horas que nadie escucha y cuidan cosas (palomas, tendederos, campanas) que ya no sirven al ciclo. El cielo falso es **un techo pintado**: desde aquí se ve que no hay estrellas, solo la **cuenta** del día.
- **Sensación:** aire, viento, vértigo, luz cambiante, palomas, ropa tendida de gente que no vuelve. Peligro **desde arriba y desde fuera**: se cae.
- **Cómo se entra:** el montacargas del pregonero, en la Plaza.
- **Quién vive:** **serenos** (la ciudad tenía muchos y solo se recuerda a uno), **vigías** de torre, **palomeros**, **tendedoras** (ropa de los que no volvieron), **campaneros** sin campana, gárgolas que despertaron de tanto vigilar.
- **Qué cuenta que no cuenta la calle:** *la ciudad no tiró a esta gente: se olvidó de ella.* Fueron los que llegaron «tarde» al ciclo y no tuvieron oficio. Por eso nadie los llama a relevo y siguen en su puesto.
- **Objeto-lugar memorable:** **el tendedero de la Cúpula del Jardín** (tj5): cientos de pañuelos y camisitas, **todos tamaño de bebé**, atados a una cuerda que va de cúpula a cúpula. Cada uno lleva una cinta con un nombre bordado. Los vecinos de arriba los cuelgan **cada vez que un bebé no llega al torno**. El jugador entiende que el ciclo también «se cobra» a los más pequeños. No es una pista del mapa.

### 1.3 LAS CLOACAS · «lo que se tira» [DECIDIDO + PROPUESTA]

- **Tesis:** abajo está **lo que la ciudad desecha**: el agua de la Sed (el Canal), los restos de las cosechas de noche, los frascos rotos, los vecinos que «no vuelven». Aquí se ve **el coste**. Las lámparas apagadas (de los faroleros ahogados) son **ecos de farolas** de la calle: la ciudad las apaga arriba y se encienden aquí abajo, solas, sin que nadie las pague.
- **Sensación:** oscuridad, goteo, eco, olor a hierro y a agua vieja. El jugador **enciende lámparas** para ver; cada lámpara encendida es un pedacito de ciudad que se acuerda de sí misma. Peligro **desde la oscuridad**.
- **Cómo se entra:** la boca de la alcantarilla de la Plaza.
- **Quién vive:** **faroleros** (los que apagaban y encendían), **alguaciles del agua**, **ratas** que hacen de recaderos, **bodegueros** de la Corte, el **Sifonero** (NPC posible: mide el nivel del canal y habla solo).
- **Qué cuenta que no cuenta la calle:** *la ciudad sí tiene un sitio para quien no paga, y es este.* Todo lo que Primalba quiere que no exista, existe aquí. Y aquí se **guarda** (el Aljibe, las bodegas): no se destruye, se archiva por si hace falta.
- **Objeto-lugar memorable:** **el Aljibe de la Corte** (cl5): una sala redonda llena de **agua quieta con una lámpara bajo la superficie**, encendida. En el fondo se ve una mesa puesta y sillas, como un comedor ahogado. Es el **comedor de la Corte original**, hundido cuando la Corte «cerró». Un vecino que bajó se quedó a cenar.

---

## 2. Sala a sala: qué siente el jugador

Una frase por sala. Nombres de arriba [DECIDIDO]. Las salas de la Calle son las ya previstas por `ZONA3-HISTORIA.md`.

### 2.0 Plaza del Pregón (`plz1`): la encrucijada

Tres salidas a la vista: un **montacargas de cuerda** que sube a los tejados, una **boca de alcantarilla** abierta en el suelo y la **calle** de siempre. Cartel junto a las tres: *«Todos los caminos llegan a la Esquina. Unos antes que otros.»*

### 2.1 Los Tejados (aire, viento, vértigo)

| Sala | Nombre | Qué siente el jugador |
|---|---|---|
| `tj1` | Azoteas del Pregón | Salir del montacargas a un mar de tejas: se ve la plaza entera, pequeña, con la gente-eco dando vueltas. |
| `tj2` | Cumbreras del Puente | Andar por el lomo de los tejados con el Puente de las Dos Voces debajo: se oyen las dos voces **desde arriba**, más claras que desde el puente. |
| `tj3` | Espadaña de la Orilla | Una espadaña sin campana y un viento que empuja; la orilla del canal se ve **lejos** y negra. |
| `tj4` | Cornisas de la Corte | Cornisas estrechas sobre las ventanas del Palacio: se espía **sin ser visto** el ocaso de la Corte. |
| `tj5` | Cúpula del Jardín | Una cúpula de cristal con el jardín de rosas debajo y un **tendedero de bebés** (objeto memorable). |
| `tj6` | Mirador de las Plañideras (hoguera) | Un balcón con **hoguera** desde el que se ve el cortejo de las Plañideras recorrer la calle; descanso con las lágrimas de fondo. |
| `tj7` | Jarcias del Muelle | Cuerdas y mástiles sobre el canal; **el Faro Seco** queda enfrente, apagado, tan cerca que parece alcanzable. |
| `tj8` | Cumbreras del Varadero | Cumbreras de los astilleros: se ven los barcos varados como juguetes en un estante. |
| `tj9` | Cornisa del Fondeadero | Una cornisa larga sobre el agua negra con **viento lateral**: aquí se pierde el equilibrio. |
| `tj10` | Alero de la Última Esquina | Un alero sobre la esquina: se ve **toda la calle** hacia atrás y las **cunas vacías** abajo, antes de saltar. |

### 2.2 Las Cloacas (oscuridad, goteo, eco, lámparas)

| Sala | Nombre | Qué siente el jugador |
|---|---|---|
| `cl1` | Boca del Pregón | Bajar y que la luz de la plaza se quede arriba: **primera lámpara apagada** y un goteo que marca el ritmo. |
| `cl2` | Canal del Puente | Un canal estrecho bajo el puente: se oyen los pasos de los vecinos **encima**, sin que sepan que estás. |
| `cl3` | Sifón de la Orilla | Agua que sube y baja por tramos: hay que **cronometrar** el paso con lo que se oye. |
| `cl4` | Bodegas de la Corte | Estanterías con botellas y **cajas con nombre** (lo que la Corte no quiso tirar). |
| `cl5` | Aljibe de la Corte | La sala del **comedor ahogado** (objeto memorable): una lámpara encendida bajo el agua. |
| `cl6` | Compuerta de las Plañideras (hoguera) | Una compuerta con **hoguera** donde se oyen las lágrimas de arriba caer por una reja: un respiro triste. |
| `cl7` | Lecho del Canal Seco | El lecho del canal con **huesos y restos** que de noche quedan bajo el agua: secretos a la vista. |
| `cl8` | Desagüe del Varadero | Tuberías enormes que **vomitan agua negra** a intervalos: el jugador aprende el compás. |
| `cl9` | Rejas del Fondeadero | Rejas cerradas con cosas **detrás** (cunas pequeñas, barcas de juguete): lo que se guarda y no se enseña. |
| `cl10` | Colector de la Última Esquina | Un colector enorme donde **desembocan todas las cloacas**: de las rejas salen **voces** del ciclo, como un río de nombres. |

---

## 3. Élites con nombre (6) [PROPUESTA; nombres a confirmar]

Cada uno tiene ya una habilidad en código [según tu encargo]. Aquí va solo **su nombre y 2 líneas de historia**. Si la habilidad choca con la historia, **manda la habilidad** y reescribo.

### Tejados

- **Vigía de las Cornisas.** Vigía de torre de la guardia vieja, olvidado en su puesto. Sigue montando guardia de cara al vacío porque **nadie le dijo que el relevo no vendría**. *(Cor lo reconoce: es lo que pudo ser.)*
- **Gárgola Viva.** Una gárgola de canalón que, tras siglos mirando la calle, **decidió bajar a ver**. No es mala: es curiosa, y su curiosidad pesa media tonelada.
- **Sereno de las Alturas.** Sereno que cantaba las horas desde los tejados, **hermano pequeño** del Sereno de la calle (aquel que habla con el jugador). Ya no hay nadie a quien cantar y canta igual, a destiempo. *(No confundir: es otro; puede mencionar al de abajo.)*

### Cloacas

- **Rata Mayor del Colector.** La reina de las ratas que recogen lo que cae a las alcantarillas. Lleva una **corona de huesos** y manda a las demás con chillidos que se oyen en todo el colector. Defiende lo suyo: **lo que tiran, es suyo**.
- **Farolero Ahogado.** *[Nombre definitivo, en singular.]* Encendedor de farolas de la calle, ahogado en el Aljibe cuando el canal se llenó. **Sigue con la pértiga y la llama encendida** bajo el agua: no soltó su oficio.
- **Alguacil del Aljibe.** Guardia del agua de la Corte, con un manojo de llaves de cada bodega. Cree que **aún hace falta guardarlo todo**; por eso no deja pasar. Las llaves que lleva son las de lo que la ciudad archivó.

**Nombres definitivos propuestos:** Vigía de las Cornisas · Gárgola Viva · Sereno de las Alturas · Rata Mayor del Colector · **Farolero Ahogado** · Alguacil del Aljibe.

---

## 4. Textos cortos de ambiente (carteles y diarios) [PROPUESTA]

Máximo 160 letras. Pueden ir en `PAGES` (diarios) o como carteles de sala. La asignación a sala es sugerencia; quien programe decide.

### Carteles

- **plz1 · junto a las tres vías:** «Todos los caminos llegan a la Esquina. Unos antes que otros.»
- **tj1 · montacargas:** «Sube quien no quiere que le cuenten. Se ruega no mirar abajo.»
- **tj5 · tendedero:** «Camisitas a secar. Se recogen cuando vuelva el torno.»
- **tj10 · alero:** «Última azotea. A partir de aquí, la calle.»
- **cl1 · boca:** «Aviso a los vecinos: lo que cae aquí, aquí se queda.»
- **cl4 · bodegas:** «Cajas con nombre. No se tira nada: se guarda por si acaso.»
- **cl6 · compuerta:** «Las lágrimas de arriba se recogen aquí. No se desperdician.»
- **cl10 · colector:** «Desembocadura general. Pregunte por los suyos.»

### Diarios (un párrafo)

- **`PAGES` tejados · Cuaderno del Sereno de las Alturas** (tj3 o tj4): «Canto las horas desde arriba porque desde abajo no me oyen. Ayer canté las doce y nadie salió. Hoy canté las doce y nadie salió. Mañana dirán que fue un buen día.»
- **`PAGES` tejados · Nota de la tendedora** (tj5): «Cuelgo una camisita por cada cuna que se queda vacía. Ya no queda cuerda. Pero hay tejados más largos.»
- **`PAGES` cloacas · Libro del Farolero** (cl3 o cl5): «Encendía y apagaba. El día que el canal subió, me quedé a apagar la última. No la apagué. Qué bonita se ve desde abajo.»
- **`PAGES` cloacas · Registro del Alguacil** (cl4 o cl9): «Se archiva lo que no se puede cobrar ni tirar. Se guarda lo que nadie reclama. Nadie reclama nada. Tengo todas las llaves.»

---

## 5. Cómo encaja con lo ya escrito [CANON/PROPUESTA]

- **Con el ciclo del Alba:** los jefes de la Calle (Plañidera, Nasa) siguen siendo el eje de las notas de oficio. Tejados y Cloacas **no dan nota** de oficio: dan **contexto** (a quién no cuenta el ciclo) y **hogueras** y **élites** con botín. *Decisión pendiente (ver 6.1): ¿alguna vía da un objeto que apoye la tercera vía C del final?*
- **Con el Sereno:** el Sereno de la calle es **uno**; el de las Alturas es **su hermano pequeño** y puede mencionarlo. Cuida no duplicar frases de `ZONA3-HISTORIA.md` 4.6.
- **Con la Cuenta del Día:** arriba se ve a quién **no** se cuenta; abajo, adónde van. Las cunas vacías de La Última Esquina cierran los tres hilos.
- **Con la lámpara negra del faro** (PERSONAJES 2.3, 4.3): las lámparas de las Cloacas son **réplicas pequeñas** de las farolas de arriba. Coherente con `ZONA3-HISTORIA.md` 1.4.
- **No contradice:** ningún élite repite a un jefe ni a un NPC existente. «Vigía de las Cornisas» no es el «Vigía del Cielo» (NPC de la Zona 1) ni el «Vigía de las Cenizas» (élite, T21 de HISTORIA.md).

---

## 6. Decisiones pendientes para Txaber

1. **¿Dan algo las vías más allá de botín?** Recomiendo que cada vía deje una **pista distinta** sobre La Tornera (Tejados: sus llaves; Cloacas: las cunas vacías; Calle: sus notas) y que ninguna sea obligatoria.
2. ~~Nombre del élite~~ Resuelto: **Farolero Ahogado**.
3. **¿El Sereno de las Alturas es hermano del Sereno de la calle?** Es mi propuesta; da sentido al nombre y no choca con lo escrito.
4. **El tendedero de bebés (tj5):** es la imagen más dura de las tres vías. ¿Te parece bien o lo suavizamos (camisas de adulto)?
5. **Si la ciudad «tira» a los que no pagan (Cloacas), ¿qué pasa con Lúa o con Aurora y Vesper en cada vía?** No lo he propuesto; lo dejo abierto.

---

## 7. Charlas añadidas en `public/talks.js` (ya metidas, para revisión)

| Id | Disparador | Quiénes |
|---|---|---|
| `A27` | Primera entrada a `tj1` | Zaf y Matis (con comentario de Lúa) |
| `A28` | Primera entrada a `cl1` | Malak y Matis (con comentario de Lúa) |
| `A29` | Primera entrada a `plz1` | Grupo (los cuatro) |
| `C21` | Ver al Vigía de las Cornisas | Cor y Zaf |
| `C22` | Ver a la Gárgola Viva | Zaf y Malak |
| `C23` | Ver al Sereno de las Alturas | Cor y Matis |
| `C24` | Ver a la Rata Mayor del Colector | Malak y Matis |
| `C25` | Ver al Farolero Ahogado | Zaf y Matis |
| `C26` | Ver al Alguacil del Aljibe | Cor y Malak |

Para que las `C21`–`C26` funcionen se ha cambiado `talkOnEnemy` en `public/charlas.js` (el disparador usa `enemy: '*'`, que casa con **cualquier tipo de enemigo** si el nombre del élite coincide). Hace falta que `world.js` use **exactamente** esos seis nombres en `name:` de cada élite.
