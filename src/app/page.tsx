import { getPhones } from '@/services/api';
import { Catalog } from '@/components/catalog';
import { Phone } from '@/types';
import { dedupeById } from '@/utils/utils';

export default async function Home() {
  // Server-side fetch - fast initial load, SEO friendly
  // Requirement: Show first 20 phones from API
  let initialPhones: Phone[];
  try {
    const allPhones = await getPhones();
    // First deduplicate to ensure unique IDs, then take first 20
    const uniquePhones = dedupeById(allPhones);
    initialPhones = uniquePhones.slice(0, 20);
  } catch {
    // If initial load fails, pass empty array and let Catalog handle the error state
    initialPhones = [];
  }

  return (
    <main>
      <Catalog initialProducts={initialPhones} />
    </main>
  );
}
