# Estrutura CSS Modular

Este diretório contém os arquivos CSS organizados por seção para melhor manutenção e organização do código.

## Arquivos

### `base.css`
- Reset CSS
- Variáveis CSS (custom properties)
- Configurações gerais do body
- Estilos de scrollbar personalizada
- Animações de loading para imagens

### `header.css`
- Estilos do header fixo
- Navegação (navbar)
- Logo e links de navegação
- Menu hamburger para mobile

### `main.css`
- Seção principal (hero section)
- Imagem de fundo
- Título e subtítulo
- Botão CTA (Call to Action)

### `catalog.css`
- Seção de catálogo de produtos
- Filtros de categoria
- Grid de produtos
- Cards de produtos e overlays
- Botões de ação

### `about.css`
- Seção "Sobre nós"
- Features e características
- Decoração de borboleta
- Layout em grid

### `contact.css`
- Seção de contato
- Informações de contato
- Formulário de contato
- Validação de campos

### `footer.css`
- Rodapé do site
- Links e informações
- Redes sociais
- Logo do footer

### `modal.css`
- Modal de visualização de produtos
- Informações detalhadas do produto
- Seleção de tamanhos
- Botão de WhatsApp

### `animations.css`
- Keyframes para animações
- Transições suaves
- Efeitos de hover

### `responsive.css`
- Media queries para diferentes tamanhos de tela
- Layout responsivo para mobile e tablet
- Ajustes específicos para cada seção

## Ordem de Importação

Os arquivos devem ser importados na seguinte ordem no HTML:

1. `base.css` - Configurações base
2. `header.css` - Header e navegação
3. `main.css` - Seção principal
4. `catalog.css` - Catálogo de produtos
5. `about.css` - Seção sobre
6. `contact.css` - Seção de contato
7. `footer.css` - Rodapé
8. `modal.css` - Modais
9. `animations.css` - Animações
10. `responsive.css` - Responsividade (por último)

## Vantagens da Estrutura Modular

- **Manutenção mais fácil**: Cada seção tem seu próprio arquivo
- **Reutilização**: Estilos podem ser facilmente reutilizados
- **Performance**: Carregamento otimizado por seção
- **Colaboração**: Diferentes desenvolvedores podem trabalhar em seções diferentes
- **Debugging**: Mais fácil localizar e corrigir problemas específicos
