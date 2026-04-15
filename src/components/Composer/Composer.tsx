import React, { useState, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import styles from './Composer.module.scss';

export const Composer: React.FC = () => {
  const [text, setText] = useState('');
  const { sendUserMessage, isWaiting } = useChat();
  const { language } = usePreferences();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const placeholder = language === 'fr' ? 'Décrivez vos symptômes...' : 'Describe your symptoms...';

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isWaiting) return;
    sendUserMessage(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const canSend = text.trim().length > 0 && !isWaiting;

  return (
    <div className={styles.composer} id="composer">
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isWaiting}
          maxLength={500}
          id="message-input"
        />
        <div className={styles.charCounter}>
          {text.length}/500
        </div>

        <button
          className={`${styles.sendBtn} ${canSend ? styles.active : ''}`}
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label="Envoyer"
          id="send-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};
