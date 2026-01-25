/// <reference types="cypress" />

/**
 * Product Actions
 * Reusable actions for interacting with products
 */

export const productActions = {
  /**
   * Select first storage option if available
   */
  selectFirstStorage: () => {
    cy.get('body').then(($body) => {
      const hasStorage = $body.find('div[role="group"][aria-label*="Storage"] button').length > 0;
      if (hasStorage) {
        // Find the first button that is not already pressed (selected)
        cy.get('div[role="group"][aria-label*="Storage"]')
          .find('button')
          .first()
          .click();
        cy.wait(150); // Wait for state update
      }
    });
  },

  /**
   * Select first color option if available
   */
  selectFirstColor: () => {
    cy.get('body').then(($body) => {
      const hasColor = $body.find('div[role="group"][aria-label*="Color"] button').length > 0;
      if (hasColor) {
        // Find the first button that is not already pressed (selected)
        cy.get('div[role="group"][aria-label*="Color"]')
          .find('button')
          .first()
          .click();
        cy.wait(150); // Wait for state update
      }
    });
  },

  /**
   * Select both storage and color options if available
   */
  selectStorageAndColor: () => {
    cy.get('body').then(($body) => {
      const hasStorage = $body.find('div[role="group"][aria-label*="Storage"] button').length > 0;
      const hasColor = $body.find('div[role="group"][aria-label*="Color"] button').length > 0;

      if (hasStorage) {
        cy.get('div[role="group"][aria-label*="Storage"]').find('button').first().click();
        cy.wait(100);
      }

      if (hasColor) {
        cy.get('div[role="group"][aria-label*="Color"]').find('button').first().click();
        cy.wait(100);
      }
    });
  },

  /**
   * Add product to cart
   * Assumes storage and color are already selected if required
   */
  addToCart: () => {
    // Check if button is enabled, if not, it means options need to be selected
    cy.contains('button', /add to cart/i).then(($btn) => {
      if ($btn.is(':disabled')) {
        // Button is disabled, check if we need to select options
        cy.get('body').then(($body) => {
          const hasStorage = $body.find('div[role="group"][aria-label*="Storage"] button[aria-pressed="false"]').length > 0;
          const hasColor = $body.find('div[role="group"][aria-label*="Color"] button[aria-pressed="false"]').length > 0;
          
          if (hasStorage || hasColor) {
            // Options exist but weren't selected, select them now
            if (hasStorage) {
              cy.get('div[role="group"][aria-label*="Storage"]').find('button').first().click();
              cy.wait(100);
            }
            if (hasColor) {
              cy.get('div[role="group"][aria-label*="Color"]').find('button').first().click();
              cy.wait(100);
            }
          }
        });
      }
    });
    
    // Now the button should be enabled, click it
    cy.contains('button', /add to cart/i).should('not.be.disabled');
    cy.contains('button', /add to cart/i).click();
    cy.contains(/added/i, { timeout: 2000 }).should('be.visible');
    cy.wait(300); // Wait for localStorage update and React re-render
  },

  /**
   * Select product options and add to cart in one action
   */
  selectAndAddToCart: () => {
    productActions.selectStorageAndColor();
    productActions.addToCart();
  },
};
