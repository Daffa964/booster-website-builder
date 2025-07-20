import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, Star, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const packages = [
  {
    id: 'small',
    name: 'Paket Small',
    price: 'Rp 500.000',
    description: 'Solusi esensial untuk membangun fondasi digital bisnis Anda.',
    features: [
      'Website Profesional Siap Pakai',
      'Akses Penuh Platform Edukasi (LMS)',
      'Grup Komunitas WhatsApp & Discord',
    ],
  },
  {
    id: 'medium',
    name: 'Paket Medium',
    price: 'Rp 1.000.000',
    description: 'Pilihan ideal untuk UMKM yang ingin mulai meningkatkan visibilitas online.',
    features: [
      'Semua fitur di Paket Small',
      'Optimasi SEO Standar',
      'Integrasi Media Sosial & WhatsApp',
    ],
    isPopular: true,
  },
  {
    id: 'large',
    name: 'Paket Large',
    price: 'Rp 2.000.000',
    description: 'Untuk bisnis yang siap bertumbuh dan mendapatkan bimbingan ahli.',
    features: [
      'Semua fitur di Paket Medium',
      'Optimasi SEO Lanjutan (Bagus)',
      'Terhubung dengan Mentor untuk Pembelajaran',
    ],
  },
  {
    id: 'enterprise',
    name: 'Paket Bisnis (Enterprise)',
    price: 'Mulai dari Rp 5.000.000',
    description: 'Solusi lengkap untuk membawa tim Anda ke level selanjutnya dengan bimbingan penuh.',
    features: [
      'Semua fitur di Paket Large',
      'Optimasi SEO Terbaik & Laporan Performa',
      'Mentoring Langsung untuk Tim (hingga 10 orang)',
      'Sertifikasi Keahlian Setelah Selesai',
    ],
  },
];

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
}

const PackageModal: React.FC<PackageModalProps> = ({ isOpen, onClose, templateName }) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [step, setStep] = useState<'packages' | 'form'>('packages');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setStep('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    setIsSubmitting(true);
    try {
      const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
      
      // Create user record
      const { data: userData, error: userError } = await supabase
        .from('User')
        .insert({
          id: crypto.randomUUID(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: 'pending',
          accessTier: selectedPackage,
          password: 'temp_password' // Will be set properly after verification
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create order record
      const { error: orderError } = await supabase
        .from('Order')
        .insert({
          id: crypto.randomUUID(),
          userId: userData.id,
          packageName: selectedPkg?.name || '',
          package_id: selectedPackage,
          template_name: templateName,
          price: selectedPkg?.price || '',
          status: 'pending'
        });

      if (orderError) throw orderError;

      toast({
        title: "Pesanan Berhasil Dibuat!",
        description: "Kami akan menghubungi Anda untuk verifikasi pembayaran dalam 1x24 jam.",
      });

      onClose();
      setStep('packages');
      setSelectedPackage(null);
      setFormData({ name: '', email: '', phone: '', notes: '' });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal membuat pesanan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {step === 'packages' ? 'Pilih Paket untuk Template' : `Konfirmasi Pesanan - ${selectedPkg?.name}`}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {step === 'packages' ? (
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  pkg.isPopular ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-gray-300'
                }`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                {pkg.isPopular && (
                  <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground">
                    <Star size={12} className="mr-1" />
                    Paling Populer
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {pkg.name}
                    <span className="text-lg font-bold text-primary">{pkg.price}</span>
                  </CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4">
                    Pilih Paket Ini
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6 p-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Detail Pesanan</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Template:</span>
                  <p className="font-medium">{templateName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Paket:</span>
                  <p className="font-medium">{selectedPkg?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Harga:</span>
                  <p className="font-medium text-primary">{selectedPkg?.price}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Nomor WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08123456789"
              />
            </div>

            <div>
              <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Sampaikan kebutuhan khusus atau pertanyaan..."
                rows={3}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Proses Selanjutnya:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tim kami akan menghubungi Anda dalam 1x24 jam</li>
                <li>• Verifikasi data dan konfirmasi pembayaran</li>
                <li>• Setelah pembayaran, akun LMS akan diaktifkan</li>
                <li>• Mulai akses materi pembelajaran dan template</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('packages')}
                className="flex-1"
              >
                Kembali
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Pesan Sekarang'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PackageModal;