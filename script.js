// Edit this number to receive RSVPs on WhatsApp (country code, no +)
const RSVP_WHATSAPP = '919495595023';
const WEDDING = new Date('2027-01-24T10:30:00+05:30');

const $ = s => document.querySelector(s);
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); };

// Nav background on scroll
addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', scrollY > innerHeight * 0.6), { passive: true });

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Music
const audio = $('#bgm'), mBtn = $('#musicBtn');
let playing = false;
const setMusic = on => {
  if (on) audio.play().then(() => { playing = true; mBtn.querySelector('span').textContent = 'Music off'; }).catch(() => {});
  else { audio.pause(); playing = false; mBtn.querySelector('span').textContent = 'Music on'; }
};
mBtn.addEventListener('click', () => setMusic(!playing));
const firstTouch = () => { if (!playing) setMusic(true); removeEventListener('pointerdown', firstTouch); };
addEventListener('pointerdown', firstTouch);

// Scratch card
(function () {
  const c = $('#scratch'), wrap = $('#scratchWrap'), ctx = c.getContext('2d');
  let done = false, drawing = false;
  function paint() {
    const r = wrap.getBoundingClientRect(), d = devicePixelRatio || 1;
    c.width = r.width * d; c.height = r.height * d; ctx.scale(d, d);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, '#b8914f'); g.addColorStop(.5, '#e8cf93'); g.addColorStop(1, '#a87d3c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = '#5a3d1e'; ctx.font = '600 18px "Cormorant Garamond", serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('REVEAL THE DATE ✨', r.width / 2, r.height / 2);
    ctx.globalCompositeOperation = 'destination-out';
  }
  function finish() {
    if (done) return; done = true;
    c.style.opacity = 0; setTimeout(() => c.remove(), 600);
    $('#scratchHint').style.display = 'none';
    $('#countdown').classList.add('show');
  }
  function scratch(e) {
    const r = c.getBoundingClientRect();
    ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 26, 0, Math.PI * 2); ctx.fill();
  }
  function cleared() {
    const data = ctx.getImageData(0, 0, c.width, c.height).data; let clear = 0;
    for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
    return clear / (data.length / 64) > 0.45;
  }
  c.addEventListener('pointerdown', e => { drawing = true; c.setPointerCapture(e.pointerId); scratch(e); });
  c.addEventListener('pointermove', e => { if (drawing) scratch(e); });
  c.addEventListener('pointerup', () => { drawing = false; if (cleared()) finish(); });
  c.addEventListener('click', () => setTimeout(() => { if (!cleared()) finish(); }, 50)); // simple tap reveals
  document.fonts ? document.fonts.ready.then(paint) : paint();
})();

// Countdown
function tick() {
  let s = Math.max(0, Math.floor((WEDDING - Date.now()) / 1000));
  const p = n => String(n).padStart(2, '0');
  $('#cdD').textContent = p(Math.floor(s / 86400)); s %= 86400;
  $('#cdH').textContent = p(Math.floor(s / 3600)); s %= 3600;
  $('#cdM').textContent = p(Math.floor(s / 60));
  $('#cdS').textContent = p(s % 60);
}
tick(); setInterval(tick, 1000);

// Copy address
document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', () => {
  navigator.clipboard?.writeText(b.dataset.addr).then(() => toast('Address copied'), () => toast(b.dataset.addr));
}));

// RSVP → WhatsApp
$('#rsvpForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target), evs = f.getAll('ev');
  if (!evs.length) return toast('Please select at least one celebration');
  const text = `*RSVP — Akhil & Athira Wedding*\nName: ${f.get('name')}\nMobile: ${f.get('phone')}\nGuests: ${f.get('guests')}\nAttending: ${evs.join(', ')}` + (f.get('msg') ? `\nMessage: ${f.get('msg')}` : '');
  window.open(`https://wa.me/${RSVP_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
  toast('Thank you! Opening WhatsApp…');
  e.target.reset();
});

// Share
$('#shareBtn').addEventListener('click', async () => {
  const data = { title: 'Akhil & Athira — Wedding', text: 'You are invited to our wedding on 24 January 2027!', url: location.href };
  if (navigator.share) { try { await navigator.share(data); } catch (_) {} }
  else { navigator.clipboard?.writeText(location.href); toast('Link copied'); }
});

// Gallery lightbox
(function(){
  const lb=document.createElement('div');lb.className='lightbox';
  const im=document.createElement('img');lb.appendChild(im);document.body.appendChild(lb);
  document.querySelectorAll('.gallery img').forEach(img=>img.addEventListener('click',()=>{im.src=img.src;lb.classList.add('open')}));
  lb.addEventListener('click',()=>lb.classList.remove('open'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open')});
})();
