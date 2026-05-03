import React, { createContext, useContext, useState, useEffect } from 'react';

export type TextSpeed = 'slow' | 'normal' | 'fast';

export interface Settings {
  textSpeed: TextSpeed;
  audioEnabled: boolean;
  reduceMotion: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  textSpeed: 'normal',
  audioEnabled: true,
  reduceMotion: false,
};

const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
} | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('red-dawn-settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('red-dawn-settings', JSON.stringify(settings));
    const speeds = { slow: '3s', normal: '1.5s', fast: '0.4s' };
    document.documentElement.style.setProperty('--text-anim-duration', speeds[settings.textSpeed]);
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings]);

  const updateSettings = (partial: Partial<Settings>) =>
    setSettings(prev => ({ ...prev, ...partial }));

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
