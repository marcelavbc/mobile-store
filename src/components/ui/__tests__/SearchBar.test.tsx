import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SearchBar } from '../SearchBar';

// Mock CloseIcon component
jest.mock('@/components/icons', () => ({
  CloseIcon: () => <div data-testid="close-icon">X</div>,
}));

describe('SearchBar', () => {
  const mockOnChange = jest.fn();
  const mockOnClear = jest.fn();

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    onClear: mockOnClear,
    resultsCount: 0,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input with placeholder', () => {
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search for a smartphone...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('aria-label', 'Search for a smartphone');
  });

  it('displays the provided value in input', () => {
    render(<SearchBar {...defaultProps} value="iPhone" />);

    const input = screen.getByDisplayValue('iPhone');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types in input', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchBar {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search for a smartphone...');
    
    // Simulate controlled component behavior by updating value prop
    await user.type(input, 'A');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    
    // Re-render with the new value to simulate the controlled component
    rerender(<SearchBar {...defaultProps} value="A" />);
    expect(input).toHaveValue('A');
  });

  it('shows clear button when value is present', () => {
    render(<SearchBar {...defaultProps} value="test" />);

    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toBeInTheDocument();
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    render(<SearchBar {...defaultProps} value="" />);

    const clearButton = screen.queryByRole('button', { name: 'Clear search' });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} value="test search" />);

    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    await user.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('displays correct results count when not loading', () => {
    render(<SearchBar {...defaultProps} resultsCount={5} />);

    expect(screen.getByText('5 RESULTS')).toBeInTheDocument();
  });

  it('displays loading state when isLoading is true', () => {
    render(<SearchBar {...defaultProps} resultsCount={5} isLoading={true} />);

    expect(screen.getByText('... RESULTS')).toBeInTheDocument();
    expect(screen.queryByText('5 RESULTS')).not.toBeInTheDocument();
  });

  it('displays zero results correctly', () => {
    render(<SearchBar {...defaultProps} resultsCount={0} />);

    expect(screen.getByText('0 RESULTS')).toBeInTheDocument();
  });

  it('displays large numbers correctly', () => {
    render(<SearchBar {...defaultProps} resultsCount={1234} />);

    expect(screen.getByText('1234 RESULTS')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SearchBar {...defaultProps} value="test" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Search for a smartphone');

    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toHaveAttribute('type', 'button');
    expect(clearButton).toHaveAttribute('aria-label', 'Clear search');
  });

  it('integrates properly with user interactions', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchBar {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search for a smartphone...');

    // Type some text and simulate controlled component update
    await user.type(input, 't');
    rerender(<SearchBar {...defaultProps} value="test" />);
    expect(mockOnChange).toHaveBeenCalled();

    // Clear button should appear when value is present
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toBeInTheDocument();

    // Click clear button
    await user.click(clearButton);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('handles onChange callback correctly', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search for a smartphone...');

    // Type single character and verify onChange is called
    await user.type(input, 'a');

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('a');
  });

  it('uses default isLoading value when not provided', () => {
    // Test that isLoading defaults to false (line 17)
    const propsWithoutIsLoading = {
      value: '',
      onChange: mockOnChange,
      onClear: mockOnClear,
      resultsCount: 5,
      // isLoading not provided, should default to false
    };

    render(<SearchBar {...propsWithoutIsLoading} />);

    // Should show results count, not loading state
    expect(screen.getByText('5 RESULTS')).toBeInTheDocument();
    expect(screen.queryByText('... RESULTS')).not.toBeInTheDocument();
  });

  it('handles isLoading transition from false to true', () => {
    const { rerender } = render(<SearchBar {...defaultProps} resultsCount={10} isLoading={false} />);

    expect(screen.getByText('10 RESULTS')).toBeInTheDocument();

    // Change to loading
    rerender(<SearchBar {...defaultProps} resultsCount={10} isLoading={true} />);

    expect(screen.getByText('... RESULTS')).toBeInTheDocument();
    expect(screen.queryByText('10 RESULTS')).not.toBeInTheDocument();
  });

  it('handles isLoading transition from true to false', () => {
    const { rerender } = render(<SearchBar {...defaultProps} resultsCount={15} isLoading={true} />);

    expect(screen.getByText('... RESULTS')).toBeInTheDocument();

    // Change to not loading
    rerender(<SearchBar {...defaultProps} resultsCount={15} isLoading={false} />);

    expect(screen.getByText('15 RESULTS')).toBeInTheDocument();
    expect(screen.queryByText('... RESULTS')).not.toBeInTheDocument();
  });
});
