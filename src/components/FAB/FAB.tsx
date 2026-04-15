import React from 'react';
import { usePreferences } from '../../contexts/PreferencesContext';
import styles from './FAB.module.scss';

interface FABProps {
  onClick: () => void;
}

export const FAB: React.FC<FABProps> = ({ onClick }) => {
  const { language } = usePreferences();

  return (
    <button
      className={styles.fab}
      onClick={onClick}
      aria-label={language === 'fr' ? "Carte d'orientation" : 'Orientation map'}
      title={language === 'fr' ? "Carte d'orientation" : 'Orientation map'}
      id="fab-orientation"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    </button>
  );
};
