'use client';

import { useEffect, useMemo, useState } from 'react';
import { Phone } from '@/types';
import { getPhones } from '@/services/api';
import { SearchBar } from '@/components/ui';
import { PhoneCard } from './PhoneCard';
import styles from './Catalog.module.scss';
import { dedupeById } from '@/utils/utils';

interface CatalogProps {
  initialProducts: Phone[];
}

export function Catalog({ initialProducts }: CatalogProps) {
  const [phones, setPhones] = useState<Phone[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Unique phones by id
  const uniquePhones = useMemo(() => dedupeById(phones), [phones]);
  useEffect(() => {
    if (!search) {
      setPhones(initialProducts);
      return;
    }

    const fetchPhones = async () => {
      setIsLoading(true);
      try {
        const data = await getPhones(search);
        setPhones(data);
      } catch (error) {
        console.error('Error fetching phones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchPhones, 300);
    return () => clearTimeout(timer);
  }, [search, initialProducts]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.searchSticky}>
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            resultsCount={uniquePhones.length}
            isLoading={isLoading}
          />
        </section>
        <section className={styles.grid} aria-label="Product results">
          {uniquePhones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </section>
      </div>
    </div>
  );
}
