
import React from 'react';
import { Card } from '@/components/ui/card';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Pilih Template',
      description: 'Pilih template yang sesuai dengan kategori bisnis UMKM Anda dari koleksi template yang tersedia.',
      icon: '🎨'
    },
    {
      number: '2',
      title: 'Sesuaikan Konten',
      description: 'Ubah teks, gambar, dan warna sesuai dengan identitas bisnis Anda dengan mudah.',
      icon: '✏️'
    },
    {
      number: '3',
      title: 'Pesan dan Publish',
      description: 'Lakukan pemesanan paket yang sesuai dan website Anda langsung online dalam hitungan menit.',
      icon: '🚀'
    }
  ];

  return (
    <section id="cara-kerja" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cara Kerja
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hanya 3 langkah mudah untuk menghadirkan website profesional untuk bisnis UMKM Anda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                <div className="text-6xl mb-4">{step.icon}</div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </Card>
              
              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-blue-300"></div>
                  <div className="w-0 h-0 border-l-4 border-l-blue-300 border-t-2 border-t-transparent border-b-2 border-b-transparent absolute right-0 top-1/2 transform -translate-y-1/2"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
