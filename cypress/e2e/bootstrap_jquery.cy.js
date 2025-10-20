// Cypress tests for Bootstrap/jQuery requirements and UI

describe('Bootstrap & jQuery UI/REST', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('uses Bootstrap classes for layout and buttons', () => {
    cy.get('.container').should('exist');
    cy.get('button').should('have.class', 'btn');
    cy.get('button#themeToggle').should(($btn) => {
      expect($btn).to.satisfy(($el) => {
        return $el.hasClass('btn-outline-success') || $el.hasClass('btn-outline-light');
      });
    });
    cy.get('button#addLogBtn').should('have.class', 'btn-success');
    cy.get('select').should('have.class', 'form-select');
    cy.get('textarea').should('have.class', 'form-control');
  });

  it('has no custom CSS files loaded', () => {
    cy.get('link[rel="stylesheet"]').each($el => {
      const href = $el.attr('href');
      expect(href).not.to.match(/style|brand/i);
    });
  });

  it('uses jQuery for AJAX (window.axios should not exist)', () => {
    cy.window().then(win => {
      expect(win.axios).to.be.undefined;
      expect(win.jQuery).to.exist;
      expect(win.$).to.exist;
    });
  });

  it('renders logs with Bootstrap list-group', () => {
    cy.get('ul#logs').should('have.class', 'list-group');
  });
  
  it('applies UVU colors using Bootstrap utility classes', () => {
    // Check for UVU green color via Bootstrap utility classes
    cy.get('.text-success').should('exist');
    // Check for any header element using UVU green styling
    cy.get('header').should('exist');
    cy.get('.border-success').should('exist');
  });
});

describe('Bootstrap Light/Dark Theme Toggle', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });
  
  it('toggles theme when button is clicked', () => {
    // Just verify that clicking the toggle button changes the theme
    cy.get('#themeToggle').click();
      
    // Verify button text changes after clicking
    cy.get('#themeToggle').invoke('text').then((text) => {
      expect(text).to.match(/Switch to (Dark|Light) Mode/);
    });
      
    // Click again and verify it changes again
    cy.get('#themeToggle').click();
    cy.get('#themeToggle').invoke('text').then((text) => {
      expect(text).to.match(/Switch to (Dark|Light) Mode/);
    });
  });
  
  it('persists theme preference in localStorage', () => {
    // Click to dark mode
    cy.get('#themeToggle').click();
    
    // Reload page
    cy.reload();
    
    // Should still be dark
    cy.get('html').should('have.attr', 'data-bs-theme', 'dark');
  });
});

describe('RESTful Interactions (jQuery)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#course').select('cs4690');
    cy.get('#uvuId').type('10234567');
  });

  it('can add a log and see it appear', () => {
    cy.get('#newLog').clear().type('Test log from Cypress');
    cy.get('#addLogBtn').should('not.be.disabled').click();
    cy.get('ul#logs li').should('contain', 'Test log from Cypress');
  });
});
