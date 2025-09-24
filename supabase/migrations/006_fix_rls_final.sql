-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "allow_insert_users" ON users;
DROP POLICY IF EXISTS "allow_select_users" ON users;
DROP POLICY IF EXISTS "allow_update_own_profile" ON users;
DROP POLICY IF EXISTS "allow_delete_admin_only" ON users;
DROP POLICY IF EXISTS "Permitir registro público" ON users;
DROP POLICY IF EXISTS "Permitir leitura pública" ON users;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON users;
DROP POLICY IF EXISTS "Admins podem gerenciar tudo" ON users;

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow service role and authenticated users to insert
CREATE POLICY "Enable insert for service role and authenticated users" ON users
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'service_role' OR 
    auth.role() = 'authenticated' OR
    auth.role() = 'anon'
  );

-- Policy 2: Allow everyone to read user profiles (needed for public user lists)
CREATE POLICY "Enable read access for all users" ON users
  FOR SELECT 
  USING (true);

-- Policy 3: Allow users to update their own profile
CREATE POLICY "Enable update for users based on user_id" ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Allow admins to do everything
CREATE POLICY "Enable all access for admins" ON users
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Grant necessary permissions for the trigger function
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT SELECT ON auth.users TO anon, authenticated;