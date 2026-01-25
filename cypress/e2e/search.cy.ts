describe('Search Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow typing in the search input', () => {
    cy.get('input[placeholder*="smartphone"]').type('iPhone');
    cy.get('input[placeholder*="smartphone"]').should('have.value', 'iPhone');
  });

  it('should show loading state while searching', () => {
    cy.get('input[placeholder*="smartphone"]').type('iPhone');
    // The search is debounced, so we wait a bit
    cy.wait(400);
    // Check for loading indicator or results count
    cy.get('body').should('contain.text', 'RESULTS');
  });

  it('should clear search when clicking clear button', () => {
    cy.get('input[placeholder*="smartphone"]').type('iPhone');
    cy.get('input[placeholder*="smartphone"]').should('have.value', 'iPhone');
    cy.get('button[aria-label*="Clear"]').click();
    cy.get('input[placeholder*="smartphone"]').should('have.value', '');
  });

  it('should display empty state when no products found', () => {
    cy.get('input[placeholder*="smartphone"]').type('Nokia');
    cy.wait(500);
    cy.contains(/no products found/i).should('be.visible');
  });
});
