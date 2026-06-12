/* ============================================
   TAMIL FESTIVALS — main.js
   All animations, interactions & canvas effects
   ============================================ */

'use strict';

/* ─── UTILITY ─────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/* ─── LOADER ──────────────────────────────── */
(function initLoader() {
  const loader = $('#loader');
  const fill   = $('#loaderFill');
  if (!loader || !fill) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += rand(3, 10);
    fill.style.width = clamp(progress, 0, 95) + '%';
    if (progress >= 95) clearInterval(interval);
  }, 80);

  window.addEventListener('load', () => {
    clearInterval(interval);
    fill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      startHeroAnimations();
    }, 600);
  });

  // Fallback: hide loader after 4s even if load hasn't fired
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      fill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        startHeroAnimations();
      }, 400);
    }
  }, 4000);

  document.body.style.overflow = 'hidden';
})();

/* ─── CUSTOM CURSOR ───────────────────────── */
(function initCursor() {
  const cursor = $('#cursor');
  const trail  = $('#cursorTrail');
  if (!cursor || !trail) return;
  if (window.innerWidth <= 768) return;

  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    setTimeout(() => {
      trail.style.left = mx + 'px';
      trail.style.top  = my + 'px';
    }, 80);
  });

  document.addEventListener('mouseenter', e => {
    if (e.target && (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' ||
        e.target.closest('a') || e.target.closest('button'))) {
      cursor.classList.add('hovering');
    }
  }, true);

  document.addEventListener('mouseleave', e => {
    if (e.target && (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' ||
        e.target.closest('a') || e.target.closest('button'))) {
      cursor.classList.remove('hovering');
    }
  }, true);
})();

/* ─── MOBILE MENU ─────────────────────────── */
(function initMobileMenu() {
  const btn   = $('#menuBtn');
  const menu  = $('#mobileMenu');
  const close = $('#menuClose');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => menu.classList.add('open'));
  close && close.addEventListener('click', () => menu.classList.remove('open'));

  $$('.mobile-nav-link', menu).forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
})();

/* ─── NAV SCROLL EFFECT ───────────────────── */
(function initNav() {
  const nav = $('#mainNav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── HERO CANVAS ─────────────────────────── */
function initHeroCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], birds = [], sunY;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    sunY = H * 0.28;
    buildStars();
  }

  function buildStars() {
    stars = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: rand(0, W), y: rand(0, H * 0.7),
        r: rand(0.4, 1.6), a: rand(0.2, 0.9),
        speed: rand(0.002, 0.006)
      });
    }
  }

  function buildBirds() {
    birds = [];
    for (let i = 0; i < 8; i++) {
      birds.push({
        x: rand(-200, -50), y: rand(H * 0.12, H * 0.35),
        speed: rand(0.6, 1.4), wing: 0, wingDir: 1,
        scale: rand(0.5, 1)
      });
    }
  }

  function drawSky() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   '#000000');
    grad.addColorStop(0.3, '#0D0A06');
    grad.addColorStop(0.6, '#1a0800');
    grad.addColorStop(0.8, '#3d1200');
    grad.addColorStop(1,   '#0D0A06');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function drawSun(t) {
    const x = W / 2;
    const y = sunY + Math.sin(t * 0.0003) * 4;

    // Outer glow layers
    [80, 55, 35, 20].forEach((r, i) => {
      const alpha = [0.03, 0.06, 0.12, 0.25][i];
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0,   `rgba(255,180,60,${alpha})`);
      g.addColorStop(1,   'rgba(255,120,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sun disc
    const disc = ctx.createRadialGradient(x, y, 0, x, y, 14);
    disc.addColorStop(0,   '#fff8e0');
    disc.addColorStop(0.4, '#FFD700');
    disc.addColorStop(1,   '#FF8C00');
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStars(t) {
    stars.forEach(s => {
      s.a += s.speed * Math.sin(t * 0.001 + s.x);
      const alpha = clamp(s.a, 0.1, 0.95);
      ctx.fillStyle = `rgba(255,240,200,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawBird(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(b.scale, b.scale);
    ctx.strokeStyle = 'rgba(200,150,62,0.7)';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const w = b.wing;
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-8, -w, -16, 0);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, -w, 16, 0);
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles(t) {
    // Floating dust / particles near temple
    for (let i = 0; i < 3; i++) {
      const x = (W * 0.3) + Math.sin(t * 0.0004 + i * 2) * 60;
      const y = H * 0.85 + Math.cos(t * 0.0003 + i) * 20;
      ctx.fillStyle = `rgba(200,150,62,${0.05 + Math.sin(t * 0.001 + i) * 0.03})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawRiverGlow() {
    const grad = ctx.createLinearGradient(0, H * 0.82, 0, H);
    grad.addColorStop(0, 'rgba(200,150,62,0.04)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, H * 0.82, W, H * 0.18);
  }

  let animId;
  function render(t = 0) {
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawStars(t);
    drawSun(t);
    drawRiverGlow();
    drawParticles(t);

    birds.forEach(b => {
      b.x += b.speed;
      b.wing += b.wingDir * 0.12;
      if (b.wing > 5 || b.wing < -1) b.wingDir *= -1;
      if (b.x > W + 80) { b.x = -80; b.y = rand(H * 0.12, H * 0.35); }
      drawBird(b);
    });

    animId = requestAnimationFrame(render);
  }

  resize();
  buildBirds();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
  render();
}

/* ─── HERO TEXT ANIMATION ─────────────────── */
function startHeroAnimations() {
  $$('.hero-title-line').forEach(line => {
    const inner = document.createElement('span');
    inner.innerHTML = line.innerHTML;
    line.innerHTML = '';
    line.appendChild(inner);
  });

  // Floating symbols stagger-in
  $$('.float-sym').forEach((sym, i) => {
    sym.style.opacity = '0';
    setTimeout(() => {
      sym.style.transition = 'opacity 1s ease';
      sym.style.opacity    = '0.4';
    }, 1200 + i * 200);
  });
}

/* ─── SCROLL REVEAL ───────────────────────── */
(function initScrollReveal() {
  const items = $$('[data-reveal]');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();

/* ─── SPIRIT CARDS STAGGER ────────────────── */
(function initSpiritCards() {
  const cards = $$('.spirit-card');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = cards.indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
        }, idx * 120);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    io.observe(card);
  });
})();

/* ─── PONGAL POT INTERACTION ──────────────── */
(function initPongalPot() {
  const btn      = $('#pongalBtn');
  const milk     = $('#potMilk');
  const overflow = $('#potOverflow');
  const modal    = $('#pongalModal');
  const pmClose  = $('#pmClose');
  if (!btn) return;

  let celebrated = false;

  // Auto-fill milk on scroll into view
  const pot = $('#pongalPot');
  if (pot) {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && milk) {
        setTimeout(() => { milk.style.height = '55%'; }, 400);
        io.unobserve(pot);
      }
    }, { threshold: 0.4 });
    io.observe(pot);
  }

  btn.addEventListener('click', () => {
    if (celebrated) return;
    celebrated = true;

    btn.classList.add('celebrating');
    btn.textContent = 'பொங்கலோ பொங்கல்! 🎉';

    // Overflow milk
    if (milk) milk.style.height = '110%';
    if (overflow) {
      overflow.style.height = '18px';
      overflow.style.width  = '80px';
    }

    // Confetti burst
    launchConfetti(120);

    // Show modal
    setTimeout(() => {
      if (modal) modal.classList.add('active');
    }, 700);
  });

  if (pmClose) {
    pmClose.addEventListener('click', () => {
      modal && modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
})();

/* ─── CONFETTI ────────────────────────────── */
function launchConfetti(count = 80) {
  const container = $('#confettiContainer');
  if (!container) return;

  const colors = ['#C8963E','#8B1A1A','#E8A020','#FFD700','#E8748A','#2D6A4F','#FF8C00'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${rand(5, 95)}%;
      background: ${colors[Math.floor(rand(0, colors.length))]};
      width: ${rand(6, 12)}px;
      height: ${rand(6, 12)}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-delay: ${rand(0, 1.5)}s;
      animation-duration: ${rand(2.5, 4)}s;
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

/* ─── DEEPAM CANVAS (lamps + glow) ───────── */
(function initDeepamCanvas() {
  const canvas = $('#deepamCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let lamps = [];
  let visible = false;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildLamps();
  }

  function buildLamps() {
    lamps = [];
    const cols = Math.floor(W / 55);
    const rows = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        lamps.push({
          x: (c + 0.5) * (W / cols),
          y: H * 0.68 + r * 38,
          phase: rand(0, Math.PI * 2),
          speed: rand(0.015, 0.04),
          size:  rand(4, 7),
          alpha: rand(0.3, 0.7),
          lit: false,
          litAt: rand(0, 2000)
        });
      }
    }
  }

  function drawFlame(x, y, size, alpha, t, phase) {
    const flicker = 1 + Math.sin(t * 0.05 + phase) * 0.15;
    const s = size * flicker;

    // Outer glow
    const g1 = ctx.createRadialGradient(x, y, 0, x, y, s * 5);
    g1.addColorStop(0,   `rgba(255,160,30,${alpha * 0.4})`);
    g1.addColorStop(0.4, `rgba(255,100,10,${alpha * 0.15})`);
    g1.addColorStop(1,   'rgba(255,60,0,0)');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(x, y, s * 5, 0, Math.PI * 2);
    ctx.fill();

    // Inner flame
    const g2 = ctx.createRadialGradient(x, y - s * 0.4, 0, x, y, s * 1.6);
    g2.addColorStop(0,   `rgba(255,255,200,${alpha})`);
    g2.addColorStop(0.3, `rgba(255,220,80,${alpha * 0.9})`);
    g2.addColorStop(0.7, `rgba(255,100,20,${alpha * 0.6})`);
    g2.addColorStop(1,   'rgba(200,50,0,0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.ellipse(x, y - s * 0.3, s * 0.7, s * 1.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGroundGlow() {
    const g = ctx.createLinearGradient(0, H * 0.6, 0, H);
    g.addColorStop(0,   'rgba(255,120,30,0.06)');
    g.addColorStop(0.5, 'rgba(200,80,10,0.03)');
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, H * 0.6, W, H * 0.4);
  }

  let animId;
  let startTime = null;

  function render(t = 0) {
    if (!startTime) startTime = t;
    const elapsed = t - startTime;

    ctx.clearRect(0, 0, W, H);

    if (visible) {
      lamps.forEach(lamp => {
        if (!lamp.lit && elapsed > lamp.litAt) lamp.lit = true;
        if (lamp.lit) {
          drawFlame(lamp.x, lamp.y, lamp.size, lamp.alpha, elapsed, lamp.phase);
        }
      });
      drawGroundGlow();
    }

    animId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Start when section enters view
  const section = $('#deepam');
  if (section) {
    const io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    io.observe(section);
  }

  render();
})();

/* ─── DEEPAM LAMP GRID (HTML lamps) ──────── */
(function initLampsGrid() {
  const grid = $('#lampsGrid');
  if (!grid) return;

  const count = 40;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('div');
    item.className = 'lamp-item';
    item.style.animationDelay = rand(0, 2) + 's';
    item.innerHTML = `
      <div class="lamp-flame">🪔</div>
      <div class="lamp-body"></div>
    `;
    item.title = 'A lamp for Karthigai Deepam';

    item.addEventListener('mouseenter', () => {
      item.style.filter = 'drop-shadow(0 0 16px rgba(255,140,0,0.9))';
    });
    item.addEventListener('mouseleave', () => {
      item.style.filter = '';
    });

    grid.appendChild(item);
  }

  // Stagger reveal
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      $$('.lamp-item', grid).forEach((lamp, i) => {
        lamp.style.opacity   = '0';
        lamp.style.transform = 'translateY(16px)';
        lamp.style.transition = `opacity 0.4s ease ${i * 28}ms, transform 0.4s ease ${i * 28}ms`;
        setTimeout(() => {
          lamp.style.opacity   = '1';
          lamp.style.transform = 'translateY(0)';
        }, i * 28 + 100);
      });
      io.unobserve(grid);
    }
  }, { threshold: 0.2 });

  io.observe(grid);
})();

/* ─── DEEPAVALI FIREWORKS CANVAS ──────────── */
(function initDeepavaliCanvas() {
  const canvas = $('#deepavaliCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [];
  let rockets   = [];
  let visible   = false;
  let lastRocket = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x; this.y = y;
      this.vx = rand(-4, 4);
      this.vy = rand(-5, 1);
      this.alpha = 1;
      this.decay = rand(0.012, 0.025);
      this.size  = rand(2, 4);
      this.color = color;
      this.trail = [];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 5) this.trail.shift();
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // gravity
      this.vx *= 0.98;
      this.alpha -= this.decay;
    }
    draw() {
      // Trail
      this.trail.forEach((pt, i) => {
        const a = (i / this.trail.length) * this.alpha * 0.3;
        ctx.fillStyle = `rgba(${this.color},${a})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, this.size * (i / this.trail.length), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    isDead() { return this.alpha <= 0; }
  }

  class Rocket {
    constructor() {
      this.x  = rand(W * 0.2, W * 0.8);
      this.y  = H;
      this.tx = rand(W * 0.15, W * 0.85);
      this.ty = rand(H * 0.1, H * 0.45);
      this.speed = rand(5, 9);
      const dx = this.tx - this.x;
      const dy = this.ty - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      this.vx = (dx / dist) * this.speed;
      this.vy = (dy / dist) * this.speed;
      this.color = this.randomColor();
      this.trail = [];
      this.exploded = false;
    }
    randomColor() {
      const colors = [
        '255,220,80', '255,150,50', '200,80,255',
        '80,200,255', '255,80,120', '80,255,150',
        '255,200,80', '255,100,80'
      ];
      return colors[Math.floor(rand(0, colors.length))];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 8) this.trail.shift();
      this.x += this.vx;
      this.y += this.vy;
      const dx = this.tx - this.x;
      const dy = this.ty - this.y;
      if (Math.sqrt(dx * dx + dy * dy) < 10) this.explode();
    }
    explode() {
      this.exploded = true;
      const count = Math.floor(rand(60, 100));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(this.x, this.y, this.color));
      }
      // Shockwave particles
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const p = new Particle(this.x, this.y, this.color);
        p.vx = Math.cos(angle) * rand(3, 7);
        p.vy = Math.sin(angle) * rand(3, 7);
        particles.push(p);
      }
    }
    draw() {
      this.trail.forEach((pt, i) => {
        const a = (i / this.trail.length) * 0.6;
        ctx.fillStyle = `rgba(${this.color},${a})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = `rgba(${this.color},1)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    isDead() { return this.exploded; }
  }

  let animId;

  function render(t = 0) {
    if (!visible) {
      animId = requestAnimationFrame(render);
      return;
    }

    ctx.fillStyle = 'rgba(8,5,0,0.22)';
    ctx.fillRect(0, 0, W, H);

    // Launch rocket
    if (t - lastRocket > rand(800, 1800)) {
      rockets.push(new Rocket());
      lastRocket = t;
    }

    rockets = rockets.filter(r => !r.isDead());
    rockets.forEach(r => { r.update(); r.draw(); });

    particles = particles.filter(p => !p.isDead());
    particles.forEach(p => { p.update(); p.draw(); });

    animId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const section = $('#deepavali');
  if (section) {
    const io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) ctx.clearRect(0, 0, W, H);
    }, { threshold: 0.15 });
    io.observe(section);
  }

  render();
})();

/* ─── HERO CANVAS INIT ────────────────────── */
// Called after DOM ready & loader
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
});

/* ─── CLOSING PARTICLES ───────────────────── */
(function initClosingParticles() {
  const container = $('#closingParticles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;
  let pts = [];

  function resize() {
    W = canvas.width  = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }

  function buildPoints() {
    pts = [];
    for (let i = 0; i < 60; i++) {
      pts.push({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.3, 0.3), vy: rand(-0.6, -0.15),
        r: rand(1, 3), alpha: rand(0.1, 0.5),
        decay: rand(0.001, 0.004)
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0 || p.y < -10) {
        p.x = rand(0, W); p.y = H + 10;
        p.alpha = rand(0.1, 0.5);
      }
      ctx.fillStyle = `rgba(200,150,62,${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(render);
  }

  resize();
  buildPoints();
  window.addEventListener('resize', () => { resize(); buildPoints(); }, { passive: true });

  const section = container.closest('section');
  if (section) {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) render();
    }, { threshold: 0.1 });
    io.observe(section);
  }
})();

/* ─── TIMELINE STAGGER ────────────────────── */
(function initTimeline() {
  const items = $$('.timeline-item');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      items.forEach((item, i) => {
        item.style.opacity   = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`;
        setTimeout(() => {
          item.style.opacity   = '1';
          item.style.transform = 'translateY(0)';
        }, i * 100 + 200);
      });
      io.unobserve(entries[0].target);
    }
  }, { threshold: 0.3 });

  const tl = $('.timeline');
  if (tl) io.observe(tl);
})();

/* ─── EXPLORE CARDS STAGGER ───────────────── */
(function initExploreCards() {
  const cards = $$('.explore-card');
  if (!cards.length) return;

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cards.forEach((card, i) => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity 0.55s ease ${i * 80}ms, transform 0.55s ease ${i * 80}ms`;
        setTimeout(() => {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80 + 100);
      });
      io.disconnect();
    }
  }, { threshold: 0.1 });

  const grid = $('.explore-grid');
  if (grid) io.observe(grid);
})();

/* ─── COUNTER ANIMATION ───────────────────── */
(function initCounters() {
  const counters = $$('.cf-num');
  if (!counters.length) return;

  function animateCounter(el) {
    const raw   = el.textContent.trim();
    const isPlus = raw.endsWith('+');
    const isM    = raw.includes('M');
    let target;

    if (isM) target = parseFloat(raw) * 1000000;
    else     target = parseInt(raw.replace(/\D/g, ''));

    if (isNaN(target)) return;

    let current  = 0;
    const duration = 1800;
    const steps    = 60;
    const increment = target / steps;
    let step = 0;

    const interval = setInterval(() => {
      current += increment;
      step++;
      let display = Math.floor(current);
      if (isM)    display = (display / 1000000).toFixed(0) + 'M';
      else        display = display.toLocaleString();
      el.textContent = display + (isPlus ? '+' : '');
      if (step >= steps) {
        el.textContent = raw;
        clearInterval(interval);
      }
    }, duration / steps);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();

/* ─── MAP POINTS STAGGER ──────────────────── */
(function initMapPoints() {
  const points = $$('.map-point');
  if (!points.length) return;

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      points.forEach((pt, i) => {
        pt.style.opacity   = '0';
        pt.style.transform = 'scale(0)';
        pt.style.transition = `opacity 0.4s ease ${i * 150}ms, transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275) ${i * 150}ms`;
        setTimeout(() => {
          pt.style.opacity   = '1';
          pt.style.transform = 'scale(1)';
        }, i * 150 + 200);
      });
      io.disconnect();
    }
  }, { threshold: 0.3 });

  const wrapper = $('.tn-map-wrapper');
  if (wrapper) io.observe(wrapper);
})();

/* ─── NAV ACTIVE LINK ON SCROLL ───────────── */
(function initNavActive() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();

/* ─── SMOOTH ANCHOR SCROLL ────────────────── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id  = link.getAttribute('href').slice(1);
      const el  = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ─── GOLU DOLLS INTERACTION ──────────────── */
(function initGoluDolls() {
  $$('.golu-doll').forEach(doll => {
    doll.addEventListener('click', () => {
      doll.style.transform = 'scale(1.5) translateY(-8px) rotate(10deg)';
      doll.style.transition = 'transform 0.2s ease';
      setTimeout(() => {
        doll.style.transform = '';
      }, 400);

      // Mini confetti on click
      launchConfetti(20);
    });
  });
})();

/* ─── PARALLAX ON HERO TEMPLE ─────────────── */
(function initParallax() {
  const temple = $('.hero-temple');
  if (!temple) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      temple.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
})();

/* ─── KOLAM ANIMATION TRIGGER ─────────────── */
(function initKolam() {
  const svg = $('.kolam-anim-svg');
  if (!svg) return;

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      $$('.kline', svg).forEach(line => {
        // Trigger animation by re-adding the class
        line.style.animationPlayState = 'running';
      });
      io.unobserve(svg);
    }
  }, { threshold: 0.5 });

  io.observe(svg);
})();

/* ─── CHAPTER TITLE REVEAL ────────────────── */
(function initChapterTitles() {
  const titles = $$('.chapter-title');
  if (!titles.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  titles.forEach(t => {
    t.style.opacity   = '0';
    t.style.transform = 'translateY(30px)';
    t.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    io.observe(t);
  });
})();

/* ─── DAYS CARDS HOVER GLOW ───────────────── */
(function initDayCards() {
  $$('.day-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 8px 32px rgba(200,150,62,0.15)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
})();

/* ─── SPIRIT CARD PARALLAX ────────────────── */
(function initCardMicroParallax() {
  if (window.innerWidth < 768) return;

  $$('.spirit-card, .ds-card, .nv-card, .dv-feature').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / rect.width;
      const dy   = (e.clientY - cy) / rect.height;
      card.style.transform = `translateY(-4px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
})();

/* ─── SECTION BACKGROUND TINT ON SCROLL ───── */
(function initSectionTints() {
  const sectionColors = {
    'pongal':     'rgba(232,160,32,0.015)',
    'deepam':     'rgba(255,140,0,0.015)',
    'navaratri':  'rgba(155,89,182,0.015)',
    'deepavali':  'rgba(255,215,0,0.015)',
    'chithirai':  'rgba(192,57,43,0.015)',
  };

  Object.entries(sectionColors).forEach(([id, color]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      document.body.style.backgroundColor = entries[0].isIntersecting ? color : '';
    }, { threshold: 0.4 });
    io.observe(el);
  });
})();

/* ─── FINAL READY LOG ─────────────────────── */
window.addEventListener('load', () => {
  console.log('%c🪔 Tamil Nadu Festivals', 'font-size:18px;color:#C8963E;font-weight:bold;');
  console.log('%cWhere Every Festival Tells a Story.', 'font-size:12px;color:#A09070;');
  console.log('%cgithub.com/[your-username]/where-every-festival-tells-a-story', 'font-size:11px;color:#6B5B45;');
});
