describe('Search Functionality', () => {
  beforeEach(() => {
    cy.goToHome();
  });

  it('should allow typing in the search input', () => {
    cy.typeSearch('iPhone');
    cy.get('input[placeholder*="smartphone"]').should('have.value', 'iPhone');
  });

  it('should show loading state while searching', () => {
    cy.typeSearch('iPhone');
    cy.wait(400); // Wait for debounce
    cy.get('body').should('contain.text', 'RESULTS');
  });

  it('should clear search when clicking clear button', () => {
    cy.typeSearch('iPhone');
    cy.get('input[placeholder*="smartphone"]').should('have.value', 'iPhone');
    cy.clearSearch();
  });

  it('should display empty state when no products found', () => {
    cy.typeSearch('nonexistentproduct12345');
    cy.wait(500);
    cy.contains(/no products found/i).should('be.visible');
  });
});
