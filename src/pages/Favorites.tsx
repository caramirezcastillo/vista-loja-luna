import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const { favorites, clearFavorites } = useFavorites();
  const navigate = useNavigate();

  const handleClearFavorites = () => {
    if (window.confirm('Tem certeza que deseja remover todos os produtos dos favoritos?')) {
      clearFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">Meus Favoritos</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {favorites.length > 0 
              ? `Você tem ${favorites.length} produto${favorites.length > 1 ? 's' : ''} em seus favoritos`
              : 'Você ainda não tem produtos favoritos'
            }
          </p>
        </div>

        {/* Favorites Content */}
        {favorites.length > 0 ? (
          <>
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleClearFavorites}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Limpar Favoritos
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {favorites.length} item{favorites.length > 1 ? 's' : ''}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {favorites.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="text-center">
              <Button 
                onClick={() => navigate('/')}
                className="bg-fashion-black text-white hover:bg-fashion-black/90"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="mb-8">
              <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                Nenhum produto favorito
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Explore nossa coleção e adicione produtos aos seus favoritos clicando no ícone de coração.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/')}
                className="bg-fashion-black text-white hover:bg-fashion-black/90"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Explorar Produtos
              </Button>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/feminino')}
                >
                  Moda Feminina
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;