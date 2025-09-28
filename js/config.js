// Configurações globais da aplicação
const CONFIG = {
    whatsappNumber: '5579996465615', // Substitua pelo número real
    businessName: 'LUNA VISTA LOJA'
};


// Dados dos produtos
const PRODUCTS_DATA = [
{
        id: 'vestido-curto-elegante-com-decote-halter',
        name: 'Vestido Curto Elegante com Decote Halter',
        price: 79.90,
        image: '../img/vestido-curto-elegante-com-decote-halter.jpeg',
        description: ' Vestido confeccionado em 100% poliéster, com modelagem assimétrica e costas nuas. Peça de caimento leve, que une modernidade e elegância, ideal para compor looks sofisticados em eventos especiais.',
        category: 'vestidos'
    },
{
        id: 'Vestido-Curto Sexy-Assimétrico com-Babados-na Barra',
        name: 'Vestido Curto Sexy Assimétrico com Babados na Barra',
        price: 105.00,
        image: '../img/Vestido-Curto Sexy-Assimétrico com-Babados-na Barra.jpeg',
        description: 'Vestido confeccionado em 100% poliéster, com costas nuas e acabamento drapeado. Possui caimento leve e sofisticado, destacando-se pelo toque delicado do chiffon e pelo design elegante. ',
        category: 'vestidos'
    },
{
        id: 'vestido-evase-com-decote-em-v',
        name: 'Vestido Evasê com Decote em V e Costas Abertas',
        price: 85.00,
        image: '../img/vestido-evase-com-decote-em-v.jpeg',
        description: 'Vestido em cetim (96% poliéster, 4% elastano), com costas nuas e caimento elegante. O leve brilho do cetim aliado ao toque acetinado garante sofisticação, tornando a peça ideal para ocasiões noturnas. ',
        category: 'vestidos'
    },
{
        id: 'vestido-tubo-drapeado-bodycon',
        name: 'Vestido Tubo Drapeado Bodycon',
        price: 96.00,
        image: '../img/vestido-tubo-drapeado-bodycon.jpeg',
        description: ' Vestido curto em malha 95% poliéster e 5% elastano, totalmente forrado, com cintura alta que valoriza a silhueta. Na cor pink, combina modernidade e feminilidade em uma peça versátil para diferentes ocasiões. ',
        category: 'vestidos'
    },
{
        id: 'vestido-elegante-com-mangas-longas',
        name: 'Vestido Elegante com Mangas Longas',
        price: 105.00,
        image: '../img/vestido-elegante-com-mangas-longas.jpeg',
        description: 'Vestido em malha (95% poliéster e 5% elastano), com manga bufante e costas nuas. Na cor vermelho, apresenta caimento moderno e elegante, ideal para destacar a produção em ocasiões especiais. ',
        category: 'vestidos'
    },
{
        id: 'vestido-em-couro-sintetico',
        name: 'Vestido Floral Colorido',
        price: 55.00,
        image: '../img/vestido-em-couro-sintetico.jpeg',
        description: ' Vestido com tecido de 95% poliéster e 5% elastano, com efeito de couro sintético.  Cor marrom, sem forro e com costas nuas. Destaca-se pelo caimento justo que valoriza as curvas, ideal para produções marcantes.',
        category: 'vestidos'
    },
{
        id: 'vestido-longo-com-gola-simples-e-fenda-alta',
        name: 'Vestido Longo Com Gola Simples e Fenda Alta',
        price: 85.00,
        image: '../img/vestido-longo-com-gola-simples-e-fenda-alta.jpeg',
        description: 'Vestido em malha (95% poliéster e 5% elastano), com manga regular, decote ombro a ombro e fenda frontal. Modelo de caimento ajustado que une sofisticação e modernidade em uma peça versátil para diversas ocasiões. ',
        category: 'vestidos'
    },

{
        id: 'vestido-de-cetim-sem-mangas-e-com-decote-em-v',
        name: 'Vestido Floral Colorido',
        price: 110.00,
        image: '../img/vestido-de-cetim-sem-mangas-e-com-decote-em-v.jpeg',
        description: ' Vestido em tecido 100% poliéster, modelo em A suspensório, com alças finas, sem mangas e sem forro. Leve e versátil, é uma peça prática e elegante para composições casuais. ',
        category: 'vestidos'
    },
{
        id: 'vestido-longo-de-leopardo-com-decote-profundo-em-v',
        name: 'Vestido Floral Colorido',
        price: 127.00,
        image: '../img/vestido-longo-de-leopardo-com-decote-profundo-em-v.jpeg',
        description: 'Vestido em tecido 98% poliéster e 2% elastano, com costas nuas, alças finas e cintura alta. Apresenta estampa de leopardo em padrão texturizado, combinando sensualidade e modernidade em uma peça de destaque. ',
        category: 'vestidos'
    },
{
        id: 'vestido-justo-de-decote-halter',
        name: 'Vestido Justo de Decote Halter',
        price: 66.00,
        image: '../img/vestido-justo-de-decote-halter.jpeg',
        description: ' Vestido em tecido 94% poliéster e 6% elastano, modelo em A com suspensório, de costas nuas e bainha com babado. Peça delicada e feminina, com caimento leve e toque moderno.',
        category: 'vestidos'
    },
{
        id: 'body-collant-com-decote-quadrado',
        name: 'Body Collant Feminino com Decote Quadrado',
        price: 26.99,
        image: '../img/body-collant-com-decote-quadrado.jpeg',
        description: 'Blusa em malha 92% poliéster e 8% elastano, com costas nuas, cintura alta e ombro à mostra. Peça moderna e versátil, que valoriza a silhueta e adiciona estilo às produções casuais e elegantes. ',
        category: 'blusas'
    },
{
        id: 'body-collant-com-um-ombro',
        name: 'Body Collant Feminino Com Um Ombro',
        price: 28.00,
        image: '../img/body-collant-com-um-ombro.jpeg',
        description: 'Blusa em malha 92% poliéster e 8% elastano, com design assimétrico e ombro à mostra. Modelo de caimento ajustado que transmite modernidade e estilo, ideal para composições elegantes e contemporâneas. ',
        category: 'blusas'
    },
{
        id: 'body-collant-gola-alta',
        name: 'Body Collant Feminino Gola Alta',
        price: 29.00,
        image: '../img/body-collant-gola-alta.jpeg',
        description: 'Blusa em 92% poliéster e 8% elastano, com costas nuas, gola alta e design estilo suspensório. Peça moderna e sofisticada, que une elegância ao caimento justo e contemporâneo. ',
        category: 'blusas'
    },

{
        id: 'body-cavado-asadelta ',
        name: 'Body Feminino Cavado Asadelta',
        price: 29.90,
        image: '../img/body-cavado-asadelta.jpeg',
        description: ' Blusa em 92% poliéster e 8% elastano, com costas nuas, mangas compridas e cintura alta. Modelo ajustado que valoriza a silhueta, unindo estilo moderno e versatilidade.',
        category: 'blusas'
    },

{
        id: ' body-collant-com-resorte-mula-manca',
        name: 'Body Collant Feminino Com Recorte Mula Manca',
        price: 34.00,
        image: '../img/body-collant-com-resorte-mula-manca.jpeg',
        description: 'Blusa em 92% poliéster e 8% elastano, com mangas compridas, design assimétrico e gola alta dividida. Modelo forrado, que combina sofisticação e modernidade em uma peça de caimento elegante. ',
        category: 'blusas'
    },

{
        id: 'body-bory-collant-com-alcinha-bicolor',
        name: 'Body Bory Collant Com Alcinha',
        price: 32.00,
        image: '../img/body-bory-collant-com-alcinha-bicolor.jpeg',
        description: 'Blusa em 92% poliéster e 8% elastano, forrada, com alças finas e ombro à mostra. Modelo delicado e moderno, ideal para compor produções versáteis com elegância. ',
        category: 'blusas'
    },

{
        id: 'cropped-top-decote-quadrado',
        name: 'Cropped Top Feminino Decote Quadrado',
        price: 25.00,
        image: '../img/cropped-top-decote-quadrado.jpeg',
        description: 'Blusa em 92% poliéster e 8% elastano, com decote quadrado, mangas curtas e acabamento forrado. Peça de caimento ajustado que une praticidade e elegância para composições modernas. ',
        category: 'blusas'
    },
{
        id: 'top-cropped-gringa-multiformas',
        name: 'Top Cropped Gringa Multiformas',
        price: 24.00,
        image: '../img/top-cropped-gringa-multiformas.jpeg',
        description: 'Blusa em 100% elastano, com design assimétrico, sem mangas e gola V profundo. Modelo de estilo sensual, com caimento justo que valoriza as curvas e adiciona modernidade ao visual. ',
        category: 'blusas'
    },
{
        id: 'top-crop-tube-sem-alcas ',
        name: 'Top Crop Tube Sem Alças',
        price: 18.00,
        image: '../img/top-crop-tube-sem-alcas.jpeg',
        description: ' Blusa em 90% poliéster e 10% elastano, modelo sem alça e ombro a ombro. De estilo casual e design cropped, é uma peça moderna e versátil para compor diferentes produções.',
        category: 'blusas'
    },
{
        id: 'blusa-canelada-ombro-ombro ',
        name: 'Blusa Feminina Canelada Ombro a Ombro',
        price: 31.90,
        image: '../img/blusa-canelada-ombro-ombro.jpeg',
        description: 'Blusa em 50% elastano e 50% poliéster, modelo ombro a ombro, com mangas longas e acabamento canelado. Sem forro, é uma peça moderna e confortável, ideal para composições casuais e elegantes. ',
        category: 'blusas'
    },
{
        id: ' short-alfaitaria-cintura',
        name: 'Short Feminino Alfaitaria Cintura Alta',
        price: 30.00,
        image: '../img/short-alfaitaria-cintura.jpeg',
        description: 'Descrição: Short alfaiataria de cintura alta, modelagem reta, com bolsos, zíper frontal e contém cinto. Peça versátil, perfeita para compor looks casuais ou mais formais. ',
        category: 'shorts'
    },
{
        id: 'short-de-couro-cintura',
        name: 'Short Feminino de Couro Cintura Alta',
        price: 49.90,
        image: '../img/short-de-couro-cintura.jpeg',
        description: 'Short de couro de cintura alta, com bolsos, fechamento de mosca com zíper e botão, e ajuste regular. Peça moderna e sofisticada, ideal para compor produções cheias de estilo. ',
        category: 'shorts'
    },
{
        id: 'saia-alfaitaria',
        name: 'Short Saia Feminino Alfaitaria',
        price: 45.00,
        image: '../img/saia-alfaitaria.jpeg',
        description: 'Short saia de cintura alta, com cordão ajustável, forro interno, bolsos e acompanha cinto. Peça prática e estilosa, perfeita para looks casuais com conforto. ',
        category: 'shorts'
    },
{
        id: 'short-de-linho-cintura-alta ',
        name: 'Short de Linho Cintura Alta',
        price: 39.90,
        image: '../img/short-de-linho-cintura-alta.jpeg',
        description: 'Short em linho, de cintura alta, com bolsos, fechamento frontal em zíper e botão. Peça leve e versátil, ideal para compor looks casuais ou elegantes. ',
        category: 'shorts'
    },
{
        id: 'short-linho-com-cinto',
        name: 'Short Linho Com Cinto',
        price: 62.00,
        image: '../img/short-linho-com-cinto.jpeg',
        description: ' Short de linho, cintura alta, com bolsos, cinto, fechamento em mosca com zíper, ajuste regular e tecido não elástico. Peça leve e elegante, perfeita para compor looks sofisticados e confortáveis.',
        category: 'shorts'
    },
{
        id: 'calca-pantalona-alfaitaria-com-fecho-cruzado',
        name: 'Calça Pantalona Alfaiataria Com Fecho Cruzado',
        price: 80.00,
        image: '../img/calca-pantalona-alfaitaria-com-fecho-cruzado.jpeg',
        description: 'Calça de cintura alta, em tecido leve, não transparente, com bolsos, fechamento frontal em zíper e botão, comprimento longo e caimento solto. Peça versátil e elegante, ideal para compor produções confortáveis e sofisticadas ',
        category: 'calcas'
    },

{
        id: 'calca-wide-leg-social',
        name: 'Calça Wide Leg Social',
        price: 76.00,
        image: '../img/calca-wide-leg-social.jpeg ',
        description: 'Calça wide leg de alfaiataria, com cintura alta, comprimento longo, caimento solto e forro interno. Sofisticada e versátil, perfeita para compor looks elegantes com conforto.',
        category: 'calcas'
    },
{
        id: ' Calca-Pantalona-de-Cambraia',
        name: 'Calça Pantalona de Cambraia',
        price: 78.00,
        image: '../img/Calca-Pantalona-de-Cambraia.jpeg',
        description: 'Descrição: Calça pantalona em cambraia, com cintura alta, perna larga e fechamento em mosca com zíper. Possui parte superior sem forro e parte inferior forrada, garantindo leveza, conforto e elegância. ',
        category: 'calcas'
    },

{
        id: 'calca-cargo-reta ',
        name: 'Calça Cargo Reta',
        price: 99.90,
        image: '../img/calca-cargo-reta.jpeg',
        description: 'Calça cargo reta de alfaiataria, sem forro, de comprimento longo, com bolsos funcionais e ajuste regular. Moderna e versátil, une elegância e praticidade em uma única peça.',
        category: 'calcas'
    },
    {
        id: 'bolsa-de-ombro-com-aba-e-fecho-de-metal ',
        name: 'Bolsa de Ombro com Aba e Fecho de Metal',
        price: 69.90,
        image: '../img/bolsa-de-ombro-com-aba-e-fecho-de-metal.jpeg',
        description: 'Bolsa flap em Couro PU, com alças ajustáveis e fechamento em imã. Prática, versátil e cheia de estilo para o dia a dia.',
        category: 'acessorios'
    },
{
        id: ' bolsa-de-ombro-versátil ',
        name: 'Bolsa de ombro versátil ',
        price: 74.90,
        image: '../img/bolsa-de-ombro-versátil .jpeg',
        description: 'Bolsa média em pvc, com alça superior e fechamento em zíper. Moderna, resistente e ideal para o dia a dia.',
        category: 'acessorios'
    },
{
        id: 'bolsa-de-ombro-minimalista-com-zíper',
        name: 'Bolsa de Ombro Minimalista com Zíper',
        price: 59.90,
        image: '../img/bolsa-de-ombro-minimalista-com-zíper.jpeg',
        description: 'Bolsa pequena em couro PU, com alça superior e design elegante para compor looks versáteis no dia a dia.',
        category: 'acessorios'
    },

{
        id: 'bolsa-de-ombro-com-corrente-metalica',
        name: 'Bolsa de Ombro com Corrente Metálica ',
        price: 89.90,
        image: '../img/bolsa-de-ombro-com-corrente-metalica.jpeg',
        description: 'Bolsa grande em couro PU, design geométrico e acolchoado, com alça de corrente que une sofisticação e estilo.',
        category: 'acessorios'
    },
{
        id: 'bolsa-tote-estilo-escritorio',
        name: 'Bolsa Tote Estilo Escritório ',
        price: 69.90,
        image: '../img/bolsa-tote-estilo-escritorio.jpeg',
        description: 'Bolsa pequena em couro PU, formato quadrado com detalhes em relevo, alças de punho duplo e fechamento em zíper. Elegante e prática para o dia a dia.',
        category: 'acessorios'
    },
{
        id: 'cinto-versatil-marrom',
        name: 'Cinto Versátil Marrom ',
        price: 28.90,
        image: '../img/cinto-versatil-marrom.jpeg',
        description: 'Cinto em couro PU, com fivela de pino quadrada em tamanho médio. Clássico e versátil para diferentes combinações.',
        category: 'acessorios'
    },
{
        id: 'cinto-oval-fivela-basico ',
        name: 'Cinto Oval Fivela Básico',
        price: 45.90,
        image: '../img/cinto-oval-fivela-basico.jpeg',
        description: 'Cinto em material PU, estampa simples, tamanho médio e fivela oval. Versátil e fácil de combinar.',
        category: 'acessorios'
    },
{
        id: 'cinto-metalizado',
        name: 'Cinto Metalizado',
        price: 44.90,
        image: '../img/cinto-metalizado.jpeg',
        description: 'Cinto Largo em couro PU, com fivela de pino quadrada. Estilo casual e moderno para compor looks do dia a dia.',
        category: 'acessorios'
    },
{
        id: 'cinto-versatil-premium ',
        name: 'Cinto Versátil Premium',
        price: 25.90,
        image: '../img/cinto-versatil-premium.jpeg',
        description: 'Cinto casual largo em couro PU, com fivela de pino quadrada. Perfeito para adicionar estilo e conforto ao visual diário.',
        category: 'acessorios'
    },
{
        id: 'cinto-assimetrico-marrom ',
        name: 'Cinto Assimétrico Marrom',
        price: 44.90,
        image: '../img/cinto-assimetrico-marrom.jpeg',
        description: 'Cinto em couro com estampa geométrica, tamanho médio e fivela redonda. Estio moderno e versátil para o dia a dia.',
        category: 'acessorios'
    },


   
];

// Exportar configurações
window.CONFIG = CONFIG;
window.PRODUCTS_DATA = PRODUCTS_DATA;
