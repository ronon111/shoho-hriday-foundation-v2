import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, HandHelping, Loader2 } from 'lucide-react';
import { createPublicSubmission } from '../services/firestoreService';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    phone: '',
    email: '',
    supportType: 'খাদ্য ও নিত্যপণ্য সহায়তা',
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
      setError('অনুগ্রহ করে নাম বা প্রতিষ্ঠানের নাম লিখুন।');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setError('অনুগ্রহ করে অন্তত একটি যোগাযোগ নম্বর বা ইমেইল দিন।');
      return;
    }
    if (!formData.message.trim()) {
      setError('কীভাবে সহযোগিতা করতে চান সে বিষয়ে সংক্ষেপে লিখুন।');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createPublicSubmission({
        type: 'support_request',
        name: formData.name,
        organization: formData.organization,
        phone: formData.phone,
        email: formData.email,
        supportType: formData.supportType,
        message: formData.message,
        honeypot: formData.honeypot
      });
      setSubmitted(true);
      setFormData({
        name: '',
        organization: '',
        phone: '',
        email: '',
        supportType: 'খাদ্য ও নিত্যপণ্য সহায়তা',
        message: '',
        honeypot: ''
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'অনুরোধ পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
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
              <HandHelping className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">সহযোগিতা ও যৌথ উদ্যোগ</h3>
              <p className="text-xs text-stone-500">আপনার সহমর্মিতা পৌঁছে যাক সুবিধাবঞ্চিত মানুষের কাছে</p>
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
              <h4 className="font-serif text-xl font-bold text-charcoal">তথ্য সফলভাবে গৃহীত হয়েছে</h4>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                আপনার সহযোগিতা ও সহমর্মিতার জন্য সহৃদয় ফাউন্ডেশনের পক্ষ থেকে কৃতজ্ঞতা। আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-burgundy text-white font-medium hover:bg-burgundy-dark transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                সহৃদয় ফাউন্ডেশন বর্তমানে কোনো অনলাইন পেমেন্ট গ্রহণ করে না। বস্তুগত সহায়তা, লজিস্টিক সাপোর্ট বা সরাসরি মানবিক উদ্যোগের সমন্বয়ের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="supp_hp">Keep blank</label>
                <input
                  id="supp_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  নাম / প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="আপনার নাম বা প্রতিষ্ঠানের নাম"
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

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  কীভাবে সহযোগিতা করতে চান
                </label>
                <select
                  value={formData.supportType}
                  onChange={(e) => setFormData({ ...formData, supportType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy bg-white transition-all"
                >
                  <option value="খাদ্য ও নিত্যপণ্য সামগ্রী সহায়তা">খাদ্য ও নিত্যপণ্য সামগ্রী সহায়তা</option>
                  <option value="শীতবস্ত্র ও কম্বল অনুদান">শীতবস্ত্র ও কম্বল অনুদান</option>
                  <option value="শিক্ষা উপকরণ ও বই বিতরণ">শিক্ষা উপকরণ ও বই বিতরণ</option>
                  <option value="চিকিৎসা সহায়তা ও ওষুধ সামগ্রী">চিকিৎসা সহায়তা ও ওষুধ সামগ্রী</option>
                  <option value="লজিস্টিক ও পরিবহন সহযোগিতা">লজিস্টিক ও পরিবহন সহযোগিতা</option>
                  <option value="প্রাতিষ্ঠানিক অংশীদারিত্ব / CSR">প্রাতিষ্ঠানিক অংশীদারিত্ব / CSR</option>
                  <option value="অন্যান্য মানবিক উদ্যোগ">অন্যান্য মানবিক উদ্যোগ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  বার্তা / বিস্তারিত প্রস্তাবনা <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="আপনার সহায়তার পরিকল্পনা বা প্রস্তাব সংক্ষেপে লিখুন..."
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
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    'যোগাযোগ করুন'
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
