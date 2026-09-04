# CR Stays Property Analyzer frontend

This directory is the independently hostable public PPA frontend integrated at `/analyzer/`.

## Configuration

`config.js` exposes only public browser configuration:

- `apiBaseUrl`: the public Render PPA API origin;
- `publicSiteUrl`: the public website origin used for management and Host Consulting links;
- `gaMeasurementId`: optional GA4 measurement ID. Leave blank to keep analytics disabled.

Never add database credentials, Brevo keys, internal PPA credentials, Anthropic keys, or other
secrets here. Browser requests use only `/api/analyze`, `/api/leads`, `/api/public-result/<token>`
and `/api/unsubscribe`; all database and email-provider access remains behind the Render backend.

## Phase 5E presentation

The initial mobile Snapshot is an executive view: score, up to three existing findings, returned
review values, a short unknown-data boundary and the two conversion paths. The complete analysis
remains available under accessible disclosure controls. `result.html` reopens the stored public DTO
through an opaque bearer link without rerunning analysis. `unsubscribe.html` processes a separate
opaque preference token. ES/EN is selected in the frontend, sent with the analysis and restored
from a saved result. Marketing consent is optional and unchecked by default.

## Local QA

From the repository root:

```bash
python3 -m http.server 8080
```

Open:

- `http://localhost:8080/`
- `http://localhost:8080/analyzer/`
- `http://localhost:8080/analyzer/index.html`
- `http://localhost:8080/analyzer/result.html?t=<test-token>` (requires a token created by the matching backend)

For a local backend, change `apiBaseUrl` only in a temporary QA copy of `config.js`. The backend must explicitly allow `http://localhost:8080`; wildcard CORS is not supported.

## Production boundary

The committed production configuration targets `https://crstays-ppa.onrender.com`. The hosting
origin must be explicitly allowed by the backend CORS configuration. The Analyzer never calls
`/internal/*`, Supabase or Brevo directly. Result URLs are marked `noindex,nofollow`; do not put
their tokens in GA4 events or support logs.
