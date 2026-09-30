import React, { useState, useEffect } from 'react';
import { Settings, Check, Loader2 } from 'lucide-react';
import { SiteSettings } from '../types';
import { updateSiteSettings } from '../services/firestoreService';

interface AdminSettingsProps {
  settings: SiteSettings;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings }) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await updateSiteSettings(formData);
      setMessage({ success: true, text: 'ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ success: false, text: err.message || 'সংরক্ষণ ব্যর্থ হয়েছে' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <h1 className="font-serif text-2xl font-bold text-charcoal flex items-center gap-2">
          <Settings className="w-6 h-6 text-burgundy" />
          <span>সাইট সেটিংস ও এসইও (Settings)</span>
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          ফাউন্ডেশনের নাম, ব্র্যান্ড কালার, ট্যাগলাইন এবং সার্চ ইঞ্জিন মেটাডাটা সম্পাদনা করুন
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                সংগঠনের নাম (বাংলা)
              </label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                সংগঠনের নাম (ইংরেজি)
              </label>
              <input
                type="text"
                required
                value={formData.englishName}
                onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              ট্যাগলাইন / মূল স্লোগান
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                প্রাথমিক ব্র্যান্ড কালার
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor || '#8F1537'}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-stone-200"
                />
                <input
                  type="text"
                  value={formData.primaryColor || '#8F1537'}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                ফুটার কপিরাইট টেক্সট
              </label>
              <input
                type="text"
                value={formData.footerText}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-4">
            <h3 className="font-serif text-sm font-bold text-charcoal">সার্চ ইঞ্জিন অপটিমাইজেশন (SEO)</h3>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                SEO টাইটেল (Page Title)
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                SEO মেটা ডেসক্রিপশন
              </label>
              <textarea
                rows={2}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy leading-relaxed resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>সেটিংস সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
