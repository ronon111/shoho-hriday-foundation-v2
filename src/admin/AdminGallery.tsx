import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  Loader2,
  Calendar,
  Tag
} from 'lucide-react';
import { GalleryItem } from '../types';
import { saveGalleryItem, deleteGalleryItem } from '../services/firestoreService';

interface AdminGalleryProps {
  galleryItems: GalleryItem[];
}

export const AdminGallery: React.FC<AdminGalleryProps> = ({ galleryItems }) => {
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleOpenAdd = () => {
    setEditingItem({
      imageUrl: '',
      title: '',
      caption: '',
      category: 'খাদ্য ও ত্রাণ',
      date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      published: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.imageUrl?.trim() || !editingItem.title?.trim()) return;

    setLoading(true);
    setMessage(null);
    try {
      await saveGalleryItem(editingItem);
      setMessage({ success: true, text: 'গ্যালারির ছবি সফলভাবে সংরক্ষিত হয়েছে!' });
      setEditingItem(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ success: false, text: err.message || 'সংরক্ষণ ব্যর্থ হয়েছে' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ছবিটি মুছে ফেলতে চান?')) return;
    try {
      await deleteGalleryItem(id);
    } catch (err: any) {
      alert('মুছে ফেলা সম্ভব হয়নি: ' + err.message);
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    try {
      await saveGalleryItem({ ...item, published: !item.published });
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
            <ImageIcon className="w-6 h-6 text-burgundy" />
            <span>গ্যালারি ব্যবস্থাপনা (Gallery CMS)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            ফাউন্ডেশনের বাস্তব মানবিক কাজের ছবি ও ক্যাপশন যুক্ত করুন (Image URL ব্যবহার করে)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ছবি যোগ করুন</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-medium border ${
          message.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Gallery Grid */}
      {galleryItems.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-stone-300 text-center space-y-3">
          <ImageIcon className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif text-base font-bold text-charcoal">গ্যালারিতে এখনও কোনো ছবি যুক্ত করা হয়নি</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            বাস্তব কার্যক্রম পরিচালনার পর যেকোনো হোস্টেড ইমেজ ইউআরএল (যেমন Cloudinary, Imgur ইত্যাদি) দিয়ে ছবি যুক্ত করুন।
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-burgundy text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>প্রথম ছবি যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden border transition-all ${
                item.published ? 'border-stone-200 shadow-xs' : 'border-dashed border-stone-300 opacity-70'
              }`}
            >
              <div className="relative aspect-4/3 bg-stone-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback visual if URL invalid
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600';
                  }}
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/85 p-1 rounded-lg">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className="p-1 text-white hover:text-amber-300"
                    title={item.published ? 'প্রকাশিত' : 'অপ্রকাশিত'}
                  >
                    {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1 text-white hover:text-burgundy-light"
                    title="সম্পাদনা"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-white hover:text-red-400"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-semibold text-burgundy bg-burgundy/10 px-2 py-0.5 rounded-full">
                    {item.category || 'সাধারণ'}
                  </span>
                  <span>{item.date || '—'}</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-charcoal">{item.title}</h4>
                {item.caption && (
                  <p className="text-xs text-stone-600 line-clamp-2">{item.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Gallery Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                {editingItem.id ? 'ছবির তথ্য সম্পাদনা করুন' : 'নতুন ছবি যোগ করুন'}
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
                  ছবি সরাসরি URL (Image URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={editingItem.imageUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="https://example.com/activity-photo.jpg"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  ছবির শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="উদা: শীতবস্ত্র বিতরণ ক্যাম্পেইন"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    ক্যাটাগরি
                  </label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="খাদ্য / শীতবস্ত্র / চিকিৎসা"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    তারিখ / সময়
                  </label>
                  <input
                    type="text"
                    value={editingItem.date || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    placeholder="উদা: জানুয়ারি ২০২৬"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  ক্যাপশন বা বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  placeholder="ছবি সম্পর্কিত সংক্ষিপ্ত তথ্য..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published_gal"
                  checked={editingItem.published ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  className="rounded text-burgundy focus:ring-burgundy"
                />
                <label htmlFor="published_gal" className="text-xs font-medium text-charcoal cursor-pointer">
                  গ্যালারিতে প্রদর্শন করুন (Published)
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
