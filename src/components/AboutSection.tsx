import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Sparkles, Heart, Target, Compass, X } from 'lucide-react';
import { AboutData } from '../types';

interface AboutSectionProps {
  about: AboutData;
  loading?: boolean;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    }
  }
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    }
  }
};

const cardFadeUp: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      delay: 0.15,
      ease: "easeOut",
    }
  }
};

export const AboutSection: React.FC<AboutSectionProps> = ({ about, loading = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="about" className="py-24 bg-white relative scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-7 space-y-6 animate-pulse">
              <div className="h-6 w-32 rounded-full bg-burgundy/10" />
              <div className="h-10 w-3/4 rounded-xl bg-stone-200" />
              <div className="w-12 h-1 bg-burgundy/30 rounded-full" />
              <div className="space-y-3 pt-1">
                <div className="h-4 w-full rounded bg-stone-200" />
                <div className="h-4 w-11/12 rounded bg-stone-200" />
                <div className="h-4 w-4/5 rounded bg-stone-200" />
              </div>
              <div className="pt-2">
                <div className="h-10 w-32 rounded-full bg-stone-200" />
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-5">
              <div className="relative p-8 sm:p-10 rounded-3xl bg-surface border border-stone-200/80 shadow-xs space-y-6 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-burgundy/20" />
                <div className="space-y-2">
                  <div className="h-3.5 w-24 rounded bg-stone-200" />
                  <div className="h-7 w-4/5 rounded bg-stone-200" />
                  <div className="h-7 w-2/3 rounded bg-stone-200" />
                </div>
                <div className="pt-2 border-t border-stone-200/60">
                  <div className="h-4 w-5/6 rounded bg-stone-200/70" />
                </div>
              </div>
            </div>
          </div>
        ) : (
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Text */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              variants={fadeUpItem}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>সহৃদয় সম্পর্কে</span>
            </motion.div>

            <motion.h2 
              variants={fadeUpItem}
              className="font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight"
            >
              {about.title || 'সহৃদয় সম্পর্কে'}
            </motion.h2>

            <motion.div variants={fadeUpItem} className="w-12 h-0.5 bg-burgundy/40" />

            <motion.p 
              variants={fadeUpItem}
              className="text-stone-600 text-base sm:text-lg leading-relaxed"
            >
              {about.description || 'সহৃদয় ফাউন্ডেশন মানুষের পাশে দাঁড়ানো, মানবিক সহায়তা প্রদান এবং সমাজে ইতিবাচক পরিবর্তনে অবদান রাখার লক্ষ্য নিয়ে কাজ করে। আমাদের বিশ্বাস—একটি ছোট সহায়তাও কারও জীবনে বড় পরিবর্তনের কারণ হতে পারে।'}
            </motion.p>

            <motion.div variants={fadeUpItem} className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-2.5 rounded-full border border-stone-300 hover:border-burgundy text-charcoal hover:text-burgundy text-xs font-semibold tracking-wide transition-all shadow-2xs hover:bg-burgundy/5 cursor-pointer"
              >
                আরও জানুন
              </button>
            </motion.div>
          </div>

          {/* Right Column: Visual Card */}
          <motion.div 
            variants={cardFadeUp}
            className="lg:col-span-5"
          >
            <div className="relative p-8 sm:p-10 rounded-3xl bg-surface border border-stone-200/80 shadow-xs space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-burgundy text-white flex items-center justify-center shadow-sm">
                <Heart className="w-6 h-6 fill-white" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-burgundy font-semibold">আমাদের বিশ্বাস</span>
                <p className="font-serif text-xl sm:text-2xl font-bold text-charcoal leading-snug">
                  &ldquo;মানবতার সেবায় প্রতিটি ভালো কাজই গুরুত্বপূর্ণ।&rdquo;
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed pt-2 border-t border-stone-200/60">
                কোনো বড় পরিসংখ্যান নয়, একজন মানুষের মুখে এক টুকরো হাসি ফোটানোই আমাদের আন্তরিক সাফল্য।
              </p>
            </div>
          </motion.div>

        </motion.div>
        )}
      </div>

      {/* Learn More Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-300">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2 text-burgundy font-bold">
                <Heart className="w-5 h-5 fill-burgundy" />
                <span className="font-serif text-lg">সহৃদয় দর্শন ও মূলনীতি</span>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 py-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-charcoal text-base mb-1">আমাদের মিশন</h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {about.mission || 'প্রয়োজনে মানুষের পাশে দাঁড়ানো এবং প্রয়োজনীয় সহায়তা পৌঁছে দেওয়া।'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-charcoal text-base mb-1">আমাদের ভিশন</h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {about.vision || 'একটি সহমর্মী সমাজ গড়ে তোলা যেখানে প্রতিটি মানুষ সম্মান ও পারস্পরিক সহযোগিতার সাথে বাঁচতে পারে।'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-charcoal text-base mb-1">আমাদের মূল্যবোধ</h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {about.values || 'মানবতা, সহমর্মিতা, পারস্পরিক শ্রদ্ধা, স্বচ্ছতা এবং নিঃস্বার্থ সেবা।'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
