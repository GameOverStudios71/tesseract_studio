
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SHADOW_CLASSES = ['shadow-none', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'];
export const REM_TO_PX_RATIO = 16; 
export const BACKDROP_BLUR_CLASSES = ['', 'backdrop-blur-none', 'backdrop-blur-sm', 'backdrop-blur', 'backdrop-blur-md', 'backdrop-blur-lg', 'backdrop-blur-xl', 'backdrop-blur-2xl', 'backdrop-blur-3xl'];


export const ANIMATE_CSS_BASE_CLASS = 'animate__animated';
export const ANIMATE_CSS_ANIMATIONS = [
    { 
        name: "Attention Seekers", 
        animations: [
            { name: 'Bounce', value: 'bounce' }, { name: 'Flash', value: 'flash' }, 
            { name: 'Pulse', value: 'pulse' }, { name: 'Rubber Band', value: 'rubberBand' },
            { name: 'Shake X', value: 'shakeX' }, { name: 'Shake Y', value: 'shakeY' },
            { name: 'Head Shake', value: 'headShake' }, { name: 'Swing', value: 'swing' },
            { name: 'Tada', value: 'tada' }, { name: 'Wobble', value: 'wobble' }, 
            { name: 'Jello', value: 'jello' }, { name: 'Heart Beat', value: 'heartBeat' }
        ]
    },
    {
        name: "Bouncing Entrances",
        animations: [
            { name: 'Bounce In', value: 'bounceIn' }, { name: 'Bounce In Down', value: 'bounceInDown' },
            { name: 'Bounce In Left', value: 'bounceInLeft' }, { name: 'Bounce In Right', value: 'bounceInRight' },
            { name: 'Bounce In Up', value: 'bounceInUp' }
        ]
    },
    {
        name: "Fading Entrances",
        animations: [
            { name: 'Fade In', value: 'fadeIn' }, { name: 'Fade In Down', value: 'fadeInDown' },
            { name: 'Fade In Down Big', value: 'fadeInDownBig' }, { name: 'Fade In Left', value: 'fadeInLeft' },
            { name: 'Fade In Left Big', value: 'fadeInLeftBig' }, { name: 'Fade In Right', value: 'fadeInRight' },
            { name: 'Fade In Right Big', value: 'fadeInRightBig' }, { name: 'Fade In Up', value: 'fadeInUp' },
            { name: 'Fade In Up Big', value: 'fadeInUpBig' }, { name: 'Fade In Top Left', value: 'fadeInTopLeft' },
            { name: 'Fade In Top Right', value: 'fadeInTopRight' }, { name: 'Fade In Bottom Left', value: 'fadeInBottomLeft' },
            { name: 'Fade In Bottom Right', value: 'fadeInBottomRight' }
        ]
    },
    // Add other animation categories if they were truncated in the prompt
];
export const ANIMATE_CSS_ITERATIONS = [
    { name: '1 Time', value: '' }, { name: '2 Times', value: 'animate__repeat-2' },
    { name: '3 Times', value: 'animate__repeat-3' }, { name: 'Infinite', value: 'animate__infinite' }
];
export const ANIMATE_CSS_DELAYS = [
    { name: 'No Delay', value: '' }, { name: '1 Second', value: 'animate__delay-1s' }, 
    { name: '2 Seconds', value: 'animate__delay-2s' }, { name: '3 Seconds', value: 'animate__delay-3s' },
    { name: '4 Seconds', value: 'animate__delay-4s' }, { name: '5 Seconds', value: 'animate__delay-5s' }
];
export const ANIMATE_CSS_SPEEDS = [
    { name: 'Normal', value: '' }, { name: 'Slow', value: 'animate__slow' }, 
    { name: 'Slower', value: 'animate__slower' }, { name: 'Fast', value: 'animate__fast' },
    { name: 'Faster', value: 'animate__faster' }
];

export const DEFAULT_TEXTCOLORS_CONTENT = "Olha eu aqui denovo testando mais uma vez este efeito. Uma frase longa para testar os gradientes e as cores selecionáveis.";
export const DEFAULT_TEXTCOLORS_GRADIENT_TYPE: TextColorGradientType = 'word';
export const DEFAULT_TEXTCOLORS_BASE_COLOR = '#00f000';
export const DEFAULT_TEXTCOLORS_LIGHTEN_COLOR = '#ffffff';

export const TESSERACT_PRESETS_KEY = 'tesseractPresets';

import type { TextColorGradientType } from './types';
