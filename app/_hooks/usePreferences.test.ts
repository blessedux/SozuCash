import { renderHook, act } from '@testing-library/react';
import { usePreferences } from './usePreferences';

describe('usePreferences', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with default preferences', () => {
    const { result } = renderHook(() => usePreferences());
    
    expect(result.current.preferences).toEqual({
      currency: 'USD',
      language: 'English',
      theme: 'dark',
      notifications: true,
    });
  });

  it('should update currency preference', () => {
    const { result } = renderHook(() => usePreferences());

    act(() => {
      result.current.setCurrency('EUR');
    });

    expect(result.current.preferences.currency).toBe('EUR');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'sozu-preferences',
      expect.stringContaining('"currency":"EUR"')
    );
  });

  it('should update language preference', () => {
    const { result } = renderHook(() => usePreferences());

    act(() => {
      result.current.setLanguage('Spanish');
    });

    expect(result.current.preferences.language).toBe('Spanish');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'sozu-preferences',
      expect.stringContaining('"language":"Spanish"')
    );
  });

  it('should update theme preference', () => {
    const { result } = renderHook(() => usePreferences());

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.preferences.theme).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'sozu-preferences',
      expect.stringContaining('"theme":"light"')
    );
  });

  it('should update notifications preference', () => {
    const { result } = renderHook(() => usePreferences());

    act(() => {
      result.current.setNotifications(false);
    });

    expect(result.current.preferences.notifications).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'sozu-preferences',
      expect.stringContaining('"notifications":false')
    );
  });

  it('should reset preferences to defaults', () => {
    const { result } = renderHook(() => usePreferences());

    // Change some preferences
    act(() => {
      result.current.setCurrency('EUR');
      result.current.setLanguage('Spanish');
    });

    // Reset preferences
    act(() => {
      result.current.resetPreferences();
    });

    expect(result.current.preferences).toEqual({
      currency: 'USD',
      language: 'English',
      theme: 'dark',
      notifications: true,
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('sozu-preferences');
  });
});
