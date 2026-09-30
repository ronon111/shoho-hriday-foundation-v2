import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

interface AdminLoginProps {
  onBackToSite: () => void;
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite, onLoginSuccess }) => {
  const { login, resetPassword, authError, clearError } = useAuth();
  const [email, setEmail] = useState('majedhossain3000@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('majedhossain3000@gmail.com');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      setLocalError('অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড দুটিই লিখুন।');
      return;
    }

    setLoading(true);
    setLocalError(null);
    clearError();

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error("Login failed:", err);
      // AuthContext handles error message
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setResetLoading(true);
    setLocalError(null);
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setResetLoading(false);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      
      {/* Back to site button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-burgundy transition-colors px-3 py-2 rounded-xl bg-white border border-stone-200 shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>মূল ওয়েবসাইটে ফিরে যান</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block bg-white p-3 rounded-2xl shadow-xs border border-stone-200/80 mb-4">
          <Logo size="md" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-charcoal">
          প্রশাসনিক লগইন
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          সহৃদয় ফাউন্ডেশন সিকিউর ম্যানেজমেন্ট পোর্টাল
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg rounded-3xl border border-stone-200">
          
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              এই পোর্টালটি শুধুমাত্র অনুমোদিত প্রশাসকের জন্য সংরক্ষিত। সর্বজনীন সাধারণ দর্শনার্থীদের লগইন করার প্রয়োজন নেই।
            </p>
          </div>

          {displayedError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{displayedError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                অ্যাডমিন ইমেইল
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy"
                  placeholder="majedhossain3000@gmail.com"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal">
                  পাসওয়ার্ড
                </label>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(true); setResetSent(false); }}
                  className="text-xs font-semibold text-burgundy hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    লগইন হচ্ছে...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-300 space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal">
              পাসওয়ার্ড রিসেট
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              আপনার অনুমোদিত ইমেইল ঠিকানায় একটি পাসওয়ার্ড রিসেট লিংক পাঠানো হবে।
            </p>

            {resetSent ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ইমেইল পাঠানো হয়েছে!</span>
                </div>
                <p>আপনার ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করে পাসওয়ার্ড পরিবর্তন করে নিন।</p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-3 w-full py-2 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition-colors"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    ইমেইল ঠিকানা
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {resetLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>রিসেট লিংক পাঠান</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
