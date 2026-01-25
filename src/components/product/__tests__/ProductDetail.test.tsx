import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ProductDetail } from '../ProductDetail';
import { PhoneDetail, Phone } from '@/types';

// Mock hooks
jest.mock('@/hooks', () => ({
  useProductSelection: jest.fn(),
}));

jest.mock('@/context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock child components
jest.mock('../ProductCarousel', () => ({
  ProductCarousel: jest.fn(({ products, title }: { products: Phone[]; title?: string }) => (
    <div data-testid="product-carousel">
      {title && <h2>{title}</h2>}
      {products.map((p) => (
        <div key={p.id} data-testid={`similar-${p.id}`}>
          {p.name}
        </div>
      ))}
    </div>
  )),
}));

jest.mock('@/components/icons', () => ({
  BackIcon: jest.fn(() => <svg data-testid="back-icon" />),
}));

// Mock next/image and next/link
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    className,
    ...props
  }: {
    src: string;
    alt: string;
    className?: string;
    [key: string]: unknown;
  }) {
    // Filter out Next.js Image-specific props (fill, priority, sizes) that aren't valid HTML attributes
    return <img src={src} alt={alt} data-testid="product-image" className={className} {...props} />;
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

// Mock utils
jest.mock('@/utils/cart', () => ({
  generateLineId: jest.fn((phoneId, storage, colorHex) => `${phoneId}-${storage}-${colorHex}`),
}));

import { useProductSelection } from '@/hooks';
import { useCart } from '@/context/CartContext';
import { generateLineId } from '@/utils/cart';

const mockUseProductSelection = useProductSelection as jest.MockedFunction<
  typeof useProductSelection
>;
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockGenerateLineId = generateLineId as jest.MockedFunction<typeof generateLineId>;

// Test data
const mockPhone: PhoneDetail = {
  id: 'phone-1',
  brand: 'Apple',
  name: 'iPhone 15 Pro',
  description: 'The latest iPhone with advanced features',
  basePrice: 999,
  rating: 4.5,
  specs: {
    screen: '6.1 inches',
    resolution: '2556 x 1179',
    processor: 'A17 Pro',
    mainCamera: '48MP',
    selfieCamera: '12MP',
    battery: '3274 mAh',
    os: 'iOS 17',
    screenRefreshRate: '120Hz',
  },
  colorOptions: [
    {
      name: 'Black',
      hexCode: '#000000',
      imageUrl: 'https://example.com/iphone-black.jpg',
    },
    {
      name: 'White',
      hexCode: '#FFFFFF',
      imageUrl: 'https://example.com/iphone-white.jpg',
    },
  ],
  storageOptions: [
    { capacity: '128GB', price: 999 },
    { capacity: '256GB', price: 1099 },
    { capacity: '512GB', price: 1299 },
  ],
  similarProducts: [
    {
      id: 'phone-2',
      brand: 'Apple',
      name: 'iPhone 15',
      basePrice: 799,
      imageUrl: 'https://example.com/iphone15.jpg',
    },
  ],
};

describe('ProductDetail', () => {
  const mockAddItem = jest.fn();
  const mockHandleStorageSelect = jest.fn();
  const mockHandleColorSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCart.mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: jest.fn(),
      clear: jest.fn(),
      totalPrice: 0,
      count: 0,
    });

    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });
  });

  it('renders product information correctly', () => {
    render(<ProductDetail phone={mockPhone} />);

    expect(screen.getByText('Apple iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText(/From 999 EUR/)).toBeInTheDocument();
    expect(screen.getByText('The latest iPhone with advanced features')).toBeInTheDocument();
  });

  it('renders back button with link to home', () => {
    render(<ProductDetail phone={mockPhone} />);

    const backLink = screen.getByText('BACK').closest('a');
    expect(backLink).toHaveAttribute('href', '/');
    expect(screen.getByTestId('back-icon')).toBeInTheDocument();
  });

  it('renders storage options', () => {
    render(<ProductDetail phone={mockPhone} />);

    expect(screen.getByText('Storage ¿How much space do you need?')).toBeInTheDocument();
    expect(screen.getByText('128GB')).toBeInTheDocument();
    expect(screen.getByText('256GB')).toBeInTheDocument();
    expect(screen.getByText('512GB')).toBeInTheDocument();
  });

  it('renders color options', () => {
    render(<ProductDetail phone={mockPhone} />);

    expect(screen.getByText('Color (pick your favourite)')).toBeInTheDocument();
    expect(screen.getByLabelText('Color: Black')).toBeInTheDocument();
    expect(screen.getByLabelText('Color: White')).toBeInTheDocument();
  });

  it('renders product image when color is selected', () => {
    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: mockPhone.colorOptions[0],
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    const image = screen.getByTestId('product-image');
    expect(image).toHaveAttribute('src', 'https://example.com/iphone-black.jpg');
    expect(image).toHaveAttribute('alt', 'Apple iPhone 15 Pro');
  });

  it('renders fallback when no image is available', () => {
    const phoneWithoutImage = {
      ...mockPhone,
      colorOptions: [
        {
          name: 'Black',
          hexCode: '#000000',
          imageUrl: '',
        },
      ],
    };

    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={phoneWithoutImage} />);

    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('displays base price when no storage is selected', () => {
    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    expect(screen.getByText(/From 999 EUR/)).toBeInTheDocument();
  });

  it('displays selected storage price when storage is selected', () => {
    mockUseProductSelection.mockReturnValue({
      selectedStorage: mockPhone.storageOptions[1], // 256GB - 1099
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    expect(screen.getByText('1099 EUR')).toBeInTheDocument();
  });

  it('displays selected color name when color is selected', () => {
    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: mockPhone.colorOptions[0],
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    expect(screen.getByText('Black')).toBeInTheDocument();
  });

  it('disables add to cart button when storage or color is not selected', () => {
    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    const addButton = screen.getByRole('button', { name: /Add to cart/i });
    expect(addButton).toBeDisabled();
  });

  it('enables add to cart button when both storage and color are selected', () => {
    mockUseProductSelection.mockReturnValue({
      selectedStorage: mockPhone.storageOptions[0],
      selectedColor: mockPhone.colorOptions[0],
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    const addButton = screen.getByRole('button', { name: /Add to cart/i });
    expect(addButton).not.toBeDisabled();
  });

  it('calls handleStorageSelect when storage option is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductDetail phone={mockPhone} />);

    const storageButton = screen.getByRole('button', { name: '128GB' });
    await user.click(storageButton);

    expect(mockHandleStorageSelect).toHaveBeenCalledWith(mockPhone.storageOptions[0]);
  });

  it('calls handleColorSelect when color option is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductDetail phone={mockPhone} />);

    const colorButton = screen.getByLabelText('Color: Black');
    await user.click(colorButton);

    expect(mockHandleColorSelect).toHaveBeenCalledWith(mockPhone.colorOptions[0]);
  });

  it('adds item to cart when add to cart button is clicked', async () => {
    const user = userEvent.setup();
    const selectedStorage = mockPhone.storageOptions[1]; // 256GB
    const selectedColor = mockPhone.colorOptions[0]; // Black

    mockUseProductSelection.mockReturnValue({
      selectedStorage,
      selectedColor,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    const addButton = screen.getByRole('button', { name: /Add to cart/i });
    await user.click(addButton);

    expect(mockGenerateLineId).toHaveBeenCalledWith(
      mockPhone.id,
      selectedStorage.capacity,
      selectedColor.hexCode
    );

    expect(mockAddItem).toHaveBeenCalledWith({
      lineId: expect.any(String),
      phoneId: mockPhone.id,
      name: mockPhone.name,
      brand: mockPhone.brand,
      imageUrl: selectedColor.imageUrl,
      storage: selectedStorage.capacity,
      colorName: selectedColor.name,
      colorHex: selectedColor.hexCode,
      unitPrice: selectedStorage.price,
    });
  });

  it('does not add item to cart when button is disabled', async () => {
    const user = userEvent.setup();
    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    const addButton = screen.getByRole('button', { name: /Add to cart/i });
    expect(addButton).toBeDisabled();

    // Try to click (should not trigger)
    await user.click(addButton);

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('renders specifications correctly', () => {
    render(<ProductDetail phone={mockPhone} />);

    expect(screen.getByText('Specifications')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Screen')).toBeInTheDocument();
    expect(screen.getByText('6.1 inches')).toBeInTheDocument();
    expect(screen.getByText('Processor')).toBeInTheDocument();
    expect(screen.getByText('A17 Pro')).toBeInTheDocument();
  });

  it('filters out empty specification values', () => {
    const phoneWithEmptySpecs: PhoneDetail = {
      ...mockPhone,
      specs: {
        screen: '6.1 inches',
        resolution: '',
        processor: 'A17 Pro',
        mainCamera: '',
        selfieCamera: '',
        battery: '',
        os: '',
        screenRefreshRate: '',
      },
    };

    render(<ProductDetail phone={phoneWithEmptySpecs} />);

    expect(screen.getByText('Screen')).toBeInTheDocument();
    expect(screen.getByText('6.1 inches')).toBeInTheDocument();
    expect(screen.getByText('Processor')).toBeInTheDocument();
    expect(screen.getByText('A17 Pro')).toBeInTheDocument();
    // Empty specs should not be rendered
    expect(screen.queryByText('Resolution')).not.toBeInTheDocument();
  });

  it('renders ProductCarousel with similar products', () => {
    render(<ProductDetail phone={mockPhone} />);

    expect(screen.getByTestId('product-carousel')).toBeInTheDocument();
    expect(screen.getByText('Similar items')).toBeInTheDocument();
    expect(screen.getByTestId('similar-phone-2')).toBeInTheDocument();
  });

  it('handles phone without storage options', () => {
    const phoneWithoutStorage: PhoneDetail = {
      ...mockPhone,
      storageOptions: [],
    };

    render(<ProductDetail phone={phoneWithoutStorage} />);

    // Section title still renders, but no buttons
    expect(screen.getByText('Storage ¿How much space do you need?')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '128GB' })).not.toBeInTheDocument();
  });

  it('handles phone without color options', () => {
    const phoneWithoutColors: PhoneDetail = {
      ...mockPhone,
      colorOptions: [],
    };

    render(<ProductDetail phone={phoneWithoutColors} />);

    // Section title still renders, but no color buttons
    expect(screen.getByText('Color (pick your favourite)')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Color:/)).not.toBeInTheDocument();
  });

  it('handles phone without similar products', () => {
    const phoneWithoutSimilar: PhoneDetail = {
      ...mockPhone,
      similarProducts: [],
    };

    render(<ProductDetail phone={phoneWithoutSimilar} />);

    // ProductCarousel should still render but empty
    expect(screen.getByTestId('product-carousel')).toBeInTheDocument();
  });

  it('handles phone with null storageOptions', () => {
    const phoneWithNullStorage = {
      ...mockPhone,
      storageOptions: null,
    } as unknown as PhoneDetail;

    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={phoneWithNullStorage} />);

    // Should not crash and should pass empty array to useProductSelection
    expect(mockUseProductSelection).toHaveBeenCalledWith({
      storageOptions: [],
      colorOptions: expect.any(Array),
    });
  });

  it('handles phone with undefined storageOptions', () => {
    const phoneWithUndefinedStorage = {
      ...mockPhone,
      storageOptions: undefined,
    } as unknown as PhoneDetail;

    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={phoneWithUndefinedStorage} />);

    expect(mockUseProductSelection).toHaveBeenCalledWith({
      storageOptions: [],
      colorOptions: expect.any(Array),
    });
  });

  it('handles phone with null colorOptions', () => {
    const phoneWithNullColor = {
      ...mockPhone,
      colorOptions: null,
    } as unknown as PhoneDetail;

    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={phoneWithNullColor} />);

    expect(mockUseProductSelection).toHaveBeenCalledWith({
      storageOptions: expect.any(Array),
      colorOptions: [],
    });
  });

  it('handles phone with undefined colorOptions', () => {
    const phoneWithUndefinedColor = {
      ...mockPhone,
      colorOptions: undefined,
    } as unknown as PhoneDetail;

    mockUseProductSelection.mockReturnValue({
      selectedStorage: null,
      selectedColor: null,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={phoneWithUndefinedColor} />);

    expect(mockUseProductSelection).toHaveBeenCalledWith({
      storageOptions: expect.any(Array),
      colorOptions: [],
    });
  });

  it('handles phone with null similarProducts', () => {
    const phoneWithNullSimilar = {
      ...mockPhone,
      similarProducts: null,
    } as unknown as PhoneDetail;

    render(<ProductDetail phone={phoneWithNullSimilar} />);

    expect(screen.getByTestId('product-carousel')).toBeInTheDocument();
  });

  it('handles phone with undefined similarProducts', () => {
    const phoneWithUndefinedSimilar = {
      ...mockPhone,
      similarProducts: undefined,
    } as unknown as PhoneDetail;

    render(<ProductDetail phone={phoneWithUndefinedSimilar} />);

    expect(screen.getByTestId('product-carousel')).toBeInTheDocument();
  });

  it('does not add to cart when button is disabled and clicked', async () => {
    const user = userEvent.setup();
    const mockAddItem = jest.fn();

    mockUseCart.mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: jest.fn(),
      clear: jest.fn(),
      totalPrice: 0,
      count: 0,
    });

    mockUseProductSelection.mockReturnValue({
      selectedStorage: null, // Not selected
      selectedColor: null, // Not selected
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    const addButton = screen.getByRole('button', { name: /Add to cart/i });
    expect(addButton).toBeDisabled();

    // Try to click disabled button
    await user.click(addButton);

    // Should not call addItem because button is disabled and early return
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('does not add to cart when isAddToCartEnabled is false even if selected', async () => {
    const user = userEvent.setup();
    const mockAddItem = jest.fn();

    mockUseCart.mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: jest.fn(),
      clear: jest.fn(),
      totalPrice: 0,
      count: 0,
    });

    // Simulate a case where selectedStorage or selectedColor becomes null
    mockUseProductSelection.mockReturnValue({
      selectedStorage: mockPhone.storageOptions[0],
      selectedColor: null, // Missing color
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    const addButton = screen.getByRole('button', { name: /Add to cart/i });

    // Button should be disabled
    expect(addButton).toBeDisabled();

    // Even if we somehow trigger onClick, it should early return
    await user.click(addButton);
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('adds item to cart with null imageUrl when color has no imageUrl', async () => {
    const user = userEvent.setup();
    const mockAddItem = jest.fn();

    const colorWithoutImage = {
      name: 'Black',
      hexCode: '#000000',
      imageUrl: null,
    } as unknown as PhoneDetail['colorOptions'][0];

    const phoneWithColorNoImage: PhoneDetail = {
      ...mockPhone,
      colorOptions: [colorWithoutImage],
    };

    mockUseCart.mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: jest.fn(),
      clear: jest.fn(),
      totalPrice: 0,
      count: 0,
    });

    mockUseProductSelection.mockReturnValue({
      selectedStorage: phoneWithColorNoImage.storageOptions[0],
      selectedColor: colorWithoutImage,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={phoneWithColorNoImage} />);

    const addButton = screen.getByRole('button', { name: /Add to cart/i });
    await user.click(addButton);

    // Should add item with imageUrl as null (line 152: selectedColor.imageUrl ?? null)
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        imageUrl: null,
      })
    );
  });

  it('executes full onClick handler flow when button is enabled', async () => {
    const user = userEvent.setup();
    const mockAddItem = jest.fn();
    const selectedStorage = mockPhone.storageOptions[1]; // 256GB - 1099
    const selectedColor = mockPhone.colorOptions[1]; // White

    mockUseCart.mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: jest.fn(),
      clear: jest.fn(),
      totalPrice: 0,
      count: 0,
    });

    mockUseProductSelection.mockReturnValue({
      selectedStorage,
      selectedColor,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    const addButton = screen.getByRole('button', { name: /Add to cart/i });
    expect(addButton).not.toBeDisabled();

    await user.click(addButton);

    // Verify the complete flow: generateLineId is called
    expect(mockGenerateLineId).toHaveBeenCalledWith(
      mockPhone.id,
      selectedStorage.capacity,
      selectedColor.hexCode
    );

    // Verify addItem is called with all correct properties (lines 147-157)
    expect(mockAddItem).toHaveBeenCalledWith({
      lineId: expect.any(String),
      phoneId: mockPhone.id,
      name: mockPhone.name,
      brand: mockPhone.brand,
      imageUrl: selectedColor.imageUrl ?? null,
      storage: selectedStorage.capacity,
      colorName: selectedColor.name,
      colorHex: selectedColor.hexCode,
      unitPrice: selectedStorage.price, // Should use selectedStorage.price, not basePrice
    });
  });

  it('shows "Added!" feedback when item is added to cart', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockAddItem = jest.fn();
    const selectedStorage = mockPhone.storageOptions[0];
    const selectedColor = mockPhone.colorOptions[0];

    mockUseCart.mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: jest.fn(),
      clear: jest.fn(),
      totalPrice: 0,
      count: 0,
    });

    mockUseProductSelection.mockReturnValue({
      selectedStorage,
      selectedColor,
      handleStorageSelect: mockHandleStorageSelect,
      handleColorSelect: mockHandleColorSelect,
      reset: jest.fn(),
    });

    render(<ProductDetail phone={mockPhone} />);

    const addButton = screen.getByRole('button', { name: /Add to cart/i });
    await user.click(addButton);

    // Should show "Added!" immediately
    expect(screen.getByText('Added!')).toBeInTheDocument();
    expect(addButton).toHaveClass('ctaAdded');

    // After 2 seconds, should return to "Add to cart"
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
      expect(screen.queryByText('Added!')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
