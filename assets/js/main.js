/**
 * gabriel-maciel-theme — main.js
 * Vanilla JS replacement for all React behavior.
 */

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

/**
 * Create an SVG element from a plain string.
 * The string is parsed in a detached document so the result is safe and
 * no user-controlled content ever reaches this function.
 */
function parseSvg(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  return doc.documentElement;
}


/* ─────────────────────────────────────────────
   1. Mobile hamburger menu
───────────────────────────────────────────── */
function buildHamburgerIcon() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  [[6, 6], [12, 12], [18, 18]].forEach(function (y) {
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', '3');
    line.setAttribute('y1', String(y[0]));
    line.setAttribute('x2', '21');
    line.setAttribute('y2', String(y[0]));
    line.setAttribute('stroke', 'currentColor');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
  });
  return svg;
}

function buildCloseIcon() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  const coords = [['4', '4', '20', '20'], ['20', '4', '4', '20']];
  coords.forEach(function (c) {
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', c[0]);
    line.setAttribute('y1', c[1]);
    line.setAttribute('x2', c[2]);
    line.setAttribute('y2', c[3]);
    line.setAttribute('stroke', 'currentColor');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
  });
  return svg;
}

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function setIcon(type) {
    hamburger.textContent = ''; // clear
    hamburger.appendChild(type === 'close' ? buildCloseIcon() : buildHamburgerIcon());
  }

  function openMenu() {
    mobileMenu.classList.add('open');
    setIcon('close');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    setIcon('hamburger');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function isOpen() {
    return mobileMenu.classList.contains('open');
  }

  // Render initial icon
  setIcon('hamburger');

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  // Close on scroll
  window.addEventListener('scroll', function () {
    if (isOpen()) closeMenu();
  }, { passive: true });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!isOpen()) return;
    if (!mobileMenu.contains(e.target) && e.target !== hamburger) {
      closeMenu();
    }
  });
}


/* ─────────────────────────────────────────────
   2. Scroll-to navigation
───────────────────────────────────────────── */
function scrollTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initScrollNav() {
  // .nav-btn elements with data-target
  document.querySelectorAll('.nav-btn[data-target]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      scrollTo(btn.dataset.target);
    });
  });

  // Generic [data-scroll] elements
  document.querySelectorAll('[data-scroll]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      scrollTo(el.dataset.scroll);
    });
  });
}


/* ─────────────────────────────────────────────
   3. FadeIn on scroll (replaces React useInView)
───────────────────────────────────────────── */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transitionDelay = (el.dataset.delay || 0) + 's';
        el.classList.add('visible');
        observer.unobserve(el); // animate once
      }
    });
  }, { threshold: 0.06 });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}


/* ─────────────────────────────────────────────
   4. Contact form — service selection
───────────────────────────────────────────── */
function initServiceOptions() {
  const serviceButtons = document.querySelectorAll('.service-option');
  if (!serviceButtons.length) return;

  serviceButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Deselect all
      serviceButtons.forEach(function (b) {
        b.classList.remove('selected');
      });

      // Select this one
      btn.classList.add('selected');

      // Fill the message textarea
      const template = btn.dataset.template || '';
      const textarea = document.querySelector('#contact-form textarea[name="mensagem"], #contact-form textarea');
      if (textarea) textarea.value = template;

      // Update step-2 indicator style
      const step2 = document.querySelector('.step-indicator[data-step="2"], .step-2-indicator');
      if (step2) {
        step2.style.background = '#D4A920';
        step2.style.color = '#0C2D3E';
      }

      // Scroll to form section after short delay
      setTimeout(function () {
        scrollTo('form-section');
      }, 250);
    });
  });
}


/* ─────────────────────────────────────────────
   5. Float label form fields
───────────────────────────────────────────── */
function initFloatFields() {
  const fields = document.querySelectorAll('.float-field input, .float-field textarea');
  if (!fields.length) return;

  fields.forEach(function (field) {
    // Set initial has-value state (e.g. after page restore)
    if (field.value) field.classList.add('has-value');

    field.addEventListener('focus', function () {
      field.classList.add('focused');
    });

    field.addEventListener('blur', function () {
      field.classList.remove('focused');
      field.classList.toggle('has-value', field.value.trim() !== '');
    });

    field.addEventListener('input', function () {
      field.classList.toggle('has-value', field.value.trim() !== '');
    });
  });
}


/* ─────────────────────────────────────────────
   6. Contact form validation + submission
───────────────────────────────────────────── */
function validateForm(form) {
  const errors = {};
  if (!form.nome.trim()) errors.nome = 'Nome obrigatório';
  if (!form.email.trim()) errors.email = 'Email obrigatório';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Email inválido';
  if (!form.mensagem.trim()) errors.mensagem = 'Mensagem obrigatória';
  return errors;
}

function initContactForm() {
  const submitBtn = document.getElementById('contact-submit');
  if (!submitBtn) return;

  const formEl = document.getElementById('contact-form');
  if (!formEl) return;

  function getFieldEl(name) {
    return formEl.querySelector('[name="' + name + '"]');
  }

  function showFieldError(name, message) {
    const field = getFieldEl(name);
    if (!field) return;
    field.classList.add('error');
    const wrapper = field.closest('.float-field') || field.parentElement;
    let errorEl = wrapper && wrapper.querySelector('.field-error');
    if (!errorEl && wrapper) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      wrapper.appendChild(errorEl);
    }
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldErrors() {
    formEl.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
    });
    formEl.querySelectorAll('.field-error').forEach(function (el) {
      el.textContent = '';
    });
  }

  function getFormData() {
    const nome     = getFieldEl('nome')     ? getFieldEl('nome').value     : '';
    const email    = getFieldEl('email')    ? getFieldEl('email').value    : '';
    const mensagem = getFieldEl('mensagem') ? getFieldEl('mensagem').value : '';
    return { nome, email, mensagem };
  }

  function buildSuccessNode() {
    const ns = 'http://www.w3.org/2000/svg';

    const wrapper = document.createElement('div');
    wrapper.className = 'form-success';

    // SVG checkmark
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '48');
    svg.setAttribute('height', '48');
    svg.setAttribute('viewBox', '0 0 48 48');
    svg.setAttribute('fill', 'none');

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', '24');
    circle.setAttribute('cy', '24');
    circle.setAttribute('r', '23');
    circle.setAttribute('stroke', '#D4A920');
    circle.setAttribute('stroke-width', '2');

    const check = document.createElementNS(ns, 'path');
    check.setAttribute('d', 'M14 24l7 7 13-13');
    check.setAttribute('stroke', '#D4A920');
    check.setAttribute('stroke-width', '2.5');
    check.setAttribute('stroke-linecap', 'round');
    check.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(circle);
    svg.appendChild(check);

    // Message text
    const p = document.createElement('p');
    p.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';

    wrapper.appendChild(svg);
    wrapper.appendChild(p);
    return wrapper;
  }

  function showSuccess() {
    formEl.textContent = ''; // safe clear
    formEl.appendChild(buildSuccessNode());
  }

  function showGenericError() {
    let errEl = formEl.querySelector('.form-generic-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-generic-error';
      formEl.appendChild(errEl);
    }
    errEl.textContent = 'Ocorreu um erro. Tente novamente mais tarde.';
  }

  submitBtn.addEventListener('click', function () {
    clearFieldErrors();

    const data   = getFormData();
    const errors = validateForm(data);
    const token  = window._recaptchaToken || null;

    // Show field errors
    let hasErrors = Object.keys(errors).length > 0;
    Object.keys(errors).forEach(function (key) {
      showFieldError(key, errors[key]);
    });

    // reCAPTCHA check
    const recaptchaErr = formEl.querySelector('.recaptcha-error');
    if (!token) {
      if (recaptchaErr) recaptchaErr.style.display = 'block';
      hasErrors = true;
    } else {
      if (recaptchaErr) recaptchaErr.style.display = 'none';
    }

    if (hasErrors) return;

    // Show spinner
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    const payload = Object.assign({}, data, { recaptchaToken: token });

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        showSuccess();
      })
      .catch(function (err) {
        console.error('[contact form] endpoint not configured or failed:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        showGenericError();
      });
  });
}


/* ─────────────────────────────────────────────
   7. reCAPTCHA integration
───────────────────────────────────────────── */
window.onRecaptchaLoad = function () {
  const container = document.getElementById('recaptcha-container');
  if (!container) return;

  window.grecaptcha.render('recaptcha-container', {
    sitekey: container.dataset.sitekey,
    theme: 'light',
    callback: function (token) {
      window._recaptchaToken = token;
    },
    'expired-callback': function () {
      window._recaptchaToken = null;
    },
    'error-callback': function () {
      window._recaptchaToken = null;
    }
  });
};


/* ─────────────────────────────────────────────
   8. Hero animation
───────────────────────────────────────────── */
function initHeroAnimation() {
  setTimeout(function () {
    document.body.classList.add('hero-visible');
  }, 80);
}


/* ─────────────────────────────────────────────
   9. Character counter for textarea
───────────────────────────────────────────── */
function initCharCounters() {
  document.querySelectorAll('textarea[data-maxlen]').forEach(function (textarea) {
    const max = parseInt(textarea.dataset.maxlen, 10);
    if (!max) return;

    let counter = textarea.parentElement && textarea.parentElement.querySelector('.char-count');
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'char-count';
      const parent = textarea.parentElement || textarea;
      parent.appendChild(counter);
    }

    function updateCounter() {
      const current = textarea.value.length;
      counter.textContent = current + '/' + max;
      counter.style.color = current > max * 0.9 ? '#D94F4F' : '';
    }

    textarea.addEventListener('input', updateCounter);
    updateCounter(); // initialise
  });
}


/* ─────────────────────────────────────────────
   10. Bootstrap on DOM ready
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initScrollNav();
  initFadeIn();
  initServiceOptions();
  initFloatFields();
  initContactForm();
  initHeroAnimation();
  initCharCounters();
});
