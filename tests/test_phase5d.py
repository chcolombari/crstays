import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ANALYZER = ROOT / "analyzer"


class Phase5DIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ANALYZER / "index.html").read_text()
        cls.css = (ANALYZER / "brand.css").read_text()
        cls.config = (ANALYZER / "config.js").read_text()
        cls.analytics = (ANALYZER / "analytics.js").read_text()

    def test_analyzer_static_files_exist(self):
        for name in ("index.html", "config.js", "analytics.js", "brand.css", "assets/logo-full.png"):
            self.assertTrue((ANALYZER / name).is_file(), name)

    def test_nested_route_assets_are_relative(self):
        for ref in ("brand.css", "config.js", "analytics.js", "assets/logo-full.png"):
            self.assertIn(ref, self.html)
        self.assertNotIn('src="/analyzer/', self.html)

    def test_public_render_api_is_configured(self):
        self.assertIn('apiBaseUrl: "https://crstays-ppa.onrender.com"', self.config)

    def test_only_public_ppa_endpoints_are_called(self):
        calls = set(re.findall(r'apiUrl\("([^\"]+)"\)', self.html))
        self.assertEqual(calls, {"/api/analyze", "/api/leads"})
        self.assertNotIn("/internal/", self.html + self.config + self.analytics)

    def test_frontend_contains_no_secret_material(self):
        text = "\n".join(p.read_text(errors="ignore") for p in ANALYZER.rglob("*") if p.is_file())
        forbidden = (
            "DATABASE" + "_URL", "PPA_INTERNAL" + "_PASSWORD",
            "PPA_INTERNAL" + "_USERNAME", "ANTHROPIC" + "_API_KEY",
            "postgresql" + "://", "postgres" + "://", "sk-" + "ant-",
        )
        for marker in forbidden:
            self.assertNotIn(marker, text)

    def test_brand_fonts_are_exact(self):
        self.assertIn("Hammersmith+One", self.html)
        self.assertIn("Montserrat:wght@300;600;700", self.html)
        self.assertIn('font-family: "Hammersmith One"', self.css)
        self.assertIn('font-family: "Montserrat"', self.css)

    def test_brand_shape_rule_is_global(self):
        self.assertIn("* { border-radius: 0 !important; }", self.css)

    def test_gold_is_primary_action_fill(self):
        self.assertRegex(self.css, r"\.nav-cta, \.primary, \.secondary \{[^}]*background: var\(--gold\)")
        self.assertNotRegex(self.css, r"\.primary[^}]*background: var\(--forest\)")

    def test_warning_palette_is_semantic(self):
        self.assertIn("--warning: #9C4A3A", self.css)
        self.assertIn("--warning-soft: #F5E6E1", self.css)
        self.assertIn(".failure", self.css)

    def test_score_has_gold_progress_treatment_without_score_math_change(self):
        self.assertIn('class="score-ring"', self.html)
        self.assertIn("border: 10px solid var(--gold)", self.css)
        self.assertIn("width: calc(var(--score) * 1%)", self.css)
        self.assertIn("${esc(a.score)}", self.html)

    def test_four_pillar_statuses_are_preserved_and_styled(self):
        for label in ("Analizada", "Analizada parcialmente", "Necesitamos más información"):
            self.assertIn(label, self.html)
        for state in ("analyzed", "partial", "insufficient"):
            self.assertIn(f".status-pill.{state}", self.css)

    def test_wayfinding_exists(self):
        self.assertIn('class="site-nav"', self.html)
        self.assertIn('href="/"', self.html)
        self.assertIn('class="site-footer"', self.html)

    def test_ga4_allowlist_and_no_pii_policy_remain(self):
        for event in ("analysis_started", "analysis_completed", "analysis_failed", "snapshot_viewed", "consulting_cta_clicked"):
            self.assertIn(event, self.analytics)
        self.assertIn("const fields = new Set", self.analytics)
        self.assertNotIn("email", re.sub(r"measurementId", "", self.analytics, flags=re.I).lower())

    def test_homepages_link_to_analyzer(self):
        for path in (ROOT / "index.html", ROOT / "En/index.html"):
            self.assertIn('href="/analyzer/"', path.read_text())

    def test_mobile_high_intent_actions_exist(self):
        for path in (ROOT / "index.html", ROOT / "En/index.html"):
            text = path.read_text()
            self.assertIn("mobile-menu-toggle", text)
            self.assertIn("mobile-wa", text)
            self.assertIn("Book Direct", text)

    def test_service_cards_receive_line_icons(self):
        for path in (ROOT / "index.html", ROOT / "En/index.html"):
            text = path.read_text()
            self.assertIn("service-icon", text)
            self.assertIn("stroke-width=\"1\"", text)

    def test_functional_emoji_are_absent_from_site_source(self):
        suffixes = {".html", ".js", ".css"}
        for path in ROOT.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in suffixes:
                continue
            text = path.read_text(errors="ignore")
            self.assertFalse(any(ord(char) >= 0x1F000 for char in text), str(path))
            self.assertNotIn("★", text, str(path))

    def test_scroll_work_is_throttled_and_looping_cue_removed(self):
        for path in (ROOT / "index.html", ROOT / "En/index.html"):
            text = path.read_text()
            self.assertIn("requestAnimationFrame", text)
            self.assertIn("{ passive: true }", text)
            self.assertNotIn("animation:hzoom 20s", text)
            self.assertNotIn("animation:sb 2.2s", text)


if __name__ == "__main__":
    unittest.main(verbosity=2)
