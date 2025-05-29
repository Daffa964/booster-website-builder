
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="beranda" className="bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Website Instan untuk{' '}
              <span className="text-blue-600">UMKM</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Pilih template, sesuaikan, dan hadirkan bisnismu secara online dalam hitungan menit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg hover:scale-105 transition-all duration-200">
                Lihat Template
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-lg text-lg transition-all duration-200">
                Pesan Sekarang
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">B.I</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800">Template Preview</h3>
                  <p className="text-blue-600 mt-2">Website UMKM Profesional</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg animate-pulse">
              <span className="text-sm font-semibold">Siap Pakai!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
