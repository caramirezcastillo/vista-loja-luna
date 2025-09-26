-- ========================================
-- SCRIPT SIMPLES - APENAS TABELAS SEM RELAÇÕES
-- VISTA LOJA LUNA - SUPABASE DATABASE
-- ========================================

-- ========================================
-- LIMPEZA INICIAL
-- ========================================

-- Remover tabelas existentes
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- ========================================
-- CRIAÇÃO DAS TABELAS (SEM FOREIGN KEYS)
-- ========================================

-- TABELA DE PRODUTOS
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT NOT NULL,
  image2 TEXT,
  category TEXT NOT NULL,
  description TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  sizes JSONB DEFAULT '[]'::jsonb,
  is_new BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE USUÁRIOS
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE PEDIDOS (SEM FOREIGN KEY)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE ITENS DO PEDIDO (SEM FOREIGN KEYS)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  product_id UUID,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE FAVORITOS (SEM FOREIGN KEYS)
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES BÁSICOS
-- ========================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- ========================================
-- HABILITAR RLS
-- ========================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS RLS BÁSICAS
-- ========================================

-- Produtos: todos podem ver
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);

-- Usuários: todos podem ver e inserir
CREATE POLICY "users_select_all" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_all" ON users FOR INSERT WITH CHECK (true);

-- Pedidos: apenas admins
CREATE POLICY "orders_admin_only" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND is_admin = true)
);

-- Itens do pedido: apenas admins
CREATE POLICY "order_items_admin_only" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND is_admin = true)
);

-- Favoritos: usuário próprio
CREATE POLICY "favorites_own_only" ON favorites FOR ALL USING (
  auth.uid()::text = user_id::text
);

-- ========================================
-- INSERIR DADOS DE EXEMPLO
-- ========================================

-- Produtos
INSERT INTO products (name, price, original_price, image, category, description, in_stock, stock_quantity, sizes, is_new, is_sale) VALUES
('Vestido Elegante Preto', 299.90, 399.90, '/src/assets/product-dress.jpg', 'feminino', 'Vestido elegante perfeito para ocasiões especiais', true, 10, '["PP", "P", "M", "G", "GG"]'::jsonb, false, true),
('Blazer Feminino Moderno', 459.90, null, '/src/assets/product-blazer.jpg', 'feminino', 'Blazer moderno para um look executivo', true, 15, '["PP", "P", "M", "G", "GG"]'::jsonb, true, false),
('Bolsa de Couro Premium', 599.90, 799.90, '/src/assets/product-bag.jpg', 'acessorios', 'Bolsa de couro premium com acabamento luxuoso', true, 8, '["Único"]'::jsonb, false, true),
('Vestido Casual Elegante', 299.90, null, '/src/assets/product-dress.jpg', 'feminino', 'Vestido casual para o dia a dia', true, 12, '["PP", "P", "M", "G", "GG"]'::jsonb, false, false),
('Blazer Executivo', 459.90, null, '/src/assets/product-blazer.jpg', 'feminino', 'Blazer executivo para reuniões importantes', true, 7, '["PP", "P", "M", "G", "GG"]'::jsonb, false, false),
('Bolsa Executiva Premium', 599.90, null, '/src/assets/product-bag.jpg', 'acessorios', 'Bolsa executiva para profissionais', true, 5, '["Único"]'::jsonb, false, false),
('Camisa Social Feminina', 189.90, 249.90, '/src/assets/product-shirt.jpg', 'feminino', 'Camisa social elegante para o trabalho', true, 20, '["PP", "P", "M", "G", "GG"]'::jsonb, false, true),
('Saia Midi Plissada', 159.90, null, '/src/assets/product-dress.jpg', 'feminino', 'Saia midi plissada versátil', true, 18, '["PP", "P", "M", "G", "GG"]'::jsonb, true, false),
('Calça Jeans Skinny', 119.90, null, '/src/assets/product-blazer.jpg', 'feminino', 'Calça jeans skinny confortável', true, 25, '["36", "38", "40", "42", "44"]'::jsonb, true, false),
('Top Cropped Estampado', 59.90, null, '/src/assets/product-shirt.jpg', 'feminino', 'Top cropped com estampa moderna', true, 30, '["PP", "P", "M", "G"]'::jsonb, true, false);

-- Usuário Admin
INSERT INTO users (name, email, is_admin) VALUES
('Administrador', 'admin@vistalojluna.com', true);

-- Pedidos de exemplo (usando UUIDs fictícios)
INSERT INTO orders (customer_name, customer_email, customer_phone, total, status, shipping_address) VALUES
('Maria Silva', 'maria@email.com', '(11) 99999-9999', 299.90, 'pending', 'Rua das Flores, 123 - São Paulo, SP'),
('Ana Costa', 'ana@email.com', '(11) 88888-8888', 1059.80, 'processing', 'Av. Paulista, 456 - São Paulo, SP');

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT 'Produtos: ' || COUNT(*) as total FROM products;
SELECT 'Usuários: ' || COUNT(*) as total FROM users;
SELECT 'Pedidos: ' || COUNT(*) as total FROM orders;

-- ========================================
-- INSTRUÇÕES
-- ========================================
/*
ESTE SCRIPT CRIA APENAS AS TABELAS SEM RELAÇÕES FOREIGN KEY

1. Execute no SQL Editor do Supabase
2. Todas as tabelas serão criadas independentemente
3. Dados de exemplo serão inseridos
4. RLS básico será configurado

PRÓXIMOS PASSOS (OPCIONAL):
- Execute o script de relações se necessário
- Configure triggers de updated_at
- Adicione sincronização com auth.users

CREDENCIAIS ADMIN:
- Email: admin@vistalojluna.com
- Configure a senha no Supabase Auth
*/