/// <reference types="cypress" />

/**
 * Navigation Actions
 * Reusable actions for navigating through the app
 */

export const navigationActions = {
  /**
   * Navigate to home page
   */
  goToHome: () => {
    cy.visit('/');
  },

  /**
   * Navigate to cart page
   */
  goToCart: () => {
    cy.visit('/cart');
  },

  /**
   * Navigate to a product detail page
   * @param productIndex - Index of the product to click (default: 0 for first product)
   */
  goToProduct: (productIndex: number = 0) => {
    cy.get('a[href^="/products/"]').eq(productIndex).click();
    cy.url().should('include', '/products/');
    cy.get('h1').should('be.visible');
  },

  /**
   * Navigate back to home from current page
   */
  goBackToHome: () => {
    cy.get('a').contains(/back/i).click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('input[placeholder*="smartphone"]').should('be.visible');
  },
};
