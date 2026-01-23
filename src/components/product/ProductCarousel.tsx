'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Phone } from '@/types';
import { PhoneCard } from '@/components/catalog';
import styles from './ProductCarousel.module.scss';

interface ProductCarouselProps {
  products: Phone[];
  title?: string;
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState({ left: 0, width: 0 });

  const updateProgress = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    if (scrollWidth <= clientWidth) {
      // All content visible → full bar
      setProgress({ left: 0, width: 100 });
      return;
    }

    const width = (clientWidth / scrollWidth) * 100;
    const left = (scrollLeft / scrollWidth) * 100;

    setProgress({ left, width });
  }, []);

  useEffect(() => {
    updateProgress();

    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      el.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress, products]);

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
