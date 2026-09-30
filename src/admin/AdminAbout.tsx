import React, { useState, useEffect } from 'react';
import { Info, Check, Loader2 } from 'lucide-react';
import { AboutData } from '../types';
import { updateAboutContent } from '../services/firestoreService';

interface AdminAboutProps {
  about: AboutData;
}

export const AdminAbout: React.FC<AdminAboutProps> = ({ about }) => {
  const [formData, setFormData] = useState<AboutData>(about);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    setFormData(about);
  }, [about]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await updateAboutContent(formData);
      setMessage({ success: true, text: 'পরিচিতি সংক্রান্ত তথ্য সফলভাবে হালনাগাদ করা হয়েছে!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ success: false, text: err.message || 'হালনাগাদ ব্যর্থ হয়েছে' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <h1 className="font-serif text-2xl font-bold text-charcoal flex items-center gap-2">
          <Info className="w-6 h-6 text-burgundy" />
          <span>পরিচিতি ব্যবস্থাপনা (About CMS)</span>
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          সহৃদয় ফাউন্ডেশনের মূল পরিচিতি, দর্শন, মিশন, ভিশন ও মূল্যবোধ সম্পাদনা করুন
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-medium border ${
          message.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              সেকশন শিরোনাম
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              মূল পরিচিতি বক্তব্য
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy leading-relaxed"
            ></textarea>
            <p className="text-[11px] text-stone-400 mt-1">
              সতর্কবার্তা: কোনো মনগড়া পরিসংখ্যান বা কাল্পনিক সাফল্যের দাবি যুক্ত করবেন না।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                আমাদের মিশন (Mission)
              </label>
              <textarea
                rows={3}
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                আমাদের ভিশন (Vision)
              </label>
              <textarea
                rows={3}
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy leading-relaxed"
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              আমাদের মূল্যবোধ (Values)
            </label>
            <textarea
              rows={2}
              value={formData.values}
              onChange={(e) => setFormData({ ...formData, values: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy leading-relaxed"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
