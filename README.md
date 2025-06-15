# Tesseract Studio - Editor de Interface Fluida em Camadas

Bem-vindo ao Tesseract Studio! Esta é uma ferramenta de edição visual baseada na web, projetada para criar e manipular interfaces de usuário em camadas com um alto grau de personalização. A aplicação é construída com TypeScript, Vite e Tailwind CSS, oferecendo uma experiência de desenvolvimento moderna e performática.

## Como Começar

Siga estas instruções para configurar e executar o projeto em seu ambiente de desenvolvimento local.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

### Instalação

1.  Clone o repositório para a sua máquina local.
2.  Navegue até o diretório do projeto:
    ```bash
    cd "Tesseract Studio (Separado)"
    ```
3.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

### Configuração de Variáveis de Ambiente

O projeto utiliza uma chave de API do Gemini. Para configurar, siga os passos:

1.  Crie um arquivo chamado `.env.local` na raiz do projeto.
2.  Adicione a seguinte linha ao arquivo, substituindo `SUA_CHAVE_API` pela sua chave real:
    ```
    GEMINI_API_KEY=SUA_CHAVE_API
    ```

### Executando o Projeto

Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

```bash
npm run dev
```

Isso iniciará a aplicação em modo de desenvolvimento com hot-reload. Abra o seu navegador e acesse o endereço fornecido no terminal (geralmente `http://localhost:5173`).

### Outros Scripts

-   **Build para produção:** `npm run build`
-   **Visualizar o build de produção:** `npm run preview`

---

## Estrutura do Projeto

Aqui está uma visão geral dos arquivos e diretórios mais importantes do projeto:

```
.
├── 📁 node_modules/       # Dependências do projeto
├── 📄 .env.local          # Arquivo para variáveis de ambiente (não versionado)
├── 📄 .gitignore          # Arquivos e pastas ignorados pelo Git
├── 📄 index.html          # Ponto de entrada HTML da aplicação
├── 📄 index.css           # Estilos CSS globais e personalizados
├── 📄 main.ts             # Ponto de entrada principal do TypeScript, onde a app é inicializada
├── 📄 package.json        # Metadados do projeto e dependências
├── 📄 tsconfig.json       # Configurações do compilador TypeScript
├── 📄 vite.config.ts      # Configurações do Vite (servidor de dev, build)
│
├── 📄 state.ts            # Gerenciamento de estado global da aplicação
├── 📄 types.ts            # Definições de tipos e interfaces TypeScript
├── 📄 domElements.ts      # Referências centralizadas para os elementos do DOM
├── 📄 utils.ts            # Funções utilitárias reutilizáveis
│
├── 📄 animationController.ts      # Lógica para controlar as animações
├── 📄 configPanelManager.ts       # Gerencia a interatividade do painel de configuração (arrastar, abas)
├── 📄 decorativeElementController.ts # Controla os elementos decorativos da cena
├── 📄 droppedControlController.ts # Lógica para os controles arrastáveis (botões, texto, etc.)
├── 📄 layer2Controller.ts         # Gerencia a camada principal de conteúdo (Layer 2)
├── 📄 presetsManager.ts           # Lógica para salvar e carregar presets de configurações
├── 📄 selectionManager.ts         # Gerencia a seleção de elementos na UI
├── 📄 styleUpdater.ts             # Aplica os estilos CSS aos elementos com base no estado
└── 📄 textColorsComponent.ts      # Lógica para o componente de cores de texto
```

---

## Arquitetura

O Tesseract Studio segue uma arquitetura modular e reativa, centrada em alguns conceitos-chave:

### 1. Estado Centralizado (`state.ts`)

Toda a configuração e o estado dinâmico da aplicação (como o elemento selecionado, configurações da "Layer 2", etc.) são armazenados em um único local. Isso facilita o rastreamento de dados e a depuração. Funções específicas são exportadas para modificar o estado de forma controlada.

### 2. Controladores (Arquivos `*Controller.ts`)

A lógica de negócio é dividida em "controladores", que são módulos TypeScript responsáveis por uma área específica da aplicação. Cada controlador geralmente:
-   Inicializa uma parte da UI.
-   Configura `event listeners` para interações do usuário.
-   Lê e atualiza o estado central (`state.ts`).
-   Chama o `styleUpdater.ts` para refletir as mudanças de estado na UI.

### 3. Tipos Estritos (`types.ts`)

O uso extensivo de TypeScript garante a segurança de tipos em todo o projeto. O arquivo `types.ts` define todas as interfaces e tipos de dados customizados (como `ElementConfig`, `Layer2Config`, etc.), tornando o código mais robusto e fácil de entender.

### 4. Inicialização (`main.ts`)

O `main.ts` é o ponto de partida que orquestra a inicialização da aplicação. Ele chama as funções de inicialização de cada controlador na ordem correta, garantindo que todos os elementos do DOM e `event listeners` estejam prontos.

---

## Como Desenvolver Novas Funcionalidades

Este guia mostra como adicionar um novo controle configurável à aplicação. Como exemplo, vamos criar um controle para a propriedade `border-radius` em um elemento decorativo.

### Passo 1: Adicionar o Campo no HTML

Abra o `index.html` e encontre a seção de propriedades de elementos decorativos (`id="decorative-element-props-section"`). Adicione um novo campo de `input` para o `border-radius`.

```html
<!-- Dentro de decorative-element-props-section -->
<div>
    <label for="config-el-border-radius" class="block text-xs text-slate-400 mb-0.5">Border Radius (vmin):</label>
    <input type="number" id="config-el-border-radius" step="0.1" class="form-input text-xs ...">
</div>
```

### Passo 2: Atualizar os Tipos

Vá para `types.ts` e adicione a nova propriedade `borderRadiusVmin` à interface `ElementConfig`.

```typescript
// Em types.ts, dentro de ElementConfig
export interface ElementConfig {
  // ... outras propriedades
  borderRadiusVmin: number;
  // ...
}
```

### Passo 3: Adicionar ao Estado Padrão

Em `decorativeElementController.ts`, encontre a função `initializeElementsConfig`. Adicione `borderRadiusVmin` à configuração padrão de um novo elemento.

```typescript
// Em decorativeElementController.ts, dentro de initializeElementsConfig
const defaultConfig: ElementConfig = {
    // ... outras propriedades
    borderRadiusVmin: 0,
    // ...
};
```

### Passo 4: Adicionar a Referência do DOM

Em `domElements.ts`, adicione a referência para o novo `input`.

```typescript
// Em domElements.ts
export let borderRadiusInput: HTMLInputElement | null;

// Dentro da função initializeDomElements()
borderRadiusInput = document.getElementById('config-el-border-radius') as HTMLInputElement;
```

### Passo 5: Implementar a Lógica no Controlador

Em `decorativeElementController.ts`:

1.  **Adicione o `event listener`:** Dentro de `setupDecorativeElementPanelListeners`, adicione um listener para o `input` do `border-radius`.
    ```typescript
    // Em setupDecorativeElementPanelListeners
    if (dom.borderRadiusInput) {
        dom.borderRadiusInput.addEventListener('input', () => {
            if (state.selectedElementId && state.elementsConfig[state.selectedElementId]) {
                const newRadius = parseFloat(dom.borderRadiusInput!.value);
                state.elementsConfig[state.selectedElementId].borderRadiusVmin = newRadius;
                applyStylesToDecorativeElement(state.selectedElementId);
            }
        });
    }
    ```

2.  **Atualize a UI:** Em `updateDecorativeElementPanel`, faça com que o `input` reflita o valor do estado atual quando um elemento é selecionado.
    ```typescript
    // Em updateDecorativeElementPanel
    if (dom.borderRadiusInput) {
        dom.borderRadiusInput.value = config.borderRadiusVmin.toString();
    }
    ```

### Passo 6: Aplicar o Estilo

Vá para `styleUpdater.ts` e, na função `applyStylesToDecorativeElement`, adicione a lógica para aplicar o `border-radius`.

```typescript
// Em styleUpdater.ts, dentro de applyStylesToDecorativeElement
if (config.borderRadiusVmin !== undefined) {
    element.style.borderRadius = `${config.borderRadiusVmin}vmin`;
}
```

E pronto! Você adicionou com sucesso um novo controle configurável. Este fluxo de trabalho pode ser adaptado para adicionar outras propriedades e funcionalidades ao Tesseract Studio.

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
