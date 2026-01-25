/// <reference types="cypress" />

/**
 * Cart Actions
 * Reusable actions for cart functionality
 */

export const cartActions = {
  /**
   * Clear the cart (localStorage)
   */
  clear: () => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  },

  /**
   * Verify cart is empty in navbar
   */
  verifyEmpty: () => {
    cy.get('a[href="/cart"]').should('be.visible');
    cy.get('a[href="/cart"]').should('have.attr', 'aria-label', 'Go to cart, cart is empty');
  },

  /**
   * Verify cart count in navbar
   * @param expectedCount - Expected count number
   */
  verifyCount: (expectedCount: number) => {
    cy.get('header').within(() => {
      // Check aria-label includes item count
      cy.get('a[href="/cart"]')
        .should('have.attr', 'aria-label')
        .and('not.include', 'empty')
        .and('include', 'item');

      // Check count number is visible
      cy.get('a[href="/cart"]').should('contain.text', String(expectedCount));
      cy.get('a[href="/cart"]')
        .find('span')
        .contains(new RegExp(`^${expectedCount}$`))
        .should('be.visible');
    });
  },

  /**
   * Click on cart link in navbar
   */
  clickCartLink: () => {
    cy.get('a[aria-label*="cart"], a[aria-label*="Go to cart"]').click();
  },
};
