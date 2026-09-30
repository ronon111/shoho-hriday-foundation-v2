import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { 
  SiteSettings, 
  AboutData, 
  ContactData, 
  ActivityItem, 
  GalleryItem, 
  InitiativeItem, 
  NoticeItem,
  SubmissionItem,
  SubmissionStatus
} from '../types';

// Default initial data for fallback and seeding
export const defaultSettings: SiteSettings = {
  siteName: "সহৃদয় ফাউন্ডেশন",
  englishName: "SHOHO RIDAY FOUNDATION",
  tagline: "মানুষের পাশে, মানবতার পথে।",
  primaryColor: "#8F1537",
  seoTitle: "সহৃদয় ফাউন্ডেশন | মানুষের পাশে, মানবতার পথে",
  seoDescription: "সহৃদয় ফাউন্ডেশন—মানবিক সহায়তা, সামাজিক দায়িত্ব ও মানুষের পাশে দাঁড়ানোর একটি উদ্যোগ।",
  footerText: "© 2026 Shoho Riday Foundation. All rights reserved."
};

export const defaultAbout: AboutData = {
  title: "সহৃদয় সম্পর্কে",
  description: "সহৃদয় ফাউন্ডেশন মানুষের পাশে দাঁড়ানো, মানবিক সহায়তা প্রদান এবং সমাজে ইতিবাচক পরিবর্তনে অবদান রাখার লক্ষ্য নিয়ে কাজ করে। আমাদের বিশ্বাস—একটি ছোট সহায়তাও কারও জীবনে বড় পরিবর্তনের কারণ হতে পারে।",
  mission: "প্রয়োজনে মানুষের পাশে দাঁড়ানো, জরুরি সহায়তা পৌঁছে দেওয়া এবং অসহায় ও সুবিধাবঞ্চিত মানুষদের সহায়তা করা।",
  vision: "এমন একটি সমাজ গড়ে তোলা যেখানে সহমর্মিতা, সমবেদনা ও পারস্পরিক দায়িত্ববোধ প্রতিটি নাগরিকের জীবনের অংশ হবে।",
  values: "মানবতা, সহমর্মিতা, পারস্পরিক শ্রদ্ধা, স্বচ্ছতা এবং নিঃস্বার্থ সেবা।"
};

export const defaultContact: ContactData = {
  email: "shohoridayfoundation@gmail.com",
  phone1: "+8801301557701",
  phone2: "+8801334403339",
  address: "ঢাকা, বাংলাদেশ",
  facebook: "https://www.facebook.com/share/1K3qXH7wC2/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/shohoriday?stkn=MTVhNzQ3aXE1am5xZA=="
};

export const defaultActivities: Omit<ActivityItem, 'id'>[] = [
  {
    title: "খাদ্য সহায়তা",
    description: "প্রয়োজনীয় মানুষের কাছে খাদ্য ও নিত্যপ্রয়োজনীয় পুষ্টিকর সামগ্রী পৌঁছে দেওয়া এবং অনাহারমুক্ত সমাজ গড়ায় অংশ নেওয়া।",
    icon: "Utensils",
    imageUrl: "",
    order: 1,
    published: true
  },
  {
    title: "শীতবস্ত্র বিতরণ",
    description: "শীতকালে শীতার্ত, অসহায় ও সুবিধাবঞ্চিত মানুষের পাশে উষ্ণ পোশাক ও কম্বল নিয়ে দাঁড়ানো।",
    icon: "HeartHandshake",
    imageUrl: "",
    order: 2,
    published: true
  },
  {
    title: "শিক্ষা সহায়তা",
    description: "আর্থিক প্রতিকূলতায় থাকা শিক্ষার্থীদের শিক্ষাসামগ্রী ও শিক্ষামূলক উদ্যোগে প্রয়োজনীয় সহায়তা দেওয়া।",
    icon: "GraduationCap",
    imageUrl: "",
    order: 3,
    published: true
  },
  {
    title: "স্বাস্থ্য সহায়তা",
    description: "জরুরি চিকিৎসা সহায়তা ও স্বাস্থ্য সচেতনতামূলক বিভিন্ন কার্যক্রমে সহযোগিতা প্রদান।",
    icon: "Stethoscope",
    imageUrl: "",
    order: 4,
    published: true
  },
  {
    title: "রক্তদান ও জরুরি সহায়তা",
    description: "জরুরি সময়ে মুমূর্ষু রোগীর পাশে দাঁড়ানো, রক্তদানে উদ্বুদ্ধকরণ এবং স্বেচ্ছাসেবী দল গঠন।",
    icon: "Droplets",
    imageUrl: "",
    order: 5,
    published: true
  },
  {
    title: "অন্যান্য সামাজিক উদ্যোগ",
    description: "সময় ও প্রয়োজন অনুযায়ী বিভিন্ন মানবিক, পরিবেশগত এবং সামাজিক সচেতনতামূলক কার্যক্রম গ্রহণ।",
    icon: "Sparkles",
    imageUrl: "",
    order: 6,
    published: true
  }
];

export const defaultInitiatives: Omit<InitiativeItem, 'id'>[] = [
  {
    title: "শিক্ষা সহায়তা কর্মসূচি",
    description: "অসহায় পরিবারের শিক্ষার্থীদের জন্য খাতা, বই ও শিক্ষা উপকরণ বিতরণের প্রাথমিক প্রস্তুতি।",
    icon: "BookOpen",
    status: "পরিকল্পিত উদ্যোগ",
    order: 1,
    published: true
  },
  {
    title: "শীতকালীন উষ্ণতা ক্যাম্পেইন",
    description: "আসন্ন শীত মৌসুমের শুরুতে প্রান্তিক গ্রামগুলোতে উষ্ণ বস্ত্র ও কম্বল সহায়তা পৌঁছানোর পরিকল্পনা।",
    icon: "Wind",
    status: "পরিকল্পিত উদ্যোগ",
    order: 2,
    published: true
  },
  {
    title: "প্রাথমিক স্বাস্থ্য ও সচেতনতা",
    description: "প্রান্তিক পর্যায়ে মৌলিক স্বাস্থ্য পরীক্ষা ও সচেতনতা সেশনের খসড়া প্রস্তুতি।",
    icon: "Activity",
    status: "পরিকল্পিত উদ্যোগ",
    order: 3,
    published: true
  },
  {
    title: "স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক",
    description: "জরুরি রক্তের প্রয়োজনে দ্রুত ডোনার খুঁজে পাওয়ার জন্য একটি স্বেচ্ছাসেবী ডিজিটাল নেটওয়ার্ক গঠন।",
    icon: "Droplet",
    status: "পরিকল্পিত উদ্যোগ",
    order: 4,
    published: true
  },
  {
    title: "দুর্যোগকালীন জরুরি সেল",
    description: "বন্যা বা যেকোনো প্রাকৃতিক দুর্যোগে তাৎক্ষণিক ত্রাণসামগ্রী পৌঁছানোর স্বেচ্ছাসেবী টিম প্রস্তুত রাখা।",
    icon: "ShieldAlert",
    status: "পরিকল্পিত উদ্যোগ",
    order: 5,
    published: true
  },
  {
    title: "সামাজিক সচেতনতামূলক কর্মশালা",
    description: "যুবসমাজকে মানবিক মূল্যবোধ ও সামাজিক দায়িত্ববোধে উদ্বুদ্ধ করার মুক্ত আলোচনা।",
    icon: "Users",
    status: "পরিকল্পিত উদ্যোগ",
    order: 6,
    published: true
  }
];

export const defaultNotices: Omit<NoticeItem, 'id'>[] = [
  {
    title: "শীতবস্ত্র বিতরণ কর্মসূচি",
    description: "শীতার্ত মানুষের পাশে দাঁড়াতে আমাদের পরবর্তী উদ্যোগের প্রস্তুতি চলছে।",
    date: "৩০ সেপ্টেম্বর ২০২৬",
    category: "আসন্ন কার্যক্রম",
    order: 1,
    published: true
  }
];

// Subscriptions for Public and Admin
export function subscribeSettings(callback: (data: SiteSettings) => void) {
  const docRef = doc(db, 'settings', 'site');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ ...defaultSettings, ...(docSnap.data() as SiteSettings) });
    } else {
      callback(defaultSettings);
    }
  }, (err) => {
    console.warn("Could not fetch remote settings, using defaults.", err.message);
    callback(defaultSettings);
  });
}

export function subscribeAbout(callback: (data: AboutData) => void) {
  const docRef = doc(db, 'about', 'main');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ ...defaultAbout, ...(docSnap.data() as AboutData) });
    } else {
      callback(defaultAbout);
    }
  }, (err) => {
    console.warn("Could not fetch remote about info, using defaults.", err.message);
    callback(defaultAbout);
  });
}

export function subscribeContact(callback: (data: ContactData) => void) {
  const docRef = doc(db, 'contact', 'main');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ ...defaultContact, ...(docSnap.data() as ContactData) });
    } else {
      callback(defaultContact);
    }
  }, (err) => {
    console.warn("Could not fetch remote contact info, using defaults.", err.message);
    callback(defaultContact);
  });
}

export function subscribeActivities(callback: (items: ActivityItem[]) => void, adminMode = false) {
  const colRef = collection(db, 'activities');
  const q = query(colRef, orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const items: ActivityItem[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        if (adminMode || data.published !== false) {
          items.push({ id: d.id, ...data } as ActivityItem);
        }
      });
      callback(items);
    } else {
      // If empty, return defaults with local IDs
      const fallback = defaultActivities.map((act, idx) => ({ id: `default-${idx + 1}`, ...act }));
      callback(fallback);
    }
  }, (err) => {
    console.warn("Could not fetch remote activities, using defaults.", err.message);
    const fallback = defaultActivities.map((act, idx) => ({ id: `default-${idx + 1}`, ...act }));
    callback(fallback);
  });
}

export function subscribeGallery(callback: (items: GalleryItem[]) => void, adminMode = false) {
  const colRef = collection(db, 'gallery');
  return onSnapshot(colRef, (snapshot) => {
    const items: GalleryItem[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      if (adminMode || data.published !== false) {
        items.push({ id: d.id, ...data } as GalleryItem);
      }
    });
    callback(items);
  }, (err) => {
    console.warn("Could not fetch gallery items.", err.message);
    callback([]);
  });
}

export function subscribeInitiatives(callback: (items: InitiativeItem[]) => void, adminMode = false) {
  const colRef = collection(db, 'initiatives');
  const q = query(colRef, orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const items: InitiativeItem[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        if (adminMode || data.published !== false) {
          items.push({ id: d.id, ...data } as InitiativeItem);
        }
      });
      callback(items);
    } else {
      const fallback = defaultInitiatives.map((ini, idx) => ({ id: `init-${idx + 1}`, ...ini }));
      callback(fallback);
    }
  }, (err) => {
    console.warn("Could not fetch remote initiatives, using defaults.", err.message);
    const fallback = defaultInitiatives.map((ini, idx) => ({ id: `init-${idx + 1}`, ...ini }));
    callback(fallback);
  });
}

export function subscribeNotices(callback: (items: NoticeItem[]) => void, adminMode = false) {
  const colRef = collection(db, 'notices');
  return onSnapshot(colRef, (snapshot) => {
    const items: NoticeItem[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      if (adminMode || data.published !== false) {
        items.push({ id: d.id, ...data } as NoticeItem);
      }
    });
    // Sort newest notice first
    items.sort((a, b) => {
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.order || 0);
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.order || 0);
      return timeB - timeA;
    });
    callback(items);
  }, (err) => {
    console.warn("Could not fetch notices, using defaults.", err.message);
    const fallback = defaultNotices.map((n, idx) => ({ id: `default-notice-${idx + 1}`, ...n }));
    callback(fallback);
  });
}

export function subscribeSubmissions(callback: (items: SubmissionItem[]) => void) {
  const colRef = collection(db, 'submissions');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items: SubmissionItem[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as SubmissionItem);
    });
    callback(items);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'submissions');
  });
}

// Public Submission Creator with Anti-Spam Protection
export async function createPublicSubmission(data: {
  type: 'member_application' | 'volunteer_application' | 'support_request' | 'contact';
  name: string;
  phone: string;
  email: string;
  message: string;
  address?: string;
  location?: string;
  interest?: string;
  experience?: string;
  organization?: string;
  supportType?: string;
  subject?: string;
  honeypot?: string; // Bot trap
}): Promise<void> {
  // Honeypot detection
  if (data.honeypot && data.honeypot.trim().length > 0) {
    console.warn("Honeypot triggered. Silently dropping bot submission.");
    return;
  }

  // Client-side rate limiting (10 seconds debounce between submissions)
  const lastSubmitKey = `last_submit_${data.type}`;
  const lastSubmitTime = localStorage.getItem(lastSubmitKey);
  const now = Date.now();
  if (lastSubmitTime && now - parseInt(lastSubmitTime, 10) < 10000) {
    throw new Error('অনুগ্রহ করে একটু অপেক্ষা করে পুনরায় জমা দিন।');
  }

  // Input sanitization
  const trimmedName = data.name.trim();
  const trimmedMessage = data.message.trim();
  const trimmedPhone = data.phone.trim();
  const trimmedEmail = data.email.trim();

  if (!trimmedName) throw new Error('অনুগ্রহ করে আপনার নাম প্রদান করুন।');
  if (!trimmedPhone && !trimmedEmail) throw new Error('অনুগ্রহ করে অন্তত একটি যোগাযোগ নম্বর বা ইমেইল দিন।');
  if (!trimmedMessage) throw new Error('অনুগ্রহ করে বার্তা বা বিবরণ প্রদান করুন।');

  const payload: Record<string, any> = {
    type: data.type,
    status: 'new',
    name: trimmedName.slice(0, 200),
    phone: trimmedPhone.slice(0, 50),
    email: trimmedEmail.slice(0, 150),
    message: trimmedMessage.slice(0, 3000),
    createdAt: serverTimestamp()
  };

  if (data.address) payload.address = data.address.trim().slice(0, 500);
  if (data.location) payload.location = data.location.trim().slice(0, 200);
  if (data.interest) payload.interest = data.interest.trim().slice(0, 200);
  if (data.experience) payload.experience = data.experience.trim().slice(0, 1000);
  if (data.organization) payload.organization = data.organization.trim().slice(0, 200);
  if (data.supportType) payload.supportType = data.supportType.trim().slice(0, 200);
  if (data.subject) payload.subject = data.subject.trim().slice(0, 200);

  try {
    await addDoc(collection(db, 'submissions'), payload);
    localStorage.setItem(lastSubmitKey, now.toString());
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'submissions');
  }
}

// Admin Submissions Operations
export async function updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
  try {
    const docRef = doc(db, 'submissions', id);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `submissions/${id}`);
  }
}

export async function updateSubmissionNote(id: string, adminNote: string): Promise<void> {
  try {
    const docRef = doc(db, 'submissions', id);
    await updateDoc(docRef, { adminNote: adminNote.slice(0, 3000), updatedAt: serverTimestamp() });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `submissions/${id}`);
  }
}

export async function deleteSubmission(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'submissions', id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `submissions/${id}`);
  }
}

// Admin CMS Operations: Settings, About, Contact
export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const docRef = doc(db, 'settings', 'site');
    await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, 'settings/site');
  }
}

export async function updateAboutContent(about: Partial<AboutData>): Promise<void> {
  try {
    const docRef = doc(db, 'about', 'main');
    await setDoc(docRef, { ...about, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, 'about/main');
  }
}

export async function updateContactContent(contact: Partial<ContactData>): Promise<void> {
  try {
    const docRef = doc(db, 'contact', 'main');
    await setDoc(docRef, { ...contact, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, 'contact/main');
  }
}

// Admin CMS Operations: Activities
export async function saveActivity(activity: Partial<ActivityItem> & { id?: string }): Promise<void> {
  try {
    if (activity.id && !activity.id.startsWith('default-')) {
      const docRef = doc(db, 'activities', activity.id);
      await updateDoc(docRef, {
        title: activity.title,
        description: activity.description,
        icon: activity.icon || 'Sparkles',
        imageUrl: activity.imageUrl || '',
        order: Number(activity.order) || 1,
        published: activity.published ?? true,
        updatedAt: serverTimestamp()
      });
    } else {
      const colRef = collection(db, 'activities');
      await addDoc(colRef, {
        title: activity.title,
        description: activity.description,
        icon: activity.icon || 'Sparkles',
        imageUrl: activity.imageUrl || '',
        order: Number(activity.order) || 1,
        published: activity.published ?? true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'activities');
  }
}

export async function deleteActivity(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'activities', id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `activities/${id}`);
  }
}

// Admin CMS Operations: Gallery
export async function saveGalleryItem(item: Partial<GalleryItem> & { id?: string }): Promise<void> {
  try {
    if (item.id) {
      const docRef = doc(db, 'gallery', item.id);
      await updateDoc(docRef, {
        imageUrl: item.imageUrl,
        title: item.title,
        caption: item.caption || '',
        category: item.category || 'অন্যান্য',
        date: item.date || '',
        published: item.published ?? true,
        updatedAt: serverTimestamp()
      });
    } else {
      const colRef = collection(db, 'gallery');
      await addDoc(colRef, {
        imageUrl: item.imageUrl,
        title: item.title,
        caption: item.caption || '',
        category: item.category || 'অন্যান্য',
        date: item.date || '',
        published: item.published ?? true,
        createdAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'gallery');
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'gallery', id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
  }
}

// Admin CMS Operations: Initiatives
export async function saveInitiative(item: Partial<InitiativeItem> & { id?: string }): Promise<void> {
  try {
    if (item.id && !item.id.startsWith('init-')) {
      const docRef = doc(db, 'initiatives', item.id);
      await updateDoc(docRef, {
        title: item.title,
        description: item.description,
        icon: item.icon || 'Sparkles',
        status: item.status || 'পরিকল্পিত উদ্যোগ',
        order: Number(item.order) || 1,
        published: item.published ?? true,
        updatedAt: serverTimestamp()
      });
    } else {
      const colRef = collection(db, 'initiatives');
      await addDoc(colRef, {
        title: item.title,
        description: item.description,
        icon: item.icon || 'Sparkles',
        status: item.status || 'পরিকল্পিত উদ্যোগ',
        order: Number(item.order) || 1,
        published: item.published ?? true,
        createdAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'initiatives');
  }
}

export async function deleteInitiative(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'initiatives', id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `initiatives/${id}`);
  }
}

// Admin CMS Operations: Notice Board
export async function saveNotice(item: Partial<NoticeItem> & { id?: string }): Promise<void> {
  try {
    if (item.id && !item.id.startsWith('default-notice-')) {
      const docRef = doc(db, 'notices', item.id);
      await updateDoc(docRef, {
        title: item.title,
        description: item.description,
        date: item.date || '',
        category: item.category || 'সাধারণ',
        order: Number(item.order) || 1,
        published: item.published ?? true,
        updatedAt: serverTimestamp()
      });
    } else {
      const colRef = collection(db, 'notices');
      await addDoc(colRef, {
        title: item.title,
        description: item.description,
        date: item.date || new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
        category: item.category || 'সাধারণ',
        order: Number(item.order) || 1,
        published: item.published ?? true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'notices');
  }
}

export async function deleteNotice(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'notices', id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `notices/${id}`);
  }
}

// 1-Click Database Initializer for Admin
export async function seedInitialData(): Promise<{ success: boolean; message: string }> {
  try {
    const batch = writeBatch(db);

    // Settings
    const settingsRef = doc(db, 'settings', 'site');
    batch.set(settingsRef, { ...defaultSettings, updatedAt: serverTimestamp() }, { merge: true });

    // About
    const aboutRef = doc(db, 'about', 'main');
    batch.set(aboutRef, { ...defaultAbout, updatedAt: serverTimestamp() }, { merge: true });

    // Contact
    const contactRef = doc(db, 'contact', 'main');
    batch.set(contactRef, { ...defaultContact, updatedAt: serverTimestamp() }, { merge: true });

    await batch.commit();

    // Check activities
    const actSnap = await getDocs(collection(db, 'activities'));
    if (actSnap.empty) {
      for (const act of defaultActivities) {
        await addDoc(collection(db, 'activities'), {
          ...act,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }

    // Check initiatives
    const initSnap = await getDocs(collection(db, 'initiatives'));
    if (initSnap.empty) {
      for (const ini of defaultInitiatives) {
        await addDoc(collection(db, 'initiatives'), {
          ...ini,
          createdAt: serverTimestamp()
        });
      }
    }

    // Check notices
    const noticeSnap = await getDocs(collection(db, 'notices'));
    if (noticeSnap.empty) {
      for (const notif of defaultNotices) {
        await addDoc(collection(db, 'notices'), {
          ...notif,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }

    return { success: true, message: 'ডাটাবেজে প্রাথমিক সকল তথ্য সফলভাবে সংরক্ষিত হয়েছে।' };
  } catch (err: any) {
    console.error("Seed error:", err);
    return { success: false, message: 'ডাটাবেজ সিডিংয়ে সমস্যা হয়েছে: ' + (err.message || String(err)) };
  }
}
