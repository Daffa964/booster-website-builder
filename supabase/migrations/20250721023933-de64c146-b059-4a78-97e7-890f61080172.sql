-- Create storage bucket for video content
INSERT INTO storage.buckets (id, name, public) VALUES ('lms-content', 'lms-content', true);

-- Create modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table with difficulty levels
CREATE TYPE lesson_difficulty AS ENUM ('basic', 'medium', 'large');

CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty lesson_difficulty NOT NULL DEFAULT 'basic',
  order_index INTEGER NOT NULL DEFAULT 0,
  video_url TEXT,
  content TEXT,
  materials_url TEXT,
  duration_minutes INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  required_package TEXT[] DEFAULT ARRAY['small'], -- packages required to access
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE,
  watch_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modules
CREATE POLICY "Anyone can view published modules" ON public.modules FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage modules" ON public.modules FOR ALL USING (true);

-- RLS Policies for chapters  
CREATE POLICY "Anyone can view published chapters" ON public.chapters FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage chapters" ON public.chapters FOR ALL USING (true);

-- RLS Policies for lessons
CREATE POLICY "Anyone can view published lessons" ON public.lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage lessons" ON public.lessons FOR ALL USING (true);

-- RLS Policies for user progress
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can modify their own progress" ON public.user_progress FOR UPDATE USING (user_id = auth.uid()::text);

-- Create storage policies for LMS content
CREATE POLICY "Admins can upload content" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lms-content');
CREATE POLICY "Anyone can view LMS content" ON storage.objects FOR SELECT USING (bucket_id = 'lms-content');

-- Create update timestamp triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample module data
INSERT INTO public.modules (title, description, order_index, is_published) VALUES 
('Modul B.I Booster', 'Program pelatihan lengkap untuk UMKM', 1, true);

-- Get the module ID for inserting chapters
INSERT INTO public.chapters (module_id, title, description, order_index, is_published)
SELECT m.id, 'BAB 1: Dasar Bisnis dan Mindset Wirausaha', 'Membangun fondasi bisnis yang kuat', 1, true
FROM public.modules m WHERE m.title = 'Modul B.I Booster';

INSERT INTO public.chapters (module_id, title, description, order_index, is_published)
SELECT m.id, 'BAB 2: Branding & Identitas Digital', 'Membangun brand yang kuat dan identitas digital', 2, true
FROM public.modules m WHERE m.title = 'Modul B.I Booster';

INSERT INTO public.chapters (module_id, title, description, order_index, is_published)
SELECT m.id, 'BAB 3: Website & Keberadaan Online', 'Membangun kehadiran online yang efektif', 3, true
FROM public.modules m WHERE m.title = 'Modul B.I Booster';

INSERT INTO public.chapters (module_id, title, description, order_index, is_published)
SELECT m.id, 'BAB 4: Digital Marketing Praktis', 'Strategi pemasaran digital yang efektif', 4, true
FROM public.modules m WHERE m.title = 'Modul B.I Booster';

INSERT INTO public.chapters (module_id, title, description, order_index, is_published)
SELECT m.id, 'BAB 5: Keuangan UMKM & Manajemen', 'Mengelola keuangan bisnis dengan baik', 5, true
FROM public.modules m WHERE m.title = 'Modul B.I Booster';

INSERT INTO public.chapters (module_id, title, description, order_index, is_published)
SELECT m.id, 'BAB 6: Meningkatkan Skala & Kolaborasi', 'Mengembangkan bisnis ke level selanjutnya', 6, true
FROM public.modules m WHERE m.title = 'Modul B.I Booster';