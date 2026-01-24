import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhoneCard } from '../PhoneCard';
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

describe('PhoneCard', () => {
  const mockPhone: Phone = {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 15 Pro',
    basePrice: 1199,
    imageUrl: 'https://example.com/iphone15pro.jpg',
  };

  it('renders phone information correctly', () => {
    render(<PhoneCard phone={mockPhone} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText('1199 EUR')).toBeInTheDocument();
  });

  it('renders image with correct attributes', () => {
    render(<PhoneCard phone={mockPhone} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockPhone.imageUrl);
    expect(image).toHaveAttribute('alt', 'Apple iPhone 15 Pro');
  });

  it('creates correct link to product detail page', () => {
    render(<PhoneCard phone={mockPhone} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/1');
  });

  it('displays brand with correct styling class', () => {
    render(<PhoneCard phone={mockPhone} />);

    const brandElement = screen.getByText('Apple');
    expect(brandElement).toHaveClass('brand');
  });

  it('displays name with correct styling class', () => {
    render(<PhoneCard phone={mockPhone} />);

    const nameElement = screen.getByText('iPhone 15 Pro');
    expect(nameElement).toHaveClass('name');
  });

  it('displays price with correct styling class and EUR suffix', () => {
    render(<PhoneCard phone={mockPhone} />);

    const priceElement = screen.getByText('1199 EUR');
    expect(priceElement).toHaveClass('price');
  });

  it('renders with correct card structure', () => {
    render(<PhoneCard phone={mockPhone} />);

    const card = screen.getByRole('link');
    expect(card).toHaveClass('card');

    // Check for image wrapper
    const imageWrapper = card.querySelector('.imageWrapper');
    expect(imageWrapper).toBeInTheDocument();

    // Check for info section
    const infoSection = card.querySelector('.info');
    expect(infoSection).toBeInTheDocument();

    // Check for details section
    const detailsSection = card.querySelector('.details');
    expect(detailsSection).toBeInTheDocument();
  });

  it('handles different phone data correctly', () => {
    const samsungPhone: Phone = {
      id: '2',
      brand: 'Samsung',
      name: 'Galaxy S24 Ultra',
      basePrice: 1299,
      imageUrl: 'https://example.com/galaxys24ultra.jpg',
    };

    render(<PhoneCard phone={samsungPhone} />);

    expect(screen.getByText('Samsung')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
    expect(screen.getByText('1299 EUR')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/2');
  });

  it('handles long phone names', () => {
    const phoneWithLongName: Phone = {
      id: '3',
      brand: 'Xiaomi',
      name: 'Mi 14 Pro Max Ultra Special Edition',
      basePrice: 899,
      imageUrl: 'https://example.com/xiaomi.jpg',
    };

    render(<PhoneCard phone={phoneWithLongName} />);

    expect(screen.getByText('Mi 14 Pro Max Ultra Special Edition')).toBeInTheDocument();
    expect(screen.getByText('899 EUR')).toBeInTheDocument();
  });

  it('handles price without distortion', () => {
    const expensivePhone: Phone = {
      id: '4',
      brand: 'Google',
      name: 'Pixel 8a',
      basePrice: 10999,
      imageUrl: 'https://example.com/pixel8a.jpg',
    };

    render(<PhoneCard phone={expensivePhone} />);

    const priceElement = screen.getByText('10999 EUR');
    expect(priceElement).toBeInTheDocument();
    expect(priceElement).toHaveClass('price');
  });

  it('has proper accessibility attributes', () => {
    render(<PhoneCard phone={mockPhone} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Apple iPhone 15 Pro');

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('renders as a clickable card component', () => {
    render(<PhoneCard phone={mockPhone} />);

    const card = screen.getByRole('link');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('href', '/products/1');

    // Verify it contains all expected content
    expect(card).toContainElement(screen.getByText('Apple'));
    expect(card).toContainElement(screen.getByText('iPhone 15 Pro'));
    expect(card).toContainElement(screen.getByText('1199 EUR'));
    expect(card).toContainElement(screen.getByRole('img'));
  });
});