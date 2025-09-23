import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from '../integrations/supabase/client';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  onSale?: boolean;
  rating?: number;
  stockQuantity?: number;
  inStock?: boolean;
}

const Feminino = () => {
  const [femininoProducts, setFemininoProducts] = useState<Product[]>([]);

  // Produtos padrão
  const defaultFemininoProducts: Product[] = [
    {
      id: 1,
      name: "Vestido Floral Elegante",
      price: 189.90,
      originalPrice: 249.90,
      image: "/src/assets/product-dress.jpg",
      category: "Vestidos",
      isNew: true,
      onSale: true,
      rating: 5
    },
    {
      id: 2,
      name: "Blusa Feminina Casual",
      price: 79.90,
      image: "/src/assets/product-shirt.jpg",
      category: "Blusas",
      isNew: false,
      rating: 4
    },
    {
      id: 3,
      name: "Blazer Feminino Executivo",
      price: 299.90,
      originalPrice: 399.90,
      image: "/src/assets/product-blazer.jpg",
      category: "Blazers",
      onSale: true,
      rating: 5
    },
    {
      id: 4,
      name: "Bolsa Feminina de Couro",
      price: 159.90,
      image: "/src/assets/product-bag.jpg",
      category: "Acessórios",
      isNew: true,
      rating: 4
    },
    {
      id: 5,
      name: "Saia Midi Plissada",
      price: 129.90,
      image: "/src/assets/product-dress.jpg",
      category: "Saias",
      rating: 4
    },
    {
      id: 6,
      name: "Cardigan Feminino",
      price: 149.90,
      originalPrice: 199.90,
      image: "/src/assets/product-shirt.jpg",
      category: "Cardigans",
      onSale: true,
      rating: 5
    },
    {
      id: 7,
      name: "Calça Jeans Skinny",
      price: 119.90,
      image: "/src/assets/product-blazer.jpg",
      category: "Calças",
      isNew: true,
      rating: 4
    },
    {
      id: 8,
      name: "Top Cropped Estampado",
      price: 59.90,
      image: "/src/assets/product-shirt.jpg",
      category: "Tops",
      rating: 4
    }
  ];

  // Carregar produtos do Supabase ou localStorage como fallback
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Tentar carregar do Supabase primeiro
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'feminino')
          .eq('in_stock', true)
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
            onSale: p.original_price && p.original_price > p.price,
            isNew: false,
            rating: 5 // Valor padrão
          }));
          setFemininoProducts([...supabaseProducts, ...defaultFemininoProducts]);
          return;
        }
      } catch (error) {
        console.error('Erro ao carregar produtos femininos do Supabase:', error);
      }

      // Fallback para localStorage
      const savedProducts = localStorage.getItem('adminProducts');
      let filteredProducts = defaultFemininoProducts;
      
      if (savedProducts) {
        const adminProducts = JSON.parse(savedProducts);
        // Filtrar produtos femininos do admin
        const femininoFromAdmin = adminProducts.filter((product: Product) => 
          product.category === 'feminino' && product.inStock !== false
        );
        
        if (femininoFromAdmin.length > 0) {
          filteredProducts = [...femininoFromAdmin, ...defaultFemininoProducts];
        }
      }

      setFemininoProducts(filteredProducts);
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Moda Feminina
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Descubra as últimas tendências em moda feminina
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Vestidos
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Blusas
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Blazers
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Acessórios
            </Badge>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Produtos Femininos ({femininoProducts.length})
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Filtrar
            </Button>
            <Button variant="outline" size="sm">
              Ordenar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {femininoProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              category={product.category}
              isNew={product.isNew}
              isSale={product.onSale}
              stockQuantity={product.stockQuantity || 0}
              inStock={product.inStock !== false}
            />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Feminino;