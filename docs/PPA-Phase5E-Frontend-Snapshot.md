# Phase 5E — Website Snapshot Presentation

Phase 5E changes only the website presentation and browser integration. Scoring, evidence,
acquisition, parsing, AI behavior and the public analysis facts remain backend-owned and frozen.

## Initial view

At `/analyzer/`, a successful result presents the existing score when released, a short
interpretation, no more than three returned personalized findings, review bars calculated from
the returned values and scales, the existing unknown-data boundary, and the two approved service
paths. Full evidence and analysis remain in semantic disclosure elements below those actions.

The interface has explicit ES/EN copy. The selected language is sent in the request and a saved
result restores its persisted language. The opt-in checkbox is visible, optional and unchecked.

At 390 × 844 in deterministic browser QA, the collapsed successful result measured approximately
2.8 viewports versus 5.0 viewports with all detail expanded: about 44% less initial scroll, with
both service paths before the detailed disclosure. Exact height varies with listing content.

## Public browser routes

- `POST /api/analyze`
- `POST /api/leads`
- `GET /api/public-result/<opaque-token>`
- `POST /api/unsubscribe`

There is no browser connection to Supabase, PostgreSQL, Brevo or `/internal/*`. Result and
unsubscribe pages are `noindex,nofollow`. GA4 keeps an explicit allowlist and receives no email,
phone, full URL or result/unsubscribe token.

## Local QA

```bash
python3 -m http.server 8080
python3 -m unittest discover -s tests -v
```

Open the homepage and `/analyzer/` at desktop and mobile widths. Check ES and EN, empty/invalid
fields, loading, a successful Snapshot, review bars, both service paths, every disclosure, the
deep-review form, saved-result reload and unsubscribe response. The backend must explicitly allow
`http://localhost:8080`; never use wildcard CORS.

## Deployment and rollback

Deploy the matching backend migration and environment configuration before publishing this
website candidate. If rollback is required, restore the previous website commit; the additive
backend migration may remain. No DNS, production deployment or merge is part of the candidate.

Known limitation: saved-result URLs are bearer links and should be handled as private links even
though their response contains only the allowlisted public Snapshot DTO.

## Phase 5E.1 UX polish

The loading screen cycles through the same three truthful, orientation-only stages and shows
active/completed states without percentages or backend checkpoint claims. Normal completion still
lands at the Snapshot top. A stored-result URL with `#detailed-analysis` opens the existing outer
detail disclosure after retrieval and scrolls to it; the fragment is never sent to the server and
does not rerun analysis. The primary submit label is shorter and more prominent in ES/EN while
preserving square corners, brand colors and responsive behavior.
