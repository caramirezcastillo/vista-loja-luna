// Script de debug para testar favoritos
// Cole este código no console do navegador (F12)

console.log("=== DEBUG FAVORITOS ===");

// 1. Verificar se há favoritos salvos
const savedFavorites = localStorage.getItem('userFavorites');
console.log("Favoritos salvos no localStorage:", savedFavorites);

if (savedFavorites) {
  try {
    const parsed = JSON.parse(savedFavorites);
    console.log("Favoritos parseados:", parsed);
    console.log("Quantidade de favoritos:", parsed.length);
  } catch (error) {
    console.error("Erro ao parsear favoritos:", error);
  }
}

// 2. Testar produto de exemplo
const testProduct = {
  id: 1,
  name: "Produto Teste",
  price: 99.99,
  originalPrice: 149.99,
  image: "/placeholder.svg",
  category: "Blusas",
  isNew: true,
  isSale: true
};

console.log("Produto de teste:", testProduct);

// 3. Simular adição aos favoritos
function testAddToFavorites(product) {
  const currentFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
  const exists = currentFavorites.find(item => item.id === product.id);
  
  if (!exists) {
    currentFavorites.push(product);
    localStorage.setItem('userFavorites', JSON.stringify(currentFavorites));
    console.log("✅ Produto adicionado aos favoritos");
    console.log("Favoritos atualizados:", currentFavorites);
  } else {
    console.log("⚠️ Produto já existe nos favoritos");
  }
}

// 4. Executar teste
console.log("Executando teste de adição...");
testAddToFavorites(testProduct);

// 5. Verificar resultado final
const finalFavorites = localStorage.getItem('userFavorites');
console.log("Estado final dos favoritos:", finalFavorites);

console.log("=== FIM DEBUG ===");