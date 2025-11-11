import React, { useState, useEffect } from 'react';
import { Star, ArrowLeft, ShoppingBag, Filter } from 'lucide-react';
import { apiService } from '../services/api';

export default function SummerCollection({ setCurrentPage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    'Rompers',
    'Fustane',
    'Kostume',
    'Çorape',
    'Sandale',
    'Këpucë',
    'Veshje Plazhi',
    'Aksesorë'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await apiService.getAllItems();
        const filteredProducts = allProducts.filter(
          product => product.season === 'Koleksioni Veror'
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('sq-AL', {
      minimumFractionDigits: 0,
    }).format(price) + ' Lekë';
  };

  const handleAddToCart = async (itemId) => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      alert('Ju lutem identifikohuni për të shtuar produkte në shportë!');
      setCurrentPage('login');
      return;
    }

    const user = JSON.parse(userData);
    
    try {
      await apiService.addToCart(user.id, itemId, 1);
      alert('✅ Produkti u shtua në shportë!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Gabim në shtimin e produktit!');
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const sortProducts = (products) => {
    let sorted = [...products];
    switch(sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const filterProducts = (products) => {
    if (selectedCategories.length === 0) return products;
    return products.filter(p => selectedCategories.includes(p.category));
  };

  const displayProducts = sortProducts(filterProducts(products));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Changed to Pink Gradient */}
      <div className="bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 text-white py-12">
        <div className="container mx-auto px-6">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 mb-4 text-white hover:text-pink-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Kthehu në Faqe</span>
          </button>
          <h1 className="text-4xl font-bold mb-2">☀️ KOLEKSIONI VEROR</h1>
          <p className="text-lg text-white text-opacity-90">
            Veshje të lehta dhe të freskëta për verë
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="text-pink-500" size={24} />
                <h2 className="text-xl font-bold text-gray-900">FILTRO</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Kategoria</h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                      />
                      <span className="text-gray-700 group-hover:text-pink-500 transition-colors">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold text-sm transition-colors"
                >
                  Pastro Filtrat
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort & Count Bar */}
            <div className="flex justify-between items-center mb-6 bg-white rounded-xl shadow-md p-4">
              <div className="text-gray-600">
                <span className="font-bold text-pink-500">{displayProducts.length}</span> produkte
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-semibold">Rendit sipas:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="recommended">Rekomanduar</option>
                  <option value="price-low">Çmimi: Nga i ulëti</option>
                  <option value="price-high">Çmimi: Nga i larti</option>
                  <option value="name">Emri A-Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <p className="mt-4 text-gray-600">Duke ngarkuar produktet...</p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-md">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Nuk ka produkte
                </h2>
                <p className="text-gray-600 mb-6">
                  Provo të ndryshosh filtrat ose kthehu më vonë.
                </p>
                <button
                  onClick={() => setSelectedCategories([])}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Pastro Filtrat
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {displayProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={product.image || 'https://via.placeholder.com/400'} 
                        alt={product.name} 
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform" 
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white text-pink-600 text-xs font-bold px-3 py-1 rounded-full shadow">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] text-sm">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-pink-600">
                          {formatPrice(product.price)}
                        </span>
                        <div className="flex items-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold text-sm transition-all"
                      >
                        Shto në Shportë
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}