import React, { useState } from 'react';
import { apiService } from '../services/api';
const API_BASE_URL = 'https://eriola-babyshop-11.onrender.com/api';

export default function LoginPage({ setCurrentPage }) {
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '', isValid: true });
  const [registerRole, setRegisterRole] = useState("CUSTOMER"); // 👈 NEW

  const validatePassword = (pass) => {
    if (!pass) return { score: 0, feedback: '', isValid: true, level: '', color: '' };
    
    let score = 0;
    let feedback = [];

    if (pass.length >= 8) score++;
    else feedback.push('8+ karaktere');

    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    else feedback.push('Shkronja të mëdha/vogla');

    if (/[0-9]/.test(pass)) score++;
    else feedback.push('Numra');

    if (/[^A-Za-z0-9]/.test(pass)) score++;
    else feedback.push('Karakter special');

    const strength = 
      score === 0 ? { level: 'Shumë e dobët', color: '#ef4444' } :
      score === 1 ? { level: 'E dobët', color: '#f97316' } :
      score === 2 ? { level: 'Mesatare', color: '#eab308' } :
      score === 3 ? { level: 'E mirë', color: '#84cc16' } :
      { level: 'E fortë', color: '#22c55e' };

    return { 
      score, 
      ...strength, 
      feedback: feedback.length > 0 ? `Mungon: ${feedback.join(', ')}` : 'Fjalëkalim i fortë!',
      isValid: score >= 3 
    };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(validatePassword(newPassword));
  };

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
        alert('✅ Identifikimi u krye me sukses!');
        setCurrentPage('home');
      } else {
        setError(response.message || 'Identifikimi dështoi');
      }
    } catch (error) {
      setError('Email ose fjalëkalim i gabuar');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const pass = e.target.password.value;
    const validation = validatePassword(pass);

    if (pass && !validation.isValid) {
      setError(`Fjalëkalimi është i dobët! ${validation.feedback}`);
      return;
    }

    const confirmPass = e.target.confirmPassword?.value;
    if (confirmPass && pass !== confirmPass) {
      setError('Fjalëkalimet nuk përputhen!');
      return;
    }

    setLoading(true);

    const userData = {
      email: e.target.email.value,
      password: pass,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      phone: e.target.phone?.value || '',
      address: "",
      role: registerRole, // 👈 NEW
      isActive: true
    };

    try {
      const response = await apiService.registerUser(userData);

      if (response.success) {
        alert('✅ Regjistrimi u krye me sukses! Ju lutem identifikohuni.');
        setIsRegister(false);
        e.target.reset();
        setPassword('');
        setPasswordStrength({ score: 0, feedback: '', isValid: true });
      } else {
        setError(response.message || 'Regjistrimi dështoi');
      }
    } catch (error) {
      setError('Regjistrimi dështoi. Ju lutem provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Pink Header with Wave */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2">
              ERIOLA<span className="text-pink-200">BabyShop</span>
            </h1>
            <p className="text-lg text-pink-100">
              {isRegister ? 'Krijo llogarinë tënde' : 'Mirë se erdhe përsëri!'}
            </p>
          </div>
        </div>
      </div>

      {/* Wavy Divider */}
      <div className="relative h-16 bg-gradient-to-r from-pink-600 to-pink-500">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            d="M0,50 Q180,0 360,50 T720,50 T1080,50 T1440,50 L1440,100 L0,100 Z" 
            fill="white"
          />
        </svg>
      </div>

      {/* Back to Home Button */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-sm text-gray-600 hover:text-pink-500 transition-colors flex items-center gap-2"
        >
          ← Kthehu në faqe
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 p-8">
            {/* Toggle Buttons */}
            <div className="flex mb-8 bg-pink-50 rounded-full p-2">
              <button
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                  setPassword('');
                  setPasswordStrength({ score: 0, feedback: '', isValid: true });
                }}
                className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${
                  !isRegister 
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                IDENTIFIKOHU
              </button>
              <button
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                  setPassword('');
                  setPasswordStrength({ score: 0, feedback: '', isValid: true });
                }}
                className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${
                  isRegister 
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                REGJISTROHU
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl text-sm mb-6 font-medium">
                ⚠️ {error}
              </div>
            )}

            {!isRegister ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📧 Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🔒 Fjalëkalimi</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm pr-12 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 text-xl"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Duke u identifikuar...' : '✨ IDENTIFIKOHU TANI'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                {/* NEW: ROLE SELECTOR */}
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <input
                      type="radio"
                      name="role"
                      value="CUSTOMER"
                      checked={registerRole === "CUSTOMER"}
                      onChange={() => setRegisterRole("CUSTOMER")}
                    />
                    Customer
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      checked={registerRole === "ADMIN"}
                      onChange={() => setRegisterRole("ADMIN")}
                    />
                    Admin
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">👤 Emri</label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-all"
                      placeholder="Emri"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">👤 Mbiemri</label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-all"
                      placeholder="Mbiemri"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📧 Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📱 Telefon (opsional)</label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-all"
                    placeholder="+355 69 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🔒 Fjalëkalimi</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm pr-12 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 text-xl"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  
                  {password && (
                    <div className="mt-3 bg-gray-50 rounded-xl p-3">
                      <div className="flex gap-1 mb-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-2 flex-1 rounded-full transition-all"
                            style={{ 
                              backgroundColor: i < passwordStrength.score ? passwordStrength.color : '#e5e7eb'
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-xs">
                        <span style={{ color: passwordStrength.color }} className="font-bold">
                          {passwordStrength.level}
                        </span>
                        {passwordStrength.feedback && (
                          <span className="text-gray-600 ml-2">{passwordStrength.feedback}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🔒 Konfirmo Fjalëkalimin</label>
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Duke u regjistruar...' : '🎉 REGJISTROHU TANI'}
                </button>
              </form>
            )}

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t-2 border-pink-100 text-center">
              <div className="bg-pink-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-pink-600">🚚 DËRGESË FALAS MBI 40€</p>
                <p className="text-xs text-gray-600 mt-1">Produktet më cilësore për fëmijët tuaj</p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-pink-50 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-xs font-bold text-gray-700">Cilësi Premium</p>
            </div>
            <div className="bg-pink-50 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <p className="text-xs font-bold text-gray-700">100% i Sigurt</p>
            </div>
            <div className="bg-pink-50 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-xs font-bold text-gray-700">Dërgesë e Shpejtë</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 to-pink-500 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-pink-100">
            © 2024 Eriola BabyShop. Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </footer>
    </div>
  );
}
