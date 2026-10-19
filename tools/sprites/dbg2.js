const sharp=require('sharp'),seg=require('./seg3.js');
(async()=>{ const names=['red_m','red_f','blue_m','blue_f','green_m','green_f','purple_m','purple_f']; const parts=[];
 for(const n of names){ const r=await seg('src/'+n+'.png',n); const y0=620,y1=900,h=y1-y0;
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${r.W}" height="${h}">`;
  r.rows[3].forEach((f,i)=>{svg+=`<rect x="${f.x0}" y="${f.y0-y0}" width="${f.x1-f.x0}" height="${f.y1-f.y0}" fill="none" stroke="#f00" stroke-width="3"/><text x="${f.x0+4}" y="${f.y0-y0+24}" font-size="26" fill="#ff0">${n} ${i}</text>`;});
  svg+='</svg>';
  const base=await sharp('src/'+n+'.png').flatten({background:'#3a3a4a'}).extract({left:0,top:y0,width:r.W,height:h}).png().toBuffer();
  const ov=await sharp(Buffer.from(svg)).resize(r.W,h).png().toBuffer();
  const mg=await sharp(base).composite([{input:ov}]).png().toBuffer(); parts.push(await sharp(mg).resize(900).png().toBuffer()); }
 await sharp({create:{width:900,height:parts.length*246,channels:3,background:'#000'}}).composite(parts.map((p,i)=>({input:p,top:i*246,left:0}))).jpeg({quality:75}).toFile('dbg_att.jpg'); console.log('ok');})();
