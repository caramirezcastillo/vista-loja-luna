import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductCard = ({ 
  name, 
  price, 
  originalPrice, 
  image, 
  category, 
  isNew = false, 
  isSale = false 
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
            isLiked 
              ? 'text-red-500 bg-white/90' 
              : 'text-gray-600 bg-white/80 hover:bg-white/90'
          }`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        </Button>

        {/* Hover Actions */}
        <div className={`absolute inset-x-3 bottom-3 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <Button 
            className="w-full bg-fashion-black text-white hover:bg-fashion-black/90 transition-all duration-300"
            size="sm"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Adicionar ao Carrinho
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
      </div>
    </div>
  );
};

export default ProductCard;