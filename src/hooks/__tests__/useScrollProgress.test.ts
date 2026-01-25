import { renderHook, act } from '@testing-library/react';
import { useScrollProgress } from '../useScrollProgress';

describe('useScrollProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns ref and initial progress state', () => {
    const { result } = renderHook(() => useScrollProgress());

    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull(); // Initially null
    expect(result.current.progress).toEqual({ left: 0, width: 0 });
  });

  it('handles null ref gracefully', () => {
    const { result } = renderHook(() => useScrollProgress());

    // Ref is null by default, should not throw
    expect(result.current.ref.current).toBeNull();
    expect(result.current.progress).toEqual({ left: 0, width: 0 });
  });

  it('updates progress when dependencies change', () => {
    const { rerender } = renderHook(({ deps }) => useScrollProgress({ dependencies: deps }), {
      initialProps: { deps: [] },
    });

    // Should not throw when dependencies change
    expect(() => {
      rerender({ deps: ['new-dependency'] as never[] });
    }).not.toThrow();
  });

  it('works with empty dependencies array', () => {
    const { result } = renderHook(() => useScrollProgress({ dependencies: [] }));

    expect(result.current.ref).toBeDefined();
    expect(result.current.progress).toEqual({ left: 0, width: 0 });
  });

  it('works without dependencies option', () => {
    const { result } = renderHook(() => useScrollProgress());

    expect(result.current.ref).toBeDefined();
    expect(result.current.progress).toEqual({ left: 0, width: 0 });
  });
});
