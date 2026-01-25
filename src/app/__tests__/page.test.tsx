import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';
import { getPhones } from '@/services/api';
import { Phone } from '@/types';

// Mock the API service
jest.mock('@/services/api', () => ({
  getPhones: jest.fn(),
}));

// Mock the Catalog component
jest.mock('@/components/catalog', () => ({
  Catalog: jest.fn(({ initialProducts }: { initialProducts: Phone[] }) => (
    <div data-testid="catalog">
      {initialProducts.length} products
    </div>
  )),
}));

describe('Home Page', () => {
  const mockPhones: Phone[] = [
    {
      id: '1',
      brand: 'Apple',
      name: 'iPhone 15 Pro',
      basePrice: 1199,
      imageUrl: 'https://example.com/iphone15pro.jpg',
    },
    {
      id: '2',
      brand: 'Samsung',
      name: 'Galaxy S24',
      basePrice: 899,
      imageUrl: 'https://example.com/galaxy.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Catalog with initial phones', async () => {
    (getPhones as jest.Mock).mockResolvedValueOnce(mockPhones);

    const component = await Home();
    render(component);

    expect(getPhones).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('catalog')).toBeInTheDocument();
    expect(screen.getByText('2 products')).toBeInTheDocument();
  });

  it('renders Catalog with empty array when no phones', async () => {
    (getPhones as jest.Mock).mockResolvedValueOnce([]);

    const component = await Home();
    render(component);

    expect(getPhones).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('catalog')).toBeInTheDocument();
    expect(screen.getByText('0 products')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    (getPhones as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const component = await Home();
    render(component);

    // Should render Catalog with empty array when API fails
    expect(getPhones).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('catalog')).toBeInTheDocument();
    expect(screen.getByText('0 products')).toBeInTheDocument();
  });

  it('renders main element', async () => {
    (getPhones as jest.Mock).mockResolvedValueOnce(mockPhones);

    const component = await Home();
    const { container } = render(component);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
