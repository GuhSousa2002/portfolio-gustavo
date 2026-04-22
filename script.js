/* ============================================================
   Portfólio – Gustavo Sousa | script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll reveal ----------
     Adiciona a classe .is-visible quando o elemento entra na viewport */
  const reveals = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));

  /* ---------- Nav ativa por scroll ----------
     Marca o link de navegação correspondente à seção visível */
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

  /* ---------- Ano dinâmico no rodapé ---------- */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Screenshot sliders ----------
     Inicializa todos os carrosséis de imagens da página.
     Cada slider é identificado pelo id do elemento pai. */
  const sliders = {};
  document.querySelectorAll('.screenshot-slider').forEach(el => {
    const id = el.id.replace('slider-', '');
    const track = el.querySelector('.screenshot-slider__track');
    const slides = track.querySelectorAll('.screenshot-slide');
    sliders[id] = { track, slides, current: 0 };

    const goTo = (idx) => {
      sliders[id].current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${sliders[id].current * 100}%)`;
      // Atualiza destaque nos dots
      document.querySelectorAll(`[data-slider="${id}"].slider-dot`).forEach((d, i) =>
        d.classList.toggle('active', i === sliders[id].current));
    };

    // Botões de seta (anterior / próximo)
    el.querySelectorAll('.slider-btn').forEach(btn =>
      btn.addEventListener('click', () => goTo(sliders[id].current + +btn.dataset.dir)));

    // Dots clicáveis
    document.querySelectorAll(`[data-slider="${id}"].slider-dot`).forEach(dot =>
      dot.addEventListener('click', () => goTo(+dot.dataset.index)));
  });

});
