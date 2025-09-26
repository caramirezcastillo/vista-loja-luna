-- ========================================
-- CRIAÇÃO DE USUÁRIO ADMIN - VERSÃO LIMPA
-- ========================================

-- Definir variáveis para o admin
DO $$
DECLARE
    admin_email TEXT := 'admin@luna.com';
    admin_password TEXT := 'admin123';
    admin_name TEXT := 'Administrador Luna';
    admin_uuid UUID;
    existing_auth_user UUID;
    existing_public_user UUID;
BEGIN
    -- Log início do processo
    RAISE NOTICE 'Iniciando criação do usuário admin...';
    
    -- ========================================
    -- LIMPEZA COMPLETA DE REGISTROS ADMIN
    -- ========================================
    
    -- Verificar e remover admin existente em public.users
    SELECT id INTO existing_public_user 
    FROM public.users 
    WHERE email = admin_email OR is_admin = true 
    LIMIT 1;
    
    IF existing_public_user IS NOT NULL THEN
        DELETE FROM public.users WHERE id = existing_public_user;
        RAISE NOTICE 'Removido admin existente de public.users: %', existing_public_user;
    END IF;
    
    -- Verificar e remover admin existente em auth.users
    SELECT id INTO existing_auth_user 
    FROM auth.users 
    WHERE email = admin_email 
    LIMIT 1;
    
    IF existing_auth_user IS NOT NULL THEN
        DELETE FROM auth.users WHERE id = existing_auth_user;
        RAISE NOTICE 'Removido admin existente de auth.users: %', existing_auth_user;
    END IF;
    
    -- Aguardar para garantir limpeza
    PERFORM pg_sleep(2);
    
    -- ========================================
    -- GERAR UUID ÚNICO
    -- ========================================
    
    -- Loop para garantir UUID único em ambas as tabelas
    LOOP
        admin_uuid := gen_random_uuid();
        
        -- Verificar se UUID já existe em auth.users
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = admin_uuid) AND
           NOT EXISTS (SELECT 1 FROM public.users WHERE id = admin_uuid) THEN
            EXIT; -- UUID é único, sair do loop
        END IF;
        
        RAISE NOTICE 'UUID % já existe, gerando novo...', admin_uuid;
    END LOOP;
    
    RAISE NOTICE 'UUID único gerado: %', admin_uuid;
    
    -- ========================================
    -- CRIAR USUÁRIO EM AUTH.USERS
    -- ========================================
    
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        admin_uuid,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('name', admin_name),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
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
    
    RAISE NOTICE 'Usuário criado em public.users com ID: %', admin_uuid;
    
    -- ========================================
    -- VERIFICAÇÃO FINAL
    -- ========================================
    
    -- Verificar se o usuário foi criado corretamente
    IF EXISTS (
        SELECT 1 FROM auth.users au
        JOIN public.users pu ON au.id = pu.id
        WHERE au.email = admin_email 
        AND pu.is_admin = true
        AND au.id = admin_uuid
        AND pu.id = admin_uuid
    ) THEN
        RAISE NOTICE '✅ SUCESSO: Usuário admin criado com sucesso!';
        RAISE NOTICE 'Email: %', admin_email;
        RAISE NOTICE 'Senha: %', admin_password;
        RAISE NOTICE 'UUID: %', admin_uuid;
    ELSE
        RAISE EXCEPTION '❌ ERRO: Falha na verificação do usuário admin';
    END IF;
    
END $$;

-- ========================================
-- VERIFICAÇÃO ADICIONAL
-- ========================================

-- Mostrar informações do admin criado
SELECT 
    'Admin criado com sucesso!' as status,
    au.id,
    au.email,
    au.email_confirmed_at,
    pu.name,
    pu.is_admin,
    pu.created_at
FROM auth.users au
JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'admin@luna.com';