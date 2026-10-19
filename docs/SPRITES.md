# Sprites nuevos de los protagonistas (rama de desecho reutilizable)

**Estado:** esta rama (`sprites/hojas-reutilizable`) guarda un intento completo de sustituir los dibujos de 12×14 px de los vampiros por hojas de sprites de alta resolución, con **elección de aspecto hombre/mujer**. Se probó en un servidor aparte y funcionaba, pero la integración **no convenció** y se revirtió en `main`. No se ha subido a GitHub. Todo el trabajo es recuperable desde aquí.

- Commit con la integración en el juego: `4e6a820`
- Commit con herramientas, hojas fuente y esta guía: el último de la rama.

## Qué hace

1. Cada uno de los 4 vampiros (rojo, azul, verde, violeta) tiene 2 aspectos: hombre (`m`) y mujer (`f`). Son 8 hojas.
2. Al crear una partida nueva de un personaje, la sala muestra los dos sprites y hay que elegir. El botón *Empezar* queda desactivado hasta que todos los jugadores han elegido.
3. El aspecto se guarda en el servidor dentro de la partida guardada de ese color (`saves[color].sex`) y queda **fijo mientras exista esa partida**. Al borrarla se vuelve a poder elegir.
4. Las partidas guardadas antiguas (sin aspecto) eligen una vez.
5. Quien entra en una partida ya empezada no elige: recibe el aspecto de su guardado o `m` por defecto.
6. El resto de jugadores ve el aspecto de cada uno (el servidor lo reenvía dentro de la información de la sala).
7. Animaciones: reposo, caminar, salto, caída, ataque, agachado, impulso, daño y muerte (antes solo había reposo, 2 pasos y agachado).

## De dónde salen las hojas

Se generaron con ChatGPT a partir del prompt de plantilla: 8 filas, una animación por fila, personaje mirando a la derecha, fondo transparente.

| Fila | Animación | Fotogramas esperados |
|---|---|---|
| 0 | reposo | 3–4 |
| 1 | caminar | 6–7 |
| 2 | salto + caída | 2 |
| 3 | ataque | 4–5 |
| 4 | agachado | 1 |
| 5 | impulso | 2 |
| 6 | daño | 2 |
| 7 | muerte | 5 |

Fotogramas reales de cada hoja (constante `COUNTS` en `tools/sprites/seg3.js`):

| Hoja | reposo | caminar | aire | ataque | agachado | impulso | daño | muerte |
|---|---|---|---|---|---|---|---|---|
| red_m (Carmesí hombre) | 3 | 6 | 2 | 5 | 1 | 2 | 2 | 5 |
| red_f (Carmesí mujer) | 4 | 7 | 2 | 5 | 1 | 2 | 2 | 5 |
| blue_m (Azul hombre) | 4 | 6 | 2 | 5 | 1 | 2 | 2 | 5 |
| blue_f (Azul mujer) | 4 | 6 | 2 | 4 | 1 | 2 | 2 | 5 |
| green_m (Esmeralda hombre) | 4 | 6 | 2 | 5 | 1 | 2 | 2 | 5 |
| green_f (Esmeralda mujer) | 4 | 6 | 2 | 5 | 1 | 2 | 2 | 5 |
| purple_m (Violeta hombre) | 3 | 6 | 2 | 5 | 1 | 2 | 2 | 5 |
| purple_f (Violeta mujer) | 4 | 6 | 2 | 5 | 1 | 2 | 2 | 5 |

Las hojas originales no eran perfectas, y hubo que limpiarlas:
- `red_f`, `blue_f` y `purple_f` llegaron **sin transparencia real** (JPG o WebP con fondo blanco o de cuadros dibujado dentro). `tools/sprites/bg.js` quita el fondo rellenando desde los bordes con tolerancia de color.
- `purple_m` traía un **resplandor morado semitransparente**. `stage.js` pone a 0 todo lo que tenga opacidad menor de 110.
- Las celdas **no tienen tamaño regular** y los fotogramas se tocan (armas largas, tajos, capas). No se puede cortar por cuadrícula.

## Tubería de herramientas (`tools/sprites/`)

Requiere Node y `npm install` en esa carpeta (instala `sharp`). Las rutas de entrada de `stage.js` están escritas a mano para el equipo donde se hizo (carpeta Descargas y capturas del chat): hay que adaptarlas.

| Script | Qué hace |
|---|---|
| `stage.js` | Deja las 8 hojas con transparencia real en `src/` (copia las buenas, limpia el halo de `purple_m`, quita fondos falsos con `bg.js`). |
| `src/*.png` | Las 8 hojas ya limpias (resultado de `stage.js`). Con ellas basta para reconstruir todo. |
| `seg3.js` | Segmenta una hoja: fronteras de fila por valle de densidad, cuerpos por columnas, componentes conexos repartidos por fotograma. Tiene `COUNTS` por hoja y `MANUAL` (cortes a mano; solo `purple_f`, fila 3, porque sus tajos unían fotogramas). |
| `build.js` | Recorta cada fotograma, lo escala, lo alinea por los pies y escribe `public/sprites/<hoja>.png` más `sprites.json`. |
| `dbg.js`, `dbg2.js` | Imágenes de diagnóstico con las cajas detectadas (`node dbg.js blue_f`; `dbg2.js` muestra la fila de ataque de todas). |

Reconstruir:

```bash
cd tools/sprites
npm install
node build.js ../../public/sprites
```

Parámetros importantes de `build.js`:
- `TARGET = 56`: altura en píxeles de la pose de reposo en pantalla. Escala por hoja la mediana de la altura del reposo, así que todos los personajes quedan igual de altos.
- `COLS = 7`: columnas de la hoja resultante.
- La celda común sale del fotograma más ancho de todas las hojas: **126×83 px**.
- Alineación: los pies a 2 px del borde inferior de la celda. Horizontalmente se ancla en la media de los píxeles del 18 % inferior del fotograma (piernas), para que no resbale al atacar.

Formato de `public/sprites/sprites.json`:

```json
{ "cell": [126, 83], "cols": 7,
  "sheets": { "red_m": { "frames": 26, "anims": { "idle": [0,2], "walk": [3,8], "air": [9,10], "attack": [11,15], "crouch": [16,16], "dash": [17,18], "hurt": [19,20], "death": [21,25] } } } }
```

## Cómo está integrado en el código (commit `4e6a820`)

**Servidor (`server/index.js`)**
- `savedSexOf(nombre, color)`: aspecto fijado por la partida guardada, o `null` si no hay partida o es antigua.
- `newPlayer(socket, sala)`: crea al jugador con ese aspecto.
- Evento `setSex` (`'m'`/`'f'`): solo antes de empezar y solo si no hay aspecto fijado por un guardado.
- `setAnimal` recalcula el aspecto al cambiar de color.
- `start` rellena los aspectos que falten (`m`) antes de emitir `started`.
- `save` guarda `sex` en el hueco de la partida; `slotInfo` y `roomInfo` lo incluyen.
- Entrada en caliente: `m` por defecto.

**Cliente**
- `public/art.js`: `drawHeroCanvas(canvas, color, sexo)` pinta el reposo recortado de la hoja nueva en la sala. Carga `sprites.json` con `fetch`.
- `public/index.html`: contenedor `#sexBox` y estilos `.sexes`.
- `public/game.js`:
  - `preload()` carga `sprites.json` y las 8 hojas como imágenes.
  - `renderSexBox()` dibuja el selector. `renderLobby()` desactiva *Empezar* si falta alguien.
  - Jugador local: sprite `spr_<color>_<sexo>`, escala 1, origen para que el centro del cuerpo coincida con la posición del sprite, caja física de 30×39 con `setOffset`.
  - Jugadores remotos: lo mismo; estado de animación inferido de lo que llega por red (`a` ataque, `d` impulso, `c` agachado, cambio de `y` para el aire).
  - Nombre sobre la cabeza subido de 34 a 44 px.
  - Alfa al morir: 0,9 en vez de 0,2, para que se vea la animación de muerte.
- `public/extras.js`:
  - `setupHeroSheets()` añade los fotogramas a cada textura.
  - `heroAnim()` elige el estado con esta prioridad: muerte > ataque > impulso > daño > agachado > aire > caminar > reposo.
  - `heroFrameIdx()` calcula el fotograma de cada estado.
  - `setCrouch()` pasa a cambiar la caja física (30×24 agachado, 30×39 de pie), ya sin cambiar de textura.
- Los dibujos antiguos de 12×14 (`hero_*`) siguen generándose en `art.js`, pero ya nadie los usa.

## Limitaciones y cosas que no convencieron o no se probaron

- **Tamaño y estilo:** el sprite mide 56 px de alto frente a los 42 px del dibujo antiguo, con la misma caja física (30×39). Se ve algo más grande que su cuerpo de colisión.
- **Escalado suave:** las hojas no están sobre una cuadrícula de píxeles real, así que se reducen con `lanczos3`. El resultado queda un poco suavizado, no es pixel art perfecto. Quedaría mejor reescalar con factores enteros o rehacer las hojas a 64×64 reales.
- **Ataque:** la animación dura 0,3 s fijos aunque el arma tenga otra velocidad, y el alcance dibujado (sobre todo lanza y guadaña, con tajos largos) puede no coincidir con la caja de golpe real; no se comprobó.
- **Flechas dibujadas en el sprite:** en `green_m` y `green_f` la flecha sale dibujada dentro del fotograma de ataque y se duplica con la flecha real del juego.
- **Cortes manuales:** `purple_f` necesita `MANUAL` en la fila de ataque. Otras hojas nuevas pueden necesitar lo mismo; hay que revisar con `dbg.js` y `dbg2.js`.
- **No probado:** partidas con varios jugadores reales, el modo ligero (`?lite=1`) ni todas las animaciones una a una. Sí se comprobó en un navegador: sala, selector, arranque de partida con la vampira carmesí, ver el sprite sobre el suelo, abrir el menú con Esc y que no hubiera errores en consola.
- **Peso:** `public/sprites/` ocupa 1 MB; `tools/sprites/src/` unos 15 MB.
- **Instalador de Windows:** habría que regenerarlo (`npm run build:exe`) para que incluya los sprites.

## Cómo reutilizarlo

**Reaplicarlo entero sobre `main`:**

```bash
git cherry-pick 4e6a820
git checkout sprites/hojas-reutilizable -- tools/sprites docs/SPRITES.md
```

Es posible que haya conflictos si `game.js`, `extras.js` o `server/index.js` han cambiado mucho. El cherry-pick incluye también el cambio de la Sala de Lectura (quitar una mejora de arma). Si no se quiere, revertir ese trozo de `public/world.js`.

**Solo reutilizar las hojas o las herramientas:** copiar `public/sprites/` o `tools/sprites/` a otra rama y adaptar la integración.

## Ideas para hacerlo mejor

- Pedir hojas con celdas idénticas y fondo realmente transparente, para no depender de la segmentación.
- Hojas más pequeñas (32×32 o 48×48) escaladas por un factor entero.
- Ajustar la caja física al tamaño visible, o reducir `TARGET`.
- Hacer que la animación de ataque dependa de la duración del arma (`WEAPONS[color].act`) y alinear la caja de golpe con el dibujo.
- Quitar la flecha de los fotogramas de ataque del arquero.
- Si se mantiene la elección de aspecto, valorar permitir cambiarlo sin borrar la partida.
