import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  Package,
  Video,
  FileText,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserSession {
  id: string;
  name: string;
  email: string;
  package_access: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'basic' | 'medium' | 'large';
  video_url?: string;
  content?: string;
  materials_url?: string;
  duration_minutes?: number;
  is_published: boolean;
  required_package: string[];
}

interface UserProgress {
  lesson_id: string;
  completed: boolean;
  watch_time_minutes: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState('learning');
  const [modules, setModules] = useState<Module[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      setUser(JSON.parse(session));
      fetchLMSData();
    } else {
      window.location.href = '/auth';
    }
  }, []);

  const fetchLMSData = async () => {
    try {
      // Fetch modules with chapters and lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          chapters (
            *,
            lessons (*)
          )
        `)
        .eq('is_published', true)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', JSON.parse(localStorage.getItem('user_session') || '{}').id);

      if (progressError) throw progressError;

      setModules(modulesData || []);
      setUserProgress(progressData || []);
    } catch (error) {
      console.error('Error fetching LMS data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pembelajaran",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    window.location.href = '/';
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Helper functions for displaying LMS data
  const getLessonProgress = (lessonId: string) => {
    return userProgress.find(p => p.lesson_id === lessonId);
  };

  const calculateChapterProgress = (chapter: Chapter) => {
    const totalLessons = chapter.lessons.length;
    if (totalLessons === 0) return 0;
    
    const completedLessons = chapter.lessons.filter(lesson => 
      getLessonProgress(lesson.id)?.completed
    ).length;
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getChapterStatus = (chapter: Chapter) => {
    const progress = calculateChapterProgress(chapter);
    
    // Check if user has access based on package
    const hasAccess = chapter.lessons.some(lesson => 
      lesson.required_package.includes(user.package_access)
    );
    
    if (!hasAccess) return 'locked';
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'available';
  };

  const getTotalDuration = (chapter: Chapter) => {
    const totalMinutes = chapter.lessons.reduce((sum, lesson) => 
      sum + (lesson.duration_minutes || 0), 0
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

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
              {user.email === 'admin@bibooster.com' && (
                <Button variant="outline" asChild>
                  <Link to="/admin/cms">
                    <Settings size={16} className="mr-2" />
                    CMS Admin
                  </Link>
                </Button>
              )}
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

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {modules.flatMap(module => 
                  module.chapters.map(chapter => {
                    const progress = calculateChapterProgress(chapter);
                    const status = getChapterStatus(chapter);
                    const duration = getTotalDuration(chapter);

                    return (
                      <Card key={chapter.id} className={status === 'locked' ? 'opacity-60' : ''}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {status === 'completed' && <CheckCircle className="text-green-500" size={20} />}
                                {status === 'in-progress' && <Play className="text-blue-500" size={20} />}
                                {status === 'locked' && <Lock className="text-gray-400" size={20} />}
                                {status === 'available' && <BookOpen className="text-gray-600" size={20} />}
                                {chapter.title}
                              </CardTitle>
                              <CardDescription>{chapter.description}</CardDescription>
                            </div>
                            <Badge variant={
                              status === 'completed' ? 'default' : 
                              status === 'in-progress' ? 'secondary' :
                              status === 'locked' ? 'outline' : 'outline'
                            }>
                              {status === 'completed' ? 'Selesai' :
                               status === 'in-progress' ? 'Berlangsung' :
                               status === 'locked' ? 'Terkunci' : 'Tersedia'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={16} />
                              <span>{duration}</span>
                            </div>
                            
                            {progress > 0 && (
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} />
                              </div>
                            )}

                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Materi:</h4>
                              {chapter.lessons.slice(0, 3).map((lesson) => {
                                const lessonProgress = getLessonProgress(lesson.id);
                                return (
                                  <div key={lesson.id} className="flex items-center gap-2 text-sm">
                                    {lessonProgress?.completed ? 
                                      <CheckCircle size={16} className="text-green-500" /> :
                                      <div className="w-4 h-4 border border-gray-300 rounded-full" />
                                    }
                                    <span className={lessonProgress?.completed ? 'text-gray-900' : 'text-gray-600'}>
                                      {lesson.title}
                                    </span>
                                    <div className="flex gap-1">
                                      {lesson.video_url && <Video size={12} className="text-blue-500" />}
                                      {lesson.materials_url && <FileText size={12} className="text-green-500" />}
                                    </div>
                                  </div>
                                );
                              })}
                              {chapter.lessons.length > 3 && (
                                <p className="text-xs text-muted-foreground">
                                  +{chapter.lessons.length - 3} materi lainnya
                                </p>
                              )}
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  className="w-full mt-4" 
                                  variant={status === 'locked' ? 'outline' : 'default'}
                                  disabled={status === 'locked'}
                                >
                                  {status === 'locked' ? 'Upgrade untuk Membuka' :
                                   status === 'completed' ? 'Review Materi' :
                                   status === 'in-progress' ? 'Lanjutkan Belajar' :
                                   'Mulai Belajar'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>{chapter.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {chapter.lessons.map((lesson) => {
                                    const lessonProgress = getLessonProgress(lesson.id);
                                    const hasAccess = lesson.required_package.includes(user.package_access);
                                    
                                    return (
                                      <Card key={lesson.id} className={!hasAccess ? 'opacity-60' : ''}>
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg flex items-center gap-2">
                                            {lessonProgress?.completed ? 
                                              <CheckCircle className="text-green-500" size={20} /> :
                                              <div className="w-5 h-5 border border-gray-300 rounded-full" />
                                            }
                                            {lesson.title}
                                            <Badge className={
                                              lesson.difficulty === 'basic' ? 'bg-green-500' :
                                              lesson.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                            }>
                                              {lesson.difficulty}
                                            </Badge>
                                            {!hasAccess && <Lock size={16} className="text-gray-400" />}
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
                                          
                                          {hasAccess && lesson.content && (
                                            <div className="mb-4">
                                              <h4 className="font-medium mb-2">Konten:</h4>
                                              <div className="bg-muted p-4 rounded-lg">
                                                <p className="text-sm whitespace-pre-wrap">{lesson.content}</p>
                                              </div>
                                            </div>
                                          )}
                                          
                                          <div className="flex gap-2">
                                            {hasAccess && lesson.video_url && (
                                              <Button size="sm" variant="outline" asChild>
                                                <a href={lesson.video_url} target="_blank" rel="noopener noreferrer">
                                                  <Video size={16} className="mr-2" />
                                                  Tonton Video
                                                </a>
                                              </Button>
                                            )}
                                            {hasAccess && lesson.materials_url && (
                                              <Button size="sm" variant="outline" asChild>
                                                <a href={lesson.materials_url} target="_blank" rel="noopener noreferrer">
                                                  <FileText size={16} className="mr-2" />
                                                  Download Materi
                                                </a>
                                              </Button>
                                            )}
                                            {!hasAccess && (
                                              <p className="text-sm text-muted-foreground">
                                                Upgrade paket untuk mengakses materi ini
                                              </p>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
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