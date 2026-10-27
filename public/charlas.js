/* Four Fangs of Dawn: charlas entre vampiros (multijugador) y pensamientos (en solitario).
   Los textos y los disparadores están en talks.js; aquí está el motor. Cada charla salta UNA sola vez por partida guardada:
   el cliente que detecta el disparador avisa al servidor ('talk'), que la guarda en progress.talks y la reenvía a todos (así dos jugadores a la vez no la duplican). */
Object.assign(CastleScene.prototype, {
  initTalks() {
    this.talkInit = true; this.talkQ = []; this.talkLine = null; this.talkWait = 0; this.talkSpotT = 0; this.talkAsked = new Set();
    this.talkSeen = new Set((this.progress && this.progress.talks) || []);
    this.talkBosses = new Set((this.progress && this.progress.bosses) || []); // jefes que ya estaban caídos al cargar: no cuentan como nuevos
    this.talkBubble = this.add.text(0, 0, '', { fontSize: fsz('13px'), fontFamily: 'Courier New', color: '#ffffff', stroke: '#000000', strokeThickness: 3, align: 'center', wordWrap: { width: 260 } }).setOrigin(0.5, 1).setDepth(29).setVisible(false);
    this.talkSub = this.add.text(SW / 2, SH - 92, '', { fontSize: fsz('14px'), fontFamily: 'Courier New', color: '#ffffff', stroke: '#000000', strokeThickness: 3, align: 'center', wordWrap: { width: SW - 160 } }).setOrigin(0.5, 1).setDepth(60).setScrollFactor(0).setVisible(false);
    if (typeof socket !== 'undefined') { const on = (ev, fn) => { socket.on(ev, fn); this.events.once('shutdown', () => socket.off(ev, fn)); this.events.once('destroy', () => socket.off(ev, fn)); }; on('talk', d => { if (d && typeof d.id === 'string') this.talkRecv(d.id); }); }
  },
  talkColors() { const s = new Set(); (room && room.players ? room.players : []).forEach(p => { if (p.animal) s.add(p.animal); }); if (this.color) s.add(this.color); return [...s]; },
  // un disparador se cumple: se avisa al servidor si la charla no se ha visto ni se ha pedido ya
  talkFire(id) {
    if (!this.talkInit) this.initTalks();
    if (typeof TALKS === 'undefined' || !TALKS[id] || this.talkSeen.has(id) || this.talkAsked.has(id)) return;
    const need = TALKS[id].needs || []; if (need.some(c => !this.talkColors().includes(c))) return; // si falta alguien imprescindible no se gasta
    this.talkAsked.add(id); socket.emit('talk', { id });
  },
  talkRecv(id) {
    if (!this.talkInit || this.talkSeen.has(id)) return;
    this.talkSeen.add(id); if (this.progress) { this.progress.talks = this.progress.talks || []; if (!this.progress.talks.includes(id)) this.progress.talks.push(id); }
    this.talkShow(id);
  },
  talkHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; },
  // arma la lista de líneas [color, texto, pensamiento?] según quién juega (7.4 de docs/ZONA2.md)
  talkShow(id) {
    const T_ = (typeof TALKS !== 'undefined' && TALKS[id]); if (!T_) return;
    const cols = this.talkColors(), lines = [], lua = this.luaOn && this.luaOn();
    if (cols.length <= 1) {
      const c = cols[0] || this.color, t = T_.solo && T_.solo[c]; if (!t) return;
      lines.push([c, t, true]); if (lua && T_.soloLua) lines.push(['lua', T_.soloLua, true]);
    } else {
      const pairOk = T_.pair && T_.pair.every(c => cols.includes(c)), npc = c => c === 'lua' || c === 'vigilia' || c === 'cadalso';
      const who = c => (c === 'A' ? cols[this.talkHash(id) % cols.length] : c === 'B' ? cols[(this.talkHash(id) + 1) % cols.length] : c); // 'A' y 'B': cualquiera de los presentes
      const src = (id === 'X02' && T_.alt && this.talkLost === 'blue') ? T_.alt : T_.lines;
      if (src && (!T_.pair || pairOk)) { // eventos de grupo (sin pareja): hablan solo los que están presentes
        src.forEach(l => { const c = who(l[0]); if (npc(c) || cols.includes(c)) lines.push([c, l[1], false]); });
      }
      if (!lines.length) {
        const g = typeof TALK_GENERIC !== 'undefined' && TALK_GENERIC; const type = (TALK_TRIGGERS.find(x => x.id === id) || {}).type, list = g && g[type];
        const a = cols[this.talkHash(id) % cols.length], b = cols[(this.talkHash(id) + 1) % cols.length];
        if (list && list.length) { const v = list[this.talkHash(id) % list.length]; (v.lines || []).forEach(l => lines.push([l[0] === 'A' ? a : l[0] === 'B' ? b : l[0], l[1], false])); }
        else { const t = T_.solo && T_.solo[a]; if (t) lines.push([a, t, true]); }
      }
      if (lua && T_.lua) T_.lua.forEach(l => lines.push([l[0], l[1], false]));
    }
    if (lines.length && this.talkQ.length < 3) this.talkQ.push({ lines, age: 0 });
  },
  talkSpeaker(c) { // dónde se dibuja la burbuja de quien habla
    if (c === this.color) return this.player;
    if (c === 'lua') return this.lua && this.lua.spr.visible ? this.lua.spr : null;
    const r = Object.values(this.remotes || {}).find(q => q.color === c); if (r) return r.spr;
    const b = [...this.ents.values()].find(e => e.type === c); return b ? b.spr : null;
  },
  talkBusy() { // no hablan mientras hay un diálogo, una tienda, una escena, un enemigo cerca o un jefe en combate
    if (this.shopOpen || this.dlg || this.bookOpen || this.travelOpen || this.imbueOpen || this.showMap || this.cut || this.dead) return true;
    if (this.sealKey) return true;
    const p = this.player; for (const e of this.ents.values()) { if (e.dead || (e.cfg && e.cfg.inv)) continue; const d = Math.hypot(e.spr.x - p.x, e.spr.y - p.y); if (e.boss ? (e.aggro && d < 400) : d < 260) return true; }
    return false;
  },
  talkUpdate(dt) {
    if (!this.talkInit) this.initTalks();
    // pasa el tiempo de las conversaciones en cola (se descartan si llevan 20 s esperando)
    this.talkQ.forEach(q => { q.age += dt; }); this.talkQ = this.talkQ.filter(q => q.age < 20);
    if (!this.talkLine && this.talkQ.length && !this.talkBusy()) {
      const q = this.talkQ[0], l = q.lines.shift(); if (!q.lines.length) this.talkQ.shift();
      const name = (typeof HERO_REALNAMES !== 'undefined' && HERO_REALNAMES[l[0]]) || ({ lua: 'Lúa', vigilia: 'Vigilia', cadalso: 'Cadalso' })[l[0]] || l[0];
      this.talkLine = { c: l[0], name, text: hintText ? hintText(l[1]) : l[1], thought: !!l[2], t: Math.min(6, Math.max(2, (1400 + 45 * l[1].length) / 1000)) };
      this.talkBubble.setText(this.talkLine.text).setColor(this.talkLine.thought ? '#cfd8ff' : '#ffffff').setFontStyle(this.talkLine.thought ? 'italic' : 'normal');
    }
    const L = this.talkLine;
    if (L) {
      L.t -= dt;
      const spr = this.talkSpeaker(L.c), cam = this.cameras.main, wv = cam.worldView;
      const seen = spr && spr.x > wv.x + 20 && spr.x < wv.x + wv.width - 20 && spr.y > wv.y + 40 && spr.y < wv.y + wv.height - 20;
      if (seen) { this.talkBubble.setVisible(true).setPosition(spr.x, spr.y - 74); this.talkSub.setVisible(false); }
      else { this.talkBubble.setVisible(false); this.talkSub.setText(L.name + ': ' + L.text).setColor(L.thought ? '#cfd8ff' : '#ffffff').setVisible(true); }
      if (L.t <= 0) { this.talkLine = null; this.talkBubble.setVisible(false); this.talkSub.setVisible(false); this.talkWait = 0.35; }
    } else if (this.talkWait > 0) this.talkWait -= dt;
    // lugares inalcanzables (tipo D): cada medio segundo se mira si se está cerca de alguno y todavía no se puede pasar
    this.talkSpotT -= dt; if (this.talkSpotT > 0 || typeof TALK_TRIGGERS === 'undefined') return; this.talkSpotT = 0.5;
    const p = this.player;
    this.ents.forEach(e => { if (e.elite && e.name && !e.dead && Math.hypot(e.spr.x - p.x, e.spr.y - p.y) < 500) this.talkOnEnemy(e.type, e.name); }); // élites con nombre (C07)
    TALK_TRIGGERS.forEach(tg => {
      if (tg.type !== 'spot' || this.talkSeen.has(tg.id) || this.talkAsked.has(tg.id)) return;
      const a = this.W.areas[tg.area]; if (!a) return;
      if (Math.hypot((a.x0 + tg.x + 0.5) * T - p.x, (a.y0 + tg.y + 0.5) * T - p.y) > (tg.r || 200)) return;
      const n = tg.need || {};
      if (n.abil && this.abil[n.abil]) return;
      if (n.gate && World.gateOpen(n.gate, this.progress.bosses || [])) return;
      this.talkFire(tg.id);
    });
  },
  // ---- ganchos
  talkOnArea(id) { if (typeof TALK_TRIGGERS !== 'undefined') TALK_TRIGGERS.forEach(t => { if (t.type === 'area' && t.area === id) this.talkFire(t.id); }); },
  talkOnEnemy(type, eliteName) { if (typeof TALK_TRIGGERS !== 'undefined') TALK_TRIGGERS.forEach(t => { if (t.type === 'enemy' && t.enemy === type && (t.eliteName ? t.eliteName === eliteName : !eliteName)) this.talkFire(t.id); }); },
  talkOnProgress(silent) { // jefes nuevos caídos
    if (!this.talkInit || typeof TALK_TRIGGERS === 'undefined') return;
    const now = this.progress.bosses || [];
    now.forEach(b => { if (this.talkBosses.has(b)) return; this.talkBosses.add(b); if (!silent) TALK_TRIGGERS.forEach(t => { if (t.type === 'boss' && (t.boss === b || t.alt === b)) this.talkFire(t.id); }); }); // alt: el otro jefe de un par (Aurora o Vesper)
    [...this.talkBosses].forEach(b => { if (!now.includes(b)) this.talkBosses.delete(b); }); // si el mundo vuelve al punto de control, los jefes pueden volver a contar
  },
  talkOnEvent(type, n) { if (typeof TALK_TRIGGERS !== 'undefined') TALK_TRIGGERS.forEach(t => { if (t.type === type && (n === undefined || t.n === undefined || t.n === n)) this.talkFire(t.id); }); }, // 'ring', 'forge'
  talkOnExtra(when) { if (typeof TALK_TRIGGERS !== 'undefined') { const t = TALK_TRIGGERS.find(x => x.type === 'extra' && x.when === when && !this.talkSeen.has(x.id) && !this.talkAsked.has(x.id)); if (t) this.talkFire(t.id); } }, // 'bonfire', 'death'
});
