import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  Loader2 
} from 'lucide-react';
import { InitiativeItem } from '../types';
import { saveInitiative, deleteInitiative } from '../services/firestoreService';

interface AdminInitiativesProps {
  initiatives: InitiativeItem[];
}

const availableIcons = [
  'BookOpen',
  'Wind',
  'Activity',
  'Droplet',
  'ShieldAlert',
  'Users',
  'Sparkles'
];

export const AdminInitiatives: React.FC<AdminInitiativesProps> = ({ initiatives }) => {
  const [editingItem, setEditingItem] = useState<Partial<InitiativeItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      description: '',
      icon: 'Sparkles',
      status: 'পরিকল্পিত উদ্যোগ',
      order: initiatives.length + 1,
      published: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim()) return;

    setLoading(true);
    setMessage(null);
    try {
      await saveInitiative(editingItem);
      setMessage({ success: true, text: 'ভবিষ্যৎ পরিকল্পনা সফলভাবে সংরক্ষিত হয়েছে!' });
      setEditingItem(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ success: false, text: err.message || 'সংরক্ষণ ব্যর্থ হয়েছে' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই পরিকল্পনাটি মুছে ফেলতে চান?')) return;
    try {
      await deleteInitiative(id);
    } catch (err: any) {
      alert('মুছে ফেলা সম্ভব হয়নি: ' + err.message);
    }
  };

  const handleTogglePublish = async (item: InitiativeItem) => {
    try {
      await saveInitiative({ ...item, published: !item.published });
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-burgundy" />
            <span>আগামীর পরিকল্পনা ব্যবস্থাপনা (Initiatives)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            ফাউন্ডেশনের ভবিষ্যৎ ও পরিকল্পিত মানবিক উদ্যোগসমূহ পরিচালনা করুন
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পরিকল্পনা যোগ করুন</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-medium border ${
          message.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initiatives.map((item) => (
          <div
            key={item.id}
            className={`bg-white p-5 rounded-2xl border transition-all ${
              item.published ? 'border-stone-200 shadow-xs' : 'border-dashed border-stone-300 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                {item.status || 'পরিকল্পিত উদ্যোগ'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTogglePublish(item)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                  title={item.published ? 'প্রকাশিত' : 'অপ্রকাশিত'}
                >
                  {item.published ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-1 text-stone-500 hover:text-burgundy"
                  title="সম্পাদনা"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-stone-400 hover:text-red-600"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="font-serif text-base font-bold text-charcoal mb-2">{item.title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">{item.description}</p>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>আইকন: {item.icon}</span>
              <span>ক্রম: #{item.order}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                {editingItem.id ? 'পরিকল্পনা সম্পাদনা করুন' : 'নতুন পরিকল্পনা যোগ করুন'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="উদা: শীতকালীন উষ্ণতা ক্যাম্পেইন"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  পরিকল্পনার সংক্ষিপ্ত রূপরেখা <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="কী ধরণের উদ্যোগ নেওয়ার প্রস্তুতি চলছে..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    স্ট্যাটাস লেবেল
                  </label>
                  <input
                    type="text"
                    value={editingItem.status || 'পরিকল্পিত উদ্যোগ'}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    আইকন
                  </label>
                  <select
                    value={editingItem.icon || 'Sparkles'}
                    onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-hidden focus:border-burgundy"
                  >
                    {availableIcons.map((ico) => (
                      <option key={ico} value={ico}>{ico}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  ক্রমিক নম্বর (Order)
                </label>
                <input
                  type="number"
                  value={editingItem.order ?? 1}
                  onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value, 10) || 1 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published_ini"
                  checked={editingItem.published ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  className="rounded text-burgundy focus:ring-burgundy"
                />
                <label htmlFor="published_ini" className="text-xs font-medium text-charcoal cursor-pointer">
                  ওয়েবসাইটে প্রদর্শন করুন (Published)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
