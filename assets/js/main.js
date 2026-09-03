/* DOPE MUSIC: общий скрипт. Меню, появление листов, мелочи. */
(function () {
  'use strict';

  /* Мобильное меню */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('open', !open);
      document.documentElement.style.overflow = open ? '' : 'hidden';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
        document.documentElement.style.overflow = '';
      }
    });
  }

  /* Появление блоков: один наблюдатель на все .rv, ступень 60 мс внутри родителя.
     Всё, что уже в кадре или выше него, показывается сразу: наблюдатель
     работает только для блоков ниже линии прокрутки. */
  var revealed = document.querySelectorAll('.rv');
  function staggerOf(el) {
    var parent = el.parentElement;
    var siblings = parent ? Array.prototype.filter.call(parent.children, function (c) {
      return c.classList && c.classList.contains('rv');
    }) : [el];
    var idx = siblings.indexOf(el);
    return (idx > 0 ? Math.min(idx, 6) * 60 : 0) + 'ms';
  }
  function show(el) {
    el.style.setProperty('--rv-delay', staggerOf(el));
    el.classList.add('on');
  }
  if ('IntersectionObserver' in window && revealed.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    var fold = window.innerHeight || document.documentElement.clientHeight;
    revealed.forEach(function (el) {
      if (el.getBoundingClientRect().top < fold - 30) {
        show(el);
      } else {
        io.observe(el);
      }
    });
  } else {
    revealed.forEach(function (el) { el.classList.add('on'); });
  }

  /* Бегущая строка: набиваем копиями, чтобы лента шла без разрывов
     на любой ширине экрана, и держим постоянную скорость. */
  var ticker = document.querySelector(".ticker__track");
  if (ticker) {
    var SPEED = 55; /* пикселей в секунду */
    var sample = ticker.querySelector(".ticker__chunk");
    if (sample) {
      var pattern = sample.cloneNode(true);
      var fill = function () {
        ticker.style.animation = "none";
        ticker.innerHTML = "";
        ticker.appendChild(pattern.cloneNode(true));
        var one = ticker.firstElementChild.offsetWidth;
        if (!one) return;
        /* одна половина ленты должна перекрывать экран целиком */
        var perHalf = Math.max(1, Math.ceil(window.innerWidth / one) + 1);
        var frag = document.createDocumentFragment();
        for (var i = 0; i < perHalf * 2; i++) frag.appendChild(pattern.cloneNode(true));
        ticker.innerHTML = "";
        ticker.appendChild(frag);
        ticker.style.setProperty("--ticker-dur", (one * perHalf / SPEED).toFixed(2) + "s");
        ticker.style.animation = "";
      };
      fill();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fill);
      var t = null;
      window.addEventListener("resize", function () {
        clearTimeout(t);
        t = setTimeout(fill, 200);
      });
    }
  }
  /* Карусель макетов: стрелки, точки, свайп.
     Зациклена: с последней позиции следующий шаг возвращает на первую. */
  document.querySelectorAll(".carousel").forEach(function (root) {
    var track = root.querySelector(".carousel__track");
    var slides = root.querySelectorAll(".carousel__slide");
    var prev = root.querySelector("[data-car-prev]");
    var next = root.querySelector("[data-car-next]");
    var dotsBox = root.querySelector(".carousel__dots");
    if (!track || !slides.length) return;

    var index = 0, positions = 1;

    var perView = function () {
      var v = getComputedStyle(root).getPropertyValue("--per");
      return Math.max(1, parseInt(v, 10) || 1);
    };

    var step = function () {
      var a = slides[0].getBoundingClientRect();
      if (slides.length > 1) {
        var b = slides[1].getBoundingClientRect();
        return b.left - a.left;
      }
      return a.width;
    };

    var render = function () {
      track.style.transform = "translateX(" + (-index * step()) + "px)";
      if (dotsBox) {
        Array.prototype.forEach.call(dotsBox.children, function (d, k) {
          d.setAttribute("aria-current", String(k === index));
        });
      }
      slides.forEach(function (s, k) {
        var visible = k >= index && k < index + perView();
        s.setAttribute("aria-hidden", String(!visible));
      });
    };

    var buildDots = function () {
      positions = Math.max(1, slides.length - perView() + 1);
      if (index > positions - 1) index = 0;
      if (!dotsBox) return;
      dotsBox.innerHTML = "";
      for (var k = 0; k < positions; k++) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "carousel__dot";
        b.setAttribute("aria-label", "Показать макет " + (k + 1));
        (function (n) {
          b.addEventListener("click", function () { index = n; render(); });
        })(k);
        dotsBox.appendChild(b);
      }
    };

    var go = function (dir) {
      index += dir;
      if (index > positions - 1) index = 0;      /* после последней снова первая */
      if (index < 0) index = positions - 1;
      render();
    };

    if (next) next.addEventListener("click", function () { go(1); });
    if (prev) prev.addEventListener("click", function () { go(-1); });

    /* свайп пальцем */
    var x0 = null;
    track.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    track.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    });

    buildDots();
    render();
    var ct = null;
    window.addEventListener("resize", function () {
      clearTimeout(ct);
      ct = setTimeout(function () { buildDots(); render(); }, 200);
    });
  });



  /* Оптическое выравнивание заголовков.
     У букв разные боковые полуапроши: круглая «С» и прямая «П» стоят правее нуля,
     диагональная «Х» выходит левее. Математически строки ровные, а глаз видит рванину.
     Считаем реальный вылет чернил первой буквы каждой строки и гасим его отступом. */
  var optical = document.querySelectorAll(".h-display, .h-page, .h-sec");
  if (optical.length && document.createRange) {
    var probe = document.createElement("canvas").getContext("2d");

    var splitLines = function (el, text) {
      el.textContent = text;
      var node = el.firstChild;
      var r = document.createRange();
      var cuts = [], top = null, from = 0;
      for (var i = 0; i < text.length; i++) {
        r.setStart(node, i); r.setEnd(node, i + 1);
        var box = r.getBoundingClientRect();
        if (!box.height) continue;
        if (top === null) { top = box.top; continue; }
        if (Math.abs(box.top - top) > 4) { cuts.push(text.slice(from, i)); from = i; top = box.top; }
      }
      cuts.push(text.slice(from));
      return cuts;
    };

    var align = function (el) {
      var text = el.getAttribute("data-line-text");
      if (text === null) {
        if (el.childNodes.length !== 1 || el.firstChild.nodeType !== 3) return;
        text = el.textContent;
        el.setAttribute("data-line-text", text);
      }
      if (!el.offsetParent && el.tagName !== "BODY") { el.textContent = text; return; }
      var lines = splitLines(el, text);
      var cs = getComputedStyle(el);
      probe.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
      el.textContent = "";
      lines.forEach(function (line) {
        var row = document.createElement("span");
        row.style.display = "block";
        var first = line.replace(/^\s+/, "").charAt(0);
        var tt = cs.textTransform;
        if (tt === "uppercase") first = first.toUpperCase();
        else if (tt === "lowercase") first = first.toLowerCase();
        if (first) {
          var m = probe.measureText(first);
          var ink = -m.actualBoundingBoxLeft; /* насколько чернила отступили от нуля */
          if (isFinite(ink) && Math.abs(ink) < 40) row.style.marginLeft = (-ink).toFixed(2) + "px";
        }
        row.textContent = line;
        el.appendChild(row);
      });
    };

    var runAll = function () { optical.forEach(align); };
    runAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(runAll);
    var ot = null;
    window.addEventListener("resize", function () { clearTimeout(ot); ot = setTimeout(runAll, 220); });
  }


  /* Карта: чужой скрипт грузим только тогда, когда гость сам попросил */
  var plate = document.getElementById('mapPlate');
  var mapBtn = document.getElementById('mapLoad');
  if (plate && mapBtn) {
    mapBtn.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = 'https://yandex.ru/map-widget/v1/?oid=183475169094&ol=biz&z=17';
      frame.title = 'Яндекс.Карты: Пермь, Петропавловская, 40';
      frame.loading = 'lazy';
      frame.allowFullscreen = true;
      frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      var tint = document.createElement('div');
      tint.className = 'mapplate__tint';
      var scheme = plate.querySelector('svg');
      if (scheme) plate.removeChild(scheme);
      plate.removeChild(mapBtn);
      plate.appendChild(frame);
      plate.appendChild(tint);
      var note = document.getElementById('mapNote');
      if (note) {
        note.innerHTML = 'Яндекс.Карты: Пермь, Петропавловская, 40 • <a href="https://yandex.ru/maps/org/dope_music/183475169094/" rel="noopener">открыть в приложении</a>';
      }
    });
  }

})();
