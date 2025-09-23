import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (googleUser: any) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
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

  // Verificar se há usuário logado no localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Primeiro, tentar autenticar no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (data.user && !error) {
        // Buscar perfil do usuário
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile && !profileError) {
          const userWithoutPassword = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            isAdmin: profile.is_admin || false
          };
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          return true;
        }
      }

      // Fallback para localStorage se Supabase falhar
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userWithoutPassword = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          isAdmin: foundUser.isAdmin || false
        };
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      
      // Verificar se é o admin padrão
      if (email === 'admin@modaagora.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin',
          name: 'Administrador',
          email: 'admin@modaagora.com',
          isAdmin: true
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const loginWithGoogle = async (googleUser: any): Promise<boolean> => {
    try {
      // Extrair informações do usuário do Google
      const profile = googleUser.getBasicProfile();
      const googleUserData = {
        id: `google_${profile.getId()}`,
        name: profile.getName(),
        email: profile.getEmail(),
        isAdmin: false
      };
      
      // Verificar se o usuário já existe no sistema
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      let existingUser = users.find((u: any) => u.email === googleUserData.email);
      
      if (!existingUser) {
        // Criar novo usuário se não existir
        const newUser = {
          ...googleUserData,
          password: '', // Usuários do Google não precisam de senha local
          googleId: profile.getId()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        existingUser = newUser;
      }
      
      // Fazer login
      const userWithoutPassword = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin || false
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Primeiro, tentar registrar no Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (data.user && !error) {
        // Criar perfil do usuário na tabela users usando o service_role
        try {
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              name: name,
              email: email,
              is_admin: false
            });

          if (!profileError) {
            // Fazer login automático após registro
            const userWithoutPassword = {
              id: data.user.id,
              name: name,
              email: email,
              isAdmin: false
            };
            setUser(userWithoutPassword);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            return true;
          } else {
            console.error('Erro ao criar perfil:', profileError);
          }
        } catch (profileError) {
          console.error('Erro ao criar perfil no Supabase:', profileError);
        }
      }

      // Fallback para localStorage se Supabase falhar
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        return false; // Usuário já existe
      }
      
      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        isAdmin: false
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Fazer login automático após registro
      const userWithoutPassword = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      };
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const logout = () => {
    // Fazer logout do Supabase
    supabase.auth.signOut();
    
    // Limpar estado local
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};