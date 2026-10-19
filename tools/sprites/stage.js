const sharp = require('sharp'), removeBg = require('./bg.js'), fs = require('fs');
const D = 'C:/Users/TxaberO/Downloads/', IMG = 'C:/Users/TxaberO/AppData/Local/Temp/claude/C--Users-TxaberO-Documents-Four-Fangs-of-Dawn--claude-worktrees-project-analysis-1b81e0/382419d0-a1d2-4263-a3ff-3054e4741de9/images/';
(async () => {
  // con transparencia real
  fs.copyFileSync(D + 'Hoja de sprites del vampiro gótico.png', 'src/red_m.png');
  fs.copyFileSync(D + 'Hoja de sprites del caballero de lanza glacial.png', 'src/blue_m.png');
  fs.copyFileSync(D + 'Hoja de sprites de arquera mágica encapuchada.png', 'src/green_f.png');
  fs.copyFileSync(D + 'Hoja de sprites del arquero encapuchado.png', 'src/green_m.png');
  // violeta hombre: quitar el resplandor semitransparente
  const { data, info } = await sharp(D + 'Sprite de caballero oscuro en acción.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) if (data[i] < 110) data[i] = 0;
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile('src/purple_m.png');
  // fondo falso: blanco o cuadros
  await removeBg(D + '5958733718786609109.jpg', 'src/red_f.png');
  await removeBg(D + '5958733718786609108.jpg', 'src/blue_f.png');
  await removeBg(IMG + '12.webp', 'src/purple_f.png');
  // vista previa sobre fondo oscuro para revisar
  for (const f of fs.readdirSync('src')) await sharp('src/' + f).flatten({ background: '#3a3a4a' }).resize(512).jpeg({ quality: 80 }).toFile('src/prev_' + f.replace('.png', '.jpg'));
  console.log(fs.readdirSync('src').join(' '));
})();
