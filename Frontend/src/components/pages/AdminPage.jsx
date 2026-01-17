import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  Plus, Edit2, Trash2, Package, Users, ShoppingCart, 
  TrendingUp, Search, X, Save 
} from 'lucide-react';



export default function AdminPage({ setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    stock: '',
    season: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const productsData = await apiService.getAllItems();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await apiService.updateItem(editingProduct.id, productForm);
        alert('✅ Produkti u përditësua!');
      } else {
        await apiService.createItem(productForm);
        alert('✅ Produkti u shtua!');
      }
      setShowProductModal(false);
      resetProductForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('❌ Gabim në ruajtjen e produktit!');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Jeni të sigurt që dëshironi të fshini këtë produkt?')) return;
    
    try {
      await apiService.deleteItem(productId);
      alert('✅ Produkti u fshi!');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('❌ Gabim në fshirjen e produktit!');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || '',
      image: product.image || '',
      stock: product.stock || 0,
      season: product.season || ''
    });
    setShowProductModal(true);
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '',
      stock: '',
      season: ''
    });
    setEditingProduct(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('sq-AL', {
      minimumFractionDigits: 0,
    }).format(price) + ' Lekë';
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: 'Total Produkte',
      value: products.length,
      icon: <Package size={28} />,
      color: 'from-[#F4C2C2] to-[#ECAEAE]',
      bgColor: 'bg-[#FCF0F0]'
    },
    {
      title: 'Kategori',
      value: new Set(products.map(p => p.category)).size,
      icon: <Users size={28} />,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Në Stok',
      value: products.filter(p => p.stock > 0).length,
      icon: <ShoppingCart size={28} />,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Vlera',
      value: formatPrice(products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)),
      icon: <TrendingUp size={28} />,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header with Wave */}
      <div className="bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE] text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-white opacity-90">Eriola BabyShop Management</p>
            </div>
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-white text-[#ECAEAE] px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg"
            >
              ← Kthehu në Faqe
            </button>
          </div>
        </div>
      </div>

      {/* Wavy Divider */}
      <div className="relative h-16 bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE]">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            d="M0,50 Q180,0 360,50 T720,50 T1080,50 T1440,50 L1440,100 L0,100 Z" 
            fill="#F9FAFB"
          />
        </svg>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-4 border-b-3 font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'border-[#ECAEAE] text-[#ECAEAE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp size={18} />
                Dashboard
              </span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-4 border-b-3 font-semibold transition-all ${
                activeTab === 'products'
                  ? 'border-[#ECAEAE] text-[#ECAEAE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Package size={18} />
                Produktet
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
                  <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                    <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FCF0F0] to-white">
                <h3 className="text-lg font-bold text-gray-900">Produktet e Fundit</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image || 'https://via.placeholder.com/60'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <p className="font-bold text-[#ECAEAE]">{formatPrice(product.price)}</p>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Package size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Nuk ka produkte ende</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Menaxhimi i Produkteve</h2>
              <button
                onClick={() => {
                  resetProductForm();
                  setShowProductModal(true);
                }}
                className="bg-gradient-to-r from-[#F4C2C2] to-[#ECAEAE] hover:from-[#ECAEAE] hover:to-[#F4C2C2] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Shto Produkt
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Kërko produkte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECAEAE] focus:border-transparent"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#FCF0F0] to-white border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Produkti</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kategoria</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sezoni</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Çmimi</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Veprime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image || 'https://via.placeholder.com/60'}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                            />
                            <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{product.category}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {product.season === 'Koleksioni Veror' && '☀️ Veror'}
                          {product.season === 'Koleksioni Dimëror' && '❄️ Dimëror'}
                          {product.season === 'Vjeshtë & Pranverë' && '🌸 Vjeshtë/Pranverë'}
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#ECAEAE]">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifiko"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Fshi"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                          <Package size={48} className="mx-auto mb-3 opacity-50" />
                          <p>Nuk u gjetën produkte</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-[#FCF0F0] to-white">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Modifiko Produktin' : 'Shto Produkt të Ri'}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  resetProductForm();
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emri i Produktit</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECAEAE] focus:border-transparent"
                  placeholder="Emri i produktit..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Çmimi (Lekë)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECAEAE] focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stoku</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECAEAE] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategoria</label>
                <select
                  required
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECAEAE] focus:border-transparent"
                >
                  <option value="">Zgjidh kategorinë</option>
                  <option value="Rompers">Rompers</option>
                  <option value="Fustane">Fustane</option>
                  <option value="Çorape">Çorape</option>
                  <option value="Xhaketa">Xhaketa</option>
                  <option value="Geta">Geta</option>
                  <option value="Fjongo">Fjongo</option>
                  <option value="Kostume">Kostume</option>
                  <option value="Aksesorë">Aksesorë</option>
                  <option value="Sandale">Sandale</option>
                  <option value="Çizme">Çizme</option>
                  <option value="Këpucë">Këpucë</option>
                  <option value="Veshje Plazhi">Veshje Plazhi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sezoni</label>
                <select
                  required
                  value={productForm.season}
                  onChange={(e) => setProductForm({...productForm, season: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECAEAE] focus:border-transparent"
                >
                  <option value="">Zgjidh sezonin</option>
                  <option value="Koleksioni Dimëror">❄️ Koleksioni Dimëror</option>
                  <option value="Koleksioni Veror">☀️ Koleksioni Veror</option>
                  <option value="Vjeshtë & Pranverë">🌸 Vjeshtë & Pranverë</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL e Fotografisë</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECAEAE] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {productForm.image && (
                  <img src={productForm.image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-200" />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Përshkrimi</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECAEAE] focus:border-transparent resize-none"
                  placeholder="Përshkrimi i produktit..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleProductSubmit}
                  className="flex-1 bg-gradient-to-r from-[#F4C2C2] to-[#ECAEAE] hover:from-[#ECAEAE] hover:to-[#F4C2C2] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Save size={18} />
                  {editingProduct ? 'Ruaj Ndryshimet' : 'Shto Produktin'}
                </button>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    resetProductForm();
                  }}
                  className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                >
                  Anullo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}