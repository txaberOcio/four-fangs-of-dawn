# Zona 2: guía de implementación

*Documento-guía para quien programe la Zona 2 (la «Parte 2» del juego). Redactado el 27/10/2026 a partir de `public/world.js`, `public/game.js`, `public/extras.js`, `public/art.js`, `public/music.js`, `public/decor.js`, `server/index.js`, `scripts/validate.js`, `scripts/recorrido.js` y `docs/ZONA1.md`. El lore y los textos de las charlas están en [PERSONAJES.md](PERSONAJES.md). **El mapa es el que dibujó Txaber** (sección 4).*

> **Estado a 02/11/2026 (versión 0.6.0).** Implementado y jugable: el ascensor de La Gran Hoguera, las 26 salas del mapa dibujado por Txaberocio (ver [MAPA-ZONA2.svg](MAPA-ZONA2.svg)), la llave del Capitán, los jefes (Capitán, Farero, Subastadora, Chambelán y el jefe doble Cadalso y Vigilia, simultáneos, cada uno con su barra), las mejoras de estadística por jefe, Lúa como compañera con látigo, la Reina Isolda, las tiendas, el sistema de charlas y pensamientos de todas las zonas (`public/talks.js` y `public/charlas.js`), las mejoras del mapa que se compran, los pensamientos ante puertas cerradas y los nombres Cor, Zaf, Malak y Matis. **Pendiente:** sprites y ataques propios de los jefes nuevos (hoy usan los de otros jefes), enemigos y diarios propios de la zona, la escena de rescate de Lúa y la de cierre de la Parte 2, la zona 3, y afinar la dificultad jugando. Donde este documento y el juego discrepen (las cuatro sendas separadas, las cuatro tapas del refugio, los combates seguidos), manda el juego: el mapa final es el de Txaberocio.

**Estado de lo que dice este documento:**

- **[COMPROBADO]**: lo he leído en el código y es así hoy.
- **[DECIDIDO]**: lo ha decidido Txaber (el flujo del mapa, la llave, los jefes finales...).
- **[PROPUESTA]**: diseño mío, pendiente de que Txaber lo apruebe.
- Los números de tiles y celdas son **orientativos**: el constructor de `world.js` lanza un error si dos áreas no son adyacentes, y `npm run validate` dice si algo no se alcanza. Hay que ajustarlos construyendo.
- No he tocado el código del juego.
- **Nota sobre el código actual:** me han dicho que las zonas de paleta `z` 10 a 15 ya existen en el código con los nombres antiguos (Refugio de Isolda, Jardín de las Rosas Negras, Cuartel Hueco, Faro Ciego, Mercado Hueco, Los Tronos). Aquí se **reasignan y renombran** (5.7): hay que ajustar lo que ya esté hecho.

---

## 1. Resumen en una página

1. **Se añade un ascensor en La Gran Hoguera** (área `gran`, final de la Zona 1). Una tapa de hierro cubre el hueco del suelo hasta que cae **la Madre Moho**. Debajo, un pozo (`asc2`) con el ascensor.
2. **El ascensor lleva a la Zona 2**, un mapa nuevo **debajo** de la Zona 1, con **la forma del dibujo de Txaber**: todo va hacia la derecha desde el ascensor y los pozos bajan.
3. **Cinco tramos, por colores** [DECIDIDO]:
   - **Verde, Patíbulo Exterior:** 6 salas; hoguera en la primera, junto al ascensor; sale a la derecha por la **puerta con llave** y hacia abajo por un **pozo**.
   - **Gris azulado, La Despensa:** sala alta de entrada, gran sala con hoguera, **dos pozos** a una bodega y, a la derecha, el **Secreto** (Conservera Mayor).
   - **Azul claro, La Milla Verde:** Casa del Mercader (ida y vuelta), un pozo y, a la derecha, la Milla Verde y las Cárceles, donde se **libera a Lúa**.
   - **Amarillo, Capilla del Cuartel:** pasillo largo a la derecha, sala grande con la escalera y **el primer jefe, que da la llave**; arriba, la Capilla con Isolda, cura, mercader, herrero y hoguera.
   - **Rojo, Dependencias de los Funcionarios:** tras la puerta con llave, una sala alta y tres salas apiladas que bajan al **jefe final**.
4. **Jefes:** el **Capitán de Hierro** (primer jefe, da la llave), tres mini-jefes (**Último Farero**, **La Subastadora**, **Chambelán Sin Rostro**) y, al final, **Cadalso y Vigilia**, los Regentes de la Hondura (dos combates seguidos).
5. **Cada hito personal** (Capitán, Farero, Subastadora, Chambelán) da a su vampiro una **mejora de estadística** (sin tocar el daño).
6. **Lúa** es de la casa de **Zaf**: se libera en las Cárceles de la Milla Verde y **acompaña al grupo hasta el final del juego**.
7. Aparte hay un **sistema de charlas y pensamientos** (entrar en zonas, objetivos, enemigos nuevos, lugares inalcanzables) que funciona en **toda** la Zona 1 y la Zona 2.
8. Hay que **corregir textos con género** (`HERO_NAMES`, `HERO_INFO`, README...) para usar los nombres neutros Cor, Zaf, Malak y Matis.

**Reparto confirmado de nombres:** Cor = Carmesí (`red`), Zaf = Azul (`blue`), Malak = Esmeralda (`green`), Matis = Violeta (`purple`).

**Jugadores:** el código admite **de 1 a 4** (`MAX_PLAYERS = 4`, `server/index.js:17`). Todo lo de esta guía asume ese rango.

---

## 2. Cómo funciona el mundo hoy (lo que hay que saber antes de tocar) [COMPROBADO]

- El mundo es una malla de **22 × 10 celdas** de 26 × 18 tiles (`COLS = 22, ROWS = 10`, `world.js:6`). Cada área (`area(id, nombre, z, c, r, w, h, ops)`) ocupa `w × h` celdas. `z` es la **zona de paleta/música/escala de enemigos**.
- **Enlaces:** `E(a, b, tamaño, {gate, crack})` une dos áreas **adyacentes en horizontal** (la puerta se abre a ras del suelo del área más baja; `bottom = min(A.y0 + A.rh, B.y0 + B.rh)`) y `S(a, b, x, tamaño, {roots})` une dos áreas **adyacentes en vertical** con un hueco (`x` en coordenadas del área de arriba). Si no son adyacentes, `build()` lanza un error.
- **Puertas por jefe:** solo existen en `E(..., {gate: 'idDelJefe'})`. Se cierran con tiles sólidos y se abren cuando ese jefe está en `progress.bosses` (`World.gateOpen`). Hay dos excepciones con regla propia: `'sellos'` y `'alba'`.
- **Puertas que se rompen:** `E(..., {crack: true})` es un muro agrietado que se rompe a golpes o con Bomba. **El validador las trata como pasables.**
- **Grietas que se abren solas:** `['K', x, y, ancho, alto, 'idDelJefe']`. El validador también las trata como pasables, así que **no sirven** para bloquear el avance en el validador.
- **Ascensor:** `['lift', x, ancho]` en el área de abajo. Sube y baja solo entre el suelo del área de arriba (`yTop = (a.y0 - 1) * T`) y el suyo (`yBot`). Ciclo de 14 s: 3 s arriba, 4 s bajando, 3 s abajo, 4 s subiendo (`liftY` y `liftStep`, `extras.js:1722`). El único que existe es el de `asc` (Calabozos Profundos). **El validador no modela el ascensor**: para él `S` es un hueco por el que se cae.
- **Salas seguras:** un área con `['altar']`, `['bigfire']` o `['npc']` no genera enemigos (salvo que lleve `['unsafe']`). `['calm']` pone música de calma y sin enemigos.
- **Dificultad:** `diff` del área (por defecto igual que `z`) indexa `ZONE_SCALE` (`game.js:178`). **Si `z` no tiene entrada, el multiplicador es 1** (`|| 1`). Desde `z >= 4` los enemigos pegan 1 más (`game.js:607`).
- **Progreso compartido:** `room.progress = { abilities, bosses, broken, torches }`. Los datos **personales** se guardan en `sanitizeMe` (`server/index.js:45`), que **descarta todo campo que no conozca**.
- **Punto de control:** al morir se vuelve al último descanso en hoguera; en solitario el mundo entero vuelve (`revertWorld`, `captureState`, `extras.js:1228`).
- **El validador** (`scripts/validate.js`) simula la física, abre las puertas al caer cada jefe alcanzable y exige que el orden de jefes coincida con `World.PROGRESSION`.
- **Aurora y Vesper hoy:** jefes de la Parte 1 en `albaA` y `albaB` (`world.js:100-101`), 34 de vida. No cambian.

---

## 3. El ascensor nuevo en La Gran Hoguera

### 3.1 Dónde [PROPUESTA]

**En La Gran Hoguera (`gran`, celda c3 f8), el último área de la Zona 1.** El suelo de `gran` es libre: la hoguera grande está en `x = 13` y la caída desde la Antesala del Abismo (`S('pas1', 'gran', 8, 4)`) aterriza en `x = 8..11`. El hueco va en **`x = 18..21`**. La fila 9 de la malla (justo debajo) está **libre**.

### 3.2 Construcción [PROPUESTA]

1. **Nueva área** `asc2` ('Pozo del Segundo Ascensor', z 10, celda `c3 f9`, 1 × 1), `['calm']`, con `['lift', 18, 4]`. Es **el ascensor vertical** del dibujo de Txaber.
2. **Enlace nuevo:** `S('gran', 'asc2', 18, 4, { gate: 'madre' })`. Adyacencia: `gran.y0 + gran.rh = 162 = asc2.y0`.
3. **Soportar `gate` en `S`** (cambio en `build()`, ver 12.1): hoy `gate` solo se lee en `E`. Con la tapa, el hueco queda **sólido** hasta que cae la Madre Moho y el validador lo respeta.
4. **Qué lo desbloquea:** la **Madre Moho** (`madre`). Su aviso en `openGates` (`game.js:426`) se amplía: «¡La Madre Moho ha caído! Se abre el camino de salida y, en La Gran Hoguera, la tapa de hierro cede: el ascensor baja a la Zona 2.»
5. **Aspecto de la tapa:** `buildGateDoors` (`extras.js:1512`) solo dibuja rejas **verticales**. Hay que añadir una variante **horizontal** (trampilla de hierro con sello rojo) para las tapas en el suelo. Se usa también en la escalera de la Capilla y en el hueco del Despacho (4.5).
6. **Salida desde abajo:** el ascensor sube solo al ciclo siguiente.

### 3.3 Cómo encaja con el progreso y las salas existentes

- **No se salta nada:** aunque se llegue a `gran` por la Cueva del Abismo, la tapa está cerrada hasta vencer a la Madre.
- **El camino de la Zona 1 no cambia.** Solo `gran` gana el hueco del ascensor (y ya no es «el final»: actualizar `docs/ZONA1.md`, fila «etapa 8»).
- **`gran` ya tiene la hoguera grande** (viaje rápido): sirve de descanso antes de bajar.

### 3.4 Qué se muestra al bajar y al subir [PROPUESTA]

- **Al bajar:** la plataforma desciende entre cadenas, como la de `asc`. Al entrar en `asc2` sale el rótulo habitual: «Patíbulo Exterior — Pozo del Segundo Ascensor». **La primera vez** se añade un rótulo central de 4 s: «ZONA 2 / MÁS ALLÁ DE LA GRAN HOGUERA».
- **Al subir:** nada especial.

---

## 4. Estructura de la Zona 2: el mapa de Txaber [DECIDIDO el flujo; PROPUESTA la construcción]

### 4.1 Flujo del dibujo de Txaber

1. **Ascensor** (vertical, a la izquierda) → **Patíbulo Exterior (verde)**, con la **hoguera en la primera sala**.
2. El Patíbulo sale **a la derecha** hacia la **puerta con llave** y **hacia abajo** por un pozo vertical.
3. El pozo lleva a la **sala alta** de entrada de la **Despensa (gris azulado)**. A su izquierda, la **Casa del Mercader (azul claro)**, que se visita y se vuelve. De la Mercader sale un pozo hacia **La Milla Verde y las Cárceles (azul claro)**, a su derecha.
4. De la sala alta se pasa a la **gran sala de la Despensa**, con **hoguera**, y de ella bajan **dos pozos** a una bodega. **A la derecha de los pozos está el Secreto** (Conservera Mayor).
5. De la bodega sale el **pasillo largo (amarillo)** hacia la derecha hasta la **sala grande con la escalera** y el **primer jefe (Capitán de Hierro), que da la llave**. Arriba a la derecha, la **Capilla** (cura, mercader, herrero, hoguera e Isolda).
6. Con la llave se vuelve (viaje rápido) a la **puerta con llave**, al final del Patíbulo, y se entra en las **Dependencias de los Funcionarios (rojo)**: sala alta y tres salas apiladas que llevan al **jefe final (sala grande)**.

### 4.2 Tamaño del mundo [PROPUESTA]

**`ROWS` pasa de 10 a 16** (`world.js:6`). La Zona 2 ocupa las filas 9 a 15 y las columnas 3 a 21. Comprobado que cabe: la malla pasa de 182 a 290 tiles de alto (`Ht = ROWS * CH + 2`); el mapa grande se dibuja a `bigS = floor((SW - 52) / Wt * 10) / 10 = 1,3` (`game.js:275`), así que mide `290 × 1,3 = 377 px` desde `y = 90`, o sea hasta `y = 467` de los `576` de pantalla (`SH`). Hay que comprobar el rendimiento en el modo ligero.

### 4.3 Plano de celdas [PROPUESTA]

Cada celda es de 26 × 18 tiles. Leyenda: `A` = `asc2` · `1` a `6` = `pat1` a `pat6` (Patíbulo) · `a` = `alta` · `m` = `mer` · `j` = `pasD` · `D` = `desp` · `q` = `pm` · `L` = `milla` · `C` = `carc` · `B` = `cellar` (bodega) · `S` = `sec` (Secreto) · `y` = `y1` · `Y` = `y2` · `E` = `y3` · `K` = `cap` · `7` a `0` = `dep1` a `dep4` (`7`, `8`, `9`, `0`) · `T` = `tronos`.

```
col:  3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21
f9 :  A 1 1 2 2 2 3 3  3  4  4  4  5  5  5  6  7  7  7
f10:  . . . . a . . .  .  .  .  .  .  .  .  .  7  7  7
f11:  . . . . a . . .  .  .  .  .  .  .  .  .  8  8  .
f12:  . . m m a j D D  D  .  .  .  .  .  .  .  9  9  .
f13:  . . q q L L B B  B  S  S  .  .  K  K  K  0  0  .
f14:  . . . . C C B B  B  y  y  Y  Y  E  E  E  T  T  T
f15:  . . . . . . . .  .  .  .  .  .  .  .  .  T  T  T
```

Colores del dibujo: verde = `1`-`6`; azul claro = `m`, `q`, `L`, `C`; gris azulado = `a`, `j`, `D`, `B`, `S`; amarillo = `y`, `Y`, `E`, `K`; rojo = `7`-`0` y `T`.

- **Anchos de 1 a 3 celdas** y alturas de 1 a 2 (la sala alta `a` mide 3 de alto). **Cabe en las columnas 3 a 21 y las filas 9 a 15.**
- **Comprobado que esas celdas están libres:** el área existente más al sur es `fragua` y `gran` (fila 8) y `caida`/`grieta` (filas 7-8, columnas 0-2). Nada ocupa la fila 9 ni las siguientes.

### 4.4 Tabla de salas [PROPUESTA]

`z` = zona de paleta/música/escala (5.7). **Tamaño** = ancho × alto en celdas.

| id | Nombre | Tramo | z | Celda (c, f) | Tamaño | Hoguera / PNJ | Enemigos | Secretos y objetos |
|---|---|---|---|---|---|---|---|---|
| `asc2` | Pozo del Segundo Ascensor | Ascensor | 10 | (3, 9) | 1×1 | — (`['calm']`) | — | `['lift', 18, 4]` |
| `pat1` | Pie del Patíbulo | Verde | 10 | (4, 9) | 2×1 | **Hoguera** | — | Soga con dos lazos vacíos (decorado) |
| `pat2` | Plaza del Patíbulo | Verde | 10 | (6, 9) | 3×1 | — | `cort` ×2, `arq` ×1 | **Hueco al pozo** (a `alta`) en `x = 28` |
| `pat3` | Soga y Cuervos | Verde | 10 | (9, 9) | 3×1 | — | `cort` ×2, `arq` ×2 | Diario `pat3`; gema |
| `pat4` | Galería de Jaulas | Verde | 10 | (12, 9) | 3×1 | — | `guard` ×2, `arq` ×1 | Muro agrietado con cristal de vida |
| `pat5` | Terraza de los Ahorcados | Verde | 10 | (15, 9) | 3×1 | — | `cort` ×3, `guard` ×1, `arq` ×2 | — |
| `pat6` | Antesala de los Funcionarios | Verde | 10 | (18, 9) | 1×1 | — | `arq` ×1 | **Puerta con llave** al este (`gate: 'capitan'`) |
| `alta` | Escalera de Servicio | Gris azulado | 14 | (7, 10) | 1×3 | — | `frasco` ×2, `cobrador` ×1 | `['climb', ...]` hasta el hueco de `pat2` |
| `mer` | Casa del Mercader | Azul claro | 13 | (5, 12) | 2×1 | **Mercader** (tienda `mer`) | — | Pozo al sur (a `pm`) |
| `pasD` | Pasaje de la Despensa | Gris azulado | 14 | (8, 12) | 1×1 | — | `frasco` ×2 | — |
| `desp` | La Despensa | Gris azulado | 14 | (9, 12) | 3×1 | **Hoguera** | — | Gema; diario `desp`; **dos pozos** a la bodega (`x = 12` y `x = 60`) |
| `cellar` | Bodega de las Conservas | Gris azulado | 14 | (9, 13) | 3×2 | — | Élite **Pujador Mayor**; `frasco` ×3, `cobrador` ×2 | Gema; diario `cellar`; **grieta al Secreto** (a `sec`), con una repisa a `y = 17` en el extremo este |
| `sec` | Conservera Mayor (Secreto) | Gris azulado | 14 | (12, 13) | 2×1 | — | **Mini-jefa `subastadora`** | Cristal de vida; el frasco grande del valle; fragmento del sello |
| `pm` | Pozo del Mercader | Azul claro | 13 | (5, 13) | 2×1 | — | `ahogado` ×1, `farol` ×2 | Diario `pm` |
| `milla` | La Milla Verde | Azul claro | 13 | (7, 13) | 2×1 | PNJ `preso` | `ahogado` ×2, `farol` ×2; élite **Vigía Hundido** | Cristal de vida en un saliente alto (Salto de pared); gema; diario `milla` |
| `carc` | Las Cárceles | Azul claro | 13 | (7, 14) | 2×1 | Celda de **Lúa** | **Mini-jefe `farero`** | 3 lámparas (`['torch']`); barrotes `['K', ..., 'farero']`; diario `carc` |
| `y1` | Pasillo de las Velas | Amarillo | 12 | (12, 14) | 2×1 | — | `guard` ×2, `arq` ×1 | Diario `y1` |
| `y2` | Galería de los Ex-votos | Amarillo | 12 | (14, 14) | 2×1 | — | Élite **Sargento de Hierro**; `arq` ×2, `guard` ×1 | Saliente con gema **solo planeando** (Alas); diario `y2` |
| `y3` | Escalera de la Capilla | Amarillo | 12 | (16, 14) | 3×1 | — | **Jefe `capitan`** | Escalera sellada hasta que cae el Capitán |
| `cap` | Capilla del Cuartel | Amarillo | 12 | (16, 13) | 3×1 | **Hoguera**; **Isolda**, cura, mercader, herrero (`['calm']`) | — | Diario `cap`; gema |
| `dep1` | Antecámara de los Funcionarios | Rojo | 11 | (19, 9) | 3×2 | PNJ `escribiente` | Élite **Mayordomo Sin Rostro**; `cort` ×3, `rosa` ×2 | Diario `dep1`; gema |
| `dep2` | Galería de los Retratos Cubiertos | Rojo | 11 | (19, 11) | 2×1 | — | `cort` ×2, `rosa` ×2 | Muro agrietado con cristal de vida; gema; diario `dep2` |
| `dep3` | Despacho del Chambelán | Rojo | 11 | (19, 12) | 2×1 | — | **Mini-jefe `chambelan`** | Diario `dep3`; hueco al sur sellado hasta que cae |
| `dep4` | Antesala de los Regentes | Rojo | 15 | (19, 13) | 2×1 | **Hoguera**; tienda (`['calm']`) | — | **Forja** (`['forge', 24, 16]`); diario `dep4` |
| `tronos` | Salón de los Dos Tronos | Rojo | 15 | (19, 14) | **3×2** | — | **Jefes `cadalso` y `vigilia`** | Arena (4.6); sin hoguera |

**25 áreas.** Hogueras de la Zona 2: `pat1`, `desp`, `cap` y `dep4` (**4**). Tiendas: `mer` y `cap`. Forja: `dep4`.

**Arena del Salón de los Dos Tronos** (78 × 36 tiles; coordenadas orientativas, locales al área):

- **Trono-Atril** (izquierda): tribuna alta con tubos de órgano, `['P', 3, 8, 14]`. Vigilia canta desde aquí en el combate 1.
- **Trono-Cadalso** (derecha): patíbulo con trampilla, `['B', 60, 14, 14, 3]` y `['P', 58, 11, 6]`. Cadalso empieza aquí.
- **Suelo central** de losas negras con **tres trampillas** (`x = 26-31`, `38-43`, `50-55`): losas que Cadalso hace desaparecer unos segundos (se ven marcadas antes).
- **Dos cadenas del techo** (`x = 20` y `x = 56`), decorativas hasta la fase de furia.
- Techo alto y sin antorchas encendidas; ambiente de teatro apagado.

### 4.5 Enlaces [PROPUESTA]

Las coordenadas `x` de los huecos `S` son **locales al área de arriba**. Todas están comprobadas contra la regla de adyacencia (celdas de 26 tiles).

```js
// Ascensor
S('gran', 'asc2', 18, 4, { gate: 'madre' });           // tapa de hierro hasta que cae la Madre Moho
E('asc2', 'pat1');
// Patíbulo (verde): todo hacia la derecha
E('pat1', 'pat2'); E('pat2', 'pat3'); E('pat3', 'pat4'); E('pat4', 'pat5'); E('pat5', 'pat6');
E('pat6', 'dep1', 3, { gate: 'capitan' });             // PUERTA CON LLAVE: se abre al caer el Capitán
// Pozo del Patíbulo a la Despensa y azul claro
S('pat2', 'alta', 28, 4);                              // el pozo vertical del verde
E('mer', 'alta');                                      // Casa del Mercader, ida y vuelta
S('mer', 'pm', 30, 4);                                 // pozo vertical del Mercader
E('pm', 'milla');                                      // a su derecha, La Milla Verde
S('milla', 'carc', 30, 4);                             // a las Cárceles
// Despensa (gris azulado)
E('alta', 'pasD'); E('pasD', 'desp');
S('desp', 'cellar', 12, 4); S('desp', 'cellar', 60, 4); // los DOS pozos
E('cellar', 'sec', 3, { crack: true });                // el Secreto, a la derecha de los pozos (muro agrietado)
// Pasillo largo (amarillo) y la Capilla
E('cellar', 'y1'); E('y1', 'y2'); E('y2', 'y3');
S('cap', 'y3', 40, 4, { gate: 'capitan' });            // escalera a la Capilla: sellada hasta que cae el Capitán
// Dependencias (rojo): sala alta + tres salas apiladas + jefe final
S('dep1', 'dep2', 44, 4); S('dep2', 'dep3', 6, 4);
S('dep3', 'dep4', 44, 4, { gate: 'chambelan' });       // sellado hasta que cae el Chambelán
S('dep4', 'tronos', 6, 4);
```

**Comprobaciones de adyacencia** (a mano):

- `asc2` (x0 = 78) + 26 = 104 = `pat1`.x0. `pat1` (2) → `pat2` en 156; `pat2` (3) → `pat3` en 234; `pat3` → `pat4` en 312; `pat4` → `pat5` en 390; `pat5` → `pat6` en 468; `pat6` (1) → `dep1` en 494.
- `pat2` (fila 9) está encima de `alta` (fila 10): 10 × 18 = 180 en ambos. El hueco `x = 28` de `pat2` (x0 = 156) cae en `gx 184..187`, dentro de `alta` (x0 = 182, interior 183 a 206).
- `mer` (x0 = 130, ancho 52) acaba en 182 = `alta`.x0. Las dos tienen el suelo en la fila 12 (`bottom = 234`).
- `alta` (26) → `pasD` en 208 → `desp` en 234 (todas con `bottom = 234`).
- `mer` (fila 12) sobre `pm` (fila 13), mismo `x0 = 130`. El hueco `x = 30` cae en `gx 160..163`, dentro de `pm` (interior 131 a 180). `pm` acaba en 182 = `milla`.x0. `milla` (fila 13) sobre `carc` (fila 14), mismo `x0 = 182`; hueco `x = 30` → `gx 212..215`, dentro de `carc` (interior 183 a 232).
- `desp` (x0 = 234, fila 12) sobre `cellar` (fila 13): huecos `x = 12` (→ `gx 246..249`) y `x = 60` (→ `gx 294..297`), dentro de `cellar` (interior 235 a 310).
- `cellar` (x0 = 234, ancho 78) acaba en 312 = `sec`.x0 = `y1`.x0. `y1` → `y2` en 364 → `y3` en 416.
- `cap` (fila 13) sobre `y3` (fila 14), ambos con `x0 = 416`. Hueco `x = 40` → `gx 456..459`.
- `dep1` (x0 = 494, filas 9-10) acaba en la fila 11 = `dep2`. Huecos: `x = 44` → `gx 538..541`, dentro de `dep2` (interior 495 a 544); `dep2` → `dep3` `x = 6`; `dep3` → `dep4` `x = 44`; `dep4` → `tronos` `x = 6`.
- Ningún área rebasa la columna 21 (`COLS = 22`).

**Subida de regreso:** cada sala con un hueco en el techo lleva un `['climb', hx, 4, 'norm', true]` donde recibe el hueco (`alta`, `pm`, `carc`, `cellar`, `dep2`, `dep3`, `dep4`, `tronos`), como las salas existentes. **Para volver rápido se usa el viaje rápido** (hogueras).

**Salida hacia la Parte 3:** `tronos` no tiene salida todavía. Al caer Vigilia queda un hueco de escalera hacia abajo, **sin construir** (placeholder).

### 4.6 Etapas y orden de progresión (estilo `ZONA1.md`) [PROPUESTA]

Las etapas 0 a 7 son las de la Zona 1 y **no cambian**. La «etapa 8 (fin)» de `ZONA1.md` pasa a ser la **etapa 8 de la Zona 2**.

| Etapa | Jefe | Lo que da | Lo que abre | Salas nuevas | Desvíos |
|---|---|---|---|---|---|
| 8 | **Capitán de Hierro** (`y3`), **primer jefe obligatorio**. Además, en cualquier orden y opcionales: **Último Farero** (`carc`) y **La Subastadora** (`sec`) | Capitán: **llave de los Funcionarios** y mejora de Cor (sed de sangre 0,40 → 0,50). Farero: **se libera a Lúa** y mejora de Zaf (luz 1,8 → 2,0). Subastadora: mejora de Malak (almas 1,5 → 1,7) | La puerta con llave del Patíbulo, la escalera a la Capilla | `asc2`, `pat1`-`pat6`, `alta`, `mer`, `pasD`, `desp`, `cellar`, `sec`, `pm`, `milla`, `carc`, `y1`-`y3` | Cristales en `pat4`, `sec`, `milla`; gema con Alas en `y2` |
| 9 | **Chambelán Sin Rostro** (`dep3`) | Mejora de Matis (velocidad 0,82 → 0,88) | El hueco a la Antesala de los Regentes | `cap`, `dep1`-`dep3` | Cristal en `dep2` |
| 10 | **Cadalso y Vigilia** (`tronos`), en este orden y sin descanso | — (gemas y almas) | El hueco hacia la Parte 3 (por diseñar) | `dep4`, `tronos` | Forja de `dep4` (mejora de arma) |

Habilidades que se exigen: **todas las de la Zona 1** (Impulso, Doble salto, Salto de pared, Pisotón). No hay habilidades nuevas. **Alas y Ojo** siguen siendo opcionales: lo que exige planear (`y2`) cuenta como opcional en la variante Vesper.

Para que el validador pruebe cada habilidad: el Patíbulo exige Doble salto y Salto de pared; la Despensa, Pisotón (suelos de tarima `R` en `cellar`); la Milla Verde, Salto de pared; el pasillo amarillo, Impulso; las Dependencias, Doble salto e Impulso.

**Una sola mejora de daño por zona (regla de `ZONA1.md`).** Va **al final**, en la forja de `dep4` (5.6). Las mejoras de los hitos son de estadística y **no tocan el daño**.

### 4.7 La llave y la puerta con llave [DECIDIDO que la da el primer jefe; texto PROPUESTA]

- **Nombre:** **Llave de los Funcionarios**.
- **Descripción (diario/objeto):** «Una llave de hierro de tres dientes con un sello de cuatro puntas. El Capitán la guardó durante años sin saber qué abría.»
- **Cómo se consigue:** la suelta **el Capitán de Hierro** (`capitan`) al caer.
- **Cómo se guarda:** **no es un objeto del inventario**. Es **«la puerta se abre cuando `progress.bosses` incluye `capitan`»**, igual que las demás puertas por jefe (`E('pat6', 'dep1', 3, { gate: 'capitan' })`). Se guarda sola con el progreso compartido y con cada ranura. Si se vuelve a un punto de control anterior en solitario, el jefe reaparece y la puerta se vuelve a cerrar.
- **Dónde está la puerta:** al este de `pat6` (Antesala de los Funcionarios), al final del Patíbulo, arriba. Es una reja con **tres cerraduras** y el sello de cuatro puntas.
- **Qué dice:**
  - Al acercarse con la puerta cerrada (evento D11): «Cerrada con llave.»
  - **El Capitán, al caer:** «Nunca supe qué abría. Ábrela tú y dime luego si valió la pena.»
  - **Aviso al caer** (`toast`, 8 s): «El Capitán suelta una llave de tres dientes con un sello de cuatro puntas. En el Patíbulo, la puerta de los Funcionarios se abre.»
  - **Marcador en pantalla** (opcional): mientras la llave exista y no se haya entrado en `dep1`, en la línea de la HUD aparece `[Llave de los Funcionarios]` (como `[Martillo Latente]` y `[Anillo del Rey]`, `extras.js:424`).
- **Qué más abre la misma clave `capitan`:** la **escalera a la Capilla** (`S('cap', 'y3', ..., { gate: 'capitan' })`). Mientras viva el Capitán, la Capilla no se alcanza.

---

## 5. Contenido nuevo

### 5.1 Jefes [PROPUESTA]

> **Nota 01/11/2026 (decidido por Txaberocio):** los Regentes son un **jefe doble simultáneo**: Cadalso (72) y Vigilia (80) pelean a la vez, cada uno con su barra, y el jugador elige a cuál mata primero. Sustituye a los «dos combates seguidos» que describe el resto de este apartado.

**Reparto.** No se necesitan cuatro jefes grandes: el **Capitán de Hierro** es el único jefe «mayor» del tramo, los otros tres son **mini-jefes** con una sola mecánica nueva cada uno, y los Regentes cierran la parte.

**Vida.** Pensada para el daño con el que se llega: al final de la Zona 1 la espada y la lanza hacen 2, la guadaña 3 y el arco 1 con dos flechas por disparo (`WEAPONS`, nivel 3).

| Jefe (`id`) | Dónde | Tipo | Vida | Golpes con 2 de daño | Con guadaña (3) | Gemas (`GEMS_BOSS`) | Almas (`SOULS`) |
|---|---|---|---|---|---|---|---|
| Capitán de Hierro (`capitan`) | `y3` | **Jefe** (da la llave) | 80 | 40 | 27 | 4 | 200 |
| Último Farero (`farero`) | `carc` | Mini-jefe (opcional) | 64 | 32 | 22 | 3 | 150 |
| La Subastadora (`subastadora`) | `sec` | Mini-jefa (opcional, secreta) | 72 | 36 | 24 | 3 | 160 |
| Chambelán Sin Rostro (`chambelan`) | `dep3` | Mini-jefe | 88 | 44 | 30 | 5 | 240 |
| **Cadalso, el Verdugo Mudo** (`cadalso`) | `tronos` | **Jefe final, combate 1** | **104** | **52** | 35 | 5 | 400 |
| **Vigilia, la Cantora de la Hondura** (`vigilia`) | `tronos` | **Jefe final, combate 2** | **116** | **58** | 39 | 8 | 500 |

Todos con `drop: null` en `BOSSES`. Entran en `World.BOSSES`, `EN` (`kind: 'boss'`), `GEMS_BOSS`, `SOULS`, `BESTIARY` (11.3) y `BOSS_IDS` del servidor. **Los dos combates finales suman 110 golpes con 2 de daño** (unos 4 minutos con esquivar); si se hace pesado, 96 y 104 (pregunta 13.9).

**Mecánicas** (máquinas de estados «telegrafiar → actuar → recuperar» en `bossAI`, `game.js:927`). Los tiempos son de partida y se afinan jugando:

| Jefe | Ataque | Aviso | Qué hace |
|---|---|---|---|
| **Capitán de Hierro** | Carga | 0,7 s | Embiste (alcance 320, velocidad 360, como el Capitán de Armaduras); espera 3,4 s |
| | Marcha | 0,6 s | Dos ondas por el suelo hacia cada lado (`shock`); espera 4 s |
| | Escudo | — | Alterna escudo azul (invulnerable) y guardia baja, como `kn` |
| | **Formación** (por debajo del 50 %) | 1 s | Invoca hasta 2 `guard` en las esquinas. Espera 14 s |
| **Último Farero** | Barrido | 1 s | Un rayo de luz recorre la sala (2 de daño); espera 4 s |
| | Apagón | 0,8 s | Apaga las tres lámparas de la sala (como el soplido del Espectro) |
| | **Lámpara** | — | **Es invulnerable en la oscuridad**: hay que **encender** las tres lámparas con `{act}`. Él las apaga con el Apagón. Es lo **inverso** al Guardián del Reloj |
| **La Subastadora** | Subasta de frascos | 0,5 s | Lanza 3 `frasco` en parábola (`shroomb` con otro dibujo) que estallan en `boom`; espera 3,2 s |
| | Deuda | 1,2 s | Marca el suelo (`mark`) y alza un pilar (`pillar`) como el Conde; espera 4,5 s |
| | **Puja** (por debajo del 50 %) | 1 s | Se teletransporta al lado opuesto e invoca hasta 3 `frasco` débiles |
| **Chambelán** | Abanico de pétalos | 0,6 s | Lanza 3 pétalos (`petal`, 1 de daño) en abanico; espera 2,6 s |
| | Reverencia | 0,5 s | Se teletransporta a la espalda del jugador (como el `blink` del Espectro Penitente); espera 4,5 s |
| | **Baile** (por debajo del 50 %) | 1 s | Invoca hasta 2 `cort`. **Es invulnerable mientras haya alguno vivo.** Espera 12 s |

**Voces de los mini-jefes** (burbuja o rótulo):

- **Último Farero**, al empezar: «No debías bajar... pero me alegro de verte.» Al caer: «Lo hice por ella. No fue por ti.»
- **La Subastadora**, al empezar: «Lo que no se reclama, se subasta.» Al caer: «Se acabó la subasta.»
- **Chambelán**, al empezar: «Yo solo abrí una puerta.» Al caer: «Ellos cantaban. Yo solo firmé.»
- **Capitán de Hierro**, al caer: «Nunca supe qué abría. Ábrela tú y dime luego si valió la pena.»

**Durante el combate de la Subastadora** (en `sec`, pequeña): sin ayudas.

#### Combate 1: Cadalso, el Verdugo Mudo (104 de vida) [PROPUESTA]

Cadalso empieza junto al **Trono-Cadalso**. **Vigilia ya está en la sala**, fija en la tribuna del **Trono-Atril**, **invulnerable** y fuera de combate (`inv` hasta que caiga Cadalso), y su canto marca el compás de la pelea. No hay descanso al acabar este combate.

| Ataque | Aviso | Qué hace |
|---|---|---|
| **Hachazo** | 0,8 s | Arco de 90 px delante de él, 2 de daño. Espera 2,4 s |
| **Cadena** | 1,0 s | Lanza una cadena (`cadena`, tipo `lash`, alcance 260 px). Si acierta, **arrastra al jugador** hacia él y remata con un hachazo. Espera 5 s |
| **Trampilla** | 1,2 s | Tres losas del suelo, **marcadas antes**, desaparecen 2 s: quien esté encima cae a pinchos (1 de daño y vuelve a la última posición segura, como los pinchos existentes). Espera 8 s |
| **Compás** (de Vigilia, cada 10 s) | Tres golpes con sonido | Tras el tercer golpe, una onda `shock` cruza el suelo de izquierda a derecha: hay que saltar en el tercero |
| **Furia** (por debajo del 50 %) | — | Hachazo doble y **dos cadenas del techo caen como lianas** (`vine`) cada 9 s |

- **Voz:** al empezar Vigilia le dice «Cobra, querido» y Cadalso responde con un «Cobro.» (rótulo). Al caer, de rodillas, dice «Perdón.» (evento B20).
- **Transición:** al caer Cadalso, el cuerpo queda y **Vigilia baja del atril**, ya sin `inv`. Tres segundos de pausa con la música de jefe cortada y el canto sonando.

#### Combate 2: Vigilia, la Cantora de la Hondura (116 de vida) [PROPUESTA]

Vigilia **flota** (`fly: true`, como `conde`/`aurora`). Cada vez que canta se rompen las puntadas de plata de su boca (detalle visual).

| Ataque | Aviso | Qué hace |
|---|---|---|
| **Nota** | 0,5 s | Abanico de 3 notas (`nota`, como `petal` en dorado pálido, 1 de daño). Espera 2,4 s |
| **Aria** | 1,5 s | Sube al techo y canta 3 s: ondas `shock` por el suelo **cada 0,75 s, alternando lados** (hay que saltar al compás). Al terminar **cae aturdida 2 s** (ventana de daño). Espera 9 s |
| **Coro** | 1,0 s | Invoca hasta 3 `eco`, débiles. Mientras haya ecos, **recibe la mitad de daño** (no es invulnerable). Espera 12 s |
| **Réquiem** (por debajo del 50 %) | — | El **fantasma de Cadalso** cruza la arena con un hachazo cada 8 s, telegrafiado por una sombra en el suelo |

- **Voz:** habla en pareados (frases en PERSONAJES.md, 2.6). Al caer: la escena de cierre (11.4).
- **Lúa** espera fuera de `tronos` durante los dos combates (regla de 8.2).

### 5.2 Enemigos [PROPUESTA]

Entran en `EN` (`game.js:120`), en `BESTIARY`, en `SOULS`, en `NAMES` de `recorrido.js` y en la lista `kills` del servidor (ver 12.7). La columna **Débil** dice si Lúa puede matarlo (vida base ≤ 4; ver 8.2). Las vidas son **antes** de `ZONE_SCALE`. **Dónde aparece cada uno** está en la tabla de salas (4.4).

| `id` | Nombre | `kind` base | Vida | Daño | Débil | Comportamiento |
|---|---|---|---|---|---|---|
| `cort` | Cortesano de Sombra | `ghost` | 3 | 1 | Sí | Atraviesa muros y avanza en zigzag. Cada pocos pasos se detiene un instante (ventana para golpearlo) |
| `rosa` | Rosa Negra | `turret` (inmóvil) | 4 | 1 | Sí | Escupe 3 pétalos en abanico (`petal`) cada 2,4 s |
| `guard` | Guardia de Hierro | `walk` con escudo | 6 | 2 | No | Marcha por filas: no ataca hasta que alguien rompe la formación; al caer la fila, se activa la siguiente |
| `arq` | Arquero Hueco | `turret` (inmóvil, en la pared) | 3 | 1 | Sí | Dispara una flecha recta (`flecha`) cada 2 s |
| `farol` | Farolillo Errante | `bat` | 1 | 1 | Sí | Vuela hacia el jugador y estalla al tocarlo: además de daño, **ciega 1,5 s** (la pantalla se oscurece y se anula la visión nocturna) |
| `ahogado` | Ahogado | `walk` lento | 5 | 2 | No | Deja un charco que **frena** (como la baba de `slug`) |
| `frasco` | Frasco Inquieto | `moth` | 2 | 1 | Sí | Flota; al morir estalla en una nube que daña un poco (`boom`) |
| `cobrador` | Cobrador de Deudas | `walk` rápido | 5 | 1 | No | Persigue; al golpear **roba 10 almas** (sin bajar de 0) y las suelta al morir |
| `eco` | Eco de Vigilia | `ghost` | 2 | 1 | Sí | Solo aparece en el combate de Vigilia (invocado por el Coro). Flota y canta; se rompe de un golpe |

**Élites** (como los de `ELITE_AB`, `game.js:147`; el élite tiene el triple de vida y una recompensa fija):

| Nombre | Dónde | Base | Habilidad | Recompensa |
|---|---|---|---|---|
| Pujador Mayor | `cellar` | `kn` | `haste` con rastro | 160 almas + Tónico de almas |
| Vigía Hundido | `milla` | `kn` | `orbs` (alcance 380) | 150 almas + Aceite de linterna |
| Sargento de Hierro | `y2` | `kn` | `charge`, alcance 320 | 140 almas + Piel de piedra |
| Mayordomo Sin Rostro | `dep1` | `kn` | `blink` (teletransporte con aviso) | 130 almas + Poción mayor |

**Escala de dificultad por zona de paleta** (nuevas entradas de `ZONE_SCALE`, índices 10 a 15): `[..., 1.9, 2.2, 2.1, 2.0, 2.0, 1]`, es decir: Patíbulo (z10) 1,9; Dependencias (z11) 2,2; Capilla (z12) 2,1; Milla Verde (z13) 2,0; Despensa (z14) 2,0; Tronos (z15) 1 (sin enemigos corrientes). Opcional: +2 de daño por contacto desde `z >= 13` (`game.js:607`); pregunta 13.7.

**Proyectiles nuevos** (`PR`, `game.js:156`): `petal` (como `orb`, violeta), `nota` (como `petal`, dorado pálido), `flecha` (`orb` alargado, `hb: [24, 8]`), `cadena` (como `lash`), `frasco` (como `shroomb`) y `rayo` (el del Farero, `hb` grande y largo).

### 5.3 Secretos, objetos y lugares inalcanzables [PROPUESTA]

| Sala | Qué hay | Cómo se llega | Disparador de charla |
|---|---|---|---|
| `pat4` | Cristal de vida | Muro agrietado. Malak necesita Bomba o ayuda | D04 (genérico) |
| `cellar` → `sec` | **Conservera Mayor**: mini-jefa, cristal de vida, el frasco grande y fragmento del sello | **Muro agrietado a la derecha de los pozos**, a media altura (repisa en `y = 17`). Malak necesita Bomba o ayuda | D13 |
| `y2` | Gema en un saliente | Solo planeando (Alas). Opcional | D14 |
| `milla` | Cristal de vida en un saliente alto | Salto de pared | — |
| `dep2` | Cristal de vida y gema | Muro agrietado con `['bleed', ...]` | D15 |
| `pat6` | Puerta con llave | Se abre al caer el Capitán | D11 |
| `y3` | Escalera a la Capilla | Se abre al caer el Capitán | D12 |
| `carc` | Celda de Lúa | Se abre al caer el Farero | A20 |

**Fragmentos del sello de cuatro puntas:** uno por hito (Capitán, Farero, Subastadora, Chambelán). Es una escena, no un objeto de inventario; juntos forman el símbolo de la llave (PERSONAJES.md, 4.9).

**Cristales de vida:** 4 (`pat4`, `sec`, `milla`, `dep2`). **Gemas del mapa:** 8 (`pat3`, `desp`, `cellar`, `milla`, `y2`, `cap`, `dep1`, `dep2`; coordenadas por decidir, en `GEMS` de `world.js:132`).

**Corazones:** 15 al llegar (5 + 8 cristales + 2 Frutos); con 4 cristales más serían 19. Si se sube el máximo de Frutos de sangre (pregunta 13.6), hasta 21.

### 5.4 Hoguera y viaje rápido [PROPUESTA]

- Hogueras nuevas: `pat1`, `desp`, `cap` y `dep4`. Total de la Zona 2: **4**.
- **La lista de viaje rápido ya se queda corta hoy:** muestra 12 filas (`openTravel`: `.slice(0, 12)`, 12 `travelRows`, `extras.js:1763-1772`) y la Zona 1 tiene **14 hogueras** (contadas en `world.js`: `altar` ×12 y `bigfire` ×2). Con la Zona 2 serían 18. Hay que **paginar o desplazar la lista**.
- **Importante para este mapa:** tras vencer al Capitán hay que volver a la puerta con llave. La hoguera de `cap` y el viaje rápido a `pat1` lo hacen en un segundo.

### 5.5 Tiendas [PROPUESTA]

Dos mercaderes. La clave de `SHOP_STOCK` es el id del área:

```js
mer: [['pot', 0], ['bomb', 0], ['lamp', 0], ['ward', 0], ['spd', 0], ['amu', 0]],   // Casa del Mercader (azul claro)
cap: [['pot', 0], ['pot2', 0], ['bomb', 0], ['lamp', 0], ['ward', 0], ['str', 0], ['spd', 0], ['rage', 0], ['tonic', 0], ['amu', 0], ['talis', 0], ['fruit', 0]]  // Capilla
```

y se añaden `'mer'` y `'cap'` al final de `SHOP_ORDER`. **El mercader de `mer` vende Bombas** (Malak las necesita para romper el muro del Secreto en solitario) y está **antes** del Secreto. Si se amplía el Fruto de sangre (hoy `max: 2`; el servidor limita `perm.hp` a 0 a 2), hay que cambiar ambos sitios (pregunta 13.6). El Colmillo de acero **sigue sin venderse**.

### 5.6 Forja de la Antesala de los Regentes [PROPUESTA]

`['forge', 24, 16]` en `dep4`. Sube el arma de **nivel 3 a nivel 4**, **antes** del combate con los Regentes. Con la tabla actual de `WEAPONS`:

| Vampiro | Nivel 3 | Nivel 4 | Qué cambia |
|---|---|---|---|
| Espada | daño 2, 72, 0,30 | daño 2, 84, 0,26 | Alcance y velocidad |
| Lanza | daño 2, 120, 0,40 | daño 2, 140, 0,36 | Alcance y velocidad |
| Arco | daño 1, 2 flechas, 350 | daño 2, 2 flechas, 420 | **Daño** y alcance |
| Guadaña | daño 3, 102, 0,56 | daño 3, 114, 0,50 | Alcance y velocidad |

Es una **sola** mejora de arma en la zona. Solo el Arco gana daño; el nivel 5 queda para zonas posteriores. Si Txaber quiere que **todos** ganen daño en la Zona 2 habría que poner una segunda forja (nivel 5): pregunta 13.4.

### 5.7 Música, paletas y decorado por tramo [PROPUESTA; reasigna las `z` 10 a 15]

Cada tramo del mapa usa una zona de paleta `z`. **Reasignación respecto a los nombres antiguos:**

| `z` | Nombre (`World.ZONES`) | Tramo (color) | Áreas | Antes se llamaba |
|---|---|---|---|---|
| 10 | **Patíbulo Exterior** | Verde | `asc2`, `pat1`-`pat6` | Refugio de Isolda |
| 11 | **Dependencias de los Funcionarios** | Rojo (sin las dos últimas salas) | `dep1`-`dep3` | Jardín de las Rosas Negras |
| 12 | **Capilla del Cuartel** | Amarillo | `y1`-`y3`, `cap` | Cuartel Hueco |
| 13 | **La Milla Verde** | Azul claro | `mer`, `pm`, `milla`, `carc` | Faro Ciego |
| 14 | **La Despensa** | Gris azulado | `alta`, `pasD`, `desp`, `cellar`, `sec` | Mercado Hueco |
| 15 | **Los Tronos** | Rojo oscuro | `dep4`, `tronos` | Los Tronos |

Hay que tocar cuatro sitios, **sin romper el índice de la pista de calma** (`ZONES.length - 1` en `music.js:27`; las pistas nuevas van **antes** de ella):

| `z` | Paleta (`ZONE_PAL`, `art.js:2`) | Música (`Music.ZONES`, `music.js:14`) | Decorado (`DECOR`, `decor.js:104`) |
|---|---|---|---|
| 10 | `base #566a52, dark #34442f, light #7f9a78, mortar #18221a, bg #141c14, bgd #0e140e, glow #d8ff9a` | `{ root: 36, bpm: 58, pad: 'sawtooth', drone: true }` (viento y cuervos) | bg `p_bones, p_cage, p_stocks, p_candles_floor, p_rack`; wall `w_chains, w_bars, w_shield`; fg `b_barrel, b_bucket, b_sack, b_jar` |
| 11 | `base #6a2a3a, dark #421822, light #9a4a5c, mortar #220c14, bg #200c14, bgd #16080e, glow #ff7a8a` | `{ root: 38, bpm: 70, pad: 'sawtooth', royal: true }` (corte) | bg `p_desk, p_scrolls, p_shelf, p_table, p_candel, p_lectern`; wall `w_map, w_painting, w_tapestry`; fg `b_books, b_crate, b_vase` |
| 12 | `base #8a7a3a, dark #5a4c1c, light #c2ae5c, mortar #2c240a, bg #2a230c, bgd #1e1808, glow #ffe08a` | `{ root: 40, bpm: 56, pad: 'square', organ: true }` (órgano de capilla) | bg `p_pew, p_saint, p_column, p_altar_stone, p_candles_floor, p_font`; wall `w_cross, w_window, w_tapestry`; fg `b_urn, b_censer, b_goblet` |
| 13 | `base #34506a, dark #1f3348, light #5a82a6, mortar #0e1a26, bg #0c1620, bgd #08101a, glow #8ad8ff` | `{ root: 35, bpm: 44, pad: 'triangle', drone: true, drip: true }` (agua y un canto lejano) | bg `p_cage, p_stocks, p_bones, p_ironmaiden, p_candles_floor`; wall `w_bars, w_chains, w_window`; fg `b_bucket, b_jar, b_lantern` |
| 14 | `base #4f5d6e, dark #2f3a47, light #7a8ca0, mortar #141b24, bg #10161e, bgd #0b1016, glow #9fd8ff` | `{ root: 44, bpm: 66, pad: 'triangle', tick: true }` (feria rota) | bg `p_shelf, p_table, p_cage, p_lampost, p_candel`; wall `w_tapestry, w_bars, w_painting`; fg `b_jar, b_crate, b_sack, b_barrel, b_mushbox` |
| 15 | `base #5a2a3a, dark #341822, light #8a4a5e, mortar #1c0c14, bg #1a0c12, bgd #12080d, glow #ff5a7a` | `{ root: 40, bpm: 60, pad: 'square', organ: true, royal: true }` (órgano de teatro apagado) | bg `p_throne, p_column, p_banner, p_candel, p_statue, p_carpet`; wall `w_tapestry, w_shield, w_painting`; fg `b_urn, b_goblet, b_vase` |

**Música de jefe:** `Music.setBossKind` (`game.js:1254`) elige 0, 1 o 2 según el jefe. Añadir `capitan`, `farero`, `subastadora`, `chambelan`, `cadalso` y `vigilia` a las listas.

**Fallos silenciosos que hay que arreglar a la vez [COMPROBADO]:**

- `buildArt` (`art.js:243-244`) crea el tileset con `80 * 32` de ancho y recorre `z < 10`. Hay que pasar a `ZONE_PAL.length` zonas.
- `DECOR[a.z] || DECOR[0]` (`decor.js:147`): sin entrada, las salas nuevas se decorarían como el Vestíbulo.
- `ZONE_SCALE[extra.zone] || 1` (`game.js:607`): sin entrada, enemigos sin escalar.
- `World.ZONES` (`world.js:13`): el nombre sale en el rótulo de sala y en el mapa.

**Zona oscura.** `carc` (las Cárceles) usa tres `['torch', ...]` explícitas para las lámparas del Farero. La Milla Verde puede ser oscura: las antorchas de salas con enemigos empiezan apagadas (`world.js:315`).

### 5.8 Personajes no jugables y textos [PROPUESTA]

En `NPC_DEFS` (`extras.js:124`): `isolda`, `cura` y `smith3` (en `cap`), `merchant2` (en `mer`), `preso` (en `milla`) y `escribiente` (en `dep1`). El mercader de `cap` reutiliza `merchant`. Sprites con `makeMap('npc_x', 'npcMad', madPal(pelo, ropa), 1)` como `npc_king` (`art.js:274`). Textos en la sección 11. **Sprites nuevos:** `capitan`, `farero`, `subastadora`, `chambelan`, `cadalso`, `vigilia`, `eco` y Lúa.

**El herrero de la Capilla (`smith3`):** pide Txaber un herrero en `cap`. **Propuesta:** es un segundo taller con los mismos poderes que el Herrero de la Cueva: si `hammerState >= 2`, menú `all`; si no, menú `imbue` (elementales). Hay que decidir cómo cuadra con el Herrero de la Cueva (pregunta 13.10).

---

## 6. Mejora de estadística de cada hito [PROPUESTA]

### 6.1 Valores (explicados en `PERSONAJES.md`, 4.7)

| Hito (jefe) | Vampiro (`color`) | Campo de `PASSIVES` | Valor actual | Suma | Valor nuevo |
|---|---|---|---|---|---|
| Capitán de Hierro (`capitan`) | Cor (`red`) | `life` | 0,40 | +0,10 | **0,50** |
| Último Farero (`farero`), libera a Lúa | Zaf (`blue`) | `aura` | 1,8 | +0,20 | **2,0** |
| La Subastadora (`subastadora`) | Malak (`green`) | `souls` | 1,5 | +0,20 | **1,70** |
| Chambelán Sin Rostro (`chambelan`) | Matis (`purple`) | `speed` | 0,82 | +0,06 | **0,88** |

En la historia es **el colmillo del vampiro despertando**.

### 6.2 Cómo implementarlo

- **No se guarda nada nuevo.** El bonus se **calcula** a partir de `progress.bosses` (el jefe del hito) y se reaplica cada vez que cambia el progreso. Así el punto de control (`revertWorld`) lo quita solo si el jefe vuelve a aparecer.
- Datos:

```js
const PASSIVE_BONUS = {
  red:    { boss: 'capitan',     key: 'life',  add: 0.10 },
  blue:   { boss: 'farero',      key: 'aura',  add: 0.20 },
  green:  { boss: 'subastadora', key: 'souls', add: 0.20 },
  purple: { boss: 'chambelan',   key: 'speed', add: 0.06 },
};
```

- En `initExtras` (`extras.js:291`, `this.pas = PASSIVES[this.color]`) y en `applyProgress` (`game.js:404`) se reconstruye `this.pas = { ...PASSIVES[color] }` y, si `progress.bosses` incluye el jefe, se suma `add` a `key`. **Nunca modificar `PASSIVES` directamente**: es compartido por todos los jugadores del mismo navegador.
- Usos del campo, para probar: `speed` en `extras.js:597`; `life` en `extras.js:966`; `aura` en `extras.js:379` (`auraMul`); `souls` en `extras.js:1063`.
- **Cor y los jefes:** el código limita la curación en jefes a 0,25 (`Math.min(lifeP, 0.25)`, `extras.js:966`), así que la mejora de Cor solo se nota con enemigos corrientes. Si se quiere que se note también en jefes, subir el tope a 0,30 (pregunta 13.5).
- **Aviso al ganarla** (`toast`, solo al vampiro dueño, 6 s): Cor «La sangre rinde más: sed de sangre del 40 % al 50 %.» · Zaf «Ves un poco más lejos en la oscuridad: luz +11 %.» · Malak «Cobras mejor: almas +13 %.» · Matis «Tu paso gana ligereza: velocidad +7 %.»
- Quien no está en la partida cuando cae el jefe la recibe igualmente al cargar su partida, porque el cálculo parte de `progress.bosses`.
- **Las mejoras de Zaf y Malak son opcionales** (la Milla Verde y la Conservera Mayor lo son): si nadie vence a esos jefes, no hay bonus. Pregunta 13.8.

**No choca con la regla de una sola mejora de daño por zona:** ningún campo tocado es `dmg`, `perm.dmg` ni `wlv`.

---

## 7. Sistema de charlas y pensamientos [PROPUESTA]

### 7.1 Qué es

- **Charla (multijugador):** conversación de 2 a 5 líneas entre vampiros presentes en la partida.
- **Pensamiento (solitario):** una frase del vampiro, en burbuja, cuando se juega con un solo jugador.
- Se disparan por **cuatro tipos de evento**: **A** (primera vez que se entra en un área), **B** (objetivo logrado), **C** (primer enemigo concreto visto) y **D** (lugar inalcanzable visto por ahora). Además hay extras (hoguera, muerte, grupo).
- **Cada evento salta una sola vez por partida guardada.** La lista completa de eventos y sus textos está en `PERSONAJES.md`, secciones 6 a 9 (A01 a A26, B01 a B21, C01 a C20, D01 a D15, L01 a L08, X01 a X03).
- En **B20** y **B21** también hablan Vigilia y Cadalso, como personajes del guion.

### 7.2 Formato de datos

Fichero nuevo `public/talks.js`, cargado **después de `extras.js`** en `index.html` y añadido a `npm run check` (`package.json:33`).

```js
// Disparadores: cuándo salta cada evento
const TALK_TRIGGERS = [
  { id: 'A01', type: 'area',  area: 'vest' },
  { id: 'A22', type: 'area',  area: 'cap' },
  { id: 'B01', type: 'boss',  boss: 'garg' },
  { id: 'B15', type: 'boss',  boss: 'capitan' },
  { id: 'B20', type: 'boss',  boss: 'cadalso', inBoss: true },        // sale durante la transición al combate 2
  { id: 'B14', type: 'ring' },                                       // anillo entregado a Isolda
  { id: 'B11', type: 'forge', n: 1 },                                 // primera forja recogida
  { id: 'C01', type: 'enemy', enemy: 'sk' },
  { id: 'D01', type: 'spot',  area: 'salon', x: 13, y: 16, r: 200, need: { abil: 'dash' } },
  { id: 'D03', type: 'spot',  area: 'caden', x: 49, y: 16, r: 200, need: { gate: 'bishop' } },
  { id: 'D04', type: 'spot',  area: 'archivo', x: 24, y: 16, r: 200, need: { wall: true } },
];
// Textos: una entrada por evento (el mismo id)
const TALKS = {
  A01: {
    pair: ['red', 'green'],                    // pareja principal (colores; el orden da igual)
    needs: [],                                 // vampiros imprescindibles; si falta alguno, no se gasta el evento
    lines: [['red', 'Este es el castillo del Conde. Voy delante.'], ['green', 'Claro. Yo voy detrás, que es donde se cobra.']],
    lua: [['lua', '…']],                       // opcional: comentario de Lúa si ya está con el grupo
    solo: { red: '…', blue: '…', green: '…', purple: '…' },
    soloLua: '…',                              // opcional: respuesta de Lúa a un pensamiento
  },
};
```

- `type: 'area'`: al entrar la primera vez en el área (gancho: el bloque `ar.id !== this.myArea` de `update`, `game.js:1216`).
- `type: 'boss'`: al aparecer el jefe en `progress.bosses` (gancho: `applyProgress`, `game.js:404`). `inBoss: true` permite que salga mientras hay combate (solo B20).
- `type: 'ring'`, `'forge'` y similares: llamadas directas desde el sitio donde ocurre (`kingTalk`/Isolda para el anillo; recoger una forja en `extras.js`).
- `type: 'enemy'`: la primera vez que `noteSeen(type)` registra ese enemigo (`extras.js:1046`).
- `type: 'spot'`: **nueva operación de `world.js`**, `['spot', 'D01', x, y, r, need]`, con las coordenadas locales del área. Cada 0,5 s se comprueba si el jugador local está a menos de `r` píxeles y si la condición `need` sigue sin cumplirse: `{ abil: 'dash' }`, `{ gate: 'bishop' }` o `{ wall: true }`. Si la condición ya no se cumple, el evento no salta.
- Los colores son `red` = Cor, `blue` = Zaf, `green` = Malak, `purple` = Matis, `lua` para Lúa y `vigilia` y `cadalso` para los jefes. Los nombres para mostrar van en un `HERO_REALNAMES` junto a `HERO_NAMES` (`art.js:16`).
- Los textos admiten `{act}`, `{dash}`, `{down}` (`hintText`, `extras.js:80`).

**Lugares para los `spot` [COMPROBADO sobre `world.js` para la Zona 1; coordenadas orientativas]:**

| Evento | Área | x, y (tiles locales) | `need` | Qué se ve |
|---|---|---|---|---|
| D01 | `salon` | 13, 16 | `abil: dash` | El pie de la subida con hueco de 7 casillas (`['climb', 11, 4, 'dash', true]`) |
| D02 | `mazm` | 36, 10 | `abil: dj` | Cristal en `['cry', 43, 5]`, sobre el bloque `['B', 40, 6, 8, 1]` |
| D03 | `caden` | 49, 16 | `gate: bishop` | La reja `E('caden', 'calab', {gate: 'bishop'})` |
| D04 | `archivo` | 24, 16 | `wall` | La puerta agrietada `E('archivo', 'naveS', {crack: true})` |
| D05 | `obs` | 23, 34 | `gate: clock` | `E('obs', 'arch1', {gate: 'clock'})` |
| D06 | `pasR` | 23, 16 | `gate: sellos` | `E('pasR', 'throne', {gate: 'sellos'})` |
| D07 | `grieta` | 3, 16 | `gate: alba` | `E('caida', 'grieta', {gate: 'alba'})` |
| D08 | `cripta` | 24, 16 | `abil: wings` | Los pinchos largos (`['pit', 7, 22]`) y el hueco `S('cripta', 'caida', 1, 6)` |
| D09 | `albaB` | 49, 16 | `gate: alba` | `E('albaB', 'cielo1', {gate: 'alba'})` |
| D10 | `gran` | 19, 16 | `gate: madre` | La tapa nueva del ascensor |
| D11 | `pat6` | 22, 16 | `gate: capitan` | La puerta con llave de los Funcionarios |
| D12 | `y3` | 40, 16 | `gate: capitan` | El hueco de la escalera a la Capilla (con luz de hoguera arriba) |
| D13 | `cellar` | 74, 15 | `wall` | La grieta al Secreto, junto a los pozos (repisa a `y = 17`) |
| D14 | `y2` | 40, 12 | `abil: wings` | El saliente con la gema |
| D15 | `dep2` | 46, 16 | `wall` | El muro que sangra |

### 7.3 Guardado y una sola vez

- **Dónde se guardan los eventos ya vistos:** en el progreso compartido de la sala, **`progress.talks`** (lista de ids). Razones: es compartido por todos los jugadores, se guarda con cada ranura (`world`, `server/index.js:265`) y **no depende del punto de control** (los textos no se repiten al morir).
- **Cambios en el servidor** (`server/index.js`):
  - `freshProgress` añade `talks: []`; al cargar (`index.js:249-251`) se filtra a cadenas que cumplan `/^[A-Z]\d{2}$/`, máximo 200.
  - Evento nuevo `talk`: el cliente que detecta el disparador envía `{ id }`; el servidor comprueba que `id` es válido y que no está en `r.progress.talks`; si es nuevo lo añade y reenvía `io.to(r.code).emit('talk', { id })` a **todos** los clientes (así dos jugadores a la vez no duplican la charla).
- **`revertWorld`** (`extras.js:1256`) reconstruye `this.progress` solo con `abilities, bosses, broken, torches`: hay que **conservar `talks`** al reconstruirlo.
- **No hay que enviar textos por la red:** cada cliente tiene `TALKS` y elige las líneas según el `id` y los colores de `room.players`.

### 7.4 Qué se muestra, a quién y cuándo

1. **Selección** (cada cliente, al recibir `talk`):
   - Si hay **un solo jugador**: se muestra su **pensamiento** `solo[color]`; si Lúa está activa y existe `soloLua`, o el genérico de Lúa, se encadena como respuesta.
   - Si hay **dos o más**: si `pair` está presente, se muestra `lines`; si no, la variante genérica de ese tipo (PERSONAJES 5.1) con dos presentes elegidos por `hash(id) % n`.
   - Si falta alguno de `needs`, **no se consume**: el cliente no emite `talk` y se reintenta la próxima vez que se cumpla el disparador.
   - Si Lúa está activa y hay `lua`, se añade al final; si no, el genérico de Lúa del tipo.
2. **Dibujo:** burbuja de texto sobre el sprite de quien habla (`this.player`, `this.remotes[id].spr`, el jefe o la celda de Lúa), con el estilo del juego (`Courier New` 13 px, `fsz()`, borde negro de 3, `depth 29`, ancho máximo ~260 px). **Pensamiento:** mismo estilo en azul pálido (`#cfd8ff`) y cursiva. **No bloquea el control.** Si el que habla no se ve en pantalla, la línea sale como subtítulo en la parte baja con su nombre delante.
3. **Duración:** `1400 ms + 45 ms por letra`, entre 2 y 6 s; pausa de 350 ms entre líneas.
4. **Cola:** una conversación a la vez; máximo 2 en cola. Se aplaza mientras haya un diálogo/tienda/mapa abierto, una escena (`this.cut`) o un enemigo en combate a menos de 400 px; si pasan 20 s, se descarta.
5. **Jefes:** durante un combate de jefe no sale nada (salvo B20). Los eventos de tipo B salen **después**.

### 7.5 Multijugador y solitario, resumen

| | Solitario | Multijugador |
|---|---|---|
| Qué se muestra | Pensamiento del vampiro | Charla de la pareja del evento (o genérica) |
| Quién lo dispara | El único jugador | El primero en cumplir el disparador; el servidor evita duplicados |
| Lúa activa | Responde o comenta | Comenta al final de la charla |
| Se gasta si falta alguien imprescindible | Nunca (solo hay uno) | No: se reintenta |

---

## 8. Lúa, compañera permanente [PROPUESTA; sigue las reglas ya aprobadas]

### 8.1 Cuándo aparece

- **Estado derivado:** Lúa está en el grupo si `progress.bosses` incluye `'farero'` (el Último Farero, en las Cárceles). **No hay estado nuevo en el servidor.** Así el punto de control en solitario (`revertWorld`) la quita sola si el jefe vuelve.
- **Rescate:** al caer el Farero se abren los barrotes de su celda (`['K', x, y, w, h, 'farero']`, en `carc`), sale caminando y se une al grupo. Escena con el evento B16. Desde entonces **acompaña al grupo hasta el final del juego**, también por la Zona 1 si se vuelve.
- **Lúa es de la casa de Zaf**, no de Malak: sus charlas con Zaf son las más importantes (L04 y L08).

### 8.2 Reglas

| Aspecto | Regla propuesta |
|---|---|
| **Movimiento** | Sigue al jugador **más cercano** a ella. Va unos 70 a 110 px por detrás, con 0,6 s de retraso respecto a su rastro. **Sin colisión**: no bloquea a nadie ni choca con el suelo, las plataformas o los enemigos. Dibujada detrás del jugador |
| **Teletransporte** | Si está a más de 600 px, o al cambiar de sala, usar ascensor, viaje rápido, reaparecer o descansar, aparece junto al jugador seguido con un `poof` |
| **Látigo** | **Alcance** 150 px en horizontal y ±64 px en vertical, en la dirección del enemigo más cercano. **Aviso** de 0,25 s con el látigo levantado (visible). **Espera** 1,6 s entre latigazos. **Mata** hasta 2 enemigos débiles por latigazo (los 2 más cercanos) |
| **Qué es «débil»** | Enemigo corriente con **vida base ≤ 4** (antes de `ZONE_SCALE`), que no sea jefe, élite, invulnerable (`inv`) ni lleve escudo (`shielded`). Hoy: `sk`, `bat`, `gh`, `slug`, `shroom`, `moth`, `magma` y los nuevos `cort`, `rosa`, `arq`, `farol`, `frasco`, `eco`. **No** lo son: `kn`, `vine`, `pris`, `guard`, `ahogado`, `cobrador`, las sierras, los centinelas, los élites y los jefes |
| **Botín** | Las almas del enemigo van al jugador al que sigue, **sin** el multiplicador de la pasiva ni bonus de Talismán. No suelta gemas. Cuenta para el bestiario |
| **Daño recibido** | **Ninguno.** No la atacan los enemigos ni le afectan los pinchos, la baba o las brasas. No puede morir |
| **Salas de jefe** | Mientras el jefe está vivo **espera fuera** (en la puerta de entrada) y **no ataca**: `y3`, `sec`, `dep3`, `tronos` (los dos combates) y, antes de rescatarla, no está. Vuelve al caer el jefe (el último) o cuando todos salen |
| **Muerte de los jugadores** | Si todos mueren, vuelve con ellos al respawn. Si el punto de control anterior era previo al rescate (solo en solitario), desaparece junto con el jefe vuelto |
| **Solitario** | La simula el único cliente. Sigue al jugador, mata débiles cercanos y habla con él |
| **Multijugador** | La simula el **anfitrión** (como los enemigos) y envía su posición y su estado de latigazo dentro del `snap` (`lua: { x, y, f, a }`). Los demás la dibujan. Si el anfitrión cambia, reaparece junto al jugador más cercano del nuevo anfitrión |
| **Escala de enemigos** | No cuenta como jugador en `coopMul` (`game.js:614`) |
| **Daño a enemigos** | El anfitrión llama a `damageEnt` con la vida entera del enemigo (muerte directa) y el id del jugador seguido, **sin** efectos de la pasiva del arma (Sed de sangre, elementos) |
| **Gráfico** | Sprite nuevo `lua` (12 × 14 como `hero`), con 2 pasos de andar; látigo con `PR.lash` (`game.js:165`, tinte crema) |
| **Diálogos** | Puede hablar en burbuja (color propio). Tiene eventos propios L01 a L08 y el campo `lua` en cada charla (PERSONAJES.md) |

### 8.3 Pruebas mínimas

- Lúa mata un `sk` y un `bat` pero **no** un `kn`, un `pris`, un élite ni un jefe.
- En una sala de jefe se queda fuera y no ataca (incluido `tronos`).
- Con 2, 3 y 4 jugadores sigue a quien está más cerca y se teletransporta al usar el ascensor.
- Al morir todos y reaparecer, vuelve con ellos.
- En solitario, morir tras el rescate sin haber descansado la quita (el jefe reaparece).
- Con Lúa libre antes del Capitán, el resto de la Zona 2 se puede pasar igual.

---

## 9. Dificultad de la zona (estilo `ZONA1.md`) [PROPUESTA]

- **Daño:** la Zona 2 se juega con el daño de final de Zona 1 (espada y lanza 2, guadaña 3, arco 1 con 2 flechas). Hay **una sola** mejora de arma, en la forja de `dep4` (5.6), antes de los Regentes.
- **Corazones:** 15 al llegar; +4 cristales = 19; con Frutos de sangre ampliados, hasta 21.
- **Gemas:** 8 en el mapa, 28 de los jefes (4+3+3+5+5+8) y 4 de los élites (1 cada uno) = **40**.
- **Enemigos:** vida × 1,9 (Patíbulo), × 2,0 (Despensa y Milla), × 2,1 (Capilla), × 2,2 (Dependencias); élites × 3; en cooperativo × 1,3 / × 1,6 / × 1,9 (`coopMul`). Desde `z >= 4` pegan 1 más.
- **Tramos tranquilos:** `asc2`, `cap` y `dep4` (salas seguras con `['calm']`).
- **Tiendas:** `mer` y `cap`. Forja: `dep4`.
- **Misión secundaria:** el Anillo del Rey se entrega a Isolda en `cap` (hoy `quests.anillo` nunca llega a 2: lo tiene que poner el código de Isolda).

| Etapa | Jefe | Vida (golpes con 2 de daño) | Vida de enemigos en el camino | Corazones máx. al empezar la etapa |
|---|---|---|---|---|
| 8 | Capitán (y opcionales: Farero 64, Subastadora 72) | 80 (40) | por calcular con `npm run recorrido` | 15 |
| 9 | Chambelán | 88 (44) | por calcular | 17 |
| 10 | Cadalso + Vigilia | 104 + 116 (52 + 58) | `dep4` sin enemigos | 19 |

---

## 10. Cambios en `docs/` y herramientas

- `docs/ZONA1.md`: la fila «etapa 8» deja de ser el fin; La Gran Hoguera pasa a ser el acceso a la Zona 2.
- `scripts/validate.js`: añadir los jefes a `World.PROGRESSION` y actualizar `names` (`validate.js:237`):
  - etapa 8: `{ bosses: ['capitan', 'farero', 'subastadora'] }` (los tres se alcanzan en la misma fase; el Capitán es el único obligatorio);
  - etapa 9: `{ bosses: ['chambelan'] }`;
  - etapa 10: `{ bosses: ['cadalso', 'vigilia'] }` (misma sala).
  Para la variante Vesper, añadir `y2` a `OPT_ITEMS` (lo que exige planear es opcional). En `rutas`, ampliar `must` con `y3`, `dep3` y `tronos`.
- **El validador no sabe de `S` con `gate`** hasta que se implemente (12.1). Sin eso, las tres puertas sellada por `S` (ascensor, escalera de la Capilla y hueco del Despacho) se tratan como abiertas y el orden de jefes saldría mal.
- `scripts/recorrido.js`: hoy asume que la **última etapa termina en `gran`** (`recorrido.js:83`, 148) y escribe solo `RECORRIDO-ZONA1.md`. Hay que partir el informe: etapas 0 a 7 y llegada a `gran` en el de la Zona 1; etapas 8 a 10 en un nuevo `RECORRIDO-ZONA2.md`. Añadir `NAMES` de los enemigos nuevos (`recorrido.js:20`) y los PNJ (`recorrido.js:21`).
- `README.md` y `README.en.md`: «cuatro jefes» ya no es cierto (hoy hay diez; con la Zona 2, dieciséis).

---

## 11. Textos listos para meter [PROPUESTA]

### 11.1 Diarios (`PAGES`, `extras.js:106`)

Hay 15 ahora; con estos serían 28. Cada diario va en el área de su id con `['page', x, y]`.

| `id` | Título | Texto |
|---|---|---|
| `pat3` | Nota del Patíbulo | Dos lazos, dos nombres: cantora y verdugo. Ninguno llegó a colgar. Quien los descolgó no firmó. |
| `desp` | Libro de cuentas de la Despensa | Cada alma se anota dos veces: una para quien la entrega y otra para la lámpara que la bebe. La segunda columna nunca se salda. |
| `cellar` | Etiqueta de un frasco | Frasco 1: valle de los bosques cerrados. 140 almas en garantía. Se devolverán cuando la deuda se pague sola. |
| `pm` | Aviso a los barcos | Si oyes cantar en la costa, no remes hacia el canto. Si no oyes nada, tampoco. Hay noches en que la luz y la voz son la misma trampa. |
| `milla` | Registro de garantías | Garantía 7: una menor, a cambio de una deuda que se paga sola. Mientras haya deuda, hay garantía. Mientras haya garantía, hay deuda. |
| `carc` | Cuaderno del Último Farero | La noche del temporal me ordenaron encender la lámpara en negro. Los barcos buscaban una luz y encontraron una voz. Me prometieron que quien navegaba esa noche viviría. |
| `y1` | Carta de un cadete | Dicen que el Capitán no ha dormido desde que cerraron las puertas. Le dejo su manta en el patio. Nunca la toca. Las órdenes pesan más que las mantas. |
| `y2` | Orden de la Guardia | Orden única, con dos sellos: el del Alba y otro de cuatro puntas que no reconocí. No abrir hasta que ambos regresen juntos. Y un permiso para la persona más joven de la cuadra: que esa noche estuviera lejos. Lo firmé sin saber por qué. |
| `cap` | Carta de Isolda a nadie | Dejé una escalera con rosas y un anillo en manos de quien no pudo seguirme. Si alguien baja con él, que sepa que no huí por miedo: huí porque me lo pidió. |
| `dep1` | Partitura sin firma | Cuatro notas, una por colmillo: sangre, noche, almas, sombra. Cuando suenen las cuatro juntas, la Sed despierta del todo. |
| `dep2` | Lista de la Corte | Ciento doce nombres. Ninguno en su tumba. Alguien los borró uno a uno, con paciencia. Quien lea esto, que se los devuelva. |
| `dep3` | Libro de visitas | Hoy bailan los nobles, mañana bailan los muertos. El Chambelán anotó los nombres de quienes entraban y borró los de quienes salieron. Alguien de abajo se los dictaba. |
| `dep4` | Contrato de los Regentes | Cadalso cobra. Vigilia canta. Ninguno de los dos habla con voz propia: la que manda es la de abajo. Cláusula única: cuando maduren los cuatro, se devolverá lo guardado. |

### 11.2 PNJ (`NPC_DEFS`, `extras.js:124`)

**`isolda`, Reina Isolda** (en `cap`; la elección de página con `pick`, como `oracle`):

- Primera visita: «Aquí no esperaba visita. Que este fuego os dé la bienvenida.» / «Cuando huí del cerco crucé La Gran Hoguera y terminé en esta capilla. El cura me dio cobijo.» / «La puerta de los Funcionarios, al final del Patíbulo, es donde se firmó mi caída. El Capitán guardaba la llave sin saberlo.»
- Si lleva el anillo (`quests.anillo === 1`): «¿Ese anillo...? Lo reconocería a oscuras.» / «Se lo dejé a quien no pudo huir conmigo. ¿Sigue en su escalera, entre mis rosas?» / «Gracias por traérmelo. Decidle que sigo aquí, y que su escalera no tiene la culpa de nada.» (pone `quests.anillo = 2`; recompensa: pregunta 13.8)
- Si quien habla es Matis (`purple`): «Una sombra detrás de mí, otra vez. Te di por muerta en aquel pasillo. Y yo te acogí de bebé: no se me olvida.»
- Con los Regentes vencidos (`progress.bosses` incluye `vigilia`): «Esa marca en la palma... la vi hace años en un bebé dejado en mi puerta. No supe de quién era.» / «Ahora creo saberlo. Bajad con cuidado y volved a contármelo.»
- Resto de visitas: «Aquí se descansa y se cuenta lo que se sabe. Preguntad cuando queráis.» / «Abajo hay cosas mías que no he sabido afrontar. Perdonadme por no bajar yo.»

**`cura`, Cura de la Capilla** (`cap`): «Cuarenta años rezando y nadie contesta. Yo ya no pregunto.» / «El Capitán nunca dejó subir a nadie sin saber qué quería. Guardaba una llave sin saber qué abría.» / «La llave que os dejó abre la puerta del final del Patíbulo, donde los funcionarios firmaban las órdenes.»

**`smith3`, Herrero de la Capilla** (`cap`): «Soy el Herrero del Cuartel. Aquí también se forja, aunque no se mande.» / «Con el Martillo Latente puedo imbuir cualquier poder. Sin él, solo los elementales.» (con `menu`, ver 5.8)

**`merchant2`, Mercader** (`mer`; mismo dibujo que `merchant`): «Almas, almas... Las prefiero a las monedas. Mira lo que tengo.» / «Abajo, en la Milla, hay una voz que no deja de contestar. Lleva años contestando.»

**`preso`, Preso de la Milla** (`milla`): «Aquí se cuenta con los dedos: un día, un barrote.» / «En la celda del fondo hay alguien que no deja de contestar. A veces cantan por encima de esa voz.» / «El carcelero cuida de esa celda como si fuera de su familia.»

**`escribiente`, Escribiente Fantasma** (`dep1`): «Firmé tantas órdenes que olvidé qué decían.» / «La del cerco no la firmé yo: la traía alguien que hablaba en pareados.» / «Mira bajo los retratos tapados: allí está el nombre de quien mandaba.»

*(Las pistas de estos PNJ dependen del diseño de mapa: comprobarlas contra `world.js` al construir.)*

### 11.3 Bestiario (`BESTIARY`, `extras.js:82`)

| `id` | Nombre | Texto | Consejo |
|---|---|---|---|
| `cort` | Cortesano de Sombra | Nobles de la corte del Rey que siguen bailando una música que ya no suena. Atraviesan los muros y se acercan en zigzag. | Cada pocos pasos se detienen un instante: golpéalos entonces. |
| `rosa` | Rosa Negra | Arraigada entre las tumbas. Escupe pétalos afilados en abanico hacia quien se acerca. | Salen en tres direcciones: ponte entre dos y salta. |
| `guard` | Guardia de Hierro | Armaduras del cuartel que aún marchan por filas. No atacan hasta que alguien rompe la formación. | Cuando cae una fila se activa la siguiente. Escudo en azul: espera. |
| `arq` | Arquero Hueco | Vigila las almenas desde hace siglos y sigue apuntando a quien cruza el patio. | Entre disparo y disparo hay una pausa: aprovéchala. |
| `farol` | Farolillo Errante | Una luz suelta que persigue a quien se mueve. Al tocarlo estalla y ciega. | Mátalo de lejos o salta antes de que te alcance. |
| `ahogado` | Ahogado | Quien se echó al agua esperando una luz y volvió sin ella. Deja un charco que frena. | No pises el charco con más enemigos cerca. |
| `frasco` | Frasco Inquieto | Un alma embotellada que flota sin descanso. Al romperse, estalla. | Rómpelo a distancia. |
| `cobrador` | Cobrador de Deudas | Persigue al que más lleva encima y le cobra al golpear. Si cae, devuelve lo robado. | No lo dejes acercarse con las manos llenas de almas. |
| `eco` | Eco de Vigilia | Una nota suya que se quedó con forma. Canta mientras exista. | Rómpelos pronto: protegen a la cantora. |
| `capitan` | El Capitán de Hierro | Maestro de la guardia y autor del Diario del Capitán. Guarda la escalera de la Capilla y una llave que no sabe qué abre. | Cuando grita «¡Formación!» llegan dos caballeros: no te quedes entre ellos y el muro. |
| `farero` | El Último Farero | Guardián de la lámpara negra. Crió a dos criaturas en un faro y encendió una luz que no guiaba barcos para salvar a una de ellas. | Es invulnerable a oscuras: enciende las tres lámparas con {act}. Él las apagará. |
| `subastadora` | La Subastadora | Guarda la Conservera Mayor, donde se conservan las almas de un valle entero. Vende lo que no es suyo. | Vigila las marcas del suelo y rompe los frascos antes de que lleguen. |
| `chambelan` | El Chambelán Sin Rostro | Jefe de la casa real. Abrió las puertas a cambio de no morir y perdió la cara en el trato. Invoca a la corte para que baile por él. | Mientras queden cortesanos de sombra es invulnerable: acaba con ellos primero. |
| `cadalso` | Cadalso, el Verdugo Mudo | Verdugo de una corte olvidada. Se negó a ahorcar a quien ahora canta y pagó con su lengua. Cobra lo que le mandan, sin decir palabra. | Atento al compás de la cantora: tras el tercer golpe llega una onda. Salta. |
| `vigilia` | Vigilia, la Cantora de la Hondura | Voz de la Primera Sed. Su canto llamó a los colmillos y ahogó luces. Lleva la boca cosida con plata y la descose para cantar. | Cuando sube al techo, salta al ritmo de las ondas; al bajar queda aturdida. |
| `mayordomo` | Mayordomo Sin Rostro | Servía la mesa del Rey. Ahora sirve a quien abrió las puertas. | Reaparece tras un destello: no te quedes quieto. |
| `sargento` | Sargento de Hierro | Entrenó a medio cuartel. Carga sin dar aviso... salvo por un grito. | Cuando grita, aparta. |
| `vigia` | Vigía Hundido | Sigue de guardia en el fondo del lago. Lanza orbes de luz fría. | Esquiva los orbes y golpea cuando recarga. |
| `pujador` | Pujador Mayor | Lleva el ritmo del mercado: siempre sube la apuesta. | Su rastro daña: no lo sigas de cerca. |

### 11.4 Escenas de final (`centerTxt`, 6 s, como la escena del Conde)

- **Cor (Capitán):** «Descanso.\nLas armaduras se sientan, una a una.\nEl Capitán, por fin, cierra los ojos.»
- **Zaf (Farero):** «Una luz blanca donde había una negra.\nLúa sale al aire y se une al grupo.\nNo fue por culpa de nadie: fue un cebo.»
- **Malak (Subastadora):** «Ciento cuarenta nombres.\nLos frascos se abren, uno por uno.\nEl valle, por fin, se va a casa.»
- **Matis (Chambelán):** «Cada persona del registro tiene ya su nombre.\nSolo queda uno sin grabar.\nMatis lo deja así.»
- **Final de la Parte 2 (tras Vigilia):** «Cadalso dice, por fin, una palabra.\nVigilia deja de cantar.\nAbajo, algo despierta... y sabe vuestro nombre.» (precedido de la conversación B21)

---

## 12. Cambios de código necesarios, por fichero [PROPUESTA salvo lo marcado]

### 12.1 `public/world.js`

1. `ROWS = 16` (`world.js:6`).
2. `ZONES` (`world.js:13`): renombrar las entradas 10 a 15 (5.7).
3. `BOSSES`: añadir `capitan`, `farero`, `subastadora`, `chambelan`, `cadalso`, `vigilia` (`drop: null`).
4. **`S()` con `gate`:** en `build()` (`world.js:263-272`), si `l.gate`, poner tiles sólidos en ambos lados del hueco y registrarlos en `world.gates` (como hace `E`, `world.js:255-258`). Se necesita en **tres** sitios: ascensor (`madre`), escalera de la Capilla (`capitan`) y hueco del Despacho (`chambelan`).
5. Nueva operación `['spot', id, x, y, r, need]` que rellena `world.spots` (para las charlas de tipo D).
6. Las 25 áreas (4.4), los enlaces (4.5), `GEMS` (5.3), `['K', ..., 'farero']` en `carc`, `['forge', 24, 16]` en `dep4`, los jefes en sus salas (`['boss', 'cadalso', x, y]` y `['boss', 'vigilia', x, y]` en `tronos`), tres `['torch', ...]` en `carc` y la repisa a `y = 17` en `cellar`.
7. `PROGRESSION`: añadir `{ bosses: ['capitan', 'farero', 'subastadora'] }`, `{ bosses: ['chambelan'] }` y `{ bosses: ['cadalso', 'vigilia'] }`.
8. `DIFF` no hace falta (por defecto `diff = z`).

### 12.2 `public/game.js`

1. `ZONE_SCALE` (`game.js:178`): añadir índices 10 a 15 (5.2).
2. `EN` (`game.js:120`): 9 enemigos y 6 jefes nuevos; `ELITE_AB` (`game.js:147`): 4 élites; `PR` (`game.js:156`): `petal`, `nota`, `flecha`, `cadena`, `frasco`, `rayo`.
3. `bossAI` (`game.js:927`): seis jefes nuevos (5.1). Para el dúo: `vigilia` empieza con `inv` y sin `aggro` y se activa cuando `cadalso` está en `progress.bosses`.
4. `openGates` (`game.js:426`): ampliar el aviso de `'madre'` (3.2) y añadir los avisos de la llave (4.7) y del hueco del Despacho.
5. Rótulo central «ZONA 2» la primera vez que se entra en `asc2` (3.4).
6. Bloque de entrada en áreas (`game.js:1216`): gancho de charlas de tipo A.
7. `applyProgress` (`game.js:404`): gancho de tipo B y recálculo de `PASSIVE_BONUS` (6.2).
8. `Music.setBossKind` (`game.js:1254`): añadir los jefes nuevos (5.7).
9. `HERO_NAMES` en el selector (líneas 71, 75, 92, 96): se arreglan al cambiar `art.js:16`.
10. Texto de la escena del Conde (`game.js:383`): ver 12.6.
11. Lúa: seguidor, látigo y su posición en el `snap` (8).

### 12.3 `public/extras.js`

1. `PASSIVES` (`extras.js:18`): renombrar «Cazadora de almas» (12.6); `PASSIVE_BONUS` (6.2).
2. `BESTIARY`, `PAGES`, `NPC_DEFS`, `SOULS`, `GEMS_BOSS`, `SHOP_STOCK` y `SHOP_ORDER`: contenido de la sección 11 y 5.5.
3. `noteSeen` (`extras.js:1046`): gancho de charlas de tipo C.
4. `updateExtraHud` (`extras.js:405`): comprobación de `spot` de tipo D cada 0,5 s; marcador `[Llave de los Funcionarios]` en la línea de la HUD (`extras.js:424`).
5. `buildGateDoors` (`extras.js:1512`): variante horizontal para las tapas (3.2).
6. `openTravel` (`extras.js:1771`) y `buildTravelUi` (`extras.js:1757`): paginar más de 12 hogueras (5.4).
7. `revertWorld` (`extras.js:1256`): conservar `progress.talks`.
8. `captureState` / `savePersonal`: no hacen falta cambios para charlas, llave ni Lúa (se derivan de `progress`).
9. `kingTalk` (`extras.js:1578`): el Anillo se entrega en la Capilla a Isolda; dejar de decir «cazador» (12.6).
10. Panel de desarrollo (`?dev=1`, `setupDev`): botones «dar a Lúa», «lanzar charla» y «borrar charlas vistas», para probar.

### 12.4 `public/art.js`

1. `ZONE_PAL`: 6 paletas nuevas (5.7). **`buildArt`**: tileset de `ZONE_PAL.length * 8 * 32` de ancho y bucle hasta `ZONE_PAL.length` (`art.js:243-244`).
2. Sprites: 9 enemigos nuevos más sus variantes de élite, 6 jefes, Lúa, los 6 PNJ (con `makeMap` y `madPal`, como `npc_king`).
3. `HERO_NAMES` y `HERO_INFO` (12.6) y nuevo `HERO_REALNAMES = { red: 'Cor', blue: 'Zaf', green: 'Malak', purple: 'Matis' }`.

### 12.5 `public/music.js`, `public/decor.js`, `public/index.html`

- `Music.ZONES`: 6 entradas **antes** de la de calma (5.7).
- `DECOR`: 6 entradas nuevas (5.7).
- `index.html`: cargar `talks.js` después de `extras.js`.

### 12.6 Textos con género (hay que corregirlos para usar Cor, Zaf, Malak y Matis) [COMPROBADO con búsqueda en el repositorio]

| Dónde | Texto actual | Cambio propuesto |
|---|---|---|
| `art.js:16`, `HERO_NAMES` | «Vampiro carmesí», «Vampiro azul», «Vampira esmeralda», «Vampira violeta» | «Cor Carmesí», «Zaf Azul», «Malak Esmeralda», «Matis Violeta» |
| `art.js:18-23`, `HERO_INFO` | «no la curan» (verde); frases que marcan género | Redactar en neutro |
| `art.js:21` y `extras.js:21`, `PASSIVES.green.name` | «Cazadora de almas» | «Caza de almas» |
| `extras.js:114`, `PAGES.pasR` | «Cuatro cazadores vendrán...» | Es texto canónico y **sigue valiendo con la nueva premisa**: **decide Txaber** (alternativa neutra: «Cuatro vendrán, con mi misma sangre y mi misma sed...») |
| `extras.js:104`, `BESTIARY.conde` | «sus cazadores» | «a quienes lo desafían» |
| `extras.js:1582` y `1587`, `kingTalk` | «¿Un cazador?», «No pierdas el anillo, cazador» | «¿Alguien aquí?», «No pierdas el anillo» |
| `game.js:383`, escena del Conde | «Necios... Seguidme... si os atrevéis» | «Esto no ha terminado. Seguidme... si os atrevéis» |
| `README.md:25, 36-45` y `README.en.md` | «Cuatro cazadores vampiro», columna «Vampiro», «Cazadora de almas» | Nombres neutros |
| `public/index.html:99` | «Elige tu vampiro:» | Vale tal cual |

**Textos nuevos:** los de Vigilia, Cadalso, Anhelia y Lúa pueden tener género propio en el guion, pero no marcan el de los protagonistas.

### 12.7 `server/index.js` (límites de lo que se guarda) [COMPROBADO]

`sanitizeMe` (`index.js:45-55`) y las listas fijas **recortarían** lo nuevo:

| Campo | Límite actual | Hace falta |
|---|---|---|
| `visited` | 80 salas | **160** (hay 65 áreas y la Zona 2 añade 25: 90) |
| `pages` | 20 | **40** (15 hoy + 13 nuevos = 28) |
| `seen` | 20 | **60** (bestiario: 12 enemigos de hoy más 9 enemigos, 4 élites y 6 jefes nuevos) |
| `bg` (gemas de jefes pagadas) | 12 | **30** (16 jefes) |
| `lit` (hogueras) | 30 | **60** (14 hoy + 4 nuevas) |
| `elite` | 20 | 40 |
| `cry` | 40 | 60 (8 + 4 cristales) |
| `gemGot` | 60 | 100 |
| `kills` (lista fija de tipos, `index.js:49`) | 14 tipos | añadir `slug`, `shroom`, `vine`, `pris`, `moth`, `magma`, `alcaide`, `madre` (**ya faltan hoy**) y los nuevos |
| `perm.hp` | 0 a 2 | 0 a 4 si se amplía el Fruto de sangre |

Además: `BOSS_IDS` (`index.js:15`) con los 6 jefes nuevos; `freshProgress` y carga con `talks`; evento `talk`.

### 12.8 Otros

- `package.json`: añadir `node --check public/talks.js` a `check`.
- Recomendado: una pasada por `public/index.html` (lobby) para que los botones de elegir vampiro usen los nombres nuevos.

---

## 13. Preguntas para Txaber antes de empezar

1. **¿Te gusta cómo he colocado las salas sobre tu dibujo?** (4.3 y 4.4). Lo que más puede diferir de lo que tienes en mente: que la Casa del Mercader y la Milla Verde queden a la izquierda de la Despensa, y que la Capilla (cura, mercader, herrero, hoguera e Isolda) esté justo encima de la sala del Capitán.
2. **¿Te gustan los nombres y la historia?** Vigilia, Cadalso (Regentes) y Anhelia (la Primera Sed), con el giro de que los protagonistas son sus descendientes, Aurora y Vesper son su canto partido y el Conde, el primer mortal al que mordió.
3. **¿Te valen los valores de las mejoras de estadística?** Cor +0,10 (sed de sangre 0,50), Zaf +0,20 (luz 2,0), Malak +0,20 (almas 1,70), Matis +0,06 (velocidad 0,88).
4. **Mejora de arma:** ¿un solo nivel en la forja de `dep4` (solo el Arco gana daño) o dos niveles (todos ganan daño, pero se agotan los niveles)?
5. **Sed de sangre de Cor:** ¿subir también el tope de curación contra jefes (0,25 a 0,30)?
6. **Fruto de sangre:** ¿se amplía el máximo de compras (hoy 2) y a cuánto? Afecta a `ITEMS`, al servidor (`perm.hp`) y a los precios.
7. **¿Sube el daño por contacto de los enemigos en la Zona 2?** Hoy es +1 desde `z >= 4`; propongo +2 desde `z >= 13`, o dejarlo.
8. **La Milla Verde (Lúa y la mejora de Zaf) y la Conservera Mayor (la mejora de Malak) son opcionales.** ¿Se dejan así o se hacen obligatorias? Además, el Farero es quien crió a Zaf y a Lúa: ¿te gusta que Zaf luche contra quien lo crió? Recompensa por entregar el Anillo del Rey a Isolda (hoy no existe): ¿gemas, almas, un objeto?
9. **Vida de los Regentes:** 104 y 116 (110 golpes en total con 2 de daño). Si se hace largo, ¿96 y 104? ¿Y las vidas de los mini-jefes (Farero 64, Subastadora 72, Chambelán 88)?
10. **El herrero de la Capilla (`smith3`):** ¿es otro taller con los mismos poderes que el Herrero de la Cueva (mi propuesta) o debe ser otra cosa?
11. **La llave:** ¿te vale que sea «la puerta se abre al caer el Capitán» (sin objeto en el inventario) y un marcador en la HUD? Alternativa: una llave real que se coge y que hay que llevar hasta la puerta.
12. **Lúa:** ¿qué le pasa al final del juego? ¿Espera fuera de las salas de jefe (mi propuesta) o entra y solo no ataca? ¿Van las almas de lo que mata al jugador seguido?
13. **Textos con género del juego** (12.6): ¿se corrigen todos, incluida la carta canónica del Conde?
14. **Revelación graduada y marca de colmillo** (PERSONAJES.md, 4.9): ¿la aprobamos?
15. **Tamaño del mapa:** ¿te vale `ROWS = 16` (mapa grande hasta 467 px de los 576)?
16. **Zona 3:** ¿cuándo y cómo se llega desde `tronos`? Lo dejo como placeholder (hueco de escalera sin construir).
17. **`docs/HISTORIA.md` no existe todavía.** ¿Se crea antes o después de la Zona 2?

---

## 14. Orden de implementación por fases y criterios de «hecho»

Orden recomendado: **0 → 5 → 3 → 1 → 2 → 3b → 4 → 5b → 6**. Primero la base, luego los textos y el sistema de charlas (que ya aporta valor en la Zona 1), después el mapa tramo a tramo siguiendo el camino del jugador, y al final los Regentes, Lúa y el pulido.

### Fase 0: preparar límites y datos comunes

- **Qué:** `ROWS = 16`; las entradas 10 a 15 de `World.ZONES`, `ZONE_PAL`, `Music.ZONES`, `DECOR` y `ZONE_SCALE` (reasignadas y renombradas, 5.7), aún sin áreas que las usen; tileset con `ZONE_PAL.length`; límites del servidor (12.7).
- **Hecho cuando:** `npm run check` pasa; `npm run validate` da el **mismo resultado que antes**; el juego arranca, el mapa grande (`M`) cabe en pantalla y la Zona 1 se ve igual; una partida guardada antigua carga igual.

### Fase 5: textos con género

- **Qué:** 12.6 (nombres neutros, `HERO_REALNAMES`, texto de selector y README).
- **Hecho cuando:** el selector y las pantallas muestran Cor, Zaf, Malak y Matis; no queda en el código «cazador», «cazadora», «Vampira», «Necios» en textos que se refieren a los protagonistas.

### Fase 3: sistema de charlas y pensamientos

- **Qué:** `talks.js` (datos de PERSONAJES.md), burbujas, cola, `progress.talks`, evento `talk` en el servidor, operación `spot`, ganchos de los 4 tipos, panel de desarrollo.
- **Hecho cuando:** (a) cada evento de la Zona 1 (A01 a A15, B01 a B14, C01 a C12, D01 a D10) salta **una vez** y no se repite tras morir ni al cargar; (b) en solitario sale el pensamiento y en 2 o más jugadores la charla de la pareja o la genérica; (c) si falta el dueño de un tramo, no se gasta; (d) con dos jugadores a la vez en la misma sala no se duplica; (e) en un combate o un diálogo abierto no sale nada; (f) `progress.talks` se guarda con la partida y sobrevive a `revertWorld`.

### Fase 1: ascensor y Patíbulo

- **Qué:** `S` con `gate`; `asc2`; `['lift', 18, 4]`; tapa de hierro (variante horizontal de `buildGateDoors`); `pat1` a `pat6` con la hoguera de `pat1`; la puerta con llave (de momento cerrada para siempre).
- **Hecho cuando:** `npm run validate` llega a `pat1` en la **etapa 8** y **no** antes (en particular, no desde la Cueva del Abismo con las Alas); el ascensor sube y baja y se ve el rótulo «ZONA 2» la primera vez; la tapa se abre al caer la Madre Moho; el viaje rápido lista las 15 o más hogueras.

### Fase 2: Despensa, bodega y pasillo hasta el Capitán (primer jefe y llave)

- **Qué:** `alta`, `pasD`, `desp` (hoguera), `cellar`, `y1`, `y2`, `y3`; el jefe `capitan`; la llave y el aviso (4.7); `cap` con Isolda, cura, mercader y herrero (de momento sellada por la escalera); la mejora de Cor; tienda `mer` (necesita `pm`, `mer` y `S`).
- **Hecho cuando:** `npm run validate` sin salas inalcanzables y con la **etapa 8** alcanzando al Capitán; al caer el Capitán se abren la escalera a la Capilla y la puerta del Patíbulo; el bonus de sed de sangre llega solo a Cor y se quita al volver al punto de control; la Capilla permite entregar el Anillo del Rey.

### Fase 3b: Milla Verde y Conservera Mayor (opcionales)

- **Qué:** `mer`, `pm`, `milla`, `carc` (jefe `farero` con las lámparas, celda de Lúa) y `sec` (jefa `subastadora`, grieta desde `cellar`, repisa y muro agrietado). Mejoras de Zaf y Malak.
- **Hecho cuando:** `npm run validate` los alcanza en la **misma etapa 8** (en cualquier orden con el Capitán); los dos jefes se pueden vencer con cada vampiro; Malak puede romper el muro con Bombas de la tienda `mer`; los bonus se aplican solo al dueño.

### Fase 4: Dependencias, Regentes y cierre de la Parte 2

- **Qué:** `dep1` a `dep4` (jefe `chambelan`, forja y hoguera de `dep4`) y `tronos` (jefes `cadalso` y `vigilia`, el enemigo `eco`, música de jefe, escena de cierre con el gancho a la Parte 3, hueco de escalera sin construir). Mejora de Matis.
- **Hecho cuando:** `npm run validate` da la **etapa 9** con `chambelan` y la **etapa 10** con `cadalso` y `vigilia` juntos y el orden de `PROGRESSION` correcto; el combate es posible con cada vampiro (también con el Arco: 2 por flecha); Vigilia no recibe daño hasta que cae Cadalso; B20 y B21 salen una sola vez; si se muere en `tronos` se vuelve a la hoguera de `dep4`.
- **Al final:** el recorrido completo (Zona 1 + Zona 2) se pasa con 1 jugador y con 4.

### Fase 5b: Lúa

- **Qué:** seguidor, látigo, reglas de 8.2, escena de rescate, comentarios `lua` y eventos L01 a L08. (Se puede empezar antes con el botón «dar a Lúa» del panel de desarrollo.)
- **Hecho cuando:** las pruebas de 8.3 pasan; con 4 jugadores y con el anfitrión que cambia no hay dos Lúas ni se queda parada; no cuesta rendimiento notable en el modo ligero.

### Fase 6: pulido y documentación

- **Qué:** actualizar `docs/ZONA1.md`, README, CHANGELOG; `recorrido.js` partido (10); revisar tiempos de burbujas y jefes jugando.
- **Hecho cuando:** `npm run check`, `npm run validate` y `npm run validate:rutas` pasan; los informes de recorrido están al día; Txaber ha jugado la Zona 2 entera y ha dado el visto bueno.

---

## 15. Lo que no he podido comprobar

- **No he ejecutado** `npm run validate` ni el juego; todo lo dicho del validador sale de **leer** `scripts/validate.js` y `recorrido.js`.
- **No he visto el dibujo de Txaber:** solo la descripción que me han pasado. Las salas, tamaños y enlaces de 4.3 a 4.5 son una **interpretación** que respeta el flujo y la forma descritos; puede que Txaber quiera moverlas.
- No he comprobado qué hay ya hecho en el código para las zonas `z` 10 a 15 (me han dicho que existen con los nombres antiguos): 5.7 es lo que habría que ajustar.
- No he comprobado cómo reacciona el rendimiento del modo ligero con un mundo de `572 × 290` tiles.
- No he leído `bossAI` ni el sistema de proyectiles enemigos completos; por eso los jefes nuevos se describen como patrones a **afinar jugando**, no como código. En particular no he comprobado si el motor admite dos jefes en una misma sala con uno inactivo e invulnerable (Vigilia en el combate 1).
- Las coordenadas `x, y` de los `spot` están sacadas de las operaciones de `world.js` (Zona 1) o del plano (Zona 2) y hay que **verlas en pantalla** para ajustarlas.
- No he verificado el comportamiento de `damageEnt` con `from` igual a un jugador remoto para las muertes de Lúa: hay que probarlo.
