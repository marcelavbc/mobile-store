import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Catalog } from '../Catalog';
import { getPhones } from '@/services/api';
import { Phone } from '@/types';

// Mock the API service
jest.mock('@/services/api');
const mockGetPhones = getPhones as jest.MockedFunction<typeof getPhones>;

// Mock child components
jest.mock('@/components/ui', () => ({
  SearchBar: jest.fn(({ value, onChange, onClear, resultsCount, isLoading }) => (
    <div data-testid="search-bar">
      <input
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a smartphone..."
      />
      {value && (
        <button data-testid="clear-button" onClick={onClear}>
          Clear
        </button>
      )}
      <div data-testid="results-count">{isLoading ? '...' : resultsCount} RESULTS</div>
    </div>
  )),
}));

jest.mock('../PhoneCard', () => ({
  PhoneCard: jest.fn(({ phone }) => (
    <div data-testid={`phone-card-${phone.id}`}>
      <span>{phone.brand}</span>
      <span>{phone.name}</span>
      <span>{phone.basePrice}</span>
    </div>
  )),
}));

// Test data
const mockPhones: Phone[] = [
  {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 15',
    basePrice: 999,
    imageUrl: 'https://example.com/iphone15.jpg',
  },
  {
    id: '2',
    brand: 'Samsung',
    name: 'Galaxy S24',
    basePrice: 899,
    imageUrl: 'https://example.com/galaxy-s24.jpg',
  },
];

const mockSearchResults: Phone[] = [
  {
    id: '3',
    brand: 'Apple',
    name: 'iPhone 15 Pro',
    basePrice: 1199,
    imageUrl: 'https://example.com/iphone15pro.jpg',
  },
];

describe('Catalog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial products correctly', () => {
    render(<Catalog initialProducts={mockPhones} />);

    // Should render SearchBar
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();

    // Should render all initial products
    expect(screen.getByTestId('phone-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-2')).toBeInTheDocument();

    // Should show correct results count
    expect(screen.getByTestId('results-count')).toHaveTextContent('2 RESULTS');

    // Should render product details
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('shows empty state when no products provided', () => {
    render(<Catalog initialProducts={[]} />);

    expect(screen.getByTestId('results-count')).toHaveTextContent('0 RESULTS');
    expect(screen.queryByTestId(/phone-card-/)).not.toBeInTheDocument();
  });

  it('handles search input and debounces API calls', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockGetPhones.mockResolvedValue(mockSearchResults);

    render(<Catalog initialProducts={mockPhones} />);

    const searchInput = screen.getByTestId('search-input');

    // Type in search input
    await user.type(searchInput, 'iPhone');

    // Should not call API immediately
    expect(mockGetPhones).not.toHaveBeenCalled();

    // Fast-forward timers by 300ms (debounce delay)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should call API after debounce
    await waitFor(() => {
      expect(mockGetPhones).toHaveBeenCalledWith('iPhone');
    });

    // Should show search results
    await waitFor(() => {
      expect(screen.getByTestId('phone-card-3')).toBeInTheDocument();
      expect(screen.getByTestId('results-count')).toHaveTextContent('1 RESULTS');
    });
  });

  it('shows loading state during search', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    // Mock API call that takes some time
    mockGetPhones.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockSearchResults), 100))
    );

    render(<Catalog initialProducts={mockPhones} />);

    const searchInput = screen.getByTestId('search-input');

    // Type in search input
    await user.type(searchInput, 'Samsung');

    // Advance timers to trigger debounced search
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByTestId('results-count')).toHaveTextContent('... RESULTS');
    });

    // Complete the API call
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Should show results
    await waitFor(() => {
      expect(screen.getByTestId('results-count')).toHaveTextContent('1 RESULTS');
    });
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    mockGetPhones.mockRejectedValue(new Error('API Error'));

    render(<Catalog initialProducts={mockPhones} />);

    const searchInput = screen.getByTestId('search-input');

    // Type in search input
    await user.type(searchInput, 'test');

    // Advance timers to trigger search
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should show error message to user
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      // Error message comes from translations, check for the translated error message
      expect(screen.getByText(/Failed to search products/i)).toBeInTheDocument();
    });

    // Should still show original products (error doesn't crash the app)
    expect(screen.getByTestId('phone-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('phone-card-2')).toBeInTheDocument();
  });

  it('clears search and shows initial products', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockGetPhones.mockResolvedValue(mockSearchResults);

    render(<Catalog initialProducts={mockPhones} />);

    const searchInput = screen.getByTestId('search-input');

    // Perform search
    await user.type(searchInput, 'iPhone');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByTestId('phone-card-3')).toBeInTheDocument();
    });

    // Clear search
    const clearButton = screen.getByTestId('clear-button');
    await user.click(clearButton);

    // Advance timers to allow debounce to complete
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should show initial products again
    await waitFor(() => {
      expect(screen.getByTestId('phone-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('phone-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('results-count')).toHaveTextContent('2 RESULTS');
    });
  });

  it('cancels previous search when new search is initiated', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockGetPhones.mockResolvedValue(mockSearchResults);

    render(<Catalog initialProducts={mockPhones} />);

    const searchInput = screen.getByTestId('search-input');

    // Start first search
    await user.type(searchInput, 'iPhone');

    // Advance time partially (150ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Start second search before first completes debounce
    await user.clear(searchInput);
    await user.type(searchInput, 'Samsung');

    // Advance full debounce time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should only call API once with the latest search term
    await waitFor(() => {
      expect(mockGetPhones).toHaveBeenCalledTimes(1);
      expect(mockGetPhones).toHaveBeenCalledWith('Samsung');
    });
  });

  it('resets to initial products when search is cleared by typing empty string', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockGetPhones.mockResolvedValue(mockSearchResults);

    render(<Catalog initialProducts={mockPhones} />);

    const searchInput = screen.getByTestId('search-input');

    // Perform search
    await user.type(searchInput, 'test');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockGetPhones).toHaveBeenCalled();
    });

    // Clear by deleting all text
    await user.clear(searchInput);

    // Advance timers to allow debounce to complete
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should show initial products without API call
    await waitFor(() => {
      expect(screen.getByTestId('phone-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('phone-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('results-count')).toHaveTextContent('2 RESULTS');
    });
  });

  it('clears error message when search is successful', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    // First, trigger an error
    mockGetPhones.mockRejectedValueOnce(new Error('API Error'));

    render(<Catalog initialProducts={mockPhones} />);

    const searchInput = screen.getByTestId('search-input');

    // Type in search input to trigger error
    await user.type(searchInput, 'test');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      // Error message comes from translations
      expect(screen.getByText(/Failed to search products/i)).toBeInTheDocument();
    });

    // Now make a successful search
    mockGetPhones.mockResolvedValueOnce(mockSearchResults);
    await user.clear(searchInput);
    await user.type(searchInput, 'iPhone');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Error should be cleared and results should show
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByTestId('phone-card-3')).toBeInTheDocument();
    });
  });

  it('clears error message when search is cleared', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    mockGetPhones.mockRejectedValue(new Error('API Error'));

    render(<Catalog initialProducts={mockPhones} />);

    const searchInput = screen.getByTestId('search-input');

    // Type in search input to trigger error
    await user.type(searchInput, 'test');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Clear search
    const clearButton = screen.getByTestId('clear-button');
    await user.click(clearButton);

    // Advance timers to allow debounce to complete
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('shows empty state message when search returns no results', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockGetPhones.mockResolvedValue([]);

    render(<Catalog initialProducts={mockPhones} />);

    const searchInput = screen.getByTestId('search-input');

    // Perform search that returns no results
    await user.type(searchInput, 'nonexistent');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Wait for search to complete
    await waitFor(() => {
      expect(mockGetPhones).toHaveBeenCalledWith('nonexistent');
    });

    // Should show empty state message
    await waitFor(() => {
      expect(screen.getByText(/No products found for/)).toBeInTheDocument();
      expect(screen.getByText(/Try a different search term/)).toBeInTheDocument();
    });
  });

  it('shows empty state message when no initial products', () => {
    render(<Catalog initialProducts={[]} />);

    expect(screen.getByText('No products available')).toBeInTheDocument();
  });
});
