const sharp = require('sharp'), seg = require('./seg3.js'), fs = require('fs'), path = require('path');
const OUT = process.argv[2], TARGET = 56, COLS = 7;
const NAMES = ['red_m', 'red_f', 'blue_m', 'blue_f', 'green_m', 'green_f', 'purple_m', 'purple_f'];
const ANIM = ['idle', 'walk', 'air', 'attack', 'crouch', 'dash', 'hurt', 'death'];
(async () => {
  const sheets = {};
  for (const n of NAMES) {
    const r = await seg('src/' + n + '.png', n); const W = r.W, list = [];
    const idleH = r.rows[0].map(f => f.y1 - f.y0 + 1).sort((a, b) => a - b); const s = TARGET / idleH[idleH.length >> 1];
    for (const row of r.rows) for (const f of row) {
      const w = f.x1 - f.x0 + 1, h = f.y1 - f.y0 + 1, buf = Buffer.alloc(w * h * 4);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const sx = f.x0 + x, sy = f.y0 + y; if (r.own[sy * W + sx] === f.id) { const o = (sy * W + sx) * 4, d = (y * w + x) * 4; buf[d] = r.data[o]; buf[d + 1] = r.data[o + 1]; buf[d + 2] = r.data[o + 2]; buf[d + 3] = r.data[o + 3]; } }
      // ancla horizontal: media de los píxeles de la franja de los pies (18 % inferior)
      let sxm = 0, cnt = 0; for (let y = Math.floor(h * 0.82); y < h; y++) for (let x = 0; x < w; x++) if (buf[(y * w + x) * 4 + 3] > 40) { sxm += x; cnt++; }
      const ax = cnt ? sxm / cnt : w / 2;
      const nw = Math.max(1, Math.round(w * s)), nh = Math.max(1, Math.round(h * s));
      const img = await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).resize(nw, nh, { kernel: 'lanczos3' }).png().toBuffer();
      list.push({ img, w: nw, h: nh, ax: ax * s, row: f.row });
    }
    sheets[n] = list;
  }
  let hw = 0, hh = 0; for (const n of NAMES) for (const f of sheets[n]) { hw = Math.max(hw, f.ax, f.w - f.ax); hh = Math.max(hh, f.h); }
  const CW = Math.ceil(hw * 2) + 4, CH = hh + 4; fs.mkdirSync(OUT, { recursive: true });
  const meta = { cell: [CW, CH], cols: COLS, sheets: {} };
  for (const n of NAMES) {
    const L = sheets[n], rowsN = Math.ceil(L.length / COLS), comp = [], anims = {}; let i = 0;
    L.forEach((f, idx) => { comp.push({ input: f.img, left: (idx % COLS) * CW + Math.round(CW / 2 - f.ax), top: Math.floor(idx / COLS) * CH + (CH - f.h - 2) }); (anims[ANIM[f.row]] = anims[ANIM[f.row]] || [idx, idx])[1] = idx; });
    await sharp({ create: { width: COLS * CW, height: rowsN * CH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(comp).png({ compressionLevel: 9 }).toFile(path.join(OUT, n + '.png'));
    meta.sheets[n] = { frames: L.length, anims };
  }
  fs.writeFileSync(path.join(OUT, 'sprites.json'), JSON.stringify(meta));
  console.log('celda', CW, 'x', CH); for (const n of NAMES) console.log(n, JSON.stringify(meta.sheets[n].anims));
})();
