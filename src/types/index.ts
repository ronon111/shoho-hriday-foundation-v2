export interface SiteSettings {
  siteName: string;
  englishName: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  seoTitle: string;
  seoDescription: string;
  footerText: string;
  updatedAt?: any;
}

export interface AboutData {
  title: string;
  description: string;
  mission: string;
  vision: string;
  values: string;
  updatedAt?: any;
}

export interface ContactData {
  email: string;
  phone1: string;
  phone2: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube?: string;
  updatedAt?: any;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
  order: number;
  published: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  caption?: string;
  category?: string;
  date?: string;
  published: boolean;
  createdAt?: any;
}

export interface InitiativeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: string;
  order: number;
  published: boolean;
  createdAt?: any;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category?: string;
  published: boolean;
  order?: number;
  createdAt?: any;
  updatedAt?: any;
}

export type SubmissionType = 
  | 'member_application'
  | 'volunteer_application'
  | 'support_request'
  | 'contact';

export type SubmissionStatus = 'new' | 'read' | 'replied' | 'closed';

export interface SubmissionItem {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  name: string;
  phone: string;
  email: string;
  message: string;
  // Specific to member_application
  address?: string;
  // Specific to volunteer_application
  location?: string;
  interest?: string;
  experience?: string;
  // Specific to support_request
  organization?: string;
  supportType?: string;
  // Specific to contact
  subject?: string;
  // Internal admin notes
  adminNote?: string;
  createdAt?: any;
}
