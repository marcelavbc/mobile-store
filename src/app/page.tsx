import { Suspense } from 'react';
import { getPhones } from '@/services/api';
import { PhoneCard, SearchBar } from '@/components/phone';
import styles from './page.module.scss';

interface HomeProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { search } = await searchParams;
  const phones = await getPhones(search);

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchBar resultsCount={phones.length} />
      </Suspense>
      <div className={styles.grid}>
        {phones.map((phone, index) => (
          <PhoneCard key={`${phone.id}-${index}`} phone={phone} />
        ))}
      </div>
    </main>
  );
}
