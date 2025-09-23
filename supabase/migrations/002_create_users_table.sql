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

-- Políticas de segurança mais permissivas para usuários
CREATE POLICY "Permitir inserção de novos usuários" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem ver seu próprio perfil" ON users FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Admins podem ver todos os usuários" ON users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = auth.uid()::text AND is_admin = true
  )
);
CREATE POLICY "Admins podem gerenciar usuários" ON users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = auth.uid()::text AND is_admin = true
  )
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();