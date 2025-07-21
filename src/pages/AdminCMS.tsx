import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Save, X, Upload, Video, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
  chapters?: Chapter[];
}

interface Chapter {
  id: string;
  module_id: string;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  description: string;
  difficulty: 'basic' | 'medium' | 'large';
  order_index: number;
  video_url?: string;
  content?: string;
  materials_url?: string;
  duration_minutes?: number;
  is_published: boolean;
  required_package: string[];
}

const AdminCMS = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showAddDialog, setShowAddDialog] = useState<'module' | 'chapter' | 'lesson' | null>(null);
  const { toast } = useToast();

  const fetchModules = async () => {
    try {
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          chapters (
            *,
            lessons (*)
          )
        `)
        .order('order_index');

      if (modulesError) throw modulesError;
      setModules(modulesData || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data modul",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const saveLesson = async (lesson: Partial<Lesson>) => {
    try {
      if (editingLesson?.id) {
        const { error } = await supabase
          .from('lessons')
          .update(lesson)
          .eq('id', editingLesson.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert({
            chapter_id: selectedChapter,
            title: lesson.title || '',
            description: lesson.description,
            difficulty: lesson.difficulty,
            content: lesson.content,
            duration_minutes: lesson.duration_minutes,
            is_published: lesson.is_published,
            required_package: lesson.required_package,
            order_index: 0
          });
        if (error) throw error;
      }

      toast({
        title: "Berhasil",
        description: editingLesson?.id ? "Materi berhasil diupdate" : "Materi berhasil ditambah"
      });

      setEditingLesson(null);
      fetchModules();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan materi",
        variant: "destructive"
      });
    }
  };

  const uploadFile = async (file: File, type: 'video' | 'material') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lms-content')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('lms-content')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Gagal upload file",
        variant: "destructive"
      });
      return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';  
      case 'large': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const selectedModuleData = modules.find(m => m.id === selectedModule);
  const selectedChapterData = selectedModuleData?.chapters?.find(c => c.id === selectedChapter);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-between">
              CMS - Kelola Konten LMS
              <div className="space-x-2">
                <Dialog open={showAddDialog === 'module'} onOpenChange={(open) => setShowAddDialog(open ? 'module' : null)}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Modul
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Modul Baru</DialogTitle>
                    </DialogHeader>
                    <AddModuleForm onSuccess={() => { setShowAddDialog(null); fetchModules(); }} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Modules List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Modul</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {modules.map((module) => (
                      <div
                        key={module.id}
                        className={`p-3 rounded border cursor-pointer transition-colors ${
                          selectedModule === module.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                        }`}
                        onClick={() => {
                          setSelectedModule(module.id);
                          setSelectedChapter('');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{module.title}</h4>
                            <p className="text-sm text-muted-foreground">{module.chapters?.length || 0} BAB</p>
                          </div>
                          <Badge variant={module.is_published ? 'default' : 'secondary'}>
                            {module.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Chapters List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      BAB
                      {selectedModule && (
                        <Dialog open={showAddDialog === 'chapter'} onOpenChange={(open) => setShowAddDialog(open ? 'chapter' : null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Tambah BAB Baru</DialogTitle>
                            </DialogHeader>
                            <AddChapterForm moduleId={selectedModule} onSuccess={() => { setShowAddDialog(null); fetchModules(); }} />
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedModuleData?.chapters?.map((chapter) => (
                      <div
                        key={chapter.id}
                        className={`p-3 rounded border cursor-pointer transition-colors ${
                          selectedChapter === chapter.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedChapter(chapter.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{chapter.title}</h4>
                            <p className="text-sm text-muted-foreground">{chapter.lessons?.length || 0} Materi</p>
                          </div>
                          <Badge variant={chapter.is_published ? 'default' : 'secondary'}>
                            {chapter.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Lessons List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Materi
                      {selectedChapter && (
                        <Dialog open={showAddDialog === 'lesson'} onOpenChange={(open) => setShowAddDialog(open ? 'lesson' : null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Tambah Materi Baru</DialogTitle>
                            </DialogHeader>
                            <AddLessonForm 
                              chapterId={selectedChapter} 
                              onSuccess={() => { setShowAddDialog(null); fetchModules(); }}
                              onUpload={uploadFile}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedChapterData?.lessons?.map((lesson) => (
                      <div key={lesson.id} className="p-3 rounded border hover:bg-muted">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{lesson.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getDifficultyColor(lesson.difficulty)}>
                                {lesson.difficulty}
                              </Badge>
                              {lesson.video_url && <Video className="w-4 h-4 text-blue-500" />}
                              {lesson.materials_url && <FileText className="w-4 h-4 text-green-500" />}
                              <Badge variant={lesson.is_published ? 'default' : 'secondary'}>
                                {lesson.is_published ? 'Published' : 'Draft'}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingLesson(lesson)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Lesson Dialog */}
        <Dialog open={!!editingLesson} onOpenChange={(open) => !open && setEditingLesson(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Materi: {editingLesson?.title}</DialogTitle>
            </DialogHeader>
            {editingLesson && (
              <EditLessonForm 
                lesson={editingLesson}
                onSave={saveLesson}
                onCancel={() => setEditingLesson(null)}
                onUpload={uploadFile}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Add Module Form Component
const AddModuleForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('modules')
        .insert({
          title,
          description,
          is_published: isPublished,
          order_index: 0
        });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Modul berhasil ditambah"
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding module:', error);
      toast({
        title: "Error",
        description: "Gagal menambah modul",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Judul Modul</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <Label htmlFor="published">Publish</Label>
      </div>
      <Button type="submit">Simpan</Button>
    </form>
  );
};

// Add Chapter Form Component  
const AddChapterForm = ({ moduleId, onSuccess }: { moduleId: string; onSuccess: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('chapters')
        .insert({
          module_id: moduleId,
          title,
          description,
          is_published: isPublished,
          order_index: 0
        });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "BAB berhasil ditambah"
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding chapter:', error);
      toast({
        title: "Error", 
        description: "Gagal menambah BAB",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Judul BAB</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <Label htmlFor="published">Publish</Label>
      </div>
      <Button type="submit">Simpan</Button>
    </form>
  );
};

// Add Lesson Form Component
const AddLessonForm = ({ 
  chapterId, 
  onSuccess, 
  onUpload 
}: { 
  chapterId: string; 
  onSuccess: () => void;
  onUpload: (file: File, type: 'video' | 'material') => Promise<string | null>;
}) => {
  const [lesson, setLesson] = useState({
    title: '',
    description: '',
    difficulty: 'basic' as 'basic' | 'medium' | 'large',
    content: '',
    duration_minutes: 0,
    is_published: false,
    required_package: ['small']
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('lessons')
        .insert({
          ...lesson,
          chapter_id: chapterId,
          order_index: 0
        });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Materi berhasil ditambah"
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast({
        title: "Error",
        description: "Gagal menambah materi",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'material') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await onUpload(file, type);
    if (url) {
      if (type === 'video') {
        setLesson(prev => ({ ...prev, video_url: url }));
      } else {
        setLesson(prev => ({ ...prev, materials_url: url }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Judul Materi</Label>
          <Input
            id="title"
            value={lesson.title}
            onChange={(e) => setLesson(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
          <Select value={lesson.difficulty} onValueChange={(value: 'basic' | 'medium' | 'large') => 
            setLesson(prev => ({ ...prev, difficulty: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={lesson.description}
          onChange={(e) => setLesson(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="content">Konten Materi</Label>
        <Textarea
          id="content"
          value={lesson.content}
          onChange={(e) => setLesson(prev => ({ ...prev, content: e.target.value }))}
          rows={6}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="video">Upload Video</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => handleFileUpload(e, 'video')}
          />
        </div>
        <div>
          <Label htmlFor="materials">Upload Materi</Label>
          <Input
            id="materials"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={(e) => handleFileUpload(e, 'material')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="duration">Durasi (menit)</Label>
        <Input
          id="duration"
          type="number"
          value={lesson.duration_minutes}
          onChange={(e) => setLesson(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={lesson.is_published}
          onCheckedChange={(checked) => setLesson(prev => ({ ...prev, is_published: checked }))}
        />
        <Label htmlFor="published">Publish</Label>
      </div>

      <Button type="submit">Simpan</Button>
    </form>
  );
};

// Edit Lesson Form Component
const EditLessonForm = ({ 
  lesson, 
  onSave, 
  onCancel,
  onUpload 
}: { 
  lesson: Lesson; 
  onSave: (lesson: Partial<Lesson>) => void;
  onCancel: () => void;
  onUpload: (file: File, type: 'video' | 'material') => Promise<string | null>;
}) => {
  const [editedLesson, setEditedLesson] = useState(lesson);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'material') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await onUpload(file, type);
    if (url) {
      if (type === 'video') {
        setEditedLesson(prev => ({ ...prev, video_url: url }));
      } else {
        setEditedLesson(prev => ({ ...prev, materials_url: url }));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Judul Materi</Label>
          <Input
            id="title"
            value={editedLesson.title}
            onChange={(e) => setEditedLesson(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
          <Select value={editedLesson.difficulty} onValueChange={(value: 'basic' | 'medium' | 'large') => 
            setEditedLesson(prev => ({ ...prev, difficulty: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={editedLesson.description}
          onChange={(e) => setEditedLesson(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="content">Konten Materi</Label>
        <Textarea
          id="content"
          value={editedLesson.content || ''}
          onChange={(e) => setEditedLesson(prev => ({ ...prev, content: e.target.value }))}
          rows={8}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="video">Upload Video Baru</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => handleFileUpload(e, 'video')}
          />
          {editedLesson.video_url && (
            <p className="text-sm text-muted-foreground mt-1">Video saat ini: {editedLesson.video_url}</p>
          )}
        </div>
        <div>
          <Label htmlFor="materials">Upload Materi Baru</Label>
          <Input
            id="materials"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={(e) => handleFileUpload(e, 'material')}
          />
          {editedLesson.materials_url && (
            <p className="text-sm text-muted-foreground mt-1">Materi saat ini: {editedLesson.materials_url}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="duration">Durasi (menit)</Label>
        <Input
          id="duration"
          type="number"
          value={editedLesson.duration_minutes || 0}
          onChange={(e) => setEditedLesson(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={editedLesson.is_published}
          onCheckedChange={(checked) => setEditedLesson(prev => ({ ...prev, is_published: checked }))}
        />
        <Label htmlFor="published">Publish</Label>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSave(editedLesson)}>
          <Save className="w-4 h-4 mr-2" />
          Simpan
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Batal
        </Button>
      </div>
    </div>
  );
};

export default AdminCMS;