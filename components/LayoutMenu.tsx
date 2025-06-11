import React, { useEffect } from 'react';

interface LayoutMenuProps {
  children?: React.ReactNode;
  containerMarginPercent?: number;
  containerBorderPercent?: number;
  minObjectSizePx?: number;
  showObjects?: boolean;
}

const LayoutMenu: React.FC<LayoutMenuProps> = ({
  children,
  containerMarginPercent = 3,
  containerBorderPercent = 1,
  minObjectSizePx = 25,
  showObjects = true
}) => {
  
  // Grid objects configuration
  const gridObjects = [
    // Linha Superior
    { id: 'top-left', number: '1', color: '#e6194B', size: 15, landscape: true, aspectW: 16, aspectH: 9 },
    { id: 'top-center-left', number: '2', color: '#3cb44b', size: 15, landscape: true, aspectW: 16, aspectH: 9 },
    { id: 'top-middle', number: '3', color: '#ffe119', size: 15, landscape: false, aspectW: 9, aspectH: 16 },
    { id: 'top-center-right', number: '4', color: '#4363d8', size: 15, landscape: true, aspectW: 16, aspectH: 9 },
    { id: 'top-right', number: '5', color: '#f58231', size: 15, landscape: true, aspectW: 16, aspectH: 9 },
    
    // Linha Central
    { id: 'middle-left', number: '6', color: '#911eb4', size: 5, landscape: false, aspectW: 3, aspectH: 4 },
    { id: 'center-left', number: '7', color: '#46f0f0', size: 5, landscape: true, aspectW: 1, aspectH: 1 },
    { id: 'middle-middle', number: '8', color: '#f032e6', size: 8, landscape: true, aspectW: 16, aspectH: 9 },
    { id: 'center-right', number: '9', color: '#bcf60c', size: 5, landscape: true, aspectW: 1, aspectH: 1 },
    { id: 'middle-right', number: '10', color: '#fabebe', size: 5, landscape: false, aspectW: 3, aspectH: 4 },
    
    // Linha Inferior
    { id: 'bottom-left', number: '11', color: '#008080', size: 5, landscape: true, aspectW: 16, aspectH: 9 },
    { id: 'bottom-center-left', number: '12', color: '#e6beff', size: 5, landscape: true, aspectW: 16, aspectH: 9 },
    { id: 'bottom-middle', number: '13', color: '#9a6324', size: 5, landscape: false, aspectW: 9, aspectH: 16 },
    { id: 'bottom-center-right', number: '14', color: '#fffac8', size: 5, landscape: true, aspectW: 16, aspectH: 9 },
    { id: 'bottom-right', number: '15', color: '#800000', size: 5, landscape: true, aspectW: 16, aspectH: 9 },
  ];

  // Generate CSS variables and styles
  const generateCSS = () => {
    let css = `
      :root {
        /* 🎯 VARIÁVEIS PRINCIPAIS RESPONSIVAS */
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

        /* Largura interna do container */
        --container-inner-width: calc(100vw - var(--double-margin) - var(--double-border));

        /* Posições calculadas */
        --quarter-position: calc(var(--container-margin) + var(--container-border) + var(--container-inner-width) / 4);
        --three-quarter-position: calc(var(--container-margin) + var(--container-border) + var(--container-inner-width) * 3 / 4);
    `;

    // Add object-specific variables
    gridObjects.forEach(obj => {
      const objName = obj.id.replace(/-/g, '-');
      css += `
        --object-${objName}-size: ${obj.size};
        --object-${objName}-orientation-is-landscape: ${obj.landscape ? 1 : 0};
        --object-${objName}-aspect-w: ${obj.aspectW};
        --object-${objName}-aspect-h: ${obj.aspectH};
      `;
    });

    // Add calculated dimensions
    gridObjects.forEach(obj => {
      const objName = obj.id.replace(/-/g, '-');
      css += `
        --_base-scale-${objName}: max(calc(var(--object-${objName}-size) * 1vmin), var(--min-object-size-px));
        --final-width-${objName}: calc(var(--object-${objName}-orientation-is-landscape) * var(--_base-scale-${objName}) + calc(1 - var(--object-${objName}-orientation-is-landscape)) * (var(--_base-scale-${objName}) * (var(--object-${objName}-aspect-w) / var(--object-${objName}-aspect-h))));
        --final-height-${objName}: calc(var(--object-${objName}-orientation-is-landscape) * (var(--_base-scale-${objName}) * (var(--object-${objName}-aspect-h) / var(--object-${objName}-aspect-w))) + calc(1 - var(--object-${objName}-orientation-is-landscape)) * var(--_base-scale-${objName}));
        --smaller-dim-${objName}: calc(var(--object-${objName}-orientation-is-landscape) * var(--final-height-${objName}) + calc(1 - var(--object-${objName}-orientation-is-landscape)) * var(--final-width-${objName}));
        --half-${objName}-width: calc(var(--final-width-${objName}) / 2);
        --half-${objName}-height: calc(var(--final-height-${objName}) / 2);
      `;
    });

    css += `
      }
      
      .layout-menu-wrapper {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
      }
      
      .layout-menu-wrapper * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      .layout-menu-wrapper .container {
        width: calc(100vw - var(--double-margin));
        height: calc(100vh - var(--double-margin));
        border: var(--container-border) solid #333;
        overflow: hidden;
        background-color: #f0f0f0;
        margin: var(--container-margin);
      }
      
      .layout-menu-wrapper .content {
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: calc(2vw + 1vh);
        background-color: white;
      }
      
      .layout-menu-wrapper .object {
        position: fixed;
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
      
      .layout-menu-wrapper .object:hover {
        transform: scale(1.1);
        filter: brightness(1.2);
        cursor: pointer;
        z-index: 1001;
      }
    `;

    // Add individual object styles and positioning
    gridObjects.forEach(obj => {
      const objName = obj.id.replace(/-/g, '-');
      
      // Object styles
      css += `
        .layout-menu-wrapper #${obj.id} {
          background: ${obj.color};
          width: var(--final-width-${objName});
          height: var(--final-height-${objName});
          border: max(calc(var(--smaller-dim-${objName}) * 0.05), var(--min-border)) solid #333;
          border-radius: max(calc(var(--smaller-dim-${objName}) * 0.2), var(--min-border-radius));
          box-shadow: 0 max(calc(var(--smaller-dim-${objName}) * 0.08), var(--min-shadow)) max(calc(var(--smaller-dim-${objName}) * 0.15), calc(var(--min-shadow) * 2)) rgba(0, 0, 0, 0.3);
          font-size: max(calc(var(--smaller-dim-${objName}) * 0.3), var(--min-font-size));
          text-shadow: max(calc(var(--smaller-dim-${objName}) * 0.02), 1px) max(calc(var(--smaller-dim-${objName}) * 0.02), 1px) max(calc(var(--smaller-dim-${objName}) * 0.04), 2px) rgba(255, 255, 255, 0.8);
      `;

      // Positioning based on object ID
      if (obj.id.startsWith('top-')) {
        if (obj.id === 'top-left') {
          css += `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'top-center-left') {
          css += `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--quarter-position) - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'top-middle') {
          css += `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(50vw - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'top-center-right') {
          css += `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--three-quarter-position) - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'top-right') {
          css += `
            top: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            right: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
        }
      } else if (obj.id.includes('middle') || obj.id.includes('center')) {
        if (obj.id === 'middle-left') {
          css += `
            top: calc(50vh - var(--half-${objName}-height));
            left: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'center-left') {
          css += `
            top: calc(50vh - var(--half-${objName}-height));
            left: calc(var(--quarter-position) - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'middle-middle') {
          css += `
            top: calc(50vh - var(--half-${objName}-height));
            left: calc(50vw - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'center-right') {
          css += `
            top: calc(50vh - var(--half-${objName}-height));
            left: calc(var(--three-quarter-position) - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'middle-right') {
          css += `
            top: calc(50vh - var(--half-${objName}-height));
            right: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
        }
      } else if (obj.id.startsWith('bottom-')) {
        if (obj.id === 'bottom-left') {
          css += `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'bottom-center-left') {
          css += `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--quarter-position) - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'bottom-middle') {
          css += `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(50vw - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'bottom-center-right') {
          css += `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            left: calc(var(--three-quarter-position) - var(--half-${objName}-width));
          `;
        } else if (obj.id === 'bottom-right') {
          css += `
            bottom: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-height));
            right: calc(var(--container-margin) + var(--half-border) - var(--half-${objName}-width));
          `;
        }
      }

      css += `
        }
      `;
    });

    return css;
  };

  // Inject CSS into document head
  useEffect(() => {
    const styleId = 'layout-menu-styles';
    let existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = generateCSS();
    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [containerMarginPercent, containerBorderPercent, minObjectSizePx]);

  return (
    <div className="layout-menu-wrapper">
      {/* Grid objects positioned outside the container */}
      {showObjects && gridObjects.map(obj => (
        <div key={obj.id} className="object" id={obj.id}>
          {obj.number}
        </div>
      ))}

      {/* Container principal */}
      <div className="container">
        <div className="content">
          {children || (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
              Conteúdo do container...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutMenu;
