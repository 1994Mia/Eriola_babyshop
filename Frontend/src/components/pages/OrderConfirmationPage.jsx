import React, { useState, useEffect } from 'react';
import { CheckCircle, Package, MapPin, Phone, Calendar } from 'lucide-react';

export default function OrderConfirmationPage({ setCurrentPage }) {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = localStorage.getItem('lastOrderId');
    if (orderId) {
      fetchOrderDetails(orderId);
      localStorage.removeItem('lastOrderId'); // Clean up
    } else {
      setCurrentPage('home');
    }
  }, []);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      
      // Fetch order
      const orderRes = await fetch(`http://localhost:8080/api/orders/${orderId}`);
      const orderData = await orderRes.json();
      setOrder(orderData);

      // Fetch order items
      const itemsRes = await fetch(`http://localhost:8080/api/orders/${orderId}/items`);
      const itemsData = await itemsRes.json();
      setOrderItems(itemsData);
      
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('sq-AL', {
      minimumFractionDigits: 0,
    }).format(price) + ' Lekë';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('sq-AL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto"></div>
        <p className="mt-4 text-gray-600">Duke ngarkuar...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Nuk u gjet porosia.</p>
        <button 
          onClick={() => setCurrentPage('home')}
          className="mt-4 bg-rose-400 text-white px-6 py-3 rounded-lg hover:bg-rose-500"
        >
          Kthehu në Faqe
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Porosia u Krye me Sukses!</h1>
        <p className="text-gray-600">Faleminderit për blerjen tuaj. Do të merrni një konfirmim në email.</p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Detajet e Porosisë</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Package className="text-rose-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-700">Numri i Porosisë</p>
              <p className="text-gray-900 text-lg">#{order.id}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="text-rose-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-700">Data e Porosisë</p>
              <p className="text-gray-900">{formatDate(order.orderDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="text-rose-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-700">Adresa e Dërgesës</p>
              <p className="text-gray-900">{order.shippingAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="text-rose-500 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-700">Telefoni</p>
              <p className="text-gray-900">{order.phone}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold text-blue-900">Statusi i Porosisë</p>
          <p className="text-blue-800 text-lg">{order.status}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Produktet e Porosisë</h2>
        
        <div className="space-y-4">
          {orderItems.map((orderItem) => (
            <div key={orderItem.id} className="flex gap-4 py-3 border-b last:border-b-0">
              <img
                src={orderItem.item?.image || 'https://via.placeholder.com/80'}
                alt={orderItem.item?.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{orderItem.item?.name}</h3>
                <p className="text-sm text-gray-500">{orderItem.item?.category}</p>
                <p className="text-sm text-gray-600 mt-1">Sasia: {orderItem.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-rose-500">{formatPrice(orderItem.price)}</p>
                <p className="text-sm text-gray-500">x{orderItem.quantity}</p>
                <p className="font-bold text-gray-900 mt-1">
                  {formatPrice(orderItem.price * orderItem.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Totali</span>
            <span className="text-2xl font-bold text-rose-500">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setCurrentPage('my-orders')}
          className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Shiko Porositë e Mia
        </button>
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Vazhdo Blerjen
        </button>
      </div>
    </div>
  );
}