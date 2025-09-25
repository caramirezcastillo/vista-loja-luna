import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (googleUser: any) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        return null;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          name: profile.name,
          email: supabaseUser.email || '',
          isAdmin: profile.is_admin || false
        };
        return userData;
      }
    } catch (error) {
      console.error('💥 Erro ao buscar perfil:', error);
    }
    return null;
  };

  // Configurar listener de autenticação do Supabase
  useEffect(() => {    
    // Configurar listener PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          // Buscar dados do perfil do usuário com setTimeout para evitar deadlock
          setTimeout(async () => {
            const userData = await fetchUserProfile(session.user);
            if (userData) {
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            }
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          localStorage.removeItem('user');
          setLoading(false);
        }
      }
    );

    // DEPOIS verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔑 Tentando login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro no login Supabase:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido:', data.user.email);
        return { success: true };
      }

      return { success: false, error: 'Falha na autenticação' };
    } catch (error: any) {
      console.error('💥 Erro no login:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📝 Registrando usuário:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: name
          }
        }
      });

      if (error) {
        console.error('❌ Erro no registro Supabase:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ Usuário registrado:', data.user.email);
        
        if (data.user.email_confirmed_at) {
          return { success: true };
        } else {
          return { 
            success: true, 
            error: 'Verifique seu email para confirmar o cadastro' 
          };
        }
      }

      return { success: false, error: 'Falha no registro' };
    } catch (error: any) {
      console.error('💥 Erro no registro:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async (googleUser: any): Promise<boolean> => {
    // Implementar login com Google se necessário
    console.log('Google login não implementado ainda');
    return false;
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('👋 Fazendo logout...');
      await supabase.auth.signOut();
      // O onAuthStateChange vai lidar com a limpeza
    } catch (error) {
      console.error('Erro no logout:', error);
      // Limpar manualmente em caso de erro
      setUser(null);
      setSession(null);
      localStorage.removeItem('user');
    }
  };

  const isAuthenticated = !!user && !!session;
  const isAdmin = user?.isAdmin || false;

  const value: AuthContextType = {
    user,
    session,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};