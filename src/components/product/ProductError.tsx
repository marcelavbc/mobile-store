'use client';

import Link from 'next/link';
import { BackIcon } from '@/components/icons';
import { useTranslations } from 'next-intl';
import styles from './ProductError.module.scss';

interface ProductErrorProps {
  message: string;
}

export function ProductError({ message }: ProductErrorProps) {
  const t = useTranslations();

  return (
    <main className={styles.errorPage}>
      <nav className={styles.header} aria-label={t('common.navigation')}>
        <Link className={styles.back} href="/">
          <BackIcon />
          {t('common.back')}
        </Link>
      </nav>
      <div className={styles.errorContainer}>
        <div className={styles.errorContent} role="alert">
          <h1 className={styles.errorTitle}>{t('error.productNotFound')}</h1>
          <p className={styles.errorMessage}>{message}</p>
          <p className={styles.errorHint}>{t('error.productNotFoundHint')}</p>
          <Link href="/" className={styles.backButton}>
            {t('error.goBackToCatalog')}
          </Link>
        </div>
      </div>
    </main>
  );
}
