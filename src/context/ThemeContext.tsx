import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  schoolName: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
}

const defaultSettings: ThemeSettings = {
  primaryColor: '#1e3a8a', // blue-900
  secondaryColor: '#1e40af', // blue-800
  accentColor: '#ffffff', // white
  schoolName: 'School Management System'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    return (saved as ThemeMode) || 'light';
  });

  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);

  useEffect(() => {
    // Fetch settings from API
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            primaryColor: data.primary_color || defaultSettings.primaryColor,
            secondaryColor: data.secondary_color || defaultSettings.secondaryColor,
            accentColor: data.accent_color || defaultSettings.accentColor,
            schoolName: data.school_name || defaultSettings.schoolName
          });
        }
      })
      .catch(err => console.error('Failed to fetch theme settings:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  useEffect(() => {
    console.log('ThemeContext settings:', settings, 'type:', typeof settings);
    if (!settings) {
      console.error('ThemeContext settings is undefined!');
      return;
    }
    // Apply custom colors as CSS variables
    const root = document.documentElement;
    if (settings.primaryColor) {
      root.style.setProperty('--color-primary', settings.primaryColor);
      root.style.setProperty('--color-secondary', settings.secondaryColor);
      root.style.setProperty('--color-accent', settings.accentColor);
    }
  }, [settings]);

  const toggleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, settings, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return {
      mode: 'light' as ThemeMode,
      toggleMode: () => {},
      settings: defaultSettings,
      updateSettings: () => {}
    };
  }
  return context;
}
