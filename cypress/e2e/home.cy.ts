describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the navbar with logo and cart', () => {
    cy.get('header').should('be.visible');
    cy.get('a[aria-label*="home"], a[aria-label*="Go to home"]').should('be.visible');
    cy.get('a[aria-label*="cart"], a[aria-label*="Go to cart"]').should('be.visible');
  });

  it('should display the search bar', () => {
    cy.get('input[placeholder*="smartphone"]').should('be.visible');
  });

  it('should display product cards', () => {
    // Wait for products to load - look for links that go to /products/
    cy.waitForProducts();
  });

  it('should navigate to product detail when clicking a product card', () => {
    cy.get('a[href^="/products/"]').first().click();
    cy.url().should('include', '/products/');
    cy.get('h1').should('be.visible');
  });
});
