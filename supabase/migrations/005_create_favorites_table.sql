-- Criar tabela de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Habilitar RLS na tabela favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para favoritos
-- Usuários podem ver apenas seus próprios favoritos
CREATE POLICY "Users can view their own favorites" 
ON favorites 
FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id::text);

-- Usuários podem adicionar seus próprios favoritos
CREATE POLICY "Users can add their own favorites" 
ON favorites 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- Usuários podem remover seus próprios favoritos
CREATE POLICY "Users can remove their own favorites" 
ON favorites 
FOR DELETE 
TO authenticated
USING (auth.uid()::text = user_id::text);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_product ON favorites(user_id, product_id);