'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { generateLineId, getCartItemName } from '@/utils/cart';
import styles from './CartPage.module.scss';

export function CartPage() {
  const { items, removeItem, totalPrice, count } = useCart();
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
              {items.map((item) => {
                const key = item.lineId || generateLineId(item.phoneId, item.storage, item.colorHex);
                const name = getCartItemName(item);

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
                      <div className={styles.productDetails}>
                        <div className={styles.productInfo}>
                          <p className={styles.productName}>{name}</p>
                          <p className={styles.meta}>
                            {item.storage} | {item.colorName}
                          </p>
                        </div>
                        <p className={styles.price}>{item.unitPrice} EUR</p>
                      </div>

                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeItem(key)}
                      >
                        Delete
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
              <div className={styles.footerActions}>
                <Link className={styles.continueFooter} href="/">
                  CONTINUE SHOPPING
                </Link>
                <div className={styles.totalAndPay}>
                  <span className={styles.totalTextInline}>TOTAL {totalPrice} EUR</span>
                  <button type="button" className={styles.pay}>
                    PAY
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
