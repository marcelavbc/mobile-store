import Link from 'next/link';
import Image from 'next/image';
import { Phone } from '@/types';
import styles from './PhoneCard.module.scss';

interface PhoneCardProps {
  phone: Phone;
}

export function PhoneCard({ phone }: PhoneCardProps) {
  return (
    <Link
      href={`/products/${phone.id}`}
      className={styles.card}
      aria-label={`View details for ${phone.brand} ${phone.name}, ${phone.basePrice} EUR`}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={phone.imageUrl}
          alt={`${phone.brand} ${phone.name}`}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
      </div>

      <div className={styles.info}>
        <div className={styles.details}>
          <span className={styles.brand}>{phone.brand}</span>
          <span className={styles.name}>{phone.name}</span>
        </div>
        <span className={styles.price}>{phone.basePrice} EUR</span>
      </div>
    </Link>
  );
}
