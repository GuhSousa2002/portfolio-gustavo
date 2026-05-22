/* ============================================================
   Portfólio – Gustavo Sousa | script.js (v2)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Barra de progresso de scroll ---------- */
  const progress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = maxScroll > 0 ? (scrolled / maxScroll * 100) + '%' : '0%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });
  reveals.forEach((el) => io.observe(el));

  /* ---------- Nav ativa por scroll ---------- */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const setActive = () => {
    const current = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 140 && rect.bottom >= 140;
    });
    navLinks.forEach((link) => {
      const active = current && link.getAttribute('href') === `#${current.id}`;
      link.classList.toggle('is-active', !!active);
    });
  };
  setActive();
  window.addEventListener('scroll', setActive, { passive: true });

  /* ---------- Ano dinâmico ---------- */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Hamburger / nav mobile ---------- */
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');
  const overlayLinks = navOverlay ? navOverlay.querySelectorAll('a') : [];

  const openMenu = () => {
    hamburger.classList.add('is-open');
    navOverlay.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.classList.remove('is-open');
    navOverlay.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  overlayLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ---------- Screenshot sliders com swipe ---------- */
  const sliders = {};

  document.querySelectorAll('.screenshot-slider').forEach(el => {
    const id = el.id.replace('slider-', '');
    const track = el.querySelector('.screenshot-slider__track');
    const slides = track.querySelectorAll('.screenshot-slide');
    sliders[id] = { track, slides, current: 0 };

    const goTo = (idx) => {
      sliders[id].current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${sliders[id].current * 100}%)`;
      document.querySelectorAll(`[data-slider="${id}"].slider-dot`).forEach((d, i) =>
        d.classList.toggle('active', i === sliders[id].current));
    };

    // Botões de seta
    el.querySelectorAll('.slider-btn').forEach(btn =>
      btn.addEventListener('click', () => goTo(sliders[id].current + +btn.dataset.dir)));

    // Dots
    document.querySelectorAll(`[data-slider="${id}"].slider-dot`).forEach(dot =>
      dot.addEventListener('click', () => goTo(+dot.dataset.index)));

    // Touch / swipe
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipe = 50;

    el.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > minSwipe) {
        goTo(sliders[id].current + (diff > 0 ? 1 : -1));
      }
    }, { passive: true });
  });

  /* ---------- Copiar email ---------- */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = btn.dataset.copy;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 2200);
      });
    });
  });

});
