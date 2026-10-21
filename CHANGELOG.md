# Cambios

Resumen de lo que ha cambiado en el juego, de lo más nuevo a lo más antiguo. 

## Sin publicar

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
