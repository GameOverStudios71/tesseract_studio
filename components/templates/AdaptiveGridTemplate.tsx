import React, { useRef, useLayoutEffect, useState } from 'react';
import styles from './AdaptiveGridTemplate.module.css';
import { TemplateSpecificProps } from '../../types';

interface ObjectData {
  id: string;
  size: number;
  isLandscape: boolean;
  aspectW: number;
  aspectH: number;
}

const objects: ObjectData[] = [
  { id: 'top-left', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'top-center-left', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'top-middle', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'top-center-right', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'top-right', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'middle-left', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'center-left', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'middle-middle', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'center-right', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'middle-right', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'bottom-left', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'bottom-center-left', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'bottom-middle', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'bottom-center-right', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'bottom-right', size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
];

interface AdaptiveGridTemplateProps {
  templateProps?: TemplateSpecificProps['templateProps'];
}

const AdaptiveGridTemplate: React.FC<AdaptiveGridTemplateProps> = ({ templateProps }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Create dynamic styles based on the original CSS structure
  const dynamicStyles: React.CSSProperties = {};

  // Apply colors from templateProps if available
  if (templateProps?.colors) {
    for (const [key, value] of Object.entries(templateProps.colors)) {
      // Convert camelCase to kebab-case and create the correct CSS variable name
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      const cssVarName = `--object-${kebabKey}-color-rgb`;
      (dynamicStyles as any)[cssVarName] = value;
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={dynamicStyles}
    >
      {/* Objects positioned outside the container */}
      {objects.map(obj => (
        <div
          key={obj.id}
          className={`${styles.object}`}
          id={obj.id}
        />
      ))}

      {/* Container principal */}
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Scrollable Content Here */}
          <p>Este conteúdo está dentro do container e pode rolar.</p>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveGridTemplate;
