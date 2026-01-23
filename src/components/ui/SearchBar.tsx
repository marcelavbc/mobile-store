import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultsCount: number;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  resultsCount,
  isLoading = false,
}: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search for a smartphone..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search for a smartphone"
        />
        {value && (
          <button
            className={styles.clearButton}
            onClick={onClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
      <div className={styles.resultsCount}>
        {isLoading ? '...' : resultsCount} RESULTS
      </div>
    </div>
  );
}
