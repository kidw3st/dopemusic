---
name: Dope Music Studio & Label
description: Сайт студии как её собственная печатная продукция, бумага и краска с тремя акцентами саб-брендов
colors:
  paper: "#E9E7E2"
  sheet: "#F5F4F1"
  sheet-dim: "#DEDCD6"
  ink: "#161513"
  ink-2: "#4A4843"
  line: "#C7C4BC"
  dash: "#A9A69E"
  night: "#1B1A18"
  night-2: "#262421"
  paper-on-night: "#E5E3DD"
  night-muted: "#8F8C85"
  night-lead: "#B9B6AF"
  studio: "#A98BC8"
  studio-deep: "#63467F"
  label: "#3D6BC6"
  label-deep: "#2C4E93"
  pill-label: "#9DBEEA"
  prod: "#D89A3D"
  prod-deep: "#8A5D14"
  pill-prod: "#EBBE6A"
  stamp: "#A33A2A"
typography:
  display:
    fontFamily: "Mulish, 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(44px, 9.2vw, 118px)"
    fontWeight: 1000
    lineHeight: 0.94
    letterSpacing: "-0.03em"
  page:
    fontFamily: "Mulish, 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(36px, 6.4vw, 84px)"
    fontWeight: 1000
    lineHeight: 0.96
    letterSpacing: "-0.025em"
  section:
    fontFamily: "Mulish, 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(26px, 3.6vw, 44px)"
    fontWeight: 900
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  sub:
    fontFamily: "Mulish, 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(19px, 2vw, 24px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Mulish, 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(18px, 1.8vw, 21px)"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Mulish, 'Segoe UI', Tahoma, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.55
  mono:
    fontFamily: "'Martian Mono', 'Courier New', monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.04em"
rounded:
  none: "0"
  hairline: "2px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 44px)"
  sheet-y: "clamp(40px, 7vw, 96px)"
  head-gap: "clamp(28px, 4.5vw, 56px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "15px 26px 14px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "15px 26px 14px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "15px 26px 14px"
  button-paper-hover:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
  nav-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "9px 18px 8px"
  pill-studio:
    backgroundColor: "{colors.studio}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px 6px"
  pill-label:
    backgroundColor: "{colors.pill-label}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px 6px"
  pill-prod:
    backgroundColor: "{colors.pill-prod}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px 6px"
  pill-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "7px 14px 6px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hairline}"
    padding: "12px 14px"
---

# Design System: Dope Music Studio & Label

## Overview

**Creative North Star: «Печатный цех студии»**

Сайт свёрстан как собственная печатная продукция Dope Music: афиша, купон, визитка, опись, талон. Каждая страница: стопка «листов» с колонтитулами, линиями отреза с ножницами, дата-штампами, номерами форм (ДМ-01, ДМ-02) и штрих-кодами. Это сознательный отказ от категорийного шаблона «тёмный музыкальный лендинг с неоном и глянцем» (THESIS, index.html; кандидат 4 из 7, seed 05d18d51). Визуальный мир закреплён брендбуком Behance «Dope Music Studio + Label new visual identity» (июль 2025); перевод брендбука в веб-правила лежит в docs/brand-guidelines.md, продуктовая правда: в PRODUCT.md.

Материал мира: светло-серая «бумага» (#E9E7E2) с печатным зерном (inline-SVG feTurbulence, альфа 0.05) и почти чёрная «краска» (#161513). Три саб-бренда получают по акценту: лаванда Studio, синий Label, янтарь Production. Ночные секции (24/7): тёмная вставка #1B1A18, тот же печатный язык на «ночной бумаге». Всё плоское: без теней, без градиентных заливок, без фотографий; вся графика рисуется inline-SVG в векторной грамматике брендбука (винил с «ушами»-клиньями, фейдер, четырёхлучевая звезда, круглая печать, штрих-код).

**Key Characteristics:**
- Страница = стопка нумерованных печатных листов, разделённых пунктирными линиями отреза.
- Два голоса: жирный гротеск Mulish 900–1000 в верхнем регистре и служебный Martian Mono uppercase.
- Акценты живут только в пилюлях, штампах и SVG-макетах; поля страниц всегда бумага или ночь.
- Ховеры меняют только цвет; движение медленное и «механическое» (печать 28s, тикер 36s).
- Всё без бэкенда и CDN: self-hosted шрифты, inline-SVG, деградация без JS полная.

## Colors

Палитра печатного цеха: пять серо-тёплых нейтралей бумаги и краски несут 90% интерфейса, три акцента саб-брендов появляются точечно, красный штамп: только для пометок и ошибок.

### Primary

Триада саб-брендов (цепочка «запись → дистрибуция → визуал»):

- **Лаванда Studio** (#A98BC8): фон пилюли `.pill--studio`; дуотон в макете обложки EP на production.html.
- **Лаванда глубокая** (#63467F): тёмная половина дуотона обложек (в вёрстке: литерал в SVG; токен `--studio-deep` объявлен в :root, но через var() не используется).
- **Синий Label** (#3D6BC6): канонический цвет саб-бренда из брендбука; объявлен в :root как `--label` (в вёрстке пока живёт только как токен-резерв).
- **Голубой пилюли Label** (#9DBEEA): фактический фон `.pill--label` (осветлённый, чтобы чёрный текст читался).
- **Янтарь Production** (#D89A3D): канонический цвет саб-бренда; фон макета афиши на production.html.
- **Янтарь пилюли** (#EBBE6A): фактический фон `.pill--prod`.
- **Синий глубокий / янтарь глубокий** (#2C4E93 / #8A5D14): объявленные в :root тёмные пары для дуотонов; в текущей вёрстке не задействованы, резерв для новых обложек.

### Secondary

- **Красный штамп** (#A33A2A): «пометки от руки». Ошибки форм (рамка + текст `.field__err`), плашка `.stamp-note`, печать-метка «DM ✱ 40» на карте контактов. Никогда не фон и не декор.

### Neutral

- **Бумага** (#E9E7E2): фон html/body, фон полей ввода; «дырки» логотипа через `--mark-hole` (на ночных секциях переопределяется в night).
- **Лист** (#F5F4F1): карточки `.sheet-card`, купоны `.coupon`, подложка печати и карты, фон футера.
- **Лист приглушённый** (#DEDCD6): объявлен в :root (`--sheet-dim`), в вёрстке пока не используется; резерв.
- **Краска** (#161513): текст, заливки кнопок, пилюля-инверс, дом «40» на карте, фон обложки сингла.
- **Краска вторая** (#4A4843): вторичный текст `.muted`, колонтитулы, ножницы cutline.
- **Линия** (#C7C4BC): все базовые бордеры: рамки листов, полей, футера, разделители строк.
- **Пунктир** (#A9A69E): линии отреза `.cutline`, перфорация `.coupon__tear`, точечные подводки `.price-row__dots`, занятые слоты.
- **Ночь** (#1B1A18) и **Ночь-2** (#262421): фон тёмных секций и их внутренние разделители строк.
- **Бумага на ночи** (#E5E3DD): текст и штрих-код в ночных секциях.
- **Ночной приглушённый** (#8F8C85): колонтитулы и мелкое моно в ночных секциях, улицы на карте.
- **Ночной лид** (#B9B6AF): текст `.lead` внутри ночных секций (задаётся inline).

### Named Rules

**Правило полей листа.** Акцентные цвета живут только в пилюлях саб-брендов, красных штампах и SVG-макетах обложек. Поля страницы всегда бумага или ночь; акцент никогда не заливает секцию, кнопку или текст.

**Правило штампа.** #A33A2A: это чернила ручного штампа: ошибка, пометка, метка на карте. Он не участвует в брендинге саб-направлений и не используется как «красивый красный».

## Typography

**Display Font:** Mulish, вариативный 200–1000 (замена Averta CY; fallback 'Segoe UI', Tahoma, sans-serif)
**Body Font:** Mulish 500–800
**Label/Mono Font:** Martian Mono, вариативный 100–800 (замена Disket Mono; fallback 'Courier New', monospace)

**Character:** Плакатный гротеск на весах 900–1000 кричит с афиши; квадратный техно-моно набирает колонтитулы, штампы и ценники, как служебная маркировка на типографском бланке. Оба самохостятся сабсетами (cyr / lat / latext); знак рубля ₽ (U+20BD) живёт только в `*-latext.woff2`.

### Hierarchy

- **Display** (1000, clamp(44px, 9.2vw, 118px), 0.94, −0.03em, uppercase): заголовок афиши на главной и сумма купона «2500 ₽». Подводка `.h-display__lead`: 400, 0.36em, без капса.
- **Page** (1000, clamp(36px, 6.4vw, 84px), 0.96, −0.025em, uppercase): h1 внутренних страниц.
- **Section** (900, clamp(26px, 3.6vw, 44px), 1.04, −0.02em, uppercase): h2 листов.
- **Sub** (800, clamp(19px, 2vw, 24px), 1.2, −0.01em): h3, без капса.
- **Lead** (500, clamp(18px, 1.8vw, 21px), 1.5, max-width 34em): подзаголовки-лиды.
- **Body** (500, 17px, 1.55): базовый текст; длинные тексты в `.prose` (max-width 68ch, terms/privacy).
- **Mono** (500, 12px, +0.04em, uppercase): колонтитулы, штампы, ценники, подписи. Модификаторы: `.mono-b` 700, `.mono-lg` 14px, `.mono-sm` 10.5px. Служебные вариации: пилюли 11px/+0.08em, кнопки 13px/+0.07em, навигация 12px/+0.05em, ярлыки полей 11px/+0.07em.

### Named Rules

**Правило двух регистров.** Заголовки Mulish: верхний регистр с отрицательным трекингом (−0.02…−0.03em); всё моно: верхний регистр с положительным (+0.04…+0.08em). Текст никогда не опускается ниже веса 500.

**Правило рубля.** Цены набираются моно с неразрывным «₽»; сабсеты `*-latext.woff2` не удалять, иначе ₽ выпадет в fallback.

## Layout

Страница собирается из «листов»: `.sheet` (padding clamp(40px, 7vw, 96px) по вертикали, верхний бордер 1px var(--line); первый лист `.sheet--flush` без верхнего отступа). Каждый лист открывает колонтитул `.running-head`: mono-строка слева и справа, разделитель ✱ (U+2731), дата-штамп `[data-datestamp]` в формате «2026 18/08» (заполняет main.js). Листы разделяет `hr.cutline`: пунктир 1.5px #A9A69E с иконкой ножниц (inline-SVG data-URI), смещённой к правому краю. Ночные секции `.night` вставляются в стопку как тёмные листы; их вертикальные отступы задаются inline (clamp(44px, 7vw, 90px)) и на них переопределяется `--mark-hole: var(--night)`.

Контейнер: `.wrap` max-width 1240px (`--site-w`), горизонтальные поля `--gutter` clamp(16px, 4vw, 44px). Шапка sticky (top 0, z-index 100, min-height строки 62px, фон бумага, нижний бордер line). У body `overflow-x: clip`: обязательная защита от горизонтального скролла при широких SVG и тикере.

Сеточная грамматика: `.two-col` (1fr 1fr, gap clamp(28px, 5vw, 72px)) с модификаторами пропорций: `--talon` 1.25fr 0.75fr (форма брони + прилипающий купон итога, sticky top 86px), `--ledger` minmax(180px, 0.7fr) 1.3fr (заголовок раздела + прайс), `--fields` 1fr 1fr с gap 20px (пары полей). Складывание: базовая, talon и ledger → одна колонка на ≤860px; fields → на ≤640px. Строка «станции» маршрута `.station`: grid minmax(110px, 180px) 1fr auto (пилюля, текст, ссылка), на ≤640px: одна колонка. Навигация шапки прячется на ≤900px (бургер + мобильное меню со скролл-локом). Футер: grid 1.4fr 1fr 1fr → 1fr на ≤860px.

Появление при скролле: класс `.rv` на блоках; стартовое скрытие (opacity 0, translateY(14px)) существует только при `html.js` (класс ставится инлайн-скриптом в head): без JavaScript страница полностью видима. main.js: один IntersectionObserver (rootMargin '0px 0px -8%', threshold 0.12), всё выше линии сгиба показывается сразу; ступень внутри родителя 60ms на соседа, максимум 6 ступеней (360ms), через `--rv-delay`.

Композиционные отступы (margin-top, max-width заголовков, локальные flex-ряды) задаются inline-style прямо в HTML: система живёт в main.css, страницы дозируют ритм на месте. Печатная версия (`@media print`) прячет шапку, футер, тикер и меню; фон белый.

## Elevation & Depth

Система полностью плоская: теней нет нигде, глубина не используется как метафора. Иллюзию слоёв даёт сама бумага: подложка `--sheet` чуть светлее фона, 1px-бордеры `--line` очерчивают карточки и купоны, печатное зерно (SVG-шум на body) даёт фактуру. Единственный box-shadow во всём CSS: `inset 0 0 0 1px var(--ink)` на выбранной радио-плашке `.radio-row input:checked + label`: это удвоение рамки (приём «жирнее обвели ручкой»), а не тень. `::selection` инвертирует краску и бумагу (в ночных секциях: наоборот).

### Named Rules

**Правило плоской печати.** Никаких box-shadow, drop-shadow, градиентных заливок и blur. Новый слой = светлее/темнее бумага + бордер. Исключение одно и уже существует: inset-рамка выбранного радио.

## Shapes

Форма: прямоугольник печатного бланка. Углы: 0 по умолчанию (кнопки, карточки, купоны, SVG-макеты), 2px hairline на полях ввода и чекбоксах (чуть скруглённый штамп), 999px только у пилюль (`.pill`, `.nav-cta`). Других радиусов в системе нет.

Словарь линий (несущая графика мира): сплошная 1px var(--line): границы листов и карточек; сплошная 1.5px var(--ink): рамки кнопок, пилюль, полей с фокусом, чекбоксов; пунктир 1px dashed var(--line): разделители строк внутри списков (ставятся inline на строках; первая/последняя строка списка: сплошные); пунктир 1.5px dashed #A9A69E: линии отреза; пунктир 2px dashed #A9A69E: перфорация купона (плюс полукруглые «высечки»: круги 20px цвета бумаги с clip-path inset по половине); точки 2px dotted #A9A69E: подводка цены к значению (translateY(−4px)).

Фирменные силуэты: винил с тремя «ушами»-клиньями и четырёхлучевой звездой (логотип и печать), фейдер (ручка на дорожке; бургер-меню: три линии разной длины «как дорожки фейдеров»), штрих-код: наложение двух repeating-linear-gradient (2px/6px и 4px/11px) краской по прозрачному (ночной вариант: paper-on-night). Повороты как печатный брак: печать-логотип −14°, штамп-плашка `.stamp-note` −1.6°, карта квартала −3°.

## Components

### Navigation
- Ссылки: mono 12px/+0.05em uppercase, нижний бордер 2px transparent; hover → бордер var(--line); текущая страница `aria-current="page"` → бордер var(--ink) + вес 700.
- CTA шапки `.nav-cta`: чёрная пилюля «Бронь ✱ 24/7»; hover: инверсия в прозрачную.
- Бургер (≤900px): 44×44, три полосы-фейдера разной длины; открытое состояние: крест (transform 200ms var(--ease-out)); меню: список 30px/900 uppercase с пунктирными разделителями, у текущей страницы суффикс « ✱»; скролл документа блокируется.

### Buttons
- **Shape:** прямые углы (0), рамка 1.5px var(--ink), mono 13px/700/+0.07em uppercase, padding 15px 26px 14px.
- **Primary `.btn`:** краска на бумаге (фон ink, текст paper); hover: инверсия (прозрачный фон, текст ink). `:active`: translateY(1px), единственная трансформация нажатия.
- **Ghost `.btn--ghost`:** прозрачный с рамкой ink; hover: заливка ink.
- **Paper `.btn--paper`:** для ночных секций: фон paper, текст ink; hover: прозрачный, текст paper.
- **`.btn--wide`:** на всю ширину (submit формы брони).
- Переходы только background-color/color 140ms ease.

### Chips (пилюли саб-брендов)
- **Style:** `.pill`: mono 11px/700/+0.08em uppercase, рамка 1.5px var(--ink), radius 999px, padding 7px 14px 6px.
- **Варианты:** `--studio` #A98BC8, `--label` #9DBEEA, `--prod` #EBBE6A (фон светлее канона ради чёрного текста), `--ink`: инверсная. Не интерактивны: это типографские метки направления, ставятся над h1/h2 и в «станциях» маршрута.

### Cards / Containers
- **`.sheet-card`:** фон sheet, бордер 1px line, padding clamp(20px, 3vw, 32px), углы прямые, без тени.
- **`.coupon`:** сигнатурный контейнер (купон/талон): фон sheet, бордер line; между телами: `.coupon__tear` (перфорация с высечками); внутри часто `.barcode` (высота 44px). Используется и как итог брони (sticky aside), и как карточка успеха.

### Inputs / Fields
- **`.field`:** ярлык mono 11px/700 uppercase цвета ink-2 (flex, справа может жить `<output>`); контрол 16px на фоне бумаги, бордер 1.5px line, radius 2px; date: mono 14px uppercase.
- **Focus:** outline: none, бордер становится ink (для не-полей: глобальный `:focus-visible` 2px ink с offset 3px).
- **Error:** `.field.is-error`: бордер stamp + сообщение `.field__err` (mono 11px, цвет stamp); aria-invalid ставит booking.js.
- **Чекбокс `.check`:** строка с нижним пунктиром; квадрат 22px с рамкой ink, отметка: внутренняя заливка 12px (scale 0→1, 140ms var(--ease-out)); цена справа mono.
- **Слоты `.slot-grid`:** сетка repeat(auto-fill, minmax(74px, 1fr)), input скрыт; checked: инверсия в краску; `.is-busy`: пунктирная рамка, зачёркнуто, cursor not-allowed.
- **Радио-плашки `.radio-row`:** карточка с именем и ценой; checked: фон sheet + inset-рамка ink; hover: бордер ink.

### Signature: круглая печать (`.badge-stamp`)
Inline-SVG 360×360: подложка sheet с рамкой line, кольцевой текст по textPath (Mulish 800, textLength 938: «MAKING DOPE MUSIC SINCE 2022 ✱ STUDIO & LABEL ✱ HIGH QUALITY SOUND ONLY ✱»), в центре винил с фейдером и словесный знак DOPE MUSIC (1000). Кольцо вращается 28s linear infinite (`.badge-stamp__ring`, transform-origin 50% 50%).

### Signature: прайс-строка (`.price-row`)
Имя (700, 16.5px, опционально `.price-row__note` 13.5px ink-2) + точечная подводка + значение mono 14px/700. Работает и как прайс, и как «техническая опись» оборудования, и как список контактов. В ночных секциях цвета подводки и бордеров переназначаются inline (#4A4843, night-2).

### Ticker (`.ticker`)
Бегущая строка между листами: mono 13px uppercase ink-2, содержимое продублировано двумя `.ticker__chunk`, анимация translateX(−50%) 36s linear infinite; `aria-hidden="true"`.

### Stamp-note (`.stamp-note`)
Плашка «ручного штампа»: mono 11px/700 uppercase цвета stamp, рамка 1.5px stamp, rotate(−1.6deg). Для статусов («Заявка собрана») и noscript-предупреждений.

### FAQ (`.faq`)
Нативные details/summary: вопрос 800 clamp(16px, 1.9vw, 19px), маркер: плюс из двух 2px полос ink, при открытии вертикальная полоса поворачивается (200ms var(--ease-out)); ответ ink-2, max-width 62ch.

### Footer
Фон sheet, верхний бордер 1px var(--ink) (единственный чернильный бордер секции), grid 1.4fr 1fr 1fr, нижняя строка за пунктирным разделителем: копирайт и юридические ссылки mono 10.5px.

## Do's and Don'ts

### Do:
- **Do** собирай новую страницу как стопку листов: `.sheet` + `.running-head` (mono, разделитель ✱, `[data-datestamp]`) + `hr.cutline` между листами; ночные вставки: `.night` с `--mark-hole: var(--night)`.
- **Do** держи акценты только в пилюлях, штампах и SVG-макетах обложек; поля страницы: бумага или ночь.
- **Do** меняй на hover только цвет (background-color / color / border-color, 120–160ms ease); фокус: `:focus-visible` 2px ink.
- **Do** прячь блоки до появления только через `html.js .rv` (reveal 480ms var(--ease-out), сдвиг 14px, ступень 60ms): без JS всё видимо.
- **Do** рисуй любую графику inline-SVG в грамматике бренда: винил с «ушами», фейдер, четырёхлучевая звезда, штрих-код, печать, штриховка-паттерн; текст в SVG: те же Mulish/Martian Mono.
- **Do** уважай prefers-reduced-motion: reveal только opacity 200ms, тикер и печать останавливаются, микропереходы отключаются.
- **Do** ставь разделитель ✱ (U+2731) в моно-строках и стройфразы через двоеточия и запятые.
- **Do** используй `overflow-x: clip` на body и `text-wrap: balance` на заголовках: они уже в базе, не отменяй.

### Don't:
- **Don't** не используй цветовые градиенты, неон, глянец и тёмный дефолт музыкальных лендингов (repeating-linear-gradient в `.barcode`: печатный растр, не градиентная заливка, и не повод для других).
- **Don't** не добавляй тени; единственная допустимая: `inset 0 0 0 1px var(--ink)` на checked-радио.
- **Don't** не трансформируй элементы на hover (scale, translate, rotate запрещены; только `:active` кнопки: translateY(1px)).
- **Don't** не используй тире (em/en dash) в текстах: пожелание владельца; двоеточия и запятые.
- **Don't** не вводи радиусы кроме 0 / 2px / 999px и не скругляй карточки, кнопки, купоны.
- **Don't** не ставь фотографии: сейчас их нет вовсе; при появлении: только дуотон/зерно по брендбуку.
- **Don't** не выдумывай отзывы, награды и метрики прослушиваний; факты (адрес, телефон, резиденты, слоганы) только из PRODUCT.md, допущения помечай ASSUMPTION.
- **Don't** не подключай сторонние шрифты, иконки или CDN: только self-hosted сабсеты Mulish и Martian Mono (и не удаляй `*-latext.woff2`: там ₽).
