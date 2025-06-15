
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state';
import { applyStylesToLayer2 } from './styleUpdater';
import { REM_TO_PX_RATIO, SHADOW_CLASSES, BACKDROP_BLUR_CLASSES } from './constants';
import type { Layer2Config } from './types';

export function initializeLayer2Config() {
    if (!dom.layer2Element) { 
        console.warn("Layer 2 element not found during initialization, using default config from state.");
        return; 
    }
    const computedStyle = getComputedStyle(dom.layer2Element);

    let widthPercent = state.layer2Config.widthPercent; 
    if (dom.layer2Element.style.width && dom.layer2Element.style.width.endsWith('%')) {
        widthPercent = parseFloat(dom.layer2Element.style.width);
    } else if (dom.layer2Element.classList.contains('w-4/5')) { 
        widthPercent = 80;
    } else if (dom.layer2Element.classList.contains('w-1/2')) { 
        widthPercent = 50;
    }
   
    let heightPercent = state.layer2Config.heightPercent; 
    if (dom.layer2Element.style.height && dom.layer2Element.style.height.endsWith('%')) {
        heightPercent = parseFloat(dom.layer2Element.style.height);
    } else if (dom.layer2Element.classList.contains('h-4/5')) { 
        heightPercent = 80;
    } else if (dom.layer2Element.classList.contains('h-1/2')) { 
        heightPercent = 50;
    }
    
    let paddingPx = state.layer2Config.paddingPx; 
    if (dom.layer2Element.style.padding) { 
        paddingPx = parseFloat(dom.layer2Element.style.padding);
    } else { 
        const paddingClass = Array.from(dom.layer2Element.classList).find(c => c.startsWith('p-'));
        if (paddingClass === 'p-6') paddingPx = 1.5 * REM_TO_PX_RATIO; // Example: p-6 in Tailwind is 1.5rem
    }

    let borderWidthPx = state.layer2Config.borderWidthPx; 
    if (dom.layer2Element.style.borderWidth) {
        borderWidthPx = parseFloat(dom.layer2Element.style.borderWidth);
    } else {
         const borderClass = Array.from(dom.layer2Element.classList).find(c => c.startsWith('border-['));
         if (borderClass) {
            const match = borderClass.match(/border-\[(\d+)px\]/);
            if (match && match[1]) borderWidthPx = parseInt(match[1]);
         }
    }
    
    const newLayer2Config: Layer2Config = {
        isVisible: computedStyle.display !== 'none',
        widthPercent: widthPercent,
        heightPercent: heightPercent,
        paddingPx: paddingPx,
        bgColor: computedStyle.backgroundColor || state.layer2Config.bgColor, 
        borderWidthPx: borderWidthPx,
        borderColor: computedStyle.borderColor || state.layer2Config.borderColor, 
        shadowClass: Array.from(dom.layer2Element.classList).find(cls => SHADOW_CLASSES.includes(cls)) || state.layer2Config.shadowClass,
        backdropBlurClass: Array.from(dom.layer2Element.classList).find(cls => BACKDROP_BLUR_CLASSES.includes(cls) && cls !== '') || 'backdrop-blur-md',
    };
    state.setLayer2Config(newLayer2Config);
}


export function setupLayer2PanelListeners() {
    if (!dom.layer2VisibleInput || !dom.layer2WidthInput || !dom.layer2HeightInput || !dom.layer2PaddingInput || 
        !dom.layer2BgColorInput || !dom.layer2BorderWidthInput || !dom.layer2BorderColorInput || !dom.layer2ShadowSelect || 
        !dom.layer2BackdropBlurSelect) return;

    dom.layer2VisibleInput.addEventListener('change', (e) => {
        state.updateLayer2Config({ isVisible: (e.target as HTMLInputElement).checked });
        applyStylesToLayer2();
    });
    dom.layer2WidthInput.addEventListener('input', (e) => {
        state.updateLayer2Config({ widthPercent: parseFloat((e.target as HTMLInputElement).value) || 80 }); 
        applyStylesToLayer2();
    });
    dom.layer2HeightInput.addEventListener('input', (e) => {
        state.updateLayer2Config({ heightPercent: parseFloat((e.target as HTMLInputElement).value) || 80 });
        applyStylesToLayer2();
    });
    dom.layer2PaddingInput.addEventListener('input', (e) => {
        state.updateLayer2Config({ paddingPx: parseFloat((e.target as HTMLInputElement).value) || 0 });
        applyStylesToLayer2();
    });
    dom.layer2BgColorInput.addEventListener('input', (e) => {
        state.updateLayer2Config({ bgColor: (e.target as HTMLInputElement).value });
        applyStylesToLayer2();
    });
    dom.layer2BorderWidthInput.addEventListener('input', (e) => {
        state.updateLayer2Config({ borderWidthPx: parseFloat((e.target as HTMLInputElement).value) || 0 });
        applyStylesToLayer2();
    });
    dom.layer2BorderColorInput.addEventListener('input', (e) => {
        state.updateLayer2Config({ borderColor: (e.target as HTMLInputElement).value });
        applyStylesToLayer2();
    });
    dom.layer2ShadowSelect.addEventListener('change', (e) => {
        state.updateLayer2Config({ shadowClass: (e.target as HTMLSelectElement).value });
        applyStylesToLayer2();
    });
    dom.layer2BackdropBlurSelect.addEventListener('change', (e) => {
        state.updateLayer2Config({ backdropBlurClass: (e.target as HTMLSelectElement).value });
        applyStylesToLayer2();
    });
}