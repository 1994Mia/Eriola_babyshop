
  import React, { useState } from 'react';
import Header from "./components/pages/Header";
import HomePage from "./components/pages/HomePage";
import WinterCollection from "./components/pages/WinterCollection";
import AutumnSpringCollection from "./components/pages/AutumnSpringCollection";
import SummerCollection from "./components/pages/SummerCollection";
import KontaktPage from './components/pages/KontaktPage';
import LoginPage from './components/pages/LoginPage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import AdminPage from './components/pages/AdminPage';
import CategoryPage from './components/pages/CategoryPage';
import OrderConfirmationPage from './components/pages/OrderConfirmationPage';
import MyOrdersPage from './components/pages/MyOrdersPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Navigate to category page
  const navigateToCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage('category');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} navigateToCategory={navigateToCategory} />}
        {currentPage === 'winter' && <WinterCollection setCurrentPage={setCurrentPage} />}
        {currentPage === 'autumn-spring' && <AutumnSpringCollection setCurrentPage={setCurrentPage} />}      
        {currentPage === 'summer' && <SummerCollection setCurrentPage={setCurrentPage}/>}
        {currentPage === 'kontakt' && <KontaktPage />}
        {currentPage === 'order-confirmation' && <OrderConfirmationPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'my-orders' && <MyOrdersPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'admin' && <AdminPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'cart' && <CartPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'category' && <CategoryPage setCurrentPage={setCurrentPage} category={selectedCategory} />}
        {currentPage === 'checkout' && <CheckoutPage setCurrentPage={setCurrentPage} />}
      </main>
      
      <footer className="bg-pink-600 text-white py-6 mt-auto w-full">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Eriola BabyShop. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </footer>
    </div>
  );
}