import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Phone, CreditCard, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';

export default function CheckoutPage({ setCurrentPage }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    shippingAddress: '',
    phone: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      fetchCart(userData.id);
    } else {
      alert('Ju lutemi identifikohuni!');
      setCurrentPage('login');
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      setLoading(true);
      const cart = await apiService.getUserCart(userId);
      setCartItems(Array.isArray(cart) ? cart : []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Shporta është e zbrazët!');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        userId: user.id,
        shippingAddress: formData.shippingAddress,
        phone: formData.phone
      };

      const response = await fetch('http://localhost:8080/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to create order');

      const order = await response.json();
      
      // Store order ID for confirmation page
      localStorage.setItem('lastOrderId', order.id);
      
      alert('✅ Porosia u krye me sukses!');
      setCurrentPage('order-confirmation');
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('❌ Gabim në krijimin e porosisë! Ju lutemi provoni përsëri.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto"></div>
        <p className="mt-4 text-gray-600">Duke ngarkuar...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shporta është e zbrazët</h2>
        <p className="text-gray-600 mb-6">Shtoni produkte në shportë para se të vazhdoni.</p>
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
      <button
        onClick={() => setCurrentPage('cart')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Kthehu në Shportë
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-rose-500" />
                Adresa e Dërgesës
              </h2>
              <textarea
                required
                value={formData.shippingAddress}
                onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                placeholder="Shkruani adresën e plotë të dërgesës..."
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Phone size={24} className="text-rose-500" />
                Numri i Telefonit
              </h2>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                placeholder="+355 69 123 4567"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <CreditCard size={20} />
                Mënyra e Pagesës
              </h3>
              <p className="text-blue-800">Pagesë në Dorëzim (Cash on Delivery)</p>
              <p className="text-sm text-blue-600 mt-1">Do të paguani kur të merrni porosinë.</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Duke procesuar...' : 'Konfirmo Porosinë'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Përmbledhja e Porosisë</h2>
            
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map((cart) => (
                <div key={cart.id} className="flex gap-3 py-2 border-b">
                  <img
                    src={cart.item?.image || 'https://via.placeholder.com/60'}
                    alt={cart.item?.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{cart.item?.name}</p>
                    <p className="text-sm text-gray-500">Sasia: {cart.quantity}</p>
                    <p className="text-rose-500 font-bold text-sm">
                      {formatPrice(cart.item?.price * cart.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Nëntotali</span>
                <span className="font-semibold">{formatPrice(calculateTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transporti</span>
                <span className="font-semibold text-green-600">FALAS</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-lg font-bold">Totali</span>
                <span className="text-lg font-bold text-rose-500">{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}