import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Users, 
  Award, 
  Play, 
  Download, 
  Clock,
  CheckCircle,
  Lock,
  LogOut,
  User,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserSession {
  id: string;
  name: string;
  email: string;
  package_access: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState('learning');

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      setUser(JSON.parse(session));
    } else {
      window.location.href = '/auth';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    window.location.href = '/';
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const learningModules = [
    {
      id: 1,
      title: 'Pengenalan Digital Marketing',
      description: 'Dasar-dasar pemasaran digital untuk UMKM',
      duration: '2 jam',
      progress: 100,
      status: 'completed',
      lessons: [
        { title: 'Apa itu Digital Marketing', completed: true },
        { title: 'Pentingnya Online Presence', completed: true },
        { title: 'Platform Digital Marketing', completed: true }
      ]
    },
    {
      id: 2,
      title: 'Membuat Website yang Efektif',
      description: 'Panduan lengkap membangun website bisnis',
      duration: '3 jam',
      progress: 60,
      status: 'in-progress',
      lessons: [
        { title: 'Perencanaan Website', completed: true },
        { title: 'Desain yang User-Friendly', completed: true },
        { title: 'Optimasi untuk Mobile', completed: false },
        { title: 'Testing dan Launch', completed: false }
      ]
    },
    {
      id: 3,
      title: 'SEO untuk Pemula',
      description: 'Teknik dasar untuk meningkatkan ranking Google',
      duration: '2.5 jam',
      progress: 0,
      status: user.package_access === 'small' ? 'locked' : 'available',
      lessons: [
        { title: 'Keyword Research', completed: false },
        { title: 'On-Page SEO', completed: false },
        { title: 'Content Strategy', completed: false }
      ]
    },
    {
      id: 4,
      title: 'Social Media Marketing',
      description: 'Strategi pemasaran di media sosial',
      duration: '2 jam',
      progress: 0,
      status: user.package_access === 'small' ? 'locked' : 'available',
      lessons: [
        { title: 'Platform Selection', completed: false },
        { title: 'Content Calendar', completed: false },
        { title: 'Engagement Strategy', completed: false }
      ]
    },
    {
      id: 5,
      title: 'Advanced Analytics',
      description: 'Menganalisis performa digital marketing',
      duration: '3 jam',
      progress: 0,
      status: ['large', 'enterprise'].includes(user.package_access) ? 'available' : 'locked',
      lessons: [
        { title: 'Google Analytics Setup', completed: false },
        { title: 'Data Interpretation', completed: false },
        { title: 'ROI Calculation', completed: false }
      ]
    }
  ];

  const getPackageBadgeColor = (pkg: string) => {
    switch (pkg) {
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      case 'large': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageName = (pkg: string) => {
    switch (pkg) {
      case 'small': return 'Paket Small';
      case 'medium': return 'Paket Medium';
      case 'large': return 'Paket Large';
      case 'enterprise': return 'Paket Enterprise';
      default: return 'Paket Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">B.I Booster Dashboard</h1>
              <Badge className={getPackageBadgeColor(user.package_access)}>
                {getPackageName(user.package_access)}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User size={16} />
                <span>{user.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="hidden sm:inline">Pembelajaran</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Package size={16} />
              <span className="hidden sm:inline">Template</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Komunitas</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award size={16} />
              <span className="hidden sm:inline">Sertifikat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Progress Belajar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">60%</div>
                  <Progress value={60} className="mb-2" />
                  <p className="text-sm text-gray-600">2 dari 5 modul selesai</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Waktu Belajar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">5.5h</div>
                  <p className="text-sm text-gray-600">Total waktu minggu ini</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Sertifikat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">1</div>
                  <p className="text-sm text-gray-600">Sertifikat diperoleh</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {learningModules.map((module) => (
                <Card key={module.id} className={module.status === 'locked' ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {module.status === 'completed' && <CheckCircle className="text-green-500" size={20} />}
                          {module.status === 'in-progress' && <Play className="text-blue-500" size={20} />}
                          {module.status === 'locked' && <Lock className="text-gray-400" size={20} />}
                          {module.status === 'available' && <BookOpen className="text-gray-600" size={20} />}
                          {module.title}
                        </CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                      <Badge variant={
                        module.status === 'completed' ? 'default' : 
                        module.status === 'in-progress' ? 'secondary' :
                        module.status === 'locked' ? 'outline' : 'outline'
                      }>
                        {module.status === 'completed' ? 'Selesai' :
                         module.status === 'in-progress' ? 'Berlangsung' :
                         module.status === 'locked' ? 'Terkunci' : 'Tersedia'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{module.duration}</span>
                      </div>
                      
                      {module.progress > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} />
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Lessons:</h4>
                        {module.lessons.map((lesson, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {lesson.completed ? 
                              <CheckCircle size={16} className="text-green-500" /> :
                              <div className="w-4 h-4 border border-gray-300 rounded-full" />
                            }
                            <span className={lesson.completed ? 'text-gray-900' : 'text-gray-600'}>
                              {lesson.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full mt-4" 
                        variant={module.status === 'locked' ? 'outline' : 'default'}
                        disabled={module.status === 'locked'}
                      >
                        {module.status === 'locked' ? 'Upgrade untuk Membuka' :
                         module.status === 'completed' ? 'Review Materi' :
                         module.status === 'in-progress' ? 'Lanjutkan Belajar' :
                         'Mulai Belajar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Website Anda</CardTitle>
                <CardDescription>Akses dan kelola template yang telah Anda pesan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Template Akan Segera Tersedia</h3>
                  <p className="text-gray-600 mb-4">
                    Tim kami sedang menyiapkan template website sesuai pesanan Anda.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/templates">Lihat Template Lainnya</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="text-green-500" size={20} />
                    WhatsApp Group
                  </CardTitle>
                  <CardDescription>Bergabung dengan komunitas di WhatsApp</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Dapatkan tips harian, sharing session, dan dukungan dari sesama member.
                  </p>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    Gabung WhatsApp Group
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="text-indigo-500" size={20} />
                    Discord Community
                  </CardTitle>
                  <CardDescription>Komunitas Discord untuk diskusi mendalam</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Forum diskusi, Q&A session, dan networking dengan member lainnya.
                  </p>
                  <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                    Gabung Discord
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sertifikat Keahlian</CardTitle>
                <CardDescription>Sertifikat yang telah Anda peroleh dari menyelesaikan pembelajaran</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="text-yellow-500" size={24} />
                      <div>
                        <h3 className="font-medium">Digital Marketing Fundamentals</h3>
                        <p className="text-sm text-gray-600">Diselesaikan pada 15 Jan 2024</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 border-dashed">
                    <div className="text-center py-4">
                      <Award size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Sertifikat lainnya akan muncul setelah Anda menyelesaikan modul pembelajaran</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;