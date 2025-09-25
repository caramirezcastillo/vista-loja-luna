-- Adicionar campo de tamanhos à tabela products
-- Os tamanhos serão armazenados como um array JSON de strings
ALTER TABLE products ADD COLUMN sizes JSONB DEFAULT '[]'::jsonb;

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN products.sizes IS 'Array de tamanhos disponíveis para o produto (ex: ["PP", "P", "M", "G", "GG"])';

-- Criar índice para consultas eficientes nos tamanhos
CREATE INDEX IF NOT EXISTS idx_products_sizes ON products USING GIN (sizes);

-- Atualizar produtos existentes com tamanhos padrão baseados na categoria
UPDATE products 
SET sizes = CASE 
  WHEN category IN ('blusas', 'vestidos', 'feminino') THEN '["PP", "P", "M", "G", "GG"]'::jsonb
  WHEN category = 'shorts' THEN '["36", "38", "40", "42", "44"]'::jsonb
  WHEN category = 'acessorios' THEN '["Único"]'::jsonb
  ELSE '["P", "M", "G"]'::jsonb
END
WHERE sizes = '[]'::jsonb OR sizes IS NULL;

-- Função para validar tamanhos
CREATE OR REPLACE FUNCTION validate_product_sizes()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se sizes é um array válido
  IF NEW.sizes IS NOT NULL AND jsonb_typeof(NEW.sizes) != 'array' THEN
    RAISE EXCEPTION 'O campo sizes deve ser um array JSON válido';
  END IF;
  
  -- Verificar se todos os elementos do array são strings
  IF NEW.sizes IS NOT NULL AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(NEW.sizes) AS elem 
    WHERE jsonb_typeof(elem) != 'string'
  ) THEN
    RAISE EXCEPTION 'Todos os tamanhos devem ser strings';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para validação
CREATE TRIGGER validate_sizes_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION validate_product_sizes();