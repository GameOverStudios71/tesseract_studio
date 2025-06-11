# GUI Layout Interface

Uma interface de usuário simplificada que replica a estrutura do aplicativo principal, mas apenas com os painéis e interface visual, sem funcionalidades de adicionar elementos. Agora inclui o sistema de grid com 15 objetos posicionados ao redor de uma área central de conteúdo.

## Características

### 🎨 Interface Limpa
- Design moderno com suporte a tema escuro/claro
- Layout responsivo com painéis redimensionáveis
- Transições suaves e efeitos visuais

### 📱 Painéis Redimensionáveis
- **Painel Esquerdo**: Componentes e Controles (300px padrão)
- **Painel Direito**: Propriedades (350px padrão)
- **Área Central**: Canvas principal
- Larguras mínimas e máximas configuradas
- Indicadores visuais durante redimensionamento

### 🔧 Controles de Painel
- Botões para mostrar/ocultar painéis
- Botão para resetar painéis ao tamanho padrão
- Indicador da largura atual da área do canvas

### 🌓 Tema Escuro/Claro
- Alternância automática baseada na preferência do sistema
- Botão manual para alternar temas
- Preferência salva no localStorage

### 🎯 Sistema de Grid Integrado
- 15 objetos coloridos posicionados ao redor da área central
- Sistema responsivo baseado em CSS Variables
- Objetos com diferentes tamanhos, orientações e proporções
- Efeitos hover e transições suaves
- Área central de conteúdo com informações do sistema

### 🚀 Botão Preview
- Abre a implementação original em nova janela
- Permite comparar a interface GUI com a versão completa
- Acesso direto ao sistema de grid funcional

## Estrutura dos Arquivos

```
GUI/
├── index.html          # Estrutura HTML principal
├── script.js           # Lógica JavaScript
├── grid-styles.css     # Estilos do sistema de grid
└── README.md          # Este arquivo
```

## Como Usar

1. **Abrir a Interface**
   ```bash
   # Navegue até o diretório GUI
   cd GUI
   
   # Abra o index.html em um navegador
   # Ou use um servidor local como:
   python -m http.server 8000
   # Então acesse: http://localhost:8000
   ```

2. **Interagir com os Painéis**
   - **Redimensionar**: Arraste as bordas dos painéis
   - **Ocultar/Mostrar**: Use os botões "Toggle Left Panel" e "Toggle Right Panel"
   - **Resetar**: Clique em "Reset Panels" para voltar ao tamanho padrão

3. **Alternar Tema**
   - Clique no botão 🌙/☀️ no canto superior direito
   - O tema será salvo automaticamente

## Funcionalidades Implementadas

### ✅ Painéis Redimensionáveis
- Arrastar para redimensionar
- Limites mínimos e máximos
- Indicadores visuais durante redimensionamento
- Cálculo automático da largura do canvas

### ✅ Sistema de Abas
- Aba "Components" com exemplo de componente
- Aba "Controls" com exemplos de controles
- Navegação por clique

### ✅ Painel de Propriedades
- Seções organizadas (Element Information, Styling, Spacing)
- Campos de entrada para propriedades
- Layout responsivo

### ✅ Tema Escuro/Claro
- Detecção automática da preferência do sistema
- Alternância manual
- Persistência da escolha

### ✅ Efeitos Visuais
- Hover effects nos cards
- Feedback visual nos botões
- Transições suaves
- Indicadores de redimensionamento

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **Tailwind CSS**: Estilização via CDN
- **JavaScript Vanilla**: Lógica de interação
- **CSS Custom Properties**: Variáveis para temas

## Personalização

### Modificar Tamanhos dos Painéis
No arquivo `script.js`, altere as propriedades:

```javascript
this.panels = {
    left: {
        width: 300,        // Largura inicial
        minWidth: 200,     // Largura mínima
        maxWidth: 500,     // Largura máxima
    },
    right: {
        width: 350,        // Largura inicial
        minWidth: 250,     // Largura mínima
        maxWidth: 600,     // Largura máxima
    }
};
```

### Adicionar Novos Componentes
No arquivo `index.html`, adicione novos cards na seção `tab-components`:

```html
<div class="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
    <h4 class="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">Novo Componente</h4>
    <!-- Preview visual aqui -->
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Descrição do componente.</p>
</div>
```

### Modificar Cores do Tema
Edite as classes Tailwind no HTML ou adicione CSS customizado.

## Compatibilidade

- ✅ Chrome/Chromium 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Notas

- Esta é uma versão apenas visual/interface
- Não possui funcionalidades de criação ou edição de elementos
- Serve como base para desenvolvimento futuro
- Todos os dados são apenas demonstrativos
