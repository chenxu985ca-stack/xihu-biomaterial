import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Save, X, LogOut, ImageIcon,
  AlertCircle, CheckCircle, Loader2, Package, Newspaper, ChevronRight,
  Shield, Settings, Mail, MailOpen, Phone, Building2, Clock,
  ArrowUp, ArrowDown
} from 'lucide-react';
import SettingsManager from './SettingsManager';
import {
  getCategories, getAllCategories, createCategory, updateCategory, deleteCategory,
  getAllProductsByCategory, createProduct, updateProduct, deleteProduct,
  getAllNews, createNews, updateNews, deleteNews,
  adminLogout, getAdminSession, uploadImage,
  getContactSubmissions, markSubmissionRead, deleteSubmission,
  swapProductOrder, swapNewsOrder,
} from '../lib/db';

// ============================================================
// 辅助组件
// ============================================================

/** 模态框 */
function Modal({ title, children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-20 pb-10 px-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-stone-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 className="font-heading text-base font-semibold text-graphite-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-graphite-400 hover:bg-stone-100 hover:text-graphite-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/** 确认删除对话框 */
function ConfirmDelete({ message, onConfirm, onCancel }) {
  return (
    <Modal title="确认删除" onClose={onCancel}>
      <p className="text-sm text-graphite-600 mb-5">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="btn-outline px-5 py-2 text-sm">取消</button>
        <button onClick={onConfirm} className="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors">
          确认删除
        </button>
      </div>
    </Modal>
  );
}

/** Toast 通知 */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-lg animate-scale-in ${
      type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-600'
    }`}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// ============================================================
// 图片上传按钮
// ============================================================

function ImageUpload({ currentUrl, onUploaded, bucket = 'products' }) {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProcessing(true);
    // Switch to "uploading" phase after normalization (~300ms)
    const phaseTimer = setTimeout(() => setProcessing(false), 400);
    const { data, error } = await uploadImage(file, bucket);
    clearTimeout(phaseTimer);
    setProcessing(false);
    setUploading(false);
    if (error) {
      alert('图片上传失败，请重试');
      return;
    }
    setPreview(data.url);
    onUploaded(data.url);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-graphite-500">上传图片</label>
      {preview ? (
        <div className="relative mb-2 overflow-hidden rounded-lg border border-stone-200">
          <img src={preview} alt="预览" className="h-36 w-full object-cover" />
          <button
            type="button"
            onClick={() => { setPreview(''); onUploaded(''); }}
            className="absolute right-2 top-2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="mb-2 flex h-36 items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50">
          <div className="text-center">
            <ImageIcon size={24} className="mx-auto text-stone-300" />
            <span className="mt-1 block text-xs text-stone-400">暂无图片</span>
          </div>
        </div>
      )}
      <label className={`inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors ${
        uploading ? 'text-graphite-400 pointer-events-none' : 'text-sapphire-600 hover:text-sapphire-700'
      }`}>
        {uploading ? (
          <><Loader2 size={12} className="animate-spin" /> {processing ? '处理中...' : '上传中...'}</>
        ) : (
          <>📎 {preview ? '更换图片' : '上传图片'}</>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
    </div>
  );
}

// ============================================================
// 分类管理（模态框内）
// ============================================================

const CATEGORY_ICONS = ['Circle', 'Droplets', 'Target', 'Wrench', 'Package'];

function CategoriesManager({ categories, onChanged, onClose }) {
  const [editingCat, setEditingCat] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteCat, setShowDeleteCat] = useState(null);
  const [catForm, setCatForm] = useState({
    name: '', name_en: '', slug: '', description: '', icon: 'Package', sort_order: 0
  });

  const openNewCat = () => {
    setEditingCat(null);
    setShowForm(true);
    setCatForm({ name: '', name_en: '', slug: '', description: '', icon: 'Package', sort_order: categories.length + 1 });
  };

  const openEditCat = (c) => {
    setEditingCat(c);
    setShowForm(true);
    setCatForm({
      name: c.name, name_en: c.name_en || '', slug: c.slug, description: c.description || '',
      icon: c.icon || 'Package', sort_order: c.sort_order || 0
    });
  };

  const handleSaveCat = async () => {
    if (!catForm.name.trim() || !catForm.slug.trim()) return;
    if (editingCat) {
      await updateCategory(editingCat.id, catForm);
    } else {
      await createCategory(catForm);
    }
    setEditingCat(null);
    setShowForm(false);
    onChanged();
  };

  const handleDeleteCat = async () => {
    if (!showDeleteCat) return;
    await deleteCategory(showDeleteCat.id);
    setShowDeleteCat(null);
    onChanged();
  };

  const toggleCatActive = async (c) => {
    await updateCategory(c.id, { is_active: !c.is_active });
    onChanged();
  };

  // 根据 name 自动生成 slug
  const handleNameChange = (name) => {
    const slug = name.replace(/[^\w一-鿿]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'category';
    setCatForm((f) => ({ ...f, name, ...(editingCat ? {} : { slug: slug || 'category' }) }));
  };

  return (
    <div className="space-y-5">
      {showDeleteCat && (
        <ConfirmDelete
          message={`确定要删除分类「${showDeleteCat.name}」吗？该分类下的所有产品也会被删除。`}
          onConfirm={handleDeleteCat}
          onCancel={() => setShowDeleteCat(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-graphite-400">共 {categories.length} 个分类</p>
        <button
          onClick={openNewCat}
          className="inline-flex items-center gap-1.5 rounded-lg bg-graphite-900 px-4 py-2 text-xs font-medium text-white hover:bg-graphite-800 transition-colors"
        >
          <Plus size={14} /> 新增分类
        </button>
      </div>

      {/* Category list */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {categories.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={32} className="mx-auto text-stone-300" />
            <p className="mt-3 text-sm text-graphite-400">暂无分类</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400">分类名称</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden sm:table-cell">slug</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden md:table-cell">排序</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden md:table-cell">状态</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-technical text-graphite-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {categories.map((c) => (
                <tr key={c.id} className={`hover:bg-stone-50/50 transition-colors ${!c.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3">
                    <span className="text-sm font-medium text-graphite-900">{c.name}</span>
                    {c.description && (
                      <p className="mt-0.5 text-xs text-graphite-400 line-clamp-1">{c.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-graphite-400 font-mono hidden sm:table-cell">{c.slug}</td>
                  <td className="px-5 py-3 text-sm text-graphite-400 hidden md:table-cell">{c.sort_order}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <button
                      onClick={() => toggleCatActive(c)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        c.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-graphite-400'
                      }`}
                    >
                      {c.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                      {c.is_active ? '显示' : '隐藏'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditCat(c)}
                        className="rounded-lg p-2 text-graphite-400 hover:bg-stone-100 hover:text-graphite-600 transition-colors"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => setShowDeleteCat(c)}
                        className="rounded-lg p-2 text-graphite-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit category form (inline at bottom) */}
      {(showForm) && (
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <h4 className="mb-4 text-sm font-semibold text-graphite-900">
            {editingCat ? '编辑分类' : '新增分类'}
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-graphite-500">分类名称 <span className="text-sapphire-500">*</span></label>
                <input
                  value={catForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="例：正畸托槽"
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-graphite-500">英文名</label>
                <input
                  value={catForm.name_en}
                  onChange={(e) => setCatForm((f) => ({ ...f, name_en: e.target.value }))}
                  placeholder="例：Orthodontic Brackets"
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-graphite-500">Slug <span className="text-sapphire-500">*</span></label>
                <input
                  value={catForm.slug}
                  onChange={(e) => setCatForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="brackets"
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-graphite-500">图标</label>
                <select
                  value={catForm.icon}
                  onChange={(e) => setCatForm((f) => ({ ...f, icon: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
                >
                  {CATEGORY_ICONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-graphite-500">描述</label>
              <textarea
                value={catForm.description}
                onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="简要描述该分类..."
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400 resize-none"
              />
            </div>
            <div className="w-32">
              <label className="mb-1.5 block text-xs font-medium text-graphite-500">排序</label>
              <input
                type="number"
                value={catForm.sort_order}
                onChange={(e) => setCatForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { setEditingCat(null); setShowForm(false); setCatForm({ name: '', name_en: '', slug: '', description: '', icon: 'Package', sort_order: 0 }); }}
                className="btn-outline px-5 py-2 text-sm"
              >
                取消
              </button>
              <button onClick={handleSaveCat} className="btn-primary px-5 py-2 text-sm">
                <Save size={14} /> {editingCat ? '保存' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 产品管理页面
// ============================================================

function ProductsManager() {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // 正在编辑的产品
  const [showDelete, setShowDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [showCatManager, setShowCatManager] = useState(false);

  const [form, setForm] = useState({
    name: '', description: '', content: '', highlight: '', image_url: '', sort_order: 0
  });

  // 加载分类
  const loadCategories = useCallback(async () => {
    const { data } = await getAllCategories();
    setCategories(data || []);
    // 如果当前选中的分类被删除或不存在了，选第一个
    if (data?.length && (!activeCat || !data.find((c) => c.id === activeCat))) {
      setActiveCat(data[0].id);
    }
  }, [activeCat]);

  // 加载产品
  const loadProducts = useCallback(async () => {
    if (!activeCat) return;
    setLoading(true);
    const { data } = await getAllProductsByCategory(activeCat);
    setProducts(data || []);
    setLoading(false);
  }, [activeCat]);

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', description: '', content: '', highlight: '', image_url: '', sort_order: products.length + 1 });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || '', content: p.content || '', highlight: p.highlight || '',
      image_url: p.image_url || '', sort_order: p.sort_order || 0
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (editing) {
      await updateProduct(editing.id, form);
    } else {
      await createProduct({ ...form, category_id: activeCat });
    }
    setShowModal(false);
    loadProducts();
    setToast({ message: editing ? '产品已更新' : '产品已创建' });
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    await deleteProduct(showDelete.id);
    setShowDelete(null);
    loadProducts();
    setToast({ message: '产品已删除' });
  };

  const toggleActive = async (p) => {
    await updateProduct(p.id, { is_active: !p.is_active });
    loadProducts();
  };

  const moveProduct = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= products.length) return;
    await swapProductOrder(
      products[index].id, products[index].sort_order,
      products[targetIndex].id, products[targetIndex].sort_order,
    );
    loadProducts();
  };

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {showDelete && (
        <ConfirmDelete
          message={`确定要删除产品「${showDelete.name}」吗？此操作不可恢复。`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(null)}
        />
      )}

      {/* 分类管理模态框 */}
      {showCatManager && (
        <Modal title="管理分类" onClose={() => setShowCatManager(false)}>
          <CategoriesManager
            categories={categories}
            onChanged={() => { loadCategories(); }}
            onClose={() => setShowCatManager(false)}
          />
        </Modal>
      )}

      {/* 分类标签 */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeCat === cat.id
                ? 'bg-sapphire text-white shadow-sm'
                : 'bg-stone-100 text-graphite-500 hover:bg-stone-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
        <button
          onClick={() => setShowCatManager(true)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-stone-300 px-4 py-1.5 text-xs font-medium text-graphite-400 hover:border-sapphire-300 hover:text-sapphire-500 transition-colors"
        >
          <Settings size={12} /> 管理分类
        </button>
        <button
          onClick={openNew}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-graphite-900 px-4 py-2 text-xs font-medium text-white hover:bg-graphite-800 transition-colors"
        >
          <Plus size={14} /> 新增产品
        </button>
      </div>

      {/* 产品列表 */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-graphite-300" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={32} className="mx-auto text-stone-300" />
            <p className="mt-3 text-sm text-graphite-400">该分类下暂无产品</p>
            <button onClick={openNew} className="mt-3 text-sm font-medium text-sapphire-600 hover:text-sapphire-500">
              添加第一个产品 →
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400">产品</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden sm:table-cell">标签</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden md:table-cell">状态</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-technical text-graphite-400 w-16">排序</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-technical text-graphite-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {products.map((p, i) => (
                <tr key={p.id} className={`hover:bg-stone-50/50 transition-colors ${!p.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="h-9 w-9 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 flex-shrink-0">
                          <ImageIcon size={14} className="text-stone-300" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-graphite-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {p.highlight ? (
                      <span className="rounded-full bg-sapphire-50 px-2 py-0.5 text-[11px] font-medium text-sapphire-600">
                        {p.highlight}
                      </span>
                    ) : (
                      <span className="text-xs text-graphite-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        p.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-graphite-400'
                      }`}
                    >
                      {p.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                      {p.is_active ? '显示' : '隐藏'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => moveProduct(i, -1)}
                        disabled={i === 0}
                        className="rounded p-1 text-graphite-400 hover:bg-stone-100 hover:text-graphite-600 disabled:opacity-20 disabled:cursor-default transition-colors"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => moveProduct(i, 1)}
                        disabled={i === products.length - 1}
                        className="rounded p-1 text-graphite-400 hover:bg-stone-100 hover:text-graphite-600 disabled:opacity-20 disabled:cursor-default transition-colors"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded-lg p-2 text-graphite-400 hover:bg-stone-100 hover:text-graphite-600 transition-colors"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => setShowDelete(p)}
                        className="rounded-lg p-2 text-graphite-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 新增/编辑模态框 */}
      {showModal && (
        <Modal title={editing ? '编辑产品' : '新增产品'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <ImageUpload
              currentUrl={form.image_url}
              onUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-graphite-500">产品名称 <span className="text-sapphire-500">*</span></label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="例：卓越Ⅵ代自锁托槽"
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-graphite-500">产品描述</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="简要描述产品特点..."
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400 resize-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-graphite-500">产品内容</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={5}
                placeholder="详细内容，支持 参数名：参数值 格式自动生成参数表..."
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-graphite-500">标签</label>
                <select
                  value={form.highlight}
                  onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
                >
                  <option value="">无标签</option>
                  <option value="新一代">新一代</option>
                  <option value="明星产品">明星产品</option>
                  <option value="经典款">经典款</option>
                  <option value="临床首选">临床首选</option>
                  <option value="自研">自研</option>
                  <option value="产学研">产学研</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-graphite-500">排序</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="btn-outline px-5 py-2 text-sm">取消</button>
              <button onClick={handleSave} className="btn-primary px-5 py-2 text-sm">
                <Save size={14} /> {editing ? '保存' : '创建'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// 新闻管理页面
// ============================================================

function NewsManager() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    title: '', summary: '', tag: '动态', sort_order: 0, publish_date: '', image_url: ''
  });

  const loadNews = useCallback(async () => {
    setLoading(true);
    const { data } = await getAllNews();
    setNews(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);

  const openNew = () => {
    setEditing(null);
    setForm({
      title: '', summary: '', tag: '动态', sort_order: news.length,
      publish_date: new Date().toISOString().slice(0, 10), image_url: ''
    });
    setShowModal(true);
  };

  const openEdit = (n) => {
    setEditing(n);
    setForm({
      title: n.title, summary: n.summary || '', tag: n.tag || '动态',
      sort_order: n.sort_order || 0,
      publish_date: n.publish_date || '', image_url: n.image_url || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.summary.trim()) return;
    if (editing) {
      await updateNews(editing.id, form);
    } else {
      await createNews(form);
    }
    setShowModal(false);
    loadNews();
    setToast({ message: editing ? '新闻已更新' : '新闻已创建' });
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    await deleteNews(showDelete.id);
    setShowDelete(null);
    loadNews();
    setToast({ message: '新闻已删除' });
  };

  const toggleActive = async (n) => {
    await updateNews(n.id, { is_active: !n.is_active });
    loadNews();
  };

  const moveNews = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= news.length) return;
    await swapNewsOrder(
      news[index].id, news[index].sort_order,
      news[targetIndex].id, news[targetIndex].sort_order,
    );
    loadNews();
  };

  const tagColors = {
    '展会': 'bg-cyan-50 text-cyan-600',
    '新品': 'bg-amber-50 text-amber-600',
    '荣誉': 'bg-yellow-50 text-yellow-600',
    '动态': 'bg-stone-100 text-graphite-500',
  };

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {showDelete && (
        <ConfirmDelete
          message={`确定要删除新闻「${showDelete.title}」吗？此操作不可恢复。`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-graphite-400">共 {news.length} 条新闻</p>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-lg bg-graphite-900 px-4 py-2 text-xs font-medium text-white hover:bg-graphite-800 transition-colors"
        >
          <Plus size={14} /> 新增新闻
        </button>
      </div>

      {/* 新闻列表 */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-graphite-300" />
          </div>
        ) : news.length === 0 ? (
          <div className="py-16 text-center">
            <Newspaper size={32} className="mx-auto text-stone-300" />
            <p className="mt-3 text-sm text-graphite-400">暂无新闻</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400">标题</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden sm:table-cell">标签</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden md:table-cell">日期</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden md:table-cell">状态</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-technical text-graphite-400 w-16">排序</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-technical text-graphite-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {news.map((n, i) => (
                <tr key={n.id} className={`hover:bg-stone-50/50 transition-colors ${!n.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3">
                    <span className="text-sm font-medium text-graphite-900 line-clamp-1">{n.title}</span>
                    {n.summary && (
                      <p className="mt-0.5 text-xs text-graphite-400 line-clamp-1">{n.summary}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tagColors[n.tag] || tagColors['动态']}`}>
                      {n.tag}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-graphite-400 hidden md:table-cell">
                    {n.publish_date || '—'}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <button
                      onClick={() => toggleActive(n)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        n.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-graphite-400'
                      }`}
                    >
                      {n.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                      {n.is_active ? '显示' : '隐藏'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => moveNews(i, -1)}
                        disabled={i === 0}
                        className="rounded p-1 text-graphite-400 hover:bg-stone-100 hover:text-graphite-600 disabled:opacity-20 disabled:cursor-default transition-colors"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => moveNews(i, 1)}
                        disabled={i === news.length - 1}
                        className="rounded p-1 text-graphite-400 hover:bg-stone-100 hover:text-graphite-600 disabled:opacity-20 disabled:cursor-default transition-colors"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(n)}
                        className="rounded-lg p-2 text-graphite-400 hover:bg-stone-100 hover:text-graphite-600 transition-colors"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => setShowDelete(n)}
                        className="rounded-lg p-2 text-graphite-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 新增/编辑模态框 */}
      {showModal && (
        <Modal title={editing ? '编辑新闻' : '新增新闻'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-graphite-500">标题 <span className="text-sapphire-500">*</span></label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="新闻标题"
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-graphite-500">摘要 <span className="text-sapphire-500">*</span></label>
              <textarea
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                rows={3}
                placeholder="新闻摘要..."
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-graphite-500">标签</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
                >
                  <option value="展会">展会</option>
                  <option value="新品">新品</option>
                  <option value="荣誉">荣誉</option>
                  <option value="动态">动态</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-graphite-500">日期</label>
                <input
                  type="date"
                  value={form.publish_date}
                  onChange={(e) => setForm((f) => ({ ...f, publish_date: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400"
                />
              </div>
            </div>
            <ImageUpload
              bucket="news"
              currentUrl={form.image_url}
              onUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="btn-outline px-5 py-2 text-sm">取消</button>
              <button onClick={handleSave} className="btn-primary px-5 py-2 text-sm">
                <Save size={14} /> {editing ? '保存' : '创建'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// 询盘管理页面
// ============================================================

function ContactSubmissionsManager() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    const { data } = await getContactSubmissions();
    setSubmissions(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadSubmissions(); }, [loadSubmissions]);

  const toggleRead = async (s) => {
    await markSubmissionRead(s.id, !s.read);
    loadSubmissions();
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    await deleteSubmission(showDelete.id);
    setShowDelete(null);
    setExpanded(null);
    loadSubmissions();
    setToast({ message: '询盘已删除' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
      ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {showDelete && (
        <ConfirmDelete
          message={`确定要删除这条询盘吗？此操作不可恢复。`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-graphite-400">
            共 {submissions.length} 条询盘
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-sapphire-50 px-2 py-0.5 text-[11px] font-semibold text-sapphire-600">
                {unreadCount} 条未读
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Submissions list */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-graphite-300" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center">
            <Mail size={32} className="mx-auto text-stone-300" />
            <p className="mt-3 text-sm text-graphite-400">暂无询盘</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 w-8" />
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400">客户信息</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden md:table-cell">留言</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-technical text-graphite-400 hidden lg:table-cell">时间</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-technical text-graphite-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {submissions.map((s) => (
                <tr key={s.id} className={`group hover:bg-stone-50/50 transition-colors cursor-pointer ${!s.read ? 'bg-sapphire-50/30' : ''}`}>
                  <td className="px-5 py-3.5" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                    {s.read ? (
                      <MailOpen size={15} className="text-stone-300" />
                    ) : (
                      <div className="relative">
                        <Mail size={15} className="text-sapphire-500" />
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-sapphire-500" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                    <div>
                      <span className={`text-sm font-medium ${!s.read ? 'text-graphite-900' : 'text-graphite-600'}`}>
                        {s.name}
                      </span>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        {s.company && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-graphite-400">
                            <Building2 size={10} /> {s.company}
                          </span>
                        )}
                        {s.phone && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-graphite-400">
                            <Phone size={10} /> {s.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                    <p className="text-xs text-graphite-500 line-clamp-2 max-w-xs">{s.message}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                    <span className="inline-flex items-center gap-1 text-xs text-graphite-400">
                      <Clock size={11} />
                      {formatDate(s.created_at)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleRead(s)}
                        className="rounded-lg p-2 text-graphite-400 hover:bg-stone-100 hover:text-graphite-600 transition-colors"
                        title={s.read ? '标记未读' : '标记已读'}
                      >
                        {s.read ? <MailOpen size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        onClick={() => setShowDelete(s)}
                        className="rounded-lg p-2 text-graphite-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Expanded message detail */}
      {expanded && (() => {
        const s = submissions.find((sub) => sub.id === expanded);
        if (!s) return null;
        return (
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-heading text-base font-semibold text-graphite-900">{s.name}</h4>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {s.company && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-graphite-500">
                      <Building2 size={13} /> {s.company}
                    </span>
                  )}
                  {s.phone && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-graphite-500">
                      <Phone size={13} /> {s.phone}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm text-graphite-400">
                    <Clock size={13} /> {formatDate(s.created_at)}
                  </span>
                </div>
              </div>
              <button onClick={() => setExpanded(null)} className="p-1 text-graphite-400 hover:text-graphite-600">
                <X size={16} />
              </button>
            </div>
            <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-4">
              <p className="text-sm leading-relaxed text-graphite-700 whitespace-pre-wrap">{s.message}</p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => toggleRead(s)}
                className="btn-outline px-4 py-2 text-xs"
              >
                {s.read ? <><Mail size={12} /> 标记未读</> : <><MailOpen size={12} /> 标记已读</>}
              </button>
              <button
                onClick={() => setShowDelete(s)}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} /> 删除
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ============================================================
// 管理后台主面板
// ============================================================

export default function AdminDashboard({ role = 'editor', onLogout }) {
  const [tab, setTab] = useState('products');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await adminLogout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-graphite-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite-900 text-white">
                <Shield size={14} />
              </div>
              <span className="font-heading text-sm font-bold text-graphite-900">西湖巴尔 CMS</span>
            </div>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setTab('products')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  tab === 'products'
                    ? 'bg-graphite-900 text-white'
                    : 'text-graphite-500 hover:bg-stone-100'
                }`}
              >
                <Package size={13} /> 产品管理
              </button>
              <button
                onClick={() => setTab('news')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  tab === 'news'
                    ? 'bg-graphite-900 text-white'
                    : 'text-graphite-500 hover:bg-stone-100'
                }`}
              >
                <Newspaper size={13} /> 新闻管理
              </button>
              <button
                onClick={() => setTab('inquiries')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  tab === 'inquiries'
                    ? 'bg-graphite-900 text-white'
                    : 'text-graphite-500 hover:bg-stone-100'
                }`}
              >
                <Mail size={13} /> 询盘管理
              </button>
              {role === 'admin' && (
                <button
                  onClick={() => setTab('settings')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    tab === 'settings'
                      ? 'bg-graphite-900 text-white'
                      : 'text-graphite-500 hover:bg-stone-100'
                  }`}
                >
                  <Settings size={13} /> 网站设置
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`${import.meta.env.BASE_URL}index.html`}
              target="_blank"
              className="text-xs text-graphite-400 hover:text-sapphire-600 transition-colors"
            >
              查看网站 <ChevronRight size={12} className="inline" />
            </a>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-graphite-500 hover:bg-stone-50 hover:text-graphite-700 transition-colors"
            >
              <LogOut size={12} />
              {loggingOut ? '退出中...' : '退出'}
            </button>
          </div>
        </div>
      </header>

      {/* Content area */}
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {tab === 'products' || (tab === 'settings' && role !== 'admin') ? (
            <ProductsManager />
          ) : tab === 'news' ? (
            <NewsManager />
          ) : tab === 'inquiries' ? (
            <ContactSubmissionsManager />
          ) : (
            <SettingsManager />
          )}
      </div>
    </div>
  );
}
