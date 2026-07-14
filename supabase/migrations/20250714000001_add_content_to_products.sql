-- Add content column to products table for detailed specs/body text
ALTER TABLE products ADD COLUMN IF NOT EXISTS content TEXT;
