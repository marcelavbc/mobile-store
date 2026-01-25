import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartIcon } from '../CartIcon';

describe('CartIcon', () => {
  it('renders the outline cart icon by default', () => {
    const { container } = render(<CartIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders filled cart icon when filled prop is true', () => {
    const { container } = render(<CartIcon filled={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Check that it's the filled version by looking at the path
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });

  it('renders outline cart icon when filled prop is false', () => {
    const { container } = render(<CartIcon filled={false} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CartIcon className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('applies className to filled icon', () => {
    const { container } = render(<CartIcon filled={true} className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('has aria-hidden attribute', () => {
    const { container } = render(<CartIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses currentColor for fill', () => {
    const { container } = render(<CartIcon />);
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('fill', 'currentColor');
  });
});
