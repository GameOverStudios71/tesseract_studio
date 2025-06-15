/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state';
import { updatePanelForNoSelection } from './selectionManager';

export function initializeAnsiArtControlListeners() {
    if (!dom.ansiArtPropsSection) return;

    const inputsToUpdate = [
        dom.ansiArtContentInput,
        dom.ansiArtVisibleInput,
        dom.ansiArtWidthInput,
        dom.ansiArtHeightInput,
        dom.ansiArtBgColorInput,
        dom.ansiArtTextColorInput,
        dom.ansiArtOpacityInput,
        dom.ansiArtBorderRadiusInput,
        dom.ansiArtBorderWidthInput,
        dom.ansiArtBorderStyleSelect,
        dom.ansiArtBorderColorInput,
        dom.ansiArtBoxShadowXInput,
        dom.ansiArtBoxShadowYInput,
        dom.ansiArtBoxShadowBlurInput,
        dom.ansiArtBoxShadowColorInput,
        dom.ansiArtPaddingTopInput,
        dom.ansiArtPaddingRightInput,
        dom.ansiArtPaddingBottomInput,
        dom.ansiArtPaddingLeftInput
    ];

    inputsToUpdate.forEach(input => {
        if (input) {
            const eventType = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'input';
            input.addEventListener(eventType, () => {
                if (state.selectedDroppedControl) {
                    applyAnsiArtStyles(state.selectedDroppedControl);
                }
            });
        }
    });

    if (dom.deleteAnsiArtControlBtn) {
        dom.deleteAnsiArtControlBtn.addEventListener('click', () => {
            if (state.selectedDroppedControl) {
                state.selectedDroppedControl.remove();
                state.setSelectedDroppedControl(null);
                updatePanelForNoSelection();
            }
        });
    }
}

function applyAnsiArtStyles(control: HTMLElement) {
    if (!dom.ansiArtContentInput || !dom.ansiArtVisibleInput || !dom.ansiArtWidthInput || !dom.ansiArtHeightInput ||
        !dom.ansiArtBgColorInput || !dom.ansiArtTextColorInput || !dom.ansiArtOpacityInput || !dom.ansiArtOpacityValueDisplay ||
        !dom.ansiArtBorderRadiusInput || !dom.ansiArtBorderWidthInput || !dom.ansiArtBorderStyleSelect || !dom.ansiArtBorderColorInput ||
        !dom.ansiArtBoxShadowXInput || !dom.ansiArtBoxShadowYInput || !dom.ansiArtBoxShadowBlurInput || !dom.ansiArtBoxShadowColorInput ||
        !dom.ansiArtPaddingTopInput || !dom.ansiArtPaddingRightInput || !dom.ansiArtPaddingBottomInput || !dom.ansiArtPaddingLeftInput) return;

    // Visibility
    control.style.display = dom.ansiArtVisibleInput.checked ? 'block' : 'none';

    // Content
    control.textContent = dom.ansiArtContentInput.value;

    // Dimensions
    control.style.width = dom.ansiArtWidthInput.value ? `${dom.ansiArtWidthInput.value}%` : 'auto';
    control.style.height = dom.ansiArtHeightInput.value ? `${dom.ansiArtHeightInput.value}px` : 'auto';

    // Colors
    control.style.backgroundColor = dom.ansiArtBgColorInput.value;
    control.style.color = dom.ansiArtTextColorInput.value;

    // Opacity
    const opacity = dom.ansiArtOpacityInput.value;
    control.style.opacity = opacity;
    if (dom.ansiArtOpacityValueDisplay) dom.ansiArtOpacityValueDisplay.textContent = parseFloat(opacity).toFixed(2);

    // Border
    control.style.borderRadius = `${dom.ansiArtBorderRadiusInput.value}px`;
    control.style.borderWidth = `${dom.ansiArtBorderWidthInput.value}px`;
    control.style.borderStyle = dom.ansiArtBorderStyleSelect.value;
    control.style.borderColor = dom.ansiArtBorderColorInput.value;

    // Box Shadow
    const boxShadow = `${dom.ansiArtBoxShadowXInput.value}px ${dom.ansiArtBoxShadowYInput.value}px ${dom.ansiArtBoxShadowBlurInput.value}px ${dom.ansiArtBoxShadowColorInput.value}`;
    control.style.boxShadow = (dom.ansiArtBoxShadowXInput.value === '0' && dom.ansiArtBoxShadowYInput.value === '0' && dom.ansiArtBoxShadowBlurInput.value === '0') ? 'none' : boxShadow;

    // Padding
    control.style.paddingTop = `${dom.ansiArtPaddingTopInput.value}px`;
    control.style.paddingRight = `${dom.ansiArtPaddingRightInput.value}px`;
    control.style.paddingBottom = `${dom.ansiArtPaddingBottomInput.value}px`;
    control.style.paddingLeft = `${dom.ansiArtPaddingLeftInput.value}px`;
}
