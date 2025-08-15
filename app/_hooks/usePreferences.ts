'use client';

import { usePersistentState } from './usePersistentState';
import type { Currency, Language } from '../_types/wallet';

interface Preferences {
  currency: Currency;
  language: Language;
  theme: 'light' | 'dark';
  notifications: boolean;
}

const defaultPreferences: Preferences = {
  currency: 'USD',
  language: 'English',
  theme: 'dark',
  notifications: true,
};

export function usePreferences() {
  const [preferences, setPreferences, clearPreferences] = usePersistentState<Preferences>(
    'sozu-preferences',
    defaultPreferences
  );

  const setCurrency = (currency: Currency) => {
    setPreferences({ ...preferences, currency });
  };

  const setLanguage = (language: Language) => {
    setPreferences({ ...preferences, language });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setPreferences({ ...preferences, theme });
  };

  const setNotifications = (notifications: boolean) => {
    setPreferences({ ...preferences, notifications });
  };

  const resetPreferences = () => {
    clearPreferences();
  };

  return {
    preferences,
    setCurrency,
    setLanguage,
    setTheme,
    setNotifications,
    resetPreferences,
  };
}
