import { generateLineId, getCartItemName } from '../cart';
import { CartItem } from '@/types';

describe('cart utils', () => {
  describe('generateLineId', () => {
    it('generates a unique line ID with phoneId, storage, and colorHex', () => {
      const phoneId = 'phone-123';
      const storage = '128GB';
      const colorHex = '#FF0000';

      const result = generateLineId(phoneId, storage, colorHex);

      expect(result).toBe('phone-123-128GB-#FF0000');
    });

    it('handles different storage formats', () => {
      expect(generateLineId('phone-1', '64GB', '#000000')).toBe('phone-1-64GB-#000000');
      expect(generateLineId('phone-2', '256GB', '#FFFFFF')).toBe('phone-2-256GB-#FFFFFF');
      expect(generateLineId('phone-3', '512GB', '#00FF00')).toBe('phone-3-512GB-#00FF00');
    });

    it('handles empty strings', () => {
      const result = generateLineId('', '', '');
      expect(result).toBe('--');
    });

    it('handles special characters in phoneId', () => {
      const result = generateLineId('phone-123-abc', '128GB', '#FF0000');
      expect(result).toBe('phone-123-abc-128GB-#FF0000');
    });
  });

  describe('getCartItemName', () => {
    it('returns name when available', () => {
      const item: CartItem = {
        lineId: 'line-1',
        phoneId: 'phone-1',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        imageUrl: 'image.jpg',
        storage: '128GB',
        colorName: 'Blue',
        colorHex: '#0000FF',
        unitPrice: 999,
      };

      expect(getCartItemName(item)).toBe('iPhone 15 Pro');
    });

    it('returns brand when name is empty but brand exists', () => {
      const item: CartItem = {
        lineId: 'line-1',
        phoneId: 'phone-1',
        name: '',
        brand: 'Apple',
        imageUrl: 'image.jpg',
        storage: '128GB',
        colorName: 'Blue',
        colorHex: '#0000FF',
        unitPrice: 999,
      };

      expect(getCartItemName(item)).toBe('Apple');
    });

    it('returns "Unknown Product" when both name and brand are empty', () => {
      const item: CartItem = {
        lineId: 'line-1',
        phoneId: 'phone-1',
        name: '',
        brand: '',
        imageUrl: 'image.jpg',
        storage: '128GB',
        colorName: 'Blue',
        colorHex: '#0000FF',
        unitPrice: 999,
      };

      expect(getCartItemName(item)).toBe('Unknown Product');
    });

    it('handles missing name property (undefined)', () => {
      const item = {
        lineId: 'line-1',
        phoneId: 'phone-1',
        brand: 'Samsung',
        imageUrl: 'image.jpg',
        storage: '128GB',
        colorName: 'Blue',
        colorHex: '#0000FF',
        unitPrice: 999,
      } as CartItem;

      expect(getCartItemName(item)).toBe('Samsung');
    });

    it('trims whitespace from brand + name combination when name is empty', () => {
      const item: CartItem = {
        lineId: 'line-1',
        phoneId: 'phone-1',
        name: '',
        brand: '  Apple  ',
        imageUrl: 'image.jpg',
        storage: '128GB',
        colorName: 'Blue',
        colorHex: '#0000FF',
        unitPrice: 999,
      };

      const result = getCartItemName(item);
      // The function trims the brand + name combination when name is empty
      expect(result).toBe('Apple');
    });
  });
});
