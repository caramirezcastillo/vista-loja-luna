-- ========================================
-- SCRIPT PARA ADICIONAR RELAÇÕES
-- VISTA LOJA LUNA - SUPABASE DATABASE
-- Execute APÓS criar as tabelas básicas
-- ========================================

-- ========================================
-- ADICIONAR FOREIGN KEYS
-- ========================================

-- Adicionar foreign key de order_items para orders
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_order_id 
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- Adicionar foreign key de order_items para products
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_product_id 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- Adicionar foreign key de favorites para products
ALTER TABLE favorites 
ADD CONSTRAINT fk_favorites_product_id 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- ========================================
-- ADICIONAR CONSTRAINTS ÚNICOS
-- ========================================

-- Garantir que um usuário não pode favoritar o mesmo produto duas vezes
ALTER TABLE favorites 
ADD CONSTRAINT unique_user_product 
UNIQUE(user_id, product_id);

-- ========================================
-- ADICIONAR CHECKS
-- ========================================

-- Verificar status válidos para pedidos
ALTER TABLE orders 
ADD CONSTRAINT check_order_status 
CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));

-- Verificar quantidade positiva em order_items
ALTER TABLE order_items 
ADD CONSTRAINT check_positive_quantity 
CHECK (quantity > 0);

-- Verificar preço positivo em order_items
ALTER TABLE order_items 
ADD CONSTRAINT check_positive_price 
CHECK (price > 0);

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
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ========================================
CREATE INDEX idx_products_sizes ON products USING GIN (sizes);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE INDEX idx_products_is_sale ON products(is_sale);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================
SELECT 'Relações e constraints adicionadas com sucesso!' as status;

-- ========================================
-- INSTRUÇÕES
-- ========================================
/*
ESTE SCRIPT ADICIONA:

1. Foreign Keys entre tabelas
2. Constraints de validação
3. Triggers para updated_at
4. Sincronização com auth.users
5. Índices adicionais

EXECUTE APENAS APÓS:
- Criar as tabelas básicas com SIMPLE_TABLES_ONLY.sql
- Inserir dados iniciais

ORDEM DE EXECUÇÃO:
1. SIMPLE_TABLES_ONLY.sql (primeiro)
2. ADD_RELATIONSHIPS.sql (este arquivo)
*/