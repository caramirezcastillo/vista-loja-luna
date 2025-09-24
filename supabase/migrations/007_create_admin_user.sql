-- Create a function to create admin user if it doesn't exist
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert admin user if it doesn't exist
  INSERT INTO users (id, name, email, is_admin, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Admin User',
    'admin@modaagora.com',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    is_admin = true,
    updated_at = NOW();
END;
$$;

-- Execute the function to create admin user
SELECT create_admin_user();

-- Drop the function as it's no longer needed
DROP FUNCTION create_admin_user();