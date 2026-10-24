/* Mobiliario de cada zona: decorado de suelo y de pared (la mayoría de las piezas) y algunos objetos rompibles en primer plano.
   Todo se dibuja por código (pixel art a mano) y se reparte por las salas con una semilla fija: siempre salen en los mismos sitios.
   Cada zona tiene su propio catálogo y las piezas se reparten sin repetir una tras otra (bolsa mezclada). */
(() => {
  const SC = 3; // cada píxel del dibujo ocupa 3 píxeles de pantalla, como el resto del juego
  const shroom = (cap, stem, spot) => [16, 18, (r, g) => { r(stem, 6, 8, 4, 10); g.fillStyle = cap; g.beginPath(); g.ellipse(8, 8, 8, 6, 0, Math.PI, 0); g.fill(); r('rgba(0,0,0,0.25)', 0, 8, 16, 1); r(spot, 4, 4, 2, 2); r(spot, 10, 3, 2, 2); r(spot, 7, 6, 1, 1); }];
  const circle = (g, x, y, rad, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, rad, 0, 6.3); g.fill(); };

  // ---------- dibujos: [ancho, alto, función(r, g)] con r(color, x, y, w, h) para pintar rectángulos y g = contexto 2D
  const ART = {
    // ===== suelo, ya existentes
    p_candel: [8, 20, r => { r('#8a7040', 3, 6, 2, 12); r('#8a7040', 0, 5, 8, 1); r('#8a7040', 0, 3, 1, 3); r('#8a7040', 7, 3, 1, 3); r('#5a4a30', 2, 18, 4, 2); r('#e8e0c8', 0, 2, 1, 3); r('#e8e0c8', 3, 1, 2, 4); r('#e8e0c8', 7, 2, 1, 3); r('#ffcf5a', 0, 0, 1, 2); r('#ffcf5a', 3, 0, 2, 1); r('#ffcf5a', 7, 0, 1, 2); }],
    p_statue: [12, 22, r => { r('#4a4a56', 1, 19, 10, 3); r('#6a6a78', 2, 18, 8, 1); r('#8a8a98', 3, 12, 2, 7); r('#8a8a98', 7, 12, 2, 7); r('#9a9aa8', 3, 5, 6, 8); r('#9a9aa8', 2, 5, 8, 2); r('#aab0c0', 4, 1, 4, 4); r('#2a2a34', 5, 3, 2, 1); r('#b02a2a', 5, 0, 2, 1); r('#c8ccd8', 10, 4, 1, 12); r('#8a7040', 9, 10, 3, 1); }],
    p_table: [28, 14, r => { r('#8a6a3a', 0, 5, 28, 1); r('#6a4a2a', 0, 6, 28, 2); r('#4a3220', 2, 8, 2, 6); r('#4a3220', 24, 8, 2, 6); r('#e8e0c8', 12, 2, 1, 3); r('#ffcf5a', 12, 1, 1, 1); r('#d8c070', 20, 3, 2, 2); r('#c8c8d0', 6, 4, 4, 1); }],
    p_shelf: [18, 26, (r) => { r('#4a3220', 0, 0, 18, 26); r('#2a1a10', 1, 1, 16, 24); const cols = ['#8a2a2a', '#2a5a8a', '#3a7a3a', '#8a6a2a', '#6a3a8a']; [1, 8, 15].forEach((y0, row) => { r('#6a4a2a', 1, y0 + 6, 16, 1); let x = 2; for (let i = 0; x < 16; i++) { const w = 1 + ((i + row) % 2), h = 4 + ((i * 3 + row) % 2); r(cols[(i + row * 2) % 5], x, y0 + 6 - h, w, h); x += w; } }); r('#6a4a2a', 1, 22, 16, 2); }],
    p_lectern: [10, 16, r => { r('#4a3220', 4, 6, 2, 10); r('#4a3220', 1, 14, 8, 2); r('#6a4a2a', 0, 4, 10, 2); r('#e8e0c8', 1, 2, 8, 2); r('#8a2a2a', 1, 2, 1, 2); r('#4a3220', 3, 5, 4, 1); }],
    p_pew: [24, 12, r => { r('#5a3a1e', 0, 0, 24, 5); r('#7a5a34', 0, 0, 24, 1); r('#6a4a2a', 0, 6, 24, 2); r('#3a2616', 1, 8, 2, 4); r('#3a2616', 21, 8, 2, 4); }],
    p_saint: [12, 24, r => { r('#4a4a56', 1, 21, 10, 3); r('#8a8a98', 3, 6, 6, 15); r('#9a9aa8', 2, 8, 8, 4); r('#aab0c0', 4, 2, 4, 4); r('#ffd98a', 3, 0, 6, 1); r('#ffd98a', 3, 1, 1, 2); r('#ffd98a', 8, 1, 1, 2); r('#aab0c0', 4, 12, 4, 2); }],
    p_column: [10, 24, r => { r('#7a7a88', 2, 3, 6, 19); r('#8a8a98', 1, 0, 8, 3); r('#6a6a78', 0, 21, 10, 3); r('#4a4a56', 4, 8, 1, 6); r('#9a9aa8', 2, 3, 1, 18); }],
    p_banner: [10, 24, r => { r('#6a4a2a', 4, 0, 2, 24); r('#9a2a2a', 1, 2, 8, 14); r('#9a2a2a', 1, 16, 3, 2); r('#9a2a2a', 6, 16, 3, 2); r('#ffd23b', 4, 6, 2, 4); r('#ffd23b', 3, 7, 4, 1); r('#4a3220', 2, 22, 6, 2); }],
    p_cage: [14, 18, r => { r('#6a6a78', 1, 0, 12, 1); r('#6a6a78', 1, 16, 12, 2); [1, 4, 7, 10, 12].forEach(x => r('#6a6a78', x, 0, 1, 17)); r('#e8e4d4', 5, 14, 4, 2); r('#e8e4d4', 6, 12, 2, 2); r('#15101c', 6, 12, 1, 1); }],
    p_bones: [16, 9, r => { r('#b8b4a0', 0, 7, 16, 2); r('#d8d4c0', 1, 5, 14, 3); r('#d8d4c0', 3, 3, 3, 2); r('#e8e4d4', 9, 1, 4, 5); r('#15101c', 10, 3, 1, 1); r('#15101c', 12, 3, 1, 1); r('#d8d4c0', 14, 4, 2, 1); }],
    p_gear: [22, 22, (r, g) => { circle(g, 11, 11, 8, '#8a7a40'); for (let i = 0; i < 10; i++) { g.save(); g.translate(11, 11); g.rotate(i * Math.PI / 5); g.fillStyle = '#8a7a40'; g.fillRect(-2, -11, 4, 4); g.restore(); } circle(g, 11, 11, 3, '#2a2418'); r('#b8a860', 6, 7, 2, 1); r('#b8a860', 14, 14, 2, 1); }],
    p_bench: [22, 14, r => { r('#9a9aa8', 0, 7, 22, 3); r('#7a7a88', 2, 10, 3, 4); r('#7a7a88', 17, 10, 3, 4); r('#8a4a2a', 8, 3, 6, 4); r('#c8784a', 7, 2, 8, 2); r('#4aa83a', 9, 0, 1, 3); r('#4aa83a', 12, 0, 1, 3); r('#f08ac8', 8, 0, 2, 2); r('#f0d86a', 12, 0, 2, 2); }],
    p_stalag: [16, 18, (r, g) => { g.fillStyle = '#6a5040'; g.beginPath(); g.moveTo(0, 18); g.lineTo(5, 0); g.lineTo(10, 18); g.fill(); g.fillStyle = '#7a6050'; g.beginPath(); g.moveTo(7, 18); g.lineTo(12, 6); g.lineTo(16, 18); g.fill(); g.fillStyle = '#8a7060'; g.fillRect(5, 2, 1, 14); }],
    p_crystal: [14, 16, (r, g) => { g.fillStyle = '#ff9a3a'; g.beginPath(); g.moveTo(1, 16); g.lineTo(4, 3); g.lineTo(8, 16); g.fill(); g.fillStyle = '#ffb860'; g.beginPath(); g.moveTo(6, 16); g.lineTo(10, 0); g.lineTo(14, 16); g.fill(); g.fillStyle = '#ffe2a0'; g.fillRect(4, 5, 1, 7); g.fillRect(10, 3, 1, 9); }],
    p_shroom: shroom('#6dffd0', '#cfe8d0', '#ffffff'),
    p_shroom_violet: shroom('#b48aff', '#e0d4f0', '#f4ecff'),
    p_roots: [18, 12, (r, g) => { r('#3f7a3a', 0, 10, 18, 2); g.strokeStyle = '#5a4128'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 11); g.quadraticCurveTo(5, 2, 9, 8); g.quadraticCurveTo(13, 12, 18, 3); g.stroke(); g.strokeStyle = '#8a6a3a'; g.lineWidth = 1; g.beginPath(); g.moveTo(2, 8); g.quadraticCurveTo(7, 3, 10, 7); g.stroke(); r('#8fd35a', 3, 9, 2, 1); r('#8fd35a', 12, 9, 2, 1); }],
    // ===== suelo, nuevos (Castillo)
    p_weaponrack: [16, 20, r => { r('#4a3220', 0, 17, 16, 3); r('#4a3220', 1, 3, 2, 15); r('#4a3220', 13, 3, 2, 15); r('#6a4a2a', 1, 8, 14, 2); r('#c8ccd8', 4, 0, 1, 15); r('#8a8a98', 3, 1, 3, 2); r('#aab0c0', 7, 4, 1, 13); r('#8a7040', 6, 13, 3, 1); r('#8a8a98', 10, 3, 4, 3); r('#6a4a2a', 11, 6, 1, 11); }],
    p_fireplace: [24, 22, r => { r('#6a6a78', 0, 0, 24, 22); r('#7a7a88', 1, 1, 22, 20); r('#8a8a98', 0, 3, 24, 3); r('#1a1210', 4, 7, 16, 15); r('#4a3220', 6, 20, 12, 2); r('#ff7a2a', 8, 14, 8, 6); r('#ffb347', 10, 12, 4, 7); r('#ffe28a', 11, 16, 2, 4); }],
    p_grandclock: [10, 26, r => { r('#5a3a1e', 1, 0, 8, 26); r('#3a2616', 0, 23, 10, 3); r('#e8e0c8', 3, 3, 4, 4); r('#15101c', 5, 4, 1, 2); r('#15101c', 5, 5, 2, 1); r('#2a1a10', 3, 10, 4, 10); r('#d8b040', 5, 11, 1, 6); r('#d8b040', 4, 16, 3, 2); r('#7a5a34', 1, 0, 1, 23); }],
    p_carpet: [30, 3, r => { r('#8a1a2a', 0, 0, 30, 3); r('#d8b040', 0, 0, 30, 1); r('#d8b040', 0, 2, 30, 1); for (let x = 3; x < 28; x += 6) r('#d8b040', x, 1, 2, 1); }],
    p_throne: [14, 26, r => { r('#8a6a20', 1, 0, 12, 17); r('#7a1a2a', 3, 3, 8, 13); r('#d8b040', 2, 0, 2, 2); r('#d8b040', 6, 0, 2, 2); r('#d8b040', 10, 0, 2, 2); r('#8a6a20', 0, 17, 14, 3); r('#6a4a10', 1, 20, 3, 6); r('#6a4a10', 10, 20, 3, 6); r('#7a1a2a', 2, 16, 10, 1); }],
    p_banquet: [30, 14, r => { r('#6a4a2a', 0, 7, 30, 2); r('#e8e0c8', 0, 6, 30, 1); r('#4a3220', 2, 9, 2, 5); r('#4a3220', 26, 9, 2, 5); r('#c8784a', 5, 3, 7, 3); r('#8a4a2a', 6, 4, 5, 1); r('#d8b040', 16, 3, 2, 3); r('#d8b040', 20, 4, 2, 2); r('#7ac84a', 24, 4, 3, 2); r('#e8e0c8', 14, 1, 1, 5); r('#ffcf5a', 14, 0, 1, 1); }],
    // ===== suelo, nuevos (Biblioteca / Archivo)
    p_globe: [12, 16, (r, g) => { r('#4a3220', 5, 11, 2, 5); r('#4a3220', 2, 14, 8, 2); circle(g, 6, 6, 5, '#3a6a9a'); g.fillStyle = '#6aa860'; g.fillRect(3, 3, 3, 3); g.fillRect(7, 6, 3, 3); r('#c8a850', 0, 6, 1, 1); r('#c8a850', 11, 6, 1, 1); }],
    p_desk: [24, 14, r => { r('#6a4a2a', 0, 5, 24, 2); r('#4a3220', 1, 7, 6, 7); r('#4a3220', 17, 7, 6, 7); r('#8a6a3a', 2, 8, 4, 1); r('#8a6a3a', 18, 8, 4, 1); r('#15101c', 4, 2, 2, 3); r('#e8e0c8', 5, 0, 1, 3); r('#e8e0c8', 10, 3, 6, 2); r('#8a2a2a', 18, 3, 3, 2); }],
    p_ladder: [10, 26, r => { r('#6a4a2a', 1, 0, 1, 26); r('#6a4a2a', 8, 0, 1, 26); for (let i = 0; i < 6; i++) r('#8a6a3a', 1, 2 + i * 4, 8, 1); }],
    p_scrolls: [12, 12, r => { r('#8a6a3a', 1, 4, 10, 8); r('#6a4a2a', 1, 4, 10, 1); r('#e8e0c8', 2, 0, 2, 5); r('#d8c898', 5, 1, 2, 4); r('#e8e0c8', 8, 0, 2, 5); r('#8a2a2a', 2, 3, 2, 1); }],
    // ===== suelo, nuevos (Capilla)
    p_altar_stone: [22, 16, r => { r('#8a8a98', 0, 7, 22, 3); r('#6a6a78', 2, 10, 18, 6); r('#e8e0c8', 4, 6, 14, 2); r('#d8b040', 4, 7, 14, 1); r('#d8b040', 9, 1, 4, 4); r('#d8b040', 10, 5, 2, 2); r('#e8e0c8', 1, 3, 1, 4); r('#ffcf5a', 1, 2, 1, 1); r('#e8e0c8', 20, 3, 1, 4); r('#ffcf5a', 20, 2, 1, 1); }],
    p_font: [12, 14, r => { r('#9a9aa8', 0, 3, 12, 3); r('#8a8a98', 1, 6, 10, 2); r('#8a8a98', 4, 8, 4, 4); r('#7a7a88', 2, 12, 8, 2); r('#7ac8ff', 2, 2, 8, 1); }],
    p_confess: [16, 26, r => { r('#4a3220', 0, 0, 16, 26); r('#5a3a1e', 1, 1, 14, 24); r('#6a4a2a', 2, 2, 12, 3); r('#7a1a2a', 4, 8, 8, 16); r('#2a1208', 4, 8, 1, 16); r('#8a6a3a', 7, 5, 2, 1); }],
    p_candles_floor: [10, 8, r => { r('#e8e0c8', 1, 3, 2, 5); r('#e8e0c8', 4, 1, 2, 7); r('#e8e0c8', 7, 4, 2, 4); r('#ffcf5a', 1, 2, 2, 1); r('#ffcf5a', 4, 0, 2, 1); r('#ffcf5a', 7, 3, 2, 1); r('#c8c0a0', 0, 7, 10, 1); }],
    // ===== suelo, nuevos (Calabozos)
    p_rack: [22, 12, r => { r('#5a3a1e', 0, 6, 22, 3); r('#4a3220', 1, 3, 3, 9); r('#4a3220', 18, 3, 3, 9); r('#3a2616', 3, 9, 2, 3); r('#3a2616', 17, 9, 2, 3); r('#c8b070', 5, 5, 12, 1); r('#6a6a78', 2, 2, 1, 1); r('#6a6a78', 19, 2, 1, 1); }],
    p_stocks: [16, 14, r => { r('#4a3220', 1, 0, 2, 14); r('#4a3220', 13, 0, 2, 14); r('#6a4a2a', 1, 5, 14, 3); r('#1a1210', 4, 5, 2, 3); r('#1a1210', 10, 5, 2, 3); r('#6a6a78', 1, 4, 14, 1); }],
    p_ironmaiden: [12, 24, r => { r('#6a6a78', 1, 2, 10, 22); r('#8a8a98', 2, 0, 8, 3); r('#aab0c0', 4, 5, 4, 5); r('#15101c', 5, 7, 1, 1); r('#15101c', 7, 7, 1, 1); r('#4a4a56', 3, 14, 6, 1); r('#4a4a56', 3, 17, 6, 1); r('#4a4a56', 3, 20, 6, 1); r('#9a9aa8', 1, 2, 1, 22); }],
    // ===== suelo, nuevos (Torre del Reloj)
    p_pendulum: [14, 26, (r, g) => { r('#5a3a1e', 0, 0, 14, 2); r('#5a3a1e', 0, 0, 2, 26); r('#5a3a1e', 12, 0, 2, 26); r('#3a2616', 0, 24, 14, 2); r('#b8a860', 6, 2, 1, 16); circle(g, 6.5, 20, 3, '#d8b040'); r('#fff2b0', 5, 19, 1, 1); }],
    p_workbench: [24, 14, (r, g) => { r('#6a4a2a', 0, 6, 24, 2); r('#4a3220', 1, 8, 2, 6); r('#4a3220', 21, 8, 2, 6); circle(g, 6, 3, 3, '#b8a860'); circle(g, 6, 3, 1, '#2a2418'); circle(g, 11, 4, 2, '#8a7a40'); r('#aab0c0', 15, 4, 5, 1); r('#8a6a3a', 15, 3, 1, 1); }],
    p_gearpile: [18, 12, (r, g) => { circle(g, 5, 7, 5, '#8a7a40'); circle(g, 5, 7, 2, '#2a2418'); circle(g, 12, 8, 4, '#b8a860'); circle(g, 12, 8, 1.5, '#2a2418'); circle(g, 9, 4, 3, '#6a5a30'); circle(g, 9, 4, 1, '#2a2418'); r('#4a4030', 0, 11, 18, 1); }],
    // ===== suelo, nuevos (Alba)
    p_fountain: [20, 18, r => { r('#9a9aa8', 0, 10, 20, 4); r('#8a8a98', 2, 14, 16, 4); r('#9a9aa8', 9, 2, 2, 8); r('#7ac8ff', 3, 9, 14, 2); r('#bfe8ff', 9, 0, 1, 3); r('#bfe8ff', 6, 4, 1, 2); r('#bfe8ff', 13, 4, 1, 2); r('#aab0c0', 0, 10, 20, 1); }],
    p_planter: [16, 12, r => { r('#9a9aa8', 0, 6, 16, 6); r('#7a7a88', 0, 6, 16, 1); r('#4aa83a', 2, 1, 3, 5); r('#4aa83a', 7, 0, 3, 6); r('#4aa83a', 11, 2, 3, 4); r('#f08ac8', 3, 0, 2, 2); r('#f0d86a', 8, 0, 2, 2); r('#c8a0ff', 12, 1, 2, 2); }],
    p_sundial: [12, 14, r => { r('#9a9aa8', 4, 5, 4, 9); r('#7a7a88', 2, 12, 8, 2); r('#aab0c0', 1, 3, 10, 2); r('#6a6a78', 5, 0, 2, 3); r('#4a4a56', 6, 1, 1, 2); }],
    p_lampost: [8, 24, r => { r('#4a4a56', 3, 4, 2, 20); r('#3a3a46', 1, 22, 6, 2); r('#c8a850', 1, 0, 6, 1); r('#c8a850', 1, 4, 6, 1); r('#c8a850', 1, 0, 1, 5); r('#c8a850', 6, 0, 1, 5); r('#ffe28a', 2, 1, 4, 3); }],
    // ===== suelo, nuevos (Cueva del Abismo)
    p_ore: [14, 14, (r, g) => { g.fillStyle = '#5a4a40'; g.beginPath(); g.moveTo(0, 14); g.lineTo(2, 5); g.lineTo(7, 1); g.lineTo(12, 5); g.lineTo(14, 14); g.fill(); r('#ffd23b', 4, 5, 2, 2); r('#6ad8ff', 8, 7, 2, 2); r('#ffd23b', 6, 10, 2, 1); r('#8a6a3a', 12, 0, 1, 9); r('#aab0c0', 10, 0, 4, 2); }],
    p_minecart: [20, 14, (r, g) => { r('#5a4a40', 1, 3, 18, 7); r('#7a6a5a', 0, 2, 20, 2); r('#ffb347', 3, 0, 4, 3); r('#ffd23b', 9, 1, 3, 2); r('#ff7a2a', 13, 0, 3, 3); circle(g, 5, 11, 2.5, '#2a2a34'); circle(g, 15, 11, 2.5, '#2a2a34'); r('#4a3a30', 0, 13, 20, 1); }],
    p_lavapool: [18, 4, r => { r('#7a2a0e', 0, 0, 18, 4); r('#ff7a2a', 1, 1, 16, 3); r('#ffd06a', 3, 1, 4, 1); r('#ffd06a', 10, 2, 5, 1); }],
    // ===== suelo, nuevos (Musgo)
    p_stump: [16, 12, r => { r('#5a4128', 2, 2, 12, 10); r('#3a2a18', 2, 2, 12, 1); r('#8a6a3a', 4, 3, 8, 1); r('#8a6a3a', 5, 5, 6, 1); r('#3f7a3a', 2, 9, 12, 3); r('#6dffd0', 1, 0, 4, 3); r('#6dffd0', 10, 1, 3, 2); r('#ffffff', 2, 1, 1, 1); }],
    p_bramble: [18, 14, (r, g) => { g.strokeStyle = '#2a5428'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 13); g.quadraticCurveTo(5, 0, 9, 7); g.quadraticCurveTo(13, 14, 18, 2); g.stroke(); g.strokeStyle = '#3f7a3a'; g.lineWidth = 1; g.beginPath(); g.moveTo(2, 12); g.quadraticCurveTo(8, 3, 12, 9); g.stroke(); r('#8fd35a', 3, 6, 1, 2); r('#8fd35a', 11, 5, 1, 2); r('#8fd35a', 15, 4, 1, 2); r('#d84a8a', 7, 6, 2, 2); r('#d84a8a', 13, 9, 2, 2); }],
    // ===== pared (colgados)
    w_tapestry: [14, 24, r => { r('#8a1a2a', 0, 0, 14, 22); r('#d8b040', 0, 0, 14, 1); r('#d8b040', 0, 0, 1, 22); r('#d8b040', 13, 0, 1, 22); r('#d8b040', 5, 8, 4, 6); r('#d8b040', 6, 6, 2, 2); r('#8a1a2a', 0, 22, 4, 2); r('#8a1a2a', 5, 22, 4, 2); r('#8a1a2a', 10, 22, 4, 2); }],
    w_painting: [16, 20, r => { r('#8a6a20', 0, 0, 16, 20); r('#2a3a4a', 2, 2, 12, 16); r('#d8a878', 6, 5, 4, 4); r('#15101c', 6, 4, 4, 1); r('#6a2a2a', 4, 9, 8, 8); r('#d8b040', 7, 11, 2, 1); }],
    w_shield: [16, 16, (r, g) => { g.strokeStyle = '#c8ccd8'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(1, 1); g.lineTo(15, 15); g.moveTo(15, 1); g.lineTo(1, 15); g.stroke(); r('#9a2a2a', 4, 3, 8, 8); r('#9a2a2a', 5, 11, 6, 2); r('#9a2a2a', 6, 13, 4, 1); r('#d8b040', 4, 3, 8, 1); r('#d8b040', 7, 4, 2, 7); r('#d8b040', 5, 6, 6, 1); }],
    w_map: [18, 14, r => { r('#8a6a3a', 0, 0, 18, 14); r('#d8c898', 1, 1, 16, 12); r('#6a8a5a', 3, 3, 5, 3); r('#6a8a5a', 9, 6, 6, 4); r('#4a7a9a', 6, 8, 3, 2); r('#8a2a2a', 4, 10, 1, 1); r('#8a2a2a', 6, 9, 1, 1); r('#8a2a2a', 8, 7, 1, 1); r('#8a2a2a', 13, 4, 2, 2); }],
    w_window: [12, 22, r => { r('#4a4a56', 0, 0, 12, 22); r('#2a2a34', 1, 1, 10, 20); const cs = ['#c8402a', '#2a5ac8', '#d8b040', '#3a9a4a', '#8a3ac8']; for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) r(cs[(i + j * 2) % 5], 1 + i * 5, 3 + j * 4, 4, 3); r('#c8402a', 3, 1, 6, 2); r('#2a2a34', 5, 1, 2, 20); }],
    w_cross: [10, 14, r => { r('#b8b4a0', 4, 0, 2, 14); r('#b8b4a0', 1, 3, 8, 2); r('#d8d4c0', 4, 0, 1, 14); r('#ffd98a', 3, 2, 4, 1); }],
    w_chains: [8, 18, r => { for (let i = 0; i < 4; i++) r('#8a8a98', 3 + (i % 2), i * 3, 2, 2); r('#6a6a78', 0, 13, 3, 3); r('#6a6a78', 5, 13, 3, 3); r('#2a2a34', 1, 14, 1, 1); r('#2a2a34', 6, 14, 1, 1); }],
    w_bars: [12, 10, r => { r('#2a2a34', 0, 0, 12, 10); r('#3a5a7a', 1, 1, 10, 8); [2, 5, 8].forEach(x => r('#6a6a78', x, 0, 1, 10)); r('#6a6a78', 0, 4, 12, 1); }],
    w_gearwall: [14, 14, (r, g) => { circle(g, 7, 7, 5, '#6a5a30'); for (let i = 0; i < 8; i++) { g.save(); g.translate(7, 7); g.rotate(i * Math.PI / 4); g.fillStyle = '#6a5a30'; g.fillRect(-1.5, -7, 3, 3); g.restore(); } circle(g, 7, 7, 2, '#2a2418'); r('#8a7a40', 4, 4, 1, 1); }],
    w_clockface: [14, 14, (r, g) => { circle(g, 7, 7, 6.5, '#4a3220'); circle(g, 7, 7, 5.5, '#e8e0c8'); r('#15101c', 7, 2, 1, 2); r('#15101c', 7, 10, 1, 2); r('#15101c', 2, 7, 2, 1); r('#15101c', 10, 7, 2, 1); r('#15101c', 7, 4, 1, 4); r('#8a2a2a', 7, 7, 3, 1); }],
    w_sun: [14, 14, (r, g) => { for (let i = 0; i < 8; i++) { g.save(); g.translate(7, 7); g.rotate(i * Math.PI / 4); g.fillStyle = '#ffd23b'; g.fillRect(-1, -7, 2, 3); g.restore(); } circle(g, 7, 7, 4, '#ffd23b'); circle(g, 7, 7, 2.5, '#fff2b0'); }],
    w_wings: [22, 12, (r, g) => { g.fillStyle = '#e8e8f0'; g.beginPath(); g.moveTo(11, 8); g.quadraticCurveTo(7, 0, 0, 3); g.quadraticCurveTo(4, 5, 2, 8); g.quadraticCurveTo(6, 8, 5, 11); g.quadraticCurveTo(9, 10, 11, 12); g.fill(); g.beginPath(); g.moveTo(11, 8); g.quadraticCurveTo(15, 0, 22, 3); g.quadraticCurveTo(18, 5, 20, 8); g.quadraticCurveTo(16, 8, 17, 11); g.quadraticCurveTo(13, 10, 11, 12); g.fill(); r('#ffd98a', 10, 7, 2, 3); }],
    w_vines: [10, 22, (r, g) => { g.strokeStyle = '#2a5428'; g.lineWidth = 2; g.beginPath(); g.moveTo(3, 0); g.quadraticCurveTo(0, 8, 4, 14); g.quadraticCurveTo(6, 18, 3, 22); g.stroke(); g.beginPath(); g.moveTo(8, 0); g.quadraticCurveTo(10, 6, 7, 12); g.stroke(); r('#8fd35a', 1, 8, 2, 1); r('#8fd35a', 5, 14, 2, 1); r('#8fd35a', 8, 6, 2, 1); r('#6dffd0', 4, 18, 1, 1); }],
    w_ember: [14, 10, (r, g) => { g.strokeStyle = '#ff7a2a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(1, 9); g.lineTo(5, 5); g.lineTo(8, 6); g.lineTo(13, 1); g.moveTo(8, 6); g.lineTo(9, 9); g.stroke(); r('#ffd06a', 5, 5, 1, 1); r('#ffd06a', 9, 6, 1, 1); }],
    // ===== rompibles (primer plano)
    b_barrel: [14, 16, r => { r('#4a3220', 1, 0, 12, 16); r('#6a4a2a', 2, 0, 10, 16); r('#8a6a3a', 3, 1, 2, 14); r('#8a8a98', 1, 3, 12, 1); r('#8a8a98', 1, 12, 12, 1); r('#3a2616', 0, 4, 1, 8); r('#3a2616', 13, 4, 1, 8); }],
    b_crate: [14, 14, r => { r('#4a3220', 0, 0, 14, 14); r('#7a5a30', 1, 1, 12, 12); for (let i = 0; i < 10; i++) { r('#5a3a1e', 2 + i, 2 + i, 1, 1); r('#5a3a1e', 11 - i, 2 + i, 1, 1); } }],
    b_vase: [10, 14, (r, g) => { g.fillStyle = '#c8784a'; g.beginPath(); g.ellipse(5, 9, 4, 5, 0, 0, 6.3); g.fill(); r('#c8784a', 3, 1, 4, 4); r('#a85a30', 2, 0, 6, 1); r('#ffd98a', 2, 8, 6, 1); r('#e8a070', 3, 6, 1, 4); }],
    b_urn: [10, 14, (r, g) => { g.fillStyle = '#d8b040'; g.beginPath(); g.ellipse(5, 9, 4, 5, 0, 0, 6.3); g.fill(); r('#d8b040', 3, 2, 4, 3); r('#f0d070', 2, 0, 6, 2); r('#a88020', 0, 6, 1, 3); r('#a88020', 9, 6, 1, 3); r('#fff2b0', 3, 7, 1, 4); r('#a88020', 3, 11, 4, 1); }],
    b_books: [12, 10, r => { r('#8a2a2a', 0, 6, 12, 3); r('#e8e0c8', 1, 7, 10, 1); r('#2a5a8a', 1, 3, 10, 3); r('#e8e0c8', 2, 4, 8, 1); r('#3a7a3a', 2, 0, 8, 3); r('#e8e0c8', 3, 1, 6, 1); }],
    b_pot: [10, 12, r => { r('#c8784a', 0, 5, 10, 2); r('#a85a30', 1, 7, 8, 5); r('#4aa83a', 2, 0, 2, 5); r('#4aa83a', 6, 1, 2, 4); r('#4aa83a', 4, 2, 2, 3); r('#f08ac8', 4, 0, 2, 2); }],
    b_jar: [10, 14, (r, g) => { g.fillStyle = '#7a5a34'; g.beginPath(); g.ellipse(5, 9, 4, 5, 0, 0, 6.3); g.fill(); r('#7a5a34', 3, 1, 4, 4); r('#5a3a1e', 2, 0, 6, 2); r('#5a3a1e', 1, 8, 8, 1); r('#9a7a4a', 3, 6, 1, 4); }],
    b_gearbox: [14, 12, (r, g) => { r('#4a4a56', 0, 2, 14, 10); r('#6a6a78', 1, 3, 12, 8); circle(g, 7, 7, 3, '#c8a850'); r('#2a2418', 6, 6, 2, 2); r('#c8a850', 6, 3, 2, 1); r('#c8a850', 6, 11, 2, 1); r('#8a8a98', 1, 3, 1, 1); r('#8a8a98', 12, 3, 1, 1); }],
    b_rock: [14, 12, (r, g) => { g.fillStyle = '#7a6a5a'; g.beginPath(); g.moveTo(0, 12); g.lineTo(2, 4); g.lineTo(6, 0); g.lineTo(11, 2); g.lineTo(14, 12); g.fill(); g.fillStyle = '#9a8a7a'; g.fillRect(4, 2, 3, 2); g.strokeStyle = '#ff7a2a'; g.lineWidth = 1; g.beginPath(); g.moveTo(7, 3); g.lineTo(6, 7); g.lineTo(9, 10); g.stroke(); r('#3a2a20', 3, 8, 3, 1); }],
    b_censer: [10, 14, (r, g) => { r('#b8a860', 4, 0, 2, 4); g.fillStyle = '#d8b040'; g.beginPath(); g.arc(5, 8, 4, 0, Math.PI); g.fill(); r('#d8b040', 1, 7, 8, 1); r('#a88020', 3, 12, 4, 1); r('#8a8a98', 2, 4, 1, 3); r('#8a8a98', 7, 4, 1, 3); r('#c8c8d0', 4, 3, 2, 1); }],
    b_bucket: [10, 10, r => { r('#6a4a2a', 1, 2, 8, 8); r('#8a6a3a', 2, 3, 2, 6); r('#8a8a98', 1, 4, 8, 1); r('#8a8a98', 1, 8, 8, 1); r('#8a8a98', 2, 0, 6, 1); r('#8a8a98', 2, 0, 1, 3); r('#8a8a98', 7, 0, 1, 3); r('#3a2616', 3, 2, 4, 1); }],
    b_goblet: [8, 12, r => { r('#d8b040', 0, 0, 8, 5); r('#f0d070', 1, 1, 6, 1); r('#d8b040', 3, 5, 2, 4); r('#a88020', 1, 9, 6, 2); r('#d82a2a', 3, 2, 2, 1); }],
    b_lantern: [8, 12, r => { r('#4a4a56', 3, 0, 2, 1); r('#c8a850', 1, 2, 6, 8); r('#ffe28a', 2, 3, 4, 6); r('#4a4a56', 1, 10, 6, 2); r('#4a4a56', 1, 2, 6, 1); }],
    b_oreb: [12, 10, (r, g) => { g.fillStyle = '#6a5a50'; g.beginPath(); g.moveTo(0, 10); g.lineTo(2, 3); g.lineTo(6, 0); g.lineTo(10, 2); g.lineTo(12, 10); g.fill(); r('#ffd23b', 4, 3, 2, 2); r('#ffd23b', 7, 6, 2, 1); r('#6ad8ff', 3, 7, 2, 2); r('#8a7a6a', 5, 1, 2, 1); }],
    b_mushbox: [14, 12, r => { r('#5a4128', 0, 4, 14, 8); r('#7a5a30', 1, 5, 12, 6); r('#3a2a18', 0, 4, 14, 1); r('#6dffd0', 2, 0, 3, 4); r('#ffffff', 3, 1, 1, 1); r('#b48aff', 8, 1, 4, 3); r('#f4ecff', 9, 2, 1, 1); }],
    b_sack: [12, 12, r => { r('#a8884a', 1, 2, 10, 10); r('#c8a860', 2, 3, 3, 7); r('#6a4a2a', 3, 1, 6, 2); r('#8a6a3a', 4, 0, 4, 1); r('#8a6a3a', 1, 11, 10, 1); }],
  };
  const DEBRIS = { b_barrel: ['#6a4a2a', '#8a8a98', '#4a3220'], b_crate: ['#7a5a30', '#5a3a1e'], b_vase: ['#c8784a', '#a85a30', '#ffd98a'], b_urn: ['#d8b040', '#f0d070', '#a88020'], b_books: ['#8a2a2a', '#2a5a8a', '#e8e0c8'], b_pot: ['#a85a30', '#4aa83a', '#f08ac8'], b_jar: ['#7a5a34', '#5a3a1e'], b_gearbox: ['#6a6a78', '#c8a850', '#4a4a56'], b_rock: ['#7a6a5a', '#9a8a7a', '#ff7a2a'], b_censer: ['#d8b040', '#a88020', '#c8c8d0'], b_bucket: ['#6a4a2a', '#8a8a98'], b_goblet: ['#d8b040', '#f0d070', '#d82a2a'], b_lantern: ['#c8a850', '#ffe28a', '#4a4a56'], b_oreb: ['#6a5a50', '#ffd23b', '#6ad8ff'], b_mushbox: ['#5a4128', '#6dffd0', '#b48aff'], b_sack: ['#a8884a', '#c8a860', '#6a4a2a'] };
  const GLOW = { p_fireplace: 0xff9a3a, p_candles_floor: 0xffcf5a, p_lampost: 0xffe28a, p_crystal: 0xff9a3a, p_shroom: 0x6dffd0, p_shroom_violet: 0xb48aff, p_lavapool: 0xff7a2a, w_ember: 0xff7a2a, w_window: 0xc8a0ff, p_candel: 0xffcf5a, b_lantern: 0xffe28a };

  // ---------- catálogo propio de cada zona (índice = z del área): suelo (bg), pared (wall) y rompibles de primer plano (fg)
  const DECOR = {
    0: { // Vestíbulo y castillo: salón noble
      bg: ['p_candel', 'p_statue', 'p_table', 'p_banner', 'p_weaponrack', 'p_fireplace', 'p_grandclock', 'p_carpet'],
      wall: ['w_tapestry', 'w_painting', 'w_shield'], fg: ['b_barrel', 'b_vase', 'b_crate', 'b_sack'] },
    1: { // Biblioteca y Archivo Prohibido
      bg: ['p_shelf', 'p_lectern', 'p_table', 'p_globe', 'p_desk', 'p_ladder', 'p_scrolls', 'p_candel'],
      wall: ['w_map', 'w_painting', 'w_clockface'], fg: ['b_books', 'b_crate', 'b_vase', 'b_lantern'] },
    2: { // Capilla
      bg: ['p_pew', 'p_saint', 'p_column', 'p_altar_stone', 'p_font', 'p_confess', 'p_candles_floor', 'p_candel'],
      wall: ['w_window', 'w_cross', 'w_tapestry'], fg: ['b_urn', 'b_vase', 'b_censer', 'b_goblet'] },
    3: { // Calabozos
      bg: ['p_cage', 'p_bones', 'p_rack', 'p_stocks', 'p_ironmaiden', 'p_table', 'p_candles_floor'],
      wall: ['w_chains', 'w_bars', 'w_shield'], fg: ['b_barrel', 'b_jar', 'b_bucket', 'b_sack'] },
    4: { // Torre del Reloj
      bg: ['p_gear', 'p_pendulum', 'p_workbench', 'p_gearpile', 'p_column', 'p_grandclock'],
      wall: ['w_gearwall', 'w_clockface', 'w_gearwall'], fg: ['b_gearbox', 'b_crate', 'b_bucket'] },
    5: { // Sala Real
      bg: ['p_banner', 'p_column', 'p_statue', 'p_throne', 'p_banquet', 'p_carpet', 'p_candel', 'p_weaponrack'],
      wall: ['w_tapestry', 'w_shield', 'w_painting'], fg: ['b_urn', 'b_goblet', 'b_vase'] },
    6: { bg: ['p_cage', 'p_bones', 'p_candel'], wall: ['w_chains', 'w_bars'], fg: ['b_barrel', 'b_jar'] },
    7: { // Torres del Alba (cielo)
      bg: ['p_bench', 'p_column', 'p_saint', 'p_fountain', 'p_planter', 'p_sundial', 'p_lampost'],
      wall: ['w_sun', 'w_wings', 'w_window'], fg: ['b_pot', 'b_vase', 'b_lantern'] },
    8: { // Cueva del Abismo
      bg: ['p_stalag', 'p_crystal', 'p_bones', 'p_ore', 'p_minecart', 'p_lavapool', 'p_candles_floor'],
      wall: ['w_ember', 'w_chains', 'w_ember'], fg: ['b_rock', 'b_jar', 'b_oreb', 'b_bucket'] },
    9: { // Calabozos Profundos (musgo)
      bg: ['p_shroom', 'p_shroom_violet', 'p_roots', 'p_cage', 'p_bones', 'p_stump', 'p_bramble', 'p_stocks'],
      wall: ['w_vines', 'w_chains', 'w_vines'], fg: ['b_barrel', 'b_jar', 'b_mushbox', 'b_sack'] },
  };

  Object.assign(CastleScene.prototype, {
    buildDecor() {
      const W = this.W, tx = this.textures;
      for (const k in ART) {
        if (tx.exists(k)) continue;
        const [w, h, fn] = ART[k], c = tx.createCanvas(k, w, h), g = c.getContext('2d');
        fn((col, x, y, ww, hh) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); }, g); c.refresh();
      }
      this.decorObjs = []; this.breakables = [];
      const tileKind = (gx, gy) => { const t = this.fg.getTileAt(gx, gy); return t && t.index >= 0 ? t.index % 8 : -1; };
      W.areaList.forEach(a => {
        if (a.special) return;
        const th = DECOR[a.z] || DECOR[0], rnd = rndSeeded(a.x0 * 7 + a.y0 * 13 + 5), floorY = a.y0 + a.rh - 1;
        // "bolsa mezclada": todas las piezas de la zona salen antes de repetir ninguna, y nunca la misma dos veces seguidas
        const bag = list => { let b = [], last = null; return () => { if (!b.length) { b = list.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } } let k = b.pop(); if (k === last && b.length) { const o = b.pop(); b.push(k); k = o; } last = k; return k; }; };
        const nextBg = bag(th.bg), nextFg = bag(th.fg), nextWall = bag(th.wall);
        const groundOk = x => { const gx = a.x0 + x; return (tileKind(gx, floorY) === K.SOLID || tileKind(gx, floorY) === K.FLOOR) && tileKind(gx, floorY - 1) < 0 && tileKind(gx, floorY - 2) < 0; };
        // sitios que hay que dejar libres: hogueras, personajes, cristales, mejoras, páginas, jefes y su alrededor
        const avoid = [], torches = [];
        [W.altars, W.npcs, W.crystals, W.forges, W.pages, W.bosses, W.sforges || []].forEach(list => list.forEach(o => { if (o.area === a.id) avoid.push(Math.floor(o.x / T) - a.x0); }));
        W.torches.forEach(o => { if (o.area === a.id) torches.push(Math.floor(o.x / T) - a.x0); });
        (W.doors || []).forEach(o => { if (o.area === a.id) { const dx = Math.floor(o.x / T) - a.x0; for (let i = -4; i <= 4; i += 2) { avoid.push(dx + i); torches.push(dx + i); } } }); // la fachada de la casa
        const used = []; // tramos de suelo ocupados [desde, hasta]
        const fits = (x, half) => { for (let i = x - half; i <= x + half; i++) if (i < 3 || i > a.rw - 4 || !groundOk(i)) return false; return !avoid.some(v => Math.abs(v - x) <= half + 2) && !used.some(([d, h]) => x + half >= d - 1 && x - half <= h + 1); };
        const glowFor = (key, x, y) => { if (GLOW[key] && !LITE) { const gl = this.add.image(x, y, 'glow').setScale(1.4 + ART[key][0] / 14).setTint(GLOW[key]).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.3).setDepth(-5.4); this.decorObjs.push(gl); } };
        // decorado del suelo
        let x = 4 + Math.floor(rnd() * 4);
        while (x < a.rw - 4) {
          const key = nextBg(), half = Math.ceil(ART[key][0] * SC / T / 2);
          if (fits(x, half) && !(LITE && rnd() < 0.5)) {
            const px = (a.x0 + x + 0.5) * T, img = this.add.image(px, floorY * T, key).setOrigin(0.5, 1).setScale(SC).setDepth(-5.5).setFlipX(rnd() < 0.5 && !/clock|fireplace|ladder|confess/.test(key));
            this.decorObjs.push(img); glowFor(key, px, floorY * T - ART[key][1] * SC / 2); used.push([x - half, x + half]); x += half * 2 + 3 + Math.floor(rnd() * 5);
          } else x += 2;
        }
        // decorado de pared: colgado a media altura, donde no hay muro ni antorcha
        const wallY = floorY - 5, wallUsed = []; let wt = 0, wp = 0; const nWall = Math.max(1, Math.floor(a.rw / 22));
        while (wp < nWall && wt++ < 40) {
          const key = nextWall(), half = Math.ceil(ART[key][0] * SC / T / 2), xx = 4 + Math.floor(rnd() * (a.rw - 8));
          let ok = !torches.some(v => Math.abs(v - xx) <= half + 2) && !wallUsed.some(([d, h]) => xx + half >= d - 2 && xx - half <= h + 2);
          for (let i = xx - half; ok && i <= xx + half; i++) for (let j = -2; j <= 2; j++) if (i < 3 || i > a.rw - 4 || tileKind(a.x0 + i, wallY + j) >= 0) ok = false;
          if (!ok) continue;
          const px = (a.x0 + xx + 0.5) * T, py = (wallY + 0.5) * T, img = this.add.image(px, py, key).setScale(SC).setDepth(-7);
          this.decorObjs.push(img); glowFor(key, px, py); wallUsed.push([xx - half, xx + half]); wp++;
        }
        // rompibles en primer plano: delante del jugador, se rompen a golpes, flechas o Pisotón
        const nFg = Math.max(1, Math.floor(a.rw / 20)); let tries = 0, placed = 0;
        while (placed < nFg && tries++ < 30) {
          const key = nextFg(), half = Math.ceil(ART[key][0] * SC / T / 2), xx = 4 + Math.floor(rnd() * (a.rw - 8));
          if (!fits(xx, half)) continue;
          const spr = this.add.image((a.x0 + xx + 0.5) * T, floorY * T, key).setOrigin(0.5, 1).setScale(SC).setDepth(9).setFlipX(rnd() < 0.5);
          if (a.z === 9 && key === 'b_barrel') spr.setTint(0xa8e0a0); // barril mohoso
          const w = ART[key][0] * SC, h = ART[key][1] * SC;
          this.breakables.push({ key, spr, x: spr.x, y: spr.y - h / 2, w: w + 8, h, z: a.z, broken: false });
          used.push([xx - half, xx + half]); placed++;
        }
      });
    },
    // el suelo del trono se derrumba: lo que había encima cae al foso; la mitad se rompe y el resto queda tirado (sin animar si ya estaba roto al cargar)
    dropThroneDecor(animate) {
      const th = this.W.areas.throne; if (!th || !this.decorObjs) return;
      const fy = (th.y0 + th.rh - 1) * T, xa = (th.x0 + 2) * T, xb = (th.x0 + th.rw - 2) * T;
      const onFloor = s => s.x > xa && s.x < xb && s.y > fy - 260 && s.y <= fy + 1 && s.depth !== -7; // las piezas de pared siguen colgadas
      const items = this.decorObjs.filter(s => s.visible !== false && onFloor(s)).map(s => ({ spr: s }))
        .concat((this.breakables || []).filter(o => onFloor(o.spr)).map(o => ({ spr: o.spr, prop: o })));
      const rnd = rndSeeded(th.x0 * 3 + 11);
      items.forEach(it => {
        const s = it.spr; if (s._home) return; s._home = { x: s.x, y: s.y, angle: s.angle, visible: s.visible };
        let ly = fy + T; for (let gy = th.y0 + th.rh + 1; gy < th.y0 + th.rh + 40; gy++) if (this.solidAt(s.x, gy * T + 4)) { ly = gy * T; break; } // primer suelo bajo la pieza
        const land = s.y + (ly - fy), glow = s.texture.key === 'glow'; // todo baja lo mismo que el suelo que tenía debajo
        const breaks = !glow && rnd() < 0.5, tilt = (rnd() - 0.5) * 50;
        const done = () => {
          if (breaks) { s.setVisible(false); if (it.prop) it.prop.broken = true; this.poof(s.x, land - 10, 5, 0xbfb09a); if (animate) SFX.hit(); }
          else if (glow) s.setVisible(false); else s.setAngle(tilt);
          if (it.prop) { it.prop.x = s.x; it.prop.y = land - it.prop.h / 2; }
        };
        if (animate) this.tweens.add({ targets: s, y: land, duration: 520 + rnd() * 380, delay: rnd() * 260, ease: 'Quad.in', onComplete: done }); else { s.y = land; done(); }
      });
    },
    restoreThroneDecor() { // el suelo se reconstruye (vuelta al punto de control): todo a su sitio
      (this.decorObjs || []).concat((this.breakables || []).map(o => o.spr)).forEach(s => { if (!s._home) return; this.tweens.killTweensOf(s); s.setPosition(s._home.x, s._home.y).setAngle(s._home.angle).setVisible(s._home.visible); s._home = null; });
      (this.breakables || []).forEach(o => { if (o.spr.y !== o.y + o.h / 2) { o.x = o.spr.x; o.y = o.spr.y - o.h / 2; } });
    },
    // un golpe (espada, flecha o Pisotón) rompe los objetos que toca
    hitBreakables(cx, cy, w, h) {
      (this.breakables || []).forEach(o => { if (!o.broken && rectsOverlap(cx, cy, w, h, o.x, o.y, o.w, o.h)) this.breakProp(o); });
    },
    breakProp(o) {
      o.broken = true; o.spr.setVisible(false); SFX.hit();
      const cols = DEBRIS[o.key] || ['#8a6a3a'];
      for (let i = 0; i < (LITE ? 5 : 11); i++) {
        const sz = 4 + Math.random() * 7, d = this.add.rectangle(o.x + (Math.random() - 0.5) * o.w * 0.6, o.y + (Math.random() - 0.5) * o.h * 0.5, sz, sz * (0.6 + Math.random() * 0.6), parseInt(cols[i % cols.length].slice(1), 16)).setDepth(10);
        this.tweens.add({ targets: d, x: d.x + (Math.random() - 0.5) * 120, y: d.y + 30 + Math.random() * 40, angle: Math.random() * 360, alpha: 0, duration: 600 + Math.random() * 400, ease: 'Quad.in', onComplete: () => d.destroy() });
      }
      this.poof(o.x, o.y, 4, 0xbfb09a);
      const r = Math.random(); // a veces suelta algo
      if (r < 0.5) this.addSouls(Phaser.Math.Between(2, 4 + Math.min(6, o.z)), false, o.x, o.y - 20);
      else if (r < 0.65 && !this.dead && this.hp < this.maxHp) { this.hp = Math.min(this.maxHp, this.hp + 0.5); this.floatText(o.x, o.y - 30, '+½ ♥', '#ff8a9a'); }
    },
    resetBreakables() { (this.breakables || []).forEach(o => { if (o.broken) { o.broken = false; o.spr.setVisible(true); } }); }, // al descansar en una hoguera reaparecen
  });
})();
