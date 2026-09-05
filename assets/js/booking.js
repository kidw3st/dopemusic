/* DOPE MUSIC: бронь. Калькулятор, проверка полей, заявка в Telegram.
   Бэкенда нет: форма собирает текст заявки, копирует его и открывает чат студии. */
(function () {
  'use strict';

  var form = document.getElementById('bookingForm');
  if (!form) return;

  /* Прайс. Ставки помечены «от», источник: services.html (ASSUMPTION, правит студия) */
  var RATES = {
    engineer: { name: 'Запись со звукорежиссёром', talk: 'запись со звукорежиссёром', hour: 1200 },
    self:     { name: 'Самостоятельная сессия', talk: 'самостоятельная сессия', hour: 800 },
    rent:     { name: 'Аренда студии: репетиция, подкаст', talk: 'аренда студии под репетицию или подкаст', hour: 1000 }
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
        promo: els.promo.value
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

  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var WEEKDAYS = ['в воскресенье', 'в понедельник', 'во вторник', 'в среду',
    'в четверг', 'в пятницу', 'в субботу'];

  /* «сегодня», «завтра» или «в пятницу, 18 сентября» */
  function whenPhrase(value) {
    var p = value.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    var diff = Math.round((d - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
    if (diff === 0) return 'сегодня';
    if (diff === 1) return 'завтра';
    return WEEKDAYS[d.getDay()] + ', ' + (+p[2]) + ' ' + MONTHS[+p[1] - 1];
  }

  function andJoin(list) {
    if (list.length < 2) return list.join('');
    return list.slice(0, -1).join(', ') + ' и ' + list[list.length - 1];
  }

  /* Сообщение уходит в живой чат с администратором, поэтому это письмо, а не бланк */
  function buildMessage(state) {
    var slot = form.querySelector('input[name="slot"]:checked');
    var contact = els.contact.value.trim();
    var lines = [
      'Привет! Хочу забронировать студию, подскажите, свободно ли время.',
      'Нужна ' + state.rate.talk + ' ' + whenPhrase(els.date.value) +
        ', с ' + (slot ? slot.value : '19:00') +
        ', на ' + state.hours + ' ' + hourWord(state.hours) + '.'
    ];
    if (state.hours >= 5) lines.push('Один час из них, как понимаю, в подарок.');
    if (state.extras.length) lines.push('Плюс ' + andJoin(state.extras) + '.');
    if (state.discount) lines.push('Купон ' + PROMO.code + ' учёл, минус ' + state.discount.toLocaleString('ru-RU') + ' ₽.');
    lines.push('По прайсу выходит от ' + state.total.toLocaleString('ru-RU') + ' ₽, поправьте, если считаю не так.');
    lines.push('Меня зовут ' + els.name.value.trim() + ', ' +
      (contact.charAt(0) === '@' ? 'ник для связи ' + contact : 'телефон ' + contact) + '.');
    return lines.join('\n');
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
        ? 'Сообщение скопировано, чат студии открыли в Telegram: вставьте и отправьте. Обычно отвечаем в течение часа.'
        : 'Скопируйте сообщение ниже и отправьте в Telegram @DOPEMUSIC_PERM. Обычно отвечаем в течение часа.';
      document.getElementById('bkMsgOut').textContent = msg;
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
