import React from 'react';
import styles from './TypingIndicator.module.scss';

export const TypingIndicator: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <span>💊</span>
      </div>
      <div className={styles.bubble}>
        <div className={styles.dots}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};
