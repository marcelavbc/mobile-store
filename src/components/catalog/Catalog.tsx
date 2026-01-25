'use client';

import { useEffect, useMemo, useState } from 'react';
import { Phone } from '@/types';
import { getPhones } from '@/services/api';
import { SearchBar } from '@/components/ui';
import { PhoneCard } from './PhoneCard';
import { useDebounce } from '@/hooks';
import { dedupeById } from '@/utils/utils';
import styles from './Catalog.module.scss';

interface CatalogProps {
  initialProducts: Phone[];
}

export function Catalog({ initialProducts }: CatalogProps) {
  const [phones, setPhones] = useState<Phone[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Unique phones by id
  const uniquePhones = useMemo(() => dedupeById(phones), [phones]);

  useEffect(() => {
    if (!debouncedSearch) {
      setPhones(initialProducts);
      return;
    }

    const fetchPhones = async () => {
      setIsLoading(true);
      try {
        const data = await getPhones(debouncedSearch);
        setPhones(data);
      } catch (error) {
        console.error('Error fetching phones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhones();
  }, [debouncedSearch, initialProducts]);

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
