import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductPage from '../page';
import { getPhoneById } from '@/services/api';
import { PhoneDetail } from '@/types';

// Mock the API service
jest.mock('@/services/api', () => ({
  getPhoneById: jest.fn(),
}));

// Mock the ProductDetail component
jest.mock('@/components/product', () => ({
  ProductDetail: jest.fn(({ phone }: { phone: PhoneDetail }) => (
    <div data-testid="product-detail">
      {phone.brand} {phone.name}
    </div>
  )),
}));

describe('Product Page', () => {
  const mockPhone: PhoneDetail = {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 15 Pro',
    description: 'The latest iPhone',
    basePrice: 999,
    rating: 4.5,
    specs: {
      screen: '6.1"',
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
        name: 'Blue',
        hexCode: '#0000FF',
        imageUrl: 'https://example.com/blue.jpg',
      },
    ],
    storageOptions: [
      { capacity: '128GB', price: 999 },
      { capacity: '256GB', price: 1099 },
    ],
    similarProducts: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ProductDetail with phone data', async () => {
    (getPhoneById as jest.Mock).mockResolvedValueOnce(mockPhone);

    const params = Promise.resolve({ id: '1' });
    const component = await ProductPage({ params });
    render(component);

    expect(getPhoneById).toHaveBeenCalledWith('1');
    expect(getPhoneById).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('product-detail')).toBeInTheDocument();
    expect(screen.getByText('Apple iPhone 15 Pro')).toBeInTheDocument();
  });

  it('renders error message when API fails', async () => {
    const errorMessage = 'Product not found';
    (getPhoneById as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const params = Promise.resolve({ id: '999' });
    const component = await ProductPage({ params });
    render(component);

    expect(getPhoneById).toHaveBeenCalledWith('999');
    expect(screen.getByText('Unable to load product')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders default error message when error has no message', async () => {
    (getPhoneById as jest.Mock).mockRejectedValueOnce({});

    const params = Promise.resolve({ id: '999' });
    const component = await ProductPage({ params });
    render(component);

    expect(screen.getByText('Unable to load product')).toBeInTheDocument();
    expect(screen.getByText('Unable to load product data.')).toBeInTheDocument();
  });

  it('renders main element on success', async () => {
    (getPhoneById as jest.Mock).mockResolvedValueOnce(mockPhone);

    const params = Promise.resolve({ id: '1' });
    const component = await ProductPage({ params });
    const { container } = render(component);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('renders main element on error', async () => {
    (getPhoneById as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    const params = Promise.resolve({ id: '999' });
    const component = await ProductPage({ params });
    const { container } = render(component);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('handles different product IDs', async () => {
    (getPhoneById as jest.Mock).mockResolvedValueOnce(mockPhone);

    const params = Promise.resolve({ id: '2' });
    const component = await ProductPage({ params });
    render(component);

    expect(getPhoneById).toHaveBeenCalledWith('2');
  });
});
