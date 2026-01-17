import React from 'react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-gradient-to-r from-[#F4C2C2] via-[#F0B8B8] to-[#ECAEAE] text-white py-12 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">ERIOLA BABYSHOP</h3>
            <p className="text-white text-opacity-90 text-sm">
              Dyqani juaj i preferuar për veshje dhe aksesorë cilësorë për fëmijë.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Lidhje të Shpejta</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setCurrentPage('home')} 
                  className="text-white text-opacity-90 hover:text-opacity-100 text-sm transition-colors"
                >
                  Faqja Kryesore
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('summer')} 
                  className="text-white text-opacity-90 hover:text-opacity-100 text-sm transition-colors"
                >
                  Koleksioni Veror
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('winter')} 
                  className="text-white text-opacity-90 hover:text-opacity-100 text-sm transition-colors"
                >
                  Koleksioni Dimëror
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('autumn-spring')} 
                  className="text-white text-opacity-90 hover:text-opacity-100 text-sm transition-colors"
                >
                  Vjeshtë & Pranverë
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Shërbimi Ndaj Klientit</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setCurrentPage('kontakt')} 
                  className="text-white text-opacity-90 hover:text-opacity-100 text-sm transition-colors"
                >
                  Na Kontaktoni
                </button>
              </li>
              <li>
                <a href="#" className="text-white text-opacity-90 hover:text-opacity-100 text-sm transition-colors">
                  Politika e Kthimit
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-opacity-90 hover:text-opacity-100 text-sm transition-colors">
                  Termat & Kushtet
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-opacity-90 hover:text-opacity-100 text-sm transition-colors">
                  Pyetje të Shpeshta
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontakti</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-white text-opacity-90">📍 Tiranë, Shqipëri</li>
              <li>
                <a 
                  href="tel:+355691234567" 
                  className="text-white text-opacity-90 hover:text-opacity-100 transition-colors"
                >
                  📞 +355 69 123 4567
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@eriolababyshop.com" 
                  className="text-white text-opacity-90 hover:text-opacity-100 transition-colors"
                >
                  ✉️ info@eriolababyshop.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white border-opacity-20 pt-6 text-center">
          <p className="text-white text-opacity-90 text-sm">
            © 2024 Eriola BabyShop. Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </div>
    </footer>
  );
}