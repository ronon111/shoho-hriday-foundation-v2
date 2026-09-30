import React from 'react';
import { SITE_CONFIG } from '../data/content';
import { Quote } from 'lucide-react';

export const HumanityQuote: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 bg-[#8F1537] text-white overflow-hidden">
      {/* Subtle organic watermark heart motif */}
      <div className="absolute -bottom-20 -right-20 opacity-10 pointer-events-none select-none">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="#FFFFFF">
          <path d="M50 90C47.8 87.8 14 59.2 14 34.2C14 20.8 24.8 10 38.2 10C44.6 10 50.8 12.8 55 17.6C59.2 12.8 65.4 10 71.8 10C85.2 10 96 20.8 96 34.2C96 59.2 62.2 87.8 50 90Z" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-8 text-white/90">
          <Quote className="w-6 h-6 stroke-[1.8]" />
        </div>

        <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug sm:leading-relaxed max-w-4xl mx-auto [text-wrap:balance]">
          &ldquo;{SITE_CONFIG.humanityQuote}&rdquo;
        </blockquote>

        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="w-16 h-[1px] bg-white/30 mb-4" />
          <p className="text-sm font-medium text-white/90">
            {SITE_CONFIG.brandNameBn}
          </p>
          <p className="font-english text-[11px] tracking-widest text-white/70 uppercase mt-0.5">
            {SITE_CONFIG.brandNameEn}
          </p>
        </div>
      </div>
    </section>
  );
};
