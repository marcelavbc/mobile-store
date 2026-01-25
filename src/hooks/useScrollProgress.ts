import { useRef, useState, useEffect, useCallback } from 'react';

interface ScrollProgress {
  left: number;
  width: number;
}

interface UseScrollProgressOptions {
  dependencies?: React.DependencyList;
}

/**
 * Custom hook to track scroll progress of a scrollable element
 * @param options - Optional configuration with dependencies array
 * @returns { ref, progress } - ref to attach to element, progress object with left and width percentages
 */
export function useScrollProgress(options: UseScrollProgressOptions = {}) {
  const { dependencies = [] } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<ScrollProgress>({ left: 0, width: 0 });

  const updateProgress = useCallback(() => {
    const el = elementRef.current;
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

    const el = elementRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      el.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
    // ESLint cannot statically analyze spread operator in dependency arrays.
    // This is intentional: dependencies are dynamic and provided by the caller.
    // The spread operator is the correct pattern for dynamic dependency lists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProgress, ...dependencies]);

  return { ref: elementRef, progress };
}
