import React, { useState } from 'react';
import { 
  Bell, 
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
import { NoticeItem } from '../types';
import { saveNotice, deleteNotice } from '../services/firestoreService';

interface AdminNoticesProps {
  notices: NoticeItem[];
}

export const AdminNotices: React.FC<AdminNoticesProps> = ({ notices }) => {
  const [editingItem, setEditingItem] = useState<Partial<NoticeItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      description: '',
      category: 'কার্যক্রম',
      date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      published: true,
      order: notices.length + 1
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim() || !editingItem.description?.trim()) return;

    setLoading(true);
    setMessage(null);
    try {
      await saveNotice(editingItem);
      setMessage({ success: true, text: 'নোটিশ সফলভাবে সংরক্ষিত হয়েছে!' });
      setEditingItem(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ success: false, text: err.message || 'সংরক্ষণ ব্যর্থ হয়েছে' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই নোটিশটি মুছে ফেলতে চান?')) return;
    try {
      await deleteNotice(id);
    } catch (err: any) {
      alert('মুছে ফেলা সম্ভব হয়নি: ' + err.message);
    }
  };

  const handleTogglePublish = async (item: NoticeItem) => {
    try {
      await saveNotice({ ...item, published: !item.published });
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#24252A] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#8F1537]" />
            <span>নোটিশ বোর্ড ব্যবস্থাপনা (Notices CMS)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            ফাউন্ডেশনের সাধারণ ও জরুরি নোটিশ তৈরি, সংশোধন, প্রকাশ বা গোপন করুন
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#8F1537] hover:bg-[#72102B] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোটিশ লিখুন</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-bold border ${
          message.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Notices Grid */}
      {notices.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-stone-300 text-center space-y-3">
          <Bell className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif text-base font-bold text-[#24252A]">এখনও কোনো নোটিশ তৈরি করা হয়নি</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            আসন্ন শীতবস্ত্র বিতরণ, ত্রাণ ক্যাম্পেইন বা যেকোনো কার্যক্রমের বার্তা প্রকাশের জন্য নোটিশ যোগ করুন।
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#8F1537] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>প্রথম নোটিশ তৈরি করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white p-6 rounded-2xl border transition-all ${
                notice.published ? 'border-stone-200 shadow-sm' : 'border-dashed border-stone-300 bg-stone-50/60 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#8F1537] text-white text-[11px] font-bold">
                    {notice.category || 'সাধারণ'}
                  </span>
                  {notice.date && (
                    <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {notice.date}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(notice)}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                      notice.published ? 'text-emerald-600 hover:bg-emerald-50' : 'text-stone-400 hover:bg-stone-200'
                    }`}
                    title={notice.published ? 'প্রকাশিত (ক্লিক করলে অপ্রকাশিত হবে)' : 'অপ্রকাশিত (ক্লিক করলে প্রকাশিত হবে)'}
                  >
                    {notice.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingItem(notice)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-[#8F1537] hover:bg-stone-100 cursor-pointer"
                    title="সম্পাদনা"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif text-base font-bold text-[#24252A] mb-2">{notice.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-4 whitespace-pre-wrap">{notice.description}</p>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-400">
                <span>অবস্থা: {notice.published ? <span className="text-emerald-600">প্রকাশিত</span> : <span className="text-amber-600">খসড়া (অপ্রকাশিত)</span>}</span>
                <span>সহৃদয় নোটিশ</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-[#24252A]">
                {editingItem.id ? 'নোটিশ সম্পাদনা করুন' : 'নতুন নোটিশ তৈরি করুন'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#24252A] mb-1">
                  নোটিশের শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="উদা: শীতবস্ত্র বিতরণ কর্মসূচি"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-[#24252A] focus:outline-hidden focus:border-[#8F1537]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24252A] mb-1">
                  বিস্তারিত বিবরণ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="শীতার্ত মানুষের পাশে দাঁড়াতে আমাদের পরবর্তী উদ্যোগের প্রস্তুতি চলছে..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-[#24252A] focus:outline-hidden focus:border-[#8F1537] leading-relaxed resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#24252A] mb-1">
                    ক্যাটাগরি
                  </label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="আসন্ন কার্যক্রম / জরুরি ঘোষণা"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-[#24252A] focus:outline-hidden focus:border-[#8F1537]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24252A] mb-1">
                    তারিখ
                  </label>
                  <input
                    type="text"
                    value={editingItem.date || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    placeholder="৩০ সেপ্টেম্বর ২০২৬"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-[#24252A] focus:outline-hidden focus:border-[#8F1537]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published_notice"
                  checked={editingItem.published ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  className="rounded text-[#8F1537] focus:ring-[#8F1537]"
                />
                <label htmlFor="published_notice" className="text-xs font-bold text-[#24252A] cursor-pointer">
                  হোমপেজে নোটিশ বোর্ডে প্রকাশ করুন (Published)
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
                  className="px-5 py-2 rounded-xl bg-[#8F1537] hover:bg-[#72102B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
