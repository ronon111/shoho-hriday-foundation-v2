import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Layers, 
  Image as ImageIcon, 
  Sparkles, 
  Info, 
  PhoneCall, 
  Settings as SettingsIcon, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export type AdminTab = 
  | 'dashboard'
  | 'messages'
  | 'notices'
  | 'activities'
  | 'gallery'
  | 'initiatives'
  | 'about'
  | 'contact'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  newMessagesCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  newMessagesCount = 0,
  children
}) => {
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as AdminTab, label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { 
      id: 'messages' as AdminTab, 
      label: 'বার্তা ও আবেদন', 
      icon: Inbox, 
      badge: newMessagesCount > 0 ? newMessagesCount : undefined 
    },
    { id: 'notices' as AdminTab, label: 'নোটিশ বোর্ড (Notices)', icon: Bell },
    { id: 'activities' as AdminTab, label: 'কার্যক্রম (Activities)', icon: Layers },
    { id: 'gallery' as AdminTab, label: 'গ্যালারি (Gallery)', icon: ImageIcon },
    { id: 'initiatives' as AdminTab, label: 'পরিকল্পনা (Initiatives)', icon: Sparkles },
    { id: 'about' as AdminTab, label: 'পরিচিতি (About)', icon: Info },
    { id: 'contact' as AdminTab, label: 'যোগাযোগ ও সোশ্যাল', icon: PhoneCall },
    { id: 'settings' as AdminTab, label: 'সেটিংস (Settings)', icon: SettingsIcon },
  ];

  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] flex flex-col md:flex-row text-charcoal">
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="text-xs font-bold text-burgundy bg-burgundy/10 px-2 py-0.5 rounded-md">অ্যাডমিন</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-stone-600 hover:text-burgundy rounded-lg hover:bg-stone-100"
          aria-label="Toggle navigation"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside 
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <div>
                <span className="text-[10px] font-bold text-burgundy tracking-wider uppercase block">এডমিন প্যানেল</span>
                <span className="text-xs font-serif font-bold text-charcoal">সহৃদয় ফাউন্ডেশন</span>
              </div>
            </div>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2 text-xs text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="truncate">
              <span className="text-[11px] text-stone-400 block">অনুমোদিত প্রশাসক:</span>
              <span className="font-mono text-[11px] font-semibold text-charcoal truncate block" title={user?.email || ''}>
                {user?.email}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-burgundy text-white shadow-xs font-semibold' 
                      : 'text-stone-600 hover:bg-stone-100 hover:text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-burgundy' : 'bg-red-500 text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions: View Public Website & Logout */}
          <div className="p-4 border-t border-stone-100 space-y-2">
            <button
              onClick={onExitAdmin}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 hover:text-charcoal transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-stone-400" />
              <span>মূল ওয়েবসাইটে ফিরে যান</span>
            </button>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>লগআউট করুন</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Admin Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
};
