

  // ===== Loader =====
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hide'), 500);
  });

  // ===== Theme toggle =====
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  function applyTheme(t){
    root.setAttribute('data-theme', t);
    themeToggle.textContent = t === 'light' ? '◑' : '◐';
  }
  applyTheme('dark');
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(current);
  });

  // ===== Mobile menu =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  function toggleMenu(open){
    mobileMenu.classList.toggle('open', open);
    menuOverlay.classList.toggle('open', open);
  }
  hamburger.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
  menuOverlay.addEventListener('click', () => toggleMenu(false));
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // ===== Scroll trace fill =====
  const traceFill = document.getElementById('traceFill');
  function updateTrace(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    traceFill.style.height = pct + '%';
  }
  window.addEventListener('scroll', updateTrace);
  updateTrace();

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // ===== Typewriter effect =====
  const phrases = ["Automation that ships.", "Analytics that get read.", "Models that hold up in production."];
  const twEl = document.getElementById('typewriter');
  let pIndex = 0, cIndex = 0, deleting = false;
  function typeLoop(){
    const current = phrases[pIndex];
    if(!deleting){
      cIndex++;
      twEl.textContent = current.slice(0, cIndex);
      if(cIndex === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
    } else {
      cIndex--;
      twEl.textContent = current.slice(0, cIndex);
      if(cIndex === 0){ deleting = false; pIndex = (pIndex + 1) % phrases.length; }
    }
    setTimeout(typeLoop, deleting ? 35 : 55);
  }
  typeLoop();

  // ===== Particle background (hero) =====
  const pCanvas = document.getElementById('particles');
  const pCtx = pCanvas.getContext('2d');
  let particles = [];
  function sizeCanvas(){
    pCanvas.width = pCanvas.offsetWidth;
    pCanvas.height = pCanvas.offsetHeight;
  }
  function initParticles(){
    sizeCanvas();
    const count = Math.floor((pCanvas.width * pCanvas.height) / 18000);
    particles = Array.from({length: count}, () => ({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6
    }));
  }
  function drawParticles(){
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    const isLight = root.getAttribute('data-theme') === 'light';
    pCtx.fillStyle = isLight ? 'rgba(20,20,25,0.35)' : 'rgba(244,245,247,0.4)';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > pCanvas.width) p.vx *= -1;
      if(p.y < 0 || p.y > pCanvas.height) p.vy *= -1;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fill();
    });
    for(let i = 0; i < particles.length; i++){
      for(let j = i + 1; j < particles.length; j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 110){
          pCtx.strokeStyle = `rgba(107,255,176,${0.12 * (1 - dist/110)})`;
          pCtx.lineWidth = 1;
          pCtx.beginPath();
          pCtx.moveTo(particles[i].x, particles[i].y);
          pCtx.lineTo(particles[j].x, particles[j].y);
          pCtx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  initParticles();
  drawParticles();
  window.addEventListener('resize', initParticles);

  // ===== Waveform canvas (hero visual card) =====
  const wCanvas = document.getElementById('waveform');
  const wCtx = wCanvas.getContext('2d');
  function sizeWave(){
    wCanvas.width = wCanvas.offsetWidth;
    wCanvas.height = wCanvas.offsetHeight;
  }
  sizeWave();
  window.addEventListener('resize', sizeWave);
  let t = 0;
  function drawWave(){
    sizeWave();
    wCtx.clearRect(0, 0, wCanvas.width, wCanvas.height);
    const midY = wCanvas.height / 2;
    wCtx.beginPath();
    for(let x = 0; x <= wCanvas.width; x += 4){
      const y = midY
        + Math.sin(x * 0.02 + t) * 26
        + Math.sin(x * 0.05 + t * 1.7) * 10;
      x === 0 ? wCtx.moveTo(x, y) : wCtx.lineTo(x, y);
    }
    const grad = wCtx.createLinearGradient(0, 0, wCanvas.width, 0);
    grad.addColorStop(0, '#6BFFB0');
    grad.addColorStop(1, '#8A7CFF');
    wCtx.strokeStyle = grad;
    wCtx.lineWidth = 2;
    wCtx.stroke();
    t += 0.02;
    requestAnimationFrame(drawWave);
  }
  drawWave();

  // ===== Contact form validation =====
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  function validateField(id, testFn){
    const field = document.getElementById(id);
    const input = field.querySelector('input, textarea');
    const valid = testFn(input.value.trim());
    field.classList.toggle('invalid', !valid);
    return valid;
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameOk = validateField('nameField', v => v.length >= 2);
    const emailOk = validateField('emailField', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const messageOk = validateField('messageField', v => v.length >= 10);
    if(nameOk && emailOk && messageOk){
      formStatus.classList.add('show');
      form.reset();
      setTimeout(() => formStatus.classList.remove('show'), 4000);
    } else {
      formStatus.classList.remove('show');
    }
  });
  ['name','email','message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById(id + 'Field').classList.remove('invalid');
    });
  });

  // ===== Footer year =====
  document.getElementById('year').textContent = new Date().getFullYear();
const cursor=document.querySelector(".cursor-glow");

document.addEventListener("mousemove",(e)=>{

    cursor.style.left=e.clientX+"px";
    cursor.style.top=e.clientY+"px";

});
document.querySelectorAll(".counter").forEach(counter=>{

let target=+counter.dataset.target;

let count=0;

let speed=target/80;

function update(){

count+=speed;

if(count<target){

counter.innerText=Math.ceil(count);

requestAnimationFrame(update);

}
else{

counter.innerText=target;

}

}

update();

});
