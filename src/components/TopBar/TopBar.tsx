import React from 'react';
import { usePreferences } from '../../contexts/PreferencesContext';
import styles from './TopBar.module.scss';

interface TopBarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, onSearchClick }) => {
  const { toggleTheme, theme, language, toggleLanguage } = usePreferences();

  return (
    <header className={styles.topbar} id="topbar">
      <button className={styles.iconBtn} onClick={onMenuClick} aria-label="Menu" id="menu-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className={styles.title}>
        <span className={styles.logo}>💊</span>
        <h1>Lydi</h1>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={onSearchClick} aria-label="Rechercher" id="search-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <button className={styles.langBtn} onClick={toggleLanguage} id="lang-toggle">
          {language.toUpperCase()}
        </button>
        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Thème" id="theme-toggle">
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};
