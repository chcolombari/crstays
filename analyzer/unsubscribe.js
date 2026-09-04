(function () {
  "use strict";
  const config = window.PPA_CONFIG || {};
  const apiBaseUrl = String(config.apiBaseUrl || "").trim().replace(/\/+$/, "");
  const params = new URLSearchParams(location.search);
  const language = params.get("lang") === "en" ? "en" : "es";
  const token = params.get("t") || "";
  const target = document.querySelector("#unsubscribe-status");
  document.documentElement.lang = language;
  const fallback = language === "en" ? "We could not update your preferences. Please contact CR Stays." : "No pudimos actualizar tus preferencias. Contacta a CR Stays.";
  if (!/^[A-Za-z0-9_-]{43,128}$/.test(token)) { target.textContent = fallback; return; }
  fetch(apiBaseUrl + "/api/unsubscribe", {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify({token: token, language: language})})
    .then((response) => response.json().then((data) => ({response: response, data: data})))
    .then(({response, data}) => { target.textContent = response.ok ? data.message : fallback; })
    .catch(() => { target.textContent = fallback; });
}());
