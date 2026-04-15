import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { RefreshCw, Download, X, Compass } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { MermaidDiagram } from './MermaidDiagram';
import { DiagramTypeSelector } from './DiagramTypeSelector';
import { generateMermaidDefinition } from './mermaidUtils';
import type { DiagramType } from './mermaidUtils';
import { exportAsPng } from '../../utils/exportPng';
import styles from './OrientationSheet.module.scss';

interface OrientationSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrientationSheet: React.FC<OrientationSheetProps> = ({ isOpen, onClose }) => {
  const { orientationData, fetchOrientation } = useChat();
  const { language } = usePreferences();
  const [diagramType, setDiagramType] = useState<DiagramType>('flowchart');
  const [isLoading, setIsLoading] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const prevIsOpen = useRef(isOpen);

  const t = language === 'fr'
    ? { title: "Carte d'orientation", loading: 'Analyse en cours...', noData: "Aucune donnée d'orientation", export: 'Exporter en PNG', refresh: 'Régénérer' }
    : { title: 'Orientation Map', loading: 'Analyzing...', noData: 'No orientation data', export: 'Export as PNG', refresh: 'Regenerate' };

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      await fetchOrientation();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Trigger fetch every time the sheet is opened
    if (isOpen && !prevIsOpen.current) {
      handleFetch();
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  const handleExport = () => {
    if (sheetRef.current) {
      exportAsPng(sheetRef.current, 'orientation-lydi.png');
    }
  };

  if (!isOpen) return null;

  const chartDef = orientationData ? generateMermaidDefinition(orientationData, diagramType) : '';

  return (
    <div className={styles.overlay} onClick={onClose} id="orientation-overlay">
      <Draggable handle=".drag-handle" bounds="parent" axis="y" nodeRef={nodeRef}>
        <div className={styles.sheet} ref={nodeRef} onClick={(e) => e.stopPropagation()}>
          <div className={`drag-handle ${styles.dragHandle}`}>
            <div className={styles.grip} />
          </div>

          <div className={styles.header}>
            <h2>{t.title}</h2>
            <div className={styles.actions}>
              <DiagramTypeSelector value={diagramType} onChange={setDiagramType} />
              <button 
                className={styles.exportBtn} 
                onClick={handleFetch} 
                disabled={isLoading}
                title={t.refresh}
              >
                <RefreshCw size={18} className={isLoading ? styles.spinning : ''} />
              </button>
              <button className={styles.exportBtn} onClick={handleExport} title={t.export}>
                <Download size={18} />
              </button>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className={styles.content} ref={sheetRef}>
            {isLoading ? (
              <div className={styles.loader}>
                <div className={styles.spinner} />
                <span>{t.loading}</span>
              </div>
            ) : chartDef ? (
              <MermaidDiagram chart={chartDef} />
            ) : (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>
                  <Compass size={48} color="var(--text-muted)" />
                </span>
                <p>{t.noData}</p>
              </div>
            )}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

