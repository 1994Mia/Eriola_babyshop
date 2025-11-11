import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';

export default function CategoryPage({ setCurrentPage, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryNames = {
    'rompers': 'Rompers',
    'dresses': 'Fustane',
    'socks': 'Çorape',
    'coats': 'Xhaketa',
    'tights': 'Geta',
    'ribbons': 'Fjongo',
    'costumes': 'Kostume',
    'accessories': 'Aksesorë',
    'sandals': 'Sandale',
    'boots': 'Çizme',
    'shoes': 'Këpucë',
    'swimwear': 'Veshje Plazhi'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await apiService.getAllItems();
        // Filter products by category
        const categoryName = categoryNames[category];
        const filteredProducts = allProducts.filter(
          product => product.category.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-6">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 mb-6 text-white hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Kthehu në Faqe</span>
          </button>
          <h1 className="text-5xl font-bold mb-4">{categoryNames[category]}</h1>
          <p className="text-xl text-white text-opacity-90">
            Zbuloni koleksionin tonë të {categoryNames[category]}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-rose-500"></div>
            <p className="mt-6 text-gray-600 text-lg">Duke ngarkuar produktet...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto text-gray-300 mb-6" size={80} />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nuk ka produkte në këtë kategori
            </h2>
            <p className="text-gray-600 mb-8">
              Provoni kategori të tjera ose kthehuni më vonë.
            </p>
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Kthehu në Faqe
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-gray-600 text-lg">
                U gjetën <span className="font-bold text-rose-500">{products.length}</span> produkte
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image || 'https://via.placeholder.com/400'} 
                      alt={product.name} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white text-rose-500 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-bold text-rose-500">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center text-amber-400">
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Shto në Shportë
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}