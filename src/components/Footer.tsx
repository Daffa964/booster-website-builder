
import React from 'react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer id="kontak" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-3xl font-bold text-blue-400 mb-4">
              B.I <span className="text-white">Booster</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Platform template website siap pakai untuk UMKM. Hadirkan bisnis Anda secara online dengan mudah dan profesional.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                Facebook
              </Button>
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                Instagram
              </Button>
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#beranda" className="text-gray-300 hover:text-blue-400 transition-colors">Beranda</a></li>
              <li><a href="#tentang" className="text-gray-300 hover:text-blue-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#kategori" className="text-gray-300 hover:text-blue-400 transition-colors">Kategori Template</a></li>
              <li><a href="#cara-kerja" className="text-gray-300 hover:text-blue-400 transition-colors">Cara Kerja</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
            <div className="space-y-2 text-gray-300">
              <p>📧 info@bibooster.com</p>
              <p>📱 +62 812-3456-7890</p>
              <p>📍 Jakarta, Indonesia</p>
              <p>🕒 Senin - Jumat, 09:00 - 17:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>© 2024 B.I Booster. All rights reserved.</p>
              <p className="mt-1">Didukung oleh <span className="text-blue-400 font-semibold">P2MW 2024</span></p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
