
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state';
import { rgbToHex } from './utils';
import { switchTab } from './configPanelManager';
import { updateElementHoverAnimationListeners } from './animationController';
import { DEFAULT_TEXTCOLORS_CONTENT, DEFAULT_TEXTCOLORS_GRADIENT_TYPE, DEFAULT_TEXTCOLORS_BASE_COLOR, DEFAULT_TEXTCOLORS_LIGHTEN_COLOR } from './constants';
import type { ElementConfig, TextColorGradientType, FontStyleType, TextTransformType, TextDecorationType, TextAlignmentHorizontal, TextAlignmentVertical, FlexAlignItems, FlexJustifyContent } from './types';


export function selectElement(id: string | null, switchTabToElement: boolean = true) {
  if (state.lastSelectedElement && state.lastSelectedElement.dataset.elementId && state.elementsConfig[state.lastSelectedElement.dataset.elementId]) {
    state.lastSelectedElement.classList.remove('selected-element-highlight');
    updateElementHoverAnimationListeners(state.lastSelectedElement.dataset.elementId, true); 
  }

  if (state.lastSelectedDroppedControl) {
      state.lastSelectedDroppedControl.classList.remove('selected-dropped-control-highlight');
      state.setLastSelectedDroppedControl(null);
      state.setSelectedDroppedControl(null);
  }
  
  state.setSelectedElementId(id);

  if (id && state.elementsConfig[id]) {
    const config = state.elementsConfig[id];
    state.setLastSelectedElement(config.element);
    config.element.classList.add('selected-element-highlight');
    
    updatePanelForSelectedDecorativeElement(config);
    updateElementHoverAnimationListeners(id); 

    if (switchTabToElement && state.activeTabId !== 'animations' && state.activeTabId !== 'controls' && state.activeTabId !== 'components' && state.activeTabId !== 'presets') { 
        switchTab('element'); 
    }
  } else {
    state.setLastSelectedElement(null);
    if (switchTabToElement) { 
        updatePanelForNoSelection();
    }
  }
}


export function handleControlSelection(controlElement: HTMLElement, event?: MouseEvent) {
    if (event) {
        event.stopPropagation();
    }

    selectElement(null, false); // Deselect any decorative element

    if (state.lastSelectedDroppedControl && state.lastSelectedDroppedControl !== controlElement) {
        state.lastSelectedDroppedControl.classList.remove('selected-dropped-control-highlight');
    }

    state.setSelectedDroppedControl(controlElement);
    state.setLastSelectedDroppedControl(controlElement);
    state.selectedDroppedControl.classList.add('selected-dropped-control-highlight');

    updatePanelForSelectedControl();
    switchTab('element');
}


export function updatePanelForSelectedDecorativeElement(config: ElementConfig) {
    if (!dom.decorativeElementPropsSection || !dom.droppedControlPropsSection || !dom.textColorsPropsSection || !dom.noElementSelectedMsg ||
        !dom.animationControlsContainer || !dom.noElementSelectedAnimationMsg || !dom.selectedElementNameDisplay ||
        !dom.animationSelectedElementNameDisplay || !dom.textAlignmentControlsContainer || !dom.containerAlignmentControlsContainer ||
        !dom.droppedControlTypographySection ) return;

    dom.decorativeElementPropsSection.classList.remove('hidden');
    dom.droppedControlPropsSection.classList.add('hidden');
    dom.textColorsPropsSection.classList.add('hidden');
    dom.droppedControlTypographySection.classList.add('hidden');
    dom.noElementSelectedMsg.classList.add('hidden');
    dom.textAlignmentControlsContainer.classList.add('hidden');
    dom.containerAlignmentControlsContainer.classList.add('hidden');

    dom.selectedElementNameDisplay.textContent = `Element: ${config.id}`;
    if (dom.animationSelectedElementNameDisplay) dom.animationSelectedElementNameDisplay.textContent = `Element: ${config.id}`;
    
    dom.animationControlsContainer.style.display = 'block';
    dom.noElementSelectedAnimationMsg.style.display = 'none';
    
    updateDecorativeElementInputs(config);
}

export function updatePanelForSelectedControl() {
    if (!dom.decorativeElementPropsSection || !dom.droppedControlPropsSection || !dom.textColorsPropsSection || !dom.noElementSelectedMsg ||
        !dom.animationControlsContainer || !dom.noElementSelectedAnimationMsg || !dom.selectedElementNameDisplay ||
        !dom.animationSelectedElementNameDisplay || !state.selectedDroppedControl ||
        !dom.textAlignmentControlsContainer || !dom.containerAlignmentControlsContainer || !dom.droppedControlTypographySection ) return;
    
    dom.decorativeElementPropsSection.classList.add('hidden');
    const controlType = state.selectedDroppedControl.dataset.controlType || state.selectedDroppedControl.tagName.toLowerCase();

    if (controlType === 'ansi-art') {
        dom.droppedControlPropsSection.innerHTML = `
            <h3>ANSI Art Settings</h3>
            <div class="space-y-2">
                <textarea class="w-full p-2 border ansi-textarea" placeholder="Cole aqui o código ANSI"></textarea>
                <label for="ansi-width" class="block text-xs text-slate-400">Width (px):</label>
                <input type="number" id="ansi-width" class="form-input text-xs bg-slate-600 border-slate-500 text-slate-200 p-1.5 rounded w-full">
                <label for="ansi-height" class="block text-xs text-slate-400">Height (px):</label>
                <input type="number" id="ansi-height" class="form-input text-xs bg-slate-600 border-slate-500 text-slate-200 p-1.5 rounded w-full">
                <label for="ansi-bg-color" class="block text-xs text-slate-400">Background Color:</label>
                <input type="color" id="ansi-bg-color" class="form-input w-full h-8 p-1 bg-slate-600 border-slate-500 rounded cursor-pointer">
                <label for="ansi-text-color" class="block text-xs text-slate-400">Text Color:</label>
                <input type="color" id="ansi-text-color" class="form-input w-full h-8 p-1 bg-slate-600 border-slate-500 rounded cursor-pointer">
                <label for="ansi-font-family" class="block text-xs text-slate-400">Font Family:</label>
                <select id="ansi-font-family" class="form-select text-xs bg-slate-600 border-slate-500 text-slate-200 p-1.5 rounded w-full">
                    <option value="'Perfect DOS VGA 437 Win', monospace">Perfect DOS VGA 437 Win</option>
                    <option value="monospace">Monospace (Default)</option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="'Lucida Console', monospace">Lucida Console</option>
                </select>
            </div>`;
        const textarea = dom.droppedControlPropsSection.querySelector('.ansi-textarea') as HTMLTextAreaElement;
        const widthInput = dom.droppedControlPropsSection.querySelector('#ansi-width') as HTMLInputElement;
        const heightInput = dom.droppedControlPropsSection.querySelector('#ansi-height') as HTMLInputElement;
        const bgColorInput = dom.droppedControlPropsSection.querySelector('#ansi-bg-color') as HTMLInputElement;
        const textColorInput = dom.droppedControlPropsSection.querySelector('#ansi-text-color') as HTMLInputElement;
        const fontFamilySelect = dom.droppedControlPropsSection.querySelector('#ansi-font-family') as HTMLSelectElement;
        if (state.selectedDroppedControl) {
            // Set initial values
            widthInput.value = (state.selectedDroppedControl.style.width || 'auto').replace('px', '');
            heightInput.value = (state.selectedDroppedControl.style.height || 'auto').replace('px', '');
            bgColorInput.value = state.selectedDroppedControl.style.backgroundColor || '#000000';
            textColorInput.value = state.selectedDroppedControl.style.color || '#ffffff';
            fontFamilySelect.value = state.selectedDroppedControl.style.fontFamily || "'Perfect DOS VGA 437 Win', monospace";
            textarea.value = state.selectedDroppedControl.dataset.ansiCode || '';
            
            // Add event listeners
            textarea.addEventListener('input', (e) => {
                const ansiCode = (e.target as HTMLTextAreaElement).value;
                if (state.selectedDroppedControl) {
                    state.selectedDroppedControl.dataset.ansiCode = ansiCode;
                    const previewElement = state.selectedDroppedControl.querySelector('.ansi-preview');
                    if (previewElement) {
                        previewElement.innerHTML = ansiCode.replace(/\x1b\[ [0-?]*[ -/]*[@-~]/g, ''); // Simple rendering
                    }
                }
            });
            widthInput.addEventListener('input', (e) => {
                if (state.selectedDroppedControl) {
                    state.selectedDroppedControl.style.width = `${(e.target as HTMLInputElement).value}px`;
                }
            });
            heightInput.addEventListener('input', (e) => {
                if (state.selectedDroppedControl) {
                    state.selectedDroppedControl.style.height = `${(e.target as HTMLInputElement).value}px`;
                }
            });
            bgColorInput.addEventListener('input', (e) => {
                if (state.selectedDroppedControl) {
                    state.selectedDroppedControl.style.backgroundColor = (e.target as HTMLInputElement).value;
                }
            });
            textColorInput.addEventListener('input', (e) => {
                if (state.selectedDroppedControl) {
                    state.selectedDroppedControl.style.color = (e.target as HTMLInputElement).value;
                }
            });
            fontFamilySelect.addEventListener('change', (e) => {
                if (state.selectedDroppedControl) {
                    state.selectedDroppedControl.style.fontFamily = (e.target as HTMLSelectElement).value;
                }
            });
        }
        dom.droppedControlPropsSection.classList.remove('hidden');
        dom.selectedElementNameDisplay.textContent = `Control: ANSI Art`;
    } else if (controlType === 'text-colors') {
        dom.droppedControlPropsSection.classList.add('hidden');
        dom.droppedControlTypographySection.classList.add('hidden');
        dom.textColorsPropsSection.classList.remove('hidden');
        dom.selectedElementNameDisplay.textContent = `Control: TextColors`; 
        updateTextColorsComponentInputs(state.selectedDroppedControl);
    } else {
        dom.droppedControlPropsSection.classList.remove('hidden');
        dom.textColorsPropsSection.classList.add('hidden');
        dom.selectedElementNameDisplay.textContent = `Control: ${controlType}`;
        updateDroppedControlInputs(state.selectedDroppedControl);
    }
    
    dom.noElementSelectedMsg.classList.add('hidden');
    if (dom.animationSelectedElementNameDisplay) dom.animationSelectedElementNameDisplay.textContent = 'N/A (Dropped Control)'; 

    dom.animationControlsContainer.style.display = 'none';
    dom.noElementSelectedAnimationMsg.style.display = 'block';
    dom.noElementSelectedAnimationMsg.textContent = 'Animation controls apply to Decorative Elements only.';

    const isTextualControl = ['button', 'text-block', 'text-input'].includes(controlType);
    const isContainerControl = ['row-container', 'column-container'].includes(controlType);

    dom.droppedControlTypographySection.classList.toggle('hidden', !isTextualControl && controlType !== 'text-colors');
    dom.textAlignmentControlsContainer.classList.toggle('hidden', !isTextualControl);
    if(dom.textAlignVerticalSelect && controlType === 'text-input') {
        dom.textAlignVerticalSelect.disabled = true; 
    } else if (dom.textAlignVerticalSelect) {
        dom.textAlignVerticalSelect.disabled = false;
    }

    dom.containerAlignmentControlsContainer.classList.toggle('hidden', !isContainerControl);
}

export function updatePanelForNoSelection() {
    if (!dom.decorativeElementPropsSection || !dom.droppedControlPropsSection || !dom.textColorsPropsSection || !dom.noElementSelectedMsg ||
        !dom.animationControlsContainer || !dom.noElementSelectedAnimationMsg || !dom.selectedElementNameDisplay ||
        !dom.animationSelectedElementNameDisplay || !dom.textAlignmentControlsContainer || !dom.containerAlignmentControlsContainer ||
        !dom.droppedControlTypographySection ) return;

    dom.decorativeElementPropsSection.classList.add('hidden');
    dom.droppedControlPropsSection.classList.add('hidden');
    dom.textColorsPropsSection.classList.add('hidden');
    dom.droppedControlTypographySection.classList.add('hidden');
    dom.noElementSelectedMsg.classList.remove('hidden');
    dom.textAlignmentControlsContainer.classList.add('hidden');
    dom.containerAlignmentControlsContainer.classList.add('hidden');
    
    dom.selectedElementNameDisplay.textContent = 'None';
    if (dom.animationSelectedElementNameDisplay) dom.animationSelectedElementNameDisplay.textContent = 'None';

    dom.animationControlsContainer.style.display = 'none';
    dom.noElementSelectedAnimationMsg.style.display = 'block';
    dom.noElementSelectedAnimationMsg.textContent = 'Select a Decorative Element to configure animations.';
}


export function updateDecorativeElementInputs(config: ElementConfig) {
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
      !dom.elTranslateXInput || !dom.elTranslateYInput || !dom.elSkewXInput || !dom.elSkewYInput ||
      !dom.animationNameSelect || !dom.animationIterationSelect || !dom.animationDelaySelect || 
      !dom.animationSpeedSelect || !dom.animationOnHoverCheckbox ) return;
  
  dom.visibleInput.checked = config.isVisible;
  dom.elDisplaySelect.value = config.display;
  dom.elZIndexInput.value = config.zIndex.toString();
  dom.elOverflowXSelect.value = config.overflowX;
  dom.elOverflowYSelect.value = config.overflowY;
  dom.widthInput.value = config.widthVmin.toString();
  dom.heightInput.value = config.heightVmin.toString();
  dom.marginTopInput.value = config.marginTopVmin.toString();
  dom.marginRightInput.value = config.marginRightVmin.toString();
  dom.marginBottomInput.value = config.marginBottomVmin.toString();
  dom.marginLeftInput.value = config.marginLeftVmin.toString();
  dom.bgColorInput.value = rgbToHex(config.bgColor);
  dom.imageUrlInput.value = config.imageUrl;
  dom.bgSizeSelect.value = config.backgroundSize;
  dom.elBgRepeatSelect.value = config.bgRepeat;
  dom.elBgPositionInput.value = config.bgPosition;
  dom.shadowSelect.value = config.shadowClass;
  dom.opacityInput.value = config.opacity.toString();
  dom.opacityValueDisplay.textContent = config.opacity.toFixed(2);
  dom.elBlurInput.value = config.filterBlur.toString();
  dom.elBlurValueDisplay.textContent = config.filterBlur.toString();
  dom.elBrightnessInput.value = config.filterBrightness.toString();
  dom.elBrightnessValueDisplay.textContent = config.filterBrightness.toFixed(2);
  dom.elContrastInput.value = config.filterContrast.toString();
  dom.elContrastValueDisplay.textContent = config.filterContrast.toFixed(2);
  dom.elSaturateInput.value = config.filterSaturate.toString();
  dom.elSaturateValueDisplay.textContent = config.filterSaturate.toFixed(2);
  dom.elGrayscaleInput.value = config.filterGrayscale.toString();
  dom.elGrayscaleValueDisplay.textContent = config.filterGrayscale.toFixed(2);
  dom.elSepiaInput.value = config.filterSepia.toString();
  dom.elSepiaValueDisplay.textContent = config.filterSepia.toFixed(2);
  dom.elInvertInput.value = config.filterInvert.toString();
  dom.elInvertValueDisplay.textContent = config.filterInvert.toFixed(2);
  dom.elHueRotateInput.value = config.filterHueRotate.toString();
  dom.elHueRotateValueDisplay.textContent = config.filterHueRotate.toString();
  dom.elBorderWidthInput.value = config.borderWidthVmin.toString();
  dom.elBorderStyleSelect.value = config.borderStyle;
  dom.elBorderColorInput.value = config.borderColor; 
  dom.elBorderRadiusInput.value = config.borderRadiusVmin.toString();
  dom.elRotationInput.value = config.rotationDeg.toString();
  dom.elRotationValueDisplay.textContent = config.rotationDeg.toString();
  dom.elScaleInput.value = config.transformScale.toString();
  dom.elScaleValueDisplay.textContent = config.transformScale.toFixed(2);
  dom.elTranslateXInput.value = config.transformTranslateX.toString();
  dom.elTranslateYInput.value = config.transformTranslateY.toString();
  dom.elSkewXInput.value = config.transformSkewX.toString();
  dom.elSkewYInput.value = config.transformSkewY.toString();

  dom.animationNameSelect.value = config.animationName;
  dom.animationIterationSelect.value = config.animationIterationClass;
  dom.animationDelaySelect.value = config.animationDelayClass;
  dom.animationSpeedSelect.value = config.animationSpeedClass;
  dom.animationOnHoverCheckbox.checked = config.animationOnHover;
}

export function updateDroppedControlInputs(control: HTMLElement) {
    if (!dom.droppedControlVisibleInput || !dom.droppedControlTextContentInput || !dom.droppedControlPlaceholderInput ||
        !dom.droppedControlImageSrcInput || !dom.droppedControlWidthInput || !dom.droppedControlHeightInput ||
        !dom.droppedControlBgColorInput || !dom.droppedControlTextColorInput ||
        !dom.droppedControlOpacityInput || !dom.droppedControlOpacityValueDisplay ||
        !dom.droppedControlBorderRadiusInput || !dom.droppedControlBorderWidthInput || !dom.droppedControlBorderStyleSelect || !dom.droppedControlBorderColorInput ||
        !dom.droppedControlBoxShadowXInput || !dom.droppedControlBoxShadowYInput || !dom.droppedControlBoxShadowBlurInput || !dom.droppedControlBoxShadowColorInput ||
        !dom.droppedControlFontFamilyInput || !dom.droppedControlFontSizeInput || !dom.droppedControlFontWeightSelect ||
        !dom.droppedControlFontStyleSelect || !dom.droppedControlLineHeightInput || !dom.droppedControlLetterSpacingInput ||
        !dom.droppedControlTextTransformSelect || !dom.droppedControlTextDecorationSelect ||
        !dom.droppedControlTextShadowXInput || !dom.droppedControlTextShadowYInput || !dom.droppedControlTextShadowBlurInput || !dom.droppedControlTextShadowColorInput ||
        !dom.textAlignHorizontalSelect || !dom.textAlignVerticalSelect || !dom.containerAlignItemsSelect || !dom.containerJustifyContentSelect ) return;

    const computedStyle = getComputedStyle(control);
    dom.droppedControlVisibleInput.checked = computedStyle.display !== 'none';

    if (control.tagName === 'INPUT' || control.tagName === 'TEXTAREA') {
        dom.droppedControlTextContentInput.value = (control as HTMLInputElement | HTMLTextAreaElement).value;
        dom.droppedControlPlaceholderInput.value = (control as HTMLInputElement | HTMLTextAreaElement).placeholder || '';
        dom.droppedControlPlaceholderInput.disabled = false;
    } else {
        dom.droppedControlTextContentInput.value = control.textContent || '';
        dom.droppedControlPlaceholderInput.value = '';
        dom.droppedControlPlaceholderInput.disabled = true;
    }
    
    if (control.tagName === 'IMG') {
        dom.droppedControlImageSrcInput.value = (control as HTMLImageElement).src;
        dom.droppedControlImageSrcInput.disabled = false;
        dom.droppedControlTextContentInput.disabled = true; 
    } else if (control.dataset.controlType === 'image-element') {
        dom.droppedControlImageSrcInput.value = control.style.backgroundImage.slice(5, -2); 
        dom.droppedControlImageSrcInput.disabled = false;
        dom.droppedControlTextContentInput.disabled = true;
    } else {
        dom.droppedControlImageSrcInput.value = '';
        dom.droppedControlImageSrcInput.disabled = true;
        dom.droppedControlTextContentInput.disabled = false;
    }

    dom.droppedControlWidthInput.value = control.style.width || computedStyle.width;
    dom.droppedControlHeightInput.value = control.style.height || computedStyle.height;
    dom.droppedControlBgColorInput.value = rgbToHex(control.style.backgroundColor || computedStyle.backgroundColor);
    dom.droppedControlTextColorInput.value = rgbToHex(control.style.color || computedStyle.color);
    dom.droppedControlOpacityInput.value = control.style.opacity || '1';
    if(dom.droppedControlOpacityValueDisplay) dom.droppedControlOpacityValueDisplay.textContent = parseFloat(control.style.opacity || '1').toFixed(2);
    dom.droppedControlBorderRadiusInput.value = control.style.borderRadius.replace('px','') || '0';
    dom.droppedControlBorderWidthInput.value = control.style.borderWidth.replace('px','') || '0';
    dom.droppedControlBorderStyleSelect.value = control.style.borderStyle || 'none';
    dom.droppedControlBorderColorInput.value = rgbToHex(control.style.borderColor || '#000000');
    
    const boxShadow = control.style.boxShadow; 
    if (boxShadow && boxShadow !== 'none') {
        const parts = boxShadow.match(/rgba?\(.*?\)|#[0-9a-fA-F]{3,8}|(-?\d+px)\s+(-?\d+px)\s+(-?\d+px)\s*(-?\d+px)?/);
        if (parts) {
            dom.droppedControlBoxShadowXInput.value = parts[1]?.replace('px','') || '0';
            dom.droppedControlBoxShadowYInput.value = parts[2]?.replace('px','') || '0';
            dom.droppedControlBoxShadowBlurInput.value = parts[3]?.replace('px','') || '0';
            const colorMatch = boxShadow.match(/rgba?\(.*?\)|#[0-9a-fA-F]{3,8}/);
            if (colorMatch) dom.droppedControlBoxShadowColorInput.value = rgbToHex(colorMatch[0]);
        }
    } else {
        dom.droppedControlBoxShadowXInput.value = '0';
        dom.droppedControlBoxShadowYInput.value = '0';
        dom.droppedControlBoxShadowBlurInput.value = '0';
        dom.droppedControlBoxShadowColorInput.value = '#000000';
    }

    dom.droppedControlFontFamilyInput.value = control.style.fontFamily || '';
    dom.droppedControlFontSizeInput.value = control.style.fontSize || '';
    dom.droppedControlFontWeightSelect.value = control.style.fontWeight || 'normal';
    dom.droppedControlFontStyleSelect.value = control.style.fontStyle as FontStyleType || 'normal';
    dom.droppedControlLineHeightInput.value = control.style.lineHeight || '';
    dom.droppedControlLetterSpacingInput.value = control.style.letterSpacing || '';
    dom.droppedControlTextTransformSelect.value = control.style.textTransform as TextTransformType || 'none';
    dom.droppedControlTextDecorationSelect.value = control.style.textDecorationLine as TextDecorationType || 
                                             control.style.textDecoration as TextDecorationType || 'none'; 

    const textShadow = control.style.textShadow;
     if (textShadow && textShadow !== 'none') {
        const parts = textShadow.match(/(-?\d+px)\s+(-?\d+px)\s+(-?\d+px)\s+(rgba?\(.*?\)|#[0-9a-fA-F]{3,8})/);
        if (parts) {
            dom.droppedControlTextShadowXInput.value = parts[1].replace('px','');
            dom.droppedControlTextShadowYInput.value = parts[2].replace('px','');
            dom.droppedControlTextShadowBlurInput.value = parts[3].replace('px','');
            dom.droppedControlTextShadowColorInput.value = rgbToHex(parts[4]);
        }
    } else {
        dom.droppedControlTextShadowXInput.value = '0';
        dom.droppedControlTextShadowYInput.value = '0';
        dom.droppedControlTextShadowBlurInput.value = '0';
        dom.droppedControlTextShadowColorInput.value = '#000000';
    }

    const controlType = control.dataset.controlType;
    if (controlType === 'button' || controlType === 'text-block' || controlType === 'text-input') {
        dom.textAlignHorizontalSelect.value = control.style.textAlign || 'left';
        if (controlType !== 'text-input' && dom.textAlignVerticalSelect) { 
            dom.textAlignVerticalSelect.value = control.style.alignItems || 'center'; 
        }
    }
    if (controlType === 'row-container' || controlType === 'column-container') {
        if(dom.containerAlignItemsSelect) dom.containerAlignItemsSelect.value = control.style.alignItems || 'flex-start';
        if(dom.containerJustifyContentSelect) dom.containerJustifyContentSelect.value = control.style.justifyContent || 'flex-start';
    }
}

export function updateTextColorsComponentInputs(component: HTMLElement) {
    if (!dom.textColorsContentInput || !dom.textColorsGradientTypeSelect || !dom.textColorsBaseColorPicker || !dom.textColorsLightenColorPicker) return;

    dom.textColorsContentInput.value = component.dataset.textContent || DEFAULT_TEXTCOLORS_CONTENT;
    dom.textColorsGradientTypeSelect.value = component.dataset.gradientType || DEFAULT_TEXTCOLORS_GRADIENT_TYPE;
    dom.textColorsBaseColorPicker.value = component.dataset.baseColor || DEFAULT_TEXTCOLORS_BASE_COLOR;
    dom.textColorsLightenColorPicker.value = component.dataset.lightenColor || DEFAULT_TEXTCOLORS_LIGHTEN_COLOR;
}


export function updateLayer2PanelInputs() {
    if (!dom.layer2VisibleInput || !dom.layer2WidthInput || !dom.layer2HeightInput || !dom.layer2PaddingInput || 
        !dom.layer2BgColorInput || !dom.layer2BorderWidthInput || !dom.layer2BorderColorInput || !dom.layer2ShadowSelect || 
        !dom.layer2BackdropBlurSelect || !state.layer2Config) return;

    dom.layer2VisibleInput.checked = state.layer2Config.isVisible;
    dom.layer2WidthInput.value = state.layer2Config.widthPercent.toString();
    dom.layer2HeightInput.value = state.layer2Config.heightPercent.toString();
    dom.layer2PaddingInput.value = state.layer2Config.paddingPx.toString();
    dom.layer2BgColorInput.value = rgbToHex(state.layer2Config.bgColor);
    dom.layer2BorderWidthInput.value = state.layer2Config.borderWidthPx.toString();
    dom.layer2BorderColorInput.value = rgbToHex(state.layer2Config.borderColor);
    dom.layer2ShadowSelect.value = state.layer2Config.shadowClass;
    dom.layer2BackdropBlurSelect.value = state.layer2Config.backdropBlurClass;
}