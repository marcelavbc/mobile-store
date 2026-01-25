/**
 * Remove duplicate items from array based on id property
 */
export function dedupeById<T extends { id: string | number }>(items: T[]): T[] {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}
