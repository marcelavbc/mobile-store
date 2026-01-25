import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartProvider, useCart } from '../CartContext';
import { CartItem } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component that uses the cart
function TestComponent() {
  const { items, addItem, removeItem, clear, totalPrice, count } = useCart();

  return (
    <div>
      <div data-testid="count">{count}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <div data-testid="items-count">{items.length}</div>
      <button
        data-testid="add-item-1"
        onClick={() =>
          addItem({
            lineId: '1',
            phoneId: 'phone-1',
            name: 'iPhone 15',
            brand: 'Apple',
            imageUrl: 'https://example.com/iphone.jpg',
            storage: '128GB',
            colorName: 'Black',
            colorHex: '#000000',
            unitPrice: 999,
          })
        }
      >
        Add Item 1
      </button>
      <button
        data-testid="add-item-2"
        onClick={() =>
          addItem({
            lineId: '2',
            phoneId: 'phone-2',
            name: 'Galaxy S24',
            brand: 'Samsung',
            imageUrl: 'https://example.com/galaxy.jpg',
            storage: '256GB',
            colorName: 'White',
            colorHex: '#FFFFFF',
            unitPrice: 899,
          })
        }
      >
        Add Item 2
      </button>
      <button data-testid="remove-item-1" onClick={() => removeItem('1')}>
        Remove Item 1
      </button>
      <button data-testid="clear-cart" onClick={() => clear()}>
        Clear Cart
      </button>
    </div>
  );
}

// Component to test useCart error
function ComponentWithoutProvider() {
  useCart();
  return <div>Should not render</div>;
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('CartProvider', () => {
    it('provides initial empty cart state', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });

    it('adds items to cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const addButton = screen.getByTestId('add-item-1');
      act(() => {
        addButton.click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('999');
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
    });

    it('prevents duplicate items with same lineId', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const addButton = screen.getByTestId('add-item-1');

      // Add same item twice
      act(() => {
        addButton.click();
        addButton.click();
      });

      // Should still be 1 item
      expect(screen.getByTestId('count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('999');
    });

    it('adds multiple different items', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByTestId('add-item-1').click();
        screen.getByTestId('add-item-2').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('1898'); // 999 + 899
      expect(screen.getByTestId('items-count')).toHaveTextContent('2');
    });

    it('removes items from cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByTestId('add-item-1').click();
        screen.getByTestId('add-item-2').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('2');

      act(() => {
        screen.getByTestId('remove-item-1').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('899');
    });

    it('clears all items from cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByTestId('add-item-1').click();
        screen.getByTestId('add-item-2').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('2');

      act(() => {
        screen.getByTestId('clear-cart').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });

    it('calculates total price correctly', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByTestId('add-item-1').click(); // 999
        screen.getByTestId('add-item-2').click(); // 899
      });

      expect(screen.getByTestId('total-price')).toHaveTextContent('1898');
    });

    it('persists cart to localStorage', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      act(() => {
        screen.getByTestId('add-item-1').click();
      });

      const stored = localStorageMock.getItem('mobile_store_cart_v1');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].lineId).toBe('1');
    });

    it('loads cart from localStorage on mount', () => {
      const initialItems: CartItem[] = [
        {
          lineId: '1',
          phoneId: 'phone-1',
          name: 'iPhone 15',
          brand: 'Apple',
          imageUrl: 'https://example.com/iphone.jpg',
          storage: '128GB',
          colorName: 'Black',
          colorHex: '#000000',
          unitPrice: 999,
        },
      ];

      localStorageMock.setItem('mobile_store_cart_v1', JSON.stringify(initialItems));

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('999');
    });

    it('handles invalid localStorage data gracefully', () => {
      localStorageMock.setItem('mobile_store_cart_v1', 'invalid json');

      // Should not throw error
      expect(() => {
        render(
          <CartProvider>
            <TestComponent />
          </CartProvider>
        );
      }).not.toThrow();

      // Should start with empty cart
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });

  describe('useCart hook', () => {
    it('throws error when used outside CartProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<ComponentWithoutProvider />);
      }).toThrow('useCart must be used within CartProvider');

      consoleError.mockRestore();
    });
  });
});
