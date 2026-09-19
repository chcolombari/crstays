(function () {
  'use strict';
  const form = document.getElementById('consultation-form');
  if (!form) return;
  const en = form.dataset.language === 'en';
  const button = form.querySelector('button[type="submit"]');
  const error = document.getElementById('consultation-error');
  const progress = document.getElementById('consultation-progress');
  const success = document.getElementById('consultation-success');
  let started = false, busy = false, complete = false, validationReported = false;
  function track(event) { if (window.consultationTrack) window.consultationTrack(event); }
  function begin() { if (!started) { started = true; track('consultation_form_started'); } }
  form.addEventListener('input', function () { begin(); validationReported = false; });
  form.addEventListener('invalid', function () {
    begin();
    if (!validationReported) { validationReported = true; track('consultation_form_error'); }
  }, true);
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (busy || complete) return;
    begin();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const payload = {};
    ['name','email','phone','property_location','property_type','requested_service','message'].forEach(function (key) { payload[key] = String(data.get(key) || '').trim(); });
    payload.currently_operating = data.get('currently_operating') === '' ? null : data.get('currently_operating') === 'true';
    payload.source = 'homepage_private_consultation';
    payload.language = en ? 'en' : 'es';
    const phone = payload.phone.replace(/[ ()\-.]/g, '');
    if (!/^\+?[0-9]{7,15}$/.test(phone) || !payload.name || !payload.property_location) {
      error.textContent = en ? 'Check your name, phone number and property location.' : 'Revisa tu nombre, teléfono y ubicación de la propiedad.';
      error.hidden = false; track('consultation_form_error'); return;
    }
    busy = true; button.disabled = true; error.hidden = true;
    form.setAttribute('aria-busy','true');
    progress.textContent = en ? 'Sending your request…' : 'Enviando tu solicitud…'; progress.hidden = false;
    const controller = new AbortController();
    const timeout = setTimeout(function () { controller.abort(); }, 25000);
    try {
      const base = String((window.PPA_CONFIG || {}).apiBaseUrl || '').replace(/\/$/, '');
      if (!base) throw new Error('Configuration unavailable');
      const response = await fetch(base + '/api/consultation-leads', {
        method: 'POST', headers: {'Content-Type':'application/json'}, credentials: 'omit',
        body: JSON.stringify(payload), signal: controller.signal
      });
      if (!response.ok) throw new Error('Submission unavailable');
      const result = await response.json();
      if (result.status !== 'received') throw new Error('Submission unavailable');
      complete = true; form.hidden = true; success.hidden = false; success.focus({preventScroll: true}); success.scrollIntoView({block: 'center'});
      track('consultation_form_submitted');
    } catch (_) {
      error.textContent = en ? 'We could not confirm your request. Please try again in a moment or contact us on WhatsApp.' : 'No pudimos confirmar tu solicitud. Intenta nuevamente en un momento o contáctanos por WhatsApp.';
      error.hidden = false; track('consultation_form_error');
    } finally {
      clearTimeout(timeout); busy = false; button.disabled = false;
      form.removeAttribute('aria-busy'); progress.hidden = true;
    }
  });
}());
