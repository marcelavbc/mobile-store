'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Logo, CartIcon } from '@/components/icons';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="Go to homepage">
        <Logo />
      </Link>

      <Link
        href="/cart"
        className={styles.cartLink}
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <CartIcon filled={itemCount > 0} />
        <span className={styles.cartCount}>{itemCount}</span>
      </Link>
    </header>
  );
}
