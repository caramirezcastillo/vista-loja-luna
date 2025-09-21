import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingBag, User, Search, Menu, Heart, LogOut, Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useSearch } from "../contexts/SearchContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { searchTerm, setSearchTerm, isSearchActive, setIsSearchActive, clearSearch } = useSearch();
  const { favorites } = useFavorites();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const cartCount = getTotalItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchActive(true);
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowSearchBar(false);
  };

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
            onClick={() => navigate('/blusas')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Blusas
          </button>
          <button 
            onClick={() => navigate('/vestidos')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Vestidos
          </button>
          <button 
            onClick={() => navigate('/shorts')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Shorts
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Bar - Desktop */}
          {showSearchBar ? (
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center space-x-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pr-8"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex"
              onClick={() => setShowSearchBar(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {/* Favorites Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex relative"
            onClick={() => navigate('/favorites')}
          >
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <Badge 
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white"
              >
                {favorites.length}
              </Badge>
            )}
          </Button>
          
          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  Olá, {user?.name}
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Painel Admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => navigate('/login')}>
              <User className="h-5 w-5" />
            </Button>
          )}
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