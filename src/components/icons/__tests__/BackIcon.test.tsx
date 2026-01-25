import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BackIcon } from '../BackIcon';

describe('BackIcon', () => {
  it('renders the back icon SVG', () => {
    const { container } = render(<BackIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
    expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
  });

  it('applies custom className', () => {
    const { container } = render(<BackIcon className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('renders without className', () => {
    const { container } = render(<BackIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct path element', () => {
    const { container } = render(<BackIcon />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('fill', 'black');
  });
});
