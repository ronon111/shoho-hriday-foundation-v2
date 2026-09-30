import React, { useState } from 'react';
import { 
  Inbox, 
  UserCheck, 
  Users, 
  Image as ImageIcon, 
  Layers, 
  PlusCircle, 
  ExternalLink, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  Sparkles,
  Bell
} from 'lucide-react';
import { SubmissionItem, ActivityItem, GalleryItem, InitiativeItem, NoticeItem } from '../types';
import { seedInitialData } from '../services/firestoreService';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  submissions: SubmissionItem[];
  activities: ActivityItem[];
  galleryItems: GalleryItem[];
  initiatives: InitiativeItem[];
  notices: NoticeItem[];
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  submissions,
  activities,
  galleryItems,
  initiatives,
  notices,
  onNavigateTab
}) => {
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{ success: boolean; message: string } | null>(null);

  const newCount = submissions.filter(s => s.status === 'new').length;
  const memberAppsCount = submissions.filter(s => s.type === 'member_application').length;
  const volunteerAppsCount = submissions.filter(s => s.type === 'volunteer_application').length;
  const supportCount = submissions.filter(s => s.type === 'support_request').length;

  const handleSeed = async () => {
    if (!confirm('আপনি কি ডাটাবেজে সহৃদয় ফাউন্ডেশনের অনুমোদিত প্রাথমিক তথ্যসমূহ (কার্যক্রম, পরিচিতি, যোগাযোগ ও সেটিংস) সিড করতে চান?')) return;
    setSeeding(true);
    setSeedStatus(null);
    try {
      const res = await seedInitialData();
      setSeedStatus(res);
    } catch (err: any) {
      setSeedStatus({ success: false, message: err.message || 'সিডিং ব্যর্থ হয়েছে' });
    } finally {
      setSeeding(false);
    }
  };

  const recentSubmissions = submissions.slice(0, 5);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'member_application':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">সদস্য আবেদন</span>;
      case 'volunteer_application':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">স্বেচ্ছাসেবক</span>;
      case 'support_request':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">সহযোগিতা</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">যোগাযোগ</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">নতুন</span>;
      case 'read':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600">পঠিত</span>;
      case 'replied':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">উত্তর দেওয়া</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-200 text-stone-600">সম্পন্ন</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">
            স্বাগতম, অ্যাডমিন প্যানেলে
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            সহৃদয় ফাউন্ডেশনের সমস্ত তথ্য, ইনবক্স ও কনটেন্ট পরিচালনা করুন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('messages')}
            className="px-4 py-2 rounded-xl bg-[#8F1537] hover:bg-[#72102B] text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>ইনবক্স দেখুন ({newCount})</span>
          </button>
          <button
            onClick={() => onNavigateTab('notices')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-[#24252A] border border-stone-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-[#8F1537]" />
            <span>নোটিশ বোর্ড ({notices.length})</span>
          </button>
          <button
            onClick={() => onNavigateTab('activities')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-[#24252A] border border-stone-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#8F1537]" />
            <span>নতুন Activity</span>
          </button>
          <button
            onClick={() => onNavigateTab('gallery')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-[#24252A] border border-stone-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#8F1537]" />
            <span>Gallery যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Database Seeder Alert */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="text-xs text-amber-900">
            <span className="font-bold block">ডাটাবেজ ইনিশিয়ালাইজেশন:</span>
            <span>ফাউন্ডেশনের প্রাথমিক কার্যক্রম, নোটিশ, পরিচিতি, এবং যোগাযোগ তথ্য ক্লাউড ফায়ারস্টোরে সিড বা আপডেট করুন।</span>
          </div>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
          <span>ডিফল্ট তথ্য সিড করুন</span>
        </button>
      </div>

      {seedStatus && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 border ${
          seedStatus.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {seedStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span>{seedStatus.message}</span>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Card 1: New Messages */}
        <div 
          onClick={() => onNavigateTab('messages')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-[#8F1537]/50 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">নতুন ইনবক্স</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${newCount > 0 ? 'bg-red-50 text-red-600' : 'bg-stone-50 text-stone-400'}`}>
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-[#24252A]">{newCount}</span>
            <span className="text-xs text-stone-400">/ মোট {submissions.length}</span>
          </div>
        </div>

        {/* Card 2: Notices */}
        <div 
          onClick={() => onNavigateTab('notices')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-[#8F1537]/50 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">নোটিশ বোর্ড</span>
            <div className="w-8 h-8 rounded-lg bg-[#8F1537]/10 text-[#8F1537] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-[#24252A]">{notices.length}</span>
            <span className="text-xs text-stone-400">টি নোটিশ</span>
          </div>
        </div>

        {/* Card 3: Member Apps */}
        <div 
          onClick={() => onNavigateTab('messages')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-[#8F1537]/50 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">সদস্য আবেদন</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-[#24252A]">{memberAppsCount}</span>
            <span className="text-xs text-stone-400">টি</span>
          </div>
        </div>

        {/* Card 4: Volunteer Apps */}
        <div 
          onClick={() => onNavigateTab('messages')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-[#8F1537]/50 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">স্বেচ্ছাসেবক</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-[#24252A]">{volunteerAppsCount}</span>
            <span className="text-xs text-stone-400">টি</span>
          </div>
        </div>

        {/* Card 5: Gallery & Activities */}
        <div 
          onClick={() => onNavigateTab('activities')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-[#8F1537]/50 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">কার্যক্রম</span>
            <div className="w-8 h-8 rounded-lg bg-[#8F1537]/10 text-[#8F1537] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-[#24252A]">{activities.length}</span>
            <span className="text-xs text-stone-400">ক্ষেত্র</span>
          </div>
        </div>
      </div>

      {/* Recent Submissions Preview */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal">
              সাম্প্রতিক বার্তা ও আবেদন
            </h3>
            <p className="text-xs text-stone-500">সর্বশেষ প্রাপ্ত ৫টি পাবলিক সাবমিশন</p>
          </div>
          <button
            onClick={() => onNavigateTab('messages')}
            className="text-xs font-semibold text-burgundy hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>সব দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            এখনও কোনো আবেদন বা বার্তা জমা পড়েনি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                <tr>
                  <th className="px-6 py-3">নাম</th>
                  <th className="px-6 py-3">ধরনের ধরন</th>
                  <th className="px-6 py-3">যোগাযোগ</th>
                  <th className="px-6 py-3">স্ট্যাটাস</th>
                  <th className="px-6 py-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-charcoal">
                      {sub.name}
                    </td>
                    <td className="px-6 py-4">
                      {getTypeBadge(sub.type)}
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {sub.phone || sub.email || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onNavigateTab('messages')}
                        className="text-burgundy hover:underline font-semibold cursor-pointer"
                      >
                        বিস্তারিত
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
