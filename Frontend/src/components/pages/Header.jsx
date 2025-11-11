import React, { useState, useEffect } from 'react';
import { ShoppingCart, Phone, User, Snowflake, Sun, Leaf, Home, Shield, LogOut, Package } from 'lucide-react';
export default function Header({ currentPage, setCurrentPage }) {
  const [user, setUser] = useState(null);

  // Check if user is logged in - with proper safety check
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [currentPage]);

  const handleLogout = () => {
    if (window.confirm('Jeni të sigurt që dëshironi të dilni?')) {
      localStorage.removeItem('user');
      setUser(null);
      setCurrentPage('home');
      alert('✅ Jeni larguar me sukses!');
    }
  };

  const navItems = [
    { key: 'home', label: 'Faqja Kryesore', icon: <Home size={18} />, show: true },
    { key: 'winter', label: 'Koleksioni Dimëror', icon: <Snowflake size={18} />, show: true },
    { key: 'autumn-spring', label: 'Vjeshtë & Pranverë', icon: <Leaf size={18} />, show: true },
    { key: 'summer', label: 'Koleksioni Veror', icon: <Sun size={18} />, show: true },
    { key: 'kontakt', label: 'Kontakt', icon: <Phone size={18} />, show: true },
    { key: 'cart', label: 'Shporta', icon: <ShoppingCart size={18} />, show: true },
    { key: 'my-orders', label: 'Porositë e Mia', icon: <Package size={18} />, show: user !== null },
    { key: 'admin', label: 'Admin Panel', icon: <Shield size={18} />, show: user?.role === 'ADMIN' }

  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-rose-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Your Logo */}
          <div className="flex items-center">
            <img 
              src="/LOGOOO.jpg" 
              alt="Eriola BabyShop Logo" 
              className="h-14 w-auto object-contain cursor-pointer"
              onClick={() => setCurrentPage('home')}
            />
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.filter(item => item.show).map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item.key
                    ? 'bg-rose-50 text-rose-500 border border-rose-200 font-semibold'
                    : 'text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                } ${item.key === 'admin' ? 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700' : ''}`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            {/* User Info / Login Button */}
            {user ? (
              <div className="flex items-center space-x-2 ml-2">
                <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm text-green-700 font-semibold">
                    👋 {user.firstName}
                    {user.role === 'ADMIN' && (
                      <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                        ADMIN
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ml-2 ${
                  currentPage === 'login'
                    ? 'bg-rose-50 text-rose-500 border border-rose-200 font-semibold'
                    : 'text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                }`}
              >
                <User size={18} />
                <span className="font-medium">Login</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}