import { getPhones } from '@/services/api';
import { Catalog } from '@/components/catalog';

export default async function Home() {
  // Server-side fetch - fast initial load, SEO friendly
  const initialPhones = await getPhones();

  return (
    <main>
      <Catalog initialProducts={initialPhones} />
    </main>
  );
}
