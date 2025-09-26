const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

// Cliente anônimo (público)
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Cliente admin (se disponível)
const supabaseAdmin = supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  }) : null;

async function testRLSPolicies() {
  console.log('🔒 Testando Políticas RLS...\n');

  try {
    // ========================================
    // TESTE 1: Acesso público aos produtos
    // ========================================
    console.log('📦 TESTE 1: Acesso público aos produtos');
    const { data: products, error: productsError } = await supabaseAnon
      .from('products')
      .select('*')
      .limit(5);

    if (productsError) {
      console.error('❌ Erro ao acessar produtos:', productsError.message);
    } else {
      console.log(`✅ Sucesso: ${products.length} produtos acessíveis publicamente`);
    }

    // ========================================
    // TESTE 2: Acesso público aos usuários
    // ========================================
    console.log('\n👥 TESTE 2: Acesso público aos usuários');
    const { data: users, error: usersError } = await supabaseAnon
      .from('users')
      .select('id, name, email, is_admin')
      .limit(5);

    if (usersError) {
      console.error('❌ Erro ao acessar usuários:', usersError.message);
    } else {
      console.log(`✅ Sucesso: ${users.length} usuários acessíveis publicamente`);
      if (users.length > 0) {
        console.log('   Exemplo:', users[0]);
      }
    }

    // ========================================
    // TESTE 3: Tentativa de inserção anônima em produtos (deve falhar)
    // ========================================
    console.log('\n🚫 TESTE 3: Tentativa de inserção anônima em produtos');
    const { error: insertProductError } = await supabaseAnon
      .from('products')
      .insert({
        name: 'Produto Teste',
        price: 99.99,
        image: 'test.jpg',
        category: 'teste'
      });

    if (insertProductError) {
      console.log('✅ Sucesso: Inserção bloqueada corretamente -', insertProductError.message);
    } else {
      console.error('❌ Erro: Inserção deveria ter sido bloqueada!');
    }

    // ========================================
    // TESTE 4: Inserção pública em usuários (deve funcionar)
    // ========================================
    console.log('\n👤 TESTE 4: Inserção pública em usuários');
    const testEmail = `teste_${Date.now()}@example.com`;
    const { data: newUser, error: insertUserError } = await supabaseAnon
      .from('users')
      .insert({
        name: 'Usuário Teste',
        email: testEmail,
        is_admin: false
      })
      .select()
      .single();

    if (insertUserError) {
      console.error('❌ Erro ao inserir usuário:', insertUserError.message);
    } else {
      console.log('✅ Sucesso: Usuário inserido publicamente');
      console.log('   ID:', newUser.id);
      
      // Limpar usuário de teste
      if (supabaseAdmin) {
        await supabaseAdmin.from('users').delete().eq('id', newUser.id);
        console.log('🧹 Usuário de teste removido');
      }
    }

    // ========================================
    // TESTE 5: Acesso a pedidos (deve falhar para anônimos)
    // ========================================
    console.log('\n📋 TESTE 5: Acesso anônimo a pedidos');
    const { data: orders, error: ordersError } = await supabaseAnon
      .from('orders')
      .select('*')
      .limit(5);

    if (ordersError) {
      console.log('✅ Sucesso: Acesso a pedidos bloqueado corretamente -', ordersError.message);
    } else {
      console.error('❌ Erro: Acesso a pedidos deveria ter sido bloqueado!');
    }

    // ========================================
    // TESTE 6: Verificar admin existente
    // ========================================
    console.log('\n🛡️ TESTE 6: Verificar usuário admin');
    const { data: adminUsers, error: adminError } = await supabaseAnon
      .from('users')
      .select('*')
      .eq('is_admin', true);

    if (adminError) {
      console.error('❌ Erro ao verificar admin:', adminError.message);
    } else {
      console.log(`✅ Sucesso: ${adminUsers.length} admin(s) encontrado(s)`);
      if (adminUsers.length > 0) {
        console.log('   Admin:', adminUsers[0].email);
      }
    }

    // ========================================
    // TESTE 7: Teste com cliente admin (se disponível)
    // ========================================
    if (supabaseAdmin) {
      console.log('\n🔑 TESTE 7: Operações com cliente admin');
      
      // Tentar inserir produto como admin
      const { data: adminProduct, error: adminProductError } = await supabaseAdmin
        .from('products')
        .insert({
          name: 'Produto Admin Teste',
          price: 199.99,
          image: 'admin-test.jpg',
          category: 'admin-teste'
        })
        .select()
        .single();

      if (adminProductError) {
        console.error('❌ Erro ao inserir produto como admin:', adminProductError.message);
      } else {
        console.log('✅ Sucesso: Produto inserido como admin');
        
        // Limpar produto de teste
        await supabaseAdmin.from('products').delete().eq('id', adminProduct.id);
        console.log('🧹 Produto de teste removido');
      }
    } else {
      console.log('\n⚠️ TESTE 7: Pulado - SUPABASE_SERVICE_KEY não configurada');
    }

    console.log('\n🎉 Testes de RLS concluídos!');

  } catch (error) {
    console.error('❌ Erro inesperado nos testes:', error);
  }
}

// Executar os testes
testRLSPolicies();