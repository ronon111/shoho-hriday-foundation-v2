import React, { useState, useEffect } from 'react';
import { PhoneCall, Check, Loader2, ExternalLink } from 'lucide-react';
import { ContactData } from '../types';
import { updateContactContent } from '../services/firestoreService';

interface AdminContactProps {
  contact: ContactData;
}

export const AdminContact: React.FC<AdminContactProps> = ({ contact }) => {
  const [formData, setFormData] = useState<ContactData>(contact);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    setFormData(contact);
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await updateContactContent(formData);
      setMessage({ success: true, text: 'যোগাযোগ ও সোশ্যাল মিডিয়ার তথ্য সফলভাবে হালনাগাদ করা হয়েছে!' });
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
          <PhoneCall className="w-6 h-6 text-burgundy" />
          <span>যোগাযোগ ও সোশ্যাল মিডিয়া সেটিংস</span>
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          ফোন নম্বর, অফিসিয়াল ইমেইল ও সোশ্যাল প্রোফাইল লিংক হালনাগাদ করুন
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
                প্রাথমিক ফোন নম্বর (Phone 1) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                placeholder="+8801301557701"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                দ্বিতীয় ফোন নম্বর (Phone 2)
              </label>
              <input
                type="text"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                placeholder="+8801334403339"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                অফিসিয়াল ইমেইল <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="shohoridayfoundation@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                অফিস / সাংগঠনিক ঠিকানা
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="ঢাকা, বাংলাদেশ"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-4">
            <h3 className="font-serif text-sm font-bold text-charcoal">সোশ্যাল মিডিয়া লিংক</h3>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal">
                  ফেসবুক পেজ URL
                </label>
                {formData.facebook && (
                  <a 
                    href={formData.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>লিংক পরীক্ষা করুন</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://www.facebook.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal">
                  ইনস্টাগ্রাম প্রোফাইল URL
                </label>
                {formData.instagram && (
                  <a 
                    href={formData.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] text-pink-600 hover:underline flex items-center gap-1"
                  >
                    <span>লিংক পরীক্ষা করুন</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://www.instagram.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                ইউটিউব চ্যানেল URL (ঐচ্ছিক)
              </label>
              <input
                type="url"
                value={formData.youtube || ''}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="https://www.youtube.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>যোগাযোগ তথ্য সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
