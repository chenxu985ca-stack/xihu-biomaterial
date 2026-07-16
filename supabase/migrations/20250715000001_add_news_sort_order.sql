-- Add sort_order column to news table for manual ordering
ALTER TABLE news ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_news_sort ON news (sort_order);

-- Initialize sort_order for existing news (sequential, newest first)
UPDATE news SET sort_order = sub.rn FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY publish_date DESC, id) - 1 AS rn FROM news
) AS sub WHERE news.id = sub.id;
