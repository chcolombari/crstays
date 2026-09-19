# Phase 5F — Lead Capture & CTA Routing

Review branch: `phase5f-lead-capture-cta-routing`, based on website main `a4222ebe649e98879a25361343551cf2ce5982f1`. See `PHASE5F-CTA-AUDIT.md` for the complete before/recommended map, including all static pages and a separate Host Consulting inventory. See `PHASE5F-CTA-ROUTING-FINAL.md` for the final HTML link map.

## Implemented routing

All homepage Property Management actions—including owner entry, header contact, both contact-now actions, consultation/conversation, get-started, potential, Costa Rica, join-owners and footer consultation—lead to `#contacto`. EN retains `#contact` as an old-link anchor. Homepage WhatsApp icons and the contact method remain secondary, with the requested Property Management message. A WhatsApp option remains beneath both the form and success confirmation. The EN logo now uses the existing `/En/` directory instead of `/en/`.

Host Consulting's anchors, package inquiries and Property Management informational cross-links are preserved. General header/footer/floating WhatsApp uses the requested Host Consulting message; package-specific text retains its original intent. Guest booking, support and Analyzer behavior are preserved. Analyzer files, scoring, email/nurture flows, CORS, deployment configuration and production environment variables are unchanged.

## Form and configuration

The real HTML form has four required contact/property fields, optional property type, operating boolean, service and message. Both languages have explicitly authored labels, validation feedback, in-progress text and the exact requested success copy. Submission uses `POST /api/consultation-leads`, disables the button while pending, preserves input on failure, and confirms only on a successful backend receipt. It sends no credentials and cannot access Supabase or Brevo directly.

`/analyzer/config.js` supplies the existing public `apiBaseUrl` and `gaMeasurementId`. Configure the API base to staging for preview QA; do not test the new endpoint against production before release. The measurement ID is currently blank, so analytics stays inactive until the existing configuration mechanism supplies a valid ID. No new analytics platform or ID was added. Fixed events: `consultation_form_started`, `consultation_form_submitted`, `consultation_form_error`, `property_management_cta_clicked`, `host_consulting_cta_clicked`, `whatsapp_clicked`. Parameters are fixed source and language only—no email, phone, name, location, message, destination or other user-provided value. Analyzer analytics is unchanged.

## Verification

Existing frontend suite: `python3 -m unittest discover -s tests -v` (40 tests). Browser suite: `NODE_PATH=<Playwright package directory> node tests/test_phase5f_browser.cjs`, using installed Chrome (override with `CHROME_PATH`). Browser tests serve local files and intercept every external request; they do not send production leads/emails. They cover ES/EN at 390 and 1280 pixels, required fields, retry, duplicate-click guard, exact confirmation, payload, secondary WhatsApp, analytics events and privacy.

The mobile page already overflows horizontally on main (1301px content in a 390px viewport, from `promise-q` and `badges`). This change does not increase it; the contact section itself fits. This prior issue remains outside the requested section scope. The browser tests compare against the exact main baseline and check contact bounds separately. Social/location placeholder links and older guest-page links are inventoried but need a separate verified destination decision.

Before merge: use the staging backend/migration/recipient instructions in the paired backend report; verify one real ES and EN request, secondary WhatsApp message, keyboard focus, mobile devices and the legacy EN contact anchor; confirm analytics with a configured staging GA4 ID; recheck Host Consulting package intents and Analyzer regression. Automated provider mocks do not prove live Supabase or Brevo delivery. Review pending/failed email handling and possible duplicate leads after ambiguous network failures with operations.
