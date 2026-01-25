/// <reference types="cypress" />
import { navigationActions } from '../actions/navigation';
import { productActions } from '../actions/product';
import { assertionActions } from '../actions/assertions';
import { cartActions } from '../actions/cart';

/**
 * Product Steps
 * High-level steps that combine multiple actions
 */

export const productSteps = {
  /**
   * Navigate to a product and verify it loads
   * @param productIndex - Index of the product (default: 0)
   */
  navigateToProduct: (productIndex: number = 0) => {
    navigationActions.goToProduct(productIndex);
    assertionActions.verifyProductDetail();
  },

  /**
   * Add a product to cart (selects options if needed and adds to cart)
   * @param productIndex - Index of the product to add (default: 0)
   */
  addProductToCart: (productIndex: number = 0) => {
    navigationActions.goToProduct(productIndex);
    productActions.selectAndAddToCart();
  },

  /**
   * Add product to cart and verify count in navbar
   * @param productIndex - Index of the product to add (default: 0)
   * @param expectedCount - Expected count after adding (default: 1)
   */
  addProductToCartAndVerifyCount: (productIndex: number = 0, expectedCount: number = 1) => {
    productSteps.addProductToCart(productIndex);
    navigationActions.goBackToHome();
    cartActions.verifyCount(expectedCount);
  },
};
