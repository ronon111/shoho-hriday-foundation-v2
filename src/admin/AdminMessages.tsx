import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Trash2, 
  Check, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { SubmissionItem, SubmissionStatus, SubmissionType } from '../types';
import { updateSubmissionStatus, updateSubmissionNote, deleteSubmission } from '../services/firestoreService';

interface AdminMessagesProps {
  submissions: SubmissionItem[];
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ submissions }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [adminNoteText, setAdminNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  // Filter & Search
  const filteredSubmissions = submissions.filter((sub) => {
    if (typeFilter !== 'all' && sub.type !== typeFilter) return false;
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.name?.toLowerCase().includes(q);
      const matchPhone = sub.phone?.toLowerCase().includes(q);
      const matchEmail = sub.email?.toLowerCase().includes(q);
      const matchMsg = sub.message?.toLowerCase().includes(q);
      const matchOrg = sub.organization?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchMsg && !matchOrg) return false;
    }
    return true;
  }).sort((a, b) => {
    const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
    const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const handleOpenDetail = (sub: SubmissionItem) => {
    setSelectedSubmission(sub);
    setAdminNoteText(sub.adminNote || '');
    setNoteSaved(false);
    // Automatically mark new as read upon opening
    if (sub.status === 'new') {
      updateSubmissionStatus(sub.id, 'read');
    }
  };

  const handleStatusChange = async (id: string, status: SubmissionStatus) => {
    try {
      await updateSubmissionStatus(id, status);
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedSubmission) return;
    setSavingNote(true);
    setNoteSaved(false);
    try {
      await updateSubmissionNote(selectedSubmission.id, adminNoteText);
      setSelectedSubmission({ ...selectedSubmission, adminNote: adminNoteText });
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই আবেদন বা বার্তাটি মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।')) return;
    try {
      await deleteSubmission(id);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeBadge = (type: SubmissionType) => {
    switch (type) {
      case 'member_application':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">সদস্য আবেদন</span>;
      case 'volunteer_application':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">স্বেচ্ছাসেবক</span>;
      case 'support_request':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">সহযোগিতা</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">যোগাযোগ</span>;
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">নতুন</span>;
      case 'read':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">পঠিত</span>;
      case 'replied':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">উত্তর দেওয়া</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-200 text-stone-600">সম্পন্ন</span>;
    }
  };

  const formatTimestamp = (createdAt: any) => {
    if (!createdAt) return 'আজকে';
    if (createdAt.seconds) {
      const d = new Date(createdAt.seconds * 1000);
      return d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return 'পূর্বে';
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Title & Stats Ribbon */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal flex items-center gap-2">
              <Inbox className="w-6 h-6 text-burgundy" />
              <span>Messages & Applications</span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              জনসাধারণের পাঠানো সদস্য আবেদন, স্বেচ্ছাসেবী নিবন্ধন, সহযোগিতার প্রস্তাব ও বার্তা পরিচালনা করুন
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-burgundy/10 text-burgundy">
              মোট: {submissions.length}টি
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500 text-white">
              নতুন: {submissions.filter(s => s.status === 'new').length}টি
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="pt-3 border-t border-stone-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="নাম, ফোন, ইমেইল বা বিষয় দিয়ে অনুসন্ধান..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-charcoal focus:outline-hidden focus:border-burgundy"
            >
              <option value="all">সব ধরন (All Types)</option>
              <option value="member_application">সদস্য আবেদন</option>
              <option value="volunteer_application">স্বেচ্ছাসেবক আবেদন</option>
              <option value="support_request">সহযোগিতা অনুরোধ</option>
              <option value="contact">সাধারণ বার্তা</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-charcoal focus:outline-hidden focus:border-burgundy"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="new">নতুন (New)</option>
              <option value="read">পঠিত (Read)</option>
              <option value="replied">উত্তর দেওয়া (Replied)</option>
              <option value="closed">সম্পন্ন (Closed)</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-600 hover:text-charcoal flex items-center gap-1.5 cursor-pointer"
              title="তারিখ অনুসারে সাজান"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'নতুন আগে' : 'পুরাতন আগে'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submissions List Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Inbox className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-serif text-base font-bold text-charcoal">কোনো ফলাফল পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500">আপনার ফিল্টার বা অনুসন্ধানের সাথে কোনো রেকর্ড মিলছে না।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                <tr>
                  <th className="px-6 py-3.5">নাম ও প্রতিষ্ঠান</th>
                  <th className="px-6 py-3.5">ধরন</th>
                  <th className="px-6 py-3.5">যোগাযোগ</th>
                  <th className="px-6 py-3.5">তারিখ</th>
                  <th className="px-6 py-3.5">স্ট্যাটাস</th>
                  <th className="px-6 py-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSubmissions.map((sub) => {
                  const isNew = sub.status === 'new';
                  return (
                    <tr 
                      key={sub.id} 
                      className={`hover:bg-stone-50/80 transition-colors cursor-pointer ${
                        isNew ? 'bg-red-50/20 font-medium' : ''
                      }`}
                      onClick={() => handleOpenDetail(sub)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isNew && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                          <div>
                            <span className="font-bold text-charcoal block">{sub.name}</span>
                            {sub.organization && (
                              <span className="text-[11px] text-stone-500 block">{sub.organization}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getTypeBadge(sub.type)}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        <div>
                          {sub.phone && <div>{sub.phone}</div>}
                          {sub.email && <div className="text-stone-400">{sub.email}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-500 whitespace-nowrap">
                        {formatTimestamp(sub.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(sub)}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-burgundy hover:text-white text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                          >
                            দেখুন
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-300">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-stone-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {getTypeBadge(selectedSubmission.type)}
                <div>
                  <h3 className="font-serif text-xl font-bold text-charcoal">{selectedSubmission.name}</h3>
                  <span className="text-xs text-stone-400">{formatTimestamp(selectedSubmission.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Status Action Buttons */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-stone-600">স্ট্যাটাস পরিবর্তন করুন:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'new')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      selectedSubmission.status === 'new' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    নতুন
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'read')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      selectedSubmission.status === 'read' 
                        ? 'bg-stone-700 text-white' 
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    পঠিত
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'replied')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      selectedSubmission.status === 'replied' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    উত্তর দেওয়া হয়েছে
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'closed')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      selectedSubmission.status === 'closed' 
                        ? 'bg-stone-900 text-white' 
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    সম্পন্ন
                  </button>
                </div>
              </div>

              {/* Contact Information Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSubmission.phone && (
                  <div className="p-3.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-burgundy" />
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold">ফোন নম্বর</span>
                        <a href={`tel:${selectedSubmission.phone}`} className="text-xs font-bold text-charcoal hover:text-burgundy">
                          {selectedSubmission.phone}
                        </a>
                      </div>
                    </div>
                    <a 
                      href={`tel:${selectedSubmission.phone}`} 
                      className="px-2.5 py-1 rounded-lg bg-burgundy/10 text-burgundy text-xs font-semibold hover:bg-burgundy hover:text-white transition-colors"
                    >
                      কল দিন
                    </a>
                  </div>
                )}

                {selectedSubmission.email && (
                  <div className="p-3.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Mail className="w-4 h-4 text-burgundy shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-stone-400 block font-semibold">ইমেইল</span>
                        <a href={`mailto:${selectedSubmission.email}`} className="text-xs font-bold text-charcoal hover:text-burgundy truncate block">
                          {selectedSubmission.email}
                        </a>
                      </div>
                    </div>
                    <a 
                      href={`mailto:${selectedSubmission.email}`} 
                      className="px-2.5 py-1 rounded-lg bg-burgundy/10 text-burgundy text-xs font-semibold hover:bg-burgundy hover:text-white transition-colors shrink-0"
                    >
                      ইমেইল
                    </a>
                  </div>
                )}
              </div>

              {/* Type specific extra fields */}
              {(selectedSubmission.address || selectedSubmission.location || selectedSubmission.interest || selectedSubmission.experience || selectedSubmission.organization || selectedSubmission.supportType || selectedSubmission.subject) && (
                <div className="bg-surface p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                  <h4 className="font-semibold text-charcoal uppercase tracking-wider text-[11px] mb-2">আবেদনের অতিরিক্ত তথ্য:</h4>
                  
                  {selectedSubmission.organization && (
                    <div className="flex items-start gap-2">
                      <span className="text-stone-400 font-semibold w-24 shrink-0">প্রতিষ্ঠান:</span>
                      <span className="text-charcoal font-medium">{selectedSubmission.organization}</span>
                    </div>
                  )}

                  {selectedSubmission.supportType && (
                    <div className="flex items-start gap-2">
                      <span className="text-stone-400 font-semibold w-24 shrink-0">সহায়তার ধরন:</span>
                      <span className="text-charcoal font-medium">{selectedSubmission.supportType}</span>
                    </div>
                  )}

                  {selectedSubmission.interest && (
                    <div className="flex items-start gap-2">
                      <span className="text-stone-400 font-semibold w-24 shrink-0">আগ্রহের ক্ষেত্র:</span>
                      <span className="text-charcoal font-medium">{selectedSubmission.interest}</span>
                    </div>
                  )}

                  {selectedSubmission.location && (
                    <div className="flex items-start gap-2">
                      <span className="text-stone-400 font-semibold w-24 shrink-0">লোকেশন / এলাকা:</span>
                      <span className="text-charcoal font-medium">{selectedSubmission.location}</span>
                    </div>
                  )}

                  {selectedSubmission.address && (
                    <div className="flex items-start gap-2">
                      <span className="text-stone-400 font-semibold w-24 shrink-0">ঠিকানা:</span>
                      <span className="text-charcoal font-medium">{selectedSubmission.address}</span>
                    </div>
                  )}

                  {selectedSubmission.experience && (
                    <div className="flex items-start gap-2">
                      <span className="text-stone-400 font-semibold w-24 shrink-0">পূর্ব অভিজ্ঞতা:</span>
                      <span className="text-charcoal font-medium">{selectedSubmission.experience}</span>
                    </div>
                  )}

                  {selectedSubmission.subject && (
                    <div className="flex items-start gap-2">
                      <span className="text-stone-400 font-semibold w-24 shrink-0">বিষয়:</span>
                      <span className="text-charcoal font-medium">{selectedSubmission.subject}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Main Message Body */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  মূল বার্তা / বক্তব্য:
                </h4>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Private Admin Notes */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-burgundy" />
                    <span>প্রশাসনিক ব্যক্তিগত নোট (শুধুমাত্র অ্যাডমিন দেখবেন)</span>
                  </h4>
                  {noteSaved && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> নোট সংরক্ষিত হয়েছে
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={adminNoteText}
                  onChange={(e) => setAdminNoteText(e.target.value)}
                  placeholder="এই আবেদন সম্পর্কে কোনো মন্তব্য, ফলোআপ তারিখ বা যোগাযোগ নোট এখানে লিখে রাখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-burgundy focus:ring-1 focus:ring-burgundy"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    disabled={savingNote}
                    className="px-4 py-2 rounded-xl bg-charcoal text-white hover:bg-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {savingNote ? 'সংরক্ষণ হচ্ছে...' : 'নোট সংরক্ষণ করুন'}
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedSubmission.id)}
                className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>আবেদনটি মুছে ফেলুন</span>
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
