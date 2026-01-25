import { CartItem } from '@/types';

/**
 * Generate a unique line ID for a cart item
 * Format: {phoneId}-{storage}-{colorHex}
 */
export function generateLineId(phoneId: string, storage: string, colorHex: string): string {
  return `${phoneId}-${storage}-${colorHex}`;
}

/**
 * Get display name for a cart item
 * Falls back to brand + name if name is not available
 */
export function getCartItemName(item: CartItem): string {
  if (item.name) return item.name;
  return `${item.brand || ''} ${item.name || ''}`.trim() || 'Unknown Product';
}
