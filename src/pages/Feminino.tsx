import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
}

const FemininoProductCard = ({ product }: { product: Product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M",
      color: "Padrão",
      quantity: 1
    });
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  return (
    <div 
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1">
              Novo
            </Badge>
          )}
          {product.onSale && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1">
              Sale
            </Badge>
          )}
        </div>

        {/* Heart Icon */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
        >
          <Heart 
            className={`w-4 h-4 transition-colors duration-200 ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </button>

        {/* Hover Actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button 
              onClick={handleAddToCart}
              className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${
                  i < product.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`} 
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Feminino = () => {
  const femininoProducts: Product[] = [
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
            <FemininoProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Feminino;