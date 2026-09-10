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
      <img class="brand-logo" src="/public/images/logo-rewa-official.jpg" alt="Official emblem of Rewa District" width="44" height="44" />
      <span class="brand-text">
        <strong>Atal Bihari Vajpayee Memorial Tournament</strong>
        <small>Rewa Divisional Cricket &bull; MPCA</small>
      </span>
    </a>
    <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="nav" aria-label="Toggle menu"><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><rect y="3" width="20" height="2" rx="1"/><rect y="9" width="20" height="2" rx="1"/><rect y="15" width="20" height="2" rx="1"/></svg></button>
    <nav class="main-nav" data-nav id="nav" aria-label="Primary">
      <ul>
        ${navItems.map(item => `<li><a href="${item.path}" ${activeNav === item.key ? 'class="active"' : ''}>${item.name}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <a class="header-search-btn" href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" aria-label="RDCA Live Match Center" title="RDCA Live Match Center">RDCA Center &rarr;</a>
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
        <img src="/public/images/logo-rewa-official.jpg" alt="Official emblem of Rewa District" width="40" height="40" />
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

  // 2. Specific or Organization Schema
  if (specificData) {
    schemas.push(specificData);
  } else {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "SportsOrganization",
      "name": "Atal Bihari Vajpayee Memorial Tournament",
      "url": SITE_URL,
      "logo": `${SITE_URL}/public/images/trophy.svg`,
      "parentOrganization": {
        "@type": "SportsOrganization",
        "name": "Rewa Division Cricket Association (RDCA)",
        "url": "https://rewa-cricket-division.vercel.app"
      }
    });
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

<!-- Open Graph -->
<meta property="og:site_name" content="Atal Bihari Vajpayee Memorial Tournament | RDCA" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${safeDesc}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:image" content="${SITE_URL}/public/images/trophy.svg" />

<!-- Twitter -->
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${safeDesc}" />
<meta name="twitter:image" content="${SITE_URL}/public/images/trophy.svg" />

<link rel="icon" type="image/svg+xml" href="/public/images/trophy.svg" />
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

// All 34 Matches Data
const allMatchesData = [
  // 2026 Season
  { id: 'm-2026-05', date: '2026-09-20', season: 2026, format: 'T20', title: '2026 Championship Final', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 12 runs', details: 'DES 164/7 (20 ov) def. DE 152/9 (20 ov). Pranav Dwivedi 82 & 3/28.' },
  { id: 'm-2026-04', date: '2026-09-16', season: 2026, format: '50 Overs', title: 'One-Day Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 4 wickets', details: 'DE 238 all out (46.2 ov); DES 241/6 (44.1 ov). Anant Verma 76.' },
  { id: 'm-2026-03', date: '2026-09-12', season: 2026, format: '50 Overs', title: 'One-Day Derby Clash', venue: 'APS Ground Rewa', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 19 runs', details: 'DE 265/8 (50 ov); DES 246 all out (48.3 ov). Akhil Mishra 96*.' },
  { id: 'm-2026-02', date: '2026-09-08', season: 2026, format: 'T20', title: 'T20 Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 7 wickets', details: 'DE 142/9 (20 ov); DES 145/3 (17.2 ov). Sagar Pratap Singh 58*.' },
  { id: 'm-2026-01', date: '2026-09-05', season: 2026, format: 'T20', title: 'T20 Series Opener', venue: 'APS Ground Rewa', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 14 runs', details: 'DE 178/5 (20 ov); DES 164/8 (20 ov). Aditya Shrivastava 4/22.' },

  // 2025 Season
  { id: 'm-2025-05', date: '2025-09-20', season: 2025, format: 'T20', title: '2025 Championship Final', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 34 runs', details: 'DES 192/4 (20 ov); DE 158 all out (18.4 ov). Pranav Dwivedi 102*.' },
  { id: 'm-2025-04', date: '2025-09-16', season: 2025, format: '50 Overs', title: 'One-Day Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 5 wickets', details: 'DE 214 all out (43 ov); DES 218/5 (41.2 ov).' },
  { id: 'm-2025-03', date: '2025-09-12', season: 2025, format: '50 Overs', title: 'One-Day Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 68 runs', details: 'DES 284/5 (50 ov); DE 216 all out (44.5 ov). Highest Team Total.' },
  { id: 'm-2025-02', date: '2025-09-08', season: 2025, format: 'T20', title: 'T20 Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 6 wickets', details: 'DE 135/8 (20 ov); DES 138/4 (16.4 ov).' },
  { id: 'm-2025-01', date: '2025-09-05', season: 2025, format: 'T20', title: 'T20 Series Opener', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 22 runs', details: 'DES 170/6 (20 ov); DE 148/9 (20 ov).' },

  // 2024 Season
  { id: 'm-2024-05', date: '2024-09-22', season: 2024, format: 'T20', title: '2024 Championship Final', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 18 runs', details: 'DES 158/6 (20 ov); DE 140/9 (20 ov). First title for DES.' },
  { id: 'm-2024-04', date: '2024-09-18', season: 2024, format: '50 Overs', title: 'One-Day Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 3 wickets', details: 'DE 226 all out (47 ov); DES 227/7 (46.1 ov).' },
  { id: 'm-2024-03', date: '2024-09-14', season: 2024, format: '50 Overs', title: 'One-Day Derby Clash', venue: 'APS Ground Rewa', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 4 wickets', details: 'DES 210 all out (45.2 ov); DE 214/6 (43.4 ov).' },
  { id: 'm-2024-02', date: '2024-09-10', season: 2024, format: 'T20', title: 'T20 Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 8 wickets', details: 'DE 118 all out (18.1 ov); DES 121/2 (14.2 ov).' },
  { id: 'm-2024-01', date: '2024-09-06', season: 2024, format: 'T20', title: 'T20 Series Opener', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 29 runs', details: 'DES 175/5 (20 ov); DE 146 all out (19.1 ov).' },

  // 2023 Season
  { id: 'm-2023-05', date: '2023-09-24', season: 2023, format: 'T20', title: '2023 Championship Final', venue: 'APS Ground Rewa', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 15 runs', details: 'DE 162/6 (20 ov); DES 147/8 (20 ov). Third consecutive title for DE.' },
  { id: 'm-2023-04', date: '2023-09-20', season: 2023, format: '50 Overs', title: 'One-Day Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 38 runs', details: 'DE 254/7 (50 ov); DES 216 all out (44.3 ov).' },
  { id: 'm-2023-03', date: '2023-09-16', season: 2023, format: '50 Overs', title: 'One-Day Derby Clash', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 4 wickets', details: 'DE 198 all out (42 ov); DES 202/6 (41.1 ov).' },
  { id: 'm-2023-02', date: '2023-09-12', season: 2023, format: 'T20', title: 'T20 Derby Clash', venue: 'Martand School Ground No. 3', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 26 runs', details: 'DE 155/7 (20 ov); DES 129/9 (20 ov).' },
  { id: 'm-2023-01', date: '2023-09-08', season: 2023, format: 'T20', title: 'T20 Series Opener', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 5 wickets', details: 'DE 98 all out (16.4 ov); DES 100/5 (13.2 ov). Lowest team total for DE.' },

  // 2022 Season
  { id: 'm-2022-07', date: '2022-09-28', season: 2022, format: 'T20', title: '2022 Championship Final', venue: 'APS Ground Rewa', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 6 runs', details: 'DE 148/8 (20 ov); DES 142/9 (20 ov). Thrilling last-over finish.' },
  { id: 'm-2022-06', date: '2022-09-25', season: 2022, format: '50 Overs', title: 'One-Day Clash 4', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 2 wickets', details: 'DE 212 all out; DES 216/8.' },
  { id: 'm-2022-05', date: '2022-09-22', season: 2022, format: '50 Overs', title: 'One-Day Clash 3', venue: 'APS Ground Rewa', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 42 runs', details: 'DE 270/6; DES 228 all out.' },
  { id: 'm-2022-04', date: '2022-09-18', season: 2022, format: '50 Overs', title: 'One-Day Clash 2', venue: 'Martand School Ground No. 3', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 3 wickets', details: 'DES 234 all out; DE 238/7.' },
  { id: 'm-2022-03', date: '2022-09-14', season: 2022, format: '50 Overs', title: 'One-Day Clash 1', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 51 runs', details: 'DES 260/7; DE 209 all out.' },
  { id: 'm-2022-02', date: '2022-09-10', season: 2022, format: 'T20', title: 'T20 Clash 2', venue: 'Martand School Ground No. 3', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 17 runs', details: 'DE 160/5; DES 143/8.' },
  { id: 'm-2022-01', date: '2022-09-06', season: 2022, format: 'T20', title: 'T20 Series Opener', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 7 wickets', details: 'DE 128/9; DES 131/3.' },

  // 2021 Season
  { id: 'm-2021-07', date: '2021-09-30', season: 2021, format: 'T20', title: '2021 Inaugural Championship Final', venue: 'APS Ground Rewa', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 24 runs', details: 'DE 172/5 (20 ov); DES 148 all out (19.2 ov). DE crowned inaugural champions.' },
  { id: 'm-2021-06', date: '2021-09-26', season: 2021, format: '50 Overs', title: 'Inaugural One-Day Clash 4', venue: 'Martand School Ground No. 3', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 6 wickets', details: 'DES 189 all out; DE 192/4.' },
  { id: 'm-2021-05', date: '2021-09-22', season: 2021, format: '50 Overs', title: 'Inaugural One-Day Clash 3', venue: 'APS Ground Rewa', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 33 runs', details: 'DES 245/8; DE 212 all out.' },
  { id: 'm-2021-04', date: '2021-09-18', season: 2021, format: '50 Overs', title: 'Inaugural One-Day Clash 2', venue: 'Martand School Ground No. 3', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 45 runs', details: 'DE 258/6; DES 213 all out.' },
  { id: 'm-2021-03', date: '2021-09-14', season: 2021, format: '50 Overs', title: 'Inaugural One-Day Clash 1', venue: 'APS Ground Rewa', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 5 wickets', details: 'DES 204 all out; DE 208/5.' },
  { id: 'm-2021-02', date: '2021-09-10', season: 2021, format: 'T20', title: 'Inaugural T20 Clash 2', venue: 'Martand School Ground No. 3', team1: 'Destroyers Cricket Club', team2: 'Dread Eleven', result: 'Destroyers won by 4 wickets', details: 'DE 136/8; DES 138/6.' },
  { id: 'm-2021-01', date: '2021-09-06', season: 2021, format: 'T20', title: 'Inaugural Match of Tournament', venue: 'APS Ground Rewa', team1: 'Dread Eleven', team2: 'Destroyers Cricket Club', result: 'Dread Eleven won by 31 runs', details: 'DE 168/6 (20 ov); DES 137 all out (18.3 ov).' }
];

function renderMatchCard(m) {
  return `<article class="card match-card">
  <div class="match-top">
    <span class="competition">Atal Bihari Vajpayee Memorial Tournament &bull; ${m.season} (${m.format})</span>
    <span class="badge badge-completed">completed</span>
  </div>
  <div class="match-teams">
    <span class="team-name"><a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener">Destroyers Cricket Club</a></span>
    <span class="vs">VS</span>
    <span class="team-name"><a href="https://dread-eleven-rewacricket.pages.dev" target="_blank" rel="noopener">Dread Eleven</a></span>
  </div>
  <div class="match-footer">
    <span class="result">${esc(m.result)}</span> &bull; ${esc(m.venue)} &bull; <span class="card-meta">${esc(m.date)}</span>
  </div>
  <p class="card-meta" style="margin-top:0.4rem;font-size:0.85rem;">${esc(m.details)}</p>
</article>`;
}

// 1. Build Homepage (index.html)
function buildHomePage() {
  const num = tournament.seasonInNumbers;
  const topBat = tournament.topPerformers.batting;
  const topBowl = tournament.topPerformers.bowling;
  const past = tournament.pastWinners;

  const content = `
<div class="page-head">
  <p class="eyebrow">Mixed (T20 &amp; 50 Overs) &bull; 2021&ndash;2026</p>
  <h1>Atal Bihari Vajpayee Memorial Tournament</h1>
  <p>Status: completed &bull; Current Champions: Destroyers Cricket Club (2026)</p>
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

<!-- Regulations Table -->
<section class="section">
  <div class="section-title">
    <div>
      <p class="eyebrow">Governance</p>
      <h2>Official Tournament Regulations (14 Statutory Codes)</h2>
    </div>
    <a class="link" href="/rules/">All Regulations &rarr;</a>
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
    }
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
        <td>Pranav Dwivedi (c)</td>
        <td class="num font-bold">3 (2024, 2025, 2026)</td>
        <td class="num font-bold">19</td>
        <td class="num">55.9%</td>
        <td>APSU University Stadium</td>
        <td><a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener" class="link">Destroyers Portal &rarr;</a></td>
      </tr>
      <tr>
        <td><strong>Dread Eleven (DE)</strong></td>
        <td>Akhil Mishra (c)</td>
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
          "@type": "Person",
          "name": t.captain,
          "jobTitle": "Captain"
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

<div class="section-title">
  <h2>Statutory Codes Directory</h2>
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
    <changefreq>${u === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${u === '/' ? '1.0' : u.startsWith('/rules/') ? '0.7' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('Built: sitemap.xml');

  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(rootDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('Built: robots.txt');

  const llmsTxt = `# Atal Bihari Vajpayee Memorial Tournament
> The premier annual invitational cricket championship of Vindhya Pradesh, sanctioned by the Rewa Division Cricket Association (RDCA) and affiliated with the Madhya Pradesh Cricket Association (MPCA).

## Primary Documentation
- [Tournament Home](${SITE_URL}/)
- [The Derby Teams](${SITE_URL}/teams/)
- [Match Archive (34 Matches)](${SITE_URL}/matches/)
- [Official Regulations (14 Codes)](${SITE_URL}/rules/)
- [Governing Council](${SITE_URL}/governing-council/)
- [News & Media Releases](${SITE_URL}/news/)
- [Contact & Venues](${SITE_URL}/contact/)

## Official Franchise Portals
- [Destroyers Cricket Club](${teams[0].website})
- [Dread Eleven](${teams[1].website})
- [Rewa Cricket Division (RDCA Central)](https://rewa-cricket-division.vercel.app)
`;
  fs.writeFileSync(path.join(rootDir, 'llms.txt'), llmsTxt, 'utf-8');
  console.log('Built: llms.txt');

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
        "src": "/public/images/trophy.svg",
        "sizes": "192x192",
        "type": "image/svg+xml"
      }
    ]
  };
  fs.writeFileSync(path.join(rootDir, 'manifest.json'), JSON.stringify(manifestJson, null, 2), 'utf-8');
  console.log('Built: manifest.json');
}

// Master Build Function
function buildAll() {
  console.log('Starting pure RDCA UI static build for abv-rewacricket...');
  buildHomePage();
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
