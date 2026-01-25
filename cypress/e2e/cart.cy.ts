import { productSteps } from '../support/steps/product-steps';
import { cartActions } from '../support/actions/cart';
import { assertionActions } from '../support/actions/assertions';

describe('Cart Functionality', () => {
  beforeEach(() => {
    cy.goToHome();
    cy.clearCart();
  });

  it('should navigate to cart page', () => {
    cy.get('a[aria-label*="cart"], a[aria-label*="Go to cart"]').click();
    cy.url().should('include', '/cart');
    cy.contains(/cart/i).should('be.visible');
  });

  it('should display empty cart', () => {
    cy.goToCart();
    assertionActions.verifyEmptyCartMessage();
  });

  it('should add product to cart from product detail page', () => {
    productSteps.addProductToCart(0);
  });

  it('should show cart count in navbar after adding item', () => {
    // Initially, cart should be empty - wait for page to load first
    cy.waitForProducts();
    cartActions.verifyEmpty();

    // Add product to cart
    productSteps.addProductToCart(0);

    // Go back to home to see the navbar
    cy.goBackToHome();

    // Wait for home page to fully load
    cy.verifyProducts();

    // Verify cart count is visible
    cartActions.verifyCount(1);
  });
});
