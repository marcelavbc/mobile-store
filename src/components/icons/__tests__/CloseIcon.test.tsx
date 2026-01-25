import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CloseIcon } from '../CloseIcon';

describe('CloseIcon', () => {
  it('renders the close icon SVG', () => {
    const { container } = render(<CloseIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '19');
    expect(svg).toHaveAttribute('viewBox', '0 0 20 19');
  });

  it('applies custom className', () => {
    const { container } = render(<CloseIcon className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('renders without className', () => {
    const { container } = render(<CloseIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct path element', () => {
    const { container } = render(<CloseIcon />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('fill', 'black');
  });
});
