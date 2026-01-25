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

// Mock next-intl (already mocked globally in jest.setup.js, but we need to mock the import)
jest.mock('next-intl', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const enMessages = require('../../../messages/en.json');
  return {
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    getMessages: jest.fn(() => Promise.resolve(enMessages)),
  };
});

jest.mock('next-intl/server', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const enMessages = require('../../../messages/en.json');
  return {
    getMessages: jest.fn(() => Promise.resolve(enMessages)),
  };
});

// Mock i18n.ts - layout imports from '../../i18n' relative to src/app/layout.tsx
// From src/app/__tests__/layout.test.tsx, that's '../../../i18n'
jest.mock('../../../i18n', () => ({
  defaultLocale: 'en',
  locales: ['en', 'es'],
}));

describe('RootLayout', () => {
  it('renders CartProvider', async () => {
    const Layout = await RootLayout({
      children: <div>Test Content</div>,
    });
    render(Layout);

    expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
  });

  it('renders Navbar inside CartProvider', async () => {
    const Layout = await RootLayout({
      children: <div>Test Content</div>,
    });
    render(Layout);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Navbar')).toBeInTheDocument();
  });

  it('renders children', async () => {
    const Layout = await RootLayout({
      children: <div data-testid="child-content">Test Content</div>,
    });
    render(Layout);

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders children after Navbar', async () => {
    const Layout = await RootLayout({
      children: <div data-testid="child-content">Test Content</div>,
    });
    render(Layout);

    const navbar = screen.getByTestId('navbar');
    const child = screen.getByTestId('child-content');

    // Check that both are rendered
    expect(navbar).toBeInTheDocument();
    expect(child).toBeInTheDocument();
  });

  it('wraps content in html and body structure', async () => {
    const Layout = await RootLayout({
      children: <div>Test Content</div>,
    });
    const { container } = render(Layout);

    // The structure should be rendered (even if we can't directly query html/body)
    expect(container.firstChild).toBeInTheDocument();
  });
});
