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

  /* Текущий год в подвале */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* Штамп сегодняшней даты в колонтитулах: 2026 18/08 */
  var d = new Date();
  var pad = function (n) { return n < 10 ? '0' + n : String(n); };
  document.querySelectorAll('[data-datestamp]').forEach(function (el) {
    el.textContent = d.getFullYear() + ' ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1);
  });
})();
