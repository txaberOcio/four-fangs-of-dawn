# Four Fangs of Dawn

A gothic co-op metroidvania for 1–4 players, in pixel art, running straight in the browser.

Four vampires, the fangs the Dawn siblings made and abandoned, return to the castle to collect what they are owed. Explore a connected map of 25+ zones, defeat bosses that grant new abilities and backtrack to open shortcuts and secrets. Play solo or with up to three friends, each from their own browser (PC, phone, TV browser or gamepad).

## Quick start

```bash
npm install
npm start
```

Then open <http://localhost:3000>. On Windows there is also an installer (`FourFangsOfDawn-Setup.exe`, see the Releases page) that needs no Node.js.

## Highlights

- Online co-op with 4-letter room codes, drop-in joining and host migration.
- Four vampires with their own weapon, passive and drawback.
- Boss fights with their own attack patterns, elites with named abilities, shops, secret rooms and an elemental forge.
- Save points at bonfires; dying sends you back to your last one.
- Options panel (key **O**): music and effects volume, text size and a visual aid for enemy projectiles.

## Development

`npm run check` (syntax), `npm run validate` (reachability of every room and item) and `npm run validate:rutas` (the game can be finished with either the Wings or the Eye). More details in [docs/DESARROLLO.md](docs/DESARROLLO.md) (Spanish).

## Third-party software

Phaser (MIT), Socket.IO (MIT) and Express (MIT). Music and sound effects are generated in the browser; all pixel art is drawn in code. The game itself is MIT licensed, see [LICENSE](LICENSE).

The main documentation is in Spanish: [README.md](README.md).
