/**
 * 网站设置管理 — 编辑所有网站文案
 *
 * 数据存储在 Supabase site_settings 表（4 个 key）：
 *   siteConfig / aboutContent / contactContent / footerContent
 *
 * 编辑后即时保存到 DB，前端组件通过 SiteSettingsContext 自动更新。
 */
import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle, Plus, Trash2, ImageIcon } from 'lucide-react';
import { getSiteSettings, updateSiteSetting, uploadHeroImage } from '../lib/db';

const SECTION_KEYS = [
  { key: 'siteConfig',    label: '公司信息',   desc: '品牌名称、联系方式、统计数据、资质' },
  { key: 'aboutContent',  label: '关于我们',   desc: '发展历程、使命与愿景' },
  { key: 'contactContent',label: '联系我们',   desc: '联系信息、表单字段、产品意向选项' },
  { key: 'footerContent', label: '底部信息',   desc: '公司简介、ICP备案、快速链接' },
];

/** 默认空结构，防止编辑时字段缺失 */
const DEFAULTS = {
  siteConfig: {
    companyName: '', brandName: '', nameEN: '', founded: 2020,
    phone: '', email: '', address: '',
    slogan: '', tagline: '', heroDesc: '',
    stats: [], achievements: [], heroImages: [], footerQrImage: '',
  },
  aboutContent: {
    heading: '', subtitle: '', history: [], mission: '', vision: '',
  },
  contactContent: {
    heading: '', subtitle: '', contactItems: [], formFields: {}, productInterests: [],
  },
  footerContent: {
    description: '', quickLinks: [], icp: '', copyright: '',
  },
};

export default function SettingsManager() {
  const [activeKey, setActiveKey] = useState('siteConfig');
  const [settings, setSettings] = useState(null);
  const [dirty, setDirty] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // 加载设置
  useEffect(() => {
    setLoading(true);
    getSiteSettings().then(({ data }) => {
      if (data) {
        // 合并：有 DB 数据用 DB，否则用默认空结构
        const merged = {};
        for (const { key } of SECTION_KEYS) {
          merged[key] = { ...DEFAULTS[key], ...(data[key] || {}) };
        }
        setSettings(merged);
      } else {
        setSettings(DEFAULTS);
      }
      setLoading(false);
    });
  }, []);

  const markDirty = (key) => setDirty((d) => ({ ...d, [key]: true }));
  const markClean = (key) => setDirty((d) => ({ ...d, [key]: false }));

  const updateField = (sectionKey, fieldPath, value) => {
    setSettings((prev) => {
      const section = { ...prev[sectionKey] };
      const keys = fieldPath.split('.');
      let obj = section;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return { ...prev, [sectionKey]: section };
    });
    markDirty(sectionKey);
  };

  const updateArrayItem = (sectionKey, arrayPath, index, field, value) => {
    setSettings((prev) => {
      const section = { ...prev[sectionKey] };
      const arr = [...section[arrayPath]];
      if (typeof arr[index] === 'string') {
        arr[index] = value;
      } else {
        arr[index] = { ...arr[index], [field]: value };
      }
      section[arrayPath] = arr;
      return { ...prev, [sectionKey]: section };
    });
    markDirty(sectionKey);
  };

  const addArrayItem = (sectionKey, arrayPath, template) => {
    setSettings((prev) => {
      const section = { ...prev[sectionKey] };
      section[arrayPath] = [...section[arrayPath], template];
      return { ...prev, [sectionKey]: section };
    });
    markDirty(sectionKey);
  };

  const removeArrayItem = (sectionKey, arrayPath, index) => {
    setSettings((prev) => {
      const section = { ...prev[sectionKey] };
      section[arrayPath] = section[arrayPath].filter((_, i) => i !== index);
      return { ...prev, [sectionKey]: section };
    });
    markDirty(sectionKey);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateSiteSetting(activeKey, settings[activeKey]);
    setSaving(false);
    if (error) {
      setToast({ type: 'error', message: '保存失败: ' + error.message });
    } else {
      markClean(activeKey);
      setToast({ type: 'success', message: `${SECTION_KEYS.find(s => s.key === activeKey)?.label} 已保存` });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-graphite-300" />
      </div>
    );
  }

  const section = settings?.[activeKey];

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
          toast.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-red-200 bg-red-50 text-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-auto text-current opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {SECTION_KEYS.map(({ key, label, desc }) => (
          <button
            key={key}
            onClick={() => setActiveKey(key)}
            className={`relative rounded-xl border px-4 py-3 text-left transition-all ${
              activeKey === key
                ? 'border-sapphire-300 bg-sapphire-50 shadow-sm'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${activeKey === key ? 'text-sapphire-700' : 'text-graphite-700'}`}>
                {label}
              </span>
              {dirty[key] && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="有未保存的修改" />}
            </div>
            <p className="mt-0.5 text-[11px] text-graphite-400">{desc}</p>
          </button>
        ))}
      </div>

      {/* Editor panels */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        {activeKey === 'siteConfig' && section && (
          <SiteConfigEditor section={section} updateField={(path, val) => updateField('siteConfig', path, val)}
            updateArrayItem={(arr, i, f, v) => updateArrayItem('siteConfig', arr, i, f, v)}
            addArrayItem={(arr, t) => addArrayItem('siteConfig', arr, t)}
            removeArrayItem={(arr, i) => removeArrayItem('siteConfig', arr, i)} />
        )}
        {activeKey === 'aboutContent' && section && (
          <AboutContentEditor section={section} updateField={(path, val) => updateField('aboutContent', path, val)}
            updateArrayItem={(arr, i, f, v) => updateArrayItem('aboutContent', arr, i, f, v)}
            addArrayItem={(arr, t) => addArrayItem('aboutContent', arr, t)}
            removeArrayItem={(arr, i) => removeArrayItem('aboutContent', arr, i)} />
        )}
        {activeKey === 'contactContent' && section && (
          <ContactContentEditor section={section} updateField={(path, val) => updateField('contactContent', path, val)}
            updateArrayItem={(arr, i, f, v) => updateArrayItem('contactContent', arr, i, f, v)}
            addArrayItem={(arr, t) => addArrayItem('contactContent', arr, t)}
            removeArrayItem={(arr, i) => removeArrayItem('contactContent', arr, i)} />
        )}
        {activeKey === 'footerContent' && section && (
          <FooterContentEditor section={section} updateField={(path, val) => updateField('footerContent', path, val)}
            updateArrayItem={(arr, i, f, v) => updateArrayItem('footerContent', arr, i, f, v)}
            addArrayItem={(arr, t) => addArrayItem('footerContent', arr, t)}
            removeArrayItem={(arr, i) => removeArrayItem('footerContent', arr, i)} />
        )}

        {/* Save button */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-stone-100 pt-5">
          {dirty[activeKey] && (
            <span className="text-xs text-amber-600">有未保存的修改</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !dirty[activeKey]}
            className="btn-primary px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 通用表单组件
// ============================================================

function Field({ label, children, required }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-graphite-500">
        {label} {required && <span className="text-sapphire-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400 resize-none"
    />
  );
}

function ArrayEditor({ label, items, onUpdate, onAdd, onRemove, addTemplate, renderItem }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-graphite-500">{label}</label>
        <button
          type="button"
          onClick={() => onAdd(addTemplate)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-sapphire-600 hover:text-sapphire-700"
        >
          <Plus size={12} /> 添加
        </button>
      </div>
      <div className="space-y-2">
        {(!items || items.length === 0) && (
          <p className="text-xs text-graphite-400 py-2">暂无数据</p>
        )}
        {items && items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-stone-200 bg-stone-50/50 p-3">
            <div className="flex-1">
              {renderItem(item, i, (field, val) => onUpdate(i, field, val))}
            </div>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="mt-0.5 rounded p-1 text-graphite-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 各 Section 编辑器
// ============================================================

function SiteConfigEditor({ section, updateField, updateArrayItem, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-6">
      <h3 className="font-heading text-base font-semibold text-graphite-900">公司信息</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="公司全称" required><Input value={section.companyName} onChange={(v) => updateField('companyName', v)} /></Field>
        <Field label="品牌名" required><Input value={section.brandName} onChange={(v) => updateField('brandName', v)} /></Field>
        <Field label="英文全称"><Input value={section.nameEN} onChange={(v) => updateField('nameEN', v)} /></Field>
        <Field label="成立年份"><Input type="number" value={section.founded} onChange={(v) => updateField('founded', parseInt(v) || 0)} /></Field>
        <Field label="电话" required><Input value={section.phone} onChange={(v) => updateField('phone', v)} /></Field>
        <Field label="邮箱"><Input value={section.email} onChange={(v) => updateField('email', v)} /></Field>
      </div>

      <Field label="地址"><Input value={section.address} onChange={(v) => updateField('address', v)} /></Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slogan"><Input value={section.slogan} onChange={(v) => updateField('slogan', v)} /></Field>
        <Field label="Tagline 副标语"><Input value={section.tagline} onChange={(v) => updateField('tagline', v)} /></Field>
      </div>

      <Field label="首页描述"><Textarea value={section.heroDesc} onChange={(v) => updateField('heroDesc', v)} rows={2} /></Field>

      {/* Hero Images */}
      <HeroImagesManager
        images={section.heroImages || []}
        onUpdate={(images) => updateField('heroImages', images)}
      />

      {/* Footer QR Code */}
      <QrCodeManager
        url={section.footerQrImage || ''}
        onUpdate={(url) => updateField('footerQrImage', url)}
      />

      {/* Stats */}
      <ArrayEditor
        label="统计数据"
        items={section.stats}
        addTemplate={{ value: '', label: '', suffix: '' }}
        onAdd={(t) => addArrayItem('stats', t)}
        onRemove={(i) => removeArrayItem('stats', i)}
        onUpdate={(i, f, v) => updateArrayItem('stats', i, f, v)}
        renderItem={(item, i, onChange) => (
          <div className="grid gap-2 sm:grid-cols-3">
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" placeholder="数值 (如 30+)" value={item.value || ''} onChange={(e) => onChange('value', e.target.value)} />
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" placeholder="标签 (如 年行业积淀)" value={item.label || ''} onChange={(e) => onChange('label', e.target.value)} />
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" placeholder="补充说明" value={item.suffix || ''} onChange={(e) => onChange('suffix', e.target.value)} />
          </div>
        )}
      />

      {/* Achievements */}
      <ArrayEditor
        label="企业资质"
        items={section.achievements}
        addTemplate=""
        onAdd={(t) => addArrayItem('achievements', t)}
        onRemove={(i) => removeArrayItem('achievements', i)}
        onUpdate={(i, f, v) => updateArrayItem('achievements', i, f, v)}
        renderItem={(item, i, onChange) => (
          <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" placeholder="资质名称" value={item || ''} onChange={(e) => onChange(null, e.target.value)} />
        )}
      />
    </div>
  );
}

/** 首页轮播图片管理 */
function HeroImagesManager({ images, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { data, error } = await uploadHeroImage(file);
    setUploading(false);
    if (error) {
      alert('上传失败，请重试');
      return;
    }
    onUpdate([...images, data.url]);
  };

  const handleAddUrl = () => {
    const url = prompt('输入图片 URL（可直接粘贴 Supabase Storage 链接）：');
    if (url && url.trim()) {
      onUpdate([...images, url.trim()]);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-graphite-500">
          首页展示图片 <span className="text-graphite-300 font-normal">（建议竖版 4:5，留空则显示占位图）</span>
        </label>
        <div className="flex items-center gap-2">
          <label className={`inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium transition-colors ${
            uploading ? 'text-graphite-400 pointer-events-none' : 'text-sapphire-600 hover:text-sapphire-700'
          }`}>
            {uploading ? (
              <><Loader2 size={12} className="animate-spin" /> 上传中...</>
            ) : (
              <><Plus size={12} /> 上传图片</>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          <button
            type="button"
            onClick={handleAddUrl}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-graphite-500 hover:text-sapphire-600 transition-colors"
          >
            <Plus size={12} /> 添加URL
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 py-6 text-center">
          <ImageIcon size={24} className="mx-auto text-stone-300" />
          <p className="mt-2 text-xs text-graphite-400">暂无图片，上传或添加URL</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={i} className="group relative rounded-lg border border-stone-200 bg-stone-50 overflow-hidden">
              <img src={url} alt={`展示图 ${i + 1}`} className="h-24 w-full object-cover" />
              <button
                type="button"
                onClick={() => onUpdate(images.filter((_, j) => j !== i))}
                className="absolute top-1.5 right-1.5 rounded-full bg-black/40 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <Trash2 size={11} />
              </button>
              <span className="block px-2 py-1 text-[10px] text-graphite-400 truncate">{i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** 底部二维码管理 */
function QrCodeManager({ url, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { data, error } = await uploadHeroImage(file);
    setUploading(false);
    if (error) {
      alert('上传失败，请重试');
      return;
    }
    onUpdate(data.url);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-graphite-500">
          官方公众号二维码 <span className="text-graphite-300 font-normal">（底部展示）</span>
        </label>
        <div className="flex items-center gap-2">
          <label className={`inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium transition-colors ${
            uploading ? 'text-graphite-400 pointer-events-none' : 'text-sapphire-600 hover:text-sapphire-700'
          }`}>
            {uploading ? (
              <><Loader2 size={12} className="animate-spin" /> 上传中...</>
            ) : (
              <><Plus size={12} /> 上传图片</>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          {url && (
            <button
              type="button"
              onClick={() => onUpdate('')}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={12} /> 移除
            </button>
          )}
        </div>
      </div>

      {url ? (
        <div className="inline-block rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
          <img src={url} alt="公众号二维码" className="h-24 w-24 object-contain rounded-lg" />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 py-6 text-center">
          <ImageIcon size={24} className="mx-auto text-stone-300" />
          <p className="mt-2 text-xs text-graphite-400">暂无二维码，上传后底部自动显示</p>
        </div>
      )}
    </div>
  );
}

function AboutContentEditor({ section, updateField, updateArrayItem, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-6">
      <h3 className="font-heading text-base font-semibold text-graphite-900">关于我们</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="标题"><Input value={section.heading} onChange={(v) => updateField('heading', v)} /></Field>
        <Field label="副标题"><Input value={section.subtitle} onChange={(v) => updateField('subtitle', v)} /></Field>
      </div>

      <Field label="企业使命"><Textarea value={section.mission} onChange={(v) => updateField('mission', v)} rows={4} /></Field>
      <Field label="企业愿景"><Textarea value={section.vision} onChange={(v) => updateField('vision', v)} rows={2} /></Field>

      {/* History timeline */}
      <ArrayEditor
        label="发展历程"
        items={section.history}
        addTemplate={{ year: new Date().getFullYear(), title: '', desc: '' }}
        onAdd={(t) => addArrayItem('history', t)}
        onRemove={(i) => removeArrayItem('history', i)}
        onUpdate={(i, f, v) => updateArrayItem('history', i, f, v)}
        renderItem={(item, i, onChange) => (
          <div className="grid gap-2 sm:grid-cols-3">
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" type="number" placeholder="年份" value={item.year || ''} onChange={(e) => onChange('year', parseInt(e.target.value) || 0)} />
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs sm:col-span-2" placeholder="标题 (如 公司成立)" value={item.title || ''} onChange={(e) => onChange('title', e.target.value)} />
            <textarea className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs sm:col-span-3" rows={2} placeholder="描述" value={item.desc || ''} onChange={(e) => onChange('desc', e.target.value)} />
          </div>
        )}
      />
    </div>
  );
}

function ContactContentEditor({ section, updateField, updateArrayItem, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-6">
      <h3 className="font-heading text-base font-semibold text-graphite-900">联系我们</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="标题"><Input value={section.heading} onChange={(v) => updateField('heading', v)} /></Field>
        <Field label="副标题"><Input value={section.subtitle} onChange={(v) => updateField('subtitle', v)} /></Field>
      </div>

      {/* Contact items */}
      <ArrayEditor
        label="联系信息"
        items={section.contactItems}
        addTemplate={{ icon: 'Phone', label: '', value: '', href: '' }}
        onAdd={(t) => addArrayItem('contactItems', t)}
        onRemove={(i) => removeArrayItem('contactItems', i)}
        onUpdate={(i, f, v) => updateArrayItem('contactItems', i, f, v)}
        renderItem={(item, i, onChange) => (
          <div className="grid gap-2 sm:grid-cols-4">
            <select className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" value={item.icon || 'Phone'} onChange={(e) => onChange('icon', e.target.value)}>
              <option value="Phone">电话</option>
              <option value="Mail">邮箱</option>
              <option value="MapPin">地址</option>
              <option value="Globe">网站</option>
            </select>
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" placeholder="标签 (如 电话)" value={item.label || ''} onChange={(e) => onChange('label', e.target.value)} />
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs sm:col-span-2" placeholder="内容" value={item.value || ''} onChange={(e) => onChange('value', e.target.value)} />
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs sm:col-span-4" placeholder="链接 (可选, 如 tel:xxx)" value={item.href || ''} onChange={(e) => onChange('href', e.target.value)} />
          </div>
        )}
      />

      {/* Form field labels */}
      <div>
        <label className="mb-2 block text-xs font-medium text-graphite-500">表单字段标签</label>
        <div className="grid gap-3 sm:grid-cols-2">
          {section.formFields && Object.entries(section.formFields).map(([key, field]) => (
            <div key={key} className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50/50 p-2.5">
              <span className="text-[11px] font-mono text-graphite-400 w-16">{key}</span>
              <input className="flex-1 rounded border border-stone-200 px-2 py-1 text-xs" placeholder="标签" value={field?.label || ''} onChange={(e) => updateField(`formFields.${key}.label`, e.target.value)} />
              <input className="flex-1 rounded border border-stone-200 px-2 py-1 text-xs" placeholder="占位文字" value={field?.placeholder || ''} onChange={(e) => updateField(`formFields.${key}.placeholder`, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Product interests */}
      <ArrayEditor
        label="产品意向选项"
        items={section.productInterests}
        addTemplate=""
        onAdd={(t) => addArrayItem('productInterests', t)}
        onRemove={(i) => removeArrayItem('productInterests', i)}
        onUpdate={(i, f, v) => updateArrayItem('productInterests', i, f, v)}
        renderItem={(item, i, onChange) => (
          <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" placeholder="选项文字" value={item || ''} onChange={(e) => onChange(null, e.target.value)} />
        )}
      />
    </div>
  );
}

function FooterContentEditor({ section, updateField, updateArrayItem, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-6">
      <h3 className="font-heading text-base font-semibold text-graphite-900">底部信息</h3>

      <Field label="公司简介"><Textarea value={section.description} onChange={(v) => updateField('description', v)} rows={3} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="ICP 备案号"><Input value={section.icp} onChange={(v) => updateField('icp', v)} /></Field>
        <Field label="版权信息"><Input value={section.copyright} onChange={(v) => updateField('copyright', v)} placeholder="© 2025 公司名 版权所有" /></Field>
      </div>

      {/* Quick links */}
      <ArrayEditor
        label="快速导航链接"
        items={section.quickLinks}
        addTemplate={{ label: '', href: '#' }}
        onAdd={(t) => addArrayItem('quickLinks', t)}
        onRemove={(i) => removeArrayItem('quickLinks', i)}
        onUpdate={(i, f, v) => updateArrayItem('quickLinks', i, f, v)}
        renderItem={(item, i, onChange) => (
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" placeholder="链接文字" value={item.label || ''} onChange={(e) => onChange('label', e.target.value)} />
            <input className="w-full rounded border border-stone-200 px-2.5 py-1.5 text-xs" placeholder="锚点 (如 #about)" value={item.href || ''} onChange={(e) => onChange('href', e.target.value)} />
          </div>
        )}
      />
    </div>
  );
}
