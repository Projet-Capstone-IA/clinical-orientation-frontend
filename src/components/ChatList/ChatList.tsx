import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import { DateSeparator } from '../DateSeparator/DateSeparator';
import { TypingIndicator } from '../TypingIndicator/TypingIndicator';
import { formatDateSeparator, shouldShowDateSeparator } from '../../utils/dateFormat';
import styles from './ChatList.module.scss';

export const ChatList: React.FC = () => {
  const { messages, isWaiting, error } = useChat();
  const { language } = usePreferences();
  const scrollRef = useAutoScroll(messages.length);

  const isEmpty = messages.length === 0 && !isWaiting;

  return (
    <div className={styles.chatList} ref={scrollRef} id="chat-list">
      {isEmpty && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💊</div>
          <h2 className={styles.emptyTitle}>
            {language === 'fr' ? 'Bienvenue sur Lydi' : 'Welcome to Lydi'}
          </h2>
          <p className={styles.emptyText}>
            {language === 'fr'
              ? 'Décrivez vos symptômes et je vous aiderai à identifier les spécialistes à consulter.'
              : 'Describe your symptoms and I\'ll help you identify which specialists to consult.'}
          </p>
          <div className={styles.suggestions}>
            {(language === 'fr'
              ? [
                  "J'ai des maux de tête fréquents",
                  "J'ai une douleur au dos depuis 2 semaines",
                  "Je me sens fatigué(e) tout le temps",
                ]
              : [
                  'I have frequent headaches',
                  'I have back pain for 2 weeks',
                  'I feel tired all the time',
                ]
            ).map((suggestion, i) => (
              <SuggestionChip key={i} text={suggestion} />
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, idx) => (
        <React.Fragment key={msg.id}>
          {shouldShowDateSeparator(
            idx > 0 ? messages[idx - 1].timestamp : null,
            msg.timestamp
          ) && (
            <DateSeparator label={formatDateSeparator(msg.timestamp, language)} />
          )}
          <MessageBubble
            id={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        </React.Fragment>
      ))}

      {isWaiting && <TypingIndicator />}

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className={styles.scrollAnchor} />
    </div>
  );
};

// Inner component for suggestion chips
const SuggestionChip: React.FC<{ text: string }> = ({ text }) => {
  const { sendUserMessage } = useChat();

  return (
    <button className={styles.suggestion} onClick={() => sendUserMessage(text)}>
      {text}
    </button>
  );
};
