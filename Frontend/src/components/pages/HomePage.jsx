import React, { useState, useEffect } from 'react';
import { Star, Truck, Shield, ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';

export default function HomePage({ setCurrentPage, navigateToCategory }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Main Categories with circular images
  const mainCategories = [
    { 
      id: 'rompers', 
      name: 'Rompers', 
      image: 'https://images.unsplash.com/photo-1744424751772-15cf9a001bd7?w=600&auto=format&fit=crop&q=60' 
    },
    { 
      id: 'dresses', 
      name: 'Fustane', 
      image: 'https://plus.unsplash.com/premium_photo-1663100628848-37e643e13214?w=600&auto=format&fit=crop&q=60' 
    },
    { 
      id: 'coats', 
      name: 'Xhaketa', 
      image: 'https://images.unsplash.com/photo-1615263558644-a7c936b36685?w=600&auto=format&fit=crop&q=60' 
    },
    { 
      id: 'shoes', 
      name: 'Këpucë', 
      image: 'https://images.unsplash.com/photo-1617687315565-2e6445e56f7a?w=600&auto=format&fit=crop&q=60' 
    },
    { 
      id: 'accessories', 
      name: 'Aksesorë', 
      image: 'https://plus.unsplash.com/premium_photo-1661430931607-70b2e194f741?w=600&auto=format&fit=crop&q=60' 
    },
    { 
      id: 'boots', 
      name: 'Çizme', 
      image: 'https://media.istockphoto.com/id/854273596/photo/happy-child-girl-with-umbrella-and-paper-boat-in-puddle-in-autumn-on-nature.webp?a=1&b=1&s=612x612&w=0&k=20&c=HcfCUXxUOri61QVF_nSOoYWvbBSkz5QSzjLI_g_6wHg=' 
    },
    { 
      id: 'costumes', 
      name: 'Kostume', 
      image: 'https://images.unsplash.com/photo-1640982166894-181add64ee86?w=600&auto=format&fit=crop&q=60' 
    }
  ];

  // Seasonal Collections
  const seasonalCollections = [
    {
      id: 'summer',
      name: 'KOLEKSIONI VEROR',
      subtitle: 'PËRSHKRUAJ SEZONIN',
      gradient: 'from-amber-200 via-pink-100 to-rose-100',
      emoji: '☀️'
    },
    {
      id: 'winter',
      name: 'KOLEKSIONI DIMËROR',
      subtitle: 'NGROHTËSI DHE STIL',
      gradient: 'from-blue-100 via-purple-100 to-pink-100',
      emoji: '❄️'
    },
    {
      id: 'autumn-spring',
      name: 'VJESHTË & PRANVERË',
      subtitle: 'NGJYRA TË BUKURA',
      gradient: 'from-green-100 via-teal-100 to-cyan-100',
      emoji: '🌸'
    }
  ];

  const features = [
    {
      icon: <Truck size={28} />,
      title: 'Dërgesë Falas',
      description: 'Për porosi mbi 40€'
    },
    {
      icon: <Shield size={28} />,
      title: 'Cilësi e Garantuar',
      description: 'Produkte të testuara'
    },
    {
      icon: <Sparkles size={28} />,
      title: 'Produktet me Inn',
      description: 'Gjithmonë për ju'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await apiService.getAllItems();
        setTopProducts(products.slice(0, 8));
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

  const handleCategoryClick = (categoryId) => {
    navigateToCategory(categoryId);
  };

  const handleSeasonalCollection = (collectionId) => {
    setCurrentPage(collectionId);
  };

  return (
    <div className="space-y-0">
      {/* Top Purple Banner like Guler Bebe */}
<div className="bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 text-white">        {/* Logo and Navigation Bar */}
        <div className="border-b border-white border-opacity-20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-3xl font-bold tracking-wider">ERIOLA BABYSHOP</h1>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
                <button onClick={() => setCurrentPage('summer')} className="hover:text-pink-200 transition-colors">
                  Koleksioni Veror
                </button>
                <button onClick={() => setCurrentPage('winter')} className="hover:text-pink-200 transition-colors">
                  Koleksioni Dimëror
                </button>
                <button onClick={() => setCurrentPage('autumn-spring')} className="hover:text-pink-200 transition-colors">
                  Vjeshtë & Pranverë
                </button>
                <button onClick={() => setCurrentPage('about')} className="hover:text-pink-200 transition-colors">
                  Rreth Nesh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Categories Section with Wave */}
        <div className="relative pb-20">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 justify-items-center">
              {mainCategories.map((category) => (
                <div 
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white font-semibold text-sm uppercase tracking-wide group-hover:text-pink-200 transition-colors">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Wave SVG */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl">
                <div className="text-pink-600">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cute Baby Carousel Section */}
      <div className="bg-gradient-to-b from-pink-50 to-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer">
              <img 
                src="https://plus.unsplash.com/premium_photo-1683147641019-cf68bade1eb5?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8&ixlib=rb-4.1.0&q=60&w=3000"
                alt="Baby fashion"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                <p className="text-white text-lg">Veshjet me te vecanta </p>
              </div>
              <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-pink-400 opacity-70"></div>
              <div className="absolute bottom-20 left-6 w-16 h-16 rounded-full bg-purple-400 opacity-60"></div>
            </div>

            {/* Card 2 */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1757691723733-ec0e6a6af7e3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y3V0ZSUyMGJhYnklMjB3aXRoJTIwZmxvd2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
                alt="Kids collection"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/70 to-transparent flex flex-col justify-end p-8">
                <p className="text-white text-lg">Sherbim i dedikuar</p>
              </div>
              <div className="absolute top-6 left-6 w-24 h-24 rounded-full bg-rose-300 opacity-50"></div>
              <div className="absolute bottom-28 right-8 w-20 h-20 rounded-full bg-orange-300 opacity-60"></div>
            </div>

            {/* Card 3 */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer">
              <img 
                src="https://media.istockphoto.com/id/1178053046/photo/baby-boy-try-to-catch-cat.webp?a=1&b=1&s=612x612&w=0&k=20&c=IyCStLBVmW1pyNwNBv_PVh-lzqyYZNER9J-Eaz-Gjy4="
                alt="Happy babies"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/70 to-transparent flex flex-col justify-end p-8">
                <p className="text-white text-lg">Oferta speciale</p>
              </div>
              <div className="absolute top-10 right-10 w-28 h-28 rounded-full bg-pink-300 opacity-50"></div>
              <div className="absolute bottom-24 left-10 w-16 h-16 rounded-full bg-yellow-300 opacity-70"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Collections Grid with Beautiful Cards */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasonalCollections.map((collection, index) => (
              <div 
                key={collection.id}
                onClick={() => handleSeasonalCollection(collection.id)}
                className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-80"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient}`}></div>
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform">
                    {collection.emoji}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                    {collection.name}
                  </h3>
                  <p className="text-pink-600 font-semibold text-sm uppercase tracking-widest">
                    {collection.subtitle}
                  </p>
                  <button className="mt-6 bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-md">
                    Shiko Koleksionin
                  </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-white opacity-20"></div>
                <div className="absolute bottom-6 left-6 w-32 h-32 rounded-full bg-white opacity-10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gradient-to-b from-white to-pink-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Produktet Më të Vlerësuara</h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto"></div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">Nuk ka produkte të disponueshme.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {topProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all"
                >
                  <div className="relative overflow-hidden rounded-t-xl">
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
                          <Star key={i} size={14} fill="currentColor" />
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

      {/* Bottom Stats Banner */}
<div className="bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 py-12">
          <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">5+</div>
              <div className="text-lg opacity-90 uppercase tracking-wide">Vjet Eksperiencë</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{topProducts.length}+</div>
              <div className="text-lg opacity-90 uppercase tracking-wide">Produkte</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90 uppercase tracking-wide">Klientë të Lumtur</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}