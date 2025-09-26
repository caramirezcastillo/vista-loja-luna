import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Interface para o usuário da aplicação
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto de autenticação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do perfil do usuário
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      console.log('🔍 Buscando perfil do usuário:', supabaseUser.email);
      
      // Primeiro tentar buscar por ID
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      // Se não encontrar por ID, tentar buscar por email (para casos de ID desatualizado)
      if (error && error.code === 'PGRST116') {
        console.log('🔄 Não encontrado por ID, tentando buscar por email...');
        
        const { data: emailData, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', supabaseUser.email!)
          .single();

        if (!emailError && emailData) {
          console.log('✅ Usuário encontrado por email:', emailData);
          
          // Atualizar o ID na tabela para corresponder ao Auth
          console.log('🔄 Atualizando ID na tabela users...');
          const { data: updatedData, error: updateError } = await supabase
            .from('users')
            .update({ 
              id: supabaseUser.id,
              updated_at: new Date().toISOString()
            })
            .eq('email', supabaseUser.email!)
            .select()
            .single();

          if (updateError) {
            console.error('❌ Erro ao atualizar ID:', updateError);
            // Usar dados encontrados por email mesmo sem atualizar ID
            data = emailData;
            error = null;
          } else {
            console.log('✅ ID atualizado com sucesso');
            data = updatedData;
            error = null;
          }
        }
      }

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        
        // Se o usuário não existe na tabela users, criar automaticamente
        if (error.code === 'PGRST116') {
          console.log('👤 Criando perfil automático para:', supabaseUser.email);
          
          const newUser = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
            email: supabaseUser.email!,
            is_admin: false
          };

          const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

          if (insertError) {
            console.error('❌ Erro ao criar perfil automático:', insertError);
            return null;
          }

          console.log('✅ Perfil criado automaticamente:', insertData);
          return {
            id: insertData.id,
            name: insertData.name,
            email: insertData.email,
            isAdmin: insertData.is_admin || false
          };
        }
        
        return null;
      }

      console.log('✅ Perfil encontrado:', data);
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        isAdmin: data.is_admin || false
      };
    } catch (error) {
      console.error('💥 Erro inesperado ao buscar perfil:', error);
      return null;
    }
  };

  // Configurar listener de autenticação
  useEffect(() => {
    console.log('🚀 Inicializando AuthContext...');

    // Configurar listener de mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Estado de autenticação mudou:', event, session?.user?.email);
        
        // Tratar erros de refresh token
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.log('⚠️ Falha no refresh do token, limpando sessão...');
          setUser(null);
          setSession(null);
          localStorage.removeItem('user');
          setLoading(false);
          return;
        }

        // Tratar erro de token inválido
        if (event === 'SIGNED_OUT' && session === null) {
          console.log('🚪 Sessão expirada ou token inválido, limpando dados...');
          setUser(null);
          setSession(null);
          localStorage.removeItem('user');
          setLoading(false);
          return;
        }
        
        setSession(session);
        
        if (session?.user) {
          // Buscar dados do perfil do usuário
          const userData = await fetchUserProfile(session.user);
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('✅ Usuário logado:', userData.email);
          } else {
            console.log('❌ Falha ao carregar perfil do usuário');
            setUser(null);
            localStorage.removeItem('user');
          }
        } else {
          console.log('👋 Usuário deslogado');
          setUser(null);
          localStorage.removeItem('user');
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão existente com tratamento de erro
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.log('❌ Erro ao verificar sessão existente:', error.message);
        // Se há erro na sessão (como refresh token inválido), limpar tudo
        if (error.message.includes('refresh_token_not_found') || 
            error.message.includes('Invalid Refresh Token')) {
          console.log('🧹 Limpando sessão corrompida...');
          supabase.auth.signOut();
          setUser(null);
          setSession(null);
          localStorage.removeItem('user');
        }
        setLoading(false);
        return;
      }
      
      if (!session) {
        console.log('📭 Nenhuma sessão existente encontrada');
        setLoading(false);
      }
    }).catch((error) => {
      console.log('❌ Erro crítico ao verificar sessão:', error.message);
      // Limpar tudo em caso de erro crítico
      setUser(null);
      setSession(null);
      localStorage.removeItem('user');
      setLoading(false);
    });

    return () => {
      console.log('🧹 Limpando listener de autenticação');
      subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔑 Tentando login:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        setLoading(false);
        return { 
          success: false, 
          error: error.message === 'Invalid login credentials' 
            ? 'Email ou senha incorretos' 
            : error.message 
        };
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido:', data.user.email);
        // O listener onAuthStateChange cuidará do resto
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Falha na autenticação' };
    } catch (error: any) {
      console.error('💥 Erro inesperado no login:', error);
      setLoading(false);
      return { success: false, error: error.message || 'Erro inesperado' };
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📝 Tentando registrar:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim()
          }
        }
      });

      if (error) {
        console.error('❌ Erro no registro:', error);
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ Registro bem-sucedido:', data.user.email);
        
        // Se o usuário foi criado mas precisa confirmar email
        if (!data.session) {
          setLoading(false);
          return { 
            success: true, 
            error: 'Verifique seu email para confirmar a conta' 
          };
        }
        
        // O listener onAuthStateChange cuidará do resto
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Falha no registro' };
    } catch (error: any) {
      console.error('💥 Erro inesperado no registro:', error);
      setLoading(false);
      return { success: false, error: error.message || 'Erro inesperado' };
    }
  };

  // Função de logout
  const logout = async (): Promise<void> => {
    try {
      console.log('👋 Fazendo logout...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro no logout:', error);
      } else {
        console.log('✅ Logout bem-sucedido');
      }
      
      // Limpar estado local independentemente do resultado
      setUser(null);
      setSession(null);
      localStorage.removeItem('user');
      setLoading(false);
    } catch (error) {
      console.error('💥 Erro inesperado no logout:', error);
      // Limpar estado local mesmo com erro
      setUser(null);
      setSession(null);
      localStorage.removeItem('user');
      setLoading(false);
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      console.log('📝 Atualizando perfil:', data);
      
      const { error } = await supabase
        .from('users')
        .update({
          name: data.name,
          // Não permitir atualização de is_admin via esta função
        })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Erro ao atualizar perfil:', error);
        return { success: false, error: error.message };
      }

      // Atualizar estado local
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('✅ Perfil atualizado com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('💥 Erro inesperado ao atualizar perfil:', error);
      return { success: false, error: error.message || 'Erro inesperado' };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};