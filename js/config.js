// Configurações globais da aplicação
const CONFIG = {
    whatsappNumber: '5511999999999', // Substitua pelo número real
    businessName: 'LUNA VISTA LOJA'
};

// Dados dos produtos
const PRODUCTS_DATA = [
    {
        id: 'vestido-floral-1',
        name: 'Vestido Floral Elegante 12312312',
        price: 14909999.90,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
        description: 'Vestido floral elegante confeccionado em tecido de alta qualidade. Perfeito para ocasiões especiais, combina sofisticação e feminilidade. Modelagem que valoriza a silhueta feminina.',
        category: 'vestidos'
    },
    {
        id: 'vestido-floral-2',
        name: 'Vestido Floral Elegante',
        price: 149.90,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
        description: 'Vestido floral elegante confeccionado em tecido de alta qualidade. Perfeito para ocasiões especiais, combina sofisticação e feminilidade. Modelagem que valoriza a silhueta feminina.',
        category: 'vestidos'
    },
    {
        id: 'vestido-midi',
        name: 'Vestido Midi Clássico',
        price: 189.90,
        image: 'https://images.unsplash.com/photo-1566479179817-c0b2b8b6e7e5?w=400&h=500&fit=crop',
        description: 'Vestido midi clássico e atemporal. Ideal para o dia a dia ou eventos formais. Tecido confortável e modelagem universal que se adapta a diferentes tipos de corpo.',
        category: 'vestidos'
    },
    {
        id: 'blusa-seda',
        name: 'Blusa de Seda Premium',
        price: 129.90,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
        description: 'Blusa confeccionada em seda premium, proporcionando máximo conforto e elegância. Peça versátil que pode ser usada em diversas ocasiões, do casual ao formal.',
        category: 'blusas'
    },
    {
        id: 'blusa-casual',
        name: 'Blusa Casual Confortável',
        price: 89.90,
        image: 'https://images.unsplash.com/photo-1564257577-0b8b5b0b8b0b?w=400&h=500&fit=crop',
        description: 'Blusa casual perfeita para o dia a dia. Tecido macio e respirável, ideal para quem busca conforto sem abrir mão do estilo. Combina com diversas peças do guarda-roupa.',
        category: 'blusas'
    },
    {
        id: 'calca-jeans',
        name: 'Calça Jeans Skinny',
        price: 159.90,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
        description: 'Calça jeans skinny com modelagem moderna e confortável. Jeans de alta qualidade com elastano para maior flexibilidade. Peça essencial no guarda-roupa feminino.',
        category: 'calcas'
    },
    {
        id: 'calca-social',
        name: 'Calça Social Elegante',
        price: 199.90,
        image: 'https://images.unsplash.com/photo-1506629905607-d5b8c8b5e8b5?w=400&h=500&fit=crop',
        description: 'Calça social elegante para ambientes profissionais e eventos formais. Tecido de alta qualidade com caimento perfeito. Disponível em várias cores.',
        category: 'calcas'
    },
    {
        id: 'bolsa-couro',
        name: 'Bolsa de Couro Premium',
        price: 299.90,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
        description: 'Bolsa confeccionada em couro legítimo premium. Design sofisticado e funcional com múltiplos compartimentos. Acessório indispensável para mulheres modernas.',
        category: 'acessorios'
    },
    {
        id: 'colar-delicado',
        name: 'Colar Delicado Dourado',
        price: 79.90,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
        description: 'Colar delicado folheado a ouro com design minimalista. Peça versátil que complementa qualquer look, do casual ao elegante. Hipoalergênico e resistente.',
        category: 'acessorios'
    }
];

// Exportar configurações
window.CONFIG = CONFIG;
window.PRODUCTS_DATA = PRODUCTS_DATA;
