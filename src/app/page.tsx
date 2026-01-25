import { getPhones } from '@/services/api';
import { Catalog } from '@/components/catalog';
import { Phone } from '@/types';

export default async function Home() {
  // Server-side fetch - fast initial load, SEO friendly
  let initialPhones: Phone[];
  try {
    initialPhones = await getPhones();
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
