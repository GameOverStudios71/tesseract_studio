document.addEventListener('DOMContentLoaded', () => {
  const TesseractStudio = {
    panel: null,
    header: null,
    content: null,
    params: {},
    units: {},
    originalValues: {},

    init() {
      this.buildPanel();
      this.makeDraggable();
      this.collectCssVariables();
      this.populatePanel();
    },

    buildPanel() {
      const panelContainer = document.getElementById('tesseract-studio-panel');
      if (!panelContainer) return;

      this.panel = panelContainer;
      this.header = document.createElement('div');
      this.header.className = 'ts-header';
      this.header.textContent = 'Tesseract Studio';

      const resetButton = document.createElement('button');
      resetButton.textContent = 'Resetar';
      resetButton.className = 'ts-reset-button'; // Adicionar classe para estilo
      resetButton.onclick = () => this.resetAll();
      this.header.appendChild(resetButton);

      this.content = document.createElement('div');
      this.content.className = 'ts-content';

      this.panel.appendChild(this.header);
      this.panel.appendChild(this.content);
    },

    makeDraggable() {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      this.header.onmousedown = (e) => {
        if (e.target.tagName === 'BUTTON') return; // Ignora clique no botão
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        this.header.style.cursor = 'grabbing';
      };

      const elementDrag = (e) => {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        this.panel.style.top = (this.panel.offsetTop - pos2) + "px";
        this.panel.style.left = (this.panel.offsetLeft - pos1) + "px";
      };

      const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
        this.header.style.cursor = 'grab';
      };
    },

    collectCssVariables() {
      const styleSheets = Array.from(document.styleSheets).filter(
        (sheet) => sheet.href === null || sheet.href.startsWith(window.location.origin)
      );

      for (const sheet of styleSheets) {
        try {
            const rules = sheet.cssRules;
            for (const rule of rules) {
                if (rule.type === CSSRule.STYLE_RULE && rule.selectorText === ':root') {
                    const style = rule.style;
                    for (let i = 0; i < style.length; i++) {
                        const prop = style[i];
                        if (prop.startsWith('--')) {
                            const value = style.getPropertyValue(prop).trim();
                            this.params[prop] = value;
                        }
                    }
                }
            }
        } catch (e) {
            console.warn("Could not read CSS rules from stylesheet", sheet.href, e);
        }
      }
      
      const tempParams = { ...this.params };
      this.originalValues = {};

      for (const key in tempParams) {
        const value = tempParams[key];
        this.originalValues[key] = value; // Salva o valor original completo (ex: '10px', 'url(...)')

        if (key.includes('-rgb') || key.includes('-color')) {
            // Mantém como string
        } else if (key.includes('-bg-image')) {
            this.params[key] = value.replace(/url\(["']?|["']?\)/g, '');
        } else if (key.startsWith('--visibility-')) {
            this.params[key] = value === 'visible';
        } else {
            const num = parseFloat(value);
            if (!isNaN(num) && isFinite(num)) {
                this.params[key] = num;
                if (String(value).endsWith('px')) this.units[key] = 'px';
                else if (String(value).endsWith('%')) this.units[key] = '%';
            }
        }
      }
    },

    setCssVar(key, value) {
        document.documentElement.style.setProperty(key, value);
    },

    populatePanel() {
        const globalVars = {};
        const objectVars = {};

        // Definir nomes de objetos explicitamente para garantir a correspondência correta
        const objectNames = [
            'top-left', 'top-center-left', 'top-middle', 'top-center-right', 'top-right',
            'middle-left', 'center-left', 'middle-middle', 'center-right', 'middle-right',
            'bottom-left', 'bottom-center-left', 'bottom-middle', 'bottom-center-right', 'bottom-right'
        ];

        for (const key in this.params) {
            let matched = false;
            // Verifica se a chave pertence a um objeto
            for (const objName of objectNames) {
                const objectPrefix = `--object-${objName}-`;
                const visibilityPrefix = `--visibility-${objName}`;

                if (key.startsWith(objectPrefix)) {
                    const propName = key.substring(objectPrefix.length);
                    if (!objectVars[objName]) objectVars[objName] = {};
                    objectVars[objName][propName] = key;
                    matched = true;
                    break;
                }
                if (key === visibilityPrefix) {
                    if (!objectVars[objName]) objectVars[objName] = {};
                    objectVars[objName]['visibility'] = key;
                    matched = true;
                    break;
                }
            }

            // Se não pertence a nenhum objeto, é global
            if (!matched) {
                const propName = key.replace('--', '');
                globalVars[propName] = key;
            }
        }

        this.createFolder('Configurações Globais', globalVars, true);
        
        // Usar a ordem original dos nomes de objeto, que corresponde aos elementos no HTML
        objectNames.forEach((objName, idx) => {
            if (objectVars[objName]) {
                const displayName = objName.replace(/-/g, ' ');
                this.createFolder(`Objeto ${idx + 1}: ${displayName}`, objectVars[objName]);
            }
        });
    },

    createFolder(title, vars, isOpen = false) {
      const folder = document.createElement('div');
      folder.className = 'ts-folder';

      const header = document.createElement('div');
      header.className = 'ts-folder-header';
      header.textContent = title;

      const content = document.createElement('div');
      content.className = 'ts-folder-content';

      if (isOpen) {
          header.classList.add('open');
          content.classList.add('open');
          content.style.display = 'block';
      }

      header.onclick = () => {
        header.classList.toggle('open');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      };

      const sortedVarKeys = Object.keys(vars).sort();
      for (const prop of sortedVarKeys) {
        const varName = vars[prop];
        this.createControl(content, varName, prop);
      }

      folder.appendChild(header);
      folder.appendChild(content);
      this.content.appendChild(folder);
    },

    createControl(container, key, propName) {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'ts-control';

        const label = document.createElement('label');
        label.textContent = propName.replace(/-/g, ' ');
        label.title = propName;

        const inputContainer = document.createElement('div');
        inputContainer.className = 'ts-input-container';

        let input;

        if (key.includes('-rgb') || key.includes('-color')) {
            input = this.createInput('color', key);
        } else if (key.startsWith('--visibility-')) {
            input = this.createInput('checkbox', key);
        } else if (key.includes('-bg-image')) {
            input = this.createInput('text', key);
        } else if (this.units[key] === 'px' || this.units[key] === '%') {
            input = this.createInput('range', key);
        } else { // Unitless numbers (alpha, factor, etc)
            input = this.createInput('range', key, {min: 0, max: 2, step: 0.01});
        }

        inputContainer.appendChild(input);
        controlDiv.appendChild(label);
        controlDiv.appendChild(inputContainer);
        container.appendChild(controlDiv);
    },

    createInput(type, key, opts = {}) {
        const input = document.createElement('input');
        input.type = type;
        input.id = key;

        if (type === 'range') {
            input.min = opts.min ?? (this.units[key] === '%' ? 0 : 0);
            input.max = opts.max ?? (this.units[key] === '%' ? 100 : (key.includes('size') ? 300 : 100));
            input.step = opts.step ?? (this.units[key] === '%' ? 0.1 : 1);
            input.value = this.params[key];
            input.oninput = (e) => {
                this.params[key] = parseFloat(e.target.value);
                this.setCssVar(key, this.params[key] + (this.units[key] || ''));
            };
        } else if (type === 'color') {
            input.value = this.params[key];
            input.oninput = (e) => {
                this.params[key] = e.target.value;
                this.setCssVar(key, this.params[key]);
            };
        } else if (type === 'checkbox') {
            input.checked = this.params[key];
            input.onchange = (e) => {
                this.params[key] = e.target.checked;
                this.setCssVar(key, this.params[key] ? 'visible' : 'hidden');
            };
        } else if (type === 'text') {
            input.value = this.params[key];
            input.onchange = (e) => {
                this.params[key] = e.target.value;
                this.setCssVar(key, e.target.value ? `url('${e.target.value}')` : 'none');
            };
        }

        return input;
    },

    resetAll() {
        for (const key in this.originalValues) {
            this.setCssVar(key, this.originalValues[key]);
        }
        // Recarregar o painel para refletir os valores resetados
        this.content.innerHTML = '';
        this.collectCssVariables();
        this.populatePanel();
    }
  };

  TesseractStudio.init();
});
