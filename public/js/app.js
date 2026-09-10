// Atal Bihari Vajpayee Memorial Tournament Client Interactions
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  // Real-time rules search filter
  const rulesSearch = document.getElementById('rulesSearch');
  if (rulesSearch) {
    rulesSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.rule-card');
      cards.forEach(card => {
        const title = card.querySelector('.rule-title')?.textContent.toLowerCase() || '';
        const summary = card.querySelector('.rule-summary')?.textContent.toLowerCase() || '';
        const cat = card.querySelector('.rule-category')?.textContent.toLowerCase() || '';
        if (title.includes(q) || summary.includes(q) || cat.includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Real-time teams search filter
  const teamSearch = document.getElementById('teamSearch');
  if (teamSearch) {
    teamSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.team-card');
      cards.forEach(card => {
        const name = card.querySelector('.team-name')?.textContent.toLowerCase() || '';
        const city = card.querySelector('.team-city')?.textContent.toLowerCase() || '';
        if (name.includes(q) || city.includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});
