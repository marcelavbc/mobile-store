'use client';

import { Phone } from '@/types';
import { PhoneCard } from '@/components/catalog';
import { useScrollProgress } from '@/hooks';
import styles from './ProductCarousel.module.scss';

interface ProductCarouselProps {
  products: Phone[];
  title?: string;
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
  const { ref: carouselRef, progress } = useScrollProgress({ dependencies: [products] });

  if (!products?.length) return null;

  return (
    <aside className={styles.carouselSection}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div ref={carouselRef} className={styles.carousel}>
        {products.map((product, index) => (
          <div key={`${product.id}-${index}`} className={styles.carouselItem}>
            <PhoneCard phone={product} />
          </div>
        ))}
      </div>

      <div className={styles.progressIndicator}>
        <div
          className={styles.progressFill}
          style={{
            left: `${progress.left}%`,
            width: `${progress.width}%`,
          }}
        />
      </div>
    </aside>
  );
}
