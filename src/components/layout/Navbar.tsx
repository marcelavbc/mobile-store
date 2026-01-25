'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';
import { CartIcon } from '@/components/icons/CartIcon';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { items } = useCart();
  const count = items?.length ?? 0;

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="Go to home">
        <Logo />
      </Link>

      <Link
        href="/cart"
        className={styles.cartLink}
        aria-label={count > 0 ? `Go to cart, ${count} item${count !== 1 ? 's' : ''} in cart` : 'Go to cart, cart is empty'}
      >
        <span className={styles.cartPill} aria-hidden="true">
          <CartIcon filled={count > 0} />
          <span className={styles.cartCount}>{count}</span>
        </span>
      </Link>
    </header>
  );
}
