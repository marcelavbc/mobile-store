/// <reference types="cypress" />

/**
 * Assertion Actions
 * Reusable assertions for common UI elements
 */

export const assertionActions = {
  /**
   * Verify navbar is visible with logo and cart
   */
  verifyNavbar: () => {
    cy.get('header').should('be.visible');
    cy.get('a[aria-label*="home"], a[aria-label*="Go to home"]').should('be.visible');
    cy.get('a[aria-label*="cart"], a[aria-label*="Go to cart"]').should('be.visible');
  },

  /**
   * Verify search bar is visible
   */
  verifySearchBar: () => {
    cy.get('input[placeholder*="smartphone"]').should('be.visible');
  },

  /**
   * Verify products are displayed
   */
  verifyProducts: () => {
    cy.get('a[href^="/products/"]', { timeout: 10000 }).should('have.length.at.least', 1);
  },

  /**
   * Verify product detail page is loaded
   */
  verifyProductDetail: () => {
    cy.get('h1').should('be.visible');
    cy.contains(/EUR/i).should('be.visible');
  },

  /**
   * Verify empty cart message
   */
  verifyEmptyCartMessage: () => {
    cy.contains(/continue shopping/i).should('be.visible');
  },

  /**
   * Verify empty search results message
   */
  verifyEmptySearchResults: () => {
    cy.contains(/no products found/i).should('be.visible');
  },
};
