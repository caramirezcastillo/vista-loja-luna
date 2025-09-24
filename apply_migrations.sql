-- Apply all authentication fixes for Moda Agora Store
-- Run this script in your Supabase SQL Editor

-- 1. Create the trigger function for automatic user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, is_admin, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    false,
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Fix RLS policies
-- Drop existing policies
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;
DROP POLICY IF EXISTS "Allow public read access" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow admin full access" ON public.users;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Allow service role insert" ON public.users
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON public.users
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access" ON public.users
  FOR SELECT
  USING (true);

CREATE POLICY "Allow users to update own profile" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admin full access" ON public.users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.users TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 5. Create admin user if it doesn't exist
DO $$
BEGIN
  -- Check if admin user exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@modaagora.com') THEN
    -- Insert admin user
    INSERT INTO public.users (id, name, email, is_admin, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      'Administrador',
      'admin@modaagora.com',
      true,
      now(),
      now()
    );
  ELSE
    -- Update existing user to be admin
    UPDATE public.users 
    SET is_admin = true, updated_at = now()
    WHERE email = 'admin@modaagora.com';
  END IF;
END $$;

-- 6. Verify the setup
SELECT 'Setup completed successfully!' as status;
SELECT 'Users table:' as info, count(*) as user_count FROM public.users;
SELECT 'Admin users:' as info, count(*) as admin_count FROM public.users WHERE is_admin = true;