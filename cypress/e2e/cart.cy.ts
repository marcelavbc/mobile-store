describe('Cart Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear cart before each test
    cy.clearCart();
  });

  it('should navigate to cart page', () => {
    cy.get('a[aria-label*="cart"], a[aria-label*="Go to cart"]').click();
    cy.url().should('include', '/cart');
    cy.contains(/cart/i).should('be.visible');
  });

  it('should display empty cart', () => {
    cy.visit('/cart');
    cy.contains(/continue shopping/i).should('be.visible');
  });

  it('should add product to cart from product detail page', () => {
    // Navigate to a product
    cy.get('a[href^="/products/"]').first().click();
    cy.url().should('include', '/products/');

    // Select storage and color if available
    cy.get('body').then(($body) => {
      if ($body.find('button[aria-pressed="false"]').length > 0) {
        // Select first storage option
        cy.get('div[role="group"][aria-label*="Storage"]').find('button').first().click();

        // Select first color option
        cy.get('div[role="group"][aria-label*="Color"]').find('button').first().click();
      }

      // Add to cart
      cy.contains('button', /add to cart/i).should('not.be.disabled');
      cy.contains('button', /add to cart/i).click();

      // Check for success feedback
      cy.contains(/added/i, { timeout: 3000 }).should('be.visible');
    });
  });

  it('should show cart count in navbar after adding item', () => {
    // Initially, cart should be empty - verify the aria-label
    cy.get('a[href="/cart"]').should('be.visible');
    cy.get('a[href="/cart"]').should('have.attr', 'aria-label', 'Go to cart, cart is empty');

    // Navigate to a product
    cy.get('a[href^="/products/"]').first().click();
    cy.url().should('include', '/products/');

    // Wait for page to load
    cy.get('h1').should('be.visible');

    // Select storage and color if available
    cy.get('body').then(($body) => {
      const hasStorageButtons =
        $body.find('div[role="group"][aria-label*="Storage"] button').length > 0;
      const hasColorButtons =
        $body.find('div[role="group"][aria-label*="Color"] button').length > 0;

      if (hasStorageButtons && hasColorButtons) {
        // Select first storage option
        cy.get('div[role="group"][aria-label*="Storage"]').find('button').first().click();

        // Wait for state update
        cy.wait(100);

        // Select first color option
        cy.get('div[role="group"][aria-label*="Color"]').find('button').first().click();

        // Wait for state update
        cy.wait(100);
      }

      // Verify add to cart button is enabled
      cy.contains('button', /add to cart/i).should('not.be.disabled');

      // Add to cart
      cy.contains('button', /add to cart/i).click();

      // Wait for success feedback
      cy.contains(/added/i, { timeout: 2000 }).should('be.visible');

      // Wait for localStorage to update and React to re-render
      cy.wait(300);
    });

    // Go back to home to see the navbar
    cy.get('a').contains(/back/i).click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Wait for home page to load
    cy.get('input[placeholder*="smartphone"]').should('be.visible');

    // Verify cart count is visible in navbar
    cy.get('header').within(() => {
      // Check that the cart link aria-label now includes item count (not "empty")
      cy.get('a[href="/cart"]')
        .should('have.attr', 'aria-label')
        .and('not.include', 'empty')
        .and('include', 'item');

      // Check that the count number is visible
      // The structure is: <a><span><CartIcon/><span class="cartCount">1</span></span></a>
      // We can check that the link contains the number "1"
      cy.get('a[href="/cart"]').should('contain.text', '1');
      
      // More specific: find the span that contains just the number
      cy.get('a[href="/cart"]')
        .find('span')
        .contains(/^1$/)
        .should('be.visible');
    });
  });
});
