
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state';
import { TESSERACT_PRESETS_KEY } from './constants';
import { generateUniqueId, getSafeFilename, updatePlaceholderVisibility } from './utils';
import { selectElement, updatePanelForNoSelection, updateLayer2PanelInputs } from './selectionManager';
import { applyStylesToLayer2, applyStylesToDecorativeElement } from './styleUpdater';
import { setupDroppable, handleControlSelection, handleDroppedControlDragStart, handleDroppedControlDragEnd } from './droppedControlController';
import { renderTextColorsComponent } from './textColorsComponent';
import { ANIMATE_CSS_ANIMATIONS, ANIMATE_CSS_ITERATIONS, ANIMATE_CSS_DELAYS, ANIMATE_CSS_SPEEDS } from './constants';

import type { Preset, ElementConfig } from './types';


export function loadPresetsFromLocalStorage() {
    const storedPresets = localStorage.getItem(TESSERACT_PRESETS_KEY);
    if (storedPresets) {
        try {
            state.setPresets(JSON.parse(storedPresets));
        } catch (e) {
            console.error("Failed to parse presets from localStorage:", e);
            state.setPresets([]);
        }
    } else {
        state.setPresets([]);
    }
    renderPresetsList();
}

export function savePresetsToLocalStorage() {
    localStorage.setItem(TESSERACT_PRESETS_KEY, JSON.stringify(state.presets));
}

export function renderPresetsList() {
    if (!dom.presetsListContainer || !dom.noPresetsMessage) return;
    dom.presetsListContainer.innerHTML = ''; 

    if (state.presets.length === 0) {
        dom.noPresetsMessage.classList.remove('hidden');
        return;
    }
    dom.noPresetsMessage.classList.add('hidden');

    state.presets.forEach(preset => {
        const item = document.createElement('div');
        item.className = 'preset-item'; // Ensure this class provides appropriate styling
        item.innerHTML = `
            <div class="preset-item-info">
                <span class="preset-item-name truncate" title="${preset.name}">${preset.name}</span>
                <div class="preset-thumbnail" style="background-color: ${preset.layer2BgColorForThumbnail || 'transparent'};"></div>
            </div>
            <div class="preset-item-actions">
                <button class="preset-load-btn" data-preset-id="${preset.id}" title="Load Preset">Load</button>
                <button class="preset-export-btn" data-preset-id="${preset.id}" title="Export HTML">Export</button>
                <button class="preset-delete-btn" data-preset-id="${preset.id}" title="Delete Preset">Del</button>
            </div>
        `;
        dom.presetsListContainer.appendChild(item);

        item.querySelector('.preset-load-btn')?.addEventListener('click', () => handleLoadPreset(preset.id));
        item.querySelector('.preset-export-btn')?.addEventListener('click', () => handleExportPresetHTML(preset.id));
        item.querySelector('.preset-delete-btn')?.addEventListener('click', () => handleDeletePreset(preset.id));
    });
}

export function handleSavePreset() {
    if (!dom.layer2Element) return;

    const elementsConfigCopy: Record<string, Omit<ElementConfig, 'element'>> = {};
    Object.keys(state.elementsConfig).forEach(id => {
        const { element, ...rest } = state.elementsConfig[id]; // Destructure to exclude 'element'
        elementsConfigCopy[id] = JSON.parse(JSON.stringify(rest)); // Deep copy the rest
    });

    const newPreset: Preset = {
        id: generateUniqueId('preset'),
        name: `Preset - ${new Date().toLocaleString()}`,
        timestamp: Date.now(),
        layer2Config: JSON.parse(JSON.stringify(state.layer2Config)), 
        elementsConfig: elementsConfigCopy, 
        layer2HTML: dom.layer2Element.innerHTML,
        decorativeElementsHTML: {},
        layer2BgColorForThumbnail: state.layer2Config.bgColor, // For a visual cue in the preset list
    };

    // Store HTML content of each decorative element
    Object.keys(state.elementsConfig).forEach(id => {
        newPreset.decorativeElementsHTML[id] = state.elementsConfig[id].element.innerHTML;
    });

    state.addPreset(newPreset);
    savePresetsToLocalStorage();
    renderPresetsList();
    alert('Preset saved!');
}

function reinitializeLoadedContent() {
    // Re-setup droppable and event listeners for Layer 2 and its children
    if (dom.layer2Element) {
        setupDroppable(dom.layer2Element);
        dom.layer2Element.querySelectorAll<HTMLElement>('.dropped-control, .dropped-text-colors-component').forEach(control => {
            control.addEventListener('click', (e) => handleControlSelection(control, e));
            control.draggable = true;
            control.addEventListener('dragstart', handleDroppedControlDragStart);
            control.addEventListener('dragend', handleDroppedControlDragEnd);
            if (control.dataset.controlType === 'text-colors') {
                renderTextColorsComponent(control);
            }
            // If it's a container, it also needs to be droppable
            if (control.classList.contains('dropped-row-container') || control.classList.contains('dropped-column-container')) {
                setupDroppable(control);
            }
        });
        // Update placeholder visibility for layer 2
        updatePlaceholderVisibility(dom.layer2Element, '.layer2-empty-placeholder');
    }

    // Re-setup droppable and event listeners for Decorative Elements and their children
    document.querySelectorAll<HTMLElement>('.decorative-element').forEach(el => {
        setupDroppable(el);
        el.querySelectorAll<HTMLElement>('.dropped-control, .dropped-text-colors-component').forEach(control => {
            control.addEventListener('click', (e) => handleControlSelection(control, e));
            control.draggable = true;
            control.addEventListener('dragstart', handleDroppedControlDragStart);
            control.addEventListener('dragend', handleDroppedControlDragEnd);
             if (control.dataset.controlType === 'text-colors') {
                renderTextColorsComponent(control);
            }
            if (control.classList.contains('dropped-row-container') || control.classList.contains('dropped-column-container')) {
                setupDroppable(control);
            }
        });
        // Update placeholder visibility for decorative elements
        updatePlaceholderVisibility(el, '.decorative-element-empty-placeholder');
    });
}


export function handleLoadPreset(presetId: string) {
    const preset = state.presets.find(p => p.id === presetId);
    if (!preset || !dom.layer2Element) return;

    // Deselect any currently selected element or control
    selectElement(null); 
    // Clear current content
    dom.layer2Element.innerHTML = ''; // Clear layer 2 content
    document.querySelectorAll<HTMLElement>('.decorative-element').forEach(el => {
        el.innerHTML = ''; // Clear all decorative elements
    });
    
    // Load Layer 2 config and apply styles
    state.setLayer2Config(JSON.parse(JSON.stringify(preset.layer2Config))); // Deep copy
    
    // Load Decorative Elements config
    state.setElementsConfig({}); // Clear current elementsConfig
    const tempElementsConfig = JSON.parse(JSON.stringify(preset.elementsConfig));
    Object.keys(tempElementsConfig).forEach(id => {
        const el = document.getElementById(id); // Find the element in the DOM
        if (el) {
            state.updateElementConfig(id, {
                ...tempElementsConfig[id],
                element: el // Re-link the live HTMLElement
            });
        }
    });

    applyStylesToLayer2(); // This will also re-apply styles to decorative elements due to positioning logic
    Object.keys(state.elementsConfig).forEach(id => applyStylesToDecorativeElement(id)); // Ensure all decorative elements are styled

    // Restore HTML content
    dom.layer2Element.innerHTML = preset.layer2HTML;
    Object.keys(preset.decorativeElementsHTML).forEach(id => {
        if (state.elementsConfig[id] && state.elementsConfig[id].element) {
            state.elementsConfig[id].element.innerHTML = preset.decorativeElementsHTML[id];
        }
    });

    // Reinitialize event listeners, droppables, etc. for the loaded content
    reinitializeLoadedContent();

    // Update UI panels
    updateLayer2PanelInputs(); 
    updatePanelForNoSelection(); // Or select a default if appropriate
    alert('Preset loaded!');
}


export function handleDeletePreset(presetId: string) {
    if (window.confirm('Are you sure you want to delete this preset?')) {
        state.updatePresets(state.presets.filter(p => p.id !== presetId));
        savePresetsToLocalStorage();
        renderPresetsList();
    }
}


function generateCSSTextForElement(elConfig: Omit<ElementConfig, 'element'>, layer2Conf: typeof state.layer2Config): string {
    let styles = `
        display: ${elConfig.isVisible ? elConfig.display : 'none'};
        z-index: ${elConfig.zIndex};
        overflow-x: ${elConfig.overflowX};
        overflow-y: ${elConfig.overflowY};
        width: ${elConfig.widthVmin}vmin;
        height: ${elConfig.heightVmin}vmin;
        margin-top: ${elConfig.marginTopVmin}vmin;
        margin-right: ${elConfig.marginRightVmin}vmin;
        margin-bottom: ${elConfig.marginBottomVmin}vmin;
        margin-left: ${elConfig.marginLeftVmin}vmin;
        opacity: ${elConfig.opacity};
        border-radius: ${elConfig.borderRadiusVmin}vmin;
        position: absolute;
        box-sizing: border-box;
    `;

    const transforms = [
      `translateX(${elConfig.transformTranslateX || 0}vmin)`,
      `translateY(${elConfig.transformTranslateY || 0}vmin)`,
      `rotate(${elConfig.rotationDeg || 0}deg)`,
      `scale(${elConfig.transformScale || 1})`,
      `skewX(${elConfig.transformSkewX || 0}deg)`,
      `skewY(${elConfig.transformSkewY || 0}deg)`,
    ].join(' ');
    if (transforms.trim() !== 'translateX(0vmin) translateY(0vmin) rotate(0deg) scale(1) skewX(0deg) skewY(0deg)') {
        styles += `transform: ${transforms};\n`;
    }

    const filters = [
      `blur(${elConfig.filterBlur || 0}px)`,
      `brightness(${elConfig.filterBrightness || 1})`,
      `contrast(${elConfig.filterContrast || 1})`,
      `grayscale(${elConfig.filterGrayscale || 0})`,
      `saturate(${elConfig.filterSaturate || 1})`,
      `sepia(${elConfig.filterSepia || 0})`,
      `hue-rotate(${elConfig.filterHueRotate || 0}deg)`,
      `invert(${elConfig.filterInvert || 0})`
    ];
    const activeFilters = filters.filter(f => 
        !(f.includes("blur(0px)") || f.includes("brightness(1)") || f.includes("contrast(1)") || 
        f.includes("grayscale(0)") || f.includes("saturate(1)") || f.includes("sepia(0)") ||
        f.includes("hue-rotate(0deg)") || f.includes("invert(0)")) 
    );
    if (activeFilters.length > 0) {
        styles += `filter: ${activeFilters.join(' ')};\n`;
    }


    if (elConfig.borderStyle !== 'none' && elConfig.borderWidthVmin > 0) {
        styles += `border: ${elConfig.borderWidthVmin}vmin ${elConfig.borderStyle} ${elConfig.borderColor};\n`;
    } else {
        styles += `border: none;\n`;
    }

    if (elConfig.imageUrl) {
        styles += `
            background-image: url('${elConfig.imageUrl}');
            background-size: ${elConfig.backgroundSize};
            background-position: ${elConfig.bgPosition};
            background-repeat: ${elConfig.bgRepeat};
            background-color: transparent;
        `;
    } else {
        styles += `
            background-image: none;
            background-color: ${elConfig.bgColor};
        `;
    }
    
      const hasElementBorder = elConfig.borderStyle !== 'none' && elConfig.borderWidthVmin > 0;
      const totalElementVisualWidthVmin = elConfig.widthVmin + (hasElementBorder ? 2 * elConfig.borderWidthVmin : 0);
      const totalElementVisualHeightVmin = elConfig.heightVmin + (hasElementBorder ? 2 * elConfig.borderWidthVmin : 0);
      const centeringOffsetX = totalElementVisualWidthVmin / 2;
      const centeringOffsetY = totalElementVisualHeightVmin / 2;
      const layer2ActualWidthPercent = layer2Conf.widthPercent;
      const layer2ActualHeightPercent = layer2Conf.heightPercent;
      let targetXPercent = 50; 
      let targetYPercent = 50; 
      if (elConfig.anchorX === 'left') targetXPercent = (50 - layer2ActualWidthPercent / 2);
      else if (elConfig.anchorX === 'right') targetXPercent = (50 + layer2ActualWidthPercent / 2);
      if (elConfig.anchorY === 'top') targetYPercent = (50 - layer2ActualHeightPercent / 2);
      else if (elConfig.anchorY === 'bottom') targetYPercent = (50 + layer2ActualHeightPercent / 2);
      const halfLayer2Border = layer2Conf.borderWidthPx / 2;
      let currentBorderOffsetX = 0;
      let currentBorderOffsetY = 0;
      if (elConfig.anchorX === 'left') currentBorderOffsetX = halfLayer2Border;
      else if (elConfig.anchorX === 'right') currentBorderOffsetX = -halfLayer2Border;
      if (elConfig.anchorY === 'top') currentBorderOffsetY = halfLayer2Border;
      else if (elConfig.anchorY === 'bottom') currentBorderOffsetY = -halfLayer2Border;

    styles += `
        top: calc(${targetYPercent}% + ${currentBorderOffsetY}px - ${centeringOffsetY}vmin);
        left: calc(${targetXPercent}% + ${currentBorderOffsetX}px - ${centeringOffsetX}vmin);
    `;
    return styles;
}

function getTextColorsComponentCSS(): string {
    // This CSS is fairly static, could be moved to a CSS file if preferred
    return `
        .dropped-text-colors-component {
            /* Base styles for the component */
            --primary-gradient-base-color-light: #00f000; /* Default base color */
            --gradient-lighten-color: #FFFFFF; /* Default lighten color */
            --gradient-color-1: color-mix(in srgb, var(--primary-gradient-base-color-light, #00f000) 55%, black 45%);
            --gradient-color-2: color-mix(in srgb, var(--primary-gradient-base-color-light, #00f000) 75%, black 25%);
            --gradient-color-3: var(--primary-gradient-base-color-light, #00f000);
            --gradient-color-4: color-mix(in srgb, var(--primary-gradient-base-color-light, #00f000) 75%, var(--gradient-lighten-color, #FFFFFF) 25%);
            --gradient-color-5: color-mix(in srgb, var(--primary-gradient-base-color-light, #00f000) 55%, var(--gradient-lighten-color, #FFFFFF) 45%);
            --gradient-color-6: color-mix(in srgb, var(--primary-gradient-base-color-light, #00f000) 40%, var(--gradient-lighten-color, #FFFFFF) 60%);
            font-size: 1rem; line-height: 1.6; padding: 10px; background-color: rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; word-break: break-word; width: 100%; color: #e0e0e0;
        }
        /* Word Gradient */
        .dropped-text-colors-component.word-gradient .word { display: inline-block; margin-right: 0.25em; }
        .dropped-text-colors-component.word-gradient .word span { display: inline-block; }
        .dropped-text-colors-component.word-gradient .word span:nth-child(1) { color: var(--gradient-color-1); }
        .dropped-text-colors-component.word-gradient .word span:nth-child(2) { color: var(--gradient-color-2); }
        .dropped-text-colors-component.word-gradient .word span:nth-child(3) { color: var(--gradient-color-3); }
        .dropped-text-colors-component.word-gradient .word span:nth-child(4) { color: var(--gradient-color-4); }
        .dropped-text-colors-component.word-gradient .word span:nth-child(5) { color: var(--gradient-color-5); }
        .dropped-text-colors-component.word-gradient .word span:nth-child(n+6) { color: var(--gradient-color-6); }
        /* Sentence Gradient */
        .dropped-text-colors-component.sentence-gradient span { display: inline-block; }
        .dropped-text-colors-component.sentence-gradient .gradient-step-1 { color: var(--gradient-color-1); }
        .dropped-text-colors-component.sentence-gradient .gradient-step-2 { color: var(--gradient-color-2); }
        .dropped-text-colors-component.sentence-gradient .gradient-step-3 { color: var(--gradient-color-3); }
        .dropped-text-colors-component.sentence-gradient .gradient-step-4 { color: var(--gradient-color-4); }
        .dropped-text-colors-component.sentence-gradient .gradient-step-5 { color: var(--gradient-color-5); }
        .dropped-text-colors-component.sentence-gradient .gradient-step-6 { color: var(--gradient-color-6); }
        /* Dark-Light-Dark Sentence Gradient */
        .dropped-text-colors-component.dark-light-dark-sentence-gradient > span { display: inline-block; } /* Direct children spans */
        .dropped-text-colors-component.dark-light-dark-sentence-gradient .dle-step-1 { color: var(--gradient-color-1); }
        .dropped-text-colors-component.dark-light-dark-sentence-gradient .dle-step-2 { color: var(--gradient-color-3); }
        .dropped-text-colors-component.dark-light-dark-sentence-gradient .dle-step-3 { color: var(--gradient-color-6); }
        /* Dark-Light-Dark Word Gradient */
        .dropped-text-colors-component.dark-light-dark-word-gradient .word { display: inline-block; margin-right: 0.25em; }
        .dropped-text-colors-component.dark-light-dark-word-gradient .word span { display: inline-block; } /* Spans within .word */
        .dropped-text-colors-component.dark-light-dark-word-gradient .word .dle-step-1 { color: var(--gradient-color-1); }
        .dropped-text-colors-component.dark-light-dark-word-gradient .word .dle-step-2 { color: var(--gradient-color-3); }
        .dropped-text-colors-component.dark-light-dark-word-gradient .word .dle-step-3 { color: var(--gradient-color-6); }
    `;
}


export function handleExportPresetHTML(presetId: string) {
    const preset = state.presets.find(p => p.id === presetId);
    if (!preset) return;

    let decorativeElementsHTMLStrings = '';
    let decorativeElementsCSSStrings = '';

    Object.keys(preset.elementsConfig).forEach(id => {
        const elConf = preset.elementsConfig[id]; 
        const liveElement = state.elementsConfig[id]?.element;
        const animationClassesFromLive = liveElement ? Array.from(liveElement.classList).filter(c => c.startsWith('animate__')).join(' ') : '';
        const shadowClassFromLive = liveElement ? Array.from(liveElement.classList).find(c => c.startsWith('shadow-')) || elConf.shadowClass : elConf.shadowClass;


        decorativeElementsCSSStrings += `
            #${id} {
                ${generateCSSTextForElement(elConf, preset.layer2Config)}
                ${shadowClassFromLive} /* Add shadow class directly */
            }
        `;
        decorativeElementsHTMLStrings += `<div id="${id}" class="decorative-element ${animationClassesFromLive} ${shadowClassFromLive}">${preset.decorativeElementsHTML[id]}</div>`;
    });
    
    const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Tesseract Design: ${preset.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <style>
        body { margin: 0; background-color: #111827; overflow: hidden; height: 100vh; width: 100vw; font-family: 'Exo 2', sans-serif;}
        .fluid-layer-container-export { 
            position: relative; 
            width: 100%; 
            height: 100%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
        }
        #layer-2-export {
            position: relative; 
            width: ${preset.layer2Config.widthPercent}%;
            height: ${preset.layer2Config.heightPercent}%;
            padding: ${preset.layer2Config.paddingPx}px;
            background-color: ${preset.layer2Config.bgColor};
            border: ${preset.layer2Config.borderWidthPx}px solid ${preset.layer2Config.borderColor};
            display: ${preset.layer2Config.isVisible ? 'flex' : 'none'}; 
            flex-direction: column; 
            align-items: flex-start; 
            justify-content: flex-start; 
            overflow: auto; 
            box-sizing: border-box;
        }
        .decorative-element { 
            box-sizing: border-box; 
            display: flex; /* Default, individual config might override with #id styles */
            flex-direction: column; 
            align-items: flex-start; 
            justify-content: flex-start; 
            position: absolute; 
            /* overflow and padding are best handled by individual element styles based on config */
        }
        ${decorativeElementsCSSStrings}
        ${getTextColorsComponentCSS()}
        .layer2-empty-placeholder, .decorative-element-empty-placeholder, .container-empty-placeholder {
            color: #6b7280; 
            font-style: italic;
            text-align: center;
            pointer-events: none; 
        }
    </style>
</head>
<body class="bg-gray-900">
    <div id="fluid-layer-container-export">
        ${decorativeElementsHTMLStrings}
        <div id="layer-2-export" class="${preset.layer2Config.shadowClass} ${preset.layer2Config.backdropBlurClass}">
            ${preset.layer2HTML}
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlString], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${getSafeFilename(preset.name)}.html`;
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); 
}