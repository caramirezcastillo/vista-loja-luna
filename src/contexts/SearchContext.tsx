import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description?: string;
  inStock?: boolean;
  stockQuantity?: number;
  isSale?: boolean;
  isNew?: boolean;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  setFilteredProducts: (products: Product[]) => void;
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
  searchProducts: (products: Product[], term: string) => Product[];
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  const searchProducts = (products: Product[], term: string): Product[] => {
    if (!term.trim()) {
      return products;
    }

    const searchTermLower = term.toLowerCase().trim();
    
    return products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchTermLower);
      const categoryMatch = product.category.toLowerCase().includes(searchTermLower);
      const descriptionMatch = product.description?.toLowerCase().includes(searchTermLower) || false;
      
      return nameMatch || categoryMatch || descriptionMatch;
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredProducts([]);
    setIsSearchActive(false);
  };

  const value: SearchContextType = {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    setFilteredProducts,
    isSearchActive,
    setIsSearchActive,
    searchProducts,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};