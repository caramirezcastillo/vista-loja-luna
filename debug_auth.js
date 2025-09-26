import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://oiqwxcchqghjlanviwso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcXd4Y2NocWdoamxhbnZpd3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDQ2NjQsImV4cCI6MjA3NDQyMDY2NH0.jjiuwkqw0UpVTQEZkNZyVBp1f-oP0hEUv6Iw8Ky_TJM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simular exatamente o que o AuthContext faz
const fetchUserProfile = async (supabaseUser) => {
  try {
    console.log('🔍 Buscando perfil do usuário:', supabaseUser.email);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      return null;
    }

    console.log('✅ Perfil encontrado:', data);
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      isAdmin: data.is_admin || false
    };
    
    console.log('🔄 Usuário mapeado:', user);
    return user;
  } catch (error) {
    console.error('💥 Erro inesperado ao buscar perfil:', error);
    return null;
  }
};

async function debugAuthFlow() {
  console.log('🚀 Iniciando debug do fluxo de autenticação...');
  
  try {
    // 1. Fazer login
    console.log('\n1️⃣ Fazendo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@vistalojluna.com',
      password: 'Admin123!'
    });

    if (authError) {
      console.error('❌ Erro no login:', authError.message);
      return;
    }

    console.log('✅ Login OK - Usuário autenticado:', authData.user.email);

    // 2. Buscar perfil (como o AuthContext faz)
    console.log('\n2️⃣ Buscando perfil...');
    const userData = await fetchUserProfile(authData.user);
    
    if (!userData) {
      console.error('❌ Falha ao carregar perfil');
      return;
    }

    // 3. Simular o contexto
    console.log('\n3️⃣ Simulando contexto...');
    const contextValue = {
      user: userData,
      isAuthenticated: !!userData,
      isAdmin: userData?.isAdmin || false
    };

    console.log('📊 Valor do contexto:');
    console.log('- user:', contextValue.user);
    console.log('- isAuthenticated:', contextValue.isAuthenticated);
    console.log('- isAdmin:', contextValue.isAdmin);

    // 4. Verificar se o menu admin deveria aparecer
    console.log('\n4️⃣ Verificação do menu admin:');
    if (contextValue.isAuthenticated && contextValue.isAdmin) {
      console.log('✅ MENU ADMIN DEVE APARECER!');
    } else {
      console.log('❌ Menu admin NÃO vai aparecer');
      console.log('- isAuthenticated:', contextValue.isAuthenticated);
      console.log('- isAdmin:', contextValue.isAdmin);
    }

    // Fazer logout
    await supabase.auth.signOut();
    console.log('\n👋 Logout realizado');

  } catch (error) {
    console.error('💥 Erro inesperado:', error);
  }
}

debugAuthFlow();