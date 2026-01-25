import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Logo } from '../Logo';

describe('Logo', () => {
  it('renders the logo SVG', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '74');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('viewBox', '0 0 77 29');
  });

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('renders without className', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has aria-hidden attribute', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('has path elements with currentColor fill', () => {
    const { container } = render(<Logo />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
    // Check that at least one path uses currentColor
    const hasCurrentColor = Array.from(paths).some(
      (path) => path.getAttribute('fill') === 'currentColor'
    );
    expect(hasCurrentColor).toBe(true);
  });

  it('has clipPath definition', () => {
    const { container } = render(<Logo />);
    const clipPath = container.querySelector('clipPath');
    expect(clipPath).toBeInTheDocument();
    expect(clipPath).toHaveAttribute('id', 'clip0_logo');
  });
});
