
import React from 'react';
import { Card } from '@/components/ui/card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sari Handayani',
      business: 'Laundry Bersih Sejahtera',
      location: 'Jakarta',
      message: 'Berkat B.I Booster, laundry saya jadi punya website profesional dan pelanggan bisa pesan online. Omzet naik 40% dalam 2 bulan!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Ahmad Fauzi',
      business: 'Kerajinan Bambu Nusantara',
      location: 'Yogyakarta',
      message: 'Template kerajinan tangan sangat sesuai dengan produk saya. Sekarang bisa menjangkau pasar yang lebih luas. Terima kasih B.I Booster!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Testimoni UMKM
          </h2>
          <p className="text-xl text-gray-600">
            Dengarkan cerita sukses UMKM yang telah menggunakan B.I Booster
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-blue-600 font-medium">{testimonial.business}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic leading-relaxed">
                "{testimonial.message}"
              </blockquote>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">★</span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-white rounded-lg p-6 shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">UMKM Terdaftar</div>
            </div>
            <div className="h-12 w-px bg-gray-300 mx-8"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
