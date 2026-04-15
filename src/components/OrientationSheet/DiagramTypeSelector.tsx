import React from 'react';
import type { DiagramType } from './mermaidUtils';
import styles from './DiagramTypeSelector.module.scss';

interface DiagramTypeSelectorProps {
  value: DiagramType;
  onChange: (type: DiagramType) => void;
}

const OPTIONS: { value: DiagramType; label: string; icon: string }[] = [
  { value: 'mindmap', label: 'Mind Map', icon: '⛯' },
  { value: 'flowchart', label: 'Flowchart', icon: '⧰' },
  { value: 'decisionTree', label: 'Decision Tree', icon: '🗠' },
];

export const DiagramTypeSelector: React.FC<DiagramTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className={styles.selector} id="diagram-type-selector">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`${styles.option} ${value === opt.value ? styles.active : ''}`}
          onClick={() => onChange(opt.value)}
          title={opt.label}
        >
          <span className={styles.icon}>{opt.icon}</span>
          <span className={styles.label}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};
