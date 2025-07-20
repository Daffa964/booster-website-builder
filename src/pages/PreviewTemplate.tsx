
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PackageModal from '@/components/PackageModal';

const PreviewTemplate = () => {
  const { templateId } = useParams();
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  
  // Mapping template ID ke URL prototipe
  const getPrototypeUrl = (id: string) => {
    const templateNumber = id.replace('template-', '');
    return `https://prototipe-p2mw.barikliahmada.my.id/prototipe${templateNumber}`;
  };

  const getTemplateName = (id: string) => {
    const templateNumber = id.replace('template-', '');
    return `Template ${templateNumber}`;
  };

  const prototypeUrl = getPrototypeUrl(templateId || '1');
  const templateName = getTemplateName(templateId || '1');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Kembali ke Beranda</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Preview {templateName}
              </h1>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => window.open(prototypeUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Buka di Tab Baru
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setIsPackageModalOpen(true)}
              >
                Pesan Template Ini
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-100 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 font-mono">{prototypeUrl}</span>
              </div>
              <span className="text-sm text-gray-500">Preview Mode</span>
            </div>
          </div>
          
          {/* iframe container */}
          <div className="relative" style={{ height: 'calc(100vh - 200px)' }}>
            <iframe
              src={prototypeUrl}
              className="w-full h-full border-0"
              title={`Preview ${templateName}`}
              loading="lazy"
            />
          </div>
        </div>

        {/* Template Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang {templateName}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fitur Template</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Desain responsif untuk semua perangkat</li>
                <li>✓ Optimasi SEO untuk pencarian Google</li>
                <li>✓ Loading cepat dan performa optimal</li>
                <li>✓ Mudah dikustomisasi sesuai brand</li>
                <li>✓ Dukungan teknis penuh</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cocok Untuk</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• UMKM dan bisnis kecil</li>
                <li>• Toko online dan e-commerce</li>
                <li>• Layanan jasa profesional</li>
                <li>• Portfolio dan showcase</li>
                <li>• Landing page promosi</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                onClick={() => window.open(prototypeUrl, '_blank')}
              >
                <ExternalLink size={16} className="mr-2" />
                Lihat Full Screen
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
                onClick={() => setIsPackageModalOpen(true)}
              >
                Pesan Template Ini Sekarang
              </Button>
            </div>
          </div>
        </div>
      </main>

      <PackageModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        templateName={templateName}
      />
    </div>
  );
};

export default PreviewTemplate;
