import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
}

interface SiteConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
  googleId?: string;
}

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'config' | 'users'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    siteName: 'Moda Agora',
    siteDescription: 'Sua loja de moda online',
    contactEmail: 'contato@modaagora.com',
    contactPhone: '(11) 99999-9999',
    socialMedia: {
      facebook: 'https://facebook.com/modaagora',
      instagram: 'https://instagram.com/modaagora',
      twitter: 'https://twitter.com/modaagora'
    }
  });
  
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    image: '',
    category: 'feminino',
    description: '',
    inStock: true
  });
  
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url');
  
  // Estados para gerenciamento de usuários
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Verificar se o usuário é admin
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Carregar dados do localStorage
  useEffect(() => {
    // Carregar produtos existentes
    const savedProducts = localStorage.getItem('adminProducts');
    let currentProducts = [];
    if (savedProducts) {
      currentProducts = JSON.parse(savedProducts);
    }
    
    // Produtos padrão da página inicial para sincronizar
    const defaultProducts = [
      {
        id: 'default-1',
        name: 'Vestido Elegante Preto',
        price: 299.90,
        image: '/src/assets/product-dress.jpg',
        category: 'feminino',
        description: 'Vestido elegante perfeito para ocasiões especiais',
        inStock: true
      },
      {
        id: 'default-2',
        name: 'Blazer Feminino Moderno',
        price: 459.90,
        image: '/src/assets/product-blazer.jpg',
        category: 'feminino',
        description: 'Blazer moderno para um look executivo',
        inStock: true
      },
      {
        id: 'default-3',
        name: 'Bolsa de Couro Premium',
        price: 599.90,
        image: '/src/assets/product-bag.jpg',
        category: 'acessorios',
        description: 'Bolsa de couro premium com acabamento luxuoso',
        inStock: true
      },
      {
        id: 'default-4',
        name: 'Vestido Casual Elegante',
        price: 299.90,
        image: '/src/assets/product-dress.jpg',
        category: 'feminino',
        description: 'Vestido casual para o dia a dia',
        inStock: true
      },
      {
        id: 'default-5',
        name: 'Blazer Executivo',
        price: 459.90,
        image: '/src/assets/product-blazer.jpg',
        category: 'feminino',
        description: 'Blazer executivo para reuniões importantes',
        inStock: true
      },
      {
        id: 'default-6',
        name: 'Bolsa Executiva Premium',
        price: 599.90,
        image: '/src/assets/product-bag.jpg',
        category: 'acessorios',
        description: 'Bolsa executiva para profissionais',
        inStock: true
      }
    ];
    
    // Verificar se produtos padrão já existem, se não, adicionar
    const existingIds = currentProducts.map((p: Product) => p.id);
    const newDefaultProducts = defaultProducts.filter(dp => !existingIds.includes(dp.id));
    
    if (newDefaultProducts.length > 0) {
      const updatedProducts = [...currentProducts, ...newDefaultProducts];
      setProducts(updatedProducts);
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    } else {
      setProducts(currentProducts);
    }
    
    // Carregar configurações
    const savedConfig = localStorage.getItem('siteConfig');
    if (savedConfig) {
      setSiteConfig(JSON.parse(savedConfig));
    }
    
    // Carregar pedidos
    const savedOrders = localStorage.getItem('adminOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Pedidos de exemplo
      const exampleOrders: Order[] = [
        {
          id: 'order-1',
          customerName: 'Maria Silva',
          customerEmail: 'maria@email.com',
          customerPhone: '(11) 99999-9999',
          items: [
            {
              productId: 'default-1',
              productName: 'Vestido Elegante Preto',
              quantity: 1,
              price: 299.90
            }
          ],
          total: 299.90,
          status: 'pending',
          createdAt: new Date().toISOString(),
          shippingAddress: 'Rua das Flores, 123 - São Paulo, SP'
        },
        {
          id: 'order-2',
          customerName: 'Ana Costa',
          customerEmail: 'ana@email.com',
          customerPhone: '(11) 88888-8888',
          items: [
            {
              productId: 'default-2',
              productName: 'Blazer Feminino Moderno',
              quantity: 1,
              price: 459.90
            },
            {
              productId: 'default-3',
              productName: 'Bolsa de Couro Premium',
              quantity: 1,
              price: 599.90
            }
          ],
          total: 1059.80,
          status: 'processing',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          shippingAddress: 'Av. Paulista, 456 - São Paulo, SP'
        }
      ];
      setOrders(exampleOrders);
      localStorage.setItem('adminOrders', JSON.stringify(exampleOrders));
    }
    
    // Carregar usuários
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      // Adicionar data de criação se não existir
      const usersWithDate = allUsers.map((u: any) => ({
        ...u,
        createdAt: u.createdAt || new Date().toISOString()
      }));
      setUsers(usersWithDate);
    }
  }, []);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingProduct) {
        // Editar produto existente
        const updatedProducts = products.map(p => 
          p.id === editingProduct 
            ? { ...productForm, id: editingProduct }
            : p
        );
        setProducts(updatedProducts);
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        setEditingProduct(null);
      } else {
        // Adicionar novo produto
        const newProduct: Product = {
          ...productForm,
          id: Date.now().toString()
        };
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      }
      
      // Limpar formulário
      setProductForm({
        name: '',
        price: 0,
        image: '',
        category: 'feminino',
        description: '',
        inStock: true
      });
      setImageInputType('url');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      inStock: product.inStock
    });
    setEditingProduct(product.id);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    }
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem('siteConfig', JSON.stringify(siteConfig));
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para gerenciamento de usuários
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (editingUser) {
        // Editar usuário existente
        const updatedUsers = allUsers.map((u: AdminUser) => 
          u.id === editingUser 
            ? { ...u, ...userForm }
            : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setEditingUser(null);
      } else {
        // Verificar se email já existe
        const existingUser = allUsers.find((u: AdminUser) => u.email === userForm.email);
        if (existingUser) {
          alert('Já existe um usuário com este email!');
          return;
        }
        
        // Adicionar novo usuário
        const newUser: AdminUser = {
          ...userForm,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        const updatedUsers = [...allUsers, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
      }
      
      // Limpar formulário
      setUserForm({
        name: '',
        email: '',
        password: '',
        isAdmin: false
      });
      
      alert(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setUserForm({
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin
    });
    setEditingUser(user.id);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === 'admin') {
      alert('Não é possível excluir o usuário administrador padrão!');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = allUsers.filter((u: AdminUser) => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const handleChangePassword = (userId: string, newPassword: string) => {
    if (!newPassword.trim()) {
      alert('A senha não pode estar vazia!');
      return;
    }
    
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map((u: AdminUser) => 
      u.id === userId 
        ? { ...u, password: newPassword }
        : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    alert('Senha alterada com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Produtos
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pedidos
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Usuários
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'config'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Configurações
              </button>
            </nav>
          </div>

          {activeTab === 'products' && (
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Gerenciar Produtos</h1>
              
              {/* Formulário de Produto */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                </h2>
                
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = value === '' ? 0 : parseFloat(value);
                          setProductForm({...productForm, price: isNaN(numValue) ? 0 : numValue});
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
                      
                      {/* Seletor de tipo de entrada */}
                      <div className="flex space-x-4 mb-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="imageInputType"
                            value="url"
                            checked={imageInputType === 'url'}
                            onChange={(e) => setImageInputType(e.target.value as 'url' | 'file')}
                            className="mr-2 text-pink-600 focus:ring-pink-500"
                          />
                          URL da Imagem
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="imageInputType"
                            value="file"
                            checked={imageInputType === 'file'}
                            onChange={(e) => setImageInputType(e.target.value as 'url' | 'file')}
                            className="mr-2 text-pink-600 focus:ring-pink-500"
                          />
                          Carregar do PC/Galeria
                        </label>
                      </div>
                      
                      {/* Campo de entrada baseado no tipo selecionado */}
                      {imageInputType === 'url' ? (
                        <input
                          type="url"
                          value={productForm.image}
                          onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                          placeholder="https://exemplo.com/imagem.jpg"
                          required
                        />
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const result = event.target?.result as string;
                                  setProductForm({...productForm, image: result});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                            required={!productForm.image}
                          />
                          {productForm.image && (
                            <div className="mt-2">
                              <img 
                                src={productForm.image} 
                                alt="Preview" 
                                className="h-20 w-20 object-cover rounded-md border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => setProductForm({...productForm, image: ''})}
                                className="ml-2 text-sm text-red-600 hover:text-red-800"
                              >
                                Remover
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Preview da imagem para URL */}
                      {imageInputType === 'url' && productForm.image && (
                        <div className="mt-2">
                          <img 
                            src={productForm.image} 
                            alt="Preview" 
                            className="h-20 w-20 object-cover rounded-md border border-gray-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoria</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="feminino">Feminino</option>
                        <option value="masculino">Masculino</option>
                        <option value="infantil">Infantil</option>
                        <option value="acessorios">Acessórios</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Em estoque</label>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400"
                    >
                      {isLoading ? 'Salvando...' : (editingProduct ? 'Atualizar' : 'Adicionar')}
                    </button>
                    
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setProductForm({
                            name: '',
                            price: 0,
                            image: '',
                            category: 'feminino',
                            description: '',
                            inStock: true
                          });
                          setImageInputType('url');
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
              
              {/* Lista de Produtos */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Produtos Cadastrados ({products.length})</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.inStock 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'Em estoque' : 'Fora de estoque'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-pink-600 hover:text-pink-900"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum produto cadastrado ainda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Gerenciar Pedidos</h1>
              
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Pedidos Recebidos ({orders.length})</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                              <div className="text-sm text-gray-500">{order.customerEmail}</div>
                              <div className="text-sm text-gray-500">{order.customerPhone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {order.items.map((item, index) => (
                                <div key={index} className="mb-1">
                                  {item.productName} (x{item.quantity})
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as Order['status'];
                                const updatedOrders = orders.map(o => 
                                  o.id === order.id ? {...o, status: newStatus} : o
                                );
                                setOrders(updatedOrders);
                                localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
                              }}
                              className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="pending">Pendente</option>
                              <option value="processing">Processando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregue</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                const orderDetails = `
                                  Pedido: ${order.id}
                                  Cliente: ${order.customerName}
                                  Email: ${order.customerEmail}
                                  Telefone: ${order.customerPhone}
                                  Endereço: ${order.shippingAddress}
                                  
                                  Itens:
                                  ${order.items.map(item => `- ${item.productName} (x${item.quantity}) - R$ ${item.price.toFixed(2)}`).join('\n')}
                                  
                                  Total: R$ ${order.total.toFixed(2)}
                                  Status: ${order.status}
                                  Data: ${new Date(order.createdAt).toLocaleString('pt-BR')}
                                `;
                                alert(orderDetails);
                              }}
                              className="text-pink-600 hover:text-pink-900"
                            >
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum pedido recebido ainda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Gerenciar Usuários</h1>
              
              {/* Formulário de Usuário */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
                </h2>
                
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome</label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Senha</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={userForm.password}
                          onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 pr-10"
                          required={!editingUser}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userForm.isAdmin}
                        onChange={(e) => setUserForm({...userForm, isAdmin: e.target.checked})}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">Administrador</label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400"
                    >
                      {isLoading ? 'Salvando...' : (editingUser ? 'Atualizar' : 'Adicionar')}
                    </button>
                    
                    {editingUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setUserForm({
                            name: '',
                            email: '',
                            password: '',
                            isAdmin: false
                          });
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
              
              {/* Lista de Usuários */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Usuários Cadastrados ({users.length})</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            {user.googleId && (
                              <div className="text-xs text-blue-600">Conta Google</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isAdmin 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.isAdmin ? 'Administrador' : 'Usuário'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-pink-600 hover:text-pink-900"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                const newPassword = prompt('Digite a nova senha:');
                                if (newPassword) {
                                  handleChangePassword(user.id, newPassword);
                                }
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Alterar Senha
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={user.id === 'admin'}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum usuário cadastrado ainda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurações do Site</h1>
              
              <div className="bg-white shadow rounded-lg p-6">
                <form onSubmit={handleConfigSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome do Site</label>
                      <input
                        type="text"
                        value={siteConfig.siteName}
                        onChange={(e) => setSiteConfig({...siteConfig, siteName: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email de Contato</label>
                      <input
                        type="email"
                        value={siteConfig.contactEmail}
                        onChange={(e) => setSiteConfig({...siteConfig, contactEmail: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefone de Contato</label>
                      <input
                        type="tel"
                        value={siteConfig.contactPhone}
                        onChange={(e) => setSiteConfig({...siteConfig, contactPhone: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição do Site</label>
                    <textarea
                      value={siteConfig.siteDescription}
                      onChange={(e) => setSiteConfig({...siteConfig, siteDescription: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Facebook</label>
                        <input
                          type="url"
                          value={siteConfig.socialMedia.facebook}
                          onChange={(e) => setSiteConfig({
                            ...siteConfig,
                            socialMedia: {...siteConfig.socialMedia, facebook: e.target.value}
                          })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Instagram</label>
                        <input
                          type="url"
                          value={siteConfig.socialMedia.instagram}
                          onChange={(e) => setSiteConfig({
                            ...siteConfig,
                            socialMedia: {...siteConfig.socialMedia, instagram: e.target.value}
                          })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Twitter</label>
                        <input
                          type="url"
                          value={siteConfig.socialMedia.twitter}
                          onChange={(e) => setSiteConfig({
                            ...siteConfig,
                            socialMedia: {...siteConfig.socialMedia, twitter: e.target.value}
                          })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar Configurações'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;