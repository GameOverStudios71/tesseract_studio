/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';

const APP_VERSION = '1.0 (Cold Mind)';
const COOKIE_NAME = `tesseract_splash_seen_v${APP_VERSION.replace(/[\s().]/g, '_')}`;

function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function showSplashScreen() {
    if (dom.splashScreen) {
        dom.splashScreen.classList.remove('hidden');
    }
}

function hideSplashScreen() {
    if (dom.splashScreen) {
        dom.splashScreen.classList.add('hidden');
    }
}

function setupSplashScreenListeners() {
    if (dom.splashCloseButton) {
        dom.splashCloseButton.addEventListener('click', () => {
            hideSplashScreen();
            setCookie(COOKIE_NAME, 'true', 365); // Define o cookie por 1 ano
        });
    }
}

export function initializeSplashScreen() {
    const cookie = getCookie(COOKIE_NAME);
    if (!cookie) {
        showSplashScreen();
        setupSplashScreenListeners();
    }
}
