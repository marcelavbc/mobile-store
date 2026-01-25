import { dedupeById } from '../utils';

describe('utils', () => {
  describe('dedupeById', () => {
    it('removes duplicate items based on id property', () => {
      const items = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '1', name: 'Item 1 Duplicate' },
        { id: '3', name: 'Item 3' },
        { id: '2', name: 'Item 2 Duplicate' },
      ];

      const result = dedupeById(items);

      expect(result).toHaveLength(3);
      expect(result.map((item) => item.id)).toEqual(['1', '2', '3']);
      // Map keeps the last occurrence when duplicates are found
      expect(result.find((item) => item.id === '1')?.name).toBe('Item 1 Duplicate');
      expect(result.find((item) => item.id === '2')?.name).toBe('Item 2 Duplicate');
    });

    it('returns empty array for empty input', () => {
      const result = dedupeById([]);
      expect(result).toEqual([]);
    });

    it('returns same array when no duplicates exist', () => {
      const items = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
      ];

      const result = dedupeById(items);

      expect(result).toHaveLength(3);
      expect(result).toEqual(items);
    });

    it('works with numeric ids', () => {
      const items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 1, name: 'Item 1 Duplicate' },
        { id: 3, name: 'Item 3' },
      ];

      const result = dedupeById(items);

      expect(result).toHaveLength(3);
      expect(result.map((item) => item.id)).toEqual([1, 2, 3]);
    });

    it('preserves all other properties of the last occurrence', () => {
      const items = [
        { id: '1', name: 'Item 1', price: 100, category: 'A' },
        { id: '1', name: 'Item 1 Updated', price: 200, category: 'B' },
        { id: '2', name: 'Item 2', price: 300 },
      ];

      const result = dedupeById(items);

      expect(result).toHaveLength(2);
      expect(result.find((item) => item.id === '1')).toEqual({
        id: '1',
        name: 'Item 1 Updated',
        price: 200,
        category: 'B',
      });
    });

    it('handles single item array', () => {
      const items = [{ id: '1', name: 'Item 1' }];

      const result = dedupeById(items);

      expect(result).toEqual(items);
    });
  });
});
