-- Add template_path column to Order table
ALTER TABLE public."Order" 
ADD COLUMN template_path TEXT;