import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://oiqwxcchqghjlanviwso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcXd4Y2NocWdoamxhbnZpd3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDQ2NjQsImV4cCI6MjA3NDQyMDY2NH0.jjiuwkqw0UpVTQEZkNZyVBp1f-oP0hEUv6Iw8Ky_TJM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUserIds() {
  console.log('🔍 Verificando IDs dos usuários...');
  
  try {
    // 1. Fazer login e obter ID do Auth
    console.log('\n1️⃣ Fazendo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@vistalojluna.com',
      password: 'Admin123!'
    });

    if (authError) {
      console.error('❌ Erro no login:', authError.message);
      return;
    }

    console.log('✅ Login OK');
    console.log('🆔 ID do Auth:', authData.user.id);
    console.log('📧 Email do Auth:', authData.user.email);

    // 2. Buscar usuário na tabela users por email
    console.log('\n2️⃣ Buscando na tabela users por email...');
    const { data: userByEmail, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@vistalojluna.com')
      .single();

    if (emailError) {
      console.error('❌ Erro ao buscar por email:', emailError);
    } else {
      console.log('✅ Usuário encontrado por email:');
      console.log('🆔 ID na tabela users:', userByEmail.id);
      console.log('📧 Email na tabela users:', userByEmail.email);
      console.log('👑 is_admin:', userByEmail.is_admin);
    }

    // 3. Buscar usuário na tabela users por ID do Auth
    console.log('\n3️⃣ Buscando na tabela users por ID do Auth...');
    const { data: userById, error: idError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (idError) {
      console.error('❌ Erro ao buscar por ID do Auth:', idError.message);
      console.log('⚠️ PROBLEMA: O ID do Auth não existe na tabela users!');
    } else {
      console.log('✅ Usuário encontrado por ID do Auth:', userById);
    }

    // 4. Comparar IDs
    console.log('\n4️⃣ Comparação de IDs:');
    console.log('- ID do Auth:     ', authData.user.id);
    if (userByEmail) {
      console.log('- ID na tabela:   ', userByEmail.id);
      console.log('- IDs são iguais: ', authData.user.id === userByEmail.id);
    }

    if (authData.user.id !== userByEmail?.id) {
      console.log('\n🚨 PROBLEMA IDENTIFICADO:');
      console.log('O usuário admin na tabela users tem um ID diferente do Auth!');
      console.log('Isso explica por que o AuthContext não encontra o usuário.');
    }

    await supabase.auth.signOut();

  } catch (error) {
    console.error('💥 Erro inesperado:', error);
  }
}

checkUserIds();