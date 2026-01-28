'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { generateLineId, getCartItemName } from '@/utils/cart';
import styles from './CartPage.module.scss';

export function CartPage() {
  const { items, removeItem, totalPrice, count } = useCart();
  const t = useTranslations();
  const isEmpty = count === 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('cart.title', { count })}</h1>

        {isEmpty ? (
          <>
            <div className={styles.spacer} />
            <div className={styles.bottom}>
              <Link className={styles.continue} href="/">
                {t('common.continueShopping')}
              </Link>
            </div>
          </>
        ) : (
          <>
            <section className={styles.listSection} aria-label={t('cart.itemsSection')}>
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
                          <p className={styles.price}>{t('product.price', { price: item.unitPrice })}</p>
                        </div>

                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => removeItem(key)}
                          aria-label={t('cart.removeItem', { name })}
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className={styles.footer} aria-label={t('cart.summarySection')}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>{t('common.total')}</span>
                <span className={styles.totalValue}>{t('product.price', { price: totalPrice })}</span>
              </div>
              <div className={styles.actions}>
                <Link className={styles.continueFooter} href="/">
                  {t('common.continueShopping')}
                </Link>
                <button type="button" className={styles.pay} aria-label={t('cart.proceedToPayment')}>
                  {t('common.pay')}
                </button>
              </div>
              <div className={styles.footerActions}>
                <Link className={styles.continueFooter} href="/">
                  {t('common.continueShopping')}
                </Link>
                <div className={styles.totalAndPay}>
                  <span className={styles.totalTextInline}>
                    {t('common.total')} {t('product.price', { price: totalPrice })}
                  </span>
                  <button type="button" className={styles.pay} aria-label={t('cart.proceedToPayment')}>
                    {t('common.pay')}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
