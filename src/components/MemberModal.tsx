import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Heart, Loader2 } from 'lucide-react';
import { createPublicSubmission } from '../services/firestoreService';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: '',
    honeypot: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name.trim()) {
      setError('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setError('অনুগ্রহ করে আপনার ফোন নম্বর অথবা ইমেইল দিন।');
      return;
    }
    if (!formData.message.trim()) {
      setError('কেন সদস্য হতে চান সে সম্পর্কে সংক্ষেপে লিখুন।');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createPublicSubmission({
        type: 'member_application',
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        message: formData.message,
        honeypot: formData.honeypot
      });
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', address: '', message: '', honeypot: '' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 transition-opacity animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-stone-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-burgundy-50 text-burgundy flex items-center justify-center">
              <Heart className="w-5 h-5 fill-burgundy text-burgundy" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">সদস্য হোন</h3>
              <p className="text-xs text-stone-500">সহৃদয় পরিবারের সদস্য হিসেবে মানবতায় যুক্ত হন</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-charcoal">আবেদন সফল হয়েছে</h4>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                আপনার আবেদন সফলভাবে জমা হয়েছে। সহৃদয় ফাউন্ডেশনের পক্ষ থেকে প্রয়োজন অনুযায়ী আপনার সাথে যোগাযোগ করা হবে।
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-burgundy text-white font-medium hover:bg-burgundy-dark transition-colors"
              >
                ধন্যবাদ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot field (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="member_hp">Do not fill this</label>
                <input
                  id="member_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="আপনার সম্পূর্ণ নাম"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">
                    ফোন নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  বর্তমান ঠিকানা / জেলা
                </label>
                <input
                  type="text"
                  placeholder="আপনার বর্তমান বসবাসের এলাকা বা জেলা"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  কেন সহৃদয় ফাউন্ডেশনের সদস্য হতে চান? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="আপনার অনুভূতি ও আগ্রহ সম্পর্কে সংক্ষেপে লিখুন..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      জমা দেওয়া হচ্ছে...
                    </>
                  ) : (
                    'সদস্য হওয়ার আবেদন করুন'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
