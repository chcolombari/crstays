(function () {
  "use strict";
  const measurementId = String((window.PPA_CONFIG || {}).gaMeasurementId || "").trim();
  const validMeasurementId = /^G-[A-Z0-9]{10,14}$/.test(measurementId);
  if (!validMeasurementId) {
    window.ppaTrackOnce = function () { return false; };
    return;
  }

  const loader = document.createElement("script");
  loader.async = true;
  loader.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(loader);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", measurementId, {send_page_view: false});

  const events = new Set([
    "analysis_started", "analysis_completed", "analysis_failed",
    "snapshot_viewed", "consulting_cta_clicked", "ppa_result_viewed",
    "ppa_host_consulting_clicked", "ppa_management_clicked", "ppa_detail_expanded"
  ]);
  const fields = new Set([
    "analysis_id", "listing_id", "score_band", "score_released", "report_version"
  ]);
  const memory = window.__ppaAnalyticsOnce = window.__ppaAnalyticsOnce || new Set();

  window.ppaTrackOnce = function (event, key, parameters) {
    if (!events.has(event)) return false;
    const onceKey = "ppa_ga4:" + event + ":" + String(key || "default");
    try {
      if (sessionStorage.getItem(onceKey)) return false;
      sessionStorage.setItem(onceKey, "1");
    } catch (_) {
      if (memory.has(onceKey)) return false;
      memory.add(onceKey);
    }
    const safe = {source: "private_beta"};
    Object.entries(parameters || {}).forEach(function (entry) {
      const field = entry[0], value = entry[1];
      if (fields.has(field) && (typeof value === "string" || typeof value === "boolean")) {
        safe[field] = value;
      }
    });
    gtag("event", event, safe);
    return true;
  };
}());
