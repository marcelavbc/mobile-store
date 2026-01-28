import styles from './SearchBar.module.scss';
import { CloseIcon } from '@/components/icons';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultsCount: number;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  resultsCount,
  isLoading = false,
}: SearchBarProps) {
  const t = useTranslations();

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder={t('search.placeholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={t('search.ariaLabel')}
        />
        {value && (
          <button
            className={styles.clearButton}
            onClick={onClear}
            aria-label={t('search.clear')}
            type="button"
          >
            <CloseIcon />
          </button>
        )}
      </div>
      <div className={styles.resultsCount} aria-live="polite" aria-atomic="true">
        <span className="visually-hidden">
          {isLoading ? t('common.loading') : t('common.productsFound', { count: resultsCount })}
        </span>
        {isLoading ? '...' : resultsCount} {t('common.results')}
      </div>
    </div>
  );
}
