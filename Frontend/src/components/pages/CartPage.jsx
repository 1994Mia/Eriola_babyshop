import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { apiService } from '../services/api';

export default function CartPage({ setCurrentPage }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      fetchCart(userData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const cart = await apiService.getUserCart(userId);
      console.log('Fetched cart:', cart);
      setCartItems(Array.isArray(cart) ? cart : []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await apiService.updateCartItem(cartId, newQuantity);
      fetchCart(user.id);
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Gabim në përditësimin e shportës!');
    }
  };

  const removeItem = async (cartId) => {
    try {
      await apiService.removeFromCart(cartId);
      fetchCart(user.id);
      alert('Produkti u hoq nga shporta!');
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Gabim në heqjen e produktit!');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Jeni të sigurt që dëshironi të zbrazni shportën?')) return;
    
    try {
      await apiService.clearCart(user.id);
      setCartItems([]);
      alert('Shporta u zbraze!');
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Gabim në zbrazjen e shportës!');
    }
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, cart) => {
      const price = cart.item?.price || 0;
      const quantity = cart.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('sq-AL', {
      minimumFractionDigits: 0,
    }).format(price) + ' Lekë';
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ju lutemi identifikohuni</h2>
        <p className="text-gray-600 mb-6">Duhet të jeni të identifikuar për të parë shportën tuaj.</p>
        <button 
          onClick={() => setCurrentPage('login')}
          className="bg-rose-400 text-white px-6 py-3 rounded-lg hover:bg-rose-500"
        >
          Identifikohu
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto"></div>
        <p className="mt-4 text-gray-600">Duke ngarkuar shportën...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto text-red-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <button 
          onClick={() => fetchCart(user.id)}
          className="bg-rose-400 text-white px-6 py-3 rounded-lg hover:bg-rose-500"
        >
          Provo Përsëri
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shporta është e zbrazët</h2>
        <p className="text-gray-600 mb-6">Nuk keni shtuar asnjë produkt në shportë.</p>
        <button 
          onClick={() => setCurrentPage('home')}
          className="bg-rose-400 text-white px-6 py-3 rounded-lg hover:bg-rose-500"
        >
          Vazhdo Blerjen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shporta Juaj</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-600 flex items-center gap-2"
        >
          <Trash2 size={20} />
          Zbraze Shportën
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((cart) => {
            if (!cart.item) return null; // Skip if item is missing
            
            return (
              <div key={cart.id} className="bg-white rounded-lg shadow-md p-6 flex gap-4">
                <img
                  src={cart.item.image || 'https://via.placeholder.com/150'}
                  alt={cart.item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{cart.item.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{cart.item.category}</p>
                  <p className="text-rose-500 font-bold">{formatPrice(cart.item.price)}</p>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <button
                    onClick={() => removeItem(cart.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex items-center gap-2 border rounded-lg">
                    <button
                      onClick={() => updateQuantity(cart.id, cart.quantity - 1)}
                      className="p-2 hover:bg-gray-100 rounded-l-lg"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-semibold">{cart.quantity || 0}</span>
                    <button
                      onClick={() => updateQuantity(cart.id, cart.quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-r-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="font-bold text-gray-800">
                    {formatPrice(cart.item.price * cart.quantity)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Përmbledhje e Porosisë</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Nëntotali</span>
                <span className="font-semibold">{formatPrice(calculateTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transporti</span>
                <span className="font-semibold text-green-600">FALAS</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Totali</span>
                <span className="text-lg font-bold text-rose-500">{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            <button 
              onClick={() => setCurrentPage('checkout')}
              className="w-full bg-rose-400 text-white py-3 rounded-lg hover:bg-rose-500 font-semibold mb-3"
            >
              Vazhdo në Checkout
            </button>

            <button 
              onClick={() => setCurrentPage('home')}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Vazhdo Blerjen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}