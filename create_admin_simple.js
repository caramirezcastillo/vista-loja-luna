import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - usando as credenciais corretas
const supabaseUrl = 'https://oiqwxcchqghjlanviwso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcXd4Y2NocWdoamxhbnZpd3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDQ2NjQsImV4cCI6MjA3NDQyMDY2NH0.jjiuwkqw0UpVTQEZkNZyVBp1f-oP0hEUv6Iw8Ky_TJM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  const adminEmail = 'admin@luna.com';
  const adminPassword = 'admin123';
  const adminName = 'Administrador Luna';

  try {
    console.log('🚀 Iniciando criação do usuário admin...');

    // 1. Verificar se já existe um admin
    console.log('🔍 Verificando usuários existentes...');
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${adminEmail},is_admin.eq.true`);

    if (checkError) {
      console.error('❌ Erro ao verificar usuários existentes:', checkError);
      return;
    }

    // 2. Remover admin existente se houver
    if (existingUsers && existingUsers.length > 0) {
      console.log('🧹 Removendo admin existente...');
      for (const user of existingUsers) {
        // Remover da tabela auth.users (usando admin API)
        const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(user.id);
        if (deleteAuthError) {
          console.warn('⚠️ Aviso ao remover de auth.users:', deleteAuthError.message);
        }

        // Remover da tabela public.users
        const { error: deletePublicError } = await supabase
          .from('users')
          .delete()
          .eq('id', user.id);
        
        if (deletePublicError) {
          console.warn('⚠️ Aviso ao remover de public.users:', deletePublicError.message);
        }
      }
      
      // Aguardar um pouco para garantir que a remoção foi processada
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 3. Criar novo usuário admin
    console.log('👤 Criando novo usuário admin...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: adminName
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário em auth.users:', authError);
      return;
    }

    console.log('✅ Usuário criado em auth.users:', authData.user.id);

    // 4. Aguardar um pouco para o trigger funcionar
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. Verificar se foi criado em public.users e atualizar para admin
    const { data: publicUser, error: publicError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (publicError || !publicUser) {
      console.log('📝 Criando registro em public.users...');
      // Se não foi criado pelo trigger, criar manualmente
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: adminName,
          email: adminEmail,
          is_admin: true
        });

      if (insertError) {
        console.error('❌ Erro ao criar em public.users:', insertError);
        return;
      }
    } else {
      console.log('🔄 Atualizando para admin...');
      // Atualizar para admin
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          is_admin: true,
          name: adminName
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('❌ Erro ao atualizar para admin:', updateError);
        return;
      }
    }

    // 6. Verificação final
    console.log('🔍 Verificação final...');
    const { data: finalCheck, error: finalError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .eq('is_admin', true)
      .single();

    if (finalError || !finalCheck) {
      console.error('❌ Erro na verificação final:', finalError);
      return;
    }

    console.log('🎉 SUCESSO! Usuário admin criado com sucesso!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Senha:', adminPassword);
    console.log('🆔 ID:', finalCheck.id);
    console.log('👤 Nome:', finalCheck.name);
    console.log('🛡️ Admin:', finalCheck.is_admin);

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar a função
createAdminUser();