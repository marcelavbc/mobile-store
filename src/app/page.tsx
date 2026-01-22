import { getPhones } from '@/services/api';
import { PhoneCard } from '@/components/phone';
import styles from './page.module.scss';

export default async function Home() {
  const phones = await getPhones();

  return (
    <main className={styles.main}>
      <div className={styles.resultsCount}>{phones.length} RESULTS</div>
      <div className={styles.grid}>
        {phones.map((phone, index) => (
          <PhoneCard key={`${phone.id}-${index}`} phone={phone} />
        ))}
      </div>
    </main>
  );
}
