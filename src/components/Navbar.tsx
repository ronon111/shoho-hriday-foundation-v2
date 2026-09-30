import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Heart, ChevronDown, Bell } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  onOpenSupport: () => void;
  onOpenVolunteer: () => void;
  onOpenMember: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  settings, 
  onOpenSupport, 
  onOpenVolunteer, 
  onOpenMember 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinDropdownOpen, setJoinDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'হোম', href: '#home' },
    { label: 'নোটিশ বোর্ড', href: '#notices', icon: true },
    { label: 'আমাদের সম্পর্কে', href: '#about' },
    { label: 'আমাদের লক্ষ্য', href: '#purpose' },
    { label: 'আমাদের কার্যক্রম', href: '#activities' },
    { label: 'গ্যালারি', href: '#gallery' },
    { label: 'যোগাযোগ', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled 
            ? 'bg-white shadow-md py-3 border-b border-stone-300' 
            : 'bg-[#FAF8F3] py-4 border-b border-stone-300 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#home" 
              className="flex items-center gap-3 group focus:outline-hidden"
              aria-label="সহৃদয় ফাউন্ডেশন হোমপেজ"
            >
              <Logo size="md" />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="প্রধান নেভিগেশন">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-bold text-[#24252A] hover:text-[#8F1537] transition-colors relative py-1 focus:outline-hidden focus:text-[#8F1537] flex items-center gap-1.5"
                >
                  {link.icon && <Bell className="w-3.5 h-3.5 text-[#8F1537]" />}
                  <span>{link.label}</span>
                </a>
              ))}

              {/* "যুক্ত হোন" dropdown */}
              <div className="relative">
                <button
                  onClick={() => setJoinDropdownOpen(!joinDropdownOpen)}
                  onBlur={() => setTimeout(() => setJoinDropdownOpen(false), 200)}
                  className="flex items-center gap-1 text-sm font-bold text-[#24252A] hover:text-[#8F1537] transition-colors py-1 cursor-pointer"
                >
                  <span>যুক্ত হোন</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${joinDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {joinDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => { setJoinDropdownOpen(false); onOpenMember(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#24252A] hover:bg-[#8F1537]/10 hover:text-[#8F1537] transition-colors cursor-pointer"
                    >
                      সদস্য হোন
                    </button>
                    <button
                      onClick={() => { setJoinDropdownOpen(false); onOpenVolunteer(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#24252A] hover:bg-[#8F1537]/10 hover:text-[#8F1537] transition-colors cursor-pointer"
                    >
                      স্বেচ্ছাসেবক হোন
                    </button>
                    <button
                      onClick={() => { setJoinDropdownOpen(false); onOpenSupport(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#24252A] hover:bg-[#8F1537]/10 hover:text-[#8F1537] transition-colors cursor-pointer"
                    >
                      সহযোগিতা করুন
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop CTA Action */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={onOpenSupport}
                className="px-5 py-2.5 rounded-full bg-[#8F1537] hover:bg-[#72102B] text-white text-xs font-bold tracking-wide transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>সহযোগিতা করুন</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onOpenSupport}
                className="px-3 py-1.5 rounded-full bg-[#8F1537] text-white text-xs font-bold cursor-pointer"
              >
                সহযোগিতা
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#24252A] bg-white border border-stone-200 hover:text-[#8F1537] transition-colors focus:outline-hidden"
                aria-expanded={mobileMenuOpen}
                aria-label="মেনু খুলুন"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden animate-in fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white border-l border-stone-200 p-6 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="text-xs uppercase tracking-widest text-[#8F1537] font-bold">নেভিগেশন মেনু</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-black hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-bold text-[#24252A] hover:text-[#8F1537] py-2 px-3 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-2"
                  >
                    {link.icon && <Bell className="w-4 h-4 text-[#8F1537]" />}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-2">
                <p className="text-xs uppercase tracking-widest text-stone-500 font-bold mb-2">আমাদের সাথে যুক্ত হোন</p>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenMember(); }}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-[#24252A] hover:bg-stone-100 hover:text-[#8F1537] flex items-center justify-between cursor-pointer"
                >
                  <span>সদস্য হোন</span>
                  <span className="text-xs text-[#8F1537] bg-[#8F1537]/10 font-bold px-2.5 py-0.5 rounded-full">আবেদন</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenVolunteer(); }}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-[#24252A] hover:bg-stone-100 hover:text-[#8F1537] flex items-center justify-between cursor-pointer"
                >
                  <span>স্বেচ্ছাসেবক হোন</span>
                  <span className="text-xs text-[#8F1537] bg-[#8F1537]/10 font-bold px-2.5 py-0.5 rounded-full">যুক্ত হোন</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenSupport(); }}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-[#24252A] hover:bg-stone-100 hover:text-[#8F1537] flex items-center justify-between cursor-pointer"
                >
                  <span>সহযোগিতা করুন</span>
                  <span className="text-xs text-[#8F1537] bg-[#8F1537]/10 font-bold px-2.5 py-0.5 rounded-full">প্রস্তাব</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenSupport(); }}
                className="w-full py-3 rounded-xl bg-[#8F1537] hover:bg-[#72102B] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>সহযোগিতা করুন</span>
              </button>
              <p className="text-xs text-stone-600 font-medium text-center mt-3">
                {settings.tagline || 'মানুষের পাশে, মানবতার পথে।'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
