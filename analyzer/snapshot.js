(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[char]));
  const config = window.PPA_CONFIG || {};
  const apiBaseUrl = String(config.apiBaseUrl || "").trim().replace(/\/+$/, "");
  const publicSiteUrl = String(config.publicSiteUrl || "https://crstays.com").trim().replace(/\/+$/, "");
  if (!/^https?:\/\//.test(apiBaseUrl)) throw new Error("PPA API configuration is invalid");
  const apiUrl = (path) => apiBaseUrl + path;
  const requestedLanguage = new URLSearchParams(location.search).get("lang");
  let language = requestedLanguage === "en" ? "en" : "es";
  let busy = false;
  let currentEmail = "";
  let currentUrl = "";

  const COPY = {
    es: {
      back: "Volver a CR Stays", contact: "Contacto", eyebrow: "ANÁLISIS PÚBLICO",
      entryTitle: "Descubre qué está contando tu propiedad hoy.",
      entryIntro: "Analizamos la información pública de tu anuncio para mostrarte señales concretas de la propiedad, su presentación y la experiencia del huésped.",
      urlLabel: "Enlace público de Airbnb", emailLabel: "¿Dónde enviamos tu Snapshot?",
      analyze: "Analizar mi propiedad gratis", free: "Gratis. Sin tarjeta. Usamos únicamente información pública de tu anuncio.",
      consent: "Quiero recibir recomendaciones prácticas de CR Stays para mejorar mi propiedad y mi estrategia de alquiler.",
      transactional: "El correo con tu Snapshot es transaccional. Las recomendaciones son opcionales y esta casilla está desmarcada por defecto.",
      runningTitle: "Estamos revisando tu propiedad", runningIntro: "Organizamos únicamente la evidencia pública disponible.",
      loadingSaved: "Cargando tu Snapshot guardado…", result: "TU RESULTADO",
      resultTitle: "Tu Snapshot ejecutivo está listo", resultIntro: "Una lectura concisa de las señales públicas que sí podemos sostener.",
      score: "CR STAYS PROPERTY PERFORMANCE SCORE", noScore: "Score no publicado",
      strong: "Tu anuncio muestra señales públicas fuertes, aunque todavía hay áreas que conviene revisar antes de asumir que está maximizando su potencial.",
      limited: "Pudimos revisar aspectos concretos, pero la evidencia pública no permite publicar un número responsable.",
      findings: "Tres hallazgos clave", reviews: "Reseñas", strongest: "Señal pública destacada",
      unknownTitle: "Qué todavía no podemos saber", unknown: "La información pública de Airbnb no confirma optimización de precios, ocupación, producción, ritmo de reservas ni desempeño de ingresos.",
      management: "Quiero que CR Stays revise mi operación", consulting: "Prefiero seguir gestionando yo — Host Consulting",
      details: "Ver análisis detallado", evidence: "Ver evidencia del anuncio", reviewDetail: "Ver análisis de reseñas",
      pillars: "Ver detalle de los cuatro pilares", methodology: "Ver metodología", unknownDetail: "Ver qué todavía no podemos saber",
      recommendations: "Ver recomendaciones / referencias Airbnb", analyzed: "Analizada", partial: "Analizada parcialmente",
      insufficient: "Necesitamos más información", strategy: "ESTRATEGIA", strategyCopy: "Precios, ocupación, calendario, descuentos y producción real.",
      detailIntro: "La evidencia completa permanece disponible. Lo que no pudimos comprobar no se califica como malo.",
      sent: "También enviamos este Snapshot y su enlace persistente al correo indicado.",
      another: "Analizar otra propiedad", leadTitle: "Cuéntanos cómo contactarte", name: "Nombre", phone: "WhatsApp — opcional",
      leadSubmit: "Solicitar revisión de mi propiedad", leadSuccess: "Gracias. Recibimos tu solicitud.",
      urlRequired: "Pega el enlace público de tu anuncio de Airbnb.", emailRequired: "Ingresa un correo válido.",
      loadError: "No pudimos abrir este resultado. Revisa el enlace o inténtalo más tarde.",
    },
    en: {
      back: "Back to CR Stays", contact: "Contact", eyebrow: "PUBLIC ANALYSIS",
      entryTitle: "Discover what your property is communicating today.",
      entryIntro: "We analyze the public information in your listing to show concrete signals about the property, its presentation and the guest experience.",
      urlLabel: "Public Airbnb link", emailLabel: "Where should we send your Snapshot?",
      analyze: "Analyze my property free", free: "Free. No card. We use only public information from your listing.",
      consent: "I'd like to receive practical CR Stays recommendations to improve my property and rental strategy.",
      transactional: "Your Snapshot email is transactional. Recommendations are optional and this box is unchecked by default.",
      runningTitle: "We are reviewing your property", runningIntro: "We organize only the public evidence available.",
      loadingSaved: "Loading your saved Snapshot…", result: "YOUR RESULT",
      resultTitle: "Your executive Snapshot is ready", resultIntro: "A concise reading of the public signals we can support.",
      score: "CR STAYS PROPERTY PERFORMANCE SCORE", noScore: "Score not published",
      strong: "Your listing shows strong public signals, although there are still areas worth reviewing before assuming it is maximizing its potential.",
      limited: "We reviewed concrete aspects, but the public evidence does not support publishing a responsible number.",
      findings: "Three key findings", reviews: "Reviews", strongest: "Highlighted public signal",
      unknownTitle: "What we still cannot know", unknown: "Public Airbnb information cannot confirm pricing optimization, occupancy, production, booking pace or revenue performance.",
      management: "I want CR Stays to review my operation", consulting: "I prefer to keep managing — Host Consulting",
      details: "View detailed analysis", evidence: "View listing evidence", reviewDetail: "View review analysis",
      pillars: "View the four-pillar detail", methodology: "View methodology", unknownDetail: "View what we still cannot know",
      recommendations: "View recommendations / Airbnb references", analyzed: "Analyzed", partial: "Partially analyzed",
      insufficient: "More information needed", strategy: "STRATEGY", strategyCopy: "Pricing, occupancy, calendar, discounts and actual production.",
      detailIntro: "The complete evidence remains available. What we could not verify is not treated as negative.",
      sent: "We also sent this Snapshot and its persistent link to the email provided.",
      another: "Analyze another property", leadTitle: "Tell us how to contact you", name: "Name", phone: "WhatsApp — optional",
      leadSubmit: "Request a review of my property", leadSuccess: "Thank you. We received your request.",
      urlRequired: "Paste the public link to your Airbnb listing.", emailRequired: "Enter a valid email.",
      loadError: "We could not open this result. Check the link or try again later.",
    },
  };
  const t = (key) => COPY[language][key];
  const STAGES = {
    es: ["Leyendo tu anuncio", "Organizando la evidencia pública", "Preparando tu Snapshot"],
    en: ["Reading your listing", "Organizing public evidence", "Preparing your Snapshot"],
  };
  const track = (event, key, params) => window.ppaTrackOnce && window.ppaTrackOnce(event, key, params || {});
  const listingId = (value) => (String(value || "").match(/\/rooms\/(\d+)/) || [])[1] || null;

  function applyLanguage(next) {
    language = next === "en" ? "en" : "es";
    document.documentElement.lang = language;
    document.querySelectorAll("[data-copy]").forEach((node) => { if (COPY[language][node.dataset.copy]) node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-language]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
  }

  function drawProgress() {
    $("#stages").innerHTML = STAGES[language].map((label, index) => `<li${index === 0 ? ' class="active"' : ""}>${esc(label)}</li>`).join("");
    $("#review-categories").innerHTML = "";
  }

  function locationText(location) {
    return [...new Set([location && location.area_label, location && location.city, location && location.region, location && location.country].filter(Boolean))].join(" · ");
  }

  function scoreSection(analysis, listing) {
    const released = analysis.score_released && analysis.score != null;
    const score = released ? `<div class="score-ring" style="--score:${esc(analysis.score)}" aria-label="${esc(analysis.score)} / 100"><div class="score-number">${esc(analysis.score)}<span>/100</span></div></div>` : `<div class="withheld-title">${t("noScore")}</div>`;
    return `<header class="result-head"><div class="kicker">${t("result")}</div><h1>${t("resultTitle")}</h1><p>${t("resultIntro")}</p><div class="listing-line">${esc(listing.title || "Airbnb")} · ${esc([listing.property_type, locationText(listing.location)].filter(Boolean).join(" · "))}</div></header><section class="panel executive-score"><div class="score-label">${t("score")}</div><div class="score-layout"><div>${score}</div><p class="interpretation"><strong>${released ? t("strong") : t("limited")}</strong></p></div></section>`;
  }

  function insightCard(item) {
    return `<article class="insight ${esc(item.kind)}"><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p>${item.metric ? `<span class="metric">${esc(item.metric)}</span>` : ""}</article>`;
  }

  function findingsSection(analysis) {
    const findings = (analysis.personalized_insights || []).slice(0, 3);
    return `<section class="panel editorial executive-findings"><div class="section-kicker">${t("findings")}</div><div class="insights">${findings.map(insightCard).join("")}</div></section>`;
  }

  function reviewVisualization(analysis) {
    const ratings = (analysis.experience_ratings || []).filter((item) => typeof item.value === "number");
    if (!ratings.length) return "";
    const overall = ratings.find((item) => item.key === "overall");
    const categories = ratings.filter((item) => item.key !== "overall");
    const bars = categories.map((item) => `<div class="review-bar"><span>${esc(item.label)}</span><div class="review-track" aria-hidden="true"><i style="width:${Math.max(0, Math.min(100, item.value / (item.scale || 5) * 100))}%"></i></div><strong>${esc(item.value)} / ${esc(item.scale || 5)}</strong></div>`).join("");
    const strongest = categories.length ? categories.reduce((best, item) => item.value > best.value ? item : best) : overall;
    return `<section class="panel editorial review-summary"><div class="section-kicker">${t("reviews")}</div>${overall ? `<div class="overall-rating">${esc(overall.value)} <span>/ ${esc(overall.scale || 5)}</span></div>` : ""}<div class="review-bars">${bars}</div>${strongest ? `<p class="review-sentence">${t("strongest")}: <strong>${esc(strongest.label)} ${esc(strongest.value)} / ${esc(strongest.scale || 5)}</strong>.</p>` : ""}</section>`;
  }

  function pillarState(pillar) {
    if (pillar.result != null) return [t("analyzed"), "analyzed"];
    if (pillar.coverage > 0) return [t("partial"), "partial"];
    return [t("insufficient"), "insufficient"];
  }

  function detailedAnalysis(analysis) {
    const observed = (analysis.observed_categories || []).map((item) => `<li>${esc(item.label)}</li>`).join("");
    const allInsights = (analysis.personalized_insights || []).map(insightCard).join("");
    const ratings = (analysis.experience_ratings || []).map((item) => `<li>${esc(item.label)}: <strong>${esc(item.value)} / ${esc(item.scale || 5)}</strong></li>`).join("");
    const pillars = (analysis.pillars || []).map((pillar) => { const state = pillarState(pillar); return `<div class="pillar-row"><div class="pillar-name">${esc(pillar.label)}</div><div class="state"><strong class="status-pill ${state[1]}">${state[0]}</strong>${analysis.score_released && pillar.result != null ? `<small>${esc(pillar.result)} / 100</small>` : ""}</div></div>`; }).join("");
    const callouts = (analysis.personalized_insights || []).flatMap((item) => item.callouts || []).map((item) => `<aside class="callout"><strong>${esc(item.label)}</strong><p>${esc(item.text)}</p>${item.source_url ? `<a href="${esc(item.source_url)}" target="_blank" rel="noopener noreferrer">${esc(item.source_label || "Airbnb")}</a>` : ""}</aside>`).join("");
    return `<details class="panel editorial full-analysis"><summary>${t("details")}</summary><p>${t("detailIntro")}</p><details><summary>${t("evidence")}</summary><ul>${observed}</ul><div class="insights">${allInsights}</div></details><details><summary>${t("reviewDetail")}</summary><ul>${ratings}</ul></details><details><summary>${t("pillars")}</summary><div class="pillar-list">${pillars}<div class="pillar-row"><div class="pillar-name">${t("strategy")}</div><p>${t("strategyCopy")}</p><div class="state"><strong class="status-pill insufficient">${t("insufficient")}</strong></div></div></div></details><details><summary>${t("methodology")}</summary><p>${t("detailIntro")}</p></details><details><summary>${t("unknownDetail")}</summary><p>${t("unknown")}</p></details><details><summary>${t("recommendations")}</summary>${callouts || `<p>${t("detailIntro")}</p>`}</details></details>`;
  }

  function conversionSection(canCaptureLead) {
    const management = canCaptureLead && currentEmail ? `<button class="primary" id="open-lead" type="button">${t("management")}</button>` : `<a class="primary action-link" href="${publicSiteUrl}/#contacto">${t("management")}</a>`;
    const form = canCaptureLead && currentEmail ? `<form id="lead-form" class="lead-form hidden"><h3>${t("leadTitle")}</h3><div class="lead-grid"><div class="field"><label for="lead-name">${t("name")}</label><input id="lead-name" name="name" autocomplete="name" required></div><div class="field"><label for="lead-phone">${t("phone")}</label><input id="lead-phone" name="phone" autocomplete="tel"></div><input name="email" type="hidden" value="${esc(currentEmail)}"><input name="airbnb_url" type="hidden" value="${esc(currentUrl)}"></div><button class="primary" type="submit">${t("leadSubmit")}</button><div id="lead-status" class="lead-status" role="status"></div></form>` : "";
    return `<section class="conversion"><div class="conversion-actions">${management}<a class="secondary action-link" id="host-consulting" href="${publicSiteUrl}/host-consulting.html">${t("consulting")}</a></div>${form}</section>`;
  }

  function renderSnapshot(data, options) {
    const target = $("#result");
    const analysis = data.analysis;
    if (!analysis) {
      target.innerHTML = `<div class="panel failure"><h2>${esc((data.message || {}).title || t("loadError"))}</h2><p>${esc((data.message || {}).body || t("loadError"))}</p></div>`;
      target.classList.remove("hidden");
      return;
    }
    currentUrl = (data.listing || {}).canonical_url || currentUrl;
    const emailNote = options && options.fresh && data.public_result && data.public_result.email_sent ? `<p class="email-note">${t("sent")}</p>` : "";
    target.innerHTML = `<div class="snapshot">${scoreSection(analysis, data.listing || {})}${findingsSection(analysis)}${reviewVisualization(analysis)}<section class="unknown-brief"><div class="section-kicker">${t("unknownTitle")}</div><p>${t("unknown")}</p></section>${conversionSection(data.lead_capture_available)}${emailNote}${detailedAnalysis(analysis)}${options && options.fresh ? `<div class="actions"><button class="secondary" type="button" id="another">${t("another")}</button></div>` : ""}</div>`;
    target.classList.remove("hidden");
    const key = listingId(currentUrl) || "snapshot";
    track("ppa_result_viewed", key, {listing_id: listingId(currentUrl), score_released: Boolean(analysis.score_released)});
    $("#host-consulting") && $("#host-consulting").addEventListener("click", () => track("ppa_host_consulting_clicked", key, {listing_id: listingId(currentUrl)}));
    $("#open-lead") && $("#open-lead").addEventListener("click", () => { track("ppa_management_clicked", key, {listing_id: listingId(currentUrl)}); $("#open-lead").classList.add("hidden"); $("#lead-form").classList.remove("hidden"); $("#lead-name").focus(); });
    $("#lead-form") && $("#lead-form").addEventListener("submit", submitLead);
    $("#another") && $("#another").addEventListener("click", () => location.reload());
    target.querySelectorAll("details").forEach((detail, index) => detail.addEventListener("toggle", () => { if (detail.open) track("ppa_detail_expanded", key + ":" + index, {listing_id: listingId(currentUrl)}); }));
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  async function submitLead(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const response = await fetch(apiUrl("/api/leads"), {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify({name: form.name.value, email: form.email.value, phone: form.phone.value, airbnb_url: form.airbnb_url.value})});
      if (!response.ok) throw new Error();
      $("#lead-status").textContent = t("leadSuccess");
    } catch (_) {
      $("#lead-status").textContent = t("loadError");
      button.disabled = false;
    }
  }

  function fieldError(id, message) {
    const error = $(id);
    error.textContent = message;
    error.classList.remove("hidden");
    if (id === "#url-error") $("#airbnb-url").classList.add("url-invalid");
  }

  async function runAnalysis(event) {
    event.preventDefault();
    if (busy) return;
    const url = $("#airbnb-url").value.trim();
    const email = $("#analysis-email").value.trim().toLowerCase();
    $("#url-error").classList.add("hidden"); $("#email-error").classList.add("hidden"); $("#airbnb-url").classList.remove("url-invalid");
    if (!url) fieldError("#url-error", t("urlRequired"));
    if (!email || !$("#analysis-email").validity.valid) fieldError("#email-error", t("emailRequired"));
    if (!url || !email || !$("#analysis-email").validity.valid) return;
    busy = true; currentEmail = email; currentUrl = url;
    $("#analyze").disabled = true; $("#entry").classList.add("hidden"); $("#running").classList.remove("hidden");
    drawProgress();
    const key = listingId(url) || "submission";
    track("analysis_started", key, {listing_id: listingId(url)});
    try {
      const response = await fetch(apiUrl("/api/analyze"), {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify({airbnb_url: url, email: email, language: language, marketing_consent: $("#marketing-consent").checked})});
      const data = await response.json();
      if (response.status === 400 && data.field_errors) {
        $("#entry").classList.remove("hidden");
        Object.entries(data.field_errors).forEach(([field, message]) => fieldError(field === "email" ? "#email-error" : field === "airbnb_url" ? "#url-error" : "#entry-error", message));
      } else {
        renderSnapshot(data, {fresh: true});
        track(data.analysis ? "analysis_completed" : "analysis_failed", key, {listing_id: listingId(url), score_released: Boolean(data.analysis && data.analysis.score_released)});
      }
    } catch (_) {
      renderSnapshot({message: {title: t("loadError"), body: t("loadError")}}, {fresh: true});
      track("analysis_failed", key, {listing_id: listingId(url)});
    } finally {
      $("#running").classList.add("hidden"); busy = false; $("#analyze").disabled = false;
    }
  }

  async function loadPersistentResult() {
    const token = new URLSearchParams(location.search).get("t") || "";
    if (!/^[A-Za-z0-9_-]{43,128}$/.test(token)) return renderSnapshot({message: {title: t("loadError"), body: t("loadError")}});
    try {
      const response = await fetch(apiUrl("/api/public-result/") + encodeURIComponent(token));
      const data = await response.json();
      if (!response.ok) throw new Error();
      applyLanguage(data.language);
      renderSnapshot(data, {fresh: false});
    } catch (_) {
      renderSnapshot({message: {title: t("loadError"), body: t("loadError")}});
    }
  }

  applyLanguage(language);
  document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => applyLanguage(button.dataset.language)));
  if (document.body.dataset.page === "analyzer") {
    $("#analysis-form").addEventListener("submit", runAnalysis);
    $("#airbnb-url").addEventListener("input", (event) => { if (event.currentTarget.validity.valid) { event.currentTarget.classList.remove("url-invalid"); $("#url-error").classList.add("hidden"); } });
  } else if (document.body.dataset.page === "result") {
    loadPersistentResult();
  }
}());
