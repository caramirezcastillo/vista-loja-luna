import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  onSale?: boolean;
  rating?: number;
  description?: string;
  inStock?: boolean;
  stockQuantity?: number;
}

const ShortsProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const isProductFavorite = isFavorite(Number(product.id));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleToggleFavorite = () => {
    const productData = {
      id: Number(product.id),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      isNew: product.isNew,
      isSale: product.onSale
    };
    
    const wasAlreadyFavorite = isProductFavorite;
    toggleFavorite(productData);
    
    toast({
      title: wasAlreadyFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: `${product.name} foi ${wasAlreadyFavorite ? 'removido dos' : 'adicionado aos'} seus favoritos.`,
    });
  };

  const handleAddToCart = () => {
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M", // Default size
      color: "Padrão" // Default color
    });
    
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
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
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
        >
          <Heart 
            className={`w-4 h-4 transition-colors duration-200 ${
              isProductFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
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

const Shorts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Carregar produtos do localStorage e filtrar apenas shorts
    const savedProducts = localStorage.getItem('adminProducts');
    let filteredProducts = [];

    if (savedProducts) {
      const adminProducts = JSON.parse(savedProducts);
      filteredProducts = adminProducts.filter((product: Product) => 
        product.category.toLowerCase().includes('short') && product.inStock !== false
      );
    }

    setProducts(filteredProducts);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shorts Femininos
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Conforto e estilo para os dias quentes
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Jeans
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Alfaiataria
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Esportivo
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Linho
            </Badge>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Shorts Disponíveis ({products.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ShortsProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-4">
              Nenhum short cadastrado ainda
            </p>
            <p className="text-sm text-gray-500">
              Os shorts cadastrados no painel do admin aparecerão aqui.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Shorts;