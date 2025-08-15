import { renderHook, act } from '@testing-library/react';
import { usePersistentState } from './usePersistentState';

describe('usePersistentState', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with default value when no stored value exists', () => {
    const { result } = renderHook(() => usePersistentState('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should load stored value from localStorage', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify('stored value'));
    const { result } = renderHook(() => usePersistentState('test-key', 'default'));
    expect(result.current[0]).toBe('stored value');
  });

  it('should update state and localStorage when setState is called', () => {
    const { result } = renderHook(() => usePersistentState('test-key', 'default'));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new value'));
  });

  it('should clear state and localStorage when clearState is called', () => {
    const { result } = renderHook(() => usePersistentState('test-key', 'default'));

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('default');
    expect(localStorage.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    localStorage.getItem.mockImplementation(() => { throw new Error('Storage error'); });

    const { result } = renderHook(() => usePersistentState('test-key', 'default'));

    expect(result.current[0]).toBe('default');
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });
});
