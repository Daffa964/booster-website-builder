import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  packageName: string;
  price: string;
  status: string;
  createdAt: string;
  template_name: string;
  User: {
    id: string;
    name: string;
    email: string;
    phone: string;
    is_verified: boolean;
    has_paid: boolean;
  };
}

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-verify', {
        body: { action: 'get_pending_orders' }
      });

      if (error) throw error;
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pesanan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (userId: string, orderId: string) => {
    setVerifying(orderId);
    try {
      const { data, error } = await supabase.functions.invoke('admin-verify', {
        body: { 
          action: 'verify_payment',
          userId,
          orderId
        }
      });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil diverifikasi"
      });

      // Refresh the orders list
      fetchPendingOrders();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Error",
        description: "Gagal memverifikasi pembayaran",
        variant: "destructive"
      });
    } finally {
      setVerifying(null);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">
              Admin - Verifikasi Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada pesanan yang menunggu verifikasi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Nama Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>No. HP</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Paket</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="text-sm">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.User.name}
                        </TableCell>
                        <TableCell>{order.User.email}</TableCell>
                        <TableCell>{order.User.phone}</TableCell>
                        <TableCell>{order.template_name}</TableCell>
                        <TableCell>{order.packageName}</TableCell>
                        <TableCell className="font-semibold text-primary">
                          {order.price}
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                            {order.status === 'pending' ? 'Menunggu' : order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.User.is_verified && order.User.has_paid ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Terverifikasi
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => verifyPayment(order.User.id, order.id)}
                              disabled={verifying === order.id}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {verifying === order.id ? 'Memverifikasi...' : 'Verifikasi'}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;