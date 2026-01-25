'use client';

import { useEffect, useMemo, useState } from 'react';
import { Phone } from '@/types';
import { getPhones } from '@/services/api';
import { SearchBar } from '@/components/ui';
import { PhoneCard } from './PhoneCard';
import { useDebounce } from '@/hooks';
import { useTranslations } from 'next-intl';
import { dedupeById } from '@/utils/utils';
import styles from './Catalog.module.scss';

interface CatalogProps {
  initialProducts: Phone[];
}

export function Catalog({ initialProducts }: CatalogProps) {
  const t = useTranslations();
  const [phones, setPhones] = useState<Phone[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  // Unique phones by id
  const uniquePhones = useMemo(() => dedupeById(phones), [phones]);

  useEffect(() => {
    if (!debouncedSearch) {
      setPhones(initialProducts);
      setError(null);
      return;
    }

    const fetchPhones = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPhones(debouncedSearch);
        setPhones(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message.includes('Network error')
            ? t('error.networkError')
            : t('error.failedToSearch');
        setError(errorMessage);
        setPhones(initialProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhones();
  }, [debouncedSearch, initialProducts, t]);

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
          {error && (
            <div className={styles.errorMessage} role="alert" aria-live="polite">
              {error}
            </div>
          )}
        </section>
        {uniquePhones.length === 0 && !isLoading && !error && search && (
          <div className={styles.emptyState} role="status">
            <p>{t('catalog.noProductsFound', { search })}</p>
            <p className={styles.emptyStateHint}>{t('catalog.tryDifferentSearch')}</p>
          </div>
        )}
        {uniquePhones.length === 0 && !isLoading && !error && !search && (
          <div className={styles.emptyState} role="status">
            <p>{t('catalog.noProductsAvailable')}</p>
          </div>
        )}
        <section className={styles.grid} aria-label={t('product.ariaLabels.productResults')}>
          {uniquePhones.map((phone, index) => (
            <PhoneCard key={phone.id} phone={phone} priority={index < 6} />
          ))}
        </section>
      </div>
    </div>
  );
}
