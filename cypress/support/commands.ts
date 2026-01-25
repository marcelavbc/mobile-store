/// <reference types="cypress" />

// Import actions and steps
import { navigationActions, productActions, searchActions, cartActions, assertionActions } from './index';

/**
 * Custom Cypress Commands
 * These commands wrap our actions for easier use in tests
 */

// Navigation commands
Cypress.Commands.add('goToHome', navigationActions.goToHome);
Cypress.Commands.add('goToCart', navigationActions.goToCart);
Cypress.Commands.add('goToProduct', (productIndex: number = 0) => {
  navigationActions.goToProduct(productIndex);
});
Cypress.Commands.add('goBackToHome', navigationActions.goBackToHome);

// Product commands
Cypress.Commands.add('selectStorageAndColor', productActions.selectStorageAndColor);
Cypress.Commands.add('addToCart', productActions.addToCart);
Cypress.Commands.add('selectAndAddToCart', productActions.selectAndAddToCart);

// Search commands
Cypress.Commands.add('typeSearch', searchActions.typeSearch);
Cypress.Commands.add('clearSearch', searchActions.clearSearch);

// Cart commands
Cypress.Commands.add('clearCart', cartActions.clear);
Cypress.Commands.add('verifyCartEmpty', cartActions.verifyEmpty);
Cypress.Commands.add('verifyCartCount', cartActions.verifyCount);

// Assertion commands
Cypress.Commands.add('verifyNavbar', assertionActions.verifyNavbar);
Cypress.Commands.add('verifySearchBar', assertionActions.verifySearchBar);
Cypress.Commands.add('verifyProducts', assertionActions.verifyProducts);
Cypress.Commands.add('verifyProductDetail', assertionActions.verifyProductDetail);

// Legacy commands (kept for backward compatibility)
Cypress.Commands.add('waitForProducts', assertionActions.verifyProducts);

// TypeScript declarations
declare global {
  namespace Cypress {
    interface Chainable {
      // Navigation
      goToHome(): Chainable<void>;
      goToCart(): Chainable<void>;
      goToProduct(productIndex?: number): Chainable<void>;
      goBackToHome(): Chainable<void>;
      
      // Product
      selectStorageAndColor(): Chainable<void>;
      addToCart(): Chainable<void>;
      selectAndAddToCart(): Chainable<void>;
      
      // Search
      typeSearch(query: string): Chainable<void>;
      clearSearch(): Chainable<void>;
      
      // Cart
      clearCart(): Chainable<void>;
      verifyCartEmpty(): Chainable<void>;
      verifyCartCount(count: number): Chainable<void>;
      
      // Assertions
      verifyNavbar(): Chainable<void>;
      verifySearchBar(): Chainable<void>;
      verifyProducts(): Chainable<void>;
      verifyProductDetail(): Chainable<void>;
      
      // Legacy
      waitForProducts(): Chainable<void>;
    }
  }
}

export {};
