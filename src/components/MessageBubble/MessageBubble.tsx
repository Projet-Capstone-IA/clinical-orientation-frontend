import React, { useState } from 'react';
import { formatTime } from '../../utils/dateFormat';
import { useChat } from '../../contexts/ChatContext';
import styles from './MessageBubble.module.scss';

interface MessageBubbleProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ id, role, content, timestamp }) => {
  const { editUserMessage } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);
  const isUser = role === 'user';

  const handleEdit = () => {
    if (!isUser) return;
    setEditText(content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== content) {
      editUserMessage(id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.assistant}`} id={`message-${id}`}>
      {!isUser && (
        <div className={styles.avatar}>
          <span>💊</span>
        </div>
      )}
      <div className={styles.bubble}>
        {isEditing ? (
          <div className={styles.editArea}>
            <textarea
              className={styles.editInput}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              rows={2}
              maxLength={500}
            />
            <div className={styles.editFooter}>
              <span className={styles.editCounter}>{editText.length}/500</span>
              <div className={styles.editActions}>
                <button onClick={handleCancelEdit} className={styles.cancelBtn}>✕</button>
                <button onClick={handleSaveEdit} className={styles.saveBtn}>✓</button>
              </div>
            </div>

          </div>
        ) : (
          <>
            <p className={styles.text}>{content}</p>
            <div className={styles.meta}>
              <span className={styles.time}>{formatTime(timestamp)}</span>
              {isUser && (
                <button className={styles.editBtn} onClick={handleEdit} aria-label="Modifier">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
