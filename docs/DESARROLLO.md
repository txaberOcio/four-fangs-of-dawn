# Guía de desarrollo

Cómo preparar un equipo desde cero para ejecutar y modificar *Four Fangs of Dawn*.

## 1. Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| [Node.js](https://nodejs.org) | 20 o superior (LTS) | Ejecuta el servidor y los scripts |
| [Git](https://git-scm.com) | cualquiera reciente | Descargar y subir cambios |
| [Visual Studio Code](https://code.visualstudio.com) | cualquiera reciente | Editor recomendado (opcional) |
| Un navegador moderno | Chrome, Edge o Firefox | Jugar |

### Instalación rápida en Windows 11

Abre **PowerShell** y ejecuta (cierra y vuelve a abrir la terminal al terminar para que reconozca los programas nuevos):

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
winget install Microsoft.VisualStudioCode
```

Comprueba que todo quedó instalado:

```bash
node -v    # debe mostrar v20 o superior
npm -v
git --version
```

## 2. Descargar el proyecto

```bash
git clone https://github.com/txaberOcio/four-fangs-of-dawn.git
cd four-fangs-of-dawn
code .
```

`code .` abre la carpeta en VS Code. Si prefieres hacerlo con el ratón: **Archivo → Abrir carpeta…** y elige la carpeta del proyecto. Si VS Code pregunta si confías en los autores, pulsa **Sí**.

## 3. Instalar dependencias (solo la primera vez)

En la terminal de VS Code (**Terminal → Nueva terminal**):

```bash
npm install
```

Descarga las librerías del servidor (Express y Socket.IO) y crea la carpeta `node_modules`. Esa carpeta no se sube a Git.

## 4. Ejecutar el juego

```bash
npm start
```

Abre <http://localhost:3000>. Para parar el servidor pulsa `Ctrl + C`.

Dentro de VS Code también puedes:

- Pulsar **F5** (menú *Ejecutar → Iniciar depuración*) y elegir **Servidor del juego**: arranca el servidor y permite poner puntos de interrupción en `server/index.js`.
- Usar **Terminal → Ejecutar tarea…** y elegir `Arrancar servidor`, `Comprobar sintaxis` o `Validar mapa`.

Si el puerto 3000 está ocupado, usa otro:

```powershell
$env:PORT = 3100; npm start
```

## 5. Probar con varios jugadores

- **En tu equipo:** abre varias pestañas en <http://localhost:3000>, regístrate con usuarios distintos y une todas a la misma sala con el código de 4 letras.
- **En tu red local:** la consola muestra una línea «En la red local» con una dirección como `http://192.168.1.128:3000`. Los demás la abren desde su navegador. Si Windows pregunta por el cortafuegos, permite el acceso en redes privadas.

## 6. Comprobaciones antes de subir cambios

```bash
npm run check      # revisa la sintaxis de todos los ficheros
npm run validate   # simula la física y confirma que el castillo se puede completar
```

La integración continua de GitHub (`.github/workflows/ci.yml`) ejecuta las mismas dos comprobaciones en cada *push* y *pull request*.

## 7. Dónde tocar cada cosa

| Quiero… | Fichero |
|---|---|
| Cambiar o añadir salas, puertas, enemigos, objetos | `public/world.js` |
| Ajustar jugador, jefes, luz, mapa | `public/game.js` |
| Armas, tienda, diálogos, bestiario, mando, controles táctiles | `public/extras.js` |
| Cambiar el pixel art | `public/art.js` |
| Cambiar la música | `public/music.js` |
| Cuentas, salas, partidas guardadas | `server/index.js` |

Si modificas el mapa, ejecuta siempre `npm run validate`. Más detalle en [ARCHITECTURE.md](ARCHITECTURE.md).

## 8. Datos locales

Las cuentas y partidas guardadas se almacenan en `data/users.json`. Se crea solo al registrar el primer usuario, contiene contraseñas cifradas y **no se sube a Git** (está en `.gitignore`). Para empezar de cero, para el servidor y borra ese fichero.

## 9. Problemas frecuentes

| Síntoma | Solución |
|---|---|
| `node` o `npm` «no se reconoce» | Cierra y reabre la terminal (o VS Code) tras instalar Node. Si sigue igual, reinicia el equipo. |
| `Error: Cannot find module 'express'` | Falta ejecutar `npm install`. |
| `EADDRINUSE` (puerto ocupado) | Hay otro servidor abierto. Ciérralo o usa otro puerto con `PORT`. |
| Los cambios del cliente no se ven | Recarga la página con `Ctrl + F5`. Los cambios en `server/` requieren reiniciar `npm start`. |
| Otros equipos no pueden entrar | Comprueba que estén en la misma red y que el cortafuegos permita Node.js. |
