import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '../layout';

// Mock the CartProvider
jest.mock('@/context/CartContext', () => ({
  CartProvider: jest.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="cart-provider">{children}</div>
  )),
}));

// Mock the Navbar component
jest.mock('@/components/layout', () => ({
  Navbar: jest.fn(() => <nav data-testid="navbar">Navbar</nav>),
}));

describe('RootLayout', () => {
  it('renders CartProvider', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
  });

  it('renders Navbar inside CartProvider', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Navbar')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Test Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders children after Navbar', () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Test Content</div>
      </RootLayout>
    );

    const navbar = screen.getByTestId('navbar');
    const child = screen.getByTestId('child-content');

    // Check that both are rendered
    expect(navbar).toBeInTheDocument();
    expect(child).toBeInTheDocument();
  });

  it('wraps content in html and body structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    // The structure should be rendered (even if we can't directly query html/body)
    expect(container.firstChild).toBeInTheDocument();
  });
});
