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

      <Link href="/cart" className={styles.cartLink} aria-label={`Go to cart (${count} items)`}>
        <CartIcon filled={count > 0} />
        <span className={styles.cartCount}>CART ({count})</span>
      </Link>
    </header>
  );
}
