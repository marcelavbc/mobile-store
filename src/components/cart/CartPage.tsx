'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './CartPage.module.scss';

export function CartPage() {
  const { items, removeItem } = useCart();
  const count = items?.length ?? 0;

  const totalPrice = useMemo(
    () => (items ?? []).reduce((sum, item) => sum + (item.unitPrice ?? 0), 0),
    [items]
  );

  const isEmpty = count === 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>CART ({count})</h1>

        {isEmpty ? (
          <>
            <div className={styles.spacer} />
            <div className={styles.bottom}>
              <Link className={styles.continue} href="/">
                CONTINUE SHOPPING
              </Link>
            </div>
          </>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((item: any) => {
                const key =
                  item.lineId ?? item.id ?? `${item.phoneId}-${item.storage}-${item.colorHex}`;
                const name = item.name ?? `${item.brand ?? ''} ${item.model ?? ''}`.trim();

                return (
                  <li key={key} className={styles.row}>
                    <div className={styles.thumb}>
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={name}
                          fill
                          className={styles.thumbImg}
                          sizes="90px"
                        />
                      ) : null}
                    </div>

                    <div className={styles.info}>
                      <div className={styles.productInfo}>
                        <p className={styles.productName}>{name}</p>
                        <p className={styles.meta}>
                          {item.storage} | {item.colorName}
                        </p>
                      </div>
                      <p className={styles.price}>{item.unitPrice} EUR</p>

                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeItem(key)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>TOTAL</span>
                <span className={styles.totalValue}>{totalPrice} EUR</span>
              </div>

              <div className={styles.actions}>
                <Link className={styles.continueFooter} href="/">
                  CONTINUE SHOPPING
                </Link>

                <button type="button" className={styles.pay}>
                  PAY
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
