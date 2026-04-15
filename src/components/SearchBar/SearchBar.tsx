import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const { messages } = useChat();
  const { language } = usePreferences();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = query.trim()
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const scrollToMessage = (msgId: string) => {
    const el = document.getElementById(`message-${msgId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add(styles.highlight);
      setTimeout(() => el.classList.remove(styles.highlight), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className={styles.searchOverlay} id="search-overlay">
      <div className={styles.searchBar}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === 'fr' ? 'Rechercher dans la conversation...' : 'Search conversation...'}
          id="search-input"
        />
        {query && (
          <span className={styles.count}>
            {results.length} {language === 'fr' ? 'résultat(s)' : 'result(s)'}
          </span>
        )}
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {query.trim() && (
        <div className={styles.results}>
          {results.length === 0 ? (
            <div className={styles.noResults}>
              {language === 'fr' ? 'Aucun résultat' : 'No results'}
            </div>
          ) : (
            results.map((msg) => (
              <button
                key={msg.id}
                className={styles.resultItem}
                onClick={() => {
                  scrollToMessage(msg.id);
                  onClose();
                }}
              >
                <span className={styles.resultRole}>
                  {msg.role === 'user' ? '👤' : '💊'}
                </span>
                <span className={styles.resultText}>
                  {highlightMatch(msg.content, query)}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

function highlightMatch(text: string, query: string): React.ReactNode {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text.substring(0, 80);

  const start = Math.max(0, index - 20);
  const end = Math.min(text.length, index + query.length + 30);
  const before = text.substring(start, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length, end);

  return (
    <>
      {start > 0 && '...'}
      {before}
      <mark>{match}</mark>
      {after}
      {end < text.length && '...'}
    </>
  );
}
