/**
 * gabriel-maciel-theme — main.js
 * Vanilla JS replacement for all React behavior.
 */

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   1. Mobile hamburger menu
───────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const iconHamburger = hamburger.querySelector('.icon-hamburger');
  const iconClose     = hamburger.querySelector('.icon-close');

  function setIcon(type) {
    const isClose = type === 'close';
    if (iconHamburger) iconHamburger.style.display = isClose ? 'none' : '';
    if (iconClose)     iconClose.style.display     = isClose ? '' : 'none';
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

  // Mark elements as will-animate BEFORE observing so they start hidden only
  // after JS has run — prevents flash of invisible content on slow connections.
  elements.forEach(function (el) {
    el.classList.add('will-animate');
  });

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
    const nomeEl = getFieldEl('nome'), emailEl = getFieldEl('email'), mensagemEl = getFieldEl('mensagem');
    const nome     = nomeEl     ? nomeEl.value     : '';
    const email    = emailEl    ? emailEl.value    : '';
    const mensagem = mensagemEl ? mensagemEl.value : '';
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

    let hasErrors = Object.keys(errors).length > 0;
    Object.keys(errors).forEach(function (key) {
      showFieldError(key, errors[key]);
    });

    if (hasErrors) return;

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    const siteKey = window.RECAPTCHA_SITE_KEY || '';

    function sendWithToken(token) {
      const payload = Object.assign({}, data, { recaptchaToken: token || '' });
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
    }

    if (siteKey && window.grecaptcha) {
      grecaptcha.ready(function () {
        grecaptcha.execute(siteKey, { action: 'contact' }).then(sendWithToken);
      });
    } else {
      sendWithToken('');
    }
  });
}


/* ─────────────────────────────────────────────
   7. Hero animation
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
