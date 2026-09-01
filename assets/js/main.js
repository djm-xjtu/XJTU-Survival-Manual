/* 西安交大生存指南 · interactions */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var base = window.SITE_BASEURL || '';

  /* ---------- theme ---------- */
  var themeBtn = $('#theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('xjtu-theme', next); } catch (e) {}
    });
  }

  /* ---------- header shadow + progress + to-top ---------- */
  var header = $('#site-header');
  var progress = $('#reading-progress');
  var progressBar = progress ? progress.firstElementChild : null;
  var progressText = $('#doc-progress-text');
  var toTop = $('#to-top');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (toTop) toTop.classList.toggle('show', y > 420);
    if (progressBar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? Math.min(100, Math.max(0, (y / h) * 100)) : 0;
      progressBar.style.width = pct + '%';
      if (progressText) progressText.textContent = '已读 ' + Math.round(pct) + '%';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---------- mobile drawer ---------- */
  var drawer = $('#mobile-drawer');
  function openDrawer() { if (drawer) { drawer.hidden = false; document.body.style.overflow = 'hidden'; } }
  function closeDrawer() { if (drawer) { drawer.hidden = true; document.body.style.overflow = ''; } }
  var menuBtn = $('#menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  var drawerClose = $('#drawer-close');
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });

  /* ---------- headings: ids + anchors + TOC ---------- */
  var article = $('#article-content');
  var tocEl = $('#toc');
  if (article) {
    var used = {};
    var heads = $$('h2, h3, h4', article).filter(function (h) { return h.textContent.trim().length > 0; });

    heads.forEach(function (h, i) {
      var id = h.id;
      if (!id) {
        id = h.textContent.trim().replace(/\s+/g, '-').replace(/[^\u4e00-\u9fa5\w-]/g, '').slice(0, 40) || 'sec';
      }
      if (used[id]) { id = id + '-' + i; }
      used[id] = true;
      h.id = id;
      var a = document.createElement('a');
      a.className = 'anchor';
      a.href = '#' + id;
      a.setAttribute('aria-label', '本节链接');
      a.textContent = '#';
      h.insertBefore(a, h.firstChild);
    });

    var links = [];
    if (heads.length && tocEl) {
      var frag = document.createDocumentFragment();
      var fragInline = document.createDocumentFragment();
      heads.forEach(function (h) {
        var lvl = h.tagName.toLowerCase();
        var text = h.textContent.replace(/^#/, '').trim();
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = text;
        a.title = text;
        a.className = lvl === 'h3' ? 'lv3' : (lvl === 'h4' ? 'lv4' : 'lv2');
        frag.appendChild(a);
        links.push({ a: a, h: h });
        fragInline.appendChild(a.cloneNode(true));
      });
      tocEl.appendChild(frag);

      var inline = $('#toc-inline');
      if (inline && heads.length > 1) {
        $('.toc-inline-body', inline).appendChild(fragInline);
        var cnt = $('.toc-count', inline);
        if (cnt) cnt.textContent = ' · ' + heads.length + ' 节';
        inline.hidden = false;
        inline.classList.add('ready');
      }
    } else {
      var shell = document.querySelector('.doc-shell');
      if (shell) shell.classList.add('no-toc');
    }

    // scroll spy
    if (links.length) {
      var spy = function () {
        var top = (window.pageYOffset || document.documentElement.scrollTop) + 140;
        var cur = links[0];
        for (var i = 0; i < links.length; i++) {
          if (links[i].h.offsetTop <= top) cur = links[i]; else break;
        }
        links.forEach(function (l) { l.a.classList.toggle('active', l === cur); });
        var box = tocEl.parentElement;
        if (cur && box && box.scrollHeight > box.clientHeight) {
          var rel = cur.a.offsetTop - box.scrollTop;
          if (rel < 40 || rel > box.clientHeight - 60) box.scrollTop = cur.a.offsetTop - box.clientHeight / 2;
        }
      };
      var spyTick = false;
      window.addEventListener('scroll', function () {
        if (!spyTick) { spyTick = true; window.requestAnimationFrame(function () { spy(); spyTick = false; }); }
      }, { passive: true });
      spy();
    }

    // external links open in new tab
    $$('a[href^="http"]', article).forEach(function (a) {
      if (a.hostname !== window.location.hostname) { a.target = '_blank'; a.rel = 'noopener'; }
    });
  }

  /* ---------- home card filter ---------- */
  var filter = $('#card-filter');
  if (filter) {
    var cards = $$('.card');
    var emptyTip = $('#empty-tip');
    filter.addEventListener('input', function () {
      var q = filter.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var hit = !q || (c.dataset.title || '').toLowerCase().indexOf(q) > -1;
        c.style.display = hit ? '' : 'none';
        if (hit) shown++;
      });
      $$('.card-grid').forEach(function (g) {
        var any = $$('.card', g).some(function (c) { return c.style.display !== 'none'; });
        g.style.display = any ? '' : 'none';
      });
      if (emptyTip) emptyTip.hidden = shown !== 0;
    });
  }

  /* ---------- search ---------- */
  var modal = $('#search-modal');
  var input = $('#search-input');
  var results = $('#search-results');
  var data = null, loading = false, selIdx = -1;

  function loadData(cb) {
    if (data) { cb(data); return; }
    if (loading) return;
    loading = true;
    fetch(base + '/search.json')
      .then(function (r) { return r.json(); })
      .then(function (j) { data = j; loading = false; cb(j); })
      .catch(function () { loading = false; results.innerHTML = '<p class="search-empty">索引加载失败，请刷新重试。</p>'; });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; });
  }

  function snippet(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return escapeHtml(text.slice(0, 90)) + '…';
    var s = Math.max(0, i - 32);
    var raw = (s > 0 ? '…' : '') + text.slice(s, i + q.length + 70) + '…';
    return escapeHtml(raw).replace(new RegExp(escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), function (m) { return '<mark>' + m + '</mark>'; });
  }

  function render(q) {
    if (!q) {
      results.innerHTML = '<p class="search-hint">输入关键词开始搜索，支持全文检索所有文章。</p>';
      return;
    }
    loadData(function (list) {
      var lower = q.toLowerCase();
      var hits = [];
      list.forEach(function (item) {
        var titleHit = item.title.toLowerCase().indexOf(lower) > -1 || (item.summary || '').toLowerCase().indexOf(lower) > -1;
        var bodyHit = (item.content || '').toLowerCase().indexOf(lower) > -1;
        if (titleHit || bodyHit) {
          hits.push({ item: item, score: titleHit ? 0 : 1 });
        }
      });
      hits.sort(function (a, b) { return a.score - b.score; });
      if (!hits.length) {
        results.innerHTML = '<p class="search-empty">没有找到「' + escapeHtml(q) + '」相关内容</p>';
        return;
      }
      results.innerHTML = hits.slice(0, 12).map(function (h) {
        var it = h.item;
        var src = h.score === 0 ? (it.summary || it.content || '') : (it.content || '');
        return '<a class="sr-item" href="' + it.url + '">' +
          '<div class="sr-top"><span class="sr-title">' + (it.icon || '') + ' ' + escapeHtml(it.title) + '</span>' +
          '<span class="sr-cat">' + escapeHtml(it.category || '') + '</span></div>' +
          '<p class="sr-snippet">' + snippet(src, q) + '</p></a>';
      }).join('');
      selIdx = -1;
    });
  }

  function openSearch() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    loadData(function () {});
    setTimeout(function () { input.focus(); input.select(); }, 30);
  }
  function closeSearch() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  $$('.search-trigger').forEach(function (b) { b.addEventListener('click', openSearch); });
  $$('[data-close-search]').forEach(function (b) { b.addEventListener('click', closeSearch); });

  if (input) {
    var timer;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var v = input.value.trim();
      timer = setTimeout(function () { render(v); }, 120);
    });
    input.addEventListener('keydown', function (e) {
      var items = $$('.sr-item', results);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!items.length) return;
        selIdx = e.key === 'ArrowDown' ? Math.min(items.length - 1, selIdx + 1) : Math.max(0, selIdx - 1);
        items.forEach(function (it, i) { it.classList.toggle('sel', i === selIdx); });
        items[selIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        if (selIdx > -1 && items[selIdx]) { window.location.href = items[selIdx].getAttribute('href'); }
        else if (items[0]) { window.location.href = items[0].getAttribute('href'); }
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) || e.target.isContentEditable;
    if (e.key === 'Escape') { closeSearch(); closeDrawer(); return; }
    if (!typing && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
      e.preventDefault();
      openSearch();
    }
    if (!typing && !modal.hidden) return;
    // 文章间快捷跳转
    if (!typing && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      var sel = e.key === 'ArrowLeft' ? '.pager-item.prev' : '.pager-item.next';
      var link = $(sel);
      if (link && link.tagName === 'A') window.location.href = link.getAttribute('href');
    }
  });

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var targets = $$('.card, .res-card, .section-head');
    targets.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity .5s cubic-bezier(.22,.61,.36,1) ' + Math.min(i % 6 * 0.05, .3) + 's, transform .5s cubic-bezier(.22,.61,.36,1) ' + Math.min(i % 6 * 0.05, .3) + 's';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'none';
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });
  }
})();
