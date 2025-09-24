import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Carregar favoritos do Supabase quando usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavoritesFromSupabase();
    } else {
      // Carregar do localStorage se não estiver autenticado
      loadFavoritesFromLocalStorage();
    }
  }, [isAuthenticated, user]);

  const loadFavoritesFromSupabase = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('🔄 Carregando favoritos do Supabase...');
      
      const { data: favoritesData, error } = await supabase
        .from('favorites')
        .select(`
          product_id,
          products (
            id,
            name,
            price,
            image,
            category
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erro ao carregar favoritos do Supabase:', error);
        // Fallback para localStorage
        loadFavoritesFromLocalStorage();
        return;
      }

      if (favoritesData) {
        const formattedFavorites = favoritesData
          .filter(fav => fav.products) // Filtrar apenas favoritos com produtos válidos
          .map(fav => ({
            id: parseInt(fav.products.id),
            name: fav.products.name,
            price: fav.products.price,
            image: fav.products.image,
            category: fav.products.category
          }));
        
        setFavorites(formattedFavorites);
        console.log('✅ Favoritos carregados do Supabase:', formattedFavorites.length);
      }
    } catch (error) {
      console.error('💥 Erro ao carregar favoritos:', error);
      loadFavoritesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFavoritesFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem('userFavorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
        console.log('📱 Favoritos carregados do localStorage:', parsedFavorites.length);
      } catch (error) {
        console.error('Erro ao carregar favoritos do localStorage:', error);
        localStorage.removeItem('userFavorites');
      }
    }
  };

  // Salvar favoritos no localStorage sempre que a lista mudar (backup)
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('userFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = async (product: Product) => {
    if (isAuthenticated && user) {
      try {
        console.log('➕ Adicionando favorito no Supabase:', product.name);
        
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id.toString()
          });

        if (error) {
          console.error('❌ Erro ao adicionar favorito no Supabase:', error);
          // Fallback para localStorage
          addToFavoritesLocal(product);
          return;
        }

        console.log('✅ Favorito adicionado no Supabase com sucesso!');
        // Atualizar estado local
        setFavorites(prev => {
          const exists = prev.find(item => item.id === product.id);
          if (!exists) {
            return [...prev, product];
          }
          return prev;
        });
      } catch (error) {
        console.error('💥 Erro ao adicionar favorito:', error);
        addToFavoritesLocal(product);
      }
    } else {
      addToFavoritesLocal(product);
    }
  };

  const addToFavoritesLocal = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (!exists) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromFavorites = async (productId: number) => {
    if (isAuthenticated && user) {
      try {
        console.log('➖ Removendo favorito do Supabase:', productId);
        
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId.toString());

        if (error) {
          console.error('❌ Erro ao remover favorito do Supabase:', error);
          // Fallback para localStorage
          removeFromFavoritesLocal(productId);
          return;
        }

        console.log('✅ Favorito removido do Supabase com sucesso!');
        // Atualizar estado local
        setFavorites(prev => prev.filter(item => item.id !== productId));
      } catch (error) {
        console.error('💥 Erro ao remover favorito:', error);
        removeFromFavoritesLocal(productId);
      }
    } else {
      removeFromFavoritesLocal(productId);
    }
  };

  const removeFromFavoritesLocal = (productId: number) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  const isFavorite = (productId: number) => {
    return favorites.some(item => item.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const clearFavorites = async () => {
    if (isAuthenticated && user) {
      try {
        console.log('🗑️ Limpando favoritos do Supabase...');
        
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          console.error('❌ Erro ao limpar favoritos do Supabase:', error);
        } else {
          console.log('✅ Favoritos limpos do Supabase com sucesso!');
        }
      } catch (error) {
        console.error('💥 Erro ao limpar favoritos:', error);
      }
    }
    
    // Sempre limpar estado local e localStorage
    setFavorites([]);
    localStorage.removeItem('userFavorites');
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};