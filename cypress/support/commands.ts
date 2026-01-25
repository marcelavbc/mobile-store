// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

// Custom command to wait for products to load
Cypress.Commands.add('waitForProducts', () => {
  cy.get('a[href^="/products/"]', { timeout: 10000 }).should('have.length.at.least', 1);
});

// Custom command to clear cart
Cypress.Commands.add('clearCart', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

// Prevent TypeScript errors
declare global {
  namespace Cypress {
    interface Chainable {
      waitForProducts(): Chainable<void>;
      clearCart(): Chainable<void>;
    }
  }
}

export {};
