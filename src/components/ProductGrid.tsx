import React, { useState, useEffect } from 'react';
import ProductCard from "./ProductCard";
import { useSearch } from "@/contexts/SearchContext";

interface Product {
  id: string | number;
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

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { searchTerm, isSearchActive, searchProducts } = useSearch();

  // Carregar produtos do localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      const adminProducts = JSON.parse(savedProducts);
      // Filtrar apenas produtos em estoque
      const availableProducts = adminProducts.filter((product: Product) => product.inStock !== false);
      setProducts(availableProducts);
    } else {
      setProducts([]);
    }
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isSearchActive && searchTerm ? `Resultados para "${searchTerm}"` : 'Produtos em Destaque'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isSearchActive && searchTerm 
              ? `Encontramos ${searchProducts(products, searchTerm).length} produto(s) para sua busca.`
              : 'Descubra nossa seleção cuidadosa de peças exclusivas para todos os estilos e ocasiões.'
            }
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(isSearchActive && searchTerm ? searchProducts(products, searchTerm) : products).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* No Products Message */}
        {(!isSearchActive || !searchTerm) && products.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-4">
              Nenhum produto cadastrado ainda
            </p>
            <p className="text-sm text-muted-foreground">
              Os produtos cadastrados no painel do admin aparecerão aqui.
            </p>
          </div>
        )}

        {/* No Results Message */}
        {isSearchActive && searchTerm && searchProducts(products, searchTerm).length === 0 && (
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-4">
              Nenhum produto encontrado para "{searchTerm}"
            </p>
            <p className="text-sm text-muted-foreground">
              Tente buscar por outros termos ou navegue por nossas categorias.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProductGrid;