
import React from 'react';
import { LayoutElement, ElementType, ElementProps, Spacing } from '../types';

// Helper to get default props with potential overrides for components
const getComponentElementDefaultProps = (type: ElementType, overrides: Partial<ElementProps> = {}): Partial<ElementProps> => {
  const initialSpacing: Spacing = { top: '0', right: '0', bottom: '0', left: '0' };
  const baseCommonProps = {
    padding: { ...initialSpacing, top: '1', right: '1', bottom: '1', left: '1' },
    margin: { ...initialSpacing },
    customClasses: '',
    minHeight: '40px',
  };

  let specificProps: Partial<ElementProps> = {};
  switch (type) {
    case 'container':
      specificProps = {
        ...baseCommonProps,
        backgroundColor: 'slate-200',
        minHeight: '100px',
        isFluid: false,
        padding: { top: '4', right: '4', bottom: '4', left: '4' }, // Default for component container
        ...overrides,
      };
      break;
    case 'row':
      specificProps = {
        ...baseCommonProps,
        backgroundColor: 'zinc-200',
        gutters: { x: '2', y: '2' },
        minHeight: '80px',
        justifyContent: 'start',
        alignItems: 'stretch',
        padding: { ...initialSpacing }, // Rows often don't have padding
        ...overrides,
      };
      break;
    case 'col':
      specificProps = {
        ...baseCommonProps,
        backgroundColor: 'neutral-200',
        minHeight: '60px',
        span: 'auto',
        offset: '0',
        order: 'none',
        alignSelf: 'auto',
        ...overrides,
      };
      break;
    default:
      specificProps = { ...baseCommonProps, ...overrides };
  }
  return specificProps;
};


export interface PredefinedComponent {
  key: string;
  name: string;
  type: 'generative' | 'template';
  description: string;
  visualPreview?: () => React.JSX.Element;
  generate?: (startIdNum: number, parentIdToAttach: string | null) => {
    elements: Record<string, LayoutElement>;
    rootId: string;
    nextIdNum: number;
  };
}

const getElementNameForComponent = (baseName: string, type: ElementType, instanceNum: number): string => {
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return `${baseName} ${capitalizedType} ${instanceNum}`;
};


export const PREDEFINED_COMPONENTS: PredefinedComponent[] = [
  {
    key: 'ADAPTIVE_GRID_TEMPLATE',
    type: 'template',
    name: 'Adaptive Grid Template',
    description: 'A responsive grid of objects surrounding a central content area.',
    visualPreview: () => (
      <div className="w-full h-20 border border-slate-300 p-1 bg-slate-100 rounded shadow-sm text-[10px] leading-tight relative">
        <div className="absolute top-1 left-1 w-3 h-3 bg-red-300 rounded-sm"></div>
        <div className="absolute top-1 right-1 w-3 h-3 bg-orange-300 rounded-sm"></div>
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-teal-300 rounded-sm"></div>
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-purple-300 rounded-sm"></div>
        <div className="absolute inset-4 border border-dashed border-slate-400 bg-slate-200 flex items-center justify-center text-slate-500">
          Content
        </div>
      </div>
    ),
  },
  {
    key: 'INFO_CARDS_SECTION',
    type: 'generative',
    name: 'Info Cards Section',
    description: 'Container with a header and three content cards.',
    visualPreview: () => (
      <div className="w-full h-20 border border-slate-300 p-1 bg-slate-100 rounded shadow-sm text-[10px] leading-tight">
        <div className="bg-sky-200 h-4 mb-1 rounded-sm flex items-center justify-center text-sky-700">Header</div>
        <div className="flex space-x-1 h-12">
          <div className="flex-1 bg-neutral-200 rounded-sm flex items-center justify-center text-neutral-600">Card</div>
          <div className="flex-1 bg-neutral-200 rounded-sm flex items-center justify-center text-neutral-600">Card</div>
          <div className="flex-1 bg-neutral-200 rounded-sm flex items-center justify-center text-neutral-600">Card</div>
        </div>
      </div>
    ),
    generate: (startIdNum, parentIdToAttach) => {
      let currentIdNum = startIdNum;
      const elements: Record<string, LayoutElement> = {};
      const baseName = "InfoSection";

      const generateId = () => `el-${currentIdNum++}`;

      // 1. Main Container
      const containerId = generateId();
      elements[containerId] = {
        id: containerId,
        type: 'container',
        name: getElementNameForComponent(baseName, 'container', currentIdNum -1),
        parentId: parentIdToAttach,
        children: [],
        props: getComponentElementDefaultProps('container', {
          padding: { top: '6', right: '6', bottom: '6', left: '6' }, // Tailwind p-6
          backgroundColor: 'slate-100', // Lighter background for the section
          minHeight: '200px',
        }),
      };

      // 2. Header Row
      const headerRowId = generateId();
      elements[headerRowId] = {
        id: headerRowId,
        type: 'row',
        name: getElementNameForComponent(baseName, 'row', currentIdNum -1) + " (Header)",
        parentId: containerId,
        children: [],
        props: getComponentElementDefaultProps('row', {
          padding: { top: '0', right: '0', bottom: '4', left: '0' }, // mb-4 essentially
          minHeight: 'auto',
          backgroundColor: 'transparent', // No distinct bg for this row
          justifyContent: 'start', 
          alignItems: 'center',
          gutters: {x: '0', y: '0'},
        }),
      };
      elements[containerId].children.push(headerRowId);

      // 2.1 Header Column (for a title)
      const headerColId = generateId();
      elements[headerColId] = {
        id: headerColId,
        type: 'col',
        name: getElementNameForComponent(baseName, 'col', currentIdNum -1) + " (Title)",
        parentId: headerRowId,
        children: [],
        props: getComponentElementDefaultProps('col', { 
            span: '12', 
            backgroundColor: 'transparent', 
            minHeight: 'auto', 
            padding: {top: '2', bottom:'2', left:'0', right: '0'}, // py-2
            customClasses: 'text-2xl font-semibold text-slate-700' // Placeholder for title
        }),
      };
      elements[headerRowId].children.push(headerColId);
      // You might add a text element inside this column later if text editing is supported.
      // For now, customClasses give a hint. Or set a default 'name' that shows up in the placeholder.

      // 3. Content Row
      const contentRowId = generateId();
      elements[contentRowId] = {
        id: contentRowId,
        type: 'row',
        name: getElementNameForComponent(baseName, 'row', currentIdNum -1) + " (Content)",
        parentId: containerId,
        children: [],
        props: getComponentElementDefaultProps('row', { 
            gutters: { x: '6', y: '6' }, // Tailwind gap-6
            backgroundColor: 'transparent' // No distinct bg for this row
        }),
      };
      elements[containerId].children.push(contentRowId);

      // 4. Three Columns for Cards
      for (let i = 0; i < 3; i++) {
        const cardColId = generateId();
        elements[cardColId] = {
          id: cardColId,
          type: 'col',
          name: getElementNameForComponent(baseName, 'col', currentIdNum -1) + ` (Card ${i+1})`,
          parentId: contentRowId,
          children: [],
          props: getComponentElementDefaultProps('col', { 
            span: '4', // Each col takes 1/3 of 12-col grid
            minHeight: '150px', 
            backgroundColor: 'white', 
            padding: { top: '4', right: '4', bottom: '4', left: '4' }, // p-4
            customClasses: 'shadow-lg rounded-lg border border-slate-200' // Pre-styled card look
          }),
        };
        elements[contentRowId].children.push(cardColId);
      }

      return { elements, rootId: containerId, nextIdNum: currentIdNum };
    },
  },
  // Future components can be added here
];
