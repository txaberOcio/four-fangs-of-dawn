const sharp=require('sharp'),seg=require('./seg3.js');
(async()=>{ const n=process.argv[2]; const r=await seg('src/'+n+'.png', n);
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${r.W}" height="${r.H}">`;
 r.rows.forEach((row,k)=>row.forEach((f,i)=>{svg+=`<rect x="${f.x0}" y="${f.y0}" width="${f.x1-f.x0}" height="${f.y1-f.y0}" fill="none" stroke="${['#f00','#0f0','#08f','#ff0','#f0f','#0ff','#fa0','#fff'][k]}" stroke-width="3"/><text x="${f.x0+4}" y="${f.y0+22}" font-size="22" fill="#fff">${k}.${i}</text>`;}));
 svg+='</svg>';
 const base=await sharp('src/'+n+'.png').flatten({background:'#3a3a4a'}).png().toBuffer();
 const ov=await sharp(Buffer.from(svg)).resize(r.W,r.H).png().toBuffer();
 const merged=await sharp(base).composite([{input:ov}]).png().toBuffer();
 await sharp(merged).resize(700).jpeg({quality:80}).toFile('dbg_'+n+'.jpg'); console.log('ok');})();
