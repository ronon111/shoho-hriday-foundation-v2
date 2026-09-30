import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, HeartHandshake, Loader2 } from 'lucide-react';
import { createPublicSubmission } from '../services/firestoreService';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    interest: 'খাদ্য ও শীতবস্ত্র বিতরণ',
    experience: '',
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
      setError('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setError('অনুগ্রহ করে আপনার ফোন নম্বর অথবা ইমেইল দিন।');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createPublicSubmission({
        type: 'volunteer_application',
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        interest: formData.interest,
        experience: formData.experience,
        message: formData.message || `আগ্রহী ক্ষেত্র: ${formData.interest}। অবস্থান: ${formData.location || 'উল্লেখ নেই'}`,
        honeypot: formData.honeypot
      });
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        interest: 'খাদ্য ও শীতবস্ত্র বিতরণ',
        experience: '',
        message: '',
        honeypot: ''
      });
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
              <HeartHandshake className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">স্বেচ্ছাসেবক হোন</h3>
              <p className="text-xs text-stone-500">মানুষের পাশে দাঁড়াতে আপনার হাত বাড়িয়ে দিন</p>
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
              <h4 className="font-serif text-xl font-bold text-charcoal">স্বেচ্ছাসেবক নিবন্ধন সম্পন্ন</h4>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                আপনার আগ্রহের জন্য আন্তরিক ধন্যবাদ। সহৃদয় ফাউন্ডেশনের পরবর্তী কার্যক্রমে আপনাকে পাশে পেতে আমাদের টিম যোগাযোগ করবে।
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
                <label htmlFor="vol_hp">Leave empty</label>
                <input
                  id="vol_hp"
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
                  placeholder="আপনার নাম"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">
                    ফোন <span className="text-red-500">*</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">
                    এলাকা / লোকেশন
                  </label>
                  <input
                    type="text"
                    placeholder="উদা: মিরপুর, ঢাকা"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">
                    কোন ধরনের কার্যক্রমে আগ্রহী
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy bg-white transition-all"
                  >
                    <option value="খাদ্য ও শীতবস্ত্র বিতরণ">খাদ্য ও শীতবস্ত্র বিতরণ</option>
                    <option value="শিক্ষা ও শিশু কল্যাণ">শিক্ষা ও শিশু কল্যাণ</option>
                    <option value="জরুরি স্বাস্থ্য ও রক্তদান">জরুরি স্বাস্থ্য ও রক্তদান</option>
                    <option value="দুর্যোগকালীন উদ্ধার ও ত্রাণ">দুর্যোগকালীন উদ্ধার ও ত্রাণ</option>
                    <option value="ডিজিটাল ও সাংগঠনিক কাজ">ডিজিটাল ও সাংগঠনিক কাজ</option>
                    <option value="যেকোনো সামাজিক প্রয়াসে">যেকোনো সামাজিক প্রয়াসে</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  পূর্ব অভিজ্ঞতা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="পূর্বের কোনো স্বেচ্ছাসেবী কাজের অভিজ্ঞতা থাকলে লিখুন"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  বার্তা / অতিরিক্ত তথ্য (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="আপনার সুবিধাজনক সময় বা অন্য কোনো বক্তব্য..."
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
                    'স্বেচ্ছাসেবক হিসেবে যুক্ত হোন'
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
