
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state';
import { applyStylesToDecorativeElement } from './styleUpdater';
import { selectElement } from './selectionManager';
import { setupDroppable } from './droppedControlController';
import { SHADOW_CLASSES } from './constants';
import type { ElementConfig, AnchorXType, AnchorYType, ElementDisplayType, ElementOverflowType, BackgroundSizeType, BackgroundRepeatType, ElementBorderStyle } from './types';


function populateVisibilityToggles() {
    if (!dom.elementVisibilityTogglesContainer) return;

    dom.elementVisibilityTogglesContainer.innerHTML = ''; // Limpa os botões existentes

    Object.keys(state.elementsConfig).sort().forEach(id => {
        const config = state.elementsConfig[id];
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = id.replace('ds-', '').toUpperCase(); // Ex: 'ds-tl' -> 'TL'
        button.title = `Toggle ${id}`;
        
        const baseClasses = 'p-2 rounded-md text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50';
        const activeClasses = 'bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-400';
        const inactiveClasses = 'bg-slate-600 text-slate-300 hover:bg-slate-500 focus:ring-slate-400';

        button.className = `${baseClasses} ${config.isVisible ? activeClasses : inactiveClasses}`;

        button.addEventListener('click', () => {
            config.isVisible = !config.isVisible;
            applyStylesToDecorativeElement(id);
            // Atualiza a aparência do botão
            button.className = `${baseClasses} ${config.isVisible ? activeClasses : inactiveClasses}`;
            // Se o elemento for ativado, seleciona-o. Se for desativado e estava selecionado, limpa a seleção.
            if (config.isVisible) {
                selectElement(id);
            } else if (state.selectedElementId === id) {
                selectElement(null);
            }
        });

        dom.elementVisibilityTogglesContainer?.appendChild(button);
    });
}


export function initializeElementsConfig() {
  const decorativeElements = document.querySelectorAll<HTMLElement>('.decorative-element');
  decorativeElements.forEach(el => {
    const id = el.dataset.elementId;
    if (!id) return;

    const computedStyle = getComputedStyle(el);
    const initialWidth = parseFloat(computedStyle.width);
    const initialHeight = parseFloat(computedStyle.height);
    const vmin = Math.min(window.innerWidth, window.innerHeight) / 100; 
    
    const anchorX = el.dataset.anchorX as AnchorXType || 'center';
    const anchorY = el.dataset.anchorY as AnchorYType || 'center';
    
    const filterBlurMatch = computedStyle.filter.match(/blur\((\d+(\.\d+)?)px\)/);

    const newElementConfig: ElementConfig = {
      id: id,
      element: el,
      anchorX: anchorX,
      anchorY: anchorY,
      isVisible: false, //computedStyle.display !== 'none',
      display: 'flex', 
      zIndex: parseInt(computedStyle.zIndex) || 0,
      overflowX: 'hidden' as ElementOverflowType, 
      overflowY: 'hidden' as ElementOverflowType, 
      widthVmin: parseFloat((initialWidth / vmin).toFixed(1)) || 20, 
      heightVmin: parseFloat((initialHeight / vmin).toFixed(1)) || 20, 
      marginTopVmin: parseFloat(computedStyle.marginTop) / vmin || 0,
      marginRightVmin: parseFloat(computedStyle.marginRight) / vmin || 0,
      marginBottomVmin: parseFloat(computedStyle.marginBottom) / vmin || 0,
      marginLeftVmin: parseFloat(computedStyle.marginLeft) / vmin || 0,
      bgColor: computedStyle.backgroundColor || '#8b5cf6', 
      imageUrl: '',
      backgroundSize: 'cover',
      bgRepeat: 'no-repeat',
      bgPosition: 'center center',
      shadowClass: Array.from(el.classList).find(cls => SHADOW_CLASSES.includes(cls)) || 'shadow-xl',
      opacity: parseFloat(computedStyle.opacity) || 1,
      filterBlur: filterBlurMatch ? parseFloat(filterBlurMatch[1]) : 0, 
      filterBrightness: 1, filterContrast: 1, filterGrayscale: 0, filterSaturate: 1,
      filterSepia: 0, filterHueRotate: 0, filterInvert: 0,
      borderWidthVmin: 0,
      borderStyle: 'none',
      borderColor: '#FFFFFF', 
      borderRadiusVmin: 0.5, 
      rotationDeg: 0,
      transformScale: 1, transformTranslateX: 0, transformTranslateY: 0,
      transformSkewX: 0, transformSkewY: 0,
      animationName: '',
      animationIterationClass: '',
      animationDelayClass: '',
      animationSpeedClass: '',
      animationOnHover: false,
    };
    state.updateElementConfig(id, newElementConfig);

    el.addEventListener('click', (e) => {
        // Prevent selection if a child control is clicked
        if (e.target !== el && (e.target as HTMLElement).closest('.dropped-control')) {
            return;
        }
        selectElement(id);
    });
    setupDroppable(el);
  });

  // After all elements are configured, apply initial styles (which will hide them)
  Object.keys(state.elementsConfig).forEach(id => {
      applyStylesToDecorativeElement(id);
  });

  // Now, create the visibility toggles
  populateVisibilityToggles();
}


export function setupDecorativeElementPanelListeners() {
  if (!dom.visibleInput || !dom.elDisplaySelect || !dom.elZIndexInput || !dom.elOverflowXSelect || !dom.elOverflowYSelect ||
      !dom.widthInput || !dom.heightInput || !dom.bgColorInput || !dom.shadowSelect ||
      !dom.marginTopInput || !dom.marginRightInput || !dom.marginBottomInput || !dom.marginLeftInput ||
      !dom.imageUrlInput || !dom.bgSizeSelect || !dom.elBgRepeatSelect || !dom.elBgPositionInput ||
      !dom.opacityInput || !dom.opacityValueDisplay || !dom.elBlurInput || !dom.elBlurValueDisplay ||
      !dom.elBrightnessInput || !dom.elBrightnessValueDisplay || !dom.elContrastInput || !dom.elContrastValueDisplay ||
      !dom.elSaturateInput || !dom.elSaturateValueDisplay || !dom.elGrayscaleInput || !dom.elGrayscaleValueDisplay ||
      !dom.elSepiaInput || !dom.elSepiaValueDisplay || !dom.elInvertInput || !dom.elInvertValueDisplay ||
      !dom.elHueRotateInput || !dom.elHueRotateValueDisplay ||
      !dom.elBorderWidthInput || !dom.elBorderStyleSelect || !dom.elBorderColorInput || !dom.elBorderRadiusInput || 
      !dom.elRotationInput || !dom.elRotationValueDisplay || !dom.elScaleInput || !dom.elScaleValueDisplay ||
      !dom.elTranslateXInput || !dom.elTranslateYInput || !dom.elSkewXInput || !dom.elSkewYInput
    ) return;

  const updateFn = () => { if (state.selectedElementId) applyStylesToDecorativeElement(state.selectedElementId); };

  dom.visibleInput.addEventListener('change', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].isVisible = (e.target as HTMLInputElement).checked; updateFn(); }});
  dom.elDisplaySelect.addEventListener('change', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].display = (e.target as HTMLSelectElement).value as ElementDisplayType; updateFn(); }});
  dom.elZIndexInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].zIndex = parseInt((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.elOverflowXSelect.addEventListener('change', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].overflowX = (e.target as HTMLSelectElement).value as ElementOverflowType; updateFn(); }});
  dom.elOverflowYSelect.addEventListener('change', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].overflowY = (e.target as HTMLSelectElement).value as ElementOverflowType; updateFn(); }});
  dom.widthInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].widthVmin = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.heightInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].heightVmin = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.marginTopInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].marginTopVmin = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.marginRightInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].marginRightVmin = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.marginBottomInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].marginBottomVmin = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.marginLeftInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].marginLeftVmin = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.bgColorInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].bgColor = (e.target as HTMLInputElement).value; if (!state.elementsConfig[state.selectedElementId].imageUrl) { updateFn(); } }});
  dom.imageUrlInput.addEventListener('change', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].imageUrl = (e.target as HTMLInputElement).value; updateFn(); }});
  dom.bgSizeSelect.addEventListener('change', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].backgroundSize = (e.target as HTMLSelectElement).value as BackgroundSizeType; if (state.elementsConfig[state.selectedElementId].imageUrl) { updateFn(); } }});
  dom.elBgRepeatSelect.addEventListener('change', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].bgRepeat = (e.target as HTMLSelectElement).value as BackgroundRepeatType; if (state.elementsConfig[state.selectedElementId].imageUrl) { updateFn(); } }});
  dom.elBgPositionInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].bgPosition = (e.target as HTMLInputElement).value; if (state.elementsConfig[state.selectedElementId].imageUrl) { updateFn(); } }});
  dom.shadowSelect.addEventListener('change', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].shadowClass = (e.target as HTMLSelectElement).value; updateFn(); }});
  
  dom.opacityInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.opacityValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 1; state.elementsConfig[state.selectedElementId].opacity = val; dom.opacityValueDisplay.textContent = val.toFixed(2); updateFn(); }});
  dom.elBlurInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elBlurValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 0; state.elementsConfig[state.selectedElementId].filterBlur = val; dom.elBlurValueDisplay.textContent = val.toString(); updateFn(); }});
  dom.elBrightnessInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elBrightnessValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 1; state.elementsConfig[state.selectedElementId].filterBrightness = val; dom.elBrightnessValueDisplay.textContent = val.toFixed(2); updateFn(); }});
  dom.elContrastInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elContrastValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 1; state.elementsConfig[state.selectedElementId].filterContrast = val; dom.elContrastValueDisplay.textContent = val.toFixed(2); updateFn(); }});
  dom.elSaturateInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elSaturateValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 1; state.elementsConfig[state.selectedElementId].filterSaturate = val; dom.elSaturateValueDisplay.textContent = val.toFixed(2); updateFn(); }});
  dom.elGrayscaleInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elGrayscaleValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 0; state.elementsConfig[state.selectedElementId].filterGrayscale = val; dom.elGrayscaleValueDisplay.textContent = val.toFixed(2); updateFn(); }});
  dom.elSepiaInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elSepiaValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 0; state.elementsConfig[state.selectedElementId].filterSepia = val; dom.elSepiaValueDisplay.textContent = val.toFixed(2); updateFn(); }});
  dom.elInvertInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elInvertValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 0; state.elementsConfig[state.selectedElementId].filterInvert = val; dom.elInvertValueDisplay.textContent = val.toFixed(2); updateFn(); }});
  dom.elHueRotateInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elHueRotateValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 0; state.elementsConfig[state.selectedElementId].filterHueRotate = val; dom.elHueRotateValueDisplay.textContent = val.toString(); updateFn(); }});
  
  dom.elBorderWidthInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].borderWidthVmin = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.elBorderStyleSelect.addEventListener('change', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].borderStyle = (e.target as HTMLSelectElement).value as ElementBorderStyle; updateFn(); }});
  dom.elBorderColorInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].borderColor = (e.target as HTMLInputElement).value; updateFn(); }});
  dom.elBorderRadiusInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].borderRadiusVmin = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  
  dom.elRotationInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elRotationValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 0; state.elementsConfig[state.selectedElementId].rotationDeg = val; dom.elRotationValueDisplay.textContent = val.toString(); updateFn(); }});
  dom.elScaleInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId] && dom.elScaleValueDisplay) { const val = parseFloat((e.target as HTMLInputElement).value) || 1; state.elementsConfig[state.selectedElementId].transformScale = val; dom.elScaleValueDisplay.textContent = val.toFixed(2); updateFn(); }});
  dom.elTranslateXInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].transformTranslateX = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.elTranslateYInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].transformTranslateY = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.elSkewXInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].transformSkewX = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
  dom.elSkewYInput.addEventListener('input', (e) => { if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) { state.elementsConfig[state.selectedElementId].transformSkewY = parseFloat((e.target as HTMLInputElement).value) || 0; updateFn(); }});
}