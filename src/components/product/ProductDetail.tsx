'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { PhoneDetail, StorageOption, ColorOption } from '@/types';
import { ProductCarousel } from './ProductCarousel';
import styles from './ProductDetail.module.scss';
import { useCart } from '@/context/CartContext';
import { BackIcon } from '@/components/icons';

interface ProductDetailProps {
  phone: PhoneDetail;
}

export function ProductDetail({ phone }: ProductDetailProps) {
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

  const displayPrice = selectedStorage?.price ?? phone.basePrice;
  const mainImage = selectedColor?.imageUrl ?? phone.colorOptions?.[0]?.imageUrl ?? null;

  const isAddToCartEnabled = selectedStorage !== null && selectedColor !== null;
  const { addItem } = useCart();

  const handleStorageSelect = useCallback(
    (storage: StorageOption) => {
      setSelectedStorage(storage);

      setSelectedColor((prev) => {
        if (prev) return prev;
        return phone.colorOptions?.[0] ?? null;
      });
    },
    [phone.colorOptions]
  );

  const handleColorSelect = useCallback(
    (color: ColorOption) => {
      setSelectedColor(color);

      setSelectedStorage((prev) => {
        if (prev) return prev;
        return phone.storageOptions?.[0] ?? null;
      });
    },
    [phone.storageOptions]
  );

  const specs = useMemo(
    () =>
      [
        { label: 'Brand', value: phone.brand },
        { label: 'Name', value: phone.name },
        { label: 'Description', value: phone.description },
        { label: 'Screen', value: phone.specs?.screen },
        { label: 'Resolution', value: phone.specs?.resolution },
        { label: 'Processor', value: phone.specs?.processor },
        { label: 'Main camera', value: phone.specs?.mainCamera },
        { label: 'Selfie camera', value: phone.specs?.selfieCamera },
        { label: 'Battery', value: phone.specs?.battery },
        { label: 'OS', value: phone.specs?.os },
        { label: 'Screen refresh rate', value: phone.specs?.screenRefreshRate },
      ].filter((item) => Boolean(item.value)),
    [phone]
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.back} href="/">
          <BackIcon />
          BACK
        </Link>
      </header>

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
                <div className={styles.imageFallback}>No image</div>
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
                {selectedStorage ? `${displayPrice} EUR` : `From ${phone.basePrice} EUR`}
              </p>
            </div>

            {/* Purchase */}
            <div className={styles.purchase}>
              {/* Storage */}
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Storage ¿How much space do you need?</p>
                <div className={styles.storageGroup} role="group" aria-label="Storage">
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
                <p className={styles.sectionTitle}>Color (pick your favourite)</p>

                <div className={styles.colors} role="group" aria-label="Color">
                  {(phone.colorOptions ?? []).map((c) => (
                    <button
                      key={`${c.hexCode}-${c.name}`}
                      type="button"
                      className={styles.color}
                      title={c.name}
                      aria-label={`Color: ${c.name}`}
                      aria-pressed={selectedColor?.hexCode === c.hexCode}
                      style={{ background: c.hexCode }}
                      onClick={() => handleColorSelect(c)}
                    />
                  ))}
                </div>

                {selectedColor && <p className={styles.colorName}>{selectedColor.name}</p>}
              </div>
            </div>
            {/* CTA */}
            <button
              type="button"
              className={styles.cta}
              disabled={!isAddToCartEnabled}
              onClick={() => {
                if (!isAddToCartEnabled) return;

                const lineId = `${phone.id}-${selectedStorage!.capacity}-${selectedColor!.hexCode}`;

                addItem({
                  lineId,
                  phoneId: phone.id,
                  name: phone.name,
                  brand: phone.brand,
                  imageUrl: selectedColor!.imageUrl ?? null,
                  storage: selectedStorage!.capacity,
                  colorName: selectedColor!.name,
                  colorHex: selectedColor!.hexCode,
                  unitPrice: displayPrice,
                });
              }}
            >
              Add to cart
            </button>
          </section>
        </div>

        <section className={styles.specs}>
          <h2 className={styles.specsTitle}>Specifications</h2>

          <dl className={styles.specList}>
            {specs.map(({ label, value }) => {
              const rowClass =
                label === 'Description'
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

        {/* Similar */}
        <ProductCarousel products={phone.similarProducts ?? []} title="Similar items" />
      </main>
    </div>
  );
}
