import React, { useState, useEffect } from 'react';
import ProductCard from "./ProductCard";
import { useSearch } from "@/contexts/SearchContext";
import { supabase } from '../integrations/supabase/client';
import productDress from "@/assets/product-dress.jpg";
import productShirt from "@/assets/product-shirt.jpg";
import productBlazer from "@/assets/product-blazer.jpg";
import productBag from "@/assets/product-bag.jpg";

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

  // Produtos padrão (fallback)
  const defaultProducts: Product[] = [
    {
      id: 1,
      name: "Vestido Elegante Preto",
      price: 299.90,
      originalPrice: 399.90,
      image: productDress,
      category: "Feminino",
      isSale: true,
    },
    {
      id: 2,
      name: "Blazer Feminino Moderno",
      price: 459.90,
      image: productBlazer,
      category: "Feminino",
      isNew: true,
    },
    {
      id: 3,
      name: "Bolsa de Couro Premium",
      price: 599.90,
      originalPrice: 799.90,
      image: productBag,
      category: "Acessórios",
      isSale: true,
    },
    {
      id: 4,
      name: "Vestido Casual Elegante",
      price: 299.90,
      image: productDress,
      category: "Feminino",
    },
    {
      id: 5,
      name: "Blazer Executivo",
      price: 459.90,
      image: productBlazer,
      category: "Feminino",
    },
    {
      id: 6,
      name: "Bolsa Executiva Premium",
      price: 599.90,
      image: productBag,
      category: "Acessórios",
    },
  ];

  // Carregar produtos do Supabase ou localStorage como fallback
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Tentar carregar do Supabase primeiro
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const supabaseProducts = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.original_price,
            image: p.image,
            category: p.category,
            description: p.description,
            inStock: p.in_stock,
            stockQuantity: p.stock_quantity,
            isSale: p.original_price && p.original_price > p.price,
            isNew: false // Pode ser calculado baseado na data de criação
          }));
          setProducts(supabaseProducts);
          return;
        }
      } catch (error) {
        console.error('Erro ao carregar produtos do Supabase:', error);
      }

      // Fallback para localStorage
      const savedProducts = localStorage.getItem('adminProducts');
      if (savedProducts) {
        const adminProducts = JSON.parse(savedProducts);
        // Filtrar apenas produtos em estoque
        const availableProducts = adminProducts.filter((product: Product) => product.inStock !== false);
        
        if (availableProducts.length > 0) {
          // Combinar produtos do admin com produtos padrão
          setProducts([...availableProducts, ...defaultProducts]);
        } else {
          setProducts(defaultProducts);
        }
      } else {
        setProducts(defaultProducts);
      }
    };

    loadProducts();
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