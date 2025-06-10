import React from 'react';
import { LayoutElement, GridSystemConfig } from '../types';
import CanvasArea from './CanvasArea';

interface GridCanvasProps {
  rootElementIds: string[];
  allElements: Record<string, LayoutElement>;
  onSelectElement: (id: string) => void;
  selectedElementId: string | null;
  gridConfig: GridSystemConfig;
}

const GridCanvas: React.FC<GridCanvasProps> = ({
  rootElementIds,
  allElements,
  onSelectElement,
  selectedElementId,
  gridConfig
}) => {
  // Generate CSS variables for the grid system
  const generateGridCSS = () => {
    const { containerMarginPercent, containerBorderPercent, minObjectSizePx, objects } = gridConfig;
    
    let cssVariables = `
      --container-margin-percent: ${containerMarginPercent};
      --container-border-percent: ${containerBorderPercent};
      --min-object-size-px: ${minObjectSizePx}px;
      
      /* Valores mínimos para elementos proporcionais */
      --min-border: 1px;
      --min-border-radius: 3px;
      --min-font-size: 8px;
      --min-shadow: 2px;

      /* Conversão para unidades viewport */
      --container-margin: calc(var(--container-margin-percent) * 1vw);
      --container-border: calc(var(--container-border-percent) * 1vw);

      /* Derivadas automáticas */
      --double-margin: calc(var(--container-margin) * 2);
      --double-border: calc(var(--container-border) * 2);
      --half-border: calc(var(--container-border) / 2);

      /* Largura interna do container (para cálculos) */
      --container-inner-width: calc(100vw - var(--double-margin) - var(--double-border));

      /* Posições calculadas para os centros das metades */
      --quarter-position: calc(var(--container-margin) + var(--container-border) + var(--container-inner-width) / 4);
      --three-quarter-position: calc(var(--container-margin) + var(--container-border) + var(--container-inner-width) * 3 / 4);
    `;

    // Add object-specific variables
    objects.forEach(obj => {
      const objName = obj.id.replace(/-/g, '-');
      cssVariables += `
        --object-${objName}-size: ${obj.size};
        --object-${objName}-orientation-is-landscape: ${obj.orientationIsLandscape ? 1 : 0};
        --object-${objName}-aspect-w: ${obj.aspectW};
        --object-${objName}-aspect-h: ${obj.aspectH};
      `;
    });

    // Add calculated dimensions for each object
    objects.forEach(obj => {
      const objName = obj.id.replace(/-/g, '-');
      cssVariables += `
        --_base-scale-${objName}: max(calc(var(--object-${objName}-size) * 1vmin), var(--min-object-size-px));
        --final-width-${objName}: calc(var(--object-${objName}-orientation-is-landscape) * var(--_base-scale-${objName}) + calc(1 - var(--object-${objName}-orientation-is-landscape)) * (var(--_base-scale-${objName}) * (var(--object-${objName}-aspect-w) / var(--object-${objName}-aspect-h))));
        --final-height-${objName}: calc(var(--object-${objName}-orientation-is-landscape) * (var(--_base-scale-${objName}) * (var(--object-${objName}-aspect-h) / var(--object-${objName}-aspect-w))) + calc(1 - var(--object-${objName}-orientation-is-landscape)) * var(--_base-scale-${objName}));
        --smaller-dim-${objName}: calc(var(--object-${objName}-orientation-is-landscape) * var(--final-height-${objName}) + calc(1 - var(--object-${objName}-orientation-is-landscape)) * var(--final-width-${objName}));
        --half-${objName}-width: calc(var(--final-width-${objName}) / 2);
        --half-${objName}-height: calc(var(--final-height-${objName}) / 2);
      `;
    });

    return cssVariables;
  };

  // Generate positioning CSS for objects
  const generatePositioningCSS = () => {
    return gridConfig.objects.map(obj => {
      if (!obj.isVisible) return '';
      
      const objName = obj.id.replace(/-/g, '-');
      let positionCSS = '';

      // Determine positioning based on object position
      switch (obj.position) {
        case 'top-left':
          positionCSS = `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
          break;
        case 'top-center-left':
          positionCSS = `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--quarter-position) - var(--half-${objName}-width));
          `;
          break;
        case 'top-middle':
          positionCSS = `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(50vw - var(--half-${objName}-width));
          `;
          break;
        case 'top-center-right':
          positionCSS = `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--three-quarter-position) - var(--half-${objName}-width));
          `;
          break;
        case 'top-right':
          positionCSS = `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            right: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
          break;
        case 'middle-left':
          positionCSS = `
            top: calc(50vh - var(--half-${objName}-height));
            left: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
          break;
        case 'center-left':
          positionCSS = `
            top: calc(50vh - var(--half-${objName}-height));
            left: calc(var(--quarter-position) - var(--half-${objName}-width));
          `;
          break;
        case 'middle-middle':
          positionCSS = `
            top: calc(50vh - var(--half-${objName}-height));
            left: calc(50vw - var(--half-${objName}-width));
          `;
          break;
        case 'center-right':
          positionCSS = `
            top: calc(50vh - var(--half-${objName}-height));
            left: calc(var(--three-quarter-position) - var(--half-${objName}-width));
          `;
          break;
        case 'middle-right':
          positionCSS = `
            top: calc(50vh - var(--half-${objName}-height));
            right: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
          break;
        case 'bottom-left':
          positionCSS = `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
          break;
        case 'bottom-center-left':
          positionCSS = `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--quarter-position) - var(--half-${objName}-width));
          `;
          break;
        case 'bottom-middle':
          positionCSS = `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(50vw - var(--half-${objName}-width));
          `;
          break;
        case 'bottom-center-right':
          positionCSS = `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--three-quarter-position) - var(--half-${objName}-width));
          `;
          break;
        case 'bottom-right':
          positionCSS = `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            right: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
          break;
      }

      return `
        #grid-object-${obj.id} {
          position: fixed;
          width: var(--final-width-${objName});
          height: var(--final-height-${objName});
          background: ${obj.backgroundColor};
          border: max(calc(var(--smaller-dim-${objName}) * 0.05), var(--min-border)) solid #333;
          border-radius: max(calc(var(--smaller-dim-${objName}) * 0.2), var(--min-border-radius));
          box-shadow: 0 max(calc(var(--smaller-dim-${objName}) * 0.08), var(--min-shadow)) max(calc(var(--smaller-dim-${objName}) * 0.15), calc(var(--min-shadow) * 2)) rgba(0, 0, 0, 0.3);
          font-size: max(calc(var(--smaller-dim-${objName}) * 0.3), var(--min-font-size));
          text-shadow: max(calc(var(--smaller-dim-${objName}) * 0.02), 1px) max(calc(var(--smaller-dim-${objName}) * 0.02), 1px) max(calc(var(--smaller-dim-${objName}) * 0.04), 2px) rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Arial', sans-serif;
          font-weight: bold;
          color: #333;
          user-select: none;
          transition: all 0.3s ease;
          z-index: 1000;
          ${positionCSS}
        }
        
        #grid-object-${obj.id}:hover {
          transform: scale(1.1);
          filter: brightness(1.2);
          cursor: pointer;
          z-index: 1001;
        }
      `;
    }).join('\n');
  };

  // Apply CSS to document head
  React.useEffect(() => {
    const styleId = 'grid-system-styles';
    let existingStyle = document.getElementById(styleId);

    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      :root {
        ${generateGridCSS()}
      }

      .grid-canvas-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .grid-canvas-wrapper .container {
        width: calc(100vw - var(--double-margin));
        height: calc(100vh - var(--double-margin));
        border: var(--container-border) solid #333;
        overflow: hidden;
        background-color: #f0f0f0;
        margin: var(--container-margin);
        position: relative;
      }

      .grid-canvas-wrapper .content {
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: calc(2vw + 1vh);
        background-color: white;
      }

      .grid-canvas-wrapper .object {
        position: absolute;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Arial', sans-serif;
        font-weight: bold;
        color: #333;
        user-select: none;
      }

      .grid-canvas-wrapper .object:hover {
        transform: scale(1.1);
        filter: brightness(1.2);
        cursor: pointer;
        z-index: 1001;
      }

      ${generatePositioningCSS()}
    `;

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [generateGridCSS, generatePositioningCSS]);

  return (
    <div className="grid-canvas-wrapper">
      {/* Grid objects positioned outside the container */}
      {gridConfig.objects.map(obj =>
        obj.isVisible ? (
          <div key={obj.id} className="object" id={obj.id}>
            {obj.id.split('-').pop()}
          </div>
        ) : null
      )}

      {/* Container principal */}
      <div className="container">
        <div className="content">
          {/* Conteúdo do editor React aparece aqui */}
          <CanvasArea
            rootElementIds={rootElementIds}
            allElements={allElements}
            onSelectElement={onSelectElement}
            selectedElementId={selectedElementId}
          />
        </div>
      </div>
    </div>
  );
};
  
export default GridCanvas;
