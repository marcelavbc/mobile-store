'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';
import { CartIcon } from '@/components/icons/CartIcon';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { items } = useCart();
  const t = useTranslations();
  const count = items?.length ?? 0;

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label={t('navbar.goToHome')}>
        <Logo />
      </Link>

      <Link
        href="/cart"
        className={styles.cartLink}
        aria-label={
          count > 0
            ? t('navbar.goToCartWithItems', { count })
            : t('navbar.goToCart')
        }
      >
        <span className={styles.cartPill} aria-hidden="true">
          <CartIcon filled={count > 0} />
          <span className={styles.cartCount}>{count}</span>
        </span>
      </Link>
    </header>
  );
}
