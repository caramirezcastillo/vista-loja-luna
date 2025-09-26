-- ========================================
-- SCRIPT COMPLETO DE RECRIAÇÃO DO SCHEMA
-- VISTA LOJA LUNA - SUPABASE DATABASE
-- ========================================

-- ========================================
-- LIMPEZA INICIAL (APENAS SE EXISTIREM)
-- ========================================

-- Remover triggers existentes (se existirem)
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover funções existentes (se existirem)
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS handle_new_user();

-- Remover tabelas existentes (ordem importante devido às foreign keys)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- ========================================
-- CRIAÇÃO DAS TABELAS
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

-- TABELA DE USUÁRIOS (PRINCIPAL)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE PEDIDOS
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE ITENS DO PEDIDO
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE FAVORITOS
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_sizes ON products USING GIN (sizes);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE INDEX idx_products_is_sale ON products(is_sale);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- ========================================
-- FUNÇÃO PARA ATUALIZAR UPDATED_AT
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================================
-- TRIGGERS PARA UPDATED_AT
-- ========================================
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- HABILITAR RLS
-- ========================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS RLS - PRODUTOS
-- ========================================
CREATE POLICY "products_select_all" ON products 
  FOR SELECT USING (true);

CREATE POLICY "products_admin_all" ON products 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );

-- ========================================
-- POLÍTICAS RLS - USUÁRIOS
-- ========================================
CREATE POLICY "users_insert_public" ON users 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "users_select_all" ON users 
  FOR SELECT USING (true);

CREATE POLICY "users_update_own" ON users 
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "users_admin_all" ON users 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );

-- ========================================
-- POLÍTICAS RLS - PEDIDOS
-- ========================================
CREATE POLICY "orders_admin_all" ON orders 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );

-- ========================================
-- POLÍTICAS RLS - ITENS DO PEDIDO
-- ========================================
CREATE POLICY "order_items_admin_all" ON order_items 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );

-- ========================================
-- POLÍTICAS RLS - FAVORITOS
-- ========================================
CREATE POLICY "favorites_user_own" ON favorites 
  FOR ALL USING (auth.uid()::text = user_id::text);

-- ========================================
-- FUNÇÃO PARA SINCRONIZAR COM AUTH.USERS
-- ========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    email = NEW.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- TRIGGER PARA SINCRONIZAÇÃO
-- ========================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- INSERIR DADOS DE EXEMPLO - PRODUTOS
-- ========================================
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

-- ========================================
-- CRIAR USUÁRIO ADMIN
-- ========================================
DO $$
DECLARE
    admin_id UUID;
    admin_email TEXT := 'admin@vistalojluna.com';
    admin_password TEXT := 'Admin123!';
    admin_name TEXT := 'Administrador';
    encrypted_password TEXT;
BEGIN
    -- Gerar UUID único
    admin_id := gen_random_uuid();
    
    -- Criptografar senha (usando crypt do pgcrypto)
    encrypted_password := crypt(admin_password, gen_salt('bf'));
    
    -- Limpar registros existentes do admin
    DELETE FROM public.users WHERE email = admin_email;
    DELETE FROM auth.users WHERE email = admin_email;
    
    -- Inserir na tabela auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role
    ) VALUES (
        admin_id,
        '00000000-0000-0000-0000-000000000000',
        admin_email,
        encrypted_password,
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('name', admin_name),
        false,
        'authenticated'
    );
    
    -- Inserir na tabela public.users
    INSERT INTO public.users (
        id,
        name,
        email,
        is_admin,
        created_at,
        updated_at
    ) VALUES (
        admin_id,
        admin_name,
        admin_email,
        true,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'Usuário admin criado com sucesso!';
    RAISE NOTICE 'Email: %', admin_email;
    RAISE NOTICE 'Senha: %', admin_password;
    RAISE NOTICE 'ID: %', admin_id;
    
END $$;

-- ========================================
-- INSERIR PEDIDOS DE EXEMPLO
-- ========================================
DO $$
DECLARE
    order1_id UUID := gen_random_uuid();
    order2_id UUID := gen_random_uuid();
    product1_id UUID;
    product2_id UUID;
    product3_id UUID;
BEGIN
    -- Obter IDs dos produtos para os pedidos
    SELECT id INTO product1_id FROM products WHERE name = 'Vestido Elegante Preto' LIMIT 1;
    SELECT id INTO product2_id FROM products WHERE name = 'Blazer Feminino Moderno' LIMIT 1;
    SELECT id INTO product3_id FROM products WHERE name = 'Bolsa de Couro Premium' LIMIT 1;
    
    -- Inserir pedidos
    INSERT INTO orders (id, customer_name, customer_email, customer_phone, total, status, shipping_address, created_at) VALUES
    (order1_id, 'Maria Silva', 'maria@email.com', '(11) 99999-9999', 299.90, 'pending', 'Rua das Flores, 123 - São Paulo, SP', NOW()),
    (order2_id, 'Ana Costa', 'ana@email.com', '(11) 88888-8888', 1059.80, 'processing', 'Av. Paulista, 456 - São Paulo, SP', NOW() - INTERVAL '1 day');
    
    -- Inserir itens dos pedidos
    INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES
    (order1_id, product1_id, 'Vestido Elegante Preto', 1, 299.90),
    (order2_id, product2_id, 'Blazer Feminino Moderno', 1, 459.90),
    (order2_id, product3_id, 'Bolsa de Couro Premium', 1, 599.90);
    
END $$;

-- ========================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ========================================
COMMENT ON TABLE products IS 'Tabela de produtos da loja com dados de exemplo';
COMMENT ON TABLE users IS 'Tabela principal de usuários sincronizada com auth.users';
COMMENT ON TABLE orders IS 'Tabela de pedidos dos clientes com exemplos';
COMMENT ON TABLE order_items IS 'Itens individuais de cada pedido';
COMMENT ON TABLE favorites IS 'Produtos favoritos dos usuários';

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================
SELECT 'Schema recriado com sucesso!' as status;
SELECT 'Produtos inseridos: ' || COUNT(*) as produtos FROM products;
SELECT 'Usuários criados: ' || COUNT(*) as usuarios FROM users;
SELECT 'Pedidos de exemplo: ' || COUNT(*) as pedidos FROM orders;

-- ========================================
-- INSTRUÇÕES FINAIS
-- ========================================
/*
INSTRUÇÕES PARA USO:

1. Execute este script completo no SQL Editor do Supabase Dashboard
2. Aguarde a execução completa (pode levar alguns segundos)
3. Verifique se todas as tabelas foram criadas corretamente
4. Teste o login com as credenciais do admin:
   - Email: admin@vistalojluna.com
   - Senha: Admin123!

5. IMPORTANTE: Altere a senha do admin após o primeiro login!

6. O banco agora está pronto com:
   - 10 produtos de exemplo
   - 1 usuário administrador
   - 2 pedidos de exemplo
   - Todas as políticas RLS configuradas
   - Sincronização automática com auth.users

7. Teste as funcionalidades:
   - Registro de novos usuários
   - Login/logout
   - Adicionar produtos aos favoritos
   - Painel administrativo

CORREÇÃO APLICADA:
- Removido o comando ALTER TABLE DISABLE ROW LEVEL SECURITY para tabelas inexistentes
- Mantida apenas a limpeza com DROP TABLE IF EXISTS
- Ordem correta de criação: tabelas → índices → funções → triggers → RLS → políticas
*/