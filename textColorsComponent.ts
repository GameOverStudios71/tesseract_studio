/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state';
import { DEFAULT_TEXTCOLORS_CONTENT, DEFAULT_TEXTCOLORS_GRADIENT_TYPE, DEFAULT_TEXTCOLORS_BASE_COLOR, DEFAULT_TEXTCOLORS_LIGHTEN_COLOR } from './constants';
import type { TextColorGradientType } from './types';
import { deleteSelectedControl } from './droppedControlController';


function applyDarkLightDarkTS(textUnit: string): string {
    let unitHtml = "";
    const chars = Array.from(textUnit);
    const len = chars.filter(char => char.trim() !== '').length;
    let nonSpaceCharIndex = 0;

    if (len === 0) return textUnit; // Return original if only whitespace

    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (char.trim() === '') {
            unitHtml += char; // Preserve whitespace
            continue;
        }

        const posRatio = (len === 1) ? 0.5 : nonSpaceCharIndex / (len - 1);
        const distanceFromCenter = Math.abs(posRatio - 0.5); // 0 at center, 0.5 at ends

        let stepClass = 'dle-step-3'; // Lightest (center)
        if (distanceFromCenter > 0.35) { // Furthest from center (ends)
            stepClass = 'dle-step-1'; // Darkest
        } else if (distanceFromCenter > 0.15) { // Middle
            stepClass = 'dle-step-2'; // Mid
        }
        unitHtml += `<span class="${stepClass}">${char}</span>`;
        nonSpaceCharIndex++;
    }
    return unitHtml;
}


export function renderTextColorsComponent(element: HTMLElement) {
    const textContent = element.dataset.textContent || DEFAULT_TEXTCOLORS_CONTENT;
    const gradientType = (element.dataset.gradientType || DEFAULT_TEXTCOLORS_GRADIENT_TYPE) as TextColorGradientType;
    const baseColor = element.dataset.baseColor || DEFAULT_TEXTCOLORS_BASE_COLOR;
    const lightenColor = element.dataset.lightenColor || DEFAULT_TEXTCOLORS_LIGHTEN_COLOR;

    // Update CSS custom properties on the element itself for dynamic styling
    element.style.setProperty('--primary-gradient-base-color-light', baseColor);
    element.style.setProperty('--gradient-lighten-color', lightenColor);

    element.innerHTML = ''; // Clear previous content

    // Remove all previous gradient type classes
    ['word-gradient', 'sentence-gradient', 'dark-light-dark-sentence-gradient', 'dark-light-dark-word-gradient'].forEach(cls => {
        element.classList.remove(cls);
    });

    let htmlContent = "";
    const textToDisplay = textContent.trim(); // Trim to avoid leading/trailing whitespace issues in logic

    switch (gradientType) {
        case 'word':
            element.classList.add('word-gradient');
            const words = textToDisplay.split(/\s+/);
            words.forEach(word => {
                if (word.length > 0) {
                    htmlContent += '<span class="word">';
                    for (const char of word) {
                        htmlContent += `<span>${char}</span>`;
                    }
                    htmlContent += '</span> '; // Add space after each word span
                }
            });
            break;
        case 'sentence':
            element.classList.add('sentence-gradient');
            const nonSpaceChars = Array.from(textToDisplay).filter(char => char.trim() !== '');
            const totalNonSpaceChars = nonSpaceChars.length;
            if (totalNonSpaceChars > 0) {
                const segmentLength = Math.max(1, totalNonSpaceChars / 6); // Divide into 6 segments
                let nonSpaceCharCounter = 0;
                for (const char of textToDisplay) {
                    if (char.trim() !== '') {
                        const currentSegment = Math.floor(nonSpaceCharCounter / segmentLength);
                        const step = Math.min(6, currentSegment + 1); // gradient-step-1 to gradient-step-6
                        htmlContent += `<span class="gradient-step-${step}">${char}</span>`;
                        nonSpaceCharCounter++;
                    } else {
                        htmlContent += char; // Preserve whitespace
                    }
                }
            }
            break;
        case 'dark-light-dark-sentence':
            element.classList.add('dark-light-dark-sentence-gradient');
            htmlContent = applyDarkLightDarkTS(textToDisplay);
            break;
        case 'dark-light-dark-word':
            element.classList.add('dark-light-dark-word-gradient');
            const dleWords = textToDisplay.split(/\s+/);
            dleWords.forEach(word => {
                if (word.length > 0) {
                    htmlContent += `<span class="word">${applyDarkLightDarkTS(word)}</span> `;
                }
            });
            break;
    }
    element.innerHTML = htmlContent.trimEnd(); // Trim trailing space if any
}


export function setupTextColorsComponentPanelListeners() {
    if (!dom.textColorsContentInput || !dom.textColorsGradientTypeSelect || !dom.textColorsBaseColorPicker || !dom.textColorsLightenColorPicker || !dom.deleteTextColorsControlBtn) return;

    const updateAndRender = () => {
        if (state.selectedDroppedControl && state.selectedDroppedControl.dataset.controlType === 'text-colors') {
            state.selectedDroppedControl.dataset.textContent = dom.textColorsContentInput?.value || DEFAULT_TEXTCOLORS_CONTENT;
            state.selectedDroppedControl.dataset.gradientType = dom.textColorsGradientTypeSelect?.value || DEFAULT_TEXTCOLORS_GRADIENT_TYPE;
            state.selectedDroppedControl.dataset.baseColor = dom.textColorsBaseColorPicker?.value || DEFAULT_TEXTCOLORS_BASE_COLOR;
            state.selectedDroppedControl.dataset.lightenColor = dom.textColorsLightenColorPicker?.value || DEFAULT_TEXTCOLORS_LIGHTEN_COLOR;
            renderTextColorsComponent(state.selectedDroppedControl);
        }
    };

    dom.textColorsContentInput.addEventListener('input', updateAndRender);
    dom.textColorsGradientTypeSelect.addEventListener('change', updateAndRender);
    dom.textColorsBaseColorPicker.addEventListener('input', updateAndRender);
    dom.textColorsLightenColorPicker.addEventListener('input', updateAndRender);
    dom.deleteTextColorsControlBtn.addEventListener('click', deleteSelectedControl); 
}
