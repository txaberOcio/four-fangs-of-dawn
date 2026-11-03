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
  // ajustes de arquitectura por id de sala (encima de ARQ[z])
  const ARQ_ROOM = { mir: { win: 0 }, salon: { win: 0 }, throne: { noZoc: true }, tronos: { zoc: 'frieze' }, abs: { win: 1 }, cubil: { win: 0 }, clkC: { arch: 'truss' } };
  // piezas fijas por sala: [nombre, x local en baldosas, { flip, y }] (las 'p_' van sobre el suelo; las 'w_' colgadas a la altura y)
  const ROOM_DECOR = {
    cubil: [['p_gargoyle', 4], ['p_gargoyle', 22, { flip: true }]],
    gbib: [['p_bookgal', 12], ['p_bookgal', 30]], lect: [['p_bookgal', 14]], archivo: [['p_bookgal', 12]],
    abs: [['p_retablo', 22], ['p_gargoyle', 3]], naveP: [['p_retablo', 20]], mir: [['w_rose', 13, { y: 5 }]], salon: [['w_rose', 24, { y: 5 }]], naveS: [['p_buttress', 3]],
    throne: [['p_thronedais', 44], ['p_colbig', 3], ['p_colbig', 48]],
    dep3: [['p_desk2', 15], ['p_cabinet', 6], ['p_cabinet', 44]], dep2: [['w_covered', 8], ['w_covered', 16], ['w_covered', 26], ['w_covered', 36], ['w_covered', 46]],
    dep1: [['w_covered', 10, { y: 30 }], ['p_cabinet', 4]],
    tronos: [['p_scaffold', 46], ['p_throne', 10], ['p_throne', 68, { flip: true }], ['p_organ', 39], ['w_curtain', 4, { y: 28 }], ['w_curtain', 74, { y: 28 }]],
    pat1: [['p_scaffold', 30]], pat2: [['p_gallows', 28], ['p_scaffold', 58]], pat5: [['p_gallows', 8], ['p_gallows', 70, { flip: true }]], pat3: [['p_stake', 6], ['p_stake', 72]],
    milla: [['p_cell', 8], ['p_cell', 20], ['p_cell', 32], ['p_cell', 46]], carc: [['p_cell', 8], ['p_cell', 24]], cel: [['p_cell', 6], ['p_cell', 24], ['p_cell', 44]],
    cap: [['p_altarmil', 34], ['w_exvoto', 24], ['w_exvoto', 44], ['w_exvoto', 66]], y2: [['w_exvoto', 8], ['w_exvoto', 22], ['w_exvoto', 34], ['w_exvoto', 46]], y1: [['w_exvoto', 10], ['w_exvoto', 40]], y3: [['w_exvoto', 10]],
    desp: [['p_barrels', 14], ['p_pantry', 40], ['p_pantry', 64]], cellar: [['p_barrels', 20], ['p_barrels', 36], ['p_pantry', 50]],
    clkC: [['p_pipe', 3], ['p_pipe', 22]],
  };
  const DEBRIS = { b_barrel: ['#6a4a2a', '#8a8a98', '#4a3220'], b_crate: ['#7a5a30', '#5a3a1e'], b_vase: ['#c8784a', '#a85a30', '#ffd98a'], b_urn: ['#d8b040', '#f0d070', '#a88020'], b_books: ['#8a2a2a', '#2a5a8a', '#e8e0c8'], b_pot: ['#a85a30', '#4aa83a', '#f08ac8'], b_jar: ['#7a5a34', '#5a3a1e'], b_gearbox: ['#6a6a78', '#c8a850', '#4a4a56'], b_rock: ['#7a6a5a', '#9a8a7a', '#ff7a2a'], b_censer: ['#d8b040', '#a88020', '#c8c8d0'], b_bucket: ['#6a4a2a', '#8a8a98'], b_goblet: ['#d8b040', '#f0d070', '#d82a2a'], b_lantern: ['#c8a850', '#ffe28a', '#4a4a56'], b_oreb: ['#6a5a50', '#ffd23b', '#6ad8ff'], b_mushbox: ['#5a4128', '#6dffd0', '#b48aff'], b_sack: ['#a8884a', '#c8a860', '#6a4a2a'] };
  const GLOW = { p_fireplace: 0xff9a3a, p_candles_floor: 0xffcf5a, p_lampost: 0xffe28a, p_crystal: 0xff9a3a, p_shroom: 0x6dffd0, p_shroom_violet: 0xb48aff, p_lavapool: 0xff7a2a, w_ember: 0xff7a2a, w_window: 0xc8a0ff, p_candel: 0xffcf5a, b_lantern: 0xffe28a };

  // =====================================================================================================
  // ARQUITECTURA: arcos, cornisas, zócalos, vigas, vidrieras y lámparas colgantes. Todo va DETRÁS de las baldosas (profundidad < -5),
  // así que nunca tapa suelo, plataformas, puertas ni objetos. Se dibuja a escala 2 (1 px = 2 px de pantalla, como las baldosas: 16 px = 1 baldosa).
  // Los colores salen de ZONE_PAL mezclados con el fondo para que el decorado quede un tono por debajo de lo jugable.
  // =====================================================================================================
  const ASC = 2;
  const hexRGB = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const mixc = (a, b, t) => { const A = hexRGB(a), B = hexRGB(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  // vidrieras: tres tonos por zona (se mezclan con el fondo al usarlos)
  const GLASS = { 0: ['#c8402a', '#d8b040', '#2a5ac8'], 1: ['#d8a040', '#c8702a', '#9a6a2a'], 2: ['#2a5ac8', '#8a3ac8', '#3a9a9a'], 3: ['#3a7a5a', '#6a9a4a', '#2a4a5a'], 4: ['#d8b040', '#c8802a', '#8a6a2a'],
    5: ['#c82a3a', '#d8b040', '#8a1a3a'], 6: ['#6a5a9a', '#4a4a7a', '#8a7ab0'], 7: ['#f0a0b8', '#ffd890', '#a0b8f0'], 8: ['#d86a2a', '#a84a1a', '#ffb347'], 9: ['#3aa88a', '#6dffd0', '#b48aff'],
    10: ['#c8802a', '#d8a050', '#8a5a2a'], 11: ['#8a4ac8', '#c8a0f0', '#4a3a8a'], 12: ['#c8503a', '#d89050', '#8a3a2a'], 13: ['#3a7ac8', '#8ad8ff', '#2a4a8a'], 14: ['#4a9a6a', '#b8d8a0', '#2a6a4a'], 15: ['#c82a4a', '#ff7a9a', '#6a1a3a'] };
  const APAL = {};
  const apal = z => APAL[z] || (APAL[z] = (() => {
    const p = ZONE_PAL[z] || ZONE_PAL[0], m = (c, t) => mixc(p.bg, c, t);
    return { st: m(p.base, 0.42), hi: m(p.light, 0.54), sh: mixc(p.bgd, p.bg, 0.5), dk: p.bgd, bg: p.bg, bgd: p.bgd,
      wd: m('#7a5a34', 0.5), wh: m('#a88050', 0.5), wk: m('#3a2616', 0.6), ir: m('#8a8a98', 0.38), irh: m('#b0b0c0', 0.46), rv: m('#d8c890', 0.4),
      gl: (GLASS[z] || GLASS[0]).map(c => m(c, 0.34)), glow: parseInt(p.glow.slice(1), 16), cl: m(GLASS[z] ? GLASS[z][0] : '#8a2a3a', 0.55), cl2: m(GLASS[z] ? GLASS[z][1] : '#d8b040', 0.5) };
  })());
  // estilo arquitectónico de cada zona (z = del área): tipo de arco, ventanas, cornisa, zócalo y lámpara colgante
  const ARQ = {
    0: { arch: 'pointed', win: 0.4, corn: 'stone', zoc: 'stone', hang: 'chand', ban: 1, garg: 1 },   // castillo: arcos apuntados, estandartes y arañas
    1: { arch: 'round', win: 0.35, corn: 'wood', zoc: 'wood', hang: 'wheel' },               // biblioteca: medio punto, madera y rueda de velas
    2: { arch: 'pointed', win: 0.85, corn: 'stone', zoc: 'stone', hang: 'chand', garg: 1 },           // capilla: ojivas con vidrieras
    3: { arch: 'round', win: 0, corn: 'stone', zoc: 'stone', hang: 'lantern' },              // calabozos: bóvedas bajas y faroles de hierro
    4: { arch: 'truss', corn: 'iron', zoc: 'iron', hang: 'pulley', pipe: 1 },                         // torre del reloj: celosías de hierro y poleas
    5: { arch: 'pointed', win: 0.5, corn: 'stone', zoc: 'stone', hang: 'chand', ban: 1 },    // sala real: ojivas altas, rojo y oro
    6: { corn: 'rock', scatter: ['stal0', 'stal1'] },
    7: { arch: 'round', win: 0.6, corn: 'stone', zoc: 'stone', hang: 'lantern', ban: 1 },    // torres del alba: arcos esbeltos abiertos al cielo
    8: { corn: 'rock', scatter: ['stal0', 'stal1', 'stal2', 'stal1'] },                                                           // cueva del abismo: estalactitas y entibado de madera
    9: { arch: 'round', win: 0, corn: 'moss', hang: 'roots', scatter: ['roots', 'stal0', 'roots'], ruin: 1 },                      // calabozos profundos: arcos en ruinas con raíces
    10: { arch: 'cercha', corn: 'wood', zoc: 'wood', hang: 'cage' },                         // patíbulo exterior: madera, cadalso y jaulas
    11: { arch: 'round', win: 0.3, corn: 'stone', zoc: 'wood', hang: 'wheel' },              // funcionarios: oficina de piedra y madera
    12: { arch: 'round', win: 0.2, corn: 'stone', zoc: 'stone', hang: 'lantern', ban: 1 },   // capilla del cuartel: austera, militar
    13: { arch: 'round', win: 0.25, corn: 'stone', zoc: 'stone', hang: 'lantern' },          // milla verde / cárceles
    14: { arch: 'cercha', corn: 'wood', zoc: 'wood', hang: 'hooks' },                        // despensa: vigas y ganchos de carne
    15: { arch: 'pointed', win: 0.5, corn: 'stone', zoc: 'stone', hang: 'chand', ban: 1 },   // los tronos: ojivas teatrales
  };
  // pinta un lienzo nuevo (si la textura no existe) con fn(g, px) donde px(color, x, y, w, h)
  const mk = (tx, key, w, h, fn) => {
    if (tx.exists(key)) return key;
    const c = tx.createCanvas(key, w, h), g = c.getContext('2d');
    fn(g, (col, x, y, ww, hh) => { g.fillStyle = col; g.fillRect(x, y, ww === undefined ? 1 : ww, hh === undefined ? 1 : hh); }); c.refresh(); return key;
  };
  const line = (px, col, x0, y0, x1, y1, t) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) px(col, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), t, t); };
  // ¿(x,y) cae dentro de un arco (de medio punto si la altura es la mitad del ancho; apuntado si es mayor)? cy = línea de arranque
  const inArch = (x, y, x0, w, h, cy) => {
    if (y >= cy) return x >= x0 && x < x0 + w;
    const r = (w * w / 4 + h * h) / w, dy = y - cy, d1 = x - (x0 + r), d2 = x - (x0 + w - r);
    return d1 * d1 + dy * dy < r * r && d2 * d2 + dy * dy < r * r;
  };
  const u32 = (hex, a) => { const c = hexRGB(hex); return ((a === undefined ? 255 : a) << 24 | c[2] << 16 | c[1] << 8 | c[0]) >>> 0; };
  // arco entre dos pilares: aro de dovelas, albanega oscura, nicho (o vidriera de plomo) y capiteles. Un solo dibujo por (zona, ancho, estilo, vidriera)
  const archTex = (tx, z, wt, style, win, ruin) => {
    const key = `ar_${z}_${wt}_${style}_${win ? 1 : 0}${ruin ? 'r' : ''}`; if (tx.exists(key)) return key;
    const P = apal(z), W = wt * 16, rise = Math.round(style === 'round' ? W / 2 : W * 0.66), th = 5, cap = 6, wh = win ? 46 : 0, H = rise + Math.max(cap, wh);
    const c = tx.createCanvas(key, W, H), g = c.getContext('2d'), img = g.createImageData(W, H), d = new Uint32Array(img.data.buffer);
    const cSt = u32(P.st), cSt2 = u32(mixc(P.st, P.hi, 0.35)), cHi = u32(P.hi), cSh = u32(P.sh), cSpan = u32(P.sh, 150), cRec = u32(mixc(P.bgd, P.bg, 0.55)), cRec2 = u32(mixc(P.bgd, P.bg, 0.3)), cLead = u32(P.dk), cil = P.gl.map(q => u32(mixc(q, P.gl[0], 0.3))), cilL = P.gl.map(q => u32(mixc(q, '#ffffff', 0.12)));
    const cy = rise, iw = W - th * 2, ih = rise - th;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const out = inArch(x, y, 0, W, rise, cy), inn = inArch(x, y, th, iw, ih, cy) && (y < cy || (x >= th && x < W - th));
      let col = 0;
      if (y < cy) {
        if (!out) col = cSpan;
        else if (!inn) { // dovela: alterna tono por ángulo; borde exterior claro, borde interior en sombra
          const ang = Math.atan2(y - cy, x - W / 2), edgeOut = !inArch(x, y - 1, 0, W, rise, cy) || !inArch(x - 1, y, 0, W, rise, cy) || !inArch(x + 1, y, 0, W, rise, cy);
          col = Math.floor(ang * 9 / Math.PI + 20) % 2 ? cSt : cSt2; if (edgeOut) col = cHi; else if (inArch(x, y + 1, th, iw, ih, cy) || inArch(x - 1, y, th, iw, ih, cy) || inArch(x + 1, y, th, iw, ih, cy)) col = cSh;
          if (ruin && ((x * 7 + y * 13) % 29 === 0 || (y < 6 && x > W * 0.55 && x < W * 0.7))) col = 0; // aro desportillado
        } else col = win ? 1 : (y * 3 < rise ? cRec2 : cRec);
      } else if (win && y < cy + wh) { if (x < th || x >= W - th) col = cSt; else col = 1; }
      else if (y >= cy && y < cy + cap) { if (x < th + 3 || x >= W - th - 3) col = y === cy ? cHi : (y === cy + cap - 1 ? cSh : cSt); else if (!win) col = cRec; }
      else if (!win && y >= cy + cap) col = 0;
      if (col === 1) { // vidriera: paños rectangulares de vidrio con plomo, cenefa y parteluz central
        const yy = y - 4, ga = Math.floor(x / 5), gb = Math.floor(yy / 7), cell = (ga * 2 + gb * 5 + ((ga ^ gb) & 1)) % 3, lead = x % 5 === 0 || yy % 7 === 0 || Math.abs(x - W / 2) < 1 || y >= cy + wh - 2 || x === th || x === W - th - 1;
        col = lead ? (y >= cy + wh - 2 ? cHi : cLead) : ((x + y) % 9 === 0 ? cilL[cell] : cil[cell]);
      }
      d[y * W + x] = col;
    }
    g.putImageData(img, 0, 0); c.refresh(); return key;
  };
  // cercha de madera (poste y tornapuntas) o celosía de hierro entre dos pilares: la viga cuelga justo bajo el techo
  const trussTex = (tx, z, wt, style) => mk(tx, `tr_${z}_${wt}_${style}`, wt * 16, style === 'truss' ? 34 : Math.round(wt * 16 * 0.32), (g, px) => {
    const P = apal(z), W = wt * 16, iron = style === 'truss', c1 = iron ? P.ir : P.wd, c2 = iron ? P.irh : P.wh, c3 = iron ? P.dk : P.wk, H = iron ? 34 : Math.round(W * 0.32);
    if (iron) { // viga de celosía: cordón superior e inferior con diagonales y remaches
      px(c1, 0, 0, W, 4); px(c2, 0, 0, W, 1); px(c1, 0, H - 4, W, 4); px(c3, 0, H - 1, W, 1);
      for (let x = 0; x < W - 8; x += 16) { line(px, c1, x, 4, x + 8, H - 4, 2); line(px, c1, x + 16, 4, x + 8, H - 4, 2); }
      for (let x = 4; x < W; x += 16) { px(c2, x, 1, 1, 1); px(c2, x, H - 3, 1, 1); }
    } else { // cercha de par e hilera: tirante abajo, dos pares hasta el vértice, poste central y tornapuntas
      const mid = W / 2; px(c1, 0, H - 5, W, 5); px(c2, 0, H - 5, W, 1); px(c3, 0, H - 1, W, 1);
      line(px, c1, 0, H - 5, mid, 2, 3); line(px, c1, W, H - 5, mid, 2, 3); px(c1, mid - 1, 2, 3, H - 6); px(c2, mid - 1, 3, 1, H - 8);
      line(px, c1, mid, H - 6, mid - W * 0.28, H - 6 - H * 0.3, 2); line(px, c1, mid, H - 6, mid + W * 0.28, H - 6 - H * 0.3, 2); px(c3, mid - 2, 0, 5, 3); px(c2, mid - 2, 0, 5, 1);
    }
  });
  // franjas que se repiten a lo largo del techo (cornisa) y del suelo (zócalo): una sola textura por zona y estilo, una sola pieza por tramo
  const cornTex = (tx, z, style) => {
    const P = apal(z), H = style === 'rock' || style === 'moss' ? 30 : (style === 'pipe' ? 9 : 10); return mk(tx, `co_${z}_${style}`, style === 'rock' || style === 'moss' ? 32 : 16, H, (g, px) => {
      if (style === 'stone') { px(P.hi, 0, 0, 16, 1); px(P.st, 0, 1, 16, 3); px(P.sh, 0, 4, 16, 1); for (let x = 0; x < 16; x += 4) { px(P.st, x, 5, 3, 2); px(P.sh, x + 3, 5, 1, 2); } px(P.sh, 0, 7, 16, 1); px('rgba(0,0,0,0.28)', 0, 8, 16, 1); px('rgba(0,0,0,0.14)', 0, 9, 16, 1); }
      else if (style === 'wood') { px(P.wh, 0, 0, 16, 1); px(P.wd, 0, 1, 16, 5); px(P.wk, 0, 6, 16, 1); px(P.wh, 7, 2, 2, 1); px('rgba(0,0,0,0.3)', 0, 7, 16, 2); px(P.wk, 0, 9, 16, 1); }
      else if (style === 'iron') { px(P.ir, 0, 0, 16, 5); px(P.irh, 0, 0, 16, 1); px(P.dk, 0, 5, 16, 1); px(P.irh, 3, 2, 2, 2); px(P.irh, 11, 2, 2, 2); px('rgba(0,0,0,0.3)', 0, 6, 16, 3); px('rgba(0,0,0,0.12)', 0, 9, 16, 1); }
      else if (style === 'pipe') { px(P.ir, 0, 1, 16, 5); px(P.irh, 0, 1, 16, 1); px(P.dk, 0, 6, 16, 1); px(P.irh, 6, 0, 3, 8); px(P.dk, 6, 7, 3, 1); px(P.ir, 7, 2, 1, 4); px('rgba(0,0,0,0.22)', 0, 7, 16, 2); }
      else { // roca (o roca con musgo): flecos de estalactitas de distinto largo
        px(P.sh, 0, 0, 32, 3); const rn = rndSeeded(z * 17 + 3);
        for (let x = 0; x < 32; x += 4) { const len = 5 + Math.floor(rn() * 22) * (x % 8 === 0 ? 1 : 0.55), w = 4; for (let i = 0; i < len; i++) { const ww = Math.max(1, Math.round(w * (1 - i / len))); px(i < 2 ? P.hi : (x % 8 ? P.st : P.sh), x + Math.floor((w - ww) / 2), 3 + i, ww, 1); } }
        if (style === 'moss') { const mp = ZONE_PAL[z]; for (let x = 1; x < 32; x += 3) { px(mixc(P.bg, mp.mossD || '#2a5428', 0.8), x, 2, 2, 2 + (x % 5)); } px(mixc(P.bg, mp.moss || '#3f7a3a', 0.8), 0, 0, 32, 2); px(mixc(P.bg, mp.fung || '#6dffd0', 0.7), 9, 6, 1, 1); px(mixc(P.bg, mp.fung2 || '#b48aff', 0.7), 22, 8, 1, 1); }
      }
    });
  };
  const zocTex = (tx, z, style) => {
    const P = apal(z); return mk(tx, `zo_${z}_${style}`, 16, 10, (g, px) => {
      if (style === 'stone') { px(P.hi, 0, 0, 16, 1); px(P.st, 0, 1, 16, 8); px(P.sh, 0, 9, 16, 1); px(P.sh, 0, 1, 1, 8); px(P.hi, 1, 2, 6, 1); px(P.sh, 1, 7, 6, 1); px(P.sh, 8, 2, 7, 1); px(P.hi, 9, 8, 6, 1); px('rgba(0,0,0,0.18)', 0, 4, 16, 3); }
      else if (style === 'wood') { px(P.wh, 0, 0, 16, 1); px(P.wd, 0, 1, 16, 9); for (let x = 0; x < 16; x += 4) { px(P.wk, x, 2, 1, 8); px(P.wh, x + 2, 3, 1, 3); } px(P.wk, 0, 9, 16, 1); px(P.wk, 0, 5, 16, 1); }
      else if (style === 'frieze') { px(P.sh, 0, 0, 16, 10); px(P.hi, 0, 0, 16, 1); px(P.st, 0, 1, 16, 1); px(P.rv, 0, 3, 16, 1); px(P.rv, 0, 8, 16, 1); for (let x = 0; x < 16; x += 8) { px(P.cl, x + 1, 4, 6, 4); px(P.cl2, x + 3, 5, 2, 2); px(P.rv, x + 4, 5, 1, 1); } }
      else { px(P.ir, 0, 0, 16, 2); px(P.irh, 0, 0, 16, 1); px(P.dk, 0, 2, 16, 8); for (let x = 0; x < 16; x += 4) px(P.ir, x, 3, 1, 6); px(P.ir, 0, 5, 16, 1); px(P.irh, 2, 1, 1, 1); px(P.irh, 10, 1, 1, 1); }
    });
  };
  // piezas colgantes del techo: [ancho, alto, dibujo]; el texto del arriba indica de qué lámpara se trata
  const HANG = {
    chand: (P, px) => { px(P.ir, 15, 0, 2, 12); px(P.rv, 6, 12, 20, 2); px(P.rv, 4, 14, 3, 2); px(P.rv, 25, 14, 3, 2); px(P.ir, 10, 14, 12, 3); px(P.rv, 14, 17, 4, 5); [4, 15, 26].forEach(x => { px('#e8e0c8', x, 8, 2, 6); px('#ffcf5a', x, 5, 2, 3); px('#fff2b0', x, 5, 1, 1); }); [9, 21].forEach(x => { px('#e8e0c8', x, 10, 2, 4); px('#ffcf5a', x, 7, 2, 3); }); },
    wheel: (P, px) => { px(P.ir, 15, 0, 2, 9); px(P.wd, 2, 9, 28, 3); px(P.wh, 2, 9, 28, 1); px(P.wk, 2, 12, 28, 1); px(P.wd, 14, 12, 4, 4); [3, 11, 19, 27].forEach(x => { px('#e8e0c8', x, 5, 2, 4); px('#ffcf5a', x, 2, 2, 3); }); },
    lantern: (P, px) => { px(P.ir, 7, 0, 2, 10); px(P.irh, 3, 10, 10, 2); px(P.ir, 3, 12, 10, 12); px('#ffcf5a', 5, 14, 6, 8); px('#fff2b0', 7, 16, 2, 4); px(P.dk, 8, 14, 1, 8); px(P.irh, 3, 24, 10, 2); px(P.ir, 6, 26, 4, 2); },
    pulley: (P, px) => { px(P.ir, 11, 0, 2, 20); px(P.irh, 6, 20, 12, 2); px(P.ir, 8, 22, 8, 14); px(P.dk, 10, 25, 4, 8); px(P.irh, 9, 22, 1, 12); px(P.ir, 5, 3, 14, 3); px(P.irh, 5, 3, 14, 1); },
    cage: (P, px) => { px(P.ir, 10, 0, 2, 16); px(P.ir, 4, 16, 14, 2); px(P.ir, 4, 40, 14, 2); [4, 8, 12, 16].forEach(x => px(P.ir, x, 16, 2, 26)); px('#6a6a60', 8, 33, 6, 7); px('#8a8a78', 9, 30, 4, 4); px(P.dk, 10, 31, 1, 1); },
    hooks: (P, px) => { px(P.ir, 0, 0, 40, 3); px(P.irh, 0, 0, 40, 1); [6, 20, 34].forEach((x, i) => { px(P.ir, x, 3, 1, 6); px(P.irh, x - 1, 9, 3, 1); px(P.irh, x - 1, 10, 1, 3); px(P.irh, x, 12, 2, 1); const c = ['#8a3a3a', '#a85a4a', '#6a2a2a'][i]; px(c, x - 3, 12, 8, 10); px('#c87a6a', x - 2, 13, 2, 4); px(P.wk, x + 1, 18, 3, 4); }); },
    roots: (P, px) => { const mp = ZONE_PAL[9]; px(mixc(P.bg, mp.root, 0.8), 10, 0, 3, 16); px(mixc(P.bg, mp.root, 0.8), 14, 0, 2, 26); px(mixc(P.bg, mp.rootL, 0.7), 10, 0, 1, 14); px(mixc(P.bg, mp.root, 0.8), 6, 0, 2, 10); px(mixc(P.bg, mp.root, 0.8), 18, 0, 2, 12); px(mixc(P.bg, mp.mossD, 0.8), 14, 8, 1, 14); px(mixc(P.bg, mp.mossL, 0.7), 11, 12, 2, 1); px(mixc(P.bg, mp.mossL, 0.7), 16, 20, 2, 1); px(mixc(P.bg, mp.fung, 0.8), 15, 26, 1, 1); px(mixc(P.bg, mp.mossD, 0.8), 6, 8, 1, 6); },
  };
  // estalactita: triángulo de roca con el lado izquierdo iluminado y gotas de agua en la punta
  const stal = (w, h) => (P, px) => { for (let i = 0; i < h; i++) { const ww = Math.max(1, Math.round(w * Math.pow(1 - i / h, 1.15))), x0 = Math.floor((w - ww) / 2); px(P.st, x0, i, ww, 1); px(P.hi, x0, i, Math.ceil(ww * 0.4), 1); px(P.sh, x0 + ww - Math.ceil(ww * 0.3), i, Math.ceil(ww * 0.3), 1); if (i % 5 === 0 && ww > 4) px(P.sh, x0 + ww - 2, i, 1, 1); } px(P.hi, Math.floor(w / 2), h - 1, 1, 1); };
  HANG.stal0 = stal(16, 34); HANG.stal1 = stal(22, 58); HANG.stal2 = stal(28, 86);
  const HANG_SIZE = { stal0: [16, 34], stal1: [22, 58], stal2: [28, 86], chand: [32, 24], wheel: [32, 16], lantern: [16, 28], pulley: [24, 36], cage: [22, 42], hooks: [40, 23], roots: [26, 28] };
  const hangTex = (tx, z, kind) => mk(tx, `hg_${z}_${kind}`, HANG_SIZE[kind][0], HANG_SIZE[kind][1], (g, px) => HANG[kind](apal(z), px));
  // estandarte colgado entre dos columnas: tela de la zona con una cenefa y un emblema; remate en cola de golondrina
  const bannerTex = (tx, z, h) => mk(tx, `bn_${z}_${h}`, 24, h, (g, px) => {
    const P = apal(z); px(P.ir, 1, 0, 22, 2); px(P.irh, 1, 0, 22, 1); px(P.cl, 3, 2, 18, h - 8); px(P.cl, 3, h - 6, 8, 4); px(P.cl, 13, h - 6, 8, 4); px(P.cl, 6, h - 2, 3, 2); px(P.cl, 15, h - 2, 3, 2);
    px(P.cl2, 3, 2, 18, 1); px(P.cl2, 3, 2, 1, h - 6); px(P.cl2, 20, 2, 1, h - 6); px('rgba(0,0,0,0.22)', 11, 3, 2, h - 8); px(P.cl2, 9, 12, 6, 6); px(P.cl, 11, 14, 2, 2); px(P.cl2, 11, 7, 2, 3); px('rgba(0,0,0,0.25)', 17, 3, 3, h - 7);
  });

  // ---------- piezas nuevas con la paleta de cada zona: FACT[nombre] = z => [ancho, alto, dibujo]; la textura sale como "nombre@z" y se crea solo si la zona la usa
  const barrel = (P, r, x, y) => { r(P.wk, x, y, 12, 11); r(P.wd, x + 1, y, 10, 11); r(P.wh, x + 2, y + 1, 2, 9); r(P.ir, x, y + 2, 12, 1); r(P.ir, x, y + 8, 12, 1); r(P.wk, x, y, 12, 1); };
  const FACT = {
    p_cell: z => [26, 30, (r) => { const P = apal(z); r(P.hi, 0, 0, 26, 30); r(P.st, 1, 1, 24, 29); r('#07070c', 3, 4, 20, 26); [5, 9, 13, 17, 21].forEach(x => r(P.ir, x, 4, 1, 24)); r(P.irh, 3, 3, 20, 2); r(P.ir, 3, 14, 20, 1); r(P.wd, 6, 23, 12, 2); r(P.wk, 7, 25, 1, 3); r(P.wk, 16, 25, 1, 3); r(P.irh, 20, 6, 1, 6); r(P.irh, 19, 12, 3, 2); r(P.hi, 0, 28, 26, 2); r(P.sh, 0, 29, 26, 1); }],
    p_balust: z => [32, 12, (r) => { const P = apal(z); r(P.hi, 0, 0, 32, 1); r(P.st, 0, 1, 32, 2); for (let x = 1; x < 31; x += 4) { r(P.st, x, 3, 2, 7); r(P.hi, x, 3, 1, 7); } r(P.st, 0, 10, 32, 2); r(P.sh, 0, 11, 32, 1); }],
    p_colbig: z => [12, 48, (r) => { const P = apal(z); r(P.hi, 0, 0, 12, 2); r(P.st, 1, 2, 10, 4); r(P.sh, 1, 5, 10, 1); r(P.st, 2, 6, 8, 36); r(P.hi, 3, 6, 2, 36); r(P.sh, 8, 6, 2, 36); r(P.sh, 2, 20, 8, 1); r(P.st, 1, 42, 10, 2); r(P.hi, 0, 44, 12, 2); r(P.st, 0, 46, 12, 2); r(P.sh, 0, 47, 12, 1); }],
    p_gargoyle: z => [16, 22, (r) => { const P = apal(z); r(P.hi, 1, 17, 14, 2); r(P.st, 2, 19, 12, 3); r(P.st, 3, 8, 9, 9); r(P.hi, 3, 8, 2, 9); r(P.sh, 1, 5, 3, 9); r(P.sh, 0, 4, 2, 4); r(P.st, 10, 4, 5, 6); r(P.hi, 10, 4, 5, 1); r(P.hi, 11, 2, 1, 2); r(P.hi, 14, 2, 1, 2); r('#c8402a', 12, 6, 1, 1); r(P.sh, 12, 9, 3, 1); r(P.sh, 4, 17, 2, 2); r(P.sh, 10, 17, 2, 2); }],
    p_gallows: z => [38, 48, (r) => { const P = apal(z); r(P.wk, 0, 42, 38, 6); r(P.wd, 1, 42, 36, 5); r(P.wh, 1, 42, 36, 1); r(P.wd, 5, 4, 5, 38); r(P.wh, 5, 4, 1, 38); r(P.wd, 5, 4, 28, 4); r(P.wh, 5, 4, 28, 1); line(r, P.wd, 10, 20, 22, 7, 3); r(P.ir, 7, 12, 1, 1); r('#9a8a60', 29, 8, 1, 14); r('#9a8a60', 27, 22, 5, 1); r('#9a8a60', 27, 23, 1, 3); r('#9a8a60', 31, 23, 1, 3); r('#9a8a60', 28, 26, 3, 1); r(P.wk, 14, 36, 22, 6); r(P.wd, 14, 36, 22, 1); }],
    p_scaffold: z => [48, 22, (r) => { const P = apal(z); r(P.wh, 0, 7, 48, 1); r(P.wd, 0, 8, 48, 3); r(P.wk, 0, 11, 48, 1); [2, 20, 32, 44].forEach(x => r(P.wd, x, 12, 3, 10)); line(r, P.wk, 5, 12, 19, 21, 2); line(r, P.wk, 35, 12, 21, 21, 2); r(P.wk, 22, 8, 8, 3); r(P.ir, 22, 7, 8, 1); r(P.wd, 40, 0, 2, 7); r(P.wd, 36, 0, 10, 2); r('#9a8a60', 37, 2, 1, 5); }],
    p_stake: z => [8, 26, (r) => { const P = apal(z); r(P.wk, 3, 6, 2, 20); r(P.wd, 3, 6, 1, 20); r(P.wk, 2, 5, 4, 2); r('#17141c', 1, 2, 6, 4); r('#17141c', 5, 0, 3, 3); r('#2a2630', 2, 2, 2, 1); r('#a88a30', 8, 1, 1, 1); r('#a88a30', 7, 1, 1, 1); r('#17141c', 0, 3, 1, 2); }],
    p_cabinet: z => [18, 28, (r) => { const P = apal(z); r(P.dk, 0, 0, 18, 28); r(P.ir, 1, 1, 16, 26); r(P.irh, 1, 1, 16, 1); for (let i = 0; i < 4; i++) { r(P.dk, 2, 3 + i * 6, 14, 1); r(P.irh, 7, 5 + i * 6, 4, 1); r(P.rv, 3, 4 + i * 6, 3, 1); } r(P.dk, 1, 27, 16, 1); }],
    p_desk2: z => [28, 18, (r) => { const P = apal(z); r(P.wh, 0, 8, 28, 1); r(P.wd, 0, 9, 28, 2); r(P.wk, 2, 11, 3, 7); r(P.wk, 23, 11, 3, 7); r(P.wd, 7, 11, 14, 4); r(P.wk, 13, 12, 2, 1); r('#cfc8a8', 3, 5, 9, 3); r('#b8b090', 4, 4, 8, 1); r(P.ir, 17, 3, 4, 3); r(P.irh, 18, 2, 2, 1); r('#a02a2a', 22, 6, 3, 2); r('#15101c', 14, 5, 2, 3); r('#cfc8a8', 13, 2, 1, 3); }],
    w_covered: z => [18, 24, (r) => { const P = apal(z); r(P.wh, 0, 0, 18, 24); r(P.wk, 1, 1, 16, 22); r('#b4b0a4', 2, 2, 14, 20); r('#8e8a7e', 5, 2, 1, 18); r('#8e8a7e', 11, 4, 1, 17); r('#8e8a7e', 14, 2, 1, 14); r('#cac6b8', 3, 3, 2, 8); for (let x = 2; x < 16; x += 4) r('#b4b0a4', x, 21, 3, 3); r(P.rv, 8, 0, 2, 1); }],
    p_altarmil: z => [24, 20, (r) => { const P = apal(z); r(P.hi, 0, 9, 24, 2); r(P.st, 1, 11, 22, 9); r(P.sh, 1, 19, 22, 1); r(P.sh, 8, 11, 1, 8); r(P.sh, 15, 11, 1, 8); r('#c8ccd8', 11, 0, 2, 11); r(P.rv, 8, 3, 8, 2); r(P.wd, 11, 7, 2, 3); r('#e8e0c8', 2, 5, 2, 4); r('#ffcf5a', 2, 3, 2, 2); r('#e8e0c8', 20, 5, 2, 4); r('#ffcf5a', 20, 3, 2, 2); }],
    w_exvoto: z => [24, 16, (r) => { const P = apal(z); [[0, 0, 8, 7], [10, 2, 6, 8], [18, 0, 6, 6], [2, 9, 6, 6], [12, 12, 8, 4]].forEach(([x, y, w, h], i) => { r(P.wh, x, y, w, h); r(P.wk, x + 1, y + 1, w - 2, h - 2); r(i % 2 ? P.cl2 : P.cl, x + 2, y + 2, Math.max(1, w - 4), Math.max(1, h - 4)); }); r('#ffcf5a', 21, 8, 1, 2); r('#e8e0c8', 21, 10, 1, 3); }],
    p_barrels: z => [30, 26, (r) => { const P = apal(z); barrel(P, r, 1, 15); barrel(P, r, 15, 15); barrel(P, r, 8, 4); r(P.wk, 0, 25, 30, 1); }],
    p_pantry: z => [24, 30, (r) => { const P = apal(z); r(P.wk, 0, 0, 24, 30); r(P.wd, 0, 0, 24, 1); r(P.wd, 0, 0, 1, 30); r(P.wd, 23, 0, 1, 30); [9, 19, 29].forEach(y => r(P.wd, 0, y, 24, 1)); const cs = P.gl; for (let row = 0; row < 3; row++) for (let i = 0; i < 5; i++) { const x = 2 + i * 4 + (row % 2), y = row * 10 + 3; r(cs[(i + row) % 3], x, y + 1, 3, 5); r(P.rv, x, y, 3, 1); r('rgba(255,255,255,0.25)', x, y + 2, 1, 3); } }],
    p_organ: z => [28, 46, (r) => { const P = apal(z); r(P.wk, 0, 34, 28, 12); r(P.wd, 1, 35, 26, 10); r(P.wh, 1, 35, 26, 1); r(P.rv, 4, 38, 20, 1); for (let x = 5; x < 24; x += 2) r(P.irh, x, 40, 1, 4); const hs = [30, 24, 18, 12, 6, 12, 18, 24, 30]; hs.forEach((h, i) => { const x = 2 + i * 3; r(P.ir, x, 34 - h, 2, h); r(P.irh, x, 34 - h, 1, h); r(P.dk, x, 34 - h + 4, 2, 2); }); }],
    w_curtain: z => [26, 36, (r) => { const P = apal(z); r(P.cl, 0, 0, 26, 36); for (let x = 2; x < 26; x += 5) { r('rgba(0,0,0,0.28)', x, 4, 2, 32); r(P.cl2, x + 2, 6, 1, 28); } r(P.cl2, 0, 0, 26, 4); r(P.dk, 0, 4, 26, 1); for (let x = 1; x < 26; x += 6) { r(P.rv, x, 4, 2, 4); r(P.rv, x, 8, 1, 2); } r('rgba(0,0,0,0.3)', 0, 33, 26, 3); }],
    p_bookgal: z => [32, 48, (r) => { const P = apal(z); r(P.wk, 0, 0, 32, 48); r(P.wd, 0, 0, 32, 2); r(P.wd, 0, 0, 2, 48); r(P.wd, 30, 0, 2, 48); r(P.wh, 0, 0, 32, 1); const cs = [P.cl, P.cl2, P.wh, P.gl[0], P.gl[1], P.wd]; [1, 13, 25, 37].forEach((y0, row) => { r(P.wd, 2, y0 + 10, 28, 1); let x = 3; for (let i = 0; x < 29; i++) { const w = 2 + ((i + row) % 2), h = 6 + ((i * 3 + row) % 3); r(cs[(i + row * 2) % 6], x, y0 + 10 - h, w, h); x += w + (i % 4 === 3 ? 1 : 0); } }); r(P.wh, 0, 23, 32, 2); r(P.wk, 0, 25, 32, 1); for (let x = 2; x < 31; x += 4) r(P.wd, x, 21, 1, 2); r(P.wd, 0, 46, 32, 2); }],
    p_retablo: z => [34, 44, (r) => { const P = apal(z); r(P.rv, 0, 12, 34, 32); r(P.wk, 2, 14, 30, 28); [[2, 18, 8, 22], [13, 8, 8, 32], [24, 18, 8, 22]].forEach(([x, y, w, h], i) => { r(P.wd, x, y, w, h); r(i === 1 ? P.cl : P.cl2, x + 1, y + 6, w - 2, h - 7); r(P.rv, x + 3, y + 2, 2, 3); r('#d8c0a0', x + 3, y + 3, 2, 2); }); r(P.rv, 13, 0, 8, 10); r(P.rv, 15, 0, 4, 6); r(P.wk, 15, 4, 4, 5); r(P.rv, 16, 3, 2, 1); r(P.sh, 0, 43, 34, 1); }],
    p_prop: z => [34, 38, (r) => { const P = apal(z); r(P.wk, 2, 4, 5, 34); r(P.wd, 3, 4, 3, 34); r(P.wk, 27, 4, 5, 34); r(P.wd, 28, 4, 3, 34); r(P.wk, 0, 0, 34, 6); r(P.wd, 0, 1, 34, 4); r(P.wh, 0, 1, 34, 1); line(r, P.wk, 7, 6, 12, 12, 2); line(r, P.wk, 27, 6, 22, 12, 2); r(P.ir, 4, 12, 1, 1); r(P.ir, 29, 12, 1, 1); }],
    w_vein: z => [16, 24, (r) => { const P = apal(z), g = mixc(P.bg, '#ffd23b', 0.55), b = mixc(P.bg, '#6ad8ff', 0.5); line(r, g, 2, 0, 10, 12, 2); line(r, g, 10, 12, 6, 23, 1); line(r, b, 12, 3, 8, 14, 1); r(g, 9, 11, 3, 2); r(b, 7, 14, 2, 2); r(mixc(P.bg, '#ffd23b', 0.8), 10, 12, 1, 1); }],
    p_tower: z => [24, 48, (r) => { const P = apal(z); r(P.hi, 2, 8, 20, 2); r(P.st, 3, 10, 18, 38); r(P.hi, 3, 10, 2, 38); r(P.sh, 17, 10, 4, 38); [2, 9, 16].forEach(x => { r(P.st, x, 2, 6, 6); r(P.hi, x, 2, 6, 1); }); r(P.dk, 10, 22, 4, 8); r(P.hi, 9, 21, 6, 1); r(P.sh, 3, 36, 18, 1); r(P.sh, 3, 24, 7, 1); r(P.sh, 12, 30, 9, 1); r(P.hi, 1, 46, 22, 2); }],
    p_pipe: z => [12, 44, (r, g) => { const P = apal(z); r(P.ir, 4, 0, 4, 44); r(P.irh, 4, 0, 1, 44); r(P.irh, 2, 8, 8, 2); r(P.irh, 2, 30, 8, 2); r(P.ir, 0, 18, 12, 4); r(P.irh, 0, 18, 12, 1); r(P.dk, 1, 17, 1, 6); r(P.dk, 10, 17, 1, 6); g.fillStyle = mixc(P.bg, '#c84a2a', 0.5); g.beginPath(); g.arc(6, 14, 2.5, 0, 6.3); g.fill(); r(P.irh, 6, 10, 1, 2); }],
    p_thronedais: z => [46, 42, (r) => { const P = apal(z); r(P.st, 0, 34, 46, 8); r(P.hi, 0, 34, 46, 1); r(P.sh, 0, 41, 46, 1); r(P.st, 5, 28, 36, 6); r(P.hi, 5, 28, 36, 1); r(P.cl, 20, 28, 6, 14); r(P.cl2, 20, 28, 6, 1); r(P.wk, 14, 6, 18, 24); r(P.rv, 13, 4, 20, 3); r(P.cl, 16, 9, 14, 17); r(P.cl2, 16, 9, 14, 1); [13, 21, 29].forEach(x => { r(P.rv, x, 0, 4, 5); r(P.rv, x + 1, 0, 2, 3); }); r(P.rv, 12, 20, 3, 10); r(P.rv, 31, 20, 3, 10); r(P.cl, 17, 22, 12, 4); }],
    // rosetón: aro de piedra con doce sectores de vidrio, tracería y ojo central (se coloca en la pared de las naves)
    w_rose: z => [42, 42, (r) => { const P = apal(z); for (let y = 0; y < 42; y++) for (let x = 0; x < 42; x++) { const dx = x - 20.5, dy = y - 20.5, d = Math.sqrt(dx * dx + dy * dy); if (d > 20.5) continue; const ang = Math.atan2(dy, dx), sec = Math.floor((ang + Math.PI) / (Math.PI / 6)); let col;
      if (d > 18) col = d > 19.6 ? P.hi : P.st; else if (d < 3) col = P.rv; else if (d < 5 || Math.abs(((ang + Math.PI) % (Math.PI / 6)) - Math.PI / 12) > Math.PI / 12 - 0.045 / Math.max(0.3, d / 10)) col = P.dk; else if (d > 15 && Math.floor(d) % 2 === 0 && sec % 2) col = P.st; else col = P.gl[(sec + (d > 10 ? 1 : 0)) % 3]; r(col, x, y, 1, 1); } }],
    // contrafuerte: pilar escalonado que se adelgaza hacia arriba, con remate inclinado
    p_buttress: z => [18, 44, (r) => { const P = apal(z); r(P.st, 2, 36, 14, 8); r(P.hi, 2, 36, 14, 1); r(P.st, 4, 22, 11, 14); r(P.hi, 4, 22, 11, 1); r(P.st, 6, 10, 9, 12); r(P.hi, 6, 10, 9, 1); r(P.hi, 7, 6, 7, 4); r(P.st, 8, 3, 5, 3); r(P.sh, 12, 22, 3, 14); r(P.sh, 13, 10, 2, 12); r(P.sh, 14, 36, 2, 8); r(P.sh, 2, 43, 14, 1); r(P.hi, 5, 28, 2, 1); r(P.sh, 7, 16, 4, 1); }],
    // gárgola asomada a un capitel
    w_garg: z => [18, 16, (r) => { const P = apal(z); r(P.hi, 0, 10, 8, 2); r(P.st, 0, 12, 8, 4); r(P.st, 4, 4, 9, 7); r(P.hi, 4, 4, 9, 1); r(P.st, 11, 2, 6, 6); r(P.hi, 12, 0, 1, 3); r(P.hi, 16, 0, 1, 3); r('#c8402a', 15, 4, 1, 1); r(P.sh, 13, 8, 5, 1); r(P.sh, 6, 11, 2, 3); r(P.sh, 1, 5, 5, 7); }],
  };
  const mkFac = (tx, n, z) => { const k = facKey(n, z); if (!tx.exists(k)) { const [w, h, fn] = ART[k], c = tx.createCanvas(k, w, h), g = c.getContext('2d'); fn((col, x, y, ww, hh) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); }, g); c.refresh(); } return k; };
  const facKey = (n, z) => { const k = n + '@' + z; if (!ART[k]) ART[k] = FACT[n](z); return k; };

  // ---------- catálogo propio de cada zona (índice = z del área): suelo (bg), pared (wall) y rompibles de primer plano (fg)
  const DECOR = {
    0: { // Vestíbulo y castillo: salón noble
      bg: ['p_candel', 'p_statue', 'p_table', 'p_banner', 'p_weaponrack', 'p_fireplace', 'p_grandclock', 'p_carpet', 'p_colbig', 'p_balust', 'p_buttress'],
      wall: ['w_tapestry', 'w_painting', 'w_shield'], fg: ['b_barrel', 'b_vase', 'b_crate', 'b_sack'] },
    1: { // Biblioteca y Archivo Prohibido
      bg: ['p_shelf', 'p_lectern', 'p_table', 'p_globe', 'p_desk', 'p_ladder', 'p_scrolls', 'p_candel', 'p_bookgal', 'p_bookgal'],
      wall: ['w_map', 'w_painting', 'w_clockface'], fg: ['b_books', 'b_crate', 'b_vase', 'b_lantern'] },
    2: { // Capilla
      bg: ['p_pew', 'p_saint', 'p_column', 'p_altar_stone', 'p_font', 'p_confess', 'p_candles_floor', 'p_candel', 'p_retablo', 'p_colbig', 'p_gargoyle', 'p_balust', 'p_buttress'],
      wall: ['w_window', 'w_cross', 'w_tapestry'], fg: ['b_urn', 'b_vase', 'b_censer', 'b_goblet'] },
    3: { // Calabozos
      bg: ['p_cage', 'p_bones', 'p_rack', 'p_stocks', 'p_ironmaiden', 'p_table', 'p_candles_floor', 'p_cell', 'p_cell'],
      wall: ['w_chains', 'w_bars', 'w_shield'], fg: ['b_barrel', 'b_jar', 'b_bucket', 'b_sack'] },
    4: { // Torre del Reloj
      bg: ['p_gear', 'p_pendulum', 'p_workbench', 'p_gearpile', 'p_column', 'p_grandclock', 'p_pipe', 'p_pipe'],
      wall: ['w_gearwall', 'w_clockface', 'w_gearwall'], fg: ['b_gearbox', 'b_crate', 'b_bucket'] },
    5: { // Sala Real
      bg: ['p_banner', 'p_column', 'p_statue', 'p_throne', 'p_banquet', 'p_carpet', 'p_candel', 'p_weaponrack', 'p_colbig', 'p_balust'],
      wall: ['w_tapestry', 'w_shield', 'w_painting'], fg: ['b_urn', 'b_goblet', 'b_vase'] },
    6: { bg: ['p_cage', 'p_bones', 'p_candel'], wall: ['w_chains', 'w_bars'], fg: ['b_barrel', 'b_jar'] },
    7: { // Torres del Alba (cielo)
      bg: ['p_bench', 'p_column', 'p_saint', 'p_fountain', 'p_planter', 'p_sundial', 'p_lampost', 'p_tower', 'p_balust', 'p_colbig', 'p_buttress'],
      wall: ['w_sun', 'w_wings', 'w_window'], fg: ['b_pot', 'b_vase', 'b_lantern'] },
    8: { // Cueva del Abismo
      bg: ['p_stalag', 'p_crystal', 'p_bones', 'p_ore', 'p_minecart', 'p_lavapool', 'p_candles_floor', 'p_prop', 'p_prop'],
      wall: ['w_ember', 'w_chains', 'w_ember', 'w_vein', 'w_vein'], fg: ['b_rock', 'b_jar', 'b_oreb', 'b_bucket'] },
    9: { // Calabozos Profundos (musgo)
      bg: ['p_shroom', 'p_shroom_violet', 'p_roots', 'p_cage', 'p_bones', 'p_stump', 'p_bramble', 'p_stocks', 'p_cell', 'p_colbig'],
      wall: ['w_vines', 'w_chains', 'w_vines'], fg: ['b_barrel', 'b_jar', 'b_mushbox', 'b_sack'] },
    10: { // Patíbulo Exterior
      bg: ['p_bones', 'p_cage', 'p_stocks', 'p_candles_floor', 'p_rack', 'p_bench', 'p_gallows', 'p_scaffold', 'p_stake', 'p_stake'],
      wall: ['w_chains', 'w_bars', 'w_shield'], fg: ['b_barrel', 'b_crate', 'b_bucket', 'b_sack'] },
    11: { // Dependencias de los Funcionarios
      bg: ['p_desk', 'p_shelf', 'p_scrolls', 'p_lectern', 'p_column', 'p_candel', 'p_cabinet', 'p_desk2', 'p_cabinet'],
      wall: ['w_painting', 'w_tapestry', 'w_map', 'w_covered', 'w_covered'], fg: ['b_books', 'b_crate', 'b_vase'] },
    12: { // Capilla del Cuartel
      bg: ['p_weaponrack', 'p_pew', 'p_altar_stone', 'p_banner', 'p_column', 'p_candel', 'p_altarmil', 'p_balust', 'p_buttress'],
      wall: ['w_cross', 'w_shield', 'w_window', 'w_exvoto', 'w_exvoto'], fg: ['b_urn', 'b_censer', 'b_barrel', 'b_crate'] },
    13: { // La Milla Verde (celdas)
      bg: ['p_cage', 'p_bones', 'p_stocks', 'p_candles_floor', 'p_ironmaiden', 'p_cell', 'p_cell', 'p_cell'],
      wall: ['w_chains', 'w_bars', 'w_vines'], fg: ['b_bucket', 'b_jar', 'b_sack'] },
    14: { // La Despensa
      bg: ['p_table', 'p_banquet', 'p_shelf', 'p_cage', 'p_stocks', 'p_candel', 'p_barrels', 'p_pantry', 'p_pantry'],
      wall: ['w_tapestry', 'w_bars', 'w_painting'], fg: ['b_jar', 'b_crate', 'b_sack', 'b_barrel', 'b_lantern'] },
    15: { // Los Tronos
      bg: ['p_throne', 'p_column', 'p_banner', 'p_candel', 'p_statue', 'p_carpet', 'p_organ', 'p_colbig', 'p_balust'],
      wall: ['w_tapestry', 'w_shield', 'w_painting', 'w_curtain', 'w_curtain'], fg: ['b_urn', 'b_goblet', 'b_vase'] },
  };

  Object.assign(CastleScene.prototype, {
    buildDecor() {
      const W = this.W, tx = this.textures;
      const mkArt = k => { // crea la textura de una pieza (una sola vez)
        if (tx.exists(k)) return k;
        const [w, h, fn] = ART[k], c = tx.createCanvas(k, w, h), g = c.getContext('2d');
        fn((col, x, y, ww, hh) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); }, g); c.refresh(); return k;
      };
      for (const k in ART) mkArt(k);
      this.decorObjs = []; this.breakables = [];
      const tileKind = (gx, gy) => { const t = this.fg.getTileAt(gx, gy); return t && t.index >= 0 ? t.index % 8 : -1; };
      W.areaList.forEach(a => {
        if (a.special || a.open) return;
        const th0 = DECOR[a.z] || DECOR[a.z === 17 ? 3 : 0], R = n => FACT[n] ? mkArt(facKey(n, a.z)) : n, th = { bg: th0.bg.map(R), wall: th0.wall.map(R), fg: th0.fg }, rnd = rndSeeded(a.x0 * 7 + a.y0 * 13 + 5), floorY = a.y0 + a.rh - 1;
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
        // piezas fijas de cada sala con carácter propio (ROOM_DECOR): se colocan antes que el reparto al azar y respetan los mismos huecos
        (ROOM_DECOR[a.id] || []).forEach(([n, fx0, o]) => {
          o = o || {}; const key = R(n); mkArt(key); const half = Math.ceil(ART[key][0] * SC / T / 2), hh = Math.ceil(ART[key][1] * SC / T / 2);
          for (const off of [0, 2, -2, 4, -4, 6, -6, 9, -9]) { // si el sitio ideal está ocupado (antorcha, personaje...) se prueba un poco más a un lado
            const fx = fx0 + off;
            if (n[0] === 'w') { // pieza de pared: colgada a la altura indicada (o a media altura)
              const yy = o.y === undefined ? a.rh - 6 : o.y; let ok = fx - half >= 3 && fx + half <= a.rw - 4 && !torches.some(v => Math.abs(v - fx) <= half + 2) && !avoid.some(v => Math.abs(v - fx) <= half + 1);
              for (let i = fx - half; ok && i <= fx + half; i++) for (let j = -hh; j <= hh; j++) if (tileKind(a.x0 + i, a.y0 + yy + j) >= 0) ok = false;
              if (ok) { this.decorObjs.push(this.add.image((a.x0 + fx + 0.5) * T, (a.y0 + yy + 0.5) * T, key).setScale(SC).setDepth(-7)); return; }
            } else if (fits(fx, half)) {
              const px = (a.x0 + fx + 0.5) * T, img = this.add.image(px, floorY * T, key).setOrigin(0.5, 1).setScale(SC).setDepth(-5.5).setFlipX(!!o.flip);
              this.decorObjs.push(img); glowFor(key, px, floorY * T - ART[key][1] * SC / 2); used.push([fx - half, fx + half]); return;
            }
          }
        });
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
        this.buildArch(a, tileKind);
      });
    },
    // arquitectura de una sala: cornisa y zócalo (tramos repetidos), arcos/cerchas entre pilares, vidrieras con su luz, lámparas y estandartes
    buildArch(a, tileKind) {
      const W = this.W, cfg0 = ARQ[a.z === 17 ? 3 : a.z], tx = this.textures, z = a.z, D = this.decorObjs; if (!cfg0 || a.interior || a.open) return;
      const cfg = ARQ_ROOM[a.id] ? Object.assign({}, cfg0, ARQ_ROOM[a.id]) : cfg0, rnd = rndSeeded(a.x0 * 11 + a.y0 * 5 + 77), P = apal(z), gx0 = a.x0 * T, gy0 = a.y0 * T;
      const blk = []; // sitios con objetos que hay que dejar libres (x, y locales en baldosas)
      [W.altars, W.npcs, W.crystals, W.forges, W.pages, W.bosses, W.sforges || [], W.gems || []].forEach(l => l.forEach(o => { if (o.area === a.id) blk.push([Math.floor(o.x / T) - a.x0, Math.floor(o.y / T) - a.y0]); }));
      const clear = (x, y, w, h) => { for (let i = x; i < x + w; i++) for (let j = y; j < y + h; j++) if (i < 1 || i > a.rw - 2 || j < 1 || j > a.rh - 2 || tileKind(a.x0 + i, a.y0 + j) >= 0) return false; return !blk.some(([bx, by]) => bx >= x - 3 && bx <= x + w + 2 && by >= y - 4 && by <= y + h + 3); };
      const put = (key, x, y, depth, ox, oy) => { const o = this.add.image(x, y, key).setOrigin(ox || 0, oy || 0).setScale(ASC).setDepth(depth); D.push(o); return o; };
      const glow = (x, y, col, sc, al, depth) => { if (LITE) return; D.push(this.add.image(x, y, 'glow').setScale(sc).setTint(col).setBlendMode(Phaser.BlendModes.ADD).setAlpha(al).setDepth(depth)); };
      const runs = ok => { const r = []; let s = -1; for (let x = 1; x <= a.rw - 1; x++) { const o = x <= a.rw - 2 && ok(x); if (o && s < 0) s = x; if (!o && s >= 0) { r.push([s, x - 1]); s = -1; } } return r; };
      // un tramo = UNA imagen (un TileSprite de Phaser sale muy caro): se compone la textura repitiendo la baldosa y se reutiliza si otro tramo mide lo mismo
      const strip = (key, h, s, e, y, depth) => { const n = e - s + 1, k2 = key + 'x' + n; mk(tx, k2, n * 16, h, g => { const src = tx.get(key).getSourceImage(); for (let x = 0; x < n * 16; x += src.width) g.drawImage(src, x, 0); }); put(k2, gx0 + s * T, y, depth); };
      const floorRow = a.rh - 1, imgH = key => tx.get(key).getSourceImage().height;
      // cornisa a lo largo del techo (solo donde el techo es sólido: los huecos de subida quedan libres)
      if (cfg.corn) { const key = cornTex(tx, z, cfg.corn), h = imgH(key); runs(x => tileKind(a.x0 + x, a.y0) >= 0).forEach(([s, e]) => strip(key, h, s, e, gy0 + T, -8)); }
      // tubería que corre bajo la cornisa (Torre del Reloj)
      if (cfg.pipe && !LITE) { const key = cornTex(tx, z, 'pipe'); runs(x => tileKind(a.x0 + x, a.y0) >= 0).forEach(([s, e]) => { if (e - s >= 6) strip(key, 9, s + 1, e - 1, gy0 + T + 22, -7.85); }); }
      // zócalo a lo largo del suelo (no sobre fosos, pinchos ni bloques)
      if (cfg.zoc && !LITE && !cfg.noZoc) { const key = zocTex(tx, z, cfg.zoc); runs(x => tileKind(a.x0 + x, a.y0 + floorRow) >= 0 && tileKind(a.x0 + x, a.y0 + floorRow - 1) < 0).forEach(([s, e]) => { if (e - s >= 2) strip(key, 10, s, e, gy0 + floorRow * T - 20, -7.9); }); }
      // arcos o cerchas entre los pilares que ya dibuja el fondo (uno cada 11 baldosas)
      if (cfg.arch && a.rw >= 22 && a.rh >= 14) {
        const cuts = [0]; for (let p = 7; p < a.rw - 1; p += 11) cuts.push(p); cuts.push(a.rw - 1);
        for (let k = 0; k < a.h; k++) for (let i = 0; i + 1 < cuts.length; i++) { // en salas altas se repite el ritmo de arcos en cada piso (los de abajo, sin vidriera ni lámpara)
          const s = cuts[i] + 1, wt = cuts[i + 1] - cuts[i] - 1; if (wt < 5) continue;
          let ok = k === 0; for (let x = s; x < s + wt && ok; x++) if (tileKind(a.x0 + x, a.y0) < 0) ok = false; // si hay un hueco en el techo (subida a otra sala) el arco se queda sin vidriera ni lámpara para no estorbar la lectura
          const beam = cfg.arch === 'truss' || cfg.arch === 'cercha';
          let win = ok && !beam && cfg.win && wt >= 8 && rnd() < cfg.win, key;
          if (beam) key = trussTex(tx, z, wt, cfg.arch);
          else {
            const rise = Math.round(cfg.arch === 'round' ? wt * 8 : wt * 16 * 0.66); if (win && blk.some(([bx, by]) => bx >= s - 1 && bx <= s + wt && by < (rise + 46) / 16 + 3)) win = false;
            key = archTex(tx, z, wt, cfg.arch, win, cfg.ruin && rnd() < 0.6);
          }
          const hpx = imgH(key) * ASC; put(key, gx0 + s * T, gy0 + (k * 18 + 1) * T, beam ? -7.8 : -8.2);
          if (win) glow(gx0 + (s + wt / 2) * T, gy0 + (k * 18 + 1) * T + hpx * 0.55, P.glow, 2.4, 0.16, -7.95);
          const cx = s + wt / 2, hang = cfg.hang;
          if (hang && ok && !win && !LITE && wt >= 9 && rnd() < 0.7) { // lámpara colgando del centro del tramo
            const hk = hangTex(tx, z, hang), hh = imgH(hk) * ASC, top = gy0 + (k * 18 + 1) * T + (beam ? hpx - 6 : 0);
            if (clear(Math.floor(cx) - 2, 1, 4, Math.ceil((hh + (beam ? hpx : 0)) / T) + 1)) { put(hk, gx0 + cx * T, top, -7.6, 0.5, 0); if (hang !== 'roots' && hang !== 'cage' && hang !== 'pulley') glow(gx0 + cx * T, top + hh * 0.6, 0xffcf5a, 1.5, 0.22, -7.5); }
          }
        }
        // gárgolas asomadas a algunos capiteles
        if (cfg.garg && !LITE) for (let i = 1; i + 1 < cuts.length; i++) if (rnd() < 0.5) { const gk = mkFac(tx, 'w_garg', z); if (clear(cuts[i], 7, 2, 2)) put(gk, gx0 + (cuts[i] + 0.5) * T, gy0 + 8 * T, -7.3, 0.2, 0.5).setFlipX(i % 2 === 0); }
        // estandartes colgados de algunos pilares
        if (cfg.ban && !LITE) for (let i = 1; i + 1 < cuts.length; i++) if (rnd() < 0.5 && clear(cuts[i] - 1, 4, 3, 7)) put(bannerTex(tx, z, 96), gx0 + (cuts[i] + 0.5) * T, gy0 + 4 * T, -7.4, 0.5, 0);
      }
      // salas sin arcos (cuevas, musgo): estalactitas o raíces sueltas colgando del techo a distancias irregulares
      if (cfg.scatter) {
        let x = 3 + Math.floor(rnd() * 4);
        while (x < a.rw - 3) {
          const kind = cfg.scatter[Math.floor(rnd() * cfg.scatter.length)], hk = hangTex(tx, z, kind), hh = imgH(hk) * ASC;
          if (tileKind(a.x0 + x, a.y0) >= 0 && !(LITE && rnd() < 0.5) && clear(x - 1, 1, 3, Math.ceil(hh / T) + 1)) put(hk, gx0 + (x + 0.5) * T, gy0 + T, -7.7, 0.5, 0);
          x += 4 + Math.floor(rnd() * 6);
        }
      }
    },
    // el suelo del trono se derrumba: lo que había encima cae al foso; la mitad se rompe y el resto queda tirado (sin animar si ya estaba roto al cargar)
    dropThroneDecor(animate) {
      const th = this.W.areas.throne; if (!th || !this.decorObjs) return;
      const fy = (th.y0 + th.rh - 1) * T, xa = (th.x0 + 2) * T, xb = (th.x0 + th.rw - 2) * T;
      const onFloor = s => s.x > xa && s.x < xb && s.y > fy - 260 && s.y <= fy + 1 && s.depth >= -6; // las piezas de pared y la arquitectura siguen colgadas
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
