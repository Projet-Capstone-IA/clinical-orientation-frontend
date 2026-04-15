import React, { useEffect, useRef } from 'react';

import mermaid from 'mermaid';
import { usePreferences } from '../../contexts/PreferencesContext';
import styles from './OrientationSheet.module.scss';


interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);
  const { theme } = usePreferences();

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    // Reset container immediately to avoid ghosting
    containerRef.current.innerHTML = '';
    
    // Increment render ID for this specific call
    const currentRenderId = ++renderIdRef.current;

    const renderWithDelay = setTimeout(async () => {
      if (!containerRef.current || currentRenderId !== renderIdRef.current) return;

      const getResolvedVar = (name: string) => {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      };

      try {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'base',
          themeVariables: {
            primaryColor: getResolvedVar('--brand-primary'),
            primaryTextColor: getResolvedVar('--bubble-user-text'),
            primaryBorderColor: getResolvedVar('--brand-primary-dark'),
            lineColor: getResolvedVar('--brand-primary'),
            secondaryColor: getResolvedVar('--brand-primary-light'),
            tertiaryColor: getResolvedVar('--bg-tertiary'),
            mainBkg: getResolvedVar('--bg-secondary'),
            nodeBorder: getResolvedVar('--border'),
            clusterBkg: getResolvedVar('--bg-tertiary'),
            clusterBorder: getResolvedVar('--border'),
            titleColor: getResolvedVar('--text-primary'),
            edgeLabelBackground: getResolvedVar('--bg-primary'),
            nodeTextColor: getResolvedVar('--text-primary'),
          },
          themeCSS: `
            .node text { fill: var(--text-primary) !important; font-weight: 500; }
            .edgeLabel text { fill: var(--text-primary) !important; }
            .node rect, .node polygon, .node circle, .node ellipse { stroke-width: 2px; }
          `,
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            rankSpacing: 40,
            nodeSpacing: 50,
          },
        });

        const id = `mermaid-svg-${currentRenderId}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (containerRef.current && currentRenderId === renderIdRef.current) {
          containerRef.current.innerHTML = svg;
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (containerRef.current && currentRenderId === renderIdRef.current) {
          containerRef.current.innerHTML = `<pre style="color: var(--text-secondary); font-size: 0.8rem; padding: 1rem; overflow: auto; max-width: 100%; border: 1px dashed var(--border);">${chart}</pre>`;
        }
      }
    }, 150); // Small delay to let animations settle and container dimensions stabilize

    return () => {
      clearTimeout(renderWithDelay);
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [chart, theme]);

  return (
    <div
      ref={containerRef}
      className={styles.diagramContainer}
      style={{
        width: '100%',
        minHeight: '300px',
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem 0',
        transition: 'all 0.3s ease',
      }}
    />
  );
};



