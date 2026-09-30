import React from 'react';
import { Users, HeartHandshake, UserPlus, ArrowRight } from 'lucide-react';

interface GetInvolvedSectionProps {
  onOpenVolunteer: () => void;
  onOpenSupport: () => void;
  onOpenMember: () => void;
}

export const GetInvolvedSection: React.FC<GetInvolvedSectionProps> = ({
  onOpenVolunteer,
  onOpenSupport,
  onOpenMember
}) => {
  return (
    <section id="involved" className="py-24 bg-white relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-burgundy font-semibold">অংশগ্রহণ</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold mt-2 mb-4">
            আপনিও হতে পারেন পরিবর্তনের অংশ
          </h2>
          <div className="w-12 h-0.5 bg-burgundy/40 mx-auto mb-4" />
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            আপনার সময়, দক্ষতা, সহযোগিতা কিংবা একটি ছোট উদ্যোগ—কোনোটিই ছোট নয়।
          </p>
        </div>

        {/* 3 Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Volunteer */}
          <div className="bg-surface rounded-2xl p-8 border border-stone-200/80 shadow-xs hover:border-burgundy/40 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center group-hover:bg-burgundy group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal">স্বেচ্ছাসেবক হোন</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                মাঠপর্যায়ে অসহায় মানুষের কাছে ত্রাণ বা সহায়তা পৌঁছে দিতে আপনার সময় ও শ্রম দিয়ে আমাদের পাশে দাঁড়ান।
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={onOpenVolunteer}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-burgundy text-charcoal hover:text-white border border-stone-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>স্বেচ্ছাসেবক হিসেবে যুক্ত হোন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Support */}
          <div className="bg-surface rounded-2xl p-8 border border-stone-200/80 shadow-xs hover:border-burgundy/40 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center group-hover:bg-burgundy group-hover:text-white transition-colors">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal">সহযোগিতা করুন</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                খাদ্যসামগ্রী, শীতবস্ত্র, শিক্ষাসামগ্রী বা লজিস্টিক সহায়তার মাধ্যমে মানবিক উদ্যোগে অংশীদার হোন।
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={onOpenSupport}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-burgundy text-charcoal hover:text-white border border-stone-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>সহযোগিতার প্রস্তাব পাঠান</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Member */}
          <div className="bg-surface rounded-2xl p-8 border border-stone-200/80 shadow-xs hover:border-burgundy/40 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center group-hover:bg-burgundy group-hover:text-white transition-colors">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal">সদস্য হোন</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                সহৃদয় ফাউন্ডেশনের দীর্ঘমেয়াদী লক্ষ্য বাস্তবায়নে সাধারণ বা সক্রিয় সদস্য হিসেবে আমাদের সাথে যুক্ত থাকুন।
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={onOpenMember}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-burgundy text-charcoal hover:text-white border border-stone-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>সদস্য হওয়ার আবেদন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
