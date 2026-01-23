import { getPhones } from '@/services/api';
import { PhoneList } from '@/components/catalog';

export default async function Home() {
  // Server-side fetch - fast initial load, SEO friendly
  const initialPhones = await getPhones();

  return (
    <main>
      <PhoneList initialPhones={initialPhones} />
    </main>
  );
}
