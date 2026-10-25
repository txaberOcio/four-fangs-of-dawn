# Cambios

Resumen de lo que ha cambiado en el juego, de lo más nuevo a lo más antiguo. 

## 0.5.0

- **Archivo → Nave Sur:** el muro agrietado entre las dos salas desaparece; ahora es un paso abierto.
- **Historia (docs/HISTORIA.md, hecha con el agente Narrador):** los cuatro vampiros son los colmillos que crearon y abandonaron los hermanos del Alba. Escena de inicio en las partidas nuevas, final de la Zona 1 al llegar a La Gran Hoguera tras la Madre Moho (con aviso del Anillo si lo llevas), el Conde muere al caer y el rival rescatado se queda en la Cumbre. Corregidos 17 textos que se contradecían (diarios, bestiario, Oráculo, escenas) y los README.
- **Inicio:** en las partidas nuevas, la historia se cuenta sobre fondo negro antes de poder jugar (E o Espacio pasan de frase). Después, en todas las partidas, una pantalla de controles con las teclas dibujadas y lo que hace cada una; el juego espera hasta que pulsas E.
- **Panel de desarrollo (F2):** selector de zona y sala para teletransportarse (agrupado por zona y región).
- **Agente Narrador:** .claude/agents/narrador.md, para seguir inventando la historia con Claude Code.

## 0.4.0

- **Pinchos:** al pincharte vuelves al borde del foso por el lado por el que entraste, no a la última plataforma: las plataformas que tienen pinchos debajo ya no cuentan como punto seguro.
- **Celdas Cubiertas:** el muro agrietado de la celda secreta sangra (regueros, charco y gotas que caen, con un poco de luz), como dice la pista del Jardinero. Al romperlo desaparece. Nueva marca ['bleed', x, y, alto] en world.js.
- **Musgo (Calabozos Profundos):** su suelo frena al andar (un 15 %; el salto no cambia) y sus enemigos reciben un 20 % más de daño de fuego (golpes con el poder de Fuego, quemaduras y explosiones). Se ajusta con MOSS_SLOW y MOSS_FIRE en public/extras.js.
- **Cumbre del Alba:** el cristal del balcón lejano pasa a un rincón alto sobre los salientes de la izquierda. Solo se ve cuando estás arriba (o saltando) y solo se alcanza saltando desde esos salientes; ya no es exclusivo de Aurora.
- **Puertas selladas:** las puertas que abre un jefe se ven como una reja de hierro con un sello rojo y, al acercarte, dicen a quién hay que vencer. Desaparecen al abrirse.
- **Trono del Conde:** al hundirse el suelo, el mobiliario cae al foso; unas piezas se rompen y otras quedan tiradas. Si vuelves al punto de control, todo vuelve a su sitio.
- **Escalera Real:** la hoguera del Pasillo Real se muda aquí, y aquí espera el Rey Destronado, con la primera misión secundaria: llevar el Anillo del Rey a la Reina Isolda, que estará en la Zona 2 (el anillo sale en el HUD y se guarda con la partida). El Pasillo Real deja de ser sala segura.
- **Guardado:** el servidor ahora guarda cuántos Frutos de sangre has comprado (antes se perdía al recargar y se podía saltar el límite) y el estado de las misiones. Hay que reiniciar el servidor para que lo aplique.
- **Panel de desarrollo (F2):** botones «Tienda» (todos los objetos), «Guardar aquí» (guarda la partida y recuerda el sitio exacto) y «Cargar» (vuelve a lo guardado y a ese sitio).
- **Mapas:** el mapa de desarrollador (F2) marca tu sala en cian y tu posición en magenta; el mapa grande (M) dice en qué sala estás.
- **Impulso más corto:** unos 3 bloques en vez de 4,4 (dashTime 0,18). Las subidas que lo exigen (Gran Salón, Nave Principal, Observatorio) tienen las plataformas más cerca; el validador pasa con Aurora y con Vesper.
- **Arco más lento y de menos alcance:** unos 30 % más de espera entre flechas y un 20 % menos de alcance en todos los niveles (de 290 a 450 px según el nivel; antes de 360 a 560).
- **Salas vecinas:** si el paso hacia ellas está abierto se ven al 70 % de luz; si hay una puerta cerrada, un muro agrietado o raíces sin romper, se ven casi negras (y sin los ojos rojos de sus enemigos) hasta que se abre el paso. world.js calcula los pasos entre salas (world.passages) y el juego mira si están libres. Al cambiar de sala, la luz pasa de una a otra poco a poco (0,7 s, ROOM_FADE en game.js).
- **Antorchas como guía:** solo empiezan encendidas en salas seguras, tranquilas o sin enemigos; las demás están apagadas hasta que las enciendes. Hay que estar más cerca para encenderlas (antes se llegaba desde lejos) y 24 de ellas, en salas con enemigos, están altas: se encienden en mitad de un salto.
- **Enemigos y salas seguras:** al llegar al borde de una sala segura dan la vuelta y siguen andando, en vez de desaparecer.
- **Élites:** una vez vencidos ya no vuelven a aparecer (su recompensa ya era única).
- **Gran Salón:** la plataforma apoyada en el bloque ya no deja colarse dentro de la piedra (y caer a la sala de abajo) al bajar con ↓ + saltar.
- **Inventario de uso (Q/R):** solo salen los objetos que se gastan y de los que tienes alguno (si no tienes ninguno, pone «Sin objetos»); los amuletos se ven aparte en el HUD. Los Frutos de sangre que quedaran en partidas antiguas se aplican al cargar.
- **Zona 1 reequilibrada** (todo el mapa actual; detalle en docs/ZONA1.md):
  - **Daño:** una sola mejora de daño por zona, al final de cada zona. En la Zona 1 está en la Antesala del Abismo (tras la Madre Moho). La mejora de arma de la Gran Biblioteca sigue (más alcance, mismo daño) y la de la Torre del Reloj desaparece. El Colmillo de acero ya no se vende.
  - **Corazones:** quedan 8 cristales de vida (cada partida puede coger 7; fuera los de la Cripta, el Observatorio, la Torre del Reloj y el Santuario). El Fruto de sangre pasa a ser una mejora con límite: 2 compras (5 y 7 gemas), solo en la Casa del Mercader.
  - **Gemas:** 16 en el mapa (antes 23) y los jefes sueltan menos (24 en total, antes 42).
  - **Jefes:** vida pensada para golpes de 1 de daño: Gárgola 12, Obispo 16, Reina 20, Guardián del Reloj 22, Archimago 30, Conde 32, Aurora/Vesper 34, Alcaide 36 y Madre Moho 40. Los enemigos corrientes suben de vida más despacio por zona (×1 a ×1,7, antes ×1 a ×3).
  - **Tramo tranquilo tras el Conde:** Escalera Real, Foso del Conde, Torre del Alba y Sala de los Rivales sin enemigos y con música de calma nueva (tonalidad mayor, lenta, con campanas).
  - **Casa del Mercader:** casita en la Sala de los Rivales; se entra y se sale con E por la puerta. Dentro, el mercader del Mirador (que se muda) vende pociones, elixires, amuletos, talismanes y el Fruto de sangre. Nuevo tipo de sala «interior» (['door', x, sala, xDestino] en world.js) que no sale en el mapa.
  - **Tiendas:** Vestíbulo (lo básico), Nave Sur (Capilla), Casa del Mercader (tras el Conde) y un mercader nuevo en el Pozo del Ascensor (Calabozos Profundos).
  - **Camino de salida:** hoguera nueva en la entrada de la Veta de Ceniza (sus enemigos siguen ahí: nueva marca ['unsafe']) y sus salas cuentan como Torres del Alba (menos vida).
  - **Grieta Sellada:** sala nueva bajo la Bodega; su puerta a la Caída Libre se abre al caer Aurora o Vesper, así que la Cueva del Abismo queda abierta en la misma etapa para los dos rivales.

- **Herrero:** se queda en su sitio de la Cueva del Abismo hasta que le lleves el Martillo Latente. La Reina de Huesos ya no lo da: lo suelta el Verdugo Cubierto de Musgo, élite de las Celdas Cubiertas (las partidas que ya lo vencieron reciben el martillo al cargar). El panel de desarrollador (F2) sigue teniendo el botón «Dar el Martillo».
- **Mobiliario por zonas:** cada zona tiene su decoración de fondo (candelabros, estatuas y mesas en el castillo; librerías en la Biblioteca; bancos y santos en la Capilla; jaulas y huesos en los calabozos; engranajes en la Torre del Reloj; estandartes y columnas en la Sala Real; bancos con macetas en las Torres del Alba; estalagmitas y cristales en la Cueva del Abismo; hongos y raíces en el musgo) y objetos rompibles en primer plano (barriles, jarrones, cajas, libros, urnas, macetas, cajas de engranajes y rocas). Se rompen con golpes, flechas o Pisotón, a veces sueltan almas o medio corazón, y reaparecen al descansar en una hoguera. Cada zona tiene su propio catálogo (unas 60 piezas distintas entre suelo, pared y rompibles) y las piezas se reparten sin repetirse una tras otra; hay también adornos de pared (tapices, cuadros, mapas, vidrieras, grilletes, engranajes, brasas, enredaderas...). Archivo nuevo: public/decor.js.
- **Progresión más lineal:** cada habilidad abre la zona del siguiente jefe. Gárgola → Impulso (abre Biblioteca, Capilla y el Ábside); Archimago y Obispo → Doble salto (abre Calabozos y Reloj); Reina y Guardián del Reloj → Salto de pared (abre el Trono); Conde → Torres del Alba; Aurora o Vesper → Alcaide Verdín → Madre Moho. Para ello: el Gran Salón exige el Impulso, el Pozo de las Almas el Doble salto y la reja de las Cadenas se abre al caer el Obispo.
- **Dificultad ordenada:** la vida de los jefes sube con el orden (Archimago 18, Obispo 22, Reina 28, Guardián del Reloj 32, Aurora y Vesper 36) y las salas de la entrada con paleta de calabozo cuentan como zona 0. Los enemigos de zona 3 a 5 tienen algo más de vida.
- **Archimago Silente, jefe temible:** ahora tiene 64 de vida (antes 18), suelta 6 gemas y su Archivo Prohibido queda cerrado hasta que cae el Guardián del Reloj: hay que volver más tarde. Al empezar su combate su imagen se duplica y tiembla (los jefes con la marca `fearsome` en `game.js` hacen lo mismo).
- **Sellos del Trono:** al romper el sello del Archimago o de la Reina sale una escena que lo muestra y dice cuántos faltan.
- **Suelo agrietado de la Cumbre del Alba:** se abre solo cuando cae el Conde, y también se rompe con ↓ + saltar (además de a golpes).
- **Prisionero mohoso:** sus setas lanzadas quitan 2 corazones al impactar; si le tienes muy cerca, da un impulso hacia atrás y te lanza la seta apuntando.
- **Suelo de Pisotón:** las losas de raíces que solo rompe el Pisotón tienen un dibujo propio: tierra con raíces y dos flechas ▼ brillantes que parpadean.
- **Lenguaje de color:** el AZUL marca escudos e invulnerables (aura azul) y el DORADO marca el punto débil. El Caballero maldito ahora lleva escudo: lo levanta y baja por turnos (azul = no le haces daño; el Pisotón se lo quita). Las sierras y centinelas invulnerables también se marcan en azul.
- **Madre Moho:** al empezar su combate (primera vez, con el Pisotón aprendido) el personaje dice que va a romperle el escudo y se lanza solo con el Pisotón. Mientras tiene armadura aparece una flecha dorada ▼ sobre ella; al romperse, brilla en dorado y su barra de vida pasa a dorada.
- **Camino de salida de la Madre Moho:** al caer se abre su puerta oeste y 5 salas nuevas (Raíces de Salida, Galería de Zarzas, Veta de Ceniza, Sala de Brasas y Antesala del Abismo) con plataformas, pinchos y sierras llevan hasta La Gran Hoguera. El último tramo es una caída: de La Gran Hoguera no se puede volver subiendo. Enemigos nuevos: la Polilla de esporas (vuela y suelta esporas) y la Babosa de magma (deja brasas), y un élite, el Vigía de las Cenizas.
- **Liana Estranguladora:** ahora cuelga de una liana que se ve y se balancea, se pone roja unos instantes y escupe tres espinas hacia el jugador, además de caer sobre quien pasa justo debajo.
- **Veta de Ceniza, laberinto de dos pisos:** un suelo intermedio parte la sala; para llegar a la puerta oeste hay que subir al piso de arriba, cruzar sus muros y romper con el **Pisotón** una de las dos losas del suelo (marcadas con flechas ▼) para bajar. Las losas de Pisotón son ahora un tipo de bloque propio (['R', x, y, ancho, alto] en world.js).
- **Esmeralda:** sus golpes ya no la curan ni empujan a los enemigos.
- El objetivo de la pantalla ahora sigue el nuevo orden y, tras el Conde, señala al Alcaide y a la Madre Moho.
- `npm run validate` ahora cierra las puertas por jefe y comprueba el orden real de jefes. Con `PICK=vesper` valida la otra elección del Alba.

## 0.3.0

- **Calabozos Profundos (zona nueva):** un ascensor desde el Santuario de las Sombras baja a 10 salas cubiertas de musgo, con hongos luminosos, goteras, música propia, diarios y un Jardinero Ciego. Nuevos enemigos (babosa de musgo, hongo esporífero, liana estranguladora, prisionero mohoso que resucita) y un élite con nombre.
- **Dos jefes nuevos:** el Alcaide Verdín, que da la habilidad nueva **Pisotón de Raíces** (en el aire, mantén abajo para caer en picado), y La Madre Moho, cuya armadura solo se rompe con el Pisotón. El Pisotón también rompe los suelos de raíces.
- El validador conoce los suelos de raíces: la sala de la Madre Moho solo es alcanzable con el Pisotón.
## 0.2.0

- **Opciones (tecla O o botón ⚙):** volumen de música y de efectos por separado, tamaño del texto (normal, grande, muy grande) y una ayuda visual para que los proyectiles enemigos sean más grandes y parpadeen.
- **Dibujos propios** para Aurora, Vesper, el Archon y la Reina de Huesos, y un pequeño movimiento de respiración del héroe cuando está quieto.
- **Sonido:** pasos, aterrizaje, muerte de enemigos, viaje rápido, descanso en hoguera e imbuir el arma. El bajo tiene una octava extra para que se oiga en altavoces pequeños y los jefes tienen variantes de su tema.
- **Historia:** tras vencer a uno de los hermanos del Alba, el otro aparece en la Cumbre con su propio diálogo. Tres diarios nuevos (Antecámara del Cielo, Cumbre y Forja).
- **Equilibrio:** el daño extra de Esmeralda ya no se redondea hacia arriba en cada golpe (antes un golpe de 1 corazón le quitaba 2); a cambio, Azul se mueve algo más lento.
- **Punto de control literal:** al morir en solitario el mundo vuelve a como estaba al descansar (jefes vivos, muros cerrados, antorchas).
- **Seguridad:** cabeceras CSP y X-Frame-Options en el servidor.
- **Herramientas:** `npm run validate:rutas` comprueba que se puede avanzar solo con las Alas del Alba o solo con el Ojo de la Noche.

## 0.1.0-alpha

- Primera versión con instalador para Windows (`FourFangsOfDawn-Setup.exe`), Cueva del Abismo con herrero y fragua de elementos, tiendas con stock, salas secretas, élites con habilidades, Torres del Alba, Archivo Prohibido y Catacumbas Reales.
