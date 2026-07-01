CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
(
  'siteConfig',
  '{
    "companyName": "杭州西湖生物材料有限公司",
    "brandName": "西湖巴尔",
    "nameEN": "HANGZHOU WESTLAKE BIOMATERIAL CO., LTD.",
    "founded": 1991,
    "phone": "0571-88096997",
    "email": "info@xihubiom.com",
    "address": "浙江省杭州市余杭区仁和街道临港路1号2号楼",
    "slogan": "精密制造，铸就信赖",
    "tagline": "正畸材料的中国精度",
    "heroDesc": "国内最早研制开发齿科正畸器材的高新技术企业，30年专注口腔正畸材料研发与制造，产品行销全球数十个国家。",
    "stats": [
      {"value": "30+", "label": "年行业积淀", "suffix": ""},
      {"value": "23", "label": "项专利", "suffix": "发明专利8项，实用新型15项"},
      {"value": "30+", "label": "省市覆盖", "suffix": "国内经销网络"},
      {"value": "50+", "label": "国家出口", "suffix": "海外市场覆盖"}
    ],
    "achievements": [
      "高新技术企业",
      "浙江省隐形冠军企业（2023）",
      "ISO 13485 医疗器械质量管理体系认证",
      "与四川大学华西口腔医院合作研发"
    ],
    "heroImages": []
  }'::jsonb
),
(
  'aboutContent',
  '{
    "heading": "三十载精工之路",
    "subtitle": "以精密制造守护每一份笑容",
    "history": [
      {"year": 1991, "title": "公司成立", "desc": "杭州西湖生物材料有限公司正式成立，成为中国最早一批专注于口腔正畸材料研发制造的企业。"},
      {"year": 2005, "title": "品牌升级", "desc": "正式确立西湖巴尔品牌，开启品牌化发展之路，产品线扩展至全系列正畸器材。"},
      {"year": 2015, "title": "技术突破", "desc": "自主研发自锁托槽系列上市，获国家发明专利，MIM一体成型工艺达到国际先进水平。"},
      {"year": 2020, "title": "产学研深化", "desc": "与四川大学华西口腔医院建立深度合作，联合研发新一代正畸产品。"},
      {"year": 2023, "title": "隐形冠军", "desc": "获评浙江省隐形冠军企业，拥有8项发明专利和15项实用新型专利，产品出口50余国。"}
    ],
    "mission": "我们相信，精密制造是医疗安全的基石。三十年来，每一颗托槽、每一支粘接剂、每一枚支抗钉，都承载着对品质的极致追求。从材料研发到生产工艺，从质量管控到临床验证，我们以精益求精的工匠精神，为全球口腔正畸医生提供可信赖的产品。",
    "vision": "致力于成为国际一流的正畸材料品牌，以中国精度服务全球口腔健康。"
  }'::jsonb
),
(
  'contactContent',
  '{
    "heading": "联系我们",
    "subtitle": "期待与您建立合作，共同推动口腔正畸事业发展",
    "contactItems": [
      {"icon": "Phone", "label": "电话", "value": "0571-88096997", "href": "tel:0571-88096997"},
      {"icon": "Mail", "label": "邮箱", "value": "info@xihubiom.com", "href": "mailto:info@xihubiom.com"},
      {"icon": "MapPin", "label": "地址", "value": "浙江省杭州市余杭区仁和街道临港路1号2号楼"},
      {"icon": "Globe", "label": "英文站", "value": "en.xihubiom.com.cn", "href": "http://en.xihubiom.com.cn"}
    ],
    "formFields": {
      "name": {"label": "姓名", "placeholder": "您的姓名"},
      "company": {"label": "单位", "placeholder": "医院/诊所/公司名称"},
      "phone": {"label": "电话", "placeholder": "您的联系电话"},
      "interest": {"label": "感兴趣的产品", "placeholder": "请选择产品类别"},
      "message": {"label": "需求描述", "placeholder": "请描述您的具体需求或合作意向..."}
    },
    "productInterests": [
      "正畸托槽（含自锁托槽）",
      "牙釉质粘合树脂（蓝胶/绿胶）",
      "正畸支抗钉",
      "正畸钢丝/带环/颊面管",
      "根管桩/纤维桩",
      "正畸工具（钳子、测力计等）",
      "其他 / 整体合作咨询"
    ]
  }'::jsonb
),
(
  'footerContent',
  '{
    "description": "杭州西湖生物材料有限公司是国内口腔正畸材料领域的先驱企业，品牌西湖巴尔创立于2005年，产品涵盖正畸托槽、粘接材料、支抗钉系统、正畸工具及配套耗材全系列。",
    "quickLinks": [
      {"label": "产品中心", "href": "#products"},
      {"label": "关于我们", "href": "#about"},
      {"label": "新闻动态", "href": "#news"},
      {"label": "联系我们", "href": "#contact"}
    ],
    "icp": "浙ICP备19046955号",
    "copyright": "© 2025 杭州西湖生物材料有限公司 版权所有"
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "管理员可读写设置" ON site_settings FOR ALL USING (true) WITH CHECK (true);
