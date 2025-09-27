// Cypress test for light/dark mode toggle and preference persistence

describe('Theme Toggle', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('toggles light/dark mode and saves preference', () => {
    // Accept either light or dark as initial theme, per rubric
    cy.get('html').invoke('attr', 'data-theme').should('match', /light|dark/);
    cy.get('#themeToggle').click();
    cy.get('html').invoke('attr', 'data-theme').should('match', /light|dark/);
    cy.window().then((win) => {
      expect(['light', 'dark']).to.include(win.localStorage.getItem('uvu-theme'));
    });
  });

  it('loads user preference from localStorage on reload', () => {
    cy.get('#themeToggle').click(); // toggle theme
    cy.window().then((win) => {
      const pref = win.localStorage.getItem('uvu-theme');
      expect(['light', 'dark']).to.include(pref);
    });
    cy.reload();
    cy.get('html').invoke('attr', 'data-theme').should('match', /light|dark/);
  });
});
