# Phase 5D — Website + Analyzer Integration

## Scope

Phase 5D integrates the validated static PPA frontend into the CR Stays website at `/analyzer/` and harmonizes presentation with the existing CR Stays brand system. It does not alter PPA scoring, evidence, acquisition, public DTOs, lead events, persistence, internal tools, AI behavior, or the Render backend.

## Architecture

The production data path remains:

`crstays.com/analyzer/` → `https://crstays-ppa.onrender.com` → Supabase/PostgreSQL

The browser uses only `POST /api/analyze` and `POST /api/leads`. It has no database or internal-route access.

## Integrated frontend

The Analyzer lives in `analyzer/` as static HTML, CSS, JavaScript, and a local copy of the CR Stays logo. All Analyzer dependencies use nested-route-safe relative paths, so both `/analyzer/` and `/analyzer/index.html` work.

`analyzer/config.js` defines the public API base URL. It contains no secrets. `analyzer/analytics.js` preserves the existing optional, allowlisted, no-PII GA4 instrumentation and prevents duplicate initialization. A blank measurement ID leaves GA4 disabled.

## Visual harmonization

- CR Stays forest navigation and condensed footer provide continuous wayfinding.
- Hammersmith One is used for display headings and the score; Montserrat is used for body and UI.
- Gold is the only primary action fill.
- Branded square geometry applies `border-radius: 0` to Analyzer controls, cards, panels, alerts, and status elements.
- The released score uses a restrained gold frame and progress line. This preserves the hard square-geometry rule while keeping the requested gold visual encoding, without changing its value.
- Four-pillar states use forest, gold, or neutral status pills without changing status text.
- The error treatment uses the approved muted terracotta semantic palette.

## Website polish

The homepage structure and copy remain unchanged. Property and contact emoji were replaced by single-color line icons. Service cards receive a thin-line icon without introducing a featured-service priority. Mobile navigation now exposes a menu, WhatsApp, and Book Direct. The long hero zoom and looping scroll cue were removed; the remaining nav state update is passive and animation-frame throttled.

## Local QA

```bash
python3 -m http.server 8080
```

Then verify the homepage, `/analyzer/`, `/analyzer/index.html`, form validation, loading, successful results, error treatment, deep-review form, and both mobile layouts. Live browser API QA requires the Render backend to allow `http://localhost:8080`; production requires explicit `https://crstays.com` and optional `https://www.crstays.com` origins.

## Security and analytics

Frontend files must never contain database connection variables or passwords, PPA internal credentials, Anthropic keys, or authorization tokens. The Render API URL is intentionally public. GA4 remains limited to the existing allowlisted non-PII events and fields.

## Deferred

Zone storytelling, interactive maps, dashboard concepts, testimonial workflows, broad copy changes, a shared component framework, and framework migrations remain outside Phase 5D.

## Known risks

Vercel preview trigger validation — Sept 2026.

- The site is static and keeps duplicated Spanish/English page markup; shared components remain deferred.
- Real public acquisition depends on Airbnb response availability and the Render service.
- Future backlog: review the Analyzer's dependency on Airbnb CDN-hosted listing images; no change is included in Phase 5D.1.
- GA4 remains disabled until a valid public measurement ID is deliberately set in `analyzer/config.js`.
