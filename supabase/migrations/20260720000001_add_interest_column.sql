-- 为 contact_submissions 表增加 interest（感兴趣产品）字段
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS interest TEXT;
