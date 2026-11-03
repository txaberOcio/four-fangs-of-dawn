# Zona 3 (Parte 3): Primalba y la Calle de las Horas

*Propuesta narrativa del Narrador, 03/11/2026. Nada de esto es canon hasta que Txaber lo apruebe. No se ha tocado el código ni ningún texto del juego.*

**Marcas:**
- **[CANON]**: ya está en el juego o en un documento aprobado (con su fuente).
- **[DECIDIDO]**: lo ha decidido Txaber para esta zona (encargo del 03/11/2026).
- **[PROPUESTA]**: invento mío, pendiente de aprobar.

**Regla de redacción (de PERSONAJES.md):** los textos que hablan de Cor, Zaf, Malak y Matis no marcan género. Los NPC y los jefes sí pueden tener género propio.

**Qué he comprobado y qué no:**
- Comprobado: `PERSONAJES.md` completo, `HISTORIA.md`, `ZONA2.md` (estado a 02/11/2026), `STORY_INTRO` (`public/extras.js:50-55`), la frase de Vigilia en `public/talks.js:572`, y que el juego sabe qué hermano ha caído (`NPC_DEFS.rivalA` y `rivalV`, `extras.js:203-207`, miran `progress.bosses`).
- Hay unas 92 llamadas a `area(` en `public/world.js` (Zona 1 + Zona 2 juntas, sin separar). Lo uso solo como orden de magnitud para el tamaño.
- No he comprobado cómo se haría un ciclo de luz en el código, ni si la «puerta gigante» del Salón de los Dos Tronos existe ya. Todo lo de jugabilidad que aparece aquí son **ideas para quien programe**, no hechos.

---

## 0. La idea en una página

1. **La ciudad se llama Primalba**, la ciudad del primer amanecer. Es la primera ciudad de mortales, nacida bajo la voz de Anhelia cuando era el Alba entera. Hoy está sepultada bajo la Hondura y viva a medias.
2. **La calle es la Calle de las Horas.** Recorrerla es recorrer **un día entero**: el Zaguán (madrugada), el Cuartel (alba), los Cotos (día), el Puente de las Dos Voces (del día al ocaso), el Palacio (ocaso), el Muelle (noche), y por fin la Última Esquina, donde las horas se rompen.
3. **Las cuatro puertas de origen son «tornos»**: ruedas de expósitos, como las de los conventos. Anhelia dejaba a cada bebé en el torno de Primalba y el torno giraba hacia **otro siglo**. Así cuatro bebés de épocas distintas llegan juntos, ya maduros, a la misma noche.
4. **El ciclo del Alba es el día de Anhelia** (alba, día, ocaso, noche) y **no es gratis**: cada día se paga con la noche de otros. Cuatro oficios de la ciudad (la guardia, los cazadores, la corte, los pescadores) **mantienen** el ciclo. Cada oficio es una fase. Cada fase es un colmillo.
5. **Cada barrio de origen domina una fase**: Cor-alba, Malak-día, Matis-ocaso, Zaf-noche. Hay gente, cosas y enemigos que solo existen en su fase.
6. **Cinco jefes nuevos**: uno por oficio y la Tornera Mayor, que guarda la última puerta. Ninguno es un enemigo ya visto.
7. **La Morada de Anhelia** no es un castillo: es **una casa**. Un hogar a escala doméstica con cuatro cunas, cuatro marcas de altura y una mesa puesta para seis, que por dentro es la boca de ella.
8. **La lucha final** son cuatro actos, uno por colmillo, cada uno en una fase del ciclo. Al final amanece sobre la decisión.
9. **Tres finales abiertos**: devolverle los colmillos (reunirse), quitarle la sed (detenerla) o repartir el alba entre seis voces (la tercera vía, con condiciones).

**Lo que ya está escrito y esta propuesta respeta [CANON]:**
- Anhelia (aspecto, sed, cuatro huecos en la boca, sombra de copa, «Elegid bien»): `PERSONAJES.md` 2.7.
- Aurora y Vesper son su canto partido, el Conde es el primer mortal que mordió, los Regentes la sirven por la lengua y la última nota: 2.6, 2.8, 2.9.
- Qué se sabe al acabar la Parte 2 y qué se reserva: 4.9.
- Los cuatro viven de bebés en cuartel, faro, casa de cazadores y palacio: 2.1 a 2.4.
- Las lámparas de la Hondura se alimentan de almas, y hubo una lámpara negra en el faro: 2.2, 2.3, 4.3, 4.4.
- La sala de los Dos Tronos y los Regentes como final de la Parte 2: 2.6, 4.8.
- **[DECIDIDO]** La puerta gigante al fondo del Salón de los Dos Tronos, y las reglas de esta zona (encargo del 03/11/2026).

---

## 1. Qué es esta ciudad y por qué está ahí [PROPUESTA]

### 1.1 Primalba

- **Qué fue.** Cuando Anhelia era el Alba entera, su voz levantaba el sol cada mañana en un mundo sin sol. Los mortales se juntaron bajo esa luz y levantaron **Primalba**, la primera ciudad. Vivía de un día que alguien más pagaba con noche.
- **Qué le pasó.** Cuando Anhelia se partió (canto en dos voces, mordisco en cuatro colmillos), la ciudad se quedó sin voz. Anhelia **no la dejó morir ni la dejó vivir**: la selló bajo la Hondura y le puso de techo un falso cielo, el eco de su último canto. Ese cielo repite el día.
- **Para qué la guarda.** La ciudad cumple tres funciones a la vez:
  1. **Su despensa de noche.** La ciudad cosecha la noche que Anhelia bebe cada día.
  2. **Su cuna.** Los cuatro tornos sirven para dejar y esconder a los cuatro colmillos.
  3. **Su recuerdo.** Es lo único que conserva de cuando fue entera. Por eso no la derriba.
- **Quién vive allí.** Los vecinos no están vivos ni muertos. Son ecos que viven **un solo día, una y otra vez**, sin saberlo. Cada vuelta del ciclo **uno no vuelve** (la «Cuenta del Día»). La ciudad se vacía despacio. Por eso la hora de la cosecha es **ahora**: Primalba casi no tiene a quién beber y los cuatro colmillos están maduros.

### 1.2 La calle

- **Calle de las Horas.** Los vecinos la llaman «la Calle Larga». No tiene esquinas ni final: solo horas. La única esquina que existe está en el último tramo.
- **Cómo se llega.** Al caer Cadalso y Vigilia, la **puerta gigante** al fondo del Salón de los Dos Tronos [DECIDIDO] se abre a una escalera larga hacia abajo (esto concilia el «Bajad» de Vigilia, ver 7.4). La escalera sale al **Zaguán de las Horas**.
- **Cartel de entrada** (rótulo en pantalla): «PRIMALBA · Calle de las Horas · Se ruega no despertar a los vecinos».

### 1.3 Relación con Anhelia

Es su casa en dos sentidos: la **ciudad** que ella amó cuando era una voz y la **casa** (la Morada) donde espera a sus cuatro. Primalba es **el cebo en grande**: las tragedias de la Zona 2 eran las tuberías que llevaban hasta aquí.

### 1.4 Relación con los Regentes

- Las lámparas de la Hondura (alimentadas con las almas de la Despensa) y la lámpara negra del faro **son réplicas de las farolas de Primalba**. Las almas de Zona 2 pagaban **el día** de esta ciudad.
- Vigilia y Cadalso fueron «cantora y verdugo de una corte muy anterior al Rey» (2.6). **Propuesta:** esa corte era la de Primalba. En el Palacio está la **Sala del Llanto**, donde Vigilia hizo llorar al tirano.
- La lengua de Cadalso y la última nota de Vigilia (2.7 y 4.9) están en la Morada, sobre la mesa (sección 5).

### 1.5 Relación con los cuatro

- **El torno.** Anhelia dejaba a cada bebé en un torno de Primalba. El torno giraba **por el espacio y por los años**: un cuartel, un faro, una casa de cazadores y un jardín de palacio, en siglos distintos. Eso explica que cuatro nacidos en épocas distintas lleguen a la misma noche, y que «sus» cuartel, faro, casa y palacio existan **aquí en su versión original**.
- **Las cuatro casas originales.** Los cuatro oficios de Primalba son los cuatro modelos que cada civilización copió después. Cada uno cuida **una fase del día de Anhelia**:

| Oficio | Barrio | Fase | Colmillo | Qué sostiene |
|---|---|---|---|---|
| Guardia | Cuartel Viejo | **Alba** | Cor (sangre) | La puerta del este, para que el primer rayo cruce la calle |
| Cazadores | Los Cotos | **Día** | Malak (almas) | Paga el día con sombras y almas |
| Corte | Palacio | **Ocaso** | Matis (sombra) | El rito que baja el sol |
| Pescadores | Muelle del Faro Seco | **Noche** | Zaf (noche) | Recoge la noche para que ella la beba |

- **Los cuatro fueron criados dentro de la maquinaria del ciclo**, para poder llevarla algún día. Es lo que Anhelia quiere y a la vez teme.

---

## 2. La travesía: ocho tramos y la Morada [PROPUESTA]

**Tamaño:** «tan larga como las Zonas 1 y 2 juntas» [DECIDIDO]. Si las 92 `area(` de `world.js` son Zona 1 + Zona 2, la Zona 3 sería de unas 85 a 90 salas. Reparto orientativo: 80 % la calle (68 salas) y 20 % la Morada (18 salas). El número final lo fija quien construya el mapa.

**Orden y fases:**

| Nº | Tramo | Fase dominante | Para quién | Salas (orient.) |
|---|---|---|---|---|
| 1 | El Zaguán de las Horas | Madrugada y primer alba | Los cuatro | 6 |
| 2 | Cuartel Viejo (Barrio del Relevo) | **Alba** | **Cor** | 10 |
| 3 | Los Cotos | **Día** | **Malak** | 10 |
| 4 | La Plaza del Pregón | Las cuatro (hub) | Los cuatro | 6 |
| 5 | El Puente de las Dos Voces | Del día al ocaso | Zaf + Matis | 6 |
| 6 | El Palacio de la Corte Primera | **Ocaso** | **Matis** | 11 |
| 7 | El Muelle del Faro Seco | **Noche** | **Zaf** | 11 |
| 8 | La Última Esquina | Hora Quebrada (todas, a saltos) | Los cuatro | 8 |
| 9 | **La Morada** (20 %) | Las cuatro, una por acto | Los cuatro | 18 |

**La calle es un día:** se camina de madrugada a noche. Se puede volver atrás: cada barrio tiene rutas, puertas y gente que solo aparecen en una fase, así que se vuelve para **esperar a la fase que falta**.

**Lo que se aplica a todos los tramos:**
- **Brasero de la Calle** = hoguera. Cada barrio tiene uno.
- **Banco de Espera** (idea): el Sereno dejó bancos donde se puede «esperar a la hora». Sentarse adelanta el ciclo. Evita que el jugador se quede mirando un reloj.
- **«Puerta» de cada protagonista:** en su barrio, a su hora, se abre el torno y se ve el otro lado (una escena de unas 4 líneas con quien lo encontró). En el torno hay una **nota de expósito** y **un objeto**, ambos con el nombre del bebé.

### Tramo 1 · El Zaguán de las Horas

| | |
|---|---|
| **Ambiente** | Un pórtico enorme bajo un techo de roca pintado como un cielo. La calle se pierde a lo lejos. Al fondo, muy lejos, **una ventana encendida** que no parpadea (la Morada). |
| **Fase** | Empieza en madrugada. A los pocos minutos, **el primer alba que ven los cuatro**. Es una escena escrita (6.1). |
| **Qué cuenta** | La ciudad, el cartel y el primer vecino que **no vuelve** al final del alba, para enseñar la «Cuenta del Día». Se ve que la luz **cobra**: lo que se enciende, algo lo paga. |
| **NPC** | **El Sereno** (ver 2.9 abajo). Primera hoguera. |
| **Solo en una fase** | De noche, las farolas están apagadas y se ven las **Sombras Sueltas**. De alba, aparecen las **Nodrizas**. |
| **Para quién** | Los cuatro. Es el tutorial del ciclo. |

### Tramo 2 · El Cuartel Viejo (Barrio del Relevo) · Cor

| | |
|---|---|
| **Ambiente** | Piedra rojiza, patios de armas, banderas de seda amarilla, tejados con **espejos pulidos** que reparten el primer rayo. |
| **Fase** | **Alba.** Es la más larga aquí. De noche los espejos duermen; de día se ciegan. |
| **Solo en alba** | Los espejos encienden **rutas de luz** por los tejados. Aparecen los **Portaespejos** (ecos de guardia). El **Furriel de la Diana** (NPC) solo atiende al alba. La **Capitana** solo existe al alba. |
| **Qué cuenta** | El **Libro de Relevos**: la guardia de Primalba sostenía el primer rayo cada mañana por orden de «la Voz». La **Orden 0** («no preguntar de dónde vienen los bultos que llegan al torno») lleva el **sello de cuatro puntas**: es la **firma de Anhelia**, la que Cor vio en la orden de cerrar las puertas. |
| **La puerta de Cor** | La **Puerta del Relevo**: una garita con una trampilla de hierro. La cuna es **un tambor de guerra**. Objeto: un **cascabel de guardia**. Nota: «Se llama Cor. Guárdalo.» (letra de la Tornera). |
| **Escena (alba)** | Cor abre la trampilla y ve al otro lado, joven, al **Capitán** levantando el bulto: «No sé de quién es. Tiene la mano marcada. Que no se entere el cuartel.» |
| **Jefa** | **Reverberia, Capitana del Primer Rayo** (sección 4). |
| **Para quién** | **Cor.** Responde a su miedo (que el maestro no lo reconozca, o que sí y pregunte dónde estaba): el Capitán **sí lo reconoció, desde el primer día**. |

### Tramo 3 · Los Cotos (las Casas de Caza) · Malak

| | |
|---|---|
| **Ambiente** | Un barrio alto de terrazas, a pleno sol: casas de caza con cornamentas, galerías de trofeos, cuestas empedradas. Las farolas de latón del día se alimentan con **frascos de almas** al pie. Los tubos bajan hasta la Hondura: **son los de la Despensa de la Zona 2**. |
| **Fase** | **Día.** La luz es plena y sin canto: pesa, cobra, cansa. De noche el barrio duerme y sueltan a las bestias; al ocaso, cierran. |
| **Solo de día** | Las tiendas y la **Casa de Tasación**, **Doña Pesa** (NPC), los **Alumbrados** (vecinos de luz blanca, sin sombra). Los **puentes de luz** solo existen con el sol. |
| **Solo de noche** | Los **Rastreros** (jaurías de sombra cortada) y el Libro Mayor guardado bajo llave. |
| **Qué cuenta** | El **Libro Mayor del Día**. Primera línea: «Día 1: pagado con tres sombras». Y una línea con fecha **anterior a la plaga del valle de Malak**: «Valle de los bosques cerrados. Pendiente de maduración. Garante: la de la marca». **Antes de que nadie enfermara, el valle ya estaba apuntado.** |
| **Revelación** | Los **Mercaderes** son aprendices de la **Casa de Tasación**. El de la Zona 1 es **uno de muchos**. Se resuelve así la duda «¿uno o varios?» de HISTORIA.md. |
| **La puerta de Malak** | La **Puerta del Coto**: portón con astas. La cuna es **un zurrón de caza**. Objeto: una **flecha de juguete**. Nota: «Se llama Malak. Que no firme nada.» |
| **Escena (día)** | Se ve al otro lado a quien la recogió en el valle: «El valle tiene una boca más. Que la crie quien no tiene hijos.» |
| **Jefe** | **El Tasador Mayor**. Solo se le encuentra de día; al ocaso baja la persiana y huye. |
| **Para quién** | **Malak.** Su deuda no era suya: era una casilla. Además, la **primera frase de Doña Pesa** («No firmes nada en este barrio. Ya firmaste bastante») es la advertencia que Malak necesitaba. |

### Tramo 4 · La Plaza del Pregón (centro de la calle)

| | |
|---|---|
| **Ambiente** | La calle se abre en una plaza con una **fuente seca**, un **campanario sin campana** y una **piedra del Pregón** donde se gritaban las leyes. **Una torre de sombra marca la hora** en el suelo (la sombra del campanario hace de reloj). |
| **Fase** | Las cuatro, bien visibles. Aquí se **entiende** el ciclo y se ve cómo cambia cada edificio. |
| **Qué cuenta** | **El nombre.** El Sereno lo dice por primera vez: «Antes de las horas hubo una sola hora, y tenía nombre. Anhelia.» En la piedra del Pregón: «Todo el que nace en esta calle debe una mañana». |
| **Qué hay** | Brasero, tienda (el Mercader, que dice ser «de la Casa»), Banco de Espera, y los **cuatro tornos a lo lejos** como cuatro ventanas en las cuatro fachadas (aún cerrados). |
| **NPC** | El Sereno, más hablador. |
| **Para quién** | Los cuatro. Es el respiro antes de los tramos más personales. |

### Tramo 5 · El Puente de las Dos Voces

| | |
|---|---|
| **Ambiente** | Un puente largo sobre el **Canal de la Sed** (de día seco; de noche, negro y lleno). A cada lado, un campanario: uno **luminoso** (alba) y otro **apagado** (ocaso). |
| **Fase** | El mejor sitio para ver **cómo el día pasa a ocaso**: la luz cambia de dorada a roja. |
| **Quién** | **El hermano superviviente de la Parte 1** (Aurora si cayó Vesper; Vesper si cayó Aurora; el juego lo sabe por `progress.bosses`). Está con el caído en una **litera junto al campanario**: «otras torres» [CANON, Oráculo y decisión 2-A]. |
| **Qué cuenta** | **El ciclo se mantiene con dos voces: una canta el alba y otra el ocaso.** Con una sola, solo suena bien su mitad: si queda Aurora, el alba es nítida y el ocaso llega «a golpe»; si queda Vesper, al revés (ver 3.5). El hermano confiesa que **canta sin saber para quién** y que ya se lo ha ido imaginando. |
| **Lo que da** | Una pista sobre la tercera vía (3.4) y, si se la pide, **su nota**. No hay combate. |
| **Para quién** | **Zaf y Matis**, los dos que oyeron la «luz sola» en la Cumbre. |

### Tramo 6 · El Palacio de la Corte Primera · Matis

| | |
|---|---|
| **Ambiente** | Galerías largas, ventanales al oeste, jardines de **rosas de ocaso** (huelen solo al ocaso). Las **sombras largas** se convierten en **caminos**: los puentes de sombra solo se pueden pisar al ocaso. |
| **Fase** | **Ocaso.** Es solemne y corto. De noche, el palacio queda a oscuras con sombras vivas. De día, vacío. |
| **Solo en ocaso** | Las **puertas de despedida** (salas de duelo con objetos perdidos), los **Dolientes** (ecos de cortejo), el **Ujier de las Sombras Largas** (NPC) y la **Plañidera Mayor**. |
| **Qué cuenta** | **La Sala del Llanto** (donde Vigilia hizo llorar al tirano). El **libro de visitas**: «El soldado que la Voz mordió primero juró guardar **una puerta**». Es **el Conde**, que fue **portero de Primalba** (el Zaguán) antes de serlo del castillo. |
| **La puerta de Matis** | La **Puerta del Jardín**: reja con una trampilla en una fuente. La cuna es **un capazo de rosas**. Objeto: **un paño con una sombra bordada**. Nota: «Se llama Matis. Que vaya un paso detrás de quien lo quiera.» |
| **Escena (ocaso)** | Matis ve a **Isolda**, joven, recoger el capazo: «Que nadie diga que la Reina tuvo cría. Diremos que el jardín dio fruto.» |
| **Jefa** | **La Plañidera Mayor** (sección 4). |
| **Para quién** | **Matis.** Responde a su miedo (haber huido): ve que **la dejaron y la recogieron dos manos distintas** y que ninguna le pidió quedarse atrás. |

### Tramo 7 · El Muelle del Faro Seco · Zaf

| | |
|---|---|
| **Ambiente** | El puerto del fondo de la ciudad. De día es **un canal seco con barcos varados en sus «cunas»** (cascos apoyados en soportes). De noche el canal se llena de **agua negra** y los barcos flotan. En medio, el **Faro Seco**: una torre sin lámpara. |
| **Fase** | **Noche.** La más larga y oscura de la calle. Cruzar el canal exige noche (los barcos flotan). Ver los **nombres escritos con luz** en los muros exige oscuridad (Zaf los lee mejor). |
| **Solo de noche** | Las **Mareas** (olas de agua negra que recorren la calle), los **Anzuelos** (ecos de pescador con ganchos), **La Barquera Sorda** (NPC) y **Nasa**. |
| **Solo de día** | El lecho del canal, con huesos y restos que de noche quedan bajo el agua: ahí están los **secretos**. |
| **La puerta de Zaf** | La **Puerta del Faro**: base de torre con una trampilla en forma de farol. La cuna es **una nasa forrada de red**. Objeto: un **farolillo de juguete sin llama**. Nota: «Se llama Zaf. Que alguien le enseñe a mirar.» |
| **Escena (noche)** | Zaf ve al **Farero** joven con el bulto en alto hacia el haz: «El mar no devuelve nada, pero hoy devolvió algo.» (el eco de «una luz» como su manera de querer). |
| **El Faro Seco** | Al caer Nasa, **Zaf puede encender el faro** con su colmillo: **una luz blanca hecha de noche**. Es la idea central de la zona: *la noche también da luz*. El haz marca el camino a la Última Esquina. |
| **Jefe** | **Nasa, el Pescador de Noche** (sección 4). |
| **Para quién** | **Zaf.** Responde a su miedo (que fuese por su culpa): el faro **nunca** se había encendido en Primalba, porque **no había noche libre**. Nadie lo había conseguido antes que él. |

### Tramo 8 · La Última Esquina (Hora Quebrada)

| | |
|---|---|
| **Ambiente** | La calle se estrecha y gira por primera vez. A los lados, **filas de cunas vacías** (una por cada vecino que no volvió en la Cuenta del Día). Al fondo, el **Torno Mayor**, enorme, cerrado. |
| **Fase** | **Hora Quebrada.** Como los cuatro guardianes ya han caído, el ciclo se suelta y **cambia a saltos**, cada pocos segundos. Aparecen todos los enemigos a la vez. Es el tramo más duro de la calle. |
| **Qué cuenta** | El Sereno hace **su última cuenta** y se despide (4.6). La Tornera sale a la puerta. |
| **Jefa** | **La Tornera Mayor** (sección 4). |
| **Para quién** | Los cuatro, juntos. Sin la marca en las cuatro palmas, el Torno Mayor no gira. |

### 2.9 NPC de la calle [PROPUESTA]

| NPC | Dónde y cuándo | Qué es y qué quiere |
|---|---|---|
| **El Sereno** | Toda la calle, noche y alba | Vigilante fantasma que canta las horas («¡las doce y sereno!»). Guía y humor negro. Cuenta a los vecinos cada alba y cada alba salen menos. Al final se despide. |
| **El Furriel de la Diana** | Cuartel, solo alba | Intendente fantasma. Reparte consejos del barrio. |
| **Doña Pesa** | Cotos, solo de día | Pesadora de sombras. Vende lo suyo y avisa a Malak de que no firme. |
| **El Ujier de las Sombras Largas** | Palacio, solo ocaso | Anuncia a las visitas por el largo de su sombra («su sombra es de buena familia»). |
| **La Barquera Sorda** | Muelle, solo noche | Cruza el canal y entiende todo mal. Humor. |
| **El hermano superviviente** | Puente | Ver tramo 5. |
| **Lúa** | Con el grupo | Ver 5.7. |

---

## 3. Cómo cuenta la historia el ciclo del Alba [PROPUESTA]

### 3.1 Qué es el ciclo

El ciclo es **el día de Anhelia**, el que vivía cuando era el Alba:

1. **Alba.** Canta y levanta el sol.
2. **Día.** Mantiene el sol y lo paga.
3. **Ocaso.** Lo deja caer cantando.
4. **Noche.** Bebe la noche que recogió. Es **la Sed**.

Cuando se partió, **su canto quedó en dos voces** (Aurora y Vesper, alba y ocaso) y su sed quedó sin voz. El día quedó sin canto: **solo se sostiene por inercia y a crédito**.

### 3.2 Quién lo gobierna

- **Aurora y Vesper cantan, sin saber para quién.** La voz del alba y la del ocaso salen del Puente de las Dos Voces. [CANON compatible: «no saben para quién cantan», 2.6.]
- **Los cuatro oficios sostienen lo demás:**
  - **Reverberia** sujeta el primer rayo (alba).
  - **El Tasador** cobra el día (día).
  - **La Plañidera** baja el sol con el rito (ocaso).
  - **Nasa** recoge la noche en frascos (noche).
- **Anhelia bebe lo recogido.** Y la **Tornera** vigila la última puerta.
- **El Sereno** solo canta la hora. No gobierna nada: lo cuenta.

### 3.3 Por qué no es gratuito

- **Se paga con vecinos.** Cada vuelta del ciclo, uno no vuelve (la Cuenta del Día). Las cunas vacías de la Última Esquina son sus cunas.
- **Se paga con noche.** Cada noche, Nasa vacía el canal. Cada día, el Tasador paga con sombras.
- **Se paga con los cuatro.** El ciclo es la manera de **criarlos**: con cada vuelta, sus oficios los preparan (alba para Cor, día para Malak, ocaso para Matis, noche para Zaf).
- **Es una cuenta que se acaba.** Quedan pocos vecinos. Cuando no quede ninguno, el ciclo se para y Anhelia solo tiene a los cuatro. Por eso la sed ya no espera.

### 3.4 Cómo reacciona el ciclo cuando el jugador avanza

Cada jefe de oficio rompe una pieza de la cadena **y el mundo lo muestra**:

| Cae | Qué cambia en el ciclo |
|---|---|
| **Reverberia** | El alba sale **gris, sin rayo**: los espejos ya no encienden rutas. |
| **El Tasador** | El día **parpadea**: las farolas de latón fallan y hay zonas que se quedan a oscuras a mediodía. |
| **La Plañidera** | El ocaso **no cierra del todo**: el rojo se queda en el cielo y los Dolientes vagan fuera de hora. |
| **Nasa** | La noche **se desborda**: el canal no se vacía y la calle se llena de agua negra. A cambio, **Zaf puede encender el Faro**. |
| **La Tornera** | **Las cuatro fases se descontrolan** (Hora Quebrada) hasta el final de la calle. |

Así, cada victoria tiene un precio visible y **la calle cambia por culpa del jugador**: se desmonta la cadena que alimentaba a Anhelia y ella, hambrienta, **llama más fuerte**. La llamada es el empujón narrativo hacia la Morada: ya no hay a quién beber salvo a ellos.

### 3.5 La elección de la Zona 1 sigue contando [PROPUESTA, decisión pendiente]

- El juego guarda qué hermano cayó (`progress.bosses`, `extras.js:203-207`).
- **Si el superviviente es Aurora:** el alba es nítida y el ocaso llega de golpe. **Si es Vesper:** el ocaso es suave y el alba llega de golpe («un golpe de luz sin canto»).
- **Recomiendo** que sea solo un rasgo y una escena distinta, sin cambiar el mapa.

### 3.6 Luz y oscuridad: el tema

- **La luz cobra.** El sol no es regalo: es una deuda.
- **La oscuridad también da.** La noche, en manos de Zaf, enciende el faro. La luz **hecha de noche** es la tesis de la zona, y es el argumento de la tercera vía (5.5).
- **Ni el alba ni el ocaso se pueden separar** [CANON, Vesper en la Cumbre]. En Primalba se ve literalmente: las fases se necesitan.

### 3.7 Ideas de jugabilidad ligadas a la luz (para quien programe, sin comprobar)

- **Fase = estado de la sala.** Una sala tiene hasta cuatro versiones (rutas, enemigos, NPC).
- **Luz propia del jugador.** El juego ya tiene antorchas, Ojo de la Noche y Aceite de linterna (`PERSONAJES.md` 4.7). De noche pesan mucho; de día casi nada.
- **Sombra.** De día, las zonas con sol dañan o frenan (los vampiros no arden: es **luz que cobra**). El jugador busca sombra. Matis tiene ventaja.
- **Banco de Espera** para adelantar la fase. **No puede adelantarse dentro de una pelea.**

---

## 4. Jefes y mini-jefes [PROPUESTA]

Ninguno repite a un enemigo ya visto: no hay armaduras, esqueletos ni jefes-sello. Cada uno **solo aparece en su fase** y, al caer, modifica el ciclo (3.4).

### 4.1 Reverberia, Capitana del Primer Rayo (Cuartel Viejo · alba)

- **Aspecto:** armadura de espejos pulidos, yelmo sin visera hecho un disco de espejo (quien la mira se ve a sí), capa deshilachada que fue roja y un escudo-heliógrafo. Lo que no repite: no es una armadura vacía ni hay otro «capitán de hierro»; es una persona que sostiene luz.
- **Origen:** primera capitana de la Guardia de Primalba. Su oficio era sostener la puerta del este para que el primer rayo cruzara la calle sin que la noche lo bebiera. Pidió turno de por vida y se le concedió. Fue **la primera en encontrar a Cor** en el torno y **lo giró por orden**.
- **Motivación:** sostener el alba. Cree que si cae, cae la ciudad. No soporta a los expósitos («La guardia no cría: vigila») porque ella misma fingió no mirar al bebé.
- **Frases:**
  - «Nadie cruza mi calle antes del primer rayo. Menos aún quien llegó en cesto.»
  - «Sostuve el alba mil mañanas. Ni una vez me dio las gracias.»
  - «Giré el torno. Era una orden. Siempre lo es.»
- **Al caer** (Cor presente): «¿Lo trataron bien?» / Cor: «Me enseñaron a guardar.» / «Entonces hice bien.» / Cor: «No. Pero sirvió.»
- **Efecto:** el alba sale gris. Entrega la **Nota del Alba** (3.4 y 5.5).

### 4.2 El Tasador Mayor (Los Cotos · día)

- **Aspecto:** hombre alto y sonriente con levita cosida de cuentas, un **ábaco de huesos** en el pecho y unas gafas con **dos soles diminutos** por cristales. Guantes blancos. Una **balanza** en cuyos platillos hay una luz y una sombra. Una sonrisa con un solo diente de oro.
- **Origen:** el primer comerciante de Primalba y quien calculó cuánto cuesta un día: «tres sombras». Inventó los frascos. Los **Mercaderes** son sus aprendices (uno cerró el trato de Malak).
- **Motivación:** que las cuentas cuadren. Se cree amable: «Yo nunca engaño: pongo la letra pequeña donde no hay luz».
- **Frases:**
  - «Un día sale caro. Alguien tiene que pagarlo, y rara vez soy yo.»
  - «Tengo tu valle apuntado. Ciento cuarenta, a buen precio.» (si Malak está)
  - «Cierro al ocaso. Si me ganas antes, te regalo el recibo. Si no, te lo cobro.»
- **Al caer:** «Sin cobro no hay día... y sin día no hay cobro. Qué bonito círculo.»
- **Reto:** si no lo vences antes del ocaso, huye y hay que esperar a otro día.
- **Efecto:** el día parpadea. Entrega la **Nota del Día**. El Mercader de la tienda **sigue vivo** (decisión pendiente, 8).

### 4.3 La Plañidera Mayor (Palacio · ocaso)

- **Aspecto:** figura encorvada bajo **capas de velos negros** con cuentas de lágrima de cristal rojo, manos largas y un pañuelo que se arrastra. Va seguida de un **cortejo de plañideras menores**. Bajo el velo, no se ve cara: las lágrimas caen **por fuera**.
- **Origen:** el tirano de Primalba la contrató para **llorar en su lugar**, porque los tiranos no lloran. Cuando Vigilia lo hizo llorar de verdad, la Plañidera se quedó sin oficio y firmó la condena. Desde entonces llora por cuenta de Anhelia, a cada ocaso.
- **Motivación:** hacer que Matis **se una al cortejo**. Va por detrás y, según ella, quien va un paso por detrás es de los suyos.
- **Frases:**
  - «Lloro por quien no tiene quien llore. Por ti también.»
  - «Yo lloraba por él; ella lo hizo llorar de verdad. No me lo perdonó nadie.»
  - «Todos los ocasos acaban en mí. Yo no acabo en nadie.»
- **Al caer** (Matis presente): «Veo desde este jardín todas las cortes. Ninguna te pidió que te quedaras atrás.»
- **Efecto:** el ocaso no cierra del todo. Entrega la **Nota del Ocaso**.

### 4.4 Nasa, el Pescador de Noche (Muelle · noche)

- **Aspecto:** enorme y jorobado, hecho de **red y brea**, con una **lámpara de pesca en la frente** (como los peces de las simas) que atrae las sombras. Lleva nasas colgando de los hombros y caña en vez de brazos. Ciego.
- **Origen:** pescador de Primalba al que se le hundió el barco. Anhelia le dio una red que no se rompe a cambio de **pescar la noche** y vaciársela cada día. «El mar se queda sin noche y yo con sueño.»
- **Motivación:** no dormir y no perder el oficio. Cree que sin noche no hay faro, y que sin faro nadie lo mirará. Reconoce el colmillo de Zaf: «Qué buena red se haría contigo».
- **Frases:**
  - «La noche se pesca despacio. Hay que tener paciencia.»
  - «Mi red no suelta. Pregunta a los que ya no preguntan.»
  - «Sin noche no hay faro. Sin faro, no hay quien me mire.»
- **Al caer** (Zaf presente): «Era para que alguien me mirase... Ahora enciende tú.»
- **Efecto:** la noche se desborda y **Zaf enciende el Faro**. Entrega la **Nota de la Noche**.

### 4.5 La Tornera Mayor (Última Esquina · Hora Quebrada)

- **Aspecto:** mujer-torno gigante. Su cintura es un **tambor giratorio con compartimentos** de los que salen manos. Hábito de lino blanco manchado de leche negra, toca con alas, mejillas de porcelana agrietada. Lleva en la espalda una **cuna** y en el cinto un **sonajero** y un manojo de llaves. No repite ningún enemigo: es la única en cuyo cuerpo hay una puerta.
- **Origen:** la única mortal a quien Anhelia **dio la palabra** para recibir bebés. **Crio un minuto a cada colmillo** y escribió las notas de expósito («Se llama Cor...»). Los **nombres** de los cuatro **los puso ella**, y las crianzas los respetaron.
- **Motivación:** que los cuatro **no pasen**. Sabe que Anhelia los bebe. No puede desobedecer: su torno nunca gira al revés. Así que pelea **para retrasarlos**, con tanta pena como fuerza. En cada golpe que recibe, **dice un nombre**: Cor, Zaf, Malak, Matis.
- **Frases:**
  - «Cuatro puertas, cuatro minutos. No me dio para más y lo hice mejor que bien.»
  - «No quiero pelear con quienes crié. Pero tampoco os voy a entregar.»
  - «Si cruzáis, os bebe. Si no cruzáis, bebe a todos. Elegid vosotros: a mí solo me enseñaron a girar.»
- **El combate:** pasa por las **cuatro fases en pocos segundos** (Hora Quebrada). Cada fase le cambia el ataque y el aspecto.
- **Al caer:** el torno **gira al revés por primera vez** y se abre. Entrega las **cuatro notas de expósito** y **su llave**.

### 4.6 El Sereno y los jefes [PROPUESTA]

El Sereno no es jefe, pero tiene tres momentos de guion:
- **Zaguán:** «Duermo de día y vigilo de noche. Al revés que los vecinos, que no duermen nunca. Tampoco están vivos, pero no lo saben.»
- **Plaza:** «Antes de las horas hubo una sola hora, y tenía nombre. Anhelia. La calle se pone triste si se dice en alto.»
- **Última Esquina:** «Cada alba cuento a los vecinos. Cada alba me salen menos. Hoy no he contado: ya no sé si contar era vigilar o llorar.» Y al final de la zona, **por fin amanece sin que nadie lo cante** y se va a dormir.
- **Cantos de fase (cambio de fase):** «¡Alba! Que nadie se mueva, que la luz es nueva y se estropea.» · «¡Día! Cuidado con la sombra corta: es la que más pesa.» · «¡Ocaso! Los que no volváis a casa, no volveréis.» · «¡Noche cerrada y todo en orden! Mentira: lo digo por costumbre.»

### 4.7 Enemigos corrientes de la calle (todos nuevos) [PROPUESTA]

| Familia | Fase | Qué son | Por qué no repite uno ya visto |
|---|---|---|---|
| **Sombras Sueltas** | Noche | Sombras de vecinos sin dueño. Solo existen donde no hay luz sobre ellas. Se pegan a la sombra del jugador | No son fantasmas: se disuelven con luz |
| **Nodrizas** | Alba | Autómatas-ama con cesto que **recogen** a quien hallan junto a una puerta y lo devuelven al último brasero | Tema propio (los expósitos) |
| **Portaespejos** | Alba | Ecos de guardia con escudo-espejo que devuelve la luz | No son «guardia de hierro»: juegan con la luz |
| **Alumbrados** | Día | Vecinos de luz blanca sin sombra. Abrasan en campo abierto | Se vencen llevándolos a la sombra |
| **Rastreros** | Día/noche | Jaurías de sombra cortada que siguen la sombra del jugador | No son murciélagos |
| **Dolientes** | Ocaso | Ecos de cortejo que caminan en fila **un paso por detrás** | No bailan (no son cortesanos) |
| **Anzuelos** | Noche | Ecos de pescador que lanzan ganchos y tiran hacia la oscuridad | No son ahogados |
| **Mareas** | Noche | Olas de agua negra que recorren la calle | Peligro del entorno |

---

## 5. La Morada de Anhelia (el 20 % final) [PROPUESTA]

### 5.1 Qué es

**Una casa.** No un castillo ni un trono. La casa de alguien que **esperó niños** y no los pudo criar. Por dentro, **es ella**: las raíces de sangre seca de su vestido son el empapelado y las vigas; las habitaciones están dentro de su cuerpo, y la última sala es su **boca**.

### 5.2 Recorrido (unas 18 salas)

1. **El Torno Mayor y el Recibidor:** un vestíbulo doméstico con **cuatro abrigos pequeños** colgados. Un olor a leche y a ceniza.
2. **La Cocina:** cuatro cuencos y una mesa baja.
3. **La Alcoba de las Cuatro Cunas:** **cuatro cuartos, uno por colmillo**. En cada uno, su **cuna**, su **objeto** (tambor, nasa, zurrón, capazo) y su **marco de puerta con marcas de altura**. Cuatro columnas de marcas, de fechas distintas, **que crecen a la vez**. Anhelia los medía a escondidas.
4. **El Comedor:** **una mesa puesta para seis** (cuatro copas con forma de colmillo y dos velas, alba y ocaso). Sobre un aparador, el **relicario con la lengua de Cadalso** y un **frasco con la última nota de Vigilia** [cabo suelto de 4.9]. Hoguera y última tienda.
5. **El Pasillo de las Marcas** hasta la **Copa**: la sala de la lucha, una boca enorme con cuatro huecos en la pared.

### 5.3 Qué ve el jugador al llegar

- Una puerta de casa abierta, sin guardias ni trampas. Música de nana lentísima.
- **La ventana encendida** que veían desde el Zaguán: es la de la alcoba. Una **mecedora que se mece sola**.
- Todo está a la **medida de los cuatro**, no de ella. Anhelia está al fondo, tan grande que **no cabe en la casa**: su cuerpo atraviesa las paredes.

### 5.4 La lucha: cuatro actos, uno por colmillo

La **Copa** es una boca con cuatro huecos sangrantes. Cada acto transcurre en **una fase del ciclo** (el día de Anhelia, comprimido) y enfrenta a un colmillo con **su propio poder torcido**:

| Acto | Fase | Colmillo | Poder torcido (PERSONAJES 2.7) |
|---|---|---|---|
| **I** | Alba | **Cor** (sangre) | Ella **cura bebiendo** lo que te hace: cada herida suya es un sorbo |
| **II** | Día | **Malak** (almas) | Ella **roba almas**: los frascos de los vecinos son proyectiles que hay que devolver |
| **III** | Ocaso | **Matis** (sombra) | **Sombra de la sombra:** su sombra en forma de copa se separa y pelea aparte |
| **IV** | Noche | **Zaf** (noche) | **Ve en la oscuridad sin ojos:** la sala se apaga y ella caza por el sonido y la luz |

- **Entre acto y acto, habla.** Cada uno cuenta, con una frase, dónde dejó a ese colmillo.
- **En cooperativo:** cada colmillo **lidera su acto** (su arma, su luz o su sombra «responde»). Si falta alguien, nadie queda bloqueado: se aplica la regla de «siguen en camino» (X03) y quien esté lleva el acto.
- **Frases de Anhelia** (para los actos y las escenas; las dos últimas ya están en 2.7):
  - Al llegar: «Mirad el marco. Os medía a escondidas. Ya no cabéis en ninguna cuna.»
  - I: «La primera sangre que probé fue la mía. Sabía a mañana.»
  - II: «Cada alma que robo la devuelvo en forma de día. ¿Cómo se pide perdón con un sol?»
  - III: «Mi sombra tiene forma de copa. Siempre lo supe: nací para beber o para ser bebida.»
  - IV: «No tengo ojos. Los perdí mirando cada alba que levanté.»
  - [CANON] «Alguno de vosotros tendrá que quitármela. Elegid bien.»
  - [CANON] «No me odiéis: tampoco yo elegí tener sed.»
- **Diseño de combate:** pendiente. Lo anterior son temas, no patrones.

### 5.5 La elección: amanece sobre la decisión

Al caer el cuarto acto, **empieza a amanecer**, sin canto, por primera vez. Anhelia se arrodilla y abre la boca con los cuatro huecos. Quiere las dos cosas: **reunirse** y **ser detenida**.

| Final | Qué hacen los cuatro | Qué pasa | Gancho abierto |
|---|---|---|---|
| **A. Devolver el mordisco (reunirse)** | Cada colmillo vuelve a su hueco | Anhelia vuelve a ser el Alba entera. El sol sale **para siempre** y se acaba la noche. Los cuatro se disuelven en la luz | Un mundo sin noche: ¿qué pasa con lo que vive de ella? |
| **B. Quitarle la sed (detenerla)** | Cada colmillo toma una parte de la sed | Anhelia descansa por fin. El ciclo se para y **no vuelve a salir el sol**. Los cuatro heredan la sed | ¿Qué hacen los cuatro con una sed que no se acaba? |
| **C. Repartir el alba (el canto de seis)** | Los cuatro cantan a la vez con Aurora y Vesper | Seis voces se **turnan** para sostener el ciclo. Anhelia ya no canta sola y descansa. El alba sale cada día, y **cada día lo canta alguien distinto** | ¿Cuánto durará un acuerdo de seis? |

- **Condiciones de C (tercera vía) [PROPUESTA, abierta]:**
  1. Haber recogido **las cuatro notas** (Reverberia, el Tasador, la Plañidera, Nasa).
  2. Llevar **las cuatro notas de expósito** (las da la Tornera).
  3. Haber hablado con el **hermano superviviente** en el Puente y llevar a **ambos hermanos** a la Morada (se cumple por fin la orden del Alcaide: «hasta que vuelvan juntos»).
  Si no se cumplen, **A y B siguen disponibles**.
- **Cómo se elige:** en **cooperativo**, los jugadores presentes votan con un gesto. En **solitario**, decide el único jugador por los cuatro.
- **Recomiendo C como final «verdadero»**, con A y B siempre abiertos. C es la única que no obliga a elegir entre dos pérdidas, y su tesis (la noche también da luz) viene del Faro de Zaf.

### 5.6 Cabos de la Parte 2 que cierra la Morada

- **La lengua de Cadalso y la última nota de Vigilia** (4.9): están sobre el aparador. Se pueden **devolver** y, entonces, Cadalso y Vigilia vuelven un instante como ecos para decir su última palabra (**«Gracias.»**, en lugar de «Perdón»).
- **La marca de la palma:** sobre la mesa, cuatro copas con la forma de esa marca. Se ve **que es la de ella**.
- **El Conde:** su carta vuelve a leerse con otro sentido: «alguien me detenga» (portero) y «misma sangre» (primer mordido).

### 5.7 Lúa en la Morada [PROPUESTA; final concreto abierto, PERSONAJES 10.3-1]

- Lúa **no lleva la marca**: la Morada no la deja pasar. Espera en el Torno Mayor, como en las salas de jefe.
- **Final de Lúa, opciones:** (1) se queda en Primalba como **la nueva Sereno** y enciende las farolas al alba; (2) sube con Zaf; (3) se va a ver el mar. **Recomiendo 1 si el final es C** (la ciudad tiene quién la cuente) y **2 si es A o B**.

---

## 6. Charlas y pensamientos nuevos [PROPUESTA]

Siguen el sistema de `PERSONAJES.md` sección 5 (una sola vez por partida guardada; multijugador, solitario y comentario de Lúa). Sin género.

**Disparador nuevo: E · cambio de fase** (la primera vez que cambia la luz sola). Los demás son A, B, C o D.

**Z3-01 · Primer alba (Zaguán, escrita) · grupo**
- Matis: Esto es luz. Luz de verdad.
- Zaf: Duele y no quema. Raro.
- Malak: ¿Cuánto vale un sol? ...Nada. Eso me asusta.
- Cor: Atentos. El sol también muerde.
- Solo: Cor «Un sol. Y yo sin sombrero.» · Zaf «Mi sombra, tan corta. Casi no la reconozco.» · Malak «Un día gratis. Nada es gratis.» · Matis «Hay luz. Y nadie me ha pedido que me quite.»
- Lúa: «¡Yo también tengo sombra! Se me ha pegado.»

**Z3-02 · Primer cambio de fase (disparador E) · CM**
- Zaf: La luz acaba de cambiar sola.
- Malak: ¿Quién paga el cambio?
- Cor: Nadie. Seguimos.
- Solo: Cor «El día se gira solo. Qué mal soldado.» · Zaf «Se mueve la luz. Cuento el compás.» · Malak «Cada hora, una factura.» · Matis «Aquí las horas tienen dueño.»

**Z3-03 · Cor ve la Puerta del Relevo (el tambor-cuna, el cascabel) · CT**
- Cor: Un tambor. Me durmieron en un tambor.
- Matis: Y te despertaron con diana.
- Cor: ...Es lo más amable que me has dicho.
- Solo: Cor «Un cascabel de guardia. Siempre fui del cuartel.» · Zaf «Cada cuna dice quién la hizo.» · Malak «Un tambor por cuna. Barato.» · Matis «Aquí empezó una guardia.»
- Lúa: «Un tambor. A mí me durmió un faro: mucho peor.»

**Z3-04 · Malak ve el Libro Mayor (línea anterior a la plaga) · CM o ZM**
- Malak: Aquí. Antes de la fiebre. Ya estábamos apuntados.
- Matis: Antes de enfermar.
- Malak: Entonces mi firma nunca fue mía. Fue una casilla.
- Solo: Cor «No era un trato. Era una trampa.» · Zaf «Apuntados antes de nacer.» · Malak «Mi valle, en tinta, antes de la fiebre.» · Matis «Que nadie les ponga precio.»
- Lúa: «Tú los contabas mejor que el libro.»

**Z3-05 · Zaf llega al Faro Seco (noche) · ZM, o con Lúa**
- Zaf: Un faro sin lámpara. El mío tenía lámpara y no se encendió.
- Lúa: Aquí nadie te va a culpar. Ya te culpas tú por todos.
- Zaf: ...Tengo mucha práctica.
- Solo: Cor «Un faro. Mira bien: es de Zaf.» · Zaf «Un faro seco. Nunca nadie lo encendió.» · Malak «Un faro apagado no cobra a nadie. Qué lástima.» · Matis «Nadie lo encendió porque no era su noche.»

**Z3-06 · Matis en el Jardín, al ocaso (olor a rosas) · CT**
- Matis: Huele a ella.
- Cor: ¿A la Reina?
- Matis: A quien me recogió. Y a quien me dejó.
- Cor: ¿Huelen igual?
- Matis: Son dos manos. El perfume es el mismo.
- Solo: Cor «Rosas. Ya sé a qué huele tu paso.» · Zaf «Pétalos de ocaso. Los cuento.» · Malak «Rosas. Pagan mal.» · Matis «Dos manos. Una me dejó; otra me recogió.»

**Z3-07 · Puente de las Dos Voces: oyen al hermano superviviente · ZT**
- Zaf: Canta una sola voz y suena a dos.
- Matis: Eso es lo que da pena.
- Zaf: Antes eran dos luces.
- Matis: Lo sé. Se nota en cómo se mueve la sombra.
- Lúa: «¿Y nadie les dijo que cantaran juntos?»

**Z3-08 · Ven por primera vez la ventana encendida de la Morada (de noche) · grupo**
- Cor: Hay luz allí al fondo.
- Zaf: Está encendida desde que entramos. No parpadea.
- Malak: Es una vela de espera.
- Matis: Alguien lleva siglos esperando visita.

**Z3-09 · Las cuatro cunas y las marcas de altura (Morada) · grupo**
- Matis: Marcas de altura. Cuatro columnas.
- Zaf: Las fechas no coinciden. Pero crecen a la vez.
- Cor: Nos miraba.
- Malak: ...Qué cobro más raro.

---

## 7. Contradicciones y cabos sueltos, y cómo resolverlos

### 7.1 «Hijos del Alba» (HISTORIA.md) frente a PERSONAJES.md y la intro del juego

- **HISTORIA.md** (decisión 1-A, 25/10/2026) dice que los cuatro son «**Hijos del Alba**»: Aurora y Vesper los convirtieron, los abandonaron y ellos vuelven a cobrarse la deuda.
- **La intro del juego** [CANON, `STORY_INTRO`, `extras.js:50-55`] lo repite: «De su sangre nacieron cuatro colmillos. Vosotros. Cazabais para ellos... os arrancaron los poderes, los nombres... y os echaron del castillo».
- **PERSONAJES.md** dice otra cosa: los cuatro son **descendientes de Anhelia**, dejados de bebés en cuatro puertas, criados por quien los encontró, sin pasado de cazadores ni destierro. Aurora y Vesper son **el canto partido**, no sus padres, y «no saben de Anhelia ni de los colmillos» (2.8).
- **No pueden ser ciertas las dos.** Propongo estas dos salidas:
  - **Opción 1 (recomendada): la intro es la versión de los hermanos.** Es lo que Aurora y Vesper cuentan o creen, y es **verdad a medias**: llevan la misma sangre (la de Anhelia) y se parecen (alba/ocaso y cuatro colmillos son las dos partes de ella). Es lo que hace que los cuatro vengan «a cobrar una deuda» que no existe. La Zona 3 la corrige. **No hay que cambiar el texto del juego**: basta con añadir en la Zona 3 que **«eso es lo que os contaron»**.
  - **Opción 2:** reescribir la intro para que sea neutra («Dos hermanos se repartían el cielo. Cuatro colmillos nacieron de la misma sangre que ellos»). Es más seguro, pero pierde el «gancho de venganza» que ya tiene el jugador.
- **Sobre la etiqueta «Hijos del Alba»:** hay que **retirarla** de HISTORIA.md o redefinirla como «colmillos del Alba» (el título del juego). «Alba» = Anhelia, no solo los hermanos.

### 7.2 «Os quitaron los nombres» frente a Cor, Zaf, Malak y Matis

- La intro dice que los hermanos les quitaron **los poderes y los nombres**. PERSONAJES.md les da **nombres** (Cor, Zaf, Malak, Matis).
- **Resolución:** con la opción 1 de 7.1, el «os quitaron los nombres» es parte de la versión de los hermanos. **Los nombres nunca se perdieron**: los puso **la Tornera** en la nota de cada bebé, y quien los crio los respetó. Se confirman en las cuatro notas de expósito.

### 7.3 «Reliquias = poderes robados a los cuatro» (HISTORIA.md, propuesta) frente a PERSONAJES

- HISTORIA.md propone que las reliquias de los jefes eran los poderes robados a los cuatro. En PERSONAJES.md los poderes son **las pasivas** (colmillos despertando) y no se han perdido.
- **Resolución:** las reliquias son **dones que los siervos de Anhelia retuvieron a propósito**, para que los cuatro no llegaran antes de madurar. El texto «habéis recuperado parte de lo que os quitaron» (`STORY_ZONE1_END`) sigue valiendo sin tocar nada.

### 7.4 «Bajad» y «puerta gigante»

- El cierre de la Parte 2 [PERSONAJES 4.9] dice «Bajad: ella os espera». La decisión actual habla de una **puerta gigante al fondo del Salón de los Dos Tronos**.
- **Resolución:** la puerta gigante se abre a una **escalera larga hacia abajo**. Las dos cosas cuadran. Quien programe la escena de cierre puede mostrar la puerta cuando cae Vigilia.

### 7.5 «Dos combates seguidos» frente a «jefe doble simultáneo»

- PERSONAJES 4.8 describe los Regentes en **dos combates seguidos**. ZONA2.md (estado 02/11/2026) dice que en el juego ya es **un jefe doble, simultáneo**, con una barra cada uno, y que manda el juego.
- **Resolución:** para la Zona 3 no cambia nada. Si la escena de cierre (B21) depende de que caiga uno primero, hay que ajustarla al orden real de caída. No lo he comprobado en el código.

### 7.6 «El Conde, primer mortal que mordió Anhelia» frente a una ciudad entera de mortales

- Si Primalba estaba llena de gente antes que el Conde, ¿cómo es el primero?
- **Resolución:** Anhelia **cantó** a Primalba pero **nunca mordió** a nadie hasta el Conde, que fue **portero de Primalba** (el Zaguán). Mordió a uno y lo puso a guardar una puerta. Lo del castillo fue su segunda puerta.

### 7.7 Aurora y Vesper: «no saben de Anhelia» frente a «cantan el ciclo»

- PERSONAJES 2.8 dice que no saben de Anhelia. En la Zona 3 cantan su día.
- **Resolución:** **cantan sin saber para quién**. El Puente es donde el superviviente lo sospecha por primera vez. No hay contradicción si se mantiene esa frase.

### 7.8 «¿El Mercader es uno o varios?» (HISTORIA.md, abierto)

- **Resolución propuesta:** **varios**. El Mercader de la Zona 1 es aprendiz de la Casa de Tasación de Primalba. Se confirma en el Libro Mayor (tramo 3). **Pendiente** decidir si el Mercader de la tienda desaparece cuando cae el Tasador (propongo que no).

### 7.9 «Cuentas pendientes con el Alba» (PAGES.rai) y «Oráculo del Alba»

- Con la nueva lectura «Alba» es **Anhelia**, no solo los hermanos. Siguen valiendo sin cambios, pero ahora tienen un doble sentido.

### 7.10 Tragedias «preparadas» frente a Primalba

- PERSONAJES 4.9 dice que las tragedias eran cebos. En la Zona 3 se ve **quién las apunta** (el Libro Mayor, la Orden 0 del Cuartel). Hay que cuidar que los cuatro **no** se sientan culpables por haber sido «un plan»: las escenas de las puertas muestran **a quién los recogió con cariño**.

### 7.11 Género de Anhelia (abierto en PERSONAJES 10.3-3)

- Uso «ella» por coherencia con lo ya escrito. Si se cambia, solo afecta al lenguaje descriptivo.

### 7.12 «Cada uno de época distinta» frente a que lleguen juntos

- Se resuelve con el **torno** (por el espacio y por los años), pero implica que **los cuatro tienen edades y siglos distintos**. Hay que decidir si eso se menciona en el juego o se deja como misterio. Propongo dejarlo como sugerencia en la escena del torno.

---

## 8. Decisiones que necesita Txaber

1. **Nombre de la ciudad y de la calle.** Propuesta: **Primalba** y **Calle de las Horas**. Alternativas: «Albaluz», «la Ciudad del Primer Candil».
2. **Ciclo automático o manual.** Recomiendo **automático** con **Bancos de Espera** para adelantar fase. Alternativa: manual (el jugador gira la fase en cada plaza).
3. **¿Cómo afecta el sol a los vampiros?** Recomiendo que **no arda**, pero que **cobre** (más lento, sin curarse, hay que buscar sombra). La alternativa clásica (el sol los quema) cambia la dificultad entera.
4. **¿Qué cambia según el hermano que sobrevive?** Recomiendo solo un rasgo (alba nítida u ocaso suave) y una escena. No cambiar el mapa.
5. **Final.** Recomiendo **tres finales**, con **C (el canto de seis)** como verdadero y condicional. Alternativa: solo A y B.
6. **Final de Lúa** (5.7).
7. **Opción 1 o 2 de 7.1** (la intro como versión de los hermanos, o reescribirla).
8. **Mercader:** varios (aprendices del Tasador) y sigue en las tiendas. ¿Aceptas?
9. **Las puertas de origen en cooperativo:** si el dueño no está, ¿se pierde la escena o la ve quien esté? Propongo que la vea quien esté y **no se gaste** (como en PERSONAJES 5).
10. **Longitud real:** número de salas y reparto 80/20 (a fijar al construir el mapa).
11. **¿Se enseña al jugador que Primalba está llena de «ecos»?** Recomiendo que sí, pero sin decir «muertos».

---

## 9. Textos listos para meter (cuando se aprueben) [PROPUESTA]

Todos con 160 letras como máximo por frase. Los nombres de los objetos son sugerencias: quien programe decide la estructura.

- **Rótulo del Zaguán:** «PRIMALBA · Calle de las Horas · Se ruega no despertar a los vecinos».
- **`NPC_DEFS.sereno.lines`:** las frases de 4.6, más las charlas del Zaguán y la Plaza.
- **`BESTIARY.reverberia`, `.tasador`, `.plañidera`** (o los nombres finales), **`.nasa`, `.tornera`:** a partir de «Aspecto» y «Origen» de la sección 4.
- **Frases de combate:** sección 4 (las tres de cada jefe).
- **Diarios sugeridos** (`PAGES`, un párrafo cada uno):
  - `PAGES.relevo` · Libro de Relevos: «Orden 0: no preguntar de dónde llegan los bultos que gira el torno. La firma es de cuatro puntas. Cumplo y callo. Al alba, cambio de guardia.»
  - `PAGES.mayor` · Libro Mayor del Día: «Día 1: pagado con tres sombras. Valle de los bosques cerrados: pendiente de maduración. Garante: la de la marca.»
  - `PAGES.nasa` · Cuaderno del Pescador: «Pesqué la noche hasta que el mar se quedó sin ella. Me dieron una red que no se rompe. Nadie me dijo que yo tampoco me iba a romper.»
  - `PAGES.torno` · Nota de expósito (una por colmillo): «Se llama [nombre]. Que lo cuiden. Tiene la mano marcada.»
- **Escenas de las puertas** (4 líneas cada una): las de los tramos 2, 3, 6 y 7.
- **Charlas Z3-01 a Z3-09:** sección 6.
- **Frases de Anhelia nuevas:** sección 5.4.
