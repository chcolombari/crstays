"""Phase 5E static frontend, privacy and executive Snapshot checks."""
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ANALYZER = ROOT / "analyzer"


class Phase5EFrontendTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.index = (ANALYZER / "index.html").read_text()
        cls.result = (ANALYZER / "result.html").read_text()
        cls.unsubscribe = (ANALYZER / "unsubscribe.html").read_text()
        cls.snapshot = (ANALYZER / "snapshot.js").read_text()
        cls.unsubscribe_js = (ANALYZER / "unsubscribe.js").read_text()
        cls.analytics = (ANALYZER / "analytics.js").read_text()
        cls.css = (ANALYZER / "brand.css").read_text()

    def test_static_entry_result_and_unsubscribe_pages_exist(self):
        for name in ("index.html", "result.html", "unsubscribe.html", "snapshot.js", "unsubscribe.js"):
            self.assertTrue((ANALYZER / name).is_file(), name)

    def test_executive_snapshot_limits_initial_findings_to_three(self):
        self.assertIn(".slice(0, 3)", self.snapshot)
        self.assertIn("executive-score", self.snapshot)
        self.assertIn("executive-findings", self.snapshot)
        self.assertIn("unknown-brief", self.snapshot)

    def test_complete_detail_remains_accessible_without_duplication(self):
        self.assertIn('<details id="detailed-analysis" class="panel editorial full-analysis">', self.snapshot)
        for key in ("evidence", "reviewDetail", "pillars", "methodology", "unknownDetail", "recommendations"):
            self.assertIn(f't("{key}")', self.snapshot)

    def test_truthful_loading_stages_progress_without_percentages(self):
        for label in (
            "Reading your listing", "Organizing public evidence", "Preparing your Snapshot",
            "Leyendo tu anuncio", "Organizando la evidencia pública", "Preparando tu Snapshot",
        ):
            self.assertIn(label, self.snapshot)
        self.assertIn('index < activeIndex ? "done"', self.snapshot)
        self.assertIn('index === activeIndex ? "active"', self.snapshot)
        self.assertIn('const mark = index < activeIndex ? "✓"', self.snapshot)
        self.assertNotRegex(self.snapshot, r"\b(?:[1-9][0-9]?|100)%")

    def test_submit_cta_copy_and_responsive_emphasis(self):
        for text in ("ANALIZAR MI PROPIEDAD", "ANALYZE MY PROPERTY", "Gratis. Sin tarjeta.", "Free. No card required."):
            self.assertIn(text, self.snapshot + self.index)
        self.assertRegex(self.css, r"#analyze\s*\{[^}]*min-width:\s*238px;[^}]*min-height:\s*56px;")
        self.assertRegex(self.css, r"@media \(max-width: 780px\)[\s\S]*?#analyze\s*\{\s*width:\s*100%;")

    def test_review_visualization_uses_only_returned_values(self):
        self.assertIn("analysis.experience_ratings", self.snapshot)
        self.assertIn("item.value / (item.scale || 5) * 100", self.snapshot)
        self.assertNotRegex(self.snapshot, r"Math\.random|4\.9[0-9]")

    def test_language_is_sent_and_persisted_end_to_end(self):
        self.assertIn('language: language', self.snapshot)
        self.assertIn("applyLanguage(data.language)", self.snapshot)
        self.assertIn('data-language="es"', self.index)
        self.assertIn('data-language="en"', self.index)

    def test_marketing_consent_is_explicit_and_unchecked(self):
        checkbox = re.search(r'<input id="marketing-consent"[^>]*>', self.index).group(0)
        self.assertNotIn("checked", checkbox)
        self.assertIn('marketing_consent: $("#marketing-consent").checked', self.snapshot)

    def test_public_result_is_loaded_by_opaque_token_without_rerun(self):
        self.assertIn('apiUrl("/api/public-result/") + encodeURIComponent(token)', self.snapshot)
        result_loader = self.snapshot.split("async function loadPersistentResult()", 1)[1]
        self.assertNotIn('apiUrl("/api/analyze")', result_loader)
        self.assertIn("openDetailedAnalysisFromUrl();", result_loader)
        self.assertIn('location.hash !== "#detailed-analysis"', self.snapshot)
        self.assertIn("detail.open = true", self.snapshot)
        self.assertIn('detail.scrollIntoView({behavior: "auto", block: "start"})', self.snapshot)
        self.assertIn('name="robots" content="noindex,nofollow"', self.result)

    def test_normal_completion_keeps_snapshot_landing_at_top(self):
        run_analysis = self.snapshot.split("async function runAnalysis", 1)[1].split("async function loadPersistentResult", 1)[0]
        self.assertIn("renderSnapshot(data, {fresh: true})", run_analysis)
        self.assertNotIn("openDetailedAnalysisFromUrl", run_analysis)
        self.assertIn('window.scrollTo({top: 0, behavior: "smooth"})', self.snapshot)

    def test_unsubscribe_uses_public_api_and_opaque_token(self):
        self.assertIn('apiBaseUrl + "/api/unsubscribe"', self.unsubscribe_js)
        self.assertIn("encodeURIComponent", self.snapshot)
        self.assertIn('name="robots" content="noindex,nofollow"', self.unsubscribe)

    def test_only_approved_public_api_routes_are_present(self):
        combined = self.snapshot + self.unsubscribe_js
        for route in ("/api/analyze", "/api/leads", "/api/public-result/", "/api/unsubscribe"):
            self.assertIn(route, combined)
        self.assertNotIn("/internal/", combined)
        self.assertNotIn("supabase", combined.lower())

    def test_email_delivery_is_not_claimed_unless_backend_confirms_it(self):
        self.assertIn("data.public_result.email_sent", self.snapshot)

    def test_conversion_paths_appear_before_full_detail(self):
        render_function = self.snapshot.split("function renderSnapshot", 1)[1].split("async function submitLead", 1)[0]
        self.assertLess(render_function.index("conversionSection(data.lead_capture_available)"),
                        render_function.index("detailedAnalysis(analysis)"))

    def test_ga4_has_new_allowlisted_events_and_no_token_or_email(self):
        for event in ("ppa_result_viewed", "ppa_host_consulting_clicked", "ppa_management_clicked", "ppa_detail_expanded"):
            self.assertIn(event, self.analytics)
        track_calls = "\n".join(line for line in self.snapshot.splitlines() if "track(" in line)
        self.assertNotIn("token", track_calls.lower())
        self.assertNotIn("email", track_calls.lower())

    def test_no_secrets_in_analyzer_static_files(self):
        source = "\n".join(path.read_text(errors="ignore") for path in ANALYZER.rglob("*") if path.is_file())
        forbidden = ("DATABASE_URL", "BREVO_API_KEY", "PPA_INTERNAL_PASSWORD",
                     "ANTHROPIC_API_KEY", "postgresql://", "sk-ant-")
        for marker in forbidden:
            self.assertNotIn(marker, source)

    def test_brand_shape_and_mobile_density_remain_intact(self):
        self.assertIn("border-radius: 0 !important", self.css)
        self.assertIn("@media (max-width: 480px)", self.css)
        self.assertIn("grid-template-columns: 1fr", self.css)

    def test_founder_bios_use_progressive_disclosure_on_mobile(self):
        for path in (ROOT / "index.html", ROOT / "En/index.html"):
            source = path.read_text()
            self.assertIn('class="team-bio-details"', source)
            self.assertIn("matchMedia('(max-width: 768px)')", source)


if __name__ == "__main__":
    unittest.main(verbosity=2)
