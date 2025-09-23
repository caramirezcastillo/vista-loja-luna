-- Remover todas as políticas existentes da tabela users
DROP POLICY IF EXISTS "Permitir inserção de novos usuários" ON users;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON users;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON users;
DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON users;
DROP POLICY IF EXISTS "Admins podem gerenciar usuários" ON users;
DROP POLICY IF EXISTS "Permitir registro público" ON users;
DROP POLICY IF EXISTS "Permitir leitura pública" ON users;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON users;
DROP POLICY IF EXISTS "Admins podem gerenciar tudo" ON users;

-- Desabilitar RLS temporariamente para permitir inserções
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Criar políticas mais simples e permissivas
-- Permitir inserção para qualquer pessoa (registro público)
CREATE POLICY "allow_insert_users" ON users FOR INSERT WITH CHECK (true);

-- Permitir leitura para todos
CREATE POLICY "allow_select_users" ON users FOR SELECT USING (true);

-- Permitir atualização para usuários autenticados do próprio perfil
CREATE POLICY "allow_update_own_profile" ON users FOR UPDATE 
  USING (auth.uid()::text = id::text);

-- Permitir delete apenas para admins
CREATE POLICY "allow_delete_admin_only" ON users FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );