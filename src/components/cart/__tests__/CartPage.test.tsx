import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CartPage } from '../CartPage';
import { CartItem } from '@/types';

// Mock hooks
jest.mock('@/context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock utils
jest.mock('@/utils/cart', () => ({
  generateLineId: jest.fn((phoneId, storage, colorHex) => `${phoneId}-${storage}-${colorHex}`),
  getCartItemName: jest.fn((item) => item.name || `${item.brand} ${item.name}`.trim() || 'Unknown Product'),
}));

// Mock next/image and next/link
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) {
    return <img src={src} alt={alt} data-testid="cart-item-image" {...props} />;
  },
}));

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

import { useCart } from '@/context/CartContext';
import { generateLineId, getCartItemName } from '@/utils/cart';

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockGenerateLineId = generateLineId as jest.MockedFunction<typeof generateLineId>;
const mockGetCartItemName = getCartItemName as jest.MockedFunction<typeof getCartItemName>;

// Test data
const mockCartItem1: CartItem = {
  lineId: 'item-1',
  phoneId: 'phone-1',
  name: 'iPhone 15 Pro',
  brand: 'Apple',
  imageUrl: 'https://example.com/iphone.jpg',
  storage: '256GB',
  colorName: 'Black',
  colorHex: '#000000',
  unitPrice: 1099,
};

const mockCartItem2: CartItem = {
  lineId: 'item-2',
  phoneId: 'phone-2',
  name: 'Galaxy S24',
  brand: 'Samsung',
  imageUrl: 'https://example.com/galaxy.jpg',
  storage: '128GB',
  colorName: 'White',
  colorHex: '#FFFFFF',
  unitPrice: 899,
};

const mockCartItemWithoutImage: CartItem = {
  lineId: 'item-3',
  phoneId: 'phone-3',
  name: 'Pixel 8',
  brand: 'Google',
  imageUrl: null,
  storage: '256GB',
  colorName: 'Blue',
  colorHex: '#0000FF',
  unitPrice: 799,
};

describe('CartPage', () => {
  const mockRemoveItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCartItemName.mockImplementation((item) => item.name);
  });

  describe('Empty cart state', () => {
    it('renders empty cart message and continue shopping button', () => {
      mockUseCart.mockReturnValue({
        items: [],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 0,
        count: 0,
      });

      render(<CartPage />);

      expect(screen.getByText('CART (0)')).toBeInTheDocument();
      expect(screen.getByText('CONTINUE SHOPPING')).toBeInTheDocument();
      expect(screen.getByText('CONTINUE SHOPPING').closest('a')).toHaveAttribute('href', '/');
    });

    it('does not render cart items list when empty', () => {
      mockUseCart.mockReturnValue({
        items: [],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 0,
        count: 0,
      });

      render(<CartPage />);

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      expect(screen.queryByText('TOTAL')).not.toBeInTheDocument();
      expect(screen.queryByText('PAY')).not.toBeInTheDocument();
    });
  });

  describe('Cart with items', () => {
    it('renders cart title with correct count', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItem1],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1099,
        count: 1,
      });

      render(<CartPage />);

      expect(screen.getByText('CART (1)')).toBeInTheDocument();
    });

    it('renders multiple cart items', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItem1, mockCartItem2],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1998,
        count: 2,
      });

      render(<CartPage />);

      expect(screen.getByText('CART (2)')).toBeInTheDocument();
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    });

    it('renders item information correctly', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItem1],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1099,
        count: 1,
      });

      render(<CartPage />);

      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText('256GB | Black')).toBeInTheDocument();
      // Price appears in both item and footer, so use getAllByText
      const prices = screen.getAllByText('1099 EUR');
      expect(prices.length).toBeGreaterThan(0);
    });

    it('renders item image when available', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItem1],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1099,
        count: 1,
      });

      render(<CartPage />);

      const image = screen.getByTestId('cart-item-image');
      expect(image).toHaveAttribute('src', 'https://example.com/iphone.jpg');
      expect(image).toHaveAttribute('alt', 'iPhone 15 Pro');
    });

    it('does not render image when imageUrl is null', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItemWithoutImage],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 799,
        count: 1,
      });

      render(<CartPage />);

      expect(screen.queryByTestId('cart-item-image')).not.toBeInTheDocument();
    });

    it('renders delete button for each item', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItem1, mockCartItem2],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1998,
        count: 2,
      });

      render(<CartPage />);

      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons).toHaveLength(2);
    });

    it('calls removeItem when delete button is clicked', async () => {
      const user = userEvent.setup();
      mockUseCart.mockReturnValue({
        items: [mockCartItem1],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1099,
        count: 1,
      });

      render(<CartPage />);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      expect(mockRemoveItem).toHaveBeenCalledWith('item-1');
    });

    it('uses generateLineId as fallback when lineId is missing', async () => {
      const user = userEvent.setup();
      const itemWithoutLineId: CartItem = {
        ...mockCartItem1,
        lineId: '',
      };

      mockUseCart.mockReturnValue({
        items: [itemWithoutLineId],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1099,
        count: 1,
      });

      mockGenerateLineId.mockReturnValue('phone-1-256GB-#000000');

      render(<CartPage />);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      expect(mockGenerateLineId).toHaveBeenCalledWith('phone-1', '256GB', '#000000');
      expect(mockRemoveItem).toHaveBeenCalledWith('phone-1-256GB-#000000');
    });
  });

  describe('Cart footer', () => {
    it('renders total price correctly', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItem1, mockCartItem2],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1998,
        count: 2,
      });

      render(<CartPage />);

      expect(screen.getByText('TOTAL')).toBeInTheDocument();
      expect(screen.getByText('1998 EUR')).toBeInTheDocument();
      expect(screen.getByText('TOTAL 1998 EUR')).toBeInTheDocument();
    });

    it('renders continue shopping button in footer', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItem1],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1099,
        count: 1,
      });

      render(<CartPage />);

      const continueButtons = screen.getAllByText('CONTINUE SHOPPING');
      expect(continueButtons.length).toBeGreaterThan(0);
      
      const footerButton = continueButtons.find(btn => 
        btn.closest('a')?.getAttribute('href') === '/'
      );
      expect(footerButton).toBeInTheDocument();
    });

    it('renders pay button', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItem1],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1099,
        count: 1,
      });

      render(<CartPage />);

      // PAY button appears twice (mobile and desktop layouts)
      const payButtons = screen.getAllByRole('button', { name: 'PAY' });
      expect(payButtons.length).toBe(2);
      payButtons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });

    it('renders both mobile and desktop footer layouts', () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItem1],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1099,
        count: 1,
      });

      render(<CartPage />);

      // Mobile layout
      expect(screen.getByText('TOTAL')).toBeInTheDocument();
      // Price appears in item, mobile footer, and desktop footer
      const prices = screen.getAllByText('1099 EUR');
      expect(prices.length).toBeGreaterThan(0);

      // Desktop layout (inline)
      expect(screen.getByText('TOTAL 1099 EUR')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles item with missing name gracefully', () => {
      const itemWithoutName: CartItem = {
        ...mockCartItem1,
        name: '',
      };

      mockGetCartItemName.mockReturnValue('Apple ');

      mockUseCart.mockReturnValue({
        items: [itemWithoutName],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 1099,
        count: 1,
      });

      render(<CartPage />);

      expect(mockGetCartItemName).toHaveBeenCalledWith(itemWithoutName);
    });

    it('handles zero total price', () => {
      mockUseCart.mockReturnValue({
        items: [],
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        clear: jest.fn(),
        totalPrice: 0,
        count: 0,
      });

      render(<CartPage />);

      expect(screen.getByText('CART (0)')).toBeInTheDocument();
    });
  });
});
