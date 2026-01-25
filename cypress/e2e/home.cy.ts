describe('Home Page', () => {
  beforeEach(() => {
    cy.goToHome();
  });

  it('should display the navbar with logo and cart', () => {
    cy.verifyNavbar();
  });

  it('should display the search bar', () => {
    cy.verifySearchBar();
  });

  it('should display product cards', () => {
    cy.verifyProducts();
  });

  it('should navigate to product detail when clicking a product card', () => {
    cy.goToProduct(0);
  });
});
