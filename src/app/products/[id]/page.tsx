import Link from 'next/link';
import { getPhoneById } from '@/services/api';
import { ProductDetail } from '@/components/product';
import { BackIcon } from '@/components/icons';
import styles from './ProductError.module.scss';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  let phone;
  try {
    phone = await getPhoneById(id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to load product data.';
    return (
      <main className={styles.errorPage}>
        <header className={styles.header}>
          <Link className={styles.back} href="/">
            <BackIcon />
            BACK
          </Link>
        </header>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent} role="alert">
            <h1 className={styles.errorTitle}>Product not found</h1>
            <p className={styles.errorMessage}>{message}</p>
            <p className={styles.errorHint}>
              The product you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
            </p>
            <Link href="/" className={styles.backButton}>
              Go back to catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <ProductDetail phone={phone} />
    </main>
  );
}
