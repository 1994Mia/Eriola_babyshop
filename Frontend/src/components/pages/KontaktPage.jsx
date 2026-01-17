import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Send, Star } from 'lucide-react';
import { apiService } from '../services/api';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiService.submitContact(formData);
      alert('✅ Mesazhi u dërgua me sukses! Do t\'ju kontaktojmë së shpejti.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact:', error);
      alert('❌ Gabim në dërgimin e mesazhit. Ju lutemi provoni përsëri.');
    } finally {
      setSubmitting(false);
    }
  };

  const reviews = [
    {
      name: 'Anxhela M.',
      rating: 5,
      text: 'Produkte shumë cilësore! Fëmija im i adhuron veshjet. Shërbim i shkëlqyer!',
      date: 'Tetor 2024'
    },
    {
      name: 'Brunilda K.',
      rating: 5,
      text: 'Cilësi e jashtëzakonshme dhe çmime të arsyeshme. Absolutisht e rekomandoj!',
      date: 'Shtator 2024'
    },
    {
      name: 'Dorina S.',
      rating: 5,
      text: 'Dërgesa e shpejtë dhe produkte fantastike. Do të bëj blerje përsëri!',
      date: 'Gusht 2024'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCF0F0] to-white">
      {/* Hero Section with Wave */}
      <div className="bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE] text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Na Kontaktoni</h1>
          <p className="text-xl opacity-90">Jemi këtu për t'ju ndihmuar me çdo pyetje!</p>
        </div>
      </div>

      {/* Wavy Divider */}
      <div className="relative h-16 bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE]">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            d="M0,50 Q180,0 360,50 T720,50 T1080,50 T1440,50 L1440,100 L0,100 Z" 
            fill="white"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Dërgoni Mesazh</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Emri</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#F4C2C2] focus:ring-2 focus:ring-[#FCF0F0] transition-colors"
                    placeholder="Emri juaj..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#F4C2C2] focus:ring-2 focus:ring-[#FCF0F0] transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mesazhi</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#F4C2C2] focus:ring-2 focus:ring-[#FCF0F0] transition-colors resize-none"
                    placeholder="Shkruani mesazhin tuaj këtu..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#F4C2C2] to-[#ECAEAE] hover:from-[#ECAEAE] hover:to-[#F4C2C2] text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={20} />
                  {submitting ? 'Duke dërguar...' : 'Dërgo Mesazhin'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-[#FCF0F0] p-4 rounded-xl">
                  <Phone className="text-[#ECAEAE]" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Telefon</h3>
                  <a href="tel:+355691234567" className="text-[#ECAEAE] hover:text-[#F4C2C2] text-lg">
                    +355 69 123 4567
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-[#FCF0F0] p-4 rounded-xl">
                  <Mail className="text-[#ECAEAE]" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <a href="mailto:info@eriolababyshop.com" className="text-[#ECAEAE] hover:text-[#F4C2C2] text-lg">
                    info@eriolababyshop.com
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-[#FCF0F0] p-4 rounded-xl">
                  <MapPin className="text-[#ECAEAE]" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Adresa</h3>
                  <p className="text-gray-600 text-lg">Tiranë, Shqipëri</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-[#F4C2C2] to-[#ECAEAE] rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">Na Ndiqni në Rrjete Sociale</h3>
              <p className="mb-6 opacity-90">Gjeni ofertat më të reja dhe inspirime për fëmijët tuaj!</p>
              
              <div className="space-y-3">
                <a
                  href="https://instagram.com/eriola.babyshop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-xl transition-all group"
                >
                  <Instagram size={28} />
                  <div>
                    <p className="font-bold">Instagram</p>
                    <p className="text-sm opacity-90">@eriolababyshop</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/355691234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-xl transition-all group"
                >
                  <MessageCircle size={28} />
                  <div>
                    <p className="font-bold">WhatsApp</p>
                    <p className="text-sm opacity-90">+355 69 123 4567</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Çfarë Thonë Klientët Tanë</h2>
            <div className="w-24 h-1 bg-[#F4C2C2] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#f59e0b" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed italic">"{review.text}"</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#FCF0F0] to-[#F9D9D9] rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Keni Pyetje?</h3>
          <p className="text-lg text-gray-700 mb-6">
            Stafi ynë është gati t'ju ndihmojë çdo ditë nga ora 9:00 - 20:00
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://wa.me/355691234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle size={20} />
              Shkruani në WhatsApp
            </a>
            <a
              href="https://instagram.com/eriola.babyshop"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#F4C2C2] to-[#ECAEAE] hover:from-[#ECAEAE] hover:to-[#F4C2C2] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Instagram size={20} />
              Na Ndiqni
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}