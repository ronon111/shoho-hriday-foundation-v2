import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ContactData } from '../types';
import { createPublicSubmission } from '../services/firestoreService';

interface ContactSectionProps {
  contact: ContactData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneOrEmail: '',
    subject: '',
    message: '',
    honeypot: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name.trim()) {
      setError('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }
    if (!formData.phoneOrEmail.trim()) {
      setError('অনুগ্রহ করে আপনার ফোন নম্বর অথবা ইমেইল দিন।');
      return;
    }
    if (!formData.message.trim()) {
      setError('অনুগ্রহ করে আপনার বার্তা লিখুন।');
      return;
    }

    setLoading(true);
    setError(null);

    const isEmail = formData.phoneOrEmail.includes('@');

    try {
      await createPublicSubmission({
        type: 'contact',
        name: formData.name,
        phone: !isEmail ? formData.phoneOrEmail : '',
        email: isEmail ? formData.phoneOrEmail : '',
        subject: formData.subject || 'সাধারণ যোগাযোগ',
        message: formData.message,
        honeypot: formData.honeypot
      });
      setSubmitted(true);
      setFormData({ name: '', phoneOrEmail: '', subject: '', message: '', honeypot: '' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-surface relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-burgundy font-semibold">যোগাযোগ</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold mt-2 mb-4">
            যোগাযোগ করুন
          </h2>
          <div className="w-12 h-0.5 bg-burgundy/40 mx-auto mb-4" />
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            সহৃদয় ফাউন্ডেশনের যেকোনো উদ্যোগ বা সহমর্মিতার বিষয়ে সরাসরি আমাদের সাথে কথা বলুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">ফোন নম্বর</p>
                  <div className="space-y-1">
                    <a 
                      href={`tel:${contact.phone1}`} 
                      className="block text-sm font-medium text-charcoal hover:text-burgundy transition-colors"
                    >
                      {contact.phone1}
                    </a>
                    {contact.phone2 && (
                      <a 
                        href={`tel:${contact.phone2}`} 
                        className="block text-sm font-medium text-charcoal hover:text-burgundy transition-colors"
                      >
                        {contact.phone2}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-stone-100">
                <div className="w-11 h-11 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">ইমেইল</p>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-sm font-medium text-charcoal hover:text-burgundy transition-colors break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-stone-100">
                <div className="w-11 h-11 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">ঠিকানা</p>
                  <p className="text-sm font-medium text-charcoal leading-relaxed">
                    {contact.address || 'ঢাকা, বাংলাদেশ'}
                  </p>
                </div>
              </div>

            </div>

            {/* Social Channels Card */}
            <div className="bg-burgundy/5 p-6 rounded-2xl border border-burgundy/15 space-y-3">
              <h3 className="text-sm font-bold text-burgundy">সামাজিক মাধ্যমে যুক্ত থাকুন</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                আমাদের প্রতিটি উদ্যোগের স্বচ্ছ আপডেট ও মানবিক কার্যক্রমের তথ্য পেতে ফেসবুক ও ইনস্টাগ্রামে আমাদের অনুসরণ করুন।
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {contact.facebook && (
                  <a 
                    href={contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-charcoal hover:text-burgundy hover:border-burgundy/30 transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    ফেসবুক পেজ
                  </a>
                )}
                {contact.instagram && (
                  <a 
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-charcoal hover:text-burgundy hover:border-burgundy/30 transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-current text-[#E4405F]" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    ইনস্টাগ্রাম
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-stone-200/80 shadow-xs">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-2">
                সরাসরি বার্তা পাঠান
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm mb-6 leading-relaxed">
                আপনার যেকোনো প্রশ্ন, পরামর্শ বা মতামত আমাদের জানান। আমরা দ্রুততম সময়ে আপনার সাথে যোগাযোগ করব।
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-charcoal">বার্তাটি সফলভাবে পৌঁছেছে</h4>
                  <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                    সহৃদয় ফাউন্ডেশনে আপনার বার্তা পাঠানোর জন্য আন্তরিক ধন্যবাদ। আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-burgundy text-white text-xs font-semibold hover:bg-burgundy-dark transition-colors cursor-pointer"
                  >
                    আরেকটি বার্তা পাঠান
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

                  {/* Honeypot field for anti-spam */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact_hp">Leave empty</label>
                    <input
                      id="contact_hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">
                      আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="আপনার নাম লিখুন"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1.5">
                        ফোন / ইমেইল <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ফোন নম্বর বা ইমেইল"
                        value={formData.phoneOrEmail}
                        onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1.5">
                        বিষয়
                      </label>
                      <input
                        type="text"
                        placeholder="বার্তার বিষয় (ঐচ্ছিক)"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">
                      বার্তা <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="আপনার বার্তা বা প্রশ্ন লিখুন..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          বার্তা পাঠানো হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          বার্তা পাঠান
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
