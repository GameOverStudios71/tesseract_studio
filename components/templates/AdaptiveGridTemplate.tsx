import React, { useRef, useLayoutEffect, useState } from 'react';
import styles from './AdaptiveGridTemplate.module.css';

interface ObjectData {
  id: string;
  className: string;
  size: number;
  isLandscape: boolean;
  aspectW: number;
  aspectH: number;
}

const objects: ObjectData[] = [
  { id: 'top-left', className: styles.topLeft, size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'top-center-left', className: styles.topCenterLeft, size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'top-middle', className: styles.topMiddle, size: 15, isLandscape: false, aspectW: 9, aspectH: 16 },
  { id: 'top-center-right', className: styles.topCenterRight, size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'top-right', className: styles.topRight, size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'middle-left', className: styles.middleLeft, size: 15, isLandscape: false, aspectW: 9, aspectH: 16 },
  { id: 'center-left', className: styles.centerLeft, size: 15, isLandscape: true, aspectW: 1, aspectH: 1 },
  { id: 'middle-middle', className: styles.middleMiddle, size: 20, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'center-right', className: styles.centerRight, size: 15, isLandscape: true, aspectW: 1, aspectH: 1 },
  { id: 'middle-right', className: styles.middleRight, size: 15, isLandscape: false, aspectW: 9, aspectH: 16 },
  { id: 'bottom-left', className: styles.bottomLeft, size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'bottom-center-left', className: styles.bottomCenterLeft, size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'bottom-middle', className: styles.bottomMiddle, size: 15, isLandscape: false, aspectW: 9, aspectH: 16 },
  { id: 'bottom-center-right', className: styles.bottomCenterRight, size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
  { id: 'bottom-right', className: styles.bottomRight, size: 15, isLandscape: true, aspectW: 16, aspectH: 9 },
];

const AdaptiveGridTemplate: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDims({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });

    resizeObserver.observe(wrapperRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const getObjectStyle = (obj: ObjectData, vmin: number): React.CSSProperties => {
    const baseSize = (obj.size * vmin) / 100;
    const w = obj.isLandscape ? baseSize : (baseSize * obj.aspectW) / obj.aspectH;
    const h = !obj.isLandscape ? baseSize : (baseSize * obj.aspectH) / obj.aspectW;

    return {
      '--base-size': `${baseSize}px`,
      '--w': `${w}px`,
      '--h': `${h}px`,
    } as React.CSSProperties;
  };

  const vmin = Math.min(dims.width, dims.height);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={{
        '--component-width-val': `${dims.width}px`,
        '--component-height-val': `${dims.height}px`,
      } as React.CSSProperties}
    >
      <div className={styles.container}>
        {objects.map(obj => (
          <div
            key={obj.id}
            className={`${styles.object} ${obj.className}`}
            style={getObjectStyle(obj, vmin)}
          />
        ))}
        <div className={styles.content}>
          {/* Scrollable Content Here */}
          <p>This content is inside the container and can scroll.</p>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveGridTemplate;
