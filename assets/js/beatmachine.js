/* DOPE MUSIC: драм-машина ДМ-808 на главной.
   Восемь шагов, три дорожки. Бочка, снейр и хэт синтезируются Web Audio,
   сэмплы не используются. Планировщик с опережением, чтобы грув не плыл. */
(function () {
  'use strict';

  var play = document.getElementById('btPlay');
  if (!play) return;
  var clearBtn = document.getElementById('btClear');
  var tempo = document.getElementById('btTempo');

  var TRACKS = ['k', 's', 'h'];
  var cells = {};
  TRACKS.forEach(function (t) {
    cells[t] = [];
    for (var i = 0; i < 8; i++) cells[t].push(document.getElementById('btc-' + t + '-' + i));
  });
  var dots = Array.prototype.slice.call(document.querySelectorAll('.beat-dot'));
  var stepCells = Array.prototype.slice.call(document.querySelectorAll('.beat-cell'));

  var ctx = null, master = null, noiseBuf = null;

  function ensureAudio() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    var len = ctx.sampleRate;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }

  function kick(t) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(155, t);
    o.frequency.exponentialRampToValueAtTime(46, t + 0.11);
    g.gain.setValueAtTime(0.95, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + 0.32);
  }

  function snare(t) {
    var n = ctx.createBufferSource(); n.buffer = noiseBuf;
    var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1900; f.Q.value = 0.9;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
    n.connect(f); f.connect(g); g.connect(master);
    n.start(t); n.stop(t + 0.18);
    var o = ctx.createOscillator(), og = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = 190;
    og.gain.setValueAtTime(0.35, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    o.connect(og); og.connect(master);
    o.start(t); o.stop(t + 0.1);
  }

  function hat(t) {
    var n = ctx.createBufferSource(); n.buffer = noiseBuf;
    var f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7400;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.24, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    n.connect(f); f.connect(g); g.connect(master);
    n.start(t); n.stop(t + 0.06);
  }

  var playing = false, step = 0, nextT = 0, timer = null;
  var LOOKAHEAD = 0.12, INTERVAL = 30;

  function stepDur() { return 60 / (parseInt(tempo.value, 10) || 120) / 2; }

  function markStep(s, t) {
    setTimeout(function () {
      if (!playing) return;
      dots.forEach(function (d, i) { d.classList.toggle('on', i === s); });
      stepCells.forEach(function (c) { c.classList.toggle('now', +c.getAttribute('data-step') === s); });
    }, Math.max(0, (t - ctx.currentTime) * 1000));
  }

  function schedule() {
    while (nextT < ctx.currentTime + LOOKAHEAD) {
      var s = step % 8;
      if (cells.k[s] && cells.k[s].checked) kick(nextT);
      if (cells.s[s] && cells.s[s].checked) snare(nextT);
      if (cells.h[s] && cells.h[s].checked) hat(nextT);
      markStep(s, nextT);
      nextT += stepDur();
      step++;
    }
  }

  function stop() {
    playing = false;
    clearInterval(timer);
    play.textContent = 'Пуск';
    play.setAttribute('aria-pressed', 'false');
    dots.forEach(function (d) { d.classList.remove('on'); });
    stepCells.forEach(function (c) { c.classList.remove('now'); });
  }

  function start() {
    if (!ensureAudio()) return;
    if (ctx.resume) ctx.resume();
    playing = true;
    step = 0;
    nextT = ctx.currentTime + 0.08;
    schedule();
    timer = setInterval(schedule, INTERVAL);
    play.textContent = 'Стоп';
    play.setAttribute('aria-pressed', 'true');
  }

  play.addEventListener('click', function () { playing ? stop() : start(); });

  clearBtn.addEventListener('click', function () {
    TRACKS.forEach(function (t) {
      cells[t].forEach(function (c) { if (c) c.checked = false; });
    });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && playing) stop();
  });
})();
