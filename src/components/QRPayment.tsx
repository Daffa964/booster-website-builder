import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QRPaymentProps {
  orderData: {
    orderId: string;
    packageName: string;
    price: string;
    customerName: string;
    customerPhone: string;
    templateName: string;
  };
  onPaymentComplete?: () => void;
}

const QRPayment: React.FC<QRPaymentProps> = ({ orderData, onPaymentComplete }) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed'>('pending');
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  // Generate QRIS URL
  const qrisData = `QRIS|${orderData.packageName}|${orderData.price}|${orderData.customerName}|${orderData.customerPhone}`;
  const qrisUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrisData)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil Disalin",
      description: "Informasi pembayaran telah disalin ke clipboard.",
    });
  };

  const checkPaymentStatus = async () => {
    setIsChecking(true);
    try {
      // Check if order status has been updated to 'verified' or 'completed'
      const { data: order, error } = await supabase
        .from('Order')
        .select('status')
        .eq('id', orderData.orderId)
        .single();

      if (error) throw error;

      if (order?.status === 'verified' || order?.status === 'completed') {
        setPaymentStatus('completed');
        toast({
          title: "Pembayaran Berhasil!",
          description: "Akun LMS Anda telah diaktifkan. Silakan login untuk mengakses materi.",
        });
        
        if (onPaymentComplete) {
          onPaymentComplete();
        }
      } else {
        toast({
          title: "Pembayaran Belum Terverifikasi",
          description: "Pembayaran masih dalam proses verifikasi. Silakan coba lagi dalam beberapa menit.",
        });
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast({
        title: "Gagal Memeriksa Status",
        description: "Terjadi kesalahan saat memeriksa status pembayaran.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const redirectToLMS = () => {
    // Redirect to login page with a flag indicating they should access LMS
    window.location.href = '/auth?redirect=dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {paymentStatus === 'completed' ? (
                <>
                  <CheckCircle className="text-green-500" size={24} />
                  Pembayaran Berhasil
                </>
              ) : (
                <>
                  <Clock className="text-orange-500" size={24} />
                  Menunggu Pembayaran
                </>
              )}
            </CardTitle>
            <Badge 
              variant={paymentStatus === 'completed' ? 'default' : 'secondary'}
              className="w-fit mx-auto"
            >
              {paymentStatus === 'completed' ? 'Lunas' : 'Pending'}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-900">Detail Pesanan</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Template:</span>
                <span className="font-medium">{orderData.templateName}</span>
                <span className="text-gray-600">Paket:</span>
                <span className="font-medium">{orderData.packageName}</span>
                <span className="text-gray-600">Harga:</span>
                <span className="font-medium text-primary">{orderData.price}</span>
                <span className="text-gray-600">Nama:</span>
                <span className="font-medium">{orderData.customerName}</span>
              </div>
            </div>

            {paymentStatus === 'pending' ? (
              <>
                {/* QR Code */}
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-gray-900">Scan QR Code untuk Pembayaran</h3>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                    <img 
                      src={qrisUrl} 
                      alt="QR Code Pembayaran" 
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan dengan aplikasi mobile banking atau e-wallet Anda
                  </p>
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Cara Pembayaran:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Buka aplikasi mobile banking atau e-wallet</li>
                    <li>Pilih menu "Scan QR" atau "QRIS"</li>
                    <li>Scan QR code di atas</li>
                    <li>Konfirmasi pembayaran sebesar {orderData.price}</li>
                    <li>Simpan bukti pembayaran</li>
                  </ol>
                </div>

                {/* Payment Details for Manual Transfer */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Informasi Pembayaran:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Jumlah:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{orderData.price}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(orderData.price)}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Atas Nama:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{orderData.customerName}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(orderData.customerName)}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(qrisUrl, '_blank')}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Buka QR di Tab Baru
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={checkPaymentStatus}
                    disabled={isChecking}
                  >
                    {isChecking ? 'Memeriksa...' : 'Cek Status Pembayaran'}
                  </Button>
                </div>
              </>
            ) : (
              /* Payment Complete */
              <div className="text-center space-y-4">
                <div className="bg-green-50 p-6 rounded-lg">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Pembayaran Berhasil Diverifikasi!
                  </h3>
                  <p className="text-green-700">
                    Akun LMS Anda telah diaktifkan. Silakan login untuk mengakses materi pembelajaran dan template.
                  </p>
                </div>

                <Button 
                  className="w-full" 
                  onClick={redirectToLMS}
                  size="lg"
                >
                  Masuk ke LMS
                </Button>
              </div>
            )}

            {/* Support Info */}
            <div className="text-center text-sm text-gray-600 border-t pt-4">
              <p>Kesulitan dengan pembayaran?</p>
              <p>Hubungi support di WhatsApp: <span className="font-medium">+62 812-3456-7890</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRPayment;