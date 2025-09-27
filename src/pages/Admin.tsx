import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  stockQuantity: number;
  sizes: string[];
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
  phone: string;
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
    siteName: 'Vista Loja Luna 2',
    siteDescription: 'Sua loja de moda online',
    contactEmail: 'contato@vistalojluna.com',
    contactPhone: '(11) 99999-9999',
    socialMedia: {
      facebook: 'https://facebook.com/vistalojluna',
      instagram: 'https://instagram.com/vistalojluna',
      twitter: 'https://twitter.com/vistalojluna'
    }
  });
  
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    image: '',
    category: 'feminino',
    description: '',
    inStock: true,
    stockQuantity: 0,
    sizes: []
  });
  
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para gerenciamento de usuários
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    isAdmin: false
  });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordChangeUser, setPasswordChangeUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserData, setEditingUserData] = useState<AdminUser | null>(null);

  // Verificar se o usuário é admin
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Funções para carregar dados do Supabase
  const loadProductsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const supabaseProducts = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
          description: p.description,
          inStock: p.in_stock,
          stockQuantity: p.stock_quantity,
          sizes: p.sizes || []
        }));
        setProducts(supabaseProducts);
        return true;
      }
    } catch (error) {
      console.error('Erro ao carregar produtos do Supabase:', error);
    }
    return false;
  };

  const loadUsersFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const supabaseUsers = data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          password: '', // Não precisamos da senha para exibição
          phone: u.phone || '',
          isAdmin: u.is_admin || false,
          createdAt: u.created_at
        }));
        setUsers(supabaseUsers);
        return true;
      }
    } catch (error) {
      console.error('Erro ao carregar usuários do Supabase:', error);
    }
    return false;
  };

  // Carregar dados do Supabase ou localStorage como fallback
  useEffect(() => {
    const loadData = async () => {
      // Tentar carregar produtos do Supabase primeiro
      const productsLoaded = await loadProductsFromSupabase();
      
      if (!productsLoaded) {
        // Fallback para localStorage
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
            inStock: true,
            stockQuantity: 10,
            sizes: ['PP', 'P', 'M', 'G', 'GG']
          },
          {
            id: 'default-2',
            name: 'Blazer Feminino Moderno',
            price: 459.90,
            image: '/src/assets/product-blazer.jpg',
            category: 'feminino',
            description: 'Blazer moderno para um look executivo',
            inStock: true,
            stockQuantity: 15,
            sizes: ['PP', 'P', 'M', 'G', 'GG']
          },
          {
            id: 'default-3',
            name: 'Bolsa de Couro Premium',
            price: 599.90,
            image: '/src/assets/product-bag.jpg',
            category: 'acessorios',
            description: 'Bolsa de couro premium com acabamento luxuoso',
            inStock: true,
            stockQuantity: 8,
            sizes: ['Único']
          },
          {
            id: 'default-4',
            name: 'Vestido Casual Elegante',
            price: 299.90,
            image: '/src/assets/product-dress.jpg',
            category: 'feminino',
            description: 'Vestido casual para o dia a dia',
            inStock: true,
            stockQuantity: 12,
            sizes: ['PP', 'P', 'M', 'G', 'GG']
          },
          {
            id: 'default-5',
            name: 'Blazer Executivo',
            price: 459.90,
            image: '/src/assets/product-blazer.jpg',
            category: 'feminino',
            description: 'Blazer executivo para reuniões importantes',
            inStock: true,
            stockQuantity: 7,
            sizes: ['PP', 'P', 'M', 'G', 'GG']
          },
          {
            id: 'default-6',
            name: 'Bolsa Executiva Premium',
            price: 599.90,
            image: '/src/assets/product-bag.jpg',
            category: 'acessorios',
            description: 'Bolsa executiva para profissionais',
            inStock: true,
            stockQuantity: 5,
            sizes: ['Único']
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
      }

      // Tentar carregar usuários do Supabase primeiro
      const usersLoaded = await loadUsersFromSupabase();
      
      if (!usersLoaded) {
        // Fallback para localStorage
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
      }

      // Carregar configurações (ainda do localStorage)
      const savedConfig = localStorage.getItem('siteConfig');
      if (savedConfig) {
        setSiteConfig(JSON.parse(savedConfig));
      }
      
      // Carregar pedidos (ainda do localStorage por enquanto)
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
    };

    loadData();
  }, []);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingProduct) {
        // Editar produto existente
        try {
          const { error } = await supabase
            .from('products')
            .update({
              name: productForm.name,
              price: productForm.price,
              image: productForm.image,
              category: productForm.category,
              description: productForm.description,
              in_stock: productForm.inStock,
              stock_quantity: productForm.stockQuantity,
              sizes: productForm.sizes
            })
            .eq('id', editingProduct);

          if (error) throw error;

          // Atualizar estado local
          const updatedProducts = products.map(p => 
            p.id === editingProduct 
              ? { ...productForm, id: editingProduct }
              : p
          );
          setProducts(updatedProducts);
        } catch (supabaseError) {
          console.error('Erro ao atualizar no Supabase, usando localStorage:', supabaseError);
          // Fallback para localStorage
          const updatedProducts = products.map(p => 
            p.id === editingProduct 
              ? { ...productForm, id: editingProduct }
              : p
          );
          setProducts(updatedProducts);
          localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        }
        setEditingProduct(null);
      } else {
        // Adicionar novo produto
        try {
          const { data, error } = await supabase
            .from('products')
            .insert({
              name: productForm.name,
              price: productForm.price,
              image: productForm.image,
              category: productForm.category,
              description: productForm.description,
              in_stock: productForm.inStock,
              stock_quantity: productForm.stockQuantity,
              sizes: productForm.sizes
            })
            .select()
            .single();

          if (error) throw error;

          // Atualizar estado local com o produto do Supabase
          const newProduct: Product = {
            id: data.id,
            name: data.name,
            price: data.price,
            image: data.image,
            category: data.category,
            description: data.description,
            inStock: data.in_stock,
            stockQuantity: data.stock_quantity,
            sizes: (data as any).sizes || []
          };
          const updatedProducts = [...products, newProduct];
          setProducts(updatedProducts);
        } catch (supabaseError) {
          console.error('Erro ao salvar no Supabase, usando localStorage:', supabaseError);
          // Fallback para localStorage
          const newProduct: Product = {
            ...productForm,
            id: Date.now().toString()
          };
          const updatedProducts = [...products, newProduct];
          setProducts(updatedProducts);
          localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        }
      }
      
      // Limpar formulário
      setProductForm({
        name: '',
        price: 0,
        image: '',
        category: 'feminino',
        description: '',
        inStock: true,
        stockQuantity: 0,
        sizes: []
      });
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
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      sizes: product.sizes || []
    });
    setEditingProduct(product.id);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;

        // Atualizar estado local
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
      } catch (supabaseError) {
        console.error('Erro ao excluir no Supabase, usando localStorage:', supabaseError);
        // Fallback para localStorage
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      }
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
    console.log('handleUserSubmit chamado', { userForm, editingUser });
    setIsLoading(true);

    try {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Usuários existentes:', allUsers);
      
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
        console.log('Usuário editado:', updatedUsers);
      } else {
        // Verificar se email já existe
        const existingUser = allUsers.find((u: AdminUser) => u.email === userForm.email);
        if (existingUser) {
          alert('Já existe um usuário com este email!');
          setIsLoading(false);
          return;
        }
        
        // Adicionar novo usuário
        const newUser: AdminUser = {
          ...userForm,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        console.log('Novo usuário criado:', newUser);
        const updatedUsers = [...allUsers, newUser];
        console.log('Lista atualizada:', updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        console.log('Estado users atualizado');
      }
      
      // Limpar formulário
      setUserForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        isAdmin: false
      });
      
      alert(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUserData(user);
    setShowEditModal(true);
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({...productForm, stockQuantity: parseInt(e.target.value) || 0})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tamanhos Disponíveis</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'].map((size) => (
                          <label key={size} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={productForm.sizes.includes(size)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProductForm({
                                    ...productForm,
                                    sizes: [...productForm.sizes, size]
                                  });
                                } else {
                                  setProductForm({
                                    ...productForm,
                                    sizes: productForm.sizes.filter(s => s !== size)
                                  });
                                }
                              }}
                              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{size}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Selecione os tamanhos disponíveis para este produto</p>
                    </div>
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
                            category: 'blusas',
                            description: '',
                            inStock: true,
                            stockQuantity: 0,
                            sizes: []
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stockQuantity || 0} unidades
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.inStock && (product.stockQuantity || 0) > 0
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock && (product.stockQuantity || 0) > 0 ? 'Em estoque' : 'Fora de estoque'}
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
                      <label className="block text-sm font-medium text-gray-700">Telefone</label>
                      <input
                        type="tel"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                        placeholder="(11) 99999-9999"
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
                            phone: '',
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
                                setPasswordChangeUser(user);
                                setShowPasswordModal(true);
                                setNewPassword('');
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
      
      {/* Modal de Alteração de Senha */}
      {showPasswordModal && passwordChangeUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              Alterar Senha - {passwordChangeUser.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Digite a nova senha"
                  minLength={6}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordChangeUser(null);
                    setNewPassword('');
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (newPassword.length >= 6) {
                      handleChangePassword(passwordChangeUser.id, newPassword);
                      setShowPasswordModal(false);
                      setPasswordChangeUser(null);
                      setNewPassword('');
                    } else {
                      alert('A senha deve ter pelo menos 6 caracteres');
                    }
                  }}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                  disabled={!newPassword || newPassword.length < 6}
                >
                  Alterar Senha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Edição de Usuário */}
      {showEditModal && editingUserData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">
              Editar Usuário - {editingUserData.name}
            </h3>
            
            <form onSubmit={(e) => {
               e.preventDefault();
               const formData = new FormData(e.target as HTMLFormElement);
               const updatedUser: AdminUser = {
                 ...editingUserData,
                 name: formData.get('name') as string,
                 email: formData.get('email') as string,
                 isAdmin: formData.get('isAdmin') === 'on'
               };
               
               // Validações de segurança
               if (!updatedUser.name.trim()) {
                 alert('Nome é obrigatório!');
                 return;
               }
               
               if (!updatedUser.email.trim()) {
                 alert('Email é obrigatório!');
                 return;
               }
               
               // Verificar se email já existe (exceto o próprio usuário)
               const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
               const emailExists = allUsers.some((u: AdminUser) => 
                 u.email === updatedUser.email && u.id !== editingUserData.id
               );
               
               if (emailExists) {
                 alert('Já existe outro usuário com este email!');
                 return;
               }
               
               // Verificar se não está removendo o último administrador
               if (editingUserData.isAdmin && !updatedUser.isAdmin) {
                 const adminCount = allUsers.filter((u: AdminUser) => u.isAdmin).length;
                 if (adminCount <= 1) {
                   alert('Não é possível remover o último administrador do sistema!');
                   return;
                 }
               }
               
               // Verificar se não está editando o admin padrão para remover privilégios
               if (editingUserData.id === 'admin' && !updatedUser.isAdmin) {
                 alert('Não é possível remover privilégios de administrador do usuário padrão!');
                 return;
               }
               
               // Atualizar usuário no localStorage
               const updatedUsers = allUsers.map((u: AdminUser) => 
                 u.id === editingUserData.id ? updatedUser : u
               );
               localStorage.setItem('users', JSON.stringify(updatedUsers));
               setUsers(updatedUsers);
               
               // Fechar modal
               setShowEditModal(false);
               setEditingUserData(null);
               
               alert('Usuário atualizado com sucesso!');
             }} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUserData.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUserData.email}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAdmin"
                  id="editIsAdmin"
                  defaultChecked={editingUserData.isAdmin}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="editIsAdmin" className="ml-2 block text-sm text-gray-900">
                  Administrador
                </label>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Alteração de Role
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Alterar o role de um usuário pode afetar suas permissões no sistema. Administradores têm acesso total ao painel.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUserData(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Admin;