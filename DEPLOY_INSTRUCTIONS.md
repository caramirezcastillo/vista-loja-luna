# 🚀 Guia de Deploy na Nuvem - Vista Loja Luna

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Vercel (recomendado) ou Netlify
- Projeto Supabase configurado

## 🎯 Opções de Deploy

### 1. **Vercel (Recomendado)**
✅ **Melhor para React/Vite**
✅ **Deploy automático via GitHub**
✅ **CDN global gratuito**
✅ **SSL automático**

### 2. **Netlify**
✅ **Boa alternativa**
✅ **Deploy via GitHub**
✅ **Funcionalidades extras**

### 3. **Railway**
✅ **Para aplicações full-stack**
✅ **Suporte a banco de dados**

## 🚀 Deploy no Vercel (Passo a Passo)

### **Passo 1: Preparar o Repositório**
```bash
# 1. Fazer commit de todas as alterações
git add .
git commit -m "Preparar para deploy em produção"
git push origin main

# 2. Verificar se o build funciona localmente
npm run build
npm run preview
```

### **Passo 2: Configurar Vercel**

1. **Acesse**: https://vercel.com
2. **Faça login** com sua conta GitHub
3. **Clique em "New Project"**
4. **Selecione** seu repositório `vista-loja-luna`
5. **Configure as variáveis de ambiente**:

#### **Variáveis de Ambiente Necessárias:**
```
VITE_SUPABASE_PROJECT_ID=oiqwxcchqghjlanviwso
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcXd4Y2NocWdoamxhbnZpd3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDQ2NjQsImV4cCI6MjA3NDQyMDY2NH0.jjiuwkqw0UpVTQEZkNZyVBp1f-oP0hEUv6Iw8Ky_TJM
VITE_SUPABASE_URL=https://oiqwxcchqghjlanviwso.supabase.co
```

6. **Clique em "Deploy"**

### **Passo 3: Configurar Domínio (Opcional)**
- Vercel fornece um domínio gratuito: `seu-projeto.vercel.app`
- Para domínio personalizado, configure nas configurações do projeto

## 🔧 Configurações Importantes

### **Build Settings (Vercel)**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### **Configuração do Supabase para Produção**

1. **No Dashboard do Supabase**:
   - Vá em **Settings > API**
   - Adicione sua URL do Vercel em **Site URL**
   - Adicione em **Redirect URLs**: `https://seu-dominio.vercel.app/login`

2. **Configurar CORS** (se necessário):
   ```sql
   -- No SQL Editor do Supabase
   UPDATE auth.config 
   SET site_url = 'https://seu-dominio.vercel.app';
   ```

## 🌐 URLs de Exemplo

Após o deploy, sua aplicação estará disponível em:
- **Vercel**: `https://vista-loja-luna.vercel.app`
- **Netlify**: `https://vista-loja-luna.netlify.app`

## 🔒 Segurança

### **Variáveis de Ambiente**
- ✅ **VITE_*** são expostas no frontend (OK)
- ❌ **SUPABASE_SERVICE_KEY** NÃO deve ser usada no frontend
- ✅ Use apenas chaves públicas no frontend

### **Configurações RLS (Row Level Security)**
- Certifique-se de que as políticas RLS estão ativas
- Teste todas as funcionalidades após o deploy

## 🧪 Testes Pós-Deploy

1. **Funcionalidades a testar**:
   - ✅ Login/Registro
   - ✅ Navegação entre páginas
   - ✅ Carrinho de compras
   - ✅ Favoritos
   - ✅ Painel administrativo
   - ✅ Responsividade mobile

2. **Comandos de teste**:
   ```bash
   # Testar build local antes do deploy
   npm run build
   npm run preview
   
   # Verificar se não há erros
   npm run lint
   ```

## 🚨 Troubleshooting

### **Erro de Build**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Erro de Variáveis de Ambiente**
- Verifique se todas as variáveis `VITE_*` estão configuradas
- Redeploy após adicionar variáveis

### **Erro de Roteamento**
- O arquivo `vercel.json` já está configurado para SPA
- Todas as rotas redirecionam para `index.html`

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no dashboard da plataforma
2. Teste localmente com `npm run build && npm run preview`
3. Confirme as variáveis de ambiente
4. Verifique as configurações do Supabase

---

**🎉 Parabéns! Sua aplicação estará rodando na nuvem!**