const sharp = require('sharp');
const BOUND = [240, 445, 650, 870, 1045, 1215, 1375];
const EXP = [[3, 4], [6, 7], [2, 2], [4, 5], [1, 1], [2, 2], [2, 2], [5, 5]];
const THR = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.08];
// cortes manuales (x) para filas donde los efectos del arma unen fotogramas
const MANUAL = { purple_f: { 3: [195, 490, 711, 872] } };
const sm = (arr, r) => arr.map((_, i) => { let s = 0, n = 0; for (let k = -r; k <= r; k++) if (arr[i + k] !== undefined) { s += arr[i + k]; n++; } return s / n; });
// fotogramas reales de cada hoja: [reposo, caminar, salto, ataque, agachado, impulso, daño, muerte]
const COUNTS = { red_m: [3, 6, 2, 5, 1, 2, 2, 5], red_f: [4, 7, 2, 5, 1, 2, 2, 5], blue_m: [4, 6, 2, 5, 1, 2, 2, 5], blue_f: [4, 6, 2, 4, 1, 2, 2, 5], green_m: [4, 6, 2, 5, 1, 2, 2, 5], green_f: [4, 6, 2, 5, 1, 2, 2, 5], purple_m: [3, 6, 2, 5, 1, 2, 2, 5], purple_f: [4, 6, 2, 5, 1, 2, 2, 5] };
module.exports = async function segment(file, name) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, A = (x, y) => data[(y * W + x) * 4 + 3] > 40;
  const rowD = []; for (let y = 0; y < H; y++) { let c = 0; for (let x = 0; x < W; x++) if (A(x, y)) c++; rowD.push(c); }
  const rs = sm(rowD, 3);
  const cuts = BOUND.map(b => { let best = b, bv = 1e9; for (let y = b - 50; y <= b + 50; y++) if (rs[y] < bv) { bv = rs[y]; best = y; } return best; });
  const edges = [0, ...cuts, H], own = new Int16Array(W * H).fill(-1), rows = [];
  for (let k = 0; k < 8; k++) {
    const y0 = edges[k], y1 = edges[k + 1] - 1;
    const col = []; for (let x = 0; x < W; x++) { let c = 0; for (let y = y0; y <= y1; y++) if (A(x, y)) c++; col.push(c); }
    const peak = Math.max(...col), thr = peak * THR[k], smc = sm(col, 4);
    let segs = [], s = -1; for (let x = 0; x < W; x++) { if (smc[x] > thr) { if (s < 0) s = x; } else if (s >= 0) { segs.push([s, x - 1]); s = -1; } } if (s >= 0) segs.push([s, W - 1]);
    segs = segs.filter(([a, b]) => b - a > 25);
    const seg = []; for (const g of segs) { const l = seg[seg.length - 1]; if (l && g[0] - l[1] < 14) l[1] = g[1]; else seg.push([...g]); }
    const [mn, mx] = COUNTS[name] ? [COUNTS[name][k], COUNTS[name][k]] : EXP[k];
    while (seg.length > mx) { let bi = 0, bd = 1e9; for (let i = 0; i < seg.length - 1; i++) { const d = seg[i + 1][0] - seg[i][1]; if (d < bd) { bd = d; bi = i; } } seg[bi][1] = seg[bi + 1][1]; seg.splice(bi + 1, 1); }
    while (seg.length < mn) { let wi = 0, ww = 0; seg.forEach((g, i) => { if (g[1] - g[0] > ww) { ww = g[1] - g[0]; wi = i; } }); const [a, b] = seg[wi]; let cut = (a + b) >> 1, cv = 1e9; for (let x = (a + (b - a) * 0.3) | 0; x <= a + (b - a) * 0.7; x++) if (smc[x] < cv) { cv = smc[x]; cut = x; } seg.splice(wi, 1, [a, cut], [cut + 1, b]); }
    // cortes entre cuerpos vecinos: columna menos densa del hueco (si el arma toca al vecino, se corta justo antes de su cuerpo)
    let cutX = []; for (let i = 0; i < seg.length - 1; i++) { let best = seg[i][1], bv = 1e9; for (let x = seg[i][1]; x <= seg[i + 1][0]; x++) { const v = col[x] * 1 + (x - seg[i][1]) * 0.02; if (v < bv) { bv = v; best = x; } } cutX.push(best); }
    if (MANUAL[name] && MANUAL[name][k]) { cutX = MANUAL[name][k].slice(); seg.length = 0; const c = [0, ...cutX, W - 1]; for (let i = 0; i < c.length - 1; i++) seg.push([c[i] + 1, c[i + 1]]); }
    const frameOf = x => { let i = 0; while (i < cutX.length && x > cutX[i]) i++; return i; };
    // componentes conexos (8) de la banda; los que cruzan un corte se reparten píxel a píxel
    const lab = new Int32Array(W * (y1 - y0 + 1)).fill(-1); const compFrame = [];
    const idx = (x, y) => (y - y0) * W + x;
    let nc = 0;
    for (let y = y0; y <= y1; y++) for (let x = 0; x < W; x++) { if (!A(x, y) || lab[idx(x, y)] >= 0) continue; const st = [[x, y]]; lab[idx(x, y)] = nc; const px = []; while (st.length) { const [cx, cy] = st.pop(); px.push([cx, cy]); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < y0 || nx >= W || ny > y1 || lab[idx(nx, ny)] >= 0 || !A(nx, ny)) continue; lab[idx(nx, ny)] = nc; st.push([nx, ny]); } }
      const fr = new Set(px.map(([a]) => frameOf(a)));
      if (fr.size === 1 || px.length < 150) { const sx = px.reduce((s, [a]) => s + a, 0) / px.length; const f = frameOf(sx); const sg = seg[f]; if (px.length < 150 && (sx < sg[0] - 50 || sx > sg[1] + 50)) { nc++; continue; } for (const [a, b] of px) own[b * W + a] = k * 16 + f; }
      else for (const [a, b] of px) own[b * W + a] = k * 16 + frameOf(a);
      nc++; }
    const frames = seg.map((_, i) => { let x0 = 1e9, x1 = -1, yy0 = 1e9, yy1 = -1; for (let y = y0; y <= y1; y++) for (let x = 0; x < W; x++) if (own[y * W + x] === k * 16 + i) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < yy0) yy0 = y; if (y > yy1) yy1 = y; } return { x0, x1, y0: yy0, y1: yy1, row: k, idx: i, id: k * 16 + i }; });
    rows.push(frames);
  }
  return { W, H, data, rows, own };
};
if (require.main === module) (async () => { for (const n of ['red_m', 'red_f', 'blue_m', 'blue_f', 'green_m', 'green_f', 'purple_m', 'purple_f']) { const r = await module.exports('src/' + n + '.png', n); console.log(n.padEnd(9), r.rows.map(g => g.length).join(',')); } })();
