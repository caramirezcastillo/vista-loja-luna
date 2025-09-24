// Debug script para testar conexão Supabase e registro de usuários
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ruqiuqfjjmavcmkciodx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1cWl1cWZqam1hdmNta2Npb2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NDU2OTksImV4cCI6MjA3NDAyMTY5OX0.phJu4tCQEs0kJeFDA3fc7g8jPPbztXgXlBRJJgjZCnY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function debugSupabase() {
    console.log('🔍 Iniciando debug do Supabase...\n');
    
    // 1. Testar conexão básica
    console.log('1️⃣ Testando conexão básica...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.log('❌ Erro na conexão:', error.message);
            console.log('Detalhes:', error);
        } else {
            console.log('✅ Conexão estabelecida!');
            console.log(`📊 Total de usuários: ${data || 0}`);
        }
    } catch (err) {
        console.log('💥 Erro inesperado:', err.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 2. Verificar estrutura da tabela users
    console.log('2️⃣ Verificando tabela users...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(10);
        
        if (error) {
            console.log('❌ Erro ao acessar tabela users:', error.message);
            console.log('Código do erro:', error.code);
            console.log('Detalhes:', error.details);
        } else {
            console.log(`✅ Tabela users acessível! Encontrados ${data.length} usuários`);
            if (data.length > 0) {
                console.log('👥 Usuários encontrados:');
                data.forEach((user, index) => {
                    console.log(`  ${index + 1}. ${user.name} (${user.email}) - Admin: ${user.is_admin}`);
                });
            } else {
                console.log('📝 Tabela users está vazia');
            }
        }
    } catch (err) {
        console.log('💥 Erro inesperado:', err.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 3. Testar registro de usuário
    console.log('3️⃣ Testando registro de usuário...');
    const testEmail = `test${Date.now()}@gmail.com`;
    const testPassword = 'test123456';
    
    try {
        console.log(`📧 Registrando: ${testEmail}`);
        
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    full_name: 'Usuário Teste Debug'
                }
            }
        });
        
        if (error) {
            console.log('❌ Erro no registro:', error.message);
            console.log('Detalhes:', error);
        } else {
            console.log('✅ Usuário registrado no Auth!');
            console.log(`👤 ID: ${data.user?.id}`);
            console.log(`📧 Email: ${data.user?.email}`);
            console.log(`✉️ Confirmação necessária: ${!data.user?.email_confirmed_at}`);
            
            // Aguardar um pouco para o trigger executar
            console.log('\n⏳ Aguardando trigger executar...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Verificar se o usuário foi criado na tabela users
            console.log('🔍 Verificando se usuário foi criado na tabela users...');
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user?.id);
            
            if (userError) {
                console.log('❌ Erro ao buscar usuário na tabela users:', userError.message);
            } else if (userData && userData.length > 0) {
                console.log('✅ Usuário encontrado na tabela users!');
                console.log('👤 Dados:', userData[0]);
            } else {
                console.log('❌ Usuário NÃO encontrado na tabela users!');
                console.log('🔧 Isso indica que o trigger não está funcionando.');
            }
        }
    } catch (err) {
        console.log('💥 Erro inesperado no registro:', err.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 4. Verificar se existe função de trigger
    console.log('4️⃣ Verificando função de trigger...');
    try {
        const { data, error } = await supabase.rpc('handle_new_user');
        console.log('Resultado da verificação da função:', { data, error });
    } catch (err) {
        console.log('Função handle_new_user não encontrada ou não acessível');
    }
    
    console.log('\n🏁 Debug concluído!');
}

// Executar o debug
debugSupabase().catch(console.error);