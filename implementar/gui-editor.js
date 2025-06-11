// GUI Editor Interface JavaScript
class GUIEditor {
    constructor() {
        this.panels = {
            left: {
                element: document.getElementById('left-panel'),
                width: 350,
                minWidth: 250,
                maxWidth: 600,
                visible: true,
                resizing: false
            },
            right: {
                element: document.getElementById('right-panel'),
                width: 400,
                minWidth: 300,
                maxWidth: 700,
                visible: true,
                resizing: false
            }
        };

        this.objectIds = [
            'top-left', 'top-center-left', 'top-middle', 'top-center-right', 'top-right',
            'middle-left', 'center-left', 'middle-middle', 'center-right', 'middle-right',
            'bottom-left', 'bottom-center-left', 'bottom-middle', 'bottom-center-right', 'bottom-right'
        ];

        this.objectNames = [
            'Top Left', 'Top Center Left', 'Top Middle', 'Top Center Right', 'Top Right',
            'Middle Left', 'Center Left', 'Middle Middle', 'Center Right', 'Middle Right',
            'Bottom Left', 'Bottom Center Left', 'Bottom Middle', 'Bottom Center Right', 'Bottom Right'
        ];

        this.defaultColors = [
            [230, 25, 75],   // 1 - Vermelho
            [60, 180, 75],   // 2 - Verde
            [255, 225, 25],  // 3 - Amarelo
            [67, 99, 216],   // 4 - Azul
            [245, 130, 49],  // 5 - Laranja
            [145, 30, 180],  // 6 - Roxo
            [70, 240, 240],  // 7 - Ciano
            [240, 50, 230],  // 8 - Magenta
            [188, 246, 12],  // 9 - Lima
            [250, 190, 190], // 10 - Rosa Claro
            [0, 128, 128],   // 11 - Teal
            [230, 190, 255], // 12 - Lavanda
            [154, 99, 36],   // 13 - Marrom
            [255, 250, 200], // 14 - Bege
            [128, 0, 0]      // 15 - Marsala
        ];

        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupPanelControls();
        this.setupResizeHandles();
        this.setupTabs();
        this.setupRightTabs();
        this.createGlobalControls();
        this.createObjectControls();
        this.updateCanvasWidth();

        // Initial canvas dimensions setup
        setTimeout(() => {
            this.updateCanvasDimensions();
        }, 100);

        // Update canvas width on window resize
        window.addEventListener('resize', () => {
            this.updateCanvasWidth();
            setTimeout(() => {
                this.updateCanvasDimensions();
            }, 50);
        });
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

    // Função para criar um controle de input
    createControl(container, label, id, type, min, max, step, defaultValue, unit = '', cssVar = null) {
        const div = document.createElement('div');
        div.className = 'mb-3';
        
        const labelEl = document.createElement('label');
        labelEl.className = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';
        labelEl.htmlFor = id;
        labelEl.textContent = label;
        
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.className = 'w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100';
        
        if (type === 'range') {
            input.min = min;
            input.max = max;
            input.step = step;
            input.value = defaultValue;
            
            const display = document.createElement('span');
            display.className = 'text-xs text-blue-600 dark:text-blue-400 font-mono ml-2';
            display.textContent = defaultValue + (unit || '');
            
            input.addEventListener('input', function() {
                display.textContent = this.value + (unit || '');
                if (cssVar) {
                    updateCSSVariable(cssVar, this.value, unit);

                    // If this is a size control, recalculate positions
                    if (cssVar.includes('size') || cssVar.includes('margin') || cssVar.includes('border')) {
                        setTimeout(() => {
                            window.guiEditor.updateCanvasDimensions();
                        }, 10);
                    }
                }
            });
            
            div.appendChild(labelEl);
            div.appendChild(input);
            div.appendChild(display);
        } else {
            input.value = defaultValue;
            
            input.addEventListener('input', function() {
                if (cssVar) {
                    updateCSSVariable(cssVar, this.value, unit);
                }
            });
            
            div.appendChild(labelEl);
            div.appendChild(input);
        }
        
        container.appendChild(div);
        return input;
    }

    // Função para criar controle de checkbox
    createCheckboxControl(container, label, id, defaultValue, cssVar = null, trueValue = 'visible', falseValue = 'hidden') {
        const div = document.createElement('div');
        div.className = 'mb-3 flex items-center';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = defaultValue;
        checkbox.className = 'mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';
        
        const labelEl = document.createElement('label');
        labelEl.htmlFor = id;
        labelEl.className = 'text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer';
        labelEl.textContent = label;
        
        checkbox.addEventListener('change', function() {
            if (cssVar) {
                updateCSSVariable(cssVar, this.checked ? trueValue : falseValue);
            }
        });
        
        div.appendChild(checkbox);
        div.appendChild(labelEl);
        container.appendChild(div);
        
        return checkbox;
    }

    // Função para criar controle de cor RGB
    createColorControl(container, label, id, defaultR, defaultG, defaultB, cssVar) {
        const div = document.createElement('div');
        div.className = 'mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded border';
        
        const labelEl = document.createElement('label');
        labelEl.className = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2';
        labelEl.textContent = label;
        
        const colorContainer = document.createElement('div');
        colorContainer.className = 'space-y-2';
        
        // RGB Sliders
        const rgbContainer = document.createElement('div');
        rgbContainer.className = 'grid grid-cols-3 gap-2 text-xs';
        
        const rInput = this.createRGBSlider('R', defaultR, 'text-red-600');
        const gInput = this.createRGBSlider('G', defaultG, 'text-green-600');
        const bInput = this.createRGBSlider('B', defaultB, 'text-blue-600');
        
        rgbContainer.appendChild(rInput.container);
        rgbContainer.appendChild(gInput.container);
        rgbContainer.appendChild(bInput.container);
        
        // Preview
        const preview = document.createElement('div');
        preview.className = 'w-full h-6 border border-gray-300 dark:border-gray-600 rounded';
        
        const display = document.createElement('div');
        display.className = 'text-xs text-gray-500 dark:text-gray-400 font-mono text-center mt-1';
        
        function updateColor() {
            const r = rInput.input.value;
            const g = gInput.input.value;
            const b = bInput.input.value;
            const rgbValue = `${r}, ${g}, ${b}`;
            
            preview.style.backgroundColor = `rgb(${rgbValue})`;
            display.textContent = `RGB(${rgbValue})`;
            updateCSSVariable(cssVar, rgbValue);
        }
        
        rInput.input.addEventListener('input', updateColor);
        gInput.input.addEventListener('input', updateColor);
        bInput.input.addEventListener('input', updateColor);
        
        div.appendChild(labelEl);
        colorContainer.appendChild(rgbContainer);
        colorContainer.appendChild(preview);
        colorContainer.appendChild(display);
        div.appendChild(colorContainer);
        container.appendChild(div);
        
        updateColor(); // Inicializar
        return { rInput: rInput.input, gInput: gInput.input, bInput: bInput.input };
    }

    createRGBSlider(label, defaultValue, colorClass) {
        const container = document.createElement('div');
        
        const labelEl = document.createElement('div');
        labelEl.className = `font-medium ${colorClass}`;
        labelEl.textContent = label;
        
        const input = document.createElement('input');
        input.type = 'range';
        input.min = '0';
        input.max = '255';
        input.value = defaultValue;
        input.className = 'w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700';
        
        const display = document.createElement('div');
        display.className = 'text-center text-xs text-gray-500 dark:text-gray-400';
        display.textContent = defaultValue;
        
        input.addEventListener('input', function() {
            display.textContent = this.value;
        });
        
        container.appendChild(labelEl);
        container.appendChild(input);
        container.appendChild(display);
        
        return { container, input };
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
        this.panels.left.width = 350;
        this.panels.right.width = 400;
        this.panels.left.visible = true;
        this.panels.right.visible = true;
        
        this.panels.left.element.style.width = '350px';
        this.panels.left.element.style.display = 'block';
        this.panels.right.element.style.width = '400px';
        this.panels.right.element.style.display = 'block';
        
        this.updateCanvasWidth();
    }

    updateCanvasWidth() {
        const leftWidth = this.panels.left.visible ? this.panels.left.width : 0;
        const rightWidth = this.panels.right.visible ? this.panels.right.width : 0;
        const canvasWidth = Math.max(0, window.innerWidth - leftWidth - rightWidth - 32); // 32px for padding

        document.getElementById('canvas-width').textContent = canvasWidth;

        // Update canvas container dimensions and recalculate object positions
        this.updateCanvasDimensions();
    }

    updateCanvasDimensions() {
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) return;

        // Get actual canvas dimensions
        const rect = canvasContainer.getBoundingClientRect();
        const canvasWidth = rect.width;
        const canvasHeight = rect.height;

        // Update CSS variables to use canvas dimensions instead of viewport
        canvasContainer.style.setProperty('--canvas-width', `${canvasWidth}px`);
        canvasContainer.style.setProperty('--canvas-height', `${canvasHeight}px`);

        // Recalculate container dimensions
        const marginPercent = parseFloat(getComputedStyle(canvasContainer).getPropertyValue('--container-margin-percent')) || 3;
        const borderPercent = parseFloat(getComputedStyle(canvasContainer).getPropertyValue('--container-border-percent')) || 1;

        const containerMargin = (marginPercent / 100) * Math.min(canvasWidth, canvasHeight);
        const containerBorder = (borderPercent / 100) * Math.min(canvasWidth, canvasHeight);

        canvasContainer.style.setProperty('--container-margin', `${containerMargin}px`);
        canvasContainer.style.setProperty('--container-border', `${containerBorder}px`);

        // Update derived values
        canvasContainer.style.setProperty('--double-margin', `${containerMargin * 2}px`);
        canvasContainer.style.setProperty('--double-border', `${containerBorder * 2}px`);
        canvasContainer.style.setProperty('--half-border', `${containerBorder / 2}px`);

        // Update container inner dimensions
        const containerInnerWidth = canvasWidth - (containerMargin * 2) - (containerBorder * 2);
        const containerInnerHeight = canvasHeight - (containerMargin * 2) - (containerBorder * 2);

        canvasContainer.style.setProperty('--container-inner-width', `${containerInnerWidth}px`);
        canvasContainer.style.setProperty('--container-inner-height', `${containerInnerHeight}px`);

        // Update position calculations
        const quarterPosition = containerMargin + containerBorder + (containerInnerWidth / 4);
        const threeQuarterPosition = containerMargin + containerBorder + (containerInnerWidth * 3 / 4);

        canvasContainer.style.setProperty('--quarter-position', `${quarterPosition}px`);
        canvasContainer.style.setProperty('--three-quarter-position', `${threeQuarterPosition}px`);

        // Force recalculation of object positions
        this.recalculateObjectPositions();
    }

    recalculateObjectPositions() {
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) return;

        // Get current canvas dimensions
        const rect = canvasContainer.getBoundingClientRect();
        const canvasWidth = rect.width;
        const canvasHeight = rect.height;

        // Update all object size calculations to use canvas dimensions instead of viewport
        this.objectIds.forEach((id, index) => {
            const objectNum = index + 1;

            // Get current size value
            const sizeInput = document.getElementById(`${id}-size`);
            const size = sizeInput ? parseFloat(sizeInput.value) : 15;

            // Calculate base scale using canvas dimensions instead of viewport
            const baseScale = Math.max((size / 100) * Math.min(canvasWidth, canvasHeight), 25);

            // Update the base scale variable
            canvasContainer.style.setProperty(`--_base-scale-${id}`, `${baseScale}px`);
        });
    }

    openPreview() {
        // Open the original implementation in a new window/tab
        const previewUrl = 'index.html';
        window.open(previewUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    }

    createGlobalControls() {
        const globalContainer = document.getElementById('global-controls-container');
        const effectsContainer = document.getElementById('effects-controls-container');

        // === CONFIGURAÇÕES PRINCIPAIS ===
        const mainSection = document.createElement('div');
        mainSection.className = 'mb-6 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600';
        mainSection.innerHTML = '<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🎯 Configurações Principais</h4>';

        this.createControl(mainSection, 'Margem do Container (%)', 'container-margin', 'range', 0, 10, 0.5, 3, '', 'container-margin-percent');
        this.createControl(mainSection, 'Borda do Container (%)', 'container-border', 'range', 0.5, 3, 0.1, 1, '', 'container-border-percent');
        this.createControl(mainSection, 'Tamanho Mínimo de Objeto (px)', 'min-object-size', 'range', 10, 50, 1, 25, 'px', 'min-object-size-px');

        globalContainer.appendChild(mainSection);

        // === VALORES MÍNIMOS ===
        const minSection = document.createElement('div');
        minSection.className = 'mb-6 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600';
        minSection.innerHTML = '<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🔒 Valores Mínimos</h4>';

        this.createControl(minSection, 'Borda Mínima (px)', 'min-border', 'range', 0, 5, 0.5, 1, 'px', 'min-border');
        this.createControl(minSection, 'Raio de Borda Mínimo (px)', 'min-border-radius', 'range', 0, 10, 1, 0, 'px', 'min-border-radius');
        this.createControl(minSection, 'Tamanho Mínimo de Fonte (px)', 'min-font-size', 'range', 6, 16, 1, 8, 'px', 'min-font-size');
        this.createControl(minSection, 'Sombra Mínima (px)', 'min-shadow', 'range', 0, 10, 1, 2, 'px', 'min-shadow');

        globalContainer.appendChild(minSection);

        // === EFEITO GLASSMORPHISM ===
        const glassSection = document.createElement('div');
        glassSection.className = 'mb-6 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600';
        glassSection.innerHTML = '<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🔮 Efeito Glassmorphism</h4>';

        this.createControl(glassSection, 'Opacidade do Fundo', 'bg-alpha', 'range', 0, 1, 0.05, 0.25, '', 'object-bg-alpha');
        this.createControl(glassSection, 'Desfoque (px)', 'backdrop-blur', 'range', 0, 20, 1, 10, 'px', 'object-backdrop-blur-px');
        this.createControl(glassSection, 'Saturação (%)', 'backdrop-saturate', 'range', 50, 200, 10, 120, '%', 'object-backdrop-saturate-percent');
        this.createControl(glassSection, 'Brilho (%)', 'backdrop-brightness', 'range', 50, 150, 5, 80, '%', 'object-backdrop-brightness-percent');

        effectsContainer.appendChild(glassSection);

        // === ESTILOS GLOBAIS DOS OBJETOS ===
        const styleSection = document.createElement('div');
        styleSection.className = 'mb-6 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600';
        styleSection.innerHTML = '<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">✨ Estilos Globais dos Objetos</h4>';

        this.createControl(styleSection, 'Fator Raio de Borda', 'border-radius-factor', 'range', 0, 1, 0.05, 0.2, '', 'object-border-radius-factor');
        this.createControl(styleSection, 'Fator Largura da Borda', 'border-width-factor', 'range', 0, 0.2, 0.01, 0.05, '', 'object-border-width-factor');
        this.createControl(styleSection, 'Fator Tamanho da Sombra', 'shadow-size-factor', 'range', 0, 0.2, 0.01, 0.08, '', 'object-shadow-size-factor');
        this.createControl(styleSection, 'Fator Escala no Hover', 'hover-scale-factor', 'range', 1, 2, 0.1, 1.1, '', 'object-hover-scale-factor');
        this.createControl(styleSection, 'Fator Brilho no Hover', 'hover-brightness-factor', 'range', 1, 2, 0.1, 1.2, '', 'object-hover-brightness-factor');

        effectsContainer.appendChild(styleSection);
    }

    createObjectControls() {
        const objectsContainer = document.getElementById('objects-controls-container');

        this.objectIds.forEach((id, index) => {
            const objectNum = index + 1;
            const objectName = this.objectNames[index];
            const defaultColor = this.defaultColors[index];

            // Criar seção para o objeto
            const objectSection = document.createElement('div');
            objectSection.className = 'mb-4 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg border-2 border-yellow-200 dark:border-yellow-700';
            objectSection.innerHTML = `<h4 class="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-3">🎯 ${objectNum}. ${objectName}</h4>`;

            // Visibilidade
            this.createCheckboxControl(objectSection, '👁️ Visível', `visibility-${id}`, true, `visibility-${id}`);

            // Tamanho e Orientação
            this.createControl(objectSection, '📏 Tamanho (% viewport)', `${id}-size`, 'range', 5, 30, 1, 15, '', `object-${id}-size`);
            this.createCheckboxControl(objectSection, '🖼️ Paisagem (desmarque para Retrato)', `${id}-landscape`, true, `object-${id}-orientation-is-landscape`, '1', '0');

            // Cor do Objeto
            this.createColorControl(objectSection, `🎨 Cor RGB`, `color-${objectNum}`, defaultColor[0], defaultColor[1], defaultColor[2], `color-${objectNum}-rgb`);

            // Imagem/SVG do Objeto
            this.createImageControl(objectSection, id);

            objectsContainer.appendChild(objectSection);
        });
    }

    createImageControl(container, objectId) {
        const div = document.createElement('div');
        div.className = 'mt-3 p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500';

        const title = document.createElement('h5');
        title.className = 'text-xs font-medium text-gray-600 dark:text-gray-400 mb-2';
        title.textContent = '🖼️ Imagem/SVG';

        // Input para caminho da imagem
        const pathInput = document.createElement('input');
        pathInput.type = 'text';
        pathInput.placeholder = 'Ex: imagem.jpg, icon.svg, https://...';
        pathInput.className = 'w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-2';

        // Select para modo de ajuste
        const modeSelect = document.createElement('select');
        modeSelect.className = 'w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-2';

        const modes = [
            { value: 'cover', text: '🔳 Cover - Preenche todo o objeto' },
            { value: 'contain', text: '📦 Contain - Mostra imagem completa' },
            { value: 'fill', text: '🎯 Fill - Estica para preencher' },
            { value: 'scale-down', text: '📉 Scale Down - Menor entre contain e original' },
            { value: 'none', text: '📌 None - Tamanho original' }
        ];

        modes.forEach(mode => {
            const option = document.createElement('option');
            option.value = mode.value;
            option.textContent = mode.text;
            modeSelect.appendChild(option);
        });

        modeSelect.value = 'cover'; // Padrão

        // Preview da imagem
        const preview = document.createElement('div');
        preview.className = 'w-full h-16 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-2';
        preview.innerHTML = '<span>📷 Preview</span>';

        // Botão para limpar
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.textContent = '🗑️ Limpar';
        clearBtn.className = 'px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors';

        // Função para atualizar imagem
        function updateImage() {
            const path = pathInput.value.trim();
            const mode = modeSelect.value;

            if (path) {
                // Atualizar CSS
                updateCSSVariable(`bg-${objectId}`, `url('${path}')`);
                updateCSSVariable(`bg-${objectId}-size`, mode);

                // Atualizar preview
                preview.innerHTML = `<img src="${path}" alt="Preview" class="max-w-full max-h-full object-${mode}">`;
            } else {
                // Limpar
                updateCSSVariable(`bg-${objectId}`, `url('')`);
                preview.innerHTML = '<span>📷 Preview</span>';
            }
        }

        // Event listeners
        pathInput.addEventListener('input', updateImage);
        modeSelect.addEventListener('change', updateImage);
        clearBtn.addEventListener('click', function() {
            pathInput.value = '';
            modeSelect.value = 'cover';
            updateImage();
        });

        // Montar o controle
        div.appendChild(title);
        div.appendChild(pathInput);
        div.appendChild(modeSelect);
        div.appendChild(preview);
        div.appendChild(clearBtn);

        container.appendChild(div);

        return { pathInput, modeSelect, preview };
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

    switchRightTab(tabName) {
        // Update right tab buttons
        const rightTabButtons = document.querySelectorAll('.right-tab-button');
        rightTabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('active', 'border-purple-500', 'text-purple-600', 'dark:text-purple-400');
                button.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            } else {
                button.classList.remove('active', 'border-purple-500', 'text-purple-600', 'dark:text-purple-400');
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
}

// Função global para atualizar valores CSS
function updateCSSVariable(name, value, unit = '') {
    document.documentElement.style.setProperty(`--${name}`, value + unit);
}

// Initialize the GUI Editor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.guiEditor = new GUIEditor();
});
