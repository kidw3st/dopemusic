/* DOPE MUSIC: бронь. Калькулятор, проверка полей, заявка в Telegram.
   Бэкенда нет: форма собирает текст заявки, копирует его и открывает чат студии. */
(function () {
  'use strict';

  var form = document.getElementById('bookingForm');
  if (!form) return;

  /* Прайс. Ставки помечены «от», источник: services.html (ASSUMPTION, правит студия) */
  var RATES = {
    engineer: { name: 'Запись со звукорежиссёром', hour: 1200 },
    self:     { name: 'Самостоятельная сессия', hour: 800 },
    rent:     { name: 'Аренда студии: репетиция, подкаст', hour: 1000 }
  };
  var EXTRAS = {
    mixing:    { name: 'Сведение трека', price: 3000 },
    mastering: { name: 'Мастеринг трека', price: 1500 }
  };
  var PROMO = { code: 'DOPE2500', amount: 2500 };

  var els = {
    date: form.querySelector('#bkDate'),
    hours: form.querySelector('#bkHours'),
    hoursOut: form.querySelector('#bkHoursOut'),
    name: form.querySelector('#bkName'),
    contact: form.querySelector('#bkContact'),
    promo: form.querySelector('#bkPromo'),
    promoNote: form.querySelector('#bkPromoNote'),
    totalOut: form.querySelector('#bkTotal'),
    totalLine: form.querySelector('#bkTotalLine'),
    done: document.getElementById('bkDone'),
    doneText: document.getElementById('bkDoneText')
  };

  /* Дата: не раньше сегодняшнего дня */
  var today = new Date();
  var pad = function (n) { return n < 10 ? '0' + n : String(n); };
  var iso = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
  if (els.date) els.date.min = iso;

  /* Сетка слотов: студия работает круглосуточно */
  var slotWrap = form.querySelector('#bkSlots');
  if (slotWrap) {
    var frag = document.createDocumentFragment();
    for (var h = 0; h < 24; h++) {
      var id = 'slot' + h;
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'slot';
      input.value = pad(h) + ':00';
      input.id = id;
      if (h === 19) input.checked = true;
      var lab = document.createElement('label');
      lab.setAttribute('for', id);
      lab.textContent = pad(h) + ':00';
      frag.appendChild(input);
      frag.appendChild(lab);
    }
    slotWrap.appendChild(frag);
  }

  function currentRate() {
    var r = form.querySelector('input[name="kind"]:checked');
    return r ? RATES[r.value] : RATES.engineer;
  }

  function promoApplied() {
    return els.promo && els.promo.value.trim().toUpperCase() === PROMO.code;
  }

  function calc() {
    var rate = currentRate();
    var hours = parseInt(els.hours.value, 10) || 1;
    /* от пяти часов подряд один час в подарок */
    var billed = hours >= 5 ? hours - 1 : hours;
    var sum = rate.hour * billed;
    var extrasChosen = [];
    Object.keys(EXTRAS).forEach(function (key) {
      var box = form.querySelector('#bkX_' + key);
      if (box && box.checked) {
        sum += EXTRAS[key].price;
        extrasChosen.push(EXTRAS[key].name.toLowerCase());
      }
    });
    var discount = 0;
    if (promoApplied()) {
      discount = Math.min(PROMO.amount, sum);
      els.promoNote.textContent = 'Купон принят: минус ' + discount.toLocaleString('ru-RU') + ' ₽';
      els.promoNote.style.display = 'block';
    } else if (els.promo && els.promo.value.trim()) {
      els.promoNote.textContent = 'Такого купона нет. Проверьте код.';
      els.promoNote.style.display = 'block';
    } else if (els.promoNote) {
      els.promoNote.style.display = 'none';
    }
    var total = sum - discount;
    els.hoursOut.textContent = hours + ' ' + hourWord(hours);
    els.totalOut.textContent = 'от ' + total.toLocaleString('ru-RU') + ' ₽';
    els.totalLine.textContent = rate.name + ', ' + hours + ' ' + hourWord(hours) +
      (hours >= 5 ? ', один час в подарок' : '') +
      (extrasChosen.length ? ', плюс ' + extrasChosen.join(', ') : '') +
      (discount ? ', купон учтён' : '');
    return { rate: rate, hours: hours, extras: extrasChosen, total: total, discount: discount };
  }

  function hourWord(n) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'час';
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'часа';
    return 'часов';
  }

  /* Черновик в localStorage: вернулся, а всё на месте */
  var DRAFT_KEY = 'dm-booking-draft';
  function saveDraft() {
    try {
      var data = {
        kind: (form.querySelector('input[name="kind"]:checked') || {}).value,
        date: els.date.value,
        slot: (form.querySelector('input[name="slot"]:checked') || {}).value,
        hours: els.hours.value,
        name: els.name.value,
        contact: els.contact.value,
        promo: els.promo.value,
        mixing: form.querySelector('#bkX_mixing').checked,
        mastering: form.querySelector('#bkX_mastering').checked
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) { /* приватный режим: пропускаем */ }
  }
  function loadDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data.kind) { var k = form.querySelector('input[name="kind"][value="' + data.kind + '"]'); if (k) k.checked = true; }
      if (data.date && data.date >= iso) els.date.value = data.date;
      if (data.slot) { var s = form.querySelector('input[name="slot"][value="' + data.slot + '"]'); if (s) s.checked = true; }
      if (data.hours) els.hours.value = data.hours;
      if (data.name) els.name.value = data.name;
      if (data.contact) els.contact.value = data.contact;
      if (data.promo) els.promo.value = data.promo;
      form.querySelector('#bkX_mixing').checked = !!data.mixing;
      form.querySelector('#bkX_mastering').checked = !!data.mastering;
    } catch (e) { /* повреждённый черновик не мешает форме */ }
  }
  loadDraft();
  calc();

  form.addEventListener('input', function () { calc(); saveDraft(); });
  form.addEventListener('change', function () { calc(); saveDraft(); });

  /* Проверка полей с внятными ошибками */
  function setError(input, on) {
    var field = input.closest('.field');
    if (field) field.classList.toggle('is-error', on);
    input.setAttribute('aria-invalid', on ? 'true' : 'false');
  }

  function validate() {
    var ok = true;
    if (!els.date.value || els.date.value < iso) { setError(els.date, true); ok = false; } else setError(els.date, false);
    if (els.name.value.trim().length < 2) { setError(els.name, true); ok = false; } else setError(els.name, false);
    var c = els.contact.value.trim();
    var phoneLike = /^[+8][\d\s()-]{9,}$/.test(c);
    var tgLike = /^@[a-zA-Z0-9_]{4,}$/.test(c);
    if (!phoneLike && !tgLike) { setError(els.contact, true); ok = false; } else setError(els.contact, false);
    var agree = form.querySelector('#bkAgree');
    if (agree) {
      var agreeLabel = agree.closest('.check');
      if (!agree.checked) {
        if (agreeLabel) agreeLabel.classList.add('is-error');
        ok = false;
      } else if (agreeLabel) {
        agreeLabel.classList.remove('is-error');
      }
    }
    return ok;
  }

  function buildMessage(state) {
    var slot = form.querySelector('input[name="slot"]:checked');
    var dd = els.date.value.split('-');
    var lines = [
      'Заявка с сайта DOPE MUSIC',
      'Услуга: ' + state.rate.name,
      'Дата: ' + dd[2] + '.' + dd[1] + '.' + dd[0] + ', начало в ' + (slot ? slot.value : '19:00'),
      'Длительность: ' + state.hours + ' ' + hourWord(state.hours)
    ];
    if (state.extras.length) lines.push('Дополнительно: ' + state.extras.join(', '));
    if (state.discount) lines.push('Купон ' + PROMO.code + ': минус ' + state.discount.toLocaleString('ru-RU') + ' ₽');
    lines.push('Расчёт по прайсу: от ' + state.total.toLocaleString('ru-RU') + ' ₽');
    lines.push('Имя: ' + els.name.value.trim());
    lines.push('Связь: ' + els.contact.value.trim());
    return lines.join('\n');
  }

  /* Печатный талон: PNG на canvas, в манере купонов бренда */
  function renderTicket(state) {
    var img = document.getElementById('bkTicketImg');
    var save = document.getElementById('bkTicketSave');
    var wrap = document.getElementById('bkTicketWrap');
    if (!img || !save || !wrap) return;

    var slot = form.querySelector('input[name="slot"]:checked');
    var slotVal = slot ? slot.value : '19:00';
    var dd = els.date.value.split('-');
    var dateStr = dd[2] + '.' + dd[1] + '.' + dd[0];
    var name = els.name.value.trim();

    /* детерминированный номер талона и штрих-код из данных брони */
    var seedStr = name + dateStr + slotVal;
    var seed = 0;
    for (var i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) % 100000;
    var num = 'DM-' + String(1000 + seed % 9000);
    var rnd = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };

    var W = 360, H = 600, S = 2;
    var cv = document.createElement('canvas');
    cv.width = W * S; cv.height = H * S;
    var c = cv.getContext('2d');
    c.scale(S, S);

    var draw = function () {
      var ink = '#161513', paper = '#F5F4F1', mut = '#4A4843', line = '#C7C4BC';
      c.fillStyle = paper; c.fillRect(0, 0, W, H);
      c.strokeStyle = line; c.lineWidth = 1; c.strokeRect(0.5, 0.5, W - 1, H - 1);

      /* шапка: словесный знак и пластинка */
      c.fillStyle = ink;
      c.font = '1000 26px Mulish, sans-serif';
      c.fillText('DOPE MUSIC', 24, 46);
      c.beginPath(); c.arc(316, 38, 16, 0, 7); c.fill();
      c.fillStyle = paper; c.beginPath(); c.arc(316, 38, 6, 0, 7); c.fill();
      c.fillStyle = ink; c.beginPath(); c.arc(316, 38, 2.5, 0, 7); c.fill();

      c.fillStyle = mut;
      c.font = '700 9px "Martian Mono", monospace';
      c.fillText('ТАЛОН БРОНИ ✱ ФОРМА ДМ-01', 24, 64);
      c.textAlign = 'right';
      c.fillText('№ ' + num, W - 24, 64);
      c.textAlign = 'left';

      c.strokeStyle = '#A9A69E'; c.setLineDash([4, 4]);
      c.beginPath(); c.moveTo(24, 76); c.lineTo(W - 24, 76); c.stroke();
      c.setLineDash([]);

      /* поля талона */
      var y = 102;
      var row = function (label, value, big) {
        c.fillStyle = mut; c.font = '700 8.5px "Martian Mono", monospace';
        c.fillText(label.toUpperCase(), 24, y);
        c.fillStyle = ink; c.font = (big ? '1000 24px' : '800 15px') + ' Mulish, sans-serif';
        c.fillText(value, 24, y + (big ? 28 : 19));
        y += big ? 52 : 40;
      };
      row('Услуга', state.rate.name);
      row('Дата', dateStr + ', начало в ' + slotVal);
      row('Длительность', state.hours + ' ' + hourWord(state.hours) + (state.hours >= 5 ? ', час в подарок' : ''));
      if (state.extras.length) row('Дополнительно', state.extras.join(', '));
      if (state.discount) row('Купон ' + PROMO.code, 'минус ' + state.discount.toLocaleString('ru-RU') + ' ₽');
      row('Итог по прайсу', 'от ' + state.total.toLocaleString('ru-RU') + ' ₽', true);
      if (name) row('Имя', name);

      /* перфорация */
      var py = H - 128;
      c.strokeStyle = '#A9A69E'; c.setLineDash([5, 5]);
      c.beginPath(); c.moveTo(0, py); c.lineTo(W, py); c.stroke();
      c.setLineDash([]);
      c.fillStyle = paper;
      c.beginPath(); c.arc(0, py, 9, 0, 7); c.fill();
      c.beginPath(); c.arc(W, py, 9, 0, 7); c.fill();
      c.strokeStyle = line;
      c.beginPath(); c.arc(0, py, 9, 0, 7); c.stroke();
      c.beginPath(); c.arc(W, py, 9, 0, 7); c.stroke();

      /* штрих-код корешка */
      var bx = 24, bw;
      c.fillStyle = ink;
      while (bx < 210) {
        bw = 1 + Math.floor(rnd() * 3);
        c.fillRect(bx, py + 22, bw, 44);
        bx += bw + 2 + Math.floor(rnd() * 4);
      }
      c.font = '1000 20px Mulish, sans-serif';
      c.textAlign = 'right';
      c.fillText(slotVal, W - 24, py + 52);
      c.textAlign = 'left';

      c.fillStyle = mut; c.font = '500 8px "Martian Mono", monospace';
      c.fillText('ПЕТРОПАВЛОВСКАЯ, 40 ✱ ПЕРМЬ ✱ ПН-ВС 24/7', 24, py + 84);
      c.fillText('СЛОТ ПОДТВЕРЖДАЕТ АДМИНИСТРАТОР В TELEGRAM', 24, py + 98);

      var url = cv.toDataURL('image/png');
      img.src = url;
      save.href = url;
      wrap.hidden = false;
    };

    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load('1000 26px Mulish'),
        document.fonts.load('800 15px Mulish'),
        document.fonts.load('700 9px "Martian Mono"')
      ]).then(draw, draw);
    } else {
      draw();
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstErr = form.querySelector('.field.is-error input');
      if (firstErr) firstErr.focus();
      return;
    }
    var state = calc();
    var msg = buildMessage(state);
    var finish = function (copied) {
      form.hidden = true;
      els.done.hidden = false;
      els.doneText.textContent = copied
        ? 'Текст заявки скопирован. Открыли чат студии в Telegram: вставьте сообщение и отправьте. Ответ обычно в течение часа.'
        : 'Скопируйте текст заявки ниже и отправьте его в Telegram @DOPEMUSIC_PERM. Ответ обычно в течение часа.';
      document.getElementById('bkMsgOut').textContent = msg;
      renderTicket(state);
      els.done.scrollIntoView({ block: 'center' });
      try { localStorage.removeItem(DRAFT_KEY); } catch (err) { }
      window.open('https://t.me/DOPEMUSIC_PERM', '_blank', 'noopener');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).then(function () { finish(true); }, function () { finish(false); });
    } else {
      finish(false);
    }
  });
})();
