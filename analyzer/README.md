# CR Stays Property Analyzer frontend

This directory is the independently hostable public PPA frontend integrated at `/analyzer/`.

## Configuration

`config.js` exposes only public browser configuration:

- `apiBaseUrl`: the public Render PPA API origin;
- `gaMeasurementId`: optional GA4 measurement ID. Leave blank to keep analytics disabled.

Never add database credentials, internal PPA credentials, Anthropic keys, or other secrets here. Browser requests use only `/api/analyze` and `/api/leads`; all database access remains behind the Render backend.

## Local QA

From the repository root:

```bash
python3 -m http.server 8080
```

Open:

- `http://localhost:8080/`
- `http://localhost:8080/analyzer/`
- `http://localhost:8080/analyzer/index.html`

For a local backend, change `apiBaseUrl` only in a temporary QA copy of `config.js`. The backend must explicitly allow `http://localhost:8080`; wildcard CORS is not supported.

## Production boundary

The committed production configuration targets `https://crstays-ppa.onrender.com`. The hosting origin must be explicitly allowed by the backend CORS configuration. The Analyzer never calls `/internal/*` or Supabase directly.
