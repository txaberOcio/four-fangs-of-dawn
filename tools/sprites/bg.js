// Quita el fondo (blanco / cuadros grises) de las hojas que no son transparentes: relleno desde los bordes con tolerancia.
const sharp = require('sharp');
module.exports = async function removeBg(src, out) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, px = (x, y) => (y * W + x) * 4;
  const isBg = (o) => { const r = data[o], g = data[o + 1], b = data[o + 2]; return r > 200 && g > 200 && b > 200 && Math.max(r, g, b) - Math.min(r, g, b) < 28; }; // casi blanco/gris claro, sin color
  const seen = new Uint8Array(W * H), stack = [];
  const push = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const i = y * W + x; if (seen[i]) return; if (!isBg(i * 4)) return; seen[i] = 1; stack.push(i); };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); } for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) { const i = stack.pop(), x = i % W, y = (i / W) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }
  // los huecos de fondo aislados (entre piernas, bajo la capa) también cuentan si son del mismo tono y grandes: segunda pasada por componentes
  const comp = new Int32Array(W * H).fill(-1); let nc = 0; const sizes = [];
  for (let s = 0; s < W * H; s++) { if (seen[s] || comp[s] >= 0 || !isBg(s * 4)) continue; const st = [s]; comp[s] = nc; let n = 0; while (st.length) { const i = st.pop(); n++; const x = i % W, y = (i / W) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const j = ny * W + nx; if (seen[j] || comp[j] >= 0 || !isBg(j * 4)) continue; comp[j] = nc; st.push(j); } } sizes.push(n); nc++; }
  for (let i = 0; i < W * H; i++) { if (seen[i] || (comp[i] >= 0 && sizes[comp[i]] > 400)) data[i * 4 + 3] = 0; }
  // borde suave: los píxeles claros pegados al fondo quitado pierden la mitad de opacidad (evita el halo blanco)
  const out2 = Buffer.from(data);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const o = px(x, y); if (data[o + 3] === 0) continue; const near = data[px(x + 1, y) + 3] === 0 || data[px(x - 1, y) + 3] === 0 || data[px(x, y + 1) + 3] === 0 || data[px(x, y - 1) + 3] === 0; if (near && data[o] > 170 && data[o + 1] > 170 && data[o + 2] > 170) out2[o + 3] = 0; }
  await sharp(out2, { raw: { width: W, height: H, channels: 4 } }).png().toFile(out);
};
