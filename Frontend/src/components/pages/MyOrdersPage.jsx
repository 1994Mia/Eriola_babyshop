import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';

export default function MyOrdersPage({ setCurrentPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      fetchOrders(userData.id);
    } else {
      alert('Ju lutemi identifikohuni!');
      setCurrentPage('login');
    }
  }, []);

  const fetchOrders = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/items`);
      const data = await response.json();
      setOrderItems(data);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('sq-AL', {
      minimumFractionDigits: 0,
    }).format(price) + ' Lekë';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sq-AL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'PENDING': 'Në Pritje',
      'CONFIRMED': 'E Konfirmuar',
      'SHIPPED': 'Në Transport',
      'DELIVERED': 'E Dorëzuar',
      'CANCELLED': 'E Anulluar'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto"></div>
        <p className="mt-4 text-gray-600">Duke ngarkuar porositë...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuk keni porosi ende</h2>
        <p className="text-gray-600 mb-6">Filloni të blini produktet tuaja të preferuara!</p>
        <button 
          onClick={() => setCurrentPage('home')}
          className="bg-rose-400 text-white px-6 py-3 rounded-lg hover:bg-rose-500"
        >
          Vazhdo Blerjen
        </button>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <button
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Kthehu te Porositë
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Porosia #{selectedOrder.id}</h2>
              <p className="text-gray-600">{formatDate(selectedOrder.orderDate)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(selectedOrder.status)}`}>
              {getStatusText(selectedOrder.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Adresa e Dërgesës</p>
              <p className="font-semibold">{selectedOrder.shippingAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Telefoni</p>
              <p className="font-semibold">{selectedOrder.phone}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4">Produktet</h3>
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex gap-4 py-3 border-b">
                <img
                  src={item.item?.image || 'https://via.placeholder.com/80'}
                  alt={item.item?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.item?.name}</h4>
                  <p className="text-sm text-gray-500">{item.item?.category}</p>
                  <p className="text-sm text-gray-600">Sasia: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-rose-500">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Totali</span>
              <span className="text-2xl font-bold text-rose-500">{formatPrice(selectedOrder.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Porositë e Mia</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => handleOrderClick(order)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4 flex-1">
                <div className="bg-rose-100 p-3 rounded-lg">
                  <Package className="text-rose-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">Porosia #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar size={16} />
                    <span className="text-sm">{formatDate(order.orderDate)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                    <span className="text-sm">{order.shippingAddress}</span>
                  </div>
                </div>
              </div>

              <div className="text-right ml-4">
                <p className="text-2xl font-bold text-rose-500 mb-2">{formatPrice(order.totalAmount)}</p>
                <button className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-semibold">
                  Detajet
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}