document.addEventListener('DOMContentLoaded', function() {
  // Elementos do painel
  const panel = document.getElementById('config-panel');
  const toggleBtn = document.getElementById('toggle-panel');
  const configContent = document.getElementById('config-content');
  
  // Controles principais
  const containerMarginInput = document.getElementById('container-margin');
  const containerBorderInput = document.getElementById('container-border');
  const bgAlphaInput = document.getElementById('bg-alpha');
  const backdropBlurInput = document.getElementById('backdrop-blur');
  
  // Configuração de visibilidade
  const visibilityControls = document.getElementById('visibility-controls');
  
  // Lista de todos os objetos
  const objectIds = [
    'top-left', 'top-center-left', 'top-middle', 'top-center-right', 'top-right',
    'middle-left', 'center-left', 'middle-middle', 'center-right', 'middle-right',
    'bottom-left', 'bottom-center-left', 'bottom-middle', 'bottom-center-right', 'bottom-right'
  ];
  
  // Criar controles de visibilidade
  objectIds.forEach(id => {
    const div = document.createElement('div');
    div.className = 'config-item visibility-toggle';
    
    const label = document.createElement('label');
    label.htmlFor = `visibility-${id}`;
    label.textContent = id;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `visibility-${id}`;
    checkbox.checked = true;
    
    checkbox.addEventListener('change', function() {
      document.documentElement.style.setProperty(
        `--visibility-${id}`, 
        this.checked ? 'visible' : 'hidden'
      );
    });
    
    div.appendChild(checkbox);
    div.appendChild(label);
    visibilityControls.appendChild(div);
  });
  
  // Função para atualizar valores CSS
  function updateCSSVariable(name, value, unit = '') {
    document.documentElement.style.setProperty(`--${name}`, value + unit);
  }
  
  // Função para atualizar display de valor
  function updateValueDisplay(input) {
    const display = input.nextElementSibling;
    display.textContent = input.value;
  }
  
  // Configurar eventos para os controles
  containerMarginInput.addEventListener('input', function() {
    updateCSSVariable('container-margin-percent', this.value);
    updateValueDisplay(this);
  });
  
  containerBorderInput.addEventListener('input', function() {
    updateCSSVariable('container-border-percent', this.value);
    updateValueDisplay(this);
  });
  
  bgAlphaInput.addEventListener('input', function() {
    updateCSSVariable('object-bg-alpha', this.value);
    updateValueDisplay(this);
  });
  
  backdropBlurInput.addEventListener('input', function() {
    updateCSSVariable('object-backdrop-blur-px', this.value, 'px');
    updateValueDisplay(this);
  });
  
  // Toggle do painel
  toggleBtn.addEventListener('click', function() {
    configContent.style.display = 
      configContent.style.display === 'none' ? 'block' : 'none';
  });
  
  // Inicializar o painel
  configContent.style.display = 'none';
});

// Criar um proxy para monitorar mudanças nas variáveis CSS
const cssVarProxy = new Proxy({}, {
  set(target, property, value) {
    target[property] = value;
    document.documentElement.style.setProperty(`--${property}`, value);
    return true;
  }
});