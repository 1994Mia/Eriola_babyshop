import React, { useState } from 'react';
import { apiService } from '../services/api';
export default function LoginPage({ setCurrentPage }) {
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const credentials = {
      email: e.target.email.value,
      password: e.target.password.value
    };

    try {
      const response = await apiService.loginUser(credentials);

      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        alert('✅ Login successful!');
        setCurrentPage('home');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userData = {
      email: e.target.email.value,
      password: e.target.password.value,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      phone: e.target.phone?.value || ''
    };

    try {
      const response = await apiService.registerUser(userData);

      if (response.success) {
        alert('✅ Registration successful! Please login.');
        setIsRegister(false);
        e.target.reset();
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex">
      {/* Left Side - Cute Baby Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/flagged/photo-1571275460309-b1f63508b7b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGN1dGUlMjBiYWJ5JTIwaW1hZ2UlMjBmb3IlMjBsb2dpbiUyMHBhZ2UlMjBpbiUyMGElMjBiYWJ5JTIwd2Vic2l0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600"
          alt="Cute baby"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Eriola BabyShop</h1>
            <p className="text-xl">Your little one's favorite shop</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Brand Logo */}
          <div className="text-center lg:hidden mb-8">
            <h1 className="text-3xl font-bold text-pink-400 tracking-wide">
              Eriola BabyShop
            </h1>
            <div className="w-16 h-1 bg-pink-300 mx-auto mt-2"></div>
          </div>

          {/* Form Container */}
          <div className="bg-white py-8 px-6 shadow-sm sm:rounded-lg sm:px-10 border border-pink-200">
            {/* Toggle Login/Register */}
            <div className="flex mb-6">
              <button
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-2 text-center font-semibold ${
                  !isRegister
                    ? 'border-b-2 border-pink-400 text-pink-400'
                    : 'text-gray-500'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-2 text-center font-semibold ${
                  isRegister
                    ? 'border-b-2 border-pink-400 text-pink-400'
                    : 'text-gray-500'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {!isRegister ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Identifikohu
                </h2>
                <p className="text-gray-600 text-center mb-8 text-sm">
                  Ju lutemi shkruani e-mail dhe fjalëkalimin tuaj
                </p>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-400 text-white py-3 px-4 rounded-lg hover:bg-pink-500 focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'IDENTIFIKOHU'}
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Regjistrohu
                </h2>
                <p className="text-gray-600 text-center mb-8 text-sm">
                  Krijo një llogari të re
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Emri
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-colors"
                      placeholder="Emri"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Mbiemri
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-colors"
                      placeholder="Mbiemri"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon (opsional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-colors"
                    placeholder="+355 69 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-400 text-white py-3 px-4 rounded-lg hover:bg-pink-500 focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'REGJISTROHU'}
                </button>
              </form>
            )}

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-pink-100 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-2">
                <span>POSTA FALAS PËR POROSI MBI 40 EURO!</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>Shqipëri (EUR €)</span>
                <span>•</span>
                <span>Shqip</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}