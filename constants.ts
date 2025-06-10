
export const SPACING_SCALES = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12']; // Tailwind-like scale
export const MIN_HEIGHT_OPTIONS = ['20px', '40px', '60px', '80px', '100px', '150px', '200px'];

export const JUSTIFY_CONTENT_OPTIONS = [
  { label: 'Default (Start)', value: 'start' },
  { label: 'Start', value: 'start' },
  { label: 'End', value: 'end' },
  { label: 'Center', value: 'center' },
  { label: 'Between', value: 'between' },
  { label: 'Around', value: 'around' },
  { label: 'Evenly', value: 'evenly' },
];

export const ALIGN_ITEMS_OPTIONS = [
  { label: 'Default (Stretch)', value: 'stretch' },
  { label: 'Stretch', value: 'stretch' },
  { label: 'Start', value: 'start' },
  { label: 'End', value: 'end' },
  { label: 'Center', value: 'center' },
  { label: 'Baseline', value: 'baseline' },
];

export const ALIGN_SELF_OPTIONS = [
  { label: 'Default (Auto)', value: 'auto' },
  { label: 'Auto', value: 'auto' },
  { label: 'Start', value: 'start' },
  { label: 'End', value: 'end' },
  { label: 'Center', value: 'center' },
  { label: 'Baseline', value: 'baseline' },
  { label: 'Stretch', value: 'stretch' },
];

export const COL_SPAN_OPTIONS = ['auto', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())];
export const COL_OFFSET_OPTIONS = ['0', ...Array.from({ length: 11 }, (_, i) => (i + 1).toString())];
export const COL_ORDER_OPTIONS = ['none', 'first', 'last', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())];


export const BACKGROUND_COLORS = [
    { label: 'None', value: '' },
    { label: 'Slate-100', value: 'slate-100' }, { label: 'Slate-200', value: 'slate-200' },
    { label: 'Gray-100', value: 'gray-100' }, { label: 'Gray-200', value: 'gray-200' },
    { label: 'Zinc-100', value: 'zinc-100' }, { label: 'Zinc-200', value: 'zinc-200' },
    { label: 'Neutral-100', value: 'neutral-100' }, { label: 'Neutral-200', value: 'neutral-200' },
    { label: 'Stone-100', value: 'stone-100' }, { label: 'Stone-200', value: 'stone-200' },
    { label: 'Red-100', value: 'red-100' }, { label: 'Red-200', value: 'red-200' },
    { label: 'Orange-100', value: 'orange-100' }, { label: 'Orange-200', value: 'orange-200' },
    { label: 'Amber-100', value: 'amber-100' }, { label: 'Amber-200', value: 'amber-200' },
    { label: 'Yellow-100', value: 'yellow-100' }, { label: 'Yellow-200', value: 'yellow-200' },
    { label: 'Lime-100', value: 'lime-100' }, { label: 'Lime-200', value: 'lime-200' },
    { label: 'Green-100', value: 'green-100' }, { label: 'Green-200', value: 'green-200' },
    { label: 'Emerald-100', value: 'emerald-100' }, { label: 'Emerald-200', value: 'emerald-200' },
    { label: 'Teal-100', value: 'teal-100' }, { label: 'Teal-200', value: 'teal-200' },
    { label: 'Cyan-100', value: 'cyan-100' }, { label: 'Cyan-200', value: 'cyan-200' },
    { label: 'Sky-100', value: 'sky-100' }, { label: 'Sky-200', value: 'sky-200' },
    { label: 'Blue-100', value: 'blue-100' }, { label: 'Blue-200', value: 'blue-200' },
    { label: 'Indigo-100', value: 'indigo-100' }, { label: 'Indigo-200', value: 'indigo-200' },
    { label: 'Violet-100', value: 'violet-100' }, { label: 'Violet-200', value: 'violet-200' },
    { label: 'Purple-100', value: 'purple-100' }, { label: 'Purple-200', value: 'purple-200' },
    { label: 'Fuchsia-100', value: 'fuchsia-100' }, { label: 'Fuchsia-200', value: 'fuchsia-200' },
    { label: 'Pink-100', value: 'pink-100' }, { label: 'Pink-200', value: 'pink-200' },
    { label: 'Rose-100', value: 'rose-100' }, { label: 'Rose-200', value: 'rose-200' },
];

export const GUTTER_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12']; // Corresponds to Tailwind gap scale

export const VIEWPORT_BREAKPOINTS = [
  { label: 'XS', width: '375px', displayText: 'XS' }, // Common small mobile
  { label: 'SM', width: '640px', displayText: 'SM' }, // Tailwind SM, larger mobile / small tablet
  { label: 'MD', width: '768px', displayText: 'MD' }, // Tailwind MD, tablet portrait
  { label: 'LG', width: '1024px', displayText: 'LG' }, // Tailwind LG, tablet landscape / small laptop
  { label: 'XL', width: '1280px', displayText: 'XL' }, // Tailwind XL, standard laptop
  { label: 'XXL', width: '1536px', displayText: 'XXL' }, // Tailwind 2XL, large desktop
  { label: 'Full', width: '100%', displayText: 'Full' }, // Default full width
];
