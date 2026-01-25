describe('Product Detail Page', () => {
  beforeEach(() => {
    // Navigate to a product from home
    cy.visit('/');
    cy.get('a[href^="/products/"]').first().click();
  });

  it('should display product information', () => {
    cy.get('h1').should('be.visible');
    cy.contains(/EUR/i).should('be.visible');
  });

  it('should have back button to return to home', () => {
    cy.contains(/back/i).should('be.visible');
    // Back button is a link, find it and click
    cy.get('a').contains(/back/i).click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should display storage options if available', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Storage')) {
        cy.get('div[role="group"][aria-label*="Storage"]')
          .find('button')
          .should('have.length.at.least', 1);
      }
    });
  });

  it('should display color options if available', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Color')) {
        cy.get('div[role="group"][aria-label*="Color"]')
          .find('button')
          .should('have.length.at.least', 1);
      }
    });
  });

  it('should display specifications section', () => {
    cy.contains(/specifications/i).should('be.visible');
  });

  it('should enable add to cart button when storage and color are selected', () => {
    cy.get('body').then(($body) => {
      const hasStorage = $body.find('div[role="group"][aria-label*="Storage"]').length > 0;
      const hasColor = $body.find('div[role="group"][aria-label*="Color"]').length > 0;

      if (hasStorage && hasColor) {
        // Initially disabled
        cy.contains('button', /add to cart/i).should('be.disabled');

        // Select storage
        cy.get('div[role="group"][aria-label*="Storage"]')
          .find('button')
          .first()
          .click();

        // Still disabled (need color too)
        cy.contains('button', /add to cart/i).should('be.disabled');

        // Select color
        cy.get('div[role="group"][aria-label*="Color"]')
          .find('button')
          .first()
          .click();

        // Now enabled
        cy.contains('button', /add to cart/i).should('not.be.disabled');
      }
    });
  });

  it('should show similar products section if available', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Similar')) {
        cy.contains(/similar/i).should('be.visible');
      }
    });
  });
});
