import ProductCard from "./ProductCard";
import productDress from "@/assets/product-dress.jpg";
import productShirt from "@/assets/product-shirt.jpg";
import productBlazer from "@/assets/product-blazer.jpg";
import productBag from "@/assets/product-bag.jpg";

const ProductGrid = () => {
  const products = [
    {
      id: "1",
      name: "Vestido Elegante Preto",
      price: 299.90,
      originalPrice: 399.90,
      image: productDress,
      category: "Feminino",
      isSale: true,
    },
    {
      id: "2", 
      name: "Camisa Social Branca",
      price: 189.90,
      image: productShirt,
      category: "Masculino",
      isNew: true,
    },
    {
      id: "3",
      name: "Blazer Feminino Moderno",
      price: 459.90,
      image: productBlazer,
      category: "Feminino",
      isNew: true,
    },
    {
      id: "4",
      name: "Bolsa de Couro Premium",
      price: 599.90,
      originalPrice: 799.90,
      image: productBag,
      category: "Acessórios",
      isSale: true,
    },
    {
      id: "5",
      name: "Vestido Elegante Preto",
      price: 299.90,
      image: productDress,
      category: "Feminino",
    },
    {
      id: "6",
      name: "Camisa Social Branca",
      price: 189.90,
      image: productShirt,
      category: "Masculino",
    },
    {
      id: "7",
      name: "Blazer Feminino Moderno",
      price: 459.90,
      image: productBlazer,
      category: "Feminino",
    },
    {
      id: "8",
      name: "Bolsa de Couro Premium",
      price: 599.90,
      image: productBag,
      category: "Acessórios",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção cuidadosa de peças exclusivas para todos os estilos e ocasiões.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-fashion-black text-white px-8 py-3 rounded-lg hover:bg-fashion-black/90 transition-colors duration-300 font-semibold">
            Ver Mais Produtos
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;