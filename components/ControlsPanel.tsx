import React from 'react';

interface Control {
  id: string;
  name: string;
  description: string;
  category: string;
  element: string; // HTML element type
  preview: () => React.ReactElement;
  defaultProps?: Record<string, any>;
}

const CONTROLS: Control[] = [
  // Text Elements
  {
    id: 'heading',
    name: 'Heading',
    description: 'Main title or section header',
    category: 'Text',
    element: 'h1',
    preview: () => <div className="text-lg font-bold text-slate-800 dark:text-slate-200">Heading</div>,
    defaultProps: { level: 'h1', text: 'Heading Text' }
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    description: 'Body text content',
    category: 'Text',
    element: 'p',
    preview: () => <div className="text-sm text-slate-600 dark:text-slate-400">Lorem ipsum dolor sit amet...</div>,
    defaultProps: { text: 'Your paragraph text here' }
  },
  {
    id: 'label',
    name: 'Label',
    description: 'Form label or caption',
    category: 'Text',
    element: 'label',
    preview: () => <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Label</div>,
    defaultProps: { text: 'Label Text', htmlFor: '' }
  },

  // Form Elements
  {
    id: 'button',
    name: 'Button',
    description: 'Clickable button element',
    category: 'Form',
    element: 'button',
    preview: () => <div className="bg-blue-500 text-white px-3 py-1 rounded text-xs">Button</div>,
    defaultProps: { text: 'Click me', variant: 'primary', type: 'button' }
  },
  {
    id: 'input',
    name: 'Input',
    description: 'Text input field',
    category: 'Form',
    element: 'input',
    preview: () => <div className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs bg-white dark:bg-slate-700">Input</div>,
    defaultProps: { type: 'text', placeholder: 'Enter text...' }
  },
  {
    id: 'textarea',
    name: 'Textarea',
    description: 'Multi-line text input',
    category: 'Form',
    element: 'textarea',
    preview: () => <div className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs bg-white dark:bg-slate-700 h-8">Textarea</div>,
    defaultProps: { placeholder: 'Enter text...', rows: 3 }
  },
  {
    id: 'select',
    name: 'Select',
    description: 'Dropdown selection',
    category: 'Form',
    element: 'select',
    preview: () => <div className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs bg-white dark:bg-slate-700">Select ▼</div>,
    defaultProps: { options: ['Option 1', 'Option 2', 'Option 3'] }
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    description: 'Checkbox input',
    category: 'Form',
    element: 'input',
    preview: () => <div className="flex items-center space-x-1"><div className="w-3 h-3 border border-slate-400 rounded bg-blue-500"></div><span className="text-xs">Checkbox</span></div>,
    defaultProps: { type: 'checkbox', label: 'Checkbox label' }
  },
  {
    id: 'radio',
    name: 'Radio',
    description: 'Radio button input',
    category: 'Form',
    element: 'input',
    preview: () => <div className="flex items-center space-x-1"><div className="w-3 h-3 border border-slate-400 rounded-full bg-blue-500"></div><span className="text-xs">Radio</span></div>,
    defaultProps: { type: 'radio', label: 'Radio label', name: 'radio-group' }
  },

  // Media Elements
  {
    id: 'image',
    name: 'Image',
    description: 'Image element',
    category: 'Media',
    element: 'img',
    preview: () => <div className="w-full h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center text-xs text-slate-500">🖼️ Image</div>,
    defaultProps: { src: 'https://via.placeholder.com/300x200', alt: 'Image description' }
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Video player element',
    category: 'Media',
    element: 'video',
    preview: () => <div className="w-full h-8 bg-slate-800 rounded flex items-center justify-center text-xs text-white">▶️ Video</div>,
    defaultProps: { controls: true, width: '100%' }
  },

  // Layout Elements
  {
    id: 'divider',
    name: 'Divider',
    description: 'Horizontal line separator',
    category: 'Layout',
    element: 'hr',
    preview: () => <div className="w-full h-px bg-slate-300 dark:bg-slate-600"></div>,
    defaultProps: { style: 'solid' }
  },
  {
    id: 'spacer',
    name: 'Spacer',
    description: 'Empty space element',
    category: 'Layout',
    element: 'div',
    preview: () => <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded border-2 border-dashed border-slate-300 dark:border-slate-600"></div>,
    defaultProps: { height: '20px' }
  },

  // Interactive Elements
  {
    id: 'link',
    name: 'Link',
    description: 'Hyperlink element',
    category: 'Interactive',
    element: 'a',
    preview: () => <div className="text-blue-500 underline text-xs">Link text</div>,
    defaultProps: { href: '#', text: 'Link text', target: '_self' }
  },
  {
    id: 'badge',
    name: 'Badge',
    description: 'Small status indicator',
    category: 'Interactive',
    element: 'span',
    preview: () => <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">Badge</div>,
    defaultProps: { text: 'Badge', variant: 'success' }
  }
];

const ControlsPanel: React.FC = () => {
  const categories = [...new Set(CONTROLS.map(control => control.category))];

  const handleDragStart = (e: React.DragEvent, control: Control) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'control',
      controlId: control.id,
      control: control
    }));
  };

  return (
    <div className="w-full p-4 overflow-y-auto h-full">
      <h3 className="text-base font-semibold mb-3 text-slate-800 dark:text-slate-200 sticky top-0 bg-slate-50 dark:bg-slate-800 py-2 z-10">
        Controls
      </h3>

      {categories.map(category => (
        <div key={category} className="mb-4">
          <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
            {category}
          </h4>
          <div className="space-y-2">
            {CONTROLS.filter(control => control.category === category).map(control => (
              <div
                key={control.id}
                draggable
                onDragStart={(e) => handleDragStart(e, control)}
                className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 hover:shadow-md hover:border-sky-500 dark:hover:border-sky-400 cursor-grab transition-all"
                title={control.description}
              >
                <h5 className="font-medium text-xs text-slate-700 dark:text-slate-300 mb-1">
                  {control.name}
                </h5>
                <div className="mb-1 pointer-events-none">
                  {control.preview()}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                  {control.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ControlsPanel;
