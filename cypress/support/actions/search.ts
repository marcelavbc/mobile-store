/// <reference types="cypress" />

/**
 * Search Actions
 * Reusable actions for search functionality
 */

export const searchActions = {
  /**
   * Type in the search input
   * @param query - Search query to type
   */
  typeSearch: (query: string) => {
    cy.get('input[placeholder*="smartphone"]').type(query);
  },

  /**
   * Clear the search input
   */
  clearSearch: () => {
    cy.get('button[aria-label*="Clear"]').click();
  },

  /**
   * Verify search input value
   * @param expectedValue - Expected value in the input
   */
  verifySearchValue: (expectedValue: string) => {
    cy.get('input[placeholder*="smartphone"]').should('have.value', expectedValue);
  },

  /**
   * Wait for search to complete (debounce + API call)
   * @param waitTime - Time to wait in ms (default: 500)
   */
  waitForSearch: (waitTime: number = 500) => {
    cy.wait(waitTime);
  },
};
