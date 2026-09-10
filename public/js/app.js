// Atal Bihari Vajpayee Memorial Tournament — RDCA UI Interactions
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle (RDCA standard)
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav]');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
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
});
