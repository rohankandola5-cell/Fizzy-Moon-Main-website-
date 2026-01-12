'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, Theme, ThemeKey } from '../../config/themes';

interface ThemeContextType {
  currentTheme: Theme;
  themeKey: ThemeKey;
  setTheme: (key: ThemeKey | null) => void; // null resets to auto-detect
  isAutoDetected: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Auto-detect theme based on current date
 */
function detectThemeByDate(): ThemeKey {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate(); // 1-31

  // Valentine's Day: February 1-14
  if (month === 2 && day >= 1 && day <= 14) {
    return 'valentines';
  }

  // Christmas: December 1-31
  if (month === 12) {
    return 'christmas';
  }

  // Summer: June, July, August
  if (month >= 6 && month <= 8) {
    return 'summer';
  }

  // Default for rest of year
  return 'default';
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeKey | null; // For testing/preview
}

export function ThemeProvider({ children, initialTheme = null }: ThemeProviderProps) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(() => {
    // Check for manual override in localStorage (for testing)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fizzy-moon-theme-override');
      if (stored && stored in themes) {
        return stored as ThemeKey;
      }
    }
    // Use initialTheme if provided (for testing)
    if (initialTheme) {
      return initialTheme;
    }
    // Auto-detect based on date
    return detectThemeByDate();
  });

  const [isAutoDetected, setIsAutoDetected] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('fizzy-moon-theme-override');
    }
    return !initialTheme;
  });

  const currentTheme = themes[themeKey];

  // Update theme based on date (check daily)
  useEffect(() => {
    // Only auto-update if no manual override
    if (isAutoDetected) {
      const checkTheme = () => {
        const detected = detectThemeByDate();
        if (detected !== themeKey) {
          setThemeKey(detected);
        }
      };

      // Check immediately
      checkTheme();

      // Check every hour (in case date changes)
      const interval = setInterval(checkTheme, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAutoDetected, themeKey]);

  const setTheme = (key: ThemeKey | null) => {
    if (key === null) {
      // Reset to auto-detect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fizzy-moon-theme-override');
      }
      setIsAutoDetected(true);
      setThemeKey(detectThemeByDate());
    } else {
      // Manual override
      if (typeof window !== 'undefined') {
        localStorage.setItem('fizzy-moon-theme-override', key);
      }
      setIsAutoDetected(false);
      setThemeKey(key);
    }
  };

  // Apply theme colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', currentTheme.colors.primary);
    root.style.setProperty('--theme-primary-hover', currentTheme.colors.primaryHover);
    root.style.setProperty('--theme-background', currentTheme.colors.background);
    root.style.setProperty('--theme-background-dark', currentTheme.colors.backgroundDark);
    root.style.setProperty('--theme-background-darker', currentTheme.colors.backgroundDarker);
    root.style.setProperty('--theme-accent', currentTheme.colors.accent || currentTheme.colors.primary);
    root.style.setProperty('--theme-text', currentTheme.colors.text || '#ffffff');
    root.style.setProperty('--theme-text-secondary', currentTheme.colors.textSecondary || '#e5e7eb');
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, themeKey, setTheme, isAutoDetected }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

