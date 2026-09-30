import React from 'react';
import { Heart, ArrowRight, ShieldCheck, Users, HandHeart } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
  onOpenJoin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onOpenJoin }) => {
  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 bg-[#FAF8F3] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Foundation Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8F1537] text-white text-xs font-bold tracking-wide shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
            <span>{settings.englishName || 'SHOHO RIDAY FOUNDATION'}</span>
            <span className="w-1 h-1 rounded-full bg-white/60" />
            <span>একটি মানবিক উদ্যোগ</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#24252A] tracking-tight leading-[1.18]">
            মানুষের পাশে,<br />
            <span className="text-[#8F1537]">মানবতার পথে।</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-[#24252A] text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {settings.tagline 
              ? `সহমর্মিতা, মানবিকতা ও সামাজিক দায়িত্ববোধ থেকে মানুষের পাশে থাকার একটি ছোট্ট প্রয়াস—${settings.siteName}।`
              : 'সহমর্মিতা, মানবিকতা ও সামাজিক দায়িত্ববোধ থেকে মানুষের পাশে থাকার একটি ছোট্ট প্রয়াস—সহৃদয় ফাউন্ডেশন।'
            }
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#activities"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#8F1537] hover:bg-[#72102B] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>আমাদের কার্যক্রম</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            <button
              onClick={onOpenJoin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 text-[#24252A] border-2 border-[#8F1537] font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <HandHeart className="w-4 h-4 text-[#8F1537]" />
              <span>আমাদের সাথে যুক্ত হোন</span>
            </button>
          </div>

          {/* Value pillars */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-stone-300">
            <div className="flex items-center justify-center gap-2 text-[#24252A] font-bold text-xs sm:text-sm">
              <Heart className="w-4 h-4 text-[#8F1537] fill-[#8F1537]" />
              <span>Humanity</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#24252A] font-bold text-xs sm:text-sm">
              <HandHeart className="w-4 h-4 text-[#8F1537]" />
              <span>Compassion</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#24252A] font-bold text-xs sm:text-sm">
              <Users className="w-4 h-4 text-[#8F1537]" />
              <span>Community</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#24252A] font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 text-[#8F1537]" />
              <span>Action</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
