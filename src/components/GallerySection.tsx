import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Camera, Image as ImageIcon, X, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  items: GalleryItem[];
  loading?: boolean;
}

const galleryContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    }
  }
};

const galleryCardVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    }
  }
};

export const GallerySection: React.FC<GallerySectionProps> = ({ items, loading = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['সব', ...Array.from(new Set(items.map(item => item.category || 'অন্যান্য')))];

  const filteredItems = selectedCategory === 'সব' 
    ? items 
    : items.filter(item => (item.category || 'অন্যান্য') === selectedCategory);

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const nextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredItems.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else {
      setLightboxIndex(0);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else {
      setLightboxIndex(filteredItems.length - 1);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-white relative scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>স্মৃতির অ্যালবাম</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold mb-4">
            আমাদের কাজের কিছু মুহূর্ত
          </h2>
          <div className="w-12 h-0.5 bg-burgundy/40 mx-auto mb-4" />
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            মাঠপর্যায়ে মানুষের পাশে দাঁড়ানোর বাস্তব চিত্র ও কার্যক্রমের স্মৃতিমালা।
          </p>
        </motion.div>

        {/* Gallery Content or Skeleton */}
        {loading ? (
          <>
            {/* Category Skeleton */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-pulse">
              <div className="h-7 w-16 rounded-full bg-stone-200" />
              <div className="h-7 w-24 rounded-full bg-stone-200" />
              <div className="h-7 w-20 rounded-full bg-stone-200" />
            </div>

            {/* Gallery Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl bg-stone-200/80 animate-pulse aspect-4/3 relative overflow-hidden flex flex-col justify-end p-5 border border-stone-200 shadow-2xs"
                >
                  <div className="h-3 w-20 rounded bg-stone-300 mb-2" />
                  <div className="h-4.5 w-3/4 rounded bg-stone-300 mb-1.5" />
                  <div className="h-3 w-1/3 rounded bg-stone-300/70" />
                </div>
              ))}
            </div>
          </>
        ) : items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto bg-surface rounded-3xl p-10 sm:p-14 text-center border border-dashed border-stone-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto mb-5 shadow-xs">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
              ছবি শীঘ্রই যুক্ত হবে
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
              আমাদের কার্যক্রমের ছবিগুলো খুব শিগগিরই এখানে যুক্ত হবে। আমরা শুধুমাত্র ফাউন্ডেশনের বাস্তব মানবিক কাজের মূল ছবি প্রদর্শন করি।
            </p>
          </motion.div>
        ) : (
          <>
            {/* Category Filter */}
            {categories.length > 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-2 mb-10"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-burgundy text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Gallery Grid */}
            <motion.div 
              variants={galleryContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  variants={galleryCardVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer aspect-4/3 shadow-xs hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
                      {item.category || 'কার্যক্রম'}
                    </span>
                    <h4 className="font-serif text-base font-bold leading-snug">{item.title}</h4>
                    {item.date && (
                      <p className="text-[11px] text-white/80 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-stone-950 text-white z-10 border-b border-white/20">
              <div className="flex items-center gap-3">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-burgundy text-white font-medium">
                  {activeLightboxItem.category || 'সহৃদয় ফটো'}
                </span>
                <span className="text-xs text-stone-400">
                  {lightboxIndex + 1} / {filteredItems.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
              />

              {/* Prev / Next buttons */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Caption Footer */}
            <div className="p-5 bg-stone-950 text-white border-t border-white/10">
              <h3 className="font-serif text-lg font-bold">{activeLightboxItem.title}</h3>
              {activeLightboxItem.caption && (
                <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                  {activeLightboxItem.caption}
                </p>
              )}
              {activeLightboxItem.date && (
                <div className="mt-3 flex items-center gap-4 text-xs text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    {activeLightboxItem.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-stone-500" />
                    {activeLightboxItem.category || 'অন্যান্য'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
