-- ============================================================
-- 西湖巴尔网站 — 数据库一键初始化脚本
-- 请登录 Supabase Dashboard → SQL Editor → 粘贴全部内容 → Run
-- ============================================================

-- ============================================================
-- 第1步：创建表结构
-- ============================================================

-- 产品分类表
CREATE TABLE IF NOT EXISTS product_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'Package',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_sort ON product_categories (sort_order);

-- 产品表
CREATE TABLE IF NOT EXISTS products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT,
  highlight TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products (category_id, sort_order);

-- 新闻表
CREATE TABLE IF NOT EXISTS news (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  tag TEXT NOT NULL DEFAULT '动态',
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_date ON news (publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_active ON news (is_active);

-- ============================================================
-- 第2步：RLS 安全策略
-- ============================================================

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 匿名用户可读
DO $$ BEGIN
  CREATE POLICY "anon_read_categories" ON product_categories FOR SELECT TO anon USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "anon_read_products" ON products FOR SELECT TO anon USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "anon_read_news" ON news FOR SELECT TO anon USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 认证用户可全量管理
DO $$ BEGIN
  CREATE POLICY "auth_all_categories" ON product_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_news" ON news FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- 第3步：导入种子数据
-- ============================================================

-- 清空旧数据（如果有）
DELETE FROM products;
DELETE FROM product_categories;
DELETE FROM news;

-- 产品分类（12类，覆盖正畸全流程）
INSERT INTO product_categories (name, name_en, slug, description, icon, sort_order) VALUES
  ('正畸托槽',               'Orthodontic Brackets',            'brackets',           '涵盖被动自锁、金属、陶瓷等多系列托槽，MIM一体成型工艺，纳米级表面处理',                                                                                         'Circle',    1),
  ('正畸带环',               'Orthodontic Bands',               'bands',              '预成型不锈钢带环，多规格可选，适配不同牙位和临床需求',                                                                                                           'Circle',    2),
  ('正畸颊面管',             'Buccal Tubes',                    'buccal-tubes',       '可焊接/可粘接型颊面管，精密铸造成型，多种转矩角度',                                                                                                             'Circle',    3),
  ('正畸附件',               'Orthodontic Attachments',         'attachments',        '托槽定位器、隐形矫治附件、舌侧扣等辅助附件',                                                                                                                   'Package',   4),
  ('牙釉质粘合树脂',         'Enamel Adhesive Resins',          'adhesives',          '光固化/自固化粘合树脂，智能变色技术，含蓝胶、绿胶系列',                                                                                                         'Droplets',  5),
  ('正畸支抗钉',             'Micro-Screw Anchorage',           'anchorage',          '钛合金微种植支抗钉，高效自攻设计，多规格可选',                                                                                                                   'Target',    6),
  ('正畸丝',                 'Orthodontic Archwires',           'archwires',          '镍钛丝、不锈钢丝、热激活丝等多规格正畸弓丝',                                                                                                                     'Wrench',    7),
  ('正畸弹性体',             'Orthodontic Elastomerics',        'elastomerics',       '橡皮链、结扎圈、弹性牵引圈等弹性耗材',                                                                                                                           'Package',   8),
  ('正畸口外件',             'Extraoral Appliances',            'extraoral',          '口外弓、扩弓器、前方牵引装置等口外支抗产品',                                                                                                                     'Target',    9),
  ('正畸工具',               'Orthodontic Instruments',         'tools',              '精密正畸工具系列，涵盖测力、定位、弯制、拆装全流程',                                                                                                             'Wrench',   10),
  ('牙用自攻自断骨螺纹固位钉', 'Self-Tapping Bone Screws',       'bone-screws',        '自攻自断设计，骨内固位稳定，操作便捷',                                                                                                                             'Target',   11),
  ('牙用根管桩',             'Dental Root Canal Posts',         'root-posts',         '高强度纤维增强复合材料根管桩，根管修复优选',                                                                                                                       'Package',  12);

-- 产品数据（12个分类，31款产品）
DO $$
DECLARE
  cat_brackets BIGINT;
  cat_bands BIGINT;
  cat_buccal_tubes BIGINT;
  cat_attachments BIGINT;
  cat_adhesives BIGINT;
  cat_anchorage BIGINT;
  cat_archwires BIGINT;
  cat_elastomerics BIGINT;
  cat_extraoral BIGINT;
  cat_tools BIGINT;
  cat_bone_screws BIGINT;
  cat_root_posts BIGINT;
BEGIN
  SELECT id INTO cat_brackets FROM product_categories WHERE slug = 'brackets';
  SELECT id INTO cat_bands FROM product_categories WHERE slug = 'bands';
  SELECT id INTO cat_buccal_tubes FROM product_categories WHERE slug = 'buccal-tubes';
  SELECT id INTO cat_attachments FROM product_categories WHERE slug = 'attachments';
  SELECT id INTO cat_adhesives FROM product_categories WHERE slug = 'adhesives';
  SELECT id INTO cat_anchorage FROM product_categories WHERE slug = 'anchorage';
  SELECT id INTO cat_archwires FROM product_categories WHERE slug = 'archwires';
  SELECT id INTO cat_elastomerics FROM product_categories WHERE slug = 'elastomerics';
  SELECT id INTO cat_extraoral FROM product_categories WHERE slug = 'extraoral';
  SELECT id INTO cat_tools FROM product_categories WHERE slug = 'tools';
  SELECT id INTO cat_bone_screws FROM product_categories WHERE slug = 'bone-screws';
  SELECT id INTO cat_root_posts FROM product_categories WHERE slug = 'root-posts';

  -- 1. 正畸托槽
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_brackets, '卓越Ⅵ代自锁托槽',   '最新自锁系列，轻薄化设计，摩擦力降低30%，治疗周期缩短4-6个月',                   '新一代', 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop', 1),
    (cat_brackets, '卓越Ⅲ代被动自锁托槽', 'MIM一体成型，多种转矩可选，弧形底板精准贴合',                                    '经典款', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop', 2),
    (cat_brackets, 'HXZ系列自锁托槽',     '与华西口腔医院合作研发，临床验证卓越',                                           '产学研', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop', 3),
    (cat_brackets, '陶瓷托槽',            '美学需求首选，半透明材质兼顾美观与性能',                                         '',       'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop', 4),
    (cat_brackets, '金属托槽',            '基础系列，性价比之选，工艺成熟稳定',                                             '',       'https://images.unsplash.com/photo-1551601651-2a8555f1a29e?w=400&h=300&fit=crop', 5);

  -- 2. 正畸带环
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_bands, '预成型正畸带环',   '不锈钢材质，预成型弧度，多牙位规格可选',           '', 'https://images.unsplash.com/photo-1551601651-2a8555f1a29e?w=400&h=300&fit=crop', 1),
    (cat_bands, '光面带环',         '表面光洁度高，减少菌斑附着，临床操作便捷',         '', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop', 2);

  -- 3. 正畸颊面管
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_buccal_tubes, '可焊接颊面管',   '精密铸造，焊接面平整，适配多种弓丝尺寸',     '', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop', 1),
    (cat_buccal_tubes, '可粘接颊面管',   '底板网底设计，粘接牢固，减少临床脱落风险',   '', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop', 2);

  -- 4. 正畸附件
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_attachments, '隐形正畸附件',       '专为隐形矫治设计的复合附件，可手塑成型',             '', 'https://images.unsplash.com/photo-1563213126-a4273aed2b5b?w=400&h=300&fit=crop', 1),
    (cat_attachments, '舌侧扣',             '舌侧矫治辅助扣，低矮外形减少舌侧异物感',             '', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop', 2);

  -- 5. 牙釉质粘合树脂
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_adhesives, '蓝胶（Blue Adhesive）',    '智能显隐变色（蓝色→透明→蓝色），用于粘接带环及咬合打开',                   '明星产品', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop', 1),
    (cat_adhesives, '绿胶（Green Adhesive）',   '光固化型粘接剂，金属/陶瓷托槽通用，工作时间充裕，脱落率低',                '临床首选', 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop', 2),
    (cat_adhesives, '光固化牙釉质粘合树脂',      '通用型，含粘接剂+引发剂+酸蚀剂完整套装，临床操作简便',                      '',       'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop', 3);

  -- 6. 正畸支抗钉
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_anchorage, 'XH方头型支抗钉',  '钛合金材质，弧形钉颈保护软组织，加大颈圈便于清洁', '', 'https://images.unsplash.com/photo-1583911860205-72f8ac8dee0e?w=400&h=300&fit=crop', 1),
    (cat_anchorage, '根内种植钉',      '特殊场景专用，高固位力设计，骨内稳定持久',           '', 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop', 2);

  -- 7. 正畸丝
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_archwires, '镍钛超弹弓丝',   '超弹性镍钛合金，持续轻力输出，减少临床更换频次',     '', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop', 1),
    (cat_archwires, '不锈钢弓丝',      '高强度不锈钢，圆丝/方丝可选，弯制性能优异',          '', 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&h=300&fit=crop', 2),
    (cat_archwires, '热激活弓丝',      '体温响应型镍钛丝，相变温度精准可控，临床体验佳',      '', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop', 3);

  -- 8. 正畸弹性体
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_elastomerics, '正畸橡皮链',   '多色可选，弹性持久，力值衰减缓慢',   '', 'https://images.unsplash.com/photo-1583911860205-72f8ac8dee0e?w=400&h=300&fit=crop', 1),
    (cat_elastomerics, '结扎圈',       '弹性结扎圈，快速结扎，临床操作便捷', '', 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop', 2);

  -- 9. 正畸口外件
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_extraoral, '口外弓',         '高位/低位/联合牵引可选，口外支抗经典装置',           '', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop', 1),
    (cat_extraoral, '螺旋扩弓器',     '快速扩弓设计，螺旋式渐进加力，患者接受度高',         '', 'https://images.unsplash.com/photo-1583911860205-72f8ac8dee0e?w=400&h=300&fit=crop', 2),
    (cat_extraoral, '前方牵引装置',   '面罩式前方牵引，用于安氏Ⅲ类错颌早期矫治',           '', 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&h=300&fit=crop', 3);

  -- 10. 正畸工具
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_tools, '扭力扳手',      '高精度扭力控制，确保自锁托槽开闭精确操作',       '', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop', 1),
    (cat_tools, '正畸钳系列',    '涵盖末端切断钳、细丝弯制钳、托槽去除钳等多款', '', 'https://images.unsplash.com/photo-1563770660941-10a636076e26?w=400&h=300&fit=crop', 2),
    (cat_tools, '方丝弓成型器',  '精准弓形，不锈钢材质，标准弓形模板',               '', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop', 3),
    (cat_tools, '牙用测力计',    '高灵敏度测力，精确到克，辅助正畸力学设计',         '', 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=300&fit=crop', 4);

  -- 11. 牙用自攻自断骨螺纹固位钉
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_bone_screws, '自攻自断骨螺纹固位钉',   '自攻自断设计，单一钻头完成钻孔+植入+断离',       '', 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&h=300&fit=crop', 1),
    (cat_bone_screws, '钛合金骨固位钉',         '医用级钛合金，生物相容性优异，骨内长期稳定',       '', 'https://images.unsplash.com/photo-1583911860205-72f8ac8dee0e?w=400&h=300&fit=crop', 2);

  -- 12. 牙用根管桩
  INSERT INTO products (category_id, name, description, highlight, image_url, sort_order) VALUES
    (cat_root_posts, '石英纤维根管桩',   '高强度石英纤维增强，透光性优异，美学修复首选',     '', 'https://images.unsplash.com/photo-1563213126-a4273aed2b5b?w=400&h=300&fit=crop', 1),
    (cat_root_posts, '玻璃纤维根管桩',   '玻璃纤维复合材料，弹性模量接近牙本质，修复效果佳', '', 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop', 2);
END $$;

-- 新闻数据
INSERT INTO news (title, summary, tag, publish_date) VALUES
  ('西湖巴尔将亮相2025北京国际口腔展',   '携卓越Ⅵ代自锁托槽等全线新品参展，展位号：A馆 B12',                                      '展会', '2025-06-01'),
  ('2款产品入选《杭州市优质产品推荐目录》', '卓越Ⅳ代自锁托槽与光固化绿胶双双入选，彰显产品品质',                                          '荣誉', '2025-04-01'),
  ('卓越Ⅵ代自锁托槽正式上市',            '新一代自锁托槽采用纳米级表面处理技术，摩擦力降低30%，治疗周期缩短4-6个月',                     '新品', '2025-01-01'),
  ('公司亮相2024上海国际口腔展DenTech China', '展会现场展示全系正畸解决方案，获海内外客户广泛关注',                                        '展会', '2024-10-01'),
  ('新生产基地通过GMP认证',               '位于余杭区的新生产基地正式投产，产能提升200%，全面满足国内外市场需求',                      '动态', '2024-06-01'),
  ('与华西口腔医院签署战略合作协议',       '深化产学研合作，共建口腔正畸材料联合实验室',                                                   '动态', '2024-03-01');

-- ============================================================
-- 第4步：Storage 存储桶权限
-- ============================================================

-- 允许认证用户上传/管理文件
DO $$ BEGIN
  CREATE POLICY "auth_insert_products" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "auth_update_products" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "auth_delete_products" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "auth_insert_news" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'news');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "auth_update_news" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'news');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "auth_delete_news" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'news');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 允许匿名用户读取
DO $$ BEGIN
  CREATE POLICY "public_read_products" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_news" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'news');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
