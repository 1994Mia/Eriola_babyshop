import React, { useState, useEffect } from 'react';
import { Star, Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      {/* Soft Pink Header with Wave */}
      <div className="bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE] text-white">
        <div className="container mx-auto px-4 py-8">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 mb-4 hover:text-pink-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Kthehu në Faqe</span>
          </button>
          <h1 className="text-5xl font-bold mb-2">☀️ KOLEKSIONI VEROR</h1>
          <p className="text-lg text-white text-opacity-90">Veshje të lehta dhe të freskëta për verë</p>
        </div>
      </div>

      {/* Wavy Divider */}
      <div className="relative h-16 bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE]">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            d="M0,50 Q180,0 360,50 T720,50 T1080,50 T1440,50 L1440,100 L0,100 Z" 
            fill="white"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-[#F9D9D9] rounded-2xl p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🎯</span>
                <h2 className="text-xl font-bold text-[#ECAEAE]">KATEGORIA</h2>
              </div>

              {/* Search Filter */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Filtro"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#F4C2C2] focus:outline-none"
                />
              </div>

              {/* Category Checkboxes */}
              <div className="space-y-3">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 rounded border-gray-300 text-[#F4C2C2] focus:ring-[#F4C2C2]"
                    />
                    <span className="text-gray-700 group-hover:text-[#ECAEAE] transition-colors text-sm">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6 bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-gray-600 text-sm">
                Duke shfaqur <span className="font-bold text-[#ECAEAE]">{displayProducts.length}</span> produkte
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                  ☰ Rendit sipas
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#F4C2C2] focus:border-[#F4C2C2] bg-white"
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4C2C2]"></div>
                <p className="mt-4 text-gray-600">Duke ngarkuar produktet...</p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-[#F9D9D9]">
                <ShoppingBag className="mx-auto text-[#F9D9D9] mb-4" size={64} />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Nuk ka produkte
                </h2>
                <p className="text-gray-600 mb-6">
                  Provo të ndryshosh filtrat ose kthehu më vonë.
                </p>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="bg-gradient-to-r from-[#F4C2C2] to-[#ECAEAE] hover:from-[#ECAEAE] hover:to-[#F4C2C2] text-white px-6 py-3 rounded-full font-semibold transition-all"
                  >
                    Pastro Filtrat
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-[#F9D9D9] transition-all overflow-hidden shadow-sm hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={product.image || 'https://via.placeholder.com/300'} 
                        alt={product.name} 
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                      <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-[#FCF0F0] transition-colors">
                        <Heart size={18} className="text-[#F4C2C2]" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] text-sm">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="#FCD34D" className="text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-xl font-bold text-[#ECAEAE] mb-3">
                        {formatPrice(product.price)}
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        className="w-full bg-gradient-to-r from-[#F4C2C2] to-[#ECAEAE] hover:from-[#ECAEAE] hover:to-[#F4C2C2] text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
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

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE] text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">ERIOLA<span className="text-pink-100">bebe</span></h3>
              <p className="text-white text-opacity-90 text-sm">Dyqani juaj i preferuar për veshje cilësore për fëmijë.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Lidhje të Shpejta</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-pink-100">Faqja Kryesore</button></li>
                <li><button onClick={() => setCurrentPage('summer')} className="hover:text-pink-100">Koleksioni Veror</button></li>
                <li><button onClick={() => setCurrentPage('winter')} className="hover:text-pink-100">Koleksioni Dimëror</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Shërbimi</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pink-100">Politika e Kthimit</a></li>
                <li><a href="#" className="hover:text-pink-100">Termat & Kushtet</a></li>
                <li><button onClick={() => setCurrentPage('kontakt')} className="hover:text-pink-100">Na Kontaktoni</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Kontakti</h4>
              <ul className="space-y-2 text-sm text-white text-opacity-90">
                <li>📍 Tiranë, Shqipëri</li>
                <li>📞 +355 69 123 4567</li>
                <li>✉️ info@eriolababyshop.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white border-opacity-20 mt-8 pt-6 text-center text-sm text-white text-opacity-90">
            © 2024 Eriola BabyShop. Të gjitha të drejtat e rezervuara.
          </div>
        </div>
      </footer>
    </div>
  );
}