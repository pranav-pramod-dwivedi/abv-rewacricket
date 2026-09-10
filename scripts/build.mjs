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
    <div class="container top-bar-inner">
      <div>
        <span>Official Portal of Atal Bihari Vajpayee Memorial Tournament &bull; Sanctioned by RDCA &amp; MPCA</span>
      </div>
      <div class="top-bar-links">
        <a href="${SITE_URL}/rules/anti-corruption/">ACU Integrity Hotline: +91 7662 250011</a>
        <a href="https://rewa-cricket-division.vercel.app" target="_blank" rel="noopener">RDCA Central Portal &rarr;</a>
      </div>
    </div>
  </div>
  <header class="site-header">
    <div class="container nav-inner">
      <a href="${SITE_URL}/" class="brand" aria-label="ABV Memorial Tournament Home">
        <div class="brand-emblem">
          <img src="${SITE_URL}/public/images/trophy.svg" alt="ABV Trophy Emblem" width="26" height="26">
        </div>
        <div class="brand-text">
          <div class="brand-title">ABV Memorial Tournament</div>
          <div class="brand-sub">Rewa Divisional Cricket &bull; MPCA</div>
        </div>
      </a>
      <button class="mobile-toggle" aria-label="Toggle Navigation Menu" aria-expanded="false">&#9776;</button>
      <nav>
        <ul class="nav-links">
          <li><a href="${SITE_URL}/" class="nav-link ${activeNav === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="${SITE_URL}/teams/" class="nav-link ${activeNav === 'teams' ? 'active' : ''}">Teams</a></li>
          <li><a href="${SITE_URL}/matches/" class="nav-link ${activeNav === 'matches' ? 'active' : ''}">Matches</a></li>
          <li><a href="${SITE_URL}/rules/" class="nav-link ${activeNav === 'rules' ? 'active' : ''}">Rules &amp; Regulations</a></li>
          <li><a href="${SITE_URL}/governing-council/" class="nav-link ${activeNav === 'council' ? 'active' : ''}">Governing Council</a></li>
          <li><a href="${SITE_URL}/news/" class="nav-link ${activeNav === 'news' ? 'active' : ''}">News</a></li>
          <li><a href="${SITE_URL}/contact/" class="nav-link ${activeNav === 'contact' ? 'active' : ''}">Contact</a></li>
          <li><a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="nav-cta">RDCA Live Match Center &rarr;</a></li>
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
      <div class="footer-grid">
        <div class="footer-col">
          <h4>Atal Bihari Vajpayee Memorial Tournament</h4>
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
            The premier invitational cricket championship of Vindhya Pradesh, honoring former Prime Minister Shri Atal Bihari Vajpayee. Officially sanctioned by the Rewa Division Cricket Association (RDCA) and affiliated with Madhya Pradesh Cricket Association (MPCA).
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="champions-stats-badge" style="background: rgba(217, 119, 6, 0.15); border-color: var(--accent-gold); color: var(--accent-gold-light);">RDCA Affiliated</span>
            <span class="champions-stats-badge">MPCA Governance</span>
            <span class="champions-stats-badge" style="background: rgba(59, 130, 246, 0.15); border-color: #3b82f6; color: #93c5fd;">BCCI Code Compliant</span>
          </div>
        </div>

        <div class="footer-col">
          <h4>Tournament Navigation</h4>
          <ul>
            <li><a href="${SITE_URL}/">Championship Overview</a></li>
            <li><a href="${SITE_URL}/teams/">Participating Teams (12)</a></li>
            <li><a href="${SITE_URL}/matches/">Matches &amp; RDCA Redirect</a></li>
            <li><a href="${SITE_URL}/rules/">14 Regulatory Policies</a></li>
            <li><a href="${SITE_URL}/governing-council/">Governing Council</a></li>
            <li><a href="${SITE_URL}/news/">Official Press &amp; Circulars</a></li>
            <li><a href="${SITE_URL}/contact/">Headquarters &amp; Contact</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Key Regulations</h4>
          <ul>
            <li><a href="${SITE_URL}/rules/anti-corruption/">Anti-Corruption Code</a></li>
            <li><a href="${SITE_URL}/rules/anti-doping/">Anti-Doping Code</a></li>
            <li><a href="${SITE_URL}/rules/match-playing-conditions/">Match Playing Conditions</a></li>
            <li><a href="${SITE_URL}/rules/suspected-illegal-action/">Illegal Bowling Action</a></li>
            <li><a href="${SITE_URL}/rules/pmoa-minimum-standards/">PMOA Protocol</a></li>
            <li><a href="${SITE_URL}/rules/code-of-conduct-players/">Player Code of Conduct</a></li>
            <li><a href="${SITE_URL}/rules/ticket-terms-and-conditions/">Ticket Terms</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Administrative Contacts</h4>
          <p style="color: var(--text-secondary); margin-bottom: 0.75rem;">
            <strong>Rewa Venue:</strong><br>
            Divisional Cricket Stadium, Neem Chauraha, Boda Bagh Road, Rewa, MP 486001 (Near Neem Chauraha Hanuman Mandir)
          </p>
          <p style="color: var(--text-secondary); margin-bottom: 0.75rem;">
            <strong>MPCA Phones:</strong><br>
            +91 731 2543602 &bull; +91 731 2434575
          </p>
          <p style="color: var(--text-secondary); margin-bottom: 0.75rem;">
            <strong>RDCA Phone:</strong> +91 7662 250000<br>
            <strong>ACU Hotline:</strong> +91 7662 250011
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          &copy; 2021&ndash;2026 Atal Bihari Vajpayee Memorial Tournament Committee &bull; All Rights Reserved.
        </div>
        <div style="display: flex; gap: 1rem;">
          <a href="${SITE_URL}/rules/image-use-terms/">Image Terms</a>
          <a href="${SITE_URL}/rules/media-accreditation/">Media Terms</a>
          <a href="${SITE_URL}/rules/news-access-regulations/">News Access</a>
          <a href="${SITE_URL}/llms.txt">LLMs.txt</a>
          <a href="${SITE_URL}/sitemap.xml">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
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

  <link rel="icon" type="image/svg+xml" href="${SITE_URL}/public/images/trophy.svg">
  <link rel="manifest" href="${SITE_URL}/manifest.json">
  <link rel="stylesheet" href="${SITE_URL}/public/css/styles.css">
  <script defer src="${SITE_URL}/public/js/app.js"></script>
  ${jsonLd}
</head>
<body>
  ${renderHeader(activeNav)}
  <main>
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
      <div class="hero-badge">Official Tournament Portal &bull; Season 2021&ndash;2026</div>
      <h1 class="hero-title">Atal Bihari Vajpayee <span>Memorial Tournament</span></h1>
      <p class="hero-lead">
        The premier invitational cricket championship of Vindhya Pradesh, sanctioned under the auspices of Rewa Division Cricket Association (RDCA) and Madhya Pradesh Cricket Association (MPCA).
      </p>
      <div class="hero-actions">
        <a href="${SITE_URL}/matches/" class="btn btn-primary">Live Match Center &rarr;</a>
        <a href="${SITE_URL}/teams/" class="btn btn-outline">Participating Teams (12)</a>
        <a href="${SITE_URL}/rules/" class="btn btn-outline">14 Official Regulations</a>
      </div>
    </div>
  </section>

  <div class="container" style="padding-top: 2rem;">
    <!-- 2026 Winners Showcase Banner -->
    <section class="champions-banner" aria-labelledby="champions-title">
      <div class="champions-header">
        <div class="champions-tag">
          <img src="${SITE_URL}/public/images/trophy.svg" alt="Trophy" width="20" height="20">
          Reigning Champions &bull; 2026 Title Holders
        </div>
        <div>
          <span class="champions-stats-badge">3 Consecutive Titles (2024, 2025, 2026)</span>
        </div>
      </div>
      <div class="champions-grid">
        <div class="champions-meta">
          <h2 id="champions-title" style="font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">${w26.champion}</h2>
          <p class="champions-detail">
            <strong>Captain:</strong> ${w26.captain} &bull; <strong>Final Result:</strong> ${w26.seriesResult}
          </p>
          <p class="champions-detail" style="color: var(--text-primary); font-weight: 600;">
            ${w26.finalScore}
          </p>
          <p style="color: var(--text-secondary); margin-bottom: 1.25rem;">
            ${w26.summary}
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
              Visit Destroyers CC Portal &rarr;
            </a>
            <a href="${SITE_URL}/matches/" class="btn btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
              Match Scorecard Notice
            </a>
          </div>
        </div>

        <div class="champions-trophy-display">
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; margin: 0 auto 0.75rem; background: #0c1626; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #3b82f6;">
              <img src="${SITE_URL}/public/images/des.svg" alt="Destroyers CC Emblem" width="50" height="50">
            </div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">Destroyers CC</div>
            <div style="font-size: 0.75rem; color: var(--accent-gold-light);">Champions (164/7)</div>
          </div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-muted);">DEF.</div>
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; margin: 0 auto 0.75rem; background: #0c1626; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ef4444;">
              <img src="${SITE_URL}/public/images/de.svg" alt="Dread Eleven Emblem" width="50" height="50">
            </div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">Dread Eleven</div>
            <div style="font-size: 0.75rem; color: #fca5a5;">Runners-up (152/9)</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Season in Numbers -->
    <section class="section" style="border: none; padding: 0 0 3.5rem;">
      <div class="section-header">
        <div>
          <h2 class="section-title">Season in Numbers (2021&ndash;2026)</h2>
          <p class="section-subtitle">Aggregated statistical telemetry across 6 editions of the ABV Memorial Tournament</p>
        </div>
      </div>

      <div class="telemetry-grid">
        <div class="telemetry-card">
          <div class="telemetry-number">${num.matchesPlayed}</div>
          <div class="telemetry-label">Matches Contested</div>
          <div class="telemetry-sub">Across 6 editions</div>
        </div>
        <div class="telemetry-card">
          <div class="telemetry-number">${num.runsScored.toLocaleString()}</div>
          <div class="telemetry-label">Total Runs Scored</div>
          <div class="telemetry-sub">Batting strike rate 138.4</div>
        </div>
        <div class="telemetry-card">
          <div class="telemetry-number">${num.wicketsFallen}</div>
          <div class="telemetry-label">Wickets Fallen</div>
          <div class="telemetry-sub">14.6 wkts per match avg</div>
        </div>
        <div class="telemetry-card">
          <div class="telemetry-number">${num.boundaries.fours} / ${num.boundaries.sixes}</div>
          <div class="telemetry-label">Fours / Sixes</div>
          <div class="telemetry-sub">1,258 boundary hits</div>
        </div>
        <div class="telemetry-card">
          <div class="telemetry-number">${num.centuries} / ${num.fifties}</div>
          <div class="telemetry-label">Centuries / Fifties</div>
          <div class="telemetry-sub">High: ${num.highestTeamTotal.split(' ')[0]}</div>
        </div>
        <div class="telemetry-card">
          <div class="telemetry-number">${num.bestBowlingFigures.split(' ')[0]}</div>
          <div class="telemetry-label">Best Bowling Figures</div>
          <div class="telemetry-sub">${num.bestBowlingFigures.split('(')[1].replace(')', '')}</div>
        </div>
      </div>
    </section>

    <!-- Official Matches Redirect Notice Card -->
    <section class="matches-redirect-box">
      <div class="matches-redirect-grid">
        <div>
          <span class="champions-stats-badge" style="margin-bottom: 0.75rem;">Central RDCA Integration</span>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 0.6rem;">Match Fixtures &amp; Live Scorecards</h2>
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
            Pursuant to tournament regulation and MPCA governance directives, all official match scores, ball-by-ball commentary, match referee reports, and player performance logs are centrally hosted on the <strong>Rewa Division Cricket Association (RDCA) Central Server</strong>.
          </p>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            Select one of the official portals below to view detailed match summaries, live telemetry, and player scorecards.
          </p>
        </div>
        <div class="redirect-action-cards">
          <a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="redirect-card">
            <h4>ABV Tournament on RDCA <span>&rarr;</span></h4>
            <p>Official tournament hub &amp; tournament standings</p>
          </a>
          <a href="https://rewa-cricket-division.vercel.app/matches/" target="_blank" rel="noopener" class="redirect-card">
            <h4>RDCA Matches Central <span>&rarr;</span></h4>
            <p>All divisional matches &amp; live ball-by-ball center</p>
          </a>
          <a href="${SITE_URL}/matches/" class="redirect-card" style="border-color: var(--accent-gold);">
            <h4>Tournament Match Directory <span>&rarr;</span></h4>
            <p>View complete tournament matches overview</p>
          </a>
        </div>
      </div>
    </section>

    <!-- Top Performers (Batting & Bowling) -->
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">All-Time Top Performers</h2>
          <p class="section-subtitle">Leading run scorers and wicket takers in ABV Memorial Tournament history (2021&ndash;2026)</p>
        </div>
      </div>

      <div class="performer-grid">
        <!-- Batting Leaders -->
        <div class="performer-card">
          <div class="performer-card-header">
            <h3>Leading Run Scorers</h3>
            <span style="font-size: 0.8rem; color: var(--accent-gold-light); font-weight: 600;">Batting Aggregate</span>
          </div>
          <div class="table-wrapper" style="border: none; border-radius: 0;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Batsman</th>
                  <th>Team</th>
                  <th>Runs</th>
                  <th>Avg</th>
                  <th>SR</th>
                  <th>HS</th>
                </tr>
              </thead>
              <tbody>
                ${topBat.map(b => `
                  <tr>
                    <td><strong>${b.rank}</strong></td>
                    <td class="highlight-gold">${b.name}</td>
                    <td>${b.team}</td>
                    <td><strong>${b.runs}</strong></td>
                    <td>${b.average}</td>
                    <td>${b.strikeRate}</td>
                    <td>${b.highestScore}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bowling Leaders -->
        <div class="performer-card">
          <div class="performer-card-header">
            <h3>Leading Wicket Takers</h3>
            <span style="font-size: 0.8rem; color: var(--accent-gold-light); font-weight: 600;">Bowling Aggregate</span>
          </div>
          <div class="table-wrapper" style="border: none; border-radius: 0;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bowler</th>
                  <th>Team</th>
                  <th>Wkts</th>
                  <th>Avg</th>
                  <th>Econ</th>
                  <th>BBI</th>
                </tr>
              </thead>
              <tbody>
                ${topBowl.map(w => `
                  <tr>
                    <td><strong>${w.rank}</strong></td>
                    <td class="highlight-gold">${w.name}</td>
                    <td>${w.team}</td>
                    <td><strong>${w.wickets}</strong></td>
                    <td>${w.average}</td>
                    <td>${w.economy}</td>
                    <td>${w.bestBowling}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Past Winners Roll of Honour -->
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Championship Roll of Honour (2021&ndash;2026)</h2>
          <p class="section-subtitle">Complete edition-by-edition record of champions and runners-up</p>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Champion</th>
              <th>Winning Captain</th>
              <th>Runner-Up</th>
              <th>Series &amp; Final Outcome</th>
            </tr>
          </thead>
          <tbody>
            ${past.map(p => `
              <tr>
                <td><strong>${p.year}</strong></td>
                <td class="highlight-gold" style="font-weight: 700;">${p.winner}</td>
                <td>${p.captain}</td>
                <td>${p.runnerUp}</td>
                <td>${p.score}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Participating Teams Grid Preview -->
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Participating Teams &amp; Franchises</h2>
          <p class="section-subtitle">Premier domestic and franchise clubs affiliated with the tournament</p>
        </div>
        <a href="${SITE_URL}/teams/" class="btn btn-outline">View All 12 Teams &rarr;</a>
      </div>

      <div class="teams-grid">
        ${teams.slice(0, 6).map(t => `
          <div class="team-card" style="--team-accent: ${t.primaryColor};">
            <div class="team-logo-frame">
              <img src="${SITE_URL}/public/images/${t.id}.svg" alt="${t.name} Logo" width="54" height="54">
            </div>
            <h3 class="team-name">${t.name}</h3>
            <div class="team-city">${t.city}</div>
            <div class="team-titles">${t.titles}</div>
            <a href="${t.website}" target="_blank" rel="noopener" class="team-website-btn">
              Official Website &rarr;
            </a>
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 2rem;">
        <a href="${SITE_URL}/teams/" class="btn btn-primary">Browse All 12 Participating Teams (with logos &amp; websites) &rarr;</a>
      </div>
    </section>

    <!-- 14 Official Rules & Governance Regulations -->
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Official Rules &amp; Governance Regulations</h2>
          <p class="section-subtitle">Mandatory BCCI, MPCA, and RDCA compliance policies governing the championship</p>
        </div>
        <a href="${SITE_URL}/rules/" class="btn btn-outline">Read Full Regulatory Code &rarr;</a>
      </div>

      <div class="rules-grid">
        ${rules.slice(0, 6).map(r => `
          <div class="rule-card">
            <div class="rule-category">${r.category}</div>
            <h3 class="rule-title">${r.title}</h3>
            <p class="rule-summary">${r.summary}</p>
            <a href="${SITE_URL}/rules/${r.id}/" class="rule-link">Read Full Policy (${r.clauses.length} clauses) &rarr;</a>
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 2rem;">
        <a href="${SITE_URL}/rules/" class="btn btn-primary">Explore All 14 Official Regulatory Policies &rarr;</a>
      </div>
    </section>

    <!-- Latest News & Circulars -->
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Official Tournament Circulars &amp; News</h2>
          <p class="section-subtitle">Press bulletins, administrative notices, and official announcements</p>
        </div>
        <a href="${SITE_URL}/news/" class="btn btn-outline">View All News &rarr;</a>
      </div>

      <div class="news-grid">
        ${news.slice(0, 3).map(n => `
          <article class="news-card">
            <div class="news-meta">
              <span class="news-category">${n.category}</span>
              <span>${n.publishedAt || 'September 2026'}</span>
            </div>
            <h3 class="news-title">${n.title}</h3>
            <p class="news-snippet">${n.summary}</p>
            <a href="${SITE_URL}/news/" class="rule-link" style="margin-top: auto;">Read Full Circular &rarr;</a>
          </article>
        `).join('')}
      </div>
    </section>

    <!-- Governing Council -->
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Governing Council &amp; Administration</h2>
          <p class="section-subtitle">Executive oversight committee ensuring fair play, logistics, and regulatory compliance</p>
        </div>
        <a href="${SITE_URL}/governing-council/" class="btn btn-outline">Full Council Directory &rarr;</a>
      </div>

      <div class="council-grid">
        ${tournament.governingCouncil.slice(0, 4).map(c => `
          <div class="council-card">
            <div class="council-role">${c.role}</div>
            <h3 class="council-name">${c.name}</h3>
            <div class="council-affil">${c.affiliation}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Official Contact Information -->
    <section class="section" style="border: none;">
      <div class="section-header">
        <div>
          <h2 class="section-title">Official Contact &amp; Headquarters</h2>
          <p class="section-subtitle">Official administrative addresses and helpline numbers for the tournament</p>
        </div>
      </div>

      <div class="contact-grid">
        <div class="contact-card">
          <h3>Tournament Match Venues &amp; Local Office</h3>
          <ul class="contact-list">
            <li class="contact-item">
              <strong>Stadium:</strong>
              <div>${tournament.contact.stadiumName}, ${tournament.contact.locality}, ${tournament.contact.city}, ${tournament.contact.state} ${tournament.contact.pincode}<br><span style="color: var(--accent-gold-light); font-size: 0.85rem;">Landmark: ${tournament.contact.landmark}</span></div>
            </li>
            <li class="contact-item">
              <strong>RDCA Office:</strong>
              <div>${tournament.contact.rdcaOffice}</div>
            </li>
            <li class="contact-item">
              <strong>Local Phones:</strong>
              <div>${tournament.contact.rdcaPhones.join(' &bull; ')}</div>
            </li>
            <li class="contact-item">
              <strong>Local Email:</strong>
              <div><a href="mailto:${tournament.contact.rdcaEmail}">${tournament.contact.rdcaEmail}</a></div>
            </li>
          </ul>
        </div>

        <div class="contact-card">
          <h3>MPCA Headquarters &amp; Integrity Hotlines</h3>
          <ul class="contact-list">
            <li class="contact-item">
              <strong>State Body:</strong>
              <div>${tournament.contact.mpcaOffice}</div>
            </li>
            <li class="contact-item">
              <strong>MPCA Phones:</strong>
              <div>${tournament.contact.mpcaPhones.join(' &bull; ')}</div>
            </li>
            <li class="contact-item">
              <strong>MPCA Email:</strong>
              <div><a href="mailto:${tournament.contact.mpcaEmail}">${tournament.contact.mpcaEmail}</a></div>
            </li>
          </ul>
          <div class="hotline-badge">
            <strong>Anti-Corruption &amp; Integrity Hotline:</strong><br>
            Direct telephone: <a href="tel:+917662250011" style="color: #fff; font-weight: 700;">${tournament.contact.antiCorruptionHotline}</a> (Confidential &amp; monitored 24/7)
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
    "alternateName": "ABV Memorial Trophy",
    "url": `${SITE_URL}/`,
    "logo": `${SITE_URL}/public/images/trophy.svg`,
    "description": "Official portal of the Atal Bihari Vajpayee Memorial Tournament in Rewa, Madhya Pradesh. Comprehensive rules, participating teams, past winners, and season telemetry.",
    "parentOrganization": {
      "@type": "SportsOrganization",
      "name": "Rewa Division Cricket Association (RDCA)",
      "url": "https://rewa-cricket-division.vercel.app"
    },
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
  console.log('Built: index.html');
}

// 2. Generate Teams Page (teams/index.html)
function buildTeamsPage() {
  ensureDir(path.join(rootDir, 'teams'));

  const content = `
  <section class="policy-page-header">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${SITE_URL}/">Home</a>
        <span class="sep">/</span>
        <span style="color: #fff;">Participating Teams</span>
      </nav>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #fff;">Participating Teams &amp; Franchises</h1>
      <p style="color: var(--text-secondary); max-width: 760px; margin-top: 0.5rem;">
        Official directory of all 12 premier clubs and invitational franchises competing in the Atal Bihari Vajpayee Memorial Tournament circuit, complete with official emblems, home grounds, titles, and verified external portals.
      </p>
      <div style="margin-top: 1.5rem;">
        <input type="search" id="teamSearch" class="search-input" placeholder="Search teams by name, city, or short code..." aria-label="Search teams">
      </div>
    </div>
  </section>

  <div class="container" style="padding: 3rem 1.5rem;">
    <div class="teams-grid">
      ${teams.map(t => `
        <div class="team-card" style="--team-accent: ${t.primaryColor};">
          <div class="team-logo-frame">
            <img src="${SITE_URL}/public/images/${t.id}.svg" alt="${t.name} Logo" width="54" height="54">
          </div>
          <h2 class="team-name" style="font-size: 1.2rem;">${t.name}</h2>
          <div class="team-city">${t.city}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <strong>Home:</strong> ${t.homeGround}
          </div>
          <div class="team-titles">${t.titles}</div>
          <p style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem; text-align: left;">
            ${t.description}
          </p>
          <a href="${t.website}" target="_blank" rel="noopener" class="team-website-btn">
            Visit Official Website &rarr;
          </a>
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
        "logo": `${SITE_URL}/public/images/${t.id}.svg`
      }
    }))
  };

  const html = renderHtmlPage({
    title: "Participating Teams (12) — Atal Bihari Vajpayee Memorial Tournament",
    description: "Official team directory for the Atal Bihari Vajpayee Memorial Tournament: 10 IPL franchises, Destroyers CC, and Dread Eleven with emblems and websites.",
    canonicalUrl: `${SITE_URL}/teams/`,
    activeNav: 'teams',
    bodyContent: content,
    structuredData
  });

  fs.writeFileSync(path.join(rootDir, 'teams/index.html'), html, 'utf-8');
  console.log('Built: teams/index.html');
}

// 3. Generate Matches Page (matches/index.html) - Redirects to RDCA Official Platform
function buildMatchesPage() {
  ensureDir(path.join(rootDir, 'matches'));

  const content = `
  <section class="policy-page-header">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${SITE_URL}/">Home</a>
        <span class="sep">/</span>
        <span style="color: #fff;">Matches &amp; Scorecards</span>
      </nav>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #fff;">Official Match Center &amp; Fixtures</h1>
      <p style="color: var(--text-secondary); max-width: 760px; margin-top: 0.5rem;">
        Centralized match records, ball-by-ball commentary, and live digital scorecards for the Atal Bihari Vajpayee Memorial Tournament are officially administered on the RDCA Central Portal.
      </p>
    </div>
  </section>

  <div class="container" style="padding: 3rem 1.5rem;">
    <!-- Redirect Guidance Card -->
    <div class="matches-redirect-box" style="margin-bottom: 3rem;">
      <div class="matches-redirect-grid">
        <div>
          <span class="champions-stats-badge" style="margin-bottom: 0.75rem;">Official Redirection Policy</span>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.75rem;">
            Why Matches are Hosted on RDCA Central
          </h2>
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            In accordance with MPCA electronic scoring guidelines and RDCA statutory rules, all live scoring, electronic match sheets, umpire disciplinary logs, and ball-by-ball telemetry are maintained directly on the Rewa Division Cricket Association Central Web Infrastructure.
          </p>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            Click below to instantly access the official tournament match archives and real-time live scorecards.
          </p>
        </div>
        <div class="redirect-action-cards">
          <a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" class="redirect-card" style="border-color: var(--accent-gold);">
            <h4>ABV Tournament on RDCA <span>&rarr;</span></h4>
            <p>Official match schedule, results, and tournament standings</p>
          </a>
          <a href="https://rewa-cricket-division.vercel.app/matches/" target="_blank" rel="noopener" class="redirect-card">
            <h4>RDCA All Matches Central <span>&rarr;</span></h4>
            <p>Complete divisional match database &amp; ball-by-ball commentary</p>
          </a>
        </div>
      </div>
    </div>

    <!-- Participating Clubs Match Archives -->
    <section class="section" style="border: none; padding-top: 0;">
      <div class="section-header">
        <div>
          <h2 class="section-title">Club-Specific Match Records &amp; Scorecards</h2>
          <p class="section-subtitle">Dedicated digital portals for the premier clubs contesting the championship</p>
        </div>
      </div>

      <div class="performer-grid">
        <div class="performer-card" style="padding: 2rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
            <div style="width: 60px; height: 60px; background: #0c1626; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #3b82f6;">
              <img src="${SITE_URL}/public/images/des.svg" alt="Destroyers CC" width="38" height="38">
            </div>
            <div>
              <h3 style="font-size: 1.3rem; font-weight: 700; color: #fff;">Destroyers Cricket Club</h3>
              <span style="font-size: 0.8rem; color: var(--accent-gold-light);">3-Time Reigning Champions</span>
            </div>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Review Destroyers CC match scorecards, player wagon wheels, bowling telemetry, and 2021&ndash;2026 rivalry records against Dread Eleven.
          </p>
          <a href="https://destroyers-rewacricket.pages.dev/matches/" target="_blank" rel="noopener" class="btn btn-primary" style="width: 100%; justify-content: center;">
            Destroyers Match Center &rarr;
          </a>
        </div>

        <div class="performer-card" style="padding: 2rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
            <div style="width: 60px; height: 60px; background: #0c1626; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ef4444;">
              <img src="${SITE_URL}/public/images/de.svg" alt="Dread Eleven" width="38" height="38">
            </div>
            <div>
              <h3 style="font-size: 1.3rem; font-weight: 700; color: #fff;">Dread Eleven Cricket Club</h3>
              <span style="font-size: 0.8rem; color: #fca5a5;">3-Time Former Champions</span>
            </div>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Inspect Dread Eleven match logs, ball-by-ball analysis, batting charts, and complete 2021&ndash;2026 tournament statistics.
          </p>
          <a href="https://dread-eleven-rewacricket.pages.dev/matches/" target="_blank" rel="noopener" class="btn btn-outline" style="width: 100%; justify-content: center;">
            Dread Eleven Match Center &rarr;
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
  console.log('Built: matches/index.html');
}

// 4. Generate Rules Index Page (rules/index.html)
function buildRulesIndexPage() {
  ensureDir(path.join(rootDir, 'rules'));

  const content = `
  <section class="policy-page-header">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${SITE_URL}/">Home</a>
        <span class="sep">/</span>
        <span style="color: #fff;">Rules &amp; Regulations</span>
      </nav>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #fff;">Tournament Rules &amp; Regulations Handbook</h1>
      <p style="color: var(--text-secondary); max-width: 760px; margin-top: 0.5rem;">
        Comprehensive governance codes, playing conditions, integrity directives, and administrative regulations governing the Atal Bihari Vajpayee Memorial Tournament. All participants, officials, and clubs are subject to these 14 regulatory articles.
      </p>
      <div style="margin-top: 1.5rem;">
        <input type="search" id="rulesSearch" class="search-input" placeholder="Search rules by title, clause, or category..." aria-label="Search regulations">
      </div>
    </div>
  </section>

  <div class="container" style="padding: 3rem 1.5rem;">
    <div class="rules-grid">
      ${rules.map(r => `
        <article class="rule-card">
          <div class="rule-category">${r.category} &bull; Effective ${r.effectiveDate}</div>
          <h2 class="rule-title" style="font-size: 1.25rem;">${r.title}</h2>
          <p class="rule-summary">${r.summary}</p>
          <div style="margin-bottom: 1rem;">
            <strong style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Key Articles:</strong>
            <ul style="list-style: none; margin-top: 0.35rem; font-size: 0.825rem; color: var(--text-secondary);">
              ${r.clauses.slice(0, 3).map(c => `<li>&bull; ${c.clause}</li>`).join('')}
            </ul>
          </div>
          <a href="${SITE_URL}/rules/${r.id}/" class="rule-link">
            Read Full ${r.clauses.length} Clauses &rarr;
          </a>
        </article>
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
  console.log('Built: rules/index.html');
}

// 5. Generate Individual Rule Pages (rules/[rule-id]/index.html)
function buildIndividualRulePages() {
  rules.forEach(rule => {
    const dir = path.join(rootDir, 'rules', rule.id);
    ensureDir(dir);

    const sidebarNav = `
      <aside class="policy-nav-sidebar" aria-label="Regulations Directory">
        <div class="policy-nav-title">All 14 Regulations</div>
        <ul class="policy-nav-list">
          ${rules.map(r => `
            <li>
              <a href="${SITE_URL}/rules/${r.id}/" class="${r.id === rule.id ? 'active' : ''}">
                ${r.title}
              </a>
            </li>
          `).join('')}
        </ul>
      </aside>
    `;

    const content = `
    <section class="policy-page-header">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="${SITE_URL}/">Home</a>
          <span class="sep">/</span>
          <a href="${SITE_URL}/rules/">Rules &amp; Regulations</a>
          <span class="sep">/</span>
          <span style="color: #fff;">${rule.title}</span>
        </nav>
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #fff;">${rule.title}</h1>
        <div class="policy-meta-tags">
          <span>Category: <strong style="color: var(--accent-gold-light);">${rule.category}</strong></span>
          <span>&bull;</span>
          <span>Effective Date: <strong>${rule.effectiveDate}</strong></span>
          <span>&bull;</span>
          <span>Governance: <strong>RDCA &amp; MPCA Disciplinary Board</strong></span>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="policy-content-layout">
        ${sidebarNav}

        <article class="policy-article">
          <div style="background: rgba(217, 119, 6, 0.08); border-left: 4px solid var(--accent-gold); padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">Official Policy Overview</h2>
            <p style="color: var(--text-secondary); font-size: 0.925rem; line-height: 1.6; margin: 0;">
              ${rule.summary}
            </p>
          </div>

          <div class="clauses-container">
            ${rule.clauses.map(c => `
              <div class="clause-item">
                <h3 class="clause-title">${c.clause}</h3>
                <div class="clause-text">
                  ${c.content}
                </div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Have questions or an inquiry regarding this policy?</span><br>
              <a href="${SITE_URL}/contact/" style="font-weight: 600;">Contact Tournament Disciplinary Secretariat &rarr;</a>
            </div>
            <a href="${SITE_URL}/rules/" class="btn btn-outline" style="font-size: 0.85rem;">
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
    console.log(`Built: rules/${rule.id}/index.html`);
  });
}

// 6. Generate Governing Council Page (governing-council/index.html)
function buildGoverningCouncilPage() {
  ensureDir(path.join(rootDir, 'governing-council'));

  const council = tournament.governingCouncil;

  const content = `
  <section class="policy-page-header">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${SITE_URL}/">Home</a>
        <span class="sep">/</span>
        <span style="color: #fff;">Governing Council</span>
      </nav>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #fff;">Governing Council &amp; Leadership</h1>
      <p style="color: var(--text-secondary); max-width: 760px; margin-top: 0.5rem;">
        The Governing Council represents the supreme executive and technical authority overseeing the Atal Bihari Vajpayee Memorial Tournament. Operating under the constitution of Rewa Division Cricket Association and MPCA.
      </p>
    </div>
  </section>

  <div class="container" style="padding: 3rem 1.5rem;">
    <div class="council-grid" style="margin-bottom: 3.5rem;">
      ${council.map(c => `
        <div class="council-card">
          <div class="council-role">${c.role}</div>
          <h2 class="council-name" style="font-size: 1.25rem;">${c.name}</h2>
          <div class="council-affil">${c.affiliation}</div>
        </div>
      `).join('')}
    </div>

    <!-- Administrative Mandate -->
    <div class="matches-redirect-box">
      <h2 style="font-size: 1.4rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem;">
        Council Mandate &amp; Powers
      </h2>
      <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
        The Atal Bihari Vajpayee Memorial Tournament Governing Council is entrusted with:
      </p>
      <ul style="color: var(--text-secondary); margin-left: 1.5rem; line-height: 1.7; font-size: 0.925rem;">
        <li>Sanctioning participating club rosters, overseas player approvals, and team licensing.</li>
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
  console.log('Built: governing-council/index.html');
}

// 7. Generate News Page (news/index.html)
function buildNewsPage() {
  ensureDir(path.join(rootDir, 'news'));

  const content = `
  <section class="policy-page-header">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${SITE_URL}/">Home</a>
        <span class="sep">/</span>
        <span style="color: #fff;">News &amp; Circulars</span>
      </nav>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #fff;">Official News &amp; Circulars</h1>
      <p style="color: var(--text-secondary); max-width: 760px; margin-top: 0.5rem;">
        Authorized circulars, match bulletins, governing council releases, and stadium announcements for the Atal Bihari Vajpayee Memorial Tournament.
      </p>
    </div>
  </section>

  <div class="container" style="padding: 3rem 1.5rem;">
    <div class="news-grid">
      ${news.map(n => `
        <article class="news-card">
          <div class="news-meta">
            <span class="news-category">${n.category}</span>
            <span>${n.publishedAt || 'September 2026'}</span>
          </div>
          <h2 class="news-title">${n.title}</h2>
          <p class="news-snippet">${n.summary}</p>
          <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            ${n.content}
          </div>
          <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-light); font-size: 0.8rem; color: var(--text-muted);">
            Issued by: <strong>${n.author || 'Tournament Media Bureau / RDCA Secretariat'}</strong>
          </div>
        </article>
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
  console.log('Built: news/index.html');
}

// 8. Generate Contact Page (contact/index.html)
function buildContactPage() {
  ensureDir(path.join(rootDir, 'contact'));

  const c = tournament.contact;

  const content = `
  <section class="policy-page-header">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${SITE_URL}/">Home</a>
        <span class="sep">/</span>
        <span style="color: #fff;">Contact Us</span>
      </nav>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #fff;">Official Headquarters &amp; Contact</h1>
      <p style="color: var(--text-secondary); max-width: 760px; margin-top: 0.5rem;">
        Administrative contact directories for the Atal Bihari Vajpayee Memorial Tournament, Rewa Division Cricket Association, and Madhya Pradesh Cricket Association.
      </p>
    </div>
  </section>

  <div class="container" style="padding: 3rem 1.5rem;">
    <div class="contact-grid" style="margin-bottom: 3rem;">
      <div class="contact-card">
        <h2>Tournament Match Venue &amp; Local RDCA</h2>
        <ul class="contact-list" style="margin-top: 1rem;">
          <li class="contact-item">
            <strong>Stadium Venue:</strong>
            <div>
              <strong>${c.stadiumName}</strong><br>
              ${c.locality}<br>
              ${c.city}, ${c.state} &ndash; ${c.pincode}<br>
              <span style="color: var(--accent-gold-light); font-size: 0.85rem;">Landmark: ${c.landmark}</span>
            </div>
          </li>
          <li class="contact-item">
            <strong>RDCA Headquarters:</strong>
            <div>${c.rdcaOffice}</div>
          </li>
          <li class="contact-item">
            <strong>Telephone:</strong>
            <div>
              ${c.rdcaPhones.map(p => `<a href="tel:${p.replace(/\s/g, '')}">${p}</a>`).join(' &bull; ')}
            </div>
          </li>
          <li class="contact-item">
            <strong>Official Email:</strong>
            <div>
              <a href="mailto:${c.rdcaEmail}">${c.rdcaEmail}</a><br>
              <a href="mailto:${c.email}">${c.email}</a>
            </div>
          </li>
        </ul>
      </div>

      <div class="contact-card">
        <h2>Madhya Pradesh Cricket Association (MPCA)</h2>
        <ul class="contact-list" style="margin-top: 1rem;">
          <li class="contact-item">
            <strong>State Office:</strong>
            <div>${c.mpcaOffice}</div>
          </li>
          <li class="contact-item">
            <strong>MPCA Phones:</strong>
            <div>
              ${c.mpcaPhones.map(p => `<a href="tel:${p.replace(/\s/g, '')}">${p}</a>`).join(' &bull; ')}
            </div>
          </li>
          <li class="contact-item">
            <strong>MPCA Email:</strong>
            <div>
              <a href="mailto:${c.mpcaEmail}">${c.mpcaEmail}</a>
            </div>
          </li>
          <li class="contact-item">
            <strong>MPCA Portal:</strong>
            <div>
              <a href="https://www.mpcaonline.com" target="_blank" rel="noopener">www.mpcaonline.com &rarr;</a>
            </div>
          </li>
        </ul>

        <div class="hotline-badge" style="margin-top: 1.5rem;">
          <strong style="color: #fff;">Anti-Corruption &amp; Integrity Helpline:</strong><br>
          Direct line: <a href="tel:+917662250011" style="color: #fff; font-size: 1.1rem; font-weight: 700;">${c.antiCorruptionHotline}</a><br>
          <span style="font-size: 0.8rem; color: #fecaca;">Confidential reporting of corrupt approaches or integrity concerns. Available 24 hours daily.</span>
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
  console.log('Built: contact/index.html');
}

// 9. Generate 404 Page (404.html)
function build404Page() {
  const content = `
  <section class="hero" style="min-height: 60vh; display: flex; align-items: center;">
    <div class="container">
      <div class="hero-badge">Error 404 &bull; Page Not Found</div>
      <h1 class="hero-title">Innings Concluded</h1>
      <p class="hero-lead">
        The page or tournament record you requested does not exist or has been relocated within the official archives.
      </p>
      <div class="hero-actions">
        <a href="${SITE_URL}/" class="btn btn-primary">&larr; Return to Tournament Home</a>
        <a href="${SITE_URL}/rules/" class="btn btn-outline">Official Regulations</a>
        <a href="${SITE_URL}/teams/" class="btn btn-outline">Participating Teams</a>
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
  console.log('Built: 404.html');
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
- **Venue**: Divisional Cricket Stadium, Neem Chauraha, Boda Bagh Road, Rewa, MP 486001
- **Official Central Matches Hub**: https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/

## Core Sections
- [Championship Portal](${SITE_URL}/): Complete tournament overview, telemetry, past winners, and champions.
- [Participating Teams](${SITE_URL}/teams/): 12 premier clubs including 10 IPL franchises plus Destroyers CC and Dread Eleven.
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
    "background_color": "#0b1528",
    "theme_color": "#0b1528",
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
  console.log('Starting static build for abv-rewacricket...');
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
  console.log('Static build completed successfully!');
}

buildAll();
