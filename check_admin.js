import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://oiqwxcchqghjlanviwso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcXd4Y2NocWdoamxhbnZpd3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDQ2NjQsImV4cCI6MjA3NDQyMDY2NH0.jjiuwkqw0UpVTQEZkNZyVBp1f-oP0hEUv6Iw8Ky_TJM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdminUser() {
  console.log('🔍 Verificando usuário admin...');
  
  try {
    // Primeiro, fazer login com as credenciais admin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@vistalojluna.com',
      password: 'Admin123!'
    });

    if (authError) {
      console.error('❌ Erro ao fazer login:', authError.message);
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log('👤 Usuário autenticado:', authData.user.email);

    // Agora buscar dados do usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@vistalojluna.com')
      .single();

    if (userError) {
      console.error('❌ Erro ao buscar dados do usuário:', userError.message);
      return;
    }

    console.log('📊 Dados do usuário na tabela users:');
    console.log('- ID:', userData.id);
    console.log('- Nome:', userData.name);
    console.log('- Email:', userData.email);
    console.log('- is_admin:', userData.is_admin);
    console.log('- Criado em:', userData.created_at);

    if (userData.is_admin) {
      console.log('✅ Usuário é ADMIN - Painel deve aparecer!');
    } else {
      console.log('❌ Usuário NÃO é admin - Painel não vai aparecer!');
    }

    // Fazer logout
    await supabase.auth.signOut();
    console.log('👋 Logout realizado');

  } catch (error) {
    console.error('💥 Erro inesperado:', error);
  }
}

checkAdminUser();