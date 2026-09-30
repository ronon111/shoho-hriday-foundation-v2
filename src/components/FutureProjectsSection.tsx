import React from 'react';
import { 
  Calendar, 
  BookOpen, 
  Wind, 
  Activity, 
  Droplet, 
  ShieldAlert, 
  Users, 
  Sparkles 
} from 'lucide-react';
import { InitiativeItem } from '../types';

interface FutureProjectsSectionProps {
  initiatives: InitiativeItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Droplet: <Droplet className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />
};

export const FutureProjectsSection: React.FC<FutureProjectsSectionProps> = ({ initiatives }) => {
  return (
    <section id="initiatives" className="py-24 bg-surface relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>ভবিষ্যৎ পরিকল্পনা</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold mb-4">
            আগামীর পরিকল্পনা
          </h2>
          <div className="w-12 h-0.5 bg-burgundy/40 mx-auto mb-4" />
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            মানুষের বহুমুখী প্রয়োজনে টেকসই পাশে থাকার জন্য আমাদের পরিকল্পিত ভবিষ্যৎ উদ্যোগসমূহ।
          </p>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:border-burgundy/30 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center group-hover:bg-burgundy group-hover:text-white transition-colors">
                  {iconMap[item.icon] || <Sparkles className="w-5 h-5" />}
                </div>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                  {item.status || 'পরিকল্পিত উদ্যোগ'}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-2 group-hover:text-burgundy transition-colors">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>প্রস্তুতি পর্যায়</span>
                <span>সহৃদয় ফাউন্ডেশন</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
