'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone } from '@/types';
import { useTranslations } from 'next-intl';
import styles from './PhoneCard.module.scss';

interface PhoneCardProps {
  phone: Phone;
  priority?: boolean;
}

export function PhoneCard({ phone, priority = false }: PhoneCardProps) {
  const t = useTranslations();

  return (
    <Link
      href={`/products/${phone.id}`}
      className={styles.card}
      aria-label={t('phoneCard.viewDetails', {
        brand: phone.brand,
        name: phone.name,
        price: phone.basePrice,
      })}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={phone.imageUrl}
          alt={`${phone.brand} ${phone.name}`}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          priority={priority}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.details}>
          <span className={styles.brand}>{phone.brand}</span>
          <span className={styles.name}>{phone.name}</span>
        </div>
        <span className={styles.price}>{t('product.price', { price: phone.basePrice })}</span>
      </div>
    </Link>
  );
}
