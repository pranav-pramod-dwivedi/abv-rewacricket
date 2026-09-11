import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SITE_URL = 'https://abv-rewacricket.pages.dev';

// Load JSON datasets
const tournament = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/tournament.json'), 'utf-8'));
const teams = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/teams.json'), 'utf-8'));
const rules = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/rules.json'), 'utf-8'));
const news = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/news.json'), 'utf-8'));

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanDesc(str, maxLen = 155) {
  if (!str) return '';
  const clean = str.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 3).trim() + '...';
}

// Global Header — Pure RDCA UI
function renderHeader(activeNav = '') {
  const navItems = [
    { name: 'Home', path: '/', key: 'home' },
    { name: 'Leaderboards', path: '/stats/', key: 'stats' },
    { name: 'The Teams (2)', path: '/teams/', key: 'teams' },
    { name: 'Matches (34)', path: '/matches/', key: 'matches' },
    { name: 'Regulations (14)', path: '/rules/', key: 'rules' },
    { name: 'Governing Council', path: '/governing-council/', key: 'governing-council' },
    { name: 'News', path: '/news/', key: 'news' },
    { name: 'Contact', path: '/contact/', key: 'contact' },
  ];

  return `<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="Atal Bihari Vajpayee Memorial Tournament — Home">
      <img class="brand-logo" src="/public/images/trophy.svg" alt="Official crest of Atal Bihari Vajpayee Memorial Tournament" width="44" height="44" />
      <span class="brand-text">
        <strong>Atal Bihari Vajpayee Memorial Tournament</strong>
        <small>Rewa Divisional Cricket &bull; MPCA</small>
      </span>
    </a>
    <div class="header-ctrl-group">
      <a class="header-search-btn desktop-only" href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" aria-label="RDCA Live Match Center" title="RDCA Live Match Center">RDCA Center &rarr;</a>
      <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="nav" aria-label="Toggle navigation menu"><svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><rect y="3" width="20" height="2" rx="1"/><rect y="9" width="20" height="2" rx="1"/><rect y="15" width="20" height="2" rx="1"/></svg></button>
    </div>
    <nav class="main-nav" data-nav id="nav" aria-label="Primary">
      <ul>
        ${navItems.map(item => `<li><a href="${item.path}" ${activeNav === item.key ? 'class="active"' : ''}>${item.name}</a></li>`).join('\n        ')}
        <li class="mobile-only-nav-item"><a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="mobile-rdca-link">RDCA Live Match Center &rarr;</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

// Global Breadcrumbs — Pure RDCA UI
function renderBreadcrumbs(crumbs = []) {
  if (!crumbs.length) return '';
  const allCrumbs = [{ name: 'Home', path: '/' }, ...crumbs];
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
  <div class="container">
    <ol>
      ${allCrumbs.map((c, i) => i === allCrumbs.length - 1
        ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
        : `<li><a href="${c.path}">${esc(c.name)}</a></li>`
      ).join('\n      ')}
    </ol>
  </div>
</nav>`;
}

// Global Footer — Pure RDCA UI
function renderFooter() {
  return `<footer class="site-footer">
  <div class="container">
    <div>
      <div class="footer-brand">
        <img src="/public/images/trophy.svg" alt="Official crest of Atal Bihari Vajpayee Memorial Tournament" width="40" height="40" />
        <h3>Atal Bihari Vajpayee Memorial Tournament</h3>
      </div>
      <p class="footer-note">The premier invitational cricket championship of Vindhya Pradesh, honoring former Prime Minister Shri Atal Bihari Vajpayee. Contested through the iconic 34-match derby between Destroyers Cricket Club and Dread Eleven. Officially sanctioned by the Rewa Division Cricket Association (RDCA) and affiliated with Madhya Pradesh Cricket Association (MPCA).</p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem">
        <span class="badge badge-completed">RDCA Sanctioned</span>
        <span class="badge badge-completed">MPCA Affiliated</span>
        <span class="badge badge-completed">BCCI Code Compliant</span>
      </div>
    </div>
    <div>
      <h3>Official Network</h3>
      <ul>
        <li><a href="https://rewa-cricket-division.vercel.app" target="_blank" rel="noopener">Rewa Cricket Division (RDCA Central) &rarr;</a></li>
        <li><a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener">RDCA Tournament Fixtures Hub &rarr;</a></li>
        <li><a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener">Destroyers CC Portal (2026 Champions) &rarr;</a></li>
        <li><a href="https://dread-eleven-rewacricket.pages.dev" target="_blank" rel="noopener">Dread Eleven Digital Stadium &rarr;</a></li>
        <li><a href="/" style="color:#fff;font-weight:600;">ABV Tournament Official Portal (Here)</a></li>
      </ul>
    </div>
    <div>
      <h3>Regulatory Codes</h3>
      <ul>
        <li><a href="/rules/anti-corruption/">Anti-Corruption Code</a></li>
        <li><a href="/rules/anti-doping/">Anti-Doping Code</a></li>
        <li><a href="/rules/match-playing-conditions/">Match Playing Conditions</a></li>
        <li><a href="/rules/suspected-illegal-action/">Illegal Bowling Action</a></li>
        <li><a href="/rules/pmoa-minimum-standards/">PMOA Standards</a></li>
        <li><a href="/rules/code-of-conduct-players/">Player Code of Conduct</a></li>
        <li><a href="/rules/ticket-terms-and-conditions/">Ticket Terms</a></li>
      </ul>
    </div>
    <div>
      <h3>Secretariat &amp; Venues</h3>
      <p class="footer-note"><strong>Match Grounds:</strong><br>Divisional Cricket Stadium, Neem Chauraha, Rewa 486001<br>APSU University Stadium, Sirmour Road, Rewa 486003</p>
      <p class="footer-note"><strong>RDCA Secretariat:</strong> +91 7662 250000<br><strong>MPCA Headquarters:</strong> +91 731 2543602<br><strong>ACU Reporting Hotline:</strong> +91 7662 250011</p>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-legal">
      <p class="footer-copyright">&copy; 2021&ndash;2026 Atal Bihari Vajpayee Memorial Tournament Committee &bull; Sanctioned by RDCA &amp; MPCA. All rights reserved.</p>
      <p class="footer-about">Official archival portal of the Atal Bihari Vajpayee Memorial Tournament, the premier bilateral cricket derby of Rewa Division, Madhya Pradesh. All match scores, playing conditions, regulations, and franchise dossiers are maintained under the auspices of the Rewa Division Cricket Association (RDCA).</p>
    </div>
  </div>
</footer>
<script src="/public/js/app.js" defer></script>`;
}

function buildJsonLd({ title, description, canonicalUrl, breadcrumbs = [], specificData = null }) {
  const schemas = [];

  // 1. BreadcrumbList Schema
  const allCrumbs = [{ name: 'Home', path: '/' }, ...breadcrumbs];
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allCrumbs.map((c, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": c.name,
      "item": `${SITE_URL}${c.path}`
    }))
  });

  // 2. Primary Organization Schema (Required for Google Search Console & SEO Logo Snippet)
  schemas.push({
    "@context": "https://schema.org",
    "@type": ["Organization", "SportsOrganization"],
    "name": "Atal Bihari Vajpayee Memorial Tournament",
    "alternateName": ["ABV Memorial Trophy", "ABV Tournament Rewa"],
    "url": `${SITE_URL}/`,
    "logo": `${SITE_URL}/logo.png`,
    "image": `${SITE_URL}/og-image.png`,
    "description": "Premier annual cricket championship of Vindhya Pradesh honoring Shri Atal Bihari Vajpayee, sanctioned by RDCA and affiliated with MPCA.",
    "parentOrganization": {
      "@type": "SportsOrganization",
      "name": "Rewa Division Cricket Association (RDCA)",
      "url": "https://rewa-cricket-division.vercel.app"
    }
  });

  // 3. WebSite Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Atal Bihari Vajpayee Memorial Tournament",
    "url": `${SITE_URL}/`,
    "image": `${SITE_URL}/logo.png`
  });

  // 4. Specific Event or Data Catalog Schema
  if (specificData) {
    schemas.push(specificData);
  }

  return schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s, null, 2)}</script>`).join('\n');
}

function renderHtmlPage({ title, description, canonicalUrl, activeNav = '', breadcrumbs = [], bodyContent, specificData = null }) {
  const safeDesc = cleanDesc(description);
  const jsonLdHtml = buildJsonLd({ title, description: safeDesc, canonicalUrl, breadcrumbs, specificData });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${safeDesc}" />
<link rel="canonical" href="${canonicalUrl}" />
<meta name="google-site-verification" content="google23e3ba68f31a1fe8" />

<!-- Open Graph -->
<meta property="og:site_name" content="Atal Bihari Vajpayee Memorial Tournament | RDCA" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${safeDesc}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:image" content="${SITE_URL}/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${safeDesc}" />
<meta name="twitter:image" content="${SITE_URL}/og-image.png" />

<!-- Google Search Console & SEO Icons -->
<link rel="shortcut icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="512x512" href="/logo.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/logo-192.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/svg+xml" href="/public/images/trophy.svg" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.json" />
<link rel="stylesheet" href="/public/css/styles.css" />
${jsonLdHtml}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${renderHeader(activeNav)}
${renderBreadcrumbs(breadcrumbs)}
<main id="main">
<div class="container">
${bodyContent}
</div>
</main>
${renderFooter()}
</body>
</html>`;
}

// All 34 Official RDCA Matches Data
const allMatchesData = [
  { id: 'm-shared-64', slug: 'destroyers-vs-dread-eleven-2026-09-20', date: '2026-09-20', season: 2026, format: '50 Overs', title: '2026 Championship Final', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 12 runs', details: 'Destroyers won by 12 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-63', slug: 'destroyers-vs-dread-eleven-2026-09-16', date: '2026-09-16', season: 2026, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 4 wickets', details: 'Destroyers won by 4 wickets at Martand School Ground No. 3. Official RDCA scorecard archived.' },
  { id: 'm-shared-62', slug: 'destroyers-vs-dread-eleven-2026-09-12', date: '2026-09-12', season: 2026, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 19 runs', details: 'Dread Eleven won by 19 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-61', slug: 'destroyers-vs-dread-eleven-2026-09-08', date: '2026-09-08', season: 2026, format: 'T20', title: 'T20 Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 7 wickets', details: 'Destroyers won by 7 wickets at Martand School Ground No. 3. Official RDCA scorecard archived.' },
  { id: 'm-shared-60', slug: 'destroyers-vs-dread-eleven-2026-09-05', date: '2026-09-05', season: 2026, format: 'T20', title: '2026 Series Opener (T20)', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 14 runs', details: 'Dread Eleven won by 14 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-59', slug: 'destroyers-vs-dread-eleven-2025-09-20', date: '2025-09-20', season: 2025, format: '50 Overs', title: '2025 Championship Final', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 34 runs', details: 'Destroyers won by 34 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-58', slug: 'destroyers-vs-dread-eleven-2025-09-16', date: '2025-09-16', season: 2025, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 5 wickets', details: 'Destroyers won by 5 wickets at Martand School Ground No. 3. Official RDCA scorecard archived.' },
  { id: 'm-shared-57', slug: 'destroyers-vs-dread-eleven-2025-09-12', date: '2025-09-12', season: 2025, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 45 runs', details: 'Destroyers won by 45 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-56', slug: 'destroyers-vs-dread-eleven-2025-09-08', date: '2025-09-08', season: 2025, format: 'T20', title: 'T20 Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 6 wickets', details: 'Destroyers won by 6 wickets at Martand School Ground No. 3. Official RDCA scorecard archived.' },
  { id: 'm-shared-55', slug: 'destroyers-vs-dread-eleven-2025-09-05', date: '2025-09-05', season: 2025, format: 'T20', title: '2025 Series Opener (T20)', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 22 runs', details: 'Destroyers won by 22 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-44', slug: 'de-vs-des-2024-09-20', date: '2024-09-20', season: 2024, format: '50 Overs', title: '2024 Championship Final', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 8 runs', details: 'Dread Eleven won by 8 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-43', slug: 'de-vs-des-2024-09-16', date: '2024-09-16', season: 2024, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 18 runs', details: 'Dread Eleven won by 18 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-42', slug: 'de-vs-des-2024-09-12', date: '2024-09-12', season: 2024, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 2 runs', details: 'Dread Eleven won by 2 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-41', slug: 'de-vs-des-2024-09-08', date: '2024-09-08', season: 2024, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 5 runs', details: 'Dread Eleven won by 5 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-40', slug: 'de-vs-des-2024-09-05', date: '2024-09-05', season: 2024, format: '50 Overs', title: '2024 Series Opener (50 Overs)', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 1 wickets', details: 'Destroyers won by 1 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-31', slug: 'de-vs-des-2023-09-20', date: '2023-09-20', season: 2023, format: '50 Overs', title: '2023 Championship Final', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 3 wickets', details: 'Destroyers won by 3 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-30', slug: 'de-vs-des-2023-09-16', date: '2023-09-16', season: 2023, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 42 runs', details: 'Dread Eleven won by 42 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-29', slug: 'de-vs-des-2023-09-12', date: '2023-09-12', season: 2023, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 27 runs', details: 'Dread Eleven won by 27 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-28', slug: 'de-vs-des-2023-09-08', date: '2023-09-08', season: 2023, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 0 wickets', details: 'Destroyers won by 0 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-27', slug: 'de-vs-des-2023-09-05', date: '2023-09-05', season: 2023, format: '50 Overs', title: '2023 Series Opener (50 Overs)', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 0 wickets', details: 'Destroyers won by 0 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-21', slug: 'de-vs-des-2022-09-18', date: '2022-09-18', season: 2022, format: '50 Overs', title: '2022 Championship Final', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 54 runs', details: 'Dread Eleven won by 54 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-20', slug: 'de-vs-des-2022-09-14', date: '2022-09-14', season: 2022, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 1 wickets', details: 'Destroyers won by 1 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-19', slug: 'de-vs-des-2022-09-10', date: '2022-09-10', season: 2022, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 37 runs', details: 'Dread Eleven won by 37 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-18', slug: 'de-vs-des-2022-09-07', date: '2022-09-07', season: 2022, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 0 runs', details: 'Dread Eleven won by 0 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-17', slug: 'de-vs-des-2022-09-04', date: '2022-09-04', season: 2022, format: '50 Overs', title: '50 Overs Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 2 wickets', details: 'Destroyers won by 2 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-16', slug: 'de-vs-des-2022-08-12', date: '2022-08-12', season: 2022, format: 'T20', title: 'T20 Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 0 wickets', details: 'Destroyers won by 0 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-15', slug: 'de-vs-des-2022-08-10', date: '2022-08-10', season: 2022, format: 'T20', title: '2022 Series Opener (T20)', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 3 wickets', details: 'Destroyers won by 3 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-11', slug: 'de-vs-des-2021-08-28', date: '2021-08-28', season: 2021, format: 'T20', title: '2021 Championship Final', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 14 runs', details: 'Dread Eleven won by 14 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-10', slug: 'de-vs-des-2021-08-20', date: '2021-08-20', season: 2021, format: 'T20', title: 'T20 Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 2 wickets', details: 'Destroyers won by 2 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-9', slug: 'de-vs-des-2021-08-15', date: '2021-08-15', season: 2021, format: 'T20', title: 'T20 Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 5 wickets', details: 'Destroyers won by 5 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-8', slug: 'de-vs-des-2021-08-11', date: '2021-08-11', season: 2021, format: 'T20', title: 'T20 Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 3 wickets', details: 'Destroyers won by 3 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-7', slug: 'de-vs-des-2021-08-07', date: '2021-08-07', season: 2021, format: 'T20', title: 'T20 Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Dread Eleven won by 20 runs', details: 'Dread Eleven won by 20 runs at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-6', slug: 'de-vs-des-2021-08-04', date: '2021-08-04', season: 2021, format: 'T20', title: 'T20 Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 2 wickets', details: 'Destroyers won by 2 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
  { id: 'm-shared-5', slug: 'de-vs-des-2021-08-01', date: '2021-08-01', season: 2021, format: 'T20', title: '2021 Series Opener (T20)', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 3 wickets', details: 'Destroyers won by 3 wickets at APS Ground Rewa. Official RDCA scorecard archived.' },
];

function renderMatchCard(m) {
  const rdcaUrl = `https://rewa-cricket-division.vercel.app/matches/${esc(m.slug)}/`;
  return `<article class="card match-card">
  <div class="match-top">
    <span class="competition">Atal Bihari Vajpayee Memorial Tournament &bull; ${m.season} (${esc(m.format)})</span>
    <span class="badge badge-completed">completed</span>
  </div>
  <div class="match-teams">
    <span class="team-name"><a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener">${esc(m.team1)}</a></span>
    <span class="vs">VS</span>
    <span class="team-name"><a href="https://dread-eleven-rewacricket.pages.dev" target="_blank" rel="noopener">${esc(m.team2)}</a></span>
  </div>
  <div class="match-footer">
    <span class="result">${esc(m.result)}</span> &bull; ${esc(m.venue)} &bull; <span class="card-meta">${esc(m.date)}</span>
  </div>
  ${m.details ? `<p class="card-meta" style="margin-top:0.4rem;font-size:0.85rem;">${esc(m.details)}</p>` : ''}
  <p style="margin-top:.6rem"><a class="btn btn-outline" href="${rdcaUrl}" target="_blank" rel="noopener">Scorecard &amp; details &rarr;</a></p>
</article>`;
}

// 1. Build Homepage (index.html)
function buildHomePage() {
  const num = tournament.seasonInNumbers;
  const topBat = tournament.topPerformers.batting;
  const topBowl = tournament.topPerformers.bowling;
  const past = tournament.pastWinners;

  const content = `
<div class="page-head" style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;">
  <img src="/public/images/trophy.svg" alt="Atal Bihari Vajpayee Memorial Trophy Seal" width="84" height="84" style="flex-shrink:0;" />
  <div>
    <p class="eyebrow">Mixed (T20 &amp; 50 Overs) &bull; 2021&ndash;2026</p>
    <h1>Atal Bihari Vajpayee Memorial Tournament</h1>
    <p>Status: completed &bull; Current Champions: Destroyers Cricket Club (2026)</p>
  </div>
</div>

<p class="badge badge-official">RDCA Sanctioned &bull; MPCA Affiliated &bull; BCCI Code Compliant</p>

<p class="prose" style="max-width:64ch;margin-bottom:1rem">
  The prestigious annual Rewa divisional cricket derby championship honoring former Prime Minister Shri Atal Bihari Vajpayee. Contested exclusively through an iconic 34-match rivalry between Destroyers Cricket Club (DES) and Dread Eleven (DE). Overall series titles stand level at 3&ndash;3 (Dread Eleven: 2021, 2022, 2023; Destroyers: 2024, 2025, 2026). Officially sanctioned by the Rewa Division Cricket Association (RDCA) and affiliated with Madhya Pradesh Cricket Association (MPCA).
</p>

<p class="btn btn-primary" style="margin-bottom:1.5rem">Current Champions: Destroyers Cricket Club (def. Dread Eleven 3&ndash;2 in 2026 Final)</p>

<!-- Roll of Honour -->
<section class="section">
  <div class="section-title">
    <h2>Tournament Roll of Honour (2021&ndash;2026)</h2>
  </div>
  <div class="card table-wrap" style="margin-bottom:2rem">
    <table>
      <thead>
        <tr>
          <th>Edition</th>
          <th>Champion Franchise</th>
          <th>Winning Captain</th>
          <th class="num">Series Margin</th>
          <th>Official RDCA Status</th>
        </tr>
      </thead>
      <tbody>
        ${past.map(e => `
          <tr>
            <td><strong>${e.year} Edition</strong></td>
            <td><strong>${e.winner}</strong></td>
            <td>${e.captain} <span class="badge" style="font-size:0.65rem;padding:0.1rem 0.35rem;font-weight:700;">(c)</span></td>
            <td class="num font-bold">${e.score}</td>
            <td><span class="badge badge-completed">Verified</span></td>
          </tr>
        `).join('\n        ')}
      </tbody>
    </table>
  </div>
</section>

<!-- Official Franchise Digital Portals -->
<div class="card" style="margin-bottom:2rem;padding:1.5rem">
  <div class="section-title">
    <div>
      <p class="eyebrow">The Bilateral Derby</p>
      <h3 style="margin-bottom:0.25rem">Official Franchise Digital Portals</h3>
    </div>
  </div>
  <p class="card-meta" style="margin-bottom:1.25rem">The two marquee franchise clubs competing for the Atal Bihari Vajpayee Memorial Trophy maintain independent official digital arenas:</p>
  <div class="grid grid-2">
    <div style="border:1px solid var(--line);border-radius:var(--radius);padding:1.25rem;background:#fafbfa">
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem">
        <img src="/public/images/des.svg" alt="Destroyers CC Crest" width="40" height="48" style="flex-shrink:0" />
        <div>
          <h4 style="margin:0;font-size:1.15rem;color:var(--brand-dark)">Destroyers Cricket Club (DES)</h4>
          <span class="card-meta">Captain: Pranav Dwivedi &bull; APSU Stadium</span>
        </div>
      </div>
      <p style="font-size:0.9rem;color:#4b5563;margin-bottom:1rem;line-height:1.5">Reigning three-time champions (2024, 2025, 2026). 19 match wins across 34 derby clashes.</p>
      <a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.85rem">Destroyers CC Portal &rarr;</a>
    </div>

    <div style="border:1px solid var(--line);border-radius:var(--radius);padding:1.25rem;background:#fafbfa">
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem">
        <img src="/public/images/de.svg" alt="Dread Eleven Crest" width="40" height="48" style="flex-shrink:0" />
        <div>
          <h4 style="margin:0;font-size:1.15rem;color:var(--brand-dark)">Dread Eleven Cricket Club (DE)</h4>
          <span class="card-meta">Captain: Akhil Mishra &bull; Martand Ground No. 3</span>
        </div>
      </div>
      <p style="font-size:0.9rem;color:#4b5563;margin-bottom:1rem;line-height:1.5">Inaugural champions with three consecutive titles (2021, 2022, 2023). 15 match wins.</p>
      <a href="https://dread-eleven-rewacricket.pages.dev" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.85rem">Dread Eleven Stadium &rarr;</a>
    </div>
  </div>
</div>

<!-- The Archive in Numbers -->
<section class="section">
  <div class="split" style="align-items:center;margin-bottom:2rem">
    <div class="prose">
      <p class="eyebrow">Telemetry</p>
      <h2>The Tournament in Numbers (2021&ndash;2026)</h2>
      <p>Aggregated official match telemetry across all 6 tournament seasons and 34 official matches sanctioned by the Rewa Division Cricket Association.</p>
      <ul>
        <li><strong>Bilateral Competitions:</strong> 34 official matches contested between Destroyers and Dread Eleven.</li>
        <li><strong>Championship Titles:</strong> Level 3&ndash;3 (Destroyers: 2024, 2025, 2026; Dread Eleven: 2021, 2022, 2023).</li>
        <li><strong>Highest Team Total:</strong> 284/5 by Destroyers CC (2025 Season at APS Ground).</li>
        <li><strong>Best Individual Bowling:</strong> 8/39 by Pranav Dwivedi (Destroyers CC).</li>
      </ul>
    </div>
    <aside class="card" style="min-width:300px">
      <p class="eyebrow">Telemetry at a glance</p>
      <div class="stat-grid">
        <div class="card stat"><div class="stat-value">${num.matchesPlayed}</div><div class="stat-label">Matches</div></div>
        <div class="card stat"><div class="stat-value">${num.runsScored.toLocaleString()}</div><div class="stat-label">Total Runs</div></div>
        <div class="card stat"><div class="stat-value">${num.wicketsFallen}</div><div class="stat-label">Wickets</div></div>
        <div class="card stat"><div class="stat-value">3&ndash;3</div><div class="stat-label">Series Ties</div></div>
      </div>
    </aside>
  </div>
</section>

<!-- All-Time Top Performers Table -->
<section class="section">
  <div class="section-title">
    <div>
      <p class="eyebrow">Records</p>
      <h2>All-Time Top Performers</h2>
    </div>
  </div>
  <div class="grid grid-2">
    <div>
      <h3 style="margin-bottom:0.75rem">Leading Run Scorers</h3>
      <div class="card table-wrap">
        <table>
          <thead>
            <tr><th>Player</th><th>Team</th><th class="num">Runs</th><th class="num">Avg</th><th class="num">SR</th></tr>
          </thead>
          <tbody>
            ${topBat.map(b => `
              <tr>
                <td><strong>${b.name}</strong></td>
                <td>${b.team}</td>
                <td class="num font-bold">${b.runs}</td>
                <td class="num">${b.average}</td>
                <td class="num">${b.strikeRate}</td>
              </tr>
            `).join('\n            ')}
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h3 style="margin-bottom:0.75rem">Leading Wicket Takers</h3>
      <div class="card table-wrap">
        <table>
          <thead>
            <tr><th>Player</th><th>Team</th><th class="num">Wkts</th><th class="num">Avg</th><th class="num">Econ</th></tr>
          </thead>
          <tbody>
            ${topBowl.map(b => `
              <tr>
                <td><strong>${b.name}</strong></td>
                <td>${b.team}</td>
                <td class="num font-bold">${b.wickets}</td>
                <td class="num">${b.average}</td>
                <td class="num">${b.economy}</td>
              </tr>
            `).join('\n            ')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<!-- Recent Matches -->
<section class="section">
  <div class="section-title">
    <div>
      <p class="eyebrow">Matches</p>
      <h2>Recent Championship Series Fixtures</h2>
    </div>
    <a class="link" href="/matches/">View All 34 Matches &rarr;</a>
  </div>
  <div class="grid grid-2">
    ${allMatchesData.slice(0, 4).map(renderMatchCard).join('\n    ')}
  </div>
</section>

<!-- Regulations Table & Key Complex Rule Amendments -->
<section class="section">
  <div class="section-title">
    <div>
      <p class="eyebrow">Governance &amp; Statutory Codes</p>
      <h2>Official Tournament Regulations (14 Statutory Codes)</h2>
    </div>
    <a class="link" href="/rules/">Comprehensive Rules Repository &rarr;</a>
  </div>

  <!-- Key Complex Rule Changes Executive Card -->
  <div class="card" style="margin-bottom:1.5rem; border-left:4px solid var(--accent, #c8a24a); padding:1.5rem;">
    <h3 style="margin-bottom:0.5rem">Recent Complex Rule Amendments &amp; Playing Directives</h3>
    <p class="card-meta" style="margin-bottom:1rem">Mandatory operational guidelines governing modern match pacing, biomechanical integrity, and security cordon across all 34 tournament clashes:</p>
    <div class="grid grid-2" style="gap:1rem;">
      <div style="background:var(--brand-light, #f0f7f2); padding:1rem; border-radius:6px; border:1px solid var(--line, #e5e7eb);">
        <strong style="display:block; margin-bottom:0.25rem; color:var(--brand-dark, #08301f);">In-Match Slow Over Rate Field Penalties</strong>
        <p style="font-size:0.875rem; color:var(--ink, #171717); margin:0; line-height:1.5;">If the bowling team fails to bowl the first ball of the final over by the scheduled innings cutoff time, exactly one fewer fielder (maximum 4 instead of 5) is allowed outside the 30-yard fielding circle for all subsequent overs.</p>
      </div>
      <div style="background:var(--brand-light, #f0f7f2); padding:1rem; border-radius:6px; border:1px solid var(--line, #e5e7eb);">
        <strong style="display:block; margin-bottom:0.25rem; color:var(--brand-dark, #08301f);">Mandatory 60-Second Stop-Clock Rule</strong>
        <p style="font-size:0.875rem; color:var(--ink, #171717); margin:0; line-height:1.5;">Between consecutive overs, the fielding side must be positioned to deliver within 60 seconds. Two warnings are permitted per innings; the 3rd breach incurs an automatic 5-run penalty awarded to the batting team.</p>
      </div>
      <div style="background:var(--brand-light, #f0f7f2); padding:1rem; border-radius:6px; border:1px solid var(--line, #e5e7eb);">
        <strong style="display:block; margin-bottom:0.25rem; color:var(--brand-dark, #08301f);">15° Suspected Illegal Bowling Action Protocol</strong>
        <p style="font-size:0.875rem; color:var(--ink, #171717); margin:0; line-height:1.5;">Umpires report suspected throwing within 24 hours. Bowlers undergo mandatory 3D high-speed biomechanical testing. Any elbow extension exceeding 15 degrees causes immediate bowling suspension until clearance.</p>
      </div>
      <div style="background:var(--brand-light, #f0f7f2); padding:1rem; border-radius:6px; border:1px solid var(--line, #e5e7eb);">
        <strong style="display:block; margin-bottom:0.25rem; color:var(--brand-dark, #08301f);">PMOA Electronic Blackout &amp; Smartwatch Ban</strong>
        <p style="font-size:0.875rem; color:var(--brand-dark, #08301f);">Strict communication blackout in the Players and Match Officials Area. All phones and smartwatches must be surrendered to the ACU Manager 60 minutes before toss. Zero electronics permitted in dressing rooms.</p>
      </div>
    </div>
  </div>

  <div class="card table-wrap">
    <table>
      <thead>
        <tr>
          <th>Code No.</th>
          <th>Regulation Title</th>
          <th>Regulatory Area</th>
          <th>Official Text</th>
        </tr>
      </thead>
      <tbody>
        ${rules.map((r, i) => `
          <tr>
            <td><strong>REG-${String(i+1).padStart(2, '0')}</strong></td>
            <td><a href="/rules/${r.id}/" style="font-weight:600">${esc(r.title)}</a></td>
            <td><span class="badge badge-completed">${esc(r.category)}</span></td>
            <td><a href="/rules/${r.id}/" class="link">View Statutory Clauses &rarr;</a></td>
          </tr>
        `).join('\n        ')}
      </tbody>
    </table>
  </div>
</section>

<!-- Governing Council -->
<section class="section">
  <div class="section-title">
    <div>
      <p class="eyebrow">Administration</p>
      <h2>Tournament Governing Council</h2>
    </div>
    <a class="link" href="/governing-council/">Full Committee Details &rarr;</a>
  </div>
  <div class="card table-wrap">
    <table>
      <thead>
        <tr>
          <th>Designation / Role</th>
          <th>Appointed Official</th>
          <th>Jurisdiction &amp; Affiliation</th>
        </tr>
      </thead>
      <tbody>
        ${tournament.governingCouncil.map(m => `
          <tr>
            <td><strong>${esc(m.role)}</strong></td>
            <td>${esc(m.name)}</td>
            <td>${esc(m.affiliation)}</td>
          </tr>
        `).join('\n        ')}
      </tbody>
    </table>
  </div>
</section>

<!-- Official Bulletins & News -->
<section class="section">
  <div class="section-title">
    <div>
      <p class="eyebrow">Announcements</p>
      <h2>Official Tournament Bulletins</h2>
    </div>
    <a class="link" href="/news/">All News &rarr;</a>
  </div>
  <div class="grid grid-3">
    ${news.slice(0, 3).map(n => `
      <div class="card">
        <p class="eyebrow">${esc(n.category)} &bull; ${esc(n.date)}</p>
        <h3 style="font-size:1.15rem;margin-bottom:0.5rem">${esc(n.title)}</h3>
        <p class="card-meta" style="margin-bottom:1rem">${esc(n.summary)}</p>
        <a href="/news/" class="link">Read Bulletin &rarr;</a>
      </div>
    `).join('\n    ')}
  </div>
</section>
`;

  const specificData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": tournament.name,
    "alternateName": tournament.shortName,
    "description": "Premier annual cricket championship of Vindhya Pradesh, honoring Shri Atal Bihari Vajpayee, sanctioned by RDCA and MPCA.",
    "url": SITE_URL,
    "organizer": {
      "@type": "SportsOrganization",
      "name": "Rewa Division Cricket Association (RDCA)",
      "url": "https://rewa-cricket-division.vercel.app"
    },
    "location": {
      "@type": "Place",
      "name": "Divisional Cricket Stadium, Neem Chauraha",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Divisional Cricket Stadium, Neem Chauraha, Boda Bagh Road",
        "addressLocality": "Rewa",
        "addressRegion": "Madhya Pradesh",
        "postalCode": "486001",
        "addressCountry": "IN"
      }
    },
    "performer": [
      {
        "@type": ["Person", "Athlete"],
        "name": "Pranav Dwivedi",
        "jobTitle": "Captain & Premier All-Rounder, Destroyers CC",
        "url": "https://destroyers-rewacricket.pages.dev/portfolio/",
        "sameAs": [
          "https://destroyers-rewacricket.pages.dev/portfolio/",
          "https://destroyers-rewacricket.pages.dev/players/pranav-dwivedi",
          "https://rewa-cricket-division.vercel.app/players/pranav-dwivedi/"
        ]
      },
      {
        "@type": ["Person", "Athlete"],
        "name": "Akhil Mishra",
        "jobTitle": "Captain & Top-Order All-Rounder, Dread Eleven",
        "url": "https://dread-eleven-rewacricket.pages.dev/portfolio/",
        "sameAs": [
          "https://dread-eleven-rewacricket.pages.dev/portfolio/",
          "https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra",
          "https://rewa-cricket-division.vercel.app/players/akhil-mishra/"
        ]
      }
    ]
  };

  const html = renderHtmlPage({
    title: "Atal Bihari Vajpayee Memorial Tournament | Rewa Division Cricket Association (RDCA)",
    description: "Official portal of the Atal Bihari Vajpayee Memorial Tournament: 34 matches, Destroyers CC vs Dread Eleven, 14 regulations, council, and records.",
    canonicalUrl: `${SITE_URL}/`,
    activeNav: 'home',
    breadcrumbs: [],
    bodyContent: content,
    specificData
  });

  fs.writeFileSync(path.join(rootDir, 'index.html'), html, 'utf-8');
  console.log('Built: index.html (Pure RDCA UI)');
}

// 2. Build Teams Page (teams/index.html)
function buildTeamsPage() {
  ensureDir(path.join(rootDir, 'teams'));

  const content = `
<div class="page-head">
  <p class="eyebrow">Franchise Directory</p>
  <h1>The Founding Derby Teams (2)</h1>
  <p>The two permanent franchise clubs contesting the Atal Bihari Vajpayee Memorial Trophy.</p>
</div>

<p class="badge badge-official">Permanent Invitational Franchises</p>

<p class="prose" style="max-width:64ch;margin-bottom:1.5rem">
  The Atal Bihari Vajpayee Memorial Tournament is contested exclusively as a marquee bilateral championship between <strong>Destroyers Cricket Club (DES)</strong> and <strong>Dread Eleven (DE)</strong>. Across 34 official matches from 2021 to 2026, the overall series titles stand level at 3&ndash;3.
</p>

<!-- Derby Head to Head Summary -->
<div class="section-title">
  <h2>All-Time Derby Head-to-Head Record</h2>
</div>
<div class="card table-wrap" style="margin-bottom:2rem">
  <table>
    <thead>
      <tr>
        <th>Franchise</th>
        <th>Captain</th>
        <th class="num">Titles Won</th>
        <th class="num">Match Wins</th>
        <th class="num">Win %</th>
        <th>Home Ground</th>
        <th>Portal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Destroyers Cricket Club (DES)</strong></td>
        <td><a href="https://destroyers-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="font-weight:700; color:inherit; text-decoration:underline;">Pranav Dwivedi (c) &rarr;</a></td>
        <td class="num font-bold">3 (2024, 2025, 2026)</td>
        <td class="num font-bold">19</td>
        <td class="num">55.9%</td>
        <td>APSU University Stadium</td>
        <td><a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener" class="link">Destroyers Portal &rarr;</a></td>
      </tr>
      <tr>
        <td><strong>Dread Eleven (DE)</strong></td>
        <td><a href="https://dread-eleven-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="font-weight:700; color:inherit; text-decoration:underline;">Akhil Mishra (c) &rarr;</a></td>
        <td class="num font-bold">3 (2021, 2022, 2023)</td>
        <td class="num font-bold">15</td>
        <td class="num">44.1%</td>
        <td>Martand School Ground No. 3</td>
        <td><a href="https://dread-eleven-rewacricket.pages.dev" target="_blank" rel="noopener" class="link">Dread Eleven Stadium &rarr;</a></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="section-title">
  <h2>Franchise Club Dossiers</h2>
</div>
<div class="grid grid-2">
  ${teams.map(t => `
    <div class="card" style="padding:1.5rem">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
        <img src="/public/images/${t.id}.svg" alt="${esc(t.name)} Crest" width="48" height="56" style="flex-shrink:0" />
        <div>
          <h3 style="margin:0;font-size:1.35rem;color:var(--brand-dark)">${esc(t.name)}</h3>
          <span class="card-meta">${esc(t.city)} &bull; Established ${t.established}</span>
        </div>
      </div>
      <p style="margin-bottom:0.75rem"><span class="badge badge-completed">${esc(t.titles)}</span></p>
      <p class="card-meta" style="margin-bottom:1rem;line-height:1.6">${esc(t.description)}</p>
      <div style="border-top:1px solid var(--line);padding-top:0.75rem;margin-bottom:1rem;font-size:0.875rem">
        <p style="margin-bottom:0.25rem"><strong>Franchise Captain:</strong> ${esc(t.captain)}</p>
        <p style="margin-bottom:0"><strong>Primary Home Ground:</strong> ${esc(t.homeGround)}</p>
      </div>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
        <a href="${t.website}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.85rem">Visit Official Club Portal &rarr;</a>
        <a href="${t.website}/players" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:0.85rem">Squad Roster &rarr;</a>
        <a href="${t.website}/portfolio/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.85rem; font-weight:700;">Captain Portfolio &amp; Entity Home &rarr;</a>
      </div>
    </div>
  `).join('\n  ')}
</div>
`;

  const specificData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Participating Franchises — ABV Memorial Tournament",
    "itemListElement": teams.map((t, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "SportsTeam",
        "name": t.name,
        "url": t.website,
        "logo": `${SITE_URL}/public/images/${t.id}.svg`,
        "athlete": {
          "@type": ["Person", "Athlete"],
          "name": t.captain,
          "jobTitle": "Franchise Captain",
          "url": t.id === 'des' ? 'https://destroyers-rewacricket.pages.dev/portfolio/' : 'https://dread-eleven-rewacricket.pages.dev/portfolio/',
          "sameAs": t.id === 'des' ? [
            'https://destroyers-rewacricket.pages.dev/portfolio/',
            'https://destroyers-rewacricket.pages.dev/players/pranav-dwivedi',
            'https://rewa-cricket-division.vercel.app/players/pranav-dwivedi/',
            'https://abv-rewacricket.pages.dev/'
          ] : [
            'https://dread-eleven-rewacricket.pages.dev/portfolio/',
            'https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra',
            'https://rewa-cricket-division.vercel.app/players/akhil-mishra/',
            'https://abv-rewacricket.pages.dev/'
          ]
        }
      }
    }))
  };

  const html = renderHtmlPage({
    title: "The Founding Derby Teams (2) | Atal Bihari Vajpayee Memorial Tournament",
    description: "Official club directory for Destroyers Cricket Club (DES) and Dread Eleven (DE) contesting the Atal Bihari Vajpayee Memorial Trophy under RDCA.",
    canonicalUrl: `${SITE_URL}/teams/`,
    activeNav: 'teams',
    breadcrumbs: [{ name: 'Teams', path: '/teams/' }],
    bodyContent: content,
    specificData
  });

  fs.writeFileSync(path.join(rootDir, 'teams/index.html'), html, 'utf-8');
  console.log('Built: teams/index.html (Pure RDCA UI)');
}

// 3. Build Matches Page (matches/index.html)
function buildMatchesPage() {
  ensureDir(path.join(rootDir, 'matches'));

  const content = `
<div class="page-head">
  <p class="eyebrow">Match Archive &bull; 2021&ndash;2026</p>
  <h1>Tournament Match Register (34 Matches)</h1>
  <p>Official match records, scorecards, and results across all 6 tournament editions.</p>
</div>

<p class="badge badge-official">34 Matches Sanctioned by RDCA</p>

<p class="prose" style="max-width:64ch;margin-bottom:1.5rem">
  Every single match in the Atal Bihari Vajpayee Memorial Tournament is contested under strict RDCA Match Playing Conditions across both APS Ground Rewa and Martand School Ground No. 3.
</p>

<!-- Matches Breakdown by Season -->
<div class="section-title">
  <h2>Season Series Outcomes (2021&ndash;2026)</h2>
</div>
<div class="card table-wrap" style="margin-bottom:2rem">
  <table>
    <thead>
      <tr>
        <th>Season</th>
        <th>Matches</th>
        <th>Format</th>
        <th>Series Outcome</th>
        <th>Winning Captain</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>2026 Season</strong></td><td>5 Matches</td><td>T20 &amp; 50 Overs</td><td>Destroyers won 3&ndash;2</td><td>Pranav Dwivedi (c)</td></tr>
      <tr><td><strong>2025 Season</strong></td><td>5 Matches</td><td>T20 &amp; 50 Overs</td><td>Destroyers won 5&ndash;0</td><td>Pranav Dwivedi (c)</td></tr>
      <tr><td><strong>2024 Season</strong></td><td>5 Matches</td><td>T20 &amp; 50 Overs</td><td>Destroyers won 4&ndash;1</td><td>Pranav Dwivedi (c)</td></tr>
      <tr><td><strong>2023 Season</strong></td><td>5 Matches</td><td>T20 &amp; 50 Overs</td><td>Dread Eleven won 3&ndash;2</td><td>Akhil Mishra (c)</td></tr>
      <tr><td><strong>2022 Season</strong></td><td>7 Matches</td><td>T20 &amp; 50 Overs</td><td>Dread Eleven won 4&ndash;3</td><td>Akhil Mishra (c)</td></tr>
      <tr><td><strong>2021 Season</strong></td><td>7 Matches</td><td>T20 &amp; 50 Overs</td><td>Dread Eleven won 5&ndash;2</td><td>Akhil Mishra (c)</td></tr>
    </tbody>
  </table>
</div>

<div class="section-title">
  <h2>Complete Match Fixtures Archive (34 Matches)</h2>
  <a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="link">RDCA Central Fixtures Hub &rarr;</a>
</div>

<div class="grid grid-2">
  ${allMatchesData.map(renderMatchCard).join('\n  ')}
</div>
`;

  const specificData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Match Scorecards — Atal Bihari Vajpayee Memorial Tournament",
    "numberOfItems": allMatchesData.length,
    "itemListElement": allMatchesData.map((m, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "SportsEvent",
        "name": `${m.title} (${m.season})`,
        "startDate": m.date,
        "location": {
          "@type": "Place",
          "name": m.venue
        },
        "url": `https://rewa-cricket-division.vercel.app/matches/${m.slug}/`,
        "competitor": [
          { "@type": "SportsTeam", "name": m.team1 },
          { "@type": "SportsTeam", "name": m.team2 }
        ]
      }
    }))
  };

  const html = renderHtmlPage({
    title: "Match Archive (34 Matches) | Atal Bihari Vajpayee Memorial Tournament",
    description: "Full official 34-match archive of the Atal Bihari Vajpayee Memorial Tournament between Destroyers CC and Dread Eleven across 2021–2026.",
    canonicalUrl: `${SITE_URL}/matches/`,
    activeNav: 'matches',
    breadcrumbs: [{ name: 'Matches', path: '/matches/' }],
    bodyContent: content,
    specificData
  });

  fs.writeFileSync(path.join(rootDir, 'matches/index.html'), html, 'utf-8');
  console.log('Built: matches/index.html (Pure RDCA UI)');
}

// 4. Build Regulations Index (rules/index.html) & Subpages
function buildRulesPages() {
  ensureDir(path.join(rootDir, 'rules'));

  const indexContent = `
<div class="page-head">
  <p class="eyebrow">Statutory Framework</p>
  <h1>14 Official Tournament Regulations</h1>
  <p>Binding governance policies, codes of conduct, technical regulations, and match conditions.</p>
</div>

<p class="badge badge-official">Approved by RDCA Governing Body &bull; Affiliated with MPCA</p>

<p class="prose" style="max-width:64ch;margin-bottom:1.5rem">
  The Atal Bihari Vajpayee Memorial Tournament operates under a codified statutory framework aligned with BCCI and MPCA constitutional mandates. All 14 regulatory codes are strictly enforced across all participating franchise clubs, players, umpires, and match officials.
</p>

<!-- Complex Rule Amendments & Operational Guide -->
<section class="section" style="margin-bottom:2.5rem;">
  <div class="section-title">
    <div>
      <p class="eyebrow">Executive Summary</p>
      <h2>Complex Regulatory Amendments &amp; Operational Directives</h2>
    </div>
  </div>
  <div class="card" style="border-left:4px solid var(--accent, #c8a24a); padding:1.5rem; margin-bottom:2rem;">
    <h3 style="margin-bottom:0.5rem">Key Technical Amendments Explained</h3>
    <p class="card-meta" style="margin-bottom:1.25rem">To assist players, coaches, and match referees, the Governing Council highlights the operational mechanics of the four most complex rule updates:</p>
    <div class="grid grid-2" style="gap:1.25rem;">
      <div style="background:#f9fafb; padding:1.25rem; border-radius:6px; border:1px solid var(--line, #e5e7eb);">
        <h4 style="margin-bottom:0.35rem; color:var(--brand-dark, #08301f);">In-Match Slow Over Rate Penalties</h4>
        <p style="font-size:0.875rem; line-height:1.6; color:var(--ink, #171717); margin-bottom:0.5rem;">Traditional monetary fines have been replaced by real-time tactical consequences. If the fielding team fails to be in position to bowl the first delivery of the final over by the scheduled innings cutoff time, exactly one fewer fielder is permitted outside the 30-yard circle (a maximum of 4 instead of 5) for all remaining overs.</p>
        <a href="/rules/match-playing-conditions/" class="link" style="font-size:0.825rem; font-weight:700;">Read Playing Conditions &rarr;</a>
      </div>
      <div style="background:#f9fafb; padding:1.25rem; border-radius:6px; border:1px solid var(--line, #e5e7eb);">
        <h4 style="margin-bottom:0.35rem; color:var(--brand-dark, #08301f);">60-Second Stop-Clock Between Overs</h4>
        <p style="font-size:0.875rem; line-height:1.6; color:var(--ink, #171717); margin-bottom:0.5rem;">To eliminate dead time, a strict 60-second digital countdown runs between the completion of an over and the bowler starting their run-up for the next over. Umpires issue warnings for the first two breaches; a third breach in an innings results in a mandatory 5-run award to the batting side.</p>
        <a href="/rules/match-playing-conditions/" class="link" style="font-size:0.825rem; font-weight:700;">Read Timer Specifications &rarr;</a>
      </div>
      <div style="background:#f9fafb; padding:1.25rem; border-radius:6px; border:1px solid var(--line, #e5e7eb);">
        <h4 style="margin-bottom:0.35rem; color:var(--brand-dark, #08301f);">15° Elbow Flexion Biomechanical Scrutiny</h4>
        <p style="font-size:0.875rem; line-height:1.6; color:var(--ink, #171717); margin-bottom:0.5rem;">The tournament strictly applies the 15-degree elbow extension limit. If cited by match officials, the player must undergo 3D biomechanical testing with motion-capture sensors within 14 days. If the angle exceeds 15°, the bowler is suspended from bowling in all division cricket until remediated.</p>
        <a href="/rules/suspected-illegal-action/" class="link" style="font-size:0.825rem; font-weight:700;">Read Biomechanical Protocol &rarr;</a>
      </div>
      <div style="background:#f9fafb; padding:1.25rem; border-radius:6px; border:1px solid var(--line, #e5e7eb);">
        <h4 style="margin-bottom:0.35rem; color:var(--brand-dark, #08301f);">PMOA Electronic Device Blackout &amp; Integrity</h4>
        <p style="font-size:0.875rem; line-height:1.6; color:var(--ink, #171717); margin-bottom:0.5rem;">To protect against inside information leaks and spot-fixing, players and team officials must surrender all smartphones, smartwatches, and wireless transceivers 60 minutes before the toss. No internet-capable device may enter dressing rooms or dugout areas.</p>
        <a href="/rules/pmoa-minimum-standards/" class="link" style="font-size:0.825rem; font-weight:700;">Read PMOA Cordon Rules &rarr;</a>
      </div>
    </div>
  </div>
</section>

<div class="section-title">
  <h2>Statutory Codes Directory (14 Codes)</h2>
</div>
<div class="card table-wrap" style="margin-bottom:2rem">
  <table>
    <thead>
      <tr>
        <th>Code No.</th>
        <th>Regulation</th>
        <th>Area</th>
        <th>Statutory Scope</th>
        <th>Full Documentation</th>
      </tr>
    </thead>
    <tbody>
      ${rules.map((r, i) => `
        <tr>
          <td><strong>REG-${String(i+1).padStart(2, '0')}</strong></td>
          <td><a href="/rules/${r.id}/" style="font-weight:700">${esc(r.title)}</a></td>
          <td><span class="badge badge-completed">${esc(r.category)}</span></td>
          <td class="card-meta">${esc(r.summary)}</td>
          <td><a href="/rules/${r.id}/" class="link">Read Code &rarr;</a></td>
        </tr>
      `).join('\n      ')}
    </tbody>
  </table>
</div>
`;

  const indexSpecificData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Tournament Regulations — Atal Bihari Vajpayee Memorial Tournament",
    "numberOfItems": rules.length,
    "itemListElement": rules.map((r, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": r.title,
      "url": `${SITE_URL}/rules/${r.id}/`
    }))
  };

  const indexHtml = renderHtmlPage({
    title: "14 Official Tournament Regulations | Atal Bihari Vajpayee Memorial Tournament",
    description: "Official codified regulations, anti-corruption codes, playing conditions, and governance standards for the ABV Memorial Tournament.",
    canonicalUrl: `${SITE_URL}/rules/`,
    activeNav: 'rules',
    breadcrumbs: [{ name: 'Regulations', path: '/rules/' }],
    bodyContent: indexContent,
    specificData: indexSpecificData
  });

  fs.writeFileSync(path.join(rootDir, 'rules/index.html'), indexHtml, 'utf-8');
  console.log('Built: rules/index.html (Pure RDCA UI)');

  // Individual Rule Pages
  rules.forEach((r, idx) => {
    const ruleDir = path.join(rootDir, 'rules', r.id);
    ensureDir(ruleDir);

    const clauses = r.clauses || [];
    const ruleContent = `
<div class="page-head">
  <p class="eyebrow">REG-${String(idx+1).padStart(2, '0')} &bull; ${esc(r.category)}</p>
  <h1>${esc(r.title)}</h1>
  <p>Effective Seasons: 2021&ndash;2026 &bull; Authority: Rewa Division Cricket Association (RDCA)</p>
</div>

<p class="badge badge-official">Statutory Tournament Regulation</p>

<p class="prose" style="max-width:64ch;margin-bottom:1.5rem">
  ${esc(r.summary)}
</p>

<div class="card" style="padding:1.5rem;margin-bottom:2rem">
  <div class="section-title">
    <h2>Codified Articles &amp; Clauses</h2>
  </div>
  <div style="display:flex;flex-direction:column;gap:1.5rem">
    ${clauses.map(c => `
      <div style="border-bottom:1px solid var(--line);padding-bottom:1.25rem">
        <h3 style="font-size:1.1rem;color:var(--brand-dark);margin-bottom:0.35rem">${esc(c.number || '')}: ${esc(c.title)}</h3>
        <p class="card-meta" style="line-height:1.6;margin:0">${esc(c.content)}</p>
      </div>
    `).join('\n    ')}
  </div>
</div>

<div class="card" style="padding:1.25rem;background:#fafbfa;border-left:4px solid var(--brand)">
  <h3 style="font-size:1rem;margin-bottom:0.25rem">Enforcement &amp; Confidential Inquiries</h3>
  <p class="card-meta" style="margin-bottom:0.5rem">Violations of this regulation are subject to expedited review by the RDCA Disciplinary Committee. For confidential reporting, contact the Integrity Officer.</p>
  <p style="margin:0;font-size:0.9rem"><strong>Hotline:</strong> <a href="tel:+917662250011">+91 7662 250011</a> &bull; <strong>Email:</strong> <a href="mailto:rdca.rewa@gmail.com">rdca.rewa@gmail.com</a></p>
</div>
`;

    const ruleSpecificData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": r.title,
      "description": cleanDesc(r.summary),
      "url": `${SITE_URL}/rules/${r.id}/`,
      "publisher": {
        "@type": "SportsOrganization",
        "name": "Rewa Division Cricket Association (RDCA)",
        "url": "https://rewa-cricket-division.vercel.app"
      }
    };

    const ruleHtml = renderHtmlPage({
      title: `${r.title} | Tournament Regulations | ABV Memorial Trophy`,
      description: cleanDesc(`${r.title} official statutory code sanctioned by the Rewa Division Cricket Association (RDCA) for the Atal Bihari Vajpayee Memorial Tournament.`),
      canonicalUrl: `${SITE_URL}/rules/${r.id}/`,
      activeNav: 'rules',
      breadcrumbs: [
        { name: 'Regulations', path: '/rules/' },
        { name: r.title, path: `/rules/${r.id}/` }
      ],
      bodyContent: ruleContent,
      specificData: ruleSpecificData
    });

    fs.writeFileSync(path.join(ruleDir, 'index.html'), ruleHtml, 'utf-8');
    console.log(`Built: rules/${r.id}/index.html (Pure RDCA UI)`);
  });
}

// 5. Build Governing Council Page (governing-council/index.html)
function buildGoverningCouncilPage() {
  ensureDir(path.join(rootDir, 'governing-council'));

  const council = tournament.governingCouncil;
  const content = `
<div class="page-head">
  <p class="eyebrow">Administrative Oversight</p>
  <h1>Tournament Governing Council</h1>
  <p>Statutory officers, match referees, curators, and integrity stewards managing the championship.</p>
</div>

<p class="badge badge-official">Constituted under RDCA &amp; MPCA Framework</p>

<p class="prose" style="max-width:64ch;margin-bottom:1.5rem">
  The Governing Council of the Atal Bihari Vajpayee Memorial Tournament is responsible for administrative governance, regulatory compliance, fixture schedules, match officiating appointments, and the integrity of the bilateral championship.
</p>

<div class="section-title">
  <h2>Statutory Council Members &amp; Dignitaries</h2>
</div>
<div class="card table-wrap" style="margin-bottom:2rem">
  <table>
    <thead>
      <tr>
        <th>Designation</th>
        <th>Appointed Dignitary</th>
        <th>Institutional Jurisdiction</th>
        <th>Governance Mandate</th>
      </tr>
    </thead>
    <tbody>
      ${council.map(c => `
        <tr>
          <td><strong>${esc(c.role)}</strong></td>
          <td>${esc(c.name)}</td>
          <td><span class="badge badge-completed">${esc(c.affiliation)}</span></td>
          <td class="card-meta">Authorized steward under MPCA / RDCA regulations</td>
        </tr>
      `).join('\n      ')}
    </tbody>
  </table>
</div>

<div class="section-title">
  <h2>Governance Committees</h2>
</div>
<div class="grid grid-2">
  <div class="card" style="padding:1.5rem">
    <h3 style="margin-bottom:0.5rem">RDCA Disciplinary &amp; Ethics Panel</h3>
    <p class="card-meta" style="margin-bottom:1rem">Oversees player conduct, on-field code breaches, level 1–4 penalties, and umpire conduct reports under the Chairmanship of Shri S. K. Verma (Former BCCI Level-2 Umpire).</p>
    <a href="/rules/code-of-conduct-players/" class="link">View Player Code of Conduct &rarr;</a>
  </div>

  <div class="card" style="padding:1.5rem">
    <h3 style="margin-bottom:0.5rem">Anti-Corruption &amp; Security Unit (ACU)</h3>
    <p class="card-meta" style="margin-bottom:1rem">Operates 24/7 PMOA integrity vigilance and investigates corrupt approaches led by Shri D. C. Sharma (IPS Retd.).</p>
    <a href="/rules/anti-corruption/" class="link">View Anti-Corruption Protocol &rarr;</a>
  </div>
</div>
`;

  const specificData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Governing Council Members — ABV Memorial Tournament",
    "itemListElement": council.map((c, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Person",
        "name": c.name,
        "jobTitle": c.role,
        "worksFor": {
          "@type": "Organization",
          "name": c.affiliation
        }
      }
    }))
  };

  const html = renderHtmlPage({
    title: "Governing Council | Atal Bihari Vajpayee Memorial Tournament",
    description: "Official Governing Council, referees, curators, and integrity officers of the ABV Memorial Tournament under RDCA and MPCA.",
    canonicalUrl: `${SITE_URL}/governing-council/`,
    activeNav: 'governing-council',
    breadcrumbs: [{ name: 'Governing Council', path: '/governing-council/' }],
    bodyContent: content,
    specificData
  });

  fs.writeFileSync(path.join(rootDir, 'governing-council/index.html'), html, 'utf-8');
  console.log('Built: governing-council/index.html (Pure RDCA UI)');
}

// 6. Build News Page (news/index.html)
function buildNewsPage() {
  ensureDir(path.join(rootDir, 'news'));

  const content = `
<div class="page-head">
  <p class="eyebrow">Press &amp; Announcements</p>
  <h1>Tournament News &amp; Official Bulletins</h1>
  <p>Authentic media releases, championship outcomes, and committee statements.</p>
</div>

<p class="badge badge-official">Official RDCA Press Releases</p>

<p class="prose" style="max-width:64ch;margin-bottom:1.5rem">
  Official bulletins and media statements issued by the Atal Bihari Vajpayee Memorial Tournament Committee and the Rewa Division Cricket Association.
</p>

<div class="section-title">
  <h2>Official Bulletins Archive</h2>
</div>
<div class="grid grid-2">
  ${news.map(n => `
    <div class="card" style="padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
        <span class="badge badge-completed">${esc(n.category)}</span>
        <span class="card-meta">${esc(n.date)}</span>
      </div>
      <h3 style="font-size:1.25rem;color:var(--brand-dark);margin-bottom:0.5rem">${esc(n.title)}</h3>
      <p class="card-meta" style="line-height:1.6;margin-bottom:1rem">${esc(n.content)}</p>
      <div style="border-top:1px solid var(--line);padding-top:0.75rem">
        <span class="card-meta">Issued by: <strong>RDCA Media &amp; Press Desk</strong></span>
      </div>
    </div>
  `).join('\n  ')}
</div>
`;

  const specificData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Official Bulletins — ABV Memorial Tournament",
    "itemListElement": news.map((n, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": n.title,
        "datePublished": n.date,
        "description": n.summary,
        "publisher": {
          "@type": "Organization",
          "name": "Rewa Division Cricket Association (RDCA)"
        }
      }
    }))
  };

  const html = renderHtmlPage({
    title: "News & Bulletins | Atal Bihari Vajpayee Memorial Tournament",
    description: "Official announcements, match reports, and media bulletins for the Atal Bihari Vajpayee Memorial Tournament.",
    canonicalUrl: `${SITE_URL}/news/`,
    activeNav: 'news',
    breadcrumbs: [{ name: 'News', path: '/news/' }],
    bodyContent: content,
    specificData
  });

  fs.writeFileSync(path.join(rootDir, 'news/index.html'), html, 'utf-8');
  console.log('Built: news/index.html (Pure RDCA UI)');
}

// 7. Build Contact Page (contact/index.html)
function buildContactPage() {
  ensureDir(path.join(rootDir, 'contact'));

  const c = tournament.contact;
  const content = `
<div class="page-head">
  <p class="eyebrow">Secretariat &amp; Match Grounds</p>
  <h1>Official Contact &amp; Headquarters</h1>
  <p>Administrative contacts, match venue locations, and emergency integrity hotlines.</p>
</div>

<p class="badge badge-official">Official Secretariat Directory</p>

<p class="prose" style="max-width:64ch;margin-bottom:1.5rem">
  The Atal Bihari Vajpayee Memorial Tournament Secretariat operates jointly with the Rewa Division Cricket Association (RDCA) and maintains active liaison with the Madhya Pradesh Cricket Association (MPCA).
</p>

<div class="section-title">
  <h2>Administration &amp; Venues Directory</h2>
</div>
<div class="grid grid-2">
  <div class="card" style="padding:1.5rem">
    <h3 style="font-size:1.2rem;color:var(--brand-dark);margin-bottom:0.5rem">Tournament Headquarters &amp; Venues</h3>
    <p class="card-meta" style="margin-bottom:1rem">
      <strong>Divisional Cricket Stadium (Primary Venue)</strong><br>
      Neem Chauraha, Boda Bagh Road, Rewa, Madhya Pradesh 486001<br>
      Landmark: Near Neem Chauraha Hanuman Mandir
    </p>
    <p class="card-meta" style="margin-bottom:1rem">
      <strong>Awadhesh Pratap Singh University Stadium (Secondary Venue)</strong><br>
      APSU Stadium Complex, Sirmour Road, Rewa, Madhya Pradesh 486003
    </p>
    <p class="card-meta" style="margin-bottom:0">
      <strong>RDCA Administration Office:</strong><br>
      Divisional Stadium Pavillion, Rewa, MP 486001
    </p>
  </div>

  <div class="card" style="padding:1.5rem">
    <h3 style="font-size:1.2rem;color:var(--brand-dark);margin-bottom:0.5rem">Official Telephones &amp; Integrity Contacts</h3>
    <div style="margin-bottom:1rem">
      <p style="margin-bottom:0.25rem"><strong>RDCA Secretariat (Rewa):</strong></p>
      <p class="card-meta" style="margin-bottom:0"><a href="tel:+917662250000">+91 7662 250000</a> &bull; <a href="tel:+919425178900">+91 94251 78900</a></p>
    </div>
    <div style="margin-bottom:1rem">
      <p style="margin-bottom:0.25rem"><strong>MPCA Headquarters (Holkar Stadium, Indore):</strong></p>
      <p class="card-meta" style="margin-bottom:0"><a href="tel:+917312543602">+91 731 2543602</a> &bull; <a href="tel:+917312434575">+91 731 2434575</a></p>
    </div>
    <div style="border-top:1px solid var(--line);padding-top:0.75rem">
      <p style="margin-bottom:0.25rem;color:#b91c1c;font-weight:700;">24/7 Anti-Corruption Confidential Hotline:</p>
      <p style="margin-bottom:0;font-size:1.15rem;font-weight:900;"><a href="tel:+917662250011" style="color:#b91c1c">+91 7662 250011</a></p>
      <small class="card-meta">Monitored round the clock for confidential reporting of match-fixing or corrupt approaches.</small>
    </div>
  </div>
</div>
`;

  const specificData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Divisional Cricket Stadium, Neem Chauraha",
    "telephone": "+91-7662-250000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Divisional Cricket Stadium, Neem Chauraha, Boda Bagh Road",
      "addressLocality": "Rewa",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "486001",
      "addressCountry": "IN"
    }
  };

  const html = renderHtmlPage({
    title: "Official Contact & Venues | Atal Bihari Vajpayee Memorial Tournament",
    description: "Official contact directory, match venues, MPCA phone numbers, and ACU hotline for the Atal Bihari Vajpayee Memorial Tournament.",
    canonicalUrl: `${SITE_URL}/contact/`,
    activeNav: 'contact',
    breadcrumbs: [{ name: 'Contact', path: '/contact/' }],
    bodyContent: content,
    specificData
  });

  fs.writeFileSync(path.join(rootDir, 'contact/index.html'), html, 'utf-8');
  console.log('Built: contact/index.html (Pure RDCA UI)');
}

// 8. Build 404 Page (404.html)
function build404Page() {
  const content = `
<div class="page-head">
  <p class="eyebrow">Error 404 &bull; Record Not Found</p>
  <h1>Archival Document Not Found</h1>
  <p>The requested tournament page or record does not exist in the official archive.</p>
</div>

<p class="badge badge-completed">RDCA Archive Navigation</p>

<div class="card" style="padding:1.5rem;max-width:600px;margin-bottom:2rem">
  <p class="card-meta" style="line-height:1.6;margin-bottom:1rem">The page you requested may have moved or been re-catalogued. Please use the official links below to return to the active archive:</p>
  <ul>
    <li><a href="/">Tournament Home Page &rarr;</a></li>
    <li><a href="/teams/">The Derby Teams (2) &rarr;</a></li>
    <li><a href="/matches/">Match Archive (34 Matches) &rarr;</a></li>
    <li><a href="/rules/">14 Tournament Regulations &rarr;</a></li>
    <li><a href="https://rewa-cricket-division.vercel.app">Rewa Cricket Division (RDCA Central) &rarr;</a></li>
  </ul>
</div>
`;

  const html = renderHtmlPage({
    title: "404 Not Found | Atal Bihari Vajpayee Memorial Tournament",
    description: "Document not found in the official archive of the Atal Bihari Vajpayee Memorial Tournament.",
    canonicalUrl: `${SITE_URL}/404.html`,
    activeNav: '',
    breadcrumbs: [{ name: '404 Not Found', path: '/404.html' }],
    bodyContent: content
  });

  fs.writeFileSync(path.join(rootDir, '404.html'), html, 'utf-8');
  console.log('Built: 404.html (Pure RDCA UI)');
}

// 9. Build SEO files (sitemap, robots, llms)
function buildSeoFiles() {
  const allUrls = [
    '/',
    '/stats/',
    '/teams/',
    '/matches/',
    '/rules/',
    '/governing-council/',
    '/news/',
    '/contact/',
    ...rules.map(r => `/rules/${r.id}/`)
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${SITE_URL}${u}</loc>
    <lastmod>2026-09-11</lastmod>
    <changefreq>${u === '/' || u === '/stats/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${u === '/' ? '1.0' : u === '/stats/' || u === '/matches/' ? '0.9' : u.startsWith('/rules/') ? '0.7' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('Built: sitemap.xml');

  const robotsTxt = `User-agent: *
Allow: /

# AI Crawlers & LLM Agents
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(rootDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('Built: robots.txt');

  const llmsTxt = `# Atal Bihari Vajpayee Memorial Tournament
> The premier annual invitational cricket championship of Vindhya Pradesh, sanctioned by the Rewa Division Cricket Association (RDCA) and affiliated with the Madhya Pradesh Cricket Association (MPCA).

## Primary Documentation
- [Tournament Home](${SITE_URL}/): Championship summary, 3–3 titles deadlock, telemetry, and 2026 champions.
- [Tournament Leaderboards & Records](${SITE_URL}/stats/): Official consolidated player statistics combining Destroyers CC and Dread Eleven across 34 matches.
- [The Derby Teams (2)](${SITE_URL}/teams/): The two participating marquee clubs: Destroyers CC and Dread Eleven.
- [Match Archive (34 Matches)](${SITE_URL}/matches/): Complete 34-match fixture history with direct scorecard links to the official RDCA archive.
- [Official Regulations (14 Codes)](${SITE_URL}/rules/): Statutory tournament regulations including Anti-Corruption, Anti-Doping, and Playing Conditions.
- [Governing Council](${SITE_URL}/governing-council/): Executive leadership, technical committee, and match officials.
- [News & Media Releases](${SITE_URL}/news/): Official circulars, bulletins, and tournament announcements.
- [Contact & Venues](${SITE_URL}/contact/): Divisional Cricket Stadium Neem Chauraha Rewa, MPCA and RDCA official contacts.

## Official Network
- [Destroyers Cricket Club](${teams[0].website})
- [Dread Eleven](${teams[1].website})
- [Rewa Cricket Division (RDCA Central)](https://rewa-cricket-division.vercel.app)
`;
  fs.writeFileSync(path.join(rootDir, 'llms.txt'), llmsTxt, 'utf-8');
  console.log('Built: llms.txt');

  const topBat = tournament.topPerformers.batting;
  const topBowl = tournament.topPerformers.bowling;
  const num = tournament.seasonInNumbers;

  const llmsFullTxt = `# Atal Bihari Vajpayee Memorial Tournament — Complete Knowledge Base
> Official invitational cricket championship of Vindhya Pradesh, sanctioned by Rewa Division Cricket Association (RDCA) and affiliated with Madhya Pradesh Cricket Association (MPCA).

## Overview
- **Tournament**: Atal Bihari Vajpayee Memorial Tournament (ABV Memorial Trophy)
- **Sanctioning Body**: Rewa Division Cricket Association (RDCA) & Madhya Pradesh Cricket Association (MPCA)
- **Format**: Mixed Format (T20 and 50-Over Matches)
- **History**: 6 Annual Editions (2021 to 2026), 34 Bilateral Derby Clashes
- **Series Championship Standings**: Tied Level at 3–3
  - Dread Eleven (3 Titles): 2021 (5–2), 2022 (4–3), 2023 (3–2) under captain Akhil Mishra
  - Destroyers Cricket Club (3 Titles): 2024 (4–1), 2025 (5–0), 2026 (3–2) under captain Pranav Dwivedi
- **2026 Champions**: Destroyers Cricket Club (def. Dread Eleven by 12 runs in the 2026 Championship Final)
- **Official Venues**:
  - Divisional Cricket Stadium, Neem Chauraha, Boda Bagh Road, Rewa, MP 486001
  - Awadhesh Pratap Singh University (APSU) Stadium, Rewa
  - Martand School Ground No. 3, Rewa

## All-Time Combined Player Leaderboards (Both Teams)
### Leading Run Scorers
${topBat.map((b, i) => `${i + 1}. **${b.name}** (${b.team}): ${b.runs} runs | Batting Avg: ${b.average} | Strike Rate: ${b.strikeRate} | Fifties: ${b.fifties} | Hundreds: ${b.hundreds}`).join('\n')}

### Leading Wicket Takers
${topBowl.map((b, i) => `${i + 1}. **${b.name}** (${b.team}): ${b.wickets} wickets | Bowling Avg: ${b.average} | Economy Rate: ${b.economy} | BBI: ${b.bestBowling}`).join('\n')}

## Tournament Telemetry (34 Matches)
- Total Matches: 34
- Total Runs Scored: 10,842
- Total Wickets Fallen: 498
- Boundaries: 946 Fours, 312 Sixes
- Highest Team Total: 284/5 (Destroyers CC vs Dread Eleven, 2025 Season at APS Ground)
- Lowest Team Total: 98 all out (Dread Eleven vs Destroyers CC, 2023 Season)
- Individual Centuries: 2
- Individual Fifties: 42
- Best Bowling in an Innings: 8/39 by Pranav Dwivedi (Destroyers CC)

## Complete 34-Match Archive
${allMatchesData.map((m, i) => `### Match #${34 - i}: ${m.title} (${m.season} Season — ${m.format})
- **Date**: ${m.date}
- **Venue**: ${m.venue}
- **Teams**: ${m.team1} vs ${m.team2}
- **Result**: ${m.result}
- **Details**: ${m.details}
- **Official RDCA Scorecard**: https://rewa-cricket-division.vercel.app/matches/${m.slug}/`).join('\n\n')}

## 14 Statutory Governance Codes & Regulations
${rules.map((r, i) => `### Regulation ${i + 1}: ${r.title} (${r.category})
- **Summary**: ${r.summary}
- **Clauses**:
${r.clauses.map(c => `  - **${c.title}**: ${c.text}`).join('\n')}`).join('\n\n')}

## Governing Council
${tournament.governingCouncil.map(m => `- **${m.role}**: ${m.name} (${m.affiliation})`).join('\n')}

## Official Network
- Rewa Division Cricket Association (RDCA): https://rewa-cricket-division.vercel.app
- ABV Tournament Portal: https://abv-rewacricket.pages.dev
- Destroyers CC: https://destroyers-rewacricket.pages.dev
- Dread Eleven: https://dread-eleven-rewacricket.pages.dev
`;
  fs.writeFileSync(path.join(rootDir, 'llms-full.txt'), llmsFullTxt, 'utf-8');
  console.log('Built: llms-full.txt');

  const manifestJson = {
    "name": "Atal Bihari Vajpayee Memorial Tournament",
    "short_name": "ABV Trophy",
    "description": "Official portal of the Atal Bihari Vajpayee Memorial Tournament sanctioned by RDCA and MPCA.",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#0e5a3a",
    "icons": [
      {
        "src": "/public/images/logo-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/public/images/logo.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/public/images/trophy.svg",
        "sizes": "any",
        "type": "image/svg+xml"
      }
    ]
  };
  fs.writeFileSync(path.join(rootDir, 'manifest.json'), JSON.stringify(manifestJson, null, 2), 'utf-8');
  console.log('Built: manifest.json');

  const headersContent = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/llms.txt
  Access-Control-Allow-Origin: *
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

/llms-full.txt
  Access-Control-Allow-Origin: *
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

/sitemap.xml
  Content-Type: application/xml; charset=utf-8

/public/*
  Cache-Control: public, max-age=31536000, immutable
`;
  fs.writeFileSync(path.join(rootDir, '_headers'), headersContent, 'utf-8');
  console.log('Built: _headers');

  const redirectsContent = `/rule/* /rules/:splat 301
/team/* /teams/:splat 301
/council /governing-council 301
/live /matches 302
/scorecard /matches 302
/scorecards /matches 302
/leaderboard /stats 301
/leaderboards /stats 301
/records /stats 301
`;
  fs.writeFileSync(path.join(rootDir, '_redirects'), redirectsContent, 'utf-8');
  console.log('Built: _redirects');

  const googleVerifyFile = 'google23e3ba68f31a1fe8.html';
  const googleVerifyContent = 'google-site-verification: google23e3ba68f31a1fe8.html\n';
  fs.writeFileSync(path.join(rootDir, googleVerifyFile), googleVerifyContent, 'utf-8');
  ensureDir(path.join(rootDir, 'public'));
  fs.writeFileSync(path.join(rootDir, 'public', googleVerifyFile), googleVerifyContent, 'utf-8');
  console.log('Built: ' + googleVerifyFile + ' (Google Search Console Verification)');
}

// Master Build Function

// Build Combined Leaderboard / Stats Page (/stats/index.html)
function buildStatsPage() {
  const topBat = tournament.topPerformers.batting;
  const topBowl = tournament.topPerformers.bowling;
  const num = tournament.seasonInNumbers;
  const past = tournament.pastWinners;

  const content = `
<div class="page-head">
  <p class="eyebrow">Combined Official Telemetry &bull; 2021&ndash;2026</p>
  <h1>Tournament Leaderboards &amp; Records</h1>
  <p>All-Time Consolidated Player Statistics Across Both Competing Franchises (Destroyers CC &amp; Dread Eleven)</p>
</div>

<div class="card" style="margin-bottom:2rem;padding:1.5rem;background:#f0fdf4;border:1px solid #bbf7d0;">
  <p class="eyebrow" style="color:#166534;margin-bottom:0.25rem;">Official Championship Standings</p>
  <h3 style="color:#14532d;margin:0 0 0.5rem 0;font-size:1.25rem;">Series Level at 3&ndash;3 (Deadlock After 6 Editions &amp; 34 Matches)</h3>
  <p class="prose" style="margin:0;color:#166534;font-size:0.95rem;line-height:1.6;">
    The Atal Bihari Vajpayee Memorial Tournament stands precisely deadlocked at <strong>3&ndash;3 in championship titles</strong> between <strong>Dread Eleven</strong> (Champions: 2021, 2022, 2023 under Akhil Mishra) and <strong>Destroyers Cricket Club</strong> (Champions: 2024, 2025, 2026 under Pranav Dwivedi). Across 34 official bilateral matches, 10,842 runs have been scored and 498 wickets have fallen. Below are the certified combined leaderboards of both franchises.
  </p>
</div>

<!-- Telemetry At A Glance -->
<section class="section" style="margin-bottom:2.5rem;">
  <div class="section-title">
    <h2>Aggregated Tournament Metrics (34 Matches)</h2>
  </div>
  <div class="stat-grid">
    <div class="card stat"><div class="stat-value">34</div><div class="stat-label">Total Matches</div></div>
    <div class="card stat"><div class="stat-value">3&ndash;3</div><div class="stat-label">Series Titles (Tied)</div></div>
    <div class="card stat"><div class="stat-value">10,842</div><div class="stat-label">Total Runs Scored</div></div>
    <div class="card stat"><div class="stat-value">498</div><div class="stat-label">Total Wickets Fallen</div></div>
    <div class="card stat"><div class="stat-value">284/5</div><div class="stat-label">Highest Team Total</div></div>
    <div class="card stat"><div class="stat-value">8/39</div><div class="stat-label">Best Bowling Figures</div></div>
  </div>
</section>

<!-- Combined Leaderboards (Both Teams) -->
<section class="section">
  <div class="section-title">
    <div>
      <p class="eyebrow">Both Teams Combined</p>
      <h2>Official All-Time Player Leaderboards</h2>
    </div>
  </div>

  <div class="grid grid-2">
    <!-- Leading Run Scorers -->
    <div>
      <h3 style="margin-bottom:0.75rem;">Leading Run Scorers (Both Teams)</h3>
      <div class="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Team</th>
              <th class="num">Runs</th>
              <th class="num">Avg</th>
              <th class="num">SR</th>
            </tr>
          </thead>
          <tbody>
            ${topBat.map(b => `
              <tr>
                <td><strong>${b.name === 'Pranav Dwivedi' ? '<a href="https://destroyers-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi &rarr;</a>' : b.name === 'Akhil Mishra' ? '<a href="https://dread-eleven-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Akhil Mishra &rarr;</a>' : esc(b.name)}</strong></td>
                <td><span class="badge ${b.team.includes('Destroyers') ? 'badge-completed' : ''}">${esc(b.team)}</span></td>
                <td class="num font-bold">${b.runs}</td>
                <td class="num">${b.average}</td>
                <td class="num">${b.strikeRate}</td>
              </tr>
            `).join('\n            ')}
          </tbody>
        </table>
      </div>
      <p class="card-meta" style="margin-top:0.5rem;font-size:0.85rem;">Pranav Dwivedi leads all-time run charts with 1,435 runs at 57.4 avg (SR 146.4), closely followed by Akhil Mishra (1,378 runs, avg 44.5).</p>
    </div>

    <!-- Leading Wicket Takers -->
    <div>
      <h3 style="margin-bottom:0.75rem;">Leading Wicket Takers (Both Teams)</h3>
      <div class="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Team</th>
              <th class="num">Wkts</th>
              <th class="num">Avg</th>
              <th class="num">Econ</th>
            </tr>
          </thead>
          <tbody>
            ${topBowl.map(b => `
              <tr>
                <td><strong>${b.name === 'Pranav Dwivedi' ? '<a href="https://destroyers-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi &rarr;</a>' : esc(b.name)}</strong></td>
                <td><span class="badge ${b.team.includes('Destroyers') ? 'badge-completed' : ''}">${esc(b.team)}</span></td>
                <td class="num font-bold">${b.wickets}</td>
                <td class="num">${b.average}</td>
                <td class="num">${b.economy}</td>
              </tr>
            `).join('\n            ')}
          </tbody>
        </table>
      </div>
      <p class="card-meta" style="margin-top:0.5rem;font-size:0.85rem;">Pranav Dwivedi leads all-time wicket charts with 66 wickets at 16.3 avg (Econ 5.48, BBI 8/39), followed by Aditya Shrivastava (49 wkts, avg 21.2).</p>
    </div>
  </div>
</section>

<!-- Series Outcomes by Year -->
<section class="section" style="margin-top:2.5rem;">
  <div class="section-title">
    <h2>Roll of Honour &amp; 3&ndash;3 Deadlock Breakdown</h2>
  </div>
  <div class="card table-wrap">
    <table>
      <thead>
        <tr>
          <th>Edition</th>
          <th>Champion Franchise</th>
          <th>Winning Captain</th>
          <th class="num">Series Margin</th>
          <th>Title Count</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>2026 Edition</strong></td><td><strong>Destroyers Cricket Club</strong></td><td><a href="https://destroyers-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi (c) &rarr;</a></td><td class="num font-bold">3&ndash;2</td><td>Destroyers 3rd Title</td></tr>
        <tr><td><strong>2025 Edition</strong></td><td><strong>Destroyers Cricket Club</strong></td><td><a href="https://destroyers-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi (c) &rarr;</a></td><td class="num font-bold">5&ndash;0</td><td>Destroyers 2nd Title</td></tr>
        <tr><td><strong>2024 Edition</strong></td><td><strong>Destroyers Cricket Club</strong></td><td><a href="https://destroyers-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi (c) &rarr;</a></td><td class="num font-bold">4&ndash;1</td><td>Destroyers 1st Title</td></tr>
        <tr><td><strong>2023 Edition</strong></td><td><strong>Dread Eleven</strong></td><td><a href="https://dread-eleven-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Akhil Mishra (c) &rarr;</a></td><td class="num font-bold">3&ndash;2</td><td>Dread Eleven 3rd Title</td></tr>
        <tr><td><strong>2022 Edition</strong></td><td><strong>Dread Eleven</strong></td><td><a href="https://dread-eleven-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Akhil Mishra (c) &rarr;</a></td><td class="num font-bold">4&ndash;3</td><td>Dread Eleven 2nd Title</td></tr>
        <tr><td><strong>2021 Edition</strong></td><td><strong>Dread Eleven</strong></td><td><a href="https://dread-eleven-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Akhil Mishra (c) &rarr;</a></td><td class="num font-bold">5&ndash;2</td><td>Dread Eleven 1st Title</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- Official Athlete Portfolios & Google Knowledge Graph Anchors -->
<div class="card" style="margin-top:2.5rem;padding:1.5rem;background:#f8fafc;border:1px solid #cbd5e1;">
  <p class="eyebrow" style="color:#0f172a;margin-bottom:0.25rem;">Verified Cricketer Portfolios</p>
  <h3 style="margin-bottom:0.5rem;color:#0f172a;">Official Athlete Portfolios &amp; Google Knowledge Graph Anchors</h3>
  <p class="card-meta" style="margin-bottom:1.25rem;line-height:1.6;color:#475569;">
    Official machine-readable athlete profiles and entity homes maintained for both franchise captains under the Rewa Division Cricket Association:
  </p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;">
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:6px;padding:1.25rem;">
      <h4 style="margin:0 0 0.5rem 0;color:#0f172a;">Capt. Pranav Dwivedi (#7)</h4>
      <p style="font-size:0.85rem;color:#64748b;margin-bottom:0.75rem;">Destroyers CC Captain &bull; 1,435 Runs &bull; 66 Wickets &bull; 3x Champion</p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <a href="https://destroyers-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.8rem;padding:0.45rem 0.85rem;">Official Athlete Portfolio &rarr;</a>
        <a href="https://rewa-cricket-division.vercel.app/players/pranav-dwivedi/" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:0.8rem;padding:0.45rem 0.85rem;">RDCA Registry &rarr;</a>
      </div>
    </div>
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:6px;padding:1.25rem;">
      <h4 style="margin:0 0 0.5rem 0;color:#0f172a;">Capt. Akhil Mishra (#45)</h4>
      <p style="font-size:0.85rem;color:#64748b;margin-bottom:0.75rem;">Dread Eleven Captain &bull; 1,378 Runs &bull; 38 Wickets &bull; 2022 Champion</p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <a href="https://dread-eleven-rewacricket.pages.dev/portfolio/" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.8rem;padding:0.45rem 0.85rem;">Official Athlete Portfolio &rarr;</a>
        <a href="https://rewa-cricket-division.vercel.app/players/akhil-mishra/" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:0.8rem;padding:0.45rem 0.85rem;">RDCA Registry &rarr;</a>
      </div>
    </div>
  </div>
</div>

<!-- Official Cross-Network Backlinks -->
<div class="card" style="margin-top:2rem;padding:1.5rem">
  <h3 style="margin-bottom:0.5rem">Verified Historical Scorecards</h3>
  <p class="card-meta" style="margin-bottom:1rem">Access full ball-by-ball scorecards and division records on the official RDCA archive and franchise hubs:</p>
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    <a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="btn btn-primary">RDCA Official Tournament Central &rarr;</a>
    <a href="/matches/" class="btn btn-secondary">All 34 Match Cards &rarr;</a>
    <a href="https://destroyers-rewacricket.pages.dev/stats" target="_blank" rel="noopener" class="btn btn-secondary">Destroyers CC Stats &rarr;</a>
    <a href="https://dread-eleven-rewacricket.pages.dev/stats" target="_blank" rel="noopener" class="btn btn-secondary">Dread Eleven Stats &rarr;</a>
  </div>
</div>
`;

  const specificData = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "name": "Atal Bihari Vajpayee Memorial Tournament Leaderboards & Records",
    "description": "Consolidated player statistics and tournament records combining Destroyers CC and Dread Eleven across 34 bilateral matches (2021-2026).",
    "url": "https://abv-rewacricket.pages.dev/stats/",
    "publisher": {
      "@type": "SportsOrganization",
      "name": "Rewa Division Cricket Association (RDCA)",
      "url": "https://rewa-cricket-division.vercel.app"
    },
    "about": [
      {
        "@type": ["Person", "Athlete"],
        "name": "Pranav Dwivedi",
        "jobTitle": "Captain & Premier All-Rounder",
        "memberOf": {
          "@type": "SportsTeam",
          "name": "Destroyers Cricket Club (DES)"
        },
        "url": "https://destroyers-rewacricket.pages.dev/portfolio/",
        "sameAs": [
          "https://destroyers-rewacricket.pages.dev/portfolio/",
          "https://destroyers-rewacricket.pages.dev/players/pranav-dwivedi",
          "https://rewa-cricket-division.vercel.app/players/pranav-dwivedi/"
        ]
      },
      {
        "@type": ["Person", "Athlete"],
        "name": "Akhil Mishra",
        "jobTitle": "Captain & Top-Order All-Rounder",
        "memberOf": {
          "@type": "SportsTeam",
          "name": "Dread Eleven Cricket Club (DE)"
        },
        "url": "https://dread-eleven-rewacricket.pages.dev/portfolio/",
        "sameAs": [
          "https://dread-eleven-rewacricket.pages.dev/portfolio/",
          "https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra",
          "https://rewa-cricket-division.vercel.app/players/akhil-mishra/"
        ]
      }
    ]
  };

  const html = renderHtmlPage({
    title: "Tournament Leaderboards & All-Time Records | Atal Bihari Vajpayee Memorial Tournament",
    description: "Official consolidated leaderboards of both teams combined (Destroyers CC & Dread Eleven) for the Atal Bihari Vajpayee Memorial Tournament. Pranav Dwivedi (1,435 runs, 66 wkts), Akhil Mishra (1,378 runs). Series tied 3-3.",
    canonicalUrl: `${SITE_URL}/stats/`,
    activeNav: "stats",
    breadcrumbs: [{ name: "Leaderboards", path: "/stats/" }],
    bodyContent: content,
    specificData
  });

  ensureDir(path.join(rootDir, 'stats'));
  fs.writeFileSync(path.join(rootDir, 'stats/index.html'), html, 'utf-8');
  console.log('Built: stats/index.html (Pure RDCA UI)');
}

function buildAll() {
  console.log('Starting pure RDCA UI static build for abv-rewacricket...');
  buildHomePage();
  buildStatsPage();
  buildTeamsPage();
  buildMatchesPage();
  buildRulesPages();
  buildGoverningCouncilPage();
  buildNewsPage();
  buildContactPage();
  build404Page();
  buildSeoFiles();
  console.log('Static build completed successfully with pure RDCA UI, 100% JSON-LD & ZERO EMOJIS!');
}

buildAll();
