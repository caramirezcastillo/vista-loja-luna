-- ========================================
-- CRIAÇÃO DE USUÁRIO ADMIN - SUPABASE DASHBOARD
-- ========================================

-- ⚠️ IMPORTANTE: Substitua 'sua_senha_segura' por uma senha forte!

DO $$
DECLARE
    admin_email TEXT := 'admin@luna.com';
    admin_password TEXT := 'sua_senha_segura'; -- ⚠️ ALTERE ESTA SENHA!
    admin_name TEXT := 'Administrador Luna';
    admin_uuid UUID;
    password_hash TEXT;
BEGIN
    -- Log início do processo
    RAISE NOTICE 'Iniciando criação do usuário admin...';
    
    -- ========================================
    -- LIMPEZA DE REGISTROS EXISTENTES
    -- ========================================
    
    -- Remover admin existente em public.users
    DELETE FROM public.users WHERE email = admin_email OR is_admin = true;
    RAISE NOTICE 'Limpeza de public.users concluída';
    
    -- Remover admin existente em auth.users
    DELETE FROM auth.users WHERE email = admin_email;
    RAISE NOTICE 'Limpeza de auth.users concluída';
    
    -- ========================================
    -- GERAR UUID E HASH DA SENHA
    -- ========================================
    
    -- Gerar UUID único
    admin_uuid := gen_random_uuid();
    RAISE NOTICE 'UUID gerado: %', admin_uuid;
    
    -- Gerar hash da senha (bcrypt)
    password_hash := crypt(admin_password, gen_salt('bf'));
    
    -- ========================================
    -- CRIAR USUÁRIO EM AUTH.USERS
    -- ========================================
    
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud
    ) VALUES (
        admin_uuid,
        '00000000-0000-0000-0000-000000000000',
        admin_email,
        password_hash,
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('name', admin_name, 'is_admin', true),
        false,
        'authenticated',
        'authenticated'
    );
    
    RAISE NOTICE 'Usuário criado em auth.users com ID: %', admin_uuid;
    
    -- ========================================
    -- CRIAR USUÁRIO EM PUBLIC.USERS
    -- ========================================
    
    INSERT INTO public.users (
        id,
        name,
        email,
        is_admin,
        created_at,
        updated_at
    ) VALUES (
        admin_uuid,
        admin_name,
        admin_email,
        true,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'Usuário criado em public.users com privilégios de admin';
    
    -- ========================================
    -- VERIFICAÇÃO FINAL
    -- ========================================
    
    -- Verificar criação em auth.users
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = admin_uuid) THEN
        RAISE NOTICE '✅ Admin criado com sucesso em auth.users';
    ELSE
        RAISE EXCEPTION '❌ Falha ao criar admin em auth.users';
    END IF;
    
    -- Verificar criação em public.users
    IF EXISTS (SELECT 1 FROM public.users WHERE id = admin_uuid AND is_admin = true) THEN
        RAISE NOTICE '✅ Admin criado com sucesso em public.users';
    ELSE
        RAISE EXCEPTION '❌ Falha ao criar admin em public.users';
    END IF;
    
    -- ========================================
    -- RESUMO FINAL
    -- ========================================
    
    RAISE NOTICE '🎉 USUÁRIO ADMIN CRIADO COM SUCESSO!';
    RAISE NOTICE 'Email: %', admin_email;
    RAISE NOTICE 'UUID: %', admin_uuid;
    RAISE NOTICE '⚠️ Lembre-se de alterar a senha padrão!';
    
END $$;