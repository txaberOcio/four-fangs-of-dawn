/* Música procedural gótica (WebAudio, sin archivos). Una pista por zona y una más intensa para los jefes. */
// Opciones del jugador (se guardan en este navegador): volumen de música y efectos, tamaño de texto, ayuda visual
const OPT = { music: 1, sfx: 1, text: 1, cb: false };
try { Object.assign(OPT, JSON.parse(localStorage.getItem('opts') || '{}')); } catch (e) { /* sin almacenamiento */ }
OPT.music = Math.min(1, Math.max(0, +OPT.music || 0)); OPT.sfx = Math.min(1, Math.max(0, +OPT.sfx || 0)); OPT.text = [1, 1.2, 1.4].includes(+OPT.text) ? +OPT.text : 1; OPT.cb = !!OPT.cb;
const saveOpts = () => { try { localStorage.setItem('opts', JSON.stringify(OPT)); } catch (e) { /* ok */ } };
const fsz = s => Math.round(parseFloat(s) * OPT.text) + 'px';
const Music = (() => {
  let ctx = null, master = null, echoIn = null, noiseBuf = null, timer = null, step = 0, nextT = 0;
  let zone = 0, bossKind = 0, boss = false, bossPending = null, started = false, muted = false;
  const VOL = 0.34;
  try { muted = localStorage.getItem('mute') === '1'; } catch (e) { /* sin almacenamiento */ }
  // raíz MIDI, tempo, timbre del colchón, extras
  const ZONES = [
    { root: 38, bpm: 70, pad: 'sawtooth' },                 // Vestíbulo (re)
    { root: 33, bpm: 62, pad: 'triangle' },                 // Biblioteca (la)
    { root: 40, bpm: 58, pad: 'square', organ: true },      // Capilla (mi)
    { root: 37, bpm: 54, pad: 'sawtooth', drone: true },    // Calabozos (do#)
    { root: 42, bpm: 84, pad: 'sawtooth', tick: true },     // Torre del Reloj (fa#)
    { root: 38, bpm: 76, pad: 'sawtooth', royal: true },    // Sala Real (re)
    { root: 38, bpm: 76, pad: 'sawtooth', royal: true },    // (roca: sin uso)
    { root: 45, bpm: 66, pad: 'triangle', organ: true },    // Torres del Alba (la)
    { root: 36, bpm: 52, pad: 'sawtooth', drone: true },    // El Abismo (do)
  ];
  const CHORDS = [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]]; // i · VI · III · VII
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const lite = () => typeof LITE !== 'undefined' && LITE;

  function init() {
    if (ctx) return true;
    ctx = typeof audioCtx === 'function' ? audioCtx() : null;
    if (!ctx) return false;
    master = ctx.createGain(); master.gain.value = muted ? 0 : VOL * OPT.music;
    const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
    echoIn = ctx.createGain();
    const delay = ctx.createDelay(1); delay.delayTime.value = 0.34; const fb = ctx.createGain(); fb.gain.value = 0.32;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
    echoIn.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(master);
    const len = ctx.sampleRate * 0.4; noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }
  function tone(freq, t, dur, type, gain, cut, send = 0.5) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = freq; f.type = 'lowpass'; f.frequency.value = cut || 1500;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + Math.min(0.09, dur * 0.3)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f); f.connect(g); g.connect(master);
    if (send && !lite()) { const s = ctx.createGain(); s.gain.value = send; g.connect(s); s.connect(echoIn); }
    o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(t, dur, gain, hp) {
    const src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    src.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp;
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master); src.start(t); src.stop(t + dur + 0.02);
  }
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.25);
  }
  function stepDur() { const z = ZONES[zone]; return 60 / (boss ? 128 : z.bpm) / 4; }

  function playStep(s16, bar, t) {
    const z = ZONES[zone], sd = stepDur(), chord = CHORDS[bar % 4], root = z.root;
    if (s16 === 0) { // colchón: acorde sostenido
      chord.forEach(n => tone(mtof(root + 12 + n), t, sd * 16 * 0.98, z.pad, z.organ ? 0.03 : 0.028, z.organ ? 900 : 650, 0.35));
      if (z.drone && bar % 2 === 0) tone(mtof(root - 12), t, sd * 32, 'sawtooth', 0.05, 260, 0.2);
      if (z.royal) tone(mtof(root + chord[0] + 24), t, sd * 6, 'square', 0.02, 1400, 0.5);
    }
    // bajo
    if (boss) { if (s16 % 2 === 0) { tone(mtof(root + chord[0]), t, sd * 1.8, 'sawtooth', 0.075, 520, 0.1); if (s16 % 4 === 0) tone(mtof(root + chord[0] + 12), t, sd * 1.6, 'square', 0.025, 900, 0.1); } if (bossKind === 1 && s16 % 8 === 6) tone(mtof(root + chord[2] + 24), t, sd * 2, 'sawtooth', 0.03, 3000, 0.5); if (bossKind === 2 && s16 % 16 === 12) noise(t, 0.3, 0.08, 800); }
    else if (s16 % 8 === 0) { tone(mtof(root + chord[0]), t, sd * 7, 'sine', 0.13, 420, 0.1); tone(mtof(root + chord[0] + 12), t, sd * 6, 'triangle', 0.05, 900, 0.1); } // la octava de arriba se oye en altavoces pequeños
    // arpegio
    if (boss) { if (!lite() || s16 % 2 === 0) tone(mtof(root + chord[(s16 >> 1) % 3] + 24), t, sd * 1.5, 'square', 0.022, 2200, 0.4); }
    else if (s16 % 2 === 0 && (!lite() || s16 % 4 === 0) && Math.random() < 0.78) tone(mtof(root + chord[(s16 / 2 + bar) % 3 | 0] + 24), t, sd * 2.6, 'triangle', 0.05, 2600, 0.6);
    // campana
    if (!boss && s16 === 8 && bar % 2 === 1) tone(mtof(root + chord[2] + 36), t, 2.4, 'sine', 0.05, 5000, 0.7);
    // percusión de jefe, tic-tac del reloj
    if (boss) { if (s16 % 4 === 0) kick(t); if (s16 % 8 === 4) noise(t, 0.12, 0.12, 1200); else if (s16 % 2 === 1 && !lite()) noise(t, 0.04, 0.05, 6000); }
    if (z.tick && !boss && s16 % 4 === 0) noise(t, 0.03, 0.06, 3500);
  }
  function schedule() {
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    while (nextT < ctx.currentTime + 0.3) {
      if (nextT < ctx.currentTime - 0.5) nextT = ctx.currentTime + 0.05;
      const s16 = step % 16, bar = Math.floor(step / 16);
      if (s16 === 0 && bossPending !== null) { boss = bossPending; bossPending = null; step = 0; }
      playStep(step % 16, Math.floor(step / 16), nextT);
      nextT += stepDur(); step++;
    }
  }
  return {
    play() {
      if (started) { if (ctx && ctx.state === 'suspended') ctx.resume(); return; }
      if (!init()) return;
      started = true; step = 0; nextT = ctx.currentTime + 0.1; timer = setInterval(schedule, 90);
    },
    stop() { if (timer) clearInterval(timer); timer = null; started = false; if (master) master.gain.value = 0; },
    setZone(z) { if (ZONES[z]) zone = z; },
    setBossKind(k) { bossKind = k || 0; },
    setBoss(b) { if (b !== boss && bossPending !== b) bossPending = b; },
    toggleMute() {
      muted = !muted; try { localStorage.setItem('mute', muted ? '1' : '0'); } catch (e) { /* ok */ }
      if (master) master.gain.value = muted ? 0 : VOL * OPT.music; return muted;
    },
    refreshVol() { if (master) master.gain.value = muted ? 0 : VOL * OPT.music; },
    isMuted: () => muted,
  };
})();
