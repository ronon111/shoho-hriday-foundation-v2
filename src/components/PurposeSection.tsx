import React from 'react';
import { HeartHandshake, ShieldCheck, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../data/content';

export const PurposeSection: React.FC = () => {
  const icons = [HeartHandshake, ShieldCheck, Heart];

  return (
    <section id="purpose" className="py-20 sm:py-28 bg-[#FAF8F3] border-t border-[#E8E3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8F1537] tracking-wider uppercase mb-2">
            <span className="w-5 h-[1.5px] bg-[#8F1537]" />
            <span>মূল উদ্দেশ্য</span>
            <span className="w-5 h-[1.5px] bg-[#8F1537]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#24252A] tracking-tight [text-wrap:balance]">
            আমাদের লক্ষ্য
          </h2>
          <p className="mt-3 text-base text-[#777777]">
            যে তিনটি মৌলিক মূল্যবোধকে সামনে রেখে সহৃদয় ফাউন্ডেশনের প্রতিটি উদ্যোগ পরিচালিত হয়
          </p>
        </div>

        {/* 3 Purpose Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SITE_CONFIG.purposeList.map((item, index) => {
            const Icon = icons[index] || HeartHandshake;
            return (
              <div
                key={item.number}
                className="group relative bg-white rounded-2xl p-8 border border-[#E8E3DA] shadow-xs hover:shadow-md hover:border-[#8F1537]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Numbering & Line Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-english font-bold text-2xl text-[#8F1537]/30 group-hover:text-[#8F1537] transition-colors">
                      {item.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#FAF8F3] group-hover:bg-[#8F1537]/10 flex items-center justify-center text-[#8F1537] transition-colors border border-[#E8E3DA]">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#24252A] mb-3 group-hover:text-[#8F1537] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-[#24252A]/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subtle Bottom Accent Indicator */}
                <div className="mt-8 pt-4 border-t border-[#E8E3DA]/60 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8F1537]/40 group-hover:bg-[#8F1537] transition-colors" />
                  <span className="text-xs text-[#777777]">সহৃদয় ফাউন্ডেশন স্তম্ভ</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
