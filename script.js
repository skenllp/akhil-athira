/* ════════════════════════════════════════
   ENGAGEMENT INVITATION JS – Athira & Akhil
   ════════════════════════════════════════ */

// ─── COUNTDOWN TIMER ─────────────────────────────────────────
(function initCountdown() {
  // Engagement: Monday 12 October 2026
  const eventDate = new Date('2026-10-12T00:00:00+05:30');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent    = '00';
      document.getElementById('hours').textContent   = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    animateNumber('days',    pad(days));
    animateNumber('hours',   pad(hours));
    animateNumber('minutes', pad(minutes));
    animateNumber('seconds', pad(seconds));
  }

  function animateNumber(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.textContent !== value) {
      el.style.transform = 'scale(1.2)';
      el.style.color = 'var(--gold)';
      setTimeout(() => {
        el.textContent = value;
        el.style.transform = 'scale(1)';
        el.style.color = '';
      }, 150);
    }
  }

  tick();
  setInterval(tick, 1000);
})();

// ─── ADD TO CALENDAR ──────────────────────────────────────────
const CAL_EVENT = {
  title:       'Athira & Akhil – Engagement',
  startDate:   '20261012',        // YYYYMMDD
  startTime:   'T000000',
  endDate:     '20261012',
  endTime:     'T235900',
  description: 'You are cordially invited to the Engagement of Athira & Akhil.',
  location:    '',
};

function addToCalendar() {
  const dropdown = document.getElementById('cal-dropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
  const btn = document.getElementById('add-to-cal-btn');
  const dropdown = document.getElementById('cal-dropdown');
  if (!dropdown || !btn) return;
  if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

function calGoogle(e) {
  e.preventDefault();
  const { title, startDate, startTime, endDate, endTime, description, location } = CAL_EVENT;
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE`
    + `&text=${encodeURIComponent(title)}`
    + `&dates=${startDate}${startTime}/${endDate}${endTime}`
    + `&details=${encodeURIComponent(description)}`
    + `&location=${encodeURIComponent(location)}`;
  window.open(url, '_blank');
  document.getElementById('cal-dropdown').classList.remove('open');
}

function calApple(e) {
  e.preventDefault();
  downloadICS();
  document.getElementById('cal-dropdown').classList.remove('open');
}

function calOutlook(e) {
  e.preventDefault();
  downloadICS();
  document.getElementById('cal-dropdown').classList.remove('open');
}

function downloadICS() {
  const { title, startDate, startTime, endDate, endTime, description, location } = CAL_EVENT;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Athira & Akhil//Engagement//EN',
    'BEGIN:VEVENT',
    `DTSTART:${startDate}${startTime}`,
    `DTEND:${endDate}${endTime}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'athira-akhil-engagement.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── FLOATING PARTICLES ──────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 5 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 0.5 + 0.1;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${opacity};
      background: ${Math.random() > 0.5 ? '#D4AF37' : '#c9a227'};
    `;
    container.appendChild(p);
  }
})();

// ─── SCROLL ANIMATIONS ───────────────────────────────────────
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  const sections = document.querySelectorAll(
    '.countdown-section, .invitation-section, .couple-section, .event-section, .glimpses-section, .palette-section, .quote-section'
  );
  sections.forEach(sec => {
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(30px)';
    sec.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(sec);
  });

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .countdown-section.visible,
    .invitation-section.visible,
    .couple-section.visible,
    .event-section.visible,
    .glimpses-section.visible,
    .palette-section.visible,
    .quote-section.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(styleEl);
})();

// ─── PERSON CARDS STAGGER ────────────────────────────────────
(function staggerCards() {
  const cards = document.querySelectorAll('.person-card, .count-box');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
          }, i * 120);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px) scale(0.97)';
    card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    obs.observe(card);
  });
})();

// ─── PALETTE CIRCLES STAGGER ──────────────────────────────────
(function staggerPalette() {
  const items = document.querySelectorAll('.palette-item');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
          }, i * 80);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px) scale(0.85)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(item);
  });
})();

// ─── IMAGE FALLBACK ──────────────────────────────────────────
(function handleImageFallback() {
  const brideImg = document.getElementById('bride-img');
  const groomImg = document.getElementById('groom-img');

  function setupFallback(img) {
    if (!img) return;
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = this.parentElement.querySelector('.photo-fallback');
      if (fallback) fallback.style.display = 'flex';
    });
  }

  setupFallback(brideImg);
  setupFallback(groomImg);
})();

// ─── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── LOCATION BUTTON RIPPLE ───────────────────────────────────
document.querySelectorAll('.btn-loc').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: 10px; height: 10px;
      background: rgba(255,255,255,0.4);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out;
      left: ${e.offsetX - 5}px;
      top: ${e.offsetY - 5}px;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(20); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// Initialize Lucide vector icons
if (window.lucide) {
  lucide.createIcons();
}

// ─── BACKGROUND MUSIC PLAYER ──────────────────────────────────
(function initMusicPlayer() {
  const musicBtn = document.createElement('button');
  musicBtn.className = 'music-toggle';
  musicBtn.setAttribute('aria-label', 'Toggle Music');
  musicBtn.innerHTML = '<i data-lucide="volume-x"></i>';
  document.body.appendChild(musicBtn);

  const audio = document.createElement('audio');
  audio.id = 'bg-music';
  audio.src = 'song.mp3';
  audio.loop = true;
  document.body.appendChild(audio);

  let isPlaying = false;

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      musicBtn.classList.remove('playing');
      musicBtn.innerHTML = '<i data-lucide="volume-x"></i>';
      if (window.lucide) lucide.createIcons();
    } else {
      audio.play().then(() => {
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '<i data-lucide="volume-2"></i>';
        if (window.lucide) lucide.createIcons();
        startFloatingNotes();
      }).catch(err => console.log("Autoplay prevented:", err));
    }
    isPlaying = !isPlaying;
  }

  musicBtn.addEventListener('click', togglePlay);

  function handleFirstInteraction() {
    if (!isPlaying) togglePlay();
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('scroll', handleFirstInteraction);
  }
  window.addEventListener('click', handleFirstInteraction);
  window.addEventListener('scroll', handleFirstInteraction);

  let noteInterval;
  function startFloatingNotes() {
    if (noteInterval) clearInterval(noteInterval);
    noteInterval = setInterval(() => {
      if (!isPlaying) { clearInterval(noteInterval); return; }
      const note = document.createElement('span');
      note.className = 'music-note';
      note.textContent = Math.random() > 0.5 ? '🎵' : '🎶';
      const btnRect = musicBtn.getBoundingClientRect();
      note.style.left = `${btnRect.left + 15 + Math.random() * 20}px`;
      note.style.top = `${btnRect.top + window.scrollY - 10}px`;
      note.style.position = 'absolute';
      document.body.appendChild(note);
      setTimeout(() => note.remove(), 2000);
    }, 800);
  }
})();

// ─── PRELOADER ────────────────────────────────────────────────
(function initPreloader() {
  const el = document.getElementById("preloader");
  if (!el) return;
  window.addEventListener("load", () => {
    setTimeout(() => el.classList.add("is-hidden"), 500);
  });
  setTimeout(() => el.classList.add("is-hidden"), 3000);
})();

console.log('💍 Athira & Akhil Engagement Invitation Loaded');
