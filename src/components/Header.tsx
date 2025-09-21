import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, User, Search, Menu, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <button 
            onClick={() => navigate('/')}
            className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
          >
            LUXE
          </button>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => navigate('/feminino')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Feminino
          </button>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Acessórios
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sale
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge 
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-fashion-gold text-fashion-black"
              >
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;