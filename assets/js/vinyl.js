/* DOPE MUSIC: печать-пластинка в hero.
   Клик: пластинка крутится, звучит тёплый виниловый треск (генерируется кодом,
   никаких чужих сэмплов). Драг по кругу: скретч. */
(function () {
  'use strict';

  var btn = document.getElementById('vinylBtn');
  if (!btn) return;
  var svg = btn.querySelector('svg');
  var spin = btn.querySelector('.vinyl-spin');

  var ctx = null, master = null, scratchGain = null, scratchFilter = null, popTimer = null;

  function ensureAudio() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);

    /* петля шума: основа и для фона, и для скретча */
    var len = 2 * ctx.sampleRate;
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    /* тихое шипение борозды */
    var hiss = ctx.createBufferSource();
    hiss.buffer = buf; hiss.loop = true;
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 400;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    var hissGain = ctx.createGain(); hissGain.gain.value = 0.02;
    hiss.connect(hp); hp.connect(lp); lp.connect(hissGain); hissGain.connect(master);
    hiss.start();

    /* тракт скретча: тот же шум через полосовой фильтр, громкость от скорости */
    var sc = ctx.createBufferSource();
    sc.buffer = buf; sc.loop = true;
    scratchFilter = ctx.createBiquadFilter();
    scratchFilter.type = 'bandpass';
    scratchFilter.frequency.value = 900;
    scratchFilter.Q.value = 1.4;
    scratchGain = ctx.createGain();
    scratchGain.gain.value = 0;
    sc.connect(scratchFilter); scratchFilter.connect(scratchGain); scratchGain.connect(master);
    sc.start();
    return true;
  }

  /* одиночный щелчок пыли */
  function pop() {
    if (!ctx || !playing) return;
    var dur = 0.004 + Math.random() * 0.02;
    var n = Math.max(8, Math.ceil(dur * ctx.sampleRate));
    var b = ctx.createBuffer(1, n, ctx.sampleRate);
    var d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    var src = ctx.createBufferSource();
    src.buffer = b;
    var g = ctx.createGain();
    g.gain.value = 0.12 + Math.random() * 0.3;
    src.connect(g); g.connect(master);
    src.start();
    popTimer = setTimeout(pop, 70 + Math.random() * 450);
  }

  var playing = false;
  function setPlaying(on) {
    playing = on;
    btn.classList.toggle('playing', on);
    btn.setAttribute('aria-pressed', String(on));
    if (on) {
      if (!ensureAudio()) return;
      if (ctx.resume) ctx.resume();
      master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.06);
      clearTimeout(popTimer);
      pop();
    } else if (ctx) {
      clearTimeout(popTimer);
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
    }
  }

  /* скретч: угол указателя вокруг центра пластинки */
  var dragging = false, moved = false, lastA = 0, lastT = 0, angle = 0, quiet = null;

  function pointerAngle(e) {
    var r = svg.getBoundingClientRect();
    /* центр пластинки в системе viewBox 360x360: примерно (170, 119) */
    var cx = r.left + r.width * (170 / 360);
    var cy = r.top + r.height * (119 / 360);
    return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
  }

  btn.addEventListener('pointerdown', function (e) {
    dragging = true; moved = false;
    lastA = pointerAngle(e); lastT = performance.now();
    if (btn.setPointerCapture) { try { btn.setPointerCapture(e.pointerId); } catch (err) { } }
  });

  btn.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var a = pointerAngle(e), now = performance.now();
    var da = a - lastA;
    if (da > 180) da -= 360;
    if (da < -180) da += 360;
    if (Math.abs(da) > 0.5) moved = true;
    if (!playing) { lastA = a; lastT = now; return; }
    angle += da;
    if (spin) {
      spin.style.animation = 'none';
      spin.style.transformBox = 'fill-box';
      spin.style.transformOrigin = 'center';
      spin.style.transform = 'rotate(' + angle.toFixed(1) + 'deg)';
    }
    var vel = Math.min(Math.abs(da) / Math.max(now - lastT, 1) * 1000, 720);
    if (scratchGain) {
      scratchGain.gain.setTargetAtTime(Math.min(vel / 720, 1) * 0.55, ctx.currentTime, 0.012);
      scratchFilter.frequency.setTargetAtTime(350 + vel * 2.4, ctx.currentTime, 0.012);
    }
    clearTimeout(quiet);
    quiet = setTimeout(function () {
      if (scratchGain && ctx) scratchGain.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
    }, 80);
    lastA = a; lastT = now;
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    if (scratchGain && ctx) scratchGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    if (spin) {
      spin.style.transform = '';
      spin.style.animation = '';
    }
  }
  btn.addEventListener('pointerup', endDrag);
  btn.addEventListener('pointercancel', endDrag);
  btn.addEventListener('lostpointercapture', endDrag);

  /* клик без вращения: переключить проигрывание */
  btn.addEventListener('click', function () {
    if (moved) { moved = false; return; }
    setPlaying(!playing);
  });

  /* страница ушла в фон: глушим */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && playing) setPlaying(false);
  });
})();
