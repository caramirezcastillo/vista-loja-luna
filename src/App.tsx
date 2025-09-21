import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./contexts/SearchContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Feminino from "./pages/Feminino";
import Blusas from "./pages/Blusas";
import Vestidos from "./pages/Vestidos";
import Shorts from "./pages/Shorts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                   <Route path="/" element={<Index />} />
                   <Route path="/cart" element={<Cart />} />
                   <Route path="/favorites" element={<Favorites />} />
                   <Route path="/feminino" element={<Feminino />} />
                   <Route path="/blusas" element={<Blusas />} />
                   <Route path="/vestidos" element={<Vestidos />} />
                   <Route path="/shorts" element={<Shorts />} />
                   <Route path="/login" element={<Login />} />
                   <Route path="/register" element={<Register />} />
                   <Route 
                     path="/admin" 
                     element={
                       <ProtectedRoute requireAdmin={true}>
                         <Admin />
                       </ProtectedRoute>
                     } 
                   />
                   {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                   <Route path="*" element={<NotFound />} />
                 </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </FavoritesProvider>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
