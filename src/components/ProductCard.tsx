import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  stockQuantity?: number;
  inStock?: boolean;
}

const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice, 
  image, 
  category, 
  isNew = false, 
  isSale = false,
  stockQuantity = 0,
  inStock = true
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const productData = { id, name, price, originalPrice, image, category, isNew, isSale };
  const isProductFavorite = isFavorite(id);

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image,
      size: "M", // Default size
      color: "Padrão" // Default color
    });
    
    toast({
      title: "Produto adicionado!",
      description: `${name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(productData);
    toast({
      title: isProductFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: `${name} foi ${isProductFavorite ? 'removido dos' : 'adicionado aos'} seus favoritos.`,
    });
  };

  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  return (
    <div 
      className="group relative bg-card rounded-lg shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-fashion-gold text-fashion-black">
              Novo
            </Badge>
          )}
          {isSale && (
            <Badge variant="destructive">
              Sale
            </Badge>
          )}
        </div>

        {/* Heart Icon */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 transition-all duration-300 ${
            isProductFavorite 
              ? 'text-red-500 bg-white/90' 
              : 'text-gray-600 bg-white/80 hover:bg-white/90'
          }`}
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isProductFavorite ? 'fill-current' : ''}`} />
        </Button>

        {/* Hover Actions */}
        <div className={`absolute inset-x-3 bottom-3 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <Button 
            className={`w-full transition-all duration-300 ${
              !inStock || stockQuantity <= 0 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-fashion-black text-white hover:bg-fashion-black/90'
            }`}
            size="sm"
            onClick={handleAddToCart}
            disabled={!inStock || stockQuantity <= 0}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {!inStock || stockQuantity <= 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
          {category}
        </div>
        <h3 className="font-semibold text-foreground group-hover:text-fashion-gold transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        
        {/* Stock Information */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            !inStock || stockQuantity <= 0 
              ? 'text-red-500' 
              : stockQuantity <= 5 
                ? 'text-orange-500' 
                : 'text-green-600'
          }`}>
            {!inStock || stockQuantity <= 0 
              ? 'Fora de estoque' 
              : stockQuantity <= 5 
                ? `Apenas ${stockQuantity} restantes` 
                : `${stockQuantity} em estoque`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;