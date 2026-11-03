# Zona 3: propuesta unificada (historia + diseño jugable)

Une la propuesta del narrador ([ZONA3-HISTORIA.md](ZONA3-HISTORIA.md)) y la del diseñador de niveles (hecha leyendo `world.js`, `game.js`, `extras.js` y el validador). Todo es **[PROPUESTA]** salvo lo marcado **[COMPROBADO]** (visto en el código). Las estimaciones de esfuerzo no están medidas.

## 1. Decisiones ya tomadas por ti
- Puerta gigante al fondo del Salón de los Dos Tronos, que se abre al caer Cadalso y Vigilia.
- 80 % travesía por una calle + 20 % morada del jefe final (Anhelia).
- La calle es la ciudad que los crió; cada vampiro reencuentra su puerta.
- Innovación dominante: un mundo que cambia con el tiempo (ciclo del Alba).
- Tamaño: tan larga como las zonas 1 y 2 juntas, con **salas grandes** (no 90 salas).

## 2. La idea en una frase
**Recorrer la Calle de las Horas es recorrer un día entero de la ciudad de Primalba**, y cada barrio es una hora del día y un colmillo. El ciclo del Alba no es decorado: es el día de Anhelia, y cada vuelta le cuesta un vecino a la ciudad.

## 3. La ciudad (narrador)
- **Primalba**: la primera ciudad de mortales, nacida bajo la voz de Anhelia. **Calle de las Horas**: su eje.
- Las puertas de origen son **tornos** (ruedas de expósitos): Anhelia dejaba a cada bebé en el torno y este giraba hacia otro siglo. Así cuatro bebés de épocas distintas coinciden en la misma noche.
- Cuatro oficios sostienen el ciclo, uno por fase y por colmillo: guardia, alba, Cor · cazadores, día, Malak · corte, ocaso, Matis · pescadores, noche, Zaf.
- Aurora y Vesper cantan el alba y el ocaso desde el Puente sin saber para quién. El juego ya guarda cuál cayó, así que la elección de la Zona 1 puede notarse en el ciclo.
- Los jefes que caen desmontan el ciclo y el mundo lo muestra: alba gris, día que parpadea, ocaso que no cierra, noche que se desborda.
- Tesis de luz y oscuridad: la luz cobra y la noche también da luz.

## 4. La travesía (orden de la calle)
| # | Tramo | Hora | Protagonista | Mini-jefe | Mecánica principal |
|---|---|---|---|---|---|
| 1 | Zaguán de las Horas (tras la puerta) | madrugada | todos | ninguno | tutorial del ciclo y de la campana |
| 2 | Cuartel Viejo, Barrio del Relevo | alba | Cor | Reverberia, Capitana del Primer Rayo | portones con horario, toldos, estatuas |
| 2b | Campanario y tejados (vertical) | alterna | todos | ninguno | campanas encadenadas, atajo por tejados |
| 3 | Los Cotos (casas de caza) | día | Malak | El Tasador Mayor | fachada de dos caras, jauría |
| 4 | Plaza del Pregón (hub, 3 a 4 salidas) | todas | todos | ninguno | tienda, hoguera, atajos, doble de ocaso |
| 5 | Puente de las Dos Voces | alba y ocaso | todos | (Aurora o Vesper, según lo que hiciste) | carrera del Alba |
| 6 | Palacio de la Corte Primera | ocaso | Matis | La Plañidera Mayor | dobles de ocaso, relojes |
| 7 | Muelle del Faro Seco | noche | Zaf | Nasa, el Pescador de Noche | haz del faro, sombras, atajo permanente |
| 8 | La Última Esquina | Hora Quebrada | todos | La Tornera Mayor | las fases se mezclan |
| M | **Morada de Anhelia** (20 %) | todas | los cuatro | **Anhelia** | ver 7 |

Tres carriles (calle, tejados y subsuelo), casas que se entran por puerta con interior, un atajo permanente de vuelta tras cada barrio. Tamaño objetivo: **unas 35 a 45 áreas grandes** (versión recortada: 28 a 32).

## 5. El ciclo del Alba (diseño)
- Cuatro fases: noche 55 s, alba 20 s, día 55 s, ocaso 30 s (ciclo de 160 s). El alba es corta a propósito: es la ventana de puertas y atajos.
- **Un único reloj global**, llevado por el anfitrión y enviado en la instantánea de red; las campanas y las pausas viajan como evento fiable. Los tiles de fase avisan 0,8 s antes de cambiar, como los de la mecánica `TP` que ya existe **[COMPROBADO]** (hoy sin sincronizar).
- Control: **campanas** en las plazas (3 s de repique para pasar de fase, recarga de 15 s) y los **Bancos de Espera** (sentarse y esperar acelera el paso). Las hogueras no mueven el reloj.
- Dibujo: se reutiliza la capa de oscuridad con un tinte y opacidad por fase, más un cielo en degradado. La luz del cielo se suma a la de las lámparas, con exposición 0 en interiores y soportales, así que fantasmas, murciélagos y el resto reaccionan solos. En modo ligero la transición es instantánea.
- Aviso técnico: el Guardián del Reloj (inmune a la luz) sería siempre inmune de día en exteriores; hay que usarlo solo en interiores.
- **Hora Sostenida** (habilidad nueva que entrega el último mini-jefe de la calle): congela el ciclo 8 s, recarga 25 s.

## 6. Mecánicas de lugar (8) y enemigos (resumen)
1. Toldos y tendederos: plataformas que solo existen en ciertas fases.
2. Puertas con horario: un portón que solo abre en el alba.
3. Fachada de dos caras: la misma puerta, interior distinto según la fase.
4. Haz del faro: en el alba rompe un muro y abre un atajo permanente.
5. Campanario encadenado: dos campanas en orden, plataformas de fase.
6. Sol que quema (opcional, ver decisión 3).
7. Carrera del Alba: un frente de luz que recorre la sala (1 o 2 en toda la zona).
8. Dobles de ocaso: tu sombra te copia con 1,2 s de retraso.

Enemigos: unas 8 familias nuevas del narrador (cada una ligada a una fase) y 10 comportamientos del diseñador (guardia de relevo con escudo de día y dormido en el ocaso, sereno que enciende farolas, cuervo de cornisa, maniquí de escaparate, sabueso del Alba, espejero, aguador que apaga antorchas, luciérnaga de farol, doble de ocaso, campanero loco). Hay que **fusionar las dos listas** al construir.

## 7. La morada de Anhelia (20 %)
- Es una **casa**, no un castillo: cuatro cunas, cuatro marcas de altura y una mesa para seis. Por dentro es el cuerpo de Anhelia y la sala final es su boca.
- Unas 5 salas grandes: zaguán, galería de los cuatro retratos (una prueba por protagonista, con su fase fija), pozo vertical, arena y balcón.
- **Pelea en cuatro actos, uno por colmillo y por fase**: Cor (noche, ella cura bebiendo: hay que romper los cálices), Zaf (alba, está ciega y caza por el sonido: las antorchas son señuelos), Malak (día, te roba una habilidad unos segundos), Matis (ocaso, tus dobles se vuelven enemigos; Hora Sostenida los disuelve).
- Después amanece sobre la decisión, con tres finales abiertos: **A** devolverle los colmillos, **B** quitarle la sed, **C** repartir el alba entre seis voces (condicional; el narrador lo recomienda).

## 8. Lo técnico que condiciona todo [COMPROBADO por el diseñador]
- La rejilla actual (22 x 16 celdas) está casi llena por la Zona 2. Ampliarla triplicaría los tiles en memoria (riesgo en televisores y modo ligero).
- **Recomendación: un mapa aparte para la Zona 3**, con un fundido al cruzar la puerta, y un panel de mapa propio.
- El validador (unos 15 min ahora) no modela las fases ni las habilidades nuevas. Se plantea `validate:z3` aparte, desde la entrada y con todas las habilidades. Las rutas obligatorias solo usarían lo que el validador ya modela (impulso, doble salto, salto de pared, alas, pisotón); el resto, en rutas opcionales y secretos.
- Cambios de código: `world.build(region)`, `cycleStep` y la luz del cielo en `game.js`, ops de fase en `world.js`, guardado de región, evento de campana en el servidor.

## 9. Plan de construcción y esfuerzo (estimación sin medir)
| Fase | Qué | Días |
|---|---|---|
| F0 | Prueba de memoria: mapa B separado y ciclo local | 4 a 5 |
| F1 | Núcleo del ciclo con red, campana, ops de fase | 8 a 10 |
| F2 | **Tramo vertical del Campanario** (6 salas), jugable sin tocar el mapa actual | 8 a 10 |
| F3 | Mapa B, cambio de región, minimapa, guardado y servidor | 8 a 10 |
| F4 | Zaguán, Cuartel, Cotos, Plaza (unas 22 áreas) | 25 a 30 |
| F5 | Puente, Palacio, Muelle, Última Esquina y Hora Sostenida | 25 a 30 |
| F6 | La Morada y Anhelia | 15 a 20 |
| F7 | Validador, rendimiento y ajustes | 10 a 15 |

Total aproximado: **100 a 130 días de una persona con ayuda de IA** (versión completa). La recortada, con 2 máscaras de fase y 28 a 32 áreas, reduce bastante esa cifra.

## 10. Contradicciones a resolver (el narrador las detalla en ZONA3-HISTORIA.md, sección 7)
- «Hijos del Alba» (HISTORIA.md) y la intro metida en el juego chocan con PERSONAJES.md. Propuesta: la intro pasa a ser «la versión de los hermanos», una verdad a medias, sin cambiar el texto.
- Los nombres nunca se perdieron: los puso la Tornera en las notas de expósito.
- Regentes como dos combates frente al jefe doble simultáneo que ya hay; el Conde como primer mordido; Mercader uno o varios; edad de cada colmillo; género de Anhelia.

## 11. Decisiones que necesito de ti
1. **Mapa aparte** con fundido al cruzar la puerta (recomendado): ¿todos a la vez o cada jugador por su cuenta?
2. **Alcance**: completa (4 fases, unas 43 áreas) o recortada (2 máscaras, 28 a 32 áreas). Recomiendo recortada y empezar por el tramo vertical.
3. **Sol**: que el día cobre peaje pero no queme (recomendado) o que queme en la calle abierta.
4. **Ciclo**: automático con campanas y Bancos de Espera (recomendado) o solo manual.
5. **Finales**: tres, con el C condicional (recomendado), o solo A y B.
6. **Nombres**: Primalba y Calle de las Horas.
7. **Intro**: «versión de los hermanos» (recomendado) o reescribirla.
8. **Orden de los barrios**: fijo (recomendado) o libre.
9. **Hora Sostenida**: ¿obligatoria para entrar en la Morada?
