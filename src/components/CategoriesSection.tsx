
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CategoriesSection = () => {
  const categories = [
    {
      name: 'Laundry',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
      description: 'Template khusus untuk bisnis laundry dan dry cleaning'
    },
    {
      name: 'Makanan',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      description: 'Showcase menu dan layanan kuliner Anda'
    },
    {
      name: 'Kerajinan Tangan',
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop',
      description: 'Tampilkan karya seni dan kerajinan unik Anda'
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      description: 'Etalase produk fashion dan aksesori terbaik'
    },
    {
      name: 'Kecantikan',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      description: 'Template untuk salon dan layanan kecantikan'
    },
    {
      name: 'Teknologi',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      description: 'Solusi digital untuk bisnis teknologi'
    }
  ];

  return (
    <section id="kategori" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kategori Template
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih template yang sesuai dengan jenis bisnis UMKM Anda. Semua template dirancang khusus untuk kebutuhan bisnis lokal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={category.name} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full">
                  <span className="text-blue-600 font-semibold text-sm">{category.name}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200">
                    Preview
                  </Button>
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200">
                    Pesan
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
