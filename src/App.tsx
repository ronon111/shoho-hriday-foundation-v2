import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  SiteSettings, 
  AboutData, 
  ContactData, 
  ActivityItem, 
  GalleryItem, 
  InitiativeItem, 
  NoticeItem,
  SubmissionItem 
} from './types';
import { 
  defaultSettings, 
  defaultAbout, 
  defaultContact, 
  subscribeSettings, 
  subscribeAbout, 
  subscribeContact, 
  subscribeActivities, 
  subscribeGallery, 
  subscribeInitiatives, 
  subscribeNotices,
  subscribeSubmissions 
} from './services/firestoreService';

// Public Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NoticeSection } from './components/NoticeSection';
import { AboutSection } from './components/AboutSection';
import { PurposeSection } from './components/PurposeSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { GallerySection } from './components/GallerySection';
import { FutureProjectsSection } from './components/FutureProjectsSection';
import { GetInvolvedSection } from './components/GetInvolvedSection';
import { HumanityQuote } from './components/HumanityQuote';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Modals
import { VolunteerModal } from './components/VolunteerModal';
import { SupportModal } from './components/SupportModal';
import { MemberModal } from './components/MemberModal';

// Admin Components
import { AdminLayout, AdminTab } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminMessages } from './admin/AdminMessages';
import { AdminNotices } from './admin/AdminNotices';
import { AdminActivities } from './admin/AdminActivities';
import { AdminGallery } from './admin/AdminGallery';
import { AdminInitiatives } from './admin/AdminInitiatives';
import { AdminAbout } from './admin/AdminAbout';
import { AdminContact } from './admin/AdminContact';
import { AdminSettings } from './admin/AdminSettings';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Public modals state
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isMemberOpen, setIsMemberOpen] = useState(false);

  // Live Firestore State with initial defaults
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [about, setAbout] = useState<AboutData>(defaultAbout);
  const [contact, setContact] = useState<ContactData>(defaultContact);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [initiatives, setInitiatives] = useState<InitiativeItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  // Section loading states for skeleton screens
  const [loadingAbout, setLoadingAbout] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingNotices, setLoadingNotices] = useState(true);

  // Navigation Routing: Check whether current URL is in Admin mode
  const checkIsAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.startsWith('/admin') || hash.startsWith('#admin') || hash.startsWith('#/admin');
  };

  const [isAdminView, setIsAdminView] = useState(checkIsAdminRoute);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Handle URL changes & browser history
  useEffect(() => {
    const handleUrlChange = () => {
      const isAdm = checkIsAdminRoute();
      setIsAdminView(isAdm);

      // Check sub-routes like #/admin/messages, #/admin/notices
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('messages')) setAdminTab('messages');
      else if (hash.includes('notices')) setAdminTab('notices');
      else if (hash.includes('activities')) setAdminTab('activities');
      else if (hash.includes('gallery')) setAdminTab('gallery');
      else if (hash.includes('initiatives')) setAdminTab('initiatives');
      else if (hash.includes('about')) setAdminTab('about');
      else if (hash.includes('contact')) setAdminTab('contact');
      else if (hash.includes('settings')) setAdminTab('settings');
      else if (hash.includes('dashboard')) setAdminTab('dashboard');
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#/admin/dashboard';
    setIsAdminView(true);
  };

  const navigateToSite = () => {
    window.location.hash = '';
    window.history.pushState(null, '', '/');
    setIsAdminView(false);
  };

  // Subscribe to public Firestore content
  useEffect(() => {
    const unsubSettings = subscribeSettings((data) => {
      setSettings(data);
      if (data.seoTitle) {
        document.title = data.seoTitle;
      }
      if (data.seoDescription) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', data.seoDescription);
      }
    });

    const unsubAbout = subscribeAbout((data) => {
      setAbout(data);
      setLoadingAbout(false);
    });
    const unsubContact = subscribeContact((data) => setContact(data));
    const unsubActivities = subscribeActivities((data) => {
      setActivities(data);
      setLoadingActivities(false);
    }, isAdmin);
    const unsubGallery = subscribeGallery((data) => {
      setGalleryItems(data);
      setLoadingGallery(false);
    }, isAdmin);
    const unsubInitiatives = subscribeInitiatives((data) => setInitiatives(data), isAdmin);
    const unsubNotices = subscribeNotices((data) => {
      setNotices(data);
      setLoadingNotices(false);
    }, isAdmin);

    return () => {
      unsubSettings();
      unsubAbout();
      unsubContact();
      unsubActivities();
      unsubGallery();
      unsubInitiatives();
      unsubNotices();
    };
  }, [isAdmin]);

  // Subscribe to submissions when authenticated admin
  useEffect(() => {
    if (isAdmin && user) {
      try {
        const unsubSubmissions = subscribeSubmissions((items) => {
          setSubmissions(items);
        });
        return () => unsubSubmissions();
      } catch (err) {
        console.warn("Submissions subscription waiting for auth verification.", err);
      }
    } else {
      setSubmissions([]);
    }
  }, [isAdmin, user]);

  const newSubmissionsCount = submissions.filter((s) => s.status === 'new').length;

  // ================= ADMIN VIEW =================
  if (isAdminView) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-burgundy animate-spin mb-3" />
          <p className="text-xs text-stone-500">অনুমোদন যাচাই করা হচ্ছে...</p>
        </div>
      );
    }

    if (!user || !isAdmin) {
      return (
        <AdminLogin 
          onBackToSite={navigateToSite}
          onLoginSuccess={() => setAdminTab('dashboard')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => {
          setAdminTab(tab);
          window.location.hash = `#/admin/${tab}`;
        }}
        onExitAdmin={navigateToSite}
        newMessagesCount={newSubmissionsCount}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            submissions={submissions}
            activities={activities}
            galleryItems={galleryItems}
            initiatives={initiatives}
            notices={notices}
            onNavigateTab={(tab) => {
              setAdminTab(tab);
              window.location.hash = `#/admin/${tab}`;
            }}
          />
        )}

        {adminTab === 'messages' && (
          <AdminMessages submissions={submissions} />
        )}

        {adminTab === 'notices' && (
          <AdminNotices notices={notices} />
        )}

        {adminTab === 'activities' && (
          <AdminActivities activities={activities} />
        )}

        {adminTab === 'gallery' && (
          <AdminGallery galleryItems={galleryItems} />
        )}

        {adminTab === 'initiatives' && (
          <AdminInitiatives initiatives={initiatives} />
        )}

        {adminTab === 'about' && (
          <AdminAbout about={about} />
        )}

        {adminTab === 'contact' && (
          <AdminContact contact={contact} />
        )}

        {adminTab === 'settings' && (
          <AdminSettings settings={settings} />
        )}
      </AdminLayout>
    );
  }

  // ================= PUBLIC WEBSITE VIEW =================
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans text-charcoal selection:bg-burgundy selection:text-white">
      
      {/* Sticky Header Navbar */}
      <Navbar 
        settings={settings}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenVolunteer={() => setIsVolunteerOpen(true)}
        onOpenMember={() => setIsMemberOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          settings={settings}
          onOpenJoin={() => setIsMemberOpen(true)}
        />

        {/* Notice Board Section */}
        <NoticeSection notices={notices} loading={loadingNotices} />

        {/* About Section */}
        <AboutSection about={about} loading={loadingAbout} />

        {/* Purpose / Pillars Section */}
        <PurposeSection />

        {/* Activities Section */}
        <ActivitiesSection 
          activities={activities}
          onOpenJoin={() => setIsVolunteerOpen(true)}
          loading={loadingActivities}
        />

        {/* Photo Gallery Section */}
        <GallerySection items={galleryItems} loading={loadingGallery} />

        {/* Future Initiatives Section */}
        <FutureProjectsSection initiatives={initiatives} />

        {/* Get Involved / Call to Action */}
        <GetInvolvedSection 
          onOpenVolunteer={() => setIsVolunteerOpen(true)}
          onOpenSupport={() => setIsSupportOpen(true)}
          onOpenMember={() => setIsMemberOpen(true)}
        />

        {/* Humanity Quote */}
        <HumanityQuote />

        {/* Contact Section */}
        <ContactSection contact={contact} />
      </main>

      {/* Footer */}
      <Footer 
        settings={settings}
        contact={contact}
        onNavigateAdmin={navigateToAdmin}
      />

      {/* Public Modals (No visitor login required) */}
      <MemberModal
        isOpen={isMemberOpen}
        onClose={() => setIsMemberOpen(false)}
      />

      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
