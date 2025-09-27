# LUNA VISTA LOJA - Site de Catálogo de Roupas

## Descrição

Site completo de catálogo de roupas para a marca **LUNA VISTA LOJA**, desenvolvido com HTML, CSS e JavaScript puros. O site apresenta um design elegante baseado na paleta de cores da logomarca fornecida e inclui integração completa com WhatsApp para facilitar as vendas.

## Estrutura do Projeto

```
vista-loja-luna-2/
├── index.html              # Página principal
├── css/
│   └── sections/
│       ├── base.css        # Estilos base e variáveis
│       ├── header.css      # Estilos do cabeçalho
│       ├── main.css        # Estilos da seção principal
│       ├── catalog.css     # Estilos do catálogo
│       ├── about.css       # Estilos da seção sobre
│       ├── contact.css     # Estilos da seção contato
│       ├── footer.css      # Estilos do rodapé
│       ├── modal.css       # Estilos do modal de produtos
│       ├── drawer.css      # Estilos do drawer de adição
│       ├── animations.css  # Animações e transições
│       └── responsive.css  # Estilos responsivos
├── js/
│   ├── config.js           # Configurações globais
│   ├── utils.js            # Funções utilitárias
│   ├── dom.js              # Manipulação do DOM
│   ├── products.js         # Gerenciamento de produtos
│   ├── modal.js            # Funcionalidades do modal
│   ├── whatsapp.js         # Integração WhatsApp
│   ├── animations.js       # Animações JavaScript
│   ├── load-products.js    # Carregamento de produtos
│   ├── drawer.js           # Funcionalidades do drawer
│   └── main.js             # Script principal
├── img/
│   ├── logo.png            # Logomarca da empresa
│   └── bg.png              # Imagem de fundo
└── README.md               # Este arquivo
```

## Características Principais

### Design e Visual
- **Paleta de cores** baseada na logomarca (cinza, preto e branco)
- **Design responsivo** que se adapta a diferentes dispositivos
- **Animações suaves** e efeitos de hover
- **Tipografia moderna** com fonte Poppins
- **Elementos visuais** inspirados na borboleta da logomarca

### Funcionalidades
- **Catálogo de produtos** com filtros por categoria
- **Modal de visualização** rápida dos produtos
- **Seleção de tamanhos** (P, M, G, GG)
- **Integração com WhatsApp** para pedidos
- **Formulário de contato** que redireciona para WhatsApp
- **Menu responsivo** para dispositivos móveis
- **Navegação suave** entre seções
- **Botão flutuante** para adicionar novos produtos
- **Drawer de adição** com formulário completo
- **Persistência de dados** no localStorage

### Seções do Site
1. **Header** - Navegação principal com logo
2. **Hero** - Apresentação da marca com call-to-action
3. **Catálogo** - Grid de produtos com filtros
4. **Sobre** - Informações sobre a empresa
5. **Contato** - Formulário e informações de contato
6. **Footer** - Links e redes sociais

## Configuração do WhatsApp

Para personalizar o número do WhatsApp, edite o arquivo `js/script.js`:

```javascript
const CONFIG = {
    whatsappNumber: '5511999999999', // Substitua pelo número real
    businessName: 'LUNA VISTA LOJA'
};
```

**Formato do número:** Use o código do país + DDD + número (sem espaços ou caracteres especiais)
- Exemplo: 5511999999999 (Brasil, São Paulo, 99999-9999)

## Personalização de Produtos

### Adicionando Produtos via Interface

O site agora inclui um **botão flutuante** no canto inferior direito que permite adicionar novos produtos diretamente pela interface:

1. **Clique no botão flutuante** (+)
2. **Preencha o formulário** com:
   - Nome do produto
   - Preço (formato numérico)
   - Imagem (URL ou upload local)
   - Descrição
   - Categoria (vestidos, blusas, calças, acessórios)
3. **Clique em "Adicionar Produto"**

Os produtos adicionados são salvos automaticamente no localStorage e aparecem imediatamente no catálogo.

### Adicionando Produtos via Código

Os produtos também podem ser definidos no arquivo `js/script.js` no objeto `PRODUCTS_DATA`:

```javascript
const PRODUCTS_DATA = {
    'produto-id': {
        name: 'Nome do Produto',
        price: 99.90,
        image: 'URL_da_imagem',
        description: 'Descrição detalhada do produto'
    }
};
```

## Paleta de Cores Utilizada

Baseada na análise da logomarca fornecida:

- **Primária:** `#2c2c2c` (Preto da logomarca)
- **Secundária:** `#b8b8b8` (Cinza claro)
- **Accent:** `#f5f5f5` (Branco suave)
- **Texto escuro:** `#2c2c2c`
- **Texto claro:** `#666666`
- **Fundo claro:** `#fafafa`

## Responsividade

O site é totalmente responsivo e se adapta a:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (até 767px)

### Breakpoints principais:
- `768px` - Tablet e mobile
- `480px` - Mobile pequeno

## Funcionalidades JavaScript

### Principais recursos implementados:
- **Filtros de produto** por categoria
- **Modal de visualização** com detalhes
- **Formulário de contato** com validação
- **Menu mobile** responsivo
- **Scroll suave** entre seções
- **Animações de entrada** nos elementos
- **Integração WhatsApp** automática

### Funções principais:
- `openProductModal()` - Abre modal do produto
- `addToCart()` - Adiciona produto ao "carrinho" (WhatsApp)
- `sendWhatsAppMessage()` - Envia mensagem para WhatsApp
- `filterProducts()` - Filtra produtos por categoria

## Como Usar

1. **Abrir o site:** Abra o arquivo `index.html` em qualquer navegador
2. **Navegar:** Use o menu superior ou role a página
3. **Filtrar produtos:** Clique nos botões de categoria no catálogo
4. **Ver detalhes:** Clique no ícone de olho nos produtos
5. **Fazer pedido:** Clique em "Solicitar no WhatsApp" em qualquer produto
6. **Contato:** Preencha o formulário na seção de contato

## Integração WhatsApp

### Produtos individuais:
Ao clicar em "Solicitar no WhatsApp", uma mensagem é gerada automaticamente com:
- Nome do produto
- Preço
- Tamanho selecionado (se aplicável)
- Mensagem personalizada

### Formulário de contato:
Ao enviar o formulário, uma mensagem é criada com:
- Nome do cliente
- Telefone
- Mensagem personalizada
- Identificação da empresa

## Otimizações Implementadas

- **Lazy loading** para imagens
- **Debounce** para eventos de scroll
- **Animações CSS** otimizadas
- **Código JavaScript** modular
- **CSS** organizado com variáveis
- **Imagens** otimizadas do Unsplash

## Compatibilidade

- **Navegadores:** Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos:** Desktop, tablet, smartphone
- **Sistemas:** Windows, macOS, Linux, iOS, Android

## Manutenção

### Para atualizar produtos:
1. Edite o objeto `PRODUCTS_DATA` em `js/script.js`
2. Adicione as imagens na pasta `img/` se necessário
3. Atualize o HTML se precisar de novas categorias

### Para alterar cores:
1. Modifique as variáveis CSS em `:root` no arquivo `css/style.css`
2. As cores se propagarão automaticamente por todo o site

### Para adicionar seções:
1. Adicione o HTML na estrutura desejada
2. Crie os estilos CSS correspondentes
3. Atualize a navegação no menu

## Suporte

Para dúvidas sobre implementação ou personalização, consulte os comentários no código ou entre em contato através dos canais oficiais da LUNA VISTA LOJA.

---

**Desenvolvido com ❤️ para LUNA VISTA LOJA**
