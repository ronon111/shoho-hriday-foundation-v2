import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2,
  Utensils, 
  HeartHandshake, 
  GraduationCap, 
  Stethoscope, 
  Droplets, 
  Sparkles,
  BookOpen,
  Wind,
  Activity as ActivityIcon,
  Users
} from 'lucide-react';
import { ActivityItem } from '../types';
import { saveActivity, deleteActivity } from '../services/firestoreService';

interface AdminActivitiesProps {
  activities: ActivityItem[];
}

const availableIcons = [
  'Utensils',
  'HeartHandshake',
  'GraduationCap',
  'Stethoscope',
  'Droplets',
  'Sparkles',
  'BookOpen',
  'Wind',
  'Activity',
  'Users'
];

export const AdminActivities: React.FC<AdminActivitiesProps> = ({ activities }) => {
  const [editingItem, setEditingItem] = useState<Partial<ActivityItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      description: '',
      icon: 'Sparkles',
      imageUrl: '',
      order: activities.length + 1,
      published: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim()) return;

    setLoading(true);
    setMessage(null);
    try {
      await saveActivity(editingItem);
      setMessage({ success: true, text: 'কার্যক্রম সফলভাবে সংরক্ষিত হয়েছে!' });
      setEditingItem(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ success: false, text: err.message || 'সংরক্ষণ ব্যর্থ হয়েছে' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই কার্যক্রমটি মুছে ফেলতে চান?')) return;
    try {
      await deleteActivity(id);
    } catch (err: any) {
      alert('মুছে ফেলা সম্ভব হয়নি: ' + err.message);
    }
  };

  const handleTogglePublish = async (item: ActivityItem) => {
    try {
      await saveActivity({ ...item, published: !item.published });
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
            <Layers className="w-6 h-6 text-burgundy" />
            <span>কার্যক্রম ব্যবস্থাপনা (Activities)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            ফাউন্ডেশনের মূল কার্যক্রম ক্ষেত্রসমূহ যুক্ত, সংশোধন বা পুনঃসাজান
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কার্যক্রম যোগ করুন</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-medium border ${
          message.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className={`bg-white p-5 rounded-2xl border transition-all ${
              act.published ? 'border-stone-200 shadow-xs' : 'border-dashed border-stone-300 bg-stone-50/50 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-burgundy-50 text-burgundy font-serif font-bold text-xs flex items-center justify-center">
                  {act.order}
                </span>
                <h3 className="font-serif text-base font-bold text-charcoal">{act.title}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTogglePublish(act)}
                  className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                    act.published ? 'text-emerald-600 hover:bg-emerald-50' : 'text-stone-400 hover:bg-stone-200'
                  }`}
                  title={act.published ? 'প্রকাশিত (ক্লিক করলে অপ্রকাশিত হবে)' : 'অপ্রকাশিত (ক্লিক করলে প্রকাশিত হবে)'}
                >
                  {act.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditingItem(act)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-burgundy hover:bg-stone-100 cursor-pointer"
                  title="সম্পাদনা"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(act.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-3">
              {act.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-3 border-t border-stone-100">
              <span>আইকন: {act.icon}</span>
              <span className={act.published ? 'text-emerald-600 font-semibold' : 'text-stone-400'}>
                {act.published ? '● প্রকাশিত' : '○ অপ্রকাশিত'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Activity Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                {editingItem.id ? 'কার্যক্রম সম্পাদনা করুন' : 'নতুন কার্যক্রম যোগ করুন'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  কার্যক্রমের শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="উদা: খাদ্য সহায়তা"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  বিবরণ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="কার্যক্রমের আওতা ও সহায়তার বিস্তারিত বর্ণনা..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    আইকন নির্বাচন করুন
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  ছবি URL (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={editingItem.imageUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published_act"
                  checked={editingItem.published ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  className="rounded text-burgundy focus:ring-burgundy"
                />
                <label htmlFor="published_act" className="text-xs font-medium text-charcoal cursor-pointer">
                  পাবলিক ওয়েবসাইটে প্রদর্শন করুন (Published)
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
