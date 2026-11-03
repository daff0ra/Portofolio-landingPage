(function () {
  // The Figma frame is a 1440px desktop layout: scale it down on narrower viewports.
  function fit() {
    var s = Math.min(1, window.innerWidth / 1440);
    document.documentElement.style.zoom = s < 1 ? s : '';
  }
  fit();
  window.addEventListener('resize', fit);

  // Nav: bold the active link (Home is bold in the design)
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      links.forEach(function (l) { l.classList.toggle('is-active', l === a); });
    });
  });
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = sections.indexOf(e.target);
        if (i > -1) links.forEach(function (l, j) { l.classList.toggle('is-active', i === j); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { if (s) io.observe(s); });
  }

  // Contact form: client-side validation + sent state (no backend in the design)
  var form = document.getElementById('contact-form');
  var btn = form.querySelector('.form__submit');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['f-email', 'f-msg'].forEach(function (id) {
      var el = document.getElementById(id);
      var valid = el.value.trim() !== '' && (id !== 'f-email' || /^\S+@\S+\.\S+$/.test(el.value));
      el.parentElement.classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) return;
    btn.textContent = 'Message Sent';
    btn.disabled = true;
    setTimeout(function () { form.reset(); btn.textContent = 'Send Message'; btn.disabled = false; }, 2500);
  });
  form.addEventListener('input', function (e) {
    var f = e.target.closest('.field');
    if (f) f.classList.remove('is-invalid');
  });
})();
