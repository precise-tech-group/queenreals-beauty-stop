/* ==========================================================================
   Queenreal's Beauty Stop — contact-form.js
   Client-side validation + mailto: fallback submission.

   NOTE FOR FUTURE INTEGRATION:
   This site has no backend. On successful validation, the form opens the
   visitor's email client via a mailto: link addressed to the business,
   pre-filled with their enquiry — it does NOT silently "send" anything
   server-side. To wire a real backend later (Formspree, Netlify Forms,
   a serverless function, etc.), replace the `submitViaMailto()` call
   inside the submit handler below with a fetch() POST to that endpoint,
   and update the success/error messaging accordingly.
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('enquiryForm');
  if (!form) return;

  var statusEl = form.querySelector('.form-status');
  var BUSINESS_EMAIL = 'crishionc_2005@yahoo.com';

  var validators = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    phone: function (v) {
      if (!v.trim()) return '';
      var re = /^[0-9+()\-.\s]{7,20}$/;
      return re.test(v.trim()) ? '' : 'Please enter a valid phone number.';
    },
    service: function (v) { return v ? '' : 'Please select a service you\'re interested in.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Please tell us a bit more (at least 10 characters).'; }
  };

  function showError(field, message) {
    var wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.toggle('has-error', !!message);
    var errEl = wrap.querySelector('.field-error');
    if (errEl) errEl.textContent = message;
  }

  function validateField(field) {
    var validator = validators[field.name];
    if (!validator) return true;
    var message = validator(field.value);
    showError(field, message);
    return !message;
  }

  Array.prototype.forEach.call(form.elements, function (field) {
    if (!validators[field.name]) return;
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.closest('.field').classList.contains('has-error')) validateField(field);
    });
  });

  function buildMailto(data) {
    var subject = 'New Enquiry — ' + (data.service || 'General') + ' — ' + data.name;
    var bodyLines = [
      'Name: ' + data.name,
      'Email: ' + data.email,
      'Phone: ' + (data.phone || 'Not provided'),
      'Service Interested In: ' + data.service,
      'Preferred Day/Time: ' + (data.preferred || 'Not specified'),
      '',
      'Message:',
      data.message
    ];
    var body = bodyLines.join('\n');
    return 'mailto:' + BUSINESS_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = ['name', 'email', 'phone', 'service', 'message'];
    var allValid = true;
    fields.forEach(function (name) {
      var field = form.elements[name];
      if (field && !validateField(field)) allValid = false;
    });

    if (!allValid) {
      statusEl.textContent = 'Please fix the highlighted fields and try again.';
      statusEl.className = 'form-status is-visible';
      var firstError = form.querySelector('.field.has-error input, .field.has-error select, .field.has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      service: form.elements.service.value,
      preferred: form.elements.preferred ? form.elements.preferred.value.trim() : '',
      message: form.elements.message.value.trim()
    };

    window.location.href = buildMailto(data);

    statusEl.textContent = 'Opening your email app with your enquiry pre-filled — just hit send!';
    statusEl.className = 'form-status is-visible is-success';
  });
})();
