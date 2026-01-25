import { renderHook, act } from '@testing-library/react';
import { useProductSelection } from '../useProductSelection';
import { StorageOption, ColorOption } from '@/types';

const mockStorageOptions: StorageOption[] = [
  { capacity: '128GB', price: 999 },
  { capacity: '256GB', price: 1099 },
  { capacity: '512GB', price: 1299 },
];

const mockColorOptions: ColorOption[] = [
  {
    name: 'Black',
    hexCode: '#000000',
    imageUrl: 'https://example.com/black.jpg',
  },
  {
    name: 'White',
    hexCode: '#FFFFFF',
    imageUrl: 'https://example.com/white.jpg',
  },
];

describe('useProductSelection', () => {
  it('initializes with null selections when no defaults provided', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    expect(result.current.selectedStorage).toBeNull();
    expect(result.current.selectedColor).toBeNull();
  });

  it('initializes with default storage when provided', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        defaultStorage: mockStorageOptions[1],
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    expect(result.current.selectedStorage).toBe(mockStorageOptions[1]);
    expect(result.current.selectedColor).toBeNull();
  });

  it('initializes with default color when provided', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        defaultColor: mockColorOptions[0],
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    expect(result.current.selectedStorage).toBeNull();
    expect(result.current.selectedColor).toBe(mockColorOptions[0]);
  });

  it('updates selected storage when handleStorageSelect is called', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    act(() => {
      result.current.handleStorageSelect(mockStorageOptions[1]);
    });

    expect(result.current.selectedStorage).toBe(mockStorageOptions[1]);
  });

  it('auto-selects first color when storage is selected and no color is selected', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    act(() => {
      result.current.handleStorageSelect(mockStorageOptions[0]);
    });

    expect(result.current.selectedStorage).toBe(mockStorageOptions[0]);
    expect(result.current.selectedColor).toBe(mockColorOptions[0]);
  });

  it('keeps existing color when storage is selected and color is already selected', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    // First select a color
    act(() => {
      result.current.handleColorSelect(mockColorOptions[1]);
    });

    // Then select storage
    act(() => {
      result.current.handleStorageSelect(mockStorageOptions[0]);
    });

    expect(result.current.selectedStorage).toBe(mockStorageOptions[0]);
    expect(result.current.selectedColor).toBe(mockColorOptions[1]); // Should keep existing color
  });

  it('updates selected color when handleColorSelect is called', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    act(() => {
      result.current.handleColorSelect(mockColorOptions[1]);
    });

    expect(result.current.selectedColor).toBe(mockColorOptions[1]);
  });

  it('auto-selects first storage when color is selected and no storage is selected', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    act(() => {
      result.current.handleColorSelect(mockColorOptions[0]);
    });

    expect(result.current.selectedStorage).toBe(mockStorageOptions[0]);
    expect(result.current.selectedColor).toBe(mockColorOptions[0]);
  });

  it('keeps existing storage when color is selected and storage is already selected', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    // First select storage
    act(() => {
      result.current.handleStorageSelect(mockStorageOptions[1]);
    });

    // Then select color
    act(() => {
      result.current.handleColorSelect(mockColorOptions[1]);
    });

    expect(result.current.selectedStorage).toBe(mockStorageOptions[1]); // Should keep existing storage
    expect(result.current.selectedColor).toBe(mockColorOptions[1]);
  });

  it('resets to default values when reset is called', () => {
    const defaultStorage = mockStorageOptions[1];
    const defaultColor = mockColorOptions[0];

    const { result } = renderHook(() =>
      useProductSelection({
        defaultStorage,
        defaultColor,
        storageOptions: mockStorageOptions,
        colorOptions: mockColorOptions,
      })
    );

    // Change selections
    act(() => {
      result.current.handleStorageSelect(mockStorageOptions[2]);
      result.current.handleColorSelect(mockColorOptions[1]);
    });

    expect(result.current.selectedStorage).toBe(mockStorageOptions[2]);
    expect(result.current.selectedColor).toBe(mockColorOptions[1]);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.selectedStorage).toBe(defaultStorage);
    expect(result.current.selectedColor).toBe(defaultColor);
  });

  it('handles empty storage options array', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: [],
        colorOptions: mockColorOptions,
      })
    );

    act(() => {
      result.current.handleColorSelect(mockColorOptions[0]);
    });

    expect(result.current.selectedColor).toBe(mockColorOptions[0]);
    expect(result.current.selectedStorage).toBeNull();
  });

  it('handles empty color options array', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: mockStorageOptions,
        colorOptions: [],
      })
    );

    act(() => {
      result.current.handleStorageSelect(mockStorageOptions[0]);
    });

    expect(result.current.selectedStorage).toBe(mockStorageOptions[0]);
    expect(result.current.selectedColor).toBeNull();
  });

  it('handles both empty options arrays', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: [],
        colorOptions: [],
      })
    );

    expect(result.current.selectedStorage).toBeNull();
    expect(result.current.selectedColor).toBeNull();
  });

  it('works without any parameters', () => {
    const { result } = renderHook(() => useProductSelection());

    expect(result.current.selectedStorage).toBeNull();
    expect(result.current.selectedColor).toBeNull();
    expect(result.current.handleStorageSelect).toBeDefined();
    expect(result.current.handleColorSelect).toBeDefined();
    expect(result.current.reset).toBeDefined();
  });

  it('works with empty object parameter', () => {
    const { result } = renderHook(() => useProductSelection({}));

    expect(result.current.selectedStorage).toBeNull();
    expect(result.current.selectedColor).toBeNull();
  });

  it('handles undefined storageOptions and colorOptions', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: undefined,
        colorOptions: undefined,
      })
    );

    expect(result.current.selectedStorage).toBeNull();
    expect(result.current.selectedColor).toBeNull();
  });

  it('auto-selects first color when storage is selected with empty colorOptions', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: mockStorageOptions,
        colorOptions: [],
      })
    );

    act(() => {
      result.current.handleStorageSelect(mockStorageOptions[0]);
    });

    expect(result.current.selectedStorage).toBe(mockStorageOptions[0]);
    expect(result.current.selectedColor).toBeNull(); // No color to auto-select
  });

  it('auto-selects first storage when color is selected with empty storageOptions', () => {
    const { result } = renderHook(() =>
      useProductSelection({
        storageOptions: [],
        colorOptions: mockColorOptions,
      })
    );

    act(() => {
      result.current.handleColorSelect(mockColorOptions[0]);
    });

    expect(result.current.selectedColor).toBe(mockColorOptions[0]);
    expect(result.current.selectedStorage).toBeNull(); // No storage to auto-select
  });
});
