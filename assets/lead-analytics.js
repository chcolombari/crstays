(function () {
  'use strict';
  const id = String((window.PPA_CONFIG || {}).gaMeasurementId || '').trim();
  const events = new Set(['consultation_form_started', 'consultation_form_submitted', 'consultation_form_error', 'property_management_cta_clicked', 'host_consulting_cta_clicked', 'whatsapp_clicked', 'intro_call_click', 'calendly_click']);
  const language = document.documentElement.lang === 'en' ? 'en' : 'es';
  const host = location.pathname.endsWith('host-consulting.html');
  const introCall = location.pathname.endsWith('/host-consulting/intro-call.html');
  const source = introCall ? 'intro_call_page' : host ? 'host_consulting' : 'homepage_private_consultation';
  const configured = /^G-[A-Z0-9]{10,14}$/.test(id);
  if (configured) {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function () { window.dataLayer.push(arguments); };
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.appendChild(script);
      window.gtag('js', new Date());
      window.gtag('config', id, {send_page_view: false});
    }
  }
  // Fixed event vocabulary and context only: no field values, URLs, labels, or user IDs.
  window.consultationTrack = function (event, context) {
    if (!configured || !events.has(event)) return false;
    const plan = String(context?.plan || 'introductory_call');
    const eventSource = String(context?.source || source);
    try { window.gtag('event', event, {source: eventSource, language: language, plan: plan}); } catch (_) { return false; }
    return true;
  };
  document.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const context = {plan: link.dataset.plan || 'introductory_call', source: link.dataset.source || source};
    if (link.hasAttribute('data-intro-call')) window.consultationTrack('intro_call_click', context);
    if (href === 'https://calendly.com/crstays/15min') window.consultationTrack('calendly_click', context);
    if (href.startsWith('https://wa.me/')) window.consultationTrack('whatsapp_clicked');
    if (host && (href.startsWith('https://wa.me/') || ['#agenda','#schedule','#packages','#paquetes'].includes(href) || href.startsWith('mailto:'))) {
      window.consultationTrack('host_consulting_cta_clicked');
    } else if (href.includes('host-consulting.html')) {
      window.consultationTrack('host_consulting_cta_clicked');
    } else if (href === '#contacto') {
      window.consultationTrack('property_management_cta_clicked');
    }
  });
}());
