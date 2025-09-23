-- Criar tabela de usuários personalizada
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para usuários
-- Permitir inserção para qualquer pessoa (registro público)
CREATE POLICY "Permitir registro público" ON users FOR INSERT WITH CHECK (true);

-- Permitir leitura para usuários autenticados ou para consultas públicas
CREATE POLICY "Permitir leitura pública" ON users FOR SELECT USING (true);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil" ON users FOR UPDATE 
  USING (auth.uid()::text = id::text);

-- Admins podem fazer tudo
CREATE POLICY "Admins podem gerenciar tudo" ON users FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );

-- Trigger para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();