
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as state from './state';
import * as dom from './domElements';
import { SHADOW_CLASSES, BACKDROP_BLUR_CLASSES } from './constants';
import { updatePlaceholderVisibility, rgbToHex } from './utils';
import type { TextAlignmentHorizontal, TextAlignmentVertical, FlexAlignItems, FlexJustifyContent, FontStyleType, TextDecorationType, TextTransformType } from './types';
import { renderTextColorsComponent } from './textColorsComponent';


export function applyStylesToDecorativeElement(id: string) {
  if (!state.elementsConfig[id] || !state.layer2Config) return; 
  const config = state.elementsConfig[id];
  const el = config.element;

  el.style.display = config.isVisible ? config.display : 'none'; 
  el.style.zIndex = config.zIndex.toString();
  el.style.overflowX = config.overflowX;
  el.style.overflowY = config.overflowY;
  el.style.width = `${config.widthVmin}vmin`;
  el.style.height = `${config.heightVmin}vmin`;
  
  el.style.marginTop = `${config.marginTopVmin}vmin`;
  el.style.marginRight = `${config.marginRightVmin}vmin`;
  el.style.marginBottom = `${config.marginBottomVmin}vmin`;
  el.style.marginLeft = `${config.marginLeftVmin}vmin`;

  el.style.opacity = config.opacity.toString();
  el.style.borderRadius = `${config.borderRadiusVmin}vmin`;
  
  const transforms = [
      `translateX(${config.transformTranslateX || 0}vmin)`,
      `translateY(${config.transformTranslateY || 0}vmin)`,
      `rotate(${config.rotationDeg || 0}deg)`,
      `scale(${config.transformScale || 1})`,
      `skewX(${config.transformSkewX || 0}deg)`,
      `skewY(${config.transformSkewY || 0}deg)`,
  ];
  el.style.transform = transforms.join(' ');

  const filters = [
      `blur(${config.filterBlur || 0}px)`,
      `brightness(${config.filterBrightness || 1})`,
      `contrast(${config.filterContrast || 1})`,
      `grayscale(${config.filterGrayscale || 0})`,
      `saturate(${config.filterSaturate || 1})`,
      `sepia(${config.filterSepia || 0})`,
      `hue-rotate(${config.filterHueRotate || 0}deg)`,
      `invert(${config.filterInvert || 0})`
  ];
  const activeFilters = filters.filter(f => 
      !(f.includes("blur(0px)") || f.includes("brightness(1)") || f.includes("contrast(1)") || 
      f.includes("grayscale(0)") || f.includes("saturate(1)") || f.includes("sepia(0)") ||
      f.includes("hue-rotate(0deg)") || f.includes("invert(0)")) 
  );
  el.style.filter = activeFilters.length > 0 ? activeFilters.join(' ') : 'none';


  if (config.borderStyle !== 'none' && config.borderWidthVmin > 0) {
    el.style.border = `${config.borderWidthVmin}vmin ${config.borderStyle} ${config.borderColor}`;
  } else {
    el.style.border = 'none';
  }

  const hasElementBorder = config.borderStyle !== 'none' && config.borderWidthVmin > 0;
  const totalElementVisualWidthVmin = config.widthVmin + (hasElementBorder ? 2 * config.borderWidthVmin : 0);
  const totalElementVisualHeightVmin = config.heightVmin + (hasElementBorder ? 2 * config.borderWidthVmin : 0);
  
  const centeringOffsetX = totalElementVisualWidthVmin / 2;
  const centeringOffsetY = totalElementVisualHeightVmin / 2;

  const layer2ActualWidthPercent = state.layer2Config.widthPercent;
  const layer2ActualHeightPercent = state.layer2Config.heightPercent;

  let targetXPercent = 50; 
  let targetYPercent = 50; 

  if (config.anchorX === 'left') {
    targetXPercent = (50 - layer2ActualWidthPercent / 2);
  } else if (config.anchorX === 'right') {
    targetXPercent = (50 + layer2ActualWidthPercent / 2);
  }

  if (config.anchorY === 'top') {
    targetYPercent = (50 - layer2ActualHeightPercent / 2);
  } else if (config.anchorY === 'bottom') {
    targetYPercent = (50 + layer2ActualHeightPercent / 2);
  }
  
  const halfLayer2Border = state.layer2Config.borderWidthPx / 2;
  let currentBorderOffsetX = 0;
  let currentBorderOffsetY = 0;

  if (config.anchorX === 'left') currentBorderOffsetX = halfLayer2Border;
  else if (config.anchorX === 'right') currentBorderOffsetX = -halfLayer2Border;

  if (config.anchorY === 'top') currentBorderOffsetY = halfLayer2Border;
  else if (config.anchorY === 'bottom') currentBorderOffsetY = -halfLayer2Border;

  el.style.top = `calc(${targetYPercent}% + ${currentBorderOffsetY}px - ${centeringOffsetY}vmin)`;
  el.style.left = `calc(${targetXPercent}% + ${currentBorderOffsetX}px - ${centeringOffsetX}vmin)`;
  
  if (config.imageUrl) {
    el.style.backgroundImage = `url('${config.imageUrl}')`;
    el.style.backgroundSize = config.backgroundSize;
    el.style.backgroundPosition = config.bgPosition;
    el.style.backgroundRepeat = config.bgRepeat;
    el.style.backgroundColor = 'transparent';
  } else {
    el.style.backgroundImage = 'none';
    el.style.backgroundColor = config.bgColor;
  }

  SHADOW_CLASSES.forEach(cls => el.classList.remove(cls));
  if (config.shadowClass !== 'shadow-none') {
    el.classList.add(config.shadowClass);
  }
}

export function applyStylesToDroppedControl() {
    if (!state.selectedDroppedControl || !dom.droppedControlVisibleInput || !dom.droppedControlTextContentInput || 
        !dom.droppedControlPlaceholderInput || !dom.droppedControlImageSrcInput || !dom.droppedControlWidthInput || 
        !dom.droppedControlHeightInput || !dom.droppedControlBgColorInput || !dom.droppedControlTextColorInput ||
        !dom.droppedControlOpacityInput || !dom.droppedControlBorderRadiusInput || 
        !dom.droppedControlBorderWidthInput || !dom.droppedControlBorderStyleSelect || !dom.droppedControlBorderColorInput ||
        !dom.droppedControlBoxShadowXInput || !dom.droppedControlBoxShadowYInput || !dom.droppedControlBoxShadowBlurInput || !dom.droppedControlBoxShadowColorInput ||
        !dom.droppedControlFontFamilyInput || !dom.droppedControlFontSizeInput || !dom.droppedControlFontWeightSelect ||
        !dom.droppedControlFontStyleSelect || !dom.droppedControlLineHeightInput || !dom.droppedControlLetterSpacingInput ||
        !dom.droppedControlTextTransformSelect || !dom.droppedControlTextDecorationSelect ||
        !dom.droppedControlTextShadowXInput || !dom.droppedControlTextShadowYInput || !dom.droppedControlTextShadowBlurInput || !dom.droppedControlTextShadowColorInput ||
        !dom.textAlignHorizontalSelect || !dom.textAlignVerticalSelect || !dom.containerAlignItemsSelect || !dom.containerJustifyContentSelect ) return;

    const control = state.selectedDroppedControl;
    const controlType = control.dataset.controlType || control.tagName.toLowerCase();
    
    if (controlType === 'text-colors') {
        renderTextColorsComponent(control); // TextColors component handles its own rendering based on data attributes
        return;
    }

    control.style.display = dom.droppedControlVisibleInput.checked ? '' : 'none'; 
    control.style.opacity = dom.droppedControlOpacityInput.value;


    if (controlType === 'text-input') {
        (control as HTMLInputElement).value = dom.droppedControlTextContentInput.value;
        (control as HTMLInputElement).placeholder = dom.droppedControlPlaceholderInput.value;
        control.style.textAlign = dom.textAlignHorizontalSelect.value as TextAlignmentHorizontal;
    } else if (controlType === 'button' || controlType === 'text-block') {
        control.textContent = dom.droppedControlTextContentInput.value;
        control.style.textAlign = dom.textAlignHorizontalSelect.value as TextAlignmentHorizontal;
        control.style.display = 'flex'; 
        control.style.alignItems = dom.textAlignVerticalSelect.value as TextAlignmentVertical;
        control.style.justifyContent = 'center'; 
         if(dom.textAlignHorizontalSelect.value === 'left') control.style.justifyContent = 'flex-start';
         if(dom.textAlignHorizontalSelect.value === 'right') control.style.justifyContent = 'flex-end';
    }


    if (controlType === 'image-element') {
        const imgSrc = dom.droppedControlImageSrcInput.value;
        if (imgSrc) {
            control.style.backgroundImage = `url('${imgSrc}')`;
            control.textContent = ''; 
        } else {
            control.style.backgroundImage = 'none';
            control.textContent = 'Image'; 
        }
    }

    if (controlType === 'row-container' || controlType === 'column-container') {
        control.style.alignItems = dom.containerAlignItemsSelect.value as FlexAlignItems;
        control.style.justifyContent = dom.containerJustifyContentSelect.value as FlexJustifyContent;
    }

    control.style.width = dom.droppedControlWidthInput.value || 'auto';
    control.style.height = dom.droppedControlHeightInput.value || 'auto';
    control.style.backgroundColor = dom.droppedControlBgColorInput.value;
    control.style.color = dom.droppedControlTextColorInput.value;

    control.style.borderRadius = `${dom.droppedControlBorderRadiusInput.value || 0}px`;
    const borderWidth = dom.droppedControlBorderWidthInput.value || '0';
    const borderStyle = dom.droppedControlBorderStyleSelect.value;
    const borderColor = dom.droppedControlBorderColorInput.value;
    if (borderStyle !== 'none' && parseFloat(borderWidth) > 0) {
        control.style.border = `${borderWidth}px ${borderStyle} ${borderColor}`;
    } else {
        control.style.border = 'none';
    }
    const boxShadowX = dom.droppedControlBoxShadowXInput.value || '0';
    const boxShadowY = dom.droppedControlBoxShadowYInput.value || '0';
    const boxShadowBlur = dom.droppedControlBoxShadowBlurInput.value || '0';
    const boxShadowColor = dom.droppedControlBoxShadowColorInput.value;
    if (parseFloat(boxShadowX) !== 0 || parseFloat(boxShadowY) !== 0 || parseFloat(boxShadowBlur) !== 0) {
        control.style.boxShadow = `${boxShadowX}px ${boxShadowY}px ${boxShadowBlur}px ${boxShadowColor}`;
    } else {
        control.style.boxShadow = 'none';
    }

    if (['button', 'text-input', 'text-block'].includes(controlType)) {
        control.style.fontFamily = dom.droppedControlFontFamilyInput.value || '';
        control.style.fontSize = dom.droppedControlFontSizeInput.value || '';
        control.style.fontWeight = dom.droppedControlFontWeightSelect.value || 'normal';
        control.style.fontStyle = dom.droppedControlFontStyleSelect.value as FontStyleType || 'normal';
        control.style.lineHeight = dom.droppedControlLineHeightInput.value || '';
        control.style.letterSpacing = dom.droppedControlLetterSpacingInput.value || '';
        control.style.textTransform = dom.droppedControlTextTransformSelect.value as TextTransformType || 'none';
        
        const textDecorationValue = dom.droppedControlTextDecorationSelect.value as TextDecorationType;
        control.style.textDecorationLine = textDecorationValue;
        control.style.textDecoration = textDecorationValue; 

        const tsX = dom.droppedControlTextShadowXInput.value || '0';
        const tsY = dom.droppedControlTextShadowYInput.value || '0';
        const tsBlur = dom.droppedControlTextShadowBlurInput.value || '0';
        const tsColor = dom.droppedControlTextShadowColorInput.value;
        if (parseFloat(tsX) !== 0 || parseFloat(tsY) !== 0 || parseFloat(tsBlur) !== 0) {
            control.style.textShadow = `${tsX}px ${tsY}px ${tsBlur}px ${tsColor}`;
        } else {
            control.style.textShadow = 'none';
        }
    }
}


export function applyStylesToLayer2() {
    if (!dom.layer2Element || !state.layer2Config) return;

    dom.layer2Element.style.display = state.layer2Config.isVisible ? 'flex' : 'none';
    dom.layer2Element.style.width = `${state.layer2Config.widthPercent}%`;
    dom.layer2Element.style.height = `${state.layer2Config.heightPercent}%`;
    dom.layer2Element.style.padding = `${state.layer2Config.paddingPx}px`;
    dom.layer2Element.style.backgroundColor = state.layer2Config.bgColor;
    
    const borderTwClasses = Array.from(dom.layer2Element.classList).filter(c => c.startsWith('border-') || c.startsWith('border['));
    borderTwClasses.forEach(c => dom.layer2Element!.classList.remove(c));
    dom.layer2Element.style.border = `${state.layer2Config.borderWidthPx}px solid ${state.layer2Config.borderColor}`;

    SHADOW_CLASSES.forEach(cls => dom.layer2Element!.classList.remove(cls));
    if (state.layer2Config.shadowClass !== 'shadow-none') {
        dom.layer2Element.classList.add(state.layer2Config.shadowClass);
    }

    BACKDROP_BLUR_CLASSES.forEach(cls => {
        if (cls) dom.layer2Element!.classList.remove(cls); 
    });
    if (state.layer2Config.backdropBlurClass && state.layer2Config.backdropBlurClass !== 'backdrop-blur-none' && state.layer2Config.backdropBlurClass !== '') {
        dom.layer2Element.classList.add(state.layer2Config.backdropBlurClass);
    }

    updatePlaceholderVisibility(dom.layer2Element, '.layer2-empty-placeholder');
    Object.keys(state.elementsConfig).forEach(id => applyStylesToDecorativeElement(id)); // Recalculate decorative element positions
}
