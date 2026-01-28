import { useState } from 'react';
import { StorageOption, ColorOption } from '@/types';

interface UseProductSelectionProps {
  defaultStorage?: StorageOption | null;
  defaultColor?: ColorOption | null;
  storageOptions?: StorageOption[];
  colorOptions?: ColorOption[];
}

interface UseProductSelectionReturn {
  selectedStorage: StorageOption | null;
  selectedColor: ColorOption | null;
  handleStorageSelect: (storage: StorageOption) => void;
  handleColorSelect: (color: ColorOption) => void;
  reset: () => void;
}

/**
 * Custom hook to manage product selection (storage and color)
 * Automatically selects default options when one is selected
 */
export function useProductSelection({
  defaultStorage = null,
  defaultColor = null,
  storageOptions = [],
  colorOptions = [],
}: UseProductSelectionProps = {}): UseProductSelectionReturn {
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(defaultStorage);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(defaultColor);

  const handleStorageSelect = (storage: StorageOption) => {
    setSelectedStorage(storage);
    // Auto-select first color if none selected
    setSelectedColor((prev) => prev || colorOptions[0] || null);
  };

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    // Auto-select first storage if none selected
    setSelectedStorage((prev) => prev || storageOptions[0] || null);
  };

  const reset = () => {
    setSelectedStorage(defaultStorage);
    setSelectedColor(defaultColor);
  };

  return {
    selectedStorage,
    selectedColor,
    handleStorageSelect,
    handleColorSelect,
    reset,
  };
}
