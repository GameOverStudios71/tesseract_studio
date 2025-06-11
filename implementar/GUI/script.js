// GUI Layout Interface JavaScript

class GUIInterface {
    constructor() {
        this.panels = {
            left: {
                element: document.getElementById('left-panel'),
                width: 300,
                minWidth: 200,
                maxWidth: 500,
                visible: true,
                resizing: false
            },
            right: {
                element: document.getElementById('right-panel'),
                width: 350,
                minWidth: 250,
                maxWidth: 600,
                visible: true,
                resizing: false
            }
        };

        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupPanelControls();
        this.setupResizeHandles();
        this.setupTabs();
        this.setupRightTabs();
        this.setupGridControls();
        this.updateCanvasWidth();

        // Update canvas width on window resize
        window.addEventListener('resize', () => this.updateCanvasWidth());
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            
            // Save theme preference
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    }

    setupPanelControls() {
        document.getElementById('toggle-left').addEventListener('click', () => {
            this.togglePanel('left');
        });

        document.getElementById('toggle-right').addEventListener('click', () => {
            this.togglePanel('right');
        });

        document.getElementById('reset-panels').addEventListener('click', () => {
            this.resetPanels();
        });

        document.getElementById('preview-btn').addEventListener('click', () => {
            this.openPreview();
        });
    }

    setupResizeHandles() {
        const resizeHandles = document.querySelectorAll('.resize-handle');
        
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const panelType = handle.dataset.panel;
                this.startResize(panelType, e);
            });
        });
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    setupRightTabs() {
        const rightTabButtons = document.querySelectorAll('.right-tab-button');

        rightTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchRightTab(tabName);
            });
        });
    }

    setupGridControls() {
        // Get all grid control inputs (including selects, color, url)
        const gridInputs = document.querySelectorAll('#right-tab-layout-decorations input, #right-tab-layout-decorations select');

        gridInputs.forEach(input => {
            // Add change event listener
            input.addEventListener('input', () => {
                this.updateGridVariable(input.id, input.value);
            });

            // Add change event for file inputs
            if (input.type === 'file') {
                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        // Create a relative path for the selected file
                        const fileName = file.name;
                        const relativePath = `../img/${fileName}`;

                        // Update the corresponding text input
                        const textInputId = input.id.replace('-file', '');
                        const textInput = document.getElementById(textInputId);
                        if (textInput) {
                            textInput.value = relativePath;
                            this.updateGridVariable(textInputId, relativePath);
                        }
                    }
                });
            }

            // Add mouse wheel support only for number inputs
            if (input.type === 'number') {
                input.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    const step = parseFloat(input.step) || 0.1;
                    const currentValue = parseFloat(input.value) || 0;
                    const newValue = e.deltaY < 0 ? currentValue + step : currentValue - step;
                    const min = parseFloat(input.min) || 0;
                    const max = parseFloat(input.max) || 100;

                    input.value = Math.max(min, Math.min(max, newValue)).toFixed(1);
                    this.updateGridVariable(input.id, input.value);
                });
            }
        });

        // Reset button
        document.getElementById('reset-grid-values').addEventListener('click', () => {
            this.resetGridValues();
        });
    }

    togglePanel(panelType) {
        const panel = this.panels[panelType];
        panel.visible = !panel.visible;
        
        if (panel.visible) {
            panel.element.style.width = `${panel.width}px`;
            panel.element.style.display = 'block';
        } else {
            panel.element.style.width = '0px';
            panel.element.style.display = 'none';
        }
        
        this.updateCanvasWidth();
    }

    resetPanels() {
        this.panels.left.width = 300;
        this.panels.right.width = 350;
        this.panels.left.visible = true;
        this.panels.right.visible = true;
        
        this.panels.left.element.style.width = '300px';
        this.panels.left.element.style.display = 'block';
        this.panels.right.element.style.width = '350px';
        this.panels.right.element.style.display = 'block';
        
        this.updateCanvasWidth();
    }

    startResize(panelType, e) {
        const panel = this.panels[panelType];
        panel.resizing = true;
        
        const startX = e.clientX;
        const startWidth = panel.width;
        
        // Show resize indicator
        const indicator = document.getElementById(`${panelType}-resize-indicator`);
        const widthDisplay = document.getElementById(`${panelType}-width-display`);
        indicator.classList.remove('hidden');
        
        // Add resizing class to body
        document.body.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        
        const handleMouseMove = (e) => {
            let deltaX = e.clientX - startX;
            
            // Reverse delta for right panel
            if (panelType === 'right') {
                deltaX = startX - e.clientX;
            }
            
            const newWidth = Math.max(
                panel.minWidth,
                Math.min(panel.maxWidth, startWidth + deltaX)
            );
            
            panel.width = newWidth;
            panel.element.style.width = `${newWidth}px`;
            widthDisplay.textContent = newWidth;
            
            this.updateCanvasWidth();
        };
        
        const handleMouseUp = () => {
            panel.resizing = false;
            
            // Hide resize indicator
            indicator.classList.add('hidden');
            
            // Remove resizing class from body
            document.body.classList.remove('resizing');
            document.body.style.cursor = '';
            
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    switchTab(tabName) {
        // Update tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('active', 'border-blue-500', 'text-blue-600', 'dark:text-blue-400');
                button.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            } else {
                button.classList.remove('active', 'border-blue-500', 'text-blue-600', 'dark:text-blue-400');
                button.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            }
        });
        
        // Update tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            if (content.id === `tab-${tabName}`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    }

    updateCanvasWidth() {
        const leftWidth = this.panels.left.visible ? this.panels.left.width : 0;
        const rightWidth = this.panels.right.visible ? this.panels.right.width : 0;
        const canvasWidth = Math.max(0, window.innerWidth - leftWidth - rightWidth - 32); // 32px for padding

        document.getElementById('canvas-width').textContent = canvasWidth;
    }

    openPreview() {
        // Open the original implementation in a new window/tab
        const previewUrl = '../implementar/index.html';
        window.open(previewUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    }

    switchRightTab(tabName) {
        // Update right tab buttons
        const rightTabButtons = document.querySelectorAll('.right-tab-button');
        rightTabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('active', 'border-blue-500', 'text-blue-600', 'dark:text-blue-400');
                button.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            } else {
                button.classList.remove('active', 'border-blue-500', 'text-blue-600', 'dark:text-blue-400');
                button.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            }
        });

        // Update right tab content
        const rightTabContents = document.querySelectorAll('.right-tab-content');
        rightTabContents.forEach(content => {
            if (content.id === `right-tab-${tabName}`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    }

    updateGridVariable(inputId, value) {
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) return;

        // Map input IDs to CSS variable names
        const variableMap = {
            // Global settings
            'container-margin-percent': '--container-margin-percent',
            'container-border-percent': '--container-border-percent',
            'container-border-color': '--container-border-color',
            'min-object-size-px': '--min-object-size-px',
            'min-border': '--min-border',
            'min-border-radius': '--min-border-radius',
            'min-font-size': '--min-font-size',
            'min-shadow': '--min-shadow',

            // Object 1: Top Left
            'object-top-left-size': '--object-top-left-size',
            'object-top-left-orientation-is-landscape': '--object-top-left-orientation-is-landscape',
            'object-top-left-aspect-w': '--object-top-left-aspect-w',
            'object-top-left-aspect-h': '--object-top-left-aspect-h',
            'object-top-left-background': '--object-top-left-background',
            'object-top-left-border-width': '--object-top-left-border-width',
            'object-top-left-border-color': '--object-top-left-border-color',
            'object-top-left-border-radius': '--object-top-left-border-radius',
            'object-top-left-padding': '--object-top-left-padding',
            'object-top-left-image-url': '--object-top-left-image-url',
            'object-top-left-text-color': '--object-top-left-text-color',
            'object-top-left-font-size': '--object-top-left-font-size',
            'object-top-left-visible': '--object-top-left-visible',

            // Object 2: Top Center Left
            'object-top-center-left-size': '--object-top-center-left-size',
            'object-top-center-left-orientation-is-landscape': '--object-top-center-left-orientation-is-landscape',
            'object-top-center-left-aspect-w': '--object-top-center-left-aspect-w',
            'object-top-center-left-aspect-h': '--object-top-center-left-aspect-h',
            'object-top-center-left-background': '--object-top-center-left-background',
            'object-top-center-left-border-width': '--object-top-center-left-border-width',
            'object-top-center-left-border-color': '--object-top-center-left-border-color',
            'object-top-center-left-border-radius': '--object-top-center-left-border-radius',
            'object-top-center-left-padding': '--object-top-center-left-padding',
            'object-top-center-left-image-url': '--object-top-center-left-image-url',
            'object-top-center-left-text-color': '--object-top-center-left-text-color',
            'object-top-center-left-font-size': '--object-top-center-left-font-size',
            'object-top-center-left-visible': '--object-top-center-left-visible',

            // Object 3: Top Middle
            'object-top-middle-size': '--object-top-middle-size',
            'object-top-middle-orientation-is-landscape': '--object-top-middle-orientation-is-landscape',
            'object-top-middle-aspect-w': '--object-top-middle-aspect-w',
            'object-top-middle-aspect-h': '--object-top-middle-aspect-h',
            'object-top-middle-background': '--object-top-middle-background',
            'object-top-middle-border-width': '--object-top-middle-border-width',
            'object-top-middle-border-color': '--object-top-middle-border-color',
            'object-top-middle-border-radius': '--object-top-middle-border-radius',
            'object-top-middle-padding': '--object-top-middle-padding',
            'object-top-middle-image-url': '--object-top-middle-image-url',
            'object-top-middle-text-color': '--object-top-middle-text-color',
            'object-top-middle-font-size': '--object-top-middle-font-size',
            'object-top-middle-visible': '--object-top-middle-visible',

            // Object 4: Top Center Right
            'object-top-center-right-size': '--object-top-center-right-size',
            'object-top-center-right-orientation-is-landscape': '--object-top-center-right-orientation-is-landscape',
            'object-top-center-right-aspect-w': '--object-top-center-right-aspect-w',
            'object-top-center-right-aspect-h': '--object-top-center-right-aspect-h',
            'object-top-center-right-background': '--object-top-center-right-background',
            'object-top-center-right-border-width': '--object-top-center-right-border-width',
            'object-top-center-right-border-color': '--object-top-center-right-border-color',
            'object-top-center-right-border-radius': '--object-top-center-right-border-radius',
            'object-top-center-right-padding': '--object-top-center-right-padding',
            'object-top-center-right-image-url': '--object-top-center-right-image-url',
            'object-top-center-right-text-color': '--object-top-center-right-text-color',
            'object-top-center-right-font-size': '--object-top-center-right-font-size',
            'object-top-center-right-visible': '--object-top-center-right-visible',

            // TODO: Add remaining objects 4-15
            'object-top-center-right-size': '--object-top-center-right-size',
            'object-top-right-size': '--object-top-right-size',
            'object-middle-left-size': '--object-middle-left-size',
            'object-center-left-size': '--object-center-left-size',
            'object-middle-middle-size': '--object-middle-middle-size',
            'object-center-right-size': '--object-center-right-size',
            'object-middle-right-size': '--object-middle-right-size',
            'object-bottom-left-size': '--object-bottom-left-size',
            'object-bottom-center-left-size': '--object-bottom-center-left-size',
            'object-bottom-middle-size': '--object-bottom-middle-size',
            'object-bottom-center-right-size': '--object-bottom-center-right-size',
            'object-bottom-right-size': '--object-bottom-right-size'
        };

        const cssVariable = variableMap[inputId];
        if (cssVariable) {
            let cssValue = value;

            // Handle different types of values
            if (cssVariable === '--min-object-size-px' ||
                cssVariable === '--min-border' ||
                cssVariable === '--min-border-radius' ||
                cssVariable === '--min-font-size' ||
                cssVariable === '--min-shadow') {
                cssValue = `${value}px`;
            } else if (inputId.includes('image-url')) {
                cssValue = value && value.trim() ? `url('${value}')` : 'none';
            }

            canvasContainer.style.setProperty(cssVariable, cssValue);
        }
    }

    resetGridValues() {
        // Default values
        const defaults = {
            // Global settings
            'container-margin-percent': 5.0,
            'container-border-percent': 3.0,
            'container-border-color': '#333333',
            'min-object-size-px': 20.0,
            'min-border': 1.0,
            'min-border-radius': 3.0,
            'min-font-size': 8.0,
            'min-shadow': 2.0,

            // Object 1: Top Left
            'object-top-left-size': 4.0,
            'object-top-left-orientation-is-landscape': 1,
            'object-top-left-aspect-w': 16.0,
            'object-top-left-aspect-h': 9.0,
            'object-top-left-background': '#e6194B',
            'object-top-left-border-width': 0.05,
            'object-top-left-border-color': '#333333',
            'object-top-left-border-radius': 0.20,
            'object-top-left-padding': 0.0,
            'object-top-left-image-url': '',
            'object-top-left-text-color': '#333333',
            'object-top-left-font-size': 0.30,
            'object-top-left-visible': 1,

            // Object 2: Top Center Left
            'object-top-center-left-size': 4.0,
            'object-top-center-left-orientation-is-landscape': 1,
            'object-top-center-left-aspect-w': 16.0,
            'object-top-center-left-aspect-h': 9.0,
            'object-top-center-left-background': '#3cb44b',
            'object-top-center-left-border-width': 0.05,
            'object-top-center-left-border-color': '#333333',
            'object-top-center-left-border-radius': 0.20,
            'object-top-center-left-padding': 0.0,
            'object-top-center-left-image-url': '',
            'object-top-center-left-text-color': '#333333',
            'object-top-center-left-font-size': 0.30,
            'object-top-center-left-visible': 1,

            // Object 2: Top Center Left
            'object-top-center-left-size': 4.0,
            'object-top-center-left-orientation-is-landscape': 1,
            'object-top-center-left-aspect-w': 16.0,
            'object-top-center-left-aspect-h': 9.0,
            'object-top-center-left-background': '#3cb44b',
            'object-top-center-left-border-width': 0.05,
            'object-top-center-left-border-color': '#333333',
            'object-top-center-left-border-radius': 0.20,
            'object-top-center-left-padding': 0.0,
            'object-top-center-left-image-url': '',
            'object-top-center-left-text-color': '#333333',
            'object-top-center-left-font-size': 0.30,
            'object-top-center-left-visible': 1,

            // Object 3: Top Middle
            'object-top-middle-size': 4.0,
            'object-top-middle-orientation-is-landscape': 0,
            'object-top-middle-aspect-w': 9.0,
            'object-top-middle-aspect-h': 16.0,
            'object-top-middle-background': '#ffe119',
            'object-top-middle-border-width': 0.05,
            'object-top-middle-border-color': '#333333',
            'object-top-middle-border-radius': 0.20,
            'object-top-middle-padding': 0.0,
            'object-top-middle-image-url': '',
            'object-top-middle-text-color': '#333333',
            'object-top-middle-font-size': 0.30,
            'object-top-middle-visible': 1,

            // Object 4: Top Center Right
            'object-top-center-right-size': 4.0,
            'object-top-center-right-orientation-is-landscape': 1,
            'object-top-center-right-aspect-w': 16.0,
            'object-top-center-right-aspect-h': 9.0,
            'object-top-center-right-background': '#4363d8',
            'object-top-center-right-border-width': 0.05,
            'object-top-center-right-border-color': '#333333',
            'object-top-center-right-border-radius': 0.20,
            'object-top-center-right-padding': 0.0,
            'object-top-center-right-image-url': '',
            'object-top-center-right-text-color': '#333333',
            'object-top-center-right-font-size': 0.30,
            'object-top-center-right-visible': 1,

            // TODO: Add remaining objects 4-15 defaults
            'object-top-center-right-size': 4.0,
            'object-top-right-size': 4.0,
            'object-middle-left-size': 2.0,
            'object-center-left-size': 2.0,
            'object-middle-middle-size': 3.0,
            'object-center-right-size': 2.0,
            'object-middle-right-size': 2.0,
            'object-bottom-left-size': 2.0,
            'object-bottom-center-left-size': 2.0,
            'object-bottom-middle-size': 2.0,
            'object-bottom-center-right-size': 2.0,
            'object-bottom-right-size': 2.0
        };

        // Reset input values and CSS variables
        Object.entries(defaults).forEach(([inputId, value]) => {
            const input = document.getElementById(inputId);
            if (input) {
                if (input.type === 'number') {
                    input.value = typeof value === 'number' ? value.toFixed(1) : value;
                } else if (input.tagName === 'SELECT') {
                    input.value = value;
                } else if (input.type === 'color') {
                    input.value = value;
                } else if (input.type === 'url') {
                    input.value = value;
                } else {
                    input.value = value;
                }
                this.updateGridVariable(inputId, value);
            }
        });
    }
}

// Initialize the GUI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GUIInterface();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to component and control cards
    const cards = document.querySelectorAll('.space-y-3 > div');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            card.style.transition = 'all 0.2s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });
    
    // Add click feedback to buttons
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
    });
});
