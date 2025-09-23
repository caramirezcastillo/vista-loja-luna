import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Vestido Elegante",
      price: 299.90,
      image: "/src/assets/product-dress.jpg",
      quantity: 1,
      size: "M",
      color: "Preto"
    },
    {
      id: 2,
      name: "Blazer Clássico",
      price: 459.90,
      image: "/src/assets/product-blazer.jpg",
      quantity: 2,
      size: "P",
      color: "Azul Marinho"
    },
    {
      id: 3,
      name: "Bolsa de Couro",
      price: 189.90,
      image: "/src/assets/product-bag.jpg",
      quantity: 1,
      size: "Único",
      color: "Marrom"
    }
  ]);

  const addItem = async (newItem: Omit<CartItem, 'quantity'>) => {
    // Verificar estoque no Supabase primeiro, depois localStorage como fallback
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity, in_stock')
        .eq('id', newItem.id.toString())
        .single();

      if (!error && data) {
        if (!data.in_stock || data.stock_quantity <= 0) {
          // Produto fora de estoque no Supabase
          return;
        }
        
        // Decrementar estoque no Supabase
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: Math.max(0, data.stock_quantity - 1),
            in_stock: data.stock_quantity - 1 > 0
          })
          .eq('id', newItem.id.toString());

        if (updateError) {
          console.error('Erro ao atualizar estoque no Supabase:', updateError);
        }
      } else {
        // Fallback para localStorage se não encontrar no Supabase
        const savedProducts = localStorage.getItem('adminProducts');
        let products = [];
        if (savedProducts) {
          products = JSON.parse(savedProducts);
        }
        
        const product = products.find((p: any) => p.id === newItem.id.toString());
        if (product && product.stockQuantity !== undefined) {
          if (product.stockQuantity <= 0) {
            // Produto fora de estoque
            return;
          }
          
          // Decrementar estoque
          const updatedProducts = products.map((p: any) => 
            p.id === newItem.id.toString() 
              ? { ...p, stockQuantity: Math.max(0, p.stockQuantity - 1), inStock: p.stockQuantity - 1 > 0 }
              : p
          );
          localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        }
      }
    } catch (error) {
      console.error('Erro ao verificar estoque:', error);
      // Fallback para localStorage em caso de erro
      const savedProducts = localStorage.getItem('adminProducts');
      let products = [];
      if (savedProducts) {
        products = JSON.parse(savedProducts);
      }
      
      const product = products.find((p: any) => p.id === newItem.id.toString());
      if (product && product.stockQuantity !== undefined) {
        if (product.stockQuantity <= 0) {
          return;
        }
        
        const updatedProducts = products.map((p: any) => 
          p.id === newItem.id.toString() 
            ? { ...p, stockQuantity: Math.max(0, p.stockQuantity - 1), inStock: p.stockQuantity - 1 > 0 }
            : p
        );
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      }
    }
    
    setItems(currentItems => {
      const existingItem = currentItems.find(item => 
        item.id === newItem.id && 
        item.size === newItem.size && 
        item.color === newItem.color
      );
      
      if (existingItem) {
        return currentItems.map(item => 
          item.id === existingItem.id && 
          item.size === existingItem.size && 
          item.color === existingItem.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};