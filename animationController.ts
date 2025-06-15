/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state';
import { ANIMATE_CSS_ANIMATIONS, ANIMATE_CSS_ITERATIONS, ANIMATE_CSS_DELAYS, ANIMATE_CSS_SPEEDS, ANIMATE_CSS_BASE_CLASS } from './constants';

export function populateAnimationControls() {
    if (!dom.animationNameSelect || !dom.animationIterationSelect || !dom.animationDelaySelect || !dom.animationSpeedSelect) return;

    // Clear existing options first to prevent duplicates if called multiple times
    dom.animationNameSelect.innerHTML = '<option value="">None</option>';
    dom.animationIterationSelect.innerHTML = '';
    dom.animationDelaySelect.innerHTML = '';
    dom.animationSpeedSelect.innerHTML = '';


    ANIMATE_CSS_ANIMATIONS.forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category.name;
        category.animations.forEach(anim => {
            const option = document.createElement('option');
            option.value = `animate__${anim.value}`; 
            option.textContent = anim.name;
            optgroup.appendChild(option);
        });
        dom.animationNameSelect.appendChild(optgroup);
    });

    ANIMATE_CSS_ITERATIONS.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.name;
        dom.animationIterationSelect.appendChild(option);
    });

    ANIMATE_CSS_DELAYS.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.name;
        dom.animationDelaySelect.appendChild(option);
    });

    ANIMATE_CSS_SPEEDS.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.name;
        dom.animationSpeedSelect.appendChild(option);
    });
}

export function playConfiguredAnimation(elementId: string, isHoverEvent: boolean = false) {
    if (!state.elementsConfig[elementId]) return;
    const config = state.elementsConfig[elementId];
    const el = config.element;

    // Remove any existing animation classes
    const classesToRemove = Array.from(el.classList).filter(cls => cls.startsWith('animate__'));
    el.classList.remove(...classesToRemove);

    if (!config.animationName) return; // No animation selected

    // Force reflow to restart animation if the same animation is triggered again
    void el.offsetWidth;


    el.classList.add(ANIMATE_CSS_BASE_CLASS);
    el.classList.add(config.animationName);

    if (config.animationIterationClass) el.classList.add(config.animationIterationClass);
    if (config.animationDelayClass) el.classList.add(config.animationDelayClass);
    if (config.animationSpeedClass) el.classList.add(config.animationSpeedClass);

    const handleAnimationEnd = () => {
        // Only remove classes if not infinite, or if it's a hover event (which should play once on each hover)
        if (config.animationIterationClass !== 'animate__infinite' || isHoverEvent) {
            el.classList.remove(ANIMATE_CSS_BASE_CLASS, config.animationName);
            // Optionally remove other utility classes if they are only for the animation duration
            // if (config.animationDelayClass) el.classList.remove(config.animationDelayClass);
            // if (config.animationSpeedClass) el.classList.remove(config.animationSpeedClass);
        }
        // Iteration class should persist if infinite
        // el.removeEventListener('animationend', handleAnimationEnd); // Already {once: true}
    };
    el.addEventListener('animationend', handleAnimationEnd, { once: true });
}

export function updateElementHoverAnimationListeners(elementId: string, forceRemove: boolean = false) {
    if (!state.elementsConfig[elementId]) return;
    const config = state.elementsConfig[elementId];
    const el = config.element;

    // Remove existing listener if present
    if (state.elementMouseOverListeners[elementId]) {
        el.removeEventListener('mouseover', state.elementMouseOverListeners[elementId]);
        delete state.elementMouseOverListeners[elementId];
    }

    if (forceRemove) return; // Exit if we only wanted to remove the listener

    if (config.animationOnHover) {
        const newListener = () => playConfiguredAnimation(elementId, true); // Pass true for isHoverEvent
        el.addEventListener('mouseover', newListener);
        state.elementMouseOverListeners[elementId] = newListener; 
    }
}


export function setupAnimationPanelListeners() {
    if (!dom.animationNameSelect || !dom.animationIterationSelect || !dom.animationDelaySelect || !dom.animationSpeedSelect || !dom.playAnimationButton || !dom.animationOnHoverCheckbox) return;

    const animationConfigChanged = () => {
        if (state.selectedElementId) { 
            // Optionally play animation immediately on change, or rely on Play button / hover
            // playConfiguredAnimation(state.selectedElementId);
        }
    };

    dom.animationNameSelect.addEventListener('change', (e) => {
        if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) {
            state.elementsConfig[state.selectedElementId].animationName = (e.target as HTMLSelectElement).value;
            animationConfigChanged();
        }
    });
    dom.animationIterationSelect.addEventListener('change', (e) => {
        if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) {
            state.elementsConfig[state.selectedElementId].animationIterationClass = (e.target as HTMLSelectElement).value;
            animationConfigChanged();
        }
    });
    dom.animationDelaySelect.addEventListener('change', (e) => {
        if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) {
            state.elementsConfig[state.selectedElementId].animationDelayClass = (e.target as HTMLSelectElement).value;
            animationConfigChanged();
        }
    });
    dom.animationSpeedSelect.addEventListener('change', (e) => {
        if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) {
            state.elementsConfig[state.selectedElementId].animationSpeedClass = (e.target as HTMLSelectElement).value;
            animationConfigChanged();
        }
    });

    dom.playAnimationButton.addEventListener('click', () => {
        if (state.selectedElementId) {
            playConfiguredAnimation(state.selectedElementId);
        }
    });

    dom.animationOnHoverCheckbox.addEventListener('change', (e) => {
        if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) {
            state.elementsConfig[state.selectedElementId].animationOnHover = (e.target as HTMLInputElement).checked;
            updateElementHoverAnimationListeners(state.selectedElementId); // Update or remove listener based on new state
        }
    });
}
