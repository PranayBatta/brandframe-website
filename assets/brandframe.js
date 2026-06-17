/* ── VIDEO SOURCES ─────────────────────────────────────
   Replace null with your embed URL:
   YouTube: 'https://www.youtube.com/embed/VIDEO_ID'
   Vimeo:   'https://player.vimeo.com/video/VIDEO_ID'
──────────────────────────────────────────────────── */
const VS = { 
  reel: 'https://www.youtube.com/embed/1pYDu0Nlbj4', 
  spec2: 'https://www.youtube.com/embed/VwPgefpBInU', 
  brands: 'https://www.youtube.com/embed/cwAExHg6ETc', 
  d2c: 'https://www.youtube.com/embed/X3IydJQZceU', 
  social: null, 
  product: null 
};

/* ── SCROLL PROGRESS ── */
const prog = document.getElementById('scroll-prog');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  prog.style.transform = 'scaleX(' + pct + ')';
}, { passive: true });

/* ── THEME ── */
function toggleTheme() {
  const h = document.documentElement;
  h.dataset.theme = h.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('bf-theme', h.dataset.theme);
}
(function(){ const t = localStorage.getItem('bf-theme'); if(t) document.documentElement.dataset.theme = t; })();

/* ── NAV SCROLL ── */
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => { navEl.classList.toggle('scrolled', window.scrollY > 20); }, { passive: true });

/* ── SCROLL HINT ── */
const hint = document.getElementById('scrollHint');
if(hint) window.addEventListener('scroll', () => { hint.classList.toggle('gone', window.scrollY > 80); }, { passive: true });

/* ── REVEAL ── */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('on'); revObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.rv').forEach(el => revObs.observe(el));

/* ── PROCESS TIMELINE ── */
const pg = document.getElementById('processG');
if(pg){
  const pObs = new IntersectionObserver(([e]) => {
    if(e.isIntersecting){ pg.classList.add('on'); pObs.disconnect(); }
  }, { threshold: 0.15 });
  pObs.observe(pg);
}

/* ── FOOTER CONVERGE MARK ── */
const ftMark = document.querySelector('.ft-bars');
if(ftMark){
  const ftObs = new IntersectionObserver(([e]) => {
    if(e.isIntersecting){
      ftMark.querySelectorAll('.ft-bar').forEach(b => b.classList.add('on'));
      ftObs.disconnect();
    }
  }, { threshold: 0.5 });
  ftObs.observe(ftMark);
}

/* ── VERTICAL STRIPES: scroll parallax + hover repulsion ── */
(function(){
  const vss = [...document.querySelectorAll('.vs')];
  if(!vss.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const RATES  = [0.016, 0.026, 0.020, 0.011];
  const LEFTS  = [0.07,  0.25,  0.67,  0.85];
  const BASE_O = [0.16,  0.13,  0.14,  0.11];
  const hoverX = [0, 0, 0, 0];
  let mouseX = -9999, scrollY = 0;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; }, { passive: true });
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  function tick(){
    const vw = window.innerWidth;
    vss.forEach((vs, i) => {
      const sx = vw * LEFTS[i];
      const dist = Math.abs(mouseX - sx);
      const maxD = 200;
      let tx = 0, op = BASE_O[i];
      if(dist < maxD && mouseX > 0){
        const t = 1 - dist / maxD;
        tx  = (mouseX > sx ? 1 : -1) * t * 34;
        op  = BASE_O[i] + t * 0.30;
      }
      hoverX[i] += (tx - hoverX[i]) * 0.10;
      vs.style.transform = 'translateY(' + (scrollY * RATES[i]).toFixed(1) + 'px) translateX(' + hoverX[i].toFixed(1) + 'px)';
      vs.style.opacity = op.toFixed(3);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ── TEXT SCRAMBLE ── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function scramble(el) {
  if(el.dataset.scrambled) return;
  el.dataset.scrambled = '1';
  const orig = el.textContent;
  const len = orig.length;
  let f = 0;
  const tick = () => {
    el.textContent = orig.split('').map((c,i) => {
      if(c === ' ' || c === '.' || c === ',') return c;
      if(i < f * 3) return orig[i];
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    if(f++ * 3 < len) requestAnimationFrame(tick);
    else el.textContent = orig;
  };
  requestAnimationFrame(tick);
}
const scrObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){ setTimeout(() => scramble(e.target), 80); scrObs.unobserve(e.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.scramble').forEach(el => scrObs.observe(el));

/* ── STAT COUNTERS + RINGS ── */
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const el  = e.target;
    const arc = el.closest('.stat-item') && el.closest('.stat-item').querySelector('.sring-arc');
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    const targetOffset = arc ? parseFloat(arc.dataset.offset) : 0;
    if(arc) setTimeout(() => { arc.style.strokeDashoffset = targetOffset + 'px'; }, 200);
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(ease * target) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => statObs.observe(el));

/* ── MOBILE NAV ── */
function toggleMnav(){
  const mn = document.getElementById('mnav');
  const open = mn.classList.toggle('open');
  const hamBtn = document.querySelector('.ham');
  if(hamBtn) hamBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMnav(){
  const mn = document.getElementById('mnav');
  if(mn) mn.classList.remove('open');
  const hamBtn = document.querySelector('.ham');
  if(hamBtn) hamBtn.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}

/* ── VIDEO MODAL ── */
function openVideo(id){
  const modal = document.getElementById('vmodal');
  const embed = document.getElementById('vembed');
  if(!modal || !embed) return;
  const src = VS[id];
  if(src){
    embed.className = 'vmod-embed';
    embed.innerHTML = '<iframe src="' + src + '?autoplay=1&rel=0" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen title="BrandFrame video"></iframe>';
  } else {
    embed.className = 'vmod-ph';
    embed.innerHTML = '<div class="label">Video coming soon</div><p>Open the HTML file, find <code>VS["' + id + '"]</code> and replace <code>null</code> with your YouTube or Vimeo embed URL.</p>';
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeVideo(){
  const embed = document.getElementById('vembed');
  const modal = document.getElementById('vmodal');
  if(embed){ embed.innerHTML = ''; embed.className = 'vmod-embed'; }
  if(modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
(function(){
  var _vm = document.getElementById('vmodal');
  if(_vm){ _vm.addEventListener('click', e => { if(e.target === _vm) closeVideo(); }); }
})();
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeVideo(); });
document.querySelectorAll('[tabindex="0"][onclick]').forEach(el => {
  el.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
});

/* ── HERO TIMECODE TICKER ── */
(function(){
  const tc = document.getElementById('edlTc');
  if(!tc || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let f = 4*24 + 12;
  setInterval(() => {
    f = (f + 1) % (60*60*24);
    const fr = f % 24, s = Math.floor(f/24)%60, m = Math.floor(f/(24*60))%60, h = Math.floor(f/(24*60*60))%24;
    const p = n => String(n).padStart(2,'0');
    tc.textContent = p(h)+':'+p(m)+':'+p(s)+':'+p(fr);
  }, 1000/24);
})();

/* ── ANIMATED VIDEO-PRODUCTION BACKGROUND ── */
(function(){
  // ── Per-section canvas (hero / page-hero) ──
  const c = document.getElementById('fxCanvas');
  if(c) runCanvas(c, 36, rand(14,44), rand(0.13,0.34));

  // ── Full-page fixed canvas (injected once) ──
  if(!document.getElementById('bgPageCanvas')){
    const bg = document.createElement('canvas');
    bg.id = 'bgPageCanvas';
    bg.setAttribute('aria-hidden','true');
    bg.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;display:block;';
    document.body.prepend(bg);
    runCanvas(bg, 18, rand(10,28), rand(0.05,0.14), true);
  }

  function rand(a,b){ return a + Math.random()*(b-a); }

  function runCanvas(cvs, baseCount, sRange, aRange, subtle){
    const ctx = cvs.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const HUES = ['#2DBCBF','#E84428','#F47920','#FAC018','#2DBCBF','#E84428','#F47920'];
    const BARSC = ['#2DBCBF','#E84428','#F47920','#FAC018'];
    const TYPES = subtle
      ? ['frame','tick','lens','cross','frame','tick','play']
      : ['frame','play','lens','cross','bars','tick','frame','tick','play'];
    let W=0,H=0,dpr=1,parts=[],t=0;

    function mkRand(a,b){ return a + Math.random()*(b-a); }

    function build(){
      const n = Math.round(Math.min(W,1500)/1500 * (baseCount+10)) + baseCount;
      parts = [];
      for(let i=0;i<n;i++) parts.push({
        x:Math.random()*W, y:Math.random()*H,
        s: mkRand(subtle?9:14, subtle?28:44),
        type:TYPES[(Math.random()*TYPES.length)|0],
        hue:HUES[(Math.random()*HUES.length)|0],
        vx:mkRand(-0.12,0.12), vy:mkRand(-0.18,-0.03),
        rot:mkRand(0,6.28), vr:mkRand(-0.003,0.003),
        a: mkRand(subtle?0.05:0.13, subtle?0.14:0.34),
        tw:mkRand(0.4,1.3), ph:Math.random()*6.28
      });
    }

    function roundRect(x,y,w,h,r){
      ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
    }

    function draw(p,alpha){
      if(alpha<=0.008) return;
      const s=p.s;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.globalAlpha=alpha;ctx.strokeStyle=p.hue;ctx.fillStyle=p.hue;ctx.lineWidth=1.5;
      switch(p.type){
        case 'frame':{const w=s*1.3,h=s,hole=s*0.13;roundRect(-w/2,-h/2,w,h,3);ctx.stroke();ctx.globalAlpha=alpha*.75;ctx.fillRect(-w/2+hole,-h/2-hole*1.5,hole,hole);ctx.fillRect(w/2-hole*2,-h/2-hole*1.5,hole,hole);ctx.fillRect(-w/2+hole,h/2+hole*.5,hole,hole);ctx.fillRect(w/2-hole*2,h/2+hole*.5,hole,hole);break;}
        case 'play':{ctx.globalAlpha=alpha*.9;ctx.beginPath();ctx.moveTo(-s*.4,-s*.5);ctx.lineTo(s*.55,0);ctx.lineTo(-s*.4,s*.5);ctx.closePath();ctx.fill();break;}
        case 'lens':{ctx.beginPath();ctx.arc(0,0,s*.55,0,6.28);ctx.stroke();ctx.beginPath();ctx.arc(0,0,s*.3,0,6.28);ctx.stroke();break;}
        case 'cross':{const a=s*.55,g=s*.18;ctx.beginPath();ctx.moveTo(-a,0);ctx.lineTo(-g,0);ctx.moveTo(g,0);ctx.lineTo(a,0);ctx.moveTo(0,-a);ctx.lineTo(0,-g);ctx.moveTo(0,g);ctx.lineTo(0,a);ctx.stroke();ctx.beginPath();ctx.arc(0,0,s*.33,0,6.28);ctx.stroke();break;}
        case 'bars':{const bw=s*1.4/BARSC.length,bh=s;for(let i=0;i<BARSC.length;i++){ctx.fillStyle=BARSC[i];ctx.globalAlpha=alpha*.9;ctx.fillRect(-s*.7+i*bw,-bh/2,bw+.5,bh);}break;}
        case 'tick':{ctx.lineWidth=1.3;for(let i=-2;i<=2;i++){const tall=i===0;ctx.globalAlpha=alpha*(tall?1:.55);ctx.beginPath();ctx.moveTo(i*s*.32,-s*(tall?.5:.3));ctx.lineTo(i*s*.32,s*(tall?.5:.3));ctx.stroke();}break;}
      }
      ctx.restore();
    }

    function themeFactor(){
      return document.documentElement.dataset.theme==='light' ? (subtle?0.55:0.78) : 1;
    }

    function step(){
      const tf=themeFactor();
      ctx.clearRect(0,0,W,H);
      t+=0.016;
      for(const p of parts){
        p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;
        if(p.y<-60){p.y=H+60;p.x=Math.random()*W;}
        if(p.x<-60)p.x=W+60;else if(p.x>W+60)p.x=-60;
        draw(p, p.a*tf*(0.5+0.5*Math.sin(t*p.tw+p.ph)));
      }
      requestAnimationFrame(step);
    }

    function drawStatic(){
      const tf=themeFactor();
      ctx.clearRect(0,0,W,H);
      for(const p of parts) draw(p,p.a*tf*.8);
    }

    function resize(){
      dpr=Math.min(window.devicePixelRatio||1,2);
      W=cvs.clientWidth;H=cvs.clientHeight;
      if(!W||!H) return;
      cvs.width=W*dpr;cvs.height=H*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      build();
    }

    let to;
    window.addEventListener('resize',()=>{clearTimeout(to);to=setTimeout(()=>{resize();if(reduced)drawStatic();},150);});
    resize();
    if(reduced) drawStatic(); else step();
  }
})();

/* ── GATED PRICING LOGIC ── */
(function() {
  const form = document.getElementById('gatedPricingForm');
  if (!form) return;

  const content = document.getElementById('pricingContent');
  const overlay = document.getElementById('pricingGatedOverlay');
  const msg = document.getElementById('gatedFormMsg');
  const btn = document.getElementById('gatedSubmitBtn');

  // Check if already unlocked
  if (localStorage.getItem('bf_pricing_unlocked_v5') === 'true') {
    return; // Already unlocked, leave everything as is
  }

  // Not unlocked: apply blur and show overlay
  content.classList.add('blurred');
  overlay.classList.add('active');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    // Google Apps Script URL (User will replace this)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx451UJHAQLRLCcgsHJcZzbnUPXxA7otONxvNv0fnnv_VPfC0CCIR2fCOyUtn-FCJP5EA/exec';
    
    // Fallback: If no script URL is provided, just unlock it instantly.
    if (scriptURL === 'GOOGLE_SCRIPT_URL_PLACEHOLDER') {
      setTimeout(() => {
        unlockPricing();
      }, 800);
      return;
    }

    const formData = new FormData(form);
    
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => response.json())
      .then(data => {
        if (data.result === 'success') {
          unlockPricing();
        } else {
          // If the Google Script returns an error (like Invalid Email)
          msg.textContent = data.message || 'Please enter a valid email address.';
          msg.classList.add('show');
          msg.style.color = '#E84428'; // Make it red
          form.querySelector('input[name="email"]').style.borderColor = '#E84428';
          btn.textContent = 'View Pricing';
          btn.disabled = false;
        }
      })
      .catch(error => {
        console.error('Error!', error);
        msg.textContent = 'Something went wrong. Please try again.';
        msg.classList.add('show');
        msg.style.color = '#E84428';
        btn.textContent = 'View Pricing';
        btn.disabled = false;
      });
  });

  function unlockPricing() {
    localStorage.setItem('bf_pricing_unlocked_v5', 'true');
    overlay.classList.remove('active');
    content.classList.remove('blurred');
    msg.classList.remove('show');
  }
})();

/* ── HERO SLIDER ── */
function setSlide(idx, e) {
  if (e) e.stopPropagation();
  const slides = document.querySelectorAll('.h-slide');
  const dots = document.querySelectorAll('.sdot');
  if (!slides.length) return;
  
  slides.forEach((s, i) => {
    s.style.display = i === idx ? 'block' : 'none';
    if (i === idx) s.classList.add('active');
    else s.classList.remove('active');
  });
  
  dots.forEach((d, i) => {
    if (i === idx) {
      d.classList.add('active');
      d.style.background = 'var(--text)';
    } else {
      d.classList.remove('active');
      d.style.background = 'transparent';
    }
  });
}

/* ── BOOK MODAL ── */
function openBookModal(e) {
  if (e) e.preventDefault();
  const bm = document.getElementById('bookModal');
  if (bm) {
    bm.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeBookModal() {
  const bm = document.getElementById('bookModal');
  if (bm) {
    bm.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function submitBookForm(e) {
  e.preventDefault();
  const name = document.getElementById('bfName').value.trim();
  const company = document.getElementById('bfCompany').value.trim();
  const req = document.getElementById('bfReq').value.trim();
  const budgetElem = document.getElementById('bfBudget');
  const budget = budgetElem ? budgetElem.value : '';
  const notes = `Company: ${company} | Budget: ${budget} | Requirements: ${req}`;
  
  window.location.href = `https://cal.com/brandframe-ai-xn0a5g?name=${encodeURIComponent(name)}&notes=${encodeURIComponent(notes)}`;
}

window.addEventListener('click', e => {
  const vmod = document.getElementById('vmodal');
  if (vmod && e.target === vmod) closeVideo();
  
  const bmod = document.getElementById('bookModal');
  if (bmod && e.target === bmod) closeBookModal();
});
