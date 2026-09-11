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

// HTML to Markdown converter for agentic content negotiation
function htmlToMarkdown(html, { title = '', url = '' } = {}) {
  let text = String(html || '');
  const mainMatch = text.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) text = mainMatch[1];

  // Convert tables
  text = text.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (m, inner) => {
    const rows = [...inner.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(r =>
      [...r[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(c =>
        c[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|')
      )
    );
    if (!rows.length) return '';
    const width = Math.max(...rows.map(r => r.length));
    const norm = rows.map(r => { const c = r.slice(); while (c.length < width) c.push(''); return c; });
    const out = [];
    out.push('| ' + norm[0].join(' | ') + ' |');
    out.push('| ' + Array(width).fill('---').join(' | ') + ' |');
    for (let i = 1; i < norm.length; i++) out.push('| ' + norm[i].join(' | ') + ' |');
    return '\n' + out.join('\n') + '\n';
  });

  // Convert lists
  text = text.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (m, inner) =>
    inner.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (mm, li) => `\n1. ${li.replace(/<[^>]+>/g, '').trim()}\n`)
  );
  text = text.replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi, (m, inner) =>
    inner.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (mm, li) => `\n- ${li.replace(/<[^>]+>/g, '').trim()}\n`)
  );

  // Convert headings
  text = text.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (m, lvl, inner) =>
    '\n\n' + '#'.repeat(Number(lvl)) + ' ' + inner.replace(/<[^>]+>/g, '').trim() + '\n'
  );

  // Remove scripts, styles, SVGs
  text = text.replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, '');
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // Convert links
  text = text.replace(/<a\b[^>]*href="([^"#]*)"[^>]*>\s*([\s\S]*?)<\/a>/gi, (m, href, inner) => {
    const linkText = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!linkText) return '';
    return `[${linkText}](${href})`;
  });

  // Basic formatting
  text = text.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**');
  text = text.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, '_$2_');
  text = text.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, '`$2`');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');
  text = text.replace(/<[^>]+>/g, '');

  let clean = text
    .split('\n')
    .map(line => line.replace(/[ \t]+/g, ' ').trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const header = [];
  if (title) header.push('# ' + title, '');
  if (url) header.push('Source: ' + url, '');
  return (header.length ? header.join('\n') + '\n' : '') + clean + '\n';
}

function writePageWithMd(relHtmlPath, html, title, canonicalUrl) {
  const fullHtmlPath = path.join(rootDir, relHtmlPath);
  ensureDir(path.dirname(fullHtmlPath));
  fs.writeFileSync(fullHtmlPath, html, 'utf-8');

  // Generate .md sibling
  let mdPath;
  if (relHtmlPath === 'index.html') mdPath = 'index.md';
  else if (relHtmlPath === '404.html') mdPath = '404.md';
  else mdPath = relHtmlPath.replace(/\/index\.html$/, '.md');

  const fullMdPath = path.join(rootDir, mdPath);
  ensureDir(path.dirname(fullMdPath));
  fs.writeFileSync(fullMdPath, htmlToMarkdown(html, { title, url: canonicalUrl }), 'utf-8');
}


// Global Header — Pure RDCA UI
function renderHeader(activeNav = '') {
  const navItems = [
    { name: 'Home', path: '/', key: 'home' },
    { name: 'About', path: '/about/', key: 'about' },
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
      <h3>Secretariat &amp; Trust</h3>
      <ul>
        <li><a href="/about/">About the Tournament</a></li>
        <li><a href="/privacy/">Privacy Policy</a></li>
        <li><a href="/contact/">Official Contact &amp; Hotline</a></li>
        <li><a href="/llms.txt">llms.txt (Agent Guide)</a></li>
      </ul>
      <p class="footer-note"><strong>Match Grounds:</strong><br>Divisional Cricket Stadium, Neem Chauraha, Rewa 486001<br>APSU University Stadium, Sirmour Road, Rewa 486003</p>
      <p class="footer-note"><strong>RDCA Secretariat:</strong> +91 7662 250001<br><strong>Email:</strong> contact@rdca.org.in</p>
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

  // 2. Primary Organization Schema (Complete with contactPoint and PostalAddress)
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
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Civil Lines, Near RDCA Cricket Ground",
      "addressLocality": "Rewa",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "486001",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "tournament administration",
      "email": "contact@rdca.org.in",
      "telephone": "+91 7662 250001",
      "availableLanguage": ["English", "Hindi"]
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
        "url": "https://pranav-dwivedi.pages.dev/",
        "sameAs": [
          "https://pranav-dwivedi.pages.dev/",
          "https://pranav-pramod-dwivedi.github.io/",
          "https://github.com/pranav-pramod-dwivedi",
          "https://destroyers-rewacricket.pages.dev/players/pranav-dwivedi",
          "https://rewa-cricket-division.vercel.app/players/pranav-dwivedi/",
          "https://cricheroes.com/association/79/rewa-divisional-cricket-association/home",
          "https://www.instagram.com/destroyers_rewa"
        ]
      },
      {
        "@type": ["Person", "Athlete"],
        "name": "Akhil Mishra",
        "jobTitle": "Captain & Top-Order All-Rounder, Dread Eleven",
        "url": "https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra",
        "sameAs": [
          "https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra",
          "https://rewa-cricket-division.vercel.app/players/akhil-mishra/",
          "https://cricheroes.com/association/79/rewa-divisional-cricket-association/home",
          "https://www.instagram.com/dreadeleven_rewa"
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

  writePageWithMd('index.html', html, 'Atal Bihari Vajpayee Memorial Tournament', `${SITE_URL}/`);
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
        <td><a href="https://pranav-dwivedi.pages.dev/" target="_blank" rel="noopener" style="font-weight:700; color:inherit; text-decoration:underline;">Pranav Dwivedi (c) &rarr;</a></td>
        <td class="num font-bold">3 (2024, 2025, 2026)</td>
        <td class="num font-bold">19</td>
        <td class="num">55.9%</td>
        <td>APSU University Stadium</td>
        <td><a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener" class="link">Destroyers Portal &rarr;</a></td>
      </tr>
      <tr>
        <td><strong>Dread Eleven (DE)</strong></td>
        <td><a href="https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra" target="_blank" rel="noopener" style="font-weight:700; color:inherit; text-decoration:underline;">Akhil Mishra (c) &rarr;</a></td>
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
        <a href="${t.website}/portfolio/" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.85rem; font-weight:700;">Official Athlete Website &rarr;</a>
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
          "url": t.id === 'des' ? 'https://pranav-dwivedi.pages.dev/' : 'https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra',
          "sameAs": t.id === 'des' ? [
            'https://pranav-dwivedi.pages.dev/',
            'https://pranav-pramod-dwivedi.github.io/',
            'https://github.com/pranav-pramod-dwivedi',
            'https://destroyers-rewacricket.pages.dev/players/pranav-dwivedi',
            'https://rewa-cricket-division.vercel.app/players/pranav-dwivedi/',
            'https://abv-rewacricket.pages.dev/',
            'https://cricheroes.com/association/79/rewa-divisional-cricket-association/home',
            'https://www.instagram.com/destroyers_rewa'
          ] : [
            'https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra',
            'https://rewa-cricket-division.vercel.app/players/akhil-mishra/',
            'https://abv-rewacricket.pages.dev/',
            'https://cricheroes.com/association/79/rewa-divisional-cricket-association/home',
            'https://www.instagram.com/dreadeleven_rewa'
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

  writePageWithMd('teams/index.html', html, 'Teams & Squads | ABV Memorial Tournament', `${SITE_URL}/teams/`);
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

  writePageWithMd('matches/index.html', html, 'Match Archive & Scorecards | ABV Memorial Tournament', `${SITE_URL}/matches/`);
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

  writePageWithMd('rules/index.html', indexHtml, 'Official Tournament Regulations | ABV Memorial Tournament', `${SITE_URL}/rules/`);
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

    writePageWithMd(path.join('rules', r.id, 'index.html'), ruleHtml, r.title, `${SITE_URL}/rules/${r.id}/`);
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

  writePageWithMd('governing-council/index.html', html, 'Governing Council | ABV Memorial Tournament', `${SITE_URL}/governing-council/`);
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

  writePageWithMd('news/index.html', html, 'Official Bulletins & News | ABV Memorial Tournament', `${SITE_URL}/news/`);
  console.log('Built: news/index.html (Pure RDCA UI)');
}


// Build About Page (about/index.html & about.md)
function buildAboutPage() {
  const content = `
<div class="page-head">
  <p class="eyebrow">Institutional Heritage &bull; Rewa Cricket</p>
  <h1>About the Atal Bihari Vajpayee Memorial Tournament</h1>
  <p>The premier annual cricket championship of Vindhya Pradesh, honoring former Prime Minister Shri Atal Bihari Vajpayee under the governance of the Rewa Division Cricket Association (RDCA) and Madhya Pradesh Cricket Association (MPCA).</p>
</div>

<div class="split">
  <div class="prose">
    <h2>1. Tournament Origins &amp; Memorial Significance</h2>
    <p>Established in 2021, the <strong>Atal Bihari Vajpayee Memorial Tournament</strong> is the cornerstone bilateral cricket championship of the Rewa Division. Conceived to celebrate the visionary leadership, eloquence, and sportsmanship of former Prime Minister of India, Bharat Ratna <strong>Shri Atal Bihari Vajpayee</strong>, the tournament provides a rigorous competitive proving ground for emerging cricketers from across the Vindhya region of Madhya Pradesh.</p>
    <p>The competition is officially sanctioned by the <strong>Rewa Division Cricket Association (RDCA)</strong> and conducted under playing conditions fully compliant with BCCI and MPCA statutory regulations.</p>

    <h2>2. The Historic 34-Match Bilateral Derby</h2>
    <p>The championship is contested exclusively through an intense, high-stakes 34-match bilateral derby between two flagship regional franchises:</p>
    <ul>
      <li><strong>Destroyers Cricket Club (DES):</strong> 2026 Champions and 5-time tournament victors, captained by all-rounder Pranav Dwivedi. Known for disciplined pace bowling units, aggressive middle-order play, and tactical depth.</li>
      <li><strong>Dread Eleven (DE):</strong> Inaugural winners and fierce perennial contenders, renowned for spin mastery and resilient fourth-innings run chases.</li>
    </ul>
    <p>Across four completed multi-format seasons, the tournament has witnessed historic individual records, including 2 centuries, 16 half-centuries, and multiple five-wicket hauls recorded in official RDCA ledgers.</p>

    <h2>3. Governance and Anti-Corruption Oversight</h2>
    <p>The tournament is governed by an independent Governing Council comprising senior administrators from the RDCA and MPCA. Play is governed by 14 comprehensive statutory regulatory codes, including a mandatory 60-second stop-clock between overs, the 15° illegal bowling action protocol with high-speed video review, and strict Players and Match Officials Area (PMOA) electronic blackouts administered by designated Anti-Corruption Officers.</p>

    <h2>4. Official Venues &amp; Infrastructure</h2>
    <p>Matches are hosted at premier turf facilities across Rewa:</p>
    <ul>
      <li><strong>Divisional Cricket Stadium, Neem Chauraha:</strong> RDCA headquarters featuring floodlight infrastructure, electronic scoreboard, and certified turf wickets.</li>
      <li><strong>APSU University Stadium, Sirmour Road:</strong> High-capacity venue hosting tournament playoffs and commemorative fixtures.</li>
    </ul>

    <h2>5. Integration with the RDCA Central Archive</h2>
    <p>Every match scorecard, playing XI, toss decision, and player milestone recorded on this portal is permanently synced with the central historical archive of the <a href="https://rewa-cricket-division.vercel.app">Rewa Division Cricket Association</a>.</p>
  </div>
</div>
`;

  const html = renderHtmlPage({
    title: "About the Tournament | Atal Bihari Vajpayee Memorial Tournament",
    description: "History, founding significance, 34-match derby tradition, and RDCA governance of the Atal Bihari Vajpayee Memorial Tournament.",
    canonicalUrl: `${SITE_URL}/about/`,
    activeNav: 'about',
    breadcrumbs: [{ name: 'About', path: '/about/' }],
    bodyContent: content
  });

  writePageWithMd('about/index.html', html, "About the Tournament", `${SITE_URL}/about/`);
  console.log('Built: about/index.html & about.md (Pure RDCA UI)');
}

// Build Privacy Page (privacy/index.html & privacy.md)
function buildPrivacyPage() {
  const content = `
<div class="page-head">
  <p class="eyebrow">Legal &bull; Data Governance</p>
  <h1>Privacy Policy &amp; Public Transparency</h1>
  <p>Official privacy policy and public records statement of the Atal Bihari Vajpayee Memorial Tournament Committee.</p>
</div>

<div class="split">
  <div class="prose">
    <h2>1. Commitment to Privacy &amp; Public Integrity</h2>
    <p>The <strong>Atal Bihari Vajpayee Memorial Tournament Committee</strong>, in coordination with the Rewa Division Cricket Association (RDCA), is committed to upholding rigorous standards of privacy, confidentiality, and data protection for all spectators, athletes, match officials, and automated digital research agents.</p>

    <h2>2. Zero-Tracking Architecture</h2>
    <p>This tournament portal (<code>abv-rewacricket.pages.dev</code>) operates under a privacy-by-design, zero-tracking philosophy:</p>
    <ul>
      <li><strong>No Tracking Pixels or Third-Party Beacons:</strong> We do not embed advertising trackers, social network surveillance beacons, or cross-site tracking technologies.</li>
      <li><strong>No Profiling or Behavioral Cookies:</strong> We do not set persistent advertising cookies or monetize user engagement data.</li>
      <li><strong>Infrastructure Logs:</strong> Edge hosting servers (Cloudflare Pages) record ephemeral, standard HTTP request diagnostics (IP address, user agent, requested path) strictly for network security, rate limiting, and DDoS mitigation.</li>
    </ul>

    <h2>3. Public Sporting Records and Player Data</h2>
    <p>All player statistics, team rosters, match scorecards, and tournament awards displayed across this website constitute verified public sporting records conducted under the official sanction of the RDCA and MPCA. In accordance with athletic data protection best practices, confidential personal telephone numbers, home addresses, or financial contract terms of athletes and match officials are never collected or published on this site.</p>

    <h2>4. Machine-Readable Access for AI Agents</h2>
    <p>We welcome search crawlers, research libraries, and AI agents. Content is made available via proactive Markdown negotiation (<code>Accept: text/markdown</code>), structured JSON-LD schemas, and <code>/llms.txt</code>. Automated agents are required to honor robots.txt directives and query at reasonable request cadences.</p>

    <h2>5. Grievances and Contact Information</h2>
    <p>For inquiries regarding data integrity, historical corrections, or tournament privacy practices, contact the Tournament Organizing Secretariat:</p>
    <ul>
      <li><strong>Entity:</strong> Atal Bihari Vajpayee Memorial Tournament Committee</li>
      <li><strong>Address:</strong> Civil Lines, Near RDCA Cricket Ground, Rewa, Madhya Pradesh 486001, India</li>
      <li><strong>Email:</strong> contact@rdca.org.in</li>
      <li><strong>Telephone:</strong> +91 7662 250001</li>
    </ul>
    <p><em>Effective Date: September 2026. Reviewed annually by the Governing Council.</em></p>
  </div>
</div>
`;

  const html = renderHtmlPage({
    title: "Privacy Policy | Atal Bihari Vajpayee Memorial Tournament",
    description: "Official privacy policy, zero tracking declaration, and public athletic records notice for the Atal Bihari Vajpayee Memorial Tournament.",
    canonicalUrl: `${SITE_URL}/privacy/`,
    activeNav: '',
    breadcrumbs: [{ name: 'Privacy Policy', path: '/privacy/' }],
    bodyContent: content
  });

  writePageWithMd('privacy/index.html', html, "Privacy Policy", `${SITE_URL}/privacy/`);
  console.log('Built: privacy/index.html & privacy.md (Pure RDCA UI)');
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

  writePageWithMd('contact/index.html', html, 'Official Contact & Venues | ABV Memorial Tournament', `${SITE_URL}/contact/`);
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

  writePageWithMd('404.html', html, '404 Not Found | ABV Memorial Tournament', `${SITE_URL}/404.html`);
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
LLM: ${SITE_URL}/llms.txt
LLM-Full: ${SITE_URL}/llms-full.txt
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
- [Capt. Pranav Dwivedi Independent Portfolio](https://pranav-dwivedi.pages.dev/)
- [Capt. Pranav Dwivedi GitHub Mirror](https://pranav-pramod-dwivedi.github.io/)
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

  // agent-instructions.txt
  const agentInstructions = `# Atal Bihari Vajpayee Memorial Tournament — Agent Instructions

## When to use this
Call this service when an AI agent or researcher needs:
1. Sourced match scorecards for the 34-match bilateral derby between Destroyers CC and Dread Eleven.
2. Verified leaderboards (runs, wickets, strike rates, bowling averages) for Rewa Division cricket.
3. Official 14 statutory codes including Anti-Corruption, Match Playing Conditions, and Stop-Clock Directives.

## How to interact
- Proactive Markdown negotiation: Send \`Accept: text/markdown\` on any page URL to receive clean Markdown tables.
- Machine endpoints: Access \`/llms.txt\`, \`/sitemap.xml\`, and \`/.well-known/mcp/manifest.json\`.
`;
  fs.writeFileSync(path.join(rootDir, 'agent-instructions.txt'), agentInstructions, 'utf-8');

  // MCP manifest
  const mcpManifest = {
    name: "abv-rewacricket-mcp",
    version: "1.0.0",
    protocolVersion: "2024-11-05",
    description: "Official Model Context Protocol (MCP) server for the Atal Bihari Vajpayee Memorial Tournament.",
    serverInfo: { name: "ABV Tournament MCP Server", version: "1.0.0" },
    tools: [
      {
        name: "get_tournament_stats",
        description: "Fetch tournament standings, head-to-head record, and aggregate statistics",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "get_derby_matches",
        description: "Fetch list of 34 bilateral matches between Destroyers CC and Dread Eleven",
        inputSchema: { type: "object", properties: { season: { type: "string" } } }
      }
    ]
  };
  ensureDir(path.join(rootDir, '.well-known/mcp'));
  fs.writeFileSync(path.join(rootDir, '.well-known/mcp/manifest.json'), JSON.stringify(mcpManifest, null, 2), 'utf-8');

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
  Vary: Accept, Accept-Encoding
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/*.md
  Content-Type: text/markdown; charset=utf-8
  Vary: Accept, Accept-Encoding
  Cache-Control: public, max-age=0, must-revalidate

/.well-known/mcp/*
  Access-Control-Allow-Origin: *
  Content-Type: application/json; charset=utf-8
  Vary: Accept, Accept-Encoding

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
                <td><strong>${b.name === 'Pranav Dwivedi' ? '<a href="https://pranav-dwivedi.pages.dev/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi &rarr;</a>' : b.name === 'Akhil Mishra' ? '<a href="https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Akhil Mishra &rarr;</a>' : esc(b.name)}</strong></td>
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
                <td><strong>${b.name === 'Pranav Dwivedi' ? '<a href="https://pranav-dwivedi.pages.dev/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi &rarr;</a>' : esc(b.name)}</strong></td>
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
        <tr><td><strong>2026 Edition</strong></td><td><strong>Destroyers Cricket Club</strong></td><td><a href="https://pranav-dwivedi.pages.dev/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi (c) &rarr;</a></td><td class="num font-bold">3&ndash;2</td><td>Destroyers 3rd Title</td></tr>
        <tr><td><strong>2025 Edition</strong></td><td><strong>Destroyers Cricket Club</strong></td><td><a href="https://pranav-dwivedi.pages.dev/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi (c) &rarr;</a></td><td class="num font-bold">5&ndash;0</td><td>Destroyers 2nd Title</td></tr>
        <tr><td><strong>2024 Edition</strong></td><td><strong>Destroyers Cricket Club</strong></td><td><a href="https://pranav-dwivedi.pages.dev/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Pranav Dwivedi (c) &rarr;</a></td><td class="num font-bold">4&ndash;1</td><td>Destroyers 1st Title</td></tr>
        <tr><td><strong>2023 Edition</strong></td><td><strong>Dread Eleven</strong></td><td><a href="https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Akhil Mishra (c) &rarr;</a></td><td class="num font-bold">3&ndash;2</td><td>Dread Eleven 3rd Title</td></tr>
        <tr><td><strong>2022 Edition</strong></td><td><strong>Dread Eleven</strong></td><td><a href="https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Akhil Mishra (c) &rarr;</a></td><td class="num font-bold">4&ndash;3</td><td>Dread Eleven 2nd Title</td></tr>
        <tr><td><strong>2021 Edition</strong></td><td><strong>Dread Eleven</strong></td><td><a href="https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">Akhil Mishra (c) &rarr;</a></td><td class="num font-bold">5&ndash;2</td><td>Dread Eleven 1st Title</td></tr>
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
        <a href="https://pranav-dwivedi.pages.dev/" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.8rem;padding:0.45rem 0.85rem;">Official Athlete Portfolio &rarr;</a>
        <a href="https://rewa-cricket-division.vercel.app/players/pranav-dwivedi/" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:0.8rem;padding:0.45rem 0.85rem;">RDCA Registry &rarr;</a>
      </div>
    </div>
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:6px;padding:1.25rem;">
      <h4 style="margin:0 0 0.5rem 0;color:#0f172a;">Capt. Akhil Mishra (#45)</h4>
      <p style="font-size:0.85rem;color:#64748b;margin-bottom:0.75rem;">Dread Eleven Captain &bull; 1,378 Runs &bull; 38 Wickets &bull; 2022 Champion</p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <a href="https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.8rem;padding:0.45rem 0.85rem;">Official Athlete Portfolio &rarr;</a>
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
        "url": "https://pranav-dwivedi.pages.dev/",
        "sameAs": [
          "https://pranav-dwivedi.pages.dev/",
          "https://pranav-pramod-dwivedi.github.io/",
          "https://github.com/pranav-pramod-dwivedi",
          "https://destroyers-rewacricket.pages.dev/players/pranav-dwivedi",
          "https://rewa-cricket-division.vercel.app/players/pranav-dwivedi/",
          "https://abv-rewacricket.pages.dev/",
          "https://cricheroes.com/association/79/rewa-divisional-cricket-association/home",
          "https://www.instagram.com/destroyers_rewa"
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
        "url": "https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra",
        "sameAs": [
          "https://dread-eleven-rewacricket.pages.dev/players/akhil-mishra",
          "https://rewa-cricket-division.vercel.app/players/akhil-mishra/",
          "https://abv-rewacricket.pages.dev/",
          "https://cricheroes.com/association/79/rewa-divisional-cricket-association/home",
          "https://www.instagram.com/dreadeleven_rewa"
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
  writePageWithMd('stats/index.html', html, 'Leaderboards & Statistics | ABV Memorial Tournament', `${SITE_URL}/stats/`);
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
  buildAboutPage();
  buildPrivacyPage();
  buildContactPage();
  build404Page();
  buildSeoFiles();
  console.log('Static build completed successfully with pure RDCA UI, 100% JSON-LD & ZERO EMOJIS!');
}

buildAll();
