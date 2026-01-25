import { productActions } from '../support/actions/product';
import { assertionActions } from '../support/actions/assertions';

describe('Product Detail Page', () => {
  beforeEach(() => {
    cy.goToHome();
    cy.goToProduct(0);
  });

  it('should display product information', () => {
    assertionActions.verifyProductDetail();
  });

  it('should have back button to return to home', () => {
    cy.contains(/back/i).should('be.visible');
    cy.goBackToHome();
  });

  it('should display storage options if available', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Storage')) {
        cy.get('div[role="group"][aria-label*="Storage"]')
          .find('button')
          .should('have.length.at.least', 1);
      }
    });
  });

  it('should display color options if available', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Color')) {
        cy.get('div[role="group"][aria-label*="Color"]')
          .find('button')
          .should('have.length.at.least', 1);
      }
    });
  });

  it('should display specifications section', () => {
    cy.contains(/specifications/i).should('be.visible');
  });

  it('should enable add to cart button when storage and color are selected', () => {
    // First verify the product has both storage and color options
    cy.get('body').then(($body) => {
      const hasStorage = $body.find('div[role="group"][aria-label*="Storage"] button').length > 0;
      const hasColor = $body.find('div[role="group"][aria-label*="Color"] button').length > 0;

      if (hasStorage && hasColor) {
        // Wait for button to be available and verify it exists
        cy.contains('button', /add to cart/i, { timeout: 5000 })
          .should('exist')
          .as('addToCartButton');
        
        // Initially disabled (both storage and color need to be selected)
        // Note: The hook auto-selects the first color when storage is selected,
        // and vice versa, so we need to verify the initial state before any clicks
        cy.get('@addToCartButton').should('be.disabled');

        // Select storage - this will auto-select the first color too (hook behavior)
        cy.get('div[role="group"][aria-label*="Storage"]')
          .find('button')
          .first()
          .click();
        
        // Wait for React state update
        cy.wait(200);

        // After selecting storage, the hook automatically selects the first color,
        // so the button should now be enabled (both are selected automatically)
        cy.get('@addToCartButton').should('not.be.disabled');
        
        // Verify that both storage and color are now selected by checking aria-pressed
        cy.get('div[role="group"][aria-label*="Storage"]')
          .find('button[aria-pressed="true"]')
          .should('exist');
        cy.get('div[role="group"][aria-label*="Color"]')
          .find('button[aria-pressed="true"]')
          .should('exist');
      } else {
        // If product doesn't have both storage and color, skip this test
        cy.log('Product does not have both storage and color options, skipping test');
      }
    });
  });

  it('should show similar products section if available', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Similar')) {
        cy.contains(/similar/i).should('be.visible');
      }
    });
  });
});
