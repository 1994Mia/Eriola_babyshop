import React, { useState, useEffect } from 'react';
import { Star, Truck, Shield, ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import { apiService } from "../services/api";




export default function HomePage({ setCurrentPage, navigateToCategory }) {
  const [carouselSlide, setCarouselSlide] = useState(0);
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

  // Carousel images - multiple image sets
  const carouselImageSets = [
    [
      {
        url: "https://plus.unsplash.com/premium_photo-1683147641019-cf68bade1eb5?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8&ixlib=rb-4.1.0&q=60&w=3000",
        text: "Veshjet me te vecanta"
      },
      {
        url: "https://images.unsplash.com/photo-1757691723733-ec0e6a6af7e3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y3V0ZSUyMGJhYnklMjB3aXRoJTIwZmxvd2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
        text: "Sherbim i dedikuar"
      },
      {
        url: "https://media.istockphoto.com/id/1178053046/photo/baby-boy-try-to-catch-cat.webp?a=1&b=1&s=612x612&w=0&k=20&c=IyCStLBVmW1pyNwNBv_PVh-lzqyYZNER9J-Eaz-Gjy4=",
        text: "Oferta speciale"
      }
    ],
    [
      {
        url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=60",
        text: "Koleksion i ri"
      },
      {
        url: "https://images.unsplash.com/photo-1662525987188-d3fd7ec7bff6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGNoaWxkcmVuJTIwY2xvdGhlcnxlbnwwfHwwfHx8MA%3D%3D",
        text: "Cilësi Premium"
      },
      {
        url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=60",
        text: "Produkte unike"
      }
    ],
    [
      {
        url: "https://images.unsplash.com/photo-1742541755766-f8495b15bc98?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGNoaWxkcmVuJTIwY2xvdGhlcnxlbnwwfHwwfHx8MA%3D%3D",
        text: "Prane jush gjithmone"
      },
      {
        url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=60",
        text: "Komfort maksimal"
      },
     
    ]
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

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselSlide((prev) => (prev + 1) % carouselImageSets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
  try {
    setLoading(true);
    const products = await apiService.getAllItems();
    console.log("FRONTEND RECEIVED:", products);  // <-- ADD THIS
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
      {/* Top Soft Pink Banner */}
      <div className="bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE] text-white">
        {/* Logo and Navigation Bar */}
        <div className="border-b border-white border-opacity-20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-3xl font-bold tracking-wider">ERIOLA BABYSHOP</h1>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
                <button onClick={() => setCurrentPage('summer')} className="hover:text-pink-100 transition-colors">
                  Koleksioni Veror
                </button>
                <button onClick={() => setCurrentPage('winter')} className="hover:text-pink-100 transition-colors">
                  Koleksioni Dimëror
                </button>
                <button onClick={() => setCurrentPage('autumn-spring')} className="hover:text-pink-100 transition-colors">
                  Vjeshtë & Pranverë
                </button>
                <button onClick={() => setCurrentPage('about')} className="hover:text-pink-100 transition-colors">
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
                  <span className="text-white font-semibold text-sm uppercase tracking-wide group-hover:text-pink-100 transition-colors">
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
              <div key={index} className="flex items-center gap-4 p-4 bg-[#FCF0F0] rounded-xl">
                <div className="text-[#ECAEAE]">
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
      <div className="bg-gradient-to-b from-[#FCF0F0] to-white py-16">
        <div className="container mx-auto px-6">
          <div className="relative">
            {/* Carousel Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carouselImageSets[carouselSlide].map((card, index) => (
                <div 
                  key={index}
                  className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                >
                  <img 
                    src={card.url}
                    alt={card.text}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                    <p className="text-white text-lg">{card.text}</p>
                  </div>
                  <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-[#F4C2C2] opacity-70"></div>
                  <div className="absolute bottom-20 left-6 w-16 h-16 rounded-full bg-[#F0B8B8] opacity-60"></div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCarouselSlide((prev) => (prev - 1 + carouselImageSets.length) % carouselImageSets.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <ChevronLeft size={24} className="text-[#ECAEAE]" />
            </button>
            <button
              onClick={() => setCarouselSlide((prev) => (prev + 1) % carouselImageSets.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <ChevronRight size={24} className="text-[#ECAEAE]" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {carouselImageSets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    carouselSlide === index ? 'bg-[#ECAEAE] w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Collections Grid with Beautiful Cards */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasonalCollections.map((collection) => (
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
                  <p className="text-[#ECAEAE] font-semibold text-sm uppercase tracking-widest">
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
      <div className="bg-gradient-to-b from-white to-[#FCF0F0] py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Produktet Më të Vlerësuara</h2>
            <div className="w-24 h-1 bg-[#F4C2C2] mx-auto"></div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4C2C2]"></div>
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
                      <span className="bg-white text-[#ECAEAE] text-xs font-bold px-3 py-1 rounded-full shadow">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] text-sm">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-[#ECAEAE]">
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
                      className="w-full bg-[#F4C2C2] hover:bg-[#ECAEAE] text-white py-2 rounded-lg font-semibold text-sm transition-all"
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
      <div className="bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE] py-12">
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