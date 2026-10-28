/* ============================================================
   Osmo Action 5 Pro 复刻 — 交互与动效
   IO + rAF 滚动进度 + CSS transform（DJI 同款思路，零依赖）
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 进场渐入 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 2. 次级导航：吸顶阴影 + scroll-spy ---------- */
  var subNav = document.getElementById('subNav');
  var spyLinks = subNav ? [].slice.call(subNav.querySelectorAll('.sn-tabs a[href^="#"]')) : [];
  var spySections = spyLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function updateSpy() {
    if (subNav) subNav.classList.toggle('scrolled', window.scrollY > 8);
    var current = -1;
    var mid = window.scrollY + window.innerHeight * 0.35;
    spySections.forEach(function (sec, i) {
      if (sec.offsetTop <= mid) current = i;
    });
    spyLinks.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }

  /* ---------- 3. 首屏帧序列：滚动 + 鼠标横滑推进帧 ---------- */
  var frameScrub = document.getElementById('frameScrub');
  var fsFrames = frameScrub ? [].slice.call(frameScrub.querySelectorAll('.fs-frame')) : [];
  var fsLines = frameScrub ? [].slice.call(frameScrub.querySelectorAll('.fs-textline')) : [];
  var fsBar = document.getElementById('fsBar');
  var fsLastX = null;

  function frameProgress() {
    if (!frameScrub) return 0;
    var rect = frameScrub.getBoundingClientRect();
    var total = frameScrub.offsetHeight - window.innerHeight;
    if (total <= 0) return rect.top <= 0 ? 1 : 0;
    return Math.min(1, Math.max(0, -rect.top / total));
  }

  function updateFrameScrub() {
    if (!frameScrub || window.innerWidth <= 768) return;
    var p = frameProgress();
    var idx = Math.min(fsFrames.length - 1, Math.floor(p * fsFrames.length));
    fsFrames.forEach(function (f, i) { f.classList.toggle('current', i === idx); });
    fsLines.forEach(function (t) {
      var at = parseFloat(t.getAttribute('data-at'));
      t.classList.toggle('show', p >= at && p <= at + 0.16);
    });
    if (fsBar) fsBar.style.width = (p * 100) + '%';
  }

  if (frameScrub && !prefersReduced) {
    frameScrub.style.height = '380vh';
    frameScrub.addEventListener('mousemove', function (e) {
      if (fsLastX === null) { fsLastX = e.clientX; return; }
      var dx = e.clientX - fsLastX;
      fsLastX = e.clientX;
      if (Math.abs(dx) < 3) return;
      var p = frameProgress();
      var target = Math.min(1, Math.max(0, p + dx / 5000));
      var total = frameScrub.offsetHeight - window.innerHeight;
      window.scrollTo({ top: frameScrub.offsetTop + target * total, behavior: 'auto' });
    });
    frameScrub.addEventListener('mouseleave', function () { fsLastX = null; });
  }

  /* ---------- 4. 人物跟随：双媒体 Tab 切换 ---------- */
  (function () {
    var tabs = document.querySelectorAll('#tmTabs button');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.toggle('on', t === tab); });
        document.querySelectorAll('.tm-panel').forEach(function (p, i) {
          p.classList.toggle('on', String(i) === tab.getAttribute('data-t'));
        });
      });
    });
  })();

  /* ---------- 5. 场景大卡：点击展开对应详情 ---------- */
  (function () {
    var cards = document.querySelectorAll('.sg-card[data-s]');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var idx = card.getAttribute('data-s');
        cards.forEach(function (c) { c.classList.toggle('active', c === card); });
        document.querySelectorAll('.sd-panel').forEach(function (p) {
          p.classList.toggle('on', p.id === 'sd-' + idx);
        });
      });
    });
  })();

  /* ---------- 6. 更多影像亮点折叠 ---------- */
  (function () {
    var toggle = document.getElementById('mhToggle');
    var body = document.getElementById('mhBody');
    if (!toggle || !body) return;
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      body.classList.toggle('open');
    });
  })();

  /* ---------- 7. 功能 Tab 组件（两组） ---------- */
  function bindTabs(tabsEl, panelsEl) {
    if (!tabsEl || !panelsEl) return;
    var tabs = [].slice.call(tabsEl.querySelectorAll('button[data-i]'));
    var panels = [].slice.call(panelsEl.querySelectorAll('p'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-i');
        tabs.forEach(function (t) { t.classList.toggle('on', t === tab); });
        panels.forEach(function (p, i) { p.classList.toggle('on', String(i) === key); });
      });
    });
  }
  bindTabs(document.getElementById('ftTabs1'), document.getElementById('ftPanels1'));
  bindTabs(document.getElementById('ftTabs2'), document.getElementById('ftPanels2'));

  /* ---------- 8. 3D/AR 预览 Tab ---------- */
  (function () {
    var tabs = document.querySelectorAll('.p3-tabs span[data-panel]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.toggle('on', t === tab); });
        document.querySelectorAll('.p3-panel').forEach(function (p) {
          p.classList.toggle('on', p.id === 'panel-' + tab.getAttribute('data-panel'));
        });
      });
    });
  })();

  /* ---------- 9. 数字 count-up ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var start = null, dur = 1200;
        function step(ts) {
          if (!start) start = ts;
          var prog = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - prog, 3);
          el.textContent = Math.round(target * eased);
          if (prog < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- 10. 3D 预览拖拽轻转 ---------- */
  (function () {
    var stage = document.getElementById('dragStage');
    if (!stage) return;
    var img = stage.querySelector('img');
    var dragging = false, startX = 0, baseRX = 0;
    stage.addEventListener('pointerdown', function (e) {
      dragging = true; startX = e.clientX;
      var m = img.style.transform.match(/rotateY\((-?[\d.]+)deg\)/);
      baseRX = m ? parseFloat(m[1]) : 0;
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var deg = baseRX + (e.clientX - startX) * 0.25;
      img.style.transform = 'rotateY(' + Math.max(-25, Math.min(25, deg)) + 'deg)';
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      stage.addEventListener(ev, function () { dragging = false; });
    });
  })();

  /* ---------- 11. 配件轮播拖拽 ---------- */
  (function () {
    var rail = document.getElementById('accRail');
    if (!rail) return;
    var down = false, startX = 0, startScroll = 0;
    rail.addEventListener('pointerdown', function (e) {
      down = true; startX = e.clientX; startScroll = rail.scrollLeft;
    });
    rail.addEventListener('pointermove', function (e) {
      if (!down) return;
      rail.scrollLeft = startScroll - (e.clientX - startX);
    });
    ['pointerup', 'pointerleave'].forEach(function (ev) {
      rail.addEventListener(ev, function () { down = false; });
    });
  })();

  /* ---------- 12. 统一 rAF 滚动循环 ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateSpy();
      updateFrameScrub();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);

  // 初始化
  onScroll();
})();
