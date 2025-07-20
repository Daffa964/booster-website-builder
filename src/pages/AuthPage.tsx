import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user exists in our User table
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('*')
        .eq('email', loginData.email)
        .single();

      if (userError || !userData) {
        toast({
          title: "Email tidak ditemukan",
          description: "Silakan daftar terlebih dahulu atau hubungi admin untuk verifikasi akun.",
          variant: "destructive",
        });
        return;
      }

      if (!userData.is_verified) {
        toast({
          title: "Akun belum terverifikasi",
          description: "Akun Anda masih dalam proses verifikasi. Tim kami akan menghubungi Anda segera.",
          variant: "destructive",
        });
        return;
      }

      if (!userData.has_paid) {
        toast({
          title: "Pembayaran belum dikonfirmasi",
          description: "Silakan selesaikan pembayaran untuk mengakses dashboard LMS.",
          variant: "destructive",
        });
        return;
      }

      // For now, we'll use a simple password check
      if (userData.password === loginData.password) {
        // Store user session in localStorage
        localStorage.setItem('user_session', JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          package_access: userData.package_access || userData.accessTier
        }));
        
        window.location.href = '/dashboard';
      } else {
        toast({
          title: "Password salah",
          description: "Silakan periksa kembali password Anda.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal melakukan login. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Pastikan password dan konfirmasi password sama.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('User')
        .select('email')
        .eq('email', registerData.email)
        .single();

      if (existingUser) {
        toast({
          title: "Email sudah terdaftar",
          description: "Silakan gunakan email lain atau login jika sudah memiliki akun.",
          variant: "destructive",
        });
        return;
      }

      // Create new user
      const { error } = await supabase
        .from('User')
        .insert({
          id: crypto.randomUUID(),
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password,
          status: 'pending',
          accessTier: 'none',
          is_verified: false,
          has_paid: false
        });

      if (error) throw error;

      toast({
        title: "Registrasi berhasil!",
        description: "Akun Anda telah dibuat. Silakan pesan template untuk mengaktifkan akses LMS.",
      });

      // Reset form
      setRegisterData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal membuat akun. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              B.I Booster
            </CardTitle>
            <CardDescription>
              Masuk atau daftar untuk mengakses platform pembelajaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Masuk</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="nama@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Masukkan password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Nama Lengkap</Label>
                    <Input
                      id="register-name"
                      type="text"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="nama@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-phone">No. WhatsApp</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      required
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      placeholder="08123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Buat password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="Ulangi password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Daftar'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Belum memiliki akses LMS?</p>
              <Link to="/templates" className="text-blue-600 hover:text-blue-700 font-medium">
                Pesan template sekarang →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;