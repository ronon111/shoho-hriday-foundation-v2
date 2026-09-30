import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Utensils, 
  HeartHandshake, 
  GraduationCap, 
  Stethoscope, 
  Droplets, 
  Sparkles, 
  X, 
  ArrowRight,
  BookOpen,
  Wind,
  Activity as ActivityIcon,
  Users
} from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivitiesSectionProps {
  activities: ActivityItem[];
  onOpenJoin: () => void;
  loading?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-6 h-6" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Stethoscope: <Stethoscope className="w-6 h-6" />,
  Droplets: <Droplets className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Wind: <Wind className="w-6 h-6" />,
  Activity: <ActivityIcon className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    }
  }
};

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities, onOpenJoin, loading = false }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || <Sparkles className="w-6 h-6" />;
  };

  return (
    <section id="activities" className="py-24 bg-surface relative scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-burgundy font-semibold">আমাদের উদ্যোগ</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold mt-2 mb-4">
            আমরা যা করি
          </h2>
          <div className="w-12 h-0.5 bg-burgundy/40 mx-auto mb-4" />
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            মানুষের প্রয়োজনের পাশে থাকার জন্য আমাদের বিভিন্ন মানবিক ও সামাজিক উদ্যোগ।
          </p>
        </motion.div>

        {/* Activities Grid or Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between h-[280px] animate-pulse"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-stone-200" />
                    <div className="h-4 w-6 rounded bg-stone-200" />
                  </div>
                  <div className="h-6 w-3/4 rounded bg-stone-200 mb-3" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded bg-stone-200/70" />
                    <div className="h-3.5 w-5/6 rounded bg-stone-200/70" />
                    <div className="h-3.5 w-2/3 rounded bg-stone-200/70" />
                  </div>
                </div>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-stone-200" />
                  <div className="h-4 w-20 rounded-full bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center group-hover:bg-burgundy group-hover:text-white transition-colors duration-300">
                    {getIcon(activity.icon)}
                  </div>
                  <span className="font-serif text-xs font-bold text-stone-300 group-hover:text-burgundy/40 transition-colors">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-charcoal mb-3 group-hover:text-burgundy transition-colors">
                  {activity.title}
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                  {activity.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedActivity(activity)}
                  className="text-xs font-semibold text-burgundy flex items-center gap-1.5 hover:gap-2.5 transition-all cursor-pointer"
                >
                  <span>বিস্তারিত জানুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-100">
                  কার্যক্রমের ক্ষেত্র
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}

      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-300">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-burgundy-50 text-burgundy flex items-center justify-center">
                  {getIcon(selectedActivity.icon)}
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-burgundy font-bold">কার্যক্রম বিবরণ</span>
                  <h3 className="font-serif text-xl font-bold text-charcoal">{selectedActivity.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <p className="text-stone-700 text-sm leading-relaxed">
                {selectedActivity.description}
              </p>

              {selectedActivity.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-stone-200">
                  <img 
                    src={selectedActivity.imageUrl} 
                    alt={selectedActivity.title} 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="p-4 rounded-xl bg-burgundy/5 border border-burgundy/15 space-y-2">
                <h4 className="text-xs font-bold text-burgundy uppercase tracking-wider">আমাদের প্রতিশ্রুতি</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  সহৃদয় ফাউন্ডেশন প্রতিটি কার্যক্রমে সর্বোচ্চ স্বচ্ছতা ও মানবিক দায়িত্ববোধ বজায় রেখে মানুষের সেবায় নিবেদিত।
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold transition-colors"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  setSelectedActivity(null);
                  onOpenJoin();
                }}
                className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                এই কার্যক্রমে যুক্ত হোন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
