'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  resultsCount: number;
}

export function SearchBar({ resultsCount }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedQuery) {
      params.set('search', debouncedQuery);
    } else {
      params.delete('search');
    }

    router.push(`/?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search for a smartphone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search for a smartphone"
        />
        {query && (
          <button
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            <ClearIcon />
          </button>
        )}
      </div>
      <div className={styles.resultsCount}>{resultsCount} RESULTS</div>
    </div>
  );
}

function ClearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
