'use client';

import { useState, useEffect } from 'react';
import { Phone } from '@/types';
import { getPhones } from '@/services/api';
import { SearchBar } from '@/components/ui';
import { PhoneCard } from './PhoneCard';
import styles from './Catalog.module.scss';

interface CatalogProps {
  initialProducts: Phone[];
}

export function Catalog({ initialProducts }: CatalogProps) {
  const [phones, setPhones] = useState<Phone[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      <section className={styles.searchSticky}>
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          resultsCount={phones.length}
          isLoading={isLoading}
        />
      </section>

      <section className={styles.grid}>
        {phones.map((phone, index) => (
          <PhoneCard key={`${phone.id}-${index}`} phone={phone} />
        ))}
      </section>
    </div>
  );
}
