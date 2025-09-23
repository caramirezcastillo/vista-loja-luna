-- Função para registrar usuários com privilégios elevados
CREATE OR REPLACE FUNCTION register_user(
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  is_admin_user BOOLEAN DEFAULT false
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com privilégios do proprietário da função
AS $$
DECLARE
  result JSON;
BEGIN
  -- Inserir usuário na tabela users
  INSERT INTO users (id, name, email, is_admin)
  VALUES (user_id, user_name, user_email, is_admin_user);
  
  -- Retornar dados do usuário criado
  SELECT json_build_object(
    'id', id,
    'name', name,
    'email', email,
    'is_admin', is_admin,
    'created_at', created_at
  ) INTO result
  FROM users
  WHERE id = user_id;
  
  RETURN result;
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object('error', 'Usuário já existe');
  WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Permitir que usuários anônimos executem esta função
GRANT EXECUTE ON FUNCTION register_user TO anon;
GRANT EXECUTE ON FUNCTION register_user TO authenticated;