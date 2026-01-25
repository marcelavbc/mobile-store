/// <reference types="cypress" />
import { searchActions } from '../actions/search';
import { assertionActions } from '../actions/assertions';

/**
 * Search Steps
 * High-level steps for search functionality
 */

export const searchSteps = {
  /**
   * Perform a search and wait for results
   * @param query - Search query
   * @param waitTime - Time to wait for debounce (default: 500)
   */
  performSearch: (query: string, waitTime: number = 500) => {
    searchActions.typeSearch(query);
    searchActions.waitForSearch(waitTime);
  },

  /**
   * Clear search and verify it's cleared
   */
  clearSearch: () => {
    searchActions.clearSearch();
    searchActions.verifySearchValue('');
  },

  /**
   * Search for a non-existent product and verify empty state
   * @param query - Search query that returns no results
   */
  searchWithNoResults: (query: string = 'nonexistentproduct12345') => {
    searchSteps.performSearch(query);
    assertionActions.verifyEmptySearchResults();
  },
};
