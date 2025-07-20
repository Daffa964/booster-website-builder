-- Update Order table to include package information and template
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS template_name TEXT;
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS package_id TEXT NOT NULL DEFAULT 'small';
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS package_name TEXT;

-- Update User table to include verification status and access levels
ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS has_paid BOOLEAN DEFAULT false;
ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS package_access TEXT;

-- Enable RLS on both tables
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Create policies for Order table
CREATE POLICY "Users can view their own orders" ON public."Order"
FOR SELECT USING (true);

CREATE POLICY "Users can create orders" ON public."Order"  
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own orders" ON public."Order"
FOR UPDATE USING (true);

-- Create policies for User table  
CREATE POLICY "Users can view their own profile" ON public."User"
FOR SELECT USING (true);

CREATE POLICY "Users can create their profile" ON public."User"
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON public."User"  
FOR UPDATE USING (true);