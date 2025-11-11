import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Package, Users, ShoppingCart, 
  TrendingUp, Search, X, Save 
} from 'lucide-react';
import { apiService } from '../services/api';

export default function AdminPage({ setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    stock: '',
    season: ''
  });

  // Check if user is admin
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'ADMIN') {
      alert('Access Denied! Admin only.');
      setCurrentPage('home');
      return;
    }
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
      season:''
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

  // Dashboard Stats
  const stats = [
    {
      title: 'Total Produkte',
      value: products.length,
      icon: <Package size={32} />,
      color: 'bg-blue-500'
    },
    {
      title: 'Kategori',
      value: new Set(products.map(p => p.category)).size,
      icon: <Users size={32} />,
      color: 'bg-green-500'
    },
    {
      title: 'Në Stok',
      value: products.filter(p => p.stock > 0).length,
      icon: <ShoppingCart size={32} />,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Vlera',
      value: formatPrice(products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)),
      icon: <TrendingUp size={32} />,
      color: 'bg-rose-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel - Eriola BabyShop</h1>
            <button
              onClick={() => setCurrentPage('home')}
              className="text-gray-600 hover:text-gray-900 font-semibold"
            >
              ← Kthehu në Faqe
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'products'
                  ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Produktet
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className={`${stat.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-gray-600 text-sm font-semibold mb-2">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Produktet e Fundit</h3>
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image || 'https://via.placeholder.com/60'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <p className="font-bold text-rose-500">{formatPrice(product.price)}</p>
                  </div>
                ))}
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
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Shto Produkt të Ri
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Kërko produkte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Produkti</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kategoria</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Çmimi</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Veprime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image || 'https://via.placeholder.com/60'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <span className="font-semibold text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Modifiko Produktin' : 'Shto Produkt të Ri'}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  resetProductForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emri i Produktit</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stoku</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL e Fotografisë</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Përshkrimi</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Përshkrimi i produktit..."
                />
              </div>
              <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">Sezoni</label>
  <select
    required
    value={productForm.season}
    onChange={(e) => setProductForm({...productForm, season: e.target.value})}
    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
  >
    <option value="">Zgjidh sezonin</option>
    <option value="Koleksioni Dimëror">Koleksioni Dimëror</option>
    <option value="Koleksioni Veror">Koleksioni Veror</option>
    <option value="Vjeshtë & Pranverë">Vjeshtë & Pranverë</option>
  </select>
</div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Save size={20} />
                  {editingProduct ? 'Ruaj Ndryshimet' : 'Shto Produktin'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    resetProductForm();
                  }}
                  className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  Anullo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}