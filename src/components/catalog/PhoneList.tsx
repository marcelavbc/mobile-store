'use client';

import { useState, useEffect } from 'react';
import { Phone } from '@/types';
import { getPhones } from '@/services/api';
import { SearchBar } from '@/components/ui';
import { PhoneCard } from './PhoneCard';
import styles from './PhoneList.module.scss';

interface PhoneListProps {
  initialPhones: Phone[];
}

export function PhoneList({ initialPhones }: PhoneListProps) {
  const [phones, setPhones] = useState<Phone[]>(initialPhones);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Skip fetch if search is empty - use initial data
    if (!search) {
      setPhones(initialPhones);
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
  }, [search, initialPhones]);

  return (
    <div>
      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch('')}
        resultsCount={phones.length}
        isLoading={isLoading}
      />
      <div className={styles.grid}>
        {phones.map((phone, index) => (
          <PhoneCard key={`${phone.id}-${index}`} phone={phone} />
        ))}
      </div>
    </div>
  );
}
