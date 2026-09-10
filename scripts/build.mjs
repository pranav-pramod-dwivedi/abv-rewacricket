import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load Data
const tournament = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/tournament.json'), 'utf-8'));
const teams = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/teams.json'), 'utf-8'));
const rules = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/rules.json'), 'utf-8'));
const news = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/news.json'), 'utf-8'));

const SITE_URL = 'https://abv-rewacricket.pages.dev';

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function renderHeader(activeNav = '') {
  return `
  <div class="top-bar">
    <div class="container">
      <div>
        <span><strong>Official Tournament Portal:</strong> Atal Bihari Vajpayee Memorial Trophy &bull; RDCA &amp; MPCA</span>
      </div>
      <div class="top-bar-links">
        <a href="https://rewa-cricket-division.vercel.app" target="_blank" rel="noopener">RDCA Central ↗</a>
        <a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener">Destroyers CC ↗</a>
        <a href="https://dread-eleven-rewacricket.pages.dev" target="_blank" rel="noopener">Dread Eleven ↗</a>
        <a href="/rules/anti-corruption/" style="color: var(--accent); font-weight: 600;">ACU Hotline: +91 7662 250011</a>
      </div>
    </div>
  </div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="Atal Bihari Vajpayee Memorial Tournament — Home">
        <div class="brand-emblem-wrap">
          <img src="/public/images/trophy.svg" alt="ABV Trophy Emblem" width="26" height="26">
        </div>
        <span class="brand-text">
          <strong>ABV Memorial Tournament</strong>
          <small>Rewa Divisional Cricket &bull; MPCA</small>
        </span>
      </a>
      <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="nav" aria-label="Toggle menu">&#9776;</button>
      <nav class="main-nav" data-nav id="nav" aria-label="Primary">
        <ul>
          <li><a href="/" class="${activeNav === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="/teams/" class="${activeNav === 'teams' ? 'active' : ''}">The Teams (2)</a></li>
          <li><a href="/matches/" class="${activeNav === 'matches' ? 'active' : ''}">Matches &amp; RDCA</a></li>
          <li><a href="/rules/" class="${activeNav === 'rules' ? 'active' : ''}">Regulations (14)</a></li>
          <li><a href="/governing-council/" class="${activeNav === 'council' ? 'active' : ''}">Governing Council</a></li>
          <li><a href="/news/" class="${activeNav === 'news' ? 'active' : ''}">News</a></li>
          <li><a href="/contact/" class="${activeNav === 'contact' ? 'active' : ''}">Contact</a></li>
          <li><a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="nav-cta-btn">&#127942; RDCA Live Center &rarr;</a></li>
        </ul>
      </nav>
    </div>
  </header>
  `;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div>
        <div class="footer-brand" style="margin-bottom: 0.75rem;">
          <div class="brand-emblem-wrap" style="background: rgba(255,255,255,0.1); border-color: var(--accent);">
            <img src="/public/images/trophy.svg" alt="ABV Trophy" width="24" height="24">
          </div>
          <h3 style="margin: 0; font-size: 1.2rem;">Atal Bihari Vajpayee Memorial Tournament</h3>
        </div>
        <p class="footer-note" style="color: #d1d5db; line-height: 1.6; max-width: 48ch;">
          The premier invitational cricket championship of Vindhya Pradesh, honoring former Prime Minister Shri Atal Bihari Vajpayee. Contested through the iconic 34-match derby between Destroyers Cricket Club and Dread Eleven. Officially sanctioned by the Rewa Division Cricket Association (RDCA) and affiliated with Madhya Pradesh Cricket Association (MPCA).
        </p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">
          <span class="badge badge-completed">RDCA Sanctioned</span>
          <span class="badge badge-completed">MPCA Affiliated</span>
          <span class="badge badge-completed">BCCI Code Compliant</span>
        </div>
      </div>

      <div>
        <h3>Official Rewa Cricket Network</h3>
        <ul>
          <li><a href="https://rewa-cricket-division.vercel.app" target="_blank" rel="noopener" style="color: var(--accent); font-weight: 600;">Rewa Cricket Division (RDCA) ↗</a></li>
          <li><a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener">RDCA Tournament Fixtures ↗</a></li>
          <li><a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener" style="color: #f59e0b; font-weight: 600;">Destroyers CC Portal (2026 Champs) ↗</a></li>
          <li><a href="https://dread-eleven-rewacricket.pages.dev" target="_blank" rel="noopener" style="color: #a3e635; font-weight: 600;">Dread Eleven Digital Stadium ↗</a></li>
          <li><a href="/" style="color: #fff; font-weight: 600;">ABV Tournament Official Portal (Here)</a></li>
        </ul>
      </div>

      <div>
        <h3>Key Regulatory Codes</h3>
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
        <h3>Headquarters &amp; Venues</h3>
        <p class="footer-note" style="color: #d1d5db; margin-bottom: 0.5rem;">
          <strong>Match Venue:</strong><br>
          Divisional Cricket Stadium, Neem Chauraha, Boda Bagh Road, Rewa, MP 486001 (Near Neem Chauraha Hanuman Mandir)
        </p>
        <p class="footer-note" style="color: #d1d5db; margin-bottom: 0.5rem;">
          <strong>MPCA Indore:</strong> +91 731 2543602 &bull; +91 731 2434575
        </p>
        <p class="footer-note" style="color: #d1d5db;">
          <strong>RDCA Rewa:</strong> +91 7662 250000<br>
          <strong>ACU Hotline:</strong> +91 7662 250011
        </p>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-legal" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <p class="footer-copyright" style="margin: 0;">
          &copy; 2021&ndash;2026 Atal Bihari Vajpayee Memorial Tournament Committee &bull; All rights reserved.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="/rules/image-use-terms/">Image Terms</a>
          <a href="/rules/media-accreditation/">Media Terms</a>
          <a href="/rules/news-access-regulations/">News Access</a>
          <a href="/llms.txt">LLMs.txt</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
  <script src="/public/js/app.js" defer></script>
  `;
}

function renderHtmlPage({ title, description, canonicalUrl, activeNav = '', bodyContent, structuredData = null }) {
  const jsonLd = structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${SITE_URL}/public/images/trophy.svg">
  <meta property="og:site_name" content="Atal Bihari Vajpayee Memorial Tournament">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${SITE_URL}/public/images/trophy.svg">

  <link rel="icon" type="image/svg+xml" href="/public/images/trophy.svg">
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="/public/css/styles.css">
  ${jsonLd}
</head>
<body>
  ${renderHeader(activeNav)}
  <main id="main">
    ${bodyContent}
  </main>
  ${renderFooter()}
</body>
</html>`;
}

// 1. Generate Home Page (index.html)
function buildHomePage() {
  const num = tournament.seasonInNumbers;
  const topBat = tournament.topPerformers.batting;
  const topBowl = tournament.topPerformers.bowling;
  const w26 = tournament.winners2026;
  const past = tournament.pastWinners;

  const content = `
  <section class="hero">
    <div class="container">
      <div class="brand-emblem-wrap" style="width: 72px; height: 72px; margin: 0 auto 1.25rem; background: rgba(255,255,255,0.15); border: 2px solid var(--accent);">
        <img src="/public/images/trophy.svg" alt="ABV Trophy" width="40" height="40">
      </div>
      <p class="eyebrow">Rewa Divisional Cricket &bull; MPCA Sanctioned</p>
      <h1>Atal Bihari Vajpayee Memorial Tournament</h1>
      <p>The premier invitational cricket championship of Vindhya Pradesh, honoring former Prime Minister Shri Atal Bihari Vajpayee. Sanctioned by Rewa Division Cricket Association (RDCA) and MPCA.</p>
      <div class="hero-actions">
        <a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="btn btn-primary">&#127942; RDCA Live Match Center &rarr;</a>
        <a href="/teams/" class="btn btn-ghost">The Derby Teams (2)</a>
        <a href="/rules/" class="btn btn-ghost">14 Official Regulations</a>
      </div>
    </div>
  </section>

  <div class="container">
    <!-- 2026 Champions Showcase Card -->
    <section class="section" style="margin-top: 2rem;">
      <div class="card card-official" style="padding: 1.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line); padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="/public/images/trophy.svg" alt="Trophy" width="22" height="22">
            <strong style="font-family: var(--serif); font-size: 1.15rem; color: var(--brand-dark);">Reigning Champions &bull; 2026 Title Holders</strong>
          </div>
          <span class="badge badge-completed" style="font-size: 0.8rem; padding: 0.25rem 0.65rem;">
            3 Consecutive Titles (2024, 2025, 2026)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center;">
          <div>
            <h2 style="font-family: var(--serif); font-size: 2rem; color: var(--brand-dark); margin-bottom: 0.35rem;">
              ${w26.champion}
            </h2>
            <p style="color: var(--muted); font-size: 0.95rem; margin-bottom: 0.5rem;">
              <strong>Captain:</strong> ${w26.captain} &bull; <strong>Series Outcome:</strong> ${w26.seriesResult}
            </p>
            <p style="font-weight: 700; color: var(--brand); font-size: 1.05rem; margin-bottom: 0.75rem;">
              ${w26.finalScore}
            </p>
            <p style="color: #404040; line-height: 1.6; margin-bottom: 1.25rem; max-width: 65ch;">
              ${w26.summary}
            </p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: 0.85rem;">
                Visit Destroyers CC Portal ↗
              </a>
              <a href="https://dread-eleven-rewacricket.pages.dev" target="_blank" rel="noopener" class="btn btn-outline" style="font-size: 0.85rem;">
                Visit Dread Eleven Stadium ↗
              </a>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 1.5rem; background: var(--brand-light); padding: 1.25rem 2rem; border-radius: var(--radius); border: 1px solid var(--line); text-align: center;">
            <div>
              <div style="width: 64px; height: 64px; margin: 0 auto 0.5rem; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #3b82f6;">
                <img src="/public/images/des.svg" alt="DES Emblem" width="40" height="40">
              </div>
              <strong style="display: block; font-size: 0.9rem; color: var(--brand-dark);">Destroyers</strong>
              <small style="color: var(--muted);">164/7 (20 ov)</small>
            </div>
            <div style="font-weight: 900; color: #9ca3af; font-size: 1.2rem;">DEF.</div>
            <div>
              <div style="width: 64px; height: 64px; margin: 0 auto 0.5rem; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ef4444;">
                <img src="/public/images/de.svg" alt="DE Emblem" width="40" height="40">
              </div>
              <strong style="display: block; font-size: 0.9rem; color: var(--brand-dark);">Dread Eleven</strong>
              <small style="color: var(--muted);">152/9 (20 ov)</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Season in Numbers -->
    <section class="section">
      <div class="section-title">
        <h2>Season in Numbers (2021&ndash;2026)</h2>
        <span class="card-meta">Aggregated tournament statistical telemetry</span>
      </div>

      <div class="stat-grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
        <div class="card stat">
          <div class="stat-value">${num.matchesPlayed}</div>
          <div class="stat-label">Matches Contested</div>
        </div>
        <div class="card stat">
          <div class="stat-value">${num.runsScored.toLocaleString()}</div>
          <div class="stat-label">Total Runs Scored</div>
        </div>
        <div class="card stat">
          <div class="stat-value">${num.wicketsFallen}</div>
          <div class="stat-label">Wickets Fallen</div>
        </div>
        <div class="card stat">
          <div class="stat-value">${num.boundaries.fours} / ${num.boundaries.sixes}</div>
          <div class="stat-label">Fours / Sixes</div>
        </div>
        <div class="card stat">
          <div class="stat-value">${num.centuries} / ${num.fifties}</div>
          <div class="stat-label">Centuries / 50s</div>
        </div>
        <div class="card stat">
          <div class="stat-value">${num.bestBowlingFigures.split(' ')[0]}</div>
          <div class="stat-label">Best Bowling</div>
        </div>
      </div>
    </section>

    <!-- The 2 Competing Teams -->
    <section class="section">
      <div class="section-title">
        <h2>The Founding Derby Teams (2)</h2>
        <a href="/teams/" class="link">View Derby History &rarr;</a>
      </div>

      <div class="grid grid-2">
        ${teams.map(t => `
          <div class="card card-official" style="padding: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="width: 58px; height: 58px; border-radius: 50%; background: var(--brand-light); border: 2px solid var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <img src="/public/images/${t.id}.svg" alt="${t.name}" width="38" height="38">
              </div>
              <div>
                <h3 style="font-family: var(--serif); font-size: 1.35rem; color: var(--brand-dark); margin: 0;">${t.name}</h3>
                <span class="card-meta">${t.city} &bull; <strong>Captain:</strong> ${t.captain}</span>
              </div>
            </div>
            <div style="margin-bottom: 0.75rem;">
              <span class="badge badge-completed">${t.titles}</span>
            </div>
            <p style="color: #404040; font-size: 0.925rem; line-height: 1.6; margin-bottom: 1.25rem;">
              ${t.description}
            </p>
            <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 1.25rem;">
              <strong>Home Ground:</strong> ${t.homeGround}
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="${t.website}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: 0.85rem;">
                Official Club Portal ↗
              </a>
              <a href="${t.website}/matches" target="_blank" rel="noopener" class="btn btn-outline" style="font-size: 0.85rem;">
                Match Scorecards ↗
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Official Matches Redirection Card -->
    <section class="section">
      <div class="card card-official" style="padding: 1.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
        <div style="max-width: 60ch;">
          <span class="badge badge-completed" style="margin-bottom: 0.5rem;">Central RDCA Scoring Architecture</span>
          <h2 style="font-family: var(--serif); font-size: 1.5rem; color: var(--brand-dark); margin: 0.35rem 0;">
            Match Fixtures, Live Scores &amp; Ball-by-Ball Commentary
          </h2>
          <p style="color: #404040; line-height: 1.6; margin: 0;">
            Pursuant to MPCA electronic scoring guidelines, all official tournament fixtures, umpire match reports, wagon wheels, and live scorecards are centrally hosted on the <strong>Rewa Division Cricket Association Central Web Infrastructure</strong>.
          </p>
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="btn btn-primary">
            &#127942; RDCA Tournament Hub &rarr;
          </a>
          <a href="https://rewa-cricket-division.vercel.app/matches/" target="_blank" rel="noopener" class="btn btn-outline">
            RDCA Matches Central &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- Top Performers (Batting & Bowling) -->
    <section class="section">
      <div class="section-title">
        <h2>All-Time Top Performers</h2>
        <span class="card-meta">Batting &amp; Bowling records (2021&ndash;2026)</span>
      </div>

      <div class="grid grid-2">
        <div class="table-wrap">
          <h3 style="font-family: var(--serif); font-size: 1.15rem; color: var(--brand-dark); padding: 0.8rem 0.9rem; margin: 0; border-bottom: 1px solid var(--line); background: #f9fbf9;">
            Leading Run Scorers
          </h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Batsman</th>
                <th>Team</th>
                <th>Runs</th>
                <th>Avg</th>
                <th>SR</th>
              </tr>
            </thead>
            <tbody>
              ${topBat.map(b => `
                <tr>
                  <td><strong>${b.rank}</strong></td>
                  <td><strong>${b.name}</strong></td>
                  <td>${b.team}</td>
                  <td><strong style="color: var(--brand);">${b.runs}</strong></td>
                  <td>${b.average}</td>
                  <td>${b.strikeRate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="table-wrap">
          <h3 style="font-family: var(--serif); font-size: 1.15rem; color: var(--brand-dark); padding: 0.8rem 0.9rem; margin: 0; border-bottom: 1px solid var(--line); background: #f9fbf9;">
            Leading Wicket Takers
          </h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Bowler</th>
                <th>Team</th>
                <th>Wkts</th>
                <th>Avg</th>
                <th>BBI</th>
              </tr>
            </thead>
            <tbody>
              ${topBowl.map(w => `
                <tr>
                  <td><strong>${w.rank}</strong></td>
                  <td><strong>${w.name}</strong></td>
                  <td>${w.team}</td>
                  <td><strong style="color: var(--brand);">${w.wickets}</strong></td>
                  <td>${w.average}</td>
                  <td>${w.bestBowling}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Past Winners Roll of Honour -->
    <section class="section">
      <div class="section-title">
        <h2>Championship Roll of Honour (2021&ndash;2026)</h2>
        <span class="card-meta">Edition-by-edition champions and runners-up</span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Champion</th>
              <th>Winning Captain</th>
              <th>Runner-Up</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            ${past.map(p => `
              <tr>
                <td><strong>${p.year}</strong></td>
                <td><strong style="color: var(--brand);">${p.winner}</strong></td>
                <td>${p.captain}</td>
                <td>${p.runnerUp}</td>
                <td>${p.score}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- 14 Official Regulations Grid -->
    <section class="section">
      <div class="section-title">
        <h2>14 Official Tournament Regulations</h2>
        <a href="/rules/" class="link">View Complete Regulatory Code &rarr;</a>
      </div>

      <div class="grid grid-3">
        ${rules.slice(0, 6).map(r => `
          <div class="card" style="display: flex; flex-direction: column;">
            <div style="margin-bottom: 0.4rem;">
              <span class="badge badge-completed">${r.category}</span>
            </div>
            <h3 style="font-family: var(--serif); font-size: 1.15rem; color: var(--brand-dark); margin: 0.35rem 0 0.5rem;">
              ${r.title}
            </h3>
            <p style="color: var(--muted); font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem; flex: 1;">
              ${r.summary}
            </p>
            <a href="/rules/${r.id}/" style="font-weight: 600; font-size: 0.85rem;">Read Policy Clauses &rarr;</a>
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 1.5rem;">
        <a href="/rules/" class="btn btn-outline">Explore All 14 Official Regulatory Policies &rarr;</a>
      </div>
    </section>

    <!-- Official News -->
    <section class="section">
      <div class="section-title">
        <h2>Official Tournament Bulletins &amp; News</h2>
        <a href="/news/" class="link">View All Circulars &rarr;</a>
      </div>

      <div class="grid grid-3">
        ${news.slice(0, 3).map(n => `
          <div class="card" style="display: flex; flex-direction: column;">
            <div style="font-size: 0.75rem; color: var(--muted); margin-bottom: 0.35rem;">
              ${n.category} &bull; ${n.publishedAt}
            </div>
            <h3 style="font-family: var(--serif); font-size: 1.15rem; color: var(--brand-dark); margin-bottom: 0.5rem;">
              ${n.title}
            </h3>
            <p style="color: #404040; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem; flex: 1;">
              ${n.summary}
            </p>
            <a href="/news/" style="font-weight: 600; font-size: 0.85rem;">Read Full Circular &rarr;</a>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Administrative Contact & Venues -->
    <section class="section" style="margin-bottom: 3rem;">
      <div class="section-title">
        <h2>Official Contact &amp; Venues</h2>
        <span class="card-meta">Administrative addresses and helpline contacts</span>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; color: var(--brand-dark); margin-bottom: 1rem; border-bottom: 1px solid var(--line); padding-bottom: 0.5rem;">
            Tournament Venue &amp; Local RDCA
          </h3>
          <div class="contact-item">
            <strong>Match Stadium:</strong>
            <div>
              ${tournament.contact.stadiumName}<br>
              ${tournament.contact.locality}, ${tournament.contact.city}, ${tournament.contact.state} ${tournament.contact.pincode}<br>
              <small style="color: var(--brand); font-weight: 600;">Landmark: ${tournament.contact.landmark}</small>
            </div>
          </div>
          <div class="contact-item">
            <strong>RDCA Office:</strong>
            <div>${tournament.contact.rdcaOffice}</div>
          </div>
          <div class="contact-item">
            <strong>Local Phones:</strong>
            <div>${tournament.contact.rdcaPhones.join(' &bull; ')}</div>
          </div>
          <div class="contact-item">
            <strong>Local Email:</strong>
            <div><a href="mailto:${tournament.contact.rdcaEmail}">${tournament.contact.rdcaEmail}</a></div>
          </div>
        </div>

        <div class="card">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; color: var(--brand-dark); margin-bottom: 1rem; border-bottom: 1px solid var(--line); padding-bottom: 0.5rem;">
            State MPCA &amp; Integrity Hotlines
          </h3>
          <div class="contact-item">
            <strong>MPCA Office:</strong>
            <div>${tournament.contact.mpcaOffice}</div>
          </div>
          <div class="contact-item">
            <strong>MPCA Phones:</strong>
            <div>${tournament.contact.mpcaPhones.join(' &bull; ')}</div>
          </div>
          <div class="contact-item">
            <strong>MPCA Email:</strong>
            <div><a href="mailto:${tournament.contact.mpcaEmail}">${tournament.contact.mpcaEmail}</a></div>
          </div>

          <div class="hotline-box">
            <strong>Anti-Corruption &amp; Integrity Helpline:</strong><br>
            Direct telephone: <a href="tel:+917662250011" style="font-weight: 700; color: #7f1d1d;">${tournament.contact.antiCorruptionHotline}</a><br>
            <small>Confidential reporting of corrupt approaches or match fixing concerns. Monitored 24/7.</small>
          </div>
        </div>
      </div>
    </section>
  </div>
  `;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "Atal Bihari Vajpayee Memorial Tournament",
    "alternateName": ["ABV Memorial Trophy", "ABV Tournament Rewa"],
    "url": `${SITE_URL}/`,
    "logo": `${SITE_URL}/public/images/trophy.svg`,
    "description": "Official portal of the Atal Bihari Vajpayee Memorial Tournament in Rewa, Madhya Pradesh. Official rules, season telemetry, past champions, and participating teams.",
    "parentOrganization": {
      "@type": "SportsOrganization",
      "name": "Rewa Division Cricket Association (RDCA)",
      "url": "https://rewa-cricket-division.vercel.app"
    },
    "member": [
      {
        "@type": "SportsTeam",
        "name": "Destroyers Cricket Club",
        "url": "https://destroyers-rewacricket.pages.dev"
      },
      {
        "@type": "SportsTeam",
        "name": "Dread Eleven Cricket Club",
        "url": "https://dread-eleven-rewacricket.pages.dev"
      }
    ],
    "sameAs": [
      "https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/",
      "https://destroyers-rewacricket.pages.dev",
      "https://dread-eleven-rewacricket.pages.dev"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Divisional Cricket Stadium, Neem Chauraha, Boda Bagh Road",
      "addressLocality": "Rewa",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "486001",
      "addressCountry": "IN"
    },
    "telephone": "+91-731-2543602"
  };

  const html = renderHtmlPage({
    title: "Atal Bihari Vajpayee Memorial Tournament — Official Portal | RDCA & MPCA",
    description: "Official portal of the Atal Bihari Vajpayee Memorial Tournament, Rewa. Tournament rules, season telemetry, champions, participating teams, and contact.",
    canonicalUrl: `${SITE_URL}/`,
    activeNav: 'home',
    bodyContent: content,
    structuredData
  });

  fs.writeFileSync(path.join(rootDir, 'index.html'), html, 'utf-8');
  console.log('Built: index.html (RDCA UI)');
}

// 2. Generate Teams Page (teams/index.html)
function buildTeamsPage() {
  ensureDir(path.join(rootDir, 'teams'));

  const content = `
  <div class="page-head-banner">
    <div class="container">
      <div class="breadcrumbs">
        <ol>
          <li><a href="/">Home</a></li>
          <li aria-current="page">The Derby Teams</li>
        </ol>
      </div>
      <h1>The Founding Derby Teams (2)</h1>
      <p>
        The Atal Bihari Vajpayee Memorial Tournament is contested exclusively as the marquee bilateral rivalry between <strong>Destroyers Cricket Club (DES)</strong> and <strong>Dread Eleven (DE)</strong> across 34 matches from 2021 to 2026.
      </p>
    </div>
  </div>

  <div class="container">
    <!-- Derby Scoreboard Card -->
    <div class="derby-scoreboard">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span class="badge badge-completed" style="font-size: 0.85rem; padding: 0.35rem 0.85rem;">
          All-Time Derby Head-to-Head: 34 Clashes (2021&ndash;2026)
        </span>
      </div>
      <div class="derby-vs-grid">
        <div class="derby-club">
          <div class="derby-club-emblem" style="border-color: #3b82f6;">
            <img src="/public/images/des.svg" alt="Destroyers CC">
          </div>
          <h2 style="font-family: var(--serif); font-size: 1.5rem; color: var(--brand-dark); margin-bottom: 0.25rem;">Destroyers CC</h2>
          <div style="font-size: 2.25rem; font-weight: 900; color: #f59e0b;">19 WINS</div>
          <div style="font-size: 0.8rem; color: var(--muted);">55.9% Win Rate &bull; 3 Titles</div>
        </div>

        <div style="text-align: center;">
          <div style="font-size: 1.25rem; font-weight: 900; color: #9ca3af;">VS</div>
          <div style="font-size: 0.8rem; color: var(--brand); font-weight: 700; margin-top: 0.25rem;">34 MATCHES</div>
          <div style="font-size: 0.75rem; color: var(--muted);">3-3 Title Tie</div>
        </div>

        <div class="derby-club">
          <div class="derby-club-emblem" style="border-color: #ef4444;">
            <img src="/public/images/de.svg" alt="Dread Eleven">
          </div>
          <h2 style="font-family: var(--serif); font-size: 1.5rem; color: var(--brand-dark); margin-bottom: 0.25rem;">Dread Eleven</h2>
          <div style="font-size: 2.25rem; font-weight: 900; color: #84cc16;">15 WINS</div>
          <div style="font-size: 0.8rem; color: var(--muted);">44.1% Win Rate &bull; 3 Titles</div>
        </div>
      </div>
    </div>

    <!-- The 2 Teams Grid -->
    <div class="grid grid-2" style="margin-bottom: 3rem;">
      ${teams.map(t => `
        <div class="card card-official" style="padding: 1.75rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--brand-light); border: 2px solid var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <img src="/public/images/${t.id}.svg" alt="${t.name}" width="44" height="44">
            </div>
            <div>
              <h2 style="font-family: var(--serif); font-size: 1.5rem; color: var(--brand-dark); margin: 0;">${t.name}</h2>
              <span class="card-meta">${t.city} &bull; Est. ${t.established}</span>
            </div>
          </div>

          <div style="margin-bottom: 1rem;">
            <span class="badge badge-completed">${t.titles}</span>
          </div>

          <p style="color: #404040; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
            ${t.description}
          </p>

          <div style="background: #f9fbf9; border: 1px solid var(--line); border-radius: var(--radius); padding: 1rem; margin-bottom: 1.5rem;">
            <div style="font-size: 0.875rem; color: var(--muted); margin-bottom: 0.35rem;">
              <strong>Team Captain:</strong> <span style="color: var(--brand-dark); font-weight: 700;">${t.captain}</span>
            </div>
            <div style="font-size: 0.875rem; color: var(--muted);">
              <strong>Home Grounds:</strong> <span style="color: var(--brand-dark);">${t.homeGround}</span>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="${t.website}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: 0.9rem;">
              Visit Official Club Portal ↗
            </a>
            <a href="${t.website}/matches" target="_blank" rel="noopener" class="btn btn-outline" style="font-size: 0.9rem;">
              Match Scorecards ↗
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  `;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Participating Teams — Atal Bihari Vajpayee Memorial Tournament",
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
    title: "The Founding Derby Teams (2) — Atal Bihari Vajpayee Memorial Tournament",
    description: "Official team directory for the ABV Memorial Tournament: Destroyers Cricket Club (DES) and Dread Eleven (DE) with emblems, statistics, and portals.",
    canonicalUrl: `${SITE_URL}/teams/`,
    activeNav: 'teams',
    bodyContent: content,
    structuredData
  });

  fs.writeFileSync(path.join(rootDir, 'teams/index.html'), html, 'utf-8');
  console.log('Built: teams/index.html (RDCA UI)');
}

// 3. Generate Matches Page (matches/index.html)
function buildMatchesPage() {
  ensureDir(path.join(rootDir, 'matches'));

  const content = `
  <div class="page-head-banner">
    <div class="container">
      <div class="breadcrumbs">
        <ol>
          <li><a href="/">Home</a></li>
          <li aria-current="page">Matches &amp; Scorecards</li>
        </ol>
      </div>
      <h1>Official Match Center &amp; Fixtures</h1>
      <p>
        Centralized match records, ball-by-ball commentary, and live digital scorecards for the Atal Bihari Vajpayee Memorial Tournament are officially administered on the RDCA Central Portal.
      </p>
    </div>
  </div>

  <div class="container">
    <div class="card card-official" style="padding: 2rem; margin-bottom: 3rem;">
      <span class="badge badge-completed" style="margin-bottom: 0.75rem;">Official Central Integration</span>
      <h2 style="font-family: var(--serif); font-size: 1.6rem; color: var(--brand-dark); margin: 0.35rem 0 0.75rem;">
        Why Match Telemetry is Hosted on RDCA Central
      </h2>
      <p style="color: #404040; line-height: 1.7; max-width: 70ch; margin-bottom: 1.5rem;">
        In accordance with MPCA electronic scoring guidelines and RDCA statutory rules, all live scoring, electronic match sheets, umpire disciplinary logs, and ball-by-ball telemetry are maintained directly on the Rewa Division Cricket Association Central Web Infrastructure.
      </p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="btn btn-primary">
          &#127942; ABV Tournament on RDCA ↗
        </a>
        <a href="https://rewa-cricket-division.vercel.app/matches/" target="_blank" rel="noopener" class="btn btn-outline">
          RDCA All Matches Central ↗
        </a>
      </div>
    </div>

    <!-- Participating Clubs Match Centers -->
    <section class="section" style="margin-top: 0; margin-bottom: 3rem;">
      <div class="section-title">
        <h2>Club-Specific Match Centers</h2>
        <span class="card-meta">Official portals of the participating clubs</span>
      </div>

      <div class="grid grid-2">
        <div class="card" style="padding: 1.75rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 54px; height: 54px; background: var(--brand-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #3b82f6;">
              <img src="/public/images/des.svg" alt="DES" width="36" height="36">
            </div>
            <div>
              <h3 style="font-family: var(--serif); font-size: 1.3rem; color: var(--brand-dark); margin: 0;">Destroyers CC</h3>
              <small style="color: var(--brand); font-weight: 600;">3-Time Reigning Champions</small>
            </div>
          </div>
          <p style="color: #404040; font-size: 0.925rem; line-height: 1.6; margin-bottom: 1.25rem;">
            Review Destroyers CC match scorecards, player wagon wheels, bowling telemetry, and 2021&ndash;2026 rivalry records against Dread Eleven.
          </p>
          <a href="https://destroyers-rewacricket.pages.dev/matches/" target="_blank" rel="noopener" class="btn btn-primary" style="width: 100%; justify-content: center;">
            Destroyers Match Center ↗
          </a>
        </div>

        <div class="card" style="padding: 1.75rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 54px; height: 54px; background: var(--brand-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ef4444;">
              <img src="/public/images/de.svg" alt="DE" width="36" height="36">
            </div>
            <div>
              <h3 style="font-family: var(--serif); font-size: 1.3rem; color: var(--brand-dark); margin: 0;">Dread Eleven CC</h3>
              <small style="color: #b91c1c; font-weight: 600;">3-Time Former Champions</small>
            </div>
          </div>
          <p style="color: #404040; font-size: 0.925rem; line-height: 1.6; margin-bottom: 1.25rem;">
            Inspect Dread Eleven match logs, ball-by-ball analysis, batting charts, and complete 2021&ndash;2026 tournament statistics.
          </p>
          <a href="https://dread-eleven-rewacricket.pages.dev/matches/" target="_blank" rel="noopener" class="btn btn-outline" style="width: 100%; justify-content: center;">
            Dread Eleven Match Center ↗
          </a>
        </div>
      </div>
    </section>
  </div>
  `;

  const html = renderHtmlPage({
    title: "Official Match Center & RDCA Redirect — Atal Bihari Vajpayee Memorial Tournament",
    description: "Match fixtures, scorecards, and live scoring for the Atal Bihari Vajpayee Memorial Tournament, officially maintained on the RDCA Central Portal.",
    canonicalUrl: `${SITE_URL}/matches/`,
    activeNav: 'matches',
    bodyContent: content
  });

  fs.writeFileSync(path.join(rootDir, 'matches/index.html'), html, 'utf-8');
  console.log('Built: matches/index.html (RDCA UI)');
}

// 4. Generate Rules Index Page (rules/index.html)
function buildRulesIndexPage() {
  ensureDir(path.join(rootDir, 'rules'));

  const content = `
  <div class="page-head-banner">
    <div class="container">
      <div class="breadcrumbs">
        <ol>
          <li><a href="/">Home</a></li>
          <li aria-current="page">Rules &amp; Regulations</li>
        </ol>
      </div>
      <h1>Tournament Regulations &amp; Rules Handbook</h1>
      <p>
        Comprehensive governance codes, playing conditions, integrity directives, and administrative regulations governing the Atal Bihari Vajpayee Memorial Tournament. All participants, officials, and clubs are subject to these 14 regulatory articles.
      </p>
      <div style="margin-top: 1.25rem;">
        <input type="search" id="rulesSearch" class="search-control" placeholder="Search regulations by title, clause, or category..." aria-label="Search regulations">
      </div>
    </div>
  </div>

  <div class="container">
    <div class="grid grid-3" style="margin-bottom: 3rem;">
      ${rules.map(r => `
        <div class="card rule-card" style="display: flex; flex-direction: column;">
          <div style="margin-bottom: 0.35rem;">
            <span class="badge badge-completed rule-category">${r.category}</span>
          </div>
          <h2 class="rule-title" style="font-family: var(--serif); font-size: 1.2rem; color: var(--brand-dark); margin: 0.35rem 0 0.5rem;">
            ${r.title}
          </h2>
          <p class="rule-summary" style="color: var(--muted); font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem; flex: 1;">
            ${r.summary}
          </p>
          <div style="margin-bottom: 1rem; font-size: 0.8rem; color: #404040;">
            <strong>Key Articles:</strong>
            <ul style="list-style: none; margin-top: 0.25rem;">
              ${r.clauses.slice(0, 3).map(c => `<li>&bull; ${c.clause}</li>`).join('')}
            </ul>
          </div>
          <a href="/rules/${r.id}/" style="font-weight: 600; font-size: 0.875rem;">
            Read Full ${r.clauses.length} Clauses &rarr;
          </a>
        </div>
      `).join('')}
    </div>
  </div>
  `;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "14 Official Regulations — Atal Bihari Vajpayee Memorial Tournament",
    "itemListElement": rules.map((r, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": r.title,
      "url": `${SITE_URL}/rules/${r.id}/`
    }))
  };

  const html = renderHtmlPage({
    title: "14 Official Tournament Regulations & Rules — Atal Bihari Vajpayee Memorial Tournament",
    description: "Official 14 regulatory policies of the ABV Memorial Tournament: Anti-Corruption, Anti-Doping, Playing Conditions, PMOA, Code of Conduct, and Equipment.",
    canonicalUrl: `${SITE_URL}/rules/`,
    activeNav: 'rules',
    bodyContent: content,
    structuredData
  });

  fs.writeFileSync(path.join(rootDir, 'rules/index.html'), html, 'utf-8');
  console.log('Built: rules/index.html (RDCA UI)');
}

// 5. Generate Individual Rule Pages (rules/[rule-id]/index.html)
function buildIndividualRulePages() {
  rules.forEach(rule => {
    const dir = path.join(rootDir, 'rules', rule.id);
    ensureDir(dir);

    const sidebarNav = `
      <aside class="card policy-sidebar" aria-label="Regulations Directory">
        <div class="policy-sidebar-title">All 14 Regulations</div>
        <ul>
          ${rules.map(r => `
            <li>
              <a href="/rules/${r.id}/" class="${r.id === rule.id ? 'active' : ''}">
                ${r.title}
              </a>
            </li>
          `).join('')}
        </ul>
      </aside>
    `;

    const content = `
    <div class="page-head-banner">
      <div class="container">
        <div class="breadcrumbs">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/rules/">Rules &amp; Regulations</a></li>
            <li aria-current="page">${rule.title}</li>
          </ol>
        </div>
        <h1>${rule.title}</h1>
        <div style="font-size: 0.85rem; color: var(--muted); margin-top: 0.4rem;">
          Category: <strong style="color: var(--brand);">${rule.category}</strong> &bull; Effective: <strong>${rule.effectiveDate}</strong> &bull; Governance: <strong>RDCA &amp; MPCA Disciplinary Board</strong>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="policy-layout" style="margin-bottom: 3rem;">
        ${sidebarNav}

        <article class="card" style="padding: 2rem;">
          <div style="background: var(--brand-light); border-left: 4px solid var(--brand); padding: 1rem 1.25rem; border-radius: var(--radius); margin-bottom: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.1rem; color: var(--brand-dark); margin-bottom: 0.25rem;">Policy Overview</h2>
            <p style="color: #333; font-size: 0.95rem; line-height: 1.6; margin: 0;">
              ${rule.summary}
            </p>
          </div>

          <div>
            ${rule.clauses.map(c => `
              <div class="clause-item">
                <h3>${c.clause}</h3>
                <p>${c.content}</p>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <small style="color: var(--muted);">Questions regarding this regulation?</small><br>
              <a href="/contact/" style="font-weight: 600;">Contact Disciplinary Secretariat &rarr;</a>
            </div>
            <a href="/rules/" class="btn btn-outline" style="font-size: 0.85rem;">
              &larr; Back to All Rules
            </a>
          </div>
        </article>
      </div>
    </div>
    `;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Legislation",
      "name": rule.title,
      "legislationType": "Tournament Regulation",
      "description": rule.summary,
      "datePublished": rule.effectiveDate,
      "publisher": {
        "@type": "SportsOrganization",
        "name": "Atal Bihari Vajpayee Memorial Tournament Governing Council"
      }
    };

    const html = renderHtmlPage({
      title: `${rule.title} — Atal Bihari Vajpayee Memorial Tournament Rules`,
      description: rule.summary.slice(0, 155),
      canonicalUrl: `${SITE_URL}/rules/${rule.id}/`,
      activeNav: 'rules',
      bodyContent: content,
      structuredData
    });

    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
    console.log(`Built: rules/${rule.id}/index.html (RDCA UI)`);
  });
}

// 6. Generate Governing Council Page (governing-council/index.html)
function buildGoverningCouncilPage() {
  ensureDir(path.join(rootDir, 'governing-council'));

  const council = tournament.governingCouncil;

  const content = `
  <div class="page-head-banner">
    <div class="container">
      <div class="breadcrumbs">
        <ol>
          <li><a href="/">Home</a></li>
          <li aria-current="page">Governing Council</li>
        </ol>
      </div>
      <h1>Governing Council &amp; Leadership</h1>
      <p>
        The Governing Council represents the supreme executive and technical authority overseeing the Atal Bihari Vajpayee Memorial Tournament. Operating under the constitution of Rewa Division Cricket Association and MPCA.
      </p>
    </div>
  </div>

  <div class="container">
    <div class="grid grid-4" style="margin-bottom: 2.5rem;">
      ${council.map(c => `
        <div class="card" style="border-left: 3px solid var(--accent); padding: 1.25rem;">
          <div style="font-size: 0.725rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--brand); font-weight: 700; margin-bottom: 0.25rem;">
            ${c.role}
          </div>
          <h2 style="font-family: var(--serif); font-size: 1.2rem; color: var(--brand-dark); margin: 0.2rem 0;">${c.name}</h2>
          <div style="font-size: 0.8rem; color: var(--muted);">${c.affiliation}</div>
        </div>
      `).join('')}
    </div>

    <!-- Administrative Mandate Card -->
    <div class="card card-official" style="padding: 1.75rem; margin-bottom: 3rem;">
      <h2 style="font-family: var(--serif); font-size: 1.4rem; color: var(--brand-dark); margin-bottom: 0.5rem;">
        Council Mandate &amp; Powers
      </h2>
      <p style="color: #404040; line-height: 1.6; margin-bottom: 1rem;">
        The Atal Bihari Vajpayee Memorial Tournament Governing Council is entrusted with:
      </p>
      <ul style="color: #404040; margin-left: 1.5rem; line-height: 1.7; font-size: 0.95rem;">
        <li>Sanctioning participating club rosters, player contracts, and derby licensing for Destroyers CC and Dread Eleven.</li>
        <li>Appointment of certified BCCI and MPCA match referees, umpires, and Anti-Corruption liaison personnel.</li>
        <li>Jurisdiction over Level 3 and Level 4 disciplinary hearings and appeals under the Player Code of Conduct.</li>
        <li>Curatorial oversight of standard pitch preparations across APSU Stadium and Divisional Cricket Stadium Neem Chauraha.</li>
        <li>Management of commercial broadcast rights, media accreditation, and live data integrity.</li>
      </ul>
    </div>
  </div>
  `;

  const html = renderHtmlPage({
    title: "Governing Council — Atal Bihari Vajpayee Memorial Tournament",
    description: "Meet the executive governing council of the Atal Bihari Vajpayee Memorial Tournament: Patrons, Director, Chief Match Referee, and ACU integrity officers.",
    canonicalUrl: `${SITE_URL}/governing-council/`,
    activeNav: 'council',
    bodyContent: content
  });

  fs.writeFileSync(path.join(rootDir, 'governing-council/index.html'), html, 'utf-8');
  console.log('Built: governing-council/index.html (RDCA UI)');
}

// 7. Generate News Page (news/index.html)
function buildNewsPage() {
  ensureDir(path.join(rootDir, 'news'));

  const content = `
  <div class="page-head-banner">
    <div class="container">
      <div class="breadcrumbs">
        <ol>
          <li><a href="/">Home</a></li>
          <li aria-current="page">News &amp; Circulars</li>
        </ol>
      </div>
      <h1>Official News &amp; Circulars</h1>
      <p>
        Authorized circulars, match bulletins, governing council releases, and stadium announcements for the Atal Bihari Vajpayee Memorial Tournament.
      </p>
    </div>
  </div>

  <div class="container">
    <div class="grid grid-3" style="margin-bottom: 3rem;">
      ${news.map(n => `
        <div class="card" style="display: flex; flex-direction: column;">
          <div style="font-size: 0.75rem; color: var(--muted); margin-bottom: 0.35rem;">
            ${n.category} &bull; ${n.publishedAt}
          </div>
          <h2 style="font-family: var(--serif); font-size: 1.2rem; color: var(--brand-dark); margin-bottom: 0.5rem;">
            ${n.title}
          </h2>
          <p style="color: var(--muted); font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            ${n.summary}
          </p>
          <div style="font-size: 0.9rem; color: #404040; line-height: 1.6; margin-bottom: 1.25rem;">
            ${n.content}
          </div>
          <div style="margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--line); font-size: 0.75rem; color: var(--muted);">
            Issued by: <strong>${n.author || 'Tournament Media Bureau / RDCA Secretariat'}</strong>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  `;

  const html = renderHtmlPage({
    title: "Official News & Circulars — Atal Bihari Vajpayee Memorial Tournament",
    description: "Official press bulletins, circulars, and match reports from the Atal Bihari Vajpayee Memorial Tournament Governing Council in Rewa.",
    canonicalUrl: `${SITE_URL}/news/`,
    activeNav: 'news',
    bodyContent: content
  });

  fs.writeFileSync(path.join(rootDir, 'news/index.html'), html, 'utf-8');
  console.log('Built: news/index.html (RDCA UI)');
}

// 8. Generate Contact Page (contact/index.html)
function buildContactPage() {
  ensureDir(path.join(rootDir, 'contact'));

  const c = tournament.contact;

  const content = `
  <div class="page-head-banner">
    <div class="container">
      <div class="breadcrumbs">
        <ol>
          <li><a href="/">Home</a></li>
          <li aria-current="page">Contact Us</li>
        </ol>
      </div>
      <h1>Official Headquarters &amp; Contact</h1>
      <p>
        Administrative contact directories for the Atal Bihari Vajpayee Memorial Tournament, Rewa Division Cricket Association, and Madhya Pradesh Cricket Association.
      </p>
    </div>
  </div>

  <div class="container">
    <div class="grid grid-2" style="margin-bottom: 3rem;">
      <div class="card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; color: var(--brand-dark); margin-bottom: 1rem; border-bottom: 1px solid var(--line); padding-bottom: 0.5rem;">
          Tournament Venue &amp; Local RDCA
        </h2>
        <div class="contact-item">
          <strong>Stadium Venue:</strong>
          <div>
            <strong>${c.stadiumName}</strong><br>
            ${c.locality}<br>
            ${c.city}, ${c.state} &ndash; ${c.pincode}<br>
            <small style="color: var(--brand); font-weight: 600;">Landmark: ${c.landmark}</small>
          </div>
        </div>
        <div class="contact-item">
          <strong>RDCA Headquarters:</strong>
          <div>${c.rdcaOffice}</div>
        </div>
        <div class="contact-item">
          <strong>Telephone:</strong>
          <div>
            ${c.rdcaPhones.map(p => `<a href="tel:${p.replace(/\s/g, '')}">${p}</a>`).join(' &bull; ')}
          </div>
        </div>
        <div class="contact-item">
          <strong>Official Email:</strong>
          <div>
            <a href="mailto:${c.rdcaEmail}">${c.rdcaEmail}</a><br>
            <a href="mailto:${c.email}">${c.email}</a>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; color: var(--brand-dark); margin-bottom: 1rem; border-bottom: 1px solid var(--line); padding-bottom: 0.5rem;">
          Madhya Pradesh Cricket Association (MPCA)
        </h2>
        <div class="contact-item">
          <strong>State Office:</strong>
          <div>${c.mpcaOffice}</div>
        </div>
        <div class="contact-item">
          <strong>MPCA Phones:</strong>
          <div>
            ${c.mpcaPhones.map(p => `<a href="tel:${p.replace(/\s/g, '')}">${p}</a>`).join(' &bull; ')}
          </div>
        </div>
        <div class="contact-item">
          <strong>MPCA Email:</strong>
          <div><a href="mailto:${c.mpcaEmail}">${c.mpcaEmail}</a></div>
        </div>
        <div class="contact-item">
          <strong>MPCA Portal:</strong>
          <div><a href="https://www.mpcaonline.com" target="_blank" rel="noopener">www.mpcaonline.com ↗</a></div>
        </div>

        <div class="hotline-box">
          <strong>Anti-Corruption &amp; Integrity Helpline:</strong><br>
          Direct telephone: <a href="tel:+917662250011" style="font-weight: 700; color: #7f1d1d;">${c.antiCorruptionHotline}</a><br>
          <small>Confidential reporting of corrupt approaches or match fixing concerns. Available 24 hours daily.</small>
        </div>
      </div>
    </div>
  </div>
  `;

  const html = renderHtmlPage({
    title: "Official Contact & Stadium Address — Atal Bihari Vajpayee Memorial Tournament",
    description: "Contact the Atal Bihari Vajpayee Memorial Tournament: Divisional Cricket Stadium Neem Chauraha Rewa, MPCA phone numbers, RDCA office, and ACU hotline.",
    canonicalUrl: `${SITE_URL}/contact/`,
    activeNav: 'contact',
    bodyContent: content
  });

  fs.writeFileSync(path.join(rootDir, 'contact/index.html'), html, 'utf-8');
  console.log('Built: contact/index.html (RDCA UI)');
}

// 9. Generate 404 Page (404.html)
function build404Page() {
  const content = `
  <section class="hero" style="min-height: 50vh; display: flex; align-items: center;">
    <div class="container">
      <p class="eyebrow">Error 404 &bull; Page Not Found</p>
      <h1>Innings Concluded</h1>
      <p>
        The page or tournament document you requested does not exist or has been relocated within the official archives.
      </p>
      <div class="hero-actions">
        <a href="/" class="btn btn-primary">&larr; Return to Tournament Home</a>
        <a href="/rules/" class="btn btn-ghost">Official Regulations</a>
        <a href="/teams/" class="btn btn-ghost">The Derby Teams</a>
      </div>
    </div>
  </section>
  `;

  const html = renderHtmlPage({
    title: "Page Not Found (404) — Atal Bihari Vajpayee Memorial Tournament",
    description: "The requested tournament document was not found. Please return to the official Atal Bihari Vajpayee Memorial Tournament portal.",
    canonicalUrl: `${SITE_URL}/404.html`,
    bodyContent: content
  });

  fs.writeFileSync(path.join(rootDir, '404.html'), html, 'utf-8');
  console.log('Built: 404.html (RDCA UI)');
}

// 10. Generate Sitemap XML (sitemap.xml)
function buildSitemap() {
  const pages = [
    '',
    'teams/',
    'matches/',
    'rules/',
    ...rules.map(r => `rules/${r.id}/`),
    'governing-council/',
    'news/',
    'contact/'
  ];

  const now = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${SITE_URL}/${p}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p === '' || p === 'matches/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p === '' ? '1.0' : p.startsWith('rules/') ? '0.8' : '0.9'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml, 'utf-8');
  console.log('Built: sitemap.xml');
}

// 11. Generate Robots TXT (robots.txt)
function buildRobotsTxt() {
  const content = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# LLMs.txt AI Model Context
# Discoverable at ${SITE_URL}/llms.txt and ${SITE_URL}/llms-full.txt
`;
  fs.writeFileSync(path.join(rootDir, 'robots.txt'), content, 'utf-8');
  console.log('Built: robots.txt');
}

// 12. Generate LLMS.txt and LLMS-full.txt
function buildLlmsTxt() {
  const llmsTxt = `# Atal Bihari Vajpayee Memorial Tournament
> Official invitational cricket championship of Vindhya Pradesh, sanctioned by Rewa Division Cricket Association (RDCA) and affiliated with Madhya Pradesh Cricket Association (MPCA).

## Overview
- **Championship**: Atal Bihari Vajpayee Memorial Tournament (ABV Memorial Trophy)
- **Circuit**: Rewa Division Cricket Association (RDCA) & Madhya Pradesh Cricket Association (MPCA)
- **Reigning Champions (2026)**: Destroyers Cricket Club (Captain: Pranav Dwivedi)
- **Rival Club**: Dread Eleven Cricket Club (Captain: Akhil Mishra)
- **Venues**: Divisional Cricket Stadium, Neem Chauraha, Boda Bagh Road, Rewa, MP 486001 & APSU Stadium, Rewa
- **Official Network**:
  - Rewa Division Cricket Association (RDCA): https://rewa-cricket-division.vercel.app
  - Destroyers Cricket Club (DES): https://destroyers-rewacricket.pages.dev
  - Dread Eleven (DE): https://dread-eleven-rewacricket.pages.dev
  - ABV Memorial Tournament (Official Portal): ${SITE_URL}

## Core Sections
- [Championship Portal](${SITE_URL}/): Complete tournament overview, telemetry, past winners, and champions.
- [The Derby Teams (2)](${SITE_URL}/teams/): The 2 founding clubs: Destroyers CC and Dread Eleven with all-time head-to-head records.
- [Matches & Scorecards](${SITE_URL}/matches/): Official match hub redirecting to central RDCA ball-by-ball system.
- [14 Regulatory Policies](${SITE_URL}/rules/): Official codes including Anti-Corruption, Anti-Doping, and Playing Conditions.
- [Governing Council](${SITE_URL}/governing-council/): Executive leadership, technical committee, and anti-corruption officers.
- [News & Circulars](${SITE_URL}/news/): Official press statements and tournament notices.
- [Contact & Venues](${SITE_URL}/contact/): Divisional Cricket Stadium Neem Chauraha Rewa, MPCA phone numbers (+91 731 2543602), RDCA office, and ACU helpline (+91 7662 250011).

## 14 Official Regulations
${rules.map(r => `- [${r.title}](${SITE_URL}/rules/${r.id}/): ${r.summary}`).join('\n')}
`;

  fs.writeFileSync(path.join(rootDir, 'llms.txt'), llmsTxt, 'utf-8');
  console.log('Built: llms.txt');

  let llmsFull = `${llmsTxt}

## Complete 14 Governance Policies Clauses

`;
  rules.forEach(r => {
    llmsFull += `### ${r.title} (${r.category})
Effective Date: ${r.effectiveDate}

`;
    r.clauses.forEach(c => {
      llmsFull += `#### ${c.clause}
${c.content}

`;
    });
  });

  fs.writeFileSync(path.join(rootDir, 'llms-full.txt'), llmsFull, 'utf-8');
  console.log('Built: llms-full.txt');
}

// 13. Generate Web App Manifest (manifest.json)
function buildManifest() {
  const manifest = {
    "name": "Atal Bihari Vajpayee Memorial Tournament",
    "short_name": "ABV Trophy",
    "description": "Official portal of the Atal Bihari Vajpayee Memorial Tournament in Rewa, Madhya Pradesh.",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#08301f",
    "theme_color": "#0e5a3a",
    "icons": [
      {
        "src": "/public/images/trophy.svg",
        "sizes": "192x192 512x512",
        "type": "image/svg+xml"
      }
    ]
  };

  fs.writeFileSync(path.join(rootDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Built: manifest.json');
}

// 14. Master Build Pipeline
function buildAll() {
  console.log('Starting static build for abv-rewacricket (RDCA UI)...');
  buildHomePage();
  buildTeamsPage();
  buildMatchesPage();
  buildRulesIndexPage();
  buildIndividualRulePages();
  buildGoverningCouncilPage();
  buildNewsPage();
  buildContactPage();
  build404Page();
  buildSitemap();
  buildRobotsTxt();
  buildLlmsTxt();
  buildManifest();
  console.log('Static build completed successfully with RDCA UI!');
}

buildAll();
