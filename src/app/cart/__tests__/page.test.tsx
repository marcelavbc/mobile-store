import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartPageRoute from '../page';

// Mock the CartPage component
jest.mock('@/components/cart', () => ({
  CartPage: jest.fn(() => <div data-testid="cart-page">Cart Page</div>),
}));

describe('Cart Page Route', () => {
  it('renders CartPage component', () => {
    render(<CartPageRoute />);
    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    expect(screen.getByText('Cart Page')).toBeInTheDocument();
  });
});
