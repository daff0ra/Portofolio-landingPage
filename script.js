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

  // Track the pointer across the page; periodically blink and shift the brow expression.
  var eyeScene = document.querySelector('.eye-box');
  var pupils = Array.prototype.slice.call(document.querySelectorAll('.eye-pupil'));
  if (eyeScene && pupils.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      pupils.forEach(function (pupil) {
        var rect = pupil.getBoundingClientRect();
        var dx = (e.clientX - (rect.left + rect.width / 2)) / 95;
        var dy = (e.clientY - (rect.top + rect.height / 2)) / 95;
        var x = Math.max(-1, Math.min(1, dx)) * 25;
        var y = Math.max(-1, Math.min(1, dy)) * 21;
        pupil.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      });
    });
    window.addEventListener('blur', function () {
      pupils.forEach(function (pupil) { pupil.style.transform = 'translate(0, 0)'; });
    });
    var expressions = ['is-curious', 'is-surprised', ''];
    var expressionIndex = 0;
    window.setInterval(function () {
      eyeScene.classList.remove('is-curious', 'is-surprised');
      if (expressions[expressionIndex]) eyeScene.classList.add(expressions[expressionIndex]);
      expressionIndex = (expressionIndex + 1) % expressions.length;
    }, 2200);
    (function blink() {
      window.setTimeout(function () {
        eyeScene.classList.add('is-blinking');
        window.setTimeout(function () {
          eyeScene.classList.remove('is-blinking');
          blink();
        }, 150);
      }, 1800 + Math.random() * 1800);
    })();
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
