// GUI Editor Simple - Menu Lateral Fixo
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do painel
  const panel = document.getElementById('gui-panel');
  const toggleBtn = document.getElementById('toggle-panel');
  const guiContent = document.getElementById('gui-content');
  
  // Lista de todos os objetos
  const objectIds = [
    'top-left', 'top-center-left', 'top-middle', 'top-center-right', 'top-right',
    'middle-left', 'center-left', 'middle-middle', 'center-right', 'middle-right',
    'bottom-left', 'bottom-center-left', 'bottom-middle', 'bottom-center-right', 'bottom-right'
  ];

  // Nomes amigáveis para os objetos
  const objectNames = [
    'Top Left', 'Top Center Left', 'Top Middle', 'Top Center Right', 'Top Right',
    'Middle Left', 'Center Left', 'Middle Middle', 'Center Right', 'Middle Right',
    'Bottom Left', 'Bottom Center Left', 'Bottom Middle', 'Bottom Center Right', 'Bottom Right'
  ];

  // Cores padrão para cada objeto
  const defaultColors = [
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

  // Função para criar um controle de input
  function createControl(container, label, id, type, min, max, step, defaultValue, unit = '', cssVar = null) {
    const div = document.createElement('div');
    div.className = 'config-item';

    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.textContent = label;

    // Container para os controles do slider
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'slider-controls';

    // Botão MIN
    const minBtn = document.createElement('button');
    minBtn.type = 'button';
    minBtn.className = 'range-btn min-btn';
    minBtn.textContent = 'MIN';
    minBtn.title = 'Definir valor mínimo';

    // Input para valor mínimo
    const minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.className = 'range-input min-input';
    minInput.value = min;
    minInput.title = 'Valor mínimo do slider';
    minInput.step = step;

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = defaultValue;

    // Input para valor máximo
    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.className = 'range-input max-input';
    maxInput.value = max;
    maxInput.title = 'Valor máximo do slider';
    maxInput.step = step;

    // Botão MAX
    const maxBtn = document.createElement('button');
    maxBtn.type = 'button';
    maxBtn.className = 'range-btn max-btn';
    maxBtn.textContent = 'MAX';
    maxBtn.title = 'Definir valor máximo';

    const display = document.createElement('span');
    display.className = 'value-display';
    display.textContent = defaultValue;

    // Event listeners
    input.addEventListener('input', function() {
      display.textContent = this.value;
      if (cssVar) {
        updateCSSVariable(cssVar, this.value, unit);
      }
    });

    // Event listener para wheel (scroll do mouse)
    input.addEventListener('wheel', function(e) {
      e.preventDefault(); // Prevenir scroll da página

      const currentValue = parseFloat(this.value);
      const min = parseFloat(this.min);
      const max = parseFloat(this.max);
      let step = parseFloat(this.step);

      // Modificadores de velocidade
      if (e.shiftKey) {
        step *= 10; // Shift = 10x mais rápido
      } else if (e.ctrlKey) {
        step *= 0.1; // Ctrl = 10x mais lento (precisão)
      }

      // Determinar direção do scroll
      const delta = e.deltaY > 0 ? -step : step; // Invertido: scroll up = aumenta

      // Calcular novo valor
      let newValue = currentValue + delta;

      // Aplicar limites
      newValue = Math.max(min, Math.min(max, newValue));

      // Arredondar para o step original mais próximo
      const originalStep = parseFloat(this.step);
      newValue = Math.round(newValue / originalStep) * originalStep;

      // Atualizar valor
      this.value = newValue;
      display.textContent = newValue;

      if (cssVar) {
        updateCSSVariable(cssVar, newValue, unit);
      }
    });

    // Input MIN - atualiza valor mínimo do slider
    minInput.addEventListener('input', function() {
      const newMin = parseFloat(this.value);
      if (!isNaN(newMin)) {
        input.min = newMin;
        // Se o valor atual for menor que o novo mínimo, ajustar
        if (parseFloat(input.value) < newMin) {
          input.value = newMin;
          display.textContent = input.value;
          if (cssVar) {
            updateCSSVariable(cssVar, input.value, unit);
          }
        }
      }
    });

    // Input MAX - atualiza valor máximo do slider
    maxInput.addEventListener('input', function() {
      const newMax = parseFloat(this.value);
      if (!isNaN(newMax)) {
        input.max = newMax;
        // Se o valor atual for maior que o novo máximo, ajustar
        if (parseFloat(input.value) > newMax) {
          input.value = newMax;
          display.textContent = input.value;
          if (cssVar) {
            updateCSSVariable(cssVar, input.value, unit);
          }
        }
      }
    });

    // Botão MIN - define valor mínimo
    minBtn.addEventListener('click', function() {
      input.value = input.min;
      display.textContent = input.value;
      if (cssVar) {
        updateCSSVariable(cssVar, input.value, unit);
      }
    });

    // Botão MAX - define valor máximo
    maxBtn.addEventListener('click', function() {
      input.value = input.max;
      display.textContent = input.value;
      if (cssVar) {
        updateCSSVariable(cssVar, input.value, unit);
      }
    });

    // Montar os controles
    controlsContainer.appendChild(minBtn);
    controlsContainer.appendChild(minInput);
    controlsContainer.appendChild(input);
    controlsContainer.appendChild(maxInput);
    controlsContainer.appendChild(maxBtn);

    div.appendChild(labelEl);
    div.appendChild(controlsContainer);
    div.appendChild(display);
    container.appendChild(div);

    return input;
  }

  // Função para criar controle de checkbox
  function createCheckboxControl(container, label, id, defaultValue, cssVar = null, trueValue = 'visible', falseValue = 'hidden') {
    const div = document.createElement('div');
    div.className = 'config-item visibility-toggle';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.checked = defaultValue;
    
    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
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
  function createColorControl(container, label, id, defaultR, defaultG, defaultB, cssVar) {
    const div = document.createElement('div');
    div.className = 'config-item color-control';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    
    const colorContainer = document.createElement('div');
    colorContainer.className = 'color-inputs';
    
    const rInput = document.createElement('input');
    rInput.type = 'range';
    rInput.min = '0';
    rInput.max = '255';
    rInput.value = defaultR;
    rInput.className = 'color-input';
    
    const gInput = document.createElement('input');
    gInput.type = 'range';
    gInput.min = '0';
    gInput.max = '255';
    gInput.value = defaultG;
    gInput.className = 'color-input';
    
    const bInput = document.createElement('input');
    bInput.type = 'range';
    bInput.min = '0';
    bInput.max = '255';
    bInput.value = defaultB;
    bInput.className = 'color-input';
    
    const preview = document.createElement('div');
    preview.className = 'color-preview';
    
    const display = document.createElement('span');
    display.className = 'color-display';
    
    function updateColor() {
      const r = rInput.value;
      const g = gInput.value;
      const b = bInput.value;
      const rgbValue = `${r}, ${g}, ${b}`;
      
      preview.style.backgroundColor = `rgb(${rgbValue})`;
      display.textContent = `RGB(${rgbValue})`;
      updateCSSVariable(cssVar, rgbValue);
    }
    
    rInput.addEventListener('input', updateColor);
    gInput.addEventListener('input', updateColor);
    bInput.addEventListener('input', updateColor);

    // Adicionar wheel aos sliders RGB
    [rInput, gInput, bInput].forEach(slider => {
      slider.addEventListener('wheel', function(e) {
        e.preventDefault();

        const currentValue = parseFloat(this.value);
        const min = parseFloat(this.min);
        const max = parseFloat(this.max);
        let step = 1; // RGB sempre step 1

        // Modificadores de velocidade para RGB
        if (e.shiftKey) {
          step = 10; // Shift = saltos de 10
        } else if (e.ctrlKey) {
          step = 1; // Ctrl = precisão (já é 1)
        }

        const delta = e.deltaY > 0 ? -step : step;
        let newValue = currentValue + delta;

        newValue = Math.max(min, Math.min(max, newValue));

        this.value = newValue;
        updateColor();
      });
    });
    
    colorContainer.appendChild(document.createTextNode('R: '));
    colorContainer.appendChild(rInput);
    colorContainer.appendChild(document.createTextNode(' G: '));
    colorContainer.appendChild(gInput);
    colorContainer.appendChild(document.createTextNode(' B: '));
    colorContainer.appendChild(bInput);
    
    div.appendChild(labelEl);
    div.appendChild(colorContainer);
    div.appendChild(preview);
    div.appendChild(display);
    container.appendChild(div);
    
    updateColor(); // Inicializar
    return { rInput, gInput, bInput };
  }

  // Função para criar controle de imagem
  function createImageControl(container, objectId) {
    const div = document.createElement('div');
    div.className = 'config-item image-control';
    
    // Input para caminho da imagem
    const pathLabel = document.createElement('label');
    pathLabel.textContent = 'Caminho da Imagem/SVG:';
    
    const pathInput = document.createElement('input');
    pathInput.type = 'text';
    pathInput.placeholder = 'Ex: imagem.jpg, icon.svg, https://...';
    pathInput.className = 'image-path-input';
    
    // Select para modo de ajuste
    const modeLabel = document.createElement('label');
    modeLabel.textContent = 'Modo de Ajuste:';
    
    const modeSelect = document.createElement('select');
    modeSelect.className = 'image-mode-select';
    
    const modes = [
      { value: 'cover', text: '🔳 Cover - Preenche todo o objeto (pode cortar)' },
      { value: 'contain', text: '📦 Contain - Mostra imagem completa (pode sobrar espaço)' },
      { value: 'fill', text: '🎯 Fill - Estica para preencher exato' },
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
    preview.className = 'image-preview';
    preview.innerHTML = '<span>📷 Preview aparecerá aqui</span>';
    
    // Botão para limpar
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = '🗑️ Limpar';
    clearBtn.className = 'clear-image-btn';
    
    // Função para atualizar imagem
    function updateImage() {
      const path = pathInput.value.trim();
      const mode = modeSelect.value;
      
      if (path) {
        // Atualizar CSS
        updateCSSVariable(`bg-${objectId}`, `url('${path}')`);
        updateCSSVariable(`bg-${objectId}-size`, mode);
        
        // Atualizar preview
        preview.innerHTML = `<img src="${path}" alt="Preview" style="max-width: 100%; max-height: 60px; object-fit: ${mode};">`;
        preview.style.backgroundImage = `url('${path}')`;
        preview.style.backgroundSize = mode;
        preview.style.backgroundPosition = 'center';
        preview.style.backgroundRepeat = 'no-repeat';
      } else {
        // Limpar
        updateCSSVariable(`bg-${objectId}`, `url('')`);
        preview.innerHTML = '<span>📷 Preview aparecerá aqui</span>';
        preview.style.backgroundImage = 'none';
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
    div.appendChild(pathLabel);
    div.appendChild(pathInput);
    div.appendChild(modeLabel);
    div.appendChild(modeSelect);
    div.appendChild(preview);
    div.appendChild(clearBtn);
    
    container.appendChild(div);
    
    return { pathInput, modeSelect, preview };
  }
  
  // Função para atualizar valores CSS
  function updateCSSVariable(name, value, unit = '') {
    document.documentElement.style.setProperty(`--${name}`, value + unit);
  }

  // === SISTEMA DE PRESETS ===
  function createPresetsSystem(container) {
    // Seção de controles
    const controlsSection = document.createElement('div');
    controlsSection.className = 'preset-controls';

    const title = document.createElement('h4');
    title.textContent = '💾 Gerenciar Presets';
    title.style.margin = '0 0 8px 0';
    title.style.fontSize = '14px';
    title.style.color = '#ffd700';

    // Seção para salvar novo preset
    const saveSection = document.createElement('div');
    saveSection.className = 'preset-save-section';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'preset-name-input';
    nameInput.placeholder = 'Nome do preset...';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'preset-save-btn';
    saveBtn.textContent = '💾 Salvar';

    saveSection.appendChild(nameInput);
    saveSection.appendChild(saveBtn);

    // Seção para exportar/importar
    const importExportSection = document.createElement('div');
    importExportSection.className = 'preset-save-section';
    importExportSection.style.marginTop = '8px';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'preset-save-btn';
    exportBtn.style.background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
    exportBtn.textContent = '📤 Exportar';
    exportBtn.title = 'Exportar todos os presets';

    const importBtn = document.createElement('button');
    importBtn.className = 'preset-save-btn';
    importBtn.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
    importBtn.textContent = '📥 Importar';
    importBtn.title = 'Importar presets de arquivo';

    // Input file oculto para importar
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';

    importExportSection.appendChild(exportBtn);
    importExportSection.appendChild(importBtn);
    importExportSection.appendChild(fileInput);

    controlsSection.appendChild(title);
    controlsSection.appendChild(saveSection);
    controlsSection.appendChild(importExportSection);

    // Galeria de presets
    const gallery = document.createElement('div');
    gallery.className = 'presets-gallery';
    gallery.id = 'presets-gallery';

    container.appendChild(controlsSection);
    container.appendChild(gallery);

    // Event listener para salvar preset
    saveBtn.addEventListener('click', async function() {
      const name = nameInput.value.trim();
      if (name) {
        await savePreset(name);
        nameInput.value = '';
        loadPresetsGallery();
      } else {
        alert('Por favor, digite um nome para o preset.');
      }
    });

    // Event listener para exportar presets
    exportBtn.addEventListener('click', function() {
      exportPresets();
    });

    // Event listener para importar presets
    importBtn.addEventListener('click', function() {
      fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        importPresets(file);
        fileInput.value = ''; // Limpar input
      }
    });

    // Carregar presets existentes
    loadPresetsGallery();
  }

  // Função para capturar screenshot do canvas (versão simplificada)
  function captureCanvasScreenshot() {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 160;
      canvas.height = 120;

      // Criar um preview baseado nas configurações atuais
      const settings = getCurrentSettings();

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 160, 120);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 160, 120);

      // Simular objetos baseado nas configurações
      const objectPositions = [
        [20, 20], [60, 20], [100, 20], [140, 20], // Top row
        [20, 50], [60, 50], [100, 50], [140, 50], // Middle row
        [20, 80], [60, 80], [100, 80], [140, 80]  // Bottom row
      ];

      objectPositions.forEach((pos, index) => {
        if (index < 12) { // Limitar a 12 objetos para o preview
          const objectId = objectIds[index];
          const isVisible = settings[`visibility-${objectId}`] !== false;

          if (isVisible) {
            // Cor do objeto baseada nas configurações
            const colorKey = `color-${index + 1}-rgb`;
            let color = 'rgba(255, 255, 255, 0.8)';

            if (settings[colorKey]) {
              color = `rgb(${settings[colorKey]})`;
            }

            ctx.fillStyle = color;
            ctx.fillRect(pos[0] - 8, pos[1] - 6, 16, 12);

            // Número do objeto
            ctx.fillStyle = '#000';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText((index + 1).toString(), pos[0], pos[1] + 2);
          }
        }
      });

      // Timestamp no canto
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '8px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(new Date().toLocaleTimeString(), 155, 115);

      resolve(canvas.toDataURL('image/png'));
    });
  }

  // Função para coletar todas as configurações atuais
  function getCurrentSettings() {
    const settings = {};

    // Coletar valores de todos os inputs
    document.querySelectorAll('input[type="range"], input[type="checkbox"], input[type="text"], input[type="number"], select').forEach(input => {
      if (input.id && !input.classList.contains('range-input') && !input.classList.contains('preset-name-input')) {
        if (input.type === 'checkbox') {
          settings[input.id] = input.checked;
        } else {
          settings[input.id] = input.value;
        }
      }
    });

    return settings;
  }

  // Função para aplicar configurações
  function applySettings(settings) {
    Object.keys(settings).forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = settings[id];
        } else {
          input.value = settings[id];
        }

        // Disparar evento para atualizar CSS
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('change'));
      }
    });
  }

  // Função para salvar preset
  async function savePreset(name) {
    const settings = getCurrentSettings();
    const screenshot = await captureCanvasScreenshot();

    const preset = {
      name: name,
      settings: settings,
      screenshot: screenshot,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Salvar no localStorage
    const presets = getPresets();
    presets[preset.timestamp] = preset;
    localStorage.setItem('gui-editor-presets', JSON.stringify(presets));

    console.log('Preset salvo:', name);
  }

  // Função para obter presets salvos
  function getPresets() {
    const saved = localStorage.getItem('gui-editor-presets');
    return saved ? JSON.parse(saved) : {};
  }

  // Função para carregar galeria de presets
  function loadPresetsGallery() {
    const gallery = document.getElementById('presets-gallery');
    if (!gallery) return;

    gallery.innerHTML = '';
    const presets = getPresets();

    if (Object.keys(presets).length === 0) {
      gallery.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #aaa; font-size: 11px; padding: 20px;">Nenhum preset salvo ainda</div>';
      return;
    }

    // Ordenar por data (mais recente primeiro)
    const sortedPresets = Object.values(presets).sort((a, b) => b.timestamp - a.timestamp);

    sortedPresets.forEach(preset => {
      const item = createPresetItem(preset);
      gallery.appendChild(item);
    });
  }

  // Função para criar item de preset na galeria
  function createPresetItem(preset) {
    const item = document.createElement('div');
    item.className = 'preset-item';

    // Preview
    const preview = document.createElement('div');
    preview.className = 'preset-preview';

    const img = document.createElement('img');
    img.src = preset.screenshot;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    preview.appendChild(img);

    // Nome
    const name = document.createElement('div');
    name.className = 'preset-name';
    name.textContent = preset.name;

    // Data
    const date = document.createElement('div');
    date.className = 'preset-date';
    date.textContent = new Date(preset.date).toLocaleDateString('pt-BR');

    // Ações
    const actions = document.createElement('div');
    actions.className = 'preset-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'preset-action-btn preset-delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = 'Deletar preset';

    const renameBtn = document.createElement('button');
    renameBtn.className = 'preset-action-btn preset-rename-btn';
    renameBtn.innerHTML = '✎';
    renameBtn.title = 'Renomear preset';

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    // Event listeners
    item.addEventListener('click', function(e) {
      if (!e.target.classList.contains('preset-action-btn')) {
        loadPreset(preset);
      }
    });

    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm(`Deletar preset "${preset.name}"?`)) {
        deletePreset(preset.timestamp);
        loadPresetsGallery();
      }
    });

    renameBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const newName = prompt('Novo nome:', preset.name);
      if (newName && newName.trim()) {
        renamePreset(preset.timestamp, newName.trim());
        loadPresetsGallery();
      }
    });

    // Montar item
    item.appendChild(preview);
    item.appendChild(name);
    item.appendChild(date);
    item.appendChild(actions);

    return item;
  }

  // Função para carregar preset
  function loadPreset(preset) {
    applySettings(preset.settings);
    console.log('Preset carregado:', preset.name);
  }

  // Função para deletar preset
  function deletePreset(timestamp) {
    const presets = getPresets();
    delete presets[timestamp];
    localStorage.setItem('gui-editor-presets', JSON.stringify(presets));
  }

  // Função para renomear preset
  function renamePreset(timestamp, newName) {
    const presets = getPresets();
    if (presets[timestamp]) {
      presets[timestamp].name = newName;
      localStorage.setItem('gui-editor-presets', JSON.stringify(presets));
    }
  }

  // Função para exportar presets
  function exportPresets() {
    const presets = getPresets();

    if (Object.keys(presets).length === 0) {
      alert('Nenhum preset para exportar.');
      return;
    }

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      presets: presets
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `gui-editor-presets-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    console.log('Presets exportados:', Object.keys(presets).length);
  }

  // Função para importar presets
  function importPresets(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      try {
        const importData = JSON.parse(e.target.result);

        // Validar estrutura do arquivo
        if (!importData.presets || typeof importData.presets !== 'object') {
          throw new Error('Formato de arquivo inválido');
        }

        const currentPresets = getPresets();
        let importedCount = 0;
        let skippedCount = 0;

        // Importar presets
        Object.values(importData.presets).forEach(preset => {
          if (preset.name && preset.settings && preset.timestamp) {
            // Verificar se já existe um preset com o mesmo nome
            const existingPreset = Object.values(currentPresets).find(p => p.name === preset.name);

            if (existingPreset) {
              // Perguntar se quer sobrescrever
              if (confirm(`Preset "${preset.name}" já existe. Sobrescrever?`)) {
                // Remover o existente
                delete currentPresets[existingPreset.timestamp];
                // Adicionar o novo
                currentPresets[preset.timestamp] = preset;
                importedCount++;
              } else {
                skippedCount++;
              }
            } else {
              // Adicionar novo preset
              currentPresets[preset.timestamp] = preset;
              importedCount++;
            }
          }
        });

        // Salvar presets atualizados
        localStorage.setItem('gui-editor-presets', JSON.stringify(currentPresets));

        // Recarregar galeria
        loadPresetsGallery();

        // Mostrar resultado
        alert(`Importação concluída!\nImportados: ${importedCount}\nIgnorados: ${skippedCount}`);

      } catch (error) {
        alert('Erro ao importar presets: ' + error.message);
        console.error('Erro na importação:', error);
      }
    };

    reader.readAsText(file);
  }
  
  // Limpar conteúdo existente e recriar todos os controles
  const globalContainer = document.getElementById('global-controls-container');
  const effectsContainer = document.getElementById('effects-controls-container');
  const objectsContainer = document.getElementById('objects-controls-container');
  const advancedContainer = document.getElementById('advanced-controls-container');

  // Adicionar dica sobre wheel scroll
  const wheelTip = document.createElement('div');
  wheelTip.className = 'wheel-tip';
  wheelTip.innerHTML = '🖱️ Use a roda do mouse nos sliders<br>Shift = 10x mais rápido | Ctrl = 10x mais lento';
  globalContainer.appendChild(wheelTip);

  // === CONFIGURAÇÕES PRINCIPAIS ===
  const mainGroup = document.createElement('div');
  mainGroup.className = 'config-group';
  mainGroup.innerHTML = '<h4>🎯 Configurações Principais</h4>';
  globalContainer.appendChild(mainGroup);
  
  createControl(mainGroup, 'Margem do Container (%)', 'container-margin', 'range', 0, 10, 0.5, 3, '', 'container-margin-percent');
  createControl(mainGroup, 'Borda do Container (%)', 'container-border', 'range', 0.5, 3, 0.1, 1, '', 'container-border-percent');
  createControl(mainGroup, 'Tamanho Mínimo de Objeto (px)', 'min-object-size', 'range', 10, 50, 1, 25, 'px', 'min-object-size-px');
  
  // === VALORES MÍNIMOS ===
  const minGroup = document.createElement('div');
  minGroup.className = 'config-group';
  minGroup.innerHTML = '<h4>🔒 Valores Mínimos</h4>';
  globalContainer.appendChild(minGroup);
  
  createControl(minGroup, 'Borda Mínima (px)', 'min-border', 'range', 0, 5, 0.5, 1, 'px', 'min-border');
  createControl(minGroup, 'Raio de Borda Mínimo (px)', 'min-border-radius', 'range', 0, 10, 1, 0, 'px', 'min-border-radius');
  createControl(minGroup, 'Tamanho Mínimo de Fonte (px)', 'min-font-size', 'range', 6, 16, 1, 8, 'px', 'min-font-size');
  createControl(minGroup, 'Sombra Mínima (px)', 'min-shadow', 'range', 0, 10, 1, 2, 'px', 'min-shadow');

  // === EFEITO GLASSMORPHISM ===
  const glassGroup = document.createElement('div');
  glassGroup.className = 'config-group';
  glassGroup.innerHTML = '<h4>🔮 Efeito Glassmorphism</h4>';
  effectsContainer.appendChild(glassGroup);

  createControl(glassGroup, 'Opacidade do Fundo', 'bg-alpha', 'range', 0, 1, 0.05, 0.25, '', 'object-bg-alpha');
  createControl(glassGroup, 'Desfoque (px)', 'backdrop-blur', 'range', 0, 20, 1, 10, 'px', 'object-backdrop-blur-px');
  createControl(glassGroup, 'Saturação (%)', 'backdrop-saturate', 'range', 50, 200, 10, 120, '%', 'object-backdrop-saturate-percent');
  createControl(glassGroup, 'Brilho (%)', 'backdrop-brightness', 'range', 50, 150, 5, 80, '%', 'object-backdrop-brightness-percent');

  // === ESTILOS GLOBAIS DOS OBJETOS ===
  const styleGroup = document.createElement('div');
  styleGroup.className = 'config-group';
  styleGroup.innerHTML = '<h4>✨ Estilos Globais dos Objetos</h4>';
  effectsContainer.appendChild(styleGroup);

  createControl(styleGroup, 'Fator Raio de Borda', 'border-radius-factor', 'range', 0, 1, 0.05, 0.2, '', 'object-border-radius-factor');
  createControl(styleGroup, 'Fator Largura da Borda', 'border-width-factor', 'range', 0, 0.2, 0.01, 0.05, '', 'object-border-width-factor');
  createControl(styleGroup, 'Fator Tamanho da Sombra', 'shadow-size-factor', 'range', 0, 0.2, 0.01, 0.08, '', 'object-shadow-size-factor');
  createControl(styleGroup, 'Fator Escala no Hover', 'hover-scale-factor', 'range', 1, 2, 0.1, 1.1, '', 'object-hover-scale-factor');
  createControl(styleGroup, 'Fator Brilho no Hover', 'hover-brightness-factor', 'range', 1, 2, 0.1, 1.2, '', 'object-hover-brightness-factor');

  // === CONFIGURAÇÕES INDIVIDUAIS DOS OBJETOS (1 a 15) ===
  objectIds.forEach((id, index) => {
    const objectNum = index + 1;
    const objectName = objectNames[index];
    const defaultColor = defaultColors[index];

    // Criar grupo principal para o objeto
    const objectGroup = document.createElement('div');
    objectGroup.className = 'config-group object-group';
    objectGroup.innerHTML = `<h4>🎯 Objeto ${objectNum} - ${objectName} (${id})</h4>`;
    objectsContainer.appendChild(objectGroup);

    // Visibilidade
    createCheckboxControl(objectGroup, '👁️ Visível', `visibility-${id}`, true, `visibility-${id}`);

    // Tamanho e Orientação
    const sizeGroup = document.createElement('div');
    sizeGroup.className = 'config-subgroup';
    sizeGroup.innerHTML = '<h5>📏 Tamanho e Orientação</h5>';
    objectGroup.appendChild(sizeGroup);

    createControl(sizeGroup, 'Tamanho (% viewport)', `${id}-size`, 'range', 5, 30, 1, 15, '', `object-${id}-size`);
    createCheckboxControl(sizeGroup, '🖼️ Paisagem (desmarque para Retrato)', `${id}-landscape`, true, `object-${id}-orientation-is-landscape`, '1', '0');

    // Cor do Objeto
    const colorGroup = document.createElement('div');
    colorGroup.className = 'config-subgroup';
    colorGroup.innerHTML = '<h5>🎨 Cor do Objeto</h5>';
    objectGroup.appendChild(colorGroup);

    createColorControl(colorGroup, `Cor RGB`, `color-${objectNum}`, defaultColor[0], defaultColor[1], defaultColor[2], `color-${objectNum}-rgb`);

    // Imagem/SVG do Objeto
    const imageGroup = document.createElement('div');
    imageGroup.className = 'config-subgroup';
    imageGroup.innerHTML = '<h5>🖼️ Imagem/SVG do Objeto</h5>';
    objectGroup.appendChild(imageGroup);

    createImageControl(imageGroup, id);
  });

  // === SISTEMA DE PRESETS ===
  const presetsContainer = document.getElementById('presets-controls-container');
  createPresetsSystem(presetsContainer);

  // === CONFIGURAÇÕES AVANÇADAS ===
  const advancedGroup = document.createElement('div');
  advancedGroup.className = 'config-group';
  advancedGroup.innerHTML = '<h4>🔧 Configurações Avançadas</h4><p style="color: #aaa; font-size: 12px;">Funcionalidades em desenvolvimento...</p>';
  advancedContainer.appendChild(advancedGroup);

  // === CONTROLES DAS TABS ===
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.dataset.tab;

      // Remover classe active de todos os botões
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Adicionar classe active ao botão clicado
      this.classList.add('active');

      // Esconder todos os conteúdos
      tabContents.forEach(content => content.classList.remove('active'));
      // Mostrar o conteúdo da tab selecionada
      document.getElementById(`tab-${tabName}`).classList.add('active');
    });
  });

  // === CONTROLES DO PAINEL ===
  // Toggle do painel
  toggleBtn.addEventListener('click', function() {
    guiContent.style.display =
      guiContent.style.display === 'none' ? 'block' : 'none';
  });

  // === FUNCIONALIDADE DE DRAG ===
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  // Função para iniciar o drag
  function startDrag(e) {
    isDragging = true;
    const rect = panel.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    // Adicionar classe de dragging para cursor
    document.body.style.cursor = 'grabbing';
    panel.style.cursor = 'grabbing';

    // Prevenir seleção de texto
    e.preventDefault();
  }

  // Função para mover o painel
  function drag(e) {
    if (!isDragging) return;

    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;

    // Limitar às bordas da janela
    const maxX = window.innerWidth - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;

    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));

    panel.style.left = boundedX + 'px';
    panel.style.top = boundedY + 'px';
  }

  // Função para parar o drag
  function stopDrag() {
    if (!isDragging) return;

    isDragging = false;
    document.body.style.cursor = '';
    panel.style.cursor = '';
  }

  // Event listeners para drag (mouse)
  const panelHeader = document.querySelector('.panel-header');

  panelHeader.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);

  // Event listeners para drag (touch)
  panelHeader.addEventListener('touchstart', function(e) {
    const touch = e.touches[0];
    startDrag({
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => e.preventDefault()
    });
  });

  document.addEventListener('touchmove', function(e) {
    if (isDragging) {
      const touch = e.touches[0];
      drag({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      e.preventDefault();
    }
  });

  document.addEventListener('touchend', stopDrag);

  // Prevenir drag quando clicar no botão toggle
  toggleBtn.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });

  toggleBtn.addEventListener('touchstart', function(e) {
    e.stopPropagation();
  });

  // === SALVAR/CARREGAR POSIÇÃO ===
  // Carregar posição salva
  function loadPanelPosition() {
    const savedPosition = localStorage.getItem('gui-panel-position');
    if (savedPosition) {
      const { x, y } = JSON.parse(savedPosition);

      // Verificar se a posição ainda é válida (janela pode ter mudado de tamanho)
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;

      const boundedX = Math.max(0, Math.min(x, maxX));
      const boundedY = Math.max(0, Math.min(y, maxY));

      panel.style.left = boundedX + 'px';
      panel.style.top = boundedY + 'px';
    }
  }

  // Salvar posição
  function savePanelPosition() {
    const rect = panel.getBoundingClientRect();
    const position = {
      x: rect.left,
      y: rect.top
    };
    localStorage.setItem('gui-panel-position', JSON.stringify(position));
  }

  // Atualizar função stopDrag para salvar posição
  const originalStopDrag = stopDrag;
  stopDrag = function() {
    originalStopDrag();
    if (isDragging) {
      savePanelPosition();
    }
  };

  // Carregar posição ao inicializar
  setTimeout(loadPanelPosition, 100);

  // Salvar posição quando a janela for redimensionada
  window.addEventListener('resize', function() {
    setTimeout(loadPanelPosition, 100);
  });

  // Inicializar o painel
  guiContent.style.display = 'block';
});
