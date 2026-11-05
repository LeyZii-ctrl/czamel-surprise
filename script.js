(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const ask = $('ask'), yay = $('yay');
  const yes = $('yes'), no = $('no'), hint = $('hint');
    const fx = $('fx');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- floating hearts, flowers, sparkles ---------- */
  const ICONS = ['💗','💖','💕','🌸','🌷','🌺','✨','🎀','💞'];
  function floater(icon) {
    if (reduceMotion) return;
    const s = document.createElement('span');
    s.className = 'float';
    s.textContent = icon || ICONS[Math.random() * ICONS.length | 0];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 16 + Math.random() * 26 + 'px';
    s.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
    s.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
    s.style.animationDuration = 6 + Math.random() * 6 + 's';
    fx.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
  // gentle ambient hearts from the start
  setInterval(() => floater(Math.random() < .6 ? '💗' : '🌸'), 1400);

  // sparkle wherever she taps or clicks
  document.addEventListener('pointerdown', (e) => {
    if (reduceMotion) return;
    const s = document.createElement('span');
    s.className = 'spark'; s.textContent = '✨';
    s.style.left = e.clientX - 10 + 'px'; s.style.top = e.clientY - 10 + 'px';
    fx.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  });

  /* ---------- confetti ---------- */
  const cv = $('confetti'), ctx = cv.getContext('2d');
  let parts = [], raf = 0;
  const COLORS = ['#ff7eb3','#ffb3d1','#ffd3e4','#f2528f','#ffffff','#ffc0da'];
  function fit() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
  addEventListener('resize', fit); fit();
  function confetti(n = 160) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      parts.push({
        x: innerWidth / 2, y: innerHeight * .4,
        vx: (Math.random() - .5) * 16, vy: Math.random() * -15 - 4,
        w: 6 + Math.random() * 7, h: 4 + Math.random() * 6,
        r: Math.random() * 6, vr: (Math.random() - .5) * .4,
        c: COLORS[Math.random() * COLORS.length | 0], life: 160 + Math.random() * 80
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    const k = devicePixelRatio;
    parts = parts.filter((p) => p.life-- > 0 && p.y < innerHeight + 40);
    for (const p of parts) {
      p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x * k, p.y * k); ctx.rotate(p.r);
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w * k / 2, -p.h * k / 2, p.w * k, p.h * k);
      ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, cv.width, cv.height);
  }

  /* ---------- the dodging NO button ---------- */
  const TEASES = ['Oops! Wrong button? 🥺','Are you really sure? 💗','I\'ll pretend you didn\'t click that. HAHAHA','One more chance? 🎀'];
  let dodges = 0, yesScale = 1;

  function dodge(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (no.parentElement !== document.body) {
      // keep the placeholder spot so the layout doesn't jump, and make the
      // button relative to the screen (not the card) from now on
      const r0 = no.getBoundingClientRect();
      const ph = document.createElement('span');
      ph.style.cssText = 'display:inline-block;width:' + r0.width + 'px;height:' + r0.height + 'px';
      no.before(ph);
      no.style.left = r0.left + 'px'; no.style.top = r0.top + 'px';
      no.classList.add('dodging');
      document.body.appendChild(no);
      no.getBoundingClientRect(); // flush so the next move animates
    }
    const w = no.offsetWidth, h = no.offsetHeight, m = 12;
    const maxX = innerWidth - w - m, maxY = innerHeight - h - m;
    const yr = yes.getBoundingClientRect();
    let x, y, tries = 0;
    do {
      x = m + Math.random() * Math.max(0, maxX - m);
      y = m + Math.random() * Math.max(0, maxY - m);
      tries++;
    } while (tries < 25 && x < yr.right + 14 && x + w > yr.left - 14 && y < yr.bottom + 14 && y + h > yr.top - 14);
    no.classList.add('dodging');
    no.style.left = x + 'px'; no.style.top = y + 'px';
    dodges++;
    hint.textContent = TEASES[(dodges - 1) % TEASES.length];
    yesScale = Math.min(1.5, yesScale + .05);
    yes.style.fontSize = yesScale + 'rem';
  }
  // Mouse hover, touch/pen press, keyboard focus and click all make it dodge.
  no.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') dodge(e); });
  no.addEventListener('pointerdown', dodge);
  no.addEventListener('touchstart', dodge, { passive: false });
  no.addEventListener('click', dodge);
  no.addEventListener('focus', () => dodge());
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !dodges) return;
    const r = no.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < 70) dodge();
  });
  addEventListener('resize', () => { if (dodges) dodge(); });

  /* ---------- YES! ---------- */
  yes.addEventListener('click', () => {
    ask.hidden = true; no.hidden = true;
    yay.hidden = false;
    confetti(200);
    setTimeout(() => confetti(120), 600);
    for (let i = 0; i < 28; i++) setTimeout(() => floater(), i * 90);
    setInterval(floater, 500);
    scrollTo({ top: 0 });
    $('meter').hidden = false;
    initScratch();
  });

  /* ---------- little extras ---------- */
  // tiny burst of icons from an element
  function burst(el, icons, n = 10) {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'burst'; s.textContent = icons[i % icons.length];
      s.style.left = r.left + r.width / 2 + 'px'; s.style.top = r.top + r.height / 2 + 'px';
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 70;
      s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d - 30 + 'px');
      fx.appendChild(s); s.addEventListener('animationend', () => s.remove());
    }
  }
  // re-trigger the "pop" animation on a text line
  function show(el, text) {
    el.textContent = text; el.classList.remove('pop-in'); void el.offsetWidth; el.classList.add('pop-in');
  }

  const polaroid = $('polaroid');
  const hugs = () => { burst(polaroid, ['💗','✨','🌸','💖']); confetti(50); };
  polaroid.addEventListener('click', hugs);
  polaroid.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hugs(); } });

  const REASONS = [
    'Your smile makes ordinary days feel softer. 🌷',
    'You\'re so easy to be happy about. 💗',
    'Even a short chat with you makes my day better. 🎀',
    'You make pink look even prettier. 🌸',
    'Your laugh is one of my favorite sounds. ✨',
    'You\'re just you, and that\'s already more than enough. 💞',
    'Thinking of you is a tiny happy place I like to visit. 🌷',
    'I\'m really glad you exist. ♡'
  ];
  let ri = 0;
  $('reasonBtn').addEventListener('click', (e) => {
    show($('reason'), REASONS[ri++ % REASONS.length]);
    if (ri >= 3) earn('reason');
    burst(e.currentTarget, ['💗','✨'], 6);
  });

  $('flowers').addEventListener('click', (e) => {
    const f = e.target.closest('.flower'); if (!f) return;
    document.querySelectorAll('.flower.on').forEach((x) => x.classList.remove('on'));
    f.classList.add('on');
    show($('flowerNote'), f.dataset.note);
    earn('flower');
    burst(f, [f.textContent, '✨', '💗'], 8);
  });

  $('envs').addEventListener('click', (e) => {
    const v = e.target.closest('.env'); if (!v) return;
    v.classList.add('open'); v.querySelector('b').textContent = '💖';
    show($('envNote'), v.dataset.note);
    earn('env' + Array.prototype.indexOf.call($('envs').children, v));
    burst(v, ['💌','💗','✨'], 8);
  });

  $('again').addEventListener('click', (e) => {
    confetti(220);
    for (let i = 0; i < 24; i++) setTimeout(() => floater(['🌸','🌷','💗','🌺'][i % 4]), i * 70);
  });

  /* ---------- smile meter ---------- */
  const GOALS = 8, got = new Set();   // 3 reasons, flower, 3 envelopes, card, scratch, wish
  function earn(k) {
    if (got.has(k)) return;
    got.add(k);
    const p = Math.round(got.size / GOALS * 100);
    $('meterBar').style.width = p + '%'; $('meterPct').textContent = p + '%';
    if (got.size === GOALS) {
      confetti(260);
      for (let i = 0; i < 24; i++) setTimeout(() => floater(['💗','🌸','✨'][i % 3]), i * 80);
      const d = $('doneNote'); d.hidden = false;
      show(d, 'Smile meter: 100%! You found everything, Czamel. 💗');
      d.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
  }

  /* ---------- pick a card ---------- */
  $('cards').addEventListener('click', (e) => {
    const c = e.target.closest('.pcard'); if (!c) return;
    document.querySelectorAll('.pcard.flip').forEach((x) => x !== c && x.classList.remove('flip'));
    c.classList.add('flip');
    show($('cardNote'), c.dataset.note);
    burst(c, ['💗','✨'], 6);
    earn('card');
  });

  /* ---------- scratch card ---------- */
  let scratchReady = false, scratched = false;
  function initScratch() {
    if (scratchReady) return; scratchReady = true;
    const c = $('scratchCv'), k = devicePixelRatio || 1;
    c.width = c.offsetWidth * k; c.height = c.offsetHeight * k;   // offset* ignores the card's pop-in scale
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, c.width, c.height);
    gr.addColorStop(0, '#ff9cc6'); gr.addColorStop(1, '#f2528f');
    g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '700 ' + 20 * k + 'px Quicksand, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('✨ scratch me ✨', c.width / 2, c.height / 2);
    let down = false, n = 0;
    const dig = (e) => {
      if (!down || scratched) return;
      const b = c.getBoundingClientRect(), s = c.width / b.width;
      g.globalCompositeOperation = 'destination-out';
      g.beginPath(); g.arc((e.clientX - b.left) * s, (e.clientY - b.top) * s, 20 * k, 0, 7); g.fill();
      if (++n % 8) return;
      const d = g.getImageData(0, 0, c.width, c.height).data; let t = 0, tot = 0;
      for (let i = 3; i < d.length; i += 64) { tot++; if (d[i] < 20) t++; }
      if (t / tot > .45) {
        scratched = true; c.style.transition = 'opacity .5s'; c.style.opacity = 0; c.style.pointerEvents = 'none';
        confetti(90); earn('scratch');
      }
    };
    c.addEventListener('pointerdown', (e) => { down = true; c.setPointerCapture(e.pointerId); dig(e); });
    c.addEventListener('pointermove', dig);
    ['pointerup', 'pointercancel'].forEach((t) => c.addEventListener(t, () => { down = false; }));
  }

  /* ---------- make a wish ---------- */
  const WISHES = ['Wish sent. I hope it comes true. ✨', 'The stars heard you. Keep it secret. 🌙', 'Done. Now go make it happen, pretty. 💗'];
  let wi = 0;
  $('wishBtn').addEventListener('click', (e) => {
    if (!reduceMotion) {
      const s = document.createElement('span'); s.className = 'shoot'; s.textContent = '🌠';
      document.body.appendChild(s); s.addEventListener('animationend', () => s.remove());
    }
    show($('wishNote'), WISHES[wi++ % WISHES.length]);
    burst(e.currentTarget, ['⭐','✨','💗'], 8);
    earn('wish');
  });

  /* ---------- sparkle trail behind the mouse ---------- */
  let lastTrail = 0;
  document.addEventListener('pointermove', (e) => {
    if (reduceMotion || e.pointerType !== 'mouse') return;
    const t = performance.now(); if (t - lastTrail < 70) return; lastTrail = t;
    const s = document.createElement('span'); s.className = 'trail';
    s.textContent = ['✦','♡','✧'][Math.random() * 3 | 0];
    s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
    fx.appendChild(s); s.addEventListener('animationend', () => s.remove());
  });
})();
