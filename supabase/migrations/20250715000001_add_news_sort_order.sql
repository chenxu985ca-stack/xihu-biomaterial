-- Add sort_order column to news table for manual ordering
ALTER TABLE news ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_news_sort ON news (sort_order);
