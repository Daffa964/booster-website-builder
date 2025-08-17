
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Filter } from 'lucide-react';

// Import template thumbnails
import templateLaundry from '@/assets/template-laundry.jpg';
import templateFood from '@/assets/template-food.jpg';
import templateCraft from '@/assets/template-craft.jpg';
import templateFashion from '@/assets/template-fashion.jpg';
import templateBeauty from '@/assets/template-beauty.jpg';
import templateTech from '@/assets/template-tech.jpg';
import templateService from '@/assets/template-service.jpg';
import templateRetail from '@/assets/template-retail.jpg';

const Templates = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const templatesPerPage = 12;

  // Template thumbnails mapping
  const getTemplateImage = (category: string) => {
    switch (category) {
      case 'Laundry': return templateLaundry;
      case 'Makanan': return templateFood;
      case 'Kerajinan': return templateCraft;
      case 'Fashion': return templateFashion;
      case 'Kecantikan': return templateBeauty;
      case 'Teknologi': return templateTech;
      case 'Jasa': return templateService;
      case 'Retail': return templateRetail;
      default: return templateTech;
    }
  };

  // Mock data untuk 80+ templates
  const allTemplates = Array.from({ length: 84 }, (_, i) => ({
    id: `template-${i + 1}`,
    name: `Template ${i + 1}`,
    category: ['Laundry', 'Makanan', 'Kerajinan', 'Fashion', 'Kecantikan', 'Teknologi', 'Jasa', 'Retail'][i % 8],
    description: `Template profesional untuk bisnis ${['laundry', 'kuliner', 'kerajinan', 'fashion', 'kecantikan', 'teknologi', 'jasa', 'retail'][i % 8]}`,
    image: getTemplateImage(['Laundry', 'Makanan', 'Kerajinan', 'Fashion', 'Kecantikan', 'Teknologi', 'Jasa', 'Retail'][i % 8]),
    prototypeUrl: `https://prototipe-p2mw.barikliahmada.my.id/prototipe${i + 1}`,
    featured: i < 6
  }));

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'Laundry', label: 'Laundry' },
    { value: 'Makanan', label: 'Makanan' },
    { value: 'Kerajinan', label: 'Kerajinan Tangan' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Kecantikan', label: 'Kecantikan' },
    { value: 'Teknologi', label: 'Teknologi' },
    { value: 'Jasa', label: 'Jasa' },
    { value: 'Retail', label: 'Retail' }
  ];

  // Filter templates berdasarkan kategori
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'all') {
      return allTemplates;
    }
    return allTemplates.filter(template => template.category === selectedCategory);
  }, [selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const startIndex = (currentPage - 1) * templatesPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, startIndex + templatesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Kembali ke Beranda
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Template Website</h1>
              <p className="text-gray-600 mt-1">
                Pilih dari {filteredTemplates.length} template yang tersedia
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter berdasarkan:</span>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="text-sm">
              {categories.find(c => c.value === selectedCategory)?.label}
            </Badge>
          )}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="relative">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full">
                  <span className="text-blue-600 font-semibold text-xs">{template.category}</span>
                </div>
                {template.featured && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full">
                    <span className="text-xs font-semibold">Unggulan</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                <div className="flex gap-2">
                  <Link to={`/preview/${template.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 text-sm">
                      Preview
                    </Button>
                  </Link>
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 text-sm">
                    Pesan
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
