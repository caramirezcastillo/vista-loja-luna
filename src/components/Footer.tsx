import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-fashion-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              LUXE
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Sua loja de moda premium com as últimas tendências e peças exclusivas para todos os estilos.
            </p>
            <div className="flex space-x-4 pt-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-fashion-gold">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-fashion-gold">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-fashion-gold">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">Blusas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">Vestidos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">Shorts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">Masculino</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Atendimento</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">Política de Troca</a></li>
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">Guia de Tamanhos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">Entrega e Frete</a></li>
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-fashion-gold transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <p className="text-gray-400 text-sm">
              Receba ofertas exclusivas e novidades em primeira mão.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Seu e-mail" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-fashion-gold"
              />
              <Button className="bg-fashion-gold hover:bg-fashion-gold-dark text-fashion-black font-semibold">
                OK
              </Button>
            </div>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>contato@luxe.com.br</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 LUXE. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-fashion-gold transition-colors">Privacidade</a>
              <a href="#" className="hover:text-fashion-gold transition-colors">Termos</a>
              <a href="#" className="hover:text-fashion-gold transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;