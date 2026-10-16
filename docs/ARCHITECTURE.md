# Arquitectura

Resumen de cómo está construido *Four Fangs of Dawn*.

## Visión general

```
 Navegador (Phaser 3)  <── Socket.IO ──>  Servidor Node (Express + Socket.IO)
   · jugador, física                          · cuentas (scrypt) y partidas guardadas
   · render, luz, HUD                         · salas, anfitrión, progreso compartido
   · simula enemigos SOLO si es anfitrión     · relé de estado, golpes y botín
```

El servidor **no simula el juego**: valida, almacena y reenvía. Cada cliente lleva la física de su propio jugador y el **anfitrión de la sala** simula enemigos, jefes y proyectiles, y envía instantáneas (~12 Hz) al resto.

## Servidor (`server/index.js`)

- **Cuentas:** registro e inicio de sesión con contraseñas cifradas (`scrypt` con sal) en `data/users.json`.
- **Salas:** código de 4 letras, hasta 4 jugadores, entrada en caliente y reasignación de anfitrión si el actual se va.
- **Progreso compartido de la sala:** jefes derrotados, paredes rotas y estado de las antorchas.
- **Guardado por vampiro:** cada cuenta guarda una ranura por color (`saves[color]`) con sus datos personales (almas, objetos, nivel de arma, habilidades…) y una copia del mundo. Los datos que llegan del cliente se **sanean** antes de guardarse.
- **Relés:** estado de jugadores, golpes a enemigos (cliente → anfitrión), reparto de almas (anfitrión → jugador), antorchas y descansos en hogueras.

## Cliente (`public/`)

| Fichero | Responsabilidad |
|---|---|
| `world.js` | Define el mundo como datos y lo construye en *tiles*. Se usa igual en el navegador y en Node (validador). |
| `game.js` | Escena de Phaser: jugador, IA de enemigos y jefes, luz y oscuridad, minimapa, red. |
| `extras.js` | Armas y mejoras, pasivas, tienda, diálogos, bestiario y diarios, controles táctiles y mando. Amplía `CastleScene`. |
| `art.js` | Dibuja todo el pixel art desde mapas de texto y paletas por zona. |
| `music.js` | Música procedural con WebAudio: acordes, arpegios, campanas y percusión de jefe. |

### El mundo como datos

`world.js` describe **áreas** (rectángulos de 1 a varias celdas de 26×18 tiles), **conexiones** (puertas y huecos con tamaño y posición) y **contenido** mediante pequeñas operaciones:

```js
area('foso', 'Foso de Espinas', 0, 6, 6, 1, 1, [
  ['pit', 6, 19], ['P', 7, 14, 3], ['E', 'bat', 8, 8]
]);
E('foso', 'cubil', 5);        // puerta de 5 tiles entre dos áreas
```

El resto (muros, techos en pico, antorchas, identificadores estables para guardar partida) se genera a partir de esa descripción.

### Enemigos, jefes y luz

- Los enemigos solo existen cerca de los jugadores (activación por celdas) y reaparecen al descansar en una hoguera.
- Los jefes son máquinas de estados (telegrafiar → actuar → recuperar) con fases y reinicio si caen todos los jugadores.
- La **luz** es un modelo propio (`lightLevel`) que usan la IA y el dibujado: fantasmas, murciélagos y el Guardián del Reloj reaccionan a él; la oscuridad se dibuja con una *render texture* a la que se le "borran" círculos de luz.

## Validador del mapa (`scripts/validate.js`)

Reproduce la física del jugador (gravedad, salto, doble salto, impulso, salto de pared, agacharse, caída por plataformas) y explora por anchura todas las posiciones alcanzables, repitiendo la búsqueda cada vez que se consigue una habilidad nueva. Comprueba que:

- todas las salas, cristales y hogueras son alcanzables,
- cada puerta secreta exige la habilidad prevista,
- el orden de jefes y habilidades es el diseñado.

Se ejecuta en CI con `npm run validate`.

## Decisiones y límites conocidos

- El anfitrión es **autoritativo** para los enemigos pero **no hay protección anti-trampas**: es un juego cooperativo entre amigos.
- Las partidas se guardan en un JSON; para uso masivo habría que pasar a una base de datos.
- Si el anfitrión se va, los enemigos se reinician en el nuevo anfitrión.
