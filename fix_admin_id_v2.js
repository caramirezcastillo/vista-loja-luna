import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://oiqwxcchqghjlanviwso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcXd4Y2NocWdoamxhbnZpd3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDQ2NjQsImV4cCI6MjA3NDQyMDY2NH0.jjiuwkqw0UpVTQEZkNZyVBp1f-oP0hEUv6Iw8Ky_TJM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixAdminIdV2() {
  console.log('🔧 Corrigindo ID do usuário admin (versão 2)...');
  
  try {
    // 1. Fazer login para obter o ID correto do Auth
    console.log('\n1️⃣ Fazendo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@vistalojluna.com',
      password: 'Admin123!'
    });

    if (authError) {
      console.error('❌ Erro no login:', authError.message);
      return;
    }

    const correctAuthId = authData.user.id;
    console.log('✅ Login OK - ID correto do Auth:', correctAuthId);

    // 2. Buscar o registro atual na tabela users
    console.log('\n2️⃣ Buscando registro atual...');
    const { data: currentUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@vistalojluna.com')
      .single();

    if (findError) {
      console.error('❌ Erro ao buscar usuário atual:', findError.message);
      return;
    }

    console.log('📊 Usuário atual:', currentUser);
    console.log('- ID atual:', currentUser.id);
    console.log('- ID correto:', correctAuthId);

    if (currentUser.id === correctAuthId) {
      console.log('✅ IDs já coincidem! Nenhuma correção necessária.');
      return;
    }

    // 3. Verificar se já existe um usuário com o ID correto
    console.log('\n3️⃣ Verificando se ID correto já existe...');
    const { data: existingUser, error: existError } = await supabase
      .from('users')
      .select('*')
      .eq('id', correctAuthId)
      .single();

    if (!existError && existingUser) {
      console.log('⚠️ Já existe um usuário com o ID correto:', existingUser);
      console.log('Deletando o registro antigo...');
      
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', currentUser.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar registro antigo:', deleteError.message);
        return;
      }
      
      console.log('✅ Registro antigo deletado. Usando o existente.');
    } else {
      // 4. Criar novo registro com ID correto e deletar o antigo
      console.log('\n4️⃣ Criando novo registro com ID correto...');
      const newUserData = {
        id: correctAuthId,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        is_admin: true,
        created_at: currentUser.created_at,
        updated_at: new Date().toISOString()
      };

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert(newUserData)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao criar novo registro:', insertError.message);
        return;
      }

      console.log('✅ Novo registro criado:', newUser);

      // 5. Deletar o registro antigo
      console.log('\n5️⃣ Deletando registro antigo...');
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', currentUser.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar registro antigo:', deleteError.message);
        // Não retornar aqui, pois o novo já foi criado
      } else {
        console.log('✅ Registro antigo deletado');
      }
    }

    // 6. Verificar se está funcionando
    console.log('\n6️⃣ Verificando correção...');
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', correctAuthId)
      .single();

    if (verifyError) {
      console.error('❌ Erro na verificação:', verifyError.message);
      return;
    }

    console.log('✅ Verificação OK:', verifyUser);
    console.log('🎉 CORREÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('- ID do Auth:', correctAuthId);
    console.log('- ID na tabela:', verifyUser.id);
    console.log('- IDs coincidem:', correctAuthId === verifyUser.id);
    console.log('- is_admin:', verifyUser.is_admin);

    await supabase.auth.signOut();

  } catch (error) {
    console.error('💥 Erro inesperado:', error);
  }
}

fixAdminIdV2();