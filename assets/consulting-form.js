/* One reusable ES/EN form; field visibility and enum labels share the backend contract. */
(() => {
  'use strict';
  const root = document.getElementById('consulting-intake');
  if (!root) return;
  const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
  const en = lang === 'en';
  const text = (es, english) => en ? english : es;
  const prefix = en ? '/En/' : '/';
  const notice = document.getElementById('intake-notice');
  const form = document.getElementById('consulting-form');
  const fieldsRoot = document.getElementById('intake-fields');
  const summary = document.getElementById('intake-errors');
  const progress = document.getElementById('intake-progress');
  const success = document.getElementById('intake-success');
  const submit = form.querySelector('button[type=submit]');
  let schema, plan, busy = false, complete = false, submissionId, intakeToken = '';
  const fields = new Map();
  const query = new URLSearchParams(location.search);
  // Payment authorization is accepted only via fragment, never a query parameter or storage.
  const fragment = new URLSearchParams(location.hash.slice(1));
  intakeToken = fragment.get('intake_token') || '';
  if (fragment.has('intake_token')) history.replaceState(null, '', location.pathname + location.search);
  if (query.has('intake_token')) {
    query.delete('intake_token');
    history.replaceState(null, '', location.pathname + '?' + query.toString());
  }
  const element = (tag, value, className) => {
    const node = document.createElement(tag);
    if (value !== undefined) node.textContent = value;
    if (className) node.className = className;
    return node;
  };
  const fieldLabel = spec => (spec.label_by_plan?.[plan] || spec.label)[lang];
  const matches = (condition, values) => Object.entries(condition || {}).every(([key, list]) => list.includes(values[key]));
  const setNotice = message => { notice.textContent = message; notice.hidden = false; };
  function values() {
    const data = {};
    for (const [key, field] of fields) {
      data[key] = field.spec.type === 'checkboxes' ? field.controls.filter(c=>c.checked).map(c=>c.value) : field.controls[0].value.trim();
    }
    return data;
  }
  function clearError(field) {
    field.error.textContent = ''; field.error.hidden = true;
    field.controls.forEach(c=>c.removeAttribute('aria-invalid'));
  }
  function visibility() {
    const current = values();
    for (const [key, field] of fields) {
      const visible = matches(field.spec.when, current);
      const required = visible && (field.spec.required || (field.spec.required_when && matches(field.spec.required_when, current)));
      field.wrapper.hidden = !visible;
      field.required = !!required;
      field.marker.hidden = !required;
      field.controls.forEach(control => {
        control.disabled = !visible;
        control.required = !!required && field.spec.type !== 'checkboxes';
        if (!visible) { if (control.type === 'checkbox') control.checked = false; else control.value = ''; }
      });
      if (!visible) clearError(field);
    }
  }
  function buildField(key, group) {
    const spec = schema.fields[key];
    const checkbox = spec.type === 'checkboxes';
    const wrapper = element(checkbox ? 'fieldset' : 'div', undefined, 'intake-field');
    wrapper.dataset.field = key;
    const label = element(checkbox ? 'legend' : 'label', fieldLabel(spec));
    if (!checkbox) label.htmlFor = 'hc-' + key;
    const marker = element('span', ' *', 'field-required');
    marker.setAttribute('aria-hidden', 'true'); label.append(marker); wrapper.append(label);
    const controls = [];
    if (checkbox) {
      const options = element('div', undefined, 'checkbox-options');
      for (const choice of spec.options) {
        const option = element('label', undefined, 'checkbox-option');
        const input = document.createElement('input'); input.type = 'checkbox'; input.value = choice.value; input.name = key;
        input.id = 'hc-' + key + '-' + choice.value;
        option.append(input, element('span', choice.label[lang])); options.append(option); controls.push(input);
      }
      wrapper.append(options);
    } else {
      const control = document.createElement(spec.type === 'select' ? 'select' : spec.type === 'textarea' ? 'textarea' : 'input');
      if (control.tagName === 'INPUT') control.type = spec.type;
      control.id = 'hc-' + key; control.name = key;
      if (spec.type === 'select') {
        const placeholder = element('option', text('Seleccioná una opción', 'Choose an option')); placeholder.value = ''; control.append(placeholder);
        spec.options.forEach(choice => { const option = element('option', choice.label[lang]); option.value = choice.value; control.append(option); });
      }
      if (spec.max_length) control.maxLength = spec.max_length;
      if (spec.autocomplete) control.autocomplete = spec.autocomplete;
      if (spec.type === 'number') { control.min = spec.min; control.max = spec.max; control.step = 'any'; }
      if (spec.type === 'url') { control.placeholder = 'https://…'; control.autocapitalize = 'none'; control.spellcheck = false; }
      wrapper.append(control); controls.push(control);
    }
    const help = spec.help ? element('p', spec.help[lang], 'field-help') : null;
    if (help) { help.id = 'hc-help-' + key; wrapper.append(help); }
    const error = element('p', '', 'field-error'); error.id = 'hc-error-' + key; error.hidden = true; wrapper.append(error);
    controls.forEach(c => c.setAttribute('aria-describedby', (help ? help.id + ' ' : '') + error.id));
    fields.set(key, {wrapper, controls, error, marker, spec, required:false}); group.append(wrapper);
  }
  function showErrors(errors) {
    summary.replaceChildren(element('strong', text('Revisá los campos indicados:', 'Please review the highlighted fields:')));
    const list = element('ul');
    for (const [key, message] of errors) {
      const field = fields.get(key);
      if (!field) continue;
      field.error.textContent = message; field.error.hidden = false;
      field.controls.forEach(c => c.setAttribute('aria-invalid', 'true'));
      const item = element('li'); const link = element('a', fieldLabel(field.spec)); link.href = '#' + field.controls[0].id;
      link.addEventListener('click', event => { event.preventDefault(); field.controls[0].focus(); }); item.append(link); list.append(item);
    }
    summary.append(list); summary.hidden = false;
    if (errors.length && fields.has(errors[0][0])) fields.get(errors[0][0]).controls[0].focus();
  }
  function validate(current) {
    const errors = [];
    const requiredMessage = text('Completá este campo.', 'Complete this field.');
    const invalidMessage = text('Revisá el formato de este campo.', 'Check the format of this field.');
    for (const [key, field] of fields) {
      clearError(field); if (field.wrapper.hidden) continue;
      const value = current[key], type = field.spec.type;
      if (field.required && (!value || Array.isArray(value) && !value.length)) { errors.push([key, requiredMessage]); continue; }
      if (!value || Array.isArray(value) && !value.length) continue;
      let valid = field.controls.every(c=>c.checkValidity());
      if (type === 'email') valid = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value) && !value.split('@')[0].includes('..') && !value.startsWith('.') && !value.split('@')[0].endsWith('.');
      if (type === 'tel') valid = /^\+?[0-9]{7,15}$/.test(value.replace(/[ ()\-.]/g,''));
      if (type === 'url') {
        try { const url = new URL(value); valid = ['http:','https:'].includes(url.protocol) && !url.username && !url.password && url.hostname.includes('.') && !/[\s\\<>]/.test(value); if (key === 'airbnb_url') valid = valid && /(^|\.)airbnb\.(com|co\.cr|co\.uk|es|ca|fr|de|it|com\.au|com\.br|mx|com\.co|pt|nl|co\.nz)$/.test(url.hostname); }
        catch (_) { valid = false; }
      }
      if (Array.isArray(value) && value.includes('none') && value.length > 1) valid = false;
      if (!valid) errors.push([key, invalidMessage]);
    }
    if (plan === 'growth_advisory' && ['active','relaunch'].includes(current.listing_status)) {
      if (current.platforms.includes('airbnb') !== (current.has_airbnb_listing === 'yes')) errors.push(['platforms',text('La selección de plataformas debe coincidir con tu respuesta sobre Airbnb.','Platforms must match your answer about Airbnb.')]);
      if (current.current_tools.includes('pricelabs') !== (current.pricelabs_usage === 'yes')) errors.push(['pricelabs_usage',text('La respuesta debe coincidir con tus herramientas actuales.','Your answer must match your current tools.')]);
    }
    if (errors.length) showErrors(errors);
    return errors.length === 0;
  }
  function storageKey() { return 'hc2-submission-' + plan; }
  function submissionKey() {
    try { const saved = sessionStorage.getItem(storageKey()); if (/^[a-f0-9-]{36}$/.test(saved || '')) return saved; } catch (_) {}
    const id = crypto.randomUUID();
    try { sessionStorage.setItem(storageKey(), id); } catch (_) {}
    return id;
  }
  function confirm() {
    complete = true; intakeToken = ''; form.hidden = true; notice.hidden = true; success.hidden = false;
    document.getElementById('success-title').textContent = text('Recibimos tu información.', 'We received your information.');
    const copy = plan === 'host_starter' ? text('Tu intake de Host Starter quedó registrado. El siguiente paso será el pago y, después, la agenda de tu primera sesión. El pago en línea aún no está disponible.', 'Your Host Starter intake has been recorded. The next step will be payment, followed by scheduling your first session. Online payment is not yet available.') : plan === 'diagnostic_session' ? text('Tu información de Diagnostic Session quedó registrada. El siguiente paso será coordinar tu sesión. La agenda en línea aún no está disponible.', 'Your Diagnostic Session information has been recorded. The next step will be arranging your session. Online scheduling is not yet available.') : text('Tu solicitud quedó registrada. El siguiente paso es una llamada introductoria para evaluar el encaje del programa. La agenda en línea aún no está disponible; no se realizó ningún cobro.', 'Your application has been recorded. The next step is an introductory call to assess program fit. Online scheduling is not yet available; no payment has been collected.');
    document.getElementById('success-copy').textContent = copy;
    success.focus(); success.scrollIntoView({block:'start'});
  }
  form.addEventListener('change', () => { visibility(); });
  form.addEventListener('input', event => {
    const field = fields.get(event.target.name); if (field) clearError(field);
    summary.hidden = true;
  });
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (busy || complete || !schema) return;
    visibility(); const current = values(); summary.hidden = true;
    if (!validate(current)) return;
    const payload = {plan,language:lang,source:'host_consulting_'+plan,submission_id:submissionId,form_data:{}};
    for (const [key, field] of fields) {
      if (field.wrapper.hidden) continue;
      if (schema.common.includes(key) && key !== 'has_airbnb_listing') payload[key] = current[key];
      else payload.form_data[key] = current[key];
    }
    if (plan === 'diagnostic_session') payload.intake_token = intakeToken;
    const base = String((window.CONSULTING_CONFIG || {}).apiBaseUrl || '').replace(/\/$/,'');
    try {
      const target = new URL(base);
      const local = ['localhost','127.0.0.1','[::1]'];
      if (!['https:','http:'].includes(target.protocol) || (local.includes(location.hostname) && !local.includes(target.hostname))) throw new Error();
    } catch (_) {
      setNotice(text('El envío no está habilitado en esta vista previa. Podés revisar el formulario o consultar por correo.', 'Submission is not enabled in this preview. You can review the form or contact us by email.'));
      notice.focus(); return;
    }
    busy = true; submit.disabled = true; form.setAttribute('aria-busy','true'); progress.hidden = false;
    // Lock edits while the payload is in flight; restore on failure without losing values.
    const activeControls = [...form.elements].filter(c=>!c.disabled); activeControls.forEach(c=>c.disabled=true);
    const controller = new AbortController(); const timeout = setTimeout(()=>controller.abort(),25000);
    let focusAfter = null;
    try {
      const response = await fetch(base+'/api/consulting-leads',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',body:JSON.stringify(payload),signal:controller.signal});
      const result = await response.json();
      if (response.ok && result.status === 'received') { confirm(); return; }
      if (response.status === 400 && fields.has(result.field)) { showErrors([[result.field,text('Revisá este dato antes de reenviar.','Review this value before resubmitting.')]]); focusAfter = result.field; return; }
      if (result.status === 'payment_required') throw new Error('payment');
      if (result.status === 'submission_conflict') throw new Error('conflict');
      if (response.status === 429) throw new Error('rate');
      throw new Error('unavailable');
    } catch (error) {
      const copy = error.message === 'payment' ? text('Necesitás un enlace vigente emitido después del pago de Diagnostic. No se registró este intake.', 'You need a valid link issued after Diagnostic payment. This intake was not recorded.') : error.message === 'conflict' ? text('Ya existe un envío para esta sesión con información diferente. Contactanos por correo para revisarlo; no vuelvas a enviar una solicitud nueva.', 'A submission with different information already exists for this session. Contact us by email to review it; do not send a new request.') : error.message === 'rate' ? text('Esperá un minuto antes de intentar nuevamente. Conservamos los datos en este formulario.', 'Please wait one minute before retrying. Your information remains in this form.') : text('No pudimos confirmar la recepción. Tus datos siguen aquí: intentá nuevamente. El reintento usa la misma referencia para evitar duplicados.', 'We could not confirm receipt. Your information is still here: please try again. Retrying uses the same reference to avoid duplicates.');
      summary.textContent = copy; summary.hidden = false; summary.focus();
    } finally {
      clearTimeout(timeout); busy = false; activeControls.forEach(c=>c.disabled=false); submit.disabled=false; form.removeAttribute('aria-busy'); progress.hidden = true;
      if (focusAfter) fields.get(focusAfter).controls[0].focus();
    }
  });
  async function start() {
    try {
      const response = await fetch('/assets/consulting-form-schema.json',{credentials:'omit'});
      if (!response.ok) throw new Error(); schema = await response.json();
      const requested = query.get('plan');
      plan = Object.keys(schema.plans).find(p=>p===requested || schema.plans[p].slug===requested || p==='diagnostic_session' && requested==='diagnostic');
      if (!plan) { setNotice(text('Elegí un plan desde Host Consulting para continuar.', 'Choose a plan from Host Consulting to continue.')); return; }
      document.getElementById('intake-title').textContent = schema.plans[plan].name;
      document.getElementById('plan-summary').textContent = schema.plans[plan].name;
      document.getElementById('plan-details-link').href = prefix+'host-consulting/'+schema.plans[plan].slug+'.html';
      document.querySelector('.lang-switch').href = (en ? '/' : '/En/')+'host-consulting/intake.html?plan='+schema.plans[plan].slug;
      // An authorized Diagnostic user may switch language before submitting without losing access.
      document.querySelector('.lang-switch').addEventListener('click',event=>{
        if (intakeToken && !complete) {event.preventDefault();location.assign(event.currentTarget.href+'#intake_token='+encodeURIComponent(intakeToken));}
      });
      if (plan === 'diagnostic_session' && !intakeToken) {
        setNotice(text('Diagnostic Session requiere pago previo. Este intake se habilita únicamente con el enlace que recibirás después de confirmar el pago. El pago en línea aún no está disponible.', 'Diagnostic Session requires payment first. This intake is available only through the link issued after payment is confirmed. Online payment is not yet available.')); return;
      }
      for (const [groupKey, labels] of Object.entries(schema.groups)) {
        const group = element('fieldset',undefined,'form-group'); group.append(element('legend',labels[lang]));
        for (const key of schema.common.concat(schema.plans[plan].fields)) if (schema.fields[key].group === groupKey) buildField(key,group);
        fieldsRoot.append(group);
      }
      submissionId = submissionKey(); visibility(); notice.hidden = true; form.hidden = false;
    } catch (_) { setNotice(text('No pudimos cargar el formulario. Intentá nuevamente o consultá por correo.', 'We could not load the form. Please try again or contact us by email.')); }
  }
  start();
})();
