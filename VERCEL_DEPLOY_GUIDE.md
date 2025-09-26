# 🚀 Deploy no Vercel - Vista Loja Luna

## ✅ Pré-requisitos Completos
- ✅ Código commitado no GitHub
- ✅ Configurações de deploy criadas
- ✅ Build testado e funcionando
- ✅ Variáveis de ambiente prontas

---

## 🎯 **DEPLOY NO VERCEL - PASSO A PASSO**

### **1. Acessar o Vercel**
1. Vá para: **https://vercel.com**
2. Clique em **"Login"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

### **2. Criar Novo Projeto**
1. No dashboard do Vercel, clique em **"New Project"**
2. Procure por **"vista-loja-luna"** na lista de repositórios
3. Clique em **"Import"** no repositório correto

### **3. Configurar o Projeto**

#### **Framework Detection:**
- ✅ Vercel detectará automaticamente: **"Vite"**
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

#### **⚠️ NÃO CLIQUE EM DEPLOY AINDA!**

### **4. Configurar Variáveis de Ambiente**

Na seção **"Environment Variables"**, adicione **EXATAMENTE** estas variáveis:

#### **Variável 1:**
```
Name: VITE_SUPABASE_PROJECT_ID
Value: oiqwxcchqghjlanviwso
```

#### **Variável 2:**
```
Name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcXd4Y2NocWdoamxhbnZpd3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDQ2NjQsImV4cCI6MjA3NDQyMDY2NH0.jjiuwkqw0UpVTQEZkNZyVBp1f-oP0hEUv6Iw8Ky_TJM
```

#### **Variável 3:**
```
Name: VITE_SUPABASE_URL
Value: https://oiqwxcchqghjlanviwso.supabase.co
```

### **5. Deploy!**
1. Após adicionar todas as 3 variáveis, clique em **"Deploy"**
2. Aguarde o processo de build (2-5 minutos)
3. ✅ **Deploy concluído!**

---

## 🌐 **Sua Aplicação Estará Disponível Em:**

```
https://vista-loja-luna.vercel.app
```
*(ou similar, dependendo da disponibilidade do nome)*

---

## 🔧 **Configurar Supabase para Produção**

### **1. Acessar Dashboard do Supabase**
1. Vá para: **https://supabase.com/dashboard**
2. Selecione seu projeto: **oiqwxcchqghjlanviwso**

### **2. Configurar URLs Permitidas**
1. Vá em **Settings** → **Authentication**
2. Na seção **"Site URL"**, adicione:
   ```
   https://vista-loja-luna.vercel.app
   ```

3. Na seção **"Redirect URLs"**, adicione:
   ```
   https://vista-loja-luna.vercel.app/login
   https://vista-loja-luna.vercel.app/register
   https://vista-loja-luna.vercel.app/**
   ```

### **3. Salvar Configurações**
- Clique em **"Save"**
- As mudanças são aplicadas imediatamente

---

## 🧪 **Testar a Aplicação**

### **Funcionalidades para Testar:**
1. **✅ Navegação**: Todas as páginas carregam
2. **✅ Login Admin**: 
   - Email: `admin@vistalojluna.com`
   - Senha: `admin123`
3. **✅ Registro**: Criar nova conta
4. **✅ Carrinho**: Adicionar/remover produtos
5. **✅ Favoritos**: Marcar/desmarcar favoritos
6. **✅ Responsivo**: Testar no mobile

---

## 🔄 **Atualizações Automáticas**

### **Deploy Automático:**
- ✅ Cada `git push` para `main` faz deploy automático
- ✅ Preview deployments para outras branches
- ✅ Rollback automático em caso de erro

### **Para Atualizar:**
```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

---

## 🚨 **Troubleshooting**

### **Erro de Build:**
1. Verifique se todas as 3 variáveis estão configuradas
2. Confirme que não há espaços extras nos valores
3. Redeploy: Settings → Functions → Redeploy

### **Erro de Login:**
1. Verifique as URLs no Supabase
2. Confirme que as variáveis estão corretas
3. Teste localmente primeiro

### **Erro 404:**
- O arquivo `vercel.json` já está configurado
- Todas as rotas redirecionam para `index.html`

---

## 📊 **Monitoramento**

### **Dashboard do Vercel:**
- 📈 **Analytics**: Visualizações e performance
- 🔍 **Logs**: Erros e debugging
- ⚡ **Speed Insights**: Métricas de velocidade

### **URLs Importantes:**
- **Dashboard**: https://vercel.com/dashboard
- **Projeto**: https://vercel.com/seu-usuario/vista-loja-luna
- **Analytics**: https://vercel.com/seu-usuario/vista-loja-luna/analytics

---

## 🎉 **Parabéns!**

Sua aplicação **Vista Loja Luna** está agora rodando na nuvem com:

- ✅ **Deploy automático** via GitHub
- ✅ **SSL/HTTPS** automático
- ✅ **CDN global** para performance
- ✅ **Domínio personalizado** disponível
- ✅ **Monitoramento** integrado

**🌐 Acesse sua loja online e compartilhe com o mundo!**