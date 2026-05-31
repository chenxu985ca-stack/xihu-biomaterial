// 杭州西湖生物材料有限公司 — 全部网站文案及数据
// 品牌：西湖巴尔 (Westlake巴尔)

export const siteConfig = {
  companyName: '杭州西湖生物材料有限公司',
  brandName: '西湖巴尔',
  nameEN: 'HANGZHOU WESTLAKE BIOMATERIAL CO., LTD.',
  founded: 1994,
  phone: '0571-88096997',
  email: 'info@xihubiom.com',
  address: '浙江省杭州市余杭区仁和街道临港路1号2号楼',
  slogan: '精密制造，铸就信赖',
  tagline: '正畸材料的中国精度',
  heroDesc: '国内最早研制开发齿科正畸器材的高新技术企业，30年专注口腔正畸材料研发与制造，产品行销全球数十个国家。',
  stats: [
    { value: '30+', label: '年行业积淀', suffix: '' },
    { value: '23', label: '项专利', suffix: '发明专利8项，实用新型15项' },
    { value: '30+', label: '省市覆盖', suffix: '国内经销网络' },
    { value: '50+', label: '国家出口', suffix: '海外市场覆盖' },
  ],
  achievements: [
    '高新技术企业',
    '浙江省"隐形冠军"企业（2023）',
    'ISO 13485 医疗器械质量管理体系认证',
    '与四川大学华西口腔医院合作研发',
  ],
};

export const navLinks = [
  { label: '首页', href: '#home' },
  { label: '产品中心', href: '#products' },
  { label: '关于我们', href: '#about' },
  { label: '新闻动态', href: '#news' },
  { label: '联系我们', href: '#contact' },
];

export const productCategories = [
  {
    id: 'brackets',
    name: '正畸托槽',
    nameEN: 'Orthodontic Brackets',
    icon: 'Circle',
    desc: '涵盖被动自锁、金属、陶瓷等多系列托槽，MIM一体成型工艺，纳米级表面处理',
    products: [
      { name: '卓越Ⅵ代自锁托槽', desc: '最新自锁系列，轻薄化设计，摩擦力降低30%，治疗周期缩短4-6个月', highlight: '新一代' },
      { name: '卓越Ⅲ代被动自锁托槽', desc: 'MIM一体成型，多种转矩可选，弧形底板精准贴合', highlight: '经典款' },
      { name: 'HXZ系列自锁托槽', desc: '与华西口腔医院合作研发，临床验证卓越', highlight: '产学研' },
      { name: '陶瓷托槽', desc: '美学需求首选，半透明材质兼顾美观与性能', highlight: '' },
      { name: '金属托槽', desc: '基础系列，性价比之选，工艺成熟稳定', highlight: '' },
    ],
  },
  {
    id: 'adhesives',
    name: '粘接材料',
    nameEN: 'Adhesive Resins',
    icon: 'Droplets',
    desc: '光固化/自固化牙釉质粘合树脂，智能变色技术，临床操作精准可控',
    products: [
      { name: '蓝胶（Blue Adhesive）', desc: '智能显隐变色（蓝色→透明→蓝色），用于粘接带环及咬合打开', highlight: '明星产品' },
      { name: '绿胶（Green Adhesive）', desc: '光固化型粘接剂，金属/陶瓷托槽通用，工作时间充裕，脱落率低', highlight: '临床首选' },
      { name: '光固化牙釉质粘合树脂', desc: '通用型，含粘接剂+引发剂+酸蚀剂完整套装', highlight: '' },
      { name: '隐形正畸附件粘结剂', desc: '可手塑成型，专为隐形矫治附件设计', highlight: '' },
    ],
  },
  {
    id: 'anchorage',
    name: '支抗钉系统',
    nameEN: 'Micro-Screw Anchorage',
    icon: 'Target',
    desc: '钛合金微种植支抗钉，高效自攻设计，多规格可选',
    products: [
      { name: 'XH方头型支抗钉', desc: '钛合金材质，弧形钉颈保护软组织，加大颈圈便于清洁', highlight: '' },
      { name: '根内种植钉', desc: '特殊场景专用，高固位力设计', highlight: '' },
      { name: '骨螺纹根管钉', desc: '自攻自断设计，操作便捷，骨内固位稳定', highlight: '' },
    ],
  },
  {
    id: 'tools',
    name: '正畸工具',
    nameEN: 'Orthodontic Instruments',
    icon: 'Wrench',
    desc: '精密正畸工具系列，涵盖测力、定位、弯制、拆装全流程',
    products: [
      { name: '扭力扳手', desc: '高精度扭力控制，确保自锁托槽开闭精确操作', highlight: '' },
      { name: '正畸钳系列', desc: '涵盖末端切断钳、细丝弯制钳、托槽去除钳等多款', highlight: '' },
      { name: '方丝弓成型器', desc: '精准弓形，不锈钢材质，标准弓形模板', highlight: '' },
      { name: '托槽定位器', desc: '辅助托槽精准定位，提升临床效率', highlight: '' },
      { name: '牙用测力计', desc: '高灵敏度测力，精确到克，辅助正畸力学设计', highlight: '' },
    ],
  },
  {
    id: 'consumables',
    name: '配套耗材',
    nameEN: 'Consumables & Accessories',
    icon: 'Package',
    desc: '带环、颊面管、结扎丝圈、橡皮链等正畸全流程配套材料',
    products: [
      { name: '正畸带环/颊面管', desc: '预成型设计，多规格可选，适配不同牙位', highlight: '' },
      { name: '正畸钢丝', desc: '多规格镍钛丝、不锈钢丝，满足不同矫治阶段需求', highlight: '' },
      { name: '纤维桩/根管桩', desc: '高强度纤维增强复合材料，根管修复优选', highlight: '' },
      { name: '口外弓/扩弓器', desc: '口外支抗装置，螺旋扩弓设计', highlight: '' },
    ],
  },
];

export const aboutContent = {
  heading: '三十载精工之路',
  subtitle: '以精密制造守护每一份笑容',
  history: [
    {
      year: 1994,
      title: '公司成立',
      desc: '杭州西湖生物材料有限公司正式成立，成为中国最早一批专注于口腔正畸材料研发制造的企业。',
    },
    {
      year: 2005,
      title: '品牌升级',
      desc: '正式确立"西湖巴尔"品牌，开启品牌化发展之路，产品线扩展至全系列正畸器材。',
    },
    {
      year: 2015,
      title: '技术突破',
      desc: '自主研发自锁托槽系列上市，获国家发明专利，MIM一体成型工艺达到国际先进水平。',
    },
    {
      year: 2020,
      title: '产学研深化',
      desc: '与四川大学华西口腔医院建立深度合作，联合研发新一代正畸产品。',
    },
    {
      year: 2023,
      title: '隐形冠军',
      desc: '获评浙江省"隐形冠军企业"，拥有8项发明专利和15项实用新型专利，产品出口50余国。',
    },
  ],
  mission: '我们相信，精密制造是医疗安全的基石。三十年来，每一颗托槽、每一支粘接剂、每一枚支抗钉，都承载着对品质的极致追求。从材料研发到生产工艺，从质量管控到临床验证，我们以精益求精的工匠精神，为全球口腔正畸医生提供可信赖的产品。',
  vision: '致力于成为国际一流的正畸材料品牌，以中国精度服务全球口腔健康。',
};

export const newsItems = [
  {
    id: 1,
    date: '2025-06',
    title: '西湖巴尔将亮相2025北京国际口腔展',
    summary: '携卓越Ⅵ代自锁托槽等全线新品参展，展位号：A馆 B12',
    tag: '展会',
  },
  {
    id: 2,
    date: '2025-04',
    title: '2款产品入选《杭州市优质产品推荐目录》',
    summary: '卓越Ⅳ代自锁托槽与光固化绿胶双双入选，彰显产品品质',
    tag: '荣誉',
  },
  {
    id: 3,
    date: '2025-01',
    title: '卓越Ⅵ代自锁托槽正式上市',
    summary: '新一代自锁托槽采用纳米级表面处理技术，摩擦力降低30%，治疗周期缩短4-6个月',
    tag: '新品',
  },
  {
    id: 4,
    date: '2024-10',
    title: '公司亮相2024上海国际口腔展DenTech China',
    summary: '展会现场展示全系正畸解决方案，获海内外客户广泛关注',
    tag: '展会',
  },
  {
    id: 5,
    date: '2024-06',
    title: '新生产基地通过GMP认证',
    summary: '位于余杭区的新生产基地正式投产，产能提升200%，全面满足国内外市场需求',
    tag: '动态',
  },
  {
    id: 6,
    date: '2024-03',
    title: '与华西口腔医院签署战略合作协议',
    summary: '深化产学研合作，共建口腔正畸材料联合实验室',
    tag: '动态',
  },
];

export const contactContent = {
  heading: '联系我们',
  subtitle: '期待与您建立合作，共同推动口腔正畸事业发展',
  contactItems: [
    { icon: 'Phone', label: '电话', value: '0571-88096997', href: 'tel:0571-88096997' },
    { icon: 'Mail', label: '邮箱', value: 'info@xihubiom.com', href: 'mailto:info@xihubiom.com' },
    { icon: 'MapPin', label: '地址', value: '浙江省杭州市余杭区仁和街道临港路1号2号楼' },
    { icon: 'Globe', label: '英文站', value: 'en.xihubiom.com.cn', href: 'http://en.xihubiom.com.cn' },
  ],
  formFields: {
    name: { label: '姓名', placeholder: '您的姓名', icon: 'User' },
    company: { label: '单位', placeholder: '医院/诊所/公司名称', icon: 'Building2' },
    phone: { label: '电话', placeholder: '您的联系电话', icon: 'Phone' },
    message: { label: '需求描述', placeholder: '请描述您感兴趣的产品或合作意向...', icon: 'MessageSquare' },
  },
};

export const footerContent = {
  description: '杭州西湖生物材料有限公司是国内口腔正畸材料领域的先驱企业，品牌"西湖巴尔"创立于2005年，产品涵盖正畸托槽、粘接材料、支抗钉系统、正畸工具及配套耗材全系列。',
  quickLinks: [
    { label: '产品中心', href: '#products' },
    { label: '关于我们', href: '#about' },
    { label: '新闻动态', href: '#news' },
    { label: '联系我们', href: '#contact' },
  ],
  copyright: `© ${new Date().getFullYear()} 杭州西湖生物材料有限公司 版权所有`,
  icp: '浙ICP备19046955号',
};
