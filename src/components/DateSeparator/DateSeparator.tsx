import React from 'react';
import styles from './DateSeparator.module.scss';

interface DateSeparatorProps {
  label: string;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => {
  return (
    <div className={styles.separator}>
      <span className={styles.label}>{label}</span>
    </div>
  );
};
