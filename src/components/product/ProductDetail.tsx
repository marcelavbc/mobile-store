'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { PhoneDetail } from '@/types';
import { ProductCarousel } from './ProductCarousel';
import { useProductSelection } from '@/hooks';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { generateLineId } from '@/utils/cart';
import { BackIcon } from '@/components/icons';
import styles from './ProductDetail.module.scss';

interface ProductDetailProps {
  phone: PhoneDetail;
}

export function ProductDetail({ phone }: ProductDetailProps) {
  const t = useTranslations();
  const { selectedStorage, selectedColor, handleStorageSelect, handleColorSelect } =
    useProductSelection({
      storageOptions: phone.storageOptions ?? [],
      colorOptions: phone.colorOptions ?? [],
    });

  const displayPrice = selectedStorage?.price ?? phone.basePrice;
  const mainImage = selectedColor?.imageUrl ?? phone.colorOptions?.[0]?.imageUrl ?? null;

  const isAddToCartEnabled = selectedStorage !== null && selectedColor !== null;
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const specs = [
    { label: t('product.specLabels.brand'), value: phone.brand },
    { label: t('product.specLabels.name'), value: phone.name },
    { label: t('product.specLabels.description'), value: phone.description },
    { label: t('product.specLabels.screen'), value: phone.specs?.screen },
    { label: t('product.specLabels.resolution'), value: phone.specs?.resolution },
    { label: t('product.specLabels.processor'), value: phone.specs?.processor },
    { label: t('product.specLabels.mainCamera'), value: phone.specs?.mainCamera },
    { label: t('product.specLabels.selfieCamera'), value: phone.specs?.selfieCamera },
    { label: t('product.specLabels.battery'), value: phone.specs?.battery },
    { label: t('product.specLabels.os'), value: phone.specs?.os },
    { label: t('product.specLabels.screenRefreshRate'), value: phone.specs?.screenRefreshRate },
  ].filter((item) => Boolean(item.value));

  return (
    <div className={styles.page}>
      <nav className={styles.header} aria-label={t('common.navigation')}>
        <Link className={styles.back} href="/">
          <BackIcon />
          {t('common.back')}
        </Link>
      </nav>

      <main className={styles.container}>
        {/* Top: Media + Content */}
        <div className={styles.top}>
          {/* Media */}
          <section className={styles.media}>
            <div className={styles.imageWrapper}>
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={`${phone.brand} ${phone.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className={styles.image}
                  priority
                />
              ) : (
                <div className={styles.imageFallback}>{t('product.noImage')}</div>
              )}
            </div>
          </section>

          {/* Content */}
          <section className={styles.content}>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>
                {phone.brand} {phone.name}
              </h1>
              <p className={styles.price}>
                {selectedStorage
                  ? t('product.price', { price: displayPrice })
                  : t('product.fromPrice', { price: phone.basePrice })}
              </p>
            </div>

            {/* Purchase */}
            <section className={styles.purchase} aria-label={t('product.purchaseSection')}>
              {/* Storage */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>{t('product.storageTitle')}</p>
                <div
                  className={styles.storageGroup}
                  role="group"
                  aria-label={t('product.ariaLabels.storage')}
                >
                  {(phone.storageOptions ?? []).map((s) => (
                    <button
                      key={s.capacity}
                      type="button"
                      className={styles.storageOption}
                      aria-pressed={selectedStorage?.capacity === s.capacity}
                      onClick={() => handleStorageSelect(s)}
                    >
                      {s.capacity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>{t('product.colorTitle')}</p>

                <div
                  className={styles.colors}
                  role="group"
                  aria-label={t('product.ariaLabels.color')}
                >
                  {(phone.colorOptions ?? []).map((c) => (
                    <button
                      key={`${c.hexCode}-${c.name}`}
                      type="button"
                      className={styles.color}
                      title={c.name}
                      aria-label={t('product.ariaLabels.colorOption', { name: c.name })}
                      aria-pressed={selectedColor?.hexCode === c.hexCode}
                      style={{ background: c.hexCode }}
                      onClick={() => handleColorSelect(c)}
                    />
                  ))}
                </div>

                {selectedColor && <p className={styles.colorName}>{selectedColor.name}</p>}
              </div>
            </section>
            {/* CTA */}
            <button
              type="button"
              className={`${styles.cta} ${isAdded ? styles.ctaAdded : ''}`}
              disabled={!isAddToCartEnabled}
              onClick={() => {
                if (!isAddToCartEnabled || !selectedStorage || !selectedColor) return;

                const lineId = generateLineId(
                  phone.id,
                  selectedStorage.capacity,
                  selectedColor.hexCode
                );

                addItem({
                  lineId,
                  phoneId: phone.id,
                  name: phone.name,
                  brand: phone.brand,
                  imageUrl: selectedColor.imageUrl ?? null,
                  storage: selectedStorage.capacity,
                  colorName: selectedColor.name,
                  colorHex: selectedColor.hexCode,
                  unitPrice: displayPrice,
                });

                // Show feedback
                setIsAdded(true);
                setTimeout(() => {
                  setIsAdded(false);
                }, 2000);
              }}
            >
              {isAdded ? t('product.added') : t('product.addToCart')}
            </button>
          </section>
        </div>

        <section className={styles.specs}>
          <h2 className={styles.specsTitle}>{t('product.specifications')}</h2>

          <dl className={styles.specList}>
            {specs.map(({ label, value }) => {
              const rowClass =
                label === t('product.specLabels.description')
                  ? `${styles.specItem} ${styles.specItemDescription}`
                  : styles.specItem;

              return (
                <div key={label} className={rowClass}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
          </dl>
        </section>

        {/* Similar Products*/}
        <ProductCarousel products={phone.similarProducts ?? []} title={t('product.similarItems')} />
      </main>
    </div>
  );
}
