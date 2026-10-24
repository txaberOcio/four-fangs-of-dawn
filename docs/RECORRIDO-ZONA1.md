# Recorrido de la Zona 1 (informe automático)

> Generado con `npm run recorrido` a partir del mapa (`public/world.js`) y del validador. No editar a mano: vuelve a generarlo tras cambiar el mapa. El análisis y las decisiones de diseño están en [ZONA1.md](ZONA1.md).

Etapa = lo que se puede hacer con los jefes derrotados hasta ese momento. «Camino» = salas que se pisan en la ruta más corta (en salas) hasta el jefe siguiente; el cálculo no distingue el sentido de las caídas, así que es orientativo.

## Etapa 0: Gárgola de Piedra

- **Viene de:** inicio (Vestíbulo) · **Habilidades:** ninguna
- **Como mucho, el jugador tiene:** 5 corazones (5 de base + cristales), arma nivel 1 (espada: 1 de daño por golpe), 2 gemas en total
- **Camino principal** (✦ = sala nueva en esta etapa):
  - hasta **Cubil de la Gárgola**: Vestíbulo ✦ → Gran Salón ✦ → Corredor de Armaduras ✦ → Foso de Espinas ✦ → Cubil de la Gárgola ✦ (5 salas)
- **Salas que se abren:** 11 · de ellas desvíos opcionales: 6
- **Desvíos:**
  - Túnel de Calaveras (Calabozos)
  - Bodega (Calabozos)
  - Cripta Olvidada (Calabozos)
  - Osario (Calabozos): cristal de vida, gema
  - Pozo de las Almas (Calabozos)
  - Grieta Sellada (Calabozos)

| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |
|---|---|---|---|---|---|---|
| Vestíbulo ✦ | Vestíbulo | 0 (×1) | — | 0 | — | hoguera, mercader |
| Gran Salón ✦ | Vestíbulo | 0 (×1) | 3 esqueleto, 1 caballero, 2 murciélago | 13 | — | — |
| Corredor de Armaduras ✦ | Vestíbulo | 0 (×1) | 4 caballero, 1 murciélago, 1 esqueleto | 33 | — | diario, élite: Capitán de Armaduras |
| Foso de Espinas ✦ | Vestíbulo | 0 (×1) | 3 murciélago | 3 | 1 pinchos | — |
| Cubil de la Gárgola ✦ | Vestíbulo | 0 (×1) | — | 0 | — | JEFE: Gárgola de Piedra |

Total del camino: 5 salas, 15 enemigos, 49 de vida de enemigos.
Jefe **Gárgola de Piedra**: 12 de vida (1 jugador) → 12 golpes de espada; suelta 1 gemas y Impulso (dash).

## Etapa 1: Obispo Caído

- **Viene de:** Gárgola de Piedra · **Habilidades:** Impulso (dash)
- **Como mucho, el jugador tiene:** 6 corazones (5 de base + cristales), arma nivel 2 (espada: 1 de daño por golpe), 9 gemas en total
- **Camino principal** (✦ = sala nueva en esta etapa):
  - hasta **Ábside**: Cubil de la Gárgola → Foso de Espinas → Corredor de Armaduras → Gran Salón → Escalera de los Retratos ✦ → Archivo ✦ → Capilla: Nave Sur ✦ → Capilla: Nave Principal ✦ → Ábside ✦ (9 salas)
- **Salas que se abren:** 11 · de ellas desvíos opcionales: 1 · se usan más adelante: Sala de Lectura, Gran Biblioteca, Observatorio, Pasaje de Cadenas, Mirador
- **Desvíos:**
  - Sala Oculta (Vestíbulo): cristal de vida, gema

| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |
|---|---|---|---|---|---|---|
| Cubil de la Gárgola | Vestíbulo | 0 (×1) | — | 0 | — | JEFE: Gárgola de Piedra |
| Foso de Espinas | Vestíbulo | 0 (×1) | 3 murciélago | 3 | 1 pinchos | — |
| Corredor de Armaduras | Vestíbulo | 0 (×1) | 4 caballero, 1 murciélago, 1 esqueleto | 33 | — | diario, élite: Capitán de Armaduras |
| Gran Salón | Vestíbulo | 0 (×1) | 3 esqueleto, 1 caballero, 2 murciélago | 13 | — | — |
| Escalera de los Retratos ✦ | Vestíbulo | 0 (×1) | 2 murciélago, 1 fantasma, 1 esqueleto | 7 | — | — |
| Archivo ✦ | Biblioteca | 1 (×1.1) | — | 0 | — | hoguera, archivero |
| Capilla: Nave Sur ✦ | Capilla | 2 (×1.1) | — | 0 | — | GRAN HOGUERA, monje, mercader |
| Capilla: Nave Principal ✦ | Capilla | 2 (×1.1) | 2 fantasma, 1 murciélago, 1 caballero | 24 | — | diario, élite: Espectro Penitente |
| Ábside ✦ | Capilla | 2 (×1.1) | — | 0 | — | JEFE: Obispo Caído |

Total del camino: 9 salas, 23 enemigos, 80 de vida de enemigos.
Jefe **Obispo Caído**: 16 de vida (1 jugador) → 16 golpes de espada; suelta 2 gemas y Doble salto.

## Etapa 2: Reina de Huesos y Guardián del Reloj

- **Viene de:** Obispo Caído · **Habilidades:** Impulso (dash), Doble salto
- **Como mucho, el jugador tiene:** 8 corazones (5 de base + cristales), arma nivel 2 (espada: 1 de daño por golpe), 14 gemas en total
- **Camino principal** (✦ = sala nueva en esta etapa):
  - hasta **Cámara del Reloj**: Ábside → Mirador → Galería de Engranajes ✦ → Torre del Reloj ✦ → Cámara del Reloj ✦ (5 salas)
  - hasta **Cripta de la Reina**: Ábside → Capilla: Nave Principal → Capilla: Nave Sur → Pasaje de Cadenas → Calabozo Norte ✦ → Mazmorra de Hierro ✦ → Galería de Huesos ✦ → Cripta de la Reina ✦ (8 salas)
- **Salas que se abren:** 8 · de ellas desvíos opcionales: 0 · se usan más adelante: Pasillo Real

| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |
|---|---|---|---|---|---|---|
| Ábside | Capilla | 2 (×1.1) | — | 0 | — | JEFE: Obispo Caído |
| Mirador | Capilla | 2 (×1.1) | — | 0 | — | hoguera |
| Galería de Engranajes ✦ | Torre del Reloj | 4 (×1.25) +1 daño | 1 esqueleto, 3 murciélago | 9 | 1 pinchos, 6 sierras | diario |
| Torre del Reloj ✦ | Torre del Reloj | 4 (×1.25) +1 daño | 1 caballero, 2 fantasma, 1 murciélago | 31 | 2 sierras | élite: Relojero Oxidado |
| Cámara del Reloj ✦ | Torre del Reloj | 4 (×1.25) +1 daño | — | 0 | — | JEFE: Guardián del Reloj |
| Capilla: Nave Principal | Capilla | 2 (×1.1) | 2 fantasma, 1 murciélago, 1 caballero | 24 | — | diario, élite: Espectro Penitente |
| Capilla: Nave Sur | Capilla | 2 (×1.1) | — | 0 | — | GRAN HOGUERA, monje, mercader |
| Pasaje de Cadenas | Calabozos | 3 (×1.25) | 2 caballero, 2 esqueleto | 34 | — | diario, élite: Carcelero |
| Calabozo Norte ✦ | Calabozos | 3 (×1.25) | — | 0 | — | hoguera, prisionero (PNJ) |
| Mazmorra de Hierro ✦ | Calabozos | 3 (×1.25) | 1 fantasma, 1 caballero, 1 esqueleto | 14 | — | cristal de vida, gema |
| Galería de Huesos ✦ | Calabozos | 3 (×1.25) | 1 caballero, 2 esqueleto, 1 fantasma, 1 murciélago | 19 | — | gema, diario |
| Cripta de la Reina ✦ | Calabozos | 3 (×1.25) | — | 0 | — | JEFE: Reina de Huesos |

Total del camino: 12 salas, 24 enemigos, 131 de vida de enemigos.
Jefe **Guardián del Reloj**: 22 de vida (1 jugador) → 22 golpes de espada; suelta 2 gemas y Salto de pared.
Jefe **Reina de Huesos**: 20 de vida (1 jugador) → 20 golpes de espada; suelta 2 gemas.

## Etapa 3: Archimago Silente

- **Viene de:** Reina de Huesos y Guardián del Reloj · **Habilidades:** Impulso (dash), Doble salto, Salto de pared
- **Como mucho, el jugador tiene:** 8 corazones (5 de base + cristales), arma nivel 2 (espada: 1 de daño por golpe), 19 gemas en total
- **Camino principal** (✦ = sala nueva en esta etapa):
  - hasta **Scriptorium**: Cámara del Reloj → Torre del Reloj → Pasaje de Cadenas → Capilla: Nave Sur → Archivo → Sala de Lectura → Gran Biblioteca → Observatorio → Salón de los Atriles ✦ → Pasaje de Tinta ✦ → Escalera de Pergaminos ✦ → Scriptorium ✦ (12 salas)
- **Salas que se abren:** 5 · de ellas desvíos opcionales: 0 · se usan más adelante: Escalera Real

| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |
|---|---|---|---|---|---|---|
| Cámara del Reloj | Torre del Reloj | 4 (×1.25) +1 daño | — | 0 | — | JEFE: Guardián del Reloj |
| Torre del Reloj | Torre del Reloj | 4 (×1.25) +1 daño | 1 caballero, 2 fantasma, 1 murciélago | 31 | 2 sierras | élite: Relojero Oxidado |
| Pasaje de Cadenas | Calabozos | 3 (×1.25) | 2 caballero, 2 esqueleto | 34 | — | diario, élite: Carcelero |
| Capilla: Nave Sur | Capilla | 2 (×1.1) | — | 0 | — | GRAN HOGUERA, monje, mercader |
| Archivo | Biblioteca | 1 (×1.1) | — | 0 | — | hoguera, archivero |
| Sala de Lectura | Biblioteca | 1 (×1.1) | 1 esqueleto, 1 caballero, 1 murciélago | 11 | — | gema, diario |
| Gran Biblioteca | Biblioteca | 1 (×1.1) | 2 caballero, 2 fantasma, 1 murciélago | 34 | — | mejora de arma, élite: Bibliotecario Maldito |
| Observatorio | Biblioteca | 1 (×1.1) | 2 fantasma, 1 murciélago | 10 | — | gema |
| Salón de los Atriles ✦ | Biblioteca | 4 (×1.25) +1 daño | 2 esqueleto, 1 caballero, 1 fantasma, 1 murciélago | 19 | — | gema, diario |
| Pasaje de Tinta ✦ | Biblioteca | 4 (×1.25) +1 daño | — | 0 | — | hoguera |
| Escalera de Pergaminos ✦ | Biblioteca | 4 (×1.25) +1 daño | 2 murciélago, 2 fantasma | 12 | 1 sierras | — |
| Scriptorium ✦ | Biblioteca | 4 (×1.25) +1 daño | — | 0 | — | JEFE: Archimago Silente |

Total del camino: 12 salas, 28 enemigos, 151 de vida de enemigos.
Jefe **Archimago Silente**: 30 de vida (1 jugador) → 30 golpes de espada; suelta 4 gemas.

## Etapa 4: El Conde

- **Viene de:** Archimago Silente · **Habilidades:** Impulso (dash), Doble salto, Salto de pared
- **Como mucho, el jugador tiene:** 8 corazones (5 de base + cristales), arma nivel 2 (espada: 1 de daño por golpe), 23 gemas en total
- **Camino principal** (✦ = sala nueva en esta etapa):
  - hasta **Sala del Trono**: Scriptorium → Escalera de Pergaminos → Pasaje de Tinta → Salón de los Atriles → Observatorio → Gran Biblioteca → Sala de Lectura → Archivo → Capilla: Nave Sur → Pasaje de Cadenas → Torre del Reloj → Cámara del Reloj → Pasillo Real → Sala del Trono ✦ (14 salas)
- **Salas que se abren:** 1 · de ellas desvíos opcionales: 0

| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |
|---|---|---|---|---|---|---|
| Scriptorium | Biblioteca | 4 (×1.25) +1 daño | — | 0 | — | JEFE: Archimago Silente |
| Escalera de Pergaminos | Biblioteca | 4 (×1.25) +1 daño | 2 murciélago, 2 fantasma | 12 | 1 sierras | — |
| Pasaje de Tinta | Biblioteca | 4 (×1.25) +1 daño | — | 0 | — | hoguera |
| Salón de los Atriles | Biblioteca | 4 (×1.25) +1 daño | 2 esqueleto, 1 caballero, 1 fantasma, 1 murciélago | 19 | — | gema, diario |
| Observatorio | Biblioteca | 1 (×1.1) | 2 fantasma, 1 murciélago | 10 | — | gema |
| Gran Biblioteca | Biblioteca | 1 (×1.1) | 2 caballero, 2 fantasma, 1 murciélago | 34 | — | mejora de arma, élite: Bibliotecario Maldito |
| Sala de Lectura | Biblioteca | 1 (×1.1) | 1 esqueleto, 1 caballero, 1 murciélago | 11 | — | gema, diario |
| Archivo | Biblioteca | 1 (×1.1) | — | 0 | — | hoguera, archivero |
| Capilla: Nave Sur | Capilla | 2 (×1.1) | — | 0 | — | GRAN HOGUERA, monje, mercader |
| Pasaje de Cadenas | Calabozos | 3 (×1.25) | 2 caballero, 2 esqueleto | 34 | — | diario, élite: Carcelero |
| Torre del Reloj | Torre del Reloj | 4 (×1.25) +1 daño | 1 caballero, 2 fantasma, 1 murciélago | 31 | 2 sierras | élite: Relojero Oxidado |
| Cámara del Reloj | Torre del Reloj | 4 (×1.25) +1 daño | — | 0 | — | JEFE: Guardián del Reloj |
| Pasillo Real | Sala Real | 5 (×1.4) +1 daño | — | 0 | — | diario, hoguera |
| Sala del Trono ✦ | Sala Real | 5 (×1.4) +1 daño | — | 0 | — | JEFE: El Conde |

Total del camino: 14 salas, 28 enemigos, 151 de vida de enemigos.
Jefe **El Conde**: 32 de vida (1 jugador) → 32 golpes de espada; suelta 3 gemas.

## Etapa 5: Aurora o Vesper

- **Viene de:** El Conde · **Habilidades:** Impulso (dash), Doble salto, Salto de pared
- **Como mucho, el jugador tiene:** 10 corazones (5 de base + cristales + 2 Fruto(s) de sangre), arma nivel 2 (espada: 1 de daño por golpe), 26 gemas en total
- **Camino principal** (✦ = sala nueva en esta etapa):
  - con Aurora, hasta **Cámara de Aurora**: Sala del Trono → Pasillo Real → Escalera Real → Foso del Conde ✦ → Torre del Alba ✦ → Sala de los Rivales ✦ → Cámara de Aurora ✦ (7 salas)
  - con Vesper, hasta **Cámara de Vesper**: Sala del Trono → Pasillo Real → Escalera Real → Foso del Conde ✦ → Torre del Alba ✦ → Sala de los Rivales ✦ → Cámara de Vesper ✦ (7 salas)
- **Salas que se abren:** 4 · de ellas desvíos opcionales: 0

| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |
|---|---|---|---|---|---|---|
| Sala del Trono | Sala Real | 5 (×1.4) +1 daño | — | 0 | — | JEFE: El Conde |
| Pasillo Real | Sala Real | 5 (×1.4) +1 daño | — | 0 | — | diario, hoguera |
| Escalera Real | Sala Real | 5 (×1.4) +1 daño | — | 0 | — | — |
| Foso del Conde ✦ | Sala Real | 5 (×1.4) +1 daño | — | 0 | — | — |
| Torre del Alba ✦ | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | — |
| Sala de los Rivales ✦ | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | hoguera, Oráculo |
| Cámara de Aurora ✦ | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | JEFE: Aurora, Dama del Alba |
| Cámara de Vesper ✦ | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | JEFE: Vesper, Señor del Ocaso |

Total del camino: 8 salas, 0 enemigos, 0 de vida de enemigos.
Jefe **Aurora, Dama del Alba**: 34 de vida (1 jugador) → 34 golpes de espada; suelta 3 gemas y Alas del Alba.
Jefe **Vesper, Señor del Ocaso**: 34 de vida (1 jugador) → 34 golpes de espada; suelta 3 gemas y Ojo de la Noche.

## Etapa 6: Alcaide Verdín

- **Viene de:** Aurora o Vesper · **Habilidades:** Impulso (dash), Doble salto, Salto de pared, Alas del Alba (con Vesper: Impulso (dash), Doble salto, Salto de pared, Ojo de la Noche)
- **Como mucho, el jugador tiene:** 15 corazones (5 de base + cristales + 2 Fruto(s) de sangre), arma nivel 2 (espada: 1 de daño por golpe), 39 gemas en total
- **Camino principal** (✦ = sala nueva en esta etapa):
  - con Aurora, hasta **Sala del Alcaide**: Cámara de Aurora → Sala de los Rivales → Cámara de Vesper → Antecámara del Cielo ✦ → Escalera al Cielo ✦ → Cumbre del Alba ✦ → Santuario de las Sombras ✦ → Pozo del Ascensor ✦ → Galería de Raíces ✦ → Cisterna de Musgo ✦ → Refectorio Podrido ✦ → Pasaje de Zarzas ✦ → Antesala del Alcaide ✦ → Sala del Alcaide ✦ (14 salas)
  - con Vesper, hasta **Sala del Alcaide**: Cámara de Vesper → Antecámara del Cielo ✦ → Escalera al Cielo ✦ → Cumbre del Alba ✦ → Santuario de las Sombras ✦ → Pozo del Ascensor ✦ → Galería de Raíces ✦ → Cisterna de Musgo ✦ → Refectorio Podrido ✦ → Pasaje de Zarzas ✦ → Antesala del Alcaide ✦ → Sala del Alcaide ✦ (12 salas)
- **Salas que se abren:** 17 · de ellas desvíos opcionales: 5 · se usan más adelante: La Gran Hoguera
- **Desvíos:**
  - Jardín Colgante (Torres del Alba): gema
  - Mazmorra de Nubes (Torres del Alba): cristal de vida, gema
  - Caída Libre (Cueva del Abismo)
  - Forja de los Elementos (Cueva del Abismo): gema, diario, Herrero
  - Celdas Cubiertas (Calabozos Profundos): cristal de vida, diario, élite: Verdugo Cubierto de Musgo

| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |
|---|---|---|---|---|---|---|
| Cámara de Aurora | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | JEFE: Aurora, Dama del Alba |
| Sala de los Rivales | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | hoguera, Oráculo |
| Cámara de Vesper | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | JEFE: Vesper, Señor del Ocaso |
| Antecámara del Cielo ✦ | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | cristal de vida, gema, diario, hoguera |
| Escalera al Cielo ✦ | Torres del Alba | 7 (×1.5) +1 daño | 1 caballero, 2 murciélago, 2 fantasma | 22 | 1 sierras | — |
| Cumbre del Alba ✦ | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | cristal de vida, cristal de vida, gema, diario, hoguera, Vigía, Aurora (PNJ), Vesper (PNJ) |
| Santuario de las Sombras ✦ | Torres del Alba | 7 (×1.5) +1 daño | — | 0 | — | gema, Herrero (santuario) |
| Pozo del Ascensor ✦ | Calabozos Profundos | 9 (×1.7) +1 daño | — | 0 | — | hoguera, Jardinero, mercader |
| Galería de Raíces ✦ | Calabozos Profundos | 9 (×1.7) +1 daño | 2 babosa, 2 liana, 1 murciélago, 1 fantasma, 1 prisionero | 49 | 1 pinchos | diario |
| Cisterna de Musgo ✦ | Calabozos Profundos | 9 (×1.7) +1 daño | 2 murciélago, 2 fantasma, 2 babosa, 1 hongo | 35 | — | gema |
| Refectorio Podrido ✦ | Calabozos Profundos | 9 (×1.7) +1 daño | 1 babosa, 1 prisionero, 1 hongo, 1 liana, 2 fantasma, 1 murciélago | 47 | — | gema, diario |
| Pasaje de Zarzas ✦ | Calabozos Profundos | 9 (×1.7) +1 daño | 2 murciélago, 1 fantasma | 10 | 2 pinchos, 3 sierras | gema |
| Antesala del Alcaide ✦ | Calabozos Profundos | 9 (×1.7) +1 daño | — | 0 | — | diario, hoguera |
| Sala del Alcaide ✦ | Calabozos Profundos | 9 (×1.7) +1 daño | — | 0 | — | JEFE: Alcaide Verdín |

Total del camino: 14 salas, 29 enemigos, 163 de vida de enemigos.
Jefe **Alcaide Verdín**: 36 de vida (1 jugador) → 36 golpes de espada; suelta 3 gemas y Pisotón de Raíces.

## Etapa 7: La Madre Moho

- **Viene de:** Alcaide Verdín · **Habilidades:** Impulso (dash), Doble salto, Salto de pared, Alas del Alba, Pisotón de Raíces (con Vesper: Impulso (dash), Doble salto, Salto de pared, Ojo de la Noche, Pisotón de Raíces)
- **Como mucho, el jugador tiene:** 15 corazones (5 de base + cristales + 2 Fruto(s) de sangre), arma nivel 2 (espada: 1 de daño por golpe), 42 gemas en total
- **Camino principal** (✦ = sala nueva en esta etapa):
  - hasta **Corazón del Musgo**: Sala del Alcaide → Corazón del Musgo ✦ (2 salas)
- **Salas que se abren:** 1 · de ellas desvíos opcionales: 0

| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |
|---|---|---|---|---|---|---|
| Sala del Alcaide | Calabozos Profundos | 9 (×1.7) +1 daño | — | 0 | — | JEFE: Alcaide Verdín |
| Corazón del Musgo ✦ | Calabozos Profundos | 9 (×1.7) +1 daño | — | 0 | — | JEFE: La Madre Moho |

Total del camino: 2 salas, 0 enemigos, 0 de vida de enemigos.
Jefe **La Madre Moho**: 40 de vida (1 jugador) → 40 golpes de espada; suelta 4 gemas.

## Etapa 8: La Gran Hoguera (fin de la Zona 1)

- **Viene de:** La Madre Moho · **Habilidades:** Impulso (dash), Doble salto, Salto de pared, Alas del Alba, Pisotón de Raíces (con Vesper: Impulso (dash), Doble salto, Salto de pared, Ojo de la Noche, Pisotón de Raíces)
- **Como mucho, el jugador tiene:** 15 corazones (5 de base + cristales + 2 Fruto(s) de sangre), arma nivel 3 (espada: 2 de daño por golpe), 47 gemas en total
- **Camino principal** (✦ = sala nueva en esta etapa):
  - hasta **La Gran Hoguera**: Corazón del Musgo → Raíces de Salida ✦ → Galería de Zarzas ✦ → Veta de Ceniza ✦ → Sala de Brasas ✦ → Antesala del Abismo ✦ → La Gran Hoguera (7 salas)
- **Salas que se abren:** 5 · de ellas desvíos opcionales: 0

| Sala del camino | Región | Dificultad (escala de vida) | Enemigos | Vida total | Peligros | Hay |
|---|---|---|---|---|---|---|
| Corazón del Musgo | Calabozos Profundos | 9 (×1.7) +1 daño | — | 0 | — | JEFE: La Madre Moho |
| Raíces de Salida ✦ | Calabozos Profundos | 7 (×1.5) +1 daño | 1 babosa, 1 hongo, 2 polilla, 1 liana, 1 prisionero | 38 | — | — |
| Galería de Zarzas ✦ | Calabozos Profundos | 7 (×1.5) +1 daño | 2 polilla, 2 liana, 1 hongo | 32 | 1 pinchos, 3 sierras | — |
| Veta de Ceniza ✦ | Cueva del Abismo | 7 (×1.5) +1 daño | 7 babosa de magma, 2 prisionero, 3 polilla, 1 hongo | 81 | — | hoguera |
| Sala de Brasas ✦ | Cueva del Abismo | 7 (×1.5) +1 daño | 3 babosa de magma, 2 polilla, 1 hongo | 34 | 2 pinchos, 2 sierras | — |
| Antesala del Abismo ✦ | Cueva del Abismo | 7 (×1.5) +1 daño | 2 polilla, 2 babosa de magma, 1 caballero | 46 | 1 pinchos, 2 sierras | mejora de arma, élite: Vigía de las Cenizas |
| La Gran Hoguera | Cueva del Abismo | 8 (×1.6) +1 daño | — | 0 | — | GRAN HOGUERA |

Total del camino: 7 salas, 35 enemigos, 231 de vida de enemigos.

## Todas las salas por etapa

| Sala | Región | Se abre en etapa | Camino en etapa(s) | Tipo |
|---|---|---|---|---|
| Vestíbulo | Vestíbulo | 0 | 0 | camino |
| Gran Salón | Vestíbulo | 0 | 0, 1 | camino |
| Corredor de Armaduras | Vestíbulo | 0 | 0, 1 | camino |
| Foso de Espinas | Vestíbulo | 0 | 0, 1 | camino |
| Cubil de la Gárgola | Vestíbulo | 0 | 0, 1 | camino |
| Túnel de Calaveras | Calabozos | 0 | — | desvío |
| Bodega | Calabozos | 0 | — | desvío |
| Cripta Olvidada | Calabozos | 0 | — | desvío |
| Osario | Calabozos | 0 | — | desvío |
| Pozo de las Almas | Calabozos | 0 | — | desvío |
| Grieta Sellada | Calabozos | 0 | — | desvío |
| Escalera de los Retratos | Vestíbulo | 1 | 1 | camino |
| Sala Oculta | Vestíbulo | 1 | — | desvío |
| Archivo | Biblioteca | 1 | 1, 3, 4 | camino |
| Sala de Lectura | Biblioteca | 1 | 3, 4 | camino |
| Gran Biblioteca | Biblioteca | 1 | 3, 4 | camino |
| Observatorio | Biblioteca | 1 | 3, 4 | camino |
| Pasaje de Cadenas | Calabozos | 1 | 2, 3, 4 | camino |
| Capilla: Nave Sur | Capilla | 1 | 1, 2, 3, 4 | camino |
| Capilla: Nave Principal | Capilla | 1 | 1, 2 | camino |
| Ábside | Capilla | 1 | 1, 2 | camino |
| Mirador | Capilla | 1 | 2 | camino |
| Calabozo Norte | Calabozos | 2 | 2 | camino |
| Mazmorra de Hierro | Calabozos | 2 | 2 | camino |
| Galería de Engranajes | Torre del Reloj | 2 | 2 | camino |
| Torre del Reloj | Torre del Reloj | 2 | 2, 3, 4 | camino |
| Cámara del Reloj | Torre del Reloj | 2 | 2, 3, 4 | camino |
| Pasillo Real | Sala Real | 2 | 4, 5 | camino |
| Galería de Huesos | Calabozos | 2 | 2 | camino |
| Cripta de la Reina | Calabozos | 2 | 2 | camino |
| Escalera Real | Sala Real | 3 | 5 | camino |
| Salón de los Atriles | Biblioteca | 3 | 3, 4 | camino |
| Pasaje de Tinta | Biblioteca | 3 | 3, 4 | camino |
| Escalera de Pergaminos | Biblioteca | 3 | 3, 4 | camino |
| Scriptorium | Biblioteca | 3 | 3, 4 | camino |
| Sala del Trono | Sala Real | 4 | 4, 5 | camino |
| Torre del Alba | Torres del Alba | 5 | 5 | camino |
| Sala de los Rivales | Torres del Alba | 5 | 5, 6 | camino |
| Cámara de Aurora | Torres del Alba | 5 | 5, 6 | camino |
| Cámara de Vesper | Torres del Alba | 5 | 5, 6 | camino |
| Antecámara del Cielo | Torres del Alba | 6 | 6 | camino |
| Escalera al Cielo | Torres del Alba | 6 | 6 | camino |
| Cumbre del Alba | Torres del Alba | 6 | 6 | camino |
| Jardín Colgante | Torres del Alba | 6 | — | desvío |
| Mazmorra de Nubes | Torres del Alba | 6 | — | desvío |
| Caída Libre | Cueva del Abismo | 6 | — | desvío |
| Forja de los Elementos | Cueva del Abismo | 6 | — | desvío |
| La Gran Hoguera | Cueva del Abismo | 6 | 8 | camino |
| Santuario de las Sombras | Torres del Alba | 6 | 6 | camino |
| Pozo del Ascensor | Calabozos Profundos | 6 | 6 | camino |
| Galería de Raíces | Calabozos Profundos | 6 | 6 | camino |
| Cisterna de Musgo | Calabozos Profundos | 6 | 6 | camino |
| Celdas Cubiertas | Calabozos Profundos | 6 | — | desvío |
| Refectorio Podrido | Calabozos Profundos | 6 | 6 | camino |
| Pasaje de Zarzas | Calabozos Profundos | 6 | 6 | camino |
| Antesala del Alcaide | Calabozos Profundos | 6 | 6 | camino |
| Sala del Alcaide | Calabozos Profundos | 6 | 6, 7 | camino |
| Corazón del Musgo | Calabozos Profundos | 7 | 7, 8 | camino |
| Raíces de Salida | Calabozos Profundos | 8 | 8 | camino |
| Galería de Zarzas | Calabozos Profundos | 8 | 8 | camino |
| Veta de Ceniza | Cueva del Abismo | 8 | 8 | camino |
| Sala de Brasas | Cueva del Abismo | 8 | 8 | camino |
| Antesala del Abismo | Cueva del Abismo | 8 | 8 | camino |
