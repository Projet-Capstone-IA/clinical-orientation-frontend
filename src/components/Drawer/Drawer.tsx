import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import styles from './Drawer.module.scss';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { clearHistory, messages } = useChat();
  const { language } = usePreferences();

  const t = language === 'fr'
    ? {
        title: 'Paramètres',
        messageCount: 'Messages',
        clearHistory: 'Effacer l\'historique',
        clearConfirm: 'Êtes-vous sûr ?',
        about: 'À propos',
        aboutText: 'Lydi est un assistant d\'orientation clinique conversationnel propulsé par l\'IA.',
        disclaimer: 'Important : Lydi fournit une orientation clinique basée sur l\'IA et ne remplace en aucun cas un avis médical professionnel. En cas d\'urgence, contactez immédiatement les services de secours.',
        version: 'Version 1.2.0',
      }
    : {
        title: 'Settings',
        messageCount: 'Messages',
        clearHistory: 'Clear history',
        clearConfirm: 'Are you sure?',
        about: 'About',
        aboutText: 'Lydi is a conversational AI-powered clinical orientation assistant.',
        disclaimer: 'Important: Lydi provides AI-driven clinical orientation and is not a substitute for professional medical advice. In case of emergency, contact emergency services immediately.',
        version: 'Version 1.2.0',
      };


  const [confirmClear, setConfirmClear] = React.useState(false);

  const handleClear = () => {
    if (confirmClear) {
      clearHistory();
      setConfirmClear(false);
      onClose();
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.visible : ''}`} onClick={onClose} />
      <aside className={`${styles.drawer} ${isOpen ? styles.open : ''}`} id="drawer">
        <div className={styles.header}>
          <h2>{t.title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t.messageCount}</span>
            <span className={styles.statValue}>{messages.length}</span>
          </div>

          <div className={styles.section}>
            <h3>{t.about}</h3>
            <p className={styles.aboutText}>{t.aboutText}</p>
            <p className={styles.disclaimer}><strong>{t.disclaimer}</strong></p>
            <span className={styles.version}>{t.version}</span>
          </div>

        </div>

        <div className={styles.footer}>
          <button
            className={`${styles.clearBtn} ${confirmClear ? styles.confirm : ''}`}
            onClick={handleClear}
            id="clear-history-btn"
          >
            {confirmClear ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t.clearConfirm}
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                {t.clearHistory}
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
