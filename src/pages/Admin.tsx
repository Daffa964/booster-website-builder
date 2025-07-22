import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Upload, FileText, Link } from 'lucide-react';

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
  const [verifiedOrders, setVerifiedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [templateFiles, setTemplateFiles] = useState<{[key: string]: File | null}>({});
  const [templateUrls, setTemplateUrls] = useState<{[key: string]: string}>({});
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

  const fetchVerifiedOrders = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-verify', {
        body: { action: 'get_verified_orders' }
      });

      if (error) throw error;
      setVerifiedOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching verified orders:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pesanan terverifikasi",
        variant: "destructive"
      });
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

  const uploadTemplate = async (orderId: string, userId: string) => {
    const file = templateFiles[orderId];
    const url = templateUrls[orderId];
    
    if (!file && !url) {
      toast({
        title: "Error",
        description: "Pilih file atau masukkan URL template",
        variant: "destructive"
      });
      return;
    }

    setUploading(orderId);
    try {
      let templatePath = url;
      
      if (file) {
        // Upload file to storage
        const fileName = `templates/${userId}/${orderId}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('lms-content')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('lms-content')
          .getPublicUrl(fileName);
        
        templatePath = publicUrl;
      }

      // Update order with template path
      const { error } = await supabase
        .from('Order')
        .update({ 
          status: 'completed',
          template_path: templatePath
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Template berhasil diupload dan pesanan diselesaikan"
      });

      // Clear form
      setTemplateFiles(prev => ({ ...prev, [orderId]: null }));
      setTemplateUrls(prev => ({ ...prev, [orderId]: '' }));
      
      // Refresh orders
      fetchVerifiedOrders();
    } catch (error) {
      console.error('Error uploading template:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload template",
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
    fetchVerifiedOrders();
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
              Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="verification" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="verification">Verifikasi Pembayaran</TabsTrigger>
                <TabsTrigger value="templates">Kelola Template</TabsTrigger>
              </TabsList>

              <TabsContent value="verification">
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
              </TabsContent>

              <TabsContent value="templates">
                {verifiedOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada pesanan terverifikasi yang perlu template
                  </div>
                ) : (
                  <div className="space-y-6">
                    {verifiedOrders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{order.User.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {order.User.email} • {order.User.phone}
                              </p>
                              <p className="text-sm font-medium mt-1">
                                Template: {order.template_name} • Paket: {order.packageName}
                              </p>
                            </div>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                              {order.status === 'completed' ? 'Selesai' : 'Perlu Template'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`file-${order.id}`}>Upload File Template</Label>
                              <Input
                                id={`file-${order.id}`}
                                type="file"
                                accept=".zip,.rar,.pdf,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  setTemplateFiles(prev => ({ ...prev, [order.id]: file }));
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`url-${order.id}`}>Atau Masukkan URL Template</Label>
                              <Input
                                id={`url-${order.id}`}
                                type="url"
                                placeholder="https://drive.google.com/..."
                                value={templateUrls[order.id] || ''}
                                onChange={(e) => {
                                  setTemplateUrls(prev => ({ ...prev, [order.id]: e.target.value }));
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => uploadTemplate(order.id, order.User.id)}
                              disabled={uploading === order.id || order.status === 'completed'}
                              className="flex items-center gap-2"
                            >
                              {uploading === order.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  Mengupload...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  {order.status === 'completed' ? 'Template Sudah Dikirim' : 'Kirim Template'}
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;