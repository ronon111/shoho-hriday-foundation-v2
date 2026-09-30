import React from 'react';
import { Bell, Calendar, Tag, AlertCircle, Sparkles } from 'lucide-react';
import { NoticeItem } from '../types';

interface NoticeSectionProps {
  notices: NoticeItem[];
  loading?: boolean;
}

export const NoticeSection: React.FC<NoticeSectionProps> = ({ notices, loading = false }) => {
  // Only published notices are displayed publicly
  const activeNotices = notices.filter(n => n.published !== false);

  return (
    <section id="notices" className="py-20 bg-white border-b border-stone-300 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8F1537] text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Bell className="w-3.5 h-3.5 fill-white text-white" />
            <span>সর্বশেষ ঘোষণা ও আপডেট</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#24252A] font-bold tracking-tight mb-3">
            নোটিশ বোর্ড
          </h2>
          <div className="w-12 h-1 bg-[#8F1537] mx-auto mb-4 rounded-full" />
          <p className="text-stone-700 text-sm sm:text-base font-semibold leading-relaxed">
            সহৃদয় ফাউন্ডেশনের সর্বশেষ ঘোষণা ও কার্যক্রম
          </p>
        </div>

        {/* Notice List or Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-[#FAF8F3] rounded-2xl p-6 sm:p-7 border-2 border-stone-200/90 shadow-xs flex flex-col justify-between h-[230px] animate-pulse"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200">
                    <div className="h-6 w-20 rounded-md bg-stone-200" />
                    <div className="h-4 w-24 rounded bg-stone-200" />
                  </div>
                  <div className="h-5 w-4/5 rounded bg-stone-200 mb-3" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded bg-stone-200/70" />
                    <div className="h-3.5 w-4/5 rounded bg-stone-200/70" />
                  </div>
                </div>
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-stone-200/50" />
                  <div className="h-4 w-16 rounded bg-stone-200/50" />
                </div>
              </div>
            ))}
          </div>
        ) : activeNotices.length === 0 ? (
          <div className="max-w-xl mx-auto bg-[#FAF8F3] rounded-2xl p-10 text-center border-2 border-stone-300 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-[#8F1537]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#24252A]">
              এই মুহূর্তে কোনো নতুন নোটিশ নেই।
            </h3>
            <p className="text-stone-700 text-xs sm:text-sm font-medium">
              পরবর্তী কার্যক্রম ও সহায়তামূলক ক্যাম্পেইনের নোটিশ এখানে প্রকাশিত হবে। আমাদের সাথে সংযুক্ত থাকুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {activeNotices.map((notice, idx) => (
              <div
                key={notice.id}
                className="bg-[#FAF8F3] rounded-2xl p-6 sm:p-7 border-2 border-stone-300 shadow-sm hover:shadow-md hover:border-[#8F1537] transition-all flex flex-col justify-between relative group"
              >
                {/* Notice Top: Category and Date */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-300">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#8F1537] text-white text-xs font-bold shadow-xs">
                      <Tag className="w-3 h-3" />
                      <span>{notice.category || 'ঘোষণা'}</span>
                    </span>

                    {notice.date && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24252A]">
                        <Calendar className="w-3.5 h-3.5 text-[#8F1537]" />
                        <span>{notice.date}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#24252A] group-hover:text-[#8F1537] transition-colors leading-snug mb-3">
                    {notice.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#24252A] text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-wrap">
                    {notice.description}
                  </p>
                </div>

                {/* Footer status line */}
                <div className="mt-6 pt-3 border-t border-stone-300 flex items-center justify-between text-xs font-bold text-stone-600">
                  <span className="flex items-center gap-1.5 text-[#8F1537]">
                    <Sparkles className="w-3.5 h-3.5 fill-[#8F1537]" />
                    <span>সহৃদয় বার্তা</span>
                  </span>
                  <span>নোটিশ #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
