import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCarousel } from '../ProductCarousel';
import { Phone } from '@/types';

// Mock next/link and next/image
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) {
    return <img src={src} alt={alt} className={className} />;
  };
});

// Mock useScrollProgress hook
jest.mock('@/hooks', () => ({
  useScrollProgress: jest.fn(() => ({
    ref: { current: null },
    progress: { left: 0, width: 50 },
  })),
}));

// Mock PhoneCard component
jest.mock('@/components/catalog', () => ({
  PhoneCard: jest.fn(({ phone }: { phone: Phone }) => (
    <div data-testid={`phone-card-${phone.id}`}>
      {phone.brand} {phone.name}
    </div>
  )),
}));

describe('ProductCarousel', () => {
  const mockProducts: Phone[] = [
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
    {
      id: '3',
      brand: 'Google',
      name: 'Pixel 8',
      basePrice: 699,
      imageUrl: 'https://example.com/pixel.jpg',
    },
  ];

  it('renders nothing when products array is empty', () => {
    const { container } = render(<ProductCarousel products={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when products is null', () => {
    const { container } = render(<ProductCarousel products={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when products is undefined', () => {
    const { container } = render(<ProductCarousel products={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders products without title', () => {
    render(<ProductCarousel products={mockProducts} />);

    expect(screen.getByTestId('phone-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-3')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders products with title', () => {
    render(<ProductCarousel products={mockProducts} title="Similar Products" />);

    expect(screen.getByRole('heading', { name: 'Similar Products' })).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-3')).toBeInTheDocument();
  });

  it('renders single product', () => {
    render(<ProductCarousel products={[mockProducts[0]]} title="Featured" />);

    expect(screen.getByRole('heading', { name: 'Featured' })).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('phone-card-2')).not.toBeInTheDocument();
  });

  it('renders progress indicator', () => {
    const { container } = render(<ProductCarousel products={mockProducts} />);

    const progressFill = container.querySelector('[style*="left"]');
    expect(progressFill).toBeInTheDocument();
  });

  it('uses useScrollProgress hook with products as dependency', () => {
    const { useScrollProgress } = require('@/hooks');
    render(<ProductCarousel products={mockProducts} />);

    expect(useScrollProgress).toHaveBeenCalledWith({
      dependencies: [mockProducts],
    });
  });

  it('updates when products change', () => {
    const { rerender } = render(<ProductCarousel products={mockProducts} />);

    expect(screen.getByTestId('phone-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-3')).toBeInTheDocument();

    const newProducts = [mockProducts[0]];
    rerender(<ProductCarousel products={newProducts} />);

    expect(screen.getByTestId('phone-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('phone-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('phone-card-3')).not.toBeInTheDocument();
  });

  it('renders products with unique keys', () => {
    const productsWithDuplicates: Phone[] = [
      ...mockProducts,
      {
        id: '1',
        brand: 'Apple',
        name: 'iPhone 15 Pro',
        basePrice: 1199,
        imageUrl: 'https://example.com/iphone15pro.jpg',
      },
    ];

    render(<ProductCarousel products={productsWithDuplicates} />);

    // Should render all 4 products (including duplicate)
    const phoneCards = screen.getAllByTestId(/phone-card-/);
    expect(phoneCards).toHaveLength(4);
  });
});
