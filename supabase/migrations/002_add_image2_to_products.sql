-- Adicionar coluna image2 à tabela products para suportar segunda imagem
ALTER TABLE products ADD COLUMN IF NOT EXISTS image2 TEXT;

-- Comentário explicativo
COMMENT ON COLUMN products.image2 IS 'Segunda imagem opcional do produto';