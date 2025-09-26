# 🚀 Instruções para Executar Migrações no Supabase Dashboard

## 📋 Pré-requisitos
- Acesso ao [Supabase Dashboard](https://supabase.com/dashboard)
- Projeto Supabase criado e configurado
- Permissões de administrador no projeto

## 🔧 Passo a Passo

### 1️⃣ **Acessar o SQL Editor**
1. Faça login no [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral esquerdo, clique em **"SQL Editor"**
4. Clique em **"New query"** para criar uma nova consulta

### 2️⃣ **Executar a Migração Principal**
1. Copie todo o conteúdo do arquivo `999_clean_schema_rebuild.sql` (fornecido abaixo)
2. Cole no editor SQL
3. Clique em **"Run"** ou pressione `Ctrl + Enter`
4. ⚠️ **Aguarde a execução completa** (pode levar alguns segundos)

### 3️⃣ **Verificar a Execução**
Após executar a migração, verifique se as tabelas foram criadas:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 4️⃣ **Criar Usuário Admin (Opcional)**
Se precisar criar um usuário administrador:

1. Abra uma nova query no SQL Editor
2. Copie e execute o script de criação de admin (fornecido na seção seguinte)
3. **Importante**: Substitua `sua_senha_segura` por uma senha forte

## ⚠️ **Avisos Importantes**

- ✅ **Backup**: Esta migração limpa e reconstrói o schema completo
- ✅ **Dados**: Tabelas existentes serão mantidas, apenas políticas serão recriadas
- ✅ **RLS**: Row Level Security será reconfigurado com políticas otimizadas
- ✅ **Performance**: Índices serão criados para melhor performance

## 🔍 **Troubleshooting**

### Erro: "relation already exists"
- **Solução**: Normal, a migração usa `CREATE TABLE IF NOT EXISTS`

### Erro: "policy already exists"
- **Solução**: A migração remove políticas antigas antes de criar novas

### Erro de permissão
- **Solução**: Certifique-se de estar logado como proprietário do projeto

## 📊 **Estrutura Final**

Após a migração, você terá:
- ✅ **products** - Catálogo de produtos
- ✅ **users** - Usuários sincronizados com auth.users
- ✅ **orders** - Pedidos dos clientes
- ✅ **order_items** - Itens dos pedidos
- ✅ **favorites** - Favoritos dos usuários
- ✅ **Políticas RLS** configuradas
- ✅ **Índices** para performance
- ✅ **Triggers** para updated_at automático

## 🎯 **Próximos Passos**
1. Executar a migração principal ✅
2. Criar usuário admin (se necessário)
3. Testar a aplicação
4. Configurar dados iniciais (produtos)